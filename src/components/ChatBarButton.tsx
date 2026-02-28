/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ButtonWithTooltip, Flex, MotionDiv } from "@components";
import { AnimatePresence } from "@turbopack/common/components";
import { React, useEffect, useReducedMotion, useRef } from "@turbopack/common/react";
import { classes } from "@utils/css";
import type { ReactNode } from "react";

const EXPAND = { width: "auto", opacity: 1 };
const COLLAPSE = { width: 0, opacity: 0 };
const TRANSITION = { duration: 0.2, ease: "easeOut" as const };

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
    const reducedMotion = useReducedMotion();
    const hasShownText = useRef(false);
    const showText = !iconOnly && !!children;

    useEffect(() => {
        if (showText) hasShownText.current = true;
    }, [showText]);

    return (
        <ButtonWithTooltip
            variant="none"
            size="none"
            className="group flex flex-col justify-center rounded-full focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            tooltipContent={tooltip}
            tooltipProps={{ delayDuration: 600 }}
            tooltipContentProps={{ side: "top" }}
            onClick={onClick}
            aria-label={label}
        >
            <Flex
                alignItems="center"
                justifyContent="center"
                gap={showText ? "0.375rem" : "0.125rem"}
                className={classes(
                    "h-10 relative",
                    "rounded-full ring-1 ring-inset transition-colors duration-150 ease-out",
                    "text-fg-primary ring-border-l1 hover:bg-surface-l3",
                    showText ? "px-2.5 text-xs font-medium tabular-nums" : "aspect-square",
                    className,
                )}
            >
                {icon}
                {iconOnly != null ? (
                    <AnimatePresence>
                        {showText && (
                            <MotionDiv
                                initial={reducedMotion || !hasShownText.current ? false : COLLAPSE}
                                animate={EXPAND}
                                exit={COLLAPSE}
                                transition={reducedMotion ? { duration: 0 } : TRANSITION}
                                className="flex items-center overflow-hidden whitespace-nowrap"
                            >
                                {children}
                            </MotionDiv>
                        )}
                    </AnimatePresence>
                ) : children}
            </Flex>
        </ButtonWithTooltip>
    );
}
