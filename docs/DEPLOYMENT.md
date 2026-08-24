# Production Deployment & Security Hardening Guide 🛡️

This guide outlines the production deployment strategy, security checklist, and infrastructure maintenance for **Sandeep Luxury Resorts**.

---

## 🏗️ Multi-Cloud Deployment Architecture

```text
               ┌──────────────────────────────┐
               │    Client Browser / SPA      │
               └──────────────┬───────────────┘
                              │
               ┌──────────────┴───────────────┐
               │                              │
       (Static Assets)                 (API Requests)
               │                              │
               ▼                              ▼
    ┌────────────────────┐         ┌────────────────────┐
    │  Firebase Hosting  │         │   Vercel Serverless│
    │   (React 19 SPA)   │         │ (Django REST API)  │
    └────────────────────┘         └──────────┬─────────┘
                                              │
                                       (Database Driver)
                                              │
                                              ▼
                                   ┌────────────────────┐
                                   │  Supabase Database │
                                   │ (Cloud PostgreSQL) │
                                   └────────────────────┘
```

---

## 1. Production Deployment Steps

### 1.1 Backend Deployment (Vercel)

1. Ensure `backend/vercel.json` is configured with the WSGI builder:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "resort_backend/wsgi.py",
         "use": "@vercel/python"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "resort_backend/wsgi.py"
       }
     ]
   }
   ```
2. Navigate to `backend/` and trigger Vercel deployment:
   ```bash
   cd backend
   vercel --prod
   ```
3. Set Vercel Production Environment Variables in dashboard:
   - `DATABASE_URL`: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
   - `SECRET_KEY`: `<Generate-Strong-Production-Secret>`
   - `DEBUG`: `False`
   - `ALLOWED_HOSTS`: `.vercel.app`
   - `CORS_ALLOWED_ORIGINS`: `https://<your-firebase-app-id>.web.app`

### 1.2 Database Deployment (Supabase PostgreSQL)

1. Create a production PostgreSQL project on [Supabase](https://supabase.com/).
2. Run Django database migrations from your local workspace connected to Supabase:
   ```bash
   cd backend
   venv\Scripts\python manage.py migrate
   ```
3. Seed default resorts, suites, and wellness services:
   ```bash
   venv\Scripts\python manage.py seed_data
   ```

### 1.3 Frontend Deployment (Firebase Hosting)

1. Update `frontend/.env` with your production Vercel backend URL:
   ```env
   VITE_API_URL=https://<your-vercel-app>.vercel.app
   VITE_GOOGLE_CLIENT_ID=<your-production-google-client-id>.apps.googleusercontent.com
   ```
2. Build the production React 19 single-page bundle:
   ```bash
   cd frontend
   npm run build
   ```
3. Deploy static assets to Firebase Hosting CDN:
   ```bash
   firebase deploy --only hosting
   ```

---

## 2. Production Security Hardening Checklist

- [x] **HTTPS Enforcement**: SSL/TLS enabled across Firebase Hosting and Vercel.
- [x] **CORS Origin Restricting**: `CORS_ALLOWED_ORIGINS` explicitly restricted to authorized frontend domains.
- [x] **Secret Management**: No secrets or API keys committed to Git repository (`.env` in `.gitignore`).
- [x] **Django Debug Mode**: `DEBUG = False` enforced in production.
- [x] **Static Asset Caching**: `WhiteNoiseMiddleware` configured with immutable asset caching (`Cache-Control: max-age=31536000`).
- [x] **Database File Cleanup**: Signal handlers configured to delete orphaned uploaded images on database record updates/deletions.
- [x] **CSRF / Cross-Site Scripting Protection**: DRF token header authentication (`Authorization: Token <token>`) used for authenticated endpoints.

---

## 3. Maintenance & Disaster Recovery

### Database Backups
- Supabase provides automated daily PostgreSQL database backups. Point-in-time recovery (PITR) is available via the Supabase Dashboard.

### Media & Static File Management
- All resort images are optimized in WebP format and served via static asset handlers.
