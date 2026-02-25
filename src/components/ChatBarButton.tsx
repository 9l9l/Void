/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./ChatBarButton.css";

import { MotionButton, MotionDiv, Tooltip, TooltipContent, TooltipTrigger } from "@components";
import { AnimatePresence } from "@turbopack/common/components";
import { React, useState } from "@turbopack/common/react";
import { classNameFactory } from "@utils/css";
import type { CSSProperties, ReactNode } from "react";

const cl = classNameFactory("void-chatbar-btn-");

const EXPAND_TRANSITION = { duration: 0.2, ease: "easeOut" as const };
const EXPAND_ANIMATE = { width: "auto", opacity: 1 };
const COLLAPSE_ANIMATE = { width: 0, opacity: 0 };

export interface ChatBarButtonProps {
    icon: ReactNode;
    children?: ReactNode;
    tooltip?: ReactNode;
    onClick?: () => void;
    "aria-label"?: string;
    style?: CSSProperties;
    iconOnly?: boolean;
}

export function ChatBarButton({ icon, children, tooltip, onClick, style, iconOnly, "aria-label": ariaLabel }: ChatBarButtonProps) {
    const label = typeof tooltip === "string" ? tooltip : ariaLabel;
    const [mounted, setMounted] = useState(false);
    const showText = !iconOnly && !!children;

    React.useEffect(() => {
        if (showText) setMounted(true);
        return () => {};
    }, [showText]);

    const button = (
        <MotionButton type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={cl("root")} onClick={onClick} aria-label={label}>
            <div className={cl("inner", { "has-text": showText })} style={style}>
                {icon}
                {iconOnly != null ? (
                    <AnimatePresence>
                        {showText && (
                            <MotionDiv
                                initial={mounted ? COLLAPSE_ANIMATE : false}
                                animate={EXPAND_ANIMATE}
                                exit={COLLAPSE_ANIMATE}
                                transition={EXPAND_TRANSITION}
                                className={cl("text-wrap")}
                            >
                                {children}
                            </MotionDiv>
                        )}
                    </AnimatePresence>
                ) : (
                    children
                )}
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
