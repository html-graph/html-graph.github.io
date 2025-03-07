---
title: Resize Reactive Nodes
---

## Resize Reactive Nodes

To enable built-in resize-reactive nodes, call the `setResizeReactiveNodes` method on `CanvasBuilder`.

{{< code lang="javascript">}}
const canvas = new CanvasBuilder()
  .setResizeReactiveNodes()
  .build();
{{< /code >}}

{{< use-case title="Resize Reactive Nodes" src=/use-cases/resize-reactive-nodes/ >}}
