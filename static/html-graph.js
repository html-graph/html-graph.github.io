var he = Object.defineProperty;
var de = (t, e, o) => e in t ? he(t, e, { enumerable: !0, configurable: !0, writable: !0, value: o }) : t[e] = o;
var i = (t, e, o) => de(t, typeof e != "symbol" ? e + "" : e, o);
const ce = () => {
  const t = document.createElement("div");
  return t.style.position = "absolute", t.style.top = "0", t.style.left = "0", t.style.width = "0", t.style.height = "0", t;
}, ae = () => {
  const t = document.createElement("div");
  return t.style.position = "absolute", t.style.top = "0", t.style.left = "0", t.style.visibility = "hidden", t;
}, le = () => {
  const t = document.createElement("div");
  return t.style.width = "100%", t.style.height = "100%", t.style.position = "relative", t.style.overflow = "hidden", t;
};
class re {
  constructor(e, o, r) {
    i(this, "host", le());
    i(this, "container", ce());
    i(this, "nodeIdToWrapperElementMap", /* @__PURE__ */ new Map());
    i(this, "edgeIdToElementMap", /* @__PURE__ */ new Map());
    i(this, "applyTransform", () => {
      const e = this.viewportStore.getContentMatrix();
      this.container.style.transform = `matrix(${e.scale}, 0, 0, ${e.scale}, ${e.x}, ${e.y})`;
    });
    this.graphStore = e, this.viewportStore = o, this.element = r, this.element.appendChild(this.host), this.host.appendChild(this.container), this.viewportStore.onAfterUpdated.subscribe(this.applyTransform);
  }
  attachNode(e) {
    const o = this.graphStore.getNode(e), r = ae();
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
    const o = this.nodeIdToWrapperElementMap.get(e), r = this.graphStore.getNode(e), { width: s, height: h } = r.element.getBoundingClientRect(), n = this.viewportStore.getViewportMatrix().scale, d = r.centerFn(s, h), c = r.x - n * d.x, a = r.y - n * d.y;
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
    const o = this.graphStore.getEdge(e), r = this.graphStore.getPort(o.from), s = this.graphStore.getPort(o.to), h = r.element.getBoundingClientRect(), n = s.element.getBoundingClientRect(), d = this.host.getBoundingClientRect(), c = this.viewportStore.getViewportMatrix(), a = h.left - d.left, l = h.top - d.top, g = n.left - d.left, y = n.top - d.top, p = {
      x: c.scale * a + c.x,
      y: c.scale * l + c.y
    }, f = {
      x: c.scale * g + c.x,
      y: c.scale * y + c.y
    }, E = {
      x: p.x,
      y: p.y,
      width: h.width * c.scale,
      height: h.height * c.scale,
      direction: r.direction,
      portId: o.from,
      nodeId: r.nodeId
    }, x = {
      x: f.x,
      y: f.y,
      width: n.width * c.scale,
      height: n.height * c.scale,
      direction: s.direction,
      portId: o.to,
      nodeId: s.nodeId
    };
    o.shape.render({ from: E, to: x });
  }
  updateEdgePriority(e) {
    const o = this.graphStore.getEdge(e);
    o.shape.svg.style.zIndex = `${o.priority}`;
  }
}
class ge {
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
    const o = this.graphStore.getEdge(e), r = this.graphStore.getPort(o.from).nodeId, s = this.graphStore.getPort(o.to).nodeId, h = this.graphStore.getNode(r), n = this.graphStore.getNode(s), d = Math.min(h.x, n.x), c = Math.max(h.x, n.x), a = Math.min(h.y, n.y), l = Math.max(h.y, n.y);
    return d <= this.xTo && c >= this.xFrom && a <= this.yTo && l >= this.yFrom;
  }
}
class ue {
  constructor(e, o, r) {
    i(this, "attachedNodes", /* @__PURE__ */ new Set());
    i(this, "attachedEdges", /* @__PURE__ */ new Set());
    i(this, "renderingBox");
    i(this, "updateViewport", (e) => {
      this.renderingBox.setRenderingBox(e);
      const o = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set();
      this.graphStore.getAllNodeIds().forEach((n) => {
        const d = this.renderingBox.hasNode(n), c = this.attachedNodes.has(n);
        d && !c ? o.add(n) : !d && c && r.add(n);
      }), this.graphStore.getAllEdgeIds().forEach((n) => {
        const d = this.renderingBox.hasEdge(n), c = this.attachedEdges.has(n), a = this.graphStore.getEdge(n), l = this.graphStore.getPort(a.from).nodeId, g = this.graphStore.getPort(a.to).nodeId;
        d && (this.renderingBox.hasNode(l) || (o.add(l), r.delete(l)), this.renderingBox.hasNode(g) || (o.add(g), r.delete(g))), d && !c ? s.add(n) : !d && c && h.add(n);
      }), h.forEach((n) => {
        this.handleDetachEdge(n);
      }), r.forEach((n) => {
        this.handleDetachNode(n);
      }), o.forEach((n) => {
        this.attachedNodes.has(n) || this.handleAttachNode(n);
      }), s.forEach((n) => {
        this.handleAttachEdge(n);
      });
    });
    this.htmlView = e, this.graphStore = o, this.trigger = r, this.renderingBox = new ge(this.graphStore), this.trigger.subscribe(this.updateViewport);
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
class ie {
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
  const t = new ie();
  return [t, t];
};
class we {
  constructor(e) {
    i(this, "onBeforeUpdated");
    i(this, "onAfterUpdated");
    this.viewportStore = e, this.onBeforeUpdated = this.viewportStore.onBeforeUpdated, this.onAfterUpdated = this.viewportStore.onAfterUpdated;
  }
  getViewportMatrix() {
    return { ...this.viewportStore.getViewportMatrix() };
  }
  getContentMatrix() {
    return { ...this.viewportStore.getContentMatrix() };
  }
}
class fe {
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
class C {
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
class S extends Error {
  constructor() {
    super(...arguments);
    i(this, "name", "HtmlGraphError");
  }
}
const ve = (t, e) => ({
  x: t / 2,
  y: e / 2
}), $ = (t) => () => t, Q = $(0), ye = () => {
  let t = 0;
  return () => t++;
}, pe = (t, e) => {
  let o = Q, r = Q;
  const s = ye();
  return t === "incremental" && (o = s), e === "incremental" && (r = s), typeof t == "number" && (o = $(t)), typeof e == "number" && (r = $(e)), typeof t == "function" && (o = t), typeof e == "function" && (r = e), {
    nodesPriorityFn: o,
    edgesPriorityFn: r
  };
}, v = (t, e, o) => ({
  x: e.x * t.x - e.y * t.y + ((1 - e.x) * o.x + e.y * o.y),
  y: e.y * t.x + e.x * t.y + ((1 - e.x) * o.y - e.y * o.x)
}), w = {
  x: 0,
  y: 0
}, xe = (t) => {
  const e = v(
    { x: t.arrowLength, y: w.y },
    t.fromVector,
    w
  ), o = v(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVector,
    t.to
  ), r = {
    x: e.x + t.fromVector.x * t.curvature,
    y: e.y + t.fromVector.y * t.curvature
  }, s = {
    x: o.x - t.toVector.x * t.curvature,
    y: o.y - t.toVector.y * t.curvature
  }, h = `M ${e.x} ${e.y} C ${r.x} ${r.y}, ${s.x} ${s.y}, ${o.x} ${o.y}`, n = t.hasSourceArrow ? "" : `M ${w.x} ${w.y} L ${e.x} ${e.y} `, d = t.hasTargetArrow ? "" : ` M ${o.x} ${o.y} L ${t.to.x} ${t.to.y}`;
  return `${n}${h}${d}`;
}, Ee = (t) => {
  const e = t.hasSourceArrow ? v(
    { x: t.arrowLength, y: w.y },
    t.fromVector,
    w
  ) : w, o = t.hasTargetArrow ? v(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVector,
    t.to
  ) : t.to, r = t.arrowLength, s = Math.cos(t.detourDirection) * t.detourDistance, h = Math.sin(t.detourDirection) * t.detourDistance, n = s * t.flipX, d = h * t.flipY, c = v(
    { x: r, y: w.y },
    t.fromVector,
    w
  ), a = {
    x: c.x + n,
    y: c.y + d
  }, l = v(
    { x: t.to.x - r, y: t.to.y },
    t.toVector,
    t.to
  ), g = {
    x: l.x + n,
    y: l.y + d
  }, y = { x: (a.x + g.x) / 2, y: (a.y + g.y) / 2 }, p = {
    x: c.x + t.curvature * t.fromVector.x,
    y: c.y + t.curvature * t.fromVector.y
  }, f = {
    x: l.x - t.curvature * t.toVector.x,
    y: l.y - t.curvature * t.toVector.y
  }, E = {
    x: c.x + n,
    y: c.y + d
  }, x = {
    x: l.x + n,
    y: l.y + d
  };
  return [
    `M ${e.x} ${e.y}`,
    `L ${c.x} ${c.y}`,
    `C ${p.x} ${p.y} ${E.x} ${E.y} ${y.x} ${y.y}`,
    `C ${x.x} ${x.y} ${f.x} ${f.y} ${l.x} ${l.y}`,
    `L ${o.x} ${o.y}`
  ].join(" ");
}, L = (t, e) => {
  const o = [];
  if (t.length > 0 && o.push(`M ${t[0].x} ${t[0].y}`), t.length === 2 && o.push(`L ${t[1].x} ${t[1].y}`), t.length > 2) {
    const r = t.length - 1;
    let s = 0, h = 0, n = 0;
    t.forEach((d, c) => {
      let a = 0, l = 0, g = 0;
      const y = c > 0, p = c < r, f = y && p;
      if (y && (a = -s, l = -h, g = n), p) {
        const V = t[c + 1];
        s = V.x - d.x, h = V.y - d.y, n = Math.sqrt(s * s + h * h);
      }
      const x = n !== 0 ? Math.min((f ? e : 0) / n, c < r - 1 ? 0.5 : 1) : 0, T = f ? { x: d.x + s * x, y: d.y + h * x } : d, m = g !== 0 ? Math.min((f ? e : 0) / g, c > 1 ? 0.5 : 1) : 0, D = f ? { x: d.x + a * m, y: d.y + l * m } : d;
      c > 0 && o.push(`L ${D.x} ${D.y}`), f && o.push(
        `C ${d.x} ${d.y} ${d.x} ${d.y} ${T.x} ${T.y}`
      );
    });
  }
  return o.join(" ");
}, Ae = (t) => {
  const e = t.hasSourceArrow ? v(
    { x: t.arrowLength, y: w.y },
    t.fromVector,
    w
  ) : w, o = t.hasTargetArrow ? v(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVector,
    t.to
  ) : t.to, r = t.arrowLength + t.arrowOffset, s = r - t.roundness, h = v(
    { x: s, y: w.y },
    t.fromVector,
    w
  ), n = v(
    { x: t.to.x - s, y: t.to.y },
    t.toVector,
    t.to
  ), d = Math.max((h.x + n.x) / 2, r), c = t.to.y / 2, a = {
    x: t.flipX > 0 ? d : -r,
    y: h.y
  }, l = { x: a.x, y: c }, g = {
    x: t.flipX > 0 ? t.to.x - d : t.to.x + r,
    y: n.y
  }, y = { x: g.x, y: c };
  return L(
    [e, h, a, l, y, g, n, o],
    t.roundness
  );
}, F = (t) => {
  const e = t.hasSourceArrow ? v(
    { x: t.arrowLength, y: w.y },
    t.fromVector,
    w
  ) : w, o = t.hasTargetArrow ? v(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVector,
    t.to
  ) : t.to, r = t.arrowLength + t.arrowOffset, s = v(
    { x: r, y: w.y },
    t.fromVector,
    w
  ), h = Math.cos(t.detourDirection) * t.detourDistance, n = Math.sin(t.detourDirection) * t.detourDistance, d = h * t.flipX, c = n * t.flipY, a = { x: s.x + d, y: s.y + c }, l = v(
    { x: t.to.x - r, y: t.to.y },
    t.toVector,
    t.to
  ), g = { x: l.x + d, y: l.y + c };
  return L(
    [e, s, a, g, l, o],
    t.roundness
  );
}, Se = (t) => {
  const e = t.hasSourceArrow ? v(
    { x: t.arrowLength, y: w.y },
    t.fromVector,
    w
  ) : w, o = t.hasTargetArrow ? v(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVector,
    t.to
  ) : t.to, r = t.arrowLength + t.arrowOffset, s = v(
    { x: r, y: w.y },
    t.fromVector,
    w
  ), h = v(
    { x: t.to.x - r, y: t.to.y },
    t.toVector,
    t.to
  );
  return L([e, s, h, o], t.roundness);
}, Te = (t) => {
  const e = t.hasSourceArrow ? v(
    { x: t.arrowLength, y: w.y },
    t.fromVector,
    w
  ) : w, o = t.hasTargetArrow ? v(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVector,
    t.to
  ) : t.to, r = t.arrowLength + t.arrowOffset, s = r - t.roundness, h = v(
    { x: s, y: w.y },
    t.fromVector,
    w
  ), n = v(
    { x: t.to.x - s, y: t.to.y },
    t.toVector,
    t.to
  ), d = Math.max((h.y + n.y) / 2, r), c = t.to.x / 2, a = {
    x: h.x,
    y: t.flipY > 0 ? d : -r
  }, l = { x: c, y: a.y }, g = {
    x: n.x,
    y: t.flipY > 0 ? t.to.y - d : t.to.y + r
  }, y = { x: c, y: g.y };
  return L(
    [e, h, a, l, y, g, n, o],
    t.roundness
  );
}, z = (t) => {
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
    (c) => v(c, t.fromVector, w)
  ), d = `M ${w.x} ${w.y} L ${n[0].x} ${n[0].y} `;
  return `${t.hasSourceArrow || t.hasTargetArrow ? "" : d}${L(n, t.roundness)}`;
}, me = (t) => {
  const e = t.smallRadius, o = t.radius, r = Math.sqrt(e * e + o * o), s = e + o, h = t.arrowLength + r * (1 - o / s), n = e * o / s, c = [
    { x: t.arrowLength, y: w.y },
    { x: h, y: n },
    { x: h, y: -n }
  ].map(
    (g) => v(g, t.fromVector, w)
  ), a = [
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
}), Z = (t, e, o, r) => {
  const h = [
    w,
    { x: o, y: r },
    { x: o, y: -r }
  ].map((a) => v(a, t, w)).map((a) => ({ x: a.x + e.x, y: a.y + e.y })), n = `M ${h[0].x} ${h[0].y}`, d = `L ${h[1].x} ${h[1].y}`, c = `L ${h[2].x} ${h[2].y}`;
  return `${n} ${d} ${c}`;
}, _ = (t) => {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("fill", t), e;
}, be = () => {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "g");
  return t.style.transformOrigin = "50% 50%", t;
}, Pe = (t, e) => {
  const o = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return o.setAttribute("stroke", t), o.setAttribute("stroke-width", `${e}`), o.setAttribute("fill", "none"), o;
}, Ne = (t, e) => {
  const o = {
    x: t.x + t.width / 2,
    y: t.y + t.height / 2
  }, r = {
    x: e.x + e.width / 2,
    y: e.y + e.height / 2
  }, s = Math.min(o.x, r.x), h = Math.min(o.y, r.y), n = Math.abs(r.x - o.x), d = Math.abs(r.y - o.y), c = o.x <= r.x ? 1 : -1, a = o.y <= r.y ? 1 : -1;
  return {
    x: s,
    y: h,
    width: n,
    height: d,
    flipX: c,
    flipY: a
  };
}, Me = () => {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  return t.style.pointerEvents = "none", t.style.position = "absolute", t.style.top = "0", t.style.left = "0", t.style.overflow = "visible", t;
}, q = (t, e, o) => ({ x: e * Math.cos(t), y: o * Math.sin(t) });
class I {
  constructor(e) {
    i(this, "svg", Me());
    i(this, "group", be());
    i(this, "line");
    i(this, "sourceArrow", null);
    i(this, "targetArrow", null);
    this.params = e, this.svg.appendChild(this.group), this.line = Pe(e.color, e.width), this.group.appendChild(this.line), e.hasSourceArrow && (this.sourceArrow = _(e.color), this.group.appendChild(this.sourceArrow)), e.hasTargetArrow && (this.targetArrow = _(e.color), this.group.appendChild(this.targetArrow));
  }
  render(e) {
    const { x: o, y: r, width: s, height: h, flipX: n, flipY: d } = Ne(
      e.from,
      e.to
    );
    this.svg.style.transform = `translate(${o}px, ${r}px)`, this.svg.style.width = `${Math.max(s, 1)}px`, this.svg.style.height = `${Math.max(h, 1)}px`, this.group.style.transform = `scale(${n}, ${d})`;
    const c = q(
      e.from.direction,
      n,
      d
    ), a = q(
      e.to.direction,
      n,
      d
    ), l = {
      x: s,
      y: h
    };
    let g, y = a, p = -this.params.arrowLength;
    if (e.from.portId === e.to.portId ? (g = this.params.createCyclePath(
      c,
      a,
      l,
      n,
      d
    ), y = c, p = this.params.arrowLength) : e.from.nodeId === e.to.nodeId ? g = this.params.createDetourPath(
      c,
      a,
      l,
      n,
      d
    ) : g = this.params.createLinePath(
      c,
      a,
      l,
      n,
      d
    ), this.line.setAttribute("d", g), this.sourceArrow) {
      const f = Z(
        c,
        w,
        this.params.arrowLength,
        this.params.arrowWidth
      );
      this.sourceArrow.setAttribute("d", f);
    }
    if (this.targetArrow) {
      const f = Z(
        y,
        l,
        p,
        this.params.arrowWidth
      );
      this.targetArrow.setAttribute("d", f);
    }
  }
}
class De {
  constructor(e) {
    i(this, "svg");
    i(this, "arrowLength");
    i(this, "arrowWidth");
    i(this, "curvature");
    i(this, "portCycleRadius");
    i(this, "portCycleSmallRadius");
    i(this, "detourDirection");
    i(this, "detourDistance");
    i(this, "hasSourceArrow");
    i(this, "hasTargetArrow");
    i(this, "genericShape");
    i(this, "createCyclePath", (e) => me({
      fromVector: e,
      radius: this.portCycleRadius,
      smallRadius: this.portCycleSmallRadius,
      arrowLength: this.arrowLength,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    i(this, "createDetourPath", (e, o, r, s, h) => Ee({
      to: r,
      fromVector: e,
      toVector: o,
      flipX: s,
      flipY: h,
      arrowLength: this.arrowLength,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      curvature: this.curvature,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    i(this, "createLinePath", (e, o, r) => xe({
      to: r,
      fromVector: e,
      toVector: o,
      arrowLength: this.arrowLength,
      curvature: this.curvature,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    this.arrowLength = (e == null ? void 0 : e.arrowLength) ?? u.arrowLength, this.arrowWidth = (e == null ? void 0 : e.arrowWidth) ?? u.arrowWidth, this.curvature = (e == null ? void 0 : e.curvature) ?? u.curvature, this.portCycleRadius = (e == null ? void 0 : e.cycleRadius) ?? u.cycleRadius, this.portCycleSmallRadius = (e == null ? void 0 : e.smallCycleRadius) ?? u.smallCycleRadius, this.detourDirection = (e == null ? void 0 : e.detourDirection) ?? u.detourDirection, this.detourDistance = (e == null ? void 0 : e.detourDistance) ?? u.detourDistance, this.hasSourceArrow = (e == null ? void 0 : e.hasSourceArrow) ?? u.hasSourceArrow, this.hasTargetArrow = (e == null ? void 0 : e.hasTargetArrow) ?? u.hasTargetArrow, this.genericShape = new I({
      color: (e == null ? void 0 : e.color) ?? u.color,
      width: (e == null ? void 0 : e.width) ?? u.width,
      arrowLength: this.arrowLength,
      arrowWidth: this.arrowWidth,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
      createCyclePath: this.createCyclePath,
      createDetourPath: this.createDetourPath,
      createLinePath: this.createLinePath
    }), this.svg = this.genericShape.svg;
  }
  render(e) {
    this.genericShape.render(e);
  }
}
class Ve {
  constructor(e) {
    i(this, "svg");
    i(this, "arrowLength");
    i(this, "arrowWidth");
    i(this, "arrowOffset");
    i(this, "roundness");
    i(this, "cycleSquareSide");
    i(this, "detourDirection");
    i(this, "detourDistance");
    i(this, "hasSourceArrow");
    i(this, "hasTargetArrow");
    i(this, "genericShape");
    i(this, "createCyclePath", (e) => z({
      fromVector: e,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    i(this, "createDetourPath", (e, o, r, s, h) => F({
      to: r,
      fromVector: e,
      toVector: o,
      flipX: s,
      flipY: h,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    i(this, "createLinePath", (e, o, r, s) => Ae({
      to: r,
      fromVector: e,
      toVector: o,
      flipX: s,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    this.arrowLength = (e == null ? void 0 : e.arrowLength) ?? u.arrowLength, this.arrowWidth = (e == null ? void 0 : e.arrowWidth) ?? u.arrowWidth, this.arrowOffset = (e == null ? void 0 : e.arrowOffset) ?? u.arrowOffset, this.cycleSquareSide = (e == null ? void 0 : e.cycleSquareSide) ?? u.cycleSquareSide;
    const o = (e == null ? void 0 : e.roundness) ?? u.roundness;
    this.roundness = Math.min(
      o,
      this.arrowOffset,
      this.cycleSquareSide / 2
    ), this.detourDirection = (e == null ? void 0 : e.detourDirection) ?? u.detourDirection, this.detourDistance = (e == null ? void 0 : e.detourDistance) ?? u.detourDistance, this.hasSourceArrow = (e == null ? void 0 : e.hasSourceArrow) ?? u.hasSourceArrow, this.hasTargetArrow = (e == null ? void 0 : e.hasTargetArrow) ?? u.hasTargetArrow, this.genericShape = new I({
      color: (e == null ? void 0 : e.color) ?? u.color,
      width: (e == null ? void 0 : e.width) ?? u.width,
      arrowLength: this.arrowLength,
      arrowWidth: this.arrowWidth,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
      createCyclePath: this.createCyclePath,
      createDetourPath: this.createDetourPath,
      createLinePath: this.createLinePath
    }), this.svg = this.genericShape.svg;
  }
  render(e) {
    this.genericShape.render(e);
  }
}
class Le {
  constructor(e) {
    i(this, "svg");
    i(this, "arrowLength");
    i(this, "arrowWidth");
    i(this, "arrowOffset");
    i(this, "roundness");
    i(this, "cycleSquareSide");
    i(this, "detourDirection");
    i(this, "detourDistance");
    i(this, "hasSourceArrow");
    i(this, "hasTargetArrow");
    i(this, "genericShape");
    i(this, "createCyclePath", (e) => z({
      fromVector: e,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    i(this, "createDetourPath", (e, o, r, s, h) => F({
      to: r,
      fromVector: e,
      toVector: o,
      flipX: s,
      flipY: h,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    i(this, "createLinePath", (e, o, r) => Se({
      to: r,
      fromVector: e,
      toVector: o,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    this.arrowLength = (e == null ? void 0 : e.arrowLength) ?? u.arrowLength, this.arrowWidth = (e == null ? void 0 : e.arrowWidth) ?? u.arrowWidth, this.arrowOffset = (e == null ? void 0 : e.arrowOffset) ?? u.arrowOffset, this.cycleSquareSide = (e == null ? void 0 : e.cycleSquareSide) ?? u.cycleSquareSide;
    const o = (e == null ? void 0 : e.roundness) ?? u.roundness;
    this.roundness = Math.min(
      o,
      this.arrowOffset,
      this.cycleSquareSide / 2
    ), this.detourDirection = (e == null ? void 0 : e.detourDirection) ?? u.detourDirection, this.detourDistance = (e == null ? void 0 : e.detourDistance) ?? u.detourDistance, this.hasSourceArrow = (e == null ? void 0 : e.hasSourceArrow) ?? u.hasSourceArrow, this.hasTargetArrow = (e == null ? void 0 : e.hasTargetArrow) ?? u.hasTargetArrow, this.genericShape = new I({
      color: (e == null ? void 0 : e.color) ?? u.color,
      width: (e == null ? void 0 : e.width) ?? u.width,
      arrowLength: this.arrowLength,
      arrowWidth: this.arrowWidth,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
      createCyclePath: this.createCyclePath,
      createDetourPath: this.createDetourPath,
      createLinePath: this.createLinePath
    }), this.svg = this.genericShape.svg;
  }
  render(e) {
    this.genericShape.render(e);
  }
}
class Re {
  constructor(e) {
    i(this, "svg");
    i(this, "arrowLength");
    i(this, "arrowWidth");
    i(this, "arrowOffset");
    i(this, "roundness");
    i(this, "cycleSquareSide");
    i(this, "detourDirection");
    i(this, "detourDistance");
    i(this, "hasSourceArrow");
    i(this, "hasTargetArrow");
    i(this, "genericShape");
    i(this, "createCyclePath", (e) => z({
      fromVector: e,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    i(this, "createDetourPath", (e, o, r, s, h) => F({
      to: r,
      fromVector: e,
      toVector: o,
      flipX: s,
      flipY: h,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    i(this, "createLinePath", (e, o, r, s, h) => Te({
      to: r,
      fromVector: e,
      toVector: o,
      flipY: h,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }));
    this.arrowLength = (e == null ? void 0 : e.arrowLength) ?? u.arrowLength, this.arrowWidth = (e == null ? void 0 : e.arrowWidth) ?? u.arrowWidth, this.arrowOffset = (e == null ? void 0 : e.arrowOffset) ?? u.arrowOffset, this.cycleSquareSide = (e == null ? void 0 : e.cycleSquareSide) ?? u.cycleSquareSide;
    const o = (e == null ? void 0 : e.roundness) ?? u.roundness;
    this.roundness = Math.min(
      o,
      this.arrowOffset,
      this.cycleSquareSide / 2
    ), this.detourDirection = (e == null ? void 0 : e.detourDirection) ?? u.detourDirectionVertical, this.detourDistance = (e == null ? void 0 : e.detourDistance) ?? u.detourDistance, this.hasSourceArrow = (e == null ? void 0 : e.hasSourceArrow) ?? u.hasSourceArrow, this.hasTargetArrow = (e == null ? void 0 : e.hasTargetArrow) ?? u.hasTargetArrow, this.genericShape = new I({
      color: (e == null ? void 0 : e.color) ?? u.color,
      width: (e == null ? void 0 : e.width) ?? u.width,
      arrowLength: this.arrowLength,
      arrowWidth: this.arrowWidth,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
      createCyclePath: this.createCyclePath,
      createDetourPath: this.createDetourPath,
      createLinePath: this.createLinePath
    }), this.svg = this.genericShape.svg;
  }
  render(e) {
    this.genericShape.render(e);
  }
}
const Be = (t) => {
  if (typeof t == "function")
    return t;
  switch (t == null ? void 0 : t.type) {
    case "straight":
      return () => new Le({
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
      return () => new Ve({
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
      return () => new Re({
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
  var o, r, s, h, n;
  const e = pe(
    (o = t == null ? void 0 : t.nodes) == null ? void 0 : o.priority,
    (r = t == null ? void 0 : t.edges) == null ? void 0 : r.priority
  );
  return {
    nodes: {
      centerFn: ((s = t == null ? void 0 : t.nodes) == null ? void 0 : s.centerFn) ?? ve,
      priorityFn: e.nodesPriorityFn
    },
    ports: {
      direction: ((h = t == null ? void 0 : t.ports) == null ? void 0 : h.direction) ?? 0
    },
    edges: {
      shapeFactory: Be(((n = t == null ? void 0 : t.edges) == null ? void 0 : n.shape) ?? {}),
      priorityFn: e.edgesPriorityFn
    }
  };
};
class se {
  constructor(e, o, r, s, h) {
    /**
     * provides api for accessing model of rendered graph
     */
    i(this, "graph");
    /**
     * provides api for accessing viewport state
     */
    i(this, "viewport");
    i(this, "defaults");
    i(this, "nodeIdGenerator", new C(
      (e) => this.graph.getNode(e) !== null
    ));
    i(this, "portIdGenerator", new C(
      (e) => this.graph.getPort(e) !== null
    ));
    i(this, "edgeIdGenerator", new C(
      (e) => this.graph.getEdge(e) !== null
    ));
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
      this.nodeIdGenerator.reset(), this.portIdGenerator.reset(), this.edgeIdGenerator.reset(), this.htmlView.clear();
    });
    i(this, "onBeforeDestroyEmitter");
    /**
     * emits event just before destruction of canvas
     */
    i(this, "onBeforeDestroy");
    this.element = e, this.graphStore = o, this.viewportStore = r, this.htmlView = s, this.defaults = Ie(h), this.graph = new fe(this.graphStore), this.viewport = new we(this.viewportStore), this.graphStore.onAfterNodeAdded.subscribe(this.onAfterNodeAdded), this.graphStore.onAfterNodeUpdated.subscribe(this.onAfterNodeUpdated), this.graphStore.onAfterNodePriorityUpdated.subscribe(
      this.onAfterNodePriorityUpdated
    ), this.graphStore.onBeforeNodeRemoved.subscribe(this.onBeforeNodeRemoved), this.graphStore.onAfterPortUpdated.subscribe(this.onAfterPortUpdated), this.graphStore.onBeforePortRemoved.subscribe(this.onBeforePortUnmarked), this.graphStore.onAfterEdgeAdded.subscribe(this.onAfterEdgeAdded), this.graphStore.onAfterEdgeShapeUpdated.subscribe(
      this.onAfterEdgeShapeUpdated
    ), this.graphStore.onAfterEdgeUpdated.subscribe(this.onAfterEdgeUpdated), this.graphStore.onAfterEdgePriorityUpdated.subscribe(
      this.onAfterEdgePriorityUpdated
    ), this.graphStore.onBeforeEdgeRemoved.subscribe(this.onBeforeEdgeRemoved), this.graphStore.onBeforeClear.subscribe(this.onBeforeClear), [this.onBeforeDestroyEmitter, this.onBeforeDestroy] = A();
  }
  /**
   * adds new node
   */
  addNode(e) {
    const o = this.nodeIdGenerator.create(e.id);
    if (this.graph.getNode(o) !== null)
      throw new S("failed to add node with existing id");
    if (this.graphStore.addNode({
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
      throw new S("failed to update non existing node");
    return this.graphStore.updateNode(e, o ?? {}), this;
  }
  /**
   * removes specified node
   * all the ports of node get unmarked
   * all the edges adjacent to node get removed
   */
  removeNode(e) {
    if (this.graph.getNode(e) === null)
      throw new S("failed to remove non existing node");
    return this.graphStore.removeNode(e), this;
  }
  /**
   * marks specified element as a port for specified node
   */
  markPort(e) {
    const o = this.portIdGenerator.create(e.id);
    if (this.graph.getPort(o) !== null)
      throw new S("failed to add port with existing id");
    if (this.graph.getNode(e.nodeId) === null)
      throw new S("failed to mark port for nonexistent node");
    return this.graphStore.addPort({
      id: o,
      element: e.element,
      nodeId: e.nodeId,
      direction: e.direction ?? this.defaults.ports.direction
    }), this;
  }
  /**
   * updates port and edges attached to it
   */
  updatePort(e, o) {
    if (this.graph.getPort(e) === null)
      throw new S("failed to update nonexistent port");
    return this.graphStore.updatePort(e, o ?? {}), this;
  }
  /**
   * unmarks specified port
   * all the edges adjacent to the port get removed
   */
  unmarkPort(e) {
    if (this.graph.getPort(e) === null)
      throw new S("failed to unmark non existing port");
    return this.graphStore.removePort(e), this;
  }
  /**
   * adds new edge
   */
  addEdge(e) {
    const o = this.edgeIdGenerator.create(e.id);
    if (this.graph.getEdge(o) !== null)
      throw new S("failed to add edge with existing id");
    if (this.graph.getPort(e.from) === null)
      throw new S("failed to add edge from nonexistent port");
    if (this.graph.getPort(e.to) === null)
      throw new S("failed to add edge to nonexistent port");
    return this.graphStore.addEdge({
      id: o,
      from: e.from,
      to: e.to,
      shape: e.shape ?? this.defaults.edges.shapeFactory(),
      priority: e.priority ?? this.defaults.edges.priorityFn()
    }), this;
  }
  /**
   * updates specified edge
   */
  updateEdge(e, o) {
    if (this.graph.getEdge(e) === null)
      throw new S("failed to update nonexistent edge");
    return this.graphStore.updateEdge(e, o ?? {}), this;
  }
  /**
   * removes specified edge
   */
  removeEdge(e) {
    if (this.graph.getEdge(e) === null)
      throw new S("failed to remove nonexistent edge");
    return this.graphStore.removeEdge(e), this;
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
   * clears canvas from nodes and edges
   * canvas gets rolled back to initial state and can be reused
   */
  clear() {
    return this.graphStore.clear(), this;
  }
  /**
   * destroys canvas
   * canvas element gets rolled back to initial state, and can not be reused
   */
  destroy() {
    this.clear(), this.onBeforeDestroyEmitter.emit(), this.graphStore.onAfterNodeAdded.unsubscribe(this.onAfterNodeAdded), this.graphStore.onAfterNodeUpdated.unsubscribe(this.onAfterNodeUpdated), this.graphStore.onAfterNodePriorityUpdated.unsubscribe(
      this.onAfterNodePriorityUpdated
    ), this.graphStore.onBeforeNodeRemoved.unsubscribe(this.onBeforeNodeRemoved), this.graphStore.onAfterPortUpdated.unsubscribe(this.onAfterPortUpdated), this.graphStore.onBeforePortRemoved.unsubscribe(this.onBeforePortUnmarked), this.graphStore.onAfterEdgeAdded.unsubscribe(this.onAfterEdgeAdded), this.graphStore.onAfterEdgeShapeUpdated.unsubscribe(
      this.onAfterEdgeShapeUpdated
    ), this.graphStore.onAfterEdgeUpdated.unsubscribe(this.onAfterEdgeUpdated), this.graphStore.onAfterEdgePriorityUpdated.unsubscribe(
      this.onAfterEdgePriorityUpdated
    ), this.graphStore.onBeforeEdgeRemoved.unsubscribe(this.onBeforeEdgeRemoved), this.graphStore.onBeforeClear.unsubscribe(this.onBeforeClear), this.htmlView.destroy();
  }
}
class ne {
  constructor() {
    i(this, "nodes", /* @__PURE__ */ new Map());
    i(this, "ports", /* @__PURE__ */ new Map());
    i(this, "edges", /* @__PURE__ */ new Map());
    i(this, "incomingEdges", /* @__PURE__ */ new Map());
    i(this, "outcomingEdges", /* @__PURE__ */ new Map());
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
    }), this.cycleEdges.set(e.id, /* @__PURE__ */ new Set()), this.incomingEdges.set(e.id, /* @__PURE__ */ new Set()), this.outcomingEdges.set(e.id, /* @__PURE__ */ new Set()), this.nodes.get(e.nodeId).ports.set(e.id, e.element), this.afterPortAddedEmitter.emit(e.id);
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
    this.beforeClearEmitter.emit(), this.incomingEdges.clear(), this.outcomingEdges.clear(), this.cycleEdges.clear(), this.edges.clear(), this.ports.clear(), this.nodes.clear();
  }
  getPortIncomingEdgeIds(e) {
    return Array.from(this.incomingEdges.get(e));
  }
  getPortOutcomingEdgeIds(e) {
    return Array.from(this.outcomingEdges.get(e));
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
    }), e.from !== e.to ? (this.outcomingEdges.get(e.from).add(e.id), this.incomingEdges.get(e.to).add(e.id)) : this.cycleEdges.get(e.from).add(e.id);
  }
  removeEdgeInternal(e) {
    const o = this.edges.get(e), r = o.from, s = o.to;
    this.cycleEdges.get(r).delete(e), this.cycleEdges.get(s).delete(e), this.incomingEdges.get(r).delete(e), this.incomingEdges.get(s).delete(e), this.outcomingEdges.get(r).delete(e), this.outcomingEdges.get(s).delete(e), this.edges.delete(e);
  }
}
const ee = (t) => ({
  scale: 1 / t.scale,
  x: -t.x / t.scale,
  y: -t.y / t.scale
}), te = {
  scale: 1,
  x: 0,
  y: 0
};
class Ue {
  constructor() {
    i(this, "viewportMatrix", te);
    i(this, "contentMatrix", te);
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
    }, this.contentMatrix = ee(this.viewportMatrix), this.afterUpdateEmitter.emit();
  }
  patchContentMatrix(e) {
    this.beforeUpdateEmitter.emit(), this.contentMatrix = {
      scale: e.scale ?? this.contentMatrix.scale,
      x: e.x ?? this.contentMatrix.x,
      y: e.y ?? this.contentMatrix.y
    }, this.viewportMatrix = ee(this.contentMatrix), this.afterUpdateEmitter.emit();
  }
}
class k {
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
    i(this, "onBeforeDestroy", () => {
      this.canvas.graph.onAfterNodeAdded.unsubscribe(this.onAfterNodeAdded), this.canvas.graph.onBeforeNodeRemoved.unsubscribe(this.onBeforeNodeRemoved), this.canvas.graph.onBeforeClear.unsubscribe(this.onBeforeClear), this.canvas.onBeforeDestroy.unsubscribe(this.onBeforeDestroy);
    });
    this.canvas = e, this.nodesResizeObserver = new ResizeObserver((o) => {
      o.forEach((r) => {
        const s = r.target;
        this.handleNodeResize(s);
      });
    }), this.canvas.graph.onAfterNodeAdded.subscribe(this.onAfterNodeAdded), this.canvas.graph.onBeforeNodeRemoved.subscribe(this.onBeforeNodeRemoved), this.canvas.graph.onBeforeClear.subscribe(this.onBeforeClear), this.canvas.onBeforeDestroy.subscribe(this.onBeforeDestroy);
  }
  static configure(e) {
    new k(e);
  }
  handleNodeResize(e) {
    const o = this.elementToNodeId.get(e);
    this.canvas.updateNode(o);
  }
}
const Ce = (t) => {
  var g, y, p, f, E, x;
  const e = ((g = t == null ? void 0 : t.events) == null ? void 0 : g.onNodeDrag) ?? (() => {
  }), o = ((y = t == null ? void 0 : t.events) == null ? void 0 : y.onBeforeNodeDrag) ?? (() => !0), r = ((p = t == null ? void 0 : t.events) == null ? void 0 : p.onNodeDragFinished) ?? (() => {
  }), s = (t == null ? void 0 : t.moveOnTop) === !1, h = (f = t == null ? void 0 : t.mouse) == null ? void 0 : f.dragCursor, n = h !== void 0 ? h : "grab", d = (E = t == null ? void 0 : t.mouse) == null ? void 0 : E.mouseDownEventVerifier, c = d !== void 0 ? d : (T) => T.button === 0, a = (x = t == null ? void 0 : t.mouse) == null ? void 0 : x.mouseUpEventVerifier;
  return {
    freezePriority: s,
    dragCursor: n,
    mouseDownEventVerifier: c,
    mouseUpEventVerifier: a !== void 0 ? a : (T) => T.button === 0,
    onNodeDrag: e,
    onBeforeNodeDrag: o,
    onNodeDragFinished: r
  };
}, We = (t, e, o) => {
  const { x: r, y: s, width: h, height: n } = t.getBoundingClientRect();
  return e >= r && e <= r + h && o >= s && o <= s + n;
}, $e = (t, e, o) => e >= 0 && e <= t.innerWidth && o >= 0 && o <= t.innerHeight, M = (t, e, o, r) => We(e, o, r) && $e(t, o, r), B = (t, e) => {
  e !== null ? t.style.cursor = e : t.style.removeProperty("cursor");
}, N = (t, e) => ({
  x: t.scale * e.x + t.x,
  y: t.scale * e.y + t.y
});
class O {
  constructor(e, o, r, s) {
    i(this, "grabbedNodeId", null);
    i(this, "maxNodePriority", 0);
    i(this, "previousTouchCoordinates", null);
    i(this, "nodeIds", /* @__PURE__ */ new Map());
    i(this, "graph");
    i(this, "onAfterNodeAdded", (e) => {
      this.updateMaxNodePriority(e);
      const o = this.graph.getNode(e);
      this.nodeIds.set(o.element, e), o.element.addEventListener("mousedown", this.onMouseDown, {
        passive: !0
      }), o.element.addEventListener("touchstart", this.onTouchStart, {
        passive: !0
      });
    });
    i(this, "onAfterNodeUpdated", (e) => {
      this.updateMaxNodePriority(e);
    });
    i(this, "onBeforeNodeRemoved", (e) => {
      const o = this.graph.getNode(e);
      this.nodeIds.delete(o.element), o.element.removeEventListener("mousedown", this.onMouseDown), o.element.removeEventListener("touchstart", this.onTouchStart);
    });
    i(this, "onBeforeDestroy", () => {
      this.graph.onAfterNodeAdded.unsubscribe(this.onAfterNodeAdded), this.graph.onAfterNodeUpdated.unsubscribe(this.onAfterNodeUpdated), this.graph.onBeforeNodeRemoved.unsubscribe(this.onBeforeNodeRemoved), this.graph.onBeforeClear.unsubscribe(this.onBeforeClear), this.canvas.onBeforeDestroy.unsubscribe(this.onBeforeDestroy), this.removeMouseDragListeners(), this.removeTouchDragListeners();
    });
    i(this, "onBeforeClear", () => {
      this.nodeIds.forEach((e, o) => {
        o.removeEventListener("mousedown", this.onMouseDown), o.removeEventListener("touchstart", this.onTouchStart);
      }), this.nodeIds.clear(), this.maxNodePriority = 0;
    });
    i(this, "onMouseDown", (e) => {
      if (!this.config.mouseDownEventVerifier(e))
        return;
      const o = e.currentTarget, r = this.nodeIds.get(o), s = this.graph.getNode(r);
      this.config.onBeforeNodeDrag({
        nodeId: r,
        element: s.element,
        x: s.x,
        y: s.y
      }) && (e.stopImmediatePropagation(), this.grabbedNodeId = r, B(this.element, this.config.dragCursor), this.moveNodeOnTop(r), this.window.addEventListener("mouseup", this.onWindowMouseUp, {
        passive: !0
      }), this.window.addEventListener("mousemove", this.onWindowMouseMove, {
        passive: !0
      }));
    });
    i(this, "onTouchStart", (e) => {
      if (e.touches.length !== 1)
        return;
      e.stopImmediatePropagation(), this.previousTouchCoordinates = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
      const o = e.currentTarget, r = this.nodeIds.get(o), s = this.graph.getNode(r);
      this.config.onBeforeNodeDrag({
        nodeId: r,
        element: s.element,
        x: s.x,
        y: s.y
      }) && (this.grabbedNodeId = r, this.moveNodeOnTop(r), this.window.addEventListener("touchmove", this.onWindowTouchMove, {
        passive: !0
      }), this.window.addEventListener("touchend", this.onWindowTouchFinish, {
        passive: !0
      }), this.window.addEventListener("touchcancel", this.onWindowTouchFinish, {
        passive: !0
      }));
    });
    i(this, "onWindowMouseMove", (e) => {
      if (!M(
        this.window,
        this.element,
        e.clientX,
        e.clientY
      )) {
        this.cancelMouseDrag();
        return;
      }
      this.grabbedNodeId !== null && this.dragNode(this.grabbedNodeId, e.movementX, e.movementY);
    });
    i(this, "onWindowMouseUp", (e) => {
      this.config.mouseUpEventVerifier(e) && this.cancelMouseDrag();
    });
    i(this, "onWindowTouchMove", (e) => {
      if (e.touches.length !== 1)
        return;
      const o = e.touches[0];
      if (!M(
        this.window,
        this.element,
        o.clientX,
        o.clientY
      )) {
        this.cancelTouchDrag();
        return;
      }
      if (this.grabbedNodeId !== null && this.previousTouchCoordinates !== null) {
        const s = o.clientX - this.previousTouchCoordinates.x, h = o.clientY - this.previousTouchCoordinates.y;
        this.dragNode(this.grabbedNodeId, s, h), this.previousTouchCoordinates = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
      }
    });
    i(this, "onWindowTouchFinish", () => {
      this.previousTouchCoordinates = null, this.cancelTouchDrag();
    });
    i(this, "config");
    this.canvas = e, this.element = o, this.window = r, this.config = Ce(s), this.graph = e.graph, this.graph.onAfterNodeAdded.subscribe(this.onAfterNodeAdded), this.graph.onAfterNodeUpdated.subscribe(this.onAfterNodeUpdated), this.graph.onBeforeNodeRemoved.subscribe(this.onBeforeNodeRemoved), this.graph.onBeforeClear.subscribe(this.onBeforeClear), this.canvas.onBeforeDestroy.subscribe(this.onBeforeDestroy);
  }
  static configure(e, o, r, s) {
    new O(e, o, r, s);
  }
  dragNode(e, o, r) {
    const s = this.graph.getNode(e);
    if (s === null)
      return;
    const h = this.canvas.viewport.getContentMatrix(), n = N(h, {
      x: s.x,
      y: s.y
    }), d = N(
      { scale: 1, x: o, y: r },
      n
    ), c = this.canvas.viewport.getViewportMatrix(), a = N(c, d);
    this.canvas.updateNode(e, { x: a.x, y: a.y }), this.config.onNodeDrag({
      nodeId: e,
      element: s.element,
      x: a.x,
      y: a.y
    });
  }
  moveNodeOnTop(e) {
    if (this.config.freezePriority)
      return;
    this.maxNodePriority += 2, this.canvas.updateNode(e, { priority: this.maxNodePriority });
    const o = this.maxNodePriority - 1;
    this.graph.getNodeAdjacentEdgeIds(e).forEach((s) => {
      this.canvas.updateEdge(s, { priority: o });
    });
  }
  cancelMouseDrag() {
    const e = this.graph.getNode(this.grabbedNodeId);
    e !== null && this.config.onNodeDragFinished({
      nodeId: this.grabbedNodeId,
      element: e.element,
      x: e.x,
      y: e.y
    }), this.grabbedNodeId = null, B(this.element, null), this.removeMouseDragListeners();
  }
  removeMouseDragListeners() {
    this.window.removeEventListener("mouseup", this.onWindowMouseUp), this.window.removeEventListener("mousemove", this.onWindowMouseMove);
  }
  cancelTouchDrag() {
    this.previousTouchCoordinates = null;
    const e = this.graph.getNode(this.grabbedNodeId);
    e !== null && this.config.onNodeDragFinished({
      nodeId: this.grabbedNodeId,
      element: e.element,
      x: e.x,
      y: e.y
    }), this.grabbedNodeId = null, this.removeTouchDragListeners();
  }
  removeTouchDragListeners() {
    this.window.removeEventListener("touchmove", this.onWindowTouchMove), this.window.removeEventListener("touchend", this.onWindowTouchFinish), this.window.removeEventListener("touchcancel", this.onWindowTouchFinish);
  }
  updateMaxNodePriority(e) {
    const o = this.graph.getNode(e).priority;
    this.maxNodePriority = Math.max(this.maxNodePriority, o);
  }
}
const Fe = (t) => {
  const e = t.minX !== null ? t.minX : -1 / 0, o = t.maxX !== null ? t.maxX : 1 / 0, r = t.minY !== null ? t.minY : -1 / 0, s = t.maxY !== null ? t.maxY : 1 / 0;
  return (h) => {
    let n = h.nextTransform.x, d = h.nextTransform.y;
    n < e && n < h.prevTransform.x && (n = Math.min(h.prevTransform.x, e));
    const c = h.canvasWidth * h.prevTransform.scale, a = o - c;
    n > a && n > h.prevTransform.x && (n = Math.max(h.prevTransform.x, a)), d < r && d < h.prevTransform.y && (d = Math.min(h.prevTransform.y, r));
    const l = h.canvasHeight * h.prevTransform.scale, g = s - l;
    return d > g && d > h.prevTransform.y && (d = Math.max(h.prevTransform.y, g)), { scale: h.nextTransform.scale, x: n, y: d };
  };
}, ze = (t) => {
  const e = t.maxContentScale, o = t.minContentScale, r = e !== null ? 1 / e : 0, s = o !== null ? 1 / o : 1 / 0;
  return (h) => {
    const n = h.prevTransform, d = h.nextTransform;
    let c = d.scale, a = d.x, l = d.y;
    if (d.scale > s && d.scale > n.scale) {
      c = Math.max(n.scale, s), a = n.x, l = n.y;
      const g = (c - n.scale) / (d.scale - n.scale);
      a = n.x + (d.x - n.x) * g, l = n.y + (d.y - n.y) * g;
    }
    if (d.scale < r && d.scale < n.scale) {
      c = Math.min(n.scale, r), a = n.x, l = n.y;
      const g = (c - n.scale) / (d.scale - n.scale);
      a = n.x + (d.x - n.x) * g, l = n.y + (d.y - n.y) * g;
    }
    return {
      scale: c,
      x: a,
      y: l
    };
  };
}, ke = (t) => (e) => t.reduce(
  (o, r) => r({
    prevTransform: e.prevTransform,
    nextTransform: o,
    canvasWidth: e.canvasWidth,
    canvasHeight: e.canvasHeight
  }),
  e.nextTransform
), oe = (t) => {
  if (typeof t == "function")
    return t;
  switch (t.type) {
    case "scale-limit":
      return ze({
        minContentScale: t.minContentScale ?? 0,
        maxContentScale: t.maxContentScale ?? 1 / 0
      });
    case "shift-limit":
      return Fe({
        minX: t.minX ?? -1 / 0,
        maxX: t.maxX ?? 1 / 0,
        minY: t.minY ?? -1 / 0,
        maxY: t.maxY ?? 1 / 0
      });
  }
}, Oe = (t) => {
  var f, E, x, T, b, m, D, V, j, G, J, K;
  const e = (f = t == null ? void 0 : t.scale) == null ? void 0 : f.mouseWheelSensitivity, o = e !== void 0 ? e : 1.2, r = t == null ? void 0 : t.transformPreprocessor;
  let s;
  r !== void 0 ? Array.isArray(r) ? s = ke(
    r.map(
      (P) => oe(P)
    )
  ) : s = oe(r) : s = (P) => P.nextTransform;
  const h = ((E = t == null ? void 0 : t.shift) == null ? void 0 : E.cursor) !== void 0 ? t.shift.cursor : "grab", n = ((x = t == null ? void 0 : t.events) == null ? void 0 : x.onBeforeTransformChange) ?? (() => {
  }), d = ((T = t == null ? void 0 : t.events) == null ? void 0 : T.onTransformChange) ?? (() => {
  }), c = (b = t == null ? void 0 : t.shift) == null ? void 0 : b.mouseDownEventVerifier, a = c !== void 0 ? c : (P) => P.button === 0, l = (m = t == null ? void 0 : t.shift) == null ? void 0 : m.mouseUpEventVerifier, g = l !== void 0 ? l : (P) => P.button === 0, y = (D = t == null ? void 0 : t.scale) == null ? void 0 : D.mouseWheelEventVerifier, p = y !== void 0 ? y : () => !0;
  return {
    wheelSensitivity: o,
    onTransformStarted: ((V = t == null ? void 0 : t.events) == null ? void 0 : V.onTransformStarted) ?? (() => {
    }),
    onTransformFinished: ((j = t == null ? void 0 : t.events) == null ? void 0 : j.onTransformFinished) ?? (() => {
    }),
    onBeforeTransformChange: n,
    onTransformChange: d,
    transformPreprocessor: s,
    shiftCursor: h,
    mouseDownEventVerifier: a,
    mouseUpEventVerifier: g,
    mouseWheelEventVerifier: p,
    scaleWheelFinishTimeout: ((G = t == null ? void 0 : t.scale) == null ? void 0 : G.wheelFinishTimeout) ?? 500,
    onResizeTransformStarted: ((J = t == null ? void 0 : t.events) == null ? void 0 : J.onResizeTransformStarted) ?? (() => {
    }),
    onResizeTransformFinished: ((K = t == null ? void 0 : t.events) == null ? void 0 : K.onResizeTransformFinished) ?? (() => {
    })
  };
}, Xe = (t, e, o) => ({
  scale: t.scale,
  x: t.x + t.scale * e,
  y: t.y + t.scale * o
}), Ye = (t, e, o, r) => ({
  scale: t.scale * e,
  x: t.scale * (1 - e) * o + t.x,
  y: t.scale * (1 - e) * r + t.y
}), R = (t) => {
  const e = [], o = t.touches.length;
  for (let d = 0; d < o; d++)
    e.push([t.touches[d].clientX, t.touches[d].clientY]);
  const r = e.reduce(
    (d, c) => [d[0] + c[0], d[1] + c[1]],
    [0, 0]
  ), s = [r[0] / o, r[1] / o], n = e.map((d) => [d[0] - s[0], d[1] - s[1]]).reduce(
    (d, c) => d + Math.sqrt(c[0] * c[0] + c[1] * c[1]),
    0
  );
  return {
    x: s[0],
    y: s[1],
    scale: n / o,
    touchesCnt: o,
    touches: e
  };
};
class U {
  constructor(e, o, r, s) {
    i(this, "viewport");
    i(this, "prevTouches", null);
    i(this, "wheelFinishTimer", null);
    i(this, "transformInProgress", !1);
    i(this, "onBeforeDestroy", () => {
      this.removeMouseDragListeners(), this.removeTouchDragListeners(), this.observer.unobserve(this.element), this.element.removeEventListener("mousedown", this.onMouseDown), this.element.removeEventListener("wheel", this.onWheelScroll), this.element.removeEventListener("touchstart", this.onTouchStart), this.element.removeEventListener("wheel", this.preventWheelScaleListener), this.canvas.onBeforeDestroy.unsubscribe(this.onBeforeDestroy);
    });
    i(this, "onMouseDown", (e) => {
      this.element === null || !this.config.mouseDownEventVerifier(e) || (B(this.element, this.config.shiftCursor), this.window.addEventListener("mousemove", this.onWindowMouseMove, {
        passive: !0
      }), this.window.addEventListener("mouseup", this.onWindowMouseUp, {
        passive: !0
      }), this.startRegisteredTransform());
    });
    i(this, "onWindowMouseMove", (e) => {
      const o = M(
        this.window,
        this.element,
        e.clientX,
        e.clientY
      );
      if (this.element === null || !o) {
        this.stopMouseDrag();
        return;
      }
      const r = -e.movementX, s = -e.movementY;
      this.moveViewport(r, s);
    });
    i(this, "onWindowMouseUp", (e) => {
      this.element === null || !this.config.mouseUpEventVerifier(e) || this.stopMouseDrag();
    });
    i(this, "onWheelScroll", (e) => {
      if (!this.config.mouseWheelEventVerifier(e))
        return;
      const { left: o, top: r } = this.element.getBoundingClientRect(), s = e.clientX - o, h = e.clientY - r, d = 1 / (e.deltaY < 0 ? this.config.wheelSensitivity : 1 / this.config.wheelSensitivity);
      this.wheelFinishTimer === null && this.config.onTransformStarted(), this.scaleViewport(d, s, h), this.wheelFinishTimer !== null && clearTimeout(this.wheelFinishTimer), this.wheelFinishTimer = setTimeout(() => {
        this.transformInProgress || this.config.onTransformFinished(), this.wheelFinishTimer = null;
      }, this.config.scaleWheelFinishTimeout);
    });
    i(this, "onTouchStart", (e) => {
      if (this.prevTouches !== null) {
        this.prevTouches = R(e);
        return;
      }
      this.prevTouches = R(e), this.window.addEventListener("touchmove", this.onWindowTouchMove, {
        passive: !0
      }), this.window.addEventListener("touchend", this.onWindowTouchFinish, {
        passive: !0
      }), this.window.addEventListener("touchcancel", this.onWindowTouchFinish, {
        passive: !0
      }), this.startRegisteredTransform();
    });
    i(this, "onWindowTouchMove", (e) => {
      const o = R(e);
      if (!o.touches.every(
        (s) => M(this.window, this.element, s[0], s[1])
      )) {
        this.stopTouchDrag();
        return;
      }
      if ((o.touchesCnt === 1 || o.touchesCnt === 2) && this.moveViewport(
        -(o.x - this.prevTouches.x),
        -(o.y - this.prevTouches.y)
      ), o.touchesCnt === 2) {
        const { left: s, top: h } = this.element.getBoundingClientRect(), n = this.prevTouches.x - s, d = this.prevTouches.y - h, a = 1 / (o.scale / this.prevTouches.scale);
        this.scaleViewport(a, n, d);
      }
      this.prevTouches = o;
    });
    i(this, "onWindowTouchFinish", (e) => {
      e.touches.length > 0 ? this.prevTouches = R(e) : this.stopTouchDrag();
    });
    i(this, "observer", new ResizeObserver(() => {
      const e = this.viewport.getViewportMatrix(), { width: o, height: r } = this.element.getBoundingClientRect(), s = this.config.transformPreprocessor({
        prevTransform: e,
        nextTransform: e,
        canvasWidth: o,
        canvasHeight: r
      });
      this.config.onResizeTransformStarted(), this.canvas.patchViewportMatrix(s), this.config.onResizeTransformFinished();
    }));
    i(this, "config");
    i(this, "preventWheelScaleListener", (e) => {
      e.preventDefault();
    });
    this.canvas = e, this.element = o, this.window = r, this.element.addEventListener("wheel", this.preventWheelScaleListener, {
      passive: !1
    }), this.config = Oe(s), this.viewport = e.viewport, this.observer.observe(this.element), this.element.addEventListener("mousedown", this.onMouseDown, {
      passive: !0
    }), this.element.addEventListener("wheel", this.onWheelScroll, {
      passive: !0
    }), this.element.addEventListener("touchstart", this.onTouchStart, {
      passive: !0
    }), e.onBeforeDestroy.subscribe(this.onBeforeDestroy);
  }
  static configure(e, o, r, s) {
    new U(
      e,
      o,
      r,
      s
    );
  }
  moveViewport(e, o) {
    const r = this.viewport.getViewportMatrix(), s = Xe(r, e, o), { width: h, height: n } = this.element.getBoundingClientRect(), d = this.config.transformPreprocessor({
      prevTransform: r,
      nextTransform: s,
      canvasWidth: h,
      canvasHeight: n
    });
    this.performTransform(d);
  }
  scaleViewport(e, o, r) {
    const s = this.canvas.viewport.getViewportMatrix(), h = Ye(s, e, o, r), { width: n, height: d } = this.element.getBoundingClientRect(), c = this.config.transformPreprocessor({
      prevTransform: s,
      nextTransform: h,
      canvasWidth: n,
      canvasHeight: d
    });
    this.performTransform(c);
  }
  stopMouseDrag() {
    B(this.element, null), this.removeMouseDragListeners(), this.finishRegisteredTransform();
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
    this.config.onBeforeTransformChange(), this.canvas.patchViewportMatrix(e), this.config.onTransformChange();
  }
  startRegisteredTransform() {
    this.transformInProgress = !0, this.config.onTransformStarted();
  }
  finishRegisteredTransform() {
    this.transformInProgress = !1, this.config.onTransformFinished();
  }
}
class X {
  constructor(e, o, r, s, h, n) {
    i(this, "canvasResizeObserver");
    i(this, "nodeHorizontal");
    i(this, "nodeVertical");
    i(this, "viewport");
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
    i(this, "onBeforeDestroy", () => {
      this.trigger.unsubscribe(this.updateLoadedArea), this.canvasResizeObserver.unobserve(this.element), this.canvas.viewport.onAfterUpdated.unsubscribe(
        this.onAfterViewportUpdated
      ), this.canvas.onBeforeDestroy.unsubscribe(this.onBeforeDestroy);
    });
    i(this, "onAfterViewportUpdated", () => {
      this.userTransformInProgress || (this.viewportMatrix = this.viewport.getViewportMatrix(), this.loadAreaAroundViewport());
    });
    i(this, "userTransformInProgress", !1);
    var p, f, E, x, T;
    this.canvas = e, this.element = o, this.window = r, this.trigger = h, this.virtualScrollOptions = n, this.nodeHorizontal = this.virtualScrollOptions.nodeContainingRadius.horizontal, this.nodeVertical = this.virtualScrollOptions.nodeContainingRadius.vertical, this.canvasResizeObserver = new ResizeObserver((b) => {
      const m = b[0];
      this.viewportWidth = m.contentRect.width, this.viewportHeight = m.contentRect.height, this.scheduleLoadAreaAroundViewport();
    }), this.viewport = e.viewport;
    const d = ((p = s == null ? void 0 : s.events) == null ? void 0 : p.onResizeTransformStarted) ?? (() => {
    }), c = ((f = s == null ? void 0 : s.events) == null ? void 0 : f.onResizeTransformFinished) ?? (() => {
    }), a = ((E = s == null ? void 0 : s.events) == null ? void 0 : E.onTransformChange) ?? (() => {
    }), l = ((x = s == null ? void 0 : s.events) == null ? void 0 : x.onBeforeTransformChange) ?? (() => {
    }), g = ((T = s == null ? void 0 : s.events) == null ? void 0 : T.onTransformFinished) ?? (() => {
    }), y = {
      ...s,
      events: {
        ...s == null ? void 0 : s.events,
        onResizeTransformStarted: () => {
          this.userTransformInProgress = !0, d();
        },
        onResizeTransformFinished: () => {
          this.userTransformInProgress = !1, c();
        },
        onBeforeTransformChange: () => {
          this.userTransformInProgress = !0, l();
        },
        onTransformChange: () => {
          this.userTransformInProgress = !1;
          const b = this.viewportMatrix;
          this.viewportMatrix = this.viewport.getViewportMatrix(), b.scale !== this.viewportMatrix.scale && this.scheduleEnsureViewportAreaLoaded(), a();
        },
        onTransformFinished: () => {
          this.scheduleLoadAreaAroundViewport(), g();
        }
      }
    };
    U.configure(
      e,
      this.element,
      this.window,
      y
    ), this.viewportMatrix = this.viewport.getViewportMatrix(), this.trigger.subscribe(this.updateLoadedArea), this.canvasResizeObserver.observe(this.element), this.canvas.viewport.onAfterUpdated.subscribe(this.onAfterViewportUpdated), this.canvas.onBeforeDestroy.subscribe(this.onBeforeDestroy);
  }
  static configure(e, o, r, s, h, n) {
    new X(
      e,
      o,
      r,
      s,
      h,
      n
    );
  }
  scheduleLoadAreaAroundViewport() {
    setTimeout(() => {
      this.loadAreaAroundViewport();
    });
  }
  scheduleEnsureViewportAreaLoaded() {
    const e = this.viewportWidth * this.viewportMatrix.scale, o = this.viewportHeight * this.viewportMatrix.scale, r = this.viewportMatrix.x - this.nodeHorizontal, s = this.viewportMatrix.y - this.nodeVertical, h = this.viewportMatrix.x + e + this.nodeHorizontal, n = this.viewportMatrix.y + o + this.nodeVertical;
    this.loadedArea.xFrom < r && this.loadedArea.xTo > h && this.loadedArea.yFrom < s && this.loadedArea.yTo > n || this.scheduleLoadAreaAroundViewport();
  }
  loadAreaAroundViewport() {
    const e = this.viewportWidth * this.viewportMatrix.scale, o = this.viewportHeight * this.viewportMatrix.scale, r = this.viewportMatrix.x - e - this.nodeHorizontal, s = this.viewportMatrix.y - o - this.nodeVertical, h = 3 * e + 2 * this.nodeHorizontal, n = 3 * o + 2 * this.nodeVertical;
    this.trigger.emit({ x: r, y: s, width: h, height: n });
  }
}
const He = () => {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  return t.style.position = "absolute", t.style.inset = "0", t;
}, je = () => {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  return t.setAttribute("fill", "url(#pattern)"), t;
}, Ge = () => {
  const t = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "pattern"
  );
  return t.setAttribute("id", "pattern"), t;
}, Je = (t, e) => {
  const o = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  return o.setAttribute("cx", "0"), o.setAttribute("cy", "0"), o.setAttribute("r", `${t}`), o.setAttribute("fill", `${e}`), o;
}, Ke = (t) => t instanceof SVGElement ? t : Je(
  (t == null ? void 0 : t.radius) ?? 1.5,
  (t == null ? void 0 : t.color) ?? "#d8d8d8"
), Qe = (t) => {
  const e = t.tileDimensions, o = (e == null ? void 0 : e.width) ?? 25, r = (e == null ? void 0 : e.height) ?? 25, s = Ke(t.renderer ?? {});
  return {
    tileWidth: o,
    tileHeight: r,
    renderer: s,
    maxViewportScale: t.maxViewportScale ?? 10
  };
};
class Y {
  constructor(e, o, r) {
    i(this, "svg", He());
    i(this, "patternRenderingRectangle", je());
    i(this, "pattern", Ge());
    i(this, "patternContent");
    i(this, "tileWidth");
    i(this, "tileHeight");
    i(this, "halfTileWidth");
    i(this, "halfTileHeight");
    i(this, "maxViewportScale");
    i(this, "visible", !1);
    i(this, "resizeObserver", new ResizeObserver((e) => {
      const o = e[0], { width: r, height: s } = o.contentRect;
      this.svg.setAttribute("width", `${r}`), this.svg.setAttribute("height", `${s}`), this.patternRenderingRectangle.setAttribute("width", `${r}`), this.patternRenderingRectangle.setAttribute("height", `${s}`);
      const h = this.tileWidth / r, n = this.tileHeight / s;
      this.pattern.setAttribute("width", `${h}`), this.pattern.setAttribute("height", `${n}`);
    }));
    i(this, "onAfterTransformUpdated", () => {
      const e = this.canvas.viewport.getContentMatrix(), o = e.x - this.halfTileWidth * e.scale, r = e.y - this.halfTileHeight * e.scale, s = `matrix(${e.scale}, 0, 0, ${e.scale}, ${o}, ${r})`;
      this.pattern.setAttribute("patternTransform", s), this.updateVisibility();
    });
    i(this, "onBeforeDestroy", () => {
      this.resizeObserver.unobserve(this.host), this.host.removeChild(this.svg), this.canvas.viewport.onAfterUpdated.unsubscribe(
        this.onAfterTransformUpdated
      ), this.canvas.onBeforeDestroy.unsubscribe(this.onBeforeDestroy);
    });
    this.canvas = e, this.host = r;
    const s = Qe(o);
    this.tileWidth = s.tileWidth, this.tileHeight = s.tileHeight, this.halfTileWidth = this.tileWidth / 2, this.halfTileHeight = this.tileHeight / 2, this.patternContent = s.renderer, this.maxViewportScale = s.maxViewportScale;
    const h = `translate(${this.halfTileWidth}, ${this.halfTileHeight})`;
    this.patternContent.setAttribute("transform", h), this.pattern.appendChild(this.patternContent);
    const n = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    n.appendChild(this.pattern), this.svg.appendChild(n), this.svg.appendChild(this.patternRenderingRectangle), this.resizeObserver.observe(this.host), this.canvas.viewport.onAfterUpdated.subscribe(this.onAfterTransformUpdated), this.onAfterTransformUpdated(), this.canvas.onBeforeDestroy.subscribe(this.onBeforeDestroy);
  }
  static configure(e, o, r) {
    new Y(e, o, r);
  }
  updateVisibility() {
    const o = this.canvas.viewport.getViewportMatrix().scale > this.maxViewportScale;
    o && this.visible ? (this.visible = !1, this.host.removeChild(this.svg)) : !o && !this.visible && (this.visible = !0, this.host.appendChild(this.svg));
  }
}
const Ze = (t) => {
  var d, c, a;
  const e = () => "direct", o = (l) => l, r = (l) => l.button === 0, s = () => {
  }, h = () => {
  }, n = () => {
  };
  return {
    connectionTypeResolver: t.connectionTypeResolver ?? e,
    connectionPreprocessor: t.connectionPreprocessor ?? o,
    mouseDownEventVerifier: t.mouseDownEventVerifier ?? r,
    mouseUpEventVerifier: t.mouseUpEventVerifier ?? r,
    onAfterEdgeCreated: ((d = t.events) == null ? void 0 : d.onAfterEdgeCreated) ?? s,
    onEdgeCreationInterrupted: ((c = t.events) == null ? void 0 : c.onEdgeCreationInterrupted) ?? n,
    onEdgeCreationPrevented: ((a = t.events) == null ? void 0 : a.onEdgeCreationPrevented) ?? h,
    dragPortDirection: t.dragPortDirection ?? void 0
  };
};
class _e {
  constructor() {
    i(this, "singleToMultiMap", /* @__PURE__ */ new Map());
    i(this, "multiToSingleMap", /* @__PURE__ */ new Map());
  }
  addRecord(e, o) {
    const r = this.singleToMultiMap.get(e);
    r === void 0 ? this.singleToMultiMap.set(e, /* @__PURE__ */ new Set([o])) : r.add(o), this.multiToSingleMap.set(o, e);
  }
  getFirstBySingle(e) {
    const o = this.singleToMultiMap.get(e);
    return o === void 0 ? void 0 : Array.from(o.values())[0];
  }
  removeByMulti(e) {
    const o = this.multiToSingleMap.get(e), r = this.singleToMultiMap.get(o);
    r.delete(e), r.size === 0 && this.singleToMultiMap.delete(o), this.multiToSingleMap.delete(e);
  }
  getByMulti(e) {
    return this.multiToSingleMap.get(e);
  }
  removeBySingle(e) {
    this.singleToMultiMap.get(e).forEach((r) => {
      this.multiToSingleMap.delete(r);
    }), this.singleToMultiMap.delete(e);
  }
  clear() {
    this.singleToMultiMap.clear(), this.multiToSingleMap.clear();
  }
  forEachSingle(e) {
    this.singleToMultiMap.forEach((o, r) => {
      e(r);
    });
  }
  hasSingle(e) {
    return this.singleToMultiMap.get(e) !== void 0;
  }
  hasMulti(e) {
    return this.multiToSingleMap.get(e) !== void 0;
  }
}
class H {
  constructor(e, o, r, s, h, n) {
    i(this, "config");
    i(this, "overlayCanvas");
    i(this, "ports", new _e());
    i(this, "staticOverlayPortId", "static");
    i(this, "draggingOverlayPortId", "dragging");
    i(this, "staticPortId", null);
    i(this, "isDirect", !0);
    i(this, "onAfterPortMarked", (e) => {
      const o = this.canvas.graph.getPort(e);
      this.ports.hasSingle(o.element) || this.hookPortEvents(o.element), this.ports.addRecord(o.element, e);
    });
    i(this, "onBeforePortUnmarked", (e) => {
      const o = this.canvas.graph.getPort(e);
      this.ports.removeByMulti(e), this.ports.hasSingle(o.element) || this.unhookPortEvents(o.element);
    });
    i(this, "onPortMouseDown", (e) => {
      const o = e.currentTarget;
      this.config.mouseDownEventVerifier(e) && this.isPortConnectionAllowed(o) && (e.stopPropagation(), this.grabPort(o, { x: e.clientX, y: e.clientY }), this.window.addEventListener("mousemove", this.onWindowMouseMove, {
        passive: !0
      }), this.window.addEventListener("mouseup", this.onWindowMouseUp, {
        passive: !0
      }));
    });
    i(this, "onWindowMouseMove", (e) => {
      if (!M(
        this.window,
        this.overlayLayer,
        e.clientX,
        e.clientY
      )) {
        this.stopMouseDrag();
        return;
      }
      this.moveDraggingNode({ x: e.clientX, y: e.clientY });
    });
    i(this, "onWindowMouseUp", (e) => {
      this.config.mouseUpEventVerifier(e) && (this.tryCreateConnection({ x: e.clientX, y: e.clientY }), this.stopMouseDrag());
    });
    i(this, "onPortTouchStart", (e) => {
      const o = e.currentTarget;
      if (!(e.touches.length === 1 && this.isPortConnectionAllowed(o)))
        return;
      e.stopPropagation();
      const s = e.touches[0];
      this.grabPort(o, { x: s.clientX, y: s.clientY }), this.window.addEventListener("touchmove", this.onWindowTouchMove, {
        passive: !0
      }), this.window.addEventListener("touchend", this.onWindowTouchFinish, {
        passive: !0
      }), this.window.addEventListener("touchcancel", this.onWindowTouchFinish, {
        passive: !0
      });
    });
    i(this, "onWindowTouchMove", (e) => {
      const o = e.touches[0];
      if (!M(
        this.window,
        this.overlayLayer,
        o.clientX,
        o.clientY
      )) {
        this.stopTouchDrag();
        return;
      }
      this.moveDraggingNode({ x: o.clientX, y: o.clientY });
    });
    i(this, "onWindowTouchFinish", (e) => {
      const o = e.changedTouches[0];
      this.tryCreateConnection({ x: o.clientX, y: o.clientY }), this.stopTouchDrag();
    });
    i(this, "onBeforeClear", () => {
      this.ports.forEachSingle((e) => {
        this.unhookPortEvents(e);
      }), this.ports.clear();
    });
    i(this, "onBeforeDestroy", () => {
      this.stopMouseDrag(), this.stopTouchDrag(), this.canvas.graph.onAfterPortMarked.unsubscribe(this.onAfterPortMarked), this.canvas.graph.onBeforePortUnmarked.unsubscribe(
        this.onBeforePortUnmarked
      ), this.canvas.graph.onBeforeClear.unsubscribe(this.onBeforeClear), this.canvas.onBeforeDestroy.unsubscribe(this.onBeforeDestroy);
    });
    i(this, "onEdgeCreated", (e) => {
      this.config.onAfterEdgeCreated(e);
    });
    this.canvas = e, this.overlayLayer = o, this.viewportStore = r, this.window = s, this.config = Ze(n);
    const d = new ne(), c = new re(
      d,
      this.viewportStore,
      this.overlayLayer
    );
    this.overlayCanvas = new se(
      this.overlayLayer,
      d,
      this.viewportStore,
      c,
      h
    ), this.canvas.graph.onAfterPortMarked.subscribe(this.onAfterPortMarked), this.canvas.graph.onBeforePortUnmarked.subscribe(this.onBeforePortUnmarked), this.canvas.graph.onBeforeClear.subscribe(this.onBeforeClear), this.canvas.onBeforeDestroy.subscribe(this.onBeforeDestroy);
  }
  static configure(e, o, r, s, h, n) {
    new H(
      e,
      o,
      r,
      s,
      h,
      n
    );
  }
  grabPort(e, o) {
    const r = this.ports.getFirstBySingle(e), s = this.canvas.graph.getPort(r);
    this.staticPortId = r;
    const h = this.config.connectionTypeResolver(this.staticPortId), n = e.getBoundingClientRect(), d = n.x + n.width / 2, c = n.y + n.height / 2, a = this.overlayLayer.getBoundingClientRect(), l = this.canvas.viewport.getViewportMatrix(), g = N(l, {
      x: d - a.x,
      y: c - a.y
    }), y = N(l, {
      x: o.x - a.x,
      y: o.y - a.y
    }), p = {
      overlayId: this.staticOverlayPortId,
      portCoords: g,
      portDirection: s.direction
    }, f = {
      overlayId: this.draggingOverlayPortId,
      portCoords: y,
      portDirection: this.config.dragPortDirection
    };
    this.isDirect = h === "direct";
    const E = this.isDirect ? p : f, x = this.isDirect ? f : p;
    this.createOverlayGraph(E, x);
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
    this.resetDragState(), this.window.removeEventListener("mouseup", this.onWindowMouseUp), this.window.removeEventListener("mousemove", this.onWindowMouseMove);
  }
  stopTouchDrag() {
    this.resetDragState(), this.window.removeEventListener("touchmove", this.onWindowTouchMove), this.window.removeEventListener("touchend", this.onWindowTouchFinish), this.window.removeEventListener("touchcancel", this.onWindowTouchFinish);
  }
  resetDragState() {
    this.staticPortId = null, this.isDirect = !0, this.overlayCanvas.clear();
  }
  createOverlayGraph(e, o) {
    const r = this.createAddNodeRequest(e);
    this.overlayCanvas.addNode(r);
    const s = this.createAddNodeRequest(o);
    this.overlayCanvas.addNode(s), this.overlayCanvas.addEdge({
      from: e.overlayId,
      to: o.overlayId
    });
  }
  createAddNodeRequest(e) {
    const o = document.createElement("div");
    return {
      id: e.overlayId,
      element: o,
      x: e.portCoords.x,
      y: e.portCoords.y,
      ports: [
        {
          id: e.overlayId,
          element: o,
          direction: e.portDirection
        }
      ]
    };
  }
  tryCreateConnection(e) {
    const o = this.findPortAtPoint(e);
    if (o === null) {
      this.config.onEdgeCreationInterrupted(this.staticPortId, this.isDirect);
      return;
    }
    const r = this.isDirect ? this.staticPortId : o, s = this.isDirect ? o : this.staticPortId, h = { from: r, to: s }, n = this.config.connectionPreprocessor(h);
    n !== null ? (this.canvas.graph.onAfterEdgeAdded.subscribe(this.onEdgeCreated), this.canvas.addEdge(n), this.canvas.graph.onAfterEdgeAdded.unsubscribe(this.onEdgeCreated)) : this.config.onEdgeCreationPrevented(h);
  }
  moveDraggingNode(e) {
    const o = this.overlayLayer.getBoundingClientRect(), r = {
      x: e.x - o.x,
      y: e.y - o.y
    }, s = this.canvas.viewport.getViewportMatrix(), h = N(s, r);
    this.overlayCanvas.updateNode(this.draggingOverlayPortId, {
      x: h.x,
      y: h.y
    });
  }
  findPortAtPoint(e) {
    const o = document.elementsFromPoint(e.x, e.y);
    for (const r of o) {
      const s = this.findPortAtElement(r);
      if (s !== null)
        return s;
    }
    return null;
  }
  findPortAtElement(e) {
    let o = e, r = null;
    for (; o !== null && (r = this.ports.getFirstBySingle(o) ?? null, r === null); )
      o = o.parentElement;
    return r;
  }
  isPortConnectionAllowed(e) {
    const o = this.ports.getFirstBySingle(e);
    return this.config.connectionTypeResolver(o) !== null;
  }
}
const qe = () => {
  const t = document.createElement("div");
  return t.style.width = "100%", t.style.height = "100%", t.style.position = "relative", t;
}, W = () => {
  const t = document.createElement("div");
  return t.style.position = "absolute", t.style.inset = "0", t;
};
class et {
  constructor(e) {
    i(this, "background", W());
    i(this, "main", W());
    i(this, "overlay", W());
    i(this, "host", qe());
    this.element = e, this.element.appendChild(this.host), this.host.appendChild(this.background), this.host.appendChild(this.main), this.overlay.style.pointerEvents = "none", this.host.appendChild(this.overlay);
  }
  destroy() {
    this.host.removeChild(this.background), this.host.removeChild(this.main), this.host.removeChild(this.overlay), this.element.removeChild(this.host);
  }
}
class ot {
  constructor(e) {
    i(this, "element", null);
    i(this, "canvasDefaults", {});
    i(this, "dragConfig", {});
    i(this, "transformConfig", {});
    i(this, "backgroundConfig", {});
    i(this, "connectablePortsConfig", {});
    i(this, "virtualScrollConfig");
    i(this, "hasDraggableNode", !1);
    i(this, "hasTransformableViewport", !1);
    i(this, "hasResizeReactiveNodes", !1);
    i(this, "hasBackground", !1);
    i(this, "hasUserConnectablePorts", !1);
    i(this, "boxRenderingTrigger");
    i(this, "window", window);
    e !== void 0 && (this.element = e);
  }
  /**
   * @deprecated
   * use `new CanvasBuilder(element);` instead
   */
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
    return this.hasDraggableNode = !0, this.dragConfig = e ?? {}, this;
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
  enableResizeReactiveNodes() {
    return this.hasResizeReactiveNodes = !0, this;
  }
  /**
   * sets emitter for rendering graph inside bounded area
   */
  enableBoxAreaRendering(e) {
    return this.boxRenderingTrigger = e, this;
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
    return this.connectablePortsConfig = e ?? {}, this.hasUserConnectablePorts = !0, this;
  }
  /**
   * builds final canvas
   */
  build() {
    if (this.element === null)
      throw new S(
        "unable to build canvas when no attach element specified"
      );
    let e = this.boxRenderingTrigger;
    this.virtualScrollConfig !== void 0 && e === void 0 && (e = new ie());
    const o = new ne(), r = new Ue(), s = new et(this.element);
    let h = new re(
      o,
      r,
      s.main
    );
    e !== void 0 && (h = new ue(h, o, e));
    const n = new se(
      this.element,
      o,
      r,
      h,
      this.canvasDefaults
    ), d = () => {
      s.destroy(), n.onBeforeDestroy.unsubscribe(d);
    };
    return n.onBeforeDestroy.subscribe(d), this.hasBackground && Y.configure(
      n,
      this.backgroundConfig,
      s.background
    ), this.hasResizeReactiveNodes && k.configure(n), this.hasDraggableNode && O.configure(
      n,
      s.main,
      this.window,
      this.dragConfig
    ), this.hasUserConnectablePorts && H.configure(
      n,
      s.overlay,
      r,
      this.window,
      this.canvasDefaults,
      this.connectablePortsConfig
    ), this.virtualScrollConfig !== void 0 ? X.configure(
      n,
      s.main,
      this.window,
      this.transformConfig,
      e,
      this.virtualScrollConfig
    ) : this.hasTransformableViewport && U.configure(
      n,
      s.main,
      this.window,
      this.transformConfig
    ), this.reset(), n;
  }
  /**
   * @deprecated
   * CanvasBuilder should be single use object
   */
  reset() {
    this.element = null, this.canvasDefaults = {}, this.dragConfig = {}, this.transformConfig = {}, this.backgroundConfig = {}, this.virtualScrollConfig = void 0, this.hasDraggableNode = !1, this.hasTransformableViewport = !1, this.hasResizeReactiveNodes = !1, this.hasBackground = !1, this.boxRenderingTrigger = void 0, this.hasUserConnectablePorts = !1;
  }
}
export {
  De as BezierEdgeShape,
  ot as CanvasBuilder,
  ie as EventSubject,
  Ve as HorizontalEdgeShape,
  S as HtmlGraphError,
  Le as StraightEdgeShape,
  Re as VerticalEdgeShape
};
