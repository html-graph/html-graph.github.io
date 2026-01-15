---
title: Layouts | Custom (advanced)
sitemap:
  priority: 0.3
---

## Custom Layout (advanced)

When built-in layout algorithms are insufficient, it's possible to provide a custom
implementation of a layout algorithm.

The following example demonstrates implementation of a layout algorithm using TypeScript.

{{< code lang="typescript">}}

import type {
  Point,
  Identifier,
  LayoutAlgorithm,
  LayoutAlgorithmParams,
} from "@html-graph/html-graph";

class MyCustomLayoutAlgorithm implements LayoutAlgorithm {
  calculateCoordinates(params: LayoutAlgorithmParams): ReadonlyMap<Identifier, Point> {
    const { graph, viewport } = params;

    const result = new Map<Identifier, Point>();
    const { width, height } = viewport.getDimensions();
    const bottomLeft: Point = viewport.createContentCoords({ x: 0, y: 0 });
    const topRight: Point = viewport.createContentCoords({ x: width, y: height });

    graph.getAllNodeIds().forEach((nodeId) => {
      const x = Math.random() * (topRight.x - bottomLeft.x) + bottomLeft.x;
      const y = Math.random() * (topRight.y - bottomLeft.y) + bottomLeft.y;

      result.set(nodeId, { x, y });
    });

    return result;
  }
}
{{< /code >}}

As shown above, any custom algorithm must implement the `LayoutAlgorithm` interface.
This interface requires one mandatory method, `calculateCoordinates`, which provides coordinates for each node.

The method takes one argument consisting of:
- `graph` - a <a href="/graph-state/" target="_blank">Graph</a> object.
- `viewport` - a <a href="/viewport-state/" target="_blank">Viewport</a> object.

The return value should be a `Map` where keys correspond to node identifiers and values represent their respective coordinates.

If the map contains coordinates for certain nodes but omits others, those omitted nodes retain their original positions.

To specify your custom layout algorithm implementation follow the example below.

{{< code lang="typescript">}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .enableLayout({
    algorithm: {
      type: 'custom',
      instance: new MyCustomLayoutAlgorithm(),
    },
  })
  .build();
{{< /code >}}
