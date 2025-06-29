---
title: Defaults | Nodes
---

## Node Defaults

{{< code lang="javascript">}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .setDefaults({
    nodes: {
      centerFn: (w, h) => ({ x: w / 2, y: h / 2 }),
      priority: "incremental",
    },
  })
  .build();
{{< /code >}}

### `NodesConfig` Fields

| Name     | Type                       | Description                                     | Required | Default                           |
|----------|----------------------------|-------------------------------------------------|----------|-----------------------------------|
| centerFn | function                   | Default function to determine the node’s center | no       | (w, h) => ({ x: w / 2, y: h / 2 }) |
| priority | [Priority](#node-priority) | Default node priority                           | no       | 0                                 |

{{< ref-target ref="node-priority">}}
### `Priority` Options ### {#node-priority}

| Type                   | Description                                          | Example           |
|------------------------|------------------------------------------------------|-------------------|
| `number`               | Each node is assigned a constant Z-index             | `5`               |
| `"incremental"`        | Each subsequent node receives an incremented Z-index | `"incremental"`   |
| `function`             | Z-index is determined by a specified function        | `() => 10 + i++;` |
{{< /ref-target >}}
