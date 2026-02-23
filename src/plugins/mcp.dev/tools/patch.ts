/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { getRuntimeFactoryRegistry, patches, patchStats } from "@turbopack/patchTurbopack";
import { search } from "@turbopack/turbopack";
import type { PatchedModuleFactory } from "@turbopack/types";
import { SYM_PATCHED_BY } from "@turbopack/types";
import { canonicalizeMatch } from "@utils/patches";

import { PATCH } from "./constants";
import type { PatchArgs } from "./types";

interface LintWarning {
    severity: "error" | "warn" | "info";
    message: string;
    fix?: string;
}

function lintMatchRegex(matchStr: string, replaceStr?: string): LintWarning[] {
    const warnings: LintWarning[] = [];

    if (/\.\+\?/.test(matchStr)) warnings.push({ severity: "error", message: "Unbounded .+? gap", fix: "Use .{0,N}" });
    if (/\.\*\?/.test(matchStr)) warnings.push({ severity: "error", message: "Unbounded .*? gap", fix: "Use .{0,N}" });

    const varRe = /(?:^|[^\\])(?:\b)([etrnioslcu])(?=[.,()\[\]{}=!<>?:])/g;
    const foundVars = new Set<string>();
    let vm;
    while ((vm = varRe.exec(matchStr)) !== null) {
        if (!matchStr.startsWith("\\i", vm.index + vm[0].length - 1)) foundVars.add(vm[1]);
    }
    if (foundVars.size) {
        warnings.push({ severity: "error", message: `Hardcoded minified var(s): ${[...foundVars].slice(0, 5)}`, fix: "Use \\i" });
    }

    if (/\\i(?:\.\\i)+/.test(matchStr) && !/["'][^"']+["']/.test(matchStr)) {
        warnings.push({ severity: "warn", message: "Isolated \\i.\\i chain without anchors", fix: "Add string literals" });
    }

    if (/\.\{0,\d{3,}\}/.test(matchStr)) warnings.push({ severity: "warn", message: "Very large gap bound (100+)", fix: "Narrow the gap" });

    const groups = (matchStr.match(/\((?!\?)/g) ?? []).length;
    if (groups > 5) warnings.push({ severity: "warn", message: `${groups} capture groups`, fix: "Use (?:...) for unused groups" });

    if (replaceStr) {
        const refs = replaceStr.match(/\$(\d+)/g)?.map(g => Number(g.slice(1))) ?? [];
        for (const ref of refs) {
            if (ref > groups) warnings.push({ severity: "error", message: `$${ref} referenced but only ${groups} groups` });
        }
        const usedGroups = new Set(refs);
        for (let i = 1; i <= groups; i++) {
            if (!usedGroups.has(i)) warnings.push({ severity: "info", message: `$${i} unused`, fix: "Use (?:...)" });
        }
    }

    if (matchStr.length > 200) warnings.push({ severity: "info", message: "Long regex (200+ chars)", fix: "Split into multiple patches" });

    return warnings;
}

function testMatchOnSource(src: string, id: number, matchStr: string, replaceStr: string, flags?: string) {
    let regex: RegExp;
    try {
        regex = canonicalizeMatch(new RegExp(matchStr, flags ?? ""));
    } catch (e: unknown) {
        return { status: "INVALID_REGEX" as const, error: e instanceof Error ? e.message : String(e) };
    }

    const warnings: string[] = [];
    if (/\.\+\?/.test(matchStr)) warnings.push("Unbounded .+? gap, use .{0,N}");
    if (/\.\*\?/.test(matchStr)) warnings.push("Unbounded .*? gap, use .{0,N}");
    if ((matchStr.match(/\((?!\?)/g) ?? []).length > PATCH.MAX_CAPTURE_WARN) warnings.push("Many capture groups");
    if (replaceStr.includes("$self")) warnings.push('$self is expanded at runtime to Void.plugins["Name"], not in test preview');

    let matched: RegExpMatchArray | null;
    try {
        matched = src.match(regex);
    } catch (e: unknown) {
        return { status: "MATCH_FAILED", id, hint: `Regex error: ${e instanceof Error ? e.message : String(e)}`, ...(warnings.length && { warnings }) };
    }

    if (!matched) {
        const literal = matchStr.replace(/[\\^$.*+?()[\]{}|]/g, "").slice(0, PATCH.HINT_LITERAL_SLICE);
        const hint = src.includes(literal) ? "Literal found but regex didn't match — check quantifiers and escaping" : "No literal match either — check find targets the right module";
        return { status: "MATCH_FAILED", id, hint, ...(warnings.length && { warnings }) };
    }

    const replaceGroups = replaceStr.match(/\$(\d+)/g)?.map((g: string) => Number(g.slice(1))) ?? [];
    const captureCount = (matchStr.match(/\((?!\?)/g) ?? []).length;
    for (const g of replaceGroups) {
        if (g > captureCount) warnings.push(`$${g} referenced but only ${captureCount} groups`);
    }

    const globalRegex = new RegExp(regex.source, regex.flags.includes("g") ? regex.flags : `${regex.flags}g`);
    const allMatches = src.match(globalRegex);
    if (allMatches && allMatches.length > 1) warnings.push(`Regex matches ${allMatches.length} times in source — only first is replaced without g flag`);

    const patchedSrc = src.replace(regex, replaceStr);
    if (patchedSrc === src) warnings.push("Replacement produced identical output (no-op)");

    const at = src.indexOf(matched[0]);
    const cs = Math.max(0, at - PATCH.CONTEXT_PAD);
    const ce = Math.min(src.length, at + matched[0].length + PATCH.CONTEXT_PAD);

    const result: Record<string, unknown> = {
        status: "VALID",
        id,
        at,
        len: src.length,
        matched: matched[0].slice(0, PATCH.MATCH_SLICE),
        before: src.slice(cs, ce),
        after: patchedSrc.slice(cs, ce + (patchedSrc.length - src.length)),
    };
    if (matched.length > 1) result.groups = matched.slice(1).map((g: string) => g?.slice(0, PATCH.GROUP_SLICE));
    if (warnings.length) result.warnings = warnings;
    return result;
}

function diagnoseOrphaned(p: (typeof patches)[number]) {
    const findStr = String(p.find);
    const canonFind = canonicalizeMatch(findStr);
    const results = search(canonFind);
    const ids = Object.keys(results).map(Number);
    const replacements = Array.isArray(p.replacement) ? p.replacement : [p.replacement];

    if (!ids.length) return { plugin: p.plugin, find: findStr.slice(0, PATCH.FIND_SLICE), n: replacements.length, reason: "find matched 0 modules" };

    const src = String(results[ids[0]]);
    const failed = replacements.filter(r => {
        try {
            return !canonicalizeMatch(new RegExp(String(r.match))).test(src);
        } catch {
            return true;
        }
    });

    const reason =
        failed.length === replacements.length
            ? `find matched ${ids.length} module(s) but all ${replacements.length} match regex(es) failed`
            : `find matched ${ids.length} module(s), ${failed.length}/${replacements.length} match regex(es) failed`;

    return { plugin: p.plugin, find: findStr.slice(0, PATCH.FIND_SLICE), n: replacements.length, reason };
}

export function handlePatch(args: PatchArgs): unknown {
    const { action, find: findStr, match: matchStr, replace: replaceStr, flags } = args;

    if (action === "list") {
        return patches.map(p => {
            const replacements = Array.isArray(p.replacement) ? p.replacement : [p.replacement];
            return {
                plugin: p.plugin,
                find: String(p.find).slice(0, PATCH.FIND_SLICE),
                all: !!p.all,
                replacements: replacements.map(r => ({
                    match: String(r.match).slice(0, PATCH.MATCH_SLICE),
                    replace: typeof r.replace === "string" ? r.replace.slice(0, PATCH.MATCH_SLICE) : "[function]",
                })),
            };
        });
    }

    if (action === "analyze") {
        if (!findStr) return "Provide find string";
        const canonFind = canonicalizeMatch(findStr);
        const results = search(canonFind);
        const ids = Object.keys(results).map(Number);
        if (!ids.length) return { unique: false, count: 0, hint: "No modules match this find string" };

        if (ids.length === 1) {
            const id = ids[0];
            const src = String(results[id]);
            const findIdx = typeof canonFind === "string" ? src.indexOf(canonFind) : src.search(canonFind);
            const ctxPad = 300;
            const start = Math.max(0, findIdx - ctxPad);
            const ctx = src.slice(start, start + ctxPad * 2);
            const nearbyI18n = extractI18nKeys(ctx);
            const result: Record<string, unknown> = { unique: true, id, at: findIdx, len: src.length, ctx };
            if (nearbyI18n.length) result.i18nKeys = nearbyI18n;
            return result;
        }

        const firstSrc = String(results[ids[0]]);
        const sameSource = ids.every(mid => String(results[mid]) === firstSrc);

        const entries = ids.slice(0, PATCH.ANALYZE_IDS_LIMIT).map(mid => {
            const modSrc = String(results[mid]);
            const modIdx = typeof canonFind === "string" ? modSrc.indexOf(canonFind) : modSrc.search(canonFind);
            const start = Math.max(0, modIdx - PATCH.ANALYZE_CONTEXT_PAD);
            return { id: mid, ctx: modSrc.slice(start, start + PATCH.ANALYZE_CONTEXT_SIZE) };
        });

        return { unique: false, count: ids.length, entries, ...(sameSource && { sharedFactory: true }) };
    }

    if (action === "test") {
        if (!findStr || !matchStr || !replaceStr) return "Provide find, match, and replace";

        const canonFind = canonicalizeMatch(findStr);
        const results = search(canonFind);
        const ids = Object.keys(results).map(Number);
        if (!ids.length) return { status: "FIND_NO_MATCH" };

        const id = ids[0];
        const src = String(results[id]);
        const testResult = testMatchOnSource(src, id, matchStr, replaceStr, flags);

        if (typeof testResult === "object" && testResult.status === "VALID") {
            const matchAt = testResult.at as number;
            const neighborhood = src.slice(Math.max(0, matchAt - 300), Math.min(src.length, matchAt + 300));
            const nearbyI18n = extractI18nKeys(neighborhood);
            if (nearbyI18n.length) (testResult as Record<string, unknown>).nearbyI18n = nearbyI18n;
        }

        if (ids.length === 1) return testResult;

        const sameSource = ids.every(mid => String(results[mid]) === src);
        return {
            ...testResult,
            findCount: ids.length,
            ids: ids.slice(0, PATCH.NOT_UNIQUE_IDS_LIMIT),
            sharedFactory: sameSource,
            hint: sameSource ? `Shared factory (${ids.length} IDs, same source) — use all:true in patch` : `${ids.length} different modules match find — make find more specific`,
        };
    }

    if (action === "conflicts") {
        const registry = getRuntimeFactoryRegistry();
        if (!registry) return { error: "Factory registry not available" };
        const conflicts: Array<{ id: number; plugins: string[] }> = [];
        for (const [id, factory] of registry) {
            const patchedBy = (factory as PatchedModuleFactory)[SYM_PATCHED_BY];
            if (patchedBy && patchedBy.length > 1) conflicts.push({ id, plugins: patchedBy });
        }
        return { count: conflicts.length, conflicts };
    }

    if (action === "broken") {
        return {
            orphaned: patches.map(diagnoseOrphaned),
            stats: {
                applied: patchStats.applied,
                noEffect: patchStats.noEffect,
                errors: patchStats.errors,
                patched: patchStats.patchedModules.size,
            },
        };
    }

    if (action === "lint") {
        if (!matchStr) return "Provide match regex string to lint";
        const warnings = lintMatchRegex(matchStr, replaceStr);
        const errors = warnings.filter(w => w.severity === "error").length;
        const warns = warnings.filter(w => w.severity === "warn").length;
        return { warnings, summary: { errors, warns, info: warnings.length - errors - warns }, clean: !errors && !warns };
    }

    if (action === "context") {
        if (!findStr) return "Provide find string";
        const canonFind = canonicalizeMatch(findStr);
        const results = search(canonFind);
        const ids = Object.keys(results).map(Number);
        if (!ids.length) return { error: "No modules match this find string" };

        const id = ids[0];
        const src = String(results[id]);
        const findIdx = typeof canonFind === "string" ? src.indexOf(canonFind) : src.search(canonFind);
        if (findIdx < 0) return { error: "Find matched module but indexOf failed" };

        const windowSize = Math.min(args.window ?? PATCH.CONTEXT_DEFAULT_WINDOW, PATCH.CONTEXT_MAX_WINDOW);
        const half = Math.floor(windowSize / 2);
        const ctxStart = Math.max(0, findIdx - half);
        const ctxEnd = Math.min(src.length, findIdx + half);
        const ctx = src.slice(ctxStart, ctxEnd);

        const anchors = extractAnchors(ctx);

        const result: Record<string, unknown> = {
            id,
            at: findIdx,
            len: src.length,
            ctxStart,
            src: ctx,
            anchors,
        };
        if (ids.length > 1) {
            const sameSource = ids.every(mid => String(results[mid]) === src);
            result.findCount = ids.length;
            if (sameSource) result.sharedFactory = true;
        }
        return result;
    }

    return { error: `Unknown action: ${action}` };
}

function extractI18nKeys(ctx: string): Array<{ key: string; default: string }> {
    const keys: Array<{ key: string; default: string }> = [];
    const seen = new Set<string>();
    const re = /\w\("([a-z][a-z0-9]*(?:[-.][a-z0-9]+)+)","([^"]+)"\)/g;
    let m;
    while ((m = re.exec(ctx)) !== null) {
        if (!seen.has(m[1])) {
            seen.add(m[1]);
            keys.push({ key: m[1], default: m[2] });
        }
    }
    return keys;
}

interface Anchor {
    text: string;
    type: string;
    at: number;
    unique: boolean;
}

function extractAnchors(ctx: string): Anchor[] {
    const allSources = getAllFactorySources();
    const anchors: Anchor[] = [];
    const seen = new Set<string>();

    const collect = (text: string, type: string, at: number) => {
        if (text.length < 4 || seen.has(text)) return;
        seen.add(text);
        const globalCount = countInSources(allSources, text, 3);
        anchors.push({ text, type, at, unique: globalCount === 1 });
    };

    const i18nRe = /\w\("([a-z][a-z0-9]*(?:[-.][a-z0-9]+)+)","([^"]+)"\)/g;
    let m;
    while ((m = i18nRe.exec(ctx)) !== null) {
        collect(`"${m[1]}","${m[2]}"`, "i18n", m.index);
    }

    const nsRe = /useTranslation\)\("([a-z]+)"\)/g;
    while ((m = nsRe.exec(ctx)) !== null) {
        collect(`useTranslation)("${m[1]}")`, "i18n-ns", m.index);
    }

    const flagRe = /"((?:ENABLE|DISABLE|ALLOW|SHOW|HIDE|IS|HAS)_[A-Z][A-Z0-9_]+)"/g;
    while ((m = flagRe.exec(ctx)) !== null) {
        collect(`"${m[1]}"`, "flag", m.index);
    }

    const dnRe = /displayName="([^"]+)"/g;
    while ((m = dnRe.exec(ctx)) !== null) {
        collect(`displayName="${m[1]}"`, "displayName", m.index);
    }

    const exportRe = /\["([A-Z][\w]+)",\(\)=>/g;
    while ((m = exportRe.exec(ctx)) !== null) {
        collect(`"${m[1]}",()=>`, "export", m.index);
    }

    const strRe = /"([^"\\]{6,80})"/g;
    while ((m = strRe.exec(ctx)) !== null) {
        if (seen.has(`"${m[1]}"`)) continue;
        collect(m[1], "string", m.index);
    }

    const jsxRe = /jsx\)\(\w+\.(\w{3,}),/g;
    while ((m = jsxRe.exec(ctx)) !== null) {
        collect(m[1], "jsx", m.index);
    }

    const propRe = /\.([a-zA-Z_$][\w$]{4,})[=(]/g;
    while ((m = propRe.exec(ctx)) !== null) {
        collect(m[1], "prop", m.index);
    }

    const typeOrder = ["i18n", "i18n-ns", "flag", "displayName", "export", "string", "jsx", "prop"];
    anchors.sort((a, b) => {
        if (a.unique !== b.unique) return a.unique ? -1 : 1;
        return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
    });

    return anchors.slice(0, PATCH.CONTEXT_MAX_ANCHORS);
}

let factorySourcesCache: string[] | null = null;
let factorySourcesCacheGen = 0;

function getAllFactorySources(): string[] {
    const registry = getRuntimeFactoryRegistry();
    if (!registry) return [];
    if (factorySourcesCache && factorySourcesCacheGen === registry.size) return factorySourcesCache;
    factorySourcesCache = [];
    for (const [, factory] of registry) factorySourcesCache.push(String(factory));
    factorySourcesCacheGen = registry.size;
    return factorySourcesCache;
}

function countInSources(sources: string[], text: string, max: number): number {
    let count = 0;
    for (const src of sources) {
        if (src.includes(text)) {
            count++;
            if (count >= max) return count;
        }
    }
    return count;
}
