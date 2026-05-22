# Issue Tracker

A full-stack issue tracking application built with React, Express.js, and MongoDB.

## Features

- **Issue Management**: Create, view, edit, and delete issues with title, description, priority, severity, and status
- **Issue Assignment**: Assign issues to registered users
- **Status Tracking**: Visual badges for Open, In Progress, Resolved, and Closed states
- **Dashboard**: Issue counts by status with recent activity
- **Search & Filter**: Debounced search with filters by status, priority, and severity
- **Pagination**: Browse large issue lists efficiently
- **Export**: Download issues as CSV or JSON
- **Authentication**: JWT-based login and registration

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript |
| UI Components | shadcn/ui + Tailwind CSS |
| State Management | Zustand |
| Forms | React Hook Form + Zod |
| Backend | Express.js (Node.js) |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |

## Prerequisites

- Node.js v18+
- A MongoDB Atlas account (or local MongoDB installation)

## Setup

### 1. Clone and install dependencies

```bash
git clone https://github.com/<your-username>/newnop-issue-tracker.git
cd newnop-issue-tracker

# Install server dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..
```

### 2. Configure environment variables

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/newnop-issue-tracker
JWT_SECRET=<generate a random 64-character string>
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

To generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Run in development

Open two terminal windows:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# App opens at http://localhost:5173
```

### 4. Register your first user

Open `http://localhost:5173/register` and create an account.

## Project Structure

```
newnop-issue-tracker/
├── server/                   # Express API
│   ├── src/
│   │   ├── config/db.js      # MongoDB connection
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/       # Auth + error handling
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API route definitions
│   │   └── utils/            # CSV export helpers
│   └── .env.example
└── client/                   # React frontend
    └── src/
        ├── api/              # Axios instance + API calls
        ├── components/       # Reusable UI components
        ├── hooks/            # Custom React hooks
        ├── pages/            # Page-level components
        ├── router/           # React Router setup
        ├── schemas/          # Zod validation schemas
        ├── stores/           # Zustand state stores
        └── types/            # TypeScript interfaces
```

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/users` | Yes | List all users (for assignee) |
| GET | `/api/issues` | Yes | List issues (with filters + pagination) |
| GET | `/api/issues/export` | Yes | Export issues as CSV or JSON |
| GET | `/api/issues/:id` | Yes | Get single issue |
| POST | `/api/issues` | Yes | Create issue |
| PATCH | `/api/issues/:id` | Yes | Update issue |
| DELETE | `/api/issues/:id` | Yes | Delete issue |

### Issue filters (query params)

```
GET /api/issues?search=bug&status=open&priority=high&page=1&limit=20
GET /api/issues/export?format=csv&status=resolved
```

## Branching Strategy (GitHub Flow)

Each feature is developed on a separate branch and merged via pull request:

| Branch | Feature |
|--------|---------|
| `feature/project-setup` | Monorepo scaffold, tooling, README |
| `feature/auth` | JWT authentication, login/register UI |
| `feature/issue-crud` | Full issue CRUD, badges, dashboard |
| `feature/issue-filters-search` | Debounced search, filters, pagination |
| `feature/issue-export` | CSV/JSON export |
| `feature/ui-polish` | Loading states, empty states, toasts, responsive |

## Commit Convention

```
<type>[optional scope]: <description>

feat: add new feature
fix: a bug fix
chore: tooling or config changes
build: dependency changes
refactor: code restructuring without behavior change
perf: performance improvement
style: styling changes
```
