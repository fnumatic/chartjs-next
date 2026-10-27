import type { AxisScaleOptions, ChartScales, RadialScaleOptions } from './options';
import type { ChartTheme } from './theme';
import type { ChartBlock } from './types';

/**
 * A cartesian chart has a domain axis that carries labels or time and a
 * measure axis that carries the values. `indexAxis: y` swaps them.
 */
type AxisRole = 'domain' | 'measure';

const AXIS_ROLES: Record<'x' | 'y', Record<'x' | 'y', AxisRole>> = {
    x: { x: 'domain', y: 'measure' },
    y: { x: 'measure', y: 'domain' },
};

/** Time scales are expressed as a unit, e.g. `month`, not as a callback. */
const timeScale = (unit?: string): Partial<AxisScaleOptions> =>
    unit ? { type: 'time', time: { unit } } : {};

/** The block keys that belong to one physical axis. */
const axisValues = (block: ChartBlock, axis: 'x' | 'y') =>
    axis === 'x'
        ? {
              min: block.xMin,
              max: block.xMax,
              reverse: block.xReverse,
              display: block.xDisplay,
              tickDisplay: block.xTickDisplay,
              tickPadding: block.xTickPadding,
              title: block.xTitle,
          }
        : {
              min: block.yMin,
              max: block.yMax,
              reverse: block.yReverse,
              display: block.yDisplay,
              tickDisplay: block.yTickDisplay,
              tickPadding: block.yTickPadding,
              title: block.yTitle,
          };

const buildAxis = (
    block: ChartBlock,
    theme: ChartTheme,
    axis: 'x' | 'y',
    role: AxisRole,
): AxisScaleOptions => {
    const values = axisValues(block, axis);

    return {
        min: values.min,
        max: values.max,
        reverse: values.reverse,
        display: values.display,
        stacked: block.stacked,
        grid: { color: theme.gridColor },
        ticks: { display: values.tickDisplay, padding: values.tickPadding },
        title: { display: values.title !== undefined, text: values.title },
        ...(role === 'measure' ? { beginAtZero: block.beginAtZero } : {}),
        ...(role === 'domain' ? timeScale(block.time) : {}),
    };
};

/** Builds the x and y scales of a cartesian chart, roles derived from indexAxis. */
export function cartesianScales(block: ChartBlock, theme: ChartTheme): ChartScales {
    const roles = AXIS_ROLES[block.indexAxis === 'y' ? 'y' : 'x'];

    return {
        x: buildAxis(block, theme, 'x', roles.x),
        y: buildAxis(block, theme, 'y', roles.y),
    };
}

/** Builds the single radial scale of radar and polar area charts. */
export function radialScale(block: ChartBlock, theme: ChartTheme): RadialScaleOptions {
    return {
        grid: { color: theme.gridColor },
        beginAtZero: block.beginAtZero,
        max: block.rMax,
        min: block.rMin,
        ticks: { backdropColor: theme.gridColor },
    };
}
