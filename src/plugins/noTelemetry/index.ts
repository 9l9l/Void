/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import definePlugin from "@utils/types";

export default definePlugin({
    name: "NoTelemetry",
    description: "Blocks analytics, metrics, and error reporting sent to Grok servers.",
    authors: ["Prism"],
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
                match: /function \i\(\)\{(?=if\(Object\.prototype\.hasOwnProperty)/,
                replace: "$&return;",
            },
        },
        {
            find: "sendBatchLogEvent",
            all: true,
            replacement: [
                {
                    match: /"sendBatchLogEvent",\i=>\{/,
                    replace: '"sendBatchLogEvent",e=>{return;',
                },
                {
                    match: /"sendBatchLogExperimentExposure",\i=>\{/,
                    replace: '"sendBatchLogExperimentExposure",e=>{return;',
                },
                {
                    match: /"\/api\/log_metric",\i\)/,
                    replace: '"/api/log_metric",[])',
                },
            ],
        },
    ],
});
