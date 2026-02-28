/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { React } from "@turbopack/common/react";
import { ClassNames } from "@turbopack/common/utils";
import type { HTMLAttributes, ReactNode } from "react";

export type ChipVariant = "default" | "secondary" | "destructive" | "outline";

export interface ChipProps extends HTMLAttributes<HTMLDivElement> {
    variant?: ChipVariant;
    children?: ReactNode;
}

const BASE = "inline-flex items-center rounded-full border border-input-border px-2 py-0.5 text-[10px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

const variantClasses = {
    default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
    secondary: "bg-popover border-border-l1 text-fg-secondary-foreground hover:bg-popover/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
    outline: "text-secondary",
} as const satisfies Record<ChipVariant, string>;

export function Chip({ variant = "secondary", className, children, ...props }: ChipProps) {
    return (
        <div className={ClassNames.cn(BASE, variantClasses[variant], className)} {...props}>
            {children}
        </div>
    );
}
