/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export const TOOL_DEFINITIONS = [
    {
        name: "module",
        description:
            "Find and inspect Turbopack modules. find: by props or code strings. findAll: find all matching modules. findBulk: resolve multiple filters in one cache pass. findComponent: find exported React component by name or by code. findModuleId: find module ID by factory code strings. exports: list all exports with types for a module ID. stats: cache and factory counts. source: view raw factory source code for a module ID (up to 8000 chars). diff: compare original vs patched factory source for a module ID. load: instantiate an unloaded module by ID. loadChunks: force-load lazy chunks by factory code anchor. findByFactory: find module by factory source code and return its exports. mapMangled: map obfuscated export names using type filters. css: find CSS class modules by class names. unloaded: list unloaded factory IDs with previews. whereUsed: find all modules that import a given module ID (reverse dependency). suggest: discover unique patch anchor strings for a module. functionAt: extract the full function body containing a pattern. Additional filters for find/findAll: displayName (React displayName), storeName (Zustand store name), componentByCode (true + code to search component source including $$typeof.type and .render).",
        inputSchema: {
            type: "object",
            properties: {
                action: {
                    type: "string",
                    enum: [
                        "find",
                        "findAll",
                        "findBulk",
                        "findComponent",
                        "findModuleId",
                        "exports",
                        "stats",
                        "source",
                        "diff",
                        "imports",
                        "namedExports",
                        "load",
                        "loadChunks",
                        "findByFactory",
                        "mapMangled",
                        "css",
                        "unloaded",
                        "whereUsed",
                        "suggest",
                        "functionAt",
                    ],
                    description: "Action to perform.",
                },
                props: { type: "array", items: { type: "string" }, description: "Export property names to search for (for find/findComponent/css actions)." },
                code: {
                    type: "array",
                    items: { type: "string" },
                    description: "Code strings that must appear in the factory or exported function source (for find/findByFactory/mapMangled/findComponent actions).",
                },
                displayName: { type: "string", description: "Find by React displayName (for find/findAll). Checks .displayName and .render.displayName." },
                storeName: { type: "string", description: "Find Zustand store by name (for find/findAll). Auto-converts to hook name (e.g. 'Session' → 'useSessionStore')." },
                componentByCode: { type: "boolean", description: "When true with code param, use componentByCode filter that also checks $$typeof.type and .render (for find/findAll)." },
                id: { type: "number", description: "Module ID for exports/source/diff/load/whereUsed/suggest/functionAt actions." },
                offset: { type: "number", description: "Character offset for source action (for paginating large factories)." },
                limit: { type: "number", description: "Max characters to return for source/functionAt action (max 50000), or max results for unloaded/whereUsed/findAll/suggest/exports/diff." },
                patched: { type: "boolean", description: "If true, show patched source instead of original (for source action)." },
                search: { type: "string", description: "Jump to this string in the source instead of using offset (for source action)." },
                async: { type: "boolean", description: "If true, use async import instead of sync require (for load action)." },
                mappers: {
                    type: "object",
                    description: "For mapMangled: { readableName: filterType }. Filter types: fn, string, number, boolean, object, array, component, hasProps:a,b, code:pattern.",
                },
                pattern: { type: "string", description: "String pattern to locate in module source (for functionAt action)." },
                filters: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            props: { type: "array", items: { type: "string" }, description: "Export property names." },
                            code: { type: "array", items: { type: "string" }, description: "Code strings in exported function." },
                        },
                    },
                    description: "For findBulk: array of filter objects, each with props or code. Resolves all in one cache pass.",
                },
            },
            required: ["action"],
        },
    },
    {
        name: "search",
        description:
            "Search all Turbopack factory source strings for a pattern. Returns module IDs and matched snippets with surrounding context. Supports plain text or regex with /pattern/flags syntax (e.g. /useState\\(/gi). Use 'and' for multi-pattern AND search. Use 'filter' to search only loaded or unloaded modules. Use 'count' for count-only mode.",
        inputSchema: {
            type: "object",
            properties: {
                pattern: { type: "string", description: "Search pattern. Plain string for literal match, or /regex/flags for regex search." },
                and: {
                    type: "array",
                    items: { type: "string" },
                    description: "Additional patterns that must ALL match the same module (AND search). Combine with pattern for multi-criteria matching.",
                },
                id: { type: "number", description: "Narrow search to a single module ID." },
                max: { type: "number", description: "Max results to return.", default: 10 },
                context: { type: "number", description: "Characters of context around each match (max 200).", default: 60 },
                filter: { type: "string", enum: ["loaded", "unloaded"], description: "Filter to only search loaded or unloaded modules." },
                count: { type: "boolean", description: "If true, return only the count of matching modules (much faster)." },
            },
            required: [],
        },
    },
    {
        name: "evaluateCode",
        description: "Execute JavaScript in the grok.com page context and return the serialized result. Has access to all page globals, DOM, and Void APIs.",
        inputSchema: {
            type: "object",
            properties: {
                code: { type: "string", description: "JavaScript code to evaluate. Uses indirect eval so runs in global scope." },
            },
            required: ["code"],
        },
    },
    {
        name: "patch",
        description:
            "Test and analyze Void patches against live module source. test: validates find+match+replace, returns status (VALID/FIND_NO_MATCH/MATCH_FAILED/INVALID_REGEX), matched text, before/after diff, regex warnings, capture groups, and nearby i18n keys for context. For shared factories (multiple IDs, same source), test still validates the match and includes sharedFactory flag. Detects multiple matches, no-op replacements. analyze: checks if a find string uniquely targets one module, flags shared factories, shows wide context around matches. list: shows all registered patches with replacement previews (match + replace). conflicts: modules patched by multiple plugins. broken: unconsumed patches with detailed reasons (find miss vs match regex miss) and no-effect patch enumeration. lint: analyze a match regex for quality issues (unbounded gaps, hardcoded vars, isolated patterns). context: show wide source neighborhood around a find match with extracted anchors (i18n keys, i18n namespaces, feature flags, displayNames, export names, string literals, JSX components, prop names) ranked by uniqueness — use this to find stable patch anchors.",
        inputSchema: {
            type: "object",
            properties: {
                action: {
                    type: "string",
                    enum: ["test", "analyze", "list", "conflicts", "broken", "lint", "context"],
                    description:
                        "test=validate full patch, analyze=check find uniqueness, list=show registered patches, lint=check regex quality, context=wide source neighborhood with anchor extraction.",
                },
                find: { type: "string", description: "Unique string to locate the target module factory (for test/analyze)." },
                match: { type: "string", description: "Regex pattern to match within the found module source (for test). Written as a string, not /slashes/." },
                replace: { type: "string", description: "Replacement string with $1, $&, $self support (for test)." },
                flags: { type: "string", description: 'Regex flags for match pattern (e.g. "g", "gi").' },
                window: { type: "number", description: "Context window size in chars for context action (default 1500, max 5000)." },
                context: { type: "number", description: "Context chars around match for test/analyze before/after output (default 150, max 500)." },
            },
            required: ["action"],
        },
    },
    {
        name: "plugin",
        description:
            "Manage Void plugins. list: all plugins with enabled/started status. enable/disable: start or stop a plugin. toggle: flip enabled state. settings: view plugin settings. setSetting: change a plugin setting by key.",
        inputSchema: {
            type: "object",
            properties: {
                action: {
                    type: "string",
                    enum: ["list", "enable", "disable", "toggle", "settings", "setSetting"],
                    description: "list=all plugins, enable/disable/toggle=change state, settings=view, setSetting=change value.",
                },
                name: { type: "string", description: "Plugin name (required for all actions except list)." },
                key: { type: "string", description: "Setting key (for setSetting action)." },
                value: { description: "Setting value (for setSetting action). Any JSON type." },
            },
            required: ["action"],
        },
    },
    {
        name: "react",
        description:
            "React/DOM inspector. find: components by name. root: all named components. query: DOM elements by CSS selector. fiber: component tree up from element. props: component props. hooks: hook values. state: useState values. tree: DOM subtree. owner: parent components.",
        inputSchema: {
            type: "object",
            properties: {
                action: { type: "string", enum: ["find", "root", "query", "fiber", "props", "hooks", "state", "tree", "owner"], description: "Action to perform." },
                selector: { type: "string", description: "CSS selector (required for most actions except find/root)." },
                componentName: { type: "string", description: "Component name to search for (partial match, for find action)." },
                depth: { type: "number", description: "Max traversal depth." },
                limit: { type: "number", description: "Max results." },
                includeProps: { type: "boolean", description: "Include prop keys in fiber output." },
                breadth: { type: "number", description: "Max children per node for tree action." },
            },
            required: ["action"],
        },
    },
    {
        name: "store",
        description:
            "Zustand store inspector. list: all stores with keys (auto-detects use*Store hook names). get: read state (dot-path). keys: key types. methods: list functions. call: invoke method. subscribe: watch changes for duration.",
        inputSchema: {
            type: "object",
            properties: {
                action: { type: "string", enum: ["list", "get", "keys", "methods", "call", "subscribe"], description: "Action to perform." },
                query: { description: "Module ID (number) or store name (string). Searches store names, hook names, and state keys." },
                path: { type: "string", description: "Dot path into state (for get/subscribe)." },
                depth: { type: "number", description: "Serialization depth (max 4, default 2)." },
                method: { type: "string", description: "Method name (for call)." },
                callArgs: { type: "array", description: "Method arguments (for call)." },
                duration: { type: "number", description: "Watch duration ms (1000-60000, for subscribe)." },
                maxCaptures: { type: "number", description: "Max changes to capture (max 200, for subscribe)." },
            },
            required: ["action"],
        },
    },
    {
        name: "grok",
        description:
            "Grok app context. context: user/session/model/conversation. features: feature flags (lists keys without filter, use filter param to get values). models: available models + defaults. route: current URL/route. settings: user prefs. performance: timing/memory.",
        inputSchema: {
            type: "object",
            properties: {
                action: { type: "string", enum: ["context", "features", "models", "route", "settings", "performance"], description: "Action to perform." },
                filter: { type: "string", description: "Filter feature flags by name (for features)." },
            },
            required: ["action"],
        },
    },
    {
        name: "intercept",
        description:
            "Function call interceptor. set: start capturing calls to a module export. get: retrieve captured args/returns. stop: restore original. list: active intercepts. Supports dotted paths. Auto-expires.",
        inputSchema: {
            type: "object",
            properties: {
                action: { type: "string", enum: ["set", "get", "stop", "list"], description: "set=capture, get=retrieve, stop=restore, list=active." },
                moduleId: { type: "number", description: "Module ID (for set)." },
                exportKey: { type: "string", description: "Export key or dotted path (default: 'default')." },
                id: { type: "number", description: "Intercept ID (for get/stop)." },
                duration: { type: "number", description: "Auto-expire ms (5000-120000)." },
                maxCaptures: { type: "number", description: "Max calls to capture (max 200)." },
            },
            required: ["action"],
        },
    },
    {
        name: "batch",
        description:
            "Execute multiple tool calls in a single round-trip. All calls run in parallel via Promise.all. Use this instead of separate calls when you need results from multiple tools at once. Returns array of {tool, result} or {tool, error} per call.",
        inputSchema: {
            type: "object",
            properties: {
                calls: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            tool: { type: "string", description: "Tool name (module, search, store, react, patch, plugin, grok, intercept, evaluateCode, reload)." },
                            arguments: { type: "object", description: "Arguments for the tool call." },
                        },
                        required: ["tool"],
                    },
                    description: "Array of tool calls to execute in parallel. Max 20.",
                },
            },
            required: ["calls"],
        },
    },
    {
        name: "reload",
        description:
            "Reload the Grok page. Useful after building new code or changing feature flag overrides. The WebSocket connection will drop and auto-reconnect in a few seconds. Wait a moment after calling before using other tools.",
        inputSchema: {
            type: "object",
            properties: {},
            required: [],
        },
    },
] as const;
