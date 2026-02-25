import type { ZustandStore } from "../zustand";

/** A single tab entry in the tabs manager, representing an open conversation. */
export interface TabEntry {
    /** The conversation ID this tab represents. */
    conversationId: string;
    /** Display title for the tab. */
    title: string;
    /** Sort index (0 = most recent). */
    index: number;
    /** Whether this tab is temporary (not persisted across sessions). */
    isTemporary: boolean;
    /** Whether this tab is pinned/preserved by the user. */
    isPreserved: boolean;
}

/** Input for upsertConversationAsTab — partial conversation info. */
export interface TabConversationInput {
    conversationId: string;
    title: string;
    temporary: boolean;
}

/**
 * Zustand state for the chat tabs manager, controlling open conversation tabs
 * in the sidebar. Persisted to localStorage under "active-chat-tabs".
 */
export interface TabsManagerStoreState {
    /** Whether the mobile drawer is open. */
    drawerOpen: boolean;
    /** Whether the sidebar menu is pinned open. */
    menuFixed: boolean;
    /** Whether the sidebar menu is hidden. */
    menuHidden: boolean;
    /** Map of conversation ID → tab entry. */
    tabByConversationId: Record<string, TabEntry>;
    /** ID of the tab currently being renamed/edited, or undefined. */
    inEditId: string | undefined;

    /** Add or update a conversation as a tab. Optionally replaces an old conversation ID. */
    upsertConversationAsTab: (input: TabConversationInput, oldConversationId?: string, preserve?: boolean) => void;
    /** Update a tab entry by conversation ID. */
    upsertTab: (tab: Partial<TabEntry> & { conversationId: string }) => void;
    /** Remove a tab by conversation ID. */
    removeTab: (conversationId: string) => void;
    /** Append a new tab entry. */
    appendTabByConversationId: (tab: TabEntry) => void;
    /** Replace the entire tabByConversationId map. */
    setTabByConversationId: (tabs: Record<string, TabEntry>) => void;
    /** Set the drawer open/closed state. */
    setDrawerOpen: (open: boolean) => void;
    /** Toggle the sidebar menu pinned state. */
    toggleMenuFixed: () => void;
    /** Set the sidebar menu pinned state. */
    setMenuFixed: (fixed: boolean) => void;
    /** Set the sidebar menu hidden state. */
    setMenuHidden: (hidden: boolean) => void;
    /** Set the ID of the tab being edited. */
    setInEditId: (id: string | undefined) => void;
}

/** Module exports for the TabsManager store. */
export interface TabsManagerStoreModule {
    /** Zustand store hook for tabs manager state. */
    useTabsManagerStore: ZustandStore<TabsManagerStoreState>;
}
