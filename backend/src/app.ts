import express, { Request, Response } from 'express';
import * as bodyParser from 'body-parser'
import { userRouter } from './router';
import http from 'http'
import cors from 'cors';

const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const port = 5000;


const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins for testing purposes
    methods: ['GET', 'POST'],
    credentials: true
  }, transports: ['websocket']
})

io.on('connection', (socket: any) => {
  socket.on('onStateChange', (elements: any) => {
    socket.broadcast.emit('recieveStateChange', elements)
  })
  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
})

app.use(cors({
  origin: "*",
  methods: ['GET', 'POST'],
  credentials: true
 }))
app.use('/', (req: any, res: any) => res.send("Running"))

server.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`);
});


