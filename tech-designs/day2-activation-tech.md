# Day-2 Activation Sequence Technical Design

## Summary

This design adds a Day-2 activation layer on top of the app's current meditation completion flow. The current write path already exists in [`/Users/vespermartini/Documents/dev/observer/src/screens/MeditationFinish.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/MeditationFinish.tsx), where a completed session updates Firestore user stats and adds one or more documents to `/users/{uid}/meditationHistory`. The current streak read/repair path already exists in [`/Users/vespermartini/Documents/dev/observer/src/utils/streaks.ts`](/Users/vespermartini/Documents/dev/observer/src/utils/streaks.ts), [`/Users/vespermartini/Documents/dev/observer/App.tsx`](/Users/vespermartini/Documents/dev/observer/App.tsx), and [`/Users/vespermartini/Documents/dev/observer/src/screens/Home.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/Home.tsx). Firebase Messaging permission request UI already exists in [`/Users/vespermartini/Documents/dev/observer/src/components/NotificationModal/index.tsx`](/Users/vespermartini/Documents/dev/observer/src/components/NotificationModal/index.tsx), but there is no actual push token registration, server-side send path, or notification scheduling state.

The recommended implementation is:

- Keep streak source of truth in Firestore, but extend the shape rather than rebuild from scratch.
- Store activation state in Firestore for cross-device consistency, with a small AsyncStorage cache only for local scheduling metadata.
- Use server-triggered push notifications for Day-2 and week-1 reminders, not local notifications as the primary mechanism.
- Trigger activation scheduling from the first completed meditation in [`/Users/vespermartini/Documents/dev/observer/src/screens/MeditationFinish.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/MeditationFinish.tsx).
- Add a lightweight client-side notification bootstrap service that registers FCM tokens and handles open events.

## Current State In Code

- User state is modeled in [`/Users/vespermartini/Documents/dev/observer/src/contexts/userData.tsx`](/Users/vespermartini/Documents/dev/observer/src/contexts/userData.tsx). Current onboarding flags are flat booleans under `user.onboarding`.
- Streaks are currently a simple `{current, longest}` object in `user.meditationUserData.streaks`.
- Session completion writes happen in [`/Users/vespermartini/Documents/dev/observer/src/screens/MeditationFinish.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/MeditationFinish.tsx).
- App boot loads user + meditation history in [`/Users/vespermartini/Documents/dev/observer/App.tsx`](/Users/vespermartini/Documents/dev/observer/App.tsx).
- Home repairs stale streaks when app returns to foreground in [`/Users/vespermartini/Documents/dev/observer/src/screens/Home.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/Home.tsx).
- Notification permission UI exists, but only asks for permission and writes an AsyncStorage timestamp in [`/Users/vespermartini/Documents/dev/observer/src/utils/asyncStorageNotifs.ts`](/Users/vespermartini/Documents/dev/observer/src/utils/asyncStorageNotifs.ts).
- PostHog is already available globally through [`/Users/vespermartini/Documents/dev/observer/src/services/posthogClient.ts`](/Users/vespermartini/Documents/dev/observer/src/services/posthogClient.ts) and React hooks in navigation/screens.

## Architecture Decisions

## Push Notification Architecture

Use Firebase Cloud Messaging as the transport and Firebase Cloud Functions as the scheduler/sender.

Why:

- `@react-native-firebase/messaging` is already installed and used for permission requests in [`/Users/vespermartini/Documents/dev/observer/src/components/NotificationModal/index.tsx`](/Users/vespermartini/Documents/dev/observer/src/components/NotificationModal/index.tsx).
- Local notifications are unreliable for this use case because Day-2 timing must survive app kills, device changes, reinstalls, and week-1 sequence changes.
- Server-triggered sends let us dedupe by user, respect cross-device behavior, and later support experimentation on send time.

Recommended flow:

1. Client requests permission and retrieves the FCM token.
2. Client writes token + device timezone + notification preferences into `/users/{uid}`.
3. On first meditation completion, client writes activation metadata into the user document.
4. Cloud Function reacts to the user write, calculates the next reminder time, and writes a scheduled reminder record.
5. A scheduled function runs every 15 minutes, sends due reminders, and marks them sent.
6. Notification open is captured by the client and routed into app state for a Day-2 landing treatment on Home.

Use local notifications only as a fallback for pause/resume or same-device immediate reminders, not as the primary Day-2 mechanism.

## Day-2 Trigger Logic

Scheduling should live on the server.

Trigger source:

- First completed meditation saved in [`/Users/vespermartini/Documents/dev/observer/src/screens/MeditationFinish.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/MeditationFinish.tsx).

