import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema({
  key: { type: String, required: true },
  fi: String,
  en: String,
  options: Array,
  info: String,
  max: Number,
  min: Number,
  price: Number,
  duration: Number,
  url: String,
});

const Field = mongoose.model('Field', fieldSchema);
export default Field;
