const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static assets folder
app.use(express.static(path.join(__dirname, "public")));

// Run when client connects
io.on("connection", (socket) => {
  socket.emit("message", "Welcome to Union!");

  // Broadcast user connection
  socket.broadcast.emit("message", "A new user has entered Union");

  // Client disconnect
  socket.on("disconnect", () => {
    io.emit("message", "A user has left Union");
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    io.emit("message", msg);
  });
});

// Define variable PORT and initialize server
const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`Express app running on port ${PORT}`);
});
