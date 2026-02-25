/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type {
    AccordionContentProps,
    AccordionItemProps,
    AccordionProps,
    AccordionTriggerProps,
    ButtonProps,
    ButtonWithTooltipProps,
    CardContentProps,
    CardHeaderProps,
    CardProps,
    CardTitleProps,
    CheckboxProps,
    DialogContentProps,
    DialogHeaderProps,
    DialogProps,
    DropdownMenuContentProps,
    DropdownMenuItemProps,
    DropdownMenuProps,
    DropdownMenuTriggerProps,
    HoverCardContentProps,
    HoverCardProps,
    HoverCardTriggerProps,
    InputProps,
    LabelProps,
    MarkdownProps,
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
    SpinnerProps,
    SwitchProps,
    TabsContentProps,
    TabsListProps,
    TabsProps,
    TabsTriggerProps,
    TextareaProps,
    ToggleGroupItemProps,
    ToggleGroupProps,
    TooltipContentProps,
    TooltipProps,
    TooltipProviderProps,
    TooltipTriggerProps,
} from "@grok-types";
import type { ComponentType } from "react";

import { filters, findByProps, findByPropsLazy, findExportedComponent, waitFor } from "../turbopack";
import { LazyComponent } from "./react";

export type {
    AccordionContentProps,
    AccordionItemProps,
    AccordionProps,
    AccordionTriggerProps,
    ButtonProps,
    ButtonSize,
    ButtonVariant,
    ButtonWithTooltipProps,
    CardContentProps,
    CardHeaderProps,
    CardProps,
    CardTitleProps,
    CardVariant,
    CheckboxProps,
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
    HoverCardContentProps,
    HoverCardProps,
    HoverCardTriggerProps,
    InputProps,
    LabelProps,
    MarkdownProps,
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
    SpinnerProps,
    SpinnerSize,
    SwitchProps,
    SwitchSize,
    TabsContentProps,
    TabsListProps,
    TabsProps,
    TabsTriggerProps,
    TabsTriggerVariant,
    TextareaProps,
    ToastFn,
    ToastOptions,
    ToggleGroupItemProps,
    ToggleGroupProps,
    TooltipContentProps,
    TooltipProps,
    TooltipProviderProps,
    TooltipTriggerProps,
} from "@grok-types";

export const Button: ComponentType<ButtonProps> = LazyComponent("Button", () => findExportedComponent("Button"));
export const ButtonWithTooltip: ComponentType<ButtonWithTooltipProps> = LazyComponent("ButtonWithTooltip", () => findExportedComponent("ButtonWithTooltip"));
export const Checkbox: ComponentType<CheckboxProps> = LazyComponent("Checkbox", () => findExportedComponent("Checkbox"));

export const Card: ComponentType<CardProps> = LazyComponent("Card", () => findExportedComponent("Card"));
export const CardHeader: ComponentType<CardHeaderProps> = LazyComponent("CardHeader", () => findExportedComponent("CardHeader"));
export const CardTitle: ComponentType<CardTitleProps> = LazyComponent("CardTitle", () => findExportedComponent("CardTitle"));
export const CardContent: ComponentType<CardContentProps> = LazyComponent("CardContent", () => findExportedComponent("CardContent"));

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

export const DropdownMenu: ComponentType<DropdownMenuProps> = LazyComponent("DropdownMenu", () => findExportedComponent("DropdownMenu"));
export const DropdownMenuTrigger: ComponentType<DropdownMenuTriggerProps> = LazyComponent("DropdownMenuTrigger", () => findExportedComponent("DropdownMenuTrigger"));
export const DropdownMenuContent: ComponentType<DropdownMenuContentProps> = LazyComponent("DropdownMenuContent", () => findExportedComponent("DropdownMenuContent"));
export const DropdownMenuItem: ComponentType<DropdownMenuItemProps> = LazyComponent("DropdownMenuItem", () => findExportedComponent("DropdownMenuItem"));

export const Input: ComponentType<InputProps> = LazyComponent("Input", () => findExportedComponent("Input"));

export const Label: ComponentType<LabelProps> = LazyComponent("Label", () => findExportedComponent("Label"));

export const MotionDiv: ComponentType<MotionProps> = LazyComponent("MotionDiv", () => findByProps("motion")?.motion?.div);
export const MotionButton: ComponentType<MotionButtonProps> = LazyComponent("MotionButton", () => findByProps("motion")?.motion?.button);
export const MotionSpan: ComponentType<MotionProps> = LazyComponent("MotionSpan", () => findByProps("motion")?.motion?.span);

export const Popover: ComponentType<PopoverProps> = LazyComponent("Popover", () => findExportedComponent("Popover"));
export const PopoverTrigger: ComponentType<PopoverTriggerProps> = LazyComponent("PopoverTrigger", () => findExportedComponent("PopoverTrigger"));
export const PopoverContent: ComponentType<PopoverContentProps> = LazyComponent("PopoverContent", () => findExportedComponent("PopoverContent"));

