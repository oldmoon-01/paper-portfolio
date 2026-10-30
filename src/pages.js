// ==================================================
// 关于 / 联系页：基于 #hash 的简单路由 + 复制邮箱 + 当地时间
// ==================================================
(function () {
  // —— 改成你的信息 ——
  const CONTACT = {
    email: "hello@yourname.com",
    timeZone: "Asia/Shanghai", // 你所在地的时区（IANA 名称）
  };

  const ROUTES = ["work", "about", "contact"];
  const root = document.documentElement;
  const navLinks = document.querySelectorAll(".nav a[data-route]");
  const scrim = document.getElementById("scrim");
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
  let fmt;
  try {
    fmt = new Intl.DateTimeFormat("zh-CN", { timeZone: CONTACT.timeZone, hour: "2-digit", minute: "2-digit", hour12: false });
  } catch {
    fmt = new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
  }
  const tick = () => (timeEl.textContent = fmt.format(new Date()));
  tick();
  setInterval(tick, 20000);
})();
