---
title: Getting started
---

## Getting started

First, let's include the library in your project and create a canvas. You have several options to do this:

1. Via npm

{{< code lang="bash" >}}
npm i @html-graph/html-graph
{{< /code >}}

and use it like this

{{< code lang="javascript" >}}
import { CanvasBuilder } from "@html-graph/html-graph";

const element = document.getElementById('canvas');

const canvas = new CanvasBuilder()
  .setElement(element)
  .build();
{{< / code >}}

2. Local file as module

Download `html-graph.js` from <a target="_blank" href="https://github.com/html-graph/html-graph/releases">releases</a>
and use it like this

{{< code lang="xml">}}
<script type="module">
  import { CanvasBuilder } from "/html-graph.js";

  const element = document.getElementById('canvas');

  const canvas = new CanvasBuilder()
    .setElement(element)
    .build();
</script>
{{< /code >}}

3. Local file as UMD

Download `html-graph.umd.cjs` from <a target="_blank" href="https://github.com/html-graph/html-graph/releases">releases</a>
and use it like this

{{< code lang="xml">}}
<script src="/html-graph.umd.cjs"></script>
<script>
  const element = document.getElementById('canvas');

  const canvas = new HtmlGraph.CanvasBuilder()
    .setElement(element)
    .build();
</script>
{{< /code >}}

Here's a basic example to get started with:

{{< use-case title="Basic example" src=/use-cases/getting-started/ >}}
