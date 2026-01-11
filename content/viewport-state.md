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

The `viewport` object provides two methods:

1. get the state of the <a href="/canvas/#patch-viewport-matrix" target="_blank">viewport matrix</a>
{{< code lang="javascript" >}}
const viewportMatrix = canvas.viewport.getViewportMatrix();
{{< / code >}}

2. get the state of the <a href="/canvas/#patch-content-matrix" target="_blank">content matrix</a>
{{< code lang="javascript" >}}
const contentMatrix = canvas.viewport.getContentMatrix();
{{< / code >}}
