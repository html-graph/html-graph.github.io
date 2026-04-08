var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var ConnectionCategory = /* @__PURE__ */ ((ConnectionCategory2) => {
  ConnectionCategory2["Line"] = "line";
  ConnectionCategory2["NodeCycle"] = "node-cycle";
  ConnectionCategory2["PortCycle"] = "port-cycle";
  return ConnectionCategory2;
})(ConnectionCategory || {});
const createHost$1 = () => {
  const host = document.createElement("div");
  host.style.width = "100%";
  host.style.height = "100%";
  host.style.position = "relative";
  host.style.overflow = "hidden";
  return host;
};
const createContainer = () => {
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "0";
  container.style.height = "0";
  return container;
};
const prepareNodeElement = (element) => {
  element.style.position = "absolute";
  element.style.top = "0";
  element.style.left = "0";
  element.style.visibility = "hidden";
};
const restoreNodeElement = (element) => {
  element.style.removeProperty("position");
  element.style.removeProperty("top");
  element.style.removeProperty("left");
  element.style.removeProperty("visibility");
  element.style.removeProperty("transform");
};
class CoreHtmlView {
  constructor(graphStore, viewportStore, element) {
    __publicField(this, "host", createHost$1());
    __publicField(this, "container", createContainer());
    __publicField(this, "edgeIdToElementMap", /* @__PURE__ */ new Map());
    __publicField(this, "attachedNodeIds", /* @__PURE__ */ new Set());
    __publicField(this, "applyTransform", () => {
      const m = this.viewportStore.getContentMatrix();
      this.container.style.transform = `matrix(${m.scale}, 0, 0, ${m.scale}, ${m.x}, ${m.y})`;
    });
    this.graphStore = graphStore;
    this.viewportStore = viewportStore;
    this.element = element;
    this.element.appendChild(this.host);
    this.host.appendChild(this.container);
    this.viewportStore.onAfterUpdated.subscribe(this.applyTransform);
  }
  attachNode(nodeId) {
    const node = this.graphStore.getNode(nodeId);
    prepareNodeElement(node.element);
    this.attachedNodeIds.add(nodeId);
    this.container.appendChild(node.element);
    this.updateNodePosition(nodeId);
    this.updateNodePriority(nodeId);
    node.element.style.visibility = "visible";
  }
  detachNode(nodeId) {
    const node = this.graphStore.getNode(nodeId);
    restoreNodeElement(node.element);
    this.container.removeChild(node.element);
    this.attachedNodeIds.delete(nodeId);
  }
  attachEdge(edgeId) {
    const svg = this.graphStore.getEdge(edgeId).payload.shape.svg;
    this.edgeIdToElementMap.set(edgeId, svg);
    this.container.appendChild(svg);
    this.renderEdge(edgeId);
    this.updateEdgePriority(edgeId);
  }
  detachEdge(edgeId) {
    const svg = this.edgeIdToElementMap.get(edgeId);
    this.container.removeChild(svg);
    this.edgeIdToElementMap.delete(edgeId);
  }
  clear() {
    this.edgeIdToElementMap.forEach((_element, edgeId) => {
      this.detachEdge(edgeId);
    });
    this.attachedNodeIds.forEach((nodeId) => {
      this.detachNode(nodeId);
    });
  }
  destroy() {
    this.clear();
    this.viewportStore.onAfterUpdated.unsubscribe(this.applyTransform);
    this.element.removeChild(this.host);
    this.host.removeChild(this.container);
  }
  updateNodePosition(nodeId) {
    const node = this.graphStore.getNode(nodeId);
    const { width, height } = node.element.getBoundingClientRect();
    const viewportScale = this.viewportStore.getViewportMatrix().scale;
    const { payload } = node;
    const center = payload.centerFn(width, height);
    const x = payload.x - viewportScale * center.x;
    const y = payload.y - viewportScale * center.y;
    node.element.style.transform = `translate(${x}px, ${y}px)`;
  }
  updateNodePriority(nodeId) {
    const node = this.graphStore.getNode(nodeId);
    node.element.style.zIndex = `${node.payload.priority}`;
  }
  updateEdgeShape(edgeId) {
    const element = this.edgeIdToElementMap.get(edgeId);
    this.container.removeChild(element);
    const edge = this.graphStore.getEdge(edgeId);
    const svg = edge.payload.shape.svg;
    this.edgeIdToElementMap.set(edgeId, svg);
    this.container.appendChild(svg);
  }
  renderEdge(edgeId) {
    const edge = this.graphStore.getEdge(edgeId);
    const portFrom = this.graphStore.getPort(edge.from);
    const portTo = this.graphStore.getPort(edge.to);
    const rectFrom = portFrom.element.getBoundingClientRect();
    const rectTo = portTo.element.getBoundingClientRect();
    const rectCanvas = this.host.getBoundingClientRect();
    const scale = this.viewportStore.getViewportMatrix().scale;
    const from = this.createEdgeRenderPort(
      portFrom,
      rectFrom,
      rectCanvas,
      scale
    );
    const to = this.createEdgeRenderPort(portTo, rectTo, rectCanvas, scale);
    let category = ConnectionCategory.Line;
    if (portFrom.element === portTo.element) {
      category = ConnectionCategory.PortCycle;
    } else if (portFrom.nodeId === portTo.nodeId) {
      category = ConnectionCategory.NodeCycle;
    }
    edge.payload.shape.render({ from, to, category });
  }
  updateEdgePriority(edgeId) {
    const edge = this.graphStore.getEdge(edgeId);
    edge.payload.shape.svg.style.zIndex = `${edge.payload.priority}`;
  }
  createEdgeRenderPort(port, rectPort, rectCanvas, scale) {
    const contentPoint = this.viewportStore.createContentCoords({
      x: rectPort.left - rectCanvas.left,
      y: rectPort.top - rectCanvas.top
    });
    return {
      x: contentPoint.x,
      y: contentPoint.y,
      width: rectPort.width * scale,
      height: rectPort.height * scale,
      direction: port.payload.direction
    };
  }
}
class RenderingBoxState {
  constructor(graphStore) {
    __publicField(this, "xFrom", Infinity);
    __publicField(this, "yFrom", Infinity);
    __publicField(this, "xTo", Infinity);
    __publicField(this, "yTo", Infinity);
    this.graphStore = graphStore;
  }
  setRenderingBox(renderingBox) {
    this.xFrom = renderingBox.x;
    this.xTo = renderingBox.x + renderingBox.width;
    this.yFrom = renderingBox.y;
    this.yTo = renderingBox.y + renderingBox.height;
  }
  hasNode(nodeId) {
    const payload = this.graphStore.getNode(nodeId).payload;
    const { x, y } = payload;
    return x >= this.xFrom && x <= this.xTo && y >= this.yFrom && y <= this.yTo;
  }
  hasEdge(edgeId) {
    const edge = this.graphStore.getEdge(edgeId);
    const nodeFromId = this.graphStore.getPort(edge.from).nodeId;
    const nodeToId = this.graphStore.getPort(edge.to).nodeId;
    const nodePayloadFrom = this.graphStore.getNode(nodeFromId).payload;
    const nodePayloadTo = this.graphStore.getNode(nodeToId).payload;
    const xFrom = Math.min(nodePayloadFrom.x, nodePayloadTo.x);
    const xTo = Math.max(nodePayloadFrom.x, nodePayloadTo.x);
    const yFrom = Math.min(nodePayloadFrom.y, nodePayloadTo.y);
    const yTo = Math.max(nodePayloadFrom.y, nodePayloadTo.y);
    return xFrom <= this.xTo && xTo >= this.xFrom && yFrom <= this.yTo && yTo >= this.yFrom;
  }
}
class VirtualScrollHtmlView {
  constructor(htmlView, graphStore, trigger, params) {
    __publicField(this, "attachedNodes", /* @__PURE__ */ new Set());
    __publicField(this, "attachedEdges", /* @__PURE__ */ new Set());
    __publicField(this, "renderingBox");
    __publicField(this, "updateViewport", (viewBox) => {
      this.renderingBox.setRenderingBox(viewBox);
      const nodesToAttach = /* @__PURE__ */ new Set();
      const nodesToDetach = /* @__PURE__ */ new Set();
      const edgesToAttach = /* @__PURE__ */ new Set();
      const edgesToDetach = /* @__PURE__ */ new Set();
      this.graphStore.getAllNodeIds().forEach((nodeId) => {
        const isInViewport = this.renderingBox.hasNode(nodeId);
        const isAttached = this.attachedNodes.has(nodeId);
        if (isInViewport && !isAttached) {
          nodesToAttach.add(nodeId);
        } else if (!isInViewport && isAttached) {
          nodesToDetach.add(nodeId);
        }
      });
      this.graphStore.getAllEdgeIds().forEach((edgeId) => {
        const isInViewport = this.renderingBox.hasEdge(edgeId);
        const isAttached = this.attachedEdges.has(edgeId);
        const edge = this.graphStore.getEdge(edgeId);
        const fromNodeId = this.graphStore.getPort(edge.from).nodeId;
        const toNodeId = this.graphStore.getPort(edge.to).nodeId;
        if (isInViewport) {
          if (!this.renderingBox.hasNode(fromNodeId)) {
            nodesToAttach.add(fromNodeId);
            nodesToDetach.delete(fromNodeId);
          }
          if (!this.renderingBox.hasNode(toNodeId)) {
            nodesToAttach.add(toNodeId);
            nodesToDetach.delete(toNodeId);
          }
        }
        if (isInViewport && !isAttached) {
          edgesToAttach.add(edgeId);
        } else if (!isInViewport && isAttached) {
          edgesToDetach.add(edgeId);
        }
      });
      edgesToDetach.forEach((edgeId) => {
        this.handleDetachEdge(edgeId);
      });
      nodesToDetach.forEach((nodeId) => {
        this.handleDetachNode(nodeId);
      });
      nodesToAttach.forEach((nodeId) => {
        if (!this.attachedNodes.has(nodeId)) {
          this.handleAttachNode(nodeId);
        }
      });
      edgesToAttach.forEach((edgeId) => {
        this.handleAttachEdge(edgeId);
      });
    });
    this.htmlView = htmlView;
    this.graphStore = graphStore;
    this.trigger = trigger;
    this.params = params;
    this.renderingBox = new RenderingBoxState(this.graphStore);
    this.trigger.subscribe(this.updateViewport);
  }
  attachNode(nodeId) {
    if (this.renderingBox.hasNode(nodeId)) {
      this.handleAttachNode(nodeId);
    }
  }
  detachNode(nodeId) {
    if (this.attachedNodes.has(nodeId)) {
      this.handleDetachNode(nodeId);
    }
  }
  attachEdge(edgeId) {
    if (!this.renderingBox.hasEdge(edgeId)) {
      return;
    }
    this.attachEdgeEntities(edgeId);
  }
  detachEdge(edgeId) {
    if (this.attachedEdges.has(edgeId)) {
      this.handleDetachEdge(edgeId);
    }
  }
  updateNodePosition(nodeId) {
    if (this.attachedNodes.has(nodeId)) {
      this.htmlView.updateNodePosition(nodeId);
    } else {
      if (this.renderingBox.hasNode(nodeId)) {
        this.handleAttachNode(nodeId);
        this.graphStore.getNodeAdjacentEdgeIds(nodeId).forEach((edgeId) => {
          this.attachEdgeEntities(edgeId);
        });
      }
    }
  }
  updateNodePriority(nodeId) {
    if (this.attachedNodes.has(nodeId)) {
      this.htmlView.updateNodePriority(nodeId);
    }
  }
  updateEdgeShape(edgeId) {
    if (this.attachedEdges.has(edgeId)) {
      this.htmlView.updateEdgeShape(edgeId);
    }
  }
  renderEdge(edgeId) {
    if (this.attachedEdges.has(edgeId)) {
      this.htmlView.renderEdge(edgeId);
    }
  }
  updateEdgePriority(edgeId) {
    if (this.attachedEdges.has(edgeId)) {
      this.htmlView.updateEdgePriority(edgeId);
    }
  }
  clear() {
    this.htmlView.clear();
    this.attachedNodes.clear();
    this.attachedEdges.clear();
  }
  destroy() {
    this.clear();
    this.htmlView.destroy();
    this.trigger.unsubscribe(this.updateViewport);
  }
  attachEdgeEntities(edgeId) {
    const edge = this.graphStore.getEdge(edgeId);
    const nodeFromId = this.graphStore.getPort(edge.from).nodeId;
    const nodeToId = this.graphStore.getPort(edge.to).nodeId;
    if (!this.attachedNodes.has(nodeFromId)) {
      this.handleAttachNode(nodeFromId);
    }
    if (!this.attachedNodes.has(nodeToId)) {
      this.handleAttachNode(nodeToId);
    }
    this.handleAttachEdge(edgeId);
  }
  handleAttachNode(nodeId) {
    this.params.onBeforeNodeAttached(nodeId);
    this.attachedNodes.add(nodeId);
    this.htmlView.attachNode(nodeId);
  }
  handleDetachNode(nodeId) {
    this.htmlView.detachNode(nodeId);
    this.attachedNodes.delete(nodeId);
    this.params.onAfterNodeDetached(nodeId);
  }
  handleAttachEdge(edgeId) {
    this.attachedEdges.add(edgeId);
    this.htmlView.attachEdge(edgeId);
  }
  handleDetachEdge(edgeId) {
    this.htmlView.detachEdge(edgeId);
    this.attachedEdges.delete(edgeId);
  }
}
class LayoutHtmlView {
  constructor(htmlView, graphStore) {
    __publicField(this, "deferredNodes", /* @__PURE__ */ new Set());
    __publicField(this, "deferredEdges", /* @__PURE__ */ new Set());
    this.htmlView = htmlView;
    this.graphStore = graphStore;
  }
  attachNode(nodeId) {
    if (this.isNodeValid(nodeId)) {
      this.htmlView.attachNode(nodeId);
    } else {
      this.deferredNodes.add(nodeId);
    }
  }
  detachNode(nodeId) {
    if (this.deferredNodes.has(nodeId)) {
      this.deferredNodes.delete(nodeId);
    } else {
      this.htmlView.detachNode(nodeId);
    }
  }
  attachEdge(edgeId) {
    if (this.isEdgeValid(edgeId)) {
      this.htmlView.attachEdge(edgeId);
    } else {
      this.deferredEdges.add(edgeId);
    }
  }
  detachEdge(edgeId) {
    if (this.deferredEdges.has(edgeId)) {
      this.deferredEdges.delete(edgeId);
    } else {
      this.htmlView.detachEdge(edgeId);
    }
  }
  updateNodePosition(nodeId) {
    if (this.deferredNodes.has(nodeId)) {
      this.tryAttachNode(nodeId);
    } else {
      this.htmlView.updateNodePosition(nodeId);
    }
  }
  updateNodePriority(nodeId) {
    if (this.deferredNodes.has(nodeId)) {
      this.tryAttachNode(nodeId);
    } else {
      this.htmlView.updateNodePriority(nodeId);
    }
  }
  updateEdgeShape(edgeId) {
    if (this.deferredEdges.has(edgeId)) {
      this.tryAttachEdge(edgeId);
    } else {
      this.htmlView.updateEdgeShape(edgeId);
    }
  }
  renderEdge(edgeId) {
    if (this.deferredEdges.has(edgeId)) {
      this.tryAttachEdge(edgeId);
    } else {
      this.htmlView.renderEdge(edgeId);
    }
  }
  updateEdgePriority(edgeId) {
    if (this.deferredEdges.has(edgeId)) {
      this.tryAttachEdge(edgeId);
    } else {
      this.htmlView.updateEdgePriority(edgeId);
    }
  }
  clear() {
    this.deferredNodes.clear();
    this.deferredEdges.clear();
    this.htmlView.clear();
  }
  destroy() {
    this.htmlView.destroy();
  }
  isNodeValid(nodeId) {
    const node = this.graphStore.getNode(nodeId);
    return !(node.payload.x === null || node.payload.y === null);
  }
  tryAttachNode(nodeId) {
    if (this.isNodeValid(nodeId)) {
      this.deferredNodes.delete(nodeId);
      this.htmlView.attachNode(nodeId);
    }
  }
  isEdgeValid(edgeId) {
    const edge = this.graphStore.getEdge(edgeId);
    const sourcePort = this.graphStore.getPort(edge.from);
    const targetPort = this.graphStore.getPort(edge.to);
    return !(this.deferredNodes.has(sourcePort.nodeId) || this.deferredNodes.has(targetPort.nodeId));
  }
  tryAttachEdge(edgeId) {
    if (this.isEdgeValid(edgeId)) {
      this.deferredEdges.delete(edgeId);
      this.htmlView.attachEdge(edgeId);
    }
  }
}
class EventSubject {
  constructor() {
    __publicField(this, "callbacks", /* @__PURE__ */ new Set());
  }
  subscribe(callback) {
    this.callbacks.add(callback);
  }
  unsubscribe(callback) {
    this.callbacks.delete(callback);
  }
  emit(payload) {
    this.callbacks.forEach((callback) => {
      callback(payload);
    });
  }
}
const createPair = () => {
  const subject = new EventSubject();
  return [subject, subject];
};
class Canvas {
  constructor(graph, viewport, graphController, viewportController) {
    __publicField(this, "beforeDestroyEmitter");
    __publicField(this, "destroyed", false);
    __publicField(this, "onBeforeDestroy");
    this.graph = graph;
    this.viewport = viewport;
    this.graphController = graphController;
    this.viewportController = viewportController;
    [this.beforeDestroyEmitter, this.onBeforeDestroy] = createPair();
  }
  addNode(request) {
    this.graphController.addNode(request);
    return this;
  }
  updateNode(nodeId, request) {
    this.graphController.updateNode(nodeId, request);
    return this;
  }
  removeNode(nodeId) {
    this.graphController.removeNode(nodeId);
    return this;
  }
  markPort(request) {
    this.graphController.markPort(request);
    return this;
  }
  updatePort(portId, request) {
    this.graphController.updatePort(portId, request);
    return this;
  }
  unmarkPort(portId) {
    this.graphController.unmarkPort(portId);
    return this;
  }
  addEdge(request) {
    this.graphController.addEdge(request);
    return this;
  }
  updateEdge(edgeId, request) {
    this.graphController.updateEdge(edgeId, request);
    return this;
  }
  removeEdge(edgeId) {
    this.graphController.removeEdge(edgeId);
    return this;
  }
  clear() {
    this.graphController.clear();
    return this;
  }
  focus(config) {
    this.viewportController.focus(config);
    return this;
  }
  center(target, config) {
    this.viewportController.center(target, config);
    return this;
  }
  patchViewportMatrix(request) {
    this.viewportController.patchViewportMatrix(request);
    return this;
  }
  patchContentMatrix(request) {
    this.viewportController.patchContentMatrix(request);
    return this;
  }
  destroy() {
    if (this.destroyed) {
      return;
    }
    this.destroyed = true;
    this.beforeDestroyEmitter.emit();
    this.graphController.destroy();
    this.viewportController.destroy();
  }
}
class OneToManyCollection {
  constructor() {
    __publicField(this, "singleToMultiMap", /* @__PURE__ */ new Map());
    __publicField(this, "multiToSingleMap", /* @__PURE__ */ new Map());
  }
  addRecord(single, multi) {
    const multiValue = this.singleToMultiMap.get(single);
    if (multiValue === void 0) {
      this.singleToMultiMap.set(single, /* @__PURE__ */ new Set([multi]));
    } else {
      multiValue.add(multi);
    }
    this.multiToSingleMap.set(multi, single);
  }
  getMultiBySingle(single) {
    const set = this.singleToMultiMap.get(single) ?? /* @__PURE__ */ new Set();
    return Array.from(set.values());
  }
  removeByMulti(multi) {
    const single = this.multiToSingleMap.get(multi);
    const set = this.singleToMultiMap.get(single);
    set.delete(multi);
    if (set.size === 0) {
      this.singleToMultiMap.delete(single);
    }
    this.multiToSingleMap.delete(multi);
  }
  getByMulti(multi) {
    return this.multiToSingleMap.get(multi);
  }
  removeBySingle(single) {
    const set = this.singleToMultiMap.get(single);
    set.forEach((multi) => {
      this.multiToSingleMap.delete(multi);
    });
    this.singleToMultiMap.delete(single);
  }
  clear() {
    this.singleToMultiMap.clear();
    this.multiToSingleMap.clear();
  }
  forEachSingle(callback) {
    this.singleToMultiMap.forEach((_multi, single) => {
      callback(single);
    });
  }
  hasSingle(single) {
    return this.singleToMultiMap.get(single) !== void 0;
  }
  hasMulti(multi) {
    return this.multiToSingleMap.get(multi) !== void 0;
  }
}
class CanvasError extends Error {
  constructor() {
    super(...arguments);
    __publicField(this, "name", "CanvasError");
  }
}
const canvasErrorText = Object.freeze({
  accessNonexistingNode: (nodeId) => `Failed to access node with ID ${JSON.stringify(nodeId)} because it does not exist`,
  addNodeWithExistingId: (nodeId) => `Failed to add node with ID ${JSON.stringify(nodeId)} because a node with this ID already exists`,
  addNodeWithElementInUse: (nodeId, useNodeId) => `Failed to add node with ID ${JSON.stringify(nodeId)} because its HTML element is already attached to node with ID ${JSON.stringify(useNodeId)}`,
  updateNonexistentNode: (nodeId) => `Failed to update node with ID ${JSON.stringify(nodeId)} because it does not exist`,
  removeNonexistentNode: (nodeId) => `Failed to remove node with ID ${JSON.stringify(nodeId)} because it does not exist`,
  accessNonexistentPort: (portId) => `Failed to access port with ID ${JSON.stringify(portId)} because it does not exist`,
  addPortWithExistingId: (portId) => `Failed to add port with ID ${JSON.stringify(portId)} because a port with this ID already exists`,
  addPortToNonexistentNode: (portId, nodeId) => `Failed to add port with ID ${JSON.stringify(portId)} to node with ID ${JSON.stringify(nodeId)} because the node does not exist`,
  updateNonexistentPort: (portId) => `Failed to update port with ID ${JSON.stringify(portId)} because it does not exist`,
  accessPortsOfNonexistentNode: (nodeId) => `Failed to access ports of node with ID ${JSON.stringify(nodeId)} because the node does not exist`,
  removeNonexistentPort: (portId) => `Failed to remove port with ID ${JSON.stringify(portId)} because it does not exist`,
  accessNonexistentEdge: (edgeId) => `Failed to access edge with ID ${JSON.stringify(edgeId)} because it does not exist`,
  addEdgeWithExistingId: (edgeId) => `Failed to add edge with ID ${JSON.stringify(edgeId)} because an edge with this ID already exists`,
  addEdgeFromNonexistentPort: (edgeId, portId) => `Failed to add edge with ID ${JSON.stringify(edgeId)} from port with ID ${JSON.stringify(portId)} because the port does not exist`,
  addEdgeToNonexistentPort: (edgeId, portId) => `Failed to add edge with ID ${JSON.stringify(edgeId)} to port with ID ${JSON.stringify(portId)} because the port does not exist`,
  updateNonexistentEdge: (edgeId) => `Failed to update edge with ID ${JSON.stringify(edgeId)} because it does not exist`,
  updateNonexistentEdgeSource: (edgeId, portId) => `Failed to update source of edge with ID ${JSON.stringify(edgeId)} because source port with ID ${JSON.stringify(portId)} does not exist`,
  updateNonexistentEdgeTarget: (edgeId, portId) => `Failed to update target of edge with ID ${JSON.stringify(edgeId)} because target port with ID ${JSON.stringify(portId)} does not exist`,
  removeNonexistentEdge: (edgeId) => `Failed to remove edge with ID ${JSON.stringify(edgeId)} because it does not exist`,
  accessEdgesForNonexistentPort: (portId) => `Failed to access edges for port with ID ${JSON.stringify(portId)} because the port does not exist`
});
class GraphStore {
  constructor() {
    __publicField(this, "nodes", /* @__PURE__ */ new Map());
    __publicField(this, "ports", /* @__PURE__ */ new Map());
    __publicField(this, "edges", /* @__PURE__ */ new Map());
    __publicField(this, "nodesElementsMap", /* @__PURE__ */ new Map());
    __publicField(this, "portIncomingEdges", /* @__PURE__ */ new Map());
    __publicField(this, "portOutgoingEdges", /* @__PURE__ */ new Map());
    __publicField(this, "portCycleEdges", /* @__PURE__ */ new Map());
    __publicField(this, "elementPorts", new OneToManyCollection());
    __publicField(this, "afterNodeAddedEmitter");
    __publicField(this, "onAfterNodeAdded");
    __publicField(this, "afterNodeUpdatedEmitter");
    __publicField(this, "onAfterNodeUpdated");
    __publicField(this, "afterNodePriorityUpdatedEmitter");
    __publicField(this, "onAfterNodePriorityUpdated");
    __publicField(this, "beforeNodeRemovedEmitter");
    __publicField(this, "onBeforeNodeRemoved");
    __publicField(this, "afterPortAddedEmitter");
    __publicField(this, "onAfterPortAdded");
    __publicField(this, "afterPortUpdatedEmitter");
    __publicField(this, "onAfterPortUpdated");
    __publicField(this, "beforePortRemovedEmitter");
    __publicField(this, "onBeforePortRemoved");
    __publicField(this, "afterEdgeAddedEmitter");
    __publicField(this, "onAfterEdgeAdded");
    __publicField(this, "afterEdgeShapeUpdatedEmitter");
    __publicField(this, "onAfterEdgeShapeUpdated");
    __publicField(this, "afterEdgeUpdatedEmitter");
    __publicField(this, "onAfterEdgeUpdated");
    __publicField(this, "afterEdgePriorityUpdatedEmitter");
    __publicField(this, "onAfterEdgePriorityUpdated");
    __publicField(this, "beforeEdgeRemovedEmitter");
    __publicField(this, "onBeforeEdgeRemoved");
    __publicField(this, "beforeClearEmitter");
    __publicField(this, "onBeforeClear");
    [this.afterNodeAddedEmitter, this.onAfterNodeAdded] = createPair();
    [this.afterNodeUpdatedEmitter, this.onAfterNodeUpdated] = createPair();
    [this.afterNodePriorityUpdatedEmitter, this.onAfterNodePriorityUpdated] = createPair();
    [this.beforeNodeRemovedEmitter, this.onBeforeNodeRemoved] = createPair();
    [this.afterPortAddedEmitter, this.onAfterPortAdded] = createPair();
    [this.afterPortUpdatedEmitter, this.onAfterPortUpdated] = createPair();
    [this.beforePortRemovedEmitter, this.onBeforePortRemoved] = createPair();
    [this.afterEdgeAddedEmitter, this.onAfterEdgeAdded] = createPair();
    [this.afterEdgeShapeUpdatedEmitter, this.onAfterEdgeShapeUpdated] = createPair();
    [this.afterEdgeUpdatedEmitter, this.onAfterEdgeUpdated] = createPair();
    [this.afterEdgePriorityUpdatedEmitter, this.onAfterEdgePriorityUpdated] = createPair();
    [this.beforeEdgeRemovedEmitter, this.onBeforeEdgeRemoved] = createPair();
    [this.beforeClearEmitter, this.onBeforeClear] = createPair();
  }
  hasNode(nodeId) {
    return this.nodes.has(nodeId);
  }
  getNode(nodeId) {
    const node = this.nodes.get(nodeId);
    if (node === void 0) {
      throw new CanvasError(canvasErrorText.accessNonexistingNode(nodeId));
    }
    return node;
  }
  addNode(request) {
    if (this.hasNode(request.id)) {
      throw new CanvasError(canvasErrorText.addNodeWithExistingId(request.id));
    }
    const elementNodeId = this.findNodeIdByElement(request.element);
    if (elementNodeId !== void 0) {
      throw new CanvasError(
        canvasErrorText.addNodeWithElementInUse(request.id, elementNodeId)
      );
    }
    const ports = /* @__PURE__ */ new Map();
    const node = {
      element: request.element,
      payload: {
        x: request.x,
        y: request.y,
        centerFn: request.centerFn,
        priority: request.priority
      },
      ports
    };
    this.nodes.set(request.id, node);
    this.nodesElementsMap.set(request.element, request.id);
    this.afterNodeAddedEmitter.emit(request.id);
  }
  getAllNodeIds() {
    return Array.from(this.nodes.keys());
  }
  findNodeIdByElement(element) {
    return this.nodesElementsMap.get(element);
  }
  updateNode(nodeId, request) {
    if (!this.hasNode(nodeId)) {
      throw new CanvasError(canvasErrorText.updateNonexistentNode(nodeId));
    }
    const { payload } = this.nodes.get(nodeId);
    payload.x = request.x ?? payload.x;
    payload.y = request.y ?? payload.y;
    payload.centerFn = request.centerFn ?? payload.centerFn;
    if (request.priority !== void 0) {
      payload.priority = request.priority;
      this.afterNodePriorityUpdatedEmitter.emit(nodeId);
    }
    this.afterNodeUpdatedEmitter.emit(nodeId);
  }
  removeNode(nodeId) {
    if (!this.hasNode(nodeId)) {
      throw new CanvasError(canvasErrorText.removeNonexistentNode(nodeId));
    }
    this.beforeNodeRemovedEmitter.emit(nodeId);
    const node = this.getNode(nodeId);
    this.nodesElementsMap.delete(node.element);
    this.nodes.delete(nodeId);
  }
  hasPort(portId) {
    return this.ports.has(portId);
  }
  getPort(portId) {
    const port = this.ports.get(portId);
    if (port === void 0) {
      throw new CanvasError(canvasErrorText.accessNonexistentPort(portId));
    }
    return port;
  }
  addPort(request) {
    if (this.hasPort(request.id)) {
      throw new CanvasError(canvasErrorText.addPortWithExistingId(request.id));
    }
    if (!this.hasNode(request.nodeId)) {
      throw new CanvasError(
        canvasErrorText.addPortToNonexistentNode(request.id, request.nodeId)
      );
    }
    this.ports.set(request.id, {
      element: request.element,
      payload: {
        direction: request.direction
      },
      nodeId: request.nodeId
    });
    this.elementPorts.addRecord(request.element, request.id);
    this.portCycleEdges.set(request.id, /* @__PURE__ */ new Set());
    this.portIncomingEdges.set(request.id, /* @__PURE__ */ new Set());
    this.portOutgoingEdges.set(request.id, /* @__PURE__ */ new Set());
    this.getNode(request.nodeId).ports.set(request.id, request.element);
    this.afterPortAddedEmitter.emit(request.id);
  }
  updatePort(portId, request) {
    if (!this.hasPort(portId)) {
      throw new CanvasError(canvasErrorText.updateNonexistentPort(portId));
    }
    const payload = this.getPort(portId).payload;
    payload.direction = request.direction ?? payload.direction;
    this.afterPortUpdatedEmitter.emit(portId);
  }
  getAllPortIds() {
    return Array.from(this.ports.keys());
  }
  findPortIdsByElement(element) {
    return this.elementPorts.getMultiBySingle(element);
  }
  getNodePortIds(nodeId) {
    const node = this.nodes.get(nodeId);
    if (node === void 0) {
      throw new CanvasError(
        canvasErrorText.accessPortsOfNonexistentNode(nodeId)
      );
    }
    return Array.from(node.ports.keys());
  }
  removePort(portId) {
    if (!this.hasPort(portId)) {
      throw new CanvasError(canvasErrorText.removeNonexistentPort(portId));
    }
    const nodeId = this.getPort(portId).nodeId;
    this.beforePortRemovedEmitter.emit(portId);
    this.getNode(nodeId).ports.delete(portId);
    this.ports.delete(portId);
    this.elementPorts.removeByMulti(portId);
  }
  hasEdge(edgeId) {
    return this.edges.has(edgeId);
  }
  getEdge(edgeId) {
    const edge = this.edges.get(edgeId);
    if (edge === void 0) {
      throw new CanvasError(canvasErrorText.accessNonexistentEdge(edgeId));
    }
    return edge;
  }
  addEdge(request) {
    if (this.hasEdge(request.id)) {
      throw new CanvasError(canvasErrorText.addEdgeWithExistingId(request.id));
    }
    if (!this.hasPort(request.from)) {
      throw new CanvasError(
        canvasErrorText.addEdgeFromNonexistentPort(request.id, request.from)
      );
    }
    if (!this.hasPort(request.to)) {
      throw new CanvasError(
        canvasErrorText.addEdgeToNonexistentPort(request.id, request.to)
      );
    }
    this.addEdgeInternal(request);
    this.afterEdgeAddedEmitter.emit(request.id);
  }
  updateEdge(edgeId, request) {
    if (!this.hasEdge(edgeId)) {
      throw new CanvasError(canvasErrorText.updateNonexistentEdge(edgeId));
    }
    if (request.from !== void 0 || request.to !== void 0) {
      if (request.from !== void 0 && !this.hasPort(request.from)) {
        throw new CanvasError(
          canvasErrorText.updateNonexistentEdgeSource(edgeId, request.from)
        );
      }
      if (request.to !== void 0 && !this.hasPort(request.to)) {
        throw new CanvasError(
          canvasErrorText.updateNonexistentEdgeTarget(edgeId, request.to)
        );
      }
      const edge2 = this.getEdge(edgeId);
      const payload = edge2.payload;
      this.removeEdgeInternal(edgeId);
      this.addEdgeInternal({
        id: edgeId,
        from: request.from ?? edge2.from,
        to: request.to ?? edge2.to,
        shape: payload.shape,
        priority: payload.priority
      });
    }
    const edge = this.edges.get(edgeId);
    if (request.shape !== void 0) {
      edge.payload.shape = request.shape;
      this.afterEdgeShapeUpdatedEmitter.emit(edgeId);
    }
    if (request.priority !== void 0) {
      edge.payload.priority = request.priority;
      this.afterEdgePriorityUpdatedEmitter.emit(edgeId);
    }
    this.afterEdgeUpdatedEmitter.emit(edgeId);
  }
  getAllEdgeIds() {
    return Array.from(this.edges.keys());
  }
  removeEdge(edgeId) {
    if (!this.hasEdge(edgeId)) {
      throw new CanvasError(canvasErrorText.removeNonexistentEdge(edgeId));
    }
    this.beforeEdgeRemovedEmitter.emit(edgeId);
    this.removeEdgeInternal(edgeId);
  }
  clear() {
    this.beforeClearEmitter.emit();
    this.portIncomingEdges.clear();
    this.portOutgoingEdges.clear();
    this.portCycleEdges.clear();
    this.elementPorts.clear();
    this.nodesElementsMap.clear();
    this.edges.clear();
    this.ports.clear();
    this.nodes.clear();
  }
  getPortIncomingEdgeIds(portId) {
    const edgeIds = this.portIncomingEdges.get(portId);
    if (edgeIds === void 0) {
      throw new CanvasError(
        canvasErrorText.accessEdgesForNonexistentPort(portId)
      );
    }
    return Array.from(edgeIds);
  }
  getPortOutgoingEdgeIds(portId) {
    const edgeIds = this.portOutgoingEdges.get(portId);
    if (edgeIds === void 0) {
      throw new CanvasError(
        canvasErrorText.accessEdgesForNonexistentPort(portId)
      );
    }
    return Array.from(edgeIds);
  }
  getPortCycleEdgeIds(portId) {
    const edgeIds = this.portCycleEdges.get(portId);
    if (edgeIds === void 0) {
      throw new CanvasError(
        canvasErrorText.accessEdgesForNonexistentPort(portId)
      );
    }
    return Array.from(edgeIds);
  }
  getPortAdjacentEdgeIds(portId) {
    return [
      ...this.getPortIncomingEdgeIds(portId),
      ...this.getPortOutgoingEdgeIds(portId),
      ...this.getPortCycleEdgeIds(portId)
    ];
  }
  getNodeIncomingEdgeIds(nodeId) {
    const ports = Array.from(this.getNode(nodeId).ports.keys());
    const res = [];
    ports.forEach((portId) => {
      this.getPortIncomingEdgeIds(portId).filter((edgeId) => {
        const edge = this.getEdge(edgeId);
        const sourcePort = this.getPort(edge.from);
        return sourcePort.nodeId !== nodeId;
      }).forEach((edgeId) => {
        res.push(edgeId);
      });
    });
    return res;
  }
  getNodeOutgoingEdgeIds(nodeId) {
    const ports = Array.from(this.getNode(nodeId).ports.keys());
    const res = [];
    ports.forEach((portId) => {
      this.getPortOutgoingEdgeIds(portId).filter((edgeId) => {
        const edge = this.getEdge(edgeId);
        const targetPort = this.getPort(edge.to);
        return targetPort.nodeId !== nodeId;
      }).forEach((edgeId) => {
        res.push(edgeId);
      });
    });
    return res;
  }
  getNodeCycleEdgeIds(nodeId) {
    const ports = Array.from(this.getNode(nodeId).ports.keys());
    const res = [];
    ports.forEach((portId) => {
      this.getPortCycleEdgeIds(portId).forEach((edgeId) => {
        res.push(edgeId);
      });
      this.getPortIncomingEdgeIds(portId).filter((edgeId) => {
        const edge = this.getEdge(edgeId);
        const targetPort = this.getPort(edge.to);
        return targetPort.nodeId === nodeId;
      }).forEach((edgeId) => {
        res.push(edgeId);
      });
    });
    return res;
  }
  getNodeAdjacentEdgeIds(nodeId) {
    const ports = Array.from(this.getNode(nodeId).ports.keys());
    const res = [];
    ports.forEach((portId) => {
      this.getPortIncomingEdgeIds(portId).forEach((edgeId) => {
        res.push(edgeId);
      });
      this.getPortOutgoingEdgeIds(portId).forEach((edgeId) => {
        res.push(edgeId);
      });
      this.getPortCycleEdgeIds(portId).forEach((edgeId) => {
        res.push(edgeId);
      });
    });
    return res;
  }
  addEdgeInternal(request) {
    this.edges.set(request.id, {
      from: request.from,
      to: request.to,
      payload: {
        shape: request.shape,
        priority: request.priority
      }
    });
    if (request.from !== request.to) {
      this.portOutgoingEdges.get(request.from).add(request.id);
      this.portIncomingEdges.get(request.to).add(request.id);
    } else {
      this.portCycleEdges.get(request.from).add(request.id);
    }
  }
  removeEdgeInternal(edgeId) {
    const { from, to } = this.getEdge(edgeId);
    this.portCycleEdges.get(from).delete(edgeId);
    this.portCycleEdges.get(to).delete(edgeId);
    this.portIncomingEdges.get(from).delete(edgeId);
    this.portIncomingEdges.get(to).delete(edgeId);
    this.portOutgoingEdges.get(from).delete(edgeId);
    this.portOutgoingEdges.get(to).delete(edgeId);
    this.edges.delete(edgeId);
  }
}
const calculateReverseMatrix = (matrix) => {
  return {
    scale: 1 / matrix.scale,
    x: -matrix.x / matrix.scale,
    y: -matrix.y / matrix.scale
  };
};
const initialMatrix = {
  scale: 1,
  x: 0,
  y: 0
};
const transformPoint = (matrix, point) => {
  return {
    x: matrix.scale * point.x + matrix.x,
    y: matrix.scale * point.y + matrix.y
  };
};
class ViewportStore {
  constructor(host) {
    __publicField(this, "viewportMatrix", initialMatrix);
    __publicField(this, "contentMatrix", initialMatrix);
    __publicField(this, "beforeUpdateEmitter");
    __publicField(this, "onBeforeUpdated");
    __publicField(this, "afterUpdateEmitter");
    __publicField(this, "onAfterUpdated");
    __publicField(this, "afterResizeEmitter");
    __publicField(this, "onAfterResize");
    __publicField(this, "observer", new ResizeObserver(() => {
      this.afterResizeEmitter.emit();
    }));
    this.host = host;
    [this.afterUpdateEmitter, this.onAfterUpdated] = createPair();
    [this.beforeUpdateEmitter, this.onBeforeUpdated] = createPair();
    [this.afterResizeEmitter, this.onAfterResize] = createPair();
    this.observer.observe(this.host);
  }
  getViewportMatrix() {
    return this.viewportMatrix;
  }
  getContentMatrix() {
    return this.contentMatrix;
  }
  patchViewportMatrix(matrix) {
    this.viewportMatrix = {
      scale: matrix.scale ?? this.viewportMatrix.scale,
      x: matrix.x ?? this.viewportMatrix.x,
      y: matrix.y ?? this.viewportMatrix.y
    };
    this.beforeUpdateEmitter.emit();
    this.contentMatrix = calculateReverseMatrix(this.viewportMatrix);
    this.afterUpdateEmitter.emit();
  }
  patchContentMatrix(matrix) {
    this.contentMatrix = {
      scale: matrix.scale ?? this.contentMatrix.scale,
      x: matrix.x ?? this.contentMatrix.x,
      y: matrix.y ?? this.contentMatrix.y
    };
    this.beforeUpdateEmitter.emit();
    this.viewportMatrix = calculateReverseMatrix(this.contentMatrix);
    this.afterUpdateEmitter.emit();
  }
  getDimensions() {
    const { width, height } = this.host.getBoundingClientRect();
    return { width, height };
  }
  createContentCoords(viewportCoords) {
    return transformPoint(this.viewportMatrix, viewportCoords);
  }
  createViewportCoords(contentCoords) {
    return transformPoint(this.contentMatrix, contentCoords);
  }
  destroy() {
    this.observer.disconnect();
  }
}
class NodeResizeReactiveEdgesConfigurator {
  constructor(canvas) {
    __publicField(this, "elementToNodeId", /* @__PURE__ */ new Map());
    __publicField(this, "nodesResizeObserver");
    __publicField(this, "onAfterNodeAdded", (nodeId) => {
      const node = this.canvas.graph.getNode(nodeId);
      this.elementToNodeId.set(node.element, nodeId);
      this.nodesResizeObserver.observe(node.element);
    });
    __publicField(this, "onBeforeNodeRemoved", (nodeId) => {
      const node = this.canvas.graph.getNode(nodeId);
      this.elementToNodeId.delete(node.element);
      this.nodesResizeObserver.unobserve(node.element);
    });
    __publicField(this, "reset", () => {
      this.nodesResizeObserver.disconnect();
      this.elementToNodeId.clear();
    });
    __publicField(this, "revert", () => {
      this.reset();
    });
    this.canvas = canvas;
    this.nodesResizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target;
        this.handleNodeResize(element);
      });
    });
    this.canvas.graph.onAfterNodeAdded.subscribe(this.onAfterNodeAdded);
    this.canvas.graph.onBeforeNodeRemoved.subscribe(this.onBeforeNodeRemoved);
    this.canvas.graph.onBeforeClear.subscribe(this.reset);
    this.canvas.onBeforeDestroy.subscribe(this.revert);
  }
  static configure(canvas) {
    new NodeResizeReactiveEdgesConfigurator(canvas);
  }
  handleNodeResize(element) {
    const nodeId = this.elementToNodeId.get(element);
    this.canvas.updateNode(nodeId);
  }
}
const isPointOnElement = (element, px, py) => {
  const { x, y, width, height } = element.getBoundingClientRect();
  return px >= x && px <= x + width && py >= y && py <= y + height;
};
const isPointOnWindow = (win, px, py) => {
  return px >= 0 && px <= win.innerWidth && py >= 0 && py <= win.innerHeight;
};
class PointInsideVerifier {
  constructor(element, win) {
    this.element = element;
    this.win = win;
  }
  verify(x, y) {
    return isPointOnElement(this.element, x, y) && isPointOnWindow(this.win, x, y);
  }
}
const setCursor = (element, type) => {
  if (type !== null) {
    element.style.cursor = type;
  } else {
    element.style.removeProperty("cursor");
  }
};
const createAddNodeOverlayRequest = (payload) => {
  const element = document.createElement("div");
  return {
    id: payload.overlayNodeId,
    element,
    x: payload.portCoords.x,
    y: payload.portCoords.y,
    ports: [
      {
        id: payload.overlayNodeId,
        element,
        direction: payload.portDirection
      }
    ]
  };
};
const findPortForElement = (graph, element) => {
  let elementBuf = element;
  while (elementBuf !== null) {
    const portId = graph.findPortIdsByElement(elementBuf)[0] ?? null;
    if (portId !== null) {
      return {
        status: "portFound",
        portId
      };
    }
    const nodeId = graph.findNodeIdByElement(elementBuf);
    if (nodeId !== void 0) {
      return {
        status: "nodeEncountered"
      };
    }
    elementBuf = elementBuf.parentElement;
  }
  return {
    status: "notFound"
  };
};
function* getElementsAtPoint(root, point) {
  const elements = root.elementsFromPoint(point.x, point.y);
  for (const element of elements) {
    if (element.shadowRoot !== null) {
      const shadowElements = getElementsAtPoint(element.shadowRoot, point);
      for (const shadowElement of shadowElements) {
        yield shadowElement;
      }
    }
    yield element;
  }
}
const findPortAtPoint = (graph, point) => {
  const elements = getElementsAtPoint(document, point);
  for (const element of elements) {
    const result = findPortForElement(graph, element);
    if (result.status === "portFound") {
      return result.portId;
    }
    if (result.status === "nodeEncountered") {
      return null;
    }
  }
  return null;
};
var OverlayId = /* @__PURE__ */ ((OverlayId2) => {
  OverlayId2["StaticNodeId"] = "static";
  OverlayId2["DraggingNodeId"] = "dragging";
  OverlayId2["EdgeId"] = "edge";
  return OverlayId2;
})(OverlayId || {});
const standardCenterFn = (w, h) => ({
  x: w / 2,
  y: h / 2
});
const createRotatedPoint = (point, vector, center) => {
  return {
    x: vector.x * point.x - vector.y * point.y + ((1 - vector.x) * center.x + vector.y * center.y),
    y: vector.y * point.x + vector.x * point.y + ((1 - vector.x) * center.y - vector.y * center.x)
  };
};
const createEdgeRectangle = (source, target, padding) => {
  const from = {
    x: source.x + source.width / 2,
    y: source.y + source.height / 2
  };
  const to = {
    x: target.x + target.width / 2,
    y: target.y + target.height / 2
  };
  const x = Math.min(from.x, to.x) - padding;
  const y = Math.min(from.y, to.y) - padding;
  const doublePadding = 2 * padding;
  const width = Math.abs(to.x - from.x) + doublePadding;
  const height = Math.abs(to.y - from.y) + doublePadding;
  return {
    x,
    y,
    width,
    height,
    from: { x: from.x - x, y: from.y - y },
    to: { x: to.x - x, y: to.y - y }
  };
};
class BezierEdgePath {
  constructor(params) {
    __publicField(this, "path");
    __publicField(this, "midpoint");
    const {
      from,
      to,
      arrowLength,
      fromDir,
      toDir,
      curvature,
      hasSourceArrow,
      hasTargetArrow
    } = params;
    const centerX = (from.x + to.x) / 2;
    const centerY = (from.y + to.y) / 2;
    this.midpoint = { x: centerX, y: centerY };
    const begin = createRotatedPoint(
      { x: from.x + arrowLength, y: from.y },
      fromDir,
      from
    );
    const end = createRotatedPoint(
      { x: to.x - arrowLength, y: to.y },
      toDir,
      to
    );
    const bezierBegin = {
      x: begin.x + fromDir.x * curvature,
      y: begin.y + fromDir.y * curvature
    };
    const bezierEnd = {
      x: end.x - toDir.x * curvature,
      y: end.y - toDir.y * curvature
    };
    const curve = `M ${begin.x} ${begin.y} C ${bezierBegin.x} ${bezierBegin.y}, ${bezierEnd.x} ${bezierEnd.y}, ${end.x} ${end.y}`;
    const preLine = hasSourceArrow ? "" : `M ${from.x} ${from.y} L ${begin.x} ${begin.y} `;
    const postLine = hasTargetArrow ? "" : ` M ${end.x} ${end.y} L ${to.x} ${to.y}`;
    this.path = `${preLine}${curve}${postLine}`;
  }
}
class DetourBezierEdgePath {
  constructor(params) {
    __publicField(this, "path");
    __publicField(this, "midpoint");
    const {
      hasSourceArrow,
      hasTargetArrow,
      curvature,
      fromDir,
      toDir,
      detourDir,
      from,
      to,
      arrowLength,
      detourDistance
    } = params;
    const beginArrow = hasSourceArrow ? createRotatedPoint(
      { x: from.x + arrowLength, y: from.y },
      fromDir,
      from
    ) : from;
    const endArrow = hasTargetArrow ? createRotatedPoint(
      {
        x: to.x - arrowLength,
        y: to.y
      },
      toDir,
      to
    ) : to;
    const detourX = Math.cos(detourDir) * detourDistance;
    const detourY = Math.sin(detourDir) * detourDistance;
    const beginLine1 = createRotatedPoint(
      { x: from.x + arrowLength, y: from.y },
      fromDir,
      from
    );
    const beginLine2 = {
      x: beginLine1.x + detourX,
      y: beginLine1.y + detourY
    };
    const endLine1 = createRotatedPoint(
      { x: to.x - arrowLength, y: to.y },
      toDir,
      to
    );
    const endLine2 = {
      x: endLine1.x + detourX,
      y: endLine1.y + detourY
    };
    const center = {
      x: (beginLine2.x + endLine2.x) / 2,
      y: (beginLine2.y + endLine2.y) / 2
    };
    const beginCurve1 = {
      x: beginLine1.x + curvature * fromDir.x,
      y: beginLine1.y + curvature * fromDir.y
    };
    const endCurve1 = {
      x: endLine1.x - curvature * toDir.x,
      y: endLine1.y - curvature * toDir.y
    };
    const beginCurve2 = {
      x: beginLine1.x + detourX,
      y: beginLine1.y + detourY
    };
    const endCurve2 = {
      x: endLine1.x + detourX,
      y: endLine1.y + detourY
    };
    this.path = [
      `M ${beginArrow.x} ${beginArrow.y}`,
      `L ${beginLine1.x} ${beginLine1.y}`,
      `C ${beginCurve1.x} ${beginCurve1.y} ${beginCurve2.x} ${beginCurve2.y} ${center.x} ${center.y}`,
      `C ${endCurve2.x} ${endCurve2.y} ${endCurve1.x} ${endCurve1.y} ${endLine1.x} ${endLine1.y}`,
      `L ${endArrow.x} ${endArrow.y}`
    ].join(" ");
    this.midpoint = center;
  }
}
const cssVariables = Object.freeze({
  edgeColor: "--edge-color"
});
const createEdgeSvg = (color) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.style.pointerEvents = "none";
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.overflow = "visible";
  svg.style.setProperty(cssVariables.edgeColor, color);
  return svg;
};
const createEdgePath = (width) => {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("stroke", `var(${cssVariables.edgeColor})`);
  path.setAttribute("stroke-width", `${width}`);
  path.setAttribute("fill", "none");
  return path;
};
const createEdgeArrow$1 = () => {
  const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
  arrow.setAttribute("fill", `var(${cssVariables.edgeColor})`);
  return arrow;
};
const setSvgRectangle = (svg, params) => {
  svg.style.transform = `translate(${params.x}px, ${params.y}px)`;
  svg.style.width = `${params.width}px`;
  svg.style.height = `${params.height}px`;
};
const createRoundedPath = (path, roundness) => {
  const parts = [];
  if (path.length > 0) {
    parts.push(`M ${path[0].x} ${path[0].y}`);
  }
  if (path.length === 2) {
    parts.push(`L ${path[1].x} ${path[1].y}`);
  }
  if (path.length > 2) {
    const last = path.length - 1;
    let dxNext = 0;
    let dyNext = 0;
    let distanceNext = 0;
    path.forEach((point, i) => {
      let dxPrev = 0;
      let dyPrev = 0;
      let distancePrev = 0;
      const isNotFirst = i > 0;
      const isNotLast = i < last;
      const isMediate = isNotFirst && isNotLast;
      if (isNotFirst) {
        dxPrev = -dxNext;
        dyPrev = -dyNext;
        distancePrev = distanceNext;
      }
      if (isNotLast) {
        const nextPoint = path[i + 1];
        dxNext = nextPoint.x - point.x;
        dyNext = nextPoint.y - point.y;
        distanceNext = Math.sqrt(dxNext * dxNext + dyNext * dyNext);
      }
      const rNext = isMediate ? roundness : 0;
      const ratioNext = distanceNext !== 0 ? Math.min(rNext / distanceNext, i < last - 1 ? 0.5 : 1) : 0;
      const njp = isMediate ? { x: point.x + dxNext * ratioNext, y: point.y + dyNext * ratioNext } : point;
      const rPrev = isMediate ? roundness : 0;
      const ratioPrev = distancePrev !== 0 ? Math.min(rPrev / distancePrev, i > 1 ? 0.5 : 1) : 0;
      const pjp = isMediate ? { x: point.x + dxPrev * ratioPrev, y: point.y + dyPrev * ratioPrev } : point;
      if (i > 0) {
        parts.push(`L ${pjp.x} ${pjp.y}`);
      }
      if (isMediate) {
        parts.push(
          `C ${point.x} ${point.y} ${point.x} ${point.y} ${njp.x} ${njp.y}`
        );
      }
    });
  }
  return parts.join(" ");
};
const createLine$1 = (from, to) => {
  const horizontalLineDir = to.x - from.x >= 0;
  const fromPortDir = from.dirX >= 0;
  const toPortDir = to.dirX >= 0;
  const isSameDirPorts = fromPortDir === toPortDir;
  if (isSameDirPorts) {
    const isSameDirLine = fromPortDir === horizontalLineDir;
    const centerX = (from.x + to.x) / 2;
    const centerY2 = (from.y + to.y) / 2;
    const midpoint = { x: centerX, y: centerY2 };
    if (isSameDirLine) {
      return {
        points: [
          { x: from.x, y: from.y },
          { x: midpoint.x, y: from.y },
          { x: midpoint.x, y: to.y },
          { x: to.x, y: to.y }
        ],
        midpoint
      };
    }
    return {
      points: [
        { x: from.x, y: from.y },
        { x: from.x, y: midpoint.y },
        { x: to.x, y: midpoint.y },
        { x: to.x, y: to.y }
      ],
      midpoint
    };
  }
  const isSameSourceDir = fromPortDir === horizontalLineDir;
  const centerY = (from.y + to.y) / 2;
  if (isSameSourceDir) {
    const joint2 = { x: to.x, y: from.y };
    return {
      points: [{ x: from.x, y: from.y }, joint2, { x: to.x, y: to.y }],
      midpoint: { x: joint2.x, y: centerY }
    };
  }
  const joint = { x: from.x, y: to.y };
  return {
    points: [{ x: from.x, y: from.y }, joint, { x: to.x, y: to.y }],
    midpoint: { x: joint.x, y: centerY }
  };
};
class HorizontalEdgePath {
  constructor(params) {
    __publicField(this, "path");
    __publicField(this, "midpoint");
    const {
      from,
      to,
      fromDir,
      toDir,
      arrowLength,
      arrowOffset,
      roundness,
      hasSourceArrow,
      hasTargetArrow
    } = params;
    const beginArrow = hasSourceArrow ? createRotatedPoint(
      { x: from.x + arrowLength, y: from.y },
      fromDir,
      from
    ) : from;
    const endArrow = hasTargetArrow ? createRotatedPoint(
      {
        x: to.x - arrowLength,
        y: to.y
      },
      toDir,
      to
    ) : to;
    const gap = arrowLength + arrowOffset;
    const beginLine = createRotatedPoint(
      { x: from.x + gap, y: from.y },
      fromDir,
      from
    );
    const endLine = createRotatedPoint({ x: to.x - gap, y: to.y }, toDir, to);
    const line = createLine$1(
      {
        x: beginLine.x,
        y: beginLine.y,
        dirX: fromDir.x
      },
      {
        x: endLine.x,
        y: endLine.y,
        dirX: toDir.x
      }
    );
    this.path = createRoundedPath(
      [beginArrow, ...line.points, endArrow],
      roundness
    );
    this.midpoint = line.midpoint;
  }
}
class DetourStraightEdgePath {
  constructor(params) {
    __publicField(this, "path");
    __publicField(this, "midpoint");
    const {
      hasSourceArrow,
      hasTargetArrow,
      from,
      to,
      arrowLength,
      fromDir,
      toDir,
      arrowOffset,
      detourDir,
      detourDistance,
      roundness
    } = params;
    const pba = hasSourceArrow ? createRotatedPoint(
      { x: from.x + arrowLength, y: from.y },
      fromDir,
      from
    ) : from;
    const pea = hasTargetArrow ? createRotatedPoint(
      {
        x: to.x - arrowLength,
        y: to.y
      },
      toDir,
      to
    ) : to;
    const gap = arrowLength + arrowOffset;
    const detourX = Math.cos(detourDir) * detourDistance;
    const detourY = Math.sin(detourDir) * detourDistance;
    const startLineStart = createRotatedPoint(
      { x: from.x + gap, y: from.y },
      fromDir,
      from
    );
    const startLineEnd = {
      x: startLineStart.x + detourX,
      y: startLineStart.y + detourY
    };
    const endLineStart = createRotatedPoint(
      { x: to.x - gap, y: to.y },
      toDir,
      to
    );
    const endLineEnd = {
      x: endLineStart.x + detourX,
      y: endLineStart.y + detourY
    };
    this.midpoint = {
      x: (startLineEnd.x + endLineEnd.x) / 2,
      y: (startLineEnd.y + endLineEnd.y) / 2
    };
    this.path = createRoundedPath(
      [pba, startLineStart, startLineEnd, endLineEnd, endLineStart, pea],
      roundness
    );
  }
}
class StraightEdgePath {
  constructor(params) {
    __publicField(this, "path");
    __publicField(this, "midpoint");
    const {
      from,
      to,
      hasSourceArrow,
      hasTargetArrow,
      arrowLength,
      fromDir,
      toDir,
      arrowOffset,
      roundness
    } = params;
    const beginArrow = this.createArrowPoint(
      hasSourceArrow,
      fromDir,
      from,
      arrowLength
    );
    const endArrow = this.createArrowPoint(
      hasTargetArrow,
      toDir,
      to,
      -arrowLength
    );
    const gap = arrowLength + arrowOffset;
    const beginGap = { x: from.x + gap, y: from.y };
    const beginLine = createRotatedPoint(beginGap, fromDir, from);
    const endGap = { x: to.x - gap, y: to.y };
    const endLine = createRotatedPoint(endGap, toDir, to);
    this.path = createRoundedPath(
      [beginArrow, beginLine, endLine, endArrow],
      roundness
    );
    const centerX = (beginLine.x + endLine.x) / 2;
    const centerY = (beginLine.y + endLine.y) / 2;
    this.midpoint = { x: centerX, y: centerY };
  }
  createArrowPoint(hasArrow, dir, shift, offsetLength) {
    if (!hasArrow) {
      return shift;
    }
    const offsetPoint = {
      x: shift.x + offsetLength,
      y: shift.y
    };
    return createRotatedPoint(offsetPoint, dir, shift);
  }
}
const createLine = (from, to) => {
  const verticalLineDir = to.y - from.y >= 0;
  const fromPortDir = from.dirY >= 0;
  const toPortDir = to.dirY >= 0;
  const isSameDirPorts = fromPortDir === toPortDir;
  if (isSameDirPorts) {
    const isSameDirLine = fromPortDir === verticalLineDir;
    const centerX2 = (from.x + to.x) / 2;
    const centerY = (from.y + to.y) / 2;
    const midpoint = { x: centerX2, y: centerY };
    if (isSameDirLine) {
      return {
        points: [
          { x: from.x, y: from.y },
          { x: from.x, y: midpoint.y },
          { x: to.x, y: midpoint.y },
          { x: to.x, y: to.y }
        ],
        midpoint
      };
    }
    return {
      points: [
        { x: from.x, y: from.y },
        { x: midpoint.x, y: from.y },
        { x: midpoint.x, y: to.y },
        { x: to.x, y: to.y }
      ],
      midpoint
    };
  }
  const isSameSourceDir = fromPortDir === verticalLineDir;
  const centerX = (from.x + to.x) / 2;
  if (isSameSourceDir) {
    const joint2 = { x: from.x, y: to.y };
    return {
      points: [{ x: from.x, y: from.y }, joint2, { x: to.x, y: to.y }],
      midpoint: { x: centerX, y: joint2.y }
    };
  }
  const joint = { x: to.x, y: from.y };
  return {
    points: [{ x: from.x, y: from.y }, joint, { x: to.x, y: to.y }],
    midpoint: { x: centerX, y: joint.y }
  };
};
class VerticalEdgePath {
  constructor(params) {
    __publicField(this, "path");
    __publicField(this, "midpoint");
    const {
      from,
      to,
      hasSourceArrow,
      hasTargetArrow,
      arrowLength,
      arrowOffset,
      fromDir,
      toDir,
      roundness
    } = params;
    const beginArrow = hasSourceArrow ? createRotatedPoint(
      { x: from.x + arrowLength, y: from.y },
      fromDir,
      from
    ) : from;
    const endArrow = hasTargetArrow ? createRotatedPoint(
      {
        x: to.x - arrowLength,
        y: to.y
      },
      toDir,
      to
    ) : to;
    const gap = arrowLength + arrowOffset;
    const beginLine = createRotatedPoint(
      { x: from.x + gap, y: from.y },
      fromDir,
      from
    );
    const endLine = createRotatedPoint({ x: to.x - gap, y: to.y }, toDir, to);
    const line = createLine(
      {
        x: beginLine.x,
        y: beginLine.y,
        dirY: fromDir.y
      },
      {
        x: endLine.x,
        y: endLine.y,
        dirY: toDir.y
      }
    );
    this.path = createRoundedPath(
      [beginArrow, ...line.points, endArrow],
      roundness
    );
    this.midpoint = line.midpoint;
  }
}
class CycleSquareEdgePath {
  constructor(params) {
    __publicField(this, "path");
    __publicField(this, "midpoint");
    const { side, arrowLength, arrowOffset, dir, origin, hasArrow } = params;
    const x1 = arrowLength + arrowOffset;
    const x2 = x1 + 2 * side;
    const linePoints = [
      { x: arrowLength, y: 0 },
      { x: x1, y: 0 },
      { x: x1, y: side },
      { x: x2, y: side },
      { x: x2, y: -side },
      { x: x1, y: -side },
      { x: x1, y: 0 },
      { x: arrowLength, y: 0 }
    ];
    const rp = linePoints.map((p) => createRotatedPoint(p, dir, { x: 0, y: 0 })).map((p) => ({ x: p.x + origin.x, y: p.y + origin.y }));
    const preLine = `M ${origin.x} ${origin.y} L ${rp[0].x} ${rp[0].y} `;
    this.path = `${hasArrow ? "" : preLine}${createRoundedPath(rp, params.roundness)}`;
    this.midpoint = { x: (rp[3].x + rp[4].x) / 2, y: (rp[3].y + rp[4].y) / 2 };
  }
}
class CycleCircleEdgePath {
  constructor(params) {
    __publicField(this, "path");
    __publicField(this, "midpoint");
    const { arrowLength, radius, smallRadius, dir, origin, hasArrow } = params;
    const diagonal = smallRadius + radius;
    const jointY = smallRadius * radius / diagonal;
    const distance = Math.sqrt(diagonal * diagonal - smallRadius * smallRadius);
    const jointX = distance * smallRadius / diagonal;
    const farPoint = distance + radius + arrowLength;
    const totalX = arrowLength + jointX;
    const points = [
      { x: arrowLength, y: 0 },
      { x: totalX, y: jointY },
      { x: totalX, y: -jointY },
      { x: farPoint, y: 0 }
    ];
    const absPoints = points.map((p) => createRotatedPoint(p, dir, { x: 0, y: 0 })).map((p) => ({ x: p.x + origin.x, y: p.y + origin.y }));
    const c = [
      `M ${absPoints[0].x} ${absPoints[0].y}`,
      `A ${smallRadius} ${smallRadius} 0 0 1 ${absPoints[1].x} ${absPoints[1].y}`,
      `A ${radius} ${radius} 0 1 0 ${absPoints[2].x} ${absPoints[2].y}`,
      `A ${smallRadius} ${smallRadius} 0 0 1 ${absPoints[0].x} ${absPoints[0].y}`
    ].join(" ");
    const preLine = `M ${origin.x} ${origin.y} L ${absPoints[0].x} ${absPoints[0].y} `;
    this.path = `${hasArrow ? "" : preLine}${c}`;
    this.midpoint = absPoints[3];
  }
}
class DirectEdgePath {
  constructor(params) {
    __publicField(this, "path");
    __publicField(this, "midpoint");
    __publicField(this, "diagonalDistance");
    const {
      from,
      to,
      sourceOffset,
      targetOffset,
      hasSourceArrow,
      hasTargetArrow,
      arrowLength
    } = params;
    this.midpoint = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
    const width = to.x - from.x;
    const height = to.y - from.y;
    this.diagonalDistance = Math.sqrt(width * width + height * height);
    if (this.diagonalDistance === 0) {
      this.path = "";
      return;
    }
    const dir = { x: width, y: height };
    const source = this.createDirectLinePoint({
      offset: sourceOffset,
      hasArrow: hasSourceArrow,
      flip: 1,
      shift: from,
      arrowLength,
      dir
    });
    const target = this.createDirectLinePoint({
      offset: targetOffset,
      hasArrow: hasTargetArrow,
      flip: -1,
      shift: to,
      arrowLength,
      dir
    });
    this.path = `M ${source.x} ${source.y} L ${target.x} ${target.y}`;
  }
  createDirectLinePoint(params) {
    const arrowOffset = params.hasArrow ? params.arrowLength : 0;
    const totalOffset = params.offset + arrowOffset;
    const targetRatio = params.flip * totalOffset / this.diagonalDistance;
    const { dir, shift } = params;
    return {
      x: dir.x * targetRatio + shift.x,
      y: dir.y * targetRatio + shift.y
    };
  }
}
const calculateDotourY = (from, to, detourDistance) => {
  const max = Math.max(from.y, to.y);
  const min = Math.min(from.y, to.y);
  return (detourDistance >= 0 ? max : min) + detourDistance;
};
class DetourHorizontalEdgePath {
  constructor(params) {
    __publicField(this, "path");
    __publicField(this, "midpoint");
    const {
      hasSourceArrow,
      hasTargetArrow,
      arrowLength,
      from,
      to,
      fromDir,
      toDir,
      arrowOffset,
      roundness,
      detourDistance
    } = params;
    const beginArrow = hasSourceArrow ? createRotatedPoint(
      { x: from.x + arrowLength, y: from.y },
      fromDir,
      from
    ) : from;
    const endArrow = hasTargetArrow ? createRotatedPoint(
      {
        x: to.x - arrowLength,
        y: to.y
      },
      toDir,
      to
    ) : to;
    const gap = arrowLength + arrowOffset;
    const lineBegin = createRotatedPoint(
      { x: from.x + gap, y: from.y },
      fromDir,
      from
    );
    const lineEnd = createRotatedPoint(
      { x: to.x - gap, y: to.y },
      toDir,
      to
    );
    const detourY = calculateDotourY(lineBegin, lineEnd, detourDistance);
    this.midpoint = {
      x: (lineBegin.x + lineEnd.x) / 2,
      y: detourY
    };
    this.path = createRoundedPath(
      [
        beginArrow,
        lineBegin,
        { x: lineBegin.x, y: detourY },
        { x: lineEnd.x, y: detourY },
        lineEnd,
        endArrow
      ],
      roundness
    );
  }
}
const calculateDetourX = (from, to, detourDistance) => {
  const max = Math.max(from.x, to.x);
  const min = Math.min(from.x, to.x);
  return (detourDistance >= 0 ? max : min) + detourDistance;
};
class DetourVerticalEdgePath {
  constructor(params) {
    __publicField(this, "path");
    __publicField(this, "midpoint");
    const {
      hasSourceArrow,
      hasTargetArrow,
      arrowLength,
      fromDir,
      toDir,
      from,
      to,
      arrowOffset,
      detourDistance,
      roundness
    } = params;
    const beginArrow = hasSourceArrow ? createRotatedPoint(
      { x: from.x + arrowLength, y: from.y },
      fromDir,
      from
    ) : from;
    const endArrow = hasTargetArrow ? createRotatedPoint(
      {
        x: to.x - arrowLength,
        y: to.y
      },
      toDir,
      to
    ) : to;
    const gap = arrowLength + arrowOffset;
    const lineBegin = createRotatedPoint(
      { x: from.x + gap, y: from.y },
      fromDir,
      from
    );
    const lineEnd = createRotatedPoint(
      { x: to.x - gap, y: to.y },
      toDir,
      to
    );
    const detourX = calculateDetourX(lineBegin, lineEnd, detourDistance);
    this.midpoint = {
      x: detourX,
      y: (lineBegin.y + lineEnd.y) / 2
    };
    this.path = createRoundedPath(
      [
        beginArrow,
        lineBegin,
        { x: detourX, y: lineBegin.y },
        { x: detourX, y: lineEnd.y },
        lineEnd,
        endArrow
      ],
      roundness
    );
  }
}
const edgeConstants = Object.freeze({
  color: "#777777",
  width: 1,
  arrowLength: 20,
  polygonArrowRadius: 4,
  circleArrowRadius: 8,
  wedgeArrowSmallRadius: 20,
  wedgeArrowRadius: 100,
  wedgeArrowAngle: Math.PI / 12,
  arrowOffset: 15,
  hasSourceArrow: false,
  hasTargetArrow: false,
  cycleRadius: 30,
  cycleSquareSide: 30,
  roundness: 10,
  detourDistance: 100,
  detourDirection: -Math.PI / 2,
  detourDirectionVertical: 0,
  smallCycleRadius: 15,
  curvature: 90,
  interactiveWidth: 10,
  preOffset: 0
});
const createDirectionVector = (dir) => {
  return { x: Math.cos(dir), y: Math.sin(dir) };
};
class PathEdgeShape {
  constructor(params) {
    __publicField(this, "svg");
    __publicField(this, "group", document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    ));
    __publicField(this, "line");
    __publicField(this, "sourceArrow", null);
    __publicField(this, "targetArrow", null);
    __publicField(this, "onAfterRender");
    __publicField(this, "afterRenderEmitter");
    __publicField(this, "arrowRenderer");
    this.params = params;
    [this.afterRenderEmitter, this.onAfterRender] = createPair();
    this.arrowRenderer = this.params.arrowRenderer;
    this.svg = createEdgeSvg(params.color);
    this.svg.appendChild(this.group);
    this.line = createEdgePath(params.width);
    this.group.appendChild(this.line);
    if (params.hasSourceArrow) {
      this.sourceArrow = createEdgeArrow$1();
      this.group.appendChild(this.sourceArrow);
    }
    if (params.hasTargetArrow) {
      this.targetArrow = createEdgeArrow$1();
      this.group.appendChild(this.targetArrow);
    }
  }
  render(params) {
    const { x, y, width, height, from, to } = createEdgeRectangle(
      params.from,
      params.to,
      this.params.padding
    );
    setSvgRectangle(this.svg, { x, y, width, height });
    const sourceDirection = createDirectionVector(params.from.direction);
    const targetDirection = createDirectionVector(params.to.direction);
    let targetVect = { x: -targetDirection.x, y: -targetDirection.y };
    let createPathFn;
    if (params.category === ConnectionCategory.PortCycle) {
      createPathFn = this.params.createCyclePath;
      targetVect = sourceDirection;
    } else if (params.category === ConnectionCategory.NodeCycle) {
      createPathFn = this.params.createDetourPath;
    } else {
      createPathFn = this.params.createLinePath;
    }
    const edgePath = createPathFn(from, to, sourceDirection, targetDirection);
    this.line.setAttribute("d", edgePath.path);
    let sourceArrowPath = null;
    if (this.sourceArrow) {
      sourceArrowPath = this.arrowRenderer({
        direction: sourceDirection,
        shift: from,
        arrowLength: this.params.arrowLength
      });
      this.sourceArrow.setAttribute("d", sourceArrowPath);
    }
    let targetArrowPath = null;
    if (this.targetArrow) {
      targetArrowPath = this.arrowRenderer({
        direction: targetVect,
        shift: to,
        arrowLength: this.params.arrowLength
      });
      this.targetArrow.setAttribute("d", targetArrowPath);
    }
    this.afterRenderEmitter.emit({
      edgePath,
      sourceArrowPath,
      targetArrowPath
    });
  }
}
const createTriangleArrowRenderer = (params) => {
  return (renderingParams) => {
    const arrowPoints = [
      { x: 0, y: 0 },
      { x: renderingParams.arrowLength, y: params.radius },
      { x: renderingParams.arrowLength, y: -params.radius }
    ];
    const points = arrowPoints.map(
      (point) => createRotatedPoint(point, renderingParams.direction, { x: 0, y: 0 })
    ).map((point) => ({
      x: point.x + renderingParams.shift.x,
      y: point.y + renderingParams.shift.y
    }));
    const move = `M ${points[0].x} ${points[0].y}`;
    const line1 = `L ${points[1].x} ${points[1].y}`;
    const line2 = `L ${points[2].x} ${points[2].y}`;
    return `${move} ${line1} ${line2} Z`;
  };
};
const createArcArrowRenderer = (params) => {
  return (renderingParams) => {
    const r = params.radius;
    const l = renderingParams.arrowLength;
    const R = (l * l + 2 * l * r) / (2 * r);
    const D = R + r;
    const x = l + r - r * (l + r) / D;
    const y = r * R / D;
    const arrowPoints = [
      { x: 0, y: 0 },
      { x, y: -y },
      { x, y }
    ];
    const points = arrowPoints.map(
      (point) => createRotatedPoint(point, renderingParams.direction, { x: 0, y: 0 })
    ).map((point) => ({
      x: point.x + renderingParams.shift.x,
      y: point.y + renderingParams.shift.y
    }));
    const move = `M ${points[0].x} ${points[0].y}`;
    const arc1 = `A ${R} ${R} 0 0 0 ${points[1].x} ${points[1].y}`;
    const arc2 = `A ${r} ${r} 0 0 0 ${points[2].x} ${points[2].y}`;
    const arc3 = `A ${R} ${R} 0 0 0 ${points[0].x} ${points[0].y}`;
    return `${move} ${arc1} ${arc2} ${arc3}`;
  };
};
const createWedgeArrowRenderer = (params) => {
  return (renderingParams) => {
    const r = params.smallRadius;
    const R = params.radius;
    const p = createRotatedPoint(
      {
        x: renderingParams.arrowLength,
        y: 0
      },
      {
        x: Math.cos(params.angle),
        y: Math.sin(params.angle)
      },
      {
        x: renderingParams.arrowLength + params.smallRadius,
        y: 0
      }
    );
    const arrowPoints = [{ x: 0, y: 0 }, { x: p.x, y: -p.y }, p];
    const points = arrowPoints.map(
      (point) => createRotatedPoint(point, renderingParams.direction, { x: 0, y: 0 })
    ).map((point) => ({
      x: point.x + renderingParams.shift.x,
      y: point.y + renderingParams.shift.y
    }));
    const move = `M ${points[0].x} ${points[0].y}`;
    const arc1 = `A ${R} ${R} 0 0 1 ${points[1].x} ${points[1].y}`;
    const arc2 = `A ${r} ${r} 0 0 1 ${points[2].x} ${points[2].y}`;
    const arc3 = `A ${R} ${R} 0 0 1 ${points[0].x} ${points[0].y}`;
    return `${move} ${arc1} ${arc2} ${arc3}`;
  };
};
const resolveArrowRenderer = (config) => {
  if (typeof config === "function") {
    return config;
  }
  switch (config.type) {
    case "triangle": {
      return createTriangleArrowRenderer({
        radius: config.radius ?? edgeConstants.polygonArrowRadius
      });
    }
    case "arc": {
      return createArcArrowRenderer({
        radius: config.radius ?? edgeConstants.circleArrowRadius
      });
    }
    default: {
      return createWedgeArrowRenderer({
        smallRadius: config.smallRadius ?? edgeConstants.wedgeArrowSmallRadius,
        angle: config.angle ?? edgeConstants.wedgeArrowAngle,
        radius: config.radius ?? edgeConstants.wedgeArrowRadius
      });
    }
  }
};
const svgPadding = 50;
class BezierEdgeShape {
  constructor(params) {
    __publicField(this, "svg");
    __publicField(this, "group");
    __publicField(this, "line");
    __publicField(this, "sourceArrow");
    __publicField(this, "targetArrow");
    __publicField(this, "onAfterRender");
    __publicField(this, "arrowLength");
    __publicField(this, "curvature");
    __publicField(this, "portCycleRadius");
    __publicField(this, "portCycleSmallRadius");
    __publicField(this, "detourDirection");
    __publicField(this, "detourDistance");
    __publicField(this, "hasSourceArrow");
    __publicField(this, "hasTargetArrow");
    __publicField(this, "pathShape");
    __publicField(this, "createCyclePath", (from, _to, fromDir) => new CycleCircleEdgePath({
      origin: from,
      dir: fromDir,
      radius: this.portCycleRadius,
      smallRadius: this.portCycleSmallRadius,
      arrowLength: this.arrowLength,
      hasArrow: this.hasSourceArrow || this.hasTargetArrow
    }));
    __publicField(this, "createDetourPath", (from, to, fromDir, toDir) => new DetourBezierEdgePath({
      from,
      to,
      fromDir,
      toDir,
      arrowLength: this.arrowLength,
      detourDir: this.detourDirection,
      detourDistance: this.detourDistance,
      curvature: this.curvature,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    __publicField(this, "createLinePath", (from, to, fromDir, toDir) => new BezierEdgePath({
      from,
      to,
      fromDir,
      toDir,
      arrowLength: this.arrowLength,
      curvature: this.curvature,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    this.arrowLength = (params == null ? void 0 : params.arrowLength) ?? edgeConstants.arrowLength;
    this.curvature = (params == null ? void 0 : params.curvature) ?? edgeConstants.curvature;
    this.portCycleRadius = (params == null ? void 0 : params.cycleRadius) ?? edgeConstants.cycleRadius;
    this.portCycleSmallRadius = (params == null ? void 0 : params.smallCycleRadius) ?? edgeConstants.smallCycleRadius;
    this.detourDirection = (params == null ? void 0 : params.detourDirection) ?? edgeConstants.detourDirection;
    this.detourDistance = (params == null ? void 0 : params.detourDistance) ?? edgeConstants.detourDistance;
    this.hasSourceArrow = (params == null ? void 0 : params.hasSourceArrow) ?? edgeConstants.hasSourceArrow;
    this.hasTargetArrow = (params == null ? void 0 : params.hasTargetArrow) ?? edgeConstants.hasTargetArrow;
    this.pathShape = new PathEdgeShape({
      color: (params == null ? void 0 : params.color) ?? edgeConstants.color,
      width: (params == null ? void 0 : params.width) ?? edgeConstants.width,
      arrowRenderer: resolveArrowRenderer((params == null ? void 0 : params.arrowRenderer) ?? {}),
      arrowLength: this.arrowLength,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
      createCyclePath: this.createCyclePath,
      createDetourPath: this.createDetourPath,
      createLinePath: this.createLinePath,
      padding: svgPadding
    });
    this.svg = this.pathShape.svg;
    this.group = this.pathShape.group;
    this.line = this.pathShape.line;
    this.sourceArrow = this.pathShape.sourceArrow;
    this.targetArrow = this.pathShape.targetArrow;
    this.onAfterRender = this.pathShape.onAfterRender;
  }
  render(params) {
    this.pathShape.render(params);
  }
}
class HorizontalEdgeShape {
  constructor(params) {
    __publicField(this, "svg");
    __publicField(this, "group");
    __publicField(this, "line");
    __publicField(this, "sourceArrow");
    __publicField(this, "targetArrow");
    __publicField(this, "onAfterRender");
    __publicField(this, "arrowLength");
    __publicField(this, "arrowOffset");
    __publicField(this, "roundness");
    __publicField(this, "cycleSquareSide");
    __publicField(this, "detourDistance");
    __publicField(this, "hasSourceArrow");
    __publicField(this, "hasTargetArrow");
    __publicField(this, "pathShape");
    __publicField(this, "createCyclePath", (from, _to, fromDir) => new CycleSquareEdgePath({
      origin: from,
      dir: fromDir,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasArrow: this.hasSourceArrow || this.hasTargetArrow
    }));
    __publicField(this, "createDetourPath", (from, to, fromDir, toDir) => new DetourHorizontalEdgePath({
      from,
      to,
      fromDir,
      toDir,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    __publicField(this, "createLinePath", (from, to, fromDir, toDir) => new HorizontalEdgePath({
      from,
      to,
      fromDir,
      toDir,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    this.arrowLength = (params == null ? void 0 : params.arrowLength) ?? edgeConstants.arrowLength;
    this.arrowOffset = (params == null ? void 0 : params.arrowOffset) ?? edgeConstants.arrowOffset;
    this.cycleSquareSide = (params == null ? void 0 : params.cycleSquareSide) ?? edgeConstants.cycleSquareSide;
    const roundness = (params == null ? void 0 : params.roundness) ?? edgeConstants.roundness;
    this.roundness = Math.min(
      roundness,
      this.arrowOffset,
      this.cycleSquareSide / 2
    );
    this.detourDistance = (params == null ? void 0 : params.detourDistance) ?? edgeConstants.detourDistance;
    this.hasSourceArrow = (params == null ? void 0 : params.hasSourceArrow) ?? edgeConstants.hasSourceArrow;
    this.hasTargetArrow = (params == null ? void 0 : params.hasTargetArrow) ?? edgeConstants.hasTargetArrow;
    this.pathShape = new PathEdgeShape({
      color: (params == null ? void 0 : params.color) ?? edgeConstants.color,
      width: (params == null ? void 0 : params.width) ?? edgeConstants.width,
      arrowRenderer: resolveArrowRenderer((params == null ? void 0 : params.arrowRenderer) ?? {}),
      arrowLength: this.arrowLength,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
      createCyclePath: this.createCyclePath,
      createDetourPath: this.createDetourPath,
      createLinePath: this.createLinePath,
      padding: svgPadding
    });
    this.svg = this.pathShape.svg;
    this.group = this.pathShape.group;
    this.line = this.pathShape.line;
    this.sourceArrow = this.pathShape.sourceArrow;
    this.targetArrow = this.pathShape.targetArrow;
    this.onAfterRender = this.pathShape.onAfterRender;
  }
  render(params) {
    this.pathShape.render(params);
  }
}
class StraightEdgeShape {
  constructor(params) {
    __publicField(this, "svg");
    __publicField(this, "group");
    __publicField(this, "line");
    __publicField(this, "sourceArrow");
    __publicField(this, "targetArrow");
    __publicField(this, "onAfterRender");
    __publicField(this, "arrowLength");
    __publicField(this, "arrowOffset");
    __publicField(this, "roundness");
    __publicField(this, "cycleSquareSide");
    __publicField(this, "detourDirection");
    __publicField(this, "detourDistance");
    __publicField(this, "hasSourceArrow");
    __publicField(this, "hasTargetArrow");
    __publicField(this, "pathShape");
    __publicField(this, "createCyclePath", (from, _to, fromDir) => new CycleSquareEdgePath({
      origin: from,
      dir: fromDir,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasArrow: this.hasSourceArrow || this.hasTargetArrow
    }));
    __publicField(this, "createDetourPath", (from, to, fromDir, toDir) => new DetourStraightEdgePath({
      from,
      to,
      fromDir,
      toDir,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDir: this.detourDirection,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    __publicField(this, "createLinePath", (from, to, fromDir, toDir) => new StraightEdgePath({
      from,
      to,
      fromDir,
      toDir,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    this.arrowLength = (params == null ? void 0 : params.arrowLength) ?? edgeConstants.arrowLength;
    this.arrowOffset = (params == null ? void 0 : params.arrowOffset) ?? edgeConstants.arrowOffset;
    this.cycleSquareSide = (params == null ? void 0 : params.cycleSquareSide) ?? edgeConstants.cycleSquareSide;
    const roundness = (params == null ? void 0 : params.roundness) ?? edgeConstants.roundness;
    this.roundness = Math.min(
      roundness,
      this.arrowOffset,
      this.cycleSquareSide / 2
    );
    this.detourDirection = (params == null ? void 0 : params.detourDirection) ?? edgeConstants.detourDirection;
    this.detourDistance = (params == null ? void 0 : params.detourDistance) ?? edgeConstants.detourDistance;
    this.hasSourceArrow = (params == null ? void 0 : params.hasSourceArrow) ?? edgeConstants.hasSourceArrow;
    this.hasTargetArrow = (params == null ? void 0 : params.hasTargetArrow) ?? edgeConstants.hasTargetArrow;
    this.pathShape = new PathEdgeShape({
      color: (params == null ? void 0 : params.color) ?? edgeConstants.color,
      width: (params == null ? void 0 : params.width) ?? edgeConstants.width,
      arrowRenderer: resolveArrowRenderer((params == null ? void 0 : params.arrowRenderer) ?? {}),
      arrowLength: this.arrowLength,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
      createCyclePath: this.createCyclePath,
      createDetourPath: this.createDetourPath,
      createLinePath: this.createLinePath,
      padding: svgPadding
    });
    this.svg = this.pathShape.svg;
    this.group = this.pathShape.group;
    this.line = this.pathShape.line;
    this.sourceArrow = this.pathShape.sourceArrow;
    this.targetArrow = this.pathShape.targetArrow;
    this.onAfterRender = this.pathShape.onAfterRender;
  }
  render(params) {
    this.pathShape.render(params);
  }
}
class VerticalEdgeShape {
  constructor(params) {
    __publicField(this, "svg");
    __publicField(this, "group");
    __publicField(this, "line");
    __publicField(this, "sourceArrow");
    __publicField(this, "targetArrow");
    __publicField(this, "onAfterRender");
    __publicField(this, "arrowLength");
    __publicField(this, "arrowOffset");
    __publicField(this, "roundness");
    __publicField(this, "cycleSquareSide");
    __publicField(this, "detourDistance");
    __publicField(this, "hasSourceArrow");
    __publicField(this, "hasTargetArrow");
    __publicField(this, "pathShape");
    __publicField(this, "createCyclePath", (from, _to, fromDir) => new CycleSquareEdgePath({
      origin: from,
      dir: fromDir,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasArrow: this.hasSourceArrow || this.hasTargetArrow
    }));
    __publicField(this, "createDetourPath", (from, to, fromDir, toDir) => new DetourVerticalEdgePath({
      from,
      to,
      fromDir,
      toDir,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    __publicField(this, "createLinePath", (from, to, fromDir, toDir) => new VerticalEdgePath({
      from,
      to,
      fromDir,
      toDir,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    this.arrowLength = (params == null ? void 0 : params.arrowLength) ?? edgeConstants.arrowLength;
    this.arrowOffset = (params == null ? void 0 : params.arrowOffset) ?? edgeConstants.arrowOffset;
    this.cycleSquareSide = (params == null ? void 0 : params.cycleSquareSide) ?? edgeConstants.cycleSquareSide;
    const roundness = (params == null ? void 0 : params.roundness) ?? edgeConstants.roundness;
    this.roundness = Math.min(
      roundness,
      this.arrowOffset,
      this.cycleSquareSide / 2
    );
    this.detourDistance = (params == null ? void 0 : params.detourDistance) ?? edgeConstants.detourDistance;
    this.hasSourceArrow = (params == null ? void 0 : params.hasSourceArrow) ?? edgeConstants.hasSourceArrow;
    this.hasTargetArrow = (params == null ? void 0 : params.hasTargetArrow) ?? edgeConstants.hasTargetArrow;
    this.pathShape = new PathEdgeShape({
      color: (params == null ? void 0 : params.color) ?? edgeConstants.color,
      width: (params == null ? void 0 : params.width) ?? edgeConstants.width,
      arrowRenderer: resolveArrowRenderer((params == null ? void 0 : params.arrowRenderer) ?? {}),
      arrowLength: this.arrowLength,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
      createCyclePath: this.createCyclePath,
      createDetourPath: this.createDetourPath,
      createLinePath: this.createLinePath,
      padding: svgPadding
    });
    this.svg = this.pathShape.svg;
    this.group = this.pathShape.group;
    this.line = this.pathShape.line;
    this.sourceArrow = this.pathShape.sourceArrow;
    this.targetArrow = this.pathShape.targetArrow;
    this.onAfterRender = this.pathShape.onAfterRender;
  }
  render(params) {
    this.pathShape.render(params);
  }
}
class DirectEdgeShape {
  constructor(params) {
    __publicField(this, "svg");
    __publicField(this, "group", document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    ));
    __publicField(this, "line");
    __publicField(this, "sourceArrow", null);
    __publicField(this, "targetArrow", null);
    __publicField(this, "color");
    __publicField(this, "width");
    __publicField(this, "arrowLength");
    __publicField(this, "sourceOffset");
    __publicField(this, "targetOffset");
    __publicField(this, "onAfterRender");
    __publicField(this, "afterRenderEmitter");
    __publicField(this, "arrowRenderer");
    [this.afterRenderEmitter, this.onAfterRender] = createPair();
    this.color = (params == null ? void 0 : params.color) ?? edgeConstants.color;
    this.width = (params == null ? void 0 : params.width) ?? edgeConstants.width;
    this.arrowLength = (params == null ? void 0 : params.arrowLength) ?? edgeConstants.arrowLength;
    this.arrowRenderer = resolveArrowRenderer((params == null ? void 0 : params.arrowRenderer) ?? {});
    this.sourceOffset = (params == null ? void 0 : params.sourceOffset) ?? edgeConstants.preOffset;
    this.targetOffset = (params == null ? void 0 : params.targetOffset) ?? edgeConstants.preOffset;
    this.svg = createEdgeSvg(this.color);
    this.svg.appendChild(this.group);
    this.line = createEdgePath(this.width);
    this.group.appendChild(this.line);
    if (params == null ? void 0 : params.hasSourceArrow) {
      this.sourceArrow = createEdgeArrow$1();
      this.group.appendChild(this.sourceArrow);
    }
    if (params == null ? void 0 : params.hasTargetArrow) {
      this.targetArrow = createEdgeArrow$1();
      this.group.appendChild(this.targetArrow);
    }
  }
  render(params) {
    const { x, y, width, height, from, to } = createEdgeRectangle(
      params.from,
      params.to,
      svgPadding
    );
    setSvgRectangle(this.svg, { x, y, width, height });
    const edgePath = new DirectEdgePath({
      from,
      to,
      sourceOffset: this.sourceOffset,
      targetOffset: this.targetOffset,
      hasSourceArrow: this.sourceArrow !== null,
      hasTargetArrow: this.targetArrow !== null,
      arrowLength: this.arrowLength
    });
    this.line.setAttribute("d", edgePath.path);
    let sourceArrowPath = null;
    let targetArrowPath = null;
    const diagonal = edgePath.diagonalDistance;
    if (diagonal === 0) {
      if (this.sourceArrow !== null) {
        sourceArrowPath = "";
        this.sourceArrow.setAttribute("d", sourceArrowPath);
      }
      if (this.targetArrow !== null) {
        targetArrowPath = "";
        this.targetArrow.setAttribute("d", targetArrowPath);
      }
    } else {
      const direction = {
        x: (to.x - from.x) / diagonal,
        y: (to.y - from.y) / diagonal
      };
      if (this.sourceArrow) {
        const sourceOffset = {
          x: direction.x * this.sourceOffset,
          y: direction.y * this.sourceOffset
        };
        sourceArrowPath = this.arrowRenderer({
          direction,
          shift: sourceOffset,
          arrowLength: this.arrowLength
        });
        this.sourceArrow.setAttribute("d", sourceArrowPath);
      }
      if (this.targetArrow) {
        const targetOffset = {
          x: direction.x * this.targetOffset,
          y: direction.y * this.targetOffset
        };
        targetArrowPath = this.arrowRenderer({
          direction: { x: -direction.x, y: -direction.y },
          shift: {
            x: to.x - targetOffset.x,
            y: to.y - targetOffset.y
          },
          arrowLength: this.arrowLength
        });
        this.targetArrow.setAttribute("d", targetArrowPath);
      }
    }
    this.afterRenderEmitter.emit({
      edgePath,
      sourceArrowPath,
      targetArrowPath
    });
  }
}
const createEdgeGroup = () => {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.style.pointerEvents = "auto";
  group.style.cursor = "pointer";
  return group;
};
const createEdgeLine = (width) => {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
  line.setAttribute("stroke", "transparent");
  line.setAttribute("stroke-width", `${width}`);
  line.setAttribute("fill", "none");
  line.setAttribute("stroke-linecap", "round");
  return line;
};
const createEdgeArrow = (width) => {
  const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
  arrow.setAttribute("stroke-linejoin", "round");
  arrow.setAttribute("stroke-width", `${width}`);
  arrow.setAttribute("fill", "transparent");
  arrow.setAttribute("stroke", "transparent");
  return arrow;
};
class InteractiveEdgeError extends Error {
  constructor(message) {
    super(message);
    this.name = "InteractiveEdgeError";
  }
}
class InteractiveEdgeShape {
  constructor(baseEdge, params) {
    __publicField(this, "svg");
    __publicField(this, "group");
    __publicField(this, "line");
    __publicField(this, "sourceArrow");
    __publicField(this, "targetArrow");
    __publicField(this, "handle", createEdgeGroup());
    __publicField(this, "onAfterRender");
    __publicField(this, "interactiveLine");
    __publicField(this, "interactiveSourceArrow", null);
    __publicField(this, "interactiveTargetArrow", null);
    this.baseEdge = baseEdge;
    if (baseEdge instanceof InteractiveEdgeShape) {
      throw new InteractiveEdgeError(
        "interactive edge can be configured only once"
      );
    }
    this.svg = this.baseEdge.svg;
    this.group = this.baseEdge.group;
    this.line = this.baseEdge.line;
    this.sourceArrow = this.baseEdge.sourceArrow;
    this.targetArrow = this.baseEdge.targetArrow;
    this.onAfterRender = this.baseEdge.onAfterRender;
    const width = (params == null ? void 0 : params.distance) ?? edgeConstants.interactiveWidth;
    this.interactiveLine = createEdgeLine(width);
    this.handle.appendChild(this.interactiveLine);
    if (this.sourceArrow) {
      this.interactiveSourceArrow = createEdgeArrow(width);
      this.handle.appendChild(this.interactiveSourceArrow);
    }
    if (this.targetArrow) {
      this.interactiveTargetArrow = createEdgeArrow(width);
      this.handle.appendChild(this.interactiveTargetArrow);
    }
    this.group.appendChild(this.handle);
    this.baseEdge.onAfterRender.subscribe((model) => {
      this.interactiveLine.setAttribute("d", model.edgePath.path);
      if (this.interactiveSourceArrow) {
        this.interactiveSourceArrow.setAttribute("d", model.sourceArrowPath);
      }
      if (this.interactiveTargetArrow) {
        this.interactiveTargetArrow.setAttribute("d", model.targetArrowPath);
      }
    });
  }
  render(params) {
    this.baseEdge.render(params);
  }
}
class MidpointEdgeShape {
  constructor(baseShape, midpointElement) {
    __publicField(this, "group");
    __publicField(this, "line");
    __publicField(this, "sourceArrow");
    __publicField(this, "targetArrow");
    __publicField(this, "onAfterRender");
    __publicField(this, "svg");
    this.baseShape = baseShape;
    this.midpointElement = midpointElement;
    this.svg = this.baseShape.svg;
    this.group = this.baseShape.group;
    this.line = this.baseShape.line;
    this.sourceArrow = this.baseShape.sourceArrow;
    this.targetArrow = this.baseShape.targetArrow;
    this.onAfterRender = this.baseShape.onAfterRender;
    this.svg.append(this.midpointElement);
    this.baseShape.onAfterRender.subscribe((model) => {
      const midpoint = model.edgePath.midpoint;
      const transform = `translate(${midpoint.x}px, ${midpoint.y}px)`;
      this.midpointElement.style.setProperty("transform", transform);
    });
  }
  render(params) {
    this.baseShape.render(params);
  }
}
class Graph {
  constructor(graphStore) {
    __publicField(this, "onAfterNodeAdded");
    __publicField(this, "onAfterNodeUpdated");
    __publicField(this, "onAfterNodePriorityUpdated");
    __publicField(this, "onBeforeNodeRemoved");
    __publicField(this, "onAfterPortMarked");
    __publicField(this, "onAfterPortUpdated");
    __publicField(this, "onBeforePortUnmarked");
    __publicField(this, "onAfterEdgeAdded");
    __publicField(this, "onAfterEdgeShapeUpdated");
    __publicField(this, "onAfterEdgeUpdated");
    __publicField(this, "onAfterEdgePriorityUpdated");
    __publicField(this, "onBeforeEdgeRemoved");
    __publicField(this, "onBeforeClear");
    this.graphStore = graphStore;
    this.onAfterNodeAdded = this.graphStore.onAfterNodeAdded;
    this.onAfterNodeUpdated = this.graphStore.onAfterNodeUpdated;
    this.onAfterNodePriorityUpdated = this.graphStore.onAfterNodePriorityUpdated;
    this.onBeforeNodeRemoved = this.graphStore.onBeforeNodeRemoved;
    this.onAfterPortMarked = this.graphStore.onAfterPortAdded;
    this.onAfterPortUpdated = this.graphStore.onAfterPortUpdated;
    this.onBeforePortUnmarked = this.graphStore.onBeforePortRemoved;
    this.onAfterEdgeAdded = this.graphStore.onAfterEdgeAdded;
    this.onAfterEdgeShapeUpdated = this.graphStore.onAfterEdgeShapeUpdated;
    this.onAfterEdgeUpdated = this.graphStore.onAfterEdgeUpdated;
    this.onAfterEdgePriorityUpdated = this.graphStore.onAfterEdgePriorityUpdated;
    this.onBeforeEdgeRemoved = this.graphStore.onBeforeEdgeRemoved;
    this.onBeforeClear = this.graphStore.onBeforeClear;
  }
  hasNode(nodeId) {
    return this.graphStore.hasNode(nodeId);
  }
  getNode(nodeId) {
    const node = this.graphStore.getNode(nodeId);
    const { payload } = node;
    return {
      element: node.element,
      x: payload.x,
      y: payload.y,
      centerFn: payload.centerFn,
      priority: payload.priority
    };
  }
  findNodeIdByElement(element) {
    return this.graphStore.findNodeIdByElement(element);
  }
  getAllNodeIds() {
    return this.graphStore.getAllNodeIds();
  }
  hasPort(portId) {
    return this.graphStore.hasPort(portId);
  }
  getPort(portId) {
    const port = this.graphStore.getPort(portId);
    return {
      element: port.element,
      direction: port.payload.direction,
      nodeId: port.nodeId
    };
  }
  getAllPortIds() {
    return this.graphStore.getAllPortIds();
  }
  getNodePortIds(nodeId) {
    return this.graphStore.getNodePortIds(nodeId);
  }
  findPortIdsByElement(element) {
    return this.graphStore.findPortIdsByElement(element);
  }
  getAllEdgeIds() {
    return this.graphStore.getAllEdgeIds();
  }
  hasEdge(edgeId) {
    return this.graphStore.hasEdge(edgeId);
  }
  getEdge(edgeId) {
    const edge = this.graphStore.getEdge(edgeId);
    const { payload } = edge;
    return {
      from: edge.from,
      to: edge.to,
      priority: payload.priority,
      shape: payload.shape
    };
  }
  getPortIncomingEdgeIds(portId) {
    return this.graphStore.getPortIncomingEdgeIds(portId);
  }
  getPortOutgoingEdgeIds(portId) {
    return this.graphStore.getPortOutgoingEdgeIds(portId);
  }
  getPortCycleEdgeIds(portId) {
    return this.graphStore.getPortCycleEdgeIds(portId);
  }
  getPortAdjacentEdgeIds(portId) {
    return this.graphStore.getPortAdjacentEdgeIds(portId);
  }
  getNodeIncomingEdgeIds(nodeId) {
    return this.graphStore.getNodeIncomingEdgeIds(nodeId);
  }
  getNodeOutgoingEdgeIds(nodeId) {
    return this.graphStore.getNodeOutgoingEdgeIds(nodeId);
  }
  getNodeCycleEdgeIds(nodeId) {
    return this.graphStore.getNodeCycleEdgeIds(nodeId);
  }
  getNodeAdjacentEdgeIds(nodeId) {
    return this.graphStore.getNodeAdjacentEdgeIds(nodeId);
  }
}
class IdGenerator {
  constructor(checkExists) {
    __publicField(this, "counter", 0);
    this.checkExists = checkExists;
  }
  create(suggestedId) {
    if (suggestedId !== void 0) {
      return suggestedId;
    }
    while (this.checkExists(this.counter)) {
      this.counter++;
    }
    return this.counter;
  }
  reset() {
    this.counter = 0;
  }
}
class GraphController {
  constructor(graphStore, htmlView, params) {
    __publicField(this, "nodeIdGenerator", new IdGenerator(
      (nodeId) => this.graphStore.hasNode(nodeId)
    ));
    __publicField(this, "portIdGenerator", new IdGenerator(
      (portId) => this.graphStore.hasPort(portId)
    ));
    __publicField(this, "edgeIdGenerator", new IdGenerator(
      (edgeId) => this.graphStore.hasEdge(edgeId)
    ));
    __publicField(this, "onAfterNodeAdded", (nodeId) => {
      this.htmlView.attachNode(nodeId);
    });
    __publicField(this, "onAfterNodeUpdated", (nodeId) => {
      this.htmlView.updateNodePosition(nodeId);
      this.graphStore.getNodeAdjacentEdgeIds(nodeId).forEach((edge) => {
        this.htmlView.renderEdge(edge);
      });
    });
    __publicField(this, "onAfterNodePriorityUpdated", (nodeId) => {
      this.htmlView.updateNodePriority(nodeId);
    });
    __publicField(this, "onBeforeNodeRemoved", (nodeId) => {
      this.graphStore.getNodePortIds(nodeId).forEach((portId) => {
        this.unmarkPort(portId);
      });
      this.htmlView.detachNode(nodeId);
    });
    __publicField(this, "onAfterPortUpdated", (portId) => {
      this.graphStore.getPortAdjacentEdgeIds(portId).forEach((edge) => {
        this.htmlView.renderEdge(edge);
      });
    });
    __publicField(this, "onBeforePortUnmarked", (portId) => {
      this.graphStore.getPortAdjacentEdgeIds(portId).forEach((edgeId) => {
        this.removeEdge(edgeId);
      });
    });
    __publicField(this, "onAfterEdgeAdded", (edgeId) => {
      this.htmlView.attachEdge(edgeId);
    });
    __publicField(this, "onAfterEdgeShapeUpdated", (edgeId) => {
      this.htmlView.updateEdgeShape(edgeId);
    });
    __publicField(this, "onAfterEdgeUpdated", (edgeId) => {
      this.htmlView.renderEdge(edgeId);
    });
    __publicField(this, "onAfterEdgePriorityUpdated", (edgeId) => {
      this.htmlView.updateEdgePriority(edgeId);
    });
    __publicField(this, "onBeforeEdgeRemoved", (edgeId) => {
      this.htmlView.detachEdge(edgeId);
    });
    __publicField(this, "onBeforeClear", () => {
      this.nodeIdGenerator.reset();
      this.portIdGenerator.reset();
      this.edgeIdGenerator.reset();
      this.htmlView.clear();
    });
    this.graphStore = graphStore;
    this.htmlView = htmlView;
    this.params = params;
    this.graphStore.onAfterNodeAdded.subscribe(this.onAfterNodeAdded);
    this.graphStore.onAfterNodeUpdated.subscribe(this.onAfterNodeUpdated);
    this.graphStore.onAfterNodePriorityUpdated.subscribe(
      this.onAfterNodePriorityUpdated
    );
    this.graphStore.onBeforeNodeRemoved.subscribe(this.onBeforeNodeRemoved);
    this.graphStore.onAfterPortUpdated.subscribe(this.onAfterPortUpdated);
    this.graphStore.onBeforePortRemoved.subscribe(this.onBeforePortUnmarked);
    this.graphStore.onAfterEdgeAdded.subscribe(this.onAfterEdgeAdded);
    this.graphStore.onAfterEdgeShapeUpdated.subscribe(
      this.onAfterEdgeShapeUpdated
    );
    this.graphStore.onAfterEdgeUpdated.subscribe(this.onAfterEdgeUpdated);
    this.graphStore.onAfterEdgePriorityUpdated.subscribe(
      this.onAfterEdgePriorityUpdated
    );
    this.graphStore.onBeforeEdgeRemoved.subscribe(this.onBeforeEdgeRemoved);
    this.graphStore.onBeforeClear.subscribe(this.onBeforeClear);
  }
  addNode(request) {
    const nodeId = this.nodeIdGenerator.create(request.id);
    this.graphStore.addNode({
      id: nodeId,
      element: request.element,
      x: request.x ?? null,
      y: request.y ?? null,
      centerFn: request.centerFn ?? this.params.nodes.centerFn,
      priority: request.priority ?? this.params.nodes.priorityFn()
    });
    if (request.ports !== void 0) {
      for (const port of request.ports) {
        this.markPort({
          id: port.id,
          element: port.element,
          nodeId,
          direction: port.direction
        });
      }
    }
  }
  updateNode(nodeId, request) {
    this.graphStore.updateNode(nodeId, request ?? {});
  }
  removeNode(nodeId) {
    this.graphStore.removeNode(nodeId);
  }
  markPort(request) {
    const portId = this.portIdGenerator.create(request.id);
    this.graphStore.addPort({
      id: portId,
      element: request.element,
      nodeId: request.nodeId,
      direction: request.direction ?? this.params.ports.direction
    });
  }
  updatePort(portId, request) {
    this.graphStore.updatePort(portId, request ?? {});
  }
  unmarkPort(portId) {
    this.graphStore.removePort(portId);
  }
  addEdge(request) {
    const edgeId = this.edgeIdGenerator.create(request.id);
    this.graphStore.addEdge({
      id: edgeId,
      from: request.from,
      to: request.to,
      shape: request.shape ?? this.params.edges.shapeFactory(edgeId),
      priority: request.priority ?? this.params.edges.priorityFn()
    });
  }
  updateEdge(edgeId, request) {
    this.graphStore.updateEdge(edgeId, request ?? {});
  }
  removeEdge(edgeId) {
    this.graphStore.removeEdge(edgeId);
  }
  clear() {
    this.graphStore.clear();
  }
  destroy() {
    this.graphStore.onAfterNodeAdded.unsubscribe(this.onAfterNodeAdded);
    this.graphStore.onAfterNodeUpdated.unsubscribe(this.onAfterNodeUpdated);
    this.graphStore.onAfterNodePriorityUpdated.unsubscribe(
      this.onAfterNodePriorityUpdated
    );
    this.graphStore.onBeforeNodeRemoved.unsubscribe(this.onBeforeNodeRemoved);
    this.graphStore.onAfterPortUpdated.unsubscribe(this.onAfterPortUpdated);
    this.graphStore.onBeforePortRemoved.unsubscribe(this.onBeforePortUnmarked);
    this.graphStore.onAfterEdgeAdded.unsubscribe(this.onAfterEdgeAdded);
    this.graphStore.onAfterEdgeShapeUpdated.unsubscribe(
      this.onAfterEdgeShapeUpdated
    );
    this.graphStore.onAfterEdgeUpdated.unsubscribe(this.onAfterEdgeUpdated);
    this.graphStore.onAfterEdgePriorityUpdated.unsubscribe(
      this.onAfterEdgePriorityUpdated
    );
    this.graphStore.onBeforeEdgeRemoved.unsubscribe(this.onBeforeEdgeRemoved);
    this.graphStore.onBeforeClear.unsubscribe(this.onBeforeClear);
    this.htmlView.destroy();
  }
}
const macrotaskScheduleFn = (callback) => {
  setTimeout(() => {
    callback();
  });
};
const microtaskScheduleFn = (callback) => {
  queueMicrotask(() => {
    callback();
  });
};
const immediateScheduleFn = (callback) => {
  callback();
};
class Viewport {
  constructor(viewportStore) {
    __publicField(this, "onBeforeUpdated");
    __publicField(this, "onAfterUpdated");
    __publicField(this, "onAfterResize");
    this.viewportStore = viewportStore;
    this.onBeforeUpdated = this.viewportStore.onBeforeUpdated;
    this.onAfterUpdated = this.viewportStore.onAfterUpdated;
    this.onAfterResize = this.viewportStore.onAfterResize;
  }
  getViewportMatrix() {
    return { ...this.viewportStore.getViewportMatrix() };
  }
  getContentMatrix() {
    return { ...this.viewportStore.getContentMatrix() };
  }
  getDimensions() {
    return this.viewportStore.getDimensions();
  }
  createContentCoords(viewportCoords) {
    return this.viewportStore.createContentCoords(viewportCoords);
  }
  createViewportCoords(contentCoords) {
    return this.viewportStore.createViewportCoords(contentCoords);
  }
}
const createFocusParams = (config, controllerParams) => {
  return Symbol.iterator in config ? {
    minContentScale: controllerParams.focus.minContentScale,
    nodes: config,
    contentPadding: controllerParams.focus.contentPadding,
    animationDuration: controllerParams.focus.animationDuration
  } : {
    minContentScale: config.minContentScale ?? controllerParams.focus.minContentScale,
    nodes: config.nodes ?? [],
    contentPadding: config.contentPadding ?? config.contentOffset ?? controllerParams.focus.contentPadding,
    animationDuration: config.animationDuration ?? controllerParams.focus.animationDuration
  };
};
const applyMatrixMove = (prevTransform, dx, dy) => {
  return {
    scale: prevTransform.scale,
    x: prevTransform.x + prevTransform.scale * dx,
    y: prevTransform.y + prevTransform.scale * dy
  };
};
const applyMatrixScale = (prevTransform, s2, cx, cy) => {
  return {
    scale: prevTransform.scale * s2,
    x: prevTransform.scale * (1 - s2) * cx + prevTransform.x,
    y: prevTransform.scale * (1 - s2) * cy + prevTransform.y
  };
};
class ViewportController {
  constructor(graphStore, viewportStore, params, win) {
    this.graphStore = graphStore;
    this.viewportStore = viewportStore;
    this.params = params;
    this.win = win;
  }
  patchViewportMatrix(request) {
    this.viewportStore.patchViewportMatrix(request);
  }
  patchContentMatrix(request) {
    this.viewportStore.patchContentMatrix(request);
  }
  center(target, config) {
    const { width, height } = this.viewportStore.getDimensions();
    const viewportCenter = { x: width / 2, y: height / 2 };
    const viewportMatrix = this.viewportStore.getViewportMatrix();
    const viewportTarget = this.viewportStore.createViewportCoords(target);
    const dx = viewportTarget.x - viewportCenter.x;
    const dy = viewportTarget.y - viewportCenter.y;
    let nextViewportMatrix = applyMatrixMove(viewportMatrix, dx, dy);
    const contentScale = config == null ? void 0 : config.contentScale;
    if (contentScale !== void 0) {
      const viewportScale = 1 / contentScale;
      nextViewportMatrix = applyMatrixScale(
        nextViewportMatrix,
        viewportScale / viewportMatrix.scale,
        viewportCenter.x,
        viewportCenter.y
      );
    }
    const duration = (config == null ? void 0 : config.animationDuration) ?? 0;
    if (duration > 0) {
      this.animateNavigation(viewportMatrix, nextViewportMatrix, duration);
    } else {
      this.viewportStore.patchViewportMatrix(nextViewportMatrix);
    }
  }
  focus(config) {
    const params = createFocusParams(config ?? {}, this.params);
    this.params.focus.schedule(() => {
      this.navigate(params);
    });
  }
  destroy() {
    this.viewportStore.destroy();
  }
  navigate(params) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    let nodesCount = 0;
    const focusNodes = /* @__PURE__ */ new Set();
    for (const nodeId of params.nodes) {
      focusNodes.add(nodeId);
    }
    this.graphStore.getAllNodeIds().forEach((nodeId) => {
      const { payload } = this.graphStore.getNode(nodeId);
      if (payload.x !== null && payload.y !== null && (focusNodes.size === 0 || focusNodes.has(nodeId))) {
        minX = Math.min(payload.x, minX);
        maxX = Math.max(payload.x, maxX);
        minY = Math.min(payload.y, minY);
        maxY = Math.max(payload.y, maxY);
        nodesCount++;
      }
    });
    if (nodesCount > 0) {
      minX -= params.contentPadding;
      minY -= params.contentPadding;
      maxX += params.contentPadding;
      maxY += params.contentPadding;
      const contentBoxCenter = {
        x: (minX + maxX) / 2,
        y: (minY + maxY) / 2
      };
      const { scale } = this.viewportStore.getContentMatrix();
      const viewportBoxHeight = (maxY - minY) * scale;
      const viewportBoxWidth = (maxX - minX) * scale;
      const { width, height } = this.viewportStore.getDimensions();
      const ratio = Math.max(
        viewportBoxWidth / width,
        viewportBoxHeight / height
      );
      const fitContentScale = ratio > 1 ? scale / ratio : scale;
      const thresholdScale = Math.max(fitContentScale, params.minContentScale);
      this.center(contentBoxCenter, {
        contentScale: thresholdScale,
        animationDuration: params.animationDuration
      });
    }
  }
  animateNavigation(previousViewportMatrix, nextViewportMatrix, duration) {
    let start = void 0;
    const deltaMatrix = {
      scale: nextViewportMatrix.scale - previousViewportMatrix.scale,
      x: nextViewportMatrix.x - previousViewportMatrix.x,
      y: nextViewportMatrix.y - previousViewportMatrix.y
    };
    const step = (timestamp) => {
      if (start === void 0) {
        start = timestamp;
      }
      const progress = Math.min((timestamp - start) / duration, 1);
      if (progress <= 1) {
        this.viewportStore.patchViewportMatrix({
          scale: previousViewportMatrix.scale + progress * deltaMatrix.scale,
          x: previousViewportMatrix.x + progress * deltaMatrix.x,
          y: previousViewportMatrix.y + progress * deltaMatrix.y
        });
      }
      if (progress < 1) {
        this.win.requestAnimationFrame(step);
      }
    };
    this.win.requestAnimationFrame(step);
  }
}
const createOverlayCanvas = (overlayLayer, viewportStore, win) => {
  const graphStore = new GraphStore();
  const graph = new Graph(graphStore);
  const viewport = new Viewport(viewportStore);
  const htmlView = new CoreHtmlView(graphStore, viewportStore, overlayLayer);
  const graphControllerParams = {
    nodes: {
      centerFn: standardCenterFn,
      priorityFn: () => 0
    },
    edges: {
      shapeFactory: () => new DirectEdgeShape(),
      priorityFn: () => 0
    },
    ports: {
      direction: 0
    }
  };
  const graphController = new GraphController(
    graphStore,
    htmlView,
    graphControllerParams
  );
  const viewportControllerParams = {
    focus: {
      contentPadding: 0,
      minContentScale: 0,
      schedule: immediateScheduleFn,
      animationDuration: 0
    }
  };
  const viewportController = new ViewportController(
    graphStore,
    viewportStore,
    viewportControllerParams,
    win
  );
  return new Canvas(graph, viewport, graphController, viewportController);
};
class DraggablePortsConfigurator {
  constructor(canvas, window2, pointInsideVerifier, params) {
    __publicField(this, "onAfterPortMarked", (portId) => {
      const port = this.canvas.graph.getPort(portId);
      const elementPortIds = this.canvas.graph.findPortIdsByElement(port.element);
      if (elementPortIds.length === 1) {
        this.hookPortEvents(port.element);
      }
    });
    __publicField(this, "onBeforePortUnmarked", (portId) => {
      const port = this.canvas.graph.getPort(portId);
      const elementPortIds = this.canvas.graph.findPortIdsByElement(port.element);
      if (elementPortIds.length === 1) {
        this.unhookPortEvents(port.element);
      }
    });
    __publicField(this, "onPortMouseDown", (event) => {
      const mouseEvent = event;
      if (!this.params.mouseDownEventVerifier(mouseEvent)) {
        return;
      }
      const target = event.currentTarget;
      const portId = this.canvas.graph.findPortIdsByElement(target)[0];
      const accepted = this.params.onPortPointerDown(portId, {
        x: mouseEvent.clientX,
        y: mouseEvent.clientY
      });
      if (!accepted) {
        return;
      }
      event.stopPropagation();
      this.window.addEventListener("mousemove", this.onWindowMouseMove, {
        passive: true
      });
      this.window.addEventListener("mouseup", this.onWindowMouseUp, {
        passive: true
      });
    });
    __publicField(this, "onWindowMouseMove", (event) => {
      const isInside = this.pointInsideVerifier.verify(
        event.clientX,
        event.clientY
      );
      if (!isInside) {
        this.params.onPointerMoveOutside();
        this.stopMouseDrag();
        return;
      }
      this.params.onPointerMove({ x: event.clientX, y: event.clientY });
    });
    __publicField(this, "onWindowMouseUp", (event) => {
      if (!this.params.mouseUpEventVerifier(event)) {
        return;
      }
      this.params.onPointerUp({ x: event.clientX, y: event.clientY });
      this.stopMouseDrag();
    });
    __publicField(this, "onPortTouchStart", (event) => {
      const touchEvent = event;
      if (touchEvent.touches.length !== 1) {
        return;
      }
      const touch = touchEvent.touches[0];
      const target = event.currentTarget;
      const portId = this.canvas.graph.findPortIdsByElement(target)[0];
      const accepted = this.params.onPortPointerDown(portId, {
        x: touch.clientX,
        y: touch.clientY
      });
      if (!accepted) {
        return;
      }
      event.stopPropagation();
      this.window.addEventListener("touchmove", this.onWindowTouchMove, {
        passive: true
      });
      this.window.addEventListener("touchend", this.onWindowTouchFinish, {
        passive: true
      });
      this.window.addEventListener("touchcancel", this.onWindowTouchFinish, {
        passive: true
      });
    });
    __publicField(this, "onWindowTouchMove", (event) => {
      const touch = event.touches[0];
      const isInside = this.pointInsideVerifier.verify(
        touch.clientX,
        touch.clientY
      );
      if (!isInside) {
        this.params.onPointerMoveOutside();
        this.stopTouchDrag();
        return;
      }
      this.params.onPointerMove({ x: touch.clientX, y: touch.clientY });
    });
    __publicField(this, "onWindowTouchFinish", (event) => {
      const touch = event.changedTouches[0];
      this.params.onPointerUp({ x: touch.clientX, y: touch.clientY });
      this.stopTouchDrag();
    });
    __publicField(this, "reset", () => {
      this.canvas.graph.getAllPortIds().forEach((portId) => {
        const port = this.canvas.graph.getPort(portId);
        this.unhookPortEvents(port.element);
      });
    });
    __publicField(this, "revert", () => {
      this.params.onStopDrag();
      this.reset();
      this.removeWindowMouseListeners();
      this.removeWindowTouchListeners();
    });
    this.canvas = canvas;
    this.window = window2;
    this.pointInsideVerifier = pointInsideVerifier;
    this.params = params;
    this.canvas.graph.onAfterPortMarked.subscribe(this.onAfterPortMarked);
    this.canvas.graph.onBeforePortUnmarked.subscribe(this.onBeforePortUnmarked);
    this.canvas.graph.onBeforeClear.subscribe(this.reset);
    this.canvas.onBeforeDestroy.subscribe(this.revert);
  }
  static configure(canvas, win, pointInsideVerifier, params) {
    new DraggablePortsConfigurator(canvas, win, pointInsideVerifier, params);
  }
  hookPortEvents(element) {
    element.addEventListener("mousedown", this.onPortMouseDown, {
      passive: true
    });
    element.addEventListener("touchstart", this.onPortTouchStart, {
      passive: true
    });
  }
  unhookPortEvents(element) {
    element.removeEventListener("mousedown", this.onPortMouseDown);
    element.removeEventListener("touchstart", this.onPortTouchStart);
  }
  stopMouseDrag() {
    this.params.onStopDrag();
    this.removeWindowMouseListeners();
  }
  stopTouchDrag() {
    this.params.onStopDrag();
    this.removeWindowTouchListeners();
  }
  removeWindowMouseListeners() {
    this.window.removeEventListener("mousemove", this.onWindowMouseMove);
    this.window.removeEventListener("mouseup", this.onWindowMouseUp);
  }
  removeWindowTouchListeners() {
    this.window.removeEventListener("touchmove", this.onWindowTouchMove);
    this.window.removeEventListener("touchend", this.onWindowTouchFinish);
    this.window.removeEventListener("touchcancel", this.onWindowTouchFinish);
  }
}
class LayoutApplier {
  constructor(canvas, layoutAlgorithm, params) {
    this.canvas = canvas;
    this.layoutAlgorithm = layoutAlgorithm;
    this.params = params;
  }
  apply() {
    const coords = this.layoutAlgorithm.calculateCoordinates({
      graph: this.canvas.graph,
      viewport: this.canvas.viewport
    });
    this.params.onBeforeApplied();
    coords.forEach((point, nodeId) => {
      if (!this.params.staticNodeResolver(nodeId)) {
        this.canvas.updateNode(nodeId, point);
      }
    });
    this.params.onAfterApplied();
  }
}
class AnimatedLayoutApplier {
  constructor(canvas, layoutAlgorithm, params) {
    this.canvas = canvas;
    this.layoutAlgorithm = layoutAlgorithm;
    this.params = params;
  }
  apply(dt) {
    const coords = this.layoutAlgorithm.calculateNextCoordinates({
      graph: this.canvas.graph,
      viewport: this.canvas.viewport,
      dt
    });
    this.params.onBeforeApplied();
    coords.forEach((point, nodeId) => {
      if (!this.params.staticNodeResolver(nodeId)) {
        this.canvas.updateNode(nodeId, point);
      }
    });
    this.params.onAfterApplied();
  }
}
class UserDraggableNodesConfigurator {
  constructor(canvas, element, window2, pointInsideVerifier, params) {
    __publicField(this, "grabbedNode", null);
    __publicField(this, "maxNodePriority", 0);
    __publicField(this, "graph");
    __publicField(this, "onAfterNodeAdded", (nodeId) => {
      this.updateMaxNodePriority(nodeId);
      const { element } = this.graph.getNode(nodeId);
      element.addEventListener("mousedown", this.onMouseDown, {
        passive: true
      });
      element.addEventListener("touchstart", this.onTouchStart, {
        passive: true
      });
    });
    __publicField(this, "onAfterNodeUpdated", (nodeId) => {
      this.updateMaxNodePriority(nodeId);
    });
    __publicField(this, "onBeforeNodeRemoved", (nodeId) => {
      const { element } = this.graph.getNode(nodeId);
      element.removeEventListener("mousedown", this.onMouseDown);
      element.removeEventListener("touchstart", this.onTouchStart);
    });
    __publicField(this, "onMouseDown", (event) => {
      const mouseEvent = event;
      if (!this.params.mouseDownEventVerifier(mouseEvent)) {
        return;
      }
      const element = event.currentTarget;
      const nodeId = this.graph.findNodeIdByElement(element);
      const node = this.graph.getNode(nodeId);
      const isDragAllowed = this.params.nodeDragVerifier(nodeId);
      if (!isDragAllowed) {
        return;
      }
      this.params.onNodeDragStarted(nodeId);
      event.stopPropagation();
      const cursorContent = this.calculateContentPoint({
        x: mouseEvent.clientX,
        y: mouseEvent.clientY
      });
      this.grabbedNode = {
        nodeId,
        dx: cursorContent.x - node.x,
        dy: cursorContent.y - node.y
      };
      setCursor(this.element, this.params.dragCursor);
      this.moveNodeOnTop(nodeId);
      this.window.addEventListener("mousemove", this.onWindowMouseMove, {
        passive: true
      });
      this.window.addEventListener("mouseup", this.onWindowMouseUp, {
        passive: true
      });
    });
    __publicField(this, "onTouchStart", (event) => {
      const touchEvent = event;
      if (touchEvent.touches.length !== 1) {
        return;
      }
      event.stopPropagation();
      const touch = touchEvent.touches[0];
      const element = event.currentTarget;
      const nodeId = this.canvas.graph.findNodeIdByElement(element);
      const node = this.graph.getNode(nodeId);
      const isDragAllowed = this.params.nodeDragVerifier({
        nodeId,
        element: node.element,
        x: node.x,
        y: node.y
      });
      if (!isDragAllowed) {
        return;
      }
      const cursorContent = this.calculateContentPoint({
        x: touch.clientX,
        y: touch.clientY
      });
      this.grabbedNode = {
        nodeId,
        dx: cursorContent.x - node.x,
        dy: cursorContent.y - node.y
      };
      this.moveNodeOnTop(nodeId);
      this.window.addEventListener("touchmove", this.onWindowTouchMove, {
        passive: true
      });
      this.window.addEventListener("touchend", this.onWindowTouchFinish, {
        passive: true
      });
      this.window.addEventListener("touchcancel", this.onWindowTouchFinish, {
        passive: true
      });
    });
    __publicField(this, "onWindowMouseMove", (event) => {
      const isInside = this.pointInsideVerifier.verify(
        event.clientX,
        event.clientY
      );
      if (!isInside) {
        this.stopMouseDrag();
        return;
      }
      if (this.grabbedNode !== null) {
        this.moveNode(this.grabbedNode, {
          x: event.clientX,
          y: event.clientY
        });
      }
    });
    __publicField(this, "onWindowMouseUp", (event) => {
      if (!this.params.mouseUpEventVerifier(event)) {
        return;
      }
      this.stopMouseDrag();
    });
    __publicField(this, "onWindowTouchMove", (event) => {
      if (event.touches.length !== 1) {
        return;
      }
      const touch = event.touches[0];
      const isInside = this.pointInsideVerifier.verify(
        touch.clientX,
        touch.clientY
      );
      if (!isInside) {
        this.stopTouchDrag();
        return;
      }
      if (this.grabbedNode !== null) {
        this.moveNode(this.grabbedNode, {
          x: touch.clientX,
          y: touch.clientY
        });
      }
    });
    __publicField(this, "onWindowTouchFinish", () => {
      this.stopTouchDrag();
    });
    __publicField(this, "reset", () => {
      this.canvas.graph.getAllNodeIds().forEach((nodeId) => {
        const { element } = this.canvas.graph.getNode(nodeId);
        element.removeEventListener("mousedown", this.onMouseDown);
        element.removeEventListener("touchstart", this.onTouchStart);
      });
      this.maxNodePriority = 0;
    });
    __publicField(this, "revert", () => {
      this.reset();
      this.removeMouseDragListeners();
      this.removeTouchDragListeners();
    });
    this.canvas = canvas;
    this.element = element;
    this.window = window2;
    this.pointInsideVerifier = pointInsideVerifier;
    this.params = params;
    this.graph = canvas.graph;
    this.graph.onAfterNodeAdded.subscribe(this.onAfterNodeAdded);
    this.graph.onAfterNodeUpdated.subscribe(this.onAfterNodeUpdated);
    this.graph.onBeforeNodeRemoved.subscribe(this.onBeforeNodeRemoved);
    this.graph.onBeforeClear.subscribe(this.reset);
    this.canvas.onBeforeDestroy.subscribe(this.revert);
  }
  static configure(canvas, element, win, pointInsideVerifier, config) {
    new UserDraggableNodesConfigurator(
      canvas,
      element,
      win,
      pointInsideVerifier,
      config
    );
  }
  moveNode(state, cursor) {
    if (!this.graph.hasNode(state.nodeId)) {
      return;
    }
    const contentPoint = this.calculateContentPoint(cursor);
    const newCoords = {
      x: contentPoint.x - state.dx,
      y: contentPoint.y - state.dy
    };
    const adjustedCoords = this.adjustNodeCoords(newCoords);
    this.canvas.updateNode(state.nodeId, {
      x: adjustedCoords.x,
      y: adjustedCoords.y
    });
    this.params.onNodeDrag(state.nodeId);
  }
  moveNodeOnTop(nodeId) {
    if (!this.params.moveOnTop) {
      return;
    }
    this.maxNodePriority++;
    if (this.params.moveEdgesOnTop) {
      const edgePriority = this.maxNodePriority;
      this.maxNodePriority++;
      const edges = this.graph.getNodeAdjacentEdgeIds(nodeId);
      edges.forEach((edgeId) => {
        this.canvas.updateEdge(edgeId, { priority: edgePriority });
      });
    }
    this.canvas.updateNode(nodeId, { priority: this.maxNodePriority });
  }
  stopMouseDrag() {
    if (this.grabbedNode !== null && this.graph.hasNode(this.grabbedNode.nodeId)) {
      this.params.onNodeDragFinished(this.grabbedNode.nodeId);
    }
    this.grabbedNode = null;
    setCursor(this.element, null);
    this.removeMouseDragListeners();
  }
  removeMouseDragListeners() {
    this.window.removeEventListener("mouseup", this.onWindowMouseUp);
    this.window.removeEventListener("mousemove", this.onWindowMouseMove);
  }
  stopTouchDrag() {
    if (this.grabbedNode !== null && this.graph.hasNode(this.grabbedNode.nodeId)) {
      const node = this.graph.getNode(this.grabbedNode.nodeId);
      this.params.onNodeDragFinished({
        nodeId: this.grabbedNode.nodeId,
        element: node.element,
        x: node.x,
        y: node.y
      });
    }
    this.grabbedNode = null;
    this.removeTouchDragListeners();
  }
  removeTouchDragListeners() {
    this.window.removeEventListener("touchmove", this.onWindowTouchMove);
    this.window.removeEventListener("touchend", this.onWindowTouchFinish);
    this.window.removeEventListener("touchcancel", this.onWindowTouchFinish);
  }
  updateMaxNodePriority(nodeId) {
    const priority = this.graph.getNode(nodeId).priority;
    this.maxNodePriority = Math.max(this.maxNodePriority, priority);
  }
  calculateContentPoint(clientPoint) {
    const rect = this.element.getBoundingClientRect();
    const contentPoint = this.canvas.viewport.createContentCoords({
      x: clientPoint.x - rect.x,
      y: clientPoint.y - rect.y
    });
    return contentPoint;
  }
  adjustNodeCoords(coords) {
    const gridSize = this.params.gridSize;
    if (gridSize !== null) {
      const half = gridSize / 2;
      return {
        x: Math.floor((coords.x + half) / gridSize) * gridSize,
        y: Math.floor((coords.y + half) / gridSize) * gridSize
      };
    }
    return coords;
  }
}
const processTouch = (event) => {
  const touches = [];
  const cnt = event.touches.length;
  for (let i = 0; i < cnt; i++) {
    touches.push([event.touches[i].clientX, event.touches[i].clientY]);
  }
  const sum = touches.reduce(
    (acc, cur) => [acc[0] + cur[0], acc[1] + cur[1]],
    [0, 0]
  );
  const avg = [sum[0] / cnt, sum[1] / cnt];
  const distances = touches.map((cur) => [cur[0] - avg[0], cur[1] - avg[1]]);
  const distance = distances.reduce(
    (acc, cur) => acc + Math.sqrt(cur[0] * cur[0] + cur[1] * cur[1]),
    0
  );
  return {
    x: avg[0],
    y: avg[1],
    scale: distance / cnt,
    touchesCnt: cnt,
    touches
  };
};
class UserTransformableViewportConfigurator {
  constructor(canvas, element, window2, pointInsideVerifier, params) {
    __publicField(this, "viewport");
    __publicField(this, "prevTouches", null);
    __publicField(this, "wheelFinishTimer", null);
    __publicField(this, "transformInProgress", false);
    __publicField(this, "revert", () => {
      this.removeMouseDragListeners();
      this.removeTouchDragListeners();
    });
    __publicField(this, "onMouseDown", (event) => {
      if (!this.params.mouseDownEventVerifier(event)) {
        return;
      }
      setCursor(this.element, this.params.shiftCursor);
      this.window.addEventListener("mousemove", this.onWindowMouseMove, {
        passive: true
      });
      this.window.addEventListener("mouseup", this.onWindowMouseUp, {
        passive: true
      });
      this.startRegisteredTransform();
    });
    __publicField(this, "onWindowMouseMove", (event) => {
      const isInside = this.pointInsideVerifier.verify(
        event.clientX,
        event.clientY
      );
      if (this.element === null || !isInside) {
        this.stopMouseDrag();
        return;
      }
      const deltaViewX = -event.movementX;
      const deltaViewY = -event.movementY;
      this.moveViewport(deltaViewX, deltaViewY);
    });
    __publicField(this, "onWindowMouseUp", (event) => {
      if (!this.params.mouseUpEventVerifier(event)) {
        return;
      }
      this.stopMouseDrag();
    });
    __publicField(this, "onWheelScroll", (event) => {
      if (!this.params.mouseWheelEventVerifier(event)) {
        return;
      }
      const { left, top } = this.element.getBoundingClientRect();
      const centerX = event.clientX - left;
      const centerY = event.clientY - top;
      const deltaScale = event.deltaY < 0 ? this.params.wheelSensitivity : 1 / this.params.wheelSensitivity;
      const deltaViewScale = 1 / deltaScale;
      if (this.wheelFinishTimer === null) {
        this.params.onTransformStarted();
      }
      this.scaleViewport(deltaViewScale, centerX, centerY);
      if (this.wheelFinishTimer !== null) {
        clearTimeout(this.wheelFinishTimer);
      }
      this.wheelFinishTimer = setTimeout(() => {
        if (!this.transformInProgress) {
          this.params.onTransformFinished();
        }
        this.wheelFinishTimer = null;
      }, this.params.scaleWheelFinishTimeout);
    });
    __publicField(this, "onTouchStart", (event) => {
      if (this.prevTouches !== null) {
        this.prevTouches = processTouch(event);
        return;
      }
      this.prevTouches = processTouch(event);
      this.window.addEventListener("touchmove", this.onWindowTouchMove, {
        passive: true
      });
      this.window.addEventListener("touchend", this.onWindowTouchFinish, {
        passive: true
      });
      this.window.addEventListener("touchcancel", this.onWindowTouchFinish, {
        passive: true
      });
      this.startRegisteredTransform();
    });
    __publicField(this, "onWindowTouchMove", (event) => {
      const currentTouches = processTouch(event);
      const isEvery = currentTouches.touches.every(
        (touch) => this.pointInsideVerifier.verify(touch[0], touch[1])
      );
      if (!isEvery) {
        this.stopTouchDrag();
        return;
      }
      if (currentTouches.touchesCnt === 1 || currentTouches.touchesCnt === 2) {
        this.moveViewport(
          -(currentTouches.x - this.prevTouches.x),
          -(currentTouches.y - this.prevTouches.y)
        );
      }
      if (currentTouches.touchesCnt === 2) {
        const { left, top } = this.element.getBoundingClientRect();
        const x = this.prevTouches.x - left;
        const y = this.prevTouches.y - top;
        const deltaScale = currentTouches.scale / this.prevTouches.scale;
        const deltaViewScale = 1 / deltaScale;
        this.scaleViewport(deltaViewScale, x, y);
      }
      this.prevTouches = currentTouches;
    });
    __publicField(this, "onWindowTouchFinish", (event) => {
      if (event.touches.length > 0) {
        this.prevTouches = processTouch(event);
      } else {
        this.stopTouchDrag();
      }
    });
    __publicField(this, "preventWheelScaleListener", (event) => {
      event.preventDefault();
    });
    this.canvas = canvas;
    this.element = element;
    this.window = window2;
    this.pointInsideVerifier = pointInsideVerifier;
    this.params = params;
    this.element.addEventListener("wheel", this.preventWheelScaleListener, {
      passive: false
    });
    this.viewport = canvas.viewport;
    this.handleResize();
    this.viewport.onAfterResize.subscribe(() => {
      this.handleResize();
    });
    this.element.addEventListener("mousedown", this.onMouseDown, {
      passive: true
    });
    this.element.addEventListener("wheel", this.onWheelScroll, {
      passive: true
    });
    this.element.addEventListener("touchstart", this.onTouchStart, {
      passive: true
    });
    canvas.onBeforeDestroy.subscribe(this.revert);
  }
  static configure(canvas, element, win, pointInsideVerifier, params) {
    new UserTransformableViewportConfigurator(
      canvas,
      element,
      win,
      pointInsideVerifier,
      params
    );
  }
  moveViewport(dx, dy) {
    const prevTransform = this.viewport.getViewportMatrix();
    const nextTransform = applyMatrixMove(prevTransform, dx, dy);
    const { width, height } = this.viewport.getDimensions();
    const transform = this.params.transformPreprocessor({
      prevTransform,
      nextTransform,
      canvasWidth: width,
      canvasHeight: height
    });
    this.performTransform(transform);
  }
  scaleViewport(s2, cx, cy) {
    const prevTransform = this.canvas.viewport.getViewportMatrix();
    const nextTransform = applyMatrixScale(prevTransform, s2, cx, cy);
    const { width, height } = this.viewport.getDimensions();
    const transform = this.params.transformPreprocessor({
      prevTransform,
      nextTransform,
      canvasWidth: width,
      canvasHeight: height
    });
    this.performTransform(transform);
  }
  stopMouseDrag() {
    setCursor(this.element, null);
    this.removeMouseDragListeners();
    this.finishRegisteredTransform();
  }
  removeMouseDragListeners() {
    this.window.removeEventListener("mousemove", this.onWindowMouseMove);
    this.window.removeEventListener("mouseup", this.onWindowMouseUp);
  }
  stopTouchDrag() {
    this.prevTouches = null;
    this.removeTouchDragListeners();
    this.finishRegisteredTransform();
  }
  removeTouchDragListeners() {
    this.window.removeEventListener("touchmove", this.onWindowTouchMove);
    this.window.removeEventListener("touchend", this.onWindowTouchFinish);
    this.window.removeEventListener("touchcancel", this.onWindowTouchFinish);
  }
  performTransform(viewportTransform) {
    this.params.onBeforeTransformChange();
    this.canvas.patchViewportMatrix(viewportTransform);
    this.params.onTransformChange();
  }
  startRegisteredTransform() {
    this.transformInProgress = true;
    this.params.onTransformStarted();
  }
  finishRegisteredTransform() {
    this.transformInProgress = false;
    this.params.onTransformFinished();
  }
  handleResize() {
    const prevTransform = this.viewport.getViewportMatrix();
    const { width, height } = this.viewport.getDimensions();
    const transform = this.params.transformPreprocessor({
      prevTransform,
      nextTransform: prevTransform,
      canvasWidth: width,
      canvasHeight: height
    });
    this.params.onResizeTransformStarted();
    this.canvas.patchViewportMatrix(transform);
    this.params.onResizeTransformFinished();
  }
}
class UserTransformableViewportVirtualScrollConfigurator {
  constructor(canvas, element, window2, transformParams, trigger, pointInsideVerifier, params) {
    __publicField(this, "nodeHorizontal");
    __publicField(this, "nodeVertical");
    __publicField(this, "viewport");
    __publicField(this, "currentScale");
    __publicField(this, "loadedArea", {
      xFrom: Infinity,
      xTo: Infinity,
      yFrom: Infinity,
      yTo: Infinity
    });
    __publicField(this, "updateLoadedArea", (renderingBox) => {
      this.loadedArea = {
        xFrom: renderingBox.x,
        xTo: renderingBox.x + renderingBox.width,
        yFrom: renderingBox.y,
        yTo: renderingBox.y + renderingBox.height
      };
    });
    __publicField(this, "onAfterViewportUpdated", () => {
      if (!this.userTransformInProgress) {
        this.loadAreaAroundViewport();
      }
    });
    __publicField(this, "userTransformInProgress", false);
    this.canvas = canvas;
    this.element = element;
    this.window = window2;
    this.trigger = trigger;
    this.pointInsideVerifier = pointInsideVerifier;
    this.params = params;
    this.nodeHorizontal = this.params.nodeVerticalRadius;
    this.nodeVertical = this.params.nodeHorizontalRadius;
    this.viewport = canvas.viewport;
    this.currentScale = this.viewport.getViewportMatrix().scale;
    this.scheduleLoadAreaAroundViewport();
    this.viewport.onAfterResize.subscribe(() => {
      this.scheduleLoadAreaAroundViewport();
    });
    const patchedTransformableViewportParams = {
      ...transformParams,
      onResizeTransformStarted: () => {
        this.userTransformInProgress = true;
        transformParams.onResizeTransformStarted();
      },
      onResizeTransformFinished: () => {
        this.userTransformInProgress = false;
        transformParams.onResizeTransformFinished();
      },
      onBeforeTransformChange: () => {
        this.userTransformInProgress = true;
        transformParams.onBeforeTransformChange();
      },
      onTransformChange: () => {
        this.userTransformInProgress = false;
        const previousScale = this.currentScale;
        this.currentScale = this.viewport.getViewportMatrix().scale;
        if (previousScale !== this.currentScale) {
          this.scheduleEnsureViewportAreaLoaded();
        }
        transformParams.onTransformChange();
      },
      onTransformFinished: () => {
        this.scheduleLoadAreaAroundViewport();
        transformParams.onTransformFinished();
      }
    };
    UserTransformableViewportConfigurator.configure(
      canvas,
      this.element,
      this.window,
      this.pointInsideVerifier,
      patchedTransformableViewportParams
    );
    this.trigger.subscribe(this.updateLoadedArea);
    this.canvas.viewport.onAfterUpdated.subscribe(this.onAfterViewportUpdated);
  }
  static configure(canvas, element, win, transformParams, trigger, pointInsideVerifier, virtualScrollOptions) {
    new UserTransformableViewportVirtualScrollConfigurator(
      canvas,
      element,
      win,
      transformParams,
      trigger,
      pointInsideVerifier,
      virtualScrollOptions
    );
  }
  scheduleLoadAreaAroundViewport() {
    setTimeout(() => {
      this.loadAreaAroundViewport();
    });
  }
  scheduleEnsureViewportAreaLoaded() {
    setTimeout(() => {
      const { width, height } = this.viewport.getDimensions();
      const { scale, x, y } = this.viewport.getViewportMatrix();
      const absoluteViewportWidth = width * scale;
      const absoluteViewportHeight = height * scale;
      const xViewportFrom = x - this.nodeHorizontal;
      const yViewportFrom = y - this.nodeVertical;
      const xViewportTo = x + absoluteViewportWidth + this.nodeHorizontal;
      const yViewportTo = y + absoluteViewportHeight + this.nodeVertical;
      const isLoaded = this.loadedArea.xFrom < xViewportFrom && this.loadedArea.xTo > xViewportTo && this.loadedArea.yFrom < yViewportFrom && this.loadedArea.yTo > yViewportTo;
      if (!isLoaded) {
        this.loadAreaAroundViewport();
      }
    });
  }
  loadAreaAroundViewport() {
    const { width, height } = this.viewport.getDimensions();
    const { scale, x, y } = this.viewport.getViewportMatrix();
    const absoluteViewportWidth = width * scale;
    const absoluteViewportHeight = height * scale;
    const totalX = x - absoluteViewportWidth - this.nodeHorizontal;
    const totalY = y - absoluteViewportHeight - this.nodeVertical;
    const totalWidth = 3 * absoluteViewportWidth + 2 * this.nodeHorizontal;
    const totalHeight = 3 * absoluteViewportHeight + 2 * this.nodeVertical;
    this.trigger.emit({
      x: totalX,
      y: totalY,
      width: totalWidth,
      height: totalHeight
    });
  }
}
const createSvg = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.style.position = "absolute";
  svg.style.inset = "0";
  return svg;
};
const createPatternFilledRectangle = () => {
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("fill", "url(#pattern)");
  return rect;
};
const createPattern = () => {
  const pattern = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "pattern"
  );
  pattern.setAttribute("id", "pattern");
  return pattern;
};
class BackgroundConfigurator {
  constructor(canvas, params, backgroundHost) {
    __publicField(this, "svg", createSvg());
    __publicField(this, "patternRenderingRectangle", createPatternFilledRectangle());
    __publicField(this, "pattern", createPattern());
    __publicField(this, "patternContent");
    __publicField(this, "tileWidth");
    __publicField(this, "tileHeight");
    __publicField(this, "halfTileWidth");
    __publicField(this, "halfTileHeight");
    __publicField(this, "maxViewportScale");
    __publicField(this, "visible", false);
    __publicField(this, "onAfterTransformUpdated", () => {
      const matrix = this.canvas.viewport.getContentMatrix();
      const x = matrix.x - this.halfTileWidth * matrix.scale;
      const y = matrix.y - this.halfTileHeight * matrix.scale;
      const transform = `matrix(${matrix.scale}, 0, 0, ${matrix.scale}, ${x}, ${y})`;
      this.pattern.setAttribute("patternTransform", transform);
      this.updateVisibility();
    });
    this.canvas = canvas;
    this.backgroundHost = backgroundHost;
    this.tileWidth = params.tileWidth;
    this.tileHeight = params.tileHeight;
    this.halfTileWidth = this.tileWidth / 2;
    this.halfTileHeight = this.tileHeight / 2;
    this.patternContent = params.renderer;
    this.maxViewportScale = params.maxViewportScale;
    const transform = `translate(${this.halfTileWidth}, ${this.halfTileHeight})`;
    this.patternContent.setAttribute("transform", transform);
    this.pattern.appendChild(this.patternContent);
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.appendChild(this.pattern);
    this.svg.appendChild(defs);
    this.svg.appendChild(this.patternRenderingRectangle);
    this.updateDimensions();
    this.canvas.viewport.onAfterResize.subscribe(() => {
      this.updateDimensions();
    });
    this.canvas.viewport.onAfterUpdated.subscribe(this.onAfterTransformUpdated);
    this.onAfterTransformUpdated();
  }
  static configure(canvas, config, host) {
    new BackgroundConfigurator(canvas, config, host);
  }
  updateVisibility() {
    const { scale } = this.canvas.viewport.getViewportMatrix();
    const scaleReached = scale > this.maxViewportScale;
    if (scaleReached && this.visible) {
      this.visible = false;
      this.backgroundHost.removeChild(this.svg);
    } else if (!scaleReached && !this.visible) {
      this.visible = true;
      this.backgroundHost.appendChild(this.svg);
    }
  }
  updateDimensions() {
    const { width, height } = this.canvas.viewport.getDimensions();
    this.svg.setAttribute("width", `${width}`);
    this.svg.setAttribute("height", `${height}`);
    this.patternRenderingRectangle.setAttribute("width", `${width}`);
    this.patternRenderingRectangle.setAttribute("height", `${height}`);
    if (width > 0 && height > 0) {
      const patternWidth = this.tileWidth / width;
      const patternHeight = this.tileHeight / height;
      this.pattern.setAttribute("width", `${patternWidth}`);
      this.pattern.setAttribute("height", `${patternHeight}`);
    }
  }
}
class UserConnectablePortsConfigurator {
  constructor(canvas, overlayLayer, viewportStore, window2, pointInsideVerifier, params) {
    __publicField(this, "overlayCanvas");
    __publicField(this, "staticPortId", null);
    __publicField(this, "isTargetDragging", true);
    __publicField(this, "onEdgeCreated", (edgeId) => {
      this.params.onAfterEdgeCreated(edgeId);
    });
    this.canvas = canvas;
    this.overlayLayer = overlayLayer;
    this.viewportStore = viewportStore;
    this.window = window2;
    this.pointInsideVerifier = pointInsideVerifier;
    this.params = params;
    this.overlayCanvas = createOverlayCanvas(
      this.overlayLayer,
      this.viewportStore,
      this.window
    );
    DraggablePortsConfigurator.configure(
      this.canvas,
      this.window,
      this.pointInsideVerifier,
      {
        mouseDownEventVerifier: this.params.mouseDownEventVerifier,
        mouseUpEventVerifier: this.params.mouseUpEventVerifier,
        onStopDrag: () => {
          this.resetDragState();
        },
        onPortPointerDown: (portId, cursor) => {
          const connectionType = this.params.connectionTypeResolver(portId);
          if (connectionType === null) {
            return false;
          }
          this.grabPort(portId, cursor, connectionType);
          return true;
        },
        onPointerMove: (cursor) => {
          this.moveDraggingPort(cursor);
        },
        onPointerMoveOutside: () => {
          this.handleEdgeCreationInterrupted();
        },
        onPointerUp: (cursor) => {
          this.tryCreateConnection(cursor);
        }
      }
    );
  }
  static configure(canvas, overlayLayer, viewportStore, win, pointInsideVerifier, params) {
    new UserConnectablePortsConfigurator(
      canvas,
      overlayLayer,
      viewportStore,
      win,
      pointInsideVerifier,
      params
    );
  }
  grabPort(portId, cursor, connectionType) {
    const port = this.canvas.graph.getPort(portId);
    this.staticPortId = portId;
    const portRect = port.element.getBoundingClientRect();
    const portX = portRect.x + portRect.width / 2;
    const portY = portRect.y + portRect.height / 2;
    const canvasRect = this.overlayLayer.getBoundingClientRect();
    const portPoint = this.canvas.viewport.createContentCoords({
      x: portX - canvasRect.x,
      y: portY - canvasRect.y
    });
    const cursorPoint = this.canvas.viewport.createContentCoords({
      x: cursor.x - canvasRect.x,
      y: cursor.y - canvasRect.y
    });
    const staticParams = {
      overlayNodeId: OverlayId.StaticNodeId,
      portCoords: portPoint,
      portDirection: port.direction
    };
    const draggingParams = {
      overlayNodeId: OverlayId.DraggingNodeId,
      portCoords: cursorPoint,
      portDirection: this.params.dragPortDirection
    };
    this.isTargetDragging = connectionType === "direct";
    const [sourceParams, targetParams] = this.isTargetDragging ? [staticParams, draggingParams] : [draggingParams, staticParams];
    this.overlayCanvas.addNode(createAddNodeOverlayRequest(sourceParams));
    this.overlayCanvas.addNode(createAddNodeOverlayRequest(targetParams));
    this.overlayCanvas.addEdge({
      from: sourceParams.overlayNodeId,
      to: targetParams.overlayNodeId,
      shape: this.params.edgeShapeFactory(OverlayId.EdgeId)
    });
  }
  resetDragState() {
    this.staticPortId = null;
    this.isTargetDragging = true;
    this.overlayCanvas.clear();
  }
  tryCreateConnection(cursor) {
    const draggingPortId = findPortAtPoint(this.canvas.graph, cursor);
    if (draggingPortId === null) {
      this.handleEdgeCreationInterrupted();
      return;
    }
    const staticPortId = this.staticPortId;
    const sourceId = this.isTargetDragging ? staticPortId : draggingPortId;
    const targetId = this.isTargetDragging ? draggingPortId : staticPortId;
    const request = { from: sourceId, to: targetId };
    const processedRequest = this.params.connectionPreprocessor(request);
    if (processedRequest !== null) {
      this.canvas.graph.onAfterEdgeAdded.subscribe(this.onEdgeCreated);
      this.canvas.addEdge(processedRequest);
      this.canvas.graph.onAfterEdgeAdded.unsubscribe(this.onEdgeCreated);
    } else {
      this.params.onEdgeCreationPrevented(request);
    }
  }
  moveDraggingPort(dragPoint) {
    const canvasRect = this.overlayLayer.getBoundingClientRect();
    const nodeContentCoords = this.canvas.viewport.createContentCoords({
      x: dragPoint.x - canvasRect.x,
      y: dragPoint.y - canvasRect.y
    });
    this.overlayCanvas.updateNode(OverlayId.DraggingNodeId, {
      x: nodeContentCoords.x,
      y: nodeContentCoords.y
    });
  }
  handleEdgeCreationInterrupted() {
    const staticPortId = this.staticPortId;
    this.params.onEdgeCreationInterrupted({
      staticPortId,
      isDirect: this.isTargetDragging
    });
  }
}
class UserDraggableEdgesConfigurator {
  constructor(canvas, overlayLayer, viewportStore, window2, pointInsideVerifier, params) {
    __publicField(this, "overlayCanvas");
    __publicField(this, "staticPortId", null);
    __publicField(this, "isTargetDragging", true);
    __publicField(this, "draggingEdgePayload", null);
    __publicField(this, "onEdgeReattached", (edgeId) => {
      this.params.onAfterEdgeReattached(edgeId);
    });
    this.canvas = canvas;
    this.overlayLayer = overlayLayer;
    this.viewportStore = viewportStore;
    this.window = window2;
    this.pointInsideVerifier = pointInsideVerifier;
    this.params = params;
    this.overlayCanvas = createOverlayCanvas(
      this.overlayLayer,
      this.viewportStore,
      this.window
    );
    DraggablePortsConfigurator.configure(
      this.canvas,
      this.window,
      this.pointInsideVerifier,
      {
        mouseDownEventVerifier: this.params.mouseDownEventVerifier,
        mouseUpEventVerifier: this.params.mouseUpEventVerifier,
        onStopDrag: () => {
          this.resetDragState();
        },
        onPortPointerDown: (portId, cursor) => {
          return this.tryStartEdgeDragging(portId, cursor);
        },
        onPointerMove: (cursor) => {
          this.moveDraggingPort(cursor);
        },
        onPointerMoveOutside: () => {
          this.handleEdgeReattachInterrupted();
        },
        onPointerUp: (cursor) => {
          this.tryCreateConnection(cursor);
        }
      }
    );
  }
  static configure(canvas, overlayLayer, viewportStore, win, pointInsideVerifier, params) {
    new UserDraggableEdgesConfigurator(
      canvas,
      overlayLayer,
      viewportStore,
      win,
      pointInsideVerifier,
      params
    );
  }
  tryStartEdgeDragging(portId, cursor) {
    const edgeId = this.params.draggingEdgeResolver(portId);
    if (edgeId === null || !this.canvas.graph.hasEdge(edgeId)) {
      return false;
    }
    const edge = this.canvas.graph.getEdge(edgeId);
    const isSourceDragging = portId === edge.from;
    const isTargetDragging = portId === edge.to;
    const staticPortId = isSourceDragging ? edge.to : edge.from;
    this.staticPortId = staticPortId;
    this.isTargetDragging = isTargetDragging;
    const draggingPort = this.canvas.graph.getPort(portId);
    const staticPort = this.canvas.graph.getPort(staticPortId);
    const staticRect = staticPort.element.getBoundingClientRect();
    const staticCoords = {
      x: staticRect.x + staticRect.width / 2,
      y: staticRect.y + staticRect.height / 2
    };
    const canvasRect = this.overlayLayer.getBoundingClientRect();
    const staticPoint = this.canvas.viewport.createContentCoords({
      x: staticCoords.x - canvasRect.x,
      y: staticCoords.y - canvasRect.y
    });
    const draggingPoint = this.canvas.viewport.createContentCoords({
      x: cursor.x - canvasRect.x,
      y: cursor.y - canvasRect.y
    });
    this.draggingEdgePayload = {
      id: edgeId,
      from: edge.from,
      to: edge.to,
      shape: edge.shape,
      priority: edge.priority
    };
    this.canvas.removeEdge(edgeId);
    const staticParams = {
      overlayNodeId: OverlayId.StaticNodeId,
      portCoords: staticPoint,
      portDirection: staticPort.direction
    };
    const draggingParams = {
      overlayNodeId: OverlayId.DraggingNodeId,
      portCoords: draggingPoint,
      portDirection: draggingPort.direction
    };
    const [sourceParams, targetParams] = this.isTargetDragging ? [staticParams, draggingParams] : [draggingParams, staticParams];
    this.overlayCanvas.addNode(createAddNodeOverlayRequest(sourceParams));
    this.overlayCanvas.addNode(createAddNodeOverlayRequest(targetParams));
    const overlayEdgeShape = this.params.draggingEdgeShapeFactory !== null ? this.params.draggingEdgeShapeFactory(OverlayId.EdgeId) : edge.shape;
    this.overlayCanvas.addEdge({
      id: OverlayId.EdgeId,
      from: sourceParams.overlayNodeId,
      to: targetParams.overlayNodeId,
      shape: overlayEdgeShape
    });
    return true;
  }
  resetDragState() {
    this.draggingEdgePayload = null;
    this.staticPortId = null;
    this.isTargetDragging = true;
    this.overlayCanvas.clear();
  }
  moveDraggingPort(dragPoint) {
    const canvasRect = this.overlayLayer.getBoundingClientRect();
    const nodeViewCoords = {
      x: dragPoint.x - canvasRect.x,
      y: dragPoint.y - canvasRect.y
    };
    const nodeContentCoords = this.canvas.viewport.createContentCoords(nodeViewCoords);
    this.overlayCanvas.updateNode(OverlayId.DraggingNodeId, {
      x: nodeContentCoords.x,
      y: nodeContentCoords.y
    });
  }
  tryCreateConnection(cursor) {
    const draggingPortId = findPortAtPoint(this.canvas.graph, cursor);
    this.overlayCanvas.removeEdge(OverlayId.EdgeId);
    if (draggingPortId === null) {
      this.handleEdgeReattachInterrupted();
      return;
    }
    const [from, to] = this.isTargetDragging ? [this.staticPortId, draggingPortId] : [draggingPortId, this.staticPortId];
    const edge = this.draggingEdgePayload;
    const request = {
      id: edge.id,
      from,
      to,
      shape: edge.shape,
      priority: edge.priority
    };
    const processedRequest = this.params.connectionPreprocessor(request);
    if (processedRequest !== null) {
      this.canvas.graph.onAfterEdgeAdded.subscribe(this.onEdgeReattached);
      this.canvas.addEdge(processedRequest);
      this.canvas.graph.onAfterEdgeAdded.unsubscribe(this.onEdgeReattached);
    } else {
      const edge2 = this.draggingEdgePayload;
      this.params.onEdgeReattachPrevented({
        id: edge2.id,
        from: edge2.from,
        to: edge2.to,
        shape: edge2.shape,
        priority: edge2.priority
      });
    }
  }
  handleEdgeReattachInterrupted() {
    const edge = this.draggingEdgePayload;
    this.params.onEdgeReattachInterrupted({
      id: edge.id,
      from: edge.from,
      to: edge.to,
      shape: edge.shape,
      priority: edge.priority
    });
  }
}
class ManualLayoutApplicationStrategyConfigurator {
  constructor(applier, trigger) {
    this.applier = applier;
    this.trigger = trigger;
    this.trigger.subscribe(() => {
      this.applier.apply();
    });
  }
  static configure(applier, trigger) {
    new ManualLayoutApplicationStrategyConfigurator(applier, trigger);
  }
}
class TopologyChangeAsyncLayoutApplicationStrategyConfigurator {
  constructor(graph, applier, defererFn) {
    __publicField(this, "applyScheduled", false);
    __publicField(this, "apply", () => {
      this.applyScheduled = false;
      this.applier.apply();
    });
    this.graph = graph;
    this.applier = applier;
    this.defererFn = defererFn;
    this.graph.onAfterNodeAdded.subscribe(() => {
      this.scheduleApply();
    });
    this.graph.onBeforeNodeRemoved.subscribe(() => {
      this.scheduleApply();
    });
    this.graph.onAfterEdgeAdded.subscribe(() => {
      this.scheduleApply();
    });
    this.graph.onBeforeEdgeRemoved.subscribe(() => {
      this.scheduleApply();
    });
  }
  static configure(graph, applier, defererFn) {
    new TopologyChangeAsyncLayoutApplicationStrategyConfigurator(
      graph,
      applier,
      defererFn
    );
  }
  scheduleApply() {
    if (this.applyScheduled) {
      return;
    }
    this.applyScheduled = true;
    this.defererFn(this.apply);
  }
}
class LayoutConfigurator {
  static configure(canvas, params) {
    const strategy = params.applyOn;
    const applier = new LayoutApplier(canvas, params.algorithm, {
      staticNodeResolver: params.staticNodeResolver,
      onBeforeApplied: params.onBeforeApplied,
      onAfterApplied: params.onAfterApplied
    });
    switch (strategy.type) {
      case "trigger": {
        ManualLayoutApplicationStrategyConfigurator.configure(
          applier,
          strategy.trigger
        );
        break;
      }
      case "topologyChangeSchedule": {
        TopologyChangeAsyncLayoutApplicationStrategyConfigurator.configure(
          canvas.graph,
          applier,
          strategy.schedule
        );
        break;
      }
    }
  }
}
class AnimationSeries {
  constructor(win, callback) {
    __publicField(this, "previousTimeStamp");
    __publicField(this, "step", (timeStamp) => {
      if (this.previousTimeStamp === void 0) {
        this.previousTimeStamp = timeStamp;
      } else {
        const dtSec = (timeStamp - this.previousTimeStamp) / 1e3;
        this.previousTimeStamp = timeStamp;
        this.callback(dtSec);
      }
      this.win.requestAnimationFrame(this.step);
    });
    this.win = win;
    this.callback = callback;
    this.win.requestAnimationFrame(this.step);
  }
}
class AnimatedLayoutConfigurator {
  constructor(canvas, params, win) {
    __publicField(this, "applier");
    __publicField(this, "step", (dt) => {
      this.applier.apply(dt);
    });
    this.win = win;
    this.applier = new AnimatedLayoutApplier(canvas, params.algorithm, {
      staticNodeResolver: params.staticNodeResolver,
      onBeforeApplied: params.onBeforeApplied,
      onAfterApplied: params.onAfterApplied
    });
    new AnimationSeries(this.win, this.step);
  }
  static configure(canvas, params, win) {
    new AnimatedLayoutConfigurator(canvas, params, win);
  }
}
class UserSelectableNodesConfigurator {
  constructor(canvas, window2, pointInsideVerifier, params) {
    __publicField(this, "onNodeSelected");
    __publicField(this, "mouseDownEventVerifier");
    __publicField(this, "mouseUpEventVerifier");
    __publicField(this, "movementThreshold");
    __publicField(this, "selectionCandidateNodeId", null);
    __publicField(this, "movedDistance", 0);
    __publicField(this, "previousMouse", null);
    __publicField(this, "previousTouch", null);
    __publicField(this, "onAfterNodeAdded", (nodeId) => {
      const { element } = this.canvas.graph.getNode(nodeId);
      element.addEventListener("mousedown", this.onNodeMouseDown, {
        passive: true
      });
      element.addEventListener("touchstart", this.onNodeTouchStart, {
        passive: true
      });
    });
    __publicField(this, "onBeforeNodeRemoved", (nodeId) => {
      const { element } = this.canvas.graph.getNode(nodeId);
      element.removeEventListener("mousedown", this.onNodeMouseDown);
      element.removeEventListener("touchstart", this.onNodeTouchStart);
    });
    __publicField(this, "reset", () => {
      this.canvas.graph.getAllNodeIds().forEach((nodeId) => {
        const { element } = this.canvas.graph.getNode(nodeId);
        element.removeEventListener("mousedown", this.onNodeMouseDown);
        element.removeEventListener("touchstart", this.onNodeTouchStart);
      });
    });
    __publicField(this, "revert", () => {
      this.reset();
      this.removeWindowMouseListeners();
      this.removeWindowTouchListeners();
    });
    __publicField(this, "onNodeMouseDown", (event) => {
      const mouseEvent = event;
      if (!this.mouseDownEventVerifier(mouseEvent)) {
        return;
      }
      const nodeId = this.canvas.graph.findNodeIdByElement(
        event.currentTarget
      );
      this.selectionCandidateNodeId = nodeId;
      this.previousMouse = { x: mouseEvent.clientX, y: mouseEvent.clientY };
      this.movedDistance = 0;
      this.window.addEventListener("mousemove", this.onWindowMouseMove, {
        passive: true
      });
      this.window.addEventListener("mouseup", this.onWindowMouseUp, {
        passive: true
      });
    });
    __publicField(this, "onNodeTouchStart", (event) => {
      const touchEvent = event;
      if (touchEvent.touches.length !== 1) {
        return;
      }
      const nodeId = this.canvas.graph.findNodeIdByElement(
        touchEvent.currentTarget
      );
      this.selectionCandidateNodeId = nodeId;
      this.previousTouch = touchEvent.touches[0];
      this.movedDistance = 0;
      this.window.addEventListener("touchmove", this.onWindowTouchMove, {
        passive: true
      });
      this.window.addEventListener("touchend", this.onWindowTouchEnd, {
        passive: true
      });
      this.window.addEventListener("touchcancel", this.onWindowTouchCancel, {
        passive: true
      });
    });
    __publicField(this, "onWindowMouseMove", (event) => {
      const mouseEvent = event;
      const previousMouse = this.previousMouse;
      const x = mouseEvent.clientX - previousMouse.x;
      const y = mouseEvent.clientY - previousMouse.y;
      if (!this.pointInsideVerifier.verify(mouseEvent.clientX, mouseEvent.clientY)) {
        this.removeWindowMouseListeners();
        return;
      }
      this.processMoveThresholdVerification(x, y, () => {
        this.removeWindowMouseListeners();
      });
      this.previousMouse = { x: mouseEvent.clientX, y: mouseEvent.clientY };
    });
    __publicField(this, "onWindowTouchMove", (event) => {
      const touchEvent = event;
      if (touchEvent.touches.length !== 1) {
        this.removeWindowTouchListeners();
        return;
      }
      const touch = touchEvent.touches[0];
      if (!this.pointInsideVerifier.verify(touch.clientX, touch.clientY)) {
        this.removeWindowTouchListeners();
        return;
      }
      const previousTouch = this.previousTouch;
      const x = touch.clientX - previousTouch.clientX;
      const y = touch.clientY - previousTouch.clientY;
      this.processMoveThresholdVerification(x, y, () => {
        this.removeWindowTouchListeners();
      });
      this.previousTouch = touch;
    });
    __publicField(this, "onWindowMouseUp", (event) => {
      const mouseEvent = event;
      if (!this.mouseUpEventVerifier(mouseEvent)) {
        return;
      }
      this.removeWindowMouseListeners();
      this.trySelectNode(event);
    });
    __publicField(this, "onWindowTouchEnd", (event) => {
      this.removeWindowTouchListeners();
      this.trySelectNode(event);
    });
    __publicField(this, "onWindowTouchCancel", () => {
      this.removeWindowTouchListeners();
    });
    this.canvas = canvas;
    this.window = window2;
    this.pointInsideVerifier = pointInsideVerifier;
    this.mouseDownEventVerifier = params.mouseDownEventVerifier;
    this.mouseUpEventVerifier = params.mouseUpEventVerifier;
    this.onNodeSelected = params.onNodeSelected;
    this.movementThreshold = params.movementThreshold;
    this.canvas.graph.onAfterNodeAdded.subscribe(this.onAfterNodeAdded);
    this.canvas.graph.onBeforeNodeRemoved.subscribe(this.onBeforeNodeRemoved);
    this.canvas.graph.onBeforeClear.subscribe(this.reset);
    this.canvas.onBeforeDestroy.subscribe(this.revert);
  }
  static configure(canvas, window2, pointInsideVerifier, params) {
    new UserSelectableNodesConfigurator(
      canvas,
      window2,
      pointInsideVerifier,
      params
    );
  }
  removeWindowMouseListeners() {
    this.window.removeEventListener("mouseup", this.onWindowMouseUp);
    this.window.removeEventListener("mousemove", this.onWindowMouseMove);
  }
  removeWindowTouchListeners() {
    this.window.removeEventListener("touchmove", this.onWindowTouchMove);
    this.window.removeEventListener("touchend", this.onWindowTouchEnd);
    this.window.removeEventListener("touchcancel", this.onWindowTouchCancel);
  }
  trySelectNode(event) {
    const nodeId = this.selectionCandidateNodeId;
    if (this.canvas.graph.hasNode(nodeId)) {
      this.onNodeSelected(nodeId);
      event.ignoreCanvasSelection = true;
    }
  }
  processMoveThresholdVerification(x, y, thresholdReachedCallback) {
    const distance = Math.sqrt(x * x + y * y);
    this.movedDistance += distance;
    if (this.movedDistance > this.movementThreshold) {
      thresholdReachedCallback();
    }
  }
}
class UserSelectableCanvasConfigurator {
  constructor(canvas, element, window2, pointInsideVerifier, params) {
    __publicField(this, "onCanvasSelected");
    __publicField(this, "movementThreshold");
    __publicField(this, "mouseDownEventVerifier");
    __publicField(this, "mouseUpEventVerifier");
    __publicField(this, "movedDistance", 0);
    __publicField(this, "previousMouseDown", null);
    __publicField(this, "previousTouch", null);
    __publicField(this, "onMouseDown", (event) => {
      const mouseEvent = event;
      if (!this.mouseDownEventVerifier(mouseEvent)) {
        return;
      }
      this.previousMouseDown = { x: mouseEvent.clientX, y: mouseEvent.clientY };
      this.movedDistance = 0;
      this.window.addEventListener("mousemove", this.onWindowMouseMove, {
        passive: true
      });
      this.window.addEventListener("mouseup", this.onWindowMouseUp, {
        passive: true
      });
    });
    __publicField(this, "onTouchStart", (event) => {
      const touchEvent = event;
      if (touchEvent.touches.length !== 1) {
        return;
      }
      const touch = touchEvent.touches[0];
      this.previousTouch = touch;
      this.movedDistance = 0;
      this.window.addEventListener("touchmove", this.onWindowTouchMove, {
        passive: true
      });
      this.window.addEventListener("touchend", this.onWindowTouchEnd, {
        passive: true
      });
      this.window.addEventListener("touchcancel", this.onWindowTouchCancel, {
        passive: true
      });
    });
    __publicField(this, "onWindowMouseMove", (event) => {
      const mouseEvent = event;
      if (!this.pointInsideVerifier.verify(mouseEvent.clientX, mouseEvent.clientY)) {
        this.removeWindowMouseListeners();
        return;
      }
      const previous = this.previousMouseDown;
      const dx = mouseEvent.clientX - previous.x;
      const dy = mouseEvent.clientY - previous.y;
      this.processMoveThresholdVerification(dx, dy, () => {
        this.removeWindowMouseListeners();
      });
      this.previousMouseDown = { x: mouseEvent.clientX, y: mouseEvent.clientY };
    });
    __publicField(this, "onWindowTouchMove", (event) => {
      const touchEvent = event;
      if (touchEvent.touches.length !== 1) {
        this.removeWindowTouchListeners();
        return;
      }
      const touch = touchEvent.touches[0];
      if (!this.pointInsideVerifier.verify(touch.clientX, touch.clientY)) {
        this.removeWindowTouchListeners();
        return;
      }
      const previous = this.previousTouch;
      const dx = touch.clientX - previous.clientX;
      const dy = touch.clientY - previous.clientY;
      this.processMoveThresholdVerification(dx, dy, () => {
        this.removeWindowTouchListeners();
      });
      this.previousTouch = touch;
    });
    __publicField(this, "onWindowMouseUp", (event) => {
      const mouseEvent = event;
      if (!this.mouseUpEventVerifier(mouseEvent)) {
        return;
      }
      const ignore = event.ignoreCanvasSelection;
      if (ignore !== true) {
        this.onCanvasSelected();
      }
      this.removeWindowMouseListeners();
    });
    __publicField(this, "onWindowTouchEnd", () => {
      this.onCanvasSelected();
      this.removeWindowTouchListeners();
    });
    __publicField(this, "onWindowTouchCancel", () => {
      this.removeWindowTouchListeners();
    });
    __publicField(this, "restore", () => {
      this.element.removeEventListener("mousedown", this.onMouseDown);
      this.element.removeEventListener("touchstart", this.onTouchStart);
      this.removeWindowMouseListeners();
      this.removeWindowTouchListeners();
    });
    this.canvas = canvas;
    this.element = element;
    this.window = window2;
    this.pointInsideVerifier = pointInsideVerifier;
    this.onCanvasSelected = params.onCanvasSelected;
    this.movementThreshold = params.movementThreshold;
    this.mouseDownEventVerifier = params.mouseDownEventVerifier;
    this.mouseUpEventVerifier = params.mouseUpEventVerifier;
    this.canvas.onBeforeDestroy.subscribe(this.restore);
    this.element.addEventListener("mousedown", this.onMouseDown, {
      passive: true
    });
    this.element.addEventListener("touchstart", this.onTouchStart, {
      passive: true
    });
  }
  static configure(canvas, element, window2, pointInsideVerifier, params) {
    new UserSelectableCanvasConfigurator(
      canvas,
      element,
      window2,
      pointInsideVerifier,
      params
    );
  }
  removeWindowMouseListeners() {
    this.window.removeEventListener("mousemove", this.onWindowMouseMove);
    this.window.removeEventListener("mouseup", this.onWindowMouseUp);
  }
  removeWindowTouchListeners() {
    this.window.removeEventListener("touchmove", this.onWindowTouchMove);
    this.window.removeEventListener("touchend", this.onWindowTouchEnd);
    this.window.removeEventListener("touchcancel", this.onWindowTouchCancel);
  }
  processMoveThresholdVerification(x, y, thresholdReachedCallback) {
    const distance = Math.sqrt(x * x + y * y);
    this.movedDistance += distance;
    if (this.movedDistance > this.movementThreshold) {
      thresholdReachedCallback();
    }
  }
}
const createHost = () => {
  const host = document.createElement("div");
  host.style.width = "100%";
  host.style.height = "100%";
  host.style.position = "relative";
  return host;
};
const createLayer = () => {
  const host = document.createElement("div");
  host.style.position = "absolute";
  host.style.inset = "0";
  return host;
};
const createOverlayLayer = () => {
  const layer = createLayer();
  layer.style.pointerEvents = "none";
  return layer;
};
class Layers {
  constructor(element) {
    __publicField(this, "background", createLayer());
    __publicField(this, "main", createLayer());
    __publicField(this, "overlayConnectablePorts", createOverlayLayer());
    __publicField(this, "overlayDraggableEdges", createOverlayLayer());
    __publicField(this, "host", createHost());
    this.element = element;
    this.element.appendChild(this.host);
    this.host.appendChild(this.background);
    this.host.appendChild(this.main);
    this.host.appendChild(this.overlayConnectablePorts);
    this.host.appendChild(this.overlayDraggableEdges);
  }
  destroy() {
    this.host.removeChild(this.background);
    this.host.removeChild(this.main);
    this.host.removeChild(this.overlayConnectablePorts);
    this.host.removeChild(this.overlayDraggableEdges);
    this.element.removeChild(this.host);
  }
}
const createDraggableNodesParams = (config) => {
  var _a, _b, _c, _d, _e, _f;
  const onNodeDragStarted = ((_a = config.events) == null ? void 0 : _a.onNodeDragStarted) ?? (() => {
  });
  const onNodeDrag = ((_b = config.events) == null ? void 0 : _b.onNodeDrag) ?? (() => {
  });
  const nodeDragVerifier = config.nodeDragVerifier ?? (() => true);
  const onNodeDragFinished = ((_c = config.events) == null ? void 0 : _c.onNodeDragFinished) ?? (() => {
  });
  const moveOnTop = config.moveOnTop !== false;
  const moveEdgesOnTop = config.moveEdgesOnTop !== false && moveOnTop;
  const cursor = (_d = config.mouse) == null ? void 0 : _d.dragCursor;
  const dragCursor = cursor !== void 0 ? cursor : "grab";
  const defaultMouseDownEventVerifier = (_e = config.mouse) == null ? void 0 : _e.mouseDownEventVerifier;
  const mouseDownEventVerifier = defaultMouseDownEventVerifier !== void 0 ? defaultMouseDownEventVerifier : (event) => event.button === 0;
  const defaultMouseUpEventVerifier = (_f = config.mouse) == null ? void 0 : _f.mouseUpEventVerifier;
  const mouseUpEventVerifier = defaultMouseUpEventVerifier !== void 0 ? defaultMouseUpEventVerifier : (event) => event.button === 0;
  return {
    moveOnTop,
    moveEdgesOnTop,
    dragCursor,
    gridSize: config.gridSize ?? null,
    mouseDownEventVerifier,
    mouseUpEventVerifier,
    onNodeDragStarted,
    onNodeDrag,
    nodeDragVerifier,
    onNodeDragFinished
  };
};
const createShiftLimitTransformPreprocessor = (preprocessorParams) => {
  const minX = preprocessorParams.minX !== null ? preprocessorParams.minX : -Infinity;
  const maxX = preprocessorParams.maxX !== null ? preprocessorParams.maxX : Infinity;
  const minY = preprocessorParams.minY !== null ? preprocessorParams.minY : -Infinity;
  const maxY = preprocessorParams.maxY !== null ? preprocessorParams.maxY : Infinity;
  return (params) => {
    let dx = params.nextTransform.x;
    let dy = params.nextTransform.y;
    if (dx < minX && dx < params.prevTransform.x) {
      dx = Math.min(params.prevTransform.x, minX);
    }
    const w = params.canvasWidth * params.prevTransform.scale;
    const maxScreenX = maxX - w;
    if (dx > maxScreenX && dx > params.prevTransform.x) {
      dx = Math.max(params.prevTransform.x, maxScreenX);
    }
    if (dy < minY && dy < params.prevTransform.y) {
      dy = Math.min(params.prevTransform.y, minY);
    }
    const h = params.canvasHeight * params.prevTransform.scale;
    const maxScreenY = maxY - h;
    if (dy > maxScreenY && dy > params.prevTransform.y) {
      dy = Math.max(params.prevTransform.y, maxScreenY);
    }
    return { scale: params.nextTransform.scale, x: dx, y: dy };
  };
};
const createScaleLimitTransformPreprocessor = (preprocessorParams) => {
  const maxContentScale = preprocessorParams.maxContentScale;
  const minContentScale = preprocessorParams.minContentScale;
  const minViewScale = maxContentScale !== null ? 1 / maxContentScale : 0;
  const maxViewScale = minContentScale !== null ? 1 / minContentScale : Infinity;
  return (params) => {
    const prev = params.prevTransform;
    const next = params.nextTransform;
    let nextScale = next.scale;
    let nextDx = next.x;
    let nextDy = next.y;
    if (next.scale > maxViewScale && next.scale > prev.scale) {
      nextScale = Math.max(prev.scale, maxViewScale);
      nextDx = prev.x;
      nextDy = prev.y;
      const ratio = (nextScale - prev.scale) / (next.scale - prev.scale);
      nextDx = prev.x + (next.x - prev.x) * ratio;
      nextDy = prev.y + (next.y - prev.y) * ratio;
    }
    if (next.scale < minViewScale && next.scale < prev.scale) {
      nextScale = Math.min(prev.scale, minViewScale);
      nextDx = prev.x;
      nextDy = prev.y;
      const ratio = (nextScale - prev.scale) / (next.scale - prev.scale);
      nextDx = prev.x + (next.x - prev.x) * ratio;
      nextDy = prev.y + (next.y - prev.y) * ratio;
    }
    return {
      scale: nextScale,
      x: nextDx,
      y: nextDy
    };
  };
};
const createCombinedTransformPreprocessor = (preprocessors) => {
  return (params) => {
    return preprocessors.reduce(
      (acc, cur) => cur({
        prevTransform: params.prevTransform,
        nextTransform: acc,
        canvasWidth: params.canvasWidth,
        canvasHeight: params.canvasHeight
      }),
      params.nextTransform
    );
  };
};
const resolveTransformPreprocessor = (option) => {
  if (typeof option === "function") {
    return option;
  }
  switch (option.type) {
    case "scale-limit":
      return createScaleLimitTransformPreprocessor({
        minContentScale: option.minContentScale ?? 0,
        maxContentScale: option.maxContentScale ?? Infinity
      });
    case "shift-limit":
      return createShiftLimitTransformPreprocessor({
        minX: option.minX ?? -Infinity,
        maxX: option.maxX ?? Infinity,
        minY: option.minY ?? -Infinity,
        maxY: option.maxY ?? Infinity
      });
  }
};
const createTransformableViewportParams = (transformConfig) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  const configWheelSensitivity = (_a = transformConfig == null ? void 0 : transformConfig.scale) == null ? void 0 : _a.mouseWheelSensitivity;
  const wheelSensitivity = configWheelSensitivity !== void 0 ? configWheelSensitivity : 1.2;
  const preprocessors = transformConfig == null ? void 0 : transformConfig.transformPreprocessor;
  let transformPreprocessor;
  if (preprocessors !== void 0) {
    if (Array.isArray(preprocessors)) {
      transformPreprocessor = createCombinedTransformPreprocessor(
        preprocessors.map(
          (preprocessor) => resolveTransformPreprocessor(preprocessor)
        )
      );
    } else {
      transformPreprocessor = resolveTransformPreprocessor(preprocessors);
    }
  } else {
    transformPreprocessor = (params) => {
      return params.nextTransform;
    };
  }
  const shiftCursor = ((_b = transformConfig == null ? void 0 : transformConfig.shift) == null ? void 0 : _b.cursor) !== void 0 ? transformConfig.shift.cursor : "grab";
  const onBeforeTransformStarted = ((_c = transformConfig == null ? void 0 : transformConfig.events) == null ? void 0 : _c.onBeforeTransformChange) ?? (() => {
  });
  const onTransformFinished = ((_d = transformConfig == null ? void 0 : transformConfig.events) == null ? void 0 : _d.onTransformChange) ?? (() => {
  });
  const defaultMouseDownEventVerifier = (_e = transformConfig == null ? void 0 : transformConfig.shift) == null ? void 0 : _e.mouseDownEventVerifier;
  const mouseDownEventVerifier = defaultMouseDownEventVerifier !== void 0 ? defaultMouseDownEventVerifier : (event) => event.button === 0;
  const defaultMouseUpEventVerifier = (_f = transformConfig == null ? void 0 : transformConfig.shift) == null ? void 0 : _f.mouseUpEventVerifier;
  const mouseUpEventVerifier = defaultMouseUpEventVerifier !== void 0 ? defaultMouseUpEventVerifier : (event) => event.button === 0;
  const defaultMouseWheelEventVerifier = (_g = transformConfig == null ? void 0 : transformConfig.scale) == null ? void 0 : _g.mouseWheelEventVerifier;
  const mouseWheelEventVerifier = defaultMouseWheelEventVerifier !== void 0 ? defaultMouseWheelEventVerifier : () => true;
  return {
    wheelSensitivity,
    onTransformStarted: ((_h = transformConfig == null ? void 0 : transformConfig.events) == null ? void 0 : _h.onTransformStarted) ?? (() => {
    }),
    onTransformFinished: ((_i = transformConfig == null ? void 0 : transformConfig.events) == null ? void 0 : _i.onTransformFinished) ?? (() => {
    }),
    onBeforeTransformChange: onBeforeTransformStarted,
    onTransformChange: onTransformFinished,
    transformPreprocessor,
    shiftCursor,
    mouseDownEventVerifier,
    mouseUpEventVerifier,
    mouseWheelEventVerifier,
    scaleWheelFinishTimeout: ((_j = transformConfig == null ? void 0 : transformConfig.scale) == null ? void 0 : _j.wheelFinishTimeout) ?? 500,
    onResizeTransformStarted: ((_k = transformConfig == null ? void 0 : transformConfig.events) == null ? void 0 : _k.onResizeTransformStarted) ?? (() => {
    }),
    onResizeTransformFinished: ((_l = transformConfig == null ? void 0 : transformConfig.events) == null ? void 0 : _l.onResizeTransformFinished) ?? (() => {
    })
  };
};
const createContent = (radius, color) => {
  const content = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  content.setAttribute("cx", "0");
  content.setAttribute("cy", "0");
  content.setAttribute("r", `${radius}`);
  content.setAttribute("fill", `${color}`);
  return content;
};
const resolveRenderer = (rendererOption) => {
  if (rendererOption instanceof SVGElement) {
    return rendererOption;
  } else {
    return createContent(
      (rendererOption == null ? void 0 : rendererOption.radius) ?? 1.5,
      (rendererOption == null ? void 0 : rendererOption.color) ?? "#d8d8d8"
    );
  }
};
const createBackgroundParams = (backgroundConfig) => {
  const dimensions = backgroundConfig.tileDimensions;
  const width = (dimensions == null ? void 0 : dimensions.width) ?? 25;
  const height = (dimensions == null ? void 0 : dimensions.height) ?? 25;
  const renderer = resolveRenderer(backgroundConfig.renderer ?? {});
  return {
    tileWidth: width,
    tileHeight: height,
    renderer,
    maxViewportScale: backgroundConfig.maxViewportScale ?? 10
  };
};
const resolveEdgeShapeFactory = (config) => {
  if (typeof config === "function") {
    return config;
  }
  switch (config.type) {
    case "straight":
      return () => new StraightEdgeShape({
        color: config.color,
        width: config.width,
        arrowLength: config.arrowLength,
        arrowOffset: config.arrowOffset,
        arrowRenderer: config.arrowRenderer,
        hasSourceArrow: config.hasSourceArrow,
        hasTargetArrow: config.hasTargetArrow,
        cycleSquareSide: config.cycleSquareSide,
        roundness: config.roundness,
        detourDistance: config.detourDistance,
        detourDirection: config.detourDirection
      });
    case "horizontal":
      return () => new HorizontalEdgeShape({
        color: config.color,
        width: config.width,
        arrowLength: config.arrowLength,
        arrowOffset: config.arrowOffset,
        arrowRenderer: config.arrowRenderer,
        hasSourceArrow: config.hasSourceArrow,
        hasTargetArrow: config.hasTargetArrow,
        cycleSquareSide: config.cycleSquareSide,
        roundness: config.roundness,
        detourDistance: config.detourDistance
      });
    case "vertical":
      return () => new VerticalEdgeShape({
        color: config.color,
        width: config.width,
        arrowLength: config.arrowLength,
        arrowOffset: config.arrowOffset,
        arrowRenderer: config.arrowRenderer,
        hasSourceArrow: config.hasSourceArrow,
        hasTargetArrow: config.hasTargetArrow,
        cycleSquareSide: config.cycleSquareSide,
        roundness: config.roundness,
        detourDistance: config.detourDistance
      });
    case "direct":
      return () => new DirectEdgeShape({
        color: config.color,
        width: config.width,
        arrowLength: config.arrowLength,
        arrowRenderer: config.arrowRenderer,
        hasSourceArrow: config.hasSourceArrow,
        hasTargetArrow: config.hasTargetArrow,
        sourceOffset: config.sourceOffset,
        targetOffset: config.targetOffset
      });
    default:
      return () => new BezierEdgeShape({
        color: config.color,
        width: config.width,
        arrowLength: config.arrowLength,
        arrowRenderer: config.arrowRenderer,
        hasSourceArrow: config.hasSourceArrow,
        hasTargetArrow: config.hasTargetArrow,
        cycleRadius: config.cycleRadius,
        smallCycleRadius: config.smallCycleRadius,
        curvature: config.curvature,
        detourDistance: config.detourDistance,
        detourDirection: config.detourDirection
      });
  }
};
const createConnectablePortsParams = (config, defaultEdgeShapeFactory, defaultDragPortDirection) => {
  var _a, _b, _c;
  const defaultConnectionTypeResolver = () => "direct";
  const defaultConnectionPreprocessor = (request) => request;
  const defaultMouseEventVerifier = (event) => event.button === 0;
  const defaultOnAfterEdgeCreated = () => {
  };
  const defaultOnAfterEdgeConnectionPrevented = () => {
  };
  const defaultOnAfterEdgeConnectionInterrupted = () => {
  };
  return {
    connectionTypeResolver: config.connectionTypeResolver ?? defaultConnectionTypeResolver,
    connectionPreprocessor: config.connectionPreprocessor ?? defaultConnectionPreprocessor,
    mouseDownEventVerifier: config.mouseDownEventVerifier ?? defaultMouseEventVerifier,
    mouseUpEventVerifier: config.mouseUpEventVerifier ?? defaultMouseEventVerifier,
    onAfterEdgeCreated: ((_a = config.events) == null ? void 0 : _a.onAfterEdgeCreated) ?? defaultOnAfterEdgeCreated,
    onEdgeCreationInterrupted: ((_b = config.events) == null ? void 0 : _b.onEdgeCreationInterrupted) ?? defaultOnAfterEdgeConnectionInterrupted,
    onEdgeCreationPrevented: ((_c = config.events) == null ? void 0 : _c.onEdgeCreationPrevented) ?? defaultOnAfterEdgeConnectionPrevented,
    dragPortDirection: config.dragPortDirection ?? defaultDragPortDirection,
    edgeShapeFactory: config.edgeShape !== void 0 ? resolveEdgeShapeFactory(config.edgeShape) : defaultEdgeShapeFactory
  };
};
const createDraggableEdgeParams = (config, graph) => {
  var _a, _b, _c;
  const defaultConnectionPreprocessor = (request) => request;
  const defaultMouseDownEventVerifier = (event) => event.button === 0 && event.ctrlKey;
  const defaultMouseUpEventVerifier = (event) => event.button === 0;
  const defaultDraggingEdgeResolver = (portId) => {
    const edgeIds = graph.getPortAdjacentEdgeIds(portId);
    if (edgeIds.length > 0) {
      return edgeIds[edgeIds.length - 1];
    } else {
      return null;
    }
  };
  const defaultOnAfterEdgeReattached = () => {
  };
  const defaultOnAfterEdgeReattachPrevented = () => {
  };
  const defaultOnAfterEdgeReattachInterrupted = () => {
  };
  return {
    connectionPreprocessor: config.connectionPreprocessor ?? defaultConnectionPreprocessor,
    mouseDownEventVerifier: config.mouseDownEventVerifier ?? defaultMouseDownEventVerifier,
    mouseUpEventVerifier: config.mouseUpEventVerifier ?? defaultMouseUpEventVerifier,
    draggingEdgeResolver: config.draggingEdgeResolver ?? defaultDraggingEdgeResolver,
    draggingEdgeShapeFactory: config.draggingEdgeShape !== void 0 ? resolveEdgeShapeFactory(config.draggingEdgeShape) : null,
    onAfterEdgeReattached: ((_a = config.events) == null ? void 0 : _a.onAfterEdgeReattached) ?? defaultOnAfterEdgeReattached,
    onEdgeReattachInterrupted: ((_b = config.events) == null ? void 0 : _b.onEdgeReattachInterrupted) ?? defaultOnAfterEdgeReattachInterrupted,
    onEdgeReattachPrevented: ((_c = config.events) == null ? void 0 : _c.onEdgeReattachPrevented) ?? defaultOnAfterEdgeReattachPrevented
  };
};
const createVirtualScrollParams = (config) => {
  return {
    nodeVerticalRadius: config.nodeContainingRadius.vertical,
    nodeHorizontalRadius: config.nodeContainingRadius.horizontal
  };
};
const createVirtualScrollHtmlViewParams = (config) => {
  var _a, _b;
  return {
    onAfterNodeDetached: ((_a = config == null ? void 0 : config.events) == null ? void 0 : _a.onAfterNodeDetached) ?? (() => {
    }),
    onBeforeNodeAttached: ((_b = config == null ? void 0 : config.events) == null ? void 0 : _b.onBeforeNodeAttached) ?? (() => {
    })
  };
};
class CanvasBuilderError extends Error {
  constructor() {
    super(...arguments);
    __publicField(this, "name", "CanvasBuilderError");
  }
}
class ForceDirectedAlgorithmIteration {
  constructor(graph, currentCoords, params) {
    __publicField(this, "dt");
    __publicField(this, "nodeMass");
    __publicField(this, "edgeEquilibriumLength");
    __publicField(this, "edgeStiffness");
    __publicField(this, "nodeForcesApplicationStrategy");
    __publicField(this, "distanceVectorGenerator");
    this.graph = graph;
    this.currentCoords = currentCoords;
    this.dt = params.dtSec;
    this.nodeMass = params.nodeMass;
    this.edgeEquilibriumLength = params.edgeEquilibriumLength;
    this.edgeStiffness = params.edgeStiffness;
    this.distanceVectorGenerator = params.distanceVectorGenerator;
    this.nodeForcesApplicationStrategy = params.nodeForcesApplicationStrategy;
  }
  apply() {
    let maxVelocity = 0;
    const forces = /* @__PURE__ */ new Map();
    const nodeIds = this.graph.getAllNodeIds();
    nodeIds.forEach((nodeId) => {
      forces.set(nodeId, { x: 0, y: 0 });
    });
    this.nodeForcesApplicationStrategy.apply(this.currentCoords, forces);
    this.applyEdgeForces(forces);
    this.currentCoords.forEach((coords, nodeId) => {
      const force = forces.get(nodeId);
      const velocity = {
        x: force.x / this.nodeMass * this.dt,
        y: force.y / this.nodeMass * this.dt
      };
      maxVelocity = Math.max(
        maxVelocity,
        Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y)
      );
      const dx = velocity.x * this.dt;
      const dy = velocity.y * this.dt;
      coords.x += dx;
      coords.y += dy;
    });
    return maxVelocity;
  }
  applyEdgeForces(forces) {
    this.graph.getAllEdgeIds().forEach((edgeId) => {
      const edge = this.graph.getEdge(edgeId);
      const portFrom = this.graph.getPort(edge.from);
      const portTo = this.graph.getPort(edge.to);
      const sourceCoords = this.currentCoords.get(portFrom.nodeId);
      const targetCoords = this.currentCoords.get(portTo.nodeId);
      const vector = this.distanceVectorGenerator.create(
        sourceCoords,
        targetCoords
      );
      const delta = vector.d - this.edgeEquilibriumLength;
      const f = delta * this.edgeStiffness;
      const fx = vector.ex * f;
      const fy = vector.ey * f;
      const forceFrom = forces.get(portFrom.nodeId);
      const forceTo = forces.get(portTo.nodeId);
      forceFrom.x += fx;
      forceFrom.y += fy;
      forceTo.x -= fx;
      forceTo.y -= fy;
    });
  }
}
class DistanceVectorGenerator {
  constructor(rand) {
    __publicField(this, "PI2", 2 * Math.PI);
    this.rand = rand;
  }
  create(sourceCoords, targetCoords) {
    const dx = targetCoords.x - sourceCoords.x;
    const dy = targetCoords.y - sourceCoords.y;
    const d2 = dx * dx + dy * dy;
    if (d2 === 0) {
      const ang = this.PI2 * this.rand();
      return {
        ex: Math.cos(ang),
        ey: Math.sin(ang),
        d: 0
      };
    }
    const d = Math.sqrt(d2);
    const ex = dx / d;
    const ey = dy / d;
    return { ex, ey, d };
  }
}
const calculateNodeRepulsiveForce = (params) => {
  if (params.distance === 0) {
    return params.maxForce;
  }
  const f = params.coefficient * (params.sourceCharge * params.targetCharge / (params.distance * params.distance));
  return Math.min(f, params.maxForce);
};
class DirectSumNodeForcesApplicationStrategy {
  constructor(params) {
    __publicField(this, "nodeCharge");
    __publicField(this, "distanceVectorGenerator");
    __publicField(this, "maxForce");
    this.nodeCharge = params.nodeCharge;
    this.distanceVectorGenerator = params.distanceVectorGenerator;
    this.maxForce = params.maxForce;
  }
  apply(nodesCoords, forces) {
    const nodeIds = Array.from(forces.keys());
    const size = nodeIds.length;
    for (let i = 0; i < size; i++) {
      const nodeIdFrom = nodeIds[i];
      for (let j = i + 1; j < size; j++) {
        const nodeIdTo = nodeIds[j];
        const sourceCoords = nodesCoords.get(nodeIdFrom);
        const targetCoords = nodesCoords.get(nodeIdTo);
        const vector = this.distanceVectorGenerator.create(
          sourceCoords,
          targetCoords
        );
        const f = calculateNodeRepulsiveForce({
          coefficient: 1,
          sourceCharge: this.nodeCharge,
          targetCharge: this.nodeCharge,
          distance: vector.d,
          maxForce: this.maxForce
        });
        const fx = f * vector.ex;
        const fy = f * vector.ey;
        const forceFrom = forces.get(nodeIdFrom);
        const forceTo = forces.get(nodeIdTo);
        forceFrom.x -= fx;
        forceFrom.y -= fy;
        forceTo.x += fx;
        forceTo.y += fy;
      }
    }
  }
}
const createAreaBox = (nodeCoords) => {
  if (nodeCoords.size === 0) {
    return {
      centerX: 0,
      centerY: 0,
      radius: 0
    };
  }
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  nodeCoords.forEach((point) => {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  });
  const width = maxX - minX;
  const height = maxY - minY;
  const side = Math.max(width, height);
  return {
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
    radius: side / 2
  };
};
class QuadTree {
  constructor(params) {
    __publicField(this, "root");
    __publicField(this, "leaves", /* @__PURE__ */ new Map());
    __publicField(this, "coords");
    __publicField(this, "areaRadiusThreshold");
    __publicField(this, "nodeMass");
    __publicField(this, "nodeCharge");
    __publicField(this, "sortedParentNodes", []);
    this.coords = params.coords;
    this.areaRadiusThreshold = params.areaRadiusThreshold;
    this.nodeMass = params.nodeMass;
    this.nodeCharge = params.nodeCharge;
    this.root = {
      nodeIds: new Set(params.coords.keys()),
      box: params.box,
      totalMass: 0,
      totalCharge: 0,
      chargeCenter: {
        x: 0,
        y: 0
      },
      parent: null,
      lb: null,
      lt: null,
      rb: null,
      rt: null
    };
    let layer = [this.root];
    while (layer.length > 0) {
      const nextLayer = [];
      while (layer.length > 0) {
        const node = layer.pop();
        const chunk = this.processNode(node);
        chunk.forEach((node2) => {
          nextLayer.push(node2);
        });
      }
      layer = nextLayer;
    }
    this.sortedParentNodes.reverse().forEach((node) => {
      let totalChargeX = 0;
      let totalChargeY = 0;
      let totalMass = 0;
      let totalCharge = 0;
      if (node.lb !== null) {
        totalMass += node.lb.totalMass;
        totalCharge += node.lb.totalCharge;
        totalChargeX += node.lb.chargeCenter.x * node.lb.totalCharge;
        totalChargeY += node.lb.chargeCenter.y * node.lb.totalCharge;
      }
      if (node.lt !== null) {
        totalMass += node.lt.totalMass;
        totalCharge += node.lt.totalCharge;
        totalChargeX += node.lt.chargeCenter.x * node.lt.totalCharge;
        totalChargeY += node.lt.chargeCenter.y * node.lt.totalCharge;
      }
      if (node.rb !== null) {
        totalMass += node.rb.totalMass;
        totalCharge += node.rb.totalCharge;
        totalChargeX += node.rb.chargeCenter.x * node.rb.totalCharge;
        totalChargeY += node.rb.chargeCenter.y * node.rb.totalCharge;
      }
      if (node.rt !== null) {
        totalMass += node.rt.totalMass;
        totalCharge += node.rt.totalCharge;
        totalChargeX += node.rt.chargeCenter.x * node.rt.totalCharge;
        totalChargeY += node.rt.chargeCenter.y * node.rt.totalCharge;
      }
      node.totalMass = totalMass;
      node.totalCharge = totalCharge;
      node.chargeCenter.x = totalChargeX / totalCharge;
      node.chargeCenter.y = totalChargeY / totalCharge;
    });
  }
  getRoot() {
    return this.root;
  }
  getLeaf(nodeId) {
    return this.leaves.get(nodeId);
  }
  processNode(current) {
    if (current.nodeIds.size < 2) {
      this.setLeaf(current);
      return [];
    }
    const { centerX, centerY, radius } = current.box;
    if (radius < this.areaRadiusThreshold) {
      this.setLeaf(current);
      return [];
    }
    this.sortedParentNodes.push(current);
    const rightTopNodes = /* @__PURE__ */ new Set();
    const rightBottomNodes = /* @__PURE__ */ new Set();
    const leftTopNodes = /* @__PURE__ */ new Set();
    const leftBottomNodes = /* @__PURE__ */ new Set();
    const halfRadius = radius / 2;
    current.nodeIds.forEach((nodeId) => {
      const { x, y } = this.coords.get(nodeId);
      if (x < centerX) {
        if (y < centerY) {
          leftBottomNodes.add(nodeId);
        } else {
          leftTopNodes.add(nodeId);
        }
      } else {
        if (y < centerY) {
          rightBottomNodes.add(nodeId);
        } else {
          rightTopNodes.add(nodeId);
        }
      }
      current.nodeIds.delete(nodeId);
    });
    const nodeLinks = {
      parent: current,
      lb: null,
      lt: null,
      rb: null,
      rt: null
    };
    const nextNodesToProcess = [];
    if (rightTopNodes.size > 0) {
      const node = {
        nodeIds: rightTopNodes,
        totalMass: 0,
        totalCharge: 0,
        chargeCenter: {
          x: 0,
          y: 0
        },
        box: {
          centerX: centerX + halfRadius,
          centerY: centerY + halfRadius,
          radius: halfRadius
        },
        ...nodeLinks
      };
      current.rt = node;
      nextNodesToProcess.push(node);
    }
    if (rightBottomNodes.size > 0) {
      const node = {
        nodeIds: rightBottomNodes,
        totalMass: 0,
        totalCharge: 0,
        chargeCenter: {
          x: 0,
          y: 0
        },
        box: {
          centerX: centerX + halfRadius,
          centerY: centerY - halfRadius,
          radius: halfRadius
        },
        ...nodeLinks
      };
      current.rb = node;
      nextNodesToProcess.push(node);
    }
    if (leftTopNodes.size > 0) {
      const node = {
        nodeIds: leftTopNodes,
        totalMass: 0,
        totalCharge: 0,
        chargeCenter: {
          x: 0,
          y: 0
        },
        box: {
          centerX: centerX - halfRadius,
          centerY: centerY + halfRadius,
          radius: halfRadius
        },
        ...nodeLinks
      };
      current.lt = node;
      nextNodesToProcess.push(node);
    }
    if (leftBottomNodes.size > 0) {
      const node = {
        nodeIds: leftBottomNodes,
        totalMass: 0,
        totalCharge: 0,
        chargeCenter: {
          x: 0,
          y: 0
        },
        box: {
          centerX: centerX - halfRadius,
          centerY: centerY - halfRadius,
          radius: halfRadius
        },
        ...nodeLinks
      };
      current.lb = node;
      nextNodesToProcess.push(node);
    }
    return nextNodesToProcess;
  }
  setLeaf(current) {
    current.totalMass = this.nodeMass * current.nodeIds.size;
    current.totalCharge = this.nodeCharge * current.nodeIds.size;
    current.chargeCenter = this.calculateLeafChargeCenter(current.nodeIds);
    current.nodeIds.forEach((nodeId) => {
      this.leaves.set(nodeId, current);
    });
  }
  calculateLeafChargeCenter(nodeIds) {
    if (nodeIds.size === 0) {
      return {
        x: 0,
        y: 0
      };
    }
    let x = 0;
    let y = 0;
    nodeIds.forEach((nodeId) => {
      const node = this.coords.get(nodeId);
      x += node.x;
      y += node.y;
    });
    return { x: x / nodeIds.size, y: y / nodeIds.size };
  }
}
class BarnesHutApproximationNodeForcesApplicationStrategy {
  constructor(params) {
    __publicField(this, "areaRadiusThreshold");
    __publicField(this, "nodeMass");
    __publicField(this, "nodeCharge");
    __publicField(this, "theta");
    __publicField(this, "distanceVectorGenerator");
    __publicField(this, "nodeForceCoefficient");
    __publicField(this, "maxForce");
    this.areaRadiusThreshold = params.areaRadiusThreshold;
    this.nodeMass = params.nodeMass;
    this.nodeCharge = params.nodeCharge;
    this.theta = params.theta;
    this.distanceVectorGenerator = params.distanceVectorGenerator;
    this.nodeForceCoefficient = params.nodeForceCoefficient;
    this.maxForce = params.maxForce;
  }
  apply(nodesCoords, forces) {
    const box = createAreaBox(nodesCoords);
    const tree = new QuadTree({
      box,
      coords: nodesCoords,
      areaRadiusThreshold: this.areaRadiusThreshold,
      nodeMass: this.nodeMass,
      nodeCharge: this.nodeCharge
    });
    nodesCoords.forEach((_coords, nodeId) => {
      const force = this.calculateForceForNode(
        tree.getLeaf(nodeId),
        nodeId,
        nodesCoords
      );
      const totalForce = forces.get(nodeId);
      this.applyForce(totalForce, force);
    });
  }
  calculateForceForNode(leaf, targetNodeId, nodesCoords) {
    const targetCoords = nodesCoords.get(targetNodeId);
    const totalForce = { x: 0, y: 0 };
    leaf.nodeIds.forEach((nodeId) => {
      if (nodeId !== targetNodeId) {
        const sourceCoords = nodesCoords.get(nodeId);
        const force = this.calculateNodeRepulsiveForce({
          sourceCharge: this.nodeCharge,
          targetCharge: this.nodeCharge,
          sourceCoords,
          targetCoords
        });
        this.applyForce(totalForce, force);
      }
    });
    let current = leaf;
    while (current !== null) {
      const parent = current.parent;
      if (parent !== null) {
        const vector = this.distanceVectorGenerator.create(
          parent.chargeCenter,
          targetCoords
        );
        const isFar = parent.box.radius * 2 < vector.d * this.theta;
        if (isFar) {
          this.tryApplyFarForce({
            totalForce,
            targetCoords,
            target: parent.lb,
            current
          });
          this.tryApplyFarForce({
            totalForce,
            targetCoords,
            target: parent.rb,
            current
          });
          this.tryApplyFarForce({
            totalForce,
            targetCoords,
            target: parent.rt,
            current
          });
          this.tryApplyFarForce({
            totalForce,
            targetCoords,
            target: parent.lt,
            current
          });
        } else {
          this.tryApplyNearForce({
            totalForce,
            targetCoords,
            target: parent.lb,
            current,
            nodesCoords
          });
          this.tryApplyNearForce({
            totalForce,
            targetCoords,
            target: parent.rb,
            current,
            nodesCoords
          });
          this.tryApplyNearForce({
            totalForce,
            targetCoords,
            target: parent.rt,
            current,
            nodesCoords
          });
          this.tryApplyNearForce({
            totalForce,
            targetCoords,
            target: parent.lt,
            current,
            nodesCoords
          });
        }
      }
      current = current.parent;
    }
    return totalForce;
  }
  calculateExactForce(root, targetCoords, nodesCoords) {
    const totalForce = { x: 0, y: 0 };
    const stack = [root];
    while (stack.length > 0) {
      const current = stack.pop();
      current.nodeIds.forEach((nodeId) => {
        const sourceCoords = nodesCoords.get(nodeId);
        const force = this.calculateNodeRepulsiveForce({
          sourceCharge: this.nodeCharge,
          targetCharge: this.nodeCharge,
          sourceCoords,
          targetCoords
        });
        this.applyForce(totalForce, force);
      });
      if (current.lb !== null) {
        stack.push(current.lb);
      }
      if (current.rb !== null) {
        stack.push(current.rb);
      }
      if (current.lt !== null) {
        stack.push(current.lt);
      }
      if (current.rt !== null) {
        stack.push(current.rt);
      }
    }
    return totalForce;
  }
  calculateApproximateForce(root, targetCoords) {
    return this.calculateNodeRepulsiveForce({
      sourceCharge: this.nodeCharge,
      targetCharge: root.totalCharge,
      sourceCoords: root.chargeCenter,
      targetCoords
    });
  }
  calculateNodeRepulsiveForce(params) {
    const vector = this.distanceVectorGenerator.create(
      params.sourceCoords,
      params.targetCoords
    );
    const f = calculateNodeRepulsiveForce({
      coefficient: this.nodeForceCoefficient,
      sourceCharge: params.sourceCharge,
      targetCharge: params.targetCharge,
      distance: vector.d,
      maxForce: this.maxForce
    });
    return {
      x: f * vector.ex,
      y: f * vector.ey
    };
  }
  applyForce(totalForce, force) {
    totalForce.x += force.x;
    totalForce.y += force.y;
  }
  tryApplyFarForce(params) {
    if (params.target !== null && params.target !== params.current) {
      const force = this.calculateApproximateForce(
        params.target,
        params.targetCoords
      );
      this.applyForce(params.totalForce, force);
    }
  }
  tryApplyNearForce(params) {
    if (params.target !== null && params.target !== params.current) {
      const force = this.calculateExactForce(
        params.target,
        params.targetCoords,
        params.nodesCoords
      );
      this.applyForce(params.totalForce, force);
    }
  }
}
const resolveNodeForcesApplicationStrategy = (params) => {
  if (params.theta !== 0) {
    return new BarnesHutApproximationNodeForcesApplicationStrategy({
      nodeCharge: params.nodeCharge,
      nodeForceCoefficient: params.nodeForceCoefficient,
      distanceVectorGenerator: params.distanceVectorGenerator,
      maxForce: params.maxForce,
      theta: params.theta,
      nodeMass: params.nodeMass,
      areaRadiusThreshold: params.areaRadiusThreshold
    });
  }
  return new DirectSumNodeForcesApplicationStrategy({
    nodeCharge: params.nodeCharge,
    nodeForceCoefficient: params.nodeForceCoefficient,
    distanceVectorGenerator: params.distanceVectorGenerator,
    maxForce: params.maxForce
  });
};
class RandomFillerLayoutAlgorithm {
  constructor(params) {
    __publicField(this, "rand");
    __publicField(this, "sparsity");
    this.rand = params.rand;
    this.sparsity = params.sparsity;
  }
  calculateCoordinates(params) {
    const { graph, viewport } = params;
    const currentCoords = /* @__PURE__ */ new Map();
    const unsetNodeIds = graph.getAllNodeIds().filter((nodeId) => {
      const node = graph.getNode(nodeId);
      return node.x === null || node.y === null;
    });
    const side = Math.sqrt(unsetNodeIds.length) * this.sparsity;
    const { width, height } = viewport.getDimensions();
    const centerViewport = { x: width / 2, y: height / 2 };
    const centerContent = viewport.createContentCoords(centerViewport);
    const halfSide = side / 2;
    const areaBottomLeft = {
      x: centerContent.x - halfSide,
      y: centerContent.y - halfSide
    };
    const nodeIds = graph.getAllNodeIds();
    nodeIds.forEach((nodeId) => {
      const node = graph.getNode(nodeId);
      currentCoords.set(nodeId, {
        x: node.x ?? areaBottomLeft.x + side * this.rand(),
        y: node.y ?? areaBottomLeft.y + side * this.rand()
      });
    });
    return currentCoords;
  }
}
class ForceDirectedLayoutAlgorithm {
  constructor(params) {
    __publicField(this, "distanceVectorGenerator");
    __publicField(this, "nodeForcesApplicationStrategy");
    __publicField(this, "fillerLayoutAlgorithm");
    __publicField(this, "maxIterations");
    __publicField(this, "dtSec");
    __publicField(this, "nodeMass");
    __publicField(this, "edgeEquilibriumLength");
    __publicField(this, "edgeStiffness");
    __publicField(this, "convergenceVelocity");
    this.maxIterations = params.maxIterations;
    this.dtSec = params.dtSec;
    this.nodeMass = params.nodeMass;
    this.edgeEquilibriumLength = params.edgeEquilibriumLength;
    this.edgeStiffness = params.edgeStiffness;
    this.convergenceVelocity = params.convergenceVelocity;
    this.distanceVectorGenerator = new DistanceVectorGenerator(params.rand);
    this.nodeForcesApplicationStrategy = resolveNodeForcesApplicationStrategy({
      distanceVectorGenerator: this.distanceVectorGenerator,
      nodeCharge: params.nodeCharge,
      maxForce: params.maxForce,
      nodeForceCoefficient: params.nodeForceCoefficient,
      theta: params.barnesHutTheta,
      areaRadiusThreshold: params.barnesHutAreaRadiusThreshold,
      nodeMass: params.nodeMass
    });
    this.fillerLayoutAlgorithm = new RandomFillerLayoutAlgorithm({
      rand: params.rand,
      sparsity: params.edgeEquilibriumLength
    });
  }
  calculateCoordinates(params) {
    const { graph, viewport } = params;
    const currentCoords = this.fillerLayoutAlgorithm.calculateCoordinates({
      graph,
      viewport
    });
    for (let i = 0; i < this.maxIterations; i++) {
      const iteration = new ForceDirectedAlgorithmIteration(
        graph,
        currentCoords,
        {
          distanceVectorGenerator: this.distanceVectorGenerator,
          nodeForcesApplicationStrategy: this.nodeForcesApplicationStrategy,
          dtSec: this.dtSec,
          nodeMass: this.nodeMass,
          edgeEquilibriumLength: this.edgeEquilibriumLength,
          edgeStiffness: this.edgeStiffness
        }
      );
      const maxVelocity = iteration.apply();
      if (maxVelocity < this.convergenceVelocity) {
        break;
      }
    }
    return currentCoords;
  }
}
class BreadthFirstSpanningForestGenerator {
  constructor(graph, nextLayerNodesResolver) {
    __publicField(this, "forest", /* @__PURE__ */ new Set());
    __publicField(this, "remainingNodeIds");
    this.graph = graph;
    this.nextLayerNodesResolver = nextLayerNodesResolver;
    this.remainingNodeIds = new Set(this.graph.getAllNodeIds());
    while (this.remainingNodeIds.size > 0) {
      const [nodeId] = this.remainingNodeIds;
      this.traverse(nodeId);
    }
  }
  generate() {
    return this.forest;
  }
  traverse(startNodeId) {
    const root = {
      nodeId: startNodeId,
      children: /* @__PURE__ */ new Set()
    };
    const sequence = [];
    this.forest.add({ root, sequence });
    let layer = [root];
    this.remainingNodeIds.delete(root.nodeId);
    while (layer.length > 0) {
      const nextLayer = [];
      layer.forEach((current) => {
        sequence.push(current);
        const nextLayerNodes = this.nextLayerNodesResolver({
          graph: this.graph,
          currentNodeId: current.nodeId
        });
        for (const nodeId of nextLayerNodes) {
          if (!this.remainingNodeIds.has(nodeId)) {
            continue;
          }
          this.remainingNodeIds.delete(nodeId);
          const child = {
            nodeId,
            children: /* @__PURE__ */ new Set()
          };
          current.children.add(child);
          nextLayer.push(child);
        }
      });
      layer = nextLayer;
    }
  }
}
class AggregatedSubtreeGenerator {
  constructor(params) {
    this.params = params;
  }
  generate(absoluteSubtreeLayers) {
    let current = 0;
    const result = [];
    const last = absoluteSubtreeLayers.length - 1;
    const absoluteSpans = [];
    absoluteSubtreeLayers.forEach((subtree, index) => {
      current += this.params.spaceAroundRadius;
      subtree.forEach((span, i) => {
        if (absoluteSpans[i] === void 0) {
          absoluteSpans[i] = {
            start: current + span.start,
            end: current + span.end
          };
        } else {
          absoluteSpans[i].end = current + span.end;
        }
      });
      result.push(current);
      if (index !== last) {
        const nextSubtree = absoluteSubtreeLayers[index + 1];
        const relativeSpans = absoluteSpans.map((span) => ({
          start: span.start - current,
          end: span.end - current
        }));
        current += this.calculateMaxDiff(relativeSpans, nextSubtree);
      }
      current += this.params.spaceAroundRadius;
    });
    const half = current / 2;
    return {
      childOffsets: result.map((offset) => offset - half),
      subtreeSpans: absoluteSpans.map((span) => ({
        start: span.start - half,
        end: span.end - half
      }))
    };
  }
  calculateMaxDiff(leftLayers, rightLayers) {
    let maxDiff = 0;
    const layersCnt = Math.min(leftLayers.length, rightLayers.length);
    for (let i = 0; i < layersCnt; i++) {
      const diff = leftLayers[i].end - rightLayers[i].start;
      maxDiff = Math.max(maxDiff, diff);
    }
    return maxDiff - 2 * this.params.spaceAroundRadius;
  }
}
class ChildrenOffsetsGenerator {
  constructor(tree, params) {
    __publicField(this, "offsets", /* @__PURE__ */ new Map());
    __publicField(this, "treeSpans", /* @__PURE__ */ new Map());
    this.tree = tree;
    const radius = params.spaceAroundRadius;
    const generator = new AggregatedSubtreeGenerator({
      spaceAroundRadius: radius
    });
    [...this.tree.sequence].reverse().forEach((treeNode) => {
      const subtreeSpans = Array.from(treeNode.children).map(
        (childNode) => this.treeSpans.get(childNode.nodeId)
      );
      const aggregatedTree = generator.generate(subtreeSpans);
      let index = 0;
      treeNode.children.forEach((childNode) => {
        this.offsets.set(childNode.nodeId, aggregatedTree.childOffsets[index]);
        index++;
      });
      this.treeSpans.set(treeNode.nodeId, [
        { start: -radius, end: radius },
        ...aggregatedTree.subtreeSpans
      ]);
      treeNode.children.forEach((childNode) => {
        this.treeSpans.delete(childNode.nodeId);
      });
    });
    this.offsets.set(this.tree.root.nodeId, 0);
  }
  generate() {
    return this.offsets;
  }
}
class HierarchicalLayoutAlgorithm {
  constructor(params) {
    this.params = params;
  }
  calculateCoordinates(params) {
    const result = /* @__PURE__ */ new Map();
    const forestGenerator = new BreadthFirstSpanningForestGenerator(
      params.graph,
      this.params.nextLayerNodesResolver
    );
    const forest = forestGenerator.generate();
    let currentX = 0;
    forest.forEach((tree) => {
      result.set(tree.root.nodeId, { x: currentX, y: 0 });
      const offsetsGenerator = new ChildrenOffsetsGenerator(tree, {
        spaceAroundRadius: this.params.layerSpace / 2
      });
      const offsets = offsetsGenerator.generate();
      let currentLayer = [tree.root];
      while (currentLayer.length > 0) {
        const nextLayer = [];
        currentX += this.params.layerWidth;
        currentLayer.forEach((treeNode) => {
          treeNode.children.forEach((childTreeNode) => {
            const parentY = result.get(treeNode.nodeId).y;
            result.set(childTreeNode.nodeId, {
              y: parentY + offsets.get(childTreeNode.nodeId),
              x: currentX
            });
            nextLayer.push(childTreeNode);
          });
        });
        currentLayer = nextLayer;
      }
    });
    result.forEach((coord, nodeId) => {
      result.set(nodeId, this.params.transform(coord));
    });
    return result;
  }
}
const adjacentNextLayerNodesResolver = (params) => {
  const { graph, currentNodeId } = params;
  const outgoingNodeIds = graph.getNodeOutgoingEdgeIds(currentNodeId).map((edgeId) => {
    const edge = graph.getEdge(edgeId);
    const port = graph.getPort(edge.to);
    return port.nodeId;
  });
  const incomingNodeIds = graph.getNodeIncomingEdgeIds(currentNodeId).map((edgeId) => {
    const edge = graph.getEdge(edgeId);
    const port = graph.getPort(edge.from);
    return port.nodeId;
  });
  return /* @__PURE__ */ new Set([...outgoingNodeIds, ...incomingNodeIds]);
};
const outgoingNextLayerNodesResolver = (params) => {
  const { graph, currentNodeId } = params;
  const outgoingNodeIds = graph.getNodeOutgoingEdgeIds(currentNodeId).map((edgeId) => {
    const edge = graph.getEdge(edgeId);
    const port = graph.getPort(edge.to);
    return port.nodeId;
  });
  return new Set(outgoingNodeIds);
};
const incomingNextLayerNodesResolver = (params) => {
  const { graph, currentNodeId } = params;
  const outgoingNodeIds = graph.getNodeIncomingEdgeIds(currentNodeId).map((edgeId) => {
    const edge = graph.getEdge(edgeId);
    const port = graph.getPort(edge.from);
    return port.nodeId;
  });
  return new Set(outgoingNodeIds);
};
class ForceDirectedAnimatedLayoutAlgorithm {
  constructor(params) {
    __publicField(this, "distanceVectorGenerator");
    __publicField(this, "nodeForcesApplicationStrategy");
    __publicField(this, "convergenceVelocity");
    __publicField(this, "maxTimeDeltaSec");
    __publicField(this, "nodeMass");
    __publicField(this, "edgeEquilibriumLength");
    __publicField(this, "edgeStiffness");
    __publicField(this, "fillerLayoutAlgorithm");
    this.convergenceVelocity = params.convergenceVelocity;
    this.maxTimeDeltaSec = params.maxTimeDeltaSec;
    this.nodeMass = params.nodeMass;
    this.edgeEquilibriumLength = params.edgeEquilibriumLength;
    this.edgeStiffness = params.edgeStiffness;
    this.distanceVectorGenerator = new DistanceVectorGenerator(params.rand);
    this.nodeForcesApplicationStrategy = resolveNodeForcesApplicationStrategy({
      distanceVectorGenerator: this.distanceVectorGenerator,
      nodeCharge: params.nodeCharge,
      maxForce: params.maxForce,
      nodeForceCoefficient: params.nodeForceCoefficient,
      theta: params.barnesHutTheta,
      areaRadiusThreshold: params.barnesHutAreaRadiusThreshold,
      nodeMass: params.nodeMass
    });
    this.fillerLayoutAlgorithm = new RandomFillerLayoutAlgorithm({
      rand: params.rand,
      sparsity: params.edgeEquilibriumLength
    });
  }
  calculateNextCoordinates(params) {
    const { graph, viewport, dt } = params;
    const currentCoords = this.fillerLayoutAlgorithm.calculateCoordinates({
      graph,
      viewport
    });
    const iteration = new ForceDirectedAlgorithmIteration(
      graph,
      currentCoords,
      {
        distanceVectorGenerator: this.distanceVectorGenerator,
        nodeForcesApplicationStrategy: this.nodeForcesApplicationStrategy,
        dtSec: Math.min(dt, this.maxTimeDeltaSec),
        nodeMass: this.nodeMass,
        edgeEquilibriumLength: this.edgeEquilibriumLength,
        edgeStiffness: this.edgeStiffness
      }
    );
    const maxVelocity = iteration.apply();
    if (maxVelocity < this.convergenceVelocity) {
      const hasUnsetCoords = graph.getAllNodeIds().some((nodeId) => {
        const node = graph.getNode(nodeId);
        return node.x === null || node.y === null;
      });
      if (!hasUnsetCoords) {
        return /* @__PURE__ */ new Map();
      }
    }
    return currentCoords;
  }
}
const cyrb128 = (str) => {
  let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ h1 >>> 18, 597399067);
  h2 = Math.imul(h4 ^ h2 >>> 22, 2869860233);
  h3 = Math.imul(h1 ^ h3 >>> 17, 951274213);
  h4 = Math.imul(h2 ^ h4 >>> 19, 2716044179);
  h1 ^= h2 ^ h3 ^ h4;
  h2 ^= h1;
  h3 ^= h1;
  h4 ^= h1;
  return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
};
const sfc32 = (a, b, c, d) => {
  return function() {
    a |= 0;
    b |= 0;
    c |= 0;
    d |= 0;
    const t = (a + b | 0) + d | 0;
    d = d + 1 | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = c << 21 | c >>> 11;
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  };
};
const forceDirectedDefaults = Object.freeze({
  seed: "HTMLGraph is awesome",
  maxTimeDeltaSec: 0.01,
  nodeCharge: 1e5,
  nodeMass: 1,
  edgeEquilibriumLength: 300,
  edgeStiffness: 1e3,
  dtSec: 0.01,
  maxIterations: 1e3,
  convergenceVelocity: 10,
  maxForce: 1e7,
  nodeForceCoefficient: 1,
  barnesHutAreaRadiusThreshold: 0.01,
  barnesHutTheta: 1
});
const selectionDefaults = Object.freeze({
  mouseDownEventVerifier: (event) => event.button === 0,
  mouseUpEventVerifier: (event) => event.button === 0,
  movementThreshold: 10
});
const resolveAnimatedLayoutAlgorithm = (config) => {
  var _a, _b;
  switch (config == null ? void 0 : config.type) {
    case "custom": {
      return config.instance;
    }
    default: {
      const seed = cyrb128((config == null ? void 0 : config.seed) ?? forceDirectedDefaults.seed);
      const rand = sfc32(seed[0], seed[1], seed[2], seed[3]);
      return new ForceDirectedAnimatedLayoutAlgorithm({
        rand,
        maxTimeDeltaSec: (config == null ? void 0 : config.maxTimeDeltaSec) ?? forceDirectedDefaults.maxTimeDeltaSec,
        nodeCharge: (config == null ? void 0 : config.nodeCharge) ?? forceDirectedDefaults.nodeCharge,
        nodeMass: (config == null ? void 0 : config.nodeMass) ?? forceDirectedDefaults.nodeMass,
        edgeEquilibriumLength: (config == null ? void 0 : config.edgeEquilibriumLength) ?? forceDirectedDefaults.edgeEquilibriumLength,
        edgeStiffness: (config == null ? void 0 : config.edgeStiffness) ?? forceDirectedDefaults.edgeStiffness,
        convergenceVelocity: (config == null ? void 0 : config.convergenceVelocity) ?? forceDirectedDefaults.convergenceVelocity,
        maxForce: (config == null ? void 0 : config.maxForce) ?? forceDirectedDefaults.maxForce,
        nodeForceCoefficient: (config == null ? void 0 : config.nodeForceCoefficient) ?? forceDirectedDefaults.nodeForceCoefficient,
        barnesHutTheta: ((_a = config == null ? void 0 : config.barnesHut) == null ? void 0 : _a.theta) ?? forceDirectedDefaults.barnesHutTheta,
        barnesHutAreaRadiusThreshold: ((_b = config == null ? void 0 : config.barnesHut) == null ? void 0 : _b.areaRadiusThreshold) ?? forceDirectedDefaults.barnesHutAreaRadiusThreshold
      });
    }
  }
};
const defaults$1 = {
  staticNodeResolver: () => false,
  onBeforeApplied: () => {
  },
  onAfterApplied: () => {
  }
};
const createAnimatedLayoutParams = (config) => {
  var _a, _b;
  const algorithm = resolveAnimatedLayoutAlgorithm((config == null ? void 0 : config.algorithm) ?? {});
  return {
    algorithm,
    staticNodeResolver: (config == null ? void 0 : config.staticNodeResolver) ?? defaults$1.staticNodeResolver,
    onBeforeApplied: ((_a = config == null ? void 0 : config.events) == null ? void 0 : _a.onBeforeApplied) ?? defaults$1.onBeforeApplied,
    onAfterApplied: ((_b = config == null ? void 0 : config.events) == null ? void 0 : _b.onAfterApplied) ?? defaults$1.onAfterApplied
  };
};
const resolveLayoutApplyOn = (applyOn) => {
  if (applyOn instanceof EventSubject) {
    return {
      type: "trigger",
      trigger: applyOn
    };
  }
  if ((applyOn == null ? void 0 : applyOn.type) === "topologyChangeMacrotask") {
    return {
      type: "topologyChangeSchedule",
      schedule: macrotaskScheduleFn
    };
  }
  return {
    type: "topologyChangeSchedule",
    schedule: microtaskScheduleFn
  };
};
const defaults = Object.freeze({
  staticNodeResolver: () => false,
  onBeforeApplied: () => {
  },
  onAfterApplied: () => {
  },
  hierarchicalLayout: {
    layerWidth: 300,
    layerSpace: 300
  }
});
const multiplyTransformationMatrices = (m1, m2) => {
  return {
    a: m1.a * m2.a + m1.b * m2.d,
    b: m1.a * m2.b + m1.b * m2.e,
    c: m1.a * m2.c + m1.b * m2.f + m1.c,
    d: m1.d * m2.a + m1.e * m2.d,
    e: m1.d * m2.b + m1.e * m2.e,
    f: m1.d * m2.c + m1.e * m2.f + m1.f
  };
};
const calculateReverseMartix = (matrix) => {
  const { a, b, c, d, e, f } = matrix;
  const delta = a * e - b * d;
  return {
    a: e / delta,
    b: -b / delta,
    c: (b * f - c * e) / delta,
    d: -d / delta,
    e: a / delta,
    f: (c * d - a * f) / delta
  };
};
class TransformationMatrixResolver {
  resolve(transform) {
    if ("shift" in transform) {
      return this.createShiftBaseMatrix(transform.shift);
    }
    if ("scale" in transform) {
      const origin = transform.origin ?? { x: 0, y: 0 };
      return this.createScaleRelativeMatrix(transform.scale, origin);
    }
    if ("rotate" in transform) {
      const origin = transform.origin ?? { x: 0, y: 0 };
      return this.createRotateRelativeMatrix(transform.rotate, origin);
    }
    if ("mirror" in transform) {
      const origin = transform.origin ?? { x: 0, y: 0 };
      return this.createMirrorRelativeMatrix(transform.mirror, origin);
    }
    return {
      a: transform.a ?? 1,
      b: transform.b ?? 0,
      c: transform.c ?? 0,
      d: transform.d ?? 0,
      e: transform.e ?? 1,
      f: transform.f ?? 0
    };
  }
  createScaleRelativeMatrix(scale, origin) {
    const baseMatrix = this.createScaleBaseMatrix(scale);
    const directMatrix = this.createShiftBaseMatrix(origin);
    return this.createRelativeTransform(baseMatrix, directMatrix);
  }
  createRotateRelativeMatrix(angle, origin) {
    const baseMatrix = this.createRotateBaseMatrix(angle);
    const directMatrix = this.createShiftBaseMatrix(origin);
    return this.createRelativeTransform(baseMatrix, directMatrix);
  }
  createMirrorRelativeMatrix(direction, origin) {
    const baseMatrix = this.createMirrorYBaseMatrix();
    const directMatrix = multiplyTransformationMatrices(
      this.createShiftBaseMatrix(origin),
      this.createRotateBaseMatrix(direction)
    );
    return this.createRelativeTransform(baseMatrix, directMatrix);
  }
  createRelativeTransform(baseMatrix, directMatrix) {
    const intermediateMatrix = multiplyTransformationMatrices(
      directMatrix,
      baseMatrix
    );
    const reverseMatrix = calculateReverseMartix(directMatrix);
    return multiplyTransformationMatrices(intermediateMatrix, reverseMatrix);
  }
  createShiftBaseMatrix(shift) {
    return {
      a: 1,
      b: 0,
      c: shift.x,
      d: 0,
      e: 1,
      f: shift.y
    };
  }
  createScaleBaseMatrix(scale) {
    return {
      a: scale,
      b: 0,
      c: 0,
      d: 0,
      e: scale,
      f: 0
    };
  }
  createRotateBaseMatrix(angle) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    return {
      a: cos,
      b: -sin,
      c: 0,
      d: sin,
      e: cos,
      f: 0
    };
  }
  createMirrorYBaseMatrix() {
    return {
      a: 1,
      b: 0,
      c: 0,
      d: 0,
      e: -1,
      f: 0
    };
  }
}
const resolveTransformFn = (config) => {
  if (config === void 0) {
    return (point) => point;
  }
  if (typeof config === "function") {
    return config;
  }
  const transformations = Array.isArray(config) ? config : [config];
  let finalMatrix = {
    a: 1,
    b: 0,
    c: 0,
    d: 0,
    e: 1,
    f: 0
  };
  const resolver = new TransformationMatrixResolver();
  transformations.forEach((transformation) => {
    const matrix = resolver.resolve(transformation);
    finalMatrix = multiplyTransformationMatrices(finalMatrix, matrix);
  });
  return (point) => {
    const { x, y } = point;
    return {
      x: finalMatrix.a * x + finalMatrix.b * y + finalMatrix.c,
      y: finalMatrix.d * x + finalMatrix.e * y + finalMatrix.f
    };
  };
};
const resolveNextLayerNodesResolver = (resolver) => {
  if (typeof resolver === "function") {
    return resolver;
  }
  switch (resolver) {
    case "outgoing":
      return outgoingNextLayerNodesResolver;
    case "incoming":
      return incomingNextLayerNodesResolver;
    default:
      return adjacentNextLayerNodesResolver;
  }
};
const resolveLayoutAlgorithm = (config) => {
  var _a, _b;
  switch (config == null ? void 0 : config.type) {
    case "custom": {
      return config.instance;
    }
    case "hierarchical": {
      return new HierarchicalLayoutAlgorithm({
        layerWidth: config.layerWidth ?? defaults.hierarchicalLayout.layerWidth,
        layerSpace: config.layerSpace ?? defaults.hierarchicalLayout.layerSpace,
        transform: resolveTransformFn(config.transform),
        nextLayerNodesResolver: resolveNextLayerNodesResolver(
          config.nextLayerNodesResolver
        )
      });
    }
    default: {
      const seed = cyrb128((config == null ? void 0 : config.seed) ?? forceDirectedDefaults.seed);
      const rand = sfc32(seed[0], seed[1], seed[2], seed[3]);
      return new ForceDirectedLayoutAlgorithm({
        dtSec: (config == null ? void 0 : config.dtSec) ?? forceDirectedDefaults.dtSec,
        maxIterations: (config == null ? void 0 : config.maxIterations) ?? forceDirectedDefaults.maxIterations,
        rand,
        nodeCharge: (config == null ? void 0 : config.nodeCharge) ?? forceDirectedDefaults.nodeCharge,
        nodeMass: (config == null ? void 0 : config.nodeMass) ?? forceDirectedDefaults.nodeMass,
        edgeEquilibriumLength: (config == null ? void 0 : config.edgeEquilibriumLength) ?? forceDirectedDefaults.edgeEquilibriumLength,
        edgeStiffness: (config == null ? void 0 : config.edgeStiffness) ?? forceDirectedDefaults.edgeStiffness,
        convergenceVelocity: (config == null ? void 0 : config.convergenceVelocity) ?? forceDirectedDefaults.convergenceVelocity,
        maxForce: (config == null ? void 0 : config.maxForce) ?? forceDirectedDefaults.maxForce,
        nodeForceCoefficient: (config == null ? void 0 : config.nodeForceCoefficient) ?? forceDirectedDefaults.nodeForceCoefficient,
        barnesHutTheta: ((_a = config == null ? void 0 : config.barnesHut) == null ? void 0 : _a.theta) ?? forceDirectedDefaults.barnesHutTheta,
        barnesHutAreaRadiusThreshold: ((_b = config == null ? void 0 : config.barnesHut) == null ? void 0 : _b.areaRadiusThreshold) ?? forceDirectedDefaults.barnesHutAreaRadiusThreshold
      });
    }
  }
};
const createLayoutParams = (config) => {
  var _a, _b;
  return {
    algorithm: resolveLayoutAlgorithm(config.algorithm),
    applyOn: resolveLayoutApplyOn(config.applyOn),
    staticNodeResolver: config.staticNodeResolver ?? defaults.staticNodeResolver,
    onBeforeApplied: ((_a = config.events) == null ? void 0 : _a.onBeforeApplied) ?? defaults.onBeforeApplied,
    onAfterApplied: ((_b = config.events) == null ? void 0 : _b.onAfterApplied) ?? defaults.onAfterApplied
  };
};
const patchAnimatedLayoutDraggableNodesParams = (params, staticNodes) => {
  return {
    ...params,
    onNodeDragStarted: (nodeId) => {
      staticNodes.add(nodeId);
      params.onNodeDragStarted(nodeId);
    },
    onNodeDragFinished: (nodeId) => {
      staticNodes.delete(nodeId);
      params.onNodeDragFinished(nodeId);
    }
  };
};
const subscribeAnimatedLayoutStaticNodesUpdate = (canvas, animationStaticNodes) => {
  canvas.graph.onBeforeNodeRemoved.subscribe((nodeId) => {
    animationStaticNodes.delete(nodeId);
  });
  canvas.graph.onBeforeClear.subscribe(() => {
    animationStaticNodes.clear();
  });
  canvas.onBeforeDestroy.subscribe(() => {
    animationStaticNodes.clear();
  });
};
const patchDraggableNodesAnimatedLayoutParams = (params, animationStaticNodes) => {
  return {
    ...params,
    staticNodeResolver: (nodeId) => params.staticNodeResolver(nodeId) || animationStaticNodes.has(nodeId)
  };
};
const createConstantPriorityFn = (priority) => {
  return () => priority;
};
const standardPriorityFn = createConstantPriorityFn(0);
const createIncrementalPriorityFn = () => {
  let i = 0;
  return () => i++;
};
const resolvePriority = (nodesPriority, edgesPriority) => {
  let nodesPriorityFn = standardPriorityFn;
  let edgesPriorityFn = standardPriorityFn;
  const sharedFn = createIncrementalPriorityFn();
  if (nodesPriority === "incremental") {
    nodesPriorityFn = sharedFn;
  }
  if (edgesPriority === "incremental") {
    edgesPriorityFn = sharedFn;
  }
  if (typeof nodesPriority === "number") {
    nodesPriorityFn = createConstantPriorityFn(nodesPriority);
  }
  if (typeof edgesPriority === "number") {
    edgesPriorityFn = createConstantPriorityFn(edgesPriority);
  }
  if (typeof nodesPriority === "function") {
    nodesPriorityFn = nodesPriority;
  }
  if (typeof edgesPriority === "function") {
    edgesPriorityFn = edgesPriority;
  }
  return {
    nodesPriorityFn,
    edgesPriorityFn
  };
};
const createGraphControllerParams = (canvasDefaults) => {
  var _a, _b, _c, _d, _e;
  const priorities = resolvePriority(
    (_a = canvasDefaults.nodes) == null ? void 0 : _a.priority,
    (_b = canvasDefaults.edges) == null ? void 0 : _b.priority
  );
  return {
    nodes: {
      centerFn: ((_c = canvasDefaults.nodes) == null ? void 0 : _c.centerFn) ?? standardCenterFn,
      priorityFn: priorities.nodesPriorityFn
    },
    ports: {
      direction: ((_d = canvasDefaults.ports) == null ? void 0 : _d.direction) ?? 0
    },
    edges: {
      shapeFactory: resolveEdgeShapeFactory(((_e = canvasDefaults.edges) == null ? void 0 : _e.shape) ?? {}),
      priorityFn: priorities.edgesPriorityFn
    }
  };
};
const resolveLayoutFocusSchedule = (layoutParams) => {
  if (layoutParams.applyOn.type === "topologyChangeSchedule") {
    return layoutParams.applyOn.schedule;
  }
  return immediateScheduleFn;
};
const createViewportControllerParams = (params) => {
  var _a, _b, _c, _d;
  const { canvasDefaults } = params;
  const schedule = params.hasLayout ? resolveLayoutFocusSchedule(params.layoutParams) : immediateScheduleFn;
  return {
    focus: {
      contentPadding: ((_a = canvasDefaults.focus) == null ? void 0 : _a.contentPadding) ?? ((_b = canvasDefaults.focus) == null ? void 0 : _b.contentOffset) ?? 100,
      minContentScale: ((_c = canvasDefaults.focus) == null ? void 0 : _c.minContentScale) ?? 0,
      schedule,
      animationDuration: ((_d = canvasDefaults.focus) == null ? void 0 : _d.animationDuration) ?? 0
    }
  };
};
const createUserSelectableNodesParams = (config) => {
  return {
    onNodeSelected: config.onNodeSelected,
    mouseDownEventVerifier: config.mouseDownEventVerifier ?? selectionDefaults.mouseDownEventVerifier,
    mouseUpEventVerifier: config.mouseUpEventVerifier ?? selectionDefaults.mouseUpEventVerifier,
    movementThreshold: config.movementThreshold ?? selectionDefaults.movementThreshold
  };
};
const createUserSelectableCanvasParams = (config) => {
  return {
    onCanvasSelected: config.onCanvasSelected,
    mouseDownEventVerifier: config.mouseDownEventVerifier ?? selectionDefaults.mouseDownEventVerifier,
    mouseUpEventVerifier: config.mouseUpEventVerifier ?? selectionDefaults.mouseUpEventVerifier,
    movementThreshold: config.movementThreshold ?? selectionDefaults.movementThreshold
  };
};
class CanvasBuilder {
  constructor(element) {
    __publicField(this, "used", false);
    __publicField(this, "canvasDefaults", {});
    __publicField(this, "dragConfig", {});
    __publicField(this, "transformConfig", {});
    __publicField(this, "backgroundConfig", {});
    __publicField(this, "connectablePortsConfig", {});
    __publicField(this, "draggableEdgesConfig", {});
    __publicField(this, "virtualScrollConfig");
    __publicField(this, "layoutConfig", {});
    __publicField(this, "animatedLayoutConfig", {});
    __publicField(this, "userSelectableNodesConfig");
    __publicField(this, "userSelectableCanvasConfig");
    __publicField(this, "hasDraggableNodes", false);
    __publicField(this, "hasTransformableViewport", false);
    __publicField(this, "hasNodeResizeReactiveEdges", false);
    __publicField(this, "hasBackground", false);
    __publicField(this, "hasUserConnectablePorts", false);
    __publicField(this, "hasUserDraggableEdges", false);
    __publicField(this, "hasAnimatedLayout", false);
    __publicField(this, "hasLayout", false);
    __publicField(this, "boxRenderingTrigger", new EventSubject());
    __publicField(this, "window", window);
    __publicField(this, "animationStaticNodes", /* @__PURE__ */ new Set());
    __publicField(this, "pointInsideVerifier");
    this.element = element;
    this.pointInsideVerifier = new PointInsideVerifier(element, this.window);
  }
  setDefaults(defaults2) {
    this.canvasDefaults = defaults2;
    return this;
  }
  enableUserDraggableNodes(config) {
    this.hasDraggableNodes = true;
    this.dragConfig = config ?? {};
    return this;
  }
  enableUserTransformableViewport(config) {
    this.hasTransformableViewport = true;
    this.transformConfig = config ?? {};
    return this;
  }
  enableNodeResizeReactiveEdges() {
    this.hasNodeResizeReactiveEdges = true;
    return this;
  }
  enableVirtualScroll(config) {
    this.virtualScrollConfig = config;
    return this;
  }
  enableBackground(config) {
    this.hasBackground = true;
    this.backgroundConfig = config ?? {};
    return this;
  }
  enableUserConnectablePorts(config) {
    this.hasUserConnectablePorts = true;
    this.connectablePortsConfig = config ?? {};
    return this;
  }
  enableUserDraggableEdges(config) {
    this.hasUserDraggableEdges = true;
    this.draggableEdgesConfig = config ?? {};
    return this;
  }
  enableLayout(config) {
    this.layoutConfig = config ?? {};
    this.hasLayout = true;
    this.hasAnimatedLayout = false;
    return this;
  }
  enableAnimatedLayout(config) {
    this.animatedLayoutConfig = config ?? {};
    this.hasAnimatedLayout = true;
    this.hasLayout = false;
    return this;
  }
  enableUserSelectableNodes(config) {
    this.userSelectableNodesConfig = config;
    return this;
  }
  enableUserSelectableCanvas(config) {
    this.userSelectableCanvasConfig = config;
    return this;
  }
  build() {
    if (this.used) {
      throw new CanvasBuilderError(
        "Failed to build Canvas because CanvasBuilder is a single-use object"
      );
    }
    this.used = true;
    const viewportStore = new ViewportStore(this.element);
    const graphStore = new GraphStore();
    const layers = new Layers(this.element);
    const htmlView = this.createHtmlView(
      layers.main,
      graphStore,
      viewportStore
    );
    const graphControllerParams = createGraphControllerParams(
      this.canvasDefaults
    );
    const graphController = new GraphController(
      graphStore,
      htmlView,
      graphControllerParams
    );
    const layoutParams = createLayoutParams(this.layoutConfig);
    const viewportControllerParams = createViewportControllerParams({
      canvasDefaults: this.canvasDefaults,
      hasLayout: this.hasLayout,
      layoutParams
    });
    const viewportController = new ViewportController(
      graphStore,
      viewportStore,
      viewportControllerParams,
      this.window
    );
    const viewport = new Viewport(viewportStore);
    const graph = new Graph(graphStore);
    const canvas = new Canvas(
      graph,
      viewport,
      graphController,
      viewportController
    );
    if (this.hasBackground) {
      BackgroundConfigurator.configure(
        canvas,
        createBackgroundParams(this.backgroundConfig),
        layers.background
      );
    }
    if (this.hasNodeResizeReactiveEdges) {
      NodeResizeReactiveEdgesConfigurator.configure(canvas);
    }
    if (this.userSelectableNodesConfig !== void 0) {
      const params = createUserSelectableNodesParams(
        this.userSelectableNodesConfig
      );
      UserSelectableNodesConfigurator.configure(
        canvas,
        this.window,
        this.pointInsideVerifier,
        params
      );
    }
    if (this.userSelectableCanvasConfig !== void 0) {
      const params = createUserSelectableCanvasParams(
        this.userSelectableCanvasConfig
      );
      UserSelectableCanvasConfigurator.configure(
        canvas,
        layers.main,
        this.window,
        this.pointInsideVerifier,
        params
      );
    }
    if (this.hasDraggableNodes) {
      let draggableNodesParams = createDraggableNodesParams(this.dragConfig);
      if (this.hasAnimatedLayout) {
        draggableNodesParams = patchAnimatedLayoutDraggableNodesParams(
          draggableNodesParams,
          this.animationStaticNodes
        );
      }
      UserDraggableNodesConfigurator.configure(
        canvas,
        layers.main,
        this.window,
        this.pointInsideVerifier,
        draggableNodesParams
      );
    }
    if (this.hasUserConnectablePorts) {
      const params = createConnectablePortsParams(
        this.connectablePortsConfig,
        graphControllerParams.edges.shapeFactory,
        graphControllerParams.ports.direction
      );
      UserConnectablePortsConfigurator.configure(
        canvas,
        layers.overlayConnectablePorts,
        viewportStore,
        this.window,
        this.pointInsideVerifier,
        params
      );
    }
    if (this.hasUserDraggableEdges) {
      const dragEdgeParams = createDraggableEdgeParams(
        this.draggableEdgesConfig,
        canvas.graph
      );
      UserDraggableEdgesConfigurator.configure(
        canvas,
        layers.overlayDraggableEdges,
        viewportStore,
        this.window,
        this.pointInsideVerifier,
        dragEdgeParams
      );
    }
    if (this.virtualScrollConfig !== void 0) {
      UserTransformableViewportVirtualScrollConfigurator.configure(
        canvas,
        layers.main,
        this.window,
        createTransformableViewportParams(this.transformConfig),
        this.boxRenderingTrigger,
        this.pointInsideVerifier,
        createVirtualScrollParams(this.virtualScrollConfig)
      );
    } else if (this.hasTransformableViewport) {
      UserTransformableViewportConfigurator.configure(
        canvas,
        layers.main,
        this.window,
        this.pointInsideVerifier,
        createTransformableViewportParams(this.transformConfig)
      );
    }
    if (this.hasLayout) {
      LayoutConfigurator.configure(canvas, layoutParams);
    }
    if (this.hasAnimatedLayout) {
      let config = createAnimatedLayoutParams(
        this.animatedLayoutConfig
      );
      if (this.hasDraggableNodes) {
        subscribeAnimatedLayoutStaticNodesUpdate(
          canvas,
          this.animationStaticNodes
        );
        config = patchDraggableNodesAnimatedLayoutParams(
          config,
          this.animationStaticNodes
        );
      }
      AnimatedLayoutConfigurator.configure(canvas, config, this.window);
    }
    const onBeforeDestroy = () => {
      layers.destroy();
      canvas.onBeforeDestroy.unsubscribe(onBeforeDestroy);
    };
    canvas.onBeforeDestroy.subscribe(onBeforeDestroy);
    return canvas;
  }
  createHtmlView(host, graphStore, viewportStore) {
    let htmlView = new CoreHtmlView(graphStore, viewportStore, host);
    if (this.virtualScrollConfig !== void 0) {
      htmlView = new VirtualScrollHtmlView(
        htmlView,
        graphStore,
        this.boxRenderingTrigger,
        createVirtualScrollHtmlViewParams(this.virtualScrollConfig)
      );
    }
    htmlView = new LayoutHtmlView(htmlView, graphStore);
    return htmlView;
  }
}
export {
  BezierEdgeShape,
  CanvasBuilder,
  CanvasBuilderError,
  CanvasError,
  ConnectionCategory,
  DirectEdgeShape,
  EventSubject,
  HorizontalEdgeShape,
  InteractiveEdgeError,
  InteractiveEdgeShape,
  MidpointEdgeShape,
  StraightEdgeShape,
  VerticalEdgeShape
};
