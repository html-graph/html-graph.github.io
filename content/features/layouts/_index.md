---
title: Layouts
sitemap:
  priority: 0.8
---

## Layouts

To enable automatic node positioning using a layout algorithm, call the `enableLayout` method on `CanvasBuilder`.

{{< code lang="javascript">}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .enableLayout()
  .build();
{{< /code >}}

<use-case title="Force-directed layout" src=/use-cases/force-directed-layout/ >

As shown above, coordinates are calculated automatically and do not need to be specified explicitly when calling the <a href="/canvas#add-node" target="_blank">addNode</a> method.

{{< code lang="javascript">}}
const element = document.createElement('div');

canvas.addNode({
  id: "node-1",
  element: element,
  ports: [
    { id: "port-1", element: element }
  ],
});
{{< /code >}}

The `enableLayout` method accepts optional configuration parameters:

{{< code lang="javascript">}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .enableLayout({
    algorithm: {
      type: "forceDirected",
      dtSec: 0.02,
      maxIterations: 100,
      seed: "HTMLGraph is awesome",
      nodeCharge: 10000,
      nodeMass: 1,
      edgeEquilibriumLength: 300,
      edgeStiffness: 100,
      effectiveDistance: 100,
      convergenceDelta: 0.001,
    },
    applyOn: "topologyChangeTimeout"
  })
  .build();
{{< /code >}}

### Configuration Parameters

| Name        | Type                                 | Description                       | Required | Default                   |
|-------------|--------------------------------------|-----------------------------------|----------|---------------------------|
| `algorithm` | [AlgorithmConfig](#algorithm-config) | Specifies the layout algorithm to apply | no       | `{type: "forceDirected"}` |
| `applyOn`   | [Trigger](#trigger)                  | Specifies when to apply the algorithm | no       | `"topologyChangeTimeout"` |

{{< ref-target ref="algorithm-config">}}
### `AlgorithmConfig` Options ### {#algorithm-config}

| Algorithm     | Configuration                                     | Example                     |
|---------------|---------------------------------------------------|-----------------------------|
| ForceDirected | [ForceDirected](/features/layouts/force-directed) | `{ type: "forceDirected" }` |
| Custom        | [Custom](/features/layouts/custom)                | `{ type: "custom" }`        |
{{< /ref-target >}}

{{< ref-target ref="trigger">}}
### Trigger Options ### {#trigger}

| Strategy               | Description                                                                                                                                                                                  | Example                   |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
| TopologyChangeTimeout  | Layout is recalculated when the graph topology changes. Calculation occurs in the next macrotask, allowing intensive layout computations to run after all nodes and edges have been added. | `"topologyChangeTimeout"` |
| Manual                 | Layout is recalculated when the `emit` method is called on the provided `EventSubject` instance, as shown in the example below.                                                                 | `new EventSubject()`      |
{{< /ref-target >}}

#### Manual Layout Trigger

{{< code lang="javascript">}}
import { CanvasBuilder, EventSubject } from "@html-graph/html-graph";

const element = document.getElementById('canvas');
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
