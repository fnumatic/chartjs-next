/**
 * Data model for a `chartjs` block.
 *
 * The keys mirror the YAML a note author writes. Everything except `type`,
 * `labels` and `series` is optional, and a block may instead point at a table
 * through `id` (plus optional `file`, `layout` and `select`).
 */

export type ChartType =
    | 'bar'
    | 'line'
    | 'pie'
    | 'doughnut'
    | 'radar'
    | 'polarArea'
    | 'bubble'
    | 'scatter'
    | 'sankey';

export type LegendPosition = 'top' | 'left' | 'bottom' | 'right' | 'chartArea';

export const CHART_TYPES: ReadonlySet<ChartType> = new Set([
    'bar',
    'line',
    'pie',
    'doughnut',
    'radar',
    'polarArea',
    'bubble',
    'scatter',
    'sankey',
]);

export const LEGEND_POSITIONS: ReadonlySet<LegendPosition> = new Set([
    'top',
    'left',
    'bottom',
    'right',
    'chartArea',
]);

/** A label as Chart.js accepts it. */
export type ChartLabel = string | number;

/** A point of a cartesian chart, for example in scatter and bubble data. */
export interface PointDatum {
    x: number | string;
    y: number;
    r?: number;
}

/** One value of a regular dataset. */
export type DataPoint = number | string | null | [number, number] | PointDatum;

/** One connection of a sankey chart. */
export type SankeyDatum =
    | { from: string | number; to: string | number; flow: number | string }
    | [string | number, number | string, string | number];

/** Anything a series may hold; the type decides how it is read. */
export type SeriesDatum = DataPoint | SankeyDatum;

const CARTESIAN_TYPES: ReadonlySet<ChartType> = new Set(['bar', 'line', 'bubble', 'scatter']);
const RADIAL_TYPES: ReadonlySet<ChartType> = new Set(['radar', 'polarArea']);
const CATEGORICAL_TYPES: ReadonlySet<ChartType> = new Set(['pie', 'doughnut', 'polarArea']);

export const isCartesianChart = (type: ChartType): boolean => CARTESIAN_TYPES.has(type);

export const isRadialChart = (type: ChartType): boolean => RADIAL_TYPES.has(type);

export const usesCategoryColors = (type: ChartType): boolean => CATEGORICAL_TYPES.has(type);

export interface Series {
    /** Legend label of the dataset. */
    title?: string;
    data: SeriesDatum[];
    /** Any additional Chart.js dataset option is passed through untouched. */
    [option: string]: unknown;
}

export interface ChartBlock {
    type: ChartType;
    labels?: ChartLabel[];
    series?: Series[];

    /** Section id of a markdown table that supplies labels and series. */
    id?: string;
    /** Note that contains the table; defaults to the note with the block. */
    file?: string;
    /** Table orientation. */
    layout?: 'columns' | 'rows';
    /** Column or row titles to keep. */
    select?: string[];

    /** CSS width of the chart container, for example `80%`. */
    width?: string;

    legend?: boolean;
    legendPosition?: LegendPosition;
    textColor?: string;
    padding?: number;

    stacked?: boolean;
    fill?: boolean;
    tension?: number;
    spanGaps?: boolean;
    indexAxis?: 'x' | 'y';
    beginAtZero?: boolean;
    /** Alpha value for the generated fill colors. */
    transparency?: number;
    /** Give every dataset the full palette instead of one color. */
    labelColors?: boolean;

    /** Unit for a time axis, for example `month`. */
    time?: string;

    xMin?: number;
    xMax?: number;
    xReverse?: boolean;
    xDisplay?: boolean;
    xTickDisplay?: boolean;
    xTickPadding?: number;
    xTitle?: string;

    yMin?: number;
    yMax?: number;
    yReverse?: boolean;
    yDisplay?: boolean;
    yTickDisplay?: boolean;
    yTickPadding?: number;
    yTitle?: string;

    rMin?: number;
    rMax?: number;

    /** Add a linear regression series to a line chart. */
    bestFit?: boolean;
    /** Index of the series whose values form the x axis. */
    bestFitNumber?: number;
    bestFitTitle?: string;
}
