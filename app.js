const express = require('express');
const app = express(); 
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const Dog = require('./models/dog');
const User = require('./models/user');

// APP CONFIG
mongoose.connect('mongodb://localhost:27017/dogs', {useNewUrlParser: true});
app.set('view engine', 'ejs');
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({extended: true})); 
app.use(methodOverride('_method'));

// Express-Session
app.use( require('express-session')({
    secret: ['run like the wind', 'take long walks', 'play like no one is watching', 'love everyone you meet'],
    resave: false,
    saveUninitialized: false
}));

// Passport CONFIG
app.use(passport.initialize());
app.use(passport.session()); 

// use static authenticate method of model in LocalStrategy (from passport-local-mongoose)
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support (from passport-local-mongoose)
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


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

// Create custom middleware to be called on every route that passes on the user object info (if logged in)
app.use( function (req, res, next) {
    res.locals.currentUser = req.user; 
    next();
}); 

// ROUTES
app.get('/', (req, res) => {
    res.render('home');
}); 

// 1: Index route - show all available dogs
app.get('/dogs', (req, res) => {
    Dog.find({}, (err, dogs) => {
        if(err){
            console.log('Error finding dogs');
            console.log(err); 
        } else {
            // console.log('Found all dogs'); 
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
            // console.log('Saved new dog'); 
            // console.log(dog); 
            res.redirect('/dogs');
        }
    }); 
    
}); 

// 4: SHOW - show more information about a particular dog
app.get('/dogs/:id', (req, res) => {
    
    Dog.findById(req.params.id, (err, dogToFind) => {
        if(err) {
            console.log('Error getting dog details.');
            console.log(err);
        } else {
            // console.log('Yay! We found the dog you\'re looking for.'); 
            // console.log(dogToFind);
            res.render('show', { dog: dogToFind });
        }
    });
}); 


// 5: EDIT - show the edit form for a particular dog
app.get('/dogs/:id/edit', (req, res) => {
    Dog.findById(req.params.id, (err, dogInfo) => {
        if (err) {
            console.log('Whoops! Check out this error first:');
            console.log(err);
        } else {
            // Show the edit form & pass in the dog's info
            res.render('edit', { dog: dogInfo });
        }
    }); 
}); 

// 6: UPDATE - Lookup & update a particular dog, then redirect 
app.put('/dogs/:id', (req, res) => {
    Dog.findByIdAndUpdate(req.params.id, req.body.dog, (err, dogInfo) => {
        if (err) {
            console.warn('ERROR!!');
            console.log(err);
        } else {
            // console.log(dogInfo);
            // Redirect back to the dog's full info (SHOW) page
            res.redirect(`/dogs/${req.params.id}`);
        }
    });  
}); 

// 7 - DESTROY route 
app.delete('/dogs/:id', (req, res) => {
    Dog.findByIdAndRemove(req.params.id, (err, doc) => {
        if (err) {
            console.log(err); 
        } else {
            console.log(doc); 
            res.redirect('/'); 
        }
    }); 
    
}); 


// Auth routes
// REGISTER / SIGN-UP
    // GET
    app.get('/register', (req, res) => {
        res.render('register');
    }); 
    
    // POST
    app.post('/register', (req, res) => {
        // use the .register() method from passport-local-mongoose
        // https://github.com/saintedlama/passport-local-mongoose#static-methods
        User.register(new User({username: req.body.username}), req.body.password, (err, data) => {
            if(err) {
                console.log(err);
                // send user back to the register page
                // TODO: show errors
                // return to get out of the callback
                return res.render('/register'); 
            } 
            
            // if no error, then authenticate & redirect user somewhere
            passport.authenticate('local')(req, res, () => {
            /* The .authenticate() method will: 
                (1) log user in, 
                (2) store session info, 
                (3) run serialize user method, and 
                (4) local strategy auth */
                res.redirect('/dogs/new');
            });
            
        });

    }); 

// LOGIN
    // GET
    app.get('/login', (req, res) => {
        res.render('login');
    }); 
    
    // POST
    // pass in the authenticate method as middleware
    // shouldn't be anything needed in the callback
    app.post('/login', passport.authenticate('local', {
        successRedirect: '/profile',
        failureRedirect: '/register'
    }), (req, res) => {
        
    }); 

// LOGOUT
    // GET
    app.get('/logout', (req, res) => {
        // use passport method to destroy the user session
        req.logout(); 
        res.redirect('/'); // redirect back to the home page
    }); 

// middleware
function isLoggedIn(req, res, next) {
    // check the Passport.js isAuthenticated() method 
    // req.isAuthenticated() returns true if user logged in
    if ( req.isAuthenticated() ) { 
        return next(); 
    }
    
    // send user to the logged in page.
    res.redirect('/login'); 
}


app.listen(process.env.PORT, process.env.IP, () => {
    console.log('The puppies are waking up...');     
});  