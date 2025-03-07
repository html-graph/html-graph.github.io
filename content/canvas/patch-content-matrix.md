---
title: Canvas | Patch Viewport Matrix
---

## Patch Content Matrix

The content transformation matrix consists of three values: `scale`, `x`, and `y`.

- **Scale**: Represents the current scaling factor of the content. A larger scale makes the content appear bigger, while a smaller scale zooms out, making the content appear smaller.
- **X**: The horizontal distance from the top-left corner of the viewport to the absolute zero point.
- **Y**: The vertical distance from the top-left corner of the viewport to the absolute zero point.

To better understand how these values work, experiment with the demo below.

{{< use-case title="Content Matrix. Hold CTRL to scale" src=/use-cases/content-matrix/ >}}

To update the content matrix values, use the `patchContentMatrix` method. All parameters are optional.

{{< code lang="javascript">}}
canvas.patchContentMatrix({
  scale: 2,
  x: 100,
  y: 100,
})
{{< /code >}}

This matrix is the inverse of the [viewport matrix](/canvas/patch-viewport-matrix).
