/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/** All page identifiers Grok's client-side router recognizes. */
export type GrokPage =
    | "main"
    | "chat"
    | "files"
    | "workspace"
    | "workspaces"
    | "images"
    | "imagine"
    | "imagine-favorites"
    | "imagine-post"
    | "imagine-more"
    | "imagine-carpet"
    | "tasks"
    | "plans"
    | "finance"
    | "faq"
    | "changelog"
    | "share-links"
    | "deleted-conversations"
    | "history"
    | "highlights"
    | "trends"
    | "templates"
    | "dev-models"
    | "user-feature-controls"
    | "user-feature-controls-static"
    | "vibe"
    | "build"
    | "clear-cache"
    | "unknown"
    | (string & {});
