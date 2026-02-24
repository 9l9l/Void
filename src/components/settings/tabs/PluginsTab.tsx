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
    Text,
} from "@components";
import { React, useCallback, useMemo, useRef, useState } from "@turbopack/common/react";
import { classNameFactory } from "@utils/css";

import PluginCard from "../PluginCard";
import PluginDialog from "./PluginDialog";

const cl = classNameFactory("void-plugins-");

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
    const [needsReload, setNeedsReload] = useState(false);
    const dismissed = useRef(false);
    const initialStates = useRef<Map<string, boolean> | null>(null);
    const changedPlugins = useRef(new Set<string>());

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

    const totalVisible = userPlugins.length + requiredPlugins.length;

    const filteredUser = useMemo(() => filterPlugins(userPlugins, search, filter), [search, filter, userPlugins]);
    const filteredRequired = useMemo(() => filterPlugins(requiredPlugins, search, filter), [search, filter, requiredPlugins]);

    const dialogPlugin = dialogName ? plugins[dialogName] : null;
    const hasResults = filteredUser.length > 0 || filteredRequired.length > 0;

    if (!initialStates.current) {
        initialStates.current = new Map();
        for (const n of [...userPlugins, ...requiredPlugins])
            initialStates.current.set(n, isPluginEnabled(n));
    }

    const onReload = useCallback((pluginName: string) => {
        const initial = initialStates.current!.get(pluginName);
        const current = isPluginEnabled(pluginName);
        if (current === initial) changedPlugins.current.delete(pluginName);
        else changedPlugins.current.add(pluginName);

        if (changedPlugins.current.size > 0) {
            setNeedsReload(true);
            if (!dismissed.current) setShowReload(true);
        } else {
            setNeedsReload(false);
            setShowReload(false);
            dismissed.current = false;
        }
    }, []);

    const onDismiss = useCallback(() => {
        dismissed.current = true;
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
                <Flex alignItems="center" className={cl("reload-banner")} style={{ margin: "0 0.75rem" }}>
                    <Text size="xs" style={{ color: "inherit", flex: 1 }}>
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
                    style={{ flex: 1, minWidth: 0 }}
                />
                <Select value={filter} onValueChange={(v: string) => setFilter(v as Filter)}>
                    <SelectTrigger style={{ width: "7rem" }}>
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
                <Grid columns="repeat(2, 1fr)" style={{ padding: "0 0.75rem" }}>
                    {filteredRequired.map(n => (
                        <PluginCard key={n} name={n} onSettings={setDialogName} onReload={onReload} />
                    ))}
                </Grid>
            )}
            {!hasResults && (
                <Paragraph color="secondary" style={{ textAlign: "center", padding: "2rem 0" }}>
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
