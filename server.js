/////////////////////////////////////////////////////////////////////
/////////////////// Server setup ////////////////////////////////////
/////////////////////////////////////////////////////////////////////

// 1 - Required modules
const express = require('express');   
const http = require('http');         
const { Server } = require('socket.io');
const { handleSocketConnection } = require('./src/js/serverSocket'); 
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

// WebSocket connections
handleSocketConnection(io); 

connectToMongoDB(); //Connects to db

// Starts the server on port 3010
const PORT = 3010;
server.listen(PORT, () => {
    console.log(`The server is running on http://localhost:3010 `);
});