import type { ChartPluginSettings } from 'src/settings';

/** Values a chart needs from the surrounding Obsidian window. */
export interface ChartTheme {
    /** Border colors, either from the settings or from theme variables. */
    colors: string[];
    gridColor: string;
    textColor: string;
    fontFamily: string;
}

const readCssVar = (style: CSSStyleDeclaration, name: string): string =>
    style.getPropertyValue(name).trim();

/**
 * Collects `--chart-color-1`, `--chart-color-2`, ... until the first gap.
 */
function readThemeColors(style: CSSStyleDeclaration): string[] {
    const colors: string[] = [];

    for (let index = 1; ; index++) {
        const color = readCssVar(style, `--chart-color-${index}`);
        if (!color) {
            return colors;
        }
        colors.push(color);
    }
}

/**
 * Resolves the palette and the neutral colors from the element a chart is
 * rendered into, so themes and CSS snippets apply without a reload.
 */
export function resolveTheme(
    el: HTMLElement,
    settings: Pick<ChartPluginSettings, 'colors' | 'themeable'>,
    textColor?: string,
): ChartTheme {
    const style = getComputedStyle(el);
    const themeColors = settings.themeable ? readThemeColors(style) : [];

    return {
        colors: themeColors.length > 0 ? themeColors : settings.colors,
        gridColor: readCssVar(style, '--background-modifier-border'),
        textColor: textColor || readCssVar(style, '--text-muted'),
        fontFamily: readCssVar(style, '--font-interface') || 'sans-serif',
    };
}
