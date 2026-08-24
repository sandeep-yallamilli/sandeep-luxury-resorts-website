# Production Deployment Guide: Resort Website 🚀

This guide walks you through deploying the full-stack resort website across the multi-cloud setup:
- **Database:** Supabase (Managed PostgreSQL)
- **Backend:** Vercel (Django Serverless API)
- **Frontend:** Firebase Hosting (Vite + React 19 SPA)

---

## 1. Database Setup (Supabase)

1. Create or log into your [Supabase Account](https://supabase.com/).
2. Click **New Project** and name your project (e.g. `sandeep-luxury-resorts`).
3. Set your Database Password and copy it securely.
4. Navigate to **Project Settings** -> **Database** -> **Connection String**.
5. Copy the URI connection string:
   ```text
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```
   *(Or copy the Connection Pooler URI if using transaction pooling on port 6543)*.

---

## 2. Backend Deployment (Vercel)

### Option A: Deploy via Vercel CLI

1. Open your terminal in the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install Vercel CLI if not already installed:
   ```bash
   npm install -g vercel
   ```
3. Login and deploy:
   ```bash
   vercel login
   vercel --prod
   ```
4. Configure Environment Variables in Vercel Dashboard (**Project Settings -> Environment Variables**):
   - `DATABASE_URL`: `postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres`
   - `SECRET_KEY`: `<Generate-A-Strong-Production-Secret-Key>`
   - `DEBUG`: `False`
   - `ALLOWED_HOSTS`: `.vercel.app`
   - `CORS_ALLOWED_ORIGINS`: `https://<your-app>.web.app,https://<your-app>.firebaseapp.app`

### Option B: Deploy via GitHub & Vercel Dashboard

1. Push your repository to GitHub.
2. In Vercel, click **Add New Project** and import your repository.
3. Set Root Directory to `backend`.
4. Add the environment variables listed above under step 4.
5. Click **Deploy**.

### Run Database Migrations & Seed Data on Supabase
From your local environment with `DATABASE_URL` set in `backend/.env`:
```bash
cd backend
venv\Scripts\python manage.py migrate
venv\Scripts\python manage.py seed_data
```

---

## 3. Frontend Deployment (Firebase Hosting)

1. Open terminal in `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install Firebase CLI if not already installed:
   ```bash
   npm install -g firebase-tools
   ```
3. Login to Firebase:
   ```bash
   firebase login
   ```
4. Configure production environment variables in `frontend/.env`:
   ```env
   VITE_API_URL=https://<your-vercel-app>.vercel.app
   VITE_GOOGLE_CLIENT_ID=<your-production-google-client-id>.apps.googleusercontent.com
   ```
5. Verify build artifacts in `frontend/dist`:
   ```bash
   npm run build
   ```
6. Deploy to Firebase Hosting:
   ```bash
   firebase deploy --only hosting
   ```

---

## 4. Summary of Production Environment Variables

### Backend (`backend/.env` / Vercel Environment Variables)
| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | Supabase PostgreSQL Connection String | `postgresql://postgres:pass@db.ref.supabase.co:5432/postgres` |
| `SECRET_KEY` | Production Django Secret Key | `django-insecure-prod-key-xyz...` |
| `DEBUG` | Production debug flag | `False` |
| `ALLOWED_HOSTS` | Allowed backend domains | `.vercel.app` |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend domains | `https://sandeep-luxury-resorts.web.app` |

### Frontend (`frontend/.env` / Firebase Environment Variables)
| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Deployed Vercel Backend URL | `https://resort-backend.vercel.app` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID | `123456789-abc.apps.googleusercontent.com` |

---

## 5. Verification Checklist

- [x] Backend static file configuration updated with `whitenoise`.
- [x] Vercel WSGI entrypoint (`backend/vercel.json` & `resort_backend/wsgi.py`) ready.
- [x] Firebase Hosting configuration (`frontend/firebase.json` & `frontend/.firebaserc`) ready.
- [ ] Database migrations & seeding executed against Supabase PostgreSQL database.
- [ ] Production Vercel URL set as `VITE_API_URL` in frontend environment.
- [ ] Firebase web app domain added to Google Cloud OAuth Authorized JavaScript Origins.
