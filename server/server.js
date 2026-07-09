const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('Signaling server is running!');
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const rooms = {}; // roomId -> Array of { socketId, name }

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', ({ roomId, name }) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    // Inform other users in the room
    socket.to(roomId).emit('user-joined', { socketId: socket.id, name });

    // Send the list of existing users to the new user
    const otherUsers = rooms[roomId];
    socket.emit('all-users', otherUsers);

    rooms[roomId].push({ socketId: socket.id, name });
    console.log(`User ${name} (${socket.id}) joined room ${roomId}`);
  });

  socket.on('signal', ({ targetId, signal }) => {
    io.to(targetId).emit('signal', { senderId: socket.id, signal });
  });

  socket.on('chat-message', ({ roomId, text, sender }) => {
    io.to(roomId).emit('chat-message', { text, sender, timestamp: new Date().toISOString() });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter(user => user.socketId !== socket.id);
      socket.to(roomId).emit('user-left', socket.id);
    }
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
