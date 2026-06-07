# Todo List | Drive

Aplicación web full-stack desarrollada con **React + Vite** en el frontend y **Node.js + Express** en el backend.
El sistema permite gestionar tareas y archivos tipo Drive desde una misma interfaz, usando autenticación JWT, MongoDB Atlas, GridFS, paginación, búsqueda, filtros, ordenamiento y despliegue en Render.

---

## 👤 Autor

**Amilcar Diego Revollo Bernal**

Proyecto académico - Universidad Mayor de San Simón

---

# 🚀 Instalación y Ejecución del Proyecto

Esta sección explica cómo instalar, configurar, cargar datos de prueba y ejecutar el proyecto correctamente.

---

## 1. Requisitos Previos

Antes de ejecutar el proyecto se debe tener instalado:

```txt
Node.js
npm
Git
MongoDB Atlas
Postman
```

Versiones recomendadas:

```txt
Node.js 18 o superior
npm 9 o superior
```

Verificar instalación:

```bash
node -v
npm -v
git --version
```

---

## 2. Clonar el Repositorio

```bash
git clone https://github.com/Mael0502/todo-list-rest-api.git
cd todo-list-rest-api
```

---

## 3. Instalar Dependencias

Instalar dependencias del backend:

```bash
npm install
```

Instalar dependencias del frontend:

```bash
npm install --prefix client
```

---

## 4. Configurar Variables de Entorno

El proyecto necesita un archivo `.env` en la raíz.
Este archivo no se incluye en el repositorio porque contiene credenciales privadas.

Crear el archivo `.env` usando como referencia `.env.example`.

Ejemplo:

```env
PORT=3000

MONGO_URI=mongodb+srv://USUARIO:PASSWORD@CLUSTER.mongodb.net/NOMBRE_BASE_DATOS?retryWrites=true&w=majority

JWT_SECRET=coloca_aqui_una_clave_secreta
JWT_EXPIRES_IN=7d

HTTPS_ENABLED=false
SSL_KEY_PATH=certs/key.pem
SSL_CERT_PATH=certs/cert.pem
```

Variables principales:

```txt
PORT              Puerto donde corre el servidor.
MONGO_URI         Cadena de conexión a MongoDB Atlas.
JWT_SECRET        Clave usada para firmar tokens JWT.
JWT_EXPIRES_IN    Tiempo de expiración del token.
HTTPS_ENABLED     Activa o desactiva HTTPS local.
SSL_KEY_PATH      Ruta de la clave privada .pem.
SSL_CERT_PATH     Ruta del certificado .pem.
```

---

## 5. Compilar el Frontend

```bash
npm run build
```

Este comando genera la versión de producción de React en:

```txt
client/dist
```

Express sirve esa carpeta desde:

```txt
/app/
```

---

## 6. Cargar Datos de Prueba por Lotes

El proyecto incluye un script para cargar datos iniciales en la base de datos.

Ejecutar:

```bash
npm run seed
```

Este comando crea:

```txt
1 usuario demo
10 tareas demo asociadas al usuario
```

Credenciales generadas:

```txt
Correo: demo@test.com
Contraseña: 123456
```

Este paso permite probar el sistema sin crear datos manualmente desde la interfaz.

---

## 7. Iniciar el Servidor

```bash
npm run dev
```

La aplicación estará disponible en:

```txt
http://localhost:3000/app/
```

Para iniciar sesión:

```txt
Correo: demo@test.com
Contraseña: 123456
```

---

## ⚡ Inicio Rápido

```bash
git clone https://github.com/Mael0502/todo-list-rest-api.git
cd todo-list-rest-api
npm install
npm install --prefix client
cp .env.example .env
npm run build
npm run seed
npm run dev
```

Luego abrir:

```txt
http://localhost:3000/app/
```

---

# 🌐 Despliegue en Render

El proyecto puede desplegarse en Render como un **Web Service**.

## Configuración recomendada

```txt
Build Command:
npm install && npm run build

Start Command:
npm start
```

## Variables de entorno en Render

Configurar en:

```txt
Render → Environment
```

Variables necesarias:

```txt
MONGO_URI
PORT
JWT_SECRET
JWT_EXPIRES_IN
HTTPS_ENABLED
SSL_KEY_PATH
SSL_CERT_PATH
```

En Render se debe mantener:

```env
HTTPS_ENABLED=false
```

Render ya proporciona HTTPS automáticamente mediante su propia infraestructura.

## URL de Producción

Aplicación web:

```txt
https://todo-list-rest-api-nzt3.onrender.com/app/
```

API:

```txt
https://todo-list-rest-api-nzt3.onrender.com/api
```

---

# 🔒 Configuración HTTPS Local con Certificados `.pem`

El proyecto puede ejecutarse localmente usando **HTTP** o **HTTPS**.

Por defecto se ejecuta en HTTP:

```txt
http://localhost:3000/app/
```

