//milvusConnection.js

const { MilvusClient } = require('@zilliz/milvus2-sdk-node');

async function testConnection() {
  const client = new MilvusClient('localhost:19530');

  try {
    const response = await client.checkHealth();
    if (response.isHealthy) {
      console.log('Conexión exitosa');
    } else {
      console.log('Milvus no está saludable');
    }
  } catch (error) {
    console.error('Error al conectar con Milvus:', error);
  }
}

testConnection();
