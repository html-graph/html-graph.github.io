---
title: Canvas | Update Node
---

## Update Node

Updates specified properties of a node.

{{< code lang="javascript">}}
canvas.updateNode("node-1", {
  x: 100,
  y: 100,
})
{{< /code >}}

All available parameters are demonstrated in the following example:

{{< code lang="javascript">}}
canvas.updateNode("node-1", {
  x: 100,
  y: 100,
  priority: 10,
  centerFn: () => ({ x: 0, y: 0 }),
})
{{< /code >}}

When called without parameters, the coordinates of all edges connected to the node will be updated.

{{< code lang="javascript">}}
canvas.updateNode("node-1")
{{< /code >}}

### Parameters for `updateNode`:

| Name          | Type                                                          | Description                  | Required | Default |
|---------------|---------------------------------------------------------------|------------------------------|----------|---------|
| id            | any                                                           | Identifier of the node to update | yes      |         |
| updateRequest | <span data-ref="node-update-request">NodeUpdateRequest</span> | Properties to update         | no       | {}      |

{{< ref-target ref="node-update-request">}}
### `NodeUpdateRequest` Parameters

| Name     | Type     | Description                             | Required |
|----------|----------|-----------------------------------------|----------|
| x        | number   | X-coordinate of the node                | no       |
| y        | number   | Y-coordinate of the node                | no       |
| priority | number   | Z-index of the node                     | no       |
| centerFn | function | Function to determine the node's center | no       |
{{< /ref-target >}}
