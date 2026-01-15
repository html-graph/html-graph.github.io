---
title: Features | Draggable Nodes
sitemap:
  priority: 0.8
---

## Draggable Nodes

<a href="/use-cases/draggable-nodes/" target="_blank" aria-label="Draggable Nodes">
  <div class="video">
    <video autoplay muted loop>
      <source src="/media/draggable-nodes.webm">
    </video>
  </div>
</a>

To enable built-in draggable nodes, call the `enableUserDraggableNodes` method on `CanvasBuilder`.

{{< code lang="javascript">}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .enableUserDraggableNodes()
  .build();
{{< /code >}}

{{< use-case src=/use-cases/draggable-nodes/ >}}

This method accepts optional configuration:

{{< code lang="javascript">}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .enableUserDraggableNodes({
    moveOnTop: true,
    moveEdgesOnTop: false,
    gridSize: 50,
    mouse: {
      dragCursor: "crosshair",
      mouseDownEventVerifier: (event) => event.ctrlKey,
      mouseUpEventVerifier: (event) => true,
    },
    events: {
      onNodeDragStarted: (nodeId) => {
        console.log(nodeId);
      },
      onNodeDrag: (nodeId) => {
        console.log(nodeId);
      },
      onNodeDragFinished: (nodeId) => {
        console.log(nodeId);
      },
    },
  })
  .build();
{{< /code >}}

### Configuration Parameters

| Name               | Type                                               | Description                                         | Required | Default      |
|--------------------|----------------------------------------------------|-----------------------------------------------------|----------|--------------|
| `moveOnTop`        | `boolean`                                          | Move grabbed node to the top                        | no       | `true`       |
| `moveEdgesOnTop`   | `boolean`                                          | Move connected edges to the grabbed node beneath it | no       | `true`       |
| `nodeDragVerifier` | `(nodeId) => boolean`                              | Function to verify if node should be dragged        | no       | `() => true` |
| `gridSize`         | `number \| null`                                   | Grid size for nodes to be snapped to                | no       | `null`       |
| `mouse`            | <code>[MouseConfig](#mouse-configuration)</code>   | Mouse-related configuration                         | no       | `{}`         |
| `events`           | <code>[EventsConfig](#events-configuration)</code> | Handlers for available events                       | no       | `{}`         |

{{< ref-target ref="mouse-configuration">}}

### Mouse Configuration ### {#mouse-configuration}

| Name                     | Type                             | Description                                              | Required | Default      |
|--------------------------|----------------------------------|----------------------------------------------------------|----------|--------------|
| `dragCursor`             | `string \| null`                 | Cursor to set on grab                                    | no       | `"grab"`     |
| `mouseDownEventVerifier` | `(event) => boolean` | Function to verify if mouse event should trigger grab    | no       | `() => true` |
| `mouseUpEventVerifier`   | `(event) => boolean` | Function to verify if mouse event should trigger release | no       | `() => true` |

{{< /ref-target >}}

{{< ref-target ref="events-configuration">}}

### Events Configuration ### {#events-configuration}

| Name                 | Type               | Description                                   | Required | Default      |
|----------------------|--------------------|-----------------------------------------------|----------|--------------|
| `onNodeDragStarted`  | `(nodeId) => void` | Function to call when node drag is started    | no       | `() => void` |
| `onNodeDrag`         | `(nodeId) => void` | Function to call when node is dragged         | no       | `() => void` |
| `onNodeDragFinished` | `(nodeId) => void` | Function to call when node drag is finished   | no       | `() => void` |

{{< /ref-target >}}
