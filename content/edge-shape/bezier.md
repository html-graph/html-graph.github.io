---
title: Edge Shape | Bezier
---

## Bezier Edge Shape

Bezier shape gets used by default, by you can set it explicitly by calling
`setOptions` method on `CanvasBuilder`.

{{< code lang="javascript">}}
const canvas = new CanvasBuilder()
  .setOptions({
    edges: {
      shape: {
        type: "bezier",
      },
    },
  }).build();
{{</code>}}

{{< use-case title="Bezier edge" src=/use-cases/bezier-edge/ >}}

Along with `type: "bezier"` there are other options available:

{{< ref-target ref="bezier-edge-parameters">}}
| Name             | Type    | Description                        | Required | Default      |
|------------------|---------|------------------------------------|----------|--------------|
| color            | string  | color of line and arrows           | no       | `"#777777"`  |
| width            | number  | line width                         | no       | `1`          |
| arrowLength      | number  | full lenght of arrow               | no       | `15`         |
| arrowWidth       | number  | width of arrow from center to side | no       | `4`          |
| curvature        | number  | bezier curvature                   | no       | `90`         |
| hasSouceArrow    | boolean | draw arrow near source port        | no       | `false`      |
| hasTargetArrow   | boolean | draw arrow near target port        | no       | `false`      |
| cycleRadius      | number  | port cycle line radius             | no       | `30`         |
| smallCycleRadius | number  | port-cycle radius near port        | no       | `15`         |
| detourDistance   | number  | node cycle detour distance         | no       | `100`        |
| detourDirection  | number  | node cycle detour direction        | no       | `-Math.PI/2` |
{{< /ref-target >}}

Another way to create Bezier shape is by passing factory function into
configuration.

{{< code lang="javascript">}}
import { BezierEdgeShape } from "@html-graph/html-graph";

const canvas = new CanvasBuilder()
  .setOptions({
    edges: {
      shape: () => new BezierEdgeShape({ hasTargetArrow: true })
    },
  }).build();
{{</code>}}

All parameters are the same as specified in the <span data-ref="bezier-edge-parameters">table</span>.

Also it is possible to apply shape to particular edge using methods
<a href="/canvas/add-edge">addEdge</a> and <a href="/canvas/update-edge">updateEdge</a>.

{{< code lang="javascript">}}
import { BezierEdgeShape } from "@html-graph/html-graph";

canvas.addEdge({
  from: "port-1",
  to: "port-2",
  shape: new BezierEdgeShape(),
})
{{< /code >}}

{{< code lang="javascript">}}
canvas.updateEdge("edge-1" , {
  from: "port-3",
  to: "port-4",
  shape: new BezierEdgeShape(),
})
{{< /code >}}
