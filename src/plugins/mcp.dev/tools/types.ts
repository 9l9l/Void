/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export interface ModuleArgs {
    action:
        | "find"
        | "findAll"
        | "findBulk"
        | "findComponent"
        | "findModuleId"
        | "exports"
        | "stats"
        | "source"
        | "diff"
        | "imports"
        | "namedExports"
        | "load"
        | "loadChunks"
        | "findByFactory"
        | "mapMangled"
        | "css"
        | "unloaded"
        | "whereUsed"
        | "suggest"
        | "functionAt";
    props?: string[];
    code?: string[];
    id?: number;
    offset?: number;
    limit?: number;
    patched?: boolean;
    search?: string;
    async?: boolean;
    mappers?: Record<string, string>;
    pattern?: string;
    filters?: Array<{ props?: string[]; code?: string[] }>;
    displayName?: string;
    storeName?: string;
    componentByCode?: boolean;
}

export interface SearchArgs {
    pattern?: string;
    and?: string[];
    id?: number;
    max?: number;
    context?: number;
    filter?: "loaded" | "unloaded";
    count?: boolean;
}

export interface EvalArgs {
    code?: string;
}

export interface PatchArgs {
    action: "test" | "analyze" | "list" | "conflicts" | "broken" | "lint" | "context";
    find?: string;
    match?: string;
    replace?: string;
    flags?: string;
    window?: number;
    context?: number;
}

export interface PluginArgs {
    action: "list" | "enable" | "disable" | "toggle" | "settings" | "setSetting";
    name?: string;
    key?: string;
    value?: unknown;
}

export interface ReactArgs {
    action: "find" | "root" | "query" | "fiber" | "props" | "hooks" | "state" | "tree" | "owner";
    selector?: string;
    componentName?: string;
    depth?: number;
    limit?: number;
    includeProps?: boolean;
    breadth?: number;
}

export interface StoreArgs {
    action: "list" | "get" | "keys" | "methods" | "call" | "subscribe";
    query?: string | number;
    path?: string;
    depth?: number;
    method?: string;
    callArgs?: unknown[];
    duration?: number;
    maxCaptures?: number;
}

export interface GrokArgs {
    action: "context" | "features" | "models" | "route" | "settings" | "performance";
    filter?: string;
}

export interface InterceptArgs {
    action: "set" | "get" | "stop" | "list";
    moduleId?: number;
    exportKey?: string;
    id?: number;
    duration?: number;
    maxCaptures?: number;
}

export interface BatchArgs {
    calls?: Array<{ tool: string; arguments?: Record<string, unknown> }>;
}

export type ToolArgs = ModuleArgs | SearchArgs | EvalArgs | PatchArgs | PluginArgs | ReactArgs | StoreArgs | GrokArgs | InterceptArgs | BatchArgs;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Tool dispatch sends untyped JSON from WS; each handler narrows internally.
export type ToolHandler = (args: any) => unknown;
