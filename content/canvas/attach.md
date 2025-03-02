---
title: Canvas | Attach
---

## Attach

Attaches the canvas to an HTML element. If canvas is already attached, then it will
be detached and attached to specified element.

{{< code lang="javascript">}}
const element = document.getElementById("#canvas");

canvas.attach(element);
{{< /code >}}

### Parameters for `attach`:

| Name     | Type        | Description             | Required | Default |
|----------|-------------|-------------------------|----------|---------|
| element  | HTMLElement | HTML element for canvas | Yes      |         |
