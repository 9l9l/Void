/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Toaster } from "@turbopack/common/utils";

export const enum ToastType {
    MESSAGE,
    SUCCESS,
    ERROR,
    INFO,
    WARNING,
    LOADING,
}

export interface ToastOptions {
    duration?: number;
    id?: string | number;
}

const toastFns = ["message", "success", "error", "info", "warning", "loading"] as const;

export function showToast(message: string, type: ToastType = ToastType.MESSAGE, options?: ToastOptions) {
    const fn = toastFns[type];
    (Toaster.toast as Record<string, (msg: string, opts?: ToastOptions) => void>)[fn](message, options);
}
