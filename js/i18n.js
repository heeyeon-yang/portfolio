// UI 문구 (en / ko)
// HTML에서는 data-i18n="key"로 연결. 프로젝트/경험 데이터는 각 data 파일에서 {en, ko}로 관리

const UI_TEXT = {
  "nav.projects": { en: "Projects", ko: "프로젝트" },
  "nav.experience": { en: "Experience", ko: "경험" },

  "banner.pill": { en: "How I built", ko: "How I built" },
  "banner.summary": {
    en: "Static site on S3, served through CloudFront.",
    ko: "S3 정적 호스팅 + CloudFront로 배포한 사이트입니다.",
  },
  "banner.more": { en: "Details", ko: "자세히" },

  "hero.greet": { en: "Hello, I'm", ko: "안녕하세요, 저는" },
  "hero.name": { en: "Heeyeon Yang", ko: "양희연" },
  "hero.title": { en: "Cloud & Infrastructure Engineer", ko: "Cloud & Infrastructure Engineer" },
  "hero.cta": { en: "Projects", ko: "프로젝트" },

  "section.projects": { en: "Projects", ko: "프로젝트" },
  "section.side": { en: "Side projects", ko: "사이드 프로젝트" },
  "section.allProjects": { en: "All projects", ko: "전체 프로젝트" },
  "section.experience": { en: "Experience", ko: "경험" },
  "section.experienceTitle": { en: "Hands-on experience", ko: "주요 경험" },
  "section.allExperience": { en: "See all experience", ko: "전체 경험 보기" },
  "section.education": { en: "Education", ko: "학력" },
  "section.skills": { en: "Skills & Certifications", ko: "기술 및 자격증" },
  "section.skillsTitle": { en: "Tools I work with", ko: "사용하는 기술" },

  "resume.title": { en: "Resume", ko: "이력서" },
  "resume.desc": { en: "Full resume in PDF.", ko: "전체 이력서를 PDF로 받을 수 있습니다." },
  "resume.btn": { en: "Download PDF", ko: "PDF 다운로드" },

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
  "kind.main": { en: "Main project", ko: "메인 프로젝트" },
  "kind.side": { en: "Side project", ko: "사이드 프로젝트" },

  "experience.title": { en: "Experience", ko: "경험" },

  "modal.close": { en: "Close", ko: "닫기" },
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
  return "en"; // 기본은 영어
}

function setLang(lang) {
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  document.documentElement.lang = lang;
  applyI18n();
  // 페이지별 렌더 함수들이 이 이벤트를 듣고 다시 그림
  document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
}

function t(key) {
  const entry = UI_TEXT[key];
  if (!entry) return key;
  return entry[getLang()] ?? entry.en;
}

// {en, ko} 객체나 문자열 둘 다 받음
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
