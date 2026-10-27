import { describe, expect, it } from 'vitest';
import { buildDatasets } from './datasets';
import type { ChartTheme } from './theme';
import type { ChartBlock } from './types';

const theme: ChartTheme = {
    colors: ['#111111', '#222222'],
    gridColor: '#333333',
    textColor: '#eeeeee',
    fontFamily: 'Inter',
};

const block = (overrides: Partial<ChartBlock>): ChartBlock => ({
    type: 'bar',
    labels: ['A', 'B', 'C'],
    series: [{ title: 'First', data: [1, 2, 3] }],
    ...overrides,
});

describe('buildDatasets', () => {
    it('gives every pie value its own border and fill color', () => {
        const [dataset] = buildDatasets(block({ type: 'pie' }), theme);

        expect(dataset.borderColor).toEqual(['#111111', '#222222', '#111111']);
        expect(Array.isArray(dataset.backgroundColor)).toBe(true);
        expect(dataset.backgroundColor).toHaveLength(3);
    });

    it('colours doughnut and polar area per value as well', () => {
        for (const type of ['doughnut', 'polarArea'] as const) {
            const [dataset] = buildDatasets(block({ type }), theme);

            expect(Array.isArray(dataset.borderColor)).toBe(true);
            expect(dataset.borderColor).toHaveLength(3);
        }
    });

    it('colour whole datasets for cartesian and radial charts', () => {
        for (const type of ['bar', 'line', 'radar', 'scatter', 'bubble'] as const) {
            const [dataset] = buildDatasets(block({ type }), theme);

            expect(dataset.borderColor).toBe('#111111');
            expect(Array.isArray(dataset.backgroundColor)).toBe(false);
        }
    });

    it('keeps one color per dataset across several series', () => {
        const datasets = buildDatasets(
            block({
                series: [
                    { title: 'First', data: [1] },
                    { title: 'Second', data: [2] },
                ],
            }),
            theme,
        );

        expect(datasets.map((entry) => entry.borderColor)).toEqual(['#111111', '#222222']);
    });

    it('passes spanGaps to the dataset', () => {
        const [dataset] = buildDatasets(block({ type: 'line', spanGaps: true }), theme);

        expect(dataset.spanGaps).toBe(true);
    });

    it('lets labelColors put the whole palette on every dataset', () => {
        const datasets = buildDatasets(
            block({
                labelColors: true,
                series: [
                    { title: 'First', data: [1] },
                    { title: 'Second', data: [2] },
                ],
            }),
            theme,
        );

        expect(datasets[0].borderColor).toEqual(theme.colors);
        expect(datasets[1].borderColor).toEqual(theme.colors);
    });
});
