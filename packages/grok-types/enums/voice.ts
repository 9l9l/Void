/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/** WebRTC voice connection lifecycle states. */
export type VoiceConnectionStatus = "disconnected" | "connecting" | "connected" | (string & {});

/** Voice mode activity states for the microphone/speaker indicator. */
export type VoiceActivityStatus = "idle" | "speaking" | "listening" | (string & {});
