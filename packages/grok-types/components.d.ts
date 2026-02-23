/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { ComponentType, CSSProperties, ReactNode } from "react";

// #region Common Radix props

export type Side = "top" | "right" | "bottom" | "left";
export type Align = "start" | "center" | "end";

export interface RadixContentProps {
    side?: Side;
    align?: Align;
    sideOffset?: number;
    className?: string;
    children?: ReactNode;
    [key: string]: any;
}

export interface RadixTriggerProps {
    asChild?: boolean;
    children?: ReactNode;
    [key: string]: any;
}

export interface RadixRootProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: ReactNode;
    [key: string]: any;
}

export interface RadixSubProps {
    className?: string;
    children?: ReactNode;
    [key: string]: any;
}

// #endregion

// #region Button

export type ButtonVariant =
    | "filled"
    | "filledSecondary"
    | "outline"
    | "ghost"
    | "ghostSecondary"
    | "text"
    | "textSecondary"
    | "sticky"
    | "primary"
    | "secondary"
    | "accent"
    | "card"
    | "destructive"
    | "link"
    | "none";

export type ButtonSize = "xxs" | "xs" | "sm" | "md" | "lg" | "iconXs" | "iconSm" | "iconMd" | "iconLg" | "iconXl" | "icon" | "pill" | "nav" | "default" | "noPadding" | "none";

export interface ButtonProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    rounded?: boolean;
    btnColor?: "default" | "danger";
    overideIconStyle?: boolean;
    asChild?: boolean;
    disabled?: boolean;
    className?: string;
    title?: string;
    tabIndex?: number;
    onClick?: (e: React.MouseEvent) => void;
    children?: ReactNode;
    [key: string]: any;
}

export interface ButtonWithTooltipProps extends ButtonProps {
    tooltipContent?: ReactNode;
    tooltipContentProps?: Record<string, any>;
    tooltipProps?: Record<string, any>;
    stayOpenOnClick?: boolean;
}

export type Button = ComponentType<ButtonProps>;
export type ButtonWithTooltip = ComponentType<ButtonWithTooltipProps>;

// #endregion

// #region Dialog (Radix Dialog)

export interface DialogProps extends RadixRootProps {
    modal?: boolean;
}

export interface DialogContentProps {
    className?: string;
    overlayClassname?: string;
    analyticsName?: string;
    children?: ReactNode;
    onInteractOutside?: (e: Event) => void;
    onEscapeKeyDown?: (e: KeyboardEvent) => void;
    onCloseAutoFocus?: (e: Event) => void;
    [key: string]: any;
}

export interface DialogHeaderProps extends RadixSubProps {}
export interface DialogFooterProps extends RadixSubProps {}
export interface DialogTitleProps extends RadixSubProps {}
export interface DialogDescriptionProps extends RadixSubProps {}
export interface DialogCloseProps extends RadixSubProps {}
export interface DialogTriggerProps extends RadixSubProps {}
export interface DialogOverlayProps extends RadixSubProps {}

export type Dialog = ComponentType<DialogProps>;
export type DialogContent = ComponentType<DialogContentProps>;
export type DialogHeader = ComponentType<DialogHeaderProps>;
export type DialogFooter = ComponentType<DialogFooterProps>;
export type DialogTitle = ComponentType<DialogTitleProps>;
export type DialogDescription = ComponentType<DialogDescriptionProps>;
export type DialogClose = ComponentType<DialogCloseProps>;
export type DialogTrigger = ComponentType<DialogTriggerProps>;
export type DialogOverlay = ComponentType<DialogOverlayProps>;

// #endregion

// #region Select (Radix Select)

export interface SelectProps {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    dir?: "ltr" | "rtl";
    children?: ReactNode;
    [key: string]: any;
}

export type SelectTriggerSize = "default" | "sm";

export interface SelectTriggerProps {
    className?: string;
    size?: SelectTriggerSize;
    asChild?: boolean;
    children?: ReactNode;
    [key: string]: any;
}

export type SelectContentPosition = "popper" | "item-aligned";

export interface SelectContentProps {
    className?: string;
    position?: SelectContentPosition;
    showScrollButtons?: boolean;
    children?: ReactNode;
    [key: string]: any;
}

export interface SelectItemProps {
    value: string;
    disabled?: boolean;
    asChild?: boolean;
    className?: string;
    children?: ReactNode;
    [key: string]: any;
}

export interface SelectValueProps {
    placeholder?: string;
    children?: ReactNode;
    [key: string]: any;
}

