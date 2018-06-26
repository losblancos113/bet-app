const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  account_balance: Object,
  active: Boolean,
});

module.exports = mongoose.model('User', UserSchema);
