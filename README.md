# Todo List REST API

Proyecto REST API para gestionar tareas usando Node.js, Express, Pug, Mongoose y MongoDB Atlas.

## Tecnologías usadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Pug
- Postman

## Instalación

```bash
npm install

## Módulo Drive

El proyecto incluye un módulo Drive que permite:

- Subir archivos
- Listar archivos
- Descargar archivos
- Editar el nombre visible de un archivo
- Eliminar archivos

Los archivos se almacenan en MongoDB Atlas usando GridFS.

### Rutas Drive

| Método | Ruta | Descripción |
|---|---|---|
| GET | /api/files | Listar archivos |
| POST | /api/files/upload | Subir archivo |
| GET | /api/files/:id/download | Descargar archivo |
| PATCH | /api/files/:id | Editar nombre del archivo |
| DELETE | /api/files/:id | Eliminar archivo |