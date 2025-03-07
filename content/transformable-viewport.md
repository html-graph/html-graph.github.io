---
title: Transformable Viewport
---

## Transformable Viewport

To enable the built-in transformable viewport, call the `setUserTransformableViewport` method on `CanvasBuilder`.

{{< code lang="javascript">}}
const canvas = new CanvasBuilder()
  .setUserTransformableViewport()
  .build();
{{< /code >}}

{{< use-case title="Transformable Viewport. Hold CTRL to scale" src=/use-cases/transformable-viewport/ >}}

This method accepts optional configuration:

{{< code lang="javascript">}}
const canvas = new CanvasBuilder()
  .setUserTransformableViewport({
    scale: {
      mouseWheelSensitivity: 1.5,
      mouseWheelEventVerifier: (event) => event.ctrlKey,
    },
    shift: {
      cursor: "crosshair",
      mouseDownEventVerifier: (event) => event.ctrlKey,
      mouseUpEventVerifier: (event) => true,
    },
    transformPreprocessor: [
      {
        type: "scale-limit",
        minContentScale: 0.5,
        maxContentScale: 5,
      },
      {
        type: "shift-limit",
        minX: -1000,
        maxX: 1000,
        minY: -1000,
        maxY: 1000,
      },
    ],
    events: {
      onTransformStarted: () => {
        console.log('STARTED');
      },
      onTransformFinished: () => {
        console.log('FINISHED');
      },
      onBeforeTransformChange: () => {
        console.log('BEFORE TRANSFORM');
      },
      onTransformChange: () => {
        console.log('AFTER TRANSFORM');
      },
    },
  })
  .build();
{{< /code >}}

### Configuration Parameters

| Name                  | Type                                              | Description                                 | Required | Default |
|-----------------------|---------------------------------------------------|---------------------------------------------|----------|---------|
| scale                 | <span data-ref="scale">ScaleConfig</span>         | Scale-related behavior configuration        | no       | {}      |
| shift                 | <span data-ref="shift">ShiftConfig</span>         | Shift-related behavior configuration        | no       | {}      |
| transformPreprocessor | <span data-ref="transform">TransformConfig</span> | Transformation preprocessors configuration  | no       | {}      |
| events                | <span data-ref="events">EventsConfig</span>       | Handlers for available events               | no       | {}      |

{{< ref-target ref="scale">}}

### ScaleConfig

| Name                    | Type           | Description                                              | Required | Default    |
|-------------------------|----------------|----------------------------------------------------------|----------|------------|
| mouseWheelSensitivity   | number         | How much to scale on wheel scroll                        | no       | 1          |
| mouseWheelEventVerifier | function       | Function to verify if wheel event should apply scaling   | no       | () => true |

{{< /ref-target >}}

{{< ref-target ref="shift">}}

### ShiftConfig

| Name                   | Type           | Description                                              | Required | Default    |
|------------------------|----------------|----------------------------------------------------------|----------|------------|
| cursor                 | string \| null | Cursor to set on mouse grab                              | no       | "grab"     |
| mouseDownEventVerifier | function       | Function to verify if mouse event should trigger grab    | no       | () => true |
| mouseUpEventVerifier   | function       | Function to verify if mouse event should trigger release | no       | () => true |

{{< /ref-target >}}

{{< ref-target ref="transform">}}

### TransformConfig

A single transformer or an array of transformers.

Transformers can be one of the following:

1. **Scale Limit**: Prevents scaling when the maximum or minimum limit is reached.

{{< code lang="javascript" >}}
{
  type: "scale-limit",
  minContentScale: 0.5,
  maxContentScale: 5,
}
{{< /code >}}

All options are complementary.

2. **Shift Limit**: Prevents shifting when vertical or horizontal limits are reached.

{{< code lang="javascript" >}}
{
  type: "shift-limit",
  minX: -1000,
  maxX: 1000,
  minY: -1000,
  maxY: 1000,
}
{{< /code >}}

All options are complementary.

3. **Custom Preprocessor**: Allows you to define a custom transformation preprocessor.

{{< code lang="javascript" >}}
transformPreprocessor: (params) => {
  if (params.nextTransform.scale > 1) {
    return params.prevTransform;
  }

  return {
    scale: params.nextTransform.scale,
    x: Math.max(params.nextTransform.x, -500),
    y: params.nextTransform.y,
  };
},
{{< /code >}}

{{< /ref-target >}}
