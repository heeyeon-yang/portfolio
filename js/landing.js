
(function () {
  const ICON_RATIO = 0.15;
  const ICON_MIN = 44;
  const ICON_MAX = 112;

  const STACK_SIZE = 44;
  const STACK_SIZE_MOBILE = 34;
  const STACK_GAP = 14;
  const STACK_MARGIN = 36;
  const STACK_MAX_WIDTH = 960;

  const STACK_GROUPS = [
    ["aws", "eks", "rds", "lambda", "vpc", "cloudwatch"],
    ["docker", "kubernetes", "helm", "argocd"],
    ["terraform"],
    ["prometheus", "grafana"],
    ["linux", "python", "mysql"],
  ];
  const AWS_DETAIL = ["eks", "rds", "lambda", "vpc", "cloudwatch"];

  const TOOLS = {
    aws: "AWS",
    kubernetes: "Kubernetes",
    eks: "Amazon EKS",
    docker: "Docker",
    terraform: "Terraform",
    rds: "Amazon RDS",
    mysql: "MySQL",
    python: "Python",
    lambda: "AWS Lambda",
    linux: "Linux",
    cloudwatch: "Amazon CloudWatch",
    helm: "Helm",
    argocd: "Argo CD",
    vpc: "Amazon VPC",
    grafana: "Grafana",
    prometheus: "Prometheus",
  };

  const START_DELAY = 150;
  const FALL_TIME = 700;
  const RISE_AFTER = 1300;
  const RISE_TIME = 700;
  const HOME_POSITION = 0.36;
  const TIDY_START = 1500;
  const TIDY_TIME = 650;
  const TIDY_STAGGER = 20;
  const TIDY_EASE = "cubic-bezier(0.5, 0, 0.2, 1)";

  const LINE_SETUP = [
    { lag: 60, curve: 1.0, speed: 10, tilt: 2.5, bounce: 0.45, weight: 0.85, turn: 0.09 },
    { lag: 36, curve: 1.6, speed: 12, tilt: -5, bounce: 0.42, weight: 1.15, turn: 0.05 },
    { lag: 14, curve: 2.4, speed: 9, tilt: -1.5, bounce: 0.55, weight: 1.0, turn: 0.07 },
  ];
  const TEXT_JITTER = 0.2;

  const TEXT_GRAVITY = 1.1;
  const TEXT_FLOOR_GAP = 40;
  const TEXT_BOX = 0.9;
  const TEXT_KEEP_GAP = 0.6;

  const UP_ICONS = [3, 8, 13];

  const ICON = 0x0001;
  const WALL = 0x0004;
  const STEP = 1000 / 60;

  const hero = document.querySelector(".hero");
  const stage = document.getElementById("hero-stage");
  const cardEl = document.querySelector(".hero-card");
  const textEl = cardEl && cardEl.querySelector(".hero-text");
  if (!hero || !stage || !cardEl || !textEl) return;

  if (typeof Matter === "undefined") {
    hero.classList.add("ready", "landed", "settled");
    return;
  }

  const { Engine, Bodies, Body, Composite, Constraint, Sleeping, Vector } = Matter;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const engine = Engine.create({ enableSleeping: true });
  engine.gravity.y = 1.5;
  const world = engine.world;

  let W = 0;
  let H = 0;
  let top = 0;
  let iconPx = 64;
  let walls = [];
  let phase = "idle";
  let tidied = false;
  const icons = [];

  const card = { x: 0, y: 0, w: 0, h: 0 };

  const rand = (a, b) => a + Math.random() * (b - a);
  const easeIn = (t) => t * t;
  const easeOut = (t) => 1 - Math.pow(1 - t, 2);
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function spring(k, c) {
    return { v: 0, vel: 0, to: 0, k, c };
  }
  function stepSpring(s) {
    s.vel += -s.k * (s.v - s.to) - s.c * s.vel;
    s.v += s.vel;
  }

  const rock = spring(0.12, 0.25);

  const lines = Array.from(textEl.children).map((el, i) => ({
    el,
    cfg: LINE_SETUP[i] || LINE_SETUP[LINE_SETUP.length - 1],
    y: spring(0.1, 0.22),
    rot: spring(0.06, 0.45),
  }));
  const springs = [rock, ...lines.flatMap((l) => [l.y, l.rot])];

  function measure() {
    W = hero.clientWidth;
    H = hero.clientHeight;
    top = -parseFloat(getComputedStyle(hero).marginTop) || 0;
    card.w = cardEl.offsetWidth;
    card.h = cardEl.offsetHeight;
    if (!icons.length) iconPx = Math.round(Math.min(Math.max(card.w * ICON_RATIO, ICON_MIN), ICON_MAX));
  }

  function floorY() {
    return H - card.h / 2;
  }

  function stackSize() {
    return W < 600 ? STACK_SIZE_MOBILE : STACK_SIZE;
  }

  function stackItems(compact) {
    const items = [];
    STACK_GROUPS.forEach((group, g) => {
      group
        .filter((n) => TOOLS[n] && !(compact && AWS_DETAIL.includes(n)))
        .forEach((n, i, arr) =>
          items.push({
            name: n,
            gap: items.length === 0 ? 0 : STACK_GAP,
            groupStart: i === 0,
            groupLen: arr.length,
          })
        );
    });
    return items;
  }

  function layoutRows(items, size, maxW) {
    const rows = [[]];
    let x = 0;
    items.forEach((it) => {
      const gap = rows[rows.length - 1].length ? it.gap : 0;
      const need = it.groupStart ? it.groupLen * size + (it.groupLen - 1) * STACK_GAP : size;
      if (x + gap + need > maxW && rows[rows.length - 1].length) {
        rows.push([]);
        x = 0;
      }
      const row = rows[rows.length - 1];
      const g = row.length ? it.gap : 0;
      row.push({ ...it, x: x + g });
      x += g + size;
    });
    return rows.map((r) => ({ items: r, width: r.length ? r[r.length - 1].x + size : 0 }));
  }

  function stackLayout() {
    const size = stackSize();
    const maxW = Math.min(W - 48, STACK_MAX_WIDTH);
    let compact = false;
    let rows = layoutRows(stackItems(false), size, maxW);
    if (rows.length > 1) {
      compact = true;
      rows = layoutRows(stackItems(true), size, maxW);
    }
    const slots = {};
    rows.forEach((r, ri) => {
      r.items.forEach((it) => {
        slots[it.name] = { x: W / 2 - r.width / 2 + it.x + size / 2, row: ri };
      });
    });
    return { size, rows: rows.length, compact, slots, height: rows.length * size + (rows.length - 1) * STACK_GAP };
  }

  function stackGrid() {
    return stackLayout();
  }

  function stackSlot(name, layout) {
    const s = layout.slots[name] || layout.slots.aws;
    return {
      x: s.x,
      y: homeY() + card.h / 2 + STACK_MARGIN + s.row * (layout.size + STACK_GAP) + layout.size / 2,
      hidden: !layout.slots[name],
    };
  }

  function homeY() {
    const block = card.h + STACK_MARGIN + stackGrid().height;
    const y = top + (H - top - block) * HOME_POSITION + card.h / 2;
    return Math.min(Math.max(y, top + card.h / 2 + 16), floorY());
  }

  function buildWalls() {
    Composite.remove(world, walls);
    const T = 400;
    const filter = { category: WALL };
    const side = { isStatic: true, restitution: 0.45, friction: 0.2, collisionFilter: filter };
    const ground = { isStatic: true, restitution: 0.15, friction: 0.8, collisionFilter: filter };
    walls = [
      Bodies.rectangle(W / 2, H + T / 2, W * 3, T, ground),
      Bodies.rectangle(W / 2, -T / 2, W * 3, T, side),
      Bodies.rectangle(-T / 2, H / 2, T, H * 3, side),
      Bodies.rectangle(W + T / 2, H / 2, T, H * 3, side),
    ];
    Composite.add(world, walls);
  }

  function buildIcons() {
    Object.keys(TOOLS).forEach((name) => {
      const el = document.createElement("div");
      el.className = "stack-icon";
      el.style.width = el.style.height = iconPx + "px";
      el.title = TOOLS[name];
      el.dataset.name = name;
      el.innerHTML = `<img src="assets/icons/stack/${name}.svg" alt="" draggable="false">`;
      stage.appendChild(el);

      const body = Bodies.rectangle(0, 0, iconPx, iconPx, {
        chamfer: { radius: iconPx * 0.22 },
        density: 0.004,
        restitution: 0.35,
        friction: 0.4,
        frictionAir: 0.008,
        collisionFilter: { category: ICON, mask: WALL },
      });
      icons.push({ body, el, name, solid: false });
    });
  }

  let queue = [];
  let current = null;

  function tweenY(toY, dur, ease, onDone, onUpdate) {
    queue.push({ toY, dur, ease, onDone, onUpdate });
  }

  function runTween(now) {
    if (!current && queue.length) current = { ...queue.shift(), start: now, fromY: card.y };
    if (!current) return;
    const t = Math.min((now - current.start) / current.dur, 1);
    card.y = current.fromY + (current.toY - current.fromY) * current.ease(t);
    if (current.onUpdate) current.onUpdate(t);
    if (t === 1) {
      const done = current.onDone;
      current = null;
      done && done();
    }
  }

  function drop() {
    phase = "drop";
    card.x = W / 2;
    card.y = -card.h / 2 - 20;
    render();
    hero.classList.add("ready");

    const fy = floorY();
    tweenY(fy, FALL_TIME, easeIn, impact, (t) => {
      lines.forEach((l) => (l.y.v = l.y.to = -l.cfg.lag * Math.pow(t, l.cfg.curve)));
    });
    tweenY(fy - 30, 210, easeOut);
    tweenY(fy, 210, easeIn);
  }

  function impact() {
    phase = "burst";

    rock.vel = (Math.random() < 0.5 ? -1 : 1) * 0.9;

    hero.classList.add("landed");

    startText();

    burst();
    setTimeout(rise, RISE_AFTER);
    setTimeout(tidy, TIDY_START);
  }

  let textOn = false;
  let prevCardY = 0;
  let prevCardV = 0;

  function startText() {
    lines.forEach((l) => {
      const gap = (parseFloat(getComputedStyle(l.el).marginTop) || 0) * TEXT_KEEP_GAP;
      const box = l.el.offsetHeight * TEXT_BOX;
      l.top = l.el.offsetTop + (l.el.offsetHeight - box) / 2 - gap;
      l.box = box + gap;
      const j = () => 1 + (Math.random() * 2 - 1) * TEXT_JITTER;
      l.y.vel = l.cfg.speed * j();
      l.bounce = Math.min(l.cfg.bounce * j(), 0.8);
      l.weight = l.cfg.weight * j();
      l.tilt = l.cfg.tilt * j();
      l.rot.k = l.cfg.turn;
      l.touched = false;
    });

    let floorLine = card.h - TEXT_FLOOR_GAP;
    for (let i = lines.length - 1; i >= 0; i--) {
      const l = lines[i];
      l.floor = floorLine - (l.top + l.box);
      floorLine = l.top + l.floor;
    }

    prevCardY = card.y;
    prevCardV = 0;
    textOn = true;
  }

  function touch(l) {
    if (l.touched) return;
    l.touched = true;
    l.rot.to = l.tilt;
  }

  function stepText(cardAcc) {
    const g = TEXT_GRAVITY - Math.max(-2, Math.min(2, cardAcc));

    lines.forEach((l) => {
      l.y.vel += g * l.weight;
      l.y.v += l.y.vel;
      if (l.y.v > l.floor) {
        l.y.v = l.floor;
        if (l.y.vel > 0) {
          touch(l);
          l.y.vel = l.y.vel > 1.2 ? -l.y.vel * l.bounce : 0;
        }
      }
    });

    for (let i = lines.length - 2; i >= 0; i--) {
      const up = lines[i];
      const down = lines[i + 1];
      const overlap = up.top + up.y.v + up.box - (down.top + down.y.v);
      if (overlap > 0) {
        up.y.v -= overlap;
        if (up.y.vel > down.y.vel) up.y.vel = down.y.vel;
      }
    }

    lines.forEach((l) => {
      const minV = 12 - l.top;
      if (l.y.v < minV) {
        l.y.v = minV;
        if (l.y.vel < 0) l.y.vel = 0;
      }
    });
  }

  function burst() {
    const power = W < 600 ? 0.65 : 1;

    icons.forEach(({ body, el }, i) => {
      const side = i % 2 === 0 ? -1 : 1;
      Body.setPosition(body, {
        x: card.x + side * rand(card.w * 0.08, card.w * 0.42),
        y: card.y - card.h * 0.2 + rand(-card.h * 0.18, card.h * 0.18),
      });
      Body.setAngle(body, rand(-0.3, 0.3));
      Composite.add(world, body);

      const up = UP_ICONS.includes(i);
      const high = !up && i % 3 === 2;
      const a = up ? rand(1.3, 1.45) : high ? rand(0.9, 1.2) : rand(0.15, 0.6);
      const speed = up ? rand(25, 30) : high ? rand(20, 26) : rand(15, 21);
      Body.setVelocity(body, {
        x: side * Math.cos(a) * speed * power,
        y: -Math.sin(a) * speed * power,
      });
      Body.setAngularVelocity(body, rand(-0.12, 0.12));
      el.classList.add("live");
    });
  }

  function rise() {
    phase = "rise";
    textOn = false;
    const from = lines.map((l) => ({ y: l.y.v, rot: l.rot.v }));
    const settleText = (t) => {
      const k = 1 - easeInOut(t);
      lines.forEach((l, i) => {
        l.y.v = l.y.to = from[i].y * k;
        l.rot.v = l.rot.to = from[i].rot * k;
        l.y.vel = l.rot.vel = 0;
      });
    };
    tweenY(
      homeY(),
      RISE_TIME,
      easeInOut,
      () => {
        phase = "done";
        hero.classList.add("settled");
      },
      settleText
    );
  }

  function tidy() {
    if (tidied) return;
    if (drag) release();
    tidied = true;
    const layout = stackLayout();
    const order = stackItems(false).map((it) => it.name);

    icons.forEach(({ body, el, name }) => {
      Composite.remove(world, body);
      const a = Math.atan2(Math.sin(body.angle), Math.cos(body.angle));
      el.style.transition = "none";
      el.style.transform = `translate(${body.position.x - iconPx / 2}px, ${body.position.y - iconPx / 2}px) rotate(${a}rad) scale(1)`;
      el.getBoundingClientRect();

      const delay = Math.max(order.indexOf(name), 0) * TIDY_STAGGER;
      el.style.transition = `transform ${TIDY_TIME}ms ${TIDY_EASE} ${delay}ms, opacity 0.4s ease ${delay + TIDY_TIME * 0.4}ms`;
      applySlot(el, name, layout);
    });
    hero.classList.add("stacked");
  }

  function applySlot(el, name, layout) {
    const slot = stackSlot(name, layout);
    el.style.transform = `translate(${slot.x - iconPx / 2}px, ${slot.y - iconPx / 2}px) rotate(0rad) scale(${layout.size / iconPx})`;
    el.style.opacity = slot.hidden ? "0" : "1";
    el.style.pointerEvents = slot.hidden ? "none" : "";
  }

  function placeStack() {
    const layout = stackLayout();
    icons.forEach(({ el, name }) => {
      el.style.transition = "none";
      applySlot(el, name, layout);
    });
  }

  function updateSolid() {
    const left = card.x - card.w / 2;
    const right = card.x + card.w / 2;
    icons.forEach((item) => {
      if (item.solid || !item.el.classList.contains("live")) return;
      const b = item.body.bounds;
      if (b.max.x < left || b.min.x > right || b.max.y < card.y - card.h / 2) {
        item.body.collisionFilter.mask = WALL | ICON;
        item.solid = true;
      }
    });
  }

  function skipToEnd() {
    card.x = W / 2;
    card.y = homeY();
    icons.forEach(({ el }) => el.classList.add("live"));
    phase = "done";
    tidied = true;
    placeStack();
    hero.classList.add("ready", "landed", "settled", "stacked");
  }

  let raf = 0;
  let last = 0;
  let acc = 0;

  function frame(now) {
    runTween(now);

    acc += Math.min(now - (last || now), 100);
    last = now;
    const cardV = card.y - prevCardY;
    const cardAcc = cardV - prevCardV;
    prevCardY = card.y;
    prevCardV = cardV;

    while (acc >= STEP) {
      Engine.update(engine, STEP);
      if (textOn) {
        stepText(cardAcc);
        stepSpring(rock);
        lines.forEach((l) => stepSpring(l.rot));
      } else {
        springs.forEach(stepSpring);
      }
      acc -= STEP;
    }
    updateSolid();
    render();
    raf = requestAnimationFrame(frame);
  }

  function render() {
    cardEl.style.transform = `translate(${card.x - card.w / 2}px, ${card.y - card.h / 2}px) rotate(${rock.v}deg)`;

    lines.forEach((l) => {
      l.el.style.transform = `translateY(${l.y.v}px) rotate(${l.rot.v}deg)`;
    });

    if (tidied) return;
    icons.forEach(({ body, el }) => {
      el.style.transform = `translate(${body.position.x - iconPx / 2}px, ${body.position.y - iconPx / 2}px) rotate(${body.angle}rad)`;
    });
  }

  function play() {
    if (raf) return;
    last = 0;
    raf = requestAnimationFrame(frame);
  }

  function pause() {
    cancelAnimationFrame(raf);
    raf = 0;
  }

  let drag = null;

  function local(e) {
    const r = hero.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  stage.addEventListener("pointerdown", (e) => {
    const el = e.target.closest(".stack-icon");
    if (!el || tidied) return;
    const item = icons.find((i) => i.el === el);
    Sleeping.set(item.body, false);
    const p = local(e);
    const c = Constraint.create({
      pointA: p,
      bodyB: item.body,
      pointB: Vector.sub(p, item.body.position),
      stiffness: 0.2,
      damping: 0.1,
      length: 0,
    });
    Composite.add(world, c);
    drag = { c, el, body: item.body };
    el.classList.add("dragging");
    e.preventDefault();
  });

  window.addEventListener("pointermove", (e) => {
    if (!drag) return;
    drag.c.pointA = local(e);
    Sleeping.set(drag.body, false);
  });

  function release() {
    if (!drag) return;
    Composite.remove(world, drag.c);
    drag.el.classList.remove("dragging");
    drag = null;
  }
  window.addEventListener("pointerup", release);
  window.addEventListener("pointercancel", release);

  function refit() {
    measure();
    buildWalls();
    card.x = W / 2;
    if (phase === "done") card.y = homeY();
    if (tidied) {
      placeStack();
      render();
      return;
    }
    icons.forEach(({ body }) => {
      const x = Math.min(Math.max(body.position.x, iconPx), W - iconPx);
      const y = Math.min(body.position.y, H - iconPx);
      Sleeping.set(body, false);
      Body.setPosition(body, { x, y });
    });
    render();
  }

  let resizeTimer;
  let lastWidth = 0;
  window.addEventListener("resize", () => {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(refit, 150);
  });

  document.addEventListener("langchange", () => requestAnimationFrame(refit));

  function start() {
    measure();
    lastWidth = window.innerWidth;
    buildWalls();
    buildIcons();

    if (reduceMotion) skipToEnd();
    else setTimeout(drop, START_DELAY);

    new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : pause())).observe(hero);
    render();
  }

  document.addEventListener("DOMContentLoaded", () => {
    requestAnimationFrame(() => {
      const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
      Promise.race([fontsReady, new Promise((r) => setTimeout(r, 1500))]).then(start);
    });
  });
})();
