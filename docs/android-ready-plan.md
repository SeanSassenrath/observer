# Plan: Make Unlimited Meditations Android-Ready

## Context

The app was built iOS-first and has never been run on Android. The Android directory exists from the React Native template but has no Firebase configuration, insufficient permissions, and several code paths that only work on iOS. This plan covers everything needed to get a working Android build with feature parity.

---

## Phase 1: Firebase Configuration (Build-Blocking)

### 1.1 — Manual: Add google-services.json

**You must do this in the Firebase Console before any code changes will matter.**

1. Go to https://console.firebase.google.com/project/observer-e8e74/settings/general
2. If no Android app exists with package name `com.unlimited`, click "Add app" and register one
3. Download `google-services.json` → place at `android/app/google-services.json`
4. Add it to `.gitignore` if not already there (contains API keys)

### 1.2 — Add Firebase Gradle plugins

**`android/build.gradle`** — add to `dependencies` block inside `buildscript`:

```groovy
classpath("com.google.gms:google-services:4.3.15")
classpath("com.google.firebase:firebase-crashlytics-gradle:2.9.9")
```

**`android/app/build.gradle`** — add before the final `apply from:` line (line 123):

```groovy
apply plugin: "com.google.gms.google-services"
apply plugin: "com.google.firebase.crashlytics"
```

### 1.3 — Manual: Register SHA-1 for Google Sign-In

1. Run: `keytool -list -v -keystore android/app/debug.keystore -alias androiddebugkey -storepass android -keypass android`
2. Copy the SHA-1 fingerprint
3. In Firebase Console → Project Settings → Android app → Add SHA-1
4. Re-download `google-services.json` (it updates with OAuth client info)

---

## Phase 2: Android Permissions & Manifest

**`android/app/src/main/AndroidManifest.xml`**

Add permissions before `<application>`:

```xml
<!-- File access for document picker -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
<uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />

<!-- Notifications (Android 13+) -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

<!-- Background audio playback -->
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK" />
```

Add Track Player service inside `<application>`, after `</activity>`:

```xml
<service
    android:name="com.doublesymmetry.trackplayer.service.MusicService"
    android:exported="false"
    android:foregroundServiceType="mediaPlayback">
    <intent-filter>
        <action android:name="android.intent.action.MEDIA_BUTTON" />
    </intent-filter>
</service>
```

---

## Phase 3: Fix File Path Handling (Core Feature Bug)

Both `makeRelativeFilePath` functions return `undefined` on Android due to `Platform.OS === 'ios'` guards. This breaks all file matching and playback.

### 3.1 — `src/services/matchingService.ts` (line 18-25)

Replace with platform-aware logic:

```typescript
function makeRelativeFilePath(absoluteFilePath: string | null) {
  if (!absoluteFilePath) return undefined;

  if (Platform.OS === 'ios') {
    const splitFilePath = absoluteFilePath.split('/');
    return splitFilePath
      .slice(splitFilePath.length - 2, splitFilePath.length)
      .join('/');
  }

  // Android: fileCopyUri is file:///data/user/0/com.unlimited/files/filename.mp3
  // RNFS.DocumentDirectoryPath is /data/user/0/com.unlimited/files
  // We need just the filename to concatenate with DocumentDirectoryPath in track.ts
  const uri = absoluteFilePath.replace('file://', '');
  const splitFilePath = uri.split('/');
  return splitFilePath[splitFilePath.length - 1];
}
```

### 3.2 — `src/utils/filePicker.ts` (line 1226-1233)

Apply the same fix — identical logic.

---

## Phase 4: Bump SDK Versions

**`android/build.gradle`** — update:

```groovy
compileSdkVersion = 34  // was 33
targetSdkVersion = 34   // was 33
```

Required for `FOREGROUND_SERVICE_MEDIA_PLAYBACK` (Android 14) and Google Play Store submission compliance.

---

## Phase 5: Fix Platform-Specific Libraries

### 5.1 — `react-native-store-review` (iOS-only, will crash on Android)

**`src/screens/Insight.tsx`** (lines 5, 134) — wrap with Platform check:

```typescript
import {Platform} from 'react-native';
// ...
useEffect(() => {
  if (Platform.OS === 'ios') {
    StoreReview.requestReview();
  }
}, []);
```

### 5.2 — Exclude unused native modules from Android autolinking

**`react-native.config.js`** — add Android exclusions:

```javascript
dependencies: {
  'react-native-purchases': {
    platforms: {
      ios: null,
      android: null,  // add this
    },
  },
  'react-native-live-audio-fft': {
    platforms: {
      android: null,  // unused, prevent potential build errors
    },
  },
},
```

---

## Phase 6: App Branding

### 6.1 — Replace default launcher icons

The mipmap directories have generic React Native icons. Replace with the app's icon:

- Use Android Asset Studio or Android Studio to generate all density variants
- Replace `ic_launcher.png` and `ic_launcher_round.png` in each `mipmap-*` directory
- Optionally add adaptive icon resources for Android 8+ (`mipmap-anydpi-v26/`)

### 6.2 — Verify app display name

**`android/app/src/main/res/values/strings.xml`** — confirm `app_name` is "Unlimited" (it already is).

---

## Phase 7: Release Signing (for Play Store)

### 7.1 — Create production keystore

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore android/app/unlimited-release.keystore -alias unlimited-key -keyalg RSA -keysize 2048 -validity 10000
```

**Back up this keystore securely. If lost, you cannot update the app.**

### 7.2 — Configure release signing in `android/app/build.gradle`

Add a `release` signing config and update release buildType to use it. Store passwords in environment variables or `~/.gradle/gradle.properties`, not in the committed code.

### 7.3 — Register release SHA-1 in Firebase Console

Same process as Phase 1.3 but with the production keystore.

### 7.4 — Update version code/name

Currently `versionCode 1` / `versionName "1.0"`. Set to match your iOS version before Play Store submission.

---

## Files Modified (Code Changes Only)

| File                                       | Change                                       |
| ------------------------------------------ | -------------------------------------------- |
| `android/build.gradle`                     | Add Firebase classpath deps, bump SDK to 34  |
| `android/app/build.gradle`                 | Add Firebase plugins, release signing config |
| `android/app/src/main/AndroidManifest.xml` | Add permissions + Track Player service       |
| `src/services/matchingService.ts`          | Fix `makeRelativeFilePath` for Android       |
| `src/utils/filePicker.ts`                  | Fix `makeRelativeFilePath` for Android       |
| `src/screens/Insight.tsx`                  | Platform guard for StoreReview               |
| `react-native.config.js`                   | Exclude unused modules from Android          |

## Manual Steps Required (Outside Codebase)

1. Firebase Console: Register Android app + download `google-services.json`
2. Firebase Console: Add debug SHA-1 fingerprint
3. Generate app icon assets for all Android densities
4. Create production keystore (when ready for Play Store)
5. Firebase Console: Add production SHA-1 fingerprint

## Verification

After all changes, test on an Android emulator or device:

1. `cd android && ./gradlew clean` then `npm run android` — app builds and launches
2. Sign up / sign in with email — Firebase Auth works
3. Sign in with Google — no DEVELOPER_ERROR
4. Apple Sign-In button is hidden (already handled)
5. Add meditation files via document picker — files match correctly, paths stored
6. Play a meditation — audio plays, continues when app backgrounded
7. Check Insights screen — no crash from StoreReview
8. Notification permission prompt appears on Android 13+
9. Meditation history syncs to Firestore
10. Check Firebase Crashlytics and Analytics dashboards for Android events
