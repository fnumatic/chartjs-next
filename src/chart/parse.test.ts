import { describe, expect, it } from 'vitest';
import { readChartBlock } from './parse';

describe('readChartBlock', () => {
    it('reads a minimal block', () => {
        const block = readChartBlock({
            type: 'bar',
            labels: ['A', 'B'],
            series: [{ title: 'Values', data: [1, 2] }],
        });

        expect(block).toEqual({
            type: 'bar',
            labels: ['A', 'B'],
            series: [{ title: 'Values', data: [1, 2] }],
        });
    });

    it('accepts a table block without labels and series', () => {
        const block = readChartBlock({ type: 'line', id: 'sales' });

        expect(block.id).toBe('sales');
        expect(block.labels).toBeUndefined();
        expect(block.series).toBeUndefined();
    });

    it('keeps unknown dataset options', () => {
        const block = readChartBlock({
            type: 'line',
            labels: [1],
            series: [{ title: 'Values', data: [1], borderDash: [4, 2] }],
        });

        expect(block.series?.[0].borderDash).toEqual([4, 2]);
    });

    it('turns date labels into ISO text', () => {
        const block = readChartBlock({
            type: 'line',
            labels: [new Date('2024-01-01T00:00:00Z')],
            series: [{ data: [1] }],
        });

        expect(block.labels).toEqual(['2024-01-01T00:00:00.000Z']);
    });

    it('rejects an unknown chart type', () => {
        expect(() => readChartBlock({ type: 'sunburst' })).toThrow('Unknown chart type');
    });

    it('rejects a block without labels or series', () => {
        expect(() => readChartBlock({ type: 'bar', labels: [] })).toThrow(
            'Missing type, labels or series',
        );
    });

    it('rejects non-list labels', () => {
        expect(() =>
            readChartBlock({ type: 'bar', labels: 'A, B', series: [{ data: [1] }] }),
        ).toThrow('labels must be a list');
    });

    it('rejects a series that is not an object', () => {
        expect(() => readChartBlock({ type: 'bar', labels: ['A'], series: [[1, 2]] })).toThrow(
            'Series 1 must be an object',
        );
    });

    it('rejects a series without data', () => {
        expect(() =>
            readChartBlock({ type: 'bar', labels: ['A'], series: [{ title: 'Values' }] }),
        ).toThrow('Series 1 needs a data list');
    });

    it('rejects boolean values', () => {
        expect(() =>
            readChartBlock({ type: 'bar', labels: ['A'], series: [{ data: [true] }] }),
        ).toThrow('values must be numbers');
    });

    it('rejects a wrongly typed option', () => {
        expect(() =>
            readChartBlock({
                type: 'bar',
                padding: 'wide',
                labels: ['A'],
                series: [{ data: [1] }],
            }),
        ).toThrow('padding must be a number');
    });

    it('rejects an invalid legend position', () => {
        expect(() =>
            readChartBlock({
                type: 'bar',
                legendPosition: 'middle',
                labels: ['A'],
                series: [{ data: [1] }],
            }),
        ).toThrow('legendPosition must be one of');
    });

    it('rejects an invalid index axis', () => {
        expect(() =>
            readChartBlock({
                type: 'bar',
                indexAxis: 'z',
                labels: ['A'],
                series: [{ data: [1] }],
            }),
        ).toThrow('indexAxis must be x or y');
    });
});
