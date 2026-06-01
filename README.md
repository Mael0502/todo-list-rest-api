# Todo List | Drive

Aplicación web desarrollada con **Node.js**, **Express**, **MongoDB Atlas**, **Mongoose**, **GridFS**, **Pug**, **React**, **Vite** y **Postman**.

El proyecto integra dos módulos principales dentro de la misma aplicación:

- **Todo List**: gestión de tareas.
- **Drive**: gestión de archivos.

La aplicación está desplegada en Render y puede probarse desde cualquier computadora con navegador e internet.

---

## 1. Enlaces del proyecto

### Aplicación desplegada en Render

Página principal:

```txt
https://todo-list-rest-api-nzt3.onrender.com

Aplicación React con Todo List y Drive:

https://todo-list-rest-api-nzt3.onrender.com/app/

Vista Pug de tareas:

https://todo-list-rest-api-nzt3.onrender.com/todos

API de tareas:

https://todo-list-rest-api-nzt3.onrender.com/api/todos

API de archivos:

https://todo-list-rest-api-nzt3.onrender.com/api/files
Repositorio GitHub
https://github.com/Mael0502/todo-list-rest-api


2. Descripción general

Este proyecto es una aplicación web que permite administrar tareas y archivos desde una misma interfaz.

La aplicación se divide visualmente en dos secciones:

Todo List | Drive

El módulo Todo List permite:

Crear tareas.
Listar tareas.
Editar tareas.
Marcar tareas como completadas o pendientes.
Eliminar tareas.

El módulo Drive permite:

Subir archivos.
Listar archivos.
Descargar archivos.
Editar el nombre visible de los archivos.
Eliminar archivos.

Ambos módulos consumen una API REST desarrollada con Express y conectada a MongoDB Atlas.

3. Tecnologías utilizadas
Backend
Node.js
Express
MongoDB Atlas
Mongoose
GridFS
Multer
Pug
dotenv
Frontend
React
Vite
CSS
Fetch API
Herramientas
Postman
Git
GitHub
Render
4. Requisitos para acceder y probar el proyecto

El proyecto puede probarse de dos formas:

Desde la web usando Render.
Localmente clonando el repositorio desde GitHub.
5. Requisitos para probar desde la web

Para probar el proyecto desplegado en Render no es necesario instalar Node.js, MongoDB ni ejecutar comandos.

Solo se necesita:

Navegador web.
Conexión a internet.
Postman, si se desea probar la API manualmente.

El proyecto se puede abrir directamente desde:

https://todo-list-rest-api-nzt3.onrender.com/app/

Desde esa ruta se puede probar:

Todo List.
Drive.
Modo claro y modo oscuro.
Subida de archivos.
Descarga de archivos.
Edición de archivos.
Eliminación de archivos.
Creación, edición y eliminación de tareas.

No es necesario instalar MongoDB localmente porque la base de datos está en MongoDB Atlas.

Tampoco es necesario ejecutar:

npm run dev

porque el servidor ya está desplegado y ejecutándose en Render.

6. Nota sobre Render Free

El proyecto está desplegado en Render usando un servicio gratuito.

Render puede suspender la aplicación cuando pasa un tiempo sin recibir peticiones. Por eso, la primera vez que se abre la página puede tardar aproximadamente entre 30 y 60 segundos en cargar.

Si aparece una pantalla de carga o tarda en responder, se debe esperar unos segundos y actualizar la página.

7. Requisitos para probar con Postman

Para probar las rutas manualmente se puede usar:

Postman Desktop.
Postman Web.

En otra computadora no se debe usar:

http://localhost:3000

localhost solo funciona cuando el servidor está ejecutándose localmente en la misma computadora.

Para probar la versión desplegada se debe usar:

https://todo-list-rest-api-nzt3.onrender.com

Ejemplo correcto:

GET https://todo-list-rest-api-nzt3.onrender.com/api/todos

Ejemplo incorrecto en otra computadora:

GET http://localhost:3000/api/todos
8. Requisitos para ejecutar el proyecto localmente

Si se desea ejecutar el proyecto desde el código fuente, la computadora debe tener instalado:

Git
Node.js
npm
Visual Studio Code, opcional
Postman, opcional

No es necesario instalar:

MongoDB local
MongoDB Compass
React global
Vite global
Base de datos local

El proyecto usa MongoDB Atlas como base de datos en la nube.

9. Variables de entorno

El proyecto usa un archivo .env para guardar configuraciones sensibles.

Este archivo no se sube a GitHub por seguridad.

En local se debe crear un archivo .env en la raíz del proyecto con:

MONGO_URI=tu_cadena_de_conexion_mongodb_atlas
PORT=3000

En Render, la variable MONGO_URI se configura desde:

Environment Variables
10. Cómo ejecutar el proyecto localmente
Paso 1: clonar el repositorio
git clone https://github.com/TU_USUARIO/todo-list-rest-api.git

Entrar a la carpeta del proyecto:

cd todo-list-rest-api
Paso 2: instalar dependencias del backend
npm install
Paso 3: crear archivo .env

Crear un archivo llamado:

.env

En la raíz del proyecto.

Agregar:

MONGO_URI=tu_cadena_de_conexion_mongodb_atlas
PORT=3000
Paso 4: compilar React
npm run build

Este comando instala las dependencias del frontend React y genera la carpeta:

client/dist
Paso 5: ejecutar el servidor local
npm run dev

Si todo está correcto, se podrán abrir las siguientes rutas:

http://localhost:3000
http://localhost:3000/app/
http://localhost:3000/todos
http://localhost:3000/api/todos
http://localhost:3000/api/files

11. Diferencia entre local y Render

| Caso                | URL que se usa                                 | Qué se necesita                           |
| ------------------- | ---------------------------------------------- | ----------------------------------------- |
| Proyecto desplegado | `https://todo-list-rest-api-nzt3.onrender.com` | Navegador e internet                      |
| Proyecto local      | `http://localhost:3000`                        | Node.js, npm, Git, `.env` y `npm run dev` |

