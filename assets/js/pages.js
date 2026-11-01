/* Page renderers: each page has <body data-page="…"> and empty mount points. */
(function () {
  const S = window.SITE, U = window.UI, { esc, coverSVG, ICON, copy, fmtDate } = U;
  const page = document.body.dataset.page;
  const $ = (sel, root = document) => root.querySelector(sel);
  const sample = (x) => (x && x.placeholder ? '<span class="sample">Sample</span>' : "");
  const pubById = Object.fromEntries(S.publications.map((p) => [p.id, p]));
  const meName = (s) => esc(s).replace(/M\. A\. Atalla/g, "<b>M. A. Atalla</b>");
  const TYPE_LABEL = { journal: "Journal", conference: "Conference", abstract: "Abstract", patent: "Patent" };

  function ytThumb(v, label) {
    return v.id
      ? `<img src="https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg" alt="" loading="lazy">`
      : coverSVG(v.title, { cls: "bg", label: "", alt: "" });
  }
  function bindYT(root) {
    root.querySelectorAll(".yt[data-id]").forEach((b) => b.addEventListener("click", () => {
      const id = b.dataset.id;
      if (!id) { U.toast("Add the YouTube ID for this video in assets/js/data.js"); return; }
      b.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${esc(id)}?autoplay=1&rel=0" title="${esc(b.dataset.title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    }));
  }
  function videoCard(v) {
    return `<div class="card">
      <button class="yt" data-id="${esc(v.id)}" data-title="${esc(v.title)}" aria-label="Play ${esc(v.title)}">${ytThumb(v)}<span class="play-disc">${ICON.play}</span></button>
      <div class="body"><div class="meta">${v.length ? `<span>${esc(v.length)}</span>` : ""}${sample(v)}</div><h3>${esc(v.title)}</h3></div></div>`;
  }
  function postHref(p) { return p.type === "essay" ? `post.html?p=${encodeURIComponent(p.slug)}` : (p.url || ""); }
  function postRow(p) {
    const href = postHref(p), ext = p.type !== "essay";
    const kind = { essay: "Essay", linkedin: "LinkedIn", press: p.source || "Press" }[p.type];
    const tagCls = p.type === "essay" ? "brass" : p.type === "linkedin" ? "tide" : "";
    const inner = `<span class="d">${fmtDate(p.date)}</span><div><h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p></div><span class="side">${sample(p)}<span class="tag ${tagCls}">${esc(kind)}${ext && href ? " ↗" : ""}</span></span>`;
    return href ? `<a class="post-row" href="${esc(href)}" ${ext ? 'target="_blank" rel="noopener"' : ""}>${inner}</a>` : `<div class="post-row">${inner}</div>`;
  }

  const glyph = {
    Glide: '<svg class="glyph" viewBox="0 0 240 64" fill="none" stroke="currentColor" aria-hidden="true"><path d="M10 50h220" stroke-width="1.4"/><path d="M10 44c6-3 12 3 18 0s12-3 18 0 12 3 18 0 12-3 18 0 12 3 18 0 12-3 18 0 12 3 18 0 12-3 18 0 12 3 18 0 12-3 18 0 12 3 18 0" stroke="var(--tide)" stroke-width="1.2"/><rect x="70" y="18" width="90" height="22" rx="4" stroke-width="1.4"/><path d="M168 29h40m-8-6 8 6-8 6" stroke="var(--m)" stroke-width="1.4"/></svg>',
    Grip: '<svg class="glyph" viewBox="0 0 240 64" fill="none" stroke="currentColor" aria-hidden="true"><path d="M10 50h220" stroke-width="1.4"/><rect x="70" y="20" width="90" height="26" rx="4" stroke-width="1.4"/><path d="M76 46v4M86 46v4M96 46v4M106 46v4M116 46v4M126 46v4M136 46v4M146 46v4M156 46v4" stroke="var(--m)" stroke-width="1.6"/><path d="M40 33h22M178 33h22" stroke-width="1.2" stroke-dasharray="3 3"/></svg>',
    Propel: '<svg class="glyph" viewBox="0 0 240 64" fill="none" stroke="currentColor" aria-hidden="true"><path d="M10 50h220" stroke-width="1.4"/><rect x="30" y="26" width="40" height="20" rx="4" stroke-width="1.2" opacity=".35"/><rect x="90" y="26" width="40" height="20" rx="4" stroke-width="1.2" opacity=".6"/><rect x="150" y="26" width="40" height="20" rx="4" stroke-width="1.6"/><path d="M60 18c20-10 40-10 60 0m0 0c20-10 40-10 60 0" stroke="var(--m)" stroke-width="1.3"/></svg>'
  };

  /* ================= HOME ================= */
  function home() {
    const d = S.defense;
    const vf = $("#defense");
    if (d.youtubeId) {
      vf.innerHTML = `<button class="yt" data-id="${esc(d.youtubeId)}" data-title="PhD defense" aria-label="Play defense clip" style="height:100%">${ytThumb({ id: d.youtubeId })}<span class="play-disc">${ICON.play}</span></button>`;
      bindYT(vf);
    } else {
      vf.innerHTML = `<video controls preload="metadata" playsinline ${d.poster ? `poster="${esc(d.poster)}"` : ""}><source src="${esc(d.mp4)}" type="video/mp4"></video>`;
      const v = $("video", vf);
      const fallback = () => { vf.innerHTML = `<div class="placeholder">${coverSVG("defense", { cls: "bg", alt: "" })}<div class="msg"><span class="play-disc">${ICON.play}</span><strong>Defense clip goes here</strong><span class="small" style="opacity:.75">Add a YouTube ID or <span class="mono">assets/video/defense-clip.mp4</span></span></div></div>`; };
      $("source", v).addEventListener("error", fallback); v.addEventListener("error", fallback);
    }
    $("#defense-cap").innerHTML = `<span>${esc(d.caption)}</span><span class="mono">${esc(S.quote.context)}</span>`;
    $("#bio").innerHTML = S.bio.map((p) => `<p>${esc(p)}</p>`).join("") + `<p class="now">${esc(S.now)}</p>`;

    const sup = S.mission.supervision.length;
    const stats = [
      { n: S.publications.filter((p) => p.type === "journal" || p.type === "conference").length, l: "journal and conference papers", href: "publications.html", c: "publications" },
      { n: S.publications.filter((p) => p.type === "patent").length, l: "granted patents", href: "publications.html#patent", c: "research" },
      { n: S.awards.filter((a) => /best|maurice/i.test(a.title)).length, l: "paper and presentation awards", href: "journey.html#awards", c: "journey" },
      { n: sup, l: "MSc theses supervised", href: "mission.html#orchestra", c: "mission" },
      { n: 6, l: "workshops organised", href: "mission.html#initiatives", c: "studio" }
    ];
    $("#glance").innerHTML = stats.map((s) => `<a href="${s.href}" style="--mc: var(--c-${s.c})"><span class="n">${s.n}</span><span class="l">${esc(s.l)}</span></a>`).join("");

    const blurbs = {
      research: "Friction as a design variable, and a lab where you can feel stick-slip turn into glide.",
      publications: "Every paper, abstract and patent, searchable, with one-click citations.",
      journey: "From Cairo to Massachusetts to Delft and Twente, with the awards along the way.",
      mission: "Opening doors for junior researchers, and the initiatives behind it.",
      writing: "Essays, LinkedIn pieces and press about the work.",
      studio: "YouTube sessions on figures that speak science, talks and robots in motion.",
      gallery: "Academic trips and photos with science heroes."
    };
    $("#movements").innerHTML = U.NAV.slice(1).map((n, i) => `<a class="movement" href="${n.href}" style="--mc: var(--c-${n.id})"><span class="roman">${U.ROMAN[i + 1]}.</span><h3>${n.label}</h3><p>${esc(blurbs[n.id])}</p></a>`).join("");

    $("#home-writing").innerHTML = S.posts.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3).map(postRow).join("");
    $("#home-studio").innerHTML = S.series[0].videos.slice(0, 3).map(videoCard).join("");
    bindYT($("#home-studio"));
  }

  /* ================= RESEARCH ================= */
  function research() {
    $("#themes").innerHTML = S.themes.map((t) => `<div class="theme">
      <span class="verb">${esc(t.verb)}</span>${glyph[t.verb] || ""}<h3>${esc(t.title)}</h3><p>${esc(t.text)}</p>
      <ul>${t.pubs.map((id) => pubById[id]).filter(Boolean).map((p) => `<li><a href="publications.html#${p.id}"><span class="mono" style="color:var(--m)">${p.id}</span> ${esc(p.title)}</a></li>`).join("")}</ul></div>`).join("");
  }

  /* ================= PUBLICATIONS ================= */
  function publications() {
    const state = { type: "all", q: "" };
    const types = ["all", "journal", "conference", "abstract", "patent"];
    const count = (t) => t === "all" ? S.publications.length : S.publications.filter((p) => p.type === t).length;
    const chips = $("#pub-chips");
    chips.innerHTML = types.map((t) => `<button class="chip" data-t="${t}" aria-pressed="${t === "all"}">${t === "all" ? "All" : TYPE_LABEL[t]}<span class="count">${count(t)}</span></button>`).join("");
    chips.addEventListener("click", (e) => { const b = e.target.closest(".chip"); if (!b) return; state.type = b.dataset.t; chips.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c === b)); render(); });
    $("#pub-q").addEventListener("input", (e) => { state.q = e.target.value.toLowerCase(); render(); });
    const cite = (p) => `${p.authors}, "${p.title}," ${p.venue}, ${p.year}.${p.doi ? " doi:" + p.doi : ""}`;

    function render() {
      const list = S.publications.filter((p) => (state.type === "all" || p.type === state.type) && (!state.q || (p.title + p.authors + p.venue + p.year).toLowerCase().includes(state.q)));
      const years = [...new Set(list.map((p) => p.year))].sort((a, b) => b - a);
      $("#pubs").innerHTML = list.length ? years.map((y) => `<div class="pub-year"><h3>${y}</h3><div class="pub-list">${list.filter((p) => p.year === y).map((p) => `
        <article class="pub" id="${p.id}"><span class="code">${p.id}</span><div>
          <h4 class="title">${esc(p.title)}</h4>
          <p class="authors">${meName(p.authors)}</p>
          <p class="venue">${esc(p.venue)}</p>
          <div class="actions"><span class="tag">${TYPE_LABEL[p.type]}</span>${p.status ? `<span class="tag tide">${esc(p.status)}</span>` : ""}${p.award ? `<span class="tag brass">★ ${esc(p.award)}</span>` : ""}
          ${p.doi ? `<a href="https://doi.org/${esc(p.doi)}" target="_blank" rel="noopener">DOI ↗</a>` : ""}${p.url ? `<a href="${esc(p.url)}" target="_blank" rel="noopener">View ↗</a>` : ""}
          <button type="button" data-cite="${p.id}">Copy citation</button></div></div></article>`).join("")}</div></div>`).join("") : `<p class="pub-empty">No publications match “${esc(state.q)}”.</p>`;
    }
    $("#pubs").addEventListener("click", (e) => { const b = e.target.closest("[data-cite]"); if (b) copy(cite(pubById[b.dataset.cite]), "Citation copied"); });
    const h = location.hash.slice(1);
    if (types.includes(h)) { state.type = h; chips.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c.dataset.t === h)); }
    render();
    if (pubById[h]) { const el = document.getElementById(h); el?.scrollIntoView({ block: "center" }); el && (el.style.background = "var(--brass-soft)"); }
  }

  /* ================= JOURNEY ================= */
  function journey() {
    const route = $("#route");
    route.innerHTML = S.stations.map((s, i) => `${i ? '<span class="leg" aria-hidden="true"></span>' : ""}<button class="station" data-city="${s.id}" aria-pressed="false"><span class="dot"></span><span class="city">${esc(s.city)}</span><span class="yrs">${esc(s.years)}</span></button>`).join("");
    $("#timeline").innerHTML = S.timeline.map((t) => `<div class="tl-item" data-kind="${t.kind}" data-city="${t.city}"><span class="when">${esc(t.when)}</span><span class="rail"></span><div><h3>${esc(t.title)}</h3><p class="org">${esc(t.org)}</p>${t.text ? `<p>${esc(t.text)}</p>` : ""}</div></div>`).join("");
    let active = null;
    route.addEventListener("click", (e) => {
      const b = e.target.closest(".station"); if (!b) return;
      active = active === b.dataset.city ? null : b.dataset.city;
      route.querySelectorAll(".station").forEach((s) => s.setAttribute("aria-pressed", s.dataset.city === active));
      document.querySelectorAll(".tl-item").forEach((it) => it.classList.toggle("dim", !!active && it.dataset.city !== active));
    });
    $("#awards").innerHTML = S.awards.map((a) => `<div class="award"><span class="y">${a.year}</span><div><h3>${esc(a.title)}</h3><p>${esc(a.org)}</p></div></div>`).join("");
    $("#talks").innerHTML = S.talks.map((t) => `<li><span class="y">${t.year}</span><div>${esc(t.title)}<div class="sub">${esc(t.kind)} · ${esc(t.venue)}</div></div></li>`).join("");
    $("#teaching").innerHTML = S.teaching.map((t) => `<li><span class="y">${esc(t.year)}</span><div>${esc(t.title)}<div class="sub">${esc(t.sub)}</div></div></li>`).join("");
    $("#service").innerHTML = S.service.map((t) => `<li><span class="y">—</span><div>${esc(t)}</div></li>`).join("");
    $("#cv-link").href = S.person.cv;
  }

  /* ================= MISSION ================= */
  function mission() {
    const M = S.mission;
    $("#manifesto").innerHTML = M.statement;
    $("#story").textContent = M.story;
    $("#pillars").innerHTML = M.pillars.map((p) => `<div class="pillar"><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></div>`).join("");
    $("#initiatives").innerHTML = M.initiatives.map((i) => `<div class="initiative"><span class="y">${esc(i.when)}</span><div><h3>${esc(i.title)} ${sample(i)}</h3><p>${esc(i.text)}</p><div class="tags">${i.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div></div></div>`).join("");

    // Orchestra: supervised students as seats in a semicircle
    const st = M.supervision, withPaper = st.filter((s) => s.paper.length).length;
    $("#orchestra-stat").textContent = `${withPaper} of ${st.length} supervised MSc theses led to co-authored publications.`;
    const W = 600, H = 300, cx = W / 2, cy = H - 30;
    const seats = st.map((s, i) => { const row = i % 2, a = Math.PI * (0.12 + 0.76 * (i / (st.length - 1))), R = row ? 175 : 230; return { s, x: cx - R * Math.cos(a), y: cy - R * Math.sin(a) }; });
    $("#orchestra-svg").innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="group" aria-label="Supervised students">
      <path d="M ${cx - 250} ${cy} A 250 250 0 0 1 ${cx + 250} ${cy}" fill="none" stroke="var(--rule)"/>
      <path d="M ${cx - 150} ${cy} A 150 150 0 0 1 ${cx + 150} ${cy}" fill="none" stroke="var(--rule)"/>
      <g transform="translate(${cx} ${cy - 22})"><rect x="-26" y="-6" width="52" height="28" rx="3" fill="var(--paper-2)" stroke="var(--ink-3)"/><text y="44" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--ink-2)">PODIUM</text></g>
      ${seats.map((p, i) => `<g class="seat" data-i="${i}" tabindex="0" role="button" aria-label="${esc(p.s.name)}"><circle cx="${p.x}" cy="${p.y}" r="${p.s.paper.length ? 15 : 11}" fill="${p.s.paper.length ? "var(--tide)" : "var(--paper-2)"}" stroke="var(--ink-3)"/><text x="${p.x}" y="${p.y + 32}" text-anchor="middle" font-family="Instrument Sans, sans-serif" font-size="12" fill="var(--ink-2)">${esc(p.s.name.split(" ")[0])}</text></g>`).join("")}
    </svg>`;
    const detail = $("#orchestra-detail");
    const show = (i) => {
      const s = st[i];
      document.querySelectorAll(".seat").forEach((g) => g.classList.toggle("active", +g.dataset.i === i));
      detail.innerHTML = `<span class="eyebrow">MSc thesis · ${s.year}</span><h3 style="margin-top:8px">${esc(s.name)}: ${esc(s.thesis)}</h3><p>Co-supervised with ${esc(s.co)}.${s.paper.length ? ` Led to ${s.paper.map((id) => `<a href="publications.html#${id}">${id}</a>`).join(", ")}.` : ""}</p>`;
    };
    $("#orchestra-svg").addEventListener("click", (e) => { const g = e.target.closest(".seat"); if (g) show(+g.dataset.i); });
    $("#orchestra-svg").addEventListener("keydown", (e) => { const g = e.target.closest(".seat"); if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); show(+g.dataset.i); } });
    show(st.findIndex((s) => s.paper.length > 2));

    // Opportunity compass
    let stage = "all";
    const chips = $("#compass-chips");
    chips.innerHTML = ["all", "MSc", "PhD", "Postdoc"].map((s) => `<button class="chip" data-s="${s}" aria-pressed="${s === "all"}">${s === "all" ? "Every stage" : s}</button>`).join("");
    const render = () => {
      $("#compass").innerHTML = M.opportunities.filter((o) => stage === "all" || o.stage.includes(stage)).map((o) => `<div class="opp"><div><h3>${esc(o.name)}</h3><p>${esc(o.text)}</p><div class="tags"><span class="tag brass">${esc(o.kind)}</span>${o.stage.map((s) => `<span class="tag">${s}</span>`).join("")}</div></div><a class="btn ghost" href="${esc(o.url)}" target="_blank" rel="noopener">Official page ↗</a></div>`).join("");
    };
    chips.addEventListener("click", (e) => { const b = e.target.closest(".chip"); if (!b) return; stage = b.dataset.s; chips.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c === b)); render(); });
    render();
  }

  /* ================= WRITING ================= */
  function writing() {
    const tabs = $("#tabs"), list = $("#posts");
    const kinds = [["all", "All"], ["essay", "Essays"], ["linkedin", "LinkedIn"], ["press", "In the press"]];
    tabs.innerHTML = kinds.map(([k, l], i) => `<button class="tab" role="tab" data-k="${k}" aria-selected="${i === 0}">${l}</button>`).join("");
    const render = (k) => {
      const ps = S.posts.filter((p) => k === "all" || p.type === k).sort((a, b) => b.date.localeCompare(a.date));
      list.innerHTML = ps.length ? ps.map(postRow).join("") : `<p class="muted" style="padding:24px 0">Nothing here yet.</p>`;
    };
    tabs.addEventListener("click", (e) => { const b = e.target.closest(".tab"); if (!b) return; tabs.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-selected", t === b)); render(b.dataset.k); });
    render("all");
  }

  /* Minimal markdown: headings, paragraphs, lists, quotes, code, images, links, emphasis. */
  function md(src) {
    const inline = (s) => s.split(/(`[^`]+`)/).map((part) => /^`[^`]+`$/.test(part) ? `<code>${esc(part.slice(1, -1))}</code>` : fmt(part)).join("");
    const fmt = (s) => esc(s)
      .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1" loading="lazy">')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
    const out = []; const lines = src.replace(/\r/g, "").split("\n"); let i = 0;
    while (i < lines.length) {
      const l = lines[i];
      if (/^```/.test(l)) { const buf = []; i++; while (i < lines.length && !/^```/.test(lines[i])) buf.push(esc(lines[i++])); i++; out.push(`<pre><code>${buf.join("\n")}</code></pre>`); continue; }
      const h = l.match(/^(#{1,3})\s+(.*)/); if (h) { const n = Math.min(h[1].length + 1, 3); out.push(`<h${n}>${inline(h[2])}</h${n}>`); i++; continue; }
      if (/^>\s?/.test(l)) { const buf = []; while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, "")); out.push(`<blockquote>${inline(buf.join(" "))}</blockquote>`); continue; }
      if (/^\s*[-*]\s+/.test(l)) { const buf = []; while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) buf.push(`<li>${inline(lines[i++].replace(/^\s*[-*]\s+/, ""))}</li>`); out.push(`<ul>${buf.join("")}</ul>`); continue; }
      if (/^\s*\d+\.\s+/.test(l)) { const buf = []; while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) buf.push(`<li>${inline(lines[i++].replace(/^\s*\d+\.\s+/, ""))}</li>`); out.push(`<ol>${buf.join("")}</ol>`); continue; }
      if (!l.trim()) { i++; continue; }
      const buf = []; while (i < lines.length && lines[i].trim() && !/^(#|>|```|\s*[-*]\s|\s*\d+\.\s)/.test(lines[i])) buf.push(lines[i++]);
      out.push(`<p>${inline(buf.join(" "))}</p>`);
    }
    return out.join("\n");
  }
  async function post() {
    const slug = new URLSearchParams(location.search).get("p");
    const meta = S.posts.find((p) => p.slug === slug && p.type === "essay");
    const art = $("#article");
    if (!meta) { art.innerHTML = `<a class="back" href="writing.html">← All writing</a><h1>Essay not found</h1><p class="muted" style="margin-top:16px">Check the link, or browse all writing.</p>`; return; }
    document.title = `${meta.title} · ${S.person.name}`;
    art.innerHTML = `<a class="back" href="writing.html">← All writing</a><span class="eyebrow" style="display:flex;margin-top:28px">Essay</span><h1>${esc(meta.title)}</h1><div class="byline"><span>${esc(S.person.name)}</span><span>${fmtDate(meta.date)}</span>${sample(meta)}</div><div class="content" id="content"><p class="muted">Loading…</p></div>`;
    try {
      const r = await fetch(`posts/${encodeURIComponent(slug)}.md`, { cache: "no-cache" });
      if (!r.ok) throw new Error(r.status);
      const text = (await r.text()).replace(/^---[\s\S]*?---\s*/, "");
      $("#content").innerHTML = md(text);
      const words = text.split(/\s+/).length;
      $(".byline", art).insertAdjacentHTML("beforeend", `<span>${Math.max(1, Math.round(words / 220))} min read</span>`);
    } catch {
      $("#content").innerHTML = `<p class="muted">This essay could not be loaded. If you opened the file directly from your computer, run a local server instead (see README).</p>`;
    }
  }

  /* ================= STUDIO ================= */
  function studio() {
    $("#series").innerHTML = S.series.map((s) => `<div class="series"><div><h3>${esc(s.name)}</h3><p>${esc(s.text)}</p></div><div class="grid c2" style="grid-template-columns:repeat(auto-fill,minmax(min(100%,240px),1fr))">${s.videos.map(videoCard).join("")}</div></div>`).join("");
    bindYT($("#series"));
    const yt = S.person.links.youtube;
    if (yt) { const a = $("#yt-channel"); a.href = yt; a.hidden = false; }
  }

  /* ================= GALLERY ================= */
  function gallery() {
    let kind = "trips";
    const tabs = $("#tabs"), grid = $("#albums"), view = $("#album-view");
    tabs.innerHTML = [["trips", "Academic trips"], ["heroes", "Science heroes"]].map(([k, l], i) => `<button class="tab" role="tab" data-k="${k}" aria-selected="${i === 0}">${l}</button>`).join("");
    const photoArt = (p, a, i) => p.src ? `<img src="${esc(p.src)}" alt="${esc(p.caption || a.title)}" loading="lazy">` : coverSVG(a.id + i, { w: 600, h: 400 + (i % 3) * 80, alt: p.caption || "Photo placeholder" });
    function photosOf(a) {
      if (a.photos.length) return a.photos;
      return Array.from({ length: 5 }, (_, i) => ({ src: "", caption: `Add photos to assets/photos/${a.id}/`, placeholder: true }));
    }
    function renderGrid() {
      grid.innerHTML = S.albums.filter((a) => a.kind === kind).map((a) => {
        const first = a.photos.find((p) => p.src);
        const cover = first ? `<img src="${esc(first.src)}" alt="" loading="lazy">` : coverSVG(a.id, { w: 640, h: 480, label: a.place || a.title, sub: a.year ? String(a.year) : "", labelSize: 34, alt: "" });
        return `<a class="card album" href="#${a.id}"><div class="cover">${cover}<span class="count">${a.photos.filter((p) => p.src).length} photos</span></div><div class="body"><div class="meta"><span>${esc(a.year)}</span>${!a.photos.some((p) => p.src) ? '<span class="sample">Add photos</span>' : ""}</div><h3>${esc(a.title)}</h3>${a.kind === "heroes" ? `<p>${esc(a.place)}</p>` : ""}</div></a>`;
      }).join("");
    }
    function openAlbum(id) {
      const a = S.albums.find((x) => x.id === id);
      if (!a) { view.hidden = true; grid.hidden = false; tabs.hidden = false; return; }
      kind = a.kind;
      const ps = photosOf(a);
      grid.hidden = true; tabs.hidden = true; view.hidden = false;
      view.innerHTML = `<div class="head"><div><a class="link-arrow" href="#" style="display:inline-block;margin-bottom:10px" id="back">← All albums</a><h2>${esc(a.title)}</h2><p class="muted">${esc([a.place, a.year].filter(Boolean).join(" · "))}</p></div></div>
        <div class="photo-grid">${ps.map((p, i) => `<button data-i="${i}" aria-label="Open photo ${i + 1}">${photoArt(p, a, i)}${p.caption ? `<figcaption>${esc(p.caption)}</figcaption>` : ""}</button>`).join("")}</div>`;
      $("#back").addEventListener("click", (e) => { e.preventDefault(); history.pushState(null, "", location.pathname); openAlbum(null); renderGrid(); syncTabs(); });
      view.querySelector(".photo-grid").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) lightbox(a, ps, +b.dataset.i); });
      window.scrollTo({ top: view.offsetTop - 90 });
    }
    function lightbox(a, ps, i) {
      const lb = document.createElement("div");
      lb.className = "lightbox"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.setAttribute("aria-label", a.title);
      document.body.appendChild(lb); document.body.style.overflow = "hidden";
      const paint = () => {
        const p = ps[i];
        lb.innerHTML = `<div class="stage">${photoArt(p, a, i)}</div><div class="bar"><p class="cap"><span class="n">${i + 1} / ${ps.length}</span>${esc(p.caption || "")}</p><div class="ctrl"><button data-a="prev" aria-label="Previous">${ICON.left}</button><button data-a="next" aria-label="Next">${ICON.right}</button><button data-a="close" aria-label="Close">${ICON.close}</button></div></div>`;
      };
      const go = (d) => { i = (i + d + ps.length) % ps.length; paint(); };
      const close = () => { lb.remove(); document.body.style.overflow = ""; document.removeEventListener("keydown", key); };
      const key = (e) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); if (e.key === "Escape") close(); };
      lb.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) ({ prev: () => go(-1), next: () => go(1), close })[b.dataset.a](); else if (e.target === lb || e.target.classList.contains("stage")) close(); });
      let x0 = null;
      lb.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
      lb.addEventListener("touchend", (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); x0 = null; });
      document.addEventListener("keydown", key);
      paint();
    }
    const syncTabs = () => tabs.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-selected", t.dataset.k === kind));
    tabs.addEventListener("click", (e) => { const b = e.target.closest(".tab"); if (!b) return; kind = b.dataset.k; syncTabs(); renderGrid(); });
    window.addEventListener("hashchange", () => { openAlbum(location.hash.slice(1)); if (!location.hash) { renderGrid(); syncTabs(); } });
    renderGrid();
    if (location.hash) { openAlbum(location.hash.slice(1)); syncTabs(); }
  }

  ({ home, research, publications, journey, mission, writing, post, studio, gallery }[page] || (() => {}))();
})();
