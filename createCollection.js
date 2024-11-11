const { MilvusClient, DataType } = require('@zilliz/milvus2-sdk-node');


async function dropCollection() {
  // Conéctate al servidor de Milvus
  const client = new MilvusClient({
    address: 'localhost:19530', // Dirección del servidor Milvus
  });

  try {
    // Eliminar la colección
    const response = await client.dropCollection({
      collection_name: 'text_embeddings_collection',
    });
    console.log('Colección eliminada:', response);
  } catch (error) {
    console.error('Error al eliminar la colección:', error);
  }
}
async function createCollection() {
  // Conéctate al servidor de Milvus
  const client = new MilvusClient({
    address: 'localhost:19530', // Dirección del servidor Milvus
  });

  // Define el esquema de la colección
  const collectionSchema = {
    collection_name: 'colleccionIA',
    fields: [
      {
        name: 'id',
        description: 'ID único para cada fragmento de texto',
        data_type: DataType.Int64,  // Usamos Int64 para el ID
        is_primary_key: true,
        auto_id: false,  // Ya que estás generando el ID tú mismo
      },
      {
        name: 'text',
        description: 'Texto original del fragmento',
        data_type: DataType.VarChar, // Usamos VarChar para el texto
        max_length: 500, // Milvus requiere especificar max_length para VarChar
      },
      {
        name: 'embedding',
        description: 'Vector embedding de 384 dimensiones',
        data_type: DataType.FloatVector,  // Usamos FloatVector para los embeddings
        dim: 384,  // Cambié 'dimension' por 'dim'
      },
    ],
  };

  try {
    // Crea la colección
    const response = await client.createCollection(collectionSchema);
    console.log('Colección creada:', response);
  } catch (error) {
    console.error('Error al crear la colección:', error);
  }
}

// Ejecutar la función para crear la colección
createCollection();
