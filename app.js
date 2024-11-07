// app.js
const { generarEmbeddingsDeArchivos } = require('./embeddings');
const { searchQuery } = require('./similarity');

// Función principal para controlar el flujo
(async () => {
  try {
    // Generar los embeddings de los documentos
    await generarEmbeddingsDeArchivos();

    // Realizar la búsqueda con una consulta específica
    await searchQuery("Machine learning in healthcare");
  } catch (error) {
    console.error("Error en el flujo de la aplicación:", error.message);
  }
})();
