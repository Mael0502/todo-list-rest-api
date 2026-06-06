# Todo List | Drive

Aplicación web full-stack desarrollada con **React + Vite** en el frontend y **Node.js + Express** en el backend.
Permite gestionar tareas y archivos tipo Drive desde una misma interfaz, con autenticación JWT, almacenamiento en MongoDB Atlas, subida de archivos con GridFS, paginación, búsqueda, filtros, ordenamiento y despliegue en la nube.

---

## 👤 Autor

**Amilcar Diego Revollo Bernal**

Proyecto académico - Universidad Mayor de San Simón

---

## 📚 Descripción del Proyecto

Este proyecto integra dos módulos principales en una sola aplicación web:

```txt
Todo List | Drive
```

### Módulo Todo List

Permite al usuario autenticado:

* Crear tareas.
* Listar tareas.
* Editar tareas.
* Marcar tareas como completadas o pendientes.
* Eliminar tareas.
* Buscar tareas por título o descripción.
* Filtrar tareas por estado: todas, pendientes o completadas.
* Ordenar tareas por fecha o título.
* Usar paginación para evitar listas infinitas.

### Módulo Drive

Permite al usuario autenticado:

* Subir archivos.
* Listar archivos subidos.
* Descargar archivos.
* Editar el nombre visible de un archivo.
* Eliminar archivos.
* Buscar archivos por nombre.
* Filtrar archivos por tipo: imágenes, PDF, texto u otros.
* Ordenar archivos por fecha, tamaño o nombre.
* Usar paginación.
* Visualizar una ventana de progreso durante la subida de archivos.

---

## 🚀 Tecnologías Utilizadas

### Frontend

* React
* Vite
* JavaScript
* CSS
* Fetch API
* LocalStorage

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* GridFS
* Multer
* JWT
* bcryptjs
* dotenv
* nodemon

### Herramientas

* Git
* GitHub
* Postman
* Render
* MongoDB Atlas

---

## 📁 Estructura del Proyecto

```txt
todo-list-rest-api/
├── client/                         # Frontend React + Vite
│   ├── dist/                       # Build de producción generado por Vite
│   ├── public/                     # Archivos públicos
│   ├── src/
│   │   ├── assets/                 # Imágenes y recursos estáticos
│   │   │   └── umss-logo.png
│   │   ├── App.jsx                 # Componente principal de React
│   │   ├── App.css                 # Estilos principales
│   │   └── main.jsx                # Punto de entrada de React
│   ├── package.json
│   └── vite.config.js
│
├── src/                            # Backend Express
│   ├── config/
│   │   └── database.js             # Conexión a MongoDB Atlas
│   ├── controllers/
│   │   ├── authController.js       # Registro, login y autenticación
│   │   ├── todoController.js       # CRUD, búsqueda, filtros y paginación de tareas
│   │   └── fileController.js       # Drive con GridFS
│   ├── middlewares/
│   │   └── authMiddleware.js       # Protección de rutas con JWT
│   ├── models/
│   │   ├── Todo.js                 # Modelo de tareas
│   │   └── User.js                 # Modelo de usuarios
│   ├── routes/
│   │   ├── authRoutes.js           # Rutas de autenticación
│   │   ├── todoRoutes.js           # Rutas de tareas
│   │   └── fileRoutes.js           # Rutas de archivos
│   ├── seed/
│   │   └── seed.js                 # Carga de datos iniciales
│   ├── views/                      # Vistas Pug iniciales
│   └── app.js                      # Configuración principal de Express
│
├── .env.example                    # Plantilla de variables de entorno
├── .gitignore                      # Archivos ignorados por Git
├── package.json                    # Scripts y dependencias del backend
├── package-lock.json
├── README.md
└── server.js                       # Punto de entrada del servidor
```

---

## ⚙️ Requisitos Previos

Antes de instalar el proyecto, se debe tener instalado:

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

Para verificar:

```bash
node -v
npm -v
git --version
```

---

## 🔐 Variables de Entorno

El proyecto utiliza un archivo `.env` para guardar configuraciones privadas.

El archivo `.env` real **no debe subirse al repositorio**.

Se incluye un archivo `.env.example` como plantilla:

