# GitHub Developer Intelligence Dashboard

> A production-ready full-stack developer analytics platform — analyze any GitHub profile, repositories, language trends, and developer insights in real time.

![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20Express-58A6FF?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-3FB950?style=flat-square)

---

## Overview

The **GitHub Developer Intelligence Dashboard** is a full-stack web application that allows users to search any public GitHub profile and view:

- 📊 **Profile Analytics** — followers, following, repos, join date
- 🗂️ **Repository Browser** — paginated, filterable, sortable repository list with expandable details
- 🥧 **Language Analytics** — interactive Recharts pie chart of language usage
- 🔍 **Developer Insights Engine** — total stars, top language, repository diversity, activity level, and personalized improvement suggestions
- 🕐 **Recently Searched Users** — localStorage-backed search history (max 5, most-recent-first)
- ⚡ **Server-side Caching** — 60-second TTL, cache-vs-live source indicator on every response

---

## Architecture

```
┌──────────────────────────────────────────────┐
│                   Browser                    │
│         React + Vite + Tailwind CSS          │
│  (TanStack Query • Recharts • Framer Motion) │
└────────────────────┬─────────────────────────┘
                     │ HTTP (VITE_API_URL)
                     ▼
┌──────────────────────────────────────────────┐
│          Node.js / Express Backend           │
│  Proxy + Cache (NodeCache 60s TTL)           │
│  Helmet • CORS • Morgan • dotenv             │
└────────────────────┬─────────────────────────┘
                     │ Bearer Token
                     ▼
            ┌────────────────┐
            │   GitHub REST  │
            │      API       │
            └────────────────┘
```

**Key design decisions:**
- The frontend **never** contacts GitHub directly — all requests go through the backend proxy
- The GitHub token lives exclusively in the backend `.env` file
- NodeCache stores responses for 60 seconds, returning `{ source: "cache" }` or `{ source: "github" }` on every response

---

## Features

| Feature | Details |
|---|---|
| 🔍 Search | Search any public GitHub username |
| 👤 Profile Card | Avatar, bio, followers, following, repos, joined date, location, blog, Twitter |
| 📈 Stats Cards | Total Stars, Repository Count, Languages, Activity Level |
| 🥧 Language Chart | Recharts donut pie chart with custom tooltips |
| 💡 Insights Engine | Diversity rating, activity level, personalized suggestion |
| 📁 Repository Browser | Filter by name, sort by stars/name/updated |
| 🔽 Expandable Cards | Framer Motion animated detail expansion (issues, watchers, branch, license, URL) |
| 📄 Pagination | "Load More" appends next page without replacing current results |
| 🕐 Recent Searches | localStorage, max 5, no duplicates, most-recent-first |
| ⚡ Caching | 60s TTL with cache source indicator badge |
| 💀 Skeleton Loaders | Full-layout shimmer skeletons during fetch |
| 📱 Responsive | Desktop, tablet, mobile — no horizontal scroll |

---

## Project Structure

```
/
├── backend/
│   ├── config/           # Environment config
│   ├── controllers/      # Request handlers
│   ├── middleware/        # Error handler
│   ├── routes/            # Express routes
│   ├── services/          # GitHub API service
│   ├── utils/             # Cache + Insights engine
│   ├── tests/             # Jest + Supertest tests
│   └── server.js          # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/           # Axios instance
│   │   ├── components/    # All UI components
│   │   ├── hooks/         # TanStack Query hooks
│   │   └── tests/         # Vitest tests
│   └── index.html         # SEO-optimized HTML
│
├── render.yaml            # Render backend deployment
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm 9+
- A GitHub Personal Access Token (optional but recommended — without it you get 60 req/hr)

### 1. Clone / navigate to the project

```bash
cd "untitled folder"
```

### 2. Install all dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Configure environment variables

**Backend:**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env and add your GitHub token
```

```env
GITHUB_TOKEN=ghp_your_token_here
PORT=5000
```

**Frontend:**
```bash
cp frontend/.env.example frontend/.env
# Default: VITE_API_URL=http://localhost:5001
# Optional: VITE_PORT=5174
```

---

## Running Locally

Start both servers in separate terminals:

```bash
# Terminal 1 — Backend (port 5001)
cd backend && npm run dev

# Terminal 2 — Frontend (port 5174)
cd frontend && npm run dev
```

