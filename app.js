// app.js
const { generarEmbeddingsDeArchivos } = require('./embeddings');
const { realizarBusqueda } = require('./similarity');

// Función principal para controlar el flujo
(async () => {
  try {
    // Generar los embeddings de los documentos
    console.log('Generando embeddings...');
    await generarEmbeddingsDeArchivos();
    console.log('Embeddings generados y guardados.');

    // Texto de ejemplo para realizar la búsqueda (esto lo puedes cambiar según lo que necesites)
    const queryText = "PROYECTO INTEGRADOR PROFESIONAL FACULTAD DE INGENIERÍA PLATAFORMA DIGITAL PARA LA PRESERVACIÓN CULTURAL Y LINGÜÍSTICA DEL PUEBLO NASA DE TACUEYO CAUCA DESCRIPCIÓN DE LA IDEA Proponer una herramienta digital que permita conservar, documentar y difundir la rica herencia tradicional y cultural del pueblo nasa. Esta propuesta busca abordar la urgente necesidad de preservar la lengua nasa yuwe, las historias orales y las tradiciones ancestrales mediante el uso de tecnologías modernas. RELACIÓN CON EL CONTEXTO GLOBAL Y NACIONAL Esta propuesta tiene un impacto positivo en varios Objetivos de Desarrollo Sostenible de la ONU: ●ODS 4: Educación de Calidad ○Por qué: La plataforma incluirá un módulo de aprendizaje de la lengua Nasa Yuwe y recursos educativos que promoverán la educación intercultural y el acceso a conocimientos ancestrales, mejorando la educación de calidad dentro de la comunidad y para el público general. ●ODS 11: Ciudades y Comunidades Sostenibles ○Por qué: Al preservar y promover la cultura local, la plataforma contribuirá a la sostenibilidad cultural y social de las comunidades, fortaleciendo su identidad y cohesión social. ●ODS 16: Paz, Justicia e Instituciones Sólidas ○Por qué: La preservación cultural y la promoción de la identidad indígena pueden contribuir a la estabilidad social y la paz al reducir las tensiones y mejorar el entendimiento intercultural. ● ODS 17: Alianzas para Lograr los Objetivos ○Por qué: El desarrollo de la plataforma requerirá colaboración entre diversos actores, incluyendo la comunidad Nasa, desarrolladores, académicos y organizaciones no gubernamentales, fortaleciendo las alianzas para el desarrollo cultural y tecnológico. OBJETIVOS Objetivo General: •Proponer un sistema integral para la preservación y difusión del conocimiento cultural y lingüístico del pueblo Nasa originario de Tacueyo cauca. Objetivos Específicos: •Diseñar un módulo interactivo para aprender Nasa Yuwe con lecciones de vocabulario, gramática y comprensión oral, apoyado por recursos multimedia. •Diseñar una base de datos de historias orales y tradiciones del pueblo Nasa, narradas por ancianos, para que la misma comunidad documente ceremonias tradicionales con registros multimedia y un calendario de eventos. •Diseñar un mapa digital interactivo de sitios culturales importantes con descripciones y contenido multimedia PLANTEAMIENTO DEL PROBLEMA El pueblo nasa de Tacueyo, ubicado en el Cauca exactamente en la zona norte del departamento. Es una comunidad con una herencia cultural profunda y valiosa que incluye la lengua nasa yuwe, historias orales, ceremonias culturales y sitios tradicionales significativos. Sin embargo, en el contexto actual, la rica cultura del pueblo nasa a menudo queda eclipsada por narrativas centradas en violencia, presencia de grupos armados y cultivos ilícitos en la región que han ensuciado el nombre de la región. PREGUNTA DE INVESTIGACIÓN ¿Cómo puede una plataforma digital optimizar la preservación y transmisión del conocimiento cultural y lingüístico del pueblo nasa de Tacueyo; y qué impacto tiene en la participación de la comunidad y el aprendizaje intergeneracional? JUSTIFICACIÓN Una plataforma digital puede optimizar significativamente la preservación y transmisión del conocimiento cultural y lingüístico del pueblo Nasa al proporcionar un medio accesible y estructurado para la recopilación, conservación y difusión de su patrimonio. La plataforma facilita el aprendizaje del nasa yuwe a través de módulos interactivos que incluyen ejercicios de vocabulario, gramática";
    
    // Realizar la búsqueda de embeddings más cercanos
    console.log('Realizando búsqueda...');
    await realizarBusqueda(queryText);
    console.log('Búsqueda completada.');

  } catch (error) {
    console.error("Error en el flujo de la aplicación:", error.message);
  }
})();
