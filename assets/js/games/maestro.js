/* Lab tutorial B · The maestro and the cam (coordination).
   An orchestra needs a maestro to keep every player on the same beat. OSCAR's twelve sliders need
   the same: each slider grips the wall while it slowly retracts (pulling the capsule forward) and
   pushes back while it quickly advances. Net thrust exists only while more sliders retract than
   advance (n_ret > n_adv), so the advances must be spread out in time, one after another, never
   bunched and never late (a slider at the end of its stroke stops pulling). The cam does this
   mechanically: it is the capsule's maestro.
   Game: 1 Keep the orchestra together · 2 Conduct the capsule yourself · 3 Let the cam conduct. */
(function () {
  window.LabGames = window.LabGames || {};
  const TAU = Math.PI * 2;
  const ARP = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63]; // C E G C' G E
  const INST = [["violin", "#E8893A"], ["flute", "#B8C2CC"], ["cello", "#B5651D"], ["xylophone", "#F2C94C"], ["trumpet", "#E0B040"], ["violin", "#E8893A"]];

  window.LabGames.maestro = (api, mode) => {
    const k = window.LabKit, { ctx: c, W, H, plot: P, PH } = api;
    let C = api.colors(), alive = true, raf = 0, last = performance.now(), t = 0;
    const off = [], on = (el, ev, f, o) => { el.addEventListener(ev, f, o); off.push(() => el.removeEventListener(ev, f, o)); };
    on(document, "themechange", () => (C = api.colors()));
    let cueFn = null;
    const cue = () => { k.audio.get(); if (cueFn) cueFn(); };
    on(window, "keydown", (e) => { if (e.code === "Space" && document.activeElement?.tagName !== "INPUT") { e.preventDefault(); if (!e.repeat) cue(); } });
    on(api.canvas, "pointerdown", () => cue());
    const ctrl = (html) => { api.controls.innerHTML = html; const b = api.controls.querySelector("#m-cue"); b && b.addEventListener("pointerdown", (e) => { e.preventDefault(); cue(); }); k.muteButton(api.controls); };
    const bg = (top, bot) => { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, C.dark ? "#16233A" : top); g.addColorStop(1, C.dark ? "#0F1A2C" : bot); c.fillStyle = g; c.fillRect(0, 0, W, H); };
    const plotBg = () => { P.clearRect(0, 0, W, PH); P.fillStyle = C.dark ? "#101D31" : "#F1F4F8"; k.rr(P, 0, 0, W, PH, 12); P.fill(); };

    // a rhythm lane: beats scroll toward the "now" line; marks show the player's cues
    const lane = (T, B, cues, label, x0 = 30, y = 30, w = W - 60) => {
      c.fillStyle = C.dark ? "rgba(16,29,49,.85)" : "rgba(255,255,255,.85)"; k.rr(c, x0, y - 22, w, 44, 22); c.fill();
      const nowX = x0 + 120, pps = 170;
      for (let b = Math.floor((T - 1) / B); b < (T + 6) / B; b++) { if (b < 0) continue; const x = nowX + (b * B - T) * pps; if (x < x0 + 74 || x > x0 + w - 8) continue; c.fillStyle = C.ink3; c.beginPath(); c.arc(x, y, 6, 0, TAU); c.fill(); }
      cues.forEach((q) => { const x = nowX + (q.t - T) * pps; if (x < x0 + 74 || x > x0 + w) return; c.fillStyle = Math.abs(q.err) < B * 0.12 ? C.teal : Math.abs(q.err) < B * 0.3 ? C.gold : C.coral; c.beginPath(); c.arc(x, y, 9, 0, TAU); c.fill(); });
      c.strokeStyle = C.coral; c.lineWidth = 3; c.beginPath(); c.moveTo(nowX, y - 18); c.lineTo(nowX, y + 18); c.stroke();
      k.text(c, label, x0 + 16, y + 5, "700 12px Roboto Mono, monospace", C.ink2);
    };
    // rhythm-game cue: a ring shrinks onto the target and closes exactly on the beat
    const ring = (x, y, T, B, label) => { const ph = ((T / B) % 1 + 1) % 1, r = 18 + 70 * (1 - ph);
      c.strokeStyle = C.coral; c.lineWidth = 3; c.globalAlpha = 0.35 + 0.65 * ph; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke(); c.globalAlpha = 1;
      c.strokeStyle = C.ink; c.lineWidth = 2.5; c.setLineDash([4, 4]); c.beginPath(); c.arc(x, y, 18, 0, TAU); c.stroke(); c.setLineDash([]);
      if (ph > 0.85 || ph < 0.08) { c.fillStyle = "rgba(94,209,200,.35)"; c.beginPath(); c.arc(x, y, 18, 0, TAU); c.fill(); }
      if (label) k.text(c, label, x, y - 96, "800 14px Roboto, sans-serif", C.coral, "center"); };
    const err = (T, B) => { const n = Math.round(T / B); return { n, e: T - n * B }; };

    // ---------------- the orchestra scene ----------------
    const drawOrchestra = (mood, played, conductorOn, bubble) => {
      bg("#FFFDF8", "#FFF1E3");
      c.fillStyle = C.dark ? "#2A3A55" : "#EAD9C2"; k.rr(c, 20, 380, 560, 40, 10); c.fill(); // stage
      INST.forEach(([inst, col], i) => { const x = 90 + i * 84, y = 372 - Math.abs(i - 2.5) * 8, hot = played[i] > 0;
        k.person(c, x, y, { s: 1.15, shirt: ["#C9A27E", "#E8B04A", "#A87FBF", "#5B8FC9", "#D9A35B", "#C9A27E"][i], pants: "#1A1A1A", mood: mood, hair: i % 2 ? "bun" : null, arms: [[-16, 6], [18, 4]] });
        c.fillStyle = col; c.strokeStyle = "#5A3A1A"; c.lineWidth = 1.2;
        if (inst === "violin") { c.beginPath(); c.ellipse(x + 18, y - 52, 10, 6, -0.5, 0, TAU); c.fill(); c.stroke(); }
        if (inst === "cello") { c.beginPath(); c.ellipse(x + 4, y - 10, 12, 20, 0, 0, TAU); c.fill(); c.stroke(); }
        if (inst === "flute") { c.fillRect(x + 4, y - 62, 30, 3); }
        if (inst === "xylophone") { c.fillRect(x - 22, y - 26, 44, 8); }
        if (inst === "trumpet") { c.beginPath(); c.moveTo(x + 10, y - 60); c.lineTo(x + 30, y - 56); c.lineTo(x + 34, y - 64); c.closePath(); c.fill(); }
        if (hot) { const a = 1 - played[i]; k.note(c, x + 14, y - 100 - a * 40, 1.4, `rgba(242,140,40,${played[i]})`); }
      });
      // maestro
      const sw = conductorOn ? Math.sin(t * TAU / 0.7) : 0;
      if (conductorOn) k.person(c, 600, 470, { s: 1.35, shirt: "#1A1A1A", tux: true, bow: true, glasses: conductorOn, hair: "spiky", mood: conductorOn ? 1 : -0.2, arms: [[-24, 10], [26, -40 + sw * 14]] });
      if (conductorOn) { const hx = 600 + 1.35 * (12 - 24), hy = 470 + 1.35 * (-46 - 40 + sw * 14); c.strokeStyle = C.ink; c.lineWidth = 2.4; c.beginPath(); c.moveTo(hx, hy); c.lineTo(hx - 30, hy - 30 + sw * 10); c.stroke(); }
      else { c.fillStyle = C.dark ? "#2A3A55" : "#D8C3A8"; k.rr(c, 570, 448, 60, 22, 4); c.fill(); k.text(c, "empty podium", 600, 492, "italic 14px Roboto, sans-serif", C.ink3, "center"); }
      // audience
      for (let i = 0; i < 4; i++) k.fan(c, 718 + i * 58 + (i % 2) * 6, 440 + (i % 2) * 10, mood, t, i);
      if (bubble) { c.fillStyle = C.dark ? "#22344F" : "#fff"; k.rr(c, 690, 320, 250, 44, 14); c.fill(); c.strokeStyle = C.rule; c.stroke(); k.text(c, bubble, 815, 348, "700 16px Roboto, sans-serif", mood < 0 ? C.coral : C.teal, "center"); }
    };

    // ---------------- the capsule and its sliders ----------------
    const mk = (n) => Array.from({ length: n }, (_, i) => ({ p: i / n, st: "ret", adv: 0, face: 0 }));
    const stepSl = (sl, dt, cycle, advDur) => { let F = 0; sl.forEach((s) => {
      if (s.st === "adv") { s.adv -= dt; s.p = Math.max(0, s.p - dt / advDur * s.p0); if (s.adv <= 0) { s.st = "ret"; s.p = 0; } F -= 1; }
      else { s.p += dt / cycle; if (s.p >= 1) { s.p = 1; s.st = "stall"; } else s.st = "ret"; if (s.st === "ret") F += 1; } }); return F / sl.length; };
    const fire = (sl, advDur) => { const s = sl.filter((q) => q.st !== "adv").sort((a, b) => b.p - a.p)[0]; if (!s) return null; s.st = "adv"; s.adv = advDur; s.p0 = s.p; return s; };
    const drawSliderCrew = (sl, x0, y0, w, label) => {
      const n = sl.length, dx = w / n;
      sl.forEach((s, i) => { const x = x0 + dx * (i + 0.5), y = y0 + 64, col = s.st === "adv" ? C.coral : s.st === "stall" ? "#9AA5B1" : C.teal;
        // body: a slider cover (ridged cylinder) with a face, like the slides
        c.fillStyle = "#F1ECE0"; c.strokeStyle = "#5A5A5A"; c.lineWidth = 1.2; k.rr(c, x - 12, y - 46, 24, 60, 10); c.fill(); c.stroke();
        c.strokeStyle = "rgba(0,0,0,.18)"; for (let r = y - 40; r < y + 10; r += 6) { c.beginPath(); c.moveTo(x - 11, r); c.lineTo(x + 11, r); c.stroke(); }
        c.fillStyle = col; k.rr(c, x - 12, y + 16, 24, 6, 3); c.fill();
        c.fillStyle = "#1A1A1A"; c.beginPath(); c.arc(x - 4, y - 30, 1.6, 0, TAU); c.arc(x + 4, y - 30, 1.6, 0, TAU); c.fill();
        c.strokeStyle = "#1A1A1A"; c.lineWidth = 1.4; c.beginPath(); if (s.st === "stall") { c.moveTo(x - 4, y - 22); c.lineTo(x + 4, y - 22); } else if (s.st === "adv") c.arc(x, y - 22, 3.5, 0, TAU); else c.arc(x, y - 25, 4, 0.15 * Math.PI, 0.85 * Math.PI); c.stroke();
        c.lineWidth = 1.6; c.beginPath(); c.moveTo(x - 6, y + 14); c.lineTo(x - 7, y + 26); c.moveTo(x + 6, y + 14); c.lineTo(x + 7, y + 26); c.stroke();
        // stroke gauge (how far it has retracted)
        c.fillStyle = C.dark ? "#22344F" : "#E5E9EF"; k.rr(c, x - 12, y + 32, 24, 5, 2.5); c.fill(); c.fillStyle = col; k.rr(c, x - 12, y + 32, 24 * s.p, 5, 2.5); c.fill();
      });
      k.text(c, label, x0, y0 + 2, "600 11px Roboto Mono, monospace", C.ink3);
    };
    const drawCapsule = (sl, x, y, rock, lumenShift) => {
      // colon (pink) scrolling past
      c.fillStyle = C.dark ? "#3A2230" : "#F6D7D2"; c.fillRect(0, y - 70, W, 140);
      const wy = (xx, sg) => y + sg * (40 - 8 * Math.max(0, Math.sin((xx + lumenShift) / 30)) ** 4 + 12 * Math.exp(-Math.pow((xx - x) / 120, 4)));
      c.fillStyle = C.dark ? "#1E1420" : "#FFF3F0"; c.beginPath(); for (let xx = 0; xx <= W; xx += 6) c.lineTo(xx, wy(xx, -1)); for (let xx = W; xx >= 0; xx -= 6) c.lineTo(xx, wy(xx, 1)); c.fill();
      c.strokeStyle = C.dark ? "#B05A6E" : "#D98C8C"; c.lineWidth = 2; [-1, 1].forEach((sg) => { c.beginPath(); for (let xx = 0; xx <= W; xx += 6) c.lineTo(xx, wy(xx, sg)); c.stroke(); });
      c.save(); c.translate(0, rock);
      const L = 230, R = 42, x0 = x - L / 2, x1 = x + L / 2;
      const body = () => { c.beginPath(); c.moveTo(x0 + 10, y - R); c.lineTo(x1 - 50, y - R); c.quadraticCurveTo(x1, y - R * 0.7, x1 + 8, y); c.quadraticCurveTo(x1, y + R * 0.7, x1 - 50, y + R); c.lineTo(x0 + 10, y + R); c.quadraticCurveTo(x0, y + R, x0, y + R - 10); c.lineTo(x0, y - R + 10); c.quadraticCurveTo(x0, y - R, x0 + 10, y - R); c.closePath(); };
      const g = c.createLinearGradient(0, y - R, 0, y + R); g.addColorStop(0, "#F6F2E8"); g.addColorStop(0.5, "#D9D2C2"); g.addColorStop(1, "#A9A190"); body(); c.fillStyle = g; c.fill();
      c.save(); body(); c.clip();
      const n = sl.length; for (let i = 0; i < n; i++) { const a = TAU * i / n; if (Math.sin(a) < -0.05) continue; const s = sl[i], yy = y - Math.cos(a) * (R - 4), h = 4 + 6 * Math.sin(a), off = -s.p * 34;
        c.globalAlpha = 0.55 + 0.45 * Math.sin(a); c.fillStyle = s.st === "adv" ? C.coral : s.st === "stall" ? "#9AA5B1" : "#2BA89E"; c.fillRect(x0 + 8 + off, yy - h / 2, L - 40, h);
        c.fillStyle = "rgba(0,0,0,.22)"; for (let q = x0 + 12 + off; q < x0 + L - 34 + off; q += 8) c.fillRect(q, yy - h / 2, 2, h); c.globalAlpha = 1; }
      c.restore(); body(); c.strokeStyle = "rgba(60,55,45,.6)"; c.lineWidth = 1.4; c.stroke();
      c.strokeStyle = C.ink3; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x0, y); c.bezierCurveTo(x0 - 60, y + 10, x0 - 120, y - 6, -10, y + 4); c.stroke();
      c.restore();
    };
    const drawCam = (x, y, ang, on) => {
      c.save(); c.translate(x, y); c.fillStyle = C.dark ? "#22344F" : "#fff"; c.strokeStyle = C.ink2; c.lineWidth = 2; c.beginPath(); c.arc(0, 0, 34, 0, TAU); c.fill(); c.stroke();
      c.rotate(ang); c.fillStyle = on ? C.gold : "#C9CFD6"; c.beginPath(); for (let k2 = 0; k2 <= 60; k2++) { const a = k2 / 60 * TAU, r = 16 + 10 * ((k2 / 60) < 0.9 ? k2 / 54 : (1 - (k2 / 60 - 0.9) / 0.1)); c.lineTo(r * Math.cos(a), r * Math.sin(a)); } c.closePath(); c.fill(); c.stroke();
      c.fillStyle = C.ink; c.beginPath(); c.arc(0, 0, 4, 0, TAU); c.fill(); c.restore();
      if (on) { c.save(); c.translate(x + 22, y - 44); k.person(c, 0, 0, { s: 0.5, shirt: "#1A1A1A", tux: true, bow: true, glasses: true, hair: "spiky", mood: 1, arms: [[-14, 6], [14, -24]] }); c.restore(); }
      k.text(c, on ? "CAM = MAESTRO" : "CAM (off)", x, y + 52, "700 11px Roboto Mono, monospace", on ? C.gold : C.ink3, "center");
    };
    const thrustPlot = (Fs, label, ideal) => { plotBg(); const yOf = (v) => PH / 2 + 4 - v * (PH / 2 - 18);
      P.strokeStyle = C.rule; P.beginPath(); P.moveTo(40, yOf(0)); P.lineTo(W - 20, yOf(0)); P.stroke();
      if (ideal != null) { P.setLineDash([5, 5]); P.strokeStyle = C.gold; P.beginPath(); P.moveTo(40, yOf(ideal)); P.lineTo(W - 20, yOf(ideal)); P.stroke(); P.setLineDash([]); k.text(P, "cam", W - 50, yOf(ideal) - 6, "600 11px Roboto Mono, monospace", C.gold); }
      P.strokeStyle = C.coral; P.lineWidth = 2; P.beginPath(); Fs.forEach((v, i) => { const x = 40 + (i / Math.max(1, Fs.length - 1)) * (W - 60); i ? P.lineTo(x, yOf(v)) : P.moveTo(x, yOf(v)); }); P.stroke();
      k.text(P, label, 44, PH - 8, "11px Roboto Mono, monospace", C.ink3); };

    let frame = () => {};
    const loop = (now) => { if (!alive) return; const dt = Math.min((now - last) / 1000, 0.04); last = now; t += dt; frame(dt); raf = requestAnimationFrame(loop); };

    // ======================= GAME =======================
    if (mode === "game") {
      (async () => {
        const res = [];
        await api.card(`<span class="lp-k">Tutorial · before the OSCAR game</span><h3>The maestro and the cam</h3><p>An orchestra has many players. Each can play perfectly, and the music still falls apart if they are not on the same beat. Keeping them together is the maestro's job.</p><p>A self-propelling capsule has the same problem: twelve sliders, each pulling or pushing on the gut wall, and thrust only if they move in the right order and on time.</p><p><b>What you do:</b> a ring shrinks onto the player who plays next. Press <b>Space</b> (or the big button, or tap the scene) the moment the ring closes. That is all.</p><p class="muted">First you will hear the orchestra without a maestro. Sound on, if you can.</p>`, [{ label: "Listen to the orchestra" }]);
        if (!alive) return;
        // ---- level 1: the orchestra
        res.push(await new Promise((done) => {
          const B = 0.95, DEMO = 6, PLAY = 16, PRACT = 3; let frame0 = null, T = -1, phase = "demo", k1 = 0, cues = [], played = INST.map(() => 0), mood = 0.4, lastBeat = -1, misses = 0, auto = [];
          ctrl(`<button class="lab-hold" id="m-cue" type="button">🎼 Cue on the beat <kbd>Space</kbd></button><span class="lab-note">Level 1 of 3 · Keep the orchestra together</span>`);
          // demo: each player on their own clock
          for (let b = 0; b < DEMO; b++) for (let i = 0; i < 2; i++) auto.push({ t: b * B + (Math.random() - 0.5) * 0.9 * B, i: (b * 2 + i) % 6 });
          const play = (i, e) => { played[i] = 1; const det = 1 + Math.min(0.08, Math.abs(e) * 0.25) * (Math.random() < 0.5 ? -1 : 1); k.audio.pluck(ARP[i] * det, 0.6, "triangle", 0.16); };
          cueFn = () => { if (phase !== "play") return; const { n, e } = err(T - DEMO * B, B); if (n < 0 || n >= PLAY) return; if (cues.some((q) => q.n === n)) return; cues.push({ t: T, n, err: e }); play(k1 % 6, e); k1++; mood = mood * 0.75 + (1 - Math.min(1, Math.abs(e) / (0.35 * B)) * 2) * 0.25; };
          frame = (dt) => { T += dt; played = played.map((p) => Math.max(0, p - dt * 1.4));
            if (phase === "demo") { auto = auto.filter((a) => { if (T >= a.t) { play(a.i, 0.3); return false; } return true; }); mood = Math.max(-1, mood - dt * 0.18); if (T > DEMO * B) { phase = "wait"; frame0 = frame; frame = () => {}; api.card(`<span class="lp-k">Your turn</span><h3>Be the maestro</h3><p>Watch the coral ring: it shrinks onto the next player and closes on the beat. Press <b>Space</b> exactly then. The first ${PRACT} beats are practice.</p>`, [{ label: "Raise the baton" }]).then(() => { T = DEMO * B - B * 0.6; phase = "play"; mood = 0; frame = frame0; }); } }
            else { const nb = Math.floor((T - DEMO * B) / B - 0.5); if (nb > lastBeat) { lastBeat = nb; if (nb >= 0 && nb < PLAY && !cues.some((q) => q.n === nb)) { misses++; cues.push({ t: DEMO * B + nb * B + 0.45 * B, n: nb, err: 0.45 * B }); play(k1 % 6, 0.45); k1++; mood = mood * 0.7 - 0.3; } }
              if (T > DEMO * B + PLAY * B + 0.6) { frame = () => {}; cueFn = null; const sc2 = cues.filter((q) => q.n >= PRACT), me = sc2.reduce((a, q) => a + Math.abs(q.err), 0) / Math.max(1, sc2.length); done(Math.max(0, Math.round(100 * (1 - me / (0.45 * B))))); } }
            c.clearRect(0, 0, W, H);
            drawOrchestra(Math.max(-1, Math.min(1, mood)), played, phase === "play", phase === "demo" ? (T > 2 ? "Give me my money back!" : "…") : mood > 0.5 ? "Bravo!" : mood < -0.2 ? "Out of time!" : null);
            lane(T - DEMO * B, B, cues, phase === "demo" ? "NO MAESTRO" : "YOU", 30, 40, W - 60);
            if (phase === "play") { const i = k1 % 6, mx = 90 + i * 84, my = 372 - Math.abs(i - 2.5) * 8 - 66; const nb2 = Math.floor((T - DEMO * B) / B + 0.5); ring(mx, my, T - DEMO * B, B, nb2 < PRACT ? "practice · tap when it closes" : "tap when it closes"); }
            k.text(c, phase === "demo" ? "No maestro: everyone plays on their own clock" : "", W / 2, 96, "700 18px Roboto, sans-serif", C.ink, "center");
            plotBg(); const yOf = (e) => PH / 2 - (e / B) * 120; P.strokeStyle = C.rule; P.beginPath(); P.moveTo(40, PH / 2); P.lineTo(W - 20, PH / 2); P.stroke();
            cues.forEach((q) => { const x = 40 + (q.n / PLAY) * (W - 80); P.fillStyle = Math.abs(q.err) < B * 0.12 ? C.teal : Math.abs(q.err) < B * 0.3 ? C.gold : C.coral; P.beginPath(); P.arc(x, yOf(q.err), 6, 0, TAU); P.fill(); });
            k.text(P, "timing of each cue: on the line = on the beat · above = late · below = early", 44, PH - 8, "11px Roboto Mono, monospace", C.ink3); };
        }));
        api.log("game", "L1", { score: res[0] });
        await api.card(`<span class="lp-k">Pause and reflect</span><img class="ls-card-img" src="assets/img/lab/orchestra-capsule.jpg" alt=""><h3>${res[0]} / 100 · the players were never the problem</h3><p>Without a maestro, each musician played well and the music still fell apart: their notes did not land together. With a common beat, the same notes became music. <b>Timing between the parts</b> is a property of the whole, not of any one player.</p>`, [{ label: "Meet the capsule's orchestra" }]);
        if (!alive) return;
        await api.card(`<span class="lp-k">Level 2 · the capsule's orchestra</span><h3>Twelve sliders, one beat</h3><p>OSCAR is covered by <b>twelve sliders</b>. A slider that slowly <b style="color:var(--acc-teal)">retracts</b> grips the gut wall and pulls the capsule forward. A slider that quickly <b style="color:var(--acc-coral)">advances</b> pushes it back. The capsule moves only while pulling sliders outnumber pushing ones.</p><p><b>What you do:</b> the ring now sits on the slider that has reached the end of its stroke. Press <b>Space</b> when the ring closes, so that slider advances. One slider per beat: too late and it stops pulling, too early and two push at once.</p>`, [{ label: "Conduct the capsule" }]);
        if (!alive) return;
        // ---- level 2: conduct the capsule by hand
        const L2 = await conductCapsule(false);
        res.push(L2.score);
        await api.card(`<span class="lp-k">Pause and reflect</span><h3>${L2.score} / 100 · ${L2.dist.toFixed(0)} mm travelled</h3><p>Your thrust averaged <b>${L2.mean.toFixed(2)}</b>, against a possible <b>${L2.ideal.toFixed(2)}</b>. ${L2.stalls ? `${L2.stalls} slider${L2.stalls > 1 ? "s" : ""} ran out of stroke while waiting for a cue, and stopped pulling. ` : ""}${L2.bunched ? `${L2.bunched} time${L2.bunched > 1 ? "s" : ""} two sliders advanced together and cancelled the pull. ` : ""}Keeping twelve players in time by hand is hard, and a capsule cannot ask the endoscopist to do it. It needs its own maestro, built into its mechanics.</p><img class="ls-card-img" src="assets/img/lab/maestro-capsule.jpg" alt="">`, [{ label: "Level 3: let the cam conduct" }]);
        if (!alive) return;
        // ---- level 3: the cam conducts
        const L3 = await conductCapsule(true);
        res.push(Math.round(Math.min(100, (L2.mean / L3.mean) * 100)));
        const total = Math.round((res[0] + res[1]) / 2), nb = api.best(total, `${total} / 100`);
        api.log("game", "total", { score: total, l1: res[0], l2: res[1], you_mean: L2.mean, cam_mean: L3.mean });
        const go = await api.card(`<span class="lp-k">Debrief</span><h3>The cam is the maestro</h3>
          <ul class="ls-res"><li>Orchestra in time <b>${res[0]}</b></li><li>Capsule by hand <b>${res[1]}</b></li><li>Your thrust vs the cam's <b>${L2.mean.toFixed(2)} vs ${L3.mean.toFixed(2)}</b></li></ul>
          <p>A maestro gives every player the beat; OSCAR's cam gives every slider its moment. The cam's profile <i>encodes</i> the coordination: a slow retraction for most of each turn and a quick advance, one slider after another, so pulling sliders always outnumber pushing ones. Thrust then depends on that asymmetry, not on the operator.</p>
          <p>Next: design the cam yourself and race to the cecum.</p>`, [{ label: "▶ OSCAR game" }, { label: "Play again" }]);
        if (!alive) return; if (go === 0) location.hash = "#oscar"; else document.querySelector('.ls-modes [data-m="game"]')?.click();
      })();

      function conductCapsule(cam) {
        return new Promise((done) => {
          const n = 12, B = cam ? 0.5 : 0.75, cycle = n * B * 1.05, advDur = B * 0.85, BEATS = cam ? 18 : 24;
          const sl = mk(n); sl.forEach((s, i) => (s.p = (i / n) * 0.96));
          let T = -1.2, cues = [], Fs = [], x = 0, sum = 0, cnt = 0, lastBeat = -1, stalls = 0, bunched = 0, camA = 0, rock = 0;
          ctrl(cam ? `<span class="lab-note">Level 3 of 3 · The cam turns once per cycle and cues each slider in turn</span>` : `<button class="lab-hold" id="m-cue" type="button">🎼 Cue the next slider <kbd>Space</kbd></button><span class="lab-note">Level 2 of 3 · Cue one slider per beat: the one at the end of its stroke</span>`);
          const doCue = (e) => { const nAdv = sl.filter((s) => s.st === "adv").length; if (nAdv >= 1) bunched++; const s = fire(sl, advDur); if (!s) return; k.audio.pluck(ARP[cues.length % 6], 0.35, "triangle", 0.1); rock = 1; return s; };
          cueFn = cam ? null : () => { if (T < -0.3) return; const { n: nb, e } = err(T, B); if (nb >= BEATS) return; cues.push({ t: T, n: nb, err: e }); doCue(e); };
          frame = (dt) => { T += dt; const tick = Math.floor(T / B);
            if (cam && tick > lastBeat && T >= 0) { lastBeat = tick; if (tick < BEATS) { cues.push({ t: tick * B, n: tick, err: 0 }); doCue(0); } }
            const stalledBefore = sl.filter((s) => s.st === "stall").length;
            const F = T >= 0 ? stepSl(sl, dt, cycle, advDur) : 0; const stalledNow = sl.filter((s) => s.st === "stall").length; if (stalledNow > stalledBefore) stalls += stalledNow - stalledBefore;
            if (T >= 0 && T < BEATS * B) { sum += F * dt; cnt += dt; Fs.push(F); if (Fs.length > 420) Fs.shift(); x += Math.max(0, F - 0.15) * 22 * dt; }
            rock *= 0.9; camA += cam ? dt * TAU / (n * B) : 0;
            c.clearRect(0, 0, W, H); bg("#F7FBFD", "#EAF3F8");
            lane(T, B, cues, cam ? "CAM" : "YOU", 30, 34, W - 60);
            drawSliderCrew(sl, 120, 76, W - 240, "THE TWELVE SLIDERS · teal = pulling (retracting) · coral = pushing (advancing) · grey = out of stroke");
            if (!cam && T > -0.6) { const nxt = sl.filter((q) => q.st !== "adv").sort((a, b) => b.p - a.p)[0]; if (nxt) { const i = sl.indexOf(nxt), dx = (W - 240) / n; ring(120 + dx * (i + 0.5), 76 + 64 - 16, Math.max(0, T), B, T < 0 ? "get ready" : "this one"); } }
            drawCapsule(sl, 470, 400, rock * (cam ? 0.6 : 2.4) * Math.sin(t * 40), x * 3);
            drawCam(80, 400, camA, cam);
            k.text(c, `${x.toFixed(0)} mm`, W - 40, 470, "700 20px Roboto Mono, monospace", C.ink, "right");
            k.text(c, cam ? "The cam keeps every slider on its beat" : "Cue the slider at the end of its stroke, once per beat", W / 2, 520, "700 16px Roboto, sans-serif", C.ink2, "center");
            thrustPlot(Fs, "net thrust = (sliders pulling − sliders pushing) / 12", (n - 2 * advDur / B) / n);
            if (T > BEATS * B + 0.3) { frame = () => {}; cueFn = null; const mean = cnt ? sum / cnt : 0, ideal = (n - 2 * advDur / B) / n;
              const sc = Math.max(0, Math.round(Math.min(1, mean / ideal) * 100)); api.log("game", cam ? "L3" : "L2", { score: sc, mean, stalls, bunched });
              done({ score: sc, mean, ideal, dist: x, stalls, bunched }); } };
        });
      }
    }

    // ======================= EXPLORE =======================
    if (mode === "explore") {
      let n = 12, tempo = 0.42, advF = 0.85, jit = 0, cam = true;
      let sl = mk(n), Fs = [], T = 0, x = 0, lastBeat = -1, camA = 0, rock = 0;
      const rebuild = () => { sl = mk(n); sl.forEach((s, i) => (s.p = (i / n) * 0.96)); Fs = []; lastBeat = Math.floor(T / tempo); };
      ctrl(`<div class="lab-seg"><button data-c="cam" aria-selected="true">Cam conducts</button><button data-c="you" aria-selected="false">You conduct</button></div>
        <button class="btn ghost small-btn" id="m-cue" type="button">Cue <kbd>Space</kbd></button>
        <label class="lab-range">Sliders <input type="range" id="e-n" min="4" max="16" step="1" value="12"><output id="e-no">12</output></label>
        <label class="lab-range">Advance time <input type="range" id="e-a" min="0.3" max="2.5" step="0.05" value="0.85"><output id="e-ao">0.85 beat</output></label>
        <label class="lab-range">Cam timing error <input type="range" id="e-j" min="0" max="0.5" step="0.01" value="0"><output id="e-jo">0%</output></label>`);
      api.controls.querySelectorAll(".lab-seg button").forEach((b) => b.addEventListener("click", () => { cam = b.dataset.c === "cam"; api.controls.querySelectorAll(".lab-seg button").forEach((q) => q.setAttribute("aria-selected", q === b)); }));
      const bind = (id, f) => { const el = document.getElementById(id); el.addEventListener("input", () => f(+el.value)); };
      bind("e-n", (v) => { n = v; document.getElementById("e-no").textContent = v; rebuild(); });
      bind("e-a", (v) => { advF = v; document.getElementById("e-ao").textContent = v.toFixed(2) + " beat"; });
      bind("e-j", (v) => { jit = v; document.getElementById("e-jo").textContent = Math.round(v * 100) + "%"; });
      rebuild();
      let pending = [];
      cueFn = () => { if (!cam) { fire(sl, advF * tempo); rock = 1; k.audio.pluck(ARP[(lastBeat + 6) % 6], 0.3, "triangle", 0.08); } };
      frame = (dt) => { T += dt; const tick = Math.floor(T / tempo);
        if (cam && tick > lastBeat) { lastBeat = tick; pending.push(T + (Math.random() - 0.5) * 2 * jit * tempo); }
        pending = pending.filter((tp) => { if (T >= tp) { fire(sl, advF * tempo); rock = 1; return false; } return true; });
        const F = stepSl(sl, dt, n * tempo * 1.05, advF * tempo); Fs.push(F); if (Fs.length > 420) Fs.shift(); x += Math.max(0, F - 0.15) * 22 * dt; rock *= 0.9; camA += cam ? dt * TAU / (n * tempo) : 0;
        c.clearRect(0, 0, W, H); bg("#F7FBFD", "#EAF3F8");
        drawSliderCrew(sl, 120, 40, W - 240, `${n} SLIDERS · teal pulling · coral pushing · grey out of stroke`);
        drawCapsule(sl, 470, 380, rock * (n % 2 ? 2 : 1) * Math.sin(t * 40), x * 3); drawCam(80, 380, camA, cam);
        const mean = Fs.reduce((a, b) => a + b, 0) / Math.max(1, Fs.length), sd = Math.sqrt(Fs.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(1, Fs.length));
        k.text(c, `mean thrust ${mean.toFixed(2)} · ripple ±${sd.toFixed(2)} · Δd ≈ ${(1 - 2 * advF / n).toFixed(2)}`, W / 2, 500, "700 16px Roboto Mono, monospace", C.ink, "center");
        thrustPlot(Fs, "net thrust = (pulling − pushing) / n · mean ≈ 1 − 2·(advance time / cycle) = Δd", 1 - 2 * advF / n); };
    }
    raf = requestAnimationFrame(loop);
    return () => { alive = false; cueFn = null; cancelAnimationFrame(raf); off.forEach((f) => f()); api.hideCard(); };
  };
})();
