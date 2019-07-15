import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import fieldController from './routes/fieldController';
import mailController from './routes/mailController';

mongoose.connect(process.env.MONGO_URL);

console.log('origin', process.env.ORIGIN);

const app = express();
app.use(cors({ origin: process.env.ORIGIN }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/fields', fieldController);
app.use('/mail', mailController);
app.listen(3001, () => {
  console.log('Listening on port 3001');
});
