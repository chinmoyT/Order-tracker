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

The backend is a normal Express server (not serverless-friendly), so it deploys to a host that
runs a persistent Node process — e.g. **Render**. The frontend is a static Vite build, which
deploys well to **Vercel**.

### 1. Push to GitHub

```
git remote add origin <your-github-repo-url>
git push -u origin master
```

### 2. Backend on Render

1. [render.com](https://render.com) → New → Web Service → connect your GitHub repo.
2. **Root Directory**: `backend`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. Environment variables (Render dashboard → Environment):
   - `MONGODB_URI` — your Atlas connection string
   - `JWT_SECRET` — a long random value (don't reuse the local dev one)
   - `CORS_ORIGIN` — your Vercel frontend URL once you have it (e.g. `https://your-app.vercel.app`); comma-separate multiple origins
   - `PORT` — Render sets this automatically, no need to add it
6. After the first deploy, run the admin seed once, either via Render's Shell tab (`npm run seed:admin`
   with `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` env vars set) or by running it locally against the
   production `MONGODB_URI`.
7. Note the deployed URL (e.g. `https://ef-orders-backend.onrender.com`).

### 3. Frontend on Vercel

1. [vercel.com](https://vercel.com) → Add New → Project → import the same GitHub repo.
2. **Root Directory**: `frontend`
3. Framework preset: Vite (auto-detected). Build command `npm run build`, output `dist` (defaults).
4. Environment variable: `VITE_API_URL` = `https://<your-render-backend-url>/api`
5. Deploy. `frontend/vercel.json` already adds the SPA rewrite so client-side routes
   (e.g. `/vendors`, `/orders/123/edit`) work on refresh/direct load.

### 4. Wire CORS back up

Once you know the Vercel URL, set `CORS_ORIGIN` on Render to that exact URL (redeploy isn't required —
Render picks up env var changes on the next restart, which happens automatically when you save them).

Render's free tier spins down after inactivity, so the first request after idle can take ~30s+ to wake up.
