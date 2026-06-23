# Blog App (Node.js + Express + React)

A full-stack blog application with:

- **Server:** Node.js, Express, MongoDB, JWT auth (cookie-based)
- **Client:** React (Vite), React Router, Tailwind CSS, Editor.js

## Repository Structure

```text
.
├── client/   # React frontend
└── server/   # Express API backend
```

## Prerequisites

- Node.js 18+
- npm
- MongoDB database

## Environment Variables

Create a `.env` file in `server/`:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
# Optional (for separate frontend deployment)
CLIENT_ORIGIN=http://localhost:5173
```

For the frontend (`client/`), optional:

```env
VITE_API_BASE= # keep empty to use Vite proxy in local development
```

- Leave `VITE_API_BASE` empty for local development with Vite proxy.
- Set it to your backend URL (for example `https://your-api.onrender.com`) in deployed environments.

## Install Dependencies

Install dependencies for both apps:

```bash
cd server && npm install
cd ../client && npm install
```

## Run Locally

1. Start backend:

```bash
cd server
npm run dev
```

2. Start frontend (new terminal):

```bash
cd client
npm run dev
```

The client runs on `http://localhost:5173` and proxies `/api` requests to `http://localhost:5000`.

## Available Scripts

### Server (`server/`)

- `npm run dev` - start backend with nodemon
- `npm start` - start backend with node
- `npm test` - placeholder script (currently exits with error)

### Client (`client/`)

- `npm run dev` - start Vite dev server
- `npm run build` - build frontend for production
- `npm run preview` - preview production build

## API Base Paths

- Auth: `/api/v1/auth`
- Posts: `/api/v1/posts`
- Health check: `/health`
