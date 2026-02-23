/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { React } from "@turbopack/common/react";
import { ClassNames } from "@turbopack/common/utils";
import type { HTMLAttributes, ReactNode } from "react";

export interface ParagraphProps extends HTMLAttributes<HTMLParagraphElement> {
    color?: "primary" | "secondary" | "muted";
    children?: ReactNode;
}

const colorClasses = {
    primary: "",
    secondary: "text-secondary",
    muted: "text-muted-foreground",
} as const;

export function Paragraph({ color = "secondary", className, children, ...props }: ParagraphProps) {
    return (
        <p className={ClassNames.cn("text-xs text-pretty", colorClasses[color], className)} {...props}>
            {children}
        </p>
    );
}
