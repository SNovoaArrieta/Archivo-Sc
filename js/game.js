const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

const sceneCard = document.querySelector("#scene-card");
const sceneKicker = document.querySelector("#scene-kicker");
const sceneTitle = document.querySelector("#scene-title");
const sceneCopy = document.querySelector("#scene-copy");
const sceneActions = document.querySelector("#scene-actions");
const missionLabel = document.querySelector("#mission-label");
const gameHud = document.querySelector("#game-hud");
const hudTitle = document.querySelector("#hud-title");
const hudHelp = document.querySelector("#hud-help");
const hudProgress = document.querySelector("#hud-progress");
const finalCard = document.querySelector("#final-card");
const finalMessage = document.querySelector("#final-message");
const soundToggle = document.querySelector("#sound-toggle");
const toast = document.querySelector("#toast");

const W = 1280;
const H = 720;

const FINAL_MESSAGE = `Bueno bonita, sobrevivimos 😂
No sé cómo, pero recuperamos la banana y llegamos hasta el final.

Obviamente tenía que inventarme alguna bobada para hoy porque no iba a dejar pasar Amor y Amistad como si nada.

Solo quería hacer algo diferente contigo, hacerte reír un rato y recordarte que eres muy importante para mí.

Me gusta tenerte en mi vida, compartir contigo hasta las cosas más simples, molestarte, escucharte y pasar tiempo contigo aunque nos toque hacerlo detrás de una pantalla.

Y sé que últimamente has estado cansada y con muchas cosas encima, así que hoy no quería complicarte la vida con nada. Solo quería robarte un ratito para nosotras y verte sonreír.

Y sí… todo esto fue una excusa elaboradísima para decirte que te quiero.

MISIÓN FINAL: quedarte conmigo un rato más. 🍌`;

const state = {
  scene: "cover",
  elapsed: 0,
  sceneTime: 0,
  sound: false,
  input: new Set(),
  choiceHistory: [],
  messageTimer: null,
  chase: {
    distance: 0,
    scroll: 0,
    playerX: 330,
    y: 0,
    vy: 0,
    grounded: true,
    stun: 0,
    spawn: 1.1,
    obstacles: [],
    funnyBeat: 0,
  },
  secret: {
    x: 150,
    y: 535,
    speed: 220,
    found: new Set(),
    items: [
      { id: "lego", x: 355, y: 475, label: "LEGO" },
      { id: "music", x: 725, y: 280, label: "MÚSICA" },
      { id: "heart", x: 955, y: 495, label: "CORAZÓN" },
    ],
    goal: { x: 1110, y: 150 },
  },
};

const sceneInfo = {
  cover: {
    mission: "PRÓLOGO",
    kicker: "SOFI & DAIANA",
    title: "OPERACIÓN BANANA",
    copy: "Una misión completamente innecesaria, pero demasiado importante como para ignorarla.",
  },
  briefing: {
    mission: "PRÓLOGO · EL ROBO",
    kicker: "ALERTA",
    title: "Nos robaron la Banana Dorada.",
    copy: "El sospechoso acaba de escapar por el bosque. Daiana decide cómo empieza esta misión.",
  },
  gate: {
    mission: "MISIÓN 02 · LA ENTRADA",
    kicker: "PUERTA BLOQUEADA",
    title: "Dos ideas. Ninguna parece especialmente buena.",
    copy: "Hay una pieza de construcción que encaja en la cerradura… y un botón enorme que dice NO TOCAR.",
  },
  guard: {
    mission: "MISIÓN 03 · EL GUARDIA",
    kicker: "CASI LA TENEMOS",
    title: "La banana está ahí.",
    copy: "Solo hay un pequeño problema: alguien está vigilando la bóveda.",
  },
  vault: {
    mission: "MISIÓN 04 · RECUPERACIÓN",
    kicker: "OBJETIVO LOCALIZADO",
    title: "Banana recuperada.",
    copy: "Contra todo pronóstico, este plan funcionó.",
  },
  secretIntro: {
    mission: "NIVEL SECRETO",
    kicker: "ALGO MÁS SE DESBLOQUEÓ",
    title: "Todavía no terminamos.",
    copy: "Antes de llegar hasta Daiana, encuentra tres recuerdos escondidos en el jardín.",
  },
};

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function roundedRect(x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function showCard(sceneName, actions) {
  const info = sceneInfo[sceneName];
  sceneCard.classList.remove("is-hidden");
  gameHud.classList.add("is-hidden");
  finalCard.classList.add("is-hidden");

  missionLabel.textContent = info.mission;
  sceneKicker.textContent = info.kicker;
  sceneTitle.textContent = info.title;
  sceneCopy.textContent = info.copy;
  sceneActions.replaceChildren();

  actions.forEach((action) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = action.label;
    button.addEventListener("click", action.onClick);
    sceneActions.append(button);
  });
}

