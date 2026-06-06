const crypto = require('crypto');
const Todo = require('../models/Todo');

const getTodoFilter = (req) => {
  const filter = {};

  if (req.user) {
    filter.user = req.user._id;
  }

  const search = req.query.search?.trim();
  const status = req.query.status;

  if (search) {
    filter.$or = [
      {
        title: {
          $regex: search,
          $options: 'i'
        }
      },
      {
        description: {
          $regex: search,
          $options: 'i'
        }
      }
    ];
  }

  if (status === 'completed') {
    filter.completed = true;
  }

  if (status === 'pending') {
    filter.completed = false;
  }

  return filter;
};

const getTodoSort = (req) => {
  const sort = req.query.sort || 'newest';

  if (sort === 'oldest') {
    return { createdAt: 1 };
  }

  if (sort === 'title_asc') {
    return { title: 1 };
  }

  if (sort === 'title_desc') {
    return { title: -1 };
  }

  return { createdAt: -1 };
};

const formatTodoResponse = (todo, baseUrl) => ({
  _id: todo._id,
  title: todo.title,
  description: todo.description,
  completed: todo.completed,
  user: todo.user,
  createdAt: todo.createdAt,
  updatedAt: todo.updatedAt,
  url: `${baseUrl}/api/todos/${todo._id}`
});

const getAllTodos = async (req, res) => {
  try {
    const filter = getTodoFilter(req);
    const sortOption = getTodoSort(req);

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 5, 1);
    const skip = (page - 1) * limit;

    const total = await Todo.countDocuments(filter);
    const totalPages = Math.max(Math.ceil(total / limit), 1);

    const todos = await Todo.find(filter)
      .select('-__v')
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    if (req.originalUrl.startsWith('/todos')) {
      return res.render('todos', {
        title: 'Lista de tareas',
        todos
      });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const lastUpdated = todos.length > 0
      ? new Date(Math.max(...todos.map((todo) => new Date(todo.updatedAt).getTime())))
      : new Date();

    const etagBase = JSON.stringify({
      user: req.user?._id?.toString() || 'public',
      count: todos.length,
      total,
      page,
      limit,
      search: req.query.search || '',
      status: req.query.status || 'all',
      sort: req.query.sort || 'newest',
      lastUpdated: lastUpdated.toISOString()
    });

    const etag = `"${crypto
      .createHash('md5')
      .update(etagBase)
      .digest('hex')}"`;

    res.set({
      'Cache-Control': 'public, max-age=0, must-revalidate',
      ETag: etag,
      'Last-Modified': lastUpdated.toUTCString()
    });

    if (req.headers['if-none-match'] === etag) {
      return res.status(304).end();
    }

    const data = todos.map((todo) => formatTodoResponse(todo, baseUrl));

    res.status(200).json({
      success: true,
      meta: {
        count: data.length,
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        filters: {
          search: req.query.search || '',
          status: req.query.status || 'all',
          sort: req.query.sort || 'newest'
        },
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
    const filter = {
      _id: req.params.id,
      ...getTodoFilter(req)
    };

    const todo = await Todo.findOne(filter)
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
      .update(`${todo._id}-${todo.updatedAt}-${req.user?._id || 'public'}`)
      .digest('hex')}"`;

    res.set({
      'Cache-Control': 'public, max-age=0, must-revalidate',
      ETag: etag,
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
      data: formatTodoResponse(todo, baseUrl)
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
      completed,
      user: req.user?._id
    });

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const todoUrl = `${baseUrl}/api/todos/${todo._id}`;

    res.set({
      'Cache-Control': 'no-store',
      Location: todoUrl
    });

    res.status(201).json({
      success: true,
      message: 'Tarea creada correctamente',
      data: {
        _id: todo._id,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
        user: todo.user,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt,
        url: todoUrl
      }
    });
  } catch (error) {
    res.set('Cache-Control', 'no-store');

    res.status(400).json({
      success: false,
      message: 'Error al crear la tarea',
      error: error.message
    });
  }
};

const updateTodo = async (req, res) => {
  try {
    const filter = {
      _id: req.params.id,
      user: req.user?._id
    };

    const todo = await Todo.findOneAndUpdate(
      filter,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-__v');

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const todoUrl = `${baseUrl}/api/todos/${todo._id}`;

    res.set('Cache-Control', 'no-store');

    res.status(200).json({
      success: true,
      message: 'Tarea actualizada correctamente',
      data: {
        _id: todo._id,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
        user: todo.user,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt,
        url: todoUrl
      }
    });
  } catch (error) {
    res.set('Cache-Control', 'no-store');

    res.status(400).json({
      success: false,
      message: 'Error al actualizar la tarea',
      error: error.message
    });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const filter = {
      _id: req.params.id,
      user: req.user?._id
    };

    const todo = await Todo.findOneAndDelete(filter);

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