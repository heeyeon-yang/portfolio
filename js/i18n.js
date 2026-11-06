
const UI_TEXT = {
  "nav.about": { en: "About me", ko: "소개" },
  "nav.projects": { en: "Projects", ko: "프로젝트" },
  "nav.experience": { en: "Experience", ko: "경험" },

  "banner.pill": { en: "How I built", ko: "How I built" },
  "banner.summary": {
    en: "Static site on S3, served through CloudFront.",
    ko: "S3 정적 호스팅 + CloudFront로 배포한 사이트입니다.",
  },
  "banner.more": { en: "Details", ko: "자세히" },

  "about.title": { en: "About me", ko: "소개" },
  "about.placeholder": { en: "Introduction coming soon.", ko: "소개 글 작성 예정" },
  "section.projects": { en: "Projects", ko: "프로젝트" },
  "section.side": { en: "Side projects", ko: "사이드 프로젝트" },
  "section.allProjects": { en: "See all projects", ko: "전체 프로젝트 보기" },
  "section.allSide": { en: "See all side projects", ko: "사이드 프로젝트 전체 보기" },
  "section.experience": { en: "Experience", ko: "경험" },
  "section.experienceTitle": { en: "Experience", ko: "경험" },
  "section.allExperience": { en: "See all experience", ko: "전체 경험 보기" },
  "section.education": { en: "Education", ko: "학력" },
  "section.skills": { en: "Skills & Certifications", ko: "기술 및 자격증" },
  "section.skillsTitle": { en: "Skills", ko: "기술" },
  "section.certs": { en: "Certifications", ko: "자격증" },

  "resume.title": { en: "Resume", ko: "이력서" },
  "resume.desc": { en: "Full resume in PDF.", ko: "전체 이력서를 PDF로 받을 수 있습니다." },
  "resume.btn": { en: "Download PDF", ko: "PDF 다운로드" },
  "resume.error": { en: "Try again shortly", ko: "잠시 후 다시 시도해 주세요" },

  "projects.title": { en: "Projects", ko: "프로젝트" },
  "projects.intro": {
    en: "Infrastructure projects with the problem, my role, and how it was verified.",
    ko: "각 프로젝트의 문제, 맡은 역할, 검증 방법을 정리했습니다.",
  },
  "projects.github": { en: "GitHub", ko: "GitHub" },
  "projects.details": { en: "How I built", ko: "How I built" },
  "filter.all": { en: "All", ko: "전체" },
  "filter.main": { en: "Main", ko: "메인" },
  "filter.side": { en: "Side", ko: "사이드" },
  "filter.empty": { en: "No projects in this combination yet.", ko: "이 조건에 맞는 프로젝트가 아직 없습니다." },
  "project.view": { en: "View details", ko: "자세히 보기" },
  "chip.team": { en: "Team project", ko: "팀 프로젝트" },
  "chip.personal": { en: "Personal project", ko: "개인 프로젝트" },
  "fact.period": { en: "Period", ko: "기간" },
  "fact.team": { en: "Team", ko: "인원" },
  "fact.role": { en: "Role", ko: "역할" },
  "project.back": { en: "All projects", ko: "전체 프로젝트" },
  "project.writeup": { en: "Detailed write-up coming soon.", ko: "상세 내용 작성 예정" },
  "project.notFound": { en: "Project not found.", ko: "프로젝트를 찾을 수 없습니다." },
  "project.prev": { en: "Previous", ko: "이전" },
  "project.next": { en: "Next", ko: "다음" },
  "project.highlights": { en: "Highlights", ko: "주요 내용" },
  "kind.main": { en: "Main project", ko: "메인 프로젝트" },
  "kind.side": { en: "Side project", ko: "사이드 프로젝트" },

  "experience.title": { en: "Experience", ko: "경험" },

  "modal.close": { en: "Close", ko: "닫기" },
  "modal.full": { en: "View full page", ko: "전체 보기" },
  "ops.title": { en: "Live status", ko: "운영 상태" },
  "ops.via": { en: "API Gateway → Lambda → DynamoDB", ko: "API Gateway → Lambda → DynamoDB" },
  "ops.visitors": { en: "Visitors", ko: "방문자 수" },
  "ops.latency": { en: "API response time", ko: "API 응답 시간" },
  "a11y.menu": { en: "Open menu", ko: "메뉴 열기" },
  "a11y.theme": { en: "Toggle dark mode", ko: "다크 모드 전환" },
  "a11y.lang": { en: "한국어로 보기", ko: "View in English" },
};

const LANG_KEY = "lang";

function getLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "en" || saved === "ko") return saved;
  } catch (e) {}
  return "en";
}

function setLang(lang) {
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  document.documentElement.lang = lang;
  applyI18n();
  document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
}

function t(key) {
  const entry = UI_TEXT[key];
  if (!entry) return key;
  return entry[getLang()] ?? entry.en;
}

function pick(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[getLang()] ?? value.en;
}

function applyI18n(root = document) {
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  root.querySelectorAll("[data-i18n-label]").forEach((el) => {
    el.setAttribute("aria-label", t(el.dataset.i18nLabel));
  });
}
