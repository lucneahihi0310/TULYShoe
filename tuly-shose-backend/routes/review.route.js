const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/auth.middleware');
const { getAllReviews, getReviewById, getReviewsByProductDetailId } = require('../controllers/review.controller');

const timlog = (req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
}

router.use(timlog);
router.get('/customers/', getAllReviews);
router.get('/customers/detail/:detailId', getReviewsByProductDetailId);
router.get('/customers/:id', getReviewById);
module.exports = router;