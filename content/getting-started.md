---
title: Getting started
sitemap:
  priority: 0.9
---

## Getting Started

First, include the library in your project and create a canvas. You have several options:

### 1. Install via npm

{{< code lang="bash" >}}
npm i @html-graph/html-graph
{{< /code >}}

Then use it:

{{< code lang="html" >}}
<div id="canvas"></div>
{{< /code >}}

{{< code lang="javascript" >}}
import { CanvasBuilder } from "@html-graph/html-graph";

const element = document.getElementById('canvas');
const canvas = new CanvasBuilder(element).build();
{{< /code >}}

### 2. Use script from CDN as ES module

{{< code lang="html" >}}
<div id="canvas"></div>
<script type="module">
  import { CanvasBuilder } from "https://unpkg.com/@html-graph/html-graph@3.18.0";

  const element = document.getElementById('canvas');
  const canvas = new CanvasBuilder(element).build();
</script>
{{< /code >}}

### 3. Use local file as ES module

Download `html-graph.js` from <a target="_blank" href="https://github.com/html-graph/html-graph/releases">releases</a> and use:

{{< code lang="html" >}}
<div id="canvas"></div>
<script type="module">
  import { CanvasBuilder } from "/html-graph.js";

  const element = document.getElementById('canvas');
  const canvas = new CanvasBuilder(element).build();
</script>
{{< /code >}}

### 4. Use local file as UMD

Download `html-graph.umd.cjs` from <a target="_blank" href="https://github.com/html-graph/html-graph/releases">releases</a> and use:

{{< code lang="html" >}}
<div id="canvas"></div>
<script src="/html-graph.umd.cjs"></script>
<script>
  const element = document.getElementById('canvas');
  const canvas = new HtmlGraph.CanvasBuilder(element).build();
</script>
{{< /code >}}

---

The next part will guide you through graph visualization step-by-step.
If you prefer to see the final implementation first, you can jump directly
to the [end result](#end-result) and explore the details afterwards.

Now that we've initialized the canvas, let's define a proper application structure.
Usage of ES6 classes helps to organize code:

{{< code lang="javascript" >}}
class Application {
  constructor(element) {
    this.canvas = new CanvasBuilder(element)
      .build();
  }

  initGraph() {
    // the graph will be initialized there
  }
}

const element = document.getElementById("canvas");
const app = new Application(element);

app.initGraph();
{{< /code >}}

Also we need to add some basic CSS so that we have a full screen canvas.

{{< code lang="css" >}}
html,
body {
  height: 100%;
  padding: 0;
  margin: 0;
}

body {
  position: relative;
}

#canvas {
  position: absolute;
  inset: 0;
}
{{< /code >}}

At this point everything is ready for graph visualization.
Lets create a basic node. For this purpose we create a method, that returns a
data structure, which is expected in <a href="/canvas#add-node" target="_blank">addNode</a> method.

The `createNode` method of `Application` class accepts parameters:
- `name` is a text content of a node
- `x` and `y` are node's coordinates,
- `frontPortId` and `backPortId` are port identifiers.

Port is a proxy element via
which nodes are connected. It provides more flexibility at managing edges,
unlike connecting nodes directly (although node element itself can be used as a
port at the same time).

{{< code lang="javascript" >}}
class Application {
  // ...

  createNode({ name, x, y, frontPortId, backPortId }) {
    const node = document.createElement("div");
    const text = document.createElement("div");
    const frontPort = document.createElement("div");
    const backPort = document.createElement("div");

    node.classList.add("node");
    frontPort.classList.add("node-port");
    backPort.classList.add("node-port");
    text.innerText = name;

    node.appendChild(frontPort);
    node.appendChild(text);
    node.appendChild(backPort);

    return {
      element: node,
      x: x,
      y: y,
      ports: [
        { id: frontPortId, element: frontPort },
        { id: backPortId, element: backPort },
      ],
    };
  }
}
{{< /code >}}

Also here is some CSS so that our nodes look nice:

{{< code lang="css" >}}
.node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100px;
  height: 100px;
  background: #daedbd;
  border: 1px solid #9e9e9e;
  box-shadow: 0 0 5px #9e9e9e;
  border-radius: 50%;
  user-select: none;
}

.node-port {
  position: relative;
  width: 0;
}

.node-port::after {
  content: "";
  position: absolute;
  top: -3px;
  left: -3px;
  width: 6px;
  height: 6px;
  background: #777777;
  border-radius: 3px;
}
{{< /code >}}

Nodes are fully customizable using HTML and CSS.

It's time to use created method in `initGraph`.

{{< code lang="javascript" >}}
class Application {
  // ...

  initGraph() {
    this.canvas
      .addNode(
        this.createNode({
          name: "Node 1",
          x: 200,
          y: 200,
          frontPortId: "node-1-in",
          backPortId: "node-1-out",
        }),
      )
      .addNode(
        this.createNode({
          name: "Node 2",
          x: 600,
          y: 300,
          frontPortId: "node-2-in",
          backPortId: "node-2-out",
        }),
      );
  }

  // ...
}
{{< /code >}}

At this point we have two nodes, but they are not connected. To connect them we
will use <a href="/canvas#add-edge" target="_blank">addEdge</a> method. It accepts identifiers of source
port and target port.

{{< code lang="javascript" >}}
class Application {
  // ...

  initGraph() {
    this.canvas
      .addNode(
        this.createNode({
          name: "Node 1",
          x: 200,
          y: 200,
          frontPortId: "node-1-in",
          backPortId: "node-1-out",
        }),
      )
      .addNode(
        this.createNode({
          name: "Node 2",
          x: 600,
          y: 300,
          frontPortId: "node-2-in",
          backPortId: "node-2-out",
        }),
      )
      .addEdge({ from: "node-1-out", to: "node-2-in" });
  }

  // ...
}
{{< /code >}}

We can customize edges, for example we can add a target arrow.
This can be done using <a href="/defaults" target="_blank">setDefaults</a> method of `CanvasBuilder`.

{{< code lang="javascript" >}}
class Application {
  constructor(element) {
    this.canvas = new CanvasBuilder(element)
      .setDefaults({
        edges: {
          shape: {
            hasTargetArrow: true,
          }
        }
      })
      .build();
  }

  // ...
}
{{< /code >}}

But the resulted graph is static. We can enable transformable viewport,
draggable nodes and other features. Refer to <a href="/modules" target="_blank">Modules</a> for all
available features.

{{< code lang="javascript" >}}
class Application {
  constructor(element) {
    this.canvas = new CanvasBuilder(element)
      .setDefaults({
        edges: {
          shape: {
            hasTargetArrow: true,
          }
        }
      })
      .enableUserTransformableViewport()
      .enableUserDraggableNodes()
      .enableBackground()
      .build();
  }

  // ...
}
{{< /code >}}

The end result is presented below.

Every example in this documentation is a single HTML page, so you can copy/paste the implementation, and it will work immediately.

# # {#end-result}

{{< use-case title="Basic example" src="/use-cases/getting-started/" >}}
