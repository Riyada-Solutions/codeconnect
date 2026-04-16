# CodeConnect — Backend API Requirements

**Audience:** Backend engineer implementing or updating API endpoints.
**Base URL:** `https://code.careconnectksa.com/api`
**Auth:** All protected routes require `Authorization: Bearer <token>` (Laravel Sanctum).

**Standard response envelope** (all endpoints must follow this):
```json
{ "status": true, "message": "Success", "data": <payload> }
```

**Error envelope:**
```json
{ "status": false, "message": "Error description", "errors": { "field": ["validation message"] } }
```

---

## Table of Contents

1. [Auth](#1-auth)
2. [Biometric Auth](#2-biometric-auth)
3. [Profile](#3-profile)
4. [Home](#4-home)
5. [Alerts (Mobile)](#5-alerts-mobile)
6. [Cases (Admin)](#6-cases-admin)
7. [Emergency Codes](#7-emergency-codes)
8. [Notifications](#8-notifications)
9. [Settings — Code Types](#9-settings--code-types)
10. [Settings — Locations](#10-settings--locations)
11. [Settings — Security](#11-settings--security)
12. [Settings — Notifications](#12-settings--notifications)
13. [Static Content](#13-static-content)
14. [Users](#14-users)
15. [Roles & Permissions](#15-roles--permissions)
16. [Branches](#16-branches)
17. [Reports](#17-reports)
18. [CBAHI Compliance](#18-cbahi-compliance)
19. [Summary Table](#19-summary-table)

---

## 1. Auth

### POST /auth/login
No auth header required. Throttle: 5 req/min.

**Request:**
```json
{ "username": "admin@codeconnect.sa", "password": "password" }
```

**Response:**
```json
{
  "status": true,
  "message": "Login successful",
  "data": {
    "accessToken": "6|abc123...",
    "user": {
      "id": "1",
      "name": "Admin User",
      "role": "Admin",
      "hospital": null,
      "email": "admin@codeconnect.sa",
      "phone": null,
      "department": null,
      "employeeId": "1",
      "initials": "AU",
      "avatarUrl": null
    }
  }
}
```

---

### POST /auth/register
No auth. Sends OTP to phone after registration.

**Request:**
```json
{
  "registerCode": "MC-ABCD-1234",
  "phone": "+966500000000",
  "fullName": "John Doe",
  "email": "john@example.com"
}
```

---

### POST /auth/verify-otp
No auth. Throttle: 10 req/min.

**Request:**
```json
{
  "purpose": "register",
  "identifier": "+966500000000",
  "otp": "1234"
}
```
`purpose`: `register` | `reset_password`. `otp`: 4-digit string.

---

### POST /auth/resend-otp
No auth. Throttle: 3 req/min.

**Request:**
```json
{ "purpose": "register", "identifier": "+966500000000" }
```

---

### POST /auth/forgot-password
No auth. Throttle: 3 req/min.

**Request:**
```json
{ "email": "admin@codeconnect.sa" }
```

---

### POST /auth/reset-password
No auth. Throttle: 5 req/min.

**Request:**
```json
{
  "email": "admin@codeconnect.sa",
  "resetToken": "your-reset-token-here",
  "newPassword": "NewPassword123"
}
```

---

### POST /auth/logout
Auth required.

---

### POST /auth/change-password
Auth required.

**Request:**
```json
{ "currentPassword": "password", "newPassword": "NewPassword123" }
```

---

### POST /auth/delete-account
Auth required.

**Request:**
```json
{ "password": "password", "confirmation": "DELETE" }
```

---

### GET /auth/session
Auth required. Returns the current authenticated user object (same shape as login `data.user`).

---

### POST /auth/heartbeat
Auth required. Keeps session alive / updates last-seen timestamp. Returns `data: null`.

---

## 2. Biometric Auth

### POST /auth/biometric/register
Auth required. Called once after password login when user enables Face ID / fingerprint.

**Request:**
```json
{
  "device_id": "unique-device-uuid",
  "biometric_token": "randomly-generated-256bit-hex-string-at-least-32-chars-long"
}
```

> App generates `biometric_token` locally (random secure bytes) and stores it in the device's
> secure keychain (only accessible after biometric auth). Backend stores
> `(user_id, device_id, hashed_biometric_token)`.

**Response:**
```json
{ "status": true, "message": "Biometric login enabled", "data": null }
```

---

### POST /auth/biometric/login
No auth header — this IS the login. Throttle: 10 req/min.

**Request:**
```json
{
  "device_id": "unique-device-uuid",
  "biometric_token": "randomly-generated-256bit-hex-string-at-least-32-chars-long"
}
```

> Backend looks up the token hash by `device_id`, verifies it, issues a new access token.

**Success response:** Same shape as `POST /auth/login`.

**Failure (invalid token):** HTTP 401, `{ "status": false, "message": "Biometric authentication failed", "errors": null }`.

---

### DELETE /auth/biometric/revoke
Auth required.

**Request:**
```json
{ "device_id": "unique-device-uuid" }
```

**Response:**
```json
{ "status": true, "message": "Biometric login disabled", "data": null }
```

---

## 3. Profile

### GET /me
Auth required. Returns the current user's full profile.

---

### PATCH /me
Auth required.

**Request (all fields optional):**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+966500000001",
  "department": "ICU"
}
```

---

### POST /me/device-token
Auth required. Stores FCM push notification token.

**Request:**
```json
{ "token": "fcm-device-token-here", "platform": "android" }
```
`platform`: `ios` | `android`

---

## 4. Home

### GET /home
Auth required. **Preferred — single call** returning all home screen data.

**Response:**
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "activeRequests": [
      {
        "id": "1",
        "title": "Code Blue",
        "type": "active",
        "location": "ICU – Room 6",
        "updatedAt": "2026-04-15T10:30:00Z",
        "code": "Code Blue",
        "color": "#3B82F6"
      }
    ],
    "codeTypes": [
      {
        "id": 1,
        "name": "Code Blue",
        "color": "#3B82F6",
        "description": "Medical emergency – cardiac/respiratory arrest"
      }
    ],
    "unreadNotificationCount": 8
  }
}
```

---

### GET /home/active-requests
Auth required. Returns only active emergency requests (standalone endpoint).

**Response:**
```json
{
  "status": true,
  "message": "Success",
  "data": [ { "id": "1", "title": "Code Blue", ... } ]
}
```

---

## 5. Alerts (Mobile)

### GET /alerts
Auth required.

**Query params (all optional):**
- `status`: `active` | `resolved`
- `type`: code type name (e.g. `"Code Blue"`)

---

### POST /alerts
Auth required. Creates an alert and fires FCM push to assigned users.

**Request — ID-based (preferred):**
```json
{
  "code_type_id": 1,
  "building_id": 1,
  "floor_id": 3,
  "department_id": 5,
  "room_id": 12,
  "notes": "Cardiac arrest"
}
```

**Request — String-based (legacy, keep for backward compat):**
```json
{
  "type": "Code Blue",
  "building": "Main Building",
  "floor": "3rd Floor",
  "department": "ICU",
  "room": "Room 6",
  "notes": "Cardiac arrest"
}
```

> Accept both shapes. Prefer `code_type_id` when present.

**Response:**
```json
{
  "status": true,
  "message": "Alert created successfully",
  "data": {
    "id": "42",
    "title": "Code Blue",
    "type": "Code Blue",
    "color": "#3B82F6",
    "location": "Main Building – 3rd Floor – ICU – Room 6",
    "status": "active",
    "responders": 0,
    "timestamp": "2026-04-15T10:30:00Z",
    "building": "Main Building",
    "floor": "3rd Floor",
    "department": "ICU",
    "room": "Room 6",
    "notes": "Cardiac arrest"
  }
}
```

**FCM push payload to send after creation:**
```json
{
  "notification": { "title": "🚨 Code Blue Activated", "body": "Main Building – 3rd Floor – ICU – Room 6" },
  "data": {
    "type": "emergency",
    "alert_id": "42",
    "code_type": "Code Blue",
    "code_color": "#3B82F6",
    "location": "Main Building – 3rd Floor – ICU – Room 6",
    "notes": "Cardiac arrest",
    "click_action": "FLUTTER_NOTIFICATION_CLICK"
  }
}
```
> Also save a `notifications` record for each recipient so it appears in their notification list.

---

### GET /alerts/{id}
Auth required.

---

### POST /alerts/{id}/respond
Auth required. Marks the authenticated user as a responder.

---

### POST /alerts/{id}/escalate
Auth required.

**Request:**
```json
{ "reason": "No response after 5 minutes" }
```

---

## 6. Cases (Admin)

### GET /cases
Auth required.

**Query params (all optional):**
`status`, `type`, `branch_id`, `department`, `date_from` (YYYY-MM-DD), `date_to`, `search`, `activated_by`, `per_page` (default 15)

---

### POST /cases
Auth required.

**Request:**
```json
{
  "type": "Code Blue",
  "building": "Main Building",
  "floor": "3rd Floor",
  "department": "ICU",
  "room": "Room 6",
  "notes": "Cardiac arrest",
  "branch_id": 1
}
```

---

### GET /cases/{id}
Auth required.

---

### PUT /cases/{id}
Auth required.

**Request (fields optional):**
```json
{ "notes": "Updated notes", "status": "Active" }
```

---

### POST /cases/{id}/timeline
Auth required. Advances the case timeline to the next step.

**Request:**
```json
{ "step": "Accepted", "time": "14:30" }
```
`step`: `Activated` | `Accepted` | `On the way` | `Arrived` | `Completed`

---

### POST /cases/{id}/team
Auth required. Adds a team member to the case.

**Request:**
```json
{ "user_id": 1, "role": "Lead Physician", "status": "Accepted" }
```
`status`: `Accepted` | `On the way` | `Arrived`

---

### PUT /cases/{id}/team/{memberId}
Auth required.

**Request:**
```json
{ "status": "Arrived" }
```

---

### DELETE /cases/{id}/team/{memberId}
Auth required.

---

### POST /cases/{id}/close
Auth required.

**Request:**
```json
{ "completion_notes": "Patient stabilized", "completion_time": "15:45" }
```

---

### GET /cases/export
Auth required. Returns exportable case data (CSV/Excel).

---

## 7. Emergency Codes

### GET /emergency-codes
Auth required. Returns all configured emergency code types.

---

### PUT /emergency-codes/{id}
Auth required.

**Request:**
```json
{
  "name": "Code Blue",
  "color": "#3B82F6",
  "description": "Medical emergency",
  "assigned_users": [1, 2, 3],
  "escalation": {
    "timeout_minutes": 5,
    "escalation_team": [4, 5]
  }
}
```

---

### POST /emergency-codes/{id}/activate
Auth required.

**Request:**
```json
{
  "location": "Main Building - 3rd Floor - ICU",
  "branch_id": 1,
  "notes": "Cardiac arrest in Room 6"
}
```

---

### POST /emergency-codes/{id}/deactivate
Auth required.

---

### GET /emergency-codes/schedules
Auth required. Returns on-call schedules for all assigned users.

---

### PUT /emergency-codes/schedules/{id}
Auth required. Updates a user's schedule for an emergency code.

**Request:**
```json
{
  "emergency_code_id": 1,
  "shift": "Morning",
  "on_duty": true,
  "override_alert": false,
  "always_alert": false
}
```
`shift`: `Morning` | `Afternoon` | `Night`

---

## 8. Notifications

### GET /notifications
Auth required.

**Query params (optional):**
- `unread_only`: `true`
- `type`: `emergency` | `info` | `warning` | `success`

**Response:**
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "unreadCount": 3,
    "notifications": [
      {
        "id": 1,
        "title": "Code Blue Activated",
        "message": "ICU – Room 6",
        "timestamp": "2026-04-15T10:30:00Z",
        "read": false,
        "type": "emergency",
        "code_type": "Code Blue",
        "code_color": "#3B82F6",
        "location": "ICU – Room 6",
        "activated_by": "Dr. Smith"
      }
    ]
  }
}
```

---

### PUT /notifications/{id}/read
Auth required.

---

### POST /notifications/read-all
Auth required. Marks all notifications as read.

---

### DELETE /notifications
Auth required. Clears all notifications for the authenticated user.

---

## 9. Settings — Code Types

### GET /settings/code-types
Auth required.

---

### POST /settings/code-types
Auth required.

**Request:**
```json
{ "name": "Code Green", "color": "#22C55E", "description": "Evacuation" }
```

---

### GET /settings/code-types/{id}
Auth required.

---

### PUT /settings/code-types/{id}
Auth required.

**Request:**
```json
{ "name": "Code Green Updated", "color": "#16A34A", "description": "Evacuation emergency updated" }
```

---

### DELETE /settings/code-types/{id}
Auth required.

---

## 10. Settings — Locations

### GET /settings/locations/buildings
Auth required. Returns distinct building names with stable IDs (for dropdown cascade).

**Response:**
```json
{ "status": true, "message": "Success", "data": [{ "id": 1, "name": "Main Building" }] }
```

---

### GET /settings/locations/floors?building_id={id}
Auth required. Returns distinct floors for the given building.

**Response:**
```json
{ "status": true, "message": "Success", "data": [{ "id": 3, "name": "3rd Floor" }] }
```

---

### GET /settings/locations/departments?building_id={id}&floor_id={id}
Auth required. Returns distinct departments for the given building + floor.

---

### GET /settings/locations/rooms?building_id={id}&floor_id={id}&department_id={id}
Auth required. Returns rooms for the given building + floor + department.

---

### GET /settings/locations
Auth required. Paginated full location list.

**Query params (optional):** `building`, `floor`, `department`, `per_page`

---

### POST /settings/locations
Auth required.

**Request:**
```json
{ "building": "Main Building", "floor": "3rd Floor", "department": "ICU", "room": "Room 6" }
```

---

### GET /settings/locations/{id}
Auth required.

---

### PUT /settings/locations/{id}
Auth required.

**Request:**
```json
{ "building": "West Wing", "floor": "2nd Floor", "department": "Radiology", "room": "Room 10" }
```

---

### DELETE /settings/locations/{id}
Auth required.

---

## 11. Settings — Security

### GET /settings/security
Auth required.

---

### PUT /settings/security
Auth required.

**Request:**
```json
{
  "session_timeout_minutes": 30,
  "max_failed_attempts": 5,
  "password_expiration_days": 90,
  "password_min_length": 8,
  "require_uppercase": true,
  "require_lowercase": true,
  "require_number": true,
  "require_special_char": false,
  "password_history_count": 3,
  "enable_recaptcha": false
}
```

---

## 12. Settings — Notifications

### GET /settings/notifications
Auth required.

---

### PUT /settings/notifications
Auth required.

**Request:**
```json
{
  "email_notifications": true,
  "sms_notifications": false,
  "push_notifications": true,
  "sound_alerts": true,
  "quiet_hours_start": "22:00",
  "quiet_hours_end": "07:00"
}
```

---

## 13. Static Content

> All three endpoints currently return HTTP 500. They must return valid JSON.

### GET /about
Auth required.

**Response:**
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "appName": "CodeConnect",
    "version": "1.0.0",
    "buildNumber": "100",
    "companyName": "CareConnect KSA",
    "companyWebsite": "https://careconnectksa.com",
    "supportEmail": "support@careconnectksa.com",
    "supportPhone": "+966500000000",
    "description": "CodeConnect is a hospital emergency response system."
  }
}
```

---

### GET /terms
Auth required.

**Response:**
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "title": "Terms of Service",
    "lastUpdated": "2025-01-01",
    "content": "<h2>1. Acceptance of Terms</h2><p>...</p>"
  }
}
```
> `content`: HTML string. The app renders it in a WebView.

---

### GET /privacy
Auth required.

**Response:**
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "title": "Privacy Policy",
    "lastUpdated": "2025-01-01",
    "content": "<h2>1. Information We Collect</h2><p>...</p>"
  }
}
```

---

## 14. Users

### GET /users
Auth required.

**Query params (optional):** `search`, `role`, `department`, `status` (`Active`|`Inactive`), `branch_id`, `per_page`

---

### POST /users
Auth required.

**Request:**
```json
{
  "title": "Dr.",
  "first_name_en": "John",
  "last_name_en": "Doe",
  "first_name_ar": null,
  "last_name_ar": null,
  "role_id": 1,
  "department": "ICU",
  "speciality": "Cardiology",
  "email": "john.doe@hospital.com",
  "phone": "+966500000001",
  "branches": [1],
  "status": "Active",
  "mobile_login": true,
  "password": "Password123"
}
```

---

### GET /users/{id}
Auth required.

---

### PUT /users/{id}
Auth required.

**Request (fields optional):**
```json
{ "first_name_en": "Jane", "last_name_en": "Doe", "department": "Emergency", "status": "Active" }
```

---

### DELETE /users/{id}
Auth required.

---

### POST /users/{id}/unlock
Auth required. Unlocks a locked-out user account.

---

### POST /users/{id}/generate-mobile-code
Auth required. Generates a new mobile registration code for the user.

---

### POST /users/{id}/avatar
Auth required. Multipart form upload.

**Form field:** `file` — accepts jpg, jpeg, png, webp. Max 5 MB.

---

### GET /users/export
Auth required. Returns users as downloadable CSV/Excel.

---

### GET /users/template
Auth required. Returns a CSV import template.

---

### POST /users/import
Auth required. Multipart form upload.

**Form field:** `file` — CSV. Max 10 MB.

---

## 15. Roles & Permissions

### GET /roles
Auth required.

---

### POST /roles
Auth required.

**Request:**
```json
{ "name": "Nurse", "slug": "nurse", "description": "Nursing staff role", "permission_ids": [1, 2, 3] }
```

---

### GET /roles/{id}
Auth required.

---

### PUT /roles/{id}
Auth required.

**Request:**
```json
{ "name": "Senior Nurse", "description": "Senior nursing staff", "permission_ids": [1, 2, 3, 4, 5] }
```

---

### DELETE /roles/{id}
Auth required.

---

### GET /permissions
Auth required. Returns all available permissions.

---

## 16. Branches

### GET /branches
Auth required.

---

### POST /branches
Auth required.

**Request:**
```json
{ "name": "Main Hospital", "address": "123 Hospital St, Riyadh", "phone": "+966501234567", "is_main": true }
```

---

### GET /branches/{id}
Auth required.

---

### PUT /branches/{id}
Auth required.

**Request:**
```json
{ "name": "Main Hospital Updated", "address": "456 New St, Riyadh" }
```

---

### DELETE /branches/{id}
Auth required.

---

## 17. Reports

### GET /reports/dashboard
Auth required.

**Query params (optional):** `branch_id`, `date_from`, `date_to`

**Response data fields:** total cases, active cases, resolved cases, avg response time, top code types, top departments.

---

### GET /reports/cases-over-time
Auth required.

**Query params (optional):** `branch_id`, `date_from`, `date_to`, `group_by` (`day`|`week`|`month`)

---

### GET /reports/cases-by-type
Auth required.

---

### GET /reports/response-times
Auth required.

---

### GET /reports/case-history
Auth required.

**Query params (optional):** `page`, `per_page`, `code_type`, `department`, `user`, `status`, `date_from`, `date_to`, `branch_id`

---

### GET /reports/export
Auth required.

**Query params:** `format` (`excel`|`pdf`), plus same filters as case-history.

---

## 18. CBAHI Compliance

### GET /cbahi/standards
Auth required.

---

### PUT /cbahi/standards/{id}
Auth required.

**Request:**
```json
{ "status": "Compliant", "notes": "All requirements met" }
```
`status`: `Compliant` | `Partial` | `Non-Compliant`

---

### POST /cbahi/standards/{id}/evidence
Auth required. Multipart form upload.

**Form field:** `file` — accepts pdf, jpg, jpeg, png, doc, docx. Max 10 MB.

---

### GET /cbahi/standards/{id}/evidence
Auth required.

---

### DELETE /cbahi/standards/{id}/evidence/{evidenceId}
Auth required.

---

### GET /cbahi/drills
Auth required.

---

### POST /cbahi/drills
Auth required.

**Request:**
```json
{
  "code_type": "Code Blue",
  "location": "Main Building - 3rd Floor - ICU",
  "scheduled_date": "2025-06-15",
  "scheduled_time": "10:00",
  "participants": [1, 2, 3]
}
```

---

### PUT /cbahi/drills/{id}
Auth required.

**Request:**
```json
{
  "status": "Completed",
  "milestones": { "acceptanceTime": 30, "arrivalTime": 120, "completionTime": 300 },
  "score": 85,
  "notes": "Good response time"
}
```
`status`: `Scheduled` | `In Progress` | `Completed` | `Cancelled`

---

### DELETE /cbahi/drills/{id}
Auth required.

---

### GET /cbahi/audit-log
Auth required.

**Query params (optional):** `page`, `per_page`, `category`, `user`, `date_from`, `date_to`

---

## 19. Summary Table

| Endpoint | Method | Auth | Notes |
|----------|--------|------|-------|
| `/auth/login` | POST | No | Throttle 5/min |
| `/auth/register` | POST | No | Sends OTP |
| `/auth/verify-otp` | POST | No | Throttle 10/min |
| `/auth/resend-otp` | POST | No | Throttle 3/min |
| `/auth/forgot-password` | POST | No | Throttle 3/min |
| `/auth/reset-password` | POST | No | Throttle 5/min |
| `/auth/logout` | POST | Yes | |
| `/auth/change-password` | POST | Yes | |
| `/auth/delete-account` | POST | Yes | |
| `/auth/session` | GET | Yes | |
| `/auth/heartbeat` | POST | Yes | |
| `/auth/biometric/register` | POST | Yes | |
| `/auth/biometric/login` | POST | No | Throttle 10/min |
| `/auth/biometric/revoke` | DELETE | Yes | |
| `/me` | GET | Yes | |
| `/me` | PATCH | Yes | |
| `/me/device-token` | POST | Yes | FCM token |
| `/home` | GET | Yes | Combined endpoint |
| `/home/active-requests` | GET | Yes | |
| `/alerts` | GET | Yes | |
| `/alerts` | POST | Yes | Fires FCM push |
| `/alerts/{id}` | GET | Yes | |
| `/alerts/{id}/respond` | POST | Yes | |
| `/alerts/{id}/escalate` | POST | Yes | |
| `/cases` | GET | Yes | Admin |
| `/cases` | POST | Yes | Admin |
| `/cases/{id}` | GET | Yes | Admin |
| `/cases/{id}` | PUT | Yes | Admin |
| `/cases/{id}/timeline` | POST | Yes | Admin |
| `/cases/{id}/team` | POST | Yes | Admin |
| `/cases/{id}/team/{memberId}` | PUT | Yes | Admin |
| `/cases/{id}/team/{memberId}` | DELETE | Yes | Admin |
| `/cases/{id}/close` | POST | Yes | Admin |
| `/cases/export` | GET | Yes | Admin |
| `/emergency-codes` | GET | Yes | |
| `/emergency-codes/{id}` | PUT | Yes | |
| `/emergency-codes/{id}/activate` | POST | Yes | |
| `/emergency-codes/{id}/deactivate` | POST | Yes | |
| `/emergency-codes/schedules` | GET | Yes | |
| `/emergency-codes/schedules/{id}` | PUT | Yes | |
| `/notifications` | GET | Yes | |
| `/notifications/{id}/read` | PUT | Yes | |
| `/notifications/read-all` | POST | Yes | |
| `/notifications` | DELETE | Yes | Clear all |
| `/settings/code-types` | GET/POST | Yes | |
| `/settings/code-types/{id}` | GET/PUT/DELETE | Yes | |
| `/settings/locations/buildings` | GET | Yes | Cascade dropdown |
| `/settings/locations/floors` | GET | Yes | Cascade dropdown |
| `/settings/locations/departments` | GET | Yes | Cascade dropdown |
| `/settings/locations/rooms` | GET | Yes | Cascade dropdown |
| `/settings/locations` | GET/POST | Yes | |
| `/settings/locations/{id}` | GET/PUT/DELETE | Yes | |
| `/settings/security` | GET/PUT | Yes | |
| `/settings/notifications` | GET/PUT | Yes | |
| `/about` | GET | Yes | Fix 500 error |
| `/terms` | GET | Yes | Fix 500 error |
| `/privacy` | GET | Yes | Fix 500 error |
| `/users` | GET/POST | Yes | Admin |
| `/users/{id}` | GET/PUT/DELETE | Yes | Admin |
| `/users/{id}/unlock` | POST | Yes | Admin |
| `/users/{id}/generate-mobile-code` | POST | Yes | Admin |
| `/users/{id}/avatar` | POST | Yes | Multipart, max 5 MB |
| `/users/export` | GET | Yes | Admin |
| `/users/template` | GET | Yes | Admin |
| `/users/import` | POST | Yes | CSV, max 10 MB |
| `/roles` | GET/POST | Yes | Admin |
| `/roles/{id}` | GET/PUT/DELETE | Yes | Admin |
| `/permissions` | GET | Yes | Admin |
| `/branches` | GET/POST | Yes | Admin |
| `/branches/{id}` | GET/PUT/DELETE | Yes | Admin |
| `/reports/dashboard` | GET | Yes | Admin |
| `/reports/cases-over-time` | GET | Yes | Admin |
| `/reports/cases-by-type` | GET | Yes | Admin |
| `/reports/response-times` | GET | Yes | Admin |
| `/reports/case-history` | GET | Yes | Admin |
| `/reports/export` | GET | Yes | Admin, excel/pdf |
| `/cbahi/standards` | GET | Yes | Admin |
| `/cbahi/standards/{id}` | PUT | Yes | Admin |
| `/cbahi/standards/{id}/evidence` | GET/POST | Yes | Admin |
| `/cbahi/standards/{id}/evidence/{id}` | DELETE | Yes | Admin |
| `/cbahi/drills` | GET/POST | Yes | Admin |
| `/cbahi/drills/{id}` | PUT/DELETE | Yes | Admin |
| `/cbahi/audit-log` | GET | Yes | Admin |
