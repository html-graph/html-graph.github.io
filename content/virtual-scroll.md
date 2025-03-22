---
title: Virtual Scroll
---

## Virtual Scroll

For particularly large graphs (starting at around 500 nodes and edges), it's crucial to optimize rendering by loading only the nodes and edges that are within or near the viewport.

{{< use-case title="Virtual scroll with 100k nodes. Hold CTRL to scale" src=/use-cases/virtual-scroll/ >}}

To enable this built-in behavior, call the `enableVirtualScroll` method on `CanvasBuilder`. This method requires a configuration object.

{{< code lang="javascript">}}
const canvas = new CanvasBuilder()
  .enableVirtualScroll({
    nodeContainingRadius: {
      vertical: 50,
      horizontal: 50,
    }
  })
  .build();
{{< /code >}}

### Configuration Parameters

| Name                      | Type                                        | Description                                         | Required |
|---------------------------|---------------------------------------------|-----------------------------------------------------|----------|
| `nodeContainingRadius` | <span data-ref="radius">RadiusConfig</span> | The radius that fully covers a node from its center | yes      |

{{< ref-target ref="radius">}}

### RadiusConfig

| Name         | Type   | Description                                                     | Required |
|--------------|--------|-----------------------------------------------------------------|----------|
| `vertical`   | number | The vertical maximum distance from node's center to it's side   | yes      |
| `horizontal` | number | The horizontal maximum distance from node's center to it's side | yes      |

{{< /ref-target >}}

Since virtual scroll cannot rely on the DOM to calculate a node's bounding rectangle, you must specify the maximum containing radius for nodes. This radius should fully cover every node from its center.

For example, if the center of every node is at (50%, 50%), and the maximum node width is 100px with a maximum height of 200px, the horizontal radius should be 50, and the vertical radius should be 100.

Smaller values for these radii result in greater optimization.

The `enableVirtualScroll` method automatically configures the transformable viewport, but you can still customize transform settings by calling `setTransformableViewport`.

{{< code lang="javascript">}}
const canvas = new CanvasBuilder()
  .setTransformableViewport({
    transformPreprocessor: {
      type: "scale-limit",
      minContentScale: 0.3,
    },
  })
  .enableVirtualScroll({
    nodeContainingRadius: {
      vertical: 50,
      horizontal: 50,
    }
  })
  .build();
{{< /code >}}

It is **highly recommended to set a minimum content scale limit for virtual scroll**, as shown in the example above, to ensure the number of nodes and edges within the viewport stays within manageable limits, regardless of user actions.
