const Product = require('../models/product.model.js');
const ProductDetail = require('../models/productDetail.model.js');
const mongoose = require('mongoose');
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

exports.getFilteredProducts = async (req, res) => {
  try {
    const {
      category,
      brand,
      material,
      gender,
      search,
      sortBy = 'default', // default | price-asc | price-desc | sold-desc
      page = 1,
      limit = 12,
    } = req.query;

    const matchStage = {};

    if (category) matchStage.categories_id = new mongoose.Types.ObjectId(category);
    if (brand) matchStage.brand_id = new mongoose.Types.ObjectId(brand);
    if (material) matchStage.material_id = new mongoose.Types.ObjectId(material);
    if (gender) matchStage.gender_id = new mongoose.Types.ObjectId(gender);
    if (search) {
      matchStage.$or = [
        { productName: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
      ];
    }

    const basePipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'product_details',
          let: { productId: '$_id' },
          pipeline: [
            {
              $match: { $expr: { $eq: ['$product_id', '$$productId'] } },
            },
            { $sort: { inventory_number: -1 } }, // Ưu tiên chi tiết sản phẩm có hàng
            { $limit: 1 },
            {
              $lookup: {
                from: 'colors',
                localField: 'color_id',
                foreignField: '_id',
                as: 'colors',
              },
            },
            {
              $lookup: {
                from: 'discounts',
                localField: 'discount_id',
                foreignField: '_id',
                as: 'discount',
              },
            },
            { $unwind: { path: '$colors', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$discount', preserveNullAndEmptyArrays: true } },
            {
              $project: {
                price_after_discount: 1,
                images: 1,
                color: '$colors.color_name',
                discount_percent: '$discount.percent_discount',
                inventory_number: 1,
                sold_number: 1,
              },
            },
          ],
          as: 'detail',
        },
      },
      { $unwind: { path: '$detail', preserveNullAndEmptyArrays: true } },
      { $match: { detail: { $ne: null } } }, // Chỉ lấy sản phẩm có ít nhất một chi tiết
      {
        $addFields: {
          sort_price: {
            $cond: {
              if: { $gt: ['$detail.discount_percent', 0] },
              then: '$detail.price_after_discount',
              else: '$price',
            },
          },
        },
      },
    ];

    // Tổng số bản ghi
    const totalFiltered = await Product.aggregate([...basePipeline, { $count: 'total' }]);
    const totalCount = totalFiltered[0]?.total || 0;

    // Xử lý sắp xếp
    let sortStage = {};
    if (sortBy === 'price-asc') sortStage = { sort_price: 1 };
    else if (sortBy === 'price-desc') sortStage = { sort_price: -1 };
    else if (sortBy === 'sold-desc') sortStage = { 'detail.sold_number': -1 };
    else sortStage = { _id: -1 };

    const paginatedPipeline = [
      ...basePipeline,
      { $sort: sortStage },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
      {
        $project: {
          _id: 1,
          productName: 1,
          description: 1,
          title: 1,
          price: 1,
          detail: 1,
        },
      },
    ];

    const products = await Product.aggregate(paginatedPipeline);

    res.json({
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Lỗi khi lọc sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server nội bộ', error: error.message });
  }
};

exports.getFilteredProductsByOnSale = async (req, res) => {
  try {
    const {
      category,
      brand,
      material,
      gender,
      search,
      sortBy = 'default', // default | price-asc | price-desc
      page = 1,
      limit = 12,
    } = req.query;

    const matchStage = {};

    if (category) matchStage.categories_id = new mongoose.Types.ObjectId(category);
    if (brand) matchStage.brand_id = new mongoose.Types.ObjectId(brand);
    if (material) matchStage.material_id = new mongoose.Types.ObjectId(material);
    if (gender) matchStage.gender_id = new mongoose.Types.ObjectId(gender);
    if (search) {
      matchStage.$or = [
        { productName: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
      ];
    }

    const basePipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'product_details',
          let: { productId: '$_id' },
          pipeline: [
            {
              $match: { $expr: { $eq: ['$product_id', '$$productId'] } },
            },
            { $sort: { inventory_number: -1 } }, // Ưu tiên chi tiết sản phẩm có hàng
            { $limit: 1 },
            {
              $lookup: {
                from: 'colors',
                localField: 'color_id',
                foreignField: '_id',
                as: 'colors',
              },
            },
            {
              $lookup: {
                from: 'discounts',
                localField: 'discount_id',
                foreignField: '_id',
                as: 'discount',
              },
            },
            { $unwind: { path: '$colors', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$discount', preserveNullAndEmptyArrays: true } },
            {
              $project: {
                price_after_discount: 1,
                images: 1,
                color: '$colors.color_name',
                discount_percent: '$discount.percent_discount',
                inventory_number: 1,
                sold_number: 1,
              },
            },
          ],
          as: 'detail',
        },
      },
      { $unwind: { path: '$detail', preserveNullAndEmptyArrays: true } },
      { $match: { detail: { $ne: null } } }, // Chỉ lấy sản phẩm có ít nhất một chi tiết
      {
        $addFields: {
          sort_price: {
            $cond: {
              if: { $gt: ['$detail.discount_percent', 0] },
              then: '$detail.price_after_discount',
              else: '$price',
            },
          },
        },
      },
      {
        $match: {
          'detail.discount_percent': { $gt: 0 },
        },
      },
    ];

    // Tổng số bản ghi
    const totalFiltered = await Product.aggregate([...basePipeline, { $count: 'total' }]);
    const totalCount = totalFiltered[0]?.total || 0;

    // Xử lý sắp xếp
    let sortStage = {};
    if (sortBy === 'price-asc') sortStage = { sort_price: 1 };
    else if (sortBy === 'price-desc') sortStage = { sort_price: -1 };
    else sortStage = { _id: -1 };

    const paginatedPipeline = [
      ...basePipeline,
      { $sort: sortStage },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
      {
        $project: {
          _id: 1,
          productName: 1,
          description: 1,
          title: 1,
          price: 1,
          detail: 1,
        },
      },
    ];

    const products = await Product.aggregate(paginatedPipeline);

    res.json({
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Lỗi khi lọc sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server nội bộ', error: error.message });
  }
};

exports.list_product = async (req, res, next) => {
  try {
    const newProduct = await Product.find()
      .sort({ create_at: -1 }) // Sort by create_at in descending order
      .populate("categories_id")
      .populate("brand_id")
      .populate("material_id")
      .populate("form_id")
      .populate("gender_id");
    const listProduct = newProduct.map((p) => ({
      _id: p.id,
      productName: p.productName,
      title: p.title,
      description: p.description,
      price: p.price,
      categories_id: p.categories_id,
      brand_id: p.brand_id,
      material_id: p.material_id,
      form_id: p.form_id,
      gender_id: p.gender_id,
      create_at: formatDateTime(p.create_at),
      update_at: p.update_at ? formatDateTime(p.update_at) : null,
    }));
    res.status(200).json(listProduct);
  } catch (error) {
    next(error);
  }
};

exports.create_product = async (req, res, next) => {
  try {
    const newProduct = new Product({
      productName: req.body.productName,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      categories_id: req.body.categories_id,
      brand_id: req.body.brand_id,
      material_id: req.body.material_id,
      form_id: req.body.form_id,
      gender_id: req.body.gender_id,
      create_at: new Date(),
      update_at: null,
    });
    const insertProduct = await newProduct.save();
    res.status(201).json(insertProduct);
  } catch (error) {
    next(error);
  }
};

exports.edit_product = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { productName, title, description, price, categories_id, brand_id, material_id, gender_id, form_id } = req.body;
    const newProduct = await Product.findByIdAndUpdate(
      id,
      {
        productName,
        title,
        description,
        price,
        categories_id,
        brand_id,
        material_id,
        form_id,
        gender_id,
        update_at: new Date(),
      },
      { new: true }
    );
    res.status(200).json(newProduct);
  } catch (error) {
    next(error);
  }
};

exports.delete_product = async (req, res, next) => {
  try {
    const id = req.params.id;
    const newProduct = await Product.findByIdAndDelete(id);
    res.status(200).json(newProduct);
  } catch (error) {
    next(error);
  }
};

exports.list_product_detail_by_id = async (req, res, next) => {
  try {
    const product_id = req.params.id;
    const productDetails = await ProductDetail.find({ product_id })
      .populate("product_id")
      .populate("color_id")
      .populate("size_id")
      .populate("discount_id")
      .populate("product_detail_status");
    const listProductDetails = productDetails.map((pd) => ({
      _id: pd._id,
      product_id: pd.product_id,
      color_id: pd.color_id,
      size_id: pd.size_id,
      discount_id: pd.discount_id,
      inventory_number: pd.inventory_number,
      sold_number: pd.sold_number,
      price_after_discount: pd.price_after_discount,
      product_detail_status: pd.product_detail_status,
      images: pd.images,
      create_at: formatDateTime(pd.create_at),
      update_at: pd.update_at ? formatDateTime(pd.update_at) : null,
    }));
    res.status(200).json(listProductDetails);
  } catch (error) {
    next(error);
  }
};