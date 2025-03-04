---
title: Edge Shape | Vertical
---

## Vertical Edge Shape

Vertical shape can be set by calling `setOptions` method on `CanvasBuilder`.

{{< code lang="javascript">}}
const canvas = new CanvasBuilder()
  .setOptions({
    edges: {
      shape: {
        type: "vertical",
      },
    },
  }).build();
{{</code>}}

{{< use-case title="Vertical edge" src=/use-cases/vertical-edge/ >}}

Along with `type: "vertical"` there are other options available:

{{< ref-target ref="vertical-edge-parameters">}}
| Name             | Type    | Description                        | Required | Default      |
|------------------|---------|------------------------------------|----------|--------------|
| color            | string  | color of line and arrows           | no       | `"#777777"`  |
| width            | number  | line width                         | no       | `1`          |
| arrowLength      | number  | full lenght of arrow               | no       | `15`         |
| arrowWidth       | number  | width of arrow from center to side | no       | `4`          |
| arrowOffset      | number  | offset form arrow to edge bend     | no       | `15`         |
| hasSouceArrow    | boolean | draw arrow near source port        | no       | `false`      |
| hasTargetArrow   | boolean | draw arrow near target port        | no       | `false`      |
| cycleSquareSide  | number  | port cycle square side size        | no       | `30`         |
| roundness        | number  | roundness of line angles           | no       | `10`         |
| detourDistance   | number  | node cycle detour distance         | no       | `100`        |
| detourDirection  | number  | node cycle detour direction        | no       | `-Math.PI/2` |
{{< /ref-target >}}

Another way to create Vertical shape is by passing factory function into
configuration.

{{< code lang="javascript">}}
import { VerticalEdgeShape } from "@html-graph/html-graph";

const canvas = new CanvasBuilder()
  .setOptions({
    edges: {
      shape: () => new VerticalEdgeShape({ hasTargetArrow: true })
    },
  }).build();
{{</code>}}

All parameters are the same as specified in the <span data-ref="vertical-edge-parameters">table</span>.

Also it is possible to apply shape to particular edge using methods
<a href="/canvas/add-edge">addEdge</a> and <a href="/canvas/update-edge">updateEdge</a>.

{{< code lang="javascript">}}
import { VerticalEdgeShape } from "@html-graph/html-graph";

canvas.addEdge({
  from: "port-1",
  to: "port-2",
  shape: new VerticalEdgeShape(),
})
{{< /code >}}

{{< code lang="javascript">}}
canvas.updateEdge("edge-1" , {
  from: "port-3",
  to: "port-4",
  shape: new VerticalEdgeShape(),
})
{{< /code >}}
