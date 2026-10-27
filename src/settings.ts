/** Persisted plugin settings. */
export interface ChartPluginSettings {
    /** Border colors used when the theme does not provide its own. */
    colors: string[];
    /** Use `--chart-color-N` variables from the theme instead of `colors`. */
    themeable: boolean;
    /** Format and quality for the image export. */
    imageSettings: ImageOptions;
}

export interface ImageOptions {
    format: 'image/jpeg' | 'image/png' | 'image/webp';
    quality: number;
}

export const DEFAULT_SETTINGS: ChartPluginSettings = {
    colors: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40'],
    themeable: false,
    imageSettings: {
        format: 'image/png',
        quality: 0.92,
    },
};
