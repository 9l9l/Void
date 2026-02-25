/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./styles.css";

import { isPluginEnabled } from "@api/PluginManager";
import { definePluginSettings } from "@api/Settings";
import { Flex, Text } from "@components";
import { CustomCSSTab, loadSavedCSS, PluginsTab } from "@components/settings/tabs";
import { Tab as ExperimentsTab } from "@plugins/experiments";
import { Tab as IconsTab } from "@plugins/iconViewer";
import { createElement, Fragment, React } from "@turbopack/common/react";
import { classes, classNameFactory, registerStyle } from "@utils/css";
import { useEventSubscription, useForceUpdater } from "@utils/react";
import definePlugin, { OptionType } from "@utils/types";
import type { ComponentType, ReactNode } from "react";

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

const UnplugIcon = ({ size = 18, className }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m19 5 3-3" /><path d="m2 22 3-3" />
        <path d="M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z" />
        <path d="M7.5 13.5 10 11" /><path d="M10.5 16.5 13 14" />
        <path d="m12 6 6 6 2.3-2.3a2.4 2.4 0 0 0 0-3.4l-2.6-2.6a2.4 2.4 0 0 0-3.4 0Z" />
    </svg>
);

const TestTubeIcon = ({ size = 18, className }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 7 6.82 21.18a2.83 2.83 0 0 1-3.99-.01a2.83 2.83 0 0 1 0-4L17 3" />
        <path d="m16 2 6 6" /><path d="M12 16H4" />
    </svg>
);

const SearchIcon = ({ size = 18, className }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" />
    </svg>
);

const BracesIcon = ({ size = 18, className }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1" />
        <path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1" />
    </svg>
);

const allTabs: SettingsTab[] = [
    { id: "void_plugins_tab", name: "Plugins", icon: UnplugIcon, component: PluginsTab },
    { id: "void_experiments_tab", name: "Experiments", icon: TestTubeIcon, component: ExperimentsTab, plugin: "Experiments" },
    { id: "void_icons_tab", name: "Icons", icon: SearchIcon, component: IconsTab, plugin: "IconViewer" },
    { id: "void_css_tab", name: "Quick CSS", icon: BracesIcon, component: CustomCSSTab },
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
        <a href={href} target="_blank" rel="noreferrer" className={classes(cl("version-link"), "pointer-events-auto")}>
            <Text as="span" color="secondary">
                {children}
            </Text>
        </a>
    );
}

function VersionInfo() {
    return (
        <Flex flexDirection="column" gap="0" className={classes(cl("version"), "absolute bottom-0 left-0 right-0 p-3 opacity-30 text-secondary pointer-events-none")}>
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

function VoidTabs({ jsx, TabButton }: { jsx: typeof createElement; TabButton: ComponentType<TabButtonProps> }) {
    const forceUpdate = useForceUpdater();
    useEventSubscription("pluginToggle", forceUpdate);

    return (
        <Fragment>
            {getVisibleTabs().map(t => jsx(TabButton, { key: t.id, icon: t.icon, text: t.name, tab: t.id }))}
        </Fragment>
    );
}

function VoidPanels({ jsx, activeTab, Wrapper }: { jsx: typeof createElement; activeTab: string; Wrapper: ComponentType<WrapperProps> }) {
    const forceUpdate = useForceUpdater();
    useEventSubscription("pluginToggle", forceUpdate);

    const tab = getVisibleTabs().find(t => t.id === activeTab);
    if (!tab) return null;
    return jsx(Wrapper, { key: tab.id, children: jsx(tab.component, {}) });
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
        return [<VoidTabs key="void-tabs" jsx={jsx} TabButton={TabButton} />, <VersionInfo key="void-version" />];
    },

    renderPanels(jsx: typeof createElement, activeTab: string, Wrapper: ComponentType<WrapperProps>) {
        return [<VoidPanels key="void-panels" jsx={jsx} activeTab={activeTab} Wrapper={Wrapper} />];
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
