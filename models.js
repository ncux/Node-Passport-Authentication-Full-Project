const mongoose = require('mongoose');

const User = mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now()
        },
    },

);

module.exports = mongoose.model('Passport Authentication - Full Project - User', User);
