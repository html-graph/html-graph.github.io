---
title: Modules
sitemap:
  priority: 0.7
---

## Modules

HTMLGraph extends its functionality through optional modules, which can be enabled by calling their respective methods on a `CanvasBuilder` instance.

`CanvasBuilder` uses a fluent interface, allowing methods to be chained for concise configuration. For example:

{{< code lang="javascript" >}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .enableUserTransformableViewport() // Enables viewport shift and zoom
  .enableUserDraggableNodes() // Allows dragging nodes
  .enableBackground() // Renders a customizable background
  .build();
{{< /code >}}

Here is an overview of all available modules:

### [Transformable Viewport](/modules/transformable-viewport)
Shift and zoom your graph using mouse or touch gestures for intuitive navigation.

### [Draggable Nodes](/modules/draggable-nodes)
Easily reposition nodes by dragging them with mouse or touch gestures.

### [Background Rendering](/modules/background)
Add customizable backgrounds that seamlessly work with the transformable viewport.

### [Connectable Ports](/modules/connectable-ports)
Create connections by dragging between ports, enabling dynamic graph editing.

### [Virtual Scroll](/modules/virtual-scroll)
Optimize performance for large graphs with intelligent rendering of visible elements only.

### [Responsive Nodes](/modules/resize-reactive-nodes)
Automatically maintain edge connections when nodes are resized.

### [Box Area Rendering](/modules/box-area-rendering)
Advanced control for virtual scrolling with precise rendering regions.
