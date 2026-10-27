import type { ChartConfiguration } from 'chart.js';
import { cartesianScales, radialScale } from './axes';
import type { DatasetConfig } from './datasets';
import { buildDatasets } from './datasets';
import type { ChartOptions } from './options';
import { normalizeSankeyData } from './sankey';
import type { ChartTheme } from './theme';
import type { ChartBlock, ChartLabel } from './types';
import { isCartesianChart, isRadialChart } from './types';

const sharedOptions = (
    block: ChartBlock,
    theme: ChartTheme,
): Omit<ChartOptions, 'indexAxis' | 'scales'> => ({
    animation: { duration: 0 },
    color: theme.textColor,
    font: { family: theme.fontFamily },
    layout: { padding: block.padding },
    plugins: {
        legend: {
            display: block.legend ?? true,
            position: block.legendPosition ?? 'top',
        },
    },
});

/** Chart.js types do not model the open-ended option records this plugin builds. */
const toConfiguration = (
    block: ChartBlock,
    data: { labels?: ChartLabel[]; datasets: DatasetConfig[] },
    options: ChartOptions,
): ChartConfiguration => {
    const untyped: unknown = { type: block.type, data, options };
    return untyped as ChartConfiguration;
};

/**
 * Options depend on the geometry of the type: cartesian charts get two scales,
 * radial charts one, the rest none.
 */
function optionsFor(block: ChartBlock, theme: ChartTheme): ChartOptions {
    const base = sharedOptions(block, theme);

    if (isRadialChart(block.type)) {
        return { ...base, scales: { r: radialScale(block, theme) } };
    }

    if (isCartesianChart(block.type)) {
        const isBarOrLine = block.type === 'bar' || block.type === 'line';

        return {
            ...base,
            ...(isBarOrLine ? { indexAxis: block.indexAxis } : {}),
            scales: cartesianScales(block, theme),
        };
    }

    return base;
}

/**
 * Builds a complete Chart.js configuration for a block.
 *
 * `datasets` is injectable so a block that reads a table can reuse the same
 * dataset rules with series gathered from the vault.
 */
export function buildChartConfig(
    block: ChartBlock,
    theme: ChartTheme,
    datasets: DatasetConfig[] = buildDatasets(block, theme),
): ChartConfiguration {
    const data = {
        labels: block.labels,
        datasets: block.type === 'sankey' ? normalizeSankeyData(datasets) : datasets,
    };

    return toConfiguration(block, data, optionsFor(block, theme));
}
