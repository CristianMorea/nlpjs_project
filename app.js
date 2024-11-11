// app.js
const { generarEmbeddingsDeArchivos } = require('./embeddings');
const { searchQuery } = require('./similarity');

// Función principal para controlar el flujo
(async () => {
  try {
    // Generar los embeddings de los documentos
    console.log('Generando embeddings...');
    await generarEmbeddingsDeArchivos();
    console.log('Embeddings generados y guardados.');

  } catch (error) {
    console.error("Error en el flujo de la aplicación:", error.message);
  }
})();
