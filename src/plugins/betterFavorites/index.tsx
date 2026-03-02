/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./styles.css";

import { ErrorBoundary } from "@components/ErrorBoundary";
import { DownloadIcon } from "@components/icons";
import type { MediaItem } from "@grok-types";
import { AssetUtils, ButtonWithTooltip, DownloadUtils, EnvUtils, FileUtils, Toaster } from "@turbopack/common";
import { React } from "@turbopack/common/react";
import { MediaStore } from "@turbopack/common/stores";
import { Devs } from "@utils/constants";
import { isTruthy } from "@utils/guards";
import { Logger } from "@utils/Logger";
import { createExternalStore, errorMessage, fetchExternal, sanitizeFilename } from "@utils/misc";
import { useExternalStore } from "@utils/react";
import { pluralize } from "@utils/text";
import definePlugin from "@utils/types";

const logger = new Logger("BetterFavorites", "#e78284");

const selectedIds = new Set<string>();
const selectionStore = createExternalStore();
let downloading = false;

function clearSelection() {
    if (!selectedIds.size) return;
    for (const id of selectedIds) {
        document.querySelector(`[data-void-post-id="${id}"]`)?.removeAttribute("data-void-selected");
    }
    selectedIds.clear();
    selectionStore.notify();
}

function getMediaUrl(item: MediaItem): string | undefined {
    const server = EnvUtils.getEnv("ASSET_SERVER_URL") ?? "https://assets";
    const raw = item.videoUrl ?? item.mediaUrl;
    if (!raw) return;

    const url = AssetUtils.getCachedAssetUrl(server, raw);
    if (!url) return;

    const parsed = new URL(url);
    parsed.searchParams.set("dl", "1");
    return parsed.toString();
}

function getFilename(item: MediaItem): string {
    const isVideo = item.mediaType === "MEDIA_POST_TYPE_VIDEO";
    const ext = isVideo ? ".mp4" : ".png";
    const prefix = isVideo ? "grok-video" : "grok-image";
    const res = item.resolution ? `-${item.resolution.width}x${item.resolution.height}` : "";
    const slug = item.prompt ? `${sanitizeFilename(item.prompt).slice(0, 40)}-${item.id.slice(0, 8)}` : item.id;
    return `${prefix}-${slug}${res}${ext}`;
}

function expandVariants(items: MediaItem[]): MediaItem[] {
    const seen = new Set<string>();
    const result: MediaItem[] = [];

    for (const item of items) {
        if (!seen.has(item.id)) {
            seen.add(item.id);
            result.push(item);
        }

        for (const child of item.childPosts ?? []) {
            if (seen.has(child.id)) continue;
            seen.add(child.id);
            result.push(child);
        }
    }

    return result;
}

