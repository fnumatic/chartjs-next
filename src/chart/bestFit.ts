import type { ChartBlock, Series } from './types';

const toNumber = (value: unknown): number => Number(value);

/**
 * Adds a regression series to a line chart.
 *
 * The x values come from one series and the y values from the labels; the
 * resulting line is appended as `Line of Best Fit` unless a title is given.
 */
export function withBestFit(block: ChartBlock): ChartBlock {
    if (!block.bestFit || block.type !== 'line') {
        return block;
    }

    const series = block.series ?? [];
    if (series.length === 0 || !block.labels?.length) {
        return block;
    }

    const sourceIndex = block.bestFitNumber ?? 0;
    const x = (series[sourceIndex] ?? series[0]).data.map(toNumber);
    const y = block.labels.map(toNumber);
    const count = Math.min(x.length, y.length);

    if (count === 0) {
        return block;
    }

    let sumX = 0;
    let sumY = 0;
    let sumXX = 0;
    let sumXY = 0;

    for (let index = 0; index < count; index++) {
        sumX += x[index];
        sumY += y[index];
        sumXX += x[index] * x[index];
        sumXY += x[index] * y[index];
    }

    const denominator = count * sumXX - sumX * sumX;
    if (denominator === 0) {
        return block;
    }

    const gradient = (count * sumXY - sumX * sumY) / denominator;
    if (!Number.isFinite(gradient) || gradient === 0) {
        return block;
    }

    const intercept = (sumY - gradient * sumX) / count;
    const fitted: Series = {
        title:
            block.bestFitTitle !== undefined && block.bestFitTitle !== 'undefined'
                ? block.bestFitTitle
                : 'Line of Best Fit',
        data: y.map((value) => (value - intercept) / gradient),
    };

    return { ...block, series: [...series, fitted] };
}
