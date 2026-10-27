# Chart.js Next

Interactive charts in [Obsidian](https://obsidian.md), rendered with Chart.js 4.

## Usage

Add a `chartjs` code block to a note and describe the chart in YAML:

````md
```chartjs
type: bar
labels: [Q1, Q2, Q3, Q4]
series:
  - title: Revenue
    data: [10, 20, 15, 30]
width: 80%
```
````

Bar, line, pie, doughnut, radar, polar area, bubble, scatter and sankey charts
are supported. The shared palette colors one entry per dataset, or one per
category for pie, doughnut and polar area. Right-click a rendered chart to copy
it to the clipboard as an image.

## Mermaid diagrams

Mermaid rendering lives in the separate `mermaid-pele` plugin. It renders
`mermaid` blocks and keeps `chart-mermaid` blocks working, so notes written for
older versions keep rendering once it is installed. This plugin handles
`chartjs` blocks.

## Installation

The plugin is not in the community list yet. To install a build:

1. Copy `main.js`, `manifest.json` and `styles.css` into
   `<vault>/.obsidian/plugins/chartjs-next/`.
2. Enable **Chart.js Next** under **Settings → Community plugins**.

## License

MIT, see [LICENSE](LICENSE). The plugin started as a fork of
[obsidian-charts](https://github.com/phibr0/obsidian-charts) by phibr0; the
implementation has since been rewritten.
