/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import definePlugin from "@utils/types";

export default definePlugin({
    name: "ConsoleJanitor",
    description: "Cleans up the browser developer console.",
    authors: ["Prism"],

    patches: [
        {
            find: "x.ai/careers",
            replacement: {
                match: /console\.info\("[^"]{0,2000}"\)/,
                replace: "void 0",
            },
        },
    ],
});
