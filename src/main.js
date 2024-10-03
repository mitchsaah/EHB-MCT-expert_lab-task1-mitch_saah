// 1 - Establishes a connection with the server via Socket.IO
const socket = io();  // Connect to the server

// 2 - Gets the video elements from the HTML file
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
let localStream;
let peerConnection;

// 3 - This STUN server is to establish a WebRTC connection
const iceServers = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

// 4 -  Access the user's camera (getUserMedia API)
navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then((stream) => {
        localVideo.srcObject = stream;  // Display local video in localVideo element
        localStream = stream;
    })
    .catch((error) => {
        console.error('Error accessing camera:', error);
    });
    