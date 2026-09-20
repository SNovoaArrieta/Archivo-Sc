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
  input: new Set(),
  messageTimer: null,
  choices: [],
  chase: {},
  gate: {},
  guard: {},
  vault: {},
};

const info = {
  cover: {
    mission: "PRÓLOGO",
    kicker: "SOFI & DAIANA",
    title: "OPERACIÓN BANANA",
    copy: "Una misión completamente innecesaria, pero demasiado importante como para ignorarla.",
  },
  theft: {
    mission: "PRÓLOGO · EL ROBO",
    kicker: "ALERTA",
    title: "Nos robaron la Banana Dorada.",
    copy: "El ladrón escapó por el bosque. Daiana decide cómo empieza esta brillante operación.",
  },
  guardChoice: {
    mission: "MISIÓN 03 · EL GUARDIA",
    kicker: "LA BÓVEDA ESTÁ CERCA",
    title: "Hay alguien vigilando la entrada.",
    copy: "Podemos distraerlo. Después tendrás que cruzar el corredor sin que vuelva a verte.",
  },
  vaultIntro: {
    mission: "MISIÓN 04 · LA CERRADURA",
    kicker: "ÚLTIMA BARRERA",
    title: "La bóveda tiene memoria.",
    copy: "Mira la secuencia de cuatro símbolos y repítela. Si fallas, vuelve a mostrarse.",
  },
  recovery: {
    mission: "OBJETIVO CUMPLIDO",
    kicker: "POR FIN",
    title: "Banana recuperada.",
    copy: "No preguntes cómo funcionó. Lo importante es que funcionó.",
  },
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
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

function showCard(name, actions) {
  const data = info[name];
  missionLabel.textContent = data.mission;
  sceneKicker.textContent = data.kicker;
  sceneTitle.textContent = data.title;
  sceneCopy.textContent = data.copy;
  sceneActions.replaceChildren();

  actions.forEach((action) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = action.label;
    button.addEventListener("click", action.onClick);
    sceneActions.append(button);
  });

  sceneCard.classList.remove("is-hidden");
  gameHud.classList.add("is-hidden");
  finalCard.classList.add("is-hidden");
}

function hideCard() {
  sceneCard.classList.add("is-hidden");
}

function showToast(message, ms = 1300) {
  clearTimeout(state.messageTimer);
  toast.textContent = message;
  toast.classList.remove("is-hidden");
  state.messageTimer = setTimeout(() => toast.classList.add("is-hidden"), ms);
}

