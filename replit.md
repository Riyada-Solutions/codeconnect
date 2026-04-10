# Workspace

## Overview

CodeConnect — hospital emergency response mobile app for Emdad Arabia. Built with Expo / React Native at the project root.

## Stack

- **Package manager**: pnpm
- **Node.js version**: 24
- **TypeScript version**: 5.9
- **Framework**: Expo SDK 54 + React Native
- **Router**: Expo Router (file-based)
- **Server state**: TanStack React Query
- **HTTP client**: Axios
- **Animations**: react-native-reanimated
- **Push notifications**: Firebase Cloud Messaging + expo-notifications (planned)

## Project Structure

The Expo app lives at the **project root** (not in `artifacts/`).

```
/
├── app/                  # Expo Router screens
│   ├── (auth)/           # Login, Register, OTP, Reset Password
│   ├── (tabs)/           # Home, Alerts, Profile
│   ├── alert/            # Alert detail [id]
│   └── emergency/        # Activate emergency flow
├── components/ui/        # Reusable UI components
├── constants/            # Theme, enums, emergency codes
├── contexts/             # AppContext (theme + i18n)
├── data/                 # Data layer (repositories + mock)
│   └── mock/             # Mock data (USE_MOCK_DATA=true)
├── hooks/                # Custom React hooks
├── types/                # Shared TypeScript interfaces
├── utils/                # Helper functions
├── assets/               # Images, fonts, icons
├── scripts/              # Dev/build scripts
├── server/               # Production serve script
├── AGENTS.md             # Coding rules & architecture guide
└── API_SPEC.md           # Backend API contract
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

- `pnpm run dev` — start Expo dev server
- `pnpm run build` — build for production
- `pnpm run serve` — serve production build
- `pnpm run typecheck` — TypeScript check

## Key Documentation

- `AGENTS.md` — Complete coding rules, patterns, templates, and architecture decisions
- `API_SPEC.md` — All backend API endpoints the mobile app requires
