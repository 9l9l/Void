/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { OptionType, type Plugin, type PluginSettingDef, type PluginSettingSelectOption } from "@utils/types";

export { humanizeKey as camelToTitle } from "@utils/text";

export function getDefaultValue(setting: PluginSettingDef): unknown {
    if ("default" in setting) return setting.default;
    if ("options" in setting && setting.type === OptionType.SELECT) {
        return setting.options.find((o: PluginSettingSelectOption) => o.default)?.value;
    }
    return undefined;
}

export function isVisibleSetting([, s]: [string, PluginSettingDef]): boolean {
    return s.type !== OptionType.CUSTOM && !("hidden" in s && s.hidden);
}

export function hasVisibleSettings(plugin: Plugin): boolean {
    return !!plugin.settings?.def && Object.entries(plugin.settings.def).some(isVisibleSetting);
}
