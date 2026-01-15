---
title: Features | Connectable Ports
sitemap:
  priority: 0.6
---

## Connectable Ports

In some cases, providing users with interactive graph modification functionality is essential.
Part of this functionality is the ability to add new connections to the graph.

<a href="/use-cases/connectable-ports/" target="_blank" aria-label="Connectable ports">
  <div class="video">
    <video autoplay muted loop>
      <source src="/media/connectable-ports.webm">
    </video>
  </div>
</a>

To enable ports that are connectable via dragging, call the `enableUserConnectablePorts` method on a `CanvasBuilder` instance:

{{< code lang="javascript">}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder(element)
  .enableUserConnectablePorts()
  .build();
{{< /code>}}

It is crucial for a port to have a "grabable" area large enough to actually be grabbed by the user, as shown in the example below.

{{< use-case src=/use-cases/connectable-ports/ >}}

The `enableUserConnectablePorts` method accepts optional configuration.

### Configuration Parameters

| Name                     | Type                                                                                   | Description                                                                                                            | Required | Default                                    |
|--------------------------|----------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|----------|--------------------------------------------|
| `connectionTypeResolver` | `(portId) => "direct" \| "reverse" \| null`                                            | Resolves connection type when edge creation has been initiated. `null` means that connection is disallowed             | no       | `() => "direct"`                           |
| `connectionPreprocessor` | `(request: AddEdgeRequest) => AddEdgeRequest \| null`                                  | Applies modifications to the edge about to be created. `null` means that connection is disallowed.                     | no       | `(request) => request`                     |
| `mouseDownEventVerifier` | `(event) => boolean`                                                                   | Function to verify if mouse event should initiate connection creation process                                          | no       | `(event) => event.button === 0`            |
| `mouseUpEventVerifier`   | `(event) => boolean`                                                                   | Function to verify if mouse event should create connection                                                             | no       | `(event) => event.button === 0`            |
| `dragPortDirection`      | `number \| undefined`                                                                  | Direction of dragging port                                                                                             | no       | `undefined`                                |
| `edgeShape`              | <code><a href="/defaults#edge-shape-config" target="_blank">EdgeShapeConfig</a></code> | Default edge shape configuration while port is in the process of dragging                                              | no       | Same as for canvas                         |
| `events`                 | <code>[EventsConfig](#events)</code>                                                   | Handlers for available events                                                                                          | no       | `{}`                                       |

{{< ref-target ref="events">}}

### Events Configuration ### {#events}

| Name                        | Type                                                   | Description                                                      | Required | Default      |
|-----------------------------|--------------------------------------------------------|------------------------------------------------------------------|----------|--------------|
| `onAfterEdgeCreated`        | `(edgeId) => void`                                     | Function called after a new edge has been added                  | no       | `() => void` |
| `onEdgeCreationInterrupted` | `(params: { staticPortId, isDirect: boolean}) => void` | Function called when edge creation is interrupted in the process | no       | `() => void` |
| `onEdgeCreationPrevented`   | `(request: AddEdgeRequest) => void`                    | Function called when an attempt to create edge is prevented      | no       | `() => void` |

{{< /ref-target >}}

Here's a good example of a reasonable connection type resolver, which resolves
direct connection when an "out" port gets grabbed, and reverses connection when an "in" port gets grabbed:

{{< code lang="javascript">}}
const connectionTypeResolver = (portId) => {
  return portId.endsWith("-out") ? "direct" : "reverse";
};
{{< /code>}}

As for the connection preprocessor, you can start with one that forbids
duplicated connections:

{{< code lang="javascript">}}
const connectionPreprocessor = (request) => {
  const existingEdge = canvas.graph.getAllEdgeIds().find((edgeId) => {
    const edge = canvas.graph.getEdge(edgeId);

    return edge.from === request.from && edge.to === request.to;
  });

  return existingEdge === undefined ? request : null;
};
{{< /code>}}

You might also be interested in the <a href="/tutorials/edges-with-remove-button/" target="_blank">Edges with Remove Button</a> tutorial.

<a href="/use-cases/midpoint-edge/" target="_blank" aria-label="Edges with Remove Button">
  <div class="video">
    <video autoplay muted loop>
      <source src="/media/removable-edges.webm">
    </video>
  </div>
</a>