function hideCard() {
  sceneCard.classList.add("is-hidden");
}

function showToast(message, ms = 1400) {
  clearTimeout(state.messageTimer);
  toast.textContent = message;
  toast.classList.remove("is-hidden");
  state.messageTimer = setTimeout(() => toast.classList.add("is-hidden"), ms);
}

function setScene(name) {
  state.scene = name;
  state.sceneTime = 0;

  if (name === "cover") {
    showCard("cover", [
      { label: "INICIAR MISIÓN", onClick: () => setScene("briefing") },
    ]);
  }

  if (name === "briefing") {
    showCard("briefing", [
      {
        label: "CORRER DETRÁS DE ÉL",
        onClick: () => {
          state.choiceHistory.push("run");
          startChase();
        },
      },
      {
        label: "SEGUIRLO DISIMULADAMENTE",
        onClick: () => {
          state.choiceHistory.push("stealth");
          showToast("La discreción duró exactamente siete segundos.");
          setTimeout(startChase, 900);
        },
      },
    ]);
  }

  if (name === "gate") {
    showCard("gate", [
      {
        label: "USAR LA PIEZA",
        onClick: () => {
          state.choiceHistory.push("lego");
          showToast("Encajó. Sorprendentemente era la opción sensata.");
          setTimeout(() => setScene("guard"), 1050);
        },
      },
      {
        label: "TOCAR EL BOTÓN",
        onClick: () => {
          state.choiceHistory.push("button");
          showToast("Sirena, luces… y la puerta se abrió igual.");
          setTimeout(() => setScene("guard"), 1350);
        },
      },
    ]);
  }

  if (name === "guard") {
    showCard("guard", [
      {
        label: "DISTRAERLO BAILANDO",
        onClick: () => {
          state.choiceHistory.push("dance");
          showToast("Nadie estaba preparado para ese baile.");
          setTimeout(() => setScene("vault"), 1300);
        },
      },
      {
        label: "OFRECER OTRA BANANA",
        onClick: () => {
          state.choiceHistory.push("offer");
          showToast("Negociación cerrada. El guardia acepta.");
          setTimeout(() => setScene("vault"), 1100);
        },
      },
    ]);
  }

  if (name === "vault") {
    showCard("vault", [
      {
        label: "CONTINUAR",
        onClick: () => setScene("secretIntro"),
      },
    ]);
  }

  if (name === "secretIntro") {
    showCard("secretIntro", [
      {
        label: "ENTRAR AL JARDÍN",
        onClick: startSecret,
      },
    ]);
  }

  if (name === "final") {
    hideCard();
    gameHud.classList.add("is-hidden");
    missionLabel.textContent = "MISIÓN COMPLETADA";
    finalMessage.textContent = FINAL_MESSAGE;
    finalCard.classList.remove("is-hidden");
  }
}

function startChase() {
  state.chase = {
    distance: 0,
    scroll: 0,
    playerX: 330,
    y: 0,
    vy: 0,
    grounded: true,
    stun: 0,
    spawn: .9,
    obstacles: [],
    funnyBeat: 0,
  };
  state.scene = "chase";
  state.sceneTime = 0;
  hideCard();
  finalCard.classList.add("is-hidden");
  gameHud.classList.remove("is-hidden");
  missionLabel.textContent = "MISIÓN 01 · SIGUE EL RASTRO";
  hudTitle.textContent = "PERSECUCIÓN";
  hudHelp.textContent = "A/D o ←/→ para moverte · W/↑/Espacio para saltar";
}

function startSecret() {
  state.secret.x = 150;
  state.secret.y = 535;
  state.secret.found = new Set();
  state.scene = "secret";
  state.sceneTime = 0;
  hideCard();
  finalCard.classList.add("is-hidden");
  gameHud.classList.remove("is-hidden");
  missionLabel.textContent = "NIVEL SECRETO · EL JARDÍN";
  hudTitle.textContent = "ENCUENTRA 3 RECUERDOS Y LLEGA HASTA DAIANA";
  hudHelp.textContent = "WASD o flechas para moverte";
}

