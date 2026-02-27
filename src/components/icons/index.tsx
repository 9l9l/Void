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

export const CopyIcon = (props: IconProps = {}) =>
    svg(props,
        <rect x="3" y="8" width="13" height="13" rx="4" stroke="currentColor" />,
        <path fillRule="evenodd" clipRule="evenodd" d="M13 2.00004L12.8842 2.00002C12.0666 1.99982 11.5094 1.99968 11.0246 2.09611C9.92585 2.31466 8.95982 2.88816 8.25008 3.69274C7.90896 4.07944 7.62676 4.51983 7.41722 5.00004H9.76392C10.189 4.52493 10.7628 4.18736 11.4147 4.05768C11.6802 4.00488 12.0228 4.00004 13 4.00004H14.6C15.7366 4.00004 16.5289 4.00081 17.1458 4.05121C17.7509 4.10066 18.0986 4.19283 18.362 4.32702C18.9265 4.61464 19.3854 5.07358 19.673 5.63807C19.8072 5.90142 19.8994 6.24911 19.9488 6.85428C19.9992 7.47112 20 8.26343 20 9.40004V11C20 11.9773 19.9952 12.3199 19.9424 12.5853C19.8127 13.2373 19.4748 13.8114 19 14.2361V16.5829C20.4795 15.9374 21.5804 14.602 21.9039 12.9755C22.0004 12.4907 22.0002 11.9334 22 11.1158L22 11V9.40004V9.35725C22 8.27346 22 7.3993 21.9422 6.69141C21.8826 5.96256 21.7568 5.32238 21.455 4.73008C20.9757 3.78927 20.2108 3.02437 19.27 2.545C18.6777 2.24322 18.0375 2.1174 17.3086 2.05785C16.6007 2.00002 15.7266 2.00003 14.6428 2.00004L14.6 2.00004H13Z" fill="currentColor" />,
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

export const TrashIcon = (props: IconProps = {}) =>
    svg(props,
        <path d="M10 11v6" />,
        <path d="M14 11v6" />,
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />,
        <path d="M3 6h18" />,
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />,
    );

export const TestTubeIcon = (props: IconProps = {}) =>
    svg(props,
        <path d="M21 7 6.82 21.18a2.83 2.83 0 0 1-3.99-.01a2.83 2.83 0 0 1 0-4L17 3" />,
        <path d="m16 2 6 6" />,
        <path d="M12 16H4" />,
    );

export const TelescopeIcon = (props: IconProps = {}) =>
    svg(props,
        <path d="m10.065 12.493-6.18 1.318a.934.934 0 0 1-1.108-.702l-.537-2.15a1.07 1.07 0 0 1 .691-1.265l13.504-4.44" />,
        <path d="m13.56 11.747 4.332-.924" />,
        <path d="m16 21-3.105-6.21" />,
        <path d="M16.485 5.94a2 2 0 0 1 1.455-2.425l1.09-.272a1 1 0 0 1 1.212.727l1.515 6.06a1 1 0 0 1-.727 1.213l-1.09.272a2 2 0 0 1-2.425-1.455z" />,
        <path d="m6.158 8.633 1.114 4.456" />,
        <path d="m8 21 3.105-6.21" />,
        <circle cx="12" cy="13" r="2" />,
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
