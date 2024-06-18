import express, { Request, Response } from 'express';
import * as bodyParser from 'body-parser'
import { userRouter } from './router';
import http from 'http'
import cors from 'cors';

const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const port = 5000;

app.use(bodyParser.json())
app.use(cors())

const io = socketIo(server)
io.on('connection', (socket: any) => {
  console.log("connection established")
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
})

app.use('/account', userRouter);

app.use('/', (req: Request, res: Response) => {
  res.send("Running")
})


app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});


