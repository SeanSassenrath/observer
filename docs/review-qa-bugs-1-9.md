## QA Bugs 1-9 Review

### 1. Firebase Auth Listener Never Unsubscribed
**Verdict: PASS**

`App.tsx` now calls the unsubscribe function in cleanup (`subscriber();`) instead of evaluating it as a no-op, which closes the leak described in the audit. The change is surgical and I do not see a new race or import issue here. Reference: [App.tsx](/Users/vespermartini/Documents/dev/observer/App.tsx#L251).

### 2. `fbGetMeditationHistory` Returns `undefined` on Error
**Verdict: PASS**

`fbGetMeditationHistory()` now returns a safe fallback object from its `catch`, so the auth flow in `App.tsx` can safely read `meditationInstances` and `lastDocument` even when Firestore fails. This directly addresses the reported crash and is limited to the affected function. It does not fix the separate pagination bug in `fbGetMoreMeditationHistory`, but that is bug 11, not a regression from this change. References: [src/fb/meditationHistory.tsx](/Users/vespermartini/Documents/dev/observer/src/fb/meditationHistory.tsx#L32), [App.tsx](/Users/vespermartini/Documents/dev/observer/App.tsx#L177).

### 3. AppleSSOButton Has No Error Handling
**Verdict: PASS**

The Apple sign-in flow is now wrapped in `try/catch`, which prevents unhandled promise rejections from `performRequest()` and `signInWithCredential()`. That closes the crash path described in the audit. The remaining gap is UX: failures are only logged and `identityToken === null` is still silently ignored, but the core crash issue is fixed. Reference: [src/components/AppleSSOButton/index.tsx](/Users/vespermartini/Documents/dev/observer/src/components/AppleSSOButton/index.tsx#L11).

### 4. Missing `await` on AsyncStorage Write
**Verdict: PASS**

`onAddMeditations()` now awaits `setMeditationFilePathDataInAsyncStorage()` before calling `makeMeditationBaseData()`, and `makeMeditationBaseData()` does indeed read back from AsyncStorage. This directly addresses the stale-read race from the audit. The change is minimal and targeted. References: [src/utils/addMeditations.tsx](/Users/vespermartini/Documents/dev/observer/src/utils/addMeditations.tsx#L75), [src/utils/meditation.ts](/Users/vespermartini/Documents/dev/observer/src/utils/meditation.ts#L93).

### 5. Error Logs Say "success" in Catch Blocks
**Verdict: PASS**

Both catch blocks in `fbAddMeditationHistory()` and `fbUpdateMeditationHistory()` now log `"failed"` instead of `"success"`. This is the exact fix requested, with no unnecessary scope. Reference: [src/fb/meditationHistory.tsx](/Users/vespermartini/Documents/dev/observer/src/fb/meditationHistory.tsx#L82).

### 6. TermsAgreement Updates Firebase But Not Local State
**Verdict: CONCERN**

The fix adds `setUser(updatedUser)` after a successful `fbUpdateUser()`, so the stale-context loop described in the audit is addressed on the success path. The remaining issue is that the code still navigates to `AddMeditations` even when `fbUpdateUser()` returns `false`, because `navigation.navigate('AddMeditations')` sits outside the `didUpdateUser` guard. That means a failed write still leaves local state stale while advancing the user, which is not a regression from the patch but does leave the flow inconsistent. Reference: [src/screens/TermsAgreement.tsx](/Users/vespermartini/Documents/dev/observer/src/screens/TermsAgreement.tsx#L26).

### 7. Welcome Screen Flag Not Persisted to Firebase
**Verdict: CONCERN**

The patch now calls `fbUpdateUser()`, which addresses the original missing-persistence bug on the success path. The problem is that the return value is ignored: the screen still calls `setUser(updatedUser)` and navigates even if the Firebase update failed. In that failure case, the restart behavior from the audit still occurs because the flag never persisted. This should either gate navigation on a successful update or provide a fallback/error path. Reference: [src/screens/Welcome.tsx](/Users/vespermartini/Documents/dev/observer/src/screens/Welcome.tsx#L16).

### 8. `fbAddUser` Failure Leaves App on Splash Screen Forever
**Verdict: PASS**

`App.tsx` now clears `initializing` in the `fbAddUser()` failure branch, which fixes the reported infinite splash state. The change is surgical and does not introduce obvious control-flow problems. The remaining product issue is that a signed-in Firebase user with a failed profile write still lands in a partially initialized state, but the specific bug in the audit is resolved. Reference: [App.tsx](/Users/vespermartini/Documents/dev/observer/App.tsx#L216).

### 9. CI Pipeline Missing Lint and Type Checks
**Verdict: PASS**

The workflow now runs `npm run lint` and `npx tsc --noEmit` before tests, which matches the audit recommendation and is confined to CI config. I could not validate execution locally because this workspace does not currently have dependencies installed (`eslint` and `jest` were not available), but the workflow change itself is correct. Reference: [.github/workflows/ci.yml](/Users/vespermartini/Documents/dev/observer/.github/workflows/ci.yml#L18).

## Overall Verdict

**Overall: CONCERN**

Bugs 1-5, 8, and 9 are fixed cleanly. Bugs 6 and 7 are only partially robust because both onboarding screens continue navigating after failed `fbUpdateUser()` calls, which leaves the client state and persisted state out of sync. That does not invalidate the main fix intent, but it is enough that I would not sign this off as fully reliable without tightening those two flows.

## Recommendations

- In `TermsAgreement`, only navigate after `fbUpdateUser()` succeeds; otherwise keep the user on the screen and surface an error.
- In `Welcome`, check the boolean result from `fbUpdateUser()` before mutating local state or navigating.
- Once dependencies are installed, run `npm run lint`, `npx tsc --noEmit`, and `npm test` to verify the new CI steps and catch any environment-specific issues.
