/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { initPluginManager, registerPlugin, startAllPlugins } from "@api/PluginManager";
import { _resolveReady, blacklistBadModules, getModuleCache, onCacheDiscovery, onModuleLoad, patchTurbopack, reportOrphanedPatches, rescanRuntimeModules } from "@turbopack/patchTurbopack";
import { Logger } from "@utils/Logger";
import { type Plugin, StartAt } from "@utils/types";

import Plugins from "~plugins";

export { dispatch, subscribe } from "@api/Events";
export { closeAllModals, closeModal, confirm, openModal } from "@api/Modals";
export { showToast, ToastType } from "@api/Notifications";
export { isPluginEnabled, plugins, registerPlugin, startPlugin, stopPlugin } from "@api/PluginManager";
export { Settings } from "@api/Settings";
export * as common from "@turbopack/common";
export { getModuleCache, getRuntimeFactoryRegistry, getRuntimeModuleCache, onceReady, patchReport, patchResults, patchStats } from "@turbopack/patchTurbopack";
export * from "@turbopack/turbopack";
export { Logger } from "@utils/Logger";

const logger = new Logger("TurbopackPatcher", "#8caaee");

const SETTLE_MS = 300;
const FALLBACK_MS = 8000;

function waitForModulesStable() {
    let settleTimer: ReturnType<typeof setTimeout> | null = null;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;
    let fired = false;

    const fire = () => {
        if (fired) return;
        fired = true;
        if (settleTimer) clearTimeout(settleTimer);
        if (fallbackTimer) clearTimeout(fallbackTimer);
        unsubLoad();
        unsubCache();
        rescanRuntimeModules();
        blacklistBadModules();
        _resolveReady();
        startAllPlugins(StartAt.TurbopackReady);
        reportOrphanedPatches();
        logger.info(`${getModuleCache().size} modules loaded, ready`);
    };

    const bump = () => {
        if (fired) return;
        if (settleTimer) clearTimeout(settleTimer);
        settleTimer = setTimeout(fire, SETTLE_MS);
    };

    const unsubLoad = onModuleLoad(bump);
    const unsubCache = onCacheDiscovery(bump);

    if (getModuleCache().size > 0) {
        bump();
    }

    fallbackTimer = setTimeout(fire, FALLBACK_MS);
}

export function init() {
    patchTurbopack();

    for (const name in Plugins) {
        registerPlugin(Plugins[name] as Plugin);
    }

    initPluginManager();

    startAllPlugins(StartAt.Init);

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => startAllPlugins(StartAt.DOMContentLoaded), { once: true });
    } else {
        startAllPlugins(StartAt.DOMContentLoaded);
    }

    waitForModulesStable();
}
