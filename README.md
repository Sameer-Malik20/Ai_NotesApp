# 🧠 AI Notes App

A full-stack AI-powered notes application built using **MERN stack** (MongoDB, Express.js, React, Node.js) and **Python Flask** for AI services. It enables users to create, manage, and interact with their notes intelligently through advanced Natural Language Processing (NLP), including **summarization**, **keyword extraction**, **sentiment analysis**, **speech-to-text**, **semantic search**, and **chat with notes**.

---

## ✨ Features

### 📝 Notes Management (CRUD)
- Create, read, update, and delete personal notes.
- Persistent storage using MongoDB and Mongoose.

### 🤖 AI Capabilities (via Python + Flask)
- **Text Summarization** (using `transformers`)
- **Keyword Extraction** (with `nltk` and `scikit-learn`)
- **Sentiment Analysis**
- **Speech-to-Text** (with `SpeechRecognition` and `pydub`)
- **Semantic Search and NLP-based filtering**
- **Chat with Notes**: Interact with stored notes using NLP.

---

## 📂 Project Structure

/backend
└── /server # Node.js + Express.js (MERN backend)
└── /ai-server # Python Flask server for AI features
/frontend
└── React App # Note-taking UI with chat, AI actions, and more


---

## 🛠️ Technologies & Libraries

### 🔷 JavaScript / Node (backend)
- `express`
- `mongoose`
- `cors`
- `dotenv`
- `nodemon`

### 🟡 Python / Flask (AI server)
- `flask`
- `flask-cors`
- `transformers`
- `torch`
- `scikit-learn`
- `nltk`
- `SpeechRecognition`
- `pydub`

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js and npm
- Python 3.x and `pip`
- MongoDB running locally or cloud instance (e.g. MongoDB Atlas)

---

### 📦 Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-notes-app.git
cd ai-notes-app

cd backend
npm install

cd ai-server
pip install -r requirements.txt

flask
flask-cors
transformers
torch
scikit-learn
nltk
SpeechRecognition
pydub

cd backend
npm run start

This runs:

Node.js on port 5000 (or configured)

Flask AI server on port 5001

cd frontend
npm install
npm start

🌍 Deployment
🟩 Without Docker
You can deploy:

React frontend to Vercel or Netlify

Node.js backend and Python AI server to Render.com (separate services)

Configure your deployment environment:

Provide correct URLs in frontend for backend and AI server (via .env or config file).

Make sure both servers are public and allow CORS.

🔐 Environment Variables
.env for Node server:

env
Copy
Edit
PORT=5000
MONGO_URI=mongodb+srv://<your_mongo_uri>
AI_SERVER_URL=http://localhost:5001
💬 Example AI APIs
POST /summarize
POST /keywords
POST /sentiment
POST /speech-to-text
GET /search?query=...
POST /chat-with-notes

All accept note text or relevant input data in JSON body.

🔄 Fork & Contribute
Fork this repo.

Clone your forked copy:

bash
Copy
Edit
git clone https://github.com/your-username/ai-notes-app.git
Create a new branch:

bash
Copy
Edit
git checkout -b my-feature
Commit and push:

bash
Copy
Edit
git commit -m "Add my feature"
git push origin my-feature
Open a Pull Request!

👨‍💻 Author
Made by Sameer Malik

📄 License
This project is licensed under the MIT License.

🧠 Future Improvements
Login/Auth using JWT

Multilingual support for AI summarization

Voice-based assistant

Save speech inputs as notes

Export notes to PDF

💡 Have ideas to improve this app? Fork, contribute, and build with AI!

yaml
Copy
Edit

💡 Have ideas to improve this app? Fork, contribute, and build with AI!


---

Let me know if you'd like to include screenshots, API docs, or badge icons (like GitHub stars, forks, etc.) in the README. I can add those too.
