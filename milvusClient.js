const { MilvusClient, DataType } = require('@zilliz/milvus2-sdk-node');

// Se usa la variable client para la conexión
const client = new MilvusClient({ address: 'localhost:19530' });

async function ensureCollectionExists(collectionName) {
  try {
    const collections = await client.showCollections();
    const exists = collections.data.some(col => col.name === collectionName);

    if (!exists) {
      const schema = {
        collection_name: collectionName,
        fields: [
          {
            name: 'id',
            description: 'ID único para cada fragmento de texto',
            data_type: DataType.Int64,
            is_primary_key: true,
            auto_id: false,
          },
          {
            name: 'text',
            description: 'Texto original del fragmento',
            data_type: DataType.VarChar,
            max_length: 500,
          },
          {
            name: 'embedding',
            description: 'Vector embedding de 384 dimensiones',
            data_type: DataType.FloatVector,
            dim: 384, // El tamaño del vector
          },
        ],
      };
      await client.createCollection(schema);
      console.log(`Colección ${collectionName} creada.`);
    } else {
      console.log(`La colección ${collectionName} ya existe.`);
    }
  } catch (error) {
    console.error('Error al verificar o crear la colección:', error);
  }
}

async function insertInMilvus(collectionName, embeddings) {
  try {
    // Se usa el cliente para la inserción, no milvusClient
    const response = await client.insert({
      collection_name: collectionName,
      fields_data: embeddings,
    });

    console.log('Respuesta de inserción de Milvus:', response); // Log completo
    return response;  // Devuelve la respuesta para manejarla correctamente
  } catch (error) {
    console.error('Error al insertar en Milvus:', error.message);
    throw error;  // Lanza el error para ser manejado en el código que llama a esta función
  }
}

module.exports = { client, ensureCollectionExists, insertInMilvus };
