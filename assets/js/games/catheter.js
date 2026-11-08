/* Lab game 2 · Catheter run (Glide + grip).
   A catheter is pushed from the femoral artery, up the iliac and the aorta, over the aortic arch
   and into the heart. Friction against the wall grows at every bend: the axial force decays as
   T(s) = F_hand · exp(−μ·θ(s)), θ = total angle the catheter has wrapped (capstan effect), and the
   wall carries a contact load T·|κ| per unit length at each bend. When the hand force needed at the
   tip exceeds the shaft's buckling load, the shaft buckles. Ultrasonic lubrication lowers μ (mean
   38% on ex-vivo aorta), so more of the push reaches the tip and the wall load drops. At the target,
   the heartbeat moves the vessel: high friction holds the tip with the wall, low friction lets it slip.
   Game: choose a task (stent, heart valve or clot removal), then three runs: ultrasound off, always
   on, and under your control. */
(function () {
  window.LabGames = window.LabGames || {};
  const TAU = Math.PI * 2;
  const MU0 = 0.19 /* catheter on wet vessel wall, cf. ~0.2 measured */, RED = 0.38, U = 0.55 /* mm per world unit: route ≈ 1.1 m */, KS = 0.05 /* N per mm of shaft compression */, FB = 2.5 /* buckling load, N */, LUMEN = { ilia: 13, aorta: 20, arch: 19, root: 18, cor: 9 };

  // ---------- vasculature: centreline through control points (world mm, y down) ----------
  const spline = (pts, step) => { const out = []; const P = [pts[0], ...pts, pts[pts.length - 1]];
    for (let i = 1; i < P.length - 2; i++) { const [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]]; const seg = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]), n = Math.max(2, Math.ceil(seg / step));
      for (let k = 0; k < n; k++) { const u = k / n, u2 = u * u, u3 = u2 * u; const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u2 + (-a + 3 * b - 3 * c + d) * u3); out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1]), p1[2]]); } }
    out.push(pts[pts.length - 1]); return out; };
  const measure = (raw) => { const p = raw.map(([x, y, r]) => ({ x, y, r: r || 14 })); let s = 0, th = 0;
    for (let i = 0; i < p.length; i++) { if (i) s += Math.hypot(p[i].x - p[i - 1].x, p[i].y - p[i - 1].y); p[i].s = s; }
    for (let i = 0; i < p.length; i++) { const a = p[Math.max(0, i - 1)], b = p[Math.min(p.length - 1, i + 1)]; p[i].ang = Math.atan2(b.y - a.y, b.x - a.x); }
    for (let i = 0; i < p.length; i++) { let da = i ? p[i].ang - p[i - 1].ang : 0; da = Math.atan2(Math.sin(da), Math.cos(da)); const ds = i ? p[i].s - p[i - 1].s : 1; p[i].k = da / Math.max(0.5, ds); th += Math.abs(da); p[i].th = th; }
    for (let i = 0; i < p.length; i++) { let acc = 0, n = 0; for (let j = Math.max(0, i - 4); j <= Math.min(p.length - 1, i + 4); j++) { acc += p[j].k; n++; } p[i].ks = acc / n; } // smoothed curvature
    return p; };
  const at = (p, s) => { if (s <= 0) return p[0]; let lo = 0, hi = p.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (p[m].s < s) lo = m; else hi = m; } const a = p[lo], b = p[hi], u = (s - a.s) / Math.max(1e-6, b.s - a.s);
    return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, ang: a.ang, th: a.th + (b.th - a.th) * u, k: a.ks, ks: a.ks, s, r: a.r, i: lo }; };
  const R = LUMEN;
  const MAIN = measure(spline([
    [430, 1470, R.ilia], [420, 1400, R.ilia], [395, 1330, R.ilia], [430, 1250, R.ilia], [470, 1180, R.ilia], [482, 1110, R.aorta], // femoral → iliac S-bends
    [484, 1000, R.aorta], [486, 820, R.aorta], [486, 620, R.aorta], [488, 470, R.arch],                                           // descending aorta
    [505, 380, R.arch], [570, 318, R.arch], [660, 312, R.arch], [735, 365, R.arch], [758, 450, R.root], [748, 540, R.root],        // aortic arch → ascending aorta → root
    [730, 578, R.cor], [706, 596, R.cor], [690, 620, R.cor], [700, 644, R.cor], [684, 668, R.cor], [694, 692, R.cor], [680, 716, R.cor] // left coronary, winding over the heart surface
  ], 4));
  const sOf = (y, x) => MAIN.reduce((b, p) => (Math.hypot(p.x - x, p.y - y) < Math.hypot(b.x - x, b.y - y) ? p : b)).s;
  const JUNC = [ // side branches the tip can wrongly enter; side = steer that takes it there
    { name: "contralateral iliac", s: sOf(1135, 478), side: +1, path: measure(spline([[480, 1130, R.ilia], [540, 1180, R.ilia], [590, 1270, R.ilia], [600, 1390, R.ilia]], 4)) },
    { name: "brachiocephalic artery", s: sOf(330, 540), side: -1, path: measure(spline([[540, 335, 11], [548, 250, 11], [535, 150, 11]], 4)) },
    { name: "left ventricle (through the valve)", s: sOf(560, 742), side: +1, path: measure(spline([[748, 556, 14], [770, 610, 16], [778, 660, 18]], 4)) }
  ];
  const TASKS = {
    stent: { name: "Stent", s: MAIN[MAIN.length - 1].s - 70, tol: 2.5, hold: 1.5, verb: "Expand the stent across the lesion" },
    clot: { name: "Clot removal", s: MAIN[MAIN.length - 1].s - 55, tol: 3, hold: 2.5, verb: "Hold the aspiration tip on the clot" },
    valve: { name: "Heart valve", s: sOf(548, 748) - 6, tol: 3, hold: 1.8, verb: "Open the valve in the aortic root" }
  };
  const S_HEART = sOf(450, 758);

  window.LabGames.catheter = (api, mode) => {
    const k = window.LabKit, { ctx: c, W, H, plot: P, PH } = api;
    let C = api.colors(), alive = true, raf = 0, last = performance.now(), t = 0;
    const off = [], on = (el, ev, f, o) => { el.addEventListener(ev, f, o); off.push(() => el.removeEventListener(ev, f, o)); };
    on(document, "themechange", () => (C = api.colors()));
    const keys = {}; let hold = { push: false, pull: false };
    on(window, "keydown", (e) => { if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyU", "KeyD"].includes(e.code) && document.activeElement?.tagName !== "INPUT") e.preventDefault(); keys[e.code] = true;
      if (e.code === "KeyU" && !e.repeat) toggleUS(); if ((e.code === "ArrowLeft" || e.code === "ArrowRight") && !e.repeat) steer = e.code === "ArrowLeft" ? -1 : +1; if (e.code === "KeyD" && !e.repeat) tryDeploy(); });
    on(window, "keyup", (e) => (keys[e.code] = false));

    // ---------- state ----------
    let task = TASKS.stent, steer = -1, usOn = false, usLock = null /* null | "off" | "on" */;
    const st = { h: 0, d: 0, branch: -1, Fh: 0, Ftip: 0, buckles: 0, buckleT: 0, dmg: new Float32Array(MAIN.length), dmgStub: JUNC.map((j) => new Float32Array(j.path.length)), damage: 0, deploy: 0, deployed: false, err: 0, slip: 0, time: 0, hist: [], lurch: 0, wrong: 0 };
    const reset = () => { Object.assign(st, { reached: false, h: 0, d: 0, branch: -1, Fh: 0, Ftip: 0, buckles: 0, buckleT: 0, damage: 0, deploy: 0, deployed: false, err: 0, slip: 0, time: 0, hist: [], lurch: 0, wrong: 0 }); st.dmg.fill(0); st.dmgStub.forEach((a) => a.fill(0)); steer = -1; };
    let toggleUS = () => { if (usLock) return; usOn = !usOn; syncUS(); };
    const syncUS = () => { const b = document.getElementById("c-us"); if (!b) return; b.classList.toggle("on", usOn); b.setAttribute("aria-pressed", usOn); b.innerHTML = `<span class="dot"></span>${usLock ? "🔒 " : ""}Ultrasound ${usOn ? "ON" : "OFF"} <kbd>U</kbd>`; b.disabled = !!usLock; };
    const mu = () => MU0 * (usOn ? 1 - RED * (st.redScale ?? 1) : 1);
    // where along which path is a given arc length of the inserted catheter
    const pos = (s) => { if (st.branch >= 0) { const j = JUNC[st.branch]; if (s > j.s) { const q = at(j.path, s - j.s); return { ...q, th: at(MAIN, j.s).th + q.th, stub: true }; } } return at(MAIN, s); };
    const theta = (s) => pos(s).th;
    const tipRes = () => { // resistance at the tip: base + narrowings near bends + a wall if a branch dead-ends
      const pq = pos(st.d); let r = 0.22 + 0.12 * Math.min(1, Math.abs(pq.k) * 30) + (pq.r <= R.cor && !pq.stub ? 0.2 : 0); // narrow coronary adds resistance if (st.branch >= 0) { const j = JUNC[st.branch]; if (st.d - j.s > j.path[j.path.length - 1].s - 6) r = 99; }
      if (st.d >= MAIN[MAIN.length - 1].s - 4 && st.branch < 0) r = 99; return r; };

    const physics = (dt) => {
      const vHand = 70; // world units/s of hand travel while a button is held (~40 mm/s)
      const fine = Math.abs(st.d - task.s) < 40 && st.branch < 0 ? 0.22 : 1; // fine advance near the target
      if (hold.push || keys.Space || keys.ArrowUp) st.h += vHand * fine * dt;
      if (hold.pull || keys.ArrowDown) st.h -= vHand * 1.2 * fine * dt;
      st.h = Math.max(0, st.h);
      // which branch the tip enters at each junction depends on the steer
      if (st.branch < 0) { JUNC.forEach((j, i) => { if (st.d > j.s - 1 && st.d < j.s + 4 && steer === j.side && st.h > st.d) { st.branch = i; st.wrong++; } }); }
      else if (st.d < JUNC[st.branch].s - 2) st.branch = -1;
      const E = Math.exp(-mu() * theta(st.d));
      // quasi-static shaft: compression δ = h − d; hand force KS·δ; the tip moves when the force reaching it beats its resistance
      let delta = st.h - st.d;
      if (delta < 0) { st.d = st.h; delta = 0; }
      const need = tipRes() / (KS * E); // compression needed to push the tip
      const dPrev = st.d;
      if (delta > need) { const adv = delta - need; st.d += Math.min(adv, 400 * dt); delta = st.h - st.d; }
      st.Fh = KS * delta; st.Ftip = st.Fh * E;
      const endS = st.branch >= 0 ? JUNC[st.branch].s + JUNC[st.branch].path[JUNC[st.branch].path.length - 1].s - 6 : MAIN[MAIN.length - 1].s - 4;
      if (st.d > endS) st.d = endS;
      if (st.Fh > FB) { // buckles: stored length bows out, part of it lurches the tip forward
        st.buckles++; st.buckleT = 1.2; const slack = delta - 0.45 * FB / KS; if (tipRes() < 50) st.d = Math.min(endS, st.d + Math.min(slack * 0.5, 14)); st.h = st.d + 0.45 * FB / KS; st.lurch = 1; k.audio.noise(0.2, 0.12, 180);
        // the lurch scrapes the wall at the bends
        for (let i = 0; i < MAIN.length && MAIN[i].s < st.d; i++) { const w = Math.abs(MAIN[i].ks) * 2; st.dmg[i] += w; st.damage += w * 0.05; }
        st.Fh = KS * (st.h - st.d); st.Ftip = st.Fh * E; }
      // wall load and wear: contact load per length T·|κ| at every bend the inserted shaft passes; wear = μ × load × sliding
      const slide = Math.abs(st.d - dPrev);
      if (slide > 0 || st.Fh > 0.05) {
        for (let i = 0; i < MAIN.length && MAIN[i].s < Math.min(st.d, st.branch >= 0 ? JUNC[st.branch].s : 1e9); i++) { const T = st.Fh * Math.exp(-mu() * MAIN[i].th); const load = T * Math.abs(MAIN[i].ks); const w = mu() * load * (slide + 0.02 * dt) * 0.012; st.dmg[i] += w; st.damage += w; }
        if (st.branch >= 0) { const j = JUNC[st.branch], a = st.dmgStub[st.branch]; for (let i = 0; i < j.path.length && j.path[i].s < st.d - j.s; i++) { const T = st.Fh * Math.exp(-mu() * (at(MAIN, j.s).th + j.path[i].th)); const w = mu() * T * Math.abs(j.path[i].ks) * (slide + 0.02 * dt) * 0.012; a[i] += w; st.damage += w; } }
      }
      st.buckleT = Math.max(0, st.buckleT - dt); st.lurch *= 0.9;
      api.canvas.dataset.d = st.d.toFixed(1); api.canvas.dataset.t = task.s.toFixed(1); api.canvas.dataset.b = st.branch;
      st.hist.push([st.Fh, st.Ftip]); if (st.hist.length > 300) st.hist.shift();
    };
    const beatAmp = () => { const near = Math.max(0, Math.min(1, (st.d - S_HEART + 60) / 80)); return near; };
    const heart = () => Math.pow(Math.max(0, Math.sin(t * TAU * (st.hr || 1.2))), 3);
    const deployPhysics = (dt) => { // the heart moves the vessel by ~6 mm; friction decides how much of that the tip follows
      const A = (6 / U) * heart() * beatAmp(), grip = mu() / MU0; st.slip = st.slip * (1 - dt * 2) + (usOn ? (Math.random() - 0.5) * 6 * dt : 0);
      st.err = ((st.d - task.s) + A * (1 - grip) * 1.6 + st.slip * (usOn ? 1 : 0.1)) * U;
      const ok = Math.abs(st.err) <= task.tol && !hold.push && !hold.pull && !keys.Space && !keys.ArrowUp && !keys.ArrowDown;
      if (st.deploying) { if (ok) st.deploy += dt; else st.deploy = 0; if (st.deploy >= task.hold) { st.deployed = true; st.deploying = false; st.finalErr = Math.abs(st.err); k.audio.pluck(523, 0.5); k.audio.pluck(784, 0.7); } } };
    const tryDeploy = () => { if (st.deployed) return; if (Math.abs(st.d - task.s) < 12 && st.branch < 0) { st.deploying = true; st.deploy = 0; } };

    // ---------- drawing ----------
    let cam = { x: 430, y: 1400 };
    const hugOff = (p, tension) => { const n = Math.sign(p.ks) || 0, room = Math.max(0, p.r - 4); return -n * Math.min(room, room * Math.min(1, Math.abs(p.ks) * 25 * (0.3 + tension))); };
    const drawVessels = (S, beat) => {
      const vessel = (p, dmgArr) => {
        const line = (wd) => { c.lineWidth = wd; c.beginPath(); p.forEach((q, i) => { const y = q.y + (q.s > 0 && q.y < 620 && q.x > 600 ? beat * 3 : 0); i ? c.lineTo(q.x, y) : c.moveTo(q.x, y); }); c.stroke(); };
        c.lineCap = "round"; c.lineJoin = "round";
        // draw width per point: use segments so the lumen can narrow
        for (let i = 1; i < p.length; i++) { const a = p[i - 1], b = p[i]; const by = (q) => q.y + (q.y < 620 && q.x > 600 ? beat * 3 : 0);
          c.strokeStyle = C.dark ? "#7A2433" : "#C9473C"; c.lineWidth = a.r * 2 + 10; c.beginPath(); c.moveTo(a.x, by(a)); c.lineTo(b.x, by(b)); c.stroke(); }
        for (let i = 1; i < p.length; i++) { const a = p[i - 1], b = p[i]; const by = (q) => q.y + (q.y < 620 && q.x > 600 ? beat * 3 : 0);
          const d = dmgArr ? Math.min(1, dmgArr[i] * 2) : 0; c.strokeStyle = d > 0.05 ? `rgb(${Math.round(250 - 40 * d)},${Math.round(205 - 150 * d)},${Math.round(200 - 150 * d)})` : C.dark ? "#3B1D28" : "#F9D3CD"; c.lineWidth = a.r * 2; c.beginPath(); c.moveTo(a.x, by(a)); c.lineTo(b.x, by(b)); c.stroke(); }
      };
      JUNC.forEach((j, i) => vessel(j.path, st.dmgStub[i])); vessel(MAIN, st.dmg);
    };
    const drawHeart = (beat) => { // abstract heart, ~13 cm across at this scale (route ≈ 1.1 m)
      const cx = 724, cy = 632, sc = 0.6 * (1 + beat * 0.03);
      c.save(); c.translate(cx, cy); c.scale(sc, sc); c.rotate(-0.3);
      c.fillStyle = C.dark ? "rgba(156,58,58,.45)" : "rgba(232,128,110,.38)"; c.strokeStyle = C.dark ? "rgba(255,170,150,.5)" : "rgba(170,60,45,.55)"; c.lineWidth = 3;
      c.beginPath(); c.moveTo(0, 150); c.bezierCurveTo(-170, 50, -150, -110, -55, -112); c.bezierCurveTo(-20, -114, 0, -90, 0, -70); c.bezierCurveTo(0, -90, 20, -114, 55, -112); c.bezierCurveTo(150, -110, 170, 50, 0, 150); c.closePath(); c.fill(); c.stroke();
      c.restore();
      k.text(c, "heart", cx - 30, cy + 110, "italic 600 13px Roboto, sans-serif", C.dark ? "#F5B7A8" : "#A0574C");
    };
    const drawBody = () => { // background tissue
      const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, C.dark ? "#1E1218" : "#FCEDE6"); g.addColorStop(1, C.dark ? "#160D12" : "#F6DDD3"); c.fillStyle = g; c.fillRect(0, 0, W, H); };
    const drawCatheter = (beat) => {
      const pts = []; const n = Math.max(2, Math.round(st.d / 3)); const tension = Math.min(1, st.Fh / FB);
      for (let i = 0; i <= n; i++) { const s = (i / n) * st.d, q = pos(s), nx = -Math.sin(q.ang), ny = Math.cos(q.ang), o = hugOff(q, tension);
        let bx = 0, by = 0; if (st.buckleT > 0 && q.s > 200 && q.s < 700 && !q.stub) { const amp = 14 * st.buckleT * Math.sin((q.s - 200) / 500 * Math.PI); bx = nx * amp * Math.sin(q.s / 25); by = ny * amp * Math.sin(q.s / 25); }
        pts.push([q.x + nx * o + bx, q.y + ny * o + by + (q.y < 620 && q.x > 600 ? beat * 3 : 0)]); }
      c.strokeStyle = C.dark ? "#9CC9F0" : "#2F6FB0"; c.lineWidth = 6; c.lineCap = "round"; c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.stroke();
      c.strokeStyle = "rgba(255,255,255,.4)"; c.lineWidth = 1.5; c.stroke();
      const tip = pts[pts.length - 1], q = pos(st.d), a = q.ang + steer * 0.6;
      // pre-shaped tip, turned by the steer
      c.strokeStyle = C.dark ? "#9CC9F0" : "#2F6FB0"; c.lineWidth = 5; c.beginPath(); c.moveTo(tip[0], tip[1]); c.quadraticCurveTo(tip[0] + Math.cos(q.ang) * 8, tip[1] + Math.sin(q.ang) * 8, tip[0] + Math.cos(a) * 14, tip[1] + Math.sin(a) * 14); c.stroke();
      c.fillStyle = C.coral; c.beginPath(); c.arc(tip[0] + Math.cos(a) * 14, tip[1] + Math.sin(a) * 14, 3.5, 0, TAU); c.fill();
      // ultrasonic modules along the shaft
      for (let s = st.d - 40; s > 0 && s > st.d - 400; s -= 90) { const qq = pos(s), nx = -Math.sin(qq.ang), ny = Math.cos(qq.ang), o = hugOff(qq, tension); const x = qq.x + nx * o, y = qq.y + ny * o;
        c.fillStyle = C.gold; c.save(); c.translate(x, y); c.rotate(qq.ang); k.rr(c, -6, -5, 12, 10, 3); c.fill(); c.restore();
        if (usOn) { c.strokeStyle = "rgba(94,209,200,.8)"; c.lineWidth = 1.5; const a2 = (t * 3) % 1; c.globalAlpha = 1 - a2; c.beginPath(); c.arc(x, y, 7 + a2 * 10, 0, TAU); c.stroke(); c.globalAlpha = 1; } }
      return tip;
    };
    const drawTarget = (beat) => {
      const q = at(MAIN, task.s), y = q.y + (q.y < 620 && q.x > 600 ? beat * 3 : 0), nx = -Math.sin(q.ang), ny = Math.cos(q.ang);
      if (task === TASKS.stent) { c.fillStyle = "#F2C94C"; [-1, 1].forEach((sg) => { c.beginPath(); c.ellipse(q.x + nx * sg * 7, y + ny * sg * 7, 14, 4, q.ang, 0, TAU); c.fill(); }); }
      if (task === TASKS.clot) { c.fillStyle = "#7A1F2B"; const sz = st.deployed ? 2 : 9 - (st.deploy / task.hold) * 6; c.beginPath(); c.arc(q.x, y, Math.max(2, sz), 0, TAU); c.fill(); }
      if (task === TASKS.valve) { c.strokeStyle = "#F2C94C"; c.lineWidth = 3; c.beginPath(); c.arc(q.x, y, 14, 0, TAU); c.stroke(); }
      if (st.deploying || st.deployed) { const open = st.deployed ? 1 : st.deploy / task.hold; c.strokeStyle = C.dark ? "#E9EEF5" : "#55657A"; c.lineWidth = 1.4;
        const ex = q.x + nx * 0, ey = y; c.save(); c.translate(ex + Math.cos(q.ang) * st.err, ey + Math.sin(q.ang) * st.err); c.rotate(q.ang);
        if (task !== TASKS.clot) for (let z = -3; z <= 3; z++) { c.beginPath(); c.moveTo(z * 5, -3 - 8 * open); c.lineTo(z * 5 + 2.5, 0); c.lineTo(z * 5, 3 + 8 * open); c.stroke(); }
        c.restore(); }
      // tolerance window marks
      c.strokeStyle = C.gold; c.setLineDash([3, 3]); c.lineWidth = 1.5; [-task.tol, task.tol].forEach((dd) => { const p2 = at(MAIN, task.s + dd), y2 = p2.y + (p2.y < 620 && p2.x > 600 ? beat * 3 : 0); c.beginPath(); c.moveTo(p2.x + nx * 16, y2 + ny * 16); c.lineTo(p2.x - nx * 16, y2 - ny * 16); c.stroke(); }); c.setLineDash([]);
    };
    const drawWorld = () => {
      const beat = heart() * (st.hr ? 1 : 1);
      const tipW = pos(st.d); cam.x += (tipW.x - cam.x) * 0.12; cam.y += (tipW.y - cam.y) * 0.12;
      drawBody(); c.save(); const z = 1.15; c.translate(W * 0.42, H * 0.55); c.scale(z, z); c.translate(-cam.x, -cam.y);
      drawHeart(beat); drawVessels(st, beat); drawTarget(beat);
      // access sheath at the groin
      const a0 = MAIN[0]; c.fillStyle = C.ink2; c.save(); c.translate(a0.x, a0.y + 30); c.rotate(MAIN[0].ang); k.rr(c, -50, -7, 50, 14, 4); c.fill(); c.restore();
      const tip = drawCatheter(beat);
      // labels in the anatomy
      const lab = (s, txt, left) => { const q = at(MAIN, s); k.text(c, txt, left ? q.x - 30 : q.x + 30, q.y, "600 13px Roboto, sans-serif", C.dark ? "#F5B7A8" : "#8A2A20", left ? "right" : "left"); };
      lab(60, "femoral artery", true); lab(sOf(1240, 430), "iliac bends"); lab(sOf(800, 486), "descending aorta", true); lab(sOf(318, 600), "aortic arch"); lab(sOf(520, 752), "aortic root"); lab(MAIN[MAIN.length - 1].s - 120, "left coronary");
      JUNC.forEach((j) => { const q = j.path[j.path.length - 1]; k.text(c, j.name, q.x + 10, q.y, "italic 12px Roboto, sans-serif", C.dark ? "#C08A80" : "#A0574C"); });
      c.restore();
    };
    const drawHUD = () => {
      // force gauges: hand force against the buckling load, and the force that reaches the tip
      const gx = 18, gy = H - 128;
      c.fillStyle = C.dark ? "rgba(16,29,49,.88)" : "rgba(255,255,255,.9)"; k.rr(c, gx, gy, 250, 112, 12); c.fill();
      const bar = (y, v, max, col, label) => { k.text(c, label, gx + 12, y - 6, "600 11px Roboto, sans-serif", C.ink2); c.fillStyle = C.dark ? "#22344F" : "#E7ECF2"; k.rr(c, gx + 12, y, 226, 12, 6); c.fill(); c.fillStyle = col; k.rr(c, gx + 12, y, 226 * Math.min(1, v / max), 12, 6); c.fill(); };
      bar(gy + 26, st.Fh, 3, st.Fh > 0.85 * FB ? C.coral : C.blue, `push at your hand ${st.Fh.toFixed(2)} N`);
      c.strokeStyle = C.coral; c.lineWidth = 2; c.beginPath(); c.moveTo(gx + 12 + 226 * FB / 3, gy + 22); c.lineTo(gx + 12 + 226 * FB / 3, gy + 42); c.stroke(); k.text(c, "buckles", gx + 12 + 226 * FB / 3 - 2, gy + 52, "10px Roboto Mono, monospace", C.coral, "right");
      bar(gy + 82, st.Ftip, 3, C.teal, `reaches the tip ${st.Ftip.toFixed(2)} N (${Math.round(Math.exp(-mu() * theta(st.d)) * 100)}%)`);
      // top-right: run stats
      const sx = W - 230; c.fillStyle = C.dark ? "rgba(16,29,49,.88)" : "rgba(255,255,255,.9)"; k.rr(c, sx, 14, 214, 94, 12); c.fill();
      k.text(c, `depth ${(st.d * U / 10).toFixed(0)} cm · bends ${Math.round(theta(st.d) * 57.3)}°`, sx + 12, 36, "600 12px Roboto Mono, monospace", C.ink);
      k.text(c, `wall damage ${st.damage.toFixed(1)}`, sx + 12, 56, "600 12px Roboto Mono, monospace", st.damage > 8 ? C.coral : C.ink2);
      k.text(c, `buckling events ${st.buckles}`, sx + 12, 76, "600 12px Roboto Mono, monospace", st.buckles ? C.coral : C.ink2);
      k.text(c, `time ${st.time.toFixed(0)} s`, sx + 12, 96, "600 12px Roboto Mono, monospace", C.ink2);
      // steering and junction hints
      const nxt = JUNC.find((j) => st.branch < 0 && j.s > st.d - 2 && j.s - st.d < 90);
      if (nxt) k.text(c, `Junction ahead: steer ${nxt.side === +1 ? "← left" : "right →"} to stay on course`, W / 2, H - 20, "700 15px Roboto, sans-serif", C.ink, "center");
      if (st.branch >= 0) k.text(c, `Wrong turn into the ${JUNC[st.branch].name}: pull back and steer the other way`, W / 2, H - 20, "700 15px Roboto, sans-serif", C.coral, "center");
      if (st.buckleT > 0) k.text(c, "BUCKLED: the shaft bowed instead of advancing", W / 2, 48, "800 18px Roboto, sans-serif", C.coral, "center");
      k.text(c, `tip ${steer < 0 ? "↶ left" : "right ↷"}`, gx + 250 + 14, H - 24, "700 13px Roboto Mono, monospace", C.ink2);
      if (Math.abs(st.d - task.s) < 12 && !st.deployed && st.branch < 0) { const okk = Math.abs(st.err) <= task.tol;
        k.text(c, st.deploying ? `${task.verb}: hold still… ${Math.round((st.deploy / task.hold) * 100)}%` : `At the target · press Deploy (D) · error ${st.err.toFixed(1)} mm`, W / 2, 80, "700 16px Roboto, sans-serif", okk ? C.teal : C.coral, "center"); }
    };
    const drawPlot = () => { // axial force along the inserted catheter: it decays at each bend (capstan effect)
      P.clearRect(0, 0, W, PH); P.fillStyle = C.dark ? "#101D31" : "#F1F4F8"; k.rr(P, 0, 0, W, PH, 12); P.fill();
      const x0 = 50, w = W - 80, yb = PH - 26, h = PH - 46, L = MAIN[MAIN.length - 1].s;
      P.strokeStyle = C.rule; P.beginPath(); P.moveTo(x0, yb); P.lineTo(x0 + w, yb); P.stroke();
      // bends as shaded bands
      MAIN.forEach((q, i) => { if (Math.abs(q.ks) > 0.008 && i % 2 === 0) { P.fillStyle = "rgba(217,80,46,.08)"; P.fillRect(x0 + (q.s / L) * w, yb - h, 2.5, h); } });
      const curve = (m, col, dash) => { P.strokeStyle = col; P.lineWidth = 2; P.setLineDash(dash || []); P.beginPath(); for (let s = 0; s <= st.d; s += 6) { const v = Math.exp(-m * theta(s)); const x = x0 + (s / L) * w, y = yb - v * h; s ? P.lineTo(x, y) : P.moveTo(x, y); } P.stroke(); P.setLineDash([]); };
      curve(MU0, C.coral, usOn ? [5, 5] : null); curve(MU0 * (1 - RED), C.teal, usOn ? null : [5, 5]);
      k.text(P, "share of your push left at each point along the catheter (bends shaded): coral = no ultrasound, teal = ultrasound on", x0, 16, "600 11px Roboto, sans-serif", C.ink2);
      k.text(P, "groin", x0, PH - 8, "10px Roboto Mono, monospace", C.ink3); k.text(P, "heart", x0 + w, PH - 8, "10px Roboto Mono, monospace", C.ink3, "right");
    };
    const ctrl = (lockText) => {
      api.controls.innerHTML = `<button class="lab-hold" id="c-push" type="button">⬆ Push <kbd>Space</kbd></button><button class="btn ghost small-btn" id="c-pull" type="button">⬇ Pull <kbd>↓</kbd></button>
        <button class="btn ghost small-btn" id="c-steer" type="button">↶↷ Steer <kbd>← →</kbd></button><button class="lab-us" id="c-us" type="button"></button>
        <button class="btn small-btn" id="c-dep" type="button">Deploy <kbd>D</kbd></button>${lockText ? `<span class="lab-note">${lockText}</span>` : ""}`;
      const holdBtn = (id, key) => { const b = document.getElementById(id); const d = (e) => { e.preventDefault(); hold[key] = true; b.classList.add("down"); k.audio.get(); }, u = () => { hold[key] = false; b.classList.remove("down"); }; b.addEventListener("pointerdown", d); b.addEventListener("pointerup", u); b.addEventListener("pointerleave", u); b.addEventListener("pointercancel", u); };
      holdBtn("c-push", "push"); holdBtn("c-pull", "pull");
      document.getElementById("c-steer").addEventListener("click", () => (steer = -steer));
      document.getElementById("c-us").addEventListener("click", () => toggleUS()); document.getElementById("c-dep").addEventListener("click", () => tryDeploy());
      syncUS(); k.muteButton(api.controls);
    };

    let frame = () => {};
    const loop = (now) => { if (!alive) return; const dt = Math.min((now - last) / 1000, 0.04); last = now; t += dt; frame(dt); raf = requestAnimationFrame(loop); };
    const runOnce = (lockText, limit) => new Promise((done) => {
      reset(); cam = { x: MAIN[0].x, y: MAIN[0].y }; ctrl(lockText);
      frame = (dt) => { if (!st.deployed) { st.time += dt; physics(dt); deployPhysics(dt); }
        c.clearRect(0, 0, W, H); drawWorld(); drawHUD(); drawPlot();
        if (Math.abs(st.d - task.s) < 12 && st.branch < 0) st.reached = true;
        if (st.deployed || (limit && st.time > limit)) { frame = () => { c.clearRect(0, 0, W, H); drawWorld(); drawHUD(); }; done({ ...st, ok: st.deployed, err: st.finalErr ?? 99 }); } };
    });
    const scoreOf = (r) => Math.max(0, Math.round((r.reached ? 25 : 0) + (r.ok ? 35 + Math.max(0, 20 - r.err * 6) : 0) + Math.max(0, 20 - r.damage * 3) - r.buckles * 1.5 - Math.max(0, r.time - 60) * 0.15));

    // ======================= GAME =======================
    if (mode === "game") {
      (async () => {
        const pick = await api.card(`<span class="lp-k">Game 2 · Glide + grip</span><h3>Catheter run</h3><p>You are the interventional cardiologist. From the groin, push the catheter up the iliac artery and the aorta, over the arch and into the heart. Every bend the catheter wraps around eats part of your push, and loads the wall where it presses.</p><p><b>Push</b> (Space), <b>pull</b> (↓), <b>steer</b> the tip at junctions (← →), then <b>deploy</b> (D) and hold still while the heart beats.</p><p>Choose your task:</p>`, [{ label: "Stent in a coronary" }, { label: "Heart valve" }, { label: "Clot removal" }]);
        if (!alive) return; task = [TASKS.stent, TASKS.valve, TASKS.clot][pick];
        const runs = [], specs = [
          ["off", "Run A of 3 · Ultrasound locked OFF", `<span class="lp-k">Run A of 3</span><h3>A conventional catheter</h3><p>Ultrasound is locked off: friction stays high all the way. Watch how much of your push reaches the tip, and what happens at the bends.</p>`],
          ["on", "Run B of 3 · Ultrasound locked ON", `<span class="lp-k">Run B of 3</span><h3>Always gliding</h3><p>Ultrasound is locked on: the catheter glides. Navigation should feel easier. Now try to hold still at the target while the heart beats.</p>`],
          [null, "Run C of 3 · Ultrasound is yours (U)", `<span class="lp-k">Run C of 3</span><h3>Glide, then grip</h3><p>The ultrasound is yours. Use it the way the variable-friction catheter is meant to be used.</p>`]];
        for (let i = 0; i < 3 && alive; i++) { const [lock, note, intro] = specs[i]; await api.card(intro, [{ label: "Start" }]); if (!alive) return;
          usLock = lock; usOn = lock === "on"; const r = await runOnce(note, 150); const sc = scoreOf(r); runs.push({ ...r, sc });
          api.log("game", ["A", "B", "C"][i], { task: task.name, score: sc, ok: r.ok ? 1 : 0, err: r.err, damage: r.damage, buckles: r.buckles, time: r.time, wrong: r.wrong });
          await api.card(`<h3>${r.ok ? `${task.name} done` : r.reached ? "Reached the target, but could not hold still" : "Time is up before the target"} · ${sc} / 100</h3><ul class="ls-res"><li>Placement error <b>${r.ok ? r.err.toFixed(1) + " mm" : "—"}</b></li><li>Wall damage <b>${r.damage.toFixed(1)}</b></li><li>Buckling events <b>${r.buckles}</b></li><li>Time <b>${r.time.toFixed(0)} s</b></li></ul>
            <p>${i === 0 ? "High friction everywhere: the push fades at every bend, so you push harder, the shaft buckles and the bends take the load. At the target, though, the tip held still." : i === 1 ? "Low friction everywhere: more of your push reaches the tip and the wall is spared. But at the target the tip slides with every heartbeat." : "Glide to get there, grip to work there."}</p>`, [{ label: i < 2 ? "Next run" : "See the debrief" }]); }
        if (!alive) return;
        const best = Math.max(...runs.map((r) => r.sc)), nb = api.best(runs[2].sc, `${runs[2].sc} / 100`);
        api.log("game", "total", { task: task.name, a: runs[0].sc, b: runs[1].sc, c: runs[2].sc });
        const go = await api.card(`<span class="lp-k">Debrief · ${task.name}</span><h3>Your switched run: ${runs[2].sc} / 100${nb ? " · new best" : ""}</h3>
          <table class="ls-tab"><tr><th></th><th>Off</th><th>On</th><th>You</th></tr>
          <tr><td>Wall damage</td>${runs.map((r) => `<td>${r.damage.toFixed(1)}</td>`).join("")}</tr>
          <tr><td>Buckling</td>${runs.map((r) => `<td>${r.buckles}</td>`).join("")}</tr>
          <tr><td>Placement error</td>${runs.map((r) => `<td>${r.ok ? r.err.toFixed(1) + " mm" : "—"}</td>`).join("")}</tr>
          <tr><td>Score</td>${runs.map((r) => `<td><b>${r.sc}</b></td>`).join("")}</tr></table>
          <p>Friction at the wall decides two opposite things: how safely a catheter travels, and how still it stays at work. A fixed coating has to compromise. Ultrasonic lubrication lets the physician choose, moment by moment, like a violinist with the bow.</p>`, [{ label: "Play again" }, { label: "Explore mode" }]);
        if (!alive) return; document.querySelector(`.ls-modes [data-m="${go === 1 ? "explore" : "game"}"]`)?.click();
      })();
    }

    // ======================= EXPLORE =======================
    if (mode === "explore") {
      usLock = null; usOn = false; reset();
      ctrl("");
      const ex = document.createElement("span"); ex.className = "lab-ex";
      ex.innerHTML = `<label class="lab-range">Friction reduction <input type="range" id="x-red" min="0" max="0.6" step="0.01" value="${RED}"><output id="x-ro">${Math.round(RED * 100)}%</output></label>
        <label class="lab-select">Task <select id="x-task"><option value="stent">Stent</option><option value="valve">Heart valve</option><option value="clot">Clot removal</option></select></label>
        <label class="lab-range">Heart rate <input type="range" id="x-hr" min="0.8" max="2.2" step="0.05" value="1.2"><output id="x-ho">72 bpm</output></label>
        <button class="btn ghost small-btn" id="x-reset" type="button">Restart</button>`;
      api.controls.insertBefore(ex, api.controls.lastChild);
      const ri = document.getElementById("x-red"); ri.addEventListener("input", () => { st.redScale = +ri.value / RED; document.getElementById("x-ro").textContent = Math.round(+ri.value * 100) + "%"; });
      document.getElementById("x-task").addEventListener("change", (e) => { task = TASKS[e.target.value]; st.deployed = false; st.deploying = false; });
      const hi = document.getElementById("x-hr"); hi.addEventListener("input", () => { st.hr = +hi.value; document.getElementById("x-ho").textContent = Math.round(+hi.value * 60) + " bpm"; });
      document.getElementById("x-reset").addEventListener("click", () => { const rs = st.redScale, hr = st.hr; reset(); st.redScale = rs; st.hr = hr; cam = { x: MAIN[0].x, y: MAIN[0].y }; });
      cam = { x: MAIN[0].x, y: MAIN[0].y };
      frame = (dt) => { st.time += dt; physics(dt); deployPhysics(dt); c.clearRect(0, 0, W, H); drawWorld(); drawHUD(); drawPlot(); };
    }
    raf = requestAnimationFrame(loop);
    return () => { alive = false; cancelAnimationFrame(raf); off.forEach((f) => f()); api.hideCard(); };
  };
})();
