---
title: Edge Shape | Vertical
---

## Vertical Edge Shape

The Vertical edge shape can be configured by calling the `setDefaults` method on `CanvasBuilder`.

{{< code lang="javascript">}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .setDefaults({
    edges: {
      shape: {
        type: "vertical",
      },
    },
  })
  .build();
{{< /code >}}

{{< use-case title="Vertical Edge" src=/use-cases/vertical-edge/ >}}

In addition to `type: "vertical"`, the following options are available:

# # {#vertical-edge-parameters}

{{< ref-target ref="vertical-edge-parameters">}}
| Name             | Type    | Description                        | Required | Default      |
|------------------|---------|------------------------------------|----------|--------------|
| color            | string  | Color of the line and arrows       | no       | `"#777777"`  |
| width            | number  | Line width                         | no       | `1`          |
| arrowLength      | number  | Full length of the arrow           | no       | `15`         |
| arrowWidth       | number  | Width of the arrow from center to side | no    | `4`          |
| arrowOffset      | number  | Offset from the arrow to the edge bend | no   | `15`         |
| hasSourceArrow   | boolean | Draw an arrow near the source port | no       | `false`      |
| hasTargetArrow   | boolean | Draw an arrow near the target port | no       | `false`      |
| cycleSquareSide  | number  | Port cycle square side size        | no       | `30`         |
| roundness        | number  | Roundness of the line angles       | no       | `10`         |
| detourDistance   | number  | Node cycle detour distance         | no       | `100`        |
{{< /ref-target >}}

Alternatively, you can create a Vertical shape by passing a factory function into the configuration.

{{< code lang="javascript">}}
import { VerticalEdgeShape } from "@html-graph/html-graph";

const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .setDefaults({
    edges: {
      shape: (edgeId) => new VerticalEdgeShape({ hasTargetArrow: true })
    },
  })
  .build();
{{< /code >}}

All parameters are the same as specified in the [table](#vertical-edge-parameters).

You can also apply the Vertical shape to a specific edge using the
[addEdge](/canvas/#add-edge) and [updateEdge](/canvas/#update-edge) methods.

{{< code lang="javascript">}}
import { VerticalEdgeShape } from "@html-graph/html-graph";

canvas.addEdge({
  from: "port-1",
  to: "port-2",
  shape: new VerticalEdgeShape(),
});
{{< /code >}}

{{< code lang="javascript">}}
canvas.updateEdge("edge-1", {
  from: "port-3",
  to: "port-4",
  shape: new VerticalEdgeShape(),
});
{{< /code >}}
