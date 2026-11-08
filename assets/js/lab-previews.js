/* Lab previews: four small, live versions of the Lab games.
   Each <canvas class="lp-canvas" data-game="glide|catheter|oscar|ski"> gets its own loop.
   A toggle button next to it (data-for = same game) switches the key variable, and the
   preview also toggles by itself every few seconds so the contrast is always visible.
   Illustrative animations, not the full game models. */
(function () {
  const canvases = [...document.querySelectorAll(".lp-canvas")];
  if (!canvases.length) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const W = 400, H = 240;
  let C = {};
  const readColors = () => {
    const cs = getComputedStyle(document.documentElement), v = (n) => cs.getPropertyValue(n).trim();
    C = { ink: v("--ink"), ink2: v("--ink-2"), ink3: v("--ink-3"), card: v("--card"), paper: v("--paper"), coral: v("--acc-coral"), teal: v("--acc-teal") || "#2BB3A9", gold: v("--acc-gold") || "#F2B227", blue: v("--acc-blue") || "#3A6FB0",
      dark: document.documentElement.dataset.theme === "dark" || (!document.documentElement.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches) };
  };
  readColors(); document.addEventListener("themechange", readColors);
  matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", readColors);

  const rr = (ctx, x, y, w, h, r) => { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); };
  const pill = (ctx, x, y, txt, bg, fg) => { ctx.font = "600 11px Roboto, sans-serif"; const w = ctx.measureText(txt).width + 16; rr(ctx, x, y, w, 20, 10); ctx.fillStyle = bg; ctx.fill(); ctx.fillStyle = fg; ctx.textBaseline = "middle"; ctx.fillText(txt, x + 8, y + 10.5); ctx.textBaseline = "alphabetic"; };
  const waves = (ctx, x, y, w, t, col) => { ctx.strokeStyle = col; ctx.lineWidth = 1.6; for (let k = 0; k < 3; k++) { const a = ((t * 2.2 + k / 3) % 1); ctx.globalAlpha = 1 - a; ctx.beginPath(); ctx.ellipse(x, y, w * (0.35 + a * 0.5), 3 + a * 7, 0, 0, Math.PI); ctx.stroke(); } ctx.globalAlpha = 1; };
  const spark = (ctx, arr, x, y, w, h, col, lo, hi) => { ctx.strokeStyle = col; ctx.lineWidth = 1.6; ctx.beginPath(); arr.forEach((v, i) => { const px = x + (i / (arr.length - 1)) * w, py = y + h - ((v - lo) / (hi - lo)) * h; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); ctx.stroke(); };

  /* ---------- 1. Glide: a cup on a sled, stick-slip vs glide ---------- */
  function glide() {
    const s = { on: false, xb: 60, vb: 0, xh: 110, stuck: true, spill: 0, water: 1, drops: [], F: [], acc: 0 };
    const m = 0.08, k = 6, PX = 1600;
    return {
      label: () => (s.on ? "Ultrasound on · glide" : "Ultrasound off · stick-slip"),
      toggle() { s.on = !s.on; },
      get on() { return s.on; },
      step(dt) {
        const muK = s.on ? 0.14 : 0.38, muS = s.on ? 0.15 : 0.62;
        for (let i = 0; i < 12; i++) {
          const h = dt / 12; s.xh += 0.03 * PX * h;
          const Fs = k * (s.xh - s.xb) / PX; let a = 0;
          if (s.stuck) { if (Math.abs(Fs) > muS) s.stuck = false; else { s.vb = 0; } }
          if (!s.stuck) { a = (Fs - Math.sign(s.vb || Fs) * muK) / m - 0.3 * s.vb; const v0 = s.vb; s.vb += a * h; if (v0 > 0 && s.vb <= 0) { s.vb = 0; s.stuck = true; } s.xb += s.vb * PX * h; }
          s.acc = s.acc * 0.9 + Math.abs(a) * 0.1;
        }
        if (s.acc > 2.2 && s.water > 0.05 && Math.random() < 0.5) { s.water -= 0.006; s.drops.push({ x: s.xb + 18, y: 120, vx: 40 + Math.random() * 40, vy: -40 - Math.random() * 30 }); }
        s.drops.forEach((d) => { d.vy += 300 * dt; d.x += d.vx * dt; d.y += d.vy * dt; }); s.drops = s.drops.filter((d) => d.y < 186);
        s.F.push(k * (s.xh - s.xb) / PX); if (s.F.length > 90) s.F.shift();
        if (s.xb > W - 70) { s.xb = 20; s.xh = 70; s.water = 1; s.drops = []; }
      },
      draw(ctx, t) {
        const fy = 186;
        // floor with rough asperities
        ctx.fillStyle = C.dark ? "#1B2B44" : "#E4E9F0"; ctx.fillRect(0, fy, W, H - fy);
        ctx.strokeStyle = C.ink3; ctx.lineWidth = 1.2; ctx.beginPath();
        for (let x = 0; x <= W; x += 8) ctx.lineTo(x, fy + ((x / 8) % 2 ? 3 : 0)); ctx.stroke();
        // spring + hand
        const bx = s.xb, by = fy - 34;
        ctx.strokeStyle = C.ink2; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(bx + 54, by + 16);
        const L = s.xh - (bx + 54); for (let i = 0; i <= 10; i++) ctx.lineTo(bx + 54 + (L * i) / 10, by + 16 + (i % 2 ? -6 : 6) * (i && i < 10 ? 1 : 0)); ctx.stroke();
        ctx.fillStyle = C.coral; ctx.beginPath(); ctx.arc(s.xh, by + 16, 8, 0, 7); ctx.fill();
        // sled
        const g = ctx.createLinearGradient(0, by, 0, by + 34); g.addColorStop(0, C.dark ? "#3A5274" : "#4D6A93"); g.addColorStop(1, C.dark ? "#22344F" : "#2F4766");
        rr(ctx, bx, by, 54, 32, 7); ctx.fillStyle = g; ctx.fill();
        if (s.on) waves(ctx, bx + 27, fy + 2, 30, t, C.teal);
        // cup with water
        const cx = bx + 14, cy = by - 34; ctx.fillStyle = C.dark ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.75)"; ctx.strokeStyle = C.ink2; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + 26, cy); ctx.lineTo(cx + 23, cy + 34); ctx.lineTo(cx + 3, cy + 34); ctx.closePath(); ctx.fill(); ctx.stroke();
        const wl = cy + 34 - 30 * s.water, tilt = Math.max(-6, Math.min(6, -s.acc * 1.4 * Math.sign(s.vb || 1)));
        ctx.save(); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + 26, cy); ctx.lineTo(cx + 23, cy + 34); ctx.lineTo(cx + 3, cy + 34); ctx.closePath(); ctx.clip();
        ctx.fillStyle = "#4FA3E0"; ctx.beginPath(); ctx.moveTo(cx - 2, wl - tilt); ctx.lineTo(cx + 28, wl + tilt); ctx.lineTo(cx + 28, cy + 40); ctx.lineTo(cx - 2, cy + 40); ctx.fill(); ctx.restore();
        ctx.fillStyle = "#4FA3E0"; s.drops.forEach((d) => { ctx.beginPath(); ctx.arc(d.x, d.y, 2.2, 0, 7); ctx.fill(); });
        // force sparkline
        spark(ctx, s.F, 230, 18, 150, 40, C.coral, 0, 0.8);
        ctx.fillStyle = C.ink3; ctx.font = "10px Roboto Mono, monospace"; ctx.fillText("pull force", 230, 70);
        ctx.fillText(`cup ${Math.round(s.water * 100)}% full`, 12, 230 - 2);
      }
    };
  }

  /* ---------- 2. Catheter: navigate, then deploy while the heart beats ---------- */
  function catheter() {
    const s = { on: false, p: 0, phase: "nav", tDeploy: 0, buckle: 0, dmg: [] };
    // centreline: an S-bend from the left to a lesion on the right
    const path = []; for (let i = 0; i <= 120; i++) { const u = i / 120; path.push([20 + u * 360, 120 + 52 * Math.sin(u * Math.PI * 1.6 - 0.3) * (0.4 + u * 0.6)]); }
    // a pushed catheter presses on the outer side of each bend: offset toward the outside wall
    const hug = (i) => { const j = Math.max(1, Math.min(119, i)), curv = path[j + 1][1] - 2 * path[j][1] + path[j - 1][1]; return -13 * Math.tanh(curv * 4); };
    const at = (u) => { const i = Math.max(0, Math.min(120, Math.round(u * 120))); return [path[i][0], path[i][1] + hug(i)]; };
    const LES = 0.86;
    return {
      label: () => (s.on ? "Ultrasound on · glides, but slips at the target" : "Ultrasound off · drags and buckles, but holds still"),
      toggle() { s.on = !s.on; s.p = 0; s.phase = "nav"; s.dmg = []; },
      get on() { return s.on; },
      step(dt, t) {
        if (s.phase === "nav") {
          const bend = Math.abs(Math.cos(s.p * Math.PI * 1.6 - 0.3));
          const v = s.on ? 0.16 : 0.16 * (0.35 + 0.65 * bend);
          s.p += v * dt; s.buckle = s.on ? s.buckle * 0.9 : Math.min(1, s.buckle * 0.95 + (1 - bend) * 0.08);
          if (!s.on && Math.random() < (1 - bend) * 0.08) s.dmg.push({ u: s.p * 0.9 + Math.random() * 0.06, a: 1 });
          if (s.p >= LES) { s.phase = "deploy"; s.tDeploy = 0; }
        } else { s.tDeploy += dt; if (s.tDeploy > 3.4) { s.p = 0; s.phase = "nav"; s.dmg = []; } }
        s.dmg.forEach((d) => (d.a *= 0.995));
      },
      draw(ctx, t) {
        const beat = Math.pow(Math.max(0, Math.sin(t * 2 * Math.PI * 1.1)), 6);
        // vessel
        ctx.lineCap = "round"; ctx.lineJoin = "round";
        const trace = () => { ctx.beginPath(); path.forEach(([x, y], i) => { const yy = y + beat * 4 * Math.sin(i / 9); i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); }); };
        ctx.strokeStyle = C.dark ? "#7A2E3A" : "#E8A3A3"; ctx.lineWidth = 46 + beat * 3; trace(); ctx.stroke();
        ctx.strokeStyle = C.dark ? "#2A1620" : "#FBE3E1"; ctx.lineWidth = 36 + beat * 3; trace(); ctx.stroke();
        // wall damage marks
        s.dmg.forEach((d) => { const [x, y] = at(d.u); ctx.fillStyle = `rgba(220,40,40,${0.5 * d.a})`; ctx.beginPath(); ctx.arc(x, y - 18, 6, 0, 7); ctx.fill(); });
        // lesion
        const [lx, ly] = at(LES); ctx.fillStyle = "rgba(242,178,39,.55)"; ctx.beginPath(); ctx.ellipse(lx, ly + beat * 3, 16, 17, 0, 0, 7); ctx.fill();
        // catheter
        ctx.strokeStyle = C.dark ? "#CFE0F5" : "#1E3A5F"; ctx.lineWidth = 4; ctx.beginPath();
        const n = Math.round(s.p * 120);
        for (let i = 0; i <= n; i++) { const [x, y] = path[i]; const bl = !s.on ? s.buckle * 7 * Math.sin(i / 3) * Math.exp(-Math.pow((i - n * 0.35) / 14, 2)) : 0; const yy = y + hug(i) + bl; i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); }
        ctx.stroke();
        let [tx, ty] = at(s.p);
        if (s.phase === "deploy") {
          const slip = s.on ? 9 * Math.sin(t * 2 * Math.PI * 1.1) : 1.2 * beat;
          tx += slip; const open = Math.min(1, s.tDeploy / 1.2);
          ctx.strokeStyle = C.dark ? "#E9EEF5" : "#55657A"; ctx.lineWidth = 1.3;
          for (let k = -3; k <= 3; k++) { ctx.beginPath(); ctx.moveTo(tx + k * 5, ty - 4 - 10 * open); ctx.lineTo(tx + k * 5 + 2.5, ty); ctx.lineTo(tx + k * 5, ty + 4 + 10 * open); ctx.stroke(); }
          const err = Math.abs(slip); pill(ctx, 12, 12, err > 4 ? "Stent off target" : "Stent on target", err > 4 ? C.coral : C.teal, "#fff");
        }
        if (s.on && s.phase === "nav") { ctx.save(); ctx.translate(tx, ty); waves(ctx, 0, 6, 10, t, C.teal); ctx.restore(); }
        ctx.fillStyle = C.coral; ctx.beginPath(); ctx.arc(tx, ty, 4, 0, 7); ctx.fill();
        // heart icon
        ctx.font = `${16 + beat * 6}px serif`; ctx.fillText("♥", W - 34, 30);
      }
    };
  }

  /* ---------- 3. OSCAR: cam-timed sliders, thrust and ripple ----------
     Twelve sliders on 2π/n phases follow the cam lift h(θ): a slow retraction over d_ret of the
     cycle (slider moves rearward, grips the wall, pulls the capsule forward), then a fast advance.
     Mean thrust ∝ d_ret − d_adv (OSCAR, Eq. 18); measured Δd 0.82 / 0.64 / 0.48 for 1 / 2 / 3 jumps.
     Ripple = slider switching + rocking of unbalanced advancing sliders (cancelled in balanced groups). */
  function oscar() {
    const CAMS = [{ j: 1, dd: 0.82 }, { j: 2, dd: 0.64 }, { j: 3, dd: 0.48 }];
    const n = 12, s = { cam: 0, x: 120, th: 0, F: [], ROCK: [] };
    const dret = () => (1 + CAMS[s.cam].dd) / 2;
    const lift = (u, dr) => (u < dr ? u / dr : 1 - (u - dr) / (1 - dr)); // 0 = forward, 1 = fully retracted
    const force = (u, dr) => { const w = 0.025; return u < dr ? Math.min(1, u / w, (dr - u) / w) : -Math.min(1, (u - dr) / w, (1 - u) / w); };
    const state = () => { const c = CAMS[s.cam], dr = dret(); let F = 0, rx = 0, ry = 0;
      const sl = []; for (let i = 0; i < n; i++) { const u = (((s.th + i / n) * c.j) % 1 + 1) % 1, f = force(u, dr); F += f; if (f < 0) { const a = TAU * i / n; rx -= f * Math.cos(a); ry -= f * Math.sin(a); } sl.push({ u, adv: u >= dr, a: TAU * i / n }); }
      const rock = Math.hypot(rx, ry); return { F: F / n, rock, sl }; };
    const TAU = Math.PI * 2;
    return {
      label: () => `${CAMS[s.cam].j}-jump cam · Δd ${CAMS[s.cam].dd.toFixed(2)} · ${CAMS[s.cam].j === 1 ? "unbalanced, rocks" : "balanced groups"}`,
      toggle() { s.cam = (s.cam + 1) % 3; s.F = []; },
      get on() { return s.cam > 0; },
      step(dt) { s.th += dt * 0.32; const st = state(); s.last = st;
        const ripple = 0.22 * st.rock * Math.sin(s.th * TAU * 6) * Math.exp(-((s.th * 40) % 1) * 2);
        s.F.push(st.F + ripple); if (s.F.length > 110) s.F.shift(); s.x += CAMS[s.cam].dd * 30 * dt; if (s.x > W + 90) s.x = -90; },
      draw(ctx, t) {
        const st = s.last || state(), cy = 100, cx = s.x, L = 200, Rr = 42, rockY = (CAMS[s.cam].j === 1 ? 1.6 * st.rock * Math.sin(t * 30) : 0);
        // colon: pink lumen with haustral folds, wall stretched around the rigid capsule
        ctx.fillStyle = C.dark ? "#3A2230" : "#F6D7D2"; ctx.fillRect(0, 0, W, 186);
        const wallY = (x, sg) => { const fold = 9 * Math.max(0, Math.sin(x / 26)) ** 4, bulge = 22 * Math.exp(-Math.pow((x - cx) / 95, 4)); return cy + sg * (Rr - 14 - fold + bulge); };
        ctx.fillStyle = C.dark ? "#1E1420" : "#FFF3F0"; ctx.beginPath(); for (let x = 0; x <= W; x += 4) ctx.lineTo(x, wallY(x, -1)); for (let x = W; x >= 0; x -= 4) ctx.lineTo(x, wallY(x, 1)); ctx.fill();
        ctx.strokeStyle = C.dark ? "#B05A6E" : "#D98C8C"; ctx.lineWidth = 2; [-1, 1].forEach((sg) => { ctx.beginPath(); for (let x = 0; x <= W; x += 4) ctx.lineTo(x, wallY(x, sg)); ctx.stroke(); });
        ctx.save(); ctx.translate(0, rockY);
        // capsule body: blunt rear, tapered nose (pointing right = direction of travel)
        const x0 = cx - L / 2, x1 = cx + L / 2;
        const body = () => { ctx.beginPath(); ctx.moveTo(x0 + 10, cy - Rr); ctx.lineTo(x1 - 40, cy - Rr); ctx.quadraticCurveTo(x1, cy - Rr * 0.7, x1 + 6, cy); ctx.quadraticCurveTo(x1, cy + Rr * 0.7, x1 - 40, cy + Rr); ctx.lineTo(x0 + 10, cy + Rr); ctx.quadraticCurveTo(x0, cy + Rr, x0, cy + Rr - 10); ctx.lineTo(x0, cy - Rr + 10); ctx.quadraticCurveTo(x0, cy - Rr, x0 + 10, cy - Rr); ctx.closePath(); };
        const g = ctx.createLinearGradient(0, cy - Rr, 0, cy + Rr); g.addColorStop(0, "#EEF2F5"); g.addColorStop(0.5, "#B9C4CF"); g.addColorStop(1, "#7D8A99");
        body(); ctx.fillStyle = g; ctx.fill();
        // sliders: the visible half of the ring, each a ridged strip whose axial offset follows the cam
        const vis = st.sl.filter((q) => Math.sin(q.a) > -0.05).sort((p, q) => Math.sin(p.a) - Math.sin(q.a));
        ctx.save(); body(); ctx.clip();
        vis.forEach((q) => { const yy = cy - Math.cos(q.a) * (Rr - 3), h = 4 + 5 * Math.sin(q.a), off = -lift(q.u, dret()) * 30; // retracted = shifted rearward
          const sx = x0 + 4 + off, sw = L - 30;
          ctx.fillStyle = q.adv ? C.coral : C.teal; ctx.globalAlpha = 0.55 + 0.45 * Math.sin(q.a);
          ctx.fillRect(sx, yy - h / 2, sw, h);
          ctx.fillStyle = "rgba(0,0,0,.25)"; for (let k = sx + 4; k < sx + sw; k += 7) ctx.fillRect(k, yy - h / 2, 2, h); // sawtooth ridges
          ctx.globalAlpha = 1; });
        ctx.restore();
        body(); ctx.strokeStyle = "rgba(40,55,75,.55)"; ctx.lineWidth = 1.2; ctx.stroke();
        [0, n / 2].forEach((i) => { const q = st.sl[i], sg = i ? 1 : -1, off = -lift(q.u, dret()) * 30, sx = x0 + 4 + off, sw = L - 46;
          ctx.fillStyle = q.adv ? C.coral : C.teal; ctx.beginPath(); const yb = cy + sg * (Rr - 2);
          ctx.moveTo(sx, yb); for (let k = sx; k < sx + sw; k += 10) { ctx.lineTo(k + 7, yb + sg * 7); ctx.lineTo(k + 10, yb); } ctx.lineTo(sx, yb); ctx.fill(); });
        // tether
        ctx.strokeStyle = C.ink3; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x0, cy); ctx.bezierCurveTo(x0 - 40, cy + 8, x0 - 80, cy - 6, -10, cy + 4); ctx.stroke();
        ctx.restore();
        // unfolded cam profile inset with the slider phases on it
        const ix = W - 128, iy = 10, iw = 116, ih = 44, dr = dret();
        ctx.fillStyle = C.dark ? "rgba(10,20,36,.75)" : "rgba(255,255,255,.85)"; rr(ctx, ix - 6, iy - 4, iw + 12, ih + 18, 8); ctx.fill();
        ctx.strokeStyle = C.ink2; ctx.lineWidth = 1.5; ctx.beginPath();
        for (let k = 0; k <= 120; k++) { const u = (k / 120 * CAMS[s.cam].j) % 1, x = ix + (k / 120) * iw, y = iy + ih - lift(u, dr) * ih; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
        st.sl.forEach((q, i) => { const k = ((s.th + i / n) % 1 + 1) % 1, x = ix + k * iw, y = iy + ih - lift(q.u, dr) * ih; ctx.fillStyle = q.adv ? C.coral : C.teal; ctx.beginPath(); ctx.arc(x, y, 2.6, 0, TAU); ctx.fill(); });
        ctx.fillStyle = C.ink3; ctx.font = "9px Roboto Mono, monospace"; ctx.fillText("cam profile", ix, iy + ih + 11);
        // thrust trace
        ctx.fillStyle = C.dark ? "rgba(10,20,36,.6)" : "rgba(255,255,255,.75)"; rr(ctx, 10, 192, W - 20, 42, 8); ctx.fill();
        const mean = CAMS[s.cam].dd, yOf = (v) => 196 + 34 * (1 - (v + 0.4) / 1.6);
        ctx.setLineDash([3, 3]); ctx.strokeStyle = C.ink3; ctx.beginPath(); ctx.moveTo(18, yOf(mean)); ctx.lineTo(W - 18, yOf(mean)); ctx.stroke(); ctx.setLineDash([]);
        spark(ctx, s.F, 18, 196, W - 36, 34, C.coral, -0.4, 1.2);
        ctx.fillStyle = C.ink3; ctx.font = "10px Roboto Mono, monospace"; ctx.fillText("thrust (– – mean)", W - 120, 230);
      }
    };
  }

  /* ---------- 4. Ski: grip-glide strides on sand ---------- */
  function ski() {
    const s = { on: true, ph: 0, a: 0, b: 30, scroll: 0 };
    return {
      label: () => (s.on ? "Good timing · moving ski glides, other grips" : "Bad timing · both skis glide, nothing to push from"),
      toggle() { s.on = !s.on; },
      get on() { return s.on; },
      step(dt) {
        s.ph += dt * 0.9; const u = s.ph % 1, leg = u < 0.5 ? "a" : "b", other = leg === "a" ? "b" : "a";
        const sp = 60 * dt * 2; // stride speed
        if (s.on) { s[leg] += sp; } else { s[leg] += sp * 0.5; s[other] -= sp * 0.5; }
        if (s[leg] - s[other] > 30) s[leg] = s[other] + 30;
        const mid = (s.a + s.b) / 2; s.scroll = mid;
      },
      draw(ctx, t) {
        const u = s.ph % 1, leg = u < 0.5 ? "a" : "b", gy = 176, mid = (s.a + s.b) / 2, cx = 170;
        // sky and dunes (parallax)
        const sky = ctx.createLinearGradient(0, 0, 0, gy); sky.addColorStop(0, C.dark ? "#13223A" : "#CFE6F7"); sky.addColorStop(1, C.dark ? "#2A3550" : "#FBEFD9"); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, gy);
        ctx.fillStyle = C.dark ? "#4A4060" : "#F3D9A8"; ctx.beginPath(); ctx.moveTo(0, gy); for (let x = 0; x <= W; x += 10) ctx.lineTo(x, gy - 30 - 18 * Math.sin((x + s.scroll * 0.3) / 60)); ctx.lineTo(W, gy); ctx.fill();
        ctx.fillStyle = C.dark ? "#6B5A44" : "#E9C27F"; ctx.fillRect(0, gy, W, H - gy);
        ctx.fillStyle = C.dark ? "#82705A" : "#D7AE68"; for (let x = -((s.scroll * 1) % 24); x < W; x += 24) { ctx.beginPath(); ctx.arc(x, gy + 14, 2, 0, 7); ctx.fill(); }
        // skis
        const skiAt = (x, glow) => { const sx = cx + (x - mid); rr(ctx, sx - 34, gy - 6, 74, 6, 3); ctx.fillStyle = C.coral; ctx.fill(); ctx.fillStyle = C.ink; ctx.beginPath(); ctx.moveTo(sx + 40, gy - 6); ctx.quadraticCurveTo(sx + 50, gy - 6, sx + 50, gy - 14); ctx.lineTo(sx + 46, gy - 6); ctx.fill(); if (glow) waves(ctx, sx, gy, 36, t, C.teal); return sx; };
        const ga = s.on ? leg === "a" : true, gb = s.on ? leg === "b" : true;
        const ax = skiAt(s.a, ga), bx = skiAt(s.b, gb);
        ctx.font = "700 10px Roboto Mono, monospace"; [[ax, ga], [bx, gb]].forEach(([x, gl], k) => { ctx.fillStyle = gl ? C.teal : C.coral; ctx.fillText((k ? "Rear ski " : "Front ski ") + (gl ? "GLIDE" : "GRIP"), 14 + k * 118, gy + 34); });
        // skier
        const hip = [cx, gy - 62];
        ctx.strokeStyle = "#2B3A55"; ctx.lineWidth = 7; ctx.lineCap = "round";
        [[ax, 0], [bx, 1]].forEach(([x]) => { ctx.beginPath(); ctx.moveTo(hip[0], hip[1]); ctx.lineTo((hip[0] + x) / 2 + 6, gy - 32); ctx.lineTo(x, gy - 10); ctx.stroke(); });
        ctx.fillStyle = "#1F6FB2"; rr(ctx, hip[0] - 13, hip[1] - 46, 26, 50, 10); ctx.fill();
        ctx.strokeStyle = "#1F6FB2"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(hip[0] - 8, hip[1] - 36); ctx.lineTo(hip[0] - 26, hip[1] - 12 + 6 * Math.sin(t * 6)); ctx.moveTo(hip[0] + 8, hip[1] - 36); ctx.lineTo(hip[0] + 24, hip[1] - 14 - 6 * Math.sin(t * 6)); ctx.stroke();
        ctx.fillStyle = "#F2C9A0"; ctx.beginPath(); ctx.arc(hip[0], hip[1] - 58, 11, 0, 7); ctx.fill();
        ctx.fillStyle = C.coral; ctx.beginPath(); ctx.arc(hip[0], hip[1] - 61, 12, Math.PI, 0); ctx.fill();
        ctx.fillStyle = "#222"; rr(ctx, hip[0] - 4, hip[1] - 61, 16, 6, 3); ctx.fill(); ctx.fillStyle = C.gold; rr(ctx, hip[0] + 1, hip[1] - 60, 9, 4, 2); ctx.fill();
        ctx.strokeStyle = C.gold; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(hip[0] - 8, hip[1] - 46); ctx.lineTo(hip[0] - 22 - 4 * Math.sin(t * 5), hip[1] - 44); ctx.stroke();
        ctx.fillStyle = C.ink3; ctx.font = "10px Roboto Mono, monospace"; ctx.fillText(`${Math.max(0, Math.round(mid / 10))} m`, W - 48, 22);
      }
    };
  }

  /* ---------- tutorial A: violin, grip + slip vs crunch ---------- */
  function violin() {
    const s = { on: true, ph: 0, tr: [] };
    return {
      label: () => (s.on ? "Grip + slip: the string sings" : "Too much pressure: it only grips"),
      toggle() { s.on = !s.on; }, get on() { return s.on; },
      step(dt) { s.ph += dt / (s.on ? 0.55 : 0.9 + Math.random()); const u = s.ph % 1; const y = s.on ? (u < 0.82 ? u / 0.82 : 1 - (u - 0.82) / 0.18) : (u < 0.94 ? u * 1.3 : 1.3 * (1 - (u - 0.94) / 0.06)) + (Math.random() - 0.5) * 0.1; s.y = y; s.stick = u < (s.on ? 0.82 : 0.94); s.tr.push(y); if (s.tr.length > 120) s.tr.shift(); },
      draw(ctx, t) {
        const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, C.dark ? "#16233A" : "#FFF9F1"); g.addColorStop(1, C.dark ? "#0F1A2C" : "#FDEBD8"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        const cy = 112, xc = 250, yc = cy + (s.y - 0.5) * 50;
        ctx.strokeStyle = C.dark ? "#C9D6E6" : "#555"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(20, cy); ctx.lineTo(xc, yc); ctx.lineTo(W - 20, cy); ctx.stroke();
        ctx.save(); ctx.translate(xc, yc); ctx.rotate(-0.42); ctx.strokeStyle = "#6B3A1A"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-120, -8); ctx.lineTo(130, -8); ctx.stroke(); ctx.strokeStyle = "#E8DCC0"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-120, -1); ctx.lineTo(130, -1); ctx.stroke(); ctx.restore();
        ctx.font = "800 20px Roboto, sans-serif"; ctx.fillStyle = s.stick ? C.coral : C.teal; ctx.textAlign = "center"; ctx.fillText(s.on ? (s.stick ? "GRIP" : "SLIP") : (s.stick ? "GRIP…" : "KRRCH"), xc, 52); ctx.textAlign = "left";
        if (s.on) for (let i = 0; i < 3; i++) { const a = (t * 0.6 + i / 3) % 1; ctx.fillStyle = `rgba(242,140,40,${1 - a})`; ctx.font = "22px serif"; ctx.fillText("♪", 60 + i * 30, 70 - a * 40); }
        spark(ctx, s.tr, 20, 176, W - 40, 40, C.coral, -0.1, 1.4);
      }
    };
  }
  /* ---------- tutorial B: maestro, sliders in turn vs chaos ---------- */
  function maestro() {
    const n = 8, s = { on: true, T: 0, sl: Array.from({ length: n }, (_, i) => ({ p: i / n, adv: 0 })), F: [] };
    return {
      label: () => (s.on ? "With a maestro: one advances at a time" : "No maestro: advances bunch up"),
      toggle() { s.on = !s.on; }, get on() { return s.on; },
      step(dt) { s.T += dt; const B = 0.35;
        s.sl.forEach((q, i) => { if (q.adv > 0) { q.adv -= dt; q.p = Math.max(0, q.p - dt / 0.3); } else { q.p = Math.min(1, q.p + dt / (n * B * 1.05)); } });
        const due = s.on ? Math.floor(s.T / B) !== Math.floor((s.T - dt) / B) : Math.random() < dt / 0.35;
        if (due) { const cand = s.on ? [s.sl.reduce((a, b) => (b.p > a.p && b.adv <= 0 ? b : a), s.sl.find((q) => q.adv <= 0))] : s.sl.filter((q) => q.adv <= 0).sort(() => Math.random() - 0.5).slice(0, 1 + (Math.random() < 0.4)); cand.forEach((q) => q && (q.adv = 0.3)); }
        const F = s.sl.reduce((a, q) => a + (q.adv > 0 ? -1 : q.p >= 1 ? 0 : 1), 0) / n; s.F.push(F); if (s.F.length > 120) s.F.shift(); },
      draw(ctx, t) {
        ctx.fillStyle = C.dark ? "#16233A" : "#F7FBFD"; ctx.fillRect(0, 0, W, H);
        s.sl.forEach((q, i) => { const x = 70 + i * 40, y = 112 - q.p * 18; ctx.fillStyle = "#F1ECE0"; ctx.strokeStyle = "#5A5A5A"; ctx.lineWidth = 1.2; rr(ctx, x - 13, y - 40, 26, 62, 10); ctx.fill(); ctx.stroke();
          ctx.fillStyle = q.adv > 0 ? C.coral : q.p >= 1 ? "#9AA5B1" : C.teal; rr(ctx, x - 13, y + 16, 26, 6, 3); ctx.fill();
          ctx.fillStyle = "#1A1A1A"; ctx.beginPath(); ctx.arc(x - 4, y - 24, 1.8, 0, 7); ctx.arc(x + 4, y - 24, 1.8, 0, 7); ctx.fill(); });
        // maestro
        const mx = 30, my = 120, sw = s.on ? Math.sin(t * 9) : 0; ctx.fillStyle = "#1A1A1A"; rr(ctx, mx - 8, my - 30, 16, 34, 6); ctx.fill(); ctx.fillStyle = "#fff"; ctx.strokeStyle = "#1A1A1A"; ctx.beginPath(); ctx.arc(mx, my - 42, 10, 0, 7); ctx.fill(); ctx.stroke();
        if (s.on) { ctx.fillStyle = "#1A1A1A"; ctx.fillRect(mx - 8, my - 46, 7, 4); ctx.fillRect(mx + 1, my - 46, 7, 4); ctx.strokeStyle = "#1A1A1A"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(mx + 6, my - 24); ctx.lineTo(mx + 22, my - 52 + sw * 8); ctx.stroke(); }
        spark(ctx, s.F, 20, 176, W - 40, 40, C.coral, -0.4, 1);
        ctx.fillStyle = C.ink3; ctx.font = "10px Roboto Mono, monospace"; ctx.fillText("thrust", W - 56, 230);
      }
    };
  }

  const MAKERS = { glide, catheter, oscar, ski, violin, maestro };
  canvases.forEach((cv) => {
    const key = cv.dataset.game, sim = MAKERS[key] && MAKERS[key](); if (!sim) return;
    const ctx = cv.getContext("2d"), dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const btn = document.querySelector(`.lp-toggle[data-for="${key}"]`), lab = cv.parentElement.querySelector(".lp-state");
    const sync = () => { if (lab) lab.textContent = sim.label(); if (btn) btn.setAttribute("aria-pressed", sim.on); };
    let auto = 0, manual = 0;
    btn?.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); sim.toggle(); manual = 12; sync(); });
    sync();
    let last = performance.now(), t = 0, visible = false;
    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05); last = now; t += dt;
      if (!reduce) { sim.step(dt, t); auto += dt; manual = Math.max(0, manual - dt); if (auto > 6 && !manual) { auto = 0; sim.toggle(); sync(); } }
      ctx.clearRect(0, 0, W, H); sim.draw(ctx, t);
      if (visible) requestAnimationFrame(frame);
    };
    new IntersectionObserver((en) => { const was = visible; visible = en[0].isIntersecting; if (visible && !was) { last = performance.now(); requestAnimationFrame(frame); } }).observe(cv);
    if (reduce) { for (let i = 0; i < 120; i++) sim.step(1 / 30, i / 30); }
    else for (let i = 0; i < 30; i++) sim.step(1 / 30, i / 30);
    try { ctx.clearRect(0, 0, W, H); sim.draw(ctx, 1); } catch (e) {} // a first frame, before the card scrolls into view
  });
})();
