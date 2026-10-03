---
title: Tutorials | Interactive Edges
---

## Interactive Edges

<a href="/use-cases/interactive-edges/" target="_blank" aria-label="Interactive Edges">
  <div class="video">
    <video autoplay muted loop>
      <source src="/media/interactive-edges.webm">
    </video>
  </div>
</a>

By default, edges in the graph are not interactive.
To enable interaction with edges, you can pass the `interactiveDistance`
parameter to the edge shape constructor.

This example shows how to handle click event for an edge:

{{< code lang="javascript">}}
import { CanvasBuilder, BezierEdgeShape } from "@html-graph/html-graph";

const element = document.getElementById("canvas");

const canvas = new CanvasBuilder(element)
  .setDefaults({
    edges: {
      shape: (edgeId) => {
        const shape = new BezierEdgeShape({
          hasTargetArrow: true,
          interactiveDistance: 10,
        });

        shape.element.addEventListener("click", (event) => {
          console.log(`clicked on edge with id: ${edgeId}`);
        });

        return shape;
      },
    },
  })
  .build();
{{< /code >}}

Try out this demo, which toggles edge line animated dash on edge click:

{{< use-case src=/use-cases/interactive-edges/ >}}

When used with [connectable ports](/features/connectable-ports) it is recommended to set edge priority below node priority
to ensure ports remain accessible:

{{< code lang="javascript">}}
const canvas = new CanvasBuilder(element)
  .setDefaults({
    nodes: {
      priority: 1, // higher z-index
    },
    edges: {
      priority: 0, // lower z-index
      shape: (edgeId) => {
        const shape = new BezierEdgeShape({
          hasTargetArrow: true,
          interactiveDistance: 10,
        });

        // ... event handlers ...

        return shape;
      },
    },
  })
  .enableUserDraggableNodes({
    moveEdgesOnTop: false, // keeps edges under nodes during node dragging
  })
  .enableUserTransformableViewport()
  .enableBackground()
  .build();
{{< /code >}}


---

**Related Pages**

- <a href="/tutorials/edges-with-remove-button/" target="_blank">Edges with Remove Button</a>
- <a href="/tutorials/nocode-editor/" target="_blank">Nocode Editor</a>
