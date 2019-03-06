const express = require('express');
const app = express(); 
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');

// APP CONFIG
mongoose.connect('mongodb://localhost:27017/dogs', {useNewUrlParser: true});
app.set('view engine', 'ejs');
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({extended: true})); 

// MONGOOSE / MODEL CONFIG
const dogSchema = new mongoose.Schema({
    name: String,
    age: Number,
    breed: String,
    location: String,
    adopted: {type: Boolean, default: false}, 
    dateAdded: {type: Date, default: Date.now}
});

const Dog = mongoose.model('Dog', dogSchema); 

// // Test Saving New Dog to Database: 
// // ================================
// Dog.create({
//     name: 'Chester',
//     age: 7,
//     breed: 'beagle',
//     location: 'forever home',
//     adopted: true
// }, (err, item) => {
//     if(err){
//         console.log('ERROR!');
//         console.log(err);
//     } else {
//         console.log('Saved new dog'); 
//         console.log(item); 
//     }
// }); 

// ROUTES
app.get('/', (req, res) => {
    res.send('Welcome to the dog rescue app!');
}); 

// 1: Index route - show all available dogs
app.get('/dogs', (req, res) => {
    Dog.find({}, (err, dogs) => {
        if(err){
            console.log('Error finding dogs');
            console.log(err); 
        } else {
            console.log('Found all dogs'); 
            // display the available dogs
            res.render('index', {dogs: dogs});
        }
    }); 
    
}); 


app.listen(process.env.PORT, process.env.IP, () => {
    console.log('The puppies are waking up...');     
}); 