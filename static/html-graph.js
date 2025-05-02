var ne = Object.defineProperty;
var he = (t, e, o) => e in t ? ne(t, e, { enumerable: !0, configurable: !0, writable: !0, value: o }) : t[e] = o;
var i = (t, e, o) => he(t, typeof e != "symbol" ? e + "" : e, o);
const de = () => {
  const t = document.createElement("div");
  return t.style.position = "absolute", t.style.top = "0", t.style.left = "0", t.style.width = "0", t.style.height = "0", t;
}, ce = () => {
  const t = document.createElement("div");
  return t.style.position = "absolute", t.style.top = "0", t.style.left = "0", t.style.visibility = "hidden", t;
}, ae = () => {
  const t = document.createElement("div");
  return t.style.width = "100%", t.style.height = "100%", t.style.position = "relative", t.style.overflow = "hidden", t;
};
class le {
  constructor(e, o, r) {
    i(this, "host", ae());
    i(this, "container", de());
    i(this, "nodeIdToWrapperElementMap", /* @__PURE__ */ new Map());
    i(this, "edgeIdToElementMap", /* @__PURE__ */ new Map());
    i(this, "applyTransform", () => {
      const e = this.viewportStore.getContentMatrix();
      this.container.style.transform = `matrix(${e.scale}, 0, 0, ${e.scale}, ${e.x}, ${e.y})`;
    });
    this.graphStore = e, this.viewportStore = o, this.element = r, this.element.appendChild(this.host), this.host.appendChild(this.container), this.viewportStore.onAfterUpdated.subscribe(this.applyTransform);
  }
  attachNode(e) {
    const o = this.graphStore.getNode(e), r = ce();
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
    const o = this.graphStore.getEdge(e), r = this.graphStore.getPort(o.from).nodeId, s = this.graphStore.getPort(o.to).nodeId, d = this.graphStore.getNode(r), n = this.graphStore.getNode(s), h = Math.min(d.x, n.x), c = Math.max(d.x, n.x), a = Math.min(d.y, n.y), l = Math.max(d.y, n.y);
    return h <= this.xTo && c >= this.xFrom && a <= this.yTo && l >= this.yFrom;
  }
}
class ue {
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
class se {
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
  const t = new se();
  return [t, t];
};
class we {
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
class b extends Error {
  constructor() {
    super(...arguments);
    i(this, "name", "HtmlGraphError");
  }
}
const ye = (t, e) => ({
  x: t / 2,
  y: e / 2
}), H = (t) => () => t, ee = H(0), ve = () => {
  let t = 0;
  return () => t++;
}, xe = (t, e) => {
  let o = ee, r = ee;
  const s = ve();
  return t === "incremental" && (o = s), e === "incremental" && (r = s), typeof t == "number" && (o = H(t)), typeof e == "number" && (r = H(e)), typeof t == "function" && (o = t), typeof e == "function" && (r = e), {
    nodesPriorityFn: o,
    edgesPriorityFn: r
  };
}, x = (t, e, o) => ({
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
  ].map((a) => x(a, t, w)).map((a) => ({ x: a.x + e.x, y: a.y + e.y })), n = `M ${d[0].x} ${d[0].y}`, h = `L ${d[1].x} ${d[1].y}`, c = `L ${d[2].x} ${d[2].y}`;
  return `${n} ${h} ${c}`;
}, C = (t, e) => {
  const o = [];
  if (t.length > 0 && o.push(`M ${t[0].x} ${t[0].y}`), t.length === 2 && o.push(`L ${t[1].x} ${t[1].y}`), t.length > 2) {
    const r = t.length - 1;
    let s = 0, d = 0, n = 0;
    t.forEach((h, c) => {
      let a = 0, l = 0, g = 0;
      const f = c > 0, v = c < r, y = f && v;
      if (f && (a = -s, l = -d, g = n), v) {
        const L = t[c + 1];
        s = L.x - h.x, d = L.y - h.y, n = Math.sqrt(s * s + d * d);
      }
      const E = n !== 0 ? Math.min((y ? e : 0) / n, c < r - 1 ? 0.5 : 1) : 0, S = y ? { x: h.x + s * E, y: h.y + d * E } : h, D = g !== 0 ? Math.min((y ? e : 0) / g, c > 1 ? 0.5 : 1) : 0, M = y ? { x: h.x + a * D, y: h.y + l * D } : h;
      c > 0 && o.push(`L ${M.x} ${M.y}`), y && o.push(
        `C ${h.x} ${h.y} ${h.x} ${h.y} ${S.x} ${S.y}`
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
}, N = (t) => {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("fill", t), e;
}, z = (t, e) => {
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
}, Ae = (t) => {
  const e = x(
    { x: t.arrowLength, y: w.y },
    t.fromVector,
    w
  ), o = x(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVector,
    t.to
  ), r = {
    x: e.x + t.fromVector.x * t.curvature,
    y: e.y + t.fromVector.y * t.curvature
  }, s = {
    x: o.x - t.toVector.x * t.curvature,
    y: o.y - t.toVector.y * t.curvature
  }, d = `M ${e.x} ${e.y} C ${r.x} ${r.y}, ${s.x} ${s.y}, ${o.x} ${o.y}`, n = t.hasSourceArrow ? "" : `M ${w.x} ${w.y} L ${e.x} ${e.y} `, h = t.hasTargetArrow ? "" : ` M ${o.x} ${o.y} L ${t.to.x} ${t.to.y}`;
  return `${n}${d}${h}`;
}, Ee = (t) => {
  const e = t.hasSourceArrow ? x(
    { x: t.arrowLength, y: w.y },
    t.fromVector,
    w
  ) : w, o = t.hasTargetArrow ? x(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVector,
    t.to
  ) : t.to, r = t.arrowLength, s = Math.cos(t.detourDirection) * t.detourDistance, d = Math.sin(t.detourDirection) * t.detourDistance, n = s * t.flipX, h = d * t.flipY, c = x(
    { x: r, y: w.y },
    t.fromVector,
    w
  ), a = {
    x: c.x + n,
    y: c.y + h
  }, l = x(
    { x: t.to.x - r, y: t.to.y },
    t.toVector,
    t.to
  ), g = {
    x: l.x + n,
    y: l.y + h
  }, f = { x: (a.x + g.x) / 2, y: (a.y + g.y) / 2 }, v = {
    x: c.x + t.curvature * t.fromVector.x,
    y: c.y + t.curvature * t.fromVector.y
  }, y = {
    x: l.x - t.curvature * t.toVector.x,
    y: l.y - t.curvature * t.toVector.y
  }, p = {
    x: c.x + n,
    y: c.y + h
  }, E = {
    x: l.x + n,
    y: l.y + h
  };
  return [
    `M ${e.x} ${e.y}`,
    `L ${c.x} ${c.y}`,
    `C ${v.x} ${v.y} ${p.x} ${p.y} ${f.x} ${f.y}`,
    `C ${E.x} ${E.y} ${y.x} ${y.y} ${l.x} ${l.y}`,
    `L ${o.x} ${o.y}`
  ].join(" ");
}, Se = (t) => {
  const e = t.hasSourceArrow ? x(
    { x: t.arrowLength, y: w.y },
    t.fromVector,
    w
  ) : w, o = t.hasTargetArrow ? x(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVector,
    t.to
  ) : t.to, r = t.arrowLength + t.arrowOffset, s = r - t.roundness, d = x(
    { x: s, y: w.y },
    t.fromVector,
    w
  ), n = x(
    { x: t.to.x - s, y: t.to.y },
    t.toVector,
    t.to
  ), h = Math.max((d.x + n.x) / 2, r), c = t.to.y / 2, a = {
    x: t.flipX > 0 ? h : -r,
    y: d.y
  }, l = { x: a.x, y: c }, g = {
    x: t.flipX > 0 ? t.to.x - h : t.to.x + r,
    y: n.y
  }, f = { x: g.x, y: c };
  return C(
    [e, d, a, l, f, g, n, o],
    t.roundness
  );
}, k = (t) => {
  const e = t.hasSourceArrow ? x(
    { x: t.arrowLength, y: w.y },
    t.fromVector,
    w
  ) : w, o = t.hasTargetArrow ? x(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVector,
    t.to
  ) : t.to, r = t.arrowLength + t.arrowOffset, s = x(
    { x: r, y: w.y },
    t.fromVector,
    w
  ), d = Math.cos(t.detourDirection) * t.detourDistance, n = Math.sin(t.detourDirection) * t.detourDistance, h = d * t.flipX, c = n * t.flipY, a = { x: s.x + h, y: s.y + c }, l = x(
    { x: t.to.x - r, y: t.to.y },
    t.toVector,
    t.to
  ), g = { x: l.x + h, y: l.y + c };
  return C(
    [e, s, a, g, l, o],
    t.roundness
  );
}, be = (t) => {
  const e = t.hasSourceArrow ? x(
    { x: t.arrowLength, y: w.y },
    t.fromVector,
    w
  ) : w, o = t.hasTargetArrow ? x(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVector,
    t.to
  ) : t.to, r = t.arrowLength + t.arrowOffset, s = x(
    { x: r, y: w.y },
    t.fromVector,
    w
  ), d = x(
    { x: t.to.x - r, y: t.to.y },
    t.toVector,
    t.to
  );
  return C([e, s, d, o], t.roundness);
}, pe = (t) => {
  const e = t.hasSourceArrow ? x(
    { x: t.arrowLength, y: w.y },
    t.fromVector,
    w
  ) : w, o = t.hasTargetArrow ? x(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVector,
    t.to
  ) : t.to, r = t.arrowLength + t.arrowOffset, s = r - t.roundness, d = x(
    { x: s, y: w.y },
    t.fromVector,
    w
  ), n = x(
    { x: t.to.x - s, y: t.to.y },
    t.toVector,
    t.to
  ), h = Math.max((d.y + n.y) / 2, r), c = t.to.x / 2, a = {
    x: d.x,
    y: t.flipY > 0 ? h : -r
  }, l = { x: c, y: a.y }, g = {
    x: n.x,
    y: t.flipY > 0 ? t.to.y - h : t.to.y + r
  }, f = { x: c, y: g.y };
  return C(
    [e, d, a, l, f, g, n, o],
    t.roundness
  );
}, j = (t) => {
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
    (c) => x(c, t.fromVector, w)
  ), h = `M ${w.x} ${w.y} L ${n[0].x} ${n[0].y} `;
  return `${t.hasSourceArrow || t.hasTargetArrow ? "" : h}${C(n, t.roundness)}`;
}, Te = (t) => {
  const e = t.smallRadius, o = t.radius, r = Math.sqrt(e * e + o * o), s = e + o, d = t.arrowLength + r * (1 - o / s), n = e * o / s, c = [
    { x: t.arrowLength, y: w.y },
    { x: d, y: n },
    { x: d, y: -n }
  ].map(
    (g) => x(g, t.fromVector, w)
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
});
class me {
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
    this.svg.appendChild(this.group), this.line = F(o, r), this.group.appendChild(this.line), this.hasSourceArrow && (this.sourceArrow = N(o), this.group.appendChild(this.sourceArrow)), this.hasTargetArrow && (this.targetArrow = N(o), this.group.appendChild(this.targetArrow));
  }
  render(e) {
    const { x: o, y: r, width: s, height: d, flipX: n, flipY: h } = z(
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
    let g, f = a, v = -this.arrowLength;
    if (e.from.portId === e.to.portId ? (g = Te({
      fromVector: c,
      radius: this.portCycleRadius,
      smallRadius: this.portCycleSmallRadius,
      arrowLength: this.arrowLength,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), f = c, v = this.arrowLength) : e.from.nodeId === e.to.nodeId ? g = Ee({
      to: l,
      fromVector: c,
      toVector: a,
      flipX: n,
      flipY: h,
      arrowLength: this.arrowLength,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      curvature: this.curvature,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }) : g = Ae({
      to: l,
      fromVector: c,
      toVector: a,
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
        v,
        this.arrowWidth
      );
      this.targetArrow.setAttribute("d", y);
    }
  }
}
class Ne {
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
    this.svg.appendChild(this.group), this.line = F(r, s), this.group.appendChild(this.line), this.hasSourceArrow && (this.sourceArrow = N(r), this.group.appendChild(this.sourceArrow)), this.hasTargetArrow && (this.targetArrow = N(r), this.group.appendChild(this.targetArrow));
  }
  render(e) {
    const { x: o, y: r, width: s, height: d, flipX: n, flipY: h } = z(
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
    let g, f = a, v = -this.arrowLength;
    if (e.from.portId === e.to.portId ? (g = j({
      fromVector: c,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), f = c, v = this.arrowLength) : e.from.nodeId === e.to.nodeId ? g = k({
      to: l,
      fromVector: c,
      toVector: a,
      flipX: n,
      flipY: h,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }) : g = Se({
      to: l,
      fromVector: c,
      toVector: a,
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
        v,
        this.arrowWidth
      );
      this.targetArrow.setAttribute("d", y);
    }
  }
}
class Pe {
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
    this.svg.appendChild(this.group), this.line = F(r, s), this.group.appendChild(this.line), this.hasSourceArrow && (this.sourceArrow = N(r), this.group.appendChild(this.sourceArrow)), this.hasTargetArrow && (this.targetArrow = N(r), this.group.appendChild(this.targetArrow));
  }
  render(e) {
    const { x: o, y: r, width: s, height: d, flipX: n, flipY: h } = z(
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
    let g, f = a, v = -this.arrowLength;
    if (e.from.portId === e.to.portId ? (g = j({
      fromVector: c,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), f = c, v = this.arrowLength) : e.from.nodeId === e.to.nodeId ? g = k({
      to: l,
      fromVector: c,
      toVector: a,
      flipX: n,
      flipY: h,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }) : g = be({
      to: l,
      fromVector: c,
      toVector: a,
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
        v,
        this.arrowWidth
      );
      this.targetArrow.setAttribute("d", y);
    }
  }
}
class Ve {
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
    this.svg.appendChild(this.group), this.line = F(r, s), this.group.appendChild(this.line), this.hasSourceArrow && (this.sourceArrow = N(r), this.group.appendChild(this.sourceArrow)), this.hasTargetArrow && (this.targetArrow = N(r), this.group.appendChild(this.targetArrow));
  }
  render(e) {
    const { x: o, y: r, width: s, height: d, flipX: n, flipY: h } = z(
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
    let g, f = a, v = -this.arrowLength;
    if (e.from.portId === e.to.portId ? (g = j({
      fromVector: c,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), f = c, v = this.arrowLength) : e.from.nodeId === e.to.nodeId ? g = k({
      to: l,
      fromVector: c,
      toVector: a,
      flipX: n,
      flipY: h,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }) : g = pe({
      to: l,
      fromVector: c,
      toVector: a,
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
        v,
        this.arrowWidth
      );
      this.targetArrow.setAttribute("d", y);
    }
  }
}
const De = (t) => {
  if (typeof t == "function")
    return t;
  switch (t == null ? void 0 : t.type) {
    case "straight":
      return () => new Pe({
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
      return () => new Ne({
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
    default:
      return () => new me({
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
}, Me = (t) => {
  var o, r, s, d, n;
  const e = xe(
    (o = t == null ? void 0 : t.nodes) == null ? void 0 : o.priority,
    (r = t == null ? void 0 : t.edges) == null ? void 0 : r.priority
  );
  return {
    nodes: {
      centerFn: ((s = t == null ? void 0 : t.nodes) == null ? void 0 : s.centerFn) ?? ye,
      priorityFn: e.nodesPriorityFn
    },
    ports: {
      direction: ((d = t == null ? void 0 : t.ports) == null ? void 0 : d.direction) ?? 0
    },
    edges: {
      shapeFactory: De(((n = t == null ? void 0 : t.edges) == null ? void 0 : n.shape) ?? {}),
      priorityFn: e.edgesPriorityFn
    }
  };
};
class Le {
  constructor(e, o, r, s, d) {
    /**
     * provides api for accessing model of rendered graph
     */
    i(this, "graph");
    /**
     * provides api for accessing viewport state
     */
    i(this, "viewport");
    i(this, "defaults");
    i(this, "nodeIdGenerator", new X(
      (e) => this.graph.getNode(e) !== null
    ));
    i(this, "portIdGenerator", new X(
      (e) => this.graph.getPort(e) !== null
    ));
    i(this, "edgeIdGenerator", new X(
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
    i(this, "onBeforeDestroy");
    this.element = e, this.graphStore = o, this.viewportStore = r, this.htmlView = s, this.defaults = Me(d), this.graph = new fe(this.graphStore), this.viewport = new we(this.viewportStore), this.graphStore.onAfterNodeAdded.subscribe(this.onAfterNodeAdded), this.graphStore.onAfterNodeUpdated.subscribe(this.onAfterNodeUpdated), this.graphStore.onAfterNodePriorityUpdated.subscribe(
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
      throw new b("failed to add node with existing id");
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
      throw new b("failed to update non existing node");
    return this.graphStore.updateNode(e, o ?? {}), this;
  }
  /**
   * removes specified node
   * all the ports of node get unmarked
   * all the edges adjacent to node get removed
   */
  removeNode(e) {
    if (this.graph.getNode(e) === null)
      throw new b("failed to remove non existing node");
    return this.graphStore.removeNode(e), this;
  }
  /**
   * marks specified element as a port for specified node
   */
  markPort(e) {
    const o = this.portIdGenerator.create(e.id);
    if (this.graph.getPort(o) !== null)
      throw new b("failed to add port with existing id");
    if (this.graph.getNode(e.nodeId) === null)
      throw new b("failed to mark port for nonexistent node");
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
      throw new b("failed to update nonexistent port");
    return this.graphStore.updatePort(e, o ?? {}), this;
  }
  /**
   * unmarks specified port
   * all the edges adjacent to the port get removed
   */
  unmarkPort(e) {
    if (this.graph.getPort(e) === null)
      throw new b("failed to unmark non existing port");
    return this.graphStore.removePort(e), this;
  }
  /**
   * adds new edge
   */
  addEdge(e) {
    const o = this.edgeIdGenerator.create(e.id);
    if (this.graph.getEdge(o) !== null)
      throw new b("failed to add edge with existing id");
    if (this.graph.getPort(e.from) === null)
      throw new b("failed to add edge from nonexistent port");
    if (this.graph.getPort(e.to) === null)
      throw new b("failed to add edge to nonexistent port");
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
      throw new b("failed to update nonexistent edge");
    return this.graphStore.updateEdge(e, o ?? {}), this;
  }
  /**
   * removes specified edge
   */
  removeEdge(e) {
    if (this.graph.getEdge(e) === null)
      throw new b("failed to remove nonexistent edge");
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
    this.onBeforeDestroyEmitter.emit(), this.graphStore.onAfterNodeAdded.unsubscribe(this.onAfterNodeAdded), this.graphStore.onAfterNodeUpdated.unsubscribe(this.onAfterNodeUpdated), this.graphStore.onAfterNodePriorityUpdated.unsubscribe(
      this.onAfterNodePriorityUpdated
    ), this.graphStore.onBeforeNodeRemoved.unsubscribe(this.onBeforeNodeRemoved), this.graphStore.onAfterPortUpdated.unsubscribe(this.onAfterPortUpdated), this.graphStore.onBeforePortRemoved.unsubscribe(this.onBeforePortUnmarked), this.graphStore.onAfterEdgeAdded.unsubscribe(this.onAfterEdgeAdded), this.graphStore.onAfterEdgeShapeUpdated.unsubscribe(
      this.onAfterEdgeShapeUpdated
    ), this.graphStore.onAfterEdgeUpdated.unsubscribe(this.onAfterEdgeUpdated), this.graphStore.onAfterEdgePriorityUpdated.unsubscribe(
      this.onAfterEdgePriorityUpdated
    ), this.graphStore.onBeforeEdgeRemoved.unsubscribe(this.onBeforeEdgeRemoved), this.graphStore.onBeforeClear.unsubscribe(this.onBeforeClear), this.clear(), this.htmlView.destroy();
  }
}
class Ce {
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
const te = (t) => ({
  scale: 1 / t.scale,
  x: -t.x / t.scale,
  y: -t.y / t.scale
}), oe = {
  scale: 1,
  x: 0,
  y: 0
};
class Re {
  constructor() {
    i(this, "viewportMatrix", oe);
    i(this, "contentMatrix", oe);
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
    }, this.contentMatrix = te(this.viewportMatrix), this.afterUpdateEmitter.emit();
  }
  patchContentMatrix(e) {
    this.beforeUpdateEmitter.emit(), this.contentMatrix = {
      scale: e.scale ?? this.contentMatrix.scale,
      x: e.x ?? this.contentMatrix.x,
      y: e.y ?? this.contentMatrix.y
    }, this.viewportMatrix = te(this.contentMatrix), this.afterUpdateEmitter.emit();
  }
}
class G {
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
    new G(e);
  }
  handleNodeResize(e) {
    const o = this.elementToNodeId.get(e);
    this.canvas.updateNode(o), this.canvas.graph.getNodeAdjacentEdgeIds(o).forEach((s) => {
      this.canvas.updateEdge(s);
    });
  }
}
const Ue = (t) => {
  var g, f, v, y, p, E;
  const e = ((g = t == null ? void 0 : t.events) == null ? void 0 : g.onNodeDrag) ?? (() => {
  }), o = ((f = t == null ? void 0 : t.events) == null ? void 0 : f.onBeforeNodeDrag) ?? (() => !0), r = ((v = t == null ? void 0 : t.events) == null ? void 0 : v.onNodeDragFinished) ?? (() => {
  }), s = (t == null ? void 0 : t.moveOnTop) === !1, d = (y = t == null ? void 0 : t.mouse) == null ? void 0 : y.dragCursor, n = d !== void 0 ? d : "grab", h = (p = t == null ? void 0 : t.mouse) == null ? void 0 : p.mouseDownEventVerifier, c = h !== void 0 ? h : (S) => S.button === 0, a = (E = t == null ? void 0 : t.mouse) == null ? void 0 : E.mouseUpEventVerifier;
  return {
    freezePriority: s,
    dragCursor: n,
    mouseDownEventVerifier: c,
    mouseUpEventVerifier: a !== void 0 ? a : (S) => S.button === 0,
    onNodeDrag: e,
    onBeforeNodeDrag: o,
    onNodeDragFinished: r
  };
}, U = (t, e, o) => {
  const { x: r, y: s, width: d, height: n } = t.getBoundingClientRect();
  return e >= r && e <= r + d && o >= s && o <= s + n;
}, B = (t, e, o) => e >= 0 && e <= t.innerWidth && o >= 0 && o <= t.innerHeight, $ = (t, e) => {
  e !== null ? t.style.cursor = e : t.style.removeProperty("cursor");
};
class J {
  constructor(e, o, r) {
    i(this, "grabbedNodeId", null);
    i(this, "maxNodePriority", 0);
    i(this, "previousTouchCoordinates", null);
    i(this, "nodeIds", /* @__PURE__ */ new Map());
    i(this, "window", window);
    i(this, "graph");
    i(this, "onAfterNodeAdded", (e) => {
      this.updateMaxNodePriority(e);
      const o = this.graph.getNode(e);
      this.nodeIds.set(o.element, e), o.element.addEventListener("mousedown", this.onMouseDown), o.element.addEventListener("touchstart", this.onTouchStart);
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
      if (!this.options.mouseDownEventVerifier(e))
        return;
      const o = e.currentTarget, r = this.nodeIds.get(o), s = this.graph.getNode(r);
      this.options.onBeforeNodeDrag({
        nodeId: r,
        element: s.element,
        x: s.x,
        y: s.y
      }) && (e.stopImmediatePropagation(), this.grabbedNodeId = r, $(this.element, this.options.dragCursor), this.moveNodeOnTop(r), this.window.addEventListener("mouseup", this.onWindowMouseUp), this.window.addEventListener("mousemove", this.onWindowMouseMove));
    });
    i(this, "onTouchStart", (e) => {
      if (e.touches.length !== 1)
        return;
      e.stopImmediatePropagation(), this.previousTouchCoordinates = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
      const o = e.currentTarget, r = this.nodeIds.get(o), s = this.graph.getNode(r);
      this.options.onBeforeNodeDrag({
        nodeId: r,
        element: s.element,
        x: s.x,
        y: s.y
      }) && (this.grabbedNodeId = r, this.moveNodeOnTop(r), this.window.addEventListener("touchmove", this.onWindowTouchMove), this.window.addEventListener("touchend", this.onWindowTouchFinish), this.window.addEventListener("touchcancel", this.onWindowTouchFinish));
    });
    i(this, "onWindowMouseMove", (e) => {
      if (!U(this.element, e.clientX, e.clientY) || !B(this.window, e.clientX, e.clientY)) {
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
      if (!U(this.element, o.clientX, o.clientY) || !B(this.window, o.clientX, o.clientY)) {
        this.cancelTouchDrag();
        return;
      }
      if (this.grabbedNodeId !== null && this.previousTouchCoordinates !== null) {
        const r = o.clientX - this.previousTouchCoordinates.x, s = o.clientY - this.previousTouchCoordinates.y;
        this.dragNode(this.grabbedNodeId, r, s), this.previousTouchCoordinates = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
      }
    });
    i(this, "onWindowTouchFinish", () => {
      this.previousTouchCoordinates = null, this.cancelTouchDrag();
    });
    i(this, "options");
    this.canvas = e, this.element = o, this.options = Ue(r), this.graph = e.graph, this.graph.onAfterNodeAdded.subscribe(this.onAfterNodeAdded), this.graph.onAfterNodeUpdated.subscribe(this.onAfterNodeUpdated), this.graph.onBeforeNodeRemoved.subscribe(this.onBeforeNodeRemoved), this.graph.onBeforeClear.subscribe(this.onBeforeClear), this.canvas.onBeforeDestroy.subscribe(this.onBeforeDestroy);
  }
  static configure(e, o, r) {
    new J(e, o, r);
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
  moveNodeOnTop(e) {
    if (this.options.freezePriority)
      return;
    this.maxNodePriority += 2, this.canvas.updateNode(e, { priority: this.maxNodePriority });
    const o = this.maxNodePriority - 1;
    this.graph.getNodeAdjacentEdgeIds(e).forEach((s) => {
      this.canvas.updateEdge(s, { priority: o });
    });
  }
  cancelMouseDrag() {
    const e = this.graph.getNode(this.grabbedNodeId);
    e !== null && this.options.onNodeDragFinished({
      nodeId: this.grabbedNodeId,
      element: e.element,
      x: e.x,
      y: e.y
    }), this.grabbedNodeId = null, $(this.element, null), this.removeMouseDragListeners();
  }
  removeMouseDragListeners() {
    this.window.removeEventListener("mouseup", this.onWindowMouseUp), this.window.removeEventListener("mousemove", this.onWindowMouseMove);
  }
  cancelTouchDrag() {
    this.previousTouchCoordinates = null;
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
  updateMaxNodePriority(e) {
    const o = this.graph.getNode(e).priority;
    this.maxNodePriority = Math.max(this.maxNodePriority, o);
  }
}
const Be = (t) => {
  const e = t.minX !== null ? t.minX : -1 / 0, o = t.maxX !== null ? t.maxX : 1 / 0, r = t.minY !== null ? t.minY : -1 / 0, s = t.maxY !== null ? t.maxY : 1 / 0;
  return (d) => {
    let n = d.nextTransform.x, h = d.nextTransform.y;
    n < e && n < d.prevTransform.x && (n = Math.min(d.prevTransform.x, e));
    const c = d.canvasWidth * d.prevTransform.scale, a = o - c;
    n > a && n > d.prevTransform.x && (n = Math.max(d.prevTransform.x, a)), h < r && h < d.prevTransform.y && (h = Math.min(d.prevTransform.y, r));
    const l = d.canvasHeight * d.prevTransform.scale, g = s - l;
    return h > g && h > d.prevTransform.y && (h = Math.max(d.prevTransform.y, g)), { scale: d.nextTransform.scale, x: n, y: h };
  };
}, $e = (t) => {
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
}, Ie = (t) => (e) => t.reduce(
  (o, r) => r({
    prevTransform: e.prevTransform,
    nextTransform: o,
    canvasWidth: e.canvasWidth,
    canvasHeight: e.canvasHeight
  }),
  e.nextTransform
), re = (t) => {
  if (typeof t == "function")
    return t;
  switch (t.type) {
    case "scale-limit":
      return $e({
        minContentScale: t.minContentScale ?? 0,
        maxContentScale: t.maxContentScale ?? 1 / 0
      });
    case "shift-limit":
      return Be({
        minX: t.minX ?? -1 / 0,
        maxX: t.maxX ?? 1 / 0,
        minY: t.minY ?? -1 / 0,
        maxY: t.maxY ?? 1 / 0
      });
  }
}, We = (t) => {
  var y, p, E, S, V, D, M, L, Z, _, q, O;
  const e = (y = t == null ? void 0 : t.scale) == null ? void 0 : y.mouseWheelSensitivity, o = e !== void 0 ? e : 1.2, r = t == null ? void 0 : t.transformPreprocessor;
  let s;
  r !== void 0 ? Array.isArray(r) ? s = Ie(
    r.map(
      (P) => re(P)
    )
  ) : s = re(r) : s = (P) => P.nextTransform;
  const d = ((p = t == null ? void 0 : t.shift) == null ? void 0 : p.cursor) !== void 0 ? t.shift.cursor : "grab", n = ((E = t == null ? void 0 : t.events) == null ? void 0 : E.onBeforeTransformChange) ?? (() => {
  }), h = ((S = t == null ? void 0 : t.events) == null ? void 0 : S.onTransformChange) ?? (() => {
  }), c = (V = t == null ? void 0 : t.shift) == null ? void 0 : V.mouseDownEventVerifier, a = c !== void 0 ? c : (P) => P.button === 0, l = (D = t == null ? void 0 : t.shift) == null ? void 0 : D.mouseUpEventVerifier, g = l !== void 0 ? l : (P) => P.button === 0, f = (M = t == null ? void 0 : t.scale) == null ? void 0 : M.mouseWheelEventVerifier, v = f !== void 0 ? f : () => !0;
  return {
    wheelSensitivity: o,
    onTransformStarted: ((L = t == null ? void 0 : t.events) == null ? void 0 : L.onTransformStarted) ?? (() => {
    }),
    onTransformFinished: ((Z = t == null ? void 0 : t.events) == null ? void 0 : Z.onTransformFinished) ?? (() => {
    }),
    onBeforeTransformChange: n,
    onTransformChange: h,
    transformPreprocessor: s,
    shiftCursor: d,
    mouseDownEventVerifier: a,
    mouseUpEventVerifier: g,
    mouseWheelEventVerifier: v,
    scaleWheelFinishTimeout: ((_ = t == null ? void 0 : t.scale) == null ? void 0 : _.wheelFinishTimeout) ?? 500,
    onResizeTransformStarted: ((q = t == null ? void 0 : t.events) == null ? void 0 : q.onResizeTransformStarted) ?? (() => {
    }),
    onResizeTransformFinished: ((O = t == null ? void 0 : t.events) == null ? void 0 : O.onResizeTransformFinished) ?? (() => {
    })
  };
}, Fe = (t, e, o) => ({
  scale: t.scale,
  x: t.x + t.scale * e,
  y: t.y + t.scale * o
}), ze = (t, e, o, r) => ({
  scale: t.scale * e,
  x: t.scale * (1 - e) * o + t.x,
  y: t.scale * (1 - e) * r + t.y
}), R = (t) => {
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
};
class Y {
  constructor(e, o, r) {
    i(this, "window", window);
    i(this, "viewport");
    i(this, "prevTouches", null);
    i(this, "wheelFinishTimer", null);
    i(this, "transformInProgress", !1);
    i(this, "onBeforeDestroy", () => {
      this.removeMouseDragListeners(), this.removeTouchDragListeners(), this.observer.unobserve(this.element), this.element.removeEventListener("mousedown", this.onMouseDown), this.element.removeEventListener("wheel", this.onWheelScroll), this.element.removeEventListener("touchstart", this.onTouchStart), this.canvas.onBeforeDestroy.unsubscribe(this.onBeforeDestroy);
    });
    i(this, "onMouseDown", (e) => {
      this.element === null || !this.options.mouseDownEventVerifier(e) || ($(this.element, this.options.shiftCursor), this.window.addEventListener("mousemove", this.onWindowMouseMove), this.window.addEventListener("mouseup", this.onWindowMouseUp), this.startRegisteredTransform());
    });
    i(this, "onWindowMouseMove", (e) => {
      if (this.element === null || !U(this.element, e.clientX, e.clientY) || !B(this.window, e.clientX, e.clientY)) {
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
        this.transformInProgress || this.options.onTransformFinished(), this.wheelFinishTimer = null;
      }, this.options.scaleWheelFinishTimeout);
    });
    i(this, "onTouchStart", (e) => {
      if (this.prevTouches !== null) {
        this.prevTouches = R(e);
        return;
      }
      this.prevTouches = R(e), this.window.addEventListener("touchmove", this.onWindowTouchMove), this.window.addEventListener("touchend", this.onWindowTouchFinish), this.window.addEventListener("touchcancel", this.onWindowTouchFinish), this.startRegisteredTransform();
    });
    i(this, "onWindowTouchMove", (e) => {
      const o = R(e);
      if (!o.touches.every(
        (s) => U(this.element, s[0], s[1]) && B(this.window, s[0], s[1])
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
      e.touches.length > 0 ? this.prevTouches = R(e) : this.stopTouchDrag();
    });
    i(this, "observer", new ResizeObserver(() => {
      const e = this.viewport.getViewportMatrix(), { width: o, height: r } = this.element.getBoundingClientRect(), s = this.options.transformPreprocessor({
        prevTransform: e,
        nextTransform: e,
        canvasWidth: o,
        canvasHeight: r
      });
      this.options.onResizeTransformStarted(), this.canvas.patchViewportMatrix(s), this.options.onResizeTransformFinished();
    }));
    i(this, "options");
    this.canvas = e, this.element = o, this.options = We(r), this.viewport = e.viewport, this.observer.observe(this.element), this.element.addEventListener("mousedown", this.onMouseDown), this.element.addEventListener("wheel", this.onWheelScroll), this.element.addEventListener("touchstart", this.onTouchStart), e.onBeforeDestroy.subscribe(this.onBeforeDestroy);
  }
  static configure(e, o, r) {
    new Y(
      e,
      o,
      r
    );
  }
  moveViewport(e, o) {
    const r = this.viewport.getViewportMatrix(), s = Fe(r, e, o), { width: d, height: n } = this.element.getBoundingClientRect(), h = this.options.transformPreprocessor({
      prevTransform: r,
      nextTransform: s,
      canvasWidth: d,
      canvasHeight: n
    });
    this.performTransform(h);
  }
  scaleViewport(e, o, r) {
    const s = this.canvas.viewport.getViewportMatrix(), d = ze(s, e, o, r), { width: n, height: h } = this.element.getBoundingClientRect(), c = this.options.transformPreprocessor({
      prevTransform: s,
      nextTransform: d,
      canvasWidth: n,
      canvasHeight: h
    });
    this.performTransform(c);
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
    this.options.onBeforeTransformChange(), this.canvas.patchViewportMatrix(e), this.options.onTransformChange();
  }
  startRegisteredTransform() {
    this.transformInProgress = !0, this.options.onTransformStarted();
  }
  finishRegisteredTransform() {
    this.transformInProgress = !1, this.options.onTransformFinished();
  }
}
class K {
  constructor(e, o, r, s, d) {
    i(this, "canvasResizeObserver");
    i(this, "window", window);
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
    var f, v, y, p, E;
    this.canvas = e, this.element = o, this.trigger = s, this.virtualScrollOptions = d, this.nodeHorizontal = this.virtualScrollOptions.nodeContainingRadius.horizontal, this.nodeVertical = this.virtualScrollOptions.nodeContainingRadius.vertical, this.canvasResizeObserver = new this.window.ResizeObserver((S) => {
      const V = S[0];
      this.viewportWidth = V.contentRect.width, this.viewportHeight = V.contentRect.height, this.scheduleLoadAreaAroundViewport();
    }), this.viewport = e.viewport;
    const n = ((f = r == null ? void 0 : r.events) == null ? void 0 : f.onResizeTransformStarted) ?? (() => {
    }), h = ((v = r == null ? void 0 : r.events) == null ? void 0 : v.onResizeTransformFinished) ?? (() => {
    }), c = ((y = r == null ? void 0 : r.events) == null ? void 0 : y.onTransformChange) ?? (() => {
    }), a = ((p = r == null ? void 0 : r.events) == null ? void 0 : p.onBeforeTransformChange) ?? (() => {
    }), l = ((E = r == null ? void 0 : r.events) == null ? void 0 : E.onTransformFinished) ?? (() => {
    }), g = {
      ...r,
      events: {
        ...r == null ? void 0 : r.events,
        onResizeTransformStarted: () => {
          this.userTransformInProgress = !0, n();
        },
        onResizeTransformFinished: () => {
          this.userTransformInProgress = !1, h();
        },
        onBeforeTransformChange: () => {
          this.userTransformInProgress = !0, a();
        },
        onTransformChange: () => {
          this.userTransformInProgress = !1;
          const S = this.viewportMatrix;
          this.viewportMatrix = this.viewport.getViewportMatrix(), S.scale !== this.viewportMatrix.scale && this.scheduleEnsureViewportAreaLoaded(), c();
        },
        onTransformFinished: () => {
          this.scheduleLoadAreaAroundViewport(), l();
        }
      }
    };
    Y.configure(
      e,
      this.element,
      g
    ), this.viewportMatrix = this.viewport.getViewportMatrix(), this.trigger.subscribe(this.updateLoadedArea), this.canvasResizeObserver.observe(this.element), this.canvas.viewport.onAfterUpdated.subscribe(this.onAfterViewportUpdated), this.canvas.onBeforeDestroy.subscribe(this.onBeforeDestroy);
  }
  static configure(e, o, r, s, d) {
    new K(
      e,
      o,
      r,
      s,
      d
    );
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
const Ye = () => {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  return t.style.position = "absolute", t.style.inset = "0", t;
}, Xe = () => {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  return t.setAttribute("fill", "url(#pattern)"), t;
}, He = () => {
  const t = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "pattern"
  );
  return t.setAttribute("id", "pattern"), t;
}, ke = (t, e) => {
  const o = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  return o.setAttribute("cx", "0"), o.setAttribute("cy", "0"), o.setAttribute("r", `${t}`), o.setAttribute("fill", `${e}`), o;
}, je = (t) => t instanceof SVGElement ? t : ke(
  (t == null ? void 0 : t.radius) ?? 1.5,
  (t == null ? void 0 : t.color) ?? "#d8d8d8"
), Ge = (t) => {
  const e = t.tileDimensions, o = (e == null ? void 0 : e.width) ?? 25, r = (e == null ? void 0 : e.height) ?? 25, s = je(t.renderer ?? {});
  return {
    tileWidth: o,
    tileHeight: r,
    renderer: s,
    maxViewportScale: t.maxViewportScale ?? 10
  };
};
class Q {
  constructor(e, o, r) {
    i(this, "svg", Ye());
    i(this, "patternRenderingRectangle", Xe());
    i(this, "pattern", He());
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
      const d = this.tileWidth / r, n = this.tileHeight / s;
      this.pattern.setAttribute("width", `${d}`), this.pattern.setAttribute("height", `${n}`);
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
    const s = Ge(o);
    this.tileWidth = s.tileWidth, this.tileHeight = s.tileHeight, this.halfTileWidth = this.tileWidth / 2, this.halfTileHeight = this.tileHeight / 2, this.patternContent = s.renderer, this.maxViewportScale = s.maxViewportScale;
    const d = `translate(${this.halfTileWidth}, ${this.halfTileHeight})`;
    this.patternContent.setAttribute("transform", d), this.pattern.appendChild(this.patternContent);
    const n = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    n.appendChild(this.pattern), this.svg.appendChild(n), this.svg.appendChild(this.patternRenderingRectangle), this.resizeObserver.observe(this.host), this.canvas.viewport.onAfterUpdated.subscribe(this.onAfterTransformUpdated), this.onAfterTransformUpdated(), this.canvas.onBeforeDestroy.subscribe(this.onBeforeDestroy);
  }
  static configure(e, o, r) {
    new Q(e, o, r);
  }
  updateVisibility() {
    const o = this.canvas.viewport.getViewportMatrix().scale > this.maxViewportScale;
    o && this.visible ? (this.visible = !1, this.host.removeChild(this.svg)) : !o && !this.visible && (this.visible = !0, this.host.appendChild(this.svg));
  }
}
const Je = () => {
  const t = document.createElement("div");
  return t.style.width = "100%", t.style.height = "100%", t.style.position = "relative", t;
}, ie = () => {
  const t = document.createElement("div");
  return t.style.position = "absolute", t.style.inset = "0", t;
};
class Ke {
  constructor(e) {
    i(this, "background", ie());
    i(this, "main", ie());
    i(this, "host", Je());
    this.element = e, this.element.appendChild(this.host), this.host.appendChild(this.background), this.host.appendChild(this.main);
  }
  destroy() {
    this.host.removeChild(this.main), this.host.removeChild(this.background), this.element.removeChild(this.host);
  }
}
class Ze {
  constructor() {
    i(this, "element", null);
    i(this, "canvasDefaults", {});
    i(this, "dragOptions", {});
    i(this, "transformOptions", {});
    i(this, "backgroundOptions", {});
    i(this, "virtualScrollOptions");
    i(this, "hasDraggableNode", !1);
    i(this, "hasTransformableViewport", !1);
    i(this, "hasResizeReactiveNodes", !1);
    i(this, "hasBackground", !1);
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
    return this.hasDraggableNode = !0, this.dragOptions = e ?? {}, this;
  }
  /**
   * enables viewport transformable by user
   */
  enableUserTransformableViewport(e) {
    return this.hasTransformableViewport = !0, this.transformOptions = e ?? {}, this;
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
  enableBackground(e) {
    return this.hasBackground = !0, this.backgroundOptions = e ?? {}, this;
  }
  /**
   * builds final canvas
   */
  build() {
    if (this.element === null)
      throw new b(
        "unable to build canvas when no attach element specified"
      );
    let e = this.boxRenderingTrigger;
    this.virtualScrollOptions !== void 0 && e === void 0 && (e = new se());
    const o = new Ce(), r = new Re(), s = new Ke(this.element);
    let d = new le(
      o,
      r,
      s.main
    );
    e !== void 0 && (d = new ue(d, o, e));
    const n = new Le(
      this.element,
      o,
      r,
      d,
      this.canvasDefaults
    ), h = () => {
      s.destroy(), n.onBeforeDestroy.unsubscribe(h);
    };
    return n.onBeforeDestroy.subscribe(h), this.hasBackground && Q.configure(
      n,
      this.backgroundOptions,
      s.background
    ), this.hasResizeReactiveNodes && G.configure(n), this.hasDraggableNode && J.configure(
      n,
      s.main,
      this.dragOptions
    ), this.virtualScrollOptions !== void 0 ? K.configure(
      n,
      s.main,
      this.transformOptions,
      e,
      this.virtualScrollOptions
    ) : this.hasTransformableViewport && Y.configure(
      n,
      s.main,
      this.transformOptions
    ), this.reset(), n;
  }
  /**
   * @deprecated
   * CanvasBuilder should be single use object
   */
  reset() {
    this.element = null, this.canvasDefaults = {}, this.dragOptions = {}, this.transformOptions = {}, this.backgroundOptions = {}, this.virtualScrollOptions = void 0, this.hasDraggableNode = !1, this.hasTransformableViewport = !1, this.hasResizeReactiveNodes = !1, this.hasBackground = !1, this.boxRenderingTrigger = void 0;
  }
}
export {
  me as BezierEdgeShape,
  Ze as CanvasBuilder,
  se as EventSubject,
  Ne as HorizontalEdgeShape,
  b as HtmlGraphError,
  Pe as StraightEdgeShape,
  Ve as VerticalEdgeShape
};
