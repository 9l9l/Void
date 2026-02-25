import type { LoadingStatus } from "../common/LoadingStatus";
import type { ZustandStore } from "../zustand";

/**
 * Zustand state for developer/custom model management, including
 * their specs, draft editing state, and CRUD operations via the API.
 */
export interface DevModelsStoreState {
    /** Name filter or label for the current view. */
    name: string;
    /** Map of model ID to model object. */
    byId: Record<string, any>;
    /** Draft model being edited, or null. */
    draftModel: any;
    /** Model creation spec/schema from the API, or null. */
    spec: any;
    /** List of dev model objects. */
    list: any[];
    /** Loading status of the dev models list. */
    listStatus: LoadingStatus;
    /** Currently active dev model ID in the editor, or null. */
    activeDevModelId: string | null;

    /** Set the active dev model ID. */
    setActiveDevModelId: (id: string | null) => void;
    /** Ensure the models list is loaded (no-op if already loaded). */
    ensureListLoaded: () => Promise<void>;
    /** Ensure the model spec is loaded. */
    ensureSpec: () => Promise<void>;
    /** Reload the models list from the API. */
    loadModels: () => Promise<void>;
    /** Delete a dev model by ID. */
    deleteModel: (id: string) => Promise<void>;
    /** Update a dev model by ID with partial data. */
    updateModel: (id: string, data: any) => Promise<void>;
    /** Create a new empty draft model. */
    createNewDraft: () => void;
    /** Clone an existing model as a new draft. */
    cloneModel: (id: string) => void;
    /** Update the current draft model with partial data. */
    updateDraft: (data: any) => void;
    /** Discard the current draft model. */
    discardDraft: () => void;
    /** Create a new model from the given data. */
    createModel: (data: any) => Promise<void>;
}

/** Module exports for the DevModels store. */
export interface DevModelsStoreModule {
    /** Sentinel ID used for draft models not yet saved. */
    DRAFT_MODEL_ID: string;
    /** Zustand store hook for dev models state. */
    useDevModelsStore: ZustandStore<DevModelsStoreState>;
}
