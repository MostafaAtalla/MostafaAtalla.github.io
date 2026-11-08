/* Lab game 3 · OSCAR: race to the cecum (coordination).
   OSCAR carries twelve sliders around its body. A barrel cam moves each slider: a slow retraction,
   while the slider grips the colon wall and pulls the capsule forward, then a quick advance, while it
   slides forward and pushes the capsule back. Each slider is friction-limited in both directions, so
   the cycle-average thrust follows the time asymmetry (Eq. 18 of the paper):
       F̄ ∝ d_ret − d_adv = Δd.
   A cam with k jumps per turn repeats the cycle k times. The steepest advance a follower can climb
   is about 32° of cam rotation per jump (this reproduces the paper's Δd = 0.82 / 0.64 / 0.48 for
   1 / 2 / 3 jumps), so more jumps give a lower Δd.
   Ripple has two sources, both shown:
   - asynchrony: the number of sliders advancing at a time steps up and down (the paper's model);
   - rocking: a single advancing slider pushes the capsule sideways once per turn, unbalanced;
     with 2 or 3 jumps, sliders on opposite sides advance together and cancel the moment
     (the paper's explanation of the measured ripple, which falls from 1 to 2 to 3 jumps).
   Game: 1 the cam workshop (pass the bench test) · 2 race to the cecum (throttle and comfort). */
