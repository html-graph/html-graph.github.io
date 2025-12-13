---
title: Layouts | Force-Directed
sitemap:
  priority: 0.8
---

## Force-Directed Layout

A force-directed layout is utilized by default whenever the `enableLayout` method is invoked on a `CanvasBuilder` instance.

{{< use-case title="Force-directed layout" src=/use-cases/force-directed-layout/ >}}

You can also explicitly specify it through its `type`.

{{< code lang="typescript">}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .enableLayout({
    algorithm: {
      type: "forceDirected",
    },
  })
  .build();
{{< /code >}}

The force-directed layout supports optional configuration parameters.

{{< code lang="javascript">}}
const canvas = new CanvasBuilder(element)
  .enableLayout({
    algorithm: {
      type: "forceDirected",
      dtSec: 0.02,
      nodeCharge: 10000,
      nodeMass: 1,
      effectiveDistance: 1000,
      edgeEquilibriumLength: 300,
      edgeStiffness: 100,
      maxIterations: 100,
      convergenceDelta: 0.001,
      seed: "HTMLGraph is awesome",
    },
  })
  .build();
{{< /code >}}

| Name                    | Type     | Description                                                                                                                          | Required | Default                  |
|-------------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------|----------|--------------------------|
| `dtSec`                 | `number` | Time step duration in seconds per iteration                                                                                          | No       | `0.02`                   |
| `nodeCharge`            | `number` | Represents electrostatic-like repulsive forces between nodes. Higher values increase repulsion                                       | No       | `10000`                  |
| `nodeMass`              | `number` | Determines node's inertia during movement. Larger masses slow down convergence but enhance stability                                 | No       | `1`                      |
| `effectiveDistance`     | `number` | Cutoff distance beyond which nodes' interactions become negligible                                                                   | No       | `1000`                   |
| `edgeEquilibriumLength` | `number` | Perfect edge length when attractive and repulsive forces are absent                                                                  | No       | `300`                    |
| `edgeStiffness`         | `number` | Measures spring-like behavior of edges. High stiffness enforces equilibrium lengths strictly                                         | No       | `100`                    |
| `maxIterations`         | `number` | Maximum allowed iterations before stopping the layout process                                                                        | No       | `100`                    |
| `convergenceDelta`      | `number` | Threshold determining whether nodes have settled sufficiently after moving distances smaller than this threshold within an iteration | No       | `0.001`                  |
| `seed`                  | `string` | A randomization seed used to initialize nodes' starting positions if they lack predefined coordinates                                | No       | `"HTMLGraph is awesome"` |
