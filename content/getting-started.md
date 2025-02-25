---
title: Getting started
---

First of all lets include library into your project. There are few options how
to do it.

1. Via npm

{{< highlight bash>}}
npm i @html-graph/html-graph
{{< / highlight >}}

than use it like this

{{< highlight javascript>}}
import { HtmlGraphBuilder } from "@html-graph/html-graph";

const canvas = new HtmlGraphBuilder().build();
{{< / highlight >}}

2. Via CDN as module

{{< highlight html>}}

<script type="module">
  import { HtmlGraphBuilder } from "https://unpkg.com/@html-graph/html-graph/dist/main.js";

  const canvas = new HtmlGraphBuilder().build();
</script>

{{< / highlight >}}

3. Via CDN as UMD

{{< highlight html>}}

<script src="https://unpkg.com/@html-graph/html-graph/dist/main.umd.cjs"></script>
<script>
  const canvas = new HtmlGraph.HtmlGraphBuilder().build();
</script>

{{< / highlight >}}

`HtmlGraphBuilder` and `Canvas` are two main entities in this library. Builder
is a helper class, which is responsible to create canvas.
