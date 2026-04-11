# CodeConnect — Backend API Requirements

**Audience:** Backend engineer building the API for the CodeConnect mobile app (Expo / React Native).

**Purpose:** The mobile app is fully built and running on mock data. This document defines every endpoint the app expects. Wire these up and the app will work with zero frontend changes.

---

## Base URL & Transport

- All routes are prefixed with `/api`
- HTTPS only in production
- The app sets base URL via env var `EXPO_PUBLIC_API_URL` (e.g. `https://api.codeconnect.com`)
- Full example: `https://api.codeconnect.com/api/auth/login`

---

## Auth

All protected endpoints require:
```
Authorization: Bearer <access_token>
```

Token is stored on device and attached automatically to every request.

---

## Error format

Return consistent JSON errors so the app can display readable messages:

```json
{
  "message": "Invalid credentials"
}
```

---

## Endpoints

---

### Auth

#### `POST /api/auth/login`

```json
// Request body
{
  "username": "string",
  "password": "string"
}

// Response 200
{
  "accessToken": "string",
  "user": {
    "id": "string",
    "name": "string",
    "role": "string",
    "hospital": "string",
    "email": "string",
    "phone": "string",
    "department": "string",
    "employeeId": "string",
    "initials": "string",        // optional — can derive from name
    "avatarUrl": "string | null" // optional
  }
}
```

---

#### `POST /api/auth/register`

```json
// Request body
{
  "registerCode": "string",   // maps new user to hospital/branch
  "phone": "string",
  "fullName": "string",
  "email": "string"
}

// Response 200
// Empty body or { "message": "OTP sent" }
// After this, the app navigates to OTP screen with purpose = "register"
```

---

#### `POST /api/auth/verify-otp`

```json
// Request body
{
  "purpose": "register" | "reset_password",
  "identifier": "string",   // phone or email used in the previous step
  "otp": "string"           // 4 digits — OTP UI has exactly 4 boxes
}

// Response 200 for purpose = "register"
{}

// Response 200 for purpose = "reset_password"
{
  "resetToken": "string"   // used in reset-password step
}
```

---

#### `POST /api/auth/resend-otp`

```json
// Request body
{
  "purpose": "register" | "reset_password",
  "identifier": "string"
}

// Response 200
// Empty or { "message": "OTP resent" }
```

---

#### `POST /api/auth/forgot-password`

```json
// Request body
{
  "email": "string"
}

// Response 200
// Empty or { "message": "OTP sent" }
// App navigates to OTP screen with purpose = "reset_password"
```

---

#### `POST /api/auth/reset-password`

```json
// Request body
{
  "resetToken": "string",   // received from verify-otp
  "newPassword": "string"   // minimum 8 characters (enforced in UI)
}

// Response 200
{}
```

---

#### `POST /api/auth/change-password`
🔒 Requires auth token

```json
// Request body
{
  "currentPassword": "string",
  "newPassword": "string"   // minimum 8 characters
}

// Response 200
{}
```

---

#### `POST /api/auth/logout`
🔒 Requires auth token

```json
// No body

// Response 200
{}
// Revoke refresh token on server side
```

---

#### `POST /api/auth/delete-account`
🔒 Requires auth token

```json
// Request body
{
  "password": "string",
  "confirmation": "DELETE"   // the user types this literally to confirm
}

// Response 200
{}
// Hard delete or deactivate user; revoke all tokens
```

---

### User / Profile

#### `GET /api/me`
🔒 Requires auth token

```json
// Response 200
{
  "id": "string",
  "name": "string",
  "role": "string",
  "hospital": "string",
  "email": "string",
  "phone": "string",
  "department": "string",
  "employeeId": "string",
  "initials": "string",        // optional
  "avatarUrl": "string | null" // optional
}
```

---

#### `PATCH /api/me`
🔒 Requires auth token

```json
// Request body (all fields optional — only send what changed)
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "department": "string"
}

// Response 200 — updated User object (same shape as GET /me)
```

---

#### `POST /api/me/device-token`
🔒 Requires auth token

```json
// Request body
{
  "token": "string",      // FCM or APNs push token
  "platform": "ios" | "android"
}

// Response 200
{}
```

---

### Alerts / Incidents

#### `GET /api/alerts`
🔒 Requires auth token

