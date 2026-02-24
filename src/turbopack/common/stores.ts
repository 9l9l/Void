/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { ResolvedSubscriptionInfo } from "@grok-types/common";
import type { SubscriptionTier, SubscriptionTierName } from "@grok-types/enums";
import type {
    ChatPageStoreModule,
    ConversationStoreModule,
    FeatureStoreModule,
    FileStoreModule,
    ModelsStoreModule,
    NotificationsStoreModule,
    ResponseStoreModule,
    RoutingStoreModule,
    SessionStoreModule,
    SettingsDialogStoreModule,
    SettingsStoreModule,
    SubscriptionsStoreModule,
    TabsManagerStoreModule,
} from "@grok-types/stores";

import { findByPropsLazy } from "../turbopack";

export interface SubscriptionUtilsModule {
    getSubscriptionTierName: (tier: SubscriptionTier) => SubscriptionTierName;
    useSubscriptions: () => ResolvedSubscriptionInfo;
    SubscriptionTier: Record<string, SubscriptionTier>;
}

export const SessionStore: SessionStoreModule = findByPropsLazy("useSession", "SessionStoreProvider");
export const SettingsStore: SettingsStoreModule = findByPropsLazy("useSettingsStore", "TOOL_NAMES");
export const SettingsDialogStore: SettingsDialogStoreModule = findByPropsLazy("useSettingsDialogStore");
export const FeatureStore: FeatureStoreModule = findByPropsLazy("useFeatureStore");
export const FileStore: FileStoreModule = findByPropsLazy("useFileStore");
export const ConversationStore: ConversationStoreModule = findByPropsLazy("useConversationStore", "createOptimisticConversation");
export const ResponseStore: ResponseStoreModule = findByPropsLazy("useResponseStore", "createOptimisticResponse");
export const RoutingStore: RoutingStoreModule = findByPropsLazy("useRoutingStore", "formatUrl");
export const ModelsStore: ModelsStoreModule = findByPropsLazy("useModelsStore");
export const ChatPageStore: ChatPageStoreModule = findByPropsLazy("useChatPageStore", "getLatestThreadMessageId");
export const TabsManagerStore: TabsManagerStoreModule = findByPropsLazy("useTabsManagerStore");
export const SubscriptionsStore: SubscriptionsStoreModule = findByPropsLazy("useSubscriptionsStore");
export const NotificationsStore: NotificationsStoreModule = findByPropsLazy("useNotificationsStore", "useNotificationsStoreInit");
export const SubscriptionUtils: SubscriptionUtilsModule = findByPropsLazy("getSubscriptionTierName", "SubscriptionTier");
