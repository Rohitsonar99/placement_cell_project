const express = require('express');  // importing express
const port = 9300;
const db = require('./config/mongoose');   // importing db connection 
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');

const app = express();

//config Passport
require('./config/passport')(passport);

app.use(expressLayouts);
// extract style and scripts form sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
// view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Bodyparser
app.use(express.urlencoded({ extended: false }));

//Express Session
app.use(session({
    secret: 'too secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl:"mongodb+srv://UniquePrince:32323212@cluster0.sezsu7p.mongodb.net/?retryWrites=true&w=majority", // Enter your DB url
        autoRemove: 'disabled'
    })
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());
//   Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// routes
app.use('/', require('./routes'));


// Run Server
app.listen(port, (err) => {
    if (err) {
        console.error(`Error in running server ${err}`);
    }
    console.log(`Server is running ${port}`);
})