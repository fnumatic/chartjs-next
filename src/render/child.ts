import { MarkdownRenderChild, Menu, Notice } from 'obsidian';
import type { TFile } from 'obsidian';
import type { Chart as ChartInstance } from 'chart.js';
import type { ChartBlock } from 'src/chart/types';
import { copyChartImage } from 'src/export/image';
import type { ChartRenderer } from './renderer';
import { renderError } from './errors';
import { readTableBlock } from './tableSource';

/**
 * Owns one rendered chart: resolves table-backed blocks, re-renders on theme
 * or table changes, and offers the image export in the context menu.
 */
export class ChartBlockChild extends MarkdownRenderChild {
    private chart: ChartInstance | null = null;
    private drawToken = 0;

    constructor(
        containerEl: HTMLElement,
        private readonly block: ChartBlock,
        private readonly renderer: ChartRenderer,
        private readonly sourcePath: string,
    ) {
        super(containerEl);
    }

    onload(): void {
        this.registerDomEvent(this.containerEl, 'contextmenu', (event) => this.openMenu(event));

        if (this.block.id) {
            this.registerEvent(
                this.renderer.plugin.app.metadataCache.on('changed', (file: TFile) => {
                    if (this.matches(file)) {
                        void this.draw();
                    }
                }),
            );
        }

        this.registerEvent(
            this.renderer.plugin.app.workspace.on('css-change', () => {
                void this.draw();
            }),
        );

        void this.draw();
    }

    onunload(): void {
        this.disposeChart();
    }

    private matches(file: TFile): boolean {
        const target = this.block.file;
        if (target) {
            return file.basename === target || file.path === target;
        }
        return file.path === this.sourcePath;
    }

    private disposeChart(): void {
        this.chart?.destroy();
        this.chart = null;
    }

    /** Resolves the block and replaces whatever the container shows. */
    private async draw(): Promise<void> {
        const token = ++this.drawToken;
        this.disposeChart();
        this.containerEl.empty();

        let block = this.block;
        if (block.id) {
            try {
                const table = await readTableBlock(
                    this.renderer.plugin.app,
                    block,
                    this.sourcePath,
                );
                block = { ...block, labels: table.labels, series: table.series };
            } catch (error) {
                renderError(error, this.containerEl);
                return;
            }
        }

        if (token !== this.drawToken) {
            return;
        }

        this.chart = await this.renderer.render(block, this.containerEl);
    }

    private openMenu(event: MouseEvent): void {
        if (!this.chart) {
            return;
        }

        event.preventDefault();
        const menu = new Menu();
        menu.addItem((item) =>
            item
                .setTitle('Copy chart as image')
                .setIcon('image')
                .onClick(() => {
                    void this.copyImage();
                }),
        );
        menu.showAtMouseEvent(event);
    }

    private async copyImage(): Promise<void> {
        const canvas = this.chart?.canvas;
        if (!canvas) {
            return;
        }

        try {
            await copyChartImage(canvas, this.renderer.plugin.settings.imageSettings);
            void new Notice('Chart copied to the clipboard');
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            void new Notice(`Could not copy the chart: ${message}`);
        }
    }
}
