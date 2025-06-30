const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  order_code: String,
  user_id: { type: Schema.Types.ObjectId, ref: 'Account' },
  order_date: Date,
  order_status_id: { type: Schema.Types.ObjectId, ref: 'OrderStatus' },
  address_shipping_id: { type: Schema.Types.ObjectId, ref: 'AddressShipping' },
  delivery_date: Date,
  order_note: String,
  total_amount: Number,
  payment_status: String,
  accepted_by: { type: Schema.Types.ObjectId, ref: 'Account' },
  create_at: Date,
  update_at: Date
});

module.exports = mongoose.model('Order', OrderSchema);
