/**
 * Meditation File Mapping
 * 
 * Maps meditation filenames to their correct base keys used in the app.
 * This ensures the development script generates fingerprints for the right meditations.
 */

// Common filename patterns and their corresponding base keys
const FILENAME_PATTERNS = {
  // Blessing of Energy Centers (BOTEC) - Updated patterns for your files
  'blessing.*energy.*center.*1': 'm-botec-1',
  'blessing.*energy.*center.*2': 'm-botec-2', 
  'blessing.*energy.*center.*3': 'm-botec-3',
  'blessing.*energy.*center.*4': 'm-botec-4',
  'blessing.*energy.*center.*5': 'm-botec-5',
  'blessing.*energy.*center.*6': 'm-botec-6',
  'blessing.*energy.*center.*7': 'm-botec-7',
  'blessing.*energy.*center.*8': 'm-botec-8',
  'blessing.*energy.*center.*9': 'm-botec-9',
  'blessing.*energy.*center.*10': 'm-botec-10',
  
  // BOTEC numeric patterns
  'botec.*1$': 'm-botec-1',
  'botec.*2$': 'm-botec-2',
  'botec.*3$': 'm-botec-3',
  'botec.*4$': 'm-botec-4',
  'botec.*5$': 'm-botec-5',
  'botec.*6$': 'm-botec-6',
  'botec.*7$': 'm-botec-7',
  'botec.*8$': 'm-botec-8',
  'botec.*9$': 'm-botec-9',
  'botec.*10$': 'm-botec-10',
  
  // Your specific BEC file patterns
  '1.*bec.*i.*meditation': 'm-botec-1',
  '2.*bec.*ii.*meditation': 'm-botec-2',
  '3.*bec.*iii.*meditation': 'm-botec-3',
  '4.*bec.*iv.*meditation': 'm-botec-4',
  '5.*bec.*v.*connecting': 'm-botec-5',
  '6.*bec.*vi.*activation': 'm-botec-6',
  '7.*bec.*vii.*lyingdown': 'm-botec-7',
  '8.*bec.*viii.*harmonize': 'm-botec-8',
  '9.*bec.*ix.*bodyelectric': 'm-botec-9',
  
  // Updated versions
  'm-botec-3-updated': 'm-botec-3-updated',

  // Daily Meditations
  'daily.*meditation.*morning': 'm-daily-morning',
  'daily.*meditation.*evening': 'm-daily-evening',
  'morning.*meditation': 'm-daily-morning',
  'evening.*meditation': 'm-daily-evening',

  // Walking Meditations - General patterns
  'walking.*meditation.*1': 'm-walking-1',
  'walking.*meditation.*2': 'm-walking-2',
  'walking.*meditation.*3': 'm-walking-3',
  'walking.*meditation.*4': 'm-walking-4',
  'walking.*meditation.*5': 'm-walking-5',
  'walking.*meditation.*6': 'm-walking-6',
  'walking.*meditation.*7': 'm-walking-7',
  'walking.*meditation.*8': 'm-walking-8',
  'walking.*meditation.*9': 'm-walking-9',
  'walking.*meditation.*10': 'm-walking-10',
  'walking.*meditation.*11': 'm-walking-11',
  'walking.*meditation.*12': 'm-walking-12',
  
  // Specific Walking Meditation patterns from your files
  'walking.*meditation.*conditioning.*body': 'm-walking-conditioning',
  'walking.*meditation.*prayer.*evocation': 'm-walking-prayer',
  'walking.*meditation.*noble.*walk': 'm-walking-noble',
  'walking.*meditation.*unlocking.*code': 'm-walking-unlocking',
  'walking.*meditation.*ii': 'm-walking-2',
  'wm12.*walking.*radiant.*light': 'm-walking-12',
  'healing.*meditation.*walking': 'm-walking-healing',

  // Breathwork
  'breath.*track.*1': 'm-breath-1',
  'breath.*track.*2': 'm-breath-2', 
  'breath.*track.*3': 'm-breath-3',
  'breath.*track.*4': 'm-breath-4',
  'breath.*track.*5': 'm-breath-5',
  'breath.*track.*6': 'm-breath-6',
  'breath.*track.*7': 'm-breath-7',
  'breath.*track.*8': 'm-breath-8',
  'breath.*track.*9': 'm-breath-9',
  'breath.*track.*10': 'm-breath-10',
  'breath.*track.*11': 'm-breath-11',
  'breath.*track.*12': 'm-breath-12',

  // Breaking Habit
  'breaking.*habit.*being.*yourself': 'm-breaking-habit-1',
  'changing.*beliefs.*perceptions': 'm-changing-beliefs-perceptions',

  // Generating Series - Updated for your files
  'generate.*elevated.*emotions': 'm-generating-elevated-emotions',
  'generate.*joy': 'm-generating-joy',
  'generate.*gratitude': 'm-generating-gratitude',
  'generate.*empowerment': 'm-generating-empowerment',
  'generating.*change.*meditation': 'm-generating-change',
  'generating.*flow': 'm-generating-flow',
  'generating.*inspiration': 'm-generating-inspiration',
  'generating.*abundance.*meditation': 'm-generating-abundance',
  'generating.*abundance$': 'm-generating-abundance-short',

  // Synchronize Series
  'sync.*energy.*health': 'm-sync-health',
  'sync.*energy.*abundance': 'm-sync-abundance', 
  'sync.*energy.*love': 'm-sync-love',
};

