/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { ComponentType } from "react";

type AnyComponent = ComponentType & Record<string, unknown>;

let _createElement: Function | null = null;

export function setCreateElement(fn: Function) {
    _createElement = fn;
}

export function LazyComponent<T extends AnyComponent = AnyComponent>(name: string, factory: () => T | null): T {
    let cached: T | null = null;

    const wrapper = ((props: Record<string, unknown>) => {
        cached ??= factory();
        if (!cached) return null;
        return _createElement!(cached, props);
    }) as unknown as T;

    Object.defineProperty(wrapper, "name", { value: name });

    return new Proxy(wrapper, {
        get(target, prop) {
            if (prop === "$$voidGetWrapped") return () => cached ?? factory();
            if (prop === "displayName") {
                cached ??= factory();
                if (cached) return (cached as Record<string, unknown>)[prop];
            }
            return Reflect.get(target, prop);
        },
    }) as T;
}
