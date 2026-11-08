/* Lab tutorial A · The violinist's secret (grip and slip).
   The bow grips the string and drags it along (stick), until the string's tension beats static
   friction and it slips back (slip): stick-slip, repeated hundreds of times a second, is the note.
   A playable note exists only between a minimum and a maximum bow force for a given bow speed and
   bow position (Schelleng 1973): F_min ∝ v/β², F_max ∝ v/β. Below: the string only slips (a
   whisper); above: it only grips and tears free irregularly (a crunch).
   Game: 1 Find the sound · 2 Play the tune · 3 The physician's bow (analogy to the catheter). */
(function () {
  window.LabGames = window.LabGames || {};
  const TAU = Math.PI * 2;
  const K = () => window.LabKit;
  const A_MIN = 0.008, A_MAX = 0.35; // Schelleng constants (illustrative scale)
  const fmin = (v, b) => (A_MIN * v) / (b * b), fmax = (v, b) => (A_MAX * v) / b;
  const NOTE = { D: 293.66, E: 329.63, F: 349.23, G: 392.0, A: 440, C: 261.63 };
  const TUNE = ["E", "E", "F", "G", "G", "F", "E", "D", "C", "C", "D", "E", "E", "D", "D"]; // Beethoven, Ode to Joy (public domain)

  window.LabGames.violin = (api, mode) => {
    const k = K(), { ctx: c, W, H, plot: P, PH } = api;
    let C = api.colors(), alive = true, raf = 0, last = performance.now(), t = 0;
    const off = [], on = (el, ev, f, o) => { el.addEventListener(ev, f, o); off.push(() => el.removeEventListener(ev, f, o)); };
    on(document, "themechange", () => (C = api.colors()));
    // ---------------- player input: drag to bow, height sets pressure ----------------
    const bow = { F: 0.5, v: 0, x: 0.5, lastX: null, down: false, dir: 1, beta: 0.1 };
    const keys = {};
    const toXY = (e) => { const r = api.canvas.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H]; };
    on(api.canvas, "pointerdown", (e) => { bow.down = true; api.canvas.setPointerCapture(e.pointerId); const [x, y] = toXY(e); bow.lastX = x; bow.lastT = performance.now(); setF(y); k.audio.get(); });
    on(api.canvas, "pointermove", (e) => { if (!bow.down) return; const [x, y] = toXY(e), now = performance.now(), dt = Math.max(1, now - bow.lastT) / 1000; const vx = (x - bow.lastX) / dt;
      bow.vRaw = Math.min(0.6, Math.abs(vx) / 1300); if (Math.abs(vx) > 30) bow.dir = Math.sign(vx); bow.x = Math.max(0, Math.min(1, bow.x + (x - bow.lastX) / 520)); bow.lastX = x; bow.lastT = now; setF(y); });
    const up = () => { bow.down = false; bow.vRaw = 0; };
    on(api.canvas, "pointerup", up); on(api.canvas, "pointercancel", up);
    const setF = (y) => { bow.F = Math.max(0.02, Math.min(1.6, ((y - 40) / (H - 80)) * 1.6)); };
    on(window, "keydown", (e) => { if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"].includes(e.code) && document.activeElement?.tagName !== "INPUT") e.preventDefault(); keys[e.code] = true; k.audio.get(); });
    on(window, "keyup", (e) => (keys[e.code] = false));

    // ---------------- sound: sawtooth (Helmholtz motion) + airy noise + crunch ----------------
    const snd = (() => { const a = k.audio.get(); if (!a) return null;
      const saw = a.createOscillator(); saw.type = "sawtooth"; saw.frequency.value = NOTE.A;
      const lp = a.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3200; const gS = a.createGain(); gS.gain.value = 0;
      const shaper = a.createWaveShaper(); const cur = new Float32Array(256); for (let i = 0; i < 256; i++) { const x = i / 128 - 1; cur[i] = Math.tanh(6 * x) * (Math.random() * 0.35 + 0.65); } shaper.curve = cur; const gC = a.createGain(); gC.gain.value = 0;
      const nb = a.createBuffer(1, a.sampleRate * 2, a.sampleRate), d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const ns = a.createBufferSource(); ns.buffer = nb; ns.loop = true; const bp = a.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 1.2; bp.frequency.value = 3000; const gN = a.createGain(); gN.gain.value = 0;
      saw.connect(lp); lp.connect(gS); saw.connect(shaper); shaper.connect(gC); ns.connect(bp); bp.connect(gN);
      const out = a.createGain(); out.gain.value = 0.9; [gS, gC, gN].forEach((g) => g.connect(out)); out.connect(a.destination); saw.start(); ns.start();
      return { a, saw, gS, gC, gN, bp, stop() { try { out.gain.setTargetAtTime(0, a.currentTime, 0.03); setTimeout(() => { saw.stop(); ns.stop(); out.disconnect(); }, 200); } catch (e) {} } }; });
    let S = null;
    const sound = (reg, loud, f0) => { if (!S) return; const now = S.a.currentTime, m = k.audio.muted ? 0 : 1, set = (g, v) => g.gain.setTargetAtTime(v * m, now, 0.04);
      const det = reg === "grip" ? 1 + (Math.random() - 0.5) * 0.06 : 1; S.saw.frequency.setTargetAtTime(f0 * det, now, 0.02);
      if (reg === "music") { set(S.gS, 0.14 * loud); set(S.gC, 0); set(S.gN, 0.012 * loud); S.bp.frequency.setTargetAtTime(3000, now, 0.05); }
      else if (reg === "slip") { set(S.gS, 0.015 * loud); set(S.gC, 0); set(S.gN, 0.16 * loud); S.bp.frequency.setTargetAtTime(4200, now, 0.05); }
      else if (reg === "grip") { set(S.gS, 0.02 * loud); set(S.gC, 0.07 * loud * (0.4 + Math.random())); set(S.gN, 0.08 * loud); S.bp.frequency.setTargetAtTime(350, now, 0.05); }
      else { set(S.gS, 0); set(S.gC, 0); set(S.gN, 0); } };

    // ---------------- the bowed-string state (slow motion for the close-up) ----------------
    const st = { y: 0, ph: 0, trace: [], reg: "silent", stick: true, hist: { music: 0, slip: 0, grip: 0 } };
    const update = (dt) => {
      if (keys.ArrowLeft || keys.ArrowRight) { bow.vRaw = keys.ShiftLeft || keys.ShiftRight ? 0.36 : 0.2; bow.dir = keys.ArrowRight ? 1 : -1; bow.x = Math.max(0, Math.min(1, bow.x + bow.dir * dt * 0.5)); if (bow.x <= 0 || bow.x >= 1) bow.vRaw = 0; }
      else if (!bow.down) bow.vRaw = 0;
      if (keys.ArrowUp) bow.F = Math.max(0.02, bow.F - dt * 0.6); if (keys.ArrowDown) bow.F = Math.min(1.6, bow.F + dt * 0.6);
      bow.v += ((bow.vRaw || 0) - bow.v) * Math.min(1, dt * 10);
      const v = bow.v, lo = fmin(v, bow.beta), hi = fmax(v, bow.beta);
      st.reg = v < 0.03 ? "silent" : bow.F < lo ? "slip" : bow.F > hi ? "grip" : "music";
      st.lo = lo; st.hi = hi;
      // close-up: one stick-slip cycle every ~0.7 s of slow motion
      const amp = Math.min(1, v / 0.3) * 38;
      if (st.reg === "music") { st.ph += dt / 0.7; const u = st.ph % 1; st.stick = u < 0.82; st.y = bow.dir * (st.stick ? amp * (u / 0.82) : amp * (1 - (u - 0.82) / 0.18)) - bow.dir * amp / 2; }
      else if (st.reg === "slip") { st.stick = false; st.y = (Math.random() - 0.5) * 6 * Math.min(1, v / 0.2); }
      else if (st.reg === "grip") { st.ph += dt / (0.9 + Math.random() * 1.2); const u = st.ph % 1; st.stick = u < 0.93; st.y = bow.dir * (st.stick ? amp * 1.4 * u : amp * 1.4 * (1 - (u - 0.93) / 0.07)) - bow.dir * amp * 0.6 + (Math.random() - 0.5) * 4; }
      else { st.stick = true; st.y *= 0.9; }
      st.trace.push(st.y); if (st.trace.length > 280) st.trace.shift();
      if (st.reg !== "silent") st.hist[st.reg] += dt;
    };

    // ---------------- drawing ----------------
    const drawStage = (mood) => {
      const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, C.dark ? "#16233A" : "#FFF9F1"); g.addColorStop(1, C.dark ? "#0F1A2C" : "#FDEBD8"); c.fillStyle = g; c.fillRect(0, 0, W, H);
      // swirl lines like the slides
      c.strokeStyle = C.dark ? "rgba(255,183,77,.18)" : "rgba(242,140,40,.18)"; c.lineWidth = 2;
      for (let i = 0; i < 4; i++) { c.beginPath(); c.ellipse(210, 290, 150 + i * 18, 70 + i * 10, -0.3 + Math.sin(t * 0.5 + i) * 0.05, 0, TAU); c.stroke(); }
      c.fillStyle = C.dark ? "#2A3A55" : "#EBD9C3"; c.fillRect(0, H - 40, 440, 40);
    };
    const drawViolinist = (mood) => {
      const px = 210, py = H - 92;
      // violin on the left shoulder (screen right of the head), bow across it
      k.person(c, px, py, { s: 2.2, shirt: "#1A1A1A", tux: true, bow: true, glasses: true, hair: "spiky", mood, arms: [[54, -4], [-34 + (bow.x - 0.5) * 60, 30]] });
      const vx = px + 58, vy = py - 112; // violin body, under the chin on the left shoulder
      c.save(); c.translate(vx, vy); c.rotate(-0.18);
      c.fillStyle = "#E8893A"; c.strokeStyle = "#7A3E12"; c.lineWidth = 2; c.beginPath(); c.ellipse(-14, 0, 22, 17, 0, 0, TAU); c.ellipse(16, 0, 18, 14, 0, 0, TAU); c.fill(); c.stroke();
      c.fillStyle = "#3A2A1A"; c.fillRect(30, -3, 60, 6); c.beginPath(); c.arc(94, 0, 6, 0, TAU); c.fill();
      c.strokeStyle = "#ddd"; c.lineWidth = 0.8; for (let s = -2; s <= 2; s += 1.4) { c.beginPath(); c.moveTo(-26, s); c.lineTo(92, s); c.stroke(); }
      c.restore();
      // bow: a long stick crossing the strings, sliding with the player's stroke
      const bx = vx - 16 + (bow.x - 0.5) * 110, by = vy + 4;
      c.save(); c.translate(bx, by); c.rotate(1.25); c.strokeStyle = "#6B3A1A"; c.lineWidth = 4; c.beginPath(); c.moveTo(-90, 0); c.lineTo(90, 0); c.stroke(); c.strokeStyle = "#F4ECD8"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-86, 5); c.lineTo(88, 5); c.stroke(); c.restore();
      // effects
      if (st.reg === "music") { for (let i = 0; i < 4; i++) { const a = (t * 0.6 + i / 4) % 1; k.note(c, px + 70 + i * 26 + Math.sin(t * 2 + i) * 6, py - 190 - a * 120, 1.2, `rgba(242,140,40,${1 - a})`); } k.sparkle(c, px - 80, py - 230, 8, "#FFB300"); k.sparkle(c, px + 130, py - 270, 6, "#FFB300"); }
      if (st.reg === "grip") { k.scribble(c, px - 10, py - 270, 20, C.ink3, t); k.text(c, "KRRRCH", px + 60, py - 250, "800 22px Roboto, sans-serif", C.coral); }
      if (st.reg === "slip") { k.text(c, "ffffff…", px + 60, py - 250, "italic 600 20px Roboto, sans-serif", C.ink3); }
    };
    const drawCloseUp = () => {
      const x0 = 470, y0 = 26, w = 466, h = 250;
      c.fillStyle = C.dark ? "#101D31" : "#FFFFFF"; k.rr(c, x0, y0, w, h, 14); c.fill(); c.strokeStyle = C.dark ? "#2C4060" : "#1A2B44"; c.lineWidth = 2; c.stroke();
      k.text(c, "CLOSE-UP AT THE BOW · SLOW MOTION", x0 + 16, y0 + 24, "600 11px Roboto Mono, monospace", C.ink3);
      // string: nut (left) → contact point → bridge (right); the bow crosses it
      const cy = y0 + 140, xc = x0 + 300, yc = cy + st.y;
      c.strokeStyle = C.dark ? "#C9D6E6" : "#555"; c.lineWidth = 3; c.beginPath(); c.moveTo(x0 + 20, cy); c.lineTo(xc, yc); c.lineTo(x0 + w - 20, cy); c.stroke();
      c.fillStyle = C.ink2; c.fillRect(x0 + 14, cy - 10, 6, 20); c.fillRect(x0 + w - 20, cy - 10, 6, 20);
      // bow (seen end-on along its length, moving up/down): stick + hair
      const bowY = yc; c.save(); c.translate(xc, bowY); c.rotate(-0.42);
      c.strokeStyle = "#6B3A1A"; c.lineWidth = 7; c.beginPath(); c.moveTo(-150, -10); c.lineTo(160, -10); c.stroke();
      c.strokeStyle = "#E8DCC0"; c.lineWidth = 4; c.beginPath(); c.moveTo(-150, -2); c.lineTo(160, -2); c.stroke(); c.restore();
      // arrows and phase label
      const lab = st.reg === "music" ? (st.stick ? "GRIP" : "SLIP") : st.reg === "slip" ? "SLIP · SLIP · SLIP" : st.reg === "grip" ? "GRIP · GRIP · tear" : "bow resting";
      const col = st.reg === "music" ? (st.stick ? C.coral : C.teal) : st.reg === "silent" ? C.ink3 : C.ink2;
      k.text(c, lab, xc, y0 + 62, "800 24px Roboto, sans-serif", col, "center");
      if (st.reg === "music") k.text(c, st.stick ? "the bow drags the string along" : "tension wins: the string flies back", xc, y0 + 82, "13px Roboto, sans-serif", C.ink2, "center");
      // verdict
      const v = { music: ["♪ Grip + slip = music", C.teal], slip: ["Too light: it only slips", C.ink2], grip: ["Too heavy: it only grips", C.coral], silent: ["Drag across the scene to bow", C.ink3] }[st.reg];
      k.rr(c, x0 + 16, y0 + h - 46, w - 32, 32, 16); c.fillStyle = st.reg === "music" ? "rgba(94,209,200,.18)" : "rgba(127,140,155,.12)"; c.fill();
      k.text(c, v[0], x0 + w / 2, y0 + h - 25, "700 15px Roboto, sans-serif", v[1], "center");
    };
    const drawWindow = () => { // Schelleng diagram: force against bow speed, playable wedge
      const x0 = 470, y0 = 296, w = 466, h = 214;
      c.fillStyle = C.dark ? "#101D31" : "#FFFFFF"; k.rr(c, x0, y0, w, h, 14); c.fill(); c.strokeStyle = C.rule; c.lineWidth = 1; c.stroke();
      const px = (v) => x0 + 54 + (v / 0.5) * (w - 80), py = (F) => y0 + h - 30 - (F / 1.6) * (h - 50);
      c.fillStyle = "rgba(94,209,200,.22)"; c.beginPath(); for (let v = 0; v <= 0.5; v += 0.01) c.lineTo(px(v), py(Math.min(1.6, fmax(v, bow.beta)))); for (let v = 0.5; v >= 0; v -= 0.01) c.lineTo(px(v), py(Math.min(1.6, fmin(v, bow.beta)))); c.closePath(); c.fill();
      c.strokeStyle = C.ink3; c.beginPath(); c.moveTo(px(0), py(0)); c.lineTo(px(0.5), py(0)); c.moveTo(px(0), py(0)); c.lineTo(px(0), py(1.6)); c.stroke();
      k.text(c, "bow speed →", px(0.5), py(0) + 18, "11px Roboto Mono, monospace", C.ink3, "right");
      c.save(); c.translate(x0 + 18, py(0.8)); c.rotate(-Math.PI / 2); k.text(c, "bow force →", 0, 0, "11px Roboto Mono, monospace", C.ink3, "center"); c.restore();
      k.text(c, "only grips (crunch)", px(0.08), py(1.4), "600 12px Roboto, sans-serif", C.coral);
      k.text(c, "music", px(0.33), py(fmin(0.33, bow.beta) + 0.18), "700 14px Roboto, sans-serif", C.teal);
      k.text(c, "only slips (whisper)", px(0.3), py(0.08), "600 12px Roboto, sans-serif", C.ink2);
      k.text(c, "WHEN DOES A STRING SING?", x0 + 16, y0 + 22, "600 11px Roboto Mono, monospace", C.ink3);
      const dx = px(Math.min(0.5, bow.v)), dy = py(bow.F); c.fillStyle = st.reg === "music" ? C.teal : st.reg === "grip" ? C.coral : C.ink; c.beginPath(); c.arc(dx, dy, 8, 0, TAU); c.fill(); c.strokeStyle = "#fff"; c.lineWidth = 2; c.stroke();
    };
    const drawTrace = (label) => {
      P.clearRect(0, 0, W, PH); P.fillStyle = C.dark ? "#101D31" : "#F1F4F8"; k.rr(P, 0, 0, W, PH, 12); P.fill();
      P.strokeStyle = C.coral; P.lineWidth = 2; P.beginPath(); st.trace.forEach((y, i) => { const x = 40 + (i / 279) * (W - 60), yy = PH / 2 - y * 1.1; i ? P.lineTo(x, yy) : P.moveTo(x, yy); }); P.stroke();
      k.text(P, label || "string at the bow, slow motion: a clean saw-tooth = grip (slow ramp) then slip (fast return)", 40, PH - 10, "11px Roboto Mono, monospace", C.ink3);
    };
    const hud = (txt) => k.text(c, txt, 24, 36, "700 17px Roboto, sans-serif", C.ink);
    const hint = () => k.text(c, "Drag left–right to bow · higher = lighter, lower = heavier · or ← → and ↑ ↓", 24, H - 14, "12px Roboto, sans-serif", C.ink3);
    const mood = () => (st.reg === "music" ? 1 : st.reg === "silent" ? 0.3 : -0.6);

    let frame = () => {};
    const loop = (now) => { if (!alive) return; const dt = Math.min((now - last) / 1000, 0.04); last = now; t += dt; frame(dt); raf = requestAnimationFrame(loop); };
    const ctrl = (html) => { api.controls.innerHTML = html; k.muteButton(api.controls); };

    // ======================= GAME =======================
    if (mode === "game") {
      (async () => {
        const res = [];
        await api.card(`<span class="lp-k">Tutorial · before the catheter games</span><h3>The violinist's secret</h3><p>A violin sings because of friction. The bow <b>grips</b> the string and drags it along, until the string's tension wins and it <b>slips</b> back. Grip, slip, grip, slip, hundreds of times a second: that is the note.</p><p>Too little pressure and the bow only slips: a whisper. Too much and it only grips: a crunch. Find the window between them.</p><p class="muted">Sound on, if you can.</p>`, [{ label: "Pick up the bow" }]);
        if (!alive) return; S = snd();
        // ---- level 1: find the sound
        ctrl(`<span class="lab-note">Level 1 of 3 · Find the sound: keep the dot in the green window for 5 s</span>`);
        res.push(await new Promise((done) => { let T = 0, good = 0;
          frame = (dt) => { T += dt; update(dt); if (st.reg === "music") good += dt; sound(st.reg, Math.min(1, bow.v / 0.25), NOTE.A);
            c.clearRect(0, 0, W, H); drawStage(); drawViolinist(mood()); drawCloseUp(); drawWindow(); drawTrace();
            hud(`Clean tone ${good.toFixed(1)} / 5 s`); k.text(c, `${Math.max(0, Math.ceil(30 - T))} s`, 24, 58, "13px Roboto Mono, monospace", C.ink3); hint();
            if (good >= 5 || T >= 30) { frame = () => {}; const sc = Math.round(Math.min(1, good / 5) * 100 - (good >= 5 ? Math.max(0, T - 12) : 0)); done(Math.max(20, Math.min(100, sc))); } }; }));
        sound("silent", 0, NOTE.A); api.log("game", "L1", { score: res[0], slip: st.hist.slip, grip: st.hist.grip });
        await api.card(`<h3>${res[0]} / 100</h3><p>You heard all three: the <b>whisper</b> when the bow only slips, the <b>crunch</b> when it only grips, and the <b>note</b> when both alternate. The window gets wider the faster you bow, and moves with where you bow.</p>`, [{ label: "Level 2: play the tune" }]);
        if (!alive) return;
        // ---- level 2: play the tune
        ctrl(`<span class="lab-note">Level 2 of 3 · Play the tune: keep the note clean while each one passes the line</span>`);
        res.push(await new Promise((done) => { const dur = 1.25, notes = TUNE.map((n, i) => ({ n, t0: 2 + i * dur })); let T = 0, inT = 0, tot = 0;
          frame = (dt) => { T += dt; update(dt); const cur = notes.find((q) => T >= q.t0 && T < q.t0 + dur); const f0 = cur ? NOTE[cur.n] : NOTE.A;
            if (cur) { tot += dt; if (st.reg === "music") inT += dt; }
            sound(st.reg, Math.min(1, bow.v / 0.25), f0);
            c.clearRect(0, 0, W, H); drawStage(); drawViolinist(mood()); drawCloseUp(); drawWindow();
            hud(`Tune ${Math.round((inT / Math.max(0.01, tot)) * 100)}% clean`);
            // note lane in the plot strip
            P.clearRect(0, 0, W, PH); P.fillStyle = C.dark ? "#101D31" : "#FFF7EC"; k.rr(P, 0, 0, W, PH, 12); P.fill();
            const lx = 140; P.strokeStyle = C.coral; P.lineWidth = 3; P.beginPath(); P.moveTo(lx, 10); P.lineTo(lx, PH - 10); P.stroke();
            notes.forEach((q, i) => { const x = lx + (q.t0 - T) * 160, y = PH - 26 - ("CDEFGA".indexOf(q.n)) * 18; if (x < -80 || x > W) return; const w = dur * 160 - 8;
              const playing = q === cur; P.fillStyle = playing ? (st.reg === "music" ? C.teal : C.coral) : C.dark ? "#2C4060" : "#E9D6BE"; k.rr(P, x, y - 10, w, 18, 9); P.fill();
              k.text(P, q.n + (i % 2 ? " ↑" : " ↓"), x + 8, y + 4, "700 12px Roboto Mono, monospace", playing ? "#fff" : C.ink2); });
            k.text(P, "bow on the line · ↓ ↑ = change bow direction", lx + 10, 18, "11px Roboto Mono, monospace", C.ink3);
            if (T > notes[notes.length - 1].t0 + dur + 0.5) { frame = () => {}; done(Math.round((inT / Math.max(0.01, tot)) * 100)); } }; }));
        sound("silent", 0, NOTE.A); api.log("game", "L2", { score: res[1] });
        await api.card(`<h3>${res[1]}% of the tune clean</h3><p>A violinist does this without thinking: bow speed and pressure are adjusted all the time so that grip and slip keep alternating. <b>The violinist is in full control of friction.</b></p><p>Physicians handling a catheter are not. Its friction is fixed by its coating and the vessel wall.</p>`, [{ label: "Level 3: the physician's bow" }]);
        if (!alive) return;
        // ---- level 3: the analogy, as four decisions
        res.push(await physicianQuiz());
        if (!alive) return;
        const total = Math.round((res[0] + res[1] + res[2]) / 3), nb = api.best(total, `${total} / 100`);
        api.log("game", "total", { score: total, l1: res[0], l2: res[1], l3: res[2] });
        const go = await api.card(`<span class="lp-k">Debrief</span><h3>${total} / 100${nb ? " · new best" : ""}</h3>
          <ul class="ls-res"><li>Find the sound <b>${res[0]}</b></li><li>Play the tune <b>${res[1]}</b></li><li>The physician's bow <b>${res[2]}</b></li></ul>
          <p>A violin needs <b>grip and slip</b>. A catheter needs <b>glide or grip</b>, each at the right moment: glide to navigate without damaging the wall, grip to hold still while a stent is placed. Ultrasonic lubrication gives the physician that control, like the bow gives it to the violinist.</p>
          <p>Now feel the physics behind it.</p>`, [{ label: "▶ Squeeze-film lab" }, { label: "Catheter run" }, { label: "Play again" }]);
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
          ctrl(`<span class="lab-note">Level 3 of 3 · The physician's bow: glide or grip?</span><button class="lab-us" id="q-glide" type="button">〰 Glide (vibration on)</button><button class="lab-hold" id="q-grip" type="button">⚓ Grip (vibration off)</button>`);
          const pick = (a) => { if (picked) return; picked = a; if (a === Q[i].a) { right++; k.audio.pluck(523, 0.4); k.audio.pluck(659, 0.5); } else k.audio.noise(0.25, 0.12, 250); fb = 2.6; };
          document.getElementById("q-glide").addEventListener("click", () => pick("glide")); document.getElementById("q-grip").addEventListener("click", () => pick("grip"));
          frame = (dt) => {
            const q = Q[i]; c.clearRect(0, 0, W, H);
            const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, C.dark ? "#16233A" : "#F4FAFD"); g.addColorStop(1, C.dark ? "#0F1A2C" : "#E3F1F7"); c.fillStyle = g; c.fillRect(0, 0, W, H);
            // left: the violinist in full control · right: the physician, deciding
            k.person(c, 140, 430, { s: 1.6, shirt: "#1A1A1A", tux: true, bow: true, glasses: true, hair: "spiky", mood: 1, arms: [[-26, 4], [30, 18]] });
            k.text(c, "Violinist: in control", 140, 530, "600 13px Roboto, sans-serif", C.ink2, "center");
            const ok = picked ? picked === q.a : null;
            k.person(c, 820, 430, { s: 1.6, shirt: "#7CC6D9", sleeve: "#7CC6D9", pants: "#7CC6D9", cap: "#7CC6D9", glasses: ok === true, mood: ok === null ? -0.1 : ok ? 1 : -0.6, arms: [[-20, -38], [26, 20]] });
            if (ok === null) { k.scribble(c, 790, 280, 14, C.ink3, t); k.text(c, "?", 845, 290, "800 34px Roboto, sans-serif", C.ink3); }
            k.text(c, "Physician: you decide", 820, 530, "600 13px Roboto, sans-serif", C.ink2, "center");
            // middle: the scene
            drawVessel(q.scene, picked);
            k.text(c, `Situation ${i + 1} of 4`, W / 2, 46, "600 12px Roboto Mono, monospace", C.ink3, "center");
            k.wrap(c, q.s, W / 2, 76, 520, 26, "700 21px Roboto, sans-serif", C.ink, "center");
            if (picked) { k.wrap(c, (ok ? "✓ Right. " : "✗ Not quite. ") + q.why, W / 2, 420, 520, 20, "600 15px Roboto, sans-serif", ok ? C.teal : C.coral, "center");
              fb -= dt; if (fb <= 0) { i++; picked = null; if (i >= Q.length) { frame = () => {}; const sc = Math.round((right / Q.length) * 100); api.log("game", "L3", { score: sc }); done(sc); } } }
            P.clearRect(0, 0, W, PH); P.fillStyle = C.dark ? "#101D31" : "#F1F4F8"; k.rr(P, 0, 0, W, PH, 12); P.fill();
            k.text(P, "VIOLIN", 60, 44, "700 13px Roboto Mono, monospace", C.coral); k.text(P, "needs grip AND slip, in turn, to sing", 140, 44, "15px Roboto, sans-serif", C.ink);
            k.text(P, "CATHETER", 60, 92, "700 13px Roboto Mono, monospace", C.teal); k.text(P, "needs glide OR grip, as the task demands, to work safely", 140, 92, "15px Roboto, sans-serif", C.ink);
            k.text(P, "ultrasonic lubrication is the physician's bow", 140, 128, "italic 13px Roboto, sans-serif", C.ink3);
          };
        });
      }
      function drawVessel(scene, picked) {
        const x0 = 270, y0 = 130, w = 420, h = 250;
        c.save(); k.rr(c, x0, y0, w, h, 16); c.clip();
        c.fillStyle = "#C8473A"; c.fillRect(x0, y0, w, h);
        const wall = (path, wd, col) => { c.strokeStyle = col; c.lineWidth = wd; c.lineCap = "round"; c.beginPath(); path(); c.stroke(); };
        const route = scene === "bend" ? () => { c.moveTo(x0 - 20, y0 + 190); c.bezierCurveTo(x0 + 120, y0 + 190, x0 + 90, y0 + 50, x0 + 220, y0 + 60); c.bezierCurveTo(x0 + 340, y0 + 70, x0 + 300, y0 + 200, x0 + w + 20, y0 + 180); }
          : () => { c.moveTo(x0 - 20, y0 + h / 2); c.lineTo(x0 + w + 20, y0 + h / 2); };
        wall(route, 120, "#E36A5C"); wall(route, 80, "#F7C6BE");
        if (scene !== "bend") { c.fillStyle = scene === "calc" ? "#F0EAD6" : "#F2C94C"; [-1, 1].forEach((sg) => { c.beginPath(); c.ellipse(x0 + 260, y0 + h / 2 + sg * 34, 46, 16, 0, 0, TAU); c.fill(); }); }
        // catheter
        c.strokeStyle = "#3B82C4"; c.lineWidth = 10; c.beginPath(); scene === "bend" ? (() => { c.moveTo(x0 - 20, y0 + 190); c.bezierCurveTo(x0 + 120, y0 + 190, x0 + 90, y0 + 50, x0 + 220, y0 + 60); })() : (() => { c.moveTo(x0 - 20, y0 + h / 2); c.lineTo(x0 + 250, y0 + h / 2); })(); c.stroke();
        if (scene === "stent" || scene === "valve") { c.fillStyle = "#5BA7E0"; c.beginPath(); c.ellipse(x0 + 260, y0 + h / 2, 44, 16, 0, 0, TAU); c.fill(); c.strokeStyle = "#E6EEF5"; c.lineWidth = 1.5; for (let q = -36; q <= 36; q += 9) { c.beginPath(); c.moveTo(x0 + 260 + q, y0 + h / 2 - 14); c.lineTo(x0 + 264 + q, y0 + h / 2 + 14); c.stroke(); } }
        if (picked === "glide") { c.strokeStyle = "rgba(94,209,200,.9)"; c.lineWidth = 2; for (let r = 0; r < 3; r++) { const a = (t * 2 + r / 3) % 1; c.globalAlpha = 1 - a; c.beginPath(); c.arc(x0 + 200, y0 + (scene === "bend" ? 70 : h / 2), 12 + a * 30, 0, TAU); c.stroke(); } c.globalAlpha = 1; }
        if (picked === "grip") k.text(c, "⚓", x0 + 200, y0 + (scene === "bend" ? 100 : h / 2 + 50), "28px serif", "#fff", "center");
        c.restore(); c.strokeStyle = C.rule; c.lineWidth = 2; k.rr(c, x0, y0, w, h, 16); c.stroke();
      }
    }

    // ======================= EXPLORE =======================
    if (mode === "explore") {
      ctrl(`<label class="lab-range">Bow position β <input type="range" id="v-b" min="0.05" max="0.2" step="0.005" value="0.1"><output id="v-bo">1/10 of the string</output></label>
        <label class="lab-select">Note <select id="v-n">${Object.keys(NOTE).map((n) => `<option${n === "A" ? " selected" : ""}>${n}</option>`).join("")}</select></label><span class="lab-note">Bow closer to the bridge (smaller β): needs more force, gives a brighter, louder tone</span>`);
      const bi = document.getElementById("v-b"), bo = document.getElementById("v-bo"), ni = document.getElementById("v-n");
      bi.addEventListener("input", () => { bow.beta = +bi.value; bo.textContent = `1/${Math.round(1 / bow.beta)} of the string`; });
      let note = "A"; ni.addEventListener("change", () => (note = ni.value));
      const startSound = () => { if (!S) S = snd(); };
      on(api.canvas, "pointerdown", startSound); on(window, "keydown", startSound);
      frame = (dt) => { update(dt); sound(st.reg, Math.min(1, bow.v / 0.25), NOTE[note]);
        c.clearRect(0, 0, W, H); drawStage(); drawViolinist(mood()); drawCloseUp(); drawWindow(); drawTrace();
        hud(`force ${bow.F.toFixed(2)} N · speed ${bow.v.toFixed(2)} m/s`); k.text(c, `window ${st.lo.toFixed(2)}–${st.hi.toFixed(2)} N`, 24, 58, "13px Roboto Mono, monospace", C.ink3); hint(); };
    }
    raf = requestAnimationFrame(loop);
    return () => { alive = false; cancelAnimationFrame(raf); off.forEach((f) => f()); if (S) S.stop(); api.hideCard(); };
  };
})();
