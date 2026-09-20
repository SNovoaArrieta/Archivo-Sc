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
    tag: "PEQUEÑO DETALLE",
    text: "¿Qué cosa pequeña puede hacer alguien por ti y logra mejorarte el día casi de inmediato?",
    hint: "Puede ser un mensaje, una llamada, una forma de hablarte o cualquier detalle simple.",
  },
  {
    tag: "DÍAS PESADOS",
    text: "Cuando estás muy cansada o tienes demasiadas cosas encima, ¿cómo prefieres que te acompañen?",
    hint: "¿Hablar, distraerte, escucharte, darte espacio, hacerte reír? Quiero aprender bien esa parte de ti.",
  },
  {
    tag: "FORMA DE CARIÑO",
    text: "Aunque estemos lejos, ¿qué cosas te hacen sentir más querida o acompañada por mí?",
    hint: "No tiene que ser algo grande. Justamente quiero saber qué detalles sí te llegan de verdad.",
  },
  {
    tag: "DATO CURIOSO",
    text: "¿Qué hábito, manía o pequeña rareza tuya crees que todavía no conozco?",
    hint: "El expediente acepta información vergonzosa, absurda o completamente inútil.",
  },
  {
    tag: "TU LUGAR SEGURO",
    text: "¿Qué haces normalmente cuando necesitas sentirte tranquila otra vez?",
    hint: "Puede ser algo que ves, haces, comes, piensas o simplemente una rutina tuya.",
  },
  {
    tag: "RECUERDO FAVORITO",
    text: "¿Cuál es un recuerdo de tu infancia o adolescencia que todavía te hace sonreír cuando lo piensas?",
    hint: "Quiero conocer también las historias tuyas de antes de que yo apareciera.",
  },
  {
    tag: "GUSTO MUY TUYO",
    text: "¿Qué cosa te gusta muchísimo y sientes que la mayoría de la gente no entiende tanto como tú?",
    hint: "Puede ser algo serio o una obsesión completamente específica.",
  },
  {
    tag: "ALGO QUE QUIERES QUE SEPA",
    text: "¿Hay algo de ti que te gustaría que yo entendiera mejor y que quizás nunca te he preguntado?",
    hint: "No tiene que ser profundo si no quieres. Tú decides hasta dónde llega este expediente.",
  },
  {
    tag: "VERSIÓN FELIZ",
    text: "¿Cómo es un día que para ti se siente realmente bonito, incluso si no pasa nada extraordinario?",
    hint: "Quiero saber qué cosas simples hacen que un día se sienta bien para ti.",
  },
  {
    tag: "ENTRE NOSOTRAS",
    text: "¿Qué es algo que te gusta de la forma en que nos relacionamos y te gustaría que nunca cambiara?",
    hint: "Esta sí queda oficialmente archivada como información importante.",
  },
];

const choices = [
  {
    question: "Después de un día pesado, ¿qué te haría sentir más acompañada por mí?",
    a: "Una llamada tranquila aunque hablemos poco",
    b: "Mensajes y audios durante la noche, sin presión",
    aResult: "Resultado archivado: presencia tranquila. A veces estar ahí vale más que intentar arreglarlo todo.",
    bResult: "Resultado archivado: compañía en pequeñas dosis. Presente, pero sin convertirlo en otra obligación.",
  },
  {
    question: "Tenemos una noche solo para nosotras a distancia. ¿Qué te gustaría más?",
    a: "Ver algo juntas y comentarlo durante la llamada",
    b: "Hablar sin plan hasta que terminemos en cualquier tema",
    aResult: "Protocolo aprobado: plan sencillo, pantalla compartida y derecho a criticar todo.",
    bResult: "Protocolo aprobado: conversación sin rumbo. Alta probabilidad de perder la noción del tiempo.",
  },
  {
    question: "Si estás de mal humor y yo quiero ayudarte, ¿qué prefieres?",
    a: "Que intente hacerte reír y distraerte",
    b: "Que te escuche y no intente solucionar nada",
    aResult: "Dato importante registrado: distraer primero, analizar después.",
    bResult: "Dato importante registrado: acompañar sin convertir la conversación en una sesión de soluciones.",
  },
  {
    question: "¿Qué tipo de detalle a distancia te gustaría recibir más seguido?",
    a: "Algo inesperado: una página, una nota, una sorpresa pequeña",
    b: "Algo simple y constante: mensajes, audios o llamadas",
    aResult: "Preferencia detectada: pequeñas sorpresas. Sofi queda oficialmente autorizada para seguir inventando cosas raras.",
    bResult: "Preferencia detectada: constancia. Menos espectáculo, más estar presente de verdad.",
  },
  {
    question: "Si solo tenemos 20 minutos para compartir un día, ¿qué prefieres?",
    a: "Videollamada rápida solo para vernos y hablar un rato",
    b: "Mandarnos audios y contarnos cómo estuvo el día",
    aResult: "Resultado: poco tiempo, pero compartido en tiempo real. El expediente lo considera suficiente para salvar una noche.",
    bResult: "Resultado: conversación sin reloj. Ideal para días donde coincidir se vuelve imposible.",
  },
  {
    question: "Cuando no coincidimos por horarios o trabajo, ¿qué te gustaría que hiciéramos?",
    a: "Dejarnos mensajes para responder cuando podamos",
    b: "Guardar lo importante para una llamada después",
    aResult: "Sistema asincrónico aprobado. Cero presión por responder inmediatamente.",
    bResult: "Sistema de llamada pendiente aprobado. Algunas historias merecen ser contadas viendo la reacción de la otra.",
  },
  {
    question: "¿Qué crees que nos ayuda más a sentirnos cerca estando lejos?",
    a: "Compartir cosas pequeñas del día, aunque parezcan tontas",
    b: "Reservar momentos especiales solo para nosotras",
    aResult: "Hallazgo: la cercanía también se construye con cosas pequeñas y cotidianas.",
    bResult: "Hallazgo: tener espacios solo de ustedes sigue siendo importante aunque sea detrás de una pantalla.",
  },
  {
    question: "Si tuvieras que poner una regla para nuestra distancia, ¿cuál sería?",
    a: "Nunca asumir que la otra sabe lo que sentimos: decirlo",
    b: "No convertir la distancia en presión: hablar cuando podamos",
    aResult: "Regla registrada: menos suposiciones, más claridad. Bastante útil para este expediente.",
    bResult: "Regla registrada: presencia sin presión. Estar cerca no siempre significa estar disponibles todo el tiempo.",
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
    openModal("CARPETA 02 · INTERROGATORIO", "Para conocerte mejor", questionMarkup());
    bindQuestionButton();
    return;
  }

  if (type === "choices") {
    openModal("CARPETA 03 · DECISIONES", "Decisiones entre nosotras", choiceMarkup());
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
