const express = require("express");
const formatMessage = require("./utils/messages");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Channel message provider
const channelService = "Union Bot";

// Set static assets folder
app.use(express.static(path.join(__dirname, "public")));

// Run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    // Join appropriate room
    socket.join(user.room);

    // Welcome new user
    socket.emit(
      "message",
      formatMessage(channelService, `Welcome to ${room}, ${username}!`)
    );

    // Broadcast user connection
    socket.broadcast.emit(
      "message",
      formatMessage(channelService, `${username} has entered ${room}`)
    );

    // Send list of users in room
    io.to(user.room).emit("userList", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg.text));
  });

  // Client disconnect
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(channelService, `${user.username} has left ${user.room}`)
      );

      // Update list of users in room
      io.to(user.room).emit("userList", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

// Define variable PORT and initialize server
const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`Express app running on port ${PORT}`);
});
