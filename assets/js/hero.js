/* Hero: five staff lines simulated as damped strings (1-D wave equation).
   The cursor is the baton: it deflects the lines it crosses; a click plucks
   the nearest line and, with sound on, plays its note. */
(function () {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const LINES = 5, N = 140;
  const NOTES = [392.0, 329.63, 293.66, 246.94, 196.0]; // G4 E4 D4 B3 G3 (top to bottom)
  let W = 0, H = 0, dpr = 1, strings = [], pointer = null, last = null, sound = false, audio = null;
  let colors = {};

  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    colors = { line: cs.getPropertyValue("--ink-3").trim(), brass: cs.getPropertyValue("--brass").trim(), tide: cs.getPropertyValue("--tide").trim() };
  }
  function baseY(i) {
    const gap = W < 700 ? 16 : 20, top = H - (LINES - 1) * gap - (W < 700 ? 44 : 56);
    return top + i * gap;
  }
  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!strings.length) strings = Array.from({ length: LINES }, () => ({ y: new Float32Array(N), v: new Float32Array(N), energy: 0 }));
    draw();
  }

  function step() {
    const c2 = 0.32, damp = 0.012;
    for (const s of strings) {
      let e = 0;
      for (let k = 0; k < 2; k++) {
        for (let i = 1; i < N - 1; i++) s.v[i] += c2 * (s.y[i - 1] - 2 * s.y[i] + s.y[i + 1]) - damp * s.v[i];
        for (let i = 1; i < N - 1; i++) s.y[i] += s.v[i];
      }
      for (let i = 0; i < N; i++) e += s.y[i] * s.y[i];
      s.energy = e / N;
    }
  }

  function baton() {
    if (!pointer) return;
    const dx = last ? pointer.x - last.x : 0, dy = last ? pointer.y - last.y : 0;
    const speed = Math.min(Math.hypot(dx, dy), 40);
    strings.forEach((s, li) => {
      const by = baseY(li);
      const prevY = last ? last.y : pointer.y;
      // the baton crosses a line: kick it at the crossing point
      if ((prevY - by) * (pointer.y - by) <= 0 && speed > 1) {
        const i = Math.round((pointer.x / W) * (N - 1));
        for (let j = -4; j <= 4; j++) { const k = i + j; if (k > 0 && k < N - 1) s.v[k] += Math.sign(dy || 1) * speed * 0.25 * Math.exp(-(j * j) / 8); }
      }
    });
    last = { ...pointer };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    strings.forEach((s, li) => {
      const by = baseY(li);
      const glow = Math.min(s.energy / 30, 1);
      ctx.beginPath();
      for (let i = 0; i < N; i++) { const x = (i / (N - 1)) * W, y = by + s.y[i]; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.strokeStyle = glow > 0.02 ? colors.brass : colors.line;
      ctx.globalAlpha = 0.35 + glow * 0.6;
      ctx.lineWidth = 1 + glow * 1.4;
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
    if (pointer) {
      ctx.beginPath(); ctx.arc(pointer.x, pointer.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = colors.brass; ctx.fill();
    }
  }

  function loop() { baton(); step(); draw(); requestAnimationFrame(loop); }

  function pluck(x, y) {
    let best = 0, bd = Infinity;
    strings.forEach((_, i) => { const d = Math.abs(baseY(i) - y); if (d < bd) { bd = d; best = i; } });
    const s = strings[best], c = Math.round((x / W) * (N - 1));
    for (let i = 1; i < N - 1; i++) { const t = i < c ? i / c : (N - 1 - i) / (N - 1 - c); s.y[i] += 22 * t * (y < baseY(best) ? -1 : 1); }
    if (sound) play(NOTES[best]);
  }

  function play(f) {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const t = audio.currentTime, o = audio.createOscillator(), o2 = audio.createOscillator(), g = audio.createGain();
      o.type = "triangle"; o.frequency.value = f; o2.type = "sine"; o2.frequency.value = f * 2;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
      o.connect(g); o2.connect(g); g.connect(audio.destination);
      o.start(t); o2.start(t); o.stop(t + 1.7); o2.stop(t + 1.7);
    } catch {}
  }

  const hero = canvas.parentElement;
  const pos = (e) => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  hero.addEventListener("pointermove", (e) => { pointer = pos(e); });
  hero.addEventListener("pointerleave", () => { pointer = null; last = null; });
  hero.addEventListener("pointerdown", (e) => { if (e.target.closest("a,button")) return; const p = pos(e); pluck(p.x, p.y); });

  const sbtn = document.getElementById("sound-btn");
  if (sbtn) sbtn.addEventListener("click", () => {
    sound = !sound; sbtn.setAttribute("aria-pressed", sound);
    sbtn.textContent = sound ? "Sound on" : "Sound off";
    if (sound) play(NOTES[2]);
  });

  readColors(); resize();
  window.addEventListener("resize", resize);
  document.addEventListener("themechange", () => { readColors(); draw(); });
  if (!reduce) {
    // an opening chord so the score is alive on load
    setTimeout(() => { [0.25, 0.5, 0.75].forEach((f, k) => setTimeout(() => pluck(W * f, baseY(k * 2) + 2), k * 220)); }, 400);
    requestAnimationFrame(loop);
  }
})();
