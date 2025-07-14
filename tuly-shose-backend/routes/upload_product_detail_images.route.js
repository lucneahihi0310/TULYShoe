// server.js hoặc productRoutes.js (ví dụ)
const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary'); // Đường dẫn tới file cấu hình Cloudinary của bạn
const Product = require('../models/product.model'); // Model sản phẩm của bạn

// Cấu hình Multer để lưu trữ file tạm thời trên đĩa
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Thư mục tạm thời để lưu trữ file trước khi upload lên Cloudinary
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

// Route để upload ảnh
router.post('/upload-image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        // Upload ảnh lên Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'shoe_images', // Tên thư mục trên Cloudinary để lưu ảnh của bạn
        });

        // Xóa file tạm thời sau khi đã upload lên Cloudinary
        const fs = require('fs');
        fs.unlinkSync(req.file.path);

        res.status(200).json({
            message: 'Image uploaded successfully',
            imageUrl: result.secure_url,
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Error uploading image', error: error.message });
    }
});

// Route để thêm/cập nhật URL ảnh vào MongoDB
router.put('/products/:id/add-image', async (req, res) => {
    const { imageUrl } = req.body;
    const productId = req.params.id;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.images.push(imageUrl); // Thêm URL ảnh mới vào mảng
        await product.save();

        res.status(200).json({
            message: 'Image URL added to product successfully',
            product: product,
        });
    } catch (error) {
        console.error('Error adding image URL to product:', error);
        res.status(500).json({ message: 'Error adding image URL to product', error: error.message });
    }
});

module.exports = router;