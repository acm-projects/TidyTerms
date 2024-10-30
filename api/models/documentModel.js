import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  userId: { type: String, required: true }, // New field to associate with a user
}, { timestamps: true });

const Document = mongoose.model('Document', documentSchema);

export default Document;
