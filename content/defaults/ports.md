---
title: Core Configuration | Ports
---

## Ports Configuration

{{< code lang="javascript">}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .setDefaults({
    ports: {
      direction: -Math.PI,
    },
  })
  .build();
{{< /code >}}

### `PortsConfig` Fields

| Name      | Type   | Description             | Required | Default |
|-----------|--------|-------------------------|----------|---------|
| direction | number | Default port direction  | no       | 0       |
