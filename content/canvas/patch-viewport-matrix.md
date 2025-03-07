---
title: Canvas | Patch Viewport Matrix
---

## Patch Viewport Matrix

The viewport transformation matrix consists of three values: `scale`, `x`, and `y`.

- **Scale**: Represents the current scaling factor of the viewport. A larger scale zooms out, making the content appear smaller, while a smaller scale zooms in, making the content appear larger.
- **X**: The horizontal distance from the absolute zero point to the top-left corner of the viewport.
- **Y**: The vertical distance from the absolute zero point to the top-left corner of the viewport.

To better understand how these values work, experiment with the demo below.

{{< use-case title="Viewport Matrix. Hold CTRL to scale" src=/use-cases/viewport-matrix/ >}}

To update the viewport matrix values, use the `patchViewportMatrix` method. All parameters are optional.

{{< code lang="javascript">}}
canvas.patchViewportMatrix({
  scale: 0.5,
  x: -50,
  y: -50,
})
{{< /code >}}

This matrix is the inverse of the [content matrix](/canvas/patch-content-matrix).
