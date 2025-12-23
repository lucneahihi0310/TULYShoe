const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinaryStorage = require('multer-storage-cloudinary');
const { cloudinary } = require('../config/cloudinary');

// Cấu hình storage (multer-storage-cloudinary@2.x dùng hàm factory)
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'staff_avatars',
    allowedFormats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

// API upload ảnh
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: 'Upload failed' });
  }

  res.status(200).json({ url: req.file.path }); // Trả về link ảnh
});

module.exports = router;