```env
# ==============================
# CONFIGURACIÓN DEL SERVIDOR
# ==============================

PORT=3000


# ==============================
# BASE DE DATOS MONGODB ATLAS
# ==============================
# Reemplazar con la cadena real de MongoDB Atlas.
# No subir el archivo .env real al repositorio.

MONGO_URI=mongodb+srv://USUARIO:PASSWORD@CLUSTER.mongodb.net/NOMBRE_BASE_DATOS?retryWrites=true&w=majority


# ==============================
# AUTENTICACIÓN JWT
# ==============================
# Clave secreta usada para firmar tokens JWT.
# Cambiar por una clave segura.

JWT_SECRET=coloca_aqui_una_clave_secreta_segura
JWT_EXPIRES_IN=7d
```

Para configurar el proyecto, crear un archivo `.env` en la raíz:

```bash
cp .env.example .env
```

En Windows también se puede crear manualmente el archivo `.env`.

---

## 🛡️ Seguridad del Repositorio

El archivo `.gitignore` debe evitar subir información sensible:

```gitignore
# Dependencias
node_modules/
client/node_modules/

# Variables de entorno
.env
.env.local
.env.*.local

# Build de React
client/dist/

# Certificados HTTPS locales
certs/
*.pem

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Sistema operativo
.DS_Store
Thumbs.db
```

No se debe subir al repositorio:

```txt
.env
contraseñas reales
credenciales de MongoDB Atlas
JWT_SECRET real
archivos .pem
node_modules
```

---

## 🚀 Instalación Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/Mael0502/todo-list-rest-api.git
cd todo-list-rest-api
```

---

### 2. Instalar dependencias del backend

```bash
npm install
```

---

### 3. Instalar dependencias del frontend

```bash
npm install --prefix client
```

---

### 4. Configurar variables de entorno

Crear el archivo `.env` en la raíz del proyecto usando `.env.example` como guía:

```env
MONGO_URI=tu_cadena_real_de_mongodb_atlas
PORT=3000
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=7d
```

---

### 5. Compilar React

```bash
npm run build
```

Este comando instala dependencias del cliente y genera el build de React en:

```txt
client/dist
```

---

### 6. Cargar datos iniciales

El proyecto incluye un script para cargar datos de prueba por lotes.

Ejecutar:

```bash
npm run seed
```

Este comando crea:

```txt
1 usuario demo
10 tareas demo asociadas al usuario
```

Credenciales de prueba:

```txt
Correo: demo@test.com
Contraseña: 123456
```

---

### 7. Iniciar el servidor

```bash
npm run dev
```

El servidor se ejecutará en:

```txt
http://localhost:3000
```

La aplicación React se sirve desde:

```txt
http://localhost:3000/app/
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

Luego acceder a:

```txt
http://localhost:3000/app/
```

Iniciar sesión con:

```txt
Correo: demo@test.com
Contraseña: 123456
```

---

## 🧪 Comandos Disponibles

```bash
npm run dev
```

Inicia el servidor con nodemon en modo desarrollo.

```bash
npm start
```

Inicia el servidor en modo normal.

```bash
npm run build
```

Instala dependencias del frontend y genera el build de React.

```bash
npm run seed
```

Carga usuario y tareas de prueba en MongoDB Atlas.

---

## 🌐 Rutas Principales

### Frontend

```txt
GET /app/
```

Abre la aplicación React.

---

### Autenticación

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

---

### Tareas

```txt
GET    /api/todos
GET    /api/todos/:id
POST   /api/todos
PUT    /api/todos/:id
PATCH  /api/todos/:id
DELETE /api/todos/:id
```

---

### Drive / Archivos

```txt
GET    /api/files
POST   /api/files/upload
GET    /api/files/:id/download
PATCH  /api/files/:id
DELETE /api/files/:id
```

---

## 🔑 Autenticación

El proyecto utiliza:

```txt
JWT + bcrypt + localStorage
```

### Registro

Cuando un usuario se registra, el backend recibe:

```txt
name
email
password
```

La contraseña se encripta con `bcryptjs` antes de guardarse en MongoDB.

---

### Login

Cuando el usuario inicia sesión, el backend valida el correo y contraseña.
Si son correctos, genera un token JWT.

El frontend guarda el token en:

```txt
localStorage
```

Luego, cada petición protegida envía el token en el header:

```txt
Authorization: Bearer TOKEN
```

---

### Middleware de protección

Las rutas de tareas y archivos están protegidas con JWT.
El middleware verifica el token, obtiene el usuario autenticado y lo asigna a:

```js
req.user
```

Gracias a esto, el backend sabe qué usuario está realizando cada acción.

---

## 👥 Separación de Datos por Usuario

Cada tarea y archivo pertenece a un usuario.

En tareas se guarda el campo:

