/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Settings } from "@api/Settings";
import { Flex, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SettingsDescription, SettingsRow, SettingsTitle, Switch } from "@components";
import { React, useCallback, useState } from "@turbopack/common/react";
import { OptionType, type PluginSettingDef, type PluginSettingSelectOption } from "@utils/types";

import { camelToTitle, getDefaultValue } from "./utils";

interface SettingFieldProps {
    id: string;
    setting: PluginSettingDef;
    pluginName: string;
}

function usePluginSetting(pluginName: string, id: string, setting: PluginSettingDef) {
    const [value, setValue] = useState((Settings.plugins[pluginName] ?? {})[id] ?? getDefaultValue(setting));

    const update = useCallback(
        (val: any) => {
            setValue(val);
            Settings.plugins[pluginName] = { ...Settings.plugins[pluginName], [id]: val };
            setting.onChange?.(val);
        },
        [id, pluginName, setting],
    );

    return [value, update] as const;
}

function SettingLabel({ id, setting }: { id: string; setting: PluginSettingDef }) {
    return (
        <Flex flexDirection="column" gap="0">
            <SettingsTitle>{camelToTitle(id)}</SettingsTitle>
            {"description" in setting && setting.description && <SettingsDescription>{setting.description}</SettingsDescription>}
        </Flex>
    );
}

function BooleanField({ id, setting, pluginName }: SettingFieldProps) {
    const [value, update] = usePluginSetting(pluginName, id, setting);
    return (
        <SettingsRow action={<Switch checked={!!value} onCheckedChange={update} />}>
            <SettingLabel id={id} setting={setting} />
        </SettingsRow>
    );
}

function SelectField({ id, setting, pluginName }: SettingFieldProps) {
    const [value, update] = usePluginSetting(pluginName, id, setting);
    if (!("options" in setting)) return null;

    return (
        <SettingsRow
            action={
                <Select value={String(value ?? "")} onValueChange={update}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {(setting as { options: readonly PluginSettingSelectOption[] }).options.map((o: PluginSettingSelectOption) => (
                            <SelectItem key={String(o.value)} value={String(o.value)}>
                                {o.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            }
        >
            <SettingLabel id={id} setting={setting} />
        </SettingsRow>
    );
}

function SliderField({ id, setting, pluginName }: SettingFieldProps) {
    const [value, update] = usePluginSetting(pluginName, id, setting);
    if (!("markers" in setting)) return null;

    const { markers, stickToMarkers } = setting as { markers: number[]; stickToMarkers?: boolean };

    return (
        <SettingsRow
            action={
                <input
                    type="range"
                    min={markers[0]}
                    max={markers[markers.length - 1]}
                    value={(value as number) ?? markers[0]}
                    onChange={(e: { target: { value: string } }) => {
                        let v = Number(e.target.value);
                        if (stickToMarkers) v = markers.reduce((p, c) => (Math.abs(c - v) < Math.abs(p - v) ? c : p));
                        update(v);
                    }}
                    className="w-24"
                />
            }
        >
            <SettingLabel id={id} setting={setting} />
        </SettingsRow>
    );
}

function ComponentField({ setting, pluginName }: SettingFieldProps) {
    const [, update] = usePluginSetting(pluginName, "component", setting);
    if (!("component" in setting)) return null;

    const Comp = (setting as { component: React.ComponentType<{ setValue: (v: any) => void; option: PluginSettingDef }> }).component;
    return <Comp setValue={update} option={setting} />;
}

function NumberField({ id, setting, pluginName }: SettingFieldProps) {
    const [value, update] = usePluginSetting(pluginName, id, setting);
    return (
        <SettingsRow
            action={
                <Input
                    type="number"
                    value={(value as string) ?? ""}
                    onChange={(e: { target: { value: string } }) => {
                        const n = Number(e.target.value);
                        if (!isNaN(n)) update(n);
                    }}
                    className="w-24"
                />
            }
        >
            <SettingLabel id={id} setting={setting} />
        </SettingsRow>
    );
}

function StringField({ id, setting, pluginName }: SettingFieldProps) {
    const [value, update] = usePluginSetting(pluginName, id, setting);
    return (
        <SettingsRow
            action={
                <Input
                    type="text"
                    value={(value as string) ?? ""}
                    onChange={(e: { target: { value: string } }) => update(e.target.value)}
                    placeholder={"placeholder" in setting ? (setting as { placeholder?: string }).placeholder : undefined}
                    className="w-40"
                />
            }
        >
            <SettingLabel id={id} setting={setting} />
        </SettingsRow>
    );
}

type FieldComponent = React.ComponentType<SettingFieldProps>;

const FIELD_MAP: Record<OptionType, FieldComponent | null> = {
    [OptionType.BOOLEAN]: BooleanField,
    [OptionType.SELECT]: SelectField,
    [OptionType.SLIDER]: SliderField,
    [OptionType.COMPONENT]: ComponentField,
    [OptionType.NUMBER]: NumberField,
    [OptionType.BIGINT]: NumberField,
    [OptionType.STRING]: StringField,
    [OptionType.CUSTOM]: null,
};

export default function SettingField({ id, setting, pluginName }: SettingFieldProps) {
    const Field = FIELD_MAP[setting.type];
    if (!Field) return null;
    return <Field id={id} setting={setting} pluginName={pluginName} />;
}
