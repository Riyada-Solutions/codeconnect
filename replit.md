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
  - Full auth flow: Login, Register, Forgot Password, OTP Verification, New Password, Verify OTP
  - Home screen with emergency code list cards and active requests
  - Alerts screen with filterable alert list
  - Profile screen with colored-icon menu rows
  - Alert detail with responder tracking and timer
  - Create emergency request with cascading location dropdowns
  - Settings with dark mode toggle and EN/AR language selector
  - Help & Support screen (WhatsApp/Facebook/Email + message form)
  - Change Password screen
  - Incoming Emergency Alert screen (notification to doctors after request creation)
  - Shared screens: Privacy Policy, Terms of Service, About, Notifications, Edit Profile
  - Full dark mode support across all screens
  - Full EN/AR bilingual translation system
- **Architecture**:
  - `AppContext` (`contexts/AppContext.tsx`): central context providing `colors`, `t()`, `isDark`, `toggleTheme`, `language`, `setLanguage`
  - Theme defined in `constants/theme.ts` with `lightTheme`/`darkTheme` objects and `ThemeColors` type
  - All screens use `useApp()` hook — no direct theme imports
  - Translation keys stored in AppContext with `Record<string, Record<Language, string>>` format
  - Theme/language persisted via AsyncStorage (`app_theme`, `app_language`)
- **Design System**:
  - Primary: #2daaae, Dark: #1d8a8e, Deep: #0f5a5c
  - Light: bg #f0f5f5, card #ffffff, text #0d2526, secondary #4a7072, muted #93b5b6
  - Dark: bg #0d1b1c, card #14292a, text #e4f7f7, secondary #93b5b6, muted #4a7072
  - Code colors: Blue #3b82f6, Red #ef4444, Pink #ec4899, Yellow #f59e0b, Orange #f97316, Green #10b981, Purple #8b5cf6
  - Font: Inter (400/500/600/700)
  - Border radius: 12-14px

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
