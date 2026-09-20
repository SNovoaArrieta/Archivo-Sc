const intro = document.querySelector("#intro");
const dashboard = document.querySelector("#dashboard");
const openCaseButton = document.querySelector("#open-case");
const folders = [...document.querySelectorAll(".folder")];
const progressText = document.querySelector("#progress-text");
const progressBar = document.querySelector("#progress-bar");
const finalReportButton = document.querySelector("#final-report");
const modal = document.querySelector("#modal");
const modalCode = document.querySelector("#modal-code");
const modalTitle = document.querySelector("#modal-title");
const modalContent = document.querySelector("#modal-content");
const finalScreen = document.querySelector("#final-screen");
const backToFiles = document.querySelector("#back-to-files");

const state = {
  opened: new Set(),
  questionIndex: 0,
  choiceIndex: 0,
};

const evidence = [
  "Tiene la capacidad de hacer que una conversación normal termine siendo mucho más importante de lo que parecía.",
  "Puede estar cansada, ocupada y aun así seguir siendo de las personas con las que más ganas me da hablar.",
  "Existe evidencia consistente de que molestarla un poquito sigue siendo una de mis actividades favoritas.",
  "Tiene una sospechosa facilidad para quedarse en mi cabeza incluso cuando estamos haciendo cosas completamente distintas.",
  "Conclusión provisional: demasiado importante como para archivar el caso.",
];

const questions = [
  "Si pudiéramos desaparecer mañana por un día completo, ¿a dónde nos iríamos?",
  "¿Qué comida pediríamos ahora mismo si no tuviéramos que pensar en nada más?",
  "¿Qué cosa mía te da más risa aunque probablemente no quieras admitirlo?",
  "Si hoy tuviéramos que elegir una sola cosa para hacer juntas, ¿qué escogerías?",
  "¿Qué momento simple conmigo recuerdas y todavía te gusta?",
];

const choices = [
  {
    question: "Plan de emergencia para un día horrible:",
    a: "Dormir 12 horas sin dar explicaciones",
    b: "Comida rica + película + desaparecer del mundo",
    aResult: "Decisión aprobada. El expediente recomienda no molestar a Daiana durante aproximadamente 12 horas.",
    bResult: "Decisión aprobada. Técnicamente esto también cuenta como desaparecer del mundo.",
  },
  {
    question: "Tenemos una casa nueva. Solo podemos agregar una cosa absurda:",
    a: "Una habitación entera de LEGO",
    b: "25 Minions viviendo con nosotras",
    aResult: "Elección sensata dentro de los estándares de este expediente. Probablemente terminaríamos peleando por las piezas.",
    bResult: "Elección preocupante. La investigación solicita presupuesto inmediato para tapones de oído.",
  },
  {
    question: "Sofi dice: “yo cocino”. ¿Qué haces?",
    a: "Confiar. Sin hacer preguntas.",
    b: "Pedir comida antes de que sea demasiado tarde.",
    aResult: "Valiente. El departamento de riesgos deja constancia de tu decisión.",
    bResult: "Protocolo preventivo correctamente aplicado. Cero objeciones.",
  },
  {
    question: "Tenemos una noche libre:",
    a: "Videojuegos hasta que se nos olvide la hora",
    b: "Hablar de cualquier cosa hasta quedarnos dormidas",
    aResult: "Resultado registrado: competitividad, risas y probablemente alguna acusación de trampa.",
    bResult: "Resultado registrado: empezamos hablando de una bobada y terminamos a las tres horas en otro tema completamente distinto.",
  },
];

function escapeHTML(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}

function updateProgress() {
  const count = state.opened.size;
  progressText.textContent = `${count}/4 carpetas revisadas`;
  progressBar.style.width = `${count * 25}%`;

  folders.forEach((folder) => {
    if (state.opened.has(folder.dataset.folder)) {
      folder.classList.add("is-opened");
      folder.querySelector(".folder-status").textContent = "REVISAR";
    }
  });

  if (count === 4) {
    finalReportButton.classList.remove("is-hidden");
  }
}

