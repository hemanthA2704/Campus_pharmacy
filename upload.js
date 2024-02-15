const mongoose = require("mongoose");
const uri = process.env.URI ;

try {
    // Connect to the MongoDB cluster
     mongoose.connect(
      uri,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
  } catch (e) {
    console.log("could not connect");
  }

const p = require("products.json");

console.log(p.products)



const productSchema = new mongoose.Schema({
    id : String ,
    name : String,
    price : Number ,
    image : String,
    description : String,
    reimbursible : Boolean
})


const Product = new mongoose.model("Product",productSchema);

p.products.forEach((product) => {
    const prod = new Product({
        id : product.id,
        name : product.name,
        price : product.price,
        image : product.image,
        description : product.description,
        reimbursible : product.reimbursible 
    })
    prod.save().then(function(result){
        console.log("successfully saved")
    })
})

