# In-Session Engagement Optimization Technical Design

## Summary

The current player flow is split across:

- pre-session intention entry in [`/Users/vespermartini/Documents/dev/observer/src/screens/Meditation.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/Meditation.tsx)
- playback state polling in [`/Users/vespermartini/Documents/dev/observer/src/screens/MeditationPlayer.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/MeditationPlayer.tsx)
- completion persistence and note/feedback capture in [`/Users/vespermartini/Documents/dev/observer/src/screens/MeditationFinish.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/MeditationFinish.tsx)

The app already tracks position and duration every second using `getProgress()` from `react-native-track-player`, updates `MeditationSessionContext`, and saves final session documents to `meditationHistory`. That gives a workable base for milestone tracking, micro-commitments, pause/resume analytics, and a richer post-session flow without re-architecting playback.

Recommended implementation:

- Keep [`/Users/vespermartini/Documents/dev/observer/src/screens/MeditationPlayer.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/MeditationPlayer.tsx) as the primary orchestration layer.
- Move milestone, abandonment, and resume logic into new player helpers/services instead of growing the screen further.
- Extend `MeditationSessionContext` to hold transient in-session state.
- Extend `meditationHistory` documents with rating, completion ratio, pause metrics, and scheduling metadata.
- Convert [`/Users/vespermartini/Documents/dev/observer/src/screens/MeditationFinish.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/MeditationFinish.tsx) into a post-session hook surface rather than only a notes screen.

## Current State In Code

- Intention text already exists in [`/Users/vespermartini/Documents/dev/observer/src/screens/Meditation.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/Meditation.tsx) and is written to `MeditationSessionContext`.
- Player progress is polled every second in [`/Users/vespermartini/Documents/dev/observer/src/screens/MeditationPlayer.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/MeditationPlayer.tsx).
- Session completion currently happens when the active track reaches duration; the screen navigates directly to `MeditationFinish`.
- Firestore history writes are created in [`/Users/vespermartini/Documents/dev/observer/src/screens/MeditationFinish.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/MeditationFinish.tsx) through [`/Users/vespermartini/Documents/dev/observer/src/fb/meditationHistory.tsx`](/Users/vespermartini/Documents/dev/observer/src/fb/meditationHistory.tsx).
- Current history schema already includes `intention`, `notes`, `feedback`, `playlistId`, and `playlistName`.

## Architecture Decisions

## MeditationPlayer Modifications

Keep milestone detection in `MeditationPlayer`, but extract pure helpers.

Recommended additions to [`/Users/vespermartini/Documents/dev/observer/src/screens/MeditationPlayer.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/MeditationPlayer.tsx):

- derive `completionPercent = position / duration`
- detect milestone crossings at 25%, 50%, 75%
- track pause/resume count and total paused duration
- when resuming after a pause, seek backward 10 seconds before calling play
- distinguish between user cancel, app background interruption, and completed session

New transient session shape in [`/Users/vespermartini/Documents/dev/observer/src/contexts/meditationSession.tsx`](/Users/vespermartini/Documents/dev/observer/src/contexts/meditationSession.tsx):

```ts
interface MeditationSession {
  intention?: string;
  commitmentAccepted?: boolean;
  commitmentCopyId?: string;
  progressMilestonesHit?: number[];
  pauseCount?: number;
  pausedDurationSeconds?: number;
  backgroundInterruptions?: number;
  abandonmentReason?: 'cancel' | 'background_timeout' | 'system_interrupt';
  completionRatio?: number;
  scheduledNextSessionAt?: number;
  rating?: number;
  reflection?: string;
  instances: MeditationInstance[];
  timeMeditated?: number;
  sessionStartTime?: number;
}
```

Why this is the right layer:

- The screen already owns playback lifecycle, progress polling, and navigation.
- The context already survives the transition from `Meditation` to `MeditationPlayer` to `MeditationFinish`.

## Integration With react-native-track-player

The app currently imports low-level helpers from `react-native-track-player/lib/src/trackPlayer`, which is brittle. For this feature, do not add more reliance on internal imports.

Recommended approach:

- Keep existing polling temporarily for compatibility.
- Add a wrapper service that consumes:
  - `TrackPlayer.getProgress()`
  - `TrackPlayer.getPlaybackState()`
  - `TrackPlayer.seekTo()`
- Centralize milestone detection in a helper such as `computeProgressMilestoneTransitions(previousPercent, currentPercent)`.

Longer term:

- Replace direct imports from `lib/src/trackPlayer` with public APIs and hooks if the library version allows it, but that is cleanup, not a prerequisite for the feature.

## Micro-Commitments

The app already has an intention field in [`/Users/vespermartini/Documents/dev/observer/src/screens/Meditation.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/Meditation.tsx). Build the micro-commitment on that screen, not inside the player.

