// 모든 페이지 공통: 헤더, 테마, 언어, 모달, 스크롤 등장 효과, 공용 렌더 함수

const LINKS = {
  github: "https://github.com/heeyeon-yang",
  linkedin: "https://www.linkedin.com/", // TODO: 본인 프로필 주소
  resume: "assets/resume.pdf",
};

const ICONS = {
  github:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>',
  linkedin:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>',
  moon:
    '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z"/></svg>',
  sun:
    '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/></svg>',
  menu:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>',
  close:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  arrowRight:
    '<svg class="right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  arrowDown:
    '<svg class="down" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
  download:
    '<svg class="down" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
};

/* ---------- Header ---------- */

function renderHeader() {
  const el = document.getElementById("site-header");
  if (!el) return;
  const page = document.body.dataset.page; // home | projects | experience

  el.className = "site-header";
  el.innerHTML = `
    <div class="container">
      <div class="header-left">
        <button class="icon-btn menu-btn" type="button" data-i18n-label="a11y.menu" aria-expanded="false" aria-controls="mobile-nav">${ICONS.menu}</button>
        <a class="logo" href="index.html">Heeyeon Yang</a>
        <nav class="nav">
          <a href="projects.html" data-i18n="nav.projects" ${page === "projects" ? 'aria-current="page"' : ""}></a>
          <a href="experience.html" data-i18n="nav.experience" ${page === "experience" ? 'aria-current="page"' : ""}></a>
        </nav>
      </div>
      <div class="header-right">
        <a class="icon-btn" href="${LINKS.github}" target="_blank" rel="noopener" aria-label="GitHub">${ICONS.github}</a>
        <a class="icon-btn" href="${LINKS.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${ICONS.linkedin}</a>
        <button class="icon-btn lang-btn" type="button" data-i18n-label="a11y.lang"><span class="lang-label"></span></button>
        <button class="icon-btn theme-btn" type="button" data-i18n-label="a11y.theme">${ICONS.moon}${ICONS.sun}</button>
      </div>
    </div>
  `;

  // 모바일 메뉴는 헤더 바로 뒤에 붙임
  const mobile = document.createElement("nav");
  mobile.className = "mobile-nav";
  mobile.id = "mobile-nav";
  mobile.innerHTML = `
    <a href="projects.html" data-i18n="nav.projects"></a>
    <a href="experience.html" data-i18n="nav.experience"></a>
  `;
  el.after(mobile);

  const menuBtn = el.querySelector(".menu-btn");
  menuBtn.addEventListener("click", () => {
    const open = mobile.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.innerHTML = open ? ICONS.close : ICONS.menu;
  });
  // 메뉴 링크 누르면 닫기 (같은 페이지 앵커일 때 대비)
  mobile.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      mobile.classList.remove("open");
      menuBtn.innerHTML = ICONS.menu;
    }
  });

  el.querySelector(".theme-btn").addEventListener("click", toggleTheme);
  el.querySelector(".lang-btn").addEventListener("click", () => {
    setLang(getLang() === "en" ? "ko" : "en");
  });

  updateLangLabel();
  document.addEventListener("langchange", updateLangLabel);
}

// 버튼에는 "바꿀 언어"를 표시
function updateLangLabel() {
  const label = document.querySelector(".lang-label");
  if (label) label.textContent = getLang() === "en" ? "KO" : "EN";
}

/* ---------- Theme ---------- */
// 초기값은 <head>의 인라인 스크립트에서 이미 세팅됨 (깜빡임 방지)

function toggleTheme() {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) {}
}

/* ---------- How I built modal ---------- */

function ensureModal() {
  let modal = document.getElementById("built-modal");
  if (modal) return modal;

  modal = document.createElement("dialog");
  modal.id = "built-modal";
  modal.className = "modal";
  document.body.appendChild(modal);

  // 바깥(backdrop) 클릭하면 닫기
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
  });
  return modal;
}

function renderModal() {
  const modal = ensureModal();
  const d = HOW_I_BUILT;
  modal.innerHTML = `
    <div class="modal-inner">
      <div class="modal-head">
        <div>
          <p class="detail-kind">How I built</p>
          <h2>${pick(d.title)}</h2>
        </div>
        <button class="icon-btn" type="button" data-close aria-label="${t("modal.close")}">${ICONS.close}</button>
      </div>
      ${thumbHTML(d.diagram, d.stack)}
      <div class="modal-sections">
        ${d.sections
          .map((s) => `<div><h3>${pick(s.heading)}</h3><p>${pick(s.body)}</p></div>`)
          .join("")}
      </div>
    </div>
  `;
  modal.querySelector("[data-close]").addEventListener("click", () => modal.close());
}

