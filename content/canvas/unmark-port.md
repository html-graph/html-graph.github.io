---
title: Canvas | Unmark Port
---

## Unmark Port

Unmarks a specified port, removing it from the node. All edges connected to the port will also be removed.

{{< code lang="javascript">}}
canvas.unmarkPort("port-1")
{{< /code >}}

### Parameters for `unmarkPort`:

| Name | Type | Description                      | Required |
|------|------|----------------------------------|----------|
| id   | any  | Identifier of the port to unmark | yes      |
