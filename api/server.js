import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import cors from 'cors';
import mongoose from 'mongoose';
import expressOpenIdConnect from 'express-openid-connect';

import Document from './models/documentModel.js';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { auth, requiresAuth } = expressOpenIdConnect;

// Auth0 config
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: 'http://localhost:5000',
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
};

// Initialize express
const app = express();

// Enable JSON parsing and CORS
app.use(express.json());
app.use(cors());

// Auth0 middleware
app.use(auth(config));

// Serve static files
app.use(express.static(path.join(__dirname, '../Website')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Root route
app.get('/', (req, res) => {
  const path_name = req.oidc.isAuthenticated() ? 'main.html' : 'home.html';
  res.sendFile(path.join(__dirname, '../Website', path_name));
});

// OpenAI initialization
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

// POST /summarize - to summarize the document and save it to MongoDB
app.post('/summarize', async (req, res) => {
  const { title, content } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Text is required' });
  }
  
  const highlights = ["Personal Data", "Data Collection", "Third-Party Sharing", "Data Protection"];
  let summaries = "Summaries: ";
  
  for (let paragraph of content) {
    if (paragraph.textContent === "") continue;
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: "You are a helpful assistant whose task is to summarize pieces of text" },
          { role: 'user', content: `Summarize the following paragraph in 1-2 sentences: ${paragraph.textContent}` },
        ],
        temperature: 0.3,
      });
      const summary = response.choices[0].message;
      summaries = summaries.concat("\n\n", summary.content);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to summarize text' });
    }
  }
  
  let key_highlights = {};
  for (let i = 0; i < highlights.length; i++) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: "You are a helpful assistant whose task is to extract key information from texts" },
          { role: 'user', content: `Extract and rephrase key information based on the following keyword: ${highlights[i]} from the following text\n\n ${summaries}, Respond in at most 2 sentences` },
        ],
        temperature: 0.3,
      });
      const key_points = response.choices[0].message;
      key_highlights[highlights[i]] = key_points.content;
      console.log(key_points.content);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to extract info' });
    }
  }
  
  return res.status(200).json({ key_highlights });
});

// POST /save - Save summarized document to MongoDB with user ID
app.post('/save', requiresAuth(), async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Text and Title Required' });
  }

  // Retrieve user ID from Auth0 session
  const userId = req.oidc.user.sub;

  const newDocument = new Document({
    title: title,
    summary: content,
    userId: userId,  // Store the user ID
  });

  try {
    await newDocument.save();
    return res.status(200).json({ message: "Document saved successfully" });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to save document' });
  }
});

// GET /documents - to retrieve all documents for the authenticated user
app.get('/documents', requiresAuth(), async (req, res) => {
  try {
    // Retrieve user ID from Auth0 session
    const userId = req.oidc.user.sub;

    // Fetch documents by userId
    const documents = await Document.find({ userId: userId });
    return res.status(200).json(documents);
  } catch (error) {
    console.error('Error retrieving documents:', error);
    return res.status(500).json({ error: 'Failed to retrieve documents' });
  }
});

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
