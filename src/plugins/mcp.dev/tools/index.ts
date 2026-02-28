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
        resolve("Reloading page. Connection will drop and auto-reconnect.");
        setTimeout(() => location.reload(), MCP.RELOAD_DELAY);
    });
}

export const toolHandlers: Record<string, ToolHandler> = {
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
