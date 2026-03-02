/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "NoTelemetry",
    description: "Disables all tracking, telemetry, and event logging.",
    authors: [Devs.Prism],
    required: true,

    patches: [
        {
            find: "ingest.us.sentry.io",
            replacement: {
                match: /dsn:"https:\/\/.{0,80}\.ingest\.us\.sentry\.io\/.{0,30}"/,
                replace: 'dsn:""',
            },
        },
        {
            find: '"after-init"),(0,',
            replacement: {
                match: /function \i\(\)\{if\(Object\.prototype\.hasOwnProperty[\s\S]{0,450}setHasMixpanelInitialized\)\(!0\)\}\}\)\}/,
                replace: "function p(){}",
            },
        },
        {
            find: "sendBatchLogEvent",
            all: true,
            replacement: [
                {
                    match: /"sendBatchLogEvent",\i=>\{\i\(this\.address\+.{0,40},\i\)\}/,
                    replace: '"sendBatchLogEvent",()=>{}',
                },
                {
                    match: /"sendBatchLogExperimentExposure",\i=>\{\i\(this\.address\+.{0,50},\i\)\}/,
                    replace: '"sendBatchLogExperimentExposure",()=>{}',
                },
                {
                    match: /"\/api\/log_metric",\i\)/,
                    replace: '"/api/log_metric",[])',
                },
            ],
        },
        {
            find: "feature-store-set-override",
            all: true,
            replacement: [
                {
                    match: /\(0,\i\.\i\)\("feature-store-set-override".{0,65}\)/,
                    replace: "void 0",
                },
                {
                    match: /\(0,\i\.\i\)\("feature-store-clear-override".{0,45}\)/,
                    replace: "void 0",
                },
                {
                    match: /\(0,\i\.\i\)\("feature-store-clear-all-overrides".{0,40}\)/,
                    replace: "void 0",
                },
            ],
        },
    ],
});
