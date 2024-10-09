/////////////////////////////////////////////////////////////////////
/////////////////// Server setup ////////////////////////////////////
/////////////////////////////////////////////////////////////////////

// 1 - Required modules
const express = require('express');   
const http = require('http');         
const { Server } = require('socket.io');
const path = require('path');  // Used to serve static files with correct paths
const connectToMongoDB = require('./db/mongoDb-connect'); // Connection to mongoDB
const authRoutes = require('./routes/authRoutes');

// 2 - Creates an HTTP server + Express
const app = express();
const server = http.createServer(app);

// 3 - Socket.io
const io = new Server(server);

// 4 - This serves static files from the 'src' folder
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'src')));

// Routes
app.use('/auth', authRoutes);

// 5 - Websocket connection
io.on('connection', (socket) => {
    console.log('A user has connected:', socket.id);

    // Handles WebRTC signaling messages
    socket.on('offer', (offer) => {
        console.log('You Received an offer');
        socket.broadcast.emit('offer', offer);
    });

    socket.on('answer', (answer) => {
        console.log('You received an answer');
        socket.broadcast.emit('answer', answer);
    });

    socket.on('candidate', (candidate) => {
        console.log('You received a candidate');
        socket.broadcast.emit('candidate', candidate);
    });

    // Handles disconnection
    socket.on('disconnect', () => {
        console.log('A User has disconnected:', socket.id);
    });
});

connectToMongoDB(); //Connects to db

// Starts the server on port 3010
const PORT = 3010;
server.listen(PORT, () => {
    console.log(`The server is running on http://localhost:3010 `);
});