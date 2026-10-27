import {
    ArcElement,
    BarController,
    BarElement,
    BubbleController,
    CategoryScale,
    Chart as ChartJs,
    DoughnutController,
    Filler,
    Legend,
    LineController,
    LineElement,
    LinearScale,
    PieController,
    PointElement,
    PolarAreaController,
    RadialLinearScale,
    RadarController,
    ScatterController,
    TimeScale,
    Tooltip,
} from 'chart.js';
import type { Chart as ChartInstance, ChartConfiguration } from 'chart.js';
import { SankeyController, Flow } from 'chartjs-chart-sankey';
import { buildChartConfig } from 'src/chart/config';
import { resolveTheme } from 'src/chart/theme';
import type { ChartBlock } from 'src/chart/types';
import { registerMomentAdapter } from 'src/utils/date-adapter/chartjs-adapter-moment.esm.js';
import type ChartPlugin from 'src/main';
import { renderError } from './errors';

// Only the controllers, scales and plugins the nine supported types need.
ChartJs.register(
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    ArcElement,
    BarElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    RadialLinearScale,
    TimeScale,
    Filler,
    Legend,
    Tooltip,
    SankeyController,
    Flow,
);

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

const isConfiguration = (value: unknown): value is ChartConfiguration =>
    isRecord(value) && typeof value.type === 'string' && isRecord(value.data);

/**
 * Accepts the two shapes the public hook has always allowed and rejects
 * everything else with a message instead of handing Chart.js a broken object.
 */
function resolveRawConfiguration(data: unknown): { config: ChartConfiguration; width?: string } {
    if (isRecord(data) && data.chartOptions !== undefined) {
        if (!isConfiguration(data.chartOptions)) {
            throw new Error('chartOptions must be a Chart.js configuration');
        }
        return {
            config: data.chartOptions,
            width: typeof data.width === 'string' ? data.width : undefined,
        };
    }

    if (isConfiguration(data)) {
        return { config: data };
    }

    throw new Error('renderChart needs a Chart.js configuration or { chartOptions }');
}

export class ChartRenderer {
    private adapterReady = false;

    constructor(readonly plugin: ChartPlugin) {}

    /** Registers the date adapter on first use, so charts without time skip it. */
    private ensureAdapter(): void {
        if (!this.adapterReady) {
            registerMomentAdapter();
            this.adapterReady = true;
        }
    }

    /** Renders a parsed block into `el`; failures become an inline message. */
    async render(block: ChartBlock, el: HTMLElement): Promise<ChartInstance | null> {
        return this.guard(el, () => {
            this.ensureAdapter();
            const theme = resolveTheme(el, this.plugin.settings, block.textColor);
            return this.mount(buildChartConfig(block, theme), block.width, el);
        });
    }

    /**
     * Renders a Chart.js configuration directly, accepting either the raw
     * configuration or the `{ chartOptions, width }` object the plugin uses
     * for blocks. Kept for the public `window.renderChart` hook.
     */
    async renderRaw(data: unknown, el: HTMLElement): Promise<ChartInstance | null> {
        return this.guard(el, () => {
            this.ensureAdapter();
            const { config, width } = resolveRawConfiguration(data);
            return this.mount(config, width, el);
        });
    }

    /** Runs a render step and turns any failure into an inline message. */
    private guard(el: HTMLElement, step: () => ChartInstance): ChartInstance | null {
        try {
            return step();
        } catch (error) {
            renderError(error, el);
            return null;
        }
    }

    private mount(
        config: ChartConfiguration,
        width: string | undefined,
        el: HTMLElement,
    ): ChartInstance {
        const canvas = el.createEl('canvas');
        const chart = new ChartJs(canvas.getContext('2d')!, config);
        el.style.width = width ?? '100%';
        el.style.margin = 'auto';
        return chart;
    }
}
