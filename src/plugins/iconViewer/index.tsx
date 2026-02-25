/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./styles.css";

import { ErrorBoundary, Flex, Grid, Input, Paragraph, Text } from "@components";
import { React, useCallback, useState } from "@turbopack/common/react";
import { ClipboardUtils } from "@turbopack/common/utils";
import { getModuleCache, isBlacklisted } from "@turbopack/patchTurbopack";
import { Devs } from "@utils/constants";
import { classNameFactory } from "@utils/css";
import { useFiltered, useIntersection, useModuleLoadEffect } from "@utils/react";
import definePlugin from "@utils/types";
import type { ComponentType } from "react";

const cl = classNameFactory("void-icon-viewer-");

type IconComponent = ComponentType<{ className?: string; size?: number }>;

interface IconEntry {
    name: string;
    Icon: IconComponent;
}

const FORWARD_REF = Symbol.for("react.forward_ref");
const MOTION = Symbol.for("motionComponentSymbol");
const HOOKS_PATTERN = /\.use[A-Z]\w*[)(]/;
const ICON_SIZE = 24;

function isSvgIcon(val: unknown): val is IconComponent {
    if (typeof val === "function") return !HOOKS_PATTERN.test(String(val));

    if (val && typeof val === "object" && (val as any).$$typeof === FORWARD_REF) {
        const { render } = (val as any);
        if (typeof render !== "function") return false;
        if (HOOKS_PATTERN.test(String(render))) return false;
        if ((val as any)[MOTION]) return false;
        return true;
    }

    return false;
}

let cached: IconEntry[] = [];
let lastCacheSize = 0;

function collectIcons(): IconEntry[] {
    const cache = getModuleCache();
    if (cached.length && cache.size === lastCacheSize) return cached;
    lastCacheSize = cache.size;

    const seen = new Set<string>();
    const icons: IconEntry[] = [];

    for (const [, mod] of cache) {
        if (!mod || typeof mod !== "object" || isBlacklisted(mod)) continue;

        try {
            for (const key of Object.keys(mod)) {
                if (key[0] !== key[0].toUpperCase() || !key.endsWith("Icon")) continue;
                if (key === "Icon" || key.includes("Lottie") || seen.has(key)) continue;

                const val = mod[key];
                if (!isSvgIcon(val)) continue;

                seen.add(key);
                icons.push({ name: key, Icon: val });
            }
        } catch {}
    }

    icons.sort((a, b) => a.name.localeCompare(b.name));
    cached = icons;
    return icons;
}

function IconCard({ entry }: { entry: IconEntry }) {
    const [ref, visible] = useIntersection(true);

    return (
        <button
            ref={ref}
            onClick={() => ClipboardUtils.copyAndToast(entry.name, `Copied "${entry.name}"`)}
            className={cl("card")}
            title={entry.name}
        >
            {visible && (
                <ErrorBoundary fallback={null}>
                    <entry.Icon size={ICON_SIZE} />
                </ErrorBoundary>
            )}
            <Text as="span" className={cl("label")}>
                {entry.name.replace(/Icon$/, "")}
            </Text>
        </button>
    );
}

function IconsTab() {
    const [search, setSearch] = useState("");
    useModuleLoadEffect();

    const allIcons = collectIcons();
    const getIconName = useCallback((e: IconEntry) => e.name, []);
    const filtered = useFiltered(allIcons, search, getIconName);

    return (
        <Flex flexDirection="column" gap="1rem">
            <Flex flexDirection="column" gap="0" className={cl("section")}>
                <Text size="sm" weight="medium">
                    Icons
                </Text>
                <Text size="xs" color="secondary">
                    Browse all available Grok icons. Click any icon to copy its name.
                </Text>
            </Flex>
            <Flex className={cl("section")}>
                <Input type="text" placeholder={`Search ${allIcons.length} icons...`} value={search} onChange={e => setSearch(e.target.value)} className="flex-1" />
            </Flex>
            <Grid columns="repeat(auto-fill, minmax(96px, 1fr))" gap="0.25rem" className={cl("section")}>
                {filtered.map(entry => (
                    <IconCard key={entry.name} entry={entry} />
                ))}
            </Grid>
            {!filtered.length && (
                <Paragraph color="secondary" className={cl("empty")}>
                    No icons match your search.
                </Paragraph>
            )}
        </Flex>
    );
}

export const Tab = ErrorBoundary.wrap(IconsTab);

export default definePlugin({
    name: "IconViewer",
    description: "Browse and search all Grok icons.",
    authors: [Devs.Prism],
});
