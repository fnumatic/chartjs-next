import { parseYaml } from 'obsidian';
import type {
    ChartBlock,
    ChartLabel,
    ChartType,
    LegendPosition,
    Series,
    SeriesDatum,
} from './types';
import { CHART_TYPES, LEGEND_POSITIONS } from './types';

/**
 * Turns the raw YAML of a block into a `ChartBlock`.
 *
 * YAML is unchecked input: every key is verified here, so the rest of the
 * plugin can rely on the declared types instead of casting.
 */

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

const fail = (message: string): never => {
    throw new Error(message);
};

const readString = (value: unknown, name: string): string | undefined => {
    if (value === undefined || value === null) {
        return undefined;
    }
    if (typeof value !== 'string') {
        return fail(`${name} must be text.`);
    }
    return value;
};

const readNumber = (value: unknown, name: string): number | undefined => {
    if (value === undefined || value === null) {
        return undefined;
    }
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        return fail(`${name} must be a number.`);
    }
    return value;
};

const readBoolean = (value: unknown, name: string): boolean | undefined => {
    if (value === undefined || value === null) {
        return undefined;
    }
    if (typeof value !== 'boolean') {
        return fail(`${name} must be true or false.`);
    }
    return value;
};

const readLabels = (value: unknown): ChartLabel[] => {
    if (!Array.isArray(value)) {
        return fail('labels must be a list.');
    }

    return value.map((label) => {
        if (typeof label === 'string' || typeof label === 'number') {
            return label;
        }
        if (label instanceof Date) {
            return label.toISOString();
        }
        return fail('labels may only contain text, numbers or dates.');
    });
};

const readDatum = (value: unknown): SeriesDatum => {
    if (value === null || typeof value === 'number' || typeof value === 'string') {
        return value;
    }
    if (value instanceof Date) {
        return value.toISOString();
    }
    if (Array.isArray(value) || isRecord(value)) {
        return value as SeriesDatum;
    }
    return fail('values must be numbers, text, points or tuples.');
};

const readSeries = (value: unknown): Series[] => {
    if (!Array.isArray(value)) {
        return fail('series must be a list.');
    }

    return value.map((entry, index) => {
        const position = index + 1;
        if (!isRecord(entry)) {
            return fail(`Series ${position} must be an object.`);
        }

        const title = readString(entry.title, `Series ${position} title`);
        if (!Array.isArray(entry.data)) {
            throw new Error(`Series ${position} needs a data list.`);
        }

        const { title: _title, data, ...options } = entry;

        return { ...options, title, data: data.map(readDatum) };
    });
};

const readType = (value: unknown): ChartType => {
    if (typeof value !== 'string' || !CHART_TYPES.has(value as ChartType)) {
        return fail(`Unknown chart type. Use one of: ${[...CHART_TYPES].join(', ')}.`);
    }
    return value as ChartType;
};

const readLegendPosition = (value: unknown): LegendPosition | undefined => {
    if (value === undefined || value === null) {
        return undefined;
    }
    if (typeof value !== 'string' || !LEGEND_POSITIONS.has(value as LegendPosition)) {
        return fail(`legendPosition must be one of: ${[...LEGEND_POSITIONS].join(', ')}.`);
    }
    return value as LegendPosition;
};

const readStringList = (value: unknown, name: string): string[] | undefined => {
    if (value === undefined || value === null) {
        return undefined;
    }
    if (!Array.isArray(value) || value.some((entry) => typeof entry !== 'string')) {
        return fail(`${name} must be a list of text.`);
    }
    return value as string[];
};

const NUMBER_FIELDS = [
    ['padding', 'padding'],
    ['tension', 'tension'],
    ['transparency', 'transparency'],
    ['xMin', 'xMin'],
    ['xMax', 'xMax'],
    ['xTickPadding', 'xTickPadding'],
    ['yMin', 'yMin'],
    ['yMax', 'yMax'],
    ['yTickPadding', 'yTickPadding'],
    ['rMin', 'rMin'],
    ['rMax', 'rMax'],
] as const satisfies readonly (readonly [keyof ChartBlock, string])[];

const BOOLEAN_FIELDS = [
    ['legend', 'legend'],
    ['stacked', 'stacked'],
    ['fill', 'fill'],
    ['spanGaps', 'spanGaps'],
    ['beginAtZero', 'beginAtZero'],
    ['labelColors', 'labelColors'],
    ['bestFit', 'bestFit'],
    ['xReverse', 'xReverse'],
    ['xDisplay', 'xDisplay'],
    ['xTickDisplay', 'xTickDisplay'],
    ['yReverse', 'yReverse'],
    ['yDisplay', 'yDisplay'],
    ['yTickDisplay', 'yTickDisplay'],
] as const satisfies readonly (readonly [keyof ChartBlock, string])[];

const STRING_FIELDS = [
    ['id', 'id'],
    ['file', 'file'],
    ['width', 'width'],
    ['textColor', 'textColor'],
    ['time', 'time'],
    ['xTitle', 'xTitle'],
    ['yTitle', 'yTitle'],
    ['bestFitTitle', 'bestFitTitle'],
] as const satisfies readonly (readonly [keyof ChartBlock, string])[];

/** Validates an already parsed YAML value. */
export function readChartBlock(value: unknown): ChartBlock {
    if (!isRecord(value)) {
        throw new Error('Missing type, labels or series');
    }

    const block: ChartBlock = { type: readType(value.type) };

    for (const [field, name] of NUMBER_FIELDS) {
        const number = readNumber(value[field], name);
        if (number !== undefined) {
            Object.assign(block, { [field]: number });
        }
    }

    for (const [field, name] of BOOLEAN_FIELDS) {
        const flag = readBoolean(value[field], name);
        if (flag !== undefined) {
            Object.assign(block, { [field]: flag });
        }
    }

    for (const [field, name] of STRING_FIELDS) {
        const text = readString(value[field], name);
        if (text !== undefined) {
            Object.assign(block, { [field]: text });
        }
    }

    block.legendPosition = readLegendPosition(value.legendPosition);

    if (value.layout !== undefined && value.layout !== 'columns' && value.layout !== 'rows') {
        throw new Error('layout must be columns or rows.');
    }
    block.layout = value.layout;

    block.select = readStringList(value.select, 'select');

    if (value.indexAxis !== undefined && value.indexAxis !== 'x' && value.indexAxis !== 'y') {
        throw new Error('indexAxis must be x or y.');
    }
    block.indexAxis = value.indexAxis;

    if (value.labels !== undefined) {
        block.labels = readLabels(value.labels);
    }
    if (value.series !== undefined) {
        block.series = readSeries(value.series);
    }

    if (!block.id && (!block.labels || !block.series)) {
        throw new Error('Missing type, labels or series');
    }

    return block;
}

/** Parses and validates the YAML source of a block. */
export function parseChartBlock(source: string): ChartBlock {
    return readChartBlock(parseYaml(source.replace(/\t/g, '    ')));
}
