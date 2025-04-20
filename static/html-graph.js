var oe = Object.defineProperty;
var re = (t, e, o) => e in t ? oe(t, e, { enumerable: !0, configurable: !0, writable: !0, value: o }) : t[e] = o;
var i = (t, e, o) => re(t, typeof e != "symbol" ? e + "" : e, o);
class ie {
  constructor(e) {
    i(this, "onAfterNodeAdded");
    /**
     * @deprecated
     * use onAfterNodeUpdated instead
     */
    i(this, "onAfterNodeCoordinatesUpdated");
    i(this, "onAfterNodeUpdated");
    i(this, "onAfterNodePriorityUpdated");
    i(this, "onBeforeNodeRemoved");
    i(this, "onAfterPortMarked");
    /**
     * @deprecated
     * use onAfterPortMarked instead
     */
    i(this, "onAfterPortAdded");
    i(this, "onAfterPortUpdated");
    /**
     * @deprecated
     * use onAfterPortUpdated instead
     */
    i(this, "onAfterPortDirectionUpdated");
    i(this, "onBeforePortUnmarked");
    /**
     * @deprecated
     * use onBeforePortUnmarked instead
     */
    i(this, "onBeforePortRemoved");
    i(this, "onAfterEdgeAdded");
    i(this, "onAfterEdgeShapeUpdated");
    i(this, "onAfterEdgeUpdated");
    /**
     * @deprecated
     * use onAfterEdgeUpdated instead
     */
    i(this, "onAfterEdgeAdjacentPortsUpdated");
    i(this, "onAfterEdgePriorityUpdated");
    i(this, "onBeforeEdgeRemoved");
    i(this, "onBeforeClear");
    this.graphStore = e, this.onAfterNodeAdded = this.graphStore.onAfterNodeAdded, this.onAfterNodeUpdated = this.graphStore.onAfterNodeUpdated, this.onAfterNodeCoordinatesUpdated = this.onAfterNodeUpdated, this.onAfterNodePriorityUpdated = this.graphStore.onAfterNodePriorityUpdated, this.onBeforeNodeRemoved = this.graphStore.onBeforeNodeRemoved, this.onAfterPortMarked = this.graphStore.onAfterPortAdded, this.onAfterPortAdded = this.onAfterPortMarked, this.onAfterPortUpdated = this.graphStore.onAfterPortUpdated, this.onAfterPortDirectionUpdated = this.onAfterPortUpdated, this.onBeforePortUnmarked = this.graphStore.onBeforePortRemoved, this.onBeforePortRemoved = this.onBeforePortUnmarked, this.onAfterEdgeAdded = this.graphStore.onAfterEdgeAdded, this.onAfterEdgeShapeUpdated = this.graphStore.onAfterEdgeShapeUpdated, this.onAfterEdgeUpdated = this.graphStore.onAfterEdgeUpdated, this.onAfterEdgeAdjacentPortsUpdated = this.onAfterEdgeUpdated, this.onAfterEdgePriorityUpdated = this.graphStore.onAfterEdgePriorityUpdated, this.onBeforeEdgeRemoved = this.graphStore.onBeforeEdgeRemoved, this.onBeforeClear = this.graphStore.onBeforeClear;
  }
  getNode(e) {
    const o = this.graphStore.getNode(e);
    return o === void 0 ? null : {
      element: o.element,
      x: o.x,
      y: o.y,
      centerFn: o.centerFn,
      priority: o.priority
    };
  }
  getAllNodeIds() {
    return this.graphStore.getAllNodeIds();
  }
  getPort(e) {
    const o = this.graphStore.getPort(e);
    return o === void 0 ? null : {
      element: o.element,
      direction: o.direction,
      nodeId: o.nodeId
    };
  }
  getAllPortIds() {
    return this.graphStore.getAllPortIds();
  }
  getNodePortIds(e) {
    return this.graphStore.getNodePortIds(e) ?? null;
  }
  /**
   * @deprecated
   * use graph.getPort()?.nodeId ?? null instead
   */
  getPortNodeId(e) {
    var o;
    return ((o = this.graphStore.getPort(e)) == null ? void 0 : o.nodeId) ?? null;
  }
  getAllEdgeIds() {
    return this.graphStore.getAllEdgeIds();
  }
  getEdge(e) {
    const o = this.graphStore.getEdge(e);
    return o === void 0 ? null : { from: o.from, to: o.to, priority: o.priority };
  }
  getPortIncomingEdgeIds(e) {
    return this.graphStore.getPort(e) === void 0 ? null : this.graphStore.getPortIncomingEdgeIds(e);
  }
  getPortOutcomingEdgeIds(e) {
    return this.graphStore.getPort(e) === void 0 ? null : this.graphStore.getPortOutcomingEdgeIds(e);
  }
  getPortCycleEdgeIds(e) {
    return this.graphStore.getPort(e) === void 0 ? null : this.graphStore.getPortCycleEdgeIds(e);
  }
  getPortAdjacentEdgeIds(e) {
    return this.graphStore.getPort(e) === void 0 ? null : this.graphStore.getPortAdjacentEdgeIds(e);
  }
  getNodeIncomingEdgeIds(e) {
    return this.graphStore.getNode(e) === void 0 ? null : this.graphStore.getNodeIncomingEdgeIds(e);
  }
  getNodeOutcomingEdgeIds(e) {
    return this.graphStore.getNode(e) === void 0 ? null : this.graphStore.getNodeOutcomingEdgeIds(e);
  }
  getNodeCycleEdgeIds(e) {
    return this.graphStore.getNode(e) === void 0 ? null : this.graphStore.getNodeCycleEdgeIds(e);
  }
  getNodeAdjacentEdgeIds(e) {
    return this.graphStore.getNode(e) === void 0 ? null : this.graphStore.getNodeAdjacentEdgeIds(e);
  }
}
class se {
  constructor(e) {
    i(this, "onBeforeUpdated");
    i(this, "onAfterUpdated");
    this.transformer = e, this.onBeforeUpdated = this.transformer.onBeforeUpdated, this.onAfterUpdated = this.transformer.onAfterUpdated;
  }
  getViewportMatrix() {
    return { ...this.transformer.getViewportMatrix() };
  }
  getContentMatrix() {
    return { ...this.transformer.getContentMatrix() };
  }
}
class ne {
  constructor(e, o, r) {
    i(this, "viewport");
    i(this, "graph");
    i(this, "onAfterNodeAdded", (e) => {
      this.htmlView.attachNode(e);
    });
    i(this, "onAfterNodeUpdated", (e) => {
      this.htmlView.updateNodePosition(e), this.graphStore.getNodeAdjacentEdgeIds(e).forEach((r) => {
        this.htmlView.renderEdge(r);
      });
    });
    i(this, "onAfterNodePriorityUpdated", (e) => {
      this.htmlView.updateNodePriority(e);
    });
    i(this, "onBeforeNodeRemoved", (e) => {
      this.graphStore.getNodePortIds(e).forEach((o) => {
        this.unmarkPort(o);
      }), this.htmlView.detachNode(e);
    });
    i(this, "onAfterPortUpdated", (e) => {
      this.graphStore.getPortAdjacentEdgeIds(e).forEach((r) => {
        this.htmlView.renderEdge(r);
      });
    });
    i(this, "onBeforePortUnmarked", (e) => {
      this.graphStore.getPortAdjacentEdgeIds(e).forEach((o) => {
        this.removeEdge(o);
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
      this.htmlView.clear();
    });
    this.graphStore = e, this.viewportStore = o, this.htmlView = r, this.graphStore.onAfterNodeAdded.subscribe(this.onAfterNodeAdded), this.graphStore.onAfterNodeUpdated.subscribe(this.onAfterNodeUpdated), this.graphStore.onAfterNodePriorityUpdated.subscribe(
      this.onAfterNodePriorityUpdated
    ), this.graphStore.onBeforeNodeRemoved.subscribe(this.onBeforeNodeRemoved), this.graphStore.onAfterPortUpdated.subscribe(this.onAfterPortUpdated), this.graphStore.onBeforePortRemoved.subscribe(this.onBeforePortUnmarked), this.graphStore.onAfterEdgeAdded.subscribe(this.onAfterEdgeAdded), this.graphStore.onAfterEdgeShapeUpdated.subscribe(
      this.onAfterEdgeShapeUpdated
    ), this.graphStore.onAfterEdgeUpdated.subscribe(this.onAfterEdgeUpdated), this.graphStore.onAfterEdgePriorityUpdated.subscribe(
      this.onAfterEdgePriorityUpdated
    ), this.graphStore.onBeforeEdgeRemoved.subscribe(this.onBeforeEdgeRemoved), this.graphStore.onBeforeClear.subscribe(this.onBeforeClear), this.graph = new ie(this.graphStore), this.viewport = new se(this.viewportStore);
  }
  attach(e) {
    this.htmlView.attach(e);
  }
  detach() {
    this.htmlView.detach();
  }
  addNode(e) {
    this.graphStore.addNode(e);
  }
  updateNode(e, o) {
    this.graphStore.updateNode(e, o);
  }
  removeNode(e) {
    this.graphStore.removeNode(e);
  }
  markPort(e) {
    this.graphStore.addPort(e);
  }
  updatePort(e, o) {
    this.graphStore.updatePort(e, o);
  }
  unmarkPort(e) {
    this.graphStore.removePort(e);
  }
  addEdge(e) {
    this.graphStore.addEdge(e);
  }
  updateEdge(e, o) {
    this.graphStore.updateEdge(e, o);
  }
  removeEdge(e) {
    this.graphStore.removeEdge(e);
  }
  patchViewportMatrix(e) {
    this.viewportStore.patchViewportMatrix(e);
  }
  patchContentMatrix(e) {
    this.viewportStore.patchContentMatrix(e);
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
    ), this.graphStore.onBeforeEdgeRemoved.unsubscribe(this.onBeforeEdgeRemoved), this.graphStore.onBeforeClear.unsubscribe(this.onBeforeClear), this.clear(), this.htmlView.destroy();
  }
}
const U = (t, e, o) => {
  const { x: r, y: n, width: h, height: s } = t.getBoundingClientRect();
  return e >= r && e <= r + h && o >= n && o <= n + s;
}, $ = (t, e, o) => e >= 0 && e <= t.innerWidth && o >= 0 && o <= t.innerHeight, R = (t, e) => {
  e !== null ? t.style.cursor = e : t.style.removeProperty("cursor");
}, he = (t) => {
  var g, f, x, v, S, p;
  const e = ((g = t == null ? void 0 : t.events) == null ? void 0 : g.onNodeDrag) ?? (() => {
  }), o = ((f = t == null ? void 0 : t.events) == null ? void 0 : f.onBeforeNodeDrag) ?? (() => !0), r = ((x = t == null ? void 0 : t.events) == null ? void 0 : x.onNodeDragFinished) ?? (() => {
  }), n = (t == null ? void 0 : t.moveOnTop) === !1, h = (v = t == null ? void 0 : t.mouse) == null ? void 0 : v.dragCursor, s = h !== void 0 ? h : "grab", d = (S = t == null ? void 0 : t.mouse) == null ? void 0 : S.mouseDownEventVerifier, c = d !== void 0 ? d : (N) => N.button === 0, a = (p = t == null ? void 0 : t.mouse) == null ? void 0 : p.mouseUpEventVerifier;
  return {
    freezePriority: n,
    dragCursor: s,
    mouseDownEventVerifier: c,
    mouseUpEventVerifier: a !== void 0 ? a : (N) => N.button === 0,
    onNodeDrag: e,
    onBeforeNodeDrag: o,
    onNodeDragFinished: r
  };
};
class de {
  constructor(e, o) {
    i(this, "graph");
    i(this, "viewport");
    i(this, "maxNodePriority", 0);
    i(this, "nodes", /* @__PURE__ */ new Map());
    i(this, "grabbedNodeId", null);
    i(this, "element", null);
    i(this, "onWindowMouseMove", (e) => {
      if (this.element !== null && (!U(this.element, e.clientX, e.clientY) || !$(this.window, e.clientX, e.clientY))) {
        this.cancelMouseDrag();
        return;
      }
      this.grabbedNodeId !== null && this.dragNode(this.grabbedNodeId, e.movementX, e.movementY);
    });
    i(this, "onWindowMouseUp", (e) => {
      this.options.mouseUpEventVerifier(e) && this.cancelMouseDrag();
    });
    i(this, "onWindowTouchMove", (e) => {
      if (e.touches.length !== 1)
        return;
      const o = e.touches[0];
      if (this.element !== null && (!U(this.element, o.clientX, o.clientY) || !$(this.window, o.clientX, o.clientY))) {
        this.cancelTouchDrag();
        return;
      }
      if (this.grabbedNodeId !== null && this.previousTouchCoords !== null) {
        const r = o.clientX - this.previousTouchCoords.x, n = o.clientY - this.previousTouchCoords.y;
        this.dragNode(this.grabbedNodeId, r, n), this.previousTouchCoords = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
      }
    });
    i(this, "onWindowTouchFinish", () => {
      this.previousTouchCoords = null, this.cancelTouchDrag();
    });
    i(this, "previousTouchCoords", null);
    i(this, "window", window);
    i(this, "options");
    this.canvas = e, this.viewport = this.canvas.viewport, this.graph = this.canvas.graph, this.options = he(o ?? {});
  }
  attach(e) {
    this.detach(), this.element = e, this.canvas.attach(this.element);
  }
  detach() {
    this.canvas.detach(), this.element !== null && (this.element = null);
  }
  addNode(e) {
    this.canvas.addNode(e), this.updateMaxNodePriority(e.id);
    const o = (n) => {
      if (this.element === null || !this.options.mouseDownEventVerifier(n))
        return;
      const h = this.graph.getNode(e.id);
      this.options.onBeforeNodeDrag({
        nodeId: e.id,
        element: e.element,
        x: h.x,
        y: h.y
      }) && (n.stopImmediatePropagation(), this.grabbedNodeId = e.id, R(this.element, this.options.dragCursor), this.moveNodeOnTop(e.id), this.window.addEventListener("mouseup", this.onWindowMouseUp), this.window.addEventListener("mousemove", this.onWindowMouseMove));
    }, r = (n) => {
      if (n.touches.length !== 1)
        return;
      n.stopImmediatePropagation(), this.previousTouchCoords = {
        x: n.touches[0].clientX,
        y: n.touches[0].clientY
      };
      const h = this.graph.getNode(e.id);
      this.options.onBeforeNodeDrag({
        nodeId: e.id,
        element: e.element,
        x: h.x,
        y: h.y
      }) && (this.grabbedNodeId = e.id, this.moveNodeOnTop(e.id), this.window.addEventListener("touchmove", this.onWindowTouchMove), this.window.addEventListener("touchend", this.onWindowTouchFinish), this.window.addEventListener("touchcancel", this.onWindowTouchFinish));
    };
    this.nodes.set(e.id, {
      element: e.element,
      onMouseDown: o,
      onTouchStart: r
    }), e.element.addEventListener("mousedown", o), e.element.addEventListener("touchstart", r);
  }
  updateNode(e, o) {
    this.canvas.updateNode(e, o), this.updateMaxNodePriority(e);
  }
  removeNode(e) {
    const o = this.nodes.get(e);
    o !== void 0 && (o.element.removeEventListener("mousedown", o.onMouseDown), o.element.removeEventListener("touchstart", o.onTouchStart)), this.nodes.delete(e), this.canvas.removeNode(e);
  }
  markPort(e) {
    this.canvas.markPort(e);
  }
  updatePort(e, o) {
    this.canvas.updatePort(e, o);
  }
  unmarkPort(e) {
    this.canvas.unmarkPort(e);
  }
  addEdge(e) {
    this.canvas.addEdge(e);
  }
  updateEdge(e, o) {
    this.canvas.updateEdge(e, o);
  }
  removeEdge(e) {
    this.canvas.removeEdge(e);
  }
  patchViewportMatrix(e) {
    this.canvas.patchViewportMatrix(e);
  }
  patchContentMatrix(e) {
    this.canvas.patchContentMatrix(e);
  }
  clear() {
    this.canvas.clear(), this.nodes.forEach((e) => {
      e.element.removeEventListener("mousedown", e.onMouseDown), e.element.removeEventListener("touchstart", e.onTouchStart);
    }), this.nodes.clear(), this.maxNodePriority = 0;
  }
  destroy() {
    this.detach(), this.clear(), this.removeMouseDragListeners(), this.removeTouchDragListeners(), this.canvas.destroy();
  }
  dragNode(e, o, r) {
    const n = this.graph.getNode(e);
    if (n === null)
      return;
    const h = this.canvas.viewport.getContentMatrix(), s = h.scale * n.x + h.x, d = h.scale * n.y + h.y, c = s + o, a = d + r, l = this.canvas.viewport.getViewportMatrix(), g = l.scale * c + l.x, f = l.scale * a + l.y;
    this.canvas.updateNode(e, { x: g, y: f }), this.options.onNodeDrag({
      nodeId: e,
      element: n.element,
      x: g,
      y: f
    });
  }
  updateMaxNodePriority(e) {
    const o = this.graph.getNode(e).priority;
    this.maxNodePriority = Math.max(this.maxNodePriority, o);
  }
  moveNodeOnTop(e) {
    if (this.options.freezePriority)
      return;
    this.maxNodePriority += 2, this.updateNode(e, { priority: this.maxNodePriority });
    const o = this.maxNodePriority - 1;
    this.graph.getNodeAdjacentEdgeIds(e).forEach((n) => {
      this.updateEdge(n, { priority: o });
    });
  }
  cancelMouseDrag() {
    const e = this.graph.getNode(this.grabbedNodeId);
    e !== null && this.options.onNodeDragFinished({
      nodeId: this.grabbedNodeId,
      element: e.element,
      x: e.x,
      y: e.y
    }), this.grabbedNodeId = null, this.element !== null && R(this.element, null), this.removeMouseDragListeners();
  }
  removeMouseDragListeners() {
    this.window.removeEventListener("mouseup", this.onWindowMouseUp), this.window.removeEventListener("mousemove", this.onWindowMouseMove);
  }
  cancelTouchDrag() {
    this.previousTouchCoords = null;
    const e = this.graph.getNode(this.grabbedNodeId);
    e !== null && this.options.onNodeDragFinished({
      nodeId: this.grabbedNodeId,
      element: e.element,
      x: e.x,
      y: e.y
    }), this.grabbedNodeId = null, this.removeTouchDragListeners();
  }
  removeTouchDragListeners() {
    this.window.removeEventListener("touchmove", this.onWindowTouchMove), this.window.removeEventListener("touchend", this.onWindowTouchFinish), this.window.removeEventListener("touchcancel", this.onWindowTouchFinish);
  }
}
const ce = (t) => {
  const e = t.minX !== null ? t.minX : -1 / 0, o = t.maxX !== null ? t.maxX : 1 / 0, r = t.minY !== null ? t.minY : -1 / 0, n = t.maxY !== null ? t.maxY : 1 / 0;
  return (h) => {
    let s = h.nextTransform.x, d = h.nextTransform.y;
    s < e && s < h.prevTransform.x && (s = Math.min(h.prevTransform.x, e));
    const c = h.canvasWidth * h.prevTransform.scale, a = o - c;
    s > a && s > h.prevTransform.x && (s = Math.max(h.prevTransform.x, a)), d < r && d < h.prevTransform.y && (d = Math.min(h.prevTransform.y, r));
    const l = h.canvasHeight * h.prevTransform.scale, g = n - l;
    return d > g && d > h.prevTransform.y && (d = Math.max(h.prevTransform.y, g)), { scale: h.nextTransform.scale, x: s, y: d };
  };
}, ae = (t) => {
  const e = t.maxContentScale, o = t.minContentScale, r = e !== null ? 1 / e : 0, n = o !== null ? 1 / o : 1 / 0;
  return (h) => {
    const s = h.prevTransform, d = h.nextTransform;
    let c = d.scale, a = d.x, l = d.y;
    if (d.scale > n && d.scale > s.scale) {
      c = Math.max(s.scale, n), a = s.x, l = s.y;
      const g = (c - s.scale) / (d.scale - s.scale);
      a = s.x + (d.x - s.x) * g, l = s.y + (d.y - s.y) * g;
    }
    if (d.scale < r && d.scale < s.scale) {
      c = Math.min(s.scale, r), a = s.x, l = s.y;
      const g = (c - s.scale) / (d.scale - s.scale);
      a = s.x + (d.x - s.x) * g, l = s.y + (d.y - s.y) * g;
    }
    return {
      scale: c,
      x: a,
      y: l
    };
  };
}, le = (t) => (e) => t.reduce(
  (o, r) => r({
    prevTransform: e.prevTransform,
    nextTransform: o,
    canvasWidth: e.canvasWidth,
    canvasHeight: e.canvasHeight
  }),
  e.nextTransform
), Q = (t) => {
  if (typeof t == "function")
    return t;
  switch (t.type) {
    case "scale-limit":
      return ae({
        minContentScale: t.minContentScale ?? 0,
        maxContentScale: t.maxContentScale ?? 1 / 0
      });
    case "shift-limit":
      return ce({
        minX: t.minX ?? -1 / 0,
        maxX: t.maxX ?? 1 / 0,
        minY: t.minY ?? -1 / 0,
        maxY: t.maxY ?? 1 / 0
      });
  }
}, ge = (t) => {
  var v, S, p, N, k, M, V, L, G, _, J, K;
  const e = (v = t == null ? void 0 : t.scale) == null ? void 0 : v.mouseWheelSensitivity, o = e !== void 0 ? e : 1.2, r = t == null ? void 0 : t.transformPreprocessor;
  let n;
  r !== void 0 ? Array.isArray(r) ? n = le(
    r.map(
      (b) => Q(b)
    )
  ) : n = Q(r) : n = (b) => b.nextTransform;
  const h = ((S = t == null ? void 0 : t.shift) == null ? void 0 : S.cursor) !== void 0 ? t.shift.cursor : "grab", s = ((p = t == null ? void 0 : t.events) == null ? void 0 : p.onBeforeTransformChange) ?? (() => {
  }), d = ((N = t == null ? void 0 : t.events) == null ? void 0 : N.onTransformChange) ?? (() => {
  }), c = (k = t == null ? void 0 : t.shift) == null ? void 0 : k.mouseDownEventVerifier, a = c !== void 0 ? c : (b) => b.button === 0, l = (M = t == null ? void 0 : t.shift) == null ? void 0 : M.mouseUpEventVerifier, g = l !== void 0 ? l : (b) => b.button === 0, f = (V = t == null ? void 0 : t.scale) == null ? void 0 : V.mouseWheelEventVerifier, x = f !== void 0 ? f : () => !0;
  return {
    wheelSensitivity: o,
    onTransformStarted: ((L = t == null ? void 0 : t.events) == null ? void 0 : L.onTransformStarted) ?? (() => {
    }),
    onTransformFinished: ((G = t == null ? void 0 : t.events) == null ? void 0 : G.onTransformFinished) ?? (() => {
    }),
    onBeforeTransformChange: s,
    onTransformChange: d,
    transformPreprocessor: n,
    shiftCursor: h,
    mouseDownEventVerifier: a,
    mouseUpEventVerifier: g,
    mouseWheelEventVerifier: x,
    scaleWheelFinishTimeout: ((_ = t == null ? void 0 : t.scale) == null ? void 0 : _.wheelFinishTimeout) ?? 500,
    onResizeTransformStarted: ((J = t == null ? void 0 : t.events) == null ? void 0 : J.onResizeTransformStarted) ?? (() => {
    }),
    onResizeTransformFinished: ((K = t == null ? void 0 : t.events) == null ? void 0 : K.onResizeTransformFinished) ?? (() => {
    })
  };
}, C = (t) => {
  const e = [], o = t.touches.length;
  for (let d = 0; d < o; d++)
    e.push([t.touches[d].clientX, t.touches[d].clientY]);
  const r = e.reduce(
    (d, c) => [d[0] + c[0], d[1] + c[1]],
    [0, 0]
  ), n = [r[0] / o, r[1] / o], s = e.map((d) => [d[0] - n[0], d[1] - n[1]]).reduce(
    (d, c) => d + Math.sqrt(c[0] * c[0] + c[1] * c[1]),
    0
  );
  return {
    x: n[0],
    y: n[1],
    scale: s / o,
    touchesCnt: o,
    touches: e
  };
}, ue = (t, e, o) => ({
  scale: t.scale,
  x: t.x + t.scale * e,
  y: t.y + t.scale * o
}), we = (t, e, o, r) => ({
  scale: t.scale * e,
  x: t.scale * (1 - e) * o + t.x,
  y: t.scale * (1 - e) * r + t.y
});
class ee {
  constructor(e, o) {
    i(this, "graph");
    i(this, "viewport");
    i(this, "element", null);
    i(this, "prevTouches", null);
    i(this, "window", window);
    i(this, "wheelFinishTimer", null);
    i(this, "onMouseDown", (e) => {
      this.element === null || !this.options.mouseDownEventVerifier(e) || (R(this.element, this.options.shiftCursor), this.window.addEventListener("mousemove", this.onWindowMouseMove), this.window.addEventListener("mouseup", this.onWindowMouseUp), this.options.onTransformStarted());
    });
    i(this, "onWindowMouseMove", (e) => {
      if (this.element === null || !U(this.element, e.clientX, e.clientY) || !$(this.window, e.clientX, e.clientY)) {
        this.stopMouseDrag();
        return;
      }
      const o = -e.movementX, r = -e.movementY;
      this.moveViewport(this.element, o, r);
    });
    i(this, "onWindowMouseUp", (e) => {
      this.element === null || !this.options.mouseUpEventVerifier(e) || this.stopMouseDrag();
    });
    i(this, "onWheelScroll", (e) => {
      if (!this.options.mouseWheelEventVerifier(e))
        return;
      e.preventDefault();
      const { left: o, top: r } = this.element.getBoundingClientRect(), n = e.clientX - o, h = e.clientY - r, d = 1 / (e.deltaY < 0 ? this.options.wheelSensitivity : 1 / this.options.wheelSensitivity);
      this.wheelFinishTimer === null && this.options.onTransformStarted(), this.scaleViewport(this.element, d, n, h), this.wheelFinishTimer !== null && clearTimeout(this.wheelFinishTimer), this.wheelFinishTimer = setTimeout(() => {
        this.options.onTransformFinished(), this.wheelFinishTimer = null;
      }, this.options.scaleWheelFinishTimeout);
    });
    i(this, "onTouchStart", (e) => {
      if (this.prevTouches !== null) {
        this.prevTouches = C(e);
        return;
      }
      this.prevTouches = C(e), this.window.addEventListener("touchmove", this.onWindowTouchMove), this.window.addEventListener("touchend", this.onWindowTouchFinish), this.window.addEventListener("touchcancel", this.onWindowTouchFinish), this.options.onTransformStarted();
    });
    i(this, "onWindowTouchMove", (e) => {
      const o = this.element;
      if (o === null)
        return;
      const r = C(e);
      if (!r.touches.every(
        (h) => U(o, h[0], h[1]) && $(this.window, h[0], h[1])
      )) {
        this.stopTouchDrag();
        return;
      }
      if ((r.touchesCnt === 1 || r.touchesCnt === 2) && this.moveViewport(
        o,
        -(r.x - this.prevTouches.x),
        -(r.y - this.prevTouches.y)
      ), r.touchesCnt === 2) {
        const { left: h, top: s } = o.getBoundingClientRect(), d = this.prevTouches.x - h, c = this.prevTouches.y - s, l = 1 / (r.scale / this.prevTouches.scale);
        this.scaleViewport(o, l, d, c);
      }
      this.prevTouches = r;
    });
    i(this, "onWindowTouchFinish", (e) => {
      e.touches.length > 0 ? this.prevTouches = C(e) : this.stopTouchDrag();
    });
    i(this, "observer", new ResizeObserver(() => {
      const e = this.canvas.viewport.getViewportMatrix(), { width: o, height: r } = this.element.getBoundingClientRect(), n = this.options.transformPreprocessor({
        prevTransform: e,
        nextTransform: e,
        canvasWidth: o,
        canvasHeight: r
      });
      this.options.onResizeTransformStarted(), this.canvas.patchViewportMatrix(n), this.options.onResizeTransformFinished();
    }));
    i(this, "options");
    this.canvas = e, this.options = ge(o), this.viewport = this.canvas.viewport, this.graph = this.canvas.graph;
  }
  attach(e) {
    this.detach(), this.element = e, this.observer.observe(this.element), this.element.addEventListener("mousedown", this.onMouseDown), this.element.addEventListener("wheel", this.onWheelScroll), this.element.addEventListener("touchstart", this.onTouchStart), this.canvas.attach(this.element);
  }
  detach() {
    this.canvas.detach(), this.element !== null && (this.observer.unobserve(this.element), this.element.removeEventListener("mousedown", this.onMouseDown), this.element.removeEventListener("wheel", this.onWheelScroll), this.element.removeEventListener("touchstart", this.onTouchStart), this.element = null);
  }
  addNode(e) {
    this.canvas.addNode(e);
  }
  updateNode(e, o) {
    this.canvas.updateNode(e, o);
  }
  removeNode(e) {
    this.canvas.removeNode(e);
  }
  markPort(e) {
    this.canvas.markPort(e);
  }
  updatePort(e, o) {
    this.canvas.updatePort(e, o);
  }
  unmarkPort(e) {
    this.canvas.unmarkPort(e);
  }
  addEdge(e) {
    this.canvas.addEdge(e);
  }
  updateEdge(e, o) {
    this.canvas.updateEdge(e, o);
  }
  removeEdge(e) {
    this.canvas.removeEdge(e);
  }
  patchViewportMatrix(e) {
    this.canvas.patchViewportMatrix(e);
  }
  patchContentMatrix(e) {
    this.canvas.patchContentMatrix(e);
  }
  clear() {
    this.canvas.clear();
  }
  destroy() {
    this.detach(), this.removeMouseDragListeners(), this.removeTouchDragListeners(), this.canvas.destroy();
  }
  moveViewport(e, o, r) {
    const n = this.viewport.getViewportMatrix(), h = ue(n, o, r), { width: s, height: d } = e.getBoundingClientRect(), c = this.options.transformPreprocessor({
      prevTransform: n,
      nextTransform: h,
      canvasWidth: s,
      canvasHeight: d
    });
    this.performTransform(c);
  }
  scaleViewport(e, o, r, n) {
    const h = this.canvas.viewport.getViewportMatrix(), s = we(h, o, r, n), { width: d, height: c } = e.getBoundingClientRect(), a = this.options.transformPreprocessor({
      prevTransform: h,
      nextTransform: s,
      canvasWidth: d,
      canvasHeight: c
    });
    this.performTransform(a);
  }
  stopMouseDrag() {
    this.element !== null && R(this.element, null), this.removeMouseDragListeners(), this.options.onTransformFinished();
  }
  removeMouseDragListeners() {
    this.window.removeEventListener("mousemove", this.onWindowMouseMove), this.window.removeEventListener("mouseup", this.onWindowMouseUp);
  }
  stopTouchDrag() {
    this.prevTouches = null, this.removeTouchDragListeners(), this.options.onTransformFinished();
  }
  removeTouchDragListeners() {
    this.window.removeEventListener("touchmove", this.onWindowTouchMove), this.window.removeEventListener("touchend", this.onWindowTouchFinish), this.window.removeEventListener("touchcancel", this.onWindowTouchFinish);
  }
  performTransform(e) {
    this.options.onBeforeTransformChange(), this.canvas.patchViewportMatrix(e), this.options.onTransformChange();
  }
}
class fe {
  constructor(e, o, r, n) {
    i(this, "graph");
    i(this, "viewport");
    i(this, "canvas");
    i(this, "element", null);
    i(this, "canvasResizeObserver");
    i(this, "window", window);
    i(this, "nodeHorizontal");
    i(this, "nodeVertical");
    i(this, "viewportWidth", 0);
    i(this, "viewportHeight", 0);
    i(this, "viewportMatrix");
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
    var c, a;
    this.trigger = o, this.virtualScrollOptions = n, this.nodeHorizontal = this.virtualScrollOptions.nodeContainingRadius.horizontal, this.nodeVertical = this.virtualScrollOptions.nodeContainingRadius.vertical, this.canvasResizeObserver = new this.window.ResizeObserver((l) => {
      const g = l[0];
      this.viewportWidth = g.contentRect.width, this.viewportHeight = g.contentRect.height, this.scheduleLoadAreaAroundViewport();
    });
    const h = ((c = r == null ? void 0 : r.events) == null ? void 0 : c.onTransformFinished) ?? (() => {
    }), s = ((a = r == null ? void 0 : r.events) == null ? void 0 : a.onTransformChange) ?? (() => {
    }), d = {
      ...r,
      events: {
        ...r == null ? void 0 : r.events,
        onTransformChange: () => {
          const l = this.viewportMatrix;
          this.viewportMatrix = this.canvas.viewport.getViewportMatrix(), l.scale !== this.viewportMatrix.scale && this.scheduleEnsureViewportAreaLoaded(), s();
        },
        onTransformFinished: () => {
          this.scheduleLoadAreaAroundViewport(), h();
        }
      }
    };
    this.canvas = new ee(
      e,
      d
    ), this.viewportMatrix = this.canvas.viewport.getViewportMatrix(), this.viewport = this.canvas.viewport, this.graph = this.canvas.graph, this.trigger.subscribe(this.updateLoadedArea);
  }
  attach(e) {
    this.detach(), this.element = e, this.canvasResizeObserver.observe(this.element), this.canvas.attach(e);
  }
  detach() {
    this.element !== null && (this.canvasResizeObserver.unobserve(this.element), this.element = null, this.viewportWidth = 0, this.viewportHeight = 0), this.canvas.detach();
  }
  addNode(e) {
    this.canvas.addNode(e);
  }
  updateNode(e, o) {
    this.canvas.updateNode(e, o);
  }
  removeNode(e) {
    this.canvas.removeNode(e);
  }
  markPort(e) {
    this.canvas.markPort(e);
  }
  updatePort(e, o) {
    this.canvas.updatePort(e, o);
  }
  unmarkPort(e) {
    this.canvas.unmarkPort(e);
  }
  addEdge(e) {
    this.canvas.addEdge(e);
  }
  updateEdge(e, o) {
    this.canvas.updateEdge(e, o);
  }
  removeEdge(e) {
    this.canvas.removeEdge(e);
  }
  patchViewportMatrix(e) {
    this.canvas.patchViewportMatrix(e), this.viewportMatrix = this.canvas.viewport.getViewportMatrix(), this.loadAreaAroundViewport();
  }
  patchContentMatrix(e) {
    this.canvas.patchContentMatrix(e), this.viewportMatrix = this.canvas.viewport.getViewportMatrix(), this.loadAreaAroundViewport();
  }
  clear() {
    this.canvas.clear();
  }
  destroy() {
    this.trigger.unsubscribe(this.updateLoadedArea), this.canvas.destroy();
  }
  scheduleLoadAreaAroundViewport() {
    setTimeout(() => {
      this.loadAreaAroundViewport();
    });
  }
  scheduleEnsureViewportAreaLoaded() {
    const e = this.viewportWidth * this.viewportMatrix.scale, o = this.viewportHeight * this.viewportMatrix.scale, r = this.viewportMatrix.x - this.nodeHorizontal, n = this.viewportMatrix.y - this.nodeVertical, h = this.viewportMatrix.x + e + this.nodeHorizontal, s = this.viewportMatrix.y + o + this.nodeVertical;
    this.loadedArea.xFrom < r && this.loadedArea.xTo > h && this.loadedArea.yFrom < n && this.loadedArea.yTo > s || this.scheduleLoadAreaAroundViewport();
  }
  loadAreaAroundViewport() {
    const e = this.viewportWidth * this.viewportMatrix.scale, o = this.viewportHeight * this.viewportMatrix.scale, r = this.viewportMatrix.x - e - this.nodeHorizontal, n = this.viewportMatrix.y - o - this.nodeVertical, h = 3 * e + 2 * this.nodeHorizontal, s = 3 * o + 2 * this.nodeVertical;
    this.trigger.emit({ x: r, y: n, width: h, height: s });
  }
}
const ve = () => {
  const t = document.createElement("div");
  return t.style.width = "100%", t.style.height = "100%", t.style.position = "relative", t.style.overflow = "hidden", t;
}, ye = () => {
  const t = document.createElement("div");
  return t.style.position = "absolute", t.style.top = "0", t.style.left = "0", t.style.width = "0", t.style.height = "0", t;
}, xe = () => {
  const t = document.createElement("div");
  return t.style.position = "absolute", t.style.top = "0", t.style.left = "0", t.style.visibility = "hidden", t;
};
class Ae {
  constructor(e, o) {
    i(this, "canvasWrapper", null);
    i(this, "host", ve());
    i(this, "container", ye());
    i(this, "nodeIdToWrapperElementMap", /* @__PURE__ */ new Map());
    i(this, "edgeIdToElementMap", /* @__PURE__ */ new Map());
    i(this, "applyTransform", () => {
      const e = this.viewportStore.getContentMatrix();
      this.container.style.transform = `matrix(${e.scale}, 0, 0, ${e.scale}, ${e.x}, ${e.y})`;
    });
    this.graphStore = e, this.viewportStore = o, this.host.appendChild(this.container), this.viewportStore.onAfterUpdated.subscribe(this.applyTransform);
  }
  attach(e) {
    this.detach(), this.canvasWrapper = e, this.canvasWrapper.appendChild(this.host), this.graphStore.getAllEdgeIds().forEach((o) => {
      this.renderEdge(o);
    });
  }
  detach() {
    this.canvasWrapper !== null && (this.canvasWrapper.removeChild(this.host), this.canvasWrapper = null);
  }
  attachNode(e) {
    const o = this.graphStore.getNode(e), r = xe();
    r.appendChild(o.element), this.container.appendChild(r), this.nodeIdToWrapperElementMap.set(e, r), this.updateNodePosition(e), this.updateNodePriority(e), r.style.visibility = "visible";
  }
  detachNode(e) {
    const o = this.nodeIdToWrapperElementMap.get(e);
    o.removeChild(o.firstChild), this.container.removeChild(o), this.nodeIdToWrapperElementMap.delete(e);
  }
  attachEdge(e) {
    const o = this.graphStore.getEdge(e).shape.svg;
    this.edgeIdToElementMap.set(e, o), this.container.appendChild(o), this.renderEdge(e), this.updateEdgePriority(e);
  }
  detachEdge(e) {
    const o = this.edgeIdToElementMap.get(e);
    this.container.removeChild(o), this.edgeIdToElementMap.delete(e);
  }
  clear() {
    this.edgeIdToElementMap.forEach((e, o) => {
      this.detachEdge(o);
    }), this.nodeIdToWrapperElementMap.forEach((e, o) => {
      this.detachNode(o);
    });
  }
  destroy() {
    this.viewportStore.onAfterUpdated.unsubscribe(this.applyTransform), this.clear(), this.detach(), this.host.removeChild(this.container);
  }
  updateNodePosition(e) {
    const o = this.nodeIdToWrapperElementMap.get(e), r = this.graphStore.getNode(e), { width: n, height: h } = r.element.getBoundingClientRect(), s = this.viewportStore.getViewportMatrix().scale, d = r.centerFn(n, h), c = r.x - s * d.x, a = r.y - s * d.y;
    o.style.transform = `translate(${c}px, ${a}px)`;
  }
  updateNodePriority(e) {
    const o = this.graphStore.getNode(e), r = this.nodeIdToWrapperElementMap.get(e);
    r.style.zIndex = `${o.priority}`;
  }
  updateEdgeShape(e) {
    const o = this.edgeIdToElementMap.get(e);
    this.container.removeChild(o);
    const r = this.graphStore.getEdge(e);
    this.edgeIdToElementMap.set(e, r.shape.svg), this.container.appendChild(r.shape.svg);
  }
  renderEdge(e) {
    const o = this.graphStore.getEdge(e), r = this.graphStore.getPort(o.from), n = this.graphStore.getPort(o.to), h = r.element.getBoundingClientRect(), s = n.element.getBoundingClientRect(), d = this.host.getBoundingClientRect(), c = this.viewportStore.getViewportMatrix(), a = {
      x: c.scale * (h.left - d.left) + c.x,
      y: c.scale * (h.top - d.top) + c.y
    }, l = {
      x: c.scale * (s.left - d.left) + c.x,
      y: c.scale * (s.top - d.top) + c.y
    }, g = {
      x: a.x,
      y: a.y,
      width: h.width * c.scale,
      height: h.height * c.scale,
      direction: r.direction,
      portId: o.from,
      nodeId: r.nodeId
    }, f = {
      x: l.x,
      y: l.y,
      width: s.width * c.scale,
      height: s.height * c.scale,
      direction: n.direction,
      portId: o.to,
      nodeId: n.nodeId
    };
    o.shape.render({
      from: g,
      to: f
    });
  }
  updateEdgePriority(e) {
    const o = this.graphStore.getEdge(e);
    o.shape.svg.style.zIndex = `${o.priority}`;
  }
}
class Ee {
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
    const o = this.graphStore.getNode(e);
    return o.x >= this.xFrom && o.x <= this.xTo && o.y >= this.yFrom && o.y <= this.yTo;
  }
  hasEdge(e) {
    const o = this.graphStore.getEdge(e), r = this.graphStore.getPort(o.from).nodeId, n = this.graphStore.getPort(o.to).nodeId, h = this.graphStore.getNode(r), s = this.graphStore.getNode(n), d = Math.min(h.x, s.x), c = Math.max(h.x, s.x), a = Math.min(h.y, s.y), l = Math.max(h.y, s.y);
    return d <= this.xTo && c >= this.xFrom && a <= this.yTo && l >= this.yFrom;
  }
}
class pe {
  constructor(e, o, r) {
    i(this, "attachedNodes", /* @__PURE__ */ new Set());
    i(this, "attachedEdges", /* @__PURE__ */ new Set());
    i(this, "renderingBox");
    i(this, "updateViewport", (e) => {
      this.renderingBox.setRenderingBox(e);
      const o = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set();
      this.graphStore.getAllNodeIds().forEach((s) => {
        const d = this.renderingBox.hasNode(s), c = this.attachedNodes.has(s);
        d && !c ? o.add(s) : !d && c && r.add(s);
      }), this.graphStore.getAllEdgeIds().forEach((s) => {
        const d = this.renderingBox.hasEdge(s), c = this.attachedEdges.has(s), a = this.graphStore.getEdge(s), l = this.graphStore.getPort(a.from).nodeId, g = this.graphStore.getPort(a.to).nodeId;
        d && (this.renderingBox.hasNode(l) || (o.add(l), r.delete(l)), this.renderingBox.hasNode(g) || (o.add(g), r.delete(g))), d && !c ? n.add(s) : !d && c && h.add(s);
      }), h.forEach((s) => {
        this.handleDetachEdge(s);
      }), r.forEach((s) => {
        this.handleDetachNode(s);
      }), o.forEach((s) => {
        this.attachedNodes.has(s) || this.handleAttachNode(s);
      }), n.forEach((s) => {
        this.handleAttachEdge(s);
      });
    });
    this.htmlView = e, this.graphStore = o, this.trigger = r, this.renderingBox = new Ee(this.graphStore), this.trigger.subscribe(this.updateViewport);
  }
  attach(e) {
    this.htmlView.attach(e);
  }
  detach() {
    this.htmlView.detach();
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
    this.attachedNodes.has(e) ? this.htmlView.updateNodePosition(e) : this.renderingBox.hasNode(e) && (this.handleAttachNode(e), this.graphStore.getNodeAdjacentEdgeIds(e).forEach((o) => {
      this.attachEdgeEntities(o);
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
    const o = this.graphStore.getEdge(e), r = this.graphStore.getPort(o.from).nodeId, n = this.graphStore.getPort(o.to).nodeId;
    this.attachedNodes.has(r) || this.handleAttachNode(r), this.attachedNodes.has(n) || this.handleAttachNode(n), this.handleAttachEdge(e);
  }
  handleAttachNode(e) {
    this.attachedNodes.add(e), this.htmlView.attachNode(e);
  }
  handleDetachNode(e) {
    this.htmlView.detachNode(e), this.attachedNodes.delete(e);
  }
  handleAttachEdge(e) {
    this.attachedEdges.add(e), this.htmlView.attachEdge(e);
  }
  handleDetachEdge(e) {
    this.htmlView.detachEdge(e), this.attachedEdges.delete(e);
  }
}
class te {
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
    this.callbacks.forEach((o) => {
      o(e);
    });
  }
}
const A = () => {
  const t = new te();
  return [t, t];
};
class z {
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
class E extends Error {
  constructor() {
    super(...arguments);
    i(this, "name", "HtmlGraphError");
  }
}
const Se = (t, e) => ({
  x: t / 2,
  y: e / 2
}), Y = (t) => () => t, Z = Y(0), Ne = () => {
  let t = 0;
  return () => t++;
}, me = (t, e) => {
  let o = Z, r = Z;
  const n = Ne();
  return t === "incremental" && (o = n), e === "incremental" && (r = n), typeof t == "number" && (o = Y(t)), typeof e == "number" && (r = Y(e)), typeof t == "function" && (o = t), typeof e == "function" && (r = e), {
    nodesPriorityFn: o,
    edgesPriorityFn: r
  };
}, y = (t, e, o) => ({
  x: e.x * t.x - e.y * t.y + ((1 - e.x) * o.x + e.y * o.y),
  y: e.y * t.x + e.x * t.y + ((1 - e.x) * o.y - e.y * o.x)
}), m = (t, e, o) => ({ x: e * Math.cos(t), y: o * Math.sin(t) }), w = {
  x: 0,
  y: 0
}, T = (t, e, o, r) => {
  const h = [
    w,
    { x: o, y: r },
    { x: o, y: -r }
  ].map((a) => y(a, t, w)).map((a) => ({ x: a.x + e.x, y: a.y + e.y })), s = `M ${h[0].x} ${h[0].y}`, d = `L ${h[1].x} ${h[1].y}`, c = `L ${h[2].x} ${h[2].y}`;
  return `${s} ${d} ${c}`;
}, D = (t, e) => {
  const o = [];
  if (t.length > 0 && o.push(`M ${t[0].x} ${t[0].y}`), t.length === 2 && o.push(`L ${t[1].x} ${t[1].y}`), t.length > 2) {
    const r = t.length - 1;
    let n = 0, h = 0, s = 0;
    t.forEach((d, c) => {
      let a = 0, l = 0, g = 0;
      const f = c > 0, x = c < r, v = f && x;
      if (f && (a = -n, l = -h, g = s), x) {
        const L = t[c + 1];
        n = L.x - d.x, h = L.y - d.y, s = Math.sqrt(n * n + h * h);
      }
      const p = s !== 0 ? Math.min((v ? e : 0) / s, c < r - 1 ? 0.5 : 1) : 0, N = v ? { x: d.x + n * p, y: d.y + h * p } : d, M = g !== 0 ? Math.min((v ? e : 0) / g, c > 1 ? 0.5 : 1) : 0, V = v ? { x: d.x + a * M, y: d.y + l * M } : d;
      c > 0 && o.push(`L ${V.x} ${V.y}`), v && o.push(
        `C ${d.x} ${d.y} ${d.x} ${d.y} ${N.x} ${N.y}`
      );
    });
  }
  return o.join(" ");
}, I = () => {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  return t.style.pointerEvents = "none", t.style.position = "absolute", t.style.top = "0", t.style.left = "0", t.style.overflow = "visible", t;
}, W = () => {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "g");
  return t.style.transformOrigin = "50% 50%", t;
}, F = (t, e) => {
  const o = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return o.setAttribute("stroke", t), o.setAttribute("stroke-width", `${e}`), o.setAttribute("fill", "none"), o;
}, P = (t) => {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("fill", t), e;
}, B = (t, e) => {
  const o = {
    x: t.x + t.width / 2,
    y: t.y + t.height / 2
  }, r = {
    x: e.x + e.width / 2,
    y: e.y + e.height / 2
  }, n = Math.min(o.x, r.x), h = Math.min(o.y, r.y), s = Math.abs(r.x - o.x), d = Math.abs(r.y - o.y), c = o.x <= r.x ? 1 : -1, a = o.y <= r.y ? 1 : -1;
  return {
    x: n,
    y: h,
    width: s,
    height: d,
    flipX: c,
    flipY: a
  };
}, Te = (t) => {
  const e = y(
    { x: t.arrowLength, y: w.y },
    t.fromVect,
    w
  ), o = y(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVect,
    t.to
  ), r = {
    x: e.x + t.fromVect.x * t.curvature,
    y: e.y + t.fromVect.y * t.curvature
  }, n = {
    x: o.x - t.toVect.x * t.curvature,
    y: o.y - t.toVect.y * t.curvature
  }, h = `M ${e.x} ${e.y} C ${r.x} ${r.y}, ${n.x} ${n.y}, ${o.x} ${o.y}`, s = t.hasSourceArrow ? "" : `M ${w.x} ${w.y} L ${e.x} ${e.y} `, d = t.hasTargetArrow ? "" : ` M ${o.x} ${o.y} L ${t.to.x} ${t.to.y}`;
  return `${s}${h}${d}`;
}, Pe = (t) => {
  const e = t.hasSourceArrow ? y(
    { x: t.arrowLength, y: w.y },
    t.fromVect,
    w
  ) : w, o = t.hasTargetArrow ? y(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVect,
    t.to
  ) : t.to, r = t.arrowLength, n = Math.cos(t.detourDirection) * t.detourDistance, h = Math.sin(t.detourDirection) * t.detourDistance, s = n * t.flipX, d = h * t.flipY, c = y(
    { x: r, y: w.y },
    t.fromVect,
    w
  ), a = {
    x: c.x + s,
    y: c.y + d
  }, l = y(
    { x: t.to.x - r, y: t.to.y },
    t.toVect,
    t.to
  ), g = {
    x: l.x + s,
    y: l.y + d
  }, f = { x: (a.x + g.x) / 2, y: (a.y + g.y) / 2 }, x = {
    x: c.x + t.curvature * t.fromVect.x,
    y: c.y + t.curvature * t.fromVect.y
  }, v = {
    x: l.x - t.curvature * t.toVect.x,
    y: l.y - t.curvature * t.toVect.y
  }, S = {
    x: c.x + s,
    y: c.y + d
  }, p = {
    x: l.x + s,
    y: l.y + d
  };
  return [
    `M ${e.x} ${e.y}`,
    `L ${c.x} ${c.y}`,
    `C ${x.x} ${x.y} ${S.x} ${S.y} ${f.x} ${f.y}`,
    `C ${p.x} ${p.y} ${v.x} ${v.y} ${l.x} ${l.y}`,
    `L ${o.x} ${o.y}`
  ].join(" ");
}, be = (t) => {
  const e = t.hasSourceArrow ? y(
    { x: t.arrowLength, y: w.y },
    t.fromVect,
    w
  ) : w, o = t.hasTargetArrow ? y(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVect,
    t.to
  ) : t.to, r = t.arrowLength + t.arrowOffset, n = r - t.roundness, h = y({ x: n, y: w.y }, t.fromVect, w), s = y(
    { x: t.to.x - n, y: t.to.y },
    t.toVect,
    t.to
  ), d = Math.max((h.x + s.x) / 2, r), c = t.to.y / 2, a = { x: t.flipX > 0 ? d : -r, y: h.y }, l = { x: a.x, y: c }, g = {
    x: t.flipX > 0 ? t.to.x - d : t.to.x + r,
    y: s.y
  }, f = { x: g.x, y: c };
  return D(
    [e, h, a, l, f, g, s, o],
    t.roundness
  );
}, X = (t) => {
  const e = t.hasSourceArrow ? y(
    { x: t.arrowLength, y: w.y },
    t.fromVect,
    w
  ) : w, o = t.hasTargetArrow ? y(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVect,
    t.to
  ) : t.to, r = t.arrowLength + t.arrowOffset, n = y(
    { x: r, y: w.y },
    t.fromVect,
    w
  ), h = Math.cos(t.detourDirection) * t.detourDistance, s = Math.sin(t.detourDirection) * t.detourDistance, d = h * t.flipX, c = s * t.flipY, a = { x: n.x + d, y: n.y + c }, l = y(
    { x: t.to.x - r, y: t.to.y },
    t.toVect,
    t.to
  ), g = { x: l.x + d, y: l.y + c };
  return D(
    [e, n, a, g, l, o],
    t.roundness
  );
}, Me = (t) => {
  const e = t.hasSourceArrow ? y(
    { x: t.arrowLength, y: w.y },
    t.fromVect,
    w
  ) : w, o = t.hasTargetArrow ? y(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVect,
    t.to
  ) : t.to, r = t.arrowLength + t.arrowOffset, n = y({ x: r, y: w.y }, t.fromVect, w), h = y(
    { x: t.to.x - r, y: t.to.y },
    t.toVect,
    t.to
  );
  return D([e, n, h, o], t.roundness);
}, Ve = (t) => {
  const e = t.hasSourceArrow ? y(
    { x: t.arrowLength, y: w.y },
    t.fromVect,
    w
  ) : w, o = t.hasTargetArrow ? y(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVect,
    t.to
  ) : t.to, r = t.arrowLength + t.arrowOffset, n = r - t.roundness, h = y({ x: n, y: w.y }, t.fromVect, w), s = y(
    { x: t.to.x - n, y: t.to.y },
    t.toVect,
    t.to
  ), d = Math.max((h.y + s.y) / 2, r), c = t.to.x / 2, a = { x: h.x, y: t.flipY > 0 ? d : -r }, l = { x: c, y: a.y }, g = {
    x: s.x,
    y: t.flipY > 0 ? t.to.y - d : t.to.y + r
  }, f = { x: c, y: g.y };
  return D(
    [e, h, a, l, f, g, s, o],
    t.roundness
  );
}, H = (t) => {
  const e = t.arrowOffset, o = t.side, r = t.arrowLength + e, n = r + 2 * o, s = [
    { x: t.arrowLength, y: w.y },
    { x: r, y: w.y },
    { x: r, y: t.side },
    { x: n, y: t.side },
    { x: n, y: -t.side },
    { x: r, y: -t.side },
    { x: r, y: w.y },
    { x: t.arrowLength, y: w.y }
  ].map(
    (c) => y(c, t.fromVect, w)
  ), d = `M ${w.x} ${w.y} L ${s[0].x} ${s[0].y} `;
  return `${t.hasSourceArrow || t.hasTargetArrow ? "" : d}${D(s, t.roundness)}`;
}, Le = (t) => {
  const e = t.smallRadius, o = t.radius, r = Math.sqrt(e * e + o * o), n = e + o, h = t.arrowLength + r * (1 - o / n), s = e * o / n, c = [
    { x: t.arrowLength, y: w.y },
    { x: h, y: s },
    { x: h, y: -s }
  ].map((g) => y(g, t.fromVect, w)), a = [
    `M ${c[0].x} ${c[0].y}`,
    `A ${e} ${e} 0 0 1 ${c[1].x} ${c[1].y}`,
    `A ${o} ${o} 0 1 0 ${c[2].x} ${c[2].y}`,
    `A ${e} ${e} 0 0 1 ${c[0].x} ${c[0].y}`
  ].join(" "), l = `M 0 0 L ${c[0].x} ${c[0].y} `;
  return `${t.hasSourceArrow || t.hasTargetArrow ? "" : l}${a}`;
}, u = Object.freeze({
  color: "#777777",
  width: 1,
  arrowLength: 15,
  arrowWidth: 4,
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
  curvature: 90
});
class De {
  constructor(e) {
    i(this, "svg", I());
    i(this, "group", W());
    i(this, "line");
    i(this, "sourceArrow", null);
    i(this, "targetArrow", null);
    i(this, "arrowLength");
    i(this, "arrowWidth");
    i(this, "curvature");
    i(this, "portCycleRadius");
    i(this, "portCycleSmallRadius");
    i(this, "detourDirection");
    i(this, "detourDistance");
    i(this, "hasSourceArrow");
    i(this, "hasTargetArrow");
    this.arrowLength = (e == null ? void 0 : e.arrowLength) ?? u.arrowLength, this.arrowWidth = (e == null ? void 0 : e.arrowWidth) ?? u.arrowWidth, this.curvature = (e == null ? void 0 : e.curvature) ?? u.curvature, this.portCycleRadius = (e == null ? void 0 : e.cycleRadius) ?? u.cycleRadius, this.portCycleSmallRadius = (e == null ? void 0 : e.smallCycleRadius) ?? u.smallCycleRadius, this.detourDirection = (e == null ? void 0 : e.detourDirection) ?? u.detourDirection, this.detourDistance = (e == null ? void 0 : e.detourDistance) ?? u.detourDistance, this.hasSourceArrow = (e == null ? void 0 : e.hasSourceArrow) ?? u.hasSourceArrow, this.hasTargetArrow = (e == null ? void 0 : e.hasTargetArrow) ?? u.hasTargetArrow;
    const o = (e == null ? void 0 : e.color) ?? u.color, r = (e == null ? void 0 : e.width) ?? u.width;
    this.svg.appendChild(this.group), this.line = F(o, r), this.group.appendChild(this.line), this.hasSourceArrow && (this.sourceArrow = P(o), this.group.appendChild(this.sourceArrow)), this.hasTargetArrow && (this.targetArrow = P(o), this.group.appendChild(this.targetArrow));
  }
  render(e) {
    const { x: o, y: r, width: n, height: h, flipX: s, flipY: d } = B(
      e.from,
      e.to
    );
    this.svg.style.transform = `translate(${o}px, ${r}px)`, this.svg.style.width = `${n}px`, this.svg.style.height = `${h}px`, this.group.style.transform = `scale(${s}, ${d})`;
    const c = m(
      e.from.direction,
      s,
      d
    ), a = m(e.to.direction, s, d), l = {
      x: n,
      y: h
    };
    let g, f = a, x = -this.arrowLength;
    if (e.from.portId === e.to.portId ? (g = Le({
      fromVect: c,
      radius: this.portCycleRadius,
      smallRadius: this.portCycleSmallRadius,
      arrowLength: this.arrowLength,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), f = c, x = this.arrowLength) : e.from.nodeId === e.to.nodeId ? g = Pe({
      to: l,
      fromVect: c,
      toVect: a,
      flipX: s,
      flipY: d,
      arrowLength: this.arrowLength,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      curvature: this.curvature,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }) : g = Te({
      to: l,
      fromVect: c,
      toVect: a,
      arrowLength: this.arrowLength,
      curvature: this.curvature,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), this.line.setAttribute("d", g), this.sourceArrow) {
      const v = T(
        c,
        w,
        this.arrowLength,
        this.arrowWidth
      );
      this.sourceArrow.setAttribute("d", v);
    }
    if (this.targetArrow) {
      const v = T(
        f,
        l,
        x,
        this.arrowWidth
      );
      this.targetArrow.setAttribute("d", v);
    }
  }
}
class Ce {
  constructor(e) {
    i(this, "svg", I());
    i(this, "group", W());
    i(this, "line");
    i(this, "sourceArrow", null);
    i(this, "targetArrow", null);
    i(this, "arrowLength");
    i(this, "arrowWidth");
    i(this, "arrowOffset");
    i(this, "roundness");
    i(this, "cycleSquareSide");
    i(this, "detourDirection");
    i(this, "detourDistance");
    i(this, "hasSourceArrow");
    i(this, "hasTargetArrow");
    this.arrowLength = (e == null ? void 0 : e.arrowLength) ?? u.arrowLength, this.arrowWidth = (e == null ? void 0 : e.arrowWidth) ?? u.arrowWidth, this.arrowOffset = (e == null ? void 0 : e.arrowOffset) ?? u.arrowOffset, this.cycleSquareSide = (e == null ? void 0 : e.cycleSquareSide) ?? u.cycleSquareSide;
    const o = (e == null ? void 0 : e.roundness) ?? u.roundness;
    this.roundness = Math.min(
      o,
      this.arrowOffset,
      this.cycleSquareSide / 2
    ), this.detourDirection = (e == null ? void 0 : e.detourDirection) ?? u.detourDirection, this.detourDistance = (e == null ? void 0 : e.detourDistance) ?? u.detourDistance, this.hasSourceArrow = (e == null ? void 0 : e.hasSourceArrow) ?? u.hasSourceArrow, this.hasTargetArrow = (e == null ? void 0 : e.hasTargetArrow) ?? u.hasTargetArrow;
    const r = (e == null ? void 0 : e.color) ?? u.color, n = (e == null ? void 0 : e.width) ?? u.width;
    this.svg.appendChild(this.group), this.line = F(r, n), this.group.appendChild(this.line), this.hasSourceArrow && (this.sourceArrow = P(r), this.group.appendChild(this.sourceArrow)), this.hasTargetArrow && (this.targetArrow = P(r), this.group.appendChild(this.targetArrow));
  }
  render(e) {
    const { x: o, y: r, width: n, height: h, flipX: s, flipY: d } = B(
      e.from,
      e.to
    );
    this.svg.style.transform = `translate(${o}px, ${r}px)`, this.svg.style.width = `${n}px`, this.svg.style.height = `${h}px`, this.group.style.transform = `scale(${s}, ${d})`;
    const c = m(
      e.from.direction,
      s,
      d
    ), a = m(e.to.direction, s, d), l = {
      x: n,
      y: h
    };
    let g, f = a, x = -this.arrowLength;
    if (e.from.portId === e.to.portId ? (g = H({
      fromVect: c,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), f = c, x = this.arrowLength) : e.from.nodeId === e.to.nodeId ? g = X({
      to: l,
      fromVect: c,
      toVect: a,
      flipX: s,
      flipY: d,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }) : g = be({
      to: l,
      fromVect: c,
      toVect: a,
      flipX: s,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), this.line.setAttribute("d", g), this.sourceArrow) {
      const v = T(
        c,
        w,
        this.arrowLength,
        this.arrowWidth
      );
      this.sourceArrow.setAttribute("d", v);
    }
    if (this.targetArrow) {
      const v = T(
        f,
        l,
        x,
        this.arrowWidth
      );
      this.targetArrow.setAttribute("d", v);
    }
  }
}
class Ue {
  constructor(e) {
    i(this, "svg", I());
    i(this, "group", W());
    i(this, "line");
    i(this, "sourceArrow", null);
    i(this, "targetArrow", null);
    i(this, "arrowLength");
    i(this, "arrowWidth");
    i(this, "arrowOffset");
    i(this, "roundness");
    i(this, "cycleSquareSide");
    i(this, "detourDirection");
    i(this, "detourDistance");
    i(this, "hasSourceArrow");
    i(this, "hasTargetArrow");
    this.arrowLength = (e == null ? void 0 : e.arrowLength) ?? u.arrowLength, this.arrowWidth = (e == null ? void 0 : e.arrowWidth) ?? u.arrowWidth, this.arrowOffset = (e == null ? void 0 : e.arrowOffset) ?? u.arrowOffset, this.cycleSquareSide = (e == null ? void 0 : e.cycleSquareSide) ?? u.cycleSquareSide;
    const o = (e == null ? void 0 : e.roundness) ?? u.roundness;
    this.roundness = Math.min(
      o,
      this.arrowOffset,
      this.cycleSquareSide / 2
    ), this.detourDirection = (e == null ? void 0 : e.detourDirection) ?? u.detourDirection, this.detourDistance = (e == null ? void 0 : e.detourDistance) ?? u.detourDistance, this.hasSourceArrow = (e == null ? void 0 : e.hasSourceArrow) ?? u.hasSourceArrow, this.hasTargetArrow = (e == null ? void 0 : e.hasTargetArrow) ?? u.hasTargetArrow;
    const r = (e == null ? void 0 : e.color) ?? u.color, n = (e == null ? void 0 : e.width) ?? u.width;
    this.svg.appendChild(this.group), this.line = F(r, n), this.group.appendChild(this.line), this.hasSourceArrow && (this.sourceArrow = P(r), this.group.appendChild(this.sourceArrow)), this.hasTargetArrow && (this.targetArrow = P(r), this.group.appendChild(this.targetArrow));
  }
  render(e) {
    const { x: o, y: r, width: n, height: h, flipX: s, flipY: d } = B(
      e.from,
      e.to
    );
    this.svg.style.transform = `translate(${o}px, ${r}px)`, this.svg.style.width = `${n}px`, this.svg.style.height = `${h}px`, this.group.style.transform = `scale(${s}, ${d})`;
    const c = m(
      e.from.direction,
      s,
      d
    ), a = m(e.to.direction, s, d), l = {
      x: n,
      y: h
    };
    let g, f = a, x = -this.arrowLength;
    if (e.from.portId === e.to.portId ? (g = H({
      fromVect: c,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), f = c, x = this.arrowLength) : e.from.nodeId === e.to.nodeId ? g = X({
      to: l,
      fromVect: c,
      toVect: a,
      flipX: s,
      flipY: d,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }) : g = Me({
      to: l,
      fromVect: c,
      toVect: a,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), this.line.setAttribute("d", g), this.sourceArrow) {
      const v = T(
        c,
        w,
        this.arrowLength,
        this.arrowWidth
      );
      this.sourceArrow.setAttribute("d", v);
    }
    if (this.targetArrow) {
      const v = T(
        f,
        l,
        x,
        this.arrowWidth
      );
      this.targetArrow.setAttribute("d", v);
    }
  }
}
class $e {
  constructor(e) {
    i(this, "svg", I());
    i(this, "group", W());
    i(this, "line");
    i(this, "sourceArrow", null);
    i(this, "targetArrow", null);
    i(this, "arrowLength");
    i(this, "arrowWidth");
    i(this, "arrowOffset");
    i(this, "roundness");
    i(this, "cycleSquareSide");
    i(this, "detourDirection");
    i(this, "detourDistance");
    i(this, "hasSourceArrow");
    i(this, "hasTargetArrow");
    this.arrowLength = (e == null ? void 0 : e.arrowLength) ?? u.arrowLength, this.arrowWidth = (e == null ? void 0 : e.arrowWidth) ?? u.arrowWidth, this.arrowOffset = (e == null ? void 0 : e.arrowOffset) ?? u.arrowOffset, this.cycleSquareSide = (e == null ? void 0 : e.cycleSquareSide) ?? u.cycleSquareSide;
    const o = (e == null ? void 0 : e.roundness) ?? u.roundness;
    this.roundness = Math.min(
      o,
      this.arrowOffset,
      this.cycleSquareSide / 2
    ), this.detourDirection = (e == null ? void 0 : e.detourDirection) ?? u.detourDirectionVertical, this.detourDistance = (e == null ? void 0 : e.detourDistance) ?? u.detourDistance, this.hasSourceArrow = (e == null ? void 0 : e.hasSourceArrow) ?? u.hasSourceArrow, this.hasTargetArrow = (e == null ? void 0 : e.hasTargetArrow) ?? u.hasTargetArrow;
    const r = (e == null ? void 0 : e.color) ?? u.color, n = (e == null ? void 0 : e.width) ?? u.width;
    this.svg.appendChild(this.group), this.line = F(r, n), this.group.appendChild(this.line), this.hasSourceArrow && (this.sourceArrow = P(r), this.group.appendChild(this.sourceArrow)), this.hasTargetArrow && (this.targetArrow = P(r), this.group.appendChild(this.targetArrow));
  }
  render(e) {
    const { x: o, y: r, width: n, height: h, flipX: s, flipY: d } = B(
      e.from,
      e.to
    );
    this.svg.style.transform = `translate(${o}px, ${r}px)`, this.svg.style.width = `${n}px`, this.svg.style.height = `${h}px`, this.group.style.transform = `scale(${s}, ${d})`;
    const c = m(
      e.from.direction,
      s,
      d
    ), a = m(e.to.direction, s, d), l = {
      x: n,
      y: h
    };
    let g, f = a, x = -this.arrowLength;
    if (e.from.portId === e.to.portId ? (g = H({
      fromVect: c,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), f = c, x = this.arrowLength) : e.from.nodeId === e.to.nodeId ? g = X({
      to: l,
      fromVect: c,
      toVect: a,
      flipX: s,
      flipY: d,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }) : g = Ve({
      to: l,
      fromVect: c,
      toVect: a,
      flipY: d,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), this.line.setAttribute("d", g), this.sourceArrow) {
      const v = T(
        c,
        w,
        this.arrowLength,
        this.arrowWidth
      );
      this.sourceArrow.setAttribute("d", v);
    }
    if (this.targetArrow) {
      const v = T(
        f,
        l,
        x,
        this.arrowWidth
      );
      this.targetArrow.setAttribute("d", v);
    }
  }
}
const Re = (t) => {
  if (typeof t == "function")
    return t;
  switch (t == null ? void 0 : t.type) {
    case "straight":
      return () => new Ue({
        color: t.color,
        width: t.width,
        arrowLength: t.arrowLength,
        arrowWidth: t.arrowWidth,
        arrowOffset: t.arrowOffset,
        hasSourceArrow: t.hasSourceArrow,
        hasTargetArrow: t.hasTargetArrow,
        cycleSquareSide: t.cycleSquareSide,
        roundness: t.roundness,
        detourDistance: t.detourDistance,
        detourDirection: t.detourDirection
      });
    case "horizontal":
      return () => new Ce({
        color: t.color,
        width: t.width,
        arrowLength: t.arrowLength,
        arrowWidth: t.arrowWidth,
        arrowOffset: t.arrowOffset,
        hasSourceArrow: t.hasSourceArrow,
        hasTargetArrow: t.hasTargetArrow,
        cycleSquareSide: t.cycleSquareSide,
        roundness: t.roundness,
        detourDistance: t.detourDistance,
        detourDirection: t.detourDirection
      });
    case "vertical":
      return () => new $e({
        color: t.color,
        width: t.width,
        arrowLength: t.arrowLength,
        arrowWidth: t.arrowWidth,
        arrowOffset: t.arrowOffset,
        hasSourceArrow: t.hasSourceArrow,
        hasTargetArrow: t.hasTargetArrow,
        cycleSquareSide: t.cycleSquareSide,
        roundness: t.roundness,
        detourDistance: t.detourDistance,
        detourDirection: t.detourDirection
      });
    default:
      return () => new De({
        color: t.color,
        width: t.width,
        arrowLength: t.arrowLength,
        arrowWidth: t.arrowWidth,
        hasSourceArrow: t.hasSourceArrow,
        hasTargetArrow: t.hasTargetArrow,
        cycleRadius: t.cycleRadius,
        smallCycleRadius: t.smallCycleRadius,
        curvature: t.curvature,
        detourDistance: t.detourDistance,
        detourDirection: t.detourDirection
      });
  }
}, Ie = (t) => {
  var o, r, n, h, s;
  const e = me(
    (o = t == null ? void 0 : t.nodes) == null ? void 0 : o.priority,
    (r = t == null ? void 0 : t.edges) == null ? void 0 : r.priority
  );
  return {
    nodes: {
      centerFn: ((n = t == null ? void 0 : t.nodes) == null ? void 0 : n.centerFn) ?? Se,
      priorityFn: e.nodesPriorityFn
    },
    ports: {
      direction: ((h = t == null ? void 0 : t.ports) == null ? void 0 : h.direction) ?? 0
    },
    edges: {
      shapeFactory: Re(((s = t == null ? void 0 : t.edges) == null ? void 0 : s.shape) ?? {}),
      priorityFn: e.edgesPriorityFn
    }
  };
};
class We {
  constructor(e, o, r) {
    i(this, "nodeIdGenerator", new z(
      (e) => this.graph.getNode(e) !== null
    ));
    i(this, "portIdGenerator", new z(
      (e) => this.graph.getPort(e) !== null
    ));
    i(this, "edgeIdGenerator", new z(
      (e) => this.graph.getEdge(e) !== null
    ));
    i(this, "defaults");
    /**
     * provides api for accessing graph model
     */
    i(this, "graph");
    /**
     * provides api for accessing viewport state
     */
    i(this, "viewport");
    this.element = e, this.controller = o, this.defaults = Ie(r), this.graph = o.graph, this.viewport = o.viewport, this.attach(this.element);
  }
  /**
   * @deprecated
   * use CanvasBuilder.attach instead
   * attaches canvas to given element
   * detaches element first when canvas is attached
   */
  attach(e) {
    return this.controller.attach(e), this;
  }
  /**
   * @deprecated
   * attach canvas once instead, then reattach wrapper element
   * detaches canvas from element when attached
   */
  detach() {
    return this.controller.detach(), this;
  }
  /**
   * adds node to graph
   */
  addNode(e) {
    const o = this.nodeIdGenerator.create(e.id);
    if (this.graph.getNode(o) !== null)
      throw new E("failed to add node with existing id");
    if (this.controller.addNode({
      id: o,
      element: e.element,
      x: e.x,
      y: e.y,
      centerFn: e.centerFn ?? this.defaults.nodes.centerFn,
      priority: e.priority ?? this.defaults.nodes.priorityFn()
    }), e.ports !== void 0)
      for (const r of e.ports)
        this.markPort({
          id: r.id,
          element: r.element,
          nodeId: o,
          direction: r.direction
        });
    return this;
  }
  /**
   * updates node parameters
   */
  updateNode(e, o) {
    if (this.graph.getNode(e) === null)
      throw new E("failed to update nonexisting node");
    return this.controller.updateNode(e, o ?? {}), this;
  }
  /**
   * removes node from graph
   * all the ports of node get unmarked
   * all the edges adjacent to node get removed
   */
  removeNode(e) {
    if (this.graph.getNode(e) === null)
      throw new E("failed to remove nonexisting node");
    return this.controller.removeNode(e), this;
  }
  /**
   * marks element as port of node
   */
  markPort(e) {
    const o = this.portIdGenerator.create(e.id);
    if (this.graph.getPort(o) !== null)
      throw new E("failed to add port with existing id");
    if (this.graph.getNode(e.nodeId) === null)
      throw new E("failed to set port on nonexisting node");
    return this.controller.markPort({
      id: o,
      element: e.element,
      nodeId: e.nodeId,
      direction: e.direction ?? this.defaults.ports.direction
    }), this;
  }
  /**
   * updates port and attached edges
   */
  updatePort(e, o) {
    if (this.graph.getPort(e) === null)
      throw new E("failed to unset nonexisting port");
    return this.controller.updatePort(e, o ?? {}), this;
  }
  /**
   * ummarks element as port of node
   * all the edges adjacent to port get removed
   */
  unmarkPort(e) {
    if (this.graph.getPort(e) === null)
      throw new E("failed to unset nonexisting port");
    return this.controller.unmarkPort(e), this;
  }
  /**
   * adds edge to graph
   */
  addEdge(e) {
    const o = this.edgeIdGenerator.create(e.id);
    if (this.graph.getEdge(o) !== null)
      throw new E("failed to add edge with existing id");
    if (this.graph.getPort(e.from) === null)
      throw new E("failed to add edge from nonexisting port");
    if (this.graph.getPort(e.to) === null)
      throw new E("failed to add edge to nonexisting port");
    return this.controller.addEdge({
      id: o,
      from: e.from,
      to: e.to,
      shape: e.shape ?? this.defaults.edges.shapeFactory(),
      priority: e.priority ?? this.defaults.edges.priorityFn()
    }), this;
  }
  /**
   * updates edge
   */
  updateEdge(e, o) {
    if (this.graph.getEdge(e) === null)
      throw new E("failed to update nonexisting edge");
    return this.controller.updateEdge(e, o ?? {}), this;
  }
  /**
   * removes edge from graph
   */
  removeEdge(e) {
    if (this.graph.getEdge(e) === null)
      throw new E("failed to remove nonexisting edge");
    return this.controller.removeEdge(e), this;
  }
  /**
   * applies transformation for viewport
   */
  patchViewportMatrix(e) {
    return this.controller.patchViewportMatrix(e), this;
  }
  /**
   * applies transformation for content
   */
  patchContentMatrix(e) {
    return this.controller.patchContentMatrix(e), this;
  }
  /**
   * clears canvas from nodes and edges
   * canvas gets rolled back to initial state and can be reused
   */
  clear() {
    return this.controller.clear(), this.nodeIdGenerator.reset(), this.portIdGenerator.reset(), this.edgeIdGenerator.reset(), this;
  }
  /**
   * destroys canvas
   * canvas element gets rolled back to initial state, and can not be reused
   */
  destroy() {
    this.controller.destroy();
  }
}
class Fe {
  constructor() {
    i(this, "nodes", /* @__PURE__ */ new Map());
    i(this, "ports", /* @__PURE__ */ new Map());
    i(this, "edges", /* @__PURE__ */ new Map());
    i(this, "incommingEdges", /* @__PURE__ */ new Map());
    i(this, "outcommingEdges", /* @__PURE__ */ new Map());
    i(this, "cycleEdges", /* @__PURE__ */ new Map());
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
    [this.afterNodeAddedEmitter, this.onAfterNodeAdded] = A(), [this.afterNodeUpdatedEmitter, this.onAfterNodeUpdated] = A(), [this.afterNodePriorityUpdatedEmitter, this.onAfterNodePriorityUpdated] = A(), [this.beforeNodeRemovedEmitter, this.onBeforeNodeRemoved] = A(), [this.afterPortAddedEmitter, this.onAfterPortAdded] = A(), [this.afterPortUpdatedEmitter, this.onAfterPortUpdated] = A(), [this.beforePortRemovedEmitter, this.onBeforePortRemoved] = A(), [this.afterEdgeAddedEmitter, this.onAfterEdgeAdded] = A(), [this.afterEdgeShapeUpdatedEmitter, this.onAfterEdgeShapeUpdated] = A(), [this.afterEdgeUpdatedEmitter, this.onAfterEdgeUpdated] = A(), [this.afterEdgePriorityUpdatedEmitter, this.onAfterEdgePriorityUpdated] = A(), [this.beforeEdgeRemovedEmitter, this.onBeforeEdgeRemoved] = A(), [this.beforeClearEmitter, this.onBeforeClear] = A();
  }
  addNode(e) {
    const o = /* @__PURE__ */ new Map(), r = {
      element: e.element,
      x: e.x,
      y: e.y,
      centerFn: e.centerFn,
      priority: e.priority,
      ports: o
    };
    this.nodes.set(e.id, r), this.afterNodeAddedEmitter.emit(e.id);
  }
  getAllNodeIds() {
    return Array.from(this.nodes.keys());
  }
  getNode(e) {
    return this.nodes.get(e);
  }
  updateNode(e, o) {
    const r = this.nodes.get(e);
    r.x = o.x ?? r.x, r.y = o.y ?? r.y, r.centerFn = o.centerFn ?? r.centerFn, o.priority !== void 0 && (r.priority = o.priority, this.afterNodePriorityUpdatedEmitter.emit(e)), this.afterNodeUpdatedEmitter.emit(e);
  }
  removeNode(e) {
    this.beforeNodeRemovedEmitter.emit(e), this.nodes.delete(e);
  }
  addPort(e) {
    this.ports.set(e.id, {
      element: e.element,
      direction: e.direction,
      nodeId: e.nodeId
    }), this.cycleEdges.set(e.id, /* @__PURE__ */ new Set()), this.incommingEdges.set(e.id, /* @__PURE__ */ new Set()), this.outcommingEdges.set(e.id, /* @__PURE__ */ new Set()), this.nodes.get(e.nodeId).ports.set(e.id, e.element), this.afterPortAddedEmitter.emit(e.id);
  }
  getPort(e) {
    return this.ports.get(e);
  }
  updatePort(e, o) {
    const r = this.ports.get(e);
    r.direction = o.direction ?? r.direction, this.afterPortUpdatedEmitter.emit(e);
  }
  getAllPortIds() {
    return Array.from(this.ports.keys());
  }
  getNodePortIds(e) {
    const o = this.nodes.get(e);
    if (o !== void 0)
      return Array.from(o.ports.keys());
  }
  removePort(e) {
    const o = this.ports.get(e).nodeId;
    this.beforePortRemovedEmitter.emit(e), this.nodes.get(o).ports.delete(e), this.ports.delete(e);
  }
  addEdge(e) {
    this.addEdgeInternal(e), this.afterEdgeAddedEmitter.emit(e.id);
  }
  updateEdge(e, o) {
    if (o.from !== void 0 || o.to !== void 0) {
      const n = this.edges.get(e);
      this.removeEdgeInternal(e), this.addEdgeInternal({
        id: e,
        from: o.from ?? n.from,
        to: o.to ?? n.to,
        shape: n.shape,
        priority: n.priority
      });
    }
    const r = this.edges.get(e);
    o.shape !== void 0 && (r.shape = o.shape, this.afterEdgeShapeUpdatedEmitter.emit(e)), o.priority !== void 0 && (r.priority = o.priority, this.afterEdgePriorityUpdatedEmitter.emit(e)), this.afterEdgeUpdatedEmitter.emit(e);
  }
  getAllEdgeIds() {
    return Array.from(this.edges.keys());
  }
  getEdge(e) {
    return this.edges.get(e);
  }
  removeEdge(e) {
    this.beforeEdgeRemovedEmitter.emit(e), this.removeEdgeInternal(e);
  }
  clear() {
    this.beforeClearEmitter.emit(), this.incommingEdges.clear(), this.outcommingEdges.clear(), this.cycleEdges.clear(), this.edges.clear(), this.ports.clear(), this.nodes.clear();
  }
  getPortIncomingEdgeIds(e) {
    return Array.from(this.incommingEdges.get(e));
  }
  getPortOutcomingEdgeIds(e) {
    return Array.from(this.outcommingEdges.get(e));
  }
  getPortCycleEdgeIds(e) {
    return Array.from(this.cycleEdges.get(e));
  }
  getPortAdjacentEdgeIds(e) {
    return [
      ...this.getPortIncomingEdgeIds(e),
      ...this.getPortOutcomingEdgeIds(e),
      ...this.getPortCycleEdgeIds(e)
    ];
  }
  getNodeIncomingEdgeIds(e) {
    const o = Array.from(this.nodes.get(e).ports.keys());
    let r = [];
    return o.forEach((n) => {
      r = [...r, ...this.getPortIncomingEdgeIds(n)];
    }), r;
  }
  getNodeOutcomingEdgeIds(e) {
    const o = Array.from(this.nodes.get(e).ports.keys());
    let r = [];
    return o.forEach((n) => {
      r = [...r, ...this.getPortOutcomingEdgeIds(n)];
    }), r;
  }
  getNodeCycleEdgeIds(e) {
    const o = Array.from(this.nodes.get(e).ports.keys());
    let r = [];
    return o.forEach((n) => {
      r = [...r, ...this.getPortCycleEdgeIds(n)];
    }), r;
  }
  getNodeAdjacentEdgeIds(e) {
    return [
      ...this.getNodeIncomingEdgeIds(e),
      ...this.getNodeOutcomingEdgeIds(e),
      ...this.getNodeCycleEdgeIds(e)
    ];
  }
  addEdgeInternal(e) {
    this.edges.set(e.id, {
      from: e.from,
      to: e.to,
      shape: e.shape,
      priority: e.priority
    }), e.from !== e.to ? (this.outcommingEdges.get(e.from).add(e.id), this.incommingEdges.get(e.to).add(e.id)) : this.cycleEdges.get(e.from).add(e.id);
  }
  removeEdgeInternal(e) {
    const o = this.edges.get(e), r = o.from, n = o.to;
    this.cycleEdges.get(r).delete(e), this.cycleEdges.get(n).delete(e), this.incommingEdges.get(r).delete(e), this.incommingEdges.get(n).delete(e), this.outcommingEdges.get(r).delete(e), this.outcommingEdges.get(n).delete(e), this.edges.delete(e);
  }
}
const O = (t) => ({
  scale: 1 / t.scale,
  x: -t.x / t.scale,
  y: -t.y / t.scale
}), q = {
  scale: 1,
  x: 0,
  y: 0
};
class Be {
  constructor() {
    i(this, "viewportMatrix", q);
    i(this, "contentMatrix", q);
    i(this, "afterUpdateEmitter");
    i(this, "onAfterUpdated");
    i(this, "beforeUpdateEmitter");
    i(this, "onBeforeUpdated");
    [this.afterUpdateEmitter, this.onAfterUpdated] = A(), [this.beforeUpdateEmitter, this.onBeforeUpdated] = A();
  }
  getViewportMatrix() {
    return this.viewportMatrix;
  }
  getContentMatrix() {
    return this.contentMatrix;
  }
  patchViewportMatrix(e) {
    this.beforeUpdateEmitter.emit(), this.viewportMatrix = {
      scale: e.scale ?? this.viewportMatrix.scale,
      x: e.x ?? this.viewportMatrix.x,
      y: e.y ?? this.viewportMatrix.y
    }, this.contentMatrix = O(this.viewportMatrix), this.afterUpdateEmitter.emit();
  }
  patchContentMatrix(e) {
    this.beforeUpdateEmitter.emit(), this.contentMatrix = {
      scale: e.scale ?? this.contentMatrix.scale,
      x: e.x ?? this.contentMatrix.x,
      y: e.y ?? this.contentMatrix.y
    }, this.viewportMatrix = O(this.contentMatrix), this.afterUpdateEmitter.emit();
  }
}
class j {
  constructor(e) {
    i(this, "elementToNodeId", /* @__PURE__ */ new Map());
    i(this, "nodesResizeObserver");
    i(this, "onAfterNodeAdded", (e) => {
      const o = this.canvas.graph.getNode(e);
      this.elementToNodeId.set(o.element, e), this.nodesResizeObserver.observe(o.element);
    });
    i(this, "onBeforeNodeRemoved", (e) => {
      const o = this.canvas.graph.getNode(e);
      this.elementToNodeId.delete(o.element), this.nodesResizeObserver.unobserve(o.element);
    });
    i(this, "onBeforeClear", () => {
      this.nodesResizeObserver.disconnect(), this.elementToNodeId.clear();
    });
    this.canvas = e, this.nodesResizeObserver = new ResizeObserver((o) => {
      o.forEach((r) => {
        const n = r.target;
        this.handleNodeResize(n);
      });
    }), this.canvas.graph.onAfterNodeAdded.subscribe(this.onAfterNodeAdded), this.canvas.graph.onBeforeNodeRemoved.subscribe(this.onBeforeNodeRemoved), this.canvas.graph.onBeforeClear.subscribe(this.onBeforeClear);
  }
  static configure(e) {
    new j(e);
  }
  handleNodeResize(e) {
    const o = this.elementToNodeId.get(e);
    this.canvas.updateNode(o), this.canvas.graph.getNodeAdjacentEdgeIds(o).forEach((n) => {
      this.canvas.updateEdge(n);
    });
  }
}
class ze {
  constructor() {
    i(this, "element", null);
    i(this, "canvasDefaults", {});
    i(this, "dragOptions");
    i(this, "transformOptions");
    i(this, "virtualScrollOptions");
    i(this, "hasDraggableNode", !1);
    i(this, "hasTransformableViewport", !1);
    i(this, "hasResizeReactiveNodes", !1);
    i(this, "boxRenderingTrigger");
  }
  attach(e) {
    return this.element = e, this;
  }
  /**
   * specifies default values for graph entities
   */
  setDefaults(e) {
    return this.canvasDefaults = e, this;
  }
  /**
   * @deprecated
   * use setDefaults instead
   */
  setOptions(e) {
    return this.setDefaults(e), this;
  }
  /**
   * enables nodes draggable by user
   */
  enableUserDraggableNodes(e) {
    return this.hasDraggableNode = !0, this.dragOptions = e, this;
  }
  /**
   * enables viewport transformable by user
   */
  enableUserTransformableViewport(e) {
    return this.hasTransformableViewport = !0, this.transformOptions = e, this;
  }
  /**
   * enables automatic edges update on node resize
   */
  enableResizeReactiveNodes() {
    return this.hasResizeReactiveNodes = !0, this;
  }
  /**
   * sets emitter for rendering graph inside bounded area
   */
  enableBoxAreaRendering(e) {
    return this.boxRenderingTrigger = e, this;
  }
  enableVirtualScroll(e) {
    return this.virtualScrollOptions = e, this;
  }
  /**
   * builds final canvas
   */
  build() {
    if (this.element === null)
      throw new E(
        "unable to build canvas when no attach element specified"
      );
    let e = this.boxRenderingTrigger;
    this.virtualScrollOptions !== void 0 && e === void 0 && (e = new te());
    const o = new Fe(), r = new Be();
    let n = new Ae(o, r);
    e !== void 0 && (n = new pe(n, o, e));
    let h = new ne(
      o,
      r,
      n
    );
    this.hasDraggableNode && (h = new de(
      h,
      this.dragOptions
    )), this.virtualScrollOptions !== void 0 ? h = new fe(
      h,
      e,
      this.transformOptions,
      this.virtualScrollOptions
    ) : this.hasTransformableViewport && (h = new ee(
      h,
      this.transformOptions
    ));
    const s = new We(this.element, h, this.canvasDefaults);
    return this.hasResizeReactiveNodes && j.configure(s), this.reset(), s;
  }
  reset() {
    this.element = null, this.canvasDefaults = {}, this.dragOptions = void 0, this.transformOptions = void 0, this.virtualScrollOptions = void 0, this.hasDraggableNode = !1, this.hasTransformableViewport = !1, this.hasResizeReactiveNodes = !1, this.boxRenderingTrigger = void 0;
  }
}
export {
  De as BezierEdgeShape,
  ze as CanvasBuilder,
  te as EventSubject,
  Ce as HorizontalEdgeShape,
  E as HtmlGraphError,
  Ue as StraightEdgeShape,
  $e as VerticalEdgeShape
};
