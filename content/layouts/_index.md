---
title: Layouts
sitemap:
  priority: 0.8
---

## Layouts

To enable automatic node positioning using a layout algorithm, call the `enableLayout` method on `CanvasBuilder`.

{{< code lang="javascript">}}
const element = document.getElementById("canvas");

const canvas = new CanvasBuilder(element)
  .enableLayout()
  .build();
{{< /code >}}

{{< use-case src=/use-cases/force-directed-layout/ >}}

As shown below, coordinates are calculated automatically and do not need to be specified explicitly when calling the <a href="/canvas#add-node" target="_blank">addNode</a> method.

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

The `enableLayout` method accepts optional configuration parameters:

{{< code lang="javascript">}}
const element = document.getElementById("canvas");

const canvas = new CanvasBuilder(element)
  .enableLayout({
    algorithm: {
      type: "forceDirected",
      dtSec: 0.01,
      nodeCharge: 10000,
      nodeMass: 1,
      nodeForceCoefficient: 1,
      maxForce: 10000000,
      edgeEquilibriumLength: 300,
      edgeStiffness: 1000,
      maxIterations: 1000,
      convergenceVelocity: 10,
      barnesHut: {
        theta: 1,
        areaRadiusThreshold: 0.01,
      },
      seed: "HTMLGraph is awesome",
    },
    applyOn: "topologyChangeMicrotask"
  })
  .build();
{{< /code >}}

### Configuration Parameters

| Name                 | Type                                 | Description                                       | Required | Default                     |
|----------------------|--------------------------------------|---------------------------------------------------|----------|-----------------------------|
| `algorithm`          | [AlgorithmConfig](#algorithm-config) | Specifies the layout algorithm to apply           | no       | `{ type: "forceDirected" }` |
| `applyOn`            | [Trigger](#trigger)                  | Specifies when to apply the algorithm             | no       | `"topologyChangeMicrotask"` |
| `staticNodeResolver` | `(nodeId) => boolean`                | Function that determines whether a node is static | no       | `() => false`               |

{{< ref-target ref="algorithm-config">}}
### `AlgorithmConfig` Options ### {#algorithm-config}

| Algorithm     | Configuration                            | Example                                           |
|---------------|------------------------------------------|---------------------------------------------------|
| ForceDirected | [ForceDirected](/layouts/force-directed) | `{ type: "forceDirected" }`                       |
| Custom        | [Custom](/layouts/custom)                | `{ type: "custom", instance: new MyAlgorithm() }` |
{{< /ref-target >}}

{{< ref-target ref="trigger">}}
### Trigger strategies ### {#trigger}

| Strategy                 | Description                                                                                                                                                                                | Example                     |
|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------|
| TopologyChangeMicrotask  | Layout is recalculated when the graph topology changes. Calculation occurs in the next microtask, allowing intensive layout computations to run after all nodes and edges have been added. | `"topologyChangeMicrotask"` |
| TopologyChangeMacrotask  | Layout is recalculated when the graph topology changes. Calculation occurs in the next macrotask, allowing intensive layout computations to run after all nodes and edges have been added. | `"topologyChangeMacrotask"` |
| Manual                   | Layout is recalculated when the `emit` method is called on the provided `EventSubject` instance, as shown in the example below.                                                            | `new EventSubject()`        |
{{< /ref-target >}}

#### Manual Layout Trigger

{{< code lang="javascript">}}
import { CanvasBuilder, EventSubject } from "@html-graph/html-graph";

const element = document.getElementById("canvas");
const trigger = new EventSubject();

const canvas = new CanvasBuilder(element)
  .enableLayout({
    applyOn: trigger,
  })
  .build();

// Add all nodes and edges here

// Then trigger the layout calculation
trigger.emit();
{{< /code >}}
