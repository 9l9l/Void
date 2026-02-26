/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./ThemeCard.css";

import { disableTheme, enableTheme, type ThemeData } from "@api/Themes";
import { Button, Flex, Switch } from "@components";
import { React } from "@turbopack/common/react";
import { findExportedComponentLazy } from "@turbopack/turbopack";
import { classNameFactory } from "@utils/css";
import { useForceUpdater } from "@utils/react";

const Trash2 = findExportedComponentLazy("Trash2");

const cl = classNameFactory("void-theme-card-");

interface ThemeCardProps {
    theme: ThemeData;
    globalEnabled: boolean;
    onRemove(url: string): void;
}

export default function ThemeCard({ theme, globalEnabled, onRemove }: ThemeCardProps) {
    const forceUpdate = useForceUpdater();

    const handleToggle = () => {
        if (theme.enabled) disableTheme(theme.url);
        else enableTheme(theme.url);
        forceUpdate();
    };

    return (
        <div className={cl("root")}>
            <div className={cl("body")}>
                <Flex alignItems="center" justifyContent="space-between" gap="0.5rem">
                    <span className={cl("name")}>{theme.name || theme.url}</span>
                    <Flex alignItems="center" gap="0.375rem" className={cl("controls")}>
                        <Button variant="ghostSecondary" size="iconXs" onClick={() => onRemove(theme.url)}>
                            <Trash2 size={16} />
                        </Button>
                        <Switch checked={theme.enabled} disabled={!globalEnabled} onCheckedChange={handleToggle} />
                    </Flex>
                </Flex>
                {theme.description && <div className={cl("desc")}>{theme.description}</div>}
            </div>
            <div className={cl("separator")} />
            <div className={cl("footer")}>
                <div className={cl("author")}>{theme.author || "\u00A0"}</div>
            </div>
        </div>
    );
}
