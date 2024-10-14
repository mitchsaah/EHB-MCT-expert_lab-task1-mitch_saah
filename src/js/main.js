// 1 - Establishes a connection with the server via Socket.IO
const socket = io();  // Connects to the server

// 2 - Registration form
const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();  // Prevents the the page of refreshing

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // Simulates server structure
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById('registerMessage').textContent = 'Registration successful! Starting video chat...';
            startVideoChat(); 
        } else {
            document.getElementById('registerMessage').textContent = 'Error: ' + data.message;
        }
    } catch (error) {
        document.getElementById('registerMessage').textContent = 'Error: Could not connect to server';
    }
});

function startVideoChat() {
    console.log('Starting video chat...');  // Debugging log
    document.getElementById('registerSection').style.display = 'none';  // Hides registration after
    document.getElementById('videoSection').style.display = 'block';  // Shows videosection

    // Emit 'ready' event to the server
    socket.emit('ready');

    // Initializes WebRTC setup
    import('./client.js').then(({ setupWebRTC }) => {
        setupWebRTC(socket);  // Call the WebRTC setup function
    }).catch(error => console.error('Error loading client.js:', error));
}

