import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [form, setForm] = useState({
    title: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const API_URL = '/api/todos'

  const getTodos = async () => {
    try {
      const response = await fetch(API_URL)
      const result = await response.json()

      setTodos(result.data || [])
    } catch (error) {
      console.error('Error al obtener tareas:', error)
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm({
      ...form,
      [name]: value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.title.trim()) {
      alert('El título es obligatorio')
      return
    }

    try {
      if (editingId) {
        await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            completed: false
          })
        })

        setEditingId(null)
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            completed: false
          })
        })
      }

      setForm({
        title: '',
        description: ''
      })

      await getTodos()
    } catch (error) {
      console.error('Error al guardar tarea:', error)
    }
  }

  const toggleCompleted = async (todo) => {
    try {
      await fetch(`${API_URL}/${todo._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          completed: !todo.completed
        })
      })

      await getTodos()
    } catch (error) {
      console.error('Error al actualizar estado:', error)
    }
  }

  const startEdit = (todo) => {
    setEditingId(todo._id)
    setForm({
      title: todo.title,
      description: todo.description || ''
    })
  }

  const deleteTodo = async (id) => {
    const confirmDelete = confirm('¿Seguro que deseas eliminar esta tarea?')

    if (!confirmDelete) return

    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })

      await getTodos()
    } catch (error) {
      console.error('Error al eliminar tarea:', error)
    }
  }

  useEffect(() => {
    let ignore = false

    const loadTodos = async () => {
      try {
        setLoading(true)

        const response = await fetch(API_URL)
        const result = await response.json()

        if (!ignore) {
          setTodos(result.data || [])
        }
      } catch (error) {
        if (!ignore) {
          console.error('Error al obtener tareas:', error)
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadTodos()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <main className="app">
      <section className="card">
        <h1>Todo List con React</h1>
        <p className="subtitle">
          Frontend en React consumiendo una API REST con Express y MongoDB Atlas.
        </p>

        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            name="title"
            placeholder="Título de la tarea"
            value={form.title}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Descripción"
            value={form.description}
            onChange={handleChange}
          />

          <button type="submit">
            {editingId ? 'Actualizar tarea' : 'Crear tarea'}
          </button>

          {editingId && (
            <button
              type="button"
              className="secondary"
              onClick={() => {
                setEditingId(null)
                setForm({ title: '', description: '' })
              }}
            >
              Cancelar edición
            </button>
          )}
        </form>
      </section>

      <section className="card">
        <h2>Lista de tareas</h2>

        {loading ? (
          <p>Cargando tareas...</p>
        ) : todos.length === 0 ? (
          <p>No hay tareas registradas.</p>
        ) : (
          <div className="todo-list">
            {todos.map((todo) => (
              <article key={todo._id} className="todo-item">
                <div>
                  <h3 className={todo.completed ? 'completed-title' : ''}>
                    {todo.title}
                  </h3>

                  <p>{todo.description || 'Sin descripción'}</p>

                  <span className={todo.completed ? 'badge done' : 'badge pending'}>
                    {todo.completed ? 'Completada' : 'Pendiente'}
                  </span>
                </div>

                <div className="actions">
                  <button onClick={() => toggleCompleted(todo)}>
                    {todo.completed ? 'Marcar pendiente' : 'Completar'}
                  </button>

                  <button onClick={() => startEdit(todo)}>
                    Editar
                  </button>

                  <button className="danger" onClick={() => deleteTodo(todo._id)}>
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default App