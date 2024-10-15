const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  xp: {type: Number},
  done: {type: Boolean, default:false},
  creation_date:{ type : Date, default: Date.now, required: true},
});

module.exports = mongoose.model('Task', taskSchema);