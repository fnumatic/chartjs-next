import type { Series } from './types';

export interface TableData {
    labels: string[];
    series: Series[];
}

const isSeparator = (cells: string[]): boolean =>
    cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));

const toCells = (line: string): string[] =>
    line
        .trim()
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((cell) => cell.trim());

/**
 * Reads the table rows of a markdown fragment, dropping the `| --- |` rule.
 */
function readRows(markdown: string): string[][] {
    const rows = markdown
        .split('\n')
        .filter((line) => line.includes('|'))
        .map(toCells)
        .filter((cells) => !isSeparator(cells));

    if (rows.length < 2) {
        throw new Error('The section holds no table');
    }

    return rows;
}

/**
 * Turns a markdown table into labels and one series per column or row.
 *
 * With `columns`, the first column holds the labels and the header holds the
 * series titles. With `rows`, the header after the first cell holds the labels
 * and every following row is one series.
 */
export function extractTableData(
    markdown: string,
    layout: 'columns' | 'rows' = 'columns',
    selected?: string[],
): TableData {
    const [header, ...body] = readRows(markdown);
    const columnTitles = header.slice(1);

    let labels: string[];
    let series: Series[];

    if (layout === 'rows') {
        labels = columnTitles;
        series = body.map((row) => ({ title: row[0], data: row.slice(1) }));
    } else {
        labels = body.map((row) => row[0]);
        series = columnTitles.map((title, index) => ({
            title,
            data: body.map((row) => row[index + 1] ?? ''),
        }));
    }

    if (selected && selected.length > 0) {
        series = series.filter((entry) => selected.includes(entry.title ?? ''));
    }

    return { labels, series };
}
