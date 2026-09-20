import { AudioManager } from "./audio.js";
import { ChaseController } from "./player.js";
import { FINAL_MESSAGE, SCENES } from "./scenes.js";

const stage = document.querySelector("#stage");
const soundToggle = document.querySelector("#sound-toggle");

const gameState = {
  scene: "cover",
  choiceHistory: [],
  soundEnabled: false,
  chaseCompleted: false,
};

const audio = new AudioManager();

const chase = new ChaseController({
  onMove(direction) {
    console.debug("[chase] move", direction);
  },
  onJump() {
    console.debug("[chase] jump");
  },
});

function createBackdrop(sceneId) {
  const backdrop = document.createElement("div");
  backdrop.className = "scene__backdrop";
  backdrop.dataset.scene = sceneId;

  // Codex reemplazará estas bases por fondos ilustrados/SVG consistentes.
  backdrop.style.background =
    sceneId === "final"
      ? "linear-gradient(180deg, #18253b 0%, #263650 45%, #151a22 100%)"
      : "linear-gradient(180deg, #7fa8b3 0%, #b9c99a 52%, #526f4f 100%)";

  return backdrop;
}

function createCharacterPair() {
  const pair = document.createElement("div");
  pair.className = "character-pair";

  pair.innerHTML = `
    <div class="character-slot" data-character="sofi" data-character-label="SOFI">
      <div class="character-slot__placeholder" aria-label="Asset de Sofi pendiente"></div>
    </div>

    <div class="character-slot" data-character="daiana" data-character-label="DAIANA">
      <div class="character-slot__placeholder" aria-label="Asset de Daiana pendiente"></div>
    </div>
  `;

  return pair;
}

function renderFinal() {
  chase.unmount();

  const scene = document.createElement("section");
  scene.className = "scene";
  scene.append(createBackdrop("final"));

  const content = document.createElement("div");
  content.className = "scene__content";

  const card = document.createElement("article");
  card.className = "final-card";
  card.innerHTML = `
    <h1>MISIÓN COMPLETADA</h1>
    <p></p>
  `;

  card.querySelector("p").textContent = FINAL_MESSAGE;
  content.append(card);
  scene.append(content);

  stage.replaceChildren(scene);
}

function renderScene(sceneId) {
  const sceneData = SCENES[sceneId];

  if (!sceneData) {
    throw new Error(`Escena desconocida: ${sceneId}`);
  }

  gameState.scene = sceneId;

  if (sceneData.mode === "final") {
    renderFinal();
    return;
  }

  if (sceneData.mode === "chase") {
    chase.mount();
  } else {
    chase.unmount();
  }

  const scene = document.createElement("section");
  scene.className = "scene";
  scene.append(createBackdrop(sceneId));

  const content = document.createElement("div");
  content.className = "scene__content";

  const kicker = document.createElement("p");
  kicker.className = "scene__kicker";
  kicker.textContent = sceneData.kicker ?? "";

  const title = document.createElement("h1");
  title.className = "scene__title";
  title.textContent = sceneData.title ?? "";

  const copy = document.createElement("p");
  copy.className = "scene__copy";
  copy.textContent = sceneData.copy ?? "";

  content.append(kicker, title, copy);

  if (sceneData.showCharacters) {
    content.append(createCharacterPair());
  }

  if (sceneData.mode === "chase") {
    const note = document.createElement("p");
    note.className = "debug-note";
    note.textContent =
      "Controles preparados: ← → / A D para movimiento y ↑ / W / espacio para salto.";
    content.append(note);
  }

  if (sceneData.actions?.length) {
    const actions = document.createElement("div");
    actions.className = "scene__actions";

    sceneData.actions.forEach((action, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className =
        index === 0 ? "game-button" : "game-button game-button--secondary";
      button.textContent = action.label;

      button.addEventListener("click", () => {
        if (action.choice) {
          gameState.choiceHistory.push({
            scene: sceneId,
            choice: action.choice,
          });
        }

        if (sceneData.mode === "chase") {
          gameState.chaseCompleted = true;
        }

        renderScene(action.next);
      });

      actions.append(button);
    });

    content.append(actions);
  }

  scene.append(content);
  stage.replaceChildren(scene);
}

soundToggle.addEventListener("click", () => {
  gameState.soundEnabled = !gameState.soundEnabled;
  audio.setEnabled(gameState.soundEnabled);

  soundToggle.setAttribute(
    "aria-pressed",
    String(gameState.soundEnabled),
  );

  soundToggle.textContent = gameState.soundEnabled
    ? "Sonido: ON"
    : "Sonido: OFF";
});

renderScene(gameState.scene);
