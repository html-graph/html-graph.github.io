---
title: Animated Layouts | Force-Directed
sitemap:
  priority: 0.8
---

## Force-Directed Animated Layout

A force-directed layout is utilized by default whenever the `enableAnimatedLayout` method is invoked on a `CanvasBuilder` instance.

You can also explicitly specify it through its `type`.

{{< code lang="typescript">}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .enableAnimatedLayout({
    algorithm: {
      type: "forceDirected",
    },
  })
  .build();
{{< /code >}}

{{< use-case title="Force-directed animated layout" src=/use-cases/force-directed-animated-layout/ >}}

The force-directed layout supports optional configuration parameters.

{{< code lang="javascript">}}
const canvas = new CanvasBuilder(element)
  .enableAnimatedLayout({
    algorithm: {
      type: "forceDirected",
      nodeCharge: 10000,
      nodeMass: 1,
      effectiveDistance: 1000,
      edgeEquilibriumLength: 300,
      edgeStiffness: 100,
      maxTimeDeltaSec: 0.01,
      convergenceDelta: 0.001,
      seed: "HTMLGraph is awesome",
    },
  })
  .build();
{{< /code >}}

| Name                    | Type     | Description                                                                                                                          | Required | Default                  |
|-------------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------|----------|--------------------------|
| `nodeCharge`            | `number` | Represents electrostatic-like repulsive forces between nodes. Higher values increase repulsion                                       | No       | `10000`                  |
| `nodeMass`              | `number` | Determines node's inertia during movement. Larger masses slow down convergence but enhance stability                                 | No       | `1`                      |
| `effectiveDistance`     | `number` | Cutoff distance beyond which nodes' interactions become negligible                                                                   | No       | `1000`                   |
| `edgeEquilibriumLength` | `number` | Perfect edge length when attractive and repulsive forces are absent                                                                  | No       | `300`                    |
| `edgeStiffness`         | `number` | Measures spring-like behavior of edges. High stiffness enforces equilibrium lengths strictly                                         | No       | `100`                    |
| `maxTimeDeltaSec`       | `number` | Maximum time step duration in seconds for single iteration                                                                           | No       | `0.1`                   |
| `convergenceDelta`      | `number` | Threshold determining whether nodes have settled sufficiently after moving distances smaller than this threshold within an iteration | No       | `0.001`                  |
| `seed`                  | `string` | A randomization seed used to initialize nodes' starting positions if they lack predefined coordinates                                | No       | `"HTMLGraph is awesome"` |
