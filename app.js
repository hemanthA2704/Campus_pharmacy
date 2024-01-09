require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const bcrypt = require("bcrypt");
const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer');
const redis = require("redis");

// Setting the ejs template engine for our server
app.set("view engine","ejs");

// Middlewares

// Adding body parser middleware to the app
app.use(bodyParser.urlencoded({extended : true }))
// Enabling the express to serve static files contained in public
app.use(express.static(__dirname+"/public"));


app.use(express.json());




// connect to database
mongoose.connect("mongodb://localhost:27017/pharmaDB")

const userSchema = new mongoose.Schema({
    email : String,
    password : String,
    type : String
});

const User = new mongoose.model("User",userSchema);


app.get("/test",function(req,res){
    res.render("forgot_pwd");
});

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
    email: {
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



app.get("/",function(req,res){
    res.render("login",{message : ""});
});

app.post("/",function(req,res){
    User.findOne({email : req.body.email}).then(function(found){
        if (found) {
            bcrypt.compare(req.body.password, found.password ,function(err,result){
                if (result === true){
                    res.redirect("/website");
                } else {
                    res.render("login",{message : "Invalid credentials"})
            }
            });
            
        } else {
            res.redirect("/register")
        }
    });
});

app.get("/register",function(req,res){
    res.render("register",{message : ""})
})

app.post("/register",function(req,res){
    const email = req.body.email;
    if (email.includes("@iitbhilai.ac.in")){
        User.findOne({email : req.body.email}).then(function(found){
            if (found){
                res.render("register",{message : "Username already exists"});
            } else {
                const password = req.body.password
                if (password === req.body.confirm_password) {
                    bcrypt.hash(password , 10 , function(err,hash){
                        console.log(hash)
                        const user = User({
                            email : req.body.email,
                            password : hash,
                            type : req.body.userType
                        });
                        user.save();
                        res.render("success");
                    })
                    
                } else {
                    res.render("register",{message : "Confirm password is not same. Re-check the passwords entered"})
                }
            }
        })
        
    } else {
        res.render("register" , {message : "Only IIT Bhilai emails are allowed !"})
    }
})


app.get("/forget",function(req,res){
    res.render("forgot_pwd.ejs",{message : ""})
})

app.post("/forget",function(req,res){
    const checkEmail = req.body.email
    if (checkEmail.includes("@iitbhilai.ac.in")) {
        User.findOne({email : checkEmail}).then(function(found){
            if (found){
                const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
                bcrypt.hash(otp,10,function(err,hash){
                    Otp.findOne({email : checkEmail}).then(function(found){
                        if (found) {
                            found.otp = hash ;
                            found.save();
                        } else {
                            const newOtp = new Otp({
                                email : req.body.email,
                                otp : hash
                            })
                            newOtp.save();
                        }
                    })                   
                })                
                send(otp,checkEmail).catch(console.error);
                res.render("verify-otp",{email : req.body.email , message : ""})               
            } else {
                res.render("forgot_pwd",{ message : "User not found"});
            }
        } )
    } else {
        res.render("forgot_pwd",{ message : "Kindly enter the IIT Bhilai email "});
    }
})

app.post("/verify-otp",function(req,res){
    Otp.findOne({email : req.body.email}).then(function(found){
        console.log(found)
        if (found){
            console.log(req.body.otp);
            bcrypt.compare(req.body.otp , found.otp , function(err,result){
                console.log(result)
                if (result === true) {
                    Otp.deleteOne({email : req.body.email}).then(function(user){
                        console.log(user)
                        console.log( "is successfully deleted !")
                    })
                    res.render("change_password")
                } else {
                    res.render("verify-otp",{email : req.body.email ,message : "Invalid OTP . Please try again !!"})
                }
            })
        } else {
            res.render("verify-otp",{email : req.body.email ,message : "OTP expired!!"})
        }
    });
});



app.post("/change_pwd",function(req,res){
    console.log(req.body)
    User.findOneAndUpdate({email : req.body.email}).then(function(found){
        console.log(found)
        bcrypt.hash(req.body.confirm_password,10,function(err,hash){
            if (!err) {
                found.password = hash;
                
                found.save();
                res.render("success.ejs")
            } else {
                console.log(err)
            }
        })
    })
})
       

app.listen(3000 , function(){
    console.log("Server is running on port 3000 locally.");
});