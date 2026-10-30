// 프로젝트 상세 페이지 (project.html?id=프로젝트id)
// 지금은 기본 틀만. 본문은 projects.js 데이터에 sections를 넣으면 그대로 나옴
//   sections: [{ heading: {en, ko}, body: {en, ko} }, ...]

const projectId = new URLSearchParams(location.search).get("id");
const LIST = PROJECTS.filter((p) => !p.draft);

// "전체 프로젝트"로 돌아갈 때: 이 사이트 안에서 왔으면 뒤로 가기(보던 스크롤 위치 그대로)
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

    <div class="project-figure">${thumbHTML(p.diagram, p.stack)}</div>

    <div class="project-body">
      ${points.length ? `<section><h2>${t("project.highlights")}</h2><ul class="detail-points">${points.map((x) => `<li>${x}</li>`).join("")}</ul></section>` : ""}
      ${sections.map((s) => `<section><h2>${pick(s.heading)}</h2><p>${pick(s.body)}</p></section>`).join("")}
      ${sections.length ? "" : `<p class="empty-note">${t("project.writeup")}</p>`}
    </div>

    <nav class="pager">${navLink(prev, "prev")}${navLink(next, "next")}</nav>
  `;
}
