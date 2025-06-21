---
title: Getting started
sitemap:
  priority: 0.9
---

## Getting Started

First, include the library in your project and create a canvas. You have several options:

### 1. Via npm

{{< code lang="bash" >}}
npm i @html-graph/html-graph
{{< /code >}}

Then use it in your JavaScript:

{{< code lang="javascript" >}}
import { CanvasBuilder } from "@html-graph/html-graph";

const element = document.getElementById('canvas');
const canvas = new CanvasBuilder(element).build();
{{< /code >}}

### 2. Local file as ES module

Download `html-graph.js` from <a target="_blank" href="https://github.com/html-graph/html-graph/releases">releases</a> and use:

{{< code lang="html" >}}
<script type="module">
  import { CanvasBuilder } from "/html-graph.js";

  const element = document.getElementById('canvas');
  const canvas = new CanvasBuilder(element).build();
</script>
{{< /code >}}

### 3. Local file as UMD

Download `html-graph.umd.cjs` from <a target="_blank" href="https://github.com/html-graph/html-graph/releases">releases</a> and use:

{{< code lang="html" >}}
<script src="/html-graph.umd.cjs"></script>
<script>
  const element = document.getElementById('canvas');
  const canvas = new HtmlGraph.CanvasBuilder(element).build();
</script>
{{< /code >}}

### Basic Example

Here's a simple example to get started:

{{< use-case title="Basic example" src="/use-cases/getting-started/" >}}

All examples are provided as self-contained HTML files for easy setup and usage.
