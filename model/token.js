const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  email: String,
  token: String,
  expired_date: Date,
});

module.exports = mongoose.model('Token', TokenSchema);
