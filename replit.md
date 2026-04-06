# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Mobile**: Expo (React Native) with TypeScript

## Artifacts

### CodeConnect (Mobile App)
- **Path**: `artifacts/codeconnect`
- **Type**: Expo (React Native)
- **Description**: Hospital emergency response coordination system for Emdad Arabia
- **Brand Color**: #2daaae (teal)
- **Features**:
  - Splash screen with animated logo
  - Login + OTP verification auth flow
  - Home screen with emergency code grid and active requests
  - Alerts screen with filterable alert list
  - Profile screen with settings, edit profile, notifications
  - Alert detail with responder tracking and timer
  - Create emergency request with cascading location dropdowns
  - Shared screens: Privacy Policy, Terms of Service, About, Settings, Notifications, Edit Profile
- **Design System**:
  - Primary: #2daaae, Dark: #1d8a8e, Deep: #0f5a5c
  - Background: #f0f5f5, Cards: #ffffff
  - Text: #0d2526, Secondary: #4a7072, Muted: #93b5b6
  - Code colors: Blue #3b82f6, Red #ef4444, Pink #ec4899, Yellow #f59e0b, Orange #f97316, Green #10b981, Purple #8b5cf6
  - Font: Inter (400/500/600/700)
  - Border radius: 12px

### API Server
- **Path**: `artifacts/api-server`
- **Type**: Express 5

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
