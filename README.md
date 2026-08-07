# SafeReach 🚨

Instant emergency assistance — SOS alerts, nearby hospitals & police, one-tap emergency contacts,
an offline first-aid library, and an AI symptom assistant, in a fast, installable, mobile-first PWA.

> ⚠️ **SafeReach is a demo/starter application.** The AI assistant and first-aid content are for
> general information only and are not a substitute for professional medical advice or emergency
> services. Always call your local emergency number in a life-threatening situation.

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite, Tailwind CSS, React Router, Leaflet / react-leaflet |
| Auth & DB | Firebase Authentication (email/password + Google), Firestore |
| Backend | Node.js + Express |
| AI | Google Gemini (default) or OpenAI, via a small backend proxy |
| Maps data | OpenStreetMap Overpass API (free, default) or Google Places (optional, better data) |
| Offline | `vite-plugin-pwa` (Workbox) — installable PWA with offline caching |

## Project structure

```
safereach/
├── client/                  React + Vite frontend
│   ├── src/
│   │   ├── components/      Reusable UI (SOSButton, MapView, ContactCard, ...)
│   │   ├── contexts/        AuthContext, ThemeContext
│   │   ├── hooks/           useGeolocation, useOffline, useSpeech
│   │   ├── pages/           Dashboard, AIAssistant, Contacts, FirstAid, Maps, Admin, ...
│   │   ├── data/            Static first-aid guide content
│   │   ├── services/        api.js (backend calls), firestoreService.js (direct Firestore)
│   │   └── firebase.js      Firebase client SDK init
│   └── vite.config.js       Includes PWA / offline-cache config
├── server/                  Express backend
│   └── src/
│       ├── routes/          ai.js, places.js, alerts.js, admin.js
│       ├── controllers/     Route handler logic
│       ├── middleware/      Firebase ID-token auth, admin-role check, error handler
│       └── config/          Firebase Admin SDK init
└── docs/
    ├── SCHEMA.md            Firestore data model + suggested security rules
    └── API.md               Backend REST API reference
```

## Features implemented

- **Auth**: email/password sign up & login, Google sign-in (Firebase Auth)
- **Dashboard**: press-and-hold SOS button (logs alert + location to Firestore), nearby hospitals
  preview, flashlight, loud alarm, voice-command shortcut, recent alerts feed
- **AI Assistant**: chat UI → backend → Gemini/OpenAI, with a medical-disclaimer system prompt that
  asks for possible causes, first-aid steps, and urgent-care guidance
- **Emergency Contacts**: add/edit/delete (Firestore), one-tap call (`tel:`) and SMS (`sms:`), share
  live location via the Web Share API (falls back to a pre-filled SMS link)
- **First Aid Library**: 7 guides (burns, bleeding, CPR, fractures, poisoning, choking, snake bites)
  with steps + "seek help if" criteria, text-to-speech read-aloud, cached for offline use
- **Maps**: Leaflet map centered on the user, nearby hospitals/pharmacies/police via the backend
  places proxy, directions links
- **Offline mode**: PWA service worker caches the app shell, first-aid guides, and last-fetched
  places results; Firestore's own offline persistence caches contacts once loaded
- **Admin panel**: user/alert/SOS analytics, hospital-verification approve/reject queue
- **Accessibility**: voice commands (Web Speech API), text-to-speech, large-text mode, dark mode,
  visible focus rings, `prefers-reduced-motion` respected
- **Extra**: emergency flashlight (torch API with screen-flash fallback), loud siren (Web Audio API),
  missing-person alerts, blood-donation requests (both as community-posted Firestore records)

**Push notifications** are not wired end-to-end in this starter (it needs a live Firebase project
+ VAPID key + a deployed backend to send them) — see `DEPLOYMENT.md` for how to add Firebase Cloud
Messaging on top of this structure.

## Local setup

### 1. Firebase project
1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Authentication** → Email/Password and Google sign-in methods.
3. Create a **Firestore** database (start in production mode, then deploy the rules in
   `docs/SCHEMA.md`).
4. Add a Web App to the project and copy the config into `client/.env` (see `.env.example`).
5. Generate a **service account key** (Project settings → Service accounts → Generate new private
   key), save it as `server/serviceAccountKey.json` (already git-ignored).

### 2. Backend
```bash
cd server
cp .env.example .env       # fill in GEMINI_API_KEY (or OPENAI_API_KEY), etc.
npm install
npm run dev                 # http://localhost:5000
```

### 3. Frontend
```bash
cd client
cp .env.example .env        # fill in your Firebase web config
npm install
npm run dev                 # http://localhost:5173
```

### 4. Make yourself an admin
After signing up once, open Firestore console → `users/{your-uid}` → set `role` to `"admin"`.
The **Admin** nav link will then appear.

### Running without any API keys
- The AI Assistant will respond with a friendly "not configured" message until you set
  `GEMINI_API_KEY` or `OPENAI_API_KEY`.
- Nearby places (hospitals/pharmacies/police) work out of the box with no key at all, via the
  free OpenStreetMap Overpass API. Set `GOOGLE_PLACES_API_KEY` for richer/more current data.

## Build for production

```bash
cd client && npm run build   # outputs client/dist — installable PWA
cd server && npm start
```

See `DEPLOYMENT.md` for hosting recommendations.
