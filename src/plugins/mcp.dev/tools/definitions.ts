/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export const TOOL_DEFINITIONS = [
    {
        name: "module",
        description:
            "Find and inspect Turbopack modules. Actions: find (by props/code/displayName/storeName/componentByCode), findAll, findBulk (multi-filter single pass), findComponent (by name or code), findModuleId (by factory code), exports (list with types), stats (cache/factory counts), source (raw factory, paginate with offset/search/limit), diff (original vs patched), load/loadChunks (instantiate), findByFactory (find by factory source), mapMangled (map obfuscated exports), css (class modules), unloaded (list unloaded), whereUsed (reverse deps), suggest (unique anchors), functionAt (extract function body), imports (sync/async deps), namedExports (e.s() declarations).",
        inputSchema: {
            type: "object",
            properties: {
                action: {
                    type: "string",
                    enum: ["find", "findAll", "findBulk", "findComponent", "findModuleId", "exports", "stats", "source", "diff", "imports", "namedExports", "load", "loadChunks", "findByFactory", "mapMangled", "css", "unloaded", "whereUsed", "suggest", "functionAt"],
                },
                props: { type: "array", items: { type: "string" }, description: "Export property names (find/findComponent/css)." },
                code: { type: "array", items: { type: "string" }, description: "Code strings in factory/exported function (find/findByFactory/mapMangled/findComponent)." },
                displayName: { type: "string", description: "React displayName (find/findAll)." },
                storeName: { type: "string", description: "Zustand store name (find/findAll). Auto-converts to hook name." },
                componentByCode: { type: "boolean", description: "With code, also check $$typeof.type and .render (find/findAll)." },
                id: { type: "number", description: "Module ID (exports/source/diff/load/whereUsed/suggest/functionAt)." },
                offset: { type: "number", description: "Character offset for source action (for paginating large factories)." },
                limit: { type: "number", description: "Max chars for source/functionAt (max 50000), or max results for other actions." },
                patched: { type: "boolean", description: "Show patched source instead of original (source action)." },
                search: { type: "string", description: "Jump to string in source instead of offset (source)." },
                async: { type: "boolean", description: "Use async import instead of sync require (load)." },
                mappers: { type: "object", description: "Map obfuscated names: {name: filterType}. Types: fn/string/number/boolean/object/array/component/hasProps:a,b/code:pattern." },
                pattern: { type: "string", description: "Pattern to find in source (functionAt)." },
                filters: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            props: { type: "array", items: { type: "string" }, description: "Export property names." },
                            code: { type: "array", items: { type: "string" }, description: "Code strings in exported function." },
                        },
                    },
                    description: "Array of {props?, code?} filters for findBulk.",
                },
            },
            required: ["action"],
        },
    },
    {
        name: "search",
        description: "Search Turbopack factory source code. Returns module IDs + matched snippets. Supports plain text or /regex/flags. Use 'and' for multi-pattern AND. 'filter' for loaded/unloaded only. 'count' for count-only mode.",
        inputSchema: {
            type: "object",
            properties: {
                pattern: { type: "string", description: "Plain string or /regex/flags." },
                and: { type: "array", items: { type: "string" }, description: "Additional AND patterns (all must match same module)." },
                id: { type: "number", description: "Narrow to single module ID." },
                max: { type: "number", description: "Max results to return.", default: 10 },
                context: { type: "number", description: "Context chars around match (max 200).", default: 60 },
                filter: { type: "string", enum: ["loaded", "unloaded"], description: "Filter: loaded or unloaded only." },
                count: { type: "boolean", description: "Count-only mode (no snippets)." },
            },
            required: [],
        },
    },
    {
        name: "evaluateCode",
        description: "Execute JavaScript in grok.com page context. Returns serialized result. Access to page globals, DOM, Void APIs. Uses indirect eval (global scope).",
        inputSchema: {
            type: "object",
            properties: {
                code: { type: "string", description: "JavaScript code to evaluate." },
            },
            required: ["code"],
        },
    },
    {
        name: "patch",
        description: "Test and analyze Void patches. test: validate find+match+replace, returns status/diff/warnings/i18n context. analyze: check find uniqueness, detect shared factories. list: registered patches with status. conflicts: multi-plugin patches. broken: unconsumed patches with reasons. lint: regex quality check. context: wide source neighborhood with ranked anchors (i18n, flags, displayNames, exports).",
        inputSchema: {
            type: "object",
            properties: {
                action: {
                    type: "string",
                    enum: ["test", "analyze", "list", "conflicts", "broken", "lint", "context"],
                },
                find: { type: "string", description: "Unique string to locate target module (test/analyze/context)." },
                match: { type: "string", description: "Regex pattern as string, not /slashes/ (test)." },
                replace: { type: "string", description: "Replacement string ($1/$&/$self supported)." },
                flags: { type: "string", description: "Regex flags for match pattern (e.g. \"g\", \"gi\")." },
                window: { type: "number", description: "Context window chars (default 1500, max 5000)." },
                context: { type: "number", description: "Context chars around match (default 150, max 500)." },
            },
            required: ["action"],
        },
    },
    {
        name: "plugin",
        description: "Manage Void plugins. list: all with enabled/started. enable/disable/toggle: change state. settings: view config. setSetting: change setting by key.",
        inputSchema: {
            type: "object",
            properties: {
                action: {
                    type: "string",
                    enum: ["list", "enable", "disable", "toggle", "settings", "setSetting"],
                },
                name: { type: "string", description: "Plugin name (all actions except list)." },
                key: { type: "string", description: "Setting key (setSetting)." },
                value: { description: "Setting value, any JSON type (setSetting)." },
            },
            required: ["action"],
        },
    },
    {
        name: "react",
        description: "React/DOM inspector. find: components by name. root: all named components. query: DOM elements by selector. fiber: component tree upward. props/hooks/state: inspect component internals. tree: DOM subtree. owner: parent components.",
        inputSchema: {
            type: "object",
            properties: {
                action: { type: "string", enum: ["find", "root", "query", "fiber", "props", "hooks", "state", "tree", "owner"] },
                selector: { type: "string", description: "CSS selector (most actions except find/root)." },
                componentName: { type: "string", description: "Component name, partial match (find)." },
                depth: { type: "number", description: "Max traversal depth." },
                limit: { type: "number", description: "Max results." },
                includeProps: { type: "boolean", description: "Include prop keys in fiber output." },
                breadth: { type: "number", description: "Max children per node (tree)." },
            },
            required: ["action"],
        },
    },
    {
        name: "store",
        description: "Zustand store inspector. list: all stores with keys. get: read state (dot-path). keys: key types. methods: list functions. call: invoke method. subscribe: watch changes for duration.",
        inputSchema: {
            type: "object",
            properties: {
                action: { type: "string", enum: ["list", "get", "keys", "methods", "call", "subscribe"] },
                query: { description: "Module ID or store name." },
                path: { type: "string", description: "Dot path into state (get/subscribe)." },
                depth: { type: "number", description: "Serialization depth (max 4, default 2)." },
                method: { type: "string", description: "Method name (call)." },
                callArgs: { type: "array", description: "Method args (call)." },
                duration: { type: "number", description: "Watch duration ms, 1000-60000 (subscribe)." },
                maxCaptures: { type: "number", description: "Max changes to capture, max 200 (subscribe)." },
            },
            required: ["action"],
        },
    },
    {
        name: "grok",
        description: "Grok app context. context: user/session/model/conversation. features: feature flags (filter for values). models: available + defaults. route: current URL. settings: user prefs. performance: timing/memory.",
        inputSchema: {
            type: "object",
            properties: {
                action: { type: "string", enum: ["context", "features", "models", "route", "settings", "performance"] },
                filter: { type: "string", description: "Filter flags by name (features)." },
            },
            required: ["action"],
        },
    },
    {
        name: "intercept",
        description: "Function call interceptor. set: capture calls to module export. get: retrieve captured args/returns. stop: restore original. list: active intercepts. Supports dotted paths, auto-expires.",
        inputSchema: {
            type: "object",
            properties: {
                action: { type: "string", enum: ["set", "get", "stop", "list"] },
                moduleId: { type: "number", description: "Module ID (set)." },
                exportKey: { type: "string", description: "Export key or dotted path (default: 'default')." },
                id: { type: "number", description: "Intercept ID (get/stop)." },
                duration: { type: "number", description: "Auto-expire ms (5000-120000)." },
                maxCaptures: { type: "number", description: "Max calls to capture (max 200)." },
            },
            required: ["action"],
        },
    },
    {
        name: "reload",
        description: "Reload grok.com page. WebSocket drops and auto-reconnects.",
        inputSchema: {
            type: "object",
            properties: {},
            required: [],
        },
    },
] as const;