También se agregó soporte para HTTPS local usando el módulo nativo `https` de Node.js y certificados `.pem`.

---

## 1. Variables para HTTPS

En `.env`:

```env
HTTPS_ENABLED=false
SSL_KEY_PATH=certs/key.pem
SSL_CERT_PATH=certs/cert.pem
```

Para usar HTTP local:

```env
HTTPS_ENABLED=false
```

Para usar HTTPS local:

```env
HTTPS_ENABLED=true
```

---

## 2. Crear Carpeta de Certificados

Desde la raíz del proyecto:

```bash
mkdir -p certs
```

En PowerShell:

```powershell
mkdir certs
```

---

## 3. Generar Certificados `.pem`

Desde la raíz del proyecto:

```bash
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -days 365 \
  -keyout certs/key.pem \
  -out certs/cert.pem
```

Durante la generación se pueden usar estos datos de ejemplo:

```txt
Country Name: BO
State: Cochabamba
Locality: Cochabamba
Organization: UMSS
Organizational Unit: Proyecto PW2
Common Name: localhost
Email Address: correo_de_prueba
```

Se generarán:

```txt
certs/key.pem
certs/cert.pem
```

---

## 4. Ejecutar en HTTPS Local

En `.env`:

```env
HTTPS_ENABLED=true
SSL_KEY_PATH=certs/key.pem
SSL_CERT_PATH=certs/cert.pem
```

Iniciar servidor:

```bash
npm run dev
```

Abrir:

```txt
https://localhost:3000/app/
```

El navegador puede mostrar una advertencia porque el certificado es autofirmado.
Esto es normal en entorno local. Se debe ingresar mediante la opción avanzada del navegador.

---

## 5. Volver a HTTP Local

Cambiar en `.env`:

```env
HTTPS_ENABLED=false
```

Reiniciar:

```bash
npm run dev
```

Abrir:

```txt
http://localhost:3000/app/
```

---

# 🧪 Pruebas Principales en Postman

Para probar rutas protegidas, primero se debe iniciar sesión y copiar el token JWT.

---

## 1. Login

```txt
POST http://localhost:3000/api/auth/login
```

Body → raw → JSON:

```json
{
  "email": "demo@test.com",
  "password": "123456"
}
```

Copiar el valor de `token`.

En las siguientes peticiones usar:

```txt
Authorization → Type → Bearer Token
```

Pegar solo el token, sin escribir `Bearer`.

---

## 2. Listar Tareas

```txt
GET http://localhost:3000/api/todos?page=1&limit=5
```

---

## 3. Crear Tarea

```txt
POST http://localhost:3000/api/todos
```

Body → raw → JSON:

```json
{
  "title": "Tarea creada desde Postman",
  "description": "Prueba usando JWT",
  "completed": false
}
```

---

## 4. Buscar y Filtrar Tareas

Buscar:

```txt
GET http://localhost:3000/api/todos?page=1&limit=5&search=jwt
```

Filtrar pendientes:

```txt
GET http://localhost:3000/api/todos?page=1&limit=5&status=pending
```

Filtrar completadas:

```txt
GET http://localhost:3000/api/todos?page=1&limit=5&status=completed
```

---

## 5. Subir Archivo

```txt
POST http://localhost:3000/api/files/upload
```

En Postman:

```txt
Authorization → Bearer Token
Body → form-data
Key: file
Type: File
Value: seleccionar archivo
```

---

## 6. Listar Archivos

```txt
GET http://localhost:3000/api/files?page=1&limit=5
```

Buscar archivo:

```txt
GET http://localhost:3000/api/files?page=1&limit=5&search=informe
```

Filtrar PDF:

```txt
GET http://localhost:3000/api/files?page=1&limit=5&type=pdf
```

---

# 🌐 Rutas Principales

## Frontend

```txt
GET /app/
```

Abre la interfaz React.

## Autenticación

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

## Tareas

```txt
GET    /api/todos
POST   /api/todos
PUT    /api/todos/:id
PATCH  /api/todos/:id
DELETE /api/todos/:id
```

## Drive

```txt
GET    /api/files
POST   /api/files/upload
GET    /api/files/:id/download
PATCH  /api/files/:id
DELETE /api/files/:id
```

---

# 📚 Descripción Técnica del Proyecto

El sistema está dividido en dos partes:

```txt
Frontend React
Backend Express
```

React no se conecta directamente a MongoDB.
React realiza peticiones HTTP al backend, y el backend se encarga de validar, procesar y guardar los datos.

Flujo general:

```txt
React
↓
fetch()
↓
Express
↓
Controladores
↓
Mongoose / GridFS
↓
MongoDB Atlas
```

---

# 🔑 Autenticación

El proyecto utiliza:

```txt
JWT + bcrypt + localStorage
```

Cuando el usuario se registra, la contraseña se encripta con `bcryptjs` antes de guardarse en MongoDB.

