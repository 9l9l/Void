/**
 * A conversation personality preset or custom personality.
 *
 * Personalities define custom system prompt behavior for Grok.
 * Preset personalities (concise, formal, socratic, comprehensive) are built-in.
 * Custom personalities are user-created.
 */
export interface GrokPersonality {
    /** Unique personality UUID, or preset slug (e.g. "concise", "formal"). */
    personalityId: string;
    /** Display name of the personality (e.g. "Concise", "Custom"). */
    name: string;
    /** System prompt instructions for this personality. */
    prompt: string;
    /** Short description shown in the personality picker. */
    description: string;
    /** Whether this is a built-in preset (true) or user-created (false). */
    isPreset: boolean;
}
