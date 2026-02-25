/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { getModuleCache } from "@turbopack/patchTurbopack";

import { INTERCEPT } from "./constants";
import type { InterceptArgs, InterceptState } from "./types";
import { clamp, errorMessage, serialize } from "./utils";

let nextId = 1;
const active = new Map<number, InterceptState>();

function restoreIntercept(state: InterceptState) {
    try {
        state.holder[state.finalKey] = state.original;
    } catch {}
    clearTimeout(state.timer);
    active.delete(state.id);
}

export function handleIntercept(args: InterceptArgs): unknown {
    const { action } = args;

    if (action === "set") {
        const { moduleId, exportKey = "default" } = args;
        if (moduleId == null) return "Provide moduleId";

        const exports = getModuleCache().get(Number(moduleId));
        if (!exports || typeof exports !== "object") return { error: `Module ${moduleId} not found or not an object` };

        const parts = exportKey.split(".");
        let holder = exports as Record<string, unknown>;
        for (let i = 0; i < parts.length - 1; i++) {
            const next = holder[parts[i]];
            if (next == null || typeof next !== "object") return { error: `Path ${parts.slice(0, i + 1).join(".")} not found` };
            holder = next as Record<string, unknown>;
        }

        const finalKey = parts[parts.length - 1];
        const original = holder[finalKey];
        if (typeof original !== "function") return { error: `${exportKey} is not a function (${typeof original})` };

        const duration = clamp(args.duration ?? INTERCEPT.DEFAULT_DURATION, INTERCEPT.MIN_DURATION, INTERCEPT.MAX_DURATION);
        const maxCaptures = Math.min(args.maxCaptures ?? INTERCEPT.DEFAULT_CAPTURES, INTERCEPT.MAX_CAPTURES);
        const id = nextId++;

        const state: InterceptState = {
            id,
            moduleId: Number(moduleId),
            exportKey,
            finalKey,
            captures: [],
            startTime: Date.now(),
            original,
            holder,
            timer: setTimeout(() => restoreIntercept(state), duration),
        };

        holder[finalKey] = function (this: unknown, ...callArgs: unknown[]) {
            const elapsed = Date.now() - state.startTime;
            try {
                const ret = original.apply(this, callArgs);
                if (state.captures.length < maxCaptures) {
                    state.captures.push({ t: elapsed, args: serialize(callArgs, 2), ret: serialize(ret, 2) });
                }
                return ret;
            } catch (err: unknown) {
                if (state.captures.length < maxCaptures) {
                    state.captures.push({ t: elapsed, args: serialize(callArgs, 2), ret: null, err: errorMessage(err) });
                }
                throw err;
            }
        };
        Object.defineProperties(holder[finalKey], {
            length: { value: original.length, configurable: true },
            name: { value: original.name, configurable: true },
            toString: { value: () => String(original), configurable: true },
        });

        active.set(id, state);
        return { id, moduleId: state.moduleId, exportKey, duration, maxCaptures, fnName: original.name ?? null };
    }

    if (action === "get") {
        const { id } = args;
        if (id == null) return "Provide intercept id";
        const state = active.get(id);
        if (!state) return { error: `Intercept ${id} not found (expired or stopped)` };
        return {
            id: state.id,
            moduleId: state.moduleId,
            exportKey: state.exportKey,
            elapsed: Date.now() - state.startTime,
            captures: state.captures,
        };
    }

    if (action === "stop") {
        const { id } = args;
        if (id == null) return "Provide intercept id";
        const state = active.get(id);
        if (!state) return { error: `Intercept ${id} not found` };
        const captureCount = state.captures.length;
        restoreIntercept(state);
        return { id, captures: captureCount, restored: true };
    }

    if (action === "list") {
        return [...active.values()].map(s => ({
            id: s.id,
            moduleId: s.moduleId,
            exportKey: s.exportKey,
            captures: s.captures.length,
            elapsed: Date.now() - s.startTime,
        }));
    }

    return { error: `Unknown action: ${action}` };
}
