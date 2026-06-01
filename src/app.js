const express = require('express');
const path = require('path');
const fs = require('fs');
const todoRoutes = require('./routes/todoRoutes');
const fileRoutes = require('./routes/fileRoutes');
const authRoutes = require('./routes/authRoutes');
const { protect } = require('./middlewares/authMiddleware');

const app = express();

app.disable('x-powered-by');
app.set('json spaces', 2);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Todo List REST API'
  });
});

app.use('/api/auth', authRoutes);
// Rutas API protegidas con JWT
app.use('/api/todos', protect, todoRoutes);
app.use('/api/files', protect, fileRoutes);
// Vista Pug antigua, se deja sin protección para no romper la vista
app.use('/todos', todoRoutes);

// Servir React desde /app
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');

console.log('Ruta del build de React:', clientDistPath);
console.log('Existe index.html:', fs.existsSync(path.join(clientDistPath, 'index.html')));

app.use('/app', express.static(clientDistPath));

app.get(/^\/app(\/.*)?$/, (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

module.exports = app;