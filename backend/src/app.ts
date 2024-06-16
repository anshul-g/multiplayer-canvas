import express from 'express';
import * as bodyParser from 'body-parser'
import { userRouter } from './router';
const app = express();
const port = 5000;

app.use(bodyParser.json())
app.use('/', userRouter);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});


