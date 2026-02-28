/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { ChatBarButtonRenderProps } from "@api/ChatBarButtons";
import { definePluginSettings } from "@api/Settings";
import { ChatBarButton, Separator } from "@components";
import { GaugeIcon } from "@components/icons";
import type { EffortRateLimits, RateLimitResponse } from "@grok-types";
import type { ModelId, ModelMode, RequestKind } from "@grok-types/enums";
import { React, useEffect, useState } from "@turbopack/common/react";
import { ChatPageStore, ModelsStore } from "@turbopack/common/stores";
import { ApiClients, ReasoningModeUtils } from "@turbopack/common/utils";
import { findExportedComponentLazy } from "@turbopack/turbopack";
import { Devs } from "@utils/constants";
import { Logger } from "@utils/Logger";
import { formatCountdown, formatDuration } from "@utils/misc";
import { useCountdown } from "@utils/react";
import definePlugin, { OptionType } from "@utils/types";

const logger = new Logger("RateLimitDisplay", "#ef9f76");

const settings = definePluginSettings({
    showMaxCount: {
        type: OptionType.BOOLEAN,
        description: "Show the maximum count alongside remaining.",
        default: true,
    },
});

const ClockIcon = findExportedComponentLazy("ClockIcon");

interface Usage {
    remaining: number;
    total: number;
    windowSeconds: number;
    waitSeconds: number | null;
}

const EMPTY: Usage = { remaining: -1, total: -1, windowSeconds: 0, waitSeconds: null };

function ceilWait(seconds?: number) {
    return seconds != null && seconds > 0 ? Math.ceil(seconds) : null;
}

function effortToUsage(effort: EffortRateLimits, totalTokens: number, windowSeconds: number): Usage {
    return {
        remaining: effort.remainingQueries,
        total: Math.floor(totalTokens / effort.cost),
        windowSeconds,
        waitSeconds: ceilWait(effort.waitTimeSeconds),
    };
}

function parse(data: RateLimitResponse, mode?: ModelMode): Usage {
    const windowSeconds = data.windowSizeSeconds;
    const tokenBudget = data.totalTokens ?? 0;

    if (tokenBudget > 0) {
        if (mode === "fast" && data.lowEffortRateLimits) return effortToUsage(data.lowEffortRateLimits, tokenBudget, windowSeconds);
        if (mode === "expert" && data.highEffortRateLimits) return effortToUsage(data.highEffortRateLimits, tokenBudget, windowSeconds);
        if (data.highEffortRateLimits) return effortToUsage(data.highEffortRateLimits, tokenBudget, windowSeconds);
        if (data.lowEffortRateLimits) return effortToUsage(data.lowEffortRateLimits, tokenBudget, windowSeconds);
        return { remaining: data.remainingTokens ?? 0, total: tokenBudget, windowSeconds, waitSeconds: ceilWait(data.waitTimeSeconds) };
    }

    if (data.totalQueries > 0) {
        return { remaining: data.remainingQueries, total: data.totalQueries, windowSeconds, waitSeconds: ceilWait(data.waitTimeSeconds) };
    }

    return { ...EMPTY, windowSeconds };
}

function fetchForModel(modelId: ModelId, requestKind: RequestKind): Promise<RateLimitResponse> {
    return ApiClients.rateLimitsApi.rateLimitsGetRateLimits({ body: { modelName: modelId, requestKind } });
}

function formatLabel(u: Usage, short?: boolean) {
    if (u.waitSeconds != null && u.waitSeconds > 0) return formatCountdown(u.waitSeconds);
    if (u.total < 0) return "...";
    if (u.total === 0) return "\u221e";
    return short || !settings.store.showMaxCount ? String(u.remaining) : `${u.remaining}/${u.total}`;
}

function SingleDisplay({ usage, iconOnly }: { usage: Usage; iconOnly: boolean }) {
    const wait = useCountdown(usage.waitSeconds);
    const limited = wait != null && wait > 0;
    const u = limited ? { ...usage, waitSeconds: wait } : usage;
    const reset = usage.windowSeconds > 0 ? `Resets every ${formatDuration(usage.windowSeconds)}` : "";
    const tooltip = iconOnly ? [formatLabel(u), reset].filter(Boolean).join(" \u00b7 ") : reset || undefined;

    return (
        <ChatBarButton icon={limited ? <ClockIcon size={18} /> : <GaugeIcon size={18} />} tooltip={tooltip} className={limited ? "text-fg-danger" : undefined} iconOnly={iconOnly}>
            {formatLabel(u)}
        </ChatBarButton>
    );
}

