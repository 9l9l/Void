import type { ZustandStore } from "../zustand";

/**
 * Zustand state for the share dialog, managing its open
 * state and configuration props.
 */
export interface ShareStoreState {
    /** Whether the share dialog is open. */
    shareDialogIsOpen: boolean;
    /** Props passed to the share dialog component, or null when closed. */
    dialogProps: any;

    /** Set the share dialog open state. */
    setShareDialogIsOpen: (open: boolean) => void;
    /** Set the share dialog props. */
    setDialogProps: (props: any) => void;
    /** Open the share dialog with the given props. */
    openShareDialog: (props: any) => void;
    /** Close the share dialog and clear props. */
    closeShareDialog: () => void;
}

/** Module exports for the Share store. */
export interface ShareStoreModule {
    /** Zustand store hook for share dialog state. */
    useShareStore: ZustandStore<ShareStoreState>;
}
