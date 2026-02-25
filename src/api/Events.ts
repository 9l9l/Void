/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

type Handler = (data: unknown) => void;

const listeners = new Map<string, Set<Handler>>();

export function subscribe(event: string, handler: Handler): () => void {
    let set = listeners.get(event);
    if (!set) {
        set = new Set();
        listeners.set(event, set);
    }
    set.add(handler);
    return () => {
        set.delete(handler);
    };
}

export function dispatch(event: string, data?: unknown) {
    const set = listeners.get(event);
    if (!set?.size) return;
    for (const handler of [...set]) handler(data);
}
