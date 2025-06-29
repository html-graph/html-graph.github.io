---
title: Modules | Box Area Rendering
sitemap:
  priority: 0.3
---

## Box Area Rendering (advanced usage)

Instead of relying on the built-in [virtual scroll](/modules/virtual-scroll),
you can fine-tune your own virtual scroll implementation.
This can be achieved by providing an [EventSubject](#event-subject)
trigger for graph rendering within a bounded area using the `enableBoxAreaRendering` method of `CanvasBuilder`.

{{< code lang="javascript">}}
import { CanvasBuilder, EventSubject } from '@html-graph/html-graph';

const trigger = new EventSubject();
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .enableBoxAreaRendering(trigger)
  .build();
{{< /code >}}

You can then trigger rendering within a specific bounded area:

{{< code lang="javascript">}}
trigger.emit({ x: 100, y: 100, width: 1200, height: 1200 });
{{< /code >}}

{{< ref-target ref="event-subject">}}

### EventSubject ### {#event-subject}

`EventSubject` is a straightforward implementation of the *Observer* pattern.

`EventSubject<T>` provides the following methods:

| Name          | Arguments              | Description                          |
|---------------|------------------------|--------------------------------------|
| `subscribe`   | `(payload: T) => void` | Adds a function to call on `emit`    |
| `unsubscribe` | `(payload: T) => void` | Removes a function to call on `emit` |
| `emit`        | `T`                    | Calls all subscribed callbacks       |

{{< /ref-target >}}

When a box rendering trigger is specified, it becomes your responsibility to
initiate rendering (unless you use the built-in [virtual scroll](/modules/virtual-scroll)).

{{< use-case title="Box Area Rendering" src=/use-cases/box-area-rendering/ >}}
