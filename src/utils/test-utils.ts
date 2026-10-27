/**
 * Adds the Obsidian `HTMLElement.createDiv()` and `createEl()` helpers to the
 * DOM provided by the test environment (happy-dom).
 */
export function installObsidianDom(): void {
    if (typeof HTMLElement === 'undefined') {
        return;
    }

    const proto = HTMLElement.prototype as unknown as Record<string, unknown>;

    if (typeof proto.createDiv !== 'function') {
        proto.createDiv = function (this: HTMLElement, opts?: { cls?: string; text?: string }) {
            const el = this.ownerDocument.createElement('div');
            if (opts?.cls) {
                el.className = opts.cls;
            }
            if (opts?.text !== undefined) {
                el.textContent = opts.text;
            }
            this.appendChild(el);
            return el;
        };
    }

    if (typeof proto.createEl !== 'function') {
        proto.createEl = function (
            this: HTMLElement,
            tag: string,
            opts?: { cls?: string; text?: string },
        ) {
            const el = this.ownerDocument.createElement(tag);
            if (opts?.cls) {
                el.className = opts.cls;
            }
            if (opts?.text !== undefined) {
                el.textContent = opts.text;
            }
            this.appendChild(el);
            return el;
        };
    }
}
