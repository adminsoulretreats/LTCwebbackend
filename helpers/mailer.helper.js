const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  // host: 'smtp.gmail.com',
  service: "gmail",
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORDEMAIL,
  },
});

/**
 *
 * @param {*} target : Gửi tới ai
 * @param {*} subject : Đối tượng
 * @param {*} content : Nội dung
 */
const mailer = (target, subject, content, html) => {
  // create mail options
  let mailOptions = {
    from: process.env.EMAIL,
    to: target,
    subject: subject,
    text: content,
    html: html,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  mailer,
};
