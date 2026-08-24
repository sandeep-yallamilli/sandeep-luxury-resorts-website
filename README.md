# Sandeep Luxury Resorts 🏝️

[![Frontend: Firebase](https://img.shields.io/badge/Frontend-Firebase_Hosting-orange.svg)](https://firebase.google.com/)
[![Backend: Vercel](https://img.shields.io/badge/Backend-Vercel_Serverless-black.svg)](https://vercel.com/)
[![Database: Supabase](https://img.shields.io/badge/Database-Supabase_PostgreSQL-emerald.svg)](https://supabase.com/)
[![Framework: React 19](https://img.shields.io/badge/Framework-React_19_|_Vite-blue.svg)](https://vitejs.dev/)
[![Backend Framework: Django](https://img.shields.io/badge/Backend-Django_3.2_|_DRF-092E20.svg)](https://www.djangoproject.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

An ultra-luxury, full-stack resort management and booking platform featuring 3D interactive globes, virtual villa explorers, custom journey builders, AI concierge chat, real-time booking management, payment processing with digital receipts, and Google OAuth 2.0 authentication.

---

## ✨ Key Features

- 🌐 **Interactive 3D Globe**: WebGL / Three.js interactive globe showcasing global luxury resort locations with real-time location markers.
- 🏰 **Villa & Suite Explorer**: Interactive luxury room explorer with filtered views, virtual amenity previews, and capacity calculators.
- 🗺️ **Custom Journey Builder**: Step-by-step personalized itinerary planner for bespoke private island experiences and wellness retreats.
- 🤖 **AI Concierge Assistant**: Dynamic AI chat assistant providing 24/7 personalized travel recommendations, dining reservations, and activity planning.
- 💳 **Integrated Payment Gateway & Digital Receipts**: Full checkout flow with simulated payment confirmation, receipt generation, and downloadable transaction modal.
- 🔐 **Dual Authentication**: Secure Django REST Framework token authentication + Google OAuth 2.0 social sign-in.
- 🌓 **Dynamic Luxury Dark/Light Themes**: Tailored color palette with smooth glassmorphism and micro-animations.
- ⚡ **Multi-Cloud Architecture**: Serverless Django REST API deployed on Vercel, Supabase PostgreSQL database, and Vite React 19 frontend hosted on Firebase.

---

## 🏗️ Architecture & Technology Stack

```mermaid
graph TD
    A[Client Browser / SPA] -->|Static Assets & WebP Media| B[Firebase Hosting]
    A -->|REST API Requests| C[Vercel Serverless Python]
    C -->|Django WSGI Handler| D[Django REST Framework]
    D -->|PostgreSQL Wire Protocol| E[Supabase Managed Database]
```

### Stack Details

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS, Three.js / React Three Fiber, GSAP, Framer Motion, Lucide Icons |
| **Backend** | Python 3.7 / 3.9, Django 3.2, Django REST Framework, `dj-rest-auth`, `django-allauth`, WhiteNoise |
| **Authentication** | DRF Token Authentication + Google OAuth 2.0 (`google-auth`) |
| **Payments** | Payment Session API + Digital Receipt Generator |
| **Database** | Supabase Managed PostgreSQL (Production) / SQLite3 (Local Dev) |
| **Runner** | `concurrently` (Single command terminal execution for Django & Vite) |

---

## 📁 Repository Structure

```text
Resort website/
├── docs/                            # Project documentation & guides
│   ├── DEPLOYMENT_GUIDE.md          # Step-by-step multi-cloud deployment guide (Vercel, Supabase, Firebase)
│   ├── DEPLOYMENT.md                # Production readiness & security checklist
│   └── PROJECT_DOCUMENTATION.md     # Full technical architecture, API schema, & database models
│
├── frontend/                        # Vite + React 19 Frontend
│   ├── public/                      # Static assets & WebP image library
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/              # Header, Footer, ProtectedRoute, SmoothScroll
│   │   │   └── ui/                  # InteractiveGlobe, VillaExplorer, JourneyBuilder, ConciergeChat, PaymentReceiptModal, etc.
│   │   ├── context/                 # AuthContext & ThemeContext
│   │   ├── lib/                     # Typed API client (`api.ts`)
│   │   ├── pages/                   # Home, Resorts, ResortDetail, Villas, Wellness, Dining, Concierge, Book, Profile, etc.
│   │   └── main.tsx                 # Application entrypoint
│   ├── firebase.json                # Firebase Hosting configuration (SPA rewrites)
│   ├── .firebaserc                  # Firebase project configuration
│   ├── vite.config.ts               # Vite build config & backend API proxy rules
│   └── package.json                 # Frontend dependencies & scripts
│
├── backend/                         # Django REST API Backend
│   ├── api/                         # Django App (Models, Views, Serializers, Admin, URLs)
│   ├── resort_backend/              # Project settings & WSGI entrypoint
│   ├── vercel.json                  # Vercel serverless build & route routing configuration
│   ├── requirements.txt             # Python package dependencies
│   └── manage.py                    # Django CLI management script
│
├── package.json                     # Root workspace scripts (`npm run dev`)
├── LICENSE                          # MIT License
└── README.md                        # Overview & quick start guide
```

---

## ⚡ Quick Start (Local Development)

### 1. Prerequisites
- **Node.js** v18+
- **Python** v3.7+ or v3.9+
- **Git**

### 2. Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sandeep-yallamilli/Sandeep_Luxury_Resorts.git
   cd Sandeep_Luxury_Resorts
   ```

2. **Install Frontend Dependencies:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd backend
   python -m venv venv
   # Windows:
   venv\Scripts\pip install -r requirements.txt
   # macOS / Linux:
   # source venv/bin/activate && pip install -r requirements.txt
   cd ..
   ```

4. **Install Root Dependencies:**
   ```bash
   npm install
   ```

### 3. Run Development Servers

Start both Django backend (`:8000`) and Vite frontend (`:5173`) concurrently with a single command from the project root:

```bash
npm run dev
```

- 🌐 **Frontend App:** [http://localhost:5173](http://localhost:5173)
- ⚙️ **Backend API:** [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/)
- 🔧 **Django Admin:** [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)

---

## ⚙️ Environment Configuration

### Frontend Environment (`frontend/.env`)

```env
VITE_API_URL=http://127.0.0.1:8000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
```

### Backend Environment (`backend/.env`)

```env
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost,.vercel.app
DATABASE_URL=postgres://user:password@db.supabase.co:5432/postgres
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://your-app.web.app
```

---

## 🔌 API Endpoints Reference

All backend REST API endpoints are served under `/api/*`:

### 🔐 Authentication & Guest Profile
| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/api/register/` | ❌ | Create new user account |
| `POST` | `/api/login/` | ❌ | Authenticate user & return DRF token |
| `POST` | `/api/google-login/` | ❌ | Authenticate with Google OAuth 2.0 token |
| `GET` | `/api/profile/` | ✅ | Get profile details & past booking history |

### 🏖️ Resorts, Suites & Experiences
| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/resorts/` | ❌ | List all luxury resort destinations |
| `GET` | `/api/resorts/{slug}/` | ❌ | Detailed resort information & gallery |
| `GET` | `/api/rooms/` | ❌ | List luxury suites & ocean villas |
| `GET` | `/api/services/` | ❌ | List spa, wellness & dining experiences |
| `GET` | `/api/banners/` | ❌ | Dynamic homepage header banners |

### 📅 Bookings, Concierge & Payments
| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/bookings/` | ✅ | List user's active & past reservations |
| `POST` | `/api/bookings/` | ✅ | Create a new resort booking |
| `PATCH` | `/api/bookings/{id}/` | ✅ | Modify or cancel a booking |
| `POST` | `/api/concierge/` | ❌ | Send prompt to AI Concierge chat |
| `POST` | `/api/inquiries/` | ❌ | Submit general resort inquiry |
| `POST` | `/api/subscribe/` | ❌ | Join luxury newsletter mailing list |
| `POST` | `/api/payments/create-session/` | ✅ | Initialize payment checkout session |
| `POST` | `/api/payments/confirm/` | ✅ | Confirm payment & complete booking |
| `GET` | `/api/payments/receipt/{id}/` | ✅ | Retrieve digital payment receipt |

---

## 📚 Complete Documentation & Guides

Comprehensive guides and architectural reference manuals are located in the [`docs/`](./docs/) directory:

- 📖 [`docs/PROJECT_DOCUMENTATION.md`](./docs/PROJECT_DOCUMENTATION.md) — Comprehensive technical architecture, database schemas, model fields, and API specification.
- 🚀 [`docs/DEPLOYMENT_GUIDE.md`](./docs/DEPLOYMENT_GUIDE.md) — Step-by-step production deployment guide for Supabase, Vercel, and Firebase Hosting.
- 🔒 [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) — Production readiness, security hardening, CORS, and environment checklist.

---

## 📄 License & Attribution

This project is licensed under the **MIT License** — see the [`LICENSE`](./LICENSE) file for details.

Designed and developed for **Sandeep Luxury Resorts**.
