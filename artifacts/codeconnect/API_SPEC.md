# CodeConnect — Backend API Specification

This document defines all REST API endpoints required by the CodeConnect mobile app.
The backend developer (or AI agent) should implement these endpoints exactly as described.

**Base URL:** `{API_BASE_URL}/api/v1`

---

## Authentication

All endpoints below are **public** (no token required).

### POST `/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "jwt-token-string",
    "user": {
      "id": "string",
      "full_name": "string",
      "email": "string",
      "phone": "string",
      "role": "nurse | doctor | admin | responder",
      "department": "string",
      "hospital": "string",
      "avatar_url": "string | null"
    }
  }
}
```

**Error (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "register_code": "string",
  "full_name": "string",
  "email": "string",
  "phone": "string",
  "password": "string"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful. Please verify your account.",
  "data": {
    "user_id": "string"
  }
}
```

**Error (409):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

---

### POST `/auth/verify-otp`
Verify OTP code sent after registration or login.

**Request Body:**
```json
{
  "user_id": "string",
  "otp_code": "string (6 digits)"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "jwt-token-string",
    "user": { ... }
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Invalid or expired OTP code"
}
```

---

### POST `/auth/resend-otp`
Resend OTP code to the user.

**Request Body:**
```json
{
  "user_id": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

---

### POST `/auth/forgot-password`
Request a password reset code via email.

**Request Body:**
```json
{
  "email": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Reset code sent to your email"
}
```

**Error (404):**
```json
{
  "success": false,
  "message": "Email not found"
}
```

---

### POST `/auth/verify-reset-code`
Verify the password reset OTP code.

**Request Body:**
```json
{
  "email": "string",
  "otp_code": "string (6 digits)"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "reset_token": "string"
  }
}
```

---

### POST `/auth/reset-password`
Set a new password using the reset token.

**Request Body:**
```json
{
  "reset_token": "string",
  "new_password": "string",
  "confirm_password": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

---

### POST `/auth/logout`
Invalidate the current session. **Requires auth token.**

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## User Profile

All endpoints below require **Authorization: Bearer {token}** header.

### GET `/user/profile`
Get the current user's profile.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "full_name": "string",
    "email": "string",
    "phone": "string",
    "role": "nurse | doctor | admin | responder",
    "department": "string",
    "hospital": "string",
    "avatar_url": "string | null",
    "created_at": "ISO 8601 datetime"
  }
}
```

---

### PUT `/user/profile`
Update the current user's profile.

**Request Body:**
```json
{
  "full_name": "string",
  "email": "string",
  "phone": "string",
  "department": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

---

### POST `/user/change-password`
Change password for the authenticated user.

**Request Body:**
```json
{
  "current_password": "string",
  "new_password": "string",
  "confirm_password": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

### GET `/user/settings`
Get user preferences (theme, language, notification settings).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "dark_mode": "boolean",
    "language": "en | ar",
    "notifications_enabled": "boolean",
    "sound_enabled": "boolean"
  }
}
```

---

### PUT `/user/settings`
Update user preferences.

**Request Body:**
```json
{
  "dark_mode": "boolean",
  "language": "en | ar",
  "notifications_enabled": "boolean",
  "sound_enabled": "boolean"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Settings updated"
}
```

---

## Device & FCM

### POST `/device/register`
Register or update the device FCM token for push notifications. **Requires auth token.**

**Request Body:**
```json
{
  "device_token": "string (FCM token)",
  "platform": "ios | android"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Device registered"
}
```

---

### DELETE `/device/unregister`
Remove device token on logout. **Requires auth token.**

**Request Body:**
```json
{
  "device_token": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Device unregistered"
}
```

---

## Emergency Codes

### GET `/codes`
Get all available emergency code definitions. **Requires auth token.**

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "Code Blue",
      "color": "#0000FF",
      "description": "Cardiac/Respiratory Arrest",
      "icon": "heart-pulse"
    },
    {
      "id": "string",
      "name": "Code Red",
      "color": "#FF0000",
      "description": "Fire Emergency",
      "icon": "flame"
    }
  ]
}
```

---

## Locations

### GET `/locations`
Get hospital locations (buildings, floors, departments, rooms). **Requires auth token.**

**Query Params (optional):**
- `building_id` — filter floors by building
- `floor_id` — filter departments by floor
- `department_id` — filter rooms by department

**Response (200):**
```json
{
  "success": true,
  "data": {
    "buildings": [
      {
        "id": "string",
        "name": "Main Building"
      }
    ],
    "floors": [
      {
        "id": "string",
        "building_id": "string",
        "name": "Floor 3"
      }
    ],
    "departments": [
      {
        "id": "string",
        "floor_id": "string",
        "name": "ICU"
      }
    ],
    "rooms": [
      {
        "id": "string",
        "department_id": "string",
        "name": "Room 301"
      }
    ]
  }
}
```

---

## Alerts

All endpoints require **Authorization: Bearer {token}** header.

### POST `/alerts/activate`
Activate a new emergency alert.

**Request Body:**
```json
{
  "code_id": "string",
  "building_id": "string",
  "floor_id": "string",
  "department_id": "string",
  "room_id": "string | null",
  "notes": "string | null"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Emergency alert activated",
  "data": {
    "id": "string",
    "code": { "id": "string", "name": "Code Blue", "color": "#0000FF" },
    "location": "Main Building, Floor 3, ICU, Room 301",
    "status": "active",
    "activated_by": { "id": "string", "full_name": "string" },
    "created_at": "ISO 8601 datetime"
  }
}
```

---

### GET `/alerts`
Get list of alerts with optional filtering.

**Query Params:**
- `status` — `active | resolved | escalated | all` (default: `all`)
- `code_id` — filter by emergency code type
- `page` — page number (default: `1`)
- `limit` — items per page (default: `20`)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "id": "string",
        "code": { "id": "string", "name": "Code Blue", "color": "#0000FF" },
        "location": "Main Building, Floor 3, ICU",
        "status": "active | resolved | escalated",
        "activated_by": { "id": "string", "full_name": "string" },
        "responders_count": 3,
        "created_at": "ISO 8601 datetime",
        "resolved_at": "ISO 8601 datetime | null"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "total_pages": 3
    }
  }
}
```

