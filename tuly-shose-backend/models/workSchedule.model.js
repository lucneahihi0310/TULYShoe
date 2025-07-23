const mongoose = require('mongoose');

const WorkScheduleSchema = new mongoose.Schema({
  staff_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Account' }, 
  schedule_date: { type: String, required: true },
  scheduled_start_time: { type: String, required: true },
  scheduled_end_time: { type: String, required: true },
  is_recurring: { type: Boolean, default: false },
  recurrence_end_date: { type: String, default: null },
  start_time: { type: String, default: null },
  end_time: { type: String, default: null },
  notes: { type: String },
  work_status_id: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkStatus' },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }, 
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WorkSchedule', WorkScheduleSchema,"work_schedules");