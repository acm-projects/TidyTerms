import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import cors from 'cors';
import mongoose from 'mongoose'; // Import mongoose
import { auth } from 'express-openid-connect';
import Document from './models/documentModel.js'; // Import the MongoDB model

dotenv.config();

// Log environment variables to check if they're loaded correctly
console.log('Mongo URI:', process.env.MONGO_URI);

// Auth0 config
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: 'http://localhost:5000',
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
};

// Initialize express and middleware
const app = express();
app.use(express.json()); // Ensure JSON bodies are parsed
app.use(cors());
app.use(auth(config));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Route to check if user is logged in
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

// OpenAI initialization
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

// POST /summarize - to summarize the document and save it to MongoDB
app.post('/summarize', async (req, res) => {


    const {title, content} = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Text is required' });
    }

    

    // const paragraph = (text[4].textContent);
    // console.log(paragraph);

    const highlights = ["personal data, data colection, third-party sharing, data protection"];

    let summaries = "Summaries: ";

    for(let paragraph of content){

        if(paragraph.textContent === "")
            continue;

        try {
            const response = await openai.chat.completions.create({
              model: 'gpt-4o-mini',
              messages: [
                    { role: 'system', content: "You are a helpful assistant whose task is to summarize pieces of text"},
                    { 
                        role: 'user', 
                        content:  `Summarize the following paragraph in 1-2 sentences: ${paragraph.textContent}` },
    
            
                ],
                temperature: 0.3,

            });
        
            const summary = response.choices[0].message;
            //console.log(summary.content);
            summaries = summaries.concat(`\n\n`, summary.content);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to summarize text' });
        }


    }
  
  
    // Save the document summary to MongoDB
    const newDocument = new Document({ 
      title: title,
      summary: summaries, 
    });
    await newDocument.save();


    try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
                { role: 'system', content: "You are a helpful assitant whose task is to extract key information from texts"},
                { 
                    role: 'user', 
                    content:  `Extracat and rephrase key information based on the following keywords: ${highlights.join(', ')} from the following text\n\n ${summaries}, Be as concise as possible in your response` },

        
            ],
            temperature: 0.3,

        });
    
        const key_points = response.choices[0].message;
        console.log(key_points.content);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to extract info' });
    }


    


    res.status(200).json({ summaries  });

    

 
    

});

// GET /documents - to retrieve all saved documents
app.get('/documents', async (req, res) => {
  try {
    const documents = await Document.find(); // Fetch all documents from MongoDB
    res.status(200).json(documents);
  } catch (error) {
    console.error('Error retrieving documents:', error);
    res.status(500).json({ error: 'Failed to retrieve documents' });
  }
});

// Server listening
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
