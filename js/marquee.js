// 랜딩 기술 스택 줄 → 무한으로 흐르는 띠
// landing.js는 건드리지 않음. 아이콘 정렬(.stacked)이 끝나면 그 줄 자리에 띠를 겹쳐 띄우고
// 정렬된 아이콘들은 투명하게 숨김. 위치는 숨긴 아이콘들의 위치를 그대로 읽어서 맞춤

(function () {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  // 모션 줄이기 설정이면 띠 대신 정렬된 줄 그대로
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // landing.js의 정렬 순서와 같게 (AWS → 컨테이너/배포 → IaC → 모니터링 → OS/언어/DB)
  const ORDER = [
    "aws", "eks", "rds", "lambda", "vpc", "cloudwatch",
    "docker", "kubernetes", "helm", "argocd",
    "terraform",
    "prometheus", "grafana",
    "linux", "python", "mysql",
  ];
  const SPEED = 36; // 초당 이동 거리(px)
  const FADE_MS = 200; // 띠가 겹쳐서 나타나는 시간 (CSS .stack-marquee transition과 같게). 같은 그림이라 짧아도 티 안 남

  let band = null;

  function build() {
    const icons = [...hero.querySelectorAll(".stack-icon")];
    const byName = {};
    icons.forEach((el) => {
      const img = el.querySelector("img");
      const name = img && img.getAttribute("src").split("/").pop().replace(".svg", "");
      if (name) byName[name] = { src: img.getAttribute("src"), title: el.title };
    });
    const items = ORDER.filter((n) => byName[n])
      .map((n) => `<span class="mq-item" title="${byName[n].title}"><img src="${byName[n].src}" alt=""></span>`)
      .join("");

    band = document.createElement("div");
    band.className = "stack-marquee";
    band.setAttribute("aria-hidden", "true");
    // 같은 목록을 두 번 이어 붙이고 -50%까지 이동 → 이음새 없이 반복
    band.innerHTML = `<div class="mq-track">${items}${items}</div>`;
    // 아이콘 크기는 정렬된 아이콘의 실제 크기를 그대로 (데스크톱 44px, 모바일 34px)
    const ref = hero.querySelector('.stack-icon img[src$="/aws.svg"]');
    if (ref) band.style.setProperty("--mq-size", ref.parentElement.getBoundingClientRect().width + "px");
    hero.appendChild(band);
    place();

    const track = band.querySelector(".mq-track");
    const loop = track.scrollWidth / 2; // 목록 하나 길이 = 한 바퀴
    const duration = loop / SPEED;
    track.style.animationDuration = duration + "s";

    // 띠의 첫 아이콘(AWS)이 정렬된 AWS 아이콘과 정확히 겹치는 지점에서 시작
    // 애니메이션은 0 → -loop로 움직이므로, 원하는 위치(offset - loop)에 해당하는 시간만큼 앞당김
    const aws = hero.querySelector('.stack-icon img[src$="/aws.svg"]');
    if (aws) {
      const offset = aws.parentElement.getBoundingClientRect().left - band.getBoundingClientRect().left;
      const progress = (((loop - offset) % loop) + loop) % loop / loop;
      track.style.animationDelay = -(progress * duration) + "s";
    }

    // 1) 띠를 정렬된 줄 위에 겹쳐서 서서히 보이게(같은 그림이라 티가 안 남)
    // 2) 다 보이면 아래 아이콘을 숨기고 흐르기 시작
    requestAnimationFrame(() => hero.classList.add("marquee-on"));
    setTimeout(() => hero.classList.add("marquee-run"), FADE_MS);
  }

  // 띠의 세로 위치 = 정렬된 아이콘 줄의 가운데
  function place() {
    if (!band) return;
    const heroTop = hero.getBoundingClientRect().top;
    const shown = [...hero.querySelectorAll(".stack-icon")].filter((el) => el.style.opacity !== "0");
    if (!shown.length) return;
    const ys = shown.map((el) => {
      const r = el.getBoundingClientRect();
      return r.top + r.height / 2 - heroTop;
    });
    band.style.top = Math.min(...ys) + "px";
  }

  // .stacked가 붙으면, 아이콘들이 전부 자리에 도착하는 순간(transitionend) 바로 띠로 바꿈
  const start = () => {
    const icons = [...hero.querySelectorAll(".stack-icon")];
    let left = icons.length;
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      build();
    };
    icons.forEach((el) =>
      el.addEventListener("transitionend", function onEnd(e) {
        if (e.target !== el || e.propertyName !== "transform") return;
        el.removeEventListener("transitionend", onEnd);
        if (--left <= 0) go();
      })
    );
    setTimeout(go, 2000); // 혹시 이벤트를 못 받아도 넘어가게
  };
  if (hero.classList.contains("stacked")) start();
  else {
    const mo = new MutationObserver(() => {
      if (hero.classList.contains("stacked")) {
        mo.disconnect();
        start();
      }
    });
    mo.observe(hero, { attributes: true, attributeFilter: ["class"] });
  }

  // 화면 크기가 바뀌면 landing.js가 숨긴 아이콘들을 다시 배치하므로 그 위치를 다시 읽음
  addEventListener("resize", () => requestAnimationFrame(place));
})();
