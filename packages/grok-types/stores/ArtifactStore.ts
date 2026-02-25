import type { ArtifactMode } from "../enums/artifacts";
import type { ZustandStore } from "../zustand";

/** A saved artifact edit entry. */
export interface ArtifactEdit {
    /** The edit content/diff. */
    content: string;
    /** ISO 8601 timestamp of last sync. */
    lastSyncTime: string;
}

/**
 * Zustand state for the artifact viewer.
 *
 * Manages the code/preview artifact panel, artifact data per conversation,
 * and refresh state.
 */
export interface ArtifactStoreState {
    /** Current display mode (code or preview). */
    mode: ArtifactMode;
    /** Artifacts keyed by conversation ID. */
    artifactsByConversationId: Record<string, any>;
    /** Whether the artifact data is being refreshed. */
    isRefreshing: boolean;

    /** Set the display mode. */
    setMode: (mode: ArtifactMode) => void;
    /** Refresh all artifact data. */
    refresh: () => Promise<void>;
    /** Insert or update an artifact for a conversation. */
    upsertArtifact: (conversationId: string, artifact: any) => void;
}

/**
 * Zustand state for tracking artifact edits
 * and sync timestamps for artifact content.
 */
export interface ArtifactEditsState {
    /** Edit entries keyed by artifact ID. */
    edits: Record<string, ArtifactEdit>;

    /** Save an edit for an artifact. */
    saveEdit: (artifactId: string, content: string, responseId: string) => void;
    /** Update the last sync time for an artifact edit. */
    updateLastSyncTime: (artifactId: string, time: string) => void;
}

/**
 * Zustand state for inline artifact display settings,
 * controlling whether artifacts are shown inline in chat or in the sidebar.
 */
export interface InlineArtifactStoreState {
    /** Inline display settings keyed by artifact ID. */
    inlineSettings: Record<string, any>;

    /** Set an inline display setting for an artifact. */
    setInlineSetting: (artifactId: string, setting: any) => void;
}

/** Module exports for the Artifact stores. */
export interface ArtifactStoreModule {
    /** Zustand store hook for artifact edit tracking. */
    useArtifactEdits: ZustandStore<ArtifactEditsState>;
    /** Zustand store hook for the artifact viewer. */
    useArtifactStore: ZustandStore<ArtifactStoreState>;
    /** Zustand store hook for inline artifact settings. */
    useInlineArtifactStore: ZustandStore<InlineArtifactStoreState>;
}
