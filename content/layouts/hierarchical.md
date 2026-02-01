---
title: Layouts | Hierarchical
sitemap:
  priority: 0.8
---

## Hierarchical Layout

Configure hierarchical layout by setting `type: "hierarchical"` in the `enableLayout` method of a `CanvasBuilder` instance.

{{< code lang="typescript">}}
const element = document.getElementById("canvas");

const canvas = new CanvasBuilder(element)
  .enableLayout({
    algorithm: {
      type: "hierarchical",
    },
  })
  .build();
{{< /code >}}

{{< use-case src=/use-cases/hierarchical-layout/ >}}

Hierarchical layout supports optional configuration parameters:

{{< code lang="javascript">}}
const canvas = new CanvasBuilder(element)
  .enableLayout({
    algorithm: {
      type: "hierarchical",
      layerWidth: 300,
      layerSpace: 300,
      transform: [{ mirror: Math.PI / 2 }],
    },
  })
  .build();
{{< /code >}}


| Name         | Type                                | Description                                       | Required | Default   |
|--------------|-------------------------------------|---------------------------------------------------|----------|-----------|
| `layerWidth` | `number`                            | Width of a single layer                           | No       | `300`     |
| `layerSpace` | `number`                            | Minimum space between nodes within a single layer | No       | `300`     |
| `transform`  | [`Transformation`](#transformation) | Single transformation or array of transformations | No       | undefined |


{{< ref-target ref="transformation">}}

### Transformation Configuration {#transformation}

The `transform` parameter can be either a single transformation or an array of sequential transformations.

{{< /ref-target >}}

In general, a transformation is represented by a function that modifies the coordinates of a node.

{{< code lang="javascript">}}
const canvas = new CanvasBuilder(element)
  .enableLayout({
    algorithm: {
      type: "hierarchical",
      transform: (point) => {
        return { x: point.x, y: point.y };
      },
    },
  })
  .build();
{{< /code >}}

Additionally, there are several built-in implementations of these functions for common scenarios to simplify setup.

1. **Shift**

{{< code lang="javascript">}}
const canvas = new CanvasBuilder(element)
  .enableLayout({
    algorithm: {
      type: "hierarchical",
      transform: {
        shift: { x: 100, y: 200 },
      },
    },
  })
  .build();
{{< /code >}}

2. **Scale**

{{< code lang="javascript">}}
const canvas = new CanvasBuilder(element)
  .enableLayout({
    algorithm: {
      type: "hierarchical",
      transform: {
        scale: 2,
        origin: { x: 0, y: 0 },
      },
    },
  })
  .build();
{{< /code >}}

The `origin` parameter is optional.

3. **Rotate**

{{< code lang="javascript">}}
const canvas = new CanvasBuilder(element)
  .enableLayout({
    algorithm: {
      type: "hierarchical",
      transform: {
        rotate: Math.PI / 2,
        origin: { x: 0, y: 0 },
      },
    },
  })
  .build();
{{< /code >}}

The `origin` parameter is optional.

4. **Mirror**

{{< code lang="javascript">}}
const canvas = new CanvasBuilder(element)
  .enableLayout({
    algorithm: {
      type: "hierarchical",
      transform: {
        mirror: Math.PI / 2,
        origin: { x: 0, y: 0 },
      },
    },
  })
  .build();
{{< /code >}}

The `mirror` parameter specifies the angle of the mirror axis. The `origin` parameter is optional.

5. **Matrix**

{{< code lang="javascript">}}
const canvas = new CanvasBuilder(element)
  .enableLayout({
    algorithm: {
      type: "hierarchical",
      transform: {
        a: 1,
        b: 0,
        c: 10,
        d: 0,
        e: 1,
        f: 20,
      },
    },
  })
  .build();
{{< /code >}}

For more details on the parameters of this matrix, refer to the
<a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/transform-function/matrix">
  <b>CSS matrix() Function</b>
</a> documentation.
