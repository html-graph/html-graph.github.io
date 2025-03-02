---
title: Core configuration
---

## Core configuration

Core configuration is responsible for aspects of graph visualization itself. It
can be set by calling `setOptions` method of `CanvasBuilder`

{{< code lang="javascript">}}
const canvas = new CanvasBuilder()
  .setOptions({
    nodes: {
      centerFn: (w, h) => ({ x: w / 2, y: h / 2}),
      priority: 10,
    },
    ports: {
      direction: -Math.PI / 2,
    },
    edges: {
      shape: {
        type: "vertical",
        hasTargetArrow: true,
      },
      priority: 5,
    },
  }).build();
{{</code>}}


`setOptions` parameter:

| Name  | Type                                      | Description                 | Required |
|-------|-------------------------------------------|-----------------------------|----------|
| nodes | [NodesConfig](nodes)                      | nodes related configuration | no       |
| ports | [PortsConfig](ports)                      | ports related configuration | no       |
| edges | [EdgesConfig](edges)                      | edges related configuration | no       |
