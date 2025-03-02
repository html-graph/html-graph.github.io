---
title: Canvas | Update Edge
---

## Update Edge

Updates edge's specified properties.

{{< code lang="javascript">}}
canvas.updateEdge("edge-1" , {
  from: "port-3",
  to: "port-4",
})
{{< /code >}}

All available parameters are demonstrated in the following example:

{{< code lang="javascript">}}
canvas.updateEdge("node-1" , {
  from: "port-3",
  to: "port-4",
  shape: new HorizontalEdgeShape(),
  priority: 10,
})
{{< /code >}}

When called without request edge's coordinates will be updated.

{{< code lang="javascript">}}
canvas.updateEdge("edge-1")
{{< /code >}}

### `updateEdge` Parameters

| Name          | Type                                                          | Description                  | Required | Default |
|---------------|---------------------------------------------------------------|------------------------------|----------|---------|
| id            | any                                                           | Identifier of edge to update | yes      |         |
| updateRequest | <span data-ref="edge-update-request">EdgeUpdateRequest</span> | Parameters to update         | no       | {}      |

{{< ref-target ref="edge-update-request">}}
`EdgeUpdateRequest`

| Name     | Type                     |  Description              | Required |
|----------|--------------------------|---------------------------|----------|
| from     | any                      | identifier of source port | no       |
| to       | any                      | identifier of target port | no       |
| shape    | [EdgeShape](/edge-shape) | edge shape                | no       |
| priority | number                   | z-index of edge           | no       |
{{< /ref-target >}}
