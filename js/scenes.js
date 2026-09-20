export const FINAL_MESSAGE = `Bueno bonita, sobrevivimos 😂
No sé cómo, pero recuperamos la banana y llegamos hasta el final.

Obviamente tenía que inventarme alguna bobada para hoy porque no iba a dejar pasar Amor y Amistad como si nada.

Solo quería hacer algo diferente contigo, hacerte reír un rato y recordarte que eres muy importante para mí.

Me gusta tenerte en mi vida, compartir contigo hasta las cosas más simples, molestarte, escucharte y pasar tiempo contigo aunque nos toque hacerlo detrás de una pantalla.

Y sé que últimamente has estado cansada y con muchas cosas encima, así que hoy no quería complicarte la vida con nada. Solo quería robarte un ratito para nosotras y verte sonreír.

Y sí… todo esto fue una excusa elaboradísima para decirte que te quiero.

MISIÓN FINAL: quedarte conmigo un rato más. 🍌`;

export const SCENES = {
  cover: {
    id: "cover",
    kicker: "SOFI & DAIANA",
    title: "OPERACIÓN BANANA",
    copy: "Una misión completamente innecesaria, pero demasiado importante como para ignorarla.",
    showCharacters: true,
    actions: [
      {
        label: "INICIAR MISIÓN",
        next: "theft",
      },
    ],
  },

  theft: {
    id: "theft",
    kicker: "MISIÓN 01",
    title: "Tenemos un problema.",
    copy: "El sospechoso acaba de escapar con la Banana Dorada.",
    showCharacters: true,
    actions: [
      {
        label: "CORRER DETRÁS DE ÉL",
        next: "chase",
        choice: "run",
      },
      {
        label: "SEGUIRLO DISIMULADAMENTE",
        next: "stealthFail",
        choice: "stealth",
      },
    ],
  },

  stealthFail: {
    id: "stealthFail",
    kicker: "SIETE SEGUNDOS DESPUÉS",
    title: "Nos descubrió.",
    copy: "El plan discreto duró menos de lo esperado. Toca correr.",
    showCharacters: true,
    actions: [
      {
        label: "EMPEZAR PERSECUCIÓN",
        next: "chase",
      },
    ],
  },

  chase: {
    id: "chase",
    kicker: "MISIÓN 02",
    title: "Persecución",
    copy: "Esta escena será el nivel jugable con Sofi y Daiana corriendo juntas. La lógica de movimiento está separada en player.js para que Codex pueda desarrollar el escenario sin romper la historia.",
    mode: "chase",
    actions: [
      {
        label: "CONTINUAR PROTOTIPO",
        next: "guard",
      },
    ],
  },

  guard: {
    id: "guard",
    kicker: "MISIÓN 03",
    title: "Hay un guardia.",
    copy: "La Banana Dorada está al otro lado. Daiana decide qué hacer.",
    showCharacters: true,
    actions: [
      {
        label: "DISTRAERLO BAILANDO",
        next: "recovery",
        choice: "dance",
      },
      {
        label: "OFRECERLE OTRA BANANA",
        next: "recovery",
        choice: "banana",
      },
    ],
  },

  recovery: {
    id: "recovery",
    kicker: "OBJETIVO CONSEGUIDO",
    title: "Banana recuperada.",
    copy: "Contra todo pronóstico, funcionó.",
    showCharacters: true,
    actions: [
      {
        label: "CONTINUAR",
        next: "final",
      },
    ],
  },

  final: {
    id: "final",
    mode: "final",
  },
};
