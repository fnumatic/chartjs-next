import { describe, expect, it } from 'vitest';
import { withBestFit } from './bestFit';
import type { ChartBlock } from './types';

const base: ChartBlock = {
    type: 'line',
    labels: [0, 2, 4],
    series: [{ title: 'x', data: [0, 1, 2] }],
};

describe('withBestFit', () => {
    it('adds the regression line as a new series', () => {
        const result = withBestFit({ ...base, bestFit: true });
        const fitted = result.series?.[result.series.length - 1];

        expect(result.series).toHaveLength(2);
        expect(fitted?.title).toBe('Line of Best Fit');
        expect(fitted?.data).toEqual([0, 1, 2]);
    });

    it('uses a custom title', () => {
        const result = withBestFit({ ...base, bestFit: true, bestFitTitle: 'Trend' });

        expect(result.series?.[result.series.length - 1]?.title).toBe('Trend');
    });

    it('ignores other chart types', () => {
        const bar: ChartBlock = { ...base, type: 'bar', bestFit: true };

        expect(withBestFit(bar)).toBe(bar);
    });

    it('leaves a block without labels untouched', () => {
        const block: ChartBlock = { ...base, labels: [], bestFit: true };

        expect(withBestFit(block)).toBe(block);
    });
});
