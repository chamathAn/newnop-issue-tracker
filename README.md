# Issue Tracker

A full-stack issue tracking application built with React, Express.js, Prisma, and MongoDB Atlas.

## Features

- **Issue Management**: Create, view, edit, and delete issues with title, description, priority, severity, and status
- **Issue Assignment**: Assign issues to registered users
- **Status Tracking**: Visual badges for Open, In Progress, Resolved, and Closed states
- **Dashboard**: Issue counts by status with recent activity
- **Search & Filter**: Debounced search (400ms) with filters by status, priority, and severity
- **Pagination**: Browse large issue lists efficiently
- **Export**: Download issues as CSV or JSON
- **Authentication**: JWT-based login and registration
- **Responsive UI**: Full mobile support with hamburger navigation

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React + Vite + TypeScript | React 19, Vite 6 |
| UI Components | shadcn/ui + Tailwind CSS | Tailwind v3 |
| State Management | Zustand | v5 |
| Forms & Validation | React Hook Form + Zod | RHF v7, Zod v4 |
| HTTP Client | Axios | v1 |
| Routing | React Router DOM | v7 |
| Backend | Express.js (Node.js) | Express v5 |
| ORM | Prisma | v5.22 |
| Database | MongoDB Atlas | — |
| Auth | JWT + bcryptjs | — |

## Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | https://newnop-issue-tracker-puce.vercel.app |
| Backend | Render (free tier) | — |

> **Cold start warning**: Render's free tier spins down instances after a period of inactivity. The **first request after a period of inactivity may take up to 50 seconds** while the server wakes up. Subsequent requests respond normally. The login and register pages display an inline notice about this.

## Prerequisites

- Node.js v18 or later
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier works)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/newnop-issue-tracker.git
cd newnop-issue-tracker
```

### 2. Install dependencies

```bash
# Server dependencies
cd server && npm install && cd ..

# Client dependencies
cd client && npm install && cd ..
```

### 3. Configure environment variables

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your values:

```env
PORT=8000
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/newnop-issue-tracker?appName=Cluster0"
JWT_SECRET=<generate a random 64-character string>
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

To generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

> **Note for macOS users**: Port 5000 is occupied by the AirPlay Receiver service. The backend runs on port **8000** to avoid this conflict.

### 4. Generate the Prisma client

```bash
cd server && npx prisma generate && cd ..
```

This reads `server/prisma/schema.prisma` and generates the type-safe database client. You do **not** need to run `prisma db push` — MongoDB collections are created automatically on the first write.

### 5. Start development servers

Open two terminal windows:

**Terminal 1 — Backend:**

```bash
cd server
npm run dev
# Server starts on http://localhost:8000
```

**Terminal 2 — Frontend:**

```bash
cd client
npm run dev
# App opens at http://localhost:5173
```

### 6. Create your first account

Open `http://localhost:5173/register` and sign up.

## Project Structure

```
newnop-issue-tracker/
├── server/                          # Express API
│   ├── prisma/
│   │   └── schema.prisma            # Prisma data models (User, Issue)
│   ├── src/
│   │   ├── config/
│   │   │   └── prisma.js            # Prisma client singleton
│   │   ├── controllers/
│   │   │   ├── auth.controller.js   # Register, login, getMe
│   │   │   └── issues.controller.js # CRUD + search + pagination + export
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT verification
│   │   │   └── errorHandler.js      # Prisma + generic error mapping
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── issues.routes.js
│   │   │   └── users.routes.js
│   │   ├── utils/
│   │   │   └── exportHelpers.js     # CSV serialisation
│   │   └── index.js                 # App entry point
│   ├── .env                         # Local secrets — gitignored
│   ├── .env.example                 # Template — safe to commit
│   └── package.json
│
└── client/                          # React frontend
    └── src/
        ├── api/
        │   ├── axios.ts             # Axios instance + JWT interceptor
        │   ├── auth.api.ts          # Auth API calls
        │   └── issues.api.ts        # Issues API calls
        ├── components/
        │   ├── auth/                # LoginForm, RegisterForm
        │   ├── common/              # ConfirmDialog, EmptyState, ExportButton,
        │   │                        # LoadingSkeleton, Pagination
        │   ├── dashboard/           # StatusCountCard
        │   ├── issues/              # IssueFilters, IssueForm, IssueTable,
        │   │                        # PriorityBadge, SeverityBadge, StatusBadge
        │   ├── layout/              # Navbar, PageWrapper
        │   └── ui/                  # shadcn/ui components (16 total)
        ├── hooks/
        │   ├── useDebounce.ts       # 400ms debounce hook
        │   └── useIssues.ts         # Derived issue selectors
        ├── pages/
        │   ├── CreateIssuePage.tsx
        │   ├── DashboardPage.tsx
        │   ├── EditIssuePage.tsx
        │   ├── IssueDetailPage.tsx
        │   ├── IssuesPage.tsx
        │   ├── LoginPage.tsx
        │   └── RegisterPage.tsx
        ├── router/
        │   ├── AppRouter.tsx        # Route definitions
        │   └── ProtectedRoute.tsx   # JWT-gated outlet
        ├── schemas/
        │   ├── auth.schema.ts       # Zod login/register schemas
        │   └── issue.schema.ts      # Zod issue create/update schemas
        ├── stores/
        │   ├── authStore.ts         # Auth state + localStorage persistence
        │   └── issueStore.ts        # Issues, filters, pagination, fetch actions
        └── types/
            └── index.ts             # TypeScript interfaces
```

