// app.js
const { generarEmbeddingsDeArchivos } = require('./embeddings');
const { searchQuery } = require('./similarity');

// Función principal para controlar el flujo
(async () => {
  try {
    // Generar los embeddings de los documentos
    await generarEmbeddingsDeArchivos();

    // Realizar la búsqueda con una consulta específica
    await searchQuery("The future of renewable energy is one of the most important discussions of our time. As the world faces mounting concerns over climate change, renewable energy offers a sustainable alternative. With global energy demands steadily increasing, the shift towards clean energy sources has become a critical issue.");
  } catch (error) {
    console.error("Error en el flujo de la aplicación:", error.message);
  }
})();
