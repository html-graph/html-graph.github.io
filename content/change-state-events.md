---
title: Change State Events
---

## Change State Events

HTMLGraph offers a basic event system to handle changes in the canvas state.
Events can be subscribed to via the `subscribe` method provided by the `EventHandler` instance.
Once the listener is no longer necessary, simply call `unsubscribe` with the same callback to remove it.

---

### Graph Node Events [#](#graph-node-events) ### {#graph-node-events}

{{< code lang="javascript" >}}
canvas.graph.onAfterNodeAdded.subscribe((nodeId) => {
  console.log('new node has just been added');
  console.log(canvas.graph.getNode(nodeId));
});
{{< / code >}}

{{< code lang="javascript" >}}
canvas.graph.onAfterNodeUpdated.subscribe((nodeId) => {
  console.log('node has just been updated');
  console.log(canvas.graph.getNode(nodeId));
});
{{< / code >}}

{{< code lang="javascript" >}}
canvas.graph.onAfterNodePriorityUpdated.subscribe((nodeId) => {
  console.log('node z-index has just been changed');
  console.log(canvas.graph.getNode(nodeId).priority);
});
{{< / code >}}

{{< code lang="javascript" >}}
canvas.graph.onBeforeNodeRemoved.subscribe((nodeId) => {
  console.log('node is about to be removed');
  console.log(canvas.graph.getNode(nodeId));
});
{{< / code >}}

**Note:** Nodes removed via `canvas.clear()` are managed separately within the `canvas.graph.onBeforeClear` handler.

---

### Graph Port Events [#](#graph-port-events) ### {#graph-port-events}

{{< code lang="javascript" >}}
canvas.graph.onAfterPortMarked.subscribe((portId) => {
  console.log('new port has just been marked');
  console.log(canvas.graph.getPort(portId));
});
{{< / code >}}

{{< code lang="javascript" >}}
canvas.graph.onAfterPortUpdated.subscribe((portId) => {
  console.log('port has just been updated');
  console.log(canvas.graph.getPort(portId));
});
{{< / code >}}

{{< code lang="javascript" >}}
canvas.graph.onBeforePortUnmarked.subscribe((portId) => {
  console.log('port is about to be unmarked');
  console.log(canvas.graph.getPort(portId));
});
{{< / code >}}

**Note:** Ports removed via `canvas.clear()` are managed separately within the `canvas.graph.onBeforeClear` handler.

---

### Graph Edge Events [#](#graph-edge-events) ### {#graph-edge-events}

{{< code lang="javascript" >}}
canvas.graph.onAfterEdgeAdded.subscribe((edgeId) => {
  console.log('new edge has just been added');
  console.log(canvas.graph.getEdge(edgeId));
});
{{< / code >}}

{{< code lang="javascript" >}}
canvas.graph.onAfterEdgeUpdated.subscribe((edgeId) => {
  console.log('edge has just been updated');
  console.log(canvas.graph.getEdge(edgeId));
});
{{< / code >}}

{{< code lang="javascript" >}}
canvas.graph.onAfterEdgePriorityUpdated.subscribe((edgeId) => {
  console.log('edge z-index has just been changed');
  console.log(canvas.graph.getEdge(edgeId).priority);
});
{{< / code >}}

{{< code lang="javascript" >}}
canvas.graph.onBeforeEdgeRemoved.subscribe((edgeId) => {
  console.log('edge is about to be removed');
  console.log(canvas.graph.getEdge(edgeId));
});
{{< / code >}}

**Note:** Edges removed via `canvas.clear()` are managed separately within the `canvas.graph.onBeforeClear` handler.

---

### Other Graph Events [#](#other-graph-events) ### {#other-graph-events}

{{< code lang="javascript" >}}
canvas.graph.onBeforeClear.subscribe(() => {
  console.log('all nodes, ports, and edges are about to be removed');
});
{{< / code >}}

---

### Viewport Events [#](#viewport-events) ### {#viewport-events}

{{< code lang="javascript" >}}
canvas.viewport.onAfterUpdated.subscribe(() => {
  console.log('viewport state has just been updated');
  console.log(canvas.viewport.getViewportMatrix());
});
{{< / code >}}

---

### Canvas Events [#](#canvas-events) ### {#canvas-events}

{{< code lang="javascript" >}}
canvas.onBeforeDestroy.subscribe(() => {
  console.log('canvas is about to be destroyed');
});
{{< / code >}}
