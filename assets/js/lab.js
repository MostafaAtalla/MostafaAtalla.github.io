/* Friction lab: a block pulled through a spring over a surface.
   Static friction > kinetic friction gives stick-slip. Switching on the
   ultrasonic squeeze film lowers the effective friction coefficient and
   narrows the static-kinetic gap, so motion becomes a smooth glide.
   Illustrative model, not fitted to experimental data. */
(function () {
  const canvas = document.getElementById("lab-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const $ = (id) => document.getElementById(id);
  const VW = 880, VH = 440, SCENE = 250, PX = 2200; // px per metre
  const m = 0.08, k = 6, Nload = 1, g_visc = 0.02, vPull = 0.03;
  let muS = 0.6, muK = 0.38, amp = 0.7, ultrasonic = false, pulling = true;
  let xb = 0, vb = 0, xh = 0.02, stuck = true, t = 0, slips = 0;
  let trace = [], dragging = false, colors = {};
  const TRACE_T = 10;

  function readColors() {
    const cs = getComputedStyle(document.body);
    const v = (n) => cs.getPropertyValue(n).trim();
    colors = { ink: v("--ink"), ink2: v("--ink-2"), ink3: v("--ink-3"), rule: v("--rule"), brass: v("--m"), tide: v("--tide"), card: v("--card"), paper2: v("--paper-2") };
  }
  function eff() {
    const a = ultrasonic ? amp : 0;
    const mk = muK * (1 - 0.72 * a);
    const ms = mk + (muS - muK) * (1 - a) * (1 - 0.72 * a);
    return { ms, mk };
  }
  function physics(dt) {
    if (pulling && !dragging) xh += vPull * dt;
    const { ms, mk } = eff();
    const Fs = k * (xh - xb);
    if (stuck) {
      if (Math.abs(Fs) > ms * Nload) { stuck = false; slips++; }
      else { vb = 0; return Fs; }
    }
    const fr = -Math.sign(vb || Fs) * mk * Nload;
    const a = (Fs + fr) / m - g_visc * vb / m;
    const v0 = vb; vb += a * dt; xb += vb * dt;
    if (v0 !== 0 && Math.sign(vb) !== Math.sign(v0) && Math.abs(k * (xh - xb)) <= ms * Nload) { vb = 0; stuck = true; }
    return Fs;
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = VW * dpr; canvas.height = VH * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw() {
    const { ms, mk } = eff();
    ctx.clearRect(0, 0, VW, VH);
    const cam = xb * PX - VW * 0.42;
    const floorY = 178;

    // squeeze film shimmer
    if (ultrasonic) {
      ctx.fillStyle = colors.tide; ctx.globalAlpha = 0.14 + 0.08 * Math.sin(t * 60);
      ctx.fillRect(0, floorY - 6, VW, 6); ctx.globalAlpha = 1;
    }
    // floor
    ctx.strokeStyle = colors.ink2; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, floorY); ctx.lineTo(VW, floorY); ctx.stroke();
    ctx.strokeStyle = colors.rule; ctx.lineWidth = 1;
    const step = 22, off = -((cam % step) + step) % step;
    for (let x = off; x < VW + step; x += step) { ctx.beginPath(); ctx.moveTo(x, floorY + 2); ctx.lineTo(x - 12, floorY + 18); ctx.stroke(); }
    // distance ticks every 1 cm
    ctx.fillStyle = colors.ink3; ctx.font = "11px JetBrains Mono, monospace"; ctx.textAlign = "center";
    const cm = PX / 100, first = Math.floor(cam / cm);
    for (let i = first; i < first + VW / cm + 2; i++) {
      const x = i * cm - cam;
      ctx.fillRect(x, floorY + 24, 1, i % 5 === 0 ? 8 : 4);
      if (i % 5 === 0) ctx.fillText(i + " cm", x, floorY + 46);
    }

    // block (instrument segment)
    const bx = xb * PX - cam, bw = 120, bh = 58, by = floorY - bh - (ultrasonic ? 2 : 0);
    const jitter = ultrasonic ? Math.sin(t * 900) * 0.8 : 0;
    ctx.fillStyle = stuck ? colors.ink : colors.brass;
    roundRect(bx - bw, by + jitter, bw, bh, 6); ctx.fill();
    ctx.fillStyle = colors.card; ctx.font = "600 12px JetBrains Mono, monospace"; ctx.textAlign = "center";
    ctx.fillText(stuck ? "STICK" : "SLIP", bx - bw / 2, by + bh / 2 + 4 + jitter);

    // spring
    const hx = xh * PX - cam, sy = by + bh / 2;
    const coils = 12, len = hx - bx;
    ctx.strokeStyle = colors.ink2; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(bx, sy);
    const lead = 12;
    ctx.lineTo(bx + lead, sy);
    for (let i = 0; i <= coils; i++) { const x = bx + lead + ((len - 2 * lead) * i) / coils; ctx.lineTo(x, sy + (i % 2 ? -10 : 10) * (i === 0 || i === coils ? 0 : 1)); }
    ctx.lineTo(hx, sy); ctx.stroke();
    // hand
    ctx.beginPath(); ctx.arc(hx, sy, 13, 0, Math.PI * 2);
    ctx.fillStyle = dragging ? colors.brass : colors.card; ctx.fill();
    ctx.strokeStyle = colors.brass; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = colors.ink3; ctx.font = "11px JetBrains Mono, monospace";
    ctx.fillText("drag", hx, sy - 22);

    // trace panel
    const px0 = 56, px1 = VW - 20, py0 = 272, py1 = 420;
    ctx.strokeStyle = colors.rule; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, SCENE); ctx.lineTo(VW, SCENE); ctx.stroke();
    const Fmax = 0.8;
    const fy = (F) => py1 - (Math.max(-0.1, Math.min(F, Fmax)) / Fmax) * (py1 - py0);
    ctx.fillStyle = colors.ink3; ctx.textAlign = "right"; ctx.font = "11px JetBrains Mono, monospace";
    [0, 0.2, 0.4, 0.6, 0.8].forEach((F) => { ctx.fillText(F.toFixed(1), px0 - 8, fy(F) + 4); ctx.strokeStyle = colors.rule; ctx.globalAlpha = 0.6; ctx.beginPath(); ctx.moveTo(px0, fy(F)); ctx.lineTo(px1, fy(F)); ctx.stroke(); ctx.globalAlpha = 1; });
    ctx.save(); ctx.translate(14, (py0 + py1) / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = "center"; ctx.fillText("spring force (N)", 0, 0); ctx.restore();
    // thresholds
    ctx.setLineDash([5, 5]); ctx.strokeStyle = colors.ink2; ctx.beginPath(); ctx.moveTo(px0, fy(ms * Nload)); ctx.lineTo(px1, fy(ms * Nload)); ctx.stroke();
    ctx.strokeStyle = colors.tide; ctx.beginPath(); ctx.moveTo(px0, fy(mk * Nload)); ctx.lineTo(px1, fy(mk * Nload)); ctx.stroke(); ctx.setLineDash([]);
    ctx.textAlign = "left"; ctx.fillStyle = colors.ink2; ctx.fillText("μs·N", px1 - 40, fy(ms * Nload) - 6);
    ctx.fillStyle = colors.tide; ctx.fillText("μk·N", px1 - 40, fy(mk * Nload) + 14);
    // signal
    ctx.beginPath(); ctx.strokeStyle = colors.brass; ctx.lineWidth = 1.8;
    trace.forEach((p, i) => { const x = px1 - ((t - p.t) / TRACE_T) * (px1 - px0); const y = fy(p.F); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
    ctx.stroke();
    ctx.fillStyle = colors.ink3; ctx.textAlign = "right"; ctx.fillText("last 10 s →", px1, py1 + 16);
  }
  function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

  let lastT = performance.now();
  function loop(now) {
    const dt = Math.min((now - lastT) / 1000, 0.05); lastT = now;
    const sub = 24; let F = 0;
    for (let i = 0; i < sub; i++) { F = physics(dt / sub); t += dt / sub; }
    trace.push({ t, F }); while (trace.length && t - trace[0].t > TRACE_T) trace.shift();
    draw(); readout(F);
    requestAnimationFrame(loop);
  }
  function readout(F) {
    const { ms, mk } = eff();
    $("ro-force").textContent = F.toFixed(2) + " N";
    $("ro-state").textContent = stuck ? "Sticking" : "Sliding";
    $("ro-mu").textContent = mk.toFixed(2) + " / " + ms.toFixed(2);
    $("ro-dist").textContent = (xb * 100).toFixed(1) + " cm";
  }

  // pointer drag of the hand
  const toWorld = (e) => { const r = canvas.getBoundingClientRect(); const sx = ((e.clientX - r.left) / r.width) * VW; return (sx + xb * PX - VW * 0.42) / PX; };
  canvas.addEventListener("pointerdown", (e) => { dragging = true; canvas.classList.add("dragging"); canvas.setPointerCapture(e.pointerId); xh = Math.max(xb - 0.02, toWorld(e)); });
  canvas.addEventListener("pointermove", (e) => { if (dragging) xh = Math.max(xb - 0.02, toWorld(e)); });
  const end = () => { dragging = false; canvas.classList.remove("dragging"); };
  canvas.addEventListener("pointerup", end); canvas.addEventListener("pointercancel", end);

  const us = $("us-switch");
  us.addEventListener("click", () => { ultrasonic = !ultrasonic; us.setAttribute("aria-checked", ultrasonic); $("us-label").textContent = ultrasonic ? "Ultrasonic lubrication on" : "Ultrasonic lubrication off"; });
  const pull = $("pull-btn");
  pull.addEventListener("click", () => { pulling = !pulling; pull.textContent = pulling ? "Pause pull" : "Resume pull"; });
  $("reset-btn").addEventListener("click", () => { xb = 0; vb = 0; xh = 0.02; stuck = true; trace = []; t = 0; slips = 0; });
  const ampIn = $("amp"), muIn = $("mus");
  ampIn.addEventListener("input", () => { amp = ampIn.value / 100; $("amp-out").textContent = ampIn.value + "%"; });
  muIn.addEventListener("input", () => { muS = muIn.value / 100; muK = Math.min(0.38, muS); $("mus-out").textContent = muS.toFixed(2); });

  readColors(); resize();
  document.addEventListener("themechange", readColors);
  requestAnimationFrame(loop);
})();
