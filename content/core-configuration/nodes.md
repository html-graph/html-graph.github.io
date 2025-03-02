---
title: Core configuration | Nodes
---

## Nodes configuration

{{< code lang="javascript">}}
const canvas = new CanvasBuilder()
  .setOptions({
    nodes: {
      centerFn: (w, h) => ({ x: w / 2, y: h / 2}),
      priority: "incremental",
    },
  }).build();
{{</code>}}

| Name     | Type                                       | Description                                     | Required | Default                           |
|----------|--------------------------------------------|-------------------------------------------------|----------|-----------------------------------|
| centerFn | function                                   | Default function to determine the node’s center | no       | (w, h) => ({ x: w / 2, y: h / 2}) |
| priority | <span data-ref="priority">Priority</span>  | default node priority                           | no       | 0                                 |


{{< ref-target ref="priority">}}
`Priority` can take one of the following values:

| Type                   | Description                                             | Example                   |
|------------------------|---------------------------------------------------------|---------------------------|
| `number`               | Each node gets assigned constant Z-index                | `5`                       |
| `"incremental"`        | Each next node gets incremented Z-index                 | `"incremental"`           |
| `"shared-incremental"` | Each next node or edge gets shared incremental Z-index  | `"shared-incremental"`    |
| `function`             | Z-index gets determined by calling specified function   | `() => 10 + i++;`         |
{{< /ref-target >}}
