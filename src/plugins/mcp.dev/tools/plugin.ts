/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { isPluginEnabled, plugins, startPlugin, stopPlugin } from "@api/PluginManager";
import { Settings } from "@api/Settings";

import type { PluginArgs } from "./types";

const PLUGIN_ACTIONS = ["list", "enable", "disable", "toggle", "settings", "setSetting"] as const;

interface PluginInfo {
    name: string;
    enabled: boolean;
    started: boolean;
    required?: boolean;
    desc?: string;
}

export function handlePlugin(args: PluginArgs): unknown {
    const { action, name, key, value } = args;

    if (action === "list") {
        return Object.values(plugins).map((p): PluginInfo => {
            const info: PluginInfo = { name: p.name, enabled: isPluginEnabled(p.name), started: p.started };
            if (p.required) info.required = true;
            if (p.description) info.desc = p.description;
            return info;
        });
    }

    if (!(PLUGIN_ACTIONS as readonly string[]).includes(action)) return { error: `Unknown action: ${action}`, validActions: PLUGIN_ACTIONS };

    if (!name) return "Provide plugin name";
    const plugin = plugins[name];
    if (!plugin) {
        const lower = name.toLowerCase();
        const similar = Object.keys(plugins).filter(n => n.toLowerCase().includes(lower) || lower.includes(n.toLowerCase()));
        return similar.length ? { error: `Plugin not found: ${name}`, similar } : `Plugin not found: ${name}. Use plugin list to see available plugins.`;
    }

    if (action === "enable") {
        Settings.plugins[name] = { ...Settings.plugins[name], enabled: true };
        startPlugin(plugin);
        return `Enabled ${name}`;
    }

    if (action === "disable") {
        if (plugin.required) return `Cannot disable required plugin: ${name}`;
        Settings.plugins[name] = { ...Settings.plugins[name], enabled: false };
        stopPlugin(plugin);
        return `Disabled ${name}`;
    }

    if (action === "toggle") {
        const enabled = isPluginEnabled(name);
        return handlePlugin({ action: enabled ? "disable" : "enable", name });
    }

    if (action === "settings") {
        return Settings.plugins[name] ?? {};
    }

    if (!key) return "Provide setting key";
    Settings.plugins[name] = { ...Settings.plugins[name], enabled: Settings.plugins[name]?.enabled ?? true, [key]: value };
    return `Set ${name}.${key} = ${JSON.stringify(value)}`;
}
