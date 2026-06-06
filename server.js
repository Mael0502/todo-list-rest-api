const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')
const dotenv = require('dotenv')

dotenv.config()

const app = require('./src/app')
const connectDB = require('./src/config/database')

const PORT = process.env.PORT || 3000
const HTTPS_ENABLED = process.env.HTTPS_ENABLED === 'true'

const clientDistPath = path.join(__dirname, 'client', 'dist')
const indexPath = path.join(clientDistPath, 'index.html')

console.log('Ruta del build de React:', clientDistPath)
console.log('Existe index.html:', fs.existsSync(indexPath))

const startServer = async () => {
  await connectDB()

  if (HTTPS_ENABLED) {
    const keyPath = path.join(__dirname, process.env.SSL_KEY_PATH || 'certs/key.pem')
    const certPath = path.join(__dirname, process.env.SSL_CERT_PATH || 'certs/cert.pem')

    if (!fs.existsSync(keyPath)) {
      console.error(`No se encontró la clave SSL en: ${keyPath}`)
      process.exit(1)
    }

    if (!fs.existsSync(certPath)) {
      console.error(`No se encontró el certificado SSL en: ${certPath}`)
      process.exit(1)
    }

    const sslOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath)
    }

    https.createServer(sslOptions, app).listen(PORT, () => {
      console.log(`Servidor corriendo en HTTPS: https://localhost:${PORT}`)
    })

    return
  }

  http.createServer(app).listen(PORT, () => {
    console.log(`Servidor corriendo en HTTP: http://localhost:${PORT}`)
  })
}

startServer()