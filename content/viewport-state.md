---
title: Viewport Transform State
---

## Viewport State

The read-only viewport transform state can be accessed via the `viewport` property of the `canvas`.

{{< code lang="javascript" >}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .build();

console.log(canvas.viewport);
{{< / code >}}

The `viewport` object provides the following methods:

1. Retrieve the state of the <a href="/canvas/#patch-viewport-matrix" target="_blank">viewport matrix</a>.
{{< code lang="javascript" >}}
const viewportMatrix = canvas.viewport.getViewportMatrix();
{{< / code >}}

1. Retrieve the state of the <a href="/canvas/#patch-content-matrix" target="_blank">content matrix</a>.
{{< code lang="javascript" >}}
const contentMatrix = canvas.viewport.getContentMatrix();
{{< / code >}}

3. Retrieve the current dimensions of the viewport:
{{< code lang="javascript" >}}
const { width, height } = canvas.viewport.getDimensions();
{{< / code >}}

4. Convert viewport coordinates to content coordinates:
{{< code lang="javascript" >}}
const { x, y } = canvas.viewport.createContentCoords({ x: 10, y: 20 });
{{< / code >}}

5. Convert content coordinates to viewport coordinates:
{{< code lang="javascript" >}}
const { x, y } = canvas.viewport.createViewportCoords({ x: 10, y: 20 });
{{< / code >}}
