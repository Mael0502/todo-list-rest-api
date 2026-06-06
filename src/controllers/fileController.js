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

const getUserId = (req) => {
  return req.user?._id?.toString();
};

const getFileFilter = (req, fileId = null) => {
  const filter = {
    'metadata.userId': getUserId(req)
  };

  if (fileId) {
    filter._id = fileId;
  }

  return filter;
};

const buildFileListFilter = (req) => {
  const filter = getFileFilter(req);

  const search = req.query.search?.trim();
  const type = req.query.type || 'all';

  if (search) {
    filter.$or = [
      {
        filename: {
          $regex: search,
          $options: 'i'
        }
      },
      {
        'metadata.originalName': {
          $regex: search,
          $options: 'i'
        }
      },
      {
        'metadata.displayName': {
          $regex: search,
          $options: 'i'
        }
      }
    ];
  }

  if (type === 'image') {
    filter.$and = [
      ...(filter.$and || []),
      {
        $or: [
          { contentType: { $regex: '^image/', $options: 'i' } },
          { 'metadata.mimeType': { $regex: '^image/', $options: 'i' } }
        ]
      }
    ];
  }

  if (type === 'pdf') {
    filter.$and = [
      ...(filter.$and || []),
      {
        $or: [
          { contentType: 'application/pdf' },
          { 'metadata.mimeType': 'application/pdf' }
        ]
      }
    ];
  }

  if (type === 'text') {
    filter.$and = [
      ...(filter.$and || []),
      {
        $or: [
          { contentType: { $regex: '^text/', $options: 'i' } },
          { 'metadata.mimeType': { $regex: '^text/', $options: 'i' } }
        ]
      }
    ];
  }

  if (type === 'other') {
    filter.$and = [
      ...(filter.$and || []),
      {
        $and: [
          {
            $or: [
              { contentType: { $exists: false } },
              { contentType: { $not: /^image\//i } }
            ]
          },
          {
            $or: [
              { contentType: { $exists: false } },
              { contentType: { $ne: 'application/pdf' } }
            ]
          },
          {
            $or: [
              { contentType: { $exists: false } },
              { contentType: { $not: /^text\//i } }
            ]
          }
        ]
      }
    ];
  }

  return filter;
};

const getFileSort = (req) => {
  const sort = req.query.sort || 'newest';

  if (sort === 'oldest') {
    return { uploadDate: 1 };
  }

  if (sort === 'size_desc') {
    return { length: -1 };
  }

  if (sort === 'size_asc') {
    return { length: 1 };
  }

  if (sort === 'name_asc') {
    return { 'metadata.displayName': 1 };
  }

  if (sort === 'name_desc') {
    return { 'metadata.displayName': -1 };
  }

  return { uploadDate: -1 };
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
    const userId = getUserId(req);

    const originalName = req.file.originalname;
    const mimeType = req.file.mimetype;
    const size = req.file.size;

    const uploadStream = bucket.openUploadStream(originalName, {
      contentType: mimeType,
      metadata: {
        userId,
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
        Location: `${baseUrl}/api/files/${fileId}/download`
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

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 5, 1);
    const skip = (page - 1) * limit;

    const filter = buildFileListFilter(req);
    const sortOption = getFileSort(req);

    const total = await mongoose.connection.db
      .collection('driveFiles.files')
      .countDocuments(filter);

    const totalPages = Math.max(Math.ceil(total / limit), 1);

    const files = await bucket
      .find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
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
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        filters: {
          search: req.query.search || '',
          type: req.query.type || 'all',
          sort: req.query.sort || 'newest'
        }
      },
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

    const files = await bucket.find(getFileFilter(req, fileId)).toArray();

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
      getFileFilter(req, fileId),
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

    const files = await bucket.find(getFileFilter(req, fileId)).toArray();

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