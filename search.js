const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');
const { SentenceTransformer } = require('sentence-transformers');

const documents = ['Texto del documento 1', 'Texto del documento 2', 'Texto del documento 3'];
const docVectors = JSON.parse(fs.readFileSync('document_vectors.json'));

function cosineSimilarity(vec1, vec2) {
  const dotProduct = tf.dot(vec1, vec2).arraySync();
  const normVec1 = tf.norm(vec1).arraySync();
  const normVec2 = tf.norm(vec2).arraySync();
  return dotProduct / (normVec1 * normVec2);
}

async function searchQuery(query) {
  const model = await SentenceTransformer.load('all-MiniLM-L6-v2');
  const queryVector = await model.encode(query);
  
  let highestSimilarity = 0;
  let bestMatch = '';
  
  for (const [index, docVector] of docVectors.entries()) {
    const similarity = cosineSimilarity(queryVector, docVector);
    if (similarity > highestSimilarity) {
      highestSimilarity = similarity;
      bestMatch = `Document ${index + 1}: ${documents[index]}`;
    }
  }
  
  console.log(`Best match: ${bestMatch} with similarity: ${highestSimilarity}`);
}

searchQuery('Texto relacionado con documento 1');
