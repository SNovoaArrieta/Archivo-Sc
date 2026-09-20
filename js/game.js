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
  {
    code: "OBS-01",
    title: "Efecto conversación infinita",
    finding: "Una conversación que empieza con cualquier bobada tiene altas probabilidades de terminar tres temas después, con una historia nueva y cero idea de cómo llegamos hasta ahí.",
    status: "CONFIRMADO",
  },
  {
    code: "OBS-02",
    title: "Persistencia mental sospechosa",
    finding: "Daiana aparece en la cabeza de Sofi incluso cuando ambas están ocupadas en cosas completamente distintas. No se ha encontrado explicación científica.",
    status: "BAJO INVESTIGACIÓN",
  },
  {
    code: "OBS-03",
    title: "Tolerancia anormal al fastidio",
    finding: "A pesar de recibir cantidades considerables de molestadera, Daiana continúa contestando. El equipo investigador considera esto una conducta extrañamente valiente.",
    status: "INEXPLICABLE",
  },
  {
    code: "OBS-04",
    title: "Intereses de alto riesgo",
    finding: "Se detectó afinidad por LEGO, videojuegos y Minions. Esto incrementa peligrosamente la posibilidad de que Sofi siga encontrando excusas para inventar planes raros.",
    status: "RIESGO ALTO",
  },
  {
    code: "OBS-05",
    title: "Impacto en días pesados",
    finding: "Incluso cuando el día ha sido largo, hablar un rato con ella puede cambiar por completo el tono de la noche. Este efecto ha sido observado en más de una ocasión.",
    status: "CONFIRMADO",
  },
  {
    code: "OBS-06",
    title: "Conclusión provisional",
    finding: "El sujeto dejó de ser un caso casual hace rato. Recomendación oficial: no archivar, no ignorar y seguir investigando.",
    status: "PRIORIDAD ALTA",
  },
];

const questions = [
  {
    tag: "CALENTAMIENTO",
    text: "Si pudiéramos pedir cualquier cosa para comer ahora mismo y apareciera mágicamente, ¿qué pedirías?",
    hint: "Respuesta rápida. No vale decir “no sé”. El expediente exige compromiso.",
  },
  {
    tag: "PLAN IMPROVISADO",
    text: "Mañana nos regalan un día completamente libre. ¿Lo usamos para salir, dormir, jugar, comer o desaparecer del mundo?",
    hint: "Puedes mezclar opciones. Este interrogatorio acepta caos.",
  },
  {
    tag: "CONFESIÓN MENOR",
    text: "¿Qué cosa mía te da risa incluso cuando intentas hacerte la seria?",
    hint: "El investigador principal solicita sinceridad, aunque pueda arrepentirse.",
  },
  {
    tag: "CASO HIPOTÉTICO",
    text: "Nos dejan encerradas toda una noche en una tienda enorme. ¿A qué sección iríamos primero?",
    hint: "Puntos extra si la respuesta incluye LEGO, comida o algo completamente innecesario.",
  },
  {
    tag: "DETALLE SOSPECHOSO",
    text: "¿Qué cosa pequeña de mí has notado que crees que yo ni siquiera sé que hago?",
    hint: "Esta pregunta puede revelar información clasificada.",
  },
  {
    tag: "ARCHIVO PERSONAL",
    text: "¿Qué momento sencillo conmigo guardarías aunque no haya sido nada “especial”?",
    hint: "No tiene que ser algo grande. Justamente esa es la idea.",
  },
  {
    tag: "PLAN PENDIENTE",
    text: "Cuando podamos compartir un día completo en el mismo lugar, ¿qué te gustaría que hiciéramos primero?",
    hint: "No es contrato. Pero la investigadora podría tomar notas.",
  },
];

