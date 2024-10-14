export const handleSocketConnection = (io) => {
    let connectedUsers = [];

    io.on('connection', (socket) => {
        console.log('A user has connected:', socket.id);

        // Wanneer een gebruiker klaar is om te verbinden
        socket.on('ready', () => {
            // Controls if the user is ready to connect
            if (!connectedUsers.some(user => user.id === socket.id)) {
                console.log(`A user is ready to connect: ${socket.id}`);
                connectedUsers.push({ id: socket.id, isConnected: false });
            }

            // Controls if we haven't used 2 users that haven't been connected yet
            const readyUsers = connectedUsers.filter(user => !user.isConnected);
            if (readyUsers.length >= 2) {
                const [caller, callee] = readyUsers;

                // Connects caller to callee
                if (caller.id !== callee.id) {
                    console.log(`Connecting caller: ${caller.id}, callee: ${callee.id}`);
                    io.to(caller.id).emit('createOffer', callee.id);  // Vraag de caller om een offer te maken
                    caller.isConnected = true;
                    callee.isConnected = true;  // Markeer als verbonden
                }
            }
        });

        // Processes answer from the caller and returns it to the callee
        socket.on('offer', (offer, targetUserId) => {
            console.log(`Offer received from ${socket.id}, sending to ${targetUserId}`);
            io.to(targetUserId).emit('offer', offer, socket.id);  // Stuur de offer naar de callee
        });

        // Processes answer from the caller and returns it to the callee
        socket.on('answer', (answer, targetUserId) => {
            console.log(`Answer received from ${socket.id}, sending to ${targetUserId}`);
            io.to(targetUserId).emit('answer', answer);  // Stuur de answer naar de caller
        });

        // ICE exchange
        socket.on('candidate', (candidate, targetUserId) => {
            console.log(`Candidate received from ${socket.id}, sending to ${targetUserId}`);
            io.to(targetUserId).emit('candidate', candidate);  // Stuur de ICE-candidate naar de andere peer
        });

        // When user disconnects
        socket.on('disconnect', () => {
            console.log(`A user has disconnected: ${socket.id}`);
            connectedUsers = connectedUsers.filter(user => user.id !== socket.id);
        });
    });
};