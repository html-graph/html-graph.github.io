---
title: Modules | Resize Reactive Nodes
sitemap:
  priority: 0.3
---

## Resize-Reactive Nodes

To enable built-in resize-reactive nodes, ensuring that edges are automatically updated when adjacent nodes are resized, call the `enableResizeReactiveNodes` method on `CanvasBuilder`.

{{< code lang="javascript">}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .enableResizeReactiveNodes()
  .build();
{{< /code >}}

{{< use-case title="Resize Reactive Nodes" src=/use-cases/resize-reactive-nodes/ >}}
