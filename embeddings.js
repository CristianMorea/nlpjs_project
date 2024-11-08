const fs = require('fs');
const path = require('path');
const { HfInference } = require('@huggingface/inference');
require('dotenv').config();

const hfToken = process.env.HF_TOKEN || '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';
const hf = new HfInference(hfToken);

// Ruta de los documentos y archivo de salida
const carpetaArchivos = path.join(__dirname, 'doocumentos');
const archivoSalida = path.join(__dirname, 'document_vectors.json');

// Leer archivos y generar embeddings
async function generarEmbeddingsDeArchivos() {
  try {
    const archivos = fs.readdirSync(carpetaArchivos).filter(file => file.endsWith('.txt'));
    const embeddingsData = {};

    for (const archivo of archivos) {
      const rutaArchivo = path.join(carpetaArchivos, archivo);
      const contenidoArchivo = fs.readFileSync(rutaArchivo, 'utf-8');

      const response = await hf.featureExtraction({
        model: 'sentence-transformers/all-MiniLM-L6-v2',
        inputs: [contenidoArchivo],
      });

      embeddingsData[archivo] = response;
      console.log(`Embeddings generados para ${archivo}`);
    }

    // Guardar los embeddings en un archivo JSON
    fs.writeFileSync(archivoSalida, JSON.stringify(embeddingsData, null, 2));
    console.log(`Embeddings guardados en ${archivoSalida}`);
  } catch (error) {
    console.error('Error al generar embeddings:', error.message);
  }
}

module.exports = { generarEmbeddingsDeArchivos };