export type Select = ComponentType<SelectProps>;
export type SelectTrigger = ComponentType<SelectTriggerProps>;
export type SelectContent = ComponentType<SelectContentProps>;
export type SelectItem = ComponentType<SelectItemProps>;
export type SelectValue = ComponentType<SelectValueProps>;

// #endregion

// #region Switch (Radix Switch)

export type SwitchSize = "default" | "sm";

export interface SwitchProps {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
    required?: boolean;
    name?: string;
    value?: string;
    size?: SwitchSize;
    className?: string;
    [key: string]: any;
}

export type Switch = ComponentType<SwitchProps>;

// #endregion

// #region Tooltip (Radix Tooltip)

export interface TooltipProviderProps {
    delayDuration?: number;
    skipDelayDuration?: number;
    disableHoverableContent?: boolean;
    children?: ReactNode;
    [key: string]: any;
}

export interface TooltipProps extends RadixRootProps {
    delayDuration?: number;
}

export interface TooltipTriggerProps extends RadixTriggerProps {}

export interface TooltipContentProps extends RadixContentProps {
    disableAnimation?: boolean;
    container?: HTMLElement | null;
}

export type TooltipProvider = ComponentType<TooltipProviderProps>;
export type Tooltip = ComponentType<TooltipProps>;
export type TooltipTrigger = ComponentType<TooltipTriggerProps>;
export type TooltipContent = ComponentType<TooltipContentProps>;

// #endregion

// #region Popover (Radix Popover)

export interface PopoverProps extends RadixRootProps {}

export interface PopoverTriggerProps extends RadixTriggerProps {
    hoverOpen?: boolean;
}

export interface PopoverContentProps extends RadixContentProps {
    hoverOpen?: boolean;
    closeOnClick?: boolean;
}

export type Popover = ComponentType<PopoverProps>;
export type PopoverTrigger = ComponentType<PopoverTriggerProps>;
export type PopoverContent = ComponentType<PopoverContentProps>;

// #endregion

// #region DropdownMenu (Radix DropdownMenu)

export interface DropdownMenuProps extends RadixRootProps {}
export interface DropdownMenuTriggerProps extends RadixTriggerProps {}

export interface DropdownMenuContentProps extends RadixContentProps {
    collisionPadding?: number | Partial<Record<Side, number>>;
}

export interface DropdownMenuItemProps {
    onSelect?: (e: Event) => void;
    disabled?: boolean;
    inset?: boolean;
    className?: string;
    children?: ReactNode;
    [key: string]: any;
}

export type IndicatorPosition = "start" | "end";

export interface DropdownMenuCheckboxItemProps {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    indicatorPosition?: IndicatorPosition;
    disabled?: boolean;
    className?: string;
    children?: ReactNode;
    [key: string]: any;
}

export type IndicatorType = "circle" | "check";

export interface DropdownMenuRadioItemProps {
    value: string;
    indicatorPosition?: IndicatorPosition;
    indicatorType?: IndicatorType;
    disabled?: boolean;
    className?: string;
    children?: ReactNode;
    [key: string]: any;
}

export interface DropdownMenuRadioGroupProps {
    value?: string;
    onValueChange?: (value: string) => void;
    children?: ReactNode;
    [key: string]: any;
}

export interface DropdownMenuSubProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: ReactNode;
    [key: string]: any;
}

export interface DropdownMenuSubTriggerProps {
    inset?: boolean;
    className?: string;
    children?: ReactNode;
    [key: string]: any;
}

export interface DropdownMenuSubContentProps extends RadixContentProps {}

export interface DropdownMenuSeparatorProps {
    className?: string;
    [key: string]: any;
}

export type DropdownMenu = ComponentType<DropdownMenuProps>;
export type DropdownMenuTrigger = ComponentType<DropdownMenuTriggerProps>;
export type DropdownMenuContent = ComponentType<DropdownMenuContentProps>;
export type DropdownMenuItem = ComponentType<DropdownMenuItemProps>;
export type DropdownMenuCheckboxItem = ComponentType<DropdownMenuCheckboxItemProps>;
export type DropdownMenuRadioItem = ComponentType<DropdownMenuRadioItemProps>;
export type DropdownMenuRadioGroup = ComponentType<DropdownMenuRadioGroupProps>;
export type DropdownMenuSub = ComponentType<DropdownMenuSubProps>;
export type DropdownMenuSubTrigger = ComponentType<DropdownMenuSubTriggerProps>;
export type DropdownMenuSubContent = ComponentType<DropdownMenuSubContentProps>;
export type DropdownMenuSeparator = ComponentType<DropdownMenuSeparatorProps>;

