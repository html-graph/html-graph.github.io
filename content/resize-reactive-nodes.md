---
title: Resize reactive nodes
---

## Resize reactive nodes


To enable built-in resize reactive nodes call `setResizeReactiveNodes` method on `CanvasBuilder`.

{{< code lang="javascript">}}
const canvas = new CanvasBuilder()
  .setResizeReactiveNodes()
  .build();
{{</code>}}


{{< use-case title="Resize reactive nodes" src=/use-cases/resize-reactive-nodes/ >}}
