const mongoose = require('mongoose'); 

// MONGOOSE / MODEL CONFIG
const dogSchema = new mongoose.Schema({
    name: String,
    ageYr: Number,
    ageMo: Number,
    breed: String,
    location: String,
    image: String,
    description: String,
    adopted: {type: Boolean, default: false}, 
    dateAdded: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Dog', dogSchema); 