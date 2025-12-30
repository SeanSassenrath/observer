# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Unlimited Meditations** - A React Native mobile app for iOS and Android that helps users organize and play Dr. Joe Dispenza meditation audio files stored locally on their device. The app uses Firebase for authentication and cloud storage of user data (meditation history, streaks), while meditation audio files remain local.

**Key Technologies:**
- React Native 0.72.17 + React 18.3.1
- TypeScript 4.8.3
- Firebase Suite v23.5.0 (Auth, Firestore, Analytics, Crashlytics)
- React Navigation 6.x (Stack + Bottom Tabs)
- UI Kitten v5.3.1 (Eva Design System)
- react-native-track-player v4.1.1 (Audio playback)
- react-native-purchases v8.12.0 (Currently disabled)

## Common Development Commands

### Running the App
```bash
# Start Metro bundler
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator/device
npm run android
```

### Testing & Linting
```bash
# Run tests
npm test

# Run linter
npm run lint
```

### iOS Development
```bash
# Install CocoaPods dependencies (run after adding native modules)
cd ios && pod install && cd ..

# Clean iOS build
cd ios && rm -rf build && rm -rf Pods && rm Podfile.lock && pod install && cd ..
```

### Android Development
```bash
# Clean Android build
cd android && ./gradlew clean && cd ..
```

### Database Scripts
```bash
# Build real fingerprint database from meditation files
# (Requires organized meditation files in a directory)
node scripts/buildRealFingerprintDatabase.js /path/to/meditation-files
```

## Architecture Overview

### State Management: React Context API

The app uses React Context for global state management (not Redux). Each context provides domain-specific state:

**Core Contexts** (`/src/contexts/`):
- **UserContext** - User auth state, profile, onboarding flags, meditation stats
- **MeditationBaseDataContext** - Master meditation metadata (all available meditations)
- **MeditationInstanceDataContext** - Current meditation session data
- **MeditationHistoryContext** - User's past meditation sessions
- **MeditationFilePathsContext** - Maps meditation IDs to local file paths
- **UnknownFilesContext** - Files that couldn't be matched to meditation database

All contexts follow this pattern:
```typescript
interface Context {
  data: DataType;
  setData: React.Dispatch<React.SetStateAction<DataType>>;
}
```

Context providers are nested in `App.tsx` (lines 276-286), with all screens accessing state via `useContext()`.

### Navigation Architecture

**Two-level navigation structure:**

1. **Stack Navigator** (`/src/navigation/Stack.tsx`)
   - Main authentication and flow navigator
   - Initial route determined by auth state in `getInitialRouteName()`:
     - Unauthenticated → "PurchaseOnboarding"
     - Terms not accepted → "TermsAgreement"
     - Authenticated → "TabNavigation"
   - Firebase Analytics logs all screen changes automatically

2. **Tab Navigator** (`/src/navigation/Tab.tsx`)
   - Bottom tab navigation: Home, Add, Files (Library), Insights
   - Custom tab bar implementation
   - "Add" tab triggers custom file picker action instead of navigation

### Firebase Integration (`/src/fb/`)

**Firestore Schema:**
```
/users/{uid}
  - uid, profile (name, email, photo)
  - onboarding flags (hasSeenWelcome, hasSeenHomeOnboarding, etc.)
  - meditationUserData (streaks, totalTime, meditationCounts)
  - termsAgreement, betaAgreement
  /meditationHistory (subcollection)
    - creationTime, meditationBaseId, name, timeMeditated, notes, feedback
```

**Key Firebase Modules:**
- `auth.tsx` - Email/password, Google Sign-In, Apple Sign-In helpers
- `user.tsx` - CRUD operations on `/users/{userId}`
- `meditationHistory.tsx` - Paginated history queries (20 records per page)
- `unsupportedFiles.tsx`, `feedback.tsx` - Additional collections

