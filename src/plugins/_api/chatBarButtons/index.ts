/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { VoidChatBarButtons } from "@api/ChatBarButtons";
import { ModalContainer } from "@api/Modals";
import { createElement, Fragment } from "@turbopack/common/react";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "ChatBarButtonAPI",
    description: "Adds buttons to the chat input bar.",
    authors: ["Prism"],
    required: true,
    hidden: true,

    renderButtons() {
        return createElement(Fragment, null, createElement(VoidChatBarButtons, null), createElement(ModalContainer, null));
    },

    patches: [
        {
            find: "ImagineSelector,{iconOnlyTrigger",
            all: true,
            replacement: [
                {
                    match: /ModelModeSelect,\{iconOnlyTrigger:\i\}\)\}\),/,
                    replace: "$&$self.renderButtons(),",
                },
                {
                    match: /paddingInlineEnd:\i\?void 0:(\i)\?/,
                    replace: "paddingInlineEnd:$1?",
                },
            ],
        },
    ],
});
