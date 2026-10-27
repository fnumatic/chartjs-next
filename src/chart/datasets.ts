import type { ChartBlock, Series, SeriesDatum } from './types';
import { usesCategoryColors } from './types';
import type { ChartTheme } from './theme';
import { withAlpha } from './colors';

/** A dataset before it is handed to Chart.js. */
export interface DatasetConfig {
    label: string;
    data: SeriesDatum[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean | 'origin' | '-1';
    tension?: number;
    spanGaps?: boolean;
    /** Any additional Chart.js dataset option is passed through untouched. */
    [option: string]: unknown;
}

interface SankeyContext {
    dataset: { data: Record<string, unknown>[] };
    dataIndex: number;
}

/** Repeats a palette until it covers `count` entries. */
function rotate<T>(values: T[], count: number): T[] {
    if (values.length === 0) {
        return [];
    }

    return Array.from({ length: count }, (_, index) => values[index % values.length]);
}

/** The colors of one block: border colors and their translucent fills. */
interface Palette {
    borders: string[];
    fills: string[];
}

const paletteFor = (block: ChartBlock, theme: ChartTheme): Palette => {
    const borders = theme.colors;

    return { borders, fills: withAlpha(borders, block.transparency) };
};

/** One palette entry per index, wrapping when the palette is shorter. */
const pick = (values: string[], index: number): string | undefined =>
    values.length === 0 ? undefined : values[index % values.length];

const isColorMap = (value: unknown): value is Record<string, string> =>
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every((color) => typeof color === 'string');

/**
 * Sankey accepts a color map in YAML but wants a callback at runtime.
 * Missing entries fall back to the series color, then to green.
 */
function colorResolver(
    map: Record<string, string>,
    fallback: string,
    endpoint: 'from' | 'to',
): (context: SankeyContext) => string {
    return (context) =>
        map[context.dataset.data[context.dataIndex][endpoint] as string] ?? fallback;
}

/**
 * Picks the dataset colors.
 *
 * Pie, doughnut and polar area colour each data point, so one dataset needs a
 * palette entry per value. Every other type colours whole datasets.
 */
function datasetColors(
    block: ChartBlock,
    palette: Palette,
    index: number,
    valueCount: number,
): Pick<DatasetConfig, 'backgroundColor' | 'borderColor'> {
    if (usesCategoryColors(block.type)) {
        return {
            backgroundColor: rotate(palette.fills, valueCount),
            borderColor: rotate(palette.borders, valueCount),
        };
    }

    if (block.labelColors) {
        return { backgroundColor: palette.fills, borderColor: palette.borders };
    }

    const border = pick(palette.borders, index);
    const fill = pick(palette.fills, index);

    return { backgroundColor: fill, borderColor: border };
}

/** Stacked fills start at the origin for the first series and stack later ones. */
function fillMode(block: ChartBlock, index: number): boolean | 'origin' | '-1' {
    if (!block.fill) {
        return false;
    }

    return block.stacked ? (index === 0 ? 'origin' : '-1') : true;
}

function buildDataset(
    series: Series,
    index: number,
    block: ChartBlock,
    palette: Palette,
): DatasetConfig {
    const { title, ...options } = series;

    const dataset: DatasetConfig = {
        label: title ?? '',
        ...datasetColors(block, palette, index, series.data.length),
        borderWidth: 1,
        fill: fillMode(block, index),
        tension: block.tension ?? 0,
        spanGaps: block.spanGaps,
        ...options,
    };

    if (block.type === 'sankey') {
        for (const [key, endpoint] of [
            ['colorFrom', 'from'],
            ['colorTo', 'to'],
        ] as const) {
            const map = options[key];
            if (map === undefined) {
                continue;
            }
            if (!isColorMap(map)) {
                throw new Error(`${key} must map node names to color strings.`);
            }

            dataset[key] = colorResolver(map, pick(palette.borders, index) ?? 'green', endpoint);
        }
    }

    return dataset;
}

/** Turns the YAML series list into Chart.js datasets. */
export function buildDatasets(block: ChartBlock, theme: ChartTheme): DatasetConfig[] {
    const palette = paletteFor(block, theme);

    return (block.series ?? []).map((series, index) => buildDataset(series, index, block, palette));
}