function jump() {
  if (state.scene !== "chase") return;
  const c = state.chase;
  if (!c.grounded || c.stun > 0) return;
  c.vy = 690;
  c.grounded = false;
}

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  state.input.add(key);

  if (["arrowup", " ", "w"].includes(key)) {
    event.preventDefault();
    jump();
  }
});

window.addEventListener("keyup", (event) => {
  state.input.delete(event.key.toLowerCase());
});

soundToggle.addEventListener("click", () => {
  state.sound = !state.sound;
  soundToggle.textContent = state.sound ? "SONIDO ON" : "SONIDO OFF";
  soundToggle.setAttribute("aria-pressed", String(state.sound));
});

function drawSky(top, bottom, sunX = 930, sunY = 150) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, top);
  g.addColorStop(.72, bottom);
  g.addColorStop(1, "#263127");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, 150);
  glow.addColorStop(0, "rgba(255,232,154,.95)");
  glow.addColorStop(.25, "rgba(246,196,96,.38)");
  glow.addColorStop(1, "rgba(246,196,96,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(sunX - 160, sunY - 160, 320, 320);
}

function drawMountains(offset = 0, night = false) {
  ctx.save();
  ctx.translate(offset, 0);
  ctx.fillStyle = night ? "#28384a" : "#607763";
  ctx.beginPath();
  ctx.moveTo(-60, 410);
  ctx.lineTo(130, 245);
  ctx.lineTo(255, 340);
  ctx.lineTo(390, 195);
  ctx.lineTo(545, 335);
  ctx.lineTo(710, 230);
  ctx.lineTo(910, 350);
  ctx.lineTo(1080, 210);
  ctx.lineTo(1350, 410);
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = .35;
  ctx.fillStyle = night ? "#52667a" : "#aebc9d";
  ctx.beginPath();
  ctx.moveTo(90, 285);
  ctx.lineTo(130, 245);
  ctx.lineTo(180, 292);
  ctx.lineTo(390, 195);
  ctx.lineTo(440, 265);
  ctx.lineTo(710, 230);
  ctx.lineTo(758, 278);
  ctx.lineTo(1080, 210);
  ctx.lineTo(1122, 265);
  ctx.lineTo(1350, 410);
  ctx.lineTo(-60, 410);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawTree(x, y, scale = 1, tone = "#31583f") {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.fillStyle = "#6b4a31";
  roundedRect(-10, -85, 20, 90, 7);
  ctx.fill();

  ctx.fillStyle = tone;
  const crowns = [
    [-32, -92, 40],
    [5, -108, 45],
    [37, -86, 34],
    [-2, -138, 36],
  ];
  crowns.forEach(([cx, cy, r]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

function drawForestGround(scroll = 0) {
  ctx.fillStyle = "#344d3c";
  ctx.fillRect(0, 390, W, 330);

  const path = ctx.createLinearGradient(0, 430, 0, 720);
  path.addColorStop(0, "#b99461");
  path.addColorStop(1, "#79573a");
  ctx.fillStyle = path;
  ctx.beginPath();
  ctx.moveTo(0, 510);
  ctx.quadraticCurveTo(320, 455, 650, 505);
  ctx.quadraticCurveTo(980, 555, 1280, 500);
  ctx.lineTo(1280, 720);
  ctx.lineTo(0, 720);
  ctx.closePath();
  ctx.fill();

  for (let i = -1; i < 10; i++) {
    const x = ((i * 170 - (scroll * .45) % 170) + W + 170) % (W + 170) - 85;
    drawTree(x, 485 + (i % 2) * 22, .82 + (i % 3) * .08, i % 2 ? "#2d553c" : "#3b6543");
  }
}

function drawGoldenBanana(x, y, scale = 1, rotation = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);

  const glow = ctx.createRadialGradient(0, 0, 5, 0, 0, 75);
  glow.addColorStop(0, "rgba(255,228,112,.58)");
  glow.addColorStop(1, "rgba(255,205,61,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, 75, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineWidth = 17;
  ctx.lineCap = "round";
  const grad = ctx.createLinearGradient(-35, -15, 42, 28);
  grad.addColorStop(0, "#fff0a3");
  grad.addColorStop(.35, "#f4cb4f");
  grad.addColorStop(1, "#b87916");
  ctx.strokeStyle = grad;
  ctx.beginPath();
  ctx.arc(-4, -4, 41, .12, 2.25);
  ctx.stroke();

  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(255,255,255,.55)";
  ctx.beginPath();
  ctx.arc(-7, -8, 33, .32, 1.6);
  ctx.stroke();

  ctx.restore();
}

function drawCharacter(x, y, scale, kind, pose = "idle", flip = false) {
  const isDai = kind === "dai";
  ctx.save();
  ctx.translate(x, y);
  if (flip) ctx.scale(-1, 1);
  ctx.scale(scale, scale);

  const bob = pose === "run" ? Math.sin(state.elapsed * 11 + (isDai ? 1 : 0)) * 4 : Math.sin(state.elapsed * 2.2) * 2;

  ctx.translate(0, bob);

  if (isDai) {
    const hair = ctx.createLinearGradient(-55, -165, 55, 15);
    hair.addColorStop(0, "#241812");
    hair.addColorStop(.45, "#4b2e22");
    hair.addColorStop(1, "#251813");
    ctx.fillStyle = hair;
    ctx.beginPath();
    ctx.moveTo(-49, -156);
    ctx.bezierCurveTo(-78, -112, -65, -18, -50, 20);
    ctx.bezierCurveTo(-28, 3, 30, 4, 52, 22);
    ctx.bezierCurveTo(70, -30, 74, -115, 46, -157);
    ctx.quadraticCurveTo(0, -190, -49, -156);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillStyle = "#251b17";
    ctx.beginPath();
    ctx.arc(10, -160, 28, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(40, -165, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  const body = ctx.createLinearGradient(-42, -135, 50, 10);
  body.addColorStop(0, "#ffe167");
  body.addColorStop(.5, "#f5c93d");
  body.addColorStop(1, "#c99b20");
  ctx.fillStyle = body;
  roundedRect(-48, -150, 96, 170, 46);
  ctx.fill();

  if (isDai) {
    ctx.fillStyle = "#4a2c20";
    ctx.beginPath();
    ctx.moveTo(-42, -145);
    ctx.quadraticCurveTo(-68, -92, -52, -28);
    ctx.quadraticCurveTo(-38, -58, -35, -118);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(42, -145);
    ctx.quadraticCurveTo(66, -90, 51, -25);
    ctx.quadraticCurveTo(36, -59, 34, -117);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#7a4a34";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-47, -126);
    ctx.quadraticCurveTo(-57, -68, -48, -20);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(46, -126);
    ctx.quadraticCurveTo(57, -64, 48, -18);
    ctx.stroke();
  }

  ctx.strokeStyle = "#5e6063";
  ctx.lineWidth = 9;
  ctx.fillStyle = "#d7d8d7";
  [-22, 22].forEach((gx) => {
    ctx.beginPath();
    ctx.arc(gx, -100, 27, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#f7f2dd";
    ctx.beginPath();
    ctx.arc(gx, -100, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#4e3325";
    ctx.beginPath();
    ctx.arc(gx + (flip ? -2 : 2), -99, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#181818";
    ctx.beginPath();
    ctx.arc(gx + (flip ? -1 : 3), -99, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#d7d8d7";
  });

  ctx.strokeStyle = "#4a382d";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(0, -61, pose === "stumble" ? 13 : 18, .2, 2.9);
  ctx.stroke();

  ctx.fillStyle = isDai ? "#6b5d7d" : "#4f7398";
  roundedRect(-39, -39, 78, 58, 13);
  ctx.fill();

  ctx.fillStyle = isDai ? "#554765" : "#3d5c7b";
  ctx.fillRect(-30, -55, 14, 26);
  ctx.fillRect(16, -55, 14, 26);

  ctx.strokeStyle = "#3a2f29";
  ctx.lineWidth = 8;
  const stride = pose === "run" ? Math.sin(state.elapsed * 10 + (isDai ? .8 : 0)) * 18 : 0;
  ctx.beginPath();
  ctx.moveTo(-22, 15);
  ctx.lineTo(-24 + stride, 45);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(22, 15);
  ctx.lineTo(24 - stride, 45);
  ctx.stroke();

  ctx.fillStyle = "#2e2b2a";
  roundedRect(-40 + stride, 39, 31, 12, 6);
  ctx.fill();
  roundedRect(9 - stride, 39, 31, 12, 6);
  ctx.fill();

  ctx.restore();
}

function drawThief(x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = "rgba(21,24,29,.82)";
  roundedRect(-38, -110, 76, 125, 32);
  ctx.fill();
  ctx.fillStyle = "#1a1d21";
  ctx.beginPath();
  ctx.arc(0, -120, 42, 0, Math.PI * 2);
  ctx.fill();
  drawGoldenBanana(30, -18, .45, -.55);
  ctx.restore();
}

function drawCover() {
  drawSky("#6f9bb2", "#e8b972", 930, 125);
  drawMountains(0, false);
  drawForestGround(0);

  ctx.fillStyle = "rgba(255,218,123,.17)";
  ctx.fillRect(0, 0, W, H);

  drawCharacter(800, 525, 1.35, "sofi", "idle", true);
  drawCharacter(1000, 525, 1.35, "dai", "idle", false);
  drawGoldenBanana(900, 420 + Math.sin(state.elapsed * 2) * 7, 1.1, -.22);

  for (let i = 0; i < 16; i++) {
    const px = 650 + ((i * 83 + state.elapsed * 8) % 600);
    const py = 170 + ((i * 47) % 330);
    ctx.fillStyle = "rgba(255,231,155,.45)";
    ctx.beginPath();
    ctx.arc(px, py, 2 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawBriefing() {
  drawSky("#425f78", "#d99a61", 1080, 115);
  drawMountains(0, false);
  drawForestGround(state.elapsed * 16);

  drawCharacter(830, 525, 1.12, "sofi", "run", false);
  drawCharacter(700, 530, 1.08, "dai", "run", false);
  drawThief(1085 + Math.sin(state.elapsed * 4) * 8, 520, .95);

  ctx.save();
  ctx.globalAlpha = .35;
  ctx.strokeStyle = "#fff1c9";
  ctx.lineWidth = 3;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(930 + i * 25, 430 + i * 8);
    ctx.lineTo(1000 + i * 25, 430 + i * 8);
    ctx.stroke();
  }
  ctx.restore();
}

function spawnObstacle() {
  const c = state.chase;
  const types = ["crate", "rock", "log"];
  c.obstacles.push({
    x: W + 80,
    type: types[Math.floor(Math.random() * types.length)],
    hit: false,
  });
}

function updateChase(dt) {
  const c = state.chase;
  c.stun = Math.max(0, c.stun - dt);

  const move = (state.input.has("arrowright") || state.input.has("d") ? 1 : 0)
    - (state.input.has("arrowleft") || state.input.has("a") ? 1 : 0);

  c.playerX = clamp(c.playerX + move * 180 * dt, 230, 460);

  if (!c.grounded) {
    c.vy -= 1450 * dt;
    c.y += c.vy * dt;
    if (c.y <= 0) {
      c.y = 0;
      c.vy = 0;
      c.grounded = true;
    }
  }

  const speed = c.stun > 0 ? 145 : 285;
  c.scroll += speed * dt;
  c.distance += (c.stun > 0 ? 2.0 : 4.4) * dt;

  c.spawn -= dt;
  if (c.spawn <= 0) {
    spawnObstacle();
    c.spawn = 1.25 + Math.random() * .75;
  }

  c.obstacles.forEach((ob) => {
    ob.x -= speed * dt;
    const obstacleTop = 575;
    const playerBottom = 585 - c.y;
    const nearX = Math.abs(ob.x - c.playerX) < 45;
    const lowEnough = playerBottom > obstacleTop - 60;

    if (!ob.hit && nearX && lowEnough) {
      ob.hit = true;
      c.stun = .75;
      showToast("Sofi: todo estaba bajo control.");
    }
  });

  c.obstacles = c.obstacles.filter((ob) => ob.x > -120);

  if (c.distance > 42 && c.funnyBeat === 0) {
    c.funnyBeat = 1;
    showToast("Daiana sigue corriendo como si esto fuera perfectamente normal.");
  }

  if (c.distance >= 100) {
    setScene("gate");
  }

  hudProgress.textContent = `${Math.min(100, Math.round(c.distance))}% DEL RASTRO`;
}

function drawObstacle(ob) {
  const y = 590;
  if (ob.type === "crate") {
    ctx.fillStyle = "#9a6a3e";
    roundedRect(ob.x - 28, y - 52, 56, 52, 5);
    ctx.fill();
    ctx.strokeStyle = "#604026";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ob.x - 22, y - 46);
    ctx.lineTo(ob.x + 22, y - 6);
    ctx.moveTo(ob.x + 22, y - 46);
    ctx.lineTo(ob.x - 22, y - 6);
    ctx.stroke();
  } else if (ob.type === "rock") {
    ctx.fillStyle = "#6c716d";
    ctx.beginPath();
    ctx.moveTo(ob.x - 34, y);
    ctx.lineTo(ob.x - 22, y - 42);
    ctx.lineTo(ob.x + 15, y - 55);
    ctx.lineTo(ob.x + 37, y - 20);
    ctx.lineTo(ob.x + 30, y);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.strokeStyle = "#69472e";
    ctx.lineWidth = 22;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(ob.x - 38, y - 12);
    ctx.lineTo(ob.x + 38, y - 12);
    ctx.stroke();
  }
}

function drawChase() {
  drawSky("#476b7d", "#be8d59", 990, 115);
  drawMountains(-state.chase.scroll * .08, false);
  drawForestGround(state.chase.scroll);

  const c = state.chase;
  c.obstacles.forEach(drawObstacle);

  const pose = c.stun > 0 ? "stumble" : "run";
  drawCharacter(c.playerX - 95, 548 - c.y * .82, .95, "dai", "run", false);
  drawCharacter(c.playerX, 548 - c.y, 1.04, "sofi", pose, false);
  drawThief(1080, 535, .82);

  ctx.save();
  ctx.globalAlpha = .5;
  ctx.fillStyle = "#f2cf67";
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(1020 + i * 38, 565 + Math.sin(state.elapsed * 5 + i) * 8, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawStoneHall() {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#27313d");
  g.addColorStop(1, "#12171d");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#303b45";
  for (let y = 80; y < 650; y += 74) {
    for (let x = (y / 74) % 2 ? -40 : 0; x < W; x += 130) {
      roundedRect(x, y, 118, 58, 7);
      ctx.fill();
    }
  }

  const lamp = ctx.createRadialGradient(910, 220, 10, 910, 220, 260);
  lamp.addColorStop(0, "rgba(244,192,78,.38)");
  lamp.addColorStop(1, "rgba(244,192,78,0)");
  ctx.fillStyle = lamp;
  ctx.fillRect(620, 0, 580, 520);
}

function drawGate() {
  drawStoneHall();

  ctx.fillStyle = "#151b20";
  roundedRect(795, 120, 355, 500, 22);
  ctx.fill();
  ctx.strokeStyle = "#8a744b";
  ctx.lineWidth = 9;
  ctx.stroke();

  ctx.strokeStyle = "#756145";
  ctx.lineWidth = 7;
  for (let x = 835; x <= 1110; x += 55) {
    ctx.beginPath();
    ctx.moveTo(x, 150);
    ctx.lineTo(x, 585);
    ctx.stroke();
  }

  drawCharacter(520, 575, 1.18, "sofi", "idle", false);
  drawCharacter(665, 575, 1.16, "dai", "idle", false);

  ctx.fillStyle = "#c93031";
  ctx.beginPath();
  ctx.arc(710, 320, 43, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#ff7773";
  ctx.lineWidth = 7;
  ctx.stroke();

  ctx.fillStyle = "#f0d7ad";
  ctx.font = "800 19px DM Sans";
  ctx.textAlign = "center";
  ctx.fillText("NO TOCAR", 710, 389);

  ctx.save();
  ctx.translate(580, 350);
  ctx.fillStyle = "#bb3b36";
  roundedRect(-35, -26, 70, 52, 8);
  ctx.fill();
  ctx.fillStyle = "#e5b833";
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.arc(i * 12, -29, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawGuard() {
  drawStoneHall();

  const vaultGlow = ctx.createRadialGradient(985, 310, 30, 985, 310, 230);
  vaultGlow.addColorStop(0, "rgba(255,219,103,.34)");
  vaultGlow.addColorStop(1, "rgba(255,219,103,0)");
  ctx.fillStyle = vaultGlow;
  ctx.fillRect(730, 70, 500, 500);

  ctx.fillStyle = "#596168";
  roundedRect(790, 120, 370, 500, 30);
  ctx.fill();
  ctx.strokeStyle = "#2c3238";
  ctx.lineWidth = 14;
  ctx.stroke();

  drawGoldenBanana(995, 340 + Math.sin(state.elapsed * 2) * 5, .95, -.15);

  ctx.fillStyle = "#262a2f";
  roundedRect(715, 400, 100, 180, 38);
  ctx.fill();
  ctx.fillStyle = "#a27a42";
  roundedRect(735, 428, 60, 35, 12);
  ctx.fill();
  ctx.fillStyle = "#dad8ce";
  ctx.beginPath();
  ctx.arc(750, 445, 8, 0, Math.PI * 2);
  ctx.arc(780, 445, 8, 0, Math.PI * 2);
  ctx.fill();

  drawCharacter(475, 575, 1.15, "sofi", "idle", false);
  drawCharacter(600, 575, 1.13, "dai", "idle", false);
}

function drawVault() {
  drawStoneHall();

  const glow = ctx.createRadialGradient(900, 350, 30, 900, 350, 260);
  glow.addColorStop(0, "rgba(255,220,112,.42)");
  glow.addColorStop(1, "rgba(255,220,112,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(610, 70, 580, 560);

  ctx.fillStyle = "#6c5b44";
  ctx.beginPath();
  ctx.ellipse(900, 535, 165, 45, 0, 0, Math.PI * 2);
  ctx.fill();

  drawGoldenBanana(900, 365 + Math.sin(state.elapsed * 2.2) * 7, 1.35, -.22);
  drawCharacter(660, 585, 1.18, "sofi", "idle", false);
  drawCharacter(1120, 585, 1.18, "dai", "idle", true);

  for (let i = 0; i < 28; i++) {
    const a = i * .9 + state.elapsed * .35;
    const r = 70 + (i % 5) * 22;
    const x = 900 + Math.cos(a) * r;
    const y = 365 + Math.sin(a * 1.4) * r * .35;
    ctx.fillStyle = "rgba(255,229,135,.45)";
    ctx.beginPath();
    ctx.arc(x, y, 2 + i % 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSecretMap() {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#7aa28d");
  g.addColorStop(1, "#355944");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#4f7659";
  for (let i = 0; i < 45; i++) {
    const x = (i * 137) % W;
    const y = 100 + ((i * 83) % 560);
    ctx.beginPath();
    ctx.arc(x, y, 22 + (i % 4) * 7, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = "#c2a978";
  ctx.lineWidth = 95;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(120, 590);
  ctx.bezierCurveTo(310, 560, 330, 410, 500, 390);
  ctx.bezierCurveTo(680, 365, 630, 220, 810, 215);
  ctx.bezierCurveTo(990, 210, 1000, 130, 1140, 145);
  ctx.stroke();

  ctx.strokeStyle = "#79a9af";
  ctx.lineWidth = 110;
  ctx.beginPath();
  ctx.moveTo(640, -40);
  ctx.bezierCurveTo(580, 190, 720, 370, 630, 760);
  ctx.stroke();

  ctx.strokeStyle = "#9a6b3e";
  ctx.lineWidth = 72;
  ctx.beginPath();
  ctx.moveTo(635, 338);
  ctx.lineTo(685, 338);
  ctx.stroke();

  ctx.strokeStyle = "#d1a86a";
  ctx.lineWidth = 7;
  for (let x = 615; x < 710; x += 16) {
    ctx.beginPath();
    ctx.moveTo(x, 302);
    ctx.lineTo(x, 374);
    ctx.stroke();
  }

  const items = state.secret.items;
  items.forEach((item) => {
    if (state.secret.found.has(item.id)) return;

    ctx.save();
    ctx.translate(item.x, item.y);
    const pulse = 1 + Math.sin(state.elapsed * 3 + item.x) * .05;
    ctx.scale(pulse, pulse);

    const halo = ctx.createRadialGradient(0, 0, 2, 0, 0, 43);
    halo.addColorStop(0, "rgba(255,230,139,.56)");
    halo.addColorStop(1, "rgba(255,230,139,0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, 0, 43, 0, Math.PI * 2);
    ctx.fill();

    if (item.id === "lego") {
      ctx.fillStyle = "#c94139";
      roundedRect(-23, -16, 46, 32, 7);
      ctx.fill();
      ctx.fillStyle = "#efca4e";
      [-14, 0, 14].forEach((dx) => {
        ctx.beginPath();
        ctx.arc(dx, -19, 6, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    if (item.id === "music") {
      ctx.strokeStyle = "#f0d66c";
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(8, -24);
      ctx.lineTo(8, 16);
      ctx.lineTo(-9, 21);
      ctx.stroke();
      ctx.fillStyle = "#f0d66c";
      ctx.beginPath();
      ctx.arc(-14, 23, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    if (item.id === "heart") {
      ctx.fillStyle = "#d95c66";
      ctx.beginPath();
      ctx.moveTo(0, 25);
      ctx.bezierCurveTo(-45, -5, -22, -38, 0, -16);
      ctx.bezierCurveTo(22, -38, 45, -5, 0, 25);
      ctx.fill();
    }

    ctx.restore();
  });

  drawCharacter(state.secret.goal.x, state.secret.goal.y + 40, .55, "dai", "idle", true);
  drawCharacter(state.secret.x, state.secret.y + 35, .58, "sofi", "idle", false);
}

function updateSecret(dt) {
  const s = state.secret;
  let dx = 0;
  let dy = 0;

  if (state.input.has("arrowleft") || state.input.has("a")) dx -= 1;
  if (state.input.has("arrowright") || state.input.has("d")) dx += 1;
  if (state.input.has("arrowup") || state.input.has("w")) dy -= 1;
  if (state.input.has("arrowdown") || state.input.has("s")) dy += 1;

  if (dx || dy) {
    const len = Math.hypot(dx, dy);
    s.x = clamp(s.x + (dx / len) * s.speed * dt, 70, W - 70);
    s.y = clamp(s.y + (dy / len) * s.speed * dt, 100, H - 70);
  }

  s.items.forEach((item) => {
    if (s.found.has(item.id)) return;
    if (Math.hypot(s.x - item.x, s.y - item.y) < 45) {
      s.found.add(item.id);
      showToast(`${item.label} encontrado.`);
    }
  });

  const count = s.found.size;
  hudProgress.textContent = `${s.found.has("lego") ? "✓" : "○"} LEGO   ${s.found.has("music") ? "✓" : "○"} MÚSICA   ${s.found.has("heart") ? "✓" : "○"} CORAZÓN`;

  if (Math.hypot(s.x - s.goal.x, s.y - s.goal.y) < 65) {
    if (count === 3) {
      setScene("final");
    } else {
      showToast("Daiana: todavía falta encontrar algo.");
      s.x -= 35;
      s.y += 30;
    }
  }
}

function drawSecretIntro() {
  drawSky("#324a61", "#c38463", 1020, 130);
  drawMountains(0, true);
  drawForestGround(0);

  ctx.fillStyle = "rgba(11,18,25,.2)";
  ctx.fillRect(0, 0, W, H);

  drawCharacter(830, 545, 1.18, "sofi", "idle", false);
  drawCharacter(1030, 545, 1.18, "dai", "idle", true);

  const glow = ctx.createRadialGradient(930, 445, 4, 930, 445, 80);
  glow.addColorStop(0, "rgba(255,217,104,.55)");
  glow.addColorStop(1, "rgba(255,217,104,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(930, 445, 80, 0, Math.PI * 2);
  ctx.fill();
}

function drawFinal() {
  drawSky("#17243a", "#2d4260", 1010, 150);
  drawMountains(0, true);

  ctx.fillStyle = "#1f342d";
  ctx.fillRect(0, 430, W, 290);

  const lake = ctx.createLinearGradient(0, 460, 0, 720);
  lake.addColorStop(0, "#29475b");
  lake.addColorStop(1, "#152a38");
  ctx.fillStyle = lake;
  ctx.fillRect(0, 500, W, 220);

  for (let i = 0; i < 65; i++) {
    const x = (i * 193) % W;
    const y = 35 + ((i * 83) % 340);
    ctx.fillStyle = `rgba(255,245,209,${.3 + (i % 4) * .14})`;
    ctx.beginPath();
    ctx.arc(x, y, 1 + (i % 3) * .45, 0, Math.PI * 2);
    ctx.fill();
  }

  const moon = ctx.createRadialGradient(960, 135, 6, 960, 135, 95);
  moon.addColorStop(0, "rgba(255,241,193,.95)");
  moon.addColorStop(.3, "rgba(255,241,193,.25)");
  moon.addColorStop(1, "rgba(255,241,193,0)");
  ctx.fillStyle = moon;
  ctx.fillRect(850, 25, 220, 220);

  drawCharacter(280, 565, 1.05, "sofi", "idle", false);
  drawCharacter(430, 565, 1.05, "dai", "idle", false);
  drawGoldenBanana(355, 475, .7, -.25);
}

function update(dt) {
  state.elapsed += dt;
  state.sceneTime += dt;

  if (state.scene === "chase") updateChase(dt);
  if (state.scene === "secret") updateSecret(dt);
}

function render() {
  ctx.clearRect(0, 0, W, H);

  switch (state.scene) {
    case "cover":
      drawCover();
      break;
    case "briefing":
      drawBriefing();
      break;
    case "chase":
      drawChase();
      break;
    case "gate":
      drawGate();
      break;
    case "guard":
      drawGuard();
      break;
    case "vault":
      drawVault();
      break;
    case "secretIntro":
      drawSecretIntro();
      break;
    case "secret":
      drawSecretMap();
      break;
    case "final":
      drawFinal();
      break;
  }
}

let last = performance.now();

function loop(now) {
  const dt = Math.min((now - last) / 1000, .033);
  last = now;
  update(dt);
  render();
  requestAnimationFrame(loop);
}

setScene("cover");
requestAnimationFrame(loop);
