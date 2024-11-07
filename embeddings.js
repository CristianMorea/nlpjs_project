const { HfInference } = require('@huggingface/inference');
require('dotenv').config();

const hfToken = process.env.HF_TOKEN || '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';
const hf = new HfInference(hfToken);

async function generateEmbeddings() {
  try {
    const response = await hf.featureExtraction({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      inputs: ['Texto del documento'],
    });
    console.log(response);
  } catch (error) {
    console.error('Error al generar embeddings:', error.message);
  }
}

generateEmbeddings();
