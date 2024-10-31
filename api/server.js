import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import cors from 'cors';
import mongoose from 'mongoose';
import { auth } from 'express-openid-connect';
import Document from './models/documentModel.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Auth0 config
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: 'http://localhost:5000',
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  routes: {
    callback: '/callback',
  },
  afterCallback: (req, res) => {
    res.redirect('http://127.0.0.1:5500/Website/main.html');
  },
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
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

// OpenAI initialization
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

// POST /summarize - to summarize document and save it to MongoDB with userId
app.post('/summarize', async (req, res) => {
  const { title, content } = req.body;

  // Check if content is provided
  if (!content) {
    return res.status(400).json({ error: 'Text is required' });
  }

  // Check if user is authenticated
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  const userId = req.oidc.user.sub; // Get the authenticated user's ID
  const highlights = ["personal data", "data collection", "third-party sharing", "data protection"];
  let summaries = "Summaries: ";

  // Summarizing content
  for (let paragraph of content) {
    if (paragraph.textContent === "") continue; // Skip empty paragraphs
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: "Summarize pieces of text" },
          { role: 'user', content: `Summarize: ${paragraph.textContent}` },
        ],
        temperature: 0.3,
      });
      const summary = response.choices[0].message.content;
      summaries += `\n\n${summary}`; // Append the summary
    } catch (error) {
      console.error('Error summarizing text:', error);
      return res.status(500).json({ error: 'Failed to summarize text' });
    }
  }

  // Extract key highlights
  let key_highlights = {};
  for (let highlight of highlights) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: "Extract key information from texts" },
          { role: 'user', content: `Extract info based on keyword: ${highlight} in text\n\n${summaries}` },
        ],
        temperature: 0.3,
      });
      const key_points = response.choices[0].message.content;
      key_highlights[highlight] = key_points; // Store highlights
    } catch (error) {
      console.error('Error extracting key information:', error);
      return res.status(500).json({ error: 'Failed to extract info' });
    }
  }

  // Save document summary to MongoDB
  const newDocument = new Document({
    title: title,
    summary: summaries,
    userId: userId,
  });

  try {
    await newDocument.save(); // Save the document
    return res.status(200).json({ message: 'Document saved successfully', newDocument });
  } catch (error) {
    console.error('Error saving document:', error);
    return res.status(500).json({ error: 'Failed to save document' });
  }
});




app.post('/save', (req, res) =>{


  const {title, content} = req.body;

  console.log(content);

  if(!title || !content){
    res.sendStatus(400).json({ error: 'Text and Title Required'});
  }

  const newDocument = new Document({
    title: title,
    summary: content,
  })
  try   {
    newDocument.save();

    return res.status(200).json({"message": "Document saved successfully"});
   }
   catch (error){
    return res.status(500).json({ error: 'Failed to save document' });
   }
  

  




});








// GET /documents - to retrieve all documents for authenticated user
app.get('/documents', async (req, res) => {
  // Check if user is authenticated
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  const userId = req.oidc.user.sub; // Get the authenticated user's ID
  try {
    const documents = await Document.find({ userId }); // Fetch documents by userId
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
