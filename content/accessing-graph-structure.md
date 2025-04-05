---
title: Accessing Graph Structure
---

## Accessing Graph Structure

The read-only graph structure can be accessed via the `graph` property of the `canvas`.

{{< code lang="javascript" >}}
const canvas = new CanvasBuilder().build();

canvas.graph.getAllNodeIds().forEach(nodeId => {
  console.log(canvas.graph.getNode(nodeId));
});
{{< / code >}}

The `graph` object provides all the necessary methods to retrieve the structure of the current graph.

1. To get the state of a node, call:
{{< code lang="javascript" >}}
  const node = canvas.graph.getNode("node-1");
{{< / code >}}
This method returns `null` if the node does not exist.

2. To get the IDs of all nodes, call:
{{< code lang="javascript" >}}
   const nodeIds = canvas.graph.getAllNodeIds();
{{< / code >}}

3. To get the state of a port, call:
{{< code lang="javascript" >}}
  const port = canvas.graph.getPort("port-1");
{{< / code >}}
This method returns `null` if the port does not exist.

4. To get the IDs of all ports, call:
{{< code lang="javascript" >}}
  const portIds = canvas.graph.getAllPortIds();
{{< / code >}}

5. To get the IDs of all ports for a specific node, call:
{{< code lang="javascript" >}}
  const portIds = canvas.graph.getNodePortIds("node-1");
{{< / code >}}
This method returns `null` if the node does not exist.

6. To get the IDs of all edges, call:
{{< code lang="javascript" >}}
  const edgeIds = canvas.graph.getAllEdgeIds();
{{< / code >}}

7. To get the state of an edge, call:
{{< code lang="javascript" >}}
  const edge = canvas.graph.getEdge("edge-1");
{{< / code >}}
This method returns `null` if the edge does not exist.

8. To get the IDs of incoming edges for a specific port, call:
{{< code lang="javascript" >}}
   const edgeIds = canvas.graph.getPortIncomingEdgeIds("port-1");
{{< / code >}}
This method returns `null` if the port does not exist.

9. To get the IDs of outgoing edges for a specific port, call:
{{< code lang="javascript" >}}
   const edgeIds = canvas.graph.getPortOutcomingEdgeIds("port-1");
{{< / code >}}
This method returns `null` if the port does not exist.

10. To get the IDs of cycle edges for a specific port, call:
{{< code lang="javascript" >}}
   const edgeIds = canvas.graph.getPortCycleEdgeIds("port-1");
{{< / code >}}
This method returns `null` if the port does not exist.

11. To get the IDs of adjacent edges for a specific port, call:
{{< code lang="javascript" >}}
   const edgeIds = canvas.graph.getPortAdjacentEdgeIds("port-1");
{{< / code >}}
This method returns `null` if the port does not exist.

12. To get the IDs of incoming edges for a specific node, call:
{{< code lang="javascript" >}}
  const edgeIds = canvas.graph.getNodeIncomingEdgeIds("node-1");
{{< / code >}}
This method returns `null` if the node does not exist.

13. To get the IDs of outgoing edges for a specific node, call:
{{< code lang="javascript" >}}
  const edgeIds = canvas.graph.getNodeOutcomingEdgeIds("node-1");
{{< / code >}}
This method returns `null` if the node does not exist.

14. To get the IDs of cycle edges for a specific node, call:
{{< code lang="javascript" >}}
  const edgeIds = canvas.graph.getNodeCycleEdgeIds("node-1");
{{< / code >}}
This method returns `null` if the node does not exist.
Note: A cycle edge is one where the source port and target port are the same. Therefore, edges with the same source and target node are not necessarily cycle edges.

15. To get the IDs of adjacent edges for a specific node, call:
{{< code lang="javascript" >}}
  const edgeIds = canvas.graph.getNodeAdjacentEdgeIds("node-1");
{{< / code >}}
This method returns `null` if the node does not exist.