function openModal(code, title, html) {
  modalCode.textContent = code;
  modalTitle.textContent = title;
  modalContent.innerHTML = html;
  modal.classList.remove("is-hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.add("is-hidden");
  document.body.style.overflow = "";
}

function evidenceMarkup() {
  return `
    <div class="evidence-stack">
      ${evidence.map((item, index) => `
        <article class="evidence-card" style="--tilt:${index % 2 === 0 ? "-.4deg" : ".35deg"}">
          <span>EVIDENCIA #0${index + 1}</span>
          <p>${escapeHTML(item)}</p>
        </article>
      `).join("")}
    </div>
  `;
}

function questionMarkup() {
  const question = questions[state.questionIndex];

  return `
    <div class="question-panel">
      <span class="question-number">PREGUNTA ${String(state.questionIndex + 1).padStart(2, "0")} / ${String(questions.length).padStart(2, "0")}</span>
      <p class="big-question">${escapeHTML(question)}</p>
      <p class="question-hint">Respóndela en la llamada. Aquí no guardamos respuestas porque eso ya sería demasiado serio.</p>
      <button id="next-question" class="document-button" type="button">
        ${state.questionIndex === questions.length - 1 ? "VOLVER A LA PRIMERA" : "SIGUIENTE PREGUNTA"}
      </button>
    </div>
  `;
}

function bindQuestionButton() {
  const button = document.querySelector("#next-question");
  if (!button) return;

  button.addEventListener("click", () => {
    state.questionIndex = (state.questionIndex + 1) % questions.length;
    modalContent.innerHTML = questionMarkup();
    bindQuestionButton();
  });
}

function choiceMarkup() {
  const item = choices[state.choiceIndex];

  return `
    <div class="choice-panel">
      <span class="question-number">DECISIÓN ${String(state.choiceIndex + 1).padStart(2, "0")} / ${String(choices.length).padStart(2, "0")}</span>
      <p class="big-question">${escapeHTML(item.question)}</p>

      <div class="choice-options">
        <button class="choice-option" data-choice="a" type="button">${escapeHTML(item.a)}</button>
        <button class="choice-option" data-choice="b" type="button">${escapeHTML(item.b)}</button>
      </div>

      <div id="choice-result"></div>
    </div>
  `;
}

function bindChoices() {
  const buttons = [...document.querySelectorAll(".choice-option")];
  const result = document.querySelector("#choice-result");
  const item = choices[state.choiceIndex];

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const text = button.dataset.choice === "a" ? item.aResult : item.bResult;

      result.innerHTML = `
        <div class="choice-result">
          <strong>Resultado oficial:</strong><br>
          ${escapeHTML(text)}
        </div>
        <button id="next-choice" class="document-button" type="button">
          ${state.choiceIndex === choices.length - 1 ? "VOLVER A LA PRIMERA" : "SIGUIENTE DECISIÓN"}
        </button>
      `;

      document.querySelector("#next-choice").addEventListener("click", () => {
        state.choiceIndex = (state.choiceIndex + 1) % choices.length;
        modalContent.innerHTML = choiceMarkup();
        bindChoices();
      });
    });
  });
}

function truthMarkup() {
  return `
    <div class="truth-panel">
      <blockquote>“Resultado de la investigación: sí, eres muy importante para mí.”</blockquote>
      <p>No quería que esto se convirtiera en algo demasiado elaborado ni empalagoso. Solo quería hacerte un espacio distinto hoy, aunque fuera detrás de una pantalla.</p>
      <p>Me gusta compartir contigo hasta las cosas simples: hablar cualquier bobada, molestarte, escucharte cuando tienes cosas encima y simplemente pasar tiempo contigo.</p>
      <p>Y como sé que has estado cansada, esto no tenía que ser una prueba ni una actividad complicada. Solo una excusa para estar un rato juntas y hacerte sonreír.</p>
      <p class="truth-sign">— Declaración voluntaria de Sofi. Sin abogado presente.</p>
    </div>
  `;
}

function openFolder(type) {
  state.opened.add(type);
  updateProgress();

  if (type === "evidence") {
    openModal("CARPETA 01 · EVIDENCIA", "Evidencia cuestionable", evidenceMarkup());
    return;
  }

  if (type === "questions") {
    openModal("CARPETA 02 · INTERROGATORIO", "Preguntas rápidas", questionMarkup());
    bindQuestionButton();
    return;
  }

  if (type === "choices") {
    openModal("CARPETA 03 · DECISIONES", "Asuntos importantes", choiceMarkup());
    bindChoices();
    return;
  }

  openModal("CARPETA 04 · CLASIFICADO", "Lo que quería decirte", truthMarkup());
}

openCaseButton.addEventListener("click", () => {
  intro.classList.add("is-hidden");
  dashboard.classList.remove("is-hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

folders.forEach((folder) => {
  folder.addEventListener("click", () => openFolder(folder.dataset.folder));
});

document.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.classList.contains("is-hidden")) {
    closeModal();
  }
});

finalReportButton.addEventListener("click", () => {
  dashboard.classList.add("is-hidden");
  finalScreen.classList.remove("is-hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

backToFiles.addEventListener("click", () => {
  finalScreen.classList.add("is-hidden");
  dashboard.classList.remove("is-hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

updateProgress();