Server schedule rule:

- Base send time = first completed session local time + 23 hours.
- Apply quiet-hours clamp to 8:00 AM to 9:00 PM in the stored timezone.
- If the user already completed a second-day meditation before the reminder window, cancel the reminder.

Why not keep this only on the client:

- The app currently has no background task system or local-notification implementation.
- App reinstall or second device would lose local-only activation state.
- The PRD explicitly needs behavior-aware branching and future A/B timing.

## Streak Mechanics

Do not rebuild from scratch. Extend [`/Users/vespermartini/Documents/dev/observer/src/utils/streaks.ts`](/Users/vespermartini/Documents/dev/observer/src/utils/streaks.ts).

Current problems in the existing implementation:

- It only tracks `{current, longest}`.
- It uses the last meditation start timestamp and calendar-day comparisons, but it does not support grace periods, milestone timestamps, or streak recovery metadata.
- It conflates "streak valid" checks and "streak increment" logic.

Recommended new shape:

```ts
interface UserStreaks {
  current?: number;
  longest?: number;
  lastCompletedAt?: number;
  lastCountedDay?: string; // yyyy-MM-dd in user timezone
  graceExpiresAt?: number;
  streakSaverCount?: number;
  lastMilestoneShown?: number;
}
```

Implementation note:

- Keep `current` and `longest` intact for backward compatibility with [`/Users/vespermartini/Documents/dev/observer/src/components/StreakPill/component.tsx`](/Users/vespermartini/Documents/dev/observer/src/components/StreakPill/component.tsx), [`/Users/vespermartini/Documents/dev/observer/src/components/StreakUpdate.tsx`](/Users/vespermartini/Documents/dev/observer/src/components/StreakUpdate.tsx), and existing reads.
- Add a new pure helper such as `calculateStreakTransition()` in [`/Users/vespermartini/Documents/dev/observer/src/utils/streaks.ts`](/Users/vespermartini/Documents/dev/observer/src/utils/streaks.ts) that returns:
  - next streak values
  - whether today counted
  - whether a milestone was hit
  - whether grace was consumed

Grace-period recommendation:

- Store `graceExpiresAt = lastCountedDay end + 48h`.
- Count only one completed day per local calendar day.
- Preserve existing display behavior on Home and Insights by continuing to expose `current` and `longest`.

## AsyncStorage vs Firestore

Use Firestore for activation state. Use AsyncStorage only as a cache.

Firestore should hold:

- notification permission status
- FCM tokens
- activation lifecycle state
- week-1 sequence progress
- preferred reminder time
- server scheduling metadata

AsyncStorage should hold:

- last opened activation notification payload
- a local "seen Day-2 landing" flag for current device
- optional cached reminder preference for boot-time UI

Reasoning:

- Activation state affects behavior across reinstall and across devices.
- The app already treats Firestore as source of truth for user stats and onboarding flags in [`/Users/vespermartini/Documents/dev/observer/src/fb/user.tsx`](/Users/vespermartini/Documents/dev/observer/src/fb/user.tsx) and [`/Users/vespermartini/Documents/dev/observer/App.tsx`](/Users/vespermartini/Documents/dev/observer/App.tsx).
- AsyncStorage is already used for device-local concerns such as notification modal seen state and file paths, which fits cache/fallback usage better.

## UserContext and Onboarding Integration

Extend the `User` model in [`/Users/vespermartini/Documents/dev/observer/src/contexts/userData.tsx`](/Users/vespermartini/Documents/dev/observer/src/contexts/userData.tsx) with:

