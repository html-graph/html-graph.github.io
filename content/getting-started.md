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
  import { CanvasBuilder } from "https://unpkg.com/@html-graph/html-graph@3.7.0";

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

Now you can visualize your graph by adapting the implementation of this basic example.
Refer to [canvas](/canvas) section for base API and [modules](/modules) section for all available advanced features.

{{< use-case title="Basic example" src="/use-cases/getting-started/" >}}
