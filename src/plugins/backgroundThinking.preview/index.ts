/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "BackgroundThinking",
    description: "Lets Grok think in the background while you are away.",
    authors: [Devs.Prism, Devs.o9],

    patches: [
        {
            find: '"bgThinkingDefaultOptinSet"',
            replacement: {
                match: /\.success\?(\i)\.data:null/,
                replace: ".success?$1.data:{enabled:!0,maxConcurrentRequests:3}",
            },
        },
    ],
});