function setScene(name) {
  state.scene = name;
  state.sceneTime = 0;

  if (name === "cover") {
    showCard("cover", [{ label: "INICIAR MISIÓN", onClick: () => setScene("theft") }]);
  }

  if (name === "theft") {
    showCard("theft", [
      {
        label: "CORRER DETRÁS DE ÉL",
        onClick: () => {
          state.choices.push("run");
          startChase();
        },
      },
      {
        label: "SEGUIRLO DISIMULADAMENTE",
        onClick: () => {
          state.choices.push("stealth");
          showToast("La discreción duró unos siete segundos.");
          setTimeout(startChase, 850);
        },
      },
    ]);
  }

  if (name === "guardChoice") {
    showCard("guardChoice", [
      {
        label: "DISTRAERLO BAILANDO",
        onClick: () => {
          state.choices.push("dance");
          startGuard("dance");
        },
      },
      {
        label: "OFRECERLE OTRA BANANA",
        onClick: () => {
          state.choices.push("banana");
          startGuard("banana");
        },
      },
    ]);
  }

  if (name === "vaultIntro") {
    showCard("vaultIntro", [
      { label: "VER SECUENCIA", onClick: startVault },
    ]);
  }

  if (name === "recovery") {
    showCard("recovery", [
      { label: "VER EL FINAL", onClick: () => setScene("final") },
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
    progress: 0,
    scroll: 0,
    playerX: 330,
    jumpY: 0,
    vy: 0,
    grounded: true,
    crouching: false,
    stun: 0,
    spawn: .8,
    obstacles: [],
    hits: 0,
  };

  state.scene = "chase";
  state.sceneTime = 0;
  hideCard();
  finalCard.classList.add("is-hidden");
  gameHud.classList.remove("is-hidden");
  missionLabel.textContent = "MISIÓN 01 · SIGUE EL RASTRO";
  hudTitle.textContent = "ALCANZA AL LADRÓN";
  hudHelp.textContent = "A/D o ←/→ · salta con W/↑/Espacio · agáchate con S/↓";
}

function startGate() {
  state.gate = {
    x: 125,
    y: 585,
    speed: 215,
    pieces: [
      { id: "red", x: 260, y: 250, color: "#ce4d43", found: false },
      { id: "blue", x: 700, y: 510, color: "#507aa7", found: false },
      { id: "yellow", x: 980, y: 235, color: "#e5bd42", found: false },
    ],
    exit: { x: 1140, y: 112 },
    walls: [
      { x: 0, y: 0, w: 1280, h: 55 },
      { x: 0, y: 665, w: 1280, h: 55 },
      { x: 0, y: 0, w: 55, h: 720 },
      { x: 1225, y: 0, w: 55, h: 720 },
      { x: 180, y: 115, w: 360, h: 65 },
      { x: 180, y: 180, w: 65, h: 250 },
      { x: 355, y: 315, w: 330, h: 65 },
      { x: 620, y: 110, w: 65, h: 205 },
      { x: 805, y: 305, w: 320, h: 65 },
      { x: 1045, y: 370, w: 65, h: 205 },
      { x: 535, y: 500, w: 65, h: 165 },
    ],
  };

  state.scene = "gate";
  state.sceneTime = 0;
  hideCard();
  gameHud.classList.remove("is-hidden");
  missionLabel.textContent = "MISIÓN 02 · ABRE EL CAMINO";
  hudTitle.textContent = "ENCUENTRA LAS 3 PIEZAS";
  hudHelp.textContent = "Muévete con WASD o flechas. Después llega a la puerta.";
}

function startGuard(method) {
  state.guard = {
    x: 145,
    speed: 210,
    method,
    caught: 0,
    crates: [390, 650, 910],
  };

  state.scene = "guard";
  state.sceneTime = 0;
  hideCard();
  gameHud.classList.remove("is-hidden");
  missionLabel.textContent = "MISIÓN 03 · PASA SIN QUE TE VEA";
  hudTitle.textContent = method === "dance" ? "EL BAILE LO DISTRAE POR MOMENTOS" : "LA BANANA LO DISTRAE POR MOMENTOS";
  hudHelp.textContent = "A/D o ←/→ para avanzar · S/↓ para esconderte detrás de una caja";
}

function startVault() {
  state.vault = {
    sequence: [2, 4, 1, 3],
    phase: "show",
    showIndex: 0,
    showTimer: 0,
    input: [],
    flash: 0,
    restartTimer: 0,
  };

  state.scene = "vault";
  state.sceneTime = 0;
  hideCard();
  gameHud.classList.remove("is-hidden");
  missionLabel.textContent = "MISIÓN 04 · LA CERRADURA";
  hudTitle.textContent = "MEMORIZA LA SECUENCIA";
  hudHelp.textContent = "Después usa las teclas 1, 2, 3 y 4";
  hudProgress.textContent = "MIRA";
}

function jump() {
  if (state.scene !== "chase") return;
  const c = state.chase;
  if (!c.grounded || c.stun > 0 || c.crouching) return;
  c.vy = 720;
  c.grounded = false;
}

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  state.input.add(key);

  if (["arrowup", "w", " "].includes(key)) {
    event.preventDefault();
    jump();
  }

  if (state.scene === "vault" && ["1", "2", "3", "4"].includes(key)) {
    handleVaultInput(Number(key));
  }
});

window.addEventListener("keyup", (event) => {
  state.input.delete(event.key.toLowerCase());
});

