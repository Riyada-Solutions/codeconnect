# AGENTS.md — CodeConnect Project Coding Rules

## Architecture
- Always use a **service layer** for all data access and API calls
- Components must NEVER call REST APIs or Firebase directly
- Place all API logic in `services/` files
- Services should be named by domain using **snake_case** (e.g. `auth_service.ts`, `alert_service.ts`, `emergency_service.ts`, `notification_service.ts`)
- Use **TanStack React Query** (`@tanstack/react-query`) for all server state management
- Use the generated API client from `@workspace/api-client-react` as the HTTP layer

## Folder Structure
```
artifacts/codeconnect/
├── app/                  # Expo Router file-based routes
│   ├── (auth)/           # Authentication screens
│   ├── (tabs)/           # Main tab navigation screens
│   ├── alert/            # Alert detail routes
│   └── emergency/        # Emergency request routes
├── components/           # Reusable UI components
│   └── ui/               # Primitive UI components (Card, Badge, Avatar)
├── constants/            # Static values, theme, emergency codes, enums
├── contexts/             # React Context providers (AppContext for theme/i18n)
├── hooks/                # Custom React hooks
├── services/             # All API/data access logic
│   ├── api.ts            # Base API client configuration (Axios instance)
│   ├── auth_service.ts   # Authentication API calls
│   ├── alert_service.ts  # Alert/emergency API calls
│   ├── fcm_service.ts    # Firebase Cloud Messaging setup & token management
│   └── notification_service.ts  # Local notification display & handling
├── utils/                # Utility/helper functions
└── assets/               # Images, fonts, icons
```

## Naming Conventions
- Use **snake_case** for all files and folders (e.g. `alert_card.tsx`, `auth_service.ts`, `format_time.ts`)
- Exception: route files follow Expo Router conventions using **kebab-case** (e.g. `forgot-password.tsx`, `verify-otp.tsx`)
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
- Create a single base API client in `services/api.ts` with base URL from environment variables
- Wrap all API calls in service files under `services/`
- Use **TanStack React Query** hooks in components for caching and server state
- Always handle API errors in the service layer and throw meaningful error messages
- During development, mock data lives in `constants/mock_data.ts` — replace with real service calls when backend is ready

## Firebase Integration

### Packages
| Package | Role |
|---------|------|
| `@react-native-firebase/app` | Firebase Core initialization |
| `@react-native-firebase/auth` | Authentication (Google/Apple sign-in) |
| `@react-native-firebase/messaging` | Push notifications (FCM) |
| `expo-notifications` | Local notification display |

### Initialization
- Initialize Firebase in `app/_layout.tsx` before any other Firebase usage
- Firebase config goes in `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
- Never commit Firebase config files with production credentials — use `.env` for API keys

### FCM Service (`services/fcm_service.ts`)
Handles all Firebase Cloud Messaging logic:
1. **Permission requests** — request notification permission on both iOS and Android
2. **Token management** — get FCM device token, cache it, send to backend via `auth_service.ts`
3. **Token refresh** — listen for token changes and update backend
4. **Background handler** — register background message handler (must be top-level function)

### Notification Service (`services/notification_service.ts`)
Handles local notification display and tap actions:
1. **Channel setup** — create Android notification channel (`high_importance_channel`)
2. **Foreground display** — show local notification when FCM message arrives while app is open
3. **Tap handling** — parse `NotificationPayload` and navigate to correct screen
4. **Payload model** — define `NotificationPayload` type with `id`, `type`, `data` fields

### Notification Types (`constants/enums.ts`)
```typescript
enum NotificationType {
  general = "general",
  emergency_alert = "emergency_alert",
  code_activated = "code_activated",
  responder_assigned = "responder_assigned",
  alert_resolved = "alert_resolved",
}
```

### Notification Navigation
| NotificationType | Screen |
|-----------------|--------|
| `general` | No navigation |
| `emergency_alert` | Incoming Alert screen |
| `code_activated` | Alert Detail screen (with alert `id`) |
| `responder_assigned` | Alert Detail screen (with alert `id`) |
| `alert_resolved` | Alerts tab |

### FCM Handler Component
- Wrap main app layout with `FcmHandler` component in `app/_layout.tsx`
- `FcmHandler` initializes listeners for foreground messages, background taps, and cold-start taps
- Pass navigation ref so notification taps can trigger screen navigation

### Sending Token to Backend
- After successful login, call `fcm_service.updateDeviceToken(userId, token)`
- On token refresh, automatically re-send to backend
- Cache token locally to avoid redundant API calls

## Theme & Internationalization
- All screens must use `useApp()` from `contexts/AppContext.tsx` for colors, translations, and theme state
- Never import `lightTheme`/`darkTheme` directly in screens
- All user-facing strings must use the `t()` translation function
- Translation keys follow dot-notation namespacing (e.g. `login.welcome`, `alerts.title`)
- Both English and Arabic translations are required for every key
- Theme and language preferences persist via AsyncStorage

## Environment Variables & Secrets
- Store API URLs, Firebase keys, and all secrets in `.env` files or Replit Secrets
- Never hardcode secrets, tokens, or API keys in the codebase
- Reference the base API URL from `VITE_API_BASE_URL` or equivalent env variable
- Firebase config values must come from environment or platform-specific config files

## Components
- Keep all components under **150 lines** — split into smaller components if needed
- Always wrap page-level components with the existing **ErrorBoundary**
- Always handle **loading and error states** visibly in the UI on every screen
- Never leave loading or error states unhandled
- Show loading spinners during async operations
- Show error messages with retry option when API calls fail
- Reusable UI primitives go in `components/ui/`

## Forms
- Manual validation is acceptable
- Always show clear validation messages to the user
- Validate required fields before navigation (e.g. OTP must be 6 digits before proceeding)

## User Feedback
- Use a **dialog/modal with message** for important user feedback (success, error, confirmation)
- Create a reusable `FeedbackDialog` component in `components/ui/`
- Show success dialog after completing actions (e.g. "Password updated successfully")
- Show error dialog with clear message when operations fail
- Show confirmation dialog before destructive actions (e.g. logout, reject alert)
- Never use browser `alert()` — always use custom styled dialogs matching the app theme
- Keep feedback messages short and actionable

## Animations
- Use **react-native-reanimated** for all animations
- Use `FadeInDown`, `FadeInUp` entering animations for screen transitions
- Use `useSharedValue` and `useAnimatedStyle` for interactive animations

## Comments
- Only add comments for **complex or non-obvious logic**
- Do not comment self-explanatory code
- Do not add section headers or decorative comments

## Brand & Design
- Primary color: `#2daaae` (teal)
- Font family: Inter (400 Regular, 500 Medium, 600 SemiBold, 700 Bold)
- Border radius: 12-16px for cards and buttons
- Always use the Emdad Arabia logo from `assets/images/logo.jpeg`
- App icon: `assets/images/ic_launcher.png`
