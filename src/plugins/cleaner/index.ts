/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import definePlugin from "@utils/types";

export default definePlugin({
    name: "Cleaner",
    description: "Removes advertisement banners and promotional clutter.",
    authors: ["Prism"],

    patches: [
        {
            find: '"user-dropdown.upgrade","Upgrade plan"',
            all: true,
            replacement: {
                match: /\i\|\|\i\|\|\i(?=\?null:\(0,\i\.jsxs\)\(\i\.DropdownMenuItem)/,
                replace: "true",
            },
        },
        {
            find: '"UpsellCard",()=>',
            all: true,
            replacement: {
                match: /"UpsellCard",\(\)=>\i/,
                replace: '"UpsellCard",()=>()=>null',
            },
        },
        {
            find: '"UpsellSuperGrokSmall",()=>',
            all: true,
            replacement: {
                match: /"UpsellSuperGrokSmall",\(\)=>\i/,
                replace: '"UpsellSuperGrokSmall",()=>()=>null',
            },
        },
        {
            find: "group/model-mode-select-upsell",
            replacement: {
                match: /useCheckSubscriptionOffer\)\(\);if\(!\i\|\|\i&&\i\)return null;/,
                replace: "useCheckSubscriptionOffer)();return null;",
            },
        },
    ],
});
