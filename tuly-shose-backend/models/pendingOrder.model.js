const mongoose = require("mongoose");

const pendingOrderSchema = new mongoose.Schema({
  order_code: { type: String, required: true, unique: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Account", default: null },
  orderItems: { type: Array, required: true },
  userInfo: { type: Object, required: true },
  shippingFee: { type: Number, required: true },
  orderNote: { type: String },
  paymentMethod: { type: String },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PendingOrder", pendingOrderSchema);
