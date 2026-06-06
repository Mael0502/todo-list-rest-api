const mongoose = require('mongoose')
const dotenv = require('dotenv')

const connectDB = require('../config/database')
const User = require('../models/User')
const Todo = require('../models/Todo')

dotenv.config()

if (!process.env.MONGO_URI) {
  console.error('Error: La variable MONGO_URI no está configurada en el archivo .env')
  process.exit(1)
}

const demoUser = {
  name: 'Usuario Demo',
  email: 'demo@test.com',
  password: '123456',
  role: 'user'
}

const demoTodos = [
  {
    title: 'Revisar autenticación JWT',
    description: 'Comprobar login, registro y protección de rutas con token.',
    completed: true
  },
  {
    title: 'Probar subida de archivos',
    description: 'Subir un archivo desde el módulo Drive y verificar que se guarde en GridFS.',
    completed: true
  },
  {
    title: 'Verificar descarga de archivos',
    description: 'Descargar un archivo desde la tabla de Drive.',
    completed: false
  },
  {
    title: 'Editar nombre de archivo',
    description: 'Cambiar el nombre visible de un archivo subido.',
    completed: false
  },
  {
    title: 'Eliminar archivo de prueba',
    description: 'Validar que la eliminación muestre confirmación antes de ejecutar la acción.',
    completed: false
  },
  {
    title: 'Probar filtro de tareas pendientes',
    description: 'Usar el filtro para mostrar solamente tareas pendientes.',
    completed: false
  },
  {
    title: 'Probar filtro de tareas completadas',
    description: 'Usar el filtro para mostrar solamente tareas completadas.',
    completed: true
  },
  {
    title: 'Buscar tarea por palabra clave',
    description: 'Usar el buscador para encontrar tareas por título o descripción.',
    completed: false
  },
  {
    title: 'Ordenar tareas por fecha',
    description: 'Probar el ordenamiento por tareas recientes y antiguas.',
    completed: true
  },
  {
    title: 'Revisar despliegue en Render',
    description: 'Comprobar que la aplicación funcione correctamente en producción.',
    completed: false
  }
]

const seedDatabase = async () => {
  try {
    console.log('Conectando a MongoDB...')
    await connectDB()

    console.log('Eliminando datos demo anteriores...')
    const existingDemoUser = await User.findOne({ email: demoUser.email })

    if (existingDemoUser) {
      await Todo.deleteMany({ user: existingDemoUser._id })
      await User.deleteOne({ _id: existingDemoUser._id })
    }

    console.log('Creando usuario demo...')
    const createdUser = await User.create(demoUser)

    console.log('Creando tareas demo...')
    const todosWithUser = demoTodos.map((todo) => ({
      ...todo,
      user: createdUser._id
    }))

    await Todo.insertMany(todosWithUser)

    console.log('Base de datos cargada correctamente.')
    console.log('')
    console.log('Credenciales de prueba:')
    console.log(`Correo: ${demoUser.email}`)
    console.log(`Contraseña: ${demoUser.password}`)
    console.log('')
    console.log('Puedes iniciar sesión en la app con esas credenciales.')

    await mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error('Error al cargar datos de prueba:')
    console.error(error.message)

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close()
    }

    process.exit(1)
  }
}

seedDatabase()