---
title: Core configuration | Nodes
---

## Nodes configuration

{{< code lang="javascript">}}
const canvas = new HtmlGraphBuilder()
  .setOptions({
    nodes: {
      centerFn: (w, h) => ({ x: w / 2, y: h / 2}),
      priority: 10,
    },
  }).build();
{{</code>}}

| Name     | Type                                                         | Description                       | Required | Default                           |
|----------|--------------------------------------------------------------|-----------------------------------|----------|-----------------------------------|
| centerFn | function                                                     | node center default configuration | no       | (w, h) => ({ x: w / 2, y: h / 2}) |
| priority | number \| "incremental" \| "shared-incremental" \| function  | priority configuration            | no       | 0                                 |
