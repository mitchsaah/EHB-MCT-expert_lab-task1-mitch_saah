const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/UserModel');
const router = express.Router();
const saltRounds = 10;  // For the hashing of the pw

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

module.exports = router;

// Updates user
router.put('/update', async (req, res) => {
    const { username, newUsername, newPassword } = req.body;

    try {
        // Checks if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Updates the username
        if (newUsername) {
            const existingUser = await User.findOne({ username: newUsername });
            if (existingUser) {
                return res.status(400).json({ message: 'This new username has been taken already' });
            }
            user.username = newUsername;
        }

        // Updates the pw
        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
            user.password = hashedPassword;
        }

        // Saves made changes
        await user.save();
        res.status(200).json({ message: 'The user has been updated' });
    } catch (err) {
        res.status(500).json({ message: 'Oops, there was an error when the updating user', error: err });
    }
});

// Deletes user 
router.delete('/delete', async (req, res) => {
    const { username } = req.body;

    try {
        // Searches and deletes user
        const user = await User.findOneAndDelete({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'The user has been deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Oops, there was an error when deleting this user', error: err });
    }
});