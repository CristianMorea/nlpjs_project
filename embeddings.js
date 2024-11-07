const fs = require('fs');
const path = require('path');
const { HfInference } = require('@huggingface/inference');
require('dotenv').config();

const hfToken = process.env.HF_TOKEN || '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';
const hf = new HfInference(hfToken);

// Carpeta donde se encuentran los archivos .txt
const carpetaArchivos = path.join(__dirname, 'doocumentos');

// Archivo de salida para almacenar los embeddings
const archivoSalida = path.join(__dirname, 'document_vectors.json');

// Leer archivos .txt y generar embeddings
async function generarEmbeddingsDeArchivos() {
  try {
    // Leer todos los archivos de la carpeta
    const archivos = fs.readdirSync(carpetaArchivos).filter(file => file.endsWith('.txt'));

    // Crear un objeto para almacenar los embeddings
    const embeddingsData = {};

    // Iterar sobre cada archivo
    for (const archivo of archivos) {
      const rutaArchivo = path.join(carpetaArchivos, archivo);

      // Leer el contenido del archivo
      const contenidoArchivo = fs.readFileSync(rutaArchivo, 'utf-8');

      // Generar los embeddings para el contenido del archivo
      const response = await hf.featureExtraction({
        model: 'sentence-transformers/all-MiniLM-L6-v2',
        inputs: [contenidoArchivo],
      });

      // Almacenar los embeddings en el objeto
      embeddingsData[archivo] = response;

      console.log(`Embeddings generados para ${archivo}`);
    }

    // Escribir los embeddings en un archivo JSON
    fs.writeFileSync(archivoSalida, JSON.stringify(embeddingsData, null, 2));

    console.log(`Embeddings guardados en ${archivoSalida}`);
  } catch (error) {
    console.error('Error al generar embeddings:', error.message);
  }
}

generarEmbeddingsDeArchivos();

