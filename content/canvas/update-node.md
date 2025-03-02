---
title: Canvas | Update Node
---

## Update Node

Updates node's specified properties.

{{< code lang="javascript">}}
canvas.updateNode("node-1" , {
  x: 100,
  y: 100,
})
{{< /code >}}

All available parameters are demonstrated in the following example:

{{< code lang="javascript">}}
canvas.updateNode("node-1" , {
  x: 100,
  y: 100,
  priority: 10,
  centerFn: () => ({ x: 0, y: 0 }),
})
{{< /code >}}

When called without request all adjacent to node edges' coordinates will be updated.

{{< code lang="javascript">}}
canvas.updateNode("node-1")
{{< /code >}}

### `updateNode` Parameters

| Name          | Type                                                          | Description                  | Required | Default |
|---------------|---------------------------------------------------------------|------------------------------|----------|---------|
| id            | any                                                           | Identifier of node to update | yes      |         |
| updateRequest | <span data-ref="node-update-request">NodeUpdateRequest</span> | Parameters to update         | no       | {}      |

{{< ref-target ref="node-update-request">}}
`NodeUpdateRequest`

| Name          | Type              | Description                             | Required |
|---------------|-------------------|-----------------------------------------|----------|
| x             | number            | x coordinate of node                    | no       |
| y             | number            | y coordinate of node                    | no       |
| priority      | number            | z-index of node element                 | no       |
| centerFn      | function          | Function to determine the node's center | no       |
{{< /ref-target >}}
