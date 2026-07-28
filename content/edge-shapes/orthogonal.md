---
title: Edge Shape | Orthogonal
---

## Orthogonal Edge Shape

The Orthogonal edge shape can be configured by calling the `setDefaults` method on `CanvasBuilder`.

{{< code lang="javascript">}}
const element = document.getElementById("canvas");

const canvas = new CanvasBuilder(element)
  .setDefaults({
    edges: {
      shape: {
        type: "orthogonal",
      },
    },
  })
  .build();
{{< /code >}}

{{< use-case src=/use-cases/orthogonal-edge/ >}}

In addition to `type: "orthogonal"`, the following options are available:

# # {#orthogonal-edge-parameters}

{{< ref-target ref="orthogonal-edge-parameters">}}
| Name              | Type                                                                   | Description                            | Required | Default      |
|-------------------|------------------------------------------------------------------------|----------------------------------------|----------|--------------|
| `color`           | `string`                                                               | Color of the line and arrows           | no       | `"#777777"`  |
| `width`           | `number`                                                               | Line width                             | no       | `1`          |
| `arrowRenderer`   | <code><a target="_blank" href="/edge-arrows/">ArrowRenderer</a></code> | Arrow shape                            | no       | `{}`         |
| `arrowLength`     | `number`                                                               | Full length of the arrow               | no       | `20`         |
| `arrowOffset`     | `number`                                                               | Offset from the arrow to the edge bend | no       | `15`         |
| `hasSourceArrow`  | `boolean`                                                              | Draw an arrow near the source port     | no       | `false`      |
| `hasTargetArrow`  | `boolean`                                                              | Draw an arrow near the target port     | no       | `false`      |
| `cycleSquareSide` | `number`                                                               | Port cycle square side size            | no       | `30`         |
| `roundness`       | `number`                                                               | Roundness of the line angles           | no       | `10`         |
| `detourDistance`  | `number`                                                               | Node cycle detour distance             | no       | `100`        |
{{< /ref-target >}}

Alternatively, you can create a Orthogonal shape by passing a factory function into the configuration.

{{< code lang="javascript">}}
import { OrthogonalEdgeShape } from "@html-graph/html-graph";

const element = document.getElementById("canvas");

const canvas = new CanvasBuilder(element)
  .setDefaults({
    edges: {
      shape: (edgeId) => new OrthogonalEdgeShape({ hasTargetArrow: true })
    },
  })
  .build();
{{< /code >}}

All parameters are the same as specified in the [table](#orthogonal-edge-parameters).

You can also apply the Orthogonal shape to a specific edge using the
[addEdge](/canvas/#add-edge) and [updateEdge](/canvas/#update-edge) methods.

{{< code lang="javascript">}}
import { OrthogonalEdgeShape } from "@html-graph/html-graph";

canvas.addEdge({
  from: "port-1",
  to: "port-2",
  shape: new OrthogonalEdgeShape(),
});
{{< /code >}}

{{< code lang="javascript">}}
canvas.updateEdge("edge-1", {
  shape: new OrthogonalEdgeShape(),
});
{{< /code >}}
