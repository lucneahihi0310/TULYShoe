const mongoose = require('mongoose');

const WorkStatusSchema = new mongoose.Schema({
  status_name: { type: String, required: true },
  description: { type: String },
  is_active: { type: Boolean, default: true },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WorkStatus', WorkStatusSchema,"work_status");
