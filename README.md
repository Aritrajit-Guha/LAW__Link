🎓 LawLink – Your Justice Companion, Powered by AI

📖 Overview
LawLink is an AI-powered legal tech platform built to empower individuals with their rights, fight injustice, and seek help through accessible legal tools. ⚖️
It offers AI-generated complaint letters, smart reporting features, and emergency legal aid — all under one futuristic interface designed with empathy and impact. 🌐✨

🔥 Key Highlights
✔️ Unified Login + Signup 🧑‍💻
✔️ AI-powered legal complaint builder 🤖
✔️ Silent voice and video logging for evidence 🧾🎤📹
✔️ Category-based legal toolkits for everyday issues 🗂️
✔️ Groq LLaMA-4 integrated legal chatbot 💬
✔️ Works seamlessly on both localhost & Vercel 🚀

🎯 Innovation & Impact

🌍 What Makes LawLink Special?
🔹 Built for real-time justice with instant evidence capture and reporting
🔹 🧠 Uses GROQ’s LLaMA-4-SCOUT-17B for formal legal drafting
🔹 Supports vulnerable groups like women and families with dedicated modules
🔹 🕵️ Detects, logs, and formats complaints for real-world action
🔹 Combines AI, law, and empathy — all in one modern, clean experience

👥 Who Can Use It?

👩‍⚖️ Citizens – File complaints, understand your rights, stay protected
👩‍💻 Legal Activists – Use the toolkit to help victims with auto-complaints
🚔 First Responders – Gather instant reports via the real-time modules
🏢 NGOs/Legal Startups – Integrate features into campaigns for justice awareness

🚀 Modules & Features

🧠 LAWgic Bot – AI Legal Assistant
‣ Trained on IPC, CrPC, and Indian Evidence Act
‣ Provides law-based responses with relevant section citations
‣ Accessible 24/7 with simple UI for public use

📄 Complaint Generator + PDF Export
‣ User inputs incident details → AI writes formal complaint
‣ Download complaint as PDF
‣ Ideal for FIRs, HR complaints, or court submissions

🎤 Silent Voice Log
‣ Record voice without alert
‣ Save locally for evidence
‣ Comes with auto-download for discretion

📷 Violation Reporter
‣ Capture voice, video, or photos
‣ Geotags location (auto)
‣ AI drafts complaint → preview → send to authority

👨‍👩‍👧 Family & Marital Rights Toolkit
‣ Dowry & domestic violence awareness
‣ Encrypted logging system (SafeBond)
‣ JusticeMate app for legal actions

♀️ Women’s Rights & Safety
‣ Emergency connectors
‣ Quick harassment report tool
‣ Right Guide with voice reading option

📞 Contact Page + Tech Stack Showcase
‣ Contact info, location, socials
‣ Technologies used with logos (Node, Express, OpenAI, Vercel etc.)

🛠️ Tech Stack

🎨 Frontend
‣ HTML, CSS, JavaScript
‣ Tailored animations & futuristic UI
‣ Runs in public/index.html served by Express

🧠 Backend & AI
‣ Node.js + Express server
‣ AI via Groq LLaMA-4-Scout 17B
‣ In-memory auth system (login/signup)
‣ File handling via Multer
‣ Rate-limited endpoints for AI use

🌐 Deployment
‣ Frontend: Vercel
‣ Backend: Vercel / Render
‣ Dynamic CORS config (auto handles localhost + production URLs)

⚙️ How It Works

1️⃣ User visits site — sees login/signup form

2️⃣ After login, user is redirected to homepage (index.html)

3️⃣ Select legal toolkit → input details

4️⃣ AI processes request (complaint or legal answer)

5️⃣ User previews + downloads PDF or sends complaint

📸 Screenshots (to add)
🏠 Homepage
🔐 Auth Page
🧠 LAWgic Chat
📄 Complaint Preview
🎙️ Violation Reporter

⚡ Local Setup Guide

1️⃣ Clone the Repo

    git clone https://github.com/your-username/lawlink.git

2️⃣ Install Server Dependencies

    cd server
    npm install

3️⃣ Setup .env File

    ini
    Copy
    Edit
    OPENROUTER_API_KEY=your_groq_key
    
4️⃣ Run the Server

    node index.js
    → Visit: http://localhost:5000

Frontend is served from public/, no build tools needed.

🗂 Project Structure LawLinkChat:

    ├── node_modules
    ├── public/
    │   ├── css/
    │   │   ├── main.css  (main css file for main frontend page)
    │   │   └── necessary image files
    │   ├── features/
    │   │   ├── harassment-complaint/
    │   │   │   ├── index.html
    │   │   │   ├── complaint-builder.css
    │   │   │   ├── complaint-builder.js
    │   │   │   └── pdf.js
    │   │   ├── lawlink-bot/
    │   │   │   ├── index.html
    │   │   │   ├── styles.css
    │   │   │   └── script.js
    │   │   └── voice-log/
    │   │       ├── index.html
    │   │       ├── voice-log.css
    │   │       └── voice-log.js
    │   ├── js/
    │   │   └── main.js  (backend file for main frontend page)    
    │   ├── sections/
    │   │   ├── auth/
    │   │   │   ├── auth.html
    │   │   │   ├── auth.css
    │   │   │   └── auth.js
    │   │   ├── contact/
    │   │   │   ├── contact.html
    │   │   │   ├── contact.css
    │   │   │   └── contact.js
    │   │   ├── daily-rights/
    │   │   │   ├── daily-rights.html
    │   │   │   ├── styles.css
    │   │   │   └── script.js
    │   │   ├── family and marital rights/
    │   │   │   ├── family-marital-rights.html
    │   │   │   ├── family-marital-rights.css
    │   │   │   └── family-marital-rights.js
    │   │   ├── legal action generator lead/
    │   │   │   ├── legal-action-generator.html
    │   │   │   ├── legal-action-generator.css
    │   │   │   └── legal-action-generator.js
    │   │   ├── real time justice/
    │   │   │   ├── real-time-justice.html
    │   │   │   ├── real-time-justice.css
    │   │   │   └── real-time-justice.js
    │   │   └── womens safety rights/
    │   │       ├── womens-safety-rights.html
    │   │       ├── womens-safety-rights.css
    │   │       └── womens-safety-rights.js
    │   ├── 404.html   (error page)
    │   ├── index.html (main frontend page)
    │   └── necesarry image files
    ├── server/
    │   └── index.js (main backend server js)
    ├── env
    ├── package.json
    └── package-lock.json

🔐 Login Credentials (Demo)

    👤 Username: admin
    🔑 Password: 1234

🔐 Security Note
Currently using in-memory auth – no persistent DB yet.
🔒 Ideal for demos, not production.

🤝 Contributing
Want to improve LawLink? 🧑‍💻
‣ Fork the repo, commit changes, and send a PR!
🐛 Found a bug? Let us know
💡 Have ideas? Suggest features or UI upgrades

🔗 Connect with Developer

    👨‍💻 Made with ❤️ by Aritra
    🔗 Linktree: https://linktr.ee/aritrajit_guha
    📬 Contact: lawlinkproj@gmail.com

