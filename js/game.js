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
    finding: "Se detectó afinidad por Lego, videojuegos y Minions. Esto incrementa peligrosamente la posibilidad de que Sofi siga encontrando excusas para inventar planes raros.",
    status: "RIESGO ALTO",
  },
  {
    code: "OBS-05",
    title: "Efecto llamada inesperadamente larga",
    finding: "Una llamada que supuestamente iba a ser corta puede terminar bastante después y con cinco temas nuevos abiertos. Nadie sabe quién tiene la culpa.",
    status: "RECURRENTE",
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
    tag: "PISTA 01",
    text: "El expediente dice que tienes una obsesión sospechosa con algunas cosas. ¿Cuál dirías que es tu obsesión más fuerte ahora mismo?",
    hint: "Puede ser un juego, una serie, Lego, comida, una canción o cualquier cosa que te tenga pegada últimamente.",
  },
  {
    tag: "PISTA 02",
    text: "Si alguien quisiera reconocerte sin verte, ¿qué hábito o manía tuya lo delataría primero?",
    hint: "Necesito información útil para identificar al sujeto.",
  },
  {
    tag: "PISTA 03",
    text: "¿Qué cosa te da risa casi siempre, aunque ya sepas que es una bobada?",
    hint: "Toda investigación seria necesita saber qué rompe tu cara de seria.",
  },
  {
    tag: "PISTA 04",
    text: "¿Cuál es un gusto tuyo que defenderías aunque otra persona diga que es raro?",
    hint: "Aquí no juzgamos. Bueno, un poquito sí.",
  },
  {
    tag: "PISTA 05",
    text: "¿Qué detalle pequeño de tu día probablemente nadie nota, pero para ti sí importa?",
    hint: "Puede ser algo de tu rutina, una costumbre o una cosa mínima que siempre haces.",
  },
  {
    tag: "PISTA 06",
    text: "¿Qué cosa de tu infancia todavía sigue formando parte de ti ahora?",
    hint: "Puede ser un gusto, una costumbre, una forma de pensar o algo que todavía te encanta.",
  },
  {
    tag: "PISTA 07",
    text: "Si tuvieras que dejar una pista falsa sobre ti para confundir a la investigadora, ¿qué dirías?",
    hint: "Esta sí puede ser puro caos. La investigación lo permite.",
  },
  {
    tag: "PISTA 08",
    text: "¿Qué dato sobre ti crees que yo todavía no tengo y debería estar en este expediente?",
    hint: "Aquí puedes sabotear directamente mi investigación si quieres.",
  },
];

