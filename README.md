# EF Orders ERP

## Structure

- `backend/` — Express + MongoDB (Mongoose) API, JWT auth
- `frontend/` — React (Vite) + MUI

## Running

**Backend**

```
cd backend
npm install
npm run seed:admin   # creates the admin user (only needs to run once)
npm run dev           # http://localhost:5000
```

**Frontend**

```
cd frontend
npm install
npm run dev            # http://localhost:5173
```

Login with the seeded admin credentials (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `backend/.env`).

## Notes

- `backend/.env` and `frontend/.env` are git-ignored — copy the `.env.example` files if setting up fresh.

## Deployment

Both the backend and frontend deploy to **Vercel**. The backend runs as a Vercel serverless
function (`backend/api/index.js` wraps the Express app; `src/config/db.js` caches the Mongo
connection across warm invocations). The frontend is a static Vite build.

### 1. Push to GitHub

```
git remote add origin <your-github-repo-url>
git push -u origin master
```

### 2. Backend on Vercel

1. [vercel.com](https://vercel.com) → Add New → Project → import the GitHub repo.
2. **Root Directory**: `backend`
3. Framework preset: **Other**. Vercel picks up `backend/vercel.json`, which routes all
   requests to the `api/index.js` serverless function — no build command needed.
4. Environment variables (Project Settings → Environment Variables):
   - `MONGODB_URI` — your Atlas connection string
   - `JWT_SECRET` — a long random value (don't reuse the local dev one)
   - `CORS_ORIGIN` — your frontend's Vercel URL once you have it (e.g. `https://your-app.vercel.app`); comma-separate multiple origins
5. Deploy. Note the deployed URL (e.g. `https://ef-orders-backend.vercel.app`).
6. Run the admin seed once against the production database — locally, with `MONGODB_URI` in
   `backend/.env` pointed at Atlas: `npm run seed:admin`. (Serverless functions don't have a
   shell tab to run one-off scripts in, unlike Render.)

### 3. Frontend on Vercel

1. [vercel.com](https://vercel.com) → Add New → Project → import the same GitHub repo (as a
   second project).
2. **Root Directory**: `frontend`
3. Framework preset: Vite (auto-detected). Build command `npm run build`, output `dist` (defaults).
4. Environment variable: `VITE_API_URL` = `https://<your-backend-vercel-url>/api`
5. Deploy. `frontend/vercel.json` already adds the SPA rewrite so client-side routes
   (e.g. `/vendors`, `/orders/123/edit`) work on refresh/direct load.

### 4. Wire CORS back up

Once you know the frontend's Vercel URL, set `CORS_ORIGIN` on the backend project to that exact
URL and redeploy (Vercel env var changes require a redeploy to take effect, unlike Render).
