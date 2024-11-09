// app.js
const { generarEmbeddingsDeArchivos } = require('./embeddings');
const { searchQuery } = require('./similarity');

// Función principal para controlar el flujo
(async () => {
  try {
    // Generar los embeddings de los documentos
    console.log('Generando embeddings...');
    //await generarEmbeddingsDeArchivos();
    console.log('Embeddings generados y guardados.');

    // Realizar la búsqueda con una consulta específica
    const query = "Good practice” does not mean that the knowledge described should always be applied uniformly to all projects;";
    console.log(`Realizando búsqueda con la consulta: "${query}"`);
    await searchQuery(query);
    console.log('Búsqueda completada.');
  } catch (error) {
    console.error("Error en el flujo de la aplicación:", error.message);
  }
})();
