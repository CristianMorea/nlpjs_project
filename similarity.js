const { client } = require('./milvusClient'); // Importa el cliente Milvus
const { generarEmbedding } = require('./embedder'); // Importa la función para generar embeddings

// Realiza una búsqueda de similitud en Milvus
async function realizarBusqueda(queryText) {
  try {
    // Genera el embedding para el texto de consulta
    const queryEmbedding = await generarEmbedding(queryText);

    if (!queryEmbedding || queryEmbedding.length !== 384) {
      console.error('Error: el embedding generado es inválido o no tiene la longitud requerida de 384.');
      return null;
    }

    // Configuración de la consulta
    const searchParams = {
      collection_name: 'colleccionIA',
      vector: [queryEmbedding],  // Embedding del texto de consulta
      anns_field: 'embedding',   // Campo de la colección donde están los embeddings
      topk: 5,                   // Número de resultados más similares a devolver
      metric_type: 'L2',         // Tipo de métrica de similitud (L2 es distancia euclidiana)
      params: { nprobe: 10 },    // Parámetros específicos del índice
      output_fields: ['id', 'text'] // Campos a incluir en los resultados
    };

    // Realiza la consulta de similitud en Milvus
    const searchResults = await client.search(searchParams);

    // Muestra y devuelve los resultados
    if (searchResults && searchResults.results) {
      console.log('Resultados de la búsqueda de similitud:', searchResults.results);
      return searchResults.results;
    } else {
      console.log('No se encontraron resultados para la consulta.');
      return null;
    }
  } catch (error) {
    console.error('Error en la búsqueda de similitud:', error.message);
    throw error;
  }
}

module.exports = { realizarBusqueda };
