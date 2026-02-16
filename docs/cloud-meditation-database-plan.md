# Cloud Meditation Database + User Contributions

## Context

Users' top complaint is that the app's hardcoded meditation library (~110 meditations) doesn't cover all the Dr. Joe Dispenza meditations they own. Currently, unmatched files hit a dead end. Moving the meditation catalog to Firestore enables: (1) adding new meditations without app updates, (2) users contributing missing meditations, and (3) an admin dashboard to curate the library.

---

## Phase 1: Cloud Catalog with Local Caching

**Goal:** Move meditation data to Firestore. No visible user changes — the app works exactly as before but reads from cloud/cache instead of the static file.

### Firestore Schema — Single Document

**`catalog/meditations`** — one document holds the entire catalog:
```
{
  version: number,               // bump on every edit
  updatedAt: Timestamp,
  groups: {
    [groupKey]: { groupName, displayOrder, meditationIds[] }
  },
  meditations: {
    [meditationBaseId]: {
      artist, name, groupName, formattedDuration, type (enum int),
      backgroundImageKey (string, e.g. "bec-1"),
      color?, updatedId?
    }
  }
}
```

~110 meditations x ~200 bytes = ~22 KB. Well under Firestore's 1 MB doc limit. Room to grow to 1000+.

**Cost:** 1 Firestore read per app launch. Full doc only re-fetched when version changes.

### Firestore Security Rules
```
match /catalog/{docId} {
  allow read: if request.auth != null;
  allow write: if false;  // Admin SDK only (for now)
}
```

---

### Milestone 1A: Image Registry + Catalog Service (pure additions, no behavioral change)

**Goal:** Create the new infrastructure without touching any existing files. App still runs entirely on static data.

#### Create `src/constants/meditationImageRegistry.ts`
Maps 47 unique image keys to bundled `require()` calls. Images stay bundled — no cloud image fetching in Phase 1.
```typescript
const registry: Record<string, any> = {
  'bec-1': require('../assets/bec-1.jpg'),
  'bec-2': require('../assets/bec-2.jpg'),
  // ... 47 unique entries
  'inspire-v2': require('../assets/inspire-v2.png'),
};
export const getBackgroundImage = (key?: string): any =>
  key ? registry[key] : undefined;
```

#### Create `src/services/meditationCatalog.ts`
```typescript
export async function initMeditationCatalog(): Promise<MeditationBaseMap>
  // Called once on app mount. Fetches/caches/returns the catalog.

export function getFullMeditationCatalogSync(): MeditationBaseMap
  // Synchronous access after init. Returns static fallback if init hasn't run.

// Internal helpers:
// - getCachedCatalog() / setCachedCatalog() — AsyncStorage read/write
// - fetchCatalogFromFirestore() — single doc read from catalog/meditations
// - transformToMeditationBaseMap() — Firestore shape → MeditationBaseMap
//   (resolves backgroundImageKey → require() via getBackgroundImage())
```

**Caching flow inside `initMeditationCatalog()`:**
1. Read AsyncStorage cache (`@meditation_catalog_cache`)
2. Fetch `catalog/meditations` from Firestore
3. If Firestore version > cached version → use Firestore doc, update cache
4. If Firestore fails → use cache
5. If no cache → fall back to static `meditation-data.ts`

**Verify:** New files compile. No existing behavior changes. Run `npm run lint`.

---

### Milestone 1B: Wire catalog service into App.tsx init flow

**Goal:** The app now initializes the catalog singleton on mount, but nothing reads from it yet (the 8 consumer files still import static data).

#### Modify `App.tsx` (lines 270-275)
```typescript
const setMeditationBaseDataToContext = async () => {
  await initMeditationCatalog();  // ← NEW: load catalog from cloud/cache
  const _meditationBaseData = await makeMeditationBaseData();
  if (_meditationBaseData) {
    setMeditationBaseData(_meditationBaseData);
  }
};
```

**Verify:** App launches. Console logs confirm Firestore fetch or cache hit. No visible changes.

---

### Milestone 1C: Migrate the 8 consumer files to catalog singleton

**Goal:** All files that previously `import {meditationBaseMap} from '../constants/meditation-data'` now read from the cloud-backed catalog singleton.

Mechanical swap per file:
```diff
- import {meditationBaseMap} from '../constants/meditation-data';
+ import {getFullMeditationCatalogSync} from '../services/meditationCatalog';
  // then at point of use:
+ const meditationBaseMap = getFullMeditationCatalogSync();
```

Files (in migration order, lowest risk first):
1. `src/utils/meditations/meditations.ts` — tiny file, 1 usage
2. `src/utils/meditation.ts` — core util, 3 usages (also update `makeMeditationBaseData`)
3. `src/components/SupportedMeditationsList/index.tsx` — display only
4. `src/components/MeditationList.tsx` — display only
5. `src/screens/Insight.tsx` — read only
6. `src/screens/PlaylistPreparation.tsx` — 1 usage
7. `src/screens/MeditationMatch.tsx` — full catalog search
8. `src/screens/ReassignFile.tsx` — full catalog search

**Keep** `src/constants/meditation-data.ts` — remains as offline fallback imported by the catalog service.

**Verify:** App launches, all screens render correctly, meditation cards show images, history/insights resolve, playlists work. No visual changes.

---

### Milestone 1D: Seed script + deploy to Firestore

**Goal:** The catalog document exists in Firestore so the app can actually fetch from the cloud.

