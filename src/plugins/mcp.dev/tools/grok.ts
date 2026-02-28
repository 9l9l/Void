/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ChatPageStore, FeatureStore, ModelsStore, RoutingStore, SessionStore, SettingsStore } from "@turbopack/common";

import { GROK } from "./constants";
import type { GrokArgs, MemoryInfo } from "./types";
import { serialize } from "./utils";

const GROK_ACTIONS = ["context", "features", "models", "route", "settings", "performance"] as const;

export function handleGrok(args: GrokArgs): unknown {
    const { action } = args;

    if (action === "context") {
        const session = SessionStore.sessionStoreState?.getState();
        const settings = SettingsStore.useSettingsStore?.getState();
        const chatPage = ChatPageStore.useChatPageStore?.getState();

        const result: Record<string, unknown> = {
            user: session?.user ? { id: session.user.userId, tier: session.user.sessionTierId } : null,
            incognito: settings?.isIncognito ?? null,
            model: chatPage?.activeModelId ?? null,
            conversation: chatPage?.conversationId ?? null,
            mode: chatPage?.conversationMode ?? null,
            reasoning: chatPage?.reasoningMode ?? null,
            route: RoutingStore.useRoutingStore?.getState()?.route ?? null,
        };
        if (session?.team) result.team = serialize(session.team, 1);
        if (session?.countryCode) result.country = session.countryCode;
        if (settings?.selectedLanguage) result.language = settings.selectedLanguage;
        if (chatPage?.isRateLimited) result.rateLimited = true;
        return result;
    }

    if (action === "features") {
        const state = FeatureStore.useFeatureStore?.getState();
        if (!state) return { error: "Feature store not available" };

        const { filter } = args;
        const { config } = state;
        if (!config || !Object.keys(config).length) return { status: state.status, count: 0 };

        const entries = Object.entries(config);
        if (!filter) return { status: state.status, count: entries.length, keys: entries.map(([k]) => k).sort() };

        const lower = filter.toLowerCase();
        const matched = entries.filter(([k]) => k.toLowerCase().includes(lower));
        return { status: state.status, matched: matched.length, features: Object.fromEntries(matched.slice(0, GROK.MAX_FEATURE_RESULTS)) };
    }

    if (action === "models") {
        const state = ModelsStore.useModelsStore?.getState();
        if (!state) return { error: "Models store not available" };

        return {
            models:
                state.models?.map(m => ({
                    id: m.modelId,
                    name: m.name,
                    mode: m.modelMode,
                    tags: m.tags,
                    badge: m.badgeText,
                })) ?? [],
            unavailable: state.unavailableModels?.length ?? 0,
            defaults: {
                anon: state.defaultAnonModelId,
                free: state.defaultFreeModelId,
                pro: state.defaultProModelId,
                heavy: state.defaultHeavyModelId,
            },
        };
    }

    if (action === "route") {
        const state = RoutingStore.useRoutingStore?.getState();
        if (!state) return { error: "Routing store not available" };
        return {
            route: state.route,
            historyStack: state.historyStack?.length ?? 0,
            url: location.href,
        };
    }

    if (action === "settings") {
        const state = SettingsStore.useSettingsStore?.getState();
        if (!state) return { error: "Settings store not available" };
        return serialize(
            {
                isIncognito: state.isIncognito,
                selectedLanguage: state.selectedLanguage,
                userSettings: state.userSettings,
                modelFamilyOverride: state.modelFamilyOverride,
                sideBySideMode: state.sideBySideMode,
                skipResponseCache: state.skipResponseCache,
                isModelOverrideHidden: state.isModelOverrideHidden,
            },
            3,
        );
    }

    if (action === "performance") {
        const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
        const mem = (performance as { memory?: MemoryInfo }).memory;
        return {
            timing: nav
                ? {
                      dns: Math.round(nav.domainLookupEnd - nav.domainLookupStart),
                      tcp: Math.round(nav.connectEnd - nav.connectStart),
                      ttfb: Math.round(nav.responseStart - nav.requestStart),
                      domContentLoaded: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
                      load: Math.round(nav.loadEventEnd - nav.startTime),
                  }
                : null,
            memory: mem
                ? {
                      used: Math.round(mem.usedJSHeapSize / GROK.BYTES_PER_MB),
                      total: Math.round(mem.totalJSHeapSize / GROK.BYTES_PER_MB),
                      limit: Math.round(mem.jsHeapSizeLimit / GROK.BYTES_PER_MB),
                  }
                : null,
            url: location.href,
            readyState: document.readyState,
        };
    }

    return { error: `Unknown action: ${action}`, validActions: GROK_ACTIONS };
}
