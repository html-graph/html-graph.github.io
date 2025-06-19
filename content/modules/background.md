---
title: Background
sitemap:
  priority: 0.7
---

## Background

To enable built-in background rendering, call the `enableBackground` method on `CanvasBuilder`.

{{< code lang="javascript">}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .enableBackground()
  .build();
{{< /code >}}

{{< use-case title="Built-in background rendering" src=/use-cases/background/ >}}

This method accepts optional configuration:

{{< code lang="javascript">}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .enableBackground({
    tileDimensions: {
      width: 50,
      height: 50,
    },
    renderer: {
      radius: 5,
      color: 'var(--color-background)',
    },
    maxViewportScale: 20
  })
  .build();
{{< /code >}}

### Configuration Parameters

| Name             | Type                                                   | Description                                                       | Required | Default                             |
|------------------|--------------------------------------------------------|-------------------------------------------------------------------|----------|-------------------------------------|
| tileDimensions   | <span data-ref="tile-dimensions">TileDimensions</span> | Dimensions of rendered tile                                       | no       | `{ width: 25, height: 25 }`         |
| renderer         | <span data-ref="renderer">Renderer</span>              | Specifies the content of tile                                     | no       | `{ radius: 1.5, color: '#d8d8d8' }` |
| maxViewportScale | number                                                 | Viewport scale threshold when background should not be rendered   | no       | `10`                                |

{{< ref-target ref="tile-dimensions">}}

### TileDimensions

| Name   | Type   | Description | Required | Default |
|--------|--------|-------------|----------|---------|
| width  | number | Tile width  | no       | 25      |
| height | number | Tile height | no       | 25      |

{{< /ref-target >}}

{{< ref-target ref="renderer">}}

### Renderer

Can be either built-in circle:

{{< code lang="javascript">}}
const renderer = { radius: 5, color: 'red' };
{{< /code >}}

or `SVGElement`:

{{< code lang="javascript">}}
const renderer = document.createElementNS('http://www.w3.org/2000/svg', 'path');
// Drawing cross in SVG
renderer.setAttribute('d', 'M -5 0 L 5 0 M 0 5 L 0 -5');
renderer.setAttribute('stroke-width', '1');
renderer.setAttribute('stroke', '#CCCCFF');
{{< /code >}}

{{< /ref-target >}}
