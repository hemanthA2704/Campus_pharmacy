const express = require("express") ;
const passport = require("passport") ;
const localStrategy = require("passport-local").Strategy ;
const bcrypt = require("bcrypt");
const User = require("./users.js") ;
const axios = require("axios");

const Product = require("./products.js")

passport.use(new localStrategy(function verify(username , password , done){
    User.findOne({username : username}).then(function(found){
        if (!found){
            return done(null , false , {message : "Incorrect Username or Password"});
        }
        bcrypt.compare(password , found.password , function(err , result) {
            if (err) {return done(err)}
            if (!result){
                return done(null ,false , {message : "Incorrect Usename or Password"}) ;
            }
            return done(null ,found)
        });
    });
}));

passport.serializeUser(function(user,done){
    done(null,user._id)
});
passport.deserializeUser(function(id, done) {
    // console.log(id)
    User.findOne({_id : id}).then(function(user) {
        return done(null, {id : user._id , type : user.type });
    });
});

const router = express.Router() ;

router.get("/",function(req,res){
    // console.log(req);
    if (!req.isAuthenticated()) {
        res.render("login",{message : ""})
    }
    else if (req.user.type === "Pharmacy"){
        res.redirect("/pharmacy");
    } else if(req.user.type === "Staff") {
        res.redirect("/nurse")
    } else{
        Product.find({}).then(function(products){
            res.render("home",{products : products});
        });
    }
});


router.post("/", function(req, res,next) {
    const params = new URLSearchParams({
        secret: "6LczpV8pAAAAAOzQDn-CRm1sK2qc7piaYjIqa_ZH",
        response: req.body["g-recaptcha-response"]
    });

    axios({
        method: 'post',
        url: 'https://www.google.com/recaptcha/api/siteverify',
        data: params
    }).then(function(response) {
        const data = response.data;
        console.log(data);
        if (data.success === true && data.score > 0.5) {
            next()
        } else {
            res.redirect("/");
        }
    });
} , passport.authenticate("local",{successRedirect : "/" , failureRedirect : "/"}) );

module.exports = router ; 