## Available Scripts

### Server (`cd server`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon (auto-reload on change) |
| `npm start` | Start without auto-reload |
| `npx prisma generate` | Regenerate Prisma client after schema changes |

### Client (`cd client`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server at http://localhost:5173 |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run preview` | Preview the production build locally |

## Environment Variables

All variables live in `server/.env` (gitignored). See `server/.env.example` for the template.

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | Yes | Server listen port. Use `8000` on macOS (port 5000 is taken by AirPlay). Render sets this automatically in production. |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string including database name. |
| `JWT_SECRET` | Yes | Secret used to sign tokens. Use a random 64-char string in production. |
| `JWT_EXPIRES_IN` | Yes | Token lifetime (e.g. `7d`, `24h`). |
| `NODE_ENV` | Yes | `development` or `production`. Controls CORS allowed origins. |

## API Reference

All authenticated routes require `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Auth | Body / Query | Description |
|--------|----------|------|--------------|-------------|
| POST | `/api/auth/register` | No | `{ name, email, password }` | Register and receive token |
| POST | `/api/auth/login` | No | `{ email, password }` | Login and receive token |
| GET | `/api/auth/me` | Yes | — | Get current user profile |

### Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users` | Yes | List all users (name + email, for assignee dropdown) |

### Issues

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/issues` | Yes | List issues with optional filters and pagination |
| GET | `/api/issues/export` | Yes | Export issues as CSV or JSON file |
| GET | `/api/issues/:id` | Yes | Get a single issue (with assignee and creator) |
| POST | `/api/issues` | Yes | Create a new issue |
| PATCH | `/api/issues/:id` | Yes | Update an existing issue |
| DELETE | `/api/issues/:id` | Yes | Delete an issue |

#### Issue list query parameters

```
GET /api/issues?search=login+bug&status=open&priority=high&severity=critical&assignee=<userId>&page=1&limit=20
```

| Param | Values | Description |
|-------|--------|-------------|
| `search` | string | Case-insensitive search in title and description |
| `status` | `open` \| `in-progress` \| `resolved` \| `closed` | Filter by status |
| `priority` | `low` \| `medium` \| `high` | Filter by priority |
| `severity` | `minor` \| `major` \| `critical` | Filter by severity |
| `assignee` | user ObjectId | Filter by assigned user |
| `page` | integer ≥ 1 | Page number (default: 1) |
| `limit` | integer | Items per page (default: 20) |

#### Export query parameters

```
GET /api/issues/export?format=csv&status=open&priority=high
```

Accepts the same filter params as the list endpoint, plus `format=csv` (default) or `format=json`.

## Database Schema

Prisma schema is at `server/prisma/schema.prisma`. The MongoDB provider maps Prisma `id` to MongoDB `_id` automatically.

```
User
  id          String    (ObjectId, @map("_id"))
  name        String
  email       String    (unique)
  password    String    (bcrypt hash)
  createdAt   DateTime
  updatedAt   DateTime

Issue
  id          String    (ObjectId, @map("_id"))
  title       String
  description String
  status      String    default "open"
  priority    String
  severity    String?
  assigneeId  String?   (FK → User)
  createdById String    (FK → User)
  createdAt   DateTime
  updatedAt   DateTime
```

## Branching Strategy (GitHub Flow)

| Branch | Feature |
|--------|---------|
| `feature/project-setup` | Monorepo scaffold, Vite config, tooling, initial README |
| `feature/auth` | JWT authentication, login/register UI and API |
| `feature/issue-crud` | Full issue CRUD, status/priority/severity badges, dashboard |
| `feature/issue-filters-search` | Debounced search, filters, pagination |
| `feature/issue-export` | CSV/JSON export endpoint and client button |
| `feature/ui-polish` | Loading skeletons, empty states, toasts, responsive navbar |
| `feature/prisma-integration` | Replaced Mongoose with Prisma ORM + MongoDB Atlas |

## Commit Convention

```
<type>[optional scope]: <description>

feat:     new user-facing feature
fix:      bug fix
chore:    tooling or config change
build:    dependency or build system change
refactor: code restructure without behaviour change
perf:     performance improvement
style:    styling or formatting change
```

Examples:
```
feat(issues): add CSV export endpoint
fix(auth): return 401 on expired token
build(server): replace mongoose with prisma and @prisma/client
```
