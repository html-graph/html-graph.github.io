---
title: Advanced Edges | Interactive Edges
---

## Interactive Edges

<video class="video" autoplay muted loop>
  <source src="/media/interactive-edges.webm">
</video>

By default, edges in the graph are not interactive.
To enable interaction with edges, you need to use the `InteractiveEdgeShape`
decorator.

First, create a canvas with desired edge shape using factory function:

{{< code lang="javascript">}}
import { CanvasBuilder, BezierEdgeShape } from "@html-grapg/html-graph";

const element = document.getElementById("canvas");

const canvas = new CanvasBuilder(element)
  .setDefaults({
    edges: {
      shape: () => {
        return new BezierEdgeShape({
          hasTargetArrow: true,
        });
      },
    },
  })
  .build();
{{< /code >}}

Then use the `InteractiveEdgeShape` decorator to create invisible interaction area around the visible edge.
This example shows how to handle mouse click event for an edge:

{{< code lang="javascript">}}
import {
  CanvasBuilder,
  BezierEdgeShape,
  InteractiveEdgeShape,
} from "@html-graph/html-graph";

const element = document.getElementById("canvas");

const canvas = new CanvasBuilder(element)
  .setDefaults({
    edges: {
      shape: (edgeId) => {
        const baseShape = new BezierEdgeShape({
          hasTargetArrow: true,
        });

        const interactiveShape = new InteractiveEdgeShape(baseShape, {
          width: 20,
        });

        interactiveShape.handle.addEventListener("mousedown", (event) => {
          console.log(`clicked on edge with id: ${edgeId}`);
        });

        return interactiveShape;
      },
    },
  })
  .build();
{{< /code >}}

### Decorator Parameters

| Name                  | Type                                     | Description                            | Required | Default |
|-----------------------|------------------------------------------|----------------------------------------|----------|---------|
| baseShape             | StructuredEdgeShape                      | The shape to make interactive          | Yes      |         |
| interactiveParameters | [InteractiveParams](#interactive-params) | Configuration for interactive behavior | No       | `{}`    |

{{< ref-target ref="interactive-params">}}
### Interactive Parameters ### {#interactive-params}

| Name  | Type   | Description                   | Required | Default |
|-------|--------|-------------------------------|----------|---------|
| width | number | Width of the interactive area | No       | `10`    |
{{< /ref-target >}}

Try out this demo, which toggles edge line animated dash on edge click:

{{< use-case title="Interactive edges" src=/use-cases/interactive-edges/ >}}

When used with [connectable ports](/modules/connectable-ports) it is recommended to set edge priority below node priority
to ensure ports remain accessible:

{{< code lang="javascript">}}
const canvas = new CanvasBuilder(element)
  .setDefaults({
    nodes: {
      priority: 1,
    },
    edges: {
      priority: 0,
      shape: (edgeId) => {
        const baseShape = new BezierEdgeShape({
          hasTargetArrow: true,
        });

        const interactiveShape = new InteractiveEdgeShape(baseShape, {
          width: 10,
        });

        // ... event handlers ...

        return interactiveShape;
      },
    },
  })
  .enableUserDraggableNodes({
    moveEdgesOnTop: false,
  })
  .enableUserTransformableViewport()
  .enableBackground()
  .build();
{{< /code >}}

Key configuration:
- Nodes: `priority: 1` (higher z-index)
- Edges: `priority: 0` (lower z-index)
- Draggable nodes: `moveEdgesOnTop: false` keeps edges under nodes during interaction
