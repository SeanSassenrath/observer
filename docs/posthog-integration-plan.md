# PostHog Integration Plan

A simple plan for adding PostHog to Unlimited Meditations, focused on core user flows and funnels.

---

## 1. Setup

### Install
```bash
npm install posthog-react-native react-native-device-info react-native-localize
# Already have: @react-native-async-storage/async-storage
cd ios && pod install
```

### Configure
- Add `PostHogProvider` at app root in `App.tsx` (inside `ApplicationProvider`, wrapping context providers or `StackNavigator`)
- Store API key in env (e.g. `react-native-dotenv`) — **do not** commit to repo
- Use `https://us.i.posthog.com` or `https://eu.i.posthog.com` depending on region

### User identification
- Call `posthog.identify(user.uid)` when user signs in / app loads with authenticated user
- Associate events with the Firebase user for cohort and retention analysis

---

## 2. Core Flows to Instrument

### Flow A: Add Meditation
**Purpose:** Understand how many users complete adding meditations vs. hitting unrecognized files or dropping off.

| Step | Screen/Trigger | Event Name | Properties |
|------|----------------|------------|------------|
| 1 | Add tab pressed, files selected | `add_meditation_started` | `files_selected: number` |
| 2 | AddMedsMatching shown | `add_meditation_matching` | `matched_count`, `unmatched_count` |
| 3a | AddMedsSuccess shown | `add_meditation_completed` | `meditations_added` |
| 3b | UnrecognizedFiles shown | `add_meditation_partial` | `unmatched_count` |

**Entry points:** Add tab (Tab.tsx), AddMeditations screen (if navigated directly)

---

### Flow B: Play Meditation
**Purpose:** See where users drop off between selecting a meditation and finishing a session.

| Step | Screen/Trigger | Event Name | Properties |
|------|----------------|------------|------------|
| 1 | Meditation (intention) screen viewed | `play_meditation_intention_viewed` | `meditation_id`, `source` (home/library/playlist) |
| 2 | User taps play, MeditationPlayer opens | `play_meditation_started` | `meditation_id`, `meditation_name` |
| 3 | MeditationFinish shown (session complete) | `play_meditation_completed` | `meditation_id`, `time_meditated`, `playlist_id?` |
| — | User exits player before finishing | `play_meditation_abandoned` | `meditation_id`, `last_position` |

**Entry points:** Home, Library, Playlists → Meditation screen → MeditationPlayer

---

## 3. Event Naming Convention

- **Format:** `{flow}_{stage}_{outcome?}`
- **Examples:** `add_meditation_started`, `play_meditation_completed`
- **Properties:** snake_case, include IDs and counts for filtering/breakdowns

---

## 4. PostHog Funnels to Create

### Funnel: Add Meditation
1. `add_meditation_started`
2. `add_meditation_matching`
3. `add_meditation_completed` OR `add_meditation_partial`

**Insight:** Conversion from start → completed vs. partial (unrecognized files). Drop-off at matching = potential matching/UX issue.

### Funnel: Play Meditation
1. `play_meditation_intention_viewed`
2. `play_meditation_started`
3. `play_meditation_completed`

**Insight:** Conversion from intention → play → completion. Abandonments indicate friction in player or session length.

---

## 5. Implementation Order

| Phase | Tasks | Files |
|-------|-------|-------|
| **1. Setup** | Install SDK, add provider, identify user | `App.tsx`, `package.json` |
| **2. Add flow** | Capture 4 events | `Tab.tsx`, `addMeditations.tsx`, `AddMedsMatching.tsx`, `AddMedsSuccess.tsx`, `UnrecognizedFiles.tsx` |
| **3. Play flow** | Capture 4 events | `Meditation.tsx`, `MeditationPlayer.tsx`, `MeditationFinish.tsx` |
| **4. PostHog** | Create funnels, add filters | PostHog UI |

---

## 6. Optional: Centralize PostHog Events

Create `src/analytics/posthog.ts` to mirror your Firebase analytics pattern:

```typescript
// Simple wrapper - capture flow events with consistent structure
export const captureAddFlowEvent = (event: string, properties?: Record<string, any>) => {
  posthog?.capture(event, { flow: 'add_meditation', ...properties });
};

export const capturePlayFlowEvent = (event: string, properties?: Record<string, any>) => {
  posthog?.capture(event, { flow: 'play_meditation', ...properties });
};
```

This keeps event names and properties consistent and makes it easier to add more flows later.

---

## 7. Out of Scope (For Now)

- Session replay
- Feature flags
- A/B tests
- Autocapture (rely on explicit events for funnel clarity)
- Onboarding funnel (add later if needed)
