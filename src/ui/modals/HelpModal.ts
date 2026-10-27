import { Modal } from 'obsidian';

const EXAMPLE = `\`\`\`chartjs
type: bar
labels: [Q1, Q2, Q3, Q4]
series:
  - title: Revenue
    data: [10, 20, 15, 30]
width: 80%
\`\`\``;

/** Shows usage instructions for the chart code block. */
export class HelpModal extends Modal {
    onOpen(): void {
        const { contentEl } = this;
        contentEl.addClass('chartjs-help');

        contentEl.createEl('h2', { text: 'Chart.js Next — how to use' });
        contentEl.createEl('p', {
            text: 'Add a chartjs fenced code block to a note and describe the chart in YAML.',
        });
        contentEl.createEl('pre').createEl('code', { text: EXAMPLE });

        const notes = contentEl.createEl('ul');
        notes.createEl('li', {
            text: 'Bar, line, pie, doughnut, radar, polar area, bubble, scatter and sankey are supported.',
        });
        notes.createEl('li', {
            text: 'One palette entry colours each dataset; pie, doughnut and polar area colour each category.',
        });
        notes.createEl('li', {
            text: 'Point a block at a markdown table with id to keep chart and table in sync.',
        });
        notes.createEl('li', { text: 'Right-click a rendered chart to copy it as an image.' });
        notes.createEl('li', {
            text: 'Diagram blocks live in the separate mermaid-pele plugin.',
        });

        const footer = contentEl.createDiv({ cls: 'chartjs-help-footer' });
        footer.createEl('button', { text: 'Close' }).addEventListener('click', () => this.close());
    }

    onClose(): void {
        this.contentEl.empty();
    }
}
