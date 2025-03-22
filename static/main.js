var le = Object.defineProperty;
var ge = (t, e, r) => e in t ? le(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r;
var i = (t, e, r) => ge(t, typeof e != "symbol" ? e + "" : e, r);
const O = (t, e) => ({
  x: t / 2,
  y: e / 2
}), v = (t, e, r) => ({
  x: e.x * t.x - e.y * t.y + ((1 - e.x) * r.x + e.y * r.y),
  y: e.y * t.x + e.x * t.y + ((1 - e.x) * r.y - e.y * r.x)
}), N = (t, e, r) => ({ x: e * Math.cos(t), y: r * Math.sin(t) }), w = {
  x: 0,
  y: 0
}, T = (t, e, r, o) => {
  const d = [
    w,
    { x: r, y: o },
    { x: r, y: -o }
  ].map((a) => v(a, t, w)).map((a) => ({ x: a.x + e.x, y: a.y + e.y })), s = `M ${d[0].x} ${d[0].y}`, h = `L ${d[1].x} ${d[1].y}`, c = `L ${d[2].x} ${d[2].y}`;
  return `${s} ${h} ${c}`;
}, U = (t, e) => {
  const r = [];
  if (t.length > 0 && r.push(`M ${t[0].x} ${t[0].y}`), t.length === 2 && r.push(`L ${t[1].x} ${t[1].y}`), t.length > 2) {
    const o = t.length - 1;
    let n = 0, d = 0, s = 0;
    t.forEach((h, c) => {
      let a = 0, l = 0, g = 0;
      const f = c > 0, x = c < o, y = f && x;
      if (f && (a = -n, l = -d, g = s), x) {
        const L = t[c + 1];
        n = L.x - h.x, d = L.y - h.y, s = Math.sqrt(n * n + d * d);
      }
      const E = s !== 0 ? Math.min((y ? e : 0) / s, c < o - 1 ? 0.5 : 1) : 0, m = y ? { x: h.x + n * E, y: h.y + d * E } : h, P = g !== 0 ? Math.min((y ? e : 0) / g, c > 1 ? 0.5 : 1) : 0, V = y ? { x: h.x + a * P, y: h.y + l * P } : h;
      c > 0 && r.push(`L ${V.x} ${V.y}`), y && r.push(
        `C ${h.x} ${h.y} ${h.x} ${h.y} ${m.x} ${m.y}`
      );
    });
  }
  return r.join(" ");
}, k = () => {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  return t.style.pointerEvents = "none", t.style.position = "absolute", t.style.top = "0", t.style.left = "0", t.style.overflow = "visible", t;
}, Y = () => {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "g");
  return t.style.transformOrigin = "50% 50%", t;
}, X = (t, e) => {
  const r = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return r.setAttribute("stroke", t), r.setAttribute("stroke-width", `${e}`), r.setAttribute("fill", "none"), r;
}, M = (t) => {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("fill", t), e;
}, z = (t, e) => {
  const r = {
    x: t.x + t.width / 2,
    y: t.y + t.height / 2
  }, o = {
    x: e.x + e.width / 2,
    y: e.y + e.height / 2
  }, n = Math.min(r.x, o.x), d = Math.min(r.y, o.y), s = Math.abs(o.x - r.x), h = Math.abs(o.y - r.y), c = r.x <= o.x ? 1 : -1, a = r.y <= o.y ? 1 : -1;
  return {
    x: n,
    y: d,
    width: s,
    height: h,
    flipX: c,
    flipY: a
  };
}, ue = (t) => {
  const e = v(
    { x: t.arrowLength, y: w.y },
    t.fromVect,
    w
  ), r = v(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVect,
    t.to
  ), o = {
    x: e.x + t.fromVect.x * t.curvature,
    y: e.y + t.fromVect.y * t.curvature
  }, n = {
    x: r.x - t.toVect.x * t.curvature,
    y: r.y - t.toVect.y * t.curvature
  }, d = `M ${e.x} ${e.y} C ${o.x} ${o.y}, ${n.x} ${n.y}, ${r.x} ${r.y}`, s = t.hasSourceArrow ? "" : `M ${w.x} ${w.y} L ${e.x} ${e.y} `, h = t.hasTargetArrow ? "" : ` M ${r.x} ${r.y} L ${t.to.x} ${t.to.y}`;
  return `${s}${d}${h}`;
}, we = (t) => {
  const e = t.hasSourceArrow ? v(
    { x: t.arrowLength, y: w.y },
    t.fromVect,
    w
  ) : w, r = t.hasTargetArrow ? v(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVect,
    t.to
  ) : t.to, o = t.arrowLength, n = Math.cos(t.detourDirection) * t.detourDistance, d = Math.sin(t.detourDirection) * t.detourDistance, s = n * t.flipX, h = d * t.flipY, c = v(
    { x: o, y: w.y },
    t.fromVect,
    w
  ), a = {
    x: c.x + s,
    y: c.y + h
  }, l = v(
    { x: t.to.x - o, y: t.to.y },
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
  }, p = {
    x: c.x + s,
    y: c.y + h
  }, E = {
    x: l.x + s,
    y: l.y + h
  };
  return [
    `M ${e.x} ${e.y}`,
    `L ${c.x} ${c.y}`,
    `C ${x.x} ${x.y} ${p.x} ${p.y} ${f.x} ${f.y}`,
    `C ${E.x} ${E.y} ${y.x} ${y.y} ${l.x} ${l.y}`,
    `L ${r.x} ${r.y}`
  ].join(" ");
}, fe = (t) => {
  const e = t.hasSourceArrow ? v(
    { x: t.arrowLength, y: w.y },
    t.fromVect,
    w
  ) : w, r = t.hasTargetArrow ? v(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVect,
    t.to
  ) : t.to, o = t.arrowLength + t.arrowOffset, n = o - t.roundness, d = v({ x: n, y: w.y }, t.fromVect, w), s = v(
    { x: t.to.x - n, y: t.to.y },
    t.toVect,
    t.to
  ), h = Math.max((d.x + s.x) / 2, o), c = t.to.y / 2, a = { x: t.flipX > 0 ? h : -o, y: d.y }, l = { x: a.x, y: c }, g = {
    x: t.flipX > 0 ? t.to.x - h : t.to.x + o,
    y: s.y
  }, f = { x: g.x, y: c };
  return U(
    [e, d, a, l, f, g, s, r],
    t.roundness
  );
}, j = (t) => {
  const e = t.hasSourceArrow ? v(
    { x: t.arrowLength, y: w.y },
    t.fromVect,
    w
  ) : w, r = t.hasTargetArrow ? v(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVect,
    t.to
  ) : t.to, o = t.arrowLength + t.arrowOffset, n = v(
    { x: o, y: w.y },
    t.fromVect,
    w
  ), d = Math.cos(t.detourDirection) * t.detourDistance, s = Math.sin(t.detourDirection) * t.detourDistance, h = d * t.flipX, c = s * t.flipY, a = { x: n.x + h, y: n.y + c }, l = v(
    { x: t.to.x - o, y: t.to.y },
    t.toVect,
    t.to
  ), g = { x: l.x + h, y: l.y + c };
  return U(
    [e, n, a, g, l, r],
    t.roundness
  );
}, ye = (t) => {
  const e = t.hasSourceArrow ? v(
    { x: t.arrowLength, y: w.y },
    t.fromVect,
    w
  ) : w, r = t.hasTargetArrow ? v(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVect,
    t.to
  ) : t.to, o = t.arrowLength + t.arrowOffset, n = v({ x: o, y: w.y }, t.fromVect, w), d = v(
    { x: t.to.x - o, y: t.to.y },
    t.toVect,
    t.to
  );
  return U([e, n, d, r], t.roundness);
}, ve = (t) => {
  const e = t.hasSourceArrow ? v(
    { x: t.arrowLength, y: w.y },
    t.fromVect,
    w
  ) : w, r = t.hasTargetArrow ? v(
    { x: t.to.x - t.arrowLength, y: t.to.y },
    t.toVect,
    t.to
  ) : t.to, o = t.arrowLength + t.arrowOffset, n = o - t.roundness, d = v({ x: n, y: w.y }, t.fromVect, w), s = v(
    { x: t.to.x - n, y: t.to.y },
    t.toVect,
    t.to
  ), h = Math.max((d.y + s.y) / 2, o), c = t.to.x / 2, a = { x: d.x, y: t.flipY > 0 ? h : -o }, l = { x: c, y: a.y }, g = {
    x: s.x,
    y: t.flipY > 0 ? t.to.y - h : t.to.y + o
  }, f = { x: c, y: g.y };
  return U(
    [e, d, a, l, f, g, s, r],
    t.roundness
  );
}, G = (t) => {
  const e = t.arrowOffset, r = t.side, o = t.arrowLength + e, n = o + 2 * r, s = [
    { x: t.arrowLength, y: w.y },
    { x: o, y: w.y },
    { x: o, y: t.side },
    { x: n, y: t.side },
    { x: n, y: -t.side },
    { x: o, y: -t.side },
    { x: o, y: w.y },
    { x: t.arrowLength, y: w.y }
  ].map(
    (c) => v(c, t.fromVect, w)
  ), h = `M ${w.x} ${w.y} L ${s[0].x} ${s[0].y} `;
  return `${t.hasSourceArrow || t.hasTargetArrow ? "" : h}${U(s, t.roundness)}`;
}, xe = (t) => {
  const e = t.smallRadius, r = t.radius, o = Math.sqrt(e * e + r * r), n = e + r, d = t.arrowLength + o * (1 - r / n), s = e * r / n, c = [
    { x: t.arrowLength, y: w.y },
    { x: d, y: s },
    { x: d, y: -s }
  ].map((g) => v(g, t.fromVect, w)), a = [
    `M ${c[0].x} ${c[0].y}`,
    `A ${e} ${e} 0 0 1 ${c[1].x} ${c[1].y}`,
    `A ${r} ${r} 0 1 0 ${c[2].x} ${c[2].y}`,
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
class ee {
  constructor(e) {
    i(this, "svg", k());
    i(this, "group", Y());
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
    const r = (e == null ? void 0 : e.color) ?? u.color, o = (e == null ? void 0 : e.width) ?? u.width;
    this.svg.appendChild(this.group), this.line = X(r, o), this.group.appendChild(this.line), this.hasSourceArrow && (this.sourceArrow = M(r), this.group.appendChild(this.sourceArrow)), this.hasTargetArrow && (this.targetArrow = M(r), this.group.appendChild(this.targetArrow));
  }
  render(e) {
    const { x: r, y: o, width: n, height: d, flipX: s, flipY: h } = z(
      e.from,
      e.to
    );
    this.svg.style.transform = `translate(${r}px, ${o}px)`, this.svg.style.width = `${n}px`, this.svg.style.height = `${d}px`, this.group.style.transform = `scale(${s}, ${h})`;
    const c = N(
      e.from.direction,
      s,
      h
    ), a = N(e.to.direction, s, h), l = {
      x: n,
      y: d
    };
    let g, f = a, x = -this.arrowLength;
    if (e.from.portId === e.to.portId ? (g = xe({
      fromVect: c,
      radius: this.portCycleRadius,
      smallRadius: this.portCycleSmallRadius,
      arrowLength: this.arrowLength,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), f = c, x = this.arrowLength) : e.from.nodeId === e.to.nodeId ? g = we({
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
    }) : g = ue({
      to: l,
      fromVect: c,
      toVect: a,
      arrowLength: this.arrowLength,
      curvature: this.curvature,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), this.line.setAttribute("d", g), this.sourceArrow) {
      const y = T(
        c,
        w,
        this.arrowLength,
        this.arrowWidth
      );
      this.sourceArrow.setAttribute("d", y);
    }
    if (this.targetArrow) {
      const y = T(
        f,
        l,
        x,
        this.arrowWidth
      );
      this.targetArrow.setAttribute("d", y);
    }
  }
}
class te {
  constructor(e) {
    i(this, "svg", k());
    i(this, "group", Y());
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
    const r = (e == null ? void 0 : e.roundness) ?? u.roundness;
    this.roundness = Math.min(
      r,
      this.arrowOffset,
      this.cycleSquareSide / 2
    ), this.detourDirection = (e == null ? void 0 : e.detourDirection) ?? u.detourDirection, this.detourDistance = (e == null ? void 0 : e.detourDistance) ?? u.detourDistance, this.hasSourceArrow = (e == null ? void 0 : e.hasSourceArrow) ?? u.hasSourceArrow, this.hasTargetArrow = (e == null ? void 0 : e.hasTargetArrow) ?? u.hasTargetArrow;
    const o = (e == null ? void 0 : e.color) ?? u.color, n = (e == null ? void 0 : e.width) ?? u.width;
    this.svg.appendChild(this.group), this.line = X(o, n), this.group.appendChild(this.line), this.hasSourceArrow && (this.sourceArrow = M(o), this.group.appendChild(this.sourceArrow)), this.hasTargetArrow && (this.targetArrow = M(o), this.group.appendChild(this.targetArrow));
  }
  render(e) {
    const { x: r, y: o, width: n, height: d, flipX: s, flipY: h } = z(
      e.from,
      e.to
    );
    this.svg.style.transform = `translate(${r}px, ${o}px)`, this.svg.style.width = `${n}px`, this.svg.style.height = `${d}px`, this.group.style.transform = `scale(${s}, ${h})`;
    const c = N(
      e.from.direction,
      s,
      h
    ), a = N(e.to.direction, s, h), l = {
      x: n,
      y: d
    };
    let g, f = a, x = -this.arrowLength;
    if (e.from.portId === e.to.portId ? (g = G({
      fromVect: c,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), f = c, x = this.arrowLength) : e.from.nodeId === e.to.nodeId ? g = j({
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
    }) : g = fe({
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
      const y = T(
        c,
        w,
        this.arrowLength,
        this.arrowWidth
      );
      this.sourceArrow.setAttribute("d", y);
    }
    if (this.targetArrow) {
      const y = T(
        f,
        l,
        x,
        this.arrowWidth
      );
      this.targetArrow.setAttribute("d", y);
    }
  }
}
class re {
  constructor(e) {
    i(this, "svg", k());
    i(this, "group", Y());
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
    const r = (e == null ? void 0 : e.roundness) ?? u.roundness;
    this.roundness = Math.min(
      r,
      this.arrowOffset,
      this.cycleSquareSide / 2
    ), this.detourDirection = (e == null ? void 0 : e.detourDirection) ?? u.detourDirection, this.detourDistance = (e == null ? void 0 : e.detourDistance) ?? u.detourDistance, this.hasSourceArrow = (e == null ? void 0 : e.hasSourceArrow) ?? u.hasSourceArrow, this.hasTargetArrow = (e == null ? void 0 : e.hasTargetArrow) ?? u.hasTargetArrow;
    const o = (e == null ? void 0 : e.color) ?? u.color, n = (e == null ? void 0 : e.width) ?? u.width;
    this.svg.appendChild(this.group), this.line = X(o, n), this.group.appendChild(this.line), this.hasSourceArrow && (this.sourceArrow = M(o), this.group.appendChild(this.sourceArrow)), this.hasTargetArrow && (this.targetArrow = M(o), this.group.appendChild(this.targetArrow));
  }
  render(e) {
    const { x: r, y: o, width: n, height: d, flipX: s, flipY: h } = z(
      e.from,
      e.to
    );
    this.svg.style.transform = `translate(${r}px, ${o}px)`, this.svg.style.width = `${n}px`, this.svg.style.height = `${d}px`, this.group.style.transform = `scale(${s}, ${h})`;
    const c = N(
      e.from.direction,
      s,
      h
    ), a = N(e.to.direction, s, h), l = {
      x: n,
      y: d
    };
    let g, f = a, x = -this.arrowLength;
    if (e.from.portId === e.to.portId ? (g = G({
      fromVect: c,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), f = c, x = this.arrowLength) : e.from.nodeId === e.to.nodeId ? g = j({
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
    }) : g = ye({
      to: l,
      fromVect: c,
      toVect: a,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), this.line.setAttribute("d", g), this.sourceArrow) {
      const y = T(
        c,
        w,
        this.arrowLength,
        this.arrowWidth
      );
      this.sourceArrow.setAttribute("d", y);
    }
    if (this.targetArrow) {
      const y = T(
        f,
        l,
        x,
        this.arrowWidth
      );
      this.targetArrow.setAttribute("d", y);
    }
  }
}
class oe {
  constructor(e) {
    i(this, "svg", k());
    i(this, "group", Y());
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
    const r = (e == null ? void 0 : e.roundness) ?? u.roundness;
    this.roundness = Math.min(
      r,
      this.arrowOffset,
      this.cycleSquareSide / 2
    ), this.detourDirection = (e == null ? void 0 : e.detourDirection) ?? u.detourDirectionVertical, this.detourDistance = (e == null ? void 0 : e.detourDistance) ?? u.detourDistance, this.hasSourceArrow = (e == null ? void 0 : e.hasSourceArrow) ?? u.hasSourceArrow, this.hasTargetArrow = (e == null ? void 0 : e.hasTargetArrow) ?? u.hasTargetArrow;
    const o = (e == null ? void 0 : e.color) ?? u.color, n = (e == null ? void 0 : e.width) ?? u.width;
    this.svg.appendChild(this.group), this.line = X(o, n), this.group.appendChild(this.line), this.hasSourceArrow && (this.sourceArrow = M(o), this.group.appendChild(this.sourceArrow)), this.hasTargetArrow && (this.targetArrow = M(o), this.group.appendChild(this.targetArrow));
  }
  render(e) {
    const { x: r, y: o, width: n, height: d, flipX: s, flipY: h } = z(
      e.from,
      e.to
    );
    this.svg.style.transform = `translate(${r}px, ${o}px)`, this.svg.style.width = `${n}px`, this.svg.style.height = `${d}px`, this.group.style.transform = `scale(${s}, ${h})`;
    const c = N(
      e.from.direction,
      s,
      h
    ), a = N(e.to.direction, s, h), l = {
      x: n,
      y: d
    };
    let g, f = a, x = -this.arrowLength;
    if (e.from.portId === e.to.portId ? (g = G({
      fromVect: c,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), f = c, x = this.arrowLength) : e.from.nodeId === e.to.nodeId ? g = j({
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
    }) : g = ve({
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
      const y = T(
        c,
        w,
        this.arrowLength,
        this.arrowWidth
      );
      this.sourceArrow.setAttribute("d", y);
    }
    if (this.targetArrow) {
      const y = T(
        f,
        l,
        x,
        this.arrowWidth
      );
      this.targetArrow.setAttribute("d", y);
    }
  }
}
const Ae = (t) => {
  if (typeof t == "function")
    return t;
  switch (t == null ? void 0 : t.type) {
    case "straight":
      return () => new re({
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
      return () => new te({
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
      return () => new oe({
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
      return () => new ee({
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
}, $ = (t) => () => t, I = $(0), C = () => {
  let t = 0;
  return () => t++;
}, Ee = (t, e) => {
  let r = I, o = I;
  t === "incremental" && (r = C()), e === "incremental" && (o = C());
  const n = C();
  return t === "shared-incremental" && (r = n), e === "shared-incremental" && (o = n), typeof t == "number" && (r = $(t)), typeof e == "number" && (o = $(e)), typeof t == "function" && (r = t), typeof e == "function" && (o = e), {
    nodesPriorityFn: r,
    edgesPriorityFn: o
  };
}, Se = (t) => {
  var r, o, n, d, s;
  const e = Ee(
    (r = t == null ? void 0 : t.nodes) == null ? void 0 : r.priority,
    (o = t == null ? void 0 : t.edges) == null ? void 0 : o.priority
  );
  return {
    nodes: {
      centerFn: ((n = t == null ? void 0 : t.nodes) == null ? void 0 : n.centerFn) ?? O,
      priorityFn: e.nodesPriorityFn
    },
    ports: {
      direction: ((d = t == null ? void 0 : t.ports) == null ? void 0 : d.direction) ?? 0
    },
    edges: {
      shapeFactory: Ae(((s = t == null ? void 0 : t.edges) == null ? void 0 : s.shape) ?? {}),
      priorityFn: e.edgesPriorityFn
    }
  };
};
class ie {
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
    const r = this.nodePorts.get(e);
    if (r !== void 0)
      return Array.from(r.keys());
  }
  getPortNodeId(e) {
    return this.portNodeId.get(e);
  }
  removePort(e) {
    const r = this.portNodeId.get(e);
    this.portNodeId.delete(e), this.nodePorts.get(r).delete(e), this.ports.delete(e);
  }
  addEdge(e) {
    this.edges.set(e.edgeId, {
      from: e.from,
      to: e.to,
      shape: e.shape,
      priority: e.priority
    }), e.from !== e.to ? (this.outcommingEdges.get(e.from).add(e.edgeId), this.incommingEdges.get(e.to).add(e.edgeId)) : this.cycleEdges.get(e.from).add(e.edgeId);
  }
  updateEdgeFrom(e, r) {
    const o = this.edges.get(e);
    this.removeEdge(e), this.addEdge({
      edgeId: e,
      from: r,
      to: o.to,
      shape: o.shape,
      priority: o.priority
    });
  }
  updateEdgeTo(e, r) {
    const o = this.edges.get(e);
    this.removeEdge(e), this.addEdge({
      edgeId: e,
      from: o.from,
      to: r,
      shape: o.shape,
      priority: o.priority
    });
  }
  getAllEdgeIds() {
    return Array.from(this.edges.keys());
  }
  getEdge(e) {
    return this.edges.get(e);
  }
  removeEdge(e) {
    const r = this.edges.get(e), o = r.from, n = r.to;
    this.cycleEdges.get(o).delete(e), this.cycleEdges.get(n).delete(e), this.incommingEdges.get(o).delete(e), this.incommingEdges.get(n).delete(e), this.outcommingEdges.get(o).delete(e), this.outcommingEdges.get(n).delete(e), this.edges.delete(e);
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
    const r = Array.from(this.nodePorts.get(e).keys());
    let o = [];
    return r.forEach((n) => {
      o = [...o, ...this.getPortIncomingEdgeIds(n)];
    }), o;
  }
  getNodeOutcomingEdgeIds(e) {
    const r = Array.from(this.nodePorts.get(e).keys());
    let o = [];
    return r.forEach((n) => {
      o = [...o, ...this.getPortOutcomingEdgeIds(n)];
    }), o;
  }
  getNodeCycleEdgeIds(e) {
    const r = Array.from(this.nodePorts.get(e).keys());
    let o = [];
    return r.forEach((n) => {
      o = [...o, ...this.getPortCycleEdgeIds(n)];
    }), o;
  }
  getNodeAdjacentEdgeIds(e) {
    return [
      ...this.getNodeIncomingEdgeIds(e),
      ...this.getNodeOutcomingEdgeIds(e),
      ...this.getNodeCycleEdgeIds(e)
    ];
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
    this.callbacks.forEach((r) => {
      r(e);
    });
  }
}
const S = () => {
  const t = new se();
  return [t, t];
}, Q = (t) => ({
  scale: 1 / t.scale,
  x: -t.x / t.scale,
  y: -t.y / t.scale
}), Z = {
  scale: 1,
  x: 0,
  y: 0
};
class ne {
  constructor() {
    i(this, "viewportMatrix", Z);
    i(this, "contentMatrix", Z);
    i(this, "emitter");
    i(this, "onAfterUpdate");
    [this.emitter, this.onAfterUpdate] = S();
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
class he {
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
const pe = () => {
  const t = document.createElement("div");
  return t.style.width = "100%", t.style.height = "100%", t.style.position = "relative", t.style.overflow = "hidden", t;
}, me = () => {
  const t = document.createElement("div");
  return t.style.position = "absolute", t.style.top = "0", t.style.left = "0", t.style.width = "0", t.style.height = "0", t;
}, Ne = () => {
  const t = document.createElement("div");
  return t.style.position = "absolute", t.style.top = "0", t.style.left = "0", t.style.visibility = "hidden", t;
};
class K {
  constructor(e, r) {
    i(this, "canvasWrapper", null);
    i(this, "host", pe());
    i(this, "container", me());
    i(this, "nodeIdToWrapperElementMap", /* @__PURE__ */ new Map());
    i(this, "edgeIdToElementMap", /* @__PURE__ */ new Map());
    i(this, "applyTransform", () => {
      const e = this.viewportTransformer.getContentMatrix();
      this.container.style.transform = `matrix(${e.scale}, 0, 0, ${e.scale}, ${e.x}, ${e.y})`;
    });
    this.graphStore = e, this.viewportTransformer = r, this.host.appendChild(this.container), this.viewportTransformer.onAfterUpdate.subscribe(this.applyTransform);
  }
  attach(e) {
    this.detach(), this.canvasWrapper = e, this.canvasWrapper.appendChild(this.host);
  }
  detach() {
    this.canvasWrapper !== null && (this.canvasWrapper.removeChild(this.host), this.canvasWrapper = null);
  }
  attachNode(e) {
    const r = this.graphStore.getNode(e), o = Ne();
    o.appendChild(r.element), this.container.appendChild(o), this.nodeIdToWrapperElementMap.set(e, o), this.updateNodeCoordinates(e), this.updateNodePriority(e), o.style.visibility = "visible";
  }
  detachNode(e) {
    const r = this.graphStore.getNode(e), o = this.nodeIdToWrapperElementMap.get(e);
    o.removeChild(r.element), this.container.removeChild(o), this.nodeIdToWrapperElementMap.delete(e);
  }
  attachEdge(e) {
    const r = this.graphStore.getEdge(e);
    this.edgeIdToElementMap.set(e, r.shape.svg), this.container.appendChild(r.shape.svg), this.renderEdge(e), this.updateEdgePriority(e);
  }
  detachEdge(e) {
    const r = this.graphStore.getEdge(e);
    this.container.removeChild(r.shape.svg), this.edgeIdToElementMap.delete(e);
  }
  clear() {
    this.edgeIdToElementMap.forEach((e, r) => {
      this.detachEdge(r);
    }), this.nodeIdToWrapperElementMap.forEach((e, r) => {
      this.detachNode(r);
    });
  }
  destroy() {
    this.clear(), this.detach(), this.viewportTransformer.onAfterUpdate.unsubscribe(this.applyTransform), this.host.removeChild(this.container);
  }
  updateNodeCoordinates(e) {
    const r = this.nodeIdToWrapperElementMap.get(e), o = this.graphStore.getNode(e), { width: n, height: d } = o.element.getBoundingClientRect(), s = this.viewportTransformer.getViewportMatrix().scale, h = o.centerFn(n, d), c = o.x - s * h.x, a = o.y - s * h.y;
    r.style.transform = `translate(${c}px, ${a}px)`;
  }
  updateNodePriority(e) {
    const r = this.graphStore.getNode(e), o = this.nodeIdToWrapperElementMap.get(e);
    o.style.zIndex = `${r.priority}`;
  }
  updateEdgeShape(e) {
    const r = this.edgeIdToElementMap.get(e);
    this.container.removeChild(r);
    const o = this.graphStore.getEdge(e);
    this.edgeIdToElementMap.set(e, o.shape.svg), this.container.appendChild(o.shape.svg);
  }
  renderEdge(e) {
    const r = this.graphStore.getEdge(e), o = this.graphStore.getPort(r.from), n = this.graphStore.getPort(r.to), d = o.element.getBoundingClientRect(), s = n.element.getBoundingClientRect(), h = this.host.getBoundingClientRect(), c = this.viewportTransformer.getViewportMatrix(), a = {
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
      direction: o.direction,
      portId: r.from,
      nodeId: this.graphStore.getPortNodeId(r.from)
    }, f = {
      x: l.x,
      y: l.y,
      width: s.width * c.scale,
      height: s.height * c.scale,
      direction: n.direction,
      portId: r.to,
      nodeId: this.graphStore.getPortNodeId(r.to)
    };
    r.shape.render({
      from: g,
      to: f
    });
  }
  updateEdgePriority(e) {
    const r = this.graphStore.getEdge(e);
    r.shape.svg.style.zIndex = `${r.priority}`;
  }
}
class Te {
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
    const r = this.graphStore.getNode(e);
    return r.x >= this.xFrom && r.x <= this.xTo && r.y >= this.yFrom && r.y <= this.yTo;
  }
  hasEdge(e) {
    const r = this.graphStore.getEdge(e), o = this.graphStore.getPortNodeId(r.from), n = this.graphStore.getPortNodeId(r.to), d = this.graphStore.getNode(o), s = this.graphStore.getNode(n), h = Math.min(d.x, s.x), c = Math.max(d.x, s.x), a = Math.min(d.y, s.y), l = Math.max(d.y, s.y);
    return h <= this.xTo && c >= this.xFrom && a <= this.yTo && l >= this.yFrom;
  }
}
class Me {
  constructor(e, r, o) {
    i(this, "attachedNodes", /* @__PURE__ */ new Set());
    i(this, "attachedEdges", /* @__PURE__ */ new Set());
    i(this, "renderingBox");
    i(this, "updateViewport", (e) => {
      this.renderingBox.setRenderingBox(e);
      const r = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Set();
      this.graphStore.getAllNodeIds().forEach((s) => {
        const h = this.renderingBox.hasNode(s), c = this.attachedNodes.has(s);
        h && !c ? r.add(s) : !h && c && o.add(s);
      }), this.graphStore.getAllEdgeIds().forEach((s) => {
        const h = this.renderingBox.hasEdge(s), c = this.attachedEdges.has(s), a = this.graphStore.getEdge(s), l = this.graphStore.getPortNodeId(a.from), g = this.graphStore.getPortNodeId(a.to);
        h && (this.renderingBox.hasNode(l) || (r.add(l), o.delete(l)), this.renderingBox.hasNode(g) || (r.add(g), o.delete(g))), h && !c ? n.add(s) : !h && c && d.add(s);
      }), d.forEach((s) => {
        this.handleDetachEdge(s);
      }), o.forEach((s) => {
        this.handleDetachNode(s);
      }), r.forEach((s) => {
        this.attachedNodes.has(s) || this.handleAttachNode(s);
      }), n.forEach((s) => {
        this.handleAttachEdge(s);
      });
    });
    this.htmlView = e, this.graphStore = r, this.trigger = o, this.renderingBox = new Te(this.graphStore), this.trigger.subscribe(this.updateViewport);
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
    this.attachedNodes.has(e) ? this.htmlView.updateNodeCoordinates(e) : this.renderingBox.hasNode(e) && (this.handleAttachNode(e), this.graphStore.getNodeAdjacentEdgeIds(e).forEach((r) => {
      this.attachEdgeEntities(r);
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
    const r = this.graphStore.getEdge(e), o = this.graphStore.getPortNodeId(r.from), n = this.graphStore.getPortNodeId(r.to);
    this.attachedNodes.has(o) || this.handleAttachNode(o), this.attachedNodes.has(n) || this.handleAttachNode(n), this.handleAttachEdge(e);
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
class D {
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
class de {
  constructor(e, r) {
    i(this, "nodeIdGenerator", new D(
      (e) => this.graphStore.getNode(e) !== void 0
    ));
    i(this, "portIdGenerator", new D(
      (e) => this.graphStore.getPort(e) !== void 0
    ));
    i(this, "edgeIdGenerator", new D(
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
    this.graphStore = e, this.options = r, [this.onAfterNodeAddedEmitter, this.onAfterNodeAdded] = S(), [this.onAfterEdgeAddedEmitter, this.onAfterEdgeAdded] = S(), [this.onAfterEdgeShapeUpdatedEmitter, this.onAfterEdgeShapeUpdated] = S(), [this.onAfterEdgePriorityUpdatedEmitter, this.onAfterEdgePriorityUpdated] = S(), [this.onAfterEdgeUpdatedEmitter, this.onAfterEdgeUpdated] = S(), [this.onAfterPortUpdatedEmitter, this.onAfterPortUpdated] = S(), [this.onAfterNodePriorityUpdatedEmitter, this.onAfterNodePriorityUpdated] = S(), [this.onAfterNodeUpdatedEmitter, this.onAfterNodeUpdated] = S(), [this.onBeforeEdgeRemovedEmitter, this.onBeforeEdgeRemoved] = S(), [this.onBeforeNodeRemovedEmitter, this.onBeforeNodeRemoved] = S();
  }
  addNode(e) {
    const r = this.nodeIdGenerator.create(e.id);
    if (this.graphStore.getNode(r) !== void 0)
      throw new A("failed to add node with existing id");
    this.graphStore.addNode({
      nodeId: r,
      element: e.element,
      x: e.x,
      y: e.y,
      centerFn: e.centerFn ?? this.options.nodes.centerFn,
      priority: e.priority ?? this.options.nodes.priorityFn()
    }), this.onAfterNodeAddedEmitter.emit(r), Array.from(e.ports ?? []).forEach((o) => {
      this.markPort({
        id: o.id,
        element: o.element,
        nodeId: r,
        direction: o.direction
      });
    });
  }
  markPort(e) {
    const r = this.portIdGenerator.create(e.id);
    if (this.graphStore.getPort(r) !== void 0)
      throw new A("failed to add port with existing id");
    if (this.graphStore.getNode(e.nodeId) === void 0)
      throw new A("failed to set port on nonexisting node");
    this.graphStore.addPort({
      portId: r,
      element: e.element,
      nodeId: e.nodeId,
      direction: e.direction ?? this.options.ports.direction
    });
  }
  addEdge(e) {
    const r = this.edgeIdGenerator.create(e.id);
    if (this.graphStore.getEdge(r) !== void 0)
      throw new A("failed to add edge with existing id");
    if (this.graphStore.getPort(e.from) === void 0)
      throw new A("failed to add edge from nonexisting port");
    if (this.graphStore.getPort(e.to) === void 0)
      throw new A("failed to add edge to nonexisting port");
    this.graphStore.addEdge({
      edgeId: r,
      from: e.from,
      to: e.to,
      shape: e.shape ?? this.options.edges.shapeFactory(),
      priority: e.priority ?? this.options.edges.priorityFn()
    }), this.onAfterEdgeAddedEmitter.emit(r);
  }
  updateEdge(e, r) {
    const o = this.graphStore.getEdge(e);
    if (o === void 0)
      throw new A("failed to update nonexisting edge");
    r.shape !== void 0 && (o.shape = r.shape, this.onAfterEdgeShapeUpdatedEmitter.emit(e)), r.from !== void 0 && this.graphStore.updateEdgeFrom(e, r.from), r.to !== void 0 && this.graphStore.updateEdgeTo(e, r.to), this.onAfterEdgeUpdatedEmitter.emit(e), r.priority !== void 0 && (o.priority = r.priority, this.onAfterEdgePriorityUpdatedEmitter.emit(e));
  }
  updatePort(e, r) {
    const o = this.graphStore.getPort(e);
    if (o === void 0)
      throw new A("failed to unset nonexisting port");
    o.direction = r.direction ?? o.direction, this.onAfterPortUpdatedEmitter.emit(e);
  }
  updateNode(e, r) {
    const o = this.graphStore.getNode(e);
    if (o === void 0)
      throw new A("failed to update nonexisting node");
    o.x = (r == null ? void 0 : r.x) ?? o.x, o.y = (r == null ? void 0 : r.y) ?? o.y, o.centerFn = r.centerFn ?? o.centerFn, this.onAfterNodeUpdatedEmitter.emit(e), r.priority !== void 0 && (o.priority = r.priority, this.onAfterNodePriorityUpdatedEmitter.emit(e));
  }
  removeEdge(e) {
    if (this.graphStore.getEdge(e) === void 0)
      throw new A("failed to remove nonexisting edge");
    this.onBeforeEdgeRemovedEmitter.emit(e), this.graphStore.removeEdge(e);
  }
  unmarkPort(e) {
    if (this.graphStore.getPort(e) === void 0)
      throw new A("failed to unset nonexisting port");
    this.graphStore.getPortAdjacentEdgeIds(e).forEach((r) => {
      this.removeEdge(r);
    }), this.graphStore.removePort(e);
  }
  removeNode(e) {
    if (this.graphStore.getNode(e) === void 0)
      throw new A("failed to remove nonexisting node");
    this.graphStore.getNodePortIds(e).forEach((r) => {
      this.unmarkPort(r);
    }), this.onBeforeNodeRemovedEmitter.emit(e), this.graphStore.removeNode(e);
  }
  clear() {
    this.graphStore.clear(), this.nodeIdGenerator.reset(), this.portIdGenerator.reset(), this.edgeIdGenerator.reset();
  }
}
class ce {
  constructor(e) {
    this.graphStore = e;
  }
  getNode(e) {
    const r = this.graphStore.getNode(e);
    return r === void 0 ? null : {
      element: r.element,
      x: r.x,
      y: r.y,
      centerFn: r.centerFn,
      priority: r.priority
    };
  }
  getAllNodeIds() {
    return this.graphStore.getAllNodeIds();
  }
  getPort(e) {
    const r = this.graphStore.getPort(e);
    return r === void 0 ? null : {
      element: r.element,
      direction: r.direction
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
    const r = this.graphStore.getEdge(e);
    return r === void 0 ? null : { from: r.from, to: r.to, priority: r.priority };
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
class Ge {
  constructor(e) {
    i(this, "viewport");
    i(this, "transformation");
    i(this, "graph");
    i(this, "model");
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
      this.internalModel.getPortAdjacentEdgeIds(e).forEach((o) => {
        this.htmlView.renderEdge(o);
      });
    });
    i(this, "onAfterNodePriorityUpdated", (e) => {
      this.htmlView.updateNodePriority(e);
    });
    i(this, "onAfterNodeUpdated", (e) => {
      this.htmlView.updateNodeCoordinates(e), this.internalModel.getNodeAdjacentEdgeIds(e).forEach((o) => {
        this.htmlView.renderEdge(o);
      });
    });
    i(this, "onBeforeEdgeRemoved", (e) => {
      this.htmlView.detachEdge(e);
    });
    i(this, "onBeforeNodeRemoved", (e) => {
      this.htmlView.detachNode(e);
    });
    this.internalModel = new ie(), this.graph = new ce(this.internalModel), this.model = this.graph, this.internalTransformation = new ne(), this.viewport = new he(this.internalTransformation), this.transformation = this.viewport, this.htmlView = new K(
      this.internalModel,
      this.internalTransformation
    ), this.graphStoreController = new de(
      this.internalModel,
      Se(e)
    ), this.graphStoreController.onAfterNodeAdded.subscribe(this.onAfterNodeAdded), this.graphStoreController.onAfterEdgeAdded.subscribe(this.onAfterEdgeAdded), this.graphStoreController.onAfterEdgeShapeUpdated.subscribe(
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
  updateNode(e, r) {
    return this.graphStoreController.updateNode(e, r ?? {}), this;
  }
  removeNode(e) {
    return this.graphStoreController.removeNode(e), this;
  }
  addEdge(e) {
    return this.graphStoreController.addEdge(e), this;
  }
  updateEdge(e, r) {
    return this.graphStoreController.updateEdge(e, r ?? {}), this;
  }
  removeEdge(e) {
    return this.graphStoreController.removeEdge(e), this;
  }
  markPort(e) {
    return this.graphStoreController.markPort(e), this;
  }
  updatePort(e, r) {
    return this.graphStoreController.updatePort(e, r ?? {}), this;
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
class be {
  constructor(e) {
    i(this, "viewport");
    i(this, "transformation");
    i(this, "graph");
    i(this, "model");
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
      this.internalModel.getPortAdjacentEdgeIds(e).forEach((o) => {
        this.htmlView.renderEdge(o);
      });
    });
    i(this, "onAfterNodePriorityUpdated", (e) => {
      this.htmlView.updateNodePriority(e);
    });
    i(this, "onAfterNodeUpdated", (e) => {
      this.htmlView.updateNodeCoordinates(e), this.internalModel.getNodeAdjacentEdgeIds(e).forEach((o) => {
        this.htmlView.renderEdge(o);
      });
    });
    i(this, "onBeforeEdgeRemoved", (e) => {
      this.htmlView.detachEdge(e);
    });
    i(this, "onBeforeNodeRemoved", (e) => {
      this.htmlView.detachNode(e);
    });
    this.graph = e.graph, this.model = this.graph, this.internalModel = e.graphStore, this.internalTransformation = e.viewportTransformer, this.viewport = e.viewport, this.transformation = this.viewport, this.htmlView = e.htmlView, this.graphStoreController = e.graphStoreController, this.graphStoreController.onAfterNodeAdded.subscribe(this.onAfterNodeAdded), this.graphStoreController.onAfterEdgeAdded.subscribe(this.onAfterEdgeAdded), this.graphStoreController.onAfterEdgeShapeUpdated.subscribe(
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
  updateNode(e, r) {
    return this.graphStoreController.updateNode(e, r ?? {}), this;
  }
  removeNode(e) {
    return this.graphStoreController.removeNode(e), this;
  }
  addEdge(e) {
    return this.graphStoreController.addEdge(e), this;
  }
  updateEdge(e, r) {
    return this.graphStoreController.updateEdge(e, r ?? {}), this;
  }
  removeEdge(e) {
    return this.graphStoreController.removeEdge(e), this;
  }
  markPort(e) {
    return this.graphStoreController.markPort(e), this;
  }
  updatePort(e, r) {
    return this.graphStoreController.updatePort(e, r ?? {}), this;
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
const Ce = (t) => {
  if (typeof t == "function")
    return t;
  switch (t == null ? void 0 : t.type) {
    case "straight":
      return () => new re({
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
      return () => new te({
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
      return () => new oe({
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
      return () => new ee({
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
}, Pe = (t, e) => {
  let r = I, o = I;
  t === "incremental" && (r = C()), e === "incremental" && (o = C());
  const n = C();
  return t === "shared-incremental" && (r = n), e === "shared-incremental" && (o = n), typeof t == "number" && (r = $(t)), typeof e == "number" && (o = $(e)), typeof t == "function" && (r = t), typeof e == "function" && (o = e), {
    nodesPriorityFn: r,
    edgesPriorityFn: o
  };
}, Ve = (t) => {
  var r, o, n, d, s;
  const e = Pe(
    (r = t == null ? void 0 : t.nodes) == null ? void 0 : r.priority,
    (o = t == null ? void 0 : t.edges) == null ? void 0 : o.priority
  );
  return {
    nodes: {
      centerFn: ((n = t == null ? void 0 : t.nodes) == null ? void 0 : n.centerFn) ?? O,
      priorityFn: e.nodesPriorityFn
    },
    ports: {
      direction: ((d = t == null ? void 0 : t.ports) == null ? void 0 : d.direction) ?? 0
    },
    edges: {
      shapeFactory: Ce(((s = t == null ? void 0 : t.edges) == null ? void 0 : s.shape) ?? {}),
      priorityFn: e.edgesPriorityFn
    }
  };
};
class Le {
  constructor(e, r) {
    i(this, "viewport");
    i(this, "graph");
    i(this, "viewportTransformer");
    i(this, "graphStore");
    i(this, "htmlView");
    i(this, "graphStoreController");
    this.graphStore = new ie(), this.graph = new ce(this.graphStore), this.viewportTransformer = new ne(), this.viewport = new he(this.viewportTransformer), this.htmlView = r(this.graphStore, this.viewportTransformer), this.graphStoreController = new de(
      this.graphStore,
      Ve(e)
    );
  }
}
const De = (t, e) => new K(t, e), $e = (t) => (e, r) => new Me(
  new K(e, r),
  e,
  t
), F = (t, e, r) => {
  const { x: o, y: n, width: d, height: s } = t.getBoundingClientRect();
  return e >= o && e <= o + d && r >= n && r <= n + s;
}, R = (t, e, r) => e >= 0 && e <= t.innerWidth && r >= 0 && r <= t.innerHeight, B = (t, e) => {
  e !== null ? t.style.cursor = e : t.style.removeProperty("cursor");
}, Ue = (t) => {
  var g, f, x, y, p, E;
  const e = ((g = t == null ? void 0 : t.events) == null ? void 0 : g.onNodeDrag) ?? (() => {
  }), r = ((f = t == null ? void 0 : t.events) == null ? void 0 : f.onBeforeNodeDrag) ?? (() => !0), o = ((x = t == null ? void 0 : t.events) == null ? void 0 : x.onNodeDragFinished) ?? (() => {
  }), n = (t == null ? void 0 : t.moveOnTop) === !1, d = (y = t == null ? void 0 : t.mouse) == null ? void 0 : y.dragCursor, s = d !== void 0 ? d : "grab", h = (p = t == null ? void 0 : t.mouse) == null ? void 0 : p.mouseDownEventVerifier, c = h !== void 0 ? h : (m) => m.button === 0, a = (E = t == null ? void 0 : t.mouse) == null ? void 0 : E.mouseUpEventVerifier;
  return {
    freezePriority: n,
    dragCursor: s,
    mouseDownEventVerifier: c,
    mouseUpEventVerifier: a !== void 0 ? a : (m) => m.button === 0,
    onNodeDrag: e,
    onBeforeNodeDrag: r,
    onNodeDragFinished: o
  };
};
class We {
  constructor(e, r) {
    i(this, "graph");
    i(this, "model");
    i(this, "viewport");
    i(this, "transformation");
    i(this, "maxNodePriority", 0);
    i(this, "nodes", /* @__PURE__ */ new Map());
    i(this, "grabbedNodeId", null);
    i(this, "nodeIdGenerator", new D(
      (e) => this.nodes.has(e)
    ));
    i(this, "element", null);
    i(this, "onWindowMouseMove", (e) => {
      if (this.element !== null && (!F(this.element, e.clientX, e.clientY) || !R(this.window, e.clientX, e.clientY))) {
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
      const r = e.touches[0];
      if (this.element !== null && (!F(this.element, r.clientX, r.clientY) || !R(this.window, r.clientX, r.clientY))) {
        this.cancelTouchDrag();
        return;
      }
      if (this.grabbedNodeId !== null && this.previousTouchCoords !== null) {
        const o = r.clientX - this.previousTouchCoords.x, n = r.clientY - this.previousTouchCoords.y;
        this.dragNode(this.grabbedNodeId, o, n), this.previousTouchCoords = {
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
    this.canvas = e, this.viewport = this.canvas.viewport, this.transformation = this.viewport, this.graph = this.canvas.graph, this.model = this.graph, this.options = Ue(r ?? {});
  }
  attach(e) {
    return this.detach(), this.element = e, this.canvas.attach(this.element), this;
  }
  detach() {
    return this.canvas.detach(), this.element !== null && (this.element = null), this;
  }
  addNode(e) {
    const r = this.nodeIdGenerator.create(e.id);
    this.canvas.addNode({ ...e, id: r }), this.updateMaxNodePriority(r);
    const o = (d) => {
      if (this.element === null || !this.options.mouseDownEventVerifier(d))
        return;
      const s = this.graph.getNode(r);
      this.options.onBeforeNodeDrag({
        nodeId: r,
        element: e.element,
        x: s.x,
        y: s.y
      }) && (d.stopImmediatePropagation(), this.grabbedNodeId = r, B(this.element, this.options.dragCursor), this.moveNodeOnTop(r), this.window.addEventListener("mouseup", this.onWindowMouseUp), this.window.addEventListener("mousemove", this.onWindowMouseMove));
    }, n = (d) => {
      if (d.touches.length !== 1)
        return;
      d.stopImmediatePropagation(), this.previousTouchCoords = {
        x: d.touches[0].clientX,
        y: d.touches[0].clientY
      };
      const s = this.graph.getNode(r);
      this.options.onBeforeNodeDrag({
        nodeId: r,
        element: e.element,
        x: s.x,
        y: s.y
      }) && (this.grabbedNodeId = r, this.moveNodeOnTop(r), this.window.addEventListener("touchmove", this.onWindowTouchMove), this.window.addEventListener("touchend", this.onWindowTouchFinish), this.window.addEventListener("touchcancel", this.onWindowTouchFinish));
    };
    return this.nodes.set(r, {
      element: e.element,
      onMouseDown: o,
      onTouchStart: n
    }), e.element.addEventListener("mousedown", o), e.element.addEventListener("touchstart", n), this;
  }
  updateNode(e, r) {
    return this.canvas.updateNode(e, r), this.updateMaxNodePriority(e), this;
  }
  removeNode(e) {
    const r = this.nodes.get(e);
    return r !== void 0 && (r.element.removeEventListener("mousedown", r.onMouseDown), r.element.removeEventListener("touchstart", r.onTouchStart)), this.nodes.delete(e), this.canvas.removeNode(e), this;
  }
  markPort(e) {
    return this.canvas.markPort(e), this;
  }
  updatePort(e, r) {
    return this.canvas.updatePort(e, r), this;
  }
  unmarkPort(e) {
    return this.canvas.unmarkPort(e), this;
  }
  addEdge(e) {
    return this.canvas.addEdge(e), this;
  }
  updateEdge(e, r) {
    return this.canvas.updateEdge(e, r), this;
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
  dragNode(e, r, o) {
    const n = this.graph.getNode(e);
    if (n === null)
      return;
    const d = this.canvas.viewport.getContentMatrix(), s = d.scale * n.x + d.x, h = d.scale * n.y + d.y, c = s + r, a = h + o, l = this.canvas.viewport.getViewportMatrix(), g = l.scale * c + l.x, f = l.scale * a + l.y;
    this.canvas.updateNode(e, { x: g, y: f }), this.options.onNodeDrag({
      nodeId: e,
      element: n.element,
      x: g,
      y: f
    });
  }
  updateMaxNodePriority(e) {
    const r = this.graph.getNode(e).priority;
    this.maxNodePriority = Math.max(this.maxNodePriority, r);
  }
  moveNodeOnTop(e) {
    if (this.options.freezePriority)
      return;
    this.maxNodePriority += 2, this.updateNode(e, { priority: this.maxNodePriority });
    const r = this.maxNodePriority - 1;
    this.graph.getNodeAdjacentEdgeIds(e).forEach((n) => {
      this.updateEdge(n, { priority: r });
    });
  }
  cancelMouseDrag() {
    const e = this.graph.getNode(this.grabbedNodeId);
    e !== null && this.options.onNodeDragFinished({
      nodeId: this.grabbedNodeId,
      element: e.element,
      x: e.x,
      y: e.y
    }), this.grabbedNodeId = null, this.element !== null && B(this.element, null), this.removeMouseDragListeners();
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
const Ie = (t) => {
  const e = t.minX !== null ? t.minX : -1 / 0, r = t.maxX !== null ? t.maxX : 1 / 0, o = t.minY !== null ? t.minY : -1 / 0, n = t.maxY !== null ? t.maxY : 1 / 0;
  return (d) => {
    let s = d.nextTransform.x, h = d.nextTransform.y;
    s < e && s < d.prevTransform.x && (s = Math.min(d.prevTransform.x, e));
    const c = d.canvasWidth * d.prevTransform.scale, a = r - c;
    s > a && s > d.prevTransform.x && (s = Math.max(d.prevTransform.x, a)), h < o && h < d.prevTransform.y && (h = Math.min(d.prevTransform.y, o));
    const l = d.canvasHeight * d.prevTransform.scale, g = n - l;
    return h > g && h > d.prevTransform.y && (h = Math.max(d.prevTransform.y, g)), { scale: d.nextTransform.scale, x: s, y: h };
  };
}, Fe = (t) => {
  const e = t.maxContentScale, r = t.minContentScale, o = e !== null ? 1 / e : 0, n = r !== null ? 1 / r : 1 / 0;
  return (d) => {
    const s = d.prevTransform, h = d.nextTransform;
    let c = h.scale, a = h.x, l = h.y;
    if (h.scale > n && h.scale > s.scale) {
      c = Math.max(s.scale, n), a = s.x, l = s.y;
      const g = (c - s.scale) / (h.scale - s.scale);
      a = s.x + (h.x - s.x) * g, l = s.y + (h.y - s.y) * g;
    }
    if (h.scale < o && h.scale < s.scale) {
      c = Math.min(s.scale, o), a = s.x, l = s.y;
      const g = (c - s.scale) / (h.scale - s.scale);
      a = s.x + (h.x - s.x) * g, l = s.y + (h.y - s.y) * g;
    }
    return {
      scale: c,
      x: a,
      y: l
    };
  };
}, Re = (t) => (e) => t.reduce(
  (r, o) => o({
    prevTransform: e.prevTransform,
    nextTransform: r,
    canvasWidth: e.canvasWidth,
    canvasHeight: e.canvasHeight
  }),
  e.nextTransform
), q = (t) => {
  if (typeof t == "function")
    return t;
  switch (t.type) {
    case "scale-limit":
      return Fe({
        minContentScale: t.minContentScale ?? 0,
        maxContentScale: t.maxContentScale ?? 1 / 0
      });
    case "shift-limit":
      return Ie({
        minX: t.minX ?? -1 / 0,
        maxX: t.maxX ?? 1 / 0,
        minY: t.minY ?? -1 / 0,
        maxY: t.maxY ?? 1 / 0
      });
  }
}, Be = (t) => {
  var y, p, E, m, H, P, V, L, _, J;
  const e = (y = t == null ? void 0 : t.scale) == null ? void 0 : y.mouseWheelSensitivity, r = e !== void 0 ? e : 1.2, o = t == null ? void 0 : t.transformPreprocessor;
  let n;
  o !== void 0 ? Array.isArray(o) ? n = Re(
    o.map(
      (b) => q(b)
    )
  ) : n = q(o) : n = (b) => b.nextTransform;
  const d = ((p = t == null ? void 0 : t.shift) == null ? void 0 : p.cursor) !== void 0 ? t.shift.cursor : "grab", s = ((E = t == null ? void 0 : t.events) == null ? void 0 : E.onBeforeTransformChange) ?? (() => {
  }), h = ((m = t == null ? void 0 : t.events) == null ? void 0 : m.onTransformChange) ?? (() => {
  }), c = (H = t == null ? void 0 : t.shift) == null ? void 0 : H.mouseDownEventVerifier, a = c !== void 0 ? c : (b) => b.button === 0, l = (P = t == null ? void 0 : t.shift) == null ? void 0 : P.mouseUpEventVerifier, g = l !== void 0 ? l : (b) => b.button === 0, f = (V = t == null ? void 0 : t.scale) == null ? void 0 : V.mouseWheelEventVerifier, x = f !== void 0 ? f : () => !0;
  return {
    wheelSensitivity: r,
    onTransformStarted: ((L = t == null ? void 0 : t.events) == null ? void 0 : L.onTransformStarted) ?? (() => {
    }),
    onTransformFinished: ((_ = t == null ? void 0 : t.events) == null ? void 0 : _.onTransformFinished) ?? (() => {
    }),
    onBeforeTransformChange: s,
    onTransformChange: h,
    transformPreprocessor: n,
    shiftCursor: d,
    mouseDownEventVerifier: a,
    mouseUpEventVerifier: g,
    mouseWheelEventVerifier: x,
    scaleWheelFinishTimeout: ((J = t == null ? void 0 : t.scale) == null ? void 0 : J.wheelFinishTimeout) ?? 500
  };
}, W = (t) => {
  const e = [], r = t.touches.length;
  for (let h = 0; h < r; h++)
    e.push([t.touches[h].clientX, t.touches[h].clientY]);
  const o = e.reduce(
    (h, c) => [h[0] + c[0], h[1] + c[1]],
    [0, 0]
  ), n = [o[0] / r, o[1] / r], s = e.map((h) => [h[0] - n[0], h[1] - n[1]]).reduce(
    (h, c) => h + Math.sqrt(c[0] * c[0] + c[1] * c[1]),
    0
  );
  return {
    x: n[0],
    y: n[1],
    scale: s / r,
    touchesCnt: r,
    touches: e
  };
}, ke = (t, e, r) => ({
  scale: t.scale,
  x: t.x + t.scale * e,
  y: t.y + t.scale * r
}), Ye = (t, e, r, o) => ({
  scale: t.scale * e,
  x: t.scale * (1 - e) * r + t.x,
  y: t.scale * (1 - e) * o + t.y
});
class ae {
  constructor(e, r) {
    i(this, "graph");
    i(this, "model");
    i(this, "viewport");
    i(this, "transformation");
    i(this, "element", null);
    i(this, "prevTouches", null);
    i(this, "window", window);
    i(this, "wheelFinishTimer", null);
    i(this, "onMouseDown", (e) => {
      this.element === null || !this.options.mouseDownEventVerifier(e) || (B(this.element, this.options.shiftCursor), this.window.addEventListener("mousemove", this.onWindowMouseMove), this.window.addEventListener("mouseup", this.onWindowMouseUp), this.options.onTransformStarted());
    });
    i(this, "onWindowMouseMove", (e) => {
      if (this.element === null || !F(this.element, e.clientX, e.clientY) || !R(this.window, e.clientX, e.clientY)) {
        this.stopMouseDrag();
        return;
      }
      const r = -e.movementX, o = -e.movementY;
      this.moveViewport(this.element, r, o);
    });
    i(this, "onWindowMouseUp", (e) => {
      this.element === null || !this.options.mouseUpEventVerifier(e) || this.stopMouseDrag();
    });
    i(this, "onWheelScroll", (e) => {
      if (!this.options.mouseWheelEventVerifier(e))
        return;
      e.preventDefault();
      const { left: r, top: o } = this.element.getBoundingClientRect(), n = e.clientX - r, d = e.clientY - o, h = 1 / (e.deltaY < 0 ? this.options.wheelSensitivity : 1 / this.options.wheelSensitivity);
      this.wheelFinishTimer === null && this.options.onTransformStarted(), this.scaleViewport(this.element, h, n, d), this.wheelFinishTimer !== null && clearTimeout(this.wheelFinishTimer), this.wheelFinishTimer = setTimeout(() => {
        this.options.onTransformFinished(), this.wheelFinishTimer = null;
      }, this.options.scaleWheelFinishTimeout);
    });
    i(this, "onTouchStart", (e) => {
      if (this.prevTouches !== null) {
        this.prevTouches = W(e);
        return;
      }
      this.prevTouches = W(e), this.window.addEventListener("touchmove", this.onWindowTouchMove), this.window.addEventListener("touchend", this.onWindowTouchFinish), this.window.addEventListener("touchcancel", this.onWindowTouchFinish), this.options.onTransformStarted();
    });
    i(this, "onWindowTouchMove", (e) => {
      const r = this.element;
      if (r === null)
        return;
      const o = W(e);
      if (!o.touches.every(
        (d) => F(r, d[0], d[1]) && R(this.window, d[0], d[1])
      )) {
        this.stopTouchDrag();
        return;
      }
      if ((o.touchesCnt === 1 || o.touchesCnt === 2) && this.moveViewport(
        r,
        -(o.x - this.prevTouches.x),
        -(o.y - this.prevTouches.y)
      ), o.touchesCnt === 2) {
        const { left: d, top: s } = r.getBoundingClientRect(), h = this.prevTouches.x - d, c = this.prevTouches.y - s, l = 1 / (o.scale / this.prevTouches.scale);
        this.scaleViewport(r, l, h, c);
      }
      this.prevTouches = o;
    });
    i(this, "onWindowTouchFinish", (e) => {
      e.touches.length > 0 ? this.prevTouches = W(e) : this.stopTouchDrag();
    });
    i(this, "observer", new ResizeObserver(() => {
      const e = this.canvas.viewport.getViewportMatrix(), { width: r, height: o } = this.element.getBoundingClientRect(), n = this.options.transformPreprocessor({
        prevTransform: e,
        nextTransform: e,
        canvasWidth: r,
        canvasHeight: o
      });
      this.canvas.patchViewportMatrix(n);
    }));
    i(this, "options");
    this.canvas = e, this.options = Be(r), this.viewport = this.canvas.viewport, this.transformation = this.viewport, this.graph = this.canvas.graph, this.model = this.graph;
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
  updateNode(e, r) {
    return this.canvas.updateNode(e, r), this;
  }
  removeNode(e) {
    return this.canvas.removeNode(e), this;
  }
  markPort(e) {
    return this.canvas.markPort(e), this;
  }
  updatePort(e, r) {
    return this.canvas.updatePort(e, r), this;
  }
  unmarkPort(e) {
    return this.canvas.unmarkPort(e), this;
  }
  addEdge(e) {
    return this.canvas.addEdge(e), this;
  }
  updateEdge(e, r) {
    return this.canvas.updateEdge(e, r), this;
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
  moveViewport(e, r, o) {
    const n = this.viewport.getViewportMatrix(), d = ke(n, r, o), { width: s, height: h } = e.getBoundingClientRect(), c = this.options.transformPreprocessor({
      prevTransform: n,
      nextTransform: d,
      canvasWidth: s,
      canvasHeight: h
    });
    this.performTransform(c);
  }
  scaleViewport(e, r, o, n) {
    const d = this.canvas.viewport.getViewportMatrix(), s = Ye(d, r, o, n), { width: h, height: c } = e.getBoundingClientRect(), a = this.options.transformPreprocessor({
      prevTransform: d,
      nextTransform: s,
      canvasWidth: h,
      canvasHeight: c
    });
    this.performTransform(a);
  }
  stopMouseDrag() {
    this.element !== null && B(this.element, null), this.removeMouseDragListeners(), this.options.onTransformFinished();
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
class Xe {
  constructor() {
    i(this, "keyMap", /* @__PURE__ */ new Map());
    i(this, "valueMap", /* @__PURE__ */ new Map());
  }
  set(e, r) {
    this.keyMap.set(e, r), this.valueMap.set(r, e);
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
    const r = this.keyMap.get(e);
    r !== void 0 && this.valueMap.delete(r), this.keyMap.delete(e);
  }
  deleteByValue(e) {
    const r = this.valueMap.get(e);
    r !== void 0 && this.keyMap.delete(r), this.valueMap.delete(e);
  }
  forEach(e) {
    this.keyMap.forEach((r, o) => {
      e(r, o);
    });
  }
  clear() {
    this.keyMap.clear(), this.valueMap.clear();
  }
}
class ze {
  constructor(e) {
    i(this, "viewport");
    i(this, "transformation");
    i(this, "graph");
    i(this, "model");
    i(this, "nodes", new Xe());
    i(this, "nodeIdGenerator", new D(
      (e) => this.nodes.hasKey(e)
    ));
    i(this, "nodesResizeObserver");
    i(this, "window", window);
    this.canvas = e, this.nodesResizeObserver = new this.window.ResizeObserver((r) => {
      r.forEach((o) => {
        const n = o.target;
        this.handleNodeResize(n);
      });
    }), this.viewport = this.canvas.viewport, this.transformation = this.viewport, this.graph = this.canvas.graph, this.model = this.graph;
  }
  attach(e) {
    return this.canvas.attach(e), this;
  }
  detach() {
    return this.canvas.detach(), this;
  }
  addNode(e) {
    const r = this.nodeIdGenerator.create(e.id);
    return this.canvas.addNode({
      ...e,
      id: r
    }), this.nodes.set(r, e.element), this.nodesResizeObserver.observe(e.element), this;
  }
  updateNode(e, r) {
    return this.canvas.updateNode(e, r), this;
  }
  removeNode(e) {
    this.canvas.removeNode(e);
    const r = this.nodes.getByKey(e);
    return this.nodes.deleteByKey(e), this.nodesResizeObserver.unobserve(r), this;
  }
  markPort(e) {
    return this.canvas.markPort(e), this;
  }
  updatePort(e, r) {
    return this.canvas.updatePort(e, r), this;
  }
  unmarkPort(e) {
    return this.canvas.unmarkPort(e), this;
  }
  addEdge(e) {
    return this.canvas.addEdge(e), this;
  }
  updateEdge(e, r) {
    return this.canvas.updateEdge(e, r), this;
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
    const r = this.nodes.getByValue(e);
    this.canvas.updateNode(r), this.graph.getNodeAdjacentEdgeIds(r).forEach((n) => {
      this.canvas.updateEdge(n);
    });
  }
}
class He {
  constructor(e, r, o, n) {
    i(this, "graph");
    i(this, "model");
    i(this, "viewport");
    i(this, "transformation");
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
    this.trigger = r, this.virtualScrollOptions = n, this.nodeHorizontal = this.virtualScrollOptions.maxNodeContainingRadius.horizontal, this.nodeVertical = this.virtualScrollOptions.maxNodeContainingRadius.vertical, this.canvasResizeObserver = new this.window.ResizeObserver((l) => {
      const g = l[0];
      this.viewportWidth = g.contentRect.width, this.viewportHeight = g.contentRect.height, this.scheduleLoadAreaAroundViewport();
    });
    const d = ((c = o == null ? void 0 : o.events) == null ? void 0 : c.onTransformFinished) ?? (() => {
    }), s = ((a = o == null ? void 0 : o.events) == null ? void 0 : a.onTransformChange) ?? (() => {
    }), h = {
      ...o,
      events: {
        ...o == null ? void 0 : o.events,
        onTransformChange: () => {
          const l = this.viewportMatrix;
          this.viewportMatrix = this.canvas.viewport.getViewportMatrix(), l.scale !== this.viewportMatrix.scale && this.scheduleEnsureViewportAreaLoaded(), s();
        },
        onTransformFinished: () => {
          this.scheduleLoadAreaAroundViewport(), d();
        }
      }
    };
    this.canvas = new ae(
      e,
      h
    ), this.viewportMatrix = this.canvas.viewport.getViewportMatrix(), this.viewport = this.canvas.viewport, this.transformation = this.viewport, this.graph = this.canvas.graph, this.model = this.graph, this.trigger.subscribe(this.updateLoadedArea);
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
  updateNode(e, r) {
    return this.canvas.updateNode(e, r), this;
  }
  removeNode(e) {
    return this.canvas.removeNode(e), this;
  }
  markPort(e) {
    return this.canvas.markPort(e), this;
  }
  updatePort(e, r) {
    return this.canvas.updatePort(e, r), this;
  }
  unmarkPort(e) {
    return this.canvas.unmarkPort(e), this;
  }
  addEdge(e) {
    return this.canvas.addEdge(e), this;
  }
  updateEdge(e, r) {
    return this.canvas.updateEdge(e, r), this;
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
    const e = this.viewportWidth * this.viewportMatrix.scale, r = this.viewportHeight * this.viewportMatrix.scale, o = this.viewportMatrix.x - this.nodeHorizontal, n = this.viewportMatrix.y - this.nodeVertical, d = this.viewportMatrix.x + e + this.nodeHorizontal, s = this.viewportMatrix.y + r + this.nodeVertical;
    this.loadedArea.xFrom < o && this.loadedArea.xTo > d && this.loadedArea.yFrom < n && this.loadedArea.yTo > s || this.scheduleLoadAreaAroundViewport();
  }
  loadAreaAroundViewport() {
    const e = this.viewportWidth * this.viewportMatrix.scale, r = this.viewportHeight * this.viewportMatrix.scale, o = this.viewportMatrix.x - e - this.nodeHorizontal, n = this.viewportMatrix.y - r - this.nodeVertical, d = 3 * e + 2 * this.nodeHorizontal, s = 3 * r + 2 * this.nodeVertical;
    this.trigger.emit({ x: o, y: n, width: d, height: s });
  }
}
class Ke {
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
  setUserDraggableNodes(e) {
    return this.hasDraggableNode = !0, this.dragOptions = e, this;
  }
  /**
   * @deprecated
   * use setUserTransformableViewport instead
   */
  setUserTransformableCanvas(e) {
    return this.setUserTransformableViewport(e);
  }
  /**
   * enables viewport transformable by user
   */
  setUserTransformableViewport(e) {
    return this.hasTransformableViewport = !0, this.transformOptions = e, this;
  }
  /**
   * enables automatic edges update on node resize
   */
  setResizeReactiveNodes() {
    return this.hasResizeReactiveNodes = !0, this;
  }
  /**
   * sets emitter for rendering graph inside bounded area
   */
  setBoxRenderingTrigger(e) {
    return this.boxRenderingTrigger = e, this;
  }
  setVirtualScroll(e) {
    return this.virtualScrollOptions = e, this;
  }
  /**
   * builds final canvas
   */
  build() {
    let e = this.boxRenderingTrigger;
    this.virtualScrollOptions !== void 0 && e === void 0 && (e = new se());
    const r = e !== void 0 ? $e(e) : De, o = new Le(this.coreOptions, r);
    let n = new be(o);
    return this.hasResizeReactiveNodes && (n = new ze(n)), this.hasDraggableNode && (n = new We(n, this.dragOptions)), this.virtualScrollOptions !== void 0 ? n = new He(
      n,
      e,
      this.transformOptions,
      this.virtualScrollOptions
    ) : this.hasTransformableViewport && (n = new ae(
      n,
      this.transformOptions
    )), n;
  }
}
export {
  ee as BezierEdgeShape,
  Ke as CanvasBuilder,
  Ge as CanvasCore,
  se as EventSubject,
  te as HorizontalEdgeShape,
  Ke as HtmlGraphBuilder,
  A as HtmlGraphError,
  ze as ResizeReactiveNodesCanvas,
  re as StraightEdgeShape,
  We as UserDraggableNodesCanvas,
  ae as UserTransformableCanvas,
  ae as UserTransformableViewportCanvas,
  oe as VerticalEdgeShape
};