// #endregion

// #region Card

export type CardVariant = "default" | "ghost";

export interface CardProps {
    variant?: CardVariant;
    className?: string;
    children?: ReactNode;
    [key: string]: any;
}

export interface CardHeaderProps extends RadixSubProps {}
export interface CardTitleProps extends RadixSubProps {}
export interface CardContentProps extends RadixSubProps {}

export type Card = ComponentType<CardProps>;
export type CardHeader = ComponentType<CardHeaderProps>;
export type CardTitle = ComponentType<CardTitleProps>;
export type CardContent = ComponentType<CardContentProps>;

// #endregion

// #region Input

export interface InputProps {
    type?: string;
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    [key: string]: any;
}

export type Input = ComponentType<InputProps>;

// #endregion

// #region Textarea

export interface TextareaProps {
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    rows?: number;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    [key: string]: any;
}

export type Textarea = ComponentType<TextareaProps>;

// #endregion

// #region Label

export interface LabelProps {
    htmlFor?: string;
    className?: string;
    children?: ReactNode;
    [key: string]: any;
}

export type Label = ComponentType<LabelProps>;

// #endregion

// #region Separator (Radix Separator)

export type SeparatorOrientation = "horizontal" | "vertical";

export interface SeparatorProps {
    orientation?: SeparatorOrientation;
    decorative?: boolean;
    className?: string;
    [key: string]: any;
}

export type Separator = ComponentType<SeparatorProps>;

// #endregion

// #region Settings

export interface SettingsRowProps {
    action?: ReactNode;
    hidden?: boolean;
    className?: string;
    children?: ReactNode;
    [key: string]: any;
}

export interface SettingsTitleProps {
    className?: string;
    children?: ReactNode;
    [key: string]: any;
}

export interface SettingsDescriptionProps {
    children?: ReactNode;
    [key: string]: any;
}

export type SettingsRow = ComponentType<SettingsRowProps>;
export type SettingsTitle = ComponentType<SettingsTitleProps>;
export type SettingsDescription = ComponentType<SettingsDescriptionProps>;

// #endregion

// #region Avatar

export interface AvatarProps {
    className?: string;
    textClassName?: string;
    user?: {
        givenName?: string;
        familyName?: string;
        profileImageUrl?: string;
    };
    fallbackText?: string;
    [key: string]: any;
}

export type Avatar = ComponentType<AvatarProps>;

// #endregion

// #region Presence

export interface PresenceProps {
    present: boolean;
    children: ReactNode | ((props: { present: boolean }) => ReactNode);
}

export type Presence = ComponentType<PresenceProps>;

// #endregion

// #region Drawer (Vaul Drawer)

export interface DrawerProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    shouldScaleBackground?: boolean;
    dismissible?: boolean;
    modal?: boolean;
    children?: ReactNode;
    [key: string]: any;
}

export interface DrawerContentProps {
    className?: string;
    overlayClassName?: string;
    disableDrag?: boolean;
    analyticsName?: string;
    children?: ReactNode;
    onInteractOutside?: (e: Event) => void;
    onEscapeKeyDown?: (e: KeyboardEvent) => void;
    [key: string]: any;
}

export interface DrawerHeaderProps extends RadixSubProps {}
export interface DrawerFooterProps extends RadixSubProps {}
export interface DrawerTitleProps extends RadixSubProps {}
export interface DrawerDescriptionProps extends RadixSubProps {}
export interface DrawerTriggerProps extends RadixSubProps {}

export type Drawer = ComponentType<DrawerProps>;
export type DrawerContent = ComponentType<DrawerContentProps>;
export type DrawerHeader = ComponentType<DrawerHeaderProps>;
export type DrawerFooter = ComponentType<DrawerFooterProps>;
export type DrawerTitle = ComponentType<DrawerTitleProps>;
export type DrawerDescription = ComponentType<DrawerDescriptionProps>;
export type DrawerTrigger = ComponentType<DrawerTriggerProps>;

// #endregion

// #region ResponsiveDialog (Dialog on desktop, Drawer on mobile)

