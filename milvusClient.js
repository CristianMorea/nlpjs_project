const { MilvusClient, DataType } = require('@zilliz/milvus2-sdk-node');

// Configurar la conexión al cliente
const client = new MilvusClient({ address: 'localhost:19530' });

async function ensureCollectionExists(collectionName) {
  try {
    // Verificar si la colección ya existe
    const collections = await client.showCollections();
    const exists = collections.data.some(col => col.name === collectionName);

    if (!exists) {
      console.log(`La colección ${collectionName} no existe. Creándola...`);

      // Definir el esquema de la colección
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
            dim: 384, // Dimensión del vector
          },
        ],
      };

      // Crear la colección
      await client.createCollection(schema);
      console.log(`Colección ${collectionName} creada.`);

      // Crear el índice en el campo 'embedding'
      await client.createIndex({
        collection_name: collectionName,
        field_name: 'embedding',
        index_name: 'embedding_index',
        index_type: 'IVF_FLAT', // Tipo de índice (puedes usar otro si es más adecuado)
        metric_type: 'L2', // Distancia euclidiana
        params: { nlist: 128 }, // Número de clusters
      });
      console.log(`Índice creado para la colección ${collectionName}.`);

      // Cargar la colección en memoria
      await client.loadCollectionSync({ collection_name: collectionName });
      console.log(`Colección ${collectionName} cargada en memoria.`);
    } else {
      console.log(`La colección ${collectionName} ya existe.`);

      // Verificar si el índice ya existe
      const indexes = await client.describeIndex({ collection_name: collectionName });
      if (!indexes.index_descriptions.length) {
        console.log(`No se encontró un índice para la colección ${collectionName}. Creándolo...`);
        await client.createIndex({
          collection_name: collectionName,
          field_name: 'embedding',
          index_name: 'embedding_index',
          index_type: 'IVF_FLAT',
          metric_type: 'L2',
          params: { nlist: 128 },
        });
        console.log(`Índice creado para la colección ${collectionName}.`);
      }

      // Cargar la colección en memoria
      await client.loadCollectionSync({ collection_name: collectionName });
      console.log(`Colección ${collectionName} cargada en memoria.`);
    }
  } catch (error) {
    console.error('Error al verificar o crear la colección:', error.message);
  }
}

async function insertInMilvus(collectionName, embeddings) {
  try {
    // Insertar los datos
    const response = await client.insert({
      collection_name: collectionName,
      fields_data: embeddings,
    });

    console.log('Datos insertados correctamente en Milvus:', response);
    return response;
  } catch (error) {
    console.error('Error al insertar en Milvus:', error.message);
    throw error;
  }
}

module.exports = { client, ensureCollectionExists, insertInMilvus };
