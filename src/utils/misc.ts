/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export function mergeDefaults<T extends object>(target: T, defaults: T): T {
    for (const key in defaults) {
        if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
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

export function fetchExternal(url: string): Promise<Response> {
    if (IS_EXTENSION || typeof GM_xmlhttpRequest === "undefined") return fetch(url);

    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url,
            responseType: "blob",
            onload(resp: any) {
                const blob: Blob = resp.response;
                resolve(new Response(blob, {
                    status: resp.status,
                    statusText: resp.statusText,
                }));
            },
            ontimeout() { reject(new Error("fetch timeout")); },
            onerror() { reject(new Error("fetch error")); },
            onabort() { reject(new Error("fetch aborted")); },
        });
    });
}

export interface ExternalStore {
    notify(): void;
    subscribe(callback: () => void): () => void;
    getSnapshot(): number;
}

export function createExternalStore(): ExternalStore {
    const listeners = new Set<() => void>();
    let version = 0;

    return {
        notify() {
            version++;
            for (const fn of listeners) fn();
        },
        subscribe(callback: () => void) {
            listeners.add(callback);
            return () => { listeners.delete(callback); };
        },
        getSnapshot() {
            return version;
        },
    };
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

/** Math.min(Math.max(value, min), max) */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/** Safe error-to-string extraction. */
export function errorMessage(err: unknown): string {
    return err instanceof Error ? err.message : String(err);
}

/** Trigger a browser file download. */
export function downloadFile(filename: string, content: BlobPart, mimeType = "application/octet-stream") {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

/** Create a filesystem-safe filename from a string. */
export function sanitizeFilename(title: string, fallback = "file"): string {
    return title.replace(/[^a-zA-Z0-9 ]/g, "").trim().replace(/\s+/g, "-") || fallback;
}
