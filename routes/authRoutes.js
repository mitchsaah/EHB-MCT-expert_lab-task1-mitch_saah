const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const router = express.Router();
const saltRounds = 10;

// Adds a user 
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Checks if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'This username is already taken' });
        }

        // Hashes the pw
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Adds new user to db
        const newUser = new User({
            username,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'The user has been registered!' });
    } catch (err) {
        res.status(500).json({ message: 'Oops, there was a problem', error: err });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Optional: If you want to return a JWT for authentication
        // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // res.json({ message: 'Login successful', token });

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error during login', error });
    }
});

module.exports = router;