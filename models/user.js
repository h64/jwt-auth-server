const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: String,
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 32
    },
    profileUrl: String
})

// Use bcrypt to hash the password
userSchema.pre('save', function(next) {
    this.password = bcrypt.hashSync(this.password, 12);
    next()
})

// Ensure the password is stripped from user
userSchema.set('toJSON', {
    transform: (doc, user) => {
        delete user.password
        return user;
    }
})

// Create a helper function to compare the password hashes
userSchema.methods.isAuthenticated = function(typedPassword) {
    return bcrypt.compareSync(typedPassword, this.password);
}


module.exports = mongoose.model('User', userSchema);