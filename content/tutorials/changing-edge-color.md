---
title: HTMLGraph | Tutorials | Changing Edge Color
---

## Changing Edge Color

<a href="/use-cases/changing-edge-color/" target="_blank" aria-label="Changing edge color">
  <div class="video">
    <video autoplay muted loop>
      <source src="/media/changing-edge-color.webm">
    </video>
  </div>
</a>


Edge color can be dynamically modified using `--edge-color` CSS variable for edge svg element, as
shown in the example below.

This example demonstrates how to change edge color on mouse hover, using
`InteractiveEdgeShape` decorator.

{{< code lang="javascript">}}
import {
  CanvasBuilder,
  BezierEdgeShape,
  InteractiveEdgeShape,
} from "@html-graph/html-graph";

const element = document.getElementById("canvas");

const canvas = new CanvasBuilder(element)
  .setDefaults({
    edges: {
      shape: () => {
        const baseShape = new BezierEdgeShape({
          hasTargetArrow: true,
          color: "#777777"
        });

        const interactiveShape = new InteractiveEdgeShape(baseShape, {
          distance: 20,
        });

        interactiveShape.handle.addEventListener("mouseenter", () => {
          interactiveShape.svg.style.setProperty("--edge-color", "#f9880e");
        });

        interactiveShape.handle.addEventListener("mouseleave", () => {
          interactiveShape.svg.style.setProperty("--edge-color", "#777777");
        });

        return interactiveShape;
      },
    },
  })
  .build();
{{< /code >}}

{{< use-case title="Changing edge color on mouse hover" src=/use-cases/changing-edge-color/ >}}
