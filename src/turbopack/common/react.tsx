/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { LazyComponent, setCreateElement } from "@utils/lazyReact";
import type ReactTypes from "react";
import type { ComponentType, ReactNode } from "react";

import { filters, findExportedComponent, waitFor } from "../turbopack";
import type { FilterFn } from "../types";

export { LazyComponent };

type AnyComponent = ComponentType & Record<string, unknown>;

type ReactInstance = typeof ReactTypes;

export let React: ReactInstance;
export let useState: ReactInstance["useState"];
export let useEffect: ReactInstance["useEffect"];
export let useLayoutEffect: ReactInstance["useLayoutEffect"];
export let useMemo: ReactInstance["useMemo"];
export let useRef: ReactInstance["useRef"];
export let useReducer: ReactInstance["useReducer"];
export let useCallback: ReactInstance["useCallback"];
export let useContext: ReactInstance["useContext"];
export let createElement: ReactInstance["createElement"];

waitFor(filters.byProps("useState", "createElement"), mod => {
    const m = mod as ReactInstance;
    React = m;
    ({ useState, useEffect, useLayoutEffect, useMemo, useRef, useReducer, useCallback, useContext, createElement } = m);
    setCreateElement(m.createElement);
});

export const Fragment = Symbol.for("react.fragment") as unknown as ReactInstance["Fragment"];

export function waitForComponent<T extends AnyComponent = AnyComponent>(name: string, filter: FilterFn): T {
    let resolved: T | null = null;

    waitFor(filter, mod => {
        resolved = mod as T;
    });

    return LazyComponent<T>(name, () => resolved ?? (findExportedComponent(name) as T | null));
}

export function waitForComponentByName<T extends AnyComponent = AnyComponent>(name: string): T {
    return waitForComponent<T>(name, filters.byDisplayName(name));
}

export type { ComponentType, ReactNode };
