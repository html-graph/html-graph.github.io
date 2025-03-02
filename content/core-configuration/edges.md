---
title: Core configuration | Edges
---

## Edges configuration


{{< code lang="javascript">}}
const canvas = new HtmlGraphBuilder()
  .setOptions({
    edges: {
      shape: {
        type: "bezier",
        color: "#000",
        width: 2,
        curvature: 100,
        arrowLength: 15,
        arrowWidth: 5,
        hasSourceArrow: true,
        hasTargetArrow: true,
        cycleRadius: 100,
        smallCycleRadius: 30,
        detourDistance: 100,
        detourDirection: -(Math.PI / 2),
      },
      priority: 5,
    },
  }).build();
{{</code>}}

`EdgesConfig` fields:

| Name      | Type                                                        | Description                      | Required | Default |
|-----------|-------------------------------------------------------------|----------------------------------|----------|---------|
| shape     | ShapeConfig                                                 | default edge shape configuration | no       | {}      |
| priority  | number \| "incremental" \| "shared-incremental" \| function | default edge priority            | no       | 0       |



`ShapeConfig` options:

| Name       | Visualization | Parameters |
|------------|---------------|------------|
| Bezier     |               |            |
| Straight   |               |            |
| Horizontal |               |            |
| Vertical   |               |            |
| Custom     |               |            |

