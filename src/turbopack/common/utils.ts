/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { ReasoningMode, RequestKind } from "@grok-types/enums";

import { findByPropsLazy } from "../turbopack";

export const Router = findByPropsLazy("useRouting", "Link", "getCanonicalUrl");
export const GrokRouter = findByPropsLazy("useGrokRouter");

export const Transport = findByPropsLazy("useTransport", "TransportProvider");
export const QueryClient = findByPropsLazy("QueryClientProvider", "useQueryClient");
export const CreateClientQuery = findByPropsLazy("createClientQuery");
export const ApiClients = findByPropsLazy("chatApi", "modelsApi");

export const StoreUtils = findByPropsLazy("createStore", "assign", "upsert");
export const ZustandMiddleware = findByPropsLazy("persist", "subscribeWithSelector", "devtools");
export const Zustand = findByPropsLazy("create", "useStore");
export const LocalStorage = findByPropsLazy("useLocalStorage", "useCleanupLocalStorage");

export const I18n = findByPropsLazy("useTranslation");

export const FeatureFlags = findByPropsLazy("useFeatureFlags", "useIsCodeEnabled");
export const Environment = findByPropsLazy("useEnvironment", "EnvironmentProvider");
export const Os = findByPropsLazy("useOs");
export const BrowserUtils = findByPropsLazy("isBrowser", "noop", "on", "off");

export const Toaster = findByPropsLazy("Toaster", "toast");
export const ClipboardUtils = findByPropsLazy("copyAndToast");
export const ThemeUtils = findByPropsLazy("ThemeProvider", "useTheme");
export const CommandMenu = findByPropsLazy("useCommandMenuStore", "createSelection");
export const Mobile = findByPropsLazy("useMobile", "useMobileSize");

export const Hotkeys = findByPropsLazy("useHotkeys");
export const KeyboardShortcuts = findByPropsLazy("KBD_CMD_MENU", "KBD_NEW_CHAT", "KBD_SETTINGS");

export const ErrorUtils = findByPropsLazy("logError", "logMetric", "NonBlockingError");

export const DateTime = findByPropsLazy("DateTime");
export const FormatUtils = findByPropsLazy("formatNumber");
export const DateHooks = findByPropsLazy("useDate", "useTime");

export const ClassNames = findByPropsLazy("cn", "middleTruncate");

export const CVA = findByPropsLazy("cva", "cx");

export const UrlUtils = findByPropsLazy("cleanUrl", "getGoogleFaviconUrl");

export const ImageUtils = findByPropsLazy("ImageViewer", "getImageUrl");
export const WorkspaceActions = findByPropsLazy("uploadFile", "useWorkspaceAssets");

export const DebouncedValue = findByPropsLazy("useDebouncedValue");
export const PreviousValue = findByPropsLazy("usePrevious");
export const IntersectionObserver = findByPropsLazy("useIntersectionObserver");
export const DeepCompare = findByPropsLazy("useDeepCompareEffect", "useDeepCompareMemo");

export const ReasoningModeUtils: {
    reasoningModeToRequestKind: (mode: ReasoningMode) => RequestKind;
    reasoningModeToDeepsearchPreset: (mode: ReasoningMode) => string | undefined;
} = findByPropsLazy("reasoningModeToRequestKind", "reasoningModeToDeepsearchPreset");
