/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { VoidContextMenuItems } from "@api/ContextMenus";
import { createElement } from "@turbopack/common/react";
import definePlugin from "@utils/types";

const render = (props: Record<string, unknown>) => createElement(VoidContextMenuItems as any, props);

export default definePlugin({
    name: "ContextMenuAPI",
    description: "Adds items to context menus.",
    authors: ["Prism"],
    required: true,
    hidden: true,

    renderItems(location: string, ctx?: Record<string, unknown>) {
        return render({ location, ...ctx });
    },

    patches: [
        {
            find: "handleIsolateClick,children:[i&&",
            all: true,
            group: true,
            replacement: [
                {
                    match: /onSaveEdit:(\i)\}\)/,
                    replace: "onSaveEdit:$1,id:arguments[0].id})",
                },
                {
                    match: /onEditClick:(\i)\}\)/,
                    replace: "onEditClick:$1,...arguments[0]})",
                },
                {
                    match: /(\i)\("Delete","Delete"\)\]\}\)(\]\}\)\]\}\))/,
                    replace: '$1("Delete","Delete")]}),$self.renderItems("conversation",{conversationId:arguments[0].id})$2',
                },
            ],
        },
        {
            find: '"CopyButton",()=>',
            all: true,
            replacement: {
                match: /hash:(\i)\.slice\(0,5\)\}\}\)}\)\]}\)\]}\)}/,
                replace: 'hash:$1.slice(0,5)}})})]}),$self.renderItems("message",{response:arguments[0].response})]})}',
            },
        },
        {
            find: '"AvatarDropdownMenu",()=>',
            all: true,
            replacement: {
                match: /"Sign Out"\)\]\}\)(\]\}\)\]\}\))/,
                replace: '"Sign Out")]}),$self.renderItems("user")$1',
            },
        },
    ],
});
