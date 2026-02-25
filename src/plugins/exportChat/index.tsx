/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { ContextMenuLocationMap } from "@api/ContextMenus";
import { DropdownMenuItem } from "@components";
import type { GrokConversation, GrokResponse } from "@grok-types";
import { React } from "@turbopack/common/react";
import { ConversationStore, ResponseStore } from "@turbopack/common/stores";
import { findExportedComponentLazy } from "@turbopack/turbopack";
import definePlugin from "@utils/types";

const DownloadIcon = findExportedComponentLazy("DownloadIcon");

const SANITIZE_PATTERN = /[^a-zA-Z0-9 ]/g;
const WHITESPACE_PATTERN = /\s+/g;

function sanitizeFilename(title: string): string {
    return title.replace(SANITIZE_PATTERN, "").trim().replace(WHITESPACE_PATTERN, "-") || "chat";
}

function buildExportMessage(r: GrokResponse) {
    return {
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
    };
}

function downloadJson(filename: string, data: unknown) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

async function exportChat(conversationId: string) {
    const responses: GrokResponse[] = await ResponseStore.useResponseStore.getState().loadInitialResponses(conversationId, true);
    if (!responses?.length) return;

    const conversation: GrokConversation | undefined = ConversationStore.useConversationStore.getState().byId[conversationId];
    const title = conversation?.title ?? "Untitled Chat";

    downloadJson(`${sanitizeFilename(title)}.json`, {
        conversationId,
        title,
        exportedAt: new Date().toISOString(),
        messages: responses.map(buildExportMessage),
    });
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
