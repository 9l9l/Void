/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Button, Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, Flex, Separator, Text } from "@components";
import { React } from "@turbopack/common/react";
import { findExportedComponentLazy } from "@turbopack/turbopack";
import { classNameFactory } from "@utils/css";
import type { Plugin } from "@utils/types";

import SettingField from "../SettingField";
import { isVisibleSetting } from "../utils";

import "./PluginDialog.css";

const cl = classNameFactory("void-plugin-dialog-");
const Cross2Icon = findExportedComponentLazy("Cross2Icon");

interface PluginDialogProps {
    plugin: Plugin;
    open: boolean;
    onClose(): void;
}

export default function PluginDialog({ plugin, open, onClose }: PluginDialogProps) {
    const entries = Object.entries(plugin.settings?.def ?? {}).filter(isVisibleSetting);

    return (
        <Dialog
            open={open}
            onOpenChange={(v: boolean) => {
                if (!v) onClose();
            }}
        >
            <DialogContent className={cl("content")}>
                <DialogClose asChild>
                    <Button variant="ghostSecondary" size="iconSm" className={cl("close")}>
                        <Cross2Icon />
                    </Button>
                </DialogClose>
                <DialogHeader className={cl("header")}>
                    <DialogTitle>{plugin.name}</DialogTitle>
                    {plugin.description && (
                        <Text size="xs" color="secondary">
                            {plugin.description}
                        </Text>
                    )}
                </DialogHeader>
                <Separator />
                {plugin.authors?.length > 0 && (
                    <Flex flexDirection="column" gap="0.25rem">
                        <Text size="sm" weight="medium">
                            Authors
                        </Text>
                        <Text size="xs" color="secondary">
                            {plugin.authors.join(", ")}
                        </Text>
                    </Flex>
                )}
                <Flex flexDirection="column" gap="0.25rem">
                    <Text size="sm" weight="medium">
                        Settings
                    </Text>
                    {entries.length ? (
                        <Flex flexDirection="column" gap="0.75rem" style={{ marginTop: "0.5rem" }}>
                            {entries.map(([key, setting]) => (
                                <SettingField key={key} id={key} setting={setting} pluginName={plugin.name} />
                            ))}
                        </Flex>
                    ) : (
                        <Text size="xs" color="secondary">
                            No configurable settings.
                        </Text>
                    )}
                </Flex>
            </DialogContent>
        </Dialog>
    );
}
