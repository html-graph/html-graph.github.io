---
title: Accessing Graph Structure
---

## Accessing Graph Structure

The read-only graph structure can be accessed via the `graph` property of the `canvas`.

{{< code lang="javascript" >}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .build();

canvas.graph.getAllNodeIds().forEach(nodeId => {
  console.log(canvas.graph.getNode(nodeId));
});
{{< / code >}}

The `graph` object provides all the necessary methods to retrieve the structure of the current graph.

### Nodes

1. get the state of a node
{{< code lang="javascript" >}}
const node = canvas.graph.getNode("node-1");
{{< / code >}}
This method returns `null` if the node does not exist.

1. get the IDs of all nodes
{{< code lang="javascript" >}}
const nodeIds = canvas.graph.getAllNodeIds();
{{< / code >}}

1. get the IDs of all ports for a specific node
{{< code lang="javascript" >}}
const portIds = canvas.graph.getNodePortIds("node-1");
{{< / code >}}
This method returns `null` if the node does not exist.

1. get the IDs of incoming edges for a specific node
{{< code lang="javascript" >}}
const edgeIds = canvas.graph.getNodeIncomingEdgeIds("node-1");
{{< / code >}}
This method returns `null` if the node does not exist.

1. get the IDs of outcoming edges for a specific node
{{< code lang="javascript" >}}
const edgeIds = canvas.graph.getNodeOutcomingEdgeIds("node-1");
{{< / code >}}
This method returns `null` if the node does not exist.

1. get the IDs of cycle edges for a specific node
{{< code lang="javascript" >}}
const edgeIds = canvas.graph.getNodeCycleEdgeIds("node-1");
{{< / code >}}
This method returns `null` if the node does not exist.
Note: A cycle edge is one where the source port and target port are the same. Therefore, edges with the same source and target node are not necessarily cycle edges.

1. get the IDs of adjacent edges for a specific node
{{< code lang="javascript" >}}
const edgeIds = canvas.graph.getNodeAdjacentEdgeIds("node-1");
{{< / code >}}
This method returns `null` if the node does not exist.

1. get node ID for a specific HTMLElement, call
{{< code lang="javascript" >}}
const nodeId = canvas.graph.getElementNodeId(nodeElement);
{{< / code >}}
This method returns `null` if specified element is not a node.

---

### Ports

1. get the state of a port
{{< code lang="javascript" >}}
const port = canvas.graph.getPort("port-1");
{{< / code >}}
This method returns `null` if the port does not exist.

1. get the IDs of all ports
{{< code lang="javascript" >}}
const portIds = canvas.graph.getAllPortIds();
{{< / code >}}

1. get the IDs of incoming edges for a specific port
{{< code lang="javascript" >}}
const edgeIds = canvas.graph.getPortIncomingEdgeIds("port-1");
{{< / code >}}
This method returns `null` if the port does not exist.

1. get the IDs of outcoming edges for a specific port
{{< code lang="javascript" >}}
const edgeIds = canvas.graph.getPortOutcomingEdgeIds("port-1");
{{< / code >}}
This method returns `null` if the port does not exist.

1. get the IDs of cycle edges for a specific port
{{< code lang="javascript" >}}
const edgeIds = canvas.graph.getPortCycleEdgeIds("port-1");
{{< / code >}}
This method returns `null` if the port does not exist.

1. get the IDs of adjacent edges for a specific port
{{< code lang="javascript" >}}
const edgeIds = canvas.graph.getPortAdjacentEdgeIds("port-1");
{{< / code >}}
This method returns `null` if the port does not exist.

1. get all port IDs attached to a specific HTMLElement, call
{{< code lang="javascript" >}}
const portIds = canvas.graph.getElementPortIds(portElement);
{{< / code >}}

---

### Edges

1. get the IDs of all edges
{{< code lang="javascript" >}}
const edgeIds = canvas.graph.getAllEdgeIds();
{{< / code >}}

1. get the state of an edge
{{< code lang="javascript" >}}
const edge = canvas.graph.getEdge("edge-1");
{{< / code >}}
This method returns `null` if the edge does not exist.
