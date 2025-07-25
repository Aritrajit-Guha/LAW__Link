require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const Location = require('./models/location');
const { v4: uuidv4 } = require('uuid');
const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const scrapeKanoonReferences = require('./KannonScraper');

// === CORS SETUP (MUST COME FIRST) ===
const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:3000',
  'https://law-link-aritra.vercel.app',
  'https://legal-genie-phi.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`❌ CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true
}));

// === Middleware ===
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// === Connect to MongoDB ===
connectDB();

// === In-Memory User Auth ===
let users = [{ username: "admin", password: "1234" }];

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ success: true, message: "Login successful" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

app.post("/api/signup", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "All fields required." });
  }
  const exists = users.find(u => u.username === username);
  if (exists) {
    return res.status(400).json({ success: false, message: "User already exists." });
  }
  users.push({ username, password });
  res.json({ success: true, message: "Signup successful" });
});

// === Rate Limiting ===
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests. Please try again later.'
});

// === Location Update API ===
app.post('/api/update-location', async (req, res) => {
  const { userId, lat, long, timestamp, trackId, emergencyContacts } = req.body;
  if (!userId || !lat || !long || !timestamp || !trackId) {
    return res.status(400).json({ success: false, message: "Missing required fields." });
  }

  try {
    let locationEntry = await Location.findOne({ trackId });

    if (!locationEntry) {
      locationEntry = new Location({
        userId,
        trackId,
        currentLocation: { lat, long, timestamp },
        path: [{ lat, long, timestamp }],
        emergencyContacts: emergencyContacts || []
      });
    } else {
      locationEntry.currentLocation = { lat, long, timestamp };
      locationEntry.path.push({ lat, long, timestamp });
    }

    await locationEntry.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Location update failed:", error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// === Fetch Live Location ===
app.get('/api/live-location/:trackId', async (req, res) => {
  try {
    const locationData = await Location.findOne({ trackId: req.params.trackId });
    if (!locationData) {
      return res.status(404).json({ success: false, message: "Tracking not found." });
    }
    res.json({
      success: true,
      currentLocation: locationData.currentLocation,
      path: locationData.path
    });
  } catch (error) {
    console.error("Error fetching location:", error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// === Multer for File Uploads ===
const upload = multer({ dest: 'uploads/' });

// === OpenRouter/GROQ AI Call Helper ===
const callOpenRouter = async (messages, origin) => {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': origin || 'https://legal-genie-phi.vercel.app/'
        }
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('GROQ API Error:', error.response?.data || error.message);
    throw new Error('Failed to get AI response. Please try again.');
  }
};

// === AI Assistant with Indian Kanoon Support ===
app.post('/api/ask', apiLimiter, async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required.' });
  }

  try {
    // 1. Use AI to extract relevant Indian laws (e.g., IPC sections, articles)
    const extractedLaws = await callOpenRouter([
      {
        role: 'system',
        content:
          'You are a legal assistant. From the user\'s legal query, extract and list only the relevant Indian laws involved (e.g., IPC sections, CrPC sections, or Constitutional Articles). Do not explain or answer the query. Just return the list like "IPC 354, Article 21".'
      },
      { role: 'user', content: question }
    ], req.headers.origin);

    console.log('📜 Extracted Laws:', extractedLaws);

    // 2. Generate AI answer to user's question
    const aiAnswer = await callOpenRouter([
      {
        role: 'system',
        content:
          'You are LawLink, a legal AI specializing in Indian laws (IPC, CrPC, Evidence Act). Provide accurate, concise information with section references when possible.'
      },
      { role: 'user', content: question }
    ], req.headers.origin);

    // 3. Scrape top relevant link from Indian Kanoon based on extracted laws
    let kanoonReferences = '';
    try {
      if (extractedLaws && extractedLaws.trim()) {
        kanoonReferences = await scrapeKanoonReferences(extractedLaws);
      } else {
        kanoonReferences = 'No specific law detected for reference.';
      }
    } catch (scrapeErr) {
      console.error('⚠️ Kanoon Scraper Error:', scrapeErr.message);
      kanoonReferences = 'Kanoon references are temporarily unavailable.';
    }

    // 4. Combine AI answer with Kanoon link
    const fullResponse = `${aiAnswer}\n\n📚 **References from Indian Kanoon:**\n${kanoonReferences}`;
    res.json({ answer: fullResponse });

  } catch (error) {
    console.error('❌ AI Ask Error:', error.message);
    res.status(500).json({ error: 'Internal server error. Please try again.' });
  }
});



// === AI Complaint Generator ===
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

    const complaintText = await callOpenRouter([
      { role: 'system', content: 'You are a legal assistant helping write formal Indian legal complaints.' },
      { role: 'user', content: prompt }
    ], req.headers.origin);

    res.json({ success: true, complaintText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === Complaint Submission with Media Upload ===
app.post('/api/send-complaint', apiLimiter, upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), (req, res) => {
  try {
    const {
      name, incidentDate, location, city, state, country,
      pincode, crimeType, culpritName, incidentTime,
      description, complaintText
    } = req.body;

    if (!name || !incidentDate || !location || !city || !state || !country ||
      !pincode || !crimeType || !description || !complaintText) {
      return res.status(400).json({ success: false, error: 'Missing required fields.' });
    }

    console.log('Complaint Submission:', {
      name, incidentDate, location, city, state, country,
      pincode, crimeType, culpritName, incidentTime, description
    });

    console.log('Files:', req.files);
    console.log('Complaint:', complaintText);

    res.json({ success: true, message: 'Complaint submitted successfully.' });
  } catch (error) {
    console.error('Error in /api/send-complaint:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// === Mock Voice Log API ===
app.post('/api/voice-log', apiLimiter, (req, res) => {
  if (!req.body.audioFile) {
    return res.status(400).json({ error: 'Audio file is required.' });
  }
  res.json({ success: true, transcription: "Mock transcription for audio." });
});

// === Static Routes ===
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
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

// === 404 Fallback ===
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
