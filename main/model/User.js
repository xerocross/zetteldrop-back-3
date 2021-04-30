const mongoose = require("mongoose");

const userSchema = new mongoose.Mongoose.Schema({
    username : String,
    password : String
});

module.exports = mongoose.model("User", userSchema);