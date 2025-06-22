const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/auth.middleware');
const { listAll, login, register, getUser, addAccount, forgotPassword, resetPassword } = require('../controllers/account.controller');

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
router.post('/api/forgot-password', forgotPassword);
router.post('/api/reset-password', resetPassword);

module.exports = router;