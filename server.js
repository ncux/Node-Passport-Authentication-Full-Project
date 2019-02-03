const express = require('express');
const path = require('path');
const layouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

// config settings
const settings = require('./config/settings');

const index = require('./routes/index');
const auth = require('./routes/auth');

const port = process.env.PORT || 3000;

// bootstrap database connection
const { database } = require('./database');

// passport config
require('./config/passport')(passport);

const app = express();

// static dir
app.use(express.static(path.join(__dirname, 'public')));

// template engine
app.use(layouts);
app.set('view engine', 'ejs');

// body-parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// express session
app.use(session({
    secret: settings.session.secret,
    resave: settings.session.resave,
    saveUninitialized: settings.session.saveUninitialized
}));

// passport
app.use(passport.initialize());
app.use(passport.session());

// flash messages
app.use(flash());

// global variables for flash messages
app.use((req, res, next) => {
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
});

// index route
app.use('/', index);

// authentication route
app.use('/auth', auth);


app.listen(port, () => console.log(`Server running on port ${port}`));

