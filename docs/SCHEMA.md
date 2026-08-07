# SafeReach — Firestore Data Model

SafeReach uses Firestore (NoSQL, document/collection based) rather than a relational schema.
Collections and their document shapes are described below.

## `users/{uid}`
Created automatically on first sign-in (see `AuthContext.jsx`).

| Field | Type | Notes |
|---|---|---|
| `name` | string | Display name |
| `email` | string | |
| `role` | string | `"user"` or `"admin"` |
| `createdAt` | timestamp | |
| `preferences` | map | `{ darkMode, largeText, voiceEnabled }` |

### `users/{uid}/contacts/{contactId}` (subcollection)
| Field | Type |
|---|---|
| `name` | string |
| `phone` | string |
| `relation` | string |
| `createdAt` | timestamp |

### `users/{uid}/recentAlerts/{alertId}` (subcollection)
Log of this user's own SOS presses / location shares, shown on the dashboard
and aggregated (via `collectionGroup('recentAlerts')`) for admin analytics.

| Field | Type |
|---|---|
| `type` | string — `"sos"` \| `"location_share"` |
| `location` | map `{ lat, lng }` or `null` |
| `createdAt` | timestamp |

## `publicAlerts/{alertId}`
Community-visible missing-person and blood-donation posts.

| Field | Type |
|---|---|
| `category` | string — `"missing_person"` \| `"blood_donation"` |
| `title` | string |
| `description` | string |
| `location` | string |
| `contactPhone` | string |
| `status` | string — `"active"` \| `"resolved"` |
| `createdBy` | string (uid) |
| `createdAt` | timestamp |

## `hospitals/{hospitalId}`
Community/partner-submitted hospitals awaiting admin verification. (Distinct
from the live "nearby hospitals" search, which queries Google Places /
OpenStreetMap directly and isn't stored — this collection is for hospitals
the admin team has vetted and wants to badge as "Verified" in-app.)

| Field | Type |
|---|---|
| `name` | string |
| `address` | string |
| `lat`, `lng` | number |
| `phone` | string |
| `verificationStatus` | string — `"pending"` \| `"approved"` \| `"rejected"` |
| `submittedBy` | string (uid) |
| `createdAt` | timestamp |

## Suggested Firestore Security Rules (starting point)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() { return request.auth != null; }
    function isOwner(uid) { return isSignedIn() && request.auth.uid == uid; }
    function isAdmin() {
      return isSignedIn() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /users/{uid} {
      allow read, update: if isOwner(uid) || isAdmin();
      allow create: if isOwner(uid);

      match /contacts/{contactId} {
        allow read, write: if isOwner(uid);
      }
      match /recentAlerts/{alertId} {
        allow read, create: if isOwner(uid);
        allow list: if isAdmin(); // collectionGroup analytics queries
      }
    }

    match /publicAlerts/{alertId} {
      allow read: if true;
      allow create: if isSignedIn();
      allow update, delete: if isAdmin() || request.auth.uid == resource.data.createdBy;
    }

    match /hospitals/{hospitalId} {
      allow read: if true;
      allow create: if isSignedIn();
      allow update, delete: if isAdmin();
    }
  }
}
```

Deploy with `firebase deploy --only firestore:rules` after saving this as `firestore.rules`.
