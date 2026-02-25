import type { ModelId } from "../enums/models";
import type { SettingsDialogTab } from "../enums/settings";
import type { ZustandStore } from "../zustand";

/**
 * Zustand state for the settings dialog UI, managing the active tab,
 * expanded mode, and dev tools model config tab of the settings modal.
 */
export interface SettingsDialogStoreState {
    /** Whether the settings dialog is currently open. */
    open: boolean;
    /** Currently active tab in the settings dialog sidebar. */
    tab: SettingsDialogTab;
    /** Whether the dialog is in expanded/fullscreen mode. */
    expanded: boolean;
    /** Active sub-tab within the model config override panel (dev tools). */
    modelConfigOverrideTab: ModelId | undefined;

    setOpen: (open: boolean) => void;
    toggleOpen: () => void;
    setTab: (tab: SettingsDialogTab) => void;
    toggleExpanded: () => void;
    setModelConfigOverrideTab: (tab: ModelId | undefined) => void;
}

/** Module exports for the Settings Dialog store. */
export interface SettingsDialogStoreModule {
    /** Zustand store hook for the settings dialog state. */
    useSettingsDialogStore: ZustandStore<SettingsDialogStoreState>;
}
