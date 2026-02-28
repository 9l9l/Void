/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./ChatBarButton.css";

import { MotionButton, MotionDiv, Tooltip, TooltipContent, TooltipTrigger } from "@components";
import { AnimatePresence } from "@turbopack/common/components";
import { React, useState } from "@turbopack/common/react";
import { classes, classNameFactory } from "@utils/css";
import type { ReactNode } from "react";

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
    className?: string;
    iconOnly?: boolean;
}

export function ChatBarButton({ icon, children, tooltip, onClick, className, iconOnly, "aria-label": ariaLabel }: ChatBarButtonProps) {
    const label = typeof tooltip === "string" ? tooltip : ariaLabel;
    const [mounted, setMounted] = useState(false);
    const showText = !iconOnly && !!children;

    React.useEffect(() => {
        if (showText) setMounted(true);
    }, [showText]);

    const button = (
        <MotionButton type="button" whileTap={{ scale: 0.97 }} className="group flex flex-col justify-center rounded-full focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" onClick={onClick} aria-label={label}>
            <div className={classes(
                "h-10 relative flex items-center justify-center",
                "rounded-full ring-1 ring-inset transition-colors duration-150 ease-out",
                "text-fg-primary ring-border-l1 hover:bg-surface-l3",
                showText ? "px-2.5 gap-1.5 text-xs font-medium tabular-nums" : "aspect-square gap-0.5",
                className,
            )}>
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
