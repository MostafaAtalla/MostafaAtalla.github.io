/* Lab core: the shared frame for the Lab games.
   - builds the game stage (mode switch, canvas, controls, side panel with papers)
   - intro / debrief cards, best scores (per visitor, in this browser only)
   - anonymous result logging through GoatCounter events: game, mode, level, score and
     settings, no identifier (exportable as CSV from the GoatCounter dashboard). */
(function () {
  const S = window.SITE, LAB = S.lab, $ = (q, r = document) => r.querySelector(q);
  if (!LAB || !$("#lab-games")) return;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const W = 960, H = 540;
  window.LabGames = window.LabGames || {};

  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem("lab:" + k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem("lab:" + k, JSON.stringify(v)); } catch (e) {} }
  };
  // anonymous result log: one GoatCounter event per finished attempt
  const log = (game, mode, level, data) => {
    const title = Object.entries(data).map(([k, v]) => `${k}=${typeof v === "number" ? Math.round(v * 100) / 100 : v}`).join(";");
    const send = () => window.goatcounter && window.goatcounter.count && window.goatcounter.count({ path: `lab/${game}/${mode}/${level}`, title, event: true });
    if (window.goatcounter && window.goatcounter.count) send(); else setTimeout(send, 2500);
  };
  const fnHTML = (g) => `<span class="lp-k">Modelled vs illustrative</span><p class="fn-h">Modelled physics</p><ul class="fn-l">${(g.model || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul><p class="fn-h">Illustrative only</p><ul class="fn-l il">${(g.illus || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
  const fnShort = (g) => `<details class="lg-fn" onclick="event.stopPropagation()"><summary>What's modelled, what's illustrative</summary><p><b>Modelled:</b> ${esc((g.model || []).join("; "))}.</p><p><b>Illustrative:</b> ${esc((g.illus || []).join("; "))}.</p></details>`;
  window.LabFootnote = fnShort;
  const cite = (i) => { const p = S.publications[i]; if (!p) return ""; const v = (p.venue || "").split(",")[0].replace(/^Proceedings of /, ""); const href = p.doi ? (p.doi.startsWith("http") ? p.doi : "https://doi.org/" + p.doi) : p.url || "publications.html";
    return `<li><a href="${esc(href)}" target="_blank" rel="noopener">${esc(p.title)}</a><span>${esc(v)}, ${p.year}</span></li>`; };

  // ---------- the game cards at the top of the page ----------
  $("#lab-games").innerHTML = LAB.games.map((g) => `<a class="lg-card${g.status === "live" ? " live" : ""}${g.kind === "tutorial" ? " tut" : ""}" href="#${g.id}" data-g="${g.id}">
      <div class="lp-stage"><canvas class="lp-canvas" data-game="${g.id}" aria-hidden="true"></canvas><span class="lp-state"></span><button class="lp-toggle" type="button" data-for="${g.id}">⇄ Switch</button></div>
      <div class="lg-body"><span class="lp-k">${esc(g.tag || "Game " + g.n)} · ${esc(g.verb)}</span><h3>${esc(g.title)}</h3><p>${esc(g.hook)}</p>
      ${fnShort(g)}<span class="lg-go">${g.status === "live" ? `▶ Play · ${esc(g.time)}` : "Preview · game in the workshop"}</span></div></a>`).join("");

  // ---------- the stage ----------
  const stage = $("#lab-stage");
  let current = null, cleanup = null;
  const open = (id, scroll) => {
    const g = LAB.games.find((x) => x.id === id) || LAB.games[0];
    if (cleanup) { cleanup(); cleanup = null; }
    current = g;
    document.querySelectorAll(".lg-card").forEach((c) => c.classList.toggle("sel", c.dataset.g === g.id));
    const best = store.get(g.id + ":best");
    stage.innerHTML = `
      <div class="ls-head">
        <div><span class="lp-k">${esc(g.tag || "Game " + g.n)} · ${esc(g.verb)}</span><h2 class="ls-title">${esc(g.title)}</h2></div>
        ${g.status === "live" ? `<div class="ls-modes" role="tablist" aria-label="Mode"><button role="tab" data-m="game" aria-selected="true">🎮 Game</button><button role="tab" data-m="explore" aria-selected="false">🔬 Explore</button></div>` : ""}
      </div>
      <div class="ls-grid">
        <div class="ls-main">
          <div class="ls-canvas-wrap"><canvas id="ls-canvas" aria-label="${esc(g.title)}"></canvas><div class="ls-hud" id="ls-hud"></div><div class="ls-card" id="ls-card" hidden></div></div>
          <div class="ls-controls" id="ls-controls"></div>
          <div class="ls-plot-wrap"><canvas id="ls-plot" aria-hidden="true"></canvas></div>
        </div>
        <aside class="ls-side">
          <div class="ls-box"><span class="lp-k">What you'll learn</span><p>${esc(g.learn)}</p>${best != null ? `<p class="ls-best">Your best: <b>${esc(best)}</b></p>` : ""}</div>
          <figure class="ls-fig"><img src="${esc(g.fig)}" alt="Figure from the paper" loading="lazy"><figcaption>${esc(g.figcap || "From the paper")}</figcaption></figure>
          <div class="ls-box"><span class="lp-k">The papers behind it</span><ul class="ls-papers">${g.papers.map(cite).join("")}</ul></div>
          <div class="ls-box ls-real">${fnHTML(g)}</div><div class="ls-box ls-real-extra" id="ls-real" hidden></div>
          <a class="ls-research" href="research.html">← The research behind the games</a>
        </aside>
      </div>`;
    const canvas = $("#ls-canvas"), plot = $("#ls-plot"), dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr; canvas.height = H * dpr; const ctx = canvas.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    plot.width = W * dpr; plot.height = 150 * dpr; const pctx = plot.getContext("2d"); pctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const api = {
      W, H, canvas, ctx, plot: pctx, PH: 150, controls: $("#ls-controls"), hud: $("#ls-hud"), real: $("#ls-real"),
      card(html, buttons) { const c = $("#ls-card"); c.innerHTML = `<div class="ls-card-in">${html}<div class="ls-card-btns">${buttons.map((b, i) => `<button class="btn${i ? " ghost" : ""}" data-i="${i}">${esc(b.label)}</button>`).join("")}</div></div>`; c.hidden = false;
        return new Promise((res) => c.querySelectorAll("button").forEach((btn) => btn.addEventListener("click", () => { c.hidden = true; res(+btn.dataset.i); }))); },
      hideCard() { $("#ls-card").hidden = true; },
      log: (mode, level, data) => log(g.id, mode, level, data),
      best(score, fmt) { const b = store.get(g.id + ":bestn"); if (b == null || score > b) { store.set(g.id + ":bestn", score); store.set(g.id + ":best", fmt || String(score)); return true; } return false; },
      colors() { const cs = getComputedStyle(document.documentElement), v = (n) => cs.getPropertyValue(n).trim(); return { ink: v("--ink"), ink2: v("--ink-2"), ink3: v("--ink-3"), card: v("--card"), paper: v("--paper"), rule: v("--rule"), coral: v("--acc-coral"), teal: v("--acc-teal"), gold: v("--acc-gold"), blue: v("--acc-blue"), dark: document.documentElement.dataset.theme === "dark" || (!document.documentElement.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches) }; }
    };
    const modes = stage.querySelectorAll(".ls-modes button");
    const start = (mode) => { if (cleanup) { cleanup(); cleanup = null; } api.controls.innerHTML = ""; api.hud.innerHTML = ""; api.hideCard();
      modes.forEach((b) => b.setAttribute("aria-selected", b.dataset.m === mode));
      const run = window.LabGames[g.id]; cleanup = run ? run(api, mode) : preview(api, g); };
    modes.forEach((b) => b.addEventListener("click", () => start(b.dataset.m)));
    start("game");
    if (scroll) stage.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  // a game not built yet: show its live preview large, and what is coming
  const preview = (api, g) => {
    const plans = { catheter: ["Navigate a vessel tree with a flexible catheter: push, pull and rotate the tip", "Feel friction build up in the bends, buckling and wall damage", "Deploy a stent or a heart valve, or remove a clot, while the heart beats", "Three runs: ultrasound off, always on, and switched by you"],
      oscar: ["Design the cam: sliders, retract share, jumps per revolution", "Watch thrust and ripple live, including the balancing that calms the 3-jump cam", "Race the capsule through the colon to the cecum against the clock"],
      ski: ["Time each stride with the ultrasound under your skis", "Race on sand, wet grass and asphalt, each with its measured friction reduction", "Explore mode: tune the phase between stride and ultrasound cycles"] }[g.id] || [];
    api.ctx.fillStyle = "transparent";
    api.card(`<span class="lp-k">In the workshop</span><h3>${esc(g.title)}</h3><p>${esc(g.hook)}</p><ul>${plans.map((p) => `<li>${esc(p)}</li>`).join("")}</ul><p class="muted">The full game is being built. Meanwhile, try the live preview in its card above.</p>`, [{ label: "Play Game 1 meanwhile" }]).then(() => open("glide", true));
    api.real.innerHTML = "";
    return () => {};
  };

  document.querySelectorAll(".lg-card").forEach((c) => c.addEventListener("click", (e) => { if (e.target.closest(".lp-toggle")) return; e.preventDefault(); history.replaceState(null, "", "#" + c.dataset.g); open(c.dataset.g, true); }));
  const fromHash = () => { const id = location.hash.slice(1); if (LAB.games.some((g) => g.id === id)) open(id, true); };
  window.addEventListener("hashchange", fromHash);
  open(LAB.games.some((g) => g.id === location.hash.slice(1)) ? location.hash.slice(1) : LAB.games[0].id, !!location.hash);
})();
