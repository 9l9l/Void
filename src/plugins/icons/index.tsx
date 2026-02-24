/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./styles.css";

import { ErrorBoundary, Flex, Grid, Input, Paragraph, Text } from "@components";
import { React, useCallback, useMemo, useState } from "@turbopack/common/react";
import { ClipboardUtils } from "@turbopack/common/utils";
import { getModuleCache } from "@turbopack/patchTurbopack";
import { findAll } from "@turbopack/turbopack";
import { classNameFactory } from "@utils/css";
import { useIntersection, useModuleLoadEffect } from "@utils/react";
import definePlugin from "@utils/types";
import type { ComponentType } from "react";

const cl = classNameFactory("void-icon-card-");

type IconComponent = ComponentType<{ className?: string; size?: number }>;
type IconEntry = { name: string; Icon: IconComponent };

const FORWARD_REF = Symbol.for("react.forward_ref");
const MOTION = Symbol.for("motionComponentSymbol");
const HOOKS = /\.use[A-Z]\w*[)(]/;

function isSvgIcon(val: unknown): val is IconComponent {
    let fn: Function | null = null;
    if (typeof val === "function") fn = val;
    else if (val && typeof val === "object" && (val as any).$$typeof === FORWARD_REF) fn = (val as any).render;
    if (!fn || HOOKS.test(String(fn))) return false;
    if ((val as any)[MOTION]) return false;
    return true;
}

let cached: IconEntry[] = [];
let lastSize = 0;

function collectIcons(): IconEntry[] {
    const { size } = getModuleCache();
    if (cached.length && size === lastSize) return cached;
    lastSize = size;

    const seen = new Set<string>();
    const icons: IconEntry[] = [];

    findAll(mod => {
        if (!mod || typeof mod !== "object") return false;
        try {
            for (const key of Object.keys(mod)) {
                if (!key.endsWith("Icon") || key === "Icon" || key[0] !== key[0].toUpperCase()) continue;
                if (key.includes("Lottie") || seen.has(key)) continue;
                const val: unknown = mod[key];
                if (!isSvgIcon(val)) continue;
                seen.add(key);
                icons.push({ name: key, Icon: val });
            }
        } catch {}
        return false;
    });

    icons.sort((a, b) => a.name.localeCompare(b.name));
    cached = icons;
    return icons;
}

function IconCard({ entry, onCopy }: { entry: IconEntry; onCopy: (name: string) => void }) {
    const [ref, visible] = useIntersection(true);

    return (
        <button ref={ref} onClick={() => onCopy(entry.name)} className={cl("root")} title={entry.name}>
            {visible && (
                <ErrorBoundary fallback={null}>
                    <entry.Icon size={24} />
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

    const filtered = useMemo(() => {
        if (!search) return allIcons;
        const q = search.toLowerCase();
        return allIcons.filter(e => e.name.toLowerCase().includes(q));
    }, [search, allIcons]);

    const onCopy = useCallback((name: string) => {
        ClipboardUtils.copyAndToast(name, `Copied "${name}"`);
    }, []);

    return (
        <Flex flexDirection="column" gap="1rem">
            <Flex flexDirection="column" gap="0" style={{ padding: "0 0.75rem" }}>
                <Text size="sm" weight="medium">
                    Icons
                </Text>
                <Text size="xs" color="secondary">
                    Browse all available Grok icons. Click any icon to copy its name.
                </Text>
            </Flex>
            <Flex style={{ padding: "0 0.75rem" }}>
                <Input type="text" placeholder={`Search ${allIcons.length} icons...`} value={search} onChange={(e: { target: { value: string } }) => setSearch(e.target.value)} style={{ flex: 1 }} />
            </Flex>
            <Grid columns="repeat(auto-fill, minmax(96px, 1fr))" gap="0.25rem" style={{ padding: "0 0.75rem" }}>
                {filtered.map(entry => (
                    <IconCard key={entry.name} entry={entry} onCopy={onCopy} />
                ))}
            </Grid>
            {!filtered.length && (
                <Paragraph color="secondary" style={{ textAlign: "center", padding: "2rem 0" }}>
                    No icons match your search.
                </Paragraph>
            )}
        </Flex>
    );
}

export const Tab = ErrorBoundary.wrap(IconsTab);

export default definePlugin({
    name: "Icons",
    description: "Browse and search all Grok icons.",
    authors: ["Prism"],
});
