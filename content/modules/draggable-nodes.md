---
title: Modules | Draggable Nodes
sitemap:
  priority: 0.8
---

## Draggable Nodes

To enable built-in draggable nodes, call the `enableUserDraggableNodes` method on `CanvasBuilder`.

{{< code lang="javascript">}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .enableUserDraggableNodes()
  .build();
{{< /code >}}

{{< use-case title="Draggable Nodes" src=/use-cases/draggable-nodes/ >}}

This method accepts optional configuration:

{{< code lang="javascript">}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .enableUserDraggableNodes({
    moveOnTop: true,
    moveEdgesOnTop: false,
    mouse: {
      dragCursor: "crosshair",
      mouseDownEventVerifier: (event) => event.ctrlKey,
      mouseUpEventVerifier: (event) => true,
    },
    events: {
      onNodeDrag: (payload) => {
        console.log(payload);
      },
      onBeforeNodeDrag: (payload) => {
        console.log(payload);
        return true;
      },
      onNodeDragFinished: (payload) => {
        console.log(payload);
      },
    },
  })
  .build();
{{< /code >}}

### Configuration Parameters

| Name             | Type                                  | Description                                         | Required | Default |
|------------------|---------------------------------------|-----------------------------------------------------|----------|---------|
| `moveOnTop`      | `boolean`                             | Move grabbed node to the top                        | no       | `true`  |
| `moveEdgesOnTop` | `boolean`                             | Move connected edges to the grabbed node beneath it | no       | `true`  |
| `mouse`          | [MouseConfig](#mouse-configuration)   | Mouse-related configuration                         | no       | `{}`    |
| `events`         | [EventsConfig](#events-configuration) | Handlers for available events                       | no       | `{}`    |

{{< ref-target ref="mouse-configuration">}}

### Mouse Configuration ### {#mouse-configuration}

| Name                     | Type             | Description                                              | Required | Default      |
|--------------------------|------------------|----------------------------------------------------------|----------|--------------|
| `dragCursor`             | `string \| null` | Cursor to set on grab                                    | no       | `"grab"`     |
| `mouseDownEventVerifier` | `function`       | Function to verify if mouse event should trigger grab    | no       | `() => true` |
| `mouseUpEventVerifier`   | `function`       | Function to verify if mouse event should trigger release | no       | `() => true` |

{{< /ref-target >}}

{{< ref-target ref="events-configuration">}}

### Events Configuration ### {#events-configuration}

| Name                 | Type       | Description                                   | Required | Default      |
|----------------------|------------|-----------------------------------------------|----------|--------------|
| `onNodeDrag`         | `function` | Function to call when node is dragged         | no       | `() => void` |
| `onBeforeNodeDrag`   | `function` | Function to verify if node should be dragged  | no       | `() => true` |
| `onNodeDragFinished` | `function` | Function to call when node drag is finished   | no       | `() => void` |

{{< /ref-target >}}
