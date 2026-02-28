/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type {
    ArtifactStoreModule,
    AssetStoreModule,
    ChatPageStoreModule,
    CommandMenuStoreModule,
    ConversationStoreModule,
    DevModelsStoreModule,
    FeatureStoreModule,
    FileStoreModule,
    MediaStoreModule,
    MentionMenuStoreModule,
    ModelsStoreModule,
    ModesStoreModule,
    NotificationsStoreModule,
    PersonalityStoreModule,
    ReportStoreModule,
    ResponseStoreModule,
    RoutingStoreModule,
    SessionStoreModule,
    SettingsDialogStoreModule,
    SettingsStoreModule,
    ShareStoreModule,
    SourcesSelectorStoreModule,
    SubscriptionsStoreModule,
    TabsManagerStoreModule,
    TasksStoreModule,
    TextToSpeechStoreModule,
    TourGuideStoreModule,
    UpsellStoreModule,
    WorkspaceCollectionsStoreModule,
    WorkspaceConnectorsStoreModule,
    WorkspaceStoreModule,
} from "@grok-types/stores";

import { findByPropsLazy } from "../turbopack";

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
export const MediaStore: MediaStoreModule = findByPropsLazy("useMediaStore", "useImagineModeStore");

export const ModesStore: ModesStoreModule = findByPropsLazy("useModesStore");
export const CommandMenuStore: CommandMenuStoreModule = findByPropsLazy("useCommandMenuStore", "createSelection");
export const UpsellStore: UpsellStoreModule = findByPropsLazy("useUpsellStore", "useShouldShowUpgradeButton");
export const ShareStore: ShareStoreModule = findByPropsLazy("useShareStore");
export const SourcesSelectorStore: SourcesSelectorStoreModule = findByPropsLazy("useSourcesSelectorStore");
export const TourGuideStore: TourGuideStoreModule = findByPropsLazy("useTourGuideStore", "useTourGuideTooltip");
export const DevModelsStore: DevModelsStoreModule = findByPropsLazy("useDevModelsStore", "DRAFT_MODEL_ID");
export const WorkspaceStore: WorkspaceStoreModule = findByPropsLazy("useWorkspaceStore", "useWorkspacesList");
export const MentionMenuStore: MentionMenuStoreModule = findByPropsLazy("useMentionMenuStore");
export const AssetStore: AssetStoreModule = findByPropsLazy("useAssetStore");
export const PersonalityStore: PersonalityStoreModule = findByPropsLazy("usePersonalityStore", "DEFAULT_CUSTOM_PERSONALITY");
export const ReportStore: ReportStoreModule = findByPropsLazy("useReportStore");
export const TextToSpeechStore: TextToSpeechStoreModule = findByPropsLazy("useTextToSpeechStore");
export const TasksStore: TasksStoreModule = findByPropsLazy("useTasksStore");
export const ArtifactStore: ArtifactStoreModule = findByPropsLazy("useArtifactStore", "useArtifactEdits");
export const WorkspaceCollectionsStore: WorkspaceCollectionsStoreModule = findByPropsLazy("useWorkspaceCollectionsStore", "useWorkspaceActiveCollectionIds");
export const WorkspaceConnectorsStore: WorkspaceConnectorsStoreModule = findByPropsLazy("useWorkspaceConnectorsStore", "useWorkspaceActiveConnectorIds");
