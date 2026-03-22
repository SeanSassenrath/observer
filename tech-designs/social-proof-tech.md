# Social Proof & Habit Loops Technical Design

## Summary

The current codebase already has the strongest foundation in playlist sharing:

- playlists are first-class local + Firestore entities in [`/Users/vespermartini/Documents/dev/observer/src/fb/playlists.tsx`](/Users/vespermartini/Documents/dev/observer/src/fb/playlists.tsx)
- share encoding and import flows already exist in [`/Users/vespermartini/Documents/dev/observer/src/utils/sharePlaylist.ts`](/Users/vespermartini/Documents/dev/observer/src/utils/sharePlaylist.ts), [`/Users/vespermartini/Documents/dev/observer/src/screens/PlaylistPreparation.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/PlaylistPreparation.tsx), and [`/Users/vespermartini/Documents/dev/observer/src/screens/ImportPlaylist.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/ImportPlaylist.tsx)

The app has no existing community or challenge backend, and `Home` is still the right place to surface light social proof because it already renders streaks, recent meditations, playlists, and onboarding prompts in [`/Users/vespermartini/Documents/dev/observer/src/screens/Home.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/Home.tsx).

Recommended implementation:

- Use Firebase Cloud Functions to aggregate community stats into Firestore documents.
- Extend the current share-link system rather than replacing it.
- Add streak visibility and community modules directly to `Home`.
- Start challenges as server-defined weekly documents plus per-user participation docs.
- Keep all community surfaces anonymous by default and opt-in for anything resembling leaderboard participation.

## Current State In Code

- Home already shows `StreakPill` and recent meditation content in [`/Users/vespermartini/Documents/dev/observer/src/screens/Home.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/Home.tsx).
- User streak source of truth is still `user.meditationUserData.streaks` in [`/Users/vespermartini/Documents/dev/observer/src/contexts/userData.tsx`](/Users/vespermartini/Documents/dev/observer/src/contexts/userData.tsx).
- Playlist share/import is local-first and URL-encoded in [`/Users/vespermartini/Documents/dev/observer/src/utils/sharePlaylist.ts`](/Users/vespermartini/Documents/dev/observer/src/utils/sharePlaylist.ts).
- Playlist creation and updates sync to `/users/{uid}/playlists` through [`/Users/vespermartini/Documents/dev/observer/src/fb/playlists.tsx`](/Users/vespermartini/Documents/dev/observer/src/fb/playlists.tsx).
- PostHog playlist flow helpers already exist in [`/Users/vespermartini/Documents/dev/observer/src/analytics/posthog.ts`](/Users/vespermartini/Documents/dev/observer/src/analytics/posthog.ts).

## Architecture Decisions

## Community Stats Architecture

Use Firebase Cloud Functions to aggregate usage into small Firestore documents that the app reads.

Recommendation:

- Completed sessions written to `/users/{uid}/meditationHistory` remain the event source.
- A Cloud Function triggered from new completed history documents increments aggregate counters.
- Home reads a compact denormalized doc rather than performing client-side aggregation.

Recommended documents:

```ts
/community/asstt;
todayActiveUsers;
todaySessions;
todayMinutes;
weekSessions;
weekMinutes;
updatedAt / community / trendingMeditations / {meditationBaseId};
meditationBaseId;
weekCompletions;
completionRate;
updatedAt / community / leaderboards / currentWeek;
weekKey;
topStreaks: Array<{
  avatarId: string;
  streak: number;
  percentile?: number;
}>;
updatedAt;
```

Why not compute directly in client from Firestore:

- `meditationHistory` is a per-user subcollection, so global aggregation would require privileged reads the client should not have.
- Aggregated docs give better privacy boundaries and much lower Home-screen load cost.

## Playlist Sharing

Extend the current implementation in [`/Users/vespermartini/Documents/dev/observer/src/utils/sharePlaylist.ts`](/Users/vespermartini/Documents/dev/observer/src/utils/sharePlaylist.ts). Do not replace it with a server-only share system in v1.

Recommended extensions:

- keep the current encoded payload for offline and low-friction sharing
- add optional metadata fields:
  - `creatorAlias`
  - `creatorAvatarId`
  - `shareId`
  - `visibility`
- when a user shares, create a server-side `/sharedPlaylists/{shareId}` doc to support:
  - attribution
  - share analytics
  - future web preview
  - report/takedown

Recommended payload:

