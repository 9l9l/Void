/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

function onDblClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const response = target.closest<HTMLElement>("[id^='response-']");
    if (!response) return;

    const editBtn = response.querySelector<HTMLButtonElement>("[aria-label='Edit']");
    editBtn?.click();
}

export default definePlugin({
    name: "MessageClickActions",
    description: "Double-click your own messages to edit them.",
    authors: [Devs.Prism],

    eventListeners: [
        { event: "dblclick", handler: onDblClick as EventListener },
    ],
});
