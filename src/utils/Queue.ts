/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/** A sequential promise queue. Tasks run one-at-a-time in FIFO order. */
export class Queue {
    private queue: Array<() => any> = [];
    private running: Promise<any> | null = null;
    private maxSize: number;

    constructor(maxSize = Infinity) {
        this.maxSize = maxSize;
    }

    get size() {
        return this.queue.length;
    }

    push<T>(task: () => T | Promise<T>): void {
        this.queue.push(task);
        if (this.queue.length > this.maxSize) this.queue.shift();
        this.run();
    }

    unshift<T>(task: () => T | Promise<T>): void {
        this.queue.unshift(task);
        if (this.queue.length > this.maxSize) this.queue.pop();
        this.run();
    }

    private run() {
        if (this.running) return;
        this.next();
    }

    private next() {
        const task = this.queue.shift();
        if (!task) { this.running = null; return; }
        this.running = Promise.resolve()
            .then(task)
            .finally(() => this.next());
    }
}
