/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export function mergeDefaults<T extends object>(target: T, defaults: T): T {
    for (const key in defaults) {
        const value = target[key];
        if (isObject(value)) {
            mergeDefaults(value as Record<string, unknown>, defaults[key] as Record<string, unknown>);
        } else if (value === undefined) {
            target[key] = defaults[key];
        }
    }
    return target;
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function copyToClipboard(text: string): Promise<void> {
    try {
        await navigator.clipboard.writeText(text);
    } catch {
        if (typeof GM_setClipboard === "function") {
            GM_setClipboard(text);
        }
    }
}

export function onlyOnce<T extends (...args: never[]) => unknown>(fn: T): T {
    let result: unknown;
    let called = false;
    return ((...args: unknown[]) => {
        if (called) return result;
        called = true;
        result = fn(...(args as never[]));
        return result;
    }) as unknown as T;
}

export function debounce<T extends (...args: never[]) => void>(fn: T, ms: number): T & { cancel(): void } {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const debounced = ((...args: unknown[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...(args as never[])), ms);
    }) as unknown as T & { cancel(): void };
    debounced.cancel = () => clearTimeout(timer);
    return debounced;
}

export function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isTruthy<T>(value: T | false | null | undefined | 0 | ""): value is T {
    return !!value;
}

export function isNonNullish<T>(value: T | null | undefined): value is T {
    return value != null;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function formatCountdown(totalSeconds: number): string {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

export function formatDuration(totalSeconds: number): string {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    return h > 0 ? `${h}h` : `${m}m`;
}