**Auth Flow** (App.tsx, lines 146-214):
1. Firebase Auth listener (`onAuthStateChanged`) triggers on mount
2. Load existing user data from Firestore OR create new user with `normalizeFirebaseUser()`
3. Sync meditation history and streak data
4. Set loading to false, render main app

### Meditation File Management

**Core Data Flow:** User adds local files → App matches to database → Stores paths → Plays on demand

**Meditation Database** (`/src/constants/meditation-data.ts`):
- Static database of ~1000+ Dr. Joe Dispenza meditations
- Organized by series: Foundational, Daily, Generating, Breaking Habits, Breathwork, Walking, Synchronizing, Unlocked, Botec, Other
- Each meditation has: `meditationBaseId`, `name`, `groupName`, `formattedDuration`, `type`, `artist`, `url`

**File Matching Service** (`/src/services/meditationMatcher.ts`):
Three matching strategies (in priority order):
1. **Name-based matching** (Primary) - Fuzzy string matching with >50% confidence threshold
2. **Size-based matching** (Fallback) - File size comparison
3. **Fingerprint matching** (Disabled) - Audio hashing (disabled for performance)

**File Path Storage:**
- User-selected files stored as: `{ meditationBaseId: filePath }`
- Persisted in AsyncStorage via `setMeditationFilePathDataInAsyncStorage()`
- Loaded on app start into `MeditationFilePathsContext`

**Audio Playback** (`react-native-track-player`):
- Setup in `/src/services/setupService.ts` (called on app mount)
- Configured with 30s min/play buffer
- Playback capabilities: Play, Pause, Skip, Seek
- Progress update interval: 2 seconds

### Key User Flows

**Add Meditation Flow:**
1. User taps "Add" tab → Document picker opens
2. User selects audio files
3. MeditationMatcher analyzes each file (name/size)
4. Successful matches stored to AsyncStorage + context
5. User reviews results on AddMedsMatching screen
6. On confirmation, sync to Firebase user document

**Play Meditation Flow:**
1. User selects meditation from Home/Library
2. Navigate to Meditation screen → capture intention + notes
3. Navigate to MeditationPlayer screen
4. TrackPlayer queues audio file from stored local path
5. On completion: save session to Firebase meditationHistory
6. Update user meditation counts and streaks
7. Return to Home screen

### Analytics Integration (`/src/analytics/`)

Firebase Analytics is deeply integrated with event tracking throughout the app:

**Event Structure:**
- **Source** enums: APP_INITIALIZATION, MEDITATION_ADD, MEDITATION_PLAYER, THINKBOX, PROFILE
- **Action** enums: CLICK, DENIED, ENABLE, FAIL, SKIP, SUBMIT, VIEW
- **Noun** enums: BUTTON, ON_MOUNT, ON_PLAY

**Helper Functions:**
- `meditationPlayerSendEvent()` - Track meditation playback
- `meditationAddSendEvent()` - Track file imports
- `appInitializationSendEvent()` - Track startup issues
- `profileNotifEnabledSendEvent()` - Track notification preferences

## Directory Structure

```
src/
├── analytics/          # Firebase Analytics event tracking
├── assets/             # Images, fonts, media resources
├── components/         # Reusable UI components
│   ├── Card.tsx, Player.tsx, MeditationList.tsx
│   ├── Modals: MeditationNotesModal, SubscribeModal, NotificationModal
│   ├── Auth: GoogleSSOButton, AppleSSOButton, EmailSSOButton
│   └── Stats: Streaks, TopMeditations, TimeInMeditationChart
├── constants/          # App config and static meditation database
│   └── meditation-data.ts (Master meditation catalog)
├── contexts/           # React Context providers for global state
├── debug/              # Development debugging utilities
├── fb/                 # Firebase Firestore integration layer
├── hooks/              # Custom React hooks
├── navigation/         # Navigation stack and tab configuration
├── screens/            # Screen components for each page/flow
├── services/           # Business logic (audio, database, matching)
│   ├── meditationMatcher.ts (File matching logic)
│   ├── databaseBuilder.ts (Meditation DB generation)
│   └── setupService.ts (TrackPlayer initialization)
├── utils/              # Utility functions by domain
│   ├── meditations/    # Meditation lookup, filtering, sorting
│   ├── user/           # User profile helpers
│   ├── meditationInstance/ # Session-level operations
│   ├── addMeditations.tsx (File picker → match → storage orchestration)
│   ├── streaks.ts      # Streak calculation
│   └── fuzzyMeditationMatching.ts (Name matching algorithm)
└── types.tsx           # TypeScript type definitions
```

