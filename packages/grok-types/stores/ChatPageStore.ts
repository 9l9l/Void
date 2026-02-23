/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { ConversationMode } from "../enums/conversation";
import type { ModelMode, ReasoningMode } from "../enums/models";
import type { VoiceActivityStatus, VoiceConnectionStatus } from "../enums/voice";
import type { ZustandStore } from "../zustand";

/**
 * Zustand state for the active chat page.
 *
 * Module ID: **246429**. The largest store in Grok, managing the current conversation,
 * model selection, rate limiting, voice mode, streaming state, side panel,
 * and all chat-related UI state.
 */
export interface ChatPageStoreState {
    // ── Conversation State ──────────────────────────────────────────────

    /** Active conversation ID, or undefined for a new chat. */
    conversationId: string | undefined;
    /** Optimistic conversation ID assigned before the server confirms creation. */
    optimisticConversationId: string | undefined;
    /** ID of the last message in the conversation thread. */
    lastMessageId: string | undefined;
    /** Current content displayed in the side panel (response details, search results, etc.). */
    sidePanelContent: any;
    /** Navigation stack for side panel drill-down (back button support). */
    sidePanelStack: any[];
    /** Response ID associated with the current side panel content. */
    sidePanelResponseId: string | undefined;

    // ── Model & Mode ────────────────────────────────────────────────────

    /** Currently selected model ID (e.g. "grok-420", "grok-4"). */
    activeModelId: string;
    /** Selected custom system prompt ID, or undefined for default. */
    selectedSystemPromptId: string | undefined;
    /** Conversation interaction mode (e.g. "chat", "deep_search"). */
    conversationMode: ConversationMode;
    /** Reasoning depth mode (e.g. "none", "think", "deepsearch"). */
    reasoningMode: ReasoningMode;
    /** Model variant mode from the model picker (e.g. "expert", "fast", "auto"). */
    modelMode: ModelMode;

    // ── Rate Limiting ───────────────────────────────────────────────────

    /** Whether the user is rate-limited. `false` when not limited, or a string error message. */
    isRateLimited: boolean | string;
    /** Whether thinking/reasoning mode is specifically rate-limited. */
    isThinkingRateLimited: boolean;
    /** Whether deep search mode is specifically rate-limited. */
    isDeepSearchRateLimited: boolean;
    /** Whether the user needs to authenticate to continue. */
    isUnauthenticated: boolean;

    // ── UI State ────────────────────────────────────────────────────────

    /** Whether the query/input bar is expanded (default: true). */
    queryBarExpanded: boolean;
    /** Debounce flag while the user is actively typing. */
    isTypingDebounce: boolean;
    /** Whether to show the streaming dots indicator. */
    showStreamingIndicator: boolean;
    /** Whether deeper search mode is selected in the UI toggle. */
    isDeeperSearchSelected: boolean;
    /** Whether the share dialog is open. */
    requestShareDialogOpen: boolean;
    /** Whether the chat page has finished its initial load. */
    chatPageLoaded: boolean;

    // ── Default Models ──────────────────────────────────────────────────

    /** Default model ID for anonymous users, from the models API. */
    defaultAnonModelId: string;
    /** Default model ID for free-tier users, from the models API. */
    defaultFreeModelId: string;
    /** Default model ID for pro users, or undefined if not set. */
    defaultProModelId: string | undefined;

    // ── Streaming & Messages ────────────────────────────────────────────

    /** Set of message IDs that were optimistically created but are now stale. */
    staleOptimisticMessageIds: Set<string>;
    /** ID of the response currently being streamed. */
    streamedMessageId: string | undefined;
    /** ID of an optimistically created message (before server confirms). */
    optimisticMessageId: string | undefined;
    /** Set of preferred response IDs selected by the user in A/B comparisons. */
    preferredResponses: Set<string>;
    /** Whether the current response is using an experimental model. */
    usingExperiment: boolean;

    // ── Side-by-Side & Metadata ─────────────────────────────────────────

