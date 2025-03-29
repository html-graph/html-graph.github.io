---
title: Core Configuration | Ports
---

## Ports Configuration

{{< code lang="javascript">}}
const canvas = new CanvasBuilder()
  .setDefaults({
    ports: {
      direction: -Math.PI,
    },
  }).build();
{{< /code >}}

### `PortsConfig` Fields

| Name      | Type   | Description             | Required | Default |
|-----------|--------|-------------------------|----------|---------|
| direction | number | Default port direction  | no       | 0       |
