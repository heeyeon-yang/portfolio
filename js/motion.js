
const FX = {
  progress: true,
  stagger: true,
  blur: true,
  wipe: false,
  eyebrow: false,
  lines: true,
  cards: true,
  tilt: true,
  spotlight: true,
  magnetic: false,
  ctaFill: true,
  hop: true,
  crossGlow: true,
  float: true,
};

(function () {
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (reduce) {
    Object.keys(FX).forEach((k) => {
      if (k !== "progress") FX[k] = false;
    });
  }
  if (!finePointer) FX.tilt = FX.spotlight = FX.magnetic = FX.crossGlow = false;

  Object.entries(FX).forEach(([k, on]) => on && root.classList.add("fx-" + k));

  document
    .querySelectorAll(".eyebrow, .split-title, .side-heading, .page-title, .page-intro")
    .forEach((el) => el.classList.add("reveal"));

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
        setTimeout(() => el.style.removeProperty("--d"), 2200);
      });
    }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ["class"] });
  }

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
    root.classList.toggle("scrolled", scrollY > 8);
    const vh = innerHeight;
    if (bar) {
      const max = document.documentElement.scrollHeight - vh;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
    }

    if (FX.float) {
      document.querySelectorAll(".section:not(.hero) > .container").forEach((el) => {
        const top = el.parentElement.getBoundingClientRect().top;
        const p = Math.max(0, Math.min(1, (vh - top) / (vh * 0.35)));
        const k = 1 - (1 - p) * (1 - p);
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
  document.addEventListener("DOMContentLoaded", requestTick);
  document.addEventListener("langchange", () => requestAnimationFrame(requestTick));
  requestTick();

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

  if (FX.ctaFill) {
    const setOrigin = (e) => {
      const el = e.target instanceof Element && e.target.closest(".btn-fill");
      if (!el || el.contains(e.relatedTarget)) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--bx", e.clientX - r.left + "px");
      el.style.setProperty("--by", e.clientY - r.top + "px");
    };
    document.addEventListener("pointerover", setOrigin);
    document.addEventListener("pointerout", setOrigin);
  }

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
