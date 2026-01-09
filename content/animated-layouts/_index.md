---
title: Animated Layouts
sitemap:
  priority: 0.8
---

## Animated Layouts

Iterative layout algorithms allow visualizing intermediate results while
calculations are ongoing. Users can observe the evolving graph layout in
real-time without having to wait until all nodes have reached their final positions.

To enable animated nodes positioning, call the `enableAnimatedLayout` method on `CanvasBuilder`.

{{< code lang="javascript">}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .enableAnimatedLayout()
  .build();
{{< /code >}}

{{< use-case src=/use-cases/force-directed-animated-layout/ >}}

As shown below, coordinates are calculated automatically and do not need to be
specified explicitly when calling the <a href="/canvas#add-node" target="_blank">addNode</a> method.

{{< code lang="javascript">}}
const element = document.createElement('div');

canvas.addNode({
  id: "node-1",
  element: element,
  ports: [
    { id: "node-1", element: element }
  ],
});
{{< /code >}}

The `enableAnimatedLayout` method accepts optional configuration parameters:

{{< code lang="javascript">}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .enableAnimatedLayout({
    algorithm: {
      type: "forceDirected",
      maxTimeDeltaSec: 0.1,
      nodeCharge: 10000,
      nodeMass: 1,
      nodeForceCoefficient: 1,
      maxForce: 10000000,
      edgeEquilibriumLength: 300,
      edgeStiffness: 1000,
      convergenceDelta: 1,
      barnesHut: {
        theta: 1,
        areaRadiusThreshold: 0.01,
      },
      seed: "HTMLGraph is awesome",
    },
  })
  .build();
{{< /code >}}

### Configuration Parameters

| Name        | Type                                 | Description                             | Required | Default                     |
|-------------|--------------------------------------|-----------------------------------------|----------|-----------------------------|
| `algorithm` | [AlgorithmConfig](#algorithm-config) | Specifies the layout algorithm to apply | no       | `{ type: "forceDirected" }` |

{{< ref-target ref="algorithm-config">}}
### `AlgorithmConfig` Options ### {#algorithm-config}

| Algorithm     | Configuration                                     | Example                                           |
|---------------|---------------------------------------------------|---------------------------------------------------|
| ForceDirected | [ForceDirected](/animated-layouts/force-directed) | `{ type: "forceDirected" }`                       |
| Custom        | [Custom](/animated-layouts/custom)                | `{ type: "custom", instance: new MyAlgorithm() }` |
{{< /ref-target >}}
