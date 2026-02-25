import type { ModelConfigModelMode, ModelId, PromptingBackend } from "../enums/models";

/**
 * A Grok model definition as returned by the models API.
 *
 * Stored in `ModelsStore.models` and indexed by `ModelsStore.modelById`.
 * Each model represents a selectable AI model in the Grok UI.
 *
 * @example
 * ```ts
 * // { modelId: "grok-4", name: "Grok 4", modelMode: "MODEL_MODE_EXPERT", promptingBackend: "GIX" }
 * ```
 */
export interface GrokModel {
    /** Unique model identifier used in API requests (e.g. "grok-4", "grok-420"). */
    modelId: ModelId;
    /** Human-readable display name (e.g. "Grok 4", "Grok 4.20 (Beta)"). */
    name: string;
    /** Short description shown in the model picker (e.g. "Expert", "Legacy"). */
    description: string;
    /** Description of the model's mode (e.g. "Thinks hard", "Quick responses by 4.1"). */
    modeDescription: string;
    /** Feature tags controlling UI behavior (e.g. "beta", "hide_tools_settings", "require_supergrokpro"). */
    tags: string[];
    /** Badge text shown next to the model name. Empty or whitespace if no badge. */
    badgeText: string;
    /** Internal mode enum from the API (e.g. "MODEL_MODE_EXPERT", "MODEL_MODE_FAST"). */
    modelMode: ModelConfigModelMode;
    /** Backend routing identifier (e.g. "GIX", "CHAT"). */
    promptingBackend: PromptingBackend;
}
