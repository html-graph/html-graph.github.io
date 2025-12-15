---
title: Features
sitemap:
  priority: 0.7
---

## Features

HTMLGraph extends its functionality through optional features, which can be enabled by calling their respective methods on a `CanvasBuilder` instance.

`CanvasBuilder` uses a fluent interface, allowing methods to be chained for concise configuration. For example:

{{< code lang="javascript" >}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .enableUserTransformableViewport() // Enables viewport pan and zoom
  .enableUserDraggableNodes() // Enables draggable nodes
  .enableBackground() // Renders background
  .build();
{{< /code >}}

Here is an overview of all available features:

### [Transformable Viewport](/features/transformable-viewport/)
Shift and zoom your graph using mouse or touch gestures for intuitive navigation.

<a href="/use-cases/transformable-viewport/" target="_blank" aria-label="Transformable Viewport">
  <div class="video">
    <video autoplay muted loop>
      <source src="/media/transformable-viewport.webm">
    </video>
  </div>
</a>

### [Draggable Nodes](/features/draggable-nodes/)
Easily reposition nodes by dragging them with mouse or touch gestures.

<a href="/use-cases/draggable-nodes/" target="_blank" aria-label="Draggable Nodes">
  <div class="video">
    <video autoplay muted loop>
      <source src="/media/draggable-nodes.webm">
    </video>
  </div>
</a>

### [Background Rendering](/features/background/)
Add customizable backgrounds that seamlessly work with the transformable viewport.

<a href="/use-cases/custom-background-renderer/" target="_blank" aria-label="Background">
  <div class="video">
    <video autoplay muted loop>
      <source src="/media/background.webm">
    </video>
  </div>
</a>

### [Connectable Ports](/features/connectable-ports/)
Create connections by dragging between ports, enabling dynamic graph editing.

<a href="/use-cases/connectable-ports/" target="_blank" aria-label="Connectable Ports">
  <div class="video">
    <video autoplay muted loop>
      <source src="/media/connectable-ports.webm">
    </video>
  </div>
</a>

### [Draggable Edges](/features/draggable-edges/)
Update existing connections by dragging adjacent ports, enabling dynamic graph editing.

<a href="/use-cases/draggable-edges/" target="_blank" aria-label="Draggable Edges">
  <div class="video">
    <video autoplay muted loop>
      <source src="/media/draggable-edges.webm">
    </video>
  </div>
</a>

### [Virtual Scroll](/features/virtual-scroll/)
Optimize performance for large graphs with intelligent rendering of visible elements only.

<a href="/use-cases/virtual-scroll/" target="_blank" aria-label="Virtual Scroll">
  <div class="video">
    <video autoplay muted loop>
      <source src="/media/virtual-scroll.webm">
    </video>
  </div>
</a>

### [Node Resize Reactive Edges](/features/node-resize-reactive-edges/)
Automatically maintain edge connections when nodes are resized.

<a href="/use-cases/node-resize-reactive-edges/" target="_blank" aria-label="Node Resize Reactive Edges">
  <div class="video">
    <video autoplay muted loop>
      <source src="/media/node-resize-reactive-edges.webm">
    </video>
  </div>
</a>
