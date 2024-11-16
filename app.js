const readline = require('readline');
const { generarEmbeddingsDeArchivos } = require('./embeddings');
const { realizarBusqueda } = require('./similarity');

// Configurar la interfaz de lectura de entrada y salida
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Mostrar el menú principal
function mostrarMenu() {
  console.log('\n--- Menú Principal ---');
  console.log('1. Generar embeddings de documentos');
  console.log('2. Realizar una búsqueda');
  console.log('0. Salir');
}

// Manejar las opciones del menú
async function manejarOpcion(opcion) {
  switch (opcion) {
    case '1':
      console.log('Generando embeddings...');
      await generarEmbeddingsDeArchivos();
      console.log('Embeddings generados con éxito.');
      break;

    case '2':
      rl.question('Introduce el texto para realizar la búsqueda: ', async (queryText) => {
        console.log(`Realizando búsqueda para: "${queryText}"...`);
        await realizarBusqueda(queryText);
        console.log('Búsqueda completada.');
        mostrarMenu();
      });
      return; // Salir para evitar cerrar la interfaz

    case '0':
      console.log('Saliendo de la aplicación. ¡Hasta luego!');
      rl.close();
      return;

    default:
      console.log('Opción no válida. Por favor, selecciona una opción válida.');
  }
  mostrarMenu();
}

// Iniciar el flujo del programa
async function iniciarAplicacion() {
  mostrarMenu();
  rl.on('line', async (input) => {
    await manejarOpcion(input.trim());
  });
}

iniciarAplicacion();
