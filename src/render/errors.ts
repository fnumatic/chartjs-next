const describe = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    try {
        return JSON.stringify(error);
    } catch {
        return String(error);
    }
};

/** Shows a readable error inside the note instead of leaving an empty block. */
export function renderError(error: unknown, el: HTMLElement): void {
    const box = el.createDiv({ cls: 'chart-error' });
    box.createEl('b', { text: "Couldn't render the chart:" });
    box.createEl('pre').createEl('code', { text: describe(error) });
    box.createEl('hr');
    box.createEl('span').innerHTML =
        'Details are in the developer console: press <kbd>CTRL</kbd> + <kbd>SHIFT</kbd> + <kbd>I</kbd> to open it.';
}
