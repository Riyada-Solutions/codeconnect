# Backend API requirements — CodeConnect mobile app

**Audience:** Backend engineers implementing the API for the **Expo / React Native** app in `artifacts/codeconnect`.

**Current state:** The app UI is driven by **local mock data** (`artifacts/codeconnect/constants/mockData.ts`) and **simulated** auth (timeouts, no HTTP). The shared client package **`@workspace/api-client-react`** is already a dependency and is the intended way the app will call your API (JSON over HTTPS, optional `Authorization: Bearer <token>`).

**Companion:** The minimal Express stub and OpenAPI fragment today live under `artifacts/api-server` and `lib/api-spec/openapi.yaml` (currently only `GET /api/healthz`). This document describes what the **product UI** needs you to add beyond that.

---

## 1. Client integration expectations

| Topic | Requirement |
|--------|-------------|
| **Format** | JSON request/response bodies; UTF-8. |
| **Errors** | Prefer consistent JSON errors (e.g. `title`, `detail` or `message`) so the app’s `ApiError` parsing in `lib/api-client-react` can show readable messages. |
| **Auth** | After login, the app will store a token and register `setAuthTokenGetter` so requests include `Authorization: Bearer <access_token>` unless you agree on cookie-only sessions (mobile usually uses bearer). |
| **Base URL** | The app will call a configurable origin (e.g. `EXPO_PUBLIC_API_URL`) + paths. A common pattern is `/api/...` for all routes (matches current server mount). |
| **Time** | Prefer **ISO 8601** datetimes in JSON; the UI today shows humanized strings like `"2m ago"` — the app can format client-side from your timestamps. |
| **IDs** | String IDs (UUIDs or opaque strings) are fine; keep them stable for deep links like `/alert/[id]`. |

---

## 2. Domain models (derived from the app)

These shapes mirror what screens already display. Field names can be aligned to your DB as long as the app contract is updated in one place (prefer generating OpenAPI + client from your final spec).

### 2.1 User / profile

Used on home, profile, edit profile (plus register).

| Field | Type | Notes |
|--------|------|--------|
| `id` | string | |
| `name` | string | Full name |
| `role` | string | Display only on profile; edit screen treats as read-only |
| `hospital` | string | Org / site name |
| `email` | string | |
| `phone` | string | |
| `department` | string | |
| `employeeId` | string | Shown in mock; confirm if required |
| `initials` | string | Can be derived server-side from name |
| `avatarUrl` | string \| null | Optional; UI has “change photo” placeholder |

### 2.2 Organization / branch (registration)

Register screen collects: **registration code**, **phone**, **full name**, **email**, and shows a fixed **“main branch”** label. Backend should define:

- How **register codes** map to **hospital / branch / tenant**.
- Whether **branch** is selectable from an API list or assigned implicitly.

### 2.3 Emergency code type (catalog)

Static in app today (`artifacts/codeconnect/constants/codes.ts`). Types include at least:

`Code Blue`, `Code Red`, `Code Pink`, `Code Yellow`, `Code Orange`, `Code Green`, `Code Purple` — each with `type` (name), `color` (hex), `icon` key, `description`, optional `tagline`.

**Backend option:** Either treat these as **fixed enums** or expose **`GET /api/code-types`** so the app can sync labels/colors without an app release.

### 2.4 Alert (incident)

List + detail (`alertsList` / alert detail screen).

| Field | Type | Notes |
|--------|------|--------|
| `id` | string | |
| `title` | string | e.g. `"Code Blue: Cardiac Arrest"` |
| `type` | string | Code name, e.g. `"Code Blue"` |
| `color` | string | Hex; could be server-computed from type |
| `location` | string | Short line for cards |
| `status` | `"active"` \| `"pending"` \| `"resolved"` | |
| `responders` | number | Count |
| `timestamp` | string (ISO) or derived | For sorting / “time ago” |
| `building` | string | |
| `floor` | string | |
| `department` | string | |
| `room` | string | |
| `notes` | string \| null | Optional; collected on activate flow |
| `respondersList` | `Responder[]` | See below |

### 2.5 Responder

| Field | Type | Notes |
|--------|------|--------|
| `id` | string | User or participation id |
| `name` | string | |
| `role` | string | |
| `avatar` | string | Initials or URL — UI uses as initials today |
| `respondedAt` | string (ISO) | |

### 2.6 Active request (home “active requests”)

Home uses a lighter card model (`activeRequests`):

| Field | Type | Notes |
|--------|------|--------|
| `id` | string | Should align with alert/incident id for navigation |
| `title` | string | |
| `type` | `"urgent"` \| `"pending"` \| `"transit"` \| `"active"` \| `"resolved"` | Workflow / UI badge |
| `location` | string | |
| `updatedAt` | string (ISO) | |
| `code` | string | Code label, e.g. `"Code Red"` |
| `color` | string | Hex |

You may implement this as the **same** alert resource with different projection, or a separate “request” entity — but **IDs should be consistent** so `router.push(/alert/[id])` works.

### 2.7 Active code strip (optional)

Mock `activeCodes` has: `id`, `type`, `color`, `location`, `responders`, `status`, `timestamp`. If the product needs a compact “active codes” row, expose it or derive from open alerts.

### 2.8 Notification

| Field | Type | Notes |
|--------|------|--------|
| `id` | string | |
| `title` | string | |
| `message` | string | |
| `time` | string (ISO) | |
| `read` | boolean | |
| `type` | `"urgent"` \| `"info"` \| `"success"` | Drives icon/color in UI |

