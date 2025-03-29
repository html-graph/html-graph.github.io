---
title: Defaults Configuration
---

## Defaults Configuration

Configure the base visualization settings using the `setDefaults` method of `CanvasBuilder`:

{{< code lang="javascript">}}
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
  .build();
{{< /code >}}

### Configuration Parameters

| Section | Type                 | Description             | Required |
|---------|----------------------|-------------------------|----------|
| `nodes` | [NodesConfig](nodes) | Configuration for nodes | No       |
| `ports` | [PortsConfig](ports) | Configuration for ports | No       |
| `edges` | [EdgesConfig](edges) | Configuration for edges | No       |
