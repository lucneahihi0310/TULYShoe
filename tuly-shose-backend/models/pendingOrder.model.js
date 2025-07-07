const mongoose = require("mongoose");

const pendingOrderSchema = new mongoose.Schema({
  order_code: { type: String, required: true, unique: true },
  orderItems: { type: Array, required: true },
  userInfo: { type: Object, required: true },
  paymentMethod: { type: String, required: true },
  orderNote: { type: String },
  shippingFee: { type: Number, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  isFromCart: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PendingOrder", pendingOrderSchema);