## Important Patterns & Conventions

### Component Organization
- **Screens** (`/src/screens/`) - Full-page components rendered by navigation
- **Components** (`/src/components/`) - Reusable UI elements
- Keep business logic in `/src/services/` or `/src/utils/`
- Use context hooks at component level, not in utility functions

### Data Fetching
- User data loaded once on app mount (App.tsx)
- Meditation history paginated (20 records per query)
- Use `fbGetMoreMeditationHistory()` for lazy loading
- All Firebase calls should handle errors and log to Analytics

### Styling
- Use UI Kitten components from `@ui-kitten/components`
- Theme defined in `theme.json` (Eva Design dark theme)
- Navigation theme in `/src/constants/navTheme.ts`
- Linear gradients for visual effects via `react-native-linear-gradient`

### TypeScript
- All new code must be TypeScript
- Use interfaces from `/src/types.tsx`
- Strict mode enabled in tsconfig.json

### Error Handling
- Log errors to Firebase Crashlytics
- Send analytics events for important failures
- Show user-friendly Toast messages for errors

## Current State & Known Issues

### In-App Purchases (Disabled)
- RevenueCat integration code exists but is commented out
- Files: `Purchase.tsx`, `PurchaseOnboarding.tsx`, `useFetchOffering.ts`, `Subscriptions.tsx`
- When re-enabling, configure RevenueCat API key and test with sandbox accounts

### Fingerprint Matching (Disabled)
- Audio fingerprinting disabled for performance reasons
- Name-based matching is primary strategy
- Fingerprint code remains in codebase for future use

### Test Coverage
- Minimal test coverage currently
- Jest configured but few tests exist
- Test files in `__tests__/` directory

### Purchase Testing Process
1. Create Sandbox account in App Store Connect (use email+n@gmail.com)
2. Install development build to physical device
3. Update Sandbox account in device: Settings > App Store > Sandbox Account

## Firebase Configuration

- **Google Web Client ID**: Hardcoded in App.tsx line 54
- **Firebase config**: Auto-initialized via `@react-native-firebase/app`
- **GoogleService-Info.plist**: Located in `ios/`
- **google-services.json**: Located in `android/app/` (standard location)

## iOS-Specific Notes

- Minimum iOS version: 15.0 (set in ios/Podfile)
- CocoaPods used for dependency management
- Xcode workspace: `ios/Unlimited.xcworkspace` (use this, not .xcodeproj)
- StoreKit test certificate: `ios/StoreKitTestCertificate.cer`
- Privacy manifest: `ios/PrivacyInfo.xcprivacy`

## Android-Specific Notes

- Package name: Check `android/app/src/main/AndroidManifest.xml`
- Firebase config: `android/app/google-services.json`
- Minimum SDK version: Check `android/build.gradle`

## When Making Changes

1. **Modifying meditation database**: Edit `/src/constants/meditation-data.ts`
2. **Adding new screens**:
   - Create component in `/src/screens/`
   - Add to Stack navigator in `/src/navigation/Stack.tsx`
   - Consider analytics tracking for screen views
3. **Adding Firebase data**:
   - Create helper in `/src/fb/`
   - Update relevant context
   - Handle sync in App.tsx initialization
4. **Modifying audio playback**:
   - Changes likely needed in `/src/services/setupService.ts`
   - Test thoroughly - audio is core functionality
5. **Authentication changes**:
   - Update `/src/fb/auth.tsx`
   - Consider impact on App.tsx auth flow
   - Test all auth methods (Email, Google, Apple)
