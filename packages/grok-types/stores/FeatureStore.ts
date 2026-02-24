import type { FeatureStoreStatus } from "../enums/feature";
import type { ZustandStore } from "../zustand";

/**
 * Zustand state for feature flags and remote configuration.
 *
 * Module ID: **647245**. Manages ~310 feature flags fetched from the server.
 * Flags control UI experiments, model access, rollouts, and A/B tests.
 * Supports local overrides for development.
 *
 * @example
 * ```ts
 * const config = useFeatureStore.getState().config;
 * const isEnabled = config.customer_support_enabled; // boolean
 * ```
 */
export interface FeatureStoreState {
    /** Loading state of the feature config: idle before fetch, loading during, ready after success. */
    status: FeatureStoreStatus;
    /**
     * Feature flag configuration map (~310 keys).
     * Values are mixed types: booleans, numbers, strings, arrays, and nested objects.
     * Known keys include `is_xai_employee`, `customer_support_enabled`,
     * `grok_4_mini_enable_inline_charts`, `satisfaction_score`, etc.
     */
    config: Record<string, any>;
    /** Locally applied feature flag overrides (dev tools). Takes precedence over `config`. */
    overrides: Record<string, any>;

    /** Log an analytics exposure event for a feature flag (for A/B test tracking). */
    logExposure: (featureName: string) => void;
    /** Re-fetch feature config from the server. Pass `true` to force bypass cache. */
    refreshConfig: (force?: boolean) => Promise<void>;
    /** Set a local override for a feature flag (dev tools). */
    setOverride: (key: string, value: any) => void;
    /** Remove a local override for a feature flag. */
    clearOverride: (key: string) => void;
    /** Remove all local overrides. */
    clearAllOverrides: () => void;
}

/** Module exports for the Feature store (module **647245**). */
export interface FeatureStoreModule {
    /** Zustand store hook for feature flags. */
    useFeatureStore: ZustandStore<FeatureStoreState>;
}
