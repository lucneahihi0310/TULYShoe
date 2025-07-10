const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinaryUser');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const User = require('../models/account.modle');
const auth = require('../middlewares/auth.middleware');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'avatars',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage });

// Upload ảnh đại diện và cập nhật hồ sơ người dùng
router.put('/upload/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    const imageUrl = req.file.path;
    const user = await User.findByIdAndUpdate(
      req.customerId,
      { avatar_image: imageUrl, update_at: Date.now() },
      { new: true }
    ).select('-password -resetToken -resetTokenExpiration');

    res.json({
      message: 'Cập nhật ảnh đại diện thành công',
      avatar: user.avatar_image,
      user,
    });
  } catch (error) {
    console.error('Upload avatar failed:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật avatar' });
  }
});

module.exports = router;
