
# Proyecto de Búsqueda por Similaridad con Milvus y Node.js

Este proyecto utiliza el cliente de Node.js para Milvus junto con Hugging Face para generar embeddings vectoriales a partir de documentos de texto (archivos PDF o TXT) y realizar búsquedas de similitud en esos vectores almacenados en Milvus.


- Procesa documentos PDF y TXT automáticamente
- Genera embeddings con modelos avanzados de Hugging Face
- Realiza búsquedas semánticas por similitud en Milvus
- ✨Encuentra conexiones que las búsquedas por palabras clave no pueden detectar✨


## Caracteristicas


- Indexación automática de documentos y generación de embeddings
- Búsqueda semántica basada en el significado real del texto, no sólo palabras clave
- Arquitectura escalable para manejar grandes volúmenes de documentos
- Soporte para múltiples formatos de archivo (PDF, TXT)
- Configuración flexible del modelo de embedding según sus necesidades

## Screenshots

![App Screenshot](assets/screenshots/corriendo%20Doker.png)

![App Screenshot](assets/screenshots/iniciando%20el%20proyecto.png)

![App Screenshot](assets/screenshots/Embedings%20generados.png)

![App Screenshot](assets/screenshots/Busqueda%20por%20similitud.png)
![App Screenshot](assets/screenshots/Busqueda%20por%20similitud%20final.png)
## Tecnologias


Este proyecto utiliza varios proyectos de código abierto para funcionar correctamente:

- [Node.js] - Entorno de ejecución para JavaScript en el servidor
- [Milvus] - Base de datos vectorial de alto rendimiento
- [Hugging Face] - API para acceder a modelos de lenguaje avanzados
- [Express] - Framework web rápido para Node.js
- [pdf-parse] - Herramienta para extraer texto de archivos PDF
- [dotenv] - Gestión segura de variables de entorno

## Requisitos

Este proyecto requiere [Node.js](https://nodejs.org/) v10+ y [Docker](https://www.docker.com/) para ejecutar Milvus.
## Instalacion


### 1. Configurar Milvus con Docker

```sh
wget https://github.com/milvus-io/milvus/releases/download/v2.2.8/milvus-standalone-docker-compose.yml -O docker-compose.yml
sudo docker-compose up -d
```

### 2. Instalar dependencias del proyecto

```sh
cd proyecto-similaridad
npm install @zilliz/milvus2-sdk-node @huggingface/inference dotenv pdf-parse
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en el directorio raíz:

```
HF_TOKEN=your_huggingface_token_here
```

## Uso

Para ejecutar el flujo principal del proyecto:

```sh
node app.js
```
luego elige la opcion que necesites entre generar los embedings opc1 o realizar busqueda opc2
## Estructura del Proyecto


| Archivo | Descripción |
| ------ | ------ |
| app.js | Punto de entrada principal y control de flujo de la aplicación |
| createCollection.js | Configuración de la colección en Milvus para almacenar embeddings |
| embedder.js | Procesamiento de archivos y generación de embeddings |
| embeddings.js | Ejecución de generación de embeddings a partir de archivos |
| milvusClient.js | Funciones del cliente de Milvus (verificación de colección, inserción) |
| similarity.js | Búsquedas de similitud en la base de datos vectorial |

## Desarrollo


¿Quieres contribuir? ¡Excelente!

El proyecto está estructurado para facilitar su expansión:

1. Abre tu Terminal favorito y ejecuta:

```sh
npm install
```

2. Configura tu entorno de desarrollo:

```sh
node app.js
```

3. Realiza tus cambios y crea una solicitud de extracción en GitHub.


## Docker

El proyecto es fácil de instalar y desplegar en un contenedor Docker.

```sh
cd proyecto-similaridad
docker build -t <usuario>/proyecto-similaridad:1.0 .
```

Una vez terminado, ejecuta la imagen de Docker:

```sh
docker run -d -p 8000:8080 --name=proyecto-similaridad <usuario>/proyecto-similaridad:1.0
```

Verifica la implementación navegando a la dirección de tu servidor:

```sh
127.0.0.1:8000
```

## Dependencias


El proyecto depende de los siguientes paquetes principales:

1. `@zilliz/milvus2-sdk-node` - Cliente Node.js para Milvus
2. `@huggingface/inference` - Interacción con la API de Hugging Face
3. `dotenv` - Carga de variables de entorno
4. `fs` (módulo integrado de Node.js) - Manejo de archivos