Cuando el usuario inicia sesión, el backend valida sus credenciales y genera un token JWT.
Ese token se guarda en `localStorage` y se envía en cada petición protegida mediante:

```txt
Authorization: Bearer TOKEN
```

Las rutas de tareas y archivos están protegidas con un middleware que valida el token y asigna el usuario autenticado a:

```js
req.user
```

---

# 👥 Datos por Usuario

Cada usuario solo puede ver su propia información.

En tareas se guarda el campo:

```txt
user
```

En archivos se guarda el usuario en los metadatos de GridFS:

```txt
metadata.userId
```

Con esto, el backend filtra tareas y archivos según el usuario autenticado.

---

# 📄 Paginación, Búsqueda, Filtros y Ordenamiento

El proyecto usa paginación para no cargar todos los registros de golpe.

Ejemplo:

```txt
GET /api/todos?page=1&limit=5
GET /api/files?page=1&limit=5
```

También permite:

```txt
Buscar tareas por título o descripción.
Filtrar tareas por pendientes o completadas.
Ordenar tareas por fecha o título.

Buscar archivos por nombre.
Filtrar archivos por tipo.
Ordenar archivos por fecha, tamaño o nombre.
```

Esto ayuda a manejar mejor más datos sin que la interfaz crezca indefinidamente.

---

# 🗂️ Funcionamiento del Drive

El módulo Drive utiliza:

```txt
Multer + GridFS + MongoDB Atlas
```

Proceso de subida:

```txt
Usuario selecciona archivo
↓
React envía el archivo con FormData
↓
Express recibe el archivo con Multer
↓
GridFS guarda el archivo en MongoDB Atlas
↓
Se guardan metadatos del archivo y del usuario propietario
```

GridFS guarda los archivos usando dos colecciones internas:

```txt
driveFiles.files
driveFiles.chunks
```

---

# 📁 Estructura del Proyecto

```txt
todo-list-rest-api/
├── client/                         # Frontend React + Vite
│   ├── src/
│   │   ├── assets/                 # Logo e imágenes
│   │   ├── App.jsx                 # Componente principal
│   │   ├── App.css                 # Estilos
│   │   └── main.jsx                # Entrada de React
│   ├── package.json
│   └── vite.config.js
│
├── src/                            # Backend Express
│   ├── config/
│   │   └── database.js             # Conexión MongoDB Atlas
│   ├── controllers/
│   │   ├── authController.js       # Autenticación
│   │   ├── todoController.js       # Tareas
│   │   └── fileController.js       # Drive con GridFS
│   ├── middlewares/
│   │   └── authMiddleware.js       # Middleware JWT
│   ├── models/
│   │   ├── Todo.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── todoRoutes.js
│   │   └── fileRoutes.js
│   ├── seed/
│   │   └── seed.js                 # Datos iniciales
│   └── app.js
│
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

---

# 🧰 Solución de Problemas

## MongoDB Atlas no conecta

Revisar:

```txt
MONGO_URI
usuario y contraseña de MongoDB Atlas
Network Access en MongoDB Atlas
conexión a internet
```

Para pruebas académicas puede habilitarse temporalmente en Atlas:

```txt
0.0.0.0/0
```

---

## Token inválido o expirado

Volver a iniciar sesión y copiar un token nuevo.

En Postman:

```txt
Authorization → Bearer Token
```

Pegar solo el token.

---

## Error al subir archivo

Verificar que la petición use:

```txt
Body → form-data
Key: file
Type: File
```

No usar `raw JSON` para subir archivos.

---

## React no carga en `/app`

Ejecutar:

```bash
npm run build
```

Luego reiniciar:

```bash
npm run dev
```

Verificar que exista:

```txt
client/dist/index.html
```

---

# 📌 Funcionalidades Implementadas

```txt
[x] Registro e inicio de sesión
[x] Autenticación JWT
[x] Contraseñas encriptadas con bcrypt
[x] Tareas por usuario
[x] Drive por usuario
[x] Subida de archivos con GridFS
[x] CRUD de tareas
[x] CRUD de archivos
[x] Paginación
[x] Búsqueda
[x] Filtros
[x] Ordenamiento
[x] Modales personalizados
[x] Progreso de subida de archivos
[x] Modo claro y oscuro
[x] Despliegue en Render
[x] HTTPS local con certificados .pem
[x] Script seed para datos iniciales
```

---

# 📌 Mejoras Futuras

```txt
[ ] Recuperación de contraseña
[ ] Login con Google
[ ] Previsualización de imágenes y PDF
[ ] Carpetas en Drive
[ ] Favoritos
[ ] Papelera de reciclaje
[ ] Roles avanzados
[ ] Documentación Swagger
[ ] Pruebas automatizadas
```

---

# 🤝 Repositorio

```txt
https://github.com/Mael0502/todo-list-rest-api.git
```

---

# 📄 Licencia

Proyecto académico desarrollado para fines educativos.
