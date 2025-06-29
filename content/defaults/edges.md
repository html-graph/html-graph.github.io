---
title: Defaults | Edges
---

## Edge Defaults

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

### `EdgesConfig` Fields

| Name      | Type                              | Description                      | Required | Default |
|-----------|-----------------------------------|----------------------------------|----------|---------|
| shape     | [ShapeConfig](#edge-shape-config) | Default edge shape configuration | no       | {}      |
| priority  | [Priority](#edge-priority)        | Default edge priority            | no       | 0       |

{{< ref-target ref="edge-shape-config">}}
### `ShapeConfig` Options ### {#edge-shape-config}

| Name       | Configuration                                        | Example                       |
|------------|------------------------------------------------------|-------------------------------|
| Bezier     | <a href="/edge-shape/bezier">BezierShape</a>         | `{ type: "bezier" }`          |
| Straight   | <a href="/edge-shape/straight">StraightShape</a>     | `{ type: "straight" }`        |
| Horizontal | <a href="/edge-shape/horizontal">HorizontalShape</a> | `{ type: "horizontal" }`      |
| Vertical   | <a href="/edge-shape/vertical">VerticalShape</a>     | `{ type: "vertical" }`        |
| Custom     | <a href="/edge-shape/custom">CustomShape</a>         | `() => new CustomEdgeShape()` |
{{< /ref-target >}}

{{< ref-target ref="edge-priority">}}
### `Priority` Options ### {#edge-priority}

| Type            | Description                                          | Example           |
|-----------------|------------------------------------------------------|-------------------|
| `number`        | Each edge is assigned a constant Z-index             | `5`               |
| `"incremental"` | Each subsequent edge receives an incremented Z-index | `"incremental"`   |
| `function`      | Z-index is determined by a specified function        | `() => 10 + i++;` |
{{< /ref-target >}}
