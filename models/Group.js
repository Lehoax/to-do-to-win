const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
  title: { type: String, required: true },
  admin: { type: String, required: true },
  members: { type: Array },
  task: { type: Array }
});


module.exports = mongoose.model('Group', groupSchema);
