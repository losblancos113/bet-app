const express = require('express');

const router = express.Router();
const User = require('../model/user.js');
const Token = require('../model/token.js');
const bcrypt = require('bcrypt');
const uniqid = require('uniqid');
const mailer = require('../utils/mail');

/* Get all user */
router.get('/', (req, res, next) => {
  User.find((err, users) => {
    if (err) return next(err);
    console.log('Get success');
    res.json(users);
  });
});

/* Create user */
router.post('/', (req, res, next) => {
  const requestObj = req.body;
  console.log(requestObj);
  const saltRounds = 11;
  const account_balance = {
    total: 0,
    on_hold: 0,
    available: 0
  };
  // encrypt password
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(requestObj.password, salt, (err, hash) => {
      if (err) return next(err);
      requestObj.password = hash;
      requestObj.active = false;
      requestObj.account_balance = account_balance;
      // store in db
      User.create(requestObj, (err, post) => {
        if (err) return next(err);
        // generate active code and send email
        const activeCode = uniqid();
        const current_date = new Date();
        const expired_date = current_date.setMinutes(current_date.getMinutes() + 10);
        Token.create({
          email: post.email,
          token: activeCode,
          expired_date,
        }, (err, token) => {
          if (err) return next(err);
          mailer.sendMailActive(token.email, token.token);
          res.json(post);
        });
      });
    });
  });
});

/* Check Login */
router.post('/login', (req, res, next) => {
  const requestObj = req.body;
  console.log(requestObj);
  User.findOne({ email: requestObj.email }, (err, user) => {
    if (err) return next(err);
    console.log(`user ${user}`);
    bcrypt.compare(requestObj.password, user.password, (err, isEqual) => {
      if (err) return next(err);
      if (isEqual) {
        res.json({
          success: true,
          data: user,
        });
      } else {
        res.json({
          success: false,
        });
      }
    });
  });
});

/* Active account */
router.get('/active/:active_code', (req, res, next) => {
  const token = req.params.active_code;
  console.log(`Active token: ${token}`);
  Token.findOne({ token }, (err, obj) => {
    if (err) return next(err);
    User.findOne({ email: obj.email }, (err, user) => {
      if (err) return next(err);
      user.active = true;
      User.findByIdAndUpdate(user._id, user, (err, updatedObj) => {
        if (err) return next(err);
        Token.deleteOne({ token }, err => {
          if (err) next(err);
        });
        res.send('Kích hoạt thành công');
      });
    });
  });
});
module.exports = router;