function openBuiltModal() {
  renderModal();
  ensureModal().showModal();
}

/* ---------- 공용 렌더 조각 ---------- */

// 구조도 있으면 이미지, 없으면 스택 이름 칩
function thumbHTML(diagram, stack = []) {
  if (diagram) {
    return `<div class="thumb"><img src="${diagram}" alt="" loading="lazy"></div>`;
  }
  return `<div class="thumb"><div class="thumb-placeholder">${stack
    .map((s) => `<span>${s}</span>`)
    .join("")}</div></div>`;
}

function tagsHTML(tags) {
  return `<div class="tags">${tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>`;
}

function projectCardHTML(p) {
  return `
    <a class="project-card reveal" href="projects.html#${p.id}">
      ${thumbHTML(p.diagram, p.stack)}
      <div class="card-body">
        <h3 class="card-title"><span>${pick(p.title)}</span><span class="year">${p.year}</span></h3>
        <p class="card-summary">${pick(p.summary)}</p>
        ${tagsHTML(p.tags.slice(0, 4))}
      </div>
    </a>
  `;
}

function sideItemHTML(p) {
  const thumb = p.thumb ? `<img src="${p.thumb}" alt="">` : p.monogram || pick(p.title).slice(0, 2);
  const inner = `
    <span class="side-thumb">${thumb}</span>
    <span class="side-text">
      <span class="side-title">${pick(p.title)}</span><br>
      <span class="side-desc">${pick(p.summary)}</span>
    </span>
    <span class="side-meta">${p.year}</span>
  `;
  // 이 사이트 항목은 모달로
  if (p.modal) {
    return `<button class="side-item reveal" type="button" data-open-built>${inner}</button>`;
  }
  return `<a class="side-item reveal" href="projects.html#${p.id}">${inner}</a>`;
}

function expItemHTML(e) {
  return `
    <li class="exp-item reveal">
      <div class="exp-top">
        <div>
          <div class="exp-org">${pick(e.org)}</div>
          <div class="exp-role">${pick(e.role)}</div>
        </div>
        <span class="exp-period">${e.period}</span>
      </div>
      ${e.desc ? `<p class="exp-desc">${pick(e.desc)}</p>` : ""}
    </li>
  `;
}

function skillsHTML() {
  return SKILLS.map(
    (g) => `
      <div class="skill-row reveal">
        <span class="skill-label">${pick(g.label)}</span>
        ${tagsHTML(g.items)}
      </div>
    `
  ).join("");
}

function certsHTML() {
  return `<ul class="cert-list">${CERTS.map(
    (c) => `
      <li class="cert-item reveal">
        <div>
          <div class="cert-name">${pick(c.name)}</div>
          <div class="cert-issuer">${pick(c.issuer)}</div>
        </div>
        <span class="cert-date">${c.date}</span>
      </li>
    `
  ).join("")}</ul>`;
}

function resumeHTML() {
  return `
    <div class="resume-cta reveal">
      <div>
        <h3 data-i18n="resume.title"></h3>
        <p data-i18n="resume.desc"></p>
      </div>
      <a class="btn btn-primary" href="${LINKS.resume}" download>
        <span data-i18n="resume.btn"></span>${ICONS.download}
      </a>
    </div>
  `;
}

/* ---------- Scroll reveal ---------- */

const revealObserver =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px" }
      )
    : null;

// 렌더할 때마다 새로 생긴 .reveal만 다시 등록
function observeReveal(root = document) {
  root.querySelectorAll(".reveal:not(.in)").forEach((el) => {
    if (revealObserver) revealObserver.observe(el);
    else el.classList.add("in");
  });
}

/* ---------- Init ---------- */

document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.lang = getLang();
  renderHeader();

  // data-open-built 붙은 건 어디서든 모달 열기 (동적으로 그린 요소 포함)
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-open-built]")) openBuiltModal();
  });

  document.addEventListener("langchange", () => {
    const modal = document.getElementById("built-modal");
    if (modal && modal.open) renderModal();
  });

  // 페이지별 스크립트가 renderPage를 정의해 둠
  if (typeof renderPage === "function") renderPage();
  applyI18n();
  observeReveal();

  // 언어 바꿀 땐 다시 그리되, 등장 애니메이션은 생략
  document.addEventListener("langchange", () => {
    if (typeof renderPage === "function") renderPage();
    applyI18n();
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
  });
});
