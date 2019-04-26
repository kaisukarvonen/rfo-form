import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import fieldController from './routes/fieldController';
import mailController from './routes/mailController';

mongoose.connect(process.env.MONGO_URL);

const app = express();
app.use(cors({ origin: process.env.ORIGIN }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/fields', fieldController);
app.use('/mail', mailController);
app.listen(3001, () => {
  console.log('Listening on port 3001');
});
