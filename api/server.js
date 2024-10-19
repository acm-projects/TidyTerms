import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import cors from 'cors'

import { auth } from 'express-openid-connect';

dotenv.config();


const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:5000',
  clientID: '1MPCyVBBW2fCkpPMP8ZDMpAWiJOJoNrd',
  issuerBaseURL: 'https://dev-ajsrzx8e2cn8jvdj.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL





const app = express();
app.use(express.json());
app.use(cors());
app.use(auth(config));

app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
  });

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
});



app.post('/summarize', async (req, res) => {

    const text = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    

    // const paragraph = (text[4].textContent);
    // console.log(paragraph);

    const highlights = ["personal data, data colection, third-party sharing, data protection"];

    let summaries = "Summaries: ";

    for(let paragraph of text){

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
  



const PORT = 5000;
  

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});