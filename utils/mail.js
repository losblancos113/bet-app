const nodemailer = require('nodemailer');

const emailFrom = 'hmtmail1@gmail.com';
//pass prjfttgnuqegvqwe
const password = 'prjfttgnuqegvqwe';
const hostname = 'localhost';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailFrom,
    pass: password,
  },
});

function send(mailOptions) {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
}

function sendMailActive(email, activeCode) {
  const link = `http://${hostname}:3000/user/active/${activeCode}`;
  const mailOptions = {
    from: emailFrom,
    to: email,
    subject: 'Bet69 -Kích hoạt tài khoản',
    text: `Click vào link này để active account : ${link}`,
  };
  send(mailOptions);
}

module.exports.sendMailActive = sendMailActive;