function drawSky(top, bottom, sunX = 1000, sunY = 140, night = false) {
  const gradient = ctx.createLinearGradient(0, 0, 0, H);
  gradient.addColorStop(0, top);
  gradient.addColorStop(.7, bottom);
  gradient.addColorStop(1, night ? "#18222d" : "#2c392c");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 170);
  glow.addColorStop(0, night ? "rgba(245,238,203,.85)" : "rgba(255,233,163,.9)");
  glow.addColorStop(.22, night ? "rgba(205,218,232,.2)" : "rgba(247,191,91,.33)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(sunX - 180, sunY - 180, 360, 360);

  ctx.save();
  ctx.globalAlpha = .16;
  ctx.fillStyle = "#fff";
  for (let i = 0; i < 6; i++) {
    const x = ((i * 240 + state.elapsed * 7) % 1600) - 150;
    const y = 90 + (i % 3) * 75;
    ctx.beginPath();
    ctx.ellipse(x, y, 90, 22, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawMountains(offset = 0, night = false) {
  ctx.save();
  ctx.translate(offset, 0);
  const back = night ? "#314355" : "#657a67";
  const front = night ? "#233241" : "#495f4d";

  ctx.fillStyle = back;
  ctx.beginPath();
  ctx.moveTo(-80, 415);
  ctx.lineTo(120, 235);
  ctx.lineTo(250, 335);
  ctx.lineTo(430, 180);
  ctx.lineTo(575, 330);
  ctx.lineTo(745, 220);
  ctx.lineTo(925, 350);
  ctx.lineTo(1100, 205);
  ctx.lineTo(1370, 420);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = front;
  ctx.beginPath();
  ctx.moveTo(-100, 445);
  ctx.lineTo(180, 315);
  ctx.lineTo(390, 425);
  ctx.lineTo(650, 290);
  ctx.lineTo(900, 425);
  ctx.lineTo(1170, 300);
  ctx.lineTo(1400, 450);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawTree(x, y, scale = 1, hue = "#365f42") {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = "#62452f";
  roundedRect(-10, -90, 20, 94, 7);
  ctx.fill();

  ctx.fillStyle = hue;
  [[-35,-100,42],[4,-122,48],[43,-95,37],[-2,-151,34]].forEach(([cx,cy,r]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawForestRoad(scroll = 0) {
  ctx.fillStyle = "#324c3b";
  ctx.fillRect(0, 385, W, 335);

  const path = ctx.createLinearGradient(0, 440, 0, 720);
  path.addColorStop(0, "#c6a66d");
  path.addColorStop(1, "#765338");
  ctx.fillStyle = path;
  ctx.beginPath();
  ctx.moveTo(0, 505);
  ctx.quadraticCurveTo(330, 460, 650, 505);
  ctx.quadraticCurveTo(970, 555, 1280, 500);
  ctx.lineTo(1280, 720);
  ctx.lineTo(0, 720);
  ctx.closePath();
  ctx.fill();

  for (let i = -1; i < 10; i++) {
    const x = ((i * 175 - (scroll * .45) % 175) + W + 175) % (W + 175) - 90;
    drawTree(x, 490 + (i % 2) * 18, .8 + (i % 3) * .08, i % 2 ? "#2f583d" : "#416b47");
  }

  ctx.save();
  ctx.globalAlpha = .18;
  ctx.fillStyle = "#fff3c8";
  for (let i = 0; i < 22; i++) {
    const x = (i * 91 + scroll * .18) % W;
    const y = 430 + ((i * 47) % 180);
    ctx.beginPath();
    ctx.arc(x, y, 2 + i % 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawBanana(x, y, scale = 1, rotation = -.2) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);

  const glow = ctx.createRadialGradient(0, 0, 3, 0, 0, 78);
  glow.addColorStop(0, "rgba(255,231,129,.55)");
  glow.addColorStop(1, "rgba(255,220,90,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, 78, 0, Math.PI * 2);
  ctx.fill();

  const grad = ctx.createLinearGradient(-40, -18, 45, 25);
  grad.addColorStop(0, "#fff1a5");
  grad.addColorStop(.38, "#f0c447");
  grad.addColorStop(1, "#a76d14");
  ctx.strokeStyle = grad;
  ctx.lineWidth = 18;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(-4, -4, 42, .1, 2.26);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,.5)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(-8, -8, 33, .3, 1.58);
  ctx.stroke();
  ctx.restore();
}

function drawCharacter(x, y, scale, who, pose = "idle", flip = false, crouch = false) {
  const dai = who === "dai";
  ctx.save();
  ctx.translate(x, y);
  if (flip) ctx.scale(-1, 1);
  ctx.scale(scale, scale);

  const run = pose === "run";
  const bob = run ? Math.sin(state.elapsed * 11 + (dai ? .8 : 0)) * 4 : Math.sin(state.elapsed * 2) * 2;
  ctx.translate(0, bob + (crouch ? 24 : 0));
  if (crouch) ctx.scale(1.04, .84);

  if (dai) {
    const hair = ctx.createLinearGradient(-62, -176, 60, 18);
    hair.addColorStop(0, "#241713");
    hair.addColorStop(.5, "#513226");
    hair.addColorStop(1, "#251813");
    ctx.fillStyle = hair;
    ctx.beginPath();
    ctx.moveTo(-50, -160);
    ctx.bezierCurveTo(-82,-118,-72,-24,-54,28);
    ctx.bezierCurveTo(-24,8,24,8,56,30);
    ctx.bezierCurveTo(72,-30,78,-120,48,-160);
    ctx.quadraticCurveTo(0,-194,-50,-160);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillStyle = "#241a16";
    ctx.beginPath();
    ctx.arc(8,-164,29,Math.PI,Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(37,-169,19,0,Math.PI*2);
    ctx.fill();
  }

  const body = ctx.createLinearGradient(-48,-145,48,20);
  body.addColorStop(0,"#ffe374");
  body.addColorStop(.52,"#f2c63e");
  body.addColorStop(1,"#c4941f");
  ctx.fillStyle = body;
  roundedRect(-48,-151,96,171,46);
  ctx.fill();

  if (dai) {
    ctx.fillStyle = "#4a2d22";
    ctx.beginPath();
    ctx.moveTo(-42,-146);
    ctx.quadraticCurveTo(-70,-92,-52,-22);
    ctx.quadraticCurveTo(-37,-59,-34,-118);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(42,-146);
    ctx.quadraticCurveTo(70,-90,52,-20);
    ctx.quadraticCurveTo(36,-61,34,-118);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = "#d6d7d4";
  ctx.strokeStyle = "#626466";
  ctx.lineWidth = 9;
  [-22,22].forEach((gx) => {
    ctx.beginPath();
    ctx.arc(gx,-101,27,0,Math.PI*2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#f7f2df";
    ctx.beginPath();
    ctx.arc(gx,-101,18,0,Math.PI*2);
    ctx.fill();
    ctx.fillStyle = "#4f3527";
    ctx.beginPath();
    ctx.arc(gx+3,-100,7,0,Math.PI*2);
    ctx.fill();
    ctx.fillStyle = "#151515";
    ctx.beginPath();
    ctx.arc(gx+4,-100,3,0,Math.PI*2);
    ctx.fill();
    ctx.fillStyle = "#d6d7d4";
  });

  ctx.strokeStyle = "#4a382c";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(0,-61,18,.2,2.9);
  ctx.stroke();

  ctx.fillStyle = dai ? "#6b5b79" : "#4e7194";
  roundedRect(-39,-39,78,59,13);
  ctx.fill();
  ctx.fillStyle = dai ? "#554763" : "#3d5b79";
  ctx.fillRect(-30,-55,14,27);
  ctx.fillRect(16,-55,14,27);

  const stride = run ? Math.sin(state.elapsed * 10 + (dai ? .7 : 0)) * 18 : 0;
  ctx.strokeStyle = "#342c27";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(-22,15);
  ctx.lineTo(-24+stride,45);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(22,15);
  ctx.lineTo(24-stride,45);
  ctx.stroke();

  ctx.fillStyle = "#292726";
  roundedRect(-40+stride,39,31,12,6);
  ctx.fill();
  roundedRect(9-stride,39,31,12,6);
  ctx.fill();

  ctx.restore();
}

function drawThief(x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = "rgba(20,23,28,.88)";
  roundedRect(-38,-112,76,127,32);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0,-122,42,0,Math.PI*2);
  ctx.fill();
  drawBanana(28,-20,.43,-.55);
  ctx.restore();
}

function drawCover() {
  drawSky("#6d9db3","#e5b171",960,125,false);
  drawMountains(0,false);
  drawForestRoad(0);

  ctx.fillStyle = "rgba(255,211,122,.13)";
  ctx.fillRect(0,0,W,H);

  drawCharacter(810,550,1.34,"sofi","idle",true);
  drawCharacter(1010,550,1.34,"dai","idle",false);
  drawBanana(910,420+Math.sin(state.elapsed*2)*7,1.08,-.22);
}

function drawTheft() {
  drawSky("#425f78","#d78f5c",1070,110,false);
  drawMountains(0,false);
  drawForestRoad(state.elapsed*18);
  drawCharacter(710,555,1.08,"dai","run",false);
  drawCharacter(835,548,1.12,"sofi","run",false);
  drawThief(1085+Math.sin(state.elapsed*4)*8,535,.95);
}

function spawnObstacle() {
  const c = state.chase;
  const types = ["crate","rock","branch"];
  c.obstacles.push({
    x: W + 80,
    type: types[Math.floor(Math.random()*types.length)],
    hit: false,
  });
}

function updateChase(dt) {
  const c = state.chase;
  c.stun = Math.max(0,c.stun-dt);
  c.crouching = state.input.has("arrowdown") || state.input.has("s");

  const dir = (state.input.has("arrowright") || state.input.has("d") ? 1 : 0)
    - (state.input.has("arrowleft") || state.input.has("a") ? 1 : 0);
  c.playerX = clamp(c.playerX + dir*185*dt,220,470);

  if (!c.grounded) {
    c.vy -= 1480*dt;
    c.jumpY += c.vy*dt;
    if (c.jumpY <= 0) {
      c.jumpY = 0;
      c.vy = 0;
      c.grounded = true;
    }
  }

  const speed = c.stun > 0 ? 155 : 315;
  c.scroll += speed*dt;
  c.progress += (c.stun > 0 ? 2.2 : 5.4)*dt;

  c.spawn -= dt;
  if (c.spawn <= 0) {
    spawnObstacle();
    c.spawn = .82 + Math.random()*.62;
  }

  c.obstacles.forEach((ob) => {
    ob.x -= speed*dt;
    if (ob.hit || Math.abs(ob.x-c.playerX) > 42) return;

    const hit = ob.type === "branch"
      ? !c.crouching
      : c.jumpY < 72;

    if (hit) {
      ob.hit = true;
      c.stun = .68;
      c.hits += 1;
      c.progress = Math.max(0,c.progress-4);
      showToast(ob.type === "branch" ? "Esa rama sí estaba baja." : "Sofi: calculé mal la distancia.");
    }
  });

  c.obstacles = c.obstacles.filter((ob) => ob.x > -120);
  hudProgress.textContent = `${Math.min(100,Math.round(c.progress))}% · GOLPES ${c.hits}`;

  if (c.progress >= 100) startGate();
}

function drawObstacle(ob) {
  const ground = 596;

  if (ob.type === "branch") {
    ctx.strokeStyle = "#5d4029";
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(ob.x-42,ground-112);
    ctx.lineTo(ob.x+50,ground-112);
    ctx.stroke();

    ctx.fillStyle = "#416540";
    [-25,5,35].forEach((dx) => {
      ctx.beginPath();
      ctx.arc(ob.x+dx,ground-126,17,0,Math.PI*2);
      ctx.fill();
    });
    return;
  }

  if (ob.type === "rock") {
    ctx.fillStyle = "#6d736f";
    ctx.beginPath();
    ctx.moveTo(ob.x-36,ground);
    ctx.lineTo(ob.x-24,ground-43);
    ctx.lineTo(ob.x+15,ground-57);
    ctx.lineTo(ob.x+39,ground-20);
    ctx.lineTo(ob.x+31,ground);
    ctx.closePath();
    ctx.fill();
    return;
  }

  ctx.fillStyle = "#98683d";
  roundedRect(ob.x-29,ground-55,58,55,5);
  ctx.fill();
  ctx.strokeStyle = "#604027";
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(ob.x-23,ground-49);
  ctx.lineTo(ob.x+23,ground-7);
  ctx.moveTo(ob.x+23,ground-49);
  ctx.lineTo(ob.x-23,ground-7);
  ctx.stroke();
}

function drawChase() {
  drawSky("#46697c","#bc8654",990,112,false);
  drawMountains(-state.chase.scroll*.08,false);
  drawForestRoad(state.chase.scroll);

  state.chase.obstacles.forEach(drawObstacle);

  const c = state.chase;
  drawCharacter(c.playerX-95,558-c.jumpY*.82,.94,"dai","run",false,c.crouching);
  drawCharacter(c.playerX,558-c.jumpY,1.03,"sofi","run",false,c.crouching);
  drawThief(1085,540,.8);
}

function circleRectHit(cx,cy,r,rect) {
  const nx = clamp(cx,rect.x,rect.x+rect.w);
  const ny = clamp(cy,rect.y,rect.y+rect.h);
  return Math.hypot(cx-nx,cy-ny) < r;
}

function updateGate(dt) {
  const g = state.gate;
  let dx = 0;
  let dy = 0;

  if (state.input.has("arrowleft") || state.input.has("a")) dx -= 1;
  if (state.input.has("arrowright") || state.input.has("d")) dx += 1;
  if (state.input.has("arrowup") || state.input.has("w")) dy -= 1;
  if (state.input.has("arrowdown") || state.input.has("s")) dy += 1;

  if (dx || dy) {
    const len = Math.hypot(dx,dy);
    const nx = g.x + dx/len*g.speed*dt;
    const ny = g.y + dy/len*g.speed*dt;

    if (!g.walls.some((wall) => circleRectHit(nx,g.y,23,wall))) g.x = nx;
    if (!g.walls.some((wall) => circleRectHit(g.x,ny,23,wall))) g.y = ny;

    g.x = clamp(g.x,75,W-75);
    g.y = clamp(g.y,80,H-70);
  }

  g.pieces.forEach((piece) => {
    if (!piece.found && Math.hypot(g.x-piece.x,g.y-piece.y) < 38) {
      piece.found = true;
      showToast("Pieza encontrada.");
    }
  });

  const found = g.pieces.filter((p) => p.found).length;
  hudProgress.textContent = `${found}/3 PIEZAS`;

  if (found === 3 && Math.hypot(g.x-g.exit.x,g.y-g.exit.y) < 62) {
    setScene("guardChoice");
  }
}

function drawPiece(piece) {
  if (piece.found) return;
  ctx.save();
  ctx.translate(piece.x,piece.y);
  const pulse = 1 + Math.sin(state.elapsed*3 + piece.x)*.06;
  ctx.scale(pulse,pulse);
  const glow = ctx.createRadialGradient(0,0,2,0,0,44);
  glow.addColorStop(0,"rgba(255,231,139,.5)");
  glow.addColorStop(1,"rgba(255,231,139,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0,0,44,0,Math.PI*2);
  ctx.fill();

  ctx.fillStyle = piece.color;
  roundedRect(-23,-16,46,32,7);
  ctx.fill();
  ctx.fillStyle = "#f0d071";
  [-14,0,14].forEach((x) => {
    ctx.beginPath();
    ctx.arc(x,-18,5,0,Math.PI*2);
    ctx.fill();
  });
  ctx.restore();
}

function drawGatePuzzle() {
  const sky = ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,"#789c82");
  sky.addColorStop(1,"#2f523d");
  ctx.fillStyle = sky;
  ctx.fillRect(0,0,W,H);

  ctx.fillStyle = "#bda36f";
  ctx.beginPath();
  ctx.moveTo(90,650);
  ctx.bezierCurveTo(170,500,340,540,430,390);
  ctx.bezierCurveTo(560,180,850,410,1165,115);
  ctx.lineWidth = 74;
  ctx.strokeStyle = "#bda36f";
  ctx.stroke();

  ctx.fillStyle = "#315d3b";
  state.gate.walls.forEach((wall) => {
    if (wall.x === 0 || wall.y === 0 || wall.x > 1200 || wall.y > 650) return;
    roundedRect(wall.x,wall.y,wall.w,wall.h,22);
    ctx.fill();
  });

  ctx.fillStyle = "#446c46";
  for (let i=0;i<48;i++) {
    const x = (i*137)%W;
    const y = 70+((i*83)%590);
    ctx.beginPath();
    ctx.arc(x,y,11+(i%4)*4,0,Math.PI*2);
    ctx.fill();
  }

  state.gate.pieces.forEach(drawPiece);

  ctx.fillStyle = "#3c3025";
  roundedRect(1095,65,120,92,18);
  ctx.fill();
  ctx.strokeStyle = "#e2bd57";
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.fillStyle = "#e2bd57";
  ctx.font = "900 14px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("ENTRADA",1155,118);

  drawCharacter(state.gate.x,state.gate.y+33,.57,"sofi","idle",false,false);
}

function guardDistracted() {
  const period = state.guard.method === "dance" ? 4.2 : 5.0;
  const open = state.guard.method === "dance" ? 1.65 : 2.15;
  return state.sceneTime % period < open;
}

function updateGuard(dt) {
  const g = state.guard;
  const dir = (state.input.has("arrowright") || state.input.has("d") ? 1 : 0)
    - (state.input.has("arrowleft") || state.input.has("a") ? 1 : 0);

  g.x = clamp(g.x + dir*g.speed*dt,120,1160);

  const hiding = state.input.has("arrowdown") || state.input.has("s");
  const nearCrate = g.crates.some((x) => Math.abs(g.x-x) < 58);
  const safeHidden = hiding && nearCrate;
  const distracted = guardDistracted();

  const guardX = 770;
  const sweepRight = Math.sin(state.elapsed*1.65) > 0;
  const inCone = sweepRight
    ? g.x > guardX && g.x < guardX+350
    : g.x < guardX && g.x > guardX-350;

  if (!distracted && inCone && !safeHidden) {
    g.x = 145;
    g.caught += 1;
    showToast("Te vio. Vuelve a intentarlo.");
  }

  hudProgress.textContent = distracted
    ? "DISTRAÍDO · AHORA"
    : safeHidden
      ? "OCULTA"
      : `INTENTOS ${g.caught+1}`;

  if (g.x > 1135) setScene("vaultIntro");
}

function drawGuardRoom() {
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,"#24303c");
  g.addColorStop(1,"#11171e");
  ctx.fillStyle = g;
  ctx.fillRect(0,0,W,H);

  ctx.fillStyle = "#323e49";
  for (let y=80;y<650;y+=78) {
    for (let x=((y/78)%2)*-55;x<W;x+=138) {
      roundedRect(x,y,124,61,7);
      ctx.fill();
    }
  }

  ctx.fillStyle = "#232b32";
  ctx.fillRect(0,555,W,165);

  const guardX = 770;
  const distracted = guardDistracted();

  if (!distracted) {
    const right = Math.sin(state.elapsed*1.65) > 0;
    ctx.fillStyle = "rgba(239,197,90,.12)";
    ctx.beginPath();
    ctx.moveTo(guardX,500);
    if (right) {
      ctx.lineTo(1130,430);
      ctx.lineTo(1130,610);
    } else {
      ctx.lineTo(410,430);
      ctx.lineTo(410,610);
    }
    ctx.closePath();
    ctx.fill();
  }

  state.guard.crates.forEach((x) => {
    ctx.fillStyle = "#825932";
    roundedRect(x-43,505,86,70,8);
    ctx.fill();
    ctx.strokeStyle = "#51361f";
    ctx.lineWidth = 5;
    ctx.stroke();
  });

  ctx.fillStyle = "#24272b";
  roundedRect(guardX-48,365,96,185,36);
  ctx.fill();
  ctx.fillStyle = "#a07842";
  roundedRect(guardX-30,405,60,36,12);
  ctx.fill();
  ctx.fillStyle = "#e7e0d0";
  ctx.beginPath();
  ctx.arc(guardX-15,422,7,0,Math.PI*2);
  ctx.arc(guardX+15,422,7,0,Math.PI*2);
  ctx.fill();

  const hiding = state.input.has("arrowdown") || state.input.has("s");
  drawCharacter(state.guard.x,555,.72,"sofi","idle",false,hiding);
  drawCharacter(115,555,.67,"dai","idle",false,false);

  ctx.fillStyle = distracted ? "#f0c75b" : "#d96559";
  ctx.beginPath();
  ctx.arc(guardX,335,9,0,Math.PI*2);
  ctx.fill();
}

function restartVaultSequence() {
  state.vault.phase = "show";
  state.vault.showIndex = 0;
  state.vault.showTimer = 0;
  state.vault.input = [];
  hudTitle.textContent = "MEMORIZA LA SECUENCIA";
  hudHelp.textContent = "Después usa las teclas 1, 2, 3 y 4";
  hudProgress.textContent = "MIRA";
}

function handleVaultInput(value) {
  const v = state.vault;
  if (state.scene !== "vault" || v.phase !== "input") return;

  const expected = v.sequence[v.input.length];
  if (value !== expected) {
    v.phase = "wait";
    v.restartTimer = .9;
    showToast("No era esa. Te la muestro otra vez.");
    return;
  }

  v.input.push(value);
  hudProgress.textContent = `${v.input.length}/4 CORRECTOS`;

  if (v.input.length === v.sequence.length) {
    v.phase = "done";
    showToast("Cerradura abierta.");
    setTimeout(() => setScene("recovery"), 900);
  }
}

function updateVault(dt) {
  const v = state.vault;

  if (v.phase === "show") {
    v.showTimer += dt;
    if (v.showTimer >= .82) {
      v.showTimer = 0;
      v.showIndex += 1;
      if (v.showIndex >= v.sequence.length) {
        v.phase = "input";
        v.showIndex = -1;
        hudTitle.textContent = "REPITE LA SECUENCIA";
        hudHelp.textContent = "Usa 1, 2, 3 y 4";
        hudProgress.textContent = "0/4";
      }
    }
  }

  if (v.phase === "wait") {
    v.restartTimer -= dt;
    if (v.restartTimer <= 0) restartVaultSequence();
  }
}

function drawVaultPuzzle() {
  const bg = ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,"#1e2934");
  bg.addColorStop(1,"#0f1419");
  ctx.fillStyle = bg;
  ctx.fillRect(0,0,W,H);

  const glow = ctx.createRadialGradient(640,350,30,640,350,330);
  glow.addColorStop(0,"rgba(239,197,90,.22)");
  glow.addColorStop(1,"rgba(239,197,90,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(280,20,720,650);

  ctx.fillStyle = "#313941";
  roundedRect(300,125,680,490,34);
  ctx.fill();
  ctx.strokeStyle = "#8a7448";
  ctx.lineWidth = 9;
  ctx.stroke();

  const glyphs = ["▲","◆","●","✦"];
  const active = state.vault.phase === "show"
    ? state.vault.sequence[state.vault.showIndex]
    : null;

  glyphs.forEach((glyph,index) => {
    const x = 430 + index*140;
    const lit = active === index+1;
    ctx.fillStyle = lit ? "#d8ad45" : "#1d2329";
    roundedRect(x-50,285,100,100,18);
    ctx.fill();
    ctx.strokeStyle = lit ? "#ffe68f" : "#58616a";
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.fillStyle = lit ? "#241a0d" : "#c7c2b6";
    ctx.font = "900 39px Georgia";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(glyph,x,335);

    ctx.font = "800 15px system-ui";
    ctx.fillStyle = "#aeb3b6";
    ctx.fillText(String(index+1),x,420);
  });

  if (state.vault.phase === "input") {
    ctx.fillStyle = "#f1d271";
    ctx.font = "900 18px system-ui";
    ctx.fillText("REPITE LA SECUENCIA",640,500);
  }
}

function drawRecovery() {
  const bg = ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,"#28333e");
  bg.addColorStop(1,"#13191f");
  ctx.fillStyle = bg;
  ctx.fillRect(0,0,W,H);

  const halo = ctx.createRadialGradient(885,340,20,885,340,300);
  halo.addColorStop(0,"rgba(255,224,116,.42)");
  halo.addColorStop(1,"rgba(255,224,116,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(560,40,650,610);

  ctx.fillStyle = "#64543e";
  ctx.beginPath();
  ctx.ellipse(885,540,175,46,0,0,Math.PI*2);
  ctx.fill();

  drawBanana(885,350+Math.sin(state.elapsed*2.2)*7,1.35,-.22);
  drawCharacter(620,590,1.18,"sofi","idle",false);
  drawCharacter(1120,590,1.18,"dai","idle",true);
}

function drawFinal() {
  drawSky("#18263d","#2e4260",1000,140,true);
  drawMountains(0,true);

  ctx.fillStyle = "#1c332c";
  ctx.fillRect(0,430,W,290);

  const water = ctx.createLinearGradient(0,500,0,720);
  water.addColorStop(0,"#29485c");
  water.addColorStop(1,"#142a38");
  ctx.fillStyle = water;
  ctx.fillRect(0,500,W,220);

  for (let i=0;i<62;i++) {
    const x = (i*193)%W;
    const y = 34+((i*83)%340);
    ctx.fillStyle = `rgba(255,245,210,${.28+(i%4)*.14})`;
    ctx.beginPath();
    ctx.arc(x,y,1+(i%3)*.45,0,Math.PI*2);
    ctx.fill();
  }

  drawCharacter(250,575,1.02,"sofi","idle",false);
  drawCharacter(405,575,1.02,"dai","idle",false);
  drawBanana(330,480,.7,-.25);
}

function update(dt) {
  state.elapsed += dt;
  state.sceneTime += dt;

  if (state.scene === "chase") updateChase(dt);
  if (state.scene === "gate") updateGate(dt);
  if (state.scene === "guard") updateGuard(dt);
  if (state.scene === "vault") updateVault(dt);
}

function render() {
  ctx.clearRect(0,0,W,H);

  switch (state.scene) {
    case "cover":
      drawCover();
      break;
    case "theft":
      drawTheft();
      break;
    case "chase":
      drawChase();
      break;
    case "gate":
      drawGatePuzzle();
      break;
    case "guardChoice":
    case "guard":
      drawGuardRoom();
      break;
    case "vaultIntro":
    case "vault":
      drawVaultPuzzle();
      break;
    case "recovery":
      drawRecovery();
      break;
    case "final":
      drawFinal();
      break;
  }
}

let last = performance.now();
function loop(now) {
  const dt = Math.min((now-last)/1000,.033);
  last = now;
  update(dt);
  render();
  requestAnimationFrame(loop);
}

setScene("cover");
requestAnimationFrame(loop);
