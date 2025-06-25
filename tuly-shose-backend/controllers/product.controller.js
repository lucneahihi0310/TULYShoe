const product = require('../models/product.model');
const formatDateTime = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

exports.list_product = async (req, res, next) => {
    try {
        const newProduct = await product.find().populate("categories_id").populate("brand_id").populate("material_id").populate("form_id");
        const listProduct = newProduct.map((p) => {
            return {
                _id: p.id,
                productName: p.productName,
                description: p.description,
                price: p.price,
                categories_id: p.categories_id,
                brand_id: p.brand_id,
                material_id: p.material_id,
                form_id: p.form_id,
                create_at: formatDateTime(p.create_at),
                update_at: formatDateTime(p.update_at)
            }
        })
        res.status(201).json(listProduct);
    } catch (error) {
        next(error);
    }
}

// exports.create_brand = async (req, res, next) => {
//     try {
//         const newBrand = new brand({
//             brand_name: req.body.brand_name,
//             is_active: req.body.is_active
//         })
//         const insertBrand = await newBrand.save();
//         res.status(201).json(insertBrand);
//     } catch (error) {
//         next(error);
//     }
// }

// exports.edit_brand = async (req, res, next) => {
//     try {
//         const id = req.params.id;
//         const { brand_name, is_active } = req.body;
//         const updatedBrand = await brand.findByIdAndUpdate(
//             id,
//             { brand_name, is_active, update_at: new Date().toISOString() },
//             { new: true, runValidators: true } // new: trả về bản ghi đã update
//         );
//         res.status(201).json(updatedBrand);
//     } catch (error) {
//         next(error);
//     }
// }

// exports.delete_brand = async (req, res, next) => {
//     try {
//         const id = req.params.id;
//         const deleteBrand = await brand.findByIdAndDelete(id);
//         res.status(201).json(deleteBrand);
//     } catch (error) {
//         next(error);
//     }
// }