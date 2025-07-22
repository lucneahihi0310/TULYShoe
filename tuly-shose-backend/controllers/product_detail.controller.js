const product_detail = require('../models/productDetail.model');
const formatDateTime = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

exports.list_product_detail = async (req, res, next) => {
    try {
        const newProductDetail = await product_detail.find().populate("product_id").populate("color_id").populate("size_id").populate("discount_id").populate("product_detail_status");
        const listProductDetail = newProductDetail.map((p) => {
            return {
                _id: p.id,
                product_id: p.product_id,
                color_id: p.color_id,
                size_id: p.size_id,
                discount_id: p.discount_id,
                inventory_numer: p.inventory_numer,
                sold_number: p.sold_number,
                price_after_discount: p.price_after_discount,
                images: p.images,
                product_detail_status: p.product_detail_status,
                create_at: formatDateTime(p.create_at),
                update_at: formatDateTime(p.update_at)
            }
        })
        res.status(201).json(listProductDetail);
    } catch (error) {
        next(error);
    }
}

exports.list_product_detail_by_id = async (req, res, next) => {
    try {
        const id = req.params.id;
        const newProductDetail = await product_detail.find({ product_id: id }).populate("product_id").populate("color_id").populate("size_id").populate("discount_id").populate("product_detail_status");
        const listProductDetail = newProductDetail.map((p) => {
            return {
                _id: p.id,
                product_id: p.product_id,
                color_id: p.color_id,
                size_id: p.size_id,
                discount_id: p.discount_id,
                inventory_number: p.inventory_number,
                sold_number: p.sold_number,
                price_after_discount: p.price_after_discount,
                images: p.images,
                product_detail_status: p.product_detail_status,
                create_at: formatDateTime(p.create_at),
                update_at: formatDateTime(p.update_at)
            }
        })
        res.status(201).json(listProductDetail);
    } catch (error) {
        next(error);
    }
}

exports.create_product_detail = async (req, res, next) => {
    try {
        const {
            product_id,
            color_id,
            size_id,
            discount_id,
            inventory_number,
            price_after_discount,
            sold_number,
            product_detail_status,
            images, // mảng URL ảnh từ frontend
        } = req.body;

        // Kiểm tra bắt buộc
        if (!images || !Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ message: 'Images array is required' });
        }

        const newDetail = new product_detail({
            product_id,
            color_id,
            size_id,
            discount_id,
            inventory_number,
            price_after_discount,
            sold_number,
            product_detail_status,
            images,
            create_at: new Date(),
            update_at: new Date(),
        });

        const savedDetail = await newDetail.save();
        return res.status(201).json(savedDetail);
    } catch (error) {
        next(error);
    }
};

exports.edit_product_detail = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updateData = req.body;
        updateData.update_at = new Date();
        const updatedDetail = await product_detail.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedDetail) {
            return res.status(404).json({ message: 'Product detail not found' });
        }
        res.status(200).json(updatedDetail);
    } catch (error) {
        next(error);
    }
};

exports.delete_product_detail = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deletedDetail = await product_detail.findByIdAndDelete(id);
        if (!deletedDetail) {
            return res.status(404).json({ message: 'Product detail not found' });
        }
        res.status(200).json({ message: 'Product detail deleted successfully' });
    } catch (error) {
        next(error);
    }
};

exports.get_product_detail_by_id = async (req, res, next) => {
    try {
        const id = req.params.id;
        const productDetail = await product_detail.findById(id)
            .populate("product_id")
            .populate("color_id")
            .populate("size_id")
            .populate("discount_id")
            .populate("product_detail_status");
        if (!productDetail) {
            return res.status(404).json({ message: 'Product detail not found' });
        }
        res.status(200).json(productDetail);
    } catch (error) {
        next(error);
    }
};