#### Create `scripts/extractCatalogData.js`
- Parses `meditation-data.ts` to extract all meditation entries
- Maps each `require('../assets/X.jpg')` → `backgroundImageKey: "X"`
- Builds the `groups` structure from `groupName` fields
- Outputs `scripts/catalogData.json`

#### Create `scripts/seedMeditationCatalog.js`
- Reads `catalogData.json`
- Uses Firebase Admin SDK to write to `catalog/meditations` with `version: 1`

**Verify:**
- Run seed script against dev Firebase project
- App launches, fetches from Firestore, caches in AsyncStorage
- Second launch uses cache (no Firestore read beyond version check)
- Kill network → app uses cache
- Clear AsyncStorage + kill network → app uses static fallback
- All existing file path mappings and meditation history still work (meditationBaseIds unchanged)

---

## Phase 2: Data-Driven File Matching

**Goal:** Replace the 1200-line `filePicker.ts` switch statements with a data-driven matcher that reads matching rules from the catalog.

### Add Matching Data to Catalog Document

Extend each meditation entry:
```
matchingData: {
  knownFileSizes: number[],       // replaces size enums
  knownStringSizes: string[],     // first 5 chars of size
  fileNamePatterns: string[],     // regex patterns
  aliases: string[],              // alternative names
}
```

### New Matching Service

**Create `src/services/matchingService.ts`:**
```
1. Exact file size match → check matchingData.knownFileSizes
2. Size prefix match → check matchingData.knownStringSizes
3. Name pattern match → iterate matchingData.fileNamePatterns as RegExp
4. Fuzzy match → existing algorithm (unchanged)
```

~50 lines replaces ~1200 lines of switch statements.

### Migration Script

**Create `scripts/extractMatchingData.js`:**
- Parses ALL existing size enums and regex patterns from `filePicker.ts`
- Converts them to `matchingData` arrays per meditation
- Merges into `catalogData.json`

### Verification
- Run old and new matchers in parallel on known test files
- Verify identical results before switching

### Files Summary — Phase 2

| Action | File |
|--------|------|
| **Create** | `src/services/matchingService.ts` |
| **Create** | `scripts/extractMatchingData.js` |
| **Modify** | `src/utils/filePicker.ts` — rewrite to use matching service |
| **Modify** | `src/utils/addMeditations.tsx` — use new matching service |

---

## Phase 3: User Submission Flow

**Goal:** When files don't match, users can submit them for library inclusion instead of hitting a dead end.

### Firestore Schema — Individual Docs

**`submissions/{autoId}`** (individual docs because each is independent and queried by status):
```
fileName, fileSize, fileType,
suggestedName, suggestedGroupName,
submittedBy (uid), submitterEmail, submittedAt,
status: 'pending' | 'approved' | 'rejected' | 'duplicate',
reviewedBy?, reviewedAt?, reviewNotes?,
resolvedMeditationBaseId?
```

### UX Flow
1. User adds files → some don't match → shown on `UnrecognizedFiles` screen
2. New option: **"Submit to Library"** alongside existing flows
3. `SubmitMeditation` screen: pre-filled file name, editable meditation name, optional group dropdown
4. Submission saved to Firestore → confirmation message
5. File path stored in `pendingSubmissions` AsyncStorage so user doesn't lose access

### Existing Infrastructure
- `fbAddUnsupportedFiles()` in `src/fb/unsupportedFiles.tsx` already sends unmatched file data — submission flow enhances this
- `UnknownFileData` type in `src/types.tsx` already captures name, size, type, uri

### Files Summary — Phase 3

| Action | File |
|--------|------|
| **Create** | `src/fb/submissions.ts` |
| **Create** | `src/screens/SubmitMeditation.tsx` |
| **Modify** | `src/types.tsx` — add Submission interface |
| **Modify** | `src/screens/UnrecognizedFiles.tsx` — add "Submit to Library" button |
| **Modify** | `src/navigation/Stack.tsx` — add SubmitMeditation route |
| **Modify** | `src/utils/addMeditations.tsx` — integrate submission flow |

---

## Phase 4: Admin Web Dashboard

**Goal:** Web app for reviewing submissions, managing the catalog, and uploading cover art.

- **Tech:** Next.js + Tailwind + Firebase Admin SDK, deployed on Vercel
- **Separate repo:** `observer-admin`
- **Pages:** Submissions queue, approval flow, catalog editor
- **Auth:** Add `role: 'admin'` to existing `/users/{uid}` doc
- When admin approves a submission: add meditation to `catalog/meditations`, increment `version`, mark submission approved → all clients auto-sync on next launch

### Firestore Security Rules (Final)
```
catalog: read = authenticated, write = admin only
submissions: create = authenticated, read/update = admin only
```

---

## Verification Plan

### Phase 1
- First launch (no cache) → Firestore fetch + AsyncStorage cache write
- Second launch → no Firestore read (version matches cache)
- Kill network → cached/bundled fallback works
- All existing meditation history references still resolve (meditationBaseIds unchanged)
- All 8 migrated files render correctly

### Phase 2
- Known test files produce identical match results through old and new matchers
- Edge cases: ambiguous sizes, multiple pattern matches

### Phase 3
- Full flow: add unmatched file → submit → verify doc in `submissions` collection
- Existing "Continue" and "Skip" flows still work

### Phase 4
- End-to-end: submit in app → approve in dashboard → version bumps → app syncs → new meditation appears
