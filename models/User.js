const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  xp: { type: Number, default: 0, required: true },
  last_connection: { type: Date, default: Date.now, required: true },
  reminder: { type: Boolean, default: false },
  task: { type: Array }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
