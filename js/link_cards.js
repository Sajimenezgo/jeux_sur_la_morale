export const LINK_CARDS = {
  'ladder-4': {
    title: 'Limpieza de datos',
    lesson: 'Depurar errores e inconsistencias en origen evita decisiones automatizadas erróneas que perjudican a personas reales.',
    tip: 'Documenta cada regla de imputación y exclusión antes de entrenar el modelo.'
  },
  'ladder-13': {
    title: 'Validación cruzada',
    lesson: 'Evaluar el modelo en particiones independientes garantiza que su rendimiento sea fiable fuera de la muestra de ajuste.',
    tip: 'Estratifica los pliegues respetando la estructura temporal y demográfica de los datos.'
  },
  'ladder-33': {
    title: 'Ingeniería de variables',
    lesson: 'Construir predictores con significado de dominio reduce la dependencia de variables proxy correlacionadas con atributos protegidos.',
    tip: 'Verifica que ninguna variable derivada actúe como proxy de atributos demográficos protegidos.'
  },
  'ladder-42': {
    title: 'Explicabilidad del modelo',
    lesson: 'Hacer trazables los factores de una predicción permite detectar criterios injustos y garantiza el derecho a impugnar decisiones.',
    tip: 'Acompaña las predicciones críticas con atribuciones locales como SHAP o contrafactuales.'
  },
  'ladder-50': {
    title: 'Revisión por pares',
    lesson: 'Someter código y supuestos al escrutinio técnico independiente descubre puntos ciegos metodológicos y riesgos éticos antes de producción.',
    tip: 'Incluye una lista de verificación de sesgos y fugas en cada revisión de código.'
  },
  'ladder-62': {
    title: 'Datos representativos',
    lesson: 'Reflejar la diversidad real de la población objetivo evita que el sistema degrade su precisión en grupos históricamente subrepresentados.',
    tip: 'Compara las distribuciones demográficas del conjunto de entrenamiento con el censo poblacional.'
  },
  'ladder-74': {
    title: 'Auditoría de equidad',
    lesson: 'Medir las tasas de error desagregadas por subgrupos expone disparidades sistemáticas que las métricas globales ocultan.',
    tip: 'Evalúa paridad de tasas de falsos positivos y falsos negativos entre grupos protegidos.'
  },
  'snake-27': {
    title: 'Fuga de datos',
    lesson: 'Incluir información del objetivo en el entrenamiento infla artificialmente las métricas y provoca fallos graves al operar en producción.',
    tip: 'Ajusta transformaciones y escaladores únicamente sobre el subconjunto de entrenamiento.'
  },
  'snake-40': {
    title: 'Sobreajuste del modelo',
    lesson: 'Memorizar el ruido muestral impide generalizar, generando decisiones erráticas y poco fiables ante casos reales no vistos.',
    tip: 'Aplica regularización y monitorea la brecha entre el error de entrenamiento y validación.'
  },
  'snake-43': {
    title: 'Sesgo de muestreo',
    lesson: 'Entrenar con una muestra recolectada de forma no aleatoria distorsiona las inferencias y excluye sistemáticamente a ciertos sectores.',
    tip: 'Analiza el mecanismo de selección y aplica pesos de muestreo inversos cuando corresponda.'
  },
  'snake-54': {
    title: 'Manipulación de significancia',
    lesson: 'Probar múltiples hipótesis hasta hallar un valor p significativo fabrica hallazgos falsos que desvían recursos y políticas públicas.',
    tip: 'Prerregistra las hipótesis y aplica correcciones por comparaciones múltiples como Bonferroni.'
  },
  'snake-66': {
    title: 'Correlación espuria',
    lesson: 'Confundir una asociación casual con un vínculo causal lleva a intervenciones ineficaces o dañinas sobre las personas afectadas.',
    tip: 'Formula un grafo causal explícito para identificar variables de confusión antes de modelar.'
  },
  'snake-76': {
    title: 'Sesgo algorítmico',
    lesson: 'Aprender patrones históricos discriminatorios reproduce y amplifica desigualdades estructurales a escala automatizada.',
    tip: 'Audita las predicciones con métricas de impacto dispar antes de autorizar el despliegue.'
  },
  'snake-89': {
    title: 'Caja negra sin auditar',
    lesson: 'Desplegar modelos opacos sin evaluación externa impide detectar fallos sistemáticos y diluye la responsabilidad ante daños.',
    tip: 'Exige tarjetas de modelo documentadas y pruebas de estrés independientes previo al lanzamiento.'
  },
  'snake-99': {
    title: 'Despliegue sin consentimiento',
    lesson: 'Utilizar datos personales o intervenir sobre usuarios sin su autorización informada vulnera la autonomía y los derechos fundamentales.',
    tip: 'Obtén consentimiento granular e implementa mecanismos claros de exclusión voluntaria.'
  }
};