export interface ResponsiveDialogProps {
    open?: boolean;
    setOpen?: (open: boolean) => void;
    onClose?: () => void;
    onBack?: () => void;
    trigger?: ReactNode;
    title?: ReactNode;
    description?: ReactNode;
    header?: ReactNode;
    footer?: ReactNode;
    children?: ReactNode;
    contentClassName?: string;
    headerClassName?: string;
    footerClassName?: string;
    titleClassName?: string;
    descriptionClassName?: string;
    overlayClassName?: string;
    blurBackground?: boolean;
    onInteractOutside?: (e: Event) => void;
    onEscapeKeyDown?: (e: KeyboardEvent) => void;
    modal?: boolean;
    analyticsName?: string;
    [key: string]: any;
}

export type ResponsiveDialog = ComponentType<ResponsiveDialogProps>;

// #endregion

// #region Sidebar

export type SidebarSide = "left" | "right";
export type SidebarVariant = "sidebar" | "floating" | "inset";
export type SidebarCollapsible = "offcanvas" | "icon" | "none";
export type SidebarState = "expanded" | "collapsed";

export interface SidebarContextValue {
    state: SidebarState;
    open: boolean;
    setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
    isMobile: boolean;
    openMobile: boolean;
    setOpenMobile: (open: boolean) => void;
    toggleSidebar: () => void;
    contentWidthClass: string;
}

export interface SidebarProviderProps {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
    [key: string]: any;
}

export interface SidebarProps {
    side?: SidebarSide;
    variant?: SidebarVariant;
    collapsible?: SidebarCollapsible;
    className?: string;
    children?: ReactNode;
    [key: string]: any;
}

export interface SidebarTriggerProps {
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
    iconSize?: number;
    [key: string]: any;
}

export interface SidebarMenuButtonProps {
    tooltip?: ReactNode;
    safeArea?: boolean;
    asChild?: boolean;
    isActive?: boolean;
    variant?: "default" | "outline";
    size?: "default" | "sm" | "lg";
    className?: string;
    children?: ReactNode;
    [key: string]: any;
}

export interface SidebarGroupLabelProps {
    asChild?: boolean;
    className?: string;
    children?: ReactNode;
    [key: string]: any;
}

export type SidebarProvider = ComponentType<SidebarProviderProps>;
export type Sidebar = ComponentType<SidebarProps>;
export type SidebarContent = ComponentType<RadixSubProps>;
export type SidebarHeader = ComponentType<RadixSubProps>;
export type SidebarFooter = ComponentType<RadixSubProps>;
export type SidebarGroup = ComponentType<RadixSubProps>;
export type SidebarGroupLabel = ComponentType<SidebarGroupLabelProps>;
export type SidebarGroupAction = ComponentType<RadixSubProps>;
export type SidebarGroupContent = ComponentType<RadixSubProps>;
export type SidebarMenu = ComponentType<RadixSubProps>;
export type SidebarMenuItem = ComponentType<RadixSubProps>;
export type SidebarMenuButton = ComponentType<SidebarMenuButtonProps>;
export type SidebarMenuAction = ComponentType<RadixSubProps>;
export type SidebarMenuBadge = ComponentType<RadixSubProps>;
export type SidebarMenuSkeleton = ComponentType<RadixSubProps>;
export type SidebarMenuSub = ComponentType<RadixSubProps>;
export type SidebarMenuSubItem = ComponentType<RadixSubProps>;
export type SidebarMenuSubButton = ComponentType<RadixSubProps>;
export type SidebarInput = ComponentType<RadixSubProps>;
export type SidebarInset = ComponentType<RadixSubProps>;
export type SidebarRail = ComponentType<RadixSubProps>;
export type SidebarSeparator = ComponentType<RadixSubProps>;
export type SidebarTrigger = ComponentType<SidebarTriggerProps>;

// #endregion

// #region Motion (framer-motion)

export interface MotionProps {
    whileHover?: Record<string, any>;
    whileTap?: Record<string, any>;
    whileFocus?: Record<string, any>;
    initial?: Record<string, any> | false;
    animate?: Record<string, any>;
    exit?: Record<string, any>;
    transition?: Record<string, any>;
    variants?: Record<string, any>;
    className?: string;
    style?: CSSProperties;
    onClick?: (e: React.MouseEvent) => void;
    children?: ReactNode;
    [key: string]: any;
}

export interface MotionButtonProps extends MotionProps {
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    "aria-label"?: string;
}

// #endregion

// #region AnimatePresence (framer-motion)

export interface AnimatePresenceProps {
    initial?: boolean;
    mode?: "sync" | "wait" | "popLayout";
    onExitComplete?: () => void;
    children?: ReactNode;
}

export type AnimatePresence = ComponentType<AnimatePresenceProps>;

// #endregion
