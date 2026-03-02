/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { ReasoningMode, RequestKind } from "@grok-types/enums";

import { findByPropsLazy } from "../turbopack";

export const ApiClients = findByPropsLazy("chatApi", "modelsApi");

export const Toaster = findByPropsLazy("Toaster", "toast");

export const ClassNames = findByPropsLazy("cn", "middleTruncate");

export const ReasoningModeUtils: {
    reasoningModeToRequestKind: (mode: ReasoningMode) => RequestKind;
    reasoningModeToDeepsearchPreset: (mode: ReasoningMode) => string | undefined;
} = findByPropsLazy("reasoningModeToRequestKind", "reasoningModeToDeepsearchPreset");

export const zustandCreate: {
    <T>(initializer: (set: any, get: any, api: any) => T): any;
} = findByPropsLazy("create", "useStore");

export const i18n: {
    useTranslation: (namespace?: string) => { t: (key: string, values?: Record<string, any>) => string };
} = findByPropsLazy("useTranslation");

export const EnvUtils: {
    getEnv: (key: string) => string | undefined;
    useEnvironment: () => Record<string, string>;
} = findByPropsLazy("getEnv", "useEnvironment");

export const AssetUtils: {
    getAssetUrl: (assetServerUrl: string, key: string) => string | undefined;
    getCachedAssetUrl: (assetServerUrl: string, key: string) => string | undefined;
    getAssetKeyFromAssetUrl: (url: string) => string;
} = findByPropsLazy("getCachedAssetUrl", "getAssetUrl");

export const DownloadUtils: {
    downloadImage: (url: string, filename?: string, noCors?: boolean) => Promise<void>;
} = findByPropsLazy("downloadImage");

export const FileUtils: {
    downloadBlob: (blob: Blob, filename: string) => Promise<void>;
    downloadUri: (url: string, filename: string) => Promise<void>;
} = findByPropsLazy("downloadBlob", "downloadUri");

export const NextRouter: {
    useRouter: () => { push: (url: string, options?: any) => void; replace: (url: string, options?: any) => void; back: () => void; forward: () => void; refresh: () => void; prefetch: (url: string) => void };
    usePathname: () => string;
    useSearchParams: () => URLSearchParams;
    useParams: () => Record<string, string | string[]>;
    redirect: (url: string, type?: string) => never;
    notFound: () => never;
} = findByPropsLazy("useRouter", "usePathname");
