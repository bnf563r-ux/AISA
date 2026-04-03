import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/api', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{role:'user', content: message}],
        max_tokens: 500
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'لم يتم الرد';
    res.json({ reply });
  } catch(err) {
    console.error(err);
    res.status(500).json({ reply: 'حدث خطأ. حاول لاحقاً.' });
  }
});

app.use(express.static('public'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
