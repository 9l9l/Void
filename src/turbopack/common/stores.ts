/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type {
    ChatPageStoreModule,
    ConversationStoreModule,
    FeatureStoreModule,
    ModelsStoreModule,
    ResponseStoreModule,
    RoutingStoreModule,
    SessionStoreModule,
    SettingsDialogStoreModule,
    SettingsStoreModule,
    TabsManagerStoreModule,
} from "@grok-types/stores";

import { findByPropsLazy } from "../turbopack";

export interface SubscriptionUtilsModule {
    getSubscriptionTierName: (tier: string) => string;
    useSubscriptions: () => { hasSubscriptions: boolean; bestSubscription?: { tier?: string } };
    SubscriptionTier: Record<string, string>;
}

export const SessionStore: SessionStoreModule = findByPropsLazy("useSession", "SessionStoreProvider");
export const SettingsStore: SettingsStoreModule = findByPropsLazy("useSettingsStore", "TOOL_NAMES");
export const SettingsDialogStore: SettingsDialogStoreModule = findByPropsLazy("useSettingsDialogStore");
export const FeatureStore: FeatureStoreModule = findByPropsLazy("useFeatureStore");
export const ConversationStore: ConversationStoreModule = findByPropsLazy("useConversationStore", "createOptimisticConversation");
export const ResponseStore: ResponseStoreModule = findByPropsLazy("useResponseStore", "createOptimisticResponse");
export const RoutingStore: RoutingStoreModule = findByPropsLazy("useRoutingStore", "formatUrl");
export const ModelsStore: ModelsStoreModule = findByPropsLazy("useModelsStore");
export const ChatPageStore: ChatPageStoreModule = findByPropsLazy("useChatPageStore", "getLatestThreadMessageId");
export const TabsManagerStore: TabsManagerStoreModule = findByPropsLazy("useTabsManagerStore");
export const SubscriptionUtils: SubscriptionUtilsModule = findByPropsLazy("getSubscriptionTierName", "SubscriptionTier");
