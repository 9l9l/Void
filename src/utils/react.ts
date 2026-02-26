/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { subscribe } from "@api/Events";
import { useEffect, useMemo, useReducer, useState } from "@turbopack/common/react";
import { onModuleLoad } from "@turbopack/patchTurbopack";
import { debounce } from "@utils/misc";

export const NoopComponent = () => null;

export function useForceUpdater() {
    return useReducer((x: number) => x + 1, 0)[1];
}

/**
 * Force a re-render whenever the Turbopack module cache grows.
 * Debounced to avoid excessive re-renders during chunk loading.
 * @param ms Debounce interval in milliseconds (default 500)
 */
export function useModuleLoadEffect(ms = 500) {
    const update = useForceUpdater();

    useEffect(() => {
        const invalidate = debounce(update, ms);
        const unsub = onModuleLoad(invalidate);
        return () => {
            unsub();
            invalidate.cancel();
        };
    }, [update, ms]);
}

export function useEventSubscription(event: string, handler: () => void) {
    useEffect(() => subscribe(event, handler), [event, handler]);
}

export function useFiltered<T>(list: T[], search: string, getKey: (item: T) => string): T[] {
    return useMemo(() => {
        const q = search.toLowerCase().trim();
        if (!q) return list;
        return list.filter(item => getKey(item).toLowerCase().includes(q));
    }, [list, search, getKey]);
}

interface AwaiterOpts<T> {
    fallbackValue: T;
    deps?: unknown[];
    onError?(e: unknown): void;
    onSuccess?(value: T): void;
}

type AwaiterRes<T> = [value: T, error: unknown, isPending: boolean];

/**
 * Await a promise in a React component.
 * @param factory Async function that returns the value
 * @param opts Options with fallbackValue, deps, onError, onSuccess
 * @returns [value, error, isPending]
 */
export function useAwaiter<T>(factory: () => Promise<T>): AwaiterRes<T | null>;
export function useAwaiter<T>(factory: () => Promise<T>, opts: AwaiterOpts<T>): AwaiterRes<T>;
export function useAwaiter<T>(factory: () => Promise<T>, opts?: AwaiterOpts<T | null>): AwaiterRes<T | null> {
    const resolved: Required<AwaiterOpts<T | null>> = {
        fallbackValue: null,
        deps: [],
        onError: undefined!,
        onSuccess: undefined!,
        ...opts,
    };

    const [state, setState] = useState({
        value: resolved.fallbackValue,
        error: null as unknown,
        pending: true,
    });

    useEffect(() => {
        let alive = true;
        if (!state.pending) setState({ ...state, pending: true });

        factory()
            .then(value => {
                if (!alive) return;
                setState({ value, error: null, pending: false });
                resolved.onSuccess?.(value);
            })
            .catch(error => {
                if (!alive) return;
                setState({ value: null, error, pending: false });
                resolved.onError?.(error);
            });

        return () => {
            alive = false;
        };
    }, resolved.deps);

    return [state.value, state.error, state.pending];
}
