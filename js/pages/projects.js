
const REAL = PROJECTS.filter((p) => !p.draft);

const typeParam = new URLSearchParams(location.search).get("type");
let typeFilter = typeParam === "main" || typeParam === "side" ? typeParam : "all";
let topicFilter = "all";

function matches(p) {
  return (typeFilter === "all" || p.type === typeFilter) && (topicFilter === "all" || p.topic === topicFilter);
}

function renderFilters() {
  const bar = document.getElementById("filter-bar");
  bar.hidden = false;
  const btn = (group, key, label, on) =>
    `<button class="filter-btn" type="button" data-group="${group}" data-key="${key}" aria-pressed="${on}">${label}</button>`;

  const types = [
    ["all", t("filter.all")],
    ["main", t("filter.main")],
    ["side", t("filter.side")],
  ].map(([k, label]) => btn("type", k, label, typeFilter === k));

  const used = new Set(REAL.map((p) => p.topic));
  const topics = Object.keys(TOPICS)
    .filter((k) => used.has(k))
    .map((k) => btn("topic", k, pick(TOPICS[k]), topicFilter === k));

  bar.innerHTML = `
    <div class="filter-group" role="group">${types.join("")}</div>
    <span class="filter-divider" aria-hidden="true"></span>
    <div class="filter-group" role="group">${topics.join("")}</div>
  `;
}

function detailHTML(p) {
  const points = pick(p.points) || [];
  const github =
    p.links && p.links.github
      ? `<a class="btn btn-outline btn-icon" href="${p.links.github}" target="_blank" rel="noopener" aria-label="GitHub" title="GitHub">${ICONS.github}</a>`
      : "";

  return `
    <article class="detail reveal" id="${p.id}">
      <div class="detail-side">
        ${thumbHTML(p.diagram, p.stack, p.flow, p.tint)}
        <dl class="detail-facts">
          <div><dt>${t("fact.period")}</dt><dd>${p.meta.period}</dd></div>
          <div><dt>${t("fact.team")}</dt><dd>${pick(p.meta.team)}</dd></div>
          <div><dt>${t("fact.role")}</dt><dd>${pick(p.meta.role)}</dd></div>
        </dl>
        <div class="detail-links">
          <a class="btn btn-primary" href="${projectURL(p)}"><span>${t("project.view")}</span>${ICONS.arrowRight}</a>
          ${github}
        </div>
      </div>
      <div>
        <p class="detail-kind">${t(p.type === "main" ? "kind.main" : "kind.side")}</p>
        <h2><a class="detail-title-link" href="${projectURL(p)}">${pick(p.title)}</a></h2>
        ${tagsHTML(p.tags)}
        <p class="detail-summary">${pick(p.summary)}</p>
        ${points.length ? `<ul class="detail-points">${points.map((x) => `<li>${x}</li>`).join("")}</ul>` : ""}
      </div>
    </article>
  `;
}

function renderList() {
  const sorted = [...REAL].sort((a, b) => (a.type === b.type ? 0 : a.type === "main" ? -1 : 1));
  const list = sorted.filter(matches);
  document.getElementById("project-list").innerHTML = list.length
    ? list.map(detailHTML).join("")
    : `<p class="empty-note">${t("filter.empty")}</p>`;
}

function renderPage() {
  renderFilters();
  renderList();
}

addEventListener("load", () => {
  const el = location.hash && document.getElementById(location.hash.slice(1));
  if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
});

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-group]");
  if (!btn) return;
  const { group, key } = btn.dataset;
  if (group === "type") typeFilter = key;
  else topicFilter = topicFilter === key ? "all" : key;
  renderPage();
  observeReveal();
});
