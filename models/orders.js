const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderItems : Array ,
    name : String,
    Phone : String,
    // address : GeolocationCoordinates,
    nick : String,
    residence : String,
    building : String
})

const Order = mongoose.model("Order",orderSchema);

module.exports = Order ;