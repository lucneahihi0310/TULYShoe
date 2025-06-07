const category = require('../models/category.model');
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

exports.list_category = async (req, res, next) => {
    try {
        const newCategory = await category.find();
        const listCategory = newCategory.map((c) => {
            return {
                _id: c.id,
                category_name: c.category_name ,
                status: c.is_active,
                create_at: formatDateTime(c.create_at),
                update_at: formatDateTime(c.update_at)
            }
        })        
        res.status(201).json(listCategory);
    } catch (error){
        next(error);
    }
}