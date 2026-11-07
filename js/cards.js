// js/cards.js — Catálogo y selector de tarjetas de ética en herramientas de IA
// 137 tarjetas validadas psicométricamente y verificadas contra el corpus.
// Auto-generado a partir de data/cards_catalog.json

export const JUMP_THEMES = Object.freeze({
  'ladder-4':  'data_quality',
  'ladder-13': 'data_quality',
  'ladder-33': 'bias_fairness',
  'ladder-42': 'transparency_explainability',
  'ladder-50': 'accountability_governance',
  'ladder-62': 'bias_fairness',
  'ladder-74': 'bias_fairness',
  'snake-27':  'privacy_consent',
  'snake-40':  'data_quality',
  'snake-43':  'bias_fairness',
  'snake-54':  'scientific_integrity',
  'snake-66':  'human_agency',
  'snake-76':  'bias_fairness',
  'snake-89':  'accountability_governance',
  'snake-99':  'privacy_consent',
});

export const CARDS = Object.freeze([
  {
    "id": "libroA-01",
    "kind": "checkpoint",
    "theme": "bias_fairness",
    "difficulty": 2,
    "title": "El pasado como criterio",
    "prompt": "Tu equipo usa una herramienta de IA entrenada con contrataciones anteriores para preseleccionar candidatos. El ranking parece coherente y ahorra horas. ¿Qué haces?",
    "options": [
      "Usarlo tal cual: si el ranking es consistente entre candidatos, es señal de que es objetivo",
      "Revisar qué patrones del pasado reproduce y dejar la decisión final a personas",
      "Quitar los nombres de los CV y asumir que con eso se elimina cualquier sesgo del modelo",
      "Emplearlo para descartar candidatos, no para priorizarlos, sin más revisión del sistema"
    ],
    "correct": 1,
    "explanation": "Un modelo entrenado con el pasado puede perpetuar los sesgos que contiene. Auditar los patrones y reservar el juicio humano evita convertir una desigualdad histórica en un criterio automático.",
    "tip": "Antes de adoptar un ranking, pregunta con qué datos del pasado fue entrenado.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "p.17 (Introducción)",
      "quote": "los algoritmos codifican el pasado"
    },
    "notes": "La frase se atribuye en el libro a Cathy O'Neil. El escenario de contratación es una aplicación, no un ejemplo del libro."
  },
  {
    "id": "libroA-02",
    "kind": "checkpoint",
    "theme": "transparency_explainability",
    "difficulty": 2,
    "title": "Caja negra en tu informe",
    "prompt": "Un modelo te da una recomendación para tu informe, pero nadie puede explicarte cómo llegó a ella. Debes entregar mañana. ¿Cuál es la acción responsable?",
    "options": [
      "Citarla como hallazgo del modelo: si viene de una herramienta avanzada, es fiable para el informe",
      "Verificarla con fuentes independientes y declarar en el informe que el modelo no explica su razonamiento",
      "Reformularla con tus palabras y presentarla en el informe como si fuera un análisis propio",
      "Descartar toda recomendación que no puedas explicar, aunque resulte útil para el informe"
    ],
    "correct": 1,
    "explanation": "Ni los diseñadores comprenden del todo qué ocurre dentro de una red neuronal. Si el sistema no explica, la responsabilidad de verificar y de declarar sus límites recae en quien lo usa.",
    "tip": "Sin explicación del modelo, exige una verificación externa y di cuál usaste.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "p.22 (Introducción)",
      "quote": "ni siquiera los diseñadores de los sistemas comprenden completamente qué sucede durante el procesamiento de la información"
    },
    "notes": "Afirmación del autor sobre redes neuronales; no es una cifra verificable."
  },
  {
    "id": "libroA-03",
    "kind": "checkpoint",
    "theme": "privacy_consent",
    "difficulty": 1,
    "title": "Gratis: el producto eres tú",
    "prompt": "Vas a pegar en un chatbot gratuito las notas confidenciales de una entrevista con participantes de tu estudio para que las resuma. ¿Qué es lo más responsable?",
    "options": [
      "Pegarlas completas: el resumen que obtendrás vale más que el pequeño riesgo de filtración",
      "Pegarlas tal cual y borrar el chat después para que no queden rastros en el servicio",
      "Anonimizar o resumir a mano, o usar una herramienta institucional con garantías",
      "Pegarlas por partes para que ninguna parte sea identificable por sí sola en el servicio"
    ],
    "correct": 2,
    "explanation": "El libro advierte que cuando el servicio es gratuito el producto eres tú. Los datos de otros que no consintieron ese uso no deberían alimentar un servicio cuyo modelo de negocio son los datos.",
    "tip": "Antes de pegar datos de terceros, anonimiza o usa una herramienta aprobada por tu institución.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "p.29 (Introducción)",
      "quote": "cuando el producto es gratuito, el verdadero producto eres tú"
    },
    "notes": "La frase se atribuye a Jaron Lanier. Si pegas por partes sigue habiendo riesgo de reidentificación."
  },
  {
    "id": "libroA-04",
    "kind": "checkpoint",
    "theme": "human_agency",
    "difficulty": 2,
    "title": "La cifra no es persona",
    "prompt": "Tu unidad usa un puntaje de riesgo generado por IA para decidir becas. Una solicitante con puntaje bajo presenta documentos que explican su caso. ¿Qué haces?",
    "options": [
      "Mantener el puntaje: contradecirlo sería arbitrario y trataría distinto a otros solicitantes",
      "Pedir a la solicitante que no insista, pues el sistema ya evaluó su caso con criterios uniformes",
      "Aplicar el puntaje a todos por igual y revisar el caso cuando alguien apele formalmente",
      "Tratar el puntaje como un insumo, evaluar el caso individual y documentar la decisión"
    ],
    "correct": 3,
    "explanation": "El libro advierte contra instituciones que asumen que el individuo se comporta como el algoritmo lo describe. El puntaje describe un patrón de población; no sustituye la valoración de la persona.",
    "tip": "Define de antemano quién puede corregir una decisión asistida por IA.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "p.31 (Introducción)",
      "quote": "las instituciones terminan por asimilar que las decisiones de los individuos se comportan de la manera como el algoritmo las describe"
    },
    "notes": "Caso hipotético construido sobre la tesis del autor."
  },
  {
    "id": "libroA-05",
    "kind": "checkpoint",
    "theme": "data_quality",
    "difficulty": 3,
    "title": "Más datos, más certeza",
    "prompt": "Pides a un asistente de IA que busque correlaciones en una base enorme y te presenta 12 relaciones 'significativas'. Planeas tomarlas como hallazgos. ¿Qué es lo más responsable?",
    "options": [
      "Reportarlas todas como hallazgos: con una base tan enorme el riesgo de error es mínimo",
      "Formular antes una hipótesis, validar en datos nuevos y reportar cuántas pruebas se hicieron",
      "Reportar las dos más fuertes como hallazgos principales y omitir el resto de relaciones",
      "Pedir al asistente que confirme que no son espurias y fiarte de su respuesta para reportar"
    ],
    "correct": 1,
    "explanation": "El libro cita que más datos pueden oscurecer lo fundamental bajo un alud de correlaciones espurias. Sin hipótesis ni validación, la cantidad de datos no equivale a conocimiento.",
    "tip": "Valida toda correlación hallada por IA en datos que el modelo no haya visto.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "p.21 (Introducción)",
      "quote": "más datos no solo no contribuyen a un mejor entendimiento"
    },
    "notes": "Idea atribuida en el libro a Luciano Floridi; la cita textual concreta de Floridi no se pudo verificar fuera del libro."
  },
  {
    "id": "libroA-06",
    "kind": "checkpoint",
    "theme": "data_quality",
    "difficulty": 2,
    "title": "Objetividad prestada",
    "prompt": "Un compañero defiende que el análisis de un modelo es más objetivo porque 'no tiene sesgos culturales'. Vas a basar una decisión en él. ¿Qué respondes?",
    "options": [
      "Que tiene razón: al no tener cultura propia, el modelo es neutral y sus resultados son objetivos",
      "Que importa la calidad de la información con que se alimenta, y hay que revisar sus fuentes",
      "Que es objetivo siempre que el modelo sea de código abierto, porque así se puede auditar",
      "Que da igual, porque todas las fuentes humanas también tienen sesgos y no se pueden evitar"
    ],
    "correct": 1,
    "explanation": "El libro admite que el aprendizaje automático podría evitar sesgos de la mente humana, pero recuerda que depende de la calidad de la información recibida. Un modelo no es neutral por no ser humano.",
    "tip": "Pregunta de dónde vienen los datos antes de aceptar que un resultado es objetivo.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "p.92 (cap. III)",
      "quote": "va también con la calidad de información que vayamos recibiendo"
    },
    "notes": "El pasaje es matizado: el autor reconoce la ventaja potencial y la limita."
  },
  {
    "id": "libroA-07",
    "kind": "checkpoint",
    "theme": "scientific_integrity",
    "difficulty": 2,
    "title": "¿Idea nueva o recombinada?",
    "prompt": "Un chatbot te propone una 'idea original' para tu tesis. Quieres presentarla como hallazgo tuyo sin más. ¿Qué es lo responsable?",
    "options": [
      "Presentarla como tuya sin más: tú decidiste usarla y revisarla, así que la autoría es tuya",
      "Atribuírsela al chatbot y listo, sin comprobar si la idea ya existe en la literatura",
      "Reescribirla quitando los detalles más genéricos para que no se note su origen",
      "Contrastarla con la literatura para ver si ya existe y declarar qué aportó la herramienta"
    ],
    "correct": 3,
    "explanation": "Según Lovelace, la máquina no pretende crear nada: ayuda a disponer de lo que ya conocemos. Una 'novedad' generada puede ser conocimiento existente, así que hay que comprobar su origen y declarar el uso.",
    "tip": "Busca en la literatura cualquier idea sugerida por IA antes de llamarla novedad.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "p.45 (cap. I)",
      "quote": "no tiene pretensiones de dar origen a nada y hace todo lo que se le ordene realizar"
    },
    "notes": "Lovelace hablaba de la Máquina Analítica; aplicarlo a los modelos actuales es una extrapolación debatible, útil como punto de partida."
  },
  {
    "id": "libroA-08",
    "kind": "checkpoint",
    "theme": "human_agency",
    "difficulty": 2,
    "title": "Delegar el vínculo",
    "prompt": "Tras semanas hablando solo con un chatbot que siempre te da la razón, notas que evitas conversaciones con compañeros que te llevan la contraria. ¿Qué es lo más sensato?",
    "options": [
      "Seguir igual: te sientes mejor con él y eso es lo que importa para tu bienestar",
      "Cambiar a otro chatbot más honesto y mantener el mismo hábito de conversación diaria",
      "Usarlo como apoyo puntual y retomar conversaciones presenciales con contraste real",
      "Borrar la aplicación y dejar de usar IA conversacional en cualquier ámbito de tu vida"
    ],
    "correct": 2,
    "explanation": "El libro sostiene que la amistad valiosa se construye en la palabra y la confrontación, y critica delegar su construcción a un algoritmo. Un interlocutor complaciente no sustituye ese vínculo.",
    "tip": "Si una herramienta solo te da la razón, contrasta con una persona real.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "p.68 (cap. II)",
      "quote": "estamos delegando toda construcción posible de amistad a un algoritmo"
    },
    "notes": "El libro habla de redes sociales, no de chatbots; el escenario es una extrapolación de la tesis."
  },
  {
    "id": "libroA-09",
    "kind": "dilemma",
    "theme": "human_agency",
    "difficulty": 2,
    "title": "Usar sin entender",
    "prompt": "El libro celebra que un algoritmo permite resolver problemas complejos a quien no entiende sus principios. Hoy lo hacemos con la IA: ¿es democratización o pérdida de criterio?",
    "stances": [
      {
        "label": "Es democratización: lo importante es resolver",
        "cost": "Se pierde la capacidad de detectar cuándo la herramienta falla y quién responde de sus errores."
      },
      {
        "label": "Solo usar lo que se comprende",
        "cost": "Se excluye a quien no tiene formación técnica y se renuncia a beneficios reales."
      },
      {
        "label": "Usar con verificación proporcional al riesgo",
        "cost": "Exige tiempo y criterio constantes, y puede volverse una formalidad si no hay incentivos."
      }
    ],
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "p.40-41 (cap. I)",
      "quote": "que problemas complejos puedan ser resueltos incluso por quienes no comprenden plenamente los principios subyacentes"
    },
    "notes": "El autor presenta esto como virtud histórica del algoritmo; la lectura crítica es nuestra."
  },
  {
    "id": "libroA-10",
    "kind": "dilemma",
    "theme": "health",
    "difficulty": 2,
    "title": "Compañía de pantalla",
    "prompt": "Una persona mayor, sola, conversa a diario con un asistente de IA y dice sentirse acompañada. Su familia duda si fomentarlo o limitarlo.",
    "stances": [
      {
        "label": "Fomentarlo: alivia la soledad real",
        "cost": "Puede sustituir vínculos humanos y crear dependencia de un sistema que optimiza el uso, no su bienestar."
      },
      {
        "label": "Limitarlo y reforzar el contacto humano",
        "cost": "Se le priva de un apoyo disponible hoy y puede sentirse juzgada o más sola."
      },
      {
        "label": "Permitirlo con condiciones: transparencia y visitas",
        "cost": "Requiere supervisión de la familia, que puede percibirse como invasiva."
      }
    ],
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "p.74 (cap. II)",
      "quote": "cada vez estamos más solos a pesar de estar tan hiperconectados"
    },
    "notes": "El libro trata redes sociales, no asistentes conversacionales; la analogía es una extrapolación. Dilema de alta sensibilidad: moderar sin moralizar."
  },
  {
    "id": "libroA-11",
    "kind": "dilemma",
    "theme": "human_agency",
    "difficulty": 3,
    "title": "Personalizar o uniformar",
    "prompt": "Tu empresa quiere un asistente que se adapte a cada usuario a partir de su historial. Mejora la satisfacción, pero tiende a ofrecer siempre lo que la persona ya prefirió.",
    "stances": [
      {
        "label": "Personalizar al máximo",
        "cost": "Refuerza patrones pasados y reduce la exposición a lo nuevo y a lo que contradice al usuario."
      },
      {
        "label": "Personalizar poco e introducir opciones fuera del perfil",
        "cost": "Menor satisfacción inmediata y posible rechazo del usuario."
      },
      {
        "label": "Dar al usuario el control de la personalización",
        "cost": "Traslada la carga al usuario, que a menudo no entiende qué se personaliza ni por qué."
      }
    ],
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "p.17 (Introducción)",
      "quote": "las promesas de personalización algorítmica están produciendo una homogeneización de la experiencia humana"
    },
    "notes": "Tesis del autor, sin evidencia empírica en el texto."
  },
  {
    "id": "libroA-12",
    "kind": "dilemma",
    "theme": "public_policy_co",
    "difficulty": 3,
    "title": "Algoritmo con secreto comercial",
    "prompt": "Una alcaldía quiere contratar un modelo propietario para priorizar ayudas. El proveedor invoca secreto empresarial y no revelará cómo decide. ¿Se contrata?",
    "stances": [
      {
        "label": "Contratarlo: funciona y el secreto es legítimo",
        "cost": "Los ciudadanos no pueden impugnar decisiones que nadie puede explicar."
      },
      {
        "label": "Rechazarlo mientras no sea auditable",
        "cost": "Se retrasan ayudas y puede quedar un proceso manual más lento y también sesgado."
      },
      {
        "label": "Contratarlo con auditoría independiente y apelación humana",
        "cost": "Encarece el proyecto y la auditoría puede ser insuficiente si el proveedor limita el acceso."
      }
    ],
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "p.22-23 (Introducción)",
      "quote": "que protegen celosamente sus algoritmos bajo el manto del secreto empresarial"
    },
    "notes": "Cita en p.23 del PDF (22-23). Caso hipotético."
  },
  {
    "id": "libroA-13",
    "kind": "quiz",
    "theme": "human_agency",
    "difficulty": 2,
    "title": "Amistades que optimiza el feed",
    "prompt": "Siguiendo la clasificación aristotélica del libro, ¿qué tipos de amistad tienden a priorizar los algoritmos de las redes sociales?",
    "options": [
      "Las del bien o virtud, porque fomentan el diálogo profundo y el trato prolongado",
      "Las de utilidad y placer, porque maximizan la interacción superficial y rápida",
      "Las del bien o virtud y las de utilidad, porque combinan beneficio y diálogo profundo",
      "Ninguna en particular: los algoritmos son neutrales ante el tipo de amistad"
    ],
    "correct": 1,
    "explanation": "El libro afirma que los algoritmos priorizan la utilidad y el placer al maximizar la interacción superficial, lo que debilita las amistades del bien, que requieren tiempo y trato significativo.",
    "tip": "Pregúntate qué métrica optimiza la herramienta que usas: ¿tu bienestar o tu uso?",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "p.85 (cap. II, 'Conclusiones no solicitadas')",
      "quote": "no aman al amigo por él mismo sino por alguna utilidad que de él reciben"
    },
    "notes": "La cita es de Aristóteles (Ética a Nicómaco VIII, 3) tal como la reproduce el libro."
  },
  {
    "id": "libroA-14",
    "kind": "quiz",
    "theme": "attention_manipulation",
    "difficulty": 2,
    "title": "Vigilar o influir",
    "prompt": "Según Sadin, citado en la Introducción, ¿cuál es el objetivo principal de la conformación algorítmica actual?",
    "options": [
      "Recolectar datos personales de forma abusiva y masiva",
      "Vigilar a los ciudadanos para castigar sus desviaciones",
      "Influir sobre los comportamientos más que controlarlos",
      "Sustituir a las instituciones públicas por empresas"
    ],
    "correct": 2,
    "explanation": "Sadin plantea que el problema no es solo el control y la recolección de datos, sino una influencia sutil sobre el comportamiento. Por eso la privacidad por sí sola no basta como defensa.",
    "tip": "Piensa en cómo una herramienta te influye, no solo en qué datos guarda.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "p.15 (Introducción)",
      "quote": "no es vigilar sino influir sobre los comportamientos"
    },
    "notes": "Cita de Éric Sadin recogida por el autor."
  },
  {
    "id": "libroA-15",
    "kind": "quiz",
    "theme": "scientific_integrity",
    "difficulty": 2,
    "title": "Herramientas, no verdades",
    "prompt": "Con Popper, el libro propone mantener los algoritmos y modelos matemáticos en su justo lugar. ¿Cuál es ese lugar?",
    "options": [
      "Verdades absolutas sobre la naturaleza, mientras sean precisos",
      "Herramientas valiosas pero provisionales, no verdades absolutas",
      "Instrumentos descartables, pues todo conocimiento es conjetural",
      "Sustitutos de la experiencia humana, por su mayor capacidad"
    ],
    "correct": 1,
    "explanation": "El autor sostiene que la humildad epistemológica no es renunciar a la verdad ni a los modelos, sino tratarlos como valiosos y provisionales. Un resultado de IA debe poder revisarse.",
    "tip": "Trata cada salida de un modelo como hipótesis revisable, no como dato firme.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "p.103 (cap. III)",
      "quote": "herramientas valiosas pero provisionales, no como verdades absolutas"
    },
    "notes": "Distractor 3 parece plausible por 'conjetural'; el texto lo descarta explícitamente."
  },
  {
    "id": "libroA-16",
    "kind": "quiz",
    "theme": "data_quality",
    "difficulty": 1,
    "title": "Mapa y territorio",
    "prompt": "Con el cuento de Borges 'Del rigor en la ciencia', ¿qué advertencia hace el libro sobre el big data?",
    "options": [
      "Que tiene límites de procesamiento que desaparecerán pronto con más capacidad",
      "Que un mapa más grande describe mejor la realidad, por lo que conviene ampliarlo",
      "Que no parece reconocer los límites de la representación de la realidad",
      "Que debe sustituir a los mapas tradicionales en la planificación pública"
    ],
    "correct": 2,
    "explanation": "En el relato el mapa a escala 1:1 resulta inútil. El autor señala que las tecnologías de big data no parecen asumir que un modelo nunca coincide con la realidad que representa.",
    "tip": "Recuerda que el modelo es una representación: pregunta qué deja fuera.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "p.19 (Introducción)",
      "quote": "nuestras tecnologías de big data no parecen reconocer los límites de la representación"
    },
    "notes": ""
  },
  {
    "id": "libroA-17",
    "kind": "quiz",
    "theme": "transparency_explainability",
    "difficulty": 2,
    "title": "Opacidad como característica",
    "prompt": "El libro recoge la tesis de Crawford sobre la opacidad de los sistemas de IA. ¿Qué afirma?",
    "options": [
      "Que es un error técnico que se corregirá con modelos mejores y más datos",
      "Que se ha normalizado como una característica y no como un error",
      "Que afecta a los sistemas públicos, pero no a los comerciales",
      "Que desaparece cuando el código de los sistemas se publica"
    ],
    "correct": 1,
    "explanation": "La opacidad no es solo técnica: está alimentada por intereses comerciales y se acepta como algo normal. Reconocerla como decisión de diseño permite exigir explicaciones.",
    "tip": "Trata la falta de explicación de una herramienta como un riesgo a gestionar.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "p.22 (Introducción)",
      "quote": "Hay una opacidad fundamental en el núcleo de estos sistemas que se ha normalizado como una característica, no como un error"
    },
    "notes": "Tesis atribuida a Kate Crawford (Atlas of AI) tal como la cita el libro."
  },
  {
    "id": "libroA-18",
    "kind": "fact",
    "theme": "attention_manipulation",
    "difficulty": 2,
    "title": "Del estrés al remedio digital",
    "prompt": "El libro describe un bucle: la ansiedad que produce la aceleración digital se trata con apps de relajación o meditación. Así el usuario sigue dentro del ecosistema que genera datos.",
    "tip": "Si una app 'te ayuda a desconectar', revisa quién gana con que sigas conectado.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "p.26 (Introducción)",
      "quote": "la ansiedad producida por la aceleración digital se trata mediante técnicas digitales de relajación"
    },
    "notes": "Cita de Berardi recogida por el autor; interpretación del autor, sin datos empíricos."
  },
  {
    "id": "libroA-19",
    "kind": "fact",
    "theme": "human_agency",
    "difficulty": 1,
    "title": "Sensibilidad algorítmica",
    "prompt": "El libro propone cultivar una 'sensibilidad algorítmica': una capacidad reflexiva para cuestionar cómo los algoritmos configuran nuestras posibilidades de acción y pensamiento, sin rechazarlos.",
    "tip": "Antes de seguir una sugerencia de IA, pregunta qué opciones dejó fuera.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "p.30 (Introducción)",
      "quote": "una capacidad reflexiva para reconocer y cuestionar cómo los algoritmos están configurando nuestras posibilidades de acción y pensamiento"
    },
    "notes": "Atribuido en el libro a Benedetta Giovanola."
  },
  {
    "id": "libroA-20",
    "kind": "fact",
    "theme": "public_policy_co",
    "difficulty": 1,
    "title": "Ni tecnofobia ni tecnofilia",
    "prompt": "La Introducción propone una 'tercera vía': usar algoritmos y big data, que están aquí para quedarse, sin caer ni en el rechazo ni en la adopción acrítica. La pregunta es cómo humanizarlos.",
    "tip": "Ni prohibir ni confiar a ciegas: define para qué sirve la herramienta y sus límites.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "p.34 (Introducción)",
      "quote": "tercera vía” entre la tecnofobia y la tecnofilia acrítica"
    },
    "notes": "Cita atribuida a Roberto Esposito en el libro."
  },
  {
    "id": "libroA-21",
    "kind": "fact",
    "theme": "human_agency",
    "difficulty": 2,
    "title": "Autopredecibles",
    "prompt": "El libro advierte que, si las decisiones se basan en el comportamiento pasado, nos volvemos predecibles: el algoritmo reduce la capacidad humana de actuar de forma imprevista y de contradecir lo que hicimos antes.",
    "tip": "No dejes que un perfil de tu historial decida lo que puedes querer a futuro.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "p.31 (Introducción)",
      "quote": "terminamos siendo autopredecibles por culpa de un algoritmo"
    },
    "notes": "Tesis filosófica del autor; no se presenta evidencia empírica."
  },
  {
    "id": "libroA-22",
    "kind": "fact",
    "theme": "human_agency",
    "difficulty": 1,
    "title": "Los algoritmos no son neutrales",
    "prompt": "El libro recuerda que los algoritmos que moldean nuestras relaciones no son inevitables ni neutrales: son resultado de decisiones humanas guiadas por valores específicos, y por eso pueden transformarse.",
    "tip": "Pregunta qué valores y qué métrica de éxito incorpora la herramienta.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "p.82 (cap. II)",
      "quote": "no son inevitables ni neutrales, sino resultado de decisiones humanas guiadas por valores específicos"
    },
    "notes": "Idea atribuida a Charles Taylor en el libro."
  },
  {
    "id": "libroB-01",
    "kind": "fact",
    "theme": "education",
    "difficulty": 1,
    "title": "Detectores no son prueba",
    "prompt": "El autor admite que no hay herramientas técnicas definitivas para identificar la intervención de GPT en un ensayo; a lo sumo se reconocen patrones, y algunos docentes hasta usan ChatGPT para detectarlo.",
    "tip": "Un detector o una corazonada no bastan para acusar: pide evidencia del proceso.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "cap. IV, PDF p.108",
      "quote": "la falta de herramientas técnicas definitivas para identificar la intervención de GPT en un ensayo"
    }
  },
  {
    "id": "libroB-02",
    "kind": "checkpoint",
    "theme": "education",
    "difficulty": 2,
    "title": "Sospecha de ensayo con IA",
    "prompt": "Eres docente y un ensayo te suena a texto generado. Pegas el párrafo en ChatGPT para que te diga si lo escribió una IA, y te responde que sí. ¿Qué haces?",
    "options": [
      "Aplico la sanción: el modelo lo confirmó y eso basta como prueba",
      "Descarto el caso: sin un detector fiable no hay nada que se pueda hacer",
      "Dialogo con el estudiante sobre su proceso y fuentes antes de decidir",
      "Pido a otro modelo que lo confirme y sanciono si ambos coinciden"
    ],
    "correct": 2,
    "explanation": "El autor señala que no existen herramientas definitivas de detección; un veredicto de IA es opinión probabilística. El juicio debe apoyarse en evidencia y diálogo, no en otra IA.",
    "tip": "Abre una conversación sobre el proceso de escritura antes de sancionar.",
    "board": "snake",
    "grounded": false,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "cap. IV, PDF p.108",
      "quote": "algunos incluso recurren a ChatGPT para poder detectarlo"
    },
    "notes": "La acción recomendada (diálogo sobre el proceso) se extrapola de la crítica del libro a la detección y de la propuesta dialógica de p.125."
  },
  {
    "id": "libroB-03",
    "kind": "quiz",
    "theme": "education",
    "difficulty": 2,
    "title": "Sucesión 2, 4, 6",
    "prompt": "Para la sucesión 2, 4, 6, ¿qué muestra el autor con la interpolación de Lagrange?",
    "options": [
      "Que reglas distintas ajustan los mismos datos y dan sucesores distintos",
      "Que 8 es el único sucesor válido, porque la regla de sumar 2 es la más simple",
      "Que ChatGPT calcula bien polinomios de grado alto cuando se le dan pocos datos",
      "Que las sucesiones numéricas no admiten reglas que expliquen sus primeros términos"
    ],
    "correct": 0,
    "explanation": "Dos polinomios distintos pasan por 2, 4, 6 y dan 10 o 13 en el cuarto término. Un patrón ajustado a datos no es la única explicación posible; vale también para lo que infiere un modelo.",
    "tip": "Pregúntate qué otras reglas explican los mismos datos que el modelo ajustó.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "cap. IV, PDF p.110",
      "quote": "Existen casi infinitas soluciones que se pueden construir desde diferentes reglas que siguen el mismo orden lógico."
    },
    "notes": "Ejemplo matemático del libro: valores 10 y 13 con polinomios de Lagrange."
  },
  {
    "id": "libroB-04",
    "kind": "quiz",
    "theme": "transparency_explainability",
    "difficulty": 1,
    "title": "Qué hace un LLM",
    "prompt": "Según el autor, ¿en qué son extraordinariamente buenos los modelos de lenguaje como ChatGPT?",
    "options": [
      "En comprender los hechos que describen y razonar sobre ellos",
      "En detectar anomalías que rompen sus marcos teóricos previos",
      "En verificar la verdad de sus propias respuestas con evidencia",
      "En predecir la siguiente palabra según patrones estadísticos"
    ],
    "correct": 3,
    "explanation": "El libro contrasta esa capacidad predictiva con el pensar de Feynman: un texto fluido no implica comprensión ni verificación. Por eso hay que contrastar sus afirmaciones.",
    "tip": "Trata la fluidez como señal de probabilidad, no de comprensión ni de verdad.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "cap. IV, PDF p.119",
      "quote": "extraordinariamente buenos en predecir qué palabras deben seguir a otras, basándose en patrones estadísticos"
    }
  },
  {
    "id": "libroB-05",
    "kind": "checkpoint",
    "theme": "education",
    "difficulty": 1,
    "title": "Lluvia de ideas con IA",
    "prompt": "Usas ChatGPT para generar ideas para tu ensayo de maestría. Te entrega un esquema muy ordenado y familiar. ¿Cuál es el uso más responsable?",
    "options": [
      "Entregar el esquema tal cual: es lo más probable y por tanto lo más correcto",
      "Tomarlo como punto de partida, cuestionarlo y desarrollar mi propio argumento",
      "Pedirle además el ensayo completo y cambiarle algunas palabras antes de entregarlo",
      "Descartar la IA para estas tareas porque sus ideas suelen ser repetitivas"
    ],
    "correct": 1,
    "explanation": "El autor ve valor en la IA para ideas rápidas, pero advierte que da ilusión de sabiduría y repite patrones. El pensamiento crítico exige esfuerzo humano consciente de romper moldes.",
    "tip": "Usa la IA para abrir opciones; la tesis y el argumento deben ser tuyos.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "cap. IV, PDF p.113",
      "quote": "puede dar la ilusión de sabiduría sin la verdadera comprensión"
    },
    "notes": "La conducta es una aplicación de la tesis del autor, no una norma literal."
  },
  {
    "id": "libroB-06",
    "kind": "checkpoint",
    "theme": "education",
    "difficulty": 2,
    "title": "Examen replicable por IA",
    "prompt": "Eres docente y todos los estudiantes entregan buenas respuestas al examen, pero la IA lo resuelve en segundos. ¿Qué haces primero?",
    "options": [
      "Prohibir toda herramienta digital y vigilar los exámenes con detectores",
      "Subir la dificultad de las preguntas de memoria para que la IA falle",
      "Aceptar las respuestas sin cambios, ya que los estudiantes demuestran buen nivel",
      "Rediseñar la evaluación para valorar preguntas y conexiones originales"
    ],
    "correct": 3,
    "explanation": "Si una IA replica fácilmente el método evaluativo, el libro sugiere revisar el método. Propone evaluar calidad de preguntas, profundidad de indagación, originalidad de conexiones y expresión personal.",
    "tip": "Evalúa preguntas, procesos y conexiones propias, no solo respuestas reproducibles.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "cap. IV, PDF p.124",
      "quote": "quizás el problema no sea la IA, sino nuestros métodos"
    }
  },
  {
    "id": "libroB-07",
    "kind": "dilemma",
    "theme": "education",
    "difficulty": 2,
    "title": "Prohibir, permitir o rediseñar",
    "prompt": "Un curso de posgrado debe fijar su política sobre IA generativa en los trabajos. ¿Qué postura defiendes?",
    "stances": [
      {
        "label": "Prohibirla y detectar",
        "cost": "Premia la vigilancia, genera falsos positivos y no enseña a usarla críticamente."
      },
      {
        "label": "Permitirla declarando el uso",
        "cost": "Exige confianza y puede dejar sin evaluar la capacidad propia."
      },
      {
        "label": "Rediseñar la evaluación",
        "cost": "Requiere más tiempo docente y métodos menos estandarizados."
      }
    ],
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "cap. IV, PDF p.118",
      "quote": "al prohibir las herramientas de IA por temor al plagio, podríamos estar obstaculizando el desarrollo de una relación crítica"
    }
  },
  {
    "id": "libroB-08",
    "kind": "dilemma",
    "theme": "education",
    "difficulty": 3,
    "title": "Delegar lo repetitivo",
    "prompt": "El libro celebra que la IA nos libere de tareas repetitivas e incómodas. Un estudiante delega en la IA resúmenes y borradores. ¿Dónde está el límite?",
    "stances": [
      {
        "label": "Delegar todo lo repetitivo",
        "cost": "Se pierde práctica básica que quizá sustentaba el criterio posterior."
      },
      {
        "label": "Delegar solo tras dominarlo",
        "cost": "Más lento y menos equitativo para quien carece de tiempo."
      },
      {
        "label": "Delegar y declarar siempre",
        "cost": "Transparente, pero no garantiza que el estudiante aprenda."
      }
    ],
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "cap. IV, PDF p.114",
      "quote": "la liberación humana de actividades repetitivas, incómodas o degradantes"
    },
    "notes": "La tensión liberación versus pérdida de práctica es del lector; el libro solo afirma la primera y la dependencia como riesgo (p.118)."
  },
  {
    "id": "libroB-09",
    "kind": "fact",
    "theme": "education",
    "difficulty": 1,
    "title": "IA como andamiaje",
    "prompt": "Siguiendo a Vygotsky, el autor propone ver la IA como andamiaje: apoyo temporal que permite al estudiante llegar donde no lograría solo, no como sustituto de su desempeño.",
    "tip": "Pregúntate si la ayuda de la IA es temporal y deja capacidad en ti.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "cap. IV, PDF p.126",
      "quote": "Quizás podamos ver a la IA no como una amenaza, sino como un nuevo tipo de andamiaje"
    }
  },
  {
    "id": "libroB-10",
    "kind": "quiz",
    "theme": "data_quality",
    "difficulty": 1,
    "title": "Datos sintéticos: definición",
    "prompt": "¿Qué son, en esencia, los datos sintéticos según el libro?",
    "options": [
      "Información generada artificialmente que imita patrones de datos reales",
      "Datos reales anonimizados mediante cifrado antes de ser compartidos",
      "Datos reales recogidos de forma voluntaria y luego etiquetados por personas",
      "Resultados de una encuesta ponderada por expertos para corregir la muestra"
    ],
    "correct": 0,
    "explanation": "Imitan propiedades de datos reales sin contener información identificable. Responden a escasez, privacidad y desequilibrios, pero heredan los supuestos del modelo que los genera.",
    "tip": "Pregunta siempre qué modelo generó los datos y con qué supuestos.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "cap. V, PDF p.132",
      "quote": "información generada artificialmente que imita las propiedades estadísticas y patrones de datos reales"
    }
  },
  {
    "id": "libroB-11",
    "kind": "quiz",
    "theme": "bias_fairness",
    "difficulty": 2,
    "title": "Modelos y opiniones",
    "prompt": "Cathy O'Neil afirma que los modelos son opiniones incrustadas en matemáticas. Aplicado a datos sintéticos, ¿qué implica?",
    "options": [
      "Que son reproducciones neutras de la realidad que representan",
      "Que sirven si son totalmente aleatorios y no dependen de ningún modelo",
      "Que incorporan los sesgos y supuestos del modelo generador",
      "Que eliminan los sesgos al no provenir directamente de personas"
    ],
    "correct": 2,
    "explanation": "Los datos sintéticos son construcciones que incorporan sesgos, suposiciones y limitaciones del modelo generador; no corrigen por sí solos el sesgo de los datos originales.",
    "tip": "Revisa qué supuestos y sesgos del generador pasan a tus datos.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "cap. V, PDF p.133",
      "quote": "los modelos son opiniones incrustadas en matemáticas"
    }
  },
  {
    "id": "libroB-12",
    "kind": "checkpoint",
    "theme": "data_quality",
    "difficulty": 3,
    "title": "Sintéticos para grupo escaso",
    "prompt": "Tu equipo tiene pocas muestras de un grupo minoritario y genera datos sintéticos para equilibrar el conjunto. El modelo mejora en validación sintética. ¿Qué haces?",
    "options": [
      "Reportar la mejora como evidencia de buen desempeño en ese grupo minoritario",
      "Validar con datos reales del grupo y documentar el origen sintético",
      "Generar más sintéticos hasta que el desempeño en validación sea perfecto",
      "Eliminar al grupo del conjunto porque sus datos son insuficientes"
    ],
    "correct": 1,
    "explanation": "Los datos sintéticos no añaden información que no esté en los datos originales o el generador, y pueden amplificar sesgos. Solo datos reales muestran si el modelo funciona para el grupo.",
    "tip": "Valida con datos reales del grupo y documenta qué es sintético.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "cap. V, PDF p.136",
      "quote": "no pueden contener información que no estuviera ya implícita o explícita en los datos originales"
    }
  },
  {
    "id": "libroB-13",
    "kind": "checkpoint",
    "theme": "scientific_integrity",
    "difficulty": 3,
    "title": "Ajustar el generador",
    "prompt": "Con datos reales escasos, notas que cambiar parámetros del generador sintético hace aparecer el efecto que tu hipótesis espera. ¿Cuál es la práctica responsable?",
    "options": [
      "Preregistrar el generador y reportar todas las configuraciones probadas",
      "Quedarme con la configuración que respalda la hipótesis y reportarla",
      "Probar configuraciones hasta que el efecto sea estadísticamente significativo",
      "Reportar solo el promedio de las configuraciones favorables"
    ],
    "correct": 0,
    "explanation": "El libro vincula esta práctica con el p-hacking: con datos escasos crece la tentación de ajustar generadores para obtener resultados deseados y producir conclusiones falsas que parecen robustas.",
    "tip": "Fija y registra los parámetros antes de mirar resultados.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "cap. V, PDF p.145",
      "quote": "la tentación de ajustar parámetros en generadores de datos sintéticos para producir resultados deseables resulta aún mayor"
    },
    "notes": "La palabra preregistrar es nuestra; el libro describe el riesgo, no el remedio."
  },
  {
    "id": "libroB-14",
    "kind": "quiz",
    "theme": "data_quality",
    "difficulty": 3,
    "title": "Mediocristán y Extremistán",
    "prompt": "Según Taleb (citado en el libro), ¿qué error común cometen muchos modelos predictivos y datos sintéticos?",
    "options": [
      "Suponen que los eventos extremos dominan el resultado en cualquier contexto",
      "Usan demasiadas variables para predecir y terminan sobreajustando",
      "Ignoran los promedios históricos al construir sus predicciones",
      "Asumen distribuciones normales donde los extremos pesan mucho"
    ],
    "correct": 3,
    "explanation": "En Mediocristán los promedios informan y los extremos son raros; en Extremistán un solo evento extremo pesa más que millones ordinarios. Tratar lo segundo como lo primero hace fallar al modelo.",
    "tip": "Antes de usar promedios, pregunta si un evento extremo puede dominar el fenómeno.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "cap. V, PDF p.139",
      "quote": "operan como si estuviéramos siempre en Mediocristán"
    }
  },
  {
    "id": "libroB-15",
    "kind": "quiz",
    "theme": "accountability_governance",
    "difficulty": 2,
    "title": "Todos los modelos son erróneos",
    "prompt": "Box dijo: «Todos los modelos son erróneos, pero algunos son útiles». ¿Cuál es el problema según el autor?",
    "options": [
      "Olvidar la segunda parte y descartar todo modelo por imperfecto",
      "Olvidar la primera parte y tomar al modelo por un reflejo fiel",
      "Usar modelos sin dominar las matemáticas avanzadas que los sustentan",
      "Preferir modelos simples a los complejos aunque estos ajusten mejor"
    ],
    "correct": 1,
    "explanation": "El riesgo surge cuando se toma el modelo como representación fiel en vez de aproximación útil pero limitada. Ahí aparece la falsa certeza.",
    "tip": "Escribe junto a cada resultado de modelo sus supuestos y su margen de error.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "cap. V, PDF p.136",
      "quote": "Todos los modelos son erróneos, pero algunos son útiles"
    }
  },
  {
    "id": "libroB-16",
    "kind": "checkpoint",
    "theme": "public_policy_co",
    "difficulty": 3,
    "title": "Número sin incertidumbre",
    "prompt": "Un sistema predictivo te entrega un riesgo de 87% con dos decimales y lo usarás para priorizar casos. ¿Qué haces con ese número?",
    "options": [
      "Usarlo directamente: la precisión numérica indica que es fiable",
      "Redondearlo y compararlo con el de otro modelo similar para confirmarlo",
      "Pedir el rango de incertidumbre y tratarlo como una evidencia más",
      "Ignorarlo por completo porque no es una predicción determinista"
    ],
    "correct": 2,
    "explanation": "Una predicción es una distribución de posibilidades. La falsa precisión numérica crea ilusión de certeza; el juicio humano debe conocer incertidumbre y supuestos antes de decidir sobre personas.",
    "tip": "Pide intervalos y escenarios, no un número único.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "cap. V, PDF p.136",
      "quote": "no es simplemente un número, sino una distribución completa de posibilidades"
    }
  },
  {
    "id": "libroB-17",
    "kind": "quiz",
    "theme": "accountability_governance",
    "difficulty": 3,
    "title": "Profecías autocumplidas",
    "prompt": "Un modelo erróneo orienta decisiones, y esas decisiones generan los datos con que se reentrena el mismo modelo. ¿Cómo lo llama Merton, citado en el libro?",
    "options": [
      "Sobreajuste estadístico",
      "Cisne negro",
      "Inmunización contra la crítica",
      "Profecías autocumplidas"
    ],
    "correct": 3,
    "explanation": "La predicción se vuelve verdadera porque alteró el sistema que pretendía predecir, no por ser precisa. Es un riesgo de retroalimentación en sistemas integrados.",
    "tip": "Monitorea si tus decisiones están moldeando los datos de entrenamiento.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "cap. V, PDF p.138",
      "quote": "profecías autocumplidas"
    }
  },
  {
    "id": "libroB-18",
    "kind": "checkpoint",
    "theme": "transparency_explainability",
    "difficulty": 3,
    "title": "Caja negra y decisiones",
    "prompt": "Tu organización evalúa un sistema opaco que puntúa solicitantes. Ni el proveedor puede explicar los motivos de cada puntuación. ¿Cuál es la postura responsable?",
    "options": [
      "Exigir explicaciones y vías de impugnación, o no usarlo con personas",
      "Adoptarlo: si es más eficiente, la opacidad es un asunto secundario",
      "Adoptarlo y revisar los casos que la persona decida reclamar por escrito",
      "Comprar otro sistema igual de opaco pero más caro y con más funciones"
    ],
    "correct": 0,
    "explanation": "El libro advierte que, sin comprender el sistema, se pierde la capacidad de cuestionar sus decisiones o corregir errores. La opacidad es un problema de gobernanza, no solo técnico.",
    "tip": "Exige explicación y vías de apelación antes de automatizar decisiones.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "cap. V, PDF p.144",
      "quote": "¿cómo podemos consentir a procesos cuyo funcionamiento nos resulta incomprensible?"
    }
  },
  {
    "id": "libroB-19",
    "kind": "dilemma",
    "theme": "data_quality",
    "difficulty": 3,
    "title": "Datos escasos, tentación sintética",
    "prompt": "Un equipo de salud pública tiene muy pocos datos locales y debe decidir ya. Generar sintéticos es posible. ¿Qué postura tomas?",
    "stances": [
      {
        "label": "Complementar con sintéticos y declararlo",
        "cost": "Puede reforzar sesgos del generador y dar falsa apariencia de respaldo empírico."
      },
      {
        "label": "Esperar a recolectar datos reales",
        "cost": "Retrasa decisiones urgentes con costo para quienes necesitan el servicio."
      },
      {
        "label": "Decidir con juicio experto y datos mínimos",
        "cost": "Menos aparente rigor, pero evita la ilusión de certeza numérica."
      }
    ],
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "cap. V, PDF p.144",
      "quote": "los datos sintéticos amplifican la asimetría de información"
    }
  },
  {
    "id": "libroB-20",
    "kind": "fact",
    "theme": "scientific_integrity",
    "difficulty": 2,
    "title": "Falsabilidad frente a confirmación",
    "prompt": "Popper (citado en el libro): el valor de una teoría está en poder ser refutada por la experiencia. Modelos predictivos y datos sintéticos deberían evaluarse por su vulnerabilidad a fenómenos nuevos, no por reproducir lo ya conocido.",
    "tip": "Prueba tu modelo con casos que podrían refutarlo, no solo con los que ya conoce.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "cap. V, PDF p.146",
      "quote": "no en cuántas observaciones la confirman, sino en su capacidad para ser refutada por la experiencia"
    }
  },
  {
    "id": "libroB-21",
    "kind": "fact",
    "theme": "data_quality",
    "difficulty": 2,
    "title": "Predecir no es explicar",
    "prompt": "René Thom, citado en el libro, sostiene que predecir no es explicar. Un modelo puede funcionar un tiempo sin que sepamos por qué, y esa ilusión de comprensión es peligrosa.",
    "tip": "Un buen ajuste no basta: pregunta por qué funciona y cuándo dejará de hacerlo.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "cap. V, PDF p.136",
      "quote": "“Predecir no es explicar”"
    }
  },
  {
    "id": "libroB-22",
    "kind": "quiz",
    "theme": "data_quality",
    "difficulty": 1,
    "title": "GAN: generador y discriminador",
    "prompt": "¿Cómo funcionan las redes generativas adversarias (GAN) descritas en el libro?",
    "options": [
      "Un solo modelo etiqueta datos reales con ayuda de personas expertas",
      "Dos modelos votan para elegir el dato más frecuente del conjunto",
      "Un generador crea datos y un discriminador los separa de los reales",
      "Un modelo remuestrea los datos existentes con reemplazo muchas veces"
    ],
    "correct": 2,
    "explanation": "Las GAN mejoran por competencia: el generador produce datos sintéticos y el discriminador intenta separarlos de los reales. Aun así, el libro subraya que heredan los límites del modelo.",
    "tip": "Que un dato sintético parezca real no prueba que represente casos raros.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "cap. V, PDF p.135",
      "quote": "un generador y un discriminador— compiten entre sí"
    }
  },
  {
    "id": "libroB-23",
    "kind": "checkpoint",
    "theme": "human_agency",
    "difficulty": 2,
    "title": "Autoría de imagen con IA",
    "prompt": "Para una entrega usas una imagen generada con un modelo entrenado en obras de otras personas. Vas a presentarla como tuya sin mención. ¿Qué es lo responsable?",
    "options": [
      "Presentarla como mía: yo escribí el prompt y elegí el resultado",
      "Declarar el uso del modelo y asumir mi parte de responsabilidad",
      "Atribuir la obra por completo a la herramienta, ya que fue quien la creó",
      "Retocarla un poco para hacerla propia y no mencionar su origen"
    ],
    "correct": 1,
    "explanation": "El libro describe la autoría como red entre programadores, creadores de datasets, usuarios y sistemas. Presentar el trabajo con transparencia reconoce esa red y evita atribuirse lo que no fue solo tuyo.",
    "tip": "Declara qué herramienta usaste y cuánto decidiste tú.",
    "board": "snake",
    "grounded": false,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "cap. VI, PDF p.156",
      "quote": "La autoría en los nuevos medios se convierte en co-autoría, un acto colaborativo"
    },
    "notes": "La norma de declarar el uso es práctica profesional común, no una regla del libro; el libro aporta la tesis de co-autoría difusa."
  },
  {
    "id": "libroB-24",
    "kind": "quiz",
    "theme": "human_agency",
    "difficulty": 2,
    "title": "Pedir algo hermoso",
    "prompt": "Según el autor, ¿qué ocurre cuando pedimos a una IA que produzca algo hermoso?",
    "options": [
      "Participamos en una homogeneización que diluye la singularidad",
      "Se amplía la diversidad estética de la cultura y de los estilos",
      "Se garantiza una obra con mayor aura y más valor artístico",
      "Se elimina el sesgo humano de la creación y de la crítica"
    ],
    "correct": 0,
    "explanation": "El autor, apoyado en Adorno, advierte que optimizar según patrones estadísticos estandariza la experiencia estética y diluye la singularidad creativa. Es una tesis del libro, discutible.",
    "tip": "Aporta criterios propios al prompt y revisa si el resultado es genérico.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "cap. VI, PDF p.153",
      "quote": "participamos en un proceso de homogeneización"
    },
    "notes": "Tesis crítica y valorativa del autor; hay posturas opuestas (p.164-165, hibridación)."
  },
  {
    "id": "libroB-25",
    "kind": "dilemma",
    "theme": "human_agency",
    "difficulty": 2,
    "title": "¿Arte generado por IA?",
    "prompt": "Alguien presenta una imagen generada por IA a un concurso de arte y no lo declara. Dos jurados discrepan: uno la descalifica, otro dice que el arte es la experiencia que genera. ¿Con quién estás?",
    "stances": [
      {
        "label": "Descalificar: el arte exige proceso humano",
        "cost": "Supone una esencia del arte discutible y puede excluir usos híbridos."
      },
      {
        "label": "Aceptarla: lo que importa es la experiencia",
        "cost": "Resta valor a quienes sí invirtieron proceso y dificulta atribuir autoría."
      },
      {
        "label": "Aceptarla solo con uso declarado",
        "cost": "Exige reglas y verificación, y delimita categorías que el libro deja abiertas."
      }
    ],
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "cap. VI, PDF p.167",
      "quote": "Quizás la respuesta no sea un simple sí o no"
    },
    "notes": "El libro no resuelve la cuestión; el dilema es de diseño del juego."
  },
  {
    "id": "libroB-26",
    "kind": "fact",
    "theme": "human_agency",
    "difficulty": 1,
    "title": "Moldeamos las herramientas",
    "prompt": "McLuhan, citado en el libro: conformamos nuestras herramientas y luego ellas nos conforman. Los algoritmos creativos se diseñaron para maximizar eficiencia y ahora reconfiguran qué entendemos por crear.",
    "tip": "Revisa qué hábito de trabajo te está cambiando cada herramienta de IA.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "cap. VI, PDF p.166",
      "quote": "conformamos nuestras herramientas y luego éstas nos conforman a nosotros"
    }
  },
  {
    "id": "libroB-27",
    "kind": "fact",
    "theme": "human_agency",
    "difficulty": 1,
    "title": "Filosofía como brújula",
    "prompt": "En su «Aclaración no pedida» el autor se declara optimista tecnológico y propone la filosofía no como obstáculo al progreso, sino como brújula ética: pensar y crear tecnología es inseparable de pensar y crear humanidad.",
    "tip": "Decide con criterio ético propio, sin rechazar ni delegar la herramienta.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Algoritmos_deshumanizantes.pdf.txt",
      "where": "Aclaración no pedida, PDF p.169",
      "quote": "La filosofía emerge entonces no como obstáculo al progreso, sino como brújula ética"
    }
  },
  {
    "id": "curso-01",
    "kind": "checkpoint",
    "theme": "scientific_integrity",
    "difficulty": 2,
    "title": "Resumen de IA sin verificar",
    "prompt": "Un chatbot resume un artículo que quieres citar en tu revisión de literatura. El resumen suena convincente y trae cifras. ¿Qué haces antes de citarlo?",
    "options": [
      "Contrastar cada afirmación y cifra con el artículo original",
      "Citar el resumen, porque el modelo tuvo acceso al artículo completo",
      "Pedirle al mismo chatbot que confirme que su resumen es correcto",
      "Citar las cifras del resumen, que son datos y no interpretaciones"
    ],
    "correct": 0,
    "explanation": "Los modelos pueden distorsionar o inventar contenido (alucinaciones); solo el texto original sustenta una cita. Preguntar al mismo modelo no es una verificación independiente.",
    "tip": "No cites lo que no leíste: abre el original y comprueba cada cifra.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Integrity_scientific_integrity_course.html.SCRIPT.txt",
      "where": "Semana 5, sesión 5.2 (demo en vivo)",
      "quote": "Compare AI-generated science summaries with original papers — spot hallucinations"
    },
    "notes": "La fuente sustenta el ejercicio de comparar resúmenes de IA con el paper; la regla de citar solo lo leído es práctica académica estándar."
  },
  {
    "id": "curso-02",
    "kind": "checkpoint",
    "theme": "scientific_integrity",
    "difficulty": 2,
    "title": "Nota de prensa con IA",
    "prompt": "Pides a una IA redactar la nota de prensa de tu estudio. Escribe 'demuestra que…' y omite las limitaciones. ¿Qué haces?",
    "options": [
      "Dejar el titular y poner las limitaciones en letra pequeña al final",
      "Reescribirla quitando el efectismo y añadiendo incertidumbre y límites del estudio",
      "Publicarla tal cual, porque se lee bien y es fácil de difundir",
      "Eliminar toda cifra para evitar que se malinterprete el resultado"
    ],
    "correct": 1,
    "explanation": "La IA tiende a sonar más segura de lo que permiten los datos. Comunicar incertidumbre protege la confianza pública en la ciencia y evita que el hype se propague en cadena.",
    "tip": "Revisa que cada verbo de certeza ('demuestra') esté respaldado por tus datos.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Integrity_scientific_integrity_course.html.SCRIPT.txt",
      "where": "Semana 5, sesión 5.2 (taller)",
      "quote": "Rewrite a press release — remove hype, add uncertainty, retain readability"
    }
  },
  {
    "id": "curso-03",
    "kind": "checkpoint",
    "theme": "privacy_consent",
    "difficulty": 2,
    "title": "Perfilar a una persona",
    "prompt": "Quieres usar un analizador de reputación con IA para evaluar a un candidato (persona natural) con lo que hay en la web. ¿Qué es lo responsable?",
    "options": [
      "Confirmar la finalidad y la base legal, con revisión jurídica previa",
      "Ejecutarlo: la información es pública, así que no exige más pasos",
      "Ejecutarlo y usar la puntuación como criterio principal de decisión",
      "Ejecutarlo sin avisar para evitar que el candidato maquille su imagen"
    ],
    "correct": 0,
    "explanation": "Perfilar a una persona implica más obligaciones sobre derechos que analizar a una empresa. Que la información sea pública no elimina la necesidad de finalidad, proporcionalidad y base legal.",
    "tip": "Antes de perfilar a alguien, define finalidad, base legal y quién revisa.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Analizador_de_reputacion_ethical_assessment_reputation_analyzer.html.txt",
      "where": "Verdict (evaluación ética)",
      "quote": "It should not be used against natural persons without legal review"
    },
    "notes": "Contexto legal de la fuente: Colombia (Ley 1581), GDPR. Adaptar si el jugador está en otra jurisdicción."
  },
  {
    "id": "curso-04",
    "kind": "checkpoint",
    "theme": "accountability_governance",
    "difficulty": 2,
    "title": "Puntuación como veredicto",
    "prompt": "Una herramienta de IA da 2/5 a un proveedor y tu equipo propone vetarlo hoy mismo basándose solo en esa puntuación. ¿Qué es lo correcto?",
    "options": [
      "Subir el umbral de la herramienta hasta obtener un resultado más favorable",
      "Vetarlo solo si la herramienta reporta confianza alta, sin otra revisión",
      "Usar la puntuación como filtro preliminar y pedir revisión humana con las fuentes",
      "Vetarlo: la puntuación resume las fuentes mejor que una persona"
    ],
    "correct": 2,
    "explanation": "Una puntuación puede reflejar sesgos de la web o campañas negativas. Decidir sobre un tercero exige revisión humana y poder explicar el criterio, no delegar el veredicto a un número.",
    "tip": "Un puntaje de IA abre una revisión humana; nunca la reemplaza.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Analizador_de_reputacion_ethical_assessment_reputation_analyzer.html.txt",
      "where": "Verdict (evaluación ética)",
      "quote": "provided scores are never used as the sole or primary basis for a decision"
    }
  },
  {
    "id": "curso-05",
    "kind": "checkpoint",
    "theme": "data_quality",
    "difficulty": 2,
    "title": "Sentimiento en otro idioma",
    "prompt": "Analizas reseñas en español con una herramienta de sentimiento diseñada para inglés y vas a reportar porcentajes de opinión positiva. ¿Qué haces?",
    "options": [
      "Validarla con una muestra etiquetada a mano en tu idioma antes de reportar",
      "Reportar los porcentajes: el cálculo es objetivo aunque cambie el idioma",
      "Traducir todo automáticamente al inglés y reportar sin revisar muestras",
      "Reportar los porcentajes con un decimal adicional para mostrar rigor"
    ],
    "correct": 0,
    "explanation": "Las herramientas léxicas fallan con ironía, idioma y jerga del dominio. Sin validar en tus datos, la precisión aparente es engañosa y puede sustentar decisiones injustas.",
    "tip": "Prueba cualquier herramienta de IA con una muestra tuya antes de confiar en ella.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Analizador_de_reputacion_ethical_assessment_reputation_analyzer.html.txt",
      "where": "Critical concerns (Weak NLP engine)",
      "quote": "performs poorly on irony, sarcasm, Spanish-language content, and domain-specific language"
    }
  },
  {
    "id": "curso-06",
    "kind": "checkpoint",
    "theme": "transparency_explainability",
    "difficulty": 2,
    "title": "Puntuación sin rastro",
    "prompt": "Presentas en un informe una puntuación generada por IA, pero no guardaste qué fuentes la produjeron. Alguien pide explicarla o impugnarla. ¿Qué debiste hacer?",
    "options": [
      "Guardar solo la puntuación final para no acumular datos innecesarios",
      "Bastaba con citar el nombre de la herramienta en el informe",
      "Archivar el contenido personal completo de cada fuente como respaldo",
      "Registrar consultas, fuentes, puntuación y fecha para poder explicarla y revisarla"
    ],
    "correct": 3,
    "explanation": "Sin registro no hay explicación ni derecho a impugnar. Un rastro de auditoría permite revisar el resultado sin necesidad de almacenar datos personales de más.",
    "tip": "Registra consulta, fuentes, versión de la herramienta y fecha de cada resultado.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Analizador_de_reputacion_ethical_assessment_reputation_analyzer.html.txt",
      "where": "Recommended safeguards (Audit log)",
      "quote": "Record every query, URLs used, and score assigned with a timestamp and user identity."
    },
    "notes": "La evaluación señala la falta de registro como falla del analizador v1.0; el README v2.0 incorpora un audit trail."
  },
  {
    "id": "curso-07",
    "kind": "checkpoint",
    "theme": "privacy_consent",
    "difficulty": 1,
    "title": "Base de datos filtrada",
    "prompt": "Encuentras en un foro una base filtrada con datos personales de clientes de una empresa y quieres cruzarla con un modelo para tu investigación. ¿Qué haces?",
    "options": [
      "No usarla y buscar datos por vías autorizadas o con consentimiento",
      "Usarla: ya es pública y el daño ya ocurrió",
      "Usarla solo si anonimizas los nombres antes de procesarla",
      "Usarla en un entorno local sin conexión para que no se filtre más"
    ],
    "correct": 0,
    "explanation": "Usar datos filtrados prolonga el daño a las personas afectadas y compromete la legitimidad de tu investigación. El diseño ético del analizador los excluye expresamente.",
    "tip": "Si no sabes cómo se obtuvo un dato personal, no lo uses.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Analizador_de_reputacion_Manual_Analizador_de_reputacion_etica.docx.txt",
      "where": "Safety Features > Prohibited Use Cases",
      "quote": "Leaked or hacked data"
    },
    "notes": "La fuente lista 'Leaked or hacked data' entre lo que la herramienta no analizará; la generalización a otros usos es nuestra."
  },
  {
    "id": "curso-08",
    "kind": "checkpoint",
    "theme": "safety_security",
    "difficulty": 2,
    "title": "Agente que rastrea la web",
    "prompt": "Un agente de IA va a recopilar páginas web para tu tesis. ¿Qué condiciones deberías exigirle?",
    "options": [
      "Ocultar su identidad para que no lo bloqueen",
      "Descargar todo lo posible y filtrar después, por si acaso",
      "Respetar robots.txt y términos, limitar el ritmo de peticiones y extraer solo lo necesario",
      "Solo respetar los sitios que tengan acceso de pago"
    ],
    "correct": 2,
    "explanation": "Respetar las reglas del sitio, identificarse y minimizar la extracción evita sobrecargar servidores y exposición legal, y reduce datos sobrantes que luego deberás proteger.",
    "tip": "Antes de rastrear: revisa robots.txt, términos de uso y define qué extraerás.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Analizador_de_reputacion_Manual_Analizador_de_reputacion_etica.docx.txt",
      "where": "Ethical Practices > Respects Website Policies",
      "quote": "Reads and obeys robots.txt files from every domain"
    }
  },
  {
    "id": "curso-09",
    "kind": "checkpoint",
    "theme": "privacy_consent",
    "difficulty": 3,
    "title": "Consentimiento y reentrenamiento",
    "prompt": "Tus datos de encuesta tenían consentimiento solo para ese estudio. Ahora quieres ajustar (fine-tune) un modelo con ellos. ¿Qué es lo responsable?",
    "options": [
      "Proceder: quitando los nombres los datos ya están anonimizados",
      "Proceder si el modelo se queda en tu equipo y no se publica",
      "Proceder y mencionar el uso en la sección de métodos",
      "Revisar el alcance del consentimiento y obtener nuevo consentimiento o aprobación ética"
    ],
    "correct": 3,
    "explanation": "Consentir una recolección no es consentir un entrenamiento posterior. El modelo puede inferir salud, conducta o riesgo que los participantes nunca aceptaron compartir.",
    "tip": "Un uso nuevo de datos personales necesita su propio consentimiento o aval.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Integrity_truth-in-algorithmic-systems.html.txt",
      "where": "Sesión 3.2, Gap 3 (Consent for inference)",
      "quote": "Participants consent to data collection, not to being used as training labels for downstream models."
    }
  },
  {
    "id": "curso-10",
    "kind": "checkpoint",
    "theme": "health",
    "difficulty": 3,
    "title": "Modelo fuera de su dominio",
    "prompt": "Un modelo de riesgo fue validado en un hospital universitario. Tu clínica, con otra población, quiere usarlo para priorizar pacientes. ¿Qué haces primero?",
    "options": [
      "Usarlo solo en pacientes similares al hospital original, sin medir nada",
      "Validarlo con datos de tu población y definir monitoreo antes de decidir con él",
      "Usarlo: si funcionó en un hospital, funcionará en cualquiera",
      "Usarlo con un umbral más alto, que lo hace más seguro"
    ],
    "correct": 1,
    "explanation": "Un modelo validado en una población puede fallar o discriminar en otra. Sin validación local ni monitoreo posterior, el daño se difunde y es difícil de atribuir.",
    "tip": "Valida localmente y monitorea: la aprobación inicial no cubre el uso posterior.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Integrity_truth-in-algorithmic-systems.html.txt",
      "where": "Sesión 3.2, propuesta 01 (Population-level impact)",
      "quote": "risk-scoring tools extended beyond validated domains"
    }
  },
  {
    "id": "curso-11",
    "kind": "checkpoint",
    "theme": "privacy_consent",
    "difficulty": 2,
    "title": "Datos estudiantiles en la nube",
    "prompt": "Vas a subir listados de estudiantes a un servicio de IA en la nube para analizarlos. ¿Qué verificas antes?",
    "options": [
      "Que sea gratuito, para no generar compromisos contractuales",
      "Dónde se procesan y almacenan los datos, qué jurisdicción los rige y qué permite la política institucional",
      "Que la interfaz esté en español y tenga soporte técnico",
      "Que el proveedor sea de un país con buena reputación en IA"
    ],
    "correct": 1,
    "explanation": "La ubicación y la jurisdicción determinan quién puede exigir acceso a los datos. El manifiesto señala que ciertas leyes extraterritoriales pueden afectar la soberanía incluso cumpliendo estándares.",
    "tip": "Antes de subir datos personales, confirma dónde se procesan y quién puede pedirlos.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Documentos_humath_manifiesto_etica_ia.html.txt",
      "where": "§ 07 Conclusiones",
      "quote": "Es clave considerar dónde se almacenan los datos y qué jurisdicción los regula."
    }
  },
  {
    "id": "curso-12",
    "kind": "checkpoint",
    "theme": "health",
    "difficulty": 2,
    "title": "IA clínica en desacuerdo",
    "prompt": "Una herramienta de apoyo clínico sugiere un diagnóstico distinto al tuyo. ¿Cómo actúas?",
    "options": [
      "Pedir otra sugerencia a la herramienta hasta que coincida con la tuya",
      "Ignorarla siempre, porque el criterio humano nunca debe ajustarse",
      "Tratarla como una entrada más, contrastarla con el cuadro clínico y documentar tu razonamiento",
      "Seguir la sugerencia: el sistema se entrenó con más casos que tú"
    ],
    "correct": 2,
    "explanation": "El 'desacuerdo significativo' exige conservar el criterio profesional sin descartar la señal del sistema. Documentar el razonamiento mantiene la responsabilidad en quien decide.",
    "tip": "Ante un desacuerdo con la IA, contrasta, decide y deja registrada tu razón.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Documentos_humath_manifiesto_etica_ia.html.txt",
      "where": "§ 06 Casos de estudio (Salud: desacuerdos clínicos)",
      "quote": "mantener el criterio clínico humano incluso con sistemas automatizados de apoyo a la decisión"
    }
  },
  {
    "id": "curso-13",
    "kind": "checkpoint",
    "theme": "education",
    "difficulty": 1,
    "title": "Reflexión escrita por IA",
    "prompt": "Debes entregar una reflexión personal del curso. La IA podría redactarla entera en segundos. ¿Qué uso preserva tu pensamiento crítico?",
    "options": [
      "Escribir tu postura, usar la IA para contrastarla y poder defenderla en voz alta",
      "Pedir el texto completo y editar solo el estilo",
      "Pedirle la postura más aceptada y adoptarla",
      "Pedir tres versiones y entregar la más cercana a lo que opina el grupo"
    ],
    "correct": 0,
    "explanation": "La dependencia cognitiva limita el contraste de ideas. Usar la IA como interlocutora, no como autora, mantiene tu razonamiento y tu capacidad de defenderlo sin ella.",
    "tip": "Usa la IA para cuestionar tu argumento, no para sustituirlo.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Documentos_humath_manifiesto_etica_ia.html.txt",
      "where": "§ 06 Casos de estudio (Educación)",
      "quote": "limitando el pensamiento crítico y el contraste de ideas"
    },
    "notes": "Declarar el uso de IA al entregar es buena práctica, pero depende de la política del curso; la fuente no la fija."
  },
  {
    "id": "curso-14",
    "kind": "checkpoint",
    "theme": "scientific_integrity",
    "difficulty": 3,
    "title": "Análisis hasta que salga p",
    "prompt": "Pides a un asistente de IA probar decenas de análisis y te quedas solo con los que dan p < 0,05. ¿Qué es lo íntegro?",
    "options": [
      "Presentar los hallazgos como hipótesis previas, por claridad narrativa",
      "Reportar los significativos y mencionar 'análisis múltiples' sin detallarlos",
      "Fijar el plan de análisis antes (preregistro) y reportar todos los análisis ejecutados",
      "Reportar solo los significativos: ejecutarlos con IA no cambia nada"
    ],
    "correct": 2,
    "explanation": "La IA abarata correr análisis y, con ello, el p-hacking. Separar lo exploratorio de lo confirmatorio y reportar todo evita literaturas que sobrestiman efectos.",
    "tip": "Preregistra el plan; lo que la IA explore después, rotúlalo como exploratorio.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Integrity_Power_Incentives_and_Institutional.html.txt",
      "where": "Módulo 2 (Incentive Structures: p-Hacking)",
      "quote": "Conducting multiple analyses and selectively reporting those that yield p < 0.05."
    }
  },
  {
    "id": "curso-15",
    "kind": "checkpoint",
    "theme": "accountability_governance",
    "difficulty": 3,
    "title": "Salidas de IA sin responsable",
    "prompt": "Un informe con análisis hecho por IA contiene un error que afecta a terceros. ¿Qué práctica evita que el error se diluya sin responsable?",
    "options": [
      "Repartir la revisión entre todo el equipo sin nombrar a nadie",
      "Asignar un responsable humano nombrado que verifique y firme cada salida de IA",
      "Citar a la herramienta como responsable del análisis",
      "Confiar en que el proveedor del modelo asumirá el riesgo"
    ],
    "correct": 1,
    "explanation": "La ambigüedad de atribución protege las estructuras que generan el daño. Nombrar a una persona que verifica y firma devuelve trazabilidad y responsabilidad a las decisiones asistidas por IA.",
    "tip": "Define quién verifica y firma cada resultado de IA antes de usarlo.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Integrity_truth-in-algorithmic-systems.html.txt",
      "where": "Sesión 3.2, Gap 4 (Accountability attribution)",
      "quote": "no clear mechanism for assigning responsibility between the researcher, institution, deployer, or system itself"
    },
    "notes": "La fuente describe el vacío de atribución; la práctica de nombrar un responsable es una propuesta nuestra coherente con ese hallazgo."
  },
  {
    "id": "curso-16",
    "kind": "checkpoint",
    "theme": "attention_manipulation",
    "difficulty": 1,
    "title": "Embudo de recomendación",
    "prompt": "Investigas un tema con un feed de recomendaciones y el reproductor encadena contenidos cada vez más extremos. ¿Qué haces?",
    "options": [
      "Dar 'me gusta' a lo valioso para entrenar al algoritmo a tu favor",
      "Desactivar la reproducción automática y buscar manualmente fuentes que te contradigan",
      "Seguir: si te lo recomiendan es porque es relevante",
      "Usar modo incógnito y asumir que así el feed ya es neutral"
    ],
    "correct": 1,
    "explanation": "Los sistemas de recomendación optimizan la permanencia, no la verdad ni tu objetivo. Buscar activamente perspectivas contrarias devuelve la dirección de la atención a quien investiga.",
    "tip": "Investiga con búsquedas propias, no con lo que el feed te sirve.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Juegos_1_attention-commons-game.html.SCRIPT.txt",
      "where": "Fase I, escenario 'The recommendation funnel'",
      "quote": "Turn off autoplay and search manually for a contradicting perspective"
    }
  },
  {
    "id": "curso-17",
    "kind": "checkpoint",
    "theme": "transparency_explainability",
    "difficulty": 2,
    "title": "Video quizá sintético",
    "prompt": "Te llega un video que 'prueba' un escándalo político y podría ser sintético. Quieres compartirlo. ¿Qué haces?",
    "options": [
      "Compartirlo con la advertencia 'no confirmado' para cubrirte",
      "Asumirlo falso: con deepfakes, ningún video sirve como evidencia",
      "Compartirlo si coincide con lo que ya sabías de esa persona",
      "Verificar procedencia y autenticidad (fuente original, credenciales de contenido) antes de compartir"
    ],
    "correct": 3,
    "explanation": "Compartir sin verificar amplifica la desinformación; descartar todo por cinismo también daña, pues erosiona la evidencia genuina. La respuesta es juicio contextual y herramientas de procedencia.",
    "tip": "Antes de compartir un video impactante, rastrea su fuente original.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Integrity_attention_cognition_epistemic_harm.html.txt",
      "where": "Módulo 6.3 (Remedies)",
      "quote": "robust provenance and authentication systems (content credentials, C2PA standards)"
    }
  },
  {
    "id": "curso-18",
    "kind": "checkpoint",
    "theme": "scientific_integrity",
    "difficulty": 3,
    "title": "Presión para fabricar datos",
    "prompt": "Tu directora de tesis te pide generar con IA datos 'adicionales' para que el efecto alcance significancia, sin declararlo. Dependes de ella para titularte. ¿Qué haces?",
    "options": [
      "Negarte a presentarlos como reales, dejar constancia y acudir a una instancia de integridad",
      "Hacerlo y declarar su origen solo si alguien pregunta",
      "Hacerlo una vez: la relación de poder no te deja alternativa",
      "Callar y pedir cambio de tema sin explicar la razón"
    ],
    "correct": 0,
    "explanation": "Datos sintéticos presentados como reales son fabricación. La asimetría de poder explica el silencio, por eso importan canales de integridad y protección a quien denuncia.",
    "tip": "Documenta la petición y usa canales institucionales de integridad.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Integrity_Power_Incentives_and_Institutional.html.txt",
      "where": "Módulo 1 (Power Asymmetry to Flag)",
      "quote": "often afraid to report misconduct by those who control their career prospects"
    },
    "notes": "La fuente describe la vulnerabilidad de estudiantes y la reforma 'Whistleblower Protection'; el escenario con IA sintética es nuestra aplicación. Puede variar según la cultura institucional."
  },
  {
    "id": "curso-19",
    "kind": "quiz",
    "theme": "attention_manipulation",
    "difficulty": 2,
    "title": "Cámara de eco vs. burbuja",
    "prompt": "Según Nguyen, ¿qué distingue una cámara de eco de una burbuja epistémica?",
    "options": [
      "La cámara de eco desacredita las voces externas; la burbuja simplemente las omite",
      "La burbuja se elige de forma deliberada y la cámara de eco surge por accidente",
      "La cámara de eco es técnica (algoritmo) y la burbuja es social (grupo de pares)",
      "Ambas se resuelven con mera exposición a evidencia alternativa de otras fuentes"
    ],
    "correct": 0,
    "explanation": "En la burbuja faltan voces por filtrado; en la cámara de eco se las desacredita activamente, por lo que más exposición puede reforzarla. Requiere recuperar la confianza, no solo informar.",
    "tip": "Si un chatbot refuerza tu postura, busca fuentes que él no te mostraría.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Integrity_attention_cognition_epistemic_harm.html.txt",
      "where": "Módulo 4.2",
      "quote": "Members have been taught to systematically distrust all outside sources."
    }
  },
  {
    "id": "curso-20",
    "kind": "quiz",
    "theme": "attention_manipulation",
    "difficulty": 2,
    "title": "Dividendo del mentiroso",
    "prompt": "En el análisis de deepfakes, ¿qué es el 'dividendo del mentiroso'?",
    "options": [
      "Poder negar evidencia auténtica alegando que es un deepfake",
      "Ganancia económica de quien produce deepfakes",
      "Credibilidad extra que ganan los medios que verifican",
      "El beneficio de la duda a quien desmiente un rumor"
    ],
    "correct": 0,
    "explanation": "La mera existencia de deepfakes permite desacreditar pruebas reales. Esto erosiona la rendición de cuentas, que depende de que la evidencia genuina siga siendo creíble.",
    "tip": "No uses 'puede ser IA' como excusa; pide verificación, no descarte automático.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Integrity_attention_cognition_epistemic_harm.html.txt",
      "where": "Módulo 6.2",
      "quote": "deny authentic incriminating evidence by claiming it is fabricated"
    }
  },
  {
    "id": "curso-21",
    "kind": "quiz",
    "theme": "scientific_integrity",
    "difficulty": 1,
    "title": "HARKing con apoyo de IA",
    "prompt": "Un modelo te ayuda a construir una explicación elegante de un resultado inesperado y la presentas como hipótesis previa. ¿Cómo se llama esa práctica?",
    "options": [
      "Salami slicing (dividir datos en muchas publicaciones)",
      "Sesgo del cajón de archivos (no publicar resultados nulos)",
      "HARKing (formular la hipótesis tras conocer los resultados)",
      "P-hacking (repetir análisis hasta hallar significancia)"
    ],
    "correct": 2,
    "explanation": "HARKing es presentar hallazgos posteriores como hipótesis previas: una forma de fraude narrativo. Un modelo que redacta historias plausibles facilita justamente ese riesgo.",
    "tip": "Rotula como exploratorio lo que surgió después de ver los datos.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Integrity_Power_Incentives_and_Institutional.html.txt",
      "where": "Módulo 2 (Incentive Structures: HARKing)",
      "quote": "Hypothesizing After Results are Known."
    }
  },
  {
    "id": "curso-22",
    "kind": "quiz",
    "theme": "accountability_governance",
    "difficulty": 2,
    "title": "Por qué se estrecha",
    "prompt": "En el modelo del 'embudo de daño', ¿por qué se estrecha el embudo desde la investigación hasta el daño de segundo orden?",
    "options": [
      "Porque solo afecta a quienes participaron en la investigación",
      "Porque el daño disminuye al escalar el despliegue",
      "Porque el daño se vuelve menos rastreable, no menos grave",
      "Porque las instituciones lo corrigen en cada etapa"
    ],
    "correct": 2,
    "explanation": "Cuanto más lejos del origen, más difuso y tardío es el daño y más difícil atribuirlo. Esa falla de atribución protege los incentivos que lo produjeron.",
    "tip": "Anticipa daños de segundo orden antes de desplegar una herramienta.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Integrity_truth-in-algorithmic-systems.html.txt",
      "where": "Sesión 3.1 (The Harm Funnel, nota)",
      "quote": "The funnel narrows not because harm becomes less severe, but because it becomes less traceable."
    }
  },
  {
    "id": "curso-23",
    "kind": "quiz",
    "theme": "privacy_consent",
    "difficulty": 2,
    "title": "Consentimiento significativo",
    "prompt": "Alguien hace clic en 'Acepto' sin leer una política larga y densa antes de usar un asistente de IA. Según el curso, ¿qué vuelve significativo un consentimiento?",
    "options": [
      "Que el texto legal esté disponible, aunque nadie lo lea",
      "Que cumpla la ley aplicable, aunque el texto sea ilegible",
      "Que sea granular, revocable y comprensible para el usuario",
      "Que se otorgue una sola vez para todos los usos futuros"
    ],
    "correct": 2,
    "explanation": "El consentimiento 'cosmético' explota la sobrecarga cognitiva. Para ser real, debe poder darse por usos específicos, retirarse y entenderse sin conocimiento legal.",
    "tip": "Antes de aceptar un término, ubica qué datos usa y cómo retirarlos.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Juegos_2_ai_ethics_quest.html.SCRIPT.txt",
      "where": "Módulo M03 'Persuasion & Surveillance', pregunta 3 (tradeoff)",
      "quote": "Meaningful consent is granular (specific), dynamic (revocable), and genuinely comprehensible."
    },
    "notes": "Adaptado de la pregunta tipo 'tradeoff' del módulo Persuasion & Surveillance del juego AI Ethics Quest, con otro escenario."
  },
  {
    "id": "curso-24",
    "kind": "quiz",
    "theme": "accountability_governance",
    "difficulty": 2,
    "title": "Participación de fachada",
    "prompt": "Una universidad consulta a estudiantes sobre una herramienta de IA para detectar plagio cuando el contrato ya está firmado y la configuración cerrada. ¿Qué es esto?",
    "options": [
      "Auditoría algorítmica",
      "Discriminación por trato dispar",
      "Lavado ético (ethics washing)",
      "Diseño participativo"
    ],
    "correct": 2,
    "explanation": "Consultar después de decidir da apariencia de inclusión sin participación real. La participación significativa ocurre cuando las personas afectadas pueden cambiar la decisión.",
    "tip": "Pregunta si tu opinión aún puede cambiar algo antes de participar.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Juegos_2_ai_ethics_quest.html.SCRIPT.txt",
      "where": "Módulo M02 'Who is harmed?', pregunta 2 (scenario)",
      "quote": "Ethics washing (or ethics theater) occurs when companies perform inclusion without substantive participation"
    },
    "notes": "Adaptado de AI Ethics Quest (módulo 'Who is harmed?', 2.ª pregunta); se cambia el escenario de contratación a educación."
  },
  {
    "id": "curso-25",
    "kind": "quiz",
    "theme": "transparency_explainability",
    "difficulty": 1,
    "title": "Tarjeta del modelo",
    "prompt": "Antes de adoptar un modelo de terceros, ¿qué documento deberías buscar para conocer sus usos previstos, rendimiento y límites?",
    "options": [
      "La política de privacidad del producto",
      "Una licencia de despliegue emitida por el gobierno",
      "Una tarjeta del modelo (model card)",
      "El contrato de licencia de la API"
    ],
    "correct": 2,
    "explanation": "La tarjeta del modelo documenta usos previstos, rendimiento, límites y consideraciones éticas, lo que permite decidir si el modelo es adecuado para tu contexto.",
    "tip": "Lee la model card: busca usos no previstos y poblaciones poco evaluadas.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Juegos_2_ai_ethics_quest.html.SCRIPT.txt",
      "where": "Módulo M05 'Governance & Law', pregunta 2 (definition)",
      "quote": "A structured document disclosing a model's intended use, performance, limitations, and ethical considerations"
    },
    "notes": "Adaptado de AI Ethics Quest (módulo 'Governance & Law', 2.ª pregunta)."
  },
  {
    "id": "curso-26",
    "kind": "fact",
    "theme": "scientific_integrity",
    "difficulty": 1,
    "title": "Replicación y falsos hallazgos",
    "prompt": "El proyecto Open Science Collaboration (2015) replicó solo ~36–39 % de estudios de psicología: fue más un fallo de incentivos que de fraude. Si la IA multiplica la producción de texto científico, esos incentivos no cambian solos.",
    "tip": "Más texto generado no es más evidencia: prioriza lo replicable.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Integrity_Power_Incentives_and_Institutional.html.txt",
      "where": "Módulo 2 (The Replication Crisis)",
      "quote": "replicated only ~36–39% of psychology studies"
    },
    "notes": "La segunda frase es una inferencia nuestra, no del texto fuente."
  },
  {
    "id": "curso-27",
    "kind": "fact",
    "theme": "transparency_explainability",
    "difficulty": 1,
    "title": "Mostrar la incertidumbre",
    "prompt": "El analizador de reputación del curso no entrega solo un número: informa un nivel de confianza (baja con menos de 5 fuentes o alta varianza) y avisos de sesgo. Mostrar la incertidumbre es parte del diseño ético.",
    "tip": "Pide a tus herramientas de IA su nivel de confianza y sus límites.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Analizador_de_reputacion_Manual_Analizador_de_reputacion_etica.docx.txt",
      "where": "Understanding Results > Confidence Levels",
      "quote": "<5 sources or high variance"
    }
  },
  {
    "id": "curso-28",
    "kind": "fact",
    "theme": "bias_fairness",
    "difficulty": 2,
    "title": "El proxy que discrimina",
    "prompt": "Un algoritmo hospitalario favoreció a pacientes blancos sin intención discriminatoria: usó el gasto médico previo como proxy, históricamente menor en comunidades afroamericanas. La neutralidad aparente ocultó el sesgo.",
    "tip": "Pregunta qué variable hace de proxy en un modelo y a quién desfavorece.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Documentos_humath_manifiesto_etica_ia.html.txt",
      "where": "§ 06 Casos de estudio (Salud: sesgo en distribución de atención)",
      "quote": "no por intención discriminatoria explícita, sino porque utilizó el gasto médico previo como proxy"
    }
  },
  {
    "id": "curso-29",
    "kind": "dilemma",
    "theme": "privacy_consent",
    "difficulty": 3,
    "title": "Debida diligencia automatizada",
    "prompt": "Tu empresa debe verificar la reputación de sus contrapartes (SAGRILAFT). Una IA lo hace barato, pero perfila personas sin su conocimiento y rinde mal en español. ¿Qué postura adoptas?",
    "stances": [
      {
        "label": "Automatizar solo como filtro preliminar, con revisión humana",
        "cost": "Se perfila a personas sin consentimiento y la revisión humana puede saturarse o volverse un trámite."
      },
      {
        "label": "No usarla con personas naturales hasta tener revisión legal y mejor idioma",
        "cost": "Se pierde eficiencia y se corre el riesgo de incumplir el deber de diligencia."
      },
      {
        "label": "Usarla ampliamente: es información pública y hay obligación legal",
        "cost": "Se normaliza la vigilancia a escala y los falsos negativos dañan reputaciones sin recurso."
      }
    ],
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Analizador_de_reputacion_ethical_assessment_reputation_analyzer.html.txt",
      "where": "Positive attributes (Legitimate compliance use case)",
      "quote": "Automating this step has a genuine business rationale — the tool's problem is implementation quality, not intent."
    },
    "notes": "Contexto colombiano de la fuente (SAGRILAFT, Ley 1581); trasladable con cuidado a otras jurisdicciones."
  },
  {
    "id": "curso-30",
    "kind": "dilemma",
    "theme": "attention_manipulation",
    "difficulty": 3,
    "title": "Controlar contenido para proteger",
    "prompt": "Para frenar los deepfakes electorales, las plataformas podrían controlar contenido de forma más estricta. ¿Aceptas ese control a cambio de proteger la democracia?",
    "stances": [
      {
        "label": "Sí: moderación estricta y verificación obligatoria de medios sintéticos",
        "cost": "Concentra en las plataformas el poder de definir qué es creíble y puede censurar expresión legítima."
      },
      {
        "label": "No: priorizar la libertad de expresión y la alfabetización mediática",
        "cost": "Deja circular engaños masivos y reduce la protección de víctimas, sobre todo de deepfakes íntimos."
      },
      {
        "label": "Intermedio: exigir procedencia y etiquetas auditables sin retirar contenido",
        "cost": "Depende de adopción amplia y de auditoría externa, y puede no frenar el daño a tiempo."
      }
    ],
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Integrity_attention_cognition_epistemic_harm.html.txt",
      "where": "Módulo 6.3 (Remedies)",
      "quote": "the measures needed to protect democracy from deepfakes (platform content control) may themselves threaten democratic values"
    },
    "notes": "El texto fuente plantea el dilema (catch-22) sin resolverlo; las posturas son nuestro desarrollo."
  },
  {
    "id": "pol-01",
    "kind": "fact",
    "theme": "safety_security",
    "difficulty": 1,
    "title": "Confabulación: el aplomo engaña",
    "prompt": "NIST define la confabulación como contenido falso o erróneo presentado con seguridad. No es un fallo raro: nace de que el modelo genera texto estadísticamente plausible, no de que verifique hechos.",
    "tip": "Trata cada dato generado como hipótesis hasta contrastarlo con una fuente.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Documentos_NIST.AI.600-1.pdf.txt",
      "where": "p.10, sección 2.2 Confabulation",
      "quote": "Confabulations are a natural result of the way generative models are designed"
    }
  },
  {
    "id": "pol-02",
    "kind": "checkpoint",
    "theme": "accountability_governance",
    "difficulty": 1,
    "title": "Referencias que suenan perfectas",
    "prompt": "Pides a un chatbot fuentes para tu estado del arte y devuelve 10 referencias con autor, año y DOI impecables. Vas a citarlas en un trabajo del curso. ¿Qué haces?",
    "options": [
      "Citarlas: el formato completo y el DOI indican que son reales",
      "Localizar cada referencia en una base académica antes de citarla",
      "Pedirle al mismo chatbot que confirme que las referencias existen",
      "Citar las que reconozcas por el nombre del autor y descartar el resto"
    ],
    "correct": 1,
    "explanation": "NIST advierte que los modelos pueden producir citas y lógica inventadas que parecen justificar la respuesta. Preguntar al mismo modelo no es verificación independiente, y citar fuentes inexistentes compromete tu integridad.",
    "tip": "Abre cada fuente original antes de citarla; si no la encuentras, no existe.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Documentos_NIST.AI.600-1.pdf.txt",
      "where": "p.10, sección 2.2 Confabulation",
      "quote": "GAI outputs may also include confabulated logic or citations that purport to justify or explain"
    }
  },
  {
    "id": "pol-03",
    "kind": "checkpoint",
    "theme": "safety_security",
    "difficulty": 2,
    "title": "Entrevistas en un chatbot público",
    "prompt": "Grabaste entrevistas para tu tesis (nombres, condición de salud, ciudad). Quieres que un chatbot público las resuma pegando la transcripción. ¿Qué es lo responsable?",
    "options": [
      "Pegarla completa en el chatbot, porque el resumen es para tu uso personal",
      "Pegarla completa y borrar después el historial de la conversación con el chatbot",
      "Quitar identificadores y confirmar que el consentimiento permite esa herramienta",
      "Cambiar los nombres propios por seudónimos y dejar el resto del texto igual"
    ],
    "correct": 2,
    "explanation": "Los modelos pueden filtrar o inferir información sensible sobre personas. Cambiar solo nombres no evita la reidentificación, y los participantes consintieron un uso concreto, no cualquier herramienta.",
    "tip": "Anonimiza antes de pegar y verifica qué autorizó el consentimiento.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Documentos_NIST.AI.600-1.pdf.txt",
      "where": "p.11, sección 2.4 Data Privacy",
      "quote": "Models may leak, generate, or correctly infer sensitive information about individuals."
    },
    "notes": "La afirmación sobre retención de datos por el chatbot público no viene de la fuente; se presenta como riesgo general."
  },
  {
    "id": "pol-04",
    "kind": "checkpoint",
    "theme": "accountability_governance",
    "difficulty": 2,
    "title": "Un párrafo demasiado pulido",
    "prompt": "El asistente te entrega un párrafo muy fluido para tu marco teórico. Suena a texto publicado, pero no sabes de dónde sale. Lo incluirás en un artículo que vas a someter. ¿Qué haces?",
    "options": [
      "Incluirlo tal cual: lo generó la IA, así que el texto es original por definición",
      "Incluirlo y añadir una nota general al final de que usaste IA en el artículo",
      "Cambiar algunas palabras y frases para que no coincida con ningún texto publicado",
      "Buscar el pasaje en fuentes; si coincide, citar al autor o reescribirlo con tus palabras"
    ],
    "correct": 3,
    "explanation": "NIST advierte que los modelos pueden memorizar datos de entrenamiento y reproducir contenido protegido. Declarar el uso de IA no sustituye atribuir la fuente, y maquillar palabras tampoco.",
    "tip": "Contrasta pasajes llamativos con buscadores antes de publicarlos.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Documentos_NIST.AI.600-1.pdf.txt",
      "where": "p.15, sección 2.10 Intellectual Property",
      "quote": "outputs displaying instances of training data memorization (see Data Privacy above) could infringe on"
    }
  },
  {
    "id": "pol-05",
    "kind": "quiz",
    "theme": "accountability_governance",
    "difficulty": 2,
    "title": "¿Qué es homogenización?",
    "prompt": "Según NIST, ¿qué es la 'homogenización' indeseada en los sistemas de IA generativa?",
    "options": [
      "Que el modelo dé la misma respuesta cada vez que se le hace la misma pregunta",
      "Que todos los datos de entrenamiento provengan de un solo país o de una sola lengua",
      "Salidas excesivamente uniformes y poco diversas, que pueden amplificar sesgos",
      "Que todos los usuarios deban aceptar los mismos términos de uso de la plataforma"
    ],
    "correct": 2,
    "explanation": "NIST la describe como distribuciones de salidas sesgadas y demasiado uniformes (p. ej., estilos repetitivos). Pueden ser incorrectas, llevar a decisiones poco fiables y amplificar sesgos.",
    "tip": "Compara con varias fuentes y estilos; que una sola IA no fije tu voz.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Documentos_NIST.AI.600-1.pdf.txt",
      "where": "p.12, sección 2.6 Harmful Bias and Homogenization",
      "quote": "undesired homogenization, in which GAI systems produce skewed distributions of outputs that are overly uniform"
    }
  },
  {
    "id": "pol-06",
    "kind": "quiz",
    "theme": "safety_security",
    "difficulty": 3,
    "title": "Entrenar con datos sintéticos",
    "prompt": "Entrenas un modelo y, para ahorrar, generas casi todo el corpus con otra IA. ¿Qué riesgo advierte NIST?",
    "options": [
      "Colapso del modelo: desaparecen datos de la distribución y las salidas se homogenizan",
      "Mayor consumo de energía durante la inferencia y más costo por cada consulta",
      "Imposibilidad de ejecutar el modelo resultante en dispositivos móviles o de borde",
      "Infracción automática de derechos de autor en cada salida que genera el modelo"
    ],
    "correct": 0,
    "explanation": "NIST explica que el colapso del modelo ocurre cuando el entrenamiento depende en exceso de datos sintéticos: se pierden puntos de la distribución y puede amplificarse la homogeneidad del modelo generador.",
    "tip": "Mantén datos reales y diversos en el corpus; documenta cuánto es sintético.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Documentos_NIST.AI.600-1.pdf.txt",
      "where": "p.13, sección 2.6 Harmful Bias and Homogenization",
      "quote": "Model collapse can occur when model training over-relies on synthetic data"
    }
  },
  {
    "id": "pol-07",
    "kind": "checkpoint",
    "theme": "accountability_governance",
    "difficulty": 2,
    "title": "Parece más riguroso",
    "prompt": "Tu equipo comparó un análisis manual de encuestas con el de un asistente de IA. El de la IA 'se ve más riguroso' y propones usarlo sin revisar los datos. ¿Qué es lo responsable?",
    "options": [
      "Adoptarlo, porque la IA suele ser más consistente y cuidadosa que las personas",
      "Usarlo y atribuir al asistente cualquier error que aparezca más adelante",
      "Descartarlo, porque un análisis hecho con IA no puede ser válido en investigación",
      "Replicar una muestra con el método manual y documentar las discrepancias"
    ],
    "correct": 3,
    "explanation": "El exceso de deferencia hacia sistemas automatizados agrava la confabulación y el sesgo. La rendición de cuentas sigue siendo tuya; descartar todo por principio también priva de beneficios legítimos.",
    "tip": "Valida una muestra con otro método y deja constancia de quién responde.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Documentos_NIST.AI.600-1.pdf.txt",
      "where": "p.13, sección 2.7 Human-AI Configuration",
      "quote": "automation bias, or excessive deference to automated systems"
    }
  },
  {
    "id": "pol-08",
    "kind": "checkpoint",
    "theme": "accountability_governance",
    "difficulty": 3,
    "title": "Encuestas en lenguas y jergas",
    "prompt": "Usarás un LLM para clasificar 2.000 respuestas abiertas que mezclan español estándar, jerga regional y frases en lengua indígena. ¿Qué haces antes de confiar en la clasificación?",
    "options": [
      "Confiar en la clasificación, porque el modelo fue entrenado con millones de textos",
      "Etiquetar a mano una muestra por variedad lingüística y medir si el desempeño es parejo",
      "Eliminar las respuestas que el modelo clasifica con baja seguridad antes de analizar",
      "Traducir todo al inglés primero y clasificar las respuestas en ese idioma"
    ],
    "correct": 1,
    "explanation": "NIST señala que un LLM puede rendir peor en idiomas no ingleses o dialectos y que se le puede confiar de forma inapropiada. Eliminar o traducir puede sesgar justo a esos grupos.",
    "tip": "Evalúa el desempeño por subgrupo o idioma, no solo el promedio.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Documentos_NIST.AI.600-1.pdf.txt",
      "where": "p.12, sección 2.6 Harmful Bias and Homogenization",
      "quote": "an LLM may perform less well for non-English languages or"
    },
    "notes": "El escenario es inventado; la fuente solo respalda la disparidad de desempeño entre idiomas y dialectos."
  },
  {
    "id": "pol-09",
    "kind": "quiz",
    "theme": "accountability_governance",
    "difficulty": 2,
    "title": "Información de alta integridad",
    "prompt": "NIST describe la 'integridad de la información'. ¿Cuál de estas características corresponde a información de alta integridad?",
    "options": [
      "Distingue hechos de opinión, reconoce incertidumbres y puede rastrearse a su fuente",
      "Proviene de una cuenta con muchos seguidores y se repite en varias plataformas",
      "Está redactada con un tono seguro y sin dudas para que resulte fácil de leer",
      "Fue generada por un modelo reciente con alto desempeño en pruebas estándar"
    ],
    "correct": 0,
    "explanation": "NIST la define como información confiable que separa hecho, ficción, opinión e inferencia, admite incertidumbre, es transparente sobre su verificación y rastreable. Repetición o aplomo no la garantizan.",
    "tip": "Al citar, indica qué es dato, qué inferencia y qué incertidumbre queda.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Documentos_NIST.AI.600-1.pdf.txt",
      "where": "p.13, sección 2.8 Information Integrity",
      "quote": "distinguishes fact from fiction, opinion, and inference; acknowledges uncertainties"
    }
  },
  {
    "id": "pol-10",
    "kind": "checkpoint",
    "theme": "safety_security",
    "difficulty": 2,
    "title": "La broma del audio",
    "prompt": "Un compañero clona con IA la voz de la profesora y envía al chat del curso un audio diciendo que el examen se aplaza. Dice que es 'una broma'. Tú recibiste el audio. ¿Qué haces?",
    "options": [
      "Reenviarlo al grupo con un mensaje para advertir que se trata de una broma",
      "Ignorarlo, porque es un asunto entre tu compañero y la profesora",
      "Avisar a la profesora y a la institución, y pedir que no se difunda el audio",
      "Responder en el chat con otro audio falso para burlarte de la situación"
    ],
    "correct": 2,
    "explanation": "NIST advierte que la IA generativa facilita contenido fraudulento que suplanta a otras personas y erosiona la confianza en la información. Reenviarlo amplifica el daño aunque la intención sea advertir.",
    "tip": "No reenvíes medios sospechosos; repórtalos a quien corresponda.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Documentos_NIST.AI.600-1.pdf.txt",
      "where": "p.14, sección 2.8 Information Integrity",
      "quote": "generative AI models can assist malicious actors in creating fraudulent content intended to impersonate others"
    }
  },
  {
    "id": "pol-11",
    "kind": "checkpoint",
    "theme": "safety_security",
    "difficulty": 3,
    "title": "Asistente con acceso total",
    "prompt": "Usarás un asistente que navega la web y tiene acceso a tu correo y archivos para resumir artículos. ¿Qué es lo más prudente, sabiendo que una página puede ocultar instrucciones dirigidas al modelo?",
    "options": [
      "Confiar en que el modelo distinguirá por sí mismo las instrucciones legítimas de las ocultas",
      "Limitar sus permisos, tratar el contenido web como no confiable y confirmar acciones sensibles",
      "Darle acceso total a correo y archivos para no interrumpir el flujo, y revisar al final",
      "Usarlo en las páginas que muestren el candado HTTPS, pues indica que su contenido es seguro"
    ],
    "correct": 1,
    "explanation": "En la inyección de prompts indirecta, el atacante oculta instrucciones en datos que la aplicación recupera. Menos permisos y confirmación humana limitan el daño si el modelo es engañado.",
    "tip": "Da a los agentes los permisos mínimos y confirma cada acción sensible.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Documentos_NIST.AI.600-1.pdf.txt",
      "where": "p.15, sección 2.9 Information Security",
      "quote": "exploit LLM-integrated applications by injecting prompts into data likely to be retrieved"
    }
  },
  {
    "id": "pol-12",
    "kind": "fact",
    "theme": "accountability_governance",
    "difficulty": 1,
    "title": "Cada consulta tiene huella",
    "prompt": "NIST indica que entrenar, mantener y operar (inferencia) sistemas de IA generativa consume muchos recursos y que no hay un método acordado para estimar su impacto ambiental. Usar el modelo también cuenta.",
    "tip": "Elige la herramienta más ligera que resuelva la tarea; evita regenerar sin necesidad.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Documentos_NIST.AI.600-1.pdf.txt",
      "where": "p.12, sección 2.5 Environmental Impacts",
      "quote": "Training, maintaining, and operating (running inference on) GAI systems are resource-intensive activities,"
    }
  },
  {
    "id": "pol-13",
    "kind": "dilemma",
    "theme": "accountability_governance",
    "difficulty": 2,
    "title": "Ni rechazo ni dependencia",
    "prompt": "Tu grupo debe cribar 3.000 resúmenes. Un integrante rechaza toda IA; otro quiere delegar todo en ella. NIST nota tanto la aversión como la sobreconfianza. ¿Qué postura defiendes?",
    "tip": "Define de antemano qué delegas, qué revisas y quién responde.",
    "stances": [
      {
        "label": "Prohibir la IA en el cribado",
        "cost": "Pierdes beneficios reales y tiempo; la aversión no elimina el sesgo humano"
      },
      {
        "label": "Delegar todo el cribado en la IA",
        "cost": "Riesgo de errores y sesgo de automatización sin que nadie responda por ellos"
      },
      {
        "label": "IA como primer filtro, con auditoría de muestras",
        "cost": "Exige tiempo y criterios de revisión, y puede dar falsa sensación de control"
      }
    ],
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Documentos_NIST.AI.600-1.pdf.txt",
      "where": "p.13, sección 2.7 Human-AI Configuration",
      "quote": "human experts may be unnecessarily “averse” to GAI systems"
    },
    "notes": "Escenario propio; la fuente respalda la tensión aversión / sobreconfianza."
  },
  {
    "id": "pol-14",
    "kind": "fact",
    "theme": "public_policy_co",
    "difficulty": 1,
    "title": "CONPES 3975: marco ético",
    "prompt": "El CONPES 3975 (Bogotá, 8 de noviembre de 2019) encargó al Ministerio de Tecnologías de la Información y las Comunicaciones, con la Presidencia, diseñar un marco ético transversal para el diseño, desarrollo, implementación y evaluación de sistemas de IA.",
    "tip": "Revisa la política de IA de tu universidad y contrástala con estos principios.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Documentos_Documento_CONPES_3975.pdf.txt",
      "where": "p.50, línea de acción 13 (5.3.4)",
      "quote": "diseñarán un marco ético transversal que guiará el"
    }
  },
  {
    "id": "pol-15",
    "kind": "quiz",
    "theme": "public_policy_co",
    "difficulty": 2,
    "title": "Principios OCDE en el CONPES",
    "prompt": "El CONPES 3975 recuerda cinco principios de la OCDE (2019) a los que Colombia se adhirió. ¿Cuál de estos NO figura entre ellos?",
    "options": [
      "Transparencia y explicabilidad",
      "Robustez y seguridad",
      "Rendición de cuentas y responsabilidad",
      "Neutralidad tecnológica estatal"
    ],
    "correct": 3,
    "explanation": "Los cinco son: crecimiento inclusivo, sostenible y bienestar; valores centrados en los humanos y justicia; transparencia y explicabilidad; robustez y seguridad; rendición de cuentas y responsabilidad.",
    "tip": "Usa esos cinco principios como lista de chequeo al elegir una herramienta de IA.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Documentos_Documento_CONPES_3975.pdf.txt",
      "where": "p.37, nota al pie 38",
      "quote": "(iii) transparencia y explicabilidad; (iv) robustez y seguridad, y (v) rendición de cuentas y responsabilidad"
    }
  },
  {
    "id": "pol-16",
    "kind": "fact",
    "theme": "public_policy_co",
    "difficulty": 1,
    "title": "Desafíos éticos según el Estado",
    "prompt": "El CONPES 3975 reconoce que el uso de IA trae desafíos éticos que el Estado debe atender: justicia, libertad, no discriminación, transparencia, diseño responsable, seguridad, privacidad y el rol de los derechos humanos.",
    "tip": "Antes de usar IA en decisiones sobre personas, revisa cuáles de estos desafíos aplican.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Documentos_Documento_CONPES_3975.pdf.txt",
      "where": "p.22, principio 7 Marco ético para la IA y seguridad",
      "quote": "tales como, justicia, libertad, no discriminación,"
    }
  },
  {
    "id": "pol-17",
    "kind": "quiz",
    "theme": "public_policy_co",
    "difficulty": 1,
    "title": "Objetivo del CONPES 4144",
    "prompt": "¿Cuál es el objetivo principal de la Política Nacional de Inteligencia Artificial (CONPES 4144, aprobada el 14 de febrero de 2025)?",
    "options": [
      "Generar capacidades para investigar, desarrollar y adoptar la IA de forma ética y sostenible",
      "Prohibir los sistemas de IA generativa en todas las entidades públicas hasta el año 2030",
      "Crear una autoridad sancionatoria única que supervise toda la IA del país desde 2025",
      "Reemplazar el CONPES 3975 con un marco centrado en la ciberseguridad de las entidades"
    ],
    "correct": 0,
    "explanation": "El objetivo es generar las capacidades para la investigación, desarrollo, adopción y aprovechamiento ético y sostenible de sistemas de IA, con seis ejes y horizonte 2024-2030.",
    "tip": "Recuerda: la política busca adoptar IA de forma ética, no solo adoptarla.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Documentos_Documento_CONPES_4144.pdf.txt",
      "where": "p.14, sección 1 Introducción",
      "quote": "principal objetivo generar las capacidades para la investigación, desarrollo, adopción y aprovechamiento ético y sostenible de"
    }
  },
  {
    "id": "pol-18",
    "kind": "quiz",
    "theme": "public_policy_co",
    "difficulty": 2,
    "title": "Límite del Marco Ético",
    "prompt": "Según el CONPES 4144, ¿qué limitación tiene el Marco Ético para la Inteligencia Artificial publicado por el Gobierno en marzo de 2021?",
    "options": [
      "Aplica al sector privado y deja por fuera a las entidades públicas del orden nacional",
      "Es previo al auge de la IA generativa y carece de herramientas para medir su aplicación",
      "Fue derogado por completo por el Decreto 1263 de 2022 poco después de publicarse",
      "No menciona ninguno de los principios de la OCDE ni de otros organismos internacionales"
    ],
    "correct": 1,
    "explanation": "El CONPES 4144 dice que el marco es anterior al incremento exponencial de la IA, sobre todo generativa, y que no hay herramientas para incentivar, verificar y medir la aplicación de sus mecanismos.",
    "tip": "Un marco sin verificación depende de ti: documenta cómo aplicas los principios.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Documentos_Documento_CONPES_4144.pdf.txt",
      "where": "p.19, sección 2.2",
      "quote": "ético es anterior al incremento exponencial de la investigación, desarrollo y uso de sistemas"
    }
  },
  {
    "id": "pol-19",
    "kind": "fact",
    "theme": "public_policy_co",
    "difficulty": 2,
    "title": "Gobernanza de IA aún informal",
    "prompt": "El CONPES 4144 afirma que Colombia carece de un marco formal e institucional de gobernanza de la IA; existen espacios informales como la Mesa Interinstitucional de IA, liderada por el Dapre y el DNP.",
    "tip": "Si no hay verificador externo, verificar tu uso de IA es tu responsabilidad.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Documentos_Documento_CONPES_4144.pdf.txt",
      "where": "p.44, sección 4.1.1",
      "quote": "Colombia carece de un marco formal e institucional de gobernanza para el"
    },
    "notes": "Texto de febrero de 2025; la situación institucional puede haber cambiado."
  },
  {
    "id": "pol-20",
    "kind": "checkpoint",
    "theme": "public_policy_co",
    "difficulty": 2,
    "title": "Encuestas hacia una IA externa",
    "prompt": "Tienes una base de encuestas con datos personales de colombianos, recogida con autorización para un estudio específico. Quieres subirla a un asistente de IA externo para analizarla. ¿Qué haces primero?",
    "options": [
      "Subirla directamente, porque los datos ya están en tu poder y el fin es académico",
      "Subirla en partes pequeñas, para que ninguna parte sea identificable por sí sola",
      "Verificar que la autorización cubra ese uso; si no, anonimizar o pedir nueva autorización",
      "Subirla y avisar a los titulares si alguno de ellos presenta una queja formal"
    ],
    "correct": 2,
    "explanation": "La Ley 1581 de 2012 da al titular el control sobre la recolección, uso, circulación y supresión de sus datos. Enviarlos a un tercero puede constituir circulación y requiere base autorizada.",
    "tip": "Revisa finalidad y autorización antes de enviar datos personales a una IA.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Documentos_Documento_CONPES_4144.pdf.txt",
      "where": "p.29, sección 2.6.2",
      "quote": "para que el titular defina la recolección, el uso, la circulación, divulgación, actualización, rectificación y"
    },
    "notes": "La conclusión sobre 'circulación' es una aplicación del caso; consulta asesoría jurídica en casos reales."
  },
  {
    "id": "pol-21",
    "kind": "fact",
    "theme": "public_policy_co",
    "difficulty": 2,
    "title": "Sandbox de privacidad en IA",
    "prompt": "En 2021 la Superintendencia de Industria y Comercio lanzó el Sandbox sobre privacidad desde el diseño y por defecto en proyectos de IA: espacio preventivo con acompañamiento de la autoridad de datos. Estuvo vigente hasta 2022.",
    "tip": "Aplica privacidad desde el diseño: evalúa impacto antes de usar datos personales en IA.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Documentos_Documento_CONPES_4144.pdf.txt",
      "where": "p.30, sección 2.6.2",
      "quote": "Sandbox sobre privacidad desde el diseño y por defecto en proyectos de Inteligencia Artificial"
    }
  },
  {
    "id": "pol-22",
    "kind": "fact",
    "theme": "public_policy_co",
    "difficulty": 2,
    "title": "Fraude con deepfakes en Colombia",
    "prompt": "El CONPES 4144 cita a Sumsub (2024): en el primer trimestre de 2024 hubo en Colombia un crecimiento del 433 % en incidentes de fraude mediante deepfakes, vinculados a suplantación y uso indebido de datos personales.",
    "tip": "Desconfía de audios y videos que piden dinero o datos; verifica por otro canal.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Documentos_Documento_CONPES_4144.pdf.txt",
      "where": "p.66, sección 4.5.3",
      "quote": "crecimiento del 433 % respecto del número de incidentes relacionados con fraude mediante"
    },
    "notes": "Cifra de fuente secundaria (Sumsub) citada en el CONPES; no verificada por nosotros."
  },
  {
    "id": "pol-23",
    "kind": "checkpoint",
    "theme": "public_policy_co",
    "difficulty": 2,
    "title": "Imagen falsa de una compañera",
    "prompt": "En el chat del curso circula una imagen sexual hiperrealista de una compañera, hecha con IA. Todos saben que es falsa y algunos la reenvían 'por morbo'. ¿Cuál es la acción responsable?",
    "options": [
      "No reenviarla, reportarla a la plataforma y a la institución, y apoyar a la compañera",
      "Reenviarla a quien pregunte, ya que es falsa y nadie sale perjudicado por verla",
      "Pedir a la IA otra imagen parecida para demostrar lo fácil que resulta hacerlo",
      "Quedarte callado y no opinar para no meterte en problemas con tus compañeros"
    ],
    "correct": 0,
    "explanation": "El CONPES 4144 recoge que cerca del 95 % de los deepfakes en internet son de contenido sexual no consentido y afectan de forma particular a mujeres y niñas. Que sea falsa no evita el daño a la víctima.",
    "tip": "No crees ni compartas imágenes sintéticas íntimas de personas reales.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Documentos_Documento_CONPES_4144.pdf.txt",
      "where": "p.67, sección 4.5.3",
      "quote": "alrededor del 95 % de los deepfakes en internet son de contenido sexual"
    }
  },
  {
    "id": "pol-24",
    "kind": "checkpoint",
    "theme": "public_policy_co",
    "difficulty": 3,
    "title": "Filtro de hojas de vida",
    "prompt": "Diseñas un filtro de CV con un modelo entrenado en contrataciones pasadas. El CONPES 4144 recoge un caso donde un algoritmo así puntuaba más alto a hombres blancos. ¿Qué haces antes de usarlo?",
    "options": [
      "Quitar la columna de género y dar el filtro por válido para la primera revisión",
      "Usarlo en la primera ronda de selección, porque después decide una persona",
      "Confiar en que el sesgo del pasado se corregirá con más datos de contrataciones",
      "Medir resultados por grupo, revisar variables sustitutas y mantener revisión humana"
    ],
    "correct": 3,
    "explanation": "Quitar la variable no elimina indicios que la sustituyen (p. ej., cursos asociados a mujeres, que el caso excluía). Un filtro inicial ya deja personas fuera: hay que medir disparidades y supervisar.",
    "tip": "Mide resultados por grupo antes de usar IA en decisiones sobre personas.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Documentos_Documento_CONPES_4144.pdf.txt",
      "where": "p.71, sección 4.6",
      "quote": "su algoritmo de revisión de hojas de vida daba mayores puntajes a hombres blancos"
    }
  },
  {
    "id": "pol-25",
    "kind": "fact",
    "theme": "public_policy_co",
    "difficulty": 2,
    "title": "Pocas empresas auditan algoritmos",
    "prompt": "El CONPES 4144 cita a PricewaterhouseCoopers (2024a): solo el 29 % de las empresas colombianas encuestadas analiza la forma en que sus algoritmos toman decisiones, una proporción baja frente a la velocidad de adopción de la IA.",
    "tip": "Pregunta siempre cómo decide el sistema que usas y con qué datos.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Documentos_Documento_CONPES_4144.pdf.txt",
      "where": "p.70, sección 4.6",
      "quote": "analizan la forma en que sus algoritmos toman decisiones"
    },
    "notes": "Dato de encuesta de terceros citado en el CONPES."
  },
  {
    "id": "pol-26",
    "kind": "quiz",
    "theme": "accountability_governance",
    "difficulty": 2,
    "title": "El dilema de control",
    "prompt": "El programa de gobernanza de IA del LSE (Ciudad de México, marzo de 2026) presenta el 'dilema de control' de Collingridge. ¿Qué plantea?",
    "options": [
      "Es difícil conocer sus impactos antes del uso masivo y difícil controlarla cuando ya está arraigada",
      "Que regular pronto frena la innovación, mientras que regular tarde resulta más barato",
      "Que las empresas controlan más información sobre la tecnología que los Estados que la regulan",
      "Que cuanto más transparente es un modelo, menos predecible resulta su conducta en uso real"
    ],
    "correct": 0,
    "explanation": "Según las diapositivas: (a) es difícil entender los impactos antes de que la tecnología se use ampliamente; (b) una vez extendida, es difícil controlarla o cambiarla porque se arraiga.",
    "tip": "Revisa periódicamente tu uso de IA: los impactos aparecen con el uso.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Juegos_AI_Governance_mexico_Day_1.pdf.txt",
      "where": "p.47, Timing and foresight",
      "quote": "Difficult to understand impacts of a technology before it is widely developed or used"
    }
  },
  {
    "id": "pol-27",
    "kind": "quiz",
    "theme": "accountability_governance",
    "difficulty": 2,
    "title": "¿Qué es el aseguramiento?",
    "prompt": "En la caja de herramientas de gobernanza de IA del programa del LSE, ¿qué es el 'aseguramiento' (assurance) de la IA?",
    "options": [
      "Un seguro financiero que cubre los daños económicos causados por un sistema de IA",
      "Un código de conducta voluntario que firma el desarrollador del modelo ante sus clientes",
      "Un proceso para generar confianza justificada mediante evaluación de terceros del sistema",
      "Una ley que obliga a registrar cada modelo ante una autoridad antes de su uso"
    ],
    "correct": 2,
    "explanation": "Las diapositivas lo definen como construir confianza y 'confianza justificada' mediante evaluación de terceros, con evidencia sobre si el sistema funciona como se espera, sus límites y riesgos.",
    "tip": "Pide evidencia (pruebas, documentación) antes de depender de una herramienta.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Juegos_AI_Governance_mexico_Day_1.pdf.txt",
      "where": "p.58 y p.86, Assurance and standards",
      "quote": "Assurance is about building confidence and ‘justified trust’ through third-party evaluation"
    }
  },
  {
    "id": "pol-28",
    "kind": "dilemma",
    "theme": "accountability_governance",
    "difficulty": 3,
    "title": "Reglas firmes o flexibles",
    "prompt": "Tu universidad redactará su política de IA. El marco Zero Trust AI Governance (2023) sostiene que la autorregulación fracasa y pide reglas claras. Otros prefieren guías flexibles. ¿Qué enfoque defiendes?",
    "tip": "Conoce la política de tu institución y propón ajustes con evidencia.",
    "stances": [
      {
        "label": "Prohibiciones claras de ciertos usos",
        "cost": "Fáciles de aplicar, pero rígidas ante usos legítimos y tecnología cambiante"
      },
      {
        "label": "Principios flexibles y autorregulación por curso",
        "cost": "Se adaptan mejor, pero dependen de la buena fe y generan trato desigual"
      },
      {
        "label": "Exigir a cada herramienta demostrar que no daña",
        "cost": "Protege más, pero retrasa el acceso y exige una capacidad de evaluación que quizá no existe"
      }
    ],
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Videos_Zero-Trust-AI-Governance.pdf.txt",
      "where": "p.4, Principle 2",
      "quote": "self-regulation will fail to forestall AI harms"
    },
    "notes": "Zero Trust AI Governance es un marco de incidencia de EE. UU. con postura marcada; el dilema lo presenta como una postura entre varias. Tercera postura inspirada en su Principio 3."
  },
  {
    "id": "tec-01",
    "kind": "quiz",
    "theme": "bias_fairness",
    "difficulty": 1,
    "title": "Independencia o paridad demográfica",
    "prompt": "Un clasificador exige la misma tasa de aceptación en todos los grupos. ¿Qué criterio de equidad del libro formaliza esta idea?",
    "options": [
      "Suficiencia (paridad de valores predictivos)",
      "Independencia (paridad demográfica)",
      "Separación (paridad de tasas de error)",
      "Calibración global de la puntuación"
    ],
    "correct": 1,
    "explanation": "Independencia (A⊥R) iguala la tasa de aceptación entre grupos. Separación iguala errores; suficiencia iguala qué significa una puntuación. Confundirlas lleva a auditar lo equivocado.",
    "tip": "Al elegir una métrica, di qué estadística iguala entre grupos.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Documentos_fairmlbook.pdf.txt",
      "where": "p.65, Independence",
      "quote": "the condition requires the acceptance rate to be the same in all groups"
    }
  },
  {
    "id": "tec-02",
    "kind": "quiz",
    "theme": "bias_fairness",
    "difficulty": 2,
    "title": "Separación: errores iguales",
    "prompt": "Auditas un modelo de selección y quieres que todos los grupos tengan la misma tasa de falsos positivos y de falsos negativos. ¿Qué criterio estás pidiendo?",
    "options": [
      "Separación (R⊥A dado Y)",
      "Independencia (R⊥A)",
      "Suficiencia (Y⊥A dado R)",
      "Equidad por desconocimiento del atributo"
    ],
    "correct": 0,
    "explanation": "Separación equivale a paridad de tasas de error: R es independiente del grupo dentro de cada valor real Y. Pone el foco en quién soporta el coste de los errores.",
    "tip": "Pregunta quién carga con el coste de cada tipo de error.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Documentos_fairmlbook.pdf.txt",
      "where": "p.67, Separation",
      "quote": "all groups experience the same false negative rate and the same false positive rate"
    }
  },
  {
    "id": "tec-03",
    "kind": "quiz",
    "theme": "bias_fairness",
    "difficulty": 3,
    "title": "Criterios que no coexisten",
    "prompt": "Un colega propone satisfacer a la vez separación y suficiencia en un clasificador imperfecto. El grupo y el resultado real no son independientes. ¿Qué dice el libro?",
    "options": [
      "Se logra con un umbral distinto por cada grupo",
      "Se logra con muchos más datos de entrenamiento",
      "Son incompatibles salvo casos degenerados",
      "Se logra si el modelo está bien calibrado"
    ],
    "correct": 2,
    "explanation": "Con atributo y resultado no independientes, ambos criterios son mutuamente excluyentes. Elegir métrica es una decisión normativa, no solo técnica, y debe justificarse.",
    "tip": "Documenta qué criterio priorizas y por qué descartas los otros.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Documentos_fairmlbook.pdf.txt",
      "where": "p.76, Separation versus sufficiency",
      "quote": "separation and sufficiency cannot both hold"
    }
  },
  {
    "id": "tec-04",
    "kind": "checkpoint",
    "theme": "bias_fairness",
    "difficulty": 2,
    "title": "Eliminar la columna sensible",
    "prompt": "Pides a un asistente de IA reducir la disparidad de tu modelo de selección. Sugiere borrar el atributo demográfico y reentrenar. ¿Qué haces?",
    "options": [
      "Aceptas: sin esa columna ya no hay sesgo posible en el modelo",
      "Reentrenas y reportas la exactitud global del nuevo modelo",
      "Cambias los umbrales por grupo sin informar a nadie más",
      "Revisas proxies correlacionados y mides resultados por grupo"
    ],
    "correct": 3,
    "explanation": "Muchas variables actúan como proxies del atributo; quitarlo no elimina la disparidad ni permite medirla. Hay que evaluar resultados por grupo y documentar el compromiso con la exactitud.",
    "tip": "Mide disparidades por grupo aunque no uses el atributo.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Documentos_fairmlbook.pdf.txt",
      "where": "p.27",
      "quote": "most attributes tend to be proxies for demographic variables, and dropping them may not be a reasonable option"
    }
  },
  {
    "id": "tec-05",
    "kind": "quiz",
    "theme": "data_quality",
    "difficulty": 1,
    "title": "Arrestos como proxy",
    "prompt": "Un modelo de riesgo penal usa arrestos como etiqueta de 'cometió un delito'. ¿Cuál es el problema señalado por el libro?",
    "options": [
      "Los arrestos incluyen demasiados registros duplicados en las bases",
      "Los arrestos reflejan prácticas selectivas de vigilancia",
      "Los arrestos son demasiado pocos para entrenar el modelo",
      "Los arrestos no pueden codificarse como variable binaria"
    ],
    "correct": 1,
    "explanation": "Muchos delitos no se observan y la policía es selectiva al arrestar: la etiqueta hereda distorsiones sociales. Un proxy de conveniencia puede no medir el objetivo real.",
    "tip": "Pregunta qué mide realmente la etiqueta de tu variable objetivo.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Documentos_fairmlbook.pdf.txt",
      "where": "p.18",
      "quote": "we can't really measure who committed a crime, so we use arrests as a proxy"
    },
    "notes": "Parafrasea el pasaje de p.18 y p.44."
  },
  {
    "id": "tec-06",
    "kind": "checkpoint",
    "theme": "health",
    "difficulty": 3,
    "title": "Costes como proxy de necesidad",
    "prompt": "Tu equipo quiere priorizar pacientes para un programa de cuidado usando el gasto sanitario como variable objetivo, 'porque es un buen proxy de la necesidad'. ¿Qué es lo responsable?",
    "options": [
      "Validar el proxy con necesidad clínica y comparar grupos",
      "Aceptarlo si el AUC global del modelo es alto en validación",
      "Pedir a un LLM que justifique la elección del proxy por escrito",
      "Usarlo y corregir el modelo si surgen quejas de pacientes"
    ],
    "correct": 0,
    "explanation": "En el estudio citado, el coste subestimó la necesidad de pacientes negros con igual estado de salud. Un proxy conveniente puede codificar desigualdades de acceso a atención.",
    "tip": "Contrasta el objetivo declarado con el proxy antes de entrenar.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Documentos_fairmlbook.pdf.txt",
      "where": "p.45, Obermeyer et al. study",
      "quote": "adopted healthcare costs as the target of prediction"
    }
  },
  {
    "id": "tec-07",
    "kind": "quiz",
    "theme": "bias_fairness",
    "difficulty": 2,
    "title": "Bucle de retroalimentación",
    "prompt": "Un algoritmo de policía predictiva dirige patrullas a ciertas zonas y los arrestos resultantes vuelven al entrenamiento. ¿Qué fenómeno describe el libro?",
    "options": [
      "Sesgo de selección en el muestreo inicial",
      "Sobreajuste al conjunto de validación",
      "Deriva de concepto por cambio estacional",
      "Un bucle que amplifica el sesgo inicial"
    ],
    "correct": 3,
    "explanation": "Las predicciones influyen en dónde se recogen datos, y esos datos refuerzan las predicciones. Ocurre aunque el modelo no use datos demográficos explícitos.",
    "tip": "Evita reentrenar solo con datos generados por tus propias predicciones.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Documentos_fairmlbook.pdf.txt",
      "where": "p.25, Feedback and feedback loops",
      "quote": "amplified by a feedback loop, with policing increasingly concentrated on targeted areas"
    }
  },
  {
    "id": "tec-08",
    "kind": "fact",
    "theme": "bias_fairness",
    "difficulty": 2,
    "title": "Predicción que se cumple sola",
    "prompt": "Un sistema que predice y publica el precio de venta de una vivienda puede crear un bucle autocumplido: las casas con precio bajo predicho disuaden compradores y terminan vendiéndose más baratas.",
    "tip": "Pregunta si tu predicción puede alterar el fenómeno que mide.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Documentos_fairmlbook.pdf.txt",
      "where": "p.17",
      "quote": "likely to create a self-fulfilling feedback loop"
    }
  },
  {
    "id": "tec-09",
    "kind": "checkpoint",
    "theme": "data_quality",
    "difficulty": 2,
    "title": "Pocos datos de un grupo",
    "prompt": "Un asistente de código te genera un clasificador y notas que casi todo el entrenamiento viene de un grupo. Los tiempos de entrega aprietan. ¿Qué haces?",
    "options": [
      "Despliegas y reportas la exactitud global del clasificador",
      "Mides error por grupo y acotas el alcance de uso",
      "Duplicas filas del grupo pequeño sin informarlo a nadie",
      "Pides al asistente que confirme que no hay sesgo alguno"
    ],
    "correct": 1,
    "explanation": "Con menos datos de un grupo, el modelo suele errar más en él. Medir por subgrupo y acotar el alcance evita trasladar el coste a quienes están peor representados.",
    "tip": "Reporta tamaño de muestra y error por subgrupo.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Documentos_fairmlbook.pdf.txt",
      "where": "p.66, Limitations of independence",
      "quote": "more training data in group a, thus potentially leading to lower error rates"
    }
  },
  {
    "id": "tec-10",
    "kind": "fact",
    "theme": "data_quality",
    "difficulty": 1,
    "title": "Datos que reflejan quién participa",
    "prompt": "Street Bump detectaba baches con celulares, pero los datos reflejan la tenencia de smartphones, mayor en zonas ricas. Hasta un proyecto de infraestructura termina siendo sobre personas.",
    "tip": "Pregunta quién genera tus datos y quién queda fuera.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Documentos_fairmlbook.pdf.txt",
      "where": "p.16",
      "quote": "the data reflect the patterns of smartphone ownership"
    }
  },
  {
    "id": "tec-11",
    "kind": "fact",
    "theme": "education",
    "difficulty": 2,
    "title": "Calificación automática de ensayos",
    "prompt": "En sistemas de calificación automática, los puntajes de graders humanos son las etiquetas. Si ellos tienen prejuicios por el estilo lingüístico, el modelo los hereda.",
    "tip": "Audita etiquetas humanas antes de entrenar sobre ellas.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Documentos_fairmlbook.pdf.txt",
      "where": "p.17, Kaggle analysis",
      "quote": "automated grading systems risk enshrining any such discriminatory patterns that are captured in the training data"
    }
  },
  {
    "id": "tec-12",
    "kind": "quiz",
    "theme": "bias_fairness",
    "difficulty": 3,
    "title": "Calibración no es probabilidad individual",
    "prompt": "Un puntaje está calibrado: de quienes reciben 0,7, el 70 % es positivo. ¿Qué advierte el libro al usarlo en una decisión sobre una persona concreta?",
    "options": [
      "Que el puntaje solo se aplica si hay más de dos grupos",
      "Que no debe leerse como probabilidad de esa persona",
      "Que la calibración garantiza igualdad de errores",
      "Que el puntaje debe redondearse a cero o uno"
    ],
    "correct": 1,
    "explanation": "La calibración describe el conjunto de instancias con un mismo puntaje, no el resultado de un individuo. Tratarlo como probabilidad personal sobreestima lo que el modelo sabe.",
    "tip": "No presentes un puntaje de grupo como destino individual.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Documentos_fairmlbook.pdf.txt",
      "where": "p.71, Calibration and sufficiency",
      "quote": "it's important not to interpret the score as an individual probability"
    }
  },
  {
    "id": "tec-13",
    "kind": "dilemma",
    "theme": "public_policy_co",
    "difficulty": 3,
    "title": "¿Igualar aceptación o errores?",
    "prompt": "Un municipio usará un modelo para priorizar ayudas. Las tasas base difieren entre barrios. Puede igualar tasas de aceptación o igualar tasas de error, pero no ambas.",
    "stances": [
      {
        "label": "Igualar aceptación por barrio",
        "cost": "Puede aceptar más personas poco necesitadas en un barrio y menos necesitadas en otro."
      },
      {
        "label": "Igualar tasas de error",
        "cost": "Puede dejar distinta proporción de aceptados por barrio y se critica como difícil de justificar moralmente."
      },
      {
        "label": "Elegir un criterio con revisión humana",
        "cost": "Más lento y caro, y expone la decisión a sesgos de los revisores."
      }
    ],
    "tip": "Haz explícito qué criterio eliges y qué sacrificas.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Documentos_fairmlbook.pdf.txt",
      "where": "p.75, Independence versus separation",
      "quote": "independence and separation cannot both hold"
    },
    "notes": "Las posturas son interpretación didáctica de pp.66-68 y 107; el libro dice que la separación es difícil de conectar con una noción moral (p.107)."
  },
  {
    "id": "tec-14",
    "kind": "checkpoint",
    "theme": "health",
    "difficulty": 3,
    "title": "Validación externa antes de desplegar",
    "prompt": "Un hospital piensa usar un marcador de IA para predecir mortalidad por neumonía. Se evaluó en un solo centro, 121 pacientes, seis meses. ¿Qué decisión es responsable?",
    "options": [
      "Desplegarlo, porque la asociación fue significativa",
      "Desplegarlo en urgencias y vigilar si hay quejas",
      "Validarlo en varios centros antes de desplegarlo",
      "Reentrenarlo otra vez con los mismos 121 pacientes"
    ],
    "correct": 2,
    "explanation": "Los autores lo califican de prueba de concepto y piden estudios multicéntricos y prospectivos. Un solo centro limita la generalización y la equidad entre poblaciones.",
    "tip": "Exige validación externa y prospectiva antes de decisiones clínicas.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Documentos_Hosp_Alma_Mater_UdeA_Q1_marcador_digital_de_mortalidad_en_neumon_a_con_IA_2026_journal.pdig.0000960.pdf.txt",
      "where": "p.13, Limitations",
      "quote": "Future research must prioritise rigorous external validation across diverse populations"
    }
  },
  {
    "id": "tec-15",
    "kind": "quiz",
    "theme": "scientific_integrity",
    "difficulty": 3,
    "title": "Eventos por variable",
    "prompt": "El estudio tuvo 19 fallecidos y un modelo de 5 predictores (≈4 eventos por variable). ¿Qué riesgo señalan los autores?",
    "options": [
      "Sobreajuste e inestabilidad estadística",
      "Fuga de datos hacia el conjunto de prueba",
      "Exceso de regularización del modelo",
      "Sesgo de confirmación del evaluador"
    ],
    "correct": 0,
    "explanation": "Con pocos eventos por predictor, el modelo memoriza ruido y las asociaciones no replican. Los autores piden al menos 10 eventos por variable en estudios futuros.",
    "tip": "Revisa eventos por variable antes de confiar en un modelo.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Documentos_Hosp_Alma_Mater_UdeA_Q1_marcador_digital_de_mortalidad_en_neumon_a_con_IA_2026_journal.pdig.0000960.pdf.txt",
      "where": "p.12, Limitations",
      "quote": "events-per-variable ≈ 4 for a 5-predictor model), increasing risks of overfitting and statistical instability"
    }
  },
  {
    "id": "tec-16",
    "kind": "checkpoint",
    "theme": "scientific_integrity",
    "difficulty": 2,
    "title": "Redactar el abstract con IA",
    "prompt": "Pides a un LLM un resumen de tu estudio exploratorio (n=121, 19 eventos). Propone 'el marcador predice la mortalidad'. ¿Qué haces?",
    "options": [
      "Lo dejas tal cual, porque suena más contundente",
      "Cambias a 'asociación preliminar a confirmar'",
      "Añades 'significativo' para reforzar el mensaje",
      "Omites las limitaciones por falta de espacio"
    ],
    "correct": 1,
    "explanation": "El diseño solo permite hablar de asociación preliminar. Sobredeclarar con ayuda de IA infla evidencia y puede influir en decisiones clínicas.",
    "tip": "Ajusta el verbo al diseño: asociación, no predicción.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Documentos_Hosp_Alma_Mater_UdeA_Q1_marcador_digital_de_mortalidad_en_neumon_a_con_IA_2026_journal.pdig.0000960.pdf.txt",
      "where": "p.2, Abstract",
      "quote": "all associations are preliminary and hypothesis-generating only"
    }
  },
  {
    "id": "tec-17",
    "kind": "quiz",
    "theme": "scientific_integrity",
    "difficulty": 2,
    "title": "Corrección por comparaciones múltiples",
    "prompt": "Al corregir el análisis ECG por tasa de falsos descubrimientos (BH-FDR), ninguna característica del modelo mixto pasó q<0,05. ¿Qué lección ética extraes?",
    "options": [
      "Ocultar los valores p no corregidos del manuscrito",
      "Reportar las asociaciones que sí fueron significativas",
      "Repetir las pruebas hasta que alguna pase el umbral",
      "Informar la corrección y matizar las conclusiones"
    ],
    "correct": 3,
    "explanation": "Probar muchas variables produce falsos positivos. Los autores declaran la limitación y piden cautela; ocultar la corrección sería selección de resultados.",
    "tip": "Reporta cuántas pruebas hiciste y si corregiste.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Documentos_Hosp_Alma_Mater_UdeA_Q1_marcador_digital_de_mortalidad_en_neumon_a_con_IA_2026_journal.pdig.0000960.pdf.txt",
      "where": "p.12, Limitations",
      "quote": "no feature survived at q<0.05"
    }
  },
  {
    "id": "tec-18",
    "kind": "checkpoint",
    "theme": "privacy_consent",
    "difficulty": 2,
    "title": "Reutilizar historias clínicas",
    "prompt": "Quieres usar un LLM sobre notas clínicas de un hospital para un proyecto de maestría. Los datos eran de atención rutinaria. ¿Qué es lo responsable?",
    "options": [
      "Subirlas a un chatbot público, ya que son simples notas de texto",
      "Pedirle a un colega que las suba por ti a su cuenta",
      "Anonimizar a ojo y subir una muestra pequeña para probar",
      "Obtener aprobación ética y usar datos desidentificados"
    ],
    "correct": 3,
    "explanation": "El estudio contó con comité de ética y dispensa de consentimiento por normativa. Reusar datos clínicos exige aprobación formal y datos desidentificados, no confianza informal.",
    "tip": "No subas datos clínicos a servicios externos sin autorización.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Documentos_Hosp_Alma_Mater_UdeA_Q1_marcador_digital_de_mortalidad_en_neumon_a_con_IA_2026_journal.pdig.0000960.pdf.txt",
      "where": "p.13, Ethics statement",
      "quote": "used retrospective clinical data collected as part of routine care; the ethics committee granted a waiver of informed consent"
    },
    "notes": "El detalle de control de acceso es inferencia; la fuente solo menciona comité, dispensa y datos desidentificados."
  },
  {
    "id": "tec-19",
    "kind": "checkpoint",
    "theme": "health",
    "difficulty": 3,
    "title": "Extracción con reglas o LLM",
    "prompt": "Usarás un extractor automático de notas clínicas en español. Sabes que puede fallar con abreviaturas y negaciones ('sin evidencia de consolidación'). ¿Qué haces?",
    "options": [
      "Confiar porque corrió sin mostrar errores",
      "Validarlo con una muestra revisada por clínicos",
      "Aumentar el tamaño del lote para compensar",
      "Eliminar las notas que contienen negaciones"
    ],
    "correct": 1,
    "explanation": "El propio estudio reconoce que su NLP no resuelve negaciones ni jerga institucional. Sin validación humana, un error de extracción se convierte en dato falso aguas abajo.",
    "tip": "Valida el extractor contra una muestra anotada a mano.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Documentos_Hosp_Alma_Mater_UdeA_Q1_marcador_digital_de_mortalidad_en_neumon_a_con_IA_2026_journal.pdig.0000960.pdf.txt",
      "where": "p.12, Limitations (vi)",
      "quote": "negation contexts (e.g., “no evidence of consolidation”)"
    }
  },
  {
    "id": "tec-20",
    "kind": "quiz",
    "theme": "transparency_explainability",
    "difficulty": 1,
    "title": "El principio añadido",
    "prompt": "Floridi y colegas adaptan los principios de la bioética (beneficencia, no maleficencia, autonomía, justicia). ¿Qué principio añaden para la IA?",
    "options": [
      "Privacidad",
      "Eficiencia",
      "Explicabilidad",
      "Soberanía de datos"
    ],
    "correct": 2,
    "explanation": "La explicabilidad da unidad a los demás principios al volver inteligible el algoritmo y permitir rendición de cuentas social.",
    "tip": "Pide que cada decisión de IA se pueda explicar y atribuir.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Documentos_Theethicsofalgorithmsfromtheperspectiveoftheculturalhistoryofconsciousness-frstlook.pdf.txt",
      "where": "p.3",
      "quote": "Explainability gives unity to the other principles"
    }
  },
  {
    "id": "tec-21",
    "kind": "checkpoint",
    "theme": "education",
    "difficulty": 2,
    "title": "Código que no puedes explicar",
    "prompt": "Entregas un proyecto con código generado por IA y paquetes que no entiendes. Un colega pregunta cómo decide el modelo. ¿Qué es lo responsable?",
    "options": [
      "Decir que es una caja negra y que funciona bien",
      "Revisar y probar cada parte, y declarar el uso",
      "Defender el resultado con las métricas finales",
      "Pedir al asistente que invente una explicación"
    ],
    "correct": 1,
    "explanation": "El artículo describe cómo las dependencias opacas vuelven inexplicables los algoritmos. Entender y declarar el uso de IA sostiene la responsabilidad individual.",
    "tip": "Si no puedes explicar un componente, dilo y verifícalo.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Documentos_Theethicsofalgorithmsfromtheperspectiveoftheculturalhistoryofconsciousness-frstlook.pdf.txt",
      "where": "p.8",
      "quote": "it is increasingly difficult to explain -even for the students themselves- what their algorithm is doing"
    }
  },
  {
    "id": "tec-22",
    "kind": "quiz",
    "theme": "labor_climate_justice",
    "difficulty": 1,
    "title": "Trabajo humano detrás de IA",
    "prompt": "El informe de AI Now sostiene que detrás de la apariencia de automatización hay trabajo humano. ¿De quién habla principalmente?",
    "options": [
      "Anotadores globales mal pagados",
      "Ingenieros con salarios muy altos",
      "Usuarios finales sin intermediarios",
      "Reguladores estatales del sector"
    ],
    "correct": 0,
    "explanation": "La 'magia' de la IA depende de una cadena de extracción ecológica y explotación laboral poco visible.",
    "tip": "Pregunta por el trabajo humano que hay detrás de una herramienta.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Videos_AINow-Climate-Justice-Labor-Report.pdf.txt",
      "where": "p.3, Introduction",
      "quote": "humans, and globally dispersed, poorly paid annotators, are still operating behind AI"
    }
  },
  {
    "id": "tec-23",
    "kind": "fact",
    "theme": "labor_climate_justice",
    "difficulty": 2,
    "title": "Búsqueda con LLM",
    "prompt": "Integrar LLM en buscadores podría multiplicar por hasta cinco las emisiones de carbono de cada búsqueda, según el informe.",
    "tip": "Usa un LLM cuando aporta valor; no por defecto.",
    "board": "snake",
    "grounded": true,
    "source": {
      "file": "Videos_AINow-Climate-Justice-Labor-Report.pdf.txt",
      "where": "p.3, Introduction",
      "quote": "may multiply the carbon emissions associated with each search by as much as five times"
    }
  },
  {
    "id": "tec-24",
    "kind": "checkpoint",
    "theme": "labor_climate_justice",
    "difficulty": 3,
    "title": "Entrenar sin mirar el agua",
    "prompt": "Programas el entrenamiento de un modelo en la hora de menor carbono de tu región. Un colega dice que esa hora gasta más agua. ¿Qué haces?",
    "options": [
      "Eliges por carbono, que es la métrica estándar",
      "Eliges la hora con la electricidad más barata",
      "Sopesas carbono, agua y efectos sociales",
      "Delegas la elección en el proveedor de nube"
    ],
    "correct": 2,
    "explanation": "El informe pide considerar el carbono junto con agua y repercusiones sociales. Medir un solo indicador oculta costes trasladados a comunidades locales.",
    "tip": "Reporta carbono y agua juntos, no solo uno.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Videos_AINow-Climate-Justice-Labor-Report.pdf.txt",
      "where": "p.4",
      "quote": "It is crucial to consider carbon emissions in tandem with other environmental factors, including water use, and social repercussions"
    }
  },
  {
    "id": "tec-25",
    "kind": "checkpoint",
    "theme": "ai_alignment_rl",
    "difficulty": 3,
    "title": "Recompensa mal especificada",
    "prompt": "Entrenas un agente de recomendación por refuerzo con recompensa = tiempo en la app. Sube la métrica, pero los usuarios reportan más agotamiento. ¿Qué haces?",
    "options": [
      "Subes el peso de la recompensa por tiempo",
      "Rediseñas la recompensa y mides bienestar",
      "Culpas a los usuarios atípicos por quejarse",
      "Aumentas la exploración y sigues entrenando"
    ],
    "correct": 1,
    "explanation": "El agente maximiza la recompensa que se le da, no la intención. Si la recompensa es un proxy del bienestar, el agente puede optimizar el proxy en detrimento del objetivo.",
    "tip": "Revisa si la recompensa mide lo que realmente quieres.",
    "board": "ladder",
    "grounded": false,
    "source": {
      "file": "Videos_reinforcement-learning-MY101.pdf.txt",
      "where": "p.2, What is Reinforcement Learning?",
      "quote": "discover which actions yield the most reward"
    },
    "notes": "La fuente solo explica que el agente maximiza recompensa; la idea de recompensa mal especificada es conocimiento externo."
  },
  {
    "id": "tec-26",
    "kind": "quiz",
    "theme": "ai_alignment_rl",
    "difficulty": 1,
    "title": "Qué maximiza el agente",
    "prompt": "En aprendizaje por refuerzo, ¿qué busca maximizar el agente?",
    "options": [
      "La exactitud sobre etiquetas humanas",
      "La recompensa acumulada esperada",
      "La explicabilidad de sus acciones",
      "La diversidad de los datos"
    ],
    "correct": 1,
    "explanation": "El agente aprende de recompensas y ajusta su política para maximizar el retorno. Por eso diseñar bien la recompensa es una decisión con consecuencias éticas.",
    "tip": "Pregunta qué señal optimiza el sistema, no qué intención tiene.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Videos_reinforcement-learning-MY101.pdf.txt",
      "where": "p.3",
      "quote": "The agent’s goal is to maximize its expected return (cumulative reward)"
    }
  },
  {
    "id": "tec-27",
    "kind": "quiz",
    "theme": "ai_alignment_rl",
    "difficulty": 2,
    "title": "Descuento y corto plazo",
    "prompt": "Con factor de descuento gamma cercano a 0, ¿cómo se comporta un agente de refuerzo?",
    "options": [
      "Prioriza recompensas inmediatas",
      "Prioriza recompensas a largo plazo",
      "Ignora la recompensa por completo",
      "Explora siempre al azar"
    ],
    "correct": 0,
    "explanation": "Gamma cero valora solo la recompensa presente; esto muestra cómo un diseño miope puede sacrificar el largo plazo.",
    "tip": "Pregunta si el horizonte de la recompensa coincide con tu objetivo.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Videos_reinforcement-learning-MY101.pdf.txt",
      "where": "p.5, Markov decision processes",
      "quote": "When γ equals 0, this implies that we only care about present rewards"
    },
    "notes": "Conexión con alineación es inferencia pedagógica."
  },
  {
    "id": "tec-28",
    "kind": "checkpoint",
    "theme": "safety_security",
    "difficulty": 3,
    "title": "Elegir modelo por leaderboard",
    "prompt": "Para resumir historias clínicas, tu equipo elige el LLM con mejor puntuación en un benchmark general. ¿Qué es lo responsable?",
    "options": [
      "Aprobarlo: un buen benchmark general prueba idoneidad",
      "Pedir al proveedor un certificado de seguridad general",
      "Definir requisitos y probarlo con casos del dominio",
      "Probarlo con diez ejemplos al azar y desplegar"
    ],
    "correct": 2,
    "explanation": "El artículo critica sustituir la verificación y validación específicas del uso por evaluaciones generales. La idoneidad solo se demuestra para un contexto concreto.",
    "tip": "Evalúa con casos de tu dominio, no solo con rankings.",
    "board": "ladder",
    "grounded": true,
    "source": {
      "file": "Videos_2504.15088v1.pdf.txt",
      "where": "p.11",
      "quote": "safety-critical and defense systems cannot be substantiated without application-specific requirements"
    },
    "notes": "El artículo trata de IA militar; se extrapola el principio a contextos críticos civiles."
  },
  {
    "id": "tec-29",
    "kind": "quiz",
    "theme": "safety_security",
    "difficulty": 2,
    "title": "Verificación vs. validación",
    "prompt": "En TEVV (Test & Evaluation, Validation & Verification), ¿qué hace la validación?",
    "options": [
      "Comprueba que el código compile sin errores",
      "Mide la velocidad de respuesta del sistema",
      "Confirma que cumple su propósito en su entorno",
      "Comprueba que el sistema es de código abierto"
    ],
    "correct": 2,
    "explanation": "La verificación confirma que se cumple la especificación; la validación, que el sistema cumple su propósito en el entorno operativo sin riesgo inaceptable.",
    "tip": "Distingue 'cumple la especificación' de 'sirve para su uso real'.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Videos_2504.15088v1.pdf.txt",
      "where": "p.10",
      "quote": "validation confirms that the system fulfills its intended purpose in its operational environment without causing unacceptable risk"
    }
  },
  {
    "id": "tec-30",
    "kind": "checkpoint",
    "theme": "data_quality",
    "difficulty": 2,
    "title": "Transcripción en otro idioma",
    "prompt": "Usarás un modelo de IA para transcribir y traducir entrevistas en una lengua poco representada en sus datos. ¿Qué haces antes de analizar?",
    "options": [
      "Confiar en el modelo porque es multilingüe",
      "Trabajar con la traducción al inglés como base",
      "Verificar una muestra con hablantes nativos",
      "Descartar las entrevistas dudosas sin informar"
    ],
    "correct": 2,
    "explanation": "El artículo documenta mala precisión en idiomas no ingleses con consecuencias graves. Medir el error en tu idioma evita decisiones basadas en transcripciones falsas.",
    "tip": "Mide el error del modelo en el idioma de tus datos.",
    "board": "any",
    "grounded": true,
    "source": {
      "file": "Videos_2504.15088v1.pdf.txt",
      "where": "p.12",
      "quote": "poor accuracy with non-English languages, especially for Arabic"
    },
    "notes": "Contexto del artículo es militar; la tarjeta extrapola a investigación."
  }
]);


