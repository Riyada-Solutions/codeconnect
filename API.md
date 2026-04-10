# CodeConnect HTTP API reference

This document describes the **Express API** in `artifacts/api-server` and how clients call it via **`@workspace/api-client-react`**.

**Source of truth for request/response shapes:** `lib/api-spec/openapi.yaml` (OpenAPI 3.1). Generated artifacts: `lib/api-zod` (Zod + types), `lib/api-client-react` (fetch + React Query hooks).

---

## Base URL and paths

| Context | Base | Notes |
|--------|------|--------|
| **Server mount** | `/api` | All routes registered under this prefix (see `artifacts/api-server/src/app.ts`). |
| **Full path (example)** | `http://<host>:<PORT>/api/healthz` | Replace host/port with your deployment. |
| **OpenAPI `servers[0].url`** | `/api` | Paths in the spec are relative to this (e.g. `/healthz` → `/api/healthz` on the server). |

**CORS:** Enabled for all origins (`cors()` middleware).  
**JSON:** `express.json()` and `express.urlencoded({ extended: true })` are enabled for future POST/PUT bodies.

---

## Server environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | **Yes** | TCP port the process listens on. Must be a positive number; invalid or missing values cause startup failure (`artifacts/api-server/src/index.ts`). |

No other API-specific env vars are defined in the server entry today.

---

## Client configuration (`@workspace/api-client-react`)

Configure once at app startup (Expo or web) before calling generated functions.

| API | Type | Description |
|-----|------|-------------|
| `setBaseUrl(url: string \| null)` | function | Prepended to **relative** URLs (paths starting with `/`). Use your full API origin, e.g. `https://api.example.com` (no trailing slash required). Pass `null` to clear. |
| `setAuthTokenGetter(getter: AuthTokenGetter \| null)` | function | If set, each request may add `Authorization: Bearer <token>` when the getter returns a non-null string. Pass `null` to clear. |
| `AuthTokenGetter` | type | `() => Promise<string \| null> \| string \| null` |

Generated calls use paths like `/api/healthz`; **`setBaseUrl` must point at the server origin** (scheme + host + port), not including `/api` twice.

**Errors:** Failed responses throw `ApiError` (status, `data`, `response`, etc.). JSON parse failures on success responses throw `ResponseParseError`. See `lib/api-client-react/src/custom-fetch.ts`.

---

## Endpoints

### Health check

| Field | Value |
|-------|--------|
| **Name (summary)** | Health check |
| **OpenAPI `operationId`** | `healthCheck` |
| **HTTP method** | `GET` |
| **Path** | `/api/healthz` |
| **Tags** | `health` |

**Path parameters:** none  

**Query parameters:** none  

**Request headers:** none required  

**Request body:** none  

**Response `200` — `application/json`**

| Field | Type | Required | Description |
|-------|------|------------|-------------|
| `status` | `string` | yes | Server returns `"ok"` in the current implementation. |

**Example response:**

```json
{ "status": "ok" }
```

**TypeScript types**

- Client: `HealthStatus` in `lib/api-client-react/src/generated/api.schemas.ts`
- Shared validation: `HealthCheckResponse` (Zod) in `lib/api-zod/src/generated/api.ts`

**Client usage (generated)**

| Export | Purpose |
|--------|---------|
| `getHealthCheckUrl()` | Returns `"/api/healthz"` |
| `healthCheck(options?: RequestInit)` | `Promise<HealthStatus>` |
| `getHealthCheckQueryKey()` | React Query key |
| `getHealthCheckQueryOptions(...)` | React Query options factory |
| `useHealthCheck(...)` | React Query hook |

---

## Adding or changing endpoints

1. Edit **`lib/api-spec/openapi.yaml`** (paths, schemas, `operationId`).
2. Regenerate clients using the repo’s Orval (or equivalent) scripts—see root `package.json` / workspace scripts for `api-zod` and `api-client-react` generation.
3. Implement the route in **`artifacts/api-server/src/routes/`** and register it in **`artifacts/api-server/src/routes/index.ts`** under the `/api` prefix (path segments should match the spec).

---

## Current scope

As of this document, the **only** documented and implemented REST endpoint is **`GET /api/healthz`**. Any other HTTP behavior in the monorepo (e.g. Expo static server templates) is outside this API spec unless added to `openapi.yaml` and the Express router.
