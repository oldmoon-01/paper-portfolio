// ==================================================
// 关于 / 联系页：基于 #hash 的简单路由 + 复制邮箱 + 当地时间
// ==================================================
(function () {
  // —— 改成你的信息 ——
  const CONTACT = {
    email: "oldmoonzz@163.com",
    timeZone: "Asia/Shanghai", // 你所在地的时区（IANA 名称）
  };

  const ROUTES = ["work", "about", "contact"];
  const root = document.documentElement;
  const navLinks = document.querySelectorAll(".nav a[data-route]");
  const scrim = document.getElementById("scrim");
  const indexControl = document.querySelector(".work-index-control");
  const indexTrigger = document.getElementById("work-index-trigger");
  const indexPanel = document.getElementById("work-index");
  const indexList = document.getElementById("work-index-list");
  const indexCount = document.getElementById("work-index-count");
  let current = null;

  function route() {
    const name = location.hash.replace("#", "");
    const next = ROUTES.includes(name) ? name : "work";
    if (next === current) return;
    current = next;

    document.querySelectorAll(".sheet").forEach((el) => {
      const on = el.id === next;
      el.classList.toggle("is-active", on);
      el.setAttribute("aria-hidden", on ? "false" : "true");
      if (on) {
        el.scrollTop = 0;
        el.focus({ preventScroll: true });
      }
    });
    root.classList.toggle("is-sheet", next !== "work");
    navLinks.forEach((a) => {
      if (a.dataset.route === next) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    // 通知 3D 场景（打开面板时把展开的纸揉回去）
    window.dispatchEvent(new CustomEvent("portfolio:route", { detail: next }));
  }

  scrim.addEventListener("click", () => { location.hash = "work"; });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && current !== "work") location.hash = "work";
  });
  window.addEventListener("hashchange", route);
  route();

  // 作品目录：所有已具备图集的项目都会显示在这里。
  const projectIndex = (window.PROJECTS || []).filter((project) => project.gallery && project.gallery.length);
  const pad2 = (n) => String(n).padStart(2, "0");
  const escapeHtml = (value) => String(value).replace(/[&<>\"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]);
  indexCount.textContent = `${pad2(projectIndex.length)} PROJECTS`;
  indexList.innerHTML = projectIndex.map((project, index) => `
    <li>
      <a href="#work" data-project-index="${index}" aria-label="打开项目 ${escapeHtml(project.title)}，分类：${escapeHtml(project.category)}">
        <span class="work-index-no" aria-hidden="true">${pad2(index + 1)}</span>
        <span class="work-index-title">${escapeHtml(project.title)}</span>
        <span class="work-index-category">${escapeHtml(project.category)}</span>
      </a>
    </li>`).join("");

  let closeIndexTimer = 0;
  let indexOpenedOnHover = false;
  const isIndexOpen = () => !indexPanel.hidden;
  const openIndex = () => {
    clearTimeout(closeIndexTimer);
    indexPanel.hidden = false;
    indexTrigger.setAttribute("aria-expanded", "true");
  };
  const closeIndex = () => {
    clearTimeout(closeIndexTimer);
    indexOpenedOnHover = false;
    indexPanel.hidden = true;
    indexTrigger.setAttribute("aria-expanded", "false");
  };
  const scheduleIndexClose = () => {
    clearTimeout(closeIndexTimer);
    closeIndexTimer = setTimeout(() => {
      if (!indexControl.matches(":hover") && !indexControl.contains(document.activeElement)) closeIndex();
    }, 120);
  };

  indexControl.addEventListener("pointerenter", () => {
    if (!isIndexOpen()) indexOpenedOnHover = true;
    openIndex();
  });
  indexControl.addEventListener("pointerleave", scheduleIndexClose);
  indexControl.addEventListener("focusin", openIndex);
  indexControl.addEventListener("focusout", (event) => {
    if (!indexControl.contains(event.relatedTarget)) scheduleIndexClose();
  });
  indexTrigger.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") indexOpenedOnHover = false;
  });
  indexTrigger.addEventListener("click", () => {
    // 鼠标移入会先打开目录；这一次点击不应立刻把它又关掉。
    if (indexOpenedOnHover) {
      indexOpenedOnHover = false;
      return;
    }
    if (isIndexOpen()) closeIndex();
    else openIndex();
  });
  indexList.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-project-index]");
    if (!link) return;
    event.preventDefault();
    const index = Number(link.dataset.projectIndex);
    closeIndex();
    const openProject = () => window.ProjectViewer?.open(index);
    if (location.hash !== "#work") {
      location.hash = "work";
      requestAnimationFrame(openProject);
    } else {
      openProject();
    }
  });
  document.addEventListener("pointerdown", (event) => {
    if (isIndexOpen() && !indexControl.contains(event.target)) closeIndex();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isIndexOpen()) {
      event.stopImmediatePropagation();
      closeIndex();
      indexTrigger.focus({ preventScroll: true });
    }
  });

  // 邮箱
  document.getElementById("mail-addr").textContent = CONTACT.email;
  document.getElementById("mail-link").href = "mailto:" + CONTACT.email;
  const copyBtn = document.getElementById("copy-mail");
  copyBtn.addEventListener("click", () => {
    const done = (ok) => {
      copyBtn.textContent = ok ? "已复制" : "请手动选中复制";
      setTimeout(() => (copyBtn.textContent = "复制邮箱"), 1800);
    };
    try {
      navigator.clipboard.writeText(CONTACT.email).then(() => done(true), () => selectMail(done));
    } catch {
      selectMail(done);
    }
  });
  function selectMail(done) {
    const r = document.createRange();
    r.selectNodeContents(document.getElementById("mail-addr"));
    const s = getSelection();
    s.removeAllRanges();
    s.addRange(r);
    done(false);
  }

  // 当地时间
  const timeEl = document.getElementById("local-time");
  if (timeEl) {
    let fmt;
    try {
      fmt = new Intl.DateTimeFormat("zh-CN", { timeZone: CONTACT.timeZone, hour: "2-digit", minute: "2-digit", hour12: false });
    } catch {
      fmt = new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
    }
    const tick = () => (timeEl.textContent = fmt.format(new Date()));
    tick();
    setInterval(tick, 20000);
  }
})();
