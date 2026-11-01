/* Hero: the defense clip plays full width behind the quote; six coloured
   strings run across the bottom. Sweeping the pointer across a string plucks
   it: the string vibrates (1-D wave equation), music notes rise from the
   crossing point, and with sound on it plays a plucked-string tone
   (Karplus-Strong synthesis). */
(function () {
  const hero = document.querySelector(".hero");
  const canvas = document.getElementById("hero-canvas");
  if (!hero || !canvas) return;
  const D = (window.SITE && window.SITE.defense) || {};
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- background video ---------------- */
  const media = document.getElementById("hero-media");
  const hearBtn = document.getElementById("hear-btn");
  let video = null;

  function fallback() {
    media.innerHTML = "";
    media.classList.add("fallback");
    if (hearBtn) hearBtn.hidden = true;
    hero.insertAdjacentHTML("beforeend", '<span class="sample hero-sample">Add your defense clip: assets/video/hero-loop.mp4</span>');
  }
  if (D.heroVideo) {
    video = document.createElement("video");
    video.muted = true; video.loop = true; video.playsInline = true;
    video.setAttribute("playsinline", ""); video.setAttribute("muted", "");
    video.preload = "auto";
    if (D.heroPoster) video.poster = D.heroPoster;
    if (!reduce) video.autoplay = true;
    const src = document.createElement("source");
    src.src = D.heroVideo; src.type = "video/mp4";
    src.addEventListener("error", fallback);
    video.appendChild(src);
    media.appendChild(video);
    if (!reduce) video.play().catch(() => {});
  } else if (D.heroYoutubeId) {
    const id = encodeURIComponent(D.heroYoutubeId);
    const start = D.heroStart ? `&start=${D.heroStart}` : "", end = D.heroEnd ? `&end=${D.heroEnd}` : "";
    media.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&disablekb=1&modestbranding=1&playsinline=1&rel=0${start}${end}" title="Defense clip" allow="autoplay; encrypted-media" tabindex="-1" aria-hidden="true"></iframe>`;
    if (hearBtn) { hearBtn.textContent = "Watch with sound"; hearBtn.addEventListener("click", () => document.getElementById("overture").scrollIntoView()); }
  } else {
    fallback();
  }

  if (video && hearBtn) {
    hearBtn.addEventListener("click", () => {
      if (video.muted || video.paused) {
        video.muted = false; video.currentTime = 0; video.play().catch(() => {});
        hearBtn.textContent = "Mute"; hearBtn.setAttribute("aria-pressed", "true");
      } else {
        video.muted = true;
        hearBtn.textContent = "Hear the quote"; hearBtn.setAttribute("aria-pressed", "false");
      }
    });
  }

  /* ---------------- strings ---------------- */
  const ctx = canvas.getContext("2d");
  // top to bottom: high to low, C major pentatonic so any sweep sounds musical
  const STR = [
    { f: 1046.5, color: "#6CC3DB", w: 1.0 },
    { f: 880.0, color: "#A3A8F2", w: 1.2 },
    { f: 783.99, color: "#E2B45A", w: 1.4 },
    { f: 659.25, color: "#EE8B97", w: 1.6 },
    { f: 587.33, color: "#CC9BDB", w: 1.9 },
    { f: 523.25, color: "#93C79F", w: 2.2 }
  ];
  const N = 160, GLYPHS = ["♪", "♫", "♩", "♬", "♪", "♫"];
  let W = 0, H = 0, strings = [], notes = [], pointer = null, last = null, sound = false;
  let audio = null, buffers = [];

  function gap() { return W < 700 ? 15 : 20; }
  function baseY(i) { return H - (STR.length - 1) * gap() - (W < 700 ? 34 : 46) + i * gap(); }

  function resize() {
    const r = canvas.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!strings.length) strings = STR.map(() => ({ y: new Float32Array(N), v: new Float32Array(N), energy: 0, lastPluck: 0 }));
  }

  function step() {
    const c2 = 0.3, damp = 0.01;
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

  function pluckAt(li, x, dir, strength) {
    const s = strings[li], c = Math.max(2, Math.min(N - 3, Math.round((x / W) * (N - 1))));
    for (let j = -5; j <= 5; j++) { const k = c + j; if (k > 0 && k < N - 1) s.v[k] += dir * strength * Math.exp(-(j * j) / 10); }
    const now = performance.now();
    if (now - s.lastPluck < 70) return;
    s.lastPluck = now;
    const count = 1 + Math.round(Math.min(strength, 10) / 5);
    for (let n = 0; n < count; n++) {
      notes.push({
        x: x + (Math.random() - 0.5) * 16, y: baseY(li) - 6,
        vx: (Math.random() - 0.5) * 0.9, vy: -(1.1 + Math.random() * 1.3),
        rot: (Math.random() - 0.5) * 0.6, vr: (Math.random() - 0.5) * 0.03,
        life: 1, size: 16 + Math.random() * 14,
        glyph: GLYPHS[(li + n + Math.floor(Math.random() * 3)) % GLYPHS.length], color: STR[li].color,
        phase: Math.random() * 6.28
      });
    }
    if (notes.length > 140) notes.splice(0, notes.length - 140);
    if (sound) play(li, x);
  }

  function baton() {
    if (!pointer) return;
    if (!last) { last = { ...pointer }; return; }
    const dx = pointer.x - last.x, dy = pointer.y - last.y;
    const speed = Math.min(Math.hypot(dx, dy), 50);
    if (speed > 0.5) {
      STR.forEach((_, li) => {
        const by = baseY(li);
        if ((last.y - by) * (pointer.y - by) < 0 || (last.y !== by && pointer.y === by)) {
          const t = (by - last.y) / (dy || 1e-6);
          pluckAt(li, last.x + dx * t, Math.sign(dy) || 1, 2 + speed * 0.28);
        }
      });
    }
    last = { ...pointer };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // strings
    strings.forEach((s, li) => {
      const by = baseY(li), glow = Math.min(s.energy / 25, 1), c = STR[li].color;
      ctx.beginPath();
      for (let i = 0; i < N; i++) { const x = (i / (N - 1)) * W, y = by + s.y[i]; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.strokeStyle = c;
      ctx.globalAlpha = 0.45 + glow * 0.55;
      ctx.lineWidth = STR[li].w + glow * 1.2;
      ctx.shadowColor = c; ctx.shadowBlur = glow * 14;
      ctx.stroke();
    });
    ctx.shadowBlur = 0;
    // notes
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (const n of notes) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, n.life) * 0.95;
      ctx.translate(n.x + Math.sin(n.phase) * 6, n.y); ctx.rotate(n.rot);
      ctx.fillStyle = n.color;
      ctx.font = `${n.size}px "Segoe UI Symbol", "Apple Symbols", "Noto Music", "DejaVu Sans", serif`;
      ctx.fillText(n.glyph, 0, 0);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }
  function updateNotes() {
    for (const n of notes) { n.x += n.vx; n.y += n.vy; n.vy *= 0.992; n.rot += n.vr; n.phase += 0.06; n.life -= 0.0075; }
    notes = notes.filter((n) => n.life > 0 && n.y > -40);
  }

  function loop() { baton(); step(); updateNotes(); draw(); requestAnimationFrame(loop); }

  /* plucked-string sound, Karplus-Strong */
  function makeBuffers() {
    const sr = audio.sampleRate;
    buffers = STR.map(({ f }) => {
      const len = Math.floor(sr * 1.8), P = Math.round(sr / f), buf = audio.createBuffer(1, len, sr), d = buf.getChannelData(0);
      for (let i = 0; i < P; i++) d[i] = Math.random() * 2 - 1;
      for (let i = P; i < len; i++) d[i] = 0.996 * 0.5 * (d[i - P] + d[i - P - 1 < 0 ? 0 : i - P - 1]);
      return buf;
    });
  }
  function play(li, x) {
    try {
      if (!audio) { audio = new (window.AudioContext || window.webkitAudioContext)(); makeBuffers(); }
      if (audio.state === "suspended") audio.resume();
      const src = audio.createBufferSource(), g = audio.createGain();
      src.buffer = buffers[li]; g.gain.value = 0.22;
      let node = src.connect(g);
      if (audio.createStereoPanner) { const p = audio.createStereoPanner(); p.pan.value = (x / W) * 1.6 - 0.8; g.connect(p); node = p; }
      node.connect(audio.destination);
      src.start();
    } catch {}
  }

  const pos = (e) => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  hero.addEventListener("pointermove", (e) => { pointer = pos(e); });
  hero.addEventListener("pointerleave", () => { pointer = null; last = null; });
  hero.addEventListener("pointerdown", (e) => {
    if (e.target.closest("a,button")) return;
    const p = pos(e); let best = 0, bd = Infinity;
    STR.forEach((_, i) => { const d = Math.abs(baseY(i) - p.y); if (d < bd) { bd = d; best = i; } });
    if (bd < 40) pluckAt(best, p.x, p.y < baseY(best) ? -1 : 1, 9);
    pointer = p; last = { ...p };
  });

  const sbtn = document.getElementById("sound-btn");
  if (sbtn) sbtn.addEventListener("click", () => {
    sound = !sound; sbtn.setAttribute("aria-pressed", sound);
    sbtn.textContent = sound ? "Strings: sound on" : "Strings: sound off";
    if (sound) play(2, W / 2);
  });

  resize();
  window.addEventListener("resize", resize);
  if (reduce) { draw(); return; }
  // an opening strum so the strings are visibly alive on load
  setTimeout(() => STR.forEach((_, i) => setTimeout(() => pluckAt(i, W * (0.62 + i * 0.04), 1, 7), i * 90)), 700);
  requestAnimationFrame(loop);
})();
