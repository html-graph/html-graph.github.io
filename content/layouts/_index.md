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
    },
    applyOn: "topologyChangeMicrotask",
    staticNodeResolver: (nodeId) => false,
    events: {
      onBeforeApplied: () => {
        console.log("Layout is about to be applied");
      },
      onAfterApplied: () => {
        console.log("Layout has been applied");
      },
    },
  })
  .build();
{{< /code >}}

### Configuration Parameters

| Name                 | Type                                               | Description                                       | Required | Default                     |
|----------------------|----------------------------------------------------|---------------------------------------------------|----------|-----------------------------|
| `algorithm`          | <code>[AlgorithmConfig](#algorithm-config)</code>  | Specifies the layout algorithm to apply           | no       | `{ type: "forceDirected" }` |
| `applyOn`            | <code>[Trigger](#trigger)</code>                   | Specifies when to apply the algorithm             | no       | `"topologyChangeMicrotask"` |
| `staticNodeResolver` | `(nodeId) => boolean`                              | Function that determines whether a node is static | no       | `() => false`               |
| `events`             | <code>[EventsConfig](#events-configuration)</code> | Handlers for available events                     | no       | `{}`                        |

{{< ref-target ref="algorithm-config">}}
### `AlgorithmConfig` Options ### {#algorithm-config}

| Algorithm     | Configuration                            | Example                                           |
|---------------|------------------------------------------|---------------------------------------------------|
| ForceDirected | [ForceDirected](/layouts/force-directed) | `{ type: "forceDirected" }`                       |
| Hierarchical  | [Hierarchical](/layouts/hierarchical)    | `{ type: "hierarchical" }`                        |
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

{{< ref-target ref="events-configuration">}}

### Events Configuration {#events-configuration}

| Name              | Type         | Description                                    | Required | Default    |
|-------------------|--------------|------------------------------------------------|----------|------------|
| `onBeforeApplied` | `() => void` | Function to call before layout applied         | No       | `() => {}` |
| `onAfterApplied`  | `() => void` | Function to call after layout has been applied | No       | `() => {}` |

{{< /ref-target >}}
