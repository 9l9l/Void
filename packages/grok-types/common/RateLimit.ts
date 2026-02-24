/**
 * Rate limit info for a specific effort level (low/high).
 *
 * Models like grok-3 use a **token-budget** system where a shared pool of tokens
 * is consumed at different rates depending on the effort level:
 *
 * - **Low effort** ("fast" mode): costs 1 token per query
 * - **High effort** ("expert" mode): costs 4 tokens per query
 *
 * For example, with a total budget of 140 tokens per 2-hour window:
 * - Fast mode: 140 / 1 = **140 queries**
 * - Expert mode: 140 / 4 = **35 queries**
 *
 * These are NOT independent limits. They share the same token pool.
 * Using one fast query (1 token) leaves 139 tokens, which is 34.75 expert queries.
 */
export interface EffortRateLimits {
    /** Token cost per query at this effort level (e.g. 1 for fast, 4 for expert). */
    cost: number;
    /** Derived remaining queries: `Math.floor(remainingTokens / cost)`. */
    remainingQueries: number;
    /** Seconds to wait before the rate limit resets. Only present when limited. */
    waitTimeSeconds?: number;
}

/**
 * Full rate limit response from `POST /rest/rate-limits`.
 *
 * The API accepts `{ requestKind, modelName }` and returns usage info for
 * the current 2-hour window. Two systems coexist:
 *
 * 1. **Legacy query-count system** (`remainingQueries` / `totalQueries`):
 *    Used by newer models (grok-4-1-thinking, etc.) with flat per-query limits.
 *    Example: 40 queries per 2 hours regardless of mode.
 *
 * 2. **Token-budget system** (`remainingTokens` / `totalTokens` + effort breakdown):
 *    Used by grok-3. A shared token pool is consumed at different rates
 *    per effort level. See {@link EffortRateLimits} for the cost model.
 *
 * The `useRateLimits` hook prefers `totalTokens` over `totalQueries` when both
 * are present, so the UI shows the token budget as "total queries" for grok-3.
 *
 * @example
 * ```ts
 * // grok-3 (SuperGrok): token-budget system
 * {
 *   windowSizeSeconds: 7200,
 *   remainingQueries: 0, totalQueries: 0,       // legacy, zeroed out
 *   remainingTokens: 140, totalTokens: 140,      // actual budget
 *   lowEffortRateLimits:  { cost: 1, remainingQueries: 140 },  // fast
 *   highEffortRateLimits: { cost: 4, remainingQueries: 35 },   // expert
 * }
 *
 * // grok-4-1-thinking (SuperGrok): flat query limit
 * {
 *   windowSizeSeconds: 7200,
 *   remainingQueries: 40, totalQueries: 40,
 *   // no token fields, no effort breakdown
 * }
 * ```
 */
export interface RateLimitResponse {
    /** Duration of the rate limit window in seconds (e.g. 7200 for 2 hours). */
    windowSizeSeconds: number;
    /** Remaining queries in the legacy query-count system. Zero when token-budget is active. */
    remainingQueries: number;
    /** Maximum queries per window in the legacy system. Zero when token-budget is active. */
    totalQueries: number;
    /** Seconds until the rate limit resets. Only present when actively limited. */
    waitTimeSeconds?: number;
    /** Remaining token budget. Present only for models using the token-budget system (e.g. grok-3). */
    remainingTokens?: number;
    /** Total token budget per window. Present only for token-budget models. */
    totalTokens?: number;
    /** Breakdown for low-effort ("fast" mode) queries. Absent on flat-limit models. */
    lowEffortRateLimits?: EffortRateLimits;
    /** Breakdown for high-effort ("expert" mode) queries. Absent on flat-limit models. */
    highEffortRateLimits?: EffortRateLimits;
}

/**
 * Rate limit type determined from streaming errors.
 *
 * - `"user"`: Personal rate limit exceeded (too many queries in the window).
 * - `"global"`: Server-wide rate limit ("Grok is under heavy usage right now").
 */
export type RateLimitType = "user" | "global";
