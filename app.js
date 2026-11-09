/* Gardens by the Bay — Bay South Explorer */
(function () {
  "use strict";
  const { places, categories } = window.GBTB;
  const $ = (s) => document.querySelector(s);
  const byId = (id) => places.find((p) => p.id === id);
  const MAP_AR = 741 / 505;

  const state = {
    filter: "all", query: "", selected: null,
    plan: [], tour: false, tourIdx: 0,
    sound: localStorage.getItem("gbtb-sound") !== "off",
    scale: 1, tx: 0, ty: 0
  };

  /* ---------- icons ---------- */
  const ICONS = {
    spark: '<path d="M12 2.5l2.1 7.4 7.4 2.1-7.4 2.1L12 21.5l-2.1-7.4-7.4-2.1 7.4-2.1z" fill="currentColor"/>',
    leaf: '<path d="M6 18C6 9.5 12 5 19.5 5c0 8-4.5 13-13.5 13z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M6 18c3-5 6.5-8.5 11-10.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    bowl: '<path d="M4 12.5h16c0 4.4-3.6 7.5-8 7.5s-8-3.1-8-7.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8.5 9c0-2 2-2.2 2-4.5M13.5 9c0-2 2-2.2 2-4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    info: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 11v5.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="7.4" r="1.3" fill="currentColor"/>',
    clock: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3.5 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    ticket: '<rect x="3" y="7" width="18" height="10" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M14 7.5v9" stroke="currentColor" stroke-width="1.6" stroke-dasharray="2.4 2.6"/>',
    plus: '<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
    check: '<path d="M4.5 12.5l5 5L19.5 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10.5 5h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="18" r="1.1" fill="currentColor"/>',
    target: '<circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/>',
    up: '<path d="M6 14l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
    down: '<path d="M6 10l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
    trash: '<path d="M4.5 7h15M9.5 7V5h5v2M6.5 7l1 13h9l1-13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    pin: '<path d="M12 21.5C7.5 17 5 13.6 5 10a7 7 0 0114 0c0 3.6-2.5 7-7 11.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.4" fill="currentColor"/>'
  };
  const icon = (name, size = 16) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true">${ICONS[name] || ICONS.spark}</svg>`;

  /* ---------- toast ---------- */
  const toastEl = $("#toast");
  let toastTimer = null;
  function toast(msg, action) {
    clearTimeout(toastTimer);
    toastEl.innerHTML = `<span>${msg}</span>` + (action ? `<button type="button">${action.label}</button>` : "");
    if (action) toastEl.querySelector("button").addEventListener("click", () => { action.fn(); hideToast(); });
    toastEl.classList.add("show");
    toastTimer = setTimeout(hideToast, 3600);
  }
  function hideToast() { toastEl.classList.remove("show"); }

  /* ---------- chips & legend ---------- */
  const chipsEl = $("#chips");
  function buildChips() {
    const mk = (key, label, color) => {
      const b = document.createElement("button");
      b.className = "chip" + (state.filter === key ? " active" : "");
      b.style.setProperty("--c", color);
      b.dataset.filter = key;
      b.innerHTML = `<span class="dot"></span>${label}`;
      b.addEventListener("click", () => { state.filter = key; applyFilter(); });
      chipsEl.appendChild(b);
    };
    mk("all", "All places", "#f5efe3");
    Object.entries(categories).forEach(([k, c]) => mk(k, c.label, c.color));
  }
  function buildLegend() {
    $("#mapLegend").innerHTML = Object.values(categories)
      .map((c) => `<span style="--c:${c.color}"><span class="dot"></span>${c.label}</span>`).join("");
  }

  /* ---------- pins ---------- */
  const pinsEl = $("#pins");
  const pinEls = {};
  function buildPins() {
    places.forEach((p, i) => {
      const b = document.createElement("button");
      b.className = "pin" + (p.cat === "attraction" ? " major" : "");
      b.style.left = p.x + "%";
      b.style.top = p.y + "%";
      b.style.setProperty("--c", categories[p.cat].color);
      b.style.setProperty("--pd", (i * 0.19) + "s");
      b.setAttribute("aria-label", "Explore " + p.name);
      b.innerHTML = icon(categories[p.cat].icon, 15) + `<span class="pin-label">${p.name}</span>`;
      b.addEventListener("click", () => { stopTour(); selectPlace(p.id, { center: true }); });
      pinsEl.appendChild(b);
      pinEls[p.id] = b;
    });
  }

  /* ---------- cards ---------- */
  const gridEl = $("#cardsGrid");
  const cardEls = {};
  function artHTML(p, big) {
    return `<div class="card-art" style="--c:${categories[p.cat].color}">${icon(categories[p.cat].icon, big ? 84 : 64)}</div>`;
  }
  function buildCards() {
    places.forEach((p) => {
      const c = categories[p.cat];
      const el = document.createElement("article");
      el.className = "card";
      el.style.setProperty("--c", c.color);
      el.tabIndex = 0;
      el.setAttribute("aria-label", p.name);
      el.innerHTML = `
        <div class="card-media">
          ${p.img ? `<img src="${p.img}" alt="${p.name}" loading="lazy">` : artHTML(p)}
          <span class="card-cat" style="--c:${c.color}">${c.label}</span>
          ${p.free && p.cat !== "essential" ? '<span class="card-free">Free</span>' : ""}
        </div>
        <div class="card-body">
          <h3>${p.name}</h3>
          <p class="card-tag">${p.tagline}</p>
          <div class="card-meta"><span>${icon("clock", 13)}${p.duration}</span><span>${icon("ticket", 13)}${p.cost}</span></div>
          <div class="card-actions">
            <button class="ghost-btn" type="button">Details</button>
            <button class="add-btn" type="button" data-add="${p.id}" aria-label="Add ${p.name} to visit plan" aria-pressed="false">${icon("plus", 17)}</button>
          </div>
        </div>`;
      el.addEventListener("click", (e) => {
        if (e.target.closest("[data-add]")) return;
        stopTour(); selectPlace(p.id);
      });
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.target.closest("[data-add]")) { stopTour(); selectPlace(p.id); }
      });
      el.querySelector("[data-add]").addEventListener("click", () => togglePlan(p.id));
      gridEl.appendChild(el);
      cardEls[p.id] = el;
    });
    const empty = document.createElement("div");
    empty.className = "plan-empty";
    empty.id = "gridEmpty";
    empty.style.gridColumn = "1 / -1";
    empty.hidden = true;
    empty.innerHTML = `<h3>Nothing in bloom here</h3><p>No places match your search — try “waterfall”, “satay” or “supertree”.</p>`;
    gridEl.appendChild(empty);
  }

  /* ---------- filtering ---------- */
  function visiblePlaces() {
    const q = state.query.trim().toLowerCase();
    return places.filter((p) => {
      const okCat = state.filter === "all" || p.cat === state.filter;
      const okQ = !q || (p.name + " " + p.tagline + " " + p.keywords).toLowerCase().includes(q);
      return okCat && okQ;
    });
  }
  function applyFilter() {
    const vis = new Set(visiblePlaces().map((p) => p.id));
    places.forEach((p) => {
      pinEls[p.id].classList.toggle("dimmed", !vis.has(p.id));
      cardEls[p.id].style.display = vis.has(p.id) ? "" : "none";
    });
    chipsEl.querySelectorAll(".chip").forEach((ch) => ch.classList.toggle("active", ch.dataset.filter === state.filter));
    $("#gridCount").textContent = `${vis.size} of ${places.length} places`;
    $("#gridEmpty").hidden = vis.size > 0;
  }

  /* ---------- map engine ---------- */
  const viewport = $("#mapViewport"), canvas = $("#mapCanvas");
  let vw = 0, vh = 0, cw = 0, ch = 0;
  function sizeMap() {
    vw = viewport.clientWidth; vh = viewport.clientHeight;
    cw = Math.max(vw, vh * MAP_AR); ch = cw / MAP_AR;
    canvas.style.width = cw + "px";
    canvas.style.height = ch + "px";
    clampPan(); applyTransform(false);
  }
  function clampPan() {
    const s = state.scale;
    state.tx = Math.min(0, Math.max(vw - cw * s, state.tx));
    state.ty = Math.min(0, Math.max(vh - ch * s, state.ty));
  }
  function applyTransform(anim) {
    canvas.classList.toggle("anim", !!anim);
    canvas.style.transform = `translate(${state.tx}px, ${state.ty}px) scale(${state.scale})`;
    canvas.style.setProperty("--inv", 1 / state.scale);
  }
  function zoomAt(cx, cy, factor, anim) {
    const s0 = state.scale, s1 = Math.min(4, Math.max(1, s0 * factor));
    if (s1 === s0) return;
    const wx = (cx - state.tx) / s0, wy = (cy - state.ty) / s0;
    state.tx = cx - wx * s1; state.ty = cy - wy * s1; state.scale = s1;
    clampPan(); applyTransform(anim);
  }
  function centerOn(p) {
    state.scale = Math.min(4, Math.max(state.scale, 2.1));
    const px = (p.x / 100) * cw, py = (p.y / 100) * ch;
    const shift = $("#drawer").classList.contains("open") && window.innerWidth > 720 ? 130 : 0;
    state.tx = vw / 2 - shift - px * state.scale;
    state.ty = vh / 2 - py * state.scale;
    clampPan(); applyTransform(true);
  }
  function resetMap() {
    state.scale = 1;
    state.tx = (vw - cw) / 2; state.ty = (vh - ch) / 2;
    clampPan(); applyTransform(true);
  }
  function hideHint() { $("#mapHint").classList.add("hide"); }

  const pointers = new Map();
  let lastDist = 0;
  viewport.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".pin")) return;
    viewport.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    viewport.classList.add("grabbing");
    hideHint();
  });
  viewport.addEventListener("pointermove", (e) => {
    if (!pointers.has(e.pointerId)) return;
    const prev = pointers.get(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) {
      state.tx += e.clientX - prev.x; state.ty += e.clientY - prev.y;
      clampPan(); applyTransform(false);
    } else if (pointers.size === 2) {
      const pts = [...pointers.values()];
      const d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const r = viewport.getBoundingClientRect();
      const mx = (pts[0].x + pts[1].x) / 2 - r.left, my = (pts[0].y + pts[1].y) / 2 - r.top;
      if (lastDist > 0) zoomAt(mx, my, d / lastDist, false);
      lastDist = d;
    }
  });
  const endPointer = (e) => { pointers.delete(e.pointerId); lastDist = 0; if (!pointers.size) viewport.classList.remove("grabbing"); };
  viewport.addEventListener("pointerup", endPointer);
  viewport.addEventListener("pointercancel", endPointer);
  viewport.addEventListener("wheel", (e) => {
    e.preventDefault(); hideHint();
    const r = viewport.getBoundingClientRect();
    zoomAt(e.clientX - r.left, e.clientY - r.top, e.deltaY < 0 ? 1.16 : 1 / 1.16, false);
  }, { passive: false });
  viewport.addEventListener("dblclick", (e) => {
    if (e.target.closest(".pin")) return;
    const r = viewport.getBoundingClientRect();
    zoomAt(e.clientX - r.left, e.clientY - r.top, 1.7, true);
  });
  $("#zoomIn").addEventListener("click", () => zoomAt(vw / 2, vh / 2, 1.45, true));
  $("#zoomOut").addEventListener("click", () => zoomAt(vw / 2, vh / 2, 1 / 1.45, true));
  $("#zoomReset").addEventListener("click", resetMap);
  let resizeTimer;
  window.addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(sizeMap, 120); });

  /* ---------- drawer ---------- */
  const drawer = $("#drawer"), scrim = $("#scrim");
  function selectPlace(id, opts = {}) {
    const p = byId(id);
    if (!p) return;
    state.selected = id;
    Object.entries(pinEls).forEach(([k, el]) => el.classList.toggle("selected", k === id));
    renderDrawer(p);
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    scrim.classList.add("show");
    document.body.classList.add("locked");
    if (opts.center) centerOn(p);
    history.replaceState(null, "", "#a=" + id);
    if (!opts.fromTour) stopTour();
    requestAnimationFrame(() => $("#drawerClose").focus({ preventScroll: true }));
  }
  function closeDrawer() {
    if (!drawer.classList.contains("open")) return;
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    scrim.classList.remove("show");
    document.body.classList.remove("locked");
    state.selected = null;
    Object.values(pinEls).forEach((el) => el.classList.remove("selected"));
    history.replaceState(null, "", location.pathname + location.search);
    stopTour();
  }
  function renderDrawer(p) {
    const c = categories[p.cat];
    $("#drawerMedia").innerHTML = `
      ${p.img ? `<img src="${p.img}" alt="${p.name}">` : artHTML(p, true)}
      <div class="drawer-badges">
        <span class="card-cat" style="--c:${c.color}">${c.label}</span>
        ${p.free ? '<span class="card-free">Free entry</span>' : '<span class="card-free" style="border-color:rgba(255,176,46,.5);color:var(--amber);background:rgba(255,176,46,.14)">Ticketed</span>'}
      </div>`;
    const added = state.plan.includes(p.id);
    $("#drawerBody").innerHTML = `
      <h3 id="drawerTitle">${p.name}</h3>
      <p class="drawer-tag">${p.tagline}</p>
      <p class="drawer-desc">${p.desc}</p>
      <ul class="drawer-hl">${p.highlights.map((h) => `<li>${icon("check", 16)}<span>${h}</span></li>`).join("")}</ul>
      <div class="info-grid">
        <div class="info-cell"><span>Opening hours</span><strong>${p.hours}</strong></div>
        <div class="info-cell"><span>Time needed</span><strong>${p.duration}</strong></div>
        <div class="info-cell"><span>Admission</span><strong>${p.cost}</strong></div>
        <div class="info-cell"><span>Best time</span><strong>${p.best}</strong></div>
      </div>
      <div class="drawer-actions">
        <button class="cta-btn drawer-add ${added ? "added" : ""}" data-add="${p.id}" aria-pressed="${added}">
          ${icon(added ? "check" : "plus", 17)}<span>${added ? "Added to your visit" : "Add to my visit plan"}</span>
        </button>
        <div class="drawer-row">
          <button class="ghost-btn" id="drawerCenter">${icon("target", 16)} Center on map</button>
          <button class="ghost-btn" id="drawerPhone">${icon("phone", 16)} Open on phone</button>
        </div>
      </div>`;
    $("#drawerBody").querySelector("[data-add]").addEventListener("click", () => togglePlan(p.id));
    $("#drawerCenter").addEventListener("click", () => {
      centerOn(p);
      if (window.innerWidth <= 720) closeDrawer();
    });
    $("#drawerPhone").addEventListener("click", () => openQR({
      title: p.name,
      note: "Scan to open this attraction on your phone — details, hours and map pin included.",
      hash: "#a=" + p.id
    }));
    $("#drawerPos").textContent = `${places.indexOf(p) + 1} of ${places.length}`;
    $("#drawerBody").scrollTop = 0;
  }
  $("#drawerClose").addEventListener("click", closeDrawer);
  scrim.addEventListener("click", closeDrawer);
  $("#drawerPrev").addEventListener("click", () => stepDrawer(-1));
  $("#drawerNext").addEventListener("click", () => stepDrawer(1));
  function stepDrawer(dir) {
    const i = places.findIndex((p) => p.id === state.selected);
    const n = places[(i + dir + places.length) % places.length];
    selectPlace(n.id, { center: true, fromTour: state.tour });
  }
  document.querySelectorAll("[data-open]").forEach((b) =>
    b.addEventListener("click", () => {
      stopTour();
      selectPlace(b.dataset.open, { center: true });
      $("#map").scrollIntoView({ behavior: "smooth" });
    }));

  /* ---------- visit plan ---------- */
  function loadPlan() {
    try {
      const raw = JSON.parse(localStorage.getItem("gbtb-plan") || "[]");
      state.plan = Array.isArray(raw) ? raw.filter((id) => byId(id)) : [];
    } catch { state.plan = []; }
  }
  function savePlan() { localStorage.setItem("gbtb-plan", JSON.stringify(state.plan)); }
  function togglePlan(id) {
    const p = byId(id);
    const i = state.plan.indexOf(id);
    if (i >= 0) {
      state.plan.splice(i, 1);
      toast(`Removed ${p.name} from your visit`, { label: "Undo", fn: () => { state.plan.splice(Math.min(i, state.plan.length), 0, id); savePlan(); renderPlan(); updateAddButtons(); } });
    } else {
      state.plan.push(id);
      toast(`${p.name} added to your visit`);
    }
    savePlan(); renderPlan(); updateAddButtons();
  }
  function updateAddButtons() {
    document.querySelectorAll("[data-add]").forEach((b) => {
      const added = state.plan.includes(b.dataset.add);
      b.classList.toggle("added", added);
      b.setAttribute("aria-pressed", String(added));
      if (b.classList.contains("drawer-add")) {
        b.innerHTML = icon(added ? "check" : "plus", 17) + `<span>${added ? "Added to your visit" : "Add to my visit plan"}</span>`;
      } else {
        b.innerHTML = icon(added ? "check" : "plus", 17);
      }
    });
    $("#planBadge").textContent = state.plan.length;
  }
  const fmtTime = (min) => {
    const h24 = Math.floor(min / 60) % 24, m = min % 60;
    const ap = h24 >= 12 ? "PM" : "AM", h = h24 % 12 || 12;
    return `${h}:${String(m).padStart(2, "0")} ${ap}`;
  };
  const fmtDur = (min) => `${Math.floor(min / 60)}h ${min % 60 ? `${min % 60}m` : ""}`.trim();
  function renderPlan() {
    const list = $("#planList"), empty = $("#planEmpty"), summary = $("#planSummary"), actions = $("#planActions");
    const has = state.plan.length > 0;
    empty.hidden = has; list.hidden = !has; summary.hidden = !has; actions.hidden = !has;
    if (!has) { list.innerHTML = ""; return; }
    let start = 9 * 60, total = 0;
    list.innerHTML = state.plan.map((id, i) => {
      const p = byId(id);
      const t = fmtTime(start);
      total += p.durationMin + (i < state.plan.length - 1 ? 15 : 0);
      start += p.durationMin + 15;
      return `<li class="plan-item" style="--c:${categories[p.cat].color}">
        <div class="plan-time">${t}<small>stop ${i + 1}</small></div>
        <span class="plan-dot"></span>
        <div class="plan-info"><strong>${p.name}</strong><span>${p.duration} · ${p.cost}</span></div>
        <div class="plan-ctrl">
          <button data-move="${i},-1" ${i === 0 ? "disabled" : ""} aria-label="Move ${p.name} earlier">${icon("up", 14)}</button>
          <button data-move="${i},1" ${i === state.plan.length - 1 ? "disabled" : ""} aria-label="Move ${p.name} later">${icon("down", 14)}</button>
          <button class="del" data-del="${id}" aria-label="Remove ${p.name}">${icon("trash", 14)}</button>
        </div>
      </li>`;
    }).join("");
    summary.innerHTML = `
      <div class="plan-stat"><strong>${state.plan.length}</strong><span>${state.plan.length === 1 ? "stop" : "stops"}</span></div>
      <div class="plan-stat"><strong>${fmtDur(total)}</strong><span>at a stroll</span></div>
      <div class="plan-stat"><strong>${fmtTime(9 * 60 + total)}</strong><span>wrap up by</span></div>`;
    list.querySelectorAll("[data-move]").forEach((b) => b.addEventListener("click", () => {
      const [i, d] = b.dataset.move.split(",").map(Number);
      const [item] = state.plan.splice(i, 1);
      state.plan.splice(i + d, 0, item);
      savePlan(); renderPlan();
    }));
    list.querySelectorAll("[data-del]").forEach((b) => b.addEventListener("click", () => togglePlan(b.dataset.del)));
  }
  $("#planSeedBtn").addEventListener("click", () => {
    ["flower-dome", "cloud-forest", "supertree-grove"].forEach((id) => { if (!state.plan.includes(id)) state.plan.push(id); });
    savePlan(); renderPlan(); updateAddButtons();
    toast("The three icons are in your plan");
  });
  $("#planClearBtn").addEventListener("click", () => {
    const old = [...state.plan];
    state.plan = [];
    savePlan(); renderPlan(); updateAddButtons();
    toast("Plan cleared", { label: "Undo", fn: () => { state.plan = old; savePlan(); renderPlan(); updateAddButtons(); } });
  });
  $("#planQrBtn").addEventListener("click", () => openQR({
    title: "Your visit, to go",
    note: `Scan to load your ${state.plan.length}-stop plan on your phone, with the interactive map.`,
    hash: "#plan=" + state.plan.join(",")
  }));

  /* ---------- QR handoff ---------- */
  const qrModal = $("#qrModal");
  const LOOPBACK = /^(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)$/;
  function validBase(v) {
    try {
      const u = new URL(v);
      return u.protocol === "http:" || u.protocol === "https:" ? u.origin : "";
    } catch { return ""; }
  }
  function phoneBase() {
    return validBase(window.GBTB_HOST || "") || validBase(localStorage.getItem("gbtb-host") || "") || location.origin;
  }
  function deepLink(hash) { return phoneBase() + location.pathname + hash; }
  function drawQR(text) {
    const qr = window.qrcode(0, "M");
    qr.addData(text); qr.make();
    const n = qr.getModuleCount(), quiet = 4, total = n + quiet * 2;
    const cv = $("#qrCanvas"), ctx = cv.getContext("2d");
    const size = cv.width, cell = Math.floor(size / total), used = cell * total, off = (size - used) / 2;
    ctx.fillStyle = "#f6f1e7"; ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#241640";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      if (qr.isDark(r, c)) ctx.fillRect(off + (c + quiet) * cell, off + (r + quiet) * cell, cell, cell);
    }
  }
  let qrHash = "#map";
  function openQR({ title, note, hash }) {
    qrHash = hash || "#map";
    $("#qrTitle").textContent = title;
    $("#qrNote").textContent = note;
    refreshQR();
    qrModal.classList.add("open");
    qrModal.setAttribute("aria-hidden", "false");
    $("#qrClose").focus({ preventScroll: true });
  }
  function refreshQR() {
    const url = deepLink(qrHash);
    $("#qrUrl").textContent = url;
    drawQR(url);
    const auto = validBase(window.GBTB_HOST || "");
    $("#qrHostRow").hidden = !!auto;
    if (!auto) $("#qrHost").value = localStorage.getItem("gbtb-host") || "";
    let reachable = false;
    try {
      const u = new URL(url);
      reachable = /^https?:$/.test(u.protocol) && !LOOPBACK.test(u.hostname);
    } catch {}
    $("#qrHostHint").textContent = reachable
      ? (auto ? "Address set by Start.bat — phones must join the same Wi-Fi as this screen."
        : "Saved address — phones must be able to reach it (same Wi-Fi for a local IP).")
      : "Phones can't reach this address. Double-click Start.bat to fill in this PC's Wi-Fi address, or paste it above.";
    $("#qrHostHint").classList.toggle("warn", !reachable);
  }
  function closeQR() {
    qrModal.classList.remove("open");
    qrModal.setAttribute("aria-hidden", "true");
  }
  $("#qrClose").addEventListener("click", closeQR);
  qrModal.addEventListener("click", (e) => { if (e.target === qrModal) closeQR(); });
  $("#qrCopy").addEventListener("click", async () => {
    const url = $("#qrUrl").textContent;
    try { await navigator.clipboard.writeText(url); }
    catch {
      const ta = document.createElement("textarea");
      ta.value = url; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); ta.remove();
    }
    toast("Link copied — paste it anywhere");
  });
  $("#qrHostApply").addEventListener("click", () => {
    const raw = $("#qrHost").value.trim();
    if (!raw) {
      localStorage.removeItem("gbtb-host");
      refreshQR();
      toast("Phone address reset");
      return;
    }
    const base = validBase(raw);
    if (!base) { toast("Enter a full address, e.g. http://192.168.1.17:8080"); return; }
    localStorage.setItem("gbtb-host", base);
    refreshQR();
    toast("QR updated for phones");
  });
  $("#qrHost").addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); $("#qrHostApply").click(); }
  });
  $("#phoneBtn").addEventListener("click", () => {
    const hash = state.selected ? "#a=" + state.selected
      : state.plan.length ? "#plan=" + state.plan.join(",") : "#map";
    openQR({
      title: "Continue on your phone",
      note: state.selected ? "Scan to pick up exactly where this screen left off."
        : state.plan.length ? "Scan to carry your visit plan and the map to your phone."
        : "Scan to open the interactive Gardens map on your mobile.",
      hash
    });
  });

  /* ---------- hash routing ---------- */
  function route() {
    const h = location.hash.slice(1);
    if (h.startsWith("a=")) {
      const p = byId(h.slice(2));
      if (p) selectPlace(p.id, { center: true });
    } else if (h.startsWith("plan=")) {
      const ids = h.slice(5).split(",").filter((id) => byId(id));
      if (ids.length) {
        state.plan = [...new Set(ids)];
        savePlan(); renderPlan(); updateAddButtons();
        toast("Your visit plan is ready — welcome to the Gardens");
        setTimeout(() => $("#visit").scrollIntoView({ behavior: "smooth" }), 250);
      }
    }
  }
  window.addEventListener("hashchange", route);

  /* ---------- guided tour ---------- */
  const tourBtn = $("#tourBtn"), tourProgress = $("#tourProgress");
  let tourTimer = null;
  function startTour() {
    state.tour = true;
    tourBtn.classList.add("on");
    tourBtn.querySelector("span").textContent = "Stop tour";
    tourBtn.querySelector(".tour-play").style.display = "none";
    tourBtn.querySelector(".tour-stop").style.display = "";
    state.tourIdx = 0;
    tourStep();
  }
  function tourStep() {
    if (!state.tour) return;
    const list = visiblePlaces();
    if (!list.length) { stopTour(); return; }
    const p = list[state.tourIdx % list.length];
    selectPlace(p.id, { center: true, fromTour: true });
    tourProgress.hidden = false;
    tourProgress.textContent = `Tour · ${(state.tourIdx % list.length) + 1} / ${list.length} · ${p.name}`;
    state.tourIdx++;
    tourTimer = setTimeout(tourStep, 7000);
  }
  function stopTour() {
    if (!state.tour) return;
    state.tour = false;
    clearTimeout(tourTimer);
    tourBtn.classList.remove("on");
    tourBtn.querySelector("span").textContent = "Guided tour";
    tourBtn.querySelector(".tour-play").style.display = "";
    tourBtn.querySelector(".tour-stop").style.display = "none";
    tourProgress.hidden = true;
  }
  tourBtn.addEventListener("click", () => (state.tour ? stopTour() : startTour()));

  /* ---------- garden ambience (WebAudio) ---------- */
  let actx = null, master = null;
  function ensureAudio() {
    if (actx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    actx = new AC();
    master = actx.createGain();
    master.gain.value = 0;
    master.connect(actx.destination);
    // water fountain bed
    const len = actx.sampleRate * 2;
    const buf = actx.createBuffer(1, len, actx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const noise = actx.createBufferSource(); noise.buffer = buf; noise.loop = true;
    const lp = actx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 380;
    const ng = actx.createGain(); ng.gain.value = 0.4;
    noise.connect(lp); lp.connect(ng); ng.connect(master); noise.start();
    // warm pad
    [196, 293.66, 392].forEach((f) => {
      const o = actx.createOscillator(); o.type = "triangle"; o.frequency.value = f;
      const g = actx.createGain(); g.gain.value = 0.035;
      const fl = actx.createBiquadFilter(); fl.type = "lowpass"; fl.frequency.value = 700;
      o.connect(fl); fl.connect(g); g.connect(master); o.start();
    });
    scheduleBird();
  }
  function chirp() {
    if (!actx || actx.state !== "running" || !state.sound) return;
    const t = actx.currentTime + 0.05;
    const o = actx.createOscillator(), g = actx.createGain(), pan = actx.createStereoPanner();
    o.type = "sine";
    const base = 2300 + Math.random() * 1700;
    let tt = t;
    o.frequency.setValueAtTime(base, t);
    const n = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      o.frequency.exponentialRampToValueAtTime(base * 1.35, tt + 0.05);
      o.frequency.exponentialRampToValueAtTime(base * 0.92, tt + 0.11);
      tt += 0.13;
    }
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.1, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, tt + 0.08);
    pan.pan.value = Math.random() * 1.6 - 0.8;
    o.connect(g); g.connect(pan); pan.connect(master);
    o.start(t); o.stop(tt + 0.12);
  }
  function scheduleBird() {
    setTimeout(() => {
      if (state.sound && actx && actx.state === "running") {
        chirp();
        if (Math.random() < 0.45) setTimeout(chirp, 200);
      }
      scheduleBird();
    }, 2600 + Math.random() * 5200);
  }
  const soundBtn = $("#soundBtn");
  function applySound() {
    soundBtn.setAttribute("aria-pressed", String(state.sound));
    localStorage.setItem("gbtb-sound", state.sound ? "on" : "off");
    if (state.sound) {
      ensureAudio();
      if (actx) {
        actx.resume();
        master.gain.cancelScheduledValues(actx.currentTime);
        master.gain.linearRampToValueAtTime(0.16, actx.currentTime + 1.2);
      }
    } else if (actx) {
      master.gain.cancelScheduledValues(actx.currentTime);
      master.gain.linearRampToValueAtTime(0, actx.currentTime + 0.4);
    }
  }
  soundBtn.addEventListener("click", () => { state.sound = !state.sound; applySound(); });
  document.addEventListener("pointerdown", function firstTouch() {
    document.removeEventListener("pointerdown", firstTouch);
    if (state.sound) applySound();
  });

  /* ---------- Garden Rhapsody countdown ---------- */
  function sgtSeconds() {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Singapore", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
    }).formatToParts(new Date());
    const get = (t) => Number(parts.find((p) => p.type === t).value);
    return get("hour") * 3600 + get("minute") * 60 + get("second");
  }
  function tick() {
    const now = sgtSeconds();
    const shows = [19 * 3600 + 45 * 60, 20 * 3600 + 45 * 60];
    const strip = $("#rhapsody");
    const live = shows.find((s) => now >= s && now < s + 900);
    if (live !== undefined) {
      strip.classList.add("live");
      $("#rhLabel").textContent = "Live now · Supertree Grove";
      $("#rhCountdown").textContent = "Showing now";
      return;
    }
    strip.classList.remove("live");
    let target = shows.find((s) => s > now), label;
    if (target !== undefined) {
      label = "Tonight · " + (target === shows[0] ? "7:45 PM" : "8:45 PM");
    } else {
      target = 86400 + shows[0];
      label = "Tomorrow · 7:45 PM";
    }
    const d = target - now;
    const h = Math.floor(d / 3600), m = Math.floor((d % 3600) / 60), s = d % 60;
    $("#rhLabel").textContent = label;
    $("#rhCountdown").textContent = `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  setInterval(tick, 1000);

  /* ---------- search & keyboard ---------- */
  const searchInput = $("#searchInput");
  searchInput.addEventListener("input", () => { state.query = searchInput.value; applyFilter(); });
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const first = visiblePlaces()[0];
      if (first) {
        stopTour(); selectPlace(first.id, { center: true });
        $("#map").scrollIntoView({ behavior: "smooth" });
      }
    }
  });
  document.addEventListener("keydown", (e) => {
    const typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
    if (e.key === "/" && !typing) { e.preventDefault(); searchInput.focus(); }
    if (e.key === "Escape") {
      if (qrModal.classList.contains("open")) closeQR();
      else closeDrawer();
    }
    if (drawer.classList.contains("open") && !typing) {
      if (e.key === "ArrowRight") stepDrawer(1);
      if (e.key === "ArrowLeft") stepDrawer(-1);
    }
  });

  /* ---------- reveal & nav ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  const navLinks = document.querySelectorAll("[data-nav]");
  const navIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        navLinks.forEach((l) => l.classList.toggle("active", l.dataset.nav === en.target.id));
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  ["map", "attractions", "visit"].forEach((id) => navIO.observe(document.getElementById(id)));

  /* ---------- init ---------- */
  buildChips();
  buildLegend();
  buildPins();
  buildCards();
  loadPlan();
  renderPlan();
  updateAddButtons();
  applyFilter();
  sizeMap();
  resetMap();
  tick();
  applySound();
  requestAnimationFrame(route);
})();