(function () {
  window.LabGames = window.LabGames || {};
  const TAU = Math.PI * 2;
  const F1 = 0.85, DD1 = 0.82, FN = F1 / DD1; // N: measured mean thrust of the single-jump cam, Δd of that cam
  const ROCK = 0.24, A_MIN = 32, V0 = 9;        // rocking amplitude (N, single slider, 32°, 9 V), steepest advance (°), nominal motor voltage
  const SEGS = [ // the colon from the rectum to the cecum: length (mm), drag (N)
    { name: "rectum", L: 150, D: 0.25 }, { name: "sigmoid colon", L: 400, D: 0.36 }, { name: "descending colon", L: 250, D: 0.25 },
    { name: "splenic flexure", L: 100, D: 0.42 }, { name: "transverse colon", L: 450, D: 0.25 }, { name: "hepatic flexure", L: 100, D: 0.42 }, { name: "ascending colon", L: 150, D: 0.3 }];
  const TOTAL = SEGS.reduce((a, s) => a + s.L, 0); // 1600 mm
  const segAt = (x) => { let acc = 0; for (const s of SEGS) { if (x < acc + s.L) return { ...s, x0: acc }; acc += s.L; } return { ...SEGS[SEGS.length - 1], x0: TOTAL - SEGS[SEGS.length - 1].L }; };

  // ---------- the capsule model ----------
  const capsule = (k, alpha, n) => {
    const tol = Array.from({ length: n }, (_, i) => 1 + 0.06 * Math.sin(i * 2.399 + 0.7)); // small slider-to-slider spread (manufacturing)
    return { k, alpha, n, V: V0, th: 0, f: new Array(n).fill(1), a: new Array(n).fill(0), tol, u: new Array(n).fill(0), hist: [], rx: 0, ry: 0, Fa: 0, R: 0, F: 0 };
  };
  const dAdv = (m) => Math.min(1, (m.k * m.alpha) / 360);
  const deltaD = (m) => 1 - 2 * dAdv(m);
  const lift = (u, da) => (u < 1 - da ? u / (1 - da) : 1 - (u - (1 - da)) / da); // 0 = forward, 1 = fully retracted
  const Trev = (m) => 4 * (V0 / m.V); // game seconds per cam turn
  const stepCap = (m, dt) => {
    const da = dAdv(m), T = Trev(m), tau = 0.015 * T; m.th += dt / T;
    let S = 0, rx = 0, ry = 0;
    for (let i = 0; i < m.n; i++) { const u = (((m.k * (m.th + i / m.n)) % 1) + 1) % 1, adv = u >= 1 - da; m.u[i] = u;
      m.f[i] += ((adv ? -1 : 1) - m.f[i]) * Math.min(1, dt / tau); m.a[i] += ((adv ? 1 : 0) - m.a[i]) * Math.min(1, dt / tau);
      S += m.f[i]; const ang = (TAU * i) / m.n; rx += m.a[i] * m.tol[i] * Math.cos(ang); ry += m.a[i] * m.tol[i] * Math.sin(ang); }
    m.rx = rx; m.ry = ry;
    m.Fa = (FN * S) / m.n;                                                        // asynchrony: friction-limited sliders, + pulling, − pushing
    m.R = ROCK * Math.pow(A_MIN / m.alpha, 2) * Math.pow(m.V / V0, 2) * rx;       // rocking: projection of the unbalanced advance on the sensing axis
    m.F = m.Fa + m.R;
    m.hist.push({ t: m.th, Fa: m.Fa, R: m.R, F: m.F }); while (m.hist.length && m.hist[0].t < m.th - 2) m.hist.shift();
  };
  const warm = (m) => { m.hist = []; const T = Trev(m); for (let i = 0; i < 400; i++) stepCap(m, (1.5 * T) / 400); }; // settle the sliders before measuring
  const stats = (m) => { const h = m.hist.filter((q) => q.t > m.th - 1); if (h.length < 5) return { mean: FN * deltaD(m), pp: 0, ppA: 0, ppR: 0 };
    const mm = (key) => { let lo = 1e9, hi = -1e9, s = 0; h.forEach((q) => { lo = Math.min(lo, q[key]); hi = Math.max(hi, q[key]); s += q[key]; }); return [s / h.length, hi - lo]; };
    const [mean, pp] = mm("F"), [, ppA] = mm("Fa"), [, ppR] = mm("R"); return { mean, pp, ppA, ppR }; };

  window.LabGames.oscar = (api, mode) => {
    const k = window.LabKit, { ctx: c, W, H, plot: P, PH } = api;
    let C = api.colors(), alive = true, raf = 0, last = performance.now(), t = 0;
    const off = [], on = (el, ev, f, o) => { el.addEventListener(ev, f, o); off.push(() => el.removeEventListener(ev, f, o)); };
    on(document, "themechange", () => (C = api.colors()));
    const keys = {};
    on(window, "keydown", (e) => { if (["ArrowUp", "ArrowDown"].includes(e.code) && document.activeElement?.tagName !== "INPUT") e.preventDefault(); keys[e.code] = true; });
    on(window, "keyup", (e) => (keys[e.code] = false));
    const teal = () => C.teal;

    // ---------- drawing ----------
    const bg = () => { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, C.dark ? "#16233A" : "#F7FBFD"); g.addColorStop(1, C.dark ? "#0F1A2C" : "#EAF3F8"); c.fillStyle = g; c.fillRect(0, 0, W, H); };
    const panel = (x, y, w, h) => { c.fillStyle = C.dark ? "rgba(16,29,49,.9)" : "rgba(255,255,255,.92)"; k.rr(c, x, y, w, h, 12); c.fill(); c.strokeStyle = C.dark ? "#22344F" : "#E1E7EE"; c.lineWidth = 1; c.stroke(); };
    // the cam, unrolled: slider position over one turn, the advance bands shaded, every slider a dot
    const drawCam = (m, x, y, w, h) => {
      panel(x, y, w, h); const da = dAdv(m), px = x + 40, pw = w - 56, py = y + 30, ph = h - 62;
      k.text(c, `THE CAM · ${m.k} jump${m.k > 1 ? "s" : ""} per turn · each advance ${m.alpha}°`, x + 14, y + 19, "700 11px Roboto Mono, monospace", C.ink2);
      for (let j = 0; j < m.k; j++) { const a0 = (j + 1 - da) / m.k, a1 = (j + 1) / m.k; c.fillStyle = "rgba(217,80,46,.13)"; c.fillRect(px + a0 * pw, py, (a1 - a0) * pw, ph); }
      c.strokeStyle = C.ink3; c.lineWidth = 1; c.beginPath(); c.moveTo(px, py + ph); c.lineTo(px + pw, py + ph); c.moveTo(px, py); c.lineTo(px, py + ph); c.stroke();
      k.text(c, "rear", px - 6, py + 8, "10px Roboto Mono, monospace", C.ink3, "right"); k.text(c, "front", px - 6, py + ph, "10px Roboto Mono, monospace", C.ink3, "right");
      c.strokeStyle = C.ink; c.lineWidth = 2; c.beginPath();
      for (let q = 0; q <= 240; q++) { const ph0 = q / 240, u = (m.k * ph0) % 1, xx = px + ph0 * pw, yy = py + ph - lift(u, da) * ph; q ? c.lineTo(xx, yy) : c.moveTo(xx, yy); } c.stroke();
      for (let i = 0; i < m.n; i++) { const ph0 = (((m.th + i / m.n) % 1) + 1) % 1, xx = px + ph0 * pw, yy = py + ph - lift(m.u[i], da) * ph, adv = m.u[i] >= 1 - da;
        c.fillStyle = adv ? C.coral : teal(); c.beginPath(); c.arc(xx, yy, 4.5, 0, TAU); c.fill(); }
      k.text(c, "0°", px, py + ph + 14, "10px Roboto Mono, monospace", C.ink3, "center"); k.text(c, "360°", px + pw, py + ph + 14, "10px Roboto Mono, monospace", C.ink3, "center");
      k.text(c, `advance share d_adv = ${m.k}×${m.alpha}°/360° = ${da.toFixed(2)}  ·  Δd = 1 − 2·d_adv = ${deltaD(m).toFixed(2)}`, px + pw / 2, py + ph + 26, "600 11px Roboto Mono, monospace", deltaD(m) > 0 ? C.ink2 : C.coral, "center");
    };
    // the capsule seen end-on: the twelve sliders, the advancing ones in coral, and the sideways push they leave unbalanced
    const drawSection = (m, cx, cy, R) => {
      panel(cx - R - 26, cy - R - 34, 2 * R + 52, 2 * R + 66);
      k.text(c, "END-ON VIEW", cx, cy - R - 16, "700 11px Roboto Mono, monospace", C.ink2, "center");
      c.fillStyle = C.dark ? "#3A4A60" : "#DDE3EA"; c.beginPath(); c.arc(cx, cy, R * 0.72, 0, TAU); c.fill();
      for (let i = 0; i < m.n; i++) { const ang = (TAU * i) / m.n - Math.PI / 2, adv = m.a[i] > 0.5;
        c.save(); c.translate(cx + Math.cos(ang) * R * 0.86, cy + Math.sin(ang) * R * 0.86); c.rotate(ang + Math.PI / 2);
        c.fillStyle = adv ? C.coral : teal(); k.rr(c, -7, -5, 14, 10, 3); c.fill(); c.restore(); }
      const mag = Math.hypot(m.rx, m.ry), sc = R * 0.6, ax = m.rx, ay = m.ry; // vector sum of advancing sliders
      if (mag > 0.15) { const ux = Math.cos(Math.atan2(ay, ax) - Math.PI / 2), uy = Math.sin(Math.atan2(ay, ax) - Math.PI / 2), L = Math.min(1.2, mag) * sc;
        c.strokeStyle = C.gold; c.fillStyle = C.gold; c.lineWidth = 4; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + ux * L, cy + uy * L); c.stroke();
        c.beginPath(); c.moveTo(cx + ux * (L + 9), cy + uy * (L + 9)); c.lineTo(cx + ux * L - uy * 6, cy + uy * L + ux * 6); c.lineTo(cx + ux * L + uy * 6, cy + uy * L - ux * 6); c.closePath(); c.fill(); }
      else { c.fillStyle = C.ink2; c.beginPath(); c.arc(cx, cy, 3, 0, TAU); c.fill(); }
      const bal = Math.max(...m.hist.slice(-60).map((q) => Math.abs(q.R)), 0) < 0.06;
      k.text(c, bal ? "balanced: no sideways push" : "unbalanced: it rocks", cx, cy + R + 22, "700 12px Roboto, sans-serif", bal ? teal() : C.gold, "center");
    };
    // side view in the colon: the sliders ride back with the cam and snap forward on the advance
    const drawSide = (m, x, y, rock, shift, scale = 1) => {
      c.fillStyle = C.dark ? "#3A2230" : "#F6D7D2"; c.fillRect(0, y - 78 * scale, W, 156 * scale);
      const wy = (xx, sg) => y + sg * scale * (44 - 9 * Math.max(0, Math.sin((xx + shift) / 34)) ** 4 + 12 * Math.exp(-Math.pow((xx - x) / (140 * scale), 4)));
      c.fillStyle = C.dark ? "#1E1420" : "#FFF3F0"; c.beginPath(); for (let xx = 0; xx <= W; xx += 6) c.lineTo(xx, wy(xx, -1)); for (let xx = W; xx >= 0; xx -= 6) c.lineTo(xx, wy(xx, 1)); c.fill();
      c.strokeStyle = C.dark ? "#B05A6E" : "#D98C8C"; c.lineWidth = 2; [-1, 1].forEach((sg) => { c.beginPath(); for (let xx = 0; xx <= W; xx += 6) c.lineTo(xx, wy(xx, sg)); c.stroke(); });
      c.save(); c.translate(x, y + rock); c.scale(scale, scale);
      const L = 250, R = 44, x0 = -L / 2, x1 = L / 2, da = dAdv(m);
      const body = () => { c.beginPath(); c.moveTo(x0 + 10, -R); c.lineTo(x1 - 50, -R); c.quadraticCurveTo(x1, -R * 0.7, x1 + 8, 0); c.quadraticCurveTo(x1, R * 0.7, x1 - 50, R); c.lineTo(x0 + 10, R); c.quadraticCurveTo(x0, R, x0, R - 10); c.lineTo(x0, -R + 10); c.quadraticCurveTo(x0, -R, x0 + 10, -R); c.closePath(); };
      const g = c.createLinearGradient(0, -R, 0, R); g.addColorStop(0, "#EEF2F5"); g.addColorStop(0.5, "#B9C4CF"); g.addColorStop(1, "#7D8A99"); body(); c.fillStyle = g; c.fill();
      c.save(); body(); c.clip();
      for (let i = 0; i < m.n; i++) { const a = (TAU * i) / m.n; if (Math.sin(a) < -0.05) continue; const yy = -Math.cos(a) * (R - 4), h = 4 + 6 * Math.sin(a), offx = -lift(m.u[i], da) * 30;
        c.globalAlpha = 0.55 + 0.45 * Math.sin(a); c.fillStyle = m.a[i] > 0.5 ? C.coral : teal(); c.fillRect(x0 + 8 + offx, yy - h / 2, L - 44, h);
        c.fillStyle = "rgba(0,0,0,.22)"; for (let q = x0 + 12 + offx; q < x0 + L - 40 + offx; q += 8) c.fillRect(q, yy - h / 2, 2, h); c.globalAlpha = 1; }
      c.restore(); body(); c.strokeStyle = "rgba(40,55,75,.55)"; c.lineWidth = 1.4; c.stroke();
      [0, m.n / 2].forEach((i) => { i = Math.round(i) % m.n; const sg = i ? 1 : -1, offx = -lift(m.u[i], da) * 30, sx = x0 + 6 + offx, sw = L - 60, yb = sg * (R - 2);
        c.fillStyle = m.a[i] > 0.5 ? C.coral : teal(); c.beginPath(); c.moveTo(sx, yb); for (let q = sx; q < sx + sw; q += 10) { c.lineTo(q + 7, yb + sg * 7); c.lineTo(q + 10, yb); } c.lineTo(sx, yb); c.fill(); });
      c.strokeStyle = C.ink3; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x0, 0); c.bezierCurveTo(x0 - 60, 10, x0 - 120, -6, x0 - 400, 4); c.stroke();
      c.restore();
    };
    // the thrust trace, with its two ripple sources drawn underneath
    const drawPlot = (m, show) => {
      P.clearRect(0, 0, W, PH); P.fillStyle = C.dark ? "#101D31" : "#F1F4F8"; k.rr(P, 0, 0, W, PH, 12); P.fill();
      const x0 = 46, w = W - 66, lo = -0.5, hi = 1.5, yOf = (v) => 18 + (1 - (v - lo) / (hi - lo)) * (PH - 40);
      P.strokeStyle = C.rule; P.lineWidth = 1; [0, 0.5, 1].forEach((v) => { P.beginPath(); P.moveTo(x0, yOf(v)); P.lineTo(x0 + w, yOf(v)); P.stroke(); k.text(P, `${v.toFixed(1)} N`, x0 - 6, yOf(v) + 4, "10px Roboto Mono, monospace", C.ink3, "right"); });
      const h = m.hist, t0 = m.th - 2, X = (tt) => x0 + ((tt - t0) / 2) * w;
      const line = (key, col, wd, base) => { P.strokeStyle = col; P.lineWidth = wd; P.beginPath(); h.forEach((q, i) => { const v = (base ?? 0) + q[key]; i ? P.lineTo(X(q.t), yOf(v)) : P.moveTo(X(q.t), yOf(v)); }); P.stroke(); };
      const s = stats(m);
      if (show.rock) line("R", C.gold, 1.5, s.mean); if (show.async) line("Fa", teal(), 1.5);
      line("F", C.coral, 2.5);
      P.setLineDash([5, 4]); P.strokeStyle = C.ink2; P.lineWidth = 1; P.beginPath(); P.moveTo(x0, yOf(s.mean)); P.lineTo(x0 + w, yOf(s.mean)); P.stroke(); P.setLineDash([]);
      k.text(P, "thrust over the last two cam turns:", x0, 13, "600 11px Roboto, sans-serif", C.ink2);
      let lx = x0 + 200; const leg = (txt, col) => { P.fillStyle = col; P.fillRect(lx, 6, 14, 4); k.text(P, txt, lx + 18, 13, "600 11px Roboto, sans-serif", C.ink2); lx += P.measureText(txt).width + 36; };
      leg("total, as a force sensor reads it", C.coral); if (show.async) leg("asynchrony", teal()); if (show.rock) leg("rocking (drawn around the mean)", C.gold); leg("mean", C.ink2);
    };

    let frame = () => {};
    const loop = (now) => { if (!alive) return; const dt = Math.min((now - last) / 1000, 0.04); last = now; t += dt; frame(dt); raf = requestAnimationFrame(loop); };

    // the cam workshop controls (k, α, optionally n and voltage)
    const designControls = (m, opts, extra) => {
      api.controls.innerHTML = `<div class="lab-seg" role="group" aria-label="Jumps per turn">${[1, 2, 3, 4].map((j) => `<button type="button" data-k="${j}" aria-selected="${j === m.k}">${j} jump${j > 1 ? "s" : ""}</button>`).join("")}</div>
        <label class="lab-range">Advance angle <input type="range" id="o-a" min="${A_MIN}" max="120" step="1" value="${m.alpha}"><output id="o-ao">${m.alpha}°</output></label>
        ${opts.n ? `<label class="lab-range">Sliders <input type="range" id="o-n" min="4" max="16" step="1" value="${m.n}"><output id="o-no">${m.n}</output></label>` : ""}
        ${opts.v ? `<label class="lab-range">Motor <input type="range" id="o-v" min="6" max="12" step="0.5" value="${m.V}"><output id="o-vo">${m.V} V</output></label>` : ""}${extra || ""}`;
      api.controls.querySelectorAll("[data-k]").forEach((b) => b.addEventListener("click", () => { m.k = +b.dataset.k; api.controls.querySelectorAll("[data-k]").forEach((q) => q.setAttribute("aria-selected", q === b)); warm(m); }));
      const bind = (id, f) => { const el = document.getElementById(id); el && el.addEventListener("input", () => f(+el.value)); };
      bind("o-a", (v) => { m.alpha = v; document.getElementById("o-ao").textContent = v + "°"; warm(m); });
      bind("o-n", (v) => { const V = m.V, nm = capsule(m.k, m.alpha, v); Object.assign(m, nm); m.V = V; warm(m); document.getElementById("o-no").textContent = v; });
      bind("o-v", (v) => { m.V = v; document.getElementById("o-vo").textContent = v + " V"; warm(m); });
      k.muteButton(api.controls);
    };
    const statBox = (m, s, x, y, w, goal) => {
      panel(x, y, w, goal ? 190 : 150); let yy = y + 26; const row = (a, b, col) => { k.text(c, a, x + 14, yy, "600 12px Roboto, sans-serif", C.ink2); k.text(c, b, x + w - 14, yy, "700 13px Roboto Mono, monospace", col || C.ink, "right"); yy += 22; };
      row("Mean thrust", `${s.mean.toFixed(2)} N`, goal && s.mean < goal.F ? C.coral : null);
      row("Ripple, peak to peak", `${s.pp.toFixed(2)} N`, goal && s.pp > goal.pp ? C.coral : null);
      row("  from asynchrony", `${s.ppA.toFixed(2)} N`, teal()); row("  from rocking", `${s.ppR.toFixed(2)} N`, C.gold);
      row("Motor", `${(+m.V).toFixed(1)} V`, C.ink3);
      if (goal) { yy += 4; k.text(c, `Bench test: thrust ≥ ${goal.F} N and ripple ≤ ${goal.pp} N`, x + 14, yy, "700 12px Roboto, sans-serif", s.mean >= goal.F && s.pp <= goal.pp ? teal() : C.ink); yy += 20;
        k.text(c, s.mean >= goal.F && s.pp <= goal.pp ? "✓ this design passes: submit it" : s.mean < goal.F ? "✗ not enough pull" : "✗ too much ripple", x + 14, yy, "700 12px Roboto, sans-serif", s.mean >= goal.F && s.pp <= goal.pp ? teal() : C.coral); }
    };

    // ======================= GAME =======================
    if (mode === "game") {
      const m = capsule(1, A_MIN, 12); warm(m);
      const GOAL = { F: 0.6, pp: 0.3 };
      (async () => {
        await api.card(`<span class="lp-k">Game 3 · Propel</span><h3>OSCAR: race to the cecum</h3><p>OSCAR is a capsule, 28 mm wide, covered by <b>twelve sliders</b>. A slider that slowly <b style="color:var(--acc-teal)">retracts</b> grips the colon wall and pulls the capsule forward; one that quickly <b style="color:var(--acc-coral)">advances</b> slides forward and pushes it back. A <b>cam</b> inside moves them all, like the maestro of Tutorial B.</p><p>You are the cam designer. Two choices: how many <b>jumps</b> (advance strokes) per turn, and how many degrees each <b>advance</b> takes. The cam follower cannot climb faster than about ${A_MIN}° per advance without jamming.</p><p>First pass the bench test, then race your capsule to the cecum.</p>`, [{ label: "Open the workshop" }]);
        if (!alive) return;
        // ---- level 1: the workshop
        let fails = 0, passed = false;
        while (!passed && alive) {
          await new Promise((done) => {
            designControls(m, {}, `<button class="btn small-btn" id="o-sub" type="button">Submit to the bench test</button><span class="lab-note">Level 1 of 2</span>`);
            document.getElementById("o-sub").addEventListener("click", () => done());
            frame = (dt) => { stepCap(m, dt); const s = stats(m);
              c.clearRect(0, 0, W, H); bg(); drawCam(m, 16, 14, 470, 178); drawSection(m, 586, 110, 62); statBox(m, s, 700, 14, 244, GOAL);
              drawSide(m, 470, 345, m.R * 14, t * 8);
              k.text(c, `Pulling sliders (retracting) in ${document.documentElement.classList.contains("a11y-cb") ? "blue" : "teal"} · pushing sliders (advancing) in ${document.documentElement.classList.contains("a11y-cb") ? "orange" : "coral"}`, W / 2, 470, "700 14px Roboto, sans-serif", C.ink2, "center");
              k.text(c, "* cam speed illustrative: thrust does not depend on it", W - 16, 530, "11px Roboto, sans-serif", C.ink3, "right");
              drawPlot(m, { async: true, rock: true }); };
          });
          if (!alive) return;
          const s = stats(m); passed = s.mean >= GOAL.F && s.pp <= GOAL.pp;
          api.log("game", "L1try", { k: m.k, alpha: m.alpha, mean: s.mean, pp: s.pp, pass: passed ? 1 : 0 });
          if (!passed) { fails++;
            await api.card(`<span class="lp-k">Bench test · not yet</span><h3>${s.mean < GOAL.F ? "Not enough pull" : "Too much ripple"}: ${s.mean.toFixed(2)} N, ripple ${s.pp.toFixed(2)} N</h3><p>${s.mean < GOAL.F ? `Thrust follows Δd = 1 − 2·d_adv. Your advances take ${(dAdv(m) * 100).toFixed(0)}% of each turn, so Δd is only ${deltaD(m).toFixed(2)}. Fewer jumps, or a steeper advance, leave more of the turn for pulling.` : s.ppR > s.ppA ? `Most of it is <b style="color:var(--acc-gold)">rocking</b>: with one jump, a single slider advances at a time, and its push is not balanced by any slider on the other side. Try a design where sliders on opposite sides advance together, or a gentler advance.` : `Most of it is <b style="color:var(--acc-teal)">asynchrony</b>: the number of sliders advancing at once keeps stepping up and down. Try a different advance angle: when an advance lasts a whole number of slider spacings, the steps overlap and the thrust evens out.`}</p>`, [{ label: "Back to the workshop" }]); }
        }
        if (!alive) return;
        const s1 = stats(m), l1 = Math.max(40, 100 - fails * 15);
        api.log("game", "L1", { score: l1, k: m.k, alpha: m.alpha, mean: s1.mean, pp: s1.pp, fails });
        await api.card(`<span class="lp-k">Bench test passed · ${l1} / 100</span><h3>${m.k} jump${m.k > 1 ? "s" : ""}, ${m.alpha}° advance: ${s1.mean.toFixed(2)} N, ripple ${s1.pp.toFixed(2)} N</h3><p>Before the race, three cards to think about.</p>`, [{ label: "Pause and reflect" }]);
        if (!alive) return;
        await api.flash([
          { q: "Two jumps make the thrust smaller, yet the paper's capsule rocked less with them. Why?", a: "With two jumps, two sliders on <b>opposite sides</b> advance together. Their sideways pushes cancel, so the capsule does not rock. With one jump, a lone slider advances and nothing balances it." },
          { q: "Why does each extra jump lower the mean thrust?", a: "Each advance needs about the same cam angle, around 32°. With more jumps, the advances take a bigger share of each turn, so d_adv grows and <b>Δd = d_ret − d_adv</b> shrinks: 0.82, 0.64 and 0.48 for 1, 2 and 3 jumps." },
          { q: "The paper's model predicts more ripple for three jumps, but the measurement shows less. What explains it?", a: "The model counts only sliders switching (asynchrony). The sensor also feels the capsule <b>rocking</b> after an unbalanced advance, which was about six times larger and largest for one jump. Balanced cams remove most of it." }
        ], "Race to the cecum");
        if (!alive) return;
        // ---- level 2: the race
        const race = await raceRun(m);
        if (!alive) return;
        const total = Math.round((l1 + race.score) / 2), nb = api.best(total, `${total} / 100`);
        api.log("game", "total", { score: total, l1, race: race.score, k: m.k, alpha: m.alpha, time: race.Treal, comfort: race.comfort, done: race.done ? 1 : 0 });
        const go = await api.card(`<span class="lp-k">Debrief</span><h3>${total} / 100${nb ? " · new best" : ""}</h3>
          <ul class="ls-res"><li>Cam design <b>${m.k} jump${m.k > 1 ? "s" : ""} · ${m.alpha}° · Δd ${deltaD(m).toFixed(2)}</b></li><li>Bench test <b>${l1}</b></li><li>${race.done ? "Reached the cecum in" : "Stopped after"} <b>${race.done ? (race.Treal / 60).toFixed(1) + " min" : (race.x / 10).toFixed(0) + " cm"}</b></li><li>Patient comfort <b>${race.comfort}</b></li><li>Race score <b>${race.score}</b></li></ul>
          <p>The cam decides everything here: how much of each turn pulls (the mean thrust), whether opposite sliders balance each other (the rocking), and so how fast you can run the motor without shaking the patient. The paper's capsule pulled <b>0.85 N</b> with the single-jump cam and travelled <b>3.08 mm/s</b>, which would reach the cecum in about 9 minutes.</p>`, [{ label: "Try another design" }, { label: "Explore mode" }]);
        if (!alive) return; document.querySelector(`.ls-modes [data-m="${go === 1 ? "explore" : "game"}"]`)?.click();
      })();

      function raceRun(m) {
        return new Promise(async (done) => {
          const s = stats(m);
          await api.card(`<span class="lp-k">Level 2 of 2 · race to the cecum</span><h3>1.6 m of colon, your cam</h3><p>Your design pulls <b>${s.mean.toFixed(2)} N</b> on average. The colon resists: about 0.25 N in straight parts, more in the sigmoid and at the two flexures. Where the drag comes close to your thrust, the sliders slip and you slow down; above it, you stop.</p><p><b>Your control: the motor</b> (↑ ↓ or the slider). A faster cam moves you faster, but every unbalanced advance hits harder, and the <b>comfort</b> meter drops with the ripple.</p><p class="muted">Time runs ×12: one second here is twelve in the colon.</p>`, [{ label: "Start the race" }]);
          if (!alive) return;
          m.V = V0; warm(m);
          let x = 0, Treal = 0, disc = 0, stalled = 0, Fbar = s.mean, finished = false;
          api.controls.innerHTML = `<label class="lab-range">Motor <input type="range" id="o-v" min="6" max="12" step="0.5" value="${m.V}"><output id="o-vo">${m.V} V</output></label><span class="lab-note">↑ ↓ to change the motor speed</span><button class="btn ghost small-btn" id="o-ab" type="button">Stop and redesign</button>`;
          const vi = document.getElementById("o-v"), vo = document.getElementById("o-vo");
          vi.addEventListener("input", () => { m.V = +vi.value; vo.textContent = m.V + " V"; });
          document.getElementById("o-ab").addEventListener("click", () => { finished = true; });
          k.muteButton(api.controls);
          const norm = (F1 - 0.25) / F1;
          frame = (dt) => {
            if (keys.ArrowUp) m.V = Math.min(12, m.V + 3 * dt); if (keys.ArrowDown) m.V = Math.max(6, m.V - 3 * dt);
            if (keys.ArrowUp || keys.ArrowDown) { vi.value = m.V; vo.textContent = m.V.toFixed(1) + " V"; }
            stepCap(m, dt); const st = stats(m), seg = segAt(x); Fbar += (st.mean - Fbar) * Math.min(1, dt * 2);
            const margin = Math.max(0, (Fbar - seg.D) / Fbar), v = 3.08 * (m.V / V0) * (Math.max(0, deltaD(m)) / DD1) * (margin / norm); // mm/s
            const dtr = dt * 12; x += v * dtr; Treal += dtr; disc += st.pp * st.pp * dt; if (v < 0.05) stalled += dt; else stalled = 0;
            const comfort = Math.round(100 * Math.exp(-disc / 25));
            // scene
            c.clearRect(0, 0, W, H); bg();
            drawSide(m, 400, 300, m.R * 16, x * 4, 1.15);
            // colon map: rectum at the bottom, around the frame to the cecum
            const mx = 760, my = 20, mw = 180, mh = 150; panel(mx - 10, my - 6, mw + 20, mh + 42);
            const pts = [[mx + mw * 0.55, my + mh], [mx + mw * 0.6, my + mh * 0.8], [mx + mw * 0.85, my + mh * 0.85], [mx + mw * 0.75, my + mh * 0.7], [mx + mw, my + mh * 0.62], [mx + mw, my + mh * 0.1], [mx + mw * 0.92, my], [mx + mw * 0.5, my + mh * 0.18], [mx + mw * 0.08, my], [mx, my + mh * 0.12], [mx, my + mh * 0.85], [mx + mw * 0.12, my + mh * 0.92]];
            const pl = []; let acc = 0; for (let i = 0; i < pts.length; i++) { if (i) acc += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); pl.push(acc); }
            const at = (fr) => { const d = fr * acc; for (let i = 1; i < pts.length; i++) if (pl[i] >= d) { const u = (d - pl[i - 1]) / (pl[i] - pl[i - 1]); return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * u, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * u]; } return pts[pts.length - 1]; };
            c.lineCap = "round"; c.lineJoin = "round"; c.strokeStyle = C.dark ? "#7A3A4A" : "#F2B8AE"; c.lineWidth = 14; c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.stroke();
            c.strokeStyle = C.coral; c.lineWidth = 5; c.beginPath(); for (let q = 0; q <= 60; q++) { const p = at((q / 60) * Math.min(1, x / TOTAL)); q ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); } c.stroke();
            const cp = at(Math.min(1, x / TOTAL)); c.fillStyle = C.ink; c.beginPath(); c.arc(cp[0], cp[1], 5, 0, TAU); c.fill();
            k.text(c, "cecum", mx + 4, my + mh + 26, "italic 11px Roboto, sans-serif", C.ink3); k.text(c, "start", mx + mw * 0.55, my + mh + 26, "italic 11px Roboto, sans-serif", C.ink3, "center");
            // HUD
            panel(16, 14, 330, 150); let yy = 38; const row = (a, b, col) => { k.text(c, a, 30, yy, "600 12px Roboto, sans-serif", C.ink2); k.text(c, b, 332, yy, "700 13px Roboto Mono, monospace", col || C.ink, "right"); yy += 22; };
            row("Now in the", seg.name, C.ink); row("Drag here / your mean thrust", `${seg.D.toFixed(2)} / ${Fbar.toFixed(2)} N`, Fbar <= seg.D ? C.coral : Fbar - seg.D < 0.12 ? C.gold : teal());
            row("Speed", `${v.toFixed(2)} mm/s`); row("Distance", `${(x / 10).toFixed(0)} / ${TOTAL / 10} cm`); row("Time in the colon", `${Math.floor(Treal / 60)}:${String(Math.floor(Treal % 60)).padStart(2, "0")}`);
            // comfort meter
            panel(16, 176, 330, 52); k.text(c, `Patient comfort ${comfort}`, 30, 198, "700 12px Roboto, sans-serif", comfort > 70 ? teal() : comfort > 40 ? C.gold : C.coral);
            c.fillStyle = C.dark ? "#22344F" : "#E7ECF2"; k.rr(c, 30, 206, 302, 10, 5); c.fill(); c.fillStyle = comfort > 70 ? teal() : comfort > 40 ? C.gold : C.coral; k.rr(c, 30, 206, 3.02 * comfort, 10, 5); c.fill();
            k.text(c, seg.name, W / 2, 418, "400 26px Fraunces, Georgia, serif", C.ink2, "center");
            if (Fbar <= seg.D) k.text(c, `Stalled: the ${seg.name} resists more than your cam pulls. More Δd needed: stop and redesign.`, W / 2, 470, "700 15px Roboto, sans-serif", C.coral, "center");
            else if (st.ppR > 0.4) k.text(c, "The capsule is rocking hard: ease off the motor, or balance the cam", W / 2, 470, "700 15px Roboto, sans-serif", C.gold, "center");
            else k.text(c, "↑ faster · ↓ gentler", W / 2, 470, "600 14px Roboto, sans-serif", C.ink3, "center");
            // progress bar with the segments
            let bx = 16; const bw = W - 32; SEGS.forEach((sg) => { const w = (sg.L / TOTAL) * bw; c.fillStyle = sg.D > 0.3 ? (C.dark ? "#5A3040" : "#F4C9C0") : C.dark ? "#22344F" : "#E7ECF2"; c.fillRect(bx, 496, w - 2, 14); bx += w; });
            c.fillStyle = C.coral; c.fillRect(16, 496, (bw * Math.min(x, TOTAL)) / TOTAL, 14); k.text(c, "darker bands: sigmoid and flexures (more drag)", 16, 528, "11px Roboto, sans-serif", C.ink3);
            drawPlot(m, { async: true, rock: true });
            if (x >= TOTAL || finished || stalled > 6 || Treal > 3600) {
              frame = () => {}; const ok = x >= TOTAL, timeSc = ok ? Math.min(100, Math.round((100 * 520) / Treal)) : Math.round((40 * x) / TOTAL);
              const score = Math.round(0.5 * timeSc + 0.5 * (ok ? comfort : comfort * x / TOTAL));
              api.log("game", "L2", { score, done: ok ? 1 : 0, time: Treal, comfort, x });
              done({ score, done: ok, Treal, comfort, x }); }
          };
        });
      }
    }

    // ======================= EXPLORE =======================
    if (mode === "explore") {
      const m = capsule(1, A_MIN, 12); warm(m); const show = { async: true, rock: true };
      designControls(m, { n: true, v: true }, `<label class="lab-check"><input type="checkbox" id="o-sa" checked> show asynchrony</label><label class="lab-check"><input type="checkbox" id="o-sr" checked> show rocking</label>`);
      document.getElementById("o-sa").addEventListener("change", (e) => (show.async = e.target.checked));
      document.getElementById("o-sr").addEventListener("change", (e) => (show.rock = e.target.checked));
      api.real.hidden = false;
      api.real.innerHTML = `<span class="lp-k">Try this</span><p>Set 1 jump at 60°: the advance then lasts exactly two slider spacings, the asynchrony ripple vanishes, and only the rocking remains. Then 2 jumps at 32°: the rocking vanishes instead. Change the number of sliders to 11 with 2 jumps: opposite sliders no longer exist, and the rocking returns.</p>`;
      frame = (dt) => { stepCap(m, dt); const s = stats(m);
        c.clearRect(0, 0, W, H); bg(); drawCam(m, 16, 14, 470, 178); drawSection(m, 586, 110, 62); statBox(m, s, 700, 14, 244);
        drawSide(m, 470, 345, m.R * 14, t * 8);
        k.text(c, `mean thrust ≈ ${FN.toFixed(2)} N × Δd · Δd = ${deltaD(m).toFixed(2)} → ${(FN * deltaD(m)).toFixed(2)} N`, W / 2, 470, "700 15px Roboto Mono, monospace", C.ink, "center");
        k.text(c, "* cam speed illustrative: thrust does not depend on it", W - 16, 530, "11px Roboto, sans-serif", C.ink3, "right");
        drawPlot(m, show); };
    }
    raf = requestAnimationFrame(loop);
    return () => { alive = false; cancelAnimationFrame(raf); off.forEach((f) => f()); api.hideCard(); };
  };
})();
