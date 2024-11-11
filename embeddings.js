const path = require('path');
const fs = require('fs');
const { procesarArchivo, generarEmbedding } = require('./embedder');
const { ensureCollectionExists, insertInMilvus } = require('./milvusClient');

const carpetaArchivos = path.join(__dirname, 'documentos');
const collectionName = 'colleccionIA';

async function generarEmbeddingsDeArchivos() {
  try {
    await ensureCollectionExists(collectionName); // Verifica si la colección existe

    const archivos = fs.readdirSync(carpetaArchivos).filter(file => file.endsWith('.txt') || file.endsWith('.pdf'));

    for (const archivo of archivos) {
      const rutaArchivo = path.join(carpetaArchivos, archivo);
      const fragmentos = await procesarArchivo(rutaArchivo); // Divide el contenido del archivo en fragmentos

      const embeddings = [];
      const textos = [];

      for (const fragmento of fragmentos) {
        const embedding = await generarEmbedding(fragmento); // Genera el embedding para cada fragmento
        if (embedding && embedding.length === 384) { // Verifica que el embedding tenga la longitud correcta
          embeddings.push(embedding);
          textos.push(fragmento); // Asegúrate de almacenar el texto también
        }
      }

      // Verificar que tanto textos como embeddings tengan la misma cantidad de elementos
      if (embeddings.length === textos.length) {
        const embeddingsConTexto = embeddings.map((embedding, index) => ({
          id: Date.now() + index,  // Genera un ID único
          text: textos[index],     // Asocia el texto con su embedding
          embedding,               // El embedding correspondiente
        }));

        if (embeddingsConTexto.length) {
          const insertResponse = await insertInMilvus(collectionName, embeddingsConTexto); // Inserta los embeddings y textos en Milvus
          console.log(`Embeddings insertados correctamente para ${archivo}:`, insertResponse); // Log completo de la respuesta
        } else {
          console.log(`No se generaron embeddings válidos para ${archivo}`);
        }
      } else {
        console.log(`La cantidad de textos y embeddings no coinciden para ${archivo}`);
      }
    }
  } catch (error) {
    console.error('Error al generar e insertar embeddings:', error.message);
  }
}


module.exports = { generarEmbeddingsDeArchivos };
