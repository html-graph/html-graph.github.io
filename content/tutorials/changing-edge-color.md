---
title: Tutorials | Changing Edge Color
---

## Changing Edge Color

<a href="/use-cases/changing-edge-color/" target="_blank" aria-label="Changing edge color">
  <div class="video">
    <video autoplay muted loop>
      <source src="/media/changing-edge-color.webm">
    </video>
  </div>
</a>


Edge color can be dynamically modified using `--edge-color` CSS variable for edge `element`, as
shown in the example below.

This example demonstrates how to change edge color on mouse hover.

{{< code lang="javascript">}}
import { CanvasBuilder, BezierEdgeShape } from "@html-graph/html-graph";

const element = document.getElementById("canvas");

const canvas = new CanvasBuilder(element)
  .setDefaults({
    edges: {
      shape: () => {
        const shape = new BezierEdgeShape({
          hasTargetArrow: true,
          color: "#777777"
          interactiveDistance: 20,
        });

        shape.element.addEventListener("mouseenter", () => {
          shape.element.style.setProperty("--edge-color", "#f9880e");
        });

        shape.element.addEventListener("mouseleave", () => {
          shape.element.style.setProperty("--edge-color", "#777777");
        });

        return shape;
      },
    },
  })
  .build();
{{< /code >}}

{{< use-case src=/use-cases/changing-edge-color/ >}}

---

**Related Pages**

- <a href="/tutorials/interactive-edges/" target="_blank">Interactive Edges</a>
- <a href="/tutorials/edges-with-remove-button/" target="_blank">Edges with Remove Button</a>
- <a href="/tutorials/nocode-editor/" target="_blank">Nocode Editor</a>
