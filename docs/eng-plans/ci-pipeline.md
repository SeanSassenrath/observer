# CI Pipeline Audit And Engineering Plan

Date: 2026-03-20

## Scope

This document audits the current CI and testing setup for the React Native app and proposes a practical pipeline that validates JavaScript, TypeScript, and native build health for iOS and Android.

## Current State Summary

### CI workflow

Current workflow: [`.github/workflows/ci.yml`](/Users/vespermartini/Documents/dev/observer/.github/workflows/ci.yml)

What exists today:

- One GitHub Actions workflow named `CI`
- Triggers on push and pull request to `main`
- Single Ubuntu job
- Steps:
  - `npm ci`
  - `npm run lint`
  - `npx tsc --noEmit`
  - `npm test`

What is good:

- Basic JS quality gates are present in CI
- `npm ci` implies deterministic dependency installation from lockfile
- The workflow already covers the three most important JS checks

Current gaps:

- No separate job boundaries, so native checks cannot be isolated or parallelized
- No cache strategy beyond npm cache
- No test coverage upload or threshold enforcement
- No build verification step for app bundles
- No iOS/macOS validation
- No Android Gradle validation
- No E2E or smoke test job
- No artifact retention for logs, junit, coverage, APK/AAB, or xcresult

### Local execution audit

Observed in this checkout:

- `package-lock.json` exists
- `node_modules/` is missing

Result of running the same CI commands locally:

- `npm test -- --runInBand` fails immediately with `sh: jest: command not found`
- `npm run lint` fails immediately with `sh: eslint: command not found`
- `npx tsc --noEmit` could not be meaningfully validated in this checkout because local dependencies are not installed

Interpretation:

- The repo is configured for `npm ci`, but this workspace is not currently bootstrapped
- I could not verify pass/fail status of Jest, ESLint, or TypeScript in the current local environment
- The CI file is likely the authoritative path for these checks right now

### Jest and test inventory

Primary config: [`package.json`](/Users/vespermartini/Documents/dev/observer/package.json)

Current Jest setup:

- `npm test` maps to `jest`
- Jest config is embedded in `package.json`
- Preset: `react-native`
- Setup file: [`jest.setup.js`](/Users/vespermartini/Documents/dev/observer/jest.setup.js)
- Broad native-module mocking exists for AsyncStorage, Firebase, Track Player, Document Picker, PostHog, gesture handler, and toast APIs

Observed Jest test files:

- `__tests__/addMeditations.test.ts`
- `__tests__/fb/auth.test.ts`
- `__tests__/fuzzyMeditationMatching.test.ts`
- `__tests__/fuzzyMeditationMatchingExpanded.test.ts`
- `__tests__/matchingService.test.ts`
- `__tests__/meditationUtils.test.ts`
- `__tests__/navigation/authRouting.test.ts`
- `__tests__/streaks.test.ts`
- `__tests__/App-test.tsx`
- `src/utils/meditations/meditations.test.ts`
- `src/utils/streaks.test.ts`

Approximate test volume from static scan:

- 11 Jest test files
- 144 `it()` / `test()` blocks
- 34 `describe()` blocks

Important nuance:

- `__tests__/App-test.tsx` is a placeholder that asserts `true === true`
- Most current tests are unit or utility focused
- `__tests__/navigation/authRouting.test.ts` is closer to integration-style logic coverage, but it still runs in Jest with mocks, not in a device runtime

### Coverage configuration

What exists:

- A committed `coverage/` directory with `coverage-final.json`, `lcov.info`, and HTML report

What does not exist in Jest config:

- No `collectCoverage`
- No `collectCoverageFrom`
- No `coverageThreshold`
- No explicit coverage reporters
- No CI step that generates or uploads coverage
- No failure gate tied to coverage

What the committed report shows:

- Coverage report generated at `2026-02-22T05:30:26.345Z`
- Aggregate coverage in the checked-in HTML report:
  - Statements: `76.08%` (`264/347`)
  - Branches: `66.33%` (`132/199`)
  - Functions: `70.68%` (`41/58`)
  - Lines: `76.23%` (`263/345`)
