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
    image: {type: String, default: 'https://loremflickr.com/320/240/dog'}, 
    adopted: {type: Boolean, default: false}, 
    dateAdded: {type: Date, default: Date.now}
});

const Dog = mongoose.model('Dog', dogSchema); 

// // Test Saving New Dog to Database: 
// // ================================
// Dog.create({
//     name: 'Chester',
//     image: 'https://picsum.photos/200/200/?random',
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

// 2: NEW - show a form that lets a user create a new dog
app.get('/dogs/new', (req, res) => {
    res.render('new');
}); 

// 3: CREATE - add a dog to the database, then redirect to the index page
app.post('/dogs', (req, res) => {
    // console.log(req.body.dog); // all in the dog object
    // Create the dog
    Dog.create(req.body.dog, (err, dog) => {
        if(err){
            console.log('ERROR!');
            console.log(err);
        } else {
            console.log('Saved new dog'); 
            console.log(dog); 
            res.redirect('/dogs');
        }
    }); 
    
}); 

// 4: SHOW - show more information about a particular dog
app.get('/dogs/:id', (req, res) => {
    res.send('you found the SHOW page');
}); 


app.listen(process.env.PORT, process.env.IP, () => {
    console.log('The puppies are waking up...');     
}); 