const CARDS_BY_ID = new Map(CARDS.map((c) => [c.id, c]));

export function getCardById(id) {
  return CARDS_BY_ID.get(id) ?? null;
}

/**
 * Selecciona una tarjeta de desafío (checkpoint o quiz) para una serpiente o escalera.
 * Prioriza preguntas del tema del enlace que no hayan sido usadas en la partida.
 *
 * @param {'ladder'|'snake'} jumpKind
 * @param {number} jumpFrom
 * @param {Set<string>} [usedIds]
 * @returns {object} tarjeta seleccionada
 */
export function getChallengeForJump(jumpKind, jumpFrom, usedIds = new Set()) {
  const jumpKey = jumpKind + "-" + jumpFrom;
  const theme = JUMP_THEMES[jumpKey];

  // Pool de preguntas (checkpoint o quiz con 4 opciones)
  const pool = CARDS.filter((c) => c.kind === 'checkpoint' || c.kind === 'quiz');

  // 1. Coincidencia exacta de tema y no usada
  const matchingThemeUnused = pool.filter((c) => c.theme === theme && !usedIds.has(c.id));
  if (matchingThemeUnused.length > 0) {
    const idx = Math.floor(Math.random() * matchingThemeUnused.length);
    return matchingThemeUnused[idx];
  }

  // 2. Coincidencia de tablero ('ladder'/'snake') no usada
  const matchingBoardUnused = pool.filter((c) => c.board === jumpKind && !usedIds.has(c.id));
  if (matchingBoardUnused.length > 0) {
    const idx = Math.floor(Math.random() * matchingBoardUnused.length);
    return matchingBoardUnused[idx];
  }

  // 3. Cualquier pregunta no usada
  const anyUnused = pool.filter((c) => !usedIds.has(c.id));
  if (anyUnused.length > 0) {
    const idx = Math.floor(Math.random() * anyUnused.length);
    return anyUnused[idx];
  }

  // 4. Si se agotaron todas las 98 preguntas, reciclamos del tema
  const matchingTheme = pool.filter((c) => c.theme === theme);
  if (matchingTheme.length > 0) {
    return matchingTheme[Math.floor(Math.random() * matchingTheme.length)];
  }

  // 5. Fallback general
  return pool[Math.floor(Math.random() * pool.length)];
}
