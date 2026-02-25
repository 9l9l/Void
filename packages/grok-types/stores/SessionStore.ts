import type { ComponentType, ReactNode } from "react";

import type { GrokSubscription } from "../common/Subscription";
import type { GrokUser } from "../common/User";
import type { ZustandStore } from "../zustand";

/**
 * Zustand state for the authenticated user session, including
 * country detection and subscription info. The session is established
 * on page load and refreshed periodically.
 */
export interface SessionStoreState {
    /** Authenticated user profile, or undefined when logged out. */
    user: GrokUser | undefined;
    /** Active team/organization context for enterprise users. Undefined for individual accounts. */
    team: any;
    /** ISO 3166-1 alpha-2 country code detected from the user's IP (e.g. "US", "HU"). */
    countryCode: string;
    /** Raw subscription objects from the session API. Undefined before loaded. */
    subscriptions: GrokSubscription[] | undefined;
    /** Anonymous user identity for unauthenticated access. */
    anonUser: any;

    /** Partially update the current user profile fields. */
    updateUser: (user: Partial<GrokUser>) => void;
    /** Clear the user session (logout). */
    clearUser: () => void;
    /** Re-fetch the authenticated session from the server. */
    refreshSession: () => Promise<void>;
    /** Refresh or create an anonymous user identity. */
    refreshAnonUser: (force?: boolean, transport?: any) => Promise<void>;
}

/** Module exports for the Session store. */
export interface SessionStoreModule {
    /** React hook that returns the full session state. Not a Zustand selector hook. */
    useSession: () => SessionStoreState;
    /** React context provider that wraps the app with session state. */
    SessionStoreProvider: ComponentType<{ children: ReactNode }>;
    /** Factory to create a new session store instance with the given config. */
    createSessionStore: (config: any) => ZustandStore<SessionStoreState>;
    /** Read the current session state synchronously (outside React). */
    getSessionStoreState: () => SessionStoreState;
    /** The raw Zustand store instance for the session. */
    sessionStoreState: ZustandStore<SessionStoreState>;
    /** Partially update session state directly (outside React). */
    setSessionStoreState: (state: Partial<SessionStoreState>) => void;
}
