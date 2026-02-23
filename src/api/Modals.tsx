/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@components";
import { React } from "@turbopack/common/react";
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
let version = 0;
const modalStack: ModalEntry[] = [];
const listeners = new Set<() => void>();

function notify() {
    version++;
    for (const fn of listeners) fn();
}

function subscribeModals(callback: () => void) {
    listeners.add(callback);
    return () => {
        listeners.delete(callback);
    };
}

function getModalsSnapshot() {
    return version;
}

export function openModal(render: (props: ModalProps) => ReactNode, options?: ModalOptions): string {
    const key = options?.modalKey ?? `void-modal-${nextId++}`;
    modalStack.push({ key, render });
    notify();
    return key;
}

export function closeModal(key: string) {
    const idx = modalStack.findIndex(m => m.key === key);
    if (idx !== -1) {
        modalStack.splice(idx, 1);
        notify();
    }
}

export function closeAllModals() {
    modalStack.length = 0;
    notify();
}

export function confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise(resolve => {
        let resolved = false;
        const settle = (value: boolean) => {
            if (resolved) return;
            resolved = true;
            resolve(value);
        };

        openModal(({ onClose }) => (
            <DialogHeader>
                <DialogTitle>{options.title}</DialogTitle>
                <DialogDescription>{options.body}</DialogDescription>
                <DialogFooter>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            settle(false);
                            onClose();
                        }}
                    >
                        {options.cancelText ?? "Cancel"}
                    </Button>
                    <Button
                        variant={options.danger ? "filled" : "primary"}
                        btnColor={options.danger ? "danger" : undefined}
                        onClick={() => {
                            settle(true);
                            onClose();
                        }}
                    >
                        {options.confirmText ?? "Confirm"}
                    </Button>
                </DialogFooter>
            </DialogHeader>
        ));
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
            <DialogContent>{entry.render({ onClose })}</DialogContent>
        </Dialog>
    );
}

export function ModalContainer(): ReactNode {
    React.useSyncExternalStore(subscribeModals, getModalsSnapshot);

    if (!modalStack.length) return null;

    return (
        <>
            {modalStack.map(entry => (
                <ModalInstance key={entry.key} entry={entry} />
            ))}
        </>
    );
}
