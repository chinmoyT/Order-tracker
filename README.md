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
- Vendor module currently supports list + add only, per initial scope.
