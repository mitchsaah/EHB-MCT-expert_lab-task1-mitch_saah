// db/mongoDb-connection.js
const mongoose = require('mongoose');
require('dotenv').config();  // To secure credentials

// To connect to MongoDB
const connectToMongoDB = async () => {
    const mongoUri = process.env.MONGO_URI; // Private credential from .env

    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to the database');
    } catch (err) {
        console.error('Failed to connect to the database', err);
        // Stops the app after failed connection
        process.exit(1);  
    }
};

module.exports = connectToMongoDB;
