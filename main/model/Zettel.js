const mongoose = require("mongoose");

const zettelSchema = new mongoose.Mongoose.Schema({
    id : String,
    user : String,
    text : String
});

const Zettel = mongoose.model("Zettel", zettelSchema);
module.exports = Zettel;