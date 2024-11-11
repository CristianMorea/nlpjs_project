const fs = require('fs');
const path = require('path');
const { HfInference } = require('@huggingface/inference');
const pdfParse = require('pdf-parse');
const { MilvusClient, DataType } = require('@zilliz/milvus2-sdk-node');
require('dotenv').config();

const hfToken = process.env.HF_TOKEN || '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';
const hf = new HfInference(hfToken);

// Conexión a Milvus
const client = new MilvusClient({
  address: 'localhost:19530', // Dirección del servidor Milvus
});

// Ruta de los documentos
const carpetaArchivos = path.join(__dirname, 'documentos');

// Función para limpiar el contenido (ajustado según tus necesidades)
function limpiarTexto(texto) {
  console.log('Limpiando texto...');
  return texto.replace(/\s+/g, ' ').trim();
}

// Función para dividir el texto en fragmentos de 384 tokens (ajustado para embeddings de 384)
function dividirEnFragmentos(texto, maxTokens = 384) {
  console.log(`Dividiendo el texto en fragmentos de ${maxTokens} tokens...`);
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

  console.log(`Fragmentos generados: ${fragmentos.length}`);
  return fragmentos;
}

// Función para generar y almacenar embeddings en Milvus
async function generarEmbeddingsDeArchivos() {
  try {
    console.log('Iniciando la generación de embeddings...');
    const archivos = fs.readdirSync(carpetaArchivos).filter(file => file.endsWith('.txt') || file.endsWith('.pdf'));
    console.log(`Archivos encontrados: ${archivos.length}`);

    for (const archivo of archivos) {
      const rutaArchivo = path.join(carpetaArchivos, archivo);
      console.log(`Procesando archivo: ${archivo}`);
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

      // Dividir el contenido en fragmentos de 384 tokens
      const fragmentos = dividirEnFragmentos(contenidoArchivo);
      console.log(`Fragmentos generados para ${archivo}: ${fragmentos.length}`);

      for (const fragmento of fragmentos) {
        console.log(`Generando embeddings para fragmento de ${archivo}...`);
        const response = await hf.featureExtraction({
          model: 'sentence-transformers/all-MiniLM-L6-v2', // O elegir otro modelo con embeddings de 384
          inputs: [fragmento],
        });

        // Verificar la respuesta
        console.log(`Respuesta de Hugging Face: ${JSON.stringify(response, null, 2)}`);

        // Obtener el embedding generado
        const embedding = response[0];

        // Verifica que el embedding tenga la dimensión correcta (384)
        if (embedding.length !== 384) {
          console.error('El vector embedding no tiene la dimensión correcta (debe ser 384).');
          continue;
        }

        // Crear un objeto con el texto y el embedding
        const insertData = {
          id: Date.now(), // Usando el timestamp como ID único
          text: fragmento,
          embedding: embedding, // El embedding generado de 384 dimensiones
        };

        // Insertar en la colección de Milvus
        try {
          const insertResponse = await client.insert({
            collection_name: 'colleccionIA',
            fields_data: [insertData], // Insertar un solo objeto de datos
          });
          console.log(`Embedding insertado para fragmento de ${archivo}:`, insertResponse);
        } catch (error) {
          console.error(`Error al insertar el embedding de ${archivo}:`, error);
        }
      }
    }
    console.log('Embeddings generados e insertados en Milvus.');
  } catch (error) {
    console.error('Error al generar embeddings:', error.message);
  }
}


module.exports = { generarEmbeddingsDeArchivos };
