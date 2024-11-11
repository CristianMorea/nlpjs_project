//embedder.js

require('dotenv').config();  // Cargar variables de entorno

const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { HfInference } = require('@huggingface/inference');
const hf = new HfInference(process.env.HF_TOKEN);  // Usar el token desde el .env

function limpiarTexto(texto) {
  return texto.replace(/\s+/g, ' ').trim();
}

function dividirEnFragmentos(texto, maxTokens = 384) {
  const palabras = texto.split(' ');
  const fragmentos = [];
  let fragmento = [];

  for (let palabra of palabras) {
    fragmento.push(palabra);
    if (fragmento.length >= maxTokens) {
      fragmentos.push(fragmento.join(' '));
      fragmento = [];
    }
  }
  if (fragmento.length) fragmentos.push(fragmento.join(' '));
  return fragmentos;
}

async function procesarArchivo(rutaArchivo) {
  let contenido = '';

  if (rutaArchivo.endsWith('.pdf')) {
    const pdfData = await pdfParse(fs.readFileSync(rutaArchivo));
    contenido = limpiarTexto(pdfData.text);
  } else {
    contenido = limpiarTexto(fs.readFileSync(rutaArchivo, 'utf-8'));
  }

  return dividirEnFragmentos(contenido);
}

async function generarEmbedding(texto) {
  const response = await hf.featureExtraction({ model: 'sentence-transformers/all-MiniLM-L6-v2', inputs: [texto] });
  return response[0];  // Devuelve el primer embedding generado
}

module.exports = { procesarArchivo, generarEmbedding };
