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
    if ($("#rs-title")) { $("#rs-title").textContent = R.title; $("#rs-lead").textContent = R.lead; $("#rs-body").textContent = R.body; }
    if ($("#rs-principles")) $("#rs-principles").innerHTML = R.principles.map((p) => `<li><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></li>`).join("");
  }
  function teachingBits() {
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
      vf.innerHTML = `<button class="yt" data-id="${esc(String(d.youtubeId).trim())}" data-title="PhD defense" aria-label="Play the full defense" style="height:100%">${ytThumb({ id: String(d.youtubeId).trim() })}<span class="play-disc">${ICON.play}</span></button>`;
      bindYT(vf);
    }
    $("#defense-cap").innerHTML = `<span>${esc(d.caption)}</span>`;
    const [t1, t2] = String(d.thesis).split(":");
    $("#thesis-title").innerHTML = t2 ? `<em>${esc(t1)}:</em>${esc(t2)}` : esc(d.thesis);
    $("#promotors").textContent = "Promotors: Dr. ir. M. Wiertlewski, Dr. ir. A. Sakes and Prof. dr. ir. P. Breedveld";
    $("#bio").innerHTML = S.bio.map((p) => `<p>${esc(p)}</p>`).join("");
    statement(); teachingBits(); vm();
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
    const pubImg = (p) => p.img || (p.video ? `https://i.ytimg.com/vi/${p.video}/hqdefault.jpg` : "");
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
      ["TU", "TU Delft", "PhD 2020–2026 · Postdoc, BITE group"],
      ["PR", "Philips Research", "Research intern, Cambridge MA, 2019 and 2020"],
      ["WPI", "Worcester Polytechnic Institute", "MSc Robotics Engineering, Fulbright Scholar"],
      ["F", "Fulbright", "Foreign Student Program, 2018"],
      ["CU", "Cairo University", "BSc Mechanical Design and Production"],
      ["SH", "University of Sheffield", "Tribology collaboration on catheter friction"],
      ["MM", "Mijzan Mechanical", "Founder, engineering consultancy, 2025–"]
    ];
    $("#badges").innerHTML = AFF.map(([m, n, r], i) => `<button class="badge" type="button" style="--i:${i}" aria-label="${esc(n)}: ${esc(r)}"><span class="b-in"><span class="b-front"><span class="mono-mark">${m}</span><span class="b-name">${esc(n)}</span></span><span class="b-back">${esc(r)}</span></span></button>`).join("");
    $("#badges").addEventListener("click", (e) => { const b = e.target.closest(".badge"); if (b) b.classList.toggle("flipped"); });
  }

  /* ================= RESEARCH ================= */
  function research() {
    statement();
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

  /* ================= MISSION ================= */
  function mission() {
    const M = S.mission;
    vm();
    $("#manifesto").innerHTML = M.statement;
    $("#story").textContent = M.story;
    $("#pillars").innerHTML = M.pillars.map((p) => `<div class="pillar"><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></div>`).join("");
    $("#initiatives").innerHTML = M.initiatives.map((i) => `<div class="initiative"><span class="y">${esc(i.when)}</span><div><h3>${esc(i.title)} ${sample(i)}</h3><p>${esc(i.text)}</p><div class="tags">${i.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}${i.url ? `<a class="tag-link" href="${esc(i.url)}" ${/^https?:/.test(i.url) ? 'target="_blank" rel="noopener"' : ""}>${/linkedin/.test(i.url) ? "Read the post ↗" : "Read the notes →"}</a>` : ""}</div></div></div>`).join("");
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
    $("#talks").innerHTML = S.talks.map((t) => `<li><span class="y">${t.year}</span><div>${esc(t.title)}<div class="sub">${esc(t.kind)} · ${esc(t.venue)}</div></div></li>`).join("");
    $("#service").innerHTML = S.service.map((t) => `<li><span class="y">—</span><div>${esc(t)}</div></li>`).join("");
    $("#cv-link").href = S.person.cv;
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
      : p.video ? `<img src="https://i.ytimg.com/vi/${esc(p.video)}/hqdefault.jpg" alt="" loading="lazy">`
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
        <p class="aw-links">${a.pub ? `<a href="publications.html#${a.pub}">The paper →</a>` : ""}${a.url ? `<a href="${esc(a.url)}" target="_blank" rel="noopener">The LinkedIn post ↗</a>` : ""}</p></div></div>`; };
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
      { id: "gallery", label: "Gallery", sub: "Photos from the road", icon: "award", n: S.albums.reduce((a, x) => a + x.photos.length, 0), unit: "photos" }
    ];
    const covers = { talks: "https://i.ytimg.com/vi/VXnhmwvI3oM/hqdefault.jpg", courses: "https://i.ytimg.com/vi/yYFy0NK4XKE/hqdefault.jpg", gallery: (S.albums[0]?.photos[0] || {}).src };
    $("#switch-cards").innerHTML = groups.map((g) => `<a class="sw-card" href="#${g.id}" data-g="${g.id}"><span class="sw-img">${covers[g.id] ? `<img src="${esc(covers[g.id])}" alt="" loading="lazy">` : ""}</span><span class="sw-txt"><span class="sw-n">${g.n} ${g.unit}</span><span class="sw-l">${g.label}</span><span class="sw-s">${g.sub}</span></span></a>`).join("");
    const seriesHTML = (grp) => S.series.filter((s) => s.group === grp).map((s) => `<div class="series"><div><h3>${esc(s.name)}</h3><p>${esc(s.text)}</p></div><div class="grid c2" style="grid-template-columns:repeat(auto-fill,minmax(min(100%,240px),1fr))">${s.videos.map(videoCard).join("")}</div></div>`).join("");
    $("#talks-series").innerHTML = seriesHTML("talks"); $("#courses-series").innerHTML = seriesHTML("courses");
    bindYT($("#talks-series")); bindYT($("#courses-series"));
    const yt = S.person.links.youtube; if (yt) { const a = $("#yt-channel"); a.href = yt; a.hidden = false; }

    // gallery
    let kind = "all";
    const chips = $("#gal-chips"), grid = $("#albums"), view = $("#album-view");
    const years = [...new Set(S.albums.map((a) => a.year).filter(Boolean))].sort((a, b) => b - a);
    chips.innerHTML = [["all", "All albums"], ...years.map((y) => [String(y), String(y)]), ["heroes", "People of science"]].map(([k, l], i) => `<button class="chip" data-k="${k}" aria-pressed="${i === 0}">${l}</button>`).join("");
    const renderGrid = () => {
      grid.innerHTML = S.albums.filter((a) => kind === "all" || (kind === "heroes" ? a.kind === "heroes" : String(a.year) === kind)).map((a) => {
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
    chips.addEventListener("click", (e) => { const b = e.target.closest(".chip"); if (!b) return; kind = b.dataset.k; chips.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c === b)); renderGrid(); });
    const route = () => { const h = location.hash.slice(1); if (!openAlbum(h)) { renderGrid(); if (["talks", "courses", "gallery"].includes(h)) document.getElementById(h)?.scrollIntoView(); } };
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

  ({ home, research, teaching, mission, journey, publications, perspectives, news, awards, post, studio }[page] || (() => {}))();
})();
