const mongoose = require('mongoose');
const dns = require('dns');

// Forzamos servidores DNS para evitar errores querySrv ETIMEOUT/ECONNREFUSED
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000
    });

    console.log('MongoDB Atlas conectado correctamente');
  } catch (error) {
    console.error('Error al conectar con MongoDB Atlas:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;