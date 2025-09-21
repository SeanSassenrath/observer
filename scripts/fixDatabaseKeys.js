#!/usr/bin/env node

/**
 * Fix Database Keys to Match Meditation Constants
 *
 * This script updates the database keys in realFingerprintDatabase.json to match
 * the actual BaseKeys constants used by the app.
 */

const fs = require('fs');
const path = require('path');

// Key mappings from incorrect database keys to correct constant keys
const keyMappings = {
  // Other meditations
  'other-theAlchemist': 'm-alchemist',
  'other-heartbrainSync': 'm-heart-brain-sync',
  'other-goLove': 'm-go-love',
  'other-changingBoxesMeditation': 'm-changing-boxes',
  'other-changingBoxesShort': 'm-changing-boxes-sv',
  'other-empoweringThePowerWithinMeditation': 'm-empowering-within',
  'other-02engltlylmeditation': 'm-love-life-you-love',

  // Daily meditations
  'm-daily-evening': 'm-evening',
  'm-daily-morning': 'm-morning',

  // Walking meditations
  'm-walking-12': 'm-walking-radiant-light',
  'm-walking-3': 'm-walking-stepping-into-your-future',
  'm-walking-6': 'm-walking-running',
  'm-walking-healing': 'm-walking-for-the-world',
  'walking-02engwftwmeditation': 'm-walking-for-the-world',
  'walking-changingBoxesWalking13DrJoe': 'm-changing-boxes',

  // Breath meditations
  'breath-02ReconditioningTheBodyToANewMindBreath': 'b-reconditioning',
  'breath-02TurningIntoNewPotentialsBreath': 'b-new-potentials',
  'breath-02breathtuningintonewpotentials': 'b-new-potentials',

  // Foundational meditations
  'foundational-03ReconditioningTheBodyToANewMindMeditation': 'm-recondition',
  'foundational-03TurningIntoNewPotentialsMeditation': 'm-new-potentials',
  'foundational-03meditationtuningintonewpotentials': 'm-new-potentials',
  'foundational-generousPresentMomentMeditation': 'm-present-moment',

  // Generating/Synchronize
  'generating-generatingAbundance': 'm-generating-abundance',
  'synchronize-advMedAbundance10': 'm-sync-abundance',
};

function fixDatabaseKeys() {
  const databasePath = path.join(__dirname, '../src/assets/realFingerprintDatabase.json');

  console.log('📖 Reading database file...');
  const database = JSON.parse(fs.readFileSync(databasePath, 'utf8'));

  console.log('🔧 Fixing database keys...');
  const fixedDatabase = {};
  let changesCount = 0;

  for (const [oldKey, meditation] of Object.entries(database)) {
    const newKey = keyMappings[oldKey] || oldKey;

    if (oldKey !== newKey) {
      console.log(`  🔄 ${oldKey} → ${newKey}`);
      
      // Update the meditationBaseId inside the object too
      meditation.meditationBaseId = newKey;
      changesCount++;
    }

    fixedDatabase[newKey] = meditation;
  }

  console.log(`✅ Fixed ${changesCount} keys`);

  // Create backup
  const backupPath = databasePath + '.backup.' + Date.now();
  console.log('💾 Creating backup at:', backupPath);
  fs.copyFileSync(databasePath, backupPath);

  // Write fixed database
  console.log('💾 Writing fixed database...');
  fs.writeFileSync(databasePath, JSON.stringify(fixedDatabase, null, 2), 'utf8');

  console.log('🎉 Database keys fixed successfully!');
  console.log('📊 Summary:');
  console.log(`  - Total entries: ${Object.keys(fixedDatabase).length}`);
  console.log(`  - Keys changed: ${changesCount}`);
  console.log(`  - Backup created: ${backupPath}`);
}

if (require.main === module) {
  try {
    fixDatabaseKeys();
  } catch (error) {
    console.error('❌ Error fixing database keys:', error);
    process.exit(1);
  }
}

module.exports = { fixDatabaseKeys, keyMappings };