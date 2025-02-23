---
title: Home
---

HTMLGraph is a graph visualization library that enables nodes customization using HTML.

This library is designed to be low-level but extensible.

<!-- Getting started. -->

<!-- 1. Install package via npm -->

<!-- ``` -->
<!-- npm i @html-graph/html-graph -->
<!-- ``` -->

<!-- or use via CDN -->

<!-- ``` -->
<!-- <script src="https://unpkg.com/@html-graph/html-graph/dist/main.js"></script> -->
<!-- ``` -->

<!-- 2. Create markup -->

<!-- ``` -->
<!-- <!doctype html> -->
<!-- <html lang="en"> -->
<!--   <head> -->
<!--     <link rel="stylesheet" href="main.css" /> -->
<!--   </head> -->
<!--   <body> -->
<!--     <div id="canvas" class="canvas"></div> -->
<!--     <script src="https://unpkg.com/@html-graph/html-graph/dist/main.js"></script> -->
<!--   </body> -->
<!-- </html> -->
<!-- ``` -->

<!-- 3. Create node function -->

<!-- ``` -->
<!-- export function createNode({ id, name, x, y, frontPortId, backPortId) { -->
<!--   const node = document.createElement("div"); -->
<!--   node.classList.add("node"); -->

<!--   const frontPort = document.createElement("div"); -->
<!--   frontPort.classList.add("node-port"); -->
<!--   node.appendChild(frontPort); -->

<!--   const text = document.createElement("div"); -->
<!--   text.innerText = params.name; -->
<!--   node.appendChild(text); -->

<!--   const backPort = document.createElement("div"); -->
<!--   backPort.classList.add("node-port"); -->
<!--   node.appendChild(backPort); -->

<!--   return { -->
<!--     id: params.id, -->
<!--     element: node, -->
<!--     x: params.x, -->
<!--     y: params.y, -->
<!--     ports: [ -->
<!--       { id: params.frontPortId, element: frontPort }, -->
<!--       { id: params.backPortId, element: backPort }, -->
<!--     ], -->
<!--     priority: params.priority, -->
<!--   }; -->
<!-- } -->

<!-- ``` -->