    /** Configuration for side-by-side response comparison mode. */
    sideBySideConfig: any;
    /** Data for the quote popup overlay. */
    quotePopupData: any;
    /** Arbitrary metadata attached to the current chat session. */
    metadata: Record<string, any>;
    /** Workspace project ID, or undefined for non-workspace chats. */
    projectId: string | undefined;
    /** Selected personality preset ID, or undefined for default assistant. */
    selectedPersonalityId: string | undefined;
    /** Custom personality configuration object. */
    customPersonality: any;
    /** Text quoted from a response for reply context. */
    quotedText: string | undefined;
    /** Map of conversation ID to draft query text (preserves drafts across conversations). */
    queryByConversationId: Record<string, string>;
    /** Post-response satisfaction survey data. */
    survey: any;
    /** Selected conversation template for structured prompts. */
    selectedConversationTemplate: any;
    /** Whether to show the template input guide overlay. */
    showConversationTemplateInputGuide: boolean;

    // ── Voice Mode ──────────────────────────────────────────────────────

    /** Current voice activity state (idle, speaking, listening). */
    voiceActivityStatus: VoiceActivityStatus;
    /** LiveKit room instance for WebRTC voice connections. */
    livekitRoom: any;
    /** LiveKit authentication token for the current voice session. */
    livekitToken: string | null;
    /** Request ID for the current LiveKit token request. */
    livekitRequestId: string | null;
    /** WebRTC voice connection lifecycle state. */
    voiceConnectionStatus: VoiceConnectionStatus;
    /** Selected voice persona ID (e.g. "Ara", "Sage"). */
    voiceId: string;
    /** Personality ID used during voice mode (e.g. "assistant"). */
    voicePersonalityId: string;
    /** Custom instructions for voice mode behavior. */
    voiceCustomInstructions: string | null;
    /** Voice playback speed multiplier (1.0 = normal). */
    voicePlaybackSpeed: number;
    /** Selected microphone device ID, or undefined for system default. */
    selectedAudioInputDeviceId: string | undefined;
    /** List of available audio input devices. */
    audioInputDevices: any[];
    /** Whether to auto-open search result cards during voice mode. */
    voiceAutoOpenSearchResults: boolean;
    /** Timeout ID for voice mode auto-disconnect. */
    voiceModeTimeoutId: number | null;
    /** Unique ID for the current voice session. */
    currentVoiceSessionId: string | null;
    /** Conversation ID created during the current voice session. */
    voiceSessionConversationId: string | null;
    /** Promise tracking the voice mode exit flow. */
    exitVoiceModePromise: Promise<void> | null;
    /** Optimistic asset IDs for voice conversation attachments. */
    optimisticVoiceConversationAssetIds: string[];
    /** Whether to show the voice session rating survey. */
    showVoiceRatingSurvey: boolean;
    /** Session data collected for the voice rating survey. */
    voiceRatingSessionData: any;

    // ── Setters ─────────────────────────────────────────────────────────

    setModelMode: (mode: ModelMode) => void;
    setConversationId: (id: string | undefined) => void;
    setProjectId: (id: string | undefined) => void;
    setOptimisticConversationId: (id: string | undefined) => void;
    setLastMessageId: (id: string | undefined) => void;
    setQuotePopupData: (data: any) => void;
    setSidePanelContent: (content: any) => void;
    closeSidePanel: () => void;
    getSidePanelResponseId: () => string | undefined;
    setSidePanelStack: (stack: any[]) => void;
    updateSidePanelResponseId: (id: string | undefined, content: any) => void;
    toggleSidePanelContent: (content: any) => void;
    setStreamedMessageId: (id: string | undefined) => void;
    setActiveModelId: (id: string) => void;
    setSelectedSystemPromptId: (id: string | undefined) => void;
    setIsRateLimited: (value: boolean | string) => void;
    setIsRateLimitedFromError: (error: any) => void;
    setIsUnauthenticated: (value: boolean) => void;
    setOptimisticMessageId: (id: string | undefined) => void;
    setConversationMode: (mode: ConversationMode) => void;
    setReasoningMode: (mode: ReasoningMode) => void;
    setChatPageLoaded: (loaded: boolean) => void;
    setDefaultAnonModelId: (id: string) => void;
    setDefaultFreeModelId: (id: string) => void;
    setDefaultProModelId: (id: string) => void;
    setMetadata: (metadata: Record<string, any>) => void;
    setSelectedPersonalityId: (id: string | undefined) => void;
    setCustomPersonality: (personality: any) => void;
    setQuotedText: (text: string | undefined) => void;
    setQueryBarExpanded: (expanded: boolean) => void;
    setIsTypingDebounce: (value: boolean) => void;
    setIsDeeperSearchSelected: (value: boolean) => void;
    setShowStreamingIndicator: (value: boolean) => void;
    setRequestShareDialogOpen: (open: boolean) => void;
    setSideBySideConfig: (config: any) => void;
    setSurvey: (survey: any) => void;
    setSelectedConversationTemplate: (template: any, show: boolean) => void;
    setShowConversationTemplateInputGuide: (show: boolean) => void;
    addPreferredResponse: (responseId: string) => void;
    setUsingExperiment: (value: boolean) => void;
    setStaleOptimisticMessageIds: (ids: Set<string>) => void;

