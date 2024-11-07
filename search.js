const fs = require('fs');
const tf = require('@tensorflow/tfjs');  // Usar tfjs, no tfjs-node
const use = require('@tensorflow-models/universal-sentence-encoder');

// Documentos
const documents = ['Texto del documento 1', 'Texto del documento 2', 'Texto del documento 3'];
const docVectors = JSON.parse(fs.readFileSync('document_vectors.json'));  // Cargar los vectores de documentos

// Calcular la similitud de coseno
function cosineSimilarity(vec1, vec2) {
  const dotProduct = tf.dot(vec1, vec2).arraySync();  // Producto punto
  const normVec1 = tf.norm(vec1).arraySync();  // Norma de vec1
  const normVec2 = tf.norm(vec2).arraySync();  // Norma de vec2
  return dotProduct / (normVec1 * normVec2);  // Similitud de coseno
}

// Realizar la búsqueda
async function searchQuery(query) {
  const model = await use.load();  // Cargar el modelo de Universal Sentence Encoder
  const queryEmbedding = await model.embed(query);  // Obtener el vector de la consulta (embedding)

  let highestSimilarity = 0;
  let bestMatch = '';

  // Comparar la consulta con cada documento
  for (const [index, docVectorArray] of docVectors.entries()) {
    const docVector = tf.tensor(docVectorArray);  // Convertir el vector del documento en un tensor
    const similarity = cosineSimilarity(queryEmbedding, docVector);  // Calcular similitud

    // Encontrar el documento más similar
    if (similarity > highestSimilarity) {
      highestSimilarity = similarity;
      bestMatch = `Documento ${index + 1}: ${documents[index]}`;
    }
  }

  // Mostrar el mejor resultado
  console.log(`Best match: ${bestMatch} con similitud: ${highestSimilarity}`);
}

// Ejecutar búsqueda con un query
searchQuery('Texto relacionado con documento 1');
