// 스크롤, 호버 효과 모음
// 빼고 싶은 효과는 아래 FX에서 false로 바꾸면 됨 (CSS는 <html>의 fx-이름 클래스로 켜지고 꺼짐)
// 랜딩 애니메이션(landing.js)은 건드리지 않음. hero 안에서는 버튼 효과와 정렬 후 아이콘 호버만 씀

const FX = {
  progress: true, // 헤더 아래 스크롤 진행 바
  stagger: true, // 동시에 나타나는 요소들이 차례로 등장, 태그가 하나씩 튀어나옴
  blur: true, // 등장할 때 흐렸다가 선명해짐
  wipe: false, // 큰 제목이 아래 선에서 밀려 올라오며 나타남
  eyebrow: false, // 섹션 라벨의 네모가 돌면서 나타나고 자간이 좁혀짐
  lines: true, // 목록 구분선이 왼쪽에서 그려짐
  cards: true, // 프로젝트 썸네일이 아래에서 열리며 등장
  tilt: true, // 프로젝트 썸네일이 마우스 방향으로 살짝 기울어짐
  spotlight: true, // 썸네일, 이력서 박스에 마우스를 따라오는 빛
  magnetic: false, // 버튼이 커서 쪽으로 살짝 끌려옴
  ctaFill: true, // Projects, Download PDF 버튼: 커서가 들어온 자리에서 초록이 번짐
  hop: true, // 정렬된 랜딩 아이콘에 마우스 올리면 통 튀고 옆 아이콘도 따라 튐
  crossGlow: true, // 랜딩 십자 배경: 커서 주변 십자가 초록색으로 은은하게 진해짐
  float: true, // 섹션(단락)이 화면에 들어올 때 스크롤에 맞춰 아래에서 살짝 떠오름
};

