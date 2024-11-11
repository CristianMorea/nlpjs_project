//createCollection.js

const { MilvusClient, DataType, IndexType, MetricType } = require('@zilliz/milvus2-sdk-node');

// Función para eliminar la colección si es necesario
async function dropCollection() {
  const client = new MilvusClient({
    address: 'localhost:19530', // Dirección del servidor Milvus
  });

  try {
    const response = await client.dropCollection({
      collection_name: 'text_embeddings_collection',
    });
    console.log('Colección eliminada:', response);
  } catch (error) {
    console.error('Error al eliminar la colección:', error);
  }
}

// Función para crear la colección
async function createCollection() {
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
    // Crear la colección
    const response = await client.createCollection(collectionSchema);
    console.log('Colección creada:', response);

    // Crear el índice para el campo de embedding
    const indexParams = {
      collection_name: 'colleccionIA',
      field_name: 'embedding',  // El campo para el cual deseas crear el índice
      index_type: IndexType.IVF_FLAT,  // Tipo de índice (puedes elegir otros como IVF_SQ8, HNSW, etc.)
      metric_type: MetricType.L2,  // Tipo de métrica (L2, IP, etc.)
      params: {
        nlist: 128,  // Ajusta el parámetro según el tipo de índice
      },
    };

    const indexResponse = await client.createIndex(indexParams);
    console.log('Índice creado:', indexResponse);

  } catch (error) {
    console.error('Error al crear la colección o el índice:', error);
  }
}

// Ejecutar la función para crear la colección y el índice
createCollection();
