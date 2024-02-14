const mongoose = require("mongoose") ;

const nurseSchema = new mongoose.Schema({
    id : String ,
    meds : Array
});

const Med = mongoose.model("Med",nurseSchema) ;

module.exports = Med ;