- The report covers only 6 source files:
  - `src/fb/auth.tsx`
  - `src/services/matchingService.ts`
  - `src/utils/addMeditations.tsx`
  - `src/utils/meditation.ts`
  - `src/utils/meditations/meditations.ts`
  - `src/utils/streaks.ts`

Interpretation:

- Coverage currently appears to be an ad hoc local artifact, not a reliable CI signal
- The checked-in report is too narrow to represent app-wide quality
- Committing coverage output to the repo is generally noise unless there is a specific reporting workflow

### ESLint and Prettier

Current lint config: [`.eslintrc.js`](/Users/vespermartini/Documents/dev/observer/.eslintrc.js)

Current formatter config: [`.prettierrc.js`](/Users/vespermartini/Documents/dev/observer/.prettierrc.js)

What exists:

- ESLint extends `@react-native-community` and `prettier`
- TypeScript parser and plugin are configured
- TS override includes:
  - `@typescript-eslint/no-shadow: error`
  - `react-hooks/exhaustive-deps: warn`
- Prettier formatting rules are defined
- There is a `format:check` npm script

Current gaps:

- CI does not run `npm run format:check`
- ESLint version is old relative to the React Native toolchain
- No explicit import/order, complexity, or testing-specific lint rules
- No dedicated linting for GitHub Actions, JSON, Markdown, Podfiles, or Gradle files

### Native project and release setup

Native project evidence:

- Android Gradle project exists under [`android/`](/Users/vespermartini/Documents/dev/observer/android)
- iOS Xcode project and Podfile exist under [`ios/`](/Users/vespermartini/Documents/dev/observer/ios)

Important native characteristics:

- React Native `0.72.9`
- iOS deployment target `15.0` in [`ios/Podfile`](/Users/vespermartini/Documents/dev/observer/ios/Podfile)
- Firebase native modules are installed
- Track Player, Reanimated, Google Sign-In, Apple Auth, Document Picker, Video, and other native dependencies are present
- Android release build currently signs with the debug keystore in [`android/app/build.gradle`](/Users/vespermartini/Documents/dev/observer/android/app/build.gradle)

Interpretation:

- This is not a pure JS app; native compile validation is required
- JS-only CI is insufficient because Pod resolution, Gradle plugin changes, native module compatibility, and release packaging can break independently of Jest/TS

### E2E and integration testing

What exists:

- No Detox config
- No Maestro flows
- No Playwright/Cypress/Appium config
- No integration-test runner outside Jest
- A planning document exists at [`docs/e2e-testing-strategy.md`](/Users/vespermartini/Documents/dev/observer/docs/e2e-testing-strategy.md)
- A manual QA checklist exists at [`docs/manual-test-checklist.md`](/Users/vespermartini/Documents/dev/observer/docs/manual-test-checklist.md)

Interpretation:

- There is no automated end-to-end coverage today
- Native integrations and multi-screen user journeys are currently protected mainly by manual testing and mocks

## Assessment

The current setup is a reasonable JS baseline but not yet a React Native CI pipeline.

It can catch:

- Basic lint regressions
- TypeScript issues
- Unit-test regressions

It does not reliably catch:

- iOS pod or Xcode build breakage
- Android Gradle or manifest breakage
- Release build/package issues
- Device-runtime regressions in auth, file import, playback, navigation, and persistence
- Coverage regressions
- Formatting drift

## Recommended CI Pipeline

## Phase 1: Harden the current JS pipeline

Goal: make the existing workflow trustworthy and reproducible.

Recommended changes:

- Split current workflow into explicit jobs:
  - `quality`
  - `unit-tests`
- Add `npm run format:check`
- Run Jest with coverage in CI
- Add junit and lcov artifacts
- Enforce modest initial coverage thresholds
- Fail fast on missing lockfile drift

Recommended commands:

- `npm ci`
- `npm run format:check`
- `npm run lint`
- `npx tsc --noEmit`
- `npm test -- --ci --runInBand --coverage`

