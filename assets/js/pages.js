/* Page renderers: each page has <body data-page="…"> and empty mount points. */
(function () {
  const S = window.SITE, U = window.UI, { esc, coverSVG, ICON, copy, fmtDate } = U;
  const page = document.body.dataset.page;
  const $ = (sel, root = document) => root.querySelector(sel);
  const sample = (x) => (x && x.placeholder ? '<span class="sample">Sample</span>' : "");
  const pubById = Object.fromEntries(S.publications.map((p) => [p.id, p]));
  const meName = (s) => esc(s).replace(/M\. A\. Atalla/g, "<b>M. A. Atalla</b>");
  const TYPE_LABEL = { journal: "Journal", conference: "Conference", abstract: "Abstract", patent: "Patent", thesis: "Dissertation" };

  function ytThumb(v, label) {
    return v.id
      ? `<img src="https://i.ytimg.com/vi/${esc(v.id)}/maxresdefault.jpg" alt="" loading="lazy">`
      : coverSVG(v.title, { cls: "bg", label: "", alt: "" });
  }
  function bindYT(root) {
    root.querySelectorAll(".yt[data-id]").forEach((b) => b.addEventListener("click", () => {
      const id = b.dataset.id;
      if (!id) { U.toast("Add the YouTube ID for this video in assets/js/data.js"); return; }
      // swap the button for a plain frame: an iframe inside a <button> misbehaves on iPad Safari
      const f = document.createElement("div"); f.className = "yt yt-playing";
      f.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${esc(id)}?autoplay=1&rel=0&playsinline=1" title="${esc(b.dataset.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
      b.replaceWith(f);
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
    const kind = p.type === "essay" ? "Essay" : p.type === "press" ? (p.source || "Press") : p.cat === "perspective" ? "Perspective" : "News";
    const tagCls = p.type === "essay" ? "brass" : p.cat === "perspective" ? "brass" : p.type === "linkedin" ? "tide" : "";
    if (p.type === "linkedin") {
      return `<div class="post-row li-row"><span class="d">${fmtDate(p.date)}</span><div><h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p>
        <div class="li-actions"><button type="button" class="li-read" data-urn="${esc(p.urn)}" aria-expanded="false">Read here</button><a href="${esc(p.url)}" target="_blank" rel="noopener">On LinkedIn ↗</a></div>
        <div class="li-embed" hidden></div></div><span class="side"><span class="tag ${tagCls}">${kind}</span></span></div>`;
    }
    const inner = `<span class="d">${fmtDate(p.date)}</span><div><h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p></div><span class="side">${sample(p)}<span class="tag ${tagCls}">${esc(kind)}${ext && href ? " ↗" : ""}</span></span>`;
    return href ? `<a class="post-row" href="${esc(href)}" ${ext ? 'target="_blank" rel="noopener"' : ""}>${inner}</a>` : `<div class="post-row">${inner}</div>`;
  }
  // LinkedIn posts open inline as the official LinkedIn embed
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".li-read"); if (!b) return;
    const box = b.closest(".li-row").querySelector(".li-embed");
    const open = box.hidden;
    if (open && !box.firstChild) box.innerHTML = `<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:activity:${encodeURIComponent(b.dataset.urn)}" title="LinkedIn post" loading="lazy" allowfullscreen></iframe>`;
    box.hidden = !open; b.setAttribute("aria-expanded", String(open)); b.textContent = open ? "Close" : "Read here";
  });

  const glyph = {
    Glide: '<svg class="glyph" viewBox="0 0 240 64" fill="none" stroke="currentColor" aria-hidden="true"><path d="M10 50h220" stroke-width="1.4"/><path d="M10 44c6-3 12 3 18 0s12-3 18 0 12 3 18 0 12-3 18 0 12 3 18 0 12-3 18 0 12 3 18 0 12-3 18 0 12 3 18 0 12-3 18 0 12 3 18 0" stroke="var(--tide)" stroke-width="1.2"/><rect x="70" y="18" width="90" height="22" rx="4" stroke-width="1.4"/><path d="M168 29h40m-8-6 8 6-8 6" stroke="var(--m)" stroke-width="1.4"/></svg>',
    Grip: '<svg class="glyph" viewBox="0 0 240 64" fill="none" stroke="currentColor" aria-hidden="true"><path d="M10 50h220" stroke-width="1.4"/><rect x="70" y="20" width="90" height="26" rx="4" stroke-width="1.4"/><path d="M76 46v4M86 46v4M96 46v4M106 46v4M116 46v4M126 46v4M136 46v4M146 46v4M156 46v4" stroke="var(--m)" stroke-width="1.6"/><path d="M40 33h22M178 33h22" stroke-width="1.2" stroke-dasharray="3 3"/></svg>',
    Propel: '<svg class="glyph" viewBox="0 0 240 64" fill="none" stroke="currentColor" aria-hidden="true"><path d="M10 50h220" stroke-width="1.4"/><rect x="30" y="26" width="40" height="20" rx="4" stroke-width="1.2" opacity=".35"/><rect x="90" y="26" width="40" height="20" rx="4" stroke-width="1.2" opacity=".6"/><rect x="150" y="26" width="40" height="20" rx="4" stroke-width="1.6"/><path d="M60 18c20-10 40-10 60 0m0 0c20-10 40-10 60 0" stroke="var(--m)" stroke-width="1.3"/></svg>'
  };


  const photoArt = (p, a, i) => p.src ? `<img src="${esc(p.src)}" alt="${esc(p.caption || a.title)}" loading="lazy">` : coverSVG(a.id + i, { w: 600, h: 420, alt: p.caption || "Photo placeholder" });
  const NEWS_KIND = { paper: "Paper", award: "Award", talk: "Talk", workshop: "Workshop", community: "Community", press: "Press", career: "Career" };
  const ICONS = {
    paper: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/></svg>',
    award: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7"/></svg>',
    perspective: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/></svg>',
    news: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 5h13v14H6a2 2 0 0 1-2-2z"/><path d="M17 9h3v8a2 2 0 0 1-2 2M8 9h5M8 13h5"/></svg>',
    video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3z" fill="currentColor"/></svg>'
  };
  function liModal(p) {
    const m = document.createElement("div");
    m.className = "modal"; m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true"); m.setAttribute("aria-label", p.title);
    m.innerHTML = `<div class="modal-card"><button class="modal-x" aria-label="Close">${ICON.close}</button>
      <iframe src="https://www.linkedin.com/embed/feed/update/urn:li:activity:${encodeURIComponent(p.urn)}" title="LinkedIn post" loading="lazy" allowfullscreen></iframe>
      <p class="modal-foot"><a href="${esc(p.url)}" target="_blank" rel="noopener">Open on LinkedIn ↗</a></p></div>`;
    document.body.appendChild(m); document.body.style.overflow = "hidden";
    const close = () => { m.remove(); document.body.style.overflow = ""; document.removeEventListener("keydown", key); };
    const key = (e) => { if (e.key === "Escape") close(); };
    m.addEventListener("click", (e) => { if (e.target === m || e.target.closest(".modal-x")) close(); });
    document.addEventListener("keydown", key);
  }
  const postById = Object.fromEntries(S.posts.filter((p) => p.urn).map((p) => [p.urn, p]));
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-li]"); if (b) { e.preventDefault(); liModal(postById[b.dataset.li]); } });

  function statement() {
    const R = S.researchStatement;
    if ($("#rs-title")) { $("#rs-title").textContent = R.title; $("#rs-lead").textContent = R.lead; const body = [].concat(R.body), q = R.quote ? `<blockquote class="rs-quote"><p>${esc(R.quote)}</p>${R.quoteBy ? `<footer class="rs-cite"><span class="rs-by">— ${esc(R.quoteBy)}</span>${R.quoteSource ? `<span class="rs-src">${esc(R.quoteSource)}</span>` : ""}</footer>` : ""}</blockquote>` : "";
      if ($("#rs-more")) $("#rs-more").innerHTML = `<div class="rs-paras">${body.map((t) => `<p class="sec-body">${esc(t)}</p>`).join("")}</div>${q}`;
      else if ($("#rs-body")) { $("#rs-body").textContent = body[0]; $("#rs-body").insertAdjacentHTML("afterend", body.slice(1).map((t) => `<p class="sec-body">${esc(t)}</p>`).join("") + q); } }
    if ($("#rs-principles")) $("#rs-principles").innerHTML = R.principles.map((p) => `<li><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></li>`).join("");
  }
  function teachingBits() {
    const TP = S.teachingPhilosophy;
    if (TP && $("#tp-title")) { $("#tp-title").textContent = TP.title; $("#tp-lead").textContent = TP.lead; $("#tp-practices").innerHTML = TP.practices.map((p) => `<div class="practice"><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></div>`).join(""); }
    const T = S.teachingStatement;
    if ($("#ts-title")) $("#ts-title").textContent = T.title;
    if ($("#ts-lead")) $("#ts-lead").textContent = T.lead;
    if ($("#ts-practices")) $("#ts-practices").innerHTML = T.practices.map((p) => `<div class="practice"><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></div>`).join("");
  }
  function vm() {
    const V = S.vision, el = $("#vm"); if (!el) return;
    el.innerHTML = `
      <article class="vm"><span class="vm-k">Vision</span><h3 class="vm-short">${esc(V.researchShort)}</h3><p>${esc(V.research)}</p>
        <svg class="vm-glyph" viewBox="0 0 120 60" fill="none" stroke="currentColor" aria-hidden="true"><path d="M5 45h110" stroke-width="1.5"/><rect x="30" y="22" width="60" height="18" rx="9" stroke-width="1.8"/><path d="M34 44c4-3 8 3 12 0s8-3 12 0 8 3 12 0 8-3 12 0" stroke-width="1.4"/><path d="M60 6v12m-5-5 5 5 5-5" stroke-width="1.8"/></svg></article>
      <article class="vm"><span class="vm-k">Mission</span><h3 class="vm-short">${esc(V.communityShort)}</h3><p>${esc(V.community)}</p>
        <svg class="vm-glyph" viewBox="0 0 120 60" fill="none" stroke="currentColor" aria-hidden="true"><path d="M20 55V10h40v45" stroke-width="1.8"/><path d="M60 10l28 8v45l-28-8" stroke-width="1.8"/><circle cx="78" cy="36" r="2.5" fill="currentColor"/><path d="M98 32h16m-6-6 6 6-6 6" stroke-width="1.8"/></svg></article>`;
  }
  function orchestraBlock() {
    const M = S.mission;
    // Orchestra: supervised students as seats in a semicircle
    const st = M.supervision, withPaper = st.filter((s) => s.paper.length).length;
    $("#orchestra-stat").textContent = `${withPaper} of ${st.length} supervised MSc theses led to co-authored publications.`;
    const W = 600, H = 300, cx = W / 2, cy = H - 30;
    const seats = st.map((s, i) => { const row = i % 2, a = Math.PI * (0.12 + 0.76 * (i / (st.length - 1))), R = row ? 175 : 230; return { s, x: cx - R * Math.cos(a), y: cy - R * Math.sin(a) }; });
    $("#orchestra-svg").innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="group" aria-label="Supervised students">
      <path d="M ${cx - 250} ${cy} A 250 250 0 0 1 ${cx + 250} ${cy}" fill="none" stroke="var(--rule)"/>
      <path d="M ${cx - 150} ${cy} A 150 150 0 0 1 ${cx + 150} ${cy}" fill="none" stroke="var(--rule)"/>
      <g transform="translate(${cx} ${cy - 22})"><rect x="-26" y="-6" width="52" height="28" rx="3" fill="var(--paper-2)" stroke="var(--ink-3)"/><text y="44" text-anchor="middle" font-family="Roboto Mono, monospace" font-size="11" fill="var(--ink-2)">PODIUM</text></g>
      ${seats.map((p, i) => `<g class="seat" data-i="${i}" tabindex="0" role="button" aria-label="${esc(p.s.name)}"><circle cx="${p.x}" cy="${p.y}" r="${p.s.paper.length ? 15 : 11}" fill="${p.s.paper.length ? "var(--tide)" : "var(--paper-2)"}" stroke="var(--ink-3)"/><text x="${p.x}" y="${p.y + 32}" text-anchor="middle" font-family="Roboto, sans-serif" font-size="12" fill="var(--ink-2)">${esc(p.s.name.split(" ")[0])}</text></g>`).join("")}
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

  }

  /* ================= HOME ================= */
  function home() {
    const d = S.defense;
    const vf = $("#defense");
    if (d.youtubeId && String(d.youtubeId).trim()) {
      vf.innerHTML = `<button class="yt" data-id="${esc(String(d.youtubeId).trim())}" data-title="PhD defense" aria-label="Play the full defense">${ytThumb({ id: String(d.youtubeId).trim() })}<span class="play-disc">${ICON.play}</span></button>`;
      bindYT(vf);
    }
    $("#defense-cap").innerHTML = `<span>${esc(d.caption)}</span>`;
    const [t1, t2] = String(d.thesis).split(":");
    $("#thesis-title").innerHTML = t2 ? `<em>${esc(t1)}:</em>${esc(t2)}` : esc(d.thesis);
    $("#promotors").textContent = "Promotors: Dr. ir. M. Wiertlewski, Dr. ir. A. Sakes and Prof. dr. ir. P. Breedveld";
    $("#bio").innerHTML = S.bio.map((p) => `<p>${esc(p)}</p>`).join("");
    statement(); researchLines(); teachingBits(); vm();
    const sup = S.mission.supervision, withPaper = sup.filter((x) => x.paper.length).length;
    $("#ts-stat-n").textContent = `${withPaper} of ${sup.length}`;
    $("#ts-stat-l").textContent = "supervised MSc theses led to co-authored papers, abstracts or patents";
    $("#ts-courses").innerHTML = S.teaching.map((c) => `<li>${esc(c.title)}<span>${esc(c.year)} · ${esc(c.sub)}</span></li>`).join("");

    /* --- dials: animated gauges with a breakdown on hover --- */
    const P = S.publications, cnt = (t) => P.filter((p) => p.type === t).length;
    const awardsN = S.awards.filter((a) => a.kind === "award").length, grantsN = S.awards.filter((a) => a.kind === "grant").length;
    const dials = [
      { n: cnt("journal") + cnt("conference"), l: "Papers", sub: `${cnt("journal")} journal · ${cnt("conference")} conference`, href: "publications.html", c: "#7FB2F0", max: 20 },
      { n: cnt("patent"), l: "Patents", sub: "NL and US, granted", href: "publications.html#patent", c: "#5ED1C8", max: 4 },
      { n: awardsN, l: "Awards", sub: `plus ${grantsN} grants and scholarships`, href: "awards.html", c: "#FF8A65", max: 10 },
      { n: sup.length, l: "MSc theses", sub: `${withPaper} led to publications`, href: "teaching.html#orchestra", c: "#FFC94D", max: 10 },
      { n: S.series.reduce((a, s) => a + s.videos.length, 0), l: "Videos", sub: "talks and course sessions", href: "studio.html", c: "#F48FA8", max: 15 }
    ];
    const R = 52, C = 2 * Math.PI * R;
    $("#dials").innerHTML = dials.map((x) => `<a class="dial" href="${x.href}" style="--c:${x.c}">
      <svg viewBox="0 0 128 128" aria-hidden="true"><circle cx="64" cy="64" r="${R}" class="track"/><circle cx="64" cy="64" r="${R}" class="arc" style="stroke-dasharray:${C};stroke-dashoffset:${C * (1 - Math.min(x.n / x.max, 1))}" data-off="${C * (1 - Math.min(x.n / x.max, 1))}" data-c="${C}"/>
        ${Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * 2 * Math.PI; return `<line x1="${64 + 60 * Math.cos(a)}" y1="${64 + 60 * Math.sin(a)}" x2="${64 + 63 * Math.cos(a)}" y2="${64 + 63 * Math.sin(a)}" class="tick"/>`; }).join("")}</svg>
      <span class="dial-n" data-to="${x.n}">${x.n}</span><span class="dial-l">${esc(x.l)}</span><span class="dial-sub">${esc(x.sub)}</span></a>`).join("");
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
      document.querySelectorAll(".dial").forEach((d) => { const arc = d.querySelector(".arc"); arc.style.strokeDashoffset = arc.dataset.c; d.querySelector(".dial-n").textContent = "0"; });
      const io = new IntersectionObserver((en) => en.forEach((e) => {
        if (!e.isIntersecting) return; io.unobserve(e.target);
        const arc = e.target.querySelector(".arc"), num = e.target.querySelector(".dial-n"), to = +num.dataset.to, t0 = performance.now();
        requestAnimationFrame(() => { arc.style.strokeDashoffset = arc.dataset.off; });
        const tick = (now) => { const k = Math.min((now - t0) / 1200, 1); num.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); };
        requestAnimationFrame(tick);
      }), { threshold: 0.5 });
      document.querySelectorAll(".dial").forEach((d) => io.observe(d));
    }

    /* --- latest: one tab per kind, so papers, awards, perspectives and news stay apart --- */
    const byDate = (a, b) => String(b.date || b.year).localeCompare(String(a.date || a.year));
    const pubImg = (p) => p.img || (p.video ? `https://i.ytimg.com/vi/${p.video}/maxresdefault.jpg` : "");
    const groups = {
      papers: { label: "Papers", icon: "paper", href: "publications.html", items: P.filter((p) => p.type !== "patent").slice(0, 3).map((p) => ({ t: p.title, m: `${p.year} · ${TYPE_LABEL[p.type]}`, d: p.hl, img: pubImg(p), href: `publications.html#${p.id}` })) },
      awards: { label: "Awards", icon: "award", href: "awards.html", items: S.awards.filter((a) => a.photos).slice(0, 3).map((a) => ({ t: a.title, m: `${a.year} · ${a.org}`, d: a.work || "", img: a.photos[0], href: `awards.html#${encodeURIComponent(a.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}` })) },
      perspectives: { label: "Perspectives", icon: "perspective", href: "perspectives.html", items: S.posts.filter((p) => p.cat === "perspective").sort(byDate).slice(0, 3).map((p) => ({ t: p.title, m: fmtDate(p.date), d: p.summary, img: p.img, li: p.urn })) },
      news: { label: "News", icon: "news", href: "news.html", items: S.posts.filter((p) => p.cat === "news").sort(byDate).slice(0, 3).map((p) => ({ t: p.title, m: `${fmtDate(p.date)} · ${NEWS_KIND[p.kind] || "News"}`, d: p.summary, img: p.img, li: p.urn })) }
    };
    const tabs = $("#latest-tabs"), body = $("#latest-body");
    tabs.innerHTML = Object.entries(groups).map(([k, g], i) => `<button role="tab" class="lt" data-k="${k}" aria-selected="${i === 0}">${ICONS[g.icon]}<span>${g.label}</span></button>`).join("");
    const show = (k) => {
      const g = groups[k];
      tabs.querySelectorAll(".lt").forEach((b) => b.setAttribute("aria-selected", b.dataset.k === k));
      body.innerHTML = `<div class="lt-items">${g.items.map((it) => `<a class="lt-item" href="${it.href || "#"}" ${it.li ? `data-li="${it.li}"` : ""}>
          <span class="lt-img">${it.img ? `<img src="${esc(it.img)}" alt="" loading="lazy">` : ""}</span>
          <span class="lt-txt"><span class="lt-m">${esc(it.m)}</span><span class="lt-t">${esc(it.t)}</span>${it.d ? `<span class="lt-d">${esc(it.d)}</span>` : ""}</span></a>`).join("")}</div>
        <a class="text-link" href="${g.href}">All ${g.label.toLowerCase()}</a>`;
    };
    tabs.addEventListener("click", (e) => { const b = e.target.closest(".lt"); if (b) show(b.dataset.k); });
    show("papers");

    /* --- affiliation badges: flip to reveal the role --- */
    const AFF = [
      ["tudelft", "TU Delft", "PhD 2020–2026 · Postdoc, BITE group"],
      ["utwente", "University of Twente", "Postdoc, RaM group, 2024–2026"],
      ["philips", "Philips Research", "Research intern, Cambridge MA, 2019 and 2020"],
      ["wpi", "Worcester Polytechnic Institute", "MSc Robotics Engineering, COMET Lab"],
      ["fulbright", "Fulbright", "Fulbright Scholar, 2018–2020"],
      ["ubiros", "UbiRos", "Product development intern, 2018–2019"],
      ["advansys", "Advansys ESC", "Mechanical, then research & innovation engineer, 2016–2018"],
      ["cairo-university", "Cairo University", "BSc Mechanical Design and Production, 2014"]
    ];
    $("#badges").innerHTML = AFF.map(([f, n, r], i) => `<button class="badge" type="button" style="--i:${i}" aria-label="${esc(n)}: ${esc(r)}"><span class="b-in"><span class="b-front"><img src="assets/img/logos/${f}.png" alt="${esc(n)}" loading="lazy"></span><span class="b-back"><b>${esc(n)}</b>${esc(r)}</span></span></button>`).join("");
    $("#badges").addEventListener("click", (e) => { const b = e.target.closest(".badge"); if (b) b.classList.toggle("flipped"); });
  }

  /* ================= RESEARCH ================= */
  function researchLines() {
    const L = S.researchLines, el = $("#rl"); if (!L || !el) return;
    $("#rl-title").textContent = L.title; $("#rl-lead").textContent = L.lead;
    const pillar = (p) => `<div class="pillar pillar-${p.key.toLowerCase()}"><span class="pillar-k">${esc(p.key)}</span><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p>
      ${el.classList.contains("compact") ? "" : p.groups.map((g) => `<div class="pg"><span class="pg-l">${esc(g.label)}</span><ul>${g.items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`).join("")}${el.classList.contains("compact") ? `<span class="pg-more">${esc(p.groups.map((g) => g.label).join(" · "))}</span>` : ""}</div>`;
    const arrow = (dir, txt) => `<div class="rl-arrow ${dir}"><svg viewBox="0 0 120 16" aria-hidden="true"><path d="${dir === "to-f" ? "M2 8H112M104 2l10 6-10 6" : "M118 8H8M16 2L6 8l10 6"}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg><span>${esc(txt)}</span></div>`;
    el.innerHTML = pillar(L.pillars[0]) + `<div class="rl-cycle">${arrow("to-f", L.toFundamental)}${arrow("to-a", L.toApplied)}</div>` + pillar(L.pillars[1]);
  }

  function research() {
    statement();
    researchLines();
    $("#rs-lead")?.insertAdjacentHTML("beforebegin", `<div class="interests">${(S.researchInterests || []).map((x) => `<span class="int">${esc(x)}</span>`).join("")}</div>`);
    $("#themes").innerHTML = S.themes.map((t) => `<div class="theme">
      <span class="verb">${esc(t.verb)}</span>${glyph[t.verb] || ""}<h3>${esc(t.title)}</h3><p>${esc(t.text)}</p>
      <ul>${t.pubs.map((id) => pubById[id]).filter(Boolean).map((p) => `<li><a href="publications.html#${p.id}">${esc(p.title)}</a></li>`).join("")}</ul></div>`).join("");
  }

  /* ================= TEACHING ================= */
  function teaching() {
    teachingBits();
    $("#courses").innerHTML = S.teaching.map((t) => `<li><span class="y">${esc(t.year)}</span><div>${esc(t.title)}<div class="sub">${esc(t.sub)}</div></div></li>`).join("");
    $("#course-videos").innerHTML = S.series.filter((s) => s.group === "courses").flatMap((s) => s.videos).map(videoCard).join("");
    bindYT($("#course-videos"));
    orchestraBlock();
  }

  /* ================= CONTACT ================= */
  function contact() {
    const P = S.person;
    $("#contact-cards").innerHTML = U.socialLinks(true);
    $("#c-name").textContent = P.name; $("#c-role").textContent = `${P.role}, ${P.affiliation}`;
    $("#c-loc").innerHTML = `${ICON.pin || ""} ${esc(P.location)}`;
    $("#c-email").textContent = P.email;
    $("#c-copy").addEventListener("click", () => copy(P.email, "Email copied"));
    $("#refs").innerHTML = (P.references || []).map((r) => `<article class="ref"><h3>${esc(r.name)}</h3><p>${esc(r.title)}</p><p class="ref-mail"><a href="mailto:${esc(r.email)}">${esc(r.email)}</a><button type="button" data-copy="${esc(r.email)}">Copy</button></p></article>`).join("");
    $("#refs").addEventListener("click", (e) => { const b = e.target.closest("[data-copy]"); if (b) copy(b.dataset.copy, "Email copied"); });
  }

  /* ================= MISSION ================= */
  function mission() {
    const M = S.mission;
    vm();
    $("#juniors").innerHTML = M.juniors.map((j) => `<${j.url ? `a href="${esc(j.url)}" ${/^https?:/.test(j.url) ? 'target="_blank" rel="noopener"' : ""}` : "div"} class="jn">
      <span class="jn-img ${j.img ? "" : "jn-noimg"}">${j.img ? `<img src="${esc(j.img)}" alt="" loading="lazy">` : `<span>${esc(j.when)}</span>`}</span>
      <span class="jn-txt"><span class="jn-when">${esc(j.when)}</span><span class="jn-t">${esc(j.title)}</span><span class="jn-d">${esc(j.text)}</span>${j.url ? `<span class="jn-go">${/linkedin/.test(j.url) ? "Read the post ↗" : "Read more →"}</span>` : ""}</span></${j.url ? "a" : "div"}>`).join("");
    $("#community-list").insertAdjacentHTML("beforebegin", (S.leadership || []).map((l) => `<div class="lead-card"><span class="lead-k">Community leadership</span><h3>${esc(l.role)}</h3><p class="lead-b">${esc(l.body)}</p><p>${esc(l.text)}</p></div>`).join(""));
    $("#community-list").innerHTML = M.community.map((c) => `<${c.url ? `a href="${esc(c.url)}" target="_blank" rel="noopener"` : "div"} class="cm ${c.img ? "" : "no-img"}">
      ${c.img ? `<span class="cm-img"><img src="${esc(c.img)}" alt="" loading="lazy"></span>` : ""}
      <span class="cm-txt"><span class="cm-meta"><span class="cm-yr">${esc(c.when)}</span>${esc(c.where)}</span><span class="cm-t">${esc(c.title)}</span><span class="cm-role">${esc(c.role)}</span></span></${c.url ? "a" : "div"}>`).join("");
    $("#doors-list").innerHTML = M.doors.map((d) => `<article class="dr">
      <div class="dr-head">${d.logo ? `<span class="dr-logo"><img src="assets/img/logos/${d.logo}.png" alt=""></span>` : `<span class="dr-logo dr-key">🔑</span>`}<div><span class="dr-yr">${d.year}</span><h3>${esc(d.name)}</h3></div></div>
      <p>${esc(d.enabled)}</p><a class="text-link" href="${esc(d.url)}" target="_blank" rel="noopener">Official page</a></article>`).join("");
  }

  /* ================= JOURNEY ================= */
  function journey() {
    const M = window.JOURNEY_MAP, C = S.chapters, MV = S.moves, reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    $("#cv-link").href = S.person.cv;
    const pin = (k) => M.pts[k];
    // on arrival, every place of that chapter fans out around the pin
    const fan = (logos) => { const n = logos.length, R = 84, step = n > 1 ? Math.min(42, 150 / (n - 1)) : 0;
      return `<g class="pin-fan">${logos.map(([f, a], j) => { const ang = (-90 + (j - (n - 1) / 2) * step) * Math.PI / 180, x = (R * Math.cos(ang)).toFixed(1), y = (R * Math.sin(ang)).toFixed(1);
        return `<line x2="${x}" y2="${y}" style="--d:${j * 90}ms"/><g transform="translate(${x} ${y})"><g class="fan-in" style="--d:${j * 90}ms"><title>${esc(a)}</title><circle r="26"/><image href="assets/img/logos/${f}.png" x="-19" y="-19" width="38" height="38" preserveAspectRatio="xMidYMid meet"/></g></g>`; }).join("")}</g>`; };
    const logo = (f, alt) => `<img src="assets/img/logos/${f}.png" alt="${esc(alt)}" loading="lazy">`;
    // on arrival, every place of that chapter fans out around the pin
    const fanAt = (logos, x) => { const n = logos.length, R = 84, step = n > 1 ? Math.min(42, 150 / (n - 1)) : 0, base = x > M.W - 110 ? -128 : x < 110 ? -52 : -90;
      return `<g class="pin-fan">${logos.map(([f, a], j) => { const ang = (base + (j - (n - 1) / 2) * step) * Math.PI / 180, fx = (R * Math.cos(ang)).toFixed(1), fy = (R * Math.sin(ang)).toFixed(1);
        return `<line x2="${fx}" y2="${fy}" style="--d:${j * 90}ms"/><g transform="translate(${fx} ${fy})"><g class="fan-in" style="--d:${j * 90}ms"><title>${esc(a)}</title><circle r="26"/><image href="assets/img/logos/${f}.png" x="-19" y="-19" width="38" height="38" preserveAspectRatio="xMidYMid meet"/></g></g>`; }).join("")}</g>`; };
    $("#jr-map").innerHTML = `<svg viewBox="0 0 ${M.W} ${M.H}" role="img" aria-label="Map: Cairo to Worcester, Massachusetts in 2018, then to Delft in 2020">
      <defs><radialGradient id="sea" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="var(--map-sea-1)"/><stop offset="1" stop-color="var(--map-sea-2)"/></radialGradient></defs>
      <rect width="${M.W}" height="${M.H}" fill="url(#sea)"/>
      <path d="${M.grat}" class="grat"/>
      <path d="${M.land}" class="land"/>
      ${MV.map((m, i) => `<path d="${M.arcs[m.arc]}" class="arc-bg"/><path d="${M.arcs[m.arc]}" class="arc" id="arc-${i}"/>`).join("")}
      ${C.map((c, i) => { const [x, y] = pin(c.pin); return `<g class="city" data-i="${i}" transform="translate(${x} ${y})" tabindex="0" role="button" aria-label="${esc(c.city)}">
          <circle r="22" class="pulse"/><circle r="7" class="dot"/>
          <g class="pin-logo" transform="translate(0 -46)"><circle r="24"/><image href="assets/img/logos/${c.logos[0][0]}.png" x="-17" y="-17" width="34" height="34" preserveAspectRatio="xMidYMid meet"/></g>
          ${fanAt(c.logos, x)}
          <text y="30" class="city-name">${esc(c.city.split(",")[0])}</text><text y="46" class="city-yrs">${esc(c.years)}</text></g>`; }).join("")}
      <g id="plane" class="plane" opacity="0"><circle r="16" class="plane-halo"/><path d="M-11 0 L9 -2 L13 0 L9 2 Z M-2 -1 L-6 -9 L-3 -9 L4 -1 Z M-2 1 L-6 9 L-3 9 L4 1 Z M-10 -1 L-13 -5 L-11 -5 L-7 -1 Z M-10 1 L-13 5 L-11 5 L-7 1 Z"/></g>
    </svg>
    <div class="jr-move" id="jr-move" hidden></div>`;
    // step buttons
    const steps = $("#jr-steps");
    steps.innerHTML = C.map((c, i) => `${i ? `<button class="jr-hop" data-move="${i - 1}" aria-label="Fly: ${esc(MV[i - 1].label)}"><span class="hop-yr">${MV[i - 1].year}</span><span class="hop-l">${esc(MV[i - 1].label)}</span><span class="hop-ico">✈</span></button>` : ""}
      <button class="jr-step" role="tab" data-i="${i}" aria-selected="false"><span class="st-now">Now viewing</span><span class="st-logos">${c.logos.slice(0, 3).map(([f, a]) => `<span class="st-chip">${logo(f, a)}</span>`).join("")}${c.logos.length > 3 ? `<span class="st-chip st-more" title="${esc(c.logos.slice(3).map((l) => l[1]).join(", "))}">+${c.logos.length - 3}</span>` : ""}</span><span class="st-city">${esc(c.city.split(",")[0])}</span><span class="st-yrs">${esc(c.years)}</span></button>`).join("");
    let cur = -1, timer = null, flying = false;
    const plane = $("#plane");
    const fly = (mi, then) => {
      const path = document.getElementById("arc-" + mi), L = path.getTotalLength(), m = MV[mi], box = $("#jr-move");
      box.hidden = false; box.innerHTML = `<img src="${esc(m.photo)}" alt=""><div><span class="mv-yr">${m.year} · ${esc(m.label)}</span><p>${esc(m.text)}</p></div>`;
      box.classList.remove("show"); void box.offsetWidth; box.classList.add("show");
      path.style.strokeDasharray = L; path.style.strokeDashoffset = L; path.classList.add("on");
      if (reduce) { path.style.strokeDashoffset = 0; then(); return; }
      flying = true; plane.setAttribute("opacity", "1"); path.classList.add("flying");
      const t0 = performance.now(), dur = 2600;
      const step = (now) => {
        const k = Math.min((now - t0) / dur, 1), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        const p = path.getPointAtLength(e * L), q = path.getPointAtLength(Math.min(L, e * L + 1));
        const ang = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI, lift = Math.sin(Math.PI * e) * 0.6 + 1;
        plane.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${ang}) scale(${lift})`);
        path.style.strokeDashoffset = L * (1 - e);
        if (k < 1) requestAnimationFrame(step); else { flying = false; plane.setAttribute("opacity", "0"); setTimeout(() => path.classList.remove("flying"), 900); then(); }
      };
      requestAnimationFrame(step);
    };
    const show = (i, viaFlight) => {
      if (flying || i === cur) return;
      const go = () => {
        cur = i;
        steps.querySelectorAll(".jr-step").forEach((b) => b.setAttribute("aria-selected", +b.dataset.i === i));
        document.querySelectorAll(".city").forEach((g) => { const on = +g.dataset.i === i; g.classList.toggle("active", on); if (on) g.parentNode.insertBefore(g, plane); });
        MV.forEach((m, mi) => document.getElementById("arc-" + mi).classList.toggle("on", mi < i));
        MV.forEach((m, mi) => { if (mi < i) document.getElementById("arc-" + mi).style.strokeDashoffset = 0; });
        renderChapter(i);
      };
      // the flight caption fades out after landing so it never covers the map
      if (viaFlight && i === cur + 1) fly(cur, () => { go(); clearTimeout(show.t); show.t = setTimeout(() => { if (!flying) $("#jr-move").hidden = true; }, 3200); }); else { $("#jr-move").hidden = true; go(); }
    };
    steps.addEventListener("click", (e) => {
      const h = e.target.closest(".jr-hop"); if (h) { const mi = +h.dataset.move; if (cur !== mi) { show(mi, false); setTimeout(() => show(mi + 1, true), 50); } else show(mi + 1, true); return; }
      const b = e.target.closest(".jr-step"); if (b) show(+b.dataset.i, +b.dataset.i === cur + 1);
    });
    $("#jr-map").addEventListener("click", (e) => { const g = e.target.closest(".city"); if (g) show(+g.dataset.i, +g.dataset.i === cur + 1); });

    // chapter panel with a moving photo reel
    function renderChapter(i) {
      const c = C[i], roles = S.timeline.filter((t) => t.city === c.id);
      clearInterval(timer);
      $("#jr-chapter").innerHTML = `<div class="ch-head"><div><span class="kicker-s">Chapter ${i + 1} of ${C.length} · ${esc(c.years)}</span><h2 class="ch-title">${esc(c.title)}</h2><p class="ch-city">${esc(c.city)}</p></div>
          <div class="ch-logos">${c.logos.map(([f, a]) => `<span class="ch-logo" title="${esc(a)}">${logo(f, a)}</span>`).join("")}</div></div>
        <div class="ch-grid">
          <div class="reel" id="reel">
            <div class="reel-stage">${c.photos.map((p, k) => `<figure class="reel-slide ${k === 0 ? "on" : ""}"><img src="${esc(p.src)}" alt="${esc(p.caption)}" loading="${k < 2 ? "eager" : "lazy"}"><figcaption>${esc(p.caption)}</figcaption></figure>`).join("")}
              <button class="reel-nav prev" aria-label="Previous photo">${ICON.left}</button><button class="reel-nav next" aria-label="Next photo">${ICON.right}</button></div>
            <div class="reel-strip">${c.photos.map((p, k) => `<button class="reel-th ${k === 0 ? "on" : ""}" data-k="${k}" aria-label="Photo ${k + 1}"><img src="${esc(p.src)}" alt="" loading="lazy"></button>`).join("")}</div>
          </div>
          <div class="ch-body"><p class="ch-text">${esc(c.text)}</p>
            <ol class="ch-roles">${roles.map((t) => `<li class="k-${t.kind}"><span class="when">${esc(t.when)}</span><div><h3>${esc(t.title)}</h3><p class="org">${esc(t.org)}</p>${t.text ? `<p>${esc(t.text)}</p>` : ""}</div></li>`).join("")}</ol>
            ${i < C.length - 1 ? `<button class="btn" id="next-move">Next move: ${esc(MV[i].label)} ✈</button>` : `<a class="btn ghost" href="publications.html">See the work →</a>`}
          </div></div>`;
      const slides = [...document.querySelectorAll(".reel-slide")], ths = [...document.querySelectorAll(".reel-th")];
      let k = 0;
      const set = (n) => { k = (n + slides.length) % slides.length; slides.forEach((s, j) => s.classList.toggle("on", j === k)); ths.forEach((t, j) => t.classList.toggle("on", j === k)); const strip = ths[k].parentNode, t = ths[k];
        // move the thumbnail strip sideways only; never scroll the page
        if (t.offsetLeft < strip.scrollLeft || t.offsetLeft + t.offsetWidth > strip.scrollLeft + strip.clientWidth) strip.scrollTo({ left: t.offsetLeft - strip.clientWidth / 2 + t.offsetWidth / 2, behavior: "smooth" }); };
      const start = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => set(k + 1), 3800); };
      $(".reel-strip").addEventListener("click", (e) => { const b = e.target.closest(".reel-th"); if (b) { set(+b.dataset.k); start(); } });
      $(".reel .prev").addEventListener("click", () => { set(k - 1); start(); }); $(".reel .next").addEventListener("click", () => { set(k + 1); start(); });
      $(".reel-stage").addEventListener("click", (e) => { if (e.target.closest("button")) return; lightbox({ title: c.title, id: c.id }, c.photos, k); });
      $("#reel").addEventListener("mouseenter", () => clearInterval(timer)); $("#reel").addEventListener("mouseleave", start);
      start();
      $("#next-move")?.addEventListener("click", () => { $("#jr-map").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" }); setTimeout(() => show(i + 1, true), reduce ? 0 : 450); });
    }
    show(0, false);
    // first visit: play both moves once when the map comes into view
    if (!reduce && "IntersectionObserver" in window) {
      const io = new IntersectionObserver((en) => { if (!en[0].isIntersecting) return; io.disconnect();
        setTimeout(() => show(1, true), 700); setTimeout(() => show(2, true), 700 + 2600 + 2200); }, { threshold: 0.6 });
      io.observe($("#jr-map"));
    }
    // ---------- talks: a map of every venue, linked to the list below ----------
    const VM = window.VENUES_MAP, venues = (S.places || []).filter((p) => p.type === "venue");
    const placeOf = (t) => venues.find((p) => p.match.some((m) => t.venue.includes(m)));
    const kinds = ["All", "Invited", "Oral", "Poster"]; let tk = "All", city = null;
    if (VM && $("#talks")) {
      const V = venues.map((p) => { const items = S.talks.filter((t) => placeOf(t) === p); return { ...p, items, award: items.some((t) => t.award), pt: VM.pts[p.id] }; }).filter((p) => p.pt && p.items.length);
      const starPts = (r) => Array.from({ length: 10 }, (_, k) => { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r * 0.45 : r; return `${(rr * Math.cos(a)).toFixed(1)},${(rr * Math.sin(a)).toFixed(1)}`; }).join(" ");
      const LB = { delft: [-14, -8, "end"], egmond: [12, -6], ghent: [-12, 14, "end"], eindhoven: [14, 10], london: [-14, 5, "end"], lyon: [-16, 6, "end"], lausanne: [14, 5], venice: [14, 5], vienna: [14, 5], lisbon: [16, 5], sandiego: [12, 14], lasvegas: [12, -6] };
      const online = S.talks.filter((t) => /online/i.test(t.venue)), awards = S.talks.filter((t) => t.award).length;
      const I = VM.inset;
      ($("#vmap-holder") || $("#talks")).insertAdjacentHTML($("#vmap-holder") ? "afterbegin" : "beforebegin", `<div class="vmap" id="vmap">
        <svg viewBox="0 0 ${VM.W} ${VM.H}" role="img" aria-label="Map of the cities where I presented, awards marked with a star">
          <defs><radialGradient id="vsea" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="var(--map-sea-1)"/><stop offset="1" stop-color="var(--map-sea-2)"/></radialGradient><filter id="vglow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5"/></filter><marker id="vhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1,1 L9,5 L1,9" class="vm-head"/></marker><marker id="vhead-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1,1 L9,5 L1,9" class="vm-head gold"/></marker></defs>
          <rect width="${VM.W}" height="${VM.H}" fill="url(#vsea)"/><path d="${VM.grat}" class="grat"/><path d="${VM.land}" class="land"/>
          <rect class="vmap-inset" x="${I.x}" y="${I.y}" width="${I.w}" height="${I.h}" rx="10"/><path d="${I.land}" class="land"/><text class="vmap-inset-k" x="${I.x + 12}" y="${I.y + I.h - 10}">${esc(I.label.toUpperCase())}</text>
          <g class="vm-routes">${(() => { const h = VM.pts.delft; return V.filter((p) => p.id !== "delft" && Math.hypot(p.pt[0] - h[0], p.pt[1] - h[1]) > 45).map((p) => {
            const [x, y] = p.pt, dx = x - h[0], dy = y - h[1], d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d, end = [x - ux * 14, y - uy * 14], st = [h[0] + ux * 10, h[1] + uy * 10];
            const mx = (st[0] + end[0]) / 2 - dy * .14, my = (st[1] + end[1]) / 2 + dx * .14;
            return `<path class="vm-route${p.award ? " gold" : ""}" data-id="${p.id}" d="M${st[0].toFixed(1)},${st[1].toFixed(1)}Q${mx.toFixed(1)},${my.toFixed(1)} ${end[0].toFixed(1)},${end[1].toFixed(1)}" marker-end="url(#${p.award ? "vhead-g" : "vhead"})"/>`; }).join(""); })()}</g>
          ${V.map((p) => { const [x, y] = p.pt, lb = LB[p.id] || [12, 5], n = p.items.length;
            return `<g class="vp${p.award ? " award" : ""}" data-id="${p.id}" transform="translate(${x} ${y})" tabindex="0" role="button" aria-label="${esc(p.city)}: ${n} talk${n > 1 ? "s" : ""}${p.award ? ", award" : ""}">
              ${p.award ? `<circle class="glow" r="18"/><polygon class="star" points="${starPts(12)}"/>` : `<circle class="dot" r="${6 + (n - 1) * 2}"/>`}
              <text x="${lb[0]}" y="${lb[1]}" text-anchor="${lb[2] || "start"}">${esc(p.city)}${n > 1 ? ` <tspan class="n">×${n}</tspan>` : ""}</text></g>`; }).join("")}
        </svg>
        <div class="vmap-stats"><b>${V.length}</b> cities <span>·</span> <b>${S.talks.length}</b> talks <span>·</span> <b class="gold">★ ${awards}</b> awards${online.length ? ` <span>·</span> ${online.length} online` : ""}</div>
        <div class="vmap-tip" id="vmap-tip" hidden></div>
      </div>`);
      const vm = $("#vmap"), tip = $("#vmap-tip");
      const showTip = (g) => { const p = V.find((q) => q.id === g.dataset.id);
        tip.innerHTML = `<span class="k">${esc(p.city)}</span><ul>${p.items.map((t) => `<li><span class="y">${t.year}</span><span><b>${esc(t.title)}</b>${esc(t.kind)} · ${esc(t.venue)}${t.award ? `<em>★ ${esc(t.award)}</em>` : ""}</span></li>`).join("")}</ul>`;
        tip.hidden = false; const r = g.getBoundingClientRect(), mr = vm.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
        let x = r.left - mr.left + r.width / 2 - tw / 2, y = r.top - mr.top - th - 10; if (y < 8) y = r.bottom - mr.top + 10;
        tip.style.left = Math.max(8, Math.min(x, mr.width - tw - 8)) + "px"; tip.style.top = Math.max(8, Math.min(y, mr.height - th - 8)) + "px"; };
      const hotRoute = (id) => vm.querySelectorAll(".vm-route").forEach((r) => r.classList.toggle("hot", r.dataset.id === id));
      vm.addEventListener("mouseover", (e) => { const g = e.target.closest(".vp"); if (g) { showTip(g); hotRoute(g.dataset.id); } });
      vm.addEventListener("mouseleave", () => hotRoute(city));
      vm.addEventListener("mouseout", (e) => { const g = e.target.closest(".vp"); if (g && !g.contains(e.relatedTarget)) tip.hidden = true; });
      vm.addEventListener("click", (e) => { const g = e.target.closest(".vp"); if (!g) return; city = city === g.dataset.id ? null : g.dataset.id; renderTalks(); showTip(g); });
      vm.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.closest(".vp")) e.target.closest(".vp").click(); });
      // one frame, two views
      document.querySelectorAll(".jr-tab").forEach((t) => t.addEventListener("click", () => {
        document.querySelectorAll(".jr-tab").forEach((x) => x.setAttribute("aria-selected", x === t));
        document.querySelectorAll(".jr-view").forEach((v) => { v.hidden = v.dataset.v !== t.dataset.v; });
        tip.hidden = true;
      }));
      // hovering a talk in the list lights its city
      $("#talks").addEventListener("mouseover", (e) => { const li = e.target.closest("li[data-p]"); vm.querySelectorAll(".vp").forEach((g) => g.classList.toggle("hot", !!li && g.dataset.id === li.dataset.p)); });
      $("#talks").addEventListener("mouseleave", () => vm.querySelectorAll(".vp.hot").forEach((g) => g.classList.remove("hot")));
    }
    $("#talks").insertAdjacentHTML("beforebegin", `<div class="chips" id="talk-chips" style="margin-bottom:14px">${kinds.map((k) => `<button class="chip" data-k="${k}" aria-pressed="${k === "All"}">${k}<span class="count">${k === "All" ? S.talks.length : S.talks.filter((t) => t.kind === k).length}</span></button>`).join("")}<button class="chip city-chip" id="city-chip" hidden></button></div>`);
    const renderTalks = () => {
      const list = S.talks.filter((t) => (tk === "All" || t.kind === tk) && (!city || (placeOf(t) || {}).id === city));
      $("#talks").innerHTML = list.map((t) => { const p = placeOf(t); return `<li${p ? ` data-p="${p.id}"` : ""}><span class="y">${t.year}</span><div>${esc(t.title)}<div class="sub"><span class="kpill k-${t.kind.toLowerCase()}">${esc(t.kind)}</span> ${esc(t.venue)}${t.award ? ` · <b class="star">★ ${esc(t.award)}</b>` : ""}</div></div></li>`; }).join("") || `<li><span class="y">—</span><div class="muted">No talks match this filter.</div></li>`;
      const cc = $("#city-chip"), cp = venues.find((p) => p.id === city); cc.hidden = !cp; if (cp) cc.innerHTML = `${esc(cp.city)} <span aria-hidden="true">✕</span>`;
      document.querySelectorAll("#vmap .vp").forEach((g) => g.classList.toggle("sel", g.dataset.id === city));
      document.querySelectorAll("#vmap .vm-route").forEach((r) => r.classList.toggle("hot", r.dataset.id === city));
      document.getElementById("vmap")?.classList.toggle("has-sel", !!city);
    };
    $("#talk-chips").addEventListener("click", (e) => { const b = e.target.closest(".chip"); if (!b) return; if (b.id === "city-chip") { city = null; renderTalks(); return; } tk = b.dataset.k; $("#talk-chips").querySelectorAll(".chip:not(.city-chip)").forEach((c) => c.setAttribute("aria-pressed", c === b)); renderTalks(); });
    renderTalks();
    $("#service").insertAdjacentHTML("beforebegin", (S.leadership || []).map((l) => `<div class="lead-card"><span class="lead-k">Community leadership</span><h3>${esc(l.role)}</h3><p class="lead-b">${esc(l.body)}</p><p>${esc(l.text)}</p></div>`).join(""));
    $("#service").innerHTML = S.service.slice(1).map((t) => `<li><span class="y">—</span><div>${esc(t)}</div></li>`).join("");
  }

  /* ================= PUBLICATIONS ================= */
  function publications() {
    const state = { type: "all", q: "" };
    const types = ["all", "journal", "conference", "abstract", "patent", "thesis"];
    const count = (t) => t === "all" ? S.publications.length : S.publications.filter((p) => p.type === t).length;
    const chips = $("#pub-chips");
    chips.innerHTML = types.filter((t) => count(t)).map((t) => `<button class="chip" data-t="${t}" aria-pressed="${t === "all"}">${t === "all" ? "All" : TYPE_LABEL[t]}<span class="count">${count(t)}</span></button>`).join("");
    chips.addEventListener("click", (e) => { const b = e.target.closest(".chip"); if (!b) return; state.type = b.dataset.t; chips.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c === b)); render(); });
    $("#pub-q").addEventListener("input", (e) => { state.q = e.target.value.toLowerCase(); render(); });
    const cite = (p) => `${p.authors}, "${p.title}," ${p.venue}, ${p.year}.${p.doi ? " doi:" + p.doi : ""}`;
    const media = (p) => p.img ? `<img src="${esc(p.img)}" alt="Figure from ${esc(p.title)}" loading="lazy">`
      : p.video ? `<img src="https://i.ytimg.com/vi/${esc(p.video)}/maxresdefault.jpg" alt="" loading="lazy">`
      : `<span class="pub-ph">${esc(TYPE_LABEL[p.type])}<b>${p.year}</b></span>`;
    function render() {
      const list = S.publications.filter((p) => (state.type === "all" || p.type === state.type) && (!state.q || (p.title + p.authors + p.venue + p.year + (p.hl || "")).toLowerCase().includes(state.q)));
      const years = [...new Set(list.map((p) => p.year))].sort((a, b) => b - a);
      $("#pubs").innerHTML = list.length ? years.map((y) => `<div class="pub-year" data-nav="${y}"><h3>${y}</h3><div class="pub-list">${list.filter((p) => p.year === y).map((p) => `
        <article class="pub2" id="${p.id}">
          <div class="pub-media">${media(p)}${p.video ? `<button class="pub-play" data-vid="${esc(p.video)}" aria-label="Play video">${ICON.play}</button>` : ""}</div>
          <div class="pub-txt">
            <div class="pub-tags"><span class="tag">${TYPE_LABEL[p.type]}</span>${p.status ? `<span class="tag tide">${esc(p.status)}</span>` : ""}${(p.also || []).filter((a) => a.award).map((a) => `<span class="tag brass">★ ${esc(a.award)}</span>`).join("")}</div>
            <h4 class="title">${esc(p.title)}</h4>
            ${p.hl ? `<p class="hl">${esc(p.hl)}</p>` : ""}
            <p class="authors">${meName(p.authors)}</p>
            <p class="venue">${esc(p.venue)}</p>
            ${(p.also || []).length ? `<ul class="also">${p.also.map((a) => `<li>${esc(a.t)}${a.award ? ` · <b>${esc(a.award)}</b>` : ""}</li>`).join("")}</ul>` : ""}
            <div class="actions">${p.doi ? `<a href="https://doi.org/${esc(p.doi)}" target="_blank" rel="noopener">DOI ↗</a>` : ""}${p.url ? `<a href="${esc(p.url)}" target="_blank" rel="noopener">View ↗</a>` : ""}<button type="button" data-cite="${p.id}">Copy citation</button></div>
          </div></article>`).join("")}</div></div>`).join("") : `<p class="pub-empty">No publications match “${esc(state.q)}”.</p>`;
    }
    $("#pubs").addEventListener("click", (e) => {
      const b = e.target.closest("[data-cite]"); if (b) copy(cite(pubById[b.dataset.cite]), "Citation copied");
      const v = e.target.closest("[data-vid]"); if (v) { const box = v.closest(".pub-media"); box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.dataset.vid)}?autoplay=1&rel=0" title="Video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`; box.classList.add("playing"); }
    });
    const h = location.hash.slice(1);
    if (types.includes(h)) { state.type = h; chips.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c.dataset.t === h)); }
    render();
    if (pubById[h]) { const el = document.getElementById(h); el?.scrollIntoView({ block: "center" }); el?.classList.add("flash"); }
  }

  /* ================= PERSPECTIVES ================= */
  function perspectives() {
    const items = S.posts.filter((p) => p.cat === "perspective" || p.type === "essay").sort((a, b) => (!!a.placeholder - !!b.placeholder) || b.date.localeCompare(a.date));
    const TOPICS = { all: "All", academia: "Academia & research culture", supervision: "Supervision", robotics: "Robotics & AI", communication: "Science communication" };
    const topicOf = (p) => /supervis|student|good student/i.test(p.title + p.summary) ? "supervision" : /soft robot|LLM|robot/i.test(p.title + p.summary) ? "robotics" : /figure|picture|art of science|thrilled/i.test(p.title + p.summary) ? "communication" : "academia";
    let topic = "all";
    const chips = $("#persp-chips");
    chips.innerHTML = Object.entries(TOPICS).map(([k, l]) => `<button class="chip" data-k="${k}" aria-pressed="${k === "all"}">${l}<span class="count">${k === "all" ? items.length : items.filter((p) => topicOf(p) === k).length}</span></button>`).join("");
    const render = () => {
      const list = items.filter((p) => topic === "all" || topicOf(p) === topic);
      $("#persp").innerHTML = list.map((p, i) => {
        const href = p.type === "essay" ? `post.html?p=${encodeURIComponent(p.slug)}` : p.url;
        return `<a class="persp ${i === 0 && topic === "all" ? "lead" : ""}" href="${esc(href)}" ${p.urn ? `data-li="${p.urn}"` : ""}>
          <span class="persp-img">${p.img ? `<img src="${esc(p.img)}" alt="" loading="lazy">` : coverSVG(p.title, { alt: "" })}</span>
          <span class="persp-txt"><span class="persp-m">${fmtDate(p.date)} · ${p.type === "essay" ? "Essay" : TOPICS[topicOf(p)]} ${sample(p)}</span><span class="persp-t">${esc(p.title)}</span><span class="persp-d">${esc(p.summary)}</span><span class="persp-go">${p.urn ? "Read the post" : "Read the essay"} →</span></span></a>`;
      }).join("");
    };
    chips.addEventListener("click", (e) => { const b = e.target.closest(".chip"); if (!b) return; topic = b.dataset.k; chips.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c === b)); render(); });
    render();
  }

  /* ================= NEWS ================= */
  function news() {
    const items = S.posts.filter((p) => p.cat === "news" || p.type === "press").map((p) => ({ ...p, kind: p.type === "press" ? "press" : p.kind || "community" })).sort((a, b) => b.date.localeCompare(a.date));
    const kinds = ["all", ...Object.keys(NEWS_KIND).filter((k) => items.some((p) => p.kind === k))];
    let k = "all";
    const chips = $("#news-chips");
    chips.innerHTML = kinds.map((x) => `<button class="chip" data-k="${x}" aria-pressed="${x === "all"}">${x === "all" ? "All" : NEWS_KIND[x]}<span class="count">${x === "all" ? items.length : items.filter((p) => p.kind === x).length}</span></button>`).join("");
    const render = () => {
      const list = items.filter((p) => k === "all" || p.kind === k);
      const years = [...new Set(list.map((p) => p.date.slice(0, 4)))];
      $("#news").innerHTML = years.map((y) => `<div class="news-year" data-nav="${y}"><h3>${y}</h3><div class="news-list">${list.filter((p) => p.date.startsWith(y)).map((p) => `
        <a class="news-item k-${p.kind}" href="${esc(p.url || "#")}" ${p.urn ? `data-li="${p.urn}"` : 'target="_blank" rel="noopener"'}>
          <span class="news-img">${p.img ? `<img src="${esc(p.img)}" alt="" loading="lazy">` : `<span class="news-ico">${ICONS[p.kind === "award" ? "award" : p.kind === "paper" ? "paper" : "news"]}</span>`}</span>
          <span class="news-txt"><span class="news-m"><span class="kpill">${NEWS_KIND[p.kind]}</span>${fmtDate(p.date)}</span><span class="news-t">${esc(p.title)}</span><span class="news-d">${esc(p.summary)}</span></span></a>`).join("")}</div></div>`).join("");
    };
    chips.addEventListener("click", (e) => { const b = e.target.closest(".chip"); if (!b) return; k = b.dataset.k; chips.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c === b)); render(); });
    render();
  }

  /* ================= AWARDS ================= */
  function awards() {
    const list = S.awards.map((a) => ({ ...a, slug: a.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + a.year }));
    let kind = "all", year = null;
    const chips = $("#aw-chips"), yrs = $("#aw-years");
    const KL = { all: "All", award: "Awards", grant: "Grants & scholarships" };
    chips.innerHTML = Object.entries(KL).map(([k, l]) => `<button class="chip" data-k="${k}" aria-pressed="${k === "all"}">${l}<span class="count">${k === "all" ? list.length : list.filter((a) => a.kind === k).length}</span></button>`).join("");
    const years = [...new Set(list.map((a) => a.year))].sort((a, b) => b - a);
    yrs.innerHTML = years.map((y) => `<button class="yr" data-y="${y}" aria-pressed="false"><span class="yr-dot"></span>${y}<span class="yr-n">${list.filter((a) => a.year === y).length}</span></button>`).join("");
    const render = () => {
      const show = list.filter((a) => (kind === "all" || a.kind === kind) && (!year || a.year === year));
      $("#aw-grid").innerHTML = show.map((a) => `<button class="aw ${a.photos ? "has-story" : ""} k-${a.kind}" data-slug="${a.slug}" ${a.photos ? "" : 'tabindex="-1"'}>
        <span class="aw-media">${a.photos ? `<img src="${esc(a.photos[0])}" alt="" loading="lazy">` : `<span class="aw-medal">${ICONS.award}</span>`}</span>
        <span class="aw-txt"><span class="aw-y">${a.year} · ${a.kind === "grant" ? "Grant" : "Award"}</span><span class="aw-t">${esc(a.title)}</span><span class="aw-o">${esc(a.org)}</span>${a.photos ? '<span class="aw-go">See the story →</span>' : ""}</span></button>`).join("");
    };
    const open = (a) => {
      const m = document.createElement("div"); m.className = "modal"; m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true"); m.setAttribute("aria-label", a.title);
      let i = 0;
      const paint = () => { m.innerHTML = `<div class="modal-card aw-modal"><button class="modal-x" aria-label="Close">${ICON.close}</button>
        <div class="aw-photo"><img src="${esc(a.photos[i])}" alt="">${a.photos.length > 1 ? `<div class="aw-dots">${a.photos.map((_, j) => `<button data-j="${j}" aria-label="Photo ${j + 1}" aria-pressed="${j === i}"></button>`).join("")}</div>` : ""}</div>
        <div class="aw-body"><span class="aw-y">${a.year} · ${esc(a.org)}</span><h3>${esc(a.title)}</h3>${a.work ? `<p class="aw-work">${esc(a.work)}</p>` : ""}<p>${esc(a.story || "")}</p>
        <p class="aw-links">${a.pub ? `<a href="publications.html#${a.pub}">The paper →</a>` : ""}${a.award_url ? `<a href="${esc(a.award_url)}" target="_blank" rel="noopener">TU Delft prize page ↗</a>` : ""}${a.url ? `<a href="${esc(a.url)}" target="_blank" rel="noopener">${/linkedin/.test(a.url) ? "The LinkedIn post ↗" : "Official page ↗"}</a>` : ""}</p></div></div>`; };
      paint(); document.body.appendChild(m); document.body.style.overflow = "hidden";
      const close = () => { m.remove(); document.body.style.overflow = ""; document.removeEventListener("keydown", key); history.replaceState(null, "", location.pathname); };
      const key = (e) => { if (e.key === "Escape") close(); if (e.key === "ArrowRight" && a.photos.length > 1) { i = (i + 1) % a.photos.length; paint(); } };
      m.addEventListener("click", (e) => { if (e.target === m || e.target.closest(".modal-x")) return close(); const d = e.target.closest("[data-j]"); if (d) { i = +d.dataset.j; paint(); } });
      document.addEventListener("keydown", key);
      history.replaceState(null, "", "#" + a.slug);
    };
    chips.addEventListener("click", (e) => { const b = e.target.closest(".chip"); if (!b) return; kind = b.dataset.k; chips.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c === b)); render(); });
    yrs.addEventListener("click", (e) => { const b = e.target.closest(".yr"); if (!b) return; year = year === +b.dataset.y ? null : +b.dataset.y; yrs.querySelectorAll(".yr").forEach((x) => x.setAttribute("aria-pressed", +x.dataset.y === year)); render(); });
    $("#aw-grid").addEventListener("click", (e) => { const b = e.target.closest(".aw.has-story"); if (b) open(list.find((a) => a.slug === b.dataset.slug)); });
    render();
    const h = decodeURIComponent(location.hash.slice(1)); const hit = list.find((a) => a.slug === h || a.slug.startsWith(h + "-")); if (hit && hit.photos) open(hit);
  }

  /* ================= STUDIO ================= */
  function studio() {
    const groups = [
      { id: "talks", label: "Science talks", sub: "Defense, conferences and papers", icon: "video", n: S.series.filter((s) => s.group === "talks").reduce((a, s) => a + s.videos.length, 0), unit: "videos" },
      { id: "courses", label: "Courses", sub: "Lectures and sessions", icon: "paper", n: S.series.filter((s) => s.group === "courses").reduce((a, s) => a + s.videos.length, 0), unit: "videos" },
      { id: "gallery", label: "Gallery", sub: "Academic trips and science heroes", icon: "award", n: S.albums.reduce((a, x) => a + x.photos.length, 0), unit: "photos" }
    ];
    const covers = { talks: "https://i.ytimg.com/vi/VXnhmwvI3oM/maxresdefault.jpg", courses: "https://i.ytimg.com/vi/yYFy0NK4XKE/maxresdefault.jpg", gallery: (S.albums[0]?.photos[0] || {}).src };
    $("#switch-cards").innerHTML = groups.map((g) => `<a class="sw-card" href="#${g.id}" data-g="${g.id}"><span class="sw-img">${covers[g.id] ? `<img src="${esc(covers[g.id])}" alt="" loading="lazy">` : ""}</span><span class="sw-txt"><span class="sw-n">${g.n} ${g.unit}</span><span class="sw-l">${g.label}</span><span class="sw-s">${g.sub}</span></span></a>`).join("");
    const seriesHTML = (grp) => S.series.filter((s) => s.group === grp).map((s) => `<div class="series"><div><h3>${esc(s.name)}</h3><p>${esc(s.text)}</p></div><div class="grid c2" style="grid-template-columns:repeat(auto-fill,minmax(min(100%,240px),1fr))">${s.videos.map(videoCard).join("")}</div></div>`).join("");
    $("#talks-series").innerHTML = seriesHTML("talks"); $("#courses-series").innerHTML = seriesHTML("courses");
    bindYT($("#talks-series")); bindYT($("#courses-series"));
    const yt = S.person.links.youtube; if (yt) { const a = $("#yt-channel"); a.href = yt; a.hidden = false; }

    // gallery: two tabs, academic trips and science heroes
    let tab = "trips", year = "all";
    const chips = $("#gal-chips"), grid = $("#albums"), view = $("#album-view");
    const years = [...new Set(S.albums.map((a) => a.year).filter(Boolean))].sort((a, b) => b - a);
    const heroes = S.heroes || [];
    chips.innerHTML = `<div class="gal-tabs" role="tablist"><button class="gal-tab" data-tab="trips" aria-selected="true">Academic trips <span class="count">${S.albums.length}</span></button><button class="gal-tab" data-tab="heroes" aria-selected="false">Science heroes <span class="count">${heroes.length}</span></button></div>
      <div class="chips gal-years">${[["all", "All years"], ...years.map((y) => [String(y), String(y)])].map(([k, l], i) => `<button class="chip" data-y="${k}" aria-pressed="${i === 0}">${l}</button>`).join("")}</div>`;
    const renderGrid = () => {
      chips.querySelector(".gal-years").hidden = tab !== "trips";
      if (tab === "heroes") {
        grid.className = "heroes-grid";
        grid.innerHTML = heroes.length ? heroes.map((h, i) => `<button class="hero-card" data-h="${i}"><span class="hero-img"><img src="${esc(h.src)}" alt="${esc(h.name)}" loading="lazy"></span><span class="hero-txt"><span class="hero-name">${esc(h.name)}</span>${h.note ? `<span class="hero-note">${esc(h.note)}</span>` : ""}</span></button>`).join("")
          : `<div class="heroes-empty"><span class="he-frames"><span></span><span></span><span></span></span><h3>Photos with science heroes</h3><p>This space is reserved for photos with the scientists who shaped how I think. Add each photo to <span class="mono">assets/photos/heroes/</span> and list it under <span class="mono">heroes</span> in <span class="mono">assets/js/data.js</span> with the scientist's name and where you met.</p></div>`;
        return;
      }
      grid.className = "grid c3 albums";
      grid.innerHTML = S.albums.filter((a) => year === "all" || String(a.year) === year).map((a) => {
        const first = a.photos.find((p) => p.src);
        const stack = a.photos.slice(1, 3).map((p) => `<img class="stack" src="${esc(p.src)}" alt="" loading="lazy">`).join("");
        return `<a class="card album" href="#${a.id}"><div class="cover">${first ? `<img src="${esc(first.src)}" alt="" loading="lazy">` : coverSVG(a.id, { alt: "" })}${stack}<span class="count">${a.photos.length} photo${a.photos.length === 1 ? "" : "s"}</span></div><div class="body"><div class="meta"><span>${esc([a.place, a.year].filter(Boolean).join(" · "))}</span></div><h3>${esc(a.title)}</h3></div></a>`;
      }).join("");
    };
    const openAlbum = (id) => {
      const a = S.albums.find((x) => x.id === id);
      if (!a) { view.hidden = true; grid.hidden = false; chips.hidden = false; return false; }
      grid.hidden = true; chips.hidden = true; view.hidden = false;
      view.innerHTML = `<div class="head"><div><a class="link-arrow" href="#gallery" id="back">← All albums</a><h2>${esc(a.title)}</h2><p class="muted">${esc([a.place, a.year].filter(Boolean).join(" · "))}</p></div></div>
        <div class="photo-grid">${a.photos.map((p, i) => `<button data-i="${i}" aria-label="Open photo ${i + 1}">${photoArt(p, a, i)}${p.caption ? `<figcaption>${esc(p.caption)}</figcaption>` : ""}</button>`).join("")}</div>`;
      view.querySelector(".photo-grid").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) lightbox(a, a.photos, +b.dataset.i); });
      $("#gallery").scrollIntoView();
      return true;
    };
    chips.addEventListener("click", (e) => {
      const t = e.target.closest(".gal-tab"); if (t) { tab = t.dataset.tab; chips.querySelectorAll(".gal-tab").forEach((x) => x.setAttribute("aria-selected", x === t)); renderGrid(); return; }
      const b = e.target.closest(".chip"); if (b) { year = b.dataset.y; chips.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c === b)); renderGrid(); }
    });
    grid.addEventListener("click", (e) => { const h = e.target.closest(".hero-card"); if (h) lightbox({ title: "Science heroes", id: "heroes" }, heroes.map((x) => ({ src: x.src, caption: [x.name, x.note].filter(Boolean).join(" · ") })), +h.dataset.h); });
    const route = () => { const h = location.hash.slice(1); if (h === "heroes") { tab = "heroes"; chips.querySelectorAll(".gal-tab").forEach((x) => x.setAttribute("aria-selected", x.dataset.tab === "heroes")); } if (!openAlbum(h)) { renderGrid(); if (["talks", "courses", "gallery", "heroes"].includes(h)) document.getElementById(h === "heroes" ? "gallery" : h)?.scrollIntoView(); } };
    window.addEventListener("hashchange", route);
    renderGrid(); route();
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
    if (!meta) { art.innerHTML = `<a class="back" href="perspectives.html">← All perspectives</a><h1>Essay not found</h1><p class="muted" style="margin-top:16px">Check the link, or browse all perspectives.</p>`; return; }
    document.title = `${meta.title} · ${S.person.name}`;
    art.innerHTML = `<a class="back" href="perspectives.html">← All perspectives</a><span class="eyebrow" style="display:flex;margin-top:28px">Essay</span><h1>${esc(meta.title)}</h1><div class="byline"><span>${esc(S.person.name)}</span><span>${fmtDate(meta.date)}</span>${sample(meta)}</div><div class="content" id="content"><p class="muted">Loading…</p></div>`;
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

  ({ home, research, teaching, mission, contact, journey, publications, perspectives, news, awards, post, studio }[page] || (() => {}))();
})();
