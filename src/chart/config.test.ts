import { describe, expect, it } from 'vitest';
import { buildChartConfig } from './config';
import type { ChartTheme } from './theme';
import type { ChartBlock, SankeyDatum } from './types';

const theme: ChartTheme = {
    colors: ['#111111', '#222222'],
    gridColor: '#333333',
    textColor: '#eeeeee',
    fontFamily: 'Inter',
};

const base: ChartBlock = {
    labels: ['A', 'B'],
    series: [
        { title: 'First', data: [1, 2] },
        { title: 'Second', data: [3, 4] },
    ],
    type: 'bar',
};

const options = (block: ChartBlock) =>
    buildChartConfig(block, theme).options as Record<string, Record<string, unknown>>;

describe('buildChartConfig', () => {
    it('maps a bar block to two axes with the theme grid color', () => {
        const config = options({ ...base, beginAtZero: true, stacked: true });
        const scales = config.scales as Record<string, Record<string, unknown>>;

        expect(scales.y.beginAtZero).toBe(true);
        expect(scales.x.stacked).toBe(true);
        expect(scales.y.grid).toEqual({ color: '#333333' });
    });

    it('turns a time unit into a time scale on x', () => {
        const config = options({ ...base, type: 'line', time: 'month' });
        const x = (config.scales as Record<string, Record<string, unknown>>).x;

        expect(x.type).toBe('time');
        expect(x.time).toEqual({ unit: 'month' });
    });

    it('uses only the r scale for radar and polar area', () => {
        const radar = options({ ...base, type: 'radar', rMax: 10 });
        const polar = options({ ...base, type: 'polarArea' });

        expect(Object.keys(radar.scales as object)).toEqual(['r']);
        expect((radar.scales as Record<string, Record<string, unknown>>).r.max).toBe(10);
        expect(Object.keys(polar.scales as object)).toEqual(['r']);
    });

    it('adds no scales to pie and doughnut', () => {
        for (const type of ['pie', 'doughnut'] as const) {
            expect(options({ ...base, type }).scales).toBeUndefined();
        }
    });

    it('gives bubble and scatter the cartesian axes', () => {
        for (const type of ['bubble', 'scatter'] as const) {
            const scales = options({ ...base, type, xTitle: 'Time' }).scales as Record<
                string,
                Record<string, unknown>
            >;

            expect(scales.x.grid).toEqual({ color: '#333333' });
            expect(scales.y.grid).toEqual({ color: '#333333' });
            expect(scales.x.title).toEqual({ display: true, text: 'Time' });
        }
    });

    it('puts the time scale on the domain axis of a scatter chart', () => {
        const scales = options({ ...base, type: 'scatter', time: 'month' }).scales as Record<
            string,
            Record<string, unknown>
        >;

        expect(scales.x.type).toBe('time');
        expect(scales.y.type).toBeUndefined();
    });

    it('moves beginAtZero to x for a horizontal bar chart', () => {
        const scales = options({ ...base, indexAxis: 'y', beginAtZero: true }).scales as Record<
            string,
            Record<string, unknown>
        >;

        expect(scales.x.beginAtZero).toBe(true);
        expect(scales.y.beginAtZero).toBeUndefined();
    });

    it('puts the time scale on y for a horizontal bar chart', () => {
        const scales = options({ ...base, indexAxis: 'y', time: 'month' }).scales as Record<
            string,
            Record<string, unknown>
        >;

        expect(scales.y.type).toBe('time');
        expect(scales.x.type).toBeUndefined();
    });

    it('normalizes sankey triples into named fields', () => {
        const block: ChartBlock = {
            type: 'sankey',
            labels: [],
            series: [
                {
                    title: 'Flow',
                    data: [['A', 5, 'B']],
                    colorFrom: { A: '#ff0000' },
                },
            ],
        };

        const config = buildChartConfig(block, theme);
        const dataset = config.data.datasets[0] as unknown as Record<string, unknown>;

        expect(dataset.data).toEqual([{ from: 'A', flow: 5, to: 'B' }]);
        expect(typeof dataset.colorFrom).toBe('function');
    });

    it('accepts sankey triples written as [from, to, flow]', () => {
        const block: ChartBlock = {
            type: 'sankey',
            labels: [],
            series: [{ title: 'Flow', data: [['Source', 'Target', 50]] }],
        };

        const config = buildChartConfig(block, theme);
        const dataset = config.data.datasets[0] as unknown as Record<string, unknown>;

        expect(dataset.data).toEqual([{ from: 'Source', flow: 50, to: 'Target' }]);
    });

    it('accepts sankey objects and numeric strings', () => {
        const block: ChartBlock = {
            type: 'sankey',
            labels: [],
            series: [{ title: 'Flow', data: [{ from: 'A', to: 'B', flow: '12' }] }],
        };

        const config = buildChartConfig(block, theme);
        const dataset = config.data.datasets[0] as unknown as Record<string, unknown>;

        expect(dataset.data).toEqual([{ from: 'A', flow: 12, to: 'B' }]);
    });

    it('rejects sankey entries without a target', () => {
        const block: ChartBlock = {
            type: 'sankey',
            labels: [],
            series: [{ title: 'Flow', data: [{ from: 'A', flow: 5 } as unknown as SankeyDatum] }],
        };

        expect(() => buildChartConfig(block, theme)).toThrow('target node is missing');
    });

    it('rejects a non numeric sankey flow', () => {
        const block: ChartBlock = {
            type: 'sankey',
            labels: [],
            series: [{ title: 'Flow', data: [['A', 'B', 'C']] }],
        };

        expect(() => buildChartConfig(block, theme)).toThrow('must be a number');
    });

    it('rejects a sankey flow of zero', () => {
        const block: ChartBlock = {
            type: 'sankey',
            labels: [],
            series: [{ title: 'Flow', data: [['A', 0, 'B']] }],
        };

        expect(() => buildChartConfig(block, theme)).toThrow('greater than zero');
    });

    it('passes extra series options to the dataset', () => {
        const block: ChartBlock = {
            ...base,
            series: [{ title: 'First', data: [1], borderDash: [4, 2] }],
        };

        const config = buildChartConfig(block, theme);

        expect(config.data.datasets[0]).toMatchObject({ borderDash: [4, 2], borderWidth: 1 });
    });

    it('gives every dataset the full palette when labelColors is set', () => {
        const config = buildChartConfig({ ...base, labelColors: true }, theme);

        const datasets = config.data.datasets as unknown as { borderColor: string[] }[];

        expect(datasets[0].borderColor).toEqual(theme.colors);
        expect(datasets[1].borderColor).toEqual(theme.colors);
    });

    it('uses one color per dataset by default', () => {
        const config = buildChartConfig(base, theme);

        expect((config.data.datasets[0] as { borderColor: string }).borderColor).toBe('#111111');
        expect((config.data.datasets[1] as { borderColor: string }).borderColor).toBe('#222222');
    });
});
