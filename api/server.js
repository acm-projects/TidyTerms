import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import cors from 'cors';
import mongoose from 'mongoose'; // Import mongoose
import { auth } from 'express-openid-connect';
import Document from './models/documentModel.js'; // Import the MongoDB model
import path from 'path';
import { fileURLToPath } from 'url'; // To get the current file's path
import { dirname } from 'path'; // To get the directory name
dotenv.config(); // Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Auth0 config
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: 'http://localhost:5000', // Base URL of your server
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
};
// Initialize express
const app = express();
// Enable JSON parsing
app.use(express.json());
// CORS setup (allowing your frontend at 127.0.0.1:5500)
// app.use(cors({
//   //origin: 'http://127.0.0.1:5500', // Allow requests from this frontend URL
//   credentials: true, // Allow credentials (like cookies, tokens)
// }));
app.use(cors());
// Auth0 middleware
app.use(auth(config));
// Serve static files from your frontend directory
app.use(express.static(path.join(__dirname, '../Website')));
// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));
// Root route to check authentication
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

    const highlights = ["personal data", "data colection", "third-party sharing", "data protection"];

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
            summaries = summaries.concat("\n\n", summary.content);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to summarize text' });
        }


    }

    // Save the document summary to MongoDB
    // const newDocument = new Document({ 
    //   title: title,
    //   summary: summaries, 
    // });
    // await newDocument.save();    


    let key_highlights = {}


    for(let i = 0; i < highlights.length; i++){

      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
                { role: 'system', content: "You are a helpful assitant whose task is to extract key information from texts"},
                { 
                    role: 'user', 
                    content:  `Extracat and rephrase key information based on the following keyword: ${highlights[i]} from the following text\n\n ${summaries}, Respond in at most 2 sentences` },

        
            ],
            temperature: 0.3,

        });
    
        const key_points = response.choices[0].message;
        key_highlights[highlights[i]] = key_points.content;
        console.log(key_points.content);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to extract info' });
    }


    }
  
  
    return res.status(200).json({ key_highlights  });

  
});


app.post('compare', async(req, res) => {

  const {text1, text2} = req.body;

  if(!text1 || !text2) {
    return res.status(400).json({ error: 'Both text1 and text2 are required' });
  }

  try {

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
            { 
              role: 'user', 
              content:  `Compare the following two pieces of text and explain the similarities and differences in easy to understand bullet points:\n\nText 1: ${text1}\n\nText 2: ${text2}`
            },

    
        ],
        temperature: 0.7,
    });

    const comparison = response.data.choices[0].message.content;
    return res.status(200).json({ comparision });;

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to compare texts' });
  }

})






// GET /documents - to retrieve all saved documents
app.get('/documents', async (req, res) => {
  try {
    const documents = await Document.find(); // Fetch all documents from MongoDB
    return res.status(200).json(documents);
  } catch (error) {
    console.error('Error retrieving documents:', error);
    return res.status(500).json({ error: 'Failed to retrieve documents' });
  }
});

// Server listening
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
