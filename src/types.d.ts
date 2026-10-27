// Ambient declarations.

interface Window {
    /** Legacy hook: renders a chart from a plain Chart.js configuration. */
    renderChart?: (data: unknown, el: HTMLElement) => Promise<unknown>;
}