---

## 3. Auth & account flows (UI-implied)

The screens exist; wire them to real endpoints.

| Flow | UI inputs / behavior | Expected backend capabilities |
|------|----------------------|-------------------------------|
| **Login** | `username`, `password` | Validate credentials; return **access** (and refresh if you use it). **Guest** / skip login bypasses API today — decide product policy. |
| **Biometric** | Local OS auth only | After first real login, app may unlock stored token; no extra endpoint unless you require re-validation. |
| **Register** | `registerCode`, `phone`, `fullName`, `email`, branch context | Create user or queue approval; send **OTP**. |
| **Verify OTP (registration)** | 4 digits | **OTP length is 4** in the current UI. |
| **Forgot password** | `email` | Send OTP or magic link; navigate to OTP screen. |
| **OTP (reset)** | 4 digits | Verify then allow new password. |
| **New password (reset)** | `newPassword`, `confirm` | Min length **8** (enforced in UI). |
| **Change password (logged in)** | `currentPassword`, `newPassword`, `confirm` | |
| **Logout** | Clears session client-side | Optional **`POST /auth/logout`** to revoke refresh tokens. |
| **Delete account** | `password` + user types **`DELETE`** to confirm | **Hard delete** or deactivate user; revoke tokens; align with compliance. |

Deliver **clear error codes/messages** for: wrong password, expired OTP, weak password, invalid register code, locked account, etc.

---

## 4. Core operations (suggested REST surface)

Path prefix assumed: **`/api`**. Adjust names to your style; keep a single published OpenAPI file the app can regenerate from.

### 4.1 Auth

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/auth/login` | Body: `username`, `password` → tokens + user profile |
| `POST` | `/api/auth/register` | Body: register code, phone, name, email, branch/org ids as you define |
| `POST` | `/api/auth/verify-otp` | Body: `purpose` (register \| reset), `phone` or `email`, `code` |
| `POST` | `/api/auth/resend-otp` | Same context identifiers |
| `POST` | `/api/auth/forgot-password` | Body: `email` |
| `POST` | `/api/auth/reset-password` | Body: reset token or OTP proof + `newPassword` |
| `POST` | `/api/auth/change-password` | Auth required: `currentPassword`, `newPassword` |
| `POST` | `/api/auth/delete-account` | Auth required: `password`, `confirmation` (`"DELETE"`) |

### 4.2 User / profile

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/me` | Current user profile |
| `PATCH` | `/api/me` | Updatable: name, email, phone, department; role/hospital per your rules |
| `POST` | `/api/me/avatar` | Multipart upload if you support photos |

### 4.3 Alerts / incidents

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/alerts` | List with filters: `status`, `type`, pagination |
| `GET` | `/api/alerts/:id` | Detail including `respondersList` |
| `POST` | `/api/alerts` | **Activate emergency:** code type, `building`, `floor`, `department`, `room`, optional `notes` — matches `emergency/new` form |
| `POST` | `/api/alerts/:id/respond` | Maps to “Respond” on detail |
| `POST` | `/api/alerts/:id/escalate` | Maps to “Escalate” |
| `POST` | `/api/alerts/:id/accept` / `decline` | Incoming alert screen (currently local) if you persist assignments |

### 4.4 Dashboard / home

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/home/active-requests` | List matching **ActiveRequest** shape (or reuse `/api/alerts` with query) |

### 4.5 Notifications

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/notifications` | Paginated list |
| `PATCH` | `/api/notifications/:id/read` | Mark read |
| `POST` | `/api/notifications/read-all` | Optional |

### 4.6 Reference data (optional)

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/locations/buildings` | If pickers become dynamic (today partially hardcoded on `emergency/new`) |
| `GET` | `/api/locations/floors` | Query by building |
| `GET` | `/api/locations/departments` | Query by building/floor |

---

## 5. Real-time & push (recommended)

- **Incoming alerts** and **notification bell** imply **push notifications** (FCM / APNs) and/or **WebSocket / SSE** for active incidents.
- Specify whether alert **accept/reject** must be persisted and broadcast to other responders.

---

## 6. Open decisions for backend + product

1. **Multi-tenancy:** One hospital vs many; how `registerCode` and `hospital` relate.
2. **Username vs email** for login (UI label is “username”).
3. **Guest mode:** Whether anonymous users can exist server-side or only client-side demo.
4. **RBAC:** Who can **activate** codes, **escalate**, **resolve**, view **PII**.
5. **Audit trail:** Medical/emergency apps often need immutable event logs.
6. **Pagination** defaults for lists (alerts, notifications).

---

## 7. Where this was inferred from (for your reference)

| Area | Code reference |
|------|----------------|
| Mock entities | `artifacts/codeconnect/constants/mockData.ts` |
| Code catalog | `artifacts/codeconnect/constants/codes.ts` |
| Activate alert form | `artifacts/codeconnect/app/emergency/new.tsx` |
| Alert detail | `artifacts/codeconnect/app/alert/[id].tsx` |
| Auth screens | `artifacts/codeconnect/app/(auth)/*.tsx` |
| Profile / edit | `artifacts/codeconnect/app/(tabs)/profile.tsx`, `edit-profile.tsx` |
| HTTP client behavior | `lib/api-client-react/src/custom-fetch.ts` |

Once your OpenAPI spec is stable, add it to `lib/api-spec/openapi.yaml` (or replace with your generated spec) and regenerate `lib/api-zod` and `lib/api-client-react` so the mobile team can remove mocks and call real endpoints.
