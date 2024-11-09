//embeddings.js

const fs = require('fs');
const path = require('path');
const { HfInference } = require('@huggingface/inference');
const pdfParse = require('pdf-parse');
require('dotenv').config();

const hfToken = process.env.HF_TOKEN || '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';
const hf = new HfInference(hfToken);

// Ruta de los documentos y archivo de salida
const carpetaArchivos = path.join(__dirname, 'documentos');
const archivoSalida = path.join(__dirname, 'document_vectors.json');

// Función para limpiar el contenido (puedes ajustarlo según tus necesidades)
function limpiarTexto(texto) {
  // Eliminar saltos de línea innecesarios, caracteres extraños, etc.
  return texto.replace(/\s+/g, ' ').trim();
}

// Función para dividir el texto en fragmentos de 512 tokens
function dividirEnFragmentos(texto, maxTokens = 512) {
  const palabras = texto.split(' ');
  const fragmentos = [];
  let fragmento = [];

  for (let i = 0; i < palabras.length; i++) {
    fragmento.push(palabras[i]);

    // Verificar si el número de tokens (palabras) supera el límite
    if (fragmento.length >= maxTokens) {
      fragmentos.push(fragmento.join(' '));
      fragmento = [];
    }
  }

  // Agregar el último fragmento si hay palabras restantes
  if (fragmento.length > 0) {
    fragmentos.push(fragmento.join(' '));
  }

  return fragmentos;
}

// Función para leer y generar embeddings de los archivos
async function generarEmbeddingsDeArchivos() {
  try {
    const archivos = fs.readdirSync(carpetaArchivos).filter(file => file.endsWith('.txt') || file.endsWith('.pdf'));
    const embeddingsData = {};

    for (const archivo of archivos) {
      const rutaArchivo = path.join(carpetaArchivos, archivo);
      let contenidoArchivo = '';

      // Si es un archivo PDF, lo convertimos a texto
      if (archivo.endsWith('.pdf')) {
        const dataBuffer = fs.readFileSync(rutaArchivo);
        const pdfData = await pdfParse(dataBuffer);
        contenidoArchivo = limpiarTexto(pdfData.text);
      } else {
        contenidoArchivo = fs.readFileSync(rutaArchivo, 'utf-8');
        contenidoArchivo = limpiarTexto(contenidoArchivo);
      }

      // Dividir el contenido en fragmentos de 512 tokens
      const fragmentos = dividirEnFragmentos(contenidoArchivo);

      const embeddingsPorArchivo = [];

      for (const fragmento of fragmentos) {
        // Si el fragmento tiene menos de 512 tokens, podemos generar un embedding
        if (fragmento.split(' ').length <= 512) {
          const response = await hf.featureExtraction({
            model: 'sentence-transformers/all-MiniLM-L6-v2',
            inputs: [fragmento],
          });

          // Guardar tanto el embedding como el texto del fragmento
          embeddingsPorArchivo.push({
            texto: fragmento,
            embedding: response[0],  // Asumiendo que la respuesta es un array de embeddings
          });
          console.log(`Embeddings generados para fragmento de ${archivo}`);
        } else {
          // Si el fragmento es mayor que 512 tokens, lo dividimos en fragmentos más pequeños
          const subFragmentos = dividirEnFragmentos(fragmento, 512);
          for (const subFragmento of subFragmentos) {
            const response = await hf.featureExtraction({
              model: 'sentence-transformers/all-MiniLM-L6-v2',
              inputs: [subFragmento],
            });

            // Guardar tanto el embedding como el texto del fragmento
            embeddingsPorArchivo.push({
              texto: subFragmento,
              embedding: response[0],  // Asumiendo que la respuesta es un array de embeddings
            });
            console.log(`Embeddings generados para subfragmento de ${archivo}`);
          }
        }
      }

      embeddingsData[archivo] = embeddingsPorArchivo;
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
