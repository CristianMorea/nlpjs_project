const fs = require('fs');
const tf = require('@tensorflow/tfjs');  // Usar tfjs, no tfjs-node
const use = require('@tensorflow-models/universal-sentence-encoder');

// Cargar los vectores de documentos desde un archivo JSON
const docVectors = JSON.parse(fs.readFileSync('document_vectors.json'));

// Calcular la similitud de coseno entre dos vectores
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

  // Convertir queryEmbedding en tensor de una sola dimensión
  let queryTensor = queryEmbedding.reshape([queryEmbedding.shape[1]]);
  
  // Aquí asumimos que los vectores de documentos tienen 512 dimensiones
  // Aseguramos que el tamaño de la consulta sea el mismo
  if (queryTensor.shape[0] !== 512) {
    queryTensor = tf.pad(queryTensor, [[0, 512 - queryTensor.shape[0]]]);
  }

  let highestSimilarity = 0;
  let bestMatch = '';

  // Iterar sobre los vectores de los documentos
  for (const [docName, docVectorArray] of Object.entries(docVectors)) {
    let docVector = tf.tensor(docVectorArray[0]);  // Obtener el vector del documento

    // Aseguramos que el vector del documento tenga 512 dimensiones
    if (docVector.shape[0] !== 512) {
      docVector = tf.pad(docVector, [[0, 512 - docVector.shape[0]]]);
    }

    // Calcular la similitud de coseno entre la consulta y el documento
    const similarity = cosineSimilarity(queryTensor, docVector);

    // Encontrar el documento más similar
    if (similarity > highestSimilarity) {
      highestSimilarity = similarity;
      bestMatch = `Documento: ${docName}`;
    }
  }

  // Mostrar el mejor resultado
  console.log(`Mejor coincidencia: ${bestMatch} con similitud: ${highestSimilarity}`);
}

// Ejecutar búsqueda con un ejemplo de consulta
searchQuery('Artificial Intelligence is transforming industries');
