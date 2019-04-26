import express from 'express';
import Field from '../models/field';

const router = express.Router();

router.get('/', (req, res) => {
  Field.find({}).exec((err, fields) => {
    if (err) throw err;
    res.json(fields);
  });
});

export default router;
