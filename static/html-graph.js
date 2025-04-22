var oe = Object.defineProperty;
var re = (t, e, o) => e in t ? oe(t, e, { enumerable: !0, configurable: !0, writable: !0, value: o }) : t[e] = o;
var i = (t, e, o) => re(t, typeof e != "symbol" ? e + "" : e, o);
class ie {
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
  const { x: r, y: s, width: d, height: n } = t.getBoundingClientRect();
  return e >= r && e <= r + d && o >= s && o <= s + n;
}, $ = (t, e, o) => e >= 0 && e <= t.innerWidth && o >= 0 && o <= t.innerHeight, R = (t, e) => {
  e !== null ? t.style.cursor = e : t.style.removeProperty("cursor");
}, he = (t) => {
  var g, f, x, y, p, S;
  const e = ((g = t == null ? void 0 : t.events) == null ? void 0 : g.onNodeDrag) ?? (() => {
  }), o = ((f = t == null ? void 0 : t.events) == null ? void 0 : f.onBeforeNodeDrag) ?? (() => !0), r = ((x = t == null ? void 0 : t.events) == null ? void 0 : x.onNodeDragFinished) ?? (() => {
  }), s = (t == null ? void 0 : t.moveOnTop) === !1, d = (y = t == null ? void 0 : t.mouse) == null ? void 0 : y.dragCursor, n = d !== void 0 ? d : "grab", h = (p = t == null ? void 0 : t.mouse) == null ? void 0 : p.mouseDownEventVerifier, c = h !== void 0 ? h : (N) => N.button === 0, a = (S = t == null ? void 0 : t.mouse) == null ? void 0 : S.mouseUpEventVerifier;
  return {
    freezePriority: s,
    dragCursor: n,
    mouseDownEventVerifier: c,
    mouseUpEventVerifier: a !== void 0 ? a : (N) => N.button === 0,
    onNodeDrag: e,
    onBeforeNodeDrag: o,
    onNodeDragFinished: r
  };
};
class de {
  constructor(e, o, r) {
    i(this, "graph");
    i(this, "viewport");
    i(this, "maxNodePriority", 0);
    i(this, "nodes", /* @__PURE__ */ new Map());
    i(this, "grabbedNodeId", null);
    i(this, "onWindowMouseMove", (e) => {
      if (!U(this.element, e.clientX, e.clientY) || !$(this.window, e.clientX, e.clientY)) {
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
      if (!U(this.element, o.clientX, o.clientY) || !$(this.window, o.clientX, o.clientY)) {
        this.cancelTouchDrag();
        return;
      }
      if (this.grabbedNodeId !== null && this.previousTouchCoords !== null) {
        const r = o.clientX - this.previousTouchCoords.x, s = o.clientY - this.previousTouchCoords.y;
        this.dragNode(this.grabbedNodeId, r, s), this.previousTouchCoords = {
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
    this.canvas = e, this.element = o, this.viewport = this.canvas.viewport, this.graph = this.canvas.graph, this.options = he(r ?? {});
  }
  addNode(e) {
    this.canvas.addNode(e), this.updateMaxNodePriority(e.id);
    const o = (s) => {
      if (!this.options.mouseDownEventVerifier(s))
        return;
      const d = this.graph.getNode(e.id);
      this.options.onBeforeNodeDrag({
        nodeId: e.id,
        element: e.element,
        x: d.x,
        y: d.y
      }) && (s.stopImmediatePropagation(), this.grabbedNodeId = e.id, R(this.element, this.options.dragCursor), this.moveNodeOnTop(e.id), this.window.addEventListener("mouseup", this.onWindowMouseUp), this.window.addEventListener("mousemove", this.onWindowMouseMove));
    }, r = (s) => {
      if (s.touches.length !== 1)
        return;
      s.stopImmediatePropagation(), this.previousTouchCoords = {
        x: s.touches[0].clientX,
        y: s.touches[0].clientY
      };
      const d = this.graph.getNode(e.id);
      this.options.onBeforeNodeDrag({
        nodeId: e.id,
        element: e.element,
        x: d.x,
        y: d.y
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
    this.clear(), this.removeMouseDragListeners(), this.removeTouchDragListeners(), this.canvas.destroy();
  }
  dragNode(e, o, r) {
    const s = this.graph.getNode(e);
    if (s === null)
      return;
    const d = this.canvas.viewport.getContentMatrix(), n = d.scale * s.x + d.x, h = d.scale * s.y + d.y, c = n + o, a = h + r, l = this.canvas.viewport.getViewportMatrix(), g = l.scale * c + l.x, f = l.scale * a + l.y;
    this.canvas.updateNode(e, { x: g, y: f }), this.options.onNodeDrag({
      nodeId: e,
      element: s.element,
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
    this.graph.getNodeAdjacentEdgeIds(e).forEach((s) => {
      this.updateEdge(s, { priority: o });
    });
  }
  cancelMouseDrag() {
    const e = this.graph.getNode(this.grabbedNodeId);
    e !== null && this.options.onNodeDragFinished({
      nodeId: this.grabbedNodeId,
      element: e.element,
      x: e.x,
      y: e.y
    }), this.grabbedNodeId = null, R(this.element, null), this.removeMouseDragListeners();
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
  const e = t.minX !== null ? t.minX : -1 / 0, o = t.maxX !== null ? t.maxX : 1 / 0, r = t.minY !== null ? t.minY : -1 / 0, s = t.maxY !== null ? t.maxY : 1 / 0;
  return (d) => {
    let n = d.nextTransform.x, h = d.nextTransform.y;
    n < e && n < d.prevTransform.x && (n = Math.min(d.prevTransform.x, e));
    const c = d.canvasWidth * d.prevTransform.scale, a = o - c;
    n > a && n > d.prevTransform.x && (n = Math.max(d.prevTransform.x, a)), h < r && h < d.prevTransform.y && (h = Math.min(d.prevTransform.y, r));
    const l = d.canvasHeight * d.prevTransform.scale, g = s - l;
    return h > g && h > d.prevTransform.y && (h = Math.max(d.prevTransform.y, g)), { scale: d.nextTransform.scale, x: n, y: h };
  };
}, ae = (t) => {
  const e = t.maxContentScale, o = t.minContentScale, r = e !== null ? 1 / e : 0, s = o !== null ? 1 / o : 1 / 0;
  return (d) => {
    const n = d.prevTransform, h = d.nextTransform;
    let c = h.scale, a = h.x, l = h.y;
    if (h.scale > s && h.scale > n.scale) {
      c = Math.max(n.scale, s), a = n.x, l = n.y;
      const g = (c - n.scale) / (h.scale - n.scale);
      a = n.x + (h.x - n.x) * g, l = n.y + (h.y - n.y) * g;
    }
    if (h.scale < r && h.scale < n.scale) {
      c = Math.min(n.scale, r), a = n.x, l = n.y;
      const g = (c - n.scale) / (h.scale - n.scale);
      a = n.x + (h.x - n.x) * g, l = n.y + (h.y - n.y) * g;
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
  var y, p, S, N, z, M, V, L, G, _, J, K;
  const e = (y = t == null ? void 0 : t.scale) == null ? void 0 : y.mouseWheelSensitivity, o = e !== void 0 ? e : 1.2, r = t == null ? void 0 : t.transformPreprocessor;
  let s;
  r !== void 0 ? Array.isArray(r) ? s = le(
    r.map(
      (P) => Q(P)
    )
  ) : s = Q(r) : s = (P) => P.nextTransform;
  const d = ((p = t == null ? void 0 : t.shift) == null ? void 0 : p.cursor) !== void 0 ? t.shift.cursor : "grab", n = ((S = t == null ? void 0 : t.events) == null ? void 0 : S.onBeforeTransformChange) ?? (() => {
  }), h = ((N = t == null ? void 0 : t.events) == null ? void 0 : N.onTransformChange) ?? (() => {
  }), c = (z = t == null ? void 0 : t.shift) == null ? void 0 : z.mouseDownEventVerifier, a = c !== void 0 ? c : (P) => P.button === 0, l = (M = t == null ? void 0 : t.shift) == null ? void 0 : M.mouseUpEventVerifier, g = l !== void 0 ? l : (P) => P.button === 0, f = (V = t == null ? void 0 : t.scale) == null ? void 0 : V.mouseWheelEventVerifier, x = f !== void 0 ? f : () => !0;
  return {
    wheelSensitivity: o,
    onTransformStarted: ((L = t == null ? void 0 : t.events) == null ? void 0 : L.onTransformStarted) ?? (() => {
    }),
    onTransformFinished: ((G = t == null ? void 0 : t.events) == null ? void 0 : G.onTransformFinished) ?? (() => {
    }),
    onBeforeTransformChange: n,
    onTransformChange: h,
    transformPreprocessor: s,
    shiftCursor: d,
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
  for (let h = 0; h < o; h++)
    e.push([t.touches[h].clientX, t.touches[h].clientY]);
  const r = e.reduce(
    (h, c) => [h[0] + c[0], h[1] + c[1]],
    [0, 0]
  ), s = [r[0] / o, r[1] / o], n = e.map((h) => [h[0] - s[0], h[1] - s[1]]).reduce(
    (h, c) => h + Math.sqrt(c[0] * c[0] + c[1] * c[1]),
    0
  );
  return {
    x: s[0],
    y: s[1],
    scale: n / o,
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
  constructor(e, o, r) {
    i(this, "graph");
    i(this, "viewport");
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
      this.moveViewport(o, r);
    });
    i(this, "onWindowMouseUp", (e) => {
      this.element === null || !this.options.mouseUpEventVerifier(e) || this.stopMouseDrag();
    });
    i(this, "onWheelScroll", (e) => {
      if (!this.options.mouseWheelEventVerifier(e))
        return;
      e.preventDefault();
      const { left: o, top: r } = this.element.getBoundingClientRect(), s = e.clientX - o, d = e.clientY - r, h = 1 / (e.deltaY < 0 ? this.options.wheelSensitivity : 1 / this.options.wheelSensitivity);
      this.wheelFinishTimer === null && this.options.onTransformStarted(), this.scaleViewport(h, s, d), this.wheelFinishTimer !== null && clearTimeout(this.wheelFinishTimer), this.wheelFinishTimer = setTimeout(() => {
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
      const o = C(e);
      if (!o.touches.every(
        (s) => U(this.element, s[0], s[1]) && $(this.window, s[0], s[1])
      )) {
        this.stopTouchDrag();
        return;
      }
      if ((o.touchesCnt === 1 || o.touchesCnt === 2) && this.moveViewport(
        -(o.x - this.prevTouches.x),
        -(o.y - this.prevTouches.y)
      ), o.touchesCnt === 2) {
        const { left: s, top: d } = this.element.getBoundingClientRect(), n = this.prevTouches.x - s, h = this.prevTouches.y - d, a = 1 / (o.scale / this.prevTouches.scale);
        this.scaleViewport(a, n, h);
      }
      this.prevTouches = o;
    });
    i(this, "onWindowTouchFinish", (e) => {
      e.touches.length > 0 ? this.prevTouches = C(e) : this.stopTouchDrag();
    });
    i(this, "observer", new ResizeObserver(() => {
      const e = this.canvas.viewport.getViewportMatrix(), { width: o, height: r } = this.element.getBoundingClientRect(), s = this.options.transformPreprocessor({
        prevTransform: e,
        nextTransform: e,
        canvasWidth: o,
        canvasHeight: r
      });
      this.options.onResizeTransformStarted(), this.canvas.patchViewportMatrix(s), this.options.onResizeTransformFinished();
    }));
    i(this, "options");
    this.canvas = e, this.element = o, this.options = ge(r), this.viewport = this.canvas.viewport, this.graph = this.canvas.graph, this.observer.observe(this.element), this.element.addEventListener("mousedown", this.onMouseDown), this.element.addEventListener("wheel", this.onWheelScroll), this.element.addEventListener("touchstart", this.onTouchStart);
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
    this.removeMouseDragListeners(), this.removeTouchDragListeners(), this.observer.unobserve(this.element), this.element.removeEventListener("mousedown", this.onMouseDown), this.element.removeEventListener("wheel", this.onWheelScroll), this.element.removeEventListener("touchstart", this.onTouchStart), this.canvas.destroy();
  }
  moveViewport(e, o) {
    const r = this.viewport.getViewportMatrix(), s = ue(r, e, o), { width: d, height: n } = this.element.getBoundingClientRect(), h = this.options.transformPreprocessor({
      prevTransform: r,
      nextTransform: s,
      canvasWidth: d,
      canvasHeight: n
    });
    this.performTransform(h);
  }
  scaleViewport(e, o, r) {
    const s = this.canvas.viewport.getViewportMatrix(), d = we(s, e, o, r), { width: n, height: h } = this.element.getBoundingClientRect(), c = this.options.transformPreprocessor({
      prevTransform: s,
      nextTransform: d,
      canvasWidth: n,
      canvasHeight: h
    });
    this.performTransform(c);
  }
  stopMouseDrag() {
    R(this.element, null), this.removeMouseDragListeners(), this.options.onTransformFinished();
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
  constructor(e, o, r, s, d) {
    i(this, "graph");
    i(this, "viewport");
    i(this, "canvas");
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
    var a, l;
    this.trigger = o, this.virtualScrollOptions = s, this.element = d, this.nodeHorizontal = this.virtualScrollOptions.nodeContainingRadius.horizontal, this.nodeVertical = this.virtualScrollOptions.nodeContainingRadius.vertical, this.canvasResizeObserver = new this.window.ResizeObserver((g) => {
      const f = g[0];
      this.viewportWidth = f.contentRect.width, this.viewportHeight = f.contentRect.height, this.scheduleLoadAreaAroundViewport();
    });
    const n = ((a = r == null ? void 0 : r.events) == null ? void 0 : a.onTransformFinished) ?? (() => {
    }), h = ((l = r == null ? void 0 : r.events) == null ? void 0 : l.onTransformChange) ?? (() => {
    }), c = {
      ...r,
      events: {
        ...r == null ? void 0 : r.events,
        onTransformChange: () => {
          const g = this.viewportMatrix;
          this.viewportMatrix = this.canvas.viewport.getViewportMatrix(), g.scale !== this.viewportMatrix.scale && this.scheduleEnsureViewportAreaLoaded(), h();
        },
        onTransformFinished: () => {
          this.scheduleLoadAreaAroundViewport(), n();
        }
      }
    };
    this.canvas = new ee(
      e,
      this.element,
      c
    ), this.viewportMatrix = this.canvas.viewport.getViewportMatrix(), this.viewport = this.canvas.viewport, this.graph = this.canvas.graph, this.trigger.subscribe(this.updateLoadedArea), this.canvasResizeObserver.observe(this.element);
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
    this.trigger.unsubscribe(this.updateLoadedArea), this.canvasResizeObserver.unobserve(this.element), this.canvas.destroy();
  }
  scheduleLoadAreaAroundViewport() {
    setTimeout(() => {
      this.loadAreaAroundViewport();
    });
  }
  scheduleEnsureViewportAreaLoaded() {
    const e = this.viewportWidth * this.viewportMatrix.scale, o = this.viewportHeight * this.viewportMatrix.scale, r = this.viewportMatrix.x - this.nodeHorizontal, s = this.viewportMatrix.y - this.nodeVertical, d = this.viewportMatrix.x + e + this.nodeHorizontal, n = this.viewportMatrix.y + o + this.nodeVertical;
    this.loadedArea.xFrom < r && this.loadedArea.xTo > d && this.loadedArea.yFrom < s && this.loadedArea.yTo > n || this.scheduleLoadAreaAroundViewport();
  }
  loadAreaAroundViewport() {
    const e = this.viewportWidth * this.viewportMatrix.scale, o = this.viewportHeight * this.viewportMatrix.scale, r = this.viewportMatrix.x - e - this.nodeHorizontal, s = this.viewportMatrix.y - o - this.nodeVertical, d = 3 * e + 2 * this.nodeHorizontal, n = 3 * o + 2 * this.nodeVertical;
    this.trigger.emit({ x: r, y: s, width: d, height: n });
  }
}
const ye = () => {
  const t = document.createElement("div");
  return t.style.width = "100%", t.style.height = "100%", t.style.position = "relative", t.style.overflow = "hidden", t;
}, ve = () => {
  const t = document.createElement("div");
  return t.style.position = "absolute", t.style.top = "0", t.style.left = "0", t.style.width = "0", t.style.height = "0", t;
}, xe = () => {
  const t = document.createElement("div");
  return t.style.position = "absolute", t.style.top = "0", t.style.left = "0", t.style.visibility = "hidden", t;
};
class Ee {
  constructor(e, o, r) {
    i(this, "host", ye());
    i(this, "container", ve());
    i(this, "nodeIdToWrapperElementMap", /* @__PURE__ */ new Map());
    i(this, "edgeIdToElementMap", /* @__PURE__ */ new Map());
    i(this, "applyTransform", () => {
      const e = this.viewportStore.getContentMatrix();
      this.container.style.transform = `matrix(${e.scale}, 0, 0, ${e.scale}, ${e.x}, ${e.y})`;
    });
    this.graphStore = e, this.viewportStore = o, this.element = r, this.element.appendChild(this.host), this.host.appendChild(this.container), this.viewportStore.onAfterUpdated.subscribe(this.applyTransform);
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
    this.viewportStore.onAfterUpdated.unsubscribe(this.applyTransform), this.clear(), this.element.removeChild(this.host), this.host.removeChild(this.container);
  }
  updateNodePosition(e) {
    const o = this.nodeIdToWrapperElementMap.get(e), r = this.graphStore.getNode(e), { width: s, height: d } = r.element.getBoundingClientRect(), n = this.viewportStore.getViewportMatrix().scale, h = r.centerFn(s, d), c = r.x - n * h.x, a = r.y - n * h.y;
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
    const o = this.graphStore.getEdge(e), r = this.graphStore.getPort(o.from), s = this.graphStore.getPort(o.to), d = r.element.getBoundingClientRect(), n = s.element.getBoundingClientRect(), h = this.host.getBoundingClientRect(), c = this.viewportStore.getViewportMatrix(), a = {
      x: c.scale * (d.left - h.left) + c.x,
      y: c.scale * (d.top - h.top) + c.y
    }, l = {
      x: c.scale * (n.left - h.left) + c.x,
      y: c.scale * (n.top - h.top) + c.y
    }, g = {
      x: a.x,
      y: a.y,
      width: d.width * c.scale,
      height: d.height * c.scale,
      direction: r.direction,
      portId: o.from,
      nodeId: r.nodeId
    }, f = {
      x: l.x,
      y: l.y,
      width: n.width * c.scale,
      height: n.height * c.scale,
      direction: s.direction,
      portId: o.to,
      nodeId: s.nodeId
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
class Ae {
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
    const o = this.graphStore.getEdge(e), r = this.graphStore.getPort(o.from).nodeId, s = this.graphStore.getPort(o.to).nodeId, d = this.graphStore.getNode(r), n = this.graphStore.getNode(s), h = Math.min(d.x, n.x), c = Math.max(d.x, n.x), a = Math.min(d.y, n.y), l = Math.max(d.y, n.y);
    return h <= this.xTo && c >= this.xFrom && a <= this.yTo && l >= this.yFrom;
  }
}
class Se {
  constructor(e, o, r) {
    i(this, "attachedNodes", /* @__PURE__ */ new Set());
    i(this, "attachedEdges", /* @__PURE__ */ new Set());
    i(this, "renderingBox");
    i(this, "updateViewport", (e) => {
      this.renderingBox.setRenderingBox(e);
      const o = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Set();
      this.graphStore.getAllNodeIds().forEach((n) => {
        const h = this.renderingBox.hasNode(n), c = this.attachedNodes.has(n);
        h && !c ? o.add(n) : !h && c && r.add(n);
      }), this.graphStore.getAllEdgeIds().forEach((n) => {
        const h = this.renderingBox.hasEdge(n), c = this.attachedEdges.has(n), a = this.graphStore.getEdge(n), l = this.graphStore.getPort(a.from).nodeId, g = this.graphStore.getPort(a.to).nodeId;
        h && (this.renderingBox.hasNode(l) || (o.add(l), r.delete(l)), this.renderingBox.hasNode(g) || (o.add(g), r.delete(g))), h && !c ? s.add(n) : !h && c && d.add(n);
      }), d.forEach((n) => {
        this.handleDetachEdge(n);
      }), r.forEach((n) => {
        this.handleDetachNode(n);
      }), o.forEach((n) => {
        this.attachedNodes.has(n) || this.handleAttachNode(n);
      }), s.forEach((n) => {
        this.handleAttachEdge(n);
      });
    });
    this.htmlView = e, this.graphStore = o, this.trigger = r, this.renderingBox = new Ae(this.graphStore), this.trigger.subscribe(this.updateViewport);
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
    const o = this.graphStore.getEdge(e), r = this.graphStore.getPort(o.from).nodeId, s = this.graphStore.getPort(o.to).nodeId;
    this.attachedNodes.has(r) || this.handleAttachNode(r), this.attachedNodes.has(s) || this.handleAttachNode(s), this.handleAttachEdge(e);
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
const E = () => {
  const t = new te();
  return [t, t];
};
class Y {
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
class A extends Error {
  constructor() {
    super(...arguments);
    i(this, "name", "HtmlGraphError");
  }
}
const pe = (t, e) => ({
  x: t / 2,
  y: e / 2
}), k = (t) => () => t, Z = k(0), Ne = () => {
  let t = 0;
  return () => t++;
}, Te = (t, e) => {
  let o = Z, r = Z;
  const s = Ne();
  return t === "incremental" && (o = s), e === "incremental" && (r = s), typeof t == "number" && (o = k(t)), typeof e == "number" && (r = k(e)), typeof t == "function" && (o = t), typeof e == "function" && (r = e), {
    nodesPriorityFn: o,
    edgesPriorityFn: r
  };
}, v = (t, e, o) => ({
  x: e.x * t.x - e.y * t.y + ((1 - e.x) * o.x + e.y * o.y),
  y: e.y * t.x + e.x * t.y + ((1 - e.x) * o.y - e.y * o.x)
}), T = (t, e, o) => ({ x: e * Math.cos(t), y: o * Math.sin(t) }), w = {
  x: 0,
  y: 0
}, m = (t, e, o, r) => {
  const d = [
    w,
    { x: o, y: r },
    { x: o, y: -r }
  ].map((a) => v(a, t, w)).map((a) => ({ x: a.x + e.x, y: a.y + e.y })), n = `M ${d[0].x} ${d[0].y}`, h = `L ${d[1].x} ${d[1].y}`, c = `L ${d[2].x} ${d[2].y}`;
  return `${n} ${h} ${c}`;
}, D = (t, e) => {
  const o = [];
  if (t.length > 0 && o.push(`M ${t[0].x} ${t[0].y}`), t.length === 2 && o.push(`L ${t[1].x} ${t[1].y}`), t.length > 2) {
    const r = t.length - 1;
    let s = 0, d = 0, n = 0;
    t.forEach((h, c) => {
      let a = 0, l = 0, g = 0;
      const f = c > 0, x = c < r, y = f && x;
      if (f && (a = -s, l = -d, g = n), x) {
        const L = t[c + 1];
        s = L.x - h.x, d = L.y - h.y, n = Math.sqrt(s * s + d * d);
      }
      const S = n !== 0 ? Math.min((y ? e : 0) / n, c < r - 1 ? 0.5 : 1) : 0, N = y ? { x: h.x + s * S, y: h.y + d * S } : h, M = g !== 0 ? Math.min((y ? e : 0) / g, c > 1 ? 0.5 : 1) : 0, V = y ? { x: h.x + a * M, y: h.y + l * M } : h;
      c > 0 && o.push(`L ${V.x} ${V.y}`), y && o.push(
        `C ${h.x} ${h.y} ${h.x} ${h.y} ${N.x} ${N.y}`
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
}, b = (t) => {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("fill", t), e;
}, B = (t, e) => {
  const o = {
    x: t.x + t.width / 2,
    y: t.y + t.height / 2
  }, r = {
    x: e.x + e.width / 2,
    y: e.y + e.height / 2
  }, s = Math.min(o.x, r.x), d = Math.min(o.y, r.y), n = Math.abs(r.x - o.x), h = Math.abs(r.y - o.y), c = o.x <= r.x ? 1 : -1, a = o.y <= r.y ? 1 : -1;
  return {
    x: s,
    y: d,
    width: n,
    height: h,
    flipX: c,
    flipY: a
  };
}, me = (t) => {
  const e = v(
    { x: t.arrowLength, y: w.y },
    t.fromVect,
    w
  ), o = v(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVect,
    t.to
  ), r = {
    x: e.x + t.fromVect.x * t.curvature,
    y: e.y + t.fromVect.y * t.curvature
  }, s = {
    x: o.x - t.toVect.x * t.curvature,
    y: o.y - t.toVect.y * t.curvature
  }, d = `M ${e.x} ${e.y} C ${r.x} ${r.y}, ${s.x} ${s.y}, ${o.x} ${o.y}`, n = t.hasSourceArrow ? "" : `M ${w.x} ${w.y} L ${e.x} ${e.y} `, h = t.hasTargetArrow ? "" : ` M ${o.x} ${o.y} L ${t.to.x} ${t.to.y}`;
  return `${n}${d}${h}`;
}, be = (t) => {
  const e = t.hasSourceArrow ? v(
    { x: t.arrowLength, y: w.y },
    t.fromVect,
    w
  ) : w, o = t.hasTargetArrow ? v(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVect,
    t.to
  ) : t.to, r = t.arrowLength, s = Math.cos(t.detourDirection) * t.detourDistance, d = Math.sin(t.detourDirection) * t.detourDistance, n = s * t.flipX, h = d * t.flipY, c = v(
    { x: r, y: w.y },
    t.fromVect,
    w
  ), a = {
    x: c.x + n,
    y: c.y + h
  }, l = v(
    { x: t.to.x - r, y: t.to.y },
    t.toVect,
    t.to
  ), g = {
    x: l.x + n,
    y: l.y + h
  }, f = { x: (a.x + g.x) / 2, y: (a.y + g.y) / 2 }, x = {
    x: c.x + t.curvature * t.fromVect.x,
    y: c.y + t.curvature * t.fromVect.y
  }, y = {
    x: l.x - t.curvature * t.toVect.x,
    y: l.y - t.curvature * t.toVect.y
  }, p = {
    x: c.x + n,
    y: c.y + h
  }, S = {
    x: l.x + n,
    y: l.y + h
  };
  return [
    `M ${e.x} ${e.y}`,
    `L ${c.x} ${c.y}`,
    `C ${x.x} ${x.y} ${p.x} ${p.y} ${f.x} ${f.y}`,
    `C ${S.x} ${S.y} ${y.x} ${y.y} ${l.x} ${l.y}`,
    `L ${o.x} ${o.y}`
  ].join(" ");
}, Pe = (t) => {
  const e = t.hasSourceArrow ? v(
    { x: t.arrowLength, y: w.y },
    t.fromVect,
    w
  ) : w, o = t.hasTargetArrow ? v(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVect,
    t.to
  ) : t.to, r = t.arrowLength + t.arrowOffset, s = r - t.roundness, d = v({ x: s, y: w.y }, t.fromVect, w), n = v(
    { x: t.to.x - s, y: t.to.y },
    t.toVect,
    t.to
  ), h = Math.max((d.x + n.x) / 2, r), c = t.to.y / 2, a = { x: t.flipX > 0 ? h : -r, y: d.y }, l = { x: a.x, y: c }, g = {
    x: t.flipX > 0 ? t.to.x - h : t.to.x + r,
    y: n.y
  }, f = { x: g.x, y: c };
  return D(
    [e, d, a, l, f, g, n, o],
    t.roundness
  );
}, X = (t) => {
  const e = t.hasSourceArrow ? v(
    { x: t.arrowLength, y: w.y },
    t.fromVect,
    w
  ) : w, o = t.hasTargetArrow ? v(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVect,
    t.to
  ) : t.to, r = t.arrowLength + t.arrowOffset, s = v(
    { x: r, y: w.y },
    t.fromVect,
    w
  ), d = Math.cos(t.detourDirection) * t.detourDistance, n = Math.sin(t.detourDirection) * t.detourDistance, h = d * t.flipX, c = n * t.flipY, a = { x: s.x + h, y: s.y + c }, l = v(
    { x: t.to.x - r, y: t.to.y },
    t.toVect,
    t.to
  ), g = { x: l.x + h, y: l.y + c };
  return D(
    [e, s, a, g, l, o],
    t.roundness
  );
}, Me = (t) => {
  const e = t.hasSourceArrow ? v(
    { x: t.arrowLength, y: w.y },
    t.fromVect,
    w
  ) : w, o = t.hasTargetArrow ? v(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVect,
    t.to
  ) : t.to, r = t.arrowLength + t.arrowOffset, s = v({ x: r, y: w.y }, t.fromVect, w), d = v(
    { x: t.to.x - r, y: t.to.y },
    t.toVect,
    t.to
  );
  return D([e, s, d, o], t.roundness);
}, Ve = (t) => {
  const e = t.hasSourceArrow ? v(
    { x: t.arrowLength, y: w.y },
    t.fromVect,
    w
  ) : w, o = t.hasTargetArrow ? v(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVect,
    t.to
  ) : t.to, r = t.arrowLength + t.arrowOffset, s = r - t.roundness, d = v({ x: s, y: w.y }, t.fromVect, w), n = v(
    { x: t.to.x - s, y: t.to.y },
    t.toVect,
    t.to
  ), h = Math.max((d.y + n.y) / 2, r), c = t.to.x / 2, a = { x: d.x, y: t.flipY > 0 ? h : -r }, l = { x: c, y: a.y }, g = {
    x: n.x,
    y: t.flipY > 0 ? t.to.y - h : t.to.y + r
  }, f = { x: c, y: g.y };
  return D(
    [e, d, a, l, f, g, n, o],
    t.roundness
  );
}, H = (t) => {
  const e = t.arrowOffset, o = t.side, r = t.arrowLength + e, s = r + 2 * o, n = [
    { x: t.arrowLength, y: w.y },
    { x: r, y: w.y },
    { x: r, y: t.side },
    { x: s, y: t.side },
    { x: s, y: -t.side },
    { x: r, y: -t.side },
    { x: r, y: w.y },
    { x: t.arrowLength, y: w.y }
  ].map(
    (c) => v(c, t.fromVect, w)
  ), h = `M ${w.x} ${w.y} L ${n[0].x} ${n[0].y} `;
  return `${t.hasSourceArrow || t.hasTargetArrow ? "" : h}${D(n, t.roundness)}`;
}, Le = (t) => {
  const e = t.smallRadius, o = t.radius, r = Math.sqrt(e * e + o * o), s = e + o, d = t.arrowLength + r * (1 - o / s), n = e * o / s, c = [
    { x: t.arrowLength, y: w.y },
    { x: d, y: n },
    { x: d, y: -n }
  ].map((g) => v(g, t.fromVect, w)), a = [
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
    this.svg.appendChild(this.group), this.line = F(o, r), this.group.appendChild(this.line), this.hasSourceArrow && (this.sourceArrow = b(o), this.group.appendChild(this.sourceArrow)), this.hasTargetArrow && (this.targetArrow = b(o), this.group.appendChild(this.targetArrow));
  }
  render(e) {
    const { x: o, y: r, width: s, height: d, flipX: n, flipY: h } = B(
      e.from,
      e.to
    );
    this.svg.style.transform = `translate(${o}px, ${r}px)`, this.svg.style.width = `${s}px`, this.svg.style.height = `${d}px`, this.group.style.transform = `scale(${n}, ${h})`;
    const c = T(
      e.from.direction,
      n,
      h
    ), a = T(e.to.direction, n, h), l = {
      x: s,
      y: d
    };
    let g, f = a, x = -this.arrowLength;
    if (e.from.portId === e.to.portId ? (g = Le({
      fromVect: c,
      radius: this.portCycleRadius,
      smallRadius: this.portCycleSmallRadius,
      arrowLength: this.arrowLength,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), f = c, x = this.arrowLength) : e.from.nodeId === e.to.nodeId ? g = be({
      to: l,
      fromVect: c,
      toVect: a,
      flipX: n,
      flipY: h,
      arrowLength: this.arrowLength,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      curvature: this.curvature,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }) : g = me({
      to: l,
      fromVect: c,
      toVect: a,
      arrowLength: this.arrowLength,
      curvature: this.curvature,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), this.line.setAttribute("d", g), this.sourceArrow) {
      const y = m(
        c,
        w,
        this.arrowLength,
        this.arrowWidth
      );
      this.sourceArrow.setAttribute("d", y);
    }
    if (this.targetArrow) {
      const y = m(
        f,
        l,
        x,
        this.arrowWidth
      );
      this.targetArrow.setAttribute("d", y);
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
    const r = (e == null ? void 0 : e.color) ?? u.color, s = (e == null ? void 0 : e.width) ?? u.width;
    this.svg.appendChild(this.group), this.line = F(r, s), this.group.appendChild(this.line), this.hasSourceArrow && (this.sourceArrow = b(r), this.group.appendChild(this.sourceArrow)), this.hasTargetArrow && (this.targetArrow = b(r), this.group.appendChild(this.targetArrow));
  }
  render(e) {
    const { x: o, y: r, width: s, height: d, flipX: n, flipY: h } = B(
      e.from,
      e.to
    );
    this.svg.style.transform = `translate(${o}px, ${r}px)`, this.svg.style.width = `${s}px`, this.svg.style.height = `${d}px`, this.group.style.transform = `scale(${n}, ${h})`;
    const c = T(
      e.from.direction,
      n,
      h
    ), a = T(e.to.direction, n, h), l = {
      x: s,
      y: d
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
      flipX: n,
      flipY: h,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }) : g = Pe({
      to: l,
      fromVect: c,
      toVect: a,
      flipX: n,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), this.line.setAttribute("d", g), this.sourceArrow) {
      const y = m(
        c,
        w,
        this.arrowLength,
        this.arrowWidth
      );
      this.sourceArrow.setAttribute("d", y);
    }
    if (this.targetArrow) {
      const y = m(
        f,
        l,
        x,
        this.arrowWidth
      );
      this.targetArrow.setAttribute("d", y);
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
    const r = (e == null ? void 0 : e.color) ?? u.color, s = (e == null ? void 0 : e.width) ?? u.width;
    this.svg.appendChild(this.group), this.line = F(r, s), this.group.appendChild(this.line), this.hasSourceArrow && (this.sourceArrow = b(r), this.group.appendChild(this.sourceArrow)), this.hasTargetArrow && (this.targetArrow = b(r), this.group.appendChild(this.targetArrow));
  }
  render(e) {
    const { x: o, y: r, width: s, height: d, flipX: n, flipY: h } = B(
      e.from,
      e.to
    );
    this.svg.style.transform = `translate(${o}px, ${r}px)`, this.svg.style.width = `${s}px`, this.svg.style.height = `${d}px`, this.group.style.transform = `scale(${n}, ${h})`;
    const c = T(
      e.from.direction,
      n,
      h
    ), a = T(e.to.direction, n, h), l = {
      x: s,
      y: d
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
      flipX: n,
      flipY: h,
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
      const y = m(
        c,
        w,
        this.arrowLength,
        this.arrowWidth
      );
      this.sourceArrow.setAttribute("d", y);
    }
    if (this.targetArrow) {
      const y = m(
        f,
        l,
        x,
        this.arrowWidth
      );
      this.targetArrow.setAttribute("d", y);
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
    const r = (e == null ? void 0 : e.color) ?? u.color, s = (e == null ? void 0 : e.width) ?? u.width;
    this.svg.appendChild(this.group), this.line = F(r, s), this.group.appendChild(this.line), this.hasSourceArrow && (this.sourceArrow = b(r), this.group.appendChild(this.sourceArrow)), this.hasTargetArrow && (this.targetArrow = b(r), this.group.appendChild(this.targetArrow));
  }
  render(e) {
    const { x: o, y: r, width: s, height: d, flipX: n, flipY: h } = B(
      e.from,
      e.to
    );
    this.svg.style.transform = `translate(${o}px, ${r}px)`, this.svg.style.width = `${s}px`, this.svg.style.height = `${d}px`, this.group.style.transform = `scale(${n}, ${h})`;
    const c = T(
      e.from.direction,
      n,
      h
    ), a = T(e.to.direction, n, h), l = {
      x: s,
      y: d
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
      flipX: n,
      flipY: h,
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
      flipY: h,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), this.line.setAttribute("d", g), this.sourceArrow) {
      const y = m(
        c,
        w,
        this.arrowLength,
        this.arrowWidth
      );
      this.sourceArrow.setAttribute("d", y);
    }
    if (this.targetArrow) {
      const y = m(
        f,
        l,
        x,
        this.arrowWidth
      );
      this.targetArrow.setAttribute("d", y);
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
  var o, r, s, d, n;
  const e = Te(
    (o = t == null ? void 0 : t.nodes) == null ? void 0 : o.priority,
    (r = t == null ? void 0 : t.edges) == null ? void 0 : r.priority
  );
  return {
    nodes: {
      centerFn: ((s = t == null ? void 0 : t.nodes) == null ? void 0 : s.centerFn) ?? pe,
      priorityFn: e.nodesPriorityFn
    },
    ports: {
      direction: ((d = t == null ? void 0 : t.ports) == null ? void 0 : d.direction) ?? 0
    },
    edges: {
      shapeFactory: Re(((n = t == null ? void 0 : t.edges) == null ? void 0 : n.shape) ?? {}),
      priorityFn: e.edgesPriorityFn
    }
  };
};
class We {
  constructor(e, o, r) {
    i(this, "nodeIdGenerator", new Y(
      (e) => this.graph.getNode(e) !== null
    ));
    i(this, "portIdGenerator", new Y(
      (e) => this.graph.getPort(e) !== null
    ));
    i(this, "edgeIdGenerator", new Y(
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
    this.element = e, this.controller = o, this.defaults = Ie(r), this.graph = o.graph, this.viewport = o.viewport;
  }
  /**
   * adds node to graph
   */
  addNode(e) {
    const o = this.nodeIdGenerator.create(e.id);
    if (this.graph.getNode(o) !== null)
      throw new A("failed to add node with existing id");
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
      throw new A("failed to update nonexisting node");
    return this.controller.updateNode(e, o ?? {}), this;
  }
  /**
   * removes node from graph
   * all the ports of node get unmarked
   * all the edges adjacent to node get removed
   */
  removeNode(e) {
    if (this.graph.getNode(e) === null)
      throw new A("failed to remove nonexisting node");
    return this.controller.removeNode(e), this;
  }
  /**
   * marks element as port of node
   */
  markPort(e) {
    const o = this.portIdGenerator.create(e.id);
    if (this.graph.getPort(o) !== null)
      throw new A("failed to add port with existing id");
    if (this.graph.getNode(e.nodeId) === null)
      throw new A("failed to set port on nonexisting node");
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
      throw new A("failed to unset nonexisting port");
    return this.controller.updatePort(e, o ?? {}), this;
  }
  /**
   * ummarks element as port of node
   * all the edges adjacent to port get removed
   */
  unmarkPort(e) {
    if (this.graph.getPort(e) === null)
      throw new A("failed to unset nonexisting port");
    return this.controller.unmarkPort(e), this;
  }
  /**
   * adds edge to graph
   */
  addEdge(e) {
    const o = this.edgeIdGenerator.create(e.id);
    if (this.graph.getEdge(o) !== null)
      throw new A("failed to add edge with existing id");
    if (this.graph.getPort(e.from) === null)
      throw new A("failed to add edge from nonexisting port");
    if (this.graph.getPort(e.to) === null)
      throw new A("failed to add edge to nonexisting port");
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
      throw new A("failed to update nonexisting edge");
    return this.controller.updateEdge(e, o ?? {}), this;
  }
  /**
   * removes edge from graph
   */
  removeEdge(e) {
    if (this.graph.getEdge(e) === null)
      throw new A("failed to remove nonexisting edge");
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
    [this.afterNodeAddedEmitter, this.onAfterNodeAdded] = E(), [this.afterNodeUpdatedEmitter, this.onAfterNodeUpdated] = E(), [this.afterNodePriorityUpdatedEmitter, this.onAfterNodePriorityUpdated] = E(), [this.beforeNodeRemovedEmitter, this.onBeforeNodeRemoved] = E(), [this.afterPortAddedEmitter, this.onAfterPortAdded] = E(), [this.afterPortUpdatedEmitter, this.onAfterPortUpdated] = E(), [this.beforePortRemovedEmitter, this.onBeforePortRemoved] = E(), [this.afterEdgeAddedEmitter, this.onAfterEdgeAdded] = E(), [this.afterEdgeShapeUpdatedEmitter, this.onAfterEdgeShapeUpdated] = E(), [this.afterEdgeUpdatedEmitter, this.onAfterEdgeUpdated] = E(), [this.afterEdgePriorityUpdatedEmitter, this.onAfterEdgePriorityUpdated] = E(), [this.beforeEdgeRemovedEmitter, this.onBeforeEdgeRemoved] = E(), [this.beforeClearEmitter, this.onBeforeClear] = E();
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
      const s = this.edges.get(e);
      this.removeEdgeInternal(e), this.addEdgeInternal({
        id: e,
        from: o.from ?? s.from,
        to: o.to ?? s.to,
        shape: s.shape,
        priority: s.priority
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
    return o.forEach((s) => {
      r = [...r, ...this.getPortIncomingEdgeIds(s)];
    }), r;
  }
  getNodeOutcomingEdgeIds(e) {
    const o = Array.from(this.nodes.get(e).ports.keys());
    let r = [];
    return o.forEach((s) => {
      r = [...r, ...this.getPortOutcomingEdgeIds(s)];
    }), r;
  }
  getNodeCycleEdgeIds(e) {
    const o = Array.from(this.nodes.get(e).ports.keys());
    let r = [];
    return o.forEach((s) => {
      r = [...r, ...this.getPortCycleEdgeIds(s)];
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
    const o = this.edges.get(e), r = o.from, s = o.to;
    this.cycleEdges.get(r).delete(e), this.cycleEdges.get(s).delete(e), this.incommingEdges.get(r).delete(e), this.incommingEdges.get(s).delete(e), this.outcommingEdges.get(r).delete(e), this.outcommingEdges.get(s).delete(e), this.edges.delete(e);
  }
}
const q = (t) => ({
  scale: 1 / t.scale,
  x: -t.x / t.scale,
  y: -t.y / t.scale
}), O = {
  scale: 1,
  x: 0,
  y: 0
};
class Be {
  constructor() {
    i(this, "viewportMatrix", O);
    i(this, "contentMatrix", O);
    i(this, "afterUpdateEmitter");
    i(this, "onAfterUpdated");
    i(this, "beforeUpdateEmitter");
    i(this, "onBeforeUpdated");
    [this.afterUpdateEmitter, this.onAfterUpdated] = E(), [this.beforeUpdateEmitter, this.onBeforeUpdated] = E();
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
    }, this.contentMatrix = q(this.viewportMatrix), this.afterUpdateEmitter.emit();
  }
  patchContentMatrix(e) {
    this.beforeUpdateEmitter.emit(), this.contentMatrix = {
      scale: e.scale ?? this.contentMatrix.scale,
      x: e.x ?? this.contentMatrix.x,
      y: e.y ?? this.contentMatrix.y
    }, this.viewportMatrix = q(this.contentMatrix), this.afterUpdateEmitter.emit();
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
        const s = r.target;
        this.handleNodeResize(s);
      });
    }), this.canvas.graph.onAfterNodeAdded.subscribe(this.onAfterNodeAdded), this.canvas.graph.onBeforeNodeRemoved.subscribe(this.onBeforeNodeRemoved), this.canvas.graph.onBeforeClear.subscribe(this.onBeforeClear);
  }
  static configure(e) {
    new j(e);
  }
  handleNodeResize(e) {
    const o = this.elementToNodeId.get(e);
    this.canvas.updateNode(o), this.canvas.graph.getNodeAdjacentEdgeIds(o).forEach((s) => {
      this.canvas.updateEdge(s);
    });
  }
}
class Ye {
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
  setElement(e) {
    return this.element = e, this;
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
      throw new A(
        "unable to build canvas when no attach element specified"
      );
    let e = this.boxRenderingTrigger;
    this.virtualScrollOptions !== void 0 && e === void 0 && (e = new te());
    const o = new Fe(), r = new Be();
    let s = new Ee(
      o,
      r,
      this.element
    );
    e !== void 0 && (s = new Se(s, o, e));
    let d = new ne(
      o,
      r,
      s
    );
    this.hasDraggableNode && (d = new de(
      d,
      this.element,
      this.dragOptions
    )), this.virtualScrollOptions !== void 0 ? d = new fe(
      d,
      e,
      this.transformOptions,
      this.virtualScrollOptions,
      this.element
    ) : this.hasTransformableViewport && (d = new ee(
      d,
      this.element,
      this.transformOptions
    ));
    const n = new We(this.element, d, this.canvasDefaults);
    return this.hasResizeReactiveNodes && j.configure(n), this.reset(), n;
  }
  reset() {
    this.element = null, this.canvasDefaults = {}, this.dragOptions = void 0, this.transformOptions = void 0, this.virtualScrollOptions = void 0, this.hasDraggableNode = !1, this.hasTransformableViewport = !1, this.hasResizeReactiveNodes = !1, this.boxRenderingTrigger = void 0;
  }
}
export {
  De as BezierEdgeShape,
  Ye as CanvasBuilder,
  te as EventSubject,
  Ce as HorizontalEdgeShape,
  A as HtmlGraphError,
  Ue as StraightEdgeShape,
  $e as VerticalEdgeShape
};
