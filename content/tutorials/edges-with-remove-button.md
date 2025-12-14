---
title: Advanced Edges | Edges with button in the center
---

## Edges with Remove Button

<a href="/use-cases/midpoint-edge/" target="_blank" aria-label="Edges with button in the center">
  <div class="video">
    <video autoplay muted loop>
      <source src="/media/removable-edges.webm">
    </video>
  </div>
</a>


In nocode editor user interfaces it's common to have some way of removing edges.

Removing an edge itself is an easy task, that can be done using the
[`removeEdge`](/canvas/#remove-edge) method.

{{< code lang="javascript">}}
canvas.removeEdge("edge-1");
{{< /code >}}

The challenge is to add some interactive element in the center of an edge to
handle click events that trigger edge removal.

This can be done using another edge decorator, but first we need to create a
function that would generate an interactive element. As a basis for a remove
button, you can use this implementation:

{{< code lang="javascript">}}
const createRemoveEdgeButton = () => {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

  group.classList.add("remove-button");

  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );

  circle.setAttribute("cx", "0");
  circle.setAttribute("cy", "0");
  circle.setAttribute("r", "7");
  circle.setAttribute("fill", "var(--remove-background)");
  circle.setAttribute("stroke", "var(--remove-color)");

  const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path1.setAttribute("d", "M -3 -3 L 3 3");
  path1.setAttribute("stroke", "var(--remove-color)");

  const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path2.setAttribute("d", "M 3 -3 L -3 3");
  path2.setAttribute("stroke", "var(--remove-color)");

  group.appendChild(circle);
  group.appendChild(path1);
  group.appendChild(path2);

  return group;
};
{{< /code >}}

And the corresponding CSS:

{{< code lang="css">}}
.remove-button {
  pointer-events: auto;
  cursor: pointer;
  --remove-color: #e88b74;
  --remove-background: white;
}

.remove-button:hover {
  --remove-color: #f93707;
}
{{< /code >}}

This is how the element appears:

{{< image path="/images/remove-button" alt="Remove button demo" width="200" height="200">}}

Now that the button element is ready, we can attach it to an edge and add event
listeners using the `MidpointEdgeShape`. This decorator positions the provided
element at the point of an edge that's equidistant from both ends.

{{< code lang="javascript">}}
import { CanvasBuilder, BezierEdgeShape, MidpointEdgeShape } from "@html-graph/html-graph";

const canvas = new CanvasBuilder(canvasElement)
  .setDefaults({
    edges: {
      shape: (edgeId) => {
        const baseShape = new BezierEdgeShape({ hasTargetArrow: true });

        const midpoint = createRemoveEdgeButton();

        midpoint.addEventListener("click", (event) => {
          canvas.removeEdge(edgeId);
        });

        return new MidpointEdgeShape(baseShape, midpoint);
      },
    },
  }).build();
{{< /code >}}

The final result is presented below.

{{< use-case title="Remove button in the center of an edge" src=/use-cases/midpoint-edge/ >}}

When combined with [connectable ports](/features/connectable-ports), this
functionality becomes particularly useful for nocode editor interfaces.
