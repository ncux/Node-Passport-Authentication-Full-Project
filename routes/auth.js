const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const AuthenticationGuard = require('../config/auth');

// User model
const User = require('../models');


// render the login form
router.get('/login', async (req, res) => {
    res.render('login');
});


// passport authentication
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/auth/dashboard',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next);
});


// logout user
router.get('/logout', async (req, res) => {
    req.logout();
    req.flash('success_message', 'You have successfully logged out!');
    res.redirect('/auth/login');
});


// render the registration form
router.get('/register', async (req, res) => {
    res.render('register');
});


// register a new user
router.post('/register', async (req, res) => {
    console.log(req.body);
    const { fullname, email, password, password2 } = req.body;
    const errors = [];

    // check for required fields
    if (!fullname || !email || !password || !password2) {
        errors.push({ message: 'Please fill in all fields!' });
    }

    // check passwords match
    if (password !== password2) {
        errors.push({ message: 'The passwords do not match!' });
    }

    // check if password isn't too short
    if (password.length < 8) {
        errors.push({ message: 'Password must be at least 8 characters long!' });
    }

    if (errors.length > 0) {
        res.render('register', { errors, fullname, email, password, password2 });
    } else {
        // check if user already exists
        let user = await User.findOne({ email: email });
        if (user) {
            // flash error message
            req.flash('error_message', 'Email already exists. Try logging in.');
            // redirect to login page
            res.redirect('/auth/login');
        } else {
            // register new user
            let newUser = new User({ fullname, email, password });

            // hash the password and save the user
            bcrypt.genSalt(10, (err, salt) => bcrypt.hash(password, salt, async (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                await newUser.save();
                // flash success message
                req.flash('success_message', 'You are now registered. Please login.');
                res.redirect('/auth/login');
            }));

        }
    }

});


router.get('/dashboard', AuthenticationGuard, (req, res) => res.render('dashboard', { user: req.user.fullname }));


module.exports = router;
