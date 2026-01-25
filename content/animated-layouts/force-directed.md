---
title: Animated Layouts | Force-Directed
sitemap:
  priority: 0.8
---

## Force-Directed Animated Layout

A force-directed animated layout is utilized by default whenever the `enableAnimatedLayout` method is invoked on a `CanvasBuilder` instance.
This type of layout also comes with a <a href="/layouts/force-directed/">non-animated version</a>.

You can also explicitly specify it through its `type`.

{{< code lang="typescript">}}
const element = document.getElementById("canvas");

const canvas = new CanvasBuilder(element)
  .enableAnimatedLayout({
    algorithm: {
      type: "forceDirected",
    },
  })
  .build();
{{< /code >}}

{{< use-case src=/use-cases/force-directed-animated-layout/ >}}

The force-directed layout supports optional configuration parameters.

{{< code lang="javascript">}}
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
      convergenceVelocity: 10,
      barnesHut: {
        theta: 1,
        areaRadiusThreshold: 0.01,
      },
      seed: "HTMLGraph is awesome",
    },
  })
  .build();
{{< /code >}}

| Name                    | Type                                        | Description                                                                                                                                                                                      | Required | Default                  |
|-------------------------|---------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|--------------------------|
| `maxTimeDeltaSec`       | `number`                                    | Maximum time step duration in seconds for single iteration                                                                                                                                       | No       | `0.01`                   |
| `nodeCharge`            | `number`                                    | Represents electrostatic-like repulsive forces between nodes. Higher values increase repulsion                                                                                                   | No       | `10000`                  |
| `nodeMass`              | `number`                                    | Determines node's inertia during movement. Larger masses slow down convergence but enhance stability                                                                                             | No       | `1`                      |
| `nodeForceCoefficient`  | `number`                                    | Multiplier for the repulsive force between nodes. A higher value increases the repulsion effect given the same node charges.                                                                     | No       | `1`                      |
| `maxForce`              | `number`                                    | Sets the maximum amount of force applicable to a node. Useful when nodes are very close together, preventing repulsive forces from becoming infinitely large.                                    | No       | `10000000`               |
| `edgeEquilibriumLength` | `number`                                    | Perfect edge length when attractive and repulsive forces are absent                                                                                                                              | No       | `300`                    |
| `edgeStiffness`         | `number`                                    | Measures spring-like behavior of edges. High stiffness enforces equilibrium lengths strictly                                                                                                     | No       | `1000`                   |
| `convergenceVelocity`   | `number`                                    | Threshold determining whether nodes have stabilized sufficiently based on their movement speed (measured as absolute content distance per second) being less than this value during an iteration | No       | `10`                     |
| `barnesHut`             | <code>[BarnesHutConfig](#barnes-hut)</code> | Configuration settings for approximating node forces calculations.                                                                                                                               | No       | `{}`                     |
| `seed`                  | `string`                                    | A randomization seed used to initialize nodes' starting positions if they lack predefined coordinates                                                                                            | No       | `"HTMLGraph is awesome"` |


{{< ref-target ref="barnes-hut">}}

### Barnes-Hut approximation configuration ### {#barnes-hut}

| Name                  | Type     | Description                                                                                                                                                                                                                             | Required | Default |
|-----------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|---------|
| `theta`               | `number` | Controls the trade-off between optimization and accuracy. Higher values lead to greater optimization but reduced accuracy. With `theta=0`, the algorithm's complexity is `O(n²)`; with `theta=1`, the complexity becomes `O(n*log(n))`. | no       | `1`     |
| `areaRadiusThreshold` | `number` | Specifies the radius of the mesh squares where further subdivision stops. Smaller values produce a finer mesh.                                                                                                                          | no       | `0.01`  |

{{< /ref-target >}}
