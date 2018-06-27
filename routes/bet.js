const express = require('express');

const router = express.Router();
const BetDetail = require('../model/bet-detail.js');
const User = require('../model/user.js');

/* Get by match_id */
router.get('/:match_id', (req, res, next) => {
  BetDetail.find({ match_id: req.params.match_id }, (err, users) => {
    if (err) return next(err);
    res.json(users);
  });
});

/* Bet */
router.post('/', (req, res, next) => {
  let requestObj = req.body;
  User.findById(requestObj.user_id, (err, user) => {
    if(err) return next(err);
    let account_balance = user.account_balance;
    if (account_balance.available >= requestObj.bet_money) {
      BetDetail.create(requestObj, (err, post) => {
        if(err) return next(err);
        //decrease money
        user.account_balance.available -= requestObj.bet_money;
        user.account_balance.on_hold += requestObj.bet_money;
        console.log(`account_balance after bet: `);
        console.log(user.account_balance);
        User.findByIdAndUpdate(user._id, user, (err, updatedObj) => {
          if(err) return next(err);
          console.log('Update user balance success');
          res.json(post);
        });
      });
    }else {
      return next({error: 'Đ Đ T'});
    }
  });
});

/* Update bet */
router.put('/', (req, res, next) => {
  BetDetail.findByIdAndUpdate(req.body._id, req.body, (err, updatedObj) => {
    if(err) return next(err);
    res.json(updatedObj);
  });
});

/* Find by user_id and match_id */
router.get('/:user_id/:match_id', (req, res, next) => {
  BetDetail.findOne({ match_id: req.params.match_id, user_id: req.params.user_id }, (err, bet_detail) => {
    if(err) return next(err);
    res.json(bet_detail);
  });
});

module.exports = router;
