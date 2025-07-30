# ReachInbox Email Aggregator

![Project Logo](https://via.placeholder.com/150x50?text=ReachInbox)

An AI-powered email management platform that syncs, categorizes, and enhances email communication across multiple accounts.

## ✨ Features
- **Multi-Account Sync**: Connect multiple IMAP email accounts
- **Smart Categorization**: AI labels emails (Interested/Spam/Meeting Booked)
- **Lightning Search**: Elasticsearch-powered email search
- **AI Replies**: GPT-generated response suggestions
- **Real-time Alerts**: Slack/webhook notifications
- **Dashboard**: Modern UI with email analytics

## 🛠️ Tech Stack
### Backend
- Node.js + Express
- MongoDB
- Elasticsearch
- IMAP (with IDLE support)
- OpenAI API

### Frontend
- React (Vite)
- Redux Toolkit
- Tailwind CSS
- Axios

## 🚀 Quick Start

### 1. Clone & Setup
```bash
git clone https://github.com/yourusername/reachinbox.git
cd reachinbox

cd server
npm install
cp .env.example .env
# Edit .env with your credentials
npm start


cd ../client
npm install
cp .env.example .env
npm run dev


MONGODB_URI=mongodb://localhost:27017/reachinbox
ELASTICSEARCH_URL=http://localhost:9200
OPENAI_API_KEY=your_key_here
SLACK_WEBHOOK_URL=your_webhook_url

VITE_API_BASE_URL=http://localhost:5000/api

reachinbox/
├── client/               # React Frontend
│   ├── src/
│   │   ├── components/   # UI Components
│   │   ├── pages/        # Routes
│   │   ├── store/        # Redux
│   │   └── services/     # API Calls
├── server/               # Node Backend
│   ├── controllers/
│   ├── models/
│   ├── services/
│   └── routes/
└── docker-compose.yml    # For MongoDB/Elasticsearch


<img width="1920" height=<img width="1920" height="1080" alt="Screenshot (152)" src="https://github.com/user-attachments/assets/5ca0b354-133a-476e-8735-13009fc7741e" />
"1080" alt="Screenshot (151)" src="https://github.com/user-attachments/assets/e6495a06-48f4-4c70-ba0a-f4bdd27818c7" />
<img width="1920" height="1080" alt="Screenshot (155)" src="https://github.com/user-attachments/assets/b651724d-7281-4f46-a76d-c3b549c4613a" />

