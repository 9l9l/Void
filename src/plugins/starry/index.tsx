/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { React } from "@turbopack/common/react";
import { findExportedComponentLazy } from "@turbopack/turbopack";
import definePlugin from "@utils/types";

const StarsBackground = findExportedComponentLazy("StarsBackground");

export default definePlugin({
    name: "Starry",
    description: "Adds an always-visible starry background animation.",
    authors: ["Prism"],

    _stars() {
        return <StarsBackground key="void-starry" className="fixed inset-0 z-0 pointer-events-none" />;
    },

    patches: [
        {
            find: '"drop-container"',
            replacement: {
                match: /(\i\.jsx)\)\(("div",\{ref:\i,className:"flex w-full h-full","data-testid":"drop-container",children:)(\(0,\i\.jsx\)\(\i,\{backend:\i,options:\{rootElement:\i\.current\},context:globalThis\.window,children:\(0,\i\.jsx\)\(\i,\{className:\i,children:\i\}\)\}\))\}\)/,
                replace: "$1s)($2[$self._stars(),$3]})",
            },
        },
    ],
});
