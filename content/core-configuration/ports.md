---
title: Core configuration | Ports
---

## Ports configuration


{{< code lang="javascript">}}
const canvas = new CanvasBuilder()
  .setOptions({
    ports: {
      direction: -Math.PI,
    },
  }).build();
{{</code>}}

`PortsConfig` fields:

| Name      | Type   | Description             | Required | Default |
|-----------|--------|-------------------------|----------|---------|
| direction | number | default ports direction | no       | 0       |
