---
title: Features | Rectangular Selection
sitemap:
  priority: 0.8
---

## Rectangular Selection

<a href="/use-cases/rectangular-selection/" target="_blank" aria-label="Rectangular Selection">
  <div class="video">
    <video autoplay muted loop>
      <source src="/media/rectangular-selection.webm">
    </video>
  </div>
</a>

To enable the built-in rectangular selection, call the `enableRectangularSelection` method on the `CanvasBuilder` instance.

{{< code lang="javascript">}}
const element = document.getElementById("canvas");

/**
 * This function verifies whether a node rectangle intersects with the selection rectangle.
 * Both parameters are of type `DOMRect`.
 */
const checkIntersection = (nodeRect, selectionRect) => {
  const isNodeRightOfSelection = nodeRect.right < selectionRect.left;
  const isNodeLeftOfSelection = nodeRect.left > selectionRect.right;
  const isNodeBottomOfSelection = nodeRect.bottom < selectionRect.top;
  const isNodeTopOfSelection = nodeRect.top > selectionRect.bottom;

  return !(
    isNodeRightOfSelection ||
    isNodeLeftOfSelection ||
    isNodeTopOfSelection ||
    isNodeBottomOfSelection
  );
}

const canvas = new CanvasBuilder(element)
  .enableRectangularSelection({
    onSelectionFinished: (selectionRect) => {
      canvas.graph.getAllNodeIds().forEach((nodeId) => {
        const { element } = canvas.graph.getNode(nodeId);
        const nodeRect = element.getBoundingClientRect();

        const selected = checkIntersection(nodeRect, selectionRect);

        element.classList.toggle("selected", selected);
      });
    },
  })
  .build();
{{< /code >}}

Hold the `ctrl` key to activate rectangular selection in the demo below.

{{< use-case src=/use-cases/rectangular-selection/ >}}

### Rectangular Selection Configuration Parameters

| Name                     | Type                       | Description                                                                                   | Required | Default                                                   |
|--------------------------|----------------------------|-----------------------------------------------------------------------------------------------|----------|-----------------------------------------------------------|
| `rectangleElement`       | `Element`                  | Visual element to be placed inside the selection. Should have `width` and `height` of `100%`. | no       | Semi-transparent blue rectangle with a grey dashed border |
| `onSelectionStarted`     | `() => void`               | Function to call when the selection is started                                                | no       | `() => {}`                                                |
| `onSelectionChange`      | `(rect: DOMRect) => void`  | Function to call when the selection rectangle is updated                                      | no       | `() => {}`                                                |
| `onSelectionFinished`    | `(rect: DOMRect) => void`  | Function to call when the selection is finished                                               | no       | `() => {}`                                                |
| `onSelectionInterrupted` | `(rect: DOMRect) => void`  | Function to call when the selection is interrupted in progress (e.g., mouse moved outside)    | no       | `() => {}`                                                |
| `mouseDownEventVerifier` | `(event) => boolean`       | Function to verify whether a mouse event should initiate the selection process                | no       | `(event) => event.button === 0 && event.ctrlKey`          |
| `mouseUpEventVerifier`   | `(event) => boolean`       | Function to verify whether a mouse event should apply the selection                           | no       | `(event) => event.button === 0`                           |