Initial coverage thresholds:

- Statements: `70%`
- Lines: `70%`
- Functions: `65%`
- Branches: `55%`

Rationale:

- These thresholds are below the currently committed aggregate report, so they should be achievable without creating churn
- Branch coverage is the weakest area and should start lower

### Phase 2: Add Android native verification

Goal: catch Gradle and Android packaging failures on PRs.

Recommended PR checks:

- `./gradlew :app:assembleDebug`
- Optional if build time is acceptable: `./gradlew :app:assembleRelease`

Recommended nightly checks:

- `./gradlew :app:bundleRelease`
- `./gradlew test`
- `./gradlew lint`

Why this matters:

- React Native Android breakage often comes from Gradle, AndroidManifest, AGP, dependency, NDK, or native module changes
- `assembleDebug` is a good default smoke gate
- `bundleRelease` is a better distribution proxy than JS tests alone

### Phase 3: Add iOS native verification

Goal: validate that the iOS app compiles after Pod install and native dependency changes.

Recommended PR checks on `macos-latest`:

- `bundle exec pod install` in `ios/`
- `xcodebuild -workspace Unlimited.xcworkspace -scheme Unlimited -configuration Debug -sdk iphonesimulator -destination 'platform=iOS Simulator,name=iPhone 15' build`

Recommended nightly checks:

- Release configuration simulator build
- Archive dry run if signing/cert setup is available

Why this matters:

- The app depends on several native pods with known breakage potential
- The Podfile contains custom post-install logic and workaround code; that is exactly the kind of thing CI should compile regularly

### Phase 4: Add device-level smoke tests

Goal: validate real user journeys that mocks cannot protect.

Recommended framework:

- Maestro first

Why Maestro:

- Lower maintenance overhead than Detox
- Good fit for authentication, onboarding, import, playback, and playlist smoke paths
- Matches the existing repo direction in [`docs/e2e-testing-strategy.md`](/Users/vespermartini/Documents/dev/observer/docs/e2e-testing-strategy.md)

Recommended PR smoke suite:

- Email sign-in happy path
- Returning user lands in app shell
- Add one meditation via E2E fixture path
- Start and finish one meditation

Recommended nightly suite:

- Terms acceptance edge case
- Import failure path
- Playlist create/share flow
- Android-specific and iOS-specific auth provider flows where applicable

### Phase 5: Optional hosted build integration

Goal: add cloud-native build confidence for release workflows.

EAS build assessment:

- There is no `eas.json`
- This repo is not currently set up as an Expo/EAS-managed build workflow
- EAS is not required to get strong CI for this app

Recommendation:

- Do not make EAS a prerequisite for CI hardening
- First add direct `gradlew` and `xcodebuild` checks
- Consider EAS only if the team wants:
  - hosted iOS/Android build infrastructure
  - internal build distribution
  - credential management in Expo services

If EAS is adopted later:

- Add `eas.json`
- Create preview and production profiles
- Run EAS builds on merge-to-main or release branches, not on every PR
- Keep PR-native compile checks with `gradlew` and `xcodebuild` because they are faster and easier to debug

## Recommended Test Strategy For This App

This is a meditation app with native modules, local persistence, playback, auth, and cross-screen onboarding. The test strategy should reflect that.

### Unit test targets

Focus unit tests on deterministic business logic:

- Meditation matching and fuzzy matching
- Duration, streak, and history calculations
- Playlist ordering and share-link encode/decode
- Reducers, selectors, and state transitions
- Validation and error-mapping helpers
- Analytics payload shaping

Unit-test guidance:

- Prefer fast tests with minimal React rendering
- Avoid snapshot-heavy coverage
- Add coverage around branches and edge conditions, not just happy paths

### Integration test targets

Use Jest-based integration tests for screen and navigation logic with mocked boundaries:

- Auth routing decisions
- Terms/onboarding route progression
- Add-meditation flow state transitions
- Player completion and history-save orchestration
- Playlist creation and editing logic
- Error handling on Firebase failures

Integration-test guidance:

