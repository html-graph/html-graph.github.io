---
title: Transformable canvas
---

## Transformable viewport


To enable built-in transformable viewport call `setUserTransformableViewport` method on `CanvasBuilder`.

{{< code lang="javascript">}}
const canvas = new CanvasBuilder()
  .setUserTransformableViewport()
  .build();
{{</code>}}


{{< use-case title="Transformable viewport. Hold CTRL to scale" src=/use-cases/transformable-viewport/ >}}

This method accepts optional configuration:

{{< code lang="javascript">}}
const canvas = new CanvasBuilder()
  .setUserTransformableViewport({ 
    scale: {
      mouseWheelSensitivity: 1.5,
      mouseWheelEventVerifier: (event: WheelEvent) => event.ctrlKey,
    };
    shift: {
      cursor: "crosshair",
      mouseDownEventVerifier: (event: MouseEvent) => event.ctrlKey,
      mouseUpEventVerifier: (event: MouseEvent) => true,
    };
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
      };
      onBeforeTransformChange: () => {
        console.log('BEFORE TRANSFORM');
      },
      onTransformChange: () => {
        console.log('AFTER TRANSFORM');
      },
    };
  })
  .build();
{{</code>}}
