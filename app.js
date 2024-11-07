// app.js
const { containerBootstrap } = require('@nlpjs/core');
const { Nlp } = require('@nlpjs/nlp');
const { LangEn } = require('@nlpjs/lang-en');  // Corregido para usar el paquete correcto

(async () => {
  // Iniciar el contenedor de NLP.js
  const container = await containerBootstrap();
  
  // Usar las clases necesarias
  container.use(Nlp);
  container.use(LangEn);
  
  // Obtener la instancia de Nlp
  const nlp = container.get('nlp');
  
  // Configuración de NLP.js
  nlp.settings.autoSave = false;  // Desactiva el guardado automático
  
  // Agregar el idioma
  nlp.addLanguage('en');

  // Añadir documentos e intenciones
  nlp.addDocument('en', 'goodbye for now', 'greetings.bye');
  nlp.addDocument('en', 'bye bye take care', 'greetings.bye');
  nlp.addDocument('en', 'okay see you later', 'greetings.bye');
  nlp.addDocument('en', 'bye for now', 'greetings.bye');
  nlp.addDocument('en', 'i must go', 'greetings.bye');
  nlp.addDocument('en', 'hello', 'greetings.hello');
  nlp.addDocument('en', 'hi', 'greetings.hello');
  nlp.addDocument('en', 'howdy', 'greetings.hello');
  
  // Agregar respuestas para la NLG (Generación de Lenguaje Natural)
  nlp.addAnswer('en', 'greetings.bye', 'Till next time');
  nlp.addAnswer('en', 'greetings.bye', 'See you soon!');
  nlp.addAnswer('en', 'greetings.hello', 'Hey there!');
  nlp.addAnswer('en', 'greetings.hello', 'Greetings!');

  // Entrenar el modelo NLPa
  await nlp.train();

  // Procesar una consulta
  const response = await nlp.process('en', 'I should go now');
  
  // Mostrar la respuesta
  console.log(response);
})();
