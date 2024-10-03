import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import cors from 'cors'

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
});



app.post('/summarize', async (req, res) => {

    const text = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    
    const paragraph = (text[4].textContent);
    console.log(paragraph);

    try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini', // Or 'gpt-3.5-turbo'
          messages: [
                { role: 'system', content: "You are a helpful assitant whos task is to summarize pieces of text"},
                { role: 'user', content: "Summarize the following paragraph in one sentence:" + paragraph }

        
            ],
        });
    
        const summary = response.choices[0].message;
        console.log(summary);
        res.status(200).json({ summary });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to summarize text' });
    }
    
});
  



const PORT = 5000;
  

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});