const choices = [
  {
    question: "Día oficialmente horrible. Solo podemos ejecutar un protocolo:",
    a: "Dormir 12 horas, desaparecer y responder mañana",
    b: "Comida rica, película y cero conversaciones serias",
    aResult: "PROTOCOLO SUEÑO PROFUNDO aprobado. Riesgo principal: despertar sin saber qué día es.",
    bResult: "PROTOCOLO AISLAMIENTO CONFORTABLE aprobado. Requiere manta, comida y derecho a ignorar el mundo.",
  },
  {
    question: "Nos dan una habitación vacía y presupuesto irresponsable:",
    a: "La convertimos en una sala LEGO gigante",
    b: "La llenamos de Minions hasta que alguien se arrepienta",
    aResult: "Decisión sorprendentemente razonable. Probabilidad de discutir por una pieza específica: 91%.",
    bResult: "El comité solicita reconsiderar. Veinticinco Minions pueden constituir una amenaza acústica.",
  },
  {
    question: "Estamos jugando y una pierde de forma bastante humillante:",
    a: "Aceptar la derrota con dignidad",
    b: "Acusar inmediatamente a la otra de hacer trampa",
    aResult: "Respuesta poco creíble. El sistema la ha registrado de todos modos.",
    bResult: "Conducta estadísticamente más probable. Investigación cerrada.",
  },
  {
    question: "Sofi anuncia con seguridad: “yo cocino”. Tu reacción:",
    a: "Confiar plenamente en el proceso",
    b: "Abrir una app de domicilios por prevención",
    aResult: "Nivel de valentía: preocupante. Se recomienda localizar el extintor antes de continuar.",
    bResult: "Protocolo preventivo correcto. Ninguna objeción por parte del departamento de seguridad.",
  },
  {
    question: "Noche libre sin obligaciones. ¿Qué versión gana?",
    a: "Videojuegos hasta olvidar la hora",
    b: "Hablar de cualquier bobada hasta terminar en una conversación de tres horas",
    aResult: "Pronóstico: competitividad innecesaria, risas y al menos una acusación dudosa.",
    bResult: "Pronóstico: empezar con un meme y terminar cuestionando media existencia. Bastante probable.",
  },
  {
    question: "Podemos teletransportarnos durante dos horas a cualquier sitio:",
    a: "Un lugar bonito y tranquilo donde nadie nos moleste",
    b: "Un sitio absurdo solo porque nos daría risa estar ahí",
    aResult: "Decisión registrada: paz, conversación y probablemente comida. El expediente lo aprueba.",
    bResult: "Decisión registrada: cero sentido práctico. Por eso mismo tiene potencial.",
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
      <div class="case-summary">
        <span>RESUMEN DEL ANALISTA</span>
        <p>Seis observaciones fueron consideradas suficientemente sospechosas como para permanecer en el expediente.</p>
      </div>

      ${evidence.map((item, index) => `
        <article class="evidence-card" style="--tilt:${index % 2 === 0 ? "-.4deg" : ".35deg"}">
          <div class="evidence-meta">
            <span>${escapeHTML(item.code)}</span>
            <em>${escapeHTML(item.status)}</em>
          </div>
          <strong class="evidence-title">${escapeHTML(item.title)}</strong>
          <p>${escapeHTML(item.finding)}</p>
        </article>
      `).join("")}

      <div class="case-verdict">
        <span>DICTAMEN PROVISIONAL</span>
        <strong>No archivar bajo ninguna circunstancia.</strong>
        <p>La investigación continúa porque, aparentemente, todavía quedan demasiadas cosas por descubrir.</p>
      </div>
    </div>
  `;
}

function questionMarkup() {
  const question = questions[state.questionIndex];

  return `
    <div class="question-panel">
      <div class="question-topline">
        <span class="question-number">PREGUNTA ${String(state.questionIndex + 1).padStart(2, "0")} / ${String(questions.length).padStart(2, "0")}</span>
        <span class="question-tag">${escapeHTML(question.tag)}</span>
      </div>
      <p class="big-question">${escapeHTML(question.text)}</p>
      <p class="question-hint">${escapeHTML(question.hint)}</p>
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
          <span>RESULTADO OFICIAL</span>
          <p>${escapeHTML(text)}</p>
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
      <div class="classified-strip">DECLARACIÓN DESCLASIFICADA POR ORDEN DE SOFI</div>

      <blockquote>“La parte importante de todo esto no era hacer algo perfecto. Era hacer algo pensado para ti.”</blockquote>

      <div class="truth-facts">
        <article>
          <span>HALLAZGO 01</span>
          <strong>Me gusta tenerte cerca incluso cuando no estamos haciendo nada especial.</strong>
          <p>No necesito que cada conversación sea profunda ni que cada momento tenga algo extraordinario. Me gustan también las bobadas, los silencios, molestarte y simplemente saber de ti.</p>
        </article>

        <article>
          <span>HALLAZGO 02</span>
          <strong>No quiero que conmigo sientas que tienes que estar bien todo el tiempo.</strong>
          <p>Si estás cansada, ocupada o simplemente no tienes energía, no pasa nada. También quiero compartir esa versión tuya, no solamente los días fáciles.</p>
        </article>

        <article>
          <span>HALLAZGO 03</span>
          <strong>Me gusta descubrirte poco a poco.</strong>
          <p>Las cosas que te gustan, lo que te da risa, lo que te fastidia, tus rarezas, tus ideas y hasta esas cosas pequeñas que probablemente tú no consideras importantes.</p>
        </article>

        <article>
          <span>HALLAZGO 04</span>
          <strong>Hoy solo quería hacerte sentir importante.</strong>
          <p>No con algo enorme ni complicado. Solo reservar un rato para nosotras, hacerte reír un poco y decirte de una forma distinta que me alegra mucho tenerte en mi vida.</p>
        </article>
      </div>

      <p class="truth-sign">— Declaración voluntaria de Sofi. Cero arrepentimientos al momento de archivar.</p>
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
    openModal("CARPETA 02 · INTERROGATORIO", "Interrogatorio no autorizado", questionMarkup());
    bindQuestionButton();
    return;
  }

  if (type === "choices") {
    openModal("CARPETA 03 · DECISIONES", "Decisiones de máxima importancia", choiceMarkup());
    bindChoices();
    return;
  }

  openModal("CARPETA 04 · CLASIFICADO", "Lo que realmente quería decirte", truthMarkup());
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
