# Test Charts for Chart.js Next

This file contains test code blocks for all supported Chart.js diagram types.

## Basic Charts

### Bar Chart
```chartjs
type: bar
labels: [January, February, March, April, May]
width: 60%
series:
  - title: Sales
    data: [10, 25, 15, 40, 30]
```

### Line Chart
```chartjs
type: line
labels: [Q1, Q2, Q3, Q4]
width: 60%
series:
  - title: Revenue
    data: [1000, 2500, 1800, 3500]
tension: 0.4
```

### Pie Chart
```chartjs
type: pie
labels: [Red, Blue, Yellow]
width: 60%
series:
  - title: Colors
    data: [300, 50, 100]
```

### Doughnut Chart
```chartjs
type: doughnut
labels: [A, B, C, D]
width: 60%
series:
  - title: Distribution
    data: [25, 25, 25, 25]
```

## Advanced Charts

### Radar Chart
```chartjs
type: radar
labels: [Speed, Reliability, Comfort, Safety, Efficiency]
width: 60%
series:
  - title: Car A
    data: [80, 90, 70, 85, 75]
```

### Stacked Bar Chart
```chartjs
type: bar
labels: [2021, 2022, 2023]
width: 60%
stacked: true
series:
  - title: Product A
    data: [100, 150, 200]
  - title: Product B
    data: [80, 120, 180]
```

### Horizontal Bar Chart
```chartjs
type: bar
indexAxis: y
labels: [Cat, Dog, Bird, Fish]
width: 60%
series:
  - title: Pets
    data: [50, 35, 25, 15]
```

### Scatter Chart
```chartjs
type: scatter
labels: []
width: 60%
series:
  - title: Points
    data: [[10, 20], [15, 35], [25, 10], [30, 40]]
```

### Bubble Chart
```chartjs
type: bubble
labels: []
width: 60%
series:
  - title: Bubbles
    data: [[10, 20, 5], [15, 35, 10], [25, 10, 8]]
```

### Polar Area Chart
```chartjs
type: polarArea
labels: [North, East, South, West]
width: 60%
series:
  - title: Regions
    data: [30, 40, 20, 10]
```

### Sankey Diagram
```chartjs
type: sankey
labels: []
width: 60%
series:
  - title: Flows
    data:
      - [Source A, Target X, 50]
      - [Source A, Target Y, 30]
      - [Source B, Target X, 20]
      - [Source X, Target Final, 70]
      - [Source Y, Target Final, 30]
```

## Time Series

### Chart with Time Scale
```chartjs
type: line
time: day
labels: [2024-01-01, 2024-01-02, 2024-01-03, 2024-01-04]
width: 60%
series:
  - title: Daily Visits
    data: [100, 150, 120, 180]
```

## Statistical Features

### Chart with Best Fit Line
```chartjs
type: line
bestFit: true
labels: [1, 2, 3, 4, 5]
width: 60%
series:
  - title: Linear Data
    data: [10, 15, 13, 17, 16]
```

## Chart Options

### Filled Line Chart
```chartjs
type: line
fill: true
labels: [A, B, C, D]
width: 60%
series:
  - title: Values
    data: [10, 25, 20, 35]
```

### Chart with Custom Range
```chartjs
type: bar
yMin: 0
yMax: 100
xMin: 0
xMax: 5
labels: [1, 2, 3, 4]
width: 60%
series:
  - title: Test
    data: [10, 50, 30, 70]
```

### Chart with Axis Titles
```chartjs
type: line
xTitle: Time (days)
yTitle: Temperature (C)
labels: [Mon, Tue, Wed, Thu, Fri]
width: 60%
series:
  - title: Week 1
    data: [20, 22, 25, 23, 28]
```

### Chart with Grid Toggle
```chartjs
type: bar
labels: [A, B, C]
width: 60%
series:
  - title: Test
    data: [10, 20, 30]
yDisplay: true
xDisplay: true
```

## External Data

### Chart from External Table
```chartjs
type: bar
id: my-table-id
file: test-vault/notes/data.md
width: 60%
layout: columns
```

## Styling Tests

### Theme Colors
The palette comes from the `themeable` setting, not from the block.
```chartjs
type: bar
labels: [A, B, C]
width: 60%
series:
  - title: Test
    data: [10, 20, 30]
```

### Custom Colors
```chartjs
type: pie
labels: [X, Y, Z]
width: 60%
series:
  - title: Test
    data: [25, 25, 50]
    backgroundColor: ["#ff0000", "#00ff00", "#0000ff"]
```

### Chart Transparency
```chartjs
type: bar
labels: [A, B, C]
transparency: 0.25
width: 60%
series:
  - title: Test
    data: [10, 20, 30]
```

### Chart with Custom Width
```chartjs
type: line
labels: [1, 2, 3]
series:
  - title: Test
    data: [100, 200, 150]
width: 80%
```

### Distinct Label Colors
```chartjs
type: bar
labelColors: true
labels: [A, B, C]
width: 60%
series:
  - title: First
    data: [25, 25, 50]
  - title: Second
    data: [50, 25, 25]
```

## Legend Tests

### Chart without Legend
```chartjs
type: bar
legend: false
labels: [A, B, C]
width: 60%
series:
  - title: Test
    data: [10, 20, 30]
```

### Legend Position Bottom
```chartjs
type: bar
legendPosition: bottom
labels: [A, B, C]
width: 60%
series:
  - title: Test
    data: [10, 20, 30]
```

## Palette and axis checks

### Pie Palette (one color per slice)
```chartjs
type: pie
labels: [Alpha, Beta, Gamma, Delta, Epsilon, Zeta, Eta]
width: 60%
series:
  - title: Values
    data: [10, 20, 15, 25, 5, 18, 12]
```

### Polar Area Palette
```chartjs
type: polarArea
labels: [Alpha, Beta, Gamma, Delta, Epsilon, Zeta]
width: 60%
series:
  - title: Values
    data: [10, 20, 15, 25, 5, 18]
```

### Horizontal Bar with beginAtZero
```chartjs
type: bar
indexAxis: y
beginAtZero: true
labels: [A, B, C]
width: 60%
series:
  - title: Values
    data: [10, 20, 30]
```

### Scatter with Axis Semantics
```chartjs
type: scatter
width: 60%
xTitle: X
yTitle: Y
xMin: 0
yMin: 0
labels: [A, B, C]
series:
  - title: Points
    data:
      - {x: 1, y: 10}
      - {x: 2, y: 18}
      - {x: 3, y: 12}
```

### Bubble with Axis Semantics
```chartjs
type: bubble
width: 60%
xTitle: X
yTitle: Y
labels: [A, B]
series:
  - title: Bubbles
    data:
      - {x: 1, y: 10, r: 5}
      - {x: 2, y: 18, r: 10}
```

### Radar with Radial Bounds
```chartjs
type: radar
width: 60%
rMin: 0
rMax: 30
labels: [Speed, Power, Range]
series:
  - title: Values
    data: [10, 20, 15]
```

---

*Blocks for the manual check in a test vault. `docs/CHART-SPEC.md` defines the keys.*
