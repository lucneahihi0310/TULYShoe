const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderStatusSchema = new Schema({
  order_status_name: String,
  is_active: Boolean,
  create_at: Date,
  update_at: Date
});

module.exports = mongoose.model('OrderStatus', OrderStatusSchema,'order_status');
