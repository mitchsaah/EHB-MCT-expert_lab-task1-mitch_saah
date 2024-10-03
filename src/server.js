/////////////////////////////////////////////////////////////////////
/////////////////// Server setup ////////////////////////////////////
/////////////////////////////////////////////////////////////////////

// 1 - Required modules
const express = require('express');   
const http = require('http');         

// 2 - Creates an HTTP server + Express
const app = express();
const server = http.createServer(app);

// Starts the server on port 3000
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`The server is running`);
});