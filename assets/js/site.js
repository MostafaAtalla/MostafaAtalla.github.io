/* Shared layout, theme, command palette, helpers. */
(function () {
  const S = window.SITE;
  const page = document.body.dataset.page || "home";

  const NAV = [
    { id: "research", href: "research.html", label: "Research", desc: "Statement, themes, friction lab" },
    { id: "teaching", href: "teaching.html", label: "Teaching & Mentoring", desc: "Philosophy, courses, supervision" },
    { id: "mission", href: "mission.html", label: "Vision & Mission", desc: "Vision, mission, initiatives for junior researchers" },
    { id: "journey", href: "journey.html", label: "Journey", desc: "Timeline, talks, service, CV" },
    { id: "publications", href: "publications.html", label: "Publications", desc: "Papers, patents, dissertation" },
    { id: "perspectives", href: "perspectives.html", label: "Perspectives", desc: "Opinion pieces and essays" },
    { id: "studio", href: "studio.html", label: "Studio", desc: "Science talks, courses, gallery" },
    { id: "awards", href: "awards.html", label: "Awards", desc: "Awards, grants, scholarships" },
    { id: "news", href: "news.html", label: "News", desc: "Papers, talks, workshops, press" }
  ];
  const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];

  /* ---------- helpers ---------- */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const hash = (str) => { let h = 2166136261; for (const c of String(str)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = (seed) => () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

  /* Generative "score" cover: interfering waveforms seeded by a string. */
  function coverSVG(seed, opts = {}) {
    const r = rng(hash(seed));
    const w = opts.w || 640, h = opts.h || 360;
    const palettes = [
      ["#15171E", "#D9A84A", "#62B4D1"], ["#1C2A33", "#E7C27A", "#9FD3E6"],
      ["#231A14", "#D9A84A", "#E9D6B0"], ["#101820", "#62B4D1", "#ECE8DF"],
      ["#1E1A26", "#C99A5B", "#8FB8C9"]
    ];
    const [bg, a, b] = palettes[Math.floor(r() * palettes.length)];
    const lines = 7 + Math.floor(r() * 7);
    const f1 = 1 + r() * 3, f2 = 4 + r() * 10, ph = r() * 6.28;
    let paths = "";
    for (let i = 0; i < lines; i++) {
      const y0 = h * (0.18 + 0.64 * (i / (lines - 1)));
      const amp = (8 + r() * 26) * Math.sin(Math.PI * (i + 1) / (lines + 1));
      let d = "";
      for (let x = 0; x <= w; x += 8) {
        const t = x / w;
        const env = Math.sin(Math.PI * t);
        const y = y0 + amp * env * Math.sin(2 * Math.PI * f1 * t + ph + i * 0.4) * Math.cos(2 * Math.PI * f2 * t * 0.25 + i);
        d += (x ? "L" : "M") + x + " " + y.toFixed(1);
      }
      const col = i % 3 === 0 ? a : b;
      paths += `<path d="${d}" fill="none" stroke="${col}" stroke-opacity="${(0.35 + r() * 0.5).toFixed(2)}" stroke-width="${(0.8 + r() * 1.4).toFixed(2)}"/>`;
    }
    const cx = w * (0.2 + r() * 0.6), cy = h * (0.3 + r() * 0.4);
    const label = opts.label ? `<text x="24" y="${h - 26}" fill="#ECE8DF" font-family="Roboto Serif, Georgia, serif" font-size="${opts.labelSize || 30}" font-style="italic">${esc(opts.label)}</text>` : "";
    const sub = opts.sub ? `<text x="24" y="${h - 26 - (opts.labelSize || 30) - 6}" fill="${a}" font-family="Roboto Mono, monospace" font-size="13" letter-spacing="2">${esc(String(opts.sub).toUpperCase())}</text>` : "";
    return `<svg class="${opts.cls || ""}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(opts.alt || "Decorative waveform")}">
      <rect width="${w}" height="${h}" fill="${bg}"/>
      <circle cx="${cx}" cy="${cy}" r="${h * 0.5}" fill="${a}" fill-opacity="0.06"/>
      ${paths}${sub}${label}</svg>`;
  }

  const ICON = {
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m15 5-7 7 7 7"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m9 5 7 7-7 7"/></svg>',
    /* Brand icons: Font Awesome Free 6.5.2 (CC BY 4.0, fontawesome.com/license/free) */
    linkedin: '<svg viewBox="0 0 448 512" fill="currentColor" aria-hidden="true"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/></svg>',
    youtube: '<svg viewBox="0 0 576 512" fill="currentColor" aria-hidden="true"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg>',
    gscholar: '<svg viewBox="0 0 512 512" fill="currentColor" aria-hidden="true"><path d="M390.9 298.5c0 0 0 .1 .1 .1c9.2 19.4 14.4 41.1 14.4 64C405.3 445.1 338.5 512 256 512s-149.3-66.9-149.3-149.3c0-22.9 5.2-44.6 14.4-64h0c1.7-3.6 3.6-7.2 5.6-10.7c4.4-7.6 9.4-14.7 15-21.3c27.4-32.6 68.5-53.3 114.4-53.3c33.6 0 64.6 11.1 89.6 29.9c9.1 6.9 17.4 14.7 24.8 23.5c5.6 6.6 10.6 13.8 15 21.3c2 3.4 3.8 7 5.5 10.5zm26.4-18.8c-30.1-58.4-91-98.4-161.3-98.4s-131.2 40-161.3 98.4L0 202.7 256 0 512 202.7l-94.7 77.1z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
    video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="M10 9.2v5.6l5-2.8z" fill="currentColor" stroke="none"/></svg>',
    network: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10.5V17M8 7.2v.1M12 17v-3.6c0-1.7 1.1-2.9 2.6-2.9S17 11.7 17 13.4V17M12 10.5V17"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    scholar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/></svg>',
    // Monogram: a baton crossing five staff lines
    mark: '<svg viewBox="0 0 96 96" fill="none" aria-hidden="true"><ellipse cx="38" cy="56" rx="14" ry="10" transform="rotate(-20 38 56)" fill="currentColor"/><path d="M51 52V14c9 6 19 6 25 14" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 78c6-4.5 12 4.5 18 0s12-4.5 18 0 12 4.5 18 0 12-4.5 18 0" stroke="var(--film, #0F7C78)" stroke-width="5.5" stroke-linecap="round"/></svg>'
  };

  const staffSVG = '<svg class="staff" viewBox="0 0 520 120" fill="none" stroke="currentColor" aria-hidden="true"><path d="M0 20h520M0 40h520M0 60h520M0 80h520M0 100h520"/><path d="M0 60 C 80 10, 160 110, 240 60 S 400 10, 520 60" stroke-width="1.5" stroke="var(--m-light)" opacity=".7"/></svg>';

  function toast(msg) {
    const t = document.createElement("div");
    t.className = "toast"; t.role = "status"; t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), 2200);
  }
  async function copy(text, label = "Copied") {
    try { await navigator.clipboard.writeText(text); toast(label); }
    catch { const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); toast(label); } catch { toast("Select and copy manually"); } ta.remove(); }
  }
  const fmtDate = (d) => { const x = new Date(d + "T00:00:00"); return isNaN(x) ? "" : x.toLocaleDateString("en-GB", { month: "short", year: "numeric" }); };

  window.UI = { esc, hash, rng, coverSVG, ICON, staffSVG, toast, copy, fmtDate, NAV, ROMAN };

  /* ---------- theme ---------- */
  const root = document.documentElement;
  const getStored = () => { try { return localStorage.getItem("theme"); } catch { return null; } };
  const setStored = (v) => { try { localStorage.setItem("theme", v); } catch {} };
  const stored = getStored();
  if (stored) root.dataset.theme = stored;
  const isDark = () => root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;

  /* ---------- header ---------- */
  const header = document.getElementById("site-header");
  if (header) {
    header.className = "site-header";
    header.innerHTML = `
      <div class="wrap">
        <a class="brand" href="index.html" aria-label="${esc(S.person.name)}, home">
          <span class="brand-mark">${ICON.mark}</span>
          <span class="brand-text"><span class="brand-name">${esc(S.person.name)}</span><span class="brand-tag">The Art of Science</span></span>
        </a>
        <nav class="nav" id="nav" aria-label="Main">
          ${NAV.map((n) => `<a href="${n.href}" ${n.id === page || (page === "post" && n.id === "perspectives") ? 'aria-current="page"' : ""}>${esc(n.label)}</a>`).join("")}
          <div class="nav-tools"><button type="button" id="m-search">${ICON.search}<span>Search</span></button><button type="button" id="m-theme"><span class="mt-ico"></span><span>Light / dark</span></button></div>
        </nav>
        <div class="tools">
          <a class="contact-btn" href="contact.html" ${page === "contact" ? 'aria-current="page"' : ""}>${ICON.mail}<span>Contact</span></a>
          <button class="icon-btn" id="palette-btn" aria-label="Search the site (Ctrl+K)" title="Search (Ctrl+K)">${ICON.search}</button>
          <button class="icon-btn" id="theme-btn" aria-label="Toggle dark mode"></button>
          <button class="icon-btn menu-btn" id="menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="nav">${ICON.menu}</button>
        </div>
      </div>`;
    const themeBtn = document.getElementById("theme-btn");
    const paintTheme = () => { themeBtn.innerHTML = isDark() ? ICON.sun : ICON.moon; };
    paintTheme();
    themeBtn.addEventListener("click", () => { const next = isDark() ? "light" : "dark"; root.dataset.theme = next; setStored(next); paintTheme(); document.dispatchEvent(new CustomEvent("themechange")); });
    matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => { paintTheme(); document.dispatchEvent(new CustomEvent("themechange")); });

    const menuBtn = document.getElementById("menu-btn"), nav = document.getElementById("nav");
    menuBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      header.classList.toggle("menu-open", open);
      menuBtn.setAttribute("aria-expanded", open); menuBtn.innerHTML = open ? ICON.close : ICON.menu;
      document.body.style.overflow = open ? "hidden" : "";
    });
    document.getElementById("palette-btn").addEventListener("click", openPalette);
    const closeMenu = () => { nav.classList.remove("open"); header.classList.remove("menu-open"); menuBtn.setAttribute("aria-expanded", false); menuBtn.innerHTML = ICON.menu; document.body.style.overflow = ""; };
    document.getElementById("m-search").addEventListener("click", () => { closeMenu(); openPalette(); });
    document.getElementById("m-theme").addEventListener("click", () => themeBtn.click());
    // Collapse to the menu button whenever the links do not fit next to the name and tools.
    const brand = header.querySelector(".brand"), tools = header.querySelector(".tools");
    const fit = () => {
      if (nav.classList.contains("open")) return;
      header.classList.remove("collapsed");
      const b = brand.getBoundingClientRect(), n = nav.getBoundingClientRect(), t = tools.getBoundingClientRect();
      const overflow = nav.scrollWidth > nav.clientWidth + 1 || n.left < b.right + 16 || n.right > t.left - 8;
      header.classList.toggle("collapsed", overflow);
    };
    fit();
    window.addEventListener("resize", fit);
    document.fonts?.ready.then(fit);
    window.addEventListener("load", fit);
  }

  /* ---------- contact links (footer and contact page) ---------- */
  function socialLinks(big) {
    const L = S.person.links, items = [
      { k: "email", href: "mailto:" + S.person.email, label: "Email", sub: S.person.email, icon: ICON.mail },
      { k: "linkedin", href: L.linkedin, label: "LinkedIn", sub: "mostafa-atalla193", icon: ICON.linkedin, ext: true },
      { k: "youtube", href: L.youtube, label: "YouTube", sub: "@mostafaaatalla", icon: ICON.youtube, ext: true },
      { k: "scholar", href: L.scholar, label: "Google Scholar", sub: "Publications and citations", icon: ICON.gscholar, ext: true },
      { k: "cv", href: S.person.cv, label: "CV", sub: "Download PDF", icon: ICON.doc, ext: true }
    ].filter((x) => x.href);
    return items.map((x) => big
      ? `<a class="contact-card c-${x.k}" href="${esc(x.href)}" ${x.ext ? 'target="_blank" rel="noopener"' : ""}><span class="cc-ico">${x.icon}</span><span class="cc-txt"><span class="cc-l">${x.label}</span><span class="cc-s">${esc(x.sub)}</span></span><span class="cc-go">${x.ext ? "↗" : "→"}</span></a>`
      : `<a class="soc c-${x.k}" href="${esc(x.href)}" ${x.ext ? 'target="_blank" rel="noopener"' : ""} aria-label="${x.label}" title="${x.label}">${x.icon}<span>${x.label}</span></a>`).join("");
  }
  window.UI.socialLinks = socialLinks;

  /* ---------- footer ---------- */
  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="wrap">
        <div class="footer-top">
          <div class="footer-id">
            <p class="footer-quote">“${esc(S.quote.text)}.”</p>
            <p class="small muted" style="margin-top:12px">${esc(S.person.name)} · ${esc(S.person.role)}, ${esc(S.person.affiliation)}</p>
          </div>
          <div class="footer-contact">
            <h4>Get in touch</h4>
            <div class="social">${socialLinks()}</div>
            <p class="copy-line"><span>${esc(S.person.email)}</span><button type="button" data-copy="${esc(S.person.email)}">Copy</button></p>
            <p class="small muted">${ICON.pin.replace("<svg", '<svg class="inl"')} ${esc(S.person.location)}</p>
          </div>
        </div>
        <nav class="footer-nav" aria-label="Explore"><h4>Explore</h4><ul>${[{ href: "index.html", label: "Home" }, ...NAV, { href: "contact.html", label: "Contact" }].map((n) => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join("")}</ul></nav>
        <div class="footer-base"><span>© ${new Date().getFullYear()} ${esc(S.person.name)}</span><span>Press <span class="kbd-hint">Ctrl K</span> to search the site</span></div>
      </div>`;
    footer.querySelector("[data-copy]").addEventListener("click", (e) => copy(e.currentTarget.dataset.copy, "Email copied"));
  }

  /* ---------- command palette ---------- */
  function paletteItems() {
    const items = [{ t: "Home", k: "Page", href: "index.html", s: "overture quote defense" }, ...NAV.map((n) => ({ t: n.label, k: "Page", href: n.href, s: n.desc }))];
    S.publications.forEach((p) => items.push({ t: p.title, k: p.type, href: `publications.html#${p.id}`, s: p.authors + " " + p.venue + " " + (p.hl || "") }));
    S.posts.forEach((p) => items.push({ t: p.title, k: p.cat === "perspective" || p.type === "essay" ? "perspective" : "news", href: p.type === "essay" ? `post.html?p=${p.slug}` : (p.cat === "perspective" ? "perspectives.html" : "news.html"), s: p.summary }));
    S.awards.forEach((a) => items.push({ t: a.title, k: "award", href: "awards.html", s: a.org + " " + a.year }));
    S.albums.forEach((a) => items.push({ t: a.title, k: "album", href: `studio.html#${a.id}`, s: a.place }));
    S.series.forEach((sr) => sr.videos.forEach((v) => items.push({ t: v.title, k: "video", href: sr.group === "courses" ? "studio.html#courses" : "studio.html#talks", s: sr.name })));
    items.push({ t: "Friction lab", k: "interactive", href: "research.html#lab", s: "stick slip ultrasonic lubrication toy" });
    items.push({ t: "Doors that opened for me", k: "grants", href: "mission.html#doors", s: "fulbright grants scholarships junior researchers" });
    items.push({ t: "Download CV", k: "file", href: S.person.cv, s: "pdf resume" });
    items.push({ t: "Contact", k: "Page", href: "contact.html", s: "email linkedin youtube get in touch" });
    return items;
  }

  let paletteEl = null;
  function openPalette() {
    if (paletteEl) return;
    const items = paletteItems();
    paletteEl = document.createElement("div");
    paletteEl.className = "palette-backdrop";
    paletteEl.innerHTML = `<div class="palette" role="dialog" aria-modal="true" aria-label="Search the site">
      <input id="palette-input" type="text" placeholder="Search pages, papers, posts, albums…" autocomplete="off" aria-controls="palette-list">
      <ul id="palette-list" role="listbox"></ul>
      <div class="hint">↑ ↓ to move · Enter to open · Esc to close</div></div>`;
    document.body.appendChild(paletteEl);
    const input = paletteEl.querySelector("input"), list = paletteEl.querySelector("ul");
    let sel = 0, shown = [];
    const render = () => {
      const q = input.value.trim().toLowerCase();
      shown = (q ? items.filter((i) => (i.t + " " + i.s + " " + i.k).toLowerCase().includes(q)) : items.slice(0, NAV.length + 3)).slice(0, 12);
      sel = Math.min(sel, Math.max(shown.length - 1, 0));
      list.innerHTML = shown.length ? shown.map((i, n) => `<li><a href="${esc(i.href)}" role="option" aria-selected="${n === sel}"><span>${esc(i.t)}</span><span class="k">${esc(i.k)}</span></a></li>`).join("") : `<li class="small muted" style="padding:12px">Nothing found.</li>`;
    };
    render(); input.focus();
    input.addEventListener("input", () => { sel = 0; render(); });
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { sel = Math.min(sel + 1, shown.length - 1); render(); e.preventDefault(); }
      if (e.key === "ArrowUp") { sel = Math.max(sel - 1, 0); render(); e.preventDefault(); }
      if (e.key === "Enter" && shown[sel]) { location.href = shown[sel].href; closePalette(); }
    });
    paletteEl.addEventListener("click", (e) => { if (e.target === paletteEl) closePalette(); });
  }
  function closePalette() { paletteEl?.remove(); paletteEl = null; }
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); paletteEl ? closePalette() : openPalette(); }
    else if (e.key === "/" && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); openPalette(); }
    else if (e.key === "Escape") closePalette();
  });

  /* ---------- maestro mode (type the word "maestro" anywhere) ---------- */
  let typed = "";
  document.addEventListener("keydown", (e) => {
    if (/input|textarea/i.test(document.activeElement.tagName) || e.key.length !== 1) return;
    typed = (typed + e.key.toLowerCase()).slice(-7);
    if (typed === "maestro") {
      typed = "";
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) { toast("Bravo, maestro."); return; }
      const glyphs = ["♩", "♪", "♫", "♬", "𝄞", "∂", "μ", "∇", "λ"];
      for (let i = 0; i < 46; i++) {
        const n = document.createElement("span");
        n.className = "note-fall"; n.textContent = glyphs[i % glyphs.length];
        n.style.left = Math.random() * 100 + "vw";
        n.style.animationDuration = 2.4 + Math.random() * 2.6 + "s";
        n.style.animationDelay = Math.random() * 1.2 + "s";
        n.style.setProperty("--r", (Math.random() * 120 - 60) + "deg");
        n.style.fontSize = 18 + Math.random() * 26 + "px";
        document.body.appendChild(n); setTimeout(() => n.remove(), 6500);
      }
      toast("Bravo, maestro.");
    }
  });

  /* page-head staff ornament */
  document.querySelectorAll(".page-head").forEach((h) => h.insertAdjacentHTML("beforeend", staffSVG));

  /* ---------- section navigator: every page lists its own sections ---------- */
  function buildSectionNav() {
    // sections, plus any inner block that names itself with data-nav (publication years, video series)
    const sections = [...document.querySelectorAll("main > section, main [data-nav]")].filter((sec) => sec.offsetHeight > 0)
      .filter((sec) => sec.dataset.nav || sec.querySelector(".sec-name, .block-head h2") || !sec.querySelector("[data-nav]"));
    if (sections.length < 3) return;
    const items = sections.map((sec, i) => {
      const label = sec.dataset.nav || sec.querySelector(".sec-name, .block-head h2, h2, h1")?.textContent.trim() || `Section ${i + 1}`;
      if (!sec.id) sec.id = "s-" + label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
      return { id: sec.id, label: label.length > 34 ? label.slice(0, 32) + "…" : label, sec };
    });
    const nav = document.createElement("nav");
    nav.className = "sidenav"; nav.setAttribute("aria-label", "Sections on this page");
    nav.innerHTML = `<button class="sidenav-toggle" type="button" aria-expanded="false" aria-controls="sidenav-list"><span aria-hidden="true">§</span> Sections</button>
      <p class="sidenav-title">On this page</p>
      <ol id="sidenav-list">${items.map((it) => `<li><a href="#${it.id}" data-id="${it.id}"><span class="dot" aria-hidden="true"></span><span class="lbl">${esc(it.label)}</span></a></li>`).join("")}</ol>`;
    document.body.appendChild(nav);
    const toggle = nav.querySelector(".sidenav-toggle");
    toggle.addEventListener("click", () => { const open = nav.classList.toggle("open"); toggle.setAttribute("aria-expanded", open); });
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); } });
    const links = Object.fromEntries([...nav.querySelectorAll("a")].map((a) => [a.dataset.id, a]));
    const setActive = (id) => Object.entries(links).forEach(([k, a]) => a.toggleAttribute("aria-current", k === id));
    setActive(items[0].id);
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) setActive(en.target.id); }), { rootMargin: "-40% 0px -55% 0px" });
      items.forEach((it) => io.observe(it.sec));
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(buildSectionNav, 0));
  else setTimeout(buildSectionNav, 0);
})();
