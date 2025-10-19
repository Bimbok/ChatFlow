const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3000;

// The 'users' object will now store { socket.id: username }
const users = {};

// This helper function transforms our 'users' object
// into an array of objects that's easy for the client to use.
function getUserList() {
  return Object.entries(users).map(([id, name]) => ({ id, name }));
  // This turns { 'id1': 'Alice', 'id2': 'Bob' }
  // into [ {id: 'id1', name: 'Alice'}, {id: 'id2', name: 'Bob'} ]
}

io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // We no longer add the user or emit here.
  // We'll wait for them to send us their name.

  // 1. Tell the new user their own ID
  socket.emit("your id", socket.id);

  // 2. NEW: Listen for the user to join with their name
  socket.on("join server", (username) => {
    users[socket.id] = username;
    console.log(`User ${socket.id} set name to: ${username}`);

    // 3. NOW we tell everyone the user list has updated.
    // We send the new, formatted list.
    io.emit("update users", getUserList());
  });

  // 4. When a user sends a private message (this is unchanged)
  socket.on("private message", ({ message, to }) => {
    console.log(`Sending private message from ${socket.id} to ${to}`);
    socket.to(to).emit("private message", {
      message: message,
      from: socket.id,
    });
  });

  // 5. When a user disconnects
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    // Remove the user from our 'users' object
    delete users[socket.id];

    // Tell everyone the user list has updated
    io.emit("update users", getUserList());
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
