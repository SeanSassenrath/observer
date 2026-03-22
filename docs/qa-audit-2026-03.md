# QA Audit: Full User Journey Review

**Date:** March 2026
**Scope:** New user onboarding through core meditation usage
**Bugs found:** 15

---

## Critical Bugs (App Crashes / Data Loss)

### 1. Firebase Auth Listener Never Unsubscribed

**File:** `App.tsx:247`
**Impact:** Memory leak, duplicate auth events

`subscriber;` is a no-op — should be `subscriber();` to invoke the unsubscribe function. Auth listeners stack up on every re-render.

### 2. `fbGetMeditationHistory` Returns `undefined` on Error, Crashes Auth Flow

**File:** `src/fb/meditationHistory.tsx:32-34`, `App.tsx:175-179`
**Impact:** App crashes if Firestore query fails during login

The `.catch()` handler returns nothing, so callers receive `undefined`. `App.tsx:177` then accesses `_meditationHistory.meditationInstances` on undefined, crashing the entire auth flow.

**Fix:** Return `{ meditationInstances: [], lastDocument: undefined }` in catch.

### 3. AppleSSOButton Has No Error Handling

**File:** `src/components/AppleSSOButton/index.tsx`
**Impact:** App crashes on any Apple Sign-In failure

No try-catch wrapping the async flow. Any error in `performRequest()` or `signInWithCredential()` causes an unhandled promise rejection. GoogleSSOButton has proper error handling — Apple should match.

### 4. Missing `await` on AsyncStorage Write

**File:** `src/utils/addMeditations.tsx:76`
**Impact:** Meditation file paths may not persist after restart

`setMeditationFilePathDataInAsyncStorage(filePathDataList)` is async but not awaited. The next line calls `makeMeditationBaseData()` which may read stale/empty data from AsyncStorage.

### 5. Copy-Paste Bug: Error Logs Say "success" in Catch Blocks

**File:** `src/fb/meditationHistory.tsx:79, 102`
**Impact:** Errors masked in production debugging

Both `fbAddMeditationHistory` and `fbUpdateMeditationHistory` log `"FB add/update meditation history success:"` inside their `.catch()` handlers. Should say `"failed"`.

---

## High-Priority Bugs (Broken Flows / Stale State)

### 6. TermsAgreement Updates Firebase But Not Local State

**File:** `src/screens/TermsAgreement.tsx:17-33`
**Impact:** Potential onboarding loop

Writes `termsAgreement.hasAccepted = true` to Firestore but never calls `setUser()`. Local context still has `hasAccepted = false`. If user navigates back, `getInitialRouteName()` in Stack.tsx routes them back to Terms.

**Fix:** Add `setUser(updatedUser)` after successful Firebase update.

### 7. Welcome Screen Flag Not Persisted to Firebase

**File:** `src/screens/Welcome.tsx:15-24`
**Impact:** Welcome screen repeats on every app restart

`onStartPress` calls `setUser()` to update local state but never calls `fbUpdateUser()`. The `hasSeenWelcome` flag is lost when the app restarts.

### 8. `fbAddUser` Failure Leaves App on Splash Screen Forever

**File:** `App.tsx:214-220`
**Impact:** New user permanently stuck on loading

If `fbAddUser()` returns false (write failure), `setInitializing(false)` is never called. There's no else/catch path that transitions out of the loading state.

### 9. CI Pipeline Missing Lint and Type Checks

**File:** `.github/workflows/ci.yml`
**Impact:** TypeScript errors and lint violations can ship to production

The pipeline only runs `npm test`. Missing `npm run lint` and `npx tsc --noEmit` which were presumably removed in a recent commit.

---

## Medium-Priority Bugs (Edge Cases / UX)

### 10. EmailSignIn Timeout Not Cleaned Up on Unmount

**File:** `src/screens/EmailSignIn.tsx:40-59`
**Impact:** setState on unmounted component warning

`setTimeout` with 1s delay fires after component may have unmounted. The timeout reference is never stored or cleared in a cleanup function.

### 11. `fbGetMoreMeditationHistory` Crashes With Empty History

**File:** `src/fb/meditationHistory.tsx:47`
**Impact:** Crash when paginating from empty state

`.startAfter(lastDocument)` throws if `lastDocument` is undefined (which happens when history is empty, since `docs[docs.length - 1]` on an empty array is undefined).

### 12. MeditationPlayer Renders "undefined" for Track Title

**File:** `src/screens/MeditationPlayer.tsx:330`
**Impact:** "undefined" shown as meditation name

`tracks[currentTrackIndex]` can be undefined if the tracks array is empty or the index is out of bounds. No fallback text is provided.

### 13. Stack.tsx `onReady` Crashes if Route is Undefined

**File:** `src/navigation/Stack.tsx:79`
**Impact:** Crash on app initialization

`navigationRef.current.getCurrentRoute().name` has no null check. `getCurrentRoute()` can return undefined before navigation is fully initialized.

**Fix:** Use optional chaining: `navigationRef.current?.getCurrentRoute()?.name`

### 14. TermsAgreement Error Silently Swallowed

**File:** `src/screens/TermsAgreement.tsx:30-32`
**Impact:** User gets no feedback when agreement fails to save

The `.catch()` only logs to console. User taps "I Agree" and nothing happens with no indication of what went wrong.

### 15. Profile Image Upload Has No Error Handling

**File:** `src/screens/Profile.tsx`
**Impact:** "Adding photo" toast shown forever on failure

`ref.putFile()` and `ref.getDownloadURL()` are not wrapped in try-catch. If Firebase Storage upload fails, the loading state never resolves.

---

## Recommended Fix Order

| Batch | Items | Focus                |
| ----- | ----- | -------------------- |
| 1     | 1-5   | Critical crash fixes |
| 2     | 6-9   | Broken user flows    |
| 3     | 10-15 | Edge cases and UX    |

## Verification Checklist

- [ ] Run `npm test` after each batch
- [ ] Run `npm run lint`
- [ ] New user signup with all 3 auth methods (Email, Google, Apple)
- [ ] Complete Terms → Add Meditations → Home flow
- [ ] Play meditation end-to-end, verify history saved
- [ ] Kill app mid-flow, reopen, verify state persisted
- [ ] Cancel file picker from different screens (Tab, Home, AddMeditations)
- [ ] Test with network off during Firebase operations
