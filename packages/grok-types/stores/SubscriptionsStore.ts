import type { GrokSubscription } from "../common/Subscription";
import type { SubscriptionTier } from "../enums/subscription";
import type { ZustandStore } from "../zustand";

/**
 * Zustand state for the user's subscription data.
 *
 * Module ID: **425296**. Stores the active subscriptions fetched from the
 * session API and computes the best (highest-tier) subscription. Populated
 * by the session provider on page load.
 */
export interface SubscriptionsStoreState {
    /** Whether the user has any active subscriptions. */
    hasSubscriptions: boolean;
    /** Active subscription objects from the API. */
    activeSubscriptions: GrokSubscription[];
    /** Highest-tier active subscription tier string, or undefined if free. */
    bestSubscription: SubscriptionTier | undefined;
}

/** Module exports for the Subscriptions store (module **425296**). */
export interface SubscriptionsStoreModule {
    /** Zustand store hook for subscription state. */
    useSubscriptionsStore: ZustandStore<SubscriptionsStoreState>;
}
