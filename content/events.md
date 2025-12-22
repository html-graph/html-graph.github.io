---
title: Events
---

## Events

HTMLGraph provides a simple event model to respond to canvas state changes.
To subscribe to events, use the `subscribe` method of an `EventHandler` instance.
When the listener is no longer needed, unsubscribe by calling `unsubscribe` with the same callback.

### Node events

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

### Port events

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

### Edge events

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

### Viewport events

{{< code lang="javascript" >}}
canvas.viewport.onAfterUpdated.subscribe(() => {
  console.log('viewport state has just been updated');
  console.log(canvas.viewport.getViewportMatrix());
});
{{< / code >}}

### Other events

{{< code lang="javascript" >}}
canvas.onBeforeDestroy.subscribe(() => {
  console.log('canvas is about to be destroyed');
});
{{< / code >}}
