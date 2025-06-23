const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

let ioInstance;

const initSocket = (server, options = {}) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    ...options,
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      if (!token) return next(new Error('Unauthorized'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return next(new Error('Unauthorized'));
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();
    socket.join(userId);

    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
    });
  });

  ioInstance = io;
  return io;
};

const getIO = () => {
  if (!ioInstance) throw new Error('Socket not initialized');
  return ioInstance;
};

module.exports = { initSocket, getIO };
