/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FeatureStore } from "@turbopack/common/stores";
import { Logger } from "@utils/Logger";

const logger = new Logger("Notices");

export const enum NoticeType {
    INFO = "log",
    WARNING = "warn",
    ERROR = "error",
}

export interface NoticeOptions {
    message: string;
    type?: NoticeType;
    timeout?: number;
}

let activeNoticeKey: string | null = null;
let dismissTimer: ReturnType<typeof setTimeout> | null = null;

function clearDismissal(sentAt: string) {
    try {
        localStorage.removeItem(`banner-${sentAt}`);
    } catch (e) { logger.debug("Failed to clear banner dismissal:", e); }
}

/**
 * Show a persistent banner notice at the top of the page.
 * Uses Grok's native banner system (feature flag driven).
 * Only one notice can be shown at a time — calling again replaces the previous one.
 */
export function showNotice(options: NoticeOptions): string {
    const sentAt = `void-notice-${Date.now()}`;

    if (dismissTimer) {
        clearTimeout(dismissTimer);
        dismissTimer = null;
    }

    if (activeNoticeKey) {
        clearDismissal(activeNoticeKey);
    }

    clearDismissal(sentAt);

    const { config } = FeatureStore.useFeatureStore.getState();

    FeatureStore.useFeatureStore.setState({
        config: {
            ...config,
            banner: {
                type: options.type ?? NoticeType.INFO,
                message: options.message,
                sentAt,
            },
        },
    });

    activeNoticeKey = sentAt;

    if (options.timeout) {
        dismissTimer = setTimeout(closeNotice, options.timeout);
    }

    return sentAt;
}

export function closeNotice() {
    if (!activeNoticeKey) return;

    if (dismissTimer) {
        clearTimeout(dismissTimer);
        dismissTimer = null;
    }

    try {
        localStorage.setItem(`banner-${activeNoticeKey}`, "true");
    } catch (e) { logger.debug("Failed to persist banner dismissal:", e); }

    const { config } = FeatureStore.useFeatureStore.getState();

    FeatureStore.useFeatureStore.setState({
        config: {
            ...config,
            banner: {},
        },
    });

    activeNoticeKey = null;
}
