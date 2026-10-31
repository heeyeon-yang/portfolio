
function renderPage() {
  document.getElementById("all-experience").innerHTML = EXPERIENCE.map(expItemHTML).join("");
  document.getElementById("education").innerHTML = EDUCATION.map(expItemHTML).join("");
  document.getElementById("skills-certs").innerHTML = skillsHTML() + certsHTML();
  document.getElementById("resume").innerHTML = resumeHTML();
}
