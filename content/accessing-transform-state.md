---
title: Accessing viewport transform state
---

## Accessing viewport transform state

Read-only viewport transform state can be accessed via `transformation` property of `canvas`.

{{< code lang="javascript" >}}
const canvas = new CanvasBuilder().build();

console.log(canvas.transformation);
{{< / code >}}

`transformation` object has two methods:

1. To get [viewport matrix](/canvas/patch-viewport-matrix) state call
{{< code lang="javascript" >}}
  const node = canvas.transformation.getViewportMatrix();
{{< / code >}}
This method `null` when node is nonexistent.

2. To get [content matrix](/canvas/patch-content-matrix) state call
{{< code lang="javascript" >}}
  const node = canvas.transformation.getContentMatrix();
{{< / code >}}