    // ── Voice Setters ───────────────────────────────────────────────────

    setVoiceConnectionStatus: (status: VoiceConnectionStatus) => void;
    setVoiceActivityStatus: (status: VoiceActivityStatus) => void;
    setVoiceId: (id: string) => void;
    setVoicePersonalityId: (id: string) => void;
    setVoiceCustomInstructions: (instructions: string | null) => void;
    setVoicePlaybackSpeed: (speed: number) => void;
    setSelectedAudioInputDeviceId: (id: string | undefined) => void;
    setAudioInputDevices: (devices: any[]) => void;
    setVoiceAutoOpenSearchResults: (value: boolean) => void;
    setLivekitRoom: (room: any) => void;
    setLivekitToken: (token: string | null) => void;
    setLivekitRequestId: (id: string | null) => void;
    setVoiceModeTimeoutId: (id: number | null) => void;
    setCurrentVoiceSessionId: (id: string | null) => void;
    setVoiceSessionConversationId: (id: string | null) => void;
    setShowVoiceRatingSurvey: (show: boolean) => void;
    setVoiceRatingSessionData: (data: any) => void;
    setOptimisticVoiceConversationAssetIds: (ids: string[]) => void;

    // ── Actions ─────────────────────────────────────────────────────────

    /** Check if a streaming error is retryable (transient network issues). */
    isErrorRetryable: (error: any) => boolean;
    /** Create a new conversation and send the first message. */
    establishNewConversation: (...args: any[]) => Promise<void>;
    /** Send a new response in the current conversation. */
    sendResponse: (...args: any[]) => Promise<void>;
    /** Reconnect to in-flight streaming responses after a page reload. */
    reconnectToInflightResponses: (...args: any[]) => Promise<void>;
    /** Abort an active streaming response. */
    abortStream: (...args: any[]) => Promise<void>;

    // ── Voice Actions ───────────────────────────────────────────────────

    /** Enter voice mode and establish a WebRTC connection. */
    enterVoiceMode: (...args: any[]) => Promise<void>;
    /** Attempt to enter voice mode with permission checks. */
    attemptEnterVoiceMode: (...args: any[]) => Promise<void>;
    /** Exit voice mode and disconnect WebRTC. */
    exitVoiceMode: (...args: any[]) => Promise<void>;
    /** Perform the actual voice mode exit (internal). */
    performExitVoiceMode: (...args: any[]) => Promise<void>;
    /** Request a new LiveKit authentication token. */
    requestLivekitToken: (...args: any[]) => Promise<void>;
    /** Toggle screen sharing in voice mode. */
    toggleScreenSharing: () => Promise<void>;
    /** Send updated voice settings to the server. */
    sendVoiceSettingsUpdate: (...args: any[]) => void;
    /** Send a manual text message during voice mode. */
    sendVoiceManualMessage: (...args: any[]) => void;
    /** Send file attachments during voice mode. */
    sendVoiceAttachments: (...args: any[]) => void;
    /** Handle a voice connection ping (keepalive). */
    handleVoiceConnectionPing: () => void;
    /** Check if microphone permission is already granted. */
    checkMicrophonePermission: () => Promise<boolean>;
    /** Request microphone permission from the browser. */
    requestMicrophonePermission: () => Promise<boolean>;
}

/** Module exports for the ChatPage store (module **246429**). */
export interface ChatPageStoreModule {
    /** Zustand store hook for chat page state. */
    useChatPageStore: ZustandStore<ChatPageStoreState>;
    /** Get the latest thread message ID for branching conversations. */
    getLatestThreadMessageId: (...args: any[]) => string | undefined;
    /** Convert model config mode string to internal ModelMode. */
    modelConfigModelModeToModelMode: (mode: string) => string;
    /** Convert internal ModelMode to model config mode string. */
    modelModeToModelConfigModelMode: (mode: string) => string;
}
