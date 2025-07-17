const discount = require('../models/discount.model');
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

exports.list_discount = async (req, res, next) => {
    try {
        const newDiscount = await discount.find();
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
        res.status(201).json(newDiscount);
    } catch (error) {
        next(error);
    }
}
