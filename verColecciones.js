// Importar el cliente de Milvus
const { MilvusClient } = require('@zilliz/milvus2-sdk-node');
require('dotenv').config();

// Crear la instancia del cliente Milvus
const client = new MilvusClient({
  address: 'localhost:19530', // Dirección del servidor Milvus
});

async function cargarColecciones() {
  try {
    const colecciones = ['text_embeddings_collection', 'colleccionIA'];
    for (const coleccion of colecciones) {
      const respuesta = await client.loadCollection({ collection_name: coleccion });
      console.log(`Colección ${coleccion} cargada:`, respuesta);
    }

    // Verificar nuevamente las colecciones cargadas
    const response = await client.showCollections();
    console.log('Respuesta de showCollections:', response);

    const collections = response.data || [];
    if (collections.length === 0) {
      console.log('No hay colecciones cargadas.');
    } else {
      console.log('Colecciones cargadas:', collections);
    }
  } catch (error) {
    console.error('Error al cargar las colecciones:', error.message);
  }
}

cargarColecciones();
