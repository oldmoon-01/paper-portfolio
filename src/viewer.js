// ==================================================
// 项目图集：纸团展开后，全屏横向滑动浏览
// 触屏：左右滑 · 触控板/鼠标：滚轮或拖拽 · 键盘：← → Esc
// ==================================================
window.ProjectViewer = (function () {
  const PROJECTS = window.PROJECTS || [];
  const root = document.documentElement;
  const el = document.getElementById("viewer");
  const track = document.getElementById("v-track");
  const $ = (id) => document.getElementById(id);
  const ui = {
    no: $("v-no"), name: $("v-name"), cur: $("v-cur"), total: $("v-total"),
    caption: $("v-caption"), bar: $("v-bar"), prev: $("v-prev"), next: $("v-next"), close: $("v-close"),
  };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pad2 = (n) => String(n).padStart(2, "0");
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  // 以 "## " 开头的段落渲染为小标题
  const para = (t) => (t.startsWith("## ") ? `<h3 class="vi-h">${esc(t.slice(3))}</h3>` : `<p>${esc(t)}</p>`);

  let project = null, captions = [], count = 0, cur = 0, isOpen = false, lastFocus = null, scrollLock = 0;

  function build(i) {
    project = PROJECTS[i];
    const d = project.description || {};
    const meta = [
      ["类别", project.category],
      ["背景", project.brief],
      ["交付", (project.deliverables || []).join(" / ")],
      ["年份", project.year],
      ["图片", `${project.gallery.length} 张`],
    ].filter(([, v]) => v);

    const intro = `
      <section class="slide slide-intro" aria-label="项目介绍">
        <div class="intro-scroll">
          <div class="vi-head">
            <h2 class="vi-title" id="viewer-title">${esc(project.title)}</h2>
            ${project.en ? `<p class="vi-sub">${esc(project.en)}</p>` : ""}
          </div>
          <dl class="vi-meta">${meta.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
          <div class="vi-desc">
            ${d.en ? `<div lang="en">${d.en.map(para).join("")}</div>` : ""}
            ${d.zh ? `<div lang="zh-CN">${d.zh.map(para).join("")}</div>` : ""}
          </div>
          <div class="vi-actions">
            <button class="vi-start" type="button" data-go="1">${project.gallery.length > 1 ? "向左滑动看作品 →" : "查看作品 →"}</button>
            ${project.site ? `<a class="vi-site" href="${esc(project.site)}" target="_blank" rel="noopener">访问网站 ${esc(project.site.replace(/^https?:\/\//, ""))} ↗</a>` : ""}
          </div>
        </div>
      </section>`;
    const imgs = project.gallery.map((g, k) => `
      <figure class="slide slide-img">
        <img src="${esc(g.src)}" alt="${esc(g.caption || project.title + " " + (k + 1))}" decoding="async" draggable="false" />
      </figure>`).join("");
    track.innerHTML = intro + imgs;

    captions = ["项目介绍 · About the project", ...project.gallery.map((g) => g.caption || "")];
    count = captions.length;
    ui.no.textContent = `No.${pad2(i + 1)}`;
    ui.name.textContent = project.title;
    ui.total.textContent = pad2(count);
    track.querySelector("[data-go]").addEventListener("click", () => go(1));
  }

  function open(i) {
    if (!PROJECTS[i] || !PROJECTS[i].gallery) return;
    lastFocus = document.activeElement;
    build(i);
    el.hidden = false;
    isOpen = true;
    root.classList.add("is-viewer");
    track.scrollLeft = 0;
    cur = 0;
    update();
    requestAnimationFrame(() => el.classList.add("is-in"));
    el.focus({ preventScroll: true });
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    el.classList.remove("is-in");
    root.classList.remove("is-viewer");
    setTimeout(() => { if (!isOpen) { el.hidden = true; track.innerHTML = ""; } }, reduce ? 0 : 320);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  function go(n) {
    n = Math.max(0, Math.min(count - 1, n));
    scrollLock = performance.now() + 700; // 平滑滚动期间不让 scroll 事件改页码
    track.scrollTo({ left: n * track.clientWidth, behavior: reduce ? "auto" : "smooth" });
    setCur(n);
  }

  function setCur(n) {
    if (n === cur) return;
    cur = n;
    update();
  }

  function update() {
    ui.cur.textContent = pad2(cur + 1);
    ui.caption.textContent = captions[cur] || "";
    ui.bar.style.transform = `scaleX(${(cur + 1) / count})`;
    ui.prev.disabled = cur === 0;
    ui.next.disabled = cur === count - 1;
  }

  // 原生滚动（触屏滑动 / 触控板横滑）时同步页码
  track.addEventListener("scroll", () => {
    if (dragging || performance.now() < scrollLock) return;
    setCur(Math.round(track.scrollLeft / track.clientWidth));
  }, { passive: true });

  ui.prev.addEventListener("click", () => go(cur - 1));
  ui.next.addEventListener("click", () => go(cur + 1));
  ui.close.addEventListener("click", close);

  addEventListener("keydown", (e) => {
    if (!isOpen) return;
    if (e.key === "Escape") { e.stopImmediatePropagation(); close(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); go(cur + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(cur - 1); }
  });

  // 竖向滚轮 → 翻页（介绍页文字还能往下滚时先滚文字）
  let wheelLock = 0;
  track.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // 横向手势交给原生滚动
    const scroller = e.target.closest(".intro-scroll");
    if (scroller) {
      const canDown = scroller.scrollTop + scroller.clientHeight < scroller.scrollHeight - 2;
      const canUp = scroller.scrollTop > 0;
      if ((e.deltaY > 0 && canDown) || (e.deltaY < 0 && canUp)) return;
    }
    e.preventDefault();
    const now = performance.now();
    if (now < wheelLock || Math.abs(e.deltaY) < 4) return;
    wheelLock = now + 650;
    go(cur + (e.deltaY > 0 ? 1 : -1));
  }, { passive: false });

  // 鼠标拖拽翻页
  let dragging = false, startX = 0, startLeft = 0;
  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || e.target.closest("button, a, .vi-desc")) return;
    dragging = true;
    startX = e.clientX;
    startLeft = track.scrollLeft;
    track.classList.add("is-drag");
    track.setPointerCapture(e.pointerId);
  });
  track.addEventListener("pointermove", (e) => {
    if (dragging) track.scrollLeft = startLeft - (e.clientX - startX);
  });
  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    track.classList.remove("is-drag");
    const dx = e.clientX - startX, w = track.clientWidth;
    const base = Math.round(startLeft / w);
    go(Math.abs(dx) > w * 0.12 ? base + (dx < 0 ? 1 : -1) : base);
  };
  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);

  addEventListener("resize", () => {
    if (isOpen) track.scrollLeft = cur * track.clientWidth;
  });

  return { open, close };
})();
