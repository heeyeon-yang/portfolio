// 랜딩 애니메이션
// 1. 카드가 위에서 일직선으로 떨어짐. 큰 글씨 줄들은 줄마다 조금씩 늦게 따라옴
// 2. 바닥에 닿는 순간 카드가 좌우로 살짝 흔들리고, 카드 뒤에서 아이콘이 튀어나감
//    텍스트는 줄별로 통통 튕기며 기울어진 채 멈추고, 작은 인사말은 이때 나타남
// 3. 카드가 가운데로 올라오면서 텍스트가 차례로 균형을 잡음 → 버튼 등장
// 4. 잠시 뒤 아이콘이 작아지면서 카드 아래에 기술 스택처럼 한 줄로 정렬됨
// 아이콘 위치는 Matter.js, 카드와 텍스트는 직접 계산. 그리는 건 전부 DOM(transform)
// 아이콘은 카드와 부딪히지 않음 → 카드 뒤 바닥에도 쌓이고, 카드가 올라가면 드러남

(function () {
  // 아이콘 크기: 카드 너비 대비 비율 (레퍼런스 기준 약 15%)
  const ICON_RATIO = 0.15;
  const ICON_MIN = 44;
  const ICON_MAX = 112;

  // 정렬된 기술 스택 줄
  // 정렬 후 크기와 간격은 이어서 흐르는 띠(marquee.js, .mq-item)와 같아야 끊기지 않음
  const STACK_SIZE = 44; // 정렬 후 아이콘 크기(px), 모바일은 STACK_SIZE_MOBILE
  const STACK_SIZE_MOBILE = 34;
  const STACK_GAP = 14; // 아이콘 사이 간격
  const STACK_MARGIN = 36; // 카드와 아이콘 줄 사이 간격
  const STACK_MAX_WIDTH = 960; // 아이콘 줄 최대 너비

  // 정렬 순서. 배열 하나가 한 묶음 (AWS → 컨테이너/배포 → IaC → 모니터링 → OS/언어/DB)
  const STACK_GROUPS = [
    ["aws", "eks", "rds", "lambda", "vpc", "cloudwatch"],
    ["docker", "kubernetes", "helm", "argocd"],
    ["terraform"],
    ["prometheus", "grafana"],
    ["linux", "python", "mysql"],
  ];
  // 한 줄에 다 안 들어가는 좁은 화면에서는 이 아이콘들을 빼고 AWS 로고로 합침
  const AWS_DETAIL = ["eks", "rds", "lambda", "vpc", "cloudwatch"];

  // 파일명: 마우스 올렸을 때 보이는 이름
  // 짝수 번째는 왼쪽, 홀수 번째는 오른쪽으로 던져짐 → 색이 한쪽에 몰리지 않게 순서 섞어둠
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

  // 타이밍 (ms)
  const START_DELAY = 150;
  const FALL_TIME = 700;
  const RISE_AFTER = 1300; // 착지 후 카드가 올라오기까지
  const RISE_TIME = 700;
  const HOME_POSITION = 0.36; // 카드+아이콘 묶음의 세로 위치 (0.5 = 정가운데, 작을수록 위로)
  const TIDY_START = 1500; // 착지 후 아이콘 정렬 시작까지 (카드가 올라오는 도중에 시작)
  const TIDY_TIME = 650;
  const TIDY_STAGGER = 20; // 아이콘마다 출발 시차
  const TIDY_EASE = "cubic-bezier(0.5, 0, 0.2, 1)"; // 천천히 떠오르지 않고 곧장 자리로

  // 텍스트 줄별 설정 (위에서부터 인사말, 이름, 직무)
  // lag:  떨어지는 동안 카드보다 뒤처지는 정도(px). 클수록 느리게 떨어지는 느낌
  // curve: 뒤처지는 곡선. 줄마다 달라서 떨어지는 동안 줄 사이 간격이 제각각 변함
  // speed: 착지 순간 줄이 계속 떨어지는 속도(px/frame)
  // tilt: 처음 바닥에 닿은 뒤 서서히 기울어지는 각도(deg). 좌우로 흔들리지는 않음
  // bounce: 튕기는 정도, weight: 무게(클수록 빨리 떨어짐), turn: 기울어지는 빠르기
  const LINE_SETUP = [
    { lag: 60, curve: 1.0, speed: 10, tilt: 2.5, bounce: 0.45, weight: 0.85, turn: 0.09 }, // 인사말: 가볍게 튐
    { lag: 36, curve: 1.6, speed: 12, tilt: -5, bounce: 0.42, weight: 1.15, turn: 0.05 }, // 이름: 무겁게 적게 튐
    { lag: 14, curve: 2.4, speed: 9, tilt: -1.5, bounce: 0.55, weight: 1.0, turn: 0.07 }, // 직무
  ];
  const TEXT_JITTER = 0.2; // 매번 줄마다 속도, 튕김, 기울기가 이 비율만큼 랜덤하게 달라짐

  // 텍스트 박스 물리 (카드 안에서만)
  const TEXT_GRAVITY = 1.1; // 줄이 떨어지는 가속도
  const TEXT_FLOOR_GAP = 40; // 카드 아래 끝에서 이만큼 위가 바닥
  const TEXT_BOX = 0.9; // 줄 높이 중 실제로 부딪히는 비율 (작을수록 글자끼리 더 붙음)
  const TEXT_KEEP_GAP = 0.6; // 줄 사이 여백(margin) 중 착지 후에도 남기는 비율

  const UP_ICONS = [3, 8, 13]; // 거의 위로 던질 아이콘 순번

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

  const engine = Engine.create({ enableSleeping: true }); // 멈춘 아이콘은 그 자리에 고정
  engine.gravity.y = 1.5;
  const world = engine.world;

  let W = 0;
  let H = 0;
  let top = 0; // 헤더+배너에 가려진 높이
  let iconPx = 64;
  let walls = [];
  let phase = "idle";
  let tidied = false; // 아이콘 정렬이 시작됐는지 (카드 움직임 phase와 따로)
  const icons = [];

  // 카드는 물리엔진 밖에서 직접 위치 계산
  const card = { x: 0, y: 0, w: 0, h: 0 };

  const rand = (a, b) => a + Math.random() * (b - a);
  const easeIn = (t) => t * t;
  const easeOut = (t) => 1 - Math.pow(1 - t, 2);
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  /* ---------- 스프링 (흔들림, 텍스트용) ---------- */

  function spring(k, c) {
    return { v: 0, vel: 0, to: 0, k, c };
  }
  function stepSpring(s) {
    s.vel += -s.k * (s.v - s.to) - s.c * s.vel;
    s.v += s.vel;
  }

  const rock = spring(0.12, 0.25); // 카드 좌우 흔들림(deg). 감쇠를 크게 해서 한 번 기울었다 바로 멈춤

  // 줄마다 위치(px)와 기울기(deg) 스프링
  const lines = Array.from(textEl.children).map((el, i) => ({
    el,
    cfg: LINE_SETUP[i] || LINE_SETUP[LINE_SETUP.length - 1],
    y: spring(0.1, 0.22),
    rot: spring(0.06, 0.45), // 감쇠를 크게 → 넘치거나 흔들리지 않고 기울기만 따라감
  }));
  const springs = [rock, ...lines.flatMap((l) => [l.y, l.rot])];

  /* ---------- 크기 ---------- */

  function measure() {
    W = hero.clientWidth;
    H = hero.clientHeight;
    top = -parseFloat(getComputedStyle(hero).marginTop) || 0;
    card.w = cardEl.offsetWidth;
    card.h = cardEl.offsetHeight;
    // 아이콘 크기는 처음 한 번만 정함. 리사이즈 때 바꾸면 이미 만든 아이콘과 크기가 어긋남
    if (!icons.length) iconPx = Math.round(Math.min(Math.max(card.w * ICON_RATIO, ICON_MIN), ICON_MAX));
  }

  function floorY() {
    return H - card.h / 2;
  }

  /* ---------- 정렬된 아이콘 줄 ---------- */

  function stackSize() {
    return W < 600 ? STACK_SIZE_MOBILE : STACK_SIZE;
  }

  // 정렬 순서대로 나열한 이름 목록 + 각 아이콘 앞 간격(묶음이 바뀌면 넓게)
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

  // 순서대로 채우다가 너비를 넘으면 다음 줄로. 묶음이 통째로 안 들어가면 묶음째 넘김
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

  // 전체가 한 줄에 안 들어가면 AWS 세부 아이콘을 빼서 핵심만 남김
  function stackLayout() {
    const size = stackSize();
    // 큰 화면에선 카드보다 넓어도 괜찮음. 이 너비에 한 줄로 안 들어가면 핵심만 남김
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

  // 아이콘의 정렬 위치. 숨겨지는 AWS 세부 아이콘은 AWS 로고 자리로 모이며 사라짐
  function stackSlot(name, layout) {
    const s = layout.slots[name] || layout.slots.aws;
    return {
      x: s.x,
      y: homeY() + card.h / 2 + STACK_MARGIN + s.row * (layout.size + STACK_GAP) + layout.size / 2,
      hidden: !layout.slots[name],
    };
  }

  // 최종 위치: 카드 + 아이콘 줄을 한 덩어리로 보고 보이는 영역 가운데에
  function homeY() {
    const block = card.h + STACK_MARGIN + stackGrid().height;
    const y = top + (H - top - block) * HOME_POSITION + card.h / 2;
    return Math.min(Math.max(y, top + card.h / 2 + 16), floorY());
  }

  /* ---------- 바디 ---------- */

  function buildWalls() {
    Composite.remove(world, walls);
    const T = 400;
    const filter = { category: WALL };
    const side = { isStatic: true, restitution: 0.45, friction: 0.2, collisionFilter: filter };
    const ground = { isStatic: true, restitution: 0.15, friction: 0.8, collisionFilter: filter };
    walls = [
      Bodies.rectangle(W / 2, H + T / 2, W * 3, T, ground),
      Bodies.rectangle(W / 2, -T / 2, W * 3, T, side), // 천장 (헤더 뒤)
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
        // 처음엔 벽하고만 부딪힘. 겹친 채로 서로 밀어내면 속도가 죽어서
        // 카드 영역을 빠져나간 뒤에 아이콘끼리 충돌을 켬
        collisionFilter: { category: ICON, mask: WALL },
      });
      icons.push({ body, el, name, solid: false });
    });
  }

  /* ---------- 카드 트윈 (순서대로 실행) ---------- */

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

  /* ---------- 시퀀스 ---------- */

  function drop() {
    phase = "drop";
    card.x = W / 2;
    card.y = -card.h / 2 - 20;
    render();
    hero.classList.add("ready");

    const fy = floorY();
    // 떨어질수록 줄마다 다른 만큼 뒤처짐 (줄별로 떨어지는 속도가 살짝 다르게 보임)
    tweenY(fy, FALL_TIME, easeIn, impact, (t) => {
      lines.forEach((l) => (l.y.v = l.y.to = -l.cfg.lag * Math.pow(t, l.cfg.curve)));
    });
    // 바닥에서 한 번 작게 튕김
    tweenY(fy - 30, 210, easeOut);
    tweenY(fy, 210, easeIn);
  }

  function impact() {
    phase = "burst";

    // 바닥에 닿는 순간 아주 잠깐 좌우로 기우뚱 (최대 약 1.3도, 0.4초 안에 멈춤)
    rock.vel = (Math.random() < 0.5 ? -1 : 1) * 0.9;


    // 인사말 등장
    hero.classList.add("landed");

    startText();

    burst();
    setTimeout(rise, RISE_AFTER);
    setTimeout(tidy, TIDY_START);
  }

  /* ---------- 텍스트 박스 물리 ----------
     카드가 멈춰도 줄들은 관성으로 계속 떨어짐 → 카드 바닥과 아랫줄에 부딪히며 튕김
     카드 기준 좌표로 계산하고, 카드가 튀어 오르거나 떨어질 때의 가속도도 반영 */

  let textOn = false;
  let prevCardY = 0;
  let prevCardV = 0;

  function startText() {
    lines.forEach((l) => {
      // 줄 위쪽 여백 일부를 박스에 포함 → 쌓여도 줄 간격이 어느 정도 유지됨
      const gap = (parseFloat(getComputedStyle(l.el).marginTop) || 0) * TEXT_KEEP_GAP;
      const box = l.el.offsetHeight * TEXT_BOX;
      // offsetTop은 이미 카드 기준 (카드가 position: absolute라서)
      l.top = l.el.offsetTop + (l.el.offsetHeight - box) / 2 - gap;
      l.box = box + gap;
      // 매번 조금씩 다르게
      const j = () => 1 + (Math.random() * 2 - 1) * TEXT_JITTER;
      l.y.vel = l.cfg.speed * j();
      l.bounce = Math.min(l.cfg.bounce * j(), 0.8);
      l.weight = l.cfg.weight * j();
      l.tilt = l.cfg.tilt * j();
      l.rot.k = l.cfg.turn;
      l.touched = false;
    });

    // 줄마다 자기 바닥(쌓였을 때 위치)을 미리 계산: 맨 아래 줄은 카드 바닥, 그 위는 아랫줄 위
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

  // 줄이 처음 바닥에 닿으면 그때부터 기울기 시작
  function touch(l) {
    if (l.touched) return;
    l.touched = true;
    l.rot.to = l.tilt;
  }

  // 줄마다 따로: 떨어지다 자기 바닥에 닿으면 튕김. 겹칠 때만 위 줄을 밀어냄
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
        // 밀려 올라갈 때는 아랫줄 속도만 이어받음 (반동을 더하면 위 줄이 카드 밖으로 튀어 나감)
        if (up.y.vel > down.y.vel) up.y.vel = down.y.vel;
      }
    }

    // 어떤 줄도 카드 위쪽 밖으로는 안 나가게
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
      // 카드 뒤 윗부분에서 나옴. 짝수는 왼쪽, 홀수는 오른쪽
      const side = i % 2 === 0 ? -1 : 1;
      Body.setPosition(body, {
        x: card.x + side * rand(card.w * 0.08, card.w * 0.42),
        y: card.y - card.h * 0.2 + rand(-card.h * 0.18, card.h * 0.18),
      });
      Body.setAngle(body, rand(-0.3, 0.3));
      Composite.add(world, body);

      // 부채꼴로 퍼짐: 대부분은 옆으로 낮게, 일부는 대각선으로, 두 개는 거의 위로 높게
      const up = UP_ICONS.includes(i);
      const high = !up && i % 3 === 2;
      const a = up ? rand(1.3, 1.45) : high ? rand(0.9, 1.2) : rand(0.15, 0.6); // 수평 기준 각도(rad)
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
    // 텍스트는 카드가 올라가는 곡선 그대로 따라가며 제자리/수평으로 돌아옴 (지연, 튕김 없음)
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

  // 바닥에 흩어진 아이콘을 작게 줄여서 카드 아래 한 줄로 모음
  // 이때부터 물리엔진은 손 떼고 CSS transition으로 이동
  function tidy() {
    if (tidied) return;
    if (drag) release();
    tidied = true;
    const layout = stackLayout();
    const order = stackItems(false).map((it) => it.name);

    icons.forEach(({ body, el, name }) => {
      Composite.remove(world, body);
      // 여러 바퀴 돈 각도를 -π~π로 줄여둠 (안 그러면 정렬하면서 빙글빙글 돎)
      const a = Math.atan2(Math.sin(body.angle), Math.cos(body.angle));
      el.style.transition = "none";
      el.style.transform = `translate(${body.position.x - iconPx / 2}px, ${body.position.y - iconPx / 2}px) rotate(${a}rad) scale(1)`;
      el.getBoundingClientRect(); // 위 상태를 먼저 적용시킴

      const delay = Math.max(order.indexOf(name), 0) * TIDY_STAGGER; // 정렬 순서대로 출발
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

  // 정렬된 상태에서 화면 크기가 바뀌면 바로 다시 배치
  function placeStack() {
    const layout = stackLayout();
    icons.forEach(({ el, name }) => {
      el.style.transition = "none";
      applySlot(el, name, layout);
    });
  }

  // 카드 영역을 빠져나간 아이콘부터 아이콘끼리 충돌을 켬
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

  // 모션 줄이기 설정이면 결과 상태(정렬된 아이콘 줄)만 바로 보여줌
  function skipToEnd() {
    card.x = W / 2;
    card.y = homeY();
    icons.forEach(({ el }) => el.classList.add("live"));
    phase = "done";
    tidied = true;
    placeStack();
    hero.classList.add("ready", "landed", "settled", "stacked");
  }

  /* ---------- 루프 ---------- */

  let raf = 0;
  let last = 0;
  let acc = 0;

  function frame(now) {
    runTween(now);

    acc += Math.min(now - (last || now), 100);
    last = now;
    // 카드 가속도 (프레임 기준). 텍스트가 카드 움직임에 반응하도록
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

    if (tidied) return; // 정렬 후엔 CSS가 위치를 잡음
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

  /* ---------- 아이콘 드래그 ---------- */

  let drag = null;

  function local(e) {
    const r = hero.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  stage.addEventListener("pointerdown", (e) => {
    const el = e.target.closest(".stack-icon");
    if (!el || tidied) return;
    const item = icons.find((i) => i.el === el);
    Sleeping.set(item.body, false); // 고정돼 있던 아이콘 깨우기
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

  /* ---------- 크기 / 언어 변경 ---------- */

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
    // 모바일 주소창 때문에 높이만 바뀌는 건 무시
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(refit, 150);
  });

  document.addEventListener("langchange", () => requestAnimationFrame(refit));

  /* ---------- 시작 ---------- */

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

  // 문구(i18n)가 채워진 다음, 폰트까지 받고 시작 (폰트는 최대 1.5초까지만 기다림)
  document.addEventListener("DOMContentLoaded", () => {
    requestAnimationFrame(() => {
      const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
      Promise.race([fontsReady, new Promise((r) => setTimeout(r, 1500))]).then(start);
    });
  });
})();
