/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./ChatBarButton.css";

import { MotionButton, Tooltip, TooltipContent, TooltipTrigger } from "@components";
import { React } from "@turbopack/common/react";
import { classNameFactory } from "@utils/css";
import type { CSSProperties, ReactNode } from "react";

const cl = classNameFactory("void-chatbar-btn-");

export interface ChatBarButtonProps {
    icon: ReactNode;
    children?: ReactNode;
    tooltip?: ReactNode;
    onClick?: () => void;
    "aria-label"?: string;
    style?: CSSProperties;
}

export function ChatBarButton({ icon, children, tooltip, onClick, style, "aria-label": ariaLabel }: ChatBarButtonProps) {
    const label = typeof tooltip === "string" ? tooltip : ariaLabel;
    const button = (
        <MotionButton type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={cl("root")} onClick={onClick} aria-label={label}>
            <div className={cl("inner", { "has-text": !!children })} style={style}>
                {icon}
                {children}
            </div>
        </MotionButton>
    );

    if (!tooltip) return button;

    return (
        <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent side="top">{tooltip}</TooltipContent>
        </Tooltip>
    );
}
