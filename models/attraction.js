const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const AttractionSchema = new Schema({
    name: String,
    price: Number,
    decription: String,
    distance: Number,
    busy: String,
    rateAvg: Number,
    phone: String,
    parking: Boolean

});


module.exports = mongoose.model("Attraction", AttractionSchema);
