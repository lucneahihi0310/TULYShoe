const Product = require('../models/product.model.js');
const mongoose = require('mongoose');

exports.getFilteredProducts = async (req, res) => {
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
        { description: { $regex: search, $options: 'i' } },
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
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$product_id', '$$productId'] },
                    { $gt: ['$inventory_number', 0] },
                  ],
                },
              },
            },
            { $sort: { inventory_number: -1 } },
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
              },
            },
          ],
          as: 'detail',
        },
      },
      { $unwind: { path: '$detail', preserveNullAndEmptyArrays: true } },
      { $match: { detail: { $ne: null } } },

      // ✅ Add sort_price field để chuẩn hóa logic sắp xếp
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

    // Xử lý sortStage chính xác
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
    console.error('Error filtering products:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
