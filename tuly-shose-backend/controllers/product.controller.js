const Product = require('../models/product.model.js');
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
    const newProduct = await Product.find().populate("categories_id").populate("brand_id").populate("material_id").populate("form_id");
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

exports.create_product = async (req, res, next) => {
  try {
    const newProduct = new Product({
      productName: req.body.productName,
      description: req.body.description,
      price: req.body.price,
      categories_id: req.body.categories_id,
      brand_id: req.body.brand_id,
      material_id: req.body.material_id,
      form_id: req.body.form_id
    })
    const insertProduct = await newProduct.save();
    res.status(201).json(insertProduct);
  } catch (error) {
    next(error);
  }
}