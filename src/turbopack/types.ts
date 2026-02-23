/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export type ModuleFactory = (helpers: TurbopackHelpers, module?: TurbopackModule, exports?: Record<string, unknown>) => void;

export const SYM_ORIGINAL = Symbol("Void.originalFactory");
export const SYM_PATCHED = Symbol("Void.patched");
export const SYM_PATCHED_BY = Symbol("Void.patchedBy");
export const SYM_PATCHED_CODE = Symbol("Void.patchedCode");

export interface PatchedModuleFactory extends ModuleFactory {
    [SYM_ORIGINAL]?: ModuleFactory;
    [SYM_PATCHED]?: boolean;
    [SYM_PATCHED_BY]?: string[];
    [SYM_PATCHED_CODE]?: string;
    toString(): string;
}

export interface TurbopackRequireFn {
    (id: string): unknown;
    keys(): string[];
    resolve(id: string): number;
    import(id: string): Promise<unknown>;
}

export interface TurbopackHelpers {
    /** Require with namespace wrapping — loads module by ID, returns ESM namespace object. Creates namespace wrapper if not already cached. */
    i(moduleId: number): any;
    /** Raw require — returns module exports directly without namespace wrapping. */
    r(moduleId: number): any;
    /** Require default — `this.r(id)?.default ?? this.r(id)`. */
    R(moduleId: number): any;
    /** Define ESM exports: `e.s([["Name", () => value], ...], moduleId?)`. */
    s(exports: [string, () => unknown][], moduleId?: number): void;
    /** Define CJS exports via Proxy-based merge (supports re-exports). */
    j(exports: object | null, moduleId?: number): void;
    /** Set module exports to a single value. */
    v(value: unknown, moduleId?: number): void;
    /** Set module exports and namespace object to the same value. */
    n(value: unknown, moduleId?: number): void;
    /** Resolve async module — calls `this.r(id)` then invokes result with `this.i` bound. For top-level await modules. */
    A(moduleId: number): Promise<any>;
    /** Register async module (top-level await support). */
    a(asyncModule: unknown, hasAwait: boolean): void;
    /** Create a require function from a resolve map (for dynamic require). */
    f(resolveMap: Record<string, { id(): number; module(): unknown }>): TurbopackRequireFn;
    /** Throw "dynamic usage of require is not supported" error. */
    z(specifier: string): never;
    /** Throw "Unexpected use of runtime require" error. */
    t(): never;
    /** Load a single chunk by path — returns Promise. */
    l(chunkPath: string): Promise<void>;
    /** Load a single chunk by path (alternate loader). */
    L(chunkPath: string): Promise<void>;
    /** Pseudo-URL constructor — creates URL-like object from a relative path. Not a real URL instance. */
    U: new (
        path: string,
    ) => URL;
    /** Resolve path relative to app root — returns `/ROOT/${path}`. */
    P(path?: string): string;
    /** Create a web worker from chunk paths. */
    b(chunkPaths: string[]): Worker;
    /** Load WASM module with imports and fallback. */
    w(wasmPath: string, imports: unknown, fallback: unknown): Promise<unknown>;
    /** Load WASM module with imports. */
    u(wasmPath: string, imports: unknown): Promise<unknown>;
    /** The current module being initialized. */
    m: TurbopackModule;
    /** Runtime module cache — plain object keyed by module ID. */
    c: Record<number, TurbopackModule>;
    /** The current module's exports object. */
    e: Record<string, unknown>;
    /** Factory registry — Map of module ID to factory function. */
    M: Map<number, ModuleFactory>;
    /** Reference to `window` / `globalThis`. */
    g: typeof globalThis;
}

export interface TurbopackModule {
    exports: any;
    error: any;
    id: number;
    namespaceObject: any;
}

export type FilterFn = (mod: any) => boolean;
