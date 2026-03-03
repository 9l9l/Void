/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "FixChrome",
    description: "Fixes Chromium-specific performance issues like backdrop blur lag.",
    authors: [Devs.Prism, Devs.o9],
    required: true,

    patches: [
        {
            find: "bg-overlay backdrop-blur-[2px]",
            all: true,
            replacement: {
                match: /backdrop-blur-\[2px\] /,
                replace: " ",
            },
        },
    ],
});
