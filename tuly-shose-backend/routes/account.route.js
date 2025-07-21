const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/auth.middleware');
const { listAll, login, register, getUser, addAccount, forgotPassword, resetPassword, getFullUserInfo,
    getProfile, updateProfile, changePassword, updateProfileUser, uploadAvatar, changePasswordUser, updateStatusAccount } = require('../controllers/account.controller');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryUser');

const timlog = (req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
}

// Khai báo multer
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'avatars',
        allowed_formats: ['jpg', 'jpeg', 'png'],
    },
});
const upload = multer({ storage });


router.use(timlog);
router.use(express.json());
router.get('/', middleware, listAll);
router.post('/login', login);
router.post('/register', register);
router.get('/user', middleware, getUser);
router.post('/add', middleware, addAccount);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/info', middleware, getFullUserInfo);
router.put('/profile', middleware, updateProfileUser);
router.put('/upload/avatar', middleware, upload.single('avatar'), uploadAvatar);
router.put('/change-password-user', middleware, changePasswordUser);

router.get('/profile/:id', middleware, getProfile);
router.put('/profile/:id', middleware, updateProfile);
router.patch('/profile/ban/:id', middleware, updateStatusAccount);
router.patch('/profile/unban/:id', middleware, updateStatusAccount);
router.put('/profile/:id/change-password', middleware, changePassword);
module.exports = router;