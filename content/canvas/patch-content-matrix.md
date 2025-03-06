---
title: Canvas | Patch viewport matrix
---

## Patch content matrix

Content transformation matrix is a matrix of three values: `scale`, `x` and `y`.

Scale - actual scale of current content. The bigger the scale of content, the smaller the
viewport, and vice versa.

X - actual horizontal distance in viewport from top left corner to absolute zero.

Y - actual vertical distance in viewport from top left corner to absolute zero.

To get an idea about what content matrix values are play around with this demo.

{{< use-case title="Content matrix. Hold CTRL to scale" src=/use-cases/content-matrix/ >}}

To patch content matrix values use method `patchContentMatrix`. All parameters
are optional.

{{< code lang="javascript">}}
canvas.patchContentMatrix({
  scale: 2,
  x: 100,
  y: 100,
})
{{< /code >}}

This matrix is reverse of [viewport matrix](/canvas/patch-viewport-matrix).