12. Estructura del proyecto

todo-list-rest-api
├── client
│   ├── src
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── src
│   ├── config
│   │   └── database.js
│   ├── controllers
│   │   ├── todoController.js
│   │   └── fileController.js
│   ├── models
│   │   └── Todo.js
│   ├── routes
│   │   ├── todoRoutes.js
│   │   └── fileRoutes.js
│   ├── views
│   │   ├── index.pug
│   │   ├── layout.pug
│   │   └── todos.pug
│   └── app.js
│
├── server.js
├── package.json
├── .env.example
├── .gitignore
└── README.md

13. Explicación de archivos principales
server.js

Es el punto de entrada del backend.

Se encarga de:

Cargar variables de entorno.
Conectar con MongoDB Atlas.
Iniciar el servidor Express.
src/app.js

Configura la aplicación Express.

Aquí se definen:

Middlewares.
Motor de vistas Pug.
Rutas de tareas.
Rutas de archivos.
Ruta para servir React desde /app/.
Manejo de rutas no encontradas.
src/config/database.js

Contiene la conexión con MongoDB Atlas usando Mongoose.

src/models/Todo.js

Define el modelo de datos de una tarea.

Cada tarea contiene:

title
description
completed
createdAt
updatedAt
src/controllers/todoController.js

Contiene la lógica del módulo Todo List.

Permite:

Obtener todas las tareas.
Obtener una tarea por ID.
Crear tareas.
Actualizar tareas.
Eliminar tareas.
src/routes/todoRoutes.js

Define las rutas REST del módulo Todo List.

src/controllers/fileController.js

Contiene la lógica del módulo Drive.

Permite:

Subir archivos con Multer.
Guardar archivos en MongoDB Atlas usando GridFS.
Listar archivos.
Descargar archivos.
Editar el nombre visible de los archivos.
Eliminar archivos.
src/routes/fileRoutes.js

Define las rutas REST del módulo Drive.

client/src/App.jsx

Contiene la interfaz React principal.

Incluye:

Módulo Todo List.
Módulo Drive.
Modo claro y modo oscuro.
Formularios.
Tabla de archivos.
Botones de acción.
Ventanas emergentes de confirmación.
client/src/App.css

Contiene los estilos visuales de la aplicación React.

14. Funcionamiento general del sistema

El flujo general es:

Usuario / Postman
        ↓
Render
        ↓
Express
        ↓