function AutoDisplay({ fast, expert, iconOnly }: { fast: Usage; expert: Usage; iconOnly: boolean }) {
    const fw = useCountdown(fast.waitSeconds);
    const ew = useCountdown(expert.waitSeconds);
    const fLimited = fw != null && fw > 0;
    const eLimited = ew != null && ew > 0;
    const limited = fLimited || eLimited;
    const f = fLimited ? { ...fast, waitSeconds: fw } : fast;
    const e = eLimited ? { ...expert, waitSeconds: ew } : expert;
    const windowSeconds = fast.windowSeconds ?? expert.windowSeconds;
    const reset = windowSeconds > 0 ? ` \u00b7 resets every ${formatDuration(windowSeconds)}` : "";

    return (
        <ChatBarButton
            icon={limited ? <ClockIcon size={18} /> : <GaugeIcon size={18} />}
            tooltip={`Fast ${formatLabel(f)} \u00b7 Expert ${formatLabel(e)}${reset}`}
            className={limited ? "text-fg-danger" : undefined}
            iconOnly={iconOnly}
        >
            {formatLabel(f, true)}
            <Separator orientation="vertical" className="mx-1 h-3 w-0.5" />
            {formatLabel(e, true)}
        </ChatBarButton>
    );
}

function RateLimitIndicator({ iconOnly }: ChatBarButtonRenderProps) {
    const modelMode = ChatPageStore.useChatPageStore(s => s.modelMode);
    const reasoningMode = ChatPageStore.useChatPageStore(s => s.reasoningMode);
    const conversationId = ChatPageStore.useChatPageStore(s => s.conversationId);
    const lastMessageId = ChatPageStore.useChatPageStore(s => s.lastMessageId);
    const streaming = ChatPageStore.useChatPageStore(s => !!s.streamedMessageId);
    const modelByMode = ModelsStore.useModelsStore(s => s.modelByMode);

    const [fast, setFast] = useState(EMPTY);
    const [expert, setExpert] = useState(EMPTY);
    const [single, setSingle] = useState(EMPTY);

    useEffect(() => {
        if (modelMode === "auto" && streaming) return;

        const requestKind = ReasoningModeUtils.reasoningModeToRequestKind?.(reasoningMode) ?? "DEFAULT";
        const logError = (err: any) => logger.error("Failed to fetch rate limits", err);
        let cancelled = false;

        if (modelMode === "auto") {
            const fastId = modelByMode?.fast?.modelId;
            const expertId = modelByMode?.expert?.modelId;
            if (!fastId && !expertId) return;

            const sharedModel = fastId === expertId;
            const targetId = fastId ?? expertId;

            if (sharedModel && targetId) {
                fetchForModel(targetId, requestKind)
                    .then(data => {
                        if (cancelled) return;
                        setFast(parse(data, "fast"));
                        setExpert(parse(data, "expert"));
                        setSingle(EMPTY);
                    })
                    .catch(logError);
            } else {
                Promise.all([fastId ? fetchForModel(fastId, requestKind) : null, expertId ? fetchForModel(expertId, requestKind) : null])
                    .then(([f, e]) => {
                        if (cancelled) return;
                        setFast(f ? parse(f, "fast") : EMPTY);
                        setExpert(e ? parse(e, "expert") : EMPTY);
                        setSingle(EMPTY);
                    })
                    .catch(logError);
            }
        } else {
            const modelId = modelByMode?.[modelMode]?.modelId;
            if (!modelId) return;

            fetchForModel(modelId, requestKind)
                .then(result => {
                    if (cancelled) return;
                    setFast(EMPTY);
                    setExpert(EMPTY);
                    setSingle(parse(result, modelMode));
                })
                .catch(logError);
        }

        return () => {
            cancelled = true;
        };
    }, [modelMode, reasoningMode, conversationId, lastMessageId, streaming, modelByMode]);

    if (modelMode === "auto") return <AutoDisplay fast={fast} expert={expert} iconOnly={iconOnly} />;
    return <SingleDisplay usage={single} iconOnly={iconOnly} />;
}

export default definePlugin({
    name: "RateLimitDisplay",
    description: "Shows rate limit usage next to the chat input.",
    authors: [Devs.Prism],
    settings,
    chatBarButton: { render: RateLimitIndicator },
});
