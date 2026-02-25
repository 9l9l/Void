/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { useLayoutEffect } from "@turbopack/common/react";
import { useForceUpdater } from "@utils/react";

import { Logger } from "./Logger";

const logger = new Logger("CSP", "#ef9f76");

const CSS_DIRECTIVES = new Set(["style-src", "style-src-elem", "img-src", "font-src"]);

export const CspBlockedUrls = new Set<string>();
const listeners = new Set<() => void>();

document.addEventListener("securitypolicyviolation", ({ effectiveDirective, blockedURI }) => {
    if (!blockedURI || !CSS_DIRECTIVES.has(effectiveDirective)) return;

    if (CspBlockedUrls.has(blockedURI)) return;
    CspBlockedUrls.add(blockedURI);

    logger.warn(`CSP blocked ${effectiveDirective}: ${blockedURI}`);

    for (const cb of listeners) cb();
});

export function useCspErrors(): readonly string[] {
    const update = useForceUpdater();

    useLayoutEffect(() => {
        listeners.add(update);
        return () => void listeners.delete(update);
    }, [update]);

    return [...CspBlockedUrls];
}
