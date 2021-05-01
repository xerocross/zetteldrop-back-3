const mongoose = require("mongoose");

const zettelSchema = new mongoose.Schema({
    id : String,
    user : String,
    text : String
});

const Zettel = mongoose.model("Zettel", zettelSchema);
module.exports = Zettel;