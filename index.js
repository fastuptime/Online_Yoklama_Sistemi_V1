const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { createClient } = require('redis');
const RedisStore = require('connect-redis').default;
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.connect().catch(console.error);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'WWW', 'public')));

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 
  }
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use('/', require('./Routers/index'));
app.use('/auth', require('./Routers/auth'));
app.use('/instructor', require('./Routers/instructor'));
app.use('/student', require('./Routers/student'));

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join-attendance', (attendanceId) => {
    socket.join(`attendance-${attendanceId}`);
  });

  socket.on('mark-attendance', (data) => {

    io.to(`attendance-${data.attendanceId}`).emit('student-marked-attendance', {
      studentId: data.studentId,
      studentName: data.studentName,
      time: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});