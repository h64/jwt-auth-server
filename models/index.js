const mongoose = require('mongoose');

// Mongoose connection string
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/auth-example-26', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

module.exports.User = require('./user');