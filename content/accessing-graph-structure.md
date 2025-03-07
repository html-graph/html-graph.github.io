---
title: Accessing Graph Structure
---

## Accessing Graph Structure

The read-only graph structure can be accessed via the `model` property of the `canvas`.

{{< code lang="javascript" >}}
const canvas = new CanvasBuilder().build();

canvas.model.getAllNodeIds().forEach(nodeId => {
  console.log(canvas.model.getNode(nodeId));
});
{{< / code >}}

The `model` object provides all the necessary methods to retrieve the structure of the current graph.

1. To get the state of a node, call:
{{< code lang="javascript" >}}
  const node = canvas.model.getNode("node-1");
{{< / code >}}
This method returns `null` if the node does not exist.

2. To get the IDs of all nodes, call:
{{< code lang="javascript" >}}
   const nodeIds = canvas.model.getAllNodeIds();
{{< / code >}}

3. To get the state of a port, call:
{{< code lang="javascript" >}}
  const port = canvas.model.getPort("port-1");
{{< / code >}}
This method returns `null` if the port does not exist.

4. To get the IDs of all ports, call:
{{< code lang="javascript" >}}
  const portIds = canvas.model.getAllPortIds();
{{< / code >}}

5. To get the IDs of all ports for a specific node, call:
{{< code lang="javascript" >}}
  const portIds = canvas.model.getNodePortIds("node-1");
{{< / code >}}
This method returns `null` if the node does not exist.

6. To get the node ID of a specific port, call:
{{< code lang="javascript" >}}
  const nodeId = canvas.model.getPortNodeId("port-1");
{{< / code >}}

7. To get the IDs of all edges, call:
{{< code lang="javascript" >}}
  const edgeIds = canvas.model.getAllEdgeIds();
{{< / code >}}

8. To get the state of an edge, call:
{{< code lang="javascript" >}}
  const edge = canvas.model.getEdge("edge-1");
{{< / code >}}
This method returns `null` if the edge does not exist.

9. To get the IDs of incoming edges for a specific port, call:
{{< code lang="javascript" >}}
   const edgeIds = canvas.model.getPortIncomingEdgeIds("port-1");
{{< / code >}}
This method returns `null` if the port does not exist.

10. To get the IDs of outgoing edges for a specific port, call:
{{< code lang="javascript" >}}
   const edgeIds = canvas.model.getPortOutcomingEdgeIds("port-1");
{{< / code >}}
This method returns `null` if the port does not exist.

11. To get the IDs of cycle edges for a specific port, call:
{{< code lang="javascript" >}}
   const edgeIds = canvas.model.getPortCycleEdgeIds("port-1");
{{< / code >}}
This method returns `null` if the port does not exist.

12. To get the IDs of adjacent edges for a specific port, call:
{{< code lang="javascript" >}}
   const edgeIds = canvas.model.getPortAdjacentEdgeIds("port-1");
{{< / code >}}
This method returns `null` if the port does not exist.

13. To get the IDs of incoming edges for a specific node, call:
{{< code lang="javascript" >}}
  const edgeIds = canvas.model.getNodeIncomingEdgeIds("node-1");
{{< / code >}}
This method returns `null` if the node does not exist.

14. To get the IDs of outgoing edges for a specific node, call:
{{< code lang="javascript" >}}
  const edgeIds = canvas.model.getNodeOutcomingEdgeIds("node-1");
{{< / code >}}
This method returns `null` if the node does not exist.

15. To get the IDs of cycle edges for a specific node, call:
{{< code lang="javascript" >}}
  const edgeIds = canvas.model.getNodeCycleEdgeIds("node-1");
{{< / code >}}
This method returns `null` if the node does not exist.
Note: A cycle edge is one where the source port and target port are the same. Therefore, edges with the same source and target node are not necessarily cycle edges.

16. To get the IDs of adjacent edges for a specific node, call:
{{< code lang="javascript" >}}
  const edgeIds = canvas.model.getNodeAdjacentEdgeIds("node-1");
{{< / code >}}
This method returns `null` if the node does not exist.
