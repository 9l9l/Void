/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ChatBarButton, Text } from "@components";
import { GaugeIcon } from "@components/icons/GaugeIcon";
import type { EffortRateLimits, RateLimitResponse } from "@grok-types";
import type { ModelMode } from "@grok-types/enums";
import { React, useEffect, useRef, useState } from "@turbopack/common/react";
import { ChatPageStore, ModelsStore } from "@turbopack/common/stores";
import { ApiClients, ReasoningModeUtils } from "@turbopack/common/utils";
import { findExportedComponentLazy } from "@turbopack/turbopack";
import { Logger } from "@utils/Logger";
import { formatCountdown, formatDuration } from "@utils/misc";
import definePlugin from "@utils/types";

const logger = new Logger("RateLimitDisplay", "#ef9f76");

const ClockIcon = findExportedComponentLazy("ClockIcon");

interface Usage {
    remaining: number;
    total: number;
    windowSeconds: number;
    waitSeconds: number | null;
}

const EMPTY: Usage = { remaining: -1, total: -1, windowSeconds: 0, waitSeconds: null };

function effortToUsage(effort: EffortRateLimits, totalTokens: number, windowSeconds: number): Usage {
    const total = Math.floor(totalTokens / effort.cost);
    return {
        remaining: effort.remainingQueries,
        total,
        windowSeconds,
        waitSeconds: effort.waitTimeSeconds != null && effort.waitTimeSeconds > 0 ? Math.ceil(effort.waitTimeSeconds) : null,
    };
}

function parse(data: RateLimitResponse, mode?: "fast" | "expert"): Usage {
    const windowSeconds = data.windowSizeSeconds;
    const tokenBudget = data.totalTokens ?? 0;

    if (tokenBudget > 0) {
        if (mode === "fast" && data.lowEffortRateLimits) return effortToUsage(data.lowEffortRateLimits, tokenBudget, windowSeconds);
        if (mode === "expert" && data.highEffortRateLimits) return effortToUsage(data.highEffortRateLimits, tokenBudget, windowSeconds);
        if (data.highEffortRateLimits) return effortToUsage(data.highEffortRateLimits, tokenBudget, windowSeconds);
        if (data.lowEffortRateLimits) return effortToUsage(data.lowEffortRateLimits, tokenBudget, windowSeconds);
        const wait = data.waitTimeSeconds;
        return {
            remaining: data.remainingTokens ?? 0,
            total: tokenBudget,
            windowSeconds,
            waitSeconds: wait != null && wait > 0 ? Math.ceil(wait) : null,
        };
    }

    if (data.totalQueries > 0) {
        const wait = data.waitTimeSeconds;
        return {
            remaining: data.remainingQueries,
            total: data.totalQueries,
            windowSeconds,
            waitSeconds: wait != null && wait > 0 ? Math.ceil(wait) : null,
        };
    }

    return { ...EMPTY, windowSeconds };
}

function fetchForModel(modelId: string, requestKind: string): Promise<RateLimitResponse> {
    return ApiClients.rateLimitsApi.rateLimitsGetRateLimits({ body: { modelName: modelId, requestKind } });
}

function formatLabel(u: Usage, short?: boolean): string {
    if (u.waitSeconds != null && u.waitSeconds > 0) return formatCountdown(u.waitSeconds);
    if (u.total < 0) return "...";
    if (u.total === 0) return "\u221e";
    return short ? `${u.remaining}` : `${u.remaining}/${u.total}`;
}

function useCountdown(seconds: number | null): number | null {
    const [value, setValue] = useState(seconds);
    const prevRef = useRef(seconds);

    if (prevRef.current !== seconds) {
        prevRef.current = seconds;
        setValue(seconds);
    }

    useEffect(() => {
        if (value == null || value <= 0) return () => {};
        const id = setInterval(() => setValue(p => (p != null && p > 1 ? p - 1 : null)), 1000);
        return () => clearInterval(id);
    }, [value != null && value > 0]);

    return value;
}

