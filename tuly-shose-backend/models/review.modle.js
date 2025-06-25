const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true,
    },
    ordetail_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderDetail",
        required: true,
    },
    review_content: { type: String, required: true },
    images: [{ type: String, required: true }],
    rating: { type: Number, required: true },
    review_date: { type: Date, required: true },
    is_approved: { type: Boolean, required: true },
    replies: [{
        reply_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reply",
            required: true,
        },
        replier_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
            required: true,
        },
        reply_content: { type: String, required: true },
        reply_date: { type: Date, required: true },
        create_at: { type: Date, default: Date.now },
        update_at: { type: Date, default: Date.now }
    }],
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Review", reviewSchema, "reviews");