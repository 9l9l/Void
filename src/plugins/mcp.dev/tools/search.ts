/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { getModuleCache, getRuntimeFactoryRegistry, patchStats } from "@turbopack/patchTurbopack";

import { SEARCH } from "./constants";
import type { SearchArgs } from "./types";

let srcCache: Map<number, string> | null = null;
let srcCacheGen = 0;

function getSourceCache(): Map<number, string> {
    const registry = getRuntimeFactoryRegistry();
    if (!registry) return new Map();
    const gen = registry.size;
    if (srcCache && srcCacheGen === gen) return srcCache;
    srcCache = new Map();
    for (const [id, factory] of registry) srcCache.set(id, String(factory));
    srcCacheGen = gen;
    return srcCache;
}

function findMatch(src: string, pattern: string, regex: RegExp | null, startFrom = 0): { idx: number; len: number } | null {
    if (regex) {
        regex.lastIndex = startFrom;
        const m = regex.exec(src);
        if (!m) return null;
        return { idx: m.index, len: m[0].length };
    }
    const idx = src.indexOf(pattern, startFrom);
    if (idx === -1) return null;
    return { idx, len: pattern.length };
}

function sourceMatchesAll(src: string, patterns: string[]): boolean {
    return patterns.every(p => src.includes(p));
}

function shouldSkipModule(id: number, filter: string | undefined, loadedCache: Map<number, unknown> | null): boolean {
    if (!filter || !loadedCache) return false;
    if (filter === "loaded") return !loadedCache.has(id);
    if (filter === "unloaded") return loadedCache.has(id);
    return false;
}

interface SearchMatch {
    id: number;
    s: string;
    len?: number;
    at?: number;
    patched?: boolean;
}

export function handleSearch(args: SearchArgs): unknown {
    const { pattern, max = SEARCH.DEFAULT_MAX, context = SEARCH.DEFAULT_CONTEXT, id: targetId, and: andPatterns, filter } = args;

    if (filter && filter !== "loaded" && filter !== "unloaded") return { error: `Invalid filter: "${filter}". Use "loaded" or "unloaded".` };
    if (!pattern && !andPatterns?.length)
        return { error: 'Provide pattern (string or /regex/) or and[] (array of strings). Use count:true for count-only, filter:"loaded"/"unloaded" to narrow scope.' };

    const sources = getSourceCache();
    if (!sources.size) return "Factory registry not available";

    const loadedCache = filter ? getModuleCache() : null;
    const ctx = Math.min(context, SEARCH.MAX_CONTEXT);

    if (andPatterns?.length) {
        const allPatterns = pattern ? [pattern, ...andPatterns] : andPatterns;
        const matches: SearchMatch[] = [];
        let moduleHits = 0;

        for (const [id, src] of sources) {
            if (targetId != null && id !== targetId) continue;
            if (shouldSkipModule(id, filter, loadedCache)) continue;
            if (!sourceMatchesAll(src, allPatterns)) continue;
            moduleHits++;
            if (matches.length >= max) continue;

            const idx = src.indexOf(allPatterns[0]);
            const start = Math.max(0, idx - ctx);
            const end = Math.min(src.length, idx + allPatterns[0].length + ctx);
            const entry: SearchMatch = { id, s: src.slice(start, end), len: src.length };
            if (patchStats.patchedModules.has(id)) entry.patched = true;
            matches.push(entry);
        }
        const result: { matches: SearchMatch[]; totalModules?: number } = { matches };
        if (moduleHits > matches.length) result.totalModules = moduleHits;
        return result;
    }

    let regex: RegExp | null = null;
    const rm = pattern!.match(/^\/(.+)\/([gimsuy]*)$/);
    if (rm) {
        try {
            regex = new RegExp(rm[1], rm[2].includes("g") ? rm[2] : `${rm[2]}g`);
        } catch (e: unknown) {
            return `Invalid regex: ${e instanceof Error ? e.message : String(e)}`;
        }
    }

    if (args.count) {
        let moduleHits = 0;
        for (const [id, src] of sources) {
            if (targetId != null && id !== targetId) continue;
            if (shouldSkipModule(id, filter, loadedCache)) continue;
            if (findMatch(src, pattern!, regex)) moduleHits++;
        }
        return { count: moduleHits, total: sources.size };
    }

    const matches: SearchMatch[] = [];
    let total = 0;
    let moduleHits = 0;
    let capped = false;

    for (const [id, src] of sources) {
        if (targetId != null && id !== targetId) continue;
        if (shouldSkipModule(id, filter, loadedCache)) continue;

        if (targetId != null) {
            let startFrom = 0;
            while (matches.length < max && total < SEARCH.MAX_TOTAL) {
                const hit = findMatch(src, pattern!, regex, startFrom);
                if (!hit) break;
                const start = Math.max(0, hit.idx - ctx);
                const end = Math.min(src.length, hit.idx + hit.len + ctx);
                const snippet = src.slice(start, end);
                total += snippet.length;
                matches.push({ id, at: hit.idx, s: snippet });
                startFrom = hit.idx + Math.max(hit.len, 1);
            }
        } else {
            const hit = findMatch(src, pattern!, regex);
            if (!hit) continue;
            moduleHits++;
            if (capped) continue;
            if (matches.length >= max || total >= SEARCH.MAX_TOTAL) {
                capped = true;
                continue;
            }
            const start = Math.max(0, hit.idx - ctx);
            const end = Math.min(src.length, hit.idx + hit.len + ctx);
            const snippet = src.slice(start, end);
            total += snippet.length;
            const entry: SearchMatch = { id, len: src.length, s: snippet };
            if (patchStats.patchedModules.has(id)) entry.patched = true;
            matches.push(entry);
        }
    }
    const result: { matches: SearchMatch[]; totalModules?: number } = { matches };
    if (targetId == null && moduleHits > matches.length) result.totalModules = moduleHits;
    return result;
}
