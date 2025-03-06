---
title: Canvas | Patch viewport matrix
---

## Patch viewport matrix

Viewport transformation matrix is a matrix of three values: `scale`, `x` and `y`.

Scale - actual scale of current viewport. The bigger the scale ofviewport, the smaller the
content, and vice versa.

X - actual horizontal distance from absolute zero to viewport top left corner.

Y - actual vertical distance from absolute zero to viewport top left corner.

To get an idea about what viewport matrix values are play around with this demo.

{{< use-case title="Viewport matrix. Hold CTRL to scale" src=/use-cases/viewport-matrix/ >}}

To patch viewport matrix values use method `patchViewportMatrix`. All parameters
are optional.

{{< code lang="javascript">}}
canvas.patchViewportMatrix({
  scale: 0.5,
  x: -50,
  y: -50,
})
{{< /code >}}

This matrix is reverse of [content matrix](/canvas/patch-content-matrix).
