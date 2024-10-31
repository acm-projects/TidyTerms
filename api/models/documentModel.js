import mongoose from 'mongoose';
// Define the document schema
const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
// Create and export the model
const Document = mongoose.model('Document', documentSchema);
export default Document;
