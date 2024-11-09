const fs = require('fs');
const tf = require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');

// Cargar los vectores de documentos desde el archivo JSON
const docVectors = JSON.parse(fs.readFileSync('document_vectors.json'));

// Función para calcular la similitud de coseno
function cosineSimilarity(vec1, vec2) {
  vec1 = vec1.reshape([vec1.shape[0]]);
  vec2 = vec2.reshape([vec2.shape[0]]);
  
  const dotProduct = tf.dot(vec1, vec2).arraySync();  // Producto punto
  const normVec1 = tf.norm(vec1).arraySync();  // Norma de vec1
  const normVec2 = tf.norm(vec2).arraySync();  // Norma de vec2
  return dotProduct / (normVec1 * normVec2);  // Similitud de coseno
}

// Función de búsqueda con una consulta de texto
async function searchQuery(query) {
  const model = await use.load();  // Cargar el modelo de Universal Sentence Encoder
  const queryEmbedding = await model.embed(query);  // Obtener el vector de la consulta (embedding)

  let queryTensor = queryEmbedding.reshape([queryEmbedding.shape[1]]);
  if (queryTensor.shape[0] !== 512) {
    queryTensor = tf.pad(queryTensor, [[0, 512 - queryTensor.shape[0]]]);
  }

  let highestSimilarity = -1;  // Comenzamos con una similitud baja
  let bestMatchText = '';
  let bestMatchEmbedding = null;

  // Iterar sobre los documentos y fragmentos almacenados
  for (const [docName, docVectorArray] of Object.entries(docVectors)) {
    for (const docVectorData of docVectorArray) {
      const { texto, embedding } = docVectorData;  // Extraer el texto y el embedding

      let docTensor = tf.tensor(embedding);
      if (docTensor.shape[0] !== 512) {
        docTensor = tf.pad(docTensor, [[0, 512 - docTensor.shape[0]]]);
      }

      const similarity = cosineSimilarity(queryTensor, docTensor);
      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        bestMatchText = texto;  // Guardar el texto del fragmento con mayor similitud
        bestMatchEmbedding = embedding;  // Guardar el embedding más cercano
      }
    }
  }

  console.log(`Mejor coincidencia: ${bestMatchText} con similitud: ${highestSimilarity}`);
  return { bestMatchText, bestMatchEmbedding };  // Devolver tanto el texto como el embedding
}

module.exports = { searchQuery };
