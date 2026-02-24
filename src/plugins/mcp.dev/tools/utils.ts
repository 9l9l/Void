/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { getModuleCache, getRuntimeFactoryRegistry, patchStats } from "@turbopack/patchTurbopack";
import type { PatchedModuleFactory } from "@turbopack/types";
import { SYM_PATCHED_BY, SYM_PATCHED_CODE } from "@turbopack/types";

import { SERIALIZE } from "./constants";

// ── Serialization ──

export function serialize(value: unknown, depth: number = SERIALIZE.DEFAULT_DEPTH): unknown {
    if (value == null) return value;
    const t = typeof value;
    if (t === "function") return `[fn:${(value as Function).name || "?"}]`;
    if (t === "symbol") return (value as symbol).toString();
    if (t === "bigint") return `${value}n`;
    if (t !== "object") return value;
    if (depth <= 0) return "[…]";

    const seen = new WeakSet<object>();
    return serializeInner(value as object, depth, seen);
}

function serializeInner(value: unknown, depth: number, seen: WeakSet<object>): unknown {
    if (value == null) return value;
    const t = typeof value;
    if (t !== "object" && t !== "function") return value;
    if (t === "function") return `[fn:${(value as Function).name || "?"}]`;
    if (depth <= 0) return "[…]";
    if (seen.has(value as object)) return "[Circular]";
    seen.add(value as object);

    try {
        if (Array.isArray(value)) {
            if (value.length > SERIALIZE.MAX_ARRAY) return `[Array(${value.length})]`;
            return value.slice(0, SERIALIZE.MAX_ARRAY).map(v => serializeInner(v, depth - 1, seen));
        }
        if (value instanceof Date) return value.toISOString();
        if (value instanceof RegExp) return String(value);
        if (value instanceof Set) return `[Set(${value.size})]`;
        if (value instanceof Map) return `[Map(${value.size})]`;
        if (value instanceof Error) return `[Error: ${value.message}]`;
        const obj = value as Record<string, unknown>;
        const result: Record<string, unknown> = {};
        const keys = Object.keys(obj);
        const len = Math.min(keys.length, SERIALIZE.MAX_KEYS);
        for (let i = 0; i < len; i++) {
            const key = keys[i];
            try {
                result[key] = serializeInner(obj[key], depth - 1, seen);
            } catch {
                result[key] = "[!]";
            }
        }
        if (keys.length > SERIALIZE.MAX_KEYS) result["…"] = `+${keys.length - SERIALIZE.MAX_KEYS} keys`;
        return result;
    } finally {
        seen.delete(value as object);
    }
}

// ── Factory source cache (shared across search, patch, module) ──

let factorySourceCache: Map<number, string> | null = null;
let factorySourceCacheGen = 0;

export function getFactorySourceCache(): Map<number, string> {
    const registry = getRuntimeFactoryRegistry();
    if (!registry) return new Map();
    const gen = registry.size;
    if (factorySourceCache && factorySourceCacheGen === gen) return factorySourceCache;
    factorySourceCache = new Map();
    for (const [id, factory] of registry) factorySourceCache.set(id, String(factory));
    factorySourceCacheGen = gen;
    return factorySourceCache;
}

export function getAllFactorySources(): string[] {
    const cache = getFactorySourceCache();
    return [...cache.values()];
}

export function countInSources(sources: string[], text: string, max: number): number {
    let count = 0;
    for (const src of sources) {
        if (src.includes(text)) {
            count++;
            if (count >= max) return count;
        }
    }
    return count;
}

// ── Module lookups ──

export function getFactorySource(id: number): string | null {
    const registry = getRuntimeFactoryRegistry();
    if (!registry) return null;
    const factory = registry.get(id);
    return factory ? String(factory) : null;
}

let reverseCache: Map<unknown, number> | null = null;
let reverseCacheGeneration = 0;

export function findModuleId(exportValue: unknown): number | null {
    const cache = getModuleCache();
    const currentGen = cache.size;
    if (!reverseCache || reverseCacheGeneration !== currentGen) {
        reverseCache = new Map();
        for (const [id, exports] of cache) {
            reverseCache.set(exports, id);
            if (typeof exports === "object" && exports != null) {
                for (const key in exports as Record<string, unknown>) {
                    try {
                        const val = (exports as Record<string, unknown>)[key];
                        if (!reverseCache.has(val)) reverseCache.set(val, id);
                    } catch {}
                }
            }
        }
        reverseCacheGeneration = currentGen;
    }
    return reverseCache.get(exportValue) ?? null;
}

// ── Patch metadata ──

export function getPatchInfo(moduleId: number): string[] | null {
    const registry = getRuntimeFactoryRegistry();
    if (!registry) return null;
    const factory = registry.get(moduleId) as PatchedModuleFactory | undefined;
    return factory?.[SYM_PATCHED_BY] ?? null;
}

export function getPatchedSource(moduleId: number): string | null {
    const registry = getRuntimeFactoryRegistry();
    if (!registry) return null;
    const factory = registry.get(moduleId) as PatchedModuleFactory | undefined;
    return factory?.[SYM_PATCHED_CODE] ?? null;
}

export function isModulePatched(id: number): boolean {
    return patchStats.patchedModules.has(id);
}

// ── Regex helpers ──

export function countCaptureGroups(matchStr: string): number {
    let count = 0;
    for (let i = 0; i < matchStr.length; i++) {
        if (matchStr[i] === "\\" && i + 1 < matchStr.length) {
            i++;
            continue;
        }
        if (matchStr[i] === "(" && matchStr[i + 1] !== "?") count++;
    }
    return count;
}

export function parseRegexPattern(pattern: string): { regex: RegExp | null; literal: string } {
    const rm = pattern.match(/^\/(.+)\/([gimsuy]*)$/);
    if (rm) {
        try {
            return { regex: new RegExp(rm[1], rm[2].includes("g") ? rm[2] : `${rm[2]}g`), literal: pattern };
        } catch {
            return { regex: null, literal: pattern };
        }
    }
    return { regex: null, literal: pattern };
}

// ── General helpers ──

export function getPath(obj: unknown, path: string): unknown {
    let current = obj;
    for (const p of path.split(".")) {
        if (current == null || typeof current !== "object") return undefined;
        current = (current as Record<string, unknown>)[p];
    }
    return current;
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}
