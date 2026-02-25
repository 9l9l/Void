/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { dispatch } from "@api/Events";
import { isPluginEnabled, plugins, startPlugin, stopPlugin } from "@api/PluginManager";
import { Settings } from "@api/Settings";
import { Button, Switch, Tooltip, TooltipContent, TooltipTrigger } from "@components";
import { React } from "@turbopack/common/react";
import { findExportedComponentLazy } from "@turbopack/turbopack";
import { classes, classNameFactory } from "@utils/css";
import { useForceUpdater } from "@utils/react";

import { hasVisibleSettings } from "./utils";

const EllipsisVertical = findExportedComponentLazy("EllipsisVertical");
const GhostFilledIcon = findExportedComponentLazy("GhostFilledIcon");
const TriangleAlert = findExportedComponentLazy("TriangleAlert");

import "./PluginCard.css";

const cl = classNameFactory("void-plugin-card-");

interface PluginCardProps {
    name: string;
    onSettings(name: string): void;
    onReload(pluginName: string): void;
}

export default function PluginCard({ name, onSettings, onReload }: PluginCardProps) {
    const plugin = plugins[name];
    const forceUpdate = useForceUpdater();
    const enabled = isPluginEnabled(name);
    const crashed = enabled && !plugin.started && !plugin.required;
    const hasPatches = !!plugin.patches?.length;

    const handleToggle = () => {
        Settings.plugins[name] = { ...Settings.plugins[name], enabled: !enabled };
        if (!enabled) startPlugin(plugin);
        else stopPlugin(plugin);
        forceUpdate();
        dispatch("pluginToggle");
        if (hasPatches) onReload(name);
    };

    return (
        <div className={classes(cl("root"), plugin.required && cl("required"), crashed && cl("crashed"))}>
            <div className={cl("body")}>
                <span className={cl("name")}>
                    {name}
                    {crashed && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className={cl("crashed-icon")}>
                                    <TriangleAlert />
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>This plugin failed to start</TooltipContent>
                        </Tooltip>
                    )}
                    {plugin.required && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className={cl("required-icon")}>
                                    <TriangleAlert />
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>This plugin is required for Void to work</TooltipContent>
                        </Tooltip>
                    )}
                    {plugin.dev && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className={cl("dev-icon")}>
                                    <GhostFilledIcon />
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>Dev Only</TooltipContent>
                        </Tooltip>
                    )}
                </span>
                {plugin.description && <div className={cl("desc")}>{plugin.description}</div>}
                <div className={cl("controls")}>
                    {hasVisibleSettings(plugin) && (
                        <Button variant="ghostSecondary" size="iconXs" onClick={() => onSettings(name)}>
                            <EllipsisVertical size={16} />
                        </Button>
                    )}
                    <Switch checked={enabled} disabled={plugin.required} onCheckedChange={handleToggle} />
                </div>
            </div>
            <div className={cl("separator")} />
            <div className={cl("footer")}>
                <div className={cl("authors")}>{plugin.authors?.length ? plugin.authors.join(", ") : "\u00A0"}</div>
            </div>
        </div>
    );
}
