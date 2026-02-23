/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { ContextMenuLocationMap } from "@api/ContextMenus";
import { DropdownMenuItem } from "@components";
import type { GrokResponse } from "@grok-types/stores/ResponseStore";
import { React } from "@turbopack/common/react";
import { ConversationStore, ResponseStore } from "@turbopack/common/stores";
import { findExportedComponentLazy } from "@turbopack/turbopack";
import { Logger } from "@utils/Logger";
import definePlugin from "@utils/types";

const DownloadIcon = findExportedComponentLazy("DownloadIcon");

const logger = new Logger("ExportChat", "#60a5fa");

async function exportChat(conversationId: string) {
    const responses: GrokResponse[] = await ResponseStore.useResponseStore.getState().loadInitialResponses(conversationId, true);
    if (!responses?.length) {
        logger.warn("No responses found for conversation", conversationId);
        return;
    }

    const conversation = ConversationStore.useConversationStore.getState().byId[conversationId];

    const data = {
        conversationId,
        title: conversation?.title ?? "Untitled Chat",
        exportedAt: new Date().toISOString(),
        messages: responses.map(r => ({
            id: r.responseId,
            sender: r.sender,
            message: r.message,
            query: r.query,
            createTime: r.createTime,
            model: r.requestMetadata?.model ?? r.model,
            ...(r.thinkingTrace && { thinkingTrace: r.thinkingTrace }),
            ...(r.webSearchResults?.length && { webSearchResults: r.webSearchResults }),
            ...(r.generatedImageUrls?.length && { generatedImageUrls: r.generatedImageUrls }),
            ...(r.fileAttachments?.length && { fileAttachments: r.fileAttachments }),
            ...(r.steps?.length && { steps: r.steps }),
        })),
    };

    const title =
        (conversation?.title ?? "chat")
            .replace(/[^a-zA-Z0-9 ]/g, "")
            .trim()
            .replace(/\s+/g, "-") || "chat";
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.json`;
    a.click();
    URL.revokeObjectURL(url);

    logger.info(`Exported ${responses.length} messages from "${conversation?.title ?? conversationId}"`);
}

function ExportItem({ conversationId }: ContextMenuLocationMap["conversation"]) {
    return (
        <DropdownMenuItem onSelect={() => exportChat(conversationId)}>
            <DownloadIcon size={16} className="me-2" />
            Export
        </DropdownMenuItem>
    );
}

export default definePlugin({
    name: "ExportChat",
    description: "Adds an Export option to the conversation context menu.",
    authors: ["Prism"],

    contextMenuItems: {
        conversation: {
            label: "Export",
            render: ExportItem,
        },
    },
});
