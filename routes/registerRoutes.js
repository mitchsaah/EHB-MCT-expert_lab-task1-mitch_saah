const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const router = express.Router();
const saltRounds = 10;  

// Registration route
router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Checks if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        // Hashes the pw and saves new user in db
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({
            username,
            password: hashedPassword
        });

        await newUser.save();  // Saves new user 
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error during registration', error });
    }
});

module.exports = router;