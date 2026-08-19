# Overflow AI — Deployment Guide

## Overview

Deploy the frontend (static build) and backend (Node server) separately. Any combination below
works — pick what your team already uses.

| Piece | Good options |
|---|---|
| Frontend (`client/dist`) | Firebase Hosting, Vercel, Netlify |
| Backend (`server/`) | Render, Railway, Fly.io, Google Cloud Run, a plain VPS |
| Auth + DB | Firebase (Authentication + Firestore) — required either way |

---

## 1. Firebase project (once)

1. In the Firebase console, enable **Authentication** (Email/Password + Google) and **Firestore**.
2. Deploy security rules from `docs/SCHEMA.md`:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init firestore   # point at your project, accept defaults
   # paste the rules from docs/SCHEMA.md into firestore.rules
   firebase deploy --only firestore:rules
   ```
3. Generate a **service account key** for the backend (Project settings → Service accounts).

## 2. Backend deployment (example: Render)

1. Push this repo to GitHub.
2. In Render: **New → Web Service**, connect the repo, set root directory to `server`.
3. Build command: `npm install`. Start command: `npm start`.
4. Environment variables (Render dashboard → Environment):
   - `PORT` — Render sets this automatically, but the app reads `process.env.PORT` so it's fine.
   - `CLIENT_ORIGIN` — your deployed frontend URL, e.g. `https://overflow-ai.vercel.app`
   - `GROQ_API_KEY` (recommended) or `GEMINI_API_KEY` or `OPENAI_API_KEY`
   - `GOOGLE_PLACES_API_KEY` (optional)
   - `FIREBASE_SERVICE_ACCOUNT_JSON` — paste the **entire** service account JSON as one line
     (the app checks this env var before falling back to a file path — no need to upload the file)
5. Deploy. Note the resulting URL (e.g. `https://overflow-ai-api.onrender.com`).

Cloud Run / Fly.io / a VPS follow the same shape: build with `npm install`, run with `npm start`,
set the same environment variables, and open port 5000 (or whatever `$PORT` resolves to).

## 3. Frontend deployment (example: Vercel)

1. In Vercel: **New Project**, import the repo, set root directory to `client`.
2. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
3. Environment variables (from `client/.env`):
   - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`,
     `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`
   - `VITE_API_BASE_URL` → your deployed backend, e.g. `https://overflow-ai-api.onrender.com/api`
   - `VITE_GOOGLE_PLACES_KEY` (optional, only if you want it available client-side too)
4. In Firebase console → Authentication → Settings → **Authorized domains**, add your Vercel
   domain (and any custom domain) so Google Sign-In works there.
5. Deploy.

### Alternative: Firebase Hosting for the frontend
```bash
cd client && npm run build
firebase init hosting        # public directory: dist, configure as single-page app: yes
firebase deploy --only hosting
```

## 4. PWA / offline checklist

- Replace the placeholder files in `client/public/icons/` with real 192×192 and 512×512 PNG icons
  before your production build — `npm run build` bakes the manifest referencing them.
- Serve the frontend over **HTTPS** (all the platforms above do this by default) — service workers
  require it.
- After deploying, test offline mode: load the app once online, then use browser dev tools → Network
  → Offline, and confirm the dashboard, first-aid library, and contacts still render.

## 5. Push notifications (optional next step)

Not wired up in this starter. To add:
1. In Firebase console → Project settings → Cloud Messaging, generate a **Web Push certificate**
   (VAPID key).
2. Add a `firebase-messaging-sw.js` service worker in `client/public/` and call
   `getToken()`/`onMessage()` from the Firebase Messaging SDK in the client.
3. Store each user's FCM token on their `users/{uid}` doc, and send notifications from the backend
   (or a Cloud Function) using the Firebase Admin SDK's `admin.messaging().send(...)`.

## 6. Post-deploy smoke test

- [ ] Sign up with email/password, then with Google
- [ ] Press-and-hold the SOS button — confirm an entry appears under "Recent alerts"
- [ ] Add an emergency contact, tap call/SMS/share-location
- [ ] Open a first-aid guide, tap "Read aloud"
- [ ] Open Maps — confirm nearby hospitals load (Overpass works with zero config)
- [ ] Ask the AI Assistant a sample symptom question (requires `GROQ_API_KEY`/`GEMINI_API_KEY`/`OPENAI_API_KEY` set)
- [ ] Set your own user's Firestore `role` to `admin` and confirm `/admin` loads analytics