const choices = [
  {
    question: "Te despiertas y por alguna razón puedes leer la mente de una sola persona durante 10 minutos. ¿Qué haces?",
    a: "Elijo a alguien que conozco",
    b: "Elijo a un desconocido solo por curiosidad",
    aResult: "Interesante. Eso dice que prefieres resolver misterios cercanos antes que buscar caos nuevo.",
    bResult: "Anotado. Nivel de curiosidad: peligrosamente alto.",
  },
  {
    question: "Te dan un botón que puede borrar para siempre una sola cosa molesta del mundo. ¿Qué quitas?",
    a: "Algo pequeño pero insoportable del día a día",
    b: "Algo enorme que afecta a todo el mundo",
    aResult: "Práctica. Primero se arregla lo que fastidia todos los días.",
    bResult: "Ambiciosa. Tú sí llegaste a cambiar el sistema completo.",
  },
  {
    question: "Tienes que vivir una semana dentro de una película. ¿Qué tipo escogerías?",
    a: "Algo tranquilo, bonito y cero peligroso",
    b: "Algo lleno de caos, aventura y problemas",
    aResult: "Respuesta sensata. Sobrevivir primero, protagonizar después.",
    bResult: "Respuesta preocupante. Claramente quieres trama.",
  },
  {
    question: "Encuentras una puerta que dice: “No abrir”. No hay cámaras. Nadie te está mirando. ¿Qué haces?",
    a: "La abro porque ahora necesito saber",
    b: "La dejo quieta porque seguro hay una razón",
    aResult: "Perfecto. La curiosidad ganó otra vez.",
    bResult: "Autocontrol sorprendente. El expediente no esperaba tanta disciplina.",
  },
  {
    question: "Puedes dominar instantáneamente una habilidad nueva. ¿Qué tipo de habilidad escogerías?",
    a: "Algo útil para la vida real",
    b: "Algo inútil pero demasiado divertido",
    aResult: "Práctica otra vez. Claramente piensas en sacarle provecho.",
    bResult: "Correcto. No todo tiene que servir para algo.",
  },
  {
    question: "Te ofrecen saber exactamente qué va a pasar mañana. ¿Aceptas?",
    a: "Sí, quiero saber todo",
    b: "No, prefiero que pase y ya",
    aResult: "Necesidad de información detectada. Cero sorpresas permitidas.",
    bResult: "Anotado. Prefieres vivirlo antes que arruinarte la sorpresa.",
  },
  {
    question: "Solo puedes elegir uno para una semana entera:",
    a: "No usar redes sociales",
    b: "No escuchar música",
    aResult: "Interesante sacrificio. Sobreviviste sin redes.",
    bResult: "Eso sí fue una decisión seria. El expediente toma nota.",
  },
  {
    question: "Un desconocido te da una caja cerrada y dice: “adentro hay algo que te va a sorprender”. ¿Qué haces?",
    a: "La abro inmediatamente",
    b: "Primero intento averiguar qué puede ser",
    aResult: "Impulso primero, preguntas después. Muy útil para este caso.",
    bResult: "Precavida. No te comes cualquier misterio tan fácil.",
  },
  {
    question: "Si pudieras repetir un solo día de tu vida exactamente como fue, ¿lo harías?",
    a: "Sí, hay uno que volvería a vivir",
    b: "No, prefiero seguir acumulando días nuevos",
    aResult: "Eso sí deja una pista interesante. Hay recuerdos que pesan bonito.",
    bResult: "También dice bastante: mejor seguir avanzando que mirar atrás.",
  },
  {
    question: "Última reconstrucción: si alguien quisiera conocerte de verdad, ¿qué tendría que descubrir primero?",
    a: "Cómo piensas y por qué haces lo que haces",
    b: "Las pequeñas cosas que te gustan y te hacen ser tú",
    aResult: "Buena pista. Entonces el verdadero caso está en tu cabeza.",
    bResult: "Buena pista. Entonces el caso se resuelve en los detalles pequeños.",
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
          <span>ANOTADO</span>
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
      <div class="classified-strip">NOTA FINAL DE SOFI · SOLO PARA DAIANA</div>

      <blockquote>“Bueno bonita, ya que llegaste hasta aquí, te tocaba encontrar lo que realmente quería decirte.”</blockquote>

      <div class="truth-facts">
        <article>
          <span>01</span>
          <strong>Me gusta conocerte de verdad, no quedarme solo con lo que ya sé de ti.</strong>
          <p>Por eso hice todo este caso. Me da curiosidad saber tus cosas raras, lo que piensas, lo que te gusta, las bobadas que haces y esas partes tuyas que todavía no conozco.</p>
        </article>

        <article>
          <span>02</span>
          <strong>También me gusta mucho la forma en la que somos tú y yo.</strong>
          <p>La molestadera, las llamadas, hablar cualquier cosa, pasar de un tema serio a una estupidez en dos segundos... no sé, me gusta que contigo puedo tener todo eso.</p>
        </article>

        <article>
          <span>03</span>
          <strong>Y sí, obviamente tenía que inventarme algo raro.</strong>
          <p>Porque simplemente decirte “feliz Amor y Amistad” me parecía demasiado normal para mí. Así que terminé haciéndote un expediente entero. Muy razonable todo.</p>
        </article>

        <article>
          <span>04</span>
          <strong>Pero fuera de la bobada, sí quería que supieras algo.</strong>
          <p>Me importas mucho, bonita. Me gusta tenerte en mi vida, seguir descubriendo cosas de ti y seguir construyendo esto a nuestra manera, aunque nos toque hacerlo a distancia.</p>
        </article>
      </div>

      <p class="truth-sign">— Fin de la investigación. Por ahora.</p>
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
    openModal("CARPETA 02 · INTERROGATORIO", "Interrogatorio del caso", questionMarkup());
    bindQuestionButton();
    return;
  }

  if (type === "choices") {
    openModal("CARPETA 03 · DECISIONES", "Reconstrucción de los hechos", choiceMarkup());
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