```txt
user
```

En archivos se guarda en metadatos de GridFS:

```txt
metadata.userId
```

Esto permite que:

```txt
Usuario A solo vea sus tareas y archivos.
Usuario B solo vea sus tareas y archivos.
Un usuario no pueda modificar datos de otro usuario.
```

---

## 📄 Paginación, Búsqueda, Filtros y Ordenamiento

El proyecto implementa paginación para evitar que las listas crezcan indefinidamente.

### Tareas

Ejemplo:

```txt
GET /api/todos?page=1&limit=5
```

Con búsqueda:

```txt
GET /api/todos?page=1&limit=5&search=defensa
```

Con filtro por estado:

```txt
GET /api/todos?page=1&limit=5&status=pending
GET /api/todos?page=1&limit=5&status=completed
```

Con ordenamiento:

```txt
GET /api/todos?page=1&limit=5&sort=newest
GET /api/todos?page=1&limit=5&sort=oldest
GET /api/todos?page=1&limit=5&sort=title_asc
GET /api/todos?page=1&limit=5&sort=title_desc
```

---

### Archivos

Ejemplo:

```txt
GET /api/files?page=1&limit=5
```

Con búsqueda:

```txt
GET /api/files?page=1&limit=5&search=informe
```

Con filtro por tipo:

```txt
GET /api/files?page=1&limit=5&type=image
GET /api/files?page=1&limit=5&type=pdf
GET /api/files?page=1&limit=5&type=text
GET /api/files?page=1&limit=5&type=other
```

Con ordenamiento:

```txt
GET /api/files?page=1&limit=5&sort=newest
GET /api/files?page=1&limit=5&sort=oldest
GET /api/files?page=1&limit=5&sort=size_desc
GET /api/files?page=1&limit=5&sort=size_asc
GET /api/files?page=1&limit=5&sort=name_asc
GET /api/files?page=1&limit=5&sort=name_desc
```

---

## 🗂️ Funcionamiento del Drive

El módulo Drive utiliza:

```txt
Multer + GridFS + MongoDB Atlas
```

### Proceso de subida

```txt
Usuario selecciona archivo
↓
React envía el archivo con FormData
↓
Express recibe el archivo con Multer
↓
GridFS guarda el archivo en MongoDB Atlas
↓
Se guardan metadatos como usuario, nombre, tipo y tamaño
```

GridFS crea internamente colecciones como:

```txt
driveFiles.files
driveFiles.chunks
```

La colección `.files` guarda metadatos.
La colección `.chunks` guarda el contenido binario del archivo dividido en partes.

---

## 🧪 Pruebas en Postman

### 1. Registrar usuario

```txt
POST http://localhost:3000/api/auth/register
```

Body → raw → JSON:

```json
{
  "name": "Usuario Demo",
  "email": "demo@test.com",
  "password": "123456"
}
```

---

### 2. Iniciar sesión

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

Respuesta esperada:

```json
{
  "success": true,
  "message": "Inicio de sesión correcto",
  "token": "TOKEN_JWT",
  "data": {
    "_id": "ID_USUARIO",
    "name": "Usuario Demo",
    "email": "demo@test.com"
  }
}
```

Copiar el valor del token.

---

### 3. Usar rutas protegidas

En Postman:

```txt
Authorization → Type → Bearer Token
```

Pegar solamente el token, sin escribir `Bearer`.

---

### 4. Crear tarea

```txt
POST http://localhost:3000/api/todos
```

Body → raw → JSON:

```json
{
  "title": "Tarea creada desde Postman",
  "description": "Prueba de creación usando JWT",
  "completed": false
}
```

---

### 5. Listar tareas

```txt
GET http://localhost:3000/api/todos?page=1&limit=5
```

---

### 6. Probar búsqueda de tareas

```txt
GET http://localhost:3000/api/todos?page=1&limit=5&search=jwt
```

---

### 7. Probar filtros de tareas

```txt
GET http://localhost:3000/api/todos?page=1&limit=5&status=pending
```

```txt
GET http://localhost:3000/api/todos?page=1&limit=5&status=completed
```

---

### 8. Subir archivo

```txt
POST http://localhost:3000/api/files/upload
```

En Postman:

```txt
Authorization → Bearer Token
Body → form-data
```

Agregar:

```txt
Key: file
Type: File
Value: seleccionar archivo
```

---

### 9. Listar archivos

```txt
GET http://localhost:3000/api/files?page=1&limit=5
```

---

