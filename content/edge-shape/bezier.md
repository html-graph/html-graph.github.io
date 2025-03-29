---
title: Edge Shape | Bezier
---

## Bezier Edge Shape

The Bezier shape is used by default, but it can also be explicitly set using the `setDefaults` method on `CanvasBuilder`.

{{< code lang="javascript">}}
const canvas = new CanvasBuilder()
  .setDefaults({
    edges: {
      shape: {
        type: "bezier",
      },
    },
  }).build();
{{< /code >}}

{{< use-case title="Bezier Edge" src=/use-cases/bezier-edge/ >}}

In addition to `type: "bezier"`, the following options are available:

{{< ref-target ref="bezier-edge-parameters">}}
| Name             | Type    | Description                        | Required | Default      |
|------------------|---------|------------------------------------|----------|--------------|
| color            | string  | Color of the line and arrows       | no       | `"#777777"`  |
| width            | number  | Line width                         | no       | `1`          |
| arrowLength      | number  | Full length of the arrow           | no       | `15`         |
| arrowWidth       | number  | Width of the arrow from center to side | no    | `4`          |
| curvature        | number  | Bezier curvature                   | no       | `90`         |
| hasSourceArrow   | boolean | Draw an arrow near the source port | no       | `false`      |
| hasTargetArrow   | boolean | Draw an arrow near the target port | no       | `false`      |
| cycleRadius      | number  | Port cycle line radius             | no       | `30`         |
| smallCycleRadius | number  | Port-cycle radius near the port    | no       | `15`         |
| detourDistance   | number  | Node cycle detour distance         | no       | `100`        |
| detourDirection  | number  | Node cycle detour direction        | no       | `-Math.PI/2` |
{{< /ref-target >}}

Alternatively, you can create a Bezier shape by passing a factory function into the configuration.

{{< code lang="javascript">}}
import { BezierEdgeShape } from "@html-graph/html-graph";

const canvas = new CanvasBuilder()
  .setDefaults({
    edges: {
      shape: () => new BezierEdgeShape({ hasTargetArrow: true })
    },
  }).build();
{{< /code >}}

All parameters are the same as specified in the <span data-ref="bezier-edge-parameters">table</span>.

You can also apply the Bezier shape to a specific edge using the <a href="/canvas/add-edge">addEdge</a> and <a href="/canvas/update-edge">updateEdge</a> methods.

{{< code lang="javascript">}}
import { BezierEdgeShape } from "@html-graph/html-graph";

canvas.addEdge({
  from: "port-1",
  to: "port-2",
  shape: new BezierEdgeShape(),
})
{{< /code >}}

{{< code lang="javascript">}}
canvas.updateEdge("edge-1", {
  from: "port-3",
  to: "port-4",
  shape: new BezierEdgeShape(),
})
{{< /code >}}
