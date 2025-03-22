---
title: Draggable Nodes
---

## Draggable Nodes

To enable built-in draggable nodes, call the `enableUserDraggableNodes` method on `CanvasBuilder`.

{{< code lang="javascript">}}
const canvas = new CanvasBuilder()
  .enableUserDraggableNodes()
  .build();
{{< /code >}}

{{< use-case title="Draggable Nodes" src=/use-cases/draggable-nodes/ >}}

This method accepts optional configuration:

{{< code lang="javascript">}}
const canvas = new CanvasBuilder()
  .enableUserDraggableNodes({
    moveOnTop: false,
    mouse: {
      dragCursor: "crosshair",
      mouseDownEventVerifier: (event: MouseEvent) => event.ctrlKey,
      mouseUpEventVerifier: (event: MouseEvent) => true,
    },
    events: {
      onNodeDrag: (payload: NodeDragPayload) => {
        console.log(payload);
      },
      onBeforeNodeDrag: (payload: NodeDragPayload) => {
        console.log(payload);
        return true;
      },
      onNodeDragFinished: (payload: NodeDragPayload) => {
        console.log(payload);
      },
    },
  })
  .build();
{{< /code >}}

### Configuration Parameters

| Name      | Type                                        | Description                   | Required | Default |
|-----------|---------------------------------------------|-------------------------------|----------|---------|
| moveOnTop | boolean                                     | Move grabbed node to the top  | no       | true    |
| mouse     | <span data-ref="mouse">MouseConfig</span>   | Mouse-related configuration   | no       | {}      |
| events    | <span data-ref="events">EventsConfig</span> | Handlers for available events | no       | {}      |

{{< ref-target ref="mouse">}}

### Mouse Configuration

| Name                   | Type           | Description                                              | Required | Default    |
|------------------------|----------------|----------------------------------------------------------|----------|------------|
| dragCursor             | string \| null | Cursor to set on grab                                    | no       | "grab"     |
| mouseDownEventVerifier | function       | Function to verify if mouse event should trigger grab    | no       | () => true |
| mouseUpEventVerifier   | function       | Function to verify if mouse event should trigger release | no       | () => true |

{{< /ref-target >}}

{{< ref-target ref="events">}}

### Events Configuration

| Name               | Type     | Description                                   | Required | Default    |
|--------------------|----------|-----------------------------------------------|----------|------------|
| onNodeDrag         | function | Function to call when node is dragged         | no       | () => void |
| onBeforeNodeDrag   | function | Function to verify if node should be dragged  | no       | () => true |
| onNodeDragFinished | function | Function to call when node drag is finished   | no       | () => void |

{{< /ref-target >}}
