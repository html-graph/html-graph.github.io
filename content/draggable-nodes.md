---
title: Draggable nodes
---

## Draggable nodes


To enable built-in draggable nodes call `setUserDraggableNodes` method on `CanvasBuilder`.

{{< code lang="javascript">}}
const canvas = new CanvasBuilder()
  .setUserDraggableNodes()
  .build();
{{</code>}}


{{< use-case title="Draggable nodes" src=/use-cases/draggable-nodes/ >}}

This method accepts optional configuration:

{{< code lang="javascript">}}
const canvas = new CanvasBuilder()
  .setUserDraggableNodes({
    moveOnTop: false,
    mouse: {
      dragCursor: "crosshair";
      mouseDownEventVerifier: (event: MouseEvent) => event.ctrlKey;
      mouseUpEventVerifier: (event: MouseEvent) => true;
    };
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
    };
  })
  .build();
{{</code>}}


| Name      | Type                                        | Description                   | Required | Default |
|-----------|---------------------------------------------|-------------------------------|----------|---------|
| moveOnTop | boolean                                     | move grabbed node on top      | no       | true    |
| mouse     | <span data-ref="mouse">MouseConfig</span>   | mouse related configuration   | no       | {}      |
| events    | <span data-ref="events">EventsConfig</span> | handlers for available events | no       | {}      |


{{< ref-target ref="mouse">}}

### Mouse configuration:

| Name                   | Type           | Description                                              | Required | Default    |
|------------------------|----------------|----------------------------------------------------------|----------|------------|
| dragCursor             | string \| null | Cursor to set on grab                                    | no       | "grab"     |
| mouseDownEventVerifier | function       | Function to verify if mouse event should trigger grab    | no       | () => true |
| mouseUpEventVerifier   | function       | Function to verify if mouse event should trigger release | no       | () => true |

{{< /ref-target >}}

{{< ref-target ref="events">}}

### Events configuration:

| Name               | Type     | Description                                   | Required | Default    |
|--------------------|----------|-----------------------------------------------|----------|------------|
| onNodeDrag         | function | Function to call when node gets dragged       | no       | () => void |
| onBeforeNodeDrag   | function | Function to verify if node should be dragged  | no       | () => true |
| onNodeDragFinished | function | Function to call when node drag gets finished | no       | () => void |

{{< /ref-target >}}
