const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');


// User model
const User = require('../models');


module.exports = passport => {
  passport.use(
      new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
          // check for user in database
          try {
              let user = await User.findOne({ email: email });
              if (!user) {
                  return done(null, false, { message: 'Email was not found. Try registering for an account.' });
              } else {
                  // compare passwords
                  bcrypt.compare(password, user.password, (err, isMatch) => {
                      if (err) throw err;
                      if (isMatch) {
                          return done(null, user);
                      } else {
                          return done(null, false, { message: 'Incorrect password. Try again.' });
                      }
                  });
              }
          } catch (e) {
              console.log(e);
          }
      })
  );



    // session logic
    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user));
    });
};

