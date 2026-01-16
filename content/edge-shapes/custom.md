---
title: Edge Shape | Custom Edge Shape (advanced)
---

## Custom Edge Shape (advanced)

When built-in edge shapes are insufficent, it is possible to provide a custom
edge shape.

The following example demonstrates implementation of a custom edge shape using TypeScript.

{{< code lang="typescript">}}
import { EdgeShape, EdgeRenderParams } from "@html-graph/html-graph";

class MyCustomEdgeShape implements EdgeShape {
  readonly svg: SVGSVGElement;

  private readonly line: SVGPathElement;

  constructor() {
    this.svg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );

    this.svg.style.pointerEvents = "none";
    this.svg.style.position = "absolute";
    this.svg.style.top = "0";
    this.svg.style.left = "0";
    this.svg.style.overflow = "visible";

    this.line = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );

    this.line.setAttribute("stroke", "#777777");
    this.line.setAttribute("stroke-width", "1");
    this.line.setAttribute("fill", "none");
    this.line.classList.add("custom-line");

    this.svg.appendChild(this.line);
  }

  render(params: EdgeRenderParams): void {
    const { from, to } = params;

    const centerFrom = {
      x: from.x + from.width / 2,
      y: from.y + from.height / 2,
    };

    const centerTo = {
      x: to.x + to.width / 2,
      y: to.y + to.height / 2,
    };

    const x = Math.min(centerFrom.x, centerTo.x);
    const y = Math.min(centerFrom.y, centerTo.y);
    const width = Math.abs(centerTo.x - centerFrom.x);
    const height = Math.abs(centerTo.y - centerFrom.y);

    this.svg.style.width = `${width}px`;
    this.svg.style.height = `${height}px`;
    this.svg.style.transform = `translate(${x}px, ${y}px)`;

    const centerX = width / 2;
    const centerY = height / 2;
    const flipX = centerFrom.x <= centerTo.x ? 1 : -1;
    const flipY = centerFrom.y <= centerTo.y ? 1 : -1;

    const fromX = centerX - centerX * flipX;
    const fromY = centerY - centerY * flipY;
    const toX = centerX + centerX * flipX;
    const toY = centerY + centerY * flipY;

    const linePath = `M ${fromX} ${fromY} L ${toX} ${toY}`;

    this.line.setAttribute("d", linePath);
  }
}
{{< /code >}}

As shown above, any custom edge shape must implement the `EdgeShape` interface.

This interface requires:
- public property `svg`, which stores edge svg element
- method `render`, which updates `svg` property based on provided parameters

{{< use-case src=/use-cases/minimal-custom-edge-shape/ >}}

A custom edge shape can be provided via a factory function in the `setDefaults` method of `CanvasBuilder`.

{{< code lang="javascript">}}
const element = document.getElementById("canvas");

const canvas = new CanvasBuilder(element)
  .setDefaults({
    edges: {
      shape: (edgeId) => new MyCustomEdgeShape(),
    },
  })
  .build();
{{< /code >}}

You can also apply a custom shape to a specific edge using the
<a href="/canvas/#add-edge" target="_blank">addEdge</a>
and
<a href="/canvas/#update-edge" target="_blank">updateEdge</a>
methods.

{{< code lang="javascript">}}
canvas.addEdge({
  from: "port-1",
  to: "port-2",
  shape: new MyCustomEdgeShape(),
});
{{< /code >}}

{{< code lang="javascript">}}
canvas.updateEdge("edge-1", {
  shape: new MyCustomEdgeShape(),
});
{{< /code >}}

