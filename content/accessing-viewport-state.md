---
title: Accessing Viewport Transform State
---

## Accessing Viewport State

The read-only viewport transform state can be accessed via the `viewport` property of the `canvas`.

{{< code lang="javascript" >}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .build();

console.log(canvas.viewport);
{{< / code >}}

The `viewport` object provides two methods:

1. To get the state of the [viewport matrix](/canvas/#patch-viewport-matrix), call:
{{< code lang="javascript" >}}
  const viewportMatrix = canvas.viewport.getViewportMatrix();
{{< / code >}}

2. To get the state of the [content matrix](/canvas/#patch-content-matrix), call:
{{< code lang="javascript" >}}
  const contentMatrix = canvas.viewport.getContentMatrix();
{{< / code >}}
