const projectId = new URLSearchParams(location.search).get("id");
const LIST = PROJECTS.filter((p) => !p.draft);

document.addEventListener("click", (e) => {
  const back = e.target.closest("[data-back]");
  if (!back) return;
  const ref = document.referrer;
  if (ref && new URL(ref).origin === location.origin && history.length > 1) {
    e.preventDefault();
    history.back();
  }
});

function renderPage() {
  const root = document.getElementById("project-root");
  const i = LIST.findIndex((p) => p.id === projectId);
  const p = LIST[i];

  const back = `<a class="back-link" href="projects.html" data-back>&larr; ${t("project.back")}</a>`;

  if (!p) {
    root.innerHTML = `${back}<p class="empty-note">${t("project.notFound")}</p>`;
    return;
  }
  document.title = `${pick(p.title)} — Heeyeon Yang`;

  const points = pick(p.points) || [];
  const sections = p.sections || [];
  const figure = p.figure
    ? `<figure class="project-figure${p.figureSize === "narrow" ? " is-narrow" : ""}"><button class="figure-open" type="button" data-zoom="${p.figure}" aria-label="${pick(p.title)} architecture"><img src="${p.figure}" alt="${pick(p.title)} architecture"></button></figure>`
    : "";
  // Show the diagram right after the Architecture section; fall back to the top.
  const figureAfter = sections.find((s) => s.heading.en === "Architecture");
  const figureAtTop = figure && !figureAfter;
  const links = [];
  if (p.links && p.links.github) {
    links.push(`<a class="btn btn-outline" href="${p.links.github}" target="_blank" rel="noopener">${ICONS.github}<span>${t("projects.github")}</span></a>`);
  }
  if (p.modal) {
    links.push(`<button class="btn btn-outline" type="button" data-open-built><span>${t("projects.details")}</span>${ICONS.arrowRight}</button>`);
  }

  const prev = LIST[i - 1];
  const next = LIST[i + 1];
  const navLink = (q, dir) =>
    q
      ? `<a class="pager-link ${dir}" href="${projectURL(q)}"><span class="pager-label">${t("project." + dir)}</span><span class="pager-title">${pick(q.title)}</span></a>`
      : "<span></span>";

  root.innerHTML = `
    ${back}
    <header class="project-head">
      <p class="detail-kind">${t(p.type === "main" ? "kind.main" : "kind.side")}</p>
      <h1 class="project-title">${pick(p.title)}</h1>
      <div class="detail-meta">
        <span>${p.meta.period}</span>
        <span>${pick(p.meta.team)}</span>
        <span>${pick(p.meta.role)}</span>
      </div>
      <p class="project-summary">${pick(p.summary)}</p>
      ${tagsHTML(p.tags)}
      ${links.length ? `<div class="detail-links">${links.join("")}</div>` : ""}
    </header>

    <div class="project-body">
      ${points.length ? `<section><h2>${t("project.highlights")}</h2><ul class="detail-points">${points.map((x) => `<li>${x}</li>`).join("")}</ul></section>` : ""}
      ${figureAtTop ? `<section>${figure}</section>` : ""}
      ${sections
        .map((s) => `<section><h2>${pick(s.heading)}</h2><p>${pick(s.body)}</p>${s === figureAfter ? figure : ""}</section>`)
        .join("")}
      ${sections.length ? "" : `<p class="empty-note">${t("project.writeup")}</p>`}
    </div>

    <nav class="pager">${navLink(prev, "prev")}${navLink(next, "next")}</nav>
  `;
}

/* ---------- Diagram lightbox ---------- */

function ensureLightbox() {
  let box = document.getElementById("lightbox");
  if (box) return box;
  box = document.createElement("dialog");
  box.id = "lightbox";
  box.className = "lightbox";
  box.innerHTML = `
    <button class="icon-btn lightbox-close" type="button" data-close aria-label="${t("modal.close")}">${ICONS.close}</button>
    <div class="lightbox-body"><img alt=""></div>
  `;
  document.body.appendChild(box);
  box.querySelector("[data-close]").addEventListener("click", () => box.close());
  box.addEventListener("click", (e) => {
    if (e.target === box || e.target.classList.contains("lightbox-body")) box.close();
  });
  return box;
}

document.addEventListener("click", (e) => {
  const trigger = e.target.closest("[data-zoom]");
  if (!trigger) return;
  const box = ensureLightbox();
  const img = box.querySelector("img");
  const src = trigger.querySelector("img");
  img.src = trigger.dataset.zoom;
  img.alt = src ? src.alt : "";
  if (src && src.naturalWidth) box.style.setProperty("--ar", src.naturalWidth / src.naturalHeight);
  box.showModal();
  box.querySelector(".lightbox-body").scrollTo(0, 0);
});
