# BlogiFy React Client (Vite + React + Tailwind)

This is a minimal React + Tailwind scaffold to start migrating the UI from EJS to a modern SPA.

Quick start:

1. Install dependencies (from `client/`):

```bash
cd client
npm install
```

2. Run dev server (Vite) which proxies `/api` to the Express server at `http://localhost:5000`:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

Notes:

- The current server still renders EJS pages. This client initially links to server-rendered pages for sign-in, posts, and admin flows.
- Next steps: add JSON API endpoints (GET posts, GET post/:id, POST/PUT/DELETE with authentication) so the SPA can fully function client-side.
