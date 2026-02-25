import type { GrokModel } from "../common/Model";
import type { ModelId, ModelMode } from "../enums/models";
import type { ZustandStore } from "../zustand";

/**
 * Zustand state for available AI models, including
 * default model selections per tier and lookup indexes.
 * Populated from the models API on page load.
 */
export interface ModelsStoreState {
    /** Models available to the current user (e.g. Grok 3, Grok 4, Grok 4.20). */
    models: GrokModel[];
    /** Models that exist but are not accessible to the user (e.g. require SuperGrokPro). */
    unavailableModels: GrokModel[];
    /** Default model ID for anonymous (logged out) users (e.g. "grok-3"). */
    defaultAnonModelId: ModelId;
    /** Default model ID for free-tier authenticated users (e.g. "grok-3"). */
    defaultFreeModelId: ModelId;
    /** Default model ID for Pro/paid users (e.g. "grok-4"). */
    defaultProModelId: ModelId;
    /** Default model ID for heavy/premium queries (e.g. "grok-4"). */
    defaultHeavyModelId: ModelId;
    /** Lookup map from model ID to the full GrokModel object. */
    modelById: Record<ModelId, GrokModel>;
    /** Lookup map from model mode string to the corresponding GrokModel. */
    modelByMode: Record<ModelMode, GrokModel>;
    /** Whether the models API request is in flight. */
    isPending: boolean;
    /** Whether the models API request completed successfully. */
    isSuccess: boolean;
    /** Set of all model IDs the user can access (includes auto, companion, etc.). */
    allAccessibleModelIds: Set<ModelId>;
    /** Set of all mode IDs the user can access (e.g. "fast", "expert", "auto"). */
    allAccessibleModeIds: Set<ModelMode>;
}

/** Module exports for the Models store. */
export interface ModelsStoreModule {
    /** Zustand store hook for models state. */
    useModelsStore: ZustandStore<ModelsStoreState>;
}
