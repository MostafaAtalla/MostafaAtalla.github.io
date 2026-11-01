/* Hero: the defense clip plays full width behind the quote; six coloured
   strings run across the bottom. Sweeping the pointer across a string plucks
   it: the string vibrates (1-D wave equation), music notes rise from the
   crossing point, and with sound on it plays a quiet tone
   (a soft, bowed violin-like voice with reverb). */
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

  function noVideo() {
    media.innerHTML = "";
    media.classList.add("fallback");
    if (hearBtn) hearBtn.hidden = true;
    hero.insertAdjacentHTML("beforeend", '<span class="sample hero-sample">Add your defense clip: assets/video/hero-loop.mp4 or a YouTube ID</span>');
  }
  function youtube() {
    const id = encodeURIComponent(String(D.heroYoutubeId).trim());
    const start = D.heroStart ? `&start=${parseInt(D.heroStart, 10)}` : "", end = D.heroEnd ? `&end=${parseInt(D.heroEnd, 10)}` : "";
    media.classList.remove("fallback");
    media.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&disablekb=1&modestbranding=1&playsinline=1&rel=0${start}${end}" title="Defense clip" allow="autoplay; encrypted-media" tabindex="-1" aria-hidden="true"></iframe>`;
    video = null;
    if (hearBtn) { hearBtn.hidden = false; hearBtn.textContent = "Watch with sound"; hearBtn.onclick = () => document.getElementById("overture").scrollIntoView(); }
  }
  // An mp4 that fails to load falls through to YouTube, then to the colour background.
  const fail = () => (D.heroYoutubeId ? youtube() : noVideo());
  if (D.heroVideo) {
    video = document.createElement("video");
    video.muted = true; video.loop = true; video.playsInline = true;
    video.setAttribute("playsinline", ""); video.setAttribute("muted", "");
    video.preload = "auto";
    if (D.heroPoster) video.poster = D.heroPoster;
    if (!reduce) video.autoplay = true;
    const src = document.createElement("source");
    src.src = D.heroVideo; src.type = "video/mp4";
    src.addEventListener("error", fail);
    video.appendChild(src);
    media.appendChild(video);
    if (!reduce) video.play().catch(() => {});
  } else if (D.heroYoutubeId) {
    youtube();
  } else {
    noVideo();
  }

  if (video && hearBtn) {
    hearBtn.addEventListener("click", () => {
      if (!video) return;
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
  // top to bottom: E5 D5 B4 A4 F#4 D4, D major pentatonic, so any sweep sounds consonant
  const STR = [
    { f: 659.25, color: "#FFC94D", w: 1.0 },
    { f: 587.33, color: "#FF8A65", w: 1.2 },
    { f: 493.88, color: "#F48FA8", w: 1.4 },
    { f: 440.0, color: "#B79CE0", w: 1.6 },
    { f: 369.99, color: "#7FB2F0", w: 1.9 },
    { f: 293.66, color: "#5ED1C8", w: 2.2 }
  ];
  const N = 160, GLYPHS = ["♪", "♫", "♩", "♬", "♪", "♫"];
  let W = 0, H = 0, strings = [], notes = [], pointer = null, last = null, sound = false;
  let audio = null, bus = null, voices = 0;

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
    if (sound && now - (s.lastTone || 0) > 260) { s.lastTone = now; play(li, x); }
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

  /* Soft bowed-string voice: two detuned sawtooth oscillators through a gentle
     low-pass (the "body"), a slow bow attack, delayed vibrato and a long reverb. */
  function initAudio() {
    audio = new (window.AudioContext || window.webkitAudioContext)();
    const sr = audio.sampleRate, len = Math.floor(sr * 3.2), ir = audio.createBuffer(2, len, sr);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
    const verb = audio.createConvolver(); verb.buffer = ir;
    const wet = audio.createGain(); wet.gain.value = 0.55;
    const dry = audio.createGain(); dry.gain.value = 0.5;
    const comp = audio.createDynamicsCompressor(); comp.threshold.value = -24; comp.ratio.value = 4;
    const master = audio.createGain(); master.gain.value = 0.7;
    bus = audio.createGain();
    bus.connect(dry); bus.connect(verb); verb.connect(wet);
    dry.connect(comp); wet.connect(comp); comp.connect(master); master.connect(audio.destination);
  }
  function play(li, x) {
    try {
      if (!audio) initAudio();
      if (audio.state === "suspended") audio.resume();
      if (voices >= 5) return;
      voices++;
      const f = STR[li].f, t = audio.currentTime, dur = 2.8;
      const o1 = audio.createOscillator(), o2 = audio.createOscillator(), o3 = audio.createOscillator();
      o1.type = "sawtooth"; o2.type = "sawtooth"; o3.type = "sine";
      o1.frequency.value = f; o2.frequency.value = f * 1.0035; o3.frequency.value = f;
      const vib = audio.createOscillator(), vibAmt = audio.createGain();
      vib.frequency.value = 5.2; vibAmt.gain.setValueAtTime(0, t); vibAmt.gain.linearRampToValueAtTime(f * 0.005, t + 0.6);
      vib.connect(vibAmt); vibAmt.connect(o1.frequency); vibAmt.connect(o2.frequency); vibAmt.connect(o3.frequency);
      const mixSaw = audio.createGain(); mixSaw.gain.value = 0.35;
      const mixSine = audio.createGain(); mixSine.gain.value = 0.6;
      const lp = audio.createBiquadFilter(); lp.type = "lowpass"; lp.Q.value = 0.6;
      lp.frequency.setValueAtTime(700, t); lp.frequency.linearRampToValueAtTime(1900, t + 0.45); lp.frequency.exponentialRampToValueAtTime(900, t + dur);
      const body = audio.createBiquadFilter(); body.type = "peaking"; body.frequency.value = 2800; body.Q.value = 1.2; body.gain.value = -6;
      const env = audio.createGain();
      env.gain.setValueAtTime(0.0001, t);
      env.gain.exponentialRampToValueAtTime(0.09, t + 0.35);
      env.gain.setValueAtTime(0.09, t + 0.7);
      env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o1.connect(mixSaw); o2.connect(mixSaw); o3.connect(mixSine);
      mixSaw.connect(lp); mixSine.connect(lp); lp.connect(body); body.connect(env);
      let out = env;
      if (audio.createStereoPanner) { const pan = audio.createStereoPanner(); pan.pan.value = (x / W) * 1.2 - 0.6; env.connect(pan); out = pan; }
      out.connect(bus);
      [o1, o2, o3, vib].forEach((o) => { o.start(t); o.stop(t + dur + 0.05); });
      o1.onended = () => { voices = Math.max(0, voices - 1); };
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
