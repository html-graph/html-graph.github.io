var He = Object.defineProperty;
var Xe = (r, e, t) => e in r ? He(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var o = (r, e, t) => Xe(r, typeof e != "symbol" ? e + "" : e, t);
var M = /* @__PURE__ */ ((r) => (r.Line = "line", r.NodeCycle = "node-cycle", r.PortCycle = "port-cycle", r))(M || {});
const Ye = () => {
  const r = document.createElement("div");
  return r.style.width = "100%", r.style.height = "100%", r.style.position = "relative", r.style.overflow = "hidden", r;
}, Ge = () => {
  const r = document.createElement("div");
  return r.style.position = "absolute", r.style.top = "0", r.style.left = "0", r.style.width = "0", r.style.height = "0", r;
}, je = (r) => {
  r.style.position = "absolute", r.style.top = "0", r.style.left = "0", r.style.visibility = "hidden";
};
class Ae {
  constructor(e, t, s) {
    o(this, "host", Ye());
    o(this, "container", Ge());
    o(this, "edgeIdToElementMap", /* @__PURE__ */ new Map());
    o(this, "attachedNodeIds", /* @__PURE__ */ new Set());
    o(this, "applyTransform", () => {
      const e = this.viewportStore.getContentMatrix();
      this.container.style.transform = `matrix(${e.scale}, 0, 0, ${e.scale}, ${e.x}, ${e.y})`;
    });
    this.graphStore = e, this.viewportStore = t, this.element = s, this.element.appendChild(this.host), this.host.appendChild(this.container), this.viewportStore.onAfterUpdated.subscribe(this.applyTransform);
  }
  attachNode(e) {
    const t = this.graphStore.getNode(e);
    je(t.element), this.attachedNodeIds.add(e), this.container.appendChild(t.element), this.updateNodePosition(e), this.updateNodePriority(e), t.element.style.visibility = "visible";
  }
  detachNode(e) {
    const t = this.graphStore.getNode(e);
    this.container.removeChild(t.element), this.attachedNodeIds.delete(e);
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
    this.viewportStore.onAfterUpdated.unsubscribe(this.applyTransform), this.element.removeChild(this.host), this.host.removeChild(this.container);
  }
  updateNodePosition(e) {
    const t = this.graphStore.getNode(e), { width: s, height: i } = t.element.getBoundingClientRect(), n = this.viewportStore.getViewportMatrix().scale, { payload: a } = t, h = a.centerFn(s, i), d = a.x - n * h.x, c = a.y - n * h.y;
    t.element.style.transform = `translate(${d}px, ${c}px)`;
  }
  updateNodePriority(e) {
    const t = this.graphStore.getNode(e);
    t.element.style.zIndex = `${t.payload.priority}`;
  }
  updateEdgeShape(e) {
    const t = this.edgeIdToElementMap.get(e);
    this.container.removeChild(t);
    const i = this.graphStore.getEdge(e).payload.shape.svg;
    this.edgeIdToElementMap.set(e, i), this.container.appendChild(i);
  }
  renderEdge(e) {
    const t = this.graphStore.getEdge(e), s = this.graphStore.getPort(t.from), i = this.graphStore.getPort(t.to), n = s.element.getBoundingClientRect(), a = i.element.getBoundingClientRect(), h = this.host.getBoundingClientRect(), d = this.viewportStore.getViewportMatrix().scale, c = this.createEdgeRenderPort(
      s,
      n,
      h,
      d
    ), g = this.createEdgeRenderPort(i, a, h, d);
    let l = M.Line;
    s.element === i.element ? l = M.PortCycle : s.nodeId === i.nodeId && (l = M.NodeCycle), t.payload.shape.render({ from: c, to: g, category: l });
  }
  updateEdgePriority(e) {
    const t = this.graphStore.getEdge(e);
    t.payload.shape.svg.style.zIndex = `${t.payload.priority}`;
  }
  createEdgeRenderPort(e, t, s, i) {
    const n = this.viewportStore.createContentCoords({
      x: t.left - s.left,
      y: t.top - s.top
    });
    return {
      x: n.x,
      y: n.y,
      width: t.width * i,
      height: t.height * i,
      direction: e.payload.direction
    };
  }
}
class qe {
  constructor(e) {
    o(this, "xFrom", 1 / 0);
    o(this, "yFrom", 1 / 0);
    o(this, "xTo", 1 / 0);
    o(this, "yTo", 1 / 0);
    this.graphStore = e;
  }
  setRenderingBox(e) {
    this.xFrom = e.x, this.xTo = e.x + e.width, this.yFrom = e.y, this.yTo = e.y + e.height;
  }
  hasNode(e) {
    const t = this.graphStore.getNode(e).payload, { x: s, y: i } = t;
    return s >= this.xFrom && s <= this.xTo && i >= this.yFrom && i <= this.yTo;
  }
  hasEdge(e) {
    const t = this.graphStore.getEdge(e), s = this.graphStore.getPort(t.from).nodeId, i = this.graphStore.getPort(t.to).nodeId, n = this.graphStore.getNode(s).payload, a = this.graphStore.getNode(i).payload, h = Math.min(n.x, a.x), d = Math.max(n.x, a.x), c = Math.min(n.y, a.y), g = Math.max(n.y, a.y);
    return h <= this.xTo && d >= this.xFrom && c <= this.yTo && g >= this.yFrom;
  }
}
class Ke {
  constructor(e, t, s, i) {
    o(this, "attachedNodes", /* @__PURE__ */ new Set());
    o(this, "attachedEdges", /* @__PURE__ */ new Set());
    o(this, "renderingBox");
    o(this, "updateViewport", (e) => {
      this.renderingBox.setRenderingBox(e);
      const t = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
      this.graphStore.getAllNodeIds().forEach((a) => {
        const h = this.renderingBox.hasNode(a), d = this.attachedNodes.has(a);
        h && !d ? t.add(a) : !h && d && s.add(a);
      }), this.graphStore.getAllEdgeIds().forEach((a) => {
        const h = this.renderingBox.hasEdge(a), d = this.attachedEdges.has(a), c = this.graphStore.getEdge(a), g = this.graphStore.getPort(c.from).nodeId, l = this.graphStore.getPort(c.to).nodeId;
        h && (this.renderingBox.hasNode(g) || (t.add(g), s.delete(g)), this.renderingBox.hasNode(l) || (t.add(l), s.delete(l))), h && !d ? i.add(a) : !h && d && n.add(a);
      }), n.forEach((a) => {
        this.handleDetachEdge(a);
      }), s.forEach((a) => {
        this.handleDetachNode(a);
      }), t.forEach((a) => {
        this.attachedNodes.has(a) || this.handleAttachNode(a);
      }), i.forEach((a) => {
        this.handleAttachEdge(a);
      });
    });
    this.htmlView = e, this.graphStore = t, this.trigger = s, this.params = i, this.renderingBox = new qe(this.graphStore), this.trigger.subscribe(this.updateViewport);
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
    const t = this.graphStore.getEdge(e), s = this.graphStore.getPort(t.from).nodeId, i = this.graphStore.getPort(t.to).nodeId;
    this.attachedNodes.has(s) || this.handleAttachNode(s), this.attachedNodes.has(i) || this.handleAttachNode(i), this.handleAttachEdge(e);
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
class Qe {
  constructor(e, t) {
    o(this, "deferredNodes", /* @__PURE__ */ new Set());
    o(this, "deferredEdges", /* @__PURE__ */ new Set());
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
    const t = this.graphStore.getEdge(e), s = this.graphStore.getPort(t.from), i = this.graphStore.getPort(t.to);
    return !(this.deferredNodes.has(s.nodeId) || this.deferredNodes.has(i.nodeId));
  }
  tryAttachEdge(e) {
    this.isEdgeValid(e) && (this.deferredEdges.delete(e), this.htmlView.attachEdge(e));
  }
}
class K {
  constructor() {
    o(this, "callbacks", /* @__PURE__ */ new Set());
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
const x = () => {
  const r = new K();
  return [r, r];
};
class Y {
  constructor(e) {
    o(this, "counter", 0);
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
class Ee {
  constructor(e, t, s, i, n, a) {
    o(this, "nodeIdGenerator", new Y(
      (e) => this.graphStore.hasNode(e)
    ));
    o(this, "portIdGenerator", new Y(
      (e) => this.graphStore.hasPort(e)
    ));
    o(this, "edgeIdGenerator", new Y(
      (e) => this.graphStore.hasEdge(e)
    ));
    o(this, "onAfterNodeAdded", (e) => {
      this.htmlView.attachNode(e);
    });
    o(this, "onAfterNodeUpdated", (e) => {
      this.htmlView.updateNodePosition(e), this.graphStore.getNodeAdjacentEdgeIds(e).forEach((t) => {
        this.htmlView.renderEdge(t);
      });
    });
    o(this, "onAfterNodePriorityUpdated", (e) => {
      this.htmlView.updateNodePriority(e);
    });
    o(this, "onBeforeNodeRemoved", (e) => {
      this.graphStore.getNodePortIds(e).forEach((t) => {
        this.unmarkPort(t);
      }), this.htmlView.detachNode(e);
    });
    o(this, "onAfterPortUpdated", (e) => {
      this.graphStore.getPortAdjacentEdgeIds(e).forEach((t) => {
        this.htmlView.renderEdge(t);
      });
    });
    o(this, "onBeforePortUnmarked", (e) => {
      this.graphStore.getPortAdjacentEdgeIds(e).forEach((t) => {
        this.removeEdge(t);
      });
    });
    o(this, "onAfterEdgeAdded", (e) => {
      this.htmlView.attachEdge(e);
    });
    o(this, "onAfterEdgeShapeUpdated", (e) => {
      this.htmlView.updateEdgeShape(e);
    });
    o(this, "onAfterEdgeUpdated", (e) => {
      this.htmlView.renderEdge(e);
    });
    o(this, "onAfterEdgePriorityUpdated", (e) => {
      this.htmlView.updateEdgePriority(e);
    });
    o(this, "onBeforeEdgeRemoved", (e) => {
      this.htmlView.detachEdge(e);
    });
    o(this, "onBeforeClear", () => {
      this.nodeIdGenerator.reset(), this.portIdGenerator.reset(), this.edgeIdGenerator.reset(), this.htmlView.clear();
    });
    o(this, "onBeforeDestroyEmitter");
    o(this, "destroyed", !1);
    /**
     * emits event just before destruction of canvas
     */
    o(this, "onBeforeDestroy");
    this.graph = e, this.viewport = t, this.graphStore = s, this.viewportStore = i, this.htmlView = n, this.params = a, this.graphStore.onAfterNodeAdded.subscribe(this.onAfterNodeAdded), this.graphStore.onAfterNodeUpdated.subscribe(this.onAfterNodeUpdated), this.graphStore.onAfterNodePriorityUpdated.subscribe(
      this.onAfterNodePriorityUpdated
    ), this.graphStore.onBeforeNodeRemoved.subscribe(this.onBeforeNodeRemoved), this.graphStore.onAfterPortUpdated.subscribe(this.onAfterPortUpdated), this.graphStore.onBeforePortRemoved.subscribe(this.onBeforePortUnmarked), this.graphStore.onAfterEdgeAdded.subscribe(this.onAfterEdgeAdded), this.graphStore.onAfterEdgeShapeUpdated.subscribe(
      this.onAfterEdgeShapeUpdated
    ), this.graphStore.onAfterEdgeUpdated.subscribe(this.onAfterEdgeUpdated), this.graphStore.onAfterEdgePriorityUpdated.subscribe(
      this.onAfterEdgePriorityUpdated
    ), this.graphStore.onBeforeEdgeRemoved.subscribe(this.onBeforeEdgeRemoved), this.graphStore.onBeforeClear.subscribe(this.onBeforeClear), [this.onBeforeDestroyEmitter, this.onBeforeDestroy] = x();
  }
  /**
   * adds new node
   */
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
    return this;
  }
  /**
   * updates node parameters
   */
  updateNode(e, t) {
    return this.graphStore.updateNode(e, t ?? {}), this;
  }
  /**
   * removes specified node
   * all the ports of node get unmarked
   * all the edges adjacent to node get removed
   */
  removeNode(e) {
    return this.graphStore.removeNode(e), this;
  }
  /**
   * marks specified element as a port for specified node
   */
  markPort(e) {
    const t = this.portIdGenerator.create(e.id);
    return this.graphStore.addPort({
      id: t,
      element: e.element,
      nodeId: e.nodeId,
      direction: e.direction ?? this.params.ports.direction
    }), this;
  }
  /**
   * updates port and edges attached to it
   */
  updatePort(e, t) {
    return this.graphStore.updatePort(e, t ?? {}), this;
  }
  /**
   * unmarks specified port
   * all the edges adjacent to the port get removed
   */
  unmarkPort(e) {
    return this.graphStore.removePort(e), this;
  }
  /**
   * adds new edge
   */
  addEdge(e) {
    const t = this.edgeIdGenerator.create(e.id);
    return this.graphStore.addEdge({
      id: t,
      from: e.from,
      to: e.to,
      shape: e.shape ?? this.params.edges.shapeFactory(t),
      priority: e.priority ?? this.params.edges.priorityFn()
    }), this;
  }
  /**
   * updates specified edge
   */
  updateEdge(e, t) {
    return this.graphStore.updateEdge(e, t ?? {}), this;
  }
  /**
   * removes specified edge
   */
  removeEdge(e) {
    return this.graphStore.removeEdge(e), this;
  }
  /**
   * clears canvas from nodes and edges
   * canvas gets rolled back to initial state and can be reused
   */
  clear() {
    return this.graphStore.clear(), this;
  }
  /**
   * applies transformation for viewport matrix
   */
  patchViewportMatrix(e) {
    return this.viewportStore.patchViewportMatrix(e), this;
  }
  /**
   * applies transformation for content matrix
   */
  patchContentMatrix(e) {
    return this.viewportStore.patchContentMatrix(e), this;
  }
  /**
   * destroys canvas
   * canvas element gets rolled back to initial state, and can not be reused
   */
  destroy() {
    this.destroyed || (this.clear(), this.onBeforeDestroyEmitter.emit(), this.graphStore.onAfterNodeAdded.unsubscribe(this.onAfterNodeAdded), this.graphStore.onAfterNodeUpdated.unsubscribe(this.onAfterNodeUpdated), this.graphStore.onAfterNodePriorityUpdated.unsubscribe(
      this.onAfterNodePriorityUpdated
    ), this.graphStore.onBeforeNodeRemoved.unsubscribe(this.onBeforeNodeRemoved), this.graphStore.onAfterPortUpdated.unsubscribe(this.onAfterPortUpdated), this.graphStore.onBeforePortRemoved.unsubscribe(this.onBeforePortUnmarked), this.graphStore.onAfterEdgeAdded.unsubscribe(this.onAfterEdgeAdded), this.graphStore.onAfterEdgeShapeUpdated.unsubscribe(
      this.onAfterEdgeShapeUpdated
    ), this.graphStore.onAfterEdgeUpdated.unsubscribe(this.onAfterEdgeUpdated), this.graphStore.onAfterEdgePriorityUpdated.unsubscribe(
      this.onAfterEdgePriorityUpdated
    ), this.graphStore.onBeforeEdgeRemoved.unsubscribe(this.onBeforeEdgeRemoved), this.graphStore.onBeforeClear.unsubscribe(this.onBeforeClear), this.htmlView.destroy(), this.viewportStore.destroy(), this.destroyed = !0);
  }
}
class Ze {
  constructor() {
    o(this, "singleToMultiMap", /* @__PURE__ */ new Map());
    o(this, "multiToSingleMap", /* @__PURE__ */ new Map());
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
class A extends Error {
  constructor() {
    super(...arguments);
    o(this, "name", "CanvasError");
  }
}
class xe {
  constructor() {
    o(this, "nodes", /* @__PURE__ */ new Map());
    o(this, "ports", /* @__PURE__ */ new Map());
    o(this, "edges", /* @__PURE__ */ new Map());
    o(this, "nodesElementsMap", /* @__PURE__ */ new Map());
    o(this, "portIncomingEdges", /* @__PURE__ */ new Map());
    o(this, "portOutcomingEdges", /* @__PURE__ */ new Map());
    o(this, "portCycleEdges", /* @__PURE__ */ new Map());
    o(this, "elementPorts", new Ze());
    o(this, "afterNodeAddedEmitter");
    o(this, "onAfterNodeAdded");
    o(this, "afterNodeUpdatedEmitter");
    o(this, "onAfterNodeUpdated");
    o(this, "afterNodePriorityUpdatedEmitter");
    o(this, "onAfterNodePriorityUpdated");
    o(this, "beforeNodeRemovedEmitter");
    o(this, "onBeforeNodeRemoved");
    o(this, "afterPortAddedEmitter");
    o(this, "onAfterPortAdded");
    o(this, "afterPortUpdatedEmitter");
    o(this, "onAfterPortUpdated");
    o(this, "beforePortRemovedEmitter");
    o(this, "onBeforePortRemoved");
    o(this, "afterEdgeAddedEmitter");
    o(this, "onAfterEdgeAdded");
    o(this, "afterEdgeShapeUpdatedEmitter");
    o(this, "onAfterEdgeShapeUpdated");
    o(this, "afterEdgeUpdatedEmitter");
    o(this, "onAfterEdgeUpdated");
    o(this, "afterEdgePriorityUpdatedEmitter");
    o(this, "onAfterEdgePriorityUpdated");
    o(this, "beforeEdgeRemovedEmitter");
    o(this, "onBeforeEdgeRemoved");
    o(this, "beforeClearEmitter");
    o(this, "onBeforeClear");
    [this.afterNodeAddedEmitter, this.onAfterNodeAdded] = x(), [this.afterNodeUpdatedEmitter, this.onAfterNodeUpdated] = x(), [this.afterNodePriorityUpdatedEmitter, this.onAfterNodePriorityUpdated] = x(), [this.beforeNodeRemovedEmitter, this.onBeforeNodeRemoved] = x(), [this.afterPortAddedEmitter, this.onAfterPortAdded] = x(), [this.afterPortUpdatedEmitter, this.onAfterPortUpdated] = x(), [this.beforePortRemovedEmitter, this.onBeforePortRemoved] = x(), [this.afterEdgeAddedEmitter, this.onAfterEdgeAdded] = x(), [this.afterEdgeShapeUpdatedEmitter, this.onAfterEdgeShapeUpdated] = x(), [this.afterEdgeUpdatedEmitter, this.onAfterEdgeUpdated] = x(), [this.afterEdgePriorityUpdatedEmitter, this.onAfterEdgePriorityUpdated] = x(), [this.beforeEdgeRemovedEmitter, this.onBeforeEdgeRemoved] = x(), [this.beforeClearEmitter, this.onBeforeClear] = x();
  }
  hasNode(e) {
    return this.nodes.has(e);
  }
  getNode(e) {
    const t = this.nodes.get(e);
    if (t === void 0)
      throw new A("failed to access nonexistent node");
    return t;
  }
  addNode(e) {
    if (this.hasNode(e.id))
      throw new A("failed to add node with existing id");
    if (this.findNodeIdByElement(e.element) !== void 0)
      throw new A(
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
      throw new A("failed to update nonexistent node");
    const { payload: s } = this.nodes.get(e);
    s.x = t.x ?? s.x, s.y = t.y ?? s.y, s.centerFn = t.centerFn ?? s.centerFn, t.priority !== void 0 && (s.priority = t.priority, this.afterNodePriorityUpdatedEmitter.emit(e)), this.afterNodeUpdatedEmitter.emit(e);
  }
  removeNode(e) {
    if (!this.hasNode(e))
      throw new A("failed to remove nonexistent node");
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
      throw new A("failed to access nonexistent port");
    return t;
  }
  addPort(e) {
    if (this.hasPort(e.id))
      throw new A("failed to add port with existing id");
    if (!this.hasNode(e.nodeId))
      throw new A("failed to add port to nonexistent node");
    this.ports.set(e.id, {
      element: e.element,
      payload: {
        direction: e.direction
      },
      nodeId: e.nodeId
    }), this.elementPorts.addRecord(e.element, e.id), this.portCycleEdges.set(e.id, /* @__PURE__ */ new Set()), this.portIncomingEdges.set(e.id, /* @__PURE__ */ new Set()), this.portOutcomingEdges.set(e.id, /* @__PURE__ */ new Set()), this.nodes.get(e.nodeId).ports.set(e.id, e.element), this.afterPortAddedEmitter.emit(e.id);
  }
  updatePort(e, t) {
    if (!this.hasPort(e))
      throw new A("failed to update nonexistent port");
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
      throw new A("failed to access port ids of nonexistent node");
    return Array.from(t.ports.keys());
  }
  removePort(e) {
    if (!this.hasPort(e))
      throw new A("failed to remove nonexistent port");
    const t = this.ports.get(e).nodeId;
    this.beforePortRemovedEmitter.emit(e), this.nodes.get(t).ports.delete(e), this.ports.delete(e), this.elementPorts.removeByMulti(e);
  }
  hasEdge(e) {
    return this.edges.has(e);
  }
  getEdge(e) {
    const t = this.edges.get(e);
    if (t === void 0)
      throw new A("failed to access nonexistent edge");
    return t;
  }
  addEdge(e) {
    if (this.hasEdge(e.id))
      throw new A("failed to add edge with existing id");
    if (!this.hasPort(e.from))
      throw new A("failed to add edge from nonexistent port");
    if (!this.hasPort(e.to))
      throw new A("failed to add edge to nonexistent port");
    this.addEdgeInternal(e), this.afterEdgeAddedEmitter.emit(e.id);
  }
  updateEdge(e, t) {
    if (!this.hasEdge(e))
      throw new A("failed to update nonexistent edge");
    if (t.from !== void 0 || t.to !== void 0) {
      const i = this.edges.get(e), n = i.payload;
      this.removeEdgeInternal(e), this.addEdgeInternal({
        id: e,
        from: t.from ?? i.from,
        to: t.to ?? i.to,
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
      throw new A("failed to remove nonexistent edge");
    this.beforeEdgeRemovedEmitter.emit(e), this.removeEdgeInternal(e);
  }
  clear() {
    this.beforeClearEmitter.emit(), this.portIncomingEdges.clear(), this.portOutcomingEdges.clear(), this.portCycleEdges.clear(), this.elementPorts.clear(), this.nodesElementsMap.clear(), this.edges.clear(), this.ports.clear(), this.nodes.clear();
  }
  getPortIncomingEdgeIds(e) {
    const t = this.portIncomingEdges.get(e);
    if (t === void 0)
      throw new A("failed to access edges for nonexistent port");
    return Array.from(t);
  }
  getPortOutgoingEdgeIds(e) {
    const t = this.portOutcomingEdges.get(e);
    if (t === void 0)
      throw new A("failed to access edges for nonexistent port");
    return Array.from(t);
  }
  getPortCycleEdgeIds(e) {
    const t = this.portCycleEdges.get(e);
    if (t === void 0)
      throw new A("failed to access edges for nonexistent port");
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
    return t.forEach((i) => {
      this.getPortIncomingEdgeIds(i).filter((n) => {
        const a = this.getEdge(n);
        return this.getPort(a.from).nodeId !== e;
      }).forEach((n) => {
        s.push(n);
      });
    }), s;
  }
  getNodeOutgoingEdgeIds(e) {
    const t = Array.from(this.getNode(e).ports.keys()), s = [];
    return t.forEach((i) => {
      this.getPortOutgoingEdgeIds(i).filter((n) => {
        const a = this.getEdge(n);
        return this.getPort(a.to).nodeId !== e;
      }).forEach((n) => {
        s.push(n);
      });
    }), s;
  }
  getNodeCycleEdgeIds(e) {
    const t = Array.from(this.getNode(e).ports.keys()), s = [];
    return t.forEach((i) => {
      this.getPortCycleEdgeIds(i).forEach((n) => {
        s.push(n);
      }), this.getPortIncomingEdgeIds(i).filter((n) => {
        const a = this.getEdge(n);
        return this.getPort(a.to).nodeId === e;
      }).forEach((n) => {
        s.push(n);
      });
    }), s;
  }
  getNodeAdjacentEdgeIds(e) {
    const t = Array.from(this.getNode(e).ports.keys()), s = [];
    return t.forEach((i) => {
      this.getPortIncomingEdgeIds(i).forEach((n) => {
        s.push(n);
      }), this.getPortOutgoingEdgeIds(i).forEach((n) => {
        s.push(n);
      }), this.getPortCycleEdgeIds(i).forEach((n) => {
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
    }), e.from !== e.to ? (this.portOutcomingEdges.get(e.from).add(e.id), this.portIncomingEdges.get(e.to).add(e.id)) : this.portCycleEdges.get(e.from).add(e.id);
  }
  removeEdgeInternal(e) {
    const t = this.edges.get(e), s = t.from, i = t.to;
    this.portCycleEdges.get(s).delete(e), this.portCycleEdges.get(i).delete(e), this.portIncomingEdges.get(s).delete(e), this.portIncomingEdges.get(i).delete(e), this.portOutcomingEdges.get(s).delete(e), this.portOutcomingEdges.get(i).delete(e), this.edges.delete(e);
  }
}
const le = (r) => ({
  scale: 1 / r.scale,
  x: -r.x / r.scale,
  y: -r.y / r.scale
}), ge = {
  scale: 1,
  x: 0,
  y: 0
}, ue = (r, e) => ({
  x: r.scale * e.x + r.x,
  y: r.scale * e.y + r.y
});
class Je {
  constructor(e) {
    o(this, "viewportMatrix", ge);
    o(this, "contentMatrix", ge);
    o(this, "beforeUpdateEmitter");
    o(this, "onBeforeUpdated");
    o(this, "afterUpdateEmitter");
    o(this, "onAfterUpdated");
    o(this, "afterResizeEmitter");
    o(this, "onAfterResize");
    o(this, "observer", new ResizeObserver(() => {
      this.afterResizeEmitter.emit();
    }));
    this.host = e, [this.afterUpdateEmitter, this.onAfterUpdated] = x(), [this.beforeUpdateEmitter, this.onBeforeUpdated] = x(), [this.afterResizeEmitter, this.onAfterResize] = x(), this.observer.observe(this.host);
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
    }, this.beforeUpdateEmitter.emit(), this.contentMatrix = le(this.viewportMatrix), this.afterUpdateEmitter.emit();
  }
  patchContentMatrix(e) {
    this.contentMatrix = {
      scale: e.scale ?? this.contentMatrix.scale,
      x: e.x ?? this.contentMatrix.x,
      y: e.y ?? this.contentMatrix.y
    }, this.beforeUpdateEmitter.emit(), this.viewportMatrix = le(this.contentMatrix), this.afterUpdateEmitter.emit();
  }
  getDimensions() {
    const { width: e, height: t } = this.host.getBoundingClientRect();
    return { width: e, height: t };
  }
  createContentCoords(e) {
    return ue(this.viewportMatrix, e);
  }
  createViewportCoords(e) {
    return ue(this.contentMatrix, e);
  }
  destroy() {
    this.observer.disconnect();
  }
}
class Q {
  constructor(e) {
    o(this, "elementToNodeId", /* @__PURE__ */ new Map());
    o(this, "nodesResizeObserver");
    o(this, "onAfterNodeAdded", (e) => {
      const t = this.canvas.graph.getNode(e);
      this.elementToNodeId.set(t.element, e), this.nodesResizeObserver.observe(t.element);
    });
    o(this, "onBeforeNodeRemoved", (e) => {
      const t = this.canvas.graph.getNode(e);
      this.elementToNodeId.delete(t.element), this.nodesResizeObserver.unobserve(t.element);
    });
    o(this, "onBeforeClear", () => {
      this.nodesResizeObserver.disconnect(), this.elementToNodeId.clear();
    });
    this.canvas = e, this.nodesResizeObserver = new ResizeObserver((t) => {
      t.forEach((s) => {
        const i = s.target;
        this.handleNodeResize(i);
      });
    }), this.canvas.graph.onAfterNodeAdded.subscribe(this.onAfterNodeAdded), this.canvas.graph.onBeforeNodeRemoved.subscribe(this.onBeforeNodeRemoved), this.canvas.graph.onBeforeClear.subscribe(this.onBeforeClear);
  }
  static configure(e) {
    new Q(e);
  }
  handleNodeResize(e) {
    const t = this.elementToNodeId.get(e);
    this.canvas.updateNode(t);
  }
}
const _e = (r, e, t) => {
  const { x: s, y: i, width: n, height: a } = r.getBoundingClientRect();
  return e >= s && e <= s + n && t >= i && t <= i + a;
}, et = (r, e, t) => e >= 0 && e <= r.innerWidth && t >= 0 && t <= r.innerHeight, R = (r, e, t, s) => _e(e, t, s) && et(r, t, s), $ = (r, e) => {
  e !== null ? r.style.cursor = e : r.style.removeProperty("cursor");
}, U = (r) => {
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
}, tt = (r, e) => {
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
function* Se(r, e) {
  const t = r.elementsFromPoint(e.x, e.y);
  for (const s of t) {
    if (s.shadowRoot !== null) {
      const i = Se(s.shadowRoot, e);
      for (const n of i)
        yield n;
    }
    yield s;
  }
}
const be = (r, e) => {
  const t = Se(document, e);
  for (const s of t) {
    const i = tt(r, s);
    if (i.status === "portFound")
      return i.portId;
    if (i.status === "nodeEncountered")
      return null;
  }
  return null;
};
var N = /* @__PURE__ */ ((r) => (r.StaticNodeId = "static", r.DraggingNodeId = "dragging", r.EdgeId = "edge", r))(N || {});
const Pe = (r, e) => ({
  x: r / 2,
  y: e / 2
}), w = {
  x: 0,
  y: 0
}, m = (r, e, t) => ({
  x: e.x * r.x - e.y * r.y + ((1 - e.x) * t.x + e.y * t.y),
  y: e.y * r.x + e.x * r.y + ((1 - e.x) * t.y - e.y * t.x)
}), Ne = (r, e) => {
  const t = {
    x: r.x + r.width / 2,
    y: r.y + r.height / 2
  }, s = {
    x: e.x + e.width / 2,
    y: e.y + e.height / 2
  }, i = Math.min(t.x, s.x), n = Math.min(t.y, s.y), a = Math.abs(s.x - t.x), h = Math.abs(s.y - t.y), d = t.x <= s.x ? 1 : -1, c = t.y <= s.y ? 1 : -1;
  return {
    x: i,
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
class rt {
  constructor(e) {
    o(this, "path");
    o(this, "midpoint");
    this.params = e;
    const t = this.params.to;
    this.midpoint = { x: t.x / 2, y: t.y / 2 };
    const s = m(
      { x: this.params.arrowLength, y: w.y },
      this.params.sourceDirection,
      w
    ), i = m(
      { x: this.params.to.x - this.params.arrowLength, y: this.params.to.y },
      this.params.targetDirection,
      this.params.to
    ), n = {
      x: s.x + this.params.sourceDirection.x * this.params.curvature,
      y: s.y + this.params.sourceDirection.y * this.params.curvature
    }, a = {
      x: i.x - this.params.targetDirection.x * this.params.curvature,
      y: i.y - this.params.targetDirection.y * this.params.curvature
    }, h = `M ${s.x} ${s.y} C ${n.x} ${n.y}, ${a.x} ${a.y}, ${i.x} ${i.y}`, d = this.params.hasSourceArrow ? "" : `M ${w.x} ${w.y} L ${s.x} ${s.y} `, c = this.params.hasTargetArrow ? "" : ` M ${i.x} ${i.y} L ${this.params.to.x} ${this.params.to.y}`;
    this.path = `${d}${h}${c}`;
  }
}
class st {
  constructor(e) {
    o(this, "path");
    o(this, "midpoint");
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
    ) : this.params.to, i = this.params.arrowLength, n = Math.cos(this.params.detourDirection) * this.params.detourDistance, a = Math.sin(this.params.detourDirection) * this.params.detourDistance, h = n * this.params.flipX, d = a * this.params.flipY, c = m(
      { x: i, y: w.y },
      this.params.sourceDirection,
      w
    ), g = {
      x: c.x + h,
      y: c.y + d
    }, l = m(
      { x: this.params.to.x - i, y: this.params.to.y },
      this.params.targetDirection,
      this.params.to
    ), u = {
      x: l.x + h,
      y: l.y + d
    }, p = {
      x: (g.x + u.x) / 2,
      y: (g.y + u.y) / 2
    }, f = {
      x: c.x + this.params.curvature * this.params.sourceDirection.x,
      y: c.y + this.params.curvature * this.params.sourceDirection.y
    }, E = {
      x: l.x - this.params.curvature * this.params.targetDirection.x,
      y: l.y - this.params.curvature * this.params.targetDirection.y
    }, S = {
      x: c.x + h,
      y: c.y + d
    }, b = {
      x: l.x + h,
      y: l.y + d
    };
    this.path = [
      `M ${t.x} ${t.y}`,
      `L ${c.x} ${c.y}`,
      `C ${f.x} ${f.y} ${S.x} ${S.y} ${p.x} ${p.y}`,
      `C ${b.x} ${b.y} ${E.x} ${E.y} ${l.x} ${l.y}`,
      `L ${s.x} ${s.y}`
    ].join(" "), this.midpoint = z(p, e.flipX, e.flipY, e.to);
  }
}
const Z = Object.freeze({
  edgeColor: "--edge-color"
}), Ce = (r) => {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  return e.style.pointerEvents = "none", e.style.position = "absolute", e.style.top = "0", e.style.left = "0", e.style.overflow = "visible", e.style.setProperty(Z.edgeColor, r), e;
}, Te = (r) => {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("stroke", `var(${Z.edgeColor})`), e.setAttribute("stroke-width", `${r}`), e.setAttribute("fill", "none"), e;
}, O = () => {
  const r = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return r.setAttribute("fill", `var(${Z.edgeColor})`), r;
}, De = () => {
  const r = document.createElementNS("http://www.w3.org/2000/svg", "g");
  return r.style.transformOrigin = "50% 50%", r;
}, Me = (r, e) => {
  r.style.transform = `translate(${e.x}px, ${e.y}px)`, r.style.width = `${Math.max(e.width, 1)}px`, r.style.height = `${Math.max(e.height, 1)}px`;
}, D = (r, e) => {
  const t = [];
  if (r.length > 0 && t.push(`M ${r[0].x} ${r[0].y}`), r.length === 2 && t.push(`L ${r[1].x} ${r[1].y}`), r.length > 2) {
    const s = r.length - 1;
    let i = 0, n = 0, a = 0;
    r.forEach((h, d) => {
      let c = 0, g = 0, l = 0;
      const u = d > 0, p = d < s, f = u && p;
      if (u && (c = -i, g = -n, l = a), p) {
        const V = r[d + 1];
        i = V.x - h.x, n = V.y - h.y, a = Math.sqrt(i * i + n * n);
      }
      const S = a !== 0 ? Math.min((f ? e : 0) / a, d < s - 1 ? 0.5 : 1) : 0, b = f ? { x: h.x + i * S, y: h.y + n * S } : h, P = l !== 0 ? Math.min((f ? e : 0) / l, d > 1 ? 0.5 : 1) : 0, L = f ? { x: h.x + c * P, y: h.y + g * P } : h;
      d > 0 && t.push(`L ${L.x} ${L.y}`), f && t.push(
        `C ${h.x} ${h.y} ${h.x} ${h.y} ${b.x} ${b.y}`
      );
    });
  }
  return t.join(" ");
};
class ot {
  constructor(e) {
    o(this, "path");
    o(this, "midpoint");
    this.params = e;
    const t = this.params.to;
    this.midpoint = { x: t.x / 2, y: t.y / 2 };
    const s = this.params.hasSourceArrow ? m(
      { x: this.params.arrowLength, y: w.y },
      this.params.sourceDirection,
      w
    ) : w, i = this.params.hasTargetArrow ? m(
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
    }, f = { x: p.x, y: g };
    this.path = D(
      [s, h, l, u, f, p, d, i],
      this.params.roundness
    );
  }
}
class it {
  constructor(e) {
    o(this, "path");
    o(this, "midpoint");
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
    ) : this.params.to, i = this.params.arrowLength + this.params.arrowOffset, n = m(
      { x: i, y: w.y },
      this.params.sourceDirection,
      w
    ), a = Math.cos(this.params.detourDirection) * this.params.detourDistance, h = Math.sin(this.params.detourDirection) * this.params.detourDistance, d = a * this.params.flipX, c = h * this.params.flipY, g = { x: n.x + d, y: n.y + c }, l = m(
      { x: this.params.to.x - i, y: this.params.to.y },
      this.params.targetDirection,
      this.params.to
    ), u = { x: l.x + d, y: l.y + c }, p = { x: (g.x + u.x) / 2, y: (g.y + u.y) / 2 };
    this.midpoint = z(p, e.flipX, e.flipY, e.to), this.path = D(
      [t, n, g, u, l, s],
      this.params.roundness
    );
  }
}
class nt {
  constructor(e) {
    o(this, "path");
    o(this, "midpoint");
    this.params = e;
    const t = this.params.to;
    this.midpoint = { x: t.x / 2, y: t.y / 2 };
    const s = this.params.hasSourceArrow ? m(
      { x: this.params.arrowLength, y: w.y },
      this.params.sourceDirection,
      w
    ) : w, i = this.params.hasTargetArrow ? m(
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
    this.path = D([s, a, h, i], this.params.roundness);
  }
}
class at {
  constructor(e) {
    o(this, "path");
    o(this, "midpoint");
    this.params = e;
    const t = this.params.to;
    this.midpoint = { x: t.x / 2, y: t.y / 2 };
    const s = this.params.hasSourceArrow ? m(
      { x: this.params.arrowLength, y: w.y },
      this.params.sourceDirection,
      w
    ) : w, i = this.params.hasTargetArrow ? m(
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
    }, f = { x: g, y: p.y };
    this.path = D(
      [s, h, l, u, f, p, d, i],
      this.params.roundness
    );
  }
}
class J {
  constructor(e) {
    o(this, "path");
    o(this, "midpoint");
    this.params = e;
    const t = this.params.arrowOffset, s = this.params.side, i = this.params.arrowLength + t, n = i + 2 * s, h = [
      { x: this.params.arrowLength, y: w.y },
      { x: i, y: w.y },
      { x: i, y: this.params.side },
      { x: n, y: this.params.side },
      { x: n, y: -this.params.side },
      { x: i, y: -this.params.side },
      { x: i, y: w.y },
      { x: this.params.arrowLength, y: w.y }
    ].map(
      (c) => m(c, this.params.sourceDirection, w)
    ), d = `M ${w.x} ${w.y} L ${h[0].x} ${h[0].y} `;
    this.path = `${this.params.hasSourceArrow || this.params.hasTargetArrow ? "" : d}${D(h, this.params.roundness)}`, this.midpoint = { x: (h[3].x + h[4].x) / 2, y: (h[3].y + h[4].y) / 2 };
  }
}
class ht {
  constructor(e) {
    o(this, "path");
    o(this, "midpoint");
    this.params = e;
    const t = this.params.smallRadius, s = this.params.radius, i = t + s, n = t * s / i, a = Math.sqrt(i * i - t * t), h = a * t / i, d = a + s + this.params.arrowLength, c = this.params.arrowLength + h, l = [
      { x: this.params.arrowLength, y: w.y },
      { x: c, y: n },
      { x: c, y: -n },
      { x: d, y: 0 }
    ].map(
      (f) => m(f, this.params.sourceDirection, w)
    ), u = [
      `M ${l[0].x} ${l[0].y}`,
      `A ${t} ${t} 0 0 1 ${l[1].x} ${l[1].y}`,
      `A ${s} ${s} 0 1 0 ${l[2].x} ${l[2].y}`,
      `A ${t} ${t} 0 0 1 ${l[0].x} ${l[0].y}`
    ].join(" "), p = `M 0 0 L ${l[0].x} ${l[0].y} `;
    this.path = `${this.params.hasSourceArrow || this.params.hasTargetArrow ? "" : p}${u}`, this.midpoint = l[3];
  }
}
class dt {
  constructor(e) {
    o(this, "path");
    o(this, "midpoint");
    o(this, "diagonalDistance");
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
    const i = this.createDirectLinePoint({
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
    this.path = `M ${i.x} ${i.y} L ${n.x} ${n.y}`;
  }
  createDirectLinePoint(e) {
    const t = e.hasArrow ? this.params.arrowLength : 0, s = e.offset + t, i = e.flip * s / this.diagonalDistance;
    return {
      x: this.params.to.x * i + e.shift.x,
      y: this.params.to.y * i + e.shift.y
    };
  }
}
class ct {
  constructor(e) {
    o(this, "path");
    o(this, "midpoint");
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
    ) : this.params.to, i = this.params.arrowLength + this.params.arrowOffset, n = m(
      { x: i, y: w.y },
      this.params.sourceDirection,
      w
    ), a = m(
      { x: this.params.to.x - i, y: this.params.to.y },
      this.params.targetDirection,
      this.params.to
    ), h = this.params.detourDistance > 0 ? 1 : -1, d = this.params.to.y / 2, c = d + Math.abs(this.params.detourDistance), g = d + c * this.params.flipY * h, l = {
      x: (n.x + a.x) / 2,
      y: g
    };
    this.midpoint = z(l, e.flipX, e.flipY, e.to), this.path = D(
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
class lt {
  constructor(e) {
    o(this, "path");
    o(this, "midpoint");
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
    ) : this.params.to, i = this.params.arrowLength + this.params.arrowOffset, n = m(
      { x: i, y: w.y },
      this.params.sourceDirection,
      w
    ), a = m(
      { x: this.params.to.x - i, y: this.params.to.y },
      this.params.targetDirection,
      this.params.to
    ), h = this.params.detourDistance > 0 ? 1 : -1, d = this.params.to.x / 2, c = d + Math.abs(this.params.detourDistance), g = d + c * this.params.flipX * h, l = {
      x: g,
      y: (n.y + a.y) / 2
    };
    this.midpoint = z(l, e.flipX, e.flipY, e.to), this.path = D(
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
const y = Object.freeze({
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
}), pe = (r, e, t) => ({ x: e * Math.cos(r), y: t * Math.sin(r) });
class k {
  constructor(e) {
    o(this, "svg");
    o(this, "group", De());
    o(this, "line");
    o(this, "sourceArrow", null);
    o(this, "targetArrow", null);
    o(this, "onAfterRender");
    o(this, "afterRenderEmitter");
    o(this, "arrowRenderer");
    this.params = e, [this.afterRenderEmitter, this.onAfterRender] = x(), this.arrowRenderer = this.params.arrowRenderer, this.svg = Ce(e.color), this.svg.appendChild(this.group), this.line = Te(e.width), this.group.appendChild(this.line), e.hasSourceArrow && (this.sourceArrow = O(), this.group.appendChild(this.sourceArrow)), e.hasTargetArrow && (this.targetArrow = O(), this.group.appendChild(this.targetArrow));
  }
  render(e) {
    const { x: t, y: s, width: i, height: n, flipX: a, flipY: h } = Ne(
      e.from,
      e.to
    );
    Me(this.svg, { x: t, y: s, width: i, height: n }), this.group.style.transform = `scale(${a}, ${h})`;
    const d = pe(
      e.from.direction,
      a,
      h
    ), c = pe(
      e.to.direction,
      a,
      h
    ), g = {
      x: i,
      y: n
    };
    let l = { x: -c.x, y: -c.y }, u;
    e.category === M.PortCycle ? (u = this.params.createCyclePath, l = d) : e.category === M.NodeCycle ? u = this.params.createDetourPath : u = this.params.createLinePath;
    const p = u(
      d,
      c,
      g,
      a,
      h
    );
    this.line.setAttribute("d", p.path);
    let f = null;
    this.sourceArrow && (f = this.arrowRenderer({
      direction: d,
      shift: w,
      arrowLength: this.params.arrowLength
    }), this.sourceArrow.setAttribute("d", f));
    let E = null;
    this.targetArrow && (E = this.arrowRenderer({
      direction: l,
      shift: g,
      arrowLength: this.params.arrowLength
    }), this.targetArrow.setAttribute("d", E)), this.afterRenderEmitter.emit({
      edgePath: p,
      sourceArrowPath: f,
      targetArrowPath: E
    });
  }
}
const gt = (r) => (e) => {
  const s = [
    w,
    { x: e.arrowLength, y: r.radius },
    { x: e.arrowLength, y: -r.radius }
  ].map(
    (h) => m(h, e.direction, w)
  ).map((h) => ({
    x: h.x + e.shift.x,
    y: h.y + e.shift.y
  })), i = `M ${s[0].x} ${s[0].y}`, n = `L ${s[1].x} ${s[1].y}`, a = `L ${s[2].x} ${s[2].y}`;
  return `${i} ${n} ${a} Z`;
}, ut = (r) => (e) => {
  const t = r.radius, s = e.arrowLength, i = (s * s + 2 * s * t) / (2 * t), n = i + t, a = s + t - t * (s + t) / n, h = t * i / n, c = [w, { x: a, y: -h }, { x: a, y: h }].map(
    (f) => m(f, e.direction, w)
  ).map((f) => ({
    x: f.x + e.shift.x,
    y: f.y + e.shift.y
  })), g = `M ${c[0].x} ${c[0].y}`, l = `A ${i} ${i} 0 0 0 ${c[1].x} ${c[1].y}`, u = `A ${t} ${t} 0 0 0 ${c[2].x} ${c[2].y}`, p = `A ${i} ${i} 0 0 0 ${c[0].x} ${c[0].y}`;
  return `${g} ${l} ${u} ${p}`;
}, pt = (r) => (e) => {
  const t = r.smallRadius, s = r.radius, i = m(
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
  ), a = [w, { x: i.x, y: -i.y }, i].map(
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
      return gt({
        radius: r.radius ?? y.polygonArrowRadius
      });
    case "arc":
      return ut({
        radius: r.radius ?? y.circleArrowRadius
      });
    default:
      return pt({
        smallRadius: r.smallRadius ?? y.wedgeArrowSmallRadius,
        angle: r.angle ?? y.wedgeArrowAngle,
        radius: r.radius ?? y.wedgeArrowRadius
      });
  }
};
class wt {
  constructor(e) {
    o(this, "svg");
    o(this, "group");
    o(this, "line");
    o(this, "sourceArrow");
    o(this, "targetArrow");
    o(this, "onAfterRender");
    o(this, "arrowLength");
    o(this, "curvature");
    o(this, "portCycleRadius");
    o(this, "portCycleSmallRadius");
    o(this, "detourDirection");
    o(this, "detourDistance");
    o(this, "hasSourceArrow");
    o(this, "hasTargetArrow");
    o(this, "pathShape");
    o(this, "createCyclePath", (e) => new ht({
      sourceDirection: e,
      radius: this.portCycleRadius,
      smallRadius: this.portCycleSmallRadius,
      arrowLength: this.arrowLength,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    o(this, "createDetourPath", (e, t, s, i, n) => new st({
      to: s,
      sourceDirection: e,
      targetDirection: t,
      flipX: i,
      flipY: n,
      arrowLength: this.arrowLength,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      curvature: this.curvature,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    o(this, "createLinePath", (e, t, s) => new rt({
      to: s,
      sourceDirection: e,
      targetDirection: t,
      arrowLength: this.arrowLength,
      curvature: this.curvature,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    this.arrowLength = (e == null ? void 0 : e.arrowLength) ?? y.arrowLength, this.curvature = (e == null ? void 0 : e.curvature) ?? y.curvature, this.portCycleRadius = (e == null ? void 0 : e.cycleRadius) ?? y.cycleRadius, this.portCycleSmallRadius = (e == null ? void 0 : e.smallCycleRadius) ?? y.smallCycleRadius, this.detourDirection = (e == null ? void 0 : e.detourDirection) ?? y.detourDirection, this.detourDistance = (e == null ? void 0 : e.detourDistance) ?? y.detourDistance, this.hasSourceArrow = (e == null ? void 0 : e.hasSourceArrow) ?? y.hasSourceArrow, this.hasTargetArrow = (e == null ? void 0 : e.hasTargetArrow) ?? y.hasTargetArrow, this.pathShape = new k({
      color: (e == null ? void 0 : e.color) ?? y.color,
      width: (e == null ? void 0 : e.width) ?? y.width,
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
class ft {
  constructor(e) {
    o(this, "svg");
    o(this, "group");
    o(this, "line");
    o(this, "sourceArrow");
    o(this, "targetArrow");
    o(this, "onAfterRender");
    o(this, "arrowLength");
    o(this, "arrowOffset");
    o(this, "roundness");
    o(this, "cycleSquareSide");
    o(this, "detourDistance");
    o(this, "hasSourceArrow");
    o(this, "hasTargetArrow");
    o(this, "pathShape");
    o(this, "createCyclePath", (e) => new J({
      sourceDirection: e,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    o(this, "createDetourPath", (e, t, s, i, n) => new ct({
      to: s,
      sourceDirection: e,
      targetDirection: t,
      flipX: i,
      flipY: n,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    o(this, "createLinePath", (e, t, s, i) => new ot({
      to: s,
      sourceDirection: e,
      targetDirection: t,
      flipX: i,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    this.arrowLength = (e == null ? void 0 : e.arrowLength) ?? y.arrowLength, this.arrowOffset = (e == null ? void 0 : e.arrowOffset) ?? y.arrowOffset, this.cycleSquareSide = (e == null ? void 0 : e.cycleSquareSide) ?? y.cycleSquareSide;
    const t = (e == null ? void 0 : e.roundness) ?? y.roundness;
    this.roundness = Math.min(
      t,
      this.arrowOffset,
      this.cycleSquareSide / 2
    ), this.detourDistance = (e == null ? void 0 : e.detourDistance) ?? y.detourDistance, this.hasSourceArrow = (e == null ? void 0 : e.hasSourceArrow) ?? y.hasSourceArrow, this.hasTargetArrow = (e == null ? void 0 : e.hasTargetArrow) ?? y.hasTargetArrow, this.pathShape = new k({
      color: (e == null ? void 0 : e.color) ?? y.color,
      width: (e == null ? void 0 : e.width) ?? y.width,
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
class yt {
  constructor(e) {
    o(this, "svg");
    o(this, "group");
    o(this, "line");
    o(this, "sourceArrow");
    o(this, "targetArrow");
    o(this, "onAfterRender");
    o(this, "arrowLength");
    o(this, "arrowOffset");
    o(this, "roundness");
    o(this, "cycleSquareSide");
    o(this, "detourDirection");
    o(this, "detourDistance");
    o(this, "hasSourceArrow");
    o(this, "hasTargetArrow");
    o(this, "pathShape");
    o(this, "createCyclePath", (e) => new J({
      sourceDirection: e,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    o(this, "createDetourPath", (e, t, s, i, n) => new it({
      to: s,
      sourceDirection: e,
      targetDirection: t,
      flipX: i,
      flipY: n,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    o(this, "createLinePath", (e, t, s) => new nt({
      to: s,
      sourceDirection: e,
      targetDirection: t,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    this.arrowLength = (e == null ? void 0 : e.arrowLength) ?? y.arrowLength, this.arrowOffset = (e == null ? void 0 : e.arrowOffset) ?? y.arrowOffset, this.cycleSquareSide = (e == null ? void 0 : e.cycleSquareSide) ?? y.cycleSquareSide;
    const t = (e == null ? void 0 : e.roundness) ?? y.roundness;
    this.roundness = Math.min(
      t,
      this.arrowOffset,
      this.cycleSquareSide / 2
    ), this.detourDirection = (e == null ? void 0 : e.detourDirection) ?? y.detourDirection, this.detourDistance = (e == null ? void 0 : e.detourDistance) ?? y.detourDistance, this.hasSourceArrow = (e == null ? void 0 : e.hasSourceArrow) ?? y.hasSourceArrow, this.hasTargetArrow = (e == null ? void 0 : e.hasTargetArrow) ?? y.hasTargetArrow, this.pathShape = new k({
      color: (e == null ? void 0 : e.color) ?? y.color,
      width: (e == null ? void 0 : e.width) ?? y.width,
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
class mt {
  constructor(e) {
    o(this, "svg");
    o(this, "group");
    o(this, "line");
    o(this, "sourceArrow");
    o(this, "targetArrow");
    o(this, "onAfterRender");
    o(this, "arrowLength");
    o(this, "arrowOffset");
    o(this, "roundness");
    o(this, "cycleSquareSide");
    o(this, "detourDistance");
    o(this, "hasSourceArrow");
    o(this, "hasTargetArrow");
    o(this, "pathShape");
    o(this, "createCyclePath", (e) => new J({
      sourceDirection: e,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    o(this, "createDetourPath", (e, t, s, i, n) => new lt({
      to: s,
      sourceDirection: e,
      targetDirection: t,
      flipX: i,
      flipY: n,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    o(this, "createLinePath", (e, t, s, i, n) => new at({
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
    this.arrowLength = (e == null ? void 0 : e.arrowLength) ?? y.arrowLength, this.arrowOffset = (e == null ? void 0 : e.arrowOffset) ?? y.arrowOffset, this.cycleSquareSide = (e == null ? void 0 : e.cycleSquareSide) ?? y.cycleSquareSide;
    const t = (e == null ? void 0 : e.roundness) ?? y.roundness;
    this.roundness = Math.min(
      t,
      this.arrowOffset,
      this.cycleSquareSide / 2
    ), this.detourDistance = (e == null ? void 0 : e.detourDistance) ?? y.detourDistance, this.hasSourceArrow = (e == null ? void 0 : e.hasSourceArrow) ?? y.hasSourceArrow, this.hasTargetArrow = (e == null ? void 0 : e.hasTargetArrow) ?? y.hasTargetArrow, this.pathShape = new k({
      color: (e == null ? void 0 : e.color) ?? y.color,
      width: (e == null ? void 0 : e.width) ?? y.width,
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
class Re {
  constructor(e) {
    o(this, "svg");
    o(this, "group", De());
    o(this, "line");
    o(this, "sourceArrow", null);
    o(this, "targetArrow", null);
    o(this, "color");
    o(this, "width");
    o(this, "arrowLength");
    o(this, "sourceOffset");
    o(this, "targetOffset");
    o(this, "onAfterRender");
    o(this, "afterRenderEmitter");
    o(this, "arrowRenderer");
    [this.afterRenderEmitter, this.onAfterRender] = x(), this.color = (e == null ? void 0 : e.color) ?? y.color, this.width = (e == null ? void 0 : e.width) ?? y.width, this.arrowLength = (e == null ? void 0 : e.arrowLength) ?? y.arrowLength, this.arrowRenderer = I((e == null ? void 0 : e.arrowRenderer) ?? {}), this.sourceOffset = (e == null ? void 0 : e.sourceOffset) ?? y.preOffset, this.targetOffset = (e == null ? void 0 : e.targetOffset) ?? y.preOffset, this.svg = Ce(this.color), this.svg.appendChild(this.group), this.line = Te(this.width), this.group.appendChild(this.line), e != null && e.hasSourceArrow && (this.sourceArrow = O(), this.group.appendChild(this.sourceArrow)), e != null && e.hasTargetArrow && (this.targetArrow = O(), this.group.appendChild(this.targetArrow));
  }
  render(e) {
    const { x: t, y: s, width: i, height: n, flipX: a, flipY: h } = Ne(
      e.from,
      e.to
    );
    Me(this.svg, { x: t, y: s, width: i, height: n }), this.group.style.transform = `scale(${a}, ${h})`;
    const d = { x: i, y: n }, c = new dt({
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
        const f = {
          x: p.x * this.sourceOffset,
          y: p.y * this.sourceOffset
        };
        g = this.arrowRenderer({
          direction: p,
          shift: f,
          arrowLength: this.arrowLength
        }), this.sourceArrow.setAttribute("d", g);
      }
      if (this.targetArrow) {
        const f = {
          x: p.x * this.targetOffset,
          y: p.y * this.targetOffset
        };
        l = this.arrowRenderer({
          direction: { x: -p.x, y: -p.y },
          shift: {
            x: d.x - f.x,
            y: d.y - f.y
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
const vt = () => {
  const r = document.createElementNS("http://www.w3.org/2000/svg", "g");
  return r.style.pointerEvents = "auto", r.style.cursor = "pointer", r;
}, At = (r) => {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("stroke", "transparent"), e.setAttribute("stroke-width", `${r}`), e.setAttribute("fill", "none"), e.setAttribute("stroke-linecap", "round"), e;
}, we = (r) => {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("stroke-linejoin", "round"), e.setAttribute("stroke-width", `${r}`), e.setAttribute("fill", "transparent"), e.setAttribute("stroke", "transparent"), e;
};
class Et extends Error {
  constructor(e) {
    super(e), this.name = "InteractiveEdgeError";
  }
}
class Le {
  constructor(e, t) {
    o(this, "svg");
    o(this, "group");
    o(this, "line");
    o(this, "sourceArrow");
    o(this, "targetArrow");
    o(this, "handle", vt());
    o(this, "onAfterRender");
    o(this, "interactiveLine");
    o(this, "interactiveSourceArrow", null);
    o(this, "interactiveTargetArrow", null);
    if (this.baseEdge = e, e instanceof Le)
      throw new Et(
        "interactive edge can be configured only once"
      );
    this.svg = this.baseEdge.svg, this.group = this.baseEdge.group, this.line = this.baseEdge.line, this.sourceArrow = this.baseEdge.sourceArrow, this.targetArrow = this.baseEdge.targetArrow, this.onAfterRender = this.baseEdge.onAfterRender;
    const s = (t == null ? void 0 : t.distance) ?? y.interactiveWidth;
    this.interactiveLine = At(s), this.handle.appendChild(this.interactiveLine), this.sourceArrow && (this.interactiveSourceArrow = we(s), this.handle.appendChild(this.interactiveSourceArrow)), this.targetArrow && (this.interactiveTargetArrow = we(s), this.handle.appendChild(this.interactiveTargetArrow)), this.group.appendChild(this.handle), this.baseEdge.onAfterRender.subscribe((i) => {
      this.interactiveLine.setAttribute("d", i.edgePath.path), this.interactiveSourceArrow && this.interactiveSourceArrow.setAttribute("d", i.sourceArrowPath), this.interactiveTargetArrow && this.interactiveTargetArrow.setAttribute("d", i.targetArrowPath);
    });
  }
  render(e) {
    this.baseEdge.render(e);
  }
}
class ur {
  constructor(e, t) {
    o(this, "group");
    o(this, "line");
    o(this, "sourceArrow");
    o(this, "targetArrow");
    o(this, "onAfterRender");
    o(this, "svg");
    this.baseShape = e, this.midpointElement = t, this.svg = this.baseShape.svg, this.group = this.baseShape.group, this.line = this.baseShape.line, this.sourceArrow = this.baseShape.sourceArrow, this.targetArrow = this.baseShape.targetArrow, this.onAfterRender = this.baseShape.onAfterRender, this.svg.append(this.midpointElement), this.baseShape.onAfterRender.subscribe((s) => {
      const i = s.edgePath.midpoint, n = `translate(${i.x}px, ${i.y}px)`;
      this.midpointElement.style.setProperty("transform", n);
    });
  }
  render(e) {
    this.baseShape.render(e);
  }
}
class Ve {
  constructor(e) {
    o(this, "onAfterNodeAdded");
    o(this, "onAfterNodeUpdated");
    o(this, "onAfterNodePriorityUpdated");
    o(this, "onBeforeNodeRemoved");
    o(this, "onAfterPortMarked");
    o(this, "onAfterPortUpdated");
    o(this, "onBeforePortUnmarked");
    o(this, "onAfterEdgeAdded");
    o(this, "onAfterEdgeShapeUpdated");
    o(this, "onAfterEdgeUpdated");
    o(this, "onAfterEdgePriorityUpdated");
    o(this, "onBeforeEdgeRemoved");
    o(this, "onBeforeClear");
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
class Fe {
  constructor(e) {
    o(this, "onBeforeUpdated");
    o(this, "onAfterUpdated");
    o(this, "onAfterResize");
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
const Ie = (r, e) => {
  const t = new xe(), s = new Ve(t), i = new Fe(e), n = new Ae(t, e, r), a = {
    nodes: {
      centerFn: Pe,
      priorityFn: () => 0
    },
    edges: {
      shapeFactory: () => new Re(),
      priorityFn: () => 0
    },
    ports: {
      direction: 0
    }
  };
  return new Ee(
    s,
    i,
    t,
    e,
    n,
    a
  );
};
class H {
  constructor(e, t, s, i) {
    o(this, "onAfterPortMarked", (e) => {
      const t = this.canvas.graph.getPort(e);
      this.canvas.graph.findPortIdsByElement(t.element).length === 1 && this.hookPortEvents(t.element);
    });
    o(this, "onBeforePortUnmarked", (e) => {
      const t = this.canvas.graph.getPort(e);
      this.canvas.graph.findPortIdsByElement(t.element).length === 1 && this.unhookPortEvents(t.element);
    });
    o(this, "onPortMouseDown", (e) => {
      const t = e;
      if (!this.params.mouseDownEventVerifier(t))
        return;
      const s = e.currentTarget, i = this.canvas.graph.findPortIdsByElement(s)[0];
      this.params.onPortPointerDown(i, {
        x: t.clientX,
        y: t.clientY
      }) && (e.stopPropagation(), this.window.addEventListener("mousemove", this.onWindowMouseMove, {
        passive: !0
      }), this.window.addEventListener("mouseup", this.onWindowMouseUp, {
        passive: !0
      }));
    });
    o(this, "onWindowMouseMove", (e) => {
      if (!R(
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
    o(this, "onWindowMouseUp", (e) => {
      this.params.mouseUpEventVerifier(e) && (this.params.onPointerUp({ x: e.clientX, y: e.clientY }), this.stopMouseDrag());
    });
    o(this, "onPortTouchStart", (e) => {
      const t = e;
      if (t.touches.length !== 1)
        return;
      const s = t.touches[0], i = e.currentTarget, n = this.canvas.graph.findPortIdsByElement(i)[0];
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
    o(this, "onWindowTouchMove", (e) => {
      const t = e.touches[0];
      if (!R(
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
    o(this, "onWindowTouchFinish", (e) => {
      const t = e.changedTouches[0];
      this.params.onPointerUp({ x: t.clientX, y: t.clientY }), this.stopTouchDrag();
    });
    o(this, "onBeforeClear", () => {
      this.canvas.graph.getAllPortIds().forEach((e) => {
        const t = this.canvas.graph.getPort(e);
        this.unhookPortEvents(t.element);
      });
    });
    o(this, "onBeforeDestroy", () => {
      this.params.onStopDrag(), this.removeWindowMouseListeners(), this.removeWindowTouchListeners();
    });
    this.canvas = e, this.element = t, this.window = s, this.params = i, this.canvas.graph.onAfterPortMarked.subscribe(this.onAfterPortMarked), this.canvas.graph.onBeforePortUnmarked.subscribe(this.onBeforePortUnmarked), this.canvas.graph.onBeforeClear.subscribe(this.onBeforeClear), this.canvas.onBeforeDestroy.subscribe(this.onBeforeDestroy);
  }
  static configure(e, t, s, i) {
    new H(e, t, s, i);
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
class xt {
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
class St {
  constructor(e, t, s) {
    this.canvas = e, this.layoutAlgorithm = t, this.params = s;
  }
  apply(e) {
    const t = this.layoutAlgorithm.calculateNextCoordinates({
      graph: this.canvas.graph,
      viewport: this.canvas.viewport,
      dt: e
    });
    this.params.onBeforeApplied(), t.forEach((s, i) => {
      this.params.staticNodeResolver(i) || this.canvas.updateNode(i, s);
    }), this.params.onAfterApplied();
  }
}
class _ {
  constructor(e, t, s, i) {
    o(this, "grabbedNode", null);
    o(this, "maxNodePriority", 0);
    o(this, "graph");
    o(this, "onAfterNodeAdded", (e) => {
      this.updateMaxNodePriority(e);
      const { element: t } = this.graph.getNode(e);
      t.addEventListener("mousedown", this.onMouseDown, {
        passive: !0
      }), t.addEventListener("touchstart", this.onTouchStart, {
        passive: !0
      });
    });
    o(this, "onAfterNodeUpdated", (e) => {
      this.updateMaxNodePriority(e);
    });
    o(this, "onBeforeNodeRemoved", (e) => {
      const { element: t } = this.graph.getNode(e);
      t.removeEventListener("mousedown", this.onMouseDown), t.removeEventListener("touchstart", this.onTouchStart);
    });
    o(this, "onBeforeDestroy", () => {
      this.removeMouseDragListeners(), this.removeTouchDragListeners();
    });
    o(this, "onBeforeClear", () => {
      this.canvas.graph.getAllNodeIds().forEach((e) => {
        const { element: t } = this.canvas.graph.getNode(e);
        t.removeEventListener("mousedown", this.onMouseDown), t.removeEventListener("touchstart", this.onTouchStart);
      }), this.maxNodePriority = 0;
    });
    o(this, "onMouseDown", (e) => {
      const t = e;
      if (!this.params.mouseDownEventVerifier(t))
        return;
      const s = e.currentTarget, i = this.graph.findNodeIdByElement(s), n = this.graph.getNode(i);
      if (!this.params.nodeDragVerifier(i))
        return;
      this.params.onNodeDragStarted(i), e.stopPropagation();
      const h = this.calculateContentPoint({
        x: t.clientX,
        y: t.clientY
      });
      this.grabbedNode = {
        nodeId: i,
        dx: h.x - n.x,
        dy: h.y - n.y
      }, $(this.element, this.params.dragCursor), this.moveNodeOnTop(i), this.window.addEventListener("mousemove", this.onWindowMouseMove, {
        passive: !0
      }), this.window.addEventListener("mouseup", this.onWindowMouseUp, {
        passive: !0
      });
    });
    o(this, "onTouchStart", (e) => {
      const t = e;
      if (t.touches.length !== 1)
        return;
      e.stopPropagation();
      const s = t.touches[0], i = e.currentTarget, n = this.canvas.graph.findNodeIdByElement(i), a = this.graph.getNode(n);
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
    o(this, "onWindowMouseMove", (e) => {
      if (!R(
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
    o(this, "onWindowMouseUp", (e) => {
      this.params.mouseUpEventVerifier(e) && this.cancelMouseDrag();
    });
    o(this, "onWindowTouchMove", (e) => {
      if (e.touches.length !== 1)
        return;
      const t = e.touches[0];
      if (!R(
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
    o(this, "onWindowTouchFinish", () => {
      this.cancelTouchDrag();
    });
    this.canvas = e, this.element = t, this.window = s, this.params = i, this.graph = e.graph, this.graph.onAfterNodeAdded.subscribe(this.onAfterNodeAdded), this.graph.onAfterNodeUpdated.subscribe(this.onAfterNodeUpdated), this.graph.onBeforeNodeRemoved.subscribe(this.onBeforeNodeRemoved), this.graph.onBeforeClear.subscribe(this.onBeforeClear), this.canvas.onBeforeDestroy.subscribe(this.onBeforeDestroy);
  }
  static configure(e, t, s, i) {
    new _(e, t, s, i);
  }
  moveNode(e, t) {
    if (!this.graph.hasNode(e.nodeId))
      return;
    const s = this.calculateContentPoint(t), i = {
      x: s.x - e.dx,
      y: s.y - e.dy
    }, n = this.adjustNodeCoords(i);
    this.canvas.updateNode(e.nodeId, {
      x: n.x,
      y: n.y
    }), this.params.onNodeDrag(e.nodeId);
  }
  moveNodeOnTop(e) {
    if (this.params.moveOnTop) {
      if (this.maxNodePriority++, this.params.moveEdgesOnTop) {
        const t = this.maxNodePriority;
        this.maxNodePriority++, this.graph.getNodeAdjacentEdgeIds(e).forEach((i) => {
          this.canvas.updateEdge(i, { priority: t });
        });
      }
      this.canvas.updateNode(e, { priority: this.maxNodePriority });
    }
  }
  cancelMouseDrag() {
    this.grabbedNode !== null && this.graph.hasNode(this.grabbedNode.nodeId) && this.params.onNodeDragFinished(this.grabbedNode.nodeId), this.grabbedNode = null, $(this.element, null), this.removeMouseDragListeners();
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
const bt = (r, e, t) => ({
  scale: r.scale,
  x: r.x + r.scale * e,
  y: r.y + r.scale * t
}), Pt = (r, e, t, s) => ({
  scale: r.scale * e,
  x: r.scale * (1 - e) * t + r.x,
  y: r.scale * (1 - e) * s + r.y
}), B = (r) => {
  const e = [], t = r.touches.length;
  for (let h = 0; h < t; h++)
    e.push([r.touches[h].clientX, r.touches[h].clientY]);
  const s = e.reduce(
    (h, d) => [h[0] + d[0], h[1] + d[1]],
    [0, 0]
  ), i = [s[0] / t, s[1] / t], a = e.map((h) => [h[0] - i[0], h[1] - i[1]]).reduce(
    (h, d) => h + Math.sqrt(d[0] * d[0] + d[1] * d[1]),
    0
  );
  return {
    x: i[0],
    y: i[1],
    scale: a / t,
    touchesCnt: t,
    touches: e
  };
};
class X {
  constructor(e, t, s, i) {
    o(this, "viewport");
    o(this, "prevTouches", null);
    o(this, "wheelFinishTimer", null);
    o(this, "transformInProgress", !1);
    o(this, "onBeforeDestroy", () => {
      this.removeMouseDragListeners(), this.removeTouchDragListeners();
    });
    o(this, "onMouseDown", (e) => {
      this.params.mouseDownEventVerifier(e) && ($(this.element, this.params.shiftCursor), this.window.addEventListener("mousemove", this.onWindowMouseMove, {
        passive: !0
      }), this.window.addEventListener("mouseup", this.onWindowMouseUp, {
        passive: !0
      }), this.startRegisteredTransform());
    });
    o(this, "onWindowMouseMove", (e) => {
      const t = R(
        this.window,
        this.element,
        e.clientX,
        e.clientY
      );
      if (this.element === null || !t) {
        this.stopMouseDrag();
        return;
      }
      const s = -e.movementX, i = -e.movementY;
      this.moveViewport(s, i);
    });
    o(this, "onWindowMouseUp", (e) => {
      this.params.mouseUpEventVerifier(e) && this.stopMouseDrag();
    });
    o(this, "onWheelScroll", (e) => {
      if (!this.params.mouseWheelEventVerifier(e))
        return;
      const { left: t, top: s } = this.element.getBoundingClientRect(), i = e.clientX - t, n = e.clientY - s, h = 1 / (e.deltaY < 0 ? this.params.wheelSensitivity : 1 / this.params.wheelSensitivity);
      this.wheelFinishTimer === null && this.params.onTransformStarted(), this.scaleViewport(h, i, n), this.wheelFinishTimer !== null && clearTimeout(this.wheelFinishTimer), this.wheelFinishTimer = setTimeout(() => {
        this.transformInProgress || this.params.onTransformFinished(), this.wheelFinishTimer = null;
      }, this.params.scaleWheelFinishTimeout);
    });
    o(this, "onTouchStart", (e) => {
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
    o(this, "onWindowTouchMove", (e) => {
      const t = B(e);
      if (!t.touches.every(
        (i) => R(this.window, this.element, i[0], i[1])
      )) {
        this.stopTouchDrag();
        return;
      }
      if ((t.touchesCnt === 1 || t.touchesCnt === 2) && this.moveViewport(
        -(t.x - this.prevTouches.x),
        -(t.y - this.prevTouches.y)
      ), t.touchesCnt === 2) {
        const { left: i, top: n } = this.element.getBoundingClientRect(), a = this.prevTouches.x - i, h = this.prevTouches.y - n, c = 1 / (t.scale / this.prevTouches.scale);
        this.scaleViewport(c, a, h);
      }
      this.prevTouches = t;
    });
    o(this, "onWindowTouchFinish", (e) => {
      e.touches.length > 0 ? this.prevTouches = B(e) : this.stopTouchDrag();
    });
    o(this, "preventWheelScaleListener", (e) => {
      e.preventDefault();
    });
    this.canvas = e, this.element = t, this.window = s, this.params = i, this.element.addEventListener("wheel", this.preventWheelScaleListener, {
      passive: !1
    }), this.viewport = e.viewport, this.handleResize(), this.viewport.onAfterResize.subscribe(() => {
      this.handleResize();
    }), this.element.addEventListener("mousedown", this.onMouseDown, {
      passive: !0
    }), this.element.addEventListener("wheel", this.onWheelScroll, {
      passive: !0
    }), this.element.addEventListener("touchstart", this.onTouchStart, {
      passive: !0
    }), e.onBeforeDestroy.subscribe(this.onBeforeDestroy);
  }
  static configure(e, t, s, i) {
    new X(e, t, s, i);
  }
  moveViewport(e, t) {
    const s = this.viewport.getViewportMatrix(), i = bt(s, e, t), { width: n, height: a } = this.viewport.getDimensions(), h = this.params.transformPreprocessor({
      prevTransform: s,
      nextTransform: i,
      canvasWidth: n,
      canvasHeight: a
    });
    this.performTransform(h);
  }
  scaleViewport(e, t, s) {
    const i = this.canvas.viewport.getViewportMatrix(), n = Pt(i, e, t, s), { width: a, height: h } = this.viewport.getDimensions(), d = this.params.transformPreprocessor({
      prevTransform: i,
      nextTransform: n,
      canvasWidth: a,
      canvasHeight: h
    });
    this.performTransform(d);
  }
  stopMouseDrag() {
    $(this.element, null), this.removeMouseDragListeners(), this.finishRegisteredTransform();
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
    const e = this.viewport.getViewportMatrix(), { width: t, height: s } = this.viewport.getDimensions(), i = this.params.transformPreprocessor({
      prevTransform: e,
      nextTransform: e,
      canvasWidth: t,
      canvasHeight: s
    });
    this.params.onResizeTransformStarted(), this.canvas.patchViewportMatrix(i), this.params.onResizeTransformFinished();
  }
}
class ee {
  constructor(e, t, s, i, n, a) {
    o(this, "nodeHorizontal");
    o(this, "nodeVertical");
    o(this, "viewport");
    o(this, "currentScale");
    o(this, "loadedArea", {
      xFrom: 1 / 0,
      xTo: 1 / 0,
      yFrom: 1 / 0,
      yTo: 1 / 0
    });
    o(this, "updateLoadedArea", (e) => {
      this.loadedArea = {
        xFrom: e.x,
        xTo: e.x + e.width,
        yFrom: e.y,
        yTo: e.y + e.height
      };
    });
    o(this, "onAfterViewportUpdated", () => {
      this.userTransformInProgress || this.loadAreaAroundViewport();
    });
    o(this, "userTransformInProgress", !1);
    this.canvas = e, this.element = t, this.window = s, this.trigger = n, this.params = a, this.nodeHorizontal = this.params.nodeVerticalRadius, this.nodeVertical = this.params.nodeHorizontalRadius, this.viewport = e.viewport, this.currentScale = this.viewport.getViewportMatrix().scale, this.scheduleLoadAreaAroundViewport(), this.viewport.onAfterResize.subscribe(() => {
      this.scheduleLoadAreaAroundViewport();
    });
    const h = {
      ...i,
      onResizeTransformStarted: () => {
        this.userTransformInProgress = !0, i.onResizeTransformStarted();
      },
      onResizeTransformFinished: () => {
        this.userTransformInProgress = !1, i.onResizeTransformFinished();
      },
      onBeforeTransformChange: () => {
        this.userTransformInProgress = !0, i.onBeforeTransformChange();
      },
      onTransformChange: () => {
        this.userTransformInProgress = !1;
        const d = this.currentScale;
        this.currentScale = this.viewport.getViewportMatrix().scale, d !== this.currentScale && this.scheduleEnsureViewportAreaLoaded(), i.onTransformChange();
      },
      onTransformFinished: () => {
        this.scheduleLoadAreaAroundViewport(), i.onTransformFinished();
      }
    };
    X.configure(
      e,
      this.element,
      this.window,
      h
    ), this.trigger.subscribe(this.updateLoadedArea), this.canvas.viewport.onAfterUpdated.subscribe(this.onAfterViewportUpdated);
  }
  static configure(e, t, s, i, n, a) {
    new ee(
      e,
      t,
      s,
      i,
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
      const { width: e, height: t } = this.viewport.getDimensions(), { scale: s, x: i, y: n } = this.viewport.getViewportMatrix(), a = e * s, h = t * s, d = i - this.nodeHorizontal, c = n - this.nodeVertical, g = i + a + this.nodeHorizontal, l = n + h + this.nodeVertical;
      this.loadedArea.xFrom < d && this.loadedArea.xTo > g && this.loadedArea.yFrom < c && this.loadedArea.yTo > l || this.loadAreaAroundViewport();
    });
  }
  loadAreaAroundViewport() {
    const { width: e, height: t } = this.viewport.getDimensions(), { scale: s, x: i, y: n } = this.viewport.getViewportMatrix(), a = e * s, h = t * s, d = i - a - this.nodeHorizontal, c = n - h - this.nodeVertical, g = 3 * a + 2 * this.nodeHorizontal, l = 3 * h + 2 * this.nodeVertical;
    this.trigger.emit({
      x: d,
      y: c,
      width: g,
      height: l
    });
  }
}
const Nt = () => {
  const r = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  return r.style.position = "absolute", r.style.inset = "0", r;
}, Ct = () => {
  const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  return r.setAttribute("fill", "url(#pattern)"), r;
}, Tt = () => {
  const r = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "pattern"
  );
  return r.setAttribute("id", "pattern"), r;
};
class te {
  constructor(e, t, s) {
    o(this, "svg", Nt());
    o(this, "patternRenderingRectangle", Ct());
    o(this, "pattern", Tt());
    o(this, "patternContent");
    o(this, "tileWidth");
    o(this, "tileHeight");
    o(this, "halfTileWidth");
    o(this, "halfTileHeight");
    o(this, "maxViewportScale");
    o(this, "visible", !1);
    o(this, "onAfterTransformUpdated", () => {
      const e = this.canvas.viewport.getContentMatrix(), t = e.x - this.halfTileWidth * e.scale, s = e.y - this.halfTileHeight * e.scale, i = `matrix(${e.scale}, 0, 0, ${e.scale}, ${t}, ${s})`;
      this.pattern.setAttribute("patternTransform", i), this.updateVisibility();
    });
    this.canvas = e, this.backgroundHost = s, this.tileWidth = t.tileWidth, this.tileHeight = t.tileHeight, this.halfTileWidth = this.tileWidth / 2, this.halfTileHeight = this.tileHeight / 2, this.patternContent = t.renderer, this.maxViewportScale = t.maxViewportScale;
    const i = `translate(${this.halfTileWidth}, ${this.halfTileHeight})`;
    this.patternContent.setAttribute("transform", i), this.pattern.appendChild(this.patternContent);
    const n = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    n.appendChild(this.pattern), this.svg.appendChild(n), this.svg.appendChild(this.patternRenderingRectangle), this.updateDimensions(), this.canvas.viewport.onAfterResize.subscribe(() => {
      this.updateDimensions();
    }), this.canvas.viewport.onAfterUpdated.subscribe(this.onAfterTransformUpdated), this.onAfterTransformUpdated();
  }
  static configure(e, t, s) {
    new te(e, t, s);
  }
  updateVisibility() {
    const t = this.canvas.viewport.getViewportMatrix().scale > this.maxViewportScale;
    t && this.visible ? (this.visible = !1, this.backgroundHost.removeChild(this.svg)) : !t && !this.visible && (this.visible = !0, this.backgroundHost.appendChild(this.svg));
  }
  updateDimensions() {
    const { width: e, height: t } = this.canvas.viewport.getDimensions();
    this.svg.setAttribute("width", `${e}`), this.svg.setAttribute("height", `${t}`), this.patternRenderingRectangle.setAttribute("width", `${e}`), this.patternRenderingRectangle.setAttribute("height", `${t}`);
    const s = this.tileWidth / e, i = this.tileHeight / t;
    this.pattern.setAttribute("width", `${s}`), this.pattern.setAttribute("height", `${i}`);
  }
}
class re {
  constructor(e, t, s, i, n) {
    o(this, "overlayCanvas");
    o(this, "staticPortId", null);
    o(this, "isTargetDragging", !0);
    o(this, "onEdgeCreated", (e) => {
      this.params.onAfterEdgeCreated(e);
    });
    this.canvas = e, this.overlayLayer = t, this.viewportStore = s, this.window = i, this.params = n, this.overlayCanvas = Ie(
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
  static configure(e, t, s, i, n) {
    new re(
      e,
      t,
      s,
      i,
      n
    );
  }
  grabPort(e, t, s) {
    const i = this.canvas.graph.getPort(e);
    this.staticPortId = e;
    const n = i.element.getBoundingClientRect(), a = n.x + n.width / 2, h = n.y + n.height / 2, d = this.overlayLayer.getBoundingClientRect(), c = this.canvas.viewport.createContentCoords({
      x: a - d.x,
      y: h - d.y
    }), g = this.canvas.viewport.createContentCoords({
      x: t.x - d.x,
      y: t.y - d.y
    }), l = {
      overlayNodeId: N.StaticNodeId,
      portCoords: c,
      portDirection: i.direction
    }, u = {
      overlayNodeId: N.DraggingNodeId,
      portCoords: g,
      portDirection: this.params.dragPortDirection
    };
    this.isTargetDragging = s === "direct";
    const [p, f] = this.isTargetDragging ? [l, u] : [u, l];
    this.overlayCanvas.addNode(U(p)), this.overlayCanvas.addNode(U(f)), this.overlayCanvas.addEdge({
      from: p.overlayNodeId,
      to: f.overlayNodeId,
      shape: this.params.edgeShapeFactory(N.EdgeId)
    });
  }
  resetDragState() {
    this.staticPortId = null, this.isTargetDragging = !0, this.overlayCanvas.clear();
  }
  tryCreateConnection(e) {
    const t = be(this.canvas.graph, e), s = this.staticPortId;
    if (t === null) {
      this.params.onEdgeCreationInterrupted({
        staticPortId: s,
        isDirect: this.isTargetDragging
      });
      return;
    }
    const i = this.isTargetDragging ? s : t, n = this.isTargetDragging ? t : s, a = { from: i, to: n }, h = this.params.connectionPreprocessor(a);
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
class se {
  constructor(e, t, s, i, n) {
    o(this, "overlayCanvas");
    o(this, "staticPortId", null);
    o(this, "isTargetDragging", !0);
    o(this, "draggingEdgePayload", null);
    o(this, "onEdgeReattached", (e) => {
      this.params.onAfterEdgeReattached(e);
    });
    this.canvas = e, this.overlayLayer = t, this.viewportStore = s, this.window = i, this.params = n, this.overlayCanvas = Ie(
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
  static configure(e, t, s, i, n) {
    new se(
      e,
      t,
      s,
      i,
      n
    );
  }
  tryStartEdgeDragging(e, t) {
    const s = this.params.draggingEdgeResolver(e);
    if (s === null || !this.canvas.graph.hasEdge(s))
      return !1;
    const i = this.canvas.graph.getEdge(s), n = e === i.from, a = e === i.to, h = n ? i.to : i.from;
    this.staticPortId = h, this.isTargetDragging = a;
    const d = this.canvas.graph.getPort(e), c = this.canvas.graph.getPort(h), g = c.element.getBoundingClientRect(), l = {
      x: g.x + g.width / 2,
      y: g.y + g.height / 2
    }, u = this.overlayLayer.getBoundingClientRect(), p = this.canvas.viewport.createContentCoords({
      x: l.x - u.x,
      y: l.y - u.y
    }), f = this.canvas.viewport.createContentCoords({
      x: t.x - u.x,
      y: t.y - u.y
    });
    this.draggingEdgePayload = {
      id: s,
      from: i.from,
      to: i.to,
      shape: i.shape,
      priority: i.priority
    }, this.canvas.removeEdge(s);
    const E = {
      overlayNodeId: N.StaticNodeId,
      portCoords: p,
      portDirection: c.direction
    }, S = {
      overlayNodeId: N.DraggingNodeId,
      portCoords: f,
      portDirection: d.direction
    }, [b, C] = this.isTargetDragging ? [E, S] : [S, E];
    this.overlayCanvas.addNode(U(b)), this.overlayCanvas.addNode(U(C));
    const P = this.params.draggingEdgeShapeFactory !== null ? this.params.draggingEdgeShapeFactory(N.EdgeId) : i.shape;
    return this.overlayCanvas.addEdge({
      id: N.EdgeId,
      from: b.overlayNodeId,
      to: C.overlayNodeId,
      shape: P
    }), !0;
  }
  resetDragState() {
    this.draggingEdgePayload = null, this.staticPortId = null, this.isTargetDragging = !0, this.overlayCanvas.clear();
  }
  moveDraggingPort(e) {
    const t = this.overlayLayer.getBoundingClientRect(), s = {
      x: e.x - t.x,
      y: e.y - t.y
    }, i = this.canvas.viewport.createContentCoords(s);
    this.overlayCanvas.updateNode(N.DraggingNodeId, {
      x: i.x,
      y: i.y
    });
  }
  tryCreateConnection(e) {
    const t = be(this.canvas.graph, e);
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
    const [s, i] = this.isTargetDragging ? [this.staticPortId, t] : [t, this.staticPortId], n = this.draggingEdgePayload, a = {
      id: n.id,
      from: s,
      to: i,
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
class oe {
  constructor(e, t) {
    this.applier = e, this.trigger = t, this.trigger.subscribe(() => {
      this.applier.apply();
    });
  }
  static configure(e, t) {
    new oe(e, t);
  }
}
class W {
  constructor(e, t, s) {
    o(this, "applyScheduled", !1);
    o(this, "apply", () => {
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
    new W(
      e,
      t,
      s
    );
  }
  scheduleApply() {
    this.applyScheduled || (this.applyScheduled = !0, this.defererFn(this.apply));
  }
}
class Dt {
  static configure(e, t) {
    const s = t.applyOn, i = new xt(e, t.algorithm, {
      staticNodeResolver: t.staticNodeResolver,
      onBeforeApplied: t.onBeforeApplied,
      onAfterApplied: t.onAfterApplied
    });
    switch (s.type) {
      case "manual": {
        oe.configure(
          i,
          s.trigger
        );
        break;
      }
      case "topologyChangeMacrotask": {
        W.configure(
          e.graph,
          i,
          (n) => {
            setTimeout(() => {
              n();
            });
          }
        );
        break;
      }
      case "topologyChangeMicrotask": {
        W.configure(
          e.graph,
          i,
          (n) => {
            queueMicrotask(() => {
              n();
            });
          }
        );
        break;
      }
    }
  }
}
class Mt {
  constructor(e, t) {
    o(this, "previousTimeStamp");
    o(this, "step", (e) => {
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
class ie {
  constructor(e, t, s) {
    o(this, "applier");
    o(this, "step", (e) => {
      this.applier.apply(e);
    });
    this.win = s, this.applier = new St(e, t.algorithm, {
      staticNodeResolver: t.staticNodeResolver,
      onBeforeApplied: t.onBeforeApplied,
      onAfterApplied: t.onAfterApplied
    }), new Mt(this.win, this.step);
  }
  static configure(e, t, s) {
    new ie(e, t, s);
  }
}
const Rt = () => {
  const r = document.createElement("div");
  return r.style.width = "100%", r.style.height = "100%", r.style.position = "relative", r;
}, j = () => {
  const r = document.createElement("div");
  return r.style.position = "absolute", r.style.inset = "0", r;
}, fe = () => {
  const r = j();
  return r.style.pointerEvents = "none", r;
};
class Lt {
  constructor(e) {
    o(this, "background", j());
    o(this, "main", j());
    o(this, "overlayConnectablePorts", fe());
    o(this, "overlayDraggableEdges", fe());
    o(this, "host", Rt());
    this.element = e, this.element.appendChild(this.host), this.host.appendChild(this.background), this.host.appendChild(this.main), this.host.appendChild(this.overlayConnectablePorts), this.host.appendChild(this.overlayDraggableEdges);
  }
  destroy() {
    this.host.removeChild(this.background), this.host.removeChild(this.main), this.host.removeChild(this.overlayConnectablePorts), this.host.removeChild(this.overlayDraggableEdges), this.element.removeChild(this.host);
  }
}
const q = (r) => () => r, ye = q(0), Vt = () => {
  let r = 0;
  return () => r++;
}, Ft = (r, e) => {
  let t = ye, s = ye;
  const i = Vt();
  return r === "incremental" && (t = i), e === "incremental" && (s = i), typeof r == "number" && (t = q(r)), typeof e == "number" && (s = q(e)), typeof r == "function" && (t = r), typeof e == "function" && (s = e), {
    nodesPriorityFn: t,
    edgesPriorityFn: s
  };
}, ne = (r) => {
  if (typeof r == "function")
    return r;
  switch (r.type) {
    case "straight":
      return () => new yt({
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
      return () => new ft({
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
      return () => new mt({
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
      return () => new Re({
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
      return () => new wt({
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
}, It = (r) => {
  var t, s, i, n, a;
  const e = Ft(
    (t = r.nodes) == null ? void 0 : t.priority,
    (s = r.edges) == null ? void 0 : s.priority
  );
  return {
    nodes: {
      centerFn: ((i = r.nodes) == null ? void 0 : i.centerFn) ?? Pe,
      priorityFn: e.nodesPriorityFn
    },
    ports: {
      direction: ((n = r.ports) == null ? void 0 : n.direction) ?? 0
    },
    edges: {
      shapeFactory: ne(((a = r.edges) == null ? void 0 : a.shape) ?? {}),
      priorityFn: e.edgesPriorityFn
    }
  };
}, Bt = (r) => {
  var p, f, E, S, b, C;
  const e = ((p = r.events) == null ? void 0 : p.onNodeDragStarted) ?? (() => {
  }), t = ((f = r.events) == null ? void 0 : f.onNodeDrag) ?? (() => {
  }), s = r.nodeDragVerifier ?? (() => !0), i = ((E = r.events) == null ? void 0 : E.onNodeDragFinished) ?? (() => {
  }), n = r.moveOnTop !== !1, a = r.moveEdgesOnTop !== !1 && n, h = (S = r.mouse) == null ? void 0 : S.dragCursor, d = h !== void 0 ? h : "grab", c = (b = r.mouse) == null ? void 0 : b.mouseDownEventVerifier, g = c !== void 0 ? c : (P) => P.button === 0, l = (C = r.mouse) == null ? void 0 : C.mouseUpEventVerifier, u = l !== void 0 ? l : (P) => P.button === 0;
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
    onNodeDragFinished: i
  };
}, $t = (r) => {
  const e = r.minX !== null ? r.minX : -1 / 0, t = r.maxX !== null ? r.maxX : 1 / 0, s = r.minY !== null ? r.minY : -1 / 0, i = r.maxY !== null ? r.maxY : 1 / 0;
  return (n) => {
    let a = n.nextTransform.x, h = n.nextTransform.y;
    a < e && a < n.prevTransform.x && (a = Math.min(n.prevTransform.x, e));
    const d = n.canvasWidth * n.prevTransform.scale, c = t - d;
    a > c && a > n.prevTransform.x && (a = Math.max(n.prevTransform.x, c)), h < s && h < n.prevTransform.y && (h = Math.min(n.prevTransform.y, s));
    const g = n.canvasHeight * n.prevTransform.scale, l = i - g;
    return h > l && h > n.prevTransform.y && (h = Math.max(n.prevTransform.y, l)), { scale: n.nextTransform.scale, x: a, y: h };
  };
}, Ut = (r) => {
  const e = r.maxContentScale, t = r.minContentScale, s = e !== null ? 1 / e : 0, i = t !== null ? 1 / t : 1 / 0;
  return (n) => {
    const a = n.prevTransform, h = n.nextTransform;
    let d = h.scale, c = h.x, g = h.y;
    if (h.scale > i && h.scale > a.scale) {
      d = Math.max(a.scale, i), c = a.x, g = a.y;
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
}, Ot = (r) => (e) => r.reduce(
  (t, s) => s({
    prevTransform: e.prevTransform,
    nextTransform: t,
    canvasWidth: e.canvasWidth,
    canvasHeight: e.canvasHeight
  }),
  e.nextTransform
), me = (r) => {
  if (typeof r == "function")
    return r;
  switch (r.type) {
    case "scale-limit":
      return Ut({
        minContentScale: r.minContentScale ?? 0,
        maxContentScale: r.maxContentScale ?? 1 / 0
      });
    case "shift-limit":
      return $t({
        minX: r.minX ?? -1 / 0,
        maxX: r.maxX ?? 1 / 0,
        minY: r.minY ?? -1 / 0,
        maxY: r.maxY ?? 1 / 0
      });
  }
}, ve = (r) => {
  var f, E, S, b, C, P, L, V, ae, he, de, ce;
  const e = (f = r == null ? void 0 : r.scale) == null ? void 0 : f.mouseWheelSensitivity, t = e !== void 0 ? e : 1.2, s = r == null ? void 0 : r.transformPreprocessor;
  let i;
  s !== void 0 ? Array.isArray(s) ? i = Ot(
    s.map(
      (T) => me(T)
    )
  ) : i = me(s) : i = (T) => T.nextTransform;
  const n = ((E = r == null ? void 0 : r.shift) == null ? void 0 : E.cursor) !== void 0 ? r.shift.cursor : "grab", a = ((S = r == null ? void 0 : r.events) == null ? void 0 : S.onBeforeTransformChange) ?? (() => {
  }), h = ((b = r == null ? void 0 : r.events) == null ? void 0 : b.onTransformChange) ?? (() => {
  }), d = (C = r == null ? void 0 : r.shift) == null ? void 0 : C.mouseDownEventVerifier, c = d !== void 0 ? d : (T) => T.button === 0, g = (P = r == null ? void 0 : r.shift) == null ? void 0 : P.mouseUpEventVerifier, l = g !== void 0 ? g : (T) => T.button === 0, u = (L = r == null ? void 0 : r.scale) == null ? void 0 : L.mouseWheelEventVerifier, p = u !== void 0 ? u : () => !0;
  return {
    wheelSensitivity: t,
    onTransformStarted: ((V = r == null ? void 0 : r.events) == null ? void 0 : V.onTransformStarted) ?? (() => {
    }),
    onTransformFinished: ((ae = r == null ? void 0 : r.events) == null ? void 0 : ae.onTransformFinished) ?? (() => {
    }),
    onBeforeTransformChange: a,
    onTransformChange: h,
    transformPreprocessor: i,
    shiftCursor: n,
    mouseDownEventVerifier: c,
    mouseUpEventVerifier: l,
    mouseWheelEventVerifier: p,
    scaleWheelFinishTimeout: ((he = r == null ? void 0 : r.scale) == null ? void 0 : he.wheelFinishTimeout) ?? 500,
    onResizeTransformStarted: ((de = r == null ? void 0 : r.events) == null ? void 0 : de.onResizeTransformStarted) ?? (() => {
    }),
    onResizeTransformFinished: ((ce = r == null ? void 0 : r.events) == null ? void 0 : ce.onResizeTransformFinished) ?? (() => {
    })
  };
}, Wt = (r, e) => {
  const t = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  return t.setAttribute("cx", "0"), t.setAttribute("cy", "0"), t.setAttribute("r", `${r}`), t.setAttribute("fill", `${e}`), t;
}, zt = (r) => r instanceof SVGElement ? r : Wt(
  (r == null ? void 0 : r.radius) ?? 1.5,
  (r == null ? void 0 : r.color) ?? "#d8d8d8"
), kt = (r) => {
  const e = r.tileDimensions, t = (e == null ? void 0 : e.width) ?? 25, s = (e == null ? void 0 : e.height) ?? 25, i = zt(r.renderer ?? {});
  return {
    tileWidth: t,
    tileHeight: s,
    renderer: i,
    maxViewportScale: r.maxViewportScale ?? 10
  };
}, Ht = (r, e, t) => {
  var c, g, l;
  const s = () => "direct", i = (u) => u, n = (u) => u.button === 0, a = () => {
  }, h = () => {
  }, d = () => {
  };
  return {
    connectionTypeResolver: r.connectionTypeResolver ?? s,
    connectionPreprocessor: r.connectionPreprocessor ?? i,
    mouseDownEventVerifier: r.mouseDownEventVerifier ?? n,
    mouseUpEventVerifier: r.mouseUpEventVerifier ?? n,
    onAfterEdgeCreated: ((c = r.events) == null ? void 0 : c.onAfterEdgeCreated) ?? a,
    onEdgeCreationInterrupted: ((g = r.events) == null ? void 0 : g.onEdgeCreationInterrupted) ?? d,
    onEdgeCreationPrevented: ((l = r.events) == null ? void 0 : l.onEdgeCreationPrevented) ?? h,
    dragPortDirection: r.dragPortDirection ?? t,
    edgeShapeFactory: r.edgeShape !== void 0 ? ne(r.edgeShape) : e
  };
}, Xt = (r, e) => {
  var c, g, l;
  const t = (u) => u, s = (u) => u.button === 0 && u.ctrlKey, i = (u) => u.button === 0, n = (u) => {
    const p = e.getPortAdjacentEdgeIds(u);
    return p.length > 0 ? p[p.length - 1] : null;
  }, a = () => {
  }, h = () => {
  }, d = () => {
  };
  return {
    connectionPreprocessor: r.connectionPreprocessor ?? t,
    mouseDownEventVerifier: r.mouseDownEventVerifier ?? s,
    mouseUpEventVerifier: r.mouseUpEventVerifier ?? i,
    draggingEdgeResolver: r.draggingEdgeResolver ?? n,
    draggingEdgeShapeFactory: r.draggingEdgeShape !== void 0 ? ne(r.draggingEdgeShape) : null,
    onAfterEdgeReattached: ((c = r.events) == null ? void 0 : c.onAfterEdgeReattached) ?? a,
    onEdgeReattachInterrupted: ((g = r.events) == null ? void 0 : g.onEdgeReattachInterrupted) ?? d,
    onEdgeReattachPrevented: ((l = r.events) == null ? void 0 : l.onEdgeReattachPrevented) ?? h
  };
}, Yt = (r) => ({
  nodeVerticalRadius: r.nodeContainingRadius.vertical,
  nodeHorizontalRadius: r.nodeContainingRadius.horizontal
}), Gt = (r) => {
  var e, t;
  return {
    onAfterNodeDetached: ((e = r == null ? void 0 : r.events) == null ? void 0 : e.onAfterNodeDetached) ?? (() => {
    }),
    onBeforeNodeAttached: ((t = r == null ? void 0 : r.events) == null ? void 0 : t.onBeforeNodeAttached) ?? (() => {
    })
  };
};
class jt extends Error {
  constructor() {
    super(...arguments);
    o(this, "name", "CanvasBuilderError");
  }
}
class Be {
  constructor(e, t, s) {
    o(this, "dt");
    o(this, "nodeMass");
    o(this, "edgeEquilibriumLength");
    o(this, "edgeStiffness");
    o(this, "nodeForcesApplicationStrategy");
    o(this, "distanceVectorGenerator");
    this.graph = e, this.currentCoords = t, this.dt = s.dtSec, this.nodeMass = s.nodeMass, this.edgeEquilibriumLength = s.edgeEquilibriumLength, this.edgeStiffness = s.edgeStiffness, this.distanceVectorGenerator = s.distanceVectorGenerator, this.nodeForcesApplicationStrategy = s.nodeForcesApplicationStrategy;
  }
  apply() {
    let e = 0;
    const t = /* @__PURE__ */ new Map();
    return this.graph.getAllNodeIds().forEach((i) => {
      t.set(i, { x: 0, y: 0 });
    }), this.nodeForcesApplicationStrategy.apply(this.currentCoords, t), this.applyEdgeForces(t), this.currentCoords.forEach((i, n) => {
      const a = t.get(n), h = {
        x: a.x / this.nodeMass * this.dt,
        y: a.y / this.nodeMass * this.dt
      };
      e = Math.max(
        e,
        Math.sqrt(h.x * h.x + h.y * h.y)
      );
      const d = h.x * this.dt, c = h.y * this.dt;
      i.x += d, i.y += c;
    }), e;
  }
  applyEdgeForces(e) {
    this.graph.getAllEdgeIds().forEach((t) => {
      const s = this.graph.getEdge(t), i = this.graph.getPort(s.from), n = this.graph.getPort(s.to), a = this.currentCoords.get(i.nodeId), h = this.currentCoords.get(n.nodeId), d = this.distanceVectorGenerator.create(
        a,
        h
      ), g = (d.d - this.edgeEquilibriumLength) * this.edgeStiffness, l = d.ex * g, u = d.ey * g, p = e.get(i.nodeId), f = e.get(n.nodeId);
      p.x += l, p.y += u, f.x -= l, f.y -= u;
    });
  }
}
class $e {
  constructor(e) {
    o(this, "PI2", 2 * Math.PI);
    this.rand = e;
  }
  create(e, t) {
    const s = t.x - e.x, i = t.y - e.y, n = s * s + i * i;
    if (n === 0) {
      const c = this.PI2 * this.rand();
      return {
        ex: Math.cos(c),
        ey: Math.sin(c),
        d: 0
      };
    }
    const a = Math.sqrt(n), h = s / a, d = i / a;
    return { ex: h, ey: d, d: a };
  }
}
const Ue = (r) => {
  if (r.distance === 0)
    return r.maxForce;
  const e = r.coefficient * (r.sourceCharge * r.targetCharge / (r.distance * r.distance));
  return Math.min(e, r.maxForce);
};
class qt {
  constructor(e) {
    o(this, "nodeCharge");
    o(this, "distanceVectorGenerator");
    o(this, "maxForce");
    this.nodeCharge = e.nodeCharge, this.distanceVectorGenerator = e.distanceVectorGenerator, this.maxForce = e.maxForce;
  }
  apply(e, t) {
    const s = Array.from(t.keys()), i = s.length;
    for (let n = 0; n < i; n++) {
      const a = s[n];
      for (let h = n + 1; h < i; h++) {
        const d = s[h], c = e.get(a), g = e.get(d), l = this.distanceVectorGenerator.create(
          c,
          g
        ), u = Ue({
          coefficient: 1,
          sourceCharge: this.nodeCharge,
          targetCharge: this.nodeCharge,
          distance: l.d,
          maxForce: this.maxForce
        }), p = u * l.ex, f = u * l.ey, E = t.get(a), S = t.get(d);
        E.x -= p, E.y -= f, S.x += p, S.y += f;
      }
    }
  }
}
const Kt = (r) => {
  if (r.size === 0)
    return {
      centerX: 0,
      centerY: 0,
      radius: 0
    };
  let e = 1 / 0, t = -1 / 0, s = 1 / 0, i = -1 / 0;
  r.forEach((d) => {
    e = Math.min(e, d.x), t = Math.max(t, d.x), s = Math.min(s, d.y), i = Math.max(i, d.y);
  });
  const n = t - e, a = i - s, h = Math.max(n, a);
  return {
    centerX: (e + t) / 2,
    centerY: (s + i) / 2,
    radius: h / 2
  };
};
class Qt {
  constructor(e) {
    o(this, "root");
    o(this, "leaves", /* @__PURE__ */ new Map());
    o(this, "coords");
    o(this, "areaRadiusThreshold");
    o(this, "nodeMass");
    o(this, "nodeCharge");
    o(this, "sortedParentNodes", []);
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
        const i = t.pop();
        this.processNode(i).forEach((a) => {
          s.push(a);
        });
      }
      t = s;
    }
    this.sortedParentNodes.reverse().forEach((s) => {
      let i = 0, n = 0, a = 0, h = 0;
      s.lb !== null && (a += s.lb.totalMass, h += s.lb.totalCharge, i += s.lb.chargeCenter.x * s.lb.totalCharge, n += s.lb.chargeCenter.y * s.lb.totalCharge), s.lt !== null && (a += s.lt.totalMass, h += s.lt.totalCharge, i += s.lt.chargeCenter.x * s.lt.totalCharge, n += s.lt.chargeCenter.y * s.lt.totalCharge), s.rb !== null && (a += s.rb.totalMass, h += s.rb.totalCharge, i += s.rb.chargeCenter.x * s.rb.totalCharge, n += s.rb.chargeCenter.y * s.rb.totalCharge), s.rt !== null && (a += s.rt.totalMass, h += s.rt.totalCharge, i += s.rt.chargeCenter.x * s.rt.totalCharge, n += s.rt.chargeCenter.y * s.rt.totalCharge), s.totalMass = a, s.totalCharge = h, s.chargeCenter.x = i / h, s.chargeCenter.y = n / h;
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
    const { centerX: t, centerY: s, radius: i } = e.box;
    if (i < this.areaRadiusThreshold)
      return this.setLeaf(e), [];
    this.sortedParentNodes.push(e);
    const n = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Set(), c = i / 2;
    e.nodeIds.forEach((u) => {
      const { x: p, y: f } = this.coords.get(u);
      p < t ? f < s ? d.add(u) : h.add(u) : f < s ? a.add(u) : n.add(u), e.nodeIds.delete(u);
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
    return e.forEach((i) => {
      const n = this.coords.get(i);
      t += n.x, s += n.y;
    }), { x: t / e.size, y: s / e.size };
  }
}
class Zt {
  constructor(e) {
    o(this, "areaRadiusThreshold");
    o(this, "nodeMass");
    o(this, "nodeCharge");
    o(this, "theta");
    o(this, "distanceVectorGenerator");
    o(this, "nodeForceCoefficient");
    o(this, "maxForce");
    this.areaRadiusThreshold = e.areaRadiusThreshold, this.nodeMass = e.nodeMass, this.nodeCharge = e.nodeCharge, this.theta = e.theta, this.distanceVectorGenerator = e.distanceVectorGenerator, this.nodeForceCoefficient = e.nodeForceCoefficient, this.maxForce = e.maxForce;
  }
  apply(e, t) {
    const s = Kt(e), i = new Qt({
      box: s,
      coords: e,
      areaRadiusThreshold: this.areaRadiusThreshold,
      nodeMass: this.nodeMass,
      nodeCharge: this.nodeCharge
    });
    e.forEach((n, a) => {
      const h = this.calculateForceForNode(
        i.getLeaf(a),
        a,
        e
      ), d = t.get(a);
      this.applyForce(d, h);
    });
  }
  calculateForceForNode(e, t, s) {
    const i = s.get(t), n = { x: 0, y: 0 };
    e.nodeIds.forEach((h) => {
      if (h !== t) {
        const d = s.get(h), c = this.calculateNodeRepulsiveForce({
          sourceCharge: this.nodeCharge,
          targetCharge: this.nodeCharge,
          sourceCoords: d,
          targetCoords: i
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
          i
        );
        h.box.radius * 2 < d.d * this.theta ? (this.tryApplyFarForce({
          totalForce: n,
          targetCoords: i,
          target: h.lb,
          current: a
        }), this.tryApplyFarForce({
          totalForce: n,
          targetCoords: i,
          target: h.rb,
          current: a
        }), this.tryApplyFarForce({
          totalForce: n,
          targetCoords: i,
          target: h.rt,
          current: a
        }), this.tryApplyFarForce({
          totalForce: n,
          targetCoords: i,
          target: h.lt,
          current: a
        })) : (this.tryApplyNearForce({
          totalForce: n,
          targetCoords: i,
          target: h.lb,
          current: a,
          nodesCoords: s
        }), this.tryApplyNearForce({
          totalForce: n,
          targetCoords: i,
          target: h.rb,
          current: a,
          nodesCoords: s
        }), this.tryApplyNearForce({
          totalForce: n,
          targetCoords: i,
          target: h.rt,
          current: a,
          nodesCoords: s
        }), this.tryApplyNearForce({
          totalForce: n,
          targetCoords: i,
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
    const i = { x: 0, y: 0 }, n = [e];
    for (; n.length > 0; ) {
      const a = n.pop();
      a.nodeIds.forEach((h) => {
        const d = s.get(h), c = this.calculateNodeRepulsiveForce({
          sourceCharge: this.nodeCharge,
          targetCharge: this.nodeCharge,
          sourceCoords: d,
          targetCoords: t
        });
        this.applyForce(i, c);
      }), a.lb !== null && n.push(a.lb), a.rb !== null && n.push(a.rb), a.lt !== null && n.push(a.lt), a.rt !== null && n.push(a.rt);
    }
    return i;
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
    ), s = Ue({
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
const Oe = (r) => r.theta !== 0 ? new Zt({
  nodeCharge: r.nodeCharge,
  nodeForceCoefficient: r.nodeForceCoefficient,
  distanceVectorGenerator: r.distanceVectorGenerator,
  maxForce: r.maxForce,
  theta: r.theta,
  nodeMass: r.nodeMass,
  areaRadiusThreshold: r.areaRadiusThreshold
}) : new qt({
  nodeCharge: r.nodeCharge,
  nodeForceCoefficient: r.nodeForceCoefficient,
  distanceVectorGenerator: r.distanceVectorGenerator,
  maxForce: r.maxForce
});
class We {
  constructor(e) {
    o(this, "rand");
    o(this, "sparsity");
    this.rand = e.rand, this.sparsity = e.sparsity;
  }
  calculateCoordinates(e) {
    const { graph: t, viewport: s } = e, i = /* @__PURE__ */ new Map(), n = t.getAllNodeIds(), a = Math.sqrt(n.length) * this.sparsity, { width: h, height: d } = s.getDimensions(), c = { x: h / 2, y: d / 2 }, g = s.createContentCoords(c), l = a / 2, u = {
      x: g.x - l,
      y: g.y - l
    };
    return n.forEach((p) => {
      const f = t.getNode(p);
      i.set(p, {
        x: f.x ?? u.x + a * this.rand(),
        y: f.y ?? u.y + a * this.rand()
      });
    }), i;
  }
}
class Jt {
  constructor(e) {
    o(this, "distanceVectorGenerator");
    o(this, "nodeForcesApplicationStrategy");
    o(this, "fillerLayoutAlgorithm");
    o(this, "maxIterations");
    o(this, "dtSec");
    o(this, "nodeMass");
    o(this, "edgeEquilibriumLength");
    o(this, "edgeStiffness");
    o(this, "convergenceVelocity");
    this.maxIterations = e.maxIterations, this.dtSec = e.dtSec, this.nodeMass = e.nodeMass, this.edgeEquilibriumLength = e.edgeEquilibriumLength, this.edgeStiffness = e.edgeStiffness, this.convergenceVelocity = e.convergenceVelocity, this.distanceVectorGenerator = new $e(e.rand), this.nodeForcesApplicationStrategy = Oe({
      distanceVectorGenerator: this.distanceVectorGenerator,
      nodeCharge: e.nodeCharge,
      maxForce: e.maxForce,
      nodeForceCoefficient: e.nodeForceCoefficient,
      theta: e.barnesHutTheta,
      areaRadiusThreshold: e.barnesHutAreaRadiusThreshold,
      nodeMass: e.nodeMass
    }), this.fillerLayoutAlgorithm = new We({
      rand: e.rand,
      sparsity: e.edgeEquilibriumLength
    });
  }
  calculateCoordinates(e) {
    const { graph: t, viewport: s } = e, i = this.fillerLayoutAlgorithm.calculateCoordinates({
      graph: t,
      viewport: s
    });
    for (let n = 0; n < this.maxIterations && !(new Be(
      t,
      i,
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
    return i;
  }
}
class _t {
  constructor(e) {
    o(this, "forest", /* @__PURE__ */ new Set());
    o(this, "remainingNodeIds");
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
    let i = [t];
    for (; i.length > 0; ) {
      const n = [];
      i.forEach((a) => {
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
      }), i = n;
    }
  }
}
class er {
  constructor(e) {
    o(this, "baseRadius");
    this.baseRadius = e.radius;
  }
  resolve(e) {
    let t = 0, s = -1 / 0;
    const i = [];
    e.forEach((h) => {
      h === null ? (t += this.baseRadius, i.push(t), t += this.baseRadius) : t + this.baseRadius - h < s ? (s += h, i.push(s), t = s + this.baseRadius, s += h) : (t += this.baseRadius, i.push(t), s = t + h, t += this.baseRadius);
    });
    const n = t / 2;
    let a = 0;
    if (e.length > 0) {
      const h = e[e.length - 1] ?? 0, d = i[i.length - 1];
      a = Math.max(
        a,
        d + h - t
      );
      const c = e[0] ?? 0, g = i[0];
      a = Math.max(a, c - g);
    }
    return {
      offsets: i.map((h) => h - n),
      radius: n + a
    };
  }
}
class tr {
  constructor(e, t) {
    o(this, "offsets", /* @__PURE__ */ new Map());
    o(this, "childrenRadii", /* @__PURE__ */ new Map());
    o(this, "layerNodePlacementResolver");
    this.tree = e, this.layerNodePlacementResolver = new er({
      radius: t.spaceAroundRadius
    }), [...this.tree.sequence].reverse().forEach((s) => {
      if (s.children.size === 0)
        this.childrenRadii.set(s.nodeId, null);
      else {
        const i = Array.from(s.children).map(
          (h) => this.childrenRadii.get(h.nodeId)
        ), n = this.layerNodePlacementResolver.resolve(i);
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
class rr {
  constructor(e) {
    this.params = e;
  }
  calculateCoordinates(e) {
    const t = /* @__PURE__ */ new Map(), i = new _t(e.graph).generate();
    let n = 0;
    return i.forEach((a) => {
      t.set(a.root.nodeId, { x: n, y: 0 });
      const d = new tr(a, {
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
    }), t;
  }
}
class sr {
  constructor(e) {
    o(this, "distanceVectorGenerator");
    o(this, "nodeForcesApplicationStrategy");
    o(this, "convergenceVelocity");
    o(this, "maxTimeDeltaSec");
    o(this, "nodeMass");
    o(this, "edgeEquilibriumLength");
    o(this, "edgeStiffness");
    o(this, "fillerLayoutAlgorithm");
    this.convergenceVelocity = e.convergenceVelocity, this.maxTimeDeltaSec = e.maxTimeDeltaSec, this.nodeMass = e.nodeMass, this.edgeEquilibriumLength = e.edgeEquilibriumLength, this.edgeStiffness = e.edgeStiffness, this.distanceVectorGenerator = new $e(e.rand), this.nodeForcesApplicationStrategy = Oe({
      distanceVectorGenerator: this.distanceVectorGenerator,
      nodeCharge: e.nodeCharge,
      maxForce: e.maxForce,
      nodeForceCoefficient: e.nodeForceCoefficient,
      theta: e.barnesHutTheta,
      areaRadiusThreshold: e.barnesHutAreaRadiusThreshold,
      nodeMass: e.nodeMass
    }), this.fillerLayoutAlgorithm = new We({
      rand: e.rand,
      sparsity: e.edgeEquilibriumLength
    });
  }
  calculateNextCoordinates(e) {
    const { graph: t, viewport: s, dt: i } = e, n = this.fillerLayoutAlgorithm.calculateCoordinates({
      graph: t,
      viewport: s
    });
    return new Be(
      t,
      n,
      {
        distanceVectorGenerator: this.distanceVectorGenerator,
        nodeForcesApplicationStrategy: this.nodeForcesApplicationStrategy,
        dtSec: Math.min(i, this.maxTimeDeltaSec),
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
const ze = (r) => {
  let e = 1779033703, t = 3144134277, s = 1013904242, i = 2773480762;
  for (let n = 0, a; n < r.length; n++)
    a = r.charCodeAt(n), e = t ^ Math.imul(e ^ a, 597399067), t = s ^ Math.imul(t ^ a, 2869860233), s = i ^ Math.imul(s ^ a, 951274213), i = e ^ Math.imul(i ^ a, 2716044179);
  return e = Math.imul(s ^ e >>> 18, 597399067), t = Math.imul(i ^ t >>> 22, 2869860233), s = Math.imul(e ^ s >>> 17, 951274213), i = Math.imul(t ^ i >>> 19, 2716044179), e ^= t ^ s ^ i, t ^= e, s ^= e, i ^= e, [e >>> 0, t >>> 0, s >>> 0, i >>> 0];
}, ke = (r, e, t, s) => function() {
  r |= 0, e |= 0, t |= 0, s |= 0;
  const i = (r + e | 0) + s | 0;
  return s = s + 1 | 0, r = e ^ e >>> 9, e = t + (t << 3) | 0, t = t << 21 | t >>> 11, t = t + i | 0, (i >>> 0) / 4294967296;
}, v = Object.freeze({
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
}), or = (r) => {
  var e, t;
  switch (r == null ? void 0 : r.type) {
    case "custom":
      return r.instance;
    default: {
      const s = ze((r == null ? void 0 : r.seed) ?? v.seed), i = ke(s[0], s[1], s[2], s[3]);
      return new sr({
        rand: i,
        maxTimeDeltaSec: (r == null ? void 0 : r.maxTimeDeltaSec) ?? v.maxTimeDeltaSec,
        nodeCharge: (r == null ? void 0 : r.nodeCharge) ?? v.nodeCharge,
        nodeMass: (r == null ? void 0 : r.nodeMass) ?? v.nodeMass,
        edgeEquilibriumLength: (r == null ? void 0 : r.edgeEquilibriumLength) ?? v.edgeEquilibriumLength,
        edgeStiffness: (r == null ? void 0 : r.edgeStiffness) ?? v.edgeStiffness,
        convergenceVelocity: (r == null ? void 0 : r.convergenceVelocity) ?? v.convergenceVelocity,
        maxForce: (r == null ? void 0 : r.maxForce) ?? v.maxForce,
        nodeForceCoefficient: (r == null ? void 0 : r.nodeForceCoefficient) ?? v.nodeForceCoefficient,
        barnesHutTheta: ((e = r == null ? void 0 : r.barnesHut) == null ? void 0 : e.theta) ?? v.barnesHutTheta,
        barnesHutAreaRadiusThreshold: ((t = r == null ? void 0 : r.barnesHut) == null ? void 0 : t.areaRadiusThreshold) ?? v.barnesHutAreaRadiusThreshold
      });
    }
  }
}, G = {
  staticNodeResolver: () => !1,
  onBeforeApplied: () => {
  },
  onAfterApplied: () => {
  }
}, ir = (r) => {
  var t, s;
  return {
    algorithm: or((r == null ? void 0 : r.algorithm) ?? {}),
    staticNodeResolver: (r == null ? void 0 : r.staticNodeResolver) ?? G.staticNodeResolver,
    onBeforeApplied: ((t = r == null ? void 0 : r.events) == null ? void 0 : t.onBeforeApplied) ?? G.onBeforeApplied,
    onAfterApplied: ((s = r == null ? void 0 : r.events) == null ? void 0 : s.onAfterApplied) ?? G.onAfterApplied
  };
}, nr = (r) => r instanceof K ? {
  type: "manual",
  trigger: r
} : (r == null ? void 0 : r.type) === "topologyChangeMacrotask" ? {
  type: "topologyChangeMacrotask"
} : {
  type: "topologyChangeMicrotask"
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
}), ar = (r) => {
  var e, t;
  switch (r == null ? void 0 : r.type) {
    case "custom":
      return r.instance;
    case "hierarchical":
      return new rr({
        layerWidth: r.layerWidth ?? F.hierarchicalLayout.layerWidth,
        layerSpace: r.layerSpace ?? F.hierarchicalLayout.layerSpace
      });
    default: {
      const s = ze((r == null ? void 0 : r.seed) ?? v.seed), i = ke(s[0], s[1], s[2], s[3]);
      return new Jt({
        dtSec: (r == null ? void 0 : r.dtSec) ?? v.dtSec,
        maxIterations: (r == null ? void 0 : r.maxIterations) ?? v.maxIterations,
        rand: i,
        nodeCharge: (r == null ? void 0 : r.nodeCharge) ?? v.nodeCharge,
        nodeMass: (r == null ? void 0 : r.nodeMass) ?? v.nodeMass,
        edgeEquilibriumLength: (r == null ? void 0 : r.edgeEquilibriumLength) ?? v.edgeEquilibriumLength,
        edgeStiffness: (r == null ? void 0 : r.edgeStiffness) ?? v.edgeStiffness,
        convergenceVelocity: (r == null ? void 0 : r.convergenceVelocity) ?? v.convergenceVelocity,
        maxForce: (r == null ? void 0 : r.maxForce) ?? v.maxForce,
        nodeForceCoefficient: (r == null ? void 0 : r.nodeForceCoefficient) ?? v.nodeForceCoefficient,
        barnesHutTheta: ((e = r == null ? void 0 : r.barnesHut) == null ? void 0 : e.theta) ?? v.barnesHutTheta,
        barnesHutAreaRadiusThreshold: ((t = r == null ? void 0 : r.barnesHut) == null ? void 0 : t.areaRadiusThreshold) ?? v.barnesHutAreaRadiusThreshold
      });
    }
  }
}, hr = (r) => {
  var e, t;
  return {
    algorithm: ar(r == null ? void 0 : r.algorithm),
    applyOn: nr(r == null ? void 0 : r.applyOn),
    staticNodeResolver: (r == null ? void 0 : r.staticNodeResolver) ?? F.staticNodeResolver,
    onBeforeApplied: ((e = r == null ? void 0 : r.events) == null ? void 0 : e.onBeforeApplied) ?? F.onBeforeApplied,
    onAfterApplied: ((t = r == null ? void 0 : r.events) == null ? void 0 : t.onAfterApplied) ?? F.onAfterApplied
  };
}, dr = (r, e) => ({
  ...r,
  onNodeDragStarted: (t) => {
    e.add(t), r.onNodeDragStarted(t);
  },
  onNodeDragFinished: (t) => {
    e.delete(t), r.onNodeDragFinished(t);
  }
}), cr = (r, e) => {
  r.onBeforeNodeRemoved.subscribe((t) => {
    e.delete(t);
  }), r.onBeforeClear.subscribe(() => {
    e.clear();
  });
}, lr = (r, e) => ({
  ...r,
  staticNodeResolver: (t) => r.staticNodeResolver(t) || e.has(t)
});
class pr {
  constructor(e) {
    o(this, "used", !1);
    o(this, "canvasDefaults", {});
    o(this, "dragConfig", {});
    o(this, "transformConfig", {});
    o(this, "backgroundConfig", {});
    o(this, "connectablePortsConfig", {});
    o(this, "draggableEdgesConfig", {});
    o(this, "virtualScrollConfig");
    o(this, "layoutConfig", {});
    o(this, "animatedLayoutConfig", {});
    o(this, "hasDraggableNodes", !1);
    o(this, "hasTransformableViewport", !1);
    o(this, "hasNodeResizeReactiveEdges", !1);
    o(this, "hasBackground", !1);
    o(this, "hasUserConnectablePorts", !1);
    o(this, "hasUserDraggableEdges", !1);
    o(this, "hasAnimatedLayout", !1);
    o(this, "hasLayout", !1);
    o(this, "boxRenderingTrigger", new K());
    o(this, "graphStore");
    o(this, "viewportStore");
    o(this, "graph");
    o(this, "viewport");
    o(this, "window", window);
    o(this, "animationStaticNodes", /* @__PURE__ */ new Set());
    this.element = e, this.viewportStore = new Je(this.element), this.viewport = new Fe(this.viewportStore), this.graphStore = new xe(), this.graph = new Ve(this.graphStore);
  }
  /**
   * specifies default values for graph entities
   */
  setDefaults(e) {
    return this.canvasDefaults = e, this;
  }
  /**
   * enables nodes draggable by user
   */
  enableUserDraggableNodes(e) {
    return this.hasDraggableNodes = !0, this.dragConfig = e ?? {}, this;
  }
  /**
   * enables viewport transformable by user
   */
  enableUserTransformableViewport(e) {
    return this.hasTransformableViewport = !0, this.transformConfig = e ?? {}, this;
  }
  /**
   * enables automatic edges update on node resize
   */
  enableNodeResizeReactiveEdges() {
    return this.hasNodeResizeReactiveEdges = !0, this;
  }
  /**
   * enables built-in virtual scroll behavior, when only nodes and edges close
   * to viewport are rendered
   */
  enableVirtualScroll(e) {
    return this.virtualScrollConfig = e, this;
  }
  /**
   * enables built-in background rendering
   */
  enableBackground(e) {
    return this.hasBackground = !0, this.backgroundConfig = e ?? {}, this;
  }
  /**
   * enables edge creation by dragging one port to another
   */
  enableUserConnectablePorts(e) {
    return this.hasUserConnectablePorts = !0, this.connectablePortsConfig = e ?? {}, this;
  }
  /**
   * enables edges dragging by dragging one of the adjacent ports
   */
  enableUserDraggableEdges(e) {
    return this.hasUserDraggableEdges = !0, this.draggableEdgesConfig = e ?? {}, this;
  }
  /**
   * enables nodes positioning with specified layout
   */
  enableLayout(e) {
    return this.layoutConfig = e ?? {}, this.hasLayout = !0, this.hasAnimatedLayout = !1, this;
  }
  /**
   * enables animated nodes positioning with specified layout
   */
  enableAnimatedLayout(e) {
    return this.animatedLayoutConfig = e ?? {}, this.hasAnimatedLayout = !0, this.hasLayout = !1, this;
  }
  /**
   * builds final canvas
   */
  build() {
    if (this.used)
      throw new jt("CanvasBuilder is a single use object");
    this.used = !0;
    const e = new Lt(this.element), t = this.createHtmlView(e.main), s = It(this.canvasDefaults), i = new Ee(
      this.graph,
      this.viewport,
      this.graphStore,
      this.viewportStore,
      t,
      s
    );
    if (this.hasBackground && te.configure(
      i,
      kt(this.backgroundConfig),
      e.background
    ), this.hasNodeResizeReactiveEdges && Q.configure(i), this.hasDraggableNodes) {
      let a = Bt(this.dragConfig);
      this.hasAnimatedLayout && (a = dr(
        a,
        this.animationStaticNodes
      )), _.configure(
        i,
        e.main,
        this.window,
        a
      );
    }
    if (this.hasUserConnectablePorts) {
      const a = Ht(
        this.connectablePortsConfig,
        s.edges.shapeFactory,
        s.ports.direction
      );
      re.configure(
        i,
        e.overlayConnectablePorts,
        this.viewportStore,
        this.window,
        a
      );
    }
    if (this.hasUserDraggableEdges) {
      const a = Xt(
        this.draggableEdgesConfig,
        i.graph
      );
      se.configure(
        i,
        e.overlayDraggableEdges,
        this.viewportStore,
        this.window,
        a
      );
    }
    if (this.virtualScrollConfig !== void 0 ? ee.configure(
      i,
      e.main,
      this.window,
      ve(this.transformConfig),
      this.boxRenderingTrigger,
      Yt(this.virtualScrollConfig)
    ) : this.hasTransformableViewport && X.configure(
      i,
      e.main,
      this.window,
      ve(this.transformConfig)
    ), this.hasLayout && Dt.configure(
      i,
      hr(this.layoutConfig)
    ), this.hasAnimatedLayout) {
      let a = ir(
        this.animatedLayoutConfig
      );
      this.hasDraggableNodes && (cr(
        i.graph,
        this.animationStaticNodes
      ), a = lr(
        a,
        this.animationStaticNodes
      )), ie.configure(i, a, this.window);
    }
    const n = () => {
      e.destroy(), i.onBeforeDestroy.unsubscribe(n);
    };
    return i.onBeforeDestroy.subscribe(n), i;
  }
  createHtmlView(e) {
    let t = new Ae(
      this.graphStore,
      this.viewportStore,
      e
    );
    return this.virtualScrollConfig !== void 0 && (t = new Ke(
      t,
      this.graphStore,
      this.boxRenderingTrigger,
      Gt(this.virtualScrollConfig)
    )), new Qe(t, this.graphStore);
  }
}
export {
  wt as BezierEdgeShape,
  pr as CanvasBuilder,
  jt as CanvasBuilderError,
  A as CanvasError,
  M as ConnectionCategory,
  Re as DirectEdgeShape,
  K as EventSubject,
  ft as HorizontalEdgeShape,
  Et as InteractiveEdgeError,
  Le as InteractiveEdgeShape,
  ur as MidpointEdgeShape,
  yt as StraightEdgeShape,
  mt as VerticalEdgeShape
};
