var Q = Object.defineProperty;
var Z = (e, t, o) => t in e ? Q(e, t, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[t] = o;
var n = (e, t, o) => Z(e, typeof t != "symbol" ? t + "" : t, o);
const O = (e, t) => ({
  x: e / 2,
  y: t / 2
}), v = (e, t, o) => ({
  x: t.x * e.x - t.y * e.y + ((1 - t.x) * o.x + t.y * o.y),
  y: t.y * e.x + t.x * e.y + ((1 - t.x) * o.y - t.y * o.x)
}), M = (e, t, o) => ({ x: t * Math.cos(e), y: o * Math.sin(e) }), w = {
  x: 0,
  y: 0
}, C = (e, t, o, r) => {
  const s = [
    w,
    { x: o, y: r },
    { x: o, y: -r }
  ].map((l) => v(l, e, w)).map((l) => ({ x: l.x + t.x, y: l.y + t.y })), h = `M ${s[0].x} ${s[0].y}`, c = `L ${s[1].x} ${s[1].y}`, d = `L ${s[2].x} ${s[2].y}`;
  return `${h} ${c} ${d}`;
}, $ = (e, t) => {
  const o = [];
  if (e.length > 0 && o.push(`M ${e[0].x} ${e[0].y}`), e.length === 2 && o.push(`L ${e[1].x} ${e[1].y}`), e.length > 2) {
    const r = e.length - 1;
    let i = 0, s = 0, h = 0;
    e.forEach((c, d) => {
      let l = 0, a = 0, g = 0;
      const y = d > 0, x = d < r, f = y && x;
      if (y && (l = -i, a = -s, g = h), x) {
        const m = e[d + 1];
        i = m.x - c.x, s = m.y - c.y, h = Math.sqrt(i * i + s * s);
      }
      const E = h !== 0 ? Math.min((f ? t : 0) / h, d < r - 1 ? 0.5 : 1) : 0, T = f ? { x: c.x + i * E, y: c.y + s * E } : c, L = g !== 0 ? Math.min((f ? t : 0) / g, d > 1 ? 0.5 : 1) : 0, D = f ? { x: c.x + l * L, y: c.y + a * L } : c;
      d > 0 && o.push(`L ${D.x} ${D.y}`), f && o.push(
        `C ${c.x} ${c.y} ${c.x} ${c.y} ${T.x} ${T.y}`
      );
    });
  }
  return o.join(" ");
}, W = () => {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  return e.style.pointerEvents = "none", e.style.position = "absolute", e.style.top = "0", e.style.left = "0", e.style.overflow = "visible", e;
}, F = () => {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "g");
  return e.style.transformOrigin = "50% 50%", e;
}, R = (e, t) => {
  const o = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return o.setAttribute("stroke", e), o.setAttribute("stroke-width", `${t}`), o.setAttribute("fill", "none"), o;
}, N = (e) => {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("fill", e), t;
}, Y = (e, t) => {
  const o = {
    x: e.x + e.width / 2,
    y: e.y + e.height / 2
  }, r = {
    x: t.x + t.width / 2,
    y: t.y + t.height / 2
  }, i = Math.min(o.x, r.x), s = Math.min(o.y, r.y), h = Math.abs(r.x - o.x), c = Math.abs(r.y - o.y), d = o.x <= r.x ? 1 : -1, l = o.y <= r.y ? 1 : -1;
  return {
    x: i,
    y: s,
    width: h,
    height: c,
    flipX: d,
    flipY: l
  };
}, q = (e) => {
  const t = v(
    { x: e.arrowLength, y: w.y },
    e.fromVect,
    w
  ), o = v(
    { x: e.to.x - e.arrowLength, y: e.to.y },
    e.toVect,
    e.to
  ), r = {
    x: t.x + e.fromVect.x * e.curvature,
    y: t.y + e.fromVect.y * e.curvature
  }, i = {
    x: o.x - e.toVect.x * e.curvature,
    y: o.y - e.toVect.y * e.curvature
  }, s = `M ${t.x} ${t.y} C ${r.x} ${r.y}, ${i.x} ${i.y}, ${o.x} ${o.y}`, h = e.hasSourceArrow ? "" : `M ${w.x} ${w.y} L ${t.x} ${t.y} `, c = e.hasTargetArrow ? "" : ` M ${o.x} ${o.y} L ${e.to.x} ${e.to.y}`;
  return `${h}${s}${c}`;
}, tt = (e) => {
  const t = e.hasSourceArrow ? v(
    { x: e.arrowLength, y: w.y },
    e.fromVect,
    w
  ) : w, o = e.hasTargetArrow ? v(
    { x: e.to.x - e.arrowLength, y: e.to.y },
    e.toVect,
    e.to
  ) : e.to, r = e.arrowLength, i = Math.cos(e.detourDirection) * e.detourDistance, s = Math.sin(e.detourDirection) * e.detourDistance, h = i * e.flipX, c = s * e.flipY, d = v(
    { x: r, y: w.y },
    e.fromVect,
    w
  ), l = {
    x: d.x + h,
    y: d.y + c
  }, a = v(
    { x: e.to.x - r, y: e.to.y },
    e.toVect,
    e.to
  ), g = {
    x: a.x + h,
    y: a.y + c
  }, y = { x: (l.x + g.x) / 2, y: (l.y + g.y) / 2 }, x = {
    x: d.x + e.curvature * e.fromVect.x,
    y: d.y + e.curvature * e.fromVect.y
  }, f = {
    x: a.x - e.curvature * e.toVect.x,
    y: a.y - e.curvature * e.toVect.y
  }, A = {
    x: d.x + h,
    y: d.y + c
  }, E = {
    x: a.x + h,
    y: a.y + c
  };
  return [
    `M ${t.x} ${t.y}`,
    `L ${d.x} ${d.y}`,
    `C ${x.x} ${x.y} ${A.x} ${A.y} ${y.x} ${y.y}`,
    `C ${E.x} ${E.y} ${f.x} ${f.y} ${a.x} ${a.y}`,
    `L ${o.x} ${o.y}`
  ].join(" ");
}, et = (e) => {
  const t = e.hasSourceArrow ? v(
    { x: e.arrowLength, y: w.y },
    e.fromVect,
    w
  ) : w, o = e.hasTargetArrow ? v(
    { x: e.to.x - e.arrowLength, y: e.to.y },
    e.toVect,
    e.to
  ) : e.to, r = e.arrowLength + e.arrowOffset, i = r - e.roundness, s = v({ x: i, y: w.y }, e.fromVect, w), h = v(
    { x: e.to.x - i, y: e.to.y },
    e.toVect,
    e.to
  ), c = Math.max((s.x + h.x) / 2, r), d = e.to.y / 2, l = { x: e.flipX > 0 ? c : -r, y: s.y }, a = { x: l.x, y: d }, g = {
    x: e.flipX > 0 ? e.to.x - c : e.to.x + r,
    y: h.y
  }, y = { x: g.x, y: d };
  return $(
    [t, s, l, a, y, g, h, o],
    e.roundness
  );
}, G = (e) => {
  const t = e.hasSourceArrow ? v(
    { x: e.arrowLength, y: w.y },
    e.fromVect,
    w
  ) : w, o = e.hasTargetArrow ? v(
    { x: e.to.x - e.arrowLength, y: e.to.y },
    e.toVect,
    e.to
  ) : e.to, r = e.arrowLength + e.arrowOffset, i = v(
    { x: r, y: w.y },
    e.fromVect,
    w
  ), s = Math.cos(e.detourDirection) * e.detourDistance, h = Math.sin(e.detourDirection) * e.detourDistance, c = s * e.flipX, d = h * e.flipY, l = { x: i.x + c, y: i.y + d }, a = v(
    { x: e.to.x - r, y: e.to.y },
    e.toVect,
    e.to
  ), g = { x: a.x + c, y: a.y + d };
  return $(
    [t, i, l, g, a, o],
    e.roundness
  );
}, ot = (e) => {
  const t = e.hasSourceArrow ? v(
    { x: e.arrowLength, y: w.y },
    e.fromVect,
    w
  ) : w, o = e.hasTargetArrow ? v(
    { x: e.to.x - e.arrowLength, y: e.to.y },
    e.toVect,
    e.to
  ) : e.to, r = e.arrowLength + e.arrowOffset, i = v({ x: r, y: w.y }, e.fromVect, w), s = v(
    { x: e.to.x - r, y: e.to.y },
    e.toVect,
    e.to
  );
  return $([t, i, s, o], e.roundness);
}, rt = (e) => {
  const t = e.hasSourceArrow ? v(
    { x: e.arrowLength, y: w.y },
    e.fromVect,
    w
  ) : w, o = e.hasTargetArrow ? v(
    { x: e.to.x - e.arrowLength, y: e.to.y },
    e.toVect,
    e.to
  ) : e.to, r = e.arrowLength + e.arrowOffset, i = r - e.roundness, s = v({ x: i, y: w.y }, e.fromVect, w), h = v(
    { x: e.to.x - i, y: e.to.y },
    e.toVect,
    e.to
  ), c = Math.max((s.y + h.y) / 2, r), d = e.to.x / 2, l = { x: s.x, y: e.flipY > 0 ? c : -r }, a = { x: d, y: l.y }, g = {
    x: h.x,
    y: e.flipY > 0 ? e.to.y - c : e.to.y + r
  }, y = { x: d, y: g.y };
  return $(
    [t, s, l, a, y, g, h, o],
    e.roundness
  );
}, U = (e) => {
  const t = e.arrowOffset, o = e.side, r = e.arrowLength + t, i = r + 2 * o, h = [
    { x: e.arrowLength, y: w.y },
    { x: r, y: w.y },
    { x: r, y: e.side },
    { x: i, y: e.side },
    { x: i, y: -e.side },
    { x: r, y: -e.side },
    { x: r, y: w.y },
    { x: e.arrowLength, y: w.y }
  ].map(
    (d) => v(d, e.fromVect, w)
  ), c = `M ${w.x} ${w.y} L ${h[0].x} ${h[0].y} `;
  return `${e.hasSourceArrow || e.hasTargetArrow ? "" : c}${$(h, e.roundness)}`;
}, it = (e) => {
  const t = e.smallRadius, o = e.radius, r = Math.sqrt(t * t + o * o), i = t + o, s = e.arrowLength + r * (1 - o / i), h = t * o / i, d = [
    { x: e.arrowLength, y: w.y },
    { x: s, y: h },
    { x: s, y: -h }
  ].map((g) => v(g, e.fromVect, w)), l = [
    `M ${d[0].x} ${d[0].y}`,
    `A ${t} ${t} 0 0 1 ${d[1].x} ${d[1].y}`,
    `A ${o} ${o} 0 1 0 ${d[2].x} ${d[2].y}`,
    `A ${t} ${t} 0 0 1 ${d[0].x} ${d[0].y}`
  ].join(" "), a = `M 0 0 L ${d[0].x} ${d[0].y} `;
  return `${e.hasSourceArrow || e.hasTargetArrow ? "" : a}${l}`;
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
class nt {
  constructor(t) {
    n(this, "svg", W());
    n(this, "group", F());
    n(this, "line");
    n(this, "sourceArrow", null);
    n(this, "targetArrow", null);
    n(this, "arrowLength");
    n(this, "arrowWidth");
    n(this, "curvature");
    n(this, "portCycleRadius");
    n(this, "portCycleSmallRadius");
    n(this, "detourDirection");
    n(this, "detourDistance");
    n(this, "hasSourceArrow");
    n(this, "hasTargetArrow");
    this.arrowLength = (t == null ? void 0 : t.arrowLength) ?? u.arrowLength, this.arrowWidth = (t == null ? void 0 : t.arrowWidth) ?? u.arrowWidth, this.curvature = (t == null ? void 0 : t.curvature) ?? u.curvature, this.portCycleRadius = (t == null ? void 0 : t.cycleRadius) ?? u.cycleRadius, this.portCycleSmallRadius = (t == null ? void 0 : t.smallCycleRadius) ?? u.smallCycleRadius, this.detourDirection = (t == null ? void 0 : t.detourDirection) ?? u.detourDirection, this.detourDistance = (t == null ? void 0 : t.detourDistance) ?? u.detourDistance, this.hasSourceArrow = (t == null ? void 0 : t.hasSourceArrow) ?? u.hasSourceArrow, this.hasTargetArrow = (t == null ? void 0 : t.hasTargetArrow) ?? u.hasTargetArrow;
    const o = (t == null ? void 0 : t.color) ?? u.color, r = (t == null ? void 0 : t.width) ?? u.width;
    this.svg.appendChild(this.group), this.line = R(o, r), this.group.appendChild(this.line), this.hasSourceArrow && (this.sourceArrow = N(o), this.group.appendChild(this.sourceArrow)), this.hasTargetArrow && (this.targetArrow = N(o), this.group.appendChild(this.targetArrow));
  }
  render(t) {
    const { x: o, y: r, width: i, height: s, flipX: h, flipY: c } = Y(
      t.from,
      t.to
    );
    this.svg.style.transform = `translate(${o}px, ${r}px)`, this.svg.style.width = `${i}px`, this.svg.style.height = `${s}px`, this.group.style.transform = `scale(${h}, ${c})`;
    const d = M(
      t.from.direction,
      h,
      c
    ), l = M(t.to.direction, h, c), a = {
      x: i,
      y: s
    };
    let g, y = l, x = -this.arrowLength;
    if (t.from.portId === t.to.portId ? (g = it({
      fromVect: d,
      radius: this.portCycleRadius,
      smallRadius: this.portCycleSmallRadius,
      arrowLength: this.arrowLength,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), y = d, x = this.arrowLength) : t.from.nodeId === t.to.nodeId ? g = tt({
      to: a,
      fromVect: d,
      toVect: l,
      flipX: h,
      flipY: c,
      arrowLength: this.arrowLength,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      curvature: this.curvature,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }) : g = q({
      to: a,
      fromVect: d,
      toVect: l,
      arrowLength: this.arrowLength,
      curvature: this.curvature,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), this.line.setAttribute("d", g), this.sourceArrow) {
      const f = C(
        d,
        w,
        this.arrowLength,
        this.arrowWidth
      );
      this.sourceArrow.setAttribute("d", f);
    }
    if (this.targetArrow) {
      const f = C(
        y,
        a,
        x,
        this.arrowWidth
      );
      this.targetArrow.setAttribute("d", f);
    }
  }
}
class st {
  constructor(t) {
    n(this, "svg", W());
    n(this, "group", F());
    n(this, "line");
    n(this, "sourceArrow", null);
    n(this, "targetArrow", null);
    n(this, "arrowLength");
    n(this, "arrowWidth");
    n(this, "arrowOffset");
    n(this, "roundness");
    n(this, "cycleSquareSide");
    n(this, "detourDirection");
    n(this, "detourDistance");
    n(this, "hasSourceArrow");
    n(this, "hasTargetArrow");
    this.arrowLength = (t == null ? void 0 : t.arrowLength) ?? u.arrowLength, this.arrowWidth = (t == null ? void 0 : t.arrowWidth) ?? u.arrowWidth, this.arrowOffset = (t == null ? void 0 : t.arrowOffset) ?? u.arrowOffset, this.cycleSquareSide = (t == null ? void 0 : t.cycleSquareSide) ?? u.cycleSquareSide;
    const o = (t == null ? void 0 : t.roundness) ?? u.roundness;
    this.roundness = Math.min(
      o,
      this.arrowOffset,
      this.cycleSquareSide / 2
    ), this.detourDirection = (t == null ? void 0 : t.detourDirection) ?? u.detourDirection, this.detourDistance = (t == null ? void 0 : t.detourDistance) ?? u.detourDistance, this.hasSourceArrow = (t == null ? void 0 : t.hasSourceArrow) ?? u.hasSourceArrow, this.hasTargetArrow = (t == null ? void 0 : t.hasTargetArrow) ?? u.hasTargetArrow;
    const r = (t == null ? void 0 : t.color) ?? u.color, i = (t == null ? void 0 : t.width) ?? u.width;
    this.svg.appendChild(this.group), this.line = R(r, i), this.group.appendChild(this.line), this.hasSourceArrow && (this.sourceArrow = N(r), this.group.appendChild(this.sourceArrow)), this.hasTargetArrow && (this.targetArrow = N(r), this.group.appendChild(this.targetArrow));
  }
  render(t) {
    const { x: o, y: r, width: i, height: s, flipX: h, flipY: c } = Y(
      t.from,
      t.to
    );
    this.svg.style.transform = `translate(${o}px, ${r}px)`, this.svg.style.width = `${i}px`, this.svg.style.height = `${s}px`, this.group.style.transform = `scale(${h}, ${c})`;
    const d = M(
      t.from.direction,
      h,
      c
    ), l = M(t.to.direction, h, c), a = {
      x: i,
      y: s
    };
    let g, y = l, x = -this.arrowLength;
    if (t.from.portId === t.to.portId ? (g = U({
      fromVect: d,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), y = d, x = this.arrowLength) : t.from.nodeId === t.to.nodeId ? g = G({
      to: a,
      fromVect: d,
      toVect: l,
      flipX: h,
      flipY: c,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }) : g = et({
      to: a,
      fromVect: d,
      toVect: l,
      flipX: h,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), this.line.setAttribute("d", g), this.sourceArrow) {
      const f = C(
        d,
        w,
        this.arrowLength,
        this.arrowWidth
      );
      this.sourceArrow.setAttribute("d", f);
    }
    if (this.targetArrow) {
      const f = C(
        y,
        a,
        x,
        this.arrowWidth
      );
      this.targetArrow.setAttribute("d", f);
    }
  }
}
class ht {
  constructor(t) {
    n(this, "svg", W());
    n(this, "group", F());
    n(this, "line");
    n(this, "sourceArrow", null);
    n(this, "targetArrow", null);
    n(this, "arrowLength");
    n(this, "arrowWidth");
    n(this, "arrowOffset");
    n(this, "roundness");
    n(this, "cycleSquareSide");
    n(this, "detourDirection");
    n(this, "detourDistance");
    n(this, "hasSourceArrow");
    n(this, "hasTargetArrow");
    this.arrowLength = (t == null ? void 0 : t.arrowLength) ?? u.arrowLength, this.arrowWidth = (t == null ? void 0 : t.arrowWidth) ?? u.arrowWidth, this.arrowOffset = (t == null ? void 0 : t.arrowOffset) ?? u.arrowOffset, this.cycleSquareSide = (t == null ? void 0 : t.cycleSquareSide) ?? u.cycleSquareSide;
    const o = (t == null ? void 0 : t.roundness) ?? u.roundness;
    this.roundness = Math.min(
      o,
      this.arrowOffset,
      this.cycleSquareSide / 2
    ), this.detourDirection = (t == null ? void 0 : t.detourDirection) ?? u.detourDirection, this.detourDistance = (t == null ? void 0 : t.detourDistance) ?? u.detourDistance, this.hasSourceArrow = (t == null ? void 0 : t.hasSourceArrow) ?? u.hasSourceArrow, this.hasTargetArrow = (t == null ? void 0 : t.hasTargetArrow) ?? u.hasTargetArrow;
    const r = (t == null ? void 0 : t.color) ?? u.color, i = (t == null ? void 0 : t.width) ?? u.width;
    this.svg.appendChild(this.group), this.line = R(r, i), this.group.appendChild(this.line), this.hasSourceArrow && (this.sourceArrow = N(r), this.group.appendChild(this.sourceArrow)), this.hasTargetArrow && (this.targetArrow = N(r), this.group.appendChild(this.targetArrow));
  }
  render(t) {
    const { x: o, y: r, width: i, height: s, flipX: h, flipY: c } = Y(
      t.from,
      t.to
    );
    this.svg.style.transform = `translate(${o}px, ${r}px)`, this.svg.style.width = `${i}px`, this.svg.style.height = `${s}px`, this.group.style.transform = `scale(${h}, ${c})`;
    const d = M(
      t.from.direction,
      h,
      c
    ), l = M(t.to.direction, h, c), a = {
      x: i,
      y: s
    };
    let g, y = l, x = -this.arrowLength;
    if (t.from.portId === t.to.portId ? (g = U({
      fromVect: d,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), y = d, x = this.arrowLength) : t.from.nodeId === t.to.nodeId ? g = G({
      to: a,
      fromVect: d,
      toVect: l,
      flipX: h,
      flipY: c,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }) : g = ot({
      to: a,
      fromVect: d,
      toVect: l,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), this.line.setAttribute("d", g), this.sourceArrow) {
      const f = C(
        d,
        w,
        this.arrowLength,
        this.arrowWidth
      );
      this.sourceArrow.setAttribute("d", f);
    }
    if (this.targetArrow) {
      const f = C(
        y,
        a,
        x,
        this.arrowWidth
      );
      this.targetArrow.setAttribute("d", f);
    }
  }
}
class ct {
  constructor(t) {
    n(this, "svg", W());
    n(this, "group", F());
    n(this, "line");
    n(this, "sourceArrow", null);
    n(this, "targetArrow", null);
    n(this, "arrowLength");
    n(this, "arrowWidth");
    n(this, "arrowOffset");
    n(this, "roundness");
    n(this, "cycleSquareSide");
    n(this, "detourDirection");
    n(this, "detourDistance");
    n(this, "hasSourceArrow");
    n(this, "hasTargetArrow");
    this.arrowLength = (t == null ? void 0 : t.arrowLength) ?? u.arrowLength, this.arrowWidth = (t == null ? void 0 : t.arrowWidth) ?? u.arrowWidth, this.arrowOffset = (t == null ? void 0 : t.arrowOffset) ?? u.arrowOffset, this.cycleSquareSide = (t == null ? void 0 : t.cycleSquareSide) ?? u.cycleSquareSide;
    const o = (t == null ? void 0 : t.roundness) ?? u.roundness;
    this.roundness = Math.min(
      o,
      this.arrowOffset,
      this.cycleSquareSide / 2
    ), this.detourDirection = (t == null ? void 0 : t.detourDirection) ?? u.detourDirectionVertical, this.detourDistance = (t == null ? void 0 : t.detourDistance) ?? u.detourDistance, this.hasSourceArrow = (t == null ? void 0 : t.hasSourceArrow) ?? u.hasSourceArrow, this.hasTargetArrow = (t == null ? void 0 : t.hasTargetArrow) ?? u.hasTargetArrow;
    const r = (t == null ? void 0 : t.color) ?? u.color, i = (t == null ? void 0 : t.width) ?? u.width;
    this.svg.appendChild(this.group), this.line = R(r, i), this.group.appendChild(this.line), this.hasSourceArrow && (this.sourceArrow = N(r), this.group.appendChild(this.sourceArrow)), this.hasTargetArrow && (this.targetArrow = N(r), this.group.appendChild(this.targetArrow));
  }
  render(t) {
    const { x: o, y: r, width: i, height: s, flipX: h, flipY: c } = Y(
      t.from,
      t.to
    );
    this.svg.style.transform = `translate(${o}px, ${r}px)`, this.svg.style.width = `${i}px`, this.svg.style.height = `${s}px`, this.group.style.transform = `scale(${h}, ${c})`;
    const d = M(
      t.from.direction,
      h,
      c
    ), l = M(t.to.direction, h, c), a = {
      x: i,
      y: s
    };
    let g, y = l, x = -this.arrowLength;
    if (t.from.portId === t.to.portId ? (g = U({
      fromVect: d,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), y = d, x = this.arrowLength) : t.from.nodeId === t.to.nodeId ? g = G({
      to: a,
      fromVect: d,
      toVect: l,
      flipX: h,
      flipY: c,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }) : g = rt({
      to: a,
      fromVect: d,
      toVect: l,
      flipY: c,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow
    }), this.line.setAttribute("d", g), this.sourceArrow) {
      const f = C(
        d,
        w,
        this.arrowLength,
        this.arrowWidth
      );
      this.sourceArrow.setAttribute("d", f);
    }
    if (this.targetArrow) {
      const f = C(
        y,
        a,
        x,
        this.arrowWidth
      );
      this.targetArrow.setAttribute("d", f);
    }
  }
}
const dt = (e) => {
  if (typeof e == "function")
    return e;
  switch (e == null ? void 0 : e.type) {
    case "straight":
      return () => new ht({
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
      return () => new st({
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
      return () => new ct({
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
      return () => new nt({
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
}, z = (e) => () => e, H = z(0), k = () => {
  let e = 0;
  return () => e++;
}, lt = (e, t) => {
  let o = H, r = H;
  e === "incremental" && (o = k()), t === "incremental" && (r = k());
  const i = k();
  return e === "shared-incremental" && (o = i), t === "shared-incremental" && (r = i), typeof e == "number" && (o = z(e)), typeof t == "number" && (r = z(t)), typeof e == "function" && (o = e), typeof t == "function" && (r = t), {
    nodesPriorityFn: o,
    edgesPriorityFn: r
  };
}, at = (e) => {
  var o, r, i, s, h;
  const t = lt(
    (o = e == null ? void 0 : e.nodes) == null ? void 0 : o.priority,
    (r = e == null ? void 0 : e.edges) == null ? void 0 : r.priority
  );
  return {
    nodes: {
      centerFn: ((i = e == null ? void 0 : e.nodes) == null ? void 0 : i.centerFn) ?? O,
      priorityFn: t.nodesPriorityFn
    },
    ports: {
      direction: ((s = e == null ? void 0 : e.ports) == null ? void 0 : s.direction) ?? 0
    },
    edges: {
      shapeFactory: dt(((h = e == null ? void 0 : e.edges) == null ? void 0 : h.shape) ?? {}),
      priorityFn: t.edgesPriorityFn
    }
  };
};
class gt {
  constructor() {
    n(this, "nodes", /* @__PURE__ */ new Map());
    n(this, "ports", /* @__PURE__ */ new Map());
    n(this, "nodePorts", /* @__PURE__ */ new Map());
    n(this, "portNodeId", /* @__PURE__ */ new Map());
    n(this, "edges", /* @__PURE__ */ new Map());
    n(this, "incommingEdges", /* @__PURE__ */ new Map());
    n(this, "outcommingEdges", /* @__PURE__ */ new Map());
    n(this, "cycleEdges", /* @__PURE__ */ new Map());
  }
  addNode(t) {
    this.nodes.set(t.nodeId, {
      element: t.element,
      x: t.x,
      y: t.y,
      centerFn: t.centerFn,
      priority: t.priority
    }), this.nodePorts.set(t.nodeId, /* @__PURE__ */ new Map());
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
    this.ports.set(t.portId, {
      element: t.element,
      direction: t.direction
    }), this.cycleEdges.set(t.portId, /* @__PURE__ */ new Set()), this.incommingEdges.set(t.portId, /* @__PURE__ */ new Set()), this.outcommingEdges.set(t.portId, /* @__PURE__ */ new Set()), this.portNodeId.set(t.portId, t.nodeId), this.nodePorts.get(t.nodeId).set(t.portId, t.element);
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
    this.edges.set(t.edgeId, {
      from: t.from,
      to: t.to,
      shape: t.shape,
      priority: t.priority
    }), t.from !== t.to ? (this.outcommingEdges.get(t.from).add(t.edgeId), this.incommingEdges.get(t.to).add(t.edgeId)) : this.cycleEdges.get(t.from).add(t.edgeId);
  }
  updateEdgeFrom(t, o) {
    const r = this.edges.get(t);
    this.removeEdge(t), this.addEdge({
      edgeId: t,
      from: o,
      to: r.to,
      shape: r.shape,
      priority: r.priority
    });
  }
  updateEdgeTo(t, o) {
    const r = this.edges.get(t);
    this.removeEdge(t), this.addEdge({
      edgeId: t,
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
    const o = this.edges.get(t), r = o.from, i = o.to;
    this.cycleEdges.get(r).delete(t), this.cycleEdges.get(i).delete(t), this.incommingEdges.get(r).delete(t), this.incommingEdges.get(i).delete(t), this.outcommingEdges.get(r).delete(t), this.outcommingEdges.get(i).delete(t), this.edges.delete(t);
  }
  clear() {
    this.nodes.clear(), this.ports.clear(), this.nodePorts.clear(), this.portNodeId.clear(), this.edges.clear(), this.incommingEdges.clear(), this.outcommingEdges.clear(), this.cycleEdges.clear();
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
    return o.forEach((i) => {
      r = [...r, ...this.getPortIncomingEdgeIds(i)];
    }), r;
  }
  getNodeOutcomingEdgeIds(t) {
    const o = Array.from(this.nodePorts.get(t).keys());
    let r = [];
    return o.forEach((i) => {
      r = [...r, ...this.getPortOutcomingEdgeIds(i)];
    }), r;
  }
  getNodeCycleEdgeIds(t) {
    const o = Array.from(this.nodePorts.get(t).keys());
    let r = [];
    return o.forEach((i) => {
      r = [...r, ...this.getPortCycleEdgeIds(i)];
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
const K = (e) => ({
  scale: 1 / e.scale,
  x: -e.x / e.scale,
  y: -e.y / e.scale
}), _ = {
  scale: 1,
  x: 0,
  y: 0
};
class ut {
  constructor() {
    n(this, "viewportMatrix", _);
    n(this, "contentMatrix", _);
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
    }, this.contentMatrix = K(this.viewportMatrix);
  }
  patchContentMatrix(t) {
    this.contentMatrix = {
      scale: t.scale ?? this.contentMatrix.scale,
      x: t.x ?? this.contentMatrix.x,
      y: t.y ?? this.contentMatrix.y
    }, this.viewportMatrix = K(this.contentMatrix);
  }
}
class wt {
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
const yt = () => {
  const e = document.createElement("div");
  return e.style.width = "100%", e.style.height = "100%", e.style.position = "relative", e.style.overflow = "hidden", e;
}, ft = () => {
  const e = document.createElement("div");
  return e.style.position = "absolute", e.style.top = "0", e.style.left = "0", e.style.width = "0", e.style.height = "0", e;
}, vt = () => {
  const e = document.createElement("div");
  return e.style.position = "absolute", e.style.top = "0", e.style.left = "0", e.style.visibility = "hidden", e;
};
class xt {
  constructor(t, o) {
    n(this, "canvasWrapper", null);
    n(this, "host", yt());
    n(this, "container", ft());
    n(this, "nodeIdToWrapperElementMap", /* @__PURE__ */ new Map());
    n(this, "edgeIdToElementMap", /* @__PURE__ */ new Map());
    this.graphStore = t, this.viewportTransformer = o, this.host.appendChild(this.container);
  }
  attach(t) {
    this.detach(), this.canvasWrapper = t, this.canvasWrapper.appendChild(this.host);
  }
  detach() {
    this.canvasWrapper !== null && (this.canvasWrapper.removeChild(this.host), this.canvasWrapper = null);
  }
  applyTransform() {
    const t = this.viewportTransformer.getContentMatrix();
    this.container.style.transform = `matrix(${t.scale}, 0, 0, ${t.scale}, ${t.x}, ${t.y})`;
  }
  attachNode(t) {
    const o = this.graphStore.getNode(t), r = vt();
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
    this.clear(), this.detach(), this.host.removeChild(this.container);
  }
  updateNodeCoordinates(t) {
    const o = this.nodeIdToWrapperElementMap.get(t), r = this.graphStore.getNode(t), { width: i, height: s } = r.element.getBoundingClientRect(), h = this.viewportTransformer.getViewportMatrix().scale, c = r.centerFn(i, s), d = r.x - h * c.x, l = r.y - h * c.y;
    o.style.transform = `translate(${d}px, ${l}px)`;
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
    const o = this.graphStore.getEdge(t), r = this.graphStore.getPort(o.from), i = this.graphStore.getPort(o.to), s = r.element.getBoundingClientRect(), h = i.element.getBoundingClientRect(), c = this.host.getBoundingClientRect(), d = this.viewportTransformer.getViewportMatrix(), l = {
      x: d.scale * (s.left - c.left) + d.x,
      y: d.scale * (s.top - c.top) + d.y
    }, a = {
      x: d.scale * (h.left - c.left) + d.x,
      y: d.scale * (h.top - c.top) + d.y
    }, g = {
      x: l.x,
      y: l.y,
      width: s.width * d.scale,
      height: s.height * d.scale,
      direction: r.direction,
      portId: o.from,
      nodeId: this.graphStore.getPortNodeId(o.from)
    }, y = {
      x: a.x,
      y: a.y,
      width: h.width * d.scale,
      height: h.height * d.scale,
      direction: i.direction,
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
class I {
  constructor(t) {
    n(this, "counter", 0);
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
class S extends Error {
  constructor() {
    super(...arguments);
    n(this, "name", "HtmlGraphError");
  }
}
class St {
  constructor(t, o, r, i, s, h, c) {
    n(this, "nodeIdGenerator", new I(
      (t) => this.graphStore.getNode(t) !== void 0
    ));
    n(this, "portIdGenerator", new I(
      (t) => this.graphStore.getPort(t) !== void 0
    ));
    n(this, "edgeIdGenerator", new I(
      (t) => this.graphStore.getEdge(t) !== void 0
    ));
    this.graphStore = t, this.htmlController = o, this.viewportTransformer = r, this.defaultNodesCenterFn = i, this.defaultPortsDirection = s, this.defaultNodesPriorityFn = h, this.defaultEdgesPriorityFn = c;
  }
  attach(t) {
    this.htmlController.attach(t);
  }
  detach() {
    this.htmlController.detach();
  }
  addNode(t) {
    const o = this.nodeIdGenerator.create(t.nodeId);
    if (this.graphStore.getNode(o) !== void 0)
      throw new S("failed to add node with existing id");
    this.graphStore.addNode({
      nodeId: o,
      element: t.element,
      x: t.x,
      y: t.y,
      centerFn: t.centerFn ?? this.defaultNodesCenterFn,
      priority: t.priority ?? this.defaultNodesPriorityFn()
    }), this.htmlController.attachNode(o), Array.from(t.ports ?? []).forEach((r) => {
      this.markPort({
        portId: r.id,
        element: r.element,
        nodeId: o,
        direction: r.direction
      });
    });
  }
  markPort(t) {
    const o = this.portIdGenerator.create(t.portId);
    if (this.graphStore.getPort(o) !== void 0)
      throw new S("failed to add port with existing id");
    if (this.graphStore.getNode(t.nodeId) === void 0)
      throw new S("failed to set port on nonexisting node");
    this.graphStore.addPort({
      portId: o,
      element: t.element,
      nodeId: t.nodeId,
      direction: t.direction ?? this.defaultPortsDirection
    });
  }
  addEdge(t) {
    const o = this.edgeIdGenerator.create(t.edgeId);
    if (this.graphStore.getEdge(o) !== void 0)
      throw new S("failed to add edge with existing id");
    if (this.graphStore.getPort(t.from) === void 0)
      throw new S("failed to add edge from nonexisting port");
    if (this.graphStore.getPort(t.to) === void 0)
      throw new S("failed to add edge to nonexisting port");
    this.graphStore.addEdge({
      edgeId: o,
      from: t.from,
      to: t.to,
      shape: t.shape,
      priority: t.priority ?? this.defaultEdgesPriorityFn()
    }), this.htmlController.attachEdge(o);
  }
  updateEdge(t) {
    const o = this.graphStore.getEdge(t.edgeId);
    if (o === void 0)
      throw new S("failed to update nonexisting edge");
    t.shape !== void 0 && (o.shape = t.shape, this.htmlController.updateEdgeShape(t.edgeId)), t.priority !== void 0 && (o.priority = t.priority, this.htmlController.updateEdgePriority(t.edgeId)), t.from !== void 0 && this.graphStore.updateEdgeFrom(t.edgeId, t.from), t.to !== void 0 && this.graphStore.updateEdgeTo(t.edgeId, t.to), this.htmlController.renderEdge(t.edgeId);
  }
  updatePort(t, o) {
    const r = this.graphStore.getPort(t);
    if (r === void 0)
      throw new S("failed to unset nonexisting port");
    r.direction = o.direction ?? r.direction, this.graphStore.getPortAdjacentEdgeIds(t).forEach((s) => {
      this.htmlController.renderEdge(s);
    });
  }
  updateNode(t, o) {
    const r = this.graphStore.getNode(t);
    if (r === void 0)
      throw new S("failed to update nonexisting node");
    r.x = (o == null ? void 0 : o.x) ?? r.x, r.y = (o == null ? void 0 : o.y) ?? r.y, r.centerFn = (o == null ? void 0 : o.centerFn) ?? r.centerFn, r.priority = (o == null ? void 0 : o.priority) ?? r.priority, this.htmlController.updateNodeCoordinates(t), this.htmlController.updateNodePriority(t), this.graphStore.getNodeAdjacentEdgeIds(t).forEach((s) => {
      this.htmlController.renderEdge(s);
    });
  }
  removeEdge(t) {
    if (this.graphStore.getEdge(t) === void 0)
      throw new S("failed to remove nonexisting edge");
    this.htmlController.detachEdge(t), this.graphStore.removeEdge(t);
  }
  unmarkPort(t) {
    if (this.graphStore.getPort(t) === void 0)
      throw new S("failed to unset nonexisting port");
    this.graphStore.getPortAdjacentEdgeIds(t).forEach((o) => {
      this.removeEdge(o);
    }), this.graphStore.removePort(t);
  }
  removeNode(t) {
    if (this.graphStore.getNode(t) === void 0)
      throw new S("failed to remove nonexisting node");
    this.graphStore.getNodePortIds(t).forEach((o) => {
      this.unmarkPort(o);
    }), this.htmlController.detachNode(t), this.graphStore.removeNode(t);
  }
  patchViewportMatrix(t) {
    this.viewportTransformer.patchViewportMatrix(t), this.htmlController.applyTransform();
  }
  patchContentMatrix(t) {
    this.viewportTransformer.patchContentMatrix(t), this.htmlController.applyTransform();
  }
  clear() {
    this.htmlController.clear(), this.graphStore.clear(), this.nodeIdGenerator.reset(), this.portIdGenerator.reset(), this.edgeIdGenerator.reset();
  }
  destroy() {
    this.clear(), this.htmlController.destroy();
  }
}
class Et {
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
class At {
  constructor(t) {
    n(this, "transformation");
    n(this, "model");
    n(this, "canvasController");
    n(this, "edgeShapeFactory");
    this.apiOptions = t;
    const o = at(this.apiOptions), r = new ut(), i = new gt();
    this.model = new Et(i), this.transformation = new wt(r);
    const s = new xt(i, r);
    this.canvasController = new St(
      i,
      s,
      r,
      o.nodes.centerFn,
      o.ports.direction,
      o.nodes.priorityFn,
      o.edges.priorityFn
    ), this.edgeShapeFactory = o.edges.shapeFactory;
  }
  attach(t) {
    return this.canvasController.attach(t), this;
  }
  detach() {
    return this.canvasController.detach(), this;
  }
  addNode(t) {
    return this.canvasController.addNode({
      nodeId: t.id,
      element: t.element,
      x: t.x,
      y: t.y,
      ports: t.ports,
      centerFn: t.centerFn,
      priority: t.priority
    }), this;
  }
  updateNode(t, o) {
    return this.canvasController.updateNode(t, {
      x: o == null ? void 0 : o.x,
      y: o == null ? void 0 : o.y,
      priority: o == null ? void 0 : o.priority,
      centerFn: o == null ? void 0 : o.centerFn
    }), this;
  }
  removeNode(t) {
    return this.canvasController.removeNode(t), this;
  }
  addEdge(t) {
    return this.canvasController.addEdge({
      edgeId: t.id,
      from: t.from,
      to: t.to,
      shape: t.shape ?? this.edgeShapeFactory(),
      priority: t.priority
    }), this;
  }
  updateEdge(t, o) {
    return this.canvasController.updateEdge({
      edgeId: t,
      shape: o == null ? void 0 : o.shape,
      priority: o == null ? void 0 : o.priority,
      from: o == null ? void 0 : o.from,
      to: o == null ? void 0 : o.to
    }), this;
  }
  removeEdge(t) {
    return this.canvasController.removeEdge(t), this;
  }
  markPort(t) {
    return this.canvasController.markPort({
      portId: t.id,
      element: t.element,
      nodeId: t.nodeId,
      direction: t.direction
    }), this;
  }
  updatePort(t, o) {
    return this.canvasController.updatePort(t, {
      direction: o == null ? void 0 : o.direction
    }), this;
  }
  unmarkPort(t) {
    return this.canvasController.unmarkPort(t), this;
  }
  patchViewportMatrix(t) {
    return this.canvasController.patchViewportMatrix(t), this;
  }
  patchContentMatrix(t) {
    return this.canvasController.patchContentMatrix(t), this;
  }
  clear() {
    return this.canvasController.clear(), this;
  }
  destroy() {
    this.clear(), this.canvasController.destroy();
  }
}
const V = (e, t, o) => {
  const { x: r, y: i, width: s, height: h } = e.getBoundingClientRect();
  return t >= r && t <= r + s && o >= i && o <= i + h;
}, p = (e, t, o) => t >= 0 && t <= e.innerWidth && o >= 0 && o <= e.innerHeight, b = (e, t) => {
  t !== null ? e.style.cursor = t : e.style.removeProperty("cursor");
}, Tt = (e) => {
  var g, y, x, f, A, E;
  const t = ((g = e == null ? void 0 : e.events) == null ? void 0 : g.onNodeDrag) ?? (() => {
  }), o = ((y = e == null ? void 0 : e.events) == null ? void 0 : y.onBeforeNodeDrag) ?? (() => !0), r = ((x = e == null ? void 0 : e.events) == null ? void 0 : x.onNodeDragFinished) ?? (() => {
  }), i = (e == null ? void 0 : e.moveOnTop) === !1, s = (f = e == null ? void 0 : e.mouse) == null ? void 0 : f.dragCursor, h = s !== void 0 ? s : "grab", c = (A = e == null ? void 0 : e.mouse) == null ? void 0 : A.mouseDownEventVerifier, d = c !== void 0 ? c : (T) => T.button === 0, l = (E = e == null ? void 0 : e.mouse) == null ? void 0 : E.mouseUpEventVerifier;
  return {
    freezePriority: i,
    dragCursor: h,
    mouseDownEventVerifier: d,
    mouseUpEventVerifier: l !== void 0 ? l : (T) => T.button === 0,
    onNodeDrag: t,
    onBeforeNodeDrag: o,
    onNodeDragFinished: r
  };
};
class Mt {
  constructor(t, o) {
    n(this, "model");
    n(this, "transformation");
    n(this, "maxNodePriority", 0);
    n(this, "nodes", /* @__PURE__ */ new Map());
    n(this, "grabbedNodeId", null);
    n(this, "nodeIdGenerator", new I(
      (t) => this.nodes.has(t)
    ));
    n(this, "element", null);
    n(this, "onWindowMouseMove", (t) => {
      if (this.element !== null && (!V(this.element, t.clientX, t.clientY) || !p(this.window, t.clientX, t.clientY))) {
        this.cancelMouseDrag();
        return;
      }
      this.grabbedNodeId !== null && this.dragNode(this.grabbedNodeId, t.movementX, t.movementY);
    });
    n(this, "onWindowMouseUp", (t) => {
      this.options.mouseUpEventVerifier(t) && this.cancelMouseDrag();
    });
    n(this, "onWindowTouchMove", (t) => {
      if (t.touches.length !== 1)
        return;
      const o = t.touches[0];
      if (this.element !== null && (!V(this.element, o.clientX, o.clientY) || !p(this.window, o.clientX, o.clientY))) {
        this.cancelTouchDrag();
        return;
      }
      if (this.grabbedNodeId !== null && this.previousTouchCoords !== null) {
        const r = o.clientX - this.previousTouchCoords.x, i = o.clientY - this.previousTouchCoords.y;
        this.dragNode(this.grabbedNodeId, r, i), this.previousTouchCoords = {
          x: t.touches[0].clientX,
          y: t.touches[0].clientY
        };
      }
    });
    n(this, "onWindowTouchFinish", () => {
      this.previousTouchCoords = null, this.cancelTouchDrag();
    });
    n(this, "previousTouchCoords", null);
    n(this, "window", window);
    n(this, "options");
    this.canvas = t, this.transformation = this.canvas.transformation, this.model = this.canvas.model, this.options = Tt(o ?? {});
  }
  attach(t) {
    return this.detach(), this.element = t, this.canvas.attach(this.element), this;
  }
  detach() {
    return this.canvas.detach(), this.element !== null && (this.element = null), this;
  }
  addNode(t) {
    const o = this.nodeIdGenerator.create(t.id);
    this.canvas.addNode({ ...t, id: o }), this.updateMaxNodePriority(o);
    const r = (s) => {
      if (this.element === null || !this.options.mouseDownEventVerifier(s))
        return;
      const h = this.model.getNode(o);
      this.options.onBeforeNodeDrag({
        nodeId: o,
        element: t.element,
        x: h.x,
        y: h.y
      }) && (s.stopImmediatePropagation(), this.grabbedNodeId = o, b(this.element, this.options.dragCursor), this.moveNodeOnTop(o), this.window.addEventListener("mouseup", this.onWindowMouseUp), this.window.addEventListener("mousemove", this.onWindowMouseMove));
    }, i = (s) => {
      if (s.touches.length !== 1)
        return;
      s.stopImmediatePropagation(), this.previousTouchCoords = {
        x: s.touches[0].clientX,
        y: s.touches[0].clientY
      };
      const h = this.model.getNode(o);
      this.options.onBeforeNodeDrag({
        nodeId: o,
        element: t.element,
        x: h.x,
        y: h.y
      }) && (this.grabbedNodeId = o, this.moveNodeOnTop(o), this.window.addEventListener("touchmove", this.onWindowTouchMove), this.window.addEventListener("touchend", this.onWindowTouchFinish), this.window.addEventListener("touchcancel", this.onWindowTouchFinish));
    };
    return this.nodes.set(o, {
      element: t.element,
      onMouseDown: r,
      onTouchStart: i
    }), t.element.addEventListener("mousedown", r), t.element.addEventListener("touchstart", i), this;
  }
  updateNode(t, o) {
    return this.canvas.updateNode(t, o), this.updateMaxNodePriority(t), this;
  }
  removeNode(t) {
    const o = this.nodes.get(t);
    return o !== void 0 && (o.element.removeEventListener("mousedown", o.onMouseDown), o.element.removeEventListener("touchstart", o.onTouchStart)), this.nodes.delete(t), this.canvas.removeNode(t), this;
  }
  markPort(t) {
    return this.canvas.markPort(t), this;
  }
  updatePort(t, o) {
    return this.canvas.updatePort(t, o), this;
  }
  unmarkPort(t) {
    return this.canvas.unmarkPort(t), this;
  }
  addEdge(t) {
    return this.canvas.addEdge(t), this;
  }
  updateEdge(t, o) {
    return this.canvas.updateEdge(t, o), this;
  }
  removeEdge(t) {
    return this.canvas.removeEdge(t), this;
  }
  patchViewportMatrix(t) {
    return this.canvas.patchViewportMatrix(t), this;
  }
  patchContentMatrix(t) {
    return this.canvas.patchContentMatrix(t), this;
  }
  clear() {
    return this.canvas.clear(), this.nodes.forEach((t) => {
      t.element.removeEventListener("mousedown", t.onMouseDown), t.element.removeEventListener("touchstart", t.onTouchStart);
    }), this.nodes.clear(), this.maxNodePriority = 0, this;
  }
  destroy() {
    this.detach(), this.clear(), this.removeMouseDragListeners(), this.removeTouchDragListeners(), this.canvas.destroy();
  }
  dragNode(t, o, r) {
    const i = this.model.getNode(t);
    if (i === null)
      return;
    const s = this.canvas.transformation.getContentMatrix(), h = s.scale * i.x + s.x, c = s.scale * i.y + s.y, d = h + o, l = c + r, a = this.canvas.transformation.getViewportMatrix(), g = a.scale * d + a.x, y = a.scale * l + a.y;
    this.canvas.updateNode(t, { x: g, y }), this.options.onNodeDrag({
      nodeId: t,
      element: i.element,
      x: g,
      y
    });
  }
  updateMaxNodePriority(t) {
    const o = this.model.getNode(t).priority;
    this.maxNodePriority = Math.max(this.maxNodePriority, o);
  }
  moveNodeOnTop(t) {
    if (this.options.freezePriority)
      return;
    this.maxNodePriority += 2, this.updateNode(t, { priority: this.maxNodePriority });
    const o = this.maxNodePriority - 1;
    this.model.getNodeAdjacentEdgeIds(t).forEach((i) => {
      this.updateEdge(i, { priority: o });
    });
  }
  cancelMouseDrag() {
    const t = this.model.getNode(this.grabbedNodeId);
    t !== null && this.options.onNodeDragFinished({
      nodeId: this.grabbedNodeId,
      element: t.element,
      x: t.x,
      y: t.y
    }), this.grabbedNodeId = null, this.element !== null && b(this.element, null), this.removeMouseDragListeners();
  }
  removeMouseDragListeners() {
    this.window.removeEventListener("mouseup", this.onWindowMouseUp), this.window.removeEventListener("mousemove", this.onWindowMouseMove);
  }
  cancelTouchDrag() {
    this.previousTouchCoords = null;
    const t = this.model.getNode(this.grabbedNodeId);
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
const Ct = (e) => {
  const t = e.minX !== null ? e.minX : -1 / 0, o = e.maxX !== null ? e.maxX : 1 / 0, r = e.minY !== null ? e.minY : -1 / 0, i = e.maxY !== null ? e.maxY : 1 / 0;
  return (s) => {
    let h = s.nextTransform.x, c = s.nextTransform.y;
    h < t && h < s.prevTransform.x && (h = Math.min(s.prevTransform.x, t));
    const d = s.canvasWidth * s.prevTransform.scale, l = o - d;
    h > l && h > s.prevTransform.x && (h = Math.max(s.prevTransform.x, l)), c < r && c < s.prevTransform.y && (c = Math.min(s.prevTransform.y, r));
    const a = s.canvasHeight * s.prevTransform.scale, g = i - a;
    return c > g && c > s.prevTransform.y && (c = Math.max(s.prevTransform.y, g)), { scale: s.nextTransform.scale, x: h, y: c };
  };
}, Nt = (e) => {
  const t = e.maxContentScale, o = e.minContentScale, r = t !== null ? 1 / t : 0, i = o !== null ? 1 / o : 1 / 0;
  return (s) => {
    const h = s.prevTransform, c = s.nextTransform;
    let d = c.scale, l = c.x, a = c.y;
    if (c.scale > i && c.scale > h.scale) {
      d = Math.max(h.scale, i), l = h.x, a = h.y;
      const g = (d - h.scale) / (c.scale - h.scale);
      l = h.x + (c.x - h.x) * g, a = h.y + (c.y - h.y) * g;
    }
    if (c.scale < r && c.scale < h.scale) {
      d = Math.min(h.scale, r), l = h.x, a = h.y;
      const g = (d - h.scale) / (c.scale - h.scale);
      l = h.x + (c.x - h.x) * g, a = h.y + (c.y - h.y) * g;
    }
    return {
      scale: d,
      x: l,
      y: a
    };
  };
}, Pt = (e) => (t) => e.reduce(
  (o, r) => r({
    prevTransform: t.prevTransform,
    nextTransform: o,
    canvasWidth: t.canvasWidth,
    canvasHeight: t.canvasHeight
  }),
  t.nextTransform
), J = (e) => {
  if (typeof e == "function")
    return e;
  switch (e.type) {
    case "scale-limit":
      return Nt({
        minContentScale: e.minContentScale ?? 0,
        maxContentScale: e.maxContentScale ?? 1 / 0
      });
    case "shift-limit":
      return Ct({
        minX: e.minX ?? -1 / 0,
        maxX: e.maxX ?? 1 / 0,
        minY: e.minY ?? -1 / 0,
        maxY: e.maxY ?? 1 / 0
      });
  }
}, Lt = (e) => {
  var f, A, E, T, X, L, D, m, j;
  const t = (f = e == null ? void 0 : e.scale) == null ? void 0 : f.mouseWheelSensitivity, o = t !== void 0 ? t : 1.2, r = e == null ? void 0 : e.transformPreprocessor;
  let i;
  r !== void 0 ? Array.isArray(r) ? i = Pt(
    r.map(
      (P) => J(P)
    )
  ) : i = J(r) : i = (P) => P.nextTransform;
  const s = ((A = e == null ? void 0 : e.shift) == null ? void 0 : A.cursor) !== void 0 ? e.shift.cursor : "grab", h = ((E = e == null ? void 0 : e.events) == null ? void 0 : E.onBeforeTransformChange) ?? (() => {
  }), c = ((T = e == null ? void 0 : e.events) == null ? void 0 : T.onTransformChange) ?? (() => {
  }), d = (X = e == null ? void 0 : e.shift) == null ? void 0 : X.mouseDownEventVerifier, l = d !== void 0 ? d : (P) => P.button === 0, a = (L = e == null ? void 0 : e.shift) == null ? void 0 : L.mouseUpEventVerifier, g = a !== void 0 ? a : (P) => P.button === 0, y = (D = e == null ? void 0 : e.scale) == null ? void 0 : D.mouseWheelEventVerifier, x = y !== void 0 ? y : () => !0;
  return {
    wheelSensitivity: o,
    onTransformStarted: ((m = e == null ? void 0 : e.events) == null ? void 0 : m.onTransformStarted) ?? (() => {
    }),
    onTransformFinished: ((j = e == null ? void 0 : e.events) == null ? void 0 : j.onTransformFinished) ?? (() => {
    }),
    onBeforeTransformChange: h,
    onTransformChange: c,
    transformPreprocessor: i,
    shiftCursor: s,
    mouseDownEventVerifier: l,
    mouseUpEventVerifier: g,
    mouseWheelEventVerifier: x
  };
}, B = (e) => {
  const t = [], o = e.touches.length;
  for (let c = 0; c < o; c++)
    t.push([e.touches[c].clientX, e.touches[c].clientY]);
  const r = t.reduce(
    (c, d) => [c[0] + d[0], c[1] + d[1]],
    [0, 0]
  ), i = [r[0] / o, r[1] / o], h = t.map((c) => [c[0] - i[0], c[1] - i[1]]).reduce(
    (c, d) => c + Math.sqrt(d[0] * d[0] + d[1] * d[1]),
    0
  );
  return {
    x: i[0],
    y: i[1],
    scale: h / o,
    touchesCnt: o,
    touches: t
  };
}, Dt = (e, t, o) => ({
  scale: e.scale,
  x: e.x + e.scale * t,
  y: e.y + e.scale * o
}), mt = (e, t, o, r) => ({
  scale: e.scale * t,
  x: e.scale * (1 - t) * o + e.x,
  y: e.scale * (1 - t) * r + e.y
});
class It {
  constructor(t, o) {
    n(this, "model");
    n(this, "transformation");
    n(this, "element", null);
    n(this, "prevTouches", null);
    n(this, "window", window);
    n(this, "onMouseDown", (t) => {
      this.element === null || !this.options.mouseDownEventVerifier(t) || (b(this.element, this.options.shiftCursor), this.window.addEventListener("mousemove", this.onWindowMouseMove), this.window.addEventListener("mouseup", this.onWindowMouseUp), this.options.onTransformStarted());
    });
    n(this, "onWindowMouseMove", (t) => {
      if (this.element === null || !V(this.element, t.clientX, t.clientY) || !p(this.window, t.clientX, t.clientY)) {
        this.stopMouseDrag();
        return;
      }
      const o = -t.movementX, r = -t.movementY;
      this.moveViewport(this.element, o, r);
    });
    n(this, "onWindowMouseUp", (t) => {
      this.element === null || !this.options.mouseUpEventVerifier(t) || this.stopMouseDrag();
    });
    n(this, "onWheelScroll", (t) => {
      if (!this.options.mouseWheelEventVerifier(t))
        return;
      t.preventDefault(), this.options.onTransformStarted();
      const { left: o, top: r } = this.element.getBoundingClientRect(), i = t.clientX - o, s = t.clientY - r, c = 1 / (t.deltaY < 0 ? this.options.wheelSensitivity : 1 / this.options.wheelSensitivity);
      this.scaleViewport(this.element, c, i, s), this.options.onTransformFinished();
    });
    n(this, "onTouchStart", (t) => {
      this.prevTouches = B(t), this.window.addEventListener("touchmove", this.onWindowTouchMove), this.window.addEventListener("touchend", this.onWindowTouchFinish), this.window.addEventListener("touchcancel", this.onWindowTouchFinish), this.options.onTransformStarted();
    });
    n(this, "onWindowTouchMove", (t) => {
      const o = this.element;
      if (o === null)
        return;
      const r = B(t);
      if (!r.touches.every(
        (s) => V(o, s[0], s[1]) && p(this.window, s[0], s[1])
      )) {
        this.stopTouchDrag();
        return;
      }
      if ((r.touchesCnt === 1 || r.touchesCnt === 2) && this.moveViewport(
        o,
        -(r.x - this.prevTouches.x),
        -(r.y - this.prevTouches.y)
      ), r.touchesCnt === 2) {
        const { left: s, top: h } = o.getBoundingClientRect(), c = this.prevTouches.x - s, d = this.prevTouches.y - h, a = 1 / (r.scale / this.prevTouches.scale);
        this.scaleViewport(o, a, c, d);
      }
      this.prevTouches = r;
    });
    n(this, "onWindowTouchFinish", (t) => {
      t.touches.length > 0 ? this.prevTouches = B(t) : this.stopTouchDrag();
    });
    n(this, "observer", new ResizeObserver(() => {
      const t = this.canvas.transformation.getViewportMatrix(), { width: o, height: r } = this.element.getBoundingClientRect(), i = this.options.transformPreprocessor({
        prevTransform: t,
        nextTransform: t,
        canvasWidth: o,
        canvasHeight: r
      });
      this.canvas.patchViewportMatrix(i), this.options.onTransformChange();
    }));
    n(this, "options");
    this.canvas = t, this.options = Lt(o), this.transformation = this.canvas.transformation, this.model = this.canvas.model;
  }
  attach(t) {
    return this.detach(), this.element = t, this.observer.observe(this.element), this.element.addEventListener("mousedown", this.onMouseDown), this.element.addEventListener("wheel", this.onWheelScroll), this.element.addEventListener("touchstart", this.onTouchStart), this.canvas.attach(this.element), this;
  }
  detach() {
    return this.canvas.detach(), this.element !== null && (this.observer.unobserve(this.element), this.element.removeEventListener("mousedown", this.onMouseDown), this.element.removeEventListener("wheel", this.onWheelScroll), this.element.removeEventListener("touchstart", this.onTouchStart), this.element = null), this;
  }
  addNode(t) {
    return this.canvas.addNode(t), this;
  }
  updateNode(t, o) {
    return this.canvas.updateNode(t, o), this;
  }
  removeNode(t) {
    return this.canvas.removeNode(t), this;
  }
  markPort(t) {
    return this.canvas.markPort(t), this;
  }
  updatePort(t, o) {
    return this.canvas.updatePort(t, o), this;
  }
  unmarkPort(t) {
    return this.canvas.unmarkPort(t), this;
  }
  addEdge(t) {
    return this.canvas.addEdge(t), this;
  }
  updateEdge(t, o) {
    return this.canvas.updateEdge(t, o), this;
  }
  removeEdge(t) {
    return this.canvas.removeEdge(t), this;
  }
  patchViewportMatrix(t) {
    return this.canvas.patchViewportMatrix(t), this;
  }
  patchContentMatrix(t) {
    return this.canvas.patchContentMatrix(t), this;
  }
  clear() {
    return this.canvas.clear(), this;
  }
  destroy() {
    this.detach(), this.removeMouseDragListeners(), this.removeTouchDragListeners(), this.canvas.destroy();
  }
  moveViewport(t, o, r) {
    this.options.onBeforeTransformChange();
    const i = this.transformation.getViewportMatrix(), s = Dt(i, o, r), { width: h, height: c } = t.getBoundingClientRect(), d = this.options.transformPreprocessor({
      prevTransform: i,
      nextTransform: s,
      canvasWidth: h,
      canvasHeight: c
    });
    this.canvas.patchViewportMatrix(d), this.options.onTransformChange();
  }
  scaleViewport(t, o, r, i) {
    this.options.onBeforeTransformChange();
    const s = this.canvas.transformation.getViewportMatrix(), h = mt(s, o, r, i), { width: c, height: d } = t.getBoundingClientRect(), l = this.options.transformPreprocessor({
      prevTransform: s,
      nextTransform: h,
      canvasWidth: c,
      canvasHeight: d
    });
    this.canvas.patchViewportMatrix(l), this.options.onTransformChange();
  }
  stopMouseDrag() {
    this.element !== null && b(this.element, null), this.removeMouseDragListeners(), this.options.onTransformFinished();
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
}
class $t {
  constructor() {
    n(this, "keyMap", /* @__PURE__ */ new Map());
    n(this, "valueMap", /* @__PURE__ */ new Map());
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
class Vt {
  constructor(t) {
    n(this, "transformation");
    n(this, "model");
    n(this, "nodes", new $t());
    n(this, "nodeIdGenerator", new I(
      (t) => this.nodes.hasKey(t)
    ));
    n(this, "nodesResizeObserver");
    this.canvas = t, this.nodesResizeObserver = new window.ResizeObserver((o) => {
      o.forEach((r) => {
        const i = r.target;
        this.reactNodeChange(i);
      });
    }), this.transformation = this.canvas.transformation, this.model = this.canvas.model;
  }
  attach(t) {
    return this.canvas.attach(t), this;
  }
  detach() {
    return this.canvas.detach(), this;
  }
  addNode(t) {
    const o = this.nodeIdGenerator.create(t.id);
    return this.canvas.addNode({
      ...t,
      id: o
    }), this.nodes.set(o, t.element), this.nodesResizeObserver.observe(t.element), this;
  }
  updateNode(t, o) {
    return this.canvas.updateNode(t, o), this;
  }
  removeNode(t) {
    this.canvas.removeNode(t);
    const o = this.nodes.getByKey(t);
    return this.nodes.deleteByKey(t), this.nodesResizeObserver.unobserve(o), this;
  }
  markPort(t) {
    return this.canvas.markPort(t), this;
  }
  updatePort(t, o) {
    return this.canvas.updatePort(t, o), this;
  }
  unmarkPort(t) {
    return this.canvas.unmarkPort(t), this;
  }
  addEdge(t) {
    return this.canvas.addEdge(t), this;
  }
  updateEdge(t, o) {
    return this.canvas.updateEdge(t, o), this;
  }
  removeEdge(t) {
    return this.canvas.removeEdge(t), this;
  }
  patchViewportMatrix(t) {
    return this.canvas.patchViewportMatrix(t), this;
  }
  patchContentMatrix(t) {
    return this.canvas.patchContentMatrix(t), this;
  }
  clear() {
    return this.canvas.clear(), this.nodesResizeObserver.disconnect(), this.nodes.clear(), this;
  }
  destroy() {
    this.clear(), this.canvas.destroy();
  }
  reactNodeChange(t) {
    const o = this.nodes.getByValue(t);
    this.canvas.updateNode(o), this.model.getNodeAdjacentEdgeIds(o).forEach((i) => {
      this.canvas.updateEdge(i);
    });
  }
}
class bt {
  constructor() {
    n(this, "coreOptions");
    n(this, "dragOptions");
    n(this, "transformOptions");
    n(this, "isDraggable", !1);
    n(this, "isTransformable", !1);
    n(this, "hasResizeReactiveNodes", !1);
  }
  setOptions(t) {
    return this.coreOptions = t, this;
  }
  setUserDraggableNodes(t) {
    return this.isDraggable = !0, this.dragOptions = t, this;
  }
  setUserTransformableCanvas(t) {
    return this.isTransformable = !0, this.transformOptions = t, this;
  }
  setResizeReactiveNodes() {
    return this.hasResizeReactiveNodes = !0, this;
  }
  build() {
    let t = new At(this.coreOptions);
    return this.hasResizeReactiveNodes && (t = new Vt(t)), this.isDraggable && (t = new Mt(t, this.dragOptions)), this.isTransformable && (t = new It(t, this.transformOptions)), t;
  }
}
export {
  nt as BezierEdgeShape,
  At as CanvasCore,
  st as HorizontalEdgeShape,
  bt as HtmlGraphBuilder,
  S as HtmlGraphError,
  Vt as ResizeReactiveNodesCanvas,
  ht as StraightEdgeShape,
  Mt as UserDraggableNodesCanvas,
  It as UserTransformableCanvas,
  ct as VerticalEdgeShape
};
