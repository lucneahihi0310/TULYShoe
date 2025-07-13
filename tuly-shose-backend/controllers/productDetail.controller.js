const ProductDetail = require("./../models/productDetail.model");
const Product = require("../models/product.model");

exports.getAllProductDetails = async (req, res) => {
  try {
    const productDetails = await ProductDetail.find()
      .populate("product_id", "productName")
      .populate("color_id", "color_name color_code")
      .populate("size_id", "size_name")
      .populate("discount_id", "percent_discount")
      .populate("product_detail_status", "productdetail_status_name");
    res.json(productDetails);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách chi tiết sản phẩm", error: error.message });
  }
};

exports.getProductDetailById = async (req, res) => {
  try {
    const detail = await ProductDetail.findById(req.params.id)
      .populate({
        path: 'product_id',
        select: 'productName description price brand_id material_id form_id gender_id categories_id sold_number',
        populate: [
          { path: 'brand_id', select: 'brand_name' },
          { path: 'material_id', select: 'material_name' },
          { path: 'form_id', select: 'form_name' },
          { path: 'gender_id', select: 'gender_name' },
          { path: 'categories_id', select: 'category_name' }
        ]
      })
      .populate('color_id', 'color_name color_code')
      .populate('size_id', 'size_name')
      .populate('discount_id', 'percent_discount')
      .populate('product_detail_status', 'productdetail_status_name')
      .select('price_after_discount images inventory_number sold_number');

    if (!detail) return res.status(404).json({ message: 'Không tìm thấy detail!' });
    res.json(detail);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductDetailsByProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const details = await ProductDetail.find({ product_id: productId })
      .populate('color_id', 'color_name color_code')
      .populate('size_id', 'size_name')
      .select('color_id size_id inventory_number _id');
    res.json(details);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRelatedProducts = async (req, res) => {
  try {
    const pd = await ProductDetail.findById(req.params.detailId).populate('product_id');
    if (!pd) return res.status(404).json({ message: 'Không tìm thấy ProductDetail' });

    const currentProduct = pd.product_id;

    // Bước 1: Tìm sản phẩm liên quan theo OR (chất liệu hoặc form giống)
    const relatedProducts = await Product.find({
      _id: { $ne: currentProduct._id },
      $or: [
        { material_id: currentProduct.material_id },
        { form_id: currentProduct.form_id }
      ]
    }).limit(8);

    // Bước 2: Lấy ProductDetail đầu tiên của mỗi sản phẩm liên quan, ưu tiên có hàng
    const relatedDetails = await Promise.all(
      relatedProducts.map(async (prod) => {
        const detail = await ProductDetail.findOne({ product_id: prod._id })
          .populate({
            path: 'product_id',
            select: 'productName description price'
          })
          .populate('discount_id', 'percent_discount')
          .populate('color_id', 'color_name')
          .sort({ inventory_number: -1 }) // Prioritize details with stock
          .select('price_after_discount images inventory_number color_id _id');
        return detail;
      })
    );

    // Bước 3: Lọc phần tử null nếu không có ProductDetail
    const result = relatedDetails.filter(Boolean);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy sản phẩm liên quan' });
  }
};