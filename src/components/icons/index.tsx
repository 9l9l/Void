/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { React } from "@turbopack/common/react";

export interface IconProps {
    size?: number | string;
    className?: string;
}

const svg = (props: IconProps, ...children: React.ReactNode[]) => (
    <svg
        width={props.size ?? "1em"}
        height={props.size ?? "1em"}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.className}
    >
        {children}
    </svg>
);

export const BracesIcon = (props: IconProps = {}) =>
    svg(props,
        <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1" />,
        <path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1" />,
    );

export const ChromiumIcon = (props: IconProps = {}) =>
    svg(props,
        <path d="M10.88 21.94 15.46 14" />,
        <path d="M21.17 8H12" />,
        <path d="M3.95 6.06 8.54 14" />,
        <circle cx="12" cy="12" r="10" />,
        <circle cx="12" cy="12" r="4" />,
    );

export const CircleAlertIcon = (props: IconProps = {}) =>
    svg(props,
        <circle cx="12" cy="12" r="10" />,
        <line x1="12" x2="12" y1="8" y2="12" />,
        <line x1="12" x2="12.01" y1="16" y2="16" />,
    );

export const PaletteIcon = (props: IconProps = {}) =>
    svg(props,
        <path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" />,
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />,
        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />,
        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />,
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />,
    );

export const GaugeIcon = (props: IconProps = {}) =>
    svg(props,
        <path d="m12 14 4-4" />,
        <path d="M3.34 19a10 10 0 1 1 17.32 0" />,
    );

export const SearchIcon = (props: IconProps = {}) =>
    svg(props,
        <path d="m21 21-4.34-4.34" />,
        <circle cx="11" cy="11" r="8" />,
    );

export const TestTubeIcon = (props: IconProps = {}) =>
    svg(props,
        <path d="M21 7 6.82 21.18a2.83 2.83 0 0 1-3.99-.01a2.83 2.83 0 0 1 0-4L17 3" />,
        <path d="m16 2 6 6" />,
        <path d="M12 16H4" />,
    );

export const UnplugIcon = (props: IconProps = {}) =>
    svg(props,
        <path d="m19 5 3-3" />,
        <path d="m2 22 3-3" />,
        <path d="M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z" />,
        <path d="M7.5 13.5 10 11" />,
        <path d="M10.5 16.5 13 14" />,
        <path d="m12 6 6 6 2.3-2.3a2.4 2.4 0 0 0 0-3.4l-2.6-2.6a2.4 2.4 0 0 0-3.4 0Z" />,
    );
