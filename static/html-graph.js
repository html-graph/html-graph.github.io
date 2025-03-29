var tt = Object.defineProperty;
var et = (e, t, o) => t in e ? tt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[t] = o;
var i = (e, t, o) => et(e, typeof t != "symbol" ? t + "" : t, o);
class O {
  constructor() {
    i(this, "callbacks", /* @__PURE__ */ new Set());
  }
  subscribe(t) {
    this.callbacks.add(t);
  }
  unsubscribe(t) {
    this.callbacks.delete(t);
  }
  emit(t) {
    this.callbacks.forEach((o) => {
      o(t);
    });
  }
}
const ot = () => {
  const e = new O();
  return [e, e];
}, _ = (e) => ({
  scale: 1 / e.scale,
  x: -e.x / e.scale,
  y: -e.y / e.scale
}), J = {
  scale: 1,
  x: 0,
  y: 0
};
class rt {
  constructor() {
    i(this, "viewportMatrix", J);
    i(this, "contentMatrix", J);
    i(this, "emitter");
    i(this, "onAfterUpdate");
    [this.emitter, this.onAfterUpdate] = ot();
  }
  getViewportMatrix() {
    return this.viewportMatrix;
  }
  getContentMatrix() {
    return this.contentMatrix;
  }
  patchViewportMatrix(t) {
    this.viewportMatrix = {
      scale: t.scale ?? this.viewportMatrix.scale,
      x: t.x ?? this.viewportMatrix.x,
      y: t.y ?? this.viewportMatrix.y
    }, this.contentMatrix = _(this.viewportMatrix), this.emitter.emit();
  }
  patchContentMatrix(t) {
    this.contentMatrix = {
      scale: t.scale ?? this.contentMatrix.scale,
      x: t.x ?? this.contentMatrix.x,
      y: t.y ?? this.contentMatrix.y
    }, this.viewportMatrix = _(this.contentMatrix), this.emitter.emit();
  }
}
class it {
  constructor(t) {
    this.transformer = t;
  }
  getViewportMatrix() {
    return { ...this.transformer.getViewportMatrix() };
  }
  getContentMatrix() {
    return { ...this.transformer.getContentMatrix() };
  }
}
class st {
  constructor(t) {
    this.graphStore = t;
  }
  getNode(t) {
    const o = this.graphStore.getNode(t);
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
  getPort(t) {
    const o = this.graphStore.getPort(t);
    return o === void 0 ? null : {
      element: o.element,
      direction: o.direction
    };
  }
  getAllPortIds() {
    return this.graphStore.getAllPortIds();
  }
  getNodePortIds(t) {
    return this.graphStore.getNode(t) === void 0 ? null : this.graphStore.getNodePortIds(t);
  }
  getPortNodeId(t) {
    return this.graphStore.getPortNodeId(t) ?? null;
  }
  getAllEdgeIds() {
    return this.graphStore.getAllEdgeIds();
  }
  getEdge(t) {
    const o = this.graphStore.getEdge(t);
    return o === void 0 ? null : { from: o.from, to: o.to, priority: o.priority };
  }
  getPortIncomingEdgeIds(t) {
    return this.graphStore.getPort(t) === void 0 ? null : this.graphStore.getPortIncomingEdgeIds(t);
  }
  getPortOutcomingEdgeIds(t) {
    return this.graphStore.getPort(t) === void 0 ? null : this.graphStore.getPortOutcomingEdgeIds(t);
  }
  getPortCycleEdgeIds(t) {
    return this.graphStore.getPort(t) === void 0 ? null : this.graphStore.getPortCycleEdgeIds(t);
  }
  getPortAdjacentEdgeIds(t) {
    return this.graphStore.getPort(t) === void 0 ? null : this.graphStore.getPortAdjacentEdgeIds(t);
  }
  getNodeIncomingEdgeIds(t) {
    return this.graphStore.getNode(t) === void 0 ? null : this.graphStore.getNodeIncomingEdgeIds(t);
  }
  getNodeOutcomingEdgeIds(t) {
    return this.graphStore.getNode(t) === void 0 ? null : this.graphStore.getNodeOutcomingEdgeIds(t);
  }
  getNodeCycleEdgeIds(t) {
    return this.graphStore.getNode(t) === void 0 ? null : this.graphStore.getNodeCycleEdgeIds(t);
  }
  getNodeAdjacentEdgeIds(t) {
    return this.graphStore.getNode(t) === void 0 ? null : this.graphStore.getNodeAdjacentEdgeIds(t);
  }
}
class nt {
  constructor(t, o, r) {
    i(this, "viewport");
    i(this, "graph");
    this.graphStore = t, this.viewportTransformer = o, this.htmlView = r, this.graph = new st(this.graphStore), this.viewport = new it(this.viewportTransformer);
  }
  attach(t) {
    this.htmlView.attach(t);
  }
  detach() {
    this.htmlView.detach();
  }
  addNode(t) {
    this.graphStore.addNode(t), this.htmlView.attachNode(t.id);
  }
  updateNode(t, o) {
    const r = this.graphStore.getNode(t);
    r.x = (o == null ? void 0 : o.x) ?? r.x, r.y = (o == null ? void 0 : o.y) ?? r.y, r.centerFn = o.centerFn ?? r.centerFn, this.htmlView.updateNodeCoordinates(t), this.graphStore.getNodeAdjacentEdgeIds(t).forEach((h) => {
      this.htmlView.renderEdge(h);
    }), o.priority !== void 0 && (r.priority = o.priority, this.htmlView.updateNodePriority(t));
  }
  removeNode(t) {
    this.graphStore.getNodePortIds(t).forEach((o) => {
      this.unmarkPort(o);
    }), this.htmlView.detachNode(t), this.graphStore.removeNode(t);
  }
  markPort(t) {
    this.graphStore.addPort(t);
  }
  updatePort(t, o) {
    const r = this.graphStore.getPort(t);
    r.direction = o.direction ?? r.direction, this.graphStore.getPortAdjacentEdgeIds(t).forEach((h) => {
      this.htmlView.renderEdge(h);
    });
  }
  unmarkPort(t) {
    this.graphStore.getPortAdjacentEdgeIds(t).forEach((o) => {
      this.removeEdge(o);
    }), this.graphStore.removePort(t);
  }
  addEdge(t) {
    this.graphStore.addEdge(t), this.htmlView.attachEdge(t.id);
  }
  updateEdge(t, o) {
    const r = this.graphStore.getEdge(t);
    o.shape !== void 0 && (r.shape = o.shape, this.htmlView.updateEdgeShape(t)), o.from !== void 0 && this.graphStore.updateEdgeFrom(t, o.from), o.to !== void 0 && this.graphStore.updateEdgeTo(t, o.to), this.htmlView.renderEdge(t), o.priority !== void 0 && (r.priority = o.priority, this.htmlView.updateEdgePriority(t));
  }
  removeEdge(t) {
    this.htmlView.detachEdge(t), this.graphStore.removeEdge(t);
  }
  patchViewportMatrix(t) {
    this.viewportTransformer.patchViewportMatrix(t);
  }
  patchContentMatrix(t) {
    this.viewportTransformer.patchContentMatrix(t);
  }
  clear() {
    this.htmlView.clear(), this.graphStore.clear();
  }
  destroy() {
    this.clear(), this.htmlView.destroy();
  }
}
const C = (e, t, o) => {
  const { x: r, y: n, width: h, height: s } = e.getBoundingClientRect();
  return t >= r && t <= r + h && o >= n && o <= n + s;
}, $ = (e, t, o) => t >= 0 && t <= e.innerWidth && o >= 0 && o <= e.innerHeight, W = (e, t) => {
  t !== null ? e.style.cursor = t : e.style.removeProperty("cursor");
}, ht = (e) => {
  var g, y, x, v, A, S;
  const t = ((g = e == null ? void 0 : e.events) == null ? void 0 : g.onNodeDrag) ?? (() => {
  }), o = ((y = e == null ? void 0 : e.events) == null ? void 0 : y.onBeforeNodeDrag) ?? (() => !0), r = ((x = e == null ? void 0 : e.events) == null ? void 0 : x.onNodeDragFinished) ?? (() => {
  }), n = (e == null ? void 0 : e.moveOnTop) === !1, h = (v = e == null ? void 0 : e.mouse) == null ? void 0 : v.dragCursor, s = h !== void 0 ? h : "grab", c = (A = e == null ? void 0 : e.mouse) == null ? void 0 : A.mouseDownEventVerifier, d = c !== void 0 ? c : (T) => T.button === 0, a = (S = e == null ? void 0 : e.mouse) == null ? void 0 : S.mouseUpEventVerifier;
  return {
    freezePriority: n,
    dragCursor: s,
    mouseDownEventVerifier: d,
    mouseUpEventVerifier: a !== void 0 ? a : (T) => T.button === 0,
    onNodeDrag: t,
    onBeforeNodeDrag: o,
    onNodeDragFinished: r
  };
};
class ct {
  constructor(t, o) {
    i(this, "graph");
    i(this, "viewport");
    i(this, "maxNodePriority", 0);
    i(this, "nodes", /* @__PURE__ */ new Map());
    i(this, "grabbedNodeId", null);
    i(this, "element", null);
    i(this, "onWindowMouseMove", (t) => {
      if (this.element !== null && (!C(this.element, t.clientX, t.clientY) || !$(this.window, t.clientX, t.clientY))) {
        this.cancelMouseDrag();
        return;
      }
      this.grabbedNodeId !== null && this.dragNode(this.grabbedNodeId, t.movementX, t.movementY);
    });
    i(this, "onWindowMouseUp", (t) => {
      this.options.mouseUpEventVerifier(t) && this.cancelMouseDrag();
    });
    i(this, "onWindowTouchMove", (t) => {
      if (t.touches.length !== 1)
        return;
      const o = t.touches[0];
      if (this.element !== null && (!C(this.element, o.clientX, o.clientY) || !$(this.window, o.clientX, o.clientY))) {
        this.cancelTouchDrag();
        return;
      }
      if (this.grabbedNodeId !== null && this.previousTouchCoords !== null) {
        const r = o.clientX - this.previousTouchCoords.x, n = o.clientY - this.previousTouchCoords.y;
        this.dragNode(this.grabbedNodeId, r, n), this.previousTouchCoords = {
          x: t.touches[0].clientX,
          y: t.touches[0].clientY
        };
      }
    });
    i(this, "onWindowTouchFinish", () => {
      this.previousTouchCoords = null, this.cancelTouchDrag();
    });
    i(this, "previousTouchCoords", null);
    i(this, "window", window);
    i(this, "options");
    this.canvas = t, this.viewport = this.canvas.viewport, this.graph = this.canvas.graph, this.options = ht(o ?? {});
  }
  attach(t) {
    this.detach(), this.element = t, this.canvas.attach(this.element);
  }
  detach() {
    this.canvas.detach(), this.element !== null && (this.element = null);
  }
  addNode(t) {
    this.canvas.addNode(t), this.updateMaxNodePriority(t.id);
    const o = (n) => {
      if (this.element === null || !this.options.mouseDownEventVerifier(n))
        return;
      const h = this.graph.getNode(t.id);
      this.options.onBeforeNodeDrag({
        nodeId: t.id,
        element: t.element,
        x: h.x,
        y: h.y
      }) && (n.stopImmediatePropagation(), this.grabbedNodeId = t.id, W(this.element, this.options.dragCursor), this.moveNodeOnTop(t.id), this.window.addEventListener("mouseup", this.onWindowMouseUp), this.window.addEventListener("mousemove", this.onWindowMouseMove));
    }, r = (n) => {
      if (n.touches.length !== 1)
        return;
      n.stopImmediatePropagation(), this.previousTouchCoords = {
        x: n.touches[0].clientX,
        y: n.touches[0].clientY
      };
      const h = this.graph.getNode(t.id);
      this.options.onBeforeNodeDrag({
        nodeId: t.id,
        element: t.element,
        x: h.x,
        y: h.y
      }) && (this.grabbedNodeId = t.id, this.moveNodeOnTop(t.id), this.window.addEventListener("touchmove", this.onWindowTouchMove), this.window.addEventListener("touchend", this.onWindowTouchFinish), this.window.addEventListener("touchcancel", this.onWindowTouchFinish));
    };
    this.nodes.set(t.id, {
      element: t.element,
      onMouseDown: o,
      onTouchStart: r
    }), t.element.addEventListener("mousedown", o), t.element.addEventListener("touchstart", r);
  }
  updateNode(t, o) {
    this.canvas.updateNode(t, o), this.updateMaxNodePriority(t);
  }
  removeNode(t) {
    const o = this.nodes.get(t);
    o !== void 0 && (o.element.removeEventListener("mousedown", o.onMouseDown), o.element.removeEventListener("touchstart", o.onTouchStart)), this.nodes.delete(t), this.canvas.removeNode(t);
  }
  markPort(t) {
    this.canvas.markPort(t);
  }
  updatePort(t, o) {
    this.canvas.updatePort(t, o);
  }
  unmarkPort(t) {
    this.canvas.unmarkPort(t);
  }
  addEdge(t) {
    this.canvas.addEdge(t);
  }
  updateEdge(t, o) {
    this.canvas.updateEdge(t, o);
  }
  removeEdge(t) {
    this.canvas.removeEdge(t);
  }
  patchViewportMatrix(t) {
    this.canvas.patchViewportMatrix(t);
  }
  patchContentMatrix(t) {
    this.canvas.patchContentMatrix(t);
  }
  clear() {
    this.canvas.clear(), this.nodes.forEach((t) => {
      t.element.removeEventListener("mousedown", t.onMouseDown), t.element.removeEventListener("touchstart", t.onTouchStart);
    }), this.nodes.clear(), this.maxNodePriority = 0;
  }
  destroy() {
    this.detach(), this.clear(), this.removeMouseDragListeners(), this.removeTouchDragListeners(), this.canvas.destroy();
  }
  dragNode(t, o, r) {
    const n = this.graph.getNode(t);
    if (n === null)
      return;
    const h = this.canvas.viewport.getContentMatrix(), s = h.scale * n.x + h.x, c = h.scale * n.y + h.y, d = s + o, a = c + r, l = this.canvas.viewport.getViewportMatrix(), g = l.scale * d + l.x, y = l.scale * a + l.y;
    this.canvas.updateNode(t, { x: g, y }), this.options.onNodeDrag({
      nodeId: t,
      element: n.element,
      x: g,
      y
    });
  }
  updateMaxNodePriority(t) {
    const o = this.graph.getNode(t).priority;
    this.maxNodePriority = Math.max(this.maxNodePriority, o);
  }
  moveNodeOnTop(t) {
    if (this.options.freezePriority)
      return;
    this.maxNodePriority += 2, this.updateNode(t, { priority: this.maxNodePriority });
    const o = this.maxNodePriority - 1;
    this.graph.getNodeAdjacentEdgeIds(t).forEach((n) => {
      this.updateEdge(n, { priority: o });
    });
  }
  cancelMouseDrag() {
    const t = this.graph.getNode(this.grabbedNodeId);
    t !== null && this.options.onNodeDragFinished({
      nodeId: this.grabbedNodeId,
      element: t.element,
      x: t.x,
      y: t.y
    }), this.grabbedNodeId = null, this.element !== null && W(this.element, null), this.removeMouseDragListeners();
  }
  removeMouseDragListeners() {
    this.window.removeEventListener("mouseup", this.onWindowMouseUp), this.window.removeEventListener("mousemove", this.onWindowMouseMove);
  }
  cancelTouchDrag() {
    this.previousTouchCoords = null;
    const t = this.graph.getNode(this.grabbedNodeId);
    t !== null && this.options.onNodeDragFinished({
      nodeId: this.grabbedNodeId,
      element: t.element,
      x: t.x,
      y: t.y
    }), this.grabbedNodeId = null, this.removeTouchDragListeners();
  }
  removeTouchDragListeners() {
    this.window.removeEventListener("touchmove", this.onWindowTouchMove), this.window.removeEventListener("touchend", this.onWindowTouchFinish), this.window.removeEventListener("touchcancel", this.onWindowTouchFinish);
  }
}
const dt = (e) => {
  const t = e.minX !== null ? e.minX : -1 / 0, o = e.maxX !== null ? e.maxX : 1 / 0, r = e.minY !== null ? e.minY : -1 / 0, n = e.maxY !== null ? e.maxY : 1 / 0;
  return (h) => {
    let s = h.nextTransform.x, c = h.nextTransform.y;
    s < t && s < h.prevTransform.x && (s = Math.min(h.prevTransform.x, t));
    const d = h.canvasWidth * h.prevTransform.scale, a = o - d;
    s > a && s > h.prevTransform.x && (s = Math.max(h.prevTransform.x, a)), c < r && c < h.prevTransform.y && (c = Math.min(h.prevTransform.y, r));
    const l = h.canvasHeight * h.prevTransform.scale, g = n - l;
    return c > g && c > h.prevTransform.y && (c = Math.max(h.prevTransform.y, g)), { scale: h.nextTransform.scale, x: s, y: c };
  };
}, at = (e) => {
  const t = e.maxContentScale, o = e.minContentScale, r = t !== null ? 1 / t : 0, n = o !== null ? 1 / o : 1 / 0;
  return (h) => {
    const s = h.prevTransform, c = h.nextTransform;
    let d = c.scale, a = c.x, l = c.y;
    if (c.scale > n && c.scale > s.scale) {
      d = Math.max(s.scale, n), a = s.x, l = s.y;
      const g = (d - s.scale) / (c.scale - s.scale);
      a = s.x + (c.x - s.x) * g, l = s.y + (c.y - s.y) * g;
    }
    if (c.scale < r && c.scale < s.scale) {
      d = Math.min(s.scale, r), a = s.x, l = s.y;
      const g = (d - s.scale) / (c.scale - s.scale);
      a = s.x + (c.x - s.x) * g, l = s.y + (c.y - s.y) * g;
    }
    return {
      scale: d,
      x: a,
      y: l
    };
  };
}, lt = (e) => (t) => e.reduce(
  (o, r) => r({
    prevTransform: t.prevTransform,
    nextTransform: o,
    canvasWidth: t.canvasWidth,
    canvasHeight: t.canvasHeight
  }),
  t.nextTransform
), Q = (e) => {
  if (typeof e == "function")
    return e;
  switch (e.type) {
    case "scale-limit":
      return at({
        minContentScale: e.minContentScale ?? 0,
        maxContentScale: e.maxContentScale ?? 1 / 0
      });
    case "shift-limit":
      return dt({
        minX: e.minX ?? -1 / 0,
        maxX: e.maxX ?? 1 / 0,
        minY: e.minY ?? -1 / 0,
        maxY: e.maxY ?? 1 / 0
      });
  }
}, gt = (e) => {
  var v, A, S, T, z, P, L, m, U, j, G, K;
  const t = (v = e == null ? void 0 : e.scale) == null ? void 0 : v.mouseWheelSensitivity, o = t !== void 0 ? t : 1.2, r = e == null ? void 0 : e.transformPreprocessor;
  let n;
  r !== void 0 ? Array.isArray(r) ? n = lt(
    r.map(
      (V) => Q(V)
    )
  ) : n = Q(r) : n = (V) => V.nextTransform;
  const h = ((A = e == null ? void 0 : e.shift) == null ? void 0 : A.cursor) !== void 0 ? e.shift.cursor : "grab", s = ((S = e == null ? void 0 : e.events) == null ? void 0 : S.onBeforeTransformChange) ?? (() => {
  }), c = ((T = e == null ? void 0 : e.events) == null ? void 0 : T.onTransformChange) ?? (() => {
  }), d = (z = e == null ? void 0 : e.shift) == null ? void 0 : z.mouseDownEventVerifier, a = d !== void 0 ? d : (V) => V.button === 0, l = (P = e == null ? void 0 : e.shift) == null ? void 0 : P.mouseUpEventVerifier, g = l !== void 0 ? l : (V) => V.button === 0, y = (L = e == null ? void 0 : e.scale) == null ? void 0 : L.mouseWheelEventVerifier, x = y !== void 0 ? y : () => !0;
  return {
    wheelSensitivity: o,
    onTransformStarted: ((m = e == null ? void 0 : e.events) == null ? void 0 : m.onTransformStarted) ?? (() => {
    }),
    onTransformFinished: ((U = e == null ? void 0 : e.events) == null ? void 0 : U.onTransformFinished) ?? (() => {
    }),
    onBeforeTransformChange: s,
    onTransformChange: c,
    transformPreprocessor: n,
    shiftCursor: h,
    mouseDownEventVerifier: a,
    mouseUpEventVerifier: g,
    mouseWheelEventVerifier: x,
    scaleWheelFinishTimeout: ((j = e == null ? void 0 : e.scale) == null ? void 0 : j.wheelFinishTimeout) ?? 500,
    onResizeTransformStarted: ((G = e == null ? void 0 : e.events) == null ? void 0 : G.onResizeTransformStarted) ?? (() => {
    }),
    onResizeTransformFinished: ((K = e == null ? void 0 : e.events) == null ? void 0 : K.onResizeTransformFinished) ?? (() => {
    })
  };
}, b = (e) => {
  const t = [], o = e.touches.length;
  for (let c = 0; c < o; c++)
    t.push([e.touches[c].clientX, e.touches[c].clientY]);
  const r = t.reduce(
    (c, d) => [c[0] + d[0], c[1] + d[1]],
    [0, 0]
  ), n = [r[0] / o, r[1] / o], s = t.map((c) => [c[0] - n[0], c[1] - n[1]]).reduce(
    (c, d) => c + Math.sqrt(d[0] * d[0] + d[1] * d[1]),
    0
  );
  return {
    x: n[0],
    y: n[1],
    scale: s / o,
    touchesCnt: o,
    touches: t
  };
}, ut = (e, t, o) => ({
  scale: e.scale,
  x: e.x + e.scale * t,
  y: e.y + e.scale * o
}), wt = (e, t, o, r) => ({
  scale: e.scale * t,
  x: e.scale * (1 - t) * o + e.x,
  y: e.scale * (1 - t) * r + e.y
});
class q {
  constructor(t, o) {
    i(this, "graph");
    i(this, "viewport");
    i(this, "element", null);
    i(this, "prevTouches", null);
    i(this, "window", window);
    i(this, "wheelFinishTimer", null);
    i(this, "onMouseDown", (t) => {
      this.element === null || !this.options.mouseDownEventVerifier(t) || (W(this.element, this.options.shiftCursor), this.window.addEventListener("mousemove", this.onWindowMouseMove), this.window.addEventListener("mouseup", this.onWindowMouseUp), this.options.onTransformStarted());
    });
    i(this, "onWindowMouseMove", (t) => {
      if (this.element === null || !C(this.element, t.clientX, t.clientY) || !$(this.window, t.clientX, t.clientY)) {
        this.stopMouseDrag();
        return;
      }
      const o = -t.movementX, r = -t.movementY;
      this.moveViewport(this.element, o, r);
    });
    i(this, "onWindowMouseUp", (t) => {
      this.element === null || !this.options.mouseUpEventVerifier(t) || this.stopMouseDrag();
    });
    i(this, "onWheelScroll", (t) => {
      if (!this.options.mouseWheelEventVerifier(t))
        return;
      t.preventDefault();
      const { left: o, top: r } = this.element.getBoundingClientRect(), n = t.clientX - o, h = t.clientY - r, c = 1 / (t.deltaY < 0 ? this.options.wheelSensitivity : 1 / this.options.wheelSensitivity);
      this.wheelFinishTimer === null && this.options.onTransformStarted(), this.scaleViewport(this.element, c, n, h), this.wheelFinishTimer !== null && clearTimeout(this.wheelFinishTimer), this.wheelFinishTimer = setTimeout(() => {
        this.options.onTransformFinished(), this.wheelFinishTimer = null;
      }, this.options.scaleWheelFinishTimeout);
    });
    i(this, "onTouchStart", (t) => {
      if (this.prevTouches !== null) {
        this.prevTouches = b(t);
        return;
      }
      this.prevTouches = b(t), this.window.addEventListener("touchmove", this.onWindowTouchMove), this.window.addEventListener("touchend", this.onWindowTouchFinish), this.window.addEventListener("touchcancel", this.onWindowTouchFinish), this.options.onTransformStarted();
    });
    i(this, "onWindowTouchMove", (t) => {
      const o = this.element;
      if (o === null)
        return;
      const r = b(t);
      if (!r.touches.every(
        (h) => C(o, h[0], h[1]) && $(this.window, h[0], h[1])
      )) {
        this.stopTouchDrag();
        return;
      }
      if ((r.touchesCnt === 1 || r.touchesCnt === 2) && this.moveViewport(
        o,
        -(r.x - this.prevTouches.x),
        -(r.y - this.prevTouches.y)
      ), r.touchesCnt === 2) {
        const { left: h, top: s } = o.getBoundingClientRect(), c = this.prevTouches.x - h, d = this.prevTouches.y - s, l = 1 / (r.scale / this.prevTouches.scale);
        this.scaleViewport(o, l, c, d);
      }
      this.prevTouches = r;
    });
    i(this, "onWindowTouchFinish", (t) => {
      t.touches.length > 0 ? this.prevTouches = b(t) : this.stopTouchDrag();
    });
    i(this, "observer", new ResizeObserver(() => {
      const t = this.canvas.viewport.getViewportMatrix(), { width: o, height: r } = this.element.getBoundingClientRect(), n = this.options.transformPreprocessor({
        prevTransform: t,
        nextTransform: t,
        canvasWidth: o,
        canvasHeight: r
      });
      this.options.onResizeTransformStarted(), this.canvas.patchViewportMatrix(n), this.options.onResizeTransformFinished();
    }));
    i(this, "options");
    this.canvas = t, this.options = gt(o), this.viewport = this.canvas.viewport, this.graph = this.canvas.graph;
  }
  attach(t) {
    this.detach(), this.element = t, this.observer.observe(this.element), this.element.addEventListener("mousedown", this.onMouseDown), this.element.addEventListener("wheel", this.onWheelScroll), this.element.addEventListener("touchstart", this.onTouchStart), this.canvas.attach(this.element);
  }
  detach() {
    this.canvas.detach(), this.element !== null && (this.observer.unobserve(this.element), this.element.removeEventListener("mousedown", this.onMouseDown), this.element.removeEventListener("wheel", this.onWheelScroll), this.element.removeEventListener("touchstart", this.onTouchStart), this.element = null);
  }
  addNode(t) {
    this.canvas.addNode(t);
  }
  updateNode(t, o) {
    this.canvas.updateNode(t, o);
  }
  removeNode(t) {
    this.canvas.removeNode(t);
  }
  markPort(t) {
    this.canvas.markPort(t);
  }
  updatePort(t, o) {
    this.canvas.updatePort(t, o);
  }
  unmarkPort(t) {
    this.canvas.unmarkPort(t);
  }
  addEdge(t) {
    this.canvas.addEdge(t);
  }
  updateEdge(t, o) {
    this.canvas.updateEdge(t, o);
  }
  removeEdge(t) {
    this.canvas.removeEdge(t);
  }
  patchViewportMatrix(t) {
    this.canvas.patchViewportMatrix(t);
  }
  patchContentMatrix(t) {
    this.canvas.patchContentMatrix(t);
  }
  clear() {
    this.canvas.clear();
  }
  destroy() {
    this.detach(), this.removeMouseDragListeners(), this.removeTouchDragListeners(), this.canvas.destroy();
  }
  moveViewport(t, o, r) {
    const n = this.viewport.getViewportMatrix(), h = ut(n, o, r), { width: s, height: c } = t.getBoundingClientRect(), d = this.options.transformPreprocessor({
      prevTransform: n,
      nextTransform: h,
      canvasWidth: s,
      canvasHeight: c
    });
    this.performTransform(d);
  }
  scaleViewport(t, o, r, n) {
    const h = this.canvas.viewport.getViewportMatrix(), s = wt(h, o, r, n), { width: c, height: d } = t.getBoundingClientRect(), a = this.options.transformPreprocessor({
      prevTransform: h,
      nextTransform: s,
      canvasWidth: c,
      canvasHeight: d
    });
    this.performTransform(a);
  }
  stopMouseDrag() {
    this.element !== null && W(this.element, null), this.removeMouseDragListeners(), this.options.onTransformFinished();
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
  performTransform(t) {
    this.options.onBeforeTransformChange(), this.canvas.patchViewportMatrix(t), this.options.onTransformChange();
  }
}
class yt {
  constructor() {
    i(this, "keyMap", /* @__PURE__ */ new Map());
    i(this, "valueMap", /* @__PURE__ */ new Map());
  }
  set(t, o) {
    this.keyMap.set(t, o), this.valueMap.set(o, t);
  }
  hasKey(t) {
    return this.keyMap.has(t);
  }
  hasValue(t) {
    return this.valueMap.has(t);
  }
  getByKey(t) {
    return this.keyMap.get(t);
  }
  getByValue(t) {
    return this.valueMap.get(t);
  }
  deleteByKey(t) {
    const o = this.keyMap.get(t);
    o !== void 0 && this.valueMap.delete(o), this.keyMap.delete(t);
  }
  deleteByValue(t) {
    const o = this.valueMap.get(t);
    o !== void 0 && this.keyMap.delete(o), this.valueMap.delete(t);
  }
  forEach(t) {
    this.keyMap.forEach((o, r) => {
      t(o, r);
    });
  }
  clear() {
    this.keyMap.clear(), this.valueMap.clear();
  }
}
class vt {
  constructor(t) {
    i(this, "viewport");
    i(this, "graph");
    i(this, "nodes", new yt());
    i(this, "nodesResizeObserver");
    i(this, "window", window);
    this.canvas = t, this.nodesResizeObserver = new this.window.ResizeObserver((o) => {
      o.forEach((r) => {
        const n = r.target;
        this.handleNodeResize(n);
      });
    }), this.viewport = this.canvas.viewport, this.graph = this.canvas.graph;
  }
  attach(t) {
    this.canvas.attach(t);
  }
  detach() {
    this.canvas.detach();
  }
  addNode(t) {
    this.canvas.addNode(t), this.nodes.set(t.id, t.element), this.nodesResizeObserver.observe(t.element);
  }
  updateNode(t, o) {
    this.canvas.updateNode(t, o);
  }
  removeNode(t) {
    this.canvas.removeNode(t);
    const o = this.nodes.getByKey(t);
    this.nodes.deleteByKey(t), this.nodesResizeObserver.unobserve(o);
  }
  markPort(t) {
    this.canvas.markPort(t);
  }
  updatePort(t, o) {
    this.canvas.updatePort(t, o);
  }
  unmarkPort(t) {
    this.canvas.unmarkPort(t);
  }
  addEdge(t) {
    this.canvas.addEdge(t);
  }
  updateEdge(t, o) {
    this.canvas.updateEdge(t, o);
  }
  removeEdge(t) {
    this.canvas.removeEdge(t);
  }
  patchViewportMatrix(t) {
    this.canvas.patchViewportMatrix(t);
  }
  patchContentMatrix(t) {
    this.canvas.patchContentMatrix(t);
  }
  clear() {
    this.canvas.clear(), this.nodesResizeObserver.disconnect(), this.nodes.clear();
  }
  destroy() {
    this.clear(), this.canvas.destroy();
  }
  handleNodeResize(t) {
    const o = this.nodes.getByValue(t);
    this.canvas.updateNode(o, {}), this.graph.getNodeAdjacentEdgeIds(o).forEach((n) => {
      this.canvas.updateEdge(n, {});
    });
  }
}
class ft {
  constructor(t, o, r, n) {
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
    i(this, "updateLoadedArea", (t) => {
      this.loadedArea = {
        xFrom: t.x,
        xTo: t.x + t.width,
        yFrom: t.y,
        yTo: t.y + t.height
      };
    });
    var d, a;
    this.trigger = o, this.virtualScrollOptions = n, this.nodeHorizontal = this.virtualScrollOptions.nodeContainingRadius.horizontal, this.nodeVertical = this.virtualScrollOptions.nodeContainingRadius.vertical, this.canvasResizeObserver = new this.window.ResizeObserver((l) => {
      const g = l[0];
      this.viewportWidth = g.contentRect.width, this.viewportHeight = g.contentRect.height, this.scheduleLoadAreaAroundViewport();
    });
    const h = ((d = r == null ? void 0 : r.events) == null ? void 0 : d.onTransformFinished) ?? (() => {
    }), s = ((a = r == null ? void 0 : r.events) == null ? void 0 : a.onTransformChange) ?? (() => {
    }), c = {
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
    this.canvas = new q(
      t,
      c
    ), this.viewportMatrix = this.canvas.viewport.getViewportMatrix(), this.viewport = this.canvas.viewport, this.graph = this.canvas.graph, this.trigger.subscribe(this.updateLoadedArea);
  }
  attach(t) {
    this.detach(), this.element = t, this.canvasResizeObserver.observe(this.element), this.canvas.attach(t);
  }
  detach() {
    this.element !== null && (this.canvasResizeObserver.unobserve(this.element), this.element = null, this.viewportWidth = 0, this.viewportHeight = 0), this.canvas.detach();
  }
  addNode(t) {
    this.canvas.addNode(t);
  }
  updateNode(t, o) {
    this.canvas.updateNode(t, o);
  }
  removeNode(t) {
    this.canvas.removeNode(t);
  }
  markPort(t) {
    this.canvas.markPort(t);
  }
  updatePort(t, o) {
    this.canvas.updatePort(t, o);
  }
  unmarkPort(t) {
    this.canvas.unmarkPort(t);
  }
  addEdge(t) {
    this.canvas.addEdge(t);
  }
  updateEdge(t, o) {
    this.canvas.updateEdge(t, o);
  }
  removeEdge(t) {
    this.canvas.removeEdge(t);
  }
  patchViewportMatrix(t) {
    this.canvas.patchViewportMatrix(t), this.viewportMatrix = this.canvas.viewport.getViewportMatrix(), this.loadAreaAroundViewport();
  }
  patchContentMatrix(t) {
    this.canvas.patchContentMatrix(t), this.viewportMatrix = this.canvas.viewport.getViewportMatrix(), this.loadAreaAroundViewport();
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
    const t = this.viewportWidth * this.viewportMatrix.scale, o = this.viewportHeight * this.viewportMatrix.scale, r = this.viewportMatrix.x - this.nodeHorizontal, n = this.viewportMatrix.y - this.nodeVertical, h = this.viewportMatrix.x + t + this.nodeHorizontal, s = this.viewportMatrix.y + o + this.nodeVertical;
    this.loadedArea.xFrom < r && this.loadedArea.xTo > h && this.loadedArea.yFrom < n && this.loadedArea.yTo > s || this.scheduleLoadAreaAroundViewport();
  }
  loadAreaAroundViewport() {
    const t = this.viewportWidth * this.viewportMatrix.scale, o = this.viewportHeight * this.viewportMatrix.scale, r = this.viewportMatrix.x - t - this.nodeHorizontal, n = this.viewportMatrix.y - o - this.nodeVertical, h = 3 * t + 2 * this.nodeHorizontal, s = 3 * o + 2 * this.nodeVertical;
    this.trigger.emit({ x: r, y: n, width: h, height: s });
  }
}
const xt = () => {
  const e = document.createElement("div");
  return e.style.width = "100%", e.style.height = "100%", e.style.position = "relative", e.style.overflow = "hidden", e;
}, Et = () => {
  const e = document.createElement("div");
  return e.style.position = "absolute", e.style.top = "0", e.style.left = "0", e.style.width = "0", e.style.height = "0", e;
}, St = () => {
  const e = document.createElement("div");
  return e.style.position = "absolute", e.style.top = "0", e.style.left = "0", e.style.visibility = "hidden", e;
};
class At {
  constructor(t, o) {
    i(this, "canvasWrapper", null);
    i(this, "host", xt());
    i(this, "container", Et());
    i(this, "nodeIdToWrapperElementMap", /* @__PURE__ */ new Map());
    i(this, "edgeIdToElementMap", /* @__PURE__ */ new Map());
    i(this, "applyTransform", () => {
      const t = this.viewportTransformer.getContentMatrix();
      this.container.style.transform = `matrix(${t.scale}, 0, 0, ${t.scale}, ${t.x}, ${t.y})`;
    });
    this.graphStore = t, this.viewportTransformer = o, this.host.appendChild(this.container), this.viewportTransformer.onAfterUpdate.subscribe(this.applyTransform);
  }
  attach(t) {
    this.detach(), this.canvasWrapper = t, this.canvasWrapper.appendChild(this.host);
  }
  detach() {
    this.canvasWrapper !== null && (this.canvasWrapper.removeChild(this.host), this.canvasWrapper = null);
  }
  attachNode(t) {
    const o = this.graphStore.getNode(t), r = St();
    r.appendChild(o.element), this.container.appendChild(r), this.nodeIdToWrapperElementMap.set(t, r), this.updateNodeCoordinates(t), this.updateNodePriority(t), r.style.visibility = "visible";
  }
  detachNode(t) {
    const o = this.graphStore.getNode(t), r = this.nodeIdToWrapperElementMap.get(t);
    r.removeChild(o.element), this.container.removeChild(r), this.nodeIdToWrapperElementMap.delete(t);
  }
  attachEdge(t) {
    const o = this.graphStore.getEdge(t);
    this.edgeIdToElementMap.set(t, o.shape.svg), this.container.appendChild(o.shape.svg), this.renderEdge(t), this.updateEdgePriority(t);
  }
  detachEdge(t) {
    const o = this.graphStore.getEdge(t);
    this.container.removeChild(o.shape.svg), this.edgeIdToElementMap.delete(t);
  }
  clear() {
    this.edgeIdToElementMap.forEach((t, o) => {
      this.detachEdge(o);
    }), this.nodeIdToWrapperElementMap.forEach((t, o) => {
      this.detachNode(o);
    });
  }
  destroy() {
    this.viewportTransformer.onAfterUpdate.unsubscribe(this.applyTransform), this.clear(), this.detach(), this.host.removeChild(this.container);
  }
  updateNodeCoordinates(t) {
    const o = this.nodeIdToWrapperElementMap.get(t), r = this.graphStore.getNode(t), { width: n, height: h } = r.element.getBoundingClientRect(), s = this.viewportTransformer.getViewportMatrix().scale, c = r.centerFn(n, h), d = r.x - s * c.x, a = r.y - s * c.y;
    o.style.transform = `translate(${d}px, ${a}px)`;
  }
  updateNodePriority(t) {
    const o = this.graphStore.getNode(t), r = this.nodeIdToWrapperElementMap.get(t);
    r.style.zIndex = `${o.priority}`;
  }
  updateEdgeShape(t) {
    const o = this.edgeIdToElementMap.get(t);
    this.container.removeChild(o);
    const r = this.graphStore.getEdge(t);
    this.edgeIdToElementMap.set(t, r.shape.svg), this.container.appendChild(r.shape.svg);
  }
  renderEdge(t) {
    const o = this.graphStore.getEdge(t), r = this.graphStore.getPort(o.from), n = this.graphStore.getPort(o.to), h = r.element.getBoundingClientRect(), s = n.element.getBoundingClientRect(), c = this.host.getBoundingClientRect(), d = this.viewportTransformer.getViewportMatrix(), a = {
      x: d.scale * (h.left - c.left) + d.x,
      y: d.scale * (h.top - c.top) + d.y
    }, l = {
      x: d.scale * (s.left - c.left) + d.x,
      y: d.scale * (s.top - c.top) + d.y
    }, g = {
      x: a.x,
      y: a.y,
      width: h.width * d.scale,
      height: h.height * d.scale,
      direction: r.direction,
      portId: o.from,
      nodeId: this.graphStore.getPortNodeId(o.from)
    }, y = {
      x: l.x,
      y: l.y,
      width: s.width * d.scale,
      height: s.height * d.scale,
      direction: n.direction,
      portId: o.to,
      nodeId: this.graphStore.getPortNodeId(o.to)
    };
    o.shape.render({
      from: g,
      to: y
    });
  }
  updateEdgePriority(t) {
    const o = this.graphStore.getEdge(t);
    o.shape.svg.style.zIndex = `${o.priority}`;
  }
}
class Tt {
  constructor(t) {
    i(this, "xFrom", 1 / 0);
    i(this, "yFrom", 1 / 0);
    i(this, "xTo", 1 / 0);
    i(this, "yTo", 1 / 0);
    this.graphStore = t;
  }
  setRenderingBox(t) {
    this.xFrom = t.x, this.xTo = t.x + t.width, this.yFrom = t.y, this.yTo = t.y + t.height;
  }
  hasNode(t) {
    const o = this.graphStore.getNode(t);
    return o.x >= this.xFrom && o.x <= this.xTo && o.y >= this.yFrom && o.y <= this.yTo;
  }
  hasEdge(t) {
    const o = this.graphStore.getEdge(t), r = this.graphStore.getPortNodeId(o.from), n = this.graphStore.getPortNodeId(o.to), h = this.graphStore.getNode(r), s = this.graphStore.getNode(n), c = Math.min(h.x, s.x), d = Math.max(h.x, s.x), a = Math.min(h.y, s.y), l = Math.max(h.y, s.y);
    return c <= this.xTo && d >= this.xFrom && a <= this.yTo && l >= this.yFrom;
  }
}
class pt {
  constructor(t, o, r) {
    i(this, "attachedNodes", /* @__PURE__ */ new Set());
    i(this, "attachedEdges", /* @__PURE__ */ new Set());
    i(this, "renderingBox");
    i(this, "updateViewport", (t) => {
      this.renderingBox.setRenderingBox(t);
      const o = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set();
      this.graphStore.getAllNodeIds().forEach((s) => {
        const c = this.renderingBox.hasNode(s), d = this.attachedNodes.has(s);
        c && !d ? o.add(s) : !c && d && r.add(s);
      }), this.graphStore.getAllEdgeIds().forEach((s) => {
        const c = this.renderingBox.hasEdge(s), d = this.attachedEdges.has(s), a = this.graphStore.getEdge(s), l = this.graphStore.getPortNodeId(a.from), g = this.graphStore.getPortNodeId(a.to);
        c && (this.renderingBox.hasNode(l) || (o.add(l), r.delete(l)), this.renderingBox.hasNode(g) || (o.add(g), r.delete(g))), c && !d ? n.add(s) : !c && d && h.add(s);
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
    this.htmlView = t, this.graphStore = o, this.trigger = r, this.renderingBox = new Tt(this.graphStore), this.trigger.subscribe(this.updateViewport);
  }
  attach(t) {
    this.htmlView.attach(t);
  }
  detach() {
    this.htmlView.detach();
  }
  attachNode(t) {
    this.renderingBox.hasNode(t) && this.handleAttachNode(t);
  }
  detachNode(t) {
    this.attachedNodes.has(t) && this.handleDetachNode(t);
  }
  attachEdge(t) {
    this.renderingBox.hasEdge(t) && this.attachEdgeEntities(t);
  }
  detachEdge(t) {
    this.attachedEdges.has(t) && this.handleDetachEdge(t);
  }
  updateNodeCoordinates(t) {
    this.attachedNodes.has(t) ? this.htmlView.updateNodeCoordinates(t) : this.renderingBox.hasNode(t) && (this.handleAttachNode(t), this.graphStore.getNodeAdjacentEdgeIds(t).forEach((o) => {
      this.attachEdgeEntities(o);
    }));
  }
  updateNodePriority(t) {
    this.attachedNodes.has(t) && this.htmlView.updateNodePriority(t);
  }
  updateEdgeShape(t) {
    this.attachedEdges.has(t) && this.htmlView.updateEdgeShape(t);
  }
  renderEdge(t) {
    this.attachedEdges.has(t) && this.htmlView.renderEdge(t);
  }
  updateEdgePriority(t) {
    this.attachedEdges.has(t) && this.htmlView.updateEdgePriority(t);
  }
  clear() {
    this.htmlView.clear(), this.attachedNodes.clear(), this.attachedEdges.clear();
  }
  destroy() {
    this.clear(), this.htmlView.destroy(), this.trigger.unsubscribe(this.updateViewport);
  }
  attachEdgeEntities(t) {
    const o = this.graphStore.getEdge(t), r = this.graphStore.getPortNodeId(o.from), n = this.graphStore.getPortNodeId(o.to);
    this.attachedNodes.has(r) || this.handleAttachNode(r), this.attachedNodes.has(n) || this.handleAttachNode(n), this.handleAttachEdge(t);
  }
  handleAttachNode(t) {
    this.attachedNodes.add(t), this.htmlView.attachNode(t);
  }
  handleDetachNode(t) {
    this.htmlView.detachNode(t), this.attachedNodes.delete(t);
  }
  handleAttachEdge(t) {
    this.attachedEdges.add(t), this.htmlView.attachEdge(t);
  }
  handleDetachEdge(t) {
    this.htmlView.detachEdge(t), this.attachedEdges.delete(t);
  }
}
class Y {
  constructor(t) {
    i(this, "counter", 0);
    this.checkExists = t;
  }
  create(t) {
    if (t !== void 0)
      return t;
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
const Nt = (e, t) => ({
  x: e / 2,
  y: t / 2
}), X = (e) => () => e, Z = X(0), Mt = () => {
  let e = 0;
  return () => e++;
}, Vt = (e, t) => {
  let o = Z, r = Z;
  const n = Mt();
  return e === "incremental" && (o = n), t === "incremental" && (r = n), typeof e == "number" && (o = X(e)), typeof t == "number" && (r = X(t)), typeof e == "function" && (o = e), typeof t == "function" && (r = t), {
    nodesPriorityFn: o,
    edgesPriorityFn: r
  };
}, f = (e, t, o) => ({
  x: t.x * e.x - t.y * e.y + ((1 - t.x) * o.x + t.y * o.y),
  y: t.y * e.x + t.x * e.y + ((1 - t.x) * o.y - t.y * o.x)
}), p = (e, t, o) => ({ x: t * Math.cos(e), y: o * Math.sin(e) }), w = {
  x: 0,
  y: 0
}, N = (e, t, o, r) => {
  const h = [
    w,
    { x: o, y: r },
    { x: o, y: -r }
  ].map((a) => f(a, e, w)).map((a) => ({ x: a.x + t.x, y: a.y + t.y })), s = `M ${h[0].x} ${h[0].y}`, c = `L ${h[1].x} ${h[1].y}`, d = `L ${h[2].x} ${h[2].y}`;
  return `${s} ${c} ${d}`;
}, D = (e, t) => {
  const o = [];
  if (e.length > 0 && o.push(`M ${e[0].x} ${e[0].y}`), e.length === 2 && o.push(`L ${e[1].x} ${e[1].y}`), e.length > 2) {
    const r = e.length - 1;
    let n = 0, h = 0, s = 0;
    e.forEach((c, d) => {
      let a = 0, l = 0, g = 0;
      const y = d > 0, x = d < r, v = y && x;
      if (y && (a = -n, l = -h, g = s), x) {
        const m = e[d + 1];
        n = m.x - c.x, h = m.y - c.y, s = Math.sqrt(n * n + h * h);
      }
      const S = s !== 0 ? Math.min((v ? t : 0) / s, d < r - 1 ? 0.5 : 1) : 0, T = v ? { x: c.x + n * S, y: c.y + h * S } : c, P = g !== 0 ? Math.min((v ? t : 0) / g, d > 1 ? 0.5 : 1) : 0, L = v ? { x: c.x + a * P, y: c.y + l * P } : c;
      d > 0 && o.push(`L ${L.x} ${L.y}`), v && o.push(
        `C ${c.x} ${c.y} ${c.x} ${c.y} ${T.x} ${T.y}`
      );
    });
  }
  return o.join(" ");
}, F = () => {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  return e.style.pointerEvents = "none", e.style.position = "absolute", e.style.top = "0", e.style.left = "0", e.style.overflow = "visible", e;
}, I = () => {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "g");
  return e.style.transformOrigin = "50% 50%", e;
}, R = (e, t) => {
  const o = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return o.setAttribute("stroke", e), o.setAttribute("stroke-width", `${t}`), o.setAttribute("fill", "none"), o;
}, M = (e) => {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("fill", e), t;
}, k = (e, t) => {
  const o = {
    x: e.x + e.width / 2,
    y: e.y + e.height / 2
  }, r = {
    x: t.x + t.width / 2,
    y: t.y + t.height / 2
  }, n = Math.min(o.x, r.x), h = Math.min(o.y, r.y), s = Math.abs(r.x - o.x), c = Math.abs(r.y - o.y), d = o.x <= r.x ? 1 : -1, a = o.y <= r.y ? 1 : -1;
  return {
    x: n,
    y: h,
    width: s,
    height: c,
    flipX: d,
    flipY: a
  };
}, Pt = (e) => {
  const t = f(
    { x: e.arrowLength, y: w.y },
    e.fromVect,
    w
  ), o = f(
    { x: e.to.x - e.arrowLength, y: e.to.y },
    e.toVect,
    e.to
  ), r = {
    x: t.x + e.fromVect.x * e.curvature,
    y: t.y + e.fromVect.y * e.curvature
  }, n = {
    x: o.x - e.toVect.x * e.curvature,
    y: o.y - e.toVect.y * e.curvature
  }, h = `M ${t.x} ${t.y} C ${r.x} ${r.y}, ${n.x} ${n.y}, ${o.x} ${o.y}`, s = e.hasSourceArrow ? "" : `M ${w.x} ${w.y} L ${t.x} ${t.y} `, c = e.hasTargetArrow ? "" : ` M ${o.x} ${o.y} L ${e.to.x} ${e.to.y}`;
  return `${s}${h}${c}`;
}, Lt = (e) => {
  const t = e.hasSourceArrow ? f(
    { x: e.arrowLength, y: w.y },
    e.fromVect,
    w
  ) : w, o = e.hasTargetArrow ? f(
    { x: e.to.x - e.arrowLength, y: e.to.y },
    e.toVect,
    e.to
  ) : e.to, r = e.arrowLength, n = Math.cos(e.detourDirection) * e.detourDistance, h = Math.sin(e.detourDirection) * e.detourDistance, s = n * e.flipX, c = h * e.flipY, d = f(
    { x: r, y: w.y },
    e.fromVect,
    w
  ), a = {
    x: d.x + s,
    y: d.y + c
  }, l = f(
    { x: e.to.x - r, y: e.to.y },
    e.toVect,
    e.to
  ), g = {
    x: l.x + s,
    y: l.y + c
  }, y = { x: (a.x + g.x) / 2, y: (a.y + g.y) / 2 }, x = {
    x: d.x + e.curvature * e.fromVect.x,
    y: d.y + e.curvature * e.fromVect.y
  }, v = {
    x: l.x - e.curvature * e.toVect.x,
    y: l.y - e.curvature * e.toVect.y
  }, A = {
    x: d.x + s,
    y: d.y + c
  }, S = {
    x: l.x + s,
    y: l.y + c
  };
  return [
    `M ${t.x} ${t.y}`,
    `L ${d.x} ${d.y}`,
    `C ${x.x} ${x.y} ${A.x} ${A.y} ${y.x} ${y.y}`,
    `C ${S.x} ${S.y} ${v.x} ${v.y} ${l.x} ${l.y}`,
    `L ${o.x} ${o.y}`
  ].join(" ");
}, mt = (e) => {
  const t = e.hasSourceArrow ? f(
    { x: e.arrowLength, y: w.y },
    e.fromVect,
    w
  ) : w, o = e.hasTargetArrow ? f(
    { x: e.to.x - e.arrowLength, y: e.to.y },
    e.toVect,
    e.to
  ) : e.to, r = e.arrowLength + e.arrowOffset, n = r - e.roundness, h = f({ x: n, y: w.y }, e.fromVect, w), s = f(
    { x: e.to.x - n, y: e.to.y },
    e.toVect,
    e.to
  ), c = Math.max((h.x + s.x) / 2, r), d = e.to.y / 2, a = { x: e.flipX > 0 ? c : -r, y: h.y }, l = { x: a.x, y: d }, g = {
    x: e.flipX > 0 ? e.to.x - c : e.to.x + r,
    y: s.y
  }, y = { x: g.x, y: d };
  return D(
    [t, h, a, l, y, g, s, o],
    e.roundness
  );
}, B = (e) => {
  const t = e.hasSourceArrow ? f(
    { x: e.arrowLength, y: w.y },
    e.fromVect,
    w
  ) : w, o = e.hasTargetArrow ? f(
    { x: e.to.x - e.arrowLength, y: e.to.y },
    e.toVect,
    e.to
  ) : e.to, r = e.arrowLength + e.arrowOffset, n = f(
    { x: r, y: w.y },
    e.fromVect,
    w
  ), h = Math.cos(e.detourDirection) * e.detourDistance, s = Math.sin(e.detourDirection) * e.detourDistance, c = h * e.flipX, d = s * e.flipY, a = { x: n.x + c, y: n.y + d }, l = f(
    { x: e.to.x - r, y: e.to.y },
    e.toVect,
    e.to
  ), g = { x: l.x + c, y: l.y + d };
  return D(
    [t, n, a, g, l, o],
    e.roundness
  );
}, Dt = (e) => {
  const t = e.hasSourceArrow ? f(
    { x: e.arrowLength, y: w.y },
    e.fromVect,
    w
  ) : w, o = e.hasTargetArrow ? f(
    { x: e.to.x - e.arrowLength, y: e.to.y },
    e.toVect,
    e.to
  ) : e.to, r = e.arrowLength + e.arrowOffset, n = f({ x: r, y: w.y }, e.fromVect, w), h = f(
    { x: e.to.x - r, y: e.to.y },
    e.toVect,
    e.to
  );
  return D([t, n, h, o], e.roundness);
}, bt = (e) => {
  const t = e.hasSourceArrow ? f(
    { x: e.arrowLength, y: w.y },
    e.fromVect,
    w
  ) : w, o = e.hasTargetArrow ? f(
    { x: e.to.x - e.arrowLength, y: e.to.y },
    e.toVect,
    e.to
  ) : e.to, r = e.arrowLength + e.arrowOffset, n = r - e.roundness, h = f({ x: n, y: w.y }, e.fromVect, w), s = f(
    { x: e.to.x - n, y: e.to.y },
    e.toVect,
    e.to
  ), c = Math.max((h.y + s.y) / 2, r), d = e.to.x / 2, a = { x: h.x, y: e.flipY > 0 ? c : -r }, l = { x: d, y: a.y }, g = {
    x: s.x,
    y: e.flipY > 0 ? e.to.y - c : e.to.y + r
  }, y = { x: d, y: g.y };
  return D(
    [t, h, a, l, y, g, s, o],
    e.roundness
  );
}, H = (e) => {
  const t = e.arrowOffset, o = e.side, r = e.arrowLength + t, n = r + 2 * o, s = [
    { x: e.arrowLength, y: w.y },
    { x: r, y: w.y },
    { x: r, y: e.side },
    { x: n, y: e.side },
    { x: n, y: -e.side },
    { x: r, y: -e.side },
    { x: r, y: w.y },
    { x: e.arrowLength, y: w.y }
  ].map(
    (d) => f(d, e.fromVect, w)
  ), c = `M ${w.x} ${w.y} L ${s[0].x} ${s[0].y} `;
  return `${e.hasSourceArrow || e.hasTargetArrow ? "" : c}${D(s, e.roundness)}`;
}, Ct = (e) => {
  const t = e.smallRadius, o = e.radius, r = Math.sqrt(t * t + o * o), n = t + o, h = e.arrowLength + r * (1 - o / n), s = t * o / n, d = [
    { x: e.arrowLength, y: w.y },
    { x: h, y: s },
    { x: h, y: -s }
  ].map((g) => f(g, e.fromVect, w)), a = [
    `M ${d[0].x} ${d[0].y}`,
    `A ${t} ${t} 0 0 1 ${d[1].x} ${d[1].y}`,
    `A ${o} ${o} 0 1 0 ${d[2].x} ${d[2].y}`,
    `A ${t} ${t} 0 0 1 ${d[0].x} ${d[0].y}`
  ].join(" "), l = `M 0 0 L ${d[0].x} ${d[0].y} `;
  return `${e.hasSourceArrow || e.hasTargetArrow ? "" : l}${a}`;
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
class $t {
  constructor(t) {
    i(this, "svg", F());
    i(this, "group", I());
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
    this.arrowLength = (t == null ? void 0 : t.arrowLength) ?? u.arrowLength, this.arrowWidth = (t == null ? void 0 : t.arrowWidth) ?? u.arrowWidth, this.curvature = (t == null ? void 0 : t.curvature) ?? u.curvature, this.portCycleRadius = (t == null ? void 0 : t.cycleRadius) ?? u.cycleRadius, this.portCycleSmallRadius = (t == null ? void 0 : t.smallCycleRadius) ?? u.smallCycleRadius, this.detourDirection = (t == null ? void 0 : t.detourDirection) ?? u.detourDirection, this.detourDistance = (t == null ? void 0 : t.detourDistance) ?? u.detourDistance, this.hasSourceArrow = (t == null ? void 0 : t.hasSourceArrow) ?? u.hasSourceArrow, this.hasTargetArrow = (t == null ? void 0 : t.hasTargetArrow) ?? u.hasTargetArrow;
    const o = (t == null ? void 0 : t.color) ?? u.color, r = (t == null ? void 0 : t.width) ?? u.width;
    this.svg.appendChild(this.group), this.line = R(o, r), this.group.appendChild(this.line), this.hasSourceArrow && (this.sourceArrow = M(o), this.group.appendChild(this.sourceArrow)), this.hasTargetArrow && (this.targetArrow = M(o), this.group.appendChild(this.targetArrow));
  }
  render(t) {
    const { x: o, y: r, width: n, height: h, flipX: s, flipY: c } = k(
      t.from,
      t.to
    );
    this.svg.style.transform = `translate(${o}px, ${r}px)`, this.svg.style.width = `${n}px`, this.svg.style.height = `${h}px`, this.group.style.transform = `scale(${s}, ${c})`;
    const d = p(
      t.from.direction,
      s,
      c
    ), a = p(t.to.direction, s, c), l = {
      x: n,
      y: h
    };
    let g, y = a, x = -this.arrowLength;
    if (t.from.portId === t.to.portId ? (g = Ct({
      fromVect: d,
      radius: this.portCycleRadius,
      smallRadius: this.portCycleSmallRadius,
      arrowLength: this.arrowLength,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), y = d, x = this.arrowLength) : t.from.nodeId === t.to.nodeId ? g = Lt({
      to: l,
      fromVect: d,
      toVect: a,
      flipX: s,
      flipY: c,
      arrowLength: this.arrowLength,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      curvature: this.curvature,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }) : g = Pt({
      to: l,
      fromVect: d,
      toVect: a,
      arrowLength: this.arrowLength,
      curvature: this.curvature,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), this.line.setAttribute("d", g), this.sourceArrow) {
      const v = N(
        d,
        w,
        this.arrowLength,
        this.arrowWidth
      );
      this.sourceArrow.setAttribute("d", v);
    }
    if (this.targetArrow) {
      const v = N(
        y,
        l,
        x,
        this.arrowWidth
      );
      this.targetArrow.setAttribute("d", v);
    }
  }
}
class Wt {
  constructor(t) {
    i(this, "svg", F());
    i(this, "group", I());
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
    this.arrowLength = (t == null ? void 0 : t.arrowLength) ?? u.arrowLength, this.arrowWidth = (t == null ? void 0 : t.arrowWidth) ?? u.arrowWidth, this.arrowOffset = (t == null ? void 0 : t.arrowOffset) ?? u.arrowOffset, this.cycleSquareSide = (t == null ? void 0 : t.cycleSquareSide) ?? u.cycleSquareSide;
    const o = (t == null ? void 0 : t.roundness) ?? u.roundness;
    this.roundness = Math.min(
      o,
      this.arrowOffset,
      this.cycleSquareSide / 2
    ), this.detourDirection = (t == null ? void 0 : t.detourDirection) ?? u.detourDirection, this.detourDistance = (t == null ? void 0 : t.detourDistance) ?? u.detourDistance, this.hasSourceArrow = (t == null ? void 0 : t.hasSourceArrow) ?? u.hasSourceArrow, this.hasTargetArrow = (t == null ? void 0 : t.hasTargetArrow) ?? u.hasTargetArrow;
    const r = (t == null ? void 0 : t.color) ?? u.color, n = (t == null ? void 0 : t.width) ?? u.width;
    this.svg.appendChild(this.group), this.line = R(r, n), this.group.appendChild(this.line), this.hasSourceArrow && (this.sourceArrow = M(r), this.group.appendChild(this.sourceArrow)), this.hasTargetArrow && (this.targetArrow = M(r), this.group.appendChild(this.targetArrow));
  }
  render(t) {
    const { x: o, y: r, width: n, height: h, flipX: s, flipY: c } = k(
      t.from,
      t.to
    );
    this.svg.style.transform = `translate(${o}px, ${r}px)`, this.svg.style.width = `${n}px`, this.svg.style.height = `${h}px`, this.group.style.transform = `scale(${s}, ${c})`;
    const d = p(
      t.from.direction,
      s,
      c
    ), a = p(t.to.direction, s, c), l = {
      x: n,
      y: h
    };
    let g, y = a, x = -this.arrowLength;
    if (t.from.portId === t.to.portId ? (g = H({
      fromVect: d,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), y = d, x = this.arrowLength) : t.from.nodeId === t.to.nodeId ? g = B({
      to: l,
      fromVect: d,
      toVect: a,
      flipX: s,
      flipY: c,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }) : g = mt({
      to: l,
      fromVect: d,
      toVect: a,
      flipX: s,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), this.line.setAttribute("d", g), this.sourceArrow) {
      const v = N(
        d,
        w,
        this.arrowLength,
        this.arrowWidth
      );
      this.sourceArrow.setAttribute("d", v);
    }
    if (this.targetArrow) {
      const v = N(
        y,
        l,
        x,
        this.arrowWidth
      );
      this.targetArrow.setAttribute("d", v);
    }
  }
}
class Ft {
  constructor(t) {
    i(this, "svg", F());
    i(this, "group", I());
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
    this.arrowLength = (t == null ? void 0 : t.arrowLength) ?? u.arrowLength, this.arrowWidth = (t == null ? void 0 : t.arrowWidth) ?? u.arrowWidth, this.arrowOffset = (t == null ? void 0 : t.arrowOffset) ?? u.arrowOffset, this.cycleSquareSide = (t == null ? void 0 : t.cycleSquareSide) ?? u.cycleSquareSide;
    const o = (t == null ? void 0 : t.roundness) ?? u.roundness;
    this.roundness = Math.min(
      o,
      this.arrowOffset,
      this.cycleSquareSide / 2
    ), this.detourDirection = (t == null ? void 0 : t.detourDirection) ?? u.detourDirection, this.detourDistance = (t == null ? void 0 : t.detourDistance) ?? u.detourDistance, this.hasSourceArrow = (t == null ? void 0 : t.hasSourceArrow) ?? u.hasSourceArrow, this.hasTargetArrow = (t == null ? void 0 : t.hasTargetArrow) ?? u.hasTargetArrow;
    const r = (t == null ? void 0 : t.color) ?? u.color, n = (t == null ? void 0 : t.width) ?? u.width;
    this.svg.appendChild(this.group), this.line = R(r, n), this.group.appendChild(this.line), this.hasSourceArrow && (this.sourceArrow = M(r), this.group.appendChild(this.sourceArrow)), this.hasTargetArrow && (this.targetArrow = M(r), this.group.appendChild(this.targetArrow));
  }
  render(t) {
    const { x: o, y: r, width: n, height: h, flipX: s, flipY: c } = k(
      t.from,
      t.to
    );
    this.svg.style.transform = `translate(${o}px, ${r}px)`, this.svg.style.width = `${n}px`, this.svg.style.height = `${h}px`, this.group.style.transform = `scale(${s}, ${c})`;
    const d = p(
      t.from.direction,
      s,
      c
    ), a = p(t.to.direction, s, c), l = {
      x: n,
      y: h
    };
    let g, y = a, x = -this.arrowLength;
    if (t.from.portId === t.to.portId ? (g = H({
      fromVect: d,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), y = d, x = this.arrowLength) : t.from.nodeId === t.to.nodeId ? g = B({
      to: l,
      fromVect: d,
      toVect: a,
      flipX: s,
      flipY: c,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }) : g = Dt({
      to: l,
      fromVect: d,
      toVect: a,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), this.line.setAttribute("d", g), this.sourceArrow) {
      const v = N(
        d,
        w,
        this.arrowLength,
        this.arrowWidth
      );
      this.sourceArrow.setAttribute("d", v);
    }
    if (this.targetArrow) {
      const v = N(
        y,
        l,
        x,
        this.arrowWidth
      );
      this.targetArrow.setAttribute("d", v);
    }
  }
}
class It {
  constructor(t) {
    i(this, "svg", F());
    i(this, "group", I());
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
    this.arrowLength = (t == null ? void 0 : t.arrowLength) ?? u.arrowLength, this.arrowWidth = (t == null ? void 0 : t.arrowWidth) ?? u.arrowWidth, this.arrowOffset = (t == null ? void 0 : t.arrowOffset) ?? u.arrowOffset, this.cycleSquareSide = (t == null ? void 0 : t.cycleSquareSide) ?? u.cycleSquareSide;
    const o = (t == null ? void 0 : t.roundness) ?? u.roundness;
    this.roundness = Math.min(
      o,
      this.arrowOffset,
      this.cycleSquareSide / 2
    ), this.detourDirection = (t == null ? void 0 : t.detourDirection) ?? u.detourDirectionVertical, this.detourDistance = (t == null ? void 0 : t.detourDistance) ?? u.detourDistance, this.hasSourceArrow = (t == null ? void 0 : t.hasSourceArrow) ?? u.hasSourceArrow, this.hasTargetArrow = (t == null ? void 0 : t.hasTargetArrow) ?? u.hasTargetArrow;
    const r = (t == null ? void 0 : t.color) ?? u.color, n = (t == null ? void 0 : t.width) ?? u.width;
    this.svg.appendChild(this.group), this.line = R(r, n), this.group.appendChild(this.line), this.hasSourceArrow && (this.sourceArrow = M(r), this.group.appendChild(this.sourceArrow)), this.hasTargetArrow && (this.targetArrow = M(r), this.group.appendChild(this.targetArrow));
  }
  render(t) {
    const { x: o, y: r, width: n, height: h, flipX: s, flipY: c } = k(
      t.from,
      t.to
    );
    this.svg.style.transform = `translate(${o}px, ${r}px)`, this.svg.style.width = `${n}px`, this.svg.style.height = `${h}px`, this.group.style.transform = `scale(${s}, ${c})`;
    const d = p(
      t.from.direction,
      s,
      c
    ), a = p(t.to.direction, s, c), l = {
      x: n,
      y: h
    };
    let g, y = a, x = -this.arrowLength;
    if (t.from.portId === t.to.portId ? (g = H({
      fromVect: d,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), y = d, x = this.arrowLength) : t.from.nodeId === t.to.nodeId ? g = B({
      to: l,
      fromVect: d,
      toVect: a,
      flipX: s,
      flipY: c,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }) : g = bt({
      to: l,
      fromVect: d,
      toVect: a,
      flipY: c,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), this.line.setAttribute("d", g), this.sourceArrow) {
      const v = N(
        d,
        w,
        this.arrowLength,
        this.arrowWidth
      );
      this.sourceArrow.setAttribute("d", v);
    }
    if (this.targetArrow) {
      const v = N(
        y,
        l,
        x,
        this.arrowWidth
      );
      this.targetArrow.setAttribute("d", v);
    }
  }
}
const Rt = (e) => {
  if (typeof e == "function")
    return e;
  switch (e == null ? void 0 : e.type) {
    case "straight":
      return () => new Ft({
        color: e.color,
        width: e.width,
        arrowLength: e.arrowLength,
        arrowWidth: e.arrowWidth,
        arrowOffset: e.arrowOffset,
        hasSourceArrow: e.hasSourceArrow,
        hasTargetArrow: e.hasTargetArrow,
        cycleSquareSide: e.cycleSquareSide,
        roundness: e.roundness,
        detourDistance: e.detourDistance,
        detourDirection: e.detourDirection
      });
    case "horizontal":
      return () => new Wt({
        color: e.color,
        width: e.width,
        arrowLength: e.arrowLength,
        arrowWidth: e.arrowWidth,
        arrowOffset: e.arrowOffset,
        hasSourceArrow: e.hasSourceArrow,
        hasTargetArrow: e.hasTargetArrow,
        cycleSquareSide: e.cycleSquareSide,
        roundness: e.roundness,
        detourDistance: e.detourDistance,
        detourDirection: e.detourDirection
      });
    case "vertical":
      return () => new It({
        color: e.color,
        width: e.width,
        arrowLength: e.arrowLength,
        arrowWidth: e.arrowWidth,
        arrowOffset: e.arrowOffset,
        hasSourceArrow: e.hasSourceArrow,
        hasTargetArrow: e.hasTargetArrow,
        cycleSquareSide: e.cycleSquareSide,
        roundness: e.roundness,
        detourDistance: e.detourDistance,
        detourDirection: e.detourDirection
      });
    default:
      return () => new $t({
        color: e.color,
        width: e.width,
        arrowLength: e.arrowLength,
        arrowWidth: e.arrowWidth,
        hasSourceArrow: e.hasSourceArrow,
        hasTargetArrow: e.hasTargetArrow,
        cycleRadius: e.cycleRadius,
        smallCycleRadius: e.smallCycleRadius,
        curvature: e.curvature,
        detourDistance: e.detourDistance,
        detourDirection: e.detourDirection
      });
  }
}, kt = (e) => {
  var o, r, n, h, s;
  const t = Vt(
    (o = e == null ? void 0 : e.nodes) == null ? void 0 : o.priority,
    (r = e == null ? void 0 : e.edges) == null ? void 0 : r.priority
  );
  return {
    nodes: {
      centerFn: ((n = e == null ? void 0 : e.nodes) == null ? void 0 : n.centerFn) ?? Nt,
      priorityFn: t.nodesPriorityFn
    },
    ports: {
      direction: ((h = e == null ? void 0 : e.ports) == null ? void 0 : h.direction) ?? 0
    },
    edges: {
      shapeFactory: Rt(((s = e == null ? void 0 : e.edges) == null ? void 0 : s.shape) ?? {}),
      priorityFn: t.edgesPriorityFn
    }
  };
};
class zt {
  constructor(t, o) {
    i(this, "nodeIdGenerator", new Y(
      (t) => this.graph.getNode(t) !== null
    ));
    i(this, "portIdGenerator", new Y(
      (t) => this.graph.getPort(t) !== null
    ));
    i(this, "edgeIdGenerator", new Y(
      (t) => this.graph.getEdge(t) !== null
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
    this.controller = t, this.defaults = kt(o), this.graph = t.graph, this.viewport = t.viewport;
  }
  /**
   * attaches canvas to given element
   * detaches element first when canvas is attached
   */
  attach(t) {
    return this.controller.attach(t), this;
  }
  /**
   * detaches canvas from element when attached
   */
  detach() {
    return this.controller.detach(), this;
  }
  /**
   * adds node to graph
   */
  addNode(t) {
    const o = this.nodeIdGenerator.create(t.id);
    if (this.graph.getNode(o) !== null)
      throw new E("failed to add node with existing id");
    return this.controller.addNode({
      id: o,
      element: t.element,
      x: t.x,
      y: t.y,
      centerFn: t.centerFn ?? this.defaults.nodes.centerFn,
      priority: t.priority ?? this.defaults.nodes.priorityFn()
    }), Array.from(t.ports ?? []).forEach((r) => {
      this.markPort({
        id: r.id,
        element: r.element,
        nodeId: o,
        direction: r.direction
      });
    }), this;
  }
  /**
   * updates node parameters
   */
  updateNode(t, o) {
    if (this.graph.getNode(t) === null)
      throw new E("failed to update nonexisting node");
    return this.controller.updateNode(t, o ?? {}), this;
  }
  /**
   * removes node from graph
   * all the ports of node get unmarked
   * all the edges adjacent to node get removed
   */
  removeNode(t) {
    if (this.graph.getNode(t) === null)
      throw new E("failed to remove nonexisting node");
    return this.controller.removeNode(t), this;
  }
  /**
   * marks element as port of node
   */
  markPort(t) {
    const o = this.portIdGenerator.create(t.id);
    if (this.graph.getPort(o) !== null)
      throw new E("failed to add port with existing id");
    if (this.graph.getNode(t.nodeId) === null)
      throw new E("failed to set port on nonexisting node");
    return this.controller.markPort({
      id: o,
      element: t.element,
      nodeId: t.nodeId,
      direction: t.direction ?? this.defaults.ports.direction
    }), this;
  }
  /**
   * updates port and attached edges
   */
  updatePort(t, o) {
    if (this.graph.getPort(t) === null)
      throw new E("failed to unset nonexisting port");
    return this.controller.updatePort(t, o ?? {}), this;
  }
  /**
   * ummarks element as port of node
   * all the edges adjacent to port get removed
   */
  unmarkPort(t) {
    if (this.graph.getPort(t) === null)
      throw new E("failed to unset nonexisting port");
    return this.controller.unmarkPort(t), this;
  }
  /**
   * adds edge to graph
   */
  addEdge(t) {
    const o = this.edgeIdGenerator.create(t.id);
    if (this.graph.getEdge(o) !== null)
      throw new E("failed to add edge with existing id");
    if (this.graph.getPort(t.from) === null)
      throw new E("failed to add edge from nonexisting port");
    if (this.graph.getPort(t.to) === null)
      throw new E("failed to add edge to nonexisting port");
    return this.controller.addEdge({
      id: o,
      from: t.from,
      to: t.to,
      shape: t.shape ?? this.defaults.edges.shapeFactory(),
      priority: t.priority ?? this.defaults.edges.priorityFn()
    }), this;
  }
  /**
   * updates edge
   */
  updateEdge(t, o) {
    if (this.graph.getEdge(t) === null)
      throw new E("failed to update nonexisting edge");
    return this.controller.updateEdge(t, o ?? {}), this;
  }
  /**
   * removes edge from graph
   */
  removeEdge(t) {
    if (this.graph.getEdge(t) === null)
      throw new E("failed to remove nonexisting edge");
    return this.controller.removeEdge(t), this;
  }
  /**
   * applies transformation for viewport
   */
  patchViewportMatrix(t) {
    return this.controller.patchViewportMatrix(t), this;
  }
  /**
   * applies transformation for content
   */
  patchContentMatrix(t) {
    return this.controller.patchContentMatrix(t), this;
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
class Yt {
  constructor() {
    i(this, "nodes", /* @__PURE__ */ new Map());
    i(this, "ports", /* @__PURE__ */ new Map());
    i(this, "nodePorts", /* @__PURE__ */ new Map());
    i(this, "portNodeId", /* @__PURE__ */ new Map());
    i(this, "edges", /* @__PURE__ */ new Map());
    i(this, "incommingEdges", /* @__PURE__ */ new Map());
    i(this, "outcommingEdges", /* @__PURE__ */ new Map());
    i(this, "cycleEdges", /* @__PURE__ */ new Map());
  }
  addNode(t) {
    this.nodes.set(t.id, {
      element: t.element,
      x: t.x,
      y: t.y,
      centerFn: t.centerFn,
      priority: t.priority
    }), this.nodePorts.set(t.id, /* @__PURE__ */ new Map());
  }
  getAllNodeIds() {
    return Array.from(this.nodes.keys());
  }
  getNode(t) {
    return this.nodes.get(t);
  }
  removeNode(t) {
    this.nodes.delete(t), this.nodePorts.delete(t);
  }
  addPort(t) {
    this.ports.set(t.id, {
      element: t.element,
      direction: t.direction
    }), this.cycleEdges.set(t.id, /* @__PURE__ */ new Set()), this.incommingEdges.set(t.id, /* @__PURE__ */ new Set()), this.outcommingEdges.set(t.id, /* @__PURE__ */ new Set()), this.portNodeId.set(t.id, t.nodeId), this.nodePorts.get(t.nodeId).set(t.id, t.element);
  }
  getPort(t) {
    return this.ports.get(t);
  }
  getAllPortIds() {
    return Array.from(this.ports.keys());
  }
  getNodePortIds(t) {
    const o = this.nodePorts.get(t);
    if (o !== void 0)
      return Array.from(o.keys());
  }
  getPortNodeId(t) {
    return this.portNodeId.get(t);
  }
  removePort(t) {
    const o = this.portNodeId.get(t);
    this.portNodeId.delete(t), this.nodePorts.get(o).delete(t), this.ports.delete(t);
  }
  addEdge(t) {
    this.edges.set(t.id, {
      from: t.from,
      to: t.to,
      shape: t.shape,
      priority: t.priority
    }), t.from !== t.to ? (this.outcommingEdges.get(t.from).add(t.id), this.incommingEdges.get(t.to).add(t.id)) : this.cycleEdges.get(t.from).add(t.id);
  }
  updateEdgeFrom(t, o) {
    const r = this.edges.get(t);
    this.removeEdge(t), this.addEdge({
      id: t,
      from: o,
      to: r.to,
      shape: r.shape,
      priority: r.priority
    });
  }
  updateEdgeTo(t, o) {
    const r = this.edges.get(t);
    this.removeEdge(t), this.addEdge({
      id: t,
      from: r.from,
      to: o,
      shape: r.shape,
      priority: r.priority
    });
  }
  getAllEdgeIds() {
    return Array.from(this.edges.keys());
  }
  getEdge(t) {
    return this.edges.get(t);
  }
  removeEdge(t) {
    const o = this.edges.get(t), r = o.from, n = o.to;
    this.cycleEdges.get(r).delete(t), this.cycleEdges.get(n).delete(t), this.incommingEdges.get(r).delete(t), this.incommingEdges.get(n).delete(t), this.outcommingEdges.get(r).delete(t), this.outcommingEdges.get(n).delete(t), this.edges.delete(t);
  }
  clear() {
    this.edges.clear(), this.incommingEdges.clear(), this.outcommingEdges.clear(), this.cycleEdges.clear(), this.ports.clear(), this.nodePorts.clear(), this.portNodeId.clear(), this.nodes.clear();
  }
  getPortIncomingEdgeIds(t) {
    return Array.from(this.incommingEdges.get(t));
  }
  getPortOutcomingEdgeIds(t) {
    return Array.from(this.outcommingEdges.get(t));
  }
  getPortCycleEdgeIds(t) {
    return Array.from(this.cycleEdges.get(t));
  }
  getPortAdjacentEdgeIds(t) {
    return [
      ...this.getPortIncomingEdgeIds(t),
      ...this.getPortOutcomingEdgeIds(t),
      ...this.getPortCycleEdgeIds(t)
    ];
  }
  getNodeIncomingEdgeIds(t) {
    const o = Array.from(this.nodePorts.get(t).keys());
    let r = [];
    return o.forEach((n) => {
      r = [...r, ...this.getPortIncomingEdgeIds(n)];
    }), r;
  }
  getNodeOutcomingEdgeIds(t) {
    const o = Array.from(this.nodePorts.get(t).keys());
    let r = [];
    return o.forEach((n) => {
      r = [...r, ...this.getPortOutcomingEdgeIds(n)];
    }), r;
  }
  getNodeCycleEdgeIds(t) {
    const o = Array.from(this.nodePorts.get(t).keys());
    let r = [];
    return o.forEach((n) => {
      r = [...r, ...this.getPortCycleEdgeIds(n)];
    }), r;
  }
  getNodeAdjacentEdgeIds(t) {
    return [
      ...this.getNodeIncomingEdgeIds(t),
      ...this.getNodeOutcomingEdgeIds(t),
      ...this.getNodeCycleEdgeIds(t)
    ];
  }
}
class Bt {
  constructor() {
    i(this, "canvasDefaults", {});
    i(this, "dragOptions");
    i(this, "transformOptions");
    i(this, "virtualScrollOptions");
    i(this, "hasDraggableNode", !1);
    i(this, "hasTransformableViewport", !1);
    i(this, "hasResizeReactiveNodes", !1);
    i(this, "boxRenderingTrigger");
  }
  /**
   * specifies default values for graph entities
   */
  setDefaults(t) {
    return this.canvasDefaults = t, this;
  }
  /**
   * @deprecated
   * use setDefaults instead
   */
  setOptions(t) {
    return this.setDefaults(t), this;
  }
  /**
   * enables nodes draggable by user
   */
  enableUserDraggableNodes(t) {
    return this.hasDraggableNode = !0, this.dragOptions = t, this;
  }
  /**
   * enables viewport transformable by user
   */
  enableUserTransformableViewport(t) {
    return this.hasTransformableViewport = !0, this.transformOptions = t, this;
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
  enableBoxAreaRendering(t) {
    return this.boxRenderingTrigger = t, this;
  }
  enableVirtualScroll(t) {
    return this.virtualScrollOptions = t, this;
  }
  /**
   * builds final canvas
   */
  build() {
    let t = this.boxRenderingTrigger;
    this.virtualScrollOptions !== void 0 && t === void 0 && (t = new O());
    const o = new Yt(), r = new rt();
    let n = new At(o, r);
    t !== void 0 && (n = new pt(n, o, t));
    let h = new nt(
      o,
      r,
      n
    );
    this.hasResizeReactiveNodes && (h = new vt(h)), this.hasDraggableNode && (h = new ct(
      h,
      this.dragOptions
    )), this.virtualScrollOptions !== void 0 ? h = new ft(
      h,
      t,
      this.transformOptions,
      this.virtualScrollOptions
    ) : this.hasTransformableViewport && (h = new q(
      h,
      this.transformOptions
    ));
    const s = new zt(h, this.canvasDefaults);
    return this.reset(), s;
  }
  reset() {
    this.canvasDefaults = {}, this.dragOptions = void 0, this.transformOptions = void 0, this.virtualScrollOptions = void 0, this.hasDraggableNode = !1, this.hasTransformableViewport = !1, this.hasResizeReactiveNodes = !1, this.boxRenderingTrigger = void 0;
  }
}
export {
  $t as BezierEdgeShape,
  Bt as CanvasBuilder,
  O as EventSubject,
  Wt as HorizontalEdgeShape,
  E as HtmlGraphError,
  Ft as StraightEdgeShape,
  It as VerticalEdgeShape
};
