export function setupWebRTC(socket) {
    let peerConnection;
    let localStream;
    const localVideo = document.getElementById('localVideo');
    const remoteVideo = document.getElementById('remoteVideo');
    const connectButton = document.getElementById('connectButton');
    let otherUserId = null;

    // ICE servers configuration with STUN server
    const iceServers = {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };

    // Access to camera
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((stream) => {
            console.log('Camera access granted.');
            localVideo.srcObject = stream;
            localStream = stream;
            connectButton.style.display = 'block';  // Shows button after camera acess

            // Emits ready to the server when user wants to connect
            socket.emit('ready');

            // When user clicks on btn
            connectButton.addEventListener('click', () => {
                if (peerConnection) {
                    console.log('PeerConnection already exists.');
                    return; // For double connections
                }

                peerConnection = new RTCPeerConnection(iceServers);
                console.log('RTCPeerConnection created:', peerConnection);

                // Local stream gets added to peer connection
                localStream.getTracks().forEach(track => { 
                    peerConnection.addTrack(track, localStream); // To receive connection
                    console.log('Track added:', track);
                });

                // Making an offer for a connection
                socket.on('createOffer', (calleeId) => {
                    otherUserId = calleeId;
                    console.log(`Creating offer for callee ID: ${calleeId}`);

                    peerConnection.createOffer()
                        .then((offer) => {
                            console.log('Offer created:', offer);
                            return peerConnection.setLocalDescription(offer); // Puts the localdesc. into peerConn.
                        })
                        .then(() => {
                            console.log('Local description set. Sending offer...');
                            socket.emit('offer', peerConnection.localDescription, otherUserId);
                        })
                        .catch((error) => console.error('Error creating or sending offer:', error));
                });

                // Other user that receives an offer
                socket.on('offer', (offer, senderId) => {
                    console.log('Offer received from:', senderId);
                    otherUserId = senderId;

                    peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
                        .then(() => {
                            console.log('Remote description set. Creating answer...');
                            return peerConnection.createAnswer();
                        })
                        .then((answer) => {
                            console.log('Answer created:', answer);
                            return peerConnection.setLocalDescription(answer);
                        })
                        .then(() => {
                            console.log('Local description set. Sending answer...');
                            socket.emit('answer', peerConnection.localDescription, otherUserId);
                        })
                        .catch((error) => console.error('Error handling offer:', error));
                });

                // Listens to answer from other user
                socket.on('answer', (answer) => {
                    console.log('Answer received:', answer);
                    peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
                        .catch((error) => console.error('Error setting remote description:', error));
                });

                // Listens to ICE from other user
                socket.on('candidate', (candidate) => {
                    console.log('Candidate received:', candidate);
                    peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
                        .catch((error) => console.error('Error adding ICE candidate:', error));
                });

                // Sends ICE to other user
                peerConnection.onicecandidate = (event) => {
                    if (event.candidate) {
                        console.log('Sending ICE candidate:', event.candidate);
                        socket.emit('candidate', event.candidate, otherUserId);
                    } else {
                        console.log('All ICE candidates have been sent.');
                    }
                };

                // Receive remote stream from other user
                peerConnection.ontrack = (event) => {
                    console.log('Remote stream received:', event.streams[0]);
                    remoteVideo.srcObject = event.streams[0];  // Toon de remote video
                };
            });
        })
        .catch((error) => {
            console.error('Error accessing camera:', error);
        });
}