import { Plugin } from 'obsidian';
import type { MarkdownPostProcessorContext } from 'obsidian';
import { withBestFit } from './chart/bestFit';
import { normalizePalette } from './chart/colors';
import { parseChartBlock } from './chart/parse';
import type { ChartBlock } from './chart/types';
import { ChartBlockChild } from './render/child';
import { renderError } from './render/errors';
import { ChartRenderer } from './render/renderer';
import { DEFAULT_SETTINGS } from './settings';
import type { ChartPluginSettings } from './settings';
import { ChartSettingTab } from './ui/settingsTab';

import './styles.css';

export default class ChartPlugin extends Plugin {
    settings!: ChartPluginSettings;
    renderer!: ChartRenderer;

    async onload(): Promise<void> {
        await this.loadSettings();

        this.renderer = new ChartRenderer(this);

        window.renderChart = async (data: unknown, el: HTMLElement) =>
            this.renderer.renderRaw(data, el);

        this.addSettingTab(new ChartSettingTab(this.app, this));

        this.registerMarkdownCodeBlockProcessor('chartjs', (source, el, ctx) =>
            this.process(source, el, ctx),
        );
    }

    onunload(): void {
        // The hook points into this plugin; leaving it would keep stale state alive.
        delete window.renderChart;
    }

    async loadSettings(): Promise<void> {
        const stored = (await this.loadData()) as Partial<ChartPluginSettings> | null;
        this.settings = Object.assign({}, DEFAULT_SETTINGS, stored);
        // Older versions stored rgba() strings; the settings colour input needs hex.
        this.settings.colors = normalizePalette(this.settings.colors);
    }

    async saveSettings(): Promise<void> {
        await this.saveData(this.settings);
    }

    private process(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
        let block: ChartBlock;

        try {
            block = withBestFit(parseChartBlock(source));
        } catch (error) {
            renderError(error, el);
            return;
        }

        // Wait for the workspace so CSS variables and element widths exist.
        this.app.workspace.onLayoutReady(() => {
            ctx.addChild(new ChartBlockChild(el, block, this.renderer, ctx.sourcePath));
        });
    }
}
