---
title: Features | Connectable Ports
sitemap:
  priority: 0.6
---

## Connectable Ports

In some use cases, providing users with interactive graph modification functionality is essential.
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
const element = document.getElementById("canvas");

const canvas = new CanvasBuilder(element)
  .enableUserConnectablePorts()
  .build();
{{< /code>}}

It is crucial for a port to have a "grabable" area large enough to actually be grabbed by the user, as shown in the example below.

{{< use-case src=/use-cases/connectable-ports/ >}}

The `enableUserConnectablePorts` method accepts optional configuration.

### Configuration Parameters

| Name                        | Type                                                                                   | Description                                                                                                       | Required | Default                                           |
|-----------------------------|----------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|----------|---------------------------------------------------|
| `connectionTypeResolver`    | `(portId) => "direct" \| "reverse" \| null`                                            | Resolves connection type when edge creation has been initiated. `null` means that connection is disallowed        | no       | `() => "direct"`                                  |
| `connectionAllowedVerifier` | `(request: { from: Identifier, to: Identifier }) => boolean`                           | Verifies if connection between specified ports is allowed.                                                        | no       | `(request) => true`                               |
| `dragPortDirection`         | <code>[DragPortDirection](#drag-port-direction)</code>                                 | Direction of dragging port                                                                                        | no       | `"inherit"`                                       |
| `connectionPreprocessor`    | `(request: AddEdgeRequest) => AddEdgeRequest`                                          | Applies modifications to the edge about to be created.                                                            | no       | `(request) => request`                            |
| `grabbedPortIdResolver`     | `(portIds: Identifier[]) => Identifier \| null`                                        | Resolves ID of a port being grabbed when there's ambiguity. See <code>[PortIdResolver](#port-id-resolver)</code>  | no       | First added port                                  |
| `releasedPortIdResolver`    | `(portIds: Identifier[]) => Identifier \| null`                                        | Resolves ID of a port being released when there's ambiguity. See <code>[PortIdResolver](#port-id-resolver)</code> | no       | First added port                                  |
| `mouseDownEventVerifier`    | `(event) => boolean`                                                                   | Function to verify if mouse event should initiate connection creation process                                     | no       | `(event) => event.button === 0 && !event.ctrlKey` |
| `mouseUpEventVerifier`      | `(event) => boolean`                                                                   | Function to verify if mouse event should create connection                                                        | no       | `(event) => event.button === 0`                   |
| `edgeShape`                 | <code><a href="/defaults#edge-shape-config" target="_blank">EdgeShapeConfig</a></code> | Default edge shape configuration while port is in the process of dragging                                         | no       | Same as for canvas                                |
| `events`                    | <code>[EventsConfig](#events)</code>                                                   | Handlers for available events                                                                                     | no       | `{}`                                              |


Here's a good example of a reasonable connection type resolver, which resolves
direct connection when an "out" port gets grabbed, and reverses connection when an "in" port gets grabbed:

{{< code lang="javascript">}}
const connectionTypeResolver = (portId) => {
  return portId.endsWith("-out") ? "direct" : "reverse";
};
{{< /code>}}

As for the connection allowed verifier, you can start with one that forbids
duplicated connections:

{{< code lang="javascript">}}
const connectionAllowedVerifier = (request) => {
  const existingEdge = canvas.graph.getAllEdgeIds().find((edgeId) => {
    const edge = canvas.graph.getEdge(edgeId);

    return edge.from === request.from && edge.to === request.to;
  });

  return existingEdge === undefined;
};
{{< /code>}}

{{< ref-target ref="drag-port-direction">}}
### `DragPortDirection` ### {#drag-port-direction}

| Name                     | Type                         | Description                                                        |
|--------------------------|------------------------------|--------------------------------------------------------------------|
| Constant                 | `number`                     | Fixed radian angle for the dragging port direction                 |
| Nearest Connectable Port | `"nearest-connectable-port"` | Direction matches the direction of the nearest connectable port    |
| Inherit                  | `"inherit"`                  | Direction matches the original direction of the port being grabbed |
{{< /ref-target >}}

{{< ref-target ref="port-id-resolver">}}
### `PortIdResolver` ### {#port-id-resolver}

The same `element` can be marked as multiple different ports. When user interacts with such element,
it's not clear which port should be interacted with, for example when grabbed or released.

`PortIdResolver` function allows to configure such behavior.
{{< /ref-target >}}

There are good examples of such functions:

{{< code lang="javascript">}}
const grabbedPortIdResolver = (portIds) => {
  return portIds.find((portId) => portId.endsWith("-out")) ?? null;
}

const releasedPortIdResolver = (portIds) => {
  return portIds.find((portId) => portId.endsWith("-in")) ?? null;
}
{{< /code>}}


{{< ref-target ref="events">}}
### `EventsConfig` ### {#events}

| Name                        | Type                                                   | Description                                                      | Required | Default      |
|-----------------------------|--------------------------------------------------------|------------------------------------------------------------------|----------|--------------|
| `onAfterEdgeCreated`        | `(edgeId) => void`                                     | Function called after a new edge has been added                  | no       | `() => void` |
| `onEdgeCreationInterrupted` | `(params: { staticPortId, isDirect: boolean}) => void` | Function called when edge creation is interrupted in the process | no       | `() => void` |
| `onEdgeCreationPrevented`   | `(request: AddEdgeRequest) => void`                    | Function called when an attempt to create edge is prevented      | no       | `() => void` |

{{< /ref-target >}}

You might also be interested in the <a href="/tutorials/edges-with-remove-button/" target="_blank">Edges with Remove Button</a> tutorial.

<a href="/use-cases/midpoint-edge/" target="_blank" aria-label="Edges with Remove Button">
  <div class="video">
    <video autoplay muted loop>
      <source src="/media/removable-edges.webm">
    </video>
  </div>
</a>
