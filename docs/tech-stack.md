# PRism — Tech Stack Document

## Backend
Language: Python 3.11
Framework: Flask
CORS: flask-cors
GitHub data: requests library hitting GitHub REST API
  Base URL: https://api.github.com
  No auth token (public repos only)
AI Review: Groq API
  Model: llama3-8b-8192
  Library: groq (pip install groq)
  API key stored in .env as GROQ_API_KEY
Deploy: Render (free tier)
  Start command: gunicorn app:app

## Backend File Structure
backend/
├── app.py           # Flask server, routes, CORS
├── github_parser.py # GitHub API calls, diff extraction
├── analyzer.py      # Groq API call, review generation
├── .env             # GROQ_API_KEY=your_key_here
├── requirements.txt # All dependencies
└── Procfile         # web: gunicorn app:app

## API Contract
POST /api/analyze
Request:  { "pr_url": "https://github.com/..." }
Response: {
  "success": true,
  "pr_title": "string",
  "pr_author": "string", 
  "files_changed": number,
  "additions": number,
  "deletions": number,
  "plain_summary": "string",
  "risks": ["string", "string", "string"],
  "suggestions": [
    {
      "title": "string",
      "detail": "string",
      "code": "string or null"
    }
  ],
  "risk_score": number,
  "verdict": "SHIP IT" | "REVIEW CAREFULLY" | "DO NOT MERGE"
}

## Frontend
Framework: React 18 with Vite
3D/Particles: Three.js via @react-three/fiber + @react-three/drei
Animations: GSAP 3 (all transitions, reveals, counters)
HTTP: axios
Fonts: Google Fonts (Bebas Neue + Space Grotesk)
Deploy: Vercel

## Frontend File Structure
frontend/src/
├── components/
│   ├── Navbar.jsx
│   ├── ParticleField.jsx  # Three.js background
│   ├── Hero.jsx           # Landing page
│   ├── ScanAnimation.jsx  # Cinematic scan sequence
│   ├── RiskMeter.jsx      # Animated risk bar
│   ├── ReviewCards.jsx    # The 4 result cards
│   └── CustomCursor.jsx   # Custom cursor
├── App.jsx  # State: 'landing' | 'scanning' | 'results'
├── main.jsx
└── index.css

## Environment Variables
Backend .env:   GROQ_API_KEY=your_key
Frontend .env:  VITE_API_URL=http://localhost:5000