```ts
interface ActivationData {
  firstCompletedAt?: number;
  day2ScheduledFor?: number;
  day2CompletedAt?: number;
  week1SequenceStartedAt?: number;
  week1SequenceDay?: number;
  week1SequenceCompletedAt?: number;
  preferredReminderHour?: number;
  timezone?: string;
  notificationsEnabled?: boolean;
  lastNotificationOpenAt?: number;
}

interface Onboarding {
  hasSeenWelcome: boolean;
  hasSeenAddMeditationOnboarding: boolean;
  hasSeenBreathworkOnboarding: boolean;
  hasSeenLibraryOnboarding: boolean;
  hasSeenHomeOnboarding: boolean;
  hasSeenInsightsOnboarding: boolean;
  hasSeenPlaylistOnboarding: boolean;
  hasSeenDay2Intro?: boolean;
  hasSeenWeek1Invite?: boolean;
}
```

Recommendation:

- Keep activation state under `meditationUserData.activation` rather than top-level `onboarding`, because it is behavioral state, not just UI exposure state.
- Keep one-time display flags in `onboarding`.

## Firestore Schema Changes

Extend `/users/{uid}` with:

```ts
{
  notificationSettings: {
    enabled: boolean,
    fcmTokens: {
      [deviceId: string]: {
        token: string,
        platform: 'ios',
        timezone: string,
        updatedAt: number
      }
    },
    quietHours: {startHour: 21, endHour: 8},
    preferredReminderHour?: number
  },
  meditationUserData: {
    streaks: {
      current: number,
      longest: number,
      lastCompletedAt?: number,
      lastCountedDay?: string,
      graceExpiresAt?: number,
      streakSaverCount?: number,
      lastMilestoneShown?: number
    },
    activation: {
      firstCompletedAt?: number,
      firstMeditationBaseId?: string,
      day2ScheduledFor?: number,
      day2SentAt?: number,
      day2OpenedAt?: number,
      day2CompletedAt?: number,
      week1SequenceStartedAt?: number,
      week1SequenceDay?: number,
      week1SequenceCompletedAt?: number
    }
  }
}
```

Add backend collection:

```ts
/activationReminders/{reminderId}
  uid
  type // day2 | week1_day_n | reengagement
  scheduledFor
  sentAt
  cancelledAt
  status // scheduled | sent | opened | cancelled
  meditationBaseId
  timezone
```

## Client Flow

### First session completion

