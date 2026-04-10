# Workspace

## Overview

CodeConnect — hospital emergency response mobile app for Emdad Arabia. Built with Expo / React Native as a Replit artifact.

## Stack

- **Package manager**: pnpm (monorepo workspace)
- **Node.js version**: 24
- **TypeScript version**: 5.9
- **Framework**: Expo SDK 54 + React Native
- **Router**: Expo Router (file-based)
- **Server state**: TanStack React Query
- **HTTP client**: Axios
- **Animations**: react-native-reanimated
- **Push notifications**: Firebase Cloud Messaging + expo-notifications (planned)

## Project Structure

The Expo app lives in `artifacts/codeconnect/` as a proper Replit artifact (supports Publish button).

```
/
├── artifacts/
│   └── codeconnect/          # Main Expo mobile app
│       ├── app/              # Expo Router screens
│       │   ├── (auth)/       # Login, Register, OTP, Reset Password
│       │   ├── (tabs)/       # Home, Alerts, Profile
│       │   ├── alert/        # Alert detail [id]
│       │   └── emergency/    # Activate emergency flow
│       ├── components/ui/    # Reusable UI components
│       ├── constants/        # Theme, enums, emergency codes
│       ├── contexts/         # AppContext (theme + i18n)
│       ├── data/             # Data layer (repositories + mock)
│       │   └── mock/         # Mock data (USE_MOCK_DATA=true)
│       ├── hooks/            # Custom React hooks
│       ├── types/            # Shared TypeScript interfaces
│       ├── utils/            # Helper functions
│       ├── assets/           # Images, fonts, icons
│       ├── scripts/          # Build scripts (build.cjs)
│       ├── server/           # Production serve script
│       ├── shims/            # Module shims (expo-local-authentication)
│       ├── app.json          # Expo config
│       ├── eas.json          # EAS build config
│       └── package.json      # @workspace/codeconnect
├── AGENTS.md                 # Coding rules & architecture guide
├── API_SPEC.md               # Backend API contract
└── pnpm-workspace.yaml       # Workspace config
```

## Architecture

- **Three-layer pattern**: Screen → React Query Hook → Repository (data/)
- **Mock/Real switching**: `USE_MOCK_DATA` env variable controls data source
- **AppContext**: central context providing `colors`, `t()`, `isDark`, `toggleTheme`, `language`, `setLanguage`, `isRTL`
- **Theme**: `constants/theme.ts` with `lightTheme`/`darkTheme` + `ThemeColors` type
- All screens use `useApp()` — no direct theme imports

## Design System

- Primary: #2daaae (teal), Dark: #1d8a8e, Deep: #0f5a5c
- Light mode: bg #f0f5f5, card #ffffff, text #0d2526
- Dark mode: bg #0d1b1c, card #14292a, text #e4f7f7
- Font: Inter (400/500/600/700)
- Border radius: 12-16px

## Key Commands

- `pnpm --filter @workspace/codeconnect run dev` — start Expo dev server
- `pnpm --filter @workspace/codeconnect run build` — build for production
- `pnpm --filter @workspace/codeconnect run serve` — serve production build

## Workflow

- **artifacts/codeconnect: expo** — main dev workflow (auto-configured by artifact system)

## iOS Publishing

- Bundle ID: `com.emdadarabia.codeconnect`
- Expo account: `ahmed_asia`
- Apple Team: `N3R8MF955Y` (Epal solutions, inc)
- EAS Project ID: `1ae5d4fe-2950-4061-aeab-a3e2f1920daf`
- Distribution Certificate serial: `1D5D4DDA1155041ADBA77983EF5FFAB8` (expires Apr 2027)
- Provisioning Profile: `9Y7QLN52B7` (expires Apr 2027)
- Publish via Replit's built-in Expo Launch (Publish button)

## Key Documentation

- `AGENTS.md` — Complete coding rules, patterns, templates, and architecture decisions
- `API_SPEC.md` — All backend API endpoints the mobile app requires
