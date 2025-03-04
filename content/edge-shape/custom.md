---
title: Edge Shape | Custom
---

## Custom Edge Shape

Custom shape can be set by providing factory function in `setOptions` method of `CanvasBuilder`.

{{< code lang="javascript">}}
const canvas = new CanvasBuilder()
  .setOptions({
    edges: {
      shape: () => new MyCustomEgdeShape(),
    },
  }).build();
{{</code>}}

{{< use-case title="Custom edge with label" src=/use-cases/edge-with-label/ >}}

Also it is possible to apply shape to particular edge using methods
<a href="/canvas/add-edge">addEdge</a> and <a href="/canvas/update-edge">updateEdge</a>.

{{< code lang="javascript">}}
import { CustomEdgeShape } from "@html-graph/html-graph";

canvas.addEdge({
  from: "port-1",
  to: "port-2",
  shape: new MyCustomEdgeShape(),
})
{{< /code >}}

{{< code lang="javascript">}}
canvas.updateEdge("edge-1" , {
  from: "port-3",
  to: "port-4",
  shape: new MyCustomEdgeShape(),
})
{{< /code >}}

