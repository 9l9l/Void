/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type {
    ButtonProps,
    ButtonWithTooltipProps,
    CardProps,
    DialogContentProps,
    DialogHeaderProps,
    DialogProps,
    DropdownMenuItemProps,
    InputProps,
    MotionProps,
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
    SliderProps,
    SwitchProps,
    TooltipContentProps,
    TooltipProps,
    TooltipTriggerProps,
} from "@grok-types";
import type { ComponentType } from "react";

import { filters, findByProps, findByPropsLazy, findExportedComponent, waitFor } from "../turbopack";
import { type AnyComponent, LazyComponent } from "./react";

export type {
    ButtonProps,
    ButtonShape,
    ButtonSize,
    ButtonVariant,
    ButtonWithTooltipProps,
    CardProps,
    CardVariant,
    DialogCloseProps,
    DialogContentProps,
    DialogDescriptionProps,
    DialogFooterProps,
    DialogHeaderProps,
    DialogProps,
    DialogTitleProps,
    DropdownMenuItemProps,
    InputProps,
    MotionProps,
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
    SliderProps,
    SwitchProps,
    SwitchSize,
    ToastFn,
    ToastOptions,
    TooltipContentProps,
    TooltipProps,
    TooltipTriggerProps,
} from "@grok-types";

let buttonModule: Record<string, ComponentType> | null = null;

waitFor(filters.byProps("Button", "ButtonWithTooltipOptimized"), m => {
    buttonModule = m;
});

const buttonLazy = <T extends ComponentType<any>>(name: string) =>
    LazyComponent(name, () => (buttonModule?.[name] ?? findExportedComponent(name)) as any) as T;

export const Button = buttonLazy<ComponentType<ButtonProps>>("Button");
export const ButtonWithTooltip = buttonLazy<ComponentType<ButtonWithTooltipProps>>("ButtonWithTooltip");

export const Card: ComponentType<CardProps> = LazyComponent("Card", () => findExportedComponent("Card"));

let dialogModule: Record<string, ComponentType> | null = null;

waitFor(filters.byProps("Dialog", "DialogContent", "DialogHeader"), m => {
    dialogModule = m;
});

const dialogLazy = (name: string): AnyComponent => LazyComponent(name, () => (dialogModule?.[name] ?? findExportedComponent(name)) as AnyComponent | null);

export const Dialog: ComponentType<DialogProps> = dialogLazy("Dialog");
export const DialogContent: ComponentType<DialogContentProps> = dialogLazy("DialogContent");

export const DialogHeader: ComponentType<DialogHeaderProps> = dialogLazy("DialogHeader");
export const DialogTitle: ComponentType<RadixSubProps> = dialogLazy("DialogTitle");
export const DialogDescription: ComponentType<RadixSubProps> = dialogLazy("DialogDescription");
export const DialogFooter: ComponentType<RadixSubProps> = dialogLazy("DialogFooter");
export const DialogClose: ComponentType<RadixSubProps> = dialogLazy("DialogClose");

export const DropdownMenuItem: ComponentType<DropdownMenuItemProps> = LazyComponent("DropdownMenuItem", () => findExportedComponent("DropdownMenuItem"));

export const Input: ComponentType<InputProps> = LazyComponent("Input", () => findExportedComponent("Input"));

export const MotionDiv: ComponentType<MotionProps> = LazyComponent("MotionDiv", () => findByProps("motion")?.motion?.div);

export const Select: ComponentType<SelectProps> = LazyComponent("Select", () => findExportedComponent("Select"));
export const SelectTrigger: ComponentType<SelectTriggerProps> = LazyComponent("SelectTrigger", () => findExportedComponent("SelectTrigger"));
export const SelectContent: ComponentType<SelectContentProps> = LazyComponent("SelectContent", () => findExportedComponent("SelectContent"));
export const SelectItem: ComponentType<SelectItemProps> = LazyComponent("SelectItem", () => findExportedComponent("SelectItem"));
export const SelectValue: ComponentType<SelectValueProps> = LazyComponent("SelectValue", () => findExportedComponent("SelectValue"));

export const Separator: ComponentType<SeparatorProps> = LazyComponent("Separator", () => findExportedComponent("Separator"));

export const Slider: ComponentType<SliderProps> = LazyComponent("Slider", () => findExportedComponent("Slider"));

export const SettingsRow: ComponentType<SettingsRowProps> = LazyComponent("SettingsRow", () => findExportedComponent("SettingsRow"));
export const SettingsTitle: ComponentType<SettingsTitleProps> = LazyComponent("SettingsTitle", () => findExportedComponent("SettingsTitle"));
export const SettingsDescription: ComponentType<SettingsDescriptionProps> = LazyComponent("SettingsDescription", () => findExportedComponent("SettingsDescription"));

export const Switch: ComponentType<SwitchProps> = LazyComponent("Switch", () => findExportedComponent("Switch"));

export const Tooltip: ComponentType<TooltipProps> = LazyComponent("Tooltip", () => findExportedComponent("Tooltip"));
export const TooltipTrigger: ComponentType<TooltipTriggerProps> = LazyComponent("TooltipTrigger", () => findExportedComponent("TooltipTrigger"));
export const TooltipContent: ComponentType<TooltipContentProps> = LazyComponent("TooltipContent", () => findExportedComponent("TooltipContent"));

export const { toast } = findByPropsLazy("toast", "Toaster");

export const SidebarComponents = findByPropsLazy("Sidebar", "SidebarContent", "SidebarProvider");
export const AnimatePresence = LazyComponent("AnimatePresence", () => findExportedComponent("AnimatePresence"));
