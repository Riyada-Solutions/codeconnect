# AGENTS.md — CodeConnect Project Coding Rules

## Architecture
- Always use a **service layer** for all data access and API calls
- Components must NEVER call REST APIs directly
- Place all API logic in `services/` files
- Services should be named by domain (e.g. `authService.ts`, `alertService.ts`, `emergencyService.ts`)
- Use **TanStack React Query** (`@tanstack/react-query`) for all server state management
- Use the generated API client from `@workspace/api-client-react` as the HTTP layer

## Folder Structure
```
artifacts/codeconnect/
├── app/                # Expo Router file-based routes
│   ├── (auth)/         # Authentication screens
│   ├── (tabs)/         # Main tab navigation screens
│   ├── alert/          # Alert detail routes
│   └── emergency/      # Emergency request routes
├── components/         # Reusable UI components
│   └── ui/             # Primitive UI components (Card, Badge, Avatar)
├── constants/          # Static values, theme, emergency codes, mock data
├── contexts/           # React Context providers (AppContext for theme/i18n)
├── hooks/              # Custom React hooks
├── services/           # All API/data access logic (create as needed)
├── utils/              # Utility/helper functions
└── assets/             # Images, fonts, icons
```

## Naming Conventions
- Use **PascalCase** for React component files (e.g. `AlertCard.tsx`, `Avatar.tsx`)
- Use **kebab-case** for route/page files (e.g. `forgot-password.tsx`, `verify-otp.tsx`)
- Use **camelCase** for utilities, hooks, services, and constants (e.g. `formatTime.ts`, `useColors.ts`, `authService.ts`)
- Use **camelCase** for directories (e.g. `components`, `hooks`, `services`)
- Use **PascalCase** for React component names inside files (e.g. `export default function AlertCard()`)
- Use **camelCase** for variables and function names

## Styling
- Use **React Native `StyleSheet.create()`** for all static styles
- Use **inline style arrays** only for dynamic/theme-dependent values (e.g. `[styles.container, { backgroundColor: colors.background }]`)
- Never use Tailwind, CSS-in-JS, or plain CSS files
- Always use theme colors from `useApp().colors` — never hardcode color values in components
- Keep style definitions at the bottom of each file

## Language
- Use **TypeScript** (`.tsx` for components, `.ts` for logic) for all files
- Define explicit types/interfaces for component props
- Use the `ThemeColors` type from `constants/theme.ts` for theme-related typing

## Routing
- Use **Expo Router** (file-based routing) for all navigation
- Auth screens go in `app/(auth)/`
- Main app screens go in `app/(tabs)/` or top-level `app/`
- Use `router.push()`, `router.replace()`, and `router.back()` from `expo-router`

## HTTP & API
- Use the workspace API client (`@workspace/api-client-react`) for all HTTP calls
- Wrap API calls in service files under `services/`
- Use **TanStack React Query** hooks for caching and server state
- Always handle API errors in the service layer and surface meaningful messages
- During development, mock data lives in `constants/mockData.ts` — replace with real service calls when backend is ready

## Theme & Internationalization
- All screens must use `useApp()` from `contexts/AppContext.tsx` for colors, translations, and theme state
- Never import `lightTheme`/`darkTheme` directly in screens
- All user-facing strings must use the `t()` translation function
- Translation keys follow dot-notation namespacing (e.g. `login.welcome`, `alerts.title`)
- Both English and Arabic translations are required for every key
- Theme and language preferences persist via AsyncStorage

## Environment Variables & Secrets
- Store API URLs and keys in Replit Secrets or `.env` files
- Never hardcode secrets, tokens, or API keys in the codebase
- Reference configuration values from environment variables

## Components
- Keep all components under **150 lines** — split into smaller components if needed
- Always wrap page-level components with the existing **ErrorBoundary**
- Always handle **loading and error states** visibly in the UI
- Never leave loading or error states unhandled
- Reusable UI primitives go in `components/ui/`

## Forms
- Manual validation is acceptable
- Always show clear validation messages to the user
- Validate required fields before navigation (e.g. OTP must be 6 digits before proceeding)

## User Feedback
- Use toast notifications for success and error messages (add `react-native-toast-message` when needed)
- Never use browser `alert()` or React Native `Alert.alert()` for routine feedback
- Keep feedback messages short and actionable

## Animations
- Use **react-native-reanimated** for all animations
- Use `FadeInDown`, `FadeInUp` entering animations for screen transitions
- Use `useSharedValue` and `useAnimatedStyle` for interactive animations

## Comments
- Only add comments for complex or non-obvious logic
- Do not comment self-explanatory code
- Do not add section headers or decorative comments

## Brand & Design
- Primary color: `#2daaae` (teal)
- Font family: Inter (400 Regular, 500 Medium, 600 SemiBold, 700 Bold)
- Border radius: 12-16px for cards and buttons
- Always use the Emdad Arabia logo from `assets/images/logo.jpeg`
- App icon: `assets/images/ic_launcher.png`
