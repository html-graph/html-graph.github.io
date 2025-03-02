---
title: Core configuration | Edges
---

## Edges configuration


{{< code lang="javascript">}}
const canvas = new HtmlGraphBuilder()
  .setOptions({
    edges: {
      shape: {
        type: "bezier",
        color: "#000",
        hasTargetArrow: true,
      },
      priority: "incremental",
    },
  }).build();
{{</code>}}

`EdgesConfig` fields:

| Name      | Type                                      | Description                      | Required | Default |
|-----------|-------------------------------------------|----------------------------------|----------|---------|
| shape     | <span data-ref="shape">ShapeConfig</span> | default edge shape configuration | no       | {}      |
| priority  | <span data-ref="priority">Priority</span> | default edge priority            | no       | 0       |


{{< ref-target ref="shape">}}
`ShapeConfig` options:

| Name       | Configuration                                        | Example                       |
|------------|------------------------------------------------------|-------------------------------|
| Bezier     | <a href="/edge-shape/bezier">BezierShape</a>         | `{ type: "bezier" }`          |
| Straigh    | <a href="/edge-shape/straight">StraightShape</a>     | `{ type: "straight" }`        |
| Horizontal | <a href="/edge-shape/horizontal">HorizontalShape</a> | `{ type: "horizontal" }`      |
| Vertical   | <a href="/edge-shape/vertical">VerticalShape</a>     | `{ type: "vertical" }`        |
| Custom     | <a href="/edge-shape/custom">CustomShape</a>         | `() => new CustomEdgeShape()` |
{{< /ref-target >}}

{{< ref-target ref="priority">}}
`Priority` can take one of the following values:

| Type                   | Description                                             | Example                   |
|------------------------|---------------------------------------------------------|---------------------------|
| `number`               | Each edge gets assigned constant Z-index                | `5`                       |
| `"incremental"`        | Each next edge gets incremented Z-index                 | `"incremental"`           |
| `"shared-incremental"` | Each next node or edge gets shared incremental Z-index  | `"shared-incremental"`    |
| `function`             | Z-index gets determined by calling specified function   | `() => 10 + i++;`         |
{{< /ref-target >}}
