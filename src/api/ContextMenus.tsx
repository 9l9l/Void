/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { DropdownMenuItem } from "@components";
import { ErrorBoundary } from "@components/ErrorBoundary";
import { React } from "@turbopack/common/react";
import type { ComponentType, ReactNode } from "react";

export interface ContextMenuLocationMap {
    conversation: { conversationId: string };
    message: { response: { responseId: string; conversationId: string; [key: string]: unknown } };
    user: {};
}

export type ContextMenuLocation = keyof ContextMenuLocationMap;

type LazyNode = ReactNode | (() => ReactNode);

export interface ContextMenuItemDef<L extends ContextMenuLocation = ContextMenuLocation> {
    label: LazyNode;
    icon?: LazyNode;
    order?: number;
    render?: ComponentType<ContextMenuLocationMap[L]>;
    onSelect?: (ctx: ContextMenuLocationMap[L]) => void;
}

function resolve(node: LazyNode | undefined): ReactNode {
    return typeof node === "function" ? node() : node;
}

const items = new Map<ContextMenuLocation, Map<string, ContextMenuItemDef<any>>>();
const listeners = new Set<() => void>();
let version = 0;

function notify() {
    version++;
    for (const fn of listeners) fn();
}

function subscribe(callback: () => void) {
    listeners.add(callback);
    return () => {
        listeners.delete(callback);
    };
}

function getSnapshot() {
    return version;
}

function getItems(location: ContextMenuLocation): Map<string, ContextMenuItemDef<any>> {
    let map = items.get(location);
    if (!map) {
        map = new Map();
        items.set(location, map);
    }
    return map;
}

export function addContextMenuItem<L extends ContextMenuLocation>(location: L, id: string, def: ContextMenuItemDef<L>): void {
    getItems(location).set(id, def);
    notify();
}

export function removeContextMenuItem(location: ContextMenuLocation, id: string): void {
    getItems(location).delete(id);
    notify();
}

function renderEntry(def: ContextMenuItemDef<any>, ctx: Record<string, any>): ReactNode {
    if (def.render) {
        const Render = def.render;
        return <Render {...ctx} />;
    }
    return (
        <DropdownMenuItem onSelect={() => def.onSelect?.(ctx)}>
            {resolve(def.icon)}
            {resolve(def.label)}
        </DropdownMenuItem>
    );
}

export function VoidContextMenuItems<L extends ContextMenuLocation>({ location, ...ctx }: { location: L } & ContextMenuLocationMap[L]): ReactNode {
    React.useSyncExternalStore(subscribe, getSnapshot);

    const map = items.get(location);
    if (!map?.size) return null;

    const sorted = [...map.entries()].sort(([, a], [, b]) => (a.order ?? 0) - (b.order ?? 0));

    return (
        <>
            {sorted.map(([id, def]) => (
                <ErrorBoundary key={id} fallback={null}>
                    {renderEntry(def, ctx)}
                </ErrorBoundary>
            ))}
        </>
    );
}
