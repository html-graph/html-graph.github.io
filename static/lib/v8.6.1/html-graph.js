var Ke = Object.defineProperty;
var Qe = (r, e, t) => e in r ? Ke(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var i = (r, e, t) => Qe(r, typeof e != "symbol" ? e + "" : e, t);
var R = /* @__PURE__ */ ((r) => (r.Line = "line", r.NodeCycle = "node-cycle", r.PortCycle = "port-cycle", r))(R || {});
const Ze = () => {
  const r = document.createElement("div");
  return r.style.width = "100%", r.style.height = "100%", r.style.position = "relative", r.style.overflow = "hidden", r;
}, Je = () => {
  const r = document.createElement("div");
  return r.style.position = "absolute", r.style.top = "0", r.style.left = "0", r.style.width = "0", r.style.height = "0", r;
}, _e = (r) => {
  r.style.position = "absolute", r.style.top = "0", r.style.left = "0", r.style.visibility = "hidden";
}, et = (r) => {
  r.style.removeProperty("position"), r.style.removeProperty("top"), r.style.removeProperty("left"), r.style.removeProperty("visibility"), r.style.removeProperty("transform");
};
class Ee {
  constructor(e, t, s) {
    i(this, "host", Ze());
    i(this, "container", Je());
    i(this, "edgeIdToElementMap", /* @__PURE__ */ new Map());
    i(this, "attachedNodeIds", /* @__PURE__ */ new Set());
    i(this, "applyTransform", () => {
      const e = this.viewportStore.getContentMatrix();
      this.container.style.transform = `matrix(${e.scale}, 0, 0, ${e.scale}, ${e.x}, ${e.y})`;
    });
    this.graphStore = e, this.viewportStore = t, this.element = s, this.element.appendChild(this.host), this.host.appendChild(this.container), this.viewportStore.onAfterUpdated.subscribe(this.applyTransform);
  }
  attachNode(e) {
    const t = this.graphStore.getNode(e);
    _e(t.element), this.attachedNodeIds.add(e), this.container.appendChild(t.element), this.updateNodePosition(e), this.updateNodePriority(e), t.element.style.visibility = "visible";
  }
  detachNode(e) {
    const t = this.graphStore.getNode(e);
    et(t.element), this.container.removeChild(t.element), this.attachedNodeIds.delete(e);
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
    const t = this.graphStore.getNode(e), { width: s, height: o } = t.element.getBoundingClientRect(), n = this.viewportStore.getViewportMatrix().scale, { payload: a } = t, h = a.centerFn(s, o), d = a.x - n * h.x, c = a.y - n * h.y;
    t.element.style.transform = `translate(${d}px, ${c}px)`;
  }
  updateNodePriority(e) {
    const t = this.graphStore.getNode(e);
    t.element.style.zIndex = `${t.payload.priority}`;
  }
  updateEdgeShape(e) {
    const t = this.edgeIdToElementMap.get(e);
    this.container.removeChild(t);
    const o = this.graphStore.getEdge(e).payload.shape.svg;
    this.edgeIdToElementMap.set(e, o), this.container.appendChild(o);
  }
  renderEdge(e) {
    const t = this.graphStore.getEdge(e), s = this.graphStore.getPort(t.from), o = this.graphStore.getPort(t.to), n = s.element.getBoundingClientRect(), a = o.element.getBoundingClientRect(), h = this.host.getBoundingClientRect(), d = this.viewportStore.getViewportMatrix().scale, c = this.createEdgeRenderPort(
      s,
      n,
      h,
      d
    ), g = this.createEdgeRenderPort(o, a, h, d);
    let l = R.Line;
    s.element === o.element ? l = R.PortCycle : s.nodeId === o.nodeId && (l = R.NodeCycle), t.payload.shape.render({ from: c, to: g, category: l });
  }
  updateEdgePriority(e) {
    const t = this.graphStore.getEdge(e);
    t.payload.shape.svg.style.zIndex = `${t.payload.priority}`;
  }
  createEdgeRenderPort(e, t, s, o) {
    const n = this.viewportStore.createContentCoords({
      x: t.left - s.left,
      y: t.top - s.top
    });
    return {
      x: n.x,
      y: n.y,
      width: t.width * o,
      height: t.height * o,
      direction: e.payload.direction
    };
  }
}
class tt {
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
    const t = this.graphStore.getNode(e).payload, { x: s, y: o } = t;
    return s >= this.xFrom && s <= this.xTo && o >= this.yFrom && o <= this.yTo;
  }
  hasEdge(e) {
    const t = this.graphStore.getEdge(e), s = this.graphStore.getPort(t.from).nodeId, o = this.graphStore.getPort(t.to).nodeId, n = this.graphStore.getNode(s).payload, a = this.graphStore.getNode(o).payload, h = Math.min(n.x, a.x), d = Math.max(n.x, a.x), c = Math.min(n.y, a.y), g = Math.max(n.y, a.y);
    return h <= this.xTo && d >= this.xFrom && c <= this.yTo && g >= this.yFrom;
  }
}
class rt {
  constructor(e, t, s, o) {
    i(this, "attachedNodes", /* @__PURE__ */ new Set());
    i(this, "attachedEdges", /* @__PURE__ */ new Set());
    i(this, "renderingBox");
    i(this, "updateViewport", (e) => {
      this.renderingBox.setRenderingBox(e);
      const t = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
      this.graphStore.getAllNodeIds().forEach((a) => {
        const h = this.renderingBox.hasNode(a), d = this.attachedNodes.has(a);
        h && !d ? t.add(a) : !h && d && s.add(a);
      }), this.graphStore.getAllEdgeIds().forEach((a) => {
        const h = this.renderingBox.hasEdge(a), d = this.attachedEdges.has(a), c = this.graphStore.getEdge(a), g = this.graphStore.getPort(c.from).nodeId, l = this.graphStore.getPort(c.to).nodeId;
        h && (this.renderingBox.hasNode(g) || (t.add(g), s.delete(g)), this.renderingBox.hasNode(l) || (t.add(l), s.delete(l))), h && !d ? o.add(a) : !h && d && n.add(a);
      }), n.forEach((a) => {
        this.handleDetachEdge(a);
      }), s.forEach((a) => {
        this.handleDetachNode(a);
      }), t.forEach((a) => {
        this.attachedNodes.has(a) || this.handleAttachNode(a);
      }), o.forEach((a) => {
        this.handleAttachEdge(a);
      });
    });
    this.htmlView = e, this.graphStore = t, this.trigger = s, this.params = o, this.renderingBox = new tt(this.graphStore), this.trigger.subscribe(this.updateViewport);
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
    const t = this.graphStore.getEdge(e), s = this.graphStore.getPort(t.from).nodeId, o = this.graphStore.getPort(t.to).nodeId;
    this.attachedNodes.has(s) || this.handleAttachNode(s), this.attachedNodes.has(o) || this.handleAttachNode(o), this.handleAttachEdge(e);
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
class st {
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
    const t = this.graphStore.getEdge(e), s = this.graphStore.getPort(t.from), o = this.graphStore.getPort(t.to);
    return !(this.deferredNodes.has(s.nodeId) || this.deferredNodes.has(o.nodeId));
  }
  tryAttachEdge(e) {
    this.isEdgeValid(e) && (this.deferredEdges.delete(e), this.htmlView.attachEdge(e));
  }
}
class K {
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
const S = () => {
  const r = new K();
  return [r, r];
};
class Se {
  constructor(e, t, s, o) {
    i(this, "beforeDestroyEmitter");
    i(this, "destroyed", !1);
    i(this, "onBeforeDestroy");
    this.graph = e, this.viewport = t, this.graphController = s, this.viewportController = o, [this.beforeDestroyEmitter, this.onBeforeDestroy] = S();
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
    const s = this.singleToMultiMap.get(e);
    s === void 0 ? this.singleToMultiMap.set(e, /* @__PURE__ */ new Set([t])) : s.add(t), this.multiToSingleMap.set(t, e);
  }
  getMultiBySingle(e) {
    const t = this.singleToMultiMap.get(e) ?? /* @__PURE__ */ new Set();
    return Array.from(t.values());
  }
  removeByMulti(e) {
    const t = this.multiToSingleMap.get(e), s = this.singleToMultiMap.get(t);
    s.delete(e), s.size === 0 && this.singleToMultiMap.delete(t), this.multiToSingleMap.delete(e);
  }
  getByMulti(e) {
    return this.multiToSingleMap.get(e);
  }
  removeBySingle(e) {
    this.singleToMultiMap.get(e).forEach((s) => {
      this.multiToSingleMap.delete(s);
    }), this.singleToMultiMap.delete(e);
  }
  clear() {
    this.singleToMultiMap.clear(), this.multiToSingleMap.clear();
  }
  forEachSingle(e) {
    this.singleToMultiMap.forEach((t, s) => {
      e(s);
    });
  }
  hasSingle(e) {
    return this.singleToMultiMap.get(e) !== void 0;
  }
  hasMulti(e) {
    return this.multiToSingleMap.get(e) !== void 0;
  }
}
class E extends Error {
  constructor() {
    super(...arguments);
    i(this, "name", "CanvasError");
  }
}
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
    [this.afterNodeAddedEmitter, this.onAfterNodeAdded] = S(), [this.afterNodeUpdatedEmitter, this.onAfterNodeUpdated] = S(), [this.afterNodePriorityUpdatedEmitter, this.onAfterNodePriorityUpdated] = S(), [this.beforeNodeRemovedEmitter, this.onBeforeNodeRemoved] = S(), [this.afterPortAddedEmitter, this.onAfterPortAdded] = S(), [this.afterPortUpdatedEmitter, this.onAfterPortUpdated] = S(), [this.beforePortRemovedEmitter, this.onBeforePortRemoved] = S(), [this.afterEdgeAddedEmitter, this.onAfterEdgeAdded] = S(), [this.afterEdgeShapeUpdatedEmitter, this.onAfterEdgeShapeUpdated] = S(), [this.afterEdgeUpdatedEmitter, this.onAfterEdgeUpdated] = S(), [this.afterEdgePriorityUpdatedEmitter, this.onAfterEdgePriorityUpdated] = S(), [this.beforeEdgeRemovedEmitter, this.onBeforeEdgeRemoved] = S(), [this.beforeClearEmitter, this.onBeforeClear] = S();
  }
  hasNode(e) {
    return this.nodes.has(e);
  }
  getNode(e) {
    const t = this.nodes.get(e);
    if (t === void 0)
      throw new E("failed to access nonexistent node");
    return t;
  }
  addNode(e) {
    if (this.hasNode(e.id))
      throw new E("failed to add node with existing id");
    if (this.findNodeIdByElement(e.element) !== void 0)
      throw new E(
        "failed to add node with html element already in use by another node"
      );
    const t = /* @__PURE__ */ new Map(), s = {
      element: e.element,
      payload: {
        x: e.x,
        y: e.y,
        centerFn: e.centerFn,
        priority: e.priority
      },
      ports: t
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
      throw new E("failed to update nonexistent node");
    const { payload: s } = this.nodes.get(e);
    s.x = t.x ?? s.x, s.y = t.y ?? s.y, s.centerFn = t.centerFn ?? s.centerFn, t.priority !== void 0 && (s.priority = t.priority, this.afterNodePriorityUpdatedEmitter.emit(e)), this.afterNodeUpdatedEmitter.emit(e);
  }
  removeNode(e) {
    if (!this.hasNode(e))
      throw new E("failed to remove nonexistent node");
    this.beforeNodeRemovedEmitter.emit(e);
    const t = this.nodes.get(e);
    this.nodesElementsMap.delete(t.element), this.nodes.delete(e);
  }
  hasPort(e) {
    return this.ports.has(e);
  }
  getPort(e) {
    const t = this.ports.get(e);
    if (t === void 0)
      throw new E("failed to access nonexistent port");
    return t;
  }
  addPort(e) {
    if (this.hasPort(e.id))
      throw new E("failed to add port with existing id");
    if (!this.hasNode(e.nodeId))
      throw new E("failed to add port to nonexistent node");
    this.ports.set(e.id, {
      element: e.element,
      payload: {
        direction: e.direction
      },
      nodeId: e.nodeId
    }), this.elementPorts.addRecord(e.element, e.id), this.portCycleEdges.set(e.id, /* @__PURE__ */ new Set()), this.portIncomingEdges.set(e.id, /* @__PURE__ */ new Set()), this.portOutgoingEdges.set(e.id, /* @__PURE__ */ new Set()), this.nodes.get(e.nodeId).ports.set(e.id, e.element), this.afterPortAddedEmitter.emit(e.id);
  }
  updatePort(e, t) {
    if (!this.hasPort(e))
      throw new E("failed to update nonexistent port");
    const s = this.ports.get(e).payload;
    s.direction = t.direction ?? s.direction, this.afterPortUpdatedEmitter.emit(e);
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
      throw new E("failed to access port ids of nonexistent node");
    return Array.from(t.ports.keys());
  }
  removePort(e) {
    if (!this.hasPort(e))
      throw new E("failed to remove nonexistent port");
    const t = this.ports.get(e).nodeId;
    this.beforePortRemovedEmitter.emit(e), this.nodes.get(t).ports.delete(e), this.ports.delete(e), this.elementPorts.removeByMulti(e);
  }
  hasEdge(e) {
    return this.edges.has(e);
  }
  getEdge(e) {
    const t = this.edges.get(e);
    if (t === void 0)
      throw new E("failed to access nonexistent edge");
    return t;
  }
  addEdge(e) {
    if (this.hasEdge(e.id))
      throw new E("failed to add edge with existing id");
    if (!this.hasPort(e.from))
      throw new E("failed to add edge from nonexistent port");
    if (!this.hasPort(e.to))
      throw new E("failed to add edge to nonexistent port");
    this.addEdgeInternal(e), this.afterEdgeAddedEmitter.emit(e.id);
  }
  updateEdge(e, t) {
    if (!this.hasEdge(e))
      throw new E("failed to update nonexistent edge");
    if (t.from !== void 0 || t.to !== void 0) {
      const o = this.edges.get(e), n = o.payload;
      this.removeEdgeInternal(e), this.addEdgeInternal({
        id: e,
        from: t.from ?? o.from,
        to: t.to ?? o.to,
        shape: n.shape,
        priority: n.priority
      });
    }
    const s = this.edges.get(e);
    t.shape !== void 0 && (s.payload.shape = t.shape, this.afterEdgeShapeUpdatedEmitter.emit(e)), t.priority !== void 0 && (s.payload.priority = t.priority, this.afterEdgePriorityUpdatedEmitter.emit(e)), this.afterEdgeUpdatedEmitter.emit(e);
  }
  getAllEdgeIds() {
    return Array.from(this.edges.keys());
  }
  removeEdge(e) {
    if (!this.hasEdge(e))
      throw new E("failed to remove nonexistent edge");
    this.beforeEdgeRemovedEmitter.emit(e), this.removeEdgeInternal(e);
  }
  clear() {
    this.beforeClearEmitter.emit(), this.portIncomingEdges.clear(), this.portOutgoingEdges.clear(), this.portCycleEdges.clear(), this.elementPorts.clear(), this.nodesElementsMap.clear(), this.edges.clear(), this.ports.clear(), this.nodes.clear();
  }
  getPortIncomingEdgeIds(e) {
    const t = this.portIncomingEdges.get(e);
    if (t === void 0)
      throw new E("failed to access edges for nonexistent port");
    return Array.from(t);
  }
  getPortOutgoingEdgeIds(e) {
    const t = this.portOutgoingEdges.get(e);
    if (t === void 0)
      throw new E("failed to access edges for nonexistent port");
    return Array.from(t);
  }
  getPortCycleEdgeIds(e) {
    const t = this.portCycleEdges.get(e);
    if (t === void 0)
      throw new E("failed to access edges for nonexistent port");
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
    const t = Array.from(this.getNode(e).ports.keys()), s = [];
    return t.forEach((o) => {
      this.getPortIncomingEdgeIds(o).filter((n) => {
        const a = this.getEdge(n);
        return this.getPort(a.from).nodeId !== e;
      }).forEach((n) => {
        s.push(n);
      });
    }), s;
  }
  getNodeOutgoingEdgeIds(e) {
    const t = Array.from(this.getNode(e).ports.keys()), s = [];
    return t.forEach((o) => {
      this.getPortOutgoingEdgeIds(o).filter((n) => {
        const a = this.getEdge(n);
        return this.getPort(a.to).nodeId !== e;
      }).forEach((n) => {
        s.push(n);
      });
    }), s;
  }
  getNodeCycleEdgeIds(e) {
    const t = Array.from(this.getNode(e).ports.keys()), s = [];
    return t.forEach((o) => {
      this.getPortCycleEdgeIds(o).forEach((n) => {
        s.push(n);
      }), this.getPortIncomingEdgeIds(o).filter((n) => {
        const a = this.getEdge(n);
        return this.getPort(a.to).nodeId === e;
      }).forEach((n) => {
        s.push(n);
      });
    }), s;
  }
  getNodeAdjacentEdgeIds(e) {
    const t = Array.from(this.getNode(e).ports.keys()), s = [];
    return t.forEach((o) => {
      this.getPortIncomingEdgeIds(o).forEach((n) => {
        s.push(n);
      }), this.getPortOutgoingEdgeIds(o).forEach((n) => {
        s.push(n);
      }), this.getPortCycleEdgeIds(o).forEach((n) => {
        s.push(n);
      });
    }), s;
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
    const t = this.edges.get(e), s = t.from, o = t.to;
    this.portCycleEdges.get(s).delete(e), this.portCycleEdges.get(o).delete(e), this.portIncomingEdges.get(s).delete(e), this.portIncomingEdges.get(o).delete(e), this.portOutgoingEdges.get(s).delete(e), this.portOutgoingEdges.get(o).delete(e), this.edges.delete(e);
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
}, we = (r, e) => ({
  x: r.scale * e.x + r.x,
  y: r.scale * e.y + r.y
});
class it {
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
    this.host = e, [this.afterUpdateEmitter, this.onAfterUpdated] = S(), [this.beforeUpdateEmitter, this.onBeforeUpdated] = S(), [this.afterResizeEmitter, this.onAfterResize] = S(), this.observer.observe(this.host);
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
    return we(this.viewportMatrix, e);
  }
  createViewportCoords(e) {
    return we(this.contentMatrix, e);
  }
  destroy() {
    this.observer.disconnect();
  }
}
class Q {
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
      t.forEach((s) => {
        const o = s.target;
        this.handleNodeResize(o);
      });
    }), this.canvas.graph.onAfterNodeAdded.subscribe(this.onAfterNodeAdded), this.canvas.graph.onBeforeNodeRemoved.subscribe(this.onBeforeNodeRemoved), this.canvas.graph.onBeforeClear.subscribe(this.reset), this.canvas.onBeforeDestroy.subscribe(this.revert);
  }
  static configure(e) {
    new Q(e);
  }
  handleNodeResize(e) {
    const t = this.elementToNodeId.get(e);
    this.canvas.updateNode(t);
  }
}
const nt = (r, e, t) => {
  const { x: s, y: o, width: n, height: a } = r.getBoundingClientRect();
  return e >= s && e <= s + n && t >= o && t <= o + a;
}, at = (r, e, t) => e >= 0 && e <= r.innerWidth && t >= 0 && t <= r.innerHeight, D = (r, e, t, s) => nt(e, t, s) && at(r, t, s), U = (r, e) => {
  e !== null ? r.style.cursor = e : r.style.removeProperty("cursor");
}, O = (r) => {
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
}, ht = (r, e) => {
  let t = e;
  for (; t !== null; ) {
    const s = r.findPortIdsByElement(t)[0] ?? null;
    if (s !== null)
      return {
        status: "portFound",
        portId: s
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
function* Pe(r, e) {
  const t = r.elementsFromPoint(e.x, e.y);
  for (const s of t) {
    if (s.shadowRoot !== null) {
      const o = Pe(s.shadowRoot, e);
      for (const n of o)
        yield n;
    }
    yield s;
  }
}
const Ce = (r, e) => {
  const t = Pe(document, e);
  for (const s of t) {
    const o = ht(r, s);
    if (o.status === "portFound")
      return o.portId;
    if (o.status === "nodeEncountered")
      return null;
  }
  return null;
};
var N = /* @__PURE__ */ ((r) => (r.StaticNodeId = "static", r.DraggingNodeId = "dragging", r.EdgeId = "edge", r))(N || {});
const Ne = (r, e) => ({
  x: r / 2,
  y: e / 2
}), w = {
  x: 0,
  y: 0
}, m = (r, e, t) => ({
  x: e.x * r.x - e.y * r.y + ((1 - e.x) * t.x + e.y * t.y),
  y: e.y * r.x + e.x * r.y + ((1 - e.x) * t.y - e.y * t.x)
}), Te = (r, e) => {
  const t = {
    x: r.x + r.width / 2,
    y: r.y + r.height / 2
  }, s = {
    x: e.x + e.width / 2,
    y: e.y + e.height / 2
  }, o = Math.min(t.x, s.x), n = Math.min(t.y, s.y), a = Math.abs(s.x - t.x), h = Math.abs(s.y - t.y), d = t.x <= s.x ? 1 : -1, c = t.y <= s.y ? 1 : -1;
  return {
    x: o,
    y: n,
    width: a,
    height: h,
    flipX: d,
    flipY: c
  };
}, z = (r, e, t, s) => ({
  x: e * r.x + (1 - e) / 2 * s.x,
  y: t * r.y + (1 - t) / 2 * s.y
});
class dt {
  constructor(e) {
    i(this, "path");
    i(this, "midpoint");
    this.params = e;
    const t = this.params.to;
    this.midpoint = { x: t.x / 2, y: t.y / 2 };
    const s = m(
      { x: this.params.arrowLength, y: w.y },
      this.params.sourceDirection,
      w
    ), o = m(
      { x: this.params.to.x - this.params.arrowLength, y: this.params.to.y },
      this.params.targetDirection,
      this.params.to
    ), n = {
      x: s.x + this.params.sourceDirection.x * this.params.curvature,
      y: s.y + this.params.sourceDirection.y * this.params.curvature
    }, a = {
      x: o.x - this.params.targetDirection.x * this.params.curvature,
      y: o.y - this.params.targetDirection.y * this.params.curvature
    }, h = `M ${s.x} ${s.y} C ${n.x} ${n.y}, ${a.x} ${a.y}, ${o.x} ${o.y}`, d = this.params.hasSourceArrow ? "" : `M ${w.x} ${w.y} L ${s.x} ${s.y} `, c = this.params.hasTargetArrow ? "" : ` M ${o.x} ${o.y} L ${this.params.to.x} ${this.params.to.y}`;
    this.path = `${d}${h}${c}`;
  }
}
class ct {
  constructor(e) {
    i(this, "path");
    i(this, "midpoint");
    this.params = e;
    const t = this.params.hasSourceArrow ? m(
      { x: this.params.arrowLength, y: w.y },
      this.params.sourceDirection,
      w
    ) : w, s = this.params.hasTargetArrow ? m(
      {
        x: this.params.to.x - this.params.arrowLength,
        y: this.params.to.y
      },
      this.params.targetDirection,
      this.params.to
    ) : this.params.to, o = this.params.arrowLength, n = Math.cos(this.params.detourDirection) * this.params.detourDistance, a = Math.sin(this.params.detourDirection) * this.params.detourDistance, h = n * this.params.flipX, d = a * this.params.flipY, c = m(
      { x: o, y: w.y },
      this.params.sourceDirection,
      w
    ), g = {
      x: c.x + h,
      y: c.y + d
    }, l = m(
      { x: this.params.to.x - o, y: this.params.to.y },
      this.params.targetDirection,
      this.params.to
    ), u = {
      x: l.x + h,
      y: l.y + d
    }, p = {
      x: (g.x + u.x) / 2,
      y: (g.y + u.y) / 2
    }, y = {
      x: c.x + this.params.curvature * this.params.sourceDirection.x,
      y: c.y + this.params.curvature * this.params.sourceDirection.y
    }, v = {
      x: l.x - this.params.curvature * this.params.targetDirection.x,
      y: l.y - this.params.curvature * this.params.targetDirection.y
    }, x = {
      x: c.x + h,
      y: c.y + d
    }, b = {
      x: l.x + h,
      y: l.y + d
    };
    this.path = [
      `M ${t.x} ${t.y}`,
      `L ${c.x} ${c.y}`,
      `C ${y.x} ${y.y} ${x.x} ${x.y} ${p.x} ${p.y}`,
      `C ${b.x} ${b.y} ${v.x} ${v.y} ${l.x} ${l.y}`,
      `L ${s.x} ${s.y}`
    ].join(" "), this.midpoint = z(p, e.flipX, e.flipY, e.to);
  }
}
const Z = Object.freeze({
  edgeColor: "--edge-color"
}), Me = (r) => {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  return e.style.pointerEvents = "none", e.style.position = "absolute", e.style.top = "0", e.style.left = "0", e.style.overflow = "visible", e.style.setProperty(Z.edgeColor, r), e;
}, Re = (r) => {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("stroke", `var(${Z.edgeColor})`), e.setAttribute("stroke-width", `${r}`), e.setAttribute("fill", "none"), e;
}, W = () => {
  const r = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return r.setAttribute("fill", `var(${Z.edgeColor})`), r;
}, De = () => {
  const r = document.createElementNS("http://www.w3.org/2000/svg", "g");
  return r.style.transformOrigin = "50% 50%", r;
}, Le = (r, e) => {
  r.style.transform = `translate(${e.x}px, ${e.y}px)`, r.style.width = `${Math.max(e.width, 1)}px`, r.style.height = `${Math.max(e.height, 1)}px`;
}, M = (r, e) => {
  const t = [];
  if (r.length > 0 && t.push(`M ${r[0].x} ${r[0].y}`), r.length === 2 && t.push(`L ${r[1].x} ${r[1].y}`), r.length > 2) {
    const s = r.length - 1;
    let o = 0, n = 0, a = 0;
    r.forEach((h, d) => {
      let c = 0, g = 0, l = 0;
      const u = d > 0, p = d < s, y = u && p;
      if (u && (c = -o, g = -n, l = a), p) {
        const V = r[d + 1];
        o = V.x - h.x, n = V.y - h.y, a = Math.sqrt(o * o + n * n);
      }
      const x = a !== 0 ? Math.min((y ? e : 0) / a, d < s - 1 ? 0.5 : 1) : 0, b = y ? { x: h.x + o * x, y: h.y + n * x } : h, C = l !== 0 ? Math.min((y ? e : 0) / l, d > 1 ? 0.5 : 1) : 0, L = y ? { x: h.x + c * C, y: h.y + g * C } : h;
      d > 0 && t.push(`L ${L.x} ${L.y}`), y && t.push(
        `C ${h.x} ${h.y} ${h.x} ${h.y} ${b.x} ${b.y}`
      );
    });
  }
  return t.join(" ");
};
class lt {
  constructor(e) {
    i(this, "path");
    i(this, "midpoint");
    this.params = e;
    const t = this.params.to;
    this.midpoint = { x: t.x / 2, y: t.y / 2 };
    const s = this.params.hasSourceArrow ? m(
      { x: this.params.arrowLength, y: w.y },
      this.params.sourceDirection,
      w
    ) : w, o = this.params.hasTargetArrow ? m(
      {
        x: this.params.to.x - this.params.arrowLength,
        y: this.params.to.y
      },
      this.params.targetDirection,
      this.params.to
    ) : this.params.to, n = this.params.arrowLength + this.params.arrowOffset, a = n - this.params.roundness, h = m(
      { x: a, y: w.y },
      this.params.sourceDirection,
      w
    ), d = m(
      { x: this.params.to.x - a, y: this.params.to.y },
      this.params.targetDirection,
      this.params.to
    ), c = Math.max((h.x + d.x) / 2, n), g = this.params.to.y / 2, l = {
      x: this.params.flipX > 0 ? c : -n,
      y: h.y
    }, u = { x: l.x, y: g }, p = {
      x: this.params.flipX > 0 ? this.params.to.x - c : this.params.to.x + n,
      y: d.y
    }, y = { x: p.x, y: g };
    this.path = M(
      [s, h, l, u, y, p, d, o],
      this.params.roundness
    );
  }
}
class gt {
  constructor(e) {
    i(this, "path");
    i(this, "midpoint");
    this.params = e;
    const t = this.params.hasSourceArrow ? m(
      { x: this.params.arrowLength, y: w.y },
      this.params.sourceDirection,
      w
    ) : w, s = this.params.hasTargetArrow ? m(
      {
        x: this.params.to.x - this.params.arrowLength,
        y: this.params.to.y
      },
      this.params.targetDirection,
      this.params.to
    ) : this.params.to, o = this.params.arrowLength + this.params.arrowOffset, n = m(
      { x: o, y: w.y },
      this.params.sourceDirection,
      w
    ), a = Math.cos(this.params.detourDirection) * this.params.detourDistance, h = Math.sin(this.params.detourDirection) * this.params.detourDistance, d = a * this.params.flipX, c = h * this.params.flipY, g = { x: n.x + d, y: n.y + c }, l = m(
      { x: this.params.to.x - o, y: this.params.to.y },
      this.params.targetDirection,
      this.params.to
    ), u = { x: l.x + d, y: l.y + c }, p = { x: (g.x + u.x) / 2, y: (g.y + u.y) / 2 };
    this.midpoint = z(p, e.flipX, e.flipY, e.to), this.path = M(
      [t, n, g, u, l, s],
      this.params.roundness
    );
  }
}
class ut {
  constructor(e) {
    i(this, "path");
    i(this, "midpoint");
    this.params = e;
    const t = this.params.to;
    this.midpoint = { x: t.x / 2, y: t.y / 2 };
    const s = this.params.hasSourceArrow ? m(
      { x: this.params.arrowLength, y: w.y },
      this.params.sourceDirection,
      w
    ) : w, o = this.params.hasTargetArrow ? m(
      {
        x: this.params.to.x - this.params.arrowLength,
        y: this.params.to.y
      },
      this.params.targetDirection,
      this.params.to
    ) : this.params.to, n = this.params.arrowLength + this.params.arrowOffset, a = m(
      { x: n, y: w.y },
      this.params.sourceDirection,
      w
    ), h = m(
      { x: this.params.to.x - n, y: this.params.to.y },
      this.params.targetDirection,
      this.params.to
    );
    this.path = M([s, a, h, o], this.params.roundness);
  }
}
class pt {
  constructor(e) {
    i(this, "path");
    i(this, "midpoint");
    this.params = e;
    const t = this.params.to;
    this.midpoint = { x: t.x / 2, y: t.y / 2 };
    const s = this.params.hasSourceArrow ? m(
      { x: this.params.arrowLength, y: w.y },
      this.params.sourceDirection,
      w
    ) : w, o = this.params.hasTargetArrow ? m(
      {
        x: this.params.to.x - this.params.arrowLength,
        y: this.params.to.y
      },
      this.params.targetDirection,
      this.params.to
    ) : this.params.to, n = this.params.arrowLength + this.params.arrowOffset, a = n - this.params.roundness, h = m(
      { x: a, y: w.y },
      this.params.sourceDirection,
      w
    ), d = m(
      { x: this.params.to.x - a, y: this.params.to.y },
      this.params.targetDirection,
      this.params.to
    ), c = Math.max((h.y + d.y) / 2, n), g = this.params.to.x / 2, l = {
      x: h.x,
      y: this.params.flipY > 0 ? c : -n
    }, u = { x: g, y: l.y }, p = {
      x: d.x,
      y: this.params.flipY > 0 ? this.params.to.y - c : this.params.to.y + n
    }, y = { x: g, y: p.y };
    this.path = M(
      [s, h, l, u, y, p, d, o],
      this.params.roundness
    );
  }
}
class J {
  constructor(e) {
    i(this, "path");
    i(this, "midpoint");
    this.params = e;
    const t = this.params.arrowOffset, s = this.params.side, o = this.params.arrowLength + t, n = o + 2 * s, h = [
      { x: this.params.arrowLength, y: w.y },
      { x: o, y: w.y },
      { x: o, y: this.params.side },
      { x: n, y: this.params.side },
      { x: n, y: -this.params.side },
      { x: o, y: -this.params.side },
      { x: o, y: w.y },
      { x: this.params.arrowLength, y: w.y }
    ].map(
      (c) => m(c, this.params.sourceDirection, w)
    ), d = `M ${w.x} ${w.y} L ${h[0].x} ${h[0].y} `;
    this.path = `${this.params.hasSourceArrow || this.params.hasTargetArrow ? "" : d}${M(h, this.params.roundness)}`, this.midpoint = { x: (h[3].x + h[4].x) / 2, y: (h[3].y + h[4].y) / 2 };
  }
}
class wt {
  constructor(e) {
    i(this, "path");
    i(this, "midpoint");
    this.params = e;
    const t = this.params.smallRadius, s = this.params.radius, o = t + s, n = t * s / o, a = Math.sqrt(o * o - t * t), h = a * t / o, d = a + s + this.params.arrowLength, c = this.params.arrowLength + h, l = [
      { x: this.params.arrowLength, y: w.y },
      { x: c, y: n },
      { x: c, y: -n },
      { x: d, y: 0 }
    ].map(
      (y) => m(y, this.params.sourceDirection, w)
    ), u = [
      `M ${l[0].x} ${l[0].y}`,
      `A ${t} ${t} 0 0 1 ${l[1].x} ${l[1].y}`,
      `A ${s} ${s} 0 1 0 ${l[2].x} ${l[2].y}`,
      `A ${t} ${t} 0 0 1 ${l[0].x} ${l[0].y}`
    ].join(" "), p = `M 0 0 L ${l[0].x} ${l[0].y} `;
    this.path = `${this.params.hasSourceArrow || this.params.hasTargetArrow ? "" : p}${u}`, this.midpoint = l[3];
  }
}
class yt {
  constructor(e) {
    i(this, "path");
    i(this, "midpoint");
    i(this, "diagonalDistance");
    this.params = e;
    const t = this.params.to;
    if (this.midpoint = { x: t.x / 2, y: t.y / 2 }, this.diagonalDistance = Math.sqrt(
      this.params.to.x * this.params.to.x + this.params.to.y * this.params.to.y
    ), Math.sqrt(
      this.params.to.x * this.params.to.x + this.params.to.y * this.params.to.y
    ) === 0) {
      this.path = "";
      return;
    }
    const o = this.createDirectLinePoint({
      offset: this.params.sourceOffset,
      hasArrow: this.params.hasSourceArrow,
      flip: 1,
      shift: w
    }), n = this.createDirectLinePoint({
      offset: this.params.targetOffset,
      hasArrow: this.params.hasTargetArrow,
      flip: -1,
      shift: this.params.to
    });
    this.path = `M ${o.x} ${o.y} L ${n.x} ${n.y}`;
  }
  createDirectLinePoint(e) {
    const t = e.hasArrow ? this.params.arrowLength : 0, s = e.offset + t, o = e.flip * s / this.diagonalDistance;
    return {
      x: this.params.to.x * o + e.shift.x,
      y: this.params.to.y * o + e.shift.y
    };
  }
}
class ft {
  constructor(e) {
    i(this, "path");
    i(this, "midpoint");
    this.params = e;
    const t = this.params.hasSourceArrow ? m(
      { x: this.params.arrowLength, y: w.y },
      this.params.sourceDirection,
      w
    ) : w, s = this.params.hasTargetArrow ? m(
      {
        x: this.params.to.x - this.params.arrowLength,
        y: this.params.to.y
      },
      this.params.targetDirection,
      this.params.to
    ) : this.params.to, o = this.params.arrowLength + this.params.arrowOffset, n = m(
      { x: o, y: w.y },
      this.params.sourceDirection,
      w
    ), a = m(
      { x: this.params.to.x - o, y: this.params.to.y },
      this.params.targetDirection,
      this.params.to
    ), h = this.params.detourDistance > 0 ? 1 : -1, d = this.params.to.y / 2, c = d + Math.abs(this.params.detourDistance), g = d + c * this.params.flipY * h, l = {
      x: (n.x + a.x) / 2,
      y: g
    };
    this.midpoint = z(l, e.flipX, e.flipY, e.to), this.path = M(
      [
        t,
        n,
        { x: n.x, y: g },
        { x: a.x, y: g },
        a,
        s
      ],
      this.params.roundness
    );
  }
}
class mt {
  constructor(e) {
    i(this, "path");
    i(this, "midpoint");
    this.params = e;
    const t = this.params.hasSourceArrow ? m(
      { x: this.params.arrowLength, y: w.y },
      this.params.sourceDirection,
      w
    ) : w, s = this.params.hasTargetArrow ? m(
      {
        x: this.params.to.x - this.params.arrowLength,
        y: this.params.to.y
      },
      this.params.targetDirection,
      this.params.to
    ) : this.params.to, o = this.params.arrowLength + this.params.arrowOffset, n = m(
      { x: o, y: w.y },
      this.params.sourceDirection,
      w
    ), a = m(
      { x: this.params.to.x - o, y: this.params.to.y },
      this.params.targetDirection,
      this.params.to
    ), h = this.params.detourDistance > 0 ? 1 : -1, d = this.params.to.x / 2, c = d + Math.abs(this.params.detourDistance), g = d + c * this.params.flipX * h, l = {
      x: g,
      y: (n.y + a.y) / 2
    };
    this.midpoint = z(l, e.flipX, e.flipY, e.to), this.path = M(
      [
        t,
        n,
        { x: g, y: n.y },
        { x: g, y: a.y },
        a,
        s
      ],
      this.params.roundness
    );
  }
}
const f = Object.freeze({
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
}), ye = (r, e, t) => ({ x: e * Math.cos(r), y: t * Math.sin(r) });
class k {
  constructor(e) {
    i(this, "svg");
    i(this, "group", De());
    i(this, "line");
    i(this, "sourceArrow", null);
    i(this, "targetArrow", null);
    i(this, "onAfterRender");
    i(this, "afterRenderEmitter");
    i(this, "arrowRenderer");
    this.params = e, [this.afterRenderEmitter, this.onAfterRender] = S(), this.arrowRenderer = this.params.arrowRenderer, this.svg = Me(e.color), this.svg.appendChild(this.group), this.line = Re(e.width), this.group.appendChild(this.line), e.hasSourceArrow && (this.sourceArrow = W(), this.group.appendChild(this.sourceArrow)), e.hasTargetArrow && (this.targetArrow = W(), this.group.appendChild(this.targetArrow));
  }
  render(e) {
    const { x: t, y: s, width: o, height: n, flipX: a, flipY: h } = Te(
      e.from,
      e.to
    );
    Le(this.svg, { x: t, y: s, width: o, height: n }), this.group.style.transform = `scale(${a}, ${h})`;
    const d = ye(
      e.from.direction,
      a,
      h
    ), c = ye(
      e.to.direction,
      a,
      h
    ), g = {
      x: o,
      y: n
    };
    let l = { x: -c.x, y: -c.y }, u;
    e.category === R.PortCycle ? (u = this.params.createCyclePath, l = d) : e.category === R.NodeCycle ? u = this.params.createDetourPath : u = this.params.createLinePath;
    const p = u(
      d,
      c,
      g,
      a,
      h
    );
    this.line.setAttribute("d", p.path);
    let y = null;
    this.sourceArrow && (y = this.arrowRenderer({
      direction: d,
      shift: w,
      arrowLength: this.params.arrowLength
    }), this.sourceArrow.setAttribute("d", y));
    let v = null;
    this.targetArrow && (v = this.arrowRenderer({
      direction: l,
      shift: g,
      arrowLength: this.params.arrowLength
    }), this.targetArrow.setAttribute("d", v)), this.afterRenderEmitter.emit({
      edgePath: p,
      sourceArrowPath: y,
      targetArrowPath: v
    });
  }
}
const vt = (r) => (e) => {
  const s = [
    w,
    { x: e.arrowLength, y: r.radius },
    { x: e.arrowLength, y: -r.radius }
  ].map(
    (h) => m(h, e.direction, w)
  ).map((h) => ({
    x: h.x + e.shift.x,
    y: h.y + e.shift.y
  })), o = `M ${s[0].x} ${s[0].y}`, n = `L ${s[1].x} ${s[1].y}`, a = `L ${s[2].x} ${s[2].y}`;
  return `${o} ${n} ${a} Z`;
}, At = (r) => (e) => {
  const t = r.radius, s = e.arrowLength, o = (s * s + 2 * s * t) / (2 * t), n = o + t, a = s + t - t * (s + t) / n, h = t * o / n, c = [w, { x: a, y: -h }, { x: a, y: h }].map(
    (y) => m(y, e.direction, w)
  ).map((y) => ({
    x: y.x + e.shift.x,
    y: y.y + e.shift.y
  })), g = `M ${c[0].x} ${c[0].y}`, l = `A ${o} ${o} 0 0 0 ${c[1].x} ${c[1].y}`, u = `A ${t} ${t} 0 0 0 ${c[2].x} ${c[2].y}`, p = `A ${o} ${o} 0 0 0 ${c[0].x} ${c[0].y}`;
  return `${g} ${l} ${u} ${p}`;
}, xt = (r) => (e) => {
  const t = r.smallRadius, s = r.radius, o = m(
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
  ), a = [w, { x: o.x, y: -o.y }, o].map(
    (l) => m(l, e.direction, w)
  ).map((l) => ({
    x: l.x + e.shift.x,
    y: l.y + e.shift.y
  })), h = `M ${a[0].x} ${a[0].y}`, d = `A ${s} ${s} 0 0 1 ${a[1].x} ${a[1].y}`, c = `A ${t} ${t} 0 0 1 ${a[2].x} ${a[2].y}`, g = `A ${s} ${s} 0 0 1 ${a[0].x} ${a[0].y}`;
  return `${h} ${d} ${c} ${g}`;
}, I = (r) => {
  if (typeof r == "function")
    return r;
  switch (r.type) {
    case "triangle":
      return vt({
        radius: r.radius ?? f.polygonArrowRadius
      });
    case "arc":
      return At({
        radius: r.radius ?? f.circleArrowRadius
      });
    default:
      return xt({
        smallRadius: r.smallRadius ?? f.wedgeArrowSmallRadius,
        angle: r.angle ?? f.wedgeArrowAngle,
        radius: r.radius ?? f.wedgeArrowRadius
      });
  }
};
class Et {
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
    i(this, "createCyclePath", (e) => new wt({
      sourceDirection: e,
      radius: this.portCycleRadius,
      smallRadius: this.portCycleSmallRadius,
      arrowLength: this.arrowLength,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    i(this, "createDetourPath", (e, t, s, o, n) => new ct({
      to: s,
      sourceDirection: e,
      targetDirection: t,
      flipX: o,
      flipY: n,
      arrowLength: this.arrowLength,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      curvature: this.curvature,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    i(this, "createLinePath", (e, t, s) => new dt({
      to: s,
      sourceDirection: e,
      targetDirection: t,
      arrowLength: this.arrowLength,
      curvature: this.curvature,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    this.arrowLength = (e == null ? void 0 : e.arrowLength) ?? f.arrowLength, this.curvature = (e == null ? void 0 : e.curvature) ?? f.curvature, this.portCycleRadius = (e == null ? void 0 : e.cycleRadius) ?? f.cycleRadius, this.portCycleSmallRadius = (e == null ? void 0 : e.smallCycleRadius) ?? f.smallCycleRadius, this.detourDirection = (e == null ? void 0 : e.detourDirection) ?? f.detourDirection, this.detourDistance = (e == null ? void 0 : e.detourDistance) ?? f.detourDistance, this.hasSourceArrow = (e == null ? void 0 : e.hasSourceArrow) ?? f.hasSourceArrow, this.hasTargetArrow = (e == null ? void 0 : e.hasTargetArrow) ?? f.hasTargetArrow, this.pathShape = new k({
      color: (e == null ? void 0 : e.color) ?? f.color,
      width: (e == null ? void 0 : e.width) ?? f.width,
      arrowRenderer: I((e == null ? void 0 : e.arrowRenderer) ?? {}),
      arrowLength: this.arrowLength,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
      createCyclePath: this.createCyclePath,
      createDetourPath: this.createDetourPath,
      createLinePath: this.createLinePath
    }), this.svg = this.pathShape.svg, this.group = this.pathShape.group, this.line = this.pathShape.line, this.sourceArrow = this.pathShape.sourceArrow, this.targetArrow = this.pathShape.targetArrow, this.onAfterRender = this.pathShape.onAfterRender;
  }
  render(e) {
    this.pathShape.render(e);
  }
}
class St {
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
    i(this, "createCyclePath", (e) => new J({
      sourceDirection: e,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    i(this, "createDetourPath", (e, t, s, o, n) => new ft({
      to: s,
      sourceDirection: e,
      targetDirection: t,
      flipX: o,
      flipY: n,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    i(this, "createLinePath", (e, t, s, o) => new lt({
      to: s,
      sourceDirection: e,
      targetDirection: t,
      flipX: o,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    this.arrowLength = (e == null ? void 0 : e.arrowLength) ?? f.arrowLength, this.arrowOffset = (e == null ? void 0 : e.arrowOffset) ?? f.arrowOffset, this.cycleSquareSide = (e == null ? void 0 : e.cycleSquareSide) ?? f.cycleSquareSide;
    const t = (e == null ? void 0 : e.roundness) ?? f.roundness;
    this.roundness = Math.min(
      t,
      this.arrowOffset,
      this.cycleSquareSide / 2
    ), this.detourDistance = (e == null ? void 0 : e.detourDistance) ?? f.detourDistance, this.hasSourceArrow = (e == null ? void 0 : e.hasSourceArrow) ?? f.hasSourceArrow, this.hasTargetArrow = (e == null ? void 0 : e.hasTargetArrow) ?? f.hasTargetArrow, this.pathShape = new k({
      color: (e == null ? void 0 : e.color) ?? f.color,
      width: (e == null ? void 0 : e.width) ?? f.width,
      arrowRenderer: I((e == null ? void 0 : e.arrowRenderer) ?? {}),
      arrowLength: this.arrowLength,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
      createCyclePath: this.createCyclePath,
      createDetourPath: this.createDetourPath,
      createLinePath: this.createLinePath
    }), this.svg = this.pathShape.svg, this.group = this.pathShape.group, this.line = this.pathShape.line, this.sourceArrow = this.pathShape.sourceArrow, this.targetArrow = this.pathShape.targetArrow, this.onAfterRender = this.pathShape.onAfterRender;
  }
  render(e) {
    this.pathShape.render(e);
  }
}
class bt {
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
    i(this, "createCyclePath", (e) => new J({
      sourceDirection: e,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    i(this, "createDetourPath", (e, t, s, o, n) => new gt({
      to: s,
      sourceDirection: e,
      targetDirection: t,
      flipX: o,
      flipY: n,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    i(this, "createLinePath", (e, t, s) => new ut({
      to: s,
      sourceDirection: e,
      targetDirection: t,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    this.arrowLength = (e == null ? void 0 : e.arrowLength) ?? f.arrowLength, this.arrowOffset = (e == null ? void 0 : e.arrowOffset) ?? f.arrowOffset, this.cycleSquareSide = (e == null ? void 0 : e.cycleSquareSide) ?? f.cycleSquareSide;
    const t = (e == null ? void 0 : e.roundness) ?? f.roundness;
    this.roundness = Math.min(
      t,
      this.arrowOffset,
      this.cycleSquareSide / 2
    ), this.detourDirection = (e == null ? void 0 : e.detourDirection) ?? f.detourDirection, this.detourDistance = (e == null ? void 0 : e.detourDistance) ?? f.detourDistance, this.hasSourceArrow = (e == null ? void 0 : e.hasSourceArrow) ?? f.hasSourceArrow, this.hasTargetArrow = (e == null ? void 0 : e.hasTargetArrow) ?? f.hasTargetArrow, this.pathShape = new k({
      color: (e == null ? void 0 : e.color) ?? f.color,
      width: (e == null ? void 0 : e.width) ?? f.width,
      arrowRenderer: I((e == null ? void 0 : e.arrowRenderer) ?? {}),
      arrowLength: this.arrowLength,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
      createCyclePath: this.createCyclePath,
      createDetourPath: this.createDetourPath,
      createLinePath: this.createLinePath
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
    i(this, "createCyclePath", (e) => new J({
      sourceDirection: e,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    i(this, "createDetourPath", (e, t, s, o, n) => new mt({
      to: s,
      sourceDirection: e,
      targetDirection: t,
      flipX: o,
      flipY: n,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    i(this, "createLinePath", (e, t, s, o, n) => new pt({
      to: s,
      sourceDirection: e,
      targetDirection: t,
      flipY: n,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    this.arrowLength = (e == null ? void 0 : e.arrowLength) ?? f.arrowLength, this.arrowOffset = (e == null ? void 0 : e.arrowOffset) ?? f.arrowOffset, this.cycleSquareSide = (e == null ? void 0 : e.cycleSquareSide) ?? f.cycleSquareSide;
    const t = (e == null ? void 0 : e.roundness) ?? f.roundness;
    this.roundness = Math.min(
      t,
      this.arrowOffset,
      this.cycleSquareSide / 2
    ), this.detourDistance = (e == null ? void 0 : e.detourDistance) ?? f.detourDistance, this.hasSourceArrow = (e == null ? void 0 : e.hasSourceArrow) ?? f.hasSourceArrow, this.hasTargetArrow = (e == null ? void 0 : e.hasTargetArrow) ?? f.hasTargetArrow, this.pathShape = new k({
      color: (e == null ? void 0 : e.color) ?? f.color,
      width: (e == null ? void 0 : e.width) ?? f.width,
      arrowRenderer: I((e == null ? void 0 : e.arrowRenderer) ?? {}),
      arrowLength: this.arrowLength,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
      createCyclePath: this.createCyclePath,
      createDetourPath: this.createDetourPath,
      createLinePath: this.createLinePath
    }), this.svg = this.pathShape.svg, this.group = this.pathShape.group, this.line = this.pathShape.line, this.sourceArrow = this.pathShape.sourceArrow, this.targetArrow = this.pathShape.targetArrow, this.onAfterRender = this.pathShape.onAfterRender;
  }
  render(e) {
    this.pathShape.render(e);
  }
}
class Ve {
  constructor(e) {
    i(this, "svg");
    i(this, "group", De());
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
    [this.afterRenderEmitter, this.onAfterRender] = S(), this.color = (e == null ? void 0 : e.color) ?? f.color, this.width = (e == null ? void 0 : e.width) ?? f.width, this.arrowLength = (e == null ? void 0 : e.arrowLength) ?? f.arrowLength, this.arrowRenderer = I((e == null ? void 0 : e.arrowRenderer) ?? {}), this.sourceOffset = (e == null ? void 0 : e.sourceOffset) ?? f.preOffset, this.targetOffset = (e == null ? void 0 : e.targetOffset) ?? f.preOffset, this.svg = Me(this.color), this.svg.appendChild(this.group), this.line = Re(this.width), this.group.appendChild(this.line), e != null && e.hasSourceArrow && (this.sourceArrow = W(), this.group.appendChild(this.sourceArrow)), e != null && e.hasTargetArrow && (this.targetArrow = W(), this.group.appendChild(this.targetArrow));
  }
  render(e) {
    const { x: t, y: s, width: o, height: n, flipX: a, flipY: h } = Te(
      e.from,
      e.to
    );
    Le(this.svg, { x: t, y: s, width: o, height: n }), this.group.style.transform = `scale(${a}, ${h})`;
    const d = { x: o, y: n }, c = new yt({
      to: d,
      sourceOffset: this.sourceOffset,
      targetOffset: this.targetOffset,
      hasSourceArrow: this.sourceArrow !== null,
      hasTargetArrow: this.targetArrow !== null,
      arrowLength: this.arrowLength
    });
    this.line.setAttribute("d", c.path);
    let g = null, l = null;
    const u = c.diagonalDistance;
    if (u === 0)
      this.sourceArrow !== null && (g = "", this.sourceArrow.setAttribute("d", g)), this.targetArrow !== null && (l = "", this.targetArrow.setAttribute("d", l));
    else {
      const p = {
        x: d.x / u,
        y: d.y / u
      };
      if (this.sourceArrow) {
        const y = {
          x: p.x * this.sourceOffset,
          y: p.y * this.sourceOffset
        };
        g = this.arrowRenderer({
          direction: p,
          shift: y,
          arrowLength: this.arrowLength
        }), this.sourceArrow.setAttribute("d", g);
      }
      if (this.targetArrow) {
        const y = {
          x: p.x * this.targetOffset,
          y: p.y * this.targetOffset
        };
        l = this.arrowRenderer({
          direction: { x: -p.x, y: -p.y },
          shift: {
            x: d.x - y.x,
            y: d.y - y.y
          },
          arrowLength: this.arrowLength
        }), this.targetArrow.setAttribute("d", l);
      }
    }
    this.afterRenderEmitter.emit({
      edgePath: c,
      sourceArrowPath: g,
      targetArrowPath: l
    });
  }
}
const Ct = () => {
  const r = document.createElementNS("http://www.w3.org/2000/svg", "g");
  return r.style.pointerEvents = "auto", r.style.cursor = "pointer", r;
}, Nt = (r) => {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("stroke", "transparent"), e.setAttribute("stroke-width", `${r}`), e.setAttribute("fill", "none"), e.setAttribute("stroke-linecap", "round"), e;
}, fe = (r) => {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("stroke-linejoin", "round"), e.setAttribute("stroke-width", `${r}`), e.setAttribute("fill", "transparent"), e.setAttribute("stroke", "transparent"), e;
};
class Tt extends Error {
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
    i(this, "handle", Ct());
    i(this, "onAfterRender");
    i(this, "interactiveLine");
    i(this, "interactiveSourceArrow", null);
    i(this, "interactiveTargetArrow", null);
    if (this.baseEdge = e, e instanceof Fe)
      throw new Tt(
        "interactive edge can be configured only once"
      );
    this.svg = this.baseEdge.svg, this.group = this.baseEdge.group, this.line = this.baseEdge.line, this.sourceArrow = this.baseEdge.sourceArrow, this.targetArrow = this.baseEdge.targetArrow, this.onAfterRender = this.baseEdge.onAfterRender;
    const s = (t == null ? void 0 : t.distance) ?? f.interactiveWidth;
    this.interactiveLine = Nt(s), this.handle.appendChild(this.interactiveLine), this.sourceArrow && (this.interactiveSourceArrow = fe(s), this.handle.appendChild(this.interactiveSourceArrow)), this.targetArrow && (this.interactiveTargetArrow = fe(s), this.handle.appendChild(this.interactiveTargetArrow)), this.group.appendChild(this.handle), this.baseEdge.onAfterRender.subscribe((o) => {
      this.interactiveLine.setAttribute("d", o.edgePath.path), this.interactiveSourceArrow && this.interactiveSourceArrow.setAttribute("d", o.sourceArrowPath), this.interactiveTargetArrow && this.interactiveTargetArrow.setAttribute("d", o.targetArrowPath);
    });
  }
  render(e) {
    this.baseEdge.render(e);
  }
}
class Cr {
  constructor(e, t) {
    i(this, "group");
    i(this, "line");
    i(this, "sourceArrow");
    i(this, "targetArrow");
    i(this, "onAfterRender");
    i(this, "svg");
    this.baseShape = e, this.midpointElement = t, this.svg = this.baseShape.svg, this.group = this.baseShape.group, this.line = this.baseShape.line, this.sourceArrow = this.baseShape.sourceArrow, this.targetArrow = this.baseShape.targetArrow, this.onAfterRender = this.baseShape.onAfterRender, this.svg.append(this.midpointElement), this.baseShape.onAfterRender.subscribe((s) => {
      const o = s.edgePath.midpoint, n = `translate(${o.x}px, ${o.y}px)`;
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
    const t = this.graphStore.getNode(e), { payload: s } = t;
    return {
      element: t.element,
      x: s.x,
      y: s.y,
      centerFn: s.centerFn,
      priority: s.priority
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
    const t = this.graphStore.getEdge(e), { payload: s } = t;
    return {
      from: t.from,
      to: t.to,
      priority: s.priority,
      shape: s.shape
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
class X {
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
class Be {
  constructor(e, t, s) {
    i(this, "nodeIdGenerator", new X(
      (e) => this.graphStore.hasNode(e)
    ));
    i(this, "portIdGenerator", new X(
      (e) => this.graphStore.hasPort(e)
    ));
    i(this, "edgeIdGenerator", new X(
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
    this.graphStore = e, this.htmlView = t, this.params = s, this.graphStore.onAfterNodeAdded.subscribe(this.onAfterNodeAdded), this.graphStore.onAfterNodeUpdated.subscribe(this.onAfterNodeUpdated), this.graphStore.onAfterNodePriorityUpdated.subscribe(
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
      for (const s of e.ports)
        this.markPort({
          id: s.id,
          element: s.element,
          nodeId: t,
          direction: s.direction
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
const Mt = (r) => {
  setTimeout(() => {
    r();
  });
}, Rt = (r) => {
  queueMicrotask(() => {
    r();
  });
}, _ = (r) => {
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
const Dt = (r, e) => Symbol.iterator in r ? {
  minContentScale: e.focus.minContentScale,
  nodes: r,
  contentOffset: e.focus.contentOffset
} : {
  minContentScale: r.minContentScale ?? e.focus.minContentScale,
  nodes: r.nodes ?? [],
  contentOffset: r.contentOffset ?? e.focus.contentOffset
}, Ue = (r, e, t) => ({
  scale: r.scale,
  x: r.x + r.scale * e,
  y: r.y + r.scale * t
}), Oe = (r, e, t, s) => ({
  scale: r.scale * e,
  x: r.scale * (1 - e) * t + r.x,
  y: r.scale * (1 - e) * s + r.y
});
class We {
  constructor(e, t, s) {
    this.graphStore = e, this.viewportStore = t, this.params = s;
  }
  patchViewportMatrix(e) {
    this.viewportStore.patchViewportMatrix(e);
  }
  patchContentMatrix(e) {
    this.viewportStore.patchContentMatrix(e);
  }
  center(e, t) {
    const { width: s, height: o } = this.viewportStore.getDimensions(), n = { x: s / 2, y: o / 2 }, a = this.viewportStore.getViewportMatrix(), h = this.viewportStore.createViewportCoords(e), d = h.x - n.x, c = h.y - n.y;
    let g = Ue(a, d, c);
    const l = t == null ? void 0 : t.contentScale;
    if (l !== void 0) {
      const u = 1 / l;
      g = Oe(
        g,
        u / a.scale,
        n.x,
        n.y
      );
    }
    this.viewportStore.patchViewportMatrix(g);
  }
  focus(e) {
    const t = Dt(e ?? {}, this.params);
    this.params.focus.schedule(() => {
      this.navigate(t);
    });
  }
  destroy() {
    this.viewportStore.destroy();
  }
  navigate(e) {
    let t = 1 / 0, s = -1 / 0, o = 1 / 0, n = -1 / 0, a = 0;
    const h = /* @__PURE__ */ new Set();
    for (const d of e.nodes)
      h.add(d);
    if (this.graphStore.getAllNodeIds().forEach((d) => {
      const { payload: c } = this.graphStore.getNode(d);
      c.x !== null && c.y !== null && (h.size === 0 || h.has(d)) && (t = Math.min(c.x, t), s = Math.max(c.x, s), o = Math.min(c.y, o), n = Math.max(c.y, n), a++);
    }), a > 0) {
      t -= e.contentOffset, o -= e.contentOffset, s += e.contentOffset, n += e.contentOffset;
      const d = {
        x: (t + s) / 2,
        y: (o + n) / 2
      }, c = (s - t) / 2, g = (n - o) / 2, { width: l, height: u } = this.viewportStore.getDimensions(), p = l / 2, y = u / 2, v = Math.max(
        c / p,
        g / y
      ), { scale: x } = this.viewportStore.getContentMatrix(), b = v > 1 ? x / v : x, P = Math.max(b, e.minContentScale);
      this.center(d, { contentScale: P });
    }
  }
}
const ze = (r, e) => {
  const t = new be(), s = new Ie(t), o = new $e(e), n = new Ee(t, e, r), a = {
    nodes: {
      centerFn: Ne,
      priorityFn: () => 0
    },
    edges: {
      shapeFactory: () => new Ve(),
      priorityFn: () => 0
    },
    ports: {
      direction: 0
    }
  }, h = new Be(
    t,
    n,
    a
  ), d = {
    focus: {
      contentOffset: 0,
      minContentScale: 0,
      schedule: _
    }
  }, c = new We(
    t,
    e,
    d
  );
  return new Se(s, o, h, c);
};
class H {
  constructor(e, t, s, o) {
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
      const s = e.currentTarget, o = this.canvas.graph.findPortIdsByElement(s)[0];
      this.params.onPortPointerDown(o, {
        x: t.clientX,
        y: t.clientY
      }) && (e.stopPropagation(), this.window.addEventListener("mousemove", this.onWindowMouseMove, {
        passive: !0
      }), this.window.addEventListener("mouseup", this.onWindowMouseUp, {
        passive: !0
      }));
    });
    i(this, "onWindowMouseMove", (e) => {
      if (!D(
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
      const s = t.touches[0], o = e.currentTarget, n = this.canvas.graph.findPortIdsByElement(o)[0];
      this.params.onPortPointerDown(n, {
        x: s.clientX,
        y: s.clientY
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
      if (!D(
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
    this.canvas = e, this.element = t, this.window = s, this.params = o, this.canvas.graph.onAfterPortMarked.subscribe(this.onAfterPortMarked), this.canvas.graph.onBeforePortUnmarked.subscribe(this.onBeforePortUnmarked), this.canvas.graph.onBeforeClear.subscribe(this.reset), this.canvas.onBeforeDestroy.subscribe(this.revert);
  }
  static configure(e, t, s, o) {
    new H(e, t, s, o);
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
class Lt {
  constructor(e, t, s) {
    this.canvas = e, this.layoutAlgorithm = t, this.params = s;
  }
  apply() {
    const e = this.layoutAlgorithm.calculateCoordinates({
      graph: this.canvas.graph,
      viewport: this.canvas.viewport
    });
    this.params.onBeforeApplied(), e.forEach((t, s) => {
      this.params.staticNodeResolver(s) || this.canvas.updateNode(s, t);
    }), this.params.onAfterApplied();
  }
}
class Vt {
  constructor(e, t, s) {
    this.canvas = e, this.layoutAlgorithm = t, this.params = s;
  }
  apply(e) {
    const t = this.layoutAlgorithm.calculateNextCoordinates({
      graph: this.canvas.graph,
      viewport: this.canvas.viewport,
      dt: e
    });
    this.params.onBeforeApplied(), t.forEach((s, o) => {
      this.params.staticNodeResolver(o) || this.canvas.updateNode(o, s);
    }), this.params.onAfterApplied();
  }
}
class ee {
  constructor(e, t, s, o) {
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
      const s = e.currentTarget, o = this.graph.findNodeIdByElement(s), n = this.graph.getNode(o);
      if (!this.params.nodeDragVerifier(o))
        return;
      this.params.onNodeDragStarted(o), e.stopPropagation();
      const h = this.calculateContentPoint({
        x: t.clientX,
        y: t.clientY
      });
      this.grabbedNode = {
        nodeId: o,
        dx: h.x - n.x,
        dy: h.y - n.y
      }, U(this.element, this.params.dragCursor), this.moveNodeOnTop(o), this.window.addEventListener("mousemove", this.onWindowMouseMove, {
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
      const s = t.touches[0], o = e.currentTarget, n = this.canvas.graph.findNodeIdByElement(o), a = this.graph.getNode(n);
      if (!this.params.nodeDragVerifier({
        nodeId: n,
        element: a.element,
        x: a.x,
        y: a.y
      }))
        return;
      const d = this.calculateContentPoint({
        x: s.clientX,
        y: s.clientY
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
      if (!D(
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
      if (!D(
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
    this.canvas = e, this.element = t, this.window = s, this.params = o, this.graph = e.graph, this.graph.onAfterNodeAdded.subscribe(this.onAfterNodeAdded), this.graph.onAfterNodeUpdated.subscribe(this.onAfterNodeUpdated), this.graph.onBeforeNodeRemoved.subscribe(this.onBeforeNodeRemoved), this.graph.onBeforeClear.subscribe(this.reset), this.canvas.onBeforeDestroy.subscribe(this.revert);
  }
  static configure(e, t, s, o) {
    new ee(e, t, s, o);
  }
  moveNode(e, t) {
    if (!this.graph.hasNode(e.nodeId))
      return;
    const s = this.calculateContentPoint(t), o = {
      x: s.x - e.dx,
      y: s.y - e.dy
    }, n = this.adjustNodeCoords(o);
    this.canvas.updateNode(e.nodeId, {
      x: n.x,
      y: n.y
    }), this.params.onNodeDrag(e.nodeId);
  }
  moveNodeOnTop(e) {
    if (this.params.moveOnTop) {
      if (this.maxNodePriority++, this.params.moveEdgesOnTop) {
        const t = this.maxNodePriority;
        this.maxNodePriority++, this.graph.getNodeAdjacentEdgeIds(e).forEach((o) => {
          this.canvas.updateEdge(o, { priority: t });
        });
      }
      this.canvas.updateNode(e, { priority: this.maxNodePriority });
    }
  }
  cancelMouseDrag() {
    this.grabbedNode !== null && this.graph.hasNode(this.grabbedNode.nodeId) && this.params.onNodeDragFinished(this.grabbedNode.nodeId), this.grabbedNode = null, U(this.element, null), this.removeMouseDragListeners();
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
      const s = t / 2;
      return {
        x: Math.floor((e.x + s) / t) * t,
        y: Math.floor((e.y + s) / t) * t
      };
    }
    return e;
  }
}
const B = (r) => {
  const e = [], t = r.touches.length;
  for (let h = 0; h < t; h++)
    e.push([r.touches[h].clientX, r.touches[h].clientY]);
  const s = e.reduce(
    (h, d) => [h[0] + d[0], h[1] + d[1]],
    [0, 0]
  ), o = [s[0] / t, s[1] / t], a = e.map((h) => [h[0] - o[0], h[1] - o[1]]).reduce(
    (h, d) => h + Math.sqrt(d[0] * d[0] + d[1] * d[1]),
    0
  );
  return {
    x: o[0],
    y: o[1],
    scale: a / t,
    touchesCnt: t,
    touches: e
  };
};
class Y {
  constructor(e, t, s, o) {
    i(this, "viewport");
    i(this, "prevTouches", null);
    i(this, "wheelFinishTimer", null);
    i(this, "transformInProgress", !1);
    i(this, "revert", () => {
      this.removeMouseDragListeners(), this.removeTouchDragListeners();
    });
    i(this, "onMouseDown", (e) => {
      this.params.mouseDownEventVerifier(e) && (U(this.element, this.params.shiftCursor), this.window.addEventListener("mousemove", this.onWindowMouseMove, {
        passive: !0
      }), this.window.addEventListener("mouseup", this.onWindowMouseUp, {
        passive: !0
      }), this.startRegisteredTransform());
    });
    i(this, "onWindowMouseMove", (e) => {
      const t = D(
        this.window,
        this.element,
        e.clientX,
        e.clientY
      );
      if (this.element === null || !t) {
        this.stopMouseDrag();
        return;
      }
      const s = -e.movementX, o = -e.movementY;
      this.moveViewport(s, o);
    });
    i(this, "onWindowMouseUp", (e) => {
      this.params.mouseUpEventVerifier(e) && this.stopMouseDrag();
    });
    i(this, "onWheelScroll", (e) => {
      if (!this.params.mouseWheelEventVerifier(e))
        return;
      const { left: t, top: s } = this.element.getBoundingClientRect(), o = e.clientX - t, n = e.clientY - s, h = 1 / (e.deltaY < 0 ? this.params.wheelSensitivity : 1 / this.params.wheelSensitivity);
      this.wheelFinishTimer === null && this.params.onTransformStarted(), this.scaleViewport(h, o, n), this.wheelFinishTimer !== null && clearTimeout(this.wheelFinishTimer), this.wheelFinishTimer = setTimeout(() => {
        this.transformInProgress || this.params.onTransformFinished(), this.wheelFinishTimer = null;
      }, this.params.scaleWheelFinishTimeout);
    });
    i(this, "onTouchStart", (e) => {
      if (this.prevTouches !== null) {
        this.prevTouches = B(e);
        return;
      }
      this.prevTouches = B(e), this.window.addEventListener("touchmove", this.onWindowTouchMove, {
        passive: !0
      }), this.window.addEventListener("touchend", this.onWindowTouchFinish, {
        passive: !0
      }), this.window.addEventListener("touchcancel", this.onWindowTouchFinish, {
        passive: !0
      }), this.startRegisteredTransform();
    });
    i(this, "onWindowTouchMove", (e) => {
      const t = B(e);
      if (!t.touches.every(
        (o) => D(this.window, this.element, o[0], o[1])
      )) {
        this.stopTouchDrag();
        return;
      }
      if ((t.touchesCnt === 1 || t.touchesCnt === 2) && this.moveViewport(
        -(t.x - this.prevTouches.x),
        -(t.y - this.prevTouches.y)
      ), t.touchesCnt === 2) {
        const { left: o, top: n } = this.element.getBoundingClientRect(), a = this.prevTouches.x - o, h = this.prevTouches.y - n, c = 1 / (t.scale / this.prevTouches.scale);
        this.scaleViewport(c, a, h);
      }
      this.prevTouches = t;
    });
    i(this, "onWindowTouchFinish", (e) => {
      e.touches.length > 0 ? this.prevTouches = B(e) : this.stopTouchDrag();
    });
    i(this, "preventWheelScaleListener", (e) => {
      e.preventDefault();
    });
    this.canvas = e, this.element = t, this.window = s, this.params = o, this.element.addEventListener("wheel", this.preventWheelScaleListener, {
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
  static configure(e, t, s, o) {
    new Y(e, t, s, o);
  }
  moveViewport(e, t) {
    const s = this.viewport.getViewportMatrix(), o = Ue(s, e, t), { width: n, height: a } = this.viewport.getDimensions(), h = this.params.transformPreprocessor({
      prevTransform: s,
      nextTransform: o,
      canvasWidth: n,
      canvasHeight: a
    });
    this.performTransform(h);
  }
  scaleViewport(e, t, s) {
    const o = this.canvas.viewport.getViewportMatrix(), n = Oe(o, e, t, s), { width: a, height: h } = this.viewport.getDimensions(), d = this.params.transformPreprocessor({
      prevTransform: o,
      nextTransform: n,
      canvasWidth: a,
      canvasHeight: h
    });
    this.performTransform(d);
  }
  stopMouseDrag() {
    U(this.element, null), this.removeMouseDragListeners(), this.finishRegisteredTransform();
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
    const e = this.viewport.getViewportMatrix(), { width: t, height: s } = this.viewport.getDimensions(), o = this.params.transformPreprocessor({
      prevTransform: e,
      nextTransform: e,
      canvasWidth: t,
      canvasHeight: s
    });
    this.params.onResizeTransformStarted(), this.canvas.patchViewportMatrix(o), this.params.onResizeTransformFinished();
  }
}
class te {
  constructor(e, t, s, o, n, a) {
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
    this.canvas = e, this.element = t, this.window = s, this.trigger = n, this.params = a, this.nodeHorizontal = this.params.nodeVerticalRadius, this.nodeVertical = this.params.nodeHorizontalRadius, this.viewport = e.viewport, this.currentScale = this.viewport.getViewportMatrix().scale, this.scheduleLoadAreaAroundViewport(), this.viewport.onAfterResize.subscribe(() => {
      this.scheduleLoadAreaAroundViewport();
    });
    const h = {
      ...o,
      onResizeTransformStarted: () => {
        this.userTransformInProgress = !0, o.onResizeTransformStarted();
      },
      onResizeTransformFinished: () => {
        this.userTransformInProgress = !1, o.onResizeTransformFinished();
      },
      onBeforeTransformChange: () => {
        this.userTransformInProgress = !0, o.onBeforeTransformChange();
      },
      onTransformChange: () => {
        this.userTransformInProgress = !1;
        const d = this.currentScale;
        this.currentScale = this.viewport.getViewportMatrix().scale, d !== this.currentScale && this.scheduleEnsureViewportAreaLoaded(), o.onTransformChange();
      },
      onTransformFinished: () => {
        this.scheduleLoadAreaAroundViewport(), o.onTransformFinished();
      }
    };
    Y.configure(
      e,
      this.element,
      this.window,
      h
    ), this.trigger.subscribe(this.updateLoadedArea), this.canvas.viewport.onAfterUpdated.subscribe(this.onAfterViewportUpdated);
  }
  static configure(e, t, s, o, n, a) {
    new te(
      e,
      t,
      s,
      o,
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
      const { width: e, height: t } = this.viewport.getDimensions(), { scale: s, x: o, y: n } = this.viewport.getViewportMatrix(), a = e * s, h = t * s, d = o - this.nodeHorizontal, c = n - this.nodeVertical, g = o + a + this.nodeHorizontal, l = n + h + this.nodeVertical;
      this.loadedArea.xFrom < d && this.loadedArea.xTo > g && this.loadedArea.yFrom < c && this.loadedArea.yTo > l || this.loadAreaAroundViewport();
    });
  }
  loadAreaAroundViewport() {
    const { width: e, height: t } = this.viewport.getDimensions(), { scale: s, x: o, y: n } = this.viewport.getViewportMatrix(), a = e * s, h = t * s, d = o - a - this.nodeHorizontal, c = n - h - this.nodeVertical, g = 3 * a + 2 * this.nodeHorizontal, l = 3 * h + 2 * this.nodeVertical;
    this.trigger.emit({
      x: d,
      y: c,
      width: g,
      height: l
    });
  }
}
const Ft = () => {
  const r = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  return r.style.position = "absolute", r.style.inset = "0", r;
}, It = () => {
  const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  return r.setAttribute("fill", "url(#pattern)"), r;
}, Bt = () => {
  const r = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "pattern"
  );
  return r.setAttribute("id", "pattern"), r;
};
class re {
  constructor(e, t, s) {
    i(this, "svg", Ft());
    i(this, "patternRenderingRectangle", It());
    i(this, "pattern", Bt());
    i(this, "patternContent");
    i(this, "tileWidth");
    i(this, "tileHeight");
    i(this, "halfTileWidth");
    i(this, "halfTileHeight");
    i(this, "maxViewportScale");
    i(this, "visible", !1);
    i(this, "onAfterTransformUpdated", () => {
      const e = this.canvas.viewport.getContentMatrix(), t = e.x - this.halfTileWidth * e.scale, s = e.y - this.halfTileHeight * e.scale, o = `matrix(${e.scale}, 0, 0, ${e.scale}, ${t}, ${s})`;
      this.pattern.setAttribute("patternTransform", o), this.updateVisibility();
    });
    this.canvas = e, this.backgroundHost = s, this.tileWidth = t.tileWidth, this.tileHeight = t.tileHeight, this.halfTileWidth = this.tileWidth / 2, this.halfTileHeight = this.tileHeight / 2, this.patternContent = t.renderer, this.maxViewportScale = t.maxViewportScale;
    const o = `translate(${this.halfTileWidth}, ${this.halfTileHeight})`;
    this.patternContent.setAttribute("transform", o), this.pattern.appendChild(this.patternContent);
    const n = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    n.appendChild(this.pattern), this.svg.appendChild(n), this.svg.appendChild(this.patternRenderingRectangle), this.updateDimensions(), this.canvas.viewport.onAfterResize.subscribe(() => {
      this.updateDimensions();
    }), this.canvas.viewport.onAfterUpdated.subscribe(this.onAfterTransformUpdated), this.onAfterTransformUpdated();
  }
  static configure(e, t, s) {
    new re(e, t, s);
  }
  updateVisibility() {
    const { scale: e } = this.canvas.viewport.getViewportMatrix(), t = e > this.maxViewportScale;
    t && this.visible ? (this.visible = !1, this.backgroundHost.removeChild(this.svg)) : !t && !this.visible && (this.visible = !0, this.backgroundHost.appendChild(this.svg));
  }
  updateDimensions() {
    const { width: e, height: t } = this.canvas.viewport.getDimensions();
    this.svg.setAttribute("width", `${e}`), this.svg.setAttribute("height", `${t}`), this.patternRenderingRectangle.setAttribute("width", `${e}`), this.patternRenderingRectangle.setAttribute("height", `${t}`);
    const s = this.tileWidth / e, o = this.tileHeight / t;
    this.pattern.setAttribute("width", `${s}`), this.pattern.setAttribute("height", `${o}`);
  }
}
class se {
  constructor(e, t, s, o, n) {
    i(this, "overlayCanvas");
    i(this, "staticPortId", null);
    i(this, "isTargetDragging", !0);
    i(this, "onEdgeCreated", (e) => {
      this.params.onAfterEdgeCreated(e);
    });
    this.canvas = e, this.overlayLayer = t, this.viewportStore = s, this.window = o, this.params = n, this.overlayCanvas = ze(
      this.overlayLayer,
      this.viewportStore
    ), H.configure(
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
  static configure(e, t, s, o, n) {
    new se(
      e,
      t,
      s,
      o,
      n
    );
  }
  grabPort(e, t, s) {
    const o = this.canvas.graph.getPort(e);
    this.staticPortId = e;
    const n = o.element.getBoundingClientRect(), a = n.x + n.width / 2, h = n.y + n.height / 2, d = this.overlayLayer.getBoundingClientRect(), c = this.canvas.viewport.createContentCoords({
      x: a - d.x,
      y: h - d.y
    }), g = this.canvas.viewport.createContentCoords({
      x: t.x - d.x,
      y: t.y - d.y
    }), l = {
      overlayNodeId: N.StaticNodeId,
      portCoords: c,
      portDirection: o.direction
    }, u = {
      overlayNodeId: N.DraggingNodeId,
      portCoords: g,
      portDirection: this.params.dragPortDirection
    };
    this.isTargetDragging = s === "direct";
    const [p, y] = this.isTargetDragging ? [l, u] : [u, l];
    this.overlayCanvas.addNode(O(p)), this.overlayCanvas.addNode(O(y)), this.overlayCanvas.addEdge({
      from: p.overlayNodeId,
      to: y.overlayNodeId,
      shape: this.params.edgeShapeFactory(N.EdgeId)
    });
  }
  resetDragState() {
    this.staticPortId = null, this.isTargetDragging = !0, this.overlayCanvas.clear();
  }
  tryCreateConnection(e) {
    const t = Ce(this.canvas.graph, e), s = this.staticPortId;
    if (t === null) {
      this.params.onEdgeCreationInterrupted({
        staticPortId: s,
        isDirect: this.isTargetDragging
      });
      return;
    }
    const o = this.isTargetDragging ? s : t, n = this.isTargetDragging ? t : s, a = { from: o, to: n }, h = this.params.connectionPreprocessor(a);
    h !== null ? (this.canvas.graph.onAfterEdgeAdded.subscribe(this.onEdgeCreated), this.canvas.addEdge(h), this.canvas.graph.onAfterEdgeAdded.unsubscribe(this.onEdgeCreated)) : this.params.onEdgeCreationPrevented(a);
  }
  moveDraggingPort(e) {
    const t = this.overlayLayer.getBoundingClientRect(), s = this.canvas.viewport.createContentCoords({
      x: e.x - t.x,
      y: e.y - t.y
    });
    this.overlayCanvas.updateNode(N.DraggingNodeId, {
      x: s.x,
      y: s.y
    });
  }
}
class oe {
  constructor(e, t, s, o, n) {
    i(this, "overlayCanvas");
    i(this, "staticPortId", null);
    i(this, "isTargetDragging", !0);
    i(this, "draggingEdgePayload", null);
    i(this, "onEdgeReattached", (e) => {
      this.params.onAfterEdgeReattached(e);
    });
    this.canvas = e, this.overlayLayer = t, this.viewportStore = s, this.window = o, this.params = n, this.overlayCanvas = ze(
      this.overlayLayer,
      this.viewportStore
    ), H.configure(
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
  static configure(e, t, s, o, n) {
    new oe(
      e,
      t,
      s,
      o,
      n
    );
  }
  tryStartEdgeDragging(e, t) {
    const s = this.params.draggingEdgeResolver(e);
    if (s === null || !this.canvas.graph.hasEdge(s))
      return !1;
    const o = this.canvas.graph.getEdge(s), n = e === o.from, a = e === o.to, h = n ? o.to : o.from;
    this.staticPortId = h, this.isTargetDragging = a;
    const d = this.canvas.graph.getPort(e), c = this.canvas.graph.getPort(h), g = c.element.getBoundingClientRect(), l = {
      x: g.x + g.width / 2,
      y: g.y + g.height / 2
    }, u = this.overlayLayer.getBoundingClientRect(), p = this.canvas.viewport.createContentCoords({
      x: l.x - u.x,
      y: l.y - u.y
    }), y = this.canvas.viewport.createContentCoords({
      x: t.x - u.x,
      y: t.y - u.y
    });
    this.draggingEdgePayload = {
      id: s,
      from: o.from,
      to: o.to,
      shape: o.shape,
      priority: o.priority
    }, this.canvas.removeEdge(s);
    const v = {
      overlayNodeId: N.StaticNodeId,
      portCoords: p,
      portDirection: c.direction
    }, x = {
      overlayNodeId: N.DraggingNodeId,
      portCoords: y,
      portDirection: d.direction
    }, [b, P] = this.isTargetDragging ? [v, x] : [x, v];
    this.overlayCanvas.addNode(O(b)), this.overlayCanvas.addNode(O(P));
    const C = this.params.draggingEdgeShapeFactory !== null ? this.params.draggingEdgeShapeFactory(N.EdgeId) : o.shape;
    return this.overlayCanvas.addEdge({
      id: N.EdgeId,
      from: b.overlayNodeId,
      to: P.overlayNodeId,
      shape: C
    }), !0;
  }
  resetDragState() {
    this.draggingEdgePayload = null, this.staticPortId = null, this.isTargetDragging = !0, this.overlayCanvas.clear();
  }
  moveDraggingPort(e) {
    const t = this.overlayLayer.getBoundingClientRect(), s = {
      x: e.x - t.x,
      y: e.y - t.y
    }, o = this.canvas.viewport.createContentCoords(s);
    this.overlayCanvas.updateNode(N.DraggingNodeId, {
      x: o.x,
      y: o.y
    });
  }
  tryCreateConnection(e) {
    const t = Ce(this.canvas.graph, e);
    if (this.overlayCanvas.removeEdge(N.EdgeId), t === null) {
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
    const [s, o] = this.isTargetDragging ? [this.staticPortId, t] : [t, this.staticPortId], n = this.draggingEdgePayload, a = {
      id: n.id,
      from: s,
      to: o,
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
class ie {
  constructor(e, t) {
    this.applier = e, this.trigger = t, this.trigger.subscribe(() => {
      this.applier.apply();
    });
  }
  static configure(e, t) {
    new ie(e, t);
  }
}
class ne {
  constructor(e, t, s) {
    i(this, "applyScheduled", !1);
    i(this, "apply", () => {
      this.applyScheduled = !1, this.applier.apply();
    });
    this.graph = e, this.applier = t, this.defererFn = s, this.graph.onAfterNodeAdded.subscribe(() => {
      this.scheduleApply();
    }), this.graph.onBeforeNodeRemoved.subscribe(() => {
      this.scheduleApply();
    }), this.graph.onAfterEdgeAdded.subscribe(() => {
      this.scheduleApply();
    }), this.graph.onBeforeEdgeRemoved.subscribe(() => {
      this.scheduleApply();
    });
  }
  static configure(e, t, s) {
    new ne(
      e,
      t,
      s
    );
  }
  scheduleApply() {
    this.applyScheduled || (this.applyScheduled = !0, this.defererFn(this.apply));
  }
}
class $t {
  static configure(e, t) {
    const s = t.applyOn, o = new Lt(e, t.algorithm, {
      staticNodeResolver: t.staticNodeResolver,
      onBeforeApplied: t.onBeforeApplied,
      onAfterApplied: t.onAfterApplied
    });
    switch (s.type) {
      case "trigger": {
        ie.configure(
          o,
          s.trigger
        );
        break;
      }
      case "topologyChangeSchedule": {
        ne.configure(
          e.graph,
          o,
          s.schedule
        );
        break;
      }
    }
  }
}
class Ut {
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
class ae {
  constructor(e, t, s) {
    i(this, "applier");
    i(this, "step", (e) => {
      this.applier.apply(e);
    });
    this.win = s, this.applier = new Vt(e, t.algorithm, {
      staticNodeResolver: t.staticNodeResolver,
      onBeforeApplied: t.onBeforeApplied,
      onAfterApplied: t.onAfterApplied
    }), new Ut(this.win, this.step);
  }
  static configure(e, t, s) {
    new ae(e, t, s);
  }
}
const Ot = () => {
  const r = document.createElement("div");
  return r.style.width = "100%", r.style.height = "100%", r.style.position = "relative", r;
}, j = () => {
  const r = document.createElement("div");
  return r.style.position = "absolute", r.style.inset = "0", r;
}, me = () => {
  const r = j();
  return r.style.pointerEvents = "none", r;
};
class Wt {
  constructor(e) {
    i(this, "background", j());
    i(this, "main", j());
    i(this, "overlayConnectablePorts", me());
    i(this, "overlayDraggableEdges", me());
    i(this, "host", Ot());
    this.element = e, this.element.appendChild(this.host), this.host.appendChild(this.background), this.host.appendChild(this.main), this.host.appendChild(this.overlayConnectablePorts), this.host.appendChild(this.overlayDraggableEdges);
  }
  destroy() {
    this.host.removeChild(this.background), this.host.removeChild(this.main), this.host.removeChild(this.overlayConnectablePorts), this.host.removeChild(this.overlayDraggableEdges), this.element.removeChild(this.host);
  }
}
const zt = (r) => {
  var p, y, v, x, b, P;
  const e = ((p = r.events) == null ? void 0 : p.onNodeDragStarted) ?? (() => {
  }), t = ((y = r.events) == null ? void 0 : y.onNodeDrag) ?? (() => {
  }), s = r.nodeDragVerifier ?? (() => !0), o = ((v = r.events) == null ? void 0 : v.onNodeDragFinished) ?? (() => {
  }), n = r.moveOnTop !== !1, a = r.moveEdgesOnTop !== !1 && n, h = (x = r.mouse) == null ? void 0 : x.dragCursor, d = h !== void 0 ? h : "grab", c = (b = r.mouse) == null ? void 0 : b.mouseDownEventVerifier, g = c !== void 0 ? c : (C) => C.button === 0, l = (P = r.mouse) == null ? void 0 : P.mouseUpEventVerifier, u = l !== void 0 ? l : (C) => C.button === 0;
  return {
    moveOnTop: n,
    moveEdgesOnTop: a,
    dragCursor: d,
    gridSize: r.gridSize ?? null,
    mouseDownEventVerifier: g,
    mouseUpEventVerifier: u,
    onNodeDragStarted: e,
    onNodeDrag: t,
    nodeDragVerifier: s,
    onNodeDragFinished: o
  };
}, kt = (r) => {
  const e = r.minX !== null ? r.minX : -1 / 0, t = r.maxX !== null ? r.maxX : 1 / 0, s = r.minY !== null ? r.minY : -1 / 0, o = r.maxY !== null ? r.maxY : 1 / 0;
  return (n) => {
    let a = n.nextTransform.x, h = n.nextTransform.y;
    a < e && a < n.prevTransform.x && (a = Math.min(n.prevTransform.x, e));
    const d = n.canvasWidth * n.prevTransform.scale, c = t - d;
    a > c && a > n.prevTransform.x && (a = Math.max(n.prevTransform.x, c)), h < s && h < n.prevTransform.y && (h = Math.min(n.prevTransform.y, s));
    const g = n.canvasHeight * n.prevTransform.scale, l = o - g;
    return h > l && h > n.prevTransform.y && (h = Math.max(n.prevTransform.y, l)), { scale: n.nextTransform.scale, x: a, y: h };
  };
}, Ht = (r) => {
  const e = r.maxContentScale, t = r.minContentScale, s = e !== null ? 1 / e : 0, o = t !== null ? 1 / t : 1 / 0;
  return (n) => {
    const a = n.prevTransform, h = n.nextTransform;
    let d = h.scale, c = h.x, g = h.y;
    if (h.scale > o && h.scale > a.scale) {
      d = Math.max(a.scale, o), c = a.x, g = a.y;
      const l = (d - a.scale) / (h.scale - a.scale);
      c = a.x + (h.x - a.x) * l, g = a.y + (h.y - a.y) * l;
    }
    if (h.scale < s && h.scale < a.scale) {
      d = Math.min(a.scale, s), c = a.x, g = a.y;
      const l = (d - a.scale) / (h.scale - a.scale);
      c = a.x + (h.x - a.x) * l, g = a.y + (h.y - a.y) * l;
    }
    return {
      scale: d,
      x: c,
      y: g
    };
  };
}, Yt = (r) => (e) => r.reduce(
  (t, s) => s({
    prevTransform: e.prevTransform,
    nextTransform: t,
    canvasWidth: e.canvasWidth,
    canvasHeight: e.canvasHeight
  }),
  e.nextTransform
), ve = (r) => {
  if (typeof r == "function")
    return r;
  switch (r.type) {
    case "scale-limit":
      return Ht({
        minContentScale: r.minContentScale ?? 0,
        maxContentScale: r.maxContentScale ?? 1 / 0
      });
    case "shift-limit":
      return kt({
        minX: r.minX ?? -1 / 0,
        maxX: r.maxX ?? 1 / 0,
        minY: r.minY ?? -1 / 0,
        maxY: r.maxY ?? 1 / 0
      });
  }
}, Ae = (r) => {
  var y, v, x, b, P, C, L, V, de, ce, le, ge;
  const e = (y = r == null ? void 0 : r.scale) == null ? void 0 : y.mouseWheelSensitivity, t = e !== void 0 ? e : 1.2, s = r == null ? void 0 : r.transformPreprocessor;
  let o;
  s !== void 0 ? Array.isArray(s) ? o = Yt(
    s.map(
      (T) => ve(T)
    )
  ) : o = ve(s) : o = (T) => T.nextTransform;
  const n = ((v = r == null ? void 0 : r.shift) == null ? void 0 : v.cursor) !== void 0 ? r.shift.cursor : "grab", a = ((x = r == null ? void 0 : r.events) == null ? void 0 : x.onBeforeTransformChange) ?? (() => {
  }), h = ((b = r == null ? void 0 : r.events) == null ? void 0 : b.onTransformChange) ?? (() => {
  }), d = (P = r == null ? void 0 : r.shift) == null ? void 0 : P.mouseDownEventVerifier, c = d !== void 0 ? d : (T) => T.button === 0, g = (C = r == null ? void 0 : r.shift) == null ? void 0 : C.mouseUpEventVerifier, l = g !== void 0 ? g : (T) => T.button === 0, u = (L = r == null ? void 0 : r.scale) == null ? void 0 : L.mouseWheelEventVerifier, p = u !== void 0 ? u : () => !0;
  return {
    wheelSensitivity: t,
    onTransformStarted: ((V = r == null ? void 0 : r.events) == null ? void 0 : V.onTransformStarted) ?? (() => {
    }),
    onTransformFinished: ((de = r == null ? void 0 : r.events) == null ? void 0 : de.onTransformFinished) ?? (() => {
    }),
    onBeforeTransformChange: a,
    onTransformChange: h,
    transformPreprocessor: o,
    shiftCursor: n,
    mouseDownEventVerifier: c,
    mouseUpEventVerifier: l,
    mouseWheelEventVerifier: p,
    scaleWheelFinishTimeout: ((ce = r == null ? void 0 : r.scale) == null ? void 0 : ce.wheelFinishTimeout) ?? 500,
    onResizeTransformStarted: ((le = r == null ? void 0 : r.events) == null ? void 0 : le.onResizeTransformStarted) ?? (() => {
    }),
    onResizeTransformFinished: ((ge = r == null ? void 0 : r.events) == null ? void 0 : ge.onResizeTransformFinished) ?? (() => {
    })
  };
}, Xt = (r, e) => {
  const t = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  return t.setAttribute("cx", "0"), t.setAttribute("cy", "0"), t.setAttribute("r", `${r}`), t.setAttribute("fill", `${e}`), t;
}, Gt = (r) => r instanceof SVGElement ? r : Xt(
  (r == null ? void 0 : r.radius) ?? 1.5,
  (r == null ? void 0 : r.color) ?? "#d8d8d8"
), jt = (r) => {
  const e = r.tileDimensions, t = (e == null ? void 0 : e.width) ?? 25, s = (e == null ? void 0 : e.height) ?? 25, o = Gt(r.renderer ?? {});
  return {
    tileWidth: t,
    tileHeight: s,
    renderer: o,
    maxViewportScale: r.maxViewportScale ?? 10
  };
}, he = (r) => {
  if (typeof r == "function")
    return r;
  switch (r.type) {
    case "straight":
      return () => new bt({
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
      return () => new St({
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
    case "direct":
      return () => new Ve({
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
      return () => new Et({
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
}, qt = (r, e, t) => {
  var c, g, l;
  const s = () => "direct", o = (u) => u, n = (u) => u.button === 0, a = () => {
  }, h = () => {
  }, d = () => {
  };
  return {
    connectionTypeResolver: r.connectionTypeResolver ?? s,
    connectionPreprocessor: r.connectionPreprocessor ?? o,
    mouseDownEventVerifier: r.mouseDownEventVerifier ?? n,
    mouseUpEventVerifier: r.mouseUpEventVerifier ?? n,
    onAfterEdgeCreated: ((c = r.events) == null ? void 0 : c.onAfterEdgeCreated) ?? a,
    onEdgeCreationInterrupted: ((g = r.events) == null ? void 0 : g.onEdgeCreationInterrupted) ?? d,
    onEdgeCreationPrevented: ((l = r.events) == null ? void 0 : l.onEdgeCreationPrevented) ?? h,
    dragPortDirection: r.dragPortDirection ?? t,
    edgeShapeFactory: r.edgeShape !== void 0 ? he(r.edgeShape) : e
  };
}, Kt = (r, e) => {
  var c, g, l;
  const t = (u) => u, s = (u) => u.button === 0 && u.ctrlKey, o = (u) => u.button === 0, n = (u) => {
    const p = e.getPortAdjacentEdgeIds(u);
    return p.length > 0 ? p[p.length - 1] : null;
  }, a = () => {
  }, h = () => {
  }, d = () => {
  };
  return {
    connectionPreprocessor: r.connectionPreprocessor ?? t,
    mouseDownEventVerifier: r.mouseDownEventVerifier ?? s,
    mouseUpEventVerifier: r.mouseUpEventVerifier ?? o,
    draggingEdgeResolver: r.draggingEdgeResolver ?? n,
    draggingEdgeShapeFactory: r.draggingEdgeShape !== void 0 ? he(r.draggingEdgeShape) : null,
    onAfterEdgeReattached: ((c = r.events) == null ? void 0 : c.onAfterEdgeReattached) ?? a,
    onEdgeReattachInterrupted: ((g = r.events) == null ? void 0 : g.onEdgeReattachInterrupted) ?? d,
    onEdgeReattachPrevented: ((l = r.events) == null ? void 0 : l.onEdgeReattachPrevented) ?? h
  };
}, Qt = (r) => ({
  nodeVerticalRadius: r.nodeContainingRadius.vertical,
  nodeHorizontalRadius: r.nodeContainingRadius.horizontal
}), Zt = (r) => {
  var e, t;
  return {
    onAfterNodeDetached: ((e = r == null ? void 0 : r.events) == null ? void 0 : e.onAfterNodeDetached) ?? (() => {
    }),
    onBeforeNodeAttached: ((t = r == null ? void 0 : r.events) == null ? void 0 : t.onBeforeNodeAttached) ?? (() => {
    })
  };
};
class Jt extends Error {
  constructor() {
    super(...arguments);
    i(this, "name", "CanvasBuilderError");
  }
}
class ke {
  constructor(e, t, s) {
    i(this, "dt");
    i(this, "nodeMass");
    i(this, "edgeEquilibriumLength");
    i(this, "edgeStiffness");
    i(this, "nodeForcesApplicationStrategy");
    i(this, "distanceVectorGenerator");
    this.graph = e, this.currentCoords = t, this.dt = s.dtSec, this.nodeMass = s.nodeMass, this.edgeEquilibriumLength = s.edgeEquilibriumLength, this.edgeStiffness = s.edgeStiffness, this.distanceVectorGenerator = s.distanceVectorGenerator, this.nodeForcesApplicationStrategy = s.nodeForcesApplicationStrategy;
  }
  apply() {
    let e = 0;
    const t = /* @__PURE__ */ new Map();
    return this.graph.getAllNodeIds().forEach((o) => {
      t.set(o, { x: 0, y: 0 });
    }), this.nodeForcesApplicationStrategy.apply(this.currentCoords, t), this.applyEdgeForces(t), this.currentCoords.forEach((o, n) => {
      const a = t.get(n), h = {
        x: a.x / this.nodeMass * this.dt,
        y: a.y / this.nodeMass * this.dt
      };
      e = Math.max(
        e,
        Math.sqrt(h.x * h.x + h.y * h.y)
      );
      const d = h.x * this.dt, c = h.y * this.dt;
      o.x += d, o.y += c;
    }), e;
  }
  applyEdgeForces(e) {
    this.graph.getAllEdgeIds().forEach((t) => {
      const s = this.graph.getEdge(t), o = this.graph.getPort(s.from), n = this.graph.getPort(s.to), a = this.currentCoords.get(o.nodeId), h = this.currentCoords.get(n.nodeId), d = this.distanceVectorGenerator.create(
        a,
        h
      ), g = (d.d - this.edgeEquilibriumLength) * this.edgeStiffness, l = d.ex * g, u = d.ey * g, p = e.get(o.nodeId), y = e.get(n.nodeId);
      p.x += l, p.y += u, y.x -= l, y.y -= u;
    });
  }
}
class He {
  constructor(e) {
    i(this, "PI2", 2 * Math.PI);
    this.rand = e;
  }
  create(e, t) {
    const s = t.x - e.x, o = t.y - e.y, n = s * s + o * o;
    if (n === 0) {
      const c = this.PI2 * this.rand();
      return {
        ex: Math.cos(c),
        ey: Math.sin(c),
        d: 0
      };
    }
    const a = Math.sqrt(n), h = s / a, d = o / a;
    return { ex: h, ey: d, d: a };
  }
}
const Ye = (r) => {
  if (r.distance === 0)
    return r.maxForce;
  const e = r.coefficient * (r.sourceCharge * r.targetCharge / (r.distance * r.distance));
  return Math.min(e, r.maxForce);
};
class _t {
  constructor(e) {
    i(this, "nodeCharge");
    i(this, "distanceVectorGenerator");
    i(this, "maxForce");
    this.nodeCharge = e.nodeCharge, this.distanceVectorGenerator = e.distanceVectorGenerator, this.maxForce = e.maxForce;
  }
  apply(e, t) {
    const s = Array.from(t.keys()), o = s.length;
    for (let n = 0; n < o; n++) {
      const a = s[n];
      for (let h = n + 1; h < o; h++) {
        const d = s[h], c = e.get(a), g = e.get(d), l = this.distanceVectorGenerator.create(
          c,
          g
        ), u = Ye({
          coefficient: 1,
          sourceCharge: this.nodeCharge,
          targetCharge: this.nodeCharge,
          distance: l.d,
          maxForce: this.maxForce
        }), p = u * l.ex, y = u * l.ey, v = t.get(a), x = t.get(d);
        v.x -= p, v.y -= y, x.x += p, x.y += y;
      }
    }
  }
}
const er = (r) => {
  if (r.size === 0)
    return {
      centerX: 0,
      centerY: 0,
      radius: 0
    };
  let e = 1 / 0, t = -1 / 0, s = 1 / 0, o = -1 / 0;
  r.forEach((d) => {
    e = Math.min(e, d.x), t = Math.max(t, d.x), s = Math.min(s, d.y), o = Math.max(o, d.y);
  });
  const n = t - e, a = o - s, h = Math.max(n, a);
  return {
    centerX: (e + t) / 2,
    centerY: (s + o) / 2,
    radius: h / 2
  };
};
class tr {
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
      const s = [];
      for (; t.length > 0; ) {
        const o = t.pop();
        this.processNode(o).forEach((a) => {
          s.push(a);
        });
      }
      t = s;
    }
    this.sortedParentNodes.reverse().forEach((s) => {
      let o = 0, n = 0, a = 0, h = 0;
      s.lb !== null && (a += s.lb.totalMass, h += s.lb.totalCharge, o += s.lb.chargeCenter.x * s.lb.totalCharge, n += s.lb.chargeCenter.y * s.lb.totalCharge), s.lt !== null && (a += s.lt.totalMass, h += s.lt.totalCharge, o += s.lt.chargeCenter.x * s.lt.totalCharge, n += s.lt.chargeCenter.y * s.lt.totalCharge), s.rb !== null && (a += s.rb.totalMass, h += s.rb.totalCharge, o += s.rb.chargeCenter.x * s.rb.totalCharge, n += s.rb.chargeCenter.y * s.rb.totalCharge), s.rt !== null && (a += s.rt.totalMass, h += s.rt.totalCharge, o += s.rt.chargeCenter.x * s.rt.totalCharge, n += s.rt.chargeCenter.y * s.rt.totalCharge), s.totalMass = a, s.totalCharge = h, s.chargeCenter.x = o / h, s.chargeCenter.y = n / h;
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
    const { centerX: t, centerY: s, radius: o } = e.box;
    if (o < this.areaRadiusThreshold)
      return this.setLeaf(e), [];
    this.sortedParentNodes.push(e);
    const n = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Set(), c = o / 2;
    e.nodeIds.forEach((u) => {
      const { x: p, y } = this.coords.get(u);
      p < t ? y < s ? d.add(u) : h.add(u) : y < s ? a.add(u) : n.add(u), e.nodeIds.delete(u);
    });
    const g = {
      parent: e,
      lb: null,
      lt: null,
      rb: null,
      rt: null
    }, l = [];
    if (n.size > 0) {
      const u = {
        nodeIds: n,
        totalMass: 0,
        totalCharge: 0,
        chargeCenter: {
          x: 0,
          y: 0
        },
        box: {
          centerX: t + c,
          centerY: s + c,
          radius: c
        },
        ...g
      };
      e.rt = u, l.push(u);
    }
    if (a.size > 0) {
      const u = {
        nodeIds: a,
        totalMass: 0,
        totalCharge: 0,
        chargeCenter: {
          x: 0,
          y: 0
        },
        box: {
          centerX: t + c,
          centerY: s - c,
          radius: c
        },
        ...g
      };
      e.rb = u, l.push(u);
    }
    if (h.size > 0) {
      const u = {
        nodeIds: h,
        totalMass: 0,
        totalCharge: 0,
        chargeCenter: {
          x: 0,
          y: 0
        },
        box: {
          centerX: t - c,
          centerY: s + c,
          radius: c
        },
        ...g
      };
      e.lt = u, l.push(u);
    }
    if (d.size > 0) {
      const u = {
        nodeIds: d,
        totalMass: 0,
        totalCharge: 0,
        chargeCenter: {
          x: 0,
          y: 0
        },
        box: {
          centerX: t - c,
          centerY: s - c,
          radius: c
        },
        ...g
      };
      e.lb = u, l.push(u);
    }
    return l;
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
    let t = 0, s = 0;
    return e.forEach((o) => {
      const n = this.coords.get(o);
      t += n.x, s += n.y;
    }), { x: t / e.size, y: s / e.size };
  }
}
class rr {
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
    const s = er(e), o = new tr({
      box: s,
      coords: e,
      areaRadiusThreshold: this.areaRadiusThreshold,
      nodeMass: this.nodeMass,
      nodeCharge: this.nodeCharge
    });
    e.forEach((n, a) => {
      const h = this.calculateForceForNode(
        o.getLeaf(a),
        a,
        e
      ), d = t.get(a);
      this.applyForce(d, h);
    });
  }
  calculateForceForNode(e, t, s) {
    const o = s.get(t), n = { x: 0, y: 0 };
    e.nodeIds.forEach((h) => {
      if (h !== t) {
        const d = s.get(h), c = this.calculateNodeRepulsiveForce({
          sourceCharge: this.nodeCharge,
          targetCharge: this.nodeCharge,
          sourceCoords: d,
          targetCoords: o
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
          o
        );
        h.box.radius * 2 < d.d * this.theta ? (this.tryApplyFarForce({
          totalForce: n,
          targetCoords: o,
          target: h.lb,
          current: a
        }), this.tryApplyFarForce({
          totalForce: n,
          targetCoords: o,
          target: h.rb,
          current: a
        }), this.tryApplyFarForce({
          totalForce: n,
          targetCoords: o,
          target: h.rt,
          current: a
        }), this.tryApplyFarForce({
          totalForce: n,
          targetCoords: o,
          target: h.lt,
          current: a
        })) : (this.tryApplyNearForce({
          totalForce: n,
          targetCoords: o,
          target: h.lb,
          current: a,
          nodesCoords: s
        }), this.tryApplyNearForce({
          totalForce: n,
          targetCoords: o,
          target: h.rb,
          current: a,
          nodesCoords: s
        }), this.tryApplyNearForce({
          totalForce: n,
          targetCoords: o,
          target: h.rt,
          current: a,
          nodesCoords: s
        }), this.tryApplyNearForce({
          totalForce: n,
          targetCoords: o,
          target: h.lt,
          current: a,
          nodesCoords: s
        }));
      }
      a = a.parent;
    }
    return n;
  }
  calculateExactForce(e, t, s) {
    const o = { x: 0, y: 0 }, n = [e];
    for (; n.length > 0; ) {
      const a = n.pop();
      a.nodeIds.forEach((h) => {
        const d = s.get(h), c = this.calculateNodeRepulsiveForce({
          sourceCharge: this.nodeCharge,
          targetCharge: this.nodeCharge,
          sourceCoords: d,
          targetCoords: t
        });
        this.applyForce(o, c);
      }), a.lb !== null && n.push(a.lb), a.rb !== null && n.push(a.rb), a.lt !== null && n.push(a.lt), a.rt !== null && n.push(a.rt);
    }
    return o;
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
    ), s = Ye({
      coefficient: this.nodeForceCoefficient,
      sourceCharge: e.sourceCharge,
      targetCharge: e.targetCharge,
      distance: t.d,
      maxForce: this.maxForce
    });
    return {
      x: s * t.ex,
      y: s * t.ey
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
const Xe = (r) => r.theta !== 0 ? new rr({
  nodeCharge: r.nodeCharge,
  nodeForceCoefficient: r.nodeForceCoefficient,
  distanceVectorGenerator: r.distanceVectorGenerator,
  maxForce: r.maxForce,
  theta: r.theta,
  nodeMass: r.nodeMass,
  areaRadiusThreshold: r.areaRadiusThreshold
}) : new _t({
  nodeCharge: r.nodeCharge,
  nodeForceCoefficient: r.nodeForceCoefficient,
  distanceVectorGenerator: r.distanceVectorGenerator,
  maxForce: r.maxForce
});
class Ge {
  constructor(e) {
    i(this, "rand");
    i(this, "sparsity");
    this.rand = e.rand, this.sparsity = e.sparsity;
  }
  calculateCoordinates(e) {
    const { graph: t, viewport: s } = e, o = /* @__PURE__ */ new Map(), n = t.getAllNodeIds().filter((y) => {
      const v = t.getNode(y);
      return v.x === null || v.y === null;
    }), a = Math.sqrt(n.length) * this.sparsity, { width: h, height: d } = s.getDimensions(), c = { x: h / 2, y: d / 2 }, g = s.createContentCoords(c), l = a / 2, u = {
      x: g.x - l,
      y: g.y - l
    };
    return t.getAllNodeIds().forEach((y) => {
      const v = t.getNode(y);
      o.set(y, {
        x: v.x ?? u.x + a * this.rand(),
        y: v.y ?? u.y + a * this.rand()
      });
    }), o;
  }
}
class sr {
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
    this.maxIterations = e.maxIterations, this.dtSec = e.dtSec, this.nodeMass = e.nodeMass, this.edgeEquilibriumLength = e.edgeEquilibriumLength, this.edgeStiffness = e.edgeStiffness, this.convergenceVelocity = e.convergenceVelocity, this.distanceVectorGenerator = new He(e.rand), this.nodeForcesApplicationStrategy = Xe({
      distanceVectorGenerator: this.distanceVectorGenerator,
      nodeCharge: e.nodeCharge,
      maxForce: e.maxForce,
      nodeForceCoefficient: e.nodeForceCoefficient,
      theta: e.barnesHutTheta,
      areaRadiusThreshold: e.barnesHutAreaRadiusThreshold,
      nodeMass: e.nodeMass
    }), this.fillerLayoutAlgorithm = new Ge({
      rand: e.rand,
      sparsity: e.edgeEquilibriumLength
    });
  }
  calculateCoordinates(e) {
    const { graph: t, viewport: s } = e, o = this.fillerLayoutAlgorithm.calculateCoordinates({
      graph: t,
      viewport: s
    });
    for (let n = 0; n < this.maxIterations && !(new ke(
      t,
      o,
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
    return o;
  }
}
class or {
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
    }, s = [];
    this.forest.add({ root: t, sequence: s });
    let o = [t];
    for (; o.length > 0; ) {
      const n = [];
      o.forEach((a) => {
        s.push(a), this.remainingNodeIds.delete(a.nodeId);
        const h = this.graph.getNodeOutgoingEdgeIds(a.nodeId).map((g) => {
          const l = this.graph.getEdge(g);
          return this.graph.getPort(l.to).nodeId;
        }), d = this.graph.getNodeIncomingEdgeIds(a.nodeId).map((g) => {
          const l = this.graph.getEdge(g);
          return this.graph.getPort(l.from).nodeId;
        });
        [...h, ...d].forEach((g) => {
          if (!this.remainingNodeIds.has(g))
            return;
          const l = {
            nodeId: g,
            children: /* @__PURE__ */ new Set()
          };
          a.children.add(l), n.push(l);
        });
      }), o = n;
    }
  }
}
class ir {
  constructor(e) {
    i(this, "baseRadius");
    this.baseRadius = e.radius;
  }
  resolve(e) {
    let t = 0, s = -1 / 0;
    const o = [];
    e.forEach((h) => {
      h === null ? (t += this.baseRadius, o.push(t), t += this.baseRadius) : t + this.baseRadius - h < s ? (s += h, o.push(s), t = s + this.baseRadius, s += h) : (t += this.baseRadius, o.push(t), s = t + h, t += this.baseRadius);
    });
    const n = t / 2;
    let a = 0;
    if (e.length > 0) {
      const h = e[e.length - 1] ?? 0, d = o[o.length - 1];
      a = Math.max(
        a,
        d + h - t
      );
      const c = e[0] ?? 0, g = o[0];
      a = Math.max(a, c - g);
    }
    return {
      offsets: o.map((h) => h - n),
      radius: n + a
    };
  }
}
class nr {
  constructor(e, t) {
    i(this, "offsets", /* @__PURE__ */ new Map());
    i(this, "childrenRadii", /* @__PURE__ */ new Map());
    i(this, "layerNodePlacementResolver");
    this.tree = e, this.layerNodePlacementResolver = new ir({
      radius: t.spaceAroundRadius
    }), [...this.tree.sequence].reverse().forEach((s) => {
      if (s.children.size === 0)
        this.childrenRadii.set(s.nodeId, null);
      else {
        const o = Array.from(s.children).map(
          (h) => this.childrenRadii.get(h.nodeId)
        ), n = this.layerNodePlacementResolver.resolve(o);
        this.childrenRadii.set(s.nodeId, n.radius);
        let a = 0;
        s.children.forEach((h) => {
          this.offsets.set(h.nodeId, n.offsets[a]), a++;
        });
      }
    }), this.offsets.set(this.tree.root.nodeId, 0);
  }
  generate() {
    return this.offsets;
  }
}
class ar {
  constructor(e) {
    this.params = e;
  }
  calculateCoordinates(e) {
    const t = /* @__PURE__ */ new Map(), o = new or(e.graph).generate();
    let n = 0;
    return o.forEach((a) => {
      t.set(a.root.nodeId, { x: n, y: 0 });
      const d = new nr(a, {
        spaceAroundRadius: this.params.layerSpace / 2
      }).generate();
      let c = [a.root];
      for (; c.length > 0; ) {
        const g = [];
        n += this.params.layerWidth, c.forEach((l) => {
          l.children.forEach((u) => {
            const p = t.get(l.nodeId).y;
            t.set(u.nodeId, {
              y: p + d.get(u.nodeId),
              x: n
            }), g.push(u);
          });
        }), c = g;
      }
    }), t.forEach((a) => {
      const h = this.params.transform(a);
      a.x = h.x, a.y = h.y;
    }), t;
  }
}
class hr {
  constructor(e) {
    i(this, "distanceVectorGenerator");
    i(this, "nodeForcesApplicationStrategy");
    i(this, "convergenceVelocity");
    i(this, "maxTimeDeltaSec");
    i(this, "nodeMass");
    i(this, "edgeEquilibriumLength");
    i(this, "edgeStiffness");
    i(this, "fillerLayoutAlgorithm");
    this.convergenceVelocity = e.convergenceVelocity, this.maxTimeDeltaSec = e.maxTimeDeltaSec, this.nodeMass = e.nodeMass, this.edgeEquilibriumLength = e.edgeEquilibriumLength, this.edgeStiffness = e.edgeStiffness, this.distanceVectorGenerator = new He(e.rand), this.nodeForcesApplicationStrategy = Xe({
      distanceVectorGenerator: this.distanceVectorGenerator,
      nodeCharge: e.nodeCharge,
      maxForce: e.maxForce,
      nodeForceCoefficient: e.nodeForceCoefficient,
      theta: e.barnesHutTheta,
      areaRadiusThreshold: e.barnesHutAreaRadiusThreshold,
      nodeMass: e.nodeMass
    }), this.fillerLayoutAlgorithm = new Ge({
      rand: e.rand,
      sparsity: e.edgeEquilibriumLength
    });
  }
  calculateNextCoordinates(e) {
    const { graph: t, viewport: s, dt: o } = e, n = this.fillerLayoutAlgorithm.calculateCoordinates({
      graph: t,
      viewport: s
    });
    return new ke(
      t,
      n,
      {
        distanceVectorGenerator: this.distanceVectorGenerator,
        nodeForcesApplicationStrategy: this.nodeForcesApplicationStrategy,
        dtSec: Math.min(o, this.maxTimeDeltaSec),
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
const je = (r) => {
  let e = 1779033703, t = 3144134277, s = 1013904242, o = 2773480762;
  for (let n = 0, a; n < r.length; n++)
    a = r.charCodeAt(n), e = t ^ Math.imul(e ^ a, 597399067), t = s ^ Math.imul(t ^ a, 2869860233), s = o ^ Math.imul(s ^ a, 951274213), o = e ^ Math.imul(o ^ a, 2716044179);
  return e = Math.imul(s ^ e >>> 18, 597399067), t = Math.imul(o ^ t >>> 22, 2869860233), s = Math.imul(e ^ s >>> 17, 951274213), o = Math.imul(t ^ o >>> 19, 2716044179), e ^= t ^ s ^ o, t ^= e, s ^= e, o ^= e, [e >>> 0, t >>> 0, s >>> 0, o >>> 0];
}, qe = (r, e, t, s) => function() {
  r |= 0, e |= 0, t |= 0, s |= 0;
  const o = (r + e | 0) + s | 0;
  return s = s + 1 | 0, r = e ^ e >>> 9, e = t + (t << 3) | 0, t = t << 21 | t >>> 11, t = t + o | 0, (o >>> 0) / 4294967296;
}, A = Object.freeze({
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
}), dr = (r) => {
  var e, t;
  switch (r == null ? void 0 : r.type) {
    case "custom":
      return r.instance;
    default: {
      const s = je((r == null ? void 0 : r.seed) ?? A.seed), o = qe(s[0], s[1], s[2], s[3]);
      return new hr({
        rand: o,
        maxTimeDeltaSec: (r == null ? void 0 : r.maxTimeDeltaSec) ?? A.maxTimeDeltaSec,
        nodeCharge: (r == null ? void 0 : r.nodeCharge) ?? A.nodeCharge,
        nodeMass: (r == null ? void 0 : r.nodeMass) ?? A.nodeMass,
        edgeEquilibriumLength: (r == null ? void 0 : r.edgeEquilibriumLength) ?? A.edgeEquilibriumLength,
        edgeStiffness: (r == null ? void 0 : r.edgeStiffness) ?? A.edgeStiffness,
        convergenceVelocity: (r == null ? void 0 : r.convergenceVelocity) ?? A.convergenceVelocity,
        maxForce: (r == null ? void 0 : r.maxForce) ?? A.maxForce,
        nodeForceCoefficient: (r == null ? void 0 : r.nodeForceCoefficient) ?? A.nodeForceCoefficient,
        barnesHutTheta: ((e = r == null ? void 0 : r.barnesHut) == null ? void 0 : e.theta) ?? A.barnesHutTheta,
        barnesHutAreaRadiusThreshold: ((t = r == null ? void 0 : r.barnesHut) == null ? void 0 : t.areaRadiusThreshold) ?? A.barnesHutAreaRadiusThreshold
      });
    }
  }
}, G = {
  staticNodeResolver: () => !1,
  onBeforeApplied: () => {
  },
  onAfterApplied: () => {
  }
}, cr = (r) => {
  var t, s;
  return {
    algorithm: dr((r == null ? void 0 : r.algorithm) ?? {}),
    staticNodeResolver: (r == null ? void 0 : r.staticNodeResolver) ?? G.staticNodeResolver,
    onBeforeApplied: ((t = r == null ? void 0 : r.events) == null ? void 0 : t.onBeforeApplied) ?? G.onBeforeApplied,
    onAfterApplied: ((s = r == null ? void 0 : r.events) == null ? void 0 : s.onAfterApplied) ?? G.onAfterApplied
  };
}, lr = (r) => r instanceof K ? {
  type: "trigger",
  trigger: r
} : (r == null ? void 0 : r.type) === "topologyChangeMacrotask" ? {
  type: "topologyChangeSchedule",
  schedule: Mt
} : {
  type: "topologyChangeSchedule",
  schedule: Rt
}, F = Object.freeze({
  staticNodeResolver: () => !1,
  onBeforeApplied: () => {
  },
  onAfterApplied: () => {
  },
  hierarchicalLayout: {
    layerWidth: 300,
    layerSpace: 300
  }
}), $ = (r, e) => ({
  a: r.a * e.a + r.b * e.d,
  b: r.a * e.b + r.b * e.e,
  c: r.a * e.c + r.b * e.f + r.c,
  d: r.d * e.a + r.e * e.d,
  e: r.d * e.b + r.e * e.e,
  f: r.d * e.c + r.e * e.f + r.f
}), gr = (r) => {
  const { a: e, b: t, c: s, d: o, e: n, f: a } = r, h = e * n - t * o;
  return {
    a: n / h,
    b: -t / h,
    c: (t * a - s * n) / h,
    d: -o / h,
    e: e / h,
    f: (s * o - e * a) / h
  };
};
class ur {
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
    const s = this.createScaleBaseMatrix(e), o = this.createShiftBaseMatrix(t);
    return this.createRelativeTransform(s, o);
  }
  createRotateRelativeMatrix(e, t) {
    const s = this.createRotateBaseMatrix(e), o = this.createShiftBaseMatrix(t);
    return this.createRelativeTransform(s, o);
  }
  createMirrorRelativeMatrix(e, t) {
    const s = this.createMirrorYBaseMatrix(), o = $(
      this.createShiftBaseMatrix(t),
      this.createRotateBaseMatrix(e)
    );
    return this.createRelativeTransform(s, o);
  }
  createRelativeTransform(e, t) {
    const s = $(
      t,
      e
    ), o = gr(t);
    return $(s, o);
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
    const t = Math.sin(e), s = Math.cos(e);
    return {
      a: s,
      b: -t,
      c: 0,
      d: t,
      e: s,
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
const pr = (r) => {
  if (r === void 0)
    return (o) => o;
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
  const s = new ur();
  return e.forEach((o) => {
    const n = s.resolve(o);
    t = $(t, n);
  }), (o) => {
    const { x: n, y: a } = o;
    return {
      x: t.a * n + t.b * a + t.c,
      y: t.d * n + t.e * a + t.f
    };
  };
}, wr = (r) => {
  var e, t;
  switch (r == null ? void 0 : r.type) {
    case "custom":
      return r.instance;
    case "hierarchical":
      return new ar({
        layerWidth: r.layerWidth ?? F.hierarchicalLayout.layerWidth,
        layerSpace: r.layerSpace ?? F.hierarchicalLayout.layerSpace,
        transform: pr(r.transform)
      });
    default: {
      const s = je((r == null ? void 0 : r.seed) ?? A.seed), o = qe(s[0], s[1], s[2], s[3]);
      return new sr({
        dtSec: (r == null ? void 0 : r.dtSec) ?? A.dtSec,
        maxIterations: (r == null ? void 0 : r.maxIterations) ?? A.maxIterations,
        rand: o,
        nodeCharge: (r == null ? void 0 : r.nodeCharge) ?? A.nodeCharge,
        nodeMass: (r == null ? void 0 : r.nodeMass) ?? A.nodeMass,
        edgeEquilibriumLength: (r == null ? void 0 : r.edgeEquilibriumLength) ?? A.edgeEquilibriumLength,
        edgeStiffness: (r == null ? void 0 : r.edgeStiffness) ?? A.edgeStiffness,
        convergenceVelocity: (r == null ? void 0 : r.convergenceVelocity) ?? A.convergenceVelocity,
        maxForce: (r == null ? void 0 : r.maxForce) ?? A.maxForce,
        nodeForceCoefficient: (r == null ? void 0 : r.nodeForceCoefficient) ?? A.nodeForceCoefficient,
        barnesHutTheta: ((e = r == null ? void 0 : r.barnesHut) == null ? void 0 : e.theta) ?? A.barnesHutTheta,
        barnesHutAreaRadiusThreshold: ((t = r == null ? void 0 : r.barnesHut) == null ? void 0 : t.areaRadiusThreshold) ?? A.barnesHutAreaRadiusThreshold
      });
    }
  }
}, yr = (r) => {
  var e, t;
  return {
    algorithm: wr(r.algorithm),
    applyOn: lr(r.applyOn),
    staticNodeResolver: r.staticNodeResolver ?? F.staticNodeResolver,
    onBeforeApplied: ((e = r.events) == null ? void 0 : e.onBeforeApplied) ?? F.onBeforeApplied,
    onAfterApplied: ((t = r.events) == null ? void 0 : t.onAfterApplied) ?? F.onAfterApplied
  };
}, fr = (r, e) => ({
  ...r,
  onNodeDragStarted: (t) => {
    e.add(t), r.onNodeDragStarted(t);
  },
  onNodeDragFinished: (t) => {
    e.delete(t), r.onNodeDragFinished(t);
  }
}), mr = (r, e) => {
  r.graph.onBeforeNodeRemoved.subscribe((t) => {
    e.delete(t);
  }), r.graph.onBeforeClear.subscribe(() => {
    e.clear();
  }), r.onBeforeDestroy.subscribe(() => {
    e.clear();
  });
}, vr = (r, e) => ({
  ...r,
  staticNodeResolver: (t) => r.staticNodeResolver(t) || e.has(t)
}), q = (r) => () => r, xe = q(0), Ar = () => {
  let r = 0;
  return () => r++;
}, xr = (r, e) => {
  let t = xe, s = xe;
  const o = Ar();
  return r === "incremental" && (t = o), e === "incremental" && (s = o), typeof r == "number" && (t = q(r)), typeof e == "number" && (s = q(e)), typeof r == "function" && (t = r), typeof e == "function" && (s = e), {
    nodesPriorityFn: t,
    edgesPriorityFn: s
  };
}, Er = (r) => {
  var t, s, o, n, a;
  const e = xr(
    (t = r.nodes) == null ? void 0 : t.priority,
    (s = r.edges) == null ? void 0 : s.priority
  );
  return {
    nodes: {
      centerFn: ((o = r.nodes) == null ? void 0 : o.centerFn) ?? Ne,
      priorityFn: e.nodesPriorityFn
    },
    ports: {
      direction: ((n = r.ports) == null ? void 0 : n.direction) ?? 0
    },
    edges: {
      shapeFactory: he(((a = r.edges) == null ? void 0 : a.shape) ?? {}),
      priorityFn: e.edgesPriorityFn
    }
  };
}, Sr = (r) => r.applyOn.type === "topologyChangeSchedule" ? r.applyOn.schedule : _, br = (r) => {
  var s, o;
  const { canvasDefaults: e } = r, t = r.hasLayout ? Sr(r.layoutParams) : _;
  return {
    focus: {
      contentOffset: ((s = e.focus) == null ? void 0 : s.contentOffset) ?? 100,
      minContentScale: ((o = e.focus) == null ? void 0 : o.minContentScale) ?? 0,
      schedule: t
    }
  };
};
class Nr {
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
    i(this, "boxRenderingTrigger", new K());
    i(this, "graphStore");
    i(this, "viewportStore");
    i(this, "graph");
    i(this, "viewport");
    i(this, "window", window);
    i(this, "animationStaticNodes", /* @__PURE__ */ new Set());
    this.element = e, this.viewportStore = new it(this.element), this.viewport = new $e(this.viewportStore), this.graphStore = new be(), this.graph = new Ie(this.graphStore);
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
      throw new Jt("CanvasBuilder is a single use object");
    this.used = !0;
    const e = new Wt(this.element), t = this.createHtmlView(e.main), s = Er(
      this.canvasDefaults
    ), o = new Be(
      this.graphStore,
      t,
      s
    ), n = yr(this.layoutConfig), a = br({
      canvasDefaults: this.canvasDefaults,
      hasLayout: this.hasLayout,
      layoutParams: n
    }), h = new We(
      this.graphStore,
      this.viewportStore,
      a
    ), d = new Se(
      this.graph,
      this.viewport,
      o,
      h
    );
    if (this.hasBackground && re.configure(
      d,
      jt(this.backgroundConfig),
      e.background
    ), this.hasNodeResizeReactiveEdges && Q.configure(d), this.hasDraggableNodes) {
      let g = zt(this.dragConfig);
      this.hasAnimatedLayout && (g = fr(
        g,
        this.animationStaticNodes
      )), ee.configure(
        d,
        e.main,
        this.window,
        g
      );
    }
    if (this.hasUserConnectablePorts) {
      const g = qt(
        this.connectablePortsConfig,
        s.edges.shapeFactory,
        s.ports.direction
      );
      se.configure(
        d,
        e.overlayConnectablePorts,
        this.viewportStore,
        this.window,
        g
      );
    }
    if (this.hasUserDraggableEdges) {
      const g = Kt(
        this.draggableEdgesConfig,
        d.graph
      );
      oe.configure(
        d,
        e.overlayDraggableEdges,
        this.viewportStore,
        this.window,
        g
      );
    }
    if (this.virtualScrollConfig !== void 0 ? te.configure(
      d,
      e.main,
      this.window,
      Ae(this.transformConfig),
      this.boxRenderingTrigger,
      Qt(this.virtualScrollConfig)
    ) : this.hasTransformableViewport && Y.configure(
      d,
      e.main,
      this.window,
      Ae(this.transformConfig)
    ), this.hasLayout && $t.configure(d, n), this.hasAnimatedLayout) {
      let g = cr(
        this.animatedLayoutConfig
      );
      this.hasDraggableNodes && (mr(
        d,
        this.animationStaticNodes
      ), g = vr(
        g,
        this.animationStaticNodes
      )), ae.configure(d, g, this.window);
    }
    const c = () => {
      e.destroy(), d.onBeforeDestroy.unsubscribe(c);
    };
    return d.onBeforeDestroy.subscribe(c), d;
  }
  createHtmlView(e) {
    let t = new Ee(
      this.graphStore,
      this.viewportStore,
      e
    );
    return this.virtualScrollConfig !== void 0 && (t = new rt(
      t,
      this.graphStore,
      this.boxRenderingTrigger,
      Zt(this.virtualScrollConfig)
    )), t = new st(t, this.graphStore), t;
  }
}
export {
  Et as BezierEdgeShape,
  Nr as CanvasBuilder,
  Jt as CanvasBuilderError,
  E as CanvasError,
  R as ConnectionCategory,
  Ve as DirectEdgeShape,
  K as EventSubject,
  St as HorizontalEdgeShape,
  Tt as InteractiveEdgeError,
  Fe as InteractiveEdgeShape,
  Cr as MidpointEdgeShape,
  bt as StraightEdgeShape,
  Pt as VerticalEdgeShape
};
