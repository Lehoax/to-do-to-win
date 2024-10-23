const mongoose = require('mongoose');

const friendRequest = mongoose.Schema({
  emailApplicant: { type: String, required: true },
  emailRecipient: { type: String, required: true },
  accepted: {type: Boolean, default:false},
});


module.exports = mongoose.model('friendRequest', friendRequest);