Recommended UI flow:

- Add 5 suggestion chips under the existing intention field.
- Add a lightweight toggle or CTA: "I’m committing to finishing this session."
- Persist the commitment choice into `MeditationSessionContext`.
- Show a brief non-blocking reminder overlay at 50% only if commitment was accepted and the session has been paused before.

## Post-Session Hook Architecture

Keep [`/Users/vespermartini/Documents/dev/observer/src/screens/MeditationFinish.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/MeditationFinish.tsx) as the post-session screen, but restructure the UI into stages:

1. completion celebration
2. 1-5 rating
3. optional reflection text
4. next-session scheduling CTA
5. existing notes/feedback persistence

Implementation:

- Split the current screen into subcomponents.
- Save the base history document first, exactly as the app does now.
- Patch the same history doc with rating/reflection/scheduling once the user completes the post-session flow.

This preserves the current "save on completion" reliability while allowing optional steps afterward.

## Firestore Schema Changes

Extend each `/users/{uid}/meditationHistory/{historyId}` document with:

```ts
{
  completedAt?: number,
  sessionDuration?: number,
  completionRatio?: number,
  pauseCount?: number,
  pausedDurationSeconds?: number,
  backgroundInterruptions?: number,
  commitmentAccepted?: boolean,
  rating?: number, // 1-5
  reflection?: string,
  nextSessionScheduledAt?: number,
  progressMilestonesHit?: number[], // [25, 50, 75]
  endedReason?: 'completed' | 'cancelled' | 'abandoned'
}
```

Keep existing fields:

- `creationTime`
- `meditationStartTime`
- `intention`
- `notes`
- `feedback`
- `playlistId`
- `playlistName`

Reasoning:

- `notes` and `feedback` already exist and should not be overloaded for rating/reflection.
- New fields are additive and backward-compatible with existing query code in [`/Users/vespermartini/Documents/dev/observer/src/fb/meditationHistory.tsx`](/Users/vespermartini/Documents/dev/observer/src/fb/meditationHistory.tsx), which reads raw documents.

## Analytics Events

New PostHog events:

- `meditation_progress_milestone`
- `session_pause_event`
- `session_resume_event`
- `session_abandoned`
- `intention_set_pre_session`
- `session_commitment_accepted`
- `post_session_rating_completed`
- `post_session_reflection_added`
- `session_completion_celebration_viewed`
- `next_session_scheduled`

Suggested properties:

- `meditation_id`
- `playlist_id`
- `milestone_percent`
- `pause_count`
- `position_seconds`
- `duration_seconds`
- `completion_ratio`
- `intention_length`
- `commitment_accepted`
- `rating`
- `scheduled_offset_hours`

Implementation:

- Add `captureSessionOptimizationEvent()` to [`/Users/vespermartini/Documents/dev/observer/src/analytics/posthog.ts`](/Users/vespermartini/Documents/dev/observer/src/analytics/posthog.ts).
- Keep existing `capturePlayFlowEvent()` calls for compatibility.

## Data Flow

### Pre-session

- [`/Users/vespermartini/Documents/dev/observer/src/screens/Meditation.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/Meditation.tsx) stores:
  - intention
  - selected commitment
  - session start time

### In-session

- [`/Users/vespermartini/Documents/dev/observer/src/screens/MeditationPlayer.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/MeditationPlayer.tsx) updates:
  - `timeMeditated`
  - `progressMilestonesHit`
  - pause metrics
  - completion ratio

### Post-session

- [`/Users/vespermartini/Documents/dev/observer/src/screens/MeditationFinish.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/MeditationFinish.tsx) writes history docs first.
- The same screen patches those docs with:
  - rating
  - reflection
  - next session scheduled time