async function fetchBlob(url: string): Promise<Blob> {
    const isGrokDomain = new URL(url).hostname.endsWith(".grok.com");

    if (isGrokDomain) {
        try {
            const resp = await fetch(url, { credentials: "include" });
            if (resp.ok) return resp.blob();
        } catch { /* CORS error, try fallback */ }
    }

    const resp = await fetchExternal(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return resp.blob();
}

let crc32Table: Uint32Array | null = null;

function crc32(buf: Uint8Array): number {
    const table = crc32Table ??= (() => {
        const t = new Uint32Array(256);
        for (let i = 0; i < 256; i++) {
            let c = i;
            for (let j = 0; j < 8; j++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
            t[i] = c;
        }
        return t;
    })();
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
    return (crc ^ 0xFFFFFFFF) >>> 0;
}

function buildZip(files: { name: string; data: Uint8Array }[]): Uint8Array {
    const encoder = new TextEncoder();
    const localHeaders: Uint8Array[] = [];
    const centralHeaders: Uint8Array[] = [];
    let offset = 0;

    for (const file of files) {
        const nameBytes = encoder.encode(file.name);
        const crc = crc32(file.data);
        const size = file.data.length;

        const local = new Uint8Array(30 + nameBytes.length);
        const lv = new DataView(local.buffer);
        lv.setUint32(0, 0x04034B50, true);
        lv.setUint16(4, 20, true);
        lv.setUint32(14, crc, true);
        lv.setUint32(18, size, true);
        lv.setUint32(22, size, true);
        lv.setUint16(26, nameBytes.length, true);
        local.set(nameBytes, 30);

        localHeaders.push(local, file.data);

        const central = new Uint8Array(46 + nameBytes.length);
        const cv = new DataView(central.buffer);
        cv.setUint32(0, 0x02014B50, true);
        cv.setUint16(4, 20, true);
        cv.setUint16(6, 20, true);
        cv.setUint32(16, crc, true);
        cv.setUint32(20, size, true);
        cv.setUint32(24, size, true);
        cv.setUint16(28, nameBytes.length, true);
        cv.setUint32(42, offset, true);
        central.set(nameBytes, 46);

        centralHeaders.push(central);
        offset += 30 + nameBytes.length + size;
    }

    const centralSize = centralHeaders.reduce((s, h) => s + h.length, 0);
    const endRecord = new Uint8Array(22);
    const ev = new DataView(endRecord.buffer);
    ev.setUint32(0, 0x06054B50, true);
    ev.setUint16(8, files.length, true);
    ev.setUint16(10, files.length, true);
    ev.setUint32(12, centralSize, true);
    ev.setUint32(16, offset, true);

    const totalSize = offset + centralSize + 22;
    const zip = new Uint8Array(totalSize);
    let pos = 0;

    for (const part of localHeaders) {
        zip.set(part, pos);
        pos += part.length;
    }
    for (const part of centralHeaders) {
        zip.set(part, pos);
        pos += part.length;
    }
    zip.set(endRecord, pos);

    return zip;
}

async function downloadItems(items: MediaItem[]) {
    if (downloading) return;
    downloading = true;

    try {
        const expanded = expandVariants(items);
        const downloadable = expanded.filter(i => i.mediaUrl || i.videoUrl);
        if (!downloadable.length) {
            Toaster.toast("Nothing to download", { variant: "error" });
            return;
        }

        if (downloadable.length === 1) {
            const item = downloadable[0];
            const url = getMediaUrl(item);
            if (!url) return;
            Toaster.toast("Downloading...");
            await DownloadUtils.downloadImage(url, getFilename(item));
            clearSelection();
            return;
        }

        Toaster.toast(`Downloading ${pluralize(downloadable.length, "file")}...`);

        const entries = (await Promise.all(
            downloadable.map(async item => {
                const url = getMediaUrl(item);
                if (!url) return null;
                try {
                    const blob = await fetchBlob(url);
                    const data = new Uint8Array(await blob.arrayBuffer());
                    return { name: getFilename(item), data };
                } catch (e) {
                    logger.warn(`Failed to fetch ${item.id}:`, e);
                    return null;
                }
            })
        )).filter(isTruthy);

        if (!entries.length) {
            Toaster.toast("All downloads failed", { variant: "error" });
            return;
        }

        const zip = buildZip(entries);
        await FileUtils.downloadBlob(new Blob([zip.buffer as ArrayBuffer], { type: "application/zip" }), "grok-favorites.zip");
        clearSelection();
    } catch (e) {
        logger.error("ZIP download failed:", e);
        Toaster.toast(`Download failed: ${errorMessage(e)}`, { variant: "error" });
    } finally {
        downloading = false;
    }
}

function DownloadButton() {
    useExternalStore(selectionStore);
    const favorites = MediaStore.useMediaStore(s => s.favoritesList);
    const count = selectedIds.size;

    const label = count
        ? `Download ${pluralize(count, "image")}`
        : "Download all";

    const handleClick = () => {
        const items = count
            ? favorites.filter(i => selectedIds.has(i.id))
            : favorites;
        downloadItems(items);
    };

    if (!favorites.length) return null;

    return (
        <ButtonWithTooltip
            tooltipContent={label}
            variant="secondary"
            shape="pill"
            size="md"
            onClick={handleClick}
        >
            <DownloadIcon className="size-4" />
            <span className="font-semibold">{label}</span>
        </ButtonWithTooltip>
    );
}

export default definePlugin({
    name: "BetterFavorites",
    description: "Ctrl+Click to select images on the Imagine page, then download them individually or as a ZIP.",
    authors: [Devs.Prism],
    managedStyle: "betterFavorites",

    renderDownloadButton: ErrorBoundary.wrap(DownloadButton),

    _onClickCapture(e: React.MouseEvent<HTMLElement>) {
        if (!e.ctrlKey && !e.metaKey) return;
        e.stopPropagation();
        e.preventDefault();

        const el = e.currentTarget;
        const id = el.dataset.voidPostId;
        if (!id) return;

        if (selectedIds.has(id)) {
            selectedIds.delete(id);
            el.removeAttribute("data-void-selected");
        } else {
            selectedIds.add(id);
            el.setAttribute("data-void-selected", "");
        }

        selectionStore.notify();
    },

    stop() {
        clearSelection();
    },

    patches: [
        {
            find: "group/media-post-masonry-card",
            replacement: {
                match: /onClick:\(\)=>\{var \i,\i,\i,\i;if\((\i)\.isGenerated.{0,80}"home-grid"/,
                replace: '"data-void-post-id":$1.id,onClickCapture:$self._onClickCapture,$&',
            },
        },
        {
            find: "imagine-upload-button.tooltip",
            replacement: {
                match: /,\i&&\(0,\i\.jsxs\)\(\i\.ButtonWithTooltip,\{tooltipContent:\i\("imagine-upload-button\.tooltip"/,
                replace: ",$self.renderDownloadButton()$&",
            },
        },
    ],
});
