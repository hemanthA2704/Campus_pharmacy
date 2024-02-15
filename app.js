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
// mongoose.connect("mongodb://localhost:27017/pharmaDB")


// const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.URI;

try {
    // Connect to the MongoDB cluster
     mongoose.connect(
      uri,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
  } catch (e) {
    console.log("could not connect");
  }
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("pharmaDB").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);


app.use("/", auth) ;

const {send , Otp} = require("./models/otp.js") ;

const User = require("./models/users") ;

const Product = require("./models/products.js")

const Order = require("./models/orders.js");

const Med = require("./models/todo.js")

const Past = require("./models/pastOrders.js");

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
    const checkEmail = req.body.username ;
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

// app.get("/cookie-ver",function(req,res){
//     console.log(req.body)
//     console.log(req.headers)
// })

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

app.get("/nurse/:id",function(req,res){
    Med.findOne({id : req.params.id}).then(function(found){
        if (found) {
            res.render("nurse_checkout",{found : found}) ;
        } else {
            const user = {
                id : req.params.id,
                meds : []
            } ;
            const newUser = Med(user) ;
            newUser.save();
            res.redirect("/nurse/"+req.params.id);
        }
    })
})

app.get("/nurse",function(req,res){
    if (!req.isAuthenticated()){
        res.redirect("/") ;
    } else {
        res.render("nurse")
    }
})

app.post("/nurse",function(req,res){
    console.log(req.body.orderid);
    if (req.isAuthenticated && req.user.type === "Staff") {
        res.redirect("/nurse/"+req.body.orderid)
    } else {
        res.send("Please login as Staff to continue")
    }
    
})


app.post("/nurse/:id",function(req,res){
    const newItem =  {
        name : req.body.item ,
        quantity : req.body.quantity
    }
    Med.updateOne({id : req.params.id},{$push : {meds : newItem}}).then(function(done){
        if(done){
            res.redirect("/nurse/"+req.params.id);
        }
    })
  
})

// app.post("/nurse/update/:id",function(req,res){
//     Med.findOneAndUpdate({id : req.params.id}).then(function(found){
//         if (req.body.plus){

//         }
//     })
// })
// app.post("/sendToPharmacy",function(req,res){
//     // console.log(req.headers["referer"].toString())
//     // console.log(req.body)
//     const ref = req.headers["referer"].toString();
//     const orderId = ref.slice(28,37)
//     Med.findOne({id : orderId}).then(function(found){
//         req.
//     })
// })
app.get("/pharmacy",function(req,res){
    if (!req.isAuthenticated()) {
        res.redirect("/") ;
    } else {
        if (req.user.type === "Pharmacy"){
            res.render("pharmacy_orders",{found : { meds : [] , id : ""}});
        } else {
            res.send("Sorry .This is page is not accesible.") ;
        }
        
    } 
    
});



app.post("/searchOrder",function(req,res){
    Med.findOne({id : req.body.orderid}).then(function(found){
    if (found){      
            res.render("pharmacy_orders",{found : found});
        } else {
            res.redirect("/pharmacy");
        }
    });
}); 


app.post("/pharmacyCheckout",async function(req,res){
    const found = await Med.findOne({id : req.body.baby}) ;
    let items = [] ;
    let quantity = 0 ;
    let reimbursible = 0 ;
    let totPrice = 0 ;
    let pay = 0 ;
    for (var i = 0 ; i < found.meds.length ; i++) {
        const data = await Product.findOne({name : found.meds[i].name}) ;
        const newObject = Object.assign({},found.meds[i],data);
        items.push(newObject) ;
        // console.log(newObject) ;
        // console.log(items);
        quantity+=1 ;
        if (data.reimbursible) {
            reimbursible += found.meds[i].quantity*data.price ;
        } else {
            // console.log(typeof(found.meds[i].quantity)) ;
            pay+=found.meds[i].quantity*data.price 
        } 
        totPrice += found.meds[i].quantity*data.price ;
    }
    const order = {
        totalQuantity : quantity ,
        totalPrice : totPrice ,
        pay : pay ,
        reimPrice : reimbursible
    }
    res.render("pharmacy_checkout",{total : items , order : order ,orderId : req.body.baby});
});



app.post("/paymentDone",function(req,res){
    const orderId = req.body.order ;
    // console.log(orderId) ;
    // Med.findOne({id : orderId}).then(function(found){
    //     const newOrder = Past(found) ;
    //     newOrder.save();
    // })
    // Med.deleteOne({id : orderId}).then(function(order){
    //     console.log("deleted successfully") ;
    //     res.redirect("/pharmacy");
    // })

    Med.findOneAndDelete({id : orderId}).then(function(order){
        const newOrder = Past({
            id : order.id ,
            meds : order.meds
        })
        newOrder.save();
        res.redirect("/pharmacy");
    })
});


app.listen(3000 , function(){
    console.log("Server is running on port 3000 locally.");
});