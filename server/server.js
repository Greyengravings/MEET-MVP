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

const rooms = {}; // roomId -> Array of { socketId, name, isMicOn, isCamOn }

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', ({ roomId, name, isMicOn, isCamOn }) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    const newUser = {
      socketId: socket.id,
      name,
      isMicOn: isMicOn !== undefined ? isMicOn : true,
      isCamOn: isCamOn !== undefined ? isCamOn : true,
      isHandRaised: false
    };

    // Inform other users in the room about the new user
    socket.to(roomId).emit('user-joined', newUser);

    // Send the list of existing users to the new user
    socket.emit('all-users', rooms[roomId]);

    rooms[roomId].push(newUser);
    console.log(`User ${name} joined room ${roomId}`);
  });

  socket.on('signal', ({ targetId, signal }) => {
    io.to(targetId).emit('signal', { senderId: socket.id, signal });
  });

  socket.on('update-media-status', ({ roomId, isMicOn, isCamOn }) => {
    if (rooms[roomId]) {
      const user = rooms[roomId].find(u => u.socketId === socket.id);
      if (user) {
        user.isMicOn = isMicOn;
        user.isCamOn = isCamOn;
        // Broadcast change to everyone else in the room
        socket.to(roomId).emit('user-media-updated', { socketId: socket.id, isMicOn, isCamOn });
      }
    }
  });

  socket.on('update-hand-status', ({ roomId, isHandRaised }) => {
    if (rooms[roomId]) {
      const user = rooms[roomId].find(u => u.socketId === socket.id);
      if (user) {
        user.isHandRaised = isHandRaised;
        // Broadcast change to everyone else in the room
        socket.to(roomId).emit('user-hand-updated', { socketId: socket.id, isHandRaised, name: user.name });
      }
    }
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

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
