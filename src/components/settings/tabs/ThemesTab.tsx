/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./ThemesTab.css";

import { addTheme, getThemes, isThemesEnabled, removeTheme, setThemesEnabled, type ThemeData } from "@api/Themes";
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
    Switch,
    Text,
} from "@components";
import { React, useMemo, useState } from "@turbopack/common/react";
import { classNameFactory } from "@utils/css";

import ThemeCard from "../ThemeCard";

const cl = classNameFactory("void-themes-");

type Filter = "all" | "enabled" | "disabled";

function filterThemes(themes: ThemeData[], search: string, filter: Filter): ThemeData[] {
    const q = search.toLowerCase();
    return themes.filter(t => {
        if (q && !t.name.toLowerCase().includes(q) && !t.author.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) return false;
        if (filter === "enabled") return t.enabled;
        if (filter === "disabled") return !t.enabled;
        return true;
    });
}

export default function ThemesTab() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<Filter>("all");
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [enabled, setEnabled] = useState(isThemesEnabled);
    const [themes, setThemes] = useState(getThemes);

    const filtered = useMemo(() => filterThemes(themes, search, filter), [themes, search, filter]);

    const handleToggle = (checked: boolean) => {
        setEnabled(checked);
        setThemesEnabled(checked);
    };

    const handleAdd = async () => {
        const trimmed = url.trim();
        if (!trimmed) return;
        setError("");
        setLoading(true);
        try {
            await addTheme(trimmed);
            setUrl("");
            setThemes(getThemes());
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Failed to add theme.");
        } finally {
            setLoading(false);
        }
    };

    const [removeUrl, setRemoveUrl] = useState<string | null>(null);
    const removeTarget = removeUrl ? themes.find(t => t.url === removeUrl) : null;

    const handleRemove = () => {
        if (!removeUrl) return;
        removeTheme(removeUrl);
        setRemoveUrl(null);
        setThemes(getThemes());
    };

    return (
        <Flex flexDirection="column" gap="2rem">
            <Flex alignItems="center" justifyContent="space-between" style={{ padding: "0 0.75rem" }}>
                <Flex flexDirection="column" gap="0">
                    <Text size="sm" weight="medium">
                        Themes
                    </Text>
                    <Text size="xs" color="secondary">
                        Add and manage custom themes for Grok. Paste a URL to a CSS file to get started.
                    </Text>
                </Flex>
                <Switch checked={enabled} onCheckedChange={handleToggle} />
            </Flex>
            <Flex flexDirection="column" gap="0.5rem" style={{ padding: "0 0.75rem" }}>
                <Flex alignItems="center" gap="0.5rem">
                    <Input
                        type="text"
                        placeholder="https://raw.githubusercontent.com/..."
                        value={url}
                        onChange={(e: { target: { value: string } }) => { setUrl(e.target.value); setError(""); }}
                        onKeyDown={(e: { key: string }) => { if (e.key === "Enter") handleAdd(); }}
                        style={{ flex: 1, minWidth: 0 }}
                    />
                    <Button variant="primary" onClick={handleAdd} disabled={loading || !url.trim()}>
                        {loading ? "Importing..." : "Import"}
                    </Button>
                </Flex>
                {error && <Text size="xs" className={cl("add-error")}>{error}</Text>}
            </Flex>
            {themes.length > 0 && (
                <Flex flexDirection="column" gap="0.375rem" style={{ padding: "0 0.75rem" }}>
                    <Flex flexDirection="column" gap="0">
                        <Text size="sm" weight="medium">Installed Themes</Text>
                        <Text size="xs" color="secondary">
                            Themes are fetched fresh on each page load. Toggle individual themes on or off, or use the global switch above to disable all at once.
                        </Text>
                    </Flex>
                    <Text size="xs" color="secondary">
                        {`${themes.length} theme${themes.length === 1 ? "" : "s"} installed \u00B7 ${themes.filter(t => t.enabled).length} enabled`}
                    </Text>
                </Flex>
            )}
            {themes.length > 0 && (
                <Flex alignItems="center" gap="0.75rem" style={{ padding: "0 0.75rem" }}>
                    <Input
                        type="text"
                        placeholder={`Search ${themes.length} themes...`}
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
            )}
            {filtered.length > 0 && (
                <Grid columns="repeat(2, 1fr)" style={{ padding: "0 0.75rem" }}>
                    {filtered.map(t => (
                        <ThemeCard key={t.url} theme={t} globalEnabled={enabled} onRemove={setRemoveUrl} onToggle={() => setThemes(getThemes())} />
                    ))}
                </Grid>
            )}
            {themes.length > 0 && !filtered.length && (
                <Paragraph color="secondary" style={{ textAlign: "center", padding: "2rem 0" }}>
                    No themes match your search.
                </Paragraph>
            )}
            {!themes.length && (
                <Paragraph color="secondary" style={{ textAlign: "center", padding: "2rem 0" }}>
                    No themes added yet. Paste a URL above to add one.
                </Paragraph>
            )}
            <ConfirmDialog
                open={removeUrl != null}
                onOpenChange={v => { if (!v) setRemoveUrl(null); }}
                title="Remove theme"
                description={`Are you sure you want to remove "${removeTarget?.name ?? "this theme"}"?`}
                confirmText="Remove"
                cancelText="Cancel"
                danger
                onConfirm={handleRemove}
            />
        </Flex>
    );
}
