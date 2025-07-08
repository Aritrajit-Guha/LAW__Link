require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const Location = require('./models/location');
const { v4: uuidv4 } = require('uuid'); // Install if not present
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// 💾 Connect to MongoDB
const connectDB = require('./db');
connectDB();



//API to Update Location
app.post('/api/update-location', async (req, res) => {
  const { userId, lat, long, timestamp, trackId, emergencyContacts } = req.body;

  if (!userId || !lat || !long || !timestamp || !trackId) {
    return res.status(400).json({ success: false, message: "Missing required fields." });
  }

  try {
    let locationEntry = await Location.findOne({ trackId });

    if (!locationEntry) {
      // First time setup
      locationEntry = new Location({
        userId,
        trackId,
        currentLocation: { lat, long, timestamp },
        path: [{ lat, long, timestamp }],
        emergencyContacts: emergencyContacts || []
      });
    } else {
      // Update
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

//API to Fetch Live Location by trackId
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


// === CORS Setup ===
const allowedOrigins = [
  'http://localhost:5000',
  'https://legal-genie-phi.vercel.app' // ✅ Replace with your actual frontend domain
];


app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true
}));

// === Rate Limiting ===
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests. Please try again later.'
});

// === Middleware ===
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

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

// === Multer setup for file uploads ===
const upload = multer({ dest: 'uploads/' });

// === Helper Function (GROQ Model) ===
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

// === Routes ===

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

// === AI Assistant ===
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
      req.headers.origin
    );

    res.json({ success: true, complaintText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === Complaint Submission with Media ===
app.post(
  '/api/send-complaint',
  apiLimiter,
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]),
  (req, res) => {
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
  }
);

// === Voice Log Mock Endpoint ===
app.post('/api/voice-log', apiLimiter, (req, res) => {
  if (!req.body.audioFile) {
    return res.status(400).json({ error: 'Audio file is required.' });
  }

  res.json({ success: true, transcription: "Mock transcription for audio." });
});

// === 404 Fallback ===
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
