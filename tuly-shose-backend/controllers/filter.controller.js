const Brand = require('../models/brand.model');
const Material = require('../models/material.model');
const Category = require('../models/category.model');
const Gender = require('../models/gender.model');
const Color = require('../models/color.model');
const Form = require('../models/form.model');

exports.getAllFilters = async (req, res) => {
  try {
    const [brands, materials, categories, genders, colors, forms] = await Promise.all([
      Brand.find({ is_active: true }).select('_id brand_name'),
      Material.find({ is_active: true }).select('_id material_name'),
      Category.find({ is_active: true }).select('_id category_name'),
      Gender.find({ is_active: true }).select('_id gender_name'),
      Color.find({ is_active: true }).select('_id color_code'),
      Form.find({ is_active: true }).select('_id form_name')
    ]);

    res.status(200).json({
      brands,
      materials,
      categories,
      genders,
      colors,
      forms
    });
  } catch (error) {
    console.error('Error getting filters:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
