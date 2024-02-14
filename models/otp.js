const mongoose = require("mongoose");
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_HOST,
      pass: process.env.MAIL_PASS,
    },
  });



const otpSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    // createdAt: {
    //     type: Date,
    //     default: Date.now,
    //     expires: 60 , // The document will be automatically deleted after 1 minutes of its creation time
    // }
});

const Otp = new mongoose.model( "Otp" , otpSchema)

// async..await is not allowed in global scope, must use a wrapper
async function send(otp,checkEmail) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Hemanth" <ankadalahemanth@gmail.com>', // sender address
      to: checkEmail, // list of receivers
      subject: "OTP for forgot password.", // Subject line
      text: otp, // plain text body
      html: "Hey ! your otp for verfying your account is " + otp, 
    });
  
    console.log("Message sent: %s", info.messageId);
}

module.exports = {send , Otp}