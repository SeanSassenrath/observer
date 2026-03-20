# E2E Testing Strategy

## Goal

Catch regressions in the core user journeys with the smallest possible E2E suite:

1. Auth and onboarding
2. Add meditation files
3. Play a meditation and save history
4. Create, play, and share playlists

This app is a good fit for a narrow smoke suite, not a large matrix. The app has several native integrations, Firebase persistence, async navigation, and local-device file/audio behavior. Those are exactly the places where unit tests will miss real breakage and E2E tests will pay for themselves.

## What The App Actually Does Today

The requested flows are close to the product intent, but the current implementation differs in a few places:

- Unauthenticated users initially land on `PurchaseOnboarding`, not directly on `SignIn`.
- `TermsAgreement` currently navigates to `AddMeditations`, not `Welcome`.
- `Welcome` navigates to `PurchaseOnboarding`.
- The playlist tab is feature-flagged through PostHog (`enable-playlists`).

The E2E plan below tests the intended business flow, but it also calls out where the app currently behaves differently so tests do not encode the wrong assumptions.

## Framework Recommendation

Use **Maestro**.

Why Maestro over Detox:

- Lower setup and maintenance cost for a solo developer.
- Works well for practical black-box flow testing on iOS and Android.
- YAML flows are faster to add and easier to debug than a larger Detox harness.
- Better fit for navigation, forms, toasts, file-import success/error screens, and playlist flows.
- Less dependence on deep React Native internals.

Why not Appium:

- Too much infrastructure and ceremony for the value here.
- Slower authoring loop.
- Overkill unless you need a broader device lab or cross-app automation.

Tradeoff:

- Maestro is weaker than Detox for precise app internals and synchronization.
- To offset that, add a small number of stable `testID`/accessibility hooks and one explicit `E2E_MODE` seam for hard native integrations.

## Testing Philosophy

Keep the suite to three layers:

1. **PR smoke suite**
   Covers only the must-not-break happy paths.
2. **Nightly regression suite**
   Covers a few edge/error paths that touch Firebase, file import, and playlist cleanup.
3. **Unit/integration tests**
   Continue to carry matching logic, reducers/context helpers, duration math, and share URL encode/decode.

Target size:

- 5 to 8 Maestro flows total
- Under 15 minutes on CI

## Recommended Test Environment

### Firebase

Use a **dedicated Firebase test project**, not full mocks.

Reasoning:

- Auth, Firestore writes, and history/playlist persistence are core product behavior.
- Mocking Firebase would make the tests fast but would miss the failures that matter most in this app: auth state changes, document writes, missing collections, security-rule mistakes, and stale onboarding state.

Recommendation:

- Create a separate Firebase project such as `observer-e2e`.
- Use separate iOS/Android config files for E2E builds.
- Seed a small, deterministic dataset:
  - 1 existing user with accepted terms and a few history rows
  - 1 new user path for sign-up
  - 1 user with playlist data
- Add a cleanup script that deletes test users/playlists/history by prefix or test-run id.

### Native Integrations

Do **not** run real third-party providers or real system pickers in CI when a deterministic seam is available.

Use `E2E_MODE=1` to switch these integrations:

- Google Sign-In: replace with a debug-only fake success/failure path
- Apple Sign-In: replace with a debug-only fake success/failure path
- Document picker: inject fixture file selections
- TrackPlayer: use a test audio fixture or fast-finish mode
- Share sheet: intercept and assert the generated playlist URL instead of driving the OS sheet
- PostHog feature flags: force `enable-playlists=true` in E2E mode

This is the right split:

- **Real Firebase**
- **Fake OS/provider integrations**

That gives useful coverage without brittle CI.

## Minimum App Changes Before Writing E2E Tests

These are worth doing first because the app currently has almost no stable selectors.

### 1. Add stable selectors

Add `testID` or accessibility IDs to:

- Auth buttons: email, google, apple
- Email fields and submit button
- Terms scroll view and agree button
- Welcome CTA
- Home screen root and key meditation cards
- Add tab button
- Matching, success, and unrecognized screens
- Meditation intention input and start button
- Player controls: play, pause, finish, close
- Finish screen notes/feedback/done
- Playlist tab, create button, name field, add meditation CTA, begin, share, edit

Prefer semantic IDs like:

- `auth.email.button`
- `terms.agree.button`
- `home.screen`
- `add.matching.screen`
- `player.finish.button`
- `playlist.create.button`

### 2. Add E2E launch configuration

Support a launch arg or env var:

- `E2E_MODE=1`

Use it to:

- enable playlists
- disable animations/timeouts where practical
- inject fake auth providers
- inject file picker fixtures
- optionally shorten playback countdown from 8s to 0s

### 3. Add a small test harness

Expose a debug-only way to:

- sign in as a seeded test user
- reset local AsyncStorage
- clear current user history/playlists
- preload a known meditation file map

This can be a hidden debug screen, a launch arg handler, or deep-link actions. Keep it debug-only.

## Core Flows

## 1. Auth Flow

Flow: sign up/in with Email, Google, Apple -> Terms acceptance -> Welcome -> Home

Note: current code routes differently today. The E2E suite should assert current behavior until the flow is corrected, then update the flow spec.

### Critical path that must work

- User can authenticate with email.
- User who has not accepted terms is blocked on `TermsAgreement`.
- Accepting terms persists and allows entry into the app.
- Returning users bypass auth and terms and land in the main app.

### What to assert at each step

1. Launch logged-out app
- Sign-in options are visible.
- Email sign-in CTA is tappable.
- Google/Apple buttons render on supported platforms.

2. Email sign-up/sign-in
- Invalid email shows validation error.
- Short password shows validation error.
- Valid credentials show loading state.
- Successful auth transitions away from auth screen.

3. Terms
- `I Agree` is disabled before reaching the bottom.
- Scrolling to bottom enables `I Agree`.
- Tapping `I Agree` navigates forward.
- On relaunch, the same user is not sent back to terms.

4. Welcome/home handoff
- Welcome CTA is visible if that screen is part of the flow.
- Entering the app lands on home/tab navigation.
- Home root element is visible.

### Edge cases to cover

- Wrong password error
- Existing email during sign-up
- Network failure on auth
- Terms write failure to Firestore
- App relaunch after auth but before terms acceptance
- App relaunch after terms acceptance
- Google/Apple provider failure path using fake provider responses in `E2E_MODE`

### Practical coverage recommendation

- PR suite:
  - email sign-in happy path
  - returning user bypasses auth
- Nightly:
  - email sign-up path
  - google fake-provider success
  - apple fake-provider success on iOS
  - invalid credentials and network-failure variants

## 2. Add Meditation Flow

Flow: tap Add -> pick files -> matching -> success or unrecognized

### Critical path that must work

- User can add a recognized meditation file.
- Matching completes and the app ends on success.
- Added meditation becomes available from Home/Library sources used by the app.

### What to assert at each step

1. Start import
- Add tab/button is visible.
- Tapping Add opens the import path in E2E mode.

2. File selection
- Fixture file selection returns one recognized file.
- Matching screen appears.
- Matching copy is shown while processing.

3. Success path
- Success screen appears.
- Continue returns to home.
- Newly available meditation is visible/selectable from the app surface that lists user-available meditations.

4. Partial/unrecognized path
- Unrecognized screen shows correct count.
- Continue routes to the manual fix flow if supported.
- Skip returns to the main app without crashing.

### Edge cases to cover

- User cancels picker
- Multiple files where some match and some do not
- Duplicate import of an already-added meditation
- Unsupported file types filtered out
- No cloud catalog loaded or matching fails
- AsyncStorage persistence after app relaunch

### Practical coverage recommendation

- PR suite:
  - one recognized file -> success
- Nightly:
  - mixed recognized/unrecognized import
  - picker cancel
  - relaunch confirms imported meditation still exists

## 3. Play Meditation Flow

Flow: select meditation -> intention/notes -> player -> finish -> history saved

### Critical path that must work

- User can start a meditation from the app.
- Player opens with the expected meditation.
- User can finish a session.
- Session is saved to Firebase history and reflected in-app.

### What to assert at each step

1. Start from home/list
- A known meditation card is visible.
- Tapping it opens the preparation screen.

2. Preparation screen
- Intention input is editable.
- Start button navigates to player.
- If breathwork is optional, base path still works without breathwork selection.

3. Player
- Player screen appears with the correct title.
- Playback starts automatically or can be started manually.
- Finish action is available.

4. Finish screen
- Finish/Thinkbox screen renders.
- Notes and feedback fields accept text.
- Done action exits the flow successfully.

5. Persistence
- Insights/history surface reflects the newly completed session, or
- seeded Firebase record count increases via test harness assertion

### Edge cases to cover

- Meditation file missing locally
- User cancels mid-session
- Partial completion still saves expected time
- Player error / failed track load
- App background/foreground during playback
- History write failure