/**
 * Map filename to meditation base key using pattern matching
 */
function mapFilenameToBaseKey(filename, groupDir) {
  const cleanFilename = filename.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ') // Replace special chars with spaces
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();

  console.log(`   🔍 Mapping "${filename}" → `, cleanFilename);

  // Check for "updated" versions first
  if (cleanFilename.includes('updated')) {
    console.log(`   🔄 Detected "updated" version in filename`);
    
    // Try to find matching pattern for updated version
    for (const [pattern, baseKey] of Object.entries(FILENAME_PATTERNS)) {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(cleanFilename)) {
        // Check if we have an updated version mapped
        const updatedBaseKey = baseKey + '-updated';
        if (hasUpdatedVersionInPatterns(updatedBaseKey)) {
          console.log(`   ✅ Matched updated pattern "${pattern}" → ${updatedBaseKey}`);
          return updatedBaseKey;
        } else {
          console.log(`   ❌ UNMAPPED UPDATED VERSION: "${filename}"`);
          console.log(`   📝 Base meditation "${baseKey}" found, but no updated version mapped`);
          console.log(`   💡 Add "${updatedBaseKey}" to meditation-data.ts and mapping patterns`);
          return null; // Skip this file
        }
      }
    }
    
    console.log(`   ❌ UNMAPPED UPDATED VERSION: "${filename}"`);
    console.log(`   📝 No base meditation pattern found for this updated version`);
    console.log(`   💡 Add both base and updated versions to meditation-data.ts and mapping patterns`);
    return null; // Skip this file
  }

  // Try to find matching pattern for regular versions
  for (const [pattern, baseKey] of Object.entries(FILENAME_PATTERNS)) {
    const regex = new RegExp(pattern, 'i');
    if (regex.test(cleanFilename)) {
      console.log(`   ✅ Matched pattern "${pattern}" → ${baseKey}`);
      return baseKey;
    }
  }

  // Fallback: create base key from filename (same as before)
  console.log(`   ⚠️ No pattern match, generating key from filename`);
  const cleanName = filename
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special chars
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
  
  const baseKey = cleanName
    .split(' ')
    .map((word, index) => 
      index === 0 ? word.toLowerCase() : 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
  
  return `${groupDir}-${baseKey}`;
}

/**
 * Check if updated version exists in patterns
 */
function hasUpdatedVersionInPatterns(updatedBaseKey) {
  // Always allow updated versions for known base keys
  const baseKey = updatedBaseKey.replace('-updated', '');
  const hasBase = Object.values(FILENAME_PATTERNS).includes(baseKey);
  const hasUpdated = Object.values(FILENAME_PATTERNS).includes(updatedBaseKey);
  
  return hasBase || hasUpdated;
}

/**
 * Load existing meditation data to validate base keys
 */
function loadExistingMeditationKeys() {
  try {
    // This would import the meditation data constants
    // For now, return empty object - the script will generate keys
    return {};
  } catch (error) {
    console.warn('Could not load existing meditation keys:', error.message);
    return {};
  }
}

/**
 * Validate base key against known meditation library
 */
function validateBaseKey(baseKey, filename) {
  const existingKeys = loadExistingMeditationKeys();
  
  if (existingKeys[baseKey]) {
    console.log(`   ✅ Validated base key: ${baseKey}`);
    return true;
  } else {
    console.log(`   ⚠️ New base key (not in existing library): ${baseKey}`);
    return false;
  }
}

module.exports = {
  mapFilenameToBaseKey,
  validateBaseKey,
  FILENAME_PATTERNS,
};