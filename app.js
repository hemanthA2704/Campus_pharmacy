require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const bcrypt = require("bcrypt");
const otpGenerator = require('otp-generator')
const axios = require("axios");
const session = require("express-session");
const passport = require("passport");


const auth = require("./models/auth.js") ;


// Setting the ejs template engine for our server
app.set("view engine","ejs");
// Middlewares
// Adding body parser middleware to the app
app.use(bodyParser.urlencoded({extended : true }))
// Enabling the express to serve static files contained in public
app.use(express.static(__dirname+"/public"));

app.use(express.json());


app.use(session({
    secret: 'keyboard cat',
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  }));

app.use(passport.initialize());
app.use(passport.session());
   

// connect to database
mongoose.connect("mongodb://localhost:27017/pharmaDB")


app.use("/", auth) ;

const {send , Otp} = require("./models/otp.js") ;

const User = require("./models/users") ;

const Product = require("./models/products.js")

const Order = require("./models/orders.js");




// app.get("/",function(req,res){
//     res.render("login",{message : ""});
// });

// app.post("/",function(req,res){
//     // console.log(req.body["g-recaptcha-response"]);
//     // console.log(req_body[0]);
//     const params = new URLSearchParams({
//         secret : "6LczpV8pAAAAAOzQDn-CRm1sK2qc7piaYjIqa_ZH",
//         response : req.body["g-recaptcha-response"]
//     })
//     axios({
//         method: 'post',
//         url: 'https://www.google.com/recaptcha/api/siteverify',
//         data: params 
//       }).then(function(response){
//         const data = response.data;
//         console.log(data)
//         if (data.success === true && data.score > 0.5) {
//             User.findOne({username : req.body.username}).then(function(found){
//                 if (found) {
//                     bcrypt.compare(req.body.password, found.password ,function(err,result){
//                         if (result === true){
//                             res.redirect("/website");
//                         } else {
//                             res.render("login",{message : "Invalid credentials"})
//                     }
//                     });
                    
//                 } else {
//                     res.render("login",{message : "User Not exists. Kindly Register to login."})
//                 }
//             });
//         } else {
//             res.redirect("/");
//         }

//       })
//     // console.log(response)
    
// });

app.get("/register",function(req,res){
    res.render("register",{message : ""})
})

app.post("/register",function(req,res){
    const username = req.body.username;
    if (username.includes("@iitbhilai.ac.in")){
        User.findOne({username : req.body.username}).then(function(found){
            if (found){
                res.render("register",{message : "Username already exists"});
            } else {
                const password = req.body.password
                if (password === req.body.confirm_password) {
                    bcrypt.hash(password , 10 , function(err,hash){
                        console.log(hash)
                        const user = User({
                            username : req.body.username,
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
    const checkEmail = req.body.username
    if (checkEmail.includes("@iitbhilai.ac.in")) {
        User.findOne({username : checkEmail}).then(function(found){
            if (found){
                const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
                bcrypt.hash(otp,10,function(err,hash){
                    Otp.findOne({username : checkEmail}).then(function(found){
                        if (found) {
                            found.otp = hash ;
                            found.save();
                        } else {
                            const newOtp = new Otp({
                                username : req.body.username,
                                otp : hash
                            })
                            newOtp.save();
                        }
                    })                   
                })                
                send(otp,checkEmail).catch(console.error);
                res.render("verify-otp",{username : req.body.username , message : ""})               
            } else {
                res.render("forgot_pwd",{ message : "User not found"});
            }
        } )
    } else {
        res.render("forgot_pwd",{ message : "Kindly enter the IIT Bhilai email "});
    }
})

app.post("/verify-otp",function(req,res){
    Otp.findOne({username : req.body.username}).then(function(found){
        console.log(found)
        if (found){
            console.log(req.body.otp);
            bcrypt.compare(req.body.otp , found.otp , function(err,result){
                console.log(result)
                if (result === true) {
                    Otp.deleteOne({username : req.body.username}).then(function(user){
                        console.log(user)
                        console.log( "is successfully deleted !")
                    })
                    res.render("change_password")
                } else {
                    res.render("verify-otp",{username : req.body.username ,message : "Invalid OTP . Please try again !!"})
                }
            })
        } else {
            res.render("verify-otp",{username : req.body.username ,message : "OTP expired!!"})
        }
    });
});

app.post("/change_pwd",function(req,res){
    console.log(req.body)
    User.findOneAndUpdate({username : req.body.username}).then(function(found){
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

app.get("/detail/:id",function(req,res){
    const id = req.params.id ;
    Product.findOne({id : id}).then(function(found){
        Product.find({}).then(function(products){
            res.render("detail", {product : found , products : products })
        })
    })
})


app.get("/checkout",function(req,res){
    Product.find({}).then(function(products){
        console.log(products);
        res.render("checkout", {products : products});
    })
});


app.get("/profile",function(req,res){
    if (req.isAuthenticated()) {
        res.render("profile" ,{ user : req.user})
    } else {
        res.redirect("/")
    }
});

app.get("/prev_orders" , function(req,res){
    res.render("prev_orders");
})

app.get("/cookie-ver",function(req,res){
    console.log(req.body)
    console.log(req.headers)
})

// CAN USE THIS PROPERTY AS WEB API FOR OUR PRODUCTS
app.get("/api/products",function(req,res){
    if (req.isAuthenticated()){
        Product.find({}).then(function(products){
            res.json(products);
        })
    } else {
        // Actually here a separate authentication should be added so that after successful authentication it should be redirected to same page;
        res.redirect("/")
    }
    
})



app.post("/payment",async function(req,res){
    // console.log(req.body);
    let totalQuantity = 0
    const items = req.body.products ;
    let totCost = 0
    for (var i = 0 ; i<items.length ; i++) {
        const curr = items[i].split(":") 
        console.log(typeof(curr[0]),curr[0])
        const id = curr[0]
        const found = await Product.findOne({ id: id });
        totCost = totCost + found.price * curr[1];
        totalQuantity+=Number(curr[1])
        console.log(totalQuantity);
    }
    
}) ;



app.listen(3000 , function(){
    console.log("Server is running on port 3000 locally.");
});