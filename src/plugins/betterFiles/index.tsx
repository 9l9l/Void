/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ErrorBoundary } from "@components/ErrorBoundary";
import { TrashIcon } from "@components/icons";
import { ButtonWithTooltip } from "@turbopack/common/components";
import { React, useCallback, useState } from "@turbopack/common/react";
import { FilesPageStore } from "@turbopack/common/stores";
import { Devs } from "@utils/constants";
import { Logger } from "@utils/Logger";
import definePlugin from "@utils/types";

const logger = new Logger("BetterFiles", "#e06c75");

function DeleteAllButton() {
    const [confirming, setConfirming] = useState(false);
    const list = FilesPageStore.useFilesPageStore(s => s.list);
    const deleteAsset = FilesPageStore.useFilesPageStore(s => s.deleteAsset);

    const handleClick = useCallback(async () => {
        if (!confirming) {
            setConfirming(true);
            return;
        }

        setConfirming(false);
        const ids = [...list];
        logger.info(`Deleting ${ids.length} files`);

        for (const id of ids) {
            try {
                await deleteAsset(id);
            } catch (e) {
                logger.error(`Failed to delete asset ${id}`, e);
            }
        }
    }, [confirming, list, deleteAsset]);

    if (!list.length) return null;

    return (
        <ButtonWithTooltip
            variant={confirming ? "danger" : "tertiary"}
            shape="square"
            size="sm"
            className="flex-shrink-0"
            tooltipContent={confirming ? "Are you sure? Click again to delete all files." : "Delete all files"}
            onClick={handleClick}
            onBlur={() => setConfirming(false)}
        >
            <TrashIcon size={18} />
        </ButtonWithTooltip>
    );
}

export default definePlugin({
    name: "BetterFiles",
    description: "Adds a button to delete all files on the files page.",
    authors: [Devs.Prism],

    renderDeleteAllButton: ErrorBoundary.wrap(DeleteAllButton),

    patches: [
        {
            find: "title-and-button",
            replacement: {
                match: /"files-search-open-button.label".{0,25}\)\}\)\]\}\)/,
                replace: "$&,$self.renderDeleteAllButton()",
            },
        },
    ],
});
