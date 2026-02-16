#!/usr/bin/env node

/**
 * Extracts meditation catalog data from meditation-data.ts
 * and outputs catalogData.json in the Firestore document shape.
 *
 * Usage: node scripts/extractCatalogData.js
 */

const fs = require('fs');
const path = require('path');

const SRC_FILE = path.join(
  __dirname,
  '../src/constants/meditation-data.ts',
);
const OUT_FILE = path.join(__dirname, 'catalogData.json');

const source = fs.readFileSync(SRC_FILE, 'utf-8');

// --- Step 1: Resolve enum values ---

// Extract all enum declarations and build a lookup: EnumName.Member -> value
const enumLookup = {};

const enumBlockRe = /export\s+enum\s+(\w+)\s*\{([^}]+)\}/g;
let enumMatch;
while ((enumMatch = enumBlockRe.exec(source)) !== null) {
  const enumName = enumMatch[1];
  const body = enumMatch[2];
  const memberRe = /(?:'(\w+)'|"(\w+)"|(\w+))\s*=\s*(?:'([^']*)'|"([^"]*)"|(\d+))/g;
  let memberMatch;
  while ((memberMatch = memberRe.exec(body)) !== null) {
    const memberName = memberMatch[1] ?? memberMatch[2] ?? memberMatch[3];
    const value = memberMatch[4] ?? memberMatch[5] ?? Number(memberMatch[6]);
    enumLookup[`${enumName}.${memberName}`] = value;
  }
}

// MeditationTypes from types.tsx: Meditation=0, Breath=1, Heart=2
enumLookup['MeditationTypes.Meditation'] = 0;
enumLookup['MeditationTypes.Breath'] = 1;
enumLookup['MeditationTypes.Heart'] = 2;

function resolveValue(raw) {
  raw = raw.trim();
  // String literal
  if (/^['"]/.test(raw)) {
    return raw.slice(1, -1);
  }
  // Number literal
  if (/^\d+$/.test(raw)) {
    return Number(raw);
  }
  // Enum reference
  if (enumLookup.hasOwnProperty(raw)) {
    return enumLookup[raw];
  }
  // Known constants
  if (raw === 'artist') return 'Dr. Joe Dispenza';
  if (raw === 'placeholder') return '';
  return raw;
}

// --- Step 2: Extract image key from require() path ---

function extractImageKey(requireStr) {
  const m = requireStr.match(/require\(['"]\.\.\/assets\/(.+?)\.[^.]+['"]\)/);
  if (m) return m[1];
  return undefined;
}

// --- Step 3: Parse each map's meditation entries ---

// Match map object blocks like: export const botecMap = { ... };
// We'll find each meditation entry using a regex that captures individual entries
const meditations = {};

// Match individual meditation entries across all maps
// Pattern: [SomeEnum.Key]: { ... }
const entryRe =
  /\[(\w+\.\w+)\]:\s*\{([^}]+)\}/g;

let entryMatch;
while ((entryMatch = entryRe.exec(source)) !== null) {
  const keyRef = entryMatch[1];
  const body = entryMatch[2];

  // Resolve the meditationBaseId from the enum key
  const meditationBaseId = resolveValue(keyRef);
  if (typeof meditationBaseId !== 'string' || !meditationBaseId) continue;

  // Parse fields from the body
  const entry = {meditationBaseId};

  // artist (handles both `artist,` shorthand and `artist: value,`)
  const artistMatch = body.match(/artist:\s*(.+?)(?:,|\n)/);
  if (artistMatch) {
    entry.artist = resolveValue(artistMatch[1]);
  } else if (/\bartist\b/.test(body)) {
    entry.artist = 'Dr. Joe Dispenza';
  }

  // backgroundImage -> backgroundImageKey
  const bgMatch = body.match(/backgroundImage:\s*(require\([^)]+\))/);
  if (bgMatch) entry.backgroundImageKey = extractImageKey(bgMatch[1]);

  // formattedDuration (allow empty string)
  const durMatch = body.match(/formattedDuration:\s*['"]([^']*)['"]/);
  if (durMatch) entry.formattedDuration = durMatch[1];

  // groupName
  const groupMatch = body.match(/groupName:\s*(\S+)/);
  if (groupMatch) entry.groupName = resolveValue(groupMatch[1].replace(/,\s*$/, ''));

  // name
  const nameMatch = body.match(/name:\s*'([^']+)'/);
  if (nameMatch) entry.name = nameMatch[1];

  // type
  const typeMatch = body.match(/type:\s*(\S+)/);
  if (typeMatch) entry.type = resolveValue(typeMatch[1].replace(/,\s*$/, ''));

  // color (optional)
  const colorMatch = body.match(/color:\s*'([^']+)'/);
  if (colorMatch) entry.color = colorMatch[1];

  // updatedId (optional)
  const updatedIdMatch = body.match(/updatedId:\s*(\S+)/);
  if (updatedIdMatch) entry.updatedId = resolveValue(updatedIdMatch[1].replace(/,\s*$/, ''));

  // Only include entries that look like real meditation data
  if (entry.name && entry.groupName && 'formattedDuration' in entry) {
    meditations[meditationBaseId] = entry;
  }
}

// --- Step 4: Build groups from groupName fields ---

const groupMap = {};
const GROUP_DISPLAY_ORDER = {
  'Blessing of the Energy Centers': 1,
  'Breaking the Habit of Being Yourself': 2,
  'Breathwork': 3,
  'Count Your Blessings': 4,
  'Daily Meditations': 5,
  'Foundational - Progressive': 6,
  'Generating Series': 7,
  'Synchronize Series': 8,
  'Unlocked Series': 9,
  'Walking': 10,
  'Other': 11,
};

for (const [id, med] of Object.entries(meditations)) {
  const gn = med.groupName;
  if (!gn) continue;

  // Use a URL-safe key
  const groupKey = gn
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  if (!groupMap[groupKey]) {
    groupMap[groupKey] = {
      groupName: gn,
      displayOrder: GROUP_DISPLAY_ORDER[gn] || 99,
      meditationIds: [],
    };
  }
  groupMap[groupKey].meditationIds.push(id);
}

// --- Step 5: Assemble the catalog document ---

const catalogDoc = {
  version: 1,
  updatedAt: new Date().toISOString(),
  groups: groupMap,
  meditations,
};

fs.writeFileSync(OUT_FILE, JSON.stringify(catalogDoc, null, 2));

const medCount = Object.keys(meditations).length;
const groupCount = Object.keys(groupMap).length;
console.log(`Extracted ${medCount} meditations in ${groupCount} groups`);
console.log(`Written to ${OUT_FILE}`);