### Practical coverage recommendation

- PR suite:
  - one seeded meditation -> start -> fast-finish -> save history
- Nightly:
  - cancel flow
  - missing-file toast path
  - relaunch after completion and confirm persisted history

## 4. Playlist Flow

Flow: create playlist -> add meditations -> play playlist -> share playlist

This flow should only run when playlists are forced on in E2E mode.

### Critical path that must work

- User can create a playlist with at least two meditations.
- Playlist appears in the playlist list.
- Starting a playlist opens the player using the first meditation.
- Share action generates a valid share URL.

### What to assert at each step

1. Playlist tab
- Playlist tab is visible when feature flag is enabled.
- Empty state or list renders without error.

2. Create playlist
- Create button opens the form.
- Save is disabled until name and meditations are present.
- Enter playlist name.
- Add meditations using a deterministic seeded set.
- Save returns to playlist list.
- New playlist card is visible with correct title and track count.

3. Playlist preparation
- Playlist detail screen shows title and track count.
- Begin starts playback.
- First meditation in playlist is the one loaded into player.

4. Share
- Share action triggers share handler.
- Shared payload contains a valid encoded URL.
- Decoding the URL produces the expected playlist name and meditation IDs.

### Edge cases to cover

- Feature flag off
- Empty playlist cannot be saved
- One of the playlist meditations was deleted locally and cleanup removes stale entries
- Playlist edit updates order/name
- Share on empty playlist is blocked
- Playlist delete removes it from list

### Practical coverage recommendation

- PR suite:
  - create playlist with two seeded meditations
  - begin playlist playback
- Nightly:
  - share URL assertion
  - stale meditation cleanup
  - edit and delete playlist

## CI Integration

## Recommended shape

### Pull requests

Run:

1. `npm test`
2. `npm run lint`
3. `tsc --noEmit`
4. Maestro smoke suite on one platform

Best default:

- Android emulator on CI for PRs

Reason:

- Cheaper and easier to scale than iOS runners.

### Nightly or main-branch scheduled runs

Run:

- Full Maestro suite on Android
- Full Maestro suite on iOS

### Infrastructure recommendation

Use one of:

- GitHub Actions + Android emulator for PR smoke
- Self-hosted macOS runner or a macOS CI provider for iOS nightly runs

Do not block every PR on full iOS + Android E2E unless the suite stays under roughly 10 minutes and remains stable.

## Suggested suite split

### PR smoke

1. `auth_email_login.yaml`
2. `add_meditation_success.yaml`
3. `play_single_meditation.yaml`
4. `playlist_create_and_begin.yaml`

### Nightly

1. `auth_signup_and_terms.yaml`
2. `auth_google_stub.yaml`
3. `auth_apple_stub_ios.yaml`
4. `add_meditation_partial_match.yaml`
5. `play_cancel_and_resume.yaml`
6. `playlist_share.yaml`
7. `playlist_cleanup_deleted_meditation.yaml`

## What Not To Test

Avoid spending E2E budget on low-value or high-flake areas.

Do not E2E test:

- UI Kitten visual styling details
- Every meditation variant or every catalog item
- Exact animation timing
- Native OS share sheet UI
- Real Google and Apple OAuth flows in CI
- Real document picker UI in CI
- Audio waveform/slider accuracy frame by frame
- Firebase Analytics/PostHog event payloads end to end
- Every error toast copy string
- Exhaustive duration math permutations

Those belong in unit tests, manual spot checks, or one-off release validation.

## Suggested First Iteration

If starting this week, build only this:

1. Add `testID`s to the four core flows.
2. Add `E2E_MODE=1`.
3. Stub document picker, playback completion, share handler, and social auth providers in E2E mode.
4. Point E2E builds to a Firebase test project.
5. Implement 4 PR smoke flows:
   - email login
   - add meditation success
   - play meditation and save history
   - create playlist and begin playback

That will catch most expensive regressions with minimal maintenance.

## Final Recommendation

Use **Maestro + real Firebase test project + fake native/provider seams in `E2E_MODE`**.

That combination is the best balance for this codebase because:

- Firebase persistence is too important to mock away.
- Google/Apple auth, file pickers, audio playback timing, and share sheets are too flaky to drive literally in CI.
- The app currently lacks stable selectors, so the first investment should be test IDs and deterministic seams, not a large test suite.

If the suite stays disciplined and focused on these four flows, it should provide high regression value without becoming its own product.
