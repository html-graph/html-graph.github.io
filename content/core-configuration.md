---
title: Core configuration
---

## Core configuration

Core configuration are responsible for aspects of graph visualization itself. These
can be set by calling `setOptions` method of `HtmlGraphBuilder`

{{< code lang="javascript">}}
const canvas = new HtmlGraphBuilder()
  .setOptions({
    nodes: {
      centerFn: (w, h) => ({ x: w / 2, y: h / 2}),
      priority: 10,
    },
    ports: {
      direction: -Math.PI,
    },
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


`setOptions` parameters:

| Name  | Type                         |  Description                | Required | Default |
|-------|------------------------------|-----------------------------|----------|---------|
| nodes | [NodesConfig](#nodes-config) | nodes related configuration | no       | `{}`    |
| ports | [PortsConfig](#ports-config) | ports related configuration | no       | `{}`    |
| edges | [EdgesConfig](#edges-config) | edges related configuration | no       | `{}`    |

`NodesConfig` fields:

| Name     | Type                                                         | Description                       | Required | Default                           |
|----------|--------------------------------------------------------------|-----------------------------------|----------|-----------------------------------|
| centerFn | function                                                     | node center default configuration | no       | (w, h) => ({ x: w / 2, y: h / 2}) |
| priority | number \| "incremental" \| "shared-incremental" \| function  | priority configuration            | no       | 0                                 |

`PortsConfig` fields:

| Name      | Type   | Description             | Required | Default |
|-----------|--------|-------------------------|----------|---------|
| direction | number | default ports direction | no       | {}      |


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

