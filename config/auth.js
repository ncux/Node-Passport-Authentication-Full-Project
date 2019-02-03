
module.exports = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.flash('error_message', 'You need to be logged in to access this page!');
    res.redirect('/auth/login');
};
