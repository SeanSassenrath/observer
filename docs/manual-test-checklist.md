# Manual Test Checklist

Use this on a device or simulator to validate QA bugs 1-15 in roughly 15-20 minutes.

## Auth

### Bug 1. Firebase Auth Listener Never Unsubscribed
- What to test:
  1. Launch the app from a cold start.
  2. Sign in.
  3. Sign out.
  4. Sign back in two or three times without reinstalling.
  5. Watch for duplicated redirects, duplicated loading states, or repeated auth-driven side effects.
- Expected behavior:
  The auth flow runs once per sign-in or sign-out transition. No duplicate navigation or repeated listener behavior appears after multiple cycles.
- How to trigger the edge case:
  Repeat sign-in and sign-out several times in one session. This previously exposed stacked auth listeners.

### Bug 2. `fbGetMeditationHistory` Returns `undefined` on Error
- What to test:
  1. Put the device in airplane mode or disable network.
  2. Launch the app and sign in with an existing account.
  3. Let the app finish the initial auth flow that loads meditation history.
- Expected behavior:
  The app does not crash during login even if history cannot be fetched. The user should still reach the app shell with empty or unchanged history state.
- How to trigger the edge case:
  Keep network disabled while the app attempts to fetch meditation history during sign-in.

### Bug 3. AppleSSOButton Has No Error Handling
- What to test:
  1. Go to the sign-in screen.
  2. Start Apple Sign-In.
  3. Cancel the Apple sheet or use a test setup that causes Apple auth to fail.
- Expected behavior:
  The app remains stable and returns control to the sign-in screen without crashing.
- How to trigger the edge case:
  Dismiss the Apple sign-in modal before completion or use invalid Apple auth conditions.

### Bug 10. EmailSignIn Timeout Not Cleaned Up on Unmount
- What to test:
  1. Sign in with email so the screen begins its post-login redirect delay.
  2. Immediately navigate away, background the app, or trigger a fast screen transition before the 1 second timeout completes.
  3. Repeat a few times.
- Expected behavior:
  No warning about updating state after unmount. The app should not show delayed, unexpected navigation from a stale timer.
- How to trigger the edge case:
  Leave `EmailSignIn` immediately after a successful login, before the delayed redirect finishes.

## Onboarding

### Bug 6. TermsAgreement Updates Firebase But Not Local State
- What to test:
  1. Use an account that has not accepted terms yet.
  2. Open Terms Agreement.
  3. Scroll to the bottom and tap `I Agree`.
  4. Continue through the next onboarding screen.
  5. Navigate back or restart the app.
- Expected behavior:
  The app should remember that terms were accepted and should not send the user back to Terms Agreement on the next route calculation.
- How to trigger the edge case:
  Before the fix, accepting terms and then backing out or restarting could loop the user back into Terms because local state stayed stale.

### Bug 7. Welcome Screen Flag Not Persisted to Firebase
- What to test:
  1. Use a user who has not seen the Welcome screen.
  2. Tap the button to continue past Welcome.
  3. Fully kill the app.
  4. Reopen it and sign back in if needed.
- Expected behavior:
  Welcome should not appear again after it has been completed once.
- How to trigger the edge case:
  Complete Welcome, then fully restart the app to verify the flag was persisted and not only kept in memory.

### Bug 8. `fbAddUser` Failure Leaves App on Splash Screen Forever
- What to test:
  1. Create a new user or use a setup that exercises the new-user creation path.
  2. Simulate a Firestore write failure during profile creation if possible by disabling network at the right moment.
  3. Watch the app after the failure.
- Expected behavior:
  The app should exit the splash/loading state instead of hanging forever.
- How to trigger the edge case:
  Interrupt connectivity while the app is attempting the first `fbAddUser()` write.

### Bug 14. TermsAgreement Error Silently Swallowed
- What to test:
  1. Open Terms Agreement with a user who still needs to accept.
  2. Disable network before tapping `I Agree`.
  3. Tap `I Agree`.
- Expected behavior:
  A user-facing error message appears indicating the agreement could not be saved. The app should not fail silently.
- How to trigger the edge case:
  Force the save to fail by turning off network before confirming the agreement.

## Add Meditation

### Bug 4. Missing `await` on AsyncStorage Write
- What to test:
  1. Add one or more meditation files from the Add Meditations flow.
  2. Wait for the import to complete.
  3. Fully kill the app.
  4. Reopen it and verify the imported meditations are still present.
- Expected behavior:
  Newly added meditation file paths and generated meditation data persist after restart.
- How to trigger the edge case:
  Add meditations and restart the app immediately after import completes. This used to expose the race between AsyncStorage write and subsequent read.

## Play Meditation

### Bug 5. Error Logs Say "success" in Catch Blocks
- What to test:
  1. Start a meditation session that will save or update meditation history.
  2. Simulate a Firestore failure during the history write or update.
  3. Check device logs or Metro logs.
- Expected behavior:
  Failed history writes should log a failure message, not a success message.
- How to trigger the edge case:
  Disable network right before the app saves meditation history, then inspect the log output.

### Bug 11. `fbGetMoreMeditationHistory` Crashes With Empty History
- What to test:
  1. Use an account with no meditation history.
  2. Open the screen that loads meditation history and attempt to paginate or load more.
- Expected behavior:
  No crash occurs. The UI should remain empty or unchanged when there is no last document to paginate from.
- How to trigger the edge case:
  Use a brand-new account with zero history and perform the action that requests more history.

### Bug 12. MeditationPlayer Renders "undefined" for Track Title
- What to test:
  1. Start playback in a scenario where the track queue may briefly be empty or not yet resolved.
  2. Watch the title area at the top of `MeditationPlayer`.
- Expected behavior:
  The title should show a safe fallback label instead of the literal text `undefined`.
- How to trigger the edge case:
  Enter the player quickly on a slow device or with a setup where the track list is empty or the current index is out of bounds.

### Bug 13. Stack.tsx `onReady` Crashes if Route is Undefined
- What to test:
  1. Launch the app from a cold start several times.
  2. Also test opening the app from background and after a force quit.
- Expected behavior:
  The app should initialize navigation without crashing, even if the current route is temporarily unavailable during startup.
- How to trigger the edge case:
  Cold start the app repeatedly. This bug was intermittent during early navigation initialization.

## Profile

### Bug 15. Profile Image Upload Has No Error Handling
- What to test:
  1. Open Profile.
  2. Tap the avatar edit control and choose an image.
  3. Confirm that the loading toast appears.
  4. Repeat once with network disabled before upload completes.
- Expected behavior:
  On success, the photo updates and the success toast appears. On failure, the loading toast is cleared and an error toast appears instead of leaving the UI stuck.
- How to trigger the edge case:
  Turn off network after selecting an image but before Firebase Storage upload finishes.

## CI

### Bug 9. CI Pipeline Missing Lint and Type Checks
- What to test:
  1. Open the CI workflow config.
  2. Confirm the workflow includes lint, TypeScript type-checking, and tests.
  3. If local dependencies are available, run the same commands locally.
- Expected behavior:
  CI should run lint, `tsc --noEmit`, and test commands as part of validation.
- How to trigger the edge case:
  Review the workflow file directly and, if practical, introduce a temporary lint or type error locally to confirm those checks would fail.
