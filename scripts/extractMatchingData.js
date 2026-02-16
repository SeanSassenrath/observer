#!/usr/bin/env node

/**
 * Extracts matching data (file sizes, string sizes, regex patterns)
 * from meditation-data.ts and filePicker.ts, then merges into catalogData.json.
 *
 * Usage: node scripts/extractMatchingData.js
 */

const fs = require('fs');
const path = require('path');

const MEDITATION_DATA_FILE = path.join(__dirname, '../src/constants/meditation-data.ts');
const FILE_PICKER_FILE = path.join(__dirname, '../src/utils/filePicker.ts');
const CATALOG_FILE = path.join(__dirname, 'catalogData.json');

const meditationSource = fs.readFileSync(MEDITATION_DATA_FILE, 'utf-8');
const filePickerSource = fs.readFileSync(FILE_PICKER_FILE, 'utf-8');

// --- Step 1: Build enum lookups from meditation-data.ts ---

function parseEnums(source) {
  const enums = {};
  const enumBlockRe = /export\s+enum\s+(\w+)\s*\{([^}]+)\}/g;
  let m;
  while ((m = enumBlockRe.exec(source)) !== null) {
    const enumName = m[1];
    const body = m[2];
    enums[enumName] = {};
    const memberRe = /(?:'(\w+)'|"(\w+)"|(\w+))\s*=\s*(?:'([^']*)'|"([^"]*)"|(\d+))/g;
    let mm;
    while ((mm = memberRe.exec(body)) !== null) {
      const memberName = mm[1] ?? mm[2] ?? mm[3];
      const value = mm[4] ?? mm[5] ?? Number(mm[6]);
      enums[enumName][memberName] = value;
    }
  }
  return enums;
}

const enums = parseEnums(meditationSource);

// --- Step 2: Parse filePicker.ts to extract size→meditationId and regex→meditationId mappings ---

// 2a: Exact size matches (if/else if blocks)
// Pattern: fileSize === EnumName.Member ... BaseKeys.MeditationId
const exactSizeToId = {};
const exactSizeRe = /fileSize\s*===\s*(\w+)\.(\w+)\)\s*\{[\s\S]*?\[(\w+)\.(\w+)\]/g;
let esm;
while ((esm = exactSizeRe.exec(filePickerSource)) !== null) {
  const sizeEnum = esm[1];
  const sizeMember = esm[2];
  const baseKeysEnum = esm[3];
  const baseKeyMember = esm[4];

  const sizeValue = enums[sizeEnum]?.[sizeMember];
  const meditationId = enums[baseKeysEnum]?.[baseKeyMember];

  if (sizeValue !== undefined && meditationId) {
    if (!exactSizeToId[meditationId]) exactSizeToId[meditationId] = [];
    exactSizeToId[meditationId].push(sizeValue);
  }
}

// 2b: String size matches (switch/case blocks)
// Pattern: case EnumName.Member: { ... [BaseKeys.MeditationId]
const stringSizeToId = {};
const switchCaseRe = /case\s+(\w+)\.(\w+):\s*\{[\s\S]*?\[(\w+)\.(\w+)\]/g;
let scm;
while ((scm = switchCaseRe.exec(filePickerSource)) !== null) {
  const sizeEnum = scm[1];
  const sizeMember = scm[2];
  const baseKeysEnum = scm[3];
  const baseKeyMember = scm[4];

  const sizeValue = enums[sizeEnum]?.[sizeMember];
  const meditationId = enums[baseKeysEnum]?.[baseKeyMember];

  if (sizeValue !== undefined && meditationId) {
    if (!stringSizeToId[meditationId]) stringSizeToId[meditationId] = [];
    if (typeof sizeValue === 'string') {
      stringSizeToId[meditationId].push(sizeValue);
    } else if (typeof sizeValue === 'number') {
      // This came from a Sizes enum (exact), not StringSizes
      if (!exactSizeToId[meditationId]) exactSizeToId[meditationId] = [];
      if (!exactSizeToId[meditationId].includes(sizeValue)) {
        exactSizeToId[meditationId].push(sizeValue);
      }
    }
  }
}

// 2c: Regex patterns from filePicker.ts
// Pattern: if (/regex/.test(fileName)) { ... [BaseKeys.MeditationId]
const regexToId = {};
const regexRe = /if\s*\((\/.+?\/[gimsuy]*)\s*\.test\(fileName\)\)\s*\{[\s\S]*?\[(\w+)\.(\w+)\]/g;
let rm;
while ((rm = regexRe.exec(filePickerSource)) !== null) {
  const regexStr = rm[1];
  const baseKeysEnum = rm[2];
  const baseKeyMember = rm[3];

  const meditationId = enums[baseKeysEnum]?.[baseKeyMember];

  if (meditationId) {
    if (!regexToId[meditationId]) regexToId[meditationId] = [];
    regexToId[meditationId].push(regexStr);
  }
}

// --- Step 3: Merge into catalogData.json ---

const catalogData = JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf-8'));

let medsWithSizes = 0;
let medsWithStringSizes = 0;
let medsWithPatterns = 0;

for (const [medId, meditation] of Object.entries(catalogData.meditations)) {
  const matchingData = {};

  // Exact file sizes
  if (exactSizeToId[medId]) {
    matchingData.knownFileSizes = [...new Set(exactSizeToId[medId])];
    medsWithSizes++;
  }

  // String sizes (first 5 chars)
  if (stringSizeToId[medId]) {
    matchingData.knownStringSizes = [...new Set(stringSizeToId[medId])];
    medsWithStringSizes++;
  }

  // Regex patterns
  if (regexToId[medId]) {
    matchingData.fileNamePatterns = regexToId[medId];
    medsWithPatterns++;
  }

  if (Object.keys(matchingData).length > 0) {
    meditation.matchingData = matchingData;
  }
}

// Bump version
catalogData.version = 2;
catalogData.updatedAt = new Date().toISOString();

fs.writeFileSync(CATALOG_FILE, JSON.stringify(catalogData, null, 2));

console.log(`Matching data merged into catalogData.json (version ${catalogData.version})`);
console.log(`  ${medsWithSizes} meditations with exact file sizes`);
console.log(`  ${medsWithStringSizes} meditations with string sizes`);
console.log(`  ${medsWithPatterns} meditations with filename patterns`);

// Summary: which meditations have NO matching data at all?
const noMatch = Object.entries(catalogData.meditations)
  .filter(([, m]) => !m.matchingData)
  .map(([id]) => id);
console.log(`  ${noMatch.length} meditations with NO matching data: ${noMatch.join(', ')}`);
