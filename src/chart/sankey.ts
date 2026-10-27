import type { DatasetConfig } from './datasets';

interface SankeyFlow {
    from: string;
    flow: number;
    to: string;
}

const isNodeName = (value: unknown): value is string | number =>
    typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value));

const isNumeric = (value: unknown): boolean =>
    (typeof value === 'number' || typeof value === 'string') &&
    value !== '' &&
    Number.isFinite(Number(value));

/**
 * Converts one sankey entry into the named fields Chart.js expects.
 *
 * Both `[from, flow, to]` and `[from, to, flow]` appear in the wild, so the
 * order is derived from the position of the number. Anything else is rejected
 * with a message instead of reaching the layout, where a missing flow becomes
 * a crash inside the controller.
 */
function toSankeyFlow(item: unknown, index: number): SankeyFlow {
    const position = index + 1;
    let from: unknown;
    let to: unknown;
    let flow: unknown;

    if (Array.isArray(item) && item.length === 3) {
        const [first, second, third] = item;
        if (isNumeric(second)) {
            [from, flow, to] = [first, second, third];
        } else {
            [from, to, flow] = [first, second, third];
        }
    } else if (typeof item === 'object' && item !== null) {
        ({ from, to, flow } = item as Record<string, unknown>);
    } else {
        throw new Error(`Sankey flow ${position}: use [from, flow, to] or { from, flow, to }.`);
    }

    if (!isNodeName(from) || from === '') {
        throw new Error(`Sankey flow ${position}: the source node is missing.`);
    }
    if (!isNodeName(to) || to === '') {
        throw new Error(`Sankey flow ${position}: the target node is missing.`);
    }
    if (!isNumeric(flow)) {
        throw new Error(`Sankey flow ${position}: the flow must be a number.`);
    }

    const value = Number(flow);
    if (value <= 0) {
        throw new Error(`Sankey flow ${position}: the flow must be greater than zero.`);
    }

    return { from: String(from), flow: value, to: String(to) };
}

/** Converts sankey entries into named fields and rejects unusable ones. */
export function normalizeSankeyData(datasets: DatasetConfig[]): DatasetConfig[] {
    return datasets.map((dataset) => ({
        ...dataset,
        data: Array.isArray(dataset.data)
            ? dataset.data.map((item, index) => toSankeyFlow(item, index))
            : dataset.data,
    }));
}
