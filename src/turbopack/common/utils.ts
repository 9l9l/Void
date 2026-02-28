/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { ReasoningMode, RequestKind } from "@grok-types/enums";

import { findByPropsLazy } from "../turbopack";

// #region API clients

export const ApiClients = findByPropsLazy("chatApi", "modelsApi");

// #endregion

// #region UI utilities

export const Toaster = findByPropsLazy("Toaster", "toast");

export const ClassNames = findByPropsLazy("cn", "middleTruncate");

// #endregion

// #region Model / reasoning utilities

export const ReasoningModeUtils: {
    reasoningModeToRequestKind: (mode: ReasoningMode) => RequestKind;
    reasoningModeToDeepsearchPreset: (mode: ReasoningMode) => string | undefined;
} = findByPropsLazy("reasoningModeToRequestKind", "reasoningModeToDeepsearchPreset");

// #endregion

// #region Zustand

/** Grok's Zustand `create` function. Use this to create new stores using the same Zustand instance as Grok. */
export const zustandCreate: {
    <T>(initializer: (set: any, get: any, api: any) => T): any;
} = findByPropsLazy("create", "useStore");

// #endregion

// #region i18n

/** Grok's `useTranslation` hook for internationalized strings. */
export const i18n: {
    useTranslation: (namespace?: string) => { t: (key: string, values?: Record<string, unknown>) => string };
} = findByPropsLazy("useTranslation");

// #endregion

// #region Next.js router

/** Next.js navigation hooks and utilities. */
export const NextRouter: {
    useRouter: () => { push: (url: string, options?: any) => void; replace: (url: string, options?: any) => void; back: () => void; forward: () => void; refresh: () => void; prefetch: (url: string) => void };
    usePathname: () => string;
    useSearchParams: () => URLSearchParams;
    useParams: () => Record<string, string | string[]>;
    redirect: (url: string, type?: string) => never;
    notFound: () => never;
} = findByPropsLazy("useRouter", "usePathname");

// #endregion
