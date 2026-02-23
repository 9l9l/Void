/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type {
    ButtonProps,
    ButtonWithTooltipProps,
    CardContentProps,
    CardHeaderProps,
    CardProps,
    CardTitleProps,
    DialogContentProps,
    DialogHeaderProps,
    DialogProps,
    DropdownMenuContentProps,
    DropdownMenuItemProps,
    DropdownMenuProps,
    DropdownMenuTriggerProps,
    InputProps,
    LabelProps,
    MotionButtonProps,
    MotionProps,
    PopoverContentProps,
    PopoverProps,
    PopoverTriggerProps,
    RadixSubProps,
    SelectContentProps,
    SelectItemProps,
    SelectProps,
    SelectTriggerProps,
    SelectValueProps,
    SeparatorProps,
    SettingsDescriptionProps,
    SettingsRowProps,
    SettingsTitleProps,
    SwitchProps,
    TextareaProps,
    TooltipContentProps,
    TooltipProps,
    TooltipProviderProps,
    TooltipTriggerProps,
} from "@grok-types";
import type { ComponentType } from "react";

import { filters, findByProps, findByPropsLazy, findExportedComponent, waitFor } from "../turbopack";
import { LazyComponent } from "./react";

export type {
    ButtonProps,
    ButtonSize,
    ButtonVariant,
    ButtonWithTooltipProps,
    CardContentProps,
    CardHeaderProps,
    CardProps,
    CardTitleProps,
    CardVariant,
    DialogCloseProps,
    DialogContentProps,
    DialogDescriptionProps,
    DialogFooterProps,
    DialogHeaderProps,
    DialogProps,
    DialogTitleProps,
    DialogTriggerProps,
    DropdownMenuContentProps,
    DropdownMenuItemProps,
    DropdownMenuProps,
    DropdownMenuTriggerProps,
    InputProps,
    LabelProps,
    MotionButtonProps,
    MotionProps,
    PopoverContentProps,
    PopoverProps,
    PopoverTriggerProps,
    SelectContentPosition,
    SelectContentProps,
    SelectItemProps,
    SelectProps,
    SelectTriggerProps,
    SelectTriggerSize,
    SelectValueProps,
    SeparatorOrientation,
    SeparatorProps,
    SettingsDescriptionProps,
    SettingsRowProps,
    SettingsTitleProps,
    SwitchProps,
    SwitchSize,
    TextareaProps,
    TooltipContentProps,
    TooltipProps,
    TooltipProviderProps,
    TooltipTriggerProps,
} from "@grok-types";

// #region Button
export const Button: ComponentType<ButtonProps> = LazyComponent("Button", () => findExportedComponent("Button"));
export const ButtonWithTooltip: ComponentType<ButtonWithTooltipProps> = LazyComponent("ButtonWithTooltip", () => findExportedComponent("ButtonWithTooltip"));

// #region Card
export const Card: ComponentType<CardProps> = LazyComponent("Card", () => findExportedComponent("Card"));
export const CardHeader: ComponentType<CardHeaderProps> = LazyComponent("CardHeader", () => findExportedComponent("CardHeader"));
export const CardTitle: ComponentType<CardTitleProps> = LazyComponent("CardTitle", () => findExportedComponent("CardTitle"));
export const CardContent: ComponentType<CardContentProps> = LazyComponent("CardContent", () => findExportedComponent("CardContent"));

// #region Dialog (cached via waitFor for performance)
let dialogModule: Record<string, ComponentType> | null = null;

waitFor(filters.byProps("Dialog", "DialogContent", "DialogHeader"), m => {
    dialogModule = m;
});

type AnyComponent = ComponentType & Record<string, unknown>;
const dialogLazy = (name: string): AnyComponent => LazyComponent(name, () => (dialogModule?.[name] ?? findExportedComponent(name)) as AnyComponent | null);

export const Dialog: ComponentType<DialogProps> = dialogLazy("Dialog");
export const DialogTrigger: ComponentType<RadixSubProps> = dialogLazy("DialogTrigger");
export const DialogContent: ComponentType<DialogContentProps> = dialogLazy("DialogContent");
export const DialogHeader: ComponentType<DialogHeaderProps> = dialogLazy("DialogHeader");
export const DialogTitle: ComponentType<RadixSubProps> = dialogLazy("DialogTitle");
export const DialogDescription: ComponentType<RadixSubProps> = dialogLazy("DialogDescription");
export const DialogFooter: ComponentType<RadixSubProps> = dialogLazy("DialogFooter");
export const DialogClose: ComponentType<RadixSubProps> = dialogLazy("DialogClose");