- Mock external providers, but test the app’s orchestration logic
- Prefer rendering screens/providers over isolated helper-only tests when user flow logic is involved
- Add assertions on visible UI states and navigation outcomes

### E2E test targets

Use device-level smoke tests for the highest-risk user journeys:

- Auth and onboarding
- Add/import meditation flow
- Playback start, progress, and completion
- History persistence after completion
- Playlist create, play, and share
- Profile image upload failure handling

Recommended seams for E2E:

- `E2E_MODE=1`
- Stable `testID` values
- Fake system-provider responses for Apple Sign-In, Google Sign-In, document picker, and share sheet
- Real or dedicated test Firebase project for auth and persistence if feasible

### What to test specifically for a React Native meditation app

Highest-value behavior:

- User can always reach a playable meditation state
- Meditation completion updates history and streaks correctly
- Imported content persists across app restarts
- Onboarding gates do not loop or strand users
- Playback controls handle empty, loading, and finished states safely
- Native auth and media dependencies degrade cleanly on failure
- Playlist flows preserve ordering and shared-link correctness

## Recommended Workflow Structure

### Pull request pipeline

Run on every PR:

- Install dependencies
- Format check
- ESLint
- TypeScript check
- Jest with coverage
- Android debug assemble
- iOS simulator debug build

Recommended policy:

- JS jobs may run on Ubuntu
- iOS build must run on macOS
- Android and JS jobs should run in parallel

### Main branch / nightly pipeline

Run on merge to `main` or nightly:

- Full PR pipeline
- Android release bundle build
- iOS release build or archive dry run
- Maestro smoke suite on at least one platform
- Coverage trend/report publication

### Release pipeline

Run on release tags or release branches:

- Production Android artifact build
- Production iOS archive/build
- Optional EAS build submission if adopted later
- Upload artifacts and build metadata

## Priority Order

1. Make JS CI reproducible and coverage-enforced
2. Add Android compile/package validation
3. Add iOS compile validation on macOS
4. Add narrow Maestro smoke tests for core journeys
5. Add hosted build/release integration only if operationally useful

## Estimated Effort

### Phase 1: JS pipeline hardening

Effort: `0.5 to 1.5 days`

Includes:

- Refactor GitHub Actions jobs
- Add coverage script/config
- Add thresholds
- Upload test and coverage artifacts
- Add format check

### Phase 2: Android native checks

Effort: `1 to 2 days`

Includes:

- CI job setup
- Gradle caching
- Debug assemble stabilization
- Optional release bundle smoke

Risk:

- Native dependency and environment issues may expand this to `3 days`

### Phase 3: iOS native checks

Effort: `1.5 to 3 days`

Includes:

- macOS runner setup
- CocoaPods install handling
- Xcode scheme/workspace verification
- Simulator build stabilization

Risk:

- Podfile workaround logic and Firebase/native pods may require iteration

### Phase 4: E2E smoke suite

Effort: `3 to 6 days`

Includes:

- Add `testID`s
- Add `E2E_MODE` seams
- Create smoke flows
- CI runner orchestration

Risk:

- Native auth and file-picker seams are the highest-variance work

### Phase 5: Optional EAS integration

Effort: `1 to 3 days`

Includes:

- EAS project setup
- Profile config
- Credentials/workflow setup
- Build-distribution validation

Only do this if the team wants managed cloud builds or internal distribution through EAS.

## Concrete Next Steps

Recommended immediate implementation order:

1. Add explicit Jest coverage config and thresholds
2. Add `format:check` to CI
3. Split the current workflow into JS, Android, and iOS jobs
4. Get `assembleDebug` and iOS simulator build green
5. Add Maestro-based PR smoke flow for auth and one meditation playback path

## Summary

Today’s pipeline is a JS baseline, not a React Native release-safety pipeline. The fastest path to materially better confidence is:

- keep the current lint/type/Jest gates
- add coverage enforcement
- compile Android and iOS in CI
- add a very small device-level smoke suite

That sequence gives the best risk reduction for the least engineering effort.
