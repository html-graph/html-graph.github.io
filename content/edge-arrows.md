---
title: Edge Arrows
---

## Edge Arrows

Arrow shape can be customized by setting `arrowRenderer` edge shape parameter,
for example:

{{< code lang="javascript">}}
const element = document.getElementById("canvas");

const canvas = new CanvasBuilder(element)
  .setDefaults({
    edges: {
      shape: {
        arrowRenderer: {
          type: "triangle",
          radius: 7,
        }
      }
    }
  })
  .build();
{{< /code >}}

The following arrow types are available:

| Type         | Preview                                                                                                                                                                         | Optional Parameters                                   |
|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|
| `"wedge"`    | <a href="/use-cases/wedge-arrows/" aria-label="Wedge Arrows" target="_blank">{{< image path="/images/wedge-arrow" alt="Wedge Arrow" width="500" height="500">}}</a>             | `radius`,<br> `smallRadius`,<br> `angle` (in radians) |
| `"triangle"` | <a href="/use-cases/triangle-arrows/" aria-label="Triangle Arrows" target="_blank">{{< image path="/images/triangle-arrow" alt="Triangle Arrow" width="500" height="500">}}</a> | `radius`                                              |
| `"arc"`      | <a href="/use-cases/arc-arrows/" aria-label="Arc Arrows" target="_blank">{{< image path="/images/arc-arrow" alt="Arc Arrow" width="500" height="500">}}</a>                     | `radius`                                              |

Also custom renderer function can be specified such as:

{{< code lang="javascript">}}
const arrowRenderer = (renderingParams) => {
  const { arrowLength, direction, shift } = renderingParams;

  const fullLength = arrowLength + 4;

  const arrowPoints = [
    { x: 0, y: 0 },
    { x: fullLength, y: 7 },
    { x: arrowLength, y: 0 },
    { x: fullLength, y: -7 },
  ];

  const points = arrowPoints.map((point) => ({
    x: direction.x * point.x - direction.y * point.y + shift.x,
    y: direction.y * point.x + direction.x * point.y + shift.y,
  }));

  const move = `M ${points[0].x} ${points[0].y}`;
  const line1 = `L ${points[1].x} ${points[1].y}`;
  const line2 = `L ${points[2].x} ${points[2].y}`;
  const line3 = `L ${points[3].x} ${points[3].y}`;

  return `${move} ${line1} ${line2} ${line3} Z`;
};
{{< /code >}}

- `renderingParams.direction` - vector to which arrow should be rotated
- `renderingParams.shift` - vector to which arrow should be shifted
- `renderingParams.arrowLength` - length that arrow should cover

{{< use-case src=/use-cases/custom-arrows/ >}}
