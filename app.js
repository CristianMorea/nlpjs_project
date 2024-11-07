const fs = require('fs');
const path = require('path');
const { HfInference } = require('@huggingface/inference');
const { containerBootstrap } = require('@nlpjs/core');
const { Nlp } = require('@nlpjs/nlp');
const { LangEn } = require('@nlpjs/lang-en');
require('dotenv').config();
const tf = require('@tensorflow/tfjs');  // Usar tfjs, no tfjs-node
const use = require('@tensorflow-models/universal-sentence-encoder');

// Configuración del token de HuggingFace
const hfToken = process.env.HF_TOKEN || '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';
const hf = new HfInference(hfToken);

// Ruta de documentos y archivo de salida de embeddings
const carpetaArchivos = path.join(__dirname, 'doocumentos');  // Ajusta esta ruta según corresponda
const archivoSalida = path.join(__dirname, 'document_vectors.json');

// Iniciar NLP.js
(async () => {
  // Configuración y carga del contenedor NLP.js
  const container = await containerBootstrap();
  container.use(Nlp);
  container.use(LangEn);
  const nlp = container.get('nlp');
  nlp.settings.autoSave = false;
  nlp.addLanguage('en');
  await nlp.train(); // Entrenar el modelo NLP.js
  
  // Cargar los embeddings de documentos generados previamente
  const docVectors = JSON.parse(fs.readFileSync(archivoSalida));
  
  // Función de similitud de coseno entre dos vectores
  function cosineSimilarity(vec1, vec2) {
    vec1 = vec1.reshape([vec1.shape[0]]);
    vec2 = vec2.reshape([vec2.shape[0]]);
    const dotProduct = tf.dot(vec1, vec2).arraySync();
    const normVec1 = tf.norm(vec1).arraySync();
    const normVec2 = tf.norm(vec2).arraySync();
    return dotProduct / (normVec1 * normVec2);
  }

  // Función para realizar búsqueda en los documentos usando una consulta
  async function searchQuery(query) {
    // Procesar la consulta con NLP.js
    const nlpResponse = await nlp.process('en', query);
    const processedQuery = nlpResponse.answer || query;  // Si hay una respuesta procesada, usarla

    // Generar el embedding de la consulta utilizando Universal Sentence Encoder
    const model = await use.load();
    const queryEmbedding = await model.embed(processedQuery);
    let queryTensor = queryEmbedding.reshape([queryEmbedding.shape[1]]);
    
    // Asegurarse de que la consulta tenga 512 dimensiones
    if (queryTensor.shape[0] !== 512) {
      queryTensor = tf.pad(queryTensor, [[0, 512 - queryTensor.shape[0]]]);
    }

    let highestSimilarity = 0;
    let bestMatch = '';

    // Comparar la consulta con cada documento usando similitud de coseno
    for (const [docName, docVectorArray] of Object.entries(docVectors)) {
      let docVector = tf.tensor(docVectorArray[0]);
      
      // Asegurarse de que los vectores de los documentos tengan 512 dimensiones
      if (docVector.shape[0] !== 512) {
        docVector = tf.pad(docVector, [[0, 512 - docVector.shape[0]]]);
      }

      // Calcular la similitud de coseno
      const similarity = cosineSimilarity(queryTensor, docVector);

      // Mantener el documento con la mayor similitud
      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        bestMatch = `Documento: ${docName}`;
      }
    }

    // Mostrar el resultado de la búsqueda
    console.log(`Mejor coincidencia: ${bestMatch} con similitud: ${highestSimilarity}`);
  }

  // Ejecutar la búsqueda con una consulta de ejemplo
  await searchQuery('Artificial Intelligence is transforming industries');
})();