export const Select: ComponentType<SelectProps> = LazyComponent("Select", () => findExportedComponent("Select"));
export const SelectTrigger: ComponentType<SelectTriggerProps> = LazyComponent("SelectTrigger", () => findExportedComponent("SelectTrigger"));
export const SelectContent: ComponentType<SelectContentProps> = LazyComponent("SelectContent", () => findExportedComponent("SelectContent"));
export const SelectItem: ComponentType<SelectItemProps> = LazyComponent("SelectItem", () => findExportedComponent("SelectItem"));
export const SelectValue: ComponentType<SelectValueProps> = LazyComponent("SelectValue", () => findExportedComponent("SelectValue"));

export const Separator: ComponentType<SeparatorProps> = LazyComponent("Separator", () => findExportedComponent("Separator"));

export const SettingsRow: ComponentType<SettingsRowProps> = LazyComponent("SettingsRow", () => findExportedComponent("SettingsRow"));
export const SettingsTitle: ComponentType<SettingsTitleProps> = LazyComponent("SettingsTitle", () => findExportedComponent("SettingsTitle"));
export const SettingsDescription: ComponentType<SettingsDescriptionProps> = LazyComponent("SettingsDescription", () => findExportedComponent("SettingsDescription"));

export const Switch: ComponentType<SwitchProps> = LazyComponent("Switch", () => findExportedComponent("Switch"));

export const Textarea: ComponentType<TextareaProps> = LazyComponent("Textarea", () => findExportedComponent("Textarea"));

export const Tooltip: ComponentType<TooltipProps> = LazyComponent("Tooltip", () => findExportedComponent("Tooltip"));
export const TooltipTrigger: ComponentType<TooltipTriggerProps> = LazyComponent("TooltipTrigger", () => findExportedComponent("TooltipTrigger"));
export const TooltipContent: ComponentType<TooltipContentProps> = LazyComponent("TooltipContent", () => findExportedComponent("TooltipContent"));
export const TooltipProvider: ComponentType<TooltipProviderProps> = LazyComponent("TooltipProvider", () => findExportedComponent("TooltipProvider"));

let tabsModule: Record<string, ComponentType> | null = null;

waitFor(filters.byProps("Tabs", "TabsList", "TabsTrigger", "TabsContent"), m => {
    tabsModule = m;
});

const tabsLazy = <T extends ComponentType<any>>(name: string) => LazyComponent(name, () => (tabsModule?.[name] ?? findExportedComponent(name)) as any) as T;

export const Tabs = tabsLazy<ComponentType<TabsProps>>("Tabs");
export const TabsList = tabsLazy<ComponentType<TabsListProps>>("TabsList");
export const TabsTrigger = tabsLazy<ComponentType<TabsTriggerProps>>("TabsTrigger");
export const TabsContent = tabsLazy<ComponentType<TabsContentProps>>("TabsContent");

let accordionModule: Record<string, ComponentType> | null = null;

waitFor(filters.byProps("Accordion", "AccordionContent", "AccordionItem", "AccordionTrigger"), m => {
    accordionModule = m;
});

const accordionLazy = <T extends ComponentType<any>>(name: string) => LazyComponent(name, () => (accordionModule?.[name] ?? findExportedComponent(name)) as any) as T;

export const Accordion = accordionLazy<ComponentType<AccordionProps>>("Accordion");
export const AccordionItem = accordionLazy<ComponentType<AccordionItemProps>>("AccordionItem");
export const AccordionTrigger = accordionLazy<ComponentType<AccordionTriggerProps>>("AccordionTrigger");
export const AccordionContent = accordionLazy<ComponentType<AccordionContentProps>>("AccordionContent");

export const Spinner: ComponentType<SpinnerProps> = LazyComponent("Spinner", () => findExportedComponent("Spinner"));

export const ToggleGroup: ComponentType<ToggleGroupProps> = LazyComponent("ToggleGroup", () => findExportedComponent("ToggleGroup"));
export const ToggleGroupItem: ComponentType<ToggleGroupItemProps> = LazyComponent("ToggleGroupItem", () => findExportedComponent("ToggleGroupItem"));

export const HoverCard: ComponentType<HoverCardProps> = LazyComponent("HoverCard", () => findExportedComponent("HoverCard"));
export const HoverCardTrigger: ComponentType<HoverCardTriggerProps> = LazyComponent("HoverCardTrigger", () => findExportedComponent("HoverCardTrigger"));
export const HoverCardContent: ComponentType<HoverCardContentProps> = LazyComponent("HoverCardContent", () => findExportedComponent("HoverCardContent"));

export const Markdown: ComponentType<MarkdownProps> = LazyComponent("Markdown", () => findExportedComponent("Markdown"));

export const { toast } = findByPropsLazy("toast", "Toaster");

export const SidebarComponents = findByPropsLazy("Sidebar", "SidebarContent", "SidebarProvider");
export const DrawerComponents = findByPropsLazy("Drawer", "DrawerContent");
export const Avatar = LazyComponent("Avatar", () => findExportedComponent("Avatar"));
export const Presence = LazyComponent("Presence", () => findExportedComponent("Presence"));
export const Icon = LazyComponent("Icon", () => findExportedComponent("Icon"));
export const AnimatePresence = LazyComponent("AnimatePresence", () => findExportedComponent("AnimatePresence"));
