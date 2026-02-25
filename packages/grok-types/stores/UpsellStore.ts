import type { SubscriptionTier } from "../enums/subscription";
import type { UpsellCategory } from "../enums/upsell";
import type { ZustandStore } from "../zustand";

/** A prioritized upsell layer in the display stack. */
export interface UpsellLayer {
    /** Display priority (higher = shown first). */
    priority: number;
    /** Unique layer identifier. */
    id: string;
}

/** Options for opening the upsell flow. */
export interface OpenUpsellOptions {
    /** Analytics entrypoint key identifying where the upsell was triggered. */
    entrypointKey?: string;
    /** Target subscription tier to upsell to. */
    targetTier?: SubscriptionTier;
    /** Upsell category (individual or team). */
    upsellCategory?: UpsellCategory;
}

/**
 * Zustand state for the upsell/upgrade flow, managing the upgrade dialog
 * and a priority stack of upsell triggers (model select, cards, etc.).
 */
export interface UpsellStoreState {
    /** Whether the upsell flow is currently active. */
    isUpselling: boolean;
    /** Target upsell category (individual or team pricing). */
    upsellCategory: UpsellCategory;
    /** Target subscription tier the upsell is promoting. */
    targetTier: SubscriptionTier;
    /** Stack of active upsell layers, ordered by priority. */
    upsellLayers: UpsellLayer[];
    /** Currently displayed upsell layer, or undefined if none. */
    currentlyShownUpsell: UpsellLayer | undefined;
    /** Analytics referrer page key, or undefined. */
    referringPage: string | undefined;

    /** Set whether the upsell flow is active. */
    setIsUpselling: (value: boolean) => void;
    /** Set the upsell category. */
    setUpsellCategory: (category: UpsellCategory) => void;
    /** Set the target subscription tier. */
    setTargetTier: (tier: SubscriptionTier) => void;
    /** Replace the entire upsell layers stack. */
    setUpsellLayers: (layers: UpsellLayer[]) => void;
    /** Set the currently shown upsell layer. */
    setCurrentlyShownUpsell: (layer: UpsellLayer | undefined) => void;
    /** Open the upsell flow with the given options. */
    openUpsell: (options: OpenUpsellOptions) => void;
    /** Add an upsell layer with a priority and ID. */
    addUpsellLayer: (priority: number, id: string) => void;
    /** Remove an upsell layer by ID. */
    removeUpsellLayer: (id: string) => void;
}

/** Module exports for the Upsell store. */
export interface UpsellStoreModule {
    /** Priority constant for card-type upsells. */
    UPSELL_CARD_PRIORITY: number;
    /** Priority constant for model select upsells. */
    UPSELL_MODEL_SELECT_PRIORITY: number;
    /** Priority constant for small/inline upsells. */
    UPSELL_SMALL_PRIORITY: number;
    /** Hook that returns whether to show the upgrade button. */
    useShouldShowUpgradeButton: () => boolean;
    /** Zustand store hook for upsell state. */
    useUpsellStore: ZustandStore<UpsellStoreState>;
}
