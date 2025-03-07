---
title: Canvas | Update Edge
---

## Update Edge

Updates specified properties of an edge.

{{< code lang="javascript">}}
canvas.updateEdge("edge-1", {
  from: "port-3",
  to: "port-4",
})
{{< /code >}}

All available parameters are demonstrated in the following example:

{{< code lang="javascript">}}
canvas.updateEdge("edge-1", {
  from: "port-3",
  to: "port-4",
  shape: new HorizontalEdgeShape(),
  priority: 10,
})
{{< /code >}}

When called without parameters, the edge's coordinates will be recalculated.

{{< code lang="javascript">}}
canvas.updateEdge("edge-1")
{{< /code >}}

### Parameters for `updateEdge`:

| Name          | Type                                                          | Description                  | Required | Default |
|---------------|---------------------------------------------------------------|------------------------------|----------|---------|
| id            | any                                                           | Identifier of the edge to update | yes      |         |
| updateRequest | <span data-ref="edge-update-request">EdgeUpdateRequest</span> | Properties to update         | no       | {}      |

{{< ref-target ref="edge-update-request">}}
### `EdgeUpdateRequest` Parameters

| Name     | Type                     | Description              | Required |
|----------|--------------------------|--------------------------|----------|
| from     | any                      | Identifier of source port | no       |
| to       | any                      | Identifier of target port | no       |
| shape    | [EdgeShape](/edge-shape) | Edge shape               | no       |
| priority | number                   | Z-index of the edge      | no       |
{{< /ref-target >}}
