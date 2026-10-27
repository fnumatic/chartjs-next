import type { App } from 'obsidian';
import { PluginSettingTab, Setting } from 'obsidian';
import { DEFAULT_SETTINGS } from '../settings';
import type ChartPlugin from '../main';
import { HelpModal } from './modals/HelpModal';

export class ChartSettingTab extends PluginSettingTab {
    plugin: ChartPlugin;

    constructor(app: App, plugin: ChartPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Settings - Chart.js Next' });

        this.renderGeneral(containerEl);
        this.renderColors(containerEl);
        this.renderImage(containerEl);
    }

    private renderGeneral(containerEl: HTMLElement): void {
        new Setting(containerEl)
            .setName('Help')
            .setDesc('How to create charts in your notes.')
            .addButton((button) =>
                button.setButtonText('Show help').onClick(() => {
                    new HelpModal(this.app).open();
                }),
            );
    }

    private renderColors(containerEl: HTMLElement): void {
        const { plugin } = this;

        containerEl.createEl('h3', { text: 'Chart palette' });
        containerEl.createEl('p', {
            cls: 'setting-item-description',
            text: 'Used per dataset for bar, line, bubble, scatter, radar and sankey. Used per category for pie, doughnut and polar area, where the palette repeats when there are more values than colors.',
        });

        new Setting(containerEl)
            .setName('Use theme colors')
            .setDesc('Read --chart-color-1, --chart-color-2, ... from your theme or snippet.')
            .addToggle((toggle) =>
                toggle.setValue(plugin.settings.themeable).onChange(async (value) => {
                    plugin.settings.themeable = value;
                    await this.commit();
                }),
            );

        if (plugin.settings.themeable) {
            return;
        }

        plugin.settings.colors.forEach((color, index) => {
            this.renderColorRow(containerEl, color, index);
        });

        new Setting(containerEl).addButton((button) =>
            button.setButtonText('Add color').onClick(async () => {
                plugin.settings.colors.push('#ffffff');
                await this.commit();
            }),
        );
    }

    /** One color entry: swatch, native picker, remove and reset. */
    private renderColorRow(containerEl: HTMLElement, color: string, index: number): void {
        const { plugin } = this;
        const name = document.createDocumentFragment();
        name.createSpan({ text: '●', attr: { style: `color: ${color}` } });
        name.appendText(` Color #${index + 1}`);

        const setting = new Setting(containerEl)
            .setName(name)
            .setDesc('Border color for this palette entry.');

        const input = setting.controlEl.createEl('input', {
            type: 'color',
            value: color,
            cls: 'chart-color-input',
            attr: { 'aria-label': `Color #${index + 1}` },
        });
        input.addEventListener('change', async () => {
            plugin.settings.colors[index] = input.value;
            await this.commit();
        });

        setting
            .addExtraButton((button) => {
                button
                    .setIcon('trash')
                    .setTooltip('Remove')
                    .onClick(async () => {
                        plugin.settings.colors = plugin.settings.colors.filter(
                            (_, position) => position !== index,
                        );
                        await this.commit();
                    });
                button.setDisabled(plugin.settings.colors.length === 1);
            })
            .addExtraButton((button) =>
                button
                    .setIcon('reset')
                    .setTooltip('Reset to default')
                    .onClick(async () => {
                        plugin.settings.colors[index] = DEFAULT_SETTINGS.colors[index] ?? '#ffffff';
                        await this.commit();
                    }),
            );
    }

    /** Saves and rebuilds the tab, so dependent rows reflect the new state. */
    private async commit(): Promise<void> {
        await this.plugin.saveSettings();
        this.display();
    }

    private renderImage(containerEl: HTMLElement): void {
        const { plugin } = this;

        containerEl.createEl('h3', { text: 'Image export' });
        containerEl.createEl('p', {
            cls: 'setting-item-description',
            text: 'Right-click a rendered chart and choose "Copy chart as image" to put it on the clipboard.',
        });

        new Setting(containerEl)
            .setName('Image format')
            .setDesc('Format used when copying a chart.')
            .addDropdown((dropdown) =>
                dropdown
                    .addOptions({
                        'image/png': 'png',
                        'image/jpeg': 'jpeg',
                        'image/webp': 'webp',
                    })
                    .setValue(plugin.settings.imageSettings.format)
                    .onChange(async (value) => {
                        plugin.settings.imageSettings.format =
                            value as typeof plugin.settings.imageSettings.format;
                        await plugin.saveSettings();
                    }),
            );

        new Setting(containerEl)
            .setName('Image quality')
            .setDesc('Quality for lossy formats.')
            .addSlider((slider) =>
                slider
                    .setDynamicTooltip()
                    .setLimits(0.01, 1, 0.01)
                    .setValue(plugin.settings.imageSettings.quality)
                    .onChange(async (value) => {
                        plugin.settings.imageSettings.quality = value;
                        await plugin.saveSettings();
                    }),
            );
    }
}
