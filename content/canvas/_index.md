---
title: Canvas
---

## Canvas

The `Canvas` API provides a set of methods and properties for managing graph visualization.

`Canvas` uses a fluent interface, allowing methods to be chained for concise configuration. For example:

{{< code lang="javascript" >}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element).build();

canvas
  .addNode({ x: 100, y: 100, element: document.createElement('div') })
  .addNode({ x: 200, y: 200, element: document.createElement('div') })
  .addNode({ x: 300, y: 300, element: document.createElement('div') })
  .patchViewportMatrix({ x: -100, y: -100 });
{{< /code >}}

Below is an overview of its functionality:

### [addNode](add-node)
Create and add a node to the canvas.

### [updateNode](update-node)
Update the properties of an existing node.

### [removeNode](remove-node)
Remove a node from the canvas.

### [markPort](mark-port)
Mark an element as a port.

### [updatePort](update-port)
Update the configuration of a port.

### [unmarkPort](unmark-port)
Unmark an element as a port.

### [addEdge](add-edge)
Create and add an edge between ports on the canvas.

### [updateEdge](update-edge)
Update the properties of an existing edge.

### [removeEdge](remove-edge)
Remove an edge from the canvas.

### [patchViewportMatrix](patch-viewport-matrix)
Modify the viewport transformation matrix.

### [patchContentMatrix](patch-content-matrix)
Modify the content transformation matrix.

### [clear](clear)
Remove all nodes and edges from the canvas.

### [destroy](destroy)
Revert the canvas element to its initial state and free up memory.