### 10. Buscar archivos

```txt
GET http://localhost:3000/api/files?page=1&limit=5&search=informe
```

---

### 11. Filtrar archivos por tipo

```txt
GET http://localhost:3000/api/files?page=1&limit=5&type=pdf
```

---

## 🚀 Despliegue en Render

El proyecto puede desplegarse en Render como un Web Service.

### Configuración recomendada

```txt
Build Command:
npm install && npm run build

Start Command:
npm start
```

### Variables de entorno en Render

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
```

Ejemplo:

```txt
PORT=3000
JWT_EXPIRES_IN=7d
```

No colocar credenciales directamente en el código.

---

### URL de producción

Si el servicio está desplegado en Render, la aplicación se accede desde:

```txt
https://todo-list-rest-api-nzt3.onrender.com/app/
```

Las rutas API quedan disponibles bajo el mismo dominio:

```txt
https://todo-list-rest-api-nzt3.onrender.com/api/auth/login
https://todo-list-rest-api-nzt3.onrender.com/api/todos
https://todo-list-rest-api-nzt3.onrender.com/api/files
```

---

## 🔒 HTTPS

En producción, Render proporciona HTTPS automáticamente mediante una URL segura:

```txt
https://...
```

Esto permite que credenciales, tokens JWT, tareas y archivos viajen cifrados entre navegador y servidor.

En entorno local, el proyecto se ejecuta normalmente en:

```txt
http://localhost:3000
```

Si se requiere HTTPS local con certificados `.pem`, se debe configurar el servidor con el módulo nativo `https` de Node.js y certificados locales.
Los certificados no deben subirse al repositorio y deben mantenerse ignorados mediante `.gitignore`.

---

## 🧰 Solución de Problemas

### Error de conexión con MongoDB Atlas

Revisar:

```txt
MONGO_URI
usuario y contraseña de MongoDB Atlas
Network Access en MongoDB Atlas
conexión a internet
```

En MongoDB Atlas, verificar:

```txt
Database Access
Network Access
```

Para pruebas académicas puede habilitarse temporalmente:

```txt
0.0.0.0/0
```

---

### Error: Token inválido o expirado

Volver a iniciar sesión y copiar un token nuevo.

En Postman, usar:

```txt
Authorization → Bearer Token
```

Pegar solo el token, sin comillas y sin escribir `Bearer`.

---

### Error al subir archivo

Verificar:

```txt
Body → form-data
Key: file
Type: File
```

No usar `raw JSON` para subir archivos.

---

### React no carga en /app

Ejecutar:

```bash
npm run build
```

Luego iniciar:

```bash
npm run dev
```

Verificar que exista:

```txt
client/dist/index.html
```

---

## 🧪 Datos de Prueba

El proyecto incluye datos de prueba mediante:

```bash
npm run seed
```

Credenciales generadas:

```txt
Correo: demo@test.com
Contraseña: 123456
```

Con este usuario se pueden probar:

```txt
login
tareas
búsqueda
filtros
ordenamiento
paginación
Drive
```

---

## 📌 Funcionalidades Implementadas

```txt
[x] Registro de usuario
[x] Inicio de sesión
[x] Autenticación JWT
[x] Encriptación de contraseñas con bcrypt
[x] Protección de rutas
[x] Separación de datos por usuario
[x] CRUD de tareas
[x] CRUD de archivos
[x] Almacenamiento con GridFS
[x] Paginación de tareas
[x] Paginación de archivos
[x] Buscador de tareas
[x] Buscador de archivos
[x] Filtros de tareas
[x] Filtros de archivos
[x] Ordenamiento de tareas
[x] Ordenamiento de archivos
[x] Modales personalizados
[x] Ventana de progreso al subir archivos
[x] Modo claro y oscuro
[x] Footer con repositorio GitHub
[x] Despliegue en Render
[x] Script de carga de datos iniciales
```

---

## 📌 Mejoras Futuras

```txt
[ ] Recuperación de contraseña
[ ] Inicio de sesión con Google
[ ] Previsualización de imágenes y PDF
[ ] Carpetas en Drive
[ ] Favoritos
[ ] Papelera de reciclaje
[ ] Roles avanzados de usuario
[ ] Documentación Swagger
[ ] Pruebas automatizadas
```

---

## 🤝 Repositorio

Código fuente disponible en:

```txt
https://github.com/Mael0502/todo-list-rest-api.git
```

---

## 📄 Licencia

Proyecto académico desarrollado para fines educativos.
