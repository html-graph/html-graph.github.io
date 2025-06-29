---
title: Edge Shape | Custom
---

## Custom Edge Shape

A custom edge shape can be defined by providing a factory function in the `setDefaults` method of `CanvasBuilder`.

{{< code lang="javascript">}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .setDefaults({
    edges: {
      shape: (edgeId) => new MyCustomEdgeShape(`Edge ${edgeId}`),
    },
  })
  .build();
{{< /code >}}

You can also apply a custom shape to a specific edge using the
[addEdge](/canvas/#add-edge) and [updateEdge](/canvas/#update-edge) methods.

{{< code lang="javascript">}}
canvas.addEdge({
  from: "port-1",
  to: "port-2",
  shape: new MyCustomEdgeShape("Edge 1"),
});
{{< /code >}}

{{< code lang="javascript">}}
canvas.updateEdge("edge-1", {
  from: "port-3",
  to: "port-4",
  shape: new MyCustomEdgeShape("Edge 2"),
});
{{< /code >}}

{{< use-case title="Custom Edge with Label" src=/use-cases/edge-with-label/ >}}

