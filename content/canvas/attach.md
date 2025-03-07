---
title: Canvas | Attach
---

## Attach

Attaches the canvas to an HTML element. If the canvas is already attached to another element, it will first detach and then attach to the specified element.

{{< code lang="javascript">}}
const element = document.getElementById("#canvas");

canvas.attach(element);
{{< /code >}}

### Parameters for `attach`:

| Name     | Type        | Description             | Required |
|----------|-------------|-------------------------|----------|
| element  | HTMLElement | HTML element for canvas | Yes      |
