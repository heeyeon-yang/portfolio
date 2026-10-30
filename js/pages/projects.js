// Projects 페이지

const FILTER_MIN = 6; // 이 개수 이상이면 필터 노출
let currentFilter = "all";

function filterOptions() {
  // 메인/사이드 + 데이터에 있는 카테고리 자동 수집
  const categories = [...new Set(PROJECTS.map((p) => p.category).filter(Boolean))];
  return [
    { key: "all", label: t("filter.all") },
    { key: "type:main", label: t("filter.main") },
    { key: "type:side", label: t("filter.side") },
    ...categories.map((c) => ({ key: `cat:${c}`, label: c })),
  ];
}

function matches(p) {
  if (currentFilter === "all") return true;
  const [kind, value] = currentFilter.split(":");
  return kind === "type" ? p.type === value : p.category === value;
}

function renderFilters() {
  const bar = document.getElementById("filter-bar");
  if (PROJECTS.length < FILTER_MIN) {
    bar.hidden = true;
    return;
  }
  bar.hidden = false;
  bar.innerHTML = filterOptions()
    .map(
      (f) =>
        `<button class="filter-btn" type="button" data-filter="${f.key}" aria-pressed="${f.key === currentFilter}">${f.label}</button>`
    )
    .join("");
}

function detailHTML(p) {
  const points = pick(p.points) || [];
  const links = [];
  if (p.links && p.links.github) {
    links.push(
      `<a class="btn btn-outline" href="${p.links.github}" target="_blank" rel="noopener">${ICONS.github}<span>${t("projects.github")}</span></a>`
    );
  }
  if (p.modal) {
    links.push(`<button class="btn btn-outline" type="button" data-open-built><span>${t("projects.details")}</span>${ICONS.arrowRight}</button>`);
  }

  return `
    <article class="detail reveal" id="${p.id}">
      ${thumbHTML(p.diagram, p.stack)}
      <div>
        <p class="detail-kind">${t(p.type === "main" ? "kind.main" : "kind.side")}</p>
        <h2>${pick(p.title)}</h2>
        <div class="detail-meta">
          <span>${p.meta.period}</span>
          <span>${pick(p.meta.team)}</span>
          <span>${pick(p.meta.role)}</span>
        </div>
        <p class="detail-summary">${pick(p.summary)}</p>
        ${points.length ? `<ul class="detail-points">${points.map((x) => `<li>${x}</li>`).join("")}</ul>` : ""}
        ${tagsHTML(p.tags)}
        ${links.length ? `<div class="detail-links">${links.join("")}</div>` : ""}
      </div>
    </article>
  `;
}

function renderList() {
  // 메인 먼저, 그 다음 사이드
  const sorted = [...PROJECTS].sort((a, b) => (a.type === b.type ? 0 : a.type === "main" ? -1 : 1));
  document.getElementById("project-list").innerHTML = sorted.filter(matches).map(detailHTML).join("");
}

function renderPage() {
  renderFilters();
  renderList();
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-filter]");
  if (!btn) return;
  currentFilter = btn.dataset.filter;
  renderPage();
  observeReveal();
});
