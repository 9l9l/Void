/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "NoWatermarks",
    description: "Forces unwatermarked media URLs.",
    authors: [Devs.Prism],

    patches: [
        {
            find: "watermarkedMediaUrl",
            all: true,
            replacement: {
                match: /watermarkedMediaUrl:null==(\i)\.watermarkedMediaUrl\?void 0:\1\.watermarkedMediaUrl/,
                replace: "watermarkedMediaUrl:null==$1.mediaUrl?void 0:$1.mediaUrl",
            },
        },
    ],
});
