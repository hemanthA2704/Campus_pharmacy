const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const bcrypt = require("bcrypt");



// Setting the ejs template engine for our server
app.set("view engine","ejs");

// Middlewares

// Adding body parser middleware to the app
app.use(bodyParser.urlencoded({extended : true }))
// Enabling the express to serve static files contained in public
app.use(express.static(__dirname+"/public"));






// connect to database
mongoose.connect("mongodb://localhost:27017/pharmaDB")

const userSchema = new mongoose.Schema({
    email : String,
    password : String,
    type : String
});

const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("login",{message : ""});
});

app.post("/",function(req,res){
    User.findOne({email : req.body.email}).then(function(found){
        if (found) {
            bcrypt.compare(req.body.password, found.password ,function(result){
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
                if (req.body.password === req.body.confirm_password) {
                    bcrypt.hash(req.body.password , process.env.SALT_ROUNDS , function(err,hash){
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
    res.render("forget")
})

app.listen(3000 , function(){
    console.log("Server is running on port 3000 locally.");
});