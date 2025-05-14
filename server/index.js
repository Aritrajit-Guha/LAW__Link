require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Environment variable check
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  console.error('FATAL: OpenRouter API key missing in environment variables.');
  process.exit(1);
}

// === CORS ===
app.use(cors({
  origin: ['http://localhost:3000', 'https://legal-genie-phi.vercel.app'],
  methods: ['GET', 'POST'],
  credentials: false
}));

// === Rate Limiting ===
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests. Please try again later.'
});

// === Middleware ===
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// === Helper Function ===
const callOpenRouter = async (messages, res, origin) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': origin || 'https://legal-genie-phi.vercel.app/'
        }
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter API Error:', error.response?.data || error.message);
    throw new Error('Failed to get AI response. Please try again.');
  }
};

// === Routes ===

// Root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Feature Pages
app.get('/features/lawlink-bot', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/features/lawlink-bot/index.html'));
});

app.get('/features/complaint-pdf-generator', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/features/complaint-pdf-generator/index.html'));
});

app.get('/features/voice-log', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/features/voice-log/index.html'));
});

app.get('/features/harassment-complaint', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/features/harassment-complaint/index.html'));
});

// === AI Chat Assistant ===
app.post('/api/ask', apiLimiter, async (req, res) => {
  if (!req.body.question) {
    return res.status(400).json({ error: 'Question is required.' });
  }

  try {
    const answer = await callOpenRouter(
      [
        {
          role: 'system',
          content: 'You are LawLink, a legal AI specializing in Indian laws (IPC, CrPC, Evidence Act). Provide accurate, concise information with section references when possible.'
        },
        { role: 'user', content: req.body.question }
      ],
      res,
      req.headers.origin
    );
    res.json({ answer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === Complaint Generator ===
app.post('/api/generate-complaint', apiLimiter, async (req, res) => {
  const { name, incidentDate, location, description } = req.body;

  if (!name || !incidentDate || !location || !description) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const prompt = `Write a formal legal complaint letter in Indian context using:
- Complainant Name: ${name}
- Incident Date: ${incidentDate}
- Location: ${location}
- Description: ${description}`;

    const complaintText = await callOpenRouter(
      [
        { role: 'system', content: 'You are a legal assistant helping write formal Indian legal complaints.' },
        { role: 'user', content: prompt }
      ],
      res,
      req.headers.origin
    );

    res.json({ success: true, complaintText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === Voice Log (Mock endpoint) ===
app.post('/api/voice-log', apiLimiter, async (req, res) => {
  if (!req.body.audioFile) {
    return res.status(400).json({ error: 'Audio file is required.' });
  }

  res.json({ success: true, transcription: "Mock transcription for audio." });
});

// === 404 Handler ===
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
