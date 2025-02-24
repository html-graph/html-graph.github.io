---
title: Home
---

HTMLGraph is a graph visualization library that enables nodes customization via HTML.

This library designed to be low-level with some high level functionality
built-in.

Features:

- customizable nodes via HTML
- customizable connections a.k.a edges
- connections precise control via ports
- built-in draggable nodes
- built-in shiftable and scalable canvas
- built-in nodes reactive to resize
- touchpad devices support
- typescript support

All the examples are designed to be single HTML file in order to to minimize setup.

Here is an example of what this library capable of:

{{< use-case-frame src=/use-cases/020-advanced-demo/ >}}

Getting started.

1. If you use bundler than install npm package

{{< highlight bash>}}
npm i @html-graph/html-graph
{{< / highlight >}}

and use it like this

{{< highlight javascript>}}
const canvas = new HtmlGraphBuilder().build();
{{< / highlight >}}

2. If you don't use bundler than download file from CDN

{{< highlight html>}}

<script src="https://unpkg.com/@html-graph/html-graph/dist/main.js"></script>
<script type="module">
  const canvas = new HtmlGraphBuilder().build();
</script>

{{< / highlight >}}

or

{{< highlight html>}}

<script src="https://unpkg.com/@html-graph/html-graph/dist/main.umd.cjs"></script>
<script>
  const canvas = new HtmlGraph.HtmlGraphBuilder().build();
</script>

{{< / highlight >}}
