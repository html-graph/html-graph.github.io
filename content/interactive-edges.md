---
title: Interactive Edges
---

## Interactive Edges

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

The `InteractiveEdgeShape` decorator provides an invisible interaction area around the visible edge.
This example shows how to handle mouse and touch events:

{{< code lang="javascript">}}
import {
  CanvasBuilder,
  BezierEdgeShape,
  InteractiveEdgeShape,
} from "@html-grapg/html-graph";

const element = document.getElementById("canvas");

const canvas = new CanvasBuilder(element)
  .setDefaults({
    edges: {
      shape: (edgeId) => {
        const baseShape = new BezierEdgeShape({
          hasTargetArrow: true,
        });

        const interactiveEdge = new InteractiveEdgeShape(baseShape, {
          width: 20,
        });

        const handler = () => {
            console.log(`clicked on edge with id: ${edgeId}`);
        };

        interactiveEdge.handle.addEventListener("mousedown", (event) => {
          event.stopPropagation();
          handler();
        });

        interactiveEdge.handle.addEventListener("touchstart", (event) => {
          event.stopPropagation();
          handler();
        });

        return interactiveEdge;
      },
    },
  })
  .build();
{{< /code >}}

### Decorator Parameters

| Name                  | Type                                             | Description                                                 | Required | Default |
|-----------------------|--------------------------------------------------|-------------------------------------------------------------|----------|---------|
| baseShape             | StructuredEdgeShape                              | The shape to make interactive                               | Yes      |         |
| interactiveParameters | <span data-ref="params">InteractiveParams</span> | Configuration for interactive behavior                      | No       | `{}`    |

{{< ref-target ref="params">}}
### Interactive Parameters

| Name  | Type   | Description                   | Required | Default |
|-------|--------|-------------------------------|----------|---------|
| width | number | Width of the interactive area | No       | `10`    |
{{< /ref-target >}}

Try out this demo to understand the mechanics of edge interaction:

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

        const interactiveEdge = new InteractiveEdgeShape(baseShape, {
          width: 10,
        });

        // ... event handlers ...

        return interactiveEdge;
      },
    },
  })
  .enableUserDraggableNodes({
    moveOnTop: false,
  })
  .enableUserTransformableViewport()
  .enableBackground()
  .build();
{{< /code >}}

Key configuration:
- Nodes: `priority: 1` (higher z-index)
- Edges: `priority: 0` (lower z-index)
- Draggable nodes: `moveOnTop: false` maintains priority order during interaction
