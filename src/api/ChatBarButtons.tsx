/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ChatBarButton } from "@components/ChatBarButton";
import { ErrorBoundary } from "@components/ErrorBoundary";
import { React } from "@turbopack/common/react";
import { createExternalStore } from "@utils/misc";
import { type LazyNode, resolveLazyNode, useExternalStore } from "@utils/react";
import type { ComponentType, ReactNode } from "react";

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

const buttons = new Map<string, ChatBarButtonDef>();
const store = createExternalStore();

export function addChatBarButton(id: string, def: ChatBarButtonDef): void {
    buttons.set(id, def);
    store.notify();
}

export function removeChatBarButton(id: string): void {
    buttons.delete(id);
    store.notify();
}

function renderEntry(def: ChatBarButtonDef, iconOnly: boolean): ReactNode {
    if (def.render) {
        const Render = def.render;
        return <Render iconOnly={iconOnly} />;
    }
    return <ChatBarButton icon={resolveLazyNode(def.icon)} tooltip={resolveLazyNode(def.tooltip)} onClick={def.onClick} iconOnly={iconOnly} />;
}

export function VoidChatBarButtons({ iconOnly }: { iconOnly: boolean }): ReactNode {
    useExternalStore(store);

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