Mongoose / GridFS
        ↓
MongoDB Atlas
        ↓
Respuesta JSON o vista web React/Pug

La aplicación está desplegada en Render.

Render ejecuta el servidor Express. Express se conecta a MongoDB Atlas.

Las tareas se guardan como documentos normales usando Mongoose.

Los archivos se guardan en MongoDB Atlas usando GridFS.

15. Base de datos

La base de datos utilizada es MongoDB Atlas.

El proyecto usa una base de datos llamada:

todolist

Dentro de MongoDB Atlas se manejan estas colecciones:

todos
driveFiles.files
driveFiles.chunks
Colección todos

Guarda las tareas del módulo Todo List.

Colección driveFiles.files

Guarda los metadatos de los archivos subidos.

Por ejemplo:

Nombre original.
Nombre visible.
Tipo MIME.
Tamaño.
Fecha de subida.
Colección driveFiles.chunks

Guarda el contenido binario de los archivos dividido en partes.

Esta colección es creada automáticamente por GridFS.

16. Módulo Todo List en la web

Para acceder al módulo Todo List se debe abrir:

https://todo-list-rest-api-nzt3.onrender.com/app/

La sección izquierda corresponde al módulo Todo List.

Crear tarea

El usuario puede escribir:

Título de la tarea.
Descripción de la tarea.

Luego debe presionar:

Crear tarea

La tarea se guarda en MongoDB Atlas y aparece en la lista.

Completar tarea

Cada tarea tiene un botón:

Completar

Cuando se presiona, aparece una ventana emergente preguntando si se desea marcar la tarea como completada.

Si se acepta, la tarea cambia su estado a:

Completada
Marcar tarea como pendiente

Si una tarea ya está completada, el botón cambia a:

Pendiente

Al presionarlo, aparece una ventana emergente de confirmación.

Si se acepta, la tarea vuelve al estado pendiente.

Editar tarea

El botón:

Editar

carga la información de la tarea en el formulario.

Luego el usuario puede modificar el título o la descripción y presionar:

Actualizar tarea
Eliminar tarea

El botón:

Eliminar

muestra una ventana emergente de confirmación.

Si el usuario acepta, la tarea se elimina de MongoDB Atlas.

17. Módulo Drive en la web

Para acceder al módulo Drive se debe abrir:

https://todo-list-rest-api-nzt3.onrender.com/app/

La sección derecha corresponde al módulo Drive.

18. Tabla de archivos

El módulo Drive muestra una tabla con las siguientes columnas:

Nombre del archivo.
Fecha de creación.
Tipo.
Tamaño.
Botones.

| Nombre del archivo | Fecha de creación | Tipo            | Tamaño | Botones                       |
| ------------------ | ----------------- | --------------- | ------ | ----------------------------- |
| documento.pdf      | 27/05/2026        | application/pdf | 132 KB | Descargar / Editar / Eliminar |

19. Funciones del módulo Drive
Subir archivo

El usuario selecciona un archivo usando el input:

Elegir archivo

Luego presiona:

Subir archivo

Antes de subirlo aparece una ventana emergente preguntando si se desea confirmar la subida.

Si se acepta, el archivo se guarda en MongoDB Atlas usando GridFS.

Descargar archivo

Cada archivo tiene el botón:

Descargar

Al presionarlo, aparece una ventana emergente de confirmación.

Si se acepta, el archivo se descarga desde la ruta:

/api/files/:id/download
Editar archivo

Cada archivo tiene el botón:

Editar

Al presionarlo, aparece una ventana emergente que permite cambiar el nombre visible del archivo.

Esta acción no modifica el contenido del archivo, solo su nombre visible.

Eliminar archivo

Cada archivo tiene el botón:

Eliminar

Al presionarlo, aparece una ventana emergente de confirmación.

Si se acepta, el archivo se elimina de GridFS en MongoDB Atlas.

20. Modo claro y modo oscuro

La aplicación incluye un selector de tema en la parte superior.

Tiene dos opciones:

Claro
Oscuro

Al presionar Claro, la aplicación usa el modo claro.

Al presionar Oscuro, la aplicación cambia al modo oscuro.

Este cambio afecta:

Fondo.
Tarjetas.
Textos.
Tabla.
Inputs.
Botones.
21. Rutas web

