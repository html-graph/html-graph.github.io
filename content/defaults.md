---
title: Defaults
---

## Defaults

Use the `setDefaults` method of `CanvasBuilder` to establish base visualization settings.

These defaults apply to all graph entities (nodes, ports, and edges) when no explicit values are provided.

---

### Nodes [#](#nodes) {#nodes}

{{< code lang="javascript">}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .setDefaults({
    nodes: {
      centerFn: (w, h) => ({ x: w / 2, y: h / 2 }),
      priority: "incremental",
    },
  })
  .build();
{{< /code >}}

#### `NodesConfig` Fields

| Name       | Type                                    | Description                                     | Required | Default                          |
|------------|-----------------------------------------|-------------------------------------------------|----------|----------------------------------|
| `centerFn` | `function`                              | Default function to determine the node’s center | no       | `(w, h) => ({ x: w/2, y: h/2 })` |
| `priority` | <code>[Priority](#node-priority)</code> | Default node priority                           | no       | `0`                              |

{{< ref-target ref="node-priority">}}
#### `Priority` Options ### {#node-priority}

| Type            | Description                                          | Example           |
|-----------------|------------------------------------------------------|-------------------|
| `number`        | Each node is assigned a constant Z-index             | `5`               |
| `"incremental"` | Each subsequent node receives an incremented Z-index | `"incremental"`   |
| `() => number`  | Z-index is determined by a specified function        | `() => 10 + i++;` |
{{< /ref-target >}}


---

### Ports [#](#ports) {#ports}

{{< code lang="javascript">}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .setDefaults({
    ports: {
      direction: -Math.PI,
    },
  })
  .build();
{{< /code >}}

#### `PortsConfig` Fields

| Name        | Type     | Description             | Required | Default |
|-------------|----------|-------------------------|----------|---------|
| `direction` | `number` | Default port direction  | no       | `0`     |

---

### Edges [#](#edges) {#edges}

{{< code lang="javascript">}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .setDefaults({
    edges: {
      shape: {
        type: "bezier",
        color: "#000",
        hasTargetArrow: true,
      },
      priority: "incremental",
    },
  })
  .build();
{{< /code >}}

#### `EdgesConfig` Fields

| Name        | Type                                               | Description                      | Required | Default |
|-------------|----------------------------------------------------|----------------------------------|----------|---------|
| `shape`     | <code>[EdgeShapeConfig](#edge-shape-config)</code> | Default edge shape configuration | no       | `{}`    |
| `priority`  | <code>[Priority](#edge-priority)</code>            | Default edge priority            | no       | `0`     |

{{< ref-target ref="edge-shape-config">}}
#### `EdgeShapeConfig` Options ### {#edge-shape-config}

| Name       | Configuration                                                                           | Example                                   |
|------------|-----------------------------------------------------------------------------------------|-------------------------------------------|
| Bezier     | <code><a href="/edge-shapes/bezier/" target="_blank">BezierEdgeShape</a></code>         | `{ type: "bezier" }`                      |
| Direct     | <code><a href="/edge-shapes/direct/" target="_blank">DirectEdgeShape</a></code>         | `{ type: "direct" }`                      |
| Straight   | <code><a href="/edge-shapes/straight/" target="_blank">StraightEdgeShape</a></code>     | `{ type: "straight" }`                    |
| Horizontal | <code><a href="/edge-shapes/horizontal/" target="_blank">HorizontalEdgeShape</a></code> | `{ type: "horizontal" }`                  |
| Vertical   | <code><a href="/edge-shapes/vertical/" target="_blank">VerticalEdgeShape</a></code>     | `{ type: "vertical" }`                    |
| Custom     | <code><a href="/edge-shapes/custom/" target="_blank">CustomEdgeShape</a></code>         | `(edgeId) => new CustomEdgeShape(edgeId)` |
{{< /ref-target >}}

{{< ref-target ref="edge-priority">}}
#### `Priority` Options ### {#edge-priority}

| Type            | Description                                          | Example           |
|-----------------|------------------------------------------------------|-------------------|
| `number`        | Each edge is assigned a constant Z-index             | `5`               |
| `"incremental"` | Each subsequent edge receives an incremented Z-index | `"incremental"`   |
| `function`      | Z-index is determined by a specified function        | `() => 10 + i++;` |
{{< /ref-target >}}
