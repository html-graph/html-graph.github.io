---
title: Features | Draggable Edges
sitemap:
  priority: 0.6
---

## Draggable Edges

In addition to <a href="/features/connectable-ports" target="_blank">connectable ports</a>,
it is useful to provide functionality for modifying existing edges.

<a href="/use-cases/draggable-edges/" target="_blank" aria-label="Draggable edges">
  <div class="video">
    <video autoplay muted loop>
      <source src="/media/draggable-edges.webm">
    </video>
  </div>
</a>

To enable draggable edges, call the `enableUserDraggableEdges` method on a `CanvasBuilder` instance:

{{< code lang="javascript">}}
const element = document.getElementById("canvas");

const canvas = new CanvasBuilder(element)
  .enableUserDraggableEdges()
  .build();
{{< /code >}}

It is crucial for the port to have a "grabable" area large enough to actually be grabbed by the user, as shown in the example below.

{{< use-case src=/use-cases/draggable-edges/ >}}

The `enableUserDraggableEdges` method accepts optional configuration.

### Configuration Parameters

| Name                        | Type                                                                                   | Description                                                                                                              | Required | Default                                          |
|-----------------------------|----------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|----------|--------------------------------------------------|
| `draggingEdgeResolver`      | `(portId) => any`                                                                      | Resolves edge ID which will be dragged based on provided grabbed port ID. `null` means do not initiate dragging process. | no       | Latest adjacent edge                             |
| `connectionAllowedVerifier` | `(request: { from: Identifier, to: Identifier }) => boolean`                           | Verifies if connection between specified ports is allowed.                                                               | no       | `(request) => true`                              |
| `dragPortDirection`         | <code>[DragPortDirection](#drag-port-direction)</code>                                 | Direction of dragging port                                                                                 | no       | `undefined`                     |
| `connectionPreprocessor`    | `(request: AddEdgeRequest) => AddEdgeRequest`                                          | Applies modification to the edge about to be reattached.                                                                 | no       | `(request) => request`                           |
| `mouseDownEventVerifier`    | `(event) => boolean`                                                                   | Function to verify if mouse event should initiate connection dragging process                                            | no       | `(event) => event.button === 0 && event.ctrlKey` |
| `mouseUpEventVerifier`      | `(event) => boolean`                                                                   | Function to verify if mouse event should reattach connection                                                             | no       | `(event) => event.button === 0`                  |
| `draggingEdgeShape`         | <code><a href="/defaults#edge-shape-config" target="_blank">EdgeShapeConfig</a></code> | The shape of a dragging edge                                                                                             | no       | Same as the edge being dragged                   |
| `events`                    | <code>[EventsConfig](#events)</code>                                                   | Handlers for available events                                                                                            | no       | `{}`                                             |

{{< ref-target ref="drag-port-direction">}}
### `DragPortDirection` ### {#drag-port-direction}

| Name                     | Type                         | Description                                                        |
|--------------------------|------------------------------|--------------------------------------------------------------------|
| Constant                 | `number`                     | Fixed radian angle for the dragging port direction                 |
| Nearest Connectable Port | `"nearest-connectable-port"` | Direction matches the direction of the nearest connectable port    |
| Undefined                | `undefined`                  | Direction matches the original direction of the port being grabbed |
{{< /ref-target >}}

{{< ref-target ref="events">}}
### `EventsConfig` ### {#events}

| Name                        | Type                                  | Description                                                      | Required | Default      |
|-----------------------------|---------------------------------------|------------------------------------------------------------------|----------|--------------|
| `onAfterEdgeReattached`     | `(edgeId) => void`                    | Function called after an edge has been reattached                | no       | `() => void` |
| `onEdgeReattachInterrupted` | `(edge: DraggingEdgePayload) => void` | Function called when edge reattach is interrupted in the process | no       | `() => void` |
| `onEdgeReattachPrevented`   | `(edge: DraggingEdgePayload) => void` | Function called when an attempt to reattach edge is prevented    | no       | `() => void` |

{{< /ref-target >}}

You might also be interested in the <a href="/tutorials/edges-with-remove-button/" target="_blank">Edges with Remove Button</a> tutorial.

<a href="/use-cases/midpoint-edge/" target="_blank" aria-label="Edges with Remove Button">
  <div class="video">
    <video autoplay muted loop>
      <source src="/media/removable-edges.webm">
    </video>
  </div>
</a>
