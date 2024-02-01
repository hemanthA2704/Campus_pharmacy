const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    username : String,
    password : String,
    type : String
});

const User = new mongoose.model("User",userSchema);

module.exports = User ;