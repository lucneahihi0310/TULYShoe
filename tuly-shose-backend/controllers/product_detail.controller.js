const product_detail = require('../models/product_detail.model');
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
        // const listProductDetail = newProductDetail.map((p) => {
        //     return {
        //         _id: p.id,
        //         product_id: p.product_id,
        //         color_id: p.color_id,
        //         size_id: p.size_id,
        //         discount_id: p.discount_id,
        //         inventory_numer: p.inventory_numer,
        //         sold_number: p.sold_number,
        //         price_after_discount: p.price_after_discount,
        //         images: p.images,
        //         product_detail_status: p.product_detail_status,
        //         create_at: formatDateTime(p.create_at),
        //         update_at: formatDateTime(p.update_at)
        //     }
        // })
        res.status(201).json(newProductDetail);
    } catch (error) {
        next(error);
    }
}

exports.list_product_detail_by_id = async (req, res, next) => {
    try {
        const id = req.params.id;
        const newProductDetail = await product_detail.find({ product_id: id }).populate("product_id").populate("color_id").populate("size_id").populate("discount_id").populate("product_detail_status");
        // const listProductDetail = newProductDetail.map((p) => {
        //     return {
        //         _id: p.id,
        //         product_id: p.product_id,
        //         color_id: p.color_id,
        //         size_id: p.size_id,
        //         discount_id: p.discount_id,
        //         inventory_numer: p.inventory_numer,
        //         sold_number: p.sold_number,
        //         price_after_discount: p.price_after_discount,
        //         images: p.images,
        //         product_detail_status: p.product_detail_status,
        //         create_at: formatDateTime(p.create_at),
        //         update_at: formatDateTime(p.update_at)
        //     }
        // })
        res.status(201).json(newProductDetail);
    } catch (error) {
        next(error);
    }
}

// exports.create_product = async (req, res, next) => {
//     try {
//         const newProduct = new product({
//             productName: req.body.productName,
//             description: req.body.description,
//             price: req.body.price,
//             categories_id: req.body.categories_id,
//             brand_id: req.body.brand_id,
//             material_id: req.body.material_id,
//             form_id: req.body.form_id
//         })
//         const insertProduct = await newProduct.save();
//         res.status(201).json(insertProduct);
//     } catch (error) {
//         next(error);
//     }
// }