/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ChatBarButton } from "@components/ChatBarButton";
import { ErrorBoundary } from "@components/ErrorBoundary";
import { React } from "@turbopack/common/react";
import type { ComponentType, ReactNode } from "react";

type LazyNode = ReactNode | (() => ReactNode);

export interface ChatBarButtonRenderProps {
    iconOnly: boolean;
}

export interface ChatBarButtonDef {
    icon?: LazyNode;
    tooltip?: LazyNode;
    order?: number;
    render?: ComponentType<ChatBarButtonRenderProps>;
    onClick?: () => void;
}

function resolve(node: LazyNode | undefined): ReactNode {
    return typeof node === "function" ? node() : node;
}

const buttons = new Map<string, ChatBarButtonDef>();
const listeners = new Set<() => void>();
let version = 0;

function notify() {
    version++;
    for (const fn of listeners) fn();
}

function subscribeButtons(callback: () => void) {
    listeners.add(callback);
    return () => {
        listeners.delete(callback);
    };
}

function getButtonsSnapshot() {
    return version;
}

export function addChatBarButton(id: string, def: ChatBarButtonDef): void {
    buttons.set(id, def);
    notify();
}

export function removeChatBarButton(id: string): void {
    buttons.delete(id);
    notify();
}

function renderEntry(def: ChatBarButtonDef, iconOnly: boolean): ReactNode {
    if (def.render) {
        const Render = def.render;
        return <Render iconOnly={iconOnly} />;
    }
    return <ChatBarButton icon={resolve(def.icon)} tooltip={resolve(def.tooltip)} onClick={def.onClick} iconOnly={iconOnly} />;
}

export function VoidChatBarButtons({ iconOnly }: { iconOnly: boolean }): ReactNode {
    React.useSyncExternalStore(subscribeButtons, getButtonsSnapshot);

    if (!buttons.size) return null;

    const sorted = [...buttons.entries()].sort(([, a], [, b]) => (a.order ?? 0) - (b.order ?? 0));

    return (
        <>
            {sorted.map(([id, def]) => (
                <ErrorBoundary key={id}>{renderEntry(def, iconOnly)}</ErrorBoundary>
            ))}
        </>
    );
}