(function () {
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  // 모션 줄이기 설정이면 움직이는 효과는 끔
  if (reduce) {
    Object.keys(FX).forEach((k) => {
      if (k !== "progress") FX[k] = false;
    });
  }
  // 터치 기기에서는 마우스 따라가는 효과 끔
  if (!finePointer) FX.tilt = FX.spotlight = FX.magnetic = FX.crossGlow = false;

  Object.entries(FX).forEach(([k, on]) => on && root.classList.add("fx-" + k));

  // 정적인 제목들도 등장 효과 대상에 추가
  // (common.js가 DOMContentLoaded 때 .reveal을 한꺼번에 등록하므로 그 전에 붙여둠)
  document
    .querySelectorAll(".eyebrow, .split-title, .side-heading, .page-title, .page-intro")
    .forEach((el) => el.classList.add("reveal"));

  /* ---------- 차례로 등장 ----------
     같은 프레임에 .in이 붙은 요소끼리 순서대로 지연을 줌
     (MutationObserver는 화면 그리기 전에 돌아서 transition이 시작되기 전에 지연이 적용됨) */
  if (FX.stagger && "MutationObserver" in window) {
    let batch = 0;
    let pending = false;
    new MutationObserver((muts) => {
      muts.forEach(({ target: el }) => {
        if (!el.classList.contains("reveal") || !el.classList.contains("in") || el.dataset.fx) return;
        el.dataset.fx = "1";
        el.style.setProperty("--d", Math.min(batch++, 6) * 90 + "ms");
        if (!pending) {
          pending = true;
          requestAnimationFrame(() => {
            pending = false;
            batch = 0;
          });
        }
        // 등장이 끝나면 지연을 지워서 이후 hover 반응이 늦지 않게
        setTimeout(() => el.style.removeProperty("--d"), 2200);
      });
    }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ["class"] });
  }

  /* ---------- 스크롤에 연동되는 효과: 진행 바, 섹션 떠오르기 ---------- */
  let bar = null;
  if (FX.progress) {
    bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
  }

  let ticking = false;

  function onFrame() {
    ticking = false;
    // How I built 띠: 맨 위(랜딩만 보일 때)는 두껍게, 조금이라도 내리면 얇게
    root.classList.toggle("scrolled", scrollY > 8);
    const vh = innerHeight;
    if (bar) {
      const max = document.documentElement.scrollHeight - vh;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
    }

    // 섹션: 윗변이 화면 바닥 → 65% 지점을 지나는 동안 56px 아래에서 제자리로 올라옴
    // 스크롤 위치에 묶여 있어서 올렸다 내렸다 하면 같이 움직임. 랜딩(hero)은 제외
    if (FX.float) {
      document.querySelectorAll(".section:not(.hero) > .container").forEach((el) => {
        const top = el.parentElement.getBoundingClientRect().top;
        const p = Math.max(0, Math.min(1, (vh - top) / (vh * 0.35)));
        const k = 1 - (1 - p) * (1 - p); // 끝에서 부드럽게 멈춤
        el.style.translate = p >= 1 ? "" : `0 ${((1 - k) * 56).toFixed(1)}px`;
      });
    }
  }

  function requestTick() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onFrame);
    }
  }
  addEventListener("scroll", requestTick, { passive: true });
  addEventListener("resize", requestTick);
  // 렌더나 언어 전환 뒤에 생긴 요소에도 바로 적용
  document.addEventListener("DOMContentLoaded", requestTick);
  document.addEventListener("langchange", () => requestAnimationFrame(requestTick));
  requestTick();

  /* ---------- 썸네일 기울기 + 스포트라이트 ---------- */
  let lit = null;

  function unlight(el) {
    el.classList.remove("lit");
    el.style.removeProperty("--rx");
    el.style.removeProperty("--ry");
  }

  if (FX.tilt || FX.spotlight) {
    document.addEventListener("pointermove", (e) => {
      const t = e.target instanceof Element ? e.target : null;
      const card = t && t.closest(".project-card:not(.is-draft), .detail");
      const el = card ? card.querySelector(".thumb") : t && t.closest(".resume-cta");

      if (lit && lit !== el) unlight(lit);
      lit = el;
      if (!el) return;

      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      el.classList.add("lit");
      el.style.setProperty("--mx", x + "px");
      el.style.setProperty("--my", y + "px");

      if (FX.tilt && el.classList.contains("thumb")) {
        const px = Math.max(-0.5, Math.min(0.5, x / r.width - 0.5));
        const py = Math.max(-0.5, Math.min(0.5, y / r.height - 0.5));
        el.style.setProperty("--ry", (px * 7).toFixed(2) + "deg");
        el.style.setProperty("--rx", (-py * 7).toFixed(2) + "deg");
      }
    });
    document.addEventListener("pointerout", (e) => {
      if (!e.relatedTarget && lit) {
        unlight(lit);
        lit = null;
      }
    });
  }

  /* ---------- 랜딩 십자 배경: 커서 주변만 초록 ---------- */
  if (FX.crossGlow) {
    const hero = document.querySelector(".hero");
    if (hero) {
      hero.addEventListener("pointermove", (e) => {
        const r = hero.getBoundingClientRect();
        hero.style.setProperty("--hx", e.clientX - r.left + "px");
        hero.style.setProperty("--hy", e.clientY - r.top + "px");
        hero.classList.add("glow");
      });
      hero.addEventListener("pointerleave", () => hero.classList.remove("glow"));
    }
  }

  /* ---------- 자석 버튼 ---------- */
  if (FX.magnetic) {
    let pt = null;
    let queued = false;
    document.addEventListener("pointermove", (e) => {
      pt = e;
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        document.querySelectorAll("[data-magnetic]").forEach((el) => {
          // 랜딩 버튼은 애니메이션이 끝난 뒤에만
          const hero = el.closest(".hero");
          if (hero && !hero.classList.contains("settled")) return;
          const r = el.getBoundingClientRect();
          const dx = pt.clientX - (r.left + r.width / 2);
          const dy = pt.clientY - (r.top + r.height / 2);
          const pad = 32;
          const near = Math.abs(dx) < r.width / 2 + pad && Math.abs(dy) < r.height / 2 + pad;
          el.style.translate = near ? `${(dx * 0.16).toFixed(1)}px ${(dy * 0.28).toFixed(1)}px` : "";
        });
      });
    });
  }

  /* ---------- 초록 번짐 버튼(.btn-fill): 커서가 들어오고 나간 자리를 기준으로 ----------
     이력서 버튼은 나중에 그려지므로 document에서 위임 */
  if (FX.ctaFill) {
    const setOrigin = (e) => {
      const el = e.target instanceof Element && e.target.closest(".btn-fill");
      if (!el || el.contains(e.relatedTarget)) return; // 버튼 안에서 움직인 건 무시
      const r = el.getBoundingClientRect();
      el.style.setProperty("--bx", e.clientX - r.left + "px");
      el.style.setProperty("--by", e.clientY - r.top + "px");
    };
    document.addEventListener("pointerover", setOrigin);
    document.addEventListener("pointerout", setOrigin);
  }

  /* ---------- 정렬된 랜딩 아이콘: 통 튀기 ----------
     hover 상태가 아니라 클래스로 한 번 재생 → 튀어 오르다 커서가 벗어나도 끊기지 않음 */
  if (FX.hop) {
    const hop = (el, amp, delay) => {
      if (el.classList.contains("hop")) return;
      el.style.setProperty("--hop", amp + "px");
      el.style.animationDelay = delay + "ms";
      el.classList.add("hop");
      el.addEventListener(
        "animationend",
        () => {
          el.classList.remove("hop");
          el.style.animationDelay = "";
        },
        { once: true }
      );
    };

    document.addEventListener("pointerover", (e) => {
      const el = e.target instanceof Element && e.target.closest(".hero.stacked .stack-icon");
      if (!el || el.classList.contains("hop")) return;

      // 화면에 보이는 아이콘을 왼쪽부터 정렬해서 양옆 이웃을 찾음
      const row = [...document.querySelectorAll(".hero.stacked .stack-icon")]
        .filter((i) => i.style.opacity !== "0")
        .map((i) => ({ i, x: i.getBoundingClientRect().left }))
        .sort((a, b) => a.x - b.x)
        .map((o) => o.i);
      const idx = row.indexOf(el);

      hop(el, -12, 0);
      [
        [1, -6, 70],
        [2, -2.5, 140],
      ].forEach(([dist, amp, delay]) => {
        [row[idx - dist], row[idx + dist]].forEach((n) => n && hop(n, amp, delay));
      });
    });
  }
})();
