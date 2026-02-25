import type { ZustandStore } from "../zustand";

/** A page in the command menu navigation stack. */
export interface CommandMenuPage {
    /** Unique page identifier (e.g. "root", "settings"). */
    id: string;
    /** Whether search is enabled on this page. */
    isSearchEnabled: boolean;
    /** Current search query text for this page. */
    searchQuery: string;
}

/**
 * Zustand state for the command palette (Cmd+K menu), managing
 * search queries and selected items in the command menu overlay.
 */
export interface CommandMenuStoreState {
    /** Whether the command menu is open. */
    open: boolean;
    /** Currently highlighted/selected item in the menu, or undefined. */
    selectedItem: any;
    /** Navigation page stack (supports drill-down and back). */
    pages: CommandMenuPage[];

    /** Handle search query changes on the current page. */
    onSearchQueryChange: (query: string) => void;
    /** Open the command menu at the root page. */
    openMenu: () => void;
    /** Open the command menu at the pinned conversations page. */
    openMenuPinnedConversations: () => void;
    /** Navigate back one page in the menu stack. */
    goBack: () => void;
    /** Close the command menu. */
    closeMenu: () => void;
    /** Set the currently selected item. */
    setSelectedItem: (item: any) => void;
    /** Push a new page onto the navigation stack. */
    addPage: (page: CommandMenuPage) => void;
}

/** Module exports for the CommandMenu store. */
export interface CommandMenuStoreModule {
    /** Create a command menu selection object. */
    createSelection: (value: string, group: string) => any;
    /** Get the value from a command item. */
    getCommandValue: (item: any) => string;
    /** Get the value from a selection item. */
    getSelectionValue: (item: any) => string;
    /** Parse a serialized command value string. */
    parseCommandValue: (value: string) => any;
    /** Zustand store hook for command menu state. */
    useCommandMenuStore: ZustandStore<CommandMenuStoreState>;
}
