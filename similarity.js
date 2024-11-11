// similarity.js

const { HfInference } = require('@huggingface/inference');
const { MilvusClient } = require('@zilliz/milvus2-sdk-node');
require('dotenv').config();

const hfToken = process.env.HF_TOKEN || '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'; // Asegúrate de que este valor esté en tu archivo .env
const hf = new HfInference(hfToken); // Define la instancia de HfInference

// Conexión a Milvus
const client = new MilvusClient({
  address: 'localhost:19530', // Dirección del servidor Milvus
});

// Función para cargar la colección en memoria
async function cargarColeccion() {
  try {
    console.log('Cargando la colección en memoria...');
    const loadResult = await client.loadCollection({
      collection_name: 'colleccionIA',
    });
    if (loadResult.status.error_code === 0) {
      console.log('Colección cargada en memoria correctamente.');
    } else {
      console.error('Error al cargar la colección en memoria:', loadResult.status);
    }
  } catch (error) {
    console.error('Error al cargar la colección:', error.message);
  }
}

// Función para ajustar el tamaño del embedding
function ajustarEmbedding(embedding) {
  const targetLength = 384;

  if (embedding.length > targetLength) {
    return embedding.slice(0, targetLength); // Recortar si es mayor a 384
  } else if (embedding.length < targetLength) {
    const padding = new Array(targetLength - embedding.length).fill(0);
    return embedding.concat(padding); // Rellenar con ceros si es menor a 384
  }

  return embedding; // Si ya tiene 384, devolverlo tal cual
}

// Función para realizar la búsqueda de los embeddings más cercanos
async function realizarBusqueda(queryText) {
  try {
    // Asegurarse de que la colección esté cargada
    await cargarColeccion();

    // Generar el embedding para el texto de consulta
    console.log('Generando embedding para la consulta...');
    const response = await hf.featureExtraction({
      model: 'sentence-transformers/all-MiniLM-L6-v2', // Modelo preentrenado de Hugging Face
      inputs: [queryText],
    });

    let queryEmbedding = response[0]; // El primer resultado es el embedding

    // Ajustar la dimensión del embedding a 384
    queryEmbedding = ajustarEmbedding(queryEmbedding);

    console.log('Realizando búsqueda en Milvus...');
    // Realizar la búsqueda en Milvus utilizando el embedding ajustado
    const searchResults = await client.search({
      collection_name: 'colleccionIA', // Nombre de la colección
      query_records: [queryEmbedding], // El embedding de la consulta
      top_k: 5, // Número de resultados más cercanos que deseas obtener
      params: { nprobe: 10 },
    });

    console.log('Resultados de la búsqueda:', searchResults);

    // Procesar y mostrar los resultados
    if (searchResults.status.error_code === 0) {
      const hits = searchResults.data[0].hits; // Obtener los hits (resultados)
      if (hits.length > 0) {
        hits.forEach(hit => {
          console.log(`ID: ${hit.id}, Score: ${hit.score}`);
        });
      } else {
        console.log('No se encontraron resultados.');
      }
    } else {
      console.error('Error al realizar la búsqueda en Milvus:', searchResults.status);
    }
  } catch (error) {
    console.error('Error al realizar la búsqueda:', error.message);
  }
}

module.exports = { realizarBusqueda };
