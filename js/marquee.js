
(function () {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ORDER = [
    "aws", "eks", "rds", "lambda", "vpc", "cloudwatch",
    "docker", "kubernetes", "helm", "argocd",
    "terraform",
    "prometheus", "grafana",
    "linux", "python", "mysql",
  ];
  const SPEED = 36;
  const FADE_MS = 200;

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
    band.innerHTML = `<div class="mq-track">${items}${items}</div>`;
    const ref = hero.querySelector('.stack-icon img[src$="/aws.svg"]');
    if (ref) band.style.setProperty("--mq-size", ref.parentElement.getBoundingClientRect().width + "px");
    hero.appendChild(band);
    place();

    const track = band.querySelector(".mq-track");
    const loop = track.scrollWidth / 2;
    const duration = loop / SPEED;
    track.style.animationDuration = duration + "s";

    const aws = hero.querySelector('.stack-icon img[src$="/aws.svg"]');
    if (aws) {
      const offset = aws.parentElement.getBoundingClientRect().left - band.getBoundingClientRect().left;
      const progress = (((loop - offset) % loop) + loop) % loop / loop;
      track.style.animationDelay = -(progress * duration) + "s";
    }

    requestAnimationFrame(() => hero.classList.add("marquee-on"));
    setTimeout(() => hero.classList.add("marquee-run"), FADE_MS);
  }

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
    setTimeout(go, 2000);
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

  addEventListener("resize", () => requestAnimationFrame(place));
})();
