// 1 - Establishes a connection with the server via Socket.IO
console.log('main.js is loaded and initialized');
const socket = io();  // Connects to the server
console.log('Socket connected:', socket);

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
        } else {
            document.getElementById('registerMessage').textContent = 'Error: ' + data.message;
        }
    } catch (error) {
        document.getElementById('registerMessage').textContent = 'Error: Could not connect to server';
    }
});