```ts
interface ShareablePlaylist {
  v: 2;
  shareId?: string;
  name: string;
  description?: string;
  meditationIds: string[];
  gradientIndex?: number;
  creatorAlias?: string;
  creatorAvatarId?: string;
}
```

This keeps the current URL model compatible while adding server observability.

## Streak Visibility On Home

Use the existing `StreakPill` in [`/Users/vespermartini/Documents/dev/observer/src/components/StreakPill/component.tsx`](/Users/vespermartini/Documents/dev/observer/src/components/StreakPill/component.tsx) as the base and add a new community card below it on Home.

Recommended Home additions:

- "Community today" card:
  - `X people meditated today`
  - `Y hours this week`
  - `Most completed: [meditation name]`
- "Your place this week" card if opt-in:
  - percentile rank
  - current streak
  - challenge progress

Do not expose identifiable names in the first version.

## Challenge System Data Model

Recommended schema:

```ts
/community/challenges/{challengeId}
  title
  description
  type // consistency | duration | meditation_type
  startAt
  endAt
  targetCount
  targetMinutes
  meditationTypes?: string[]
  status // upcoming | active | completed
  participantCount
  updatedAt

/users/{uid}/challengeProgress/{challengeId}
  joinedAt
  progressCount
  progressMinutes
  completedAt?: number
  optedIntoLeaderboard?: boolean
  avatarId?: string
```

Implementation note:

- challenge definitions should be server-authored
- progress can be incremented by Cloud Function on meditation completion
- client should only read challenge definitions and its own progress

## Privacy Model

Privacy rules:

- all community stats shown in UI must come from aggregated docs only
- leaderboard participation must be explicit opt-in
- leaderboard rows use generated animal/avatar IDs, not names or emails
- playlist sharing defaults to link-only, not public discovery
- creator attribution should use an alias stored separately from auth profile data

Do not use:

- `user.profile.displayName`
- `user.profile.email`
- raw meditation notes or feedback

The existing user profile model in [`/Users/vespermartini/Documents/dev/observer/src/contexts/userData.tsx`](/Users/vespermartini/Documents/dev/observer/src/contexts/userData.tsx) contains real identifiers and should not be reused directly in social surfaces.

## Firestore Schema Changes

Extend `/users/{uid}` with:

```ts
{
  social: {
    shareAlias?: string,
    avatarId?: string,
    communityOptIn?: boolean,
    leaderboardOptIn?: boolean,
    allowPlaylistAttribution?: boolean
  }
}
```

Add new collections:

```ts
/community/asstt /
  community /
  trendingMeditations /
  {meditationBaseId} /
  community /
  leaderboards /
  currentWeek /
  community /
  challenges /
  {challengeId} /
  sharedPlaylists /
  {shareId} /
  users /
  {uid} /
  challengeProgress /
  {challengeId};
```

Suggested `sharedPlaylists/{shareId}` shape:

```ts
{
  ownerUid: string,
  playlistSnapshot: {
    name: string,
    description?: string,
    meditationIds: string[],
    gradientIndex?: number
  },
  creatorAlias?: string,
  avatarId?: string,
  visibility: 'link_only' | 'public' | 'private',
  importCount: number,
  createdAt: number,
  updatedAt: number,
  disabledAt?: number
}
```

## Client Flow

### Home community rendering

- `Home` fetches a single community stats doc after user and meditation state are ready.
- A new `CommunityContext` is optional, but not required for v1. A screen-local fetch is acceptable because only Home needs it initially.

### Playlist share

- [`/Users/vespermartini/Documents/dev/observer/src/screens/PlaylistPreparation.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/PlaylistPreparation.tsx) calls a new backend helper to create/update `sharedPlaylists/{shareId}` before invoking `sharePlaylist`.
- The URL still contains the encoded payload so import works even if the backend doc later disappears.

### Playlist import

- [`/Users/vespermartini/Documents/dev/observer/src/screens/ImportPlaylist.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/ImportPlaylist.tsx) reads the payload as it does today.
- If a `shareId` is present, it records an import counter increment through a callable function or write endpoint.

### Challenge participation

- Home shows the active challenge.
- User taps Join.
- Client creates `/users/{uid}/challengeProgress/{challengeId}`.
- On future meditation completions, backend increments progress based on session data.

## PostHog Events

New events:

- `community_stats_viewed`
- `playlist_shared_via_link`
- `playlist_imported_from_share`
- `streak_leaderboard_viewed`
- `weekly_challenge_joined`
- `weekly_challenge_completed`
- `community_milestone_reached`
- `social_proof_influenced_session`

Suggested properties:

- `share_id`
- `playlist_id`
- `challenge_id`
- `leaderboard_opt_in`
- `community_opt_in`
- `rank_percentile`
- `streak_current`
- `trending_meditation_id`

Implementation:

- add `captureCommunityFlowEvent()` to [`/Users/vespermartini/Documents/dev/observer/src/analytics/posthog.ts`](/Users/vespermartini/Documents/dev/observer/src/analytics/posthog.ts)
- keep existing playlist flow events and extend them with `share_id`

## Files To Modify

- [`/Users/vespermartini/Documents/dev/observer/src/screens/Home.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/Home.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/components/StreakPill/component.tsx`](/Users/vespermartini/Documents/dev/observer/src/components/StreakPill/component.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/utils/sharePlaylist.ts`](/Users/vespermartini/Documents/dev/observer/src/utils/sharePlaylist.ts)
- [`/Users/vespermartini/Documents/dev/observer/src/screens/PlaylistPreparation.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/PlaylistPreparation.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/screens/ImportPlaylist.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/ImportPlaylist.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/contexts/userData.tsx`](/Users/vespermartini/Documents/dev/observer/src/contexts/userData.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/fb/playlists.tsx`](/Users/vespermartini/Documents/dev/observer/src/fb/playlists.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/analytics/posthog.ts`](/Users/vespermartini/Documents/dev/observer/src/analytics/posthog.ts)

## New Files To Create

- [`/Users/vespermartini/Documents/dev/observer/src/fb/community.ts`](/Users/vespermartini/Documents/dev/observer/src/fb/community.ts)
- [`/Users/vespermartini/Documents/dev/observer/src/components/CommunityStatsCard.tsx`](/Users/vespermartini/Documents/dev/observer/src/components/CommunityStatsCard.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/components/WeeklyChallengeCard.tsx`](/Users/vespermartini/Documents/dev/observer/src/components/WeeklyChallengeCard.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/components/LeaderboardPreviewCard.tsx`](/Users/vespermartini/Documents/dev/observer/src/components/LeaderboardPreviewCard.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/utils/avatarAlias.ts`](/Users/vespermartini/Documents/dev/observer/src/utils/avatarAlias.ts)
- `functions/src/communityAggregates.ts`
- `functions/src/sharedPlaylists.ts`
- `functions/src/challenges.ts`

## Migration Strategy

- Default all existing users to `communityOptIn = false` and `leaderboardOptIn = false`.
- Existing playlists remain shareable with the v1 encoded format.
- `decodePlaylist()` should continue accepting v1 payloads and treat missing `shareId` as legacy.
- Users without `social` settings should still see anonymous aggregate stats if product approves passive viewing.
- No migration is required for existing playlist docs unless attribution is enabled.

## Risks And Unknowns

- There is no backend functions code in the repo, so aggregate write throughput and ownership are still open.
- The current share model trusts the client payload; once discovery or attribution matters, server-side validation becomes more important.
- Public trending metrics may be noisy at low scale. Product should decide whether to hide community numbers below a minimum threshold.
- Weekly leaderboards can conflict with meditation positioning if they feel too competitive. Opt-in is mandatory.

## Effort Estimate

- Community aggregation backend and Firestore readers: 3.0 days
- Home community cards and streak integration: 2.0 days
- Playlist share metadata and import attribution: 2.0 days
- Challenge data model and join/progress flow: 2.5 days
- Privacy/opt-in controls and analytics: 1.5 days

Total: 11.0 dev days

## RevenueCat Note

RevenueCat purchase code is present but disabled in:

- [`/Users/vespermartini/Documents/dev/observer/src/screens/PurchaseOnboarding.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/PurchaseOnboarding.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/screens/Purchase.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/Purchase.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/screens/Subscriptions.tsx`](/Users/vespermartini/Documents/dev/observer/src/screens/Subscriptions.tsx)
- [`/Users/vespermartini/Documents/dev/observer/src/hooks/useFetchOffering.ts`](/Users/vespermartini/Documents/dev/observer/src/hooks/useFetchOffering.ts)

That becomes relevant if public playlist discovery, premium challenges, or advanced community insights are monetized later, but it should remain decoupled from the first social-proof release.