function SingleDisplay({ usage }: { usage: Usage }) {
    const wait = useCountdown(usage.waitSeconds);
    const limited = wait != null && wait > 0;
    const tooltip = usage.windowSeconds > 0 ? `Resets every ${formatDuration(usage.windowSeconds)}` : undefined;
    const u = limited ? { ...usage, waitSeconds: wait } : usage;

    return (
        <ChatBarButton icon={limited ? <ClockIcon style={{ width: 18, height: 18 }} /> : <GaugeIcon size={18} />} tooltip={tooltip} style={limited ? { color: "hsl(var(--fg-danger))" } : undefined}>
            <Text as="span" style={{ lineHeight: 1 }}>
                {formatLabel(u)}
            </Text>
        </ChatBarButton>
    );
}

function AutoDisplay({ fast, expert }: { fast: Usage; expert: Usage }) {
    const fw = useCountdown(fast.waitSeconds);
    const ew = useCountdown(expert.waitSeconds);
    const fLimited = fw != null && fw > 0;
    const eLimited = ew != null && ew > 0;
    const limited = fLimited || eLimited;
    const f = fLimited ? { ...fast, waitSeconds: fw } : fast;
    const e = eLimited ? { ...expert, waitSeconds: ew } : expert;
    const windowSeconds = fast.windowSeconds || expert.windowSeconds;
    const reset = windowSeconds > 0 ? ` \u00b7 resets every ${formatDuration(windowSeconds)}` : "";

    return (
        <ChatBarButton
            icon={limited ? <ClockIcon style={{ width: 18, height: 18 }} /> : <GaugeIcon size={18} />}
            tooltip={`Fast ${formatLabel(f)} \u00b7 Expert ${formatLabel(e)}${reset}`}
            style={limited ? { color: "hsl(var(--fg-danger))" } : undefined}
        >
            <Text as="span" style={{ lineHeight: 1 }}>
                {formatLabel(f, true)}
                <Text as="span" style={{ opacity: 0.3 }}>
                    {" | "}
                </Text>
                {formatLabel(e, true)}
            </Text>
        </ChatBarButton>
    );
}

function RateLimitIndicator() {
    const modelMode = ChatPageStore.useChatPageStore(s => s.modelMode) as ModelMode;
    const reasoningMode = ChatPageStore.useChatPageStore(s => s.reasoningMode);
    const conversationId = ChatPageStore.useChatPageStore(s => s.conversationId);
    const lastMessageId = ChatPageStore.useChatPageStore(s => s.lastMessageId);
    const modelByMode = ModelsStore.useModelsStore(s => s.modelByMode);

    const [fast, setFast] = useState(EMPTY);
    const [expert, setExpert] = useState(EMPTY);
    const [single, setSingle] = useState(EMPTY);

    useEffect(() => {
        const requestKind = ReasoningModeUtils.reasoningModeToRequestKind?.(reasoningMode) ?? "DEFAULT";
        let cancelled = false;

        if (modelMode === "auto") {
            const fastId = modelByMode?.fast?.modelId;
            const expertId = modelByMode?.expert?.modelId;
            if (!fastId && !expertId) return () => {};

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
                    .catch((err: unknown) => logger.error("Failed to fetch rate limits", err));
            } else {
                Promise.all([fastId ? fetchForModel(fastId, requestKind) : null, expertId ? fetchForModel(expertId, requestKind) : null])
                    .then(([f, e]) => {
                        if (cancelled) return;
                        setFast(f ? parse(f, "fast") : EMPTY);
                        setExpert(e ? parse(e, "expert") : EMPTY);
                        setSingle(EMPTY);
                    })
                    .catch((err: unknown) => logger.error("Failed to fetch rate limits", err));
            }
        } else {
            const modelId = modelByMode?.[modelMode]?.modelId;
            if (!modelId) return () => {};

            fetchForModel(modelId, requestKind)
                .then(result => {
                    if (cancelled) return;
                    setFast(EMPTY);
                    setExpert(EMPTY);
                    setSingle(parse(result, modelMode as "fast" | "expert"));
                })
                .catch((err: unknown) => logger.error("Failed to fetch rate limits", err));
        }

        return () => {
            cancelled = true;
        };
    }, [modelMode, reasoningMode, conversationId, lastMessageId, modelByMode]);

    if (modelMode === "auto") return <AutoDisplay fast={fast} expert={expert} />;
    return <SingleDisplay usage={single} />;
}

export default definePlugin({
    name: "RateLimitDisplay",
    description: "Shows rate limit usage next to the chat input.",
    authors: ["Prism"],
    chatBarButton: { render: RateLimitIndicator },
});
