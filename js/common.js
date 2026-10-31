
const LINKS = {
  github: "https://github.com/heeyeon-yang",
  linkedin: "https://www.linkedin.com/in/heeyeon-yang",
  resume: "assets/Resume_Heeyeon_Yang.pdf",
};

const ICONS = {
  github:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
  linkedin:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
  moon:
    '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z" fill="currentColor" fill-opacity=".18"/></svg>',
  sun:
    '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="currentColor" fill-opacity=".25"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/></svg>',
  menu:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>',
  close:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  arrowRight:
    '<svg class="right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  arrowDown:
    '<svg class="down" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
  globe:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z"/></svg>',
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
          <a href="about.html" data-i18n="nav.about" ${page === "about" ? 'aria-current="page"' : ""}></a>
          <a href="projects.html" data-i18n="nav.projects" ${page === "projects" ? 'aria-current="page"' : ""}></a>
          <a href="experience.html" data-i18n="nav.experience" ${page === "experience" ? 'aria-current="page"' : ""}></a>
        </nav>
      </div>
      <div class="header-right">
        <div class="header-group">
          <a class="hbtn" data-tone="github" href="${LINKS.github}" target="_blank" rel="noopener" aria-label="GitHub">
            <span class="filled" aria-hidden="true"></span>${ICONS.github}<span class="social-label" aria-hidden="true">GitHub</span>
          </a>
          <a class="hbtn" data-tone="linkedin" href="${LINKS.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">
            <span class="filled" aria-hidden="true"></span>${ICONS.linkedin}<span class="social-label" aria-hidden="true">LinkedIn</span>
          </a>
        </div>
        <span class="header-divider" aria-hidden="true"></span>
        <div class="header-group">
          <button class="lang-switch" type="button" data-i18n-label="a11y.lang">
            <span class="seg-indicator" aria-hidden="true"></span>
            <span class="seg" data-lang="en">ENG</span>
            <span class="seg" data-lang="ko">KOR</span>
          </button>
          <button class="theme-switch" type="button" role="switch" data-i18n-label="a11y.theme">
            <span class="knob" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    </div>
  `;

  const mobile = document.createElement("nav");
  mobile.className = "mobile-nav";
  mobile.id = "mobile-nav";
  mobile.innerHTML = `
    <a href="about.html" data-i18n="nav.about"></a>
    <a href="projects.html" data-i18n="nav.projects"></a>
    <a href="experience.html" data-i18n="nav.experience"></a>
    <a class="mobile-only-link" href="${LINKS.github}" target="_blank" rel="noopener">GitHub</a>
    <a class="mobile-only-link" href="${LINKS.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
  `;
  el.after(mobile);

  const menuBtn = el.querySelector(".menu-btn");
  menuBtn.addEventListener("click", () => {
    const open = mobile.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.innerHTML = open ? ICONS.close : ICONS.menu;
  });
  mobile.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      mobile.classList.remove("open");
      menuBtn.innerHTML = ICONS.menu;
    }
  });

  const themeBtn = el.querySelector(".theme-switch");
  const syncTheme = () => themeBtn.setAttribute("aria-checked", document.documentElement.dataset.theme === "dark");
  themeBtn.addEventListener("click", () => {
    toggleTheme();
    syncTheme();
  });
  syncTheme();

  el.querySelector(".lang-switch").addEventListener("click", () => {
    setLang(getLang() === "en" ? "ko" : "en");
  });

  updateLangLabel();
  document.addEventListener("langchange", updateLangLabel);
  addEventListener("resize", updateLangLabel);
  if (document.fonts) document.fonts.ready.then(updateLangLabel);
}

function updateLangLabel() {
  const sw = document.querySelector(".lang-switch");
  if (!sw) return;
  const lang = getLang();
  sw.querySelectorAll(".seg").forEach((seg) => {
    const on = seg.dataset.lang === lang;
    seg.classList.toggle("on", on);
    if (on) {
      sw.style.setProperty("--seg-x", seg.offsetLeft + "px");
      sw.style.setProperty("--seg-w", seg.offsetWidth + "px");
    }
  });
}

/* ---------- Theme ---------- */

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
        <div class="modal-actions">
          ${d.projectId ? `<a class="btn btn-outline modal-full" href="project.html?id=${d.projectId}"><span>${t("modal.full")}</span>${ICONS.arrowRight}</a>` : ""}
          <button class="icon-btn" type="button" data-close aria-label="${t("modal.close")}">${ICONS.close}</button>
        </div>
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

function thumbHTML(diagram, stack = [], flow = [], tint = "") {
  if (diagram) {
    return `<div class="thumb"><img src="${diagram}" alt="" loading="lazy"></div>`;
  }
  const style = tint ? ` style="--tint:${tint}"` : "";
  return `<div class="thumb${tint ? " tinted" : ""}"${style}><div class="thumb-placeholder">${flowHTML(flow)}</div></div>`;
}

const FLOW_LABELS = {
  route53: "Route 53", elb: "ALB", eks: "EKS", rds: "RDS", kinesis: "Kinesis",
  dynamodb: "DynamoDB", s3: "S3", lambda: "Lambda", sqs: "SQS", bedrock: "Bedrock", slack: "Slack", cloudfront: "CloudFront",
};

// A step is "eks", or { icon: "lambda", label: "Worker" }, or a zone group:
// { zones: ["AZ a", "AZ c"], steps: ["eks", "rds"] }
function flowHTML(flow = []) {
  if (!flow.length) return "";
  let i = 0;
  const node = (step) => {
    const icon = typeof step === "string" ? step : step.icon;
    const label = (typeof step === "object" && step.label) || FLOW_LABELS[icon] || icon;
    return `<span class="flow-node" style="--i:${i++}"><img src="assets/icons/stack/${icon}.svg" alt=""><span class="flow-cap">${label}</span></span>`;
  };
  const link = () => `<span class="flow-link" style="--i:${i}"></span>`;
  const row = (steps) => steps.map((s, k) => (k ? link() : "") + node(s)).join("");
  const dot = '<span class="flow-dot"></span>';
  const parts = flow.map((step, k) => {
    const lead = k ? link() : "";
    if (step && step.zones) {
      const start = i;
      const zones = step.zones
        .map((name) => {
          i = start;
          return `<div class="flow-zone"><span class="flow-zone-label">${name}</span><div class="flow-row">${row(step.steps)}</div></div>`;
        })
        .join("");
      return { group: true, lead, html: `<div class="flow-group" style="--i:${start}">${zones}</div>` };
    }
    return { html: lead + node(step) };
  });
  const g = parts.findIndex((p) => p.group);
  if (g === -1) {
    return `<div class="flow reveal-flow" aria-hidden="true">${dot}${parts.map((p) => p.html).join("")}</div>`;
  }
  // Grouped flow: the dot runs up to the zone box and stops there
  const before = parts.slice(0, g).map((p) => p.html).join("") + parts[g].lead;
  const after = parts.slice(g).map((p) => p.html).join("");
  return `<div class="flow reveal-flow is-grouped" aria-hidden="true"><div class="flow-lead">${dot}${before}</div>${after}</div>`;
}

function tagsHTML(tags) {
  return `<div class="tags">${tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>`;
}

function projectURL(p) {
  return `project.html?id=${encodeURIComponent(p.id)}`;
}

function projectCardHTML(p) {
  if (p.draft) {
    return `
      <div class="project-card is-draft reveal" aria-hidden="true">
        ${thumbHTML(null, [])}
        <div class="card-body">
          <h3 class="card-title"><span>${pick(p.title)}</span></h3>
          <p class="card-summary">${pick(p.summary)}</p>
        </div>
      </div>
    `;
  }
  return `
    <a class="project-card reveal" href="${projectURL(p)}">
      <div class="thumb-wrap">
        ${thumbHTML(p.diagram, p.stack, p.flow, p.tint)}
        <span class="kind-chip">${t(p.meta.team.en === "Personal" ? "chip.personal" : "chip.team")}</span>
        <span class="view-chip" aria-hidden="true">${t("project.view")}${ICONS.arrowRight}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title"><span>${pick(p.title)}</span><span class="year">${p.year}</span></h3>
        <p class="card-summary">${pick(p.summary)}</p>
        ${tagsHTML(p.tags.slice(0, 4))}
      </div>
    </a>
  `;
}

function sideItemHTML(p) {
  const thumb = p.thumb ? `<img src="${p.thumb}" alt=""${p.thumbFill ? ' class="fill"' : ""}>` : p.monogram || pick(p.title).slice(0, 2);
  const inner = `
    <span class="side-thumb">${thumb}</span>
    <span class="side-text">
      <span class="side-title">${pick(p.title)}</span><br>
      <span class="side-desc">${pick(p.summary)}</span>
    </span>
    <span class="side-meta">${p.year}</span>
  `;
  return `<a class="side-item reveal" href="${projectURL(p)}">${inner}</a>`;
}

function expItemHTML(e) {
  return `
    <li class="exp-item reveal">
      <div class="exp-top">
        <div>
          <div class="exp-org">${pick(e.roleFirst ? e.role : e.org)}</div>
          <div class="exp-role">${pick(e.roleFirst ? e.org : e.role)}</div>
        </div>
        <span class="exp-period">${pick(e.period)}</span>
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
  return `<p class="sub-label reveal">${t("section.certs")}</p><ul class="cert-list">${CERTS.map(
    (c) => `
      <li class="cert-item reveal">
        ${c.icon ? `<img class="cert-icon" src="${c.icon}" alt="" loading="lazy">` : ""}
        <div class="cert-text">
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
      <a class="btn btn-primary btn-fill" href="${LINKS.resume}" download>
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
            if (!entry.isIntersecting) return;
            const el = entry.target;
            // Project cards reveal together as one set, with their icons and tags.
            const group =
              el.classList.contains("project-card") && el.parentElement
                ? el.parentElement.querySelectorAll(":scope > .project-card.reveal")
                : [el];
            group.forEach((item) => {
              [item, ...item.querySelectorAll(".reveal-flow")].forEach((x) => {
                x.classList.add("in");
                revealObserver.unobserve(x);
              });
            });
          });
        },
        { rootMargin: "0px 0px -8% 0px" }
      )
    : null;

function observeReveal(root = document) {
  root.querySelectorAll(".reveal:not(.in), .reveal-flow:not(.in)").forEach((el) => {
    if (revealObserver) revealObserver.observe(el);
    else el.classList.add("in");
  });
}

/* ---------- Init ---------- */

document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.lang = getLang();
  renderHeader();

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-open-built]")) openBuiltModal();
  });

  document.addEventListener("langchange", () => {
    const modal = document.getElementById("built-modal");
    if (modal && modal.open) renderModal();
  });

  if (typeof renderPage === "function") renderPage();
  applyI18n();
  observeReveal();

  document.addEventListener("langchange", () => {
    if (typeof renderPage === "function") renderPage();
    applyI18n();
    document.querySelectorAll(".reveal, .reveal-flow").forEach((el) => el.classList.add("in"));
  });
});
