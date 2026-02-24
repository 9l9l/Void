/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { isPluginEnabled } from "@api/PluginManager";
import { definePluginSettings } from "@api/Settings";
import { Flex, Text } from "@components";
import { TestTubeIcon } from "@components/icons/TestTubeIcon";
import { UnplugIcon } from "@components/icons/UnplugIcon";
import { CustomCSSTab, loadSavedCSS, PluginsTab } from "@components/settings/tabs";
import { Tab as ExperimentsTab } from "@plugins/experiments";
import { Tab as IconsTab } from "@plugins/icons";
import { createElement, React } from "@turbopack/common/react";
import { findExportedComponentLazy } from "@turbopack/turbopack";
import { classes, classNameFactory, registerStyle } from "@utils/css";
import definePlugin, { OptionType } from "@utils/types";
import type { ComponentType, ReactNode } from "react";

import "./styles.css";

const cl = classNameFactory("void-settings-");

const settings = definePluginSettings({
    hideUserId: {
        type: OptionType.BOOLEAN,
        description: "Hide your user ID from the account settings page.",
        default: true,
    },
});

interface SettingsTab {
    id: string;
    name: string;
    icon: ComponentType;
    component: ComponentType;
    plugin?: string;
}

const allTabs: SettingsTab[] = [
    { id: "void_plugins_tab", name: "Plugins", icon: UnplugIcon, component: PluginsTab },
    { id: "void_experiments_tab", name: "Experiments", icon: TestTubeIcon, component: ExperimentsTab, plugin: "Experiments" },
    { id: "void_icons_tab", name: "Icons", icon: findExportedComponentLazy("SearchIcon"), component: IconsTab, plugin: "Icons" },
    { id: "void_css_tab", name: "Quick CSS", icon: findExportedComponentLazy("CodeIcon"), component: CustomCSSTab },
];

function getVisibleTabs() {
    return allTabs.filter(t => !t.plugin || isPluginEnabled(t.plugin));
}

const REPO_URL = "https://github.com/imjustprism/Void";

function Dot() {
    return (
        <Text as="span" color="secondary">
            {"\u2022"}
        </Text>
    );
}

function VersionLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <a href={href} target="_blank" rel="noreferrer" className={cl("version-link")}>
            <Text as="span" color="secondary">
                {children}
            </Text>
        </a>
    );
}

function VersionInfo() {
    return (
        <Flex flexDirection="column" gap="0" className={classes(cl("version"), "absolute bottom-0 left-0 right-0 p-3 opacity-30 text-secondary")}>
            <Flex alignItems="center" gap="0.25rem">
                <VersionLink href={REPO_URL}>Void</VersionLink>
                <Dot />
                <Text as="span" color="secondary">{`v${VERSION}`}</Text>
                <Dot />
                <VersionLink href={`${REPO_URL}/commit/${GIT_HASH}`}>{`(${GIT_HASH})`}</VersionLink>
            </Flex>
            <Flex alignItems="center" gap="0.25rem">
                <Text as="span" color="secondary">
                    {IS_DEV ? "Development" : "Production"}
                </Text>
                <Dot />
                <Text as="span" color="secondary">
                    {IS_EXTENSION ? "Extension" : "Userscript"}
                </Text>
            </Flex>
        </Flex>
    );
}

interface TabButtonProps {
    icon: ComponentType;
    text: string;
    tab: string;
}

interface WrapperProps {
    children: ReactNode;
}

export default definePlugin({
    name: "Settings",
    description: "Adds Void settings UI.",
    authors: ["Prism"],
    required: true,
    settings,

    _hideUserId() {
        return settings.store.hideUserId;
    },

    renderTabs(jsx: typeof createElement, TabButton: ComponentType<TabButtonProps>) {
        return [...getVisibleTabs().map(t => jsx(TabButton, { key: t.id, icon: t.icon, text: t.name, tab: t.id })), <VersionInfo key="void-version" />];
    },

    renderPanels(jsx: typeof createElement, activeTab: string, Wrapper: ComponentType<WrapperProps>) {
        const tab = getVisibleTabs().find(t => t.id === activeTab);
        if (!tab) return [];
        return [jsx(Wrapper, { key: tab.id, children: jsx(tab.component, {}) })];
    },

    start() {
        registerStyle("void-global", "[data-sonner-toast] [data-title]{font-weight:400}");
        if (document.head) loadSavedCSS();
        else document.addEventListener("DOMContentLoaded", loadSavedCSS, { once: true });
    },

    patches: [
        {
            find: "pressed_cmd_settings",
            replacement: [
                {
                    match: /(\i\.jsx)\)\((\i),\{icon:\i\.DatabaseIcon,.{0,80}tab:"data"\}\)/,
                    replace: "$&,...$self.renderTabs($1,$2)",
                },
                {
                    match: /"data"===(\i)&&\i\.user&&\(0,(\i\.jsx)\)\((\i),\{children:/,
                    replace: "...$self.renderPanels($2,$1,$3),$&",
                },
                {
                    match: /\i\.user&&\(0,\i\.jsx\)\("div",.{0,120}:\i\.userId\}\)/,
                    replace: "!$self._hideUserId()&&$&",
                },
            ],
        },
    ],
});
