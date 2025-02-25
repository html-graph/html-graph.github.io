---
title: Getting started
---

First of all lets include library into your project and create canvas.
There are few options to do this.

1. Via npm

{{< highlight bash>}}
npm i @html-graph/html-graph
{{< / highlight >}}

{{< highlight javascript>}}
import { HtmlGraphBuilder } from "@html-graph/html-graph";

const canvas = new HtmlGraphBuilder().build();
{{< / highlight >}}

2. Local file as module

Download `main.js` from [releases](https://github.com/html-graph/html-graph/releases)

{{< highlight html>}}
<script type="module">
  import { HtmlGraphBuilder } from "/main.js";

  const canvas = new HtmlGraphBuilder()
    .build();
</script>
{{< / highlight >}}

3. Local file as UMD

Download `main.umd.cjs` from [releases](https://github.com/html-graph/html-graph/releases)

{{< highlight html>}}

<script src="/main.umd.cjs"></script>
<script>
  const canvas = new HtmlGraph.HtmlGraphBuilder()
    .build();
</script>

{{< / highlight >}}

Now it's time to visiualize our first graph.

{{< use-case-frame src=/use-cases/getting-started/ >}}
