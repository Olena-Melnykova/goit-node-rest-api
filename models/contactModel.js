import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema, model } = mongoose;

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { versionKey: false, timestamps: true });


contactSchema.plugin(mongoosePaginate);

export default model("Contact", contactSchema);