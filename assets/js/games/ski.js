/* Lab game 4 · Skiing without ice (glide + grip + timing).
   A cross-country skier moves because one ski grips while the other glides: on snow, the wax and
   the stride do it. On ground with no ice, both skis have the same friction, so each stride slides
   one ski forward and the other back by the same amount, and the skier goes nowhere.
   Here each ski carries ultrasonic modules. A vibrating ski loses part of its friction (measured:
   71–77% on dry, 56–71% on wet, 28–49% on sandpaper and soil, 27–38% on ex-vivo intestine), so when
   the moving ski vibrates and the other does not, the stride pushes from the gripping ski and the
   skier advances. The same switching drives the paper's inchworm and ovipositor robots.
   Model of one stride: the legs move the skis apart by a stroke S. The ski with less friction takes
   most of it; the share the gripping ski slips back is 0.5·(μ_glide/μ_grip)^2.2, set so that dry
   ground (−74%) gives the ~95% efficiency measured with the inchworm robot. Equal friction: 50/50,
   no progress. Lubricating the wrong ski: the skier goes backwards.
   Game: three tracks (dry, wet, sandpaper then soil), tap to switch the vibration to the moving ski
   on each stride. Explore: switching phase, ground, and what each choice does to the speed. */
(function () {
  window.LabGames = window.LabGames || {};
  const TAU = Math.PI * 2;
  const GROUND = {
    dry: { name: "Dry track", red: 0.74, note: "71–77% measured", top: "#D9DEE4", bot: "#C3CAD2", dk: ["#3A4352", "#2C3440"] },
    wet: { name: "Wet track", red: 0.63, note: "56–71% measured", top: "#BFD9EA", bot: "#9DC0D8", dk: ["#24425A", "#1B3348"] },
    sand: { name: "Sandpaper", red: 0.45, note: "28–49% measured (sandpaper and soil)", top: "#E2C48E", bot: "#CFA868", dk: ["#5A4A30", "#463A26"] },
    soil: { name: "Soil", red: 0.32, note: "28–49% measured (sandpaper and soil)", top: "#9C7A55", bot: "#7E5F40", dk: ["#4A3A2A", "#3A2C20"] },
    gut: { name: "Ex-vivo intestine", red: 0.32, note: "27–38% measured", top: "#F2C1BA", bot: "#E3A097", dk: ["#5A3038", "#46242C"] }
  };
  const MU0 = 0.5, S = 1.0, HALF = 0.55, Q = 2.2, PX = 70; // friction (illustrative), stroke (m), half-stride (s), slip exponent, pixels per metre
  const share = (muM, muA) => (muM <= muA ? 1 - 0.5 * Math.pow(muM / muA, Q) : 0.5 * Math.pow(muA / muM, Q)); // share of the stroke taken by the ski that should move
  const g = (tau) => (1 - Math.cos(Math.PI * Math.min(1, Math.max(0, tau)))) / 2; // smooth stroke within a half-stride

  // one skier: positions of the left and right ski, which ski vibrates
  const skier = () => ({ xL: -S / 2, xR: S / 2, tt: 0, h: 0, tau: 0, us: "L", hist: [] });
  // advance one skier by dt. mover(half) = which ski moves in this half-stride; usOf(t) = which ski vibrates ("L", "R", "both", "none")
  const stepSkier = (s, dt, red, usOf) => {
    let left = dt, mover = s.h % 2 === 0 ? "L" : "R";
    while (left > 1e-9) {
      mover = s.h % 2 === 0 ? "L" : "R"; const room = (1 - s.tau) * HALF, d = Math.min(left, room), tau1 = s.tau + d / HALF;
      const u = usOf(s.tt + d), mu = (ski) => MU0 * (1 - red * (u === ski || u === "both" ? 1 : 0));
      const dRel = S * (g(tau1) - g(s.tau)), sm = share(mu(mover), mu(mover === "L" ? "R" : "L"));
      if (mover === "L") { s.xL += sm * dRel; s.xR -= (1 - sm) * dRel; } else { s.xR += sm * dRel; s.xL -= (1 - sm) * dRel; }
      s.tt += d; left -= d; s.tau = tau1; if (s.tau >= 1 - 1e-9) { s.tau = 0; s.h++; }
    }
    return mover;
  };
  const centre = (s) => (s.xL + s.xR) / 2;
  // speed (m/s) for a switching phase offset φ (fraction of a half-stride, + = late) on a ground: used by the explore plot
  const speedAt = (red, phi) => { const s = skier(); const usOf = (tt) => { const h = Math.floor((tt - phi * HALF) / HALF); return h % 2 === 0 ? "L" : "R"; };
    for (let i = 0; i < 400; i++) stepSkier(s, (4 * HALF) / 400, red, usOf); return centre(s) / (4 * HALF); };

  window.LabGames.ski = (api, mode) => {
    const k = window.LabKit, { ctx: c, W, H, plot: P, PH } = api;
    let C = api.colors(), alive = true, raf = 0, last = performance.now(), t = 0;
    const off = [], on = (el, ev, f, o) => { el.addEventListener(ev, f, o); off.push(() => el.removeEventListener(ev, f, o)); };
    on(document, "themechange", () => (C = api.colors()));
    let tapFn = null;
    const tap = () => { k.audio.get(); if (tapFn) tapFn(); };
    on(window, "keydown", (e) => { if (e.code === "Space" && document.activeElement?.tagName !== "INPUT") { e.preventDefault(); if (!e.repeat) tap(); } });
    on(api.canvas, "pointerdown", () => tap());
    const teal = () => C.teal;
    const SKI = { L: "#3A6FB0", R: "#E07B39" };

    // ---------- drawing ----------
    const drawScene = (gr, camX, finish, flags) => {
      const G = GROUND[gr], gy = 400;
      const sky = c.createLinearGradient(0, 0, 0, gy); sky.addColorStop(0, C.dark ? "#13223A" : "#CFE6F7"); sky.addColorStop(1, C.dark ? "#2A3550" : "#F4F1E8"); c.fillStyle = sky; c.fillRect(0, 0, W, gy);
      c.fillStyle = C.dark ? "#2C3A55" : "#DCE7EE"; c.beginPath(); c.moveTo(0, gy); for (let x = 0; x <= W; x += 10) c.lineTo(x, gy - 70 - 30 * Math.sin((x + camX * PX * 0.15) / 90) - 14 * Math.sin((x + camX * PX * 0.15) / 37)); c.lineTo(W, gy); c.fill();
      const gg = c.createLinearGradient(0, gy, 0, H); gg.addColorStop(0, C.dark ? G.dk[0] : G.top); gg.addColorStop(1, C.dark ? G.dk[1] : G.bot); c.fillStyle = gg; c.fillRect(0, gy, W, H - gy);
      const sx = (xm) => W * 0.4 + (xm - camX) * PX;
      // ground texture moves with the ground
      c.fillStyle = C.dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)";
      for (let i = Math.floor(camX * PX / 23) - 30; i < Math.floor(camX * PX / 23) + 30; i++) { const x = sx(i * 23 / PX), y = gy + 8 + ((i * 37) % 50); if (x < -10 || x > W + 10) continue;
        if (gr === "wet") { c.fillStyle = C.dark ? "rgba(140,200,255,.15)" : "rgba(255,255,255,.45)"; c.beginPath(); c.ellipse(x, y, 14, 3, 0, 0, TAU); c.fill(); }
        else if (gr === "soil") { c.fillStyle = C.dark ? "rgba(0,0,0,.25)" : "rgba(60,40,20,.25)"; c.beginPath(); c.arc(x, y, 3 + (i % 3), 0, TAU); c.fill(); }
        else if (gr === "sand") { c.fillStyle = C.dark ? "rgba(255,255,255,.1)" : "rgba(90,60,20,.25)"; for (let q = 0; q < 4; q++) c.fillRect(x + q * 5, y + (q % 2) * 4, 1.6, 1.6); }
        else { c.fillStyle = C.dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.06)"; c.fillRect(x, gy + 2, 1, H - gy); } }
      (flags || []).forEach((fm) => { const x = sx(fm); if (x < -20 || x > W + 20) return; c.strokeStyle = C.ink3; c.lineWidth = 2; c.beginPath(); c.moveTo(x, gy); c.lineTo(x, gy - 46); c.stroke(); c.fillStyle = C.ink3; c.beginPath(); c.moveTo(x, gy - 46); c.lineTo(x + 16, gy - 40); c.lineTo(x, gy - 34); c.fill(); k.text(c, `${fm} m`, x + 4, gy + 18, "600 11px Roboto Mono, monospace", C.ink2); });
      if (finish != null) { const x = sx(finish); if (x > -30 && x < W + 30) { for (let q = 0; q < 12; q++) { c.fillStyle = q % 2 ? "#222" : "#fff"; c.fillRect(x - 4, gy - 120 + q * 10, 8, 10); } k.text(c, "FINISH", x, gy - 128, "800 13px Roboto, sans-serif", C.ink, "center"); } }
      return { sx, gy };
    };
    const drawSki = (x, gy, col, vib, label, far) => {
      c.save(); if (far) { c.translate(0, -8); c.globalAlpha *= 0.8; }
      if (vib) { // squeeze film under the vibrating ski
        c.fillStyle = C.dark ? "rgba(110,225,215,.75)" : "rgba(70,200,195,.75)"; k.rr(c, x - 52, gy - 4, 104, 5, 2.5); c.fill();
        c.strokeStyle = "rgba(255,255,255,.85)"; c.lineWidth = 1.2; c.setLineDash([3, 5]); c.lineDashOffset = -t * 25; c.beginPath(); c.moveTo(x - 50, gy - 1.5); c.lineTo(x + 50, gy - 1.5); c.stroke(); c.setLineDash([]); }
      const y = gy - (vib ? 9 : 5);
      c.fillStyle = col; k.rr(c, x - 54, y - 5, 108, 6, 3); c.fill(); c.beginPath(); c.moveTo(x + 50, y - 5); c.quadraticCurveTo(x + 64, y - 5, x + 66, y - 16); c.lineTo(x + 60, y - 4); c.fill();
      c.fillStyle = C.gold; [-30, 18].forEach((dx) => { k.rr(c, x + dx - 7, y - 11, 14, 6, 2); c.fill(); }); // ultrasonic modules
      if (vib) { c.strokeStyle = teal(); c.lineWidth = 1.4; for (let q = 0; q < 2; q++) { const a = ((t * 3 + q / 2) % 1); c.globalAlpha = 1 - a; c.beginPath(); c.arc(x - 30, y - 8, 6 + a * 10, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); c.beginPath(); c.arc(x + 18, y - 8, 6 + a * 10, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); } c.globalAlpha = 1; }
      c.restore(); return y - (far ? 8 : 0);
    };
    const drawSkier = (sx, gy, s, usNow, ghost, mover) => {
      const xl = sx(s.xL), xr = sx(s.xR), hipX = (xl + xr) / 2, hipY = gy - 88 - 4 * Math.cos((s.tt / HALF) * Math.PI * 2);
      c.save(); if (ghost) c.globalAlpha = 0.28;
      const vL = usNow === "L" || usNow === "both", vR = usNow === "R" || usNow === "both";
      const yr = drawSki(xr, gy, SKI.R, vR, null, true), yl = drawSki(xl, gy, SKI.L, vL, null, false); // the right ski is the far one
      if (!ghost && mover) { // what each ski is doing in this stride
        const st = (ski, vib) => (mover === ski ? (vib ? ["glides forward", teal()] : ["is stuck", C.coral]) : (vib ? ["slips back", C.coral] : ["grips", teal()]));
        const [a1, c1] = st("L", vL), [a2, c2] = st("R", vR); c.fillStyle = C.dark ? "rgba(16,29,49,.85)" : "rgba(255,255,255,.9)"; k.rr(c, 20, H - 70, 300, 52, 12); c.fill();
        [["Left ski", SKI.L, a1, c1, vL], ["Right ski", SKI.R, a2, c2, vR]].forEach(([nm, col, act, ac, vib], i) => { const yy = H - 49 + i * 22; c.fillStyle = col; k.rr(c, 34, yy - 9, 22, 8, 4); c.fill();
          k.text(c, `${nm} ${vib ? "(vibrating)" : "(quiet)"}`, 64, yy, "600 12px Roboto, sans-serif", C.ink2); k.text(c, act, 306, yy, "800 12px Roboto, sans-serif", ac, "right"); }); }
      // legs: two-link, knee bent forward; feet on the bindings
      const leg = (fx, fy, col) => { const dx = fx - hipX, dy = fy - hipY, L1 = 50, L2 = 50, d = Math.min(L1 + L2 - 1, Math.hypot(dx, dy)), a = Math.atan2(dy, dx), b = Math.acos((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d));
        const kx = hipX + L1 * Math.cos(a - b), ky = hipY + L1 * Math.sin(a - b); c.strokeStyle = col; c.lineWidth = 9; c.lineCap = "round"; c.beginPath(); c.moveTo(hipX, hipY); c.lineTo(kx, ky); c.lineTo(fx, fy); c.stroke();
        c.fillStyle = "#1A1A1A"; k.rr(c, fx - 9, fy - 6, 20, 7, 3); c.fill(); };
      leg(xr, yr - 6, C.dark ? "#4A5C7A" : "#2B3A55"); leg(xl, yl - 6, C.dark ? "#5A6E90" : "#3A4D6E");
      // torso, leaning forward
      c.save(); c.translate(hipX, hipY); c.rotate(0.28); c.fillStyle = "#1F6FB2"; k.rr(c, -14, -58, 28, 62, 11); c.fill();
      c.fillStyle = "#F2C9A0"; c.beginPath(); c.arc(2, -74, 13, 0, TAU); c.fill(); c.fillStyle = C.coral; c.beginPath(); c.arc(2, -77, 14, Math.PI, 0); c.fill();
      c.fillStyle = "#222"; k.rr(c, 2, -78, 16, 6, 3); c.fill(); c.fillStyle = C.gold; k.rr(c, 7, -77, 9, 4, 2); c.fill(); c.restore();
      // arms and poles swing with the stride
      const sw = Math.sin((s.tt / HALF) * Math.PI); [[1, xr], [-1, xl]].forEach(([sg, fx]) => { const shx = hipX + 14, shy = hipY - 46, hx = shx + 26 * sg * sw + 8, hy = shy + 30;
        c.strokeStyle = "#1F6FB2"; c.lineWidth = 7; c.beginPath(); c.moveTo(shx, shy); c.lineTo(hx, hy); c.stroke(); c.strokeStyle = C.ink2; c.lineWidth = 2.5; c.beginPath(); c.moveTo(hx, hy - 6); c.lineTo(hx - 34, gy - 2); c.stroke(); });
      c.restore();
    };
    // the stride lane: beats scroll left; each beat is a switch, labelled with the ski that moves next
    const lane = (T, taps, y) => {
      c.fillStyle = C.dark ? "rgba(16,29,49,.85)" : "rgba(255,255,255,.88)"; k.rr(c, 24, y - 24, W - 48, 48, 24); c.fill();
      const nowX = 170, pps = 190;
      for (let b = Math.max(1, Math.floor(T / HALF) - 2); b < T / HALF + 6; b++) { const x = nowX + (b * HALF - T) * pps; if (x < 110 || x > W - 34) continue; const who = b % 2 === 0 ? "L" : "R";
        c.fillStyle = SKI[who]; c.beginPath(); c.arc(x, y, 9, 0, TAU); c.fill(); k.text(c, who, x, y + 4, "800 10px Roboto, sans-serif", "#fff", "center"); }
      taps.forEach((q) => { const x = nowX + (q.t - T) * pps; if (x < 110 || x > W - 30) return; c.strokeStyle = Math.abs(q.err) < 0.07 ? teal() : Math.abs(q.err) < 0.16 ? C.gold : C.coral; c.lineWidth = 3; c.beginPath(); c.arc(x, y, 13, 0, TAU); c.stroke(); });
      c.strokeStyle = C.coral; c.lineWidth = 3; c.beginPath(); c.moveTo(nowX, y - 18); c.lineTo(nowX, y + 18); c.stroke();
      k.text(c, "SWITCH", 40, y + 4, "700 12px Roboto Mono, monospace", C.ink2);
    };
    const speedPlot = (hist, ghostHist, label) => {
      P.clearRect(0, 0, W, PH); P.fillStyle = C.dark ? "#101D31" : "#F1F4F8"; k.rr(P, 0, 0, W, PH, 12); P.fill();
      const lo = -1, hi = 2, yOf = (v) => 18 + (1 - (v - lo) / (hi - lo)) * (PH - 40), x0 = 50, w = W - 70;
      P.strokeStyle = C.rule; [0, 1].forEach((v) => { P.beginPath(); P.moveTo(x0, yOf(v)); P.lineTo(x0 + w, yOf(v)); P.stroke(); k.text(P, `${v} m/s`, x0 - 6, yOf(v) + 4, "10px Roboto Mono, monospace", C.ink3, "right"); });
      const line = (h, col, wd) => { P.strokeStyle = col; P.lineWidth = wd; P.beginPath(); h.forEach((v, i) => { const x = x0 + (i / 299) * w; i ? P.lineTo(x, yOf(v)) : P.moveTo(x, yOf(v)); }); P.stroke(); };
      if (ghostHist) line(ghostHist, C.ink3, 1.5); line(hist, C.coral, 2.5);
      k.text(P, label, x0, PH - 6, "11px Roboto Mono, monospace", C.ink3);
    };

    let frame = () => {};
    const loop = (now) => { if (!alive) return; const dt = Math.min((now - last) / 1000, 0.04); last = now; t += dt; frame(dt); raf = requestAnimationFrame(loop); };

    // ======================= GAME =======================
    if (mode === "game") {
      (async () => {
        await api.card(`<span class="lp-k">Game 4 · Both themes at once</span><h3>Skiing without ice</h3><p>A skier glides on one ski while pushing from the other. On snow, wax and the stride take care of it. On a dry track, both skis grip equally, so each stride slides one ski forward and the other back by the same amount: you go <b>nowhere</b>.</p><p>Your skis carry ultrasonic modules. A vibrating ski <b>glides</b>; a quiet one <b>grips</b>. The legs swap at every stride, so the vibration has to swap too: <b>tap Space</b> (or the scene) each time a ski reaches the switch line, so the vibration goes to the ski that moves next.</p><p class="muted">Tutorial A (the violinist) taught when friction should change; Tutorial B (the maestro) taught timing. You need both.</p>`, [{ label: "Clip in" }]);
        if (!alive) return;
        const tracks = [
          { gr: "dry", L: 24, intro: `<span class="lp-k">Track 1 of 3 · dry</span><h3>Dry track</h3><p>Friction drops by <b>${Math.round(GROUND.dry.red * 100)}%</b> under a vibrating ski (71–77% measured). Tap on every switch. The dashed line marks a ghost skier who switches perfectly.</p>` },
          { gr: "wet", L: 24, intro: `<span class="lp-k">Track 2 of 3 · wet</span><h3>Wet track</h3><p>Water already lubricates a little, so the vibration has less to remove: <b>${Math.round(GROUND.wet.red * 100)}%</b> (56–71% measured). The gripping ski slips back a little more on each stride.</p>` },
          { gr: "sand", gr2: "soil", L: 24, intro: `<span class="lp-k">Track 3 of 3 · sandpaper, then soil</span><h3>Rough ground</h3><p>Rough and loose grounds keep the least of the effect: <b>28–49%</b>, measured for sandpaper and soil together. Halfway the sandpaper turns to soil.</p>` }];
        const res = [];
        for (let i = 0; i < tracks.length && alive; i++) {
          await api.card(tracks[i].intro, [{ label: "Go" }]); if (!alive) return;
          res.push(await runTrack(tracks[i], i));
          if (!alive) return;
          if (i === 0) await api.flash([
            { q: "With the vibration off on both skis, why does the skier go nowhere?", a: "Both skis have the same friction. Each stride pushes them apart, and each takes <b>half</b> the stroke: one slides forward, the other slides back by the same amount. The centre does not move." },
            { q: "Why must the vibration go to the ski that moves, and not the other one?", a: "The moving ski should <b>glide</b>, so it is the one to vibrate. The other ski is the anchor: it must <b>grip</b>, so it must stay quiet. Vibrate the anchor instead and the anchor slides back: the skier goes backwards." }
          ], "Next track");
        }
        if (!alive) return;
        await api.flash([
          { q: "The same timing worked worse on soil than on the dry track. Why?", a: "The vibration removed less friction there (28–49% instead of 71–77%), so the gripping ski was not much grippier than the gliding one. It slipped back on every stride, and part of each stroke was lost." },
          { q: "What does a skier on sand have in common with a capsule in the gut?", a: "Both move by pushing one contact while the other slides, and both need the switch timed to the motion. Switching friction on demand turns any surface into one you can push from: the paper shows it with an inchworm and an ovipositor robot." }
        ], "See the results");
        if (!alive) return;
        const total = Math.round(res.reduce((a, b) => a + b, 0) / res.length), nb = api.best(total, `${total} / 100`);
        api.log("game", "total", { score: total, dry: res[0], wet: res[1], rough: res[2] });
        const go = await api.card(`<span class="lp-k">Debrief</span><h3>${total} / 100${nb ? " · new best" : ""}</h3>
          <ul class="ls-res"><li>Dry track <b>${res[0]}</b></li><li>Wet track <b>${res[1]}</b></li><li>Sandpaper and soil <b>${res[2]}</b></li></ul>
          <p>Grip as needed, glide on demand: vibrate the contact that should move, keep the other one quiet, and swap with the motion. No lifting, no ice, no special surface. The paper measured friction reductions of 71–77% on dry, 56–71% on wet and 28–49% on soil and sandpaper surfaces, and about 95% of the ideal stride with the inchworm robot.</p>`, [{ label: "Play again" }, { label: "Explore mode" }]);
        if (!alive) return; document.querySelector(`.ls-modes [data-m="${go === 1 ? "explore" : "game"}"]`)?.click();
      })();

      function runTrack(tr, idx) {
        return new Promise((done) => {
          const me = skier(), gh = skier(); let T = -1.2, taps = [], usNow = "L", hist = [], ghist = [], lastC = 0, lastG = 0, missed = 0, lastHalf = 0;
          api.controls.innerHTML = `<button class="lab-hold" id="s-tap" type="button">⇄ Switch the vibration <kbd>Space</kbd></button><span class="lab-note">Track ${idx + 1} of 3 · ${GROUND[tr.gr].name}${tr.gr2 ? " → " + GROUND[tr.gr2].name : ""}</span>`;
          document.getElementById("s-tap").addEventListener("pointerdown", (e) => { e.preventDefault(); tap(); });
          k.muteButton(api.controls);
          // the vibration starts on the left ski, which moves first; each tap hands it to the other ski
          tapFn = () => { if (T < -0.4) return; const b = Math.round(T / HALF), err = T - b * HALF; taps.push({ t: T, err }); usNow = usNow === "L" ? "R" : "L"; k.audio.pluck(usNow === "L" ? 523 : 659, 0.18, "sine", 0.06); };
          const ghostUs = (tt) => (Math.floor(tt / HALF) % 2 === 0 ? "L" : "R");
          frame = (dt) => {
            T += dt; const gr = tr.gr2 && centre(me) > tr.L / 2 ? tr.gr2 : tr.gr, red = GROUND[gr].red;
            let mover = "L";
            if (T >= 0) {
              mover = stepSkier(me, dt, red, () => usNow);
              stepSkier(gh, dt, GROUND[tr.gr2 && centre(gh) > tr.L / 2 ? tr.gr2 : tr.gr].red, ghostUs);
              const h = Math.floor(me.tt / HALF); if (h > lastHalf) { lastHalf = h; } }
            const v = (centre(me) - lastC) / Math.max(dt, 1e-3), vg = (centre(gh) - lastG) / Math.max(dt, 1e-3); lastC = centre(me); lastG = centre(gh);
            hist.push(v); ghist.push(vg); if (hist.length > 300) { hist.shift(); ghist.shift(); }
            c.clearRect(0, 0, W, H);
            const { sx, gy } = drawScene(gr, centre(me), tr.L, [5, 10, 15, 20].filter((q) => q < tr.L));
            { const gx = sx(centre(gh)); if (gx > 10 && gx < W - 10) { c.strokeStyle = C.ink3; c.setLineDash([5, 5]); c.lineWidth = 2; c.beginPath(); c.moveTo(gx, gy + 4); c.lineTo(gx, gy - 150); c.stroke(); c.setLineDash([]); k.text(c, "ghost", gx, gy + 34, "italic 700 12px Roboto, sans-serif", C.ink3, "center"); } }
            drawSkier(sx, gy, me, usNow, false, mover);
            lane(Math.max(0, T), taps, 40);
            const ahead = centre(gh) - centre(me);
            c.fillStyle = C.dark ? "rgba(16,29,49,.85)" : "rgba(255,255,255,.9)"; k.rr(c, W - 250, 80, 230, 86, 12); c.fill();
            k.text(c, `${Math.max(0, centre(me)).toFixed(1)} / ${tr.L} m`, W - 34, 108, "700 18px Roboto Mono, monospace", C.ink, "right");
            k.text(c, `${GROUND[gr].name}: −${Math.round(red * 100)}% when vibrating`, W - 34, 130, "600 12px Roboto, sans-serif", C.ink2, "right");
            k.text(c, ahead > 0.3 ? `ghost ${ahead.toFixed(1)} m ahead` : ahead < -0.3 ? `you lead by ${(-ahead).toFixed(1)} m` : "level with the ghost", W - 34, 152, "600 12px Roboto, sans-serif", C.ink3, "right");
            if (T < 0) k.text(c, "Get ready: the left ski moves first, and it is already vibrating", W / 2, 110, "700 16px Roboto, sans-serif", C.ink, "center");
            else if (v < -0.05) k.text(c, "Sliding backwards: the vibration is on the ski that should grip. Tap to swap it.", W / 2, 110, "700 15px Roboto, sans-serif", C.coral, "center");
            speedPlot(hist, ghist, "your speed (coral) and the ghost's (grey): every stride is a hump; a dip below zero is a wrong switch");
            if (centre(me) >= tr.L || T > 60) { frame = () => {}; tapFn = null;
              const Tme = centre(me) >= tr.L ? T : 99, Tg = tr.L / Math.max(0.05, speedAt(GROUND[tr.gr].red, 0) * 0.5 + speedAt(GROUND[tr.gr2 || tr.gr].red, 0) * 0.5);
              const sc = centre(me) >= tr.L ? Math.min(100, Math.round((100 * Tg) / Tme)) : Math.round((50 * Math.max(0, centre(me))) / tr.L);
              const good = taps.filter((q) => Math.abs(q.err) < 0.07).length;
              api.log("game", "T" + (idx + 1), { ground: tr.gr, score: sc, time: T, taps: taps.length, good });
              api.card(`<h3>${centre(me) >= tr.L ? `${T.toFixed(1)} s` : "Time's up"} · ${sc} / 100</h3><ul class="ls-res"><li>Ideal time (perfect switching) <b>${Tg.toFixed(1)} s</b></li><li>Switches on time <b>${good} of ${Math.max(1, Math.round(Math.min(T, 60) / HALF))}</b></li></ul><p>${idx === 0 ? "On dry ground the vibrating ski keeps only a quarter of its friction, so the gripping ski barely slips." : idx === 1 ? "On wet ground the difference between the two skis is smaller: even with perfect timing, the gripping ski gives way a little on each stride." : "On sandpaper and soil the vibrating ski keeps most of its friction, so both skis slip: the stride wastes more, and timing matters even more."}</p>`, [{ label: "Continue" }]).then(() => done(sc)); }
          };
        });
      }
    }

    // ======================= EXPLORE =======================
    if (mode === "explore") {
      let gr = "dry", phi = 0, pol = "auto";
      const me = skier(); let hist = [], lastC = 0;
      api.controls.innerHTML = `<label class="lab-select">Ground <select id="s-g">${Object.entries(GROUND).map(([key, v]) => `<option value="${key}">${v.name} (−${Math.round(v.red * 100)}%)</option>`).join("")}</select></label>
        <div class="lab-seg" role="group" aria-label="Ultrasound"><button data-p="auto" aria-selected="true">Moving ski</button><button data-p="wrong" aria-selected="false">Gripping ski</button><button data-p="both" aria-selected="false">Both</button><button data-p="none" aria-selected="false">Off</button></div>
        <label class="lab-range">Switch timing <input type="range" id="s-ph" min="-0.5" max="0.5" step="0.02" value="0"><output id="s-po">on time</output></label>`;
      document.getElementById("s-g").addEventListener("change", (e) => (gr = e.target.value));
      api.controls.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => { pol = b.dataset.p; api.controls.querySelectorAll("[data-p]").forEach((q) => q.setAttribute("aria-selected", q === b)); }));
      const pi = document.getElementById("s-ph"); pi.addEventListener("input", () => { phi = +pi.value; document.getElementById("s-po").textContent = Math.abs(phi) < 0.01 ? "on time" : `${Math.round(Math.abs(phi) * 100)}% ${phi > 0 ? "late" : "early"}`; });
      k.muteButton(api.controls);
      const usOf = (tt) => { const h = Math.floor((tt - phi * HALF) / HALF), right = h % 2 === 0 ? "L" : "R"; return pol === "auto" ? right : pol === "wrong" ? (right === "L" ? "R" : "L") : pol; };
      frame = (dt) => {
        const red = GROUND[gr].red, mover = stepSkier(me, dt, red, usOf), v = (centre(me) - lastC) / Math.max(dt, 1e-3); lastC = centre(me); hist.push(v); if (hist.length > 300) hist.shift();
        c.clearRect(0, 0, W, H); const { sx, gy } = drawScene(gr, centre(me), null, []); drawSkier(sx, gy, me, usOf(me.tt), false, mover);
        // speed against switch timing for this ground
        const px = 40, py = 30, pw = 330, ph = 150; c.fillStyle = C.dark ? "rgba(16,29,49,.9)" : "rgba(255,255,255,.92)"; k.rr(c, px - 20, py - 18, pw + 40, ph + 58, 12); c.fill();
        k.text(c, `Speed vs switch timing · ${GROUND[gr].name}`, px, py - 2, "700 12px Roboto, sans-serif", C.ink2);
        const vMax = 1.2, X = (f) => px + ((f + 0.5) / 1) * pw, Y = (vv) => py + 10 + (1 - (vv + 0.3) / (vMax + 0.3)) * (ph - 10);
        c.strokeStyle = C.rule; c.beginPath(); c.moveTo(px, Y(0)); c.lineTo(px + pw, Y(0)); c.stroke();
        if (!frame.cache || frame.cache.gr !== gr) { frame.cache = { gr, pts: [] }; for (let f = -0.5; f <= 0.5001; f += 0.05) frame.cache.pts.push([f, speedAt(red, f)]); }
        c.strokeStyle = C.coral; c.lineWidth = 2.5; c.beginPath(); frame.cache.pts.forEach(([f, vv], i) => (i ? c.lineTo(X(f), Y(vv)) : c.moveTo(X(f), Y(vv)))); c.stroke();
        const vNow = pol === "auto" ? speedAt(red, phi) : pol === "wrong" ? -speedAt(red, 0) : 0; c.fillStyle = C.ink; c.beginPath(); c.arc(X(pol === "auto" ? phi : 0), Y(vNow), 5, 0, TAU); c.fill();
        k.text(c, "early", px, py + ph + 16, "10px Roboto Mono, monospace", C.ink3); k.text(c, "on time", px + pw / 2, py + ph + 16, "10px Roboto Mono, monospace", C.ink3, "center"); k.text(c, "late", px + pw, py + ph + 16, "10px Roboto Mono, monospace", C.ink3, "right");
        k.text(c, `${vNow.toFixed(2)} m/s · ${((Math.max(0, vNow) / (S / HALF / 2)) * 100).toFixed(0)}% of an ideal stride`, px + pw / 2, py + ph + 32, "700 12px Roboto Mono, monospace", C.ink, "center");
        speedPlot(hist, null, "speed of the skier's centre: humps forward = good strides, dips below zero = sliding back");
      };
    }
    raf = requestAnimationFrame(loop);
    return () => { alive = false; tapFn = null; cancelAnimationFrame(raf); off.forEach((f) => f()); api.hideCard(); };
  };
})();
