import type { ZustandStore } from "../zustand";

/**
 * Zustand state for the @mention menu in the query bar,
 * managing visibility and the list of available mention items.
 */
export interface MentionMenuStoreState {
    /** Whether the mention menu is open. */
    isOpen: boolean;
    /** List of available mention items. */
    mentions: any[];

    /** Open the mention menu. */
    open: () => void;
    /** Close the mention menu. */
    close: () => void;
    /** Set the available mention items. */
    setMentions: (mentions: any[]) => void;
}

/** Module exports for the MentionMenu store. */
export interface MentionMenuStoreModule {
    /** Zustand store hook for mention menu state. */
    useMentionMenuStore: ZustandStore<MentionMenuStoreState>;
}
