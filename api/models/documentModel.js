import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  userId: { type: String, required: true }, // Add this field
});

const Document = mongoose.model('Document', documentSchema);
export default Document;