Or use the root convenience script (requires `concurrently` and `cross-env`):

```bash
npm install           # installs concurrently and cross-env
npm run dev           # starts both simultaneously on explicit ports
```

Open [http://localhost:5174](http://localhost:5174)

---

## API Endpoints

### Health Check
```
GET http://localhost:5001/api/health
→ { "status": "ok", "timestamp": "..." }
```

### Search GitHub User
```
GET http://localhost:5001/api/github/:username
GET http://localhost:5001/api/github/:username?page=2&per_page=30
```

**Response shape:**
```json
{
  "source": "github" | "cache",
  "profile": { "login": "", "name": "", "avatar_url": "", ... },
  "repos": [{ "name": "", "language": "", "stargazers_count": 0, ... }],
  "insights": {
    "totalStars": 145,
    "topLanguage": "JavaScript",
    "mostPopularRepo": "Portfolio",
    "repositoryDiversity": "High",
    "activityLevel": "Very Active",
    "suggestedImprovement": "...",
    "languageBreakdown": [{ "name": "JS", "value": 10, "percentage": 50 }]
  },
  "pagination": { "page": 1, "per_page": 30, "hasMore": true }
}
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `GITHUB_TOKEN` | Recommended | GitHub Personal Access Token |
| `PORT` | No | Server port (default: 5000) |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Backend base URL |
| `VITE_PORT` | No | Frontend dev server port (default: 5174) |

---

## Testing

### Backend Tests (Jest + Supertest)

```bash
cd backend && npm test
# With coverage:
cd backend && npm test -- --coverage
```

Covers:
- ✅ Health check endpoint
- ✅ Profile fetch success (cache miss → `source: "github"`)
- ✅ Cache hit (`source: "cache"`, GitHub not called)
- ✅ User not found (404)
- ✅ Rate limit exceeded (429)
- ✅ Pagination params forwarded correctly

### Frontend Tests (Vitest + React Testing Library)

```bash
cd frontend && npm test
# With coverage:
cd frontend && npm run test:coverage
```

Covers:
- ✅ Search bar — render, submit, loading state
- ✅ Recent searches — save, limit 5, no duplicates
- ✅ Repository controls — filter, sort
- ✅ Error messages — 404, rate limit, generic
- ✅ Skeleton loaders — render, correct counts

---

## Deployment

### Backend → Render

1. Push to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables: `GITHUB_TOKEN`, `PORT=5000`

Or use the included `render.yaml` with Render's Blueprint feature.

### Frontend → Vercel

1. Push to GitHub
2. Import repo on [Vercel](https://vercel.com)
3. Set root directory: `frontend`
4. Add environment variable: `VITE_API_URL=https://your-render-url.onrender.com`
5. Deploy

---

## Developer Insights Engine

Located in `backend/utils/profileInsights.js` — rule-based analytics:

| Metric | Calculation |
|---|---|
| Total Stars | Sum of `stargazers_count` across all repos |
| Top Language | Most frequently occurring `language` field |
| Most Popular Repo | Repo with highest `stargazers_count` |
| Repository Diversity | Low (1-2 langs) / Medium (3-4) / High (5+) |
| Activity Level | Very Active (≤30 days) / Moderately Active (31-90) / Inactive (90+) |
| Suggested Improvement | Rule-based contextual string based on profile metrics |

---

## Future Improvements

- [ ] Contribution graph (calendar heatmap)
- [ ] Repository commit history chart
- [ ] Compare two GitHub users side-by-side
- [ ] Star/fork trend over time (GitHub GraphQL API)
- [ ] AI-generated insights (OpenAI/Gemini integration)
- [ ] Export profile report as PDF
- [ ] Dark/light theme toggle
- [ ] Pinned repositories section
- [ ] Organization profile support

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 19 + Vite |
| Styling | Tailwind CSS v3 |
| HTTP Client | Axios |
| Data Fetching | TanStack Query (React Query) |
| Charts | Recharts |
| Animations | Framer Motion |
| Icons | React Icons |
| Backend | Node.js + Express |
| Caching | node-cache (60s TTL) |
| Security | Helmet + CORS |
| Logging | Morgan |
| Backend Tests | Jest + Supertest |
| Frontend Tests | Vitest + React Testing Library |
| Backend Deploy | Render |
| Frontend Deploy | Vercel |