GET /                 → Página principal Pug
GET /todos            → Vista Pug de tareas
GET /app/             → Aplicación React Todo List | Drive

22. Rutas API del módulo Todo List
Listar tareas
GET /api/todos

URL en Render:

https://todo-list-rest-api-nzt3.onrender.com/api/todos
Obtener tarea por ID
GET /api/todos/:id

Ejemplo:

https://todo-list-rest-api-nzt3.onrender.com/api/todos/ID_DE_LA_TAREA
Crear tarea
POST /api/todos

URL:

https://todo-list-rest-api-nzt3.onrender.com/api/todos

Body en Postman:

{
  "title": "Tarea de prueba",
  "description": "Creada desde Postman",
  "completed": false
}
Actualizar tarea completa
PUT /api/todos/:id

Body:

{
  "title": "Tarea actualizada",
  "description": "Descripción actualizada",
  "completed": true
}
Actualizar parcialmente una tarea
PATCH /api/todos/:id

Body:

{
  "completed": true
}
Eliminar tarea
DELETE /api/todos/:id

No necesita body.

23. Rutas API del módulo Drive
Listar archivos
GET /api/files

URL en Render:

https://todo-list-rest-api-nzt3.onrender.com/api/files
Subir archivo
POST /api/files/upload

URL en Render:

https://todo-list-rest-api-nzt3.onrender.com/api/files/upload

En Postman:

Body → form-data

Agregar una fila:

Key: file
Type: File
Value: seleccionar archivo

Importante: la key debe llamarse exactamente:

file
Descargar archivo
GET /api/files/:id/download

Ejemplo:

https://todo-list-rest-api-nzt3.onrender.com/api/files/ID_DEL_ARCHIVO/download

En Postman se puede usar:

Send and Download
Editar nombre del archivo
PATCH /api/files/:id

Body:

{
  "displayName": "nuevo-nombre.pdf"
}

Esta acción actualiza el nombre visible del archivo.

Eliminar archivo
DELETE /api/files/:id

No necesita body.

24. Pruebas recomendadas en Postman: Todo List
Prueba 1: listar tareas

Método:

GET

URL:

https://todo-list-rest-api-nzt3.onrender.com/api/todos
Prueba 2: crear tarea

Método:

POST

URL:

https://todo-list-rest-api-nzt3.onrender.com/api/todos

Body:

{
  "title": "Tarea creada desde Postman",
  "description": "Prueba de creación usando la API",
  "completed": false
}

Guardar el valor de _id para las siguientes pruebas.

Prueba 3: obtener tarea por ID

Método:

GET

URL:

https://todo-list-rest-api-nzt3.onrender.com/api/todos/ID_DE_LA_TAREA
Prueba 4: actualizar tarea completa

Método:

PUT

URL:

https://todo-list-rest-api-nzt3.onrender.com/api/todos/ID_DE_LA_TAREA

Body:

{
  "title": "Tarea editada desde Postman",
  "description": "La tarea fue actualizada completamente",
  "completed": true
}
Prueba 5: actualizar estado

Método:

PATCH

URL:

https://todo-list-rest-api-nzt3.onrender.com/api/todos/ID_DE_LA_TAREA

Body:

{
  "completed": false
}
Prueba 6: eliminar tarea

Método:

DELETE

URL:

https://todo-list-rest-api-nzt3.onrender.com/api/todos/ID_DE_LA_TAREA
25. Pruebas recomendadas en Postman: Drive
Prueba 1: listar archivos

Método:

GET

URL:

https://todo-list-rest-api-nzt3.onrender.com/api/files
Prueba 2: subir archivo

Método:

POST

URL:

https://todo-list-rest-api-nzt3.onrender.com/api/files/upload

En Postman:

Body → form-data

Agregar:

Key: file
Type: File
Value: seleccionar archivo

Guardar el _id del archivo para las siguientes pruebas.

Prueba 3: descargar archivo

Método:

GET

URL:

https://todo-list-rest-api-nzt3.onrender.com/api/files/ID_DEL_ARCHIVO/download

En Postman se recomienda usar:

Send and Download
Prueba 4: editar nombre del archivo

Método:

PATCH

URL:

