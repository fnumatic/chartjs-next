import chroma from 'chroma-js';

const DEFAULT_ALPHA = 0.25;

/**
 * Returns the same colors with reduced opacity, used for chart fills.
 * Invalid colors throw inside chroma and surface as a render error.
 */
export function withAlpha(colors: string[], alpha: number = DEFAULT_ALPHA): string[] {
    if (Number.isNaN(alpha)) {
        throw new TypeError('The transparency value must be a number');
    }

    return colors.map((color) => chroma(color.trim()).alpha(alpha).hex());
}

/**
 * Converts palette entries to the six digit hex the colour input understands.
 * Entries chroma cannot parse, such as `var(--color)`, are kept as they are.
 */
export function normalizePalette(colors: string[]): string[] {
    return colors.map((color) => {
        try {
            return chroma(color.trim()).hex();
        } catch {
            return color;
        }
    });
}
