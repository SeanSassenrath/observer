# Custom Meditations - Implementation Plan

## Context

Users who upload files that don't match any meditation in the catalog currently can only manually match to an existing catalog item or submit for support. This means users with custom/personal meditation files can't use the app to play and track them. We want to let users keep these files as "custom meditations" that work like any other meditation (playable, trackable, addable to playlists) while keeping them distinct from catalog meditations so future shared features (group meditations) can exclude them.

## Approach

Use a `custom_` ID prefix for custom meditations. Store their metadata separately in AsyncStorage (and Firestore for backup). Merge them into `meditationBaseData` so they flow through the entire app without changes to playback, history, streaks, or playlists.

---

## 1. Types & Utility Module

**`/src/types.tsx`** - Add:
```typescript
export interface CustomMeditationMeta {
  meditationBaseId: string;       // "custom_<timestamp>_<random>"
  name: string;                    // User-provided
  artist: string;                  // User-provided or "Custom"
  groupName: string;               // "Custom Meditations"
  formattedDuration: string;       // "Unknown" initially
  type: MeditationTypes;           // 0 (standard meditation)
  createdAt: number;
  fileName: string;                // Original filename for reference
}
```

Also add `CreateCustomMeditation` to `StackParamList`.

**New file: `/src/utils/customMeditations.ts`** - Utility functions:
- `CUSTOM_PREFIX = 'custom_'`
- `isCustomMeditation(id)` - checks prefix
- `generateCustomMeditationId()` - `custom_<Date.now()>_<random>`
- AsyncStorage CRUD under key `@custom_meditation_meta` (stores `Record<string, CustomMeditationMeta>`)
- `customMetaToMeditationBase(meta, filePath)` - converts to `MeditationBase` for context compatibility

## 2. Update `makeMeditationBaseData()`

**`/src/utils/meditation.ts`** (lines 93-120)

Currently only looks up catalog entries. Change to:
1. Load `@custom_meditation_meta` from AsyncStorage alongside file paths
2. For each key in file path data: if `isCustomMeditation(key)`, use `customMetaToMeditationBase()` instead of catalog lookup

Also update:
- **`updateAsyncStorageMeditationData()`** (lines 62-91) - Skip `custom_` prefixed keys (they have no catalog entry, no migration needed)
- **`checkMeditationBaseId()`** (lines 24-31) - Return custom IDs as-is (they're valid, just not in catalog)

## 3. Fix Catalog-Only Lookups

**`/src/screens/Meditation.tsx`** (line 87):
```typescript
// Before:
const meditation = meditationBaseMap[id];
// After:
const meditation = meditationBaseMap[id] || meditationBaseData[id];
```
`meditationBaseData` (from context) already contains custom meditations after step 2.

Same pattern for line 100 (last meditation lookup).

## 4. New Screen: `CreateCustomMeditation`

**New file: `/src/screens/CreateCustomMeditation.tsx`**

Closely mirrors `SubmitMeditation.tsx` in layout (same form fields: name, author). On submit:
1. Generate custom ID
2. Save `CustomMeditationMeta` to AsyncStorage
3. Save `{customId: fileUri}` to `@meditation_file_path_data`
4. Update `MeditationFilePathsContext`
5. Rebuild `meditationBaseData` via `makeMeditationBaseData()`
6. Navigate to next file or `AddMedsSuccess`

Also submits to Firebase `unsupportedFiles` (keep current analytics behavior).

## 5. Update `MeditationMatch` Screen

**`/src/screens/MeditationMatch.tsx`** (line 290-294)

Change the "Can't find it?" link to offer two options:
```
Can't find it?
[Add as Custom]  |  [Submit for Support]
```

"Add as Custom" navigates to `CreateCustomMeditation` with the file data.

## 6. Navigation

**`/src/navigation/Stack.tsx`** - Register `CreateCustomMeditation` screen.

## 7. Home Screen: Custom Meditations Group

**`/src/screens/Home.tsx`** (after line 376)

Add a dynamic "Custom Meditations" section that filters `meditationBaseData` for entries with `custom_` prefixed IDs. Uses the same `_MeditationListSection` component. Only renders if user has custom meditations.

## 8. Firebase Sync

**`/src/fb/user.tsx`** or new module - Store custom meditation metadata on the user document:
```
/users/{uid}.customMeditations: { [id]: CustomMeditationMeta }
```

Sync on save and load on app init (App.tsx). File paths are NOT synced (files are local).

## 9. No Changes Needed

These areas work automatically because they operate on `meditationBaseData` context or `MeditationInstance` data:
- **Playback** - MeditationPlayer uses `meditationBaseData[id]` which will include custom meditations
- **History** - Saves `MeditationInstance` with `meditationBaseId` + `name`, works for any ID
- **Streaks/Stats** - Count history records regardless of meditation source
- **Playlists** - Store `meditationIds[]`, resolve via `meditationBaseData[id]`
- **MeditationSelector** - Uses `meditationBaseData` from context

---

## Files to Modify
1. `/src/types.tsx` - Add `CustomMeditationMeta`, nav params
2. `/src/utils/customMeditations.ts` - **New** - utility module
3. `/src/utils/meditation.ts` - Update `makeMeditationBaseData`, `checkMeditationBaseId`, `updateAsyncStorageMeditationData`
4. `/src/screens/CreateCustomMeditation.tsx` - **New** - form screen (based on SubmitMeditation pattern)
5. `/src/screens/MeditationMatch.tsx` - Add "Add as Custom" option
6. `/src/screens/Meditation.tsx` - Fix catalog-only lookup at line 87
7. `/src/screens/Home.tsx` - Add Custom Meditations group section
8. `/src/navigation/Stack.tsx` - Register new screen

## Verification
1. Add a file that doesn't match any catalog meditation
2. On the MeditationMatch screen, tap "Add as Custom"
3. Enter a name, submit
4. Verify it appears in the Home screen under "Custom Meditations"
5. Play it - verify TrackPlayer loads the audio
6. After playing, verify it appears in meditation history
7. Verify streak/stats updated
8. Add it to a playlist, verify playlist plays correctly
9. Kill and reopen the app - verify custom meditation persists
