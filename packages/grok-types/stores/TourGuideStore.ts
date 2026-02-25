import type { ZustandStore } from "../zustand";

/** Persisted tour guide state stored in localStorage. */
export interface TourGuideState {
    /** Team IDs the user has visited (for team-specific tours). */
    teamIdsVisited: string[];
    /** Tooltip IDs that have been dismissed. */
    dismissedTooltips: string[];
}

/**
 * Zustand state for the tour guide / onboarding tooltips, tracking
 * which tooltips have been dismissed and which teams have been visited.
 * State is persisted to localStorage.
 */
export interface TourGuideStoreState {
    /** Persisted tour guide state with visited teams and dismissed tooltips. */
    tourGuideState: TourGuideState;

    /** Update the tour guide state. */
    setTourGuideState: (key: string, value: any) => void;
    /** Check if a tooltip should be shown (not dismissed). */
    shouldShow: (tooltipId: string) => boolean;
    /** Dismiss a tooltip by ID. */
    dismiss: (tooltipId: string) => void;
    /** Check if a tooltip has been dismissed. */
    isDismissed: (tooltipId: string) => boolean;
    /** Reset all tour guide state. */
    resetAll: () => void;
    /** Reset the current tour guide session. */
    reset: () => void;
    /** Add a team ID to the visited list. */
    upsertTeamIdsVisited: (teamId: string) => void;
}

/** Module exports for the TourGuide store. */
export interface TourGuideStoreModule {
    /** Zustand store hook for tour guide state. */
    useTourGuideStore: ZustandStore<TourGuideStoreState>;
    /** Hook for managing a specific tour guide tooltip. */
    useTourGuideTooltip: (tooltipId: string) => any;
}
