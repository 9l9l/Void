/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { SettingsDialogTab } from "../enums/settings";
import type { ZustandStore } from "../zustand";

/**
 * Zustand state for the settings dialog UI.
 *
 * Module ID: **519837**. Controls the open/close state, active tab,
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
    modelConfigOverrideTab: string | undefined;

    setOpen: (open: boolean) => void;
    toggleOpen: () => void;
    setTab: (tab: SettingsDialogTab) => void;
    toggleExpanded: () => void;
    setModelConfigOverrideTab: (tab: string | undefined) => void;
}

/** Module exports for the Settings Dialog store (module **519837**). */
export interface SettingsDialogStoreModule {
    /** Zustand store hook for the settings dialog state. */
    useSettingsDialogStore: ZustandStore<SettingsDialogStoreState>;
}
