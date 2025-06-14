---
title: Connectable Ports
---

## Connectable Ports

In some use cases, allowing users to modify graph topology is crucial. Essential
feature for this functionality is providing the ability to add new connections to the graph.

To enable ports, connectable via dragging, call the `enableUserConnectablePorts` method on `CanvasBuilder` instance:

{{< code lang="javascript">}}
const element = document.getElementById('canvas');

const canvas = new CanvasBuilder()
  .setElement(element)
  .enableUserConnectablePorts()
  .build();
{{< /code >}}

{{< use-case title="Connectable ports" src=/use-cases/connectable-ports/ >}}

It is crusial for port to have "grabable" area big enough to actually be grabbed by user, as shown in
the example above.

`enableUserConnectablePorts` method accepts optional configuration.

### Configuration Parameters

| Name                   | Type                                                             | Description                                                                                                            | Required | Default                                    |
|------------------------|------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|----------|--------------------------------------------|
| connectionTypeResolver | <code>(portId) => "direct" \| "reverse" \| null</code>           | Resolves connection type, when edge creation has been initiated. <code>null</code> means that connection is disallowed | no       | <code>() => "direct"</code>                |
| connectionPreprocessor | <code>(request: AddEdgeRequest) => AddEdgeRequest \| null</code> | Applies modification to the edge about to be created. <code>null</code> means that connection is disallowed.           | no       | <code>(request) => request</code>          |
| mouseDownEventVerifier | <code>(event) => boolean</code>                                  | Function to verify if mouse event should initiate connection creation                                                  | no       | <code>(event) => event.button === 0</code> |
| events                 | <span data-ref="events">EventsConfig</span>                      | Handlers for available events                                                                                          | no       | <code>{}</code>                            |

{{< ref-target ref="events">}}

### Events Configuration

| Name               | Type     | Description                                      | Required | Default    |
|--------------------|----------|--------------------------------------------------|----------|------------|
| onAfterEdgeCreated | function | Function to call after a new edge has been added | no       | () => void |

{{< /ref-target >}}

There is a good example of reasonable connection type resolver, which resolves
direct connection when "out" port gets grabbed, and reverses connection when "in" port gets grabbed:

{{< code lang="javascript" >}}
const connectionTypeResolver = (portId) => {
  return portId.endsWith("-out") ? "direct" : "reverse";
};
{{< / code >}}

As for connection preprocessor, you can start with the one, which forbids
duplicated connections:

{{< code lang="javascript" >}}
const connectionPreprocessor = (request) => {
  const existingEdge = canvas.graph.getAllEdgeIds().find((edgeId) => {
    const edge = canvas.graph.getEdge(edgeId);

    return edge.from === request.from && edge.to === request.to;
  });

  return existingEdge === undefined ? request : null;
};
{{< / code >}}
