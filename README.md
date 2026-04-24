# CoLab IDE

> AI-Powered Real-Time Collaborative Code Editor — a cloud-based development environment where multiple users collaborate through chat while an integrated AI assistant generates executable code in real time. Code runs directly in the browser using WebContainers, eliminating the need for any local setup.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, Tailwind CSS, GSAP, Lenis, Lucide Icons, Axios |
| **Backend** | Node.js (ES Modules), Express.js, MongoDB (Mongoose), Redis (ioredis) |
| **Auth** | JWT (jsonwebtoken), bcrypt, express-validator |
| **State** | React Context API |
| **Routing** | React Router v7 |

---

## Project Structure

```
CoLab IDE/
├── README.md                          ← You are here
│
├── client/CoLab IDE/                  ← Frontend (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── main.jsx                   # React entry point
│   │   ├── App.jsx                    # Root component — wraps UserProvider + Routes
│   │   ├── index.css                  # Tailwind directives
│   │   │
│   │   ├── config/
│   │   │   └── axios.js               # Pre-configured Axios instance (base URL)
│   │   │
│   │   ├── context/
│   │   │   └── user.context.jsx       # Global user state (user, setUser)
│   │   │
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx          # Route definitions
│   │   │
│   │   ├── screens/
│   │   │   ├── LandingPage.jsx        # Public marketing page
│   │   │   ├── login.jsx              # Login form → POST /users/login
│   │   │   ├── register.jsx           # Register form → POST /users/register
│   │   │   └── Home.jsx               # Authenticated dashboard
│   │   │
│   │   ├── components/                # Landing page sections
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   ├── UseCases.jsx
│   │   │   ├── CTA.jsx
│   │   │   └── Footer.jsx
│   │   │
│   │   └── utils/
│   │       └── lenis.js               # Smooth scroll (Lenis + GSAP ScrollTrigger)
│   │
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── server/                            ← Backend (Express + MongoDB)
    ├── server.js                      # Entry point — creates HTTP server
    ├── app.js                         # Express app — middleware + routes
    │
    ├── db/
    │   └── db.js                      # MongoDB connection (Mongoose)
    │
    ├── models/
    │   ├── user.models.js             # User schema + auth helpers
    │   └── project.modal.js           # Project schema (WIP)
    │
    ├── routes/
    │   └── user.routes.js             # /users/* route definitions
    │
    ├── controllers/
    │   ├── user.controllers.js        # Request handlers for auth
    │   └── project.controller.js      # Project handlers (WIP)
    │
    ├── services/
    │   ├── user.service.js            # User business logic
    │   ├── project.service.js         # Project business logic (WIP)
    │   └── redis.service.js           # Redis client for token blacklisting
    │
    ├── middleware/
    │   └── auth.middleware.js          # JWT verification + Redis blacklist check
    │
    └── package.json
```

---

## Environment Variables

### Server (`server/.env`)

```env
PORT=3000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/<db>
JWT_SECRET=your_jwt_secret
REDIS_HOST=your_redis_host
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
```

### Client (`client/CoLab IDE/.env`)

```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (Atlas or local)
- Redis (Cloud or local)

### 1. Backend

```bash
cd server
npm install
# Create .env with variables listed above
npm start
```

Server runs on `http://localhost:3000`.

### 2. Frontend

```bash
cd client/CoLab IDE
npm install
# Create .env with VITE_API_BASE_URL
npm run dev
```

Dev server runs on `http://localhost:5173`.

---

## API Endpoints

All routes are prefixed with `/users`.

| Method | Route | Auth | Body | Response | Description |
|--------|-------|------|------|----------|-------------|
| `POST` | `/users/register` | No | `{ email, password }` | `{ user, token }` | Create account |
| `POST` | `/users/login` | No | `{ email, password }` | `{ user, token }` | Authenticate |
| `GET` | `/users/profile` | Yes | — | `{ user }` | Get current user |
| `GET` | `/users/logout` | Yes | — | `{ message }` | Revoke token |

**Auth header:** `Authorization: Bearer <token>` or `token` cookie.

---

## How It Works

### Authentication Flow

```
┌─────────────────────────────────────────────────────┐
│                     REGISTER                        │
│                                                     │
│  register.jsx form                                  │
│       ↓                                             │
│  POST /users/register  { email, password }          │
│       ↓                                             │
│  express-validator validates input                  │
│       ↓                                             │
│  bcrypt hashes password (10 salt rounds)            │
│       ↓                                             │
│  User saved to MongoDB                              │
│       ↓                                             │
│  JWT token generated (24h expiry)                   │
│       ↓                                             │
│  Response: { user, token }                          │
│       ↓                                             │
│  Client stores token in localStorage                │
│  Client updates UserContext                         │
│  Client navigates to /home                          │
└─────────────────────────────────────────────────────┘
```

Login follows the same flow — the server finds the user by email, verifies the password with bcrypt, and returns a token.

### Protected Routes

```
Request  →  auth.middleware  →  Extract token (header / cookie)
                             →  Check Redis blacklist
                             →  Verify JWT signature
                             →  Attach user to req.user
                             →  Proceed to controller
```

### Logout

```
Client calls GET /users/logout
    → Token is added to Redis blacklist (24h TTL)
    → Client removes token from localStorage
    → Client clears UserContext
    → Client redirects to /login
```

### Frontend Routing

| Path | Component | Access |
|------|-----------|--------|
| `/` | `LandingPage` | Public |
| `/login` | `Login` | Public |
| `/register` | `Register` | Public |
| `/home` | `Home` | Authenticated |

### Data Flow Diagram

```
┌─────────┐       Axios        ┌───────────┐      Mongoose      ┌─────────┐
│  React  │  ←─────────────→  │  Express  │  ←──────────────→  │ MongoDB │
│ Frontend│   JSON over HTTP   │  Backend  │                    │         │
└─────────┘                    └─────┬─────┘                    └─────────┘
                                     │
                                     │  ioredis
                                     ↓
                                ┌─────────┐
                                │  Redis  │  (token blacklist)
                                └─────────┘
```

### Backend Architecture (MVC + Service Layer)

```
Route  →  Validation (express-validator)
       →  Controller (handles request/response)
       →  Service (business logic)
       →  Model (database operations)
```

### Frontend Architecture

```
main.jsx  →  App.jsx (UserProvider wrapper)
              →  AppRoutes.jsx (React Router)
                  →  Screens (pages)
                      →  Components (UI pieces)
                      →  Context (global state)
                      →  Config (axios instance)
```

---

## Key Design Decisions

- **JWT + Redis blacklist** — Stateless auth with the ability to revoke tokens on logout.
- **bcrypt** — Industry-standard password hashing (10 salt rounds).
- **ES Modules** — Both frontend and backend use `import/export` (`"type": "module"`).
- **Tailwind CSS** — Utility-first styling with a dark theme (`#050505`, `#1a1c1e`) and amber accents (`#ffaf01`).
- **GSAP + Lenis** — Scroll-triggered animations for a polished landing page experience.
- **Vite** — Fast HMR and optimized production builds.

---

## What's Next (WIP)

- [ ] Project model & CRUD API
- [ ] Real-time collaboration (WebSockets / Socket.io)
- [ ] AI code generation (Google Gemini integration)
- [ ] In-browser code execution (WebContainers)
- [ ] User persistence on page refresh (token → profile restore)

