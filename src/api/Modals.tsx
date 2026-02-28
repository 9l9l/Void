/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@components";
import { React } from "@turbopack/common/react";
import { createExternalStore } from "@utils/misc";
import { useExternalStore } from "@utils/react";
import type { ReactNode } from "react";

export interface ModalProps {
    onClose(): void;
}

export interface ModalOptions {
    modalKey?: string;
}

export interface ConfirmOptions {
    title: string;
    body: string | ReactNode;
    confirmText?: string;
    cancelText?: string;
    danger?: boolean;
}

interface ModalEntry {
    key: string;
    render: (props: ModalProps) => ReactNode;
}

let nextId = 0;
const modalStack: ModalEntry[] = [];
const store = createExternalStore();

export function openModal(render: (props: ModalProps) => ReactNode, options?: ModalOptions): string {
    const key = options?.modalKey ?? `void-modal-${nextId++}`;
    modalStack.push({ key, render });
    store.notify();
    return key;
}

export function closeModal(key: string) {
    const idx = modalStack.findIndex(m => m.key === key);
    if (idx !== -1) {
        modalStack.splice(idx, 1);
        store.notify();
    }
}

export function closeAllModals() {
    modalStack.length = 0;
    store.notify();
}

export function confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise(resolve => {
        const key = openModal(({ onClose }) => {
            const close = (value: boolean) => {
                resolve(value);
                onClose();
            };

            return (
                <DialogHeader>
                    <DialogTitle>{options.title}</DialogTitle>
                    <DialogDescription>{options.body}</DialogDescription>
                    <DialogFooter>
                        <Button variant="secondary" size="md" onClick={() => close(false)}>
                            {options.cancelText ?? "Cancel"}
                        </Button>
                        <Button variant={options.danger ? "danger" : "primary"} size="md" onClick={() => close(true)}>
                            {options.confirmText ?? "Confirm"}
                        </Button>
                    </DialogFooter>
                </DialogHeader>
            );
        });

        const unsub = store.subscribe(() => {
            if (!modalStack.some(m => m.key === key)) {
                unsub();
                resolve(false);
            }
        });
    });
}

function ModalInstance({ entry }: { entry: ModalEntry }) {
    const onClose = React.useCallback(() => closeModal(entry.key), [entry.key]);

    return (
        <Dialog
            open
            onOpenChange={open => {
                if (!open) onClose();
            }}
        >
            <DialogContent aria-describedby={undefined}>{entry.render({ onClose })}</DialogContent>
        </Dialog>
    );
}

export function ModalContainer(): ReactNode {
    useExternalStore(store);

    if (!modalStack.length) return null;

    return (
        <>
            {modalStack.map(entry => (
                <ModalInstance key={entry.key} entry={entry} />
            ))}
        </>
    );
}
