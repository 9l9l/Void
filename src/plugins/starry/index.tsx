/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { React } from "@turbopack/common/react";
import { findExportedComponentLazy } from "@turbopack/turbopack";
import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

const StarsBackground = findExportedComponentLazy("StarsBackground");

export default definePlugin({
    name: "Starry",
    description: "Adds an always-visible starry background animation.",
    authors: [Devs.Prism],

    _stars() {
        return <StarsBackground key="void-starry" className="fixed inset-0 z-0 pointer-events-none" />;
    },

    patches: [
        {
            find: '"drop-container"',
            group: true,
            replacement: [
                {
                    match: /\(0,(\i)\.jsx\)(\("div",.{0,80}"drop-container")/,
                    replace: "(0,$1.jsxs)$2",
                },
                {
                    match: /"drop-container",children:(\(0,\i\.jsx\)\(\i,\{backend:\i,.{0,120}children:\i\}\)\}\))\}\)/,
                    replace: '"drop-container",children:[$self._stars(),$1]})',
                },
            ],
        },
    ],
});
