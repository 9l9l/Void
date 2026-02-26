/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./PluginsTab.css";

import { isPluginEnabled, plugins } from "@api/PluginManager";
import {
    Button,
    ConfirmDialog,
    Flex,
    Grid,
    Input,
    Paragraph,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Separator,
    Text,
} from "@components";
import { React, useCallback, useEffect, useMemo, useRef, useState } from "@turbopack/common/react";
import { classes, classNameFactory } from "@utils/css";

import PluginCard from "../PluginCard";
import PluginDialog from "./PluginDialog";

const cl = classNameFactory("void-plugins-");

interface TabState {
    initialStates: Map<string, boolean>;
    changedPlugins: Set<string>;
    dismissed: boolean;
}

type Filter = "all" | "enabled" | "disabled";

function filterPlugins(list: string[], search: string, filter: Filter) {
    const q = search.toLowerCase();
    return list.filter(name => {
        if (q && !name.toLowerCase().includes(q) && !plugins[name].description?.toLowerCase().includes(q)) return false;
        if (filter === "enabled") return isPluginEnabled(name);
        if (filter === "disabled") return !isPluginEnabled(name);
        return true;
    });
}

export default function PluginsTab() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<Filter>("all");
    const [dialogName, setDialogName] = useState<string | null>(null);
    const [showReload, setShowReload] = useState(false);

    const stateRef = useRef<TabState | null>(null);

    const { userPlugins, requiredPlugins } = useMemo(() => {
        const user: string[] = [];
        const required: string[] = [];
        for (const n of Object.keys(plugins).sort((a, b) => a.localeCompare(b))) {
            if (plugins[n].hidden) continue;
            if (plugins[n].required) required.push(n);
            else user.push(n);
        }
        return { userPlugins: user, requiredPlugins: required };
    }, []);

    useEffect(() => {
        const initial = new Map<string, boolean>();
        for (const n of [...userPlugins, ...requiredPlugins])
            initial.set(n, isPluginEnabled(n));
        stateRef.current = { initialStates: initial, changedPlugins: new Set(), dismissed: false };
    }, [userPlugins, requiredPlugins]);

    const totalVisible = userPlugins.length + requiredPlugins.length;

    const filteredUser = useMemo(() => filterPlugins(userPlugins, search, filter), [search, filter, userPlugins]);
    const filteredRequired = useMemo(() => filterPlugins(requiredPlugins, search, filter), [search, filter, requiredPlugins]);

    const dialogPlugin = dialogName ? plugins[dialogName] : null;
    const hasResults = filteredUser.length > 0 || filteredRequired.length > 0;
    const needsReload = (stateRef.current?.changedPlugins.size ?? 0) > 0;

    const onReload = useCallback((pluginName: string) => {
        const s = stateRef.current;
        if (!s) return;
        const initial = s.initialStates.get(pluginName);
        const current = isPluginEnabled(pluginName);
        if (current === initial) s.changedPlugins.delete(pluginName);
        else s.changedPlugins.add(pluginName);

        if (s.changedPlugins.size > 0) {
            if (!s.dismissed) setShowReload(true);
        } else {
            setShowReload(false);
            s.dismissed = false;
        }
    }, []);

    const onDismiss = useCallback(() => {
        if (stateRef.current) stateRef.current.dismissed = true;
        setShowReload(false);
    }, []);

    return (
        <Flex flexDirection="column" gap="1.5rem">
            <Flex flexDirection="column" gap="0" style={{ padding: "0 0.75rem" }}>
                <Text size="sm" weight="medium">
                    Plugins
                </Text>
                <Text size="xs" color="secondary">
                    Enable or disable plugins to customize your Grok experience. Some plugins require a page reload.
                </Text>
            </Flex>
            {needsReload && !showReload && (
                <Flex alignItems="center" className={classes(cl("reload-banner"), "mx-3")}>
                    <Text size="xs" className="text-inherit flex-1">
                        Plugin changes require a page reload to take effect.
                    </Text>
                    <Button variant="outline" size="sm" onClick={() => location.reload()}>
                        Reload
                    </Button>
                </Flex>
            )}
            <Flex alignItems="center" gap="0.75rem" style={{ padding: "0 0.75rem" }}>
                <Input
                    type="text"
                    placeholder={`Search ${totalVisible} plugins...`}
                    value={search}
                    onChange={(e: { target: { value: string } }) => setSearch(e.target.value)}
                    className="flex-1 min-w-0"
                />
                <Select value={filter} onValueChange={(v: string) => setFilter(v as Filter)}>
                    <SelectTrigger className="w-28">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="enabled">Enabled</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                </Select>
            </Flex>
            {filteredUser.length > 0 && (
                <Grid columns="repeat(2, 1fr)" style={{ padding: "0 0.75rem" }}>
                    {filteredUser.map(n => (
                        <PluginCard key={n} name={n} onSettings={setDialogName} onReload={onReload} />
                    ))}
                </Grid>
            )}
            {filteredRequired.length > 0 && (
                <>
                    <Separator className="mx-3 w-auto" />
                    <Grid columns="repeat(2, 1fr)" style={{ padding: "0 0.75rem" }}>
                        {filteredRequired.map(n => (
                            <PluginCard key={n} name={n} onSettings={setDialogName} onReload={onReload} />
                        ))}
                    </Grid>
                </>
            )}
            {!hasResults && (
                <Paragraph color="secondary" className="text-center py-8">
                    {search ? "No plugins match your search." : "No plugins available."}
                </Paragraph>
            )}
            {dialogPlugin && <PluginDialog plugin={dialogPlugin} open={true} onClose={() => setDialogName(null)} />}
            <ConfirmDialog
                open={showReload}
                onOpenChange={v => { if (!v) onDismiss(); }}
                title="Reload required"
                description="This plugin modifies Grok's code and requires a page reload to apply changes."
                confirmText="Reload"
                cancelText="Later"
                onConfirm={() => location.reload()}
            />
        </Flex>
    );
}
