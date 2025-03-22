var oe = Object.defineProperty;
var re = (t, e, o) => e in t ? oe(t, e, { enumerable: !0, configurable: !0, writable: !0, value: o }) : t[e] = o;
var i = (t, e, o) => re(t, typeof e != "symbol" ? e + "" : e, o);
class ie {
  constructor(e) {
    i(this, "viewport");
    i(this, "graph");
    i(this, "internalTransformation");
    i(this, "internalModel");
    i(this, "graphStoreController");
    i(this, "htmlView");
    i(this, "onAfterNodeAdded", (e) => {
      this.htmlView.attachNode(e);
    });
    i(this, "onAfterEdgeAdded", (e) => {
      this.htmlView.attachEdge(e);
    });
    i(this, "onAfterEdgeShapeUpdated", (e) => {
      this.htmlView.updateEdgeShape(e);
    });
    i(this, "onAfterEdgePriorityUpdated", (e) => {
      this.htmlView.updateEdgePriority(e);
    });
    i(this, "onAfterEdgeUpdated", (e) => {
      this.htmlView.renderEdge(e);
    });
    i(this, "onAfterPortUpdated", (e) => {
      this.internalModel.getPortAdjacentEdgeIds(e).forEach((r) => {
        this.htmlView.renderEdge(r);
      });
    });
    i(this, "onAfterNodePriorityUpdated", (e) => {
      this.htmlView.updateNodePriority(e);
    });
    i(this, "onAfterNodeUpdated", (e) => {
      this.htmlView.updateNodeCoordinates(e), this.internalModel.getNodeAdjacentEdgeIds(e).forEach((r) => {
        this.htmlView.renderEdge(r);
      });
    });
    i(this, "onBeforeEdgeRemoved", (e) => {
      this.htmlView.detachEdge(e);
    });
    i(this, "onBeforeNodeRemoved", (e) => {
      this.htmlView.detachNode(e);
    });
    this.graph = e.graph, this.internalModel = e.graphStore, this.internalTransformation = e.viewportTransformer, this.viewport = e.viewport, this.htmlView = e.htmlView, this.graphStoreController = e.graphStoreController, this.graphStoreController.onAfterNodeAdded.subscribe(this.onAfterNodeAdded), this.graphStoreController.onAfterEdgeAdded.subscribe(this.onAfterEdgeAdded), this.graphStoreController.onAfterEdgeShapeUpdated.subscribe(
      this.onAfterEdgeShapeUpdated
    ), this.graphStoreController.onAfterEdgePriorityUpdated.subscribe(
      this.onAfterEdgePriorityUpdated
    ), this.graphStoreController.onAfterEdgeUpdated.subscribe(
      this.onAfterEdgeUpdated
    ), this.graphStoreController.onAfterPortUpdated.subscribe(
      this.onAfterPortUpdated
    ), this.graphStoreController.onAfterNodePriorityUpdated.subscribe(
      this.onAfterNodePriorityUpdated
    ), this.graphStoreController.onAfterNodeUpdated.subscribe(
      this.onAfterNodeUpdated
    ), this.graphStoreController.onBeforeEdgeRemoved.subscribe(
      this.onBeforeEdgeRemoved
    ), this.graphStoreController.onBeforeNodeRemoved.subscribe(
      this.onBeforeNodeRemoved
    );
  }
  attach(e) {
    return this.htmlView.attach(e), this;
  }
  detach() {
    return this.htmlView.detach(), this;
  }
  addNode(e) {
    return this.graphStoreController.addNode(e), this;
  }
  updateNode(e, o) {
    return this.graphStoreController.updateNode(e, o ?? {}), this;
  }
  removeNode(e) {
    return this.graphStoreController.removeNode(e), this;
  }
  addEdge(e) {
    return this.graphStoreController.addEdge(e), this;
  }
  updateEdge(e, o) {
    return this.graphStoreController.updateEdge(e, o ?? {}), this;
  }
  removeEdge(e) {
    return this.graphStoreController.removeEdge(e), this;
  }
  markPort(e) {
    return this.graphStoreController.markPort(e), this;
  }
  updatePort(e, o) {
    return this.graphStoreController.updatePort(e, o ?? {}), this;
  }
  unmarkPort(e) {
    return this.graphStoreController.unmarkPort(e), this;
  }
  patchViewportMatrix(e) {
    return this.internalTransformation.patchViewportMatrix(e), this;
  }
  patchContentMatrix(e) {
    return this.internalTransformation.patchContentMatrix(e), this;
  }
  clear() {
    return this.htmlView.clear(), this.graphStoreController.clear(), this;
  }
  destroy() {
    this.htmlView.destroy(), this.graphStoreController.clear(), this.graphStoreController.onAfterNodeAdded.unsubscribe(
      this.onAfterNodeAdded
    ), this.graphStoreController.onAfterEdgeAdded.unsubscribe(
      this.onAfterEdgeAdded
    ), this.graphStoreController.onAfterEdgeShapeUpdated.unsubscribe(
      this.onAfterEdgeShapeUpdated
    ), this.graphStoreController.onAfterEdgePriorityUpdated.unsubscribe(
      this.onAfterEdgePriorityUpdated
    ), this.graphStoreController.onAfterEdgeUpdated.unsubscribe(
      this.onAfterEdgeUpdated
    ), this.graphStoreController.onAfterPortUpdated.unsubscribe(
      this.onAfterPortUpdated
    ), this.graphStoreController.onAfterNodePriorityUpdated.unsubscribe(
      this.onAfterNodePriorityUpdated
    ), this.graphStoreController.onAfterNodeUpdated.unsubscribe(
      this.onAfterNodeUpdated
    ), this.graphStoreController.onBeforeEdgeRemoved.unsubscribe(
      this.onBeforeEdgeRemoved
    ), this.graphStoreController.onBeforeNodeRemoved.unsubscribe(
      this.onBeforeNodeRemoved
    );
  }
}
class L {
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
class q {
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
const p = () => {
  const t = new q();
  return [t, t];
};
class se {
  constructor(e, o) {
    i(this, "nodeIdGenerator", new L(
      (e) => this.graphStore.getNode(e) !== void 0
    ));
    i(this, "portIdGenerator", new L(
      (e) => this.graphStore.getPort(e) !== void 0
    ));
    i(this, "edgeIdGenerator", new L(
      (e) => this.graphStore.getEdge(e) !== void 0
    ));
    i(this, "onAfterNodeAdded");
    i(this, "onAfterNodeAddedEmitter");
    i(this, "onAfterEdgeAdded");
    i(this, "onAfterEdgeAddedEmitter");
    i(this, "onAfterEdgeShapeUpdated");
    i(this, "onAfterEdgeShapeUpdatedEmitter");
    i(this, "onAfterEdgePriorityUpdated");
    i(this, "onAfterEdgePriorityUpdatedEmitter");
    i(this, "onAfterEdgeUpdated");
    i(this, "onAfterEdgeUpdatedEmitter");
    i(this, "onAfterPortUpdated");
    i(this, "onAfterPortUpdatedEmitter");
    i(this, "onAfterNodePriorityUpdated");
    i(this, "onAfterNodePriorityUpdatedEmitter");
    i(this, "onAfterNodeUpdated");
    i(this, "onAfterNodeUpdatedEmitter");
    i(this, "onBeforeEdgeRemoved");
    i(this, "onBeforeEdgeRemovedEmitter");
    i(this, "onBeforeNodeRemoved");
    i(this, "onBeforeNodeRemovedEmitter");
    this.graphStore = e, this.options = o, [this.onAfterNodeAddedEmitter, this.onAfterNodeAdded] = p(), [this.onAfterEdgeAddedEmitter, this.onAfterEdgeAdded] = p(), [this.onAfterEdgeShapeUpdatedEmitter, this.onAfterEdgeShapeUpdated] = p(), [this.onAfterEdgePriorityUpdatedEmitter, this.onAfterEdgePriorityUpdated] = p(), [this.onAfterEdgeUpdatedEmitter, this.onAfterEdgeUpdated] = p(), [this.onAfterPortUpdatedEmitter, this.onAfterPortUpdated] = p(), [this.onAfterNodePriorityUpdatedEmitter, this.onAfterNodePriorityUpdated] = p(), [this.onAfterNodeUpdatedEmitter, this.onAfterNodeUpdated] = p(), [this.onBeforeEdgeRemovedEmitter, this.onBeforeEdgeRemoved] = p(), [this.onBeforeNodeRemovedEmitter, this.onBeforeNodeRemoved] = p();
  }
  addNode(e) {
    const o = this.nodeIdGenerator.create(e.id);
    if (this.graphStore.getNode(o) !== void 0)
      throw new E("failed to add node with existing id");
    this.graphStore.addNode({
      nodeId: o,
      element: e.element,
      x: e.x,
      y: e.y,
      centerFn: e.centerFn ?? this.options.nodes.centerFn,
      priority: e.priority ?? this.options.nodes.priorityFn()
    }), this.onAfterNodeAddedEmitter.emit(o), Array.from(e.ports ?? []).forEach((r) => {
      this.markPort({
        id: r.id,
        element: r.element,
        nodeId: o,
        direction: r.direction
      });
    });
  }
  markPort(e) {
    const o = this.portIdGenerator.create(e.id);
    if (this.graphStore.getPort(o) !== void 0)
      throw new E("failed to add port with existing id");
    if (this.graphStore.getNode(e.nodeId) === void 0)
      throw new E("failed to set port on nonexisting node");
    this.graphStore.addPort({
      portId: o,
      element: e.element,
      nodeId: e.nodeId,
      direction: e.direction ?? this.options.ports.direction
    });
  }
  addEdge(e) {
    const o = this.edgeIdGenerator.create(e.id);
    if (this.graphStore.getEdge(o) !== void 0)
      throw new E("failed to add edge with existing id");
    if (this.graphStore.getPort(e.from) === void 0)
      throw new E("failed to add edge from nonexisting port");
    if (this.graphStore.getPort(e.to) === void 0)
      throw new E("failed to add edge to nonexisting port");
    this.graphStore.addEdge({
      edgeId: o,
      from: e.from,
      to: e.to,
      shape: e.shape ?? this.options.edges.shapeFactory(),
      priority: e.priority ?? this.options.edges.priorityFn()
    }), this.onAfterEdgeAddedEmitter.emit(o);
  }
  updateEdge(e, o) {
    const r = this.graphStore.getEdge(e);
    if (r === void 0)
      throw new E("failed to update nonexisting edge");
    o.shape !== void 0 && (r.shape = o.shape, this.onAfterEdgeShapeUpdatedEmitter.emit(e)), o.from !== void 0 && this.graphStore.updateEdgeFrom(e, o.from), o.to !== void 0 && this.graphStore.updateEdgeTo(e, o.to), this.onAfterEdgeUpdatedEmitter.emit(e), o.priority !== void 0 && (r.priority = o.priority, this.onAfterEdgePriorityUpdatedEmitter.emit(e));
  }
  updatePort(e, o) {
    const r = this.graphStore.getPort(e);
    if (r === void 0)
      throw new E("failed to unset nonexisting port");
    r.direction = o.direction ?? r.direction, this.onAfterPortUpdatedEmitter.emit(e);
  }
  updateNode(e, o) {
    const r = this.graphStore.getNode(e);
    if (r === void 0)
      throw new E("failed to update nonexisting node");
    r.x = (o == null ? void 0 : o.x) ?? r.x, r.y = (o == null ? void 0 : o.y) ?? r.y, r.centerFn = o.centerFn ?? r.centerFn, this.onAfterNodeUpdatedEmitter.emit(e), o.priority !== void 0 && (r.priority = o.priority, this.onAfterNodePriorityUpdatedEmitter.emit(e));
  }
  removeEdge(e) {
    if (this.graphStore.getEdge(e) === void 0)
      throw new E("failed to remove nonexisting edge");
    this.onBeforeEdgeRemovedEmitter.emit(e), this.graphStore.removeEdge(e);
  }
  unmarkPort(e) {
    if (this.graphStore.getPort(e) === void 0)
      throw new E("failed to unset nonexisting port");
    this.graphStore.getPortAdjacentEdgeIds(e).forEach((o) => {
      this.removeEdge(o);
    }), this.graphStore.removePort(e);
  }
  removeNode(e) {
    if (this.graphStore.getNode(e) === void 0)
      throw new E("failed to remove nonexisting node");
    this.graphStore.getNodePortIds(e).forEach((o) => {
      this.unmarkPort(o);
    }), this.onBeforeNodeRemovedEmitter.emit(e), this.graphStore.removeNode(e);
  }
  clear() {
    this.graphStore.clear(), this.nodeIdGenerator.reset(), this.portIdGenerator.reset(), this.edgeIdGenerator.reset();
  }
}
const ne = (t, e) => ({
  x: t / 2,
  y: e / 2
}), v = (t, e, o) => ({
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
  ].map((a) => v(a, t, w)).map((a) => ({ x: a.x + e.x, y: a.y + e.y })), s = `M ${d[0].x} ${d[0].y}`, h = `L ${d[1].x} ${d[1].y}`, c = `L ${d[2].x} ${d[2].y}`;
  return `${s} ${h} ${c}`;
}, D = (t, e) => {
  const o = [];
  if (t.length > 0 && o.push(`M ${t[0].x} ${t[0].y}`), t.length === 2 && o.push(`L ${t[1].x} ${t[1].y}`), t.length > 2) {
    const r = t.length - 1;
    let n = 0, d = 0, s = 0;
    t.forEach((h, c) => {
      let a = 0, l = 0, g = 0;
      const f = c > 0, x = c < r, y = f && x;
      if (f && (a = -n, l = -d, g = s), x) {
        const C = t[c + 1];
        n = C.x - h.x, d = C.y - h.y, s = Math.sqrt(n * n + d * d);
      }
      const A = s !== 0 ? Math.min((y ? e : 0) / s, c < r - 1 ? 0.5 : 1) : 0, N = y ? { x: h.x + n * A, y: h.y + d * A } : h, V = g !== 0 ? Math.min((y ? e : 0) / g, c > 1 ? 0.5 : 1) : 0, b = y ? { x: h.x + a * V, y: h.y + l * V } : h;
      c > 0 && o.push(`L ${b.x} ${b.y}`), y && o.push(
        `C ${h.x} ${h.y} ${h.x} ${h.y} ${N.x} ${N.y}`
      );
    });
  }
  return o.join(" ");
}, F = () => {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  return t.style.pointerEvents = "none", t.style.position = "absolute", t.style.top = "0", t.style.left = "0", t.style.overflow = "visible", t;
}, U = () => {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "g");
  return t.style.transformOrigin = "50% 50%", t;
}, B = (t, e) => {
  const o = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return o.setAttribute("stroke", t), o.setAttribute("stroke-width", `${e}`), o.setAttribute("fill", "none"), o;
}, M = (t) => {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("fill", t), e;
}, k = (t, e) => {
  const o = {
    x: t.x + t.width / 2,
    y: t.y + t.height / 2
  }, r = {
    x: e.x + e.width / 2,
    y: e.y + e.height / 2
  }, n = Math.min(o.x, r.x), d = Math.min(o.y, r.y), s = Math.abs(r.x - o.x), h = Math.abs(r.y - o.y), c = o.x <= r.x ? 1 : -1, a = o.y <= r.y ? 1 : -1;
  return {
    x: n,
    y: d,
    width: s,
    height: h,
    flipX: c,
    flipY: a
  };
}, he = (t) => {
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
  }, n = {
    x: o.x - t.toVect.x * t.curvature,
    y: o.y - t.toVect.y * t.curvature
  }, d = `M ${e.x} ${e.y} C ${r.x} ${r.y}, ${n.x} ${n.y}, ${o.x} ${o.y}`, s = t.hasSourceArrow ? "" : `M ${w.x} ${w.y} L ${e.x} ${e.y} `, h = t.hasTargetArrow ? "" : ` M ${o.x} ${o.y} L ${t.to.x} ${t.to.y}`;
  return `${s}${d}${h}`;
}, de = (t) => {
  const e = t.hasSourceArrow ? v(
    { x: t.arrowLength, y: w.y },
    t.fromVect,
    w
  ) : w, o = t.hasTargetArrow ? v(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVect,
    t.to
  ) : t.to, r = t.arrowLength, n = Math.cos(t.detourDirection) * t.detourDistance, d = Math.sin(t.detourDirection) * t.detourDistance, s = n * t.flipX, h = d * t.flipY, c = v(
    { x: r, y: w.y },
    t.fromVect,
    w
  ), a = {
    x: c.x + s,
    y: c.y + h
  }, l = v(
    { x: t.to.x - r, y: t.to.y },
    t.toVect,
    t.to
  ), g = {
    x: l.x + s,
    y: l.y + h
  }, f = { x: (a.x + g.x) / 2, y: (a.y + g.y) / 2 }, x = {
    x: c.x + t.curvature * t.fromVect.x,
    y: c.y + t.curvature * t.fromVect.y
  }, y = {
    x: l.x - t.curvature * t.toVect.x,
    y: l.y - t.curvature * t.toVect.y
  }, S = {
    x: c.x + s,
    y: c.y + h
  }, A = {
    x: l.x + s,
    y: l.y + h
  };
  return [
    `M ${e.x} ${e.y}`,
    `L ${c.x} ${c.y}`,
    `C ${x.x} ${x.y} ${S.x} ${S.y} ${f.x} ${f.y}`,
    `C ${A.x} ${A.y} ${y.x} ${y.y} ${l.x} ${l.y}`,
    `L ${o.x} ${o.y}`
  ].join(" ");
}, ce = (t) => {
  const e = t.hasSourceArrow ? v(
    { x: t.arrowLength, y: w.y },
    t.fromVect,
    w
  ) : w, o = t.hasTargetArrow ? v(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVect,
    t.to
  ) : t.to, r = t.arrowLength + t.arrowOffset, n = r - t.roundness, d = v({ x: n, y: w.y }, t.fromVect, w), s = v(
    { x: t.to.x - n, y: t.to.y },
    t.toVect,
    t.to
  ), h = Math.max((d.x + s.x) / 2, r), c = t.to.y / 2, a = { x: t.flipX > 0 ? h : -r, y: d.y }, l = { x: a.x, y: c }, g = {
    x: t.flipX > 0 ? t.to.x - h : t.to.x + r,
    y: s.y
  }, f = { x: g.x, y: c };
  return D(
    [e, d, a, l, f, g, s, o],
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
  ) : t.to, r = t.arrowLength + t.arrowOffset, n = v(
    { x: r, y: w.y },
    t.fromVect,
    w
  ), d = Math.cos(t.detourDirection) * t.detourDistance, s = Math.sin(t.detourDirection) * t.detourDistance, h = d * t.flipX, c = s * t.flipY, a = { x: n.x + h, y: n.y + c }, l = v(
    { x: t.to.x - r, y: t.to.y },
    t.toVect,
    t.to
  ), g = { x: l.x + h, y: l.y + c };
  return D(
    [e, n, a, g, l, o],
    t.roundness
  );
}, ae = (t) => {
  const e = t.hasSourceArrow ? v(
    { x: t.arrowLength, y: w.y },
    t.fromVect,
    w
  ) : w, o = t.hasTargetArrow ? v(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVect,
    t.to
  ) : t.to, r = t.arrowLength + t.arrowOffset, n = v({ x: r, y: w.y }, t.fromVect, w), d = v(
    { x: t.to.x - r, y: t.to.y },
    t.toVect,
    t.to
  );
  return D([e, n, d, o], t.roundness);
}, le = (t) => {
  const e = t.hasSourceArrow ? v(
    { x: t.arrowLength, y: w.y },
    t.fromVect,
    w
  ) : w, o = t.hasTargetArrow ? v(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVect,
    t.to
  ) : t.to, r = t.arrowLength + t.arrowOffset, n = r - t.roundness, d = v({ x: n, y: w.y }, t.fromVect, w), s = v(
    { x: t.to.x - n, y: t.to.y },
    t.toVect,
    t.to
  ), h = Math.max((d.y + s.y) / 2, r), c = t.to.x / 2, a = { x: d.x, y: t.flipY > 0 ? h : -r }, l = { x: c, y: a.y }, g = {
    x: s.x,
    y: t.flipY > 0 ? t.to.y - h : t.to.y + r
  }, f = { x: c, y: g.y };
  return D(
    [e, d, a, l, f, g, s, o],
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
    (c) => v(c, t.fromVect, w)
  ), h = `M ${w.x} ${w.y} L ${s[0].x} ${s[0].y} `;
  return `${t.hasSourceArrow || t.hasTargetArrow ? "" : h}${D(s, t.roundness)}`;
}, ge = (t) => {
  const e = t.smallRadius, o = t.radius, r = Math.sqrt(e * e + o * o), n = e + o, d = t.arrowLength + r * (1 - o / n), s = e * o / n, c = [
    { x: t.arrowLength, y: w.y },
    { x: d, y: s },
    { x: d, y: -s }
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
class ue {
  constructor(e) {
    i(this, "svg", F());
    i(this, "group", U());
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
    this.svg.appendChild(this.group), this.line = B(o, r), this.group.appendChild(this.line), this.hasSourceArrow && (this.sourceArrow = M(o), this.group.appendChild(this.sourceArrow)), this.hasTargetArrow && (this.targetArrow = M(o), this.group.appendChild(this.targetArrow));
  }
  render(e) {
    const { x: o, y: r, width: n, height: d, flipX: s, flipY: h } = k(
      e.from,
      e.to
    );
    this.svg.style.transform = `translate(${o}px, ${r}px)`, this.svg.style.width = `${n}px`, this.svg.style.height = `${d}px`, this.group.style.transform = `scale(${s}, ${h})`;
    const c = T(
      e.from.direction,
      s,
      h
    ), a = T(e.to.direction, s, h), l = {
      x: n,
      y: d
    };
    let g, f = a, x = -this.arrowLength;
    if (e.from.portId === e.to.portId ? (g = ge({
      fromVect: c,
      radius: this.portCycleRadius,
      smallRadius: this.portCycleSmallRadius,
      arrowLength: this.arrowLength,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), f = c, x = this.arrowLength) : e.from.nodeId === e.to.nodeId ? g = de({
      to: l,
      fromVect: c,
      toVect: a,
      flipX: s,
      flipY: h,
      arrowLength: this.arrowLength,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      curvature: this.curvature,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }) : g = he({
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
class we {
  constructor(e) {
    i(this, "svg", F());
    i(this, "group", U());
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
    this.svg.appendChild(this.group), this.line = B(r, n), this.group.appendChild(this.line), this.hasSourceArrow && (this.sourceArrow = M(r), this.group.appendChild(this.sourceArrow)), this.hasTargetArrow && (this.targetArrow = M(r), this.group.appendChild(this.targetArrow));
  }
  render(e) {
    const { x: o, y: r, width: n, height: d, flipX: s, flipY: h } = k(
      e.from,
      e.to
    );
    this.svg.style.transform = `translate(${o}px, ${r}px)`, this.svg.style.width = `${n}px`, this.svg.style.height = `${d}px`, this.group.style.transform = `scale(${s}, ${h})`;
    const c = T(
      e.from.direction,
      s,
      h
    ), a = T(e.to.direction, s, h), l = {
      x: n,
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
      flipX: s,
      flipY: h,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }) : g = ce({
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
class fe {
  constructor(e) {
    i(this, "svg", F());
    i(this, "group", U());
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
    this.svg.appendChild(this.group), this.line = B(r, n), this.group.appendChild(this.line), this.hasSourceArrow && (this.sourceArrow = M(r), this.group.appendChild(this.sourceArrow)), this.hasTargetArrow && (this.targetArrow = M(r), this.group.appendChild(this.targetArrow));
  }
  render(e) {
    const { x: o, y: r, width: n, height: d, flipX: s, flipY: h } = k(
      e.from,
      e.to
    );
    this.svg.style.transform = `translate(${o}px, ${r}px)`, this.svg.style.width = `${n}px`, this.svg.style.height = `${d}px`, this.group.style.transform = `scale(${s}, ${h})`;
    const c = T(
      e.from.direction,
      s,
      h
    ), a = T(e.to.direction, s, h), l = {
      x: n,
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
      flipX: s,
      flipY: h,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }) : g = ae({
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
class ye {
  constructor(e) {
    i(this, "svg", F());
    i(this, "group", U());
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
    this.svg.appendChild(this.group), this.line = B(r, n), this.group.appendChild(this.line), this.hasSourceArrow && (this.sourceArrow = M(r), this.group.appendChild(this.sourceArrow)), this.hasTargetArrow && (this.targetArrow = M(r), this.group.appendChild(this.targetArrow));
  }
  render(e) {
    const { x: o, y: r, width: n, height: d, flipX: s, flipY: h } = k(
      e.from,
      e.to
    );
    this.svg.style.transform = `translate(${o}px, ${r}px)`, this.svg.style.width = `${n}px`, this.svg.style.height = `${d}px`, this.group.style.transform = `scale(${s}, ${h})`;
    const c = T(
      e.from.direction,
      s,
      h
    ), a = T(e.to.direction, s, h), l = {
      x: n,
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
      flipX: s,
      flipY: h,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }) : g = le({
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
const ve = (t) => {
  if (typeof t == "function")
    return t;
  switch (t == null ? void 0 : t.type) {
    case "straight":
      return () => new fe({
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
      return () => new we({
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
      return () => new ye({
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
      return () => new ue({
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
}, Y = (t) => () => t, J = Y(0), xe = () => {
  let t = 0;
  return () => t++;
}, Ee = (t, e) => {
  let o = J, r = J;
  const n = xe();
  return t === "incremental" && (o = n), e === "incremental" && (r = n), typeof t == "number" && (o = Y(t)), typeof e == "number" && (r = Y(e)), typeof t == "function" && (o = t), typeof e == "function" && (r = e), {
    nodesPriorityFn: o,
    edgesPriorityFn: r
  };
}, Ae = (t) => {
  var o, r, n, d, s;
  const e = Ee(
    (o = t == null ? void 0 : t.nodes) == null ? void 0 : o.priority,
    (r = t == null ? void 0 : t.edges) == null ? void 0 : r.priority
  );
  return {
    nodes: {
      centerFn: ((n = t == null ? void 0 : t.nodes) == null ? void 0 : n.centerFn) ?? ne,
      priorityFn: e.nodesPriorityFn
    },
    ports: {
      direction: ((d = t == null ? void 0 : t.ports) == null ? void 0 : d.direction) ?? 0
    },
    edges: {
      shapeFactory: ve(((s = t == null ? void 0 : t.edges) == null ? void 0 : s.shape) ?? {}),
      priorityFn: e.edgesPriorityFn
    }
  };
}, Q = (t) => ({
  scale: 1 / t.scale,
  x: -t.x / t.scale,
  y: -t.y / t.scale
}), Z = {
  scale: 1,
  x: 0,
  y: 0
};
class pe {
  constructor() {
    i(this, "viewportMatrix", Z);
    i(this, "contentMatrix", Z);
    i(this, "emitter");
    i(this, "onAfterUpdate");
    [this.emitter, this.onAfterUpdate] = p();
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
    }, this.contentMatrix = Q(this.viewportMatrix), this.emitter.emit();
  }
  patchContentMatrix(e) {
    this.contentMatrix = {
      scale: e.scale ?? this.contentMatrix.scale,
      x: e.x ?? this.contentMatrix.x,
      y: e.y ?? this.contentMatrix.y
    }, this.viewportMatrix = Q(this.contentMatrix), this.emitter.emit();
  }
}
class Se {
  constructor(e) {
    this.transformer = e;
  }
  getViewportMatrix() {
    return { ...this.transformer.getViewportMatrix() };
  }
  getContentMatrix() {
    return { ...this.transformer.getContentMatrix() };
  }
}
class Ne {
  constructor(e) {
    this.graphStore = e;
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
      direction: o.direction
    };
  }
  getAllPortIds() {
    return this.graphStore.getAllPortIds();
  }
  getNodePortIds(e) {
    return this.graphStore.getNode(e) === void 0 ? null : this.graphStore.getNodePortIds(e);
  }
  getPortNodeId(e) {
    return this.graphStore.getPortNodeId(e) ?? null;
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
class Te {
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
  addNode(e) {
    this.nodes.set(e.nodeId, {
      element: e.element,
      x: e.x,
      y: e.y,
      centerFn: e.centerFn,
      priority: e.priority
    }), this.nodePorts.set(e.nodeId, /* @__PURE__ */ new Map());
  }
  getAllNodeIds() {
    return Array.from(this.nodes.keys());
  }
  getNode(e) {
    return this.nodes.get(e);
  }
  removeNode(e) {
    this.nodes.delete(e), this.nodePorts.delete(e);
  }
  addPort(e) {
    this.ports.set(e.portId, {
      element: e.element,
      direction: e.direction
    }), this.cycleEdges.set(e.portId, /* @__PURE__ */ new Set()), this.incommingEdges.set(e.portId, /* @__PURE__ */ new Set()), this.outcommingEdges.set(e.portId, /* @__PURE__ */ new Set()), this.portNodeId.set(e.portId, e.nodeId), this.nodePorts.get(e.nodeId).set(e.portId, e.element);
  }
  getPort(e) {
    return this.ports.get(e);
  }
  getAllPortIds() {
    return Array.from(this.ports.keys());
  }
  getNodePortIds(e) {
    const o = this.nodePorts.get(e);
    if (o !== void 0)
      return Array.from(o.keys());
  }
  getPortNodeId(e) {
    return this.portNodeId.get(e);
  }
  removePort(e) {
    const o = this.portNodeId.get(e);
    this.portNodeId.delete(e), this.nodePorts.get(o).delete(e), this.ports.delete(e);
  }
  addEdge(e) {
    this.edges.set(e.edgeId, {
      from: e.from,
      to: e.to,
      shape: e.shape,
      priority: e.priority
    }), e.from !== e.to ? (this.outcommingEdges.get(e.from).add(e.edgeId), this.incommingEdges.get(e.to).add(e.edgeId)) : this.cycleEdges.get(e.from).add(e.edgeId);
  }
  updateEdgeFrom(e, o) {
    const r = this.edges.get(e);
    this.removeEdge(e), this.addEdge({
      edgeId: e,
      from: o,
      to: r.to,
      shape: r.shape,
      priority: r.priority
    });
  }
  updateEdgeTo(e, o) {
    const r = this.edges.get(e);
    this.removeEdge(e), this.addEdge({
      edgeId: e,
      from: r.from,
      to: o,
      shape: r.shape,
      priority: r.priority
    });
  }
  getAllEdgeIds() {
    return Array.from(this.edges.keys());
  }
  getEdge(e) {
    return this.edges.get(e);
  }
  removeEdge(e) {
    const o = this.edges.get(e), r = o.from, n = o.to;
    this.cycleEdges.get(r).delete(e), this.cycleEdges.get(n).delete(e), this.incommingEdges.get(r).delete(e), this.incommingEdges.get(n).delete(e), this.outcommingEdges.get(r).delete(e), this.outcommingEdges.get(n).delete(e), this.edges.delete(e);
  }
  clear() {
    this.edges.clear(), this.incommingEdges.clear(), this.outcommingEdges.clear(), this.cycleEdges.clear(), this.ports.clear(), this.nodePorts.clear(), this.portNodeId.clear(), this.nodes.clear();
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
    const o = Array.from(this.nodePorts.get(e).keys());
    let r = [];
    return o.forEach((n) => {
      r = [...r, ...this.getPortIncomingEdgeIds(n)];
    }), r;
  }
  getNodeOutcomingEdgeIds(e) {
    const o = Array.from(this.nodePorts.get(e).keys());
    let r = [];
    return o.forEach((n) => {
      r = [...r, ...this.getPortOutcomingEdgeIds(n)];
    }), r;
  }
  getNodeCycleEdgeIds(e) {
    const o = Array.from(this.nodePorts.get(e).keys());
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
}
class me {
  constructor(e, o) {
    i(this, "viewport");
    i(this, "graph");
    i(this, "viewportTransformer");
    i(this, "graphStore");
    i(this, "htmlView");
    i(this, "graphStoreController");
    this.graphStore = new Te(), this.graph = new Ne(this.graphStore), this.viewportTransformer = new pe(), this.viewport = new Se(this.viewportTransformer), this.htmlView = o(this.graphStore, this.viewportTransformer), this.graphStoreController = new se(
      this.graphStore,
      Ae(e)
    );
  }
}
const Me = () => {
  const t = document.createElement("div");
  return t.style.width = "100%", t.style.height = "100%", t.style.position = "relative", t.style.overflow = "hidden", t;
}, Pe = () => {
  const t = document.createElement("div");
  return t.style.position = "absolute", t.style.top = "0", t.style.left = "0", t.style.width = "0", t.style.height = "0", t;
}, Ve = () => {
  const t = document.createElement("div");
  return t.style.position = "absolute", t.style.top = "0", t.style.left = "0", t.style.visibility = "hidden", t;
};
class ee {
  constructor(e, o) {
    i(this, "canvasWrapper", null);
    i(this, "host", Me());
    i(this, "container", Pe());
    i(this, "nodeIdToWrapperElementMap", /* @__PURE__ */ new Map());
    i(this, "edgeIdToElementMap", /* @__PURE__ */ new Map());
    i(this, "applyTransform", () => {
      const e = this.viewportTransformer.getContentMatrix();
      this.container.style.transform = `matrix(${e.scale}, 0, 0, ${e.scale}, ${e.x}, ${e.y})`;
    });
    this.graphStore = e, this.viewportTransformer = o, this.host.appendChild(this.container), this.viewportTransformer.onAfterUpdate.subscribe(this.applyTransform);
  }
  attach(e) {
    this.detach(), this.canvasWrapper = e, this.canvasWrapper.appendChild(this.host);
  }
  detach() {
    this.canvasWrapper !== null && (this.canvasWrapper.removeChild(this.host), this.canvasWrapper = null);
  }
  attachNode(e) {
    const o = this.graphStore.getNode(e), r = Ve();
    r.appendChild(o.element), this.container.appendChild(r), this.nodeIdToWrapperElementMap.set(e, r), this.updateNodeCoordinates(e), this.updateNodePriority(e), r.style.visibility = "visible";
  }
  detachNode(e) {
    const o = this.graphStore.getNode(e), r = this.nodeIdToWrapperElementMap.get(e);
    r.removeChild(o.element), this.container.removeChild(r), this.nodeIdToWrapperElementMap.delete(e);
  }
  attachEdge(e) {
    const o = this.graphStore.getEdge(e);
    this.edgeIdToElementMap.set(e, o.shape.svg), this.container.appendChild(o.shape.svg), this.renderEdge(e), this.updateEdgePriority(e);
  }
  detachEdge(e) {
    const o = this.graphStore.getEdge(e);
    this.container.removeChild(o.shape.svg), this.edgeIdToElementMap.delete(e);
  }
  clear() {
    this.edgeIdToElementMap.forEach((e, o) => {
      this.detachEdge(o);
    }), this.nodeIdToWrapperElementMap.forEach((e, o) => {
      this.detachNode(o);
    });
  }
  destroy() {
    this.clear(), this.detach(), this.viewportTransformer.onAfterUpdate.unsubscribe(this.applyTransform), this.host.removeChild(this.container);
  }
  updateNodeCoordinates(e) {
    const o = this.nodeIdToWrapperElementMap.get(e), r = this.graphStore.getNode(e), { width: n, height: d } = r.element.getBoundingClientRect(), s = this.viewportTransformer.getViewportMatrix().scale, h = r.centerFn(n, d), c = r.x - s * h.x, a = r.y - s * h.y;
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
    const o = this.graphStore.getEdge(e), r = this.graphStore.getPort(o.from), n = this.graphStore.getPort(o.to), d = r.element.getBoundingClientRect(), s = n.element.getBoundingClientRect(), h = this.host.getBoundingClientRect(), c = this.viewportTransformer.getViewportMatrix(), a = {
      x: c.scale * (d.left - h.left) + c.x,
      y: c.scale * (d.top - h.top) + c.y
    }, l = {
      x: c.scale * (s.left - h.left) + c.x,
      y: c.scale * (s.top - h.top) + c.y
    }, g = {
      x: a.x,
      y: a.y,
      width: d.width * c.scale,
      height: d.height * c.scale,
      direction: r.direction,
      portId: o.from,
      nodeId: this.graphStore.getPortNodeId(o.from)
    }, f = {
      x: l.x,
      y: l.y,
      width: s.width * c.scale,
      height: s.height * c.scale,
      direction: n.direction,
      portId: o.to,
      nodeId: this.graphStore.getPortNodeId(o.to)
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
class be {
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
    const o = this.graphStore.getEdge(e), r = this.graphStore.getPortNodeId(o.from), n = this.graphStore.getPortNodeId(o.to), d = this.graphStore.getNode(r), s = this.graphStore.getNode(n), h = Math.min(d.x, s.x), c = Math.max(d.x, s.x), a = Math.min(d.y, s.y), l = Math.max(d.y, s.y);
    return h <= this.xTo && c >= this.xFrom && a <= this.yTo && l >= this.yFrom;
  }
}
class Ce {
  constructor(e, o, r) {
    i(this, "attachedNodes", /* @__PURE__ */ new Set());
    i(this, "attachedEdges", /* @__PURE__ */ new Set());
    i(this, "renderingBox");
    i(this, "updateViewport", (e) => {
      this.renderingBox.setRenderingBox(e);
      const o = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Set();
      this.graphStore.getAllNodeIds().forEach((s) => {
        const h = this.renderingBox.hasNode(s), c = this.attachedNodes.has(s);
        h && !c ? o.add(s) : !h && c && r.add(s);
      }), this.graphStore.getAllEdgeIds().forEach((s) => {
        const h = this.renderingBox.hasEdge(s), c = this.attachedEdges.has(s), a = this.graphStore.getEdge(s), l = this.graphStore.getPortNodeId(a.from), g = this.graphStore.getPortNodeId(a.to);
        h && (this.renderingBox.hasNode(l) || (o.add(l), r.delete(l)), this.renderingBox.hasNode(g) || (o.add(g), r.delete(g))), h && !c ? n.add(s) : !h && c && d.add(s);
      }), d.forEach((s) => {
        this.handleDetachEdge(s);
      }), r.forEach((s) => {
        this.handleDetachNode(s);
      }), o.forEach((s) => {
        this.attachedNodes.has(s) || this.handleAttachNode(s);
      }), n.forEach((s) => {
        this.handleAttachEdge(s);
      });
    });
    this.htmlView = e, this.graphStore = o, this.trigger = r, this.renderingBox = new be(this.graphStore), this.trigger.subscribe(this.updateViewport);
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
  updateNodeCoordinates(e) {
    this.attachedNodes.has(e) ? this.htmlView.updateNodeCoordinates(e) : this.renderingBox.hasNode(e) && (this.handleAttachNode(e), this.graphStore.getNodeAdjacentEdgeIds(e).forEach((o) => {
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
    const o = this.graphStore.getEdge(e), r = this.graphStore.getPortNodeId(o.from), n = this.graphStore.getPortNodeId(o.to);
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
const Le = (t, e) => new ee(t, e), De = (t) => (e, o) => new Ce(
  new ee(e, o),
  e,
  t
), I = (t, e, o) => {
  const { x: r, y: n, width: d, height: s } = t.getBoundingClientRect();
  return e >= r && e <= r + d && o >= n && o <= n + s;
}, W = (t, e, o) => e >= 0 && e <= t.innerWidth && o >= 0 && o <= t.innerHeight, R = (t, e) => {
  e !== null ? t.style.cursor = e : t.style.removeProperty("cursor");
}, $e = (t) => {
  var g, f, x, y, S, A;
  const e = ((g = t == null ? void 0 : t.events) == null ? void 0 : g.onNodeDrag) ?? (() => {
  }), o = ((f = t == null ? void 0 : t.events) == null ? void 0 : f.onBeforeNodeDrag) ?? (() => !0), r = ((x = t == null ? void 0 : t.events) == null ? void 0 : x.onNodeDragFinished) ?? (() => {
  }), n = (t == null ? void 0 : t.moveOnTop) === !1, d = (y = t == null ? void 0 : t.mouse) == null ? void 0 : y.dragCursor, s = d !== void 0 ? d : "grab", h = (S = t == null ? void 0 : t.mouse) == null ? void 0 : S.mouseDownEventVerifier, c = h !== void 0 ? h : (N) => N.button === 0, a = (A = t == null ? void 0 : t.mouse) == null ? void 0 : A.mouseUpEventVerifier;
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
class Ie {
  constructor(e, o) {
    i(this, "graph");
    i(this, "viewport");
    i(this, "maxNodePriority", 0);
    i(this, "nodes", /* @__PURE__ */ new Map());
    i(this, "grabbedNodeId", null);
    i(this, "nodeIdGenerator", new L(
      (e) => this.nodes.has(e)
    ));
    i(this, "element", null);
    i(this, "onWindowMouseMove", (e) => {
      if (this.element !== null && (!I(this.element, e.clientX, e.clientY) || !W(this.window, e.clientX, e.clientY))) {
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
      if (this.element !== null && (!I(this.element, o.clientX, o.clientY) || !W(this.window, o.clientX, o.clientY))) {
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
    this.canvas = e, this.viewport = this.canvas.viewport, this.graph = this.canvas.graph, this.options = $e(o ?? {});
  }
  attach(e) {
    return this.detach(), this.element = e, this.canvas.attach(this.element), this;
  }
  detach() {
    return this.canvas.detach(), this.element !== null && (this.element = null), this;
  }
  addNode(e) {
    const o = this.nodeIdGenerator.create(e.id);
    this.canvas.addNode({ ...e, id: o }), this.updateMaxNodePriority(o);
    const r = (d) => {
      if (this.element === null || !this.options.mouseDownEventVerifier(d))
        return;
      const s = this.graph.getNode(o);
      this.options.onBeforeNodeDrag({
        nodeId: o,
        element: e.element,
        x: s.x,
        y: s.y
      }) && (d.stopImmediatePropagation(), this.grabbedNodeId = o, R(this.element, this.options.dragCursor), this.moveNodeOnTop(o), this.window.addEventListener("mouseup", this.onWindowMouseUp), this.window.addEventListener("mousemove", this.onWindowMouseMove));
    }, n = (d) => {
      if (d.touches.length !== 1)
        return;
      d.stopImmediatePropagation(), this.previousTouchCoords = {
        x: d.touches[0].clientX,
        y: d.touches[0].clientY
      };
      const s = this.graph.getNode(o);
      this.options.onBeforeNodeDrag({
        nodeId: o,
        element: e.element,
        x: s.x,
        y: s.y
      }) && (this.grabbedNodeId = o, this.moveNodeOnTop(o), this.window.addEventListener("touchmove", this.onWindowTouchMove), this.window.addEventListener("touchend", this.onWindowTouchFinish), this.window.addEventListener("touchcancel", this.onWindowTouchFinish));
    };
    return this.nodes.set(o, {
      element: e.element,
      onMouseDown: r,
      onTouchStart: n
    }), e.element.addEventListener("mousedown", r), e.element.addEventListener("touchstart", n), this;
  }
  updateNode(e, o) {
    return this.canvas.updateNode(e, o), this.updateMaxNodePriority(e), this;
  }
  removeNode(e) {
    const o = this.nodes.get(e);
    return o !== void 0 && (o.element.removeEventListener("mousedown", o.onMouseDown), o.element.removeEventListener("touchstart", o.onTouchStart)), this.nodes.delete(e), this.canvas.removeNode(e), this;
  }
  markPort(e) {
    return this.canvas.markPort(e), this;
  }
  updatePort(e, o) {
    return this.canvas.updatePort(e, o), this;
  }
  unmarkPort(e) {
    return this.canvas.unmarkPort(e), this;
  }
  addEdge(e) {
    return this.canvas.addEdge(e), this;
  }
  updateEdge(e, o) {
    return this.canvas.updateEdge(e, o), this;
  }
  removeEdge(e) {
    return this.canvas.removeEdge(e), this;
  }
  patchViewportMatrix(e) {
    return this.canvas.patchViewportMatrix(e), this;
  }
  patchContentMatrix(e) {
    return this.canvas.patchContentMatrix(e), this;
  }
  clear() {
    return this.canvas.clear(), this.nodes.forEach((e) => {
      e.element.removeEventListener("mousedown", e.onMouseDown), e.element.removeEventListener("touchstart", e.onTouchStart);
    }), this.nodes.clear(), this.maxNodePriority = 0, this;
  }
  destroy() {
    this.detach(), this.clear(), this.removeMouseDragListeners(), this.removeTouchDragListeners(), this.canvas.destroy();
  }
  dragNode(e, o, r) {
    const n = this.graph.getNode(e);
    if (n === null)
      return;
    const d = this.canvas.viewport.getContentMatrix(), s = d.scale * n.x + d.x, h = d.scale * n.y + d.y, c = s + o, a = h + r, l = this.canvas.viewport.getViewportMatrix(), g = l.scale * c + l.x, f = l.scale * a + l.y;
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
const We = (t) => {
  const e = t.minX !== null ? t.minX : -1 / 0, o = t.maxX !== null ? t.maxX : 1 / 0, r = t.minY !== null ? t.minY : -1 / 0, n = t.maxY !== null ? t.maxY : 1 / 0;
  return (d) => {
    let s = d.nextTransform.x, h = d.nextTransform.y;
    s < e && s < d.prevTransform.x && (s = Math.min(d.prevTransform.x, e));
    const c = d.canvasWidth * d.prevTransform.scale, a = o - c;
    s > a && s > d.prevTransform.x && (s = Math.max(d.prevTransform.x, a)), h < r && h < d.prevTransform.y && (h = Math.min(d.prevTransform.y, r));
    const l = d.canvasHeight * d.prevTransform.scale, g = n - l;
    return h > g && h > d.prevTransform.y && (h = Math.max(d.prevTransform.y, g)), { scale: d.nextTransform.scale, x: s, y: h };
  };
}, Re = (t) => {
  const e = t.maxContentScale, o = t.minContentScale, r = e !== null ? 1 / e : 0, n = o !== null ? 1 / o : 1 / 0;
  return (d) => {
    const s = d.prevTransform, h = d.nextTransform;
    let c = h.scale, a = h.x, l = h.y;
    if (h.scale > n && h.scale > s.scale) {
      c = Math.max(s.scale, n), a = s.x, l = s.y;
      const g = (c - s.scale) / (h.scale - s.scale);
      a = s.x + (h.x - s.x) * g, l = s.y + (h.y - s.y) * g;
    }
    if (h.scale < r && h.scale < s.scale) {
      c = Math.min(s.scale, r), a = s.x, l = s.y;
      const g = (c - s.scale) / (h.scale - s.scale);
      a = s.x + (h.x - s.x) * g, l = s.y + (h.y - s.y) * g;
    }
    return {
      scale: c,
      x: a,
      y: l
    };
  };
}, Fe = (t) => (e) => t.reduce(
  (o, r) => r({
    prevTransform: e.prevTransform,
    nextTransform: o,
    canvasWidth: e.canvasWidth,
    canvasHeight: e.canvasHeight
  }),
  e.nextTransform
), O = (t) => {
  if (typeof t == "function")
    return t;
  switch (t.type) {
    case "scale-limit":
      return Re({
        minContentScale: t.minContentScale ?? 0,
        maxContentScale: t.maxContentScale ?? 1 / 0
      });
    case "shift-limit":
      return We({
        minX: t.minX ?? -1 / 0,
        maxX: t.maxX ?? 1 / 0,
        minY: t.minY ?? -1 / 0,
        maxY: t.maxY ?? 1 / 0
      });
  }
}, Ue = (t) => {
  var y, S, A, N, z, V, b, C, j, G, K, _;
  const e = (y = t == null ? void 0 : t.scale) == null ? void 0 : y.mouseWheelSensitivity, o = e !== void 0 ? e : 1.2, r = t == null ? void 0 : t.transformPreprocessor;
  let n;
  r !== void 0 ? Array.isArray(r) ? n = Fe(
    r.map(
      (P) => O(P)
    )
  ) : n = O(r) : n = (P) => P.nextTransform;
  const d = ((S = t == null ? void 0 : t.shift) == null ? void 0 : S.cursor) !== void 0 ? t.shift.cursor : "grab", s = ((A = t == null ? void 0 : t.events) == null ? void 0 : A.onBeforeTransformChange) ?? (() => {
  }), h = ((N = t == null ? void 0 : t.events) == null ? void 0 : N.onTransformChange) ?? (() => {
  }), c = (z = t == null ? void 0 : t.shift) == null ? void 0 : z.mouseDownEventVerifier, a = c !== void 0 ? c : (P) => P.button === 0, l = (V = t == null ? void 0 : t.shift) == null ? void 0 : V.mouseUpEventVerifier, g = l !== void 0 ? l : (P) => P.button === 0, f = (b = t == null ? void 0 : t.scale) == null ? void 0 : b.mouseWheelEventVerifier, x = f !== void 0 ? f : () => !0;
  return {
    wheelSensitivity: o,
    onTransformStarted: ((C = t == null ? void 0 : t.events) == null ? void 0 : C.onTransformStarted) ?? (() => {
    }),
    onTransformFinished: ((j = t == null ? void 0 : t.events) == null ? void 0 : j.onTransformFinished) ?? (() => {
    }),
    onBeforeTransformChange: s,
    onTransformChange: h,
    transformPreprocessor: n,
    shiftCursor: d,
    mouseDownEventVerifier: a,
    mouseUpEventVerifier: g,
    mouseWheelEventVerifier: x,
    scaleWheelFinishTimeout: ((G = t == null ? void 0 : t.scale) == null ? void 0 : G.wheelFinishTimeout) ?? 500,
    onResizeTransformStarted: ((K = t == null ? void 0 : t.events) == null ? void 0 : K.onResizeTransformStarted) ?? (() => {
    }),
    onResizeTransformFinished: ((_ = t == null ? void 0 : t.events) == null ? void 0 : _.onResizeTransformFinished) ?? (() => {
    })
  };
}, $ = (t) => {
  const e = [], o = t.touches.length;
  for (let h = 0; h < o; h++)
    e.push([t.touches[h].clientX, t.touches[h].clientY]);
  const r = e.reduce(
    (h, c) => [h[0] + c[0], h[1] + c[1]],
    [0, 0]
  ), n = [r[0] / o, r[1] / o], s = e.map((h) => [h[0] - n[0], h[1] - n[1]]).reduce(
    (h, c) => h + Math.sqrt(c[0] * c[0] + c[1] * c[1]),
    0
  );
  return {
    x: n[0],
    y: n[1],
    scale: s / o,
    touchesCnt: o,
    touches: e
  };
}, Be = (t, e, o) => ({
  scale: t.scale,
  x: t.x + t.scale * e,
  y: t.y + t.scale * o
}), ke = (t, e, o, r) => ({
  scale: t.scale * e,
  x: t.scale * (1 - e) * o + t.x,
  y: t.scale * (1 - e) * r + t.y
});
class te {
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
      if (this.element === null || !I(this.element, e.clientX, e.clientY) || !W(this.window, e.clientX, e.clientY)) {
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
      const { left: o, top: r } = this.element.getBoundingClientRect(), n = e.clientX - o, d = e.clientY - r, h = 1 / (e.deltaY < 0 ? this.options.wheelSensitivity : 1 / this.options.wheelSensitivity);
      this.wheelFinishTimer === null && this.options.onTransformStarted(), this.scaleViewport(this.element, h, n, d), this.wheelFinishTimer !== null && clearTimeout(this.wheelFinishTimer), this.wheelFinishTimer = setTimeout(() => {
        this.options.onTransformFinished(), this.wheelFinishTimer = null;
      }, this.options.scaleWheelFinishTimeout);
    });
    i(this, "onTouchStart", (e) => {
      if (this.prevTouches !== null) {
        this.prevTouches = $(e);
        return;
      }
      this.prevTouches = $(e), this.window.addEventListener("touchmove", this.onWindowTouchMove), this.window.addEventListener("touchend", this.onWindowTouchFinish), this.window.addEventListener("touchcancel", this.onWindowTouchFinish), this.options.onTransformStarted();
    });
    i(this, "onWindowTouchMove", (e) => {
      const o = this.element;
      if (o === null)
        return;
      const r = $(e);
      if (!r.touches.every(
        (d) => I(o, d[0], d[1]) && W(this.window, d[0], d[1])
      )) {
        this.stopTouchDrag();
        return;
      }
      if ((r.touchesCnt === 1 || r.touchesCnt === 2) && this.moveViewport(
        o,
        -(r.x - this.prevTouches.x),
        -(r.y - this.prevTouches.y)
      ), r.touchesCnt === 2) {
        const { left: d, top: s } = o.getBoundingClientRect(), h = this.prevTouches.x - d, c = this.prevTouches.y - s, l = 1 / (r.scale / this.prevTouches.scale);
        this.scaleViewport(o, l, h, c);
      }
      this.prevTouches = r;
    });
    i(this, "onWindowTouchFinish", (e) => {
      e.touches.length > 0 ? this.prevTouches = $(e) : this.stopTouchDrag();
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
    this.canvas = e, this.options = Ue(o), this.viewport = this.canvas.viewport, this.graph = this.canvas.graph;
  }
  attach(e) {
    return this.detach(), this.element = e, this.observer.observe(this.element), this.element.addEventListener("mousedown", this.onMouseDown), this.element.addEventListener("wheel", this.onWheelScroll), this.element.addEventListener("touchstart", this.onTouchStart), this.canvas.attach(this.element), this;
  }
  detach() {
    return this.canvas.detach(), this.element !== null && (this.observer.unobserve(this.element), this.element.removeEventListener("mousedown", this.onMouseDown), this.element.removeEventListener("wheel", this.onWheelScroll), this.element.removeEventListener("touchstart", this.onTouchStart), this.element = null), this;
  }
  addNode(e) {
    return this.canvas.addNode(e), this;
  }
  updateNode(e, o) {
    return this.canvas.updateNode(e, o), this;
  }
  removeNode(e) {
    return this.canvas.removeNode(e), this;
  }
  markPort(e) {
    return this.canvas.markPort(e), this;
  }
  updatePort(e, o) {
    return this.canvas.updatePort(e, o), this;
  }
  unmarkPort(e) {
    return this.canvas.unmarkPort(e), this;
  }
  addEdge(e) {
    return this.canvas.addEdge(e), this;
  }
  updateEdge(e, o) {
    return this.canvas.updateEdge(e, o), this;
  }
  removeEdge(e) {
    return this.canvas.removeEdge(e), this;
  }
  patchViewportMatrix(e) {
    return this.canvas.patchViewportMatrix(e), this;
  }
  patchContentMatrix(e) {
    return this.canvas.patchContentMatrix(e), this;
  }
  clear() {
    return this.canvas.clear(), this;
  }
  destroy() {
    this.detach(), this.removeMouseDragListeners(), this.removeTouchDragListeners(), this.canvas.destroy();
  }
  moveViewport(e, o, r) {
    const n = this.viewport.getViewportMatrix(), d = Be(n, o, r), { width: s, height: h } = e.getBoundingClientRect(), c = this.options.transformPreprocessor({
      prevTransform: n,
      nextTransform: d,
      canvasWidth: s,
      canvasHeight: h
    });
    this.performTransform(c);
  }
  scaleViewport(e, o, r, n) {
    const d = this.canvas.viewport.getViewportMatrix(), s = ke(d, o, r, n), { width: h, height: c } = e.getBoundingClientRect(), a = this.options.transformPreprocessor({
      prevTransform: d,
      nextTransform: s,
      canvasWidth: h,
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
class ze {
  constructor() {
    i(this, "keyMap", /* @__PURE__ */ new Map());
    i(this, "valueMap", /* @__PURE__ */ new Map());
  }
  set(e, o) {
    this.keyMap.set(e, o), this.valueMap.set(o, e);
  }
  hasKey(e) {
    return this.keyMap.has(e);
  }
  hasValue(e) {
    return this.valueMap.has(e);
  }
  getByKey(e) {
    return this.keyMap.get(e);
  }
  getByValue(e) {
    return this.valueMap.get(e);
  }
  deleteByKey(e) {
    const o = this.keyMap.get(e);
    o !== void 0 && this.valueMap.delete(o), this.keyMap.delete(e);
  }
  deleteByValue(e) {
    const o = this.valueMap.get(e);
    o !== void 0 && this.keyMap.delete(o), this.valueMap.delete(e);
  }
  forEach(e) {
    this.keyMap.forEach((o, r) => {
      e(o, r);
    });
  }
  clear() {
    this.keyMap.clear(), this.valueMap.clear();
  }
}
class Ye {
  constructor(e) {
    i(this, "viewport");
    i(this, "graph");
    i(this, "nodes", new ze());
    i(this, "nodeIdGenerator", new L(
      (e) => this.nodes.hasKey(e)
    ));
    i(this, "nodesResizeObserver");
    i(this, "window", window);
    this.canvas = e, this.nodesResizeObserver = new this.window.ResizeObserver((o) => {
      o.forEach((r) => {
        const n = r.target;
        this.handleNodeResize(n);
      });
    }), this.viewport = this.canvas.viewport, this.graph = this.canvas.graph;
  }
  attach(e) {
    return this.canvas.attach(e), this;
  }
  detach() {
    return this.canvas.detach(), this;
  }
  addNode(e) {
    const o = this.nodeIdGenerator.create(e.id);
    return this.canvas.addNode({
      ...e,
      id: o
    }), this.nodes.set(o, e.element), this.nodesResizeObserver.observe(e.element), this;
  }
  updateNode(e, o) {
    return this.canvas.updateNode(e, o), this;
  }
  removeNode(e) {
    this.canvas.removeNode(e);
    const o = this.nodes.getByKey(e);
    return this.nodes.deleteByKey(e), this.nodesResizeObserver.unobserve(o), this;
  }
  markPort(e) {
    return this.canvas.markPort(e), this;
  }
  updatePort(e, o) {
    return this.canvas.updatePort(e, o), this;
  }
  unmarkPort(e) {
    return this.canvas.unmarkPort(e), this;
  }
  addEdge(e) {
    return this.canvas.addEdge(e), this;
  }
  updateEdge(e, o) {
    return this.canvas.updateEdge(e, o), this;
  }
  removeEdge(e) {
    return this.canvas.removeEdge(e), this;
  }
  patchViewportMatrix(e) {
    return this.canvas.patchViewportMatrix(e), this;
  }
  patchContentMatrix(e) {
    return this.canvas.patchContentMatrix(e), this;
  }
  clear() {
    return this.canvas.clear(), this.nodesResizeObserver.disconnect(), this.nodes.clear(), this;
  }
  destroy() {
    this.clear(), this.canvas.destroy();
  }
  handleNodeResize(e) {
    const o = this.nodes.getByValue(e);
    this.canvas.updateNode(o), this.graph.getNodeAdjacentEdgeIds(o).forEach((n) => {
      this.canvas.updateEdge(n);
    });
  }
}
class Xe {
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
    const d = ((c = r == null ? void 0 : r.events) == null ? void 0 : c.onTransformFinished) ?? (() => {
    }), s = ((a = r == null ? void 0 : r.events) == null ? void 0 : a.onTransformChange) ?? (() => {
    }), h = {
      ...r,
      events: {
        ...r == null ? void 0 : r.events,
        onTransformChange: () => {
          const l = this.viewportMatrix;
          this.viewportMatrix = this.canvas.viewport.getViewportMatrix(), l.scale !== this.viewportMatrix.scale && this.scheduleEnsureViewportAreaLoaded(), s();
        },
        onTransformFinished: () => {
          this.scheduleLoadAreaAroundViewport(), d();
        }
      }
    };
    this.canvas = new te(
      e,
      h
    ), this.viewportMatrix = this.canvas.viewport.getViewportMatrix(), this.viewport = this.canvas.viewport, this.graph = this.canvas.graph, this.trigger.subscribe(this.updateLoadedArea);
  }
  attach(e) {
    return this.detach(), this.element = e, this.canvasResizeObserver.observe(this.element), this.canvas.attach(e), this;
  }
  detach() {
    return this.element !== null && (this.canvasResizeObserver.unobserve(this.element), this.element = null, this.viewportWidth = 0, this.viewportHeight = 0), this.canvas.detach(), this;
  }
  addNode(e) {
    return this.canvas.addNode(e), this;
  }
  updateNode(e, o) {
    return this.canvas.updateNode(e, o), this;
  }
  removeNode(e) {
    return this.canvas.removeNode(e), this;
  }
  markPort(e) {
    return this.canvas.markPort(e), this;
  }
  updatePort(e, o) {
    return this.canvas.updatePort(e, o), this;
  }
  unmarkPort(e) {
    return this.canvas.unmarkPort(e), this;
  }
  addEdge(e) {
    return this.canvas.addEdge(e), this;
  }
  updateEdge(e, o) {
    return this.canvas.updateEdge(e, o), this;
  }
  removeEdge(e) {
    return this.canvas.removeEdge(e), this;
  }
  patchViewportMatrix(e) {
    return this.canvas.patchViewportMatrix(e), this.viewportMatrix = this.canvas.viewport.getViewportMatrix(), this.loadAreaAroundViewport(), this;
  }
  patchContentMatrix(e) {
    return this.canvas.patchContentMatrix(e), this.viewportMatrix = this.canvas.viewport.getViewportMatrix(), this.loadAreaAroundViewport(), this;
  }
  clear() {
    return this.canvas.clear(), this;
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
    const e = this.viewportWidth * this.viewportMatrix.scale, o = this.viewportHeight * this.viewportMatrix.scale, r = this.viewportMatrix.x - this.nodeHorizontal, n = this.viewportMatrix.y - this.nodeVertical, d = this.viewportMatrix.x + e + this.nodeHorizontal, s = this.viewportMatrix.y + o + this.nodeVertical;
    this.loadedArea.xFrom < r && this.loadedArea.xTo > d && this.loadedArea.yFrom < n && this.loadedArea.yTo > s || this.scheduleLoadAreaAroundViewport();
  }
  loadAreaAroundViewport() {
    const e = this.viewportWidth * this.viewportMatrix.scale, o = this.viewportHeight * this.viewportMatrix.scale, r = this.viewportMatrix.x - e - this.nodeHorizontal, n = this.viewportMatrix.y - o - this.nodeVertical, d = 3 * e + 2 * this.nodeHorizontal, s = 3 * o + 2 * this.nodeVertical;
    this.trigger.emit({ x: r, y: n, width: d, height: s });
  }
}
class je {
  constructor() {
    i(this, "coreOptions", {});
    i(this, "dragOptions");
    i(this, "transformOptions");
    i(this, "virtualScrollOptions");
    i(this, "hasDraggableNode", !1);
    i(this, "hasTransformableViewport", !1);
    i(this, "hasResizeReactiveNodes", !1);
    i(this, "boxRenderingTrigger");
  }
  /**
   * specifies options for fundamental aspects of visualization
   */
  setOptions(e) {
    return this.coreOptions = e, this;
  }
  /**
   * enables nodes draggable bu user
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
    let e = this.boxRenderingTrigger;
    this.virtualScrollOptions !== void 0 && e === void 0 && (e = new q());
    const o = e !== void 0 ? De(e) : Le, r = new me(this.coreOptions, o);
    let n = new ie(r);
    return this.hasResizeReactiveNodes && (n = new Ye(n)), this.hasDraggableNode && (n = new Ie(n, this.dragOptions)), this.virtualScrollOptions !== void 0 ? n = new Xe(
      n,
      e,
      this.transformOptions,
      this.virtualScrollOptions
    ) : this.hasTransformableViewport && (n = new te(
      n,
      this.transformOptions
    )), this.reset(), n;
  }
  reset() {
    this.coreOptions = {}, this.dragOptions = void 0, this.transformOptions = void 0, this.virtualScrollOptions = void 0, this.hasDraggableNode = !1, this.hasTransformableViewport = !1, this.hasResizeReactiveNodes = !1, this.boxRenderingTrigger = void 0;
  }
}
export {
  ue as BezierEdgeShape,
  je as CanvasBuilder,
  q as EventSubject,
  we as HorizontalEdgeShape,
  E as HtmlGraphError,
  fe as StraightEdgeShape,
  ye as VerticalEdgeShape
};
