/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { EVAL } from "./constants";
import type { EvalArgs, EvalError, EvalResult } from "./types";
import { formatError, serialize } from "./utils";

function evalAsync(code: string): Promise<unknown> {
    return (0, eval)(`(async()=>{${autoReturn(code)}})()`);
}

function needsIIFE(code: string): boolean {
    const trimmed = code.trimStart();
    return /^return\s/.test(trimmed) || /^(let|const|var)\s/.test(trimmed);
}

const STATEMENT_RE = /^(return|throw|break|continue|if|for|while|switch|try|class|function|const|let|var)\b/;

function autoReturn(code: string): string {
    const lastNewline = code.lastIndexOf("\n");
    if (lastNewline === -1) {
        const expr = code.trim().replace(/;$/, "").trim();
        if (expr && !STATEMENT_RE.test(expr)) return `return ${expr};`;
        return code;
    }
    const lastLine = code.slice(lastNewline + 1).trim();
    if (!lastLine) return code;
    const expr = lastLine.replace(/;$/, "").trim();
    if (expr && !STATEMENT_RE.test(expr)) return `${code.slice(0, lastNewline)}\nreturn ${expr};`;
    return code;
}

function wrapIIFE(code: string): string {
    return `(()=>{${autoReturn(code)}})()`;
}

function tryEval(code: string): EvalResult | EvalError {
    try {
        return { ok: true, value: (0, eval)(code) };
    } catch (err: unknown) {
        return { ok: false, error: err };
    }
}

export function handleEval(args: EvalArgs): unknown {
    const { code } = args;
    if (!code) return "Provide code to evaluate";
    if (code.length > EVAL.MAX_CODE_LENGTH) return `Code too long (${code.length} chars, max ${EVAL.MAX_CODE_LENGTH})`;

    let evalCode = needsIIFE(code) ? wrapIIFE(code) : code;

    let r = tryEval(evalCode);

    if (!r.ok && r.error instanceof SyntaxError) {
        if (r.error.message.includes("await")) {
            try {
                return evalAsync(code).then(
                    val => serialize(val, EVAL.SERIALIZE_DEPTH),
                    (err: unknown) => formatError(err),
                );
            } catch (asyncErr: unknown) {
                return formatError(asyncErr);
            }
        }
        if (evalCode === code) {
            evalCode = wrapIIFE(code);
            r = tryEval(evalCode);
        }
    }

    if (!r.ok) return formatError(r.error);

    if (r.value != null && typeof (r.value as Promise<unknown>).then === "function") {
        return (r.value as Promise<unknown>).then(
            val => serialize(val, EVAL.SERIALIZE_DEPTH),
            (err: unknown) => formatError(err),
        );
    }
    return serialize(r.value, EVAL.SERIALIZE_DEPTH);
}
