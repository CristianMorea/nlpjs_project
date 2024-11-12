// app.js
const { generarEmbeddingsDeArchivos } = require('./embeddings');
const { realizarBusqueda } = require('./similarity');

// Función principal para controlar el flujo
(async () => {
  try {
    // Generar los embeddings de los documentos
    console.log('Generando embeddings...');
    await generarEmbeddingsDeArchivos();

    // Texto de ejemplo para realizar la búsqueda (esto lo puedes cambiar según lo que necesites)
    const queryText = "Objetivo Generalc";
    await realizarBusqueda(queryText);
    
  } catch (error) {
    console.error("Error en el flujo de la aplicación:", error.message);
  }
})();
