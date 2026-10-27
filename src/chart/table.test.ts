import { describe, expect, it } from 'vitest';
import { extractTableData } from './table';

const TABLE = `| Quarter | Revenue | Cost |
| --- | --- | --- |
| Q1 | 10 | 4 |
| Q2 | 20 | 8 |`;

describe('extractTableData', () => {
    it('takes labels from the first column and one series per column', () => {
        const { labels, series } = extractTableData(TABLE);

        expect(labels).toEqual(['Q1', 'Q2']);
        expect(series).toEqual([
            { title: 'Revenue', data: ['10', '20'] },
            { title: 'Cost', data: ['4', '8'] },
        ]);
    });

    it('supports rows as layout', () => {
        const { series } = extractTableData(TABLE, 'rows');

        expect(series.map((entry) => entry.title)).toContain('Q1');
    });

    it('keeps only the selected columns', () => {
        const { series } = extractTableData(TABLE, 'columns', ['Cost']);

        expect(series).toEqual([{ title: 'Cost', data: ['4', '8'] }]);
    });

    it('rejects an empty table', () => {
        expect(() => extractTableData('')).toThrow('no table');
    });
});
