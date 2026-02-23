/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { isPluginEnabled, plugins } from "@api/PluginManager";
import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import { React, useCallback, useMemo, useState } from "@turbopack/common/react";
import { classNameFactory } from "@utils/css";

import PluginCard from "../PluginCard";
import PluginDialog from "./PluginDialog";

import "./PluginsTab.css";

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

    const onReload = useCallback(() => setShowReload(true), []);

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
            <Dialog
                open={showReload}
                onOpenChange={(v: boolean) => {
                    if (!v) setShowReload(false);
                }}
            >
                <DialogContent className={cl("reload-content")}>
                    <DialogHeader>
                        <DialogTitle>Reload required</DialogTitle>
                        <DialogDescription>This plugin modifies Grok's code and requires a page reload to apply changes.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setShowReload(false)}>
                            Later
                        </Button>
                        <Button variant="primary" onClick={() => location.reload()}>
                            Reload
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Flex>
    );
}
