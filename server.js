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
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();
const { HfInference } = require("@huggingface/inference-api");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const HF_TOKEN = process.env.HF_API_KEY;
const hf = new HfInference(HF_TOKEN);

app.use(cors());
app.use(express.json());

let leaderboard = {}; // Store player scores

// AI-generated vocabulary question
app.get("/generate-question", async (req, res) => {
  try {
    const response = await hf.textGeneration({
      model: "facebook/bart-large-mnli",
      inputs: "Create a vocabulary quiz question for college students.",
      parameters: { max_length: 50 },
    });
    res.json({ question: response.generated_text });
  } catch (error) {
    res.status(500).json({ error: "AI failed to generate a question" });
  }
});

// Real-time communication
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send updated leaderboard
  socket.emit("update_leaderboard", leaderboard);

  // Handle player answers
  socket.on("send_answer", (data) => {
    const { user, answer, correct } = data;

    if (correct) {
      leaderboard[user] = (leaderboard[user] || 0) + 10; // +10 points for correct answer
    } else {
      leaderboard[user] = (leaderboard[user] || 0) + 0; // No points for wrong answers
    }

    io.emit("update_leaderboard", leaderboard); // Send updated leaderboard to all
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));
