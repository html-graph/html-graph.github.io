---
title: Tutorials | Draggable Selection
---

## Draggable Selection

<a href="/use-cases/draggable-selection/" target="_blank" aria-label="Draggable Selection">
  <div class="video">
    <video autoplay muted loop>
      <source src="/media/draggable-selection.webm">
    </video>
  </div>
</a>

The library does not provide draggable selection out-of-the-box, but this functionality
can be implemented using the provided features:

- <a href="/features/draggable-nodes" target="_blank">Draggable Nodes</a>
- <a href="/features/rectangular-selection" target="_blank">Rectangular Selection</a>

The main idea is to handle the node drag event to update all selected nodes except for the one being dragged.

{{< code lang="javascript">}}

const currentSelection = new Set();

let draggingNodeCoords = null;

const highlightSelectedNodes = () => {
  canvas.graph.getAllNodeIds().forEach((nodeId) => {
    const { element } = canvas.graph.getNode(nodeId);
    const selected = currentSelection.has(nodeId);

    element.classList.toggle("selected", selected);
  });
}

const canvas = new CanvasBuilder(element)
  .enableUserDraggableNodes({
    events: {
      onNodeDragStarted: (nodeId) => {
        const { x, y } = canvas.graph.getNode(nodeId);

        // Saving dragging node coordinates
        draggingNodeCoords = { x, y };
      },
      onNodeDrag: (nodeId) => {
        const { x, y } = canvas.graph.getNode(nodeId);

        if (currentSelection.has(nodeId)) {
          const dx = x - draggingNodeCoords.x;
          const dy = y - draggingNodeCoords.y;

          // Updating coordinates of selected nodes which are not dragging
          currentSelection.forEach((selectedNodeId) => {
            if (selectedNodeId !== nodeId) {
              const selectedNode = canvas.graph.getNode(selectedNodeId);

              canvas.updateNode(selectedNodeId, {
                x: selectedNode.x + dx,
                y: selectedNode.y + dy,
              });
            }
          });
        }

        // Updating dragging node coordinates
        draggingNodeCoords = { x, y };
      },
      onNodeDragFinished: () => {
        // Resetting dragging node coordinates
        draggingNodeCoords = null;
      },
    }
  })
  .enableRectangularSelection({
    onSelectionFinished: (selectionRect) => {
      currentSelection.clear();

      canvas.graph.getAllNodeIds().forEach((nodeId) => {
        const { element } = canvas.graph.getNode(nodeId);
        const nodeRect = element.getBoundingClientRect();
        const selected = checkIntersection(nodeRect, selectionRect);

        if (selected) {
          currentSelection.add(nodeId);
        }
      });

      highlightSelectedNodes();
    },
  })
  // ...
  .build();
{{< /code >}}

The example below demonstrates how to combine these two features so that the user can drag multiple nodes.
Hold `ctrl` to activate rectangular selection.

{{< use-case src=/use-cases/draggable-selection/ >}}

