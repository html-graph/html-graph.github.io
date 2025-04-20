---
title: Defaults Configuration
---

## Defaults Configuration

Use the `setDefaults` method of `CanvasBuilder` to establish base visualization settings.
These defaults apply to all graph entities (nodes, ports, and edges) when no explicit values are provided.

{{< code lang="javascript">}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder()
  .setDefaults({
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
  })
  .attach(element)
  .build();
{{< /code >}}

### Configuration Parameters

| Section | Type                 | Description             | Required |
|---------|----------------------|-------------------------|----------|
| `nodes` | [NodesConfig](nodes) | Configuration for nodes | No       |
| `ports` | [PortsConfig](ports) | Configuration for ports | No       |
| `edges` | [EdgesConfig](edges) | Configuration for edges | No       |
