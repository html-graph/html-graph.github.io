---
title: Canvas | Remove Node
---

## Remove Node

Removes a specified node from the canvas. All associated ports will be unmarked, and any edges connected to the node will also be removed.

{{< code lang="javascript">}}
canvas.removeNode("node-1")
{{< /code >}}

### Parameters for `removeNode`:

| Name | Type | Description                      | Required |
|------|------|----------------------------------|----------|
| id   | any  | Identifier of the node to remove | yes      |