- [`/Users/vespermartini/Documents/dev/observer/src/screens/MeditationFinish.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/MeditationFinish.tsx) detects whether this is the user's first completed session by checking `meditationHistory.meditationInstances.length === 0` before local context update.
- It updates `meditationUserData.activation.firstCompletedAt` and `firstMeditationBaseId`.
- It launches the existing notification modal or a new Day-2-specific permission prompt after successful completion write.
- It captures PostHog activation events.

### App open from push

- A new notifications bootstrap service listens to:
  - `messaging().getInitialNotification()`
  - `messaging().onNotificationOpenedApp()`
- It stores a lightweight payload in AsyncStorage and updates Firestore `day2OpenedAt`.
- Home reads this state and renders a Day-2 welcome treatment above current sections.

### Week-1 sequence

- Home uses `meditationUserData.activation.week1SequenceDay` and recent meditation history to show "Day X of 7".
- Sequence recommendations should be client-rendered from a static config file first, not fetched dynamically.

## PostHog Events

New events:

- `day2_notification_sent`
- `day2_notification_opened`
- `day2_session_completed`
- `streak_milestone_reached`
- `progressive_onboarding_step_completed`
- `intention_set_from_notification`
- `week1_sequence_started`
- `week1_sequence_day_completed`
- `week1_sequence_completed`
- `activation_permission_prompt_viewed`
- `activation_permission_enabled`
- `activation_permission_skipped`

Properties to include:

- `meditation_id`
- `first_meditation_id`
- `streak_current`
- `week1_day`
- `send_offset_hours`
- `timezone`
- `notification_type`
- `opened_from_push`

Implementation:

- Add a small helper to [`/Users/vespermartini/Documents/dev/observer/src/analytics/posthog.ts`](/Users/vespermartini/Documents/dev/observer/src/analytics/posthog.ts), for example `captureActivationFlowEvent()`.
- Keep existing Firebase Analytics events unchanged.

## Files To Modify

- [`/Users/vespermartini/Documents/dev/observer/src/contexts/userData.tsx`](/Users/vespermartini/Documents/dev/observer/src/contexts/userData.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/utils/streaks.ts`](/Users/vespermartini/Documents/dev/observer/src/utils/streaks.ts)
- [`/Users/vespermartini/Documents/dev/observer/src/screens/MeditationFinish.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/MeditationFinish.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/screens/Home.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/Home.tsx)
- [`/Users/vespermartini/Documents/dev/observer/App.tsx`](/Users/vespermartini/Documents/dev/observer/App.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/components/NotificationModal/index.tsx`](/Users/vespermartini/Documents/dev/observer/src/components/NotificationModal/index.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/analytics/posthog.ts`](/Users/vespermartini/Documents/dev/observer/src/analytics/posthog.ts)
- [`/Users/vespermartini/Documents/dev/observer/src/fb/user.tsx`](/Users/vespermartini/Documents/dev/observer/src/fb/user.tsx)

## New Files To Create

- [`/Users/vespermartini/Documents/dev/observer/src/services/notifications/bootstrap.ts`](/Users/vespermartini/Documents/dev/observer/src/services/notifications/bootstrap.ts)
- [`/Users/vespermartini/Documents/dev/observer/src/services/notifications/tokenRegistration.ts`](/Users/vespermartini/Documents/dev/observer/src/services/notifications/tokenRegistration.ts)
- [`/Users/vespermartini/Documents/dev/observer/src/services/activation/day2Activation.ts`](/Users/vespermartini/Documents/dev/observer/src/services/activation/day2Activation.ts)
- [`/Users/vespermartini/Documents/dev/observer/src/constants/week1Sequence.ts`](/Users/vespermartini/Documents/dev/observer/src/constants/week1Sequence.ts)
- [`/Users/vespermartini/Documents/dev/observer/src/utils/asyncStorageActivation.ts`](/Users/vespermartini/Documents/dev/observer/src/utils/asyncStorageActivation.ts)
- `functions/src/activationSchedule.ts`
- `functions/src/activationSend.ts`

## Migration Strategy

- Treat missing `meditationUserData.activation` and missing new streak fields as unset and derive defaults at read time.
- Backfill `firstCompletedAt` lazily from the oldest fetched history item when a returning user opens the app.
- Do not force a destructive migration of existing streak objects.
- If `notificationSettings` is absent, assume `enabled = false`.
- Preserve the existing `current` and `longest` streak fields so UI components remain compatible during rollout.

## Risks And Unknowns

- There is no Firebase Functions code in this repo, so backend ownership and deployment surface are still open.
- The current app only requests permission; FCM token registration and APNs credential validation still need implementation and environment setup.
- Current streak logic is based on `meditationStartTime`, not completion time. For accuracy, activation should use completion timestamp written at finish time.
- Week-1 sequence content selection is still a product decision; the design assumes a static curated list first.
- Quiet-hours behavior depends on a reliable user timezone. The app does not currently persist timezone.

## Effort Estimate

- iOS notification bootstrap and FCM token registration: 1.5 days
- Cloud Functions scheduling and send path: 2.5 days
- Streak model extension and grace-period logic: 1.5 days
- MeditationFinish and Home integration: 1.5 days
- Week-1 sequence config and Home treatment: 1.0 day
- PostHog instrumentation and QA: 1.0 day

Total: 9.0 dev days

## RevenueCat Note

RevenueCat code exists but is disabled in:

- [`/Users/vespermartini/Documents/dev/observer/src/screens/PurchaseOnboarding.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/PurchaseOnboarding.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/screens/Purchase.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/Purchase.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/screens/Subscriptions.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/Subscriptions.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/hooks/useFetchOffering.ts`](/Users/vespermartini/Documents/dev/observer/src/hooks/useFetchOffering.ts)

That matters later if activation reminders or streak-protection become monetized, but it should stay out of the initial retention rollout.
