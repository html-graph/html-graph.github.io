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
    },
  })
  .build();
{{< /code >}}


| Name         | Type     | Description                                       | Required | Default |
|--------------|----------|---------------------------------------------------|----------|---------|
| `layerWidth` | `number` | Width of a single layer                           | No       | `300`   |
| `layerSpace` | `number` | Minimum space between nodes within a single layer | No       | `300`   |
