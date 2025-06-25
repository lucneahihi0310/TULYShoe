const mongoose = require("mongoose");
const cartItemSchema = new mongoose.Schema({
    
    pdetail_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductDetail",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },
    create_at: {
        type: Date,
        default: Date.now
    },
    update_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("CartItem", cartItemSchema, "cart_items");
