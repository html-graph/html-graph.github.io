---
title: Getting started
sitemap:
  priority: 1
---

## Getting Started

Use one of the following options to include the library into your project:

<div data-tabs>
<div data-tabs-btns>
  <button data-tab="0" data-tab-active>
    NPM
  </button>

  <button data-tab="1">
    CDN
  </button>

  <button data-tab="2">
    Local ESM
  </button>

  <button data-tab="3">
    Local UMD
  </button>
</div>

<div data-tab-content="0" data-tab-content-visible>
Install NPM package
{{< code lang="bash" >}}
npm i @html-graph/html-graph
{{< /code >}}

Then use it:

{{< code lang="html" >}}
<div id="canvas"></div>
{{< /code >}}

{{< code lang="javascript" >}}
import { CanvasBuilder } from "@html-graph/html-graph";

const element = document.getElementById("canvas");
const canvas = new CanvasBuilder(element).build();
{{< /code >}}
</div>

<div data-tab-content="1">
Paste the content into HTML
{{< code lang="html" >}}
<div id="canvas"></div>
<script type="module">
  import { CanvasBuilder } from "https://unpkg.com/@html-graph/html-graph@8.15.0/dist/html-graph.min.js";

  const element = document.getElementById("canvas");
  const canvas = new CanvasBuilder(element).build();
</script>
{{< /code >}}
</div>

<div data-tab-content="2">
Download <code>html-graph.min.js</code> from <a target="_blank" href="https://github.com/html-graph/html-graph/releases">releases</a> and use:

{{< code lang="html" >}}
<div id="canvas"></div>
<script type="module">
  import { CanvasBuilder } from "/html-graph.min.js";

  const element = document.getElementById("canvas");
  const canvas = new CanvasBuilder(element).build();
</script>
{{< /code >}}
</div>

<div data-tab-content="3">
Download <code>html-graph.min.umd.cjs</code> from <a target="_blank" href="https://github.com/html-graph/html-graph/releases">releases</a> and use:

{{< code lang="html" >}}
<div id="canvas"></div>
<script src="/html-graph.min.umd.cjs"></script>
<script>
  const element = document.getElementById("canvas");
  const canvas = new HtmlGraph.CanvasBuilder(element).build();
</script>
{{< /code >}}
</div>
</div>

The next example demonstrates how to implement visualization of a basic graph.
Additionally, it configures transformable viewport, draggable nodes, and background.

# # {#end-result}

{{< use-case src="/use-cases/getting-started/" >}}

While reviewing the complete implementation might suffice, it's recommended to
follow step-by-step guide, because it explains some important concepts.

<div data-tabs>
<div data-tabs-btns>
  <button data-tab="0" data-tab-active>
    1. Initialization
  </button>

  <button data-tab="1">
    2. Creating Nodes
  </button>

  <button data-tab="2">
    3. Styling Nodes
  </button>

  <button data-tab="3">
    4. Adding Nodes
  </button>

  <button data-tab="4">
    5. Adding Edges
  </button>

  <button data-tab="5">
    6. Enabling Features
  </button>
</div>

<div data-tab-content="0" data-tab-content-visible>
As a basis for our application, we will use this simple template.
It defines a full-screen canvas and an <code>Application</code> class.

{{< code lang="html" >}}
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
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
    </style>
  </head>
  <body>
    <div id="canvas"></div>
    <script type="module">
      import { CanvasBuilder } from "https://unpkg.com/@html-graph/html-graph@8.15.0/dist/html-graph.min.js";

      class Application {
        constructor(element) {
          this.canvas = new CanvasBuilder(element)
            .build();
        }

        initGraph() {
          // the graph will be initialized here
        }
      }

      const element = document.getElementById("canvas");
      const app = new Application(element);

      app.initGraph();
    </script>
  </body>
</html>
{{< /code >}}
</div>

<div data-tab-content="1">
Nodes can be added using the <a href="/canvas/#add-node" target="_blank">addNode</a>
method. This method accepts a specific object, which has to be constructed
first. For this purpose, we add a <code>createNode</code> method to the <code>Application</code> class.

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

    // this data structure is expected in canvas.addNode method
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

The <code>createNode</code> method accepts parameters:

- <code>name</code> is the text content of a node,
- <code>x</code> and <code>y</code> are the node's coordinates,
- <code>frontPortId</code> and <code>backPortId</code> are port identifiers.

A port is a proxy element through which nodes are connected.
It provides more flexibility for managing edges.

<b>\* The node <code>element</code> can also be used as a port <code>element</code> simultaneously.</b>
</div>

<div data-tab-content="2">
Node's appearance is fully customizable using HTML/SVG and CSS.

This is a basic example of what node's styles could be:

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
</div>

<div data-tab-content="3">
It's time to use the created method in <code>initGraph</code> and focus viewport on newly created nodes.

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
        })
      )
      .addNode(
        this.createNode({
          name: "Node 2",
          x: 600,
          y: 300,
          frontPortId: "node-2-in",
          backPortId: "node-2-out",
        })
      )
      .focus();
  }

  // ...
}
{{< /code >}}
</div>

<div data-tab-content="4">
To connect these two nodes, the <a href="/canvas/#add-edge" target="_blank">addEdge</a> method will be used.
It accepts the identifiers of the source port and the target port.

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
        })
      )
      .addNode(
        this.createNode({
          name: "Node 2",
          x: 600,
          y: 300,
          frontPortId: "node-2-in",
          backPortId: "node-2-out",
        })
      )
      .addEdge({ from: "node-1-out", to: "node-2-in" })
      .focus();
  }

  // ...
}
{{< /code >}}

Edges can be customized, for instance, by adding a target arrow.
This can be achieved using the <code>setDefaults</code> method of <code>CanvasBuilder</code>.

{{< code lang="javascript" >}}
class Application {
  constructor(element) {
    this.canvas = new CanvasBuilder(element)
      .setDefaults({
        edges: {
          shape: {
            hasTargetArrow: true,
          },
        },
      })
      .build();
  }

  // ...
}
{{< /code >}}

Refer to the <a href="/defaults/" target="_blank">Defaults</a> page for all available options.
</div>

<div data-tab-content="5">
HTMLGraph supports numerous useful features, including:
<ul>
  <li>
    transformable viewport
  </li>
  <li>
    draggable nodes
  </li>
  <li>
    background rendering
  </li>
  <li>
    and many more ...
  </li>
</ul>

These features can be enabled by invoking their corresponding methods on the <code>CanvasBuilder</code> instance, like so:

{{< code lang="javascript" >}}
class Application {
  constructor(element) {
    this.canvas = new CanvasBuilder(element)
      .setDefaults({
        edges: {
          shape: {
            hasTargetArrow: true,
          },
        },
      })
      .enableUserTransformableViewport()
      .enableUserDraggableNodes()
      .enableBackground()
      .build();
  }

  // ...
}
{{< /code >}}

Refer to <a href="/features/" target="_blank">Features</a> for all available options.


</div>

