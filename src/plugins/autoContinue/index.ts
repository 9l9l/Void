/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { ChatPageStore, ResponseStore } from "@turbopack/common/stores";
import { Devs } from "@utils/constants";
import { Logger } from "@utils/Logger";
import definePlugin, { OptionType } from "@utils/types";

const logger = new Logger("AutoContinue", "#a6e3a1");

const settings = definePluginSettings({
    delay: {
        type: OptionType.SLIDER,
        description: "Delay in seconds before automatically retrying.",
        min: 1,
        max: 15,
        default: 3,
    },
    maxRetries: {
        type: OptionType.SLIDER,
        description: "Maximum number of automatic retries per response.",
        min: 1,
        max: 10,
        default: 3,
    },
});

let timer: ReturnType<typeof setTimeout> | null = null;
let attempts = 0;
let lastAttemptTime = 0;
const retriedIds = new Set<string>();

function scheduleRetry(fn: () => void) {
    if (timer) clearTimeout(timer);
    if (Date.now() - lastAttemptTime > 30_000) attempts = 0;

    if (attempts >= settings.store.maxRetries) {
        logger.info(`Reached max retries (${settings.store.maxRetries})`);
        return;
    }

    logger.info(`Auto-retrying in ${settings.store.delay}s (attempt ${attempts + 1}/${settings.store.maxRetries})`);

    timer = setTimeout(() => {
        attempts++;
        lastAttemptTime = Date.now();
        timer = null;
        fn();
    }, settings.store.delay * 1000);
}

export default definePlugin({
    name: "AutoContinue",
    description: "Automatically retries when Grok fails to respond.",
    authors: [Devs.Prism],
    settings,

    stop() {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        attempts = 0;
        retriedIds.clear();
    },

    _autoRetry(originalRetry: () => void) {
        scheduleRetry(originalRetry);
        return originalRetry;
    },

    _handleNoResponse() {
        const convId = ChatPageStore.useChatPageStore.getState().conversationId;
        if (!convId) return;

        const { byId, byConversationId } = ResponseStore.useResponseStore.getState();
        const responseIds = byConversationId[convId];
        if (!responseIds?.length) return;

        const lastResp = byId[responseIds[responseIds.length - 1]];
        if (!lastResp || lastResp.sender === "human" || lastResp.message || lastResp.partial) return;
        if (retriedIds.has(lastResp.responseId)) return;

        scheduleRetry(() => {
            retriedIds.add(lastResp.responseId);
            ChatPageStore.useChatPageStore.getState().sendResponse({
                message: "",
                parentResponseId: lastResp.parentResponseId,
                conversationId: convId,
                enableRetries: true,
            });
        });
    },

    patches: [
        {
            find: "\"StreamingResponse\",()=>",
            replacement: {
                match: /onRetry:(\i),conversationId/,
                replace: "onRetry:$self._autoRetry($1),conversationId",
            },
        },
        {
            find: "\"ChatInteraction\",()=>",
            replacement: {
                match: /(?<=unable to reply\.description.{0,60})onRetry:(\i),conversationId/,
                replace: "onRetry:$self._autoRetry($1),conversationId",
            },
        },
        {
            find: "\"ResponseContent\",()=>",
            all: true,
            replacement: {
                match: /(\i)\("response\.no-response","No response\."\)/,
                replace: "($self._handleNoResponse(),$1(\"response.no-response\",\"No response.\"))",
            },
        },
    ],
});
