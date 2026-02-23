/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { getModuleCache } from "@turbopack/patchTurbopack";

import { SERIALIZE, STORE } from "./constants";
import type { StoreArgs } from "./types";
import { clamp, getPath, serialize } from "./utils";

interface ZustandLike {
    getState(): Record<string, unknown>;
    setState(partial: Record<string, unknown>): void;
    subscribe(listener: (state: Record<string, unknown>) => void): () => void;
    name?: string;
}

interface StoreEntry {
    id: number;
    name: string | null;
    keys: string[];
}

const STORE_ACTIONS = ["list", "get", "keys", "methods", "call", "subscribe"] as const;

let storeCache: StoreEntry[] | null = null;
let storeCacheGen = 0;

function isZustandStore(value: unknown): value is ZustandLike {
    if (value == null) return false;
    const t = typeof value;
    if (t !== "function" && t !== "object") return false;
    const v = value as Record<string, unknown>;
    return typeof v.getState === "function" && typeof v.setState === "function" && typeof v.subscribe === "function";
}

function findStores(): StoreEntry[] {
    const cache = getModuleCache();
    if (storeCache && storeCacheGen === cache.size) return storeCache;

    const stores: StoreEntry[] = [];
    const seen = new WeakSet<object>();

    for (const [id, exports] of cache) {
        if (exports == null || typeof exports !== "object") continue;
        const mod = exports as Record<string, unknown>;
        for (const key in mod) {
            try {
                const val = mod[key];
                if (!isZustandStore(val) || seen.has(val as object)) continue;
                seen.add(val as object);
                const state = val.getState();
                const stateKeys = state && typeof state === "object" ? Object.keys(state) : [];
                const storeName = (key.startsWith("use") ? key : null) ?? (typeof val.name === "string" && val.name !== "r" ? val.name : null) ?? (key !== "default" && key !== "r" ? key : null);
                stores.push({ id, name: storeName, keys: stateKeys.slice(0, 10) });
            } catch {
                /* skip problematic exports */
            }
        }
    }

    storeCache = stores;
    storeCacheGen = cache.size;
    return stores;
}

function getStoreFromModule(moduleId: number, exportName?: string | null): ZustandLike | null {
    const exports = getModuleCache().get(moduleId);
    if (!exports || typeof exports !== "object") return null;
    const mod = exports as Record<string, unknown>;
    if (exportName && isZustandStore(mod[exportName])) return mod[exportName] as ZustandLike;
    for (const key in mod) {
        try {
            if (isZustandStore(mod[key])) return mod[key] as ZustandLike;
        } catch {}
    }
    return null;
}

function findStoreByQuery(query: string | number): ZustandLike | null {
    const stores = findStores();
    const numQuery = typeof query === "string" ? Number(query) : query;
    if (!Number.isNaN(numQuery) && Number.isFinite(numQuery)) return getStoreFromModule(numQuery);

    const lower = String(query).toLowerCase();
    for (const entry of stores) {
        if (entry.name?.toLowerCase().includes(lower)) return getStoreFromModule(entry.id, entry.name);
    }
    for (const entry of stores) {
        if (entry.keys.some(k => k.toLowerCase().includes(lower))) return getStoreFromModule(entry.id, entry.name);
    }
    return null;
}

function storeNotFound(query: string | number): { error: string; similar?: string[] } {
    const stores = findStores();
    const lower = String(query).toLowerCase();
    const similar = stores
        .filter(s => s.name?.toLowerCase().includes(lower) || s.keys.some(k => k.toLowerCase().includes(lower)))
        .map(s => s.name ?? `module:${s.id}`)
        .slice(0, 5);
    return similar.length ? { error: `No store "${query}"`, similar } : { error: `No store "${query}". Use list action.` };
}

function describeValue(v: unknown): string {
    if (v == null) return String(v);
    const t = typeof v;
    if (t === "function") return `fn(${(v as Function).length})`;
    if (t !== "object") return `${t}:${String(v).slice(0, 40)}`;
    if (Array.isArray(v)) return `[${v.length}]`;
    if (v instanceof Map) return `Map(${v.size})`;
    if (v instanceof Set) return `Set(${v.size})`;
    return `{${Object.keys(v as object).length}}`;
}

