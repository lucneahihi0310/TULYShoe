const Product = require('../models/product.model'); 
const ProductDetail = require('../models/productDetail.model');
const ProductDetailStatus = require('../models/productDetailStatus.model')
exports.getInventory = async (req, res) => {
  try {
    const productDetails = await ProductDetail.find();

    const inventoryData = await Promise.all(
      productDetails.map(async (detail) => {
        const product = await Product.findById(detail.product_id);
        const status = await ProductDetailStatus.findById(detail.product_detail_status);

        return {
          productDetailId: detail._id,
          productName: product ? product.productName : 'Không xác định',
          inventory_number: detail.inventory_number,
          price_after_discount: detail.price_after_discount,
          product_detail_status: status ? status.productdetail_status_name : 'Không xác định',
          images: detail.images
        };
      })
    );

    res.json({ message: 'Danh sách tồn kho', data: inventoryData });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Lấy danh sách trạng thái
exports.getStatusList = async (req, res) => {
  try {
    const statusList = await ProductDetailStatus.find({ is_active: true });
    res.json({ message: 'Danh sách trạng thái', data: statusList });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
