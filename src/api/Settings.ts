/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { useEffect, useReducer } from "@turbopack/common/react";
import { Logger } from "@utils/Logger";
import { mergeDefaults } from "@utils/misc";
import { SettingsStore as SettingsStoreClass } from "@utils/SettingsStore";
import { type DefinedSettings, OptionType, type PluginSettingDef, type PluginSettingSelectOption, type SettingsChecks, type SettingsDefinition } from "@utils/types";

const logger = new Logger("Settings");

export interface Settings {
    plugins: {
        [plugin: string]: {
            enabled: boolean;
            [setting: string]: unknown;
        };
    };
    notifications: {
        timeout: number;
        position: "top-right" | "bottom-right";
    };
}

const DefaultSettings: Settings = {
    plugins: {},
    notifications: {
        timeout: 5000,
        position: "bottom-right",
    },
};

function loadSettings(): Settings {
    try {
        let raw: string | null = null;
        if (typeof GM_getValue === "function") {
            raw = GM_getValue("VoidSettings", null);
        } else {
            raw = localStorage.getItem("VoidSettings");
        }
        if (raw) return JSON.parse(raw);
    } catch (e) {
        logger.error("Failed to load settings:", e);
    }
    return {} as Settings;
}

const settings = loadSettings();
mergeDefaults(settings, DefaultSettings);

export const SettingsStore = new SettingsStoreClass(settings);

export const PlainSettings = settings;
export const Settings = SettingsStore.store;

export function migratePluginSettings(name: string, ...oldNames: string[]) {
    const { plugins } = SettingsStore.plain;
    if (name in plugins) return;

    for (const oldName of oldNames) {
        if (oldName in plugins) {
            logger.info(`Migrating settings from old name ${oldName} to ${name}`);
            plugins[name] = plugins[oldName];
            delete plugins[oldName];
            SettingsStore.markAsChanged();
            break;
        }
    }
}

function resolveDefault(setting: PluginSettingDef): unknown {
    if ("default" in setting) return setting.default;
    if (setting.type === OptionType.SELECT) return (setting as { options: readonly PluginSettingSelectOption[] }).options.find((o: PluginSettingSelectOption) => o.default)?.value;
    return undefined;
}

export function definePluginSettings<Def extends SettingsDefinition, Checks extends SettingsChecks<Def>, PrivateSettings extends object = {}>(def: Def, checks?: Checks) {
    let _pluginName = "";

    const definedSettings: DefinedSettings<Def, Checks, PrivateSettings> = {
        get store() {
            if (!_pluginName) throw new Error("Cannot access settings before plugin is initialized");
            return Settings.plugins[_pluginName] as any;
        },
        get plain() {
            if (!_pluginName) throw new Error("Cannot access settings before plugin is initialized");
            return PlainSettings.plugins[_pluginName] as any;
        },
        def,
        checks: (checks ?? {}) as Checks,
        get pluginName() {
            return _pluginName;
        },
        set pluginName(name: string) {
            _pluginName = name;
            if (!name) return;

            if (!PlainSettings.plugins[name]) PlainSettings.plugins[name] = { enabled: false };

            SettingsStore.setDefaultGetter(`plugins.${name}`, key => {
                const setting = def[key];
                return setting ? resolveDefault(setting) : undefined;
            });
        },
        use(keys?: string[]) {
            const [, rerender] = useReducer((x: number) => x + 1, 0);
            const prefix = `plugins.${_pluginName}`;

            useEffect(() => {
                if (keys?.length) {
                    const listeners = keys.map(key => {
                        const path = `${prefix}.${key}`;
                        SettingsStore.addChangeListener(path, rerender);
                        return () => SettingsStore.removeChangeListener(path, rerender);
                    });
                    return () => {
                        for (const unsub of listeners) unsub();
                    };
                }

                SettingsStore.addPrefixChangeListener(prefix, rerender);
                return () => SettingsStore.removePrefixChangeListener(prefix, rerender);
            }, []);

            return definedSettings.store;
        },
        withPrivateSettings<T extends object>() {
            return this as DefinedSettings<Def, Checks, T>;
        },
    };

    return definedSettings;
}
