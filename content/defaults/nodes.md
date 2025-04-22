---
title: Core Configuration | Nodes
---

## Nodes Configuration

{{< code lang="javascript">}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder()
  .setDefaults({
    nodes: {
      centerFn: (w, h) => ({ x: w / 2, y: h / 2 }),
      priority: "incremental",
    },
  })
  .setElement(element)
  .build();
{{< /code >}}

### `NodesConfig` Fields

| Name     | Type                                       | Description                                     | Required | Default                           |
|----------|--------------------------------------------|-------------------------------------------------|----------|-----------------------------------|
| centerFn | function                                   | Default function to determine the node’s center | no       | (w, h) => ({ x: w / 2, y: h / 2 }) |
| priority | <span data-ref="priority">Priority</span>  | Default node priority                           | no       | 0                                 |

{{< ref-target ref="priority">}}
### `Priority` Options

| Type                   | Description                                          | Example           |
|------------------------|------------------------------------------------------|-------------------|
| `number`               | Each node is assigned a constant Z-index             | `5`               |
| `"incremental"`        | Each subsequent node receives an incremented Z-index | `"incremental"`   |
| `function`             | Z-index is determined by a specified function        | `() => 10 + i++;` |
{{< /ref-target >}}
