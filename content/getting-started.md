---
title: Getting started
---

First of all lets include library into your project and create canvas.
There are few options:

1. Via npm

{{< code lang="bash" >}}
npm i @html-graph/html-graph
{{< /code >}}

{{< code lang="javascript" >}}
import { HtmlGraphBuilder } from "@html-graph/html-graph";

const canvas = new HtmlGraphBuilder().build();
{{< / code >}}

2. Local file as module

Download `main.js` from <a target="_blank" href="https://github.com/html-graph/html-graph/releases">releases</a>

{{< code lang="xml">}}
<script type="module">
  import { HtmlGraphBuilder } from "/main.js";

  const canvas = new HtmlGraphBuilder()
    .build();
</script>
{{< /code >}}

3. Local file as UMD

Download `main.umd.cjs` from <a target="_blank" href="https://github.com/html-graph/html-graph/releases">releases</a>

{{< code lang="xml">}}
<script src="/main.umd.cjs"></script>
<script>
  const canvas = new HtmlGraph.HtmlGraphBuilder()
    .build();
</script>
{{< /code >}}

Now it's time to visiualize our first graph.

{{< use-case title="Basic example" src=/use-cases/getting-started/ >}}
