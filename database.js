const mongoose = require('mongoose');
const config = require('./config/settings');

mongoose.connect(config.databaseUrl, { useNewUrlParser: true }, err => {
    if(err) {
        console.log(err);
    } else {
        console.log('Connected to database!');
    }
});

module.exports = mongoose;