---

### GET `/alerts/active`
Get only currently active alerts (for dashboard).

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "code": { "id": "string", "name": "Code Blue", "color": "#0000FF" },
      "location": "Main Building, Floor 3, ICU",
      "status": "active",
      "activated_by": { "id": "string", "full_name": "string" },
      "responders_count": 3,
      "created_at": "ISO 8601 datetime"
    }
  ]
}
```

---

### GET `/alerts/{id}`
Get full details of a specific alert.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "code": { "id": "string", "name": "Code Blue", "color": "#0000FF", "description": "string" },
    "location": {
      "building": "Main Building",
      "floor": "Floor 3",
      "department": "ICU",
      "room": "Room 301"
    },
    "status": "active | resolved | escalated",
    "notes": "string | null",
    "activated_by": {
      "id": "string",
      "full_name": "string",
      "role": "string",
      "department": "string"
    },
    "responders": [
      {
        "id": "string",
        "full_name": "string",
        "role": "string",
        "responded_at": "ISO 8601 datetime"
      }
    ],
    "created_at": "ISO 8601 datetime",
    "resolved_at": "ISO 8601 datetime | null",
    "resolved_by": { "id": "string", "full_name": "string" } 
  }
}
```

---

### POST `/alerts/{id}/accept`
Accept an incoming emergency alert (respond to it).

**Response (200):**
```json
{
  "success": true,
  "message": "You have joined the response team"
}
```

---

### POST `/alerts/{id}/reject`
Reject/decline an incoming emergency alert.

**Request Body (optional):**
```json
{
  "reason": "string | null"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Alert declined"
}
```

---

### POST `/alerts/{id}/escalate`
Escalate an alert to higher priority.

**Request Body:**
```json
{
  "reason": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Alert escalated"
}
```

---

### POST `/alerts/{id}/resolve`
Resolve/close an active alert.

**Request Body (optional):**
```json
{
  "notes": "string | null"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Alert resolved"
}
```

---

## Notifications

All endpoints require **Authorization: Bearer {token}** header.

### GET `/notifications`
Get list of notifications for the current user.

**Query Params:**
- `page` — page number (default: `1`)
- `limit` — items per page (default: `20`)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "string",
        "type": "general | emergency_alert | code_activated | responder_assigned | alert_resolved",
        "title": "string",
        "body": "string",
        "data": {
          "alert_id": "string | null"
        },
        "is_read": "boolean",
        "created_at": "ISO 8601 datetime"
      }
    ],
    "unread_count": 5,
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 30,
      "total_pages": 2
    }
  }
}
```

---

### PATCH `/notifications/{id}/read`
Mark a single notification as read.

**Response (200):**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

### PATCH `/notifications/read-all`
Mark all notifications as read.

**Response (200):**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

## Support

### POST `/support/message`
Submit a help/support message. **Requires auth token.**

**Request Body:**
```json
{
  "subject": "string",
  "message": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Support message sent successfully"
}
```

---

## Push Notification Payloads (FCM)

The backend sends push notifications via Firebase Cloud Messaging. Each notification must include a `data` payload with the following structure:

```json
{
  "notification": {
    "title": "Code Blue Activated",
    "body": "ICU, Floor 3 — Main Building"
  },
  "data": {
    "type": "emergency_alert | code_activated | responder_assigned | alert_resolved | general",
    "alert_id": "string | null"
  }
}
```

### Notification Types & When to Send

| Type | Trigger | Recipients |
|------|---------|------------|
| `emergency_alert` | New alert activated | All eligible responders in the hospital |
| `code_activated` | User's alert has been activated | The user who activated it (confirmation) |
| `responder_assigned` | A responder joins an alert | The alert activator + existing responders |
| `alert_resolved` | Alert is resolved/closed | All responders on that alert |
| `general` | System announcements | Target users or all users |

---

## Common Response Format

All API responses follow this structure:

**Success:**
```json
{
  "success": true,
  "message": "optional success message",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Human-readable error message"
}
```

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/expired token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate resource) |
| 500 | Internal Server Error |

## Authentication Header

All protected endpoints require:
```
Authorization: Bearer {jwt_token}
```

If the token is expired or invalid, return `401` with:
```json
{
  "success": false,
  "message": "Token expired or invalid"
}
```
