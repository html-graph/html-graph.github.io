---
title: Animated Layouts | Custom Animated Layout (advanced)
sitemap:
  priority: 0.3
---

## Custom Animated Layout (advanced)

When built-in animated layout algorithms are insufficient, it's possible to provide a custom
implementation of an animated layout algorithm.

The following example demonstrates implementation of a layout algorithm using TypeScript.

{{< code lang="typescript">}}
import type {
  Point,
  Identifier,
  AnimatedLayoutAlgorithm,
  AnimatedLayoutAlgorithmParams,
} from "@html-graph/html-graph";

class MyCustomAnimatedLayoutAlgorithm implements AnimatedLayoutAlgorithm {
  calculateNextCoordinates(
    params: AnimatedLayoutAlgorithmParams,
  ): ReadonlyMap<Identifier, Point> {
    const { graph, dt, viewport } = params;
    const result = new Map<Identifier, Point>();

    graph.getAllNodeIds().forEach((nodeId) => {
      const node = graph.getNode(nodeId)!;

      const x = node.x ?? Math.random() * 1000;
      const y = node.y ?? Math.random() * 1000;

      const angle = Math.min(dt, 0.1) * 0.01;

      const nextX = x * Math.cos(angle) - y * Math.sin(angle);
      const nextY = x * Math.sin(angle) + y * Math.cos(angle);

      result.set(nodeId, { x: nextX, y: nextY });
    });

    return result;
  }
}
{{< /code >}}

As shown above, any custom algorithm must implement the `AnimatedLayoutAlgorithm` interface.
This interface requires one mandatory method `calculateNextCoordinates`, which
provides next iteration coordinates for each node.

The method takes one argument consisting of:
- `graph` - a <a href="/graph-state/" target="_blank">Graph</a> object.
- `dt` - time elapsed form the previous iteration (note, that this value might be very high, so usage of `Math.min` function might be necessary)
- `viewport` - a <a href="/viewport-state/" target="_blank">Viewport</a> object.

The return value should be a `Map` where keys correspond to node identifiers and values represent their respective coordinates.

If the map contains coordinates for certain nodes but omits others, those omitted nodes retain their original positions.

To specify your custom animated layout algorithm implementation follow the example below.

{{< code lang="typescript">}}
const element = document.getElementById("canvas");

const canvas = new CanvasBuilder(element)
  .enableAnimatedLayout({
    algorithm: {
      type: 'custom',
      instance: new MyCustomAnimatedLayoutAlgorithm(),
    },
  })
  .build();
{{< /code >}}
