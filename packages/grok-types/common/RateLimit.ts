/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/**
 * Rate limit info for a specific effort level (low/high).
 * Part of the rate limit response breakdown by query complexity.
 */
export interface EffortRateLimits {
    /** Cost weight of this effort level. */
    cost: number;
    /** Number of queries remaining in the current window. */
    remainingQueries: number;
    /** Seconds to wait before the rate limit resets. Only present when limited. */
    waitTimeSeconds?: number;
}

/**
 * Full rate limit response from the Grok API.
 * Returned as part of conversation/response error payloads when the user is rate-limited.
 */
export interface RateLimitResponse {
    /** Duration of the rate limit window in seconds (e.g. 7200 for 2 hours). */
    windowSizeSeconds: number;
    /** Total remaining queries in the current window. */
    remainingQueries: number;
    /** Maximum queries allowed per window. */
    totalQueries: number;
    /** Seconds until the rate limit resets. Only present when actively limited. */
    waitTimeSeconds?: number;
    /** Remaining token budget, if token-based limiting is active. */
    remainingTokens?: number;
    /** Total token budget per window. */
    totalTokens?: number;
    /** Breakdown for low-effort (simple) queries. */
    lowEffortRateLimits?: EffortRateLimits;
    /** Breakdown for high-effort (reasoning/deep search) queries. */
    highEffortRateLimits?: EffortRateLimits;
}
