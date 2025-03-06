---
title: Accessing graph structure
---

## Accessing graph structure

Read-only graph structure can be accessed via `model` property of `canvas`.

{{< code lang="javascript" >}}
const canvas = new CanvasBuilder().build();

canvas.model.getAllNodeIds().forEach(nodeId => {
  console.log(canvas.model.getNode(nodeId));
});
{{< / code >}}

`model` object has all the necessary methods to get structure of current graph.

1. To get node state call
{{< code lang="javascript" >}}
  const node = canvas.model.getNode("node-1");
{{< / code >}}
This method `null` when node is nonexistent.

2. To get IDs of all nodes call
{{< code lang="javascript" >}}
   const nodeIds = canvas.model.getAllNodeIds();
{{< / code >}}

3. To get port state call
{{< code lang="javascript" >}}
  const port = canvas.model.getPort("port-1");
{{< / code >}}
This method returns `null` when port is nonexistent.

4. To get IDs of all ports call
{{< code lang="javascript" >}}
  const portIds = canvas.model.getAllPortIds();
{{< / code >}}

5. To get IDs of all ports for particular node call
{{< code lang="javascript" >}}
  const portIds = canvas.model.getNodePortIds("node-1");
{{< / code >}}
This method returns `null` when node is nonexistent.

6. To get node ID of particular port call
{{< code lang="javascript" >}}
  const nodeId = canvas.model.getPortNodeId("port-1");
{{< / code >}}

7. To get DIs of all edges call
{{< code lang="javascript" >}}
  const edgeIds = canvas.model.getAllEdgeIds();
{{< / code >}}

8. To get edge state call
{{< code lang="javascript" >}}
  const edge = canvas.model.getEdge("edge-1");
{{< / code >}}
This method returns `null` when edge is nonexistent.

9. To get IDs of incoming edges for particular port call
{{< code lang="javascript" >}}
   const edgeIds = canvas.model.getPortIncomingEdgeIds("port-1");
{{< / code >}}
This method returns `null` when port is nonexistent.

10. To get IDs of outcoming edges for particular port call
{{< code lang="javascript" >}}
   const edgeIds = canvas.model.getPortOutcomingEdgeIds("port-1");
{{< / code >}}
This method returns `null` when port is nonexistent.

11. To get IDs of cycle edges for particular port call
{{< code lang="javascript" >}}
   const edgeIds = canvas.model.getPortCycleEdgeIds("port-1");
{{< / code >}}
This method returns `null` when port is nonexistent.

12. To get IDs of adjacent edges for particular port call
{{< code lang="javascript" >}}
   const edgeIds = canvas.model.getPortAdjacentEdgeIds("port-1");
{{< / code >}}
This method returns `null` when port is nonexistent.

13. To get IDs of incoming edges for particular node call
{{< code lang="javascript" >}}
  const edgeIds = canvas.model.getNodeIncomingEdgeIds("node-1");
{{< / code >}}
This method returns `null` when node is nonexistent.

14. To get IDs of outcoming edges for particular node call
{{< code lang="javascript" >}}
  const edgeIds = canvas.model.getNodeOutcomingEdgeIds("node-1");
{{< / code >}}
This method returns `null` when node is nonexistent.

15. To get IDs of cycle edges for particular node call
{{< code lang="javascript" >}}
  const edgeIds = canvas.model.getNodeCycleEdgeIds("node-1");
{{< / code >}}
This method returns `null` when node is nonexistent.
Please note, that cycle edge is an edge, for which source port and target port
are the same. That's why edge which has source node same as target node are not
necessarily cycle edges.

16. To get IDs of adjacent edges for particular node call
{{< code lang="javascript" >}}
  const edgeIds = canvas.model.getNodeAdjacentEdgeIds("node-1");
{{< / code >}}
This method returns `null` when node is nonexistent.
