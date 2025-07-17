const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    lastSupportRequest: { type: Date },
});

module.exports = mongoose.model("Support", supportSchema, "supports");