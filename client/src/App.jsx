import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [files, setFiles] = useState([])

  const [form, setForm] = useState({
    title: '',
    description: ''
  })

  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [selectedFile, setSelectedFile] = useState(null)
  const [loadingTodos, setLoadingTodos] = useState(false)
  const [loadingFiles, setLoadingFiles] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [theme, setTheme] = useState('light')

  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })
  const [authMode, setAuthMode] = useState('login')
  const [authLoading, setAuthLoading] = useState(false)

  const TODOS_API = '/api/todos'
  const FILES_API = '/api/files'
  const AUTH_API = '/api/auth'

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${token}`
  })

  const getJsonAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  })

  const getTodos = async () => {
    if (!token) return

    try {
      const response = await fetch(TODOS_API, {
        headers: getAuthHeaders()
      })

      if (response.status === 401) {
        logout()
        return
      }

      const result = await response.json()
      setTodos(result.data || [])
    } catch (error) {
      console.error('Error al obtener tareas:', error)
    }
  }

  const getFiles = async () => {
    if (!token) return

    try {
      const response = await fetch(FILES_API, {
        headers: getAuthHeaders()
      })

      if (response.status === 401) {
        logout()
        return
      }

      const result = await response.json()
      setFiles(result.data || [])
    } catch (error) {
      console.error('Error al obtener archivos:', error)
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm({
      ...form,
      [name]: value
    })
  }

  const handleAuthChange = (event) => {
    const { name, value } = event.target

    setAuthForm({
      ...authForm,
      [name]: value
    })
  }

  const handleAuthSubmit = async (event) => {
    event.preventDefault()

    if (!authForm.email.trim() || !authForm.password.trim()) {
      alert('Correo y contraseña son obligatorios')
      return
    }

    if (authMode === 'register' && !authForm.name.trim()) {
      alert('El nombre es obligatorio para registrarse')
      return
    }

    try {
      setAuthLoading(true)

      const endpoint =
        authMode === 'login'
          ? `${AUTH_API}/login`
          : `${AUTH_API}/register`

      const body =
        authMode === 'login'
          ? {
              email: authForm.email,
              password: authForm.password
            }
          : {
              name: authForm.name,
              email: authForm.email,
              password: authForm.password
            }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const result = await response.json()

      if (!response.ok) {
        alert(result.message || 'Error de autenticación')
        return
      }

      localStorage.setItem('token', result.token)
      localStorage.setItem('user', JSON.stringify(result.data))

      setToken(result.token)
      setUser(result.data)

      setAuthForm({
        name: '',
        email: '',
        password: ''
      })
    } catch (error) {
      console.error('Error de autenticación:', error)
      alert('Error al conectar con el servidor')
    } finally {
      setAuthLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    setToken(null)
    setUser(null)
    setTodos([])
    setFiles([])
    setEditingId(null)
    setForm({
      title: '',
      description: ''
    })
    setSelectedFile(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.title.trim()) {
      alert('El título es obligatorio')
      return
    }

    try {
      if (editingId) {
        await fetch(`${TODOS_API}/${editingId}`, {
          method: 'PUT',
          headers: getJsonAuthHeaders(),
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            completed: false
          })
        })

        setEditingId(null)
      } else {
        await fetch(TODOS_API, {
          method: 'POST',
          headers: getJsonAuthHeaders(),
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
    const confirmAction = confirm(
      todo.completed
        ? `¿Deseas marcar "${todo.title}" como pendiente?`
        : `¿Deseas marcar "${todo.title}" como completada?`
    )

    if (!confirmAction) return

    try {
      await fetch(`${TODOS_API}/${todo._id}`, {
        method: 'PATCH',
        headers: getJsonAuthHeaders(),
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

  const deleteTodo = async (id, title) => {
    const confirmDelete = confirm(`¿Seguro que deseas eliminar la tarea "${title}"?`)

    if (!confirmDelete) return

    try {
      await fetch(`${TODOS_API}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      await getTodos()
    } catch (error) {
      console.error('Error al eliminar tarea:', error)
    }
  }

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
  }

  const uploadFile = async (event) => {
    event.preventDefault()

    if (!selectedFile) {
      alert('Debes seleccionar un archivo')
      return
    }

    const confirmUpload = confirm(`¿Deseas subir el archivo "${selectedFile.name}"?`)

    if (!confirmUpload) return

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      await fetch(`${FILES_API}/upload`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      })

      setSelectedFile(null)
      event.target.reset()

      await getFiles()
    } catch (error) {
      console.error('Error al subir archivo:', error)
    }
  }

  const downloadFile = async (file) => {
    const confirmDownload = confirm(`¿Deseas descargar el archivo "${file.displayName}"?`)

    if (!confirmDownload) return

    try {
      const response = await fetch(`${FILES_API}/${file._id}/download`, {
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        alert('No se pudo descargar el archivo')
        return
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = file.displayName
      document.body.appendChild(link)
      link.click()
      link.remove()

      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error al descargar archivo:', error)
    }
  }

  const editFile = async (file) => {
    const newName = prompt('Nuevo nombre del archivo:', file.displayName)

    if (!newName || !newName.trim()) return

    const confirmEdit = confirm(
      `¿Deseas cambiar el nombre de "${file.displayName}" a "${newName.trim()}"?`
    )

    if (!confirmEdit) return

    try {
      await fetch(`${FILES_API}/${file._id}`, {
        method: 'PATCH',
        headers: getJsonAuthHeaders(),
        body: JSON.stringify({
          displayName: newName.trim()
        })
      })

      await getFiles()
    } catch (error) {
      console.error('Error al editar archivo:', error)
    }
  }

  const deleteFile = async (file) => {
    const confirmDelete = confirm(
      `¿Seguro que deseas eliminar el archivo "${file.displayName}"?\nEsta acción no se puede deshacer.`
    )

    if (!confirmDelete) return

    try {
      await fetch(`${FILES_API}/${file._id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      await getFiles()
    } catch (error) {
      console.error('Error al eliminar archivo:', error)
    }
  }

  const formatDate = (dateValue) => {
    if (!dateValue) return 'Sin fecha'

    return new Date(dateValue).toLocaleString('es-BO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  useEffect(() => {
    if (!token) return

    let ignore = false

    const loadInitialData = async () => {
      try {
        setLoadingTodos(true)
        setLoadingFiles(true)

        const [todosResponse, filesResponse] = await Promise.all([
          fetch(TODOS_API, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          fetch(FILES_API, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        ])

        if (todosResponse.status === 401 || filesResponse.status === 401) {
          logout()
          return
        }

        const todosResult = await todosResponse.json()
        const filesResult = await filesResponse.json()

        if (!ignore) {
          setTodos(todosResult.data || [])
          setFiles(filesResult.data || [])
        }
      } catch (error) {
        if (!ignore) {
          console.error('Error al cargar datos iniciales:', error)
        }
      } finally {
        if (!ignore) {
          setLoadingTodos(false)
          setLoadingFiles(false)
        }
      }
    }

    loadInitialData()

    return () => {
      ignore = true
    }
  }, [token])

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [theme])

  if (!token || !user) {
    return (
      <main className="app">
        <section className="auth-card">
          <h1>{authMode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h1>

          <p className="auth-subtitle">
            Accede para usar Todo List y Drive.
          </p>

          <form onSubmit={handleAuthSubmit} className="form">
            {authMode === 'register' && (
              <input
                type="text"
                name="name"
                placeholder="Nombre"
                value={authForm.name}
                onChange={handleAuthChange}
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={authForm.email}
              onChange={handleAuthChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={authForm.password}
              onChange={handleAuthChange}
            />

            <button type="submit" disabled={authLoading}>
              {authLoading
                ? 'Procesando...'
                : authMode === 'login'
                  ? 'Entrar'
                  : 'Registrarse'}
            </button>
          </form>

          <button
            type="button"
            className="auth-switch-button"
            onClick={() => {
              setAuthMode(authMode === 'login' ? 'register' : 'login')
              setAuthForm({
                name: '',
                email: '',
                password: ''
              })
            }}
          >
            {authMode === 'login'
              ? 'No tengo cuenta, registrarme'
              : 'Ya tengo cuenta, iniciar sesión'}
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="app">
      <header className="main-header">
        <div>
          <h1>Todo List | Drive</h1>
          <p className="user-session">
            Sesión activa: {user.name} — {user.email}
          </p>
        </div>

        <div className="header-actions">
          <div className="theme-switch">
            <button
              type="button"
              className={`theme-option ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
            >
              <span className="theme-icon">☼</span>
              <span>Claro</span>
            </button>

            <button
              type="button"
              className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
            >
              <span className="theme-icon">◐</span>
              <span>Oscuro</span>
            </button>
          </div>

          <button type="button" className="logout-button" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <section className="modules-grid">
        <section className="module-card">
          <h2>Todo List</h2>

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

          <div className="section-title">
            <h3>Lista de tareas</h3>
          </div>

          {loadingTodos ? (
            <p>Cargando tareas...</p>
          ) : todos.length === 0 ? (
            <p>No hay tareas registradas para este usuario.</p>
          ) : (
            <div className="todo-list">
              {todos.map((todo) => (
                <article key={todo._id} className="todo-item">
                  <div>
                    <h4 className={todo.completed ? 'completed-title' : ''}>
                      {todo.title}
                    </h4>

                    <p>{todo.description || 'Sin descripción'}</p>

                    <span className={todo.completed ? 'badge done' : 'badge pending'}>
                      {todo.completed ? 'Completada' : 'Pendiente'}
                    </span>
                  </div>

                  <div className="actions">
                    <button onClick={() => toggleCompleted(todo)}>
                      {todo.completed ? 'Pendiente' : 'Completar'}
                    </button>

                    <button onClick={() => startEdit(todo)}>
                      Editar
                    </button>

                    <button
                      className="danger"
                      onClick={() => deleteTodo(todo._id, todo.title)}
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="module-card">
          <h2>Drive</h2>

          <form onSubmit={uploadFile} className="form">
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
            />

            <button type="submit">
              Subir archivo
            </button>
          </form>

          <div className="section-title">
            <h3>Archivos subidos</h3>
          </div>

          {loadingFiles ? (
            <p>Cargando archivos...</p>
          ) : files.length === 0 ? (
            <p>No hay archivos subidos para este usuario.</p>
          ) : (
            <div className="files-table-wrapper">
              <table className="files-table">
                <thead>
                  <tr>
                    <th>Nombre del archivo</th>
                    <th>Fecha de creación</th>
                    <th>Tipo</th>
                    <th>Tamaño</th>
                    <th>Botones</th>
                  </tr>
                </thead>

                <tbody>
                  {files.map((file) => (
                    <tr key={file._id}>
                      <td>{file.displayName}</td>
                      <td>{formatDate(file.createdAt)}</td>
                      <td>{file.mimeType}</td>
                      <td>{file.sizeFormatted}</td>
                      <td>
                        <div className="table-actions">
                          <button onClick={() => downloadFile(file)}>
                            Descargar
                          </button>

                          <button onClick={() => editFile(file)}>
                            Editar
                          </button>

                          <button
                            className="danger"
                            onClick={() => deleteFile(file)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  )
}

export default App