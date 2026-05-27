const crypto = require('crypto');
const Todo = require('../models/Todo');

const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find()
      .select('-__v')
      .sort({ createdAt: -1 })
      .lean();

    if (req.originalUrl.startsWith('/todos')) {
      return res.render('todos', {
        title: 'Lista de tareas',
        todos
      });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const lastUpdated = todos.length > 0
      ? new Date(Math.max(...todos.map(todo => new Date(todo.updatedAt).getTime())))
      : new Date();

    const etagBase = JSON.stringify({
      count: todos.length,
      lastUpdated: lastUpdated.toISOString()
    });

    const etag = `"${crypto
      .createHash('md5')
      .update(etagBase)
      .digest('hex')}"`;

    res.set({
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'ETag': etag,
      'Last-Modified': lastUpdated.toUTCString()
    });

    if (req.headers['if-none-match'] === etag) {
      return res.status(304).end();
    }

    const data = todos.map(todo => ({
      ...todo,
      url: `${baseUrl}/api/todos/${todo._id}`
    }));

    res.status(200).json({
      success: true,
      meta: {
        count: data.length,
        lastUpdated: lastUpdated.toISOString(),
        generatedAt: new Date().toISOString(),
        links: {
          self: `${baseUrl}${req.originalUrl}`
        },
        cache: {
          etag,
          lastModified: lastUpdated.toUTCString()
        }
      },
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las tareas',
      error: error.message
    });
  }
};

const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id)
      .select('-__v')
      .lean();

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const lastModified = new Date(todo.updatedAt);
    const etag = `"${crypto
      .createHash('md5')
      .update(`${todo._id}-${todo.updatedAt}`)
      .digest('hex')}"`;

    res.set({
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'ETag': etag,
      'Last-Modified': lastModified.toUTCString()
    });

    if (req.headers['if-none-match'] === etag) {
      return res.status(304).end();
    }

    res.status(200).json({
      success: true,
      meta: {
        links: {
          self: `${baseUrl}${req.originalUrl}`,
          collection: `${baseUrl}/api/todos`
        },
        cache: {
          etag,
          lastModified: lastModified.toUTCString()
        }
      },
      data: {
        ...todo,
        url: `${baseUrl}/api/todos/${todo._id}`
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la tarea',
      error: error.message
    });
  }
};

const createTodo = async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    const todo = await Todo.create({
      title,
      description,
      completed
    });

    res.set('Cache-Control', 'no-store');

    res.status(201).json({
      success: true,
      message: 'Tarea creada correctamente',
      data: todo
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear la tarea',
      error: error.message
    });
  }
};

const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    res.set('Cache-Control', 'no-store');

    res.status(200).json({
      success: true,
      message: 'Tarea actualizada correctamente',
      data: todo
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar la tarea',
      error: error.message
    });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    res.set('Cache-Control', 'no-store');

    res.status(200).json({
      success: true,
      message: 'Tarea eliminada correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la tarea',
      error: error.message
    });
  }
};

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
};