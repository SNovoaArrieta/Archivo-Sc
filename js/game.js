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
    tag: "ME DA CURIOSIDAD",
    text: "Bonita, dime una cosa de ti que casi nadie sepa pero que te dé risa contar.",
    hint: "Puede ser una manía, una costumbre rara o una bobada. No te voy a juzgar... mucho.",
  },
  {
    tag: "CUANDO ESTÁS BOLITA",
    text: "Cuando llegas cansada de verdad y ya no quieres saber nada de nadie, ¿qué te ayuda más conmigo?",
    hint: "Que te distraiga, que te escuche, que me quede ahí contigo o que te deje descansar. Quiero saberlo bien y no andar adivinando.",
  },
  {
    tag: "DESDE LEJOS",
    text: "¿Qué cosa hago yo que sí te hace sentir acompañada aunque estemos detrás de una pantalla?",
    hint: "Puede ser una llamada, un audio, que te moleste, que te deje tranquila... lo que de verdad te funcione.",
  },
  {
    tag: "OBSESIÓN ACTUAL",
    text: "¿Qué te tiene obsesionada últimamente?",
    hint: "Canción, juego, serie, comida, video, LEGO, cualquier cosa. Necesito actualizar mis archivos sobre ti.",
  },
  {
    tag: "VERSIÓN PEQUEÑA DE TI",
    text: "¿Qué cosa te gustaba muchísimo de niña y todavía te sigue gustando?",
    hint: "Quiero conocer también esas cosas tuyas que vienen de hace años.",
  },
  {
    tag: "CONFIESA",
    text: "¿Hay algo que te dé un poquito de pena admitir que te gusta demasiado?",
    hint: "Prometo usar esta información de forma responsable. Bueno... probablemente.",
  },
  {
    tag: "PARA NO METER LA PATA",
    text: "¿Qué cosa pequeña puede ponerte de mal humor rapidísimo?",
    hint: "Información importante para mi supervivencia y para molestarte con un poquito más de criterio.",
  },
  {
    tag: "DE MÍ",
    text: "¿Qué cosa hago yo que te calma, te da paz o simplemente te hace sentir bien?",
    hint: "Aunque sea una bobada. Esas son justo las cosas que quiero saber.",
  },
  {
    tag: "TODAVÍA NO TE CONOZCO TODA",
    text: "¿Qué parte de ti sientes que todavía no conozco bien?",
    hint: "No tiene que ser profunda. Puede ser un gusto, una historia, una forma tuya de pensar o cualquier detalle.",
  },
  {
    tag: "ALGO QUE SÍ PODEMOS HACER",
    text: "¿Qué te gustaría que hiciéramos más seguido estando lejos, pero algo que sí podamos hacer de verdad?",
    hint: "Nada de planes imposibles. Algo de nosotras que podamos empezar cualquier día.",
  },
];

const choices = [
  {
    question: "Llegaste cansada del trabajo y estás en modo no quiero saber nada de la vida. ¿Qué hago?",
    a: "Me quedo contigo tranquila y te dejo ser bolita",
    b: "Empiezo a decir bobadas hasta sacarte por lo menos una risa",
    aResult: "Anotado. No tengo que arreglar nada. Me quedo contigo y ya.",
    bResult: "Perfecto. Entonces mi trabajo oficial es fastidiarte con cariño hasta que te rías aunque sea una vez.",
  },
  {
    question: "Tenemos media hora juntas y ninguna sabe qué hacer. ¿Qué te provoca más?",
    a: "Tetris, algún juego y ver quién acusa primero a la otra de hacer trampa",
    b: "Compartir pantalla, ver cualquier cosa y terminar hablando de otro tema",
    aResult: "Bien. Competencia innecesaria y acusaciones dudosas. Suena bastante a nosotras.",
    bResult: "También muy nosotras: empezamos viendo una cosa y veinte minutos después estamos hablando de cualquier otra.",
  },
  {
    question: "Me dan ganas de aparecerte con algo de la nada. ¿Qué te haría más ilusión?",
    a: "Otra página rara hecha por mí porque claramente no aprendo",
    b: "Un audio largo contándote alguna bobada o algo que pensé",
    aResult: "Grave error. Acabas de darme permiso para seguir inventando páginas innecesarias.",
    bResult: "Anotado. Menos producción, más yo hablando de cualquier cosa hasta que se me olvide cuál era el punto.",
  },
  {
    question: "El trabajo te absorbió y desapareciste unas horas. ¿Qué prefieres que haga?",
    a: "Te dejo un mensajito y respondes cuando puedas",
    b: "No te lleno de mensajes y hablamos después cuando ya estés más libre",
    aResult: "Perfecto. Te dejo algo para que sepas que estoy ahí y no te persigo por una respuesta.",
    bResult: "También sirve. Te dejo respirar y después me cuentas cuando tengas cabeza para eso.",
  },
  {
    question: "Estás de malas. Nivel: mejor no me mires feo por videollamada. ¿Qué te sirve más?",
    a: "Me cuentas qué pasó y yo solo te escucho",
    b: "Funamos el día entre las dos y te distraigo con cualquier estupidez",
    aResult: "Anotado. Cierro la boca, escucho y no intento arreglarte la vida.",
    bResult: "Perfecto. Si el día te trató mal, lo funamos entre las dos y seguimos con nuestra vida.",
  },
  {
    question: "Estamos en llamada y de repente ninguna está hablando. ¿Qué hacemos?",
    a: "Nada. Nos quedamos ahí igual, cada una en lo suyo",
    b: "Buscamos cualquier cosa para ver, jugar o comentar",
    aResult: "Me gusta. No todo silencio tiene que llenarse. Podemos estar juntas y ya.",
    bResult: "Sí, porque claramente dos minutos de silencio son suficientes para que yo empiece a inventar un plan.",
  },
  {
    question: "Si pudiera mejorar una sola cosa de cómo te acompaño desde lejos, ¿qué escogerías?",
    a: "Que te pregunte más por las cosas pequeñas de tu día",
    b: "Que inventemos más ratitos solo para nosotras",
    aResult: "Anotado. Quiero conocer también las cosas tontas del día, no solo cuando pasa algo grande.",
    bResult: "Anotado. No tienen que ser planes enormes. Solo ratitos que sean nuestros.",
  },
  {
    question: "Última y esta sí me importa: cuando estés cansada y no tengas energía para nada, ¿qué quieres que recuerde?",
    a: "Que no necesito ponerme bien para hablar contigo",
    b: "Que puedo decirte que necesito espacio y no pasa nada",
    aResult: "Eso sí quiero que lo tengas claro, bonita. No tienes que estar de buenas conmigo porque sí.",
    bResult: "Y esto también. Si quieres espacio, me lo dices y ya. No me voy a ofender, dramática.",
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
    openModal("CARPETA 03 · DECISIONES", "Cosas que quiero saber de nosotras", choiceMarkup());
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
