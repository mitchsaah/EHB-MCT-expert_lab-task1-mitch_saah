const mongoose = require('mongoose');

// Defines the scheme for users
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }  // Password saved (hashed)
});

// Creates the usermodel based on scheme
const User = mongoose.model('User', userSchema);

module.exports = User;
