const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


const BetDetailSchema = new mongoose.Schema({
  user_id: ObjectId,
  match_id: ObjectId,
  bet_money: Number,
  bet_team: Number,
  status: Number
});

module.exports = mongoose.model('BetDetail', BetDetailSchema, 'bet_detail');
