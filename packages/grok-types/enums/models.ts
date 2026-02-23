/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/** Model identifier strings used in API requests and store state. */
export type ModelId = "grok-3" | "grok-4" | "grok-4-mini-thinking-tahoe" | "grok-4-1-thinking-1129" | "grok-420" | (string & {});

/** Model mode selector controlling which model variant is used. Maps to the model picker UI. */
export type ModelMode = "auto" | "fast" | "expert" | "heavy" | "grok-4-mini-thinking" | "grok-4-1" | "grok-4-1-thinking" | "grok-4-1-nightly" | "grok-420" | (string & {});

/** Reasoning depth mode for responses. */
export type ReasoningMode = "none" | "think" | "deepsearch" | "deepersearch" | "unknown" | (string & {});

/** Request kind sent to the API, determines processing pipeline. */
export type RequestKind = "DEFAULT" | "REASONING" | "DEEPSEARCH" | "DEEPERSEARCH" | (string & {});
