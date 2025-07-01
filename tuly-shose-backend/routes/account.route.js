const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/auth.middleware');
const { listAll, login, register, getUser, addAccount, forgotPassword, resetPassword, getProfile, updateProfile, changePassword } = require('../controllers/account.controller');

const timlog = (req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
}
router.use(timlog);
router.use(express.json());
router.get('/', middleware, listAll);
router.post('/login', login);
router.post('/register', register);
router.get('/user', middleware, getUser);
router.post('/add', middleware, addAccount);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile/:id',middleware, getProfile);
router.put('/profile/:id',middleware, updateProfile);
router.put('/profile/:id/change-password',middleware, changePassword);
module.exports = router;