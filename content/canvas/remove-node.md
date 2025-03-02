---
title: Canvas | Remove Node
---

## Remove Node

Removes specified node. All the ports of the node get unmarked. All the edges
adjacent to node get removed.

{{< code lang="javascript">}}
canvas.removeNode("node-1")
{{< /code >}}

### `removeNode` Parameters

| Name          | Type                                                          | Description                  | Required |
|---------------|---------------------------------------------------------------|------------------------------|----------|
| id            | any                                                           | Identifier of node to remove | yes      |
