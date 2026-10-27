# Chart block specification

This is the contract a `chartjs` block fulfils. The implementation in
`src/chart/` is written against this document, not against an earlier version
of the plugin.

## Fence

    ```chartjs
    type: bar
    labels: [Q1, Q2, Q3]
    series:
      - title: Revenue
        data: [10, 20, 15]
    ```

The body is YAML. Tabs are expanded to four spaces before parsing.

## Required keys

| Key | Type | Meaning |
| --- | --- | --- |
| `type` | string | One of the nine chart types below. |
| `labels` | array | Category labels or x values. |
| `series` | array | One entry per dataset. |

A block that sets `id` reads labels and series from a markdown table instead and
does not need `labels` or `series`. `type` stays required.

A `series` entry needs `data`. Its `title` becomes the dataset label; every other
key is passed to Chart.js untouched.

## Validation

The block is checked before rendering. `type` must be one of the nine names,
scalar keys must hold the type the table below gives, and `series` must be a
list of objects with a `data` list. A violation shows an inline error instead of
a chart; nothing unvalidated reaches Chart.js.

## Chart types

| Type | Dataset shape |
| --- | --- |
| `bar`, `line` | `data` is a number array; two cartesian axes. |
| `radar`, `polarArea` | `data` is a number array; one radial `r` axis. |
| `pie`, `doughnut` | `data` is a number array; no axes. |
| `bubble`, `scatter` | `data` is an array of points; two cartesian axes. |
| `sankey` | `data` is `[from, flow, to]`, `[from, to, flow]` or `{from, flow, to}`. |

## Axes

`bar`, `line`, `bubble` and `scatter` are cartesian: one axis carries labels or
time (domain), the other carries values (measure). With `indexAxis: y` the roles
swap, so `beginAtZero`, bounds, titles and ticks follow the role rather than the
letter. `time` applies to the domain axis only.

`radar` and `polarArea` use a single `r` axis and ignore `time`. `pie` and
`doughnut` have no axes.

## Optional keys

| Key | Type | Default | Effect |
| --- | --- | --- | --- |
| `width` | string | `100%` | CSS width of the chart container. |
| `legend` | boolean | `true` | Show the legend. |
| `legendPosition` | string | `top` | `top`, `left`, `bottom`, `right`, `chartArea`. |
| `textColor` | string | `--text-muted` | Legend and tick color. |
| `padding` | number | — | Padding around the chart. |
| `stacked` | boolean | `false` | Stack bars and lines; changes the fill mode. |
| `fill` | boolean | `false` | Fill the area under a line. |
| `tension` | number | `0` | Line curve tension. |
| `spanGaps` | boolean | `false` | Connect points across missing data. |
| `indexAxis` | string | `x` | `y` turns bar charts horizontal and swaps the axis roles. |
| `beginAtZero` | boolean | `false` | Force the value axis to start at zero. |
| `transparency` | number | `0.25` | Alpha of the generated fill colors. |
| `labelColors` | boolean | `false` | Per-dataset types: every dataset gets the whole palette. |
| `time` | string | — | Unit of the domain axis, e.g. `month`. |
| `xMin`, `xMax`, `yMin`, `yMax` | number | — | Axis bounds. |
| `xReverse`, `yReverse` | boolean | `false` | Reverse the axis. |
| `xDisplay`, `yDisplay` | boolean | `true` | Show the axis. |
| `xTickDisplay`, `yTickDisplay` | boolean | `true` | Show the axis ticks. |
| `xTickPadding`, `yTickPadding` | number | — | Tick spacing. |
| `xTitle`, `yTitle` | string | — | Axis title, display and text. |
| `rMin`, `rMax` | number | — | Radial axis bounds. |
| `bestFit` | boolean | `false` | Add a regression series to a line chart. |
| `bestFitNumber` | number | `0` | Series that supplies the x values. |
| `bestFitTitle` | string | `Line of Best Fit` | Title of the regression series. |

Every other key inside a `series` entry is passed to Chart.js untouched, so
dataset options such as `borderDash` or `pointRadius` work.

## Colors

1. With `themeable` enabled, `--chart-color-1`, `--chart-color-2`, ... are read
   from the rendering element until the first missing index.
2. Otherwise the palette from the settings is used.
3. `backgroundColor` is the same color at `transparency` alpha.
4. `pie`, `doughnut` and `polarArea` color every data point. Their palette
   repeats when there are more values than colors.
5. Every other type colors whole datasets, one palette entry per dataset.
6. With `labelColors`, every dataset of a per-dataset type gets the whole
   palette as an array. `pie`, `doughnut` and `polarArea` keep their per-point
   colors.

Sankey `colorFrom` and `colorTo` accept a map keyed by node name. Missing nodes
fall back to the series color, then to `green`.

In array entries the numeric position decides the order, so `[from, flow, to]`
and `[from, to, flow]` both work. An entry without a source, a target or a
positive numeric flow is rejected with an error instead of a broken chart.

## Table blocks

| Key | Default | Meaning |
| --- | --- | --- |
| `id` | — | Section id of the table. |
| `file` | current note | Note that holds the table. |
| `layout` | `columns` | `columns` or `rows`. |
| `select` | all | Column or row titles to keep. |

The table is cut from the named section. With `columns`, the first column holds
the labels and the header holds the series titles. With `rows`, the header after
the first cell holds the labels and each row is one series. The chart re-renders
when the table changes.

## Best fit

For a line chart with `bestFit`, the x values come from the series named by
`bestFitNumber` and the y values from `labels`. A least squares line is
appended as an extra series. A zero denominator or a zero gradient leaves the
block unchanged.

## Errors

A block that cannot be parsed, resolved or rendered shows an inline message
with the reason and a console hint. One broken block never breaks the note.

## Public hooks

- `window.renderChart(data, el)` renders a Chart.js configuration, or a
  `{ chartOptions, width }` object, into `el`.
- Right-clicking a rendered chart offers "Copy chart as image". The format and
  quality come from the plugin settings.
