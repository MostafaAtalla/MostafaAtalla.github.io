/* Lab game 1 · The squeeze-film lab (Glide).
   Game: three levels. 1 Carry the cup (stick-slip vs glide), 2 Levitate (incompressible
   squeeze-film levitation, Eq. 14 of the APL 2023 paper), 3 Glide, then grip (variable-friction
   catheter). Explore: stick-slip bench and levitation bench with live plots.
   Friction reductions from the papers: rigid dry ~80%, rigid wet ~60%, ex-vivo aorta ~38%. */
(function () {
  window.LabGames = window.LabGames || {};
  const TAU = Math.PI * 2;
  // ---- levitation law, APL 2023 Eq. (14): h = pi R^2 a w U sqrt(rho / (m g)), U = sqrt((20 - 2.2 Ce) / 56)
  const LEV = { R: 0.01, rho: 1030, w: TAU * 40e3, Ce: 9, g: 9.81 };
  LEV.U = Math.sqrt((20 - 2.2 * LEV.Ce) / 56);
  // Eq. (14) fixes the scaling h ∝ α/√m. Its prefactor depends on (20 − 2.2·Ce) with Ce ≈ 9, a near-cancellation
  // too sensitive to use directly, so the prefactor is set to the measured range of Fig. 3 (tens of µm for α = 1–3 µm).
  const K_LEV = 75; // µm per (µm · g^-1/2): ~28 µm at 3 µm, 64 g
  const hbar = (aUm, mG) => K_LEV * aUm / Math.sqrt(mG); // µm
  const SURF = { dry: { name: "Rigid, dry", red: 0.8 }, wet: { name: "Rigid, wet", red: 0.6 }, tissue: { name: "Soft tissue (aorta)", red: 0.38 } };

  // ---- drawing helpers ----
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
  const waves = (c, x, y, w, t, col) => { c.strokeStyle = col; c.lineWidth = 2; for (let k = 0; k < 3; k++) { const a = (t * 2.2 + k / 3) % 1; c.globalAlpha = 1 - a; c.beginPath(); c.ellipse(x, y, w * (0.35 + a * 0.5), 3 + a * 10, 0, 0, Math.PI); c.stroke(); } c.globalAlpha = 1; };
  const text = (c, s, x, y, font, col, align) => { c.font = font; c.fillStyle = col; c.textAlign = align || "left"; c.fillText(s, x, y); c.textAlign = "left"; };
  const plotLine = (p, arr, W, PH, lo, hi, col, label, C, extra) => {
    p.clearRect(0, 0, W, PH); p.fillStyle = C.dark ? "#101D31" : "#F1F4F8"; rr(p, 0, 0, W, PH, 12); p.fill();
    p.strokeStyle = C.rule; p.lineWidth = 1; for (let k = 0; k <= 4; k++) { const y = 14 + (PH - 32) * k / 4; p.beginPath(); p.moveTo(48, y); p.lineTo(W - 12, y); p.stroke(); }
    text(p, label, 56, PH - 6, "11px Roboto Mono, monospace", C.ink3);
    if (extra) extra(p);
    p.strokeStyle = col; p.lineWidth = 2; p.beginPath();
    arr.forEach((v, i) => { const x = 48 + (i / Math.max(1, arr.length - 1)) * (W - 60), y = 14 + (PH - 32) * (1 - (v - lo) / (hi - lo)); i ? p.lineTo(x, y) : p.moveTo(x, y); }); p.stroke();
  };

  window.LabGames.glide = (api, mode) => {
    const { ctx: c, W, H, plot: P, PH } = api;
    let C = api.colors(), raf = 0, last = performance.now(), t = 0, alive = true;
    const keys = {}, off = [];
    const on = (el, ev, f, o) => { el.addEventListener(ev, f, o); off.push(() => el.removeEventListener(ev, f, o)); };
    on(window, "keydown", (e) => { if (["Space", "ArrowLeft", "ArrowRight", "KeyU"].includes(e.code) && document.activeElement?.tagName !== "INPUT") e.preventDefault(); keys[e.code] = true; if (e.code === "KeyU") toggleUS(); });
    on(window, "keyup", (e) => { keys[e.code] = false; });
    on(document, "themechange", () => (C = api.colors()));
    let holding = false;
    on(api.canvas, "pointerdown", () => (holding = true)); on(window, "pointerup", () => (holding = false));
    const ctrl = (html) => { api.controls.innerHTML = html; };
    let usOn = false, usLocked = false, toggleUS = () => {};
    const usBtn = () => `<button class="lab-us${usOn ? " on" : ""}" id="g-us" ${usLocked ? "disabled" : ""} type="button" aria-pressed="${usOn}"><span class="dot"></span>${usLocked ? "🔒 Ultrasound locked for this run" : `Ultrasound ${usOn ? "ON" : "OFF"}`} <kbd>U</kbd></button>`;
    const bindUS = () => { const b = document.getElementById("g-us"); toggleUS = () => { if (usLocked) return; usOn = !usOn; if (b) { b.classList.toggle("on", usOn); b.setAttribute("aria-pressed", usOn); b.innerHTML = `<span class="dot"></span>Ultrasound ${usOn ? "ON" : "OFF"} <kbd>U</kbd>`; } }; b?.addEventListener("click", () => toggleUS()); };
    const holdBtn = (id, label) => { const b = document.getElementById(id); if (!b) return; const d = (e) => { e.preventDefault(); holding = true; b.classList.add("down"); }, u = () => { holding = false; b.classList.remove("down"); };
      b.addEventListener("pointerdown", d); b.addEventListener("pointerup", u); b.addEventListener("pointerleave", u); };
    const pressed = () => holding || keys.Space;

    // ------------------------------------------------------------------ scenes
    // stick-slip sled with a cup (level 1 and explore)
    const sled = () => ({ xb: 120, vb: 0, xh: 270, stuck: true, water: 1, drops: [], F: [], a: 0, acc: 0, slips: 0 });
    const PX = 1600, M = 0.12, K = 7, MUS = 0.62, MUK = 0.38;
    const sledStep = (s, dt, red, pulling, vHand) => {
      const muK = MUK * (1 - red), muS = muK + (MUS - MUK) * (1 - red) ** 2;
      for (let i = 0; i < 16; i++) {
        const h = dt / 16; if (pulling) s.xh += vHand * h;
        const Fs = K * (s.xh - s.xb - 150) / PX; let a = 0;
        if (s.stuck) { if (Math.abs(Fs) > muS * M * 9.81) { s.stuck = false; s.slips++; } else s.vb = 0; }
        if (!s.stuck) { const fr = -Math.sign(s.vb || Fs) * muK * M * 9.81; a = (Fs + fr) / M - 0.4 * s.vb; const v0 = s.vb; s.vb += a * h; if (v0 > 0 && s.vb <= 0) { s.vb = 0; s.stuck = true; } s.xb += s.vb * PX * h; }
        s.a = a; s.acc = s.acc * 0.92 + Math.abs(a) * 0.08;
      }
      s.F.push(K * (s.xh - s.xb - 150) / PX); if (s.F.length > 300) s.F.shift();
    };
    const spill = (s, dt) => { if (s.acc > 1.4 && s.water > 0) { const loss = (s.acc - 1.4) * 0.05 * dt * 10; s.water = Math.max(0, s.water - loss); if (Math.random() < 0.6) for (let k = 0; k < 2; k++) s.drops.push({ x: s.xb + 30, y: 300, vx: 60 + Math.random() * 80, vy: -60 - Math.random() * 60 }); }
      s.drops.forEach((d) => { d.vy += 500 * dt; d.x += d.vx * dt; d.y += d.vy * dt; }); s.drops = s.drops.filter((d) => d.y < 420); };
    const drawBench = (s, bay, us, surface) => {
      const fy = 420;
      const bg = c.createLinearGradient(0, 0, 0, fy); bg.addColorStop(0, C.dark ? "#13223A" : "#EAF1F8"); bg.addColorStop(1, C.dark ? "#1B2D49" : "#DCE6F1"); c.fillStyle = bg; c.fillRect(0, 0, W, fy);
      // workshop wall: pegboard dots
      c.fillStyle = C.dark ? "#22385A" : "#C9D6E6"; for (let y = 30; y < fy - 40; y += 28) for (let x = 20; x < W; x += 28) { c.beginPath(); c.arc(x, y, 2, 0, TAU); c.fill(); }
      // floor
      const fl = c.createLinearGradient(0, fy, 0, H); fl.addColorStop(0, surface === "tissue" ? "#E9A9A2" : C.dark ? "#5B4A3A" : "#C9A67C"); fl.addColorStop(1, surface === "tissue" ? "#C77A73" : C.dark ? "#3E3125" : "#A9845A"); c.fillStyle = fl; c.fillRect(0, fy, W, H - fy);
      c.strokeStyle = C.dark ? "#2C2219" : "#8C6A44"; c.lineWidth = 1.4; c.beginPath(); for (let x = 0; x <= W; x += 7) c.lineTo(x, fy + ((x / 7) % 2 ? 4 : 0)); c.stroke();
      if (surface !== "tissue") { c.strokeStyle = "rgba(0,0,0,.08)"; for (let x = 40; x < W; x += 120) { c.beginPath(); c.moveTo(x, fy + 6); c.lineTo(x, H); c.stroke(); } }
      if (bay) { c.fillStyle = "rgba(94,209,200,.25)"; c.fillRect(bay, fy - 150, 110, 150); c.strokeStyle = C.teal; c.setLineDash([6, 6]); c.lineWidth = 2; c.strokeRect(bay, fy - 150, 110, 150); c.setLineDash([]); text(c, "DELIVERY BAY", bay + 55, fy - 160, "600 13px Roboto, sans-serif", C.teal, "center"); }
      // spring and hand
      const by = fy - 56, bx = s.xb;
      c.strokeStyle = C.ink2; c.lineWidth = 2.4; c.beginPath(); c.moveTo(bx + 90, by + 26); const L = s.xh - (bx + 90);
      for (let i = 0; i <= 14; i++) c.lineTo(bx + 90 + (L * i) / 14, by + 26 + (i % 2 ? -10 : 10) * (i && i < 14 ? 1 : 0)); c.stroke();
      c.fillStyle = C.coral; c.beginPath(); c.arc(s.xh + 8, by + 26, 15, 0, TAU); c.fill(); text(c, "✋", s.xh + 8, by + 32, "16px serif", "#fff", "center");
      // sled body
      const g = c.createLinearGradient(0, by, 0, by + 52); g.addColorStop(0, "#5B7DAA"); g.addColorStop(1, "#2C4566"); rr(c, bx, by, 90, 52, 10); c.fillStyle = g; c.fill();
      c.fillStyle = "rgba(255,255,255,.18)"; rr(c, bx + 6, by + 6, 78, 10, 5); c.fill();
      c.fillStyle = "#1A2B44"; rr(c, bx + 8, by + 46, 74, 8, 3); c.fill(); // piezo pad
      if (us) waves(c, bx + 45, fy + 2, 46, t, C.teal);
      // cup
      if (s.water != null) {
        const cx = bx + 22, cy = by - 64;
        const cupPath = () => { c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + 46, cy); c.lineTo(cx + 41, cy + 62); c.lineTo(cx + 5, cy + 62); c.closePath(); };
        c.save(); cupPath(); c.clip(); const wl = cy + 62 - 54 * s.water, tilt = Math.max(-14, Math.min(14, -s.a * 2.5));
        c.fillStyle = "#4FA3E0"; c.beginPath(); c.moveTo(cx - 4, wl - tilt); c.lineTo(cx + 50, wl + tilt); c.lineTo(cx + 50, cy + 70); c.lineTo(cx - 4, cy + 70); c.fill(); c.restore();
        cupPath(); c.strokeStyle = C.dark ? "#C9D6E6" : "#55657A"; c.lineWidth = 2; c.stroke(); c.fillStyle = "rgba(255,255,255,.18)"; c.fill();
        c.fillStyle = "#4FA3E0"; s.drops.forEach((d) => { c.beginPath(); c.arc(d.x, d.y, 3, 0, TAU); c.fill(); });
      }
      text(c, s.stuck ? "STICK" : "SLIP", bx + 45, by + 33, "700 13px Roboto Mono, monospace", "#fff", "center");
    };

    // levitation bench (level 2 and explore)
    const lev = () => ({ a: 1.2, m: 64, h: 0, show: 0 });
    const SCALE = 9; // px per µm
    const drawLev = (L, band) => {
      const base = 430, x0 = W / 2 - 180;
      const bg = c.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, C.dark ? "#0F1B2E" : "#EEF3F9"); bg.addColorStop(1, C.dark ? "#152742" : "#DDE7F2"); c.fillStyle = bg; c.fillRect(0, 0, W, H);
      // ruler
      for (let um = 0; um <= 35; um += 5) { const y = base - um * SCALE; c.strokeStyle = C.rule; c.lineWidth = 1; c.beginPath(); c.moveTo(x0 - 70, y); c.lineTo(x0 + 430, y); c.stroke(); text(c, `${um} µm`, x0 - 78, y + 4, "11px Roboto Mono, monospace", C.ink3, "right"); }
      if (band) { const y1 = base - band[1] * SCALE, y0 = base - band[0] * SCALE; c.fillStyle = "rgba(94,209,200,.22)"; c.fillRect(x0 - 70, y1, 500, y0 - y1); c.strokeStyle = C.teal; c.setLineDash([6, 5]); c.strokeRect(x0 - 70, y1, 500, y0 - y1); c.setLineDash([]); text(c, "TARGET GAP", x0 + 438, (y0 + y1) / 2 + 4, "600 12px Roboto, sans-serif", C.teal); }
      // vibrating plate (piezo stack)
      const vib = Math.sin(t * 60) * Math.min(3, L.a) * 0.6;
      c.fillStyle = "#2C4566"; rr(c, x0, base + vib, 360, 26, 6); c.fill(); c.fillStyle = C.gold; rr(c, x0 + 20, base + 26, 320, 34, 4); c.fill();
      text(c, "PIEZO · 40 kHz", x0 + 180, base + 49, "700 12px Roboto Mono, monospace", "#4A3A00", "center");
      if (L.a > 0.05) waves(c, x0 + 180, base - 2, 170, t, C.teal);
      // liquid film between plate and disc
      const dy = base - L.h * SCALE - 30 + Math.sin(t * 60 + 1.5) * 0.4;
      c.fillStyle = "rgba(79,163,224,.45)"; c.fillRect(x0 + 40, dy + 30, 280, base - dy - 30 + vib);
      // disc (reflector) with mass tag
      const g = c.createLinearGradient(0, dy, 0, dy + 30); g.addColorStop(0, "#E6ECF2"); g.addColorStop(1, "#8D9AAB"); rr(c, x0 + 40, dy, 280, 30, 8); c.fillStyle = g; c.fill();
      c.fillStyle = C.coral; rr(c, x0 + 140, dy - 40, 80, 40, 6); c.fill(); text(c, `${L.m} g`, x0 + 180, dy - 14, "700 16px Roboto, sans-serif", "#fff", "center");
      // readout
      text(c, `gap ${L.h.toFixed(1)} µm`, x0 + 340, dy + 20, "600 14px Roboto Mono, monospace", C.ink);
      text(c, `amplitude ${L.a.toFixed(2)} µm`, 30, 40, "600 15px Roboto, sans-serif", C.ink);
    };
    const drawPressure = (L) => {
      P.clearRect(0, 0, W, PH); P.fillStyle = C.dark ? "#101D31" : "#F1F4F8"; rr(P, 0, 0, W, PH, 12); P.fill();
      const mid = PH / 2 + 6, x0 = 60, w = W - 300, amp = Math.min(1, L.a / 2.5) * 46, asym = 0.42;
      P.strokeStyle = C.rule; P.beginPath(); P.moveTo(x0, mid); P.lineTo(x0 + w, mid); P.stroke();
      const curve = (f, col, dash) => { P.strokeStyle = col; P.setLineDash(dash || []); P.lineWidth = 2; P.beginPath(); for (let i = 0; i <= 200; i++) { const ph = (i / 200) * TAU * 2, x = x0 + (i / 200) * w, y = mid - amp * f(ph); i ? P.lineTo(x, y) : P.moveTo(x, y); } P.stroke(); P.setLineDash([]); };
      curve((ph) => Math.sin(ph), C.ink3, [5, 5]);
      curve((ph) => Math.sin(ph) + asym * (1 - Math.cos(2 * ph)), C.coral);
      P.fillStyle = "rgba(217,80,46,.15)"; P.fillRect(x0, mid - amp * asym, w, amp * asym);
      text(P, "film pressure over two vibration cycles", x0, 16, "600 12px Roboto, sans-serif", C.ink2);
      text(P, "– – viscous only: averages to zero", x0 + w + 16, mid - 18, "12px Roboto, sans-serif", C.ink3);
      text(P, "—  liquid inertia: net push up", x0 + w + 16, mid + 2, "600 12px Roboto, sans-serif", C.coral);
      text(P, "▒  time-averaged lift", x0 + w + 16, mid + 22, "12px Roboto, sans-serif", C.coral);
    };

    // catheter bench (level 3)
    const cath = (surface) => ({ x: 0, v: 0, stuck: true, surface, target: 120 + Math.random() * 30, hold: 0, done: false, F: [], time: 0 });
    const MM = 4; // px per mm
    const cathStep = (s, dt, us, push) => {
      const red = us ? SURF[s.surface].red : 0, Mc = 0.05, N = 0.5, c0 = 5;
      const muS = 0.9 * (1 - red) * (us ? 0.65 : 1), muK = 0.6 * (1 - red);
      const heart = 0.2 * Math.max(0, Math.sin(t * TAU * 1.2)) ** 3 - 0.06;
      for (let i = 0; i < 10; i++) {
        const h = dt / 10, F = (push ? 0.3 : 0) + heart;
        if (s.stuck) { if (Math.abs(F) > muS * N) s.stuck = false; else s.v = 0; }
        if (!s.stuck) { const a = (F - Math.sign(s.v || F) * muK * N - c0 * s.v) / Mc; const v0 = s.v; s.v += a * h; if (v0 !== 0 && Math.sign(v0) !== Math.sign(s.v) && Math.abs(F) <= muS * N) { s.v = 0; s.stuck = true; } s.x += s.v * 1000 * h; }
      }
      s.F.push(s.v * 1000); if (s.F.length > 300) s.F.shift();
    };
    const drawCath = (s, us) => {
      const cy = 280, x0 = 80, tipX = x0 + 180 + s.x * MM, beat = Math.max(0, Math.sin(t * TAU * 1.2)) ** 3;
      c.fillStyle = C.dark ? "#2A1620" : "#FBE6E3"; c.fillRect(0, 0, W, H);
      const wall = (y, dir) => { const g = c.createLinearGradient(0, y, 0, y + dir * 90); g.addColorStop(0, C.dark ? "#8A3442" : "#E59A97"); g.addColorStop(1, C.dark ? "#4A1C26" : "#F4C6C2"); c.fillStyle = g; c.beginPath(); c.moveTo(0, y); for (let x = 0; x <= W; x += 10) c.lineTo(x, y + dir * (3 * Math.sin(x / 40 + t) + beat * 6)); c.lineTo(W, y + dir * 140); c.lineTo(0, y + dir * 140); c.fill(); };
      wall(cy - 54, -1); wall(cy + 54, 1);
      c.fillStyle = C.dark ? "#3B1D28" : "#FFF4F2"; c.fillRect(0, cy - 54, W, 108);
      // flow arrows
      c.fillStyle = C.dark ? "rgba(255,138,101,.35)" : "rgba(217,80,46,.25)"; for (let k = 0; k < 6; k++) { const x = ((t * 120 + k * 170) % (W + 100)) - 50; text(c, "›", x, cy - 30 + (k % 3) * 30, "26px serif", c.fillStyle); }
      // lesion and window
      const lx = x0 + 180 + s.target * MM; c.fillStyle = "rgba(242,178,39,.5)"; rr(c, lx - 22, cy - 54, 44, 18, 8); c.fill(); rr(c, lx - 22, cy + 36, 44, 18, 8); c.fill();
      c.strokeStyle = C.gold; c.setLineDash([5, 5]); c.lineWidth = 2; c.beginPath(); c.moveTo(lx - 3 * MM, cy - 64); c.lineTo(lx - 3 * MM, cy + 64); c.moveTo(lx + 3 * MM, cy - 64); c.lineTo(lx + 3 * MM, cy + 64); c.stroke(); c.setLineDash([]);
      text(c, "LESION · stop here ±3 mm", lx, cy - 74, "600 13px Roboto, sans-serif", C.dark ? "#FFC94D" : "#8A5A00", "center");
      // catheter shaft and module
      c.strokeStyle = C.dark ? "#CFE0F5" : "#1E3A5F"; c.lineWidth = 12; c.lineCap = "round"; c.beginPath(); c.moveTo(-10, cy); c.lineTo(tipX - 14, cy); c.stroke();
      c.fillStyle = C.gold; rr(c, tipX - 46, cy - 12, 26, 24, 6); c.fill(); text(c, "US", tipX - 33, cy + 4, "700 10px Roboto Mono, monospace", "#4A3A00", "center");
      if (us) { c.save(); c.translate(tipX - 33, cy + 10); waves(c, 0, 0, 24, t, C.teal); c.restore(); c.save(); c.translate(tipX - 33, cy - 10); c.scale(1, -1); waves(c, 0, 0, 24, t, C.teal); c.restore(); }
      c.fillStyle = C.coral; c.beginPath(); c.arc(tipX, cy, 8, 0, TAU); c.fill();
      text(c, `♥ ${Math.round(72)} bpm`, W - 120, 40, `${16 + beat * 4}px Roboto, sans-serif`, C.coral);
      text(c, `${SURF[s.surface].name} · friction −${Math.round(SURF[s.surface].red * 100)}% with ultrasound`, 24, 40, "600 14px Roboto, sans-serif", C.ink);
      text(c, `tip error ${((s.x - s.target)).toFixed(1)} mm`, 24, H - 30, "600 14px Roboto Mono, monospace", Math.abs(s.x - s.target) <= 3 ? C.teal : C.ink2);
      return lx;
    };

    // ------------------------------------------------------------------ game mode
    const real = () => {};
    let frame = () => {};
    const loop = (now) => { if (!alive) return; const dt = Math.min((now - last) / 1000, 0.04); last = now; t += dt; frame(dt); raf = requestAnimationFrame(loop); };

    if (mode === "game") {
      real(`<p>Friction reductions come from the papers: up to ~80% on rigid dry surfaces, ~60% wet, ~38% on ex-vivo aorta. The levitation height follows Eq. (14) of the APL paper with its fitted values. Spill, heartbeat load and pulling force are illustrative.</p>`);
      const results = [];
      const levels = [
        { intro: `<span class="lp-k">Level 1 of 3 · Stick-slip</span><h3>Carry the cup</h3><p>Pull the sled to the delivery bay without spilling. Hold <b>Hold to pull</b> (or Space, or press on the scene). The spring stretches until static friction gives way, then the sled jumps.</p><p class="muted">First run: ultrasound locked.</p>`, run: levelCup },
        { intro: `<span class="lp-k">Level 2 of 3 · Squeeze film</span><h3>Levitate the disc</h3><p>A plate vibrating at 40 kHz under a liquid film lifts a free disc. In a liquid, the film's inertia makes the squeeze and release halves of each cycle unequal, and the difference pushes the disc up.</p><p>Set the amplitude (slider or ← →) to keep the disc in the target gap as its mass changes: 64, 122 and 101 g, the masses of the paper.</p>`, run: levelLev },
        { intro: `<span class="lp-k">Level 3 of 3 · Variable friction</span><h3>Glide, then grip</h3><p>Advance the catheter to the lesion and stop within ±3 mm. Without ultrasound it will not move. With it, it glides, but the beating heart then pushes it off target. Switch the ultrasound off to make it grip, and hold still for 1.5 s.</p><p class="muted">Round 1: calcified wall (−80%). Round 2: soft aortic tissue (−38%).</p>`, run: levelCath }
      ];
      (async () => {
        for (let i = 0; i < levels.length && alive; i++) { await api.card(levels[i].intro, [{ label: "Start" }]); if (!alive) return; results[i] = await levels[i].run(); }
        if (!alive) return;
        const total = Math.round(results.reduce((a, b) => a + b, 0) / 3);
        const nb = api.best(total, `${total} / 100`);
        api.log("game", "total", { score: total, l1: results[0], l2: results[1], l3: results[2] });
        const again = await api.card(`<span class="lp-k">Debrief</span><h3>${total} / 100${nb ? " · new best" : ""}</h3>
          <ul class="ls-res"><li>Carry the cup <b>${results[0]}</b></li><li>Levitate the disc <b>${results[1]}</b></li><li>Glide, then grip <b>${results[2]}</b></li></ul>
          <p>A surface vibrating a few micrometres at ultrasonic frequency squeezes the film between the surfaces faster than it can escape. The film carries part of the load, so friction drops while the vibration runs and returns the moment it stops. That switch is what lets a catheter glide through a vessel and then hold still where the work is done.</p>`, [{ label: "Play again" }, { label: "Explore mode" }]);
        if (!alive) return; if (again === 1) document.querySelector('.ls-modes [data-m="explore"]')?.click(); else document.querySelector('.ls-modes [data-m="game"]')?.click();
      })();

      function levelCup() {
        return new Promise(async (done) => {
          const scores = [];
          for (let attempt = 1; attempt <= 2 && alive; attempt++) {
            usLocked = attempt === 1; usOn = false;
            ctrl(`<button class="lab-hold" id="g-hold" type="button">✋ Hold to pull <kbd>Space</kbd></button>${usBtn()}<span class="lab-note">Run ${attempt} of 2</span>`); bindUS(); holdBtn("g-hold");
            const s = sled(); const bay = 760;
            const score = await new Promise((res) => {
              frame = (dt) => {
                sledStep(s, dt, usOn ? SURF.dry.red : 0, pressed(), 95); spill(s, dt);
                c.clearRect(0, 0, W, H); drawBench(s, bay, usOn, "dry");
                text(c, `Cup ${Math.round(s.water * 100)}% full`, 24, 40, "700 18px Roboto, sans-serif", C.ink); text(c, `slips ${s.slips}`, 24, 64, "13px Roboto Mono, monospace", C.ink3);
                plotLine(P, s.F, W, PH, -0.1, 1, C.coral, "pull force in the spring (N) · each saw-tooth is one stick-slip jump", C);
                if (s.xb >= bay + 10 || s.water <= 0.02) { frame = () => {}; res(Math.round(s.water * 100)); }
              };
            });
            scores.push(score);
            api.log("game", "L1", { attempt, score, us: attempt === 2 ? 1 : 0, slips: s.slips });
            if (attempt === 1) await api.card(`<h3>${score}% of the water left</h3><p>Each jump is the spring releasing what static friction held back. Now the ultrasound is yours: switch it on with <b>U</b> and pull again.</p>`, [{ label: "Run 2: with ultrasound" }]);
          }
          await api.card(`<h3>Without ultrasound ${scores[0]}% · with ${scores[1]}%</h3><p>With the vibration on, static and kinetic friction come close together, so the spring never stores a jump: the sled glides.</p>`, [{ label: "Next level" }]);
          done(Math.max(scores[0], scores[1]));
        });
      }
      function levelLev() {
        return new Promise((done) => {
          ctrl(`<label class="lab-range">Vibration amplitude <input type="range" id="g-amp" min="0" max="3" step="0.01" value="1.2"><output id="g-amp-o">1.20 µm</output></label><span class="lab-note">← → to adjust</span>`);
          const L = lev(), inp = document.getElementById("g-amp"), out = document.getElementById("g-amp-o");
          inp.addEventListener("input", () => { L.a = +inp.value; out.textContent = L.a.toFixed(2) + " µm"; });
          const seq = [{ m: 64, a: 1.0 + Math.random() * 1.2 }, { m: 122, a: 1.4 + Math.random() * 1.2 }, { m: 101, a: 0.8 + Math.random() * 1.4 }];
          let T = 0, inBand = 0; const DUR = 24;
          frame = (dt) => {
            T += dt; const seg = seq[Math.min(2, Math.floor(T / 8))]; L.m = seg.m;
            if (keys.ArrowLeft) { L.a = Math.max(0, L.a - dt * 0.8); inp.value = L.a; out.textContent = L.a.toFixed(2) + " µm"; }
            if (keys.ArrowRight) { L.a = Math.min(3, L.a + dt * 0.8); inp.value = L.a; out.textContent = L.a.toFixed(2) + " µm"; }
            const target = hbar(seg.a, seg.m), band = [target * 0.9, target * 1.1];
            L.h += (hbar(L.a, L.m) - L.h) * Math.min(1, dt / 0.5);
            const ok = L.h >= band[0] && L.h <= band[1]; if (ok) inBand += dt;
            c.clearRect(0, 0, W, H); drawLev(L, band); drawPressure(L);
            text(c, `in target ${Math.round((inBand / DUR) * 100)}%`, W - 30, 40, "700 18px Roboto, sans-serif", ok ? C.teal : C.ink2, "right");
            text(c, `${Math.max(0, Math.ceil(DUR - T))} s`, W - 30, 64, "13px Roboto Mono, monospace", C.ink3, "right");
            if (T >= DUR) { frame = () => {}; const score = Math.round((inBand / DUR) * 100); api.log("game", "L2", { score });
              api.card(`<h3>${score}% of the time in the gap</h3><p>The height grows with amplitude and falls as 1/√m, the scaling of Eq. (14) of the paper, h̄ = πR²αωU√(ρ/mg). A heavier disc needs a stronger vibration for the same gap.</p>`, [{ label: "Next level" }]).then(() => done(score)); }
          };
        });
      }
      function levelCath() {
        return new Promise(async (done) => {
          const sc = [];
          for (const surface of ["dry", "tissue"]) {
            if (!alive) return; usLocked = false; usOn = false;
            ctrl(`<button class="lab-hold" id="g-hold" type="button">➜ Hold to push <kbd>Space</kbd></button>${usBtn()}<span class="lab-note">${surface === "dry" ? "Round 1 · calcified wall" : "Round 2 · soft tissue"}</span>`); bindUS(); holdBtn("g-hold");
            const s = cath(surface === "dry" ? "dry" : "tissue"); let T = 0;
            const score = await new Promise((res) => {
              frame = (dt) => {
                T += dt; cathStep(s, dt, usOn, pressed());
                c.clearRect(0, 0, W, H); drawCath(s, usOn);
                const err = Math.abs(s.x - s.target), inWin = err <= 3 && Math.abs(s.v) < 0.002;
                s.hold = inWin ? s.hold + dt : 0;
                if (s.hold > 0) { c.fillStyle = C.teal; rr(c, W / 2 - 100, 84, 200 * Math.min(1, s.hold / 1.5), 10, 5); c.fill(); text(c, "holding…", W / 2, 76, "600 13px Roboto, sans-serif", C.teal, "center"); }
                plotLine(P, s.F, W, PH, -40, 60, C.blue, "tip speed (mm/s) · the bumps are the heartbeat", C);
                if (s.hold >= 1.5 || T > 30 || s.x > s.target + 40) { frame = () => {}; res(Math.max(0, Math.round(100 - err * 12 - Math.max(0, T - 8) * 1.5))); }
              };
            });
            sc.push(score); api.log("game", "L3", { surface, score });
          }
          await api.card(`<h3>Calcified ${sc[0]} · soft tissue ${sc[1]}</h3><p>Ultrasound lowers friction for navigation; switching it off restores grip so the tip holds against the heartbeat. On soft tissue the reduction is smaller (about 38% on ex-vivo aorta), so the glide is slower.</p>`, [{ label: "See the debrief" }]);
          done(Math.round((sc[0] + sc[1]) / 2));
        });
      }
    }

    // ------------------------------------------------------------------ explore mode
    if (mode === "explore") {
      let scene = "slip";
      const s = sled(); s.water = null; s.xb = 100; s.xh = 250; let pulling = true, amp = 0.7, surface = "dry", dragging = false;
      const L = lev();
      const build = () => {
        ctrl(`<div class="lab-seg" role="tablist"><button data-s="slip" aria-selected="${scene === "slip"}">Stick-slip bench</button><button data-s="lev" aria-selected="${scene === "lev"}">Levitation bench</button></div>` +
          (scene === "slip"
            ? `${usBtn()}<label class="lab-range">Amplitude <input type="range" id="x-amp" min="0" max="1" step="0.01" value="${amp}"></label>
               <label class="lab-select">Surface <select id="x-surf">${Object.entries(SURF).map(([k, v]) => `<option value="${k}"${k === surface ? " selected" : ""}>${v.name} (−${Math.round(v.red * 100)}%)</option>`).join("")}</select></label>
               <button class="btn ghost small-btn" id="x-pull" type="button">${pulling ? "Pause pull" : "Resume pull"}</button><button class="btn ghost small-btn" id="x-reset" type="button">Reset</button><span class="lab-note">Drag the hand to pull it yourself</span>`
            : `<label class="lab-range">Amplitude <input type="range" id="x-a" min="0" max="3" step="0.01" value="${L.a}"><output id="x-a-o">${L.a.toFixed(2)} µm</output></label>
               <label class="lab-select">Disc mass <select id="x-m">${[64, 101, 122].map((m) => `<option${m === L.m ? " selected" : ""}>${m}</option>`).join("")}</select> g</label>`));
        api.controls.querySelectorAll(".lab-seg button").forEach((b) => b.addEventListener("click", () => { scene = b.dataset.s; build(); }));
        if (scene === "slip") {
          bindUS(); const ai = document.getElementById("x-amp"); ai.addEventListener("input", () => (amp = +ai.value));
          document.getElementById("x-surf").addEventListener("change", (e) => (surface = e.target.value));
          document.getElementById("x-pull").addEventListener("click", (e) => { pulling = !pulling; e.target.textContent = pulling ? "Pause pull" : "Resume pull"; });
          document.getElementById("x-reset").addEventListener("click", () => { Object.assign(s, sled(), { water: null, xb: 100, xh: 250 }); });
          real(`<p>Coulomb friction with static and kinetic coefficients; the ultrasound lowers both and brings them together, scaled by amplitude and by the reduction measured on each surface (papers: ~80% rigid dry, ~60% wet, ~38% aorta). Spring and mass are illustrative.</p>`);
        } else {
          const ai = document.getElementById("x-a"), ao = document.getElementById("x-a-o"); ai.addEventListener("input", () => { L.a = +ai.value; ao.textContent = L.a.toFixed(2) + " µm"; });
          document.getElementById("x-m").addEventListener("change", (e) => (L.m = +e.target.value));
          real(`<p>Steady levitation height from Eq. (14) of the APL paper, h̄ = πR²αωU√(ρ/mg), U = √((20 − 2.2C_e)/56), with R = 10 mm, ρ = 1030 kg/m³, C_e ≈ 9, 40 kHz. The pressure trace is a schematic of the mechanism, not a solution of the film equations.</p>`);
        }
      };
      build();
      const toX = (e) => { const r = api.canvas.getBoundingClientRect(); return ((e.clientX - r.left) / r.width) * W; };
      on(api.canvas, "pointerdown", (e) => { if (scene === "slip" && Math.abs(toX(e) - (s.xh + 8)) < 40) { dragging = true; api.canvas.setPointerCapture(e.pointerId); } });
      on(api.canvas, "pointermove", (e) => { if (dragging) s.xh = Math.max(s.xb + 120, toX(e) - 8); });
      on(window, "pointerup", () => (dragging = false));
      frame = (dt) => {
        c.clearRect(0, 0, W, H);
        if (scene === "slip") {
          sledStep(s, dt, usOn ? SURF[surface].red * amp : 0, pulling && !dragging, 70);
          if (s.xb > W - 180) { const sh = s.xb - 100; s.xb -= sh; s.xh -= sh; }
          drawBench(s, 0, usOn, surface === "tissue" ? "tissue" : "dry");
          const muK = MUK * (1 - (usOn ? SURF[surface].red * amp : 0));
          text(c, `${s.stuck ? "Sticking" : "Sliding"} · μk ${muK.toFixed(2)} · slips ${s.slips}`, 24, 40, "600 15px Roboto, sans-serif", C.ink);
          plotLine(P, s.F, W, PH, -0.1, 1, C.coral, "pull force in the spring (N), last 5 s", C);
        } else {
          L.h += (hbar(L.a, L.m) - L.h) * Math.min(1, dt / 0.5); drawLev(L, null);
          // curves of h̄ against amplitude for the three masses, with the current point
          P.clearRect(0, 0, W, PH); P.fillStyle = C.dark ? "#101D31" : "#F1F4F8"; rr(P, 0, 0, W, PH, 12); P.fill();
          const px = (a) => 60 + (a / 3) * (W - 260), py = (h) => PH - 24 - (h / 35) * (PH - 40);
          [[64, C.coral], [101, C.gold], [122, C.blue]].forEach(([m, col]) => { P.strokeStyle = col; P.lineWidth = 2; P.beginPath(); for (let a = 0; a <= 3.001; a += 0.05) { const x = px(a), y = py(Math.min(35, hbar(a, m))); a ? P.lineTo(x, y) : P.moveTo(x, y); } P.stroke(); text(P, `${m} g`, px(3) + 8, py(Math.min(35, hbar(3, m))) + 4 + (m === 101 ? -6 : m === 122 ? 8 : 0), "600 12px Roboto, sans-serif", col); });
          P.fillStyle = C.ink; P.beginPath(); P.arc(px(L.a), py(Math.min(35, hbar(L.a, L.m))), 5, 0, TAU); P.fill();
          text(P, "levitation height (µm) against amplitude (0–3 µm): h̄ ∝ α/√m, Eq. (14)", 60, 16, "600 12px Roboto, sans-serif", C.ink2);
        }
      };
    }
    raf = requestAnimationFrame(loop);
    return () => { alive = false; cancelAnimationFrame(raf); off.forEach((f) => f()); api.hideCard(); };
  };
})();
