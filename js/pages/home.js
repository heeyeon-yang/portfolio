
function renderPage() {
  const main = PROJECTS.filter((p) => p.type === "main");
  const side = PROJECTS.filter((p) => p.type === "side");

  document.getElementById("main-projects").innerHTML = main.map(projectCardHTML).join("");
  document.getElementById("side-projects").innerHTML = side.map(sideItemHTML).join("");

  document.getElementById("featured-experience").innerHTML = EXPERIENCE
    .filter((e) => e.featured)
    .map(expItemHTML)
    .join("");

  document.getElementById("skills-certs").innerHTML = skillsHTML() + certsHTML();
  document.getElementById("resume").innerHTML = resumeHTML();
}