```json
// Query params (all optional)
// ?status=active|pending|resolved
// ?type=Code+Blue   (filter by code type)

// Response 200
{
  "data": [
    {
      "id": "string",
      "title": "string",        // e.g. "Code Blue: Cardiac Arrest"
      "type": "string",         // e.g. "Code Blue"
      "color": "string",        // hex e.g. "#3b82f6"
      "location": "string",     // short display string e.g. "ICU - Room 6"
      "status": "active" | "pending" | "resolved",
      "responders": 0,          // count
      "timestamp": "string",    // ISO 8601 datetime
      "building": "string",
      "floor": "string",
      "department": "string",
      "room": "string",
      "notes": "string | null"
    }
  ]
}
```

---

#### `GET /api/alerts/:id`
🔒 Requires auth token

```json
// Response 200 — Alert + respondersList
{
  "id": "string",
  "title": "string",
  "type": "string",
  "color": "string",
  "location": "string",
  "status": "active" | "pending" | "resolved",
  "responders": 0,
  "timestamp": "string",   // ISO 8601
  "building": "string",
  "floor": "string",
  "department": "string",
  "room": "string",
  "notes": "string | null",
  "respondersList": [
    {
      "id": "string",
      "name": "string",
      "role": "string",
      "avatar": "string",       // initials e.g. "AH" or image URL
      "respondedAt": "string"   // ISO 8601
    }
  ]
}
```

---

#### `POST /api/alerts`
🔒 Requires auth token — **Activate emergency**

```json
// Request body
{
  "type": "string",         // code name e.g. "Code Blue"
  "building": "string",
  "floor": "string",
  "department": "string",
  "room": "string",
  "notes": "string"         // optional
}

// Response 201 — created Alert object (same shape as GET /api/alerts item, no respondersList needed)
```

---

#### `POST /api/alerts/:id/respond`
🔒 Requires auth token

```json
// No body

// Response 200
{}
// Marks the current user as a responder; adds them to respondersList
```

---

#### `POST /api/alerts/:id/escalate`
🔒 Requires auth token

```json
// Request body (optional)
{
  "reason": "string"
}

// Response 200
{}
```

---

### Home

#### `GET /api/home/active-requests`
🔒 Requires auth token

```json
// Response 200
{
  "data": [
    {
      "id": "string",       // must match an alert id — app navigates to /alert/:id on tap
      "title": "string",
      "type": "urgent" | "pending" | "transit" | "active" | "resolved",
      "location": "string",
      "updatedAt": "string",   // ISO 8601
      "code": "string",        // code label e.g. "Code Red"
      "color": "string"        // hex
    }
  ]
}
```

---

### Notifications

#### `GET /api/notifications`
🔒 Requires auth token

```json
// Response 200
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "message": "string",
      "time": "string",    // ISO 8601
      "read": false,
      "type": "urgent" | "info" | "success"
    }
  ]
}
```

---

#### `PATCH /api/notifications/:id/read`
🔒 Requires auth token

```json
// No body

// Response 200
{}
```

---

#### `POST /api/notifications/read-all`
🔒 Requires auth token

```json
// No body

// Response 200
{}
```

---

## Push Notifications (FCM / APNs)

The app registers a device push token on login via `POST /api/me/device-token`.

Notification payload the app expects:

```json
{
  "id": "string",
  "type": "general" | "emergency_alert" | "code_activated" | "responder_assigned" | "alert_resolved",
  "data": {
    "alertId": "string"   // optional — for deep linking to /alert/:id
  }
}
```

Trigger push notifications on:
- New alert created → all users in the hospital
- Responder joins an alert → alert creator + other responders
- Alert resolved → all responders

---

## Open Decisions to Confirm

| # | Question |
|---|----------|
| 1 | **Multi-tenancy** — how does `registerCode` map to hospital/branch? One code per hospital or per branch? |
| 2 | **Login field** — UI label says "Username" — is it username, email, or phone? |
| 3 | **Role assignment** — assigned during registration by register code, or admin sets it separately? |
| 4 | **Alert color** — computed server-side from `type` (recommended) or sent by mobile? |
| 5 | **Pagination** — add `?page=` and `?limit=` to list endpoints when ready |
| 6 | **Refresh token** — does `/api/auth/login` return a refresh token alongside `accessToken`? App stores only `accessToken` today. |
| 7 | **RBAC** — who can activate codes, escalate, resolve? All authenticated users or specific roles? |

---

## How the app switches from mock → real API

Set in `.env`:
```
EXPO_PUBLIC_API_URL=https://api.codeconnect.com
EXPO_PUBLIC_USE_MOCK_DATA=false
```

All repositories (`data/auth_repository.ts`, `data/alert_repository.ts`, etc.) check `ENV.USE_MOCK_DATA` and fall through to real API calls when it is `false`. No code changes needed.
