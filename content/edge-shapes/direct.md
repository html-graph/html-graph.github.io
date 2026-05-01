---
title: Edge Shape | Direct
---

## Direct Edge Shape

The Direct edge shape can be configured by calling the `setDefaults` method on `CanvasBuilder`.

{{< code lang="javascript">}}
const element = document.getElementById("canvas");

const canvas = new CanvasBuilder(element)
  .setDefaults({
    edges: {
      shape: {
        type: "direct",
      },
    },
  })
  .build();
{{< /code >}}

{{< use-case src=/use-cases/direct-edge/ >}}

In addition to `type: "direct"`, the following options are available:

# #{#direct-edge-parameters}

{{< ref-target ref="direct-edge-parameters">}}
| Name               | Type                                                                   | Description                                      | Required | Default      |
|--------------------|------------------------------------------------------------------------|--------------------------------------------------|----------|--------------|
| `color`            | `string`                                                               | Color of the line and arrows                     | no       | `"#777777"`  |
| `width`            | `number`                                                               | Line width                                       | no       | `1`          |
| `arrowRenderer`    | <code><a target="_blank" href="/edge-arrows/">ArrowRenderer</a></code> | Arrow shape                                      | no       | `{}`         |
| `arrowLength`      | `number`                                                               | Full length of the arrow                         | no       | `20`         |
| `sourceOffset`     | <code>number \| [PortOffsetFn](#port-offset-fn)</code>                 | Empty space distance from source port to an edge | no       | `0`          |
| `targetOffset`     | <code>number \| [PortOffsetFn](#port-offset-fn)</code>                 | Empty space distance from target port to an edge | no       | `0`          |
| `hasSourceArrow`   | `boolean`                                                              | Draw an arrow near the source port               | no       | `false`      |
| `hasTargetArrow`   | `boolean`                                                              | Draw an arrow near the target port               | no       | `false`      |
{{< /ref-target >}}

Alternatively, you can create a Direct shape by passing a factory function into the configuration.

{{< code lang="javascript">}}
import { DirectEdgeShape } from "@html-graph/html-graph";

const element = document.getElementById("canvas");

const canvas = new CanvasBuilder(element)
  .setDefaults({
    edges: {
      shape: (edgeId) => new DirectEdgeShape({ hasTargetArrow: true })
    },
  })
  .build();
{{< /code >}}

All parameters are the same as specified in the [table](#direct-edge-parameters).

You can also apply the Direct shape to a specific edge using the
[addEdge](/canvas/#add-edge) and [updateEdge](/canvas/#update-edge) methods.

{{< code lang="javascript">}}
import { DirectEdgeShape } from "@html-graph/html-graph";

canvas.addEdge({
  from: "port-1",
  to: "port-2",
  shape: new DirectEdgeShape(),
});
{{< /code >}}

{{< code lang="javascript">}}
canvas.updateEdge("edge-1", {
  shape: new DirectEdgeShape(),
});
{{< /code >}}

{{< ref-target ref="port-offset-fn">}}

### `PortOffsetFn` ### {#port-offset-fn}

`PortOffsetFn` is a function that calculates the arrow offset distance based on edge direction and port parameters. This determines how far from the port center the arrow should be placed.

{{< /ref-target >}}

Here is an example of such a function that positions arrows near the border of a rectangular port:

{{< code lang="javascript">}}
const boxPortOffsetFn = (params) => {
  const { direction, radius } = params;
  const { x, y } = direction;
  const { horizontal, vertical } = radius;
  const tg = y / x;

  const horX = Math.abs(vertical / tg);
  const vertY = Math.abs(horizontal * tg);

  const minX = Math.min(horizontal, horX);
  const minY = Math.min(vertical, vertY);

  return Math.sqrt(minX * minX + minY * minY);
};
{{< /code >}}

{{< use-case src=/use-cases/direct-edge-rectangular-nodes/ >}}

`boxPortOffsetFn` is provided out-of-the-box by the library:

{{< code lang="javascript">}}
import { boxPortOffsetFn } from "@html-graph/html-graph";

canvas.addEdge({
  from: "port-1",
  to: "port-2",
  shape: new DirectEdgeShape({
    hasSourceArrow: true,
    hasTargetArrow: true,
    sourceOffset: boxPortOffsetFn,
    targetOffset: boxPortOffsetFn,
  }),
});
{{< /code >}}
