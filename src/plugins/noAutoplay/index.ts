/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";

const settings = definePluginSettings({
    playOnHover: {
        type: OptionType.BOOLEAN,
        description: "Play video thumbnails when hovered.",
        default: true,
    },
});

const onMouseEnter = (e: { target: HTMLVideoElement }) => e.target.play();
const onMouseLeave = (e: { target: HTMLVideoElement }) => {
    e.target.pause();
    e.target.currentTime = 0;
};

export default definePlugin({
    name: "NoAutoplay",
    description: "Stops video thumbnails from autoplaying on the Imagine page.",
    authors: ["Prism"],
    settings,

    _hoverProps() {
        if (!settings.store.playOnHover) return {};
        return { onMouseEnter, onMouseLeave };
    },

    _pointerClass() {
        return settings.store.playOnHover ? "pointer-events-auto" : "pointer-events-none";
    },

    patches: [
        {
            find: "group/media-post-masonry-card",
            group: true,
            replacement: [
                {
                    match: /(src:\i),muted:!0,autoPlay:!0,controls:!1,loop:!0,playsInline:!0,poster:/,
                    replace: "...$self._hoverProps(),$1,muted:!0,autoPlay:!1,controls:!1,loop:!0,playsInline:!0,poster:",
                },
                {
                    match: /"pointer-events-none"/,
                    replace: "$self._pointerClass()",
                },
            ],
        },
    ],
});