https://todo-list-rest-api-nzt3.onrender.com/api/files/ID_DEL_ARCHIVO

Body:

{
  "displayName": "archivo-renombrado.pdf"
}
Prueba 5: eliminar archivo

Método:

DELETE

URL:

https://todo-list-rest-api-nzt3.onrender.com/api/files/ID_DEL_ARCHIVO
26. Cómo probar desde la aplicación web

Abrir:

https://todo-list-rest-api-nzt3.onrender.com/app/
Probar Todo List
Escribir un título.
Escribir una descripción.
Presionar Crear tarea.
Verificar que la tarea aparezca en la lista.
Presionar Completar.
Confirmar la ventana emergente.
Presionar Editar.
Cambiar los datos.
Presionar Actualizar tarea.
Presionar Eliminar.
Confirmar la eliminación.
Probar Drive
Presionar Elegir archivo.
Seleccionar un archivo desde la computadora.
Presionar Subir archivo.
Confirmar la ventana emergente.
Verificar que el archivo aparezca en la tabla.
Presionar Descargar.
Confirmar la descarga.
Presionar Editar.
Cambiar el nombre visible.
Confirmar la edición.
Presionar Eliminar.
Confirmar la eliminación.
27. Headers y caché

El proyecto incluye ajustes básicos de headers.

En operaciones que modifican datos, como:

POST
PUT
PATCH
DELETE

se usa:

Cache-Control: no-store

Esto indica que esas respuestas no deben almacenarse en caché, porque modifican información.

También se desactivó:

X-Powered-By

para no exponer innecesariamente que el servidor usa Express.

En respuestas de lectura se pueden manejar headers como:

Cache-Control
ETag
Last-Modified

para optimizar respuestas y reducir tráfico cuando los datos no han cambiado.

28. Seguridad básica

El archivo .env no se sube a GitHub.

En .gitignore se excluyen:

.env
node_modules

La conexión a MongoDB Atlas se configura mediante la variable de entorno:

MONGO_URI

En local se usa .env.

En Render se configura desde:

Environment Variables
29. Despliegue en Render

Render ejecuta el siguiente comando para instalar dependencias y compilar React:

npm install && npm run build

Luego ejecuta:

npm start

para iniciar el servidor Express.

El servidor Express sirve:

API REST.
Vistas Pug.
Frontend React compilado.

React se sirve desde:

/app/
30. Comandos importantes
Ejecutar en desarrollo
npm run dev
Compilar React
npm run build
Ejecutar en producción
npm start
Subir cambios a GitHub
git add .
git commit -m "mensaje del cambio"
git push
31. Resumen de rutas principales
Web
GET /                 → Página principal Pug
GET /todos            → Vista Pug de tareas
GET /app/             → Aplicación React Todo List | Drive
API Todo List
GET    /api/todos
GET    /api/todos/:id
POST   /api/todos
PUT    /api/todos/:id
PATCH  /api/todos/:id
DELETE /api/todos/:id
API Drive
GET    /api/files
POST   /api/files/upload
GET    /api/files/:id/download
PATCH  /api/files/:id
DELETE /api/files/:id
32. Conclusión

El proyecto integra una aplicación web con dos módulos principales: Todo List y Drive.

La aplicación permite:

Gestionar tareas.
Gestionar archivos.
Consumir una API REST.
Guardar datos en MongoDB Atlas.
Guardar archivos con GridFS.
Probar endpoints con Postman.
Acceder desde la web mediante Render.
Usar una interfaz React con modo claro y oscuro.

El proyecto puede ser evaluado desde:

La interfaz web en Render.
Las rutas API en Postman.
La base de datos MongoDB Atlas.
El repositorio en GitHub.
## Autenticación

El proyecto utiliza autenticación con JWT y bcrypt.

- `bcryptjs` se usa para encriptar contraseñas.
- `jsonwebtoken` se usa para generar tokens JWT.
- React guarda el token en `localStorage`.
- Las rutas `/api/todos` y `/api/files` están protegidas.
- Cada usuario solo puede ver sus propias tareas y archivos.

### Rutas de autenticación

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/me` | Obtener usuario autenticado |

Para usar rutas protegidas en Postman se debe enviar:

```txt
Authorization: Bearer TOKEN