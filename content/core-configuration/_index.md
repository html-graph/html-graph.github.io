---
title: Core Configuration
---

## Core Configuration

The core configuration defines the foundational aspects of graph visualization. It can be customized using the `setOptions` method of the `CanvasBuilder`.

{{< code lang="javascript">}}
const canvas = new CanvasBuilder()
  .setOptions({
    nodes: {
      centerFn: (w, h) => ({ x: w / 2, y: h / 2 }),
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
{{< /code >}}

### Parameters for `setOptions`:

| Name  | Type                                      | Description                 | Required |
|-------|-------------------------------------------|-----------------------------|----------|
| nodes | [NodesConfig](nodes)                      | Configuration for nodes     | no       |
| ports | [PortsConfig](ports)                      | Configuration for ports     | no       |
| edges | [EdgesConfig](edges)                      | Configuration for edges     | no       |
