---
title: Features | Virtual Scroll
sitemap:
  priority: 0.8
---

## Virtual Scroll

For particularly large graphs (starting at around 500 nodes and edges), it's crucial to optimize rendering by loading only the nodes and edges that are within or near the viewport.

<a href="/use-cases/virtual-scroll/" target="_blank" aria-label="Virtual Scroll">
  <div class="video">
    <video autoplay muted loop>
      <source src="/media/virtual-scroll.webm">
    </video>
  </div>
</a>


To enable this built-in behavior, call the `enableVirtualScroll` method on `CanvasBuilder`. This method requires a configuration object.

{{< code lang="javascript">}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .enableVirtualScroll({
    nodeContainingRadius: {
      vertical: 50,
      horizontal: 50,
    }
  })
  .build();
{{< /code >}}

{{< use-case title="Virtual scroll with 100k nodes" src=/use-cases/virtual-scroll/ >}}

### Configuration Parameters

| Name                   | Type                           | Description                                         | Required |
|------------------------|--------------------------------|-----------------------------------------------------|----------|
| `nodeContainingRadius` | [RadiusConfig](#radius-config) | The radius that fully covers a node from its center | yes      |
| `events`               | [EventsConfig](#events-config) | Virtual scroll retated events                       | no       |

{{< ref-target ref="radius-config">}}

### RadiusConfig {#radius-config}

| Name         | Type   | Description                                                     | Required |
|--------------|--------|-----------------------------------------------------------------|----------|
| `vertical`   | number | The vertical maximum distance from node's center to it's side   | yes      |
| `horizontal` | number | The horizontal maximum distance from node's center to it's side | yes      |

{{< /ref-target >}}

{{< ref-target ref="events-config">}}

### EventsConfig {#events-config}

Here's your table with the formatting preserved exactly as requested:

| Name                   | Type                    | Description                                           | Required | Default      |
|------------------------|-------------------------|-------------------------------------------------------|----------|--------------|
| `onBeforeNodeAttached` | `(nodeId: any) => void` | Function called just before node is attached to DOM   | no       | `() => void` |
| `onAfterNodeDetached`  | `(nodeId: any) => void` | Function called right after node is detached from DOM | no       | `() => void` |

{{< /ref-target >}}

Since virtual scroll cannot rely on the DOM to calculate a node's bounding rectangle, you must specify the maximum containing radius for nodes. This radius should fully cover every node from its center.

For example, if the center of every node is at (50%, 50%), and the maximum node width is 100px with a maximum height of 200px, the horizontal radius should be 50, and the vertical radius should be 100.

Smaller values for these radii result in greater optimization.

The `enableVirtualScroll` method automatically configures the transformable viewport,
but you can still customize transform settings by calling `enableUserTransformableViewport`.

{{< code lang="javascript">}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .enableUserTransformableViewport({
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

It is **highly recommended to set a minimum content scale limit for virtual scroll**,
as shown in the example above, to ensure the number of nodes and edges within the
viewport stays within manageable limits, regardless of user actions.
