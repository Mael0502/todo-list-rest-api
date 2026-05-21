const express = require('express');
const path = require('path');
const todoRoutes = require('./routes/todoRoutes');

const app = express();

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

app.use('/api/todos', todoRoutes);
app.use('/todos', todoRoutes);
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});
module.exports = app;