import type { LegendPosition } from './types';

/**
 * The option shape this plugin builds.
 *
 * Chart.js types allow far more, but every key here is one the plugin actually
 * writes. Keeping the shape narrow catches typos and wrong value types before
 * the configuration crosses into Chart.js.
 */

export interface ChartGridOptions {
    color: string;
}

export interface ChartTickOptions {
    display?: boolean;
    padding?: number;
    backdropColor?: string;
}

export interface ChartTitleOptions {
    display?: boolean;
    text?: string;
}

/** One axis of a bar, line, bubble or scatter chart. */
export interface AxisScaleOptions {
    min?: number;
    max?: number;
    reverse?: boolean;
    display?: boolean;
    stacked?: boolean;
    grid: ChartGridOptions;
    ticks: ChartTickOptions;
    title: ChartTitleOptions;
    beginAtZero?: boolean;
    type?: 'time';
    time?: { unit: string };
}

/** The single axis of a radar or polar area chart. */
export interface RadialScaleOptions {
    grid: ChartGridOptions;
    beginAtZero?: boolean;
    min?: number;
    max?: number;
    ticks: ChartTickOptions;
}

export interface ChartScales {
    x?: AxisScaleOptions;
    y?: AxisScaleOptions;
    r?: RadialScaleOptions;
}

export interface ChartOptions {
    animation: { duration: number };
    color: string;
    font: { family: string };
    layout: { padding?: number };
    plugins: {
        legend: {
            display: boolean;
            position: LegendPosition;
        };
    };
    indexAxis?: 'x' | 'y';
    scales?: ChartScales;
}