## Handling Abandonment

The current player has a cancel modal but does not persist abandonment metadata.

Recommended behavior:

- On explicit cancel, write a lightweight abandoned session record to a new collection only if the user crossed a minimum threshold such as 10% or 3 minutes.
- Do not pollute `meditationHistory` with clearly incomplete sessions.

Recommended collection:

```ts
/users/{uid}/sessionAttempts/{attemptId}
  meditationBaseId
  sessionStartTime
  positionSeconds
  durationSeconds
  completionRatio
  pauseCount
  endedReason
```

This keeps completed history clean while still supporting analytics and future recovery UX.

## Files To Modify

- [`/Users/vespermartini/Documents/dev/observer/src/screens/Meditation.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/Meditation.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/screens/MeditationPlayer.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/MeditationPlayer.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/screens/MeditationFinish.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/MeditationFinish.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/contexts/meditationSession.tsx`](/Users/vespermartini/Documents/dev/observer/src/contexts/meditationSession.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/fb/meditationHistory.tsx`](/Users/vespermartini/Documents/dev/observer/src/fb/meditationHistory.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/types.tsx`](/Users/vespermartini/Documents/dev/observer/src/types.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/analytics/posthog.ts`](/Users/vespermartini/Documents/dev/observer/src/analytics/posthog.ts)

## New Files To Create

- [`/Users/vespermartini/Documents/dev/observer/src/services/player/progressMilestones.ts`](/Users/vespermartini/Documents/dev/observer/src/services/player/progressMilestones.ts)
- [`/Users/vespermartini/Documents/dev/observer/src/services/player/sessionLifecycle.ts`](/Users/vespermartini/Documents/dev/observer/src/services/player/sessionLifecycle.ts)
- [`/Users/vespermartini/Documents/dev/observer/src/components/PostSessionRating.tsx`](/Users/vespermartini/Documents/dev/observer/src/components/PostSessionRating.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/components/NextSessionScheduler.tsx`](/Users/vespermartini/Documents/dev/observer/src/components/NextSessionScheduler.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/constants/intentionOptions.ts`](/Users/vespermartini/Documents/dev/observer/src/constants/intentionOptions.ts)
- `functions/src/sessionAttempts.ts` if server-side analytics fan-out is needed later

## Migration Strategy

- Treat all new meditation history fields as optional.
- Existing documents remain valid because current screens only expect a subset of fields.
- No backfill is required for ratings or completion ratios.
- For users with existing `intention` values, keep rendering them unchanged.
- Only add `sessionAttempts` for new abandonments after rollout.

## Risks And Unknowns

- `MeditationPlayer.tsx` currently depends on internal `react-native-track-player` imports; extending around that increases upgrade risk until it is cleaned up.
- The current completion detection checks `position >= duration` on a 1-second interval. Edge timing around track transitions and playlists will need careful QA.
- Playlist sessions contain multiple history documents for one listening session. Product should confirm whether post-session rating applies to the whole playlist or each constituent meditation.
- There is no existing settings surface for "show remaining time", so a toggleable timer implies new settings UX if included in v1.

## Effort Estimate

- Pre-session intention and commitment UI: 1.5 days
- Player milestone detection and pause/resume instrumentation: 2.5 days
- Completion/abandonment lifecycle helpers: 1.5 days
- Post-session rating, reflection, and next-session scheduling UI: 2.5 days
- Firestore schema updates and analytics: 1.0 day
- QA for playlists, interruptions, and edge cases: 1.5 days

Total: 10.5 dev days

## RevenueCat Note

RevenueCat remains disabled in:

- [`/Users/vespermartini/Documents/dev/observer/src/screens/PurchaseOnboarding.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/PurchaseOnboarding.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/screens/Purchase.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/Purchase.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/screens/Subscriptions.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/Subscriptions.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/hooks/useFetchOffering.ts`](/Users/vespermartini/Documents/dev/observer/src/hooks/useFetchOffering.ts)

That is relevant later if advanced session coaching or premium post-session insights become paid, but it should not change this feature architecture.
