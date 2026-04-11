# CodeConnect — Publishing from a Local Device

This guide explains how to build and publish CodeConnect to the App Store from your local machine using EAS CLI.

---

## Prerequisites

1. **Node.js** (v18 or later) — https://nodejs.org
2. **EAS CLI** — Install globally:
   ```bash
   npm install -g eas-cli
   ```
3. **Expo account** — Log in with the project owner account:
   ```bash
   eas login
   # Username: ahmed_asia
   ```
4. **Apple Developer account** — Active membership required (Team ID: `N3R8MF955Y`)

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/Riyada-Solutions/codeconnect.git
cd codeconnect
```

Switch to the `artifacts` branch (contains the publishing setup):

```bash
git checkout artifacts
```

Navigate to the app directory:

```bash
cd artifacts/codeconnect
```

---

## Step 2: Install Dependencies

```bash
npm install -g pnpm
pnpm install
```

---

## Step 3: Build for iOS (App Store)

### Production Build

```bash
eas build --platform ios --profile production
```

This will:
- Use the credentials already stored on Expo servers (Distribution Certificate & Provisioning Profile)
- Build a `.ipa` file in the cloud
- Auto-increment the build number

### What to expect:
- EAS will ask to confirm the Apple Developer credentials
- The build takes approximately 10–20 minutes
- You'll get a link to download the `.ipa` or proceed to submission

---

## Step 4: Submit to App Store

After the build completes, submit it:

```bash
eas submit --platform ios --profile production
```

Or combine build + submit in one command:

```bash
eas build --platform ios --profile production --auto-submit
```

### Required for submission:
- **Apple ID:** Ahmedsayed.cs2019@gmail.com
- **App Store Connect App ID:** 6762006158
- **Apple Team ID:** N3R8MF955Y
- **Apple App-Specific Password:** You will need to generate one at https://appleid.apple.com/account/manage → Sign-In and Security → App-Specific Passwords

When prompted for the Apple password, use the app-specific password (not your regular Apple ID password).

---

## Step 5: Complete Submission in App Store Connect

After EAS uploads the build:

1. Go to https://appstoreconnect.apple.com
2. Select **CodeConnect**
3. Go to the **TestFlight** tab to verify the build appears
4. Go to **App Store** tab → create a new version
5. Select the uploaded build
6. Fill in:
   - Screenshots (6.7" and 6.5" required)
   - Description, keywords, support URL
   - Privacy policy URL
   - Age rating
7. Click **Submit for Review**

---

## Project Details

| Field | Value |
|-------|-------|
| App Name | CodeConnect |
| Bundle ID | com.emdadarabia.codeconnect |
| Expo Slug | codeconnect |
| EAS Project ID | 1ae5d4fe-2950-4061-aeab-a3e2f1920daf |
| Expo Owner | ahmed_asia |
| Apple Team ID | N3R8MF955Y |
| ASC App ID | 6762006158 |
| Apple ID | Ahmedsayed.cs2019@gmail.com |

---

## Build Profiles

Defined in `eas.json`:

| Profile | Purpose | Distribution |
|---------|---------|-------------|
| `development` | Local development with dev client | Internal (simulator) |
| `preview` | Testing on real devices | Internal |
| `production` | App Store release | Store |

### Build for testing on real devices:

```bash
eas build --platform ios --profile preview
```

### Build for simulator:

```bash
eas build --platform ios --profile development
```

---

## Troubleshooting

### "No credentials found"
Run credential setup:
```bash
eas credentials --platform ios
```
The Distribution Certificate and Provisioning Profile are already stored on Expo servers — select "Use existing" when prompted.

### Build fails with dependency errors
Make sure you're in the `artifacts/codeconnect` directory and have run `pnpm install`.

### "App-specific password required"
Generate one at https://appleid.apple.com/account/manage → Sign-In and Security → App-Specific Passwords. Set it as an environment variable:
```bash
export EXPO_APPLE_PASSWORD=your-app-specific-password
```

### Incrementing version for a new release
Edit `artifacts/codeconnect/app.json`:
- `version` — Display version (e.g., "1.0.0" → "1.1.0")
- `ios.buildNumber` — Auto-incremented by EAS in production profile

---

## Quick Reference Commands

```bash
# Login to Expo
eas login

# Build for App Store
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios --profile production

# Build and submit together
eas build --platform ios --profile production --auto-submit

# Check build status
eas build:list

# View credentials
eas credentials --platform ios
```
