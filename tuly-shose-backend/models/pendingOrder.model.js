const mongoose = require("mongoose");

const pendingOrderSchema = new mongoose.Schema({
  order_code: { type: String, required: true, unique: true },
  orderItems: { type: Array, required: true },
  userInfo: { type: Object, required: true },
  shippingFee: { type: Number, required: true },
  orderNote: { type: String, default: "" },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Account", default: null },
  isFromCart: { type: Boolean, default: false },
  deliveryDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PendingOrder", pendingOrderSchema);
