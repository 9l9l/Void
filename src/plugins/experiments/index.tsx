/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./styles.css";

import { definePluginSettings } from "@api/Settings";
import { Button, Card, Chip, Flex, Input, Paragraph, SettingsDescription, SettingsRow, SettingsTitle, Switch, Text } from "@components";
import { ErrorBoundary } from "@components/ErrorBoundary";
import type { FeatureStoreState } from "@grok-types";
import { React, useCallback, useMemo, useState } from "@turbopack/common/react";
import { FeatureStore } from "@turbopack/common/stores";
import { classNameFactory } from "@utils/css";
import { Logger } from "@utils/Logger";
import definePlugin, { StartAt } from "@utils/types";

const logger = new Logger("Experiments", "#a6d189");

const cl = classNameFactory("void-experiments-");

const NEW_FLAG_TTL = 24 * 60 * 60 * 1000;

interface PrivateSettings {
    knownFlags: Record<string, number>;
}

const settings = definePluginSettings({}).withPrivateSettings<PrivateSettings>();

function getBooleanKeys(config: FeatureStoreState["config"]): string[] {
    return Object.keys(config).filter(k => typeof config[k] === "boolean");
}

function syncKnownFlags(config: FeatureStoreState["config"]) {
    const booleanKeys = getBooleanKeys(config);
    const existing = settings.plain.knownFlags;
    const firstRun = existing == null;
    const known: Record<string, number> = existing ?? {};
    const now = Date.now();
    let changed = false;

    for (const key of booleanKeys) {
        if (!(key in known)) {
            known[key] = firstRun ? 0 : now;
            changed = true;
        }
    }

    const currentSet = new Set(booleanKeys);
    for (const key of Object.keys(known)) {
        if (!currentSet.has(key)) {
            delete known[key];
            changed = true;
        }
    }

    if (changed) {
        settings.store.knownFlags = { ...known };
        logger.info(`Synced known flags (${booleanKeys.length} total)`);
    }
}

function isNewFlag(key: string): boolean {
    const seen = settings.plain.knownFlags?.[key];
    if (seen == null) return false;
    return Date.now() - seen < NEW_FLAG_TTL;
}

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

function ExperimentRow({ flagKey, isNew }: { flagKey: string; isNew: boolean }) {
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
                {isNew && <Chip className={cl("new-chip")}>NEW</Chip>}
                {isOverridden && (
                    <Text size="xs" as="span" className={cl("modified")}>
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

    const booleanKeys = useMemo(() => getBooleanKeys(config).sort(), [config]);

    const filtered = useMemo(() => {
        const query = search.toLowerCase().trim();
        if (!query) return booleanKeys;
        return booleanKeys.filter(k => k.toLowerCase().includes(query) || prettifyKey(k).toLowerCase().includes(query));
    }, [search, booleanKeys]);

    const overrideCount = Object.keys(overrides).length;

    return (
        <Flex flexDirection="column" gap="1rem">
            <Flex flexDirection="column" gap="0" className={cl("section")}>
                <Text size="sm" weight="medium">
                    Experiments
                </Text>
                <Text size="xs" color="secondary">
                    Toggle unreleased Grok features. These are experimental and may break things.
                </Text>
            </Flex>
            <Card variant="ghost" className={cl("warning")}>
                <Text size="xs" className={cl("warning-text")}>
                    Only enable flags you understand. Changing the wrong setting can break Grok or cause unexpected behavior.
                </Text>
            </Card>
            <Flex alignItems="center" gap="0.5rem" className={cl("section")}>
                <Input placeholder={`Search ${booleanKeys.length} flags...`} value={search} onChange={e => setSearch(e.target.value)} className="flex-1" />
                {overrideCount > 0 && (
                    <Button variant="outline" size="sm" onClick={() => FeatureStore.useFeatureStore.getState().clearAllOverrides()}>
                        Clear {overrideCount} override{overrideCount !== 1 ? "s" : ""}
                    </Button>
                )}
            </Flex>
            {filtered.map(key => (
                <ErrorBoundary key={key} fallback={null}>
                    <ExperimentRow flagKey={key} isNew={isNewFlag(key)} />
                </ErrorBoundary>
            ))}
            {!filtered.length && (
                <Paragraph color="muted" className={cl("empty")}>
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
    settings,
    startAt: StartAt.TurbopackReady,

    start() {
        const state = FeatureStore.useFeatureStore.getState();
        if (state.status === "ready") {
            syncKnownFlags(state.config);
            return;
        }

        const unsub = FeatureStore.useFeatureStore.subscribe(current => {
            if (current.status !== "ready") return;
            unsub();
            syncKnownFlags(current.config);
        });
    },

    patches: [
        {
            find: 'ENABLE_SCREEN_SHARING:"enable_screen_sharing"',
            all: true,
            replacement: {
                match: /\i&&(void 0!==\i\[\i\])/,
                replace: "$1",
            },
        },
    ],
});
