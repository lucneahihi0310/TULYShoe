const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/auth.middleware');
const { getAllReviews, getReviewById, getReviewsByProductDetailId, createOrUpdateReview, getRandomReviews, getReview, createReply } = require('../controllers/review.controller');
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryUser");

// Storage config
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "reviews",
        allowed_formats: ["jpg", "jpeg", "png"],
    },
});
const upload = multer({ storage });

const timlog = (req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
};

router.use(timlog);
router.get('/customers', getAllReviews);
router.get('/customers/random', getRandomReviews);
router.get('/customers/detail/:detailId', getReviewsByProductDetailId);
router.get('/customers/:id', getReviewById);
router.post("/customers", middleware, upload.array("images", 3), createOrUpdateReview);
router.get('/staff/review', getReview)
router.post("/staff/:id/reply", createReply);
module.exports = router;