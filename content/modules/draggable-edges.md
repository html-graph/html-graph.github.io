---
title: Modules | Draggable Edges
sitemap:
  priority: 0.6
---

## Draggable Edges

In addition to [connectable ports](/modules/connectable-ports), it is useful to provide functionality for modifying existing edges.

<a href="/use-cases/draggable-edges/" target="_blank" aria-label="Draggable edges">
  <div class="video">
    <video autoplay muted loop>
      <source src="/media/draggable-edges.webm">
    </video>
  </div>
</a>

To enable draggable edges, call the `enableUserDraggableEdges` method on a `CanvasBuilder` instance:

{{< code lang="javascript">}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .enableUserDraggableEdges()
  .build();
{{< /code >}}

It is crucial for the edge to have a "grabable" area large enough to actually be grabbed by the user, as shown in the example below.

{{< use-case title="Draggable Edges" src=/use-cases/draggable-edges/ >}}

The `enableUserDraggableEdges` method accepts optional configuration.

### Configuration Parameters

| Name                   | Type                                                                      | Description                                                                                                              | Required | Default                                          |
|------------------------|---------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|----------|--------------------------------------------------|
| connectionPreprocessor | `(request: AddEdgeRequest) => AddEdgeRequest \| null`                     | Applies modification to the edge about to be reattached. `null` means that connection is disallowed.                     | no       | `(request) => request`                           |
| mouseDownEventVerifier | `(event) => boolean`                                                      | Function to verify if mouse event should initiate connection dragging process                                            | no       | `(event) => event.button === 0 && event.ctrlKey` |
| mouseUpEventVerifier   | `(event) => boolean`                                                      | Function to verify if mouse event should reattach connection                                                             | no       | `(event) => event.button === 0`                  |
| draggingEdgeResolver   | `(portId: any) => any`                                                    | Resolves edge ID which will be dragged based on provided grabbed port ID. `null` means do not initiate dragging process. | no       | Latest adjacent edge                             |
| draggingEdgeShape      | <a href="/defaults#edge-shape-config" target="_blank">EdgeShapeConfig</a> | The shape of a dragging edge                                                                                             | no       | Same as the edge being dragged                   |
| events                 | [EventsConfig](#events)                                                   | Handlers for available events                                                                                            | no       | `{}`                                             |

{{< ref-target ref="events">}}

### Events Configuration ### {#events}

| Name                      | Type                                   | Description                                                      | Required | Default      |
|---------------------------|----------------------------------------|------------------------------------------------------------------|----------|--------------|
| onAfterEdgeReattached     | `(edgeId: any) => void`                | Function called after an edge has been reattached                | no       | `() => void` |
| onEdgeReattachInterrupted | `(edge: GraphEdge) => void`            | Function called when edge reattach is interrupted in the process | no       | `() => void` |
| onEdgeReattachPrevented   | `(edge: GraphEdge) => void`            | Function called when an attempt to reattach edge is prevented    | no       | `() => void` |

{{< /ref-target >}}
