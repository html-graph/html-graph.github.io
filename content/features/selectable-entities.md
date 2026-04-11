---
title: Features | Selectable Nodes
sitemap:
  priority: 0.8
---

## Selectable Entities

<a href="/use-cases/selectable-entities/" target="_blank" aria-label="Selectable Entities">
  <div class="video">
    <video autoplay muted loop>
      <source src="/media/selectable-entities.webm">
    </video>
  </div>
</a>

To enable built-in selectable entities, three `CanvasBuilder` configurations are available:

- `enableUserSelectableNodes` - handles selection when the user clicks inside a node
- `enableUserSelectableEdges` - handles selection when the user clicks inside an edge.
  Edges must be interactive for this feature to work. See the
  <a href="/tutorials/interactive-edges" target="_blank">Interactive Edges</a> tutorial.
- `enableUserSelectableCanvas` - handles selection when the user clicks outside of any node or edge

Call them separately or all together as needed.

{{< code lang="javascript">}}
const element = document.getElementById("canvas");

const canvas = new CanvasBuilder(element)
  .enableUserSelectableNodes({
    onNodeSelected: (selectedNodeId) => {
      canvas.graph.getAllNodeIds().forEach((nodeId) => {
        const { element } = canvas.graph.getNode(nodeId);

        element.classList.toggle("selected", nodeId === selectedNodeId);
      });
    }
  })
  .enableUserSelectableEdges({
    onEdgeSelected: (selectedEdgeId) => {
      canvas.graph.getAllEdgeIds().forEach((edgeId) => {
        const { shape } = canvas.graph.getEdge(edgeId);
        const width = edgeId === selectedEdgeId ? 2 : 1;

        shape.line.setAttribute("stroke-width", `${width}`);
      });
    },
  })
  .enableUserSelectableCanvas({
    onCanvasSelected: () => {
      canvas.graph.getAllNodeIds().forEach((nodeId) => {
        const { element } = canvas.graph.getNode(nodeId);

        element.classList.remove("selected");
      });

      canvas.graph.getAllEdgeIds().forEach((edgeId) => {
        const { shape } = canvas.graph.getEdge(edgeId);

        shape.line.setAttribute("stroke-width", "1");
      });
    },
  })
  .build();
{{< /code >}}

{{< use-case src=/use-cases/selectable-entities/ >}}

Both methods require a configuration object.

### Selectable Nodes Configuration Parameters

| Name                     | Type                       | Description                                                                          | Required | Default                         |
|--------------------------|----------------------------|--------------------------------------------------------------------------------------|----------|---------------------------------|
| `onNodeSelected`         | `(selectedNodeId) => void` | Function to call when node is selected                                               | yes      |                                 |
| `movementThreshold`      | `number`                   | Specifies maximum cursor travel, when user actions can still be regarded as selection | no       | `10`                            |
| `mouseDownEventVerifier` | `(event) => boolean`       | Function to verify if mouse event should initiate node selection process             | no       | `(event) => event.button === 0` |
| `mouseUpEventVerifier`   | `(event) => boolean`       | Function to verify if mouse event should apply node selection                        | no       | `(event) => event.button === 0` |

### Selectable Canvas Configuration Parameters

| Name                     | Type                 | Description                                                                           | Required | Default                         |
|--------------------------|----------------------|---------------------------------------------------------------------------------------|----------|---------------------------------|
| `onCanvasSelected`       | `() => void`         | Function to call when canvas is selected                                              | yes      |                                 |
| `movementThreshold`      | `number`             | Specifies maximum cursor travel, when user actions can still be regarded as selection | no       | `10`                            |
| `mouseDownEventVerifier` | `(event) => boolean` | Function to verify if mouse event should initiate canvas selection process            | no       | `(event) => event.button === 0` |
| `mouseUpEventVerifier`   | `(event) => boolean` | Function to verify if mouse event should apply canvas selection                       | no       | `(event) => event.button === 0` |
