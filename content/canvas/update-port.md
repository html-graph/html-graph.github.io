---
title: Canvas | Update Port
---

## Update Port

Updates port's specified properties.

{{< code lang="javascript">}}
canvas.updatePort("port-1" , {
  direction: -Math.PI,
});
{{< /code >}}

When called without request all adjacent to port edges' coordinates will be updated.

{{< code lang="javascript">}}
canvas.updatePort("port-1")
{{< /code >}}

### `updatePort` Parameters

| Name          | Type                                                          | Description                  | Required | Default |
|---------------|---------------------------------------------------------------|------------------------------|----------|---------|
| id            | any                                                           | Identifier of port to update | yes      |         |
| updateRequest | <span data-ref="port-update-request">PortUpdateRequest</span> | Parameters to update         | no       | {}      |

{{< ref-target ref="port-update-request">}}
`PortUpdateRequest`

| Name          | Type              | Description                             | Required |
|---------------|-------------------|-----------------------------------------|----------|
| direction     | number            | Radian angle for edge direction         | no       |
{{< /ref-target >}}
