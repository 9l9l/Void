/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { initPluginManager, isPluginEnabled, plugins, registerPlugin, startAllPlugins, startPlugin } from "@api/PluginManager";
import { _resolveReady, blacklistBadModules, getModuleCache, onCacheDiscovery, onModuleLoad, patches, patchTurbopack, reportOrphanedPatches, rescanRuntimeModules } from "@turbopack/patchTurbopack";
import { Logger } from "@utils/Logger";
import { type Plugin, StartAt } from "@utils/types";

import Plugins from "~plugins";

export { addChatBarButton, removeChatBarButton } from "@api/ChatBarButtons";
export { dispatch, subscribe } from "@api/Events";
export { closeAllModals, closeModal, confirm, openModal } from "@api/Modals";
export { showToast, ToastType } from "@api/Notifications";
export { addPatch, isPluginEnabled, plugins, registerPlugin, startPlugin, stopPlugin } from "@api/PluginManager";
export { definePluginSettings, PlainSettings, Settings, SettingsStore } from "@api/Settings";
export * as common from "@turbopack/common";
export { getModuleCache, getRuntimeFactoryRegistry, getRuntimeModuleCache, getTurbopackHelpers, isBlacklisted, onceReady, patches, patchReport, patchResults, patchStats, syncLazyModules } from "@turbopack/patchTurbopack";
export * from "@turbopack/turbopack";
export { classes, classNameFactory, disableStyle, enableStyle, registerStyle } from "@utils/css";
export { makeLazy, proxyLazy } from "@utils/lazy";
export { Logger } from "@utils/Logger";
export { copyToClipboard, debounce, fetchExternal, formatCountdown, formatDuration, isNonNullish, isTruthy, mergeDefaults, onlyOnce, sleep } from "@utils/misc";
export { default as definePlugin, OptionType, StartAt } from "@utils/types";

const logger = new Logger("TurbopackPatcher", "#8caaee");

const SETTLE_MS = 300;
const MIN_MODULES_BEFORE_SETTLE = 50;
const FALLBACK_MS = 8000;
const RETRY_TIMEOUT_MS = 15000;
const ORPHAN_REPORT_DELAY_MS = 5000;

function deferOrphanReport() {
    const hasNonGlobal = patches.some(p => !p.all);
    if (!hasNonGlobal) return;

    const unsub = onModuleLoad(() => {
        if (!patches.some(p => !p.all)) {
            unsub();
            clearTimeout(timeout);
        }
    });
    const timeout = setTimeout(() => {
        unsub();
        reportOrphanedPatches();
    }, ORPHAN_REPORT_DELAY_MS);
}

function retryFailedPlugins() {
    const getFailed = () =>
        Object.values(plugins).filter(
            p => !p.started && isPluginEnabled(p.name) && (p.startAt ?? StartAt.Init) === StartAt.TurbopackReady,
        );

    if (!getFailed().length) return;

    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const tryRetry = () => {
        if (retryTimer) clearTimeout(retryTimer);
        retryTimer = setTimeout(() => {
            retryTimer = null;
            rescanRuntimeModules();
            for (const p of getFailed()) startPlugin(p, true);

            if (!getFailed().length) {
                unsub();
                clearTimeout(timeout);
                logger.info("All previously failed plugins started after late module load");
            }
        }, 200);
    };

    const unsub = onModuleLoad(tryRetry);

    const timeout = setTimeout(() => {
        unsub();
        if (retryTimer) clearTimeout(retryTimer);
        rescanRuntimeModules();
        const remaining = getFailed();
        for (const p of remaining) startPlugin(p, true);
        const stillFailed = getFailed();
        if (stillFailed.length) {
            logger.warn(`${stillFailed.length} plugin(s) still failed after retry window: ${stillFailed.map(p => p.name).join(", ")}`);
        }
    }, RETRY_TIMEOUT_MS);
}

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
        logger.info(`${getModuleCache().size} modules loaded, ready`);
        retryFailedPlugins();
        deferOrphanReport();
    };

    const bump = () => {
        if (fired) return;
        if (settleTimer) clearTimeout(settleTimer);
        if (getModuleCache().size >= MIN_MODULES_BEFORE_SETTLE) settleTimer = setTimeout(fire, SETTLE_MS);
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