// #region DropdownMenu
export const DropdownMenu: ComponentType<DropdownMenuProps> = LazyComponent("DropdownMenu", () => findExportedComponent("DropdownMenu"));
export const DropdownMenuTrigger: ComponentType<DropdownMenuTriggerProps> = LazyComponent("DropdownMenuTrigger", () => findExportedComponent("DropdownMenuTrigger"));
export const DropdownMenuContent: ComponentType<DropdownMenuContentProps> = LazyComponent("DropdownMenuContent", () => findExportedComponent("DropdownMenuContent"));
export const DropdownMenuItem: ComponentType<DropdownMenuItemProps> = LazyComponent("DropdownMenuItem", () => findExportedComponent("DropdownMenuItem"));

// #region Input
export const Input: ComponentType<InputProps> = LazyComponent("Input", () => findExportedComponent("Input"));

// #region Label
export const Label: ComponentType<LabelProps> = LazyComponent("Label", () => findExportedComponent("Label"));

// #region Motion (framer-motion)
export const MotionDiv: ComponentType<MotionProps> = LazyComponent("MotionDiv", () => findByProps("motion")?.motion?.div);
export const MotionButton: ComponentType<MotionButtonProps> = LazyComponent("MotionButton", () => findByProps("motion")?.motion?.button);
export const MotionSpan: ComponentType<MotionProps> = LazyComponent("MotionSpan", () => findByProps("motion")?.motion?.span);

// #region Popover
export const Popover: ComponentType<PopoverProps> = LazyComponent("Popover", () => findExportedComponent("Popover"));
export const PopoverTrigger: ComponentType<PopoverTriggerProps> = LazyComponent("PopoverTrigger", () => findExportedComponent("PopoverTrigger"));
export const PopoverContent: ComponentType<PopoverContentProps> = LazyComponent("PopoverContent", () => findExportedComponent("PopoverContent"));

// #region Select
export const Select: ComponentType<SelectProps> = LazyComponent("Select", () => findExportedComponent("Select"));
export const SelectTrigger: ComponentType<SelectTriggerProps> = LazyComponent("SelectTrigger", () => findExportedComponent("SelectTrigger"));
export const SelectContent: ComponentType<SelectContentProps> = LazyComponent("SelectContent", () => findExportedComponent("SelectContent"));
export const SelectItem: ComponentType<SelectItemProps> = LazyComponent("SelectItem", () => findExportedComponent("SelectItem"));
export const SelectValue: ComponentType<SelectValueProps> = LazyComponent("SelectValue", () => findExportedComponent("SelectValue"));

// #region Separator
export const Separator: ComponentType<SeparatorProps> = LazyComponent("Separator", () => findExportedComponent("Separator"));

// #region Settings
export const SettingsRow: ComponentType<SettingsRowProps> = LazyComponent("SettingsRow", () => findExportedComponent("SettingsRow"));
export const SettingsTitle: ComponentType<SettingsTitleProps> = LazyComponent("SettingsTitle", () => findExportedComponent("SettingsTitle"));
export const SettingsDescription: ComponentType<SettingsDescriptionProps> = LazyComponent("SettingsDescription", () => findExportedComponent("SettingsDescription"));

// #region Switch
export const Switch: ComponentType<SwitchProps> = LazyComponent("Switch", () => findExportedComponent("Switch"));

// #region Textarea
export const Textarea: ComponentType<TextareaProps> = LazyComponent("Textarea", () => findExportedComponent("Textarea"));

// #region Tooltip
export const Tooltip: ComponentType<TooltipProps> = LazyComponent("Tooltip", () => findExportedComponent("Tooltip"));
export const TooltipTrigger: ComponentType<TooltipTriggerProps> = LazyComponent("TooltipTrigger", () => findExportedComponent("TooltipTrigger"));
export const TooltipContent: ComponentType<TooltipContentProps> = LazyComponent("TooltipContent", () => findExportedComponent("TooltipContent"));
export const TooltipProvider: ComponentType<TooltipProviderProps> = LazyComponent("TooltipProvider", () => findExportedComponent("TooltipProvider"));

// #region Extra (not part of @components barrel, available for direct import)
export const SidebarComponents = findByPropsLazy("Sidebar", "SidebarContent", "SidebarProvider");
export const DrawerComponents = findByPropsLazy("Drawer", "DrawerContent");
export const Avatar = LazyComponent("Avatar", () => findExportedComponent("Avatar"));
export const Presence = LazyComponent("Presence", () => findExportedComponent("Presence"));
export const Icon = LazyComponent("Icon", () => findExportedComponent("Icon"));
export const AnimatePresence = LazyComponent("AnimatePresence", () => findExportedComponent("AnimatePresence"));
