---
title: Features | Node Resize Reactive Edges
sitemap:
  priority: 0.3
---

## Node Resize Reactive Edges

<a href="/use-cases/node-resize-reactive-edges/" target="_blank" aria-label="Responsive Nodes">
  <div class="video">
    <video autoplay muted loop>
      <source src="/media/node-resize-reactive-edges.webm">
    </video>
  </div>
</a>

To enable built-in node resize reactive edges, ensuring that edges are automatically updated
when adjacent nodes are resized, call the `enableNodeResizeReactiveEdges` method on `CanvasBuilder`.

{{< code lang="javascript">}}
const element = document.getElementById("canvas");

const canvas = new CanvasBuilder(element)
  .enableNodeResizeReactiveEdges()
  .build();
{{< /code >}}

{{< use-case src=/use-cases/node-resize-reactive-edges/ >}}
