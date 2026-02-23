/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Button, Card, Flex, Input, Paragraph, SettingsDescription, SettingsRow, SettingsTitle, Switch, Text } from "@components";
import { ErrorBoundary } from "@components/ErrorBoundary";
import { React, useCallback, useMemo, useState } from "@turbopack/common/react";
import { FeatureStore } from "@turbopack/common/stores";
import { classNameFactory } from "@utils/css";
import definePlugin from "@utils/types";

import "./styles.css";

const cl = classNameFactory("void-experiments-");

function prettifyKey(key: string): string {
    return key
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase())
        .replace(/\bMcp\b/g, "MCP")
        .replace(/\bUi\b/g, "UI")
        .replace(/\bApi\b/g, "API")
        .replace(/\bUrl\b/g, "URL")
        .replace(/\bGcal\b/g, "GCal")
        .replace(/\bMie\b/g, "MIE")
        .replace(/\bXlsx\b/g, "XLSX")
        .replace(/\bNux\b/g, "NUX")
        .replace(/\bXai\b/g, "xAI")
        .replace(/\bGrok\b/gi, "Grok")
        .replace(/\bId\b/g, "ID");
}

function ExperimentRow({ flagKey }: { flagKey: string }) {
    const config = FeatureStore.useFeatureStore(s => s.config[flagKey]);
    const override = FeatureStore.useFeatureStore(s => s.overrides[flagKey]);

    const isOverridden = override !== undefined;
    const checked = isOverridden ? !!override : !!config;

    const handleToggle = useCallback(
        (value: boolean) => {
            const { setOverride, clearOverride, config: c } = FeatureStore.useFeatureStore.getState();
            if (value === !!c[flagKey]) clearOverride(flagKey);
            else setOverride(flagKey, value);
        },
        [flagKey],
    );

    return (
        <SettingsRow action={<Switch checked={checked} onCheckedChange={handleToggle} />}>
            <SettingsTitle>
                {prettifyKey(flagKey)}
                {isOverridden && (
                    <Text size="xs" color="muted" as="span" style={{ marginLeft: 6, color: "hsl(var(--fg-warning))" }}>
                        (modified)
                    </Text>
                )}
            </SettingsTitle>
            <SettingsDescription>{flagKey}</SettingsDescription>
        </SettingsRow>
    );
}

function ExperimentsTab() {
    const [search, setSearch] = useState("");
    const config = FeatureStore.useFeatureStore(s => s.config);
    const overrides = FeatureStore.useFeatureStore(s => s.overrides);

    const booleanKeys = useMemo(
        () =>
            Object.keys(config)
                .filter(k => typeof config[k] === "boolean")
                .sort(),
        [config],
    );

    const filtered = useMemo(() => {
        const query = search.toLowerCase().trim();
        if (!query) return booleanKeys;
        return booleanKeys.filter(k => k.toLowerCase().includes(query) || prettifyKey(k).toLowerCase().includes(query));
    }, [search, booleanKeys]);

    const overrideCount = Object.keys(overrides).length;

    const handleSearch = useCallback((e: any) => {
        setSearch(e.target.value);
    }, []);

    return (
        <Flex flexDirection="column" gap="1rem">
            <Flex flexDirection="column" gap="0" style={{ padding: "0 0.75rem" }}>
                <Text size="sm" weight="medium">
                    Experiments
                </Text>
                <Text size="xs" color="secondary">
                    Toggle unreleased Grok features. These are experimental and may break things.
                </Text>
            </Flex>
            <Card variant="ghost" className={cl("warning")} style={{ margin: "0 0.75rem" }}>
                <Text size="xs" style={{ color: "inherit", lineHeight: 1.5 }}>
                    Only enable flags you understand. Changing the wrong setting can break Grok or cause unexpected behavior.
                </Text>
            </Card>
            <Flex alignItems="center" gap="0.5rem" style={{ padding: "0 0.75rem" }}>
                <Input placeholder={`Search ${booleanKeys.length} flags...`} value={search} onChange={handleSearch} style={{ flex: 1 }} />
                {overrideCount > 0 && (
                    <Button variant="outline" size="sm" onClick={() => FeatureStore.useFeatureStore.getState().clearAllOverrides()}>
                        Clear {overrideCount} override{overrideCount !== 1 ? "s" : ""}
                    </Button>
                )}
            </Flex>
            {filtered.map(key => (
                <ErrorBoundary key={key} fallback={null}>
                    <ExperimentRow flagKey={key} />
                </ErrorBoundary>
            ))}
            {!filtered.length && (
                <Paragraph color="muted" style={{ textAlign: "center", padding: "2rem" }}>
                    No flags matching "{search}"
                </Paragraph>
            )}
        </Flex>
    );
}

export const Tab = ErrorBoundary.wrap(ExperimentsTab);

export default definePlugin({
    name: "Experiments",
    description: "Unlock and toggle unreleased Grok features.",
    authors: ["Prism"],

    patches: [
        {
            find: 'ENABLE_SCREEN_SHARING:"enable_screen_sharing"',
            all: true,
            replacement: {
                match: /(\i),\i&&(void 0!==\i\[\i\]\?!!)/,
                replace: "$1,$2",
            },
        },
    ],
});
