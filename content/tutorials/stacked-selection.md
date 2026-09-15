---
title: Tutorials | Stacked Selection
---

## Stacked Selection

<a href="/use-cases/stacked-selection/" target="_blank" aria-label="Draggable Selection">
  <div class="video">
    <video autoplay muted loop>
      <source src="/media/stacked-selection.webm">
    </video>
  </div>
</a>

The library does not provide stacked selection feature out-of-the-box, but this functionality
can be implemented using <a href="/features/selectable-entities" target="_blank">Selectable Entities</a> feature.

The main idea is to verify if mouse down event has `ctrl` key pressed and change selection behavior based on this parameter.

{{< code lang="javascript">}}
let stackingEnabled = false;

const currentSelection = new Set();

const canvas = new CanvasBuilder(element)
  .enableUserSelectableNodes({
    onNodeSelected: (selectedNodeId) => {
      if (!stackingEnabled) {
        currentSelection.clear();
      }

      currentSelection.add(selectedNodeId);

      highlightSelectedNodes();
    },
    mouseDownEventVerifier: (event) => {
      stackingEnabled = event.ctrlKey;

      return event.button === 0;
    },
    mouseUpEventVerifier: (event) => {
      return event.button === 0;
    },
  })
  .enableUserSelectableCanvas({
    onCanvasSelected: () => {
      currentSelection.clear();

      highlightSelectedNodes();
    }
  })
  // ...
  .build();

const highlightSelectedNodes = () => {
  canvas.graph.getAllNodeIds().forEach((nodeId) => {
    const { element } = canvas.graph.getNode(nodeId);
    const selected = currentSelection.has(nodeId);

    element.classList.toggle("selected", selected);
  });
}
{{< /code >}}


Hold `ctrl` key in the example below to activate selection stacking.

{{< use-case src=/use-cases/stacked-selection/ >}}


---

**Related Pages**

- <a href="/features/selectable-entities/" target="_blank">Selectable Entities</a>
- <a href="/features/rectangular-selection/" target="_blank">Rectangular Selection</a>
- <a href="/tutorials/draggable-selection/" target="_blank">Draggable Selection</a>
