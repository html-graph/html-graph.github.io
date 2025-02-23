---
title: Home
---

HTMLGraph is a graph visualization library that enables nodes customization using HTML.

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

```
npm i @html-graph/html-graph
```

```
const canvas = new HtmlGraphBuilder().build();
...
```

2. If you don't use bundler than download file from CDN

```
<script src="https://unpkg.com/@html-graph/html-graph/dist/main.js"></script>
<script type="module">
  const canvas = new HtmlGraphBuilder().build();
</script>
```

or

```
<script src="https://unpkg.com/@html-graph/html-graph/dist/main.umd.cjs"></script>
<script>
  const canvas = new HtmlGraph.HtmlGraphBuilder().build();
</script>
```
