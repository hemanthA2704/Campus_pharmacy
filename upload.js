const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/pharmaDB");

const p = require("products.json");

console.log(p.products)



const productSchema = new mongoose.Schema({
    id : String ,
    name : String,
    price : Number ,
    image : String,
    description : String
})


const Product = new mongoose.model("Product",productSchema);

p.products.forEach((product) => {
    const prod = new Product({
        id : product.id,
        name : product.name,
        price : product.price,
        image : product.image,
        description : product.description
    })
    prod.save().then(function(result){
        console.log("successfully saved")
    })
})

