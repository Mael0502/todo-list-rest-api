import { useEffect, useRef, useState } from 'react'
import './App.css'
import umssLogo from './assets/umss-logo.png'

function ThemeToggle({ theme, setTheme }) {
  const isDarkMode = theme === 'dark'

  return (
    <div className="theme-switch">
      <button
        type="button"
        className={`theme-option ${!isDarkMode ? 'active' : ''}`}
        onClick={() => setTheme('light')}
      >
        <span className="theme-icon">☼</span>
        <span>Claro</span>
      </button>

      <button
        type="button"
        className={`theme-option ${isDarkMode ? 'active' : ''}`}
        onClick={() => setTheme('dark')}
      >
        <span className="theme-icon">◐</span>
        <span>Oscuro</span>
      </button>
    </div>
  )
}

const initialModal = {
  visible: false,
  type: 'message',
  title: '',
  message: '',
  confirmText: 'Aceptar',
  cancelText: 'Cancelar',
  inputValue: '',
  loading: false
}

function App() {
  const modalActionRef = useRef(null)

  const [todos, setTodos] = useState([])
  const [files, setFiles] = useState([])

  const [todoPage, setTodoPage] = useState(1)
  const [filePage, setFilePage] = useState(1)

  const [todoMeta, setTodoMeta] = useState({
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  })

  const [fileMeta, setFileMeta] = useState({
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  })

  const TODO_LIMIT = 5
  const FILE_LIMIT = 5

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

  const [uploadToast, setUploadToast] = useState({
    visible: false,
    status: 'idle',
    fileName: '',
    progress: 0,
    message: ''
  })

  const [modal, setModal] = useState(initialModal)

  const [loadingTodos, setLoadingTodos] = useState(false)
  const [loadingFiles, setLoadingFiles] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [theme, setTheme] = useState('dark')

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

  const closeModal = () => {
    modalActionRef.current = null
    setModal(initialModal)
  }

  const showMessage = ({ title, message, confirmText = 'Aceptar' }) => {
    modalActionRef.current = null

    setModal({
      visible: true,
      type: 'message',
      title,
      message,
      confirmText,
      cancelText: '',
      inputValue: '',
      loading: false
    })
  }

  const showConfirm = ({
    title,
    message,
    confirmText = 'Aceptar',
    cancelText = 'Cancelar',
    onConfirm
  }) => {
    modalActionRef.current = onConfirm || null

    setModal({
      visible: true,
      type: 'confirm',
      title,
      message,
      confirmText,
      cancelText,
      inputValue: '',
      loading: false
    })
  }

  const showInput = ({
    title,
    message,
    initialValue = '',
    confirmText = 'Guardar',
    cancelText = 'Cancelar',
    onConfirm
  }) => {
    modalActionRef.current = onConfirm || null

    setModal({
      visible: true,
      type: 'input',
      title,
      message,
      confirmText,
      cancelText,
      inputValue: initialValue,
      loading: false
    })
  }

  const handleModalConfirm = async () => {
    if (modal.type === 'message') {
      closeModal()
      return
    }

    const action = modalActionRef.current
    const currentInputValue = modal.inputValue
    const currentType = modal.type

    if (!action) {
      closeModal()
      return
    }

    try {
      setModal((previous) => ({
        ...previous,
        loading: true
      }))

      if (currentType === 'input') {
        await action(currentInputValue)
      } else {
        await action()
      }

      closeModal()
    } catch (error) {
      console.error('Error en acción del modal:', error)

      modalActionRef.current = null

      setModal({
        visible: true,
        type: 'message',
        title: 'Error',
        message: 'No se pudo completar la acción solicitada.',
        confirmText: 'Aceptar',
        cancelText: '',
        inputValue: '',
        loading: false
      })
    }
  }

  const resetUploadToast = () => {
    setUploadToast({
      visible: false,
      status: 'idle',
      fileName: '',
      progress: 0,
      message: ''
    })
  }

  const resetPagination = () => {
    setTodoPage(1)
    setFilePage(1)

    setTodoMeta({
      page: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false
    })

    setFileMeta({
      page: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false
    })
  }

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${token}`
  })

  const getJsonAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  })

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
    resetUploadToast()
    resetPagination()
  }

  const requestLogout = () => {
    showConfirm({
      title: 'Cerrar sesión',
      message: '¿Seguro que deseas cerrar tu sesión actual?',
      confirmText: 'Cerrar sesión',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        logout()
      }
    })
  }

  const getTodos = async (page = todoPage) => {
    if (!token) return

    try {
      const response = await fetch(`${TODOS_API}?page=${page}&limit=${TODO_LIMIT}`, {
        headers: getAuthHeaders()
      })

      if (response.status === 401) {
        logout()
        return
      }

      const result = await response.json()

      setTodos(result.data || [])
      setTodoMeta(result.meta || {
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
      })
    } catch (error) {
      console.error('Error al obtener tareas:', error)

      showMessage({
        title: 'Error al cargar tareas',
        message: 'No se pudieron obtener las tareas del usuario.'
      })
    }
  }

  const getFiles = async (page = filePage) => {
    if (!token) return

    try {
      const response = await fetch(`${FILES_API}?page=${page}&limit=${FILE_LIMIT}`, {
        headers: getAuthHeaders()
      })

      if (response.status === 401) {
        logout()
        return
      }

      const result = await response.json()

      setFiles(result.data || [])
      setFileMeta(result.meta || {
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
      })
    } catch (error) {
      console.error('Error al obtener archivos:', error)

      showMessage({
        title: 'Error al cargar archivos',
        message: 'No se pudieron obtener los archivos del usuario.'
      })
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
      showMessage({
        title: 'Campos obligatorios',
        message: 'Correo y contraseña son obligatorios.'
      })
      return
    }

    if (authMode === 'register' && !authForm.name.trim()) {
      showMessage({
        title: 'Campo obligatorio',
        message: 'El nombre es obligatorio para registrarse.'
      })
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
        showMessage({
          title: authMode === 'login' ? 'Error de inicio de sesión' : 'Error de registro',
          message: result.message || 'No se pudo completar la autenticación.'
        })
        return
      }

      localStorage.setItem('token', result.token)
      localStorage.setItem('user', JSON.stringify(result.data))

      setToken(result.token)
      setUser(result.data)
      resetPagination()

      setAuthForm({
        name: '',
        email: '',
        password: ''
      })
    } catch (error) {
      console.error('Error de autenticación:', error)

      showMessage({
        title: 'Error de conexión',
        message: 'No se pudo conectar con el servidor.'
      })
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.title.trim()) {
      showMessage({
        title: 'Campo obligatorio',
        message: 'El título de la tarea es obligatorio.'
      })
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
        await getTodos(todoPage)
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

        setTodoPage(1)
        await getTodos(1)
      }

      setForm({
        title: '',
        description: ''
      })
    } catch (error) {
      console.error('Error al guardar tarea:', error)

      showMessage({
        title: 'Error al guardar tarea',
        message: 'No se pudo guardar la tarea.'
      })
    }
  }

  const toggleCompleted = (todo) => {
    showConfirm({
      title: todo.completed ? 'Marcar como pendiente' : 'Completar tarea',
      message: todo.completed
        ? `¿Deseas marcar "${todo.title}" como pendiente?`
        : `¿Deseas marcar "${todo.title}" como completada?`,
      confirmText: todo.completed ? 'Marcar pendiente' : 'Completar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        await fetch(`${TODOS_API}/${todo._id}`, {
          method: 'PATCH',
          headers: getJsonAuthHeaders(),
          body: JSON.stringify({
            completed: !todo.completed
          })
        })

        await getTodos(todoPage)
      }
    })
  }

  const startEdit = (todo) => {
    setEditingId(todo._id)
    setForm({
      title: todo.title,
      description: todo.description || ''
    })
  }

  const deleteTodo = (id, title) => {
    showConfirm({
      title: 'Eliminar tarea',
      message: `¿Seguro que deseas eliminar la tarea "${title}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        await fetch(`${TODOS_API}/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        })

        const shouldGoBack = todos.length === 1 && todoPage > 1
        const nextPage = shouldGoBack ? todoPage - 1 : todoPage

        setTodoPage(nextPage)
        await getTodos(nextPage)
      }
    })
  }

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
  }

  const uploadFileConfirmed = async (file, formElement) => {
    const fileName = file.name

    setUploadToast({
      visible: true,
      status: 'uploading',
      fileName,
      progress: 0,
      message: 'Subiendo archivo...'
    })

    const formData = new FormData()
    formData.append('file', file)

    const xhr = new XMLHttpRequest()

    xhr.open('POST', `${FILES_API}/upload`)
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)

    xhr.upload.onprogress = (progressEvent) => {
      if (progressEvent.lengthComputable) {
        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)

        setUploadToast((previous) => ({
          ...previous,
          progress,
          message: progress >= 100 ? 'Procesando archivo...' : 'Subiendo archivo...'
        }))
      }
    }

    xhr.onload = async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setUploadToast({
          visible: true,
          status: 'success',
          fileName,
          progress: 100,
          message: 'Archivo subido correctamente'
        })

        setSelectedFile(null)
        formElement.reset()

        setFilePage(1)
        await getFiles(1)

        setTimeout(() => {
          resetUploadToast()
        }, 3500)

        return
      }

      let errorMessage = 'Error al subir el archivo'

      try {
        const response = JSON.parse(xhr.responseText)
        errorMessage = response.message || errorMessage
      } catch {
        errorMessage = 'Error al subir el archivo'
      }

      setUploadToast({
        visible: true,
        status: 'error',
        fileName,
        progress: 0,
        message: errorMessage
      })
    }

    xhr.onerror = () => {
      setUploadToast({
        visible: true,
        status: 'error',
        fileName,
        progress: 0,
        message: 'Error de conexión al subir el archivo'
      })
    }

    xhr.send(formData)
  }

  const uploadFile = (event) => {
    event.preventDefault()

    if (!selectedFile) {
      showMessage({
        title: 'Archivo requerido',
        message: 'Debes seleccionar un archivo antes de subirlo.'
      })
      return
    }

    const formElement = event.currentTarget
    const file = selectedFile

    showConfirm({
      title: 'Subir archivo',
      message: `¿Deseas subir el archivo "${file.name}"?`,
      confirmText: 'Subir archivo',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        await uploadFileConfirmed(file, formElement)
      }
    })
  }

  const downloadFile = (file) => {
    showConfirm({
      title: 'Descargar archivo',
      message: `¿Deseas descargar el archivo "${file.displayName}"?`,
      confirmText: 'Descargar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        const response = await fetch(`${FILES_API}/${file._id}/download`, {
          headers: getAuthHeaders()
        })

        if (!response.ok) {
          showMessage({
            title: 'Error de descarga',
            message: 'No se pudo descargar el archivo.'
          })
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
      }
    })
  }

  const editFile = (file) => {
    showInput({
      title: 'Editar archivo',
      message: 'Escribe el nuevo nombre visible del archivo.',
      initialValue: file.displayName,
      confirmText: 'Guardar cambios',
      cancelText: 'Cancelar',
      onConfirm: async (newName) => {
        if (!newName || !newName.trim()) {
          showMessage({
            title: 'Nombre inválido',
            message: 'El nombre del archivo no puede estar vacío.'
          })
          return
        }

        await fetch(`${FILES_API}/${file._id}`, {
          method: 'PATCH',
          headers: getJsonAuthHeaders(),
          body: JSON.stringify({
            displayName: newName.trim()
          })
        })

        await getFiles(filePage)
      }
    })
  }

  const deleteFile = (file) => {
    showConfirm({
      title: 'Eliminar archivo',
      message: `¿Seguro que deseas eliminar el archivo "${file.displayName}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        await fetch(`${FILES_API}/${file._id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        })

        const shouldGoBack = files.length === 1 && filePage > 1
        const nextPage = shouldGoBack ? filePage - 1 : filePage

        setFilePage(nextPage)
        await getFiles(nextPage)
      }
    })
  }

  const goToPreviousTodos = () => {
    if (!todoMeta.hasPrevPage) return

    const previousPage = todoMeta.page - 1
    setTodoPage(previousPage)
    getTodos(previousPage)
  }

  const goToNextTodos = () => {
    if (!todoMeta.hasNextPage) return

    const nextPage = todoMeta.page + 1
    setTodoPage(nextPage)
    getTodos(nextPage)
  }

  const goToPreviousFiles = () => {
    if (!fileMeta.hasPrevPage) return

    const previousPage = fileMeta.page - 1
    setFilePage(previousPage)
    getFiles(previousPage)
  }

  const goToNextFiles = () => {
    if (!fileMeta.hasNextPage) return

    const nextPage = fileMeta.page + 1
    setFilePage(nextPage)
    getFiles(nextPage)
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
          fetch(`${TODOS_API}?page=1&limit=${TODO_LIMIT}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          fetch(`${FILES_API}?page=1&limit=${FILE_LIMIT}`, {
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

          setTodoPage(todosResult.meta?.page || 1)
          setFilePage(filesResult.meta?.page || 1)

          setTodoMeta(todosResult.meta || {
            page: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false
          })

          setFileMeta(filesResult.meta || {
            page: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false
          })
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

  return (
    <main className={`app page ${theme}`}>
      <header className="global-topbar">
        <div className="global-topbar-left">
          <img src={umssLogo} alt="Logo UMSS" className="umss-logo" />
        </div>

        <div className="global-topbar-right">
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </header>

      {!token || !user ? (
        <section className="auth-card">
          <h1 className="auth-title">
            {authMode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </h1>

          <p className="auth-subtitle">
            Accede para usar Todo List y Drive.
          </p>

          <form onSubmit={handleAuthSubmit} className="auth-form">
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

            <button type="submit" className="primary-btn" disabled={authLoading}>
              {authLoading
                ? 'Procesando...'
                : authMode === 'login'
                  ? 'Entrar'
                  : 'Crear cuenta'}
            </button>
          </form>

          <div className="register-helper">
            <p className="register-helper-text">
              {authMode === 'login'
                ? '¿No tienes cuenta o estás usando por primera vez mi app?'
                : '¿Ya tienes una cuenta registrada?'}
            </p>

            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'register' : 'login')
                setAuthForm({
                  name: '',
                  email: '',
                  password: ''
                })
              }}
            >
              {authMode === 'login' ? 'Registrarse' : 'Iniciar sesión'}
            </button>
          </div>
        </section>
      ) : (
        <>
          <header className="main-header dashboard-header">
            <div className="dashboard-header-left">
              <h1 className="dashboard-title">Todo List | Drive</h1>

              <p className="session-text">
                Sesión activa: {user?.name || 'Usuario'}
              </p>
            </div>

            <div className="dashboard-header-right">
              <button type="button" className="logout-button logout-btn" onClick={requestLogout}>
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
                <>
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
                          <button type="button" onClick={() => toggleCompleted(todo)}>
                            {todo.completed ? 'Pendiente' : 'Completar'}
                          </button>

                          <button type="button" onClick={() => startEdit(todo)}>
                            Editar
                          </button>

                          <button
                            type="button"
                            className="danger"
                            onClick={() => deleteTodo(todo._id, todo.title)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="pagination">
                    <button
                      type="button"
                      disabled={!todoMeta.hasPrevPage}
                      onClick={goToPreviousTodos}
                    >
                      Anterior
                    </button>

                    <span>
                      Página {todoMeta.page || 1} de {todoMeta.totalPages || 1}
                    </span>

                    <button
                      type="button"
                      disabled={!todoMeta.hasNextPage}
                      onClick={goToNextTodos}
                    >
                      Siguiente
                    </button>
                  </div>
                </>
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
                <>
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
                                <button type="button" onClick={() => downloadFile(file)}>
                                  Descargar
                                </button>

                                <button type="button" onClick={() => editFile(file)}>
                                  Editar
                                </button>

                                <button
                                  type="button"
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

                  <div className="pagination">
                    <button
                      type="button"
                      disabled={!fileMeta.hasPrevPage}
                      onClick={goToPreviousFiles}
                    >
                      Anterior
                    </button>

                    <span>
                      Página {fileMeta.page || 1} de {fileMeta.totalPages || 1}
                    </span>

                    <button
                      type="button"
                      disabled={!fileMeta.hasNextPage}
                      onClick={goToNextFiles}
                    >
                      Siguiente
                    </button>
                  </div>
                </>
              )}
            </section>
          </section>
        </>
      )}

      {modal.visible && (
        <div className="modal-backdrop">
          <section className="app-modal">
            <h2>{modal.title}</h2>

            <p>{modal.message}</p>

            {modal.type === 'input' && (
              <input
                className="modal-input"
                type="text"
                value={modal.inputValue}
                disabled={modal.loading}
                onChange={(event) =>
                  setModal((previous) => ({
                    ...previous,
                    inputValue: event.target.value
                  }))
                }
                autoFocus
              />
            )}

            <div className="modal-actions">
              {modal.type !== 'message' && (
                <button
                  type="button"
                  className="modal-cancel"
                  disabled={modal.loading}
                  onClick={closeModal}
                >
                  {modal.cancelText}
                </button>
              )}

              <button
                type="button"
                className="modal-confirm"
                disabled={modal.loading}
                onClick={handleModalConfirm}
              >
                {modal.loading ? 'Procesando...' : modal.confirmText}
              </button>
            </div>
          </section>
        </div>
      )}

      {uploadToast.visible && (
        <div className={`upload-toast ${uploadToast.status}`}>
          <div className="upload-toast-header">
            <strong>
              {uploadToast.status === 'success'
                ? '1 subida completada'
                : uploadToast.status === 'error'
                  ? 'Error en la subida'
                  : 'Subiendo archivo'}
            </strong>

            <button
              type="button"
              className="upload-toast-close"
              onClick={resetUploadToast}
            >
              ×
            </button>
          </div>

          <div className="upload-toast-body">
            <div className="upload-file-icon">
              {uploadToast.status === 'success'
                ? '✓'
                : uploadToast.status === 'error'
                  ? '!'
                  : '↑'}
            </div>

            <div className="upload-file-info">
              <p className="upload-file-name">{uploadToast.fileName}</p>
              <p className="upload-file-message">{uploadToast.message}</p>

              {uploadToast.status === 'uploading' && (
                <div className="upload-progress">
                  <div
                    className="upload-progress-bar"
                    style={{ width: `${uploadToast.progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default App