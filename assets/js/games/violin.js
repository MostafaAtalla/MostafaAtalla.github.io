/* Lab tutorial A · The violinist's secret (grip and slip).
   The bow grips the string and drags it along (stick), until the string's tension beats static
   friction and it slips back (slip): stick-slip, repeated hundreds of times a second, is the note.
   A clean note exists only between a minimum and a maximum bow force for a given bow speed and
   bow position (Schelleng 1973): F_min ∝ v/β², F_max ∝ v/β. Below: the string only slips (a
   whisper); above: it only grips and tears free irregularly (a crunch).
   Play: the bow strokes by itself; the player only sets the bow PRESSURE (one control).
   Game: 1 Find the sound · reflect · 2 Play the tune · reflect · 3 The physician's bow · debrief. */
(function () {
  window.LabGames = window.LabGames || {};
  const TAU = Math.PI * 2;
  const A_MIN = 0.008, A_MAX = 0.35; // Schelleng constants (illustrative scale)
  const fmin = (v, b) => (A_MIN * v) / (b * b), fmax = (v, b) => (A_MAX * v) / b;
  const NOTE = { C: 261.63, D: 293.66, E: 329.63, F: 349.23, G: 392.0, A: 440 };
  const TUNE = [["E", 0.18, 0.15], ["E", 0.18, 0.15], ["F", 0.3, 0.07], ["G", 0.3, 0.07], ["G", 0.14, 0.15], ["F", 0.14, 0.15], ["E", 0.24, 0.07], ["D", 0.24, 0.07], ["C", 0.34, 0.12], ["C", 0.34, 0.12], ["D", 0.16, 0.06], ["E", 0.16, 0.06], ["E", 0.26, 0.15], ["D", 0.12, 0.09], ["D", 0.12, 0.09]]; // Ode to Joy (public domain), with a bow speed per note

  window.LabGames.violin = (api, mode) => {
    const k = window.LabKit, { ctx: c, W, H, plot: P, PH } = api;
    let C = api.colors(), alive = true, raf = 0, last = performance.now(), t = 0;
    const off = [], on = (el, ev, f, o) => { el.addEventListener(ev, f, o); off.push(() => el.removeEventListener(ev, f, o)); };
    on(document, "themechange", () => (C = api.colors()));

    // ---------------- state: the bow strokes by itself; the player sets the pressure ----------------
    const bow = { F: 0.25, v: 0.2, vTarget: 0.2, beta: 0.1, u: 0.5, dir: 1, playing: false };
    const keys = {};
    on(window, "keydown", (e) => { if (["ArrowUp", "ArrowDown"].includes(e.code) && document.activeElement?.tagName !== "INPUT") e.preventDefault(); keys[e.code] = true; k.audio.get(); });
    on(window, "keyup", (e) => (keys[e.code] = false));
    // drag up/down anywhere on the scene to set pressure
    let dragY = null;
    on(api.canvas, "pointerdown", (e) => { dragY = e.clientY; api.canvas.setPointerCapture(e.pointerId); k.audio.get(); if (!S) S = snd(); });
    on(api.canvas, "pointermove", (e) => { if (dragY == null) return; const r = api.canvas.getBoundingClientRect(); bow.F = Math.max(0.02, Math.min(1.6, bow.F + ((e.clientY - dragY) / r.height) * 2.4)); dragY = e.clientY; syncSlider(); });
    on(api.canvas, "pointerup", () => (dragY = null));
    const syncSlider = () => { const el = document.getElementById("v-press"); if (el) el.value = bow.F; };

    // ---------------- sound: sawtooth (Helmholtz motion) + airy noise + crunch ----------------
    const snd = () => { const a = k.audio.get(); if (!a) return null;
      const saw = a.createOscillator(); saw.type = "sawtooth"; saw.frequency.value = NOTE.A;
      const lp = a.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3200; const gS = a.createGain(); gS.gain.value = 0;
      const shaper = a.createWaveShaper(); const cur = new Float32Array(256); for (let i = 0; i < 256; i++) { const x = i / 128 - 1; cur[i] = Math.tanh(6 * x) * (Math.random() * 0.35 + 0.65); } shaper.curve = cur; const gC = a.createGain(); gC.gain.value = 0;
      const nb = a.createBuffer(1, a.sampleRate * 2, a.sampleRate), d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const ns = a.createBufferSource(); ns.buffer = nb; ns.loop = true; const bp = a.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 1.2; bp.frequency.value = 3000; const gN = a.createGain(); gN.gain.value = 0;
      saw.connect(lp); lp.connect(gS); saw.connect(shaper); shaper.connect(gC); ns.connect(bp); bp.connect(gN);
      const out = a.createGain(); out.gain.value = 0.9; [gS, gC, gN].forEach((g) => g.connect(out)); out.connect(a.destination); saw.start(); ns.start();
      return { a, saw, gS, gC, gN, bp, stop() { try { out.gain.setTargetAtTime(0, a.currentTime, 0.03); setTimeout(() => { saw.stop(); ns.stop(); out.disconnect(); }, 200); } catch (e) {} } }; };
    let S = null;
    const sound = (reg, loud, f0) => { if (!S) return; const now = S.a.currentTime, m = k.audio.muted ? 0 : 1, set = (g, v) => g.gain.setTargetAtTime(v * m, now, 0.04);
      const det = reg === "grip" ? 1 + (Math.random() - 0.5) * 0.06 : 1; S.saw.frequency.setTargetAtTime(f0 * det, now, 0.02);
      if (reg === "music") { set(S.gS, 0.14 * loud); set(S.gC, 0); set(S.gN, 0.012 * loud); S.bp.frequency.setTargetAtTime(3000, now, 0.05); }
      else if (reg === "slip") { set(S.gS, 0.015 * loud); set(S.gC, 0); set(S.gN, 0.16 * loud); S.bp.frequency.setTargetAtTime(4200, now, 0.05); }
      else if (reg === "grip") { set(S.gS, 0.02 * loud); set(S.gC, 0.07 * loud * (0.4 + Math.random())); set(S.gN, 0.08 * loud); S.bp.frequency.setTargetAtTime(350, now, 0.05); }
      else { set(S.gS, 0); set(S.gC, 0); set(S.gN, 0); } };

    // ---------------- the bowed string ----------------
    const st = { y: 0, ph: 0, trace: [], reg: "silent", stick: true, hairOff: 0 };
    const update = (dt) => {
      if (keys.ArrowUp) bow.F = Math.max(0.02, bow.F - dt * 0.7), syncSlider();
      if (keys.ArrowDown) bow.F = Math.min(1.6, bow.F + dt * 0.7), syncSlider();
      bow.v += (bow.vTarget - bow.v) * Math.min(1, dt * 3);
      // the bow travels along its own length, turning at the tip and at the frog (up-bow / down-bow)
      if (bow.playing) { bow.u += bow.dir * bow.v * dt * 1.6; if (bow.u > 0.85) { bow.u = 0.85; bow.dir = -1; } if (bow.u < 0.1) { bow.u = 0.1; bow.dir = 1; } }
      const v = bow.playing ? bow.v * Math.min(1, Math.min(bow.u - 0.1, 0.85 - bow.u) * 30 + 0.15) : 0;
      const lo = fmin(v, bow.beta), hi = fmax(v, bow.beta);
      st.reg = v < 0.03 ? "silent" : bow.F < lo ? "slip" : bow.F > hi ? "grip" : "music"; st.lo = lo; st.hi = hi; st.v = v; api.canvas.dataset.band = (Math.sqrt(lo * hi)).toFixed(3);
      const amp = Math.min(1, v / 0.3) * 30; st.hairOff += bow.dir * v * dt * 140;
      if (st.reg === "music") { st.ph += dt / 0.7; const u = st.ph % 1; st.stick = u < 0.82; st.y = bow.dir * (st.stick ? amp * (u / 0.82) : amp * (1 - (u - 0.82) / 0.18)) - bow.dir * amp / 2; }
      else if (st.reg === "slip") { st.stick = false; st.y = (Math.random() - 0.5) * 5 * Math.min(1, v / 0.2); }
      else if (st.reg === "grip") { st.ph += dt / (0.9 + Math.random() * 1.2); const u = st.ph % 1; st.stick = u < 0.93; st.y = bow.dir * (st.stick ? amp * 1.4 * u : amp * 1.4 * (1 - (u - 0.93) / 0.07)) - bow.dir * amp * 0.6 + (Math.random() - 0.5) * 4; }
      else { st.stick = true; st.y *= 0.9; }
      st.trace.push(st.y); if (st.trace.length > 280) st.trace.shift();
    };

    // ---------------- drawing: a violinist in proportion, the bow sliding along its own length ----------------
    const ink = "#1A1A1A";
    const limb = (x0, y0, x1, y1, L1, L2, bend, col, w) => { // two-segment arm with a fixed upper arm and forearm (no stretching)
      const dx = x1 - x0, dy = y1 - y0, d = Math.min(L1 + L2 - 0.5, Math.hypot(dx, dy)), a = Math.atan2(dy, dx);
      const cosA = (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), ang = a + bend * Math.acos(Math.max(-1, Math.min(1, cosA)));
      const ex = x0 + L1 * Math.cos(ang), ey = y0 + L1 * Math.sin(ang), hx = x0 + d * Math.cos(a), hy = y0 + d * Math.sin(a);
      c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round"; c.beginPath(); c.moveTo(x0, y0); c.lineTo(ex, ey); c.lineTo(hx, hy); c.stroke();
      return [hx, hy]; };
    const drawStage = () => {
      const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, C.dark ? "#16233A" : "#FFF9F1"); g.addColorStop(1, C.dark ? "#0F1A2C" : "#FDEBD8"); c.fillStyle = g; c.fillRect(0, 0, W, H);
      c.strokeStyle = C.dark ? "rgba(255,183,77,.16)" : "rgba(242,140,40,.16)"; c.lineWidth = 2;
      for (let i = 0; i < 3; i++) { c.beginPath(); c.ellipse(225, 260, 170 + i * 20, 90 + i * 12, -0.2, 0, TAU); c.stroke(); }
      c.fillStyle = C.dark ? "#2A3A55" : "#EBD9C3"; c.fillRect(0, H - 34, 450, 34);
    };
    const drawViolinist = (mood) => {
      const X = 225, feet = H - 36, hip = feet - 150, sh = hip - 120, head = sh - 42; // ~1:7 proportions
      // legs and shoes
      c.strokeStyle = ink; c.lineWidth = 15; c.lineCap = "round"; c.beginPath(); c.moveTo(X - 12, hip); c.lineTo(X - 20, feet - 6); c.moveTo(X + 12, hip); c.lineTo(X + 18, feet - 6); c.stroke();
      c.fillStyle = ink; c.beginPath(); c.ellipse(X - 26, feet - 2, 14, 6, 0, 0, TAU); c.ellipse(X + 24, feet - 2, 14, 6, 0, 0, TAU); c.fill();
      // tailcoat
      c.fillStyle = ink; c.beginPath(); c.moveTo(X - 34, sh + 4); c.lineTo(X + 34, sh + 4); c.lineTo(X + 30, hip + 6); c.lineTo(X + 40, hip + 52); c.lineTo(X + 18, hip + 10); c.lineTo(X - 18, hip + 10); c.lineTo(X - 40, hip + 52); c.lineTo(X - 30, hip + 6); c.closePath(); c.fill();
      c.fillStyle = "#fff"; c.beginPath(); c.moveTo(X - 9, sh + 4); c.lineTo(X + 9, sh + 4); c.lineTo(X, sh + 60); c.closePath(); c.fill();
      c.fillStyle = "#F28C28"; c.beginPath(); c.moveTo(X, sh + 8); c.lineTo(X - 11, sh + 2); c.lineTo(X - 11, sh + 14); c.closePath(); c.moveTo(X, sh + 8); c.lineTo(X + 11, sh + 2); c.lineTo(X + 11, sh + 14); c.closePath(); c.fill();
      // violin: body under the chin on the player's left shoulder (screen right), neck pointing out and slightly up
      const vb = { x: X + 30, y: sh + 6 }, vAng = -0.28, vdx = Math.cos(vAng), vdy = Math.sin(vAng);
      const scroll = { x: vb.x + vdx * 150, y: vb.y + vdy * 150 };
      // left arm (screen right) holds the neck
      limb(X + 30, sh + 8, scroll.x - vdx * 16, scroll.y - vdy * 16 + 6, 62, 62, 1, ink, 13);
      c.save(); c.translate(vb.x, vb.y); c.rotate(vAng);
      c.fillStyle = "#D9772E"; c.strokeStyle = "#6E3510"; c.lineWidth = 2; c.beginPath(); c.ellipse(-4, 0, 34, 24, 0, 0, TAU); c.fill(); c.stroke(); c.beginPath(); c.ellipse(34, 0, 26, 19, 0, 0, TAU); c.fill(); c.stroke();
      c.fillStyle = "#E8893A"; c.beginPath(); c.ellipse(14, 0, 10, 15, 0, 0, TAU); c.fill();
      c.fillStyle = "#2A1A10"; c.fillRect(48, -4, 102, 8); c.beginPath(); c.arc(152, 0, 8, 0, TAU); c.fill();
      c.fillStyle = "#5A3A1A"; c.fillRect(8, -11, 3, 22); // bridge
      c.strokeStyle = "#EEE"; c.lineWidth = 0.9; for (let s2 = -3; s2 <= 3; s2 += 2) { c.beginPath(); c.moveTo(-26, s2 * 0.9); c.lineTo(150, s2 * 0.9); c.stroke(); }
      c.restore();
      // the bow crosses the strings between bridge and fingerboard, nearly perpendicular to them, and slides along its own length
      const cp = { x: vb.x + vdx * (14 + (bow.beta - 0.05) * 160), y: vb.y + vdy * (14 + (bow.beta - 0.05) * 160) }, bAng = 2.05, bdx = Math.cos(bAng), bdy = Math.sin(bAng), BL = 200;
      // u = 0 → contact at the frog, u = 1 → contact at the tip; the frog sits at cp − u·BL along the bow
      const frog = { x: cp.x - bdx * (bow.u * BL - 0) * -1, y: cp.y - bdy * (bow.u * BL) * -1 };
      const tip = { x: frog.x - bdx * BL, y: frog.y - bdy * BL };
      c.strokeStyle = "#5A2E12"; c.lineWidth = 4.5; c.lineCap = "round"; c.beginPath(); c.moveTo(frog.x, frog.y); c.lineTo(tip.x, tip.y); c.stroke();
      c.strokeStyle = "#F1E6CC"; c.lineWidth = 2; const nx = -bdy * 4, ny = bdx * 4; c.beginPath(); c.moveTo(frog.x + nx, frog.y + ny); c.lineTo(tip.x + nx, tip.y + ny); c.stroke();
      c.fillStyle = ink; c.save(); c.translate(frog.x, frog.y); c.rotate(bAng); k.rr(c, -6, -6, 16, 12, 3); c.fill(); c.restore();
      // right arm (screen left) holds the frog: shoulder → elbow → hand, segment lengths fixed
      const hand = limb(X - 30, sh + 8, frog.x, frog.y, 82, 82, 1, ink, 13);
      c.fillStyle = "#fff"; c.strokeStyle = ink; c.lineWidth = 1.5; c.beginPath(); c.arc(hand[0], hand[1], 6.5, 0, TAU); c.fill(); c.stroke();
      c.beginPath(); c.arc(scroll.x - vdx * 16, scroll.y - vdy * 16 + 6, 6.5, 0, TAU); c.fill(); c.stroke();
      // head tilted onto the chin rest
      c.save(); c.translate(X + 6, head); c.rotate(0.18);
      c.fillStyle = "#fff"; c.strokeStyle = ink; c.lineWidth = 2.2; c.beginPath(); c.ellipse(0, 0, 25, 28, 0, 0, TAU); c.fill(); c.stroke();
      c.fillStyle = ink; c.beginPath(); c.moveTo(-26, -6); c.quadraticCurveTo(-24, -34, 0, -32); c.quadraticCurveTo(26, -36, 25, -4); c.quadraticCurveTo(14, -22, 6, -20); c.quadraticCurveTo(-8, -24, -26, -6); c.fill();
      k.rr(c, -19, -6, 15, 9, 3); c.fill(); k.rr(c, 3, -6, 15, 9, 3); c.fill(); c.fillRect(-4, -3, 7, 2.5);
      if (mood > 0.5) { k.sparkle(c, -11, -2, 4, "#FFB300"); k.sparkle(c, 11, -2, 4, "#FFB300"); }
      c.strokeStyle = ink; c.lineWidth = 2; c.beginPath(); if (mood > 0.2) c.arc(0, 8, 8, 0.15 * Math.PI, 0.85 * Math.PI); else if (mood < -0.2) c.arc(0, 18, 8, 1.2 * Math.PI, 1.8 * Math.PI); else { c.moveTo(-6, 13); c.lineTo(6, 13); } c.stroke();
      c.restore();
      // effects
      if (st.reg === "music") { for (let i = 0; i < 4; i++) { const a = (t * 0.6 + i / 4) % 1; k.note(c, X + 120 + i * 24 + Math.sin(t * 2 + i) * 6, sh - 40 - a * 110, 1.3, `rgba(242,140,40,${1 - a})`); } k.sparkle(c, X - 120, sh - 60, 8, "#FFB300"); }
      if (st.reg === "grip") { k.scribble(c, X - 70, head - 50, 18, C.ink3, t); k.text(c, "KRRRCH", X + 70, head - 40, "800 22px Roboto, sans-serif", C.coral); }
      if (st.reg === "slip") k.text(c, "ffffff…", X + 70, head - 40, "italic 600 20px Roboto, sans-serif", C.ink3);
      k.text(c, bow.dir > 0 ? "down-bow ↘" : "up-bow ↖", X - 210, H - 50, "600 12px Roboto Mono, monospace", C.ink3);
    };
    const drawCloseUp = () => { // seen from above: the string runs left–right, the bow crosses it and slides along its length (up/down)
      const x0 = 470, y0 = 22, w = 466, h = 254;
      c.fillStyle = C.dark ? "#101D31" : "#FFFFFF"; k.rr(c, x0, y0, w, h, 14); c.fill(); c.strokeStyle = C.dark ? "#2C4060" : "#1A2B44"; c.lineWidth = 2; c.stroke();
      k.text(c, "CLOSE-UP AT THE BOW · SEEN FROM ABOVE · SLOW MOTION", x0 + 16, y0 + 24, "600 11px Roboto Mono, monospace", C.ink3);
      const cy = y0 + 150, xc = x0 + 290, yc = cy + st.y * 1.8;
      // bow: a vertical band crossing the string; hair texture moves with the stroke
      c.save(); k.rr(c, x0 + 14, y0 + 36, w - 28, h - 92, 10); c.clip();
      c.fillStyle = "#F1E6CC"; c.fillRect(xc - 12, y0 + 36, 24, h - 92); c.fillStyle = "rgba(120,90,50,.35)"; for (let yy = -40; yy < h; yy += 14) { const y = y0 + 36 + ((yy + st.hairOff) % 14 + 14) % 14 + yy; c.fillRect(xc - 12, y, 24, 2); }
      c.fillStyle = "#5A2E12"; c.fillRect(xc + 14, y0 + 36, 8, h - 92);
      c.restore();
      // string
      c.strokeStyle = C.dark ? "#C9D6E6" : "#444"; c.lineWidth = 3; c.beginPath(); c.moveTo(x0 + 24, cy); c.lineTo(xc, yc); c.lineTo(x0 + w - 24, cy); c.stroke();
      c.fillStyle = C.ink2; c.fillRect(x0 + 18, cy - 12, 6, 24); c.fillRect(x0 + w - 24, cy - 12, 6, 24);
      k.text(c, "nut", x0 + 21, cy + 28, "10px Roboto Mono, monospace", C.ink3, "center"); k.text(c, "bridge", x0 + w - 21, cy + 28, "10px Roboto Mono, monospace", C.ink3, "center");
      // arrows: bow direction, string following or springing back
      c.fillStyle = C.ink3; k.text(c, bow.dir > 0 ? "bow ↓" : "bow ↑", xc + 30, y0 + 56, "600 12px Roboto, sans-serif", C.ink2);
      const lab = st.reg === "music" ? (st.stick ? "GRIP" : "SLIP") : st.reg === "slip" ? "SLIP · SLIP · SLIP" : st.reg === "grip" ? "GRIP · GRIP · tear" : "bow resting";
      const col = st.reg === "music" ? (st.stick ? C.coral : C.teal) : st.reg === "silent" ? C.ink3 : C.ink2;
      k.text(c, lab, x0 + 110, y0 + 70, "800 26px Roboto, sans-serif", col, "center");
      if (st.reg === "music") k.wrap(c, st.stick ? "the hair grips the string and carries it along" : "the string's tension wins: it snaps back", x0 + 110, y0 + 94, 180, 16, "13px Roboto, sans-serif", C.ink2, "center");
      const v = { music: ["♪ Grip + slip = music", C.teal], slip: ["Too light: it only slips", C.ink2], grip: ["Too heavy: it only grips", C.coral], silent: ["Press ▶ to start bowing", C.ink3] }[st.reg];
      k.rr(c, x0 + 16, y0 + h - 46, w - 32, 32, 16); c.fillStyle = st.reg === "music" ? "rgba(94,209,200,.18)" : "rgba(127,140,155,.12)"; c.fill();
      k.text(c, v[0], x0 + w / 2, y0 + h - 25, "700 15px Roboto, sans-serif", v[1], "center");
    };
    const drawPressureMeter = () => { // the one control, drawn as a vertical gauge with the playable band
      const x0 = 470, y0 = 292, w = 466, h = 222;
      c.fillStyle = C.dark ? "#101D31" : "#FFFFFF"; k.rr(c, x0, y0, w, h, 14); c.fill(); c.strokeStyle = C.rule; c.lineWidth = 1; c.stroke();
      k.text(c, "BOW PRESSURE · keep it in the green band", x0 + 16, y0 + 24, "600 11px Roboto Mono, monospace", C.ink3);
      const gx = x0 + 60, gy = y0 + 40, gh = h - 64, gw = 60, py = (F) => gy + (F / 1.6) * gh;
      c.fillStyle = C.dark ? "#22344F" : "#EEF2F6"; k.rr(c, gx, gy, gw, gh, 10); c.fill();
      const lo = Math.min(1.6, st.lo || 0), hi = Math.min(1.6, st.hi || 0);
      if (st.v > 0.03) { c.fillStyle = "rgba(94,209,200,.45)"; c.fillRect(gx, py(lo), gw, Math.max(2, py(hi) - py(lo))); }
      k.text(c, "light", gx + gw + 12, gy + 12, "12px Roboto, sans-serif", C.ink3); k.text(c, "heavy", gx + gw + 12, gy + gh, "12px Roboto, sans-serif", C.ink3);
      const yy = py(bow.F); c.fillStyle = st.reg === "music" ? C.teal : st.reg === "grip" ? C.coral : C.ink; k.rr(c, gx - 10, yy - 5, gw + 20, 10, 5); c.fill();
      // explanation to the right
      const tx = gx + gw + 80;
      k.wrap(c, "Too light, and the hair cannot hold the string: it only slips, and you hear air.", tx, gy + 30, 250, 18, "14px Roboto, sans-serif", C.ink2);
      k.wrap(c, "In the band, grip and slip take turns: a clean note.", tx, gy + 90, 250, 18, "600 14px Roboto, sans-serif", C.teal);
      k.wrap(c, "Too heavy, and the string never gets free: it grips and tears loose. Crunch.", tx, gy + 140, 250, 18, "14px Roboto, sans-serif", C.ink2);
    };
    const drawTrace = (label) => {
      P.clearRect(0, 0, W, PH); P.fillStyle = C.dark ? "#101D31" : "#F1F4F8"; k.rr(P, 0, 0, W, PH, 12); P.fill();
      P.strokeStyle = C.coral; P.lineWidth = 2; P.beginPath(); st.trace.forEach((y, i) => { const x = 40 + (i / 279) * (W - 60), yy = PH / 2 - y * 1.3; i ? P.lineTo(x, yy) : P.moveTo(x, yy); }); P.stroke();
      k.text(P, label || "string at the bow, slow motion: a clean saw-tooth = grip (slow ramp), then slip (fast return)", 40, PH - 10, "11px Roboto Mono, monospace", C.ink3);
    };
    const mood = () => (st.reg === "music" ? 1 : st.reg === "silent" ? 0.3 : -0.6);
    const hud = (txt, sub) => { k.text(c, txt, 24, 34, "700 17px Roboto, sans-serif", C.ink); if (sub) k.text(c, sub, 24, 56, "13px Roboto Mono, monospace", C.ink3); };

    let frame = () => {};
    const loop = (now) => { if (!alive) return; const dt = Math.min((now - last) / 1000, 0.04); last = now; t += dt; frame(dt); raf = requestAnimationFrame(loop); };
    const ctrl = (extra) => {
      api.controls.innerHTML = `<label class="lab-range lab-press">Bow pressure <span class="muted">light</span><input type="range" id="v-press" min="0.02" max="1.6" step="0.01" value="${bow.F}"><span class="muted">heavy</span></label><span class="lab-note">or ↑ ↓, or drag up/down on the scene</span>${extra || ""}`;
      const el = document.getElementById("v-press"); el.addEventListener("input", () => { bow.F = +el.value; k.audio.get(); if (!S) S = snd(); });
      k.muteButton(api.controls); };
    const reflect = (img, title, body, btn) => api.card(`<span class="lp-k">Pause and reflect</span>${img ? `<img class="ls-card-img" src="${img}" alt="">` : ""}<h3>${title}</h3>${body}`, [{ label: btn }]);

    // ======================= GAME =======================
    if (mode === "game") {
      (async () => {
        const res = [];
        await api.card(`<span class="lp-k">Tutorial A · Grip and slip</span><h3>The violinist's secret</h3><p>A violin sings because of friction. The bow <b>grips</b> the string and drags it along, until the string's tension wins and it <b>slips</b> back. Grip, slip, hundreds of times a second: that is the note.</p><p>The bow will stroke by itself, and now and then move closer to or further from the bridge. Your only job is the <b>pressure</b>: the slider under the scene, the ↑ ↓ keys, or dragging up and down on the scene.</p><p class="muted">Turn the sound on if you can.</p>`, [{ label: "Pick up the bow" }]);
        if (!alive) return; S = snd(); bow.playing = true; bow.F = 0.02; syncSlider();
        // ---- level 1
        ctrl(`<span class="lab-note">Level 1 of 3</span>`);
        res.push(await new Promise((done) => { let T = 0, good = 0, nextV = 3;
          frame = (dt) => { T += dt; if (T > nextV) { const opts = [[0.18, 0.15], [0.3, 0.07], [0.14, 0.12], [0.26, 0.06], [0.22, 0.16]]; const o = opts[(Math.floor(T / 5) + 1) % opts.length]; bow.vTarget = o[0]; bow.beta = o[1]; nextV = T + 5; }
            update(dt); if (st.reg === "music") good += dt; sound(st.reg, Math.min(1, st.v / 0.25), NOTE.A);
            c.clearRect(0, 0, W, H); drawStage(); drawViolinist(mood()); drawCloseUp(); drawPressureMeter(); drawTrace();
            hud(`Clean tone ${good.toFixed(1)} / 8 s`, `${Math.max(0, Math.ceil(40 - T))} s left · the bow moves ${bow.beta < 0.1 ? "close to the bridge: needs more pressure" : "away from the bridge: needs less pressure"}`);
            if (good >= 8 || T >= 40) { frame = () => {}; done(Math.round(Math.min(1, good / 8) * 100 - (good >= 8 ? Math.max(0, T - 16) * 1.5 : 0))); } }; }));
        sound("silent", 0, NOTE.A); api.log("game", "L1", { score: res[0] });
        if (!alive) return;
        await reflect("assets/img/lab/violin-catheter.jpg", `${Math.max(20, res[0])} / 100 · what just happened?`, `<p>You heard three sounds from the same bow: the <b>whisper</b> when it only slips, the <b>crunch</b> when it only grips, and the <b>note</b> when the two take turns.</p><p>Notice that the right pressure depended on the bow speed. Friction was not too high or too low on its own: it had to fit the moment.</p>`, "Level 2: play a tune");
        if (!alive) return;
        // ---- level 2
        ctrl(`<span class="lab-note">Level 2 of 3 · each note has its own bow speed</span>`);
        res.push(await new Promise((done) => { const dur = 1.7, notes = TUNE.map(([n, v, be], i) => ({ n, v, be, t0: 2.5 + i * dur })); let T = 0, inT = 0, tot = 0;
          frame = (dt) => { T += dt; const cur = notes.find((q) => T >= q.t0 && T < q.t0 + dur), nxt = notes.find((q) => q.t0 > T);
            bow.vTarget = cur ? cur.v : nxt ? nxt.v : 0.2; bow.beta = cur ? cur.be : nxt ? nxt.be : 0.1; update(dt); const f0 = cur ? NOTE[cur.n] : NOTE.A;
            if (cur) { tot += dt; if (st.reg === "music") inT += dt; } sound(st.reg, Math.min(1, st.v / 0.25), f0);
            c.clearRect(0, 0, W, H); drawStage(); drawViolinist(mood()); drawCloseUp(); drawPressureMeter();
            hud(`Ode to Joy · ${Math.round((inT / Math.max(0.01, tot)) * 100)}% clean`, cur ? `now: ${cur.n} · ${cur.be < 0.1 ? "near the bridge: press harder" : "mid-string: press lighter"}` : "get ready");
            P.clearRect(0, 0, W, PH); P.fillStyle = C.dark ? "#101D31" : "#FFF7EC"; k.rr(P, 0, 0, W, PH, 12); P.fill();
            const lx = 140; P.strokeStyle = C.coral; P.lineWidth = 3; P.beginPath(); P.moveTo(lx, 10); P.lineTo(lx, PH - 10); P.stroke();
            notes.forEach((q) => { const x = lx + (q.t0 - T) * 150, y = PH - 26 - "CDEFGA".indexOf(q.n) * 18; if (x < -220 || x > W) return; const w = dur * 150 - 8, playing = q === cur;
              P.fillStyle = playing ? (st.reg === "music" ? C.teal : C.coral) : C.dark ? "#2C4060" : "#E9D6BE"; k.rr(P, x, y - 10, w, 18, 9); P.fill();
              k.text(P, `${q.n} · ${q.be < 0.1 ? "near bridge" : "mid-string"}`, x + 8, y + 4, "700 12px Roboto Mono, monospace", playing ? "#fff" : C.ink2); });
            if (T > notes[notes.length - 1].t0 + dur + 0.5) { frame = () => {}; done(Math.round((inT / Math.max(0.01, tot)) * 100)); } }; }));
        sound("silent", 0, NOTE.A); bow.playing = false; api.log("game", "L2", { score: res[1] });
        if (!alive) return;
        await reflect("assets/img/lab/violinist-physician.jpg", `${res[1]}% of the tune clean · the violinist is in control`, `<p>A violinist adjusts pressure and speed all the time, without thinking, so that grip and slip keep alternating. <b>The violinist controls friction.</b></p><p>A physician pushing a catheter cannot. Its friction is fixed by its coating and the vessel wall: the same everywhere, whether the task needs gliding or holding still.</p><p>How can we give physicians the bow?</p>`, "Level 3: the physician's bow");
        if (!alive) return;
        res.push(await physicianQuiz());
        if (!alive) return;
        const total = Math.round((Math.max(20, res[0]) + res[1] + res[2]) / 3), nb = api.best(total, `${total} / 100`);
        api.log("game", "total", { score: total, l1: res[0], l2: res[1], l3: res[2] });
        const go = await api.card(`<span class="lp-k">Debrief</span><h3>${total} / 100${nb ? " · new best" : ""}</h3>
          <ul class="ls-res"><li>Find the sound <b>${Math.max(20, res[0])}</b></li><li>Play the tune <b>${res[1]}</b></li><li>The physician's bow <b>${res[2]}</b></li></ul>
          <p>A violin needs <b>grip and slip</b>, in turn. A catheter needs <b>glide or grip</b>, each at the right moment: glide to navigate without loading the wall, grip to hold still while a stent opens. Ultrasonic lubrication is the physician's bow.</p><p>Now feel the physics behind it.</p>`, [{ label: "▶ Squeeze-film lab" }, { label: "Catheter run" }, { label: "Play again" }]);
        if (!alive) return;
        if (go === 0) location.hash = "#glide"; else if (go === 1) location.hash = "#catheter"; else document.querySelector('.ls-modes [data-m="game"]')?.click();
      })();

      function physicianQuiz() {
        return new Promise((done) => {
          const Q = [
            { s: "Navigating a tortuous bend in the iliac artery", a: "glide", why: "Low friction lets the push reach the tip instead of buckling the shaft against the wall.", scene: "bend" },
            { s: "Deploying a stent across the lesion", a: "grip", why: "High friction anchors the catheter so the heartbeat cannot shift it while the stent opens.", scene: "stent" },
            { s: "Crossing a calcified narrowing", a: "glide", why: "On rigid, calcified walls ultrasound cuts friction the most (up to ~60–80% in the papers).", scene: "calc" },
            { s: "Holding position for a heart-valve implant", a: "grip", why: "The valve must open exactly in place: the catheter has to stay still while the heart beats.", scene: "valve" }
          ];
          let i = 0, right = 0, picked = null, fb = 0;
          api.controls.innerHTML = `<span class="lab-note">Level 3 of 3 · Glide or grip?</span><button class="lab-us" id="q-glide" type="button">〰 Glide (vibration on)</button><button class="lab-hold" id="q-grip" type="button">⚓ Grip (vibration off)</button>`; k.muteButton(api.controls);
          const pick = (a) => { if (picked) return; picked = a; if (a === Q[i].a) { right++; k.audio.pluck(523, 0.4); k.audio.pluck(659, 0.5); } else k.audio.noise(0.25, 0.12, 250); fb = 3.2; };
          document.getElementById("q-glide").addEventListener("click", () => pick("glide")); document.getElementById("q-grip").addEventListener("click", () => pick("grip"));
          frame = (dt) => {
            const q = Q[i]; c.clearRect(0, 0, W, H);
            const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, C.dark ? "#16233A" : "#F4FAFD"); g.addColorStop(1, C.dark ? "#0F1A2C" : "#E3F1F7"); c.fillStyle = g; c.fillRect(0, 0, W, H);
            const ok = picked ? picked === q.a : null;
            k.person(c, 130, 440, { s: 1.5, shirt: "#1A1A1A", tux: true, bow: true, glasses: true, hair: "spiky", mood: 1, arms: [[-22, 10], [24, 14]] });
            k.text(c, "Violinist: in control", 130, 520, "600 13px Roboto, sans-serif", C.ink2, "center");
            k.person(c, 830, 440, { s: 1.5, shirt: "#7CC6D9", sleeve: "#7CC6D9", pants: "#7CC6D9", cap: "#7CC6D9", glasses: ok === true, mood: ok === null ? -0.1 : ok ? 1 : -0.6, arms: [[-18, -36], [22, 16]] });
            if (ok === null) { k.scribble(c, 800, 300, 14, C.ink3, t); k.text(c, "?", 855, 310, "800 34px Roboto, sans-serif", C.ink3); }
            k.text(c, "Physician: you decide", 830, 520, "600 13px Roboto, sans-serif", C.ink2, "center");
            drawVessel(q.scene, picked);
            k.text(c, `Situation ${i + 1} of 4`, W / 2, 46, "600 12px Roboto Mono, monospace", C.ink3, "center");
            k.wrap(c, q.s, W / 2, 76, 520, 26, "700 21px Roboto, sans-serif", C.ink, "center");
            if (picked) { k.wrap(c, (ok ? "✓ Right. " : "✗ Not quite. ") + q.why, W / 2, 420, 480, 20, "600 15px Roboto, sans-serif", ok ? C.teal : C.coral, "center");
              fb -= dt; if (fb <= 0) { i++; picked = null; if (i >= Q.length) { frame = () => {}; const sc = Math.round((right / Q.length) * 100); api.log("game", "L3", { score: sc }); done(sc); } } }
            P.clearRect(0, 0, W, PH); P.fillStyle = C.dark ? "#101D31" : "#F1F4F8"; k.rr(P, 0, 0, W, PH, 12); P.fill();
            k.text(P, "VIOLIN", 60, 44, "700 13px Roboto Mono, monospace", C.coral); k.text(P, "needs grip AND slip, in turn, to sing", 150, 44, "15px Roboto, sans-serif", C.ink);
            k.text(P, "CATHETER", 60, 92, "700 13px Roboto Mono, monospace", C.teal); k.text(P, "needs glide OR grip, as the task demands, to work safely", 150, 92, "15px Roboto, sans-serif", C.ink);
            k.text(P, "ultrasonic lubrication is the physician's bow", 150, 128, "italic 13px Roboto, sans-serif", C.ink3);
          };
        });
      }
      function drawVessel(scene, picked) {
        const x0 = 270, y0 = 130, w = 420, h = 250;
        c.save(); k.rr(c, x0, y0, w, h, 16); c.clip();
        c.fillStyle = "#C8473A"; c.fillRect(x0, y0, w, h);
        const wall = (path, wd, col) => { c.strokeStyle = col; c.lineWidth = wd; c.lineCap = "round"; c.beginPath(); path(); c.stroke(); };
        const route = scene === "bend" ? () => { c.moveTo(x0 - 20, y0 + 190); c.bezierCurveTo(x0 + 120, y0 + 190, x0 + 90, y0 + 50, x0 + 220, y0 + 60); c.bezierCurveTo(x0 + 340, y0 + 70, x0 + 300, y0 + 200, x0 + w + 20, y0 + 180); } : () => { c.moveTo(x0 - 20, y0 + h / 2); c.lineTo(x0 + w + 20, y0 + h / 2); };
        wall(route, 120, "#E36A5C"); wall(route, 80, "#F7C6BE");
        if (scene !== "bend") { c.fillStyle = scene === "calc" ? "#F0EAD6" : "#F2C94C"; [-1, 1].forEach((sg) => { c.beginPath(); c.ellipse(x0 + 260, y0 + h / 2 + sg * 34, 46, 16, 0, 0, TAU); c.fill(); }); }
        c.strokeStyle = "#3B82C4"; c.lineWidth = 10; c.beginPath(); scene === "bend" ? (() => { c.moveTo(x0 - 20, y0 + 190); c.bezierCurveTo(x0 + 120, y0 + 190, x0 + 90, y0 + 50, x0 + 220, y0 + 60); })() : (() => { c.moveTo(x0 - 20, y0 + h / 2); c.lineTo(x0 + 250, y0 + h / 2); })(); c.stroke();
        if (scene === "stent" || scene === "valve") { c.fillStyle = "#5BA7E0"; c.beginPath(); c.ellipse(x0 + 260, y0 + h / 2, 44, 16, 0, 0, TAU); c.fill(); c.strokeStyle = "#E6EEF5"; c.lineWidth = 1.5; for (let q = -36; q <= 36; q += 9) { c.beginPath(); c.moveTo(x0 + 260 + q, y0 + h / 2 - 14); c.lineTo(x0 + 264 + q, y0 + h / 2 + 14); c.stroke(); } }
        if (picked === "glide") { c.strokeStyle = "rgba(94,209,200,.9)"; c.lineWidth = 2; for (let r = 0; r < 3; r++) { const a = (t * 2 + r / 3) % 1; c.globalAlpha = 1 - a; c.beginPath(); c.arc(x0 + 200, y0 + (scene === "bend" ? 70 : h / 2), 12 + a * 30, 0, TAU); c.stroke(); } c.globalAlpha = 1; }
        if (picked === "grip") k.text(c, "⚓", x0 + 200, y0 + (scene === "bend" ? 100 : h / 2 + 50), "28px serif", "#fff", "center");
        c.restore(); c.strokeStyle = C.rule; c.lineWidth = 2; k.rr(c, x0, y0, w, h, 16); c.stroke();
      }
    }

    // ======================= EXPLORE =======================
    if (mode === "explore") {
      bow.playing = true;
      ctrl(`<label class="lab-range">Bow speed <input type="range" id="v-s" min="0.05" max="0.45" step="0.01" value="0.2"></label>
        <label class="lab-range">Bow position β <input type="range" id="v-b" min="0.05" max="0.2" step="0.005" value="0.1"><output id="v-bo">1/10</output></label>
        <label class="lab-select">Note <select id="v-n">${Object.keys(NOTE).map((n) => `<option${n === "A" ? " selected" : ""}>${n}</option>`).join("")}</select></label>`);
      const si = document.getElementById("v-s"), bi = document.getElementById("v-b"), ni = document.getElementById("v-n");
      si.addEventListener("input", () => (bow.vTarget = +si.value));
      bi.addEventListener("input", () => { bow.beta = +bi.value; document.getElementById("v-bo").textContent = `1/${Math.round(1 / bow.beta)}`; });
      let note = "A"; ni.addEventListener("change", () => (note = ni.value));
      const startSound = () => { if (!S) S = snd(); };
      on(api.canvas, "pointerdown", startSound); on(window, "keydown", startSound); api.controls.addEventListener("input", startSound);
      frame = (dt) => { update(dt); sound(st.reg, Math.min(1, st.v / 0.25), NOTE[note]);
        c.clearRect(0, 0, W, H); drawStage(); drawViolinist(mood()); drawCloseUp(); drawPressureMeter(); drawTrace();
        hud(`pressure ${bow.F.toFixed(2)} N · speed ${st.v.toFixed(2)} m/s`, `clean between ${(st.lo || 0).toFixed(2)} and ${(st.hi || 0).toFixed(2)} N · bow nearer the bridge (small β) needs more pressure`); };
    }
    raf = requestAnimationFrame(loop);
    return () => { alive = false; cancelAnimationFrame(raf); off.forEach((f) => f()); if (S) S.stop(); api.hideCard(); };
  };
})();
