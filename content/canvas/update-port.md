---
title: Canvas | Update Port
---

## Update Port

Updates specified properties of a port.

{{< code lang="javascript">}}
canvas.updatePort("port-1", {
  direction: -Math.PI,
});
{{< /code >}}

When called without parameters, the coordinates of all edges connected to the port will be updated.

{{< code lang="javascript">}}
canvas.updatePort("port-1")
{{< /code >}}

### Parameters for `updatePort`:

| Name          | Type                                      | Description                      | Required | Default |
|---------------|-------------------------------------------|----------------------------------|----------|---------|
| id            | any                                       | Identifier of the port to update | yes      |         |
| updateRequest | [PortUpdateRequest](#port-update-request) | Properties to update             | no       | {}      |

{{< ref-target ref="port-update-request">}}
### `PortUpdateRequest` Parameters ### {#port-update-request}

| Name      | Type   | Description                     | Required |
|-----------|--------|---------------------------------|----------|
| direction | number | Radian angle for edge direction | no       |
{{< /ref-target >}}
