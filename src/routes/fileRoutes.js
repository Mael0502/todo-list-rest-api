const express = require('express');

const {
  upload,
  uploadFile,
  getAllFiles,
  downloadFile,
  updateFile,
  deleteFile
} = require('../controllers/fileController');

const router = express.Router();

router.get('/', getAllFiles);

router.post('/upload', upload.single('file'), uploadFile);

router.get('/:id/download', downloadFile);

router.patch('/:id', updateFile);

router.delete('/:id', deleteFile);

module.exports = router;