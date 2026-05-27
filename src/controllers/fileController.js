const mongoose = require('mongoose');
const multer = require('multer');
const { ObjectId, GridFSBucket } = require('mongodb');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

const getBucket = () => {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error('La conexión con MongoDB no está disponible');
  }

  return new GridFSBucket(db, {
    bucketName: 'driveFiles'
  });
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      res.set('Cache-Control', 'no-store');

      return res.status(400).json({
        success: false,
        message: 'No se envió ningún archivo'
      });
    }

    const bucket = getBucket();

    const originalName = req.file.originalname;
    const mimeType = req.file.mimetype;
    const size = req.file.size;

    const uploadStream = bucket.openUploadStream(originalName, {
      contentType: mimeType,
      metadata: {
        originalName,
        displayName: originalName,
        mimeType,
        size
      }
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on('finish', () => {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const fileId = uploadStream.id.toString();

      res.set({
        'Cache-Control': 'no-store',
        'Location': `${baseUrl}/api/files/${fileId}/download`
      });

      res.status(201).json({
        success: true,
        message: 'Archivo subido correctamente',
        data: {
          _id: fileId,
          originalName,
          displayName: originalName,
          mimeType,
          size,
          sizeFormatted: formatFileSize(size),
          downloadUrl: `${baseUrl}/api/files/${fileId}/download`
        }
      });
    });

    uploadStream.on('error', (error) => {
      res.status(500).json({
        success: false,
        message: 'Error al subir el archivo',
        error: error.message
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al procesar el archivo',
      error: error.message
    });
  }
};

const getAllFiles = async (req, res) => {
  try {
    const bucket = getBucket();
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const files = await bucket
      .find({})
      .sort({ uploadDate: -1 })
      .toArray();

    const data = files.map((file) => ({
      _id: file._id.toString(),
      originalName: file.metadata?.originalName || file.filename,
      displayName: file.metadata?.displayName || file.filename,
      mimeType: file.contentType || file.metadata?.mimeType || 'application/octet-stream',
      size: file.length,
      sizeFormatted: formatFileSize(file.length),
      createdAt: file.uploadDate,
      downloadUrl: `${baseUrl}/api/files/${file._id}/download`
    }));

    res.set({
      'Cache-Control': 'public, max-age=0, must-revalidate'
    });

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los archivos',
      error: error.message
    });
  }
};

const downloadFile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de archivo inválido'
      });
    }

    const bucket = getBucket();
    const fileId = new ObjectId(id);

    const files = await bucket.find({ _id: fileId }).toArray();

    if (files.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado'
      });
    }

    const file = files[0];
    const displayName = file.metadata?.displayName || file.filename;
    const mimeType = file.contentType || file.metadata?.mimeType || 'application/octet-stream';

    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${encodeURIComponent(displayName)}"`,
      'Cache-Control': 'no-store'
    });

    const downloadStream = bucket.openDownloadStream(fileId);

    downloadStream.on('error', (error) => {
      res.status(500).json({
        success: false,
        message: 'Error al descargar el archivo',
        error: error.message
      });
    });

    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al descargar el archivo',
      error: error.message
    });
  }
};

const updateFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { displayName } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de archivo inválido'
      });
    }

    if (!displayName || !displayName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'El nuevo nombre del archivo es obligatorio'
      });
    }

    const db = mongoose.connection.db;
    const fileId = new ObjectId(id);

    const result = await db.collection('driveFiles.files').findOneAndUpdate(
      { _id: fileId },
      {
        $set: {
          'metadata.displayName': displayName.trim()
        }
      },
      {
        returnDocument: 'after'
      }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado'
      });
    }

    res.set('Cache-Control', 'no-store');

    res.status(200).json({
      success: true,
      message: 'Archivo actualizado correctamente',
      data: {
        _id: result._id.toString(),
        originalName: result.metadata?.originalName || result.filename,
        displayName: result.metadata?.displayName || result.filename,
        mimeType: result.contentType || result.metadata?.mimeType || 'application/octet-stream',
        size: result.length,
        sizeFormatted: formatFileSize(result.length),
        createdAt: result.uploadDate
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el archivo',
      error: error.message
    });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de archivo inválido'
      });
    }

    const bucket = getBucket();
    const fileId = new ObjectId(id);

    const files = await bucket.find({ _id: fileId }).toArray();

    if (files.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado'
      });
    }

    await bucket.delete(fileId);

    res.set('Cache-Control', 'no-store');

    res.status(200).json({
      success: true,
      message: 'Archivo eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el archivo',
      error: error.message
    });
  }
};

module.exports = {
  upload,
  uploadFile,
  getAllFiles,
  downloadFile,
  updateFile,
  deleteFile
};