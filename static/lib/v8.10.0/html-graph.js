var Je = Object.defineProperty;
var Ke = (r, e, t) => e in r ? Je(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var i = (r, e, t) => Ke(r, typeof e != "symbol" ? e + "" : e, t);
var L = /* @__PURE__ */ ((r) => (r.Line = "line", r.NodeCycle = "node-cycle", r.PortCycle = "port-cycle", r))(L || {});
const Qe = () => {
  const r = document.createElement("div");
  return r.style.width = "100%", r.style.height = "100%", r.style.position = "relative", r.style.overflow = "hidden", r;
}, Ze = () => {
  const r = document.createElement("div");
  return r.style.position = "absolute", r.style.top = "0", r.style.left = "0", r.style.width = "0", r.style.height = "0", r;
}, _e = (r) => {
  r.style.position = "absolute", r.style.top = "0", r.style.left = "0", r.style.visibility = "hidden";
}, qe = (r) => {
  r.style.removeProperty("position"), r.style.removeProperty("top"), r.style.removeProperty("left"), r.style.removeProperty("visibility"), r.style.removeProperty("transform");
};
class Ee {
  constructor(e, t, o) {
    i(this, "host", Qe());
    i(this, "container", Ze());
    i(this, "edgeIdToElementMap", /* @__PURE__ */ new Map());
    i(this, "attachedNodeIds", /* @__PURE__ */ new Set());
    i(this, "applyTransform", () => {
      const e = this.viewportStore.getContentMatrix();
      this.container.style.transform = `matrix(${e.scale}, 0, 0, ${e.scale}, ${e.x}, ${e.y})`;
    });
    this.graphStore = e, this.viewportStore = t, this.element = o, this.element.appendChild(this.host), this.host.appendChild(this.container), this.viewportStore.onAfterUpdated.subscribe(this.applyTransform);
  }
  attachNode(e) {
    const t = this.graphStore.getNode(e);
    _e(t.element), this.attachedNodeIds.add(e), this.container.appendChild(t.element), this.updateNodePosition(e), this.updateNodePriority(e), t.element.style.visibility = "visible";
  }
  detachNode(e) {
    const t = this.graphStore.getNode(e);
    qe(t.element), this.container.removeChild(t.element), this.attachedNodeIds.delete(e);
  }
  attachEdge(e) {
    const t = this.graphStore.getEdge(e).payload.shape.svg;
    this.edgeIdToElementMap.set(e, t), this.container.appendChild(t), this.renderEdge(e), this.updateEdgePriority(e);
  }
  detachEdge(e) {
    const t = this.edgeIdToElementMap.get(e);
    this.container.removeChild(t), this.edgeIdToElementMap.delete(e);
  }
  clear() {
    this.edgeIdToElementMap.forEach((e, t) => {
      this.detachEdge(t);
    }), this.attachedNodeIds.forEach((e) => {
      this.detachNode(e);
    });
  }
  destroy() {
    this.clear(), this.viewportStore.onAfterUpdated.unsubscribe(this.applyTransform), this.element.removeChild(this.host), this.host.removeChild(this.container);
  }
  updateNodePosition(e) {
    const t = this.graphStore.getNode(e), { width: o, height: s } = t.element.getBoundingClientRect(), n = this.viewportStore.getViewportMatrix().scale, { payload: a } = t, h = a.centerFn(o, s), d = a.x - n * h.x, c = a.y - n * h.y;
    t.element.style.transform = `translate(${d}px, ${c}px)`;
  }
  updateNodePriority(e) {
    const t = this.graphStore.getNode(e);
    t.element.style.zIndex = `${t.payload.priority}`;
  }
  updateEdgeShape(e) {
    const t = this.edgeIdToElementMap.get(e);
    this.container.removeChild(t);
    const s = this.graphStore.getEdge(e).payload.shape.svg;
    this.edgeIdToElementMap.set(e, s), this.container.appendChild(s);
  }
  renderEdge(e) {
    const t = this.graphStore.getEdge(e), o = this.graphStore.getPort(t.from), s = this.graphStore.getPort(t.to), n = o.element.getBoundingClientRect(), a = s.element.getBoundingClientRect(), h = this.host.getBoundingClientRect(), d = this.viewportStore.getViewportMatrix().scale, c = this.createEdgeRenderPort(
      o,
      n,
      h,
      d
    ), g = this.createEdgeRenderPort(s, a, h, d);
    let u = L.Line;
    o.element === s.element ? u = L.PortCycle : o.nodeId === s.nodeId && (u = L.NodeCycle), t.payload.shape.render({ from: c, to: g, category: u });
  }
  updateEdgePriority(e) {
    const t = this.graphStore.getEdge(e);
    t.payload.shape.svg.style.zIndex = `${t.payload.priority}`;
  }
  createEdgeRenderPort(e, t, o, s) {
    const n = this.viewportStore.createContentCoords({
      x: t.left - o.left,
      y: t.top - o.top
    });
    return {
      x: n.x,
      y: n.y,
      width: t.width * s,
      height: t.height * s,
      direction: e.payload.direction
    };
  }
}
class et {
  constructor(e) {
    i(this, "xFrom", 1 / 0);
    i(this, "yFrom", 1 / 0);
    i(this, "xTo", 1 / 0);
    i(this, "yTo", 1 / 0);
    this.graphStore = e;
  }
  setRenderingBox(e) {
    this.xFrom = e.x, this.xTo = e.x + e.width, this.yFrom = e.y, this.yTo = e.y + e.height;
  }
  hasNode(e) {
    const t = this.graphStore.getNode(e).payload, { x: o, y: s } = t;
    return o >= this.xFrom && o <= this.xTo && s >= this.yFrom && s <= this.yTo;
  }
  hasEdge(e) {
    const t = this.graphStore.getEdge(e), o = this.graphStore.getPort(t.from).nodeId, s = this.graphStore.getPort(t.to).nodeId, n = this.graphStore.getNode(o).payload, a = this.graphStore.getNode(s).payload, h = Math.min(n.x, a.x), d = Math.max(n.x, a.x), c = Math.min(n.y, a.y), g = Math.max(n.y, a.y);
    return h <= this.xTo && d >= this.xFrom && c <= this.yTo && g >= this.yFrom;
  }
}
class tt {
  constructor(e, t, o, s) {
    i(this, "attachedNodes", /* @__PURE__ */ new Set());
    i(this, "attachedEdges", /* @__PURE__ */ new Set());
    i(this, "renderingBox");
    i(this, "updateViewport", (e) => {
      this.renderingBox.setRenderingBox(e);
      const t = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
      this.graphStore.getAllNodeIds().forEach((a) => {
        const h = this.renderingBox.hasNode(a), d = this.attachedNodes.has(a);
        h && !d ? t.add(a) : !h && d && o.add(a);
      }), this.graphStore.getAllEdgeIds().forEach((a) => {
        const h = this.renderingBox.hasEdge(a), d = this.attachedEdges.has(a), c = this.graphStore.getEdge(a), g = this.graphStore.getPort(c.from).nodeId, u = this.graphStore.getPort(c.to).nodeId;
        h && (this.renderingBox.hasNode(g) || (t.add(g), o.delete(g)), this.renderingBox.hasNode(u) || (t.add(u), o.delete(u))), h && !d ? s.add(a) : !h && d && n.add(a);
      }), n.forEach((a) => {
        this.handleDetachEdge(a);
      }), o.forEach((a) => {
        this.handleDetachNode(a);
      }), t.forEach((a) => {
        this.attachedNodes.has(a) || this.handleAttachNode(a);
      }), s.forEach((a) => {
        this.handleAttachEdge(a);
      });
    });
    this.htmlView = e, this.graphStore = t, this.trigger = o, this.params = s, this.renderingBox = new et(this.graphStore), this.trigger.subscribe(this.updateViewport);
  }
  attachNode(e) {
    this.renderingBox.hasNode(e) && this.handleAttachNode(e);
  }
  detachNode(e) {
    this.attachedNodes.has(e) && this.handleDetachNode(e);
  }
  attachEdge(e) {
    this.renderingBox.hasEdge(e) && this.attachEdgeEntities(e);
  }
  detachEdge(e) {
    this.attachedEdges.has(e) && this.handleDetachEdge(e);
  }
  updateNodePosition(e) {
    this.attachedNodes.has(e) ? this.htmlView.updateNodePosition(e) : this.renderingBox.hasNode(e) && (this.handleAttachNode(e), this.graphStore.getNodeAdjacentEdgeIds(e).forEach((t) => {
      this.attachEdgeEntities(t);
    }));
  }
  updateNodePriority(e) {
    this.attachedNodes.has(e) && this.htmlView.updateNodePriority(e);
  }
  updateEdgeShape(e) {
    this.attachedEdges.has(e) && this.htmlView.updateEdgeShape(e);
  }
  renderEdge(e) {
    this.attachedEdges.has(e) && this.htmlView.renderEdge(e);
  }
  updateEdgePriority(e) {
    this.attachedEdges.has(e) && this.htmlView.updateEdgePriority(e);
  }
  clear() {
    this.htmlView.clear(), this.attachedNodes.clear(), this.attachedEdges.clear();
  }
  destroy() {
    this.clear(), this.htmlView.destroy(), this.trigger.unsubscribe(this.updateViewport);
  }
  attachEdgeEntities(e) {
    const t = this.graphStore.getEdge(e), o = this.graphStore.getPort(t.from).nodeId, s = this.graphStore.getPort(t.to).nodeId;
    this.attachedNodes.has(o) || this.handleAttachNode(o), this.attachedNodes.has(s) || this.handleAttachNode(s), this.handleAttachEdge(e);
  }
  handleAttachNode(e) {
    this.params.onBeforeNodeAttached(e), this.attachedNodes.add(e), this.htmlView.attachNode(e);
  }
  handleDetachNode(e) {
    this.htmlView.detachNode(e), this.attachedNodes.delete(e), this.params.onAfterNodeDetached(e);
  }
  handleAttachEdge(e) {
    this.attachedEdges.add(e), this.htmlView.attachEdge(e);
  }
  handleDetachEdge(e) {
    this.htmlView.detachEdge(e), this.attachedEdges.delete(e);
  }
}
class rt {
  constructor(e, t) {
    i(this, "deferredNodes", /* @__PURE__ */ new Set());
    i(this, "deferredEdges", /* @__PURE__ */ new Set());
    this.htmlView = e, this.graphStore = t;
  }
  attachNode(e) {
    this.isNodeValid(e) ? this.htmlView.attachNode(e) : this.deferredNodes.add(e);
  }
  detachNode(e) {
    this.deferredNodes.has(e) ? this.deferredNodes.delete(e) : this.htmlView.detachNode(e);
  }
  attachEdge(e) {
    this.isEdgeValid(e) ? this.htmlView.attachEdge(e) : this.deferredEdges.add(e);
  }
  detachEdge(e) {
    this.deferredEdges.has(e) ? this.deferredEdges.delete(e) : this.htmlView.detachEdge(e);
  }
  updateNodePosition(e) {
    this.deferredNodes.has(e) ? this.tryAttachNode(e) : this.htmlView.updateNodePosition(e);
  }
  updateNodePriority(e) {
    this.deferredNodes.has(e) ? this.tryAttachNode(e) : this.htmlView.updateNodePriority(e);
  }
  updateEdgeShape(e) {
    this.deferredEdges.has(e) ? this.tryAttachEdge(e) : this.htmlView.updateEdgeShape(e);
  }
  renderEdge(e) {
    this.deferredEdges.has(e) ? this.tryAttachEdge(e) : this.htmlView.renderEdge(e);
  }
  updateEdgePriority(e) {
    this.deferredEdges.has(e) ? this.tryAttachEdge(e) : this.htmlView.updateEdgePriority(e);
  }
  clear() {
    this.deferredNodes.clear(), this.deferredEdges.clear(), this.htmlView.clear();
  }
  destroy() {
    this.htmlView.destroy();
  }
  isNodeValid(e) {
    const t = this.graphStore.getNode(e);
    return !(t.payload.x === null || t.payload.y === null);
  }
  tryAttachNode(e) {
    this.isNodeValid(e) && (this.deferredNodes.delete(e), this.htmlView.attachNode(e));
  }
  isEdgeValid(e) {
    const t = this.graphStore.getEdge(e), o = this.graphStore.getPort(t.from), s = this.graphStore.getPort(t.to);
    return !(this.deferredNodes.has(o.nodeId) || this.deferredNodes.has(s.nodeId));
  }
  tryAttachEdge(e) {
    this.isEdgeValid(e) && (this.deferredEdges.delete(e), this.htmlView.attachEdge(e));
  }
}
class _ {
  constructor() {
    i(this, "callbacks", /* @__PURE__ */ new Set());
  }
  subscribe(e) {
    this.callbacks.add(e);
  }
  unsubscribe(e) {
    this.callbacks.delete(e);
  }
  emit(e) {
    this.callbacks.forEach((t) => {
      t(e);
    });
  }
}
const P = () => {
  const r = new _();
  return [r, r];
};
class Se {
  constructor(e, t, o, s) {
    i(this, "beforeDestroyEmitter");
    i(this, "destroyed", !1);
    i(this, "onBeforeDestroy");
    this.graph = e, this.viewport = t, this.graphController = o, this.viewportController = s, [this.beforeDestroyEmitter, this.onBeforeDestroy] = P();
  }
  addNode(e) {
    return this.graphController.addNode(e), this;
  }
  updateNode(e, t) {
    return this.graphController.updateNode(e, t), this;
  }
  removeNode(e) {
    return this.graphController.removeNode(e), this;
  }
  markPort(e) {
    return this.graphController.markPort(e), this;
  }
  updatePort(e, t) {
    return this.graphController.updatePort(e, t), this;
  }
  unmarkPort(e) {
    return this.graphController.unmarkPort(e), this;
  }
  addEdge(e) {
    return this.graphController.addEdge(e), this;
  }
  updateEdge(e, t) {
    return this.graphController.updateEdge(e, t), this;
  }
  removeEdge(e) {
    return this.graphController.removeEdge(e), this;
  }
  clear() {
    return this.graphController.clear(), this;
  }
  focus(e) {
    return this.viewportController.focus(e), this;
  }
  center(e, t) {
    return this.viewportController.center(e, t), this;
  }
  patchViewportMatrix(e) {
    return this.viewportController.patchViewportMatrix(e), this;
  }
  patchContentMatrix(e) {
    return this.viewportController.patchContentMatrix(e), this;
  }
  destroy() {
    this.destroyed || (this.destroyed = !0, this.beforeDestroyEmitter.emit(), this.graphController.destroy(), this.viewportController.destroy());
  }
}
class ot {
  constructor() {
    i(this, "singleToMultiMap", /* @__PURE__ */ new Map());
    i(this, "multiToSingleMap", /* @__PURE__ */ new Map());
  }
  addRecord(e, t) {
    const o = this.singleToMultiMap.get(e);
    o === void 0 ? this.singleToMultiMap.set(e, /* @__PURE__ */ new Set([t])) : o.add(t), this.multiToSingleMap.set(t, e);
  }
  getMultiBySingle(e) {
    const t = this.singleToMultiMap.get(e) ?? /* @__PURE__ */ new Set();
    return Array.from(t.values());
  }
  removeByMulti(e) {
    const t = this.multiToSingleMap.get(e), o = this.singleToMultiMap.get(t);
    o.delete(e), o.size === 0 && this.singleToMultiMap.delete(t), this.multiToSingleMap.delete(e);
  }
  getByMulti(e) {
    return this.multiToSingleMap.get(e);
  }
  removeBySingle(e) {
    this.singleToMultiMap.get(e).forEach((o) => {
      this.multiToSingleMap.delete(o);
    }), this.singleToMultiMap.delete(e);
  }
  clear() {
    this.singleToMultiMap.clear(), this.multiToSingleMap.clear();
  }
  forEachSingle(e) {
    this.singleToMultiMap.forEach((t, o) => {
      e(o);
    });
  }
  hasSingle(e) {
    return this.singleToMultiMap.get(e) !== void 0;
  }
  hasMulti(e) {
    return this.multiToSingleMap.get(e) !== void 0;
  }
}
class S extends Error {
  constructor() {
    super(...arguments);
    i(this, "name", "CanvasError");
  }
}
const b = Object.freeze({
  accessNonexistingNode: (r) => `Failed to access node with ID ${JSON.stringify(r)} because it does not exist`,
  addNodeWithExistingId: (r) => `Failed to add node with ID ${JSON.stringify(r)} because a node with this ID already exists`,
  addNodeWithElementInUse: (r, e) => `Failed to add node with ID ${JSON.stringify(r)} because its HTML element is already attached to node with ID ${JSON.stringify(e)}`,
  updateNonexistentNode: (r) => `Failed to update node with ID ${JSON.stringify(r)} because it does not exist`,
  removeNonexistentNode: (r) => `Failed to remove node with ID ${JSON.stringify(r)} because it does not exist`,
  accessNonexistentPort: (r) => `Failed to access port with ID ${JSON.stringify(r)} because it does not exist`,
  addPortWithExistingId: (r) => `Failed to add port with ID ${JSON.stringify(r)} because a port with this ID already exists`,
  addPortToNonexistentNode: (r, e) => `Failed to add port with ID ${JSON.stringify(r)} to node with ID ${JSON.stringify(e)} because the node does not exist`,
  updateNonexistentPort: (r) => `Failed to update port with ID ${JSON.stringify(r)} because it does not exist`,
  accessPortsOfNonexistentNode: (r) => `Failed to access ports of node with ID ${JSON.stringify(r)} because the node does not exist`,
  removeNonexistentPort: (r) => `Failed to remove port with ID ${JSON.stringify(r)} because it does not exist`,
  accessNonexistentEdge: (r) => `Failed to access edge with ID ${JSON.stringify(r)} because it does not exist`,
  addEdgeWithExistingId: (r) => `Failed to add edge with ID ${JSON.stringify(r)} because an edge with this ID already exists`,
  addEdgeFromNonexistentPort: (r, e) => `Failed to add edge with ID ${JSON.stringify(r)} from port with ID ${JSON.stringify(e)} because the port does not exist`,
  addEdgeToNonexistentPort: (r, e) => `Failed to add edge with ID ${JSON.stringify(r)} to port with ID ${JSON.stringify(e)} because the port does not exist`,
  updateNonexistentEdge: (r) => `Failed to update edge with ID ${JSON.stringify(r)} because it does not exist`,
  updateNonexistentEdgeSource: (r, e) => `Failed to update source of edge with ID ${JSON.stringify(r)} because source port with ID ${JSON.stringify(e)} does not exist`,
  updateNonexistentEdgeTarget: (r, e) => `Failed to update target of edge with ID ${JSON.stringify(r)} because target port with ID ${JSON.stringify(e)} does not exist`,
  removeNonexistentEdge: (r) => `Failed to remove edge with ID ${JSON.stringify(r)} because it does not exist`,
  accessEdgesForNonexistentPort: (r) => `Failed to access edges for port with ID ${JSON.stringify(r)} because the port does not exist`
});
class be {
  constructor() {
    i(this, "nodes", /* @__PURE__ */ new Map());
    i(this, "ports", /* @__PURE__ */ new Map());
    i(this, "edges", /* @__PURE__ */ new Map());
    i(this, "nodesElementsMap", /* @__PURE__ */ new Map());
    i(this, "portIncomingEdges", /* @__PURE__ */ new Map());
    i(this, "portOutgoingEdges", /* @__PURE__ */ new Map());
    i(this, "portCycleEdges", /* @__PURE__ */ new Map());
    i(this, "elementPorts", new ot());
    i(this, "afterNodeAddedEmitter");
    i(this, "onAfterNodeAdded");
    i(this, "afterNodeUpdatedEmitter");
    i(this, "onAfterNodeUpdated");
    i(this, "afterNodePriorityUpdatedEmitter");
    i(this, "onAfterNodePriorityUpdated");
    i(this, "beforeNodeRemovedEmitter");
    i(this, "onBeforeNodeRemoved");
    i(this, "afterPortAddedEmitter");
    i(this, "onAfterPortAdded");
    i(this, "afterPortUpdatedEmitter");
    i(this, "onAfterPortUpdated");
    i(this, "beforePortRemovedEmitter");
    i(this, "onBeforePortRemoved");
    i(this, "afterEdgeAddedEmitter");
    i(this, "onAfterEdgeAdded");
    i(this, "afterEdgeShapeUpdatedEmitter");
    i(this, "onAfterEdgeShapeUpdated");
    i(this, "afterEdgeUpdatedEmitter");
    i(this, "onAfterEdgeUpdated");
    i(this, "afterEdgePriorityUpdatedEmitter");
    i(this, "onAfterEdgePriorityUpdated");
    i(this, "beforeEdgeRemovedEmitter");
    i(this, "onBeforeEdgeRemoved");
    i(this, "beforeClearEmitter");
    i(this, "onBeforeClear");
    [this.afterNodeAddedEmitter, this.onAfterNodeAdded] = P(), [this.afterNodeUpdatedEmitter, this.onAfterNodeUpdated] = P(), [this.afterNodePriorityUpdatedEmitter, this.onAfterNodePriorityUpdated] = P(), [this.beforeNodeRemovedEmitter, this.onBeforeNodeRemoved] = P(), [this.afterPortAddedEmitter, this.onAfterPortAdded] = P(), [this.afterPortUpdatedEmitter, this.onAfterPortUpdated] = P(), [this.beforePortRemovedEmitter, this.onBeforePortRemoved] = P(), [this.afterEdgeAddedEmitter, this.onAfterEdgeAdded] = P(), [this.afterEdgeShapeUpdatedEmitter, this.onAfterEdgeShapeUpdated] = P(), [this.afterEdgeUpdatedEmitter, this.onAfterEdgeUpdated] = P(), [this.afterEdgePriorityUpdatedEmitter, this.onAfterEdgePriorityUpdated] = P(), [this.beforeEdgeRemovedEmitter, this.onBeforeEdgeRemoved] = P(), [this.beforeClearEmitter, this.onBeforeClear] = P();
  }
  hasNode(e) {
    return this.nodes.has(e);
  }
  getNode(e) {
    const t = this.nodes.get(e);
    if (t === void 0)
      throw new S(b.accessNonexistingNode(e));
    return t;
  }
  addNode(e) {
    if (this.hasNode(e.id))
      throw new S(b.addNodeWithExistingId(e.id));
    const t = this.findNodeIdByElement(e.element);
    if (t !== void 0)
      throw new S(
        b.addNodeWithElementInUse(e.id, t)
      );
    const o = /* @__PURE__ */ new Map(), s = {
      element: e.element,
      payload: {
        x: e.x,
        y: e.y,
        centerFn: e.centerFn,
        priority: e.priority
      },
      ports: o
    };
    this.nodes.set(e.id, s), this.nodesElementsMap.set(e.element, e.id), this.afterNodeAddedEmitter.emit(e.id);
  }
  getAllNodeIds() {
    return Array.from(this.nodes.keys());
  }
  findNodeIdByElement(e) {
    return this.nodesElementsMap.get(e);
  }
  updateNode(e, t) {
    if (!this.hasNode(e))
      throw new S(b.updateNonexistentNode(e));
    const { payload: o } = this.nodes.get(e);
    o.x = t.x ?? o.x, o.y = t.y ?? o.y, o.centerFn = t.centerFn ?? o.centerFn, t.priority !== void 0 && (o.priority = t.priority, this.afterNodePriorityUpdatedEmitter.emit(e)), this.afterNodeUpdatedEmitter.emit(e);
  }
  removeNode(e) {
    if (!this.hasNode(e))
      throw new S(b.removeNonexistentNode(e));
    this.beforeNodeRemovedEmitter.emit(e);
    const t = this.getNode(e);
    this.nodesElementsMap.delete(t.element), this.nodes.delete(e);
  }
  hasPort(e) {
    return this.ports.has(e);
  }
  getPort(e) {
    const t = this.ports.get(e);
    if (t === void 0)
      throw new S(b.accessNonexistentPort(e));
    return t;
  }
  addPort(e) {
    if (this.hasPort(e.id))
      throw new S(b.addPortWithExistingId(e.id));
    if (!this.hasNode(e.nodeId))
      throw new S(
        b.addPortToNonexistentNode(e.id, e.nodeId)
      );
    this.ports.set(e.id, {
      element: e.element,
      payload: {
        direction: e.direction
      },
      nodeId: e.nodeId
    }), this.elementPorts.addRecord(e.element, e.id), this.portCycleEdges.set(e.id, /* @__PURE__ */ new Set()), this.portIncomingEdges.set(e.id, /* @__PURE__ */ new Set()), this.portOutgoingEdges.set(e.id, /* @__PURE__ */ new Set()), this.getNode(e.nodeId).ports.set(e.id, e.element), this.afterPortAddedEmitter.emit(e.id);
  }
  updatePort(e, t) {
    if (!this.hasPort(e))
      throw new S(b.updateNonexistentPort(e));
    const o = this.getPort(e).payload;
    o.direction = t.direction ?? o.direction, this.afterPortUpdatedEmitter.emit(e);
  }
  getAllPortIds() {
    return Array.from(this.ports.keys());
  }
  findPortIdsByElement(e) {
    return this.elementPorts.getMultiBySingle(e);
  }
  getNodePortIds(e) {
    const t = this.nodes.get(e);
    if (t === void 0)
      throw new S(
        b.accessPortsOfNonexistentNode(e)
      );
    return Array.from(t.ports.keys());
  }
  removePort(e) {
    if (!this.hasPort(e))
      throw new S(b.removeNonexistentPort(e));
    const t = this.getPort(e).nodeId;
    this.beforePortRemovedEmitter.emit(e), this.getNode(t).ports.delete(e), this.ports.delete(e), this.elementPorts.removeByMulti(e);
  }
  hasEdge(e) {
    return this.edges.has(e);
  }
  getEdge(e) {
    const t = this.edges.get(e);
    if (t === void 0)
      throw new S(b.accessNonexistentEdge(e));
    return t;
  }
  addEdge(e) {
    if (this.hasEdge(e.id))
      throw new S(b.addEdgeWithExistingId(e.id));
    if (!this.hasPort(e.from))
      throw new S(
        b.addEdgeFromNonexistentPort(e.id, e.from)
      );
    if (!this.hasPort(e.to))
      throw new S(
        b.addEdgeToNonexistentPort(e.id, e.to)
      );
    this.addEdgeInternal(e), this.afterEdgeAddedEmitter.emit(e.id);
  }
  updateEdge(e, t) {
    if (!this.hasEdge(e))
      throw new S(b.updateNonexistentEdge(e));
    if (t.from !== void 0 || t.to !== void 0) {
      if (t.from !== void 0 && !this.hasPort(t.from))
        throw new S(
          b.updateNonexistentEdgeSource(e, t.from)
        );
      if (t.to !== void 0 && !this.hasPort(t.to))
        throw new S(
          b.updateNonexistentEdgeTarget(e, t.to)
        );
      const s = this.getEdge(e), n = s.payload;
      this.removeEdgeInternal(e), this.addEdgeInternal({
        id: e,
        from: t.from ?? s.from,
        to: t.to ?? s.to,
        shape: n.shape,
        priority: n.priority
      });
    }
    const o = this.edges.get(e);
    t.shape !== void 0 && (o.payload.shape = t.shape, this.afterEdgeShapeUpdatedEmitter.emit(e)), t.priority !== void 0 && (o.payload.priority = t.priority, this.afterEdgePriorityUpdatedEmitter.emit(e)), this.afterEdgeUpdatedEmitter.emit(e);
  }
  getAllEdgeIds() {
    return Array.from(this.edges.keys());
  }
  removeEdge(e) {
    if (!this.hasEdge(e))
      throw new S(b.removeNonexistentEdge(e));
    this.beforeEdgeRemovedEmitter.emit(e), this.removeEdgeInternal(e);
  }
  clear() {
    this.beforeClearEmitter.emit(), this.portIncomingEdges.clear(), this.portOutgoingEdges.clear(), this.portCycleEdges.clear(), this.elementPorts.clear(), this.nodesElementsMap.clear(), this.edges.clear(), this.ports.clear(), this.nodes.clear();
  }
  getPortIncomingEdgeIds(e) {
    const t = this.portIncomingEdges.get(e);
    if (t === void 0)
      throw new S(
        b.accessEdgesForNonexistentPort(e)
      );
    return Array.from(t);
  }
  getPortOutgoingEdgeIds(e) {
    const t = this.portOutgoingEdges.get(e);
    if (t === void 0)
      throw new S(
        b.accessEdgesForNonexistentPort(e)
      );
    return Array.from(t);
  }
  getPortCycleEdgeIds(e) {
    const t = this.portCycleEdges.get(e);
    if (t === void 0)
      throw new S(
        b.accessEdgesForNonexistentPort(e)
      );
    return Array.from(t);
  }
  getPortAdjacentEdgeIds(e) {
    return [
      ...this.getPortIncomingEdgeIds(e),
      ...this.getPortOutgoingEdgeIds(e),
      ...this.getPortCycleEdgeIds(e)
    ];
  }
  getNodeIncomingEdgeIds(e) {
    const t = Array.from(this.getNode(e).ports.keys()), o = [];
    return t.forEach((s) => {
      this.getPortIncomingEdgeIds(s).filter((n) => {
        const a = this.getEdge(n);
        return this.getPort(a.from).nodeId !== e;
      }).forEach((n) => {
        o.push(n);
      });
    }), o;
  }
  getNodeOutgoingEdgeIds(e) {
    const t = Array.from(this.getNode(e).ports.keys()), o = [];
    return t.forEach((s) => {
      this.getPortOutgoingEdgeIds(s).filter((n) => {
        const a = this.getEdge(n);
        return this.getPort(a.to).nodeId !== e;
      }).forEach((n) => {
        o.push(n);
      });
    }), o;
  }
  getNodeCycleEdgeIds(e) {
    const t = Array.from(this.getNode(e).ports.keys()), o = [];
    return t.forEach((s) => {
      this.getPortCycleEdgeIds(s).forEach((n) => {
        o.push(n);
      }), this.getPortIncomingEdgeIds(s).filter((n) => {
        const a = this.getEdge(n);
        return this.getPort(a.to).nodeId === e;
      }).forEach((n) => {
        o.push(n);
      });
    }), o;
  }
  getNodeAdjacentEdgeIds(e) {
    const t = Array.from(this.getNode(e).ports.keys()), o = [];
    return t.forEach((s) => {
      this.getPortIncomingEdgeIds(s).forEach((n) => {
        o.push(n);
      }), this.getPortOutgoingEdgeIds(s).forEach((n) => {
        o.push(n);
      }), this.getPortCycleEdgeIds(s).forEach((n) => {
        o.push(n);
      });
    }), o;
  }
  addEdgeInternal(e) {
    this.edges.set(e.id, {
      from: e.from,
      to: e.to,
      payload: {
        shape: e.shape,
        priority: e.priority
      }
    }), e.from !== e.to ? (this.portOutgoingEdges.get(e.from).add(e.id), this.portIncomingEdges.get(e.to).add(e.id)) : this.portCycleEdges.get(e.from).add(e.id);
  }
  removeEdgeInternal(e) {
    const { from: t, to: o } = this.getEdge(e);
    this.portCycleEdges.get(t).delete(e), this.portCycleEdges.get(o).delete(e), this.portIncomingEdges.get(t).delete(e), this.portIncomingEdges.get(o).delete(e), this.portOutgoingEdges.get(t).delete(e), this.portOutgoingEdges.get(o).delete(e), this.edges.delete(e);
  }
}
const ue = (r) => ({
  scale: 1 / r.scale,
  x: -r.x / r.scale,
  y: -r.y / r.scale
}), pe = {
  scale: 1,
  x: 0,
  y: 0
}, ye = (r, e) => ({
  x: r.scale * e.x + r.x,
  y: r.scale * e.y + r.y
});
class st {
  constructor(e) {
    i(this, "viewportMatrix", pe);
    i(this, "contentMatrix", pe);
    i(this, "beforeUpdateEmitter");
    i(this, "onBeforeUpdated");
    i(this, "afterUpdateEmitter");
    i(this, "onAfterUpdated");
    i(this, "afterResizeEmitter");
    i(this, "onAfterResize");
    i(this, "observer", new ResizeObserver(() => {
      this.afterResizeEmitter.emit();
    }));
    this.host = e, [this.afterUpdateEmitter, this.onAfterUpdated] = P(), [this.beforeUpdateEmitter, this.onBeforeUpdated] = P(), [this.afterResizeEmitter, this.onAfterResize] = P(), this.observer.observe(this.host);
  }
  getViewportMatrix() {
    return this.viewportMatrix;
  }
  getContentMatrix() {
    return this.contentMatrix;
  }
  patchViewportMatrix(e) {
    this.viewportMatrix = {
      scale: e.scale ?? this.viewportMatrix.scale,
      x: e.x ?? this.viewportMatrix.x,
      y: e.y ?? this.viewportMatrix.y
    }, this.beforeUpdateEmitter.emit(), this.contentMatrix = ue(this.viewportMatrix), this.afterUpdateEmitter.emit();
  }
  patchContentMatrix(e) {
    this.contentMatrix = {
      scale: e.scale ?? this.contentMatrix.scale,
      x: e.x ?? this.contentMatrix.x,
      y: e.y ?? this.contentMatrix.y
    }, this.beforeUpdateEmitter.emit(), this.viewportMatrix = ue(this.contentMatrix), this.afterUpdateEmitter.emit();
  }
  getDimensions() {
    const { width: e, height: t } = this.host.getBoundingClientRect();
    return { width: e, height: t };
  }
  createContentCoords(e) {
    return ye(this.viewportMatrix, e);
  }
  createViewportCoords(e) {
    return ye(this.contentMatrix, e);
  }
  destroy() {
    this.observer.disconnect();
  }
}
class q {
  constructor(e) {
    i(this, "elementToNodeId", /* @__PURE__ */ new Map());
    i(this, "nodesResizeObserver");
    i(this, "onAfterNodeAdded", (e) => {
      const t = this.canvas.graph.getNode(e);
      this.elementToNodeId.set(t.element, e), this.nodesResizeObserver.observe(t.element);
    });
    i(this, "onBeforeNodeRemoved", (e) => {
      const t = this.canvas.graph.getNode(e);
      this.elementToNodeId.delete(t.element), this.nodesResizeObserver.unobserve(t.element);
    });
    i(this, "reset", () => {
      this.nodesResizeObserver.disconnect(), this.elementToNodeId.clear();
    });
    i(this, "revert", () => {
      this.reset();
    });
    this.canvas = e, this.nodesResizeObserver = new ResizeObserver((t) => {
      t.forEach((o) => {
        const s = o.target;
        this.handleNodeResize(s);
      });
    }), this.canvas.graph.onAfterNodeAdded.subscribe(this.onAfterNodeAdded), this.canvas.graph.onBeforeNodeRemoved.subscribe(this.onBeforeNodeRemoved), this.canvas.graph.onBeforeClear.subscribe(this.reset), this.canvas.onBeforeDestroy.subscribe(this.revert);
  }
  static configure(e) {
    new q(e);
  }
  handleNodeResize(e) {
    const t = this.elementToNodeId.get(e);
    this.canvas.updateNode(t);
  }
}
const it = (r, e, t) => {
  const { x: o, y: s, width: n, height: a } = r.getBoundingClientRect();
  return e >= o && e <= o + n && t >= s && t <= s + a;
}, nt = (r, e, t) => e >= 0 && e <= r.innerWidth && t >= 0 && t <= r.innerHeight, F = (r, e, t, o) => it(e, t, o) && nt(r, t, o), k = (r, e) => {
  e !== null ? r.style.cursor = e : r.style.removeProperty("cursor");
}, H = (r) => {
  const e = document.createElement("div");
  return {
    id: r.overlayNodeId,
    element: e,
    x: r.portCoords.x,
    y: r.portCoords.y,
    ports: [
      {
        id: r.overlayNodeId,
        element: e,
        direction: r.portDirection
      }
    ]
  };
}, at = (r, e) => {
  let t = e;
  for (; t !== null; ) {
    const o = r.findPortIdsByElement(t)[0] ?? null;
    if (o !== null)
      return {
        status: "portFound",
        portId: o
      };
    if (r.findNodeIdByElement(t) !== void 0)
      return {
        status: "nodeEncountered"
      };
    t = t.parentElement;
  }
  return {
    status: "notFound"
  };
};
function* Ne(r, e) {
  const t = r.elementsFromPoint(e.x, e.y);
  for (const o of t) {
    if (o.shadowRoot !== null) {
      const s = Ne(o.shadowRoot, e);
      for (const n of s)
        yield n;
    }
    yield o;
  }
}
const Pe = (r, e) => {
  const t = Ne(document, e);
  for (const o of t) {
    const s = at(r, o);
    if (s.status === "portFound")
      return s.portId;
    if (s.status === "nodeEncountered")
      return null;
  }
  return null;
};
var M = /* @__PURE__ */ ((r) => (r.StaticNodeId = "static", r.DraggingNodeId = "dragging", r.EdgeId = "edge", r))(M || {});
const Ce = (r, e) => ({
  x: r / 2,
  y: e / 2
}), x = (r, e, t) => ({
  x: e.x * r.x - e.y * r.y + ((1 - e.x) * t.x + e.y * t.y),
  y: e.y * r.x + e.x * r.y + ((1 - e.x) * t.y - e.y * t.x)
}), Te = (r, e, t) => {
  const o = {
    x: r.x + r.width / 2,
    y: r.y + r.height / 2
  }, s = {
    x: e.x + e.width / 2,
    y: e.y + e.height / 2
  }, n = Math.min(o.x, s.x) - t, a = Math.min(o.y, s.y) - t, h = 2 * t, d = Math.abs(s.x - o.x) + h, c = Math.abs(s.y - o.y) + h;
  return {
    x: n,
    y: a,
    width: d,
    height: c,
    from: { x: o.x - n, y: o.y - a },
    to: { x: s.x - n, y: s.y - a }
  };
};
class ht {
  constructor(e) {
    i(this, "path");
    i(this, "midpoint");
    const {
      from: t,
      to: o,
      arrowLength: s,
      fromDir: n,
      toDir: a,
      curvature: h,
      hasSourceArrow: d,
      hasTargetArrow: c
    } = e, g = (t.x + o.x) / 2, u = (t.y + o.y) / 2;
    this.midpoint = { x: g, y: u };
    const l = x(
      { x: t.x + s, y: t.y },
      n,
      t
    ), p = x(
      { x: o.x - s, y: o.y },
      a,
      o
    ), y = {
      x: l.x + n.x * h,
      y: l.y + n.y * h
    }, w = {
      x: p.x - a.x * h,
      y: p.y - a.y * h
    }, f = `M ${l.x} ${l.y} C ${y.x} ${y.y}, ${w.x} ${w.y}, ${p.x} ${p.y}`, m = d ? "" : `M ${t.x} ${t.y} L ${l.x} ${l.y} `, A = c ? "" : ` M ${p.x} ${p.y} L ${o.x} ${o.y}`;
    this.path = `${m}${f}${A}`;
  }
}
class dt {
  constructor(e) {
    i(this, "path");
    i(this, "midpoint");
    const {
      hasSourceArrow: t,
      hasTargetArrow: o,
      curvature: s,
      fromDir: n,
      toDir: a,
      detourDir: h,
      from: d,
      to: c,
      arrowLength: g,
      detourDistance: u
    } = e, l = t ? x(
      { x: d.x + g, y: d.y },
      n,
      d
    ) : d, p = o ? x(
      {
        x: c.x - g,
        y: c.y
      },
      a,
      c
    ) : c, y = Math.cos(h) * u, w = Math.sin(h) * u, f = x(
      { x: d.x + g, y: d.y },
      n,
      d
    ), m = {
      x: f.x + y,
      y: f.y + w
    }, A = x(
      { x: c.x - g, y: c.y },
      a,
      c
    ), N = {
      x: A.x + y,
      y: A.y + w
    }, C = {
      x: (m.x + N.x) / 2,
      y: (m.y + N.y) / 2
    }, T = {
      x: f.x + s * n.x,
      y: f.y + s * n.y
    }, I = {
      x: A.x - s * a.x,
      y: A.y - s * a.y
    }, V = {
      x: f.x + y,
      y: f.y + w
    }, $ = {
      x: A.x + y,
      y: A.y + w
    };
    this.path = [
      `M ${l.x} ${l.y}`,
      `L ${f.x} ${f.y}`,
      `C ${T.x} ${T.y} ${V.x} ${V.y} ${C.x} ${C.y}`,
      `C ${$.x} ${$.y} ${I.x} ${I.y} ${A.x} ${A.y}`,
      `L ${p.x} ${p.y}`
    ].join(" "), this.midpoint = C;
  }
}
const ee = Object.freeze({
  edgeColor: "--edge-color"
}), Me = (r) => {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  return e.style.pointerEvents = "none", e.style.position = "absolute", e.style.top = "0", e.style.left = "0", e.style.overflow = "visible", e.style.setProperty(ee.edgeColor, r), e;
}, De = (r) => {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("stroke", `var(${ee.edgeColor})`), e.setAttribute("stroke-width", `${r}`), e.setAttribute("fill", "none"), e;
}, Y = () => {
  const r = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return r.setAttribute("fill", `var(${ee.edgeColor})`), r;
}, Re = (r, e) => {
  r.style.transform = `translate(${e.x}px, ${e.y}px)`, r.style.width = `${e.width}px`, r.style.height = `${e.height}px`;
}, R = (r, e) => {
  const t = [];
  if (r.length > 0 && t.push(`M ${r[0].x} ${r[0].y}`), r.length === 2 && t.push(`L ${r[1].x} ${r[1].y}`), r.length > 2) {
    const o = r.length - 1;
    let s = 0, n = 0, a = 0;
    r.forEach((h, d) => {
      let c = 0, g = 0, u = 0;
      const l = d > 0, p = d < o, y = l && p;
      if (l && (c = -s, g = -n, u = a), p) {
        const T = r[d + 1];
        s = T.x - h.x, n = T.y - h.y, a = Math.sqrt(s * s + n * n);
      }
      const f = a !== 0 ? Math.min((y ? e : 0) / a, d < o - 1 ? 0.5 : 1) : 0, m = y ? { x: h.x + s * f, y: h.y + n * f } : h, N = u !== 0 ? Math.min((y ? e : 0) / u, d > 1 ? 0.5 : 1) : 0, C = y ? { x: h.x + c * N, y: h.y + g * N } : h;
      d > 0 && t.push(`L ${C.x} ${C.y}`), y && t.push(
        `C ${h.x} ${h.y} ${h.x} ${h.y} ${m.x} ${m.y}`
      );
    });
  }
  return t.join(" ");
}, ct = (r, e) => {
  const t = e.x - r.x >= 0, o = r.dirX >= 0, s = e.dirX >= 0;
  if (o === s) {
    const c = o === t, g = (r.x + e.x) / 2, u = (r.y + e.y) / 2, l = { x: g, y: u };
    return c ? {
      points: [
        { x: r.x, y: r.y },
        { x: l.x, y: r.y },
        { x: l.x, y: e.y },
        { x: e.x, y: e.y }
      ],
      midpoint: l
    } : {
      points: [
        { x: r.x, y: r.y },
        { x: r.x, y: l.y },
        { x: e.x, y: l.y },
        { x: e.x, y: e.y }
      ],
      midpoint: l
    };
  }
  const a = o === t, h = (r.y + e.y) / 2;
  if (a) {
    const c = { x: e.x, y: r.y };
    return {
      points: [{ x: r.x, y: r.y }, c, { x: e.x, y: e.y }],
      midpoint: { x: c.x, y: h }
    };
  }
  const d = { x: r.x, y: e.y };
  return {
    points: [{ x: r.x, y: r.y }, d, { x: e.x, y: e.y }],
    midpoint: { x: d.x, y: h }
  };
};
class lt {
  constructor(e) {
    i(this, "path");
    i(this, "midpoint");
    const {
      from: t,
      to: o,
      fromDir: s,
      toDir: n,
      arrowLength: a,
      arrowOffset: h,
      roundness: d,
      hasSourceArrow: c,
      hasTargetArrow: g
    } = e, u = c ? x(
      { x: t.x + a, y: t.y },
      s,
      t
    ) : t, l = g ? x(
      {
        x: o.x - a,
        y: o.y
      },
      n,
      o
    ) : o, p = a + h, y = x(
      { x: t.x + p, y: t.y },
      s,
      t
    ), w = x({ x: o.x - p, y: o.y }, n, o), f = ct(
      {
        x: y.x,
        y: y.y,
        dirX: s.x
      },
      {
        x: w.x,
        y: w.y,
        dirX: n.x
      }
    );
    this.path = R(
      [u, ...f.points, l],
      d
    ), this.midpoint = f.midpoint;
  }
}
class gt {
  constructor(e) {
    i(this, "path");
    i(this, "midpoint");
    const {
      hasSourceArrow: t,
      hasTargetArrow: o,
      from: s,
      to: n,
      arrowLength: a,
      fromDir: h,
      toDir: d,
      arrowOffset: c,
      detourDir: g,
      detourDistance: u,
      roundness: l
    } = e, p = t ? x(
      { x: s.x + a, y: s.y },
      h,
      s
    ) : s, y = o ? x(
      {
        x: n.x - a,
        y: n.y
      },
      d,
      n
    ) : n, w = a + c, f = Math.cos(g) * u, m = Math.sin(g) * u, A = x(
      { x: s.x + w, y: s.y },
      h,
      s
    ), N = {
      x: A.x + f,
      y: A.y + m
    }, C = x(
      { x: n.x - w, y: n.y },
      d,
      n
    ), T = {
      x: C.x + f,
      y: C.y + m
    };
    this.midpoint = {
      x: (N.x + T.x) / 2,
      y: (N.y + T.y) / 2
    }, this.path = R(
      [p, A, N, T, C, y],
      l
    );
  }
}
class ut {
  constructor(e) {
    i(this, "path");
    i(this, "midpoint");
    const {
      from: t,
      to: o,
      hasSourceArrow: s,
      hasTargetArrow: n,
      arrowLength: a,
      fromDir: h,
      toDir: d,
      arrowOffset: c,
      roundness: g
    } = e, u = this.createArrowPoint(
      s,
      h,
      t,
      a
    ), l = this.createArrowPoint(
      n,
      d,
      o,
      -a
    ), p = a + c, y = { x: t.x + p, y: t.y }, w = x(y, h, t), f = { x: o.x - p, y: o.y }, m = x(f, d, o);
    this.path = R(
      [u, w, m, l],
      g
    );
    const A = (w.x + m.x) / 2, N = (w.y + m.y) / 2;
    this.midpoint = { x: A, y: N };
  }
  createArrowPoint(e, t, o, s) {
    if (!e)
      return o;
    const n = {
      x: o.x + s,
      y: o.y
    };
    return x(n, t, o);
  }
}
const pt = (r, e) => {
  const t = e.y - r.y >= 0, o = r.dirY >= 0, s = e.dirY >= 0;
  if (o === s) {
    const c = o === t, g = (r.x + e.x) / 2, u = (r.y + e.y) / 2, l = { x: g, y: u };
    return c ? {
      points: [
        { x: r.x, y: r.y },
        { x: r.x, y: l.y },
        { x: e.x, y: l.y },
        { x: e.x, y: e.y }
      ],
      midpoint: l
    } : {
      points: [
        { x: r.x, y: r.y },
        { x: l.x, y: r.y },
        { x: l.x, y: e.y },
        { x: e.x, y: e.y }
      ],
      midpoint: l
    };
  }
  const a = o === t, h = (r.x + e.x) / 2;
  if (a) {
    const c = { x: r.x, y: e.y };
    return {
      points: [{ x: r.x, y: r.y }, c, { x: e.x, y: e.y }],
      midpoint: { x: h, y: c.y }
    };
  }
  const d = { x: e.x, y: r.y };
  return {
    points: [{ x: r.x, y: r.y }, d, { x: e.x, y: e.y }],
    midpoint: { x: h, y: d.y }
  };
};
class yt {
  constructor(e) {
    i(this, "path");
    i(this, "midpoint");
    const {
      from: t,
      to: o,
      hasSourceArrow: s,
      hasTargetArrow: n,
      arrowLength: a,
      arrowOffset: h,
      fromDir: d,
      toDir: c,
      roundness: g
    } = e, u = s ? x(
      { x: t.x + a, y: t.y },
      d,
      t
    ) : t, l = n ? x(
      {
        x: o.x - a,
        y: o.y
      },
      c,
      o
    ) : o, p = a + h, y = x(
      { x: t.x + p, y: t.y },
      d,
      t
    ), w = x({ x: o.x - p, y: o.y }, c, o), f = pt(
      {
        x: y.x,
        y: y.y,
        dirY: d.y
      },
      {
        x: w.x,
        y: w.y,
        dirY: c.y
      }
    );
    this.path = R(
      [u, ...f.points, l],
      g
    ), this.midpoint = f.midpoint;
  }
}
class te {
  constructor(e) {
    i(this, "path");
    i(this, "midpoint");
    const { side: t, arrowLength: o, arrowOffset: s, dir: n, origin: a, hasArrow: h } = e, d = o + s, c = d + 2 * t, u = [
      { x: o, y: 0 },
      { x: d, y: 0 },
      { x: d, y: t },
      { x: c, y: t },
      { x: c, y: -t },
      { x: d, y: -t },
      { x: d, y: 0 },
      { x: o, y: 0 }
    ].map((p) => x(p, n, { x: 0, y: 0 })).map((p) => ({ x: p.x + a.x, y: p.y + a.y })), l = `M ${a.x} ${a.y} L ${u[0].x} ${u[0].y} `;
    this.path = `${h ? "" : l}${R(u, e.roundness)}`, this.midpoint = { x: (u[3].x + u[4].x) / 2, y: (u[3].y + u[4].y) / 2 };
  }
}
class wt {
  constructor(e) {
    i(this, "path");
    i(this, "midpoint");
    const { arrowLength: t, radius: o, smallRadius: s, dir: n, origin: a, hasArrow: h } = e, d = s + o, c = s * o / d, g = Math.sqrt(d * d - s * s), u = g * s / d, l = g + o + t, p = t + u, w = [
      { x: t, y: 0 },
      { x: p, y: c },
      { x: p, y: -c },
      { x: l, y: 0 }
    ].map((A) => x(A, n, { x: 0, y: 0 })).map((A) => ({ x: A.x + a.x, y: A.y + a.y })), f = [
      `M ${w[0].x} ${w[0].y}`,
      `A ${s} ${s} 0 0 1 ${w[1].x} ${w[1].y}`,
      `A ${o} ${o} 0 1 0 ${w[2].x} ${w[2].y}`,
      `A ${s} ${s} 0 0 1 ${w[0].x} ${w[0].y}`
    ].join(" "), m = `M ${a.x} ${a.y} L ${w[0].x} ${w[0].y} `;
    this.path = `${h ? "" : m}${f}`, this.midpoint = w[3];
  }
}
class ft {
  constructor(e) {
    i(this, "path");
    i(this, "midpoint");
    i(this, "diagonalDistance");
    const {
      from: t,
      to: o,
      sourceOffset: s,
      targetOffset: n,
      hasSourceArrow: a,
      hasTargetArrow: h,
      arrowLength: d
    } = e;
    this.midpoint = { x: (t.x + o.x) / 2, y: (t.y + o.y) / 2 };
    const c = o.x - t.x, g = o.y - t.y;
    if (this.diagonalDistance = Math.sqrt(c * c + g * g), this.diagonalDistance === 0) {
      this.path = "";
      return;
    }
    const u = { x: c, y: g }, l = this.createDirectLinePoint({
      offset: s,
      hasArrow: a,
      flip: 1,
      shift: t,
      arrowLength: d,
      dir: u
    }), p = this.createDirectLinePoint({
      offset: n,
      hasArrow: h,
      flip: -1,
      shift: o,
      arrowLength: d,
      dir: u
    });
    this.path = `M ${l.x} ${l.y} L ${p.x} ${p.y}`;
  }
  createDirectLinePoint(e) {
    const t = e.hasArrow ? e.arrowLength : 0, o = e.offset + t, s = e.flip * o / this.diagonalDistance, { dir: n, shift: a } = e;
    return {
      x: n.x * s + a.x,
      y: n.y * s + a.y
    };
  }
}
const vt = (r, e, t) => {
  const o = Math.max(r.y, e.y), s = Math.min(r.y, e.y);
  return (t >= 0 ? o : s) + t;
};
class xt {
  constructor(e) {
    i(this, "path");
    i(this, "midpoint");
    const {
      hasSourceArrow: t,
      hasTargetArrow: o,
      arrowLength: s,
      from: n,
      to: a,
      fromDir: h,
      toDir: d,
      arrowOffset: c,
      roundness: g,
      detourDistance: u
    } = e, l = t ? x(
      { x: n.x + s, y: n.y },
      h,
      n
    ) : n, p = o ? x(
      {
        x: a.x - s,
        y: a.y
      },
      d,
      a
    ) : a, y = s + c, w = x(
      { x: n.x + y, y: n.y },
      h,
      n
    ), f = x(
      { x: a.x - y, y: a.y },
      d,
      a
    ), m = vt(w, f, u);
    this.midpoint = {
      x: (w.x + f.x) / 2,
      y: m
    }, this.path = R(
      [
        l,
        w,
        { x: w.x, y: m },
        { x: f.x, y: m },
        f,
        p
      ],
      g
    );
  }
}
const mt = (r, e, t) => {
  const o = Math.max(r.x, e.x), s = Math.min(r.x, e.x);
  return (t >= 0 ? o : s) + t;
};
class At {
  constructor(e) {
    i(this, "path");
    i(this, "midpoint");
    const {
      hasSourceArrow: t,
      hasTargetArrow: o,
      arrowLength: s,
      fromDir: n,
      toDir: a,
      from: h,
      to: d,
      arrowOffset: c,
      detourDistance: g,
      roundness: u
    } = e, l = t ? x(
      { x: h.x + s, y: h.y },
      n,
      h
    ) : h, p = o ? x(
      {
        x: d.x - s,
        y: d.y
      },
      a,
      d
    ) : d, y = s + c, w = x(
      { x: h.x + y, y: h.y },
      n,
      h
    ), f = x(
      { x: d.x - y, y: d.y },
      a,
      d
    ), m = mt(w, f, g);
    this.midpoint = {
      x: m,
      y: (w.y + f.y) / 2
    }, this.path = R(
      [
        l,
        w,
        { x: m, y: w.y },
        { x: m, y: f.y },
        f,
        p
      ],
      u
    );
  }
}
const v = Object.freeze({
  color: "#777777",
  width: 1,
  arrowLength: 20,
  polygonArrowRadius: 4,
  circleArrowRadius: 8,
  wedgeArrowSmallRadius: 20,
  wedgeArrowRadius: 100,
  wedgeArrowAngle: Math.PI / 12,
  arrowOffset: 15,
  hasSourceArrow: !1,
  hasTargetArrow: !1,
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
}), we = (r) => ({ x: Math.cos(r), y: Math.sin(r) });
class X {
  constructor(e) {
    i(this, "svg");
    i(this, "group", document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    ));
    i(this, "line");
    i(this, "sourceArrow", null);
    i(this, "targetArrow", null);
    i(this, "onAfterRender");
    i(this, "afterRenderEmitter");
    i(this, "arrowRenderer");
    this.params = e, [this.afterRenderEmitter, this.onAfterRender] = P(), this.arrowRenderer = this.params.arrowRenderer, this.svg = Me(e.color), this.svg.appendChild(this.group), this.line = De(e.width), this.group.appendChild(this.line), e.hasSourceArrow && (this.sourceArrow = Y(), this.group.appendChild(this.sourceArrow)), e.hasTargetArrow && (this.targetArrow = Y(), this.group.appendChild(this.targetArrow));
  }
  render(e) {
    const { x: t, y: o, width: s, height: n, from: a, to: h } = Te(
      e.from,
      e.to,
      this.params.padding
    );
    Re(this.svg, { x: t, y: o, width: s, height: n });
    const d = we(e.from.direction), c = we(e.to.direction);
    let g = { x: -c.x, y: -c.y }, u;
    e.category === L.PortCycle ? (u = this.params.createCyclePath, g = d) : e.category === L.NodeCycle ? u = this.params.createDetourPath : u = this.params.createLinePath;
    const l = u(a, h, d, c);
    this.line.setAttribute("d", l.path);
    let p = null;
    this.sourceArrow && (p = this.arrowRenderer({
      direction: d,
      shift: a,
      arrowLength: this.params.arrowLength
    }), this.sourceArrow.setAttribute("d", p));
    let y = null;
    this.targetArrow && (y = this.arrowRenderer({
      direction: g,
      shift: h,
      arrowLength: this.params.arrowLength
    }), this.targetArrow.setAttribute("d", y)), this.afterRenderEmitter.emit({
      edgePath: l,
      sourceArrowPath: p,
      targetArrowPath: y
    });
  }
}
const Et = (r) => (e) => {
  const o = [
    { x: 0, y: 0 },
    { x: e.arrowLength, y: r.radius },
    { x: e.arrowLength, y: -r.radius }
  ].map(
    (h) => x(h, e.direction, { x: 0, y: 0 })
  ).map((h) => ({
    x: h.x + e.shift.x,
    y: h.y + e.shift.y
  })), s = `M ${o[0].x} ${o[0].y}`, n = `L ${o[1].x} ${o[1].y}`, a = `L ${o[2].x} ${o[2].y}`;
  return `${s} ${n} ${a} Z`;
}, St = (r) => (e) => {
  const t = r.radius, o = e.arrowLength, s = (o * o + 2 * o * t) / (2 * t), n = s + t, a = o + t - t * (o + t) / n, h = t * s / n, c = [
    { x: 0, y: 0 },
    { x: a, y: -h },
    { x: a, y: h }
  ].map(
    (y) => x(y, e.direction, { x: 0, y: 0 })
  ).map((y) => ({
    x: y.x + e.shift.x,
    y: y.y + e.shift.y
  })), g = `M ${c[0].x} ${c[0].y}`, u = `A ${s} ${s} 0 0 0 ${c[1].x} ${c[1].y}`, l = `A ${t} ${t} 0 0 0 ${c[2].x} ${c[2].y}`, p = `A ${s} ${s} 0 0 0 ${c[0].x} ${c[0].y}`;
  return `${g} ${u} ${l} ${p}`;
}, bt = (r) => (e) => {
  const t = r.smallRadius, o = r.radius, s = x(
    {
      x: e.arrowLength,
      y: 0
    },
    {
      x: Math.cos(r.angle),
      y: Math.sin(r.angle)
    },
    {
      x: e.arrowLength + r.smallRadius,
      y: 0
    }
  ), a = [{ x: 0, y: 0 }, { x: s.x, y: -s.y }, s].map(
    (u) => x(u, e.direction, { x: 0, y: 0 })
  ).map((u) => ({
    x: u.x + e.shift.x,
    y: u.y + e.shift.y
  })), h = `M ${a[0].x} ${a[0].y}`, d = `A ${o} ${o} 0 0 1 ${a[1].x} ${a[1].y}`, c = `A ${t} ${t} 0 0 1 ${a[2].x} ${a[2].y}`, g = `A ${o} ${o} 0 0 1 ${a[0].x} ${a[0].y}`;
  return `${h} ${d} ${c} ${g}`;
}, U = (r) => {
  if (typeof r == "function")
    return r;
  switch (r.type) {
    case "triangle":
      return Et({
        radius: r.radius ?? v.polygonArrowRadius
      });
    case "arc":
      return St({
        radius: r.radius ?? v.circleArrowRadius
      });
    default:
      return bt({
        smallRadius: r.smallRadius ?? v.wedgeArrowSmallRadius,
        angle: r.angle ?? v.wedgeArrowAngle,
        radius: r.radius ?? v.wedgeArrowRadius
      });
  }
}, O = 50;
class Nt {
  constructor(e) {
    i(this, "svg");
    i(this, "group");
    i(this, "line");
    i(this, "sourceArrow");
    i(this, "targetArrow");
    i(this, "onAfterRender");
    i(this, "arrowLength");
    i(this, "curvature");
    i(this, "portCycleRadius");
    i(this, "portCycleSmallRadius");
    i(this, "detourDirection");
    i(this, "detourDistance");
    i(this, "hasSourceArrow");
    i(this, "hasTargetArrow");
    i(this, "pathShape");
    i(this, "createCyclePath", (e, t, o) => new wt({
      origin: e,
      dir: o,
      radius: this.portCycleRadius,
      smallRadius: this.portCycleSmallRadius,
      arrowLength: this.arrowLength,
      hasArrow: this.hasSourceArrow || this.hasTargetArrow
    }));
    i(this, "createDetourPath", (e, t, o, s) => new dt({
      from: e,
      to: t,
      fromDir: o,
      toDir: s,
      arrowLength: this.arrowLength,
      detourDir: this.detourDirection,
      detourDistance: this.detourDistance,
      curvature: this.curvature,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    i(this, "createLinePath", (e, t, o, s) => new ht({
      from: e,
      to: t,
      fromDir: o,
      toDir: s,
      arrowLength: this.arrowLength,
      curvature: this.curvature,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    this.arrowLength = (e == null ? void 0 : e.arrowLength) ?? v.arrowLength, this.curvature = (e == null ? void 0 : e.curvature) ?? v.curvature, this.portCycleRadius = (e == null ? void 0 : e.cycleRadius) ?? v.cycleRadius, this.portCycleSmallRadius = (e == null ? void 0 : e.smallCycleRadius) ?? v.smallCycleRadius, this.detourDirection = (e == null ? void 0 : e.detourDirection) ?? v.detourDirection, this.detourDistance = (e == null ? void 0 : e.detourDistance) ?? v.detourDistance, this.hasSourceArrow = (e == null ? void 0 : e.hasSourceArrow) ?? v.hasSourceArrow, this.hasTargetArrow = (e == null ? void 0 : e.hasTargetArrow) ?? v.hasTargetArrow, this.pathShape = new X({
      color: (e == null ? void 0 : e.color) ?? v.color,
      width: (e == null ? void 0 : e.width) ?? v.width,
      arrowRenderer: U((e == null ? void 0 : e.arrowRenderer) ?? {}),
      arrowLength: this.arrowLength,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
      createCyclePath: this.createCyclePath,
      createDetourPath: this.createDetourPath,
      createLinePath: this.createLinePath,
      padding: O
    }), this.svg = this.pathShape.svg, this.group = this.pathShape.group, this.line = this.pathShape.line, this.sourceArrow = this.pathShape.sourceArrow, this.targetArrow = this.pathShape.targetArrow, this.onAfterRender = this.pathShape.onAfterRender;
  }
  render(e) {
    this.pathShape.render(e);
  }
}
class Pt {
  constructor(e) {
    i(this, "svg");
    i(this, "group");
    i(this, "line");
    i(this, "sourceArrow");
    i(this, "targetArrow");
    i(this, "onAfterRender");
    i(this, "arrowLength");
    i(this, "arrowOffset");
    i(this, "roundness");
    i(this, "cycleSquareSide");
    i(this, "detourDistance");
    i(this, "hasSourceArrow");
    i(this, "hasTargetArrow");
    i(this, "pathShape");
    i(this, "createCyclePath", (e, t, o) => new te({
      origin: e,
      dir: o,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasArrow: this.hasSourceArrow || this.hasTargetArrow
    }));
    i(this, "createDetourPath", (e, t, o, s) => new xt({
      from: e,
      to: t,
      fromDir: o,
      toDir: s,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    i(this, "createLinePath", (e, t, o, s) => new lt({
      from: e,
      to: t,
      fromDir: o,
      toDir: s,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    this.arrowLength = (e == null ? void 0 : e.arrowLength) ?? v.arrowLength, this.arrowOffset = (e == null ? void 0 : e.arrowOffset) ?? v.arrowOffset, this.cycleSquareSide = (e == null ? void 0 : e.cycleSquareSide) ?? v.cycleSquareSide;
    const t = (e == null ? void 0 : e.roundness) ?? v.roundness;
    this.roundness = Math.min(
      t,
      this.arrowOffset,
      this.cycleSquareSide / 2
    ), this.detourDistance = (e == null ? void 0 : e.detourDistance) ?? v.detourDistance, this.hasSourceArrow = (e == null ? void 0 : e.hasSourceArrow) ?? v.hasSourceArrow, this.hasTargetArrow = (e == null ? void 0 : e.hasTargetArrow) ?? v.hasTargetArrow, this.pathShape = new X({
      color: (e == null ? void 0 : e.color) ?? v.color,
      width: (e == null ? void 0 : e.width) ?? v.width,
      arrowRenderer: U((e == null ? void 0 : e.arrowRenderer) ?? {}),
      arrowLength: this.arrowLength,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
      createCyclePath: this.createCyclePath,
      createDetourPath: this.createDetourPath,
      createLinePath: this.createLinePath,
      padding: O
    }), this.svg = this.pathShape.svg, this.group = this.pathShape.group, this.line = this.pathShape.line, this.sourceArrow = this.pathShape.sourceArrow, this.targetArrow = this.pathShape.targetArrow, this.onAfterRender = this.pathShape.onAfterRender;
  }
  render(e) {
    this.pathShape.render(e);
  }
}
class Ct {
  constructor(e) {
    i(this, "svg");
    i(this, "group");
    i(this, "line");
    i(this, "sourceArrow");
    i(this, "targetArrow");
    i(this, "onAfterRender");
    i(this, "arrowLength");
    i(this, "arrowOffset");
    i(this, "roundness");
    i(this, "cycleSquareSide");
    i(this, "detourDirection");
    i(this, "detourDistance");
    i(this, "hasSourceArrow");
    i(this, "hasTargetArrow");
    i(this, "pathShape");
    i(this, "createCyclePath", (e, t, o) => new te({
      origin: e,
      dir: o,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasArrow: this.hasSourceArrow || this.hasTargetArrow
    }));
    i(this, "createDetourPath", (e, t, o, s) => new gt({
      from: e,
      to: t,
      fromDir: o,
      toDir: s,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDir: this.detourDirection,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    i(this, "createLinePath", (e, t, o, s) => new ut({
      from: e,
      to: t,
      fromDir: o,
      toDir: s,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    this.arrowLength = (e == null ? void 0 : e.arrowLength) ?? v.arrowLength, this.arrowOffset = (e == null ? void 0 : e.arrowOffset) ?? v.arrowOffset, this.cycleSquareSide = (e == null ? void 0 : e.cycleSquareSide) ?? v.cycleSquareSide;
    const t = (e == null ? void 0 : e.roundness) ?? v.roundness;
    this.roundness = Math.min(
      t,
      this.arrowOffset,
      this.cycleSquareSide / 2
    ), this.detourDirection = (e == null ? void 0 : e.detourDirection) ?? v.detourDirection, this.detourDistance = (e == null ? void 0 : e.detourDistance) ?? v.detourDistance, this.hasSourceArrow = (e == null ? void 0 : e.hasSourceArrow) ?? v.hasSourceArrow, this.hasTargetArrow = (e == null ? void 0 : e.hasTargetArrow) ?? v.hasTargetArrow, this.pathShape = new X({
      color: (e == null ? void 0 : e.color) ?? v.color,
      width: (e == null ? void 0 : e.width) ?? v.width,
      arrowRenderer: U((e == null ? void 0 : e.arrowRenderer) ?? {}),
      arrowLength: this.arrowLength,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
      createCyclePath: this.createCyclePath,
      createDetourPath: this.createDetourPath,
      createLinePath: this.createLinePath,
      padding: O
    }), this.svg = this.pathShape.svg, this.group = this.pathShape.group, this.line = this.pathShape.line, this.sourceArrow = this.pathShape.sourceArrow, this.targetArrow = this.pathShape.targetArrow, this.onAfterRender = this.pathShape.onAfterRender;
  }
  render(e) {
    this.pathShape.render(e);
  }
}
class Tt {
  constructor(e) {
    i(this, "svg");
    i(this, "group");
    i(this, "line");
    i(this, "sourceArrow");
    i(this, "targetArrow");
    i(this, "onAfterRender");
    i(this, "arrowLength");
    i(this, "arrowOffset");
    i(this, "roundness");
    i(this, "cycleSquareSide");
    i(this, "detourDistance");
    i(this, "hasSourceArrow");
    i(this, "hasTargetArrow");
    i(this, "pathShape");
    i(this, "createCyclePath", (e, t, o) => new te({
      origin: e,
      dir: o,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasArrow: this.hasSourceArrow || this.hasTargetArrow
    }));
    i(this, "createDetourPath", (e, t, o, s) => new At({
      from: e,
      to: t,
      fromDir: o,
      toDir: s,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    i(this, "createLinePath", (e, t, o, s) => new yt({
      from: e,
      to: t,
      fromDir: o,
      toDir: s,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    this.arrowLength = (e == null ? void 0 : e.arrowLength) ?? v.arrowLength, this.arrowOffset = (e == null ? void 0 : e.arrowOffset) ?? v.arrowOffset, this.cycleSquareSide = (e == null ? void 0 : e.cycleSquareSide) ?? v.cycleSquareSide;
    const t = (e == null ? void 0 : e.roundness) ?? v.roundness;
    this.roundness = Math.min(
      t,
      this.arrowOffset,
      this.cycleSquareSide / 2
    ), this.detourDistance = (e == null ? void 0 : e.detourDistance) ?? v.detourDistance, this.hasSourceArrow = (e == null ? void 0 : e.hasSourceArrow) ?? v.hasSourceArrow, this.hasTargetArrow = (e == null ? void 0 : e.hasTargetArrow) ?? v.hasTargetArrow, this.pathShape = new X({
      color: (e == null ? void 0 : e.color) ?? v.color,
      width: (e == null ? void 0 : e.width) ?? v.width,
      arrowRenderer: U((e == null ? void 0 : e.arrowRenderer) ?? {}),
      arrowLength: this.arrowLength,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
      createCyclePath: this.createCyclePath,
      createDetourPath: this.createDetourPath,
      createLinePath: this.createLinePath,
      padding: O
    }), this.svg = this.pathShape.svg, this.group = this.pathShape.group, this.line = this.pathShape.line, this.sourceArrow = this.pathShape.sourceArrow, this.targetArrow = this.pathShape.targetArrow, this.onAfterRender = this.pathShape.onAfterRender;
  }
  render(e) {
    this.pathShape.render(e);
  }
}
class Le {
  constructor(e) {
    i(this, "svg");
    i(this, "group", document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    ));
    i(this, "line");
    i(this, "sourceArrow", null);
    i(this, "targetArrow", null);
    i(this, "color");
    i(this, "width");
    i(this, "arrowLength");
    i(this, "sourceOffset");
    i(this, "targetOffset");
    i(this, "onAfterRender");
    i(this, "afterRenderEmitter");
    i(this, "arrowRenderer");
    [this.afterRenderEmitter, this.onAfterRender] = P(), this.color = (e == null ? void 0 : e.color) ?? v.color, this.width = (e == null ? void 0 : e.width) ?? v.width, this.arrowLength = (e == null ? void 0 : e.arrowLength) ?? v.arrowLength, this.arrowRenderer = U((e == null ? void 0 : e.arrowRenderer) ?? {}), this.sourceOffset = (e == null ? void 0 : e.sourceOffset) ?? v.preOffset, this.targetOffset = (e == null ? void 0 : e.targetOffset) ?? v.preOffset, this.svg = Me(this.color), this.svg.appendChild(this.group), this.line = De(this.width), this.group.appendChild(this.line), e != null && e.hasSourceArrow && (this.sourceArrow = Y(), this.group.appendChild(this.sourceArrow)), e != null && e.hasTargetArrow && (this.targetArrow = Y(), this.group.appendChild(this.targetArrow));
  }
  render(e) {
    const { x: t, y: o, width: s, height: n, from: a, to: h } = Te(
      e.from,
      e.to,
      O
    );
    Re(this.svg, { x: t, y: o, width: s, height: n });
    const d = new ft({
      from: a,
      to: h,
      sourceOffset: this.sourceOffset,
      targetOffset: this.targetOffset,
      hasSourceArrow: this.sourceArrow !== null,
      hasTargetArrow: this.targetArrow !== null,
      arrowLength: this.arrowLength
    });
    this.line.setAttribute("d", d.path);
    let c = null, g = null;
    const u = d.diagonalDistance;
    if (u === 0)
      this.sourceArrow !== null && (c = "", this.sourceArrow.setAttribute("d", c)), this.targetArrow !== null && (g = "", this.targetArrow.setAttribute("d", g));
    else {
      const l = {
        x: (h.x - a.x) / u,
        y: (h.y - a.y) / u
      };
      if (this.sourceArrow) {
        const p = {
          x: l.x * this.sourceOffset,
          y: l.y * this.sourceOffset
        };
        c = this.arrowRenderer({
          direction: l,
          shift: p,
          arrowLength: this.arrowLength
        }), this.sourceArrow.setAttribute("d", c);
      }
      if (this.targetArrow) {
        const p = {
          x: l.x * this.targetOffset,
          y: l.y * this.targetOffset
        };
        g = this.arrowRenderer({
          direction: { x: -l.x, y: -l.y },
          shift: {
            x: h.x - p.x,
            y: h.y - p.y
          },
          arrowLength: this.arrowLength
        }), this.targetArrow.setAttribute("d", g);
      }
    }
    this.afterRenderEmitter.emit({
      edgePath: d,
      sourceArrowPath: c,
      targetArrowPath: g
    });
  }
}
const Mt = () => {
  const r = document.createElementNS("http://www.w3.org/2000/svg", "g");
  return r.style.pointerEvents = "auto", r.style.cursor = "pointer", r;
}, Dt = (r) => {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("stroke", "transparent"), e.setAttribute("stroke-width", `${r}`), e.setAttribute("fill", "none"), e.setAttribute("stroke-linecap", "round"), e;
}, fe = (r) => {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("stroke-linejoin", "round"), e.setAttribute("stroke-width", `${r}`), e.setAttribute("fill", "transparent"), e.setAttribute("stroke", "transparent"), e;
};
class Rt extends Error {
  constructor(e) {
    super(e), this.name = "InteractiveEdgeError";
  }
}
class Fe {
  constructor(e, t) {
    i(this, "svg");
    i(this, "group");
    i(this, "line");
    i(this, "sourceArrow");
    i(this, "targetArrow");
    i(this, "handle", Mt());
    i(this, "onAfterRender");
    i(this, "interactiveLine");
    i(this, "interactiveSourceArrow", null);
    i(this, "interactiveTargetArrow", null);
    if (this.baseEdge = e, e instanceof Fe)
      throw new Rt(
        "interactive edge can be configured only once"
      );
    this.svg = this.baseEdge.svg, this.group = this.baseEdge.group, this.line = this.baseEdge.line, this.sourceArrow = this.baseEdge.sourceArrow, this.targetArrow = this.baseEdge.targetArrow, this.onAfterRender = this.baseEdge.onAfterRender;
    const o = (t == null ? void 0 : t.distance) ?? v.interactiveWidth;
    this.interactiveLine = Dt(o), this.handle.appendChild(this.interactiveLine), this.sourceArrow && (this.interactiveSourceArrow = fe(o), this.handle.appendChild(this.interactiveSourceArrow)), this.targetArrow && (this.interactiveTargetArrow = fe(o), this.handle.appendChild(this.interactiveTargetArrow)), this.group.appendChild(this.handle), this.baseEdge.onAfterRender.subscribe((s) => {
      this.interactiveLine.setAttribute("d", s.edgePath.path), this.interactiveSourceArrow && this.interactiveSourceArrow.setAttribute("d", s.sourceArrowPath), this.interactiveTargetArrow && this.interactiveTargetArrow.setAttribute("d", s.targetArrowPath);
    });
  }
  render(e) {
    this.baseEdge.render(e);
  }
}
class Mr {
  constructor(e, t) {
    i(this, "group");
    i(this, "line");
    i(this, "sourceArrow");
    i(this, "targetArrow");
    i(this, "onAfterRender");
    i(this, "svg");
    this.baseShape = e, this.midpointElement = t, this.svg = this.baseShape.svg, this.group = this.baseShape.group, this.line = this.baseShape.line, this.sourceArrow = this.baseShape.sourceArrow, this.targetArrow = this.baseShape.targetArrow, this.onAfterRender = this.baseShape.onAfterRender, this.svg.append(this.midpointElement), this.baseShape.onAfterRender.subscribe((o) => {
      const s = o.edgePath.midpoint, n = `translate(${s.x}px, ${s.y}px)`;
      this.midpointElement.style.setProperty("transform", n);
    });
  }
  render(e) {
    this.baseShape.render(e);
  }
}
class Ie {
  constructor(e) {
    i(this, "onAfterNodeAdded");
    i(this, "onAfterNodeUpdated");
    i(this, "onAfterNodePriorityUpdated");
    i(this, "onBeforeNodeRemoved");
    i(this, "onAfterPortMarked");
    i(this, "onAfterPortUpdated");
    i(this, "onBeforePortUnmarked");
    i(this, "onAfterEdgeAdded");
    i(this, "onAfterEdgeShapeUpdated");
    i(this, "onAfterEdgeUpdated");
    i(this, "onAfterEdgePriorityUpdated");
    i(this, "onBeforeEdgeRemoved");
    i(this, "onBeforeClear");
    this.graphStore = e, this.onAfterNodeAdded = this.graphStore.onAfterNodeAdded, this.onAfterNodeUpdated = this.graphStore.onAfterNodeUpdated, this.onAfterNodePriorityUpdated = this.graphStore.onAfterNodePriorityUpdated, this.onBeforeNodeRemoved = this.graphStore.onBeforeNodeRemoved, this.onAfterPortMarked = this.graphStore.onAfterPortAdded, this.onAfterPortUpdated = this.graphStore.onAfterPortUpdated, this.onBeforePortUnmarked = this.graphStore.onBeforePortRemoved, this.onAfterEdgeAdded = this.graphStore.onAfterEdgeAdded, this.onAfterEdgeShapeUpdated = this.graphStore.onAfterEdgeShapeUpdated, this.onAfterEdgeUpdated = this.graphStore.onAfterEdgeUpdated, this.onAfterEdgePriorityUpdated = this.graphStore.onAfterEdgePriorityUpdated, this.onBeforeEdgeRemoved = this.graphStore.onBeforeEdgeRemoved, this.onBeforeClear = this.graphStore.onBeforeClear;
  }
  hasNode(e) {
    return this.graphStore.hasNode(e);
  }
  getNode(e) {
    const t = this.graphStore.getNode(e), { payload: o } = t;
    return {
      element: t.element,
      x: o.x,
      y: o.y,
      centerFn: o.centerFn,
      priority: o.priority
    };
  }
  findNodeIdByElement(e) {
    return this.graphStore.findNodeIdByElement(e);
  }
  getAllNodeIds() {
    return this.graphStore.getAllNodeIds();
  }
  hasPort(e) {
    return this.graphStore.hasPort(e);
  }
  getPort(e) {
    const t = this.graphStore.getPort(e);
    return {
      element: t.element,
      direction: t.payload.direction,
      nodeId: t.nodeId
    };
  }
  getAllPortIds() {
    return this.graphStore.getAllPortIds();
  }
  getNodePortIds(e) {
    return this.graphStore.getNodePortIds(e);
  }
  findPortIdsByElement(e) {
    return this.graphStore.findPortIdsByElement(e);
  }
  getAllEdgeIds() {
    return this.graphStore.getAllEdgeIds();
  }
  hasEdge(e) {
    return this.graphStore.hasEdge(e);
  }
  getEdge(e) {
    const t = this.graphStore.getEdge(e), { payload: o } = t;
    return {
      from: t.from,
      to: t.to,
      priority: o.priority,
      shape: o.shape
    };
  }
  getPortIncomingEdgeIds(e) {
    return this.graphStore.getPortIncomingEdgeIds(e);
  }
  getPortOutgoingEdgeIds(e) {
    return this.graphStore.getPortOutgoingEdgeIds(e);
  }
  getPortCycleEdgeIds(e) {
    return this.graphStore.getPortCycleEdgeIds(e);
  }
  getPortAdjacentEdgeIds(e) {
    return this.graphStore.getPortAdjacentEdgeIds(e);
  }
  getNodeIncomingEdgeIds(e) {
    return this.graphStore.getNodeIncomingEdgeIds(e);
  }
  getNodeOutgoingEdgeIds(e) {
    return this.graphStore.getNodeOutgoingEdgeIds(e);
  }
  getNodeCycleEdgeIds(e) {
    return this.graphStore.getNodeCycleEdgeIds(e);
  }
  getNodeAdjacentEdgeIds(e) {
    return this.graphStore.getNodeAdjacentEdgeIds(e);
  }
}
class J {
  constructor(e) {
    i(this, "counter", 0);
    this.checkExists = e;
  }
  create(e) {
    if (e !== void 0)
      return e;
    for (; this.checkExists(this.counter); )
      this.counter++;
    return this.counter;
  }
  reset() {
    this.counter = 0;
  }
}
class Ve {
  constructor(e, t, o) {
    i(this, "nodeIdGenerator", new J(
      (e) => this.graphStore.hasNode(e)
    ));
    i(this, "portIdGenerator", new J(
      (e) => this.graphStore.hasPort(e)
    ));
    i(this, "edgeIdGenerator", new J(
      (e) => this.graphStore.hasEdge(e)
    ));
    i(this, "onAfterNodeAdded", (e) => {
      this.htmlView.attachNode(e);
    });
    i(this, "onAfterNodeUpdated", (e) => {
      this.htmlView.updateNodePosition(e), this.graphStore.getNodeAdjacentEdgeIds(e).forEach((t) => {
        this.htmlView.renderEdge(t);
      });
    });
    i(this, "onAfterNodePriorityUpdated", (e) => {
      this.htmlView.updateNodePriority(e);
    });
    i(this, "onBeforeNodeRemoved", (e) => {
      this.graphStore.getNodePortIds(e).forEach((t) => {
        this.unmarkPort(t);
      }), this.htmlView.detachNode(e);
    });
    i(this, "onAfterPortUpdated", (e) => {
      this.graphStore.getPortAdjacentEdgeIds(e).forEach((t) => {
        this.htmlView.renderEdge(t);
      });
    });
    i(this, "onBeforePortUnmarked", (e) => {
      this.graphStore.getPortAdjacentEdgeIds(e).forEach((t) => {
        this.removeEdge(t);
      });
    });
    i(this, "onAfterEdgeAdded", (e) => {
      this.htmlView.attachEdge(e);
    });
    i(this, "onAfterEdgeShapeUpdated", (e) => {
      this.htmlView.updateEdgeShape(e);
    });
    i(this, "onAfterEdgeUpdated", (e) => {
      this.htmlView.renderEdge(e);
    });
    i(this, "onAfterEdgePriorityUpdated", (e) => {
      this.htmlView.updateEdgePriority(e);
    });
    i(this, "onBeforeEdgeRemoved", (e) => {
      this.htmlView.detachEdge(e);
    });
    i(this, "onBeforeClear", () => {
      this.nodeIdGenerator.reset(), this.portIdGenerator.reset(), this.edgeIdGenerator.reset(), this.htmlView.clear();
    });
    this.graphStore = e, this.htmlView = t, this.params = o, this.graphStore.onAfterNodeAdded.subscribe(this.onAfterNodeAdded), this.graphStore.onAfterNodeUpdated.subscribe(this.onAfterNodeUpdated), this.graphStore.onAfterNodePriorityUpdated.subscribe(
      this.onAfterNodePriorityUpdated
    ), this.graphStore.onBeforeNodeRemoved.subscribe(this.onBeforeNodeRemoved), this.graphStore.onAfterPortUpdated.subscribe(this.onAfterPortUpdated), this.graphStore.onBeforePortRemoved.subscribe(this.onBeforePortUnmarked), this.graphStore.onAfterEdgeAdded.subscribe(this.onAfterEdgeAdded), this.graphStore.onAfterEdgeShapeUpdated.subscribe(
      this.onAfterEdgeShapeUpdated
    ), this.graphStore.onAfterEdgeUpdated.subscribe(this.onAfterEdgeUpdated), this.graphStore.onAfterEdgePriorityUpdated.subscribe(
      this.onAfterEdgePriorityUpdated
    ), this.graphStore.onBeforeEdgeRemoved.subscribe(this.onBeforeEdgeRemoved), this.graphStore.onBeforeClear.subscribe(this.onBeforeClear);
  }
  addNode(e) {
    const t = this.nodeIdGenerator.create(e.id);
    if (this.graphStore.addNode({
      id: t,
      element: e.element,
      x: e.x ?? null,
      y: e.y ?? null,
      centerFn: e.centerFn ?? this.params.nodes.centerFn,
      priority: e.priority ?? this.params.nodes.priorityFn()
    }), e.ports !== void 0)
      for (const o of e.ports)
        this.markPort({
          id: o.id,
          element: o.element,
          nodeId: t,
          direction: o.direction
        });
  }
  updateNode(e, t) {
    this.graphStore.updateNode(e, t ?? {});
  }
  removeNode(e) {
    this.graphStore.removeNode(e);
  }
  markPort(e) {
    const t = this.portIdGenerator.create(e.id);
    this.graphStore.addPort({
      id: t,
      element: e.element,
      nodeId: e.nodeId,
      direction: e.direction ?? this.params.ports.direction
    });
  }
  updatePort(e, t) {
    this.graphStore.updatePort(e, t ?? {});
  }
  unmarkPort(e) {
    this.graphStore.removePort(e);
  }
  addEdge(e) {
    const t = this.edgeIdGenerator.create(e.id);
    this.graphStore.addEdge({
      id: t,
      from: e.from,
      to: e.to,
      shape: e.shape ?? this.params.edges.shapeFactory(t),
      priority: e.priority ?? this.params.edges.priorityFn()
    });
  }
  updateEdge(e, t) {
    this.graphStore.updateEdge(e, t ?? {});
  }
  removeEdge(e) {
    this.graphStore.removeEdge(e);
  }
  clear() {
    this.graphStore.clear();
  }
  destroy() {
    this.graphStore.onAfterNodeAdded.unsubscribe(this.onAfterNodeAdded), this.graphStore.onAfterNodeUpdated.unsubscribe(this.onAfterNodeUpdated), this.graphStore.onAfterNodePriorityUpdated.unsubscribe(
      this.onAfterNodePriorityUpdated
    ), this.graphStore.onBeforeNodeRemoved.unsubscribe(this.onBeforeNodeRemoved), this.graphStore.onAfterPortUpdated.unsubscribe(this.onAfterPortUpdated), this.graphStore.onBeforePortRemoved.unsubscribe(this.onBeforePortUnmarked), this.graphStore.onAfterEdgeAdded.unsubscribe(this.onAfterEdgeAdded), this.graphStore.onAfterEdgeShapeUpdated.unsubscribe(
      this.onAfterEdgeShapeUpdated
    ), this.graphStore.onAfterEdgeUpdated.unsubscribe(this.onAfterEdgeUpdated), this.graphStore.onAfterEdgePriorityUpdated.unsubscribe(
      this.onAfterEdgePriorityUpdated
    ), this.graphStore.onBeforeEdgeRemoved.unsubscribe(this.onBeforeEdgeRemoved), this.graphStore.onBeforeClear.unsubscribe(this.onBeforeClear), this.htmlView.destroy();
  }
}
const Lt = (r) => {
  setTimeout(() => {
    r();
  });
}, Ft = (r) => {
  queueMicrotask(() => {
    r();
  });
}, re = (r) => {
  r();
};
class $e {
  constructor(e) {
    i(this, "onBeforeUpdated");
    i(this, "onAfterUpdated");
    i(this, "onAfterResize");
    this.viewportStore = e, this.onBeforeUpdated = this.viewportStore.onBeforeUpdated, this.onAfterUpdated = this.viewportStore.onAfterUpdated, this.onAfterResize = this.viewportStore.onAfterResize;
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
  createContentCoords(e) {
    return this.viewportStore.createContentCoords(e);
  }
  createViewportCoords(e) {
    return this.viewportStore.createViewportCoords(e);
  }
}
const It = (r, e) => Symbol.iterator in r ? {
  minContentScale: e.focus.minContentScale,
  nodes: r,
  contentOffset: e.focus.contentOffset,
  animationDuration: e.focus.animationDuration
} : {
  minContentScale: r.minContentScale ?? e.focus.minContentScale,
  nodes: r.nodes ?? [],
  contentOffset: r.contentOffset ?? e.focus.contentOffset,
  animationDuration: r.animationDuration ?? e.focus.animationDuration
}, Be = (r, e, t) => ({
  scale: r.scale,
  x: r.x + r.scale * e,
  y: r.y + r.scale * t
}), Ue = (r, e, t, o) => ({
  scale: r.scale * e,
  x: r.scale * (1 - e) * t + r.x,
  y: r.scale * (1 - e) * o + r.y
});
class Oe {
  constructor(e, t, o, s) {
    this.graphStore = e, this.viewportStore = t, this.params = o, this.win = s;
  }
  patchViewportMatrix(e) {
    this.viewportStore.patchViewportMatrix(e);
  }
  patchContentMatrix(e) {
    this.viewportStore.patchContentMatrix(e);
  }
  center(e, t) {
    const { width: o, height: s } = this.viewportStore.getDimensions(), n = { x: o / 2, y: s / 2 }, a = this.viewportStore.getViewportMatrix(), h = this.viewportStore.createViewportCoords(e), d = h.x - n.x, c = h.y - n.y;
    let g = Be(a, d, c);
    const u = t == null ? void 0 : t.contentScale;
    if (u !== void 0) {
      const p = 1 / u;
      g = Ue(
        g,
        p / a.scale,
        n.x,
        n.y
      );
    }
    const l = (t == null ? void 0 : t.animationDuration) ?? 0;
    l > 0 ? this.animateNavigation(a, g, l) : this.viewportStore.patchViewportMatrix(g);
  }
  focus(e) {
    const t = It(e ?? {}, this.params);
    this.params.focus.schedule(() => {
      this.navigate(t);
    });
  }
  destroy() {
    this.viewportStore.destroy();
  }
  navigate(e) {
    let t = 1 / 0, o = -1 / 0, s = 1 / 0, n = -1 / 0, a = 0;
    const h = /* @__PURE__ */ new Set();
    for (const d of e.nodes)
      h.add(d);
    if (this.graphStore.getAllNodeIds().forEach((d) => {
      const { payload: c } = this.graphStore.getNode(d);
      c.x !== null && c.y !== null && (h.size === 0 || h.has(d)) && (t = Math.min(c.x, t), o = Math.max(c.x, o), s = Math.min(c.y, s), n = Math.max(c.y, n), a++);
    }), a > 0) {
      t -= e.contentOffset, s -= e.contentOffset, o += e.contentOffset, n += e.contentOffset;
      const d = {
        x: (t + o) / 2,
        y: (s + n) / 2
      }, { scale: c } = this.viewportStore.getContentMatrix(), g = (n - s) * c, u = (o - t) * c, { width: l, height: p } = this.viewportStore.getDimensions(), y = Math.max(
        u / l,
        g / p
      ), w = y > 1 ? c / y : c, f = Math.max(w, e.minContentScale);
      this.center(d, {
        contentScale: f,
        animationDuration: e.animationDuration
      });
    }
  }
  animateNavigation(e, t, o) {
    let s;
    const n = {
      scale: t.scale - e.scale,
      x: t.x - e.x,
      y: t.y - e.y
    }, a = (h) => {
      s === void 0 && (s = h);
      const d = Math.min((h - s) / o, 1);
      d <= 1 && this.viewportStore.patchViewportMatrix({
        scale: e.scale + d * n.scale,
        x: e.x + d * n.x,
        y: e.y + d * n.y
      }), d < 1 && this.win.requestAnimationFrame(a);
    };
    this.win.requestAnimationFrame(a);
  }
}
const We = (r, e, t) => {
  const o = new be(), s = new Ie(o), n = new $e(e), a = new Ee(o, e, r), h = {
    nodes: {
      centerFn: Ce,
      priorityFn: () => 0
    },
    edges: {
      shapeFactory: () => new Le(),
      priorityFn: () => 0
    },
    ports: {
      direction: 0
    }
  }, d = new Ve(
    o,
    a,
    h
  ), c = {
    focus: {
      contentOffset: 0,
      minContentScale: 0,
      schedule: re,
      animationDuration: 0
    }
  }, g = new Oe(
    o,
    e,
    c,
    t
  );
  return new Se(s, n, d, g);
};
class G {
  constructor(e, t, o, s) {
    i(this, "onAfterPortMarked", (e) => {
      const t = this.canvas.graph.getPort(e);
      this.canvas.graph.findPortIdsByElement(t.element).length === 1 && this.hookPortEvents(t.element);
    });
    i(this, "onBeforePortUnmarked", (e) => {
      const t = this.canvas.graph.getPort(e);
      this.canvas.graph.findPortIdsByElement(t.element).length === 1 && this.unhookPortEvents(t.element);
    });
    i(this, "onPortMouseDown", (e) => {
      const t = e;
      if (!this.params.mouseDownEventVerifier(t))
        return;
      const o = e.currentTarget, s = this.canvas.graph.findPortIdsByElement(o)[0];
      this.params.onPortPointerDown(s, {
        x: t.clientX,
        y: t.clientY
      }) && (e.stopPropagation(), this.window.addEventListener("mousemove", this.onWindowMouseMove, {
        passive: !0
      }), this.window.addEventListener("mouseup", this.onWindowMouseUp, {
        passive: !0
      }));
    });
    i(this, "onWindowMouseMove", (e) => {
      if (!F(
        this.window,
        this.element,
        e.clientX,
        e.clientY
      )) {
        this.stopMouseDrag();
        return;
      }
      this.params.onPointerMove({ x: e.clientX, y: e.clientY });
    });
    i(this, "onWindowMouseUp", (e) => {
      this.params.mouseUpEventVerifier(e) && (this.params.onPointerUp({ x: e.clientX, y: e.clientY }), this.stopMouseDrag());
    });
    i(this, "onPortTouchStart", (e) => {
      const t = e;
      if (t.touches.length !== 1)
        return;
      const o = t.touches[0], s = e.currentTarget, n = this.canvas.graph.findPortIdsByElement(s)[0];
      this.params.onPortPointerDown(n, {
        x: o.clientX,
        y: o.clientY
      }) && (e.stopPropagation(), this.window.addEventListener("touchmove", this.onWindowTouchMove, {
        passive: !0
      }), this.window.addEventListener("touchend", this.onWindowTouchFinish, {
        passive: !0
      }), this.window.addEventListener("touchcancel", this.onWindowTouchFinish, {
        passive: !0
      }));
    });
    i(this, "onWindowTouchMove", (e) => {
      const t = e.touches[0];
      if (!F(
        this.window,
        this.element,
        t.clientX,
        t.clientY
      )) {
        this.stopTouchDrag();
        return;
      }
      this.params.onPointerMove({ x: t.clientX, y: t.clientY });
    });
    i(this, "onWindowTouchFinish", (e) => {
      const t = e.changedTouches[0];
      this.params.onPointerUp({ x: t.clientX, y: t.clientY }), this.stopTouchDrag();
    });
    i(this, "reset", () => {
      this.canvas.graph.getAllPortIds().forEach((e) => {
        const t = this.canvas.graph.getPort(e);
        this.unhookPortEvents(t.element);
      });
    });
    i(this, "revert", () => {
      this.params.onStopDrag(), this.reset(), this.removeWindowMouseListeners(), this.removeWindowTouchListeners();
    });
    this.canvas = e, this.element = t, this.window = o, this.params = s, this.canvas.graph.onAfterPortMarked.subscribe(this.onAfterPortMarked), this.canvas.graph.onBeforePortUnmarked.subscribe(this.onBeforePortUnmarked), this.canvas.graph.onBeforeClear.subscribe(this.reset), this.canvas.onBeforeDestroy.subscribe(this.revert);
  }
  static configure(e, t, o, s) {
    new G(e, t, o, s);
  }
  hookPortEvents(e) {
    e.addEventListener("mousedown", this.onPortMouseDown, {
      passive: !0
    }), e.addEventListener("touchstart", this.onPortTouchStart, {
      passive: !0
    });
  }
  unhookPortEvents(e) {
    e.removeEventListener("mousedown", this.onPortMouseDown), e.removeEventListener("touchstart", this.onPortTouchStart);
  }
  stopMouseDrag() {
    this.params.onStopDrag(), this.removeWindowMouseListeners();
  }
  stopTouchDrag() {
    this.params.onStopDrag(), this.removeWindowTouchListeners();
  }
  removeWindowMouseListeners() {
    this.window.removeEventListener("mousemove", this.onWindowMouseMove), this.window.removeEventListener("mouseup", this.onWindowMouseUp);
  }
  removeWindowTouchListeners() {
    this.window.removeEventListener("touchmove", this.onWindowTouchMove), this.window.removeEventListener("touchend", this.onWindowTouchFinish), this.window.removeEventListener("touchcancel", this.onWindowTouchFinish);
  }
}
class Vt {
  constructor(e, t, o) {
    this.canvas = e, this.layoutAlgorithm = t, this.params = o;
  }
  apply() {
    const e = this.layoutAlgorithm.calculateCoordinates({
      graph: this.canvas.graph,
      viewport: this.canvas.viewport
    });
    this.params.onBeforeApplied(), e.forEach((t, o) => {
      this.params.staticNodeResolver(o) || this.canvas.updateNode(o, t);
    }), this.params.onAfterApplied();
  }
}
class $t {
  constructor(e, t, o) {
    this.canvas = e, this.layoutAlgorithm = t, this.params = o;
  }
  apply(e) {
    const t = this.layoutAlgorithm.calculateNextCoordinates({
      graph: this.canvas.graph,
      viewport: this.canvas.viewport,
      dt: e
    });
    this.params.onBeforeApplied(), t.forEach((o, s) => {
      this.params.staticNodeResolver(s) || this.canvas.updateNode(s, o);
    }), this.params.onAfterApplied();
  }
}
class oe {
  constructor(e, t, o, s) {
    i(this, "grabbedNode", null);
    i(this, "maxNodePriority", 0);
    i(this, "graph");
    i(this, "onAfterNodeAdded", (e) => {
      this.updateMaxNodePriority(e);
      const { element: t } = this.graph.getNode(e);
      t.addEventListener("mousedown", this.onMouseDown, {
        passive: !0
      }), t.addEventListener("touchstart", this.onTouchStart, {
        passive: !0
      });
    });
    i(this, "onAfterNodeUpdated", (e) => {
      this.updateMaxNodePriority(e);
    });
    i(this, "onBeforeNodeRemoved", (e) => {
      const { element: t } = this.graph.getNode(e);
      t.removeEventListener("mousedown", this.onMouseDown), t.removeEventListener("touchstart", this.onTouchStart);
    });
    i(this, "onMouseDown", (e) => {
      const t = e;
      if (!this.params.mouseDownEventVerifier(t))
        return;
      const o = e.currentTarget, s = this.graph.findNodeIdByElement(o), n = this.graph.getNode(s);
      if (!this.params.nodeDragVerifier(s))
        return;
      this.params.onNodeDragStarted(s), e.stopPropagation();
      const h = this.calculateContentPoint({
        x: t.clientX,
        y: t.clientY
      });
      this.grabbedNode = {
        nodeId: s,
        dx: h.x - n.x,
        dy: h.y - n.y
      }, k(this.element, this.params.dragCursor), this.moveNodeOnTop(s), this.window.addEventListener("mousemove", this.onWindowMouseMove, {
        passive: !0
      }), this.window.addEventListener("mouseup", this.onWindowMouseUp, {
        passive: !0
      });
    });
    i(this, "onTouchStart", (e) => {
      const t = e;
      if (t.touches.length !== 1)
        return;
      e.stopPropagation();
      const o = t.touches[0], s = e.currentTarget, n = this.canvas.graph.findNodeIdByElement(s), a = this.graph.getNode(n);
      if (!this.params.nodeDragVerifier({
        nodeId: n,
        element: a.element,
        x: a.x,
        y: a.y
      }))
        return;
      const d = this.calculateContentPoint({
        x: o.clientX,
        y: o.clientY
      });
      this.grabbedNode = {
        nodeId: n,
        dx: d.x - a.x,
        dy: d.y - a.y
      }, this.moveNodeOnTop(n), this.window.addEventListener("touchmove", this.onWindowTouchMove, {
        passive: !0
      }), this.window.addEventListener("touchend", this.onWindowTouchFinish, {
        passive: !0
      }), this.window.addEventListener("touchcancel", this.onWindowTouchFinish, {
        passive: !0
      });
    });
    i(this, "onWindowMouseMove", (e) => {
      if (!F(
        this.window,
        this.element,
        e.clientX,
        e.clientY
      )) {
        this.cancelMouseDrag();
        return;
      }
      this.grabbedNode !== null && this.moveNode(this.grabbedNode, {
        x: e.clientX,
        y: e.clientY
      });
    });
    i(this, "onWindowMouseUp", (e) => {
      this.params.mouseUpEventVerifier(e) && this.cancelMouseDrag();
    });
    i(this, "onWindowTouchMove", (e) => {
      if (e.touches.length !== 1)
        return;
      const t = e.touches[0];
      if (!F(
        this.window,
        this.element,
        t.clientX,
        t.clientY
      )) {
        this.cancelTouchDrag();
        return;
      }
      this.grabbedNode !== null && this.moveNode(this.grabbedNode, {
        x: t.clientX,
        y: t.clientY
      });
    });
    i(this, "onWindowTouchFinish", () => {
      this.cancelTouchDrag();
    });
    i(this, "reset", () => {
      this.canvas.graph.getAllNodeIds().forEach((e) => {
        const { element: t } = this.canvas.graph.getNode(e);
        t.removeEventListener("mousedown", this.onMouseDown), t.removeEventListener("touchstart", this.onTouchStart);
      }), this.maxNodePriority = 0;
    });
    i(this, "revert", () => {
      this.reset(), this.removeMouseDragListeners(), this.removeTouchDragListeners();
    });
    this.canvas = e, this.element = t, this.window = o, this.params = s, this.graph = e.graph, this.graph.onAfterNodeAdded.subscribe(this.onAfterNodeAdded), this.graph.onAfterNodeUpdated.subscribe(this.onAfterNodeUpdated), this.graph.onBeforeNodeRemoved.subscribe(this.onBeforeNodeRemoved), this.graph.onBeforeClear.subscribe(this.reset), this.canvas.onBeforeDestroy.subscribe(this.revert);
  }
  static configure(e, t, o, s) {
    new oe(e, t, o, s);
  }
  moveNode(e, t) {
    if (!this.graph.hasNode(e.nodeId))
      return;
    const o = this.calculateContentPoint(t), s = {
      x: o.x - e.dx,
      y: o.y - e.dy
    }, n = this.adjustNodeCoords(s);
    this.canvas.updateNode(e.nodeId, {
      x: n.x,
      y: n.y
    }), this.params.onNodeDrag(e.nodeId);
  }
  moveNodeOnTop(e) {
    if (this.params.moveOnTop) {
      if (this.maxNodePriority++, this.params.moveEdgesOnTop) {
        const t = this.maxNodePriority;
        this.maxNodePriority++, this.graph.getNodeAdjacentEdgeIds(e).forEach((s) => {
          this.canvas.updateEdge(s, { priority: t });
        });
      }
      this.canvas.updateNode(e, { priority: this.maxNodePriority });
    }
  }
  cancelMouseDrag() {
    this.grabbedNode !== null && this.graph.hasNode(this.grabbedNode.nodeId) && this.params.onNodeDragFinished(this.grabbedNode.nodeId), this.grabbedNode = null, k(this.element, null), this.removeMouseDragListeners();
  }
  removeMouseDragListeners() {
    this.window.removeEventListener("mouseup", this.onWindowMouseUp), this.window.removeEventListener("mousemove", this.onWindowMouseMove);
  }
  cancelTouchDrag() {
    if (this.grabbedNode !== null && this.graph.hasNode(this.grabbedNode.nodeId)) {
      const e = this.graph.getNode(this.grabbedNode.nodeId);
      this.params.onNodeDragFinished({
        nodeId: this.grabbedNode.nodeId,
        element: e.element,
        x: e.x,
        y: e.y
      });
    }
    this.grabbedNode = null, this.removeTouchDragListeners();
  }
  removeTouchDragListeners() {
    this.window.removeEventListener("touchmove", this.onWindowTouchMove), this.window.removeEventListener("touchend", this.onWindowTouchFinish), this.window.removeEventListener("touchcancel", this.onWindowTouchFinish);
  }
  updateMaxNodePriority(e) {
    const t = this.graph.getNode(e).priority;
    this.maxNodePriority = Math.max(this.maxNodePriority, t);
  }
  calculateContentPoint(e) {
    const t = this.element.getBoundingClientRect();
    return this.canvas.viewport.createContentCoords({
      x: e.x - t.x,
      y: e.y - t.y
    });
  }
  adjustNodeCoords(e) {
    const t = this.params.gridSize;
    if (t !== null) {
      const o = t / 2;
      return {
        x: Math.floor((e.x + o) / t) * t,
        y: Math.floor((e.y + o) / t) * t
      };
    }
    return e;
  }
}
const W = (r) => {
  const e = [], t = r.touches.length;
  for (let h = 0; h < t; h++)
    e.push([r.touches[h].clientX, r.touches[h].clientY]);
  const o = e.reduce(
    (h, d) => [h[0] + d[0], h[1] + d[1]],
    [0, 0]
  ), s = [o[0] / t, o[1] / t], a = e.map((h) => [h[0] - s[0], h[1] - s[1]]).reduce(
    (h, d) => h + Math.sqrt(d[0] * d[0] + d[1] * d[1]),
    0
  );
  return {
    x: s[0],
    y: s[1],
    scale: a / t,
    touchesCnt: t,
    touches: e
  };
};
class j {
  constructor(e, t, o, s) {
    i(this, "viewport");
    i(this, "prevTouches", null);
    i(this, "wheelFinishTimer", null);
    i(this, "transformInProgress", !1);
    i(this, "revert", () => {
      this.removeMouseDragListeners(), this.removeTouchDragListeners();
    });
    i(this, "onMouseDown", (e) => {
      this.params.mouseDownEventVerifier(e) && (k(this.element, this.params.shiftCursor), this.window.addEventListener("mousemove", this.onWindowMouseMove, {
        passive: !0
      }), this.window.addEventListener("mouseup", this.onWindowMouseUp, {
        passive: !0
      }), this.startRegisteredTransform());
    });
    i(this, "onWindowMouseMove", (e) => {
      const t = F(
        this.window,
        this.element,
        e.clientX,
        e.clientY
      );
      if (this.element === null || !t) {
        this.stopMouseDrag();
        return;
      }
      const o = -e.movementX, s = -e.movementY;
      this.moveViewport(o, s);
    });
    i(this, "onWindowMouseUp", (e) => {
      this.params.mouseUpEventVerifier(e) && this.stopMouseDrag();
    });
    i(this, "onWheelScroll", (e) => {
      if (!this.params.mouseWheelEventVerifier(e))
        return;
      const { left: t, top: o } = this.element.getBoundingClientRect(), s = e.clientX - t, n = e.clientY - o, h = 1 / (e.deltaY < 0 ? this.params.wheelSensitivity : 1 / this.params.wheelSensitivity);
      this.wheelFinishTimer === null && this.params.onTransformStarted(), this.scaleViewport(h, s, n), this.wheelFinishTimer !== null && clearTimeout(this.wheelFinishTimer), this.wheelFinishTimer = setTimeout(() => {
        this.transformInProgress || this.params.onTransformFinished(), this.wheelFinishTimer = null;
      }, this.params.scaleWheelFinishTimeout);
    });
    i(this, "onTouchStart", (e) => {
      if (this.prevTouches !== null) {
        this.prevTouches = W(e);
        return;
      }
      this.prevTouches = W(e), this.window.addEventListener("touchmove", this.onWindowTouchMove, {
        passive: !0
      }), this.window.addEventListener("touchend", this.onWindowTouchFinish, {
        passive: !0
      }), this.window.addEventListener("touchcancel", this.onWindowTouchFinish, {
        passive: !0
      }), this.startRegisteredTransform();
    });
    i(this, "onWindowTouchMove", (e) => {
      const t = W(e);
      if (!t.touches.every(
        (s) => F(this.window, this.element, s[0], s[1])
      )) {
        this.stopTouchDrag();
        return;
      }
      if ((t.touchesCnt === 1 || t.touchesCnt === 2) && this.moveViewport(
        -(t.x - this.prevTouches.x),
        -(t.y - this.prevTouches.y)
      ), t.touchesCnt === 2) {
        const { left: s, top: n } = this.element.getBoundingClientRect(), a = this.prevTouches.x - s, h = this.prevTouches.y - n, c = 1 / (t.scale / this.prevTouches.scale);
        this.scaleViewport(c, a, h);
      }
      this.prevTouches = t;
    });
    i(this, "onWindowTouchFinish", (e) => {
      e.touches.length > 0 ? this.prevTouches = W(e) : this.stopTouchDrag();
    });
    i(this, "preventWheelScaleListener", (e) => {
      e.preventDefault();
    });
    this.canvas = e, this.element = t, this.window = o, this.params = s, this.element.addEventListener("wheel", this.preventWheelScaleListener, {
      passive: !1
    }), this.viewport = e.viewport, this.handleResize(), this.viewport.onAfterResize.subscribe(() => {
      this.handleResize();
    }), this.element.addEventListener("mousedown", this.onMouseDown, {
      passive: !0
    }), this.element.addEventListener("wheel", this.onWheelScroll, {
      passive: !0
    }), this.element.addEventListener("touchstart", this.onTouchStart, {
      passive: !0
    }), e.onBeforeDestroy.subscribe(this.revert);
  }
  static configure(e, t, o, s) {
    new j(e, t, o, s);
  }
  moveViewport(e, t) {
    const o = this.viewport.getViewportMatrix(), s = Be(o, e, t), { width: n, height: a } = this.viewport.getDimensions(), h = this.params.transformPreprocessor({
      prevTransform: o,
      nextTransform: s,
      canvasWidth: n,
      canvasHeight: a
    });
    this.performTransform(h);
  }
  scaleViewport(e, t, o) {
    const s = this.canvas.viewport.getViewportMatrix(), n = Ue(s, e, t, o), { width: a, height: h } = this.viewport.getDimensions(), d = this.params.transformPreprocessor({
      prevTransform: s,
      nextTransform: n,
      canvasWidth: a,
      canvasHeight: h
    });
    this.performTransform(d);
  }
  stopMouseDrag() {
    k(this.element, null), this.removeMouseDragListeners(), this.finishRegisteredTransform();
  }
  removeMouseDragListeners() {
    this.window.removeEventListener("mousemove", this.onWindowMouseMove), this.window.removeEventListener("mouseup", this.onWindowMouseUp);
  }
  stopTouchDrag() {
    this.prevTouches = null, this.removeTouchDragListeners(), this.finishRegisteredTransform();
  }
  removeTouchDragListeners() {
    this.window.removeEventListener("touchmove", this.onWindowTouchMove), this.window.removeEventListener("touchend", this.onWindowTouchFinish), this.window.removeEventListener("touchcancel", this.onWindowTouchFinish);
  }
  performTransform(e) {
    this.params.onBeforeTransformChange(), this.canvas.patchViewportMatrix(e), this.params.onTransformChange();
  }
  startRegisteredTransform() {
    this.transformInProgress = !0, this.params.onTransformStarted();
  }
  finishRegisteredTransform() {
    this.transformInProgress = !1, this.params.onTransformFinished();
  }
  handleResize() {
    const e = this.viewport.getViewportMatrix(), { width: t, height: o } = this.viewport.getDimensions(), s = this.params.transformPreprocessor({
      prevTransform: e,
      nextTransform: e,
      canvasWidth: t,
      canvasHeight: o
    });
    this.params.onResizeTransformStarted(), this.canvas.patchViewportMatrix(s), this.params.onResizeTransformFinished();
  }
}
class se {
  constructor(e, t, o, s, n, a) {
    i(this, "nodeHorizontal");
    i(this, "nodeVertical");
    i(this, "viewport");
    i(this, "currentScale");
    i(this, "loadedArea", {
      xFrom: 1 / 0,
      xTo: 1 / 0,
      yFrom: 1 / 0,
      yTo: 1 / 0
    });
    i(this, "updateLoadedArea", (e) => {
      this.loadedArea = {
        xFrom: e.x,
        xTo: e.x + e.width,
        yFrom: e.y,
        yTo: e.y + e.height
      };
    });
    i(this, "onAfterViewportUpdated", () => {
      this.userTransformInProgress || this.loadAreaAroundViewport();
    });
    i(this, "userTransformInProgress", !1);
    this.canvas = e, this.element = t, this.window = o, this.trigger = n, this.params = a, this.nodeHorizontal = this.params.nodeVerticalRadius, this.nodeVertical = this.params.nodeHorizontalRadius, this.viewport = e.viewport, this.currentScale = this.viewport.getViewportMatrix().scale, this.scheduleLoadAreaAroundViewport(), this.viewport.onAfterResize.subscribe(() => {
      this.scheduleLoadAreaAroundViewport();
    });
    const h = {
      ...s,
      onResizeTransformStarted: () => {
        this.userTransformInProgress = !0, s.onResizeTransformStarted();
      },
      onResizeTransformFinished: () => {
        this.userTransformInProgress = !1, s.onResizeTransformFinished();
      },
      onBeforeTransformChange: () => {
        this.userTransformInProgress = !0, s.onBeforeTransformChange();
      },
      onTransformChange: () => {
        this.userTransformInProgress = !1;
        const d = this.currentScale;
        this.currentScale = this.viewport.getViewportMatrix().scale, d !== this.currentScale && this.scheduleEnsureViewportAreaLoaded(), s.onTransformChange();
      },
      onTransformFinished: () => {
        this.scheduleLoadAreaAroundViewport(), s.onTransformFinished();
      }
    };
    j.configure(
      e,
      this.element,
      this.window,
      h
    ), this.trigger.subscribe(this.updateLoadedArea), this.canvas.viewport.onAfterUpdated.subscribe(this.onAfterViewportUpdated);
  }
  static configure(e, t, o, s, n, a) {
    new se(
      e,
      t,
      o,
      s,
      n,
      a
    );
  }
  scheduleLoadAreaAroundViewport() {
    setTimeout(() => {
      this.loadAreaAroundViewport();
    });
  }
  scheduleEnsureViewportAreaLoaded() {
    setTimeout(() => {
      const { width: e, height: t } = this.viewport.getDimensions(), { scale: o, x: s, y: n } = this.viewport.getViewportMatrix(), a = e * o, h = t * o, d = s - this.nodeHorizontal, c = n - this.nodeVertical, g = s + a + this.nodeHorizontal, u = n + h + this.nodeVertical;
      this.loadedArea.xFrom < d && this.loadedArea.xTo > g && this.loadedArea.yFrom < c && this.loadedArea.yTo > u || this.loadAreaAroundViewport();
    });
  }
  loadAreaAroundViewport() {
    const { width: e, height: t } = this.viewport.getDimensions(), { scale: o, x: s, y: n } = this.viewport.getViewportMatrix(), a = e * o, h = t * o, d = s - a - this.nodeHorizontal, c = n - h - this.nodeVertical, g = 3 * a + 2 * this.nodeHorizontal, u = 3 * h + 2 * this.nodeVertical;
    this.trigger.emit({
      x: d,
      y: c,
      width: g,
      height: u
    });
  }
}
const Bt = () => {
  const r = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  return r.style.position = "absolute", r.style.inset = "0", r;
}, Ut = () => {
  const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  return r.setAttribute("fill", "url(#pattern)"), r;
}, Ot = () => {
  const r = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "pattern"
  );
  return r.setAttribute("id", "pattern"), r;
};
class ie {
  constructor(e, t, o) {
    i(this, "svg", Bt());
    i(this, "patternRenderingRectangle", Ut());
    i(this, "pattern", Ot());
    i(this, "patternContent");
    i(this, "tileWidth");
    i(this, "tileHeight");
    i(this, "halfTileWidth");
    i(this, "halfTileHeight");
    i(this, "maxViewportScale");
    i(this, "visible", !1);
    i(this, "onAfterTransformUpdated", () => {
      const e = this.canvas.viewport.getContentMatrix(), t = e.x - this.halfTileWidth * e.scale, o = e.y - this.halfTileHeight * e.scale, s = `matrix(${e.scale}, 0, 0, ${e.scale}, ${t}, ${o})`;
      this.pattern.setAttribute("patternTransform", s), this.updateVisibility();
    });
    this.canvas = e, this.backgroundHost = o, this.tileWidth = t.tileWidth, this.tileHeight = t.tileHeight, this.halfTileWidth = this.tileWidth / 2, this.halfTileHeight = this.tileHeight / 2, this.patternContent = t.renderer, this.maxViewportScale = t.maxViewportScale;
    const s = `translate(${this.halfTileWidth}, ${this.halfTileHeight})`;
    this.patternContent.setAttribute("transform", s), this.pattern.appendChild(this.patternContent);
    const n = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    n.appendChild(this.pattern), this.svg.appendChild(n), this.svg.appendChild(this.patternRenderingRectangle), this.updateDimensions(), this.canvas.viewport.onAfterResize.subscribe(() => {
      this.updateDimensions();
    }), this.canvas.viewport.onAfterUpdated.subscribe(this.onAfterTransformUpdated), this.onAfterTransformUpdated();
  }
  static configure(e, t, o) {
    new ie(e, t, o);
  }
  updateVisibility() {
    const { scale: e } = this.canvas.viewport.getViewportMatrix(), t = e > this.maxViewportScale;
    t && this.visible ? (this.visible = !1, this.backgroundHost.removeChild(this.svg)) : !t && !this.visible && (this.visible = !0, this.backgroundHost.appendChild(this.svg));
  }
  updateDimensions() {
    const { width: e, height: t } = this.canvas.viewport.getDimensions();
    this.svg.setAttribute("width", `${e}`), this.svg.setAttribute("height", `${t}`), this.patternRenderingRectangle.setAttribute("width", `${e}`), this.patternRenderingRectangle.setAttribute("height", `${t}`);
    const o = this.tileWidth / e, s = this.tileHeight / t;
    this.pattern.setAttribute("width", `${o}`), this.pattern.setAttribute("height", `${s}`);
  }
}
class ne {
  constructor(e, t, o, s, n) {
    i(this, "overlayCanvas");
    i(this, "staticPortId", null);
    i(this, "isTargetDragging", !0);
    i(this, "onEdgeCreated", (e) => {
      this.params.onAfterEdgeCreated(e);
    });
    this.canvas = e, this.overlayLayer = t, this.viewportStore = o, this.window = s, this.params = n, this.overlayCanvas = We(
      this.overlayLayer,
      this.viewportStore,
      this.window
    ), G.configure(
      this.canvas,
      this.overlayLayer,
      this.window,
      {
        mouseDownEventVerifier: this.params.mouseDownEventVerifier,
        mouseUpEventVerifier: this.params.mouseUpEventVerifier,
        onStopDrag: () => {
          this.resetDragState();
        },
        onPortPointerDown: (a, h) => {
          const d = this.params.connectionTypeResolver(a);
          return d === null ? !1 : (this.grabPort(a, h, d), !0);
        },
        onPointerMove: (a) => {
          this.moveDraggingPort(a);
        },
        onPointerUp: (a) => {
          this.tryCreateConnection(a);
        }
      }
    );
  }
  static configure(e, t, o, s, n) {
    new ne(
      e,
      t,
      o,
      s,
      n
    );
  }
  grabPort(e, t, o) {
    const s = this.canvas.graph.getPort(e);
    this.staticPortId = e;
    const n = s.element.getBoundingClientRect(), a = n.x + n.width / 2, h = n.y + n.height / 2, d = this.overlayLayer.getBoundingClientRect(), c = this.canvas.viewport.createContentCoords({
      x: a - d.x,
      y: h - d.y
    }), g = this.canvas.viewport.createContentCoords({
      x: t.x - d.x,
      y: t.y - d.y
    }), u = {
      overlayNodeId: M.StaticNodeId,
      portCoords: c,
      portDirection: s.direction
    }, l = {
      overlayNodeId: M.DraggingNodeId,
      portCoords: g,
      portDirection: this.params.dragPortDirection
    };
    this.isTargetDragging = o === "direct";
    const [p, y] = this.isTargetDragging ? [u, l] : [l, u];
    this.overlayCanvas.addNode(H(p)), this.overlayCanvas.addNode(H(y)), this.overlayCanvas.addEdge({
      from: p.overlayNodeId,
      to: y.overlayNodeId,
      shape: this.params.edgeShapeFactory(M.EdgeId)
    });
  }
  resetDragState() {
    this.staticPortId = null, this.isTargetDragging = !0, this.overlayCanvas.clear();
  }
  tryCreateConnection(e) {
    const t = Pe(this.canvas.graph, e), o = this.staticPortId;
    if (t === null) {
      this.params.onEdgeCreationInterrupted({
        staticPortId: o,
        isDirect: this.isTargetDragging
      });
      return;
    }
    const s = this.isTargetDragging ? o : t, n = this.isTargetDragging ? t : o, a = { from: s, to: n }, h = this.params.connectionPreprocessor(a);
    h !== null ? (this.canvas.graph.onAfterEdgeAdded.subscribe(this.onEdgeCreated), this.canvas.addEdge(h), this.canvas.graph.onAfterEdgeAdded.unsubscribe(this.onEdgeCreated)) : this.params.onEdgeCreationPrevented(a);
  }
  moveDraggingPort(e) {
    const t = this.overlayLayer.getBoundingClientRect(), o = this.canvas.viewport.createContentCoords({
      x: e.x - t.x,
      y: e.y - t.y
    });
    this.overlayCanvas.updateNode(M.DraggingNodeId, {
      x: o.x,
      y: o.y
    });
  }
}
class ae {
  constructor(e, t, o, s, n) {
    i(this, "overlayCanvas");
    i(this, "staticPortId", null);
    i(this, "isTargetDragging", !0);
    i(this, "draggingEdgePayload", null);
    i(this, "onEdgeReattached", (e) => {
      this.params.onAfterEdgeReattached(e);
    });
    this.canvas = e, this.overlayLayer = t, this.viewportStore = o, this.window = s, this.params = n, this.overlayCanvas = We(
      this.overlayLayer,
      this.viewportStore,
      this.window
    ), G.configure(
      this.canvas,
      this.overlayLayer,
      this.window,
      {
        mouseDownEventVerifier: this.params.mouseDownEventVerifier,
        mouseUpEventVerifier: this.params.mouseUpEventVerifier,
        onStopDrag: () => {
          this.resetDragState();
        },
        onPortPointerDown: (a, h) => this.tryStartEdgeDragging(a, h),
        onPointerMove: (a) => {
          this.moveDraggingPort(a);
        },
        onPointerUp: (a) => {
          this.tryCreateConnection(a);
        }
      }
    );
  }
  static configure(e, t, o, s, n) {
    new ae(
      e,
      t,
      o,
      s,
      n
    );
  }
  tryStartEdgeDragging(e, t) {
    const o = this.params.draggingEdgeResolver(e);
    if (o === null || !this.canvas.graph.hasEdge(o))
      return !1;
    const s = this.canvas.graph.getEdge(o), n = e === s.from, a = e === s.to, h = n ? s.to : s.from;
    this.staticPortId = h, this.isTargetDragging = a;
    const d = this.canvas.graph.getPort(e), c = this.canvas.graph.getPort(h), g = c.element.getBoundingClientRect(), u = {
      x: g.x + g.width / 2,
      y: g.y + g.height / 2
    }, l = this.overlayLayer.getBoundingClientRect(), p = this.canvas.viewport.createContentCoords({
      x: u.x - l.x,
      y: u.y - l.y
    }), y = this.canvas.viewport.createContentCoords({
      x: t.x - l.x,
      y: t.y - l.y
    });
    this.draggingEdgePayload = {
      id: o,
      from: s.from,
      to: s.to,
      shape: s.shape,
      priority: s.priority
    }, this.canvas.removeEdge(o);
    const w = {
      overlayNodeId: M.StaticNodeId,
      portCoords: p,
      portDirection: c.direction
    }, f = {
      overlayNodeId: M.DraggingNodeId,
      portCoords: y,
      portDirection: d.direction
    }, [m, A] = this.isTargetDragging ? [w, f] : [f, w];
    this.overlayCanvas.addNode(H(m)), this.overlayCanvas.addNode(H(A));
    const N = this.params.draggingEdgeShapeFactory !== null ? this.params.draggingEdgeShapeFactory(M.EdgeId) : s.shape;
    return this.overlayCanvas.addEdge({
      id: M.EdgeId,
      from: m.overlayNodeId,
      to: A.overlayNodeId,
      shape: N
    }), !0;
  }
  resetDragState() {
    this.draggingEdgePayload = null, this.staticPortId = null, this.isTargetDragging = !0, this.overlayCanvas.clear();
  }
  moveDraggingPort(e) {
    const t = this.overlayLayer.getBoundingClientRect(), o = {
      x: e.x - t.x,
      y: e.y - t.y
    }, s = this.canvas.viewport.createContentCoords(o);
    this.overlayCanvas.updateNode(M.DraggingNodeId, {
      x: s.x,
      y: s.y
    });
  }
  tryCreateConnection(e) {
    const t = Pe(this.canvas.graph, e);
    if (this.overlayCanvas.removeEdge(M.EdgeId), t === null) {
      const d = this.draggingEdgePayload;
      this.params.onEdgeReattachInterrupted({
        id: d.id,
        from: d.from,
        to: d.to,
        shape: d.shape,
        priority: d.priority
      });
      return;
    }
    const [o, s] = this.isTargetDragging ? [this.staticPortId, t] : [t, this.staticPortId], n = this.draggingEdgePayload, a = {
      id: n.id,
      from: o,
      to: s,
      shape: n.shape,
      priority: n.priority
    }, h = this.params.connectionPreprocessor(a);
    if (h !== null)
      this.canvas.graph.onAfterEdgeAdded.subscribe(this.onEdgeReattached), this.canvas.addEdge(h), this.canvas.graph.onAfterEdgeAdded.unsubscribe(this.onEdgeReattached);
    else {
      const d = this.draggingEdgePayload;
      this.params.onEdgeReattachPrevented({
        id: d.id,
        from: d.from,
        to: d.to,
        shape: d.shape,
        priority: d.priority
      });
    }
  }
}
class he {
  constructor(e, t) {
    this.applier = e, this.trigger = t, this.trigger.subscribe(() => {
      this.applier.apply();
    });
  }
  static configure(e, t) {
    new he(e, t);
  }
}
class de {
  constructor(e, t, o) {
    i(this, "applyScheduled", !1);
    i(this, "apply", () => {
      this.applyScheduled = !1, this.applier.apply();
    });
    this.graph = e, this.applier = t, this.defererFn = o, this.graph.onAfterNodeAdded.subscribe(() => {
      this.scheduleApply();
    }), this.graph.onBeforeNodeRemoved.subscribe(() => {
      this.scheduleApply();
    }), this.graph.onAfterEdgeAdded.subscribe(() => {
      this.scheduleApply();
    }), this.graph.onBeforeEdgeRemoved.subscribe(() => {
      this.scheduleApply();
    });
  }
  static configure(e, t, o) {
    new de(
      e,
      t,
      o
    );
  }
  scheduleApply() {
    this.applyScheduled || (this.applyScheduled = !0, this.defererFn(this.apply));
  }
}
class Wt {
  static configure(e, t) {
    const o = t.applyOn, s = new Vt(e, t.algorithm, {
      staticNodeResolver: t.staticNodeResolver,
      onBeforeApplied: t.onBeforeApplied,
      onAfterApplied: t.onAfterApplied
    });
    switch (o.type) {
      case "trigger": {
        he.configure(
          s,
          o.trigger
        );
        break;
      }
      case "topologyChangeSchedule": {
        de.configure(
          e.graph,
          s,
          o.schedule
        );
        break;
      }
    }
  }
}
class zt {
  constructor(e, t) {
    i(this, "previousTimeStamp");
    i(this, "step", (e) => {
      if (this.previousTimeStamp === void 0)
        this.previousTimeStamp = e;
      else {
        const t = (e - this.previousTimeStamp) / 1e3;
        this.previousTimeStamp = e, this.callback(t);
      }
      this.win.requestAnimationFrame(this.step);
    });
    this.win = e, this.callback = t, this.win.requestAnimationFrame(this.step);
  }
}
class ce {
  constructor(e, t, o) {
    i(this, "applier");
    i(this, "step", (e) => {
      this.applier.apply(e);
    });
    this.win = o, this.applier = new $t(e, t.algorithm, {
      staticNodeResolver: t.staticNodeResolver,
      onBeforeApplied: t.onBeforeApplied,
      onAfterApplied: t.onAfterApplied
    }), new zt(this.win, this.step);
  }
  static configure(e, t, o) {
    new ce(e, t, o);
  }
}
const kt = () => {
  const r = document.createElement("div");
  return r.style.width = "100%", r.style.height = "100%", r.style.position = "relative", r;
}, Q = () => {
  const r = document.createElement("div");
  return r.style.position = "absolute", r.style.inset = "0", r;
}, ve = () => {
  const r = Q();
  return r.style.pointerEvents = "none", r;
};
class Ht {
  constructor(e) {
    i(this, "background", Q());
    i(this, "main", Q());
    i(this, "overlayConnectablePorts", ve());
    i(this, "overlayDraggableEdges", ve());
    i(this, "host", kt());
    this.element = e, this.element.appendChild(this.host), this.host.appendChild(this.background), this.host.appendChild(this.main), this.host.appendChild(this.overlayConnectablePorts), this.host.appendChild(this.overlayDraggableEdges);
  }
  destroy() {
    this.host.removeChild(this.background), this.host.removeChild(this.main), this.host.removeChild(this.overlayConnectablePorts), this.host.removeChild(this.overlayDraggableEdges), this.element.removeChild(this.host);
  }
}
const Yt = (r) => {
  var p, y, w, f, m, A;
  const e = ((p = r.events) == null ? void 0 : p.onNodeDragStarted) ?? (() => {
  }), t = ((y = r.events) == null ? void 0 : y.onNodeDrag) ?? (() => {
  }), o = r.nodeDragVerifier ?? (() => !0), s = ((w = r.events) == null ? void 0 : w.onNodeDragFinished) ?? (() => {
  }), n = r.moveOnTop !== !1, a = r.moveEdgesOnTop !== !1 && n, h = (f = r.mouse) == null ? void 0 : f.dragCursor, d = h !== void 0 ? h : "grab", c = (m = r.mouse) == null ? void 0 : m.mouseDownEventVerifier, g = c !== void 0 ? c : (N) => N.button === 0, u = (A = r.mouse) == null ? void 0 : A.mouseUpEventVerifier, l = u !== void 0 ? u : (N) => N.button === 0;
  return {
    moveOnTop: n,
    moveEdgesOnTop: a,
    dragCursor: d,
    gridSize: r.gridSize ?? null,
    mouseDownEventVerifier: g,
    mouseUpEventVerifier: l,
    onNodeDragStarted: e,
    onNodeDrag: t,
    nodeDragVerifier: o,
    onNodeDragFinished: s
  };
}, Xt = (r) => {
  const e = r.minX !== null ? r.minX : -1 / 0, t = r.maxX !== null ? r.maxX : 1 / 0, o = r.minY !== null ? r.minY : -1 / 0, s = r.maxY !== null ? r.maxY : 1 / 0;
  return (n) => {
    let a = n.nextTransform.x, h = n.nextTransform.y;
    a < e && a < n.prevTransform.x && (a = Math.min(n.prevTransform.x, e));
    const d = n.canvasWidth * n.prevTransform.scale, c = t - d;
    a > c && a > n.prevTransform.x && (a = Math.max(n.prevTransform.x, c)), h < o && h < n.prevTransform.y && (h = Math.min(n.prevTransform.y, o));
    const g = n.canvasHeight * n.prevTransform.scale, u = s - g;
    return h > u && h > n.prevTransform.y && (h = Math.max(n.prevTransform.y, u)), { scale: n.nextTransform.scale, x: a, y: h };
  };
}, Gt = (r) => {
  const e = r.maxContentScale, t = r.minContentScale, o = e !== null ? 1 / e : 0, s = t !== null ? 1 / t : 1 / 0;
  return (n) => {
    const a = n.prevTransform, h = n.nextTransform;
    let d = h.scale, c = h.x, g = h.y;
    if (h.scale > s && h.scale > a.scale) {
      d = Math.max(a.scale, s), c = a.x, g = a.y;
      const u = (d - a.scale) / (h.scale - a.scale);
      c = a.x + (h.x - a.x) * u, g = a.y + (h.y - a.y) * u;
    }
    if (h.scale < o && h.scale < a.scale) {
      d = Math.min(a.scale, o), c = a.x, g = a.y;
      const u = (d - a.scale) / (h.scale - a.scale);
      c = a.x + (h.x - a.x) * u, g = a.y + (h.y - a.y) * u;
    }
    return {
      scale: d,
      x: c,
      y: g
    };
  };
}, jt = (r) => (e) => r.reduce(
  (t, o) => o({
    prevTransform: e.prevTransform,
    nextTransform: t,
    canvasWidth: e.canvasWidth,
    canvasHeight: e.canvasHeight
  }),
  e.nextTransform
), xe = (r) => {
  if (typeof r == "function")
    return r;
  switch (r.type) {
    case "scale-limit":
      return Gt({
        minContentScale: r.minContentScale ?? 0,
        maxContentScale: r.maxContentScale ?? 1 / 0
      });
    case "shift-limit":
      return Xt({
        minX: r.minX ?? -1 / 0,
        maxX: r.maxX ?? 1 / 0,
        minY: r.minY ?? -1 / 0,
        maxY: r.maxY ?? 1 / 0
      });
  }
}, me = (r) => {
  var y, w, f, m, A, N, C, T, I, V, $, ge;
  const e = (y = r == null ? void 0 : r.scale) == null ? void 0 : y.mouseWheelSensitivity, t = e !== void 0 ? e : 1.2, o = r == null ? void 0 : r.transformPreprocessor;
  let s;
  o !== void 0 ? Array.isArray(o) ? s = jt(
    o.map(
      (D) => xe(D)
    )
  ) : s = xe(o) : s = (D) => D.nextTransform;
  const n = ((w = r == null ? void 0 : r.shift) == null ? void 0 : w.cursor) !== void 0 ? r.shift.cursor : "grab", a = ((f = r == null ? void 0 : r.events) == null ? void 0 : f.onBeforeTransformChange) ?? (() => {
  }), h = ((m = r == null ? void 0 : r.events) == null ? void 0 : m.onTransformChange) ?? (() => {
  }), d = (A = r == null ? void 0 : r.shift) == null ? void 0 : A.mouseDownEventVerifier, c = d !== void 0 ? d : (D) => D.button === 0, g = (N = r == null ? void 0 : r.shift) == null ? void 0 : N.mouseUpEventVerifier, u = g !== void 0 ? g : (D) => D.button === 0, l = (C = r == null ? void 0 : r.scale) == null ? void 0 : C.mouseWheelEventVerifier, p = l !== void 0 ? l : () => !0;
  return {
    wheelSensitivity: t,
    onTransformStarted: ((T = r == null ? void 0 : r.events) == null ? void 0 : T.onTransformStarted) ?? (() => {
    }),
    onTransformFinished: ((I = r == null ? void 0 : r.events) == null ? void 0 : I.onTransformFinished) ?? (() => {
    }),
    onBeforeTransformChange: a,
    onTransformChange: h,
    transformPreprocessor: s,
    shiftCursor: n,
    mouseDownEventVerifier: c,
    mouseUpEventVerifier: u,
    mouseWheelEventVerifier: p,
    scaleWheelFinishTimeout: ((V = r == null ? void 0 : r.scale) == null ? void 0 : V.wheelFinishTimeout) ?? 500,
    onResizeTransformStarted: (($ = r == null ? void 0 : r.events) == null ? void 0 : $.onResizeTransformStarted) ?? (() => {
    }),
    onResizeTransformFinished: ((ge = r == null ? void 0 : r.events) == null ? void 0 : ge.onResizeTransformFinished) ?? (() => {
    })
  };
}, Jt = (r, e) => {
  const t = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  return t.setAttribute("cx", "0"), t.setAttribute("cy", "0"), t.setAttribute("r", `${r}`), t.setAttribute("fill", `${e}`), t;
}, Kt = (r) => r instanceof SVGElement ? r : Jt(
  (r == null ? void 0 : r.radius) ?? 1.5,
  (r == null ? void 0 : r.color) ?? "#d8d8d8"
), Qt = (r) => {
  const e = r.tileDimensions, t = (e == null ? void 0 : e.width) ?? 25, o = (e == null ? void 0 : e.height) ?? 25, s = Kt(r.renderer ?? {});
  return {
    tileWidth: t,
    tileHeight: o,
    renderer: s,
    maxViewportScale: r.maxViewportScale ?? 10
  };
}, le = (r) => {
  if (typeof r == "function")
    return r;
  switch (r.type) {
    case "straight":
      return () => new Ct({
        color: r.color,
        width: r.width,
        arrowLength: r.arrowLength,
        arrowOffset: r.arrowOffset,
        arrowRenderer: r.arrowRenderer,
        hasSourceArrow: r.hasSourceArrow,
        hasTargetArrow: r.hasTargetArrow,
        cycleSquareSide: r.cycleSquareSide,
        roundness: r.roundness,
        detourDistance: r.detourDistance,
        detourDirection: r.detourDirection
      });
    case "horizontal":
      return () => new Pt({
        color: r.color,
        width: r.width,
        arrowLength: r.arrowLength,
        arrowOffset: r.arrowOffset,
        arrowRenderer: r.arrowRenderer,
        hasSourceArrow: r.hasSourceArrow,
        hasTargetArrow: r.hasTargetArrow,
        cycleSquareSide: r.cycleSquareSide,
        roundness: r.roundness,
        detourDistance: r.detourDistance
      });
    case "vertical":
      return () => new Tt({
        color: r.color,
        width: r.width,
        arrowLength: r.arrowLength,
        arrowOffset: r.arrowOffset,
        arrowRenderer: r.arrowRenderer,
        hasSourceArrow: r.hasSourceArrow,
        hasTargetArrow: r.hasTargetArrow,
        cycleSquareSide: r.cycleSquareSide,
        roundness: r.roundness,
        detourDistance: r.detourDistance
      });
    case "direct":
      return () => new Le({
        color: r.color,
        width: r.width,
        arrowLength: r.arrowLength,
        arrowRenderer: r.arrowRenderer,
        hasSourceArrow: r.hasSourceArrow,
        hasTargetArrow: r.hasTargetArrow,
        sourceOffset: r.sourceOffset,
        targetOffset: r.targetOffset
      });
    default:
      return () => new Nt({
        color: r.color,
        width: r.width,
        arrowLength: r.arrowLength,
        arrowRenderer: r.arrowRenderer,
        hasSourceArrow: r.hasSourceArrow,
        hasTargetArrow: r.hasTargetArrow,
        cycleRadius: r.cycleRadius,
        smallCycleRadius: r.smallCycleRadius,
        curvature: r.curvature,
        detourDistance: r.detourDistance,
        detourDirection: r.detourDirection
      });
  }
}, Zt = (r, e, t) => {
  var c, g, u;
  const o = () => "direct", s = (l) => l, n = (l) => l.button === 0, a = () => {
  }, h = () => {
  }, d = () => {
  };
  return {
    connectionTypeResolver: r.connectionTypeResolver ?? o,
    connectionPreprocessor: r.connectionPreprocessor ?? s,
    mouseDownEventVerifier: r.mouseDownEventVerifier ?? n,
    mouseUpEventVerifier: r.mouseUpEventVerifier ?? n,
    onAfterEdgeCreated: ((c = r.events) == null ? void 0 : c.onAfterEdgeCreated) ?? a,
    onEdgeCreationInterrupted: ((g = r.events) == null ? void 0 : g.onEdgeCreationInterrupted) ?? d,
    onEdgeCreationPrevented: ((u = r.events) == null ? void 0 : u.onEdgeCreationPrevented) ?? h,
    dragPortDirection: r.dragPortDirection ?? t,
    edgeShapeFactory: r.edgeShape !== void 0 ? le(r.edgeShape) : e
  };
}, _t = (r, e) => {
  var c, g, u;
  const t = (l) => l, o = (l) => l.button === 0 && l.ctrlKey, s = (l) => l.button === 0, n = (l) => {
    const p = e.getPortAdjacentEdgeIds(l);
    return p.length > 0 ? p[p.length - 1] : null;
  }, a = () => {
  }, h = () => {
  }, d = () => {
  };
  return {
    connectionPreprocessor: r.connectionPreprocessor ?? t,
    mouseDownEventVerifier: r.mouseDownEventVerifier ?? o,
    mouseUpEventVerifier: r.mouseUpEventVerifier ?? s,
    draggingEdgeResolver: r.draggingEdgeResolver ?? n,
    draggingEdgeShapeFactory: r.draggingEdgeShape !== void 0 ? le(r.draggingEdgeShape) : null,
    onAfterEdgeReattached: ((c = r.events) == null ? void 0 : c.onAfterEdgeReattached) ?? a,
    onEdgeReattachInterrupted: ((g = r.events) == null ? void 0 : g.onEdgeReattachInterrupted) ?? d,
    onEdgeReattachPrevented: ((u = r.events) == null ? void 0 : u.onEdgeReattachPrevented) ?? h
  };
}, qt = (r) => ({
  nodeVerticalRadius: r.nodeContainingRadius.vertical,
  nodeHorizontalRadius: r.nodeContainingRadius.horizontal
}), er = (r) => {
  var e, t;
  return {
    onAfterNodeDetached: ((e = r == null ? void 0 : r.events) == null ? void 0 : e.onAfterNodeDetached) ?? (() => {
    }),
    onBeforeNodeAttached: ((t = r == null ? void 0 : r.events) == null ? void 0 : t.onBeforeNodeAttached) ?? (() => {
    })
  };
};
class tr extends Error {
  constructor() {
    super(...arguments);
    i(this, "name", "CanvasBuilderError");
  }
}
class ze {
  constructor(e, t, o) {
    i(this, "dt");
    i(this, "nodeMass");
    i(this, "edgeEquilibriumLength");
    i(this, "edgeStiffness");
    i(this, "nodeForcesApplicationStrategy");
    i(this, "distanceVectorGenerator");
    this.graph = e, this.currentCoords = t, this.dt = o.dtSec, this.nodeMass = o.nodeMass, this.edgeEquilibriumLength = o.edgeEquilibriumLength, this.edgeStiffness = o.edgeStiffness, this.distanceVectorGenerator = o.distanceVectorGenerator, this.nodeForcesApplicationStrategy = o.nodeForcesApplicationStrategy;
  }
  apply() {
    let e = 0;
    const t = /* @__PURE__ */ new Map();
    return this.graph.getAllNodeIds().forEach((s) => {
      t.set(s, { x: 0, y: 0 });
    }), this.nodeForcesApplicationStrategy.apply(this.currentCoords, t), this.applyEdgeForces(t), this.currentCoords.forEach((s, n) => {
      const a = t.get(n), h = {
        x: a.x / this.nodeMass * this.dt,
        y: a.y / this.nodeMass * this.dt
      };
      e = Math.max(
        e,
        Math.sqrt(h.x * h.x + h.y * h.y)
      );
      const d = h.x * this.dt, c = h.y * this.dt;
      s.x += d, s.y += c;
    }), e;
  }
  applyEdgeForces(e) {
    this.graph.getAllEdgeIds().forEach((t) => {
      const o = this.graph.getEdge(t), s = this.graph.getPort(o.from), n = this.graph.getPort(o.to), a = this.currentCoords.get(s.nodeId), h = this.currentCoords.get(n.nodeId), d = this.distanceVectorGenerator.create(
        a,
        h
      ), g = (d.d - this.edgeEquilibriumLength) * this.edgeStiffness, u = d.ex * g, l = d.ey * g, p = e.get(s.nodeId), y = e.get(n.nodeId);
      p.x += u, p.y += l, y.x -= u, y.y -= l;
    });
  }
}
class ke {
  constructor(e) {
    i(this, "PI2", 2 * Math.PI);
    this.rand = e;
  }
  create(e, t) {
    const o = t.x - e.x, s = t.y - e.y, n = o * o + s * s;
    if (n === 0) {
      const c = this.PI2 * this.rand();
      return {
        ex: Math.cos(c),
        ey: Math.sin(c),
        d: 0
      };
    }
    const a = Math.sqrt(n), h = o / a, d = s / a;
    return { ex: h, ey: d, d: a };
  }
}
const He = (r) => {
  if (r.distance === 0)
    return r.maxForce;
  const e = r.coefficient * (r.sourceCharge * r.targetCharge / (r.distance * r.distance));
  return Math.min(e, r.maxForce);
};
class rr {
  constructor(e) {
    i(this, "nodeCharge");
    i(this, "distanceVectorGenerator");
    i(this, "maxForce");
    this.nodeCharge = e.nodeCharge, this.distanceVectorGenerator = e.distanceVectorGenerator, this.maxForce = e.maxForce;
  }
  apply(e, t) {
    const o = Array.from(t.keys()), s = o.length;
    for (let n = 0; n < s; n++) {
      const a = o[n];
      for (let h = n + 1; h < s; h++) {
        const d = o[h], c = e.get(a), g = e.get(d), u = this.distanceVectorGenerator.create(
          c,
          g
        ), l = He({
          coefficient: 1,
          sourceCharge: this.nodeCharge,
          targetCharge: this.nodeCharge,
          distance: u.d,
          maxForce: this.maxForce
        }), p = l * u.ex, y = l * u.ey, w = t.get(a), f = t.get(d);
        w.x -= p, w.y -= y, f.x += p, f.y += y;
      }
    }
  }
}
const or = (r) => {
  if (r.size === 0)
    return {
      centerX: 0,
      centerY: 0,
      radius: 0
    };
  let e = 1 / 0, t = -1 / 0, o = 1 / 0, s = -1 / 0;
  r.forEach((d) => {
    e = Math.min(e, d.x), t = Math.max(t, d.x), o = Math.min(o, d.y), s = Math.max(s, d.y);
  });
  const n = t - e, a = s - o, h = Math.max(n, a);
  return {
    centerX: (e + t) / 2,
    centerY: (o + s) / 2,
    radius: h / 2
  };
};
class sr {
  constructor(e) {
    i(this, "root");
    i(this, "leaves", /* @__PURE__ */ new Map());
    i(this, "coords");
    i(this, "areaRadiusThreshold");
    i(this, "nodeMass");
    i(this, "nodeCharge");
    i(this, "sortedParentNodes", []);
    this.coords = e.coords, this.areaRadiusThreshold = e.areaRadiusThreshold, this.nodeMass = e.nodeMass, this.nodeCharge = e.nodeCharge, this.root = {
      nodeIds: new Set(e.coords.keys()),
      box: e.box,
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
    let t = [this.root];
    for (; t.length > 0; ) {
      const o = [];
      for (; t.length > 0; ) {
        const s = t.pop();
        this.processNode(s).forEach((a) => {
          o.push(a);
        });
      }
      t = o;
    }
    this.sortedParentNodes.reverse().forEach((o) => {
      let s = 0, n = 0, a = 0, h = 0;
      o.lb !== null && (a += o.lb.totalMass, h += o.lb.totalCharge, s += o.lb.chargeCenter.x * o.lb.totalCharge, n += o.lb.chargeCenter.y * o.lb.totalCharge), o.lt !== null && (a += o.lt.totalMass, h += o.lt.totalCharge, s += o.lt.chargeCenter.x * o.lt.totalCharge, n += o.lt.chargeCenter.y * o.lt.totalCharge), o.rb !== null && (a += o.rb.totalMass, h += o.rb.totalCharge, s += o.rb.chargeCenter.x * o.rb.totalCharge, n += o.rb.chargeCenter.y * o.rb.totalCharge), o.rt !== null && (a += o.rt.totalMass, h += o.rt.totalCharge, s += o.rt.chargeCenter.x * o.rt.totalCharge, n += o.rt.chargeCenter.y * o.rt.totalCharge), o.totalMass = a, o.totalCharge = h, o.chargeCenter.x = s / h, o.chargeCenter.y = n / h;
    });
  }
  getRoot() {
    return this.root;
  }
  getLeaf(e) {
    return this.leaves.get(e);
  }
  processNode(e) {
    if (e.nodeIds.size < 2)
      return this.setLeaf(e), [];
    const { centerX: t, centerY: o, radius: s } = e.box;
    if (s < this.areaRadiusThreshold)
      return this.setLeaf(e), [];
    this.sortedParentNodes.push(e);
    const n = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Set(), c = s / 2;
    e.nodeIds.forEach((l) => {
      const { x: p, y } = this.coords.get(l);
      p < t ? y < o ? d.add(l) : h.add(l) : y < o ? a.add(l) : n.add(l), e.nodeIds.delete(l);
    });
    const g = {
      parent: e,
      lb: null,
      lt: null,
      rb: null,
      rt: null
    }, u = [];
    if (n.size > 0) {
      const l = {
        nodeIds: n,
        totalMass: 0,
        totalCharge: 0,
        chargeCenter: {
          x: 0,
          y: 0
        },
        box: {
          centerX: t + c,
          centerY: o + c,
          radius: c
        },
        ...g
      };
      e.rt = l, u.push(l);
    }
    if (a.size > 0) {
      const l = {
        nodeIds: a,
        totalMass: 0,
        totalCharge: 0,
        chargeCenter: {
          x: 0,
          y: 0
        },
        box: {
          centerX: t + c,
          centerY: o - c,
          radius: c
        },
        ...g
      };
      e.rb = l, u.push(l);
    }
    if (h.size > 0) {
      const l = {
        nodeIds: h,
        totalMass: 0,
        totalCharge: 0,
        chargeCenter: {
          x: 0,
          y: 0
        },
        box: {
          centerX: t - c,
          centerY: o + c,
          radius: c
        },
        ...g
      };
      e.lt = l, u.push(l);
    }
    if (d.size > 0) {
      const l = {
        nodeIds: d,
        totalMass: 0,
        totalCharge: 0,
        chargeCenter: {
          x: 0,
          y: 0
        },
        box: {
          centerX: t - c,
          centerY: o - c,
          radius: c
        },
        ...g
      };
      e.lb = l, u.push(l);
    }
    return u;
  }
  setLeaf(e) {
    e.totalMass = this.nodeMass * e.nodeIds.size, e.totalCharge = this.nodeCharge * e.nodeIds.size, e.chargeCenter = this.calculateLeafChargeCenter(e.nodeIds), e.nodeIds.forEach((t) => {
      this.leaves.set(t, e);
    });
  }
  calculateLeafChargeCenter(e) {
    if (e.size === 0)
      return {
        x: 0,
        y: 0
      };
    let t = 0, o = 0;
    return e.forEach((s) => {
      const n = this.coords.get(s);
      t += n.x, o += n.y;
    }), { x: t / e.size, y: o / e.size };
  }
}
class ir {
  constructor(e) {
    i(this, "areaRadiusThreshold");
    i(this, "nodeMass");
    i(this, "nodeCharge");
    i(this, "theta");
    i(this, "distanceVectorGenerator");
    i(this, "nodeForceCoefficient");
    i(this, "maxForce");
    this.areaRadiusThreshold = e.areaRadiusThreshold, this.nodeMass = e.nodeMass, this.nodeCharge = e.nodeCharge, this.theta = e.theta, this.distanceVectorGenerator = e.distanceVectorGenerator, this.nodeForceCoefficient = e.nodeForceCoefficient, this.maxForce = e.maxForce;
  }
  apply(e, t) {
    const o = or(e), s = new sr({
      box: o,
      coords: e,
      areaRadiusThreshold: this.areaRadiusThreshold,
      nodeMass: this.nodeMass,
      nodeCharge: this.nodeCharge
    });
    e.forEach((n, a) => {
      const h = this.calculateForceForNode(
        s.getLeaf(a),
        a,
        e
      ), d = t.get(a);
      this.applyForce(d, h);
    });
  }
  calculateForceForNode(e, t, o) {
    const s = o.get(t), n = { x: 0, y: 0 };
    e.nodeIds.forEach((h) => {
      if (h !== t) {
        const d = o.get(h), c = this.calculateNodeRepulsiveForce({
          sourceCharge: this.nodeCharge,
          targetCharge: this.nodeCharge,
          sourceCoords: d,
          targetCoords: s
        });
        this.applyForce(n, c);
      }
    });
    let a = e;
    for (; a !== null; ) {
      const h = a.parent;
      if (h !== null) {
        const d = this.distanceVectorGenerator.create(
          h.chargeCenter,
          s
        );
        h.box.radius * 2 < d.d * this.theta ? (this.tryApplyFarForce({
          totalForce: n,
          targetCoords: s,
          target: h.lb,
          current: a
        }), this.tryApplyFarForce({
          totalForce: n,
          targetCoords: s,
          target: h.rb,
          current: a
        }), this.tryApplyFarForce({
          totalForce: n,
          targetCoords: s,
          target: h.rt,
          current: a
        }), this.tryApplyFarForce({
          totalForce: n,
          targetCoords: s,
          target: h.lt,
          current: a
        })) : (this.tryApplyNearForce({
          totalForce: n,
          targetCoords: s,
          target: h.lb,
          current: a,
          nodesCoords: o
        }), this.tryApplyNearForce({
          totalForce: n,
          targetCoords: s,
          target: h.rb,
          current: a,
          nodesCoords: o
        }), this.tryApplyNearForce({
          totalForce: n,
          targetCoords: s,
          target: h.rt,
          current: a,
          nodesCoords: o
        }), this.tryApplyNearForce({
          totalForce: n,
          targetCoords: s,
          target: h.lt,
          current: a,
          nodesCoords: o
        }));
      }
      a = a.parent;
    }
    return n;
  }
  calculateExactForce(e, t, o) {
    const s = { x: 0, y: 0 }, n = [e];
    for (; n.length > 0; ) {
      const a = n.pop();
      a.nodeIds.forEach((h) => {
        const d = o.get(h), c = this.calculateNodeRepulsiveForce({
          sourceCharge: this.nodeCharge,
          targetCharge: this.nodeCharge,
          sourceCoords: d,
          targetCoords: t
        });
        this.applyForce(s, c);
      }), a.lb !== null && n.push(a.lb), a.rb !== null && n.push(a.rb), a.lt !== null && n.push(a.lt), a.rt !== null && n.push(a.rt);
    }
    return s;
  }
  calculateApproximateForce(e, t) {
    return this.calculateNodeRepulsiveForce({
      sourceCharge: this.nodeCharge,
      targetCharge: e.totalCharge,
      sourceCoords: e.chargeCenter,
      targetCoords: t
    });
  }
  calculateNodeRepulsiveForce(e) {
    const t = this.distanceVectorGenerator.create(
      e.sourceCoords,
      e.targetCoords
    ), o = He({
      coefficient: this.nodeForceCoefficient,
      sourceCharge: e.sourceCharge,
      targetCharge: e.targetCharge,
      distance: t.d,
      maxForce: this.maxForce
    });
    return {
      x: o * t.ex,
      y: o * t.ey
    };
  }
  applyForce(e, t) {
    e.x += t.x, e.y += t.y;
  }
  tryApplyFarForce(e) {
    if (e.target !== null && e.target !== e.current) {
      const t = this.calculateApproximateForce(
        e.target,
        e.targetCoords
      );
      this.applyForce(e.totalForce, t);
    }
  }
  tryApplyNearForce(e) {
    if (e.target !== null && e.target !== e.current) {
      const t = this.calculateExactForce(
        e.target,
        e.targetCoords,
        e.nodesCoords
      );
      this.applyForce(e.totalForce, t);
    }
  }
}
const Ye = (r) => r.theta !== 0 ? new ir({
  nodeCharge: r.nodeCharge,
  nodeForceCoefficient: r.nodeForceCoefficient,
  distanceVectorGenerator: r.distanceVectorGenerator,
  maxForce: r.maxForce,
  theta: r.theta,
  nodeMass: r.nodeMass,
  areaRadiusThreshold: r.areaRadiusThreshold
}) : new rr({
  nodeCharge: r.nodeCharge,
  nodeForceCoefficient: r.nodeForceCoefficient,
  distanceVectorGenerator: r.distanceVectorGenerator,
  maxForce: r.maxForce
});
class Xe {
  constructor(e) {
    i(this, "rand");
    i(this, "sparsity");
    this.rand = e.rand, this.sparsity = e.sparsity;
  }
  calculateCoordinates(e) {
    const { graph: t, viewport: o } = e, s = /* @__PURE__ */ new Map(), n = t.getAllNodeIds().filter((y) => {
      const w = t.getNode(y);
      return w.x === null || w.y === null;
    }), a = Math.sqrt(n.length) * this.sparsity, { width: h, height: d } = o.getDimensions(), c = { x: h / 2, y: d / 2 }, g = o.createContentCoords(c), u = a / 2, l = {
      x: g.x - u,
      y: g.y - u
    };
    return t.getAllNodeIds().forEach((y) => {
      const w = t.getNode(y);
      s.set(y, {
        x: w.x ?? l.x + a * this.rand(),
        y: w.y ?? l.y + a * this.rand()
      });
    }), s;
  }
}
class nr {
  constructor(e) {
    i(this, "distanceVectorGenerator");
    i(this, "nodeForcesApplicationStrategy");
    i(this, "fillerLayoutAlgorithm");
    i(this, "maxIterations");
    i(this, "dtSec");
    i(this, "nodeMass");
    i(this, "edgeEquilibriumLength");
    i(this, "edgeStiffness");
    i(this, "convergenceVelocity");
    this.maxIterations = e.maxIterations, this.dtSec = e.dtSec, this.nodeMass = e.nodeMass, this.edgeEquilibriumLength = e.edgeEquilibriumLength, this.edgeStiffness = e.edgeStiffness, this.convergenceVelocity = e.convergenceVelocity, this.distanceVectorGenerator = new ke(e.rand), this.nodeForcesApplicationStrategy = Ye({
      distanceVectorGenerator: this.distanceVectorGenerator,
      nodeCharge: e.nodeCharge,
      maxForce: e.maxForce,
      nodeForceCoefficient: e.nodeForceCoefficient,
      theta: e.barnesHutTheta,
      areaRadiusThreshold: e.barnesHutAreaRadiusThreshold,
      nodeMass: e.nodeMass
    }), this.fillerLayoutAlgorithm = new Xe({
      rand: e.rand,
      sparsity: e.edgeEquilibriumLength
    });
  }
  calculateCoordinates(e) {
    const { graph: t, viewport: o } = e, s = this.fillerLayoutAlgorithm.calculateCoordinates({
      graph: t,
      viewport: o
    });
    for (let n = 0; n < this.maxIterations && !(new ze(
      t,
      s,
      {
        distanceVectorGenerator: this.distanceVectorGenerator,
        nodeForcesApplicationStrategy: this.nodeForcesApplicationStrategy,
        dtSec: this.dtSec,
        nodeMass: this.nodeMass,
        edgeEquilibriumLength: this.edgeEquilibriumLength,
        edgeStiffness: this.edgeStiffness
      }
    ).apply() < this.convergenceVelocity); n++)
      ;
    return s;
  }
}
class ar {
  constructor(e) {
    i(this, "forest", /* @__PURE__ */ new Set());
    i(this, "remainingNodeIds");
    for (this.graph = e, this.remainingNodeIds = new Set(this.graph.getAllNodeIds()); this.remainingNodeIds.size > 0; ) {
      const [t] = this.remainingNodeIds;
      this.traverse(t);
    }
  }
  generate() {
    return this.forest;
  }
  traverse(e) {
    const t = {
      nodeId: e,
      children: /* @__PURE__ */ new Set()
    }, o = [];
    this.forest.add({ root: t, sequence: o });
    let s = [t];
    for (this.remainingNodeIds.delete(t.nodeId); s.length > 0; ) {
      const n = [];
      s.forEach((a) => {
        o.push(a);
        const h = this.graph.getNodeOutgoingEdgeIds(a.nodeId).map((g) => {
          const u = this.graph.getEdge(g);
          return this.graph.getPort(u.to).nodeId;
        }), d = this.graph.getNodeIncomingEdgeIds(a.nodeId).map((g) => {
          const u = this.graph.getEdge(g);
          return this.graph.getPort(u.from).nodeId;
        });
        (/* @__PURE__ */ new Set([
          ...h,
          ...d
        ])).forEach((g) => {
          if (!this.remainingNodeIds.has(g))
            return;
          this.remainingNodeIds.delete(g);
          const u = {
            nodeId: g,
            children: /* @__PURE__ */ new Set()
          };
          a.children.add(u), n.push(u);
        });
      }), s = n;
    }
  }
}
class hr {
  constructor(e) {
    this.params = e;
  }
  generate(e) {
    let t = 0;
    const o = [], s = e.length - 1, n = [];
    e.forEach((h, d) => {
      if (t += this.params.spaceAroundRadius, h.forEach((c, g) => {
        n[g] === void 0 ? n[g] = {
          start: t + c.start,
          end: t + c.end
        } : n[g].end = t + c.end;
      }), o.push(t), d !== s) {
        const c = e[d + 1], g = n.map((u) => ({
          start: u.start - t,
          end: u.end - t
        }));
        t += this.calculateMaxDiff(g, c);
      }
      t += this.params.spaceAroundRadius;
    });
    const a = t / 2;
    return {
      childOffsets: o.map((h) => h - a),
      subtreeSpans: n.map((h) => ({
        start: h.start - a,
        end: h.end - a
      }))
    };
  }
  calculateMaxDiff(e, t) {
    let o = 0;
    const s = Math.min(e.length, t.length);
    for (let n = 0; n < s; n++) {
      const a = e[n].end - t[n].start;
      o = Math.max(o, a);
    }
    return o - 2 * this.params.spaceAroundRadius;
  }
}
class dr {
  constructor(e, t) {
    i(this, "offsets", /* @__PURE__ */ new Map());
    i(this, "treeSpans", /* @__PURE__ */ new Map());
    this.tree = e;
    const o = t.spaceAroundRadius, s = new hr({
      spaceAroundRadius: o
    });
    [...this.tree.sequence].reverse().forEach((n) => {
      const a = Array.from(n.children).map(
        (c) => this.treeSpans.get(c.nodeId)
      ), h = s.generate(a);
      let d = 0;
      n.children.forEach((c) => {
        this.offsets.set(c.nodeId, h.childOffsets[d]), d++;
      }), this.treeSpans.set(n.nodeId, [
        { start: -o, end: o },
        ...h.subtreeSpans
      ]), n.children.forEach((c) => {
        this.treeSpans.delete(c.nodeId);
      });
    }), this.offsets.set(this.tree.root.nodeId, 0);
  }
  generate() {
    return this.offsets;
  }
}
class cr {
  constructor(e) {
    this.params = e;
  }
  calculateCoordinates(e) {
    const t = /* @__PURE__ */ new Map(), s = new ar(e.graph).generate();
    let n = 0;
    return s.forEach((a) => {
      t.set(a.root.nodeId, { x: n, y: 0 });
      const d = new dr(a, {
        spaceAroundRadius: this.params.layerSpace / 2
      }).generate();
      let c = [a.root];
      for (; c.length > 0; ) {
        const g = [];
        n += this.params.layerWidth, c.forEach((u) => {
          u.children.forEach((l) => {
            const p = t.get(u.nodeId).y;
            t.set(l.nodeId, {
              y: p + d.get(l.nodeId),
              x: n
            }), g.push(l);
          });
        }), c = g;
      }
    }), t.forEach((a, h) => {
      t.set(h, this.params.transform(a));
    }), t;
  }
}
class lr {
  constructor(e) {
    i(this, "distanceVectorGenerator");
    i(this, "nodeForcesApplicationStrategy");
    i(this, "convergenceVelocity");
    i(this, "maxTimeDeltaSec");
    i(this, "nodeMass");
    i(this, "edgeEquilibriumLength");
    i(this, "edgeStiffness");
    i(this, "fillerLayoutAlgorithm");
    this.convergenceVelocity = e.convergenceVelocity, this.maxTimeDeltaSec = e.maxTimeDeltaSec, this.nodeMass = e.nodeMass, this.edgeEquilibriumLength = e.edgeEquilibriumLength, this.edgeStiffness = e.edgeStiffness, this.distanceVectorGenerator = new ke(e.rand), this.nodeForcesApplicationStrategy = Ye({
      distanceVectorGenerator: this.distanceVectorGenerator,
      nodeCharge: e.nodeCharge,
      maxForce: e.maxForce,
      nodeForceCoefficient: e.nodeForceCoefficient,
      theta: e.barnesHutTheta,
      areaRadiusThreshold: e.barnesHutAreaRadiusThreshold,
      nodeMass: e.nodeMass
    }), this.fillerLayoutAlgorithm = new Xe({
      rand: e.rand,
      sparsity: e.edgeEquilibriumLength
    });
  }
  calculateNextCoordinates(e) {
    const { graph: t, viewport: o, dt: s } = e, n = this.fillerLayoutAlgorithm.calculateCoordinates({
      graph: t,
      viewport: o
    });
    return new ze(
      t,
      n,
      {
        distanceVectorGenerator: this.distanceVectorGenerator,
        nodeForcesApplicationStrategy: this.nodeForcesApplicationStrategy,
        dtSec: Math.min(s, this.maxTimeDeltaSec),
        nodeMass: this.nodeMass,
        edgeEquilibriumLength: this.edgeEquilibriumLength,
        edgeStiffness: this.edgeStiffness
      }
    ).apply() < this.convergenceVelocity && !t.getAllNodeIds().some((c) => {
      const g = t.getNode(c);
      return g.x === null || g.y === null;
    }) ? /* @__PURE__ */ new Map() : n;
  }
}
const Ge = (r) => {
  let e = 1779033703, t = 3144134277, o = 1013904242, s = 2773480762;
  for (let n = 0, a; n < r.length; n++)
    a = r.charCodeAt(n), e = t ^ Math.imul(e ^ a, 597399067), t = o ^ Math.imul(t ^ a, 2869860233), o = s ^ Math.imul(o ^ a, 951274213), s = e ^ Math.imul(s ^ a, 2716044179);
  return e = Math.imul(o ^ e >>> 18, 597399067), t = Math.imul(s ^ t >>> 22, 2869860233), o = Math.imul(e ^ o >>> 17, 951274213), s = Math.imul(t ^ s >>> 19, 2716044179), e ^= t ^ o ^ s, t ^= e, o ^= e, s ^= e, [e >>> 0, t >>> 0, o >>> 0, s >>> 0];
}, je = (r, e, t, o) => function() {
  r |= 0, e |= 0, t |= 0, o |= 0;
  const s = (r + e | 0) + o | 0;
  return o = o + 1 | 0, r = e ^ e >>> 9, e = t + (t << 3) | 0, t = t << 21 | t >>> 11, t = t + s | 0, (s >>> 0) / 4294967296;
}, E = Object.freeze({
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
}), gr = (r) => {
  var e, t;
  switch (r == null ? void 0 : r.type) {
    case "custom":
      return r.instance;
    default: {
      const o = Ge((r == null ? void 0 : r.seed) ?? E.seed), s = je(o[0], o[1], o[2], o[3]);
      return new lr({
        rand: s,
        maxTimeDeltaSec: (r == null ? void 0 : r.maxTimeDeltaSec) ?? E.maxTimeDeltaSec,
        nodeCharge: (r == null ? void 0 : r.nodeCharge) ?? E.nodeCharge,
        nodeMass: (r == null ? void 0 : r.nodeMass) ?? E.nodeMass,
        edgeEquilibriumLength: (r == null ? void 0 : r.edgeEquilibriumLength) ?? E.edgeEquilibriumLength,
        edgeStiffness: (r == null ? void 0 : r.edgeStiffness) ?? E.edgeStiffness,
        convergenceVelocity: (r == null ? void 0 : r.convergenceVelocity) ?? E.convergenceVelocity,
        maxForce: (r == null ? void 0 : r.maxForce) ?? E.maxForce,
        nodeForceCoefficient: (r == null ? void 0 : r.nodeForceCoefficient) ?? E.nodeForceCoefficient,
        barnesHutTheta: ((e = r == null ? void 0 : r.barnesHut) == null ? void 0 : e.theta) ?? E.barnesHutTheta,
        barnesHutAreaRadiusThreshold: ((t = r == null ? void 0 : r.barnesHut) == null ? void 0 : t.areaRadiusThreshold) ?? E.barnesHutAreaRadiusThreshold
      });
    }
  }
}, K = {
  staticNodeResolver: () => !1,
  onBeforeApplied: () => {
  },
  onAfterApplied: () => {
  }
}, ur = (r) => {
  var t, o;
  return {
    algorithm: gr((r == null ? void 0 : r.algorithm) ?? {}),
    staticNodeResolver: (r == null ? void 0 : r.staticNodeResolver) ?? K.staticNodeResolver,
    onBeforeApplied: ((t = r == null ? void 0 : r.events) == null ? void 0 : t.onBeforeApplied) ?? K.onBeforeApplied,
    onAfterApplied: ((o = r == null ? void 0 : r.events) == null ? void 0 : o.onAfterApplied) ?? K.onAfterApplied
  };
}, pr = (r) => r instanceof _ ? {
  type: "trigger",
  trigger: r
} : (r == null ? void 0 : r.type) === "topologyChangeMacrotask" ? {
  type: "topologyChangeSchedule",
  schedule: Lt
} : {
  type: "topologyChangeSchedule",
  schedule: Ft
}, B = Object.freeze({
  staticNodeResolver: () => !1,
  onBeforeApplied: () => {
  },
  onAfterApplied: () => {
  },
  hierarchicalLayout: {
    layerWidth: 300,
    layerSpace: 300
  }
}), z = (r, e) => ({
  a: r.a * e.a + r.b * e.d,
  b: r.a * e.b + r.b * e.e,
  c: r.a * e.c + r.b * e.f + r.c,
  d: r.d * e.a + r.e * e.d,
  e: r.d * e.b + r.e * e.e,
  f: r.d * e.c + r.e * e.f + r.f
}), yr = (r) => {
  const { a: e, b: t, c: o, d: s, e: n, f: a } = r, h = e * n - t * s;
  return {
    a: n / h,
    b: -t / h,
    c: (t * a - o * n) / h,
    d: -s / h,
    e: e / h,
    f: (o * s - e * a) / h
  };
};
class wr {
  resolve(e) {
    if ("shift" in e)
      return this.createShiftBaseMatrix(e.shift);
    if ("scale" in e) {
      const t = e.origin ?? { x: 0, y: 0 };
      return this.createScaleRelativeMatrix(e.scale, t);
    }
    if ("rotate" in e) {
      const t = e.origin ?? { x: 0, y: 0 };
      return this.createRotateRelativeMatrix(e.rotate, t);
    }
    if ("mirror" in e) {
      const t = e.origin ?? { x: 0, y: 0 };
      return this.createMirrorRelativeMatrix(e.mirror, t);
    }
    return {
      a: e.a ?? 1,
      b: e.b ?? 0,
      c: e.c ?? 0,
      d: e.d ?? 0,
      e: e.e ?? 1,
      f: e.f ?? 0
    };
  }
  createScaleRelativeMatrix(e, t) {
    const o = this.createScaleBaseMatrix(e), s = this.createShiftBaseMatrix(t);
    return this.createRelativeTransform(o, s);
  }
  createRotateRelativeMatrix(e, t) {
    const o = this.createRotateBaseMatrix(e), s = this.createShiftBaseMatrix(t);
    return this.createRelativeTransform(o, s);
  }
  createMirrorRelativeMatrix(e, t) {
    const o = this.createMirrorYBaseMatrix(), s = z(
      this.createShiftBaseMatrix(t),
      this.createRotateBaseMatrix(e)
    );
    return this.createRelativeTransform(o, s);
  }
  createRelativeTransform(e, t) {
    const o = z(
      t,
      e
    ), s = yr(t);
    return z(o, s);
  }
  createShiftBaseMatrix(e) {
    return {
      a: 1,
      b: 0,
      c: e.x,
      d: 0,
      e: 1,
      f: e.y
    };
  }
  createScaleBaseMatrix(e) {
    return {
      a: e,
      b: 0,
      c: 0,
      d: 0,
      e,
      f: 0
    };
  }
  createRotateBaseMatrix(e) {
    const t = Math.sin(e), o = Math.cos(e);
    return {
      a: o,
      b: -t,
      c: 0,
      d: t,
      e: o,
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
const fr = (r) => {
  if (r === void 0)
    return (s) => s;
  if (typeof r == "function")
    return r;
  const e = Array.isArray(r) ? r : [r];
  let t = {
    a: 1,
    b: 0,
    c: 0,
    d: 0,
    e: 1,
    f: 0
  };
  const o = new wr();
  return e.forEach((s) => {
    const n = o.resolve(s);
    t = z(t, n);
  }), (s) => {
    const { x: n, y: a } = s;
    return {
      x: t.a * n + t.b * a + t.c,
      y: t.d * n + t.e * a + t.f
    };
  };
}, vr = (r) => {
  var e, t;
  switch (r == null ? void 0 : r.type) {
    case "custom":
      return r.instance;
    case "hierarchical":
      return new cr({
        layerWidth: r.layerWidth ?? B.hierarchicalLayout.layerWidth,
        layerSpace: r.layerSpace ?? B.hierarchicalLayout.layerSpace,
        transform: fr(r.transform)
      });
    default: {
      const o = Ge((r == null ? void 0 : r.seed) ?? E.seed), s = je(o[0], o[1], o[2], o[3]);
      return new nr({
        dtSec: (r == null ? void 0 : r.dtSec) ?? E.dtSec,
        maxIterations: (r == null ? void 0 : r.maxIterations) ?? E.maxIterations,
        rand: s,
        nodeCharge: (r == null ? void 0 : r.nodeCharge) ?? E.nodeCharge,
        nodeMass: (r == null ? void 0 : r.nodeMass) ?? E.nodeMass,
        edgeEquilibriumLength: (r == null ? void 0 : r.edgeEquilibriumLength) ?? E.edgeEquilibriumLength,
        edgeStiffness: (r == null ? void 0 : r.edgeStiffness) ?? E.edgeStiffness,
        convergenceVelocity: (r == null ? void 0 : r.convergenceVelocity) ?? E.convergenceVelocity,
        maxForce: (r == null ? void 0 : r.maxForce) ?? E.maxForce,
        nodeForceCoefficient: (r == null ? void 0 : r.nodeForceCoefficient) ?? E.nodeForceCoefficient,
        barnesHutTheta: ((e = r == null ? void 0 : r.barnesHut) == null ? void 0 : e.theta) ?? E.barnesHutTheta,
        barnesHutAreaRadiusThreshold: ((t = r == null ? void 0 : r.barnesHut) == null ? void 0 : t.areaRadiusThreshold) ?? E.barnesHutAreaRadiusThreshold
      });
    }
  }
}, xr = (r) => {
  var e, t;
  return {
    algorithm: vr(r.algorithm),
    applyOn: pr(r.applyOn),
    staticNodeResolver: r.staticNodeResolver ?? B.staticNodeResolver,
    onBeforeApplied: ((e = r.events) == null ? void 0 : e.onBeforeApplied) ?? B.onBeforeApplied,
    onAfterApplied: ((t = r.events) == null ? void 0 : t.onAfterApplied) ?? B.onAfterApplied
  };
}, mr = (r, e) => ({
  ...r,
  onNodeDragStarted: (t) => {
    e.add(t), r.onNodeDragStarted(t);
  },
  onNodeDragFinished: (t) => {
    e.delete(t), r.onNodeDragFinished(t);
  }
}), Ar = (r, e) => {
  r.graph.onBeforeNodeRemoved.subscribe((t) => {
    e.delete(t);
  }), r.graph.onBeforeClear.subscribe(() => {
    e.clear();
  }), r.onBeforeDestroy.subscribe(() => {
    e.clear();
  });
}, Er = (r, e) => ({
  ...r,
  staticNodeResolver: (t) => r.staticNodeResolver(t) || e.has(t)
}), Z = (r) => () => r, Ae = Z(0), Sr = () => {
  let r = 0;
  return () => r++;
}, br = (r, e) => {
  let t = Ae, o = Ae;
  const s = Sr();
  return r === "incremental" && (t = s), e === "incremental" && (o = s), typeof r == "number" && (t = Z(r)), typeof e == "number" && (o = Z(e)), typeof r == "function" && (t = r), typeof e == "function" && (o = e), {
    nodesPriorityFn: t,
    edgesPriorityFn: o
  };
}, Nr = (r) => {
  var t, o, s, n, a;
  const e = br(
    (t = r.nodes) == null ? void 0 : t.priority,
    (o = r.edges) == null ? void 0 : o.priority
  );
  return {
    nodes: {
      centerFn: ((s = r.nodes) == null ? void 0 : s.centerFn) ?? Ce,
      priorityFn: e.nodesPriorityFn
    },
    ports: {
      direction: ((n = r.ports) == null ? void 0 : n.direction) ?? 0
    },
    edges: {
      shapeFactory: le(((a = r.edges) == null ? void 0 : a.shape) ?? {}),
      priorityFn: e.edgesPriorityFn
    }
  };
}, Pr = (r) => r.applyOn.type === "topologyChangeSchedule" ? r.applyOn.schedule : re, Cr = (r) => {
  var o, s, n;
  const { canvasDefaults: e } = r, t = r.hasLayout ? Pr(r.layoutParams) : re;
  return {
    focus: {
      contentOffset: ((o = e.focus) == null ? void 0 : o.contentOffset) ?? 100,
      minContentScale: ((s = e.focus) == null ? void 0 : s.minContentScale) ?? 0,
      schedule: t,
      animationDuration: ((n = e.focus) == null ? void 0 : n.animationDuration) ?? 0
    }
  };
};
class Dr {
  constructor(e) {
    i(this, "used", !1);
    i(this, "canvasDefaults", {});
    i(this, "dragConfig", {});
    i(this, "transformConfig", {});
    i(this, "backgroundConfig", {});
    i(this, "connectablePortsConfig", {});
    i(this, "draggableEdgesConfig", {});
    i(this, "virtualScrollConfig");
    i(this, "layoutConfig", {});
    i(this, "animatedLayoutConfig", {});
    i(this, "hasDraggableNodes", !1);
    i(this, "hasTransformableViewport", !1);
    i(this, "hasNodeResizeReactiveEdges", !1);
    i(this, "hasBackground", !1);
    i(this, "hasUserConnectablePorts", !1);
    i(this, "hasUserDraggableEdges", !1);
    i(this, "hasAnimatedLayout", !1);
    i(this, "hasLayout", !1);
    i(this, "boxRenderingTrigger", new _());
    i(this, "window", window);
    i(this, "animationStaticNodes", /* @__PURE__ */ new Set());
    this.element = e;
  }
  setDefaults(e) {
    return this.canvasDefaults = e, this;
  }
  enableUserDraggableNodes(e) {
    return this.hasDraggableNodes = !0, this.dragConfig = e ?? {}, this;
  }
  enableUserTransformableViewport(e) {
    return this.hasTransformableViewport = !0, this.transformConfig = e ?? {}, this;
  }
  enableNodeResizeReactiveEdges() {
    return this.hasNodeResizeReactiveEdges = !0, this;
  }
  enableVirtualScroll(e) {
    return this.virtualScrollConfig = e, this;
  }
  enableBackground(e) {
    return this.hasBackground = !0, this.backgroundConfig = e ?? {}, this;
  }
  enableUserConnectablePorts(e) {
    return this.hasUserConnectablePorts = !0, this.connectablePortsConfig = e ?? {}, this;
  }
  enableUserDraggableEdges(e) {
    return this.hasUserDraggableEdges = !0, this.draggableEdgesConfig = e ?? {}, this;
  }
  enableLayout(e) {
    return this.layoutConfig = e ?? {}, this.hasLayout = !0, this.hasAnimatedLayout = !1, this;
  }
  enableAnimatedLayout(e) {
    return this.animatedLayoutConfig = e ?? {}, this.hasAnimatedLayout = !0, this.hasLayout = !1, this;
  }
  build() {
    if (this.used)
      throw new tr(
        "Failed to build Canvas because CanvasBuilder is a single-use object"
      );
    this.used = !0;
    const e = new st(this.element), t = new be(), o = new Ht(this.element), s = this.createHtmlView(
      o.main,
      t,
      e
    ), n = Nr(
      this.canvasDefaults
    ), a = new Ve(
      t,
      s,
      n
    ), h = xr(this.layoutConfig), d = Cr({
      canvasDefaults: this.canvasDefaults,
      hasLayout: this.hasLayout,
      layoutParams: h
    }), c = new Oe(
      t,
      e,
      d,
      this.window
    ), g = new $e(e), u = new Ie(t), l = new Se(
      u,
      g,
      a,
      c
    );
    if (this.hasBackground && ie.configure(
      l,
      Qt(this.backgroundConfig),
      o.background
    ), this.hasNodeResizeReactiveEdges && q.configure(l), this.hasDraggableNodes) {
      let y = Yt(this.dragConfig);
      this.hasAnimatedLayout && (y = mr(
        y,
        this.animationStaticNodes
      )), oe.configure(
        l,
        o.main,
        this.window,
        y
      );
    }
    if (this.hasUserConnectablePorts) {
      const y = Zt(
        this.connectablePortsConfig,
        n.edges.shapeFactory,
        n.ports.direction
      );
      ne.configure(
        l,
        o.overlayConnectablePorts,
        e,
        this.window,
        y
      );
    }
    if (this.hasUserDraggableEdges) {
      const y = _t(
        this.draggableEdgesConfig,
        l.graph
      );
      ae.configure(
        l,
        o.overlayDraggableEdges,
        e,
        this.window,
        y
      );
    }
    if (this.virtualScrollConfig !== void 0 ? se.configure(
      l,
      o.main,
      this.window,
      me(this.transformConfig),
      this.boxRenderingTrigger,
      qt(this.virtualScrollConfig)
    ) : this.hasTransformableViewport && j.configure(
      l,
      o.main,
      this.window,
      me(this.transformConfig)
    ), this.hasLayout && Wt.configure(l, h), this.hasAnimatedLayout) {
      let y = ur(
        this.animatedLayoutConfig
      );
      this.hasDraggableNodes && (Ar(
        l,
        this.animationStaticNodes
      ), y = Er(
        y,
        this.animationStaticNodes
      )), ce.configure(l, y, this.window);
    }
    const p = () => {
      o.destroy(), l.onBeforeDestroy.unsubscribe(p);
    };
    return l.onBeforeDestroy.subscribe(p), l;
  }
  createHtmlView(e, t, o) {
    let s = new Ee(t, o, e);
    return this.virtualScrollConfig !== void 0 && (s = new tt(
      s,
      t,
      this.boxRenderingTrigger,
      er(this.virtualScrollConfig)
    )), s = new rt(s, t), s;
  }
}
export {
  Nt as BezierEdgeShape,
  Dr as CanvasBuilder,
  tr as CanvasBuilderError,
  S as CanvasError,
  L as ConnectionCategory,
  Le as DirectEdgeShape,
  _ as EventSubject,
  Pt as HorizontalEdgeShape,
  Rt as InteractiveEdgeError,
  Fe as InteractiveEdgeShape,
  Mr as MidpointEdgeShape,
  Ct as StraightEdgeShape,
  Tt as VerticalEdgeShape
};
