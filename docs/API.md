# Overflow AI — Backend API Reference

Base URL (local dev): `http://localhost:5000/api`

All routes except `GET /alerts` and `GET /health` require an
`Authorization: Bearer <Firebase ID token>` header. The client (`src/services/api.js`)
attaches this automatically from the signed-in Firebase user.

## Health

`GET /health` → `{ status: "ok", service: "overflow-ai-api" }`

## AI Assistant

`POST /ai/assistant`
Rate-limited to 15 requests/minute per IP.

Request body:
```json
{ "message": "I have a bad headache and blurry vision", "history": [ { "role": "user", "content": "..." } ] }
```

Response:
```json
{ "reply": "..." }
```

Requires `GEMINI_API_KEY` or `OPENAI_API_KEY` set on the server; returns `503` if neither is set.

## Places (hospitals / pharmacies / police)

`GET /places/nearby?type=hospital|pharmacy|police&lat=<num>&lng=<num>&radius=<meters>`

Response:
```json
{ "places": [ { "id": "...", "name": "...", "address": "...", "lat": 0, "lng": 0, "distanceKm": 1.2 } ] }
```

Uses Google Places if `GOOGLE_PLACES_API_KEY` is set, otherwise falls back to the free
OpenStreetMap Overpass API automatically — no key required to run this locally.

## Community Alerts (missing persons / blood donation)

`GET /alerts?category=missing_person|blood_donation` — public, no auth required.

`POST /alerts` — requires auth.
```json
{ "title": "...", "description": "...", "location": "...", "contactPhone": "...", "category": "missing_person" }
```

## Admin (requires `role: admin` on the caller's `users/{uid}` doc)

- `GET /admin/analytics` → `{ totalUsers, activeAlerts, sosLast30Days }`
- `GET /admin/hospitals/pending` → list of hospitals with `verificationStatus: "pending"`
- `POST /admin/hospitals/:id/approve`
- `POST /admin/hospitals/:id/reject`

## Error format

All errors return `{ "message": "human readable message" }` with an appropriate HTTP status
(400 validation, 401 unauthenticated, 403 unauthorized, 404, 500 for unexpected errors).
