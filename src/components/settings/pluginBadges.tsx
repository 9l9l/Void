/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Tooltip, TooltipContent, TooltipTrigger } from "@components";
import { ChromiumIcon, TelescopeIcon } from "@components/icons";
import { React } from "@turbopack/common/react";
import { findExportedComponentLazy } from "@turbopack/turbopack";
import type { Plugin } from "@utils/types";

const GhostFilledIcon = findExportedComponentLazy("GhostFilledIcon");

interface BadgeDef {
    key: keyof Plugin;
    icon: React.ComponentType;
    tooltip: string;
}

const badges: BadgeDef[] = [
    { key: "dev", icon: GhostFilledIcon, tooltip: "Dev Only" },
    { key: "chrome", icon: ChromiumIcon, tooltip: "Chromium Only" },
    { key: "preview", icon: TelescopeIcon, tooltip: "This is a preview plugin and may be removed once Grok adds this feature natively." },
];

export function PluginBadges({ plugin, className }: { plugin: Plugin; className?: string }) {
    return badges.map(b =>
        plugin[b.key] ? (
            <Tooltip key={b.key}>
                <TooltipTrigger asChild>
                    <span className={className}>
                        <b.icon />
                    </span>
                </TooltipTrigger>
                <TooltipContent>{b.tooltip}</TooltipContent>
            </Tooltip>
        ) : null,
    );
}
