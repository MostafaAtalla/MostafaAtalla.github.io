/* Lab kit: drawing helpers for the illustrated characters (the style of the defense slides:
   ink outlines, round heads, orange accents) and a tiny Web Audio synth. */
(function () {
  const TAU = Math.PI * 2;
  const K = {};
  K.rr = (c, x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
  K.text = (c, s, x, y, font, col, align) => { c.font = font; c.fillStyle = col; c.textAlign = align || "left"; c.fillText(s, x, y); c.textAlign = "left"; };
  K.wrap = (c, s, x, y, maxW, lh, font, col, align) => { c.font = font; c.fillStyle = col; c.textAlign = align || "left"; const words = s.split(" "); let line = ""; for (const w of words) { const t = line ? line + " " + w : w; if (c.measureText(t).width > maxW && line) { c.fillText(line, x, y); y += lh; line = w; } else line = t; } c.fillText(line, x, y); c.textAlign = "left"; return y; };
  K.note = (c, x, y, s, col) => { c.fillStyle = col; c.strokeStyle = col; c.lineWidth = 2 * s; c.beginPath(); c.ellipse(x, y, 5 * s, 3.6 * s, -0.4, 0, TAU); c.fill(); c.beginPath(); c.moveTo(x + 4.6 * s, y - 1); c.lineTo(x + 4.6 * s, y - 18 * s); c.quadraticCurveTo(x + 10 * s, y - 14 * s, x + 11 * s, y - 9 * s); c.stroke(); };
  K.sparkle = (c, x, y, r, col) => { c.fillStyle = col; c.beginPath(); for (let k = 0; k < 8; k++) { const a = k * TAU / 8, rr = k % 2 ? r * 0.3 : r; c.lineTo(x + rr * Math.cos(a), y + rr * Math.sin(a)); } c.fill(); };
  K.scribble = (c, x, y, r, col, t) => { c.strokeStyle = col; c.lineWidth = 1.4; c.beginPath(); for (let k = 0; k < 60; k++) { const a = k * 0.55 + t * 3, rr = r * (0.5 + 0.5 * Math.sin(k * 1.7)); c.lineTo(x + rr * Math.cos(a), y + rr * 0.7 * Math.sin(a)); } c.stroke(); };

  /* a person in the slides' style. o: { s scale, shirt, pants, skin, glasses, bow, mood (-1..1), arms: [[ax,ay],[bx,by]] hand targets relative to shoulder, hair } */
  K.person = (c, x, y, o) => {
    const s = o.s || 1, ink = o.ink || "#1A1A1A", skin = o.skin || "#F3CDA8";
    c.save(); c.translate(x, y); c.scale(s, s); c.lineCap = "round"; c.lineJoin = "round";
    // legs
    c.strokeStyle = o.pants || ink; c.lineWidth = 7; c.beginPath(); c.moveTo(-6, 0); c.lineTo(-10 + (o.step || 0), 46); c.moveTo(6, 0); c.lineTo(10 - (o.step || 0), 46); c.stroke();
    c.fillStyle = ink; c.beginPath(); c.ellipse(-12 + (o.step || 0), 48, 8, 3.5, 0, 0, TAU); c.ellipse(12 - (o.step || 0), 48, 8, 3.5, 0, 0, TAU); c.fill();
    // torso
    c.fillStyle = o.shirt || "#222"; K.rr(c, -15, -52, 30, 56, 9); c.fill(); c.strokeStyle = ink; c.lineWidth = 1.6; c.stroke();
    if (o.tux) { c.fillStyle = "#fff"; c.beginPath(); c.moveTo(-5, -50); c.lineTo(5, -50); c.lineTo(0, -20); c.closePath(); c.fill(); }
    if (o.bow) { c.fillStyle = "#F28C28"; c.beginPath(); c.moveTo(0, -48); c.lineTo(-7, -52); c.lineTo(-7, -44); c.closePath(); c.moveTo(0, -48); c.lineTo(7, -52); c.lineTo(7, -44); c.closePath(); c.fill(); }
    // arms
    c.strokeStyle = o.sleeve || o.shirt || ink; c.lineWidth = 6;
    (o.arms || [[-22, 22], [22, 22]]).forEach(([ax, ay], i) => { const sx = i ? 12 : -12; c.beginPath(); c.moveTo(sx, -46); c.quadraticCurveTo(sx + ax * 0.6, -46 + ay * 0.2, sx + ax, -46 + ay); c.stroke(); c.fillStyle = skin; c.strokeStyle = ink; c.lineWidth = 1.4; c.beginPath(); c.arc(sx + ax, -46 + ay, 4, 0, TAU); c.fill(); c.stroke(); c.strokeStyle = o.sleeve || o.shirt || ink; c.lineWidth = 6; });
    // head
    c.fillStyle = skin; c.strokeStyle = ink; c.lineWidth = 2; c.beginPath(); c.arc(0, -70, 16, 0, TAU); c.fill(); c.stroke();
    if (o.hair === "spiky") { c.fillStyle = ink; c.beginPath(); c.moveTo(-15, -76); for (let k = 0; k <= 6; k++) c.lineTo(-15 + k * 5, -88 - (k % 2) * 6); c.lineTo(15, -76); c.quadraticCurveTo(0, -84, -15, -76); c.fill(); }
    if (o.hair === "bun") { c.fillStyle = ink; c.beginPath(); c.arc(0, -82, 13, Math.PI, 0); c.fill(); c.beginPath(); c.arc(0, -93, 6, 0, TAU); c.fill(); }
    if (o.cap) { c.fillStyle = o.cap; c.beginPath(); c.arc(0, -74, 16, Math.PI, 0); c.fill(); c.strokeStyle = ink; c.lineWidth = 1.4; c.stroke(); }
    const m = o.mood ?? 0.6;
    c.fillStyle = "rgba(235,120,110,.3)"; c.beginPath(); c.ellipse(-9, -65, 3.5, 2.2, 0, 0, TAU); c.ellipse(9, -65, 3.5, 2.2, 0, 0, TAU); c.fill(); // cheeks
    if (o.glasses) { c.fillStyle = ink; c.beginPath(); c.arc(-6, -72, 1.8, 0, TAU); c.arc(6, -72, 1.8, 0, TAU); c.fill(); c.strokeStyle = ink; c.lineWidth = 1.3; c.beginPath(); c.arc(-6, -72, 5, 0, TAU); c.moveTo(11, -72); c.arc(6, -72, 5, 0, TAU); c.moveTo(-1, -72); c.lineTo(1, -72); c.stroke(); } // clear round glasses
    else { c.fillStyle = ink; c.beginPath(); c.arc(-6, -72, 1.8, 0, TAU); c.arc(6, -72, 1.8, 0, TAU); c.fill(); if (m < -0.3) { c.lineWidth = 1.4; c.beginPath(); c.moveTo(-9, -78); c.lineTo(-3, -76); c.moveTo(9, -78); c.lineTo(3, -76); c.stroke(); } }
    c.strokeStyle = ink; c.lineWidth = 1.8; c.beginPath();
    if (m > 0.2) c.arc(0, -66, 6, 0.15 * Math.PI, 0.85 * Math.PI); else if (m < -0.2) c.arc(0, -58, 6, 1.2 * Math.PI, 1.8 * Math.PI); else { c.moveTo(-5, -63); c.lineTo(5, -63); }
    c.stroke();
    if (m > 0.75) { c.fillStyle = "#C0392B"; c.beginPath(); c.arc(0, -64, 3, 0, Math.PI); c.fill(); }
    c.restore();
  };

  /* audience member: seat + head with mood */
  K.fan = (c, x, y, mood, t, k) => {
    const bounce = mood > 0.5 ? Math.abs(Math.sin(t * 6 + k)) * 3 : 0;
    c.fillStyle = "#7FB8D4"; K.rr(c, x - 22, y - 10, 44, 34, 8); c.fill();
    c.fillStyle = "#5BA4C6"; c.fillRect(x - 16, y - 2 - bounce, 32, 24);
    const ink = "#1A1A1A"; c.fillStyle = ["#F3CDA8", "#E0B48C", "#C98E62", "#F6D9BC"][k % 4]; c.strokeStyle = ink; c.lineWidth = 1.8; c.beginPath(); c.arc(x, y - 22 - bounce, 15, 0, TAU); c.fill(); c.stroke();
    c.fillStyle = ink; c.beginPath(); c.arc(x - 5, y - 24 - bounce, 1.6, 0, TAU); c.arc(x + 5, y - 24 - bounce, 1.6, 0, TAU); c.fill();
    c.beginPath(); c.lineWidth = 1.6; if (mood > 0.2) c.arc(x, y - 21 - bounce, 6, 0.15 * Math.PI, 0.85 * Math.PI); else if (mood < -0.2) { c.arc(x, y - 12 - bounce, 6, 1.2 * Math.PI, 1.8 * Math.PI); c.moveTo(x - 8, y - 30 - bounce); c.lineTo(x - 3, y - 28 - bounce); c.moveTo(x + 8, y - 30 - bounce); c.lineTo(x + 3, y - 28 - bounce); } else { c.moveTo(x - 4, y - 16 - bounce); c.lineTo(x + 4, y - 16 - bounce); }
    c.stroke();
    if (mood < -0.4) K.scribble(c, x, y - 48, 9, "#555", t + k);
    if (mood > 0.6 && Math.sin(t * 3 + k) > 0.6) K.note(c, x + 14, y - 44 - bounce, 0.8, "#F28C28");
  };

  /* audio: one shared context, created on a user gesture */
  K.audio = {
    ctx: null, muted: false,
    get() { try { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); if (this.ctx.state === "suspended") this.ctx.resume(); } catch (e) { this.ctx = null; } return this.ctx; },
    pluck(freq, dur, type, vol) { // a short musical note
      const a = this.get(); if (!a || this.muted) return; const t = a.currentTime, o = a.createOscillator(), g = a.createGain(), f = a.createBiquadFilter();
      o.type = type || "triangle"; o.frequency.value = freq; f.type = "lowpass"; f.frequency.value = 2400;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol || 0.16, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0008, t + (dur || 0.5));
      o.connect(f); f.connect(g); g.connect(a.destination); o.start(t); o.stop(t + (dur || 0.5) + 0.05);
    },
    noise(dur, vol, freq) { const a = this.get(); if (!a || this.muted) return; const n = a.createBufferSource(), b = a.createBuffer(1, a.sampleRate * dur, a.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      n.buffer = b; const f = a.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = freq || 800; const g = a.createGain(); g.gain.value = vol || 0.1; n.connect(f); f.connect(g); g.connect(a.destination); n.start(); }
  };
  K.muteButton = (host) => { const b = document.createElement("button"); b.type = "button"; b.className = "btn ghost small-btn lab-mute"; const set = () => (b.textContent = K.audio.muted ? "🔇 Sound off" : "🔊 Sound on"); set(); b.addEventListener("click", () => { K.audio.muted = !K.audio.muted; set(); }); host.appendChild(b); return b; };
  window.LabKit = K;
})();