export function handleStore(args: StoreArgs): unknown {
    const { action, query, path, depth = SERIALIZE.DEFAULT_DEPTH } = args;

    if (action === "list") {
        return findStores().map(s => ({ id: s.id, n: s.name, k: s.keys.slice(0, 5) }));
    }

    if (action === "get") {
        if (!query) return "Provide query";
        const store = findStoreByQuery(query);
        if (!store) return storeNotFound(query);
        const state = store.getState();
        if (path) return serialize(getPath(state, path), Math.min(depth, 4));
        return serialize(state, Math.min(depth, 3));
    }

    if (action === "keys") {
        if (!query) return "Provide query";
        const store = findStoreByQuery(query);
        if (!store) return storeNotFound(query);
        const state = store.getState();
        if (!state || typeof state !== "object") return [];
        const result: Record<string, string> = {};
        for (const k of Object.keys(state)) {
            try {
                result[k] = describeValue(state[k]);
            } catch {
                result[k] = "!";
            }
        }
        return result;
    }

    if (action === "methods") {
        if (!query) return "Provide query";
        const store = findStoreByQuery(query);
        if (!store) return storeNotFound(query);
        const state = store.getState();
        if (!state || typeof state !== "object") return [];
        const methods: Record<string, number> = {};
        for (const k of Object.keys(state)) {
            if (typeof state[k] === "function") methods[k] = (state[k] as Function).length;
        }
        return methods;
    }

    if (action === "call") {
        if (!query) return "Provide query";
        const { method, callArgs } = args;
        if (!method) return "Provide method";
        const store = findStoreByQuery(query);
        if (!store) return storeNotFound(query);
        const state = store.getState();
        if (!state || typeof state[method] !== "function") return { error: `No method "${method}"` };
        try {
            const result = (state[method] as Function)(...(callArgs ?? []));
            if (result != null && typeof (result as Promise<unknown>).then === "function") {
                return (result as Promise<unknown>).then(
                    v => serialize(v, Math.min(depth, 4)),
                    (e: unknown) => ({ error: e instanceof Error ? e.message : String(e) }),
                );
            }
            return serialize(result, Math.min(depth, 4));
        } catch (e: unknown) {
            return { error: e instanceof Error ? e.message : String(e) };
        }
    }

    if (action === "subscribe") {
        if (!query) return "Provide query";
        const store = findStoreByQuery(query);
        if (!store) return storeNotFound(query);
        const duration = clamp(args.duration ?? STORE.DEFAULT_DURATION, STORE.MIN_DURATION, STORE.MAX_DURATION);
        const maxCaptures = Math.min(args.maxCaptures ?? STORE.DEFAULT_CAPTURES, STORE.MAX_CAPTURES);
        const watchPath = args.path;

        return new Promise<unknown>(resolve => {
            const changes: Array<{ t: number; p?: string; from: unknown; to: unknown }> = [];
            const startTime = Date.now();
            let prev = watchPath ? getPath(store.getState(), watchPath) : store.getState();
            let done = false;

            const finish = (capped: boolean) => {
                if (done) return;
                done = true;
                unsub();
                resolve({ changes, ...(capped ? { capped: true } : {}), ms: Date.now() - startTime });
            };

            const unsub = store.subscribe((state: Record<string, unknown>) => {
                if (done) return;
                const cur = watchPath ? getPath(state, watchPath) : state;
                if (cur === prev) return;

                if (watchPath) {
                    changes.push({ t: Date.now() - startTime, p: watchPath, from: serialize(prev, 1), to: serialize(cur, 1) });
                } else if (typeof cur === "object" && cur != null && typeof prev === "object" && prev != null) {
                    const curObj = cur as Record<string, unknown>;
                    const prevObj = prev as Record<string, unknown>;
                    for (const k of Object.keys(curObj)) {
                        if (curObj[k] !== prevObj[k] && changes.length < maxCaptures) {
                            changes.push({ t: Date.now() - startTime, p: k, from: serialize(prevObj[k], 1), to: serialize(curObj[k], 1) });
                        }
                    }
                } else {
                    changes.push({ t: Date.now() - startTime, from: serialize(prev, 1), to: serialize(cur, 1) });
                }

                prev = cur;
                if (changes.length >= maxCaptures) finish(true);
            });

            setTimeout(() => finish(false), duration);
        });
    }

    return { error: `Unknown action: ${action}`, valid: STORE_ACTIONS };
}
