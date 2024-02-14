const mongoose = require("mongoose") ;

const schema = new mongoose.Schema({
    id : String ,
    meds : Array
});

const Past = mongoose.model("Past",schema) ;

module.exports = Past ;