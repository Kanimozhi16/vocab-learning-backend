const express = require('express');
const axios = require('axios');
const cors = require('cors');
const http = require('http'); // To create a HTTP server for Socket.IO
const socketIo = require('socket.io'); // Import Socket.IO

const app = express();
const port = 3000;

// Create an HTTP server and link it to Express app
const server = http.createServer(app);

// Initialize Socket.IO with the server
const io = socketIo(server); // Now you have access to 'io'

// Enable CORS for all routes
app.use(cors());

// Use express.json() middleware to parse JSON requests
app.use(express.json());

// Your Hugging Face API key
const apiKey = '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';
const model = 'bert-base-uncased'; // Replace with your model
const endpoint = `https://api-inference.huggingface.co/models/${model}`;

app.post('/infer', (req, res) => {
  const inputText = req.body.text; // Expecting input text to be sent in JSON with a "text" field

  const headers = {
    Authorization: `Bearer ${apiKey}`,
  };

  const data = {
    inputs: inputText,
  };

  axios
    .post(endpoint, data, { headers })
    .then((response) => {
      res.json(response.data); // Send the response from Hugging Face API back to the client
    })
    .catch((error) => {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error calling the Hugging Face API' });
    });
});

// Socket.IO connection event
io.on("connection", (socket) => {
  console.log("A user connected");

  // Example of emitting an event to the client
  socket.emit("message", "Hello from server!");

  // Handle any event from the client
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the HTTP server (use this instead of app.listen)
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});





