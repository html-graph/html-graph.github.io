---
title: Features | Selectable Nodes
sitemap:
  priority: 0.8
---

## Selectable Nodes

<a href="/use-cases/selectable-nodes/" target="_blank" aria-label="Selectable Nodes">
  <div class="video">
    <video autoplay muted loop>
      <source src="/media/selectable-nodes.webm">
    </video>
  </div>
</a>

To enable built-in selectable nodes, there are two `CanvasBuilder` configurations available:

- `enableUserSelectableNodes` - configures listener for node selection when the user clicks inside a node
- `enableUserSelectableCanvas` - configures listener for canvas selection when the user clicks outside of any node

Call them separately or both as needed.

{{< code lang="javascript">}}
const element = document.getElementById("canvas");

this.canvas = new CanvasBuilder(element)
  .enableUserSelectableNodes({
    onNodeSelected: (selectedNodeId) => {
      canvas.graph.getAllNodeIds().forEach((nodeId) => {
        const { element } = canvas.graph.getNode(nodeId);

        element.classList.toggle("selected", nodeId === selectedNodeId);
      });
    }
  })
  .enableUserSelectableCanvas({
    onCanvasSelected: () => {
      canvas.graph.getAllNodeIds().forEach((nodeId) => {
        const { element } = canvas.graph.getNode(nodeId);

        element.classList.remove("selected");
      });
    }
  })
  .build();
{{< /code >}}

{{< use-case src=/use-cases/selectable-nodes/ >}}

Both methods require a configuration object.

### Selectable Nodes Configuration Parameters

| Name                     | Type                            | Description                                                                          | Required | Default                         |
|--------------------------|---------------------------------|--------------------------------------------------------------------------------------|----------|---------------------------------|
| `onNodeSelected`         | `(selectedNodeId: any) => void` | Function to call when node is selected                                               | yes      |                                 |
| `mouseDownEventVerifier` | `(event) => boolean`            | Function to verify if mouse event should initiate node selection process             | no       | `(event) => event.button === 0` |
| `mouseUpEventVerifier`   | `(event) => boolean`            | Function to verify if mouse event should apply node selection                        | no       | `(event) => event.button === 0` |
| `movementThreshold`      | `number`                        | Specifies maximum cursor travel, when user actions can still be regarded as selection | no       | `10`                            |

### Selectable Canvas Configuration Parameters

| Name                     | Type                 | Description                                                                           | Required | Default                         |
|--------------------------|----------------------|---------------------------------------------------------------------------------------|----------|---------------------------------|
| `onCanvasSelected`       | `() => void`         | Function to call when canvas is selected                                              | yes      |                                 |
| `mouseDownEventVerifier` | `(event) => boolean` | Function to verify if mouse event should initiate canvas selection process            | no       | `(event) => event.button === 0` |
| `mouseUpEventVerifier`   | `(event) => boolean` | Function to verify if mouse event should apply canvas selection                       | no       | `(event) => event.button === 0` |
| `movementThreshold`      | `number`             | Specifies maximum cursor travel, when user actions can still be regarded as selection | no       | `10`                            |
