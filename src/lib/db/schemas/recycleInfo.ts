import { Schema } from 'mongoose';

const recycleInfoSchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
  },
  imageSource: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

export { recycleInfoSchema };