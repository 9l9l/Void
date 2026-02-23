/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { MCP } from "./constants";
import { handleEval } from "./evaluate";
import { handleGrok } from "./grok";
import { handleIntercept } from "./intercept";
import { handleModule } from "./module";
import { handlePatch } from "./patch";
import { handlePlugin } from "./plugin";
import { handleReact } from "./react";
import { handleSearch } from "./search";
import { handleStore } from "./store";
import type { ToolHandler } from "./types";

export { TOOL_DEFINITIONS } from "./definitions";

function handleReload(): Promise<string> {
    return new Promise(resolve => {
        resolve("Reloading page. Connection will drop and auto-reconnect in a few seconds.");
        setTimeout(() => location.reload(), 200);
    });
}

const handlers: Record<string, ToolHandler> = {
    module: handleModule,
    search: handleSearch,
    evaluateCode: handleEval,
    patch: handlePatch,
    plugin: handlePlugin,
    react: handleReact,
    store: handleStore,
    grok: handleGrok,
    intercept: handleIntercept,
    reload: handleReload,
};

interface SingleResult {
    tool: string;
    result?: unknown;
    error?: string;
}

function executeSingle(tool: string, args: Record<string, unknown>): SingleResult | Promise<SingleResult> {
    const handler = handlers[tool];
    if (!handler) return { tool, error: `Unknown tool: ${tool}` };
    try {
        const result = handler(args);
        if (result != null && typeof (result as Promise<unknown>).then === "function") {
            return (result as Promise<unknown>).then(
                val => ({ tool, result: val }),
                (err: unknown) => ({ tool, error: err instanceof Error ? err.message : String(err) }),
            );
        }
        return { tool, result };
    } catch (err: unknown) {
        return { tool, error: err instanceof Error ? err.message : String(err) };
    }
}

function handleBatch(args: Record<string, unknown>): SingleResult[] | Promise<SingleResult[]> | string {
    const { calls } = args;
    if (!Array.isArray(calls) || !calls.length) return "Provide calls array: [{tool, arguments}, ...]";
    if (calls.length > MCP.MAX_BATCH_SIZE) return `Max ${MCP.MAX_BATCH_SIZE} calls per batch, got ${calls.length}`;

    const results = calls.map((call: Record<string, unknown>) => executeSingle(call.tool as string, (call.arguments as Record<string, unknown>) ?? {}));
    const hasAsync = results.some((r): r is Promise<SingleResult> => r != null && typeof (r as Promise<unknown>).then === "function");
    if (hasAsync) return Promise.all(results);
    return results as SingleResult[];
}

export const toolHandlers: Record<string, ToolHandler> = {
    ...handlers,
    batch: handleBatch,
};
