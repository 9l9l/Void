/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { NoticeType, showNotice } from "@api/Notices";
import { fetchExternal } from "@utils/misc";

import { Logger } from "./Logger";

const logger = new Logger("UpdateChecker", "#85c1dc");

export async function checkForUpdates() {
    try {
        const resp = await fetchExternal(`${REPO_RAW_URL}/main/package.json`);
        if (!resp.ok) return;

        const { version: latest } = await resp.json() as { version: string };
        if (!latest || latest === VERSION) {
            logger.info(`Up to date (${VERSION})`);
            return;
        }

        logger.info(`Update available: ${VERSION} → ${latest}`);

        showNotice({
            message: `Void ${VERSION} is outdated! Latest version is ${latest}. Visit ${REPO_URL} to update.`,
            type: NoticeType.WARNING,
        });
    } catch (e) {
        logger.warn("Failed to check for updates